package xyz.suixing.toolbox;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.net.http.SslError;
import android.os.Build;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.WindowInsets;
import android.webkit.CookieManager;
import android.webkit.SslErrorHandler;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.PopupMenu;
import android.widget.ProgressBar;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.ArrayList;
import java.util.List;
import java.io.InputStream;
import java.io.ByteArrayOutputStream;
import org.json.JSONArray;
import org.json.JSONObject;

public final class MainActivity extends Activity {
    private static final String ORIGIN = "https://home.1008086.xyz";
    private static final class Service {
        final String id, name, url, group, description;
        Service(JSONObject value) throws Exception {
            id = value.getString("id"); name = value.getString("name"); url = value.getString("url");
            group = value.getString("group"); description = value.getString("description");
        }
    }
    private final List<Service> services = new ArrayList<>();
    private final Set<String> allowedHosts = new HashSet<>();
    private static final int FILE_REQUEST = 21;
    private final Map<Integer, String> pages = new HashMap<>();
    private final Set<WebView> pendingPopups = new HashSet<>();
    private WebView web;
    private ProgressBar progress;
    private LinearLayout errorPanel;
    private TextView title;
    private Button back;
    private int selected;
    private boolean loadFailed;
    private ValueCallback<Uri[]> fileCallback;

    private int dp(int value) { return Math.round(value * getResources().getDisplayMetrics().density); }
    private boolean internal(String value) {
        if (value == null) return false;
        Uri uri = Uri.parse(value);
        return "https".equalsIgnoreCase(uri.getScheme()) && uri.getHost() != null && allowedHosts.contains(uri.getHost().toLowerCase(java.util.Locale.ROOT))
            && (uri.getPort() == -1 || uri.getPort() == 443) && uri.getUserInfo() == null;
    }
    private boolean https(String value) {
        if (value == null) return false;
        Uri uri = Uri.parse(value);
        return "https".equalsIgnoreCase(uri.getScheme()) && uri.getHost() != null && uri.getUserInfo() == null;
    }
    private void message(String value) { Toast.makeText(this, value, Toast.LENGTH_SHORT).show(); }
    private void loadServices() throws Exception {
        try (InputStream input = getAssets().open("services.json"); ByteArrayOutputStream bytes = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096]; int length;
            while ((length = input.read(buffer)) != -1) bytes.write(buffer, 0, length);
            JSONObject config = new JSONObject(bytes.toString("UTF-8")); JSONArray entries = config.getJSONArray("services");
            for (int i = 0; i < entries.length(); i++) {
                Service service = new Service(entries.getJSONObject(i)); services.add(service);
                allowedHosts.add(Uri.parse(service.url).getHost().toLowerCase(java.util.Locale.ROOT));
            }
            JSONArray aliases = config.getJSONArray("aliases");
            for (int i = 0; i < aliases.length(); i++) allowedHosts.add(Uri.parse(aliases.getString(i)).getHost().toLowerCase(java.util.Locale.ROOT));
            if (services.isEmpty()) throw new Exception("empty services");
        }
    }
    private Button button(String text, String description) {
        Button button = new Button(this);
        button.setText(text); button.setTextSize(14); button.setAllCaps(false);
        button.setMinWidth(dp(48)); button.setMinimumWidth(dp(48));
        button.setMinHeight(dp(48)); button.setMinimumHeight(dp(48));
        button.setPadding(dp(8), 0, dp(8), 0); button.setContentDescription(description);
        button.setBackground(new android.graphics.drawable.RippleDrawable(
            android.content.res.ColorStateList.valueOf(Color.rgb(220,234,243)),
            new android.graphics.drawable.ColorDrawable(Color.TRANSPARENT), null));
        button.setStateListAnimator(null); button.setElevation(0);
        return button;
    }
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        try { loadServices(); } catch (Exception failure) { message("工具目录读取失败，请重新安装客户端"); finish(); return; }
        getWindow().setStatusBarColor(Color.WHITE);
        getWindow().setNavigationBarColor(Color.WHITE);
        getWindow().getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR | View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR);
        LinearLayout root = new LinearLayout(this); root.setOrientation(LinearLayout.VERTICAL); root.setBackgroundColor(Color.WHITE);
        root.setOnApplyWindowInsetsListener((view, insets) -> {
            if (Build.VERSION.SDK_INT >= 30) {
                android.graphics.Insets bars = insets.getInsets(WindowInsets.Type.systemBars() | WindowInsets.Type.displayCutout() | WindowInsets.Type.ime());
                view.setPadding(bars.left, bars.top, bars.right, bars.bottom);
            } else view.setPadding(insets.getSystemWindowInsetLeft(), insets.getSystemWindowInsetTop(), insets.getSystemWindowInsetRight(), insets.getSystemWindowInsetBottom());
            return insets;
        });
        LinearLayout toolbar = new LinearLayout(this); toolbar.setGravity(Gravity.CENTER_VERTICAL);
        back = button("‹", "返回上一页"); back.setTextSize(26); back.setOnClickListener(v -> goBack());
        toolbar.addView(back, new LinearLayout.LayoutParams(dp(48), dp(52)));
        title = new TextView(this); title.setTextSize(16); title.setTextColor(Color.rgb(28,39,51)); title.setSingleLine(true);
        toolbar.addView(title, new LinearLayout.LayoutParams(0, -2, 1));
        Button reload = button("↻", "刷新页面"); reload.setTextSize(23); reload.setOnClickListener(v -> { resetError(); web.reload(); });
        toolbar.addView(reload, new LinearLayout.LayoutParams(dp(48), dp(52)));
        Button more = button("⋮", "更多操作"); more.setTextSize(24); more.setOnClickListener(this::showMenu);
        toolbar.addView(more, new LinearLayout.LayoutParams(dp(48), dp(52)));
        root.addView(toolbar);
        progress = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal); progress.setMax(100);
        root.addView(progress, new LinearLayout.LayoutParams(-1, dp(2)));
        FrameLayout content = new FrameLayout(this);
        web = new WebView(this); configure(web); content.addView(web, new FrameLayout.LayoutParams(-1, -1));
        errorPanel = new LinearLayout(this); errorPanel.setOrientation(LinearLayout.VERTICAL); errorPanel.setGravity(Gravity.CENTER);
        errorPanel.setBackgroundColor(Color.WHITE); errorPanel.setPadding(dp(24), dp(24), dp(24), dp(24));
        TextView errorText = new TextView(this); errorText.setText("页面暂时无法连接\n请检查网络后重试"); errorText.setTextSize(16); errorText.setGravity(Gravity.CENTER);
        errorPanel.addView(errorText);
        Button retry = button("重新连接", "重新连接"); retry.setOnClickListener(v -> { resetError(); web.reload(); }); errorPanel.addView(retry);
        errorPanel.setVisibility(View.GONE); content.addView(errorPanel, new FrameLayout.LayoutParams(-1,-1));
        root.addView(content, new LinearLayout.LayoutParams(-1, 0, 1));
        LinearLayout navigation = new LinearLayout(this);
        Button all = button("全部工具", "全部工具"); all.setTextColor(Color.rgb(0,124,175)); all.setOnClickListener(v -> showTools());
        navigation.addView(all, new LinearLayout.LayoutParams(0, dp(54), 1));
        Button home = button("工具首页", "工具首页"); home.setOnClickListener(v -> navigate(selected, services.get(selected).url));
        navigation.addView(home, new LinearLayout.LayoutParams(0, dp(54), 1));
        Button invite = button("专属链接", "专属链接"); invite.setOnClickListener(v -> invitation());
        navigation.addView(invite, new LinearLayout.LayoutParams(0, dp(54), 1));
        root.addView(navigation); setContentView(root);
        // 兼容首版的编号设置，后续使用稳定 ID，目录调整不会切换到错误工具。
        selected = getPreferences(MODE_PRIVATE).getInt("service", 0);
        String last = getPreferences(MODE_PRIVATE).getString("serviceId", null);
        if (last == null) last = selected == 1 ? "puzzle" : selected == 2 ? "starbucks" : "mobile";
        selected = 0;
        for (int i = 0; i < services.size(); i++) if (services.get(i).id.equals(last)) selected = i;
        // 不把凭证 URL 写入 Activity 状态或备份，进程重启后依靠站点 Cookie 恢复登录。
        navigate(selected, null);
    }
    private void configure(WebView target) {
        WebSettings settings = target.getSettings();
        settings.setJavaScriptEnabled(true); settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false); settings.setAllowContentAccess(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        settings.setGeolocationEnabled(false); settings.setSafeBrowsingEnabled(true);
        settings.setSupportMultipleWindows(true); settings.setJavaScriptCanOpenWindowsAutomatically(true);
        settings.setBuiltInZoomControls(false); settings.setDisplayZoomControls(false);
        settings.setMediaPlaybackRequiresUserGesture(true);
        CookieManager.getInstance().setAcceptCookie(true);
        CookieManager.getInstance().setAcceptThirdPartyCookies(target, false);
        target.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                if (internal(url)) return false;
                if (request.isForMainFrame()) external(url);
                return true;
            }
            @Override public void onPageStarted(WebView view, String url, android.graphics.Bitmap icon) { resetError(); progress.setVisibility(View.VISIBLE); }
            @Override public void onPageFinished(WebView view, String url) {
                progress.setVisibility(View.INVISIBLE); back.setEnabled(web.canGoBack()); CookieManager.getInstance().flush();
                if (!loadFailed) errorPanel.setVisibility(View.GONE);
            }
            @Override public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) { loadFailed = true; errorPanel.setVisibility(View.VISIBLE); progress.setVisibility(View.INVISIBLE); }
            }
            @Override public void onReceivedHttpError(WebView view, WebResourceRequest request, android.webkit.WebResourceResponse response) {
                if (request.isForMainFrame() && response.getStatusCode() >= 400) { loadFailed = true; errorPanel.setVisibility(View.VISIBLE); }
            }
            @Override public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) {
                handler.cancel(); loadFailed = true; errorPanel.setVisibility(View.VISIBLE);
            }
            @Override public boolean onRenderProcessGone(WebView view, android.webkit.RenderProcessGoneDetail detail) {
                message("页面已停止运行，请重新打开应用"); finish(); return true;
            }
        });
        target.setWebChromeClient(new WebChromeClient() {
            @Override public void onProgressChanged(WebView view, int value) { progress.setProgress(value); }
            @Override public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT); intent.addCategory(Intent.CATEGORY_OPENABLE); intent.setType("*/*");
                intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE);
                try { startActivityForResult(intent, FILE_REQUEST); } catch (Exception failure) { callback.onReceiveValue(null); fileCallback = null; message("无法打开文件选择器"); }
                return true;
            }
            @Override public boolean onCreateWindow(WebView view, boolean isDialog, boolean userGesture, android.os.Message result) {
                if (!internal(view.getUrl()) || pendingPopups.size() >= 4) return false;
                WebView popup = new WebView(MainActivity.this);
                pendingPopups.add(popup);
                popup.getSettings().setJavaScriptEnabled(true);
                popup.getSettings().setAllowFileAccess(false); popup.getSettings().setAllowContentAccess(false);
                popup.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
                popup.setWebViewClient(new WebViewClient() {
                    private boolean handled;
                    private boolean handle(String url) {
                        if ("about:blank".equals(url)) return false;
                        if (handled) return true;
                        handled = true;
                        if (internal(url)) web.loadUrl(url); else external(url);
                        popup.post(() -> closePopup(popup)); return true;
                    }
                    @Override public boolean shouldOverrideUrlLoading(WebView child, WebResourceRequest request) { return handle(request.getUrl().toString()); }
                    @Override public void onPageStarted(WebView child, String url, android.graphics.Bitmap icon) { handle(url); }
                    @Override public void onReceivedSslError(WebView view, SslErrorHandler handler, SslError error) { handler.cancel(); }
                });
                popup.setWebChromeClient(new WebChromeClient() {
                    @Override public void onCloseWindow(WebView window) { window.post(() -> closePopup(window)); }
                });
                ((WebView.WebViewTransport)result.obj).setWebView(popup); result.sendToTarget(); return true;
            }
            @Override public void onPermissionRequest(android.webkit.PermissionRequest request) { request.deny(); }
        });
        target.setDownloadListener((url, agent, disposition, mime, length) -> {
            if (https(url)) external(url); else message("此文件请使用右上角菜单在浏览器中下载");
        });
    }
    private void closePopup(WebView popup) {
        if (pendingPopups.remove(popup)) { popup.stopLoading(); popup.destroy(); }
    }
    private void resetError() { loadFailed = false; if (errorPanel != null) errorPanel.setVisibility(View.GONE); }
    private void navigate(int index, String url) {
        if (web.getUrl() != null && internal(web.getUrl())) pages.put(selected, web.getUrl());
        selected = index; Service service = services.get(index); title.setText(service.name); resetError();
        getPreferences(MODE_PRIVATE).edit().putString("serviceId", service.id).apply();
        web.loadUrl(url == null ? pages.getOrDefault(index, service.url) : url);
    }
    private void showTools() {
        LinearLayout panel = new LinearLayout(this); panel.setOrientation(LinearLayout.VERTICAL); panel.setPadding(dp(12), 0, dp(12), 0);
        EditText search = new EditText(this); search.setSingleLine(true); search.setHint("搜索工具"); search.setContentDescription("搜索工具");
        search.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_EXTRACT_UI | android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN | android.view.inputmethod.EditorInfo.IME_ACTION_DONE);
        search.setOnEditorActionListener((view, action, event) -> {
            if (action != android.view.inputmethod.EditorInfo.IME_ACTION_DONE) return false;
            ((android.view.inputmethod.InputMethodManager)getSystemService(INPUT_METHOD_SERVICE)).hideSoftInputFromWindow(search.getWindowToken(), 0);
            return true;
        });
        panel.addView(search, new LinearLayout.LayoutParams(-1, dp(52)));
        ScrollView scroll = new ScrollView(this); LinearLayout list = new LinearLayout(this); list.setOrientation(LinearLayout.VERTICAL);
        scroll.addView(list); panel.addView(scroll, new LinearLayout.LayoutParams(-1, 0, 1));
        // 关闭操作放在顶部，横屏输入法占据下半屏时依然可以退出选择器。
        LinearLayout heading = new LinearLayout(this); heading.setGravity(Gravity.CENTER_VERTICAL); heading.setPadding(dp(20), dp(4), dp(8), 0);
        TextView caption = new TextView(this); caption.setText("全部工具 · " + services.size()); caption.setTextSize(18); caption.setTextColor(Color.rgb(28,39,51));
        heading.addView(caption, new LinearLayout.LayoutParams(0, dp(48), 1));
        Button close = button("关闭", "关闭"); heading.addView(close, new LinearLayout.LayoutParams(-2, dp(48)));
        AlertDialog dialog = new AlertDialog.Builder(this).setCustomTitle(heading).setView(panel).create();
        close.setOnClickListener(v -> dialog.dismiss());
        Runnable render = () -> {
            list.removeAllViews(); String query = search.getText().toString().trim().toLowerCase(java.util.Locale.ROOT); String previousGroup = "";
            for (int i = 0; i < services.size(); i++) {
                final int index = i; Service service = services.get(i);
                if (!(service.name + service.description + service.group + service.url).toLowerCase(java.util.Locale.ROOT).contains(query)) continue;
                if (!service.group.equals(previousGroup)) {
                    TextView group = new TextView(this); group.setText(service.group); group.setTextSize(12); group.setPadding(dp(8), dp(16), 0, dp(4)); list.addView(group); previousGroup = service.group;
                }
                Button entry = button((index == selected ? "✓ " : "") + service.name + "\n" + service.description, service.name);
                entry.setGravity(Gravity.START | Gravity.CENTER_VERTICAL); entry.setTextSize(13); entry.setSingleLine(false); entry.setPadding(dp(8), dp(10), dp(8), dp(10));
                if (index == selected) entry.setTextColor(Color.rgb(0,124,175));
                entry.setOnClickListener(v -> { dialog.dismiss(); navigate(index, null); }); list.addView(entry, new LinearLayout.LayoutParams(-1, -2));
            }
            if (list.getChildCount() == 0) { TextView empty = new TextView(this); empty.setText("未找到匹配的工具"); empty.setPadding(dp(8), dp(24), 0, dp(24)); list.addView(empty); }
        };
        search.addTextChangedListener(new android.text.TextWatcher() {
            public void beforeTextChanged(CharSequence s, int start, int count, int after) {}
            public void onTextChanged(CharSequence s, int start, int before, int count) { render.run(); }
            public void afterTextChanged(android.text.Editable value) {}
        });
        dialog.show();
        dialog.getWindow().setSoftInputMode(android.view.WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE | android.view.WindowManager.LayoutParams.SOFT_INPUT_STATE_ALWAYS_HIDDEN);
        dialog.getWindow().setLayout(android.view.WindowManager.LayoutParams.MATCH_PARENT, Math.round(getResources().getDisplayMetrics().heightPixels * 0.82f));
        render.run();
    }
    private void external(String url) {
        if (!https(url)) { message("已阻止不受支持的链接"); return; }
        try { startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)).addCategory(Intent.CATEGORY_BROWSABLE)); }
        catch (Exception failure) { message("没有可打开此链接的浏览器"); }
    }
    private void goBack() {
        if (web.canGoBack()) { resetError(); web.goBack(); }
        else new AlertDialog.Builder(this).setMessage("退出随行工具箱？").setNegativeButton("取消", null).setPositiveButton("退出", (d,w) -> finish()).show();
    }
    @Override public void onBackPressed() { goBack(); }
    private void showMenu(View anchor) {
        PopupMenu menu = new PopupMenu(this, anchor);
        menu.getMenu().add(0,1,0,"使用专属链接"); menu.getMenu().add(0,2,1,"浏览器打开");
        menu.getMenu().add(0,3,2,"返回当前工具首页"); menu.getMenu().add(0,4,3,"清除登录数据"); menu.getMenu().add(0,5,4,"关于与隐私");
        menu.setOnMenuItemClickListener(item -> {
            switch(item.getItemId()) {
                case 1: invitation(); break;
                case 2: external(web.getUrl()); break;
                case 3: pages.remove(selected); navigate(selected, services.get(selected).url); break;
                case 4: new AlertDialog.Builder(this).setMessage("清除本机各工具的登录数据？服务端账号与任务不会删除。")
                    .setNegativeButton("取消", null).setPositiveButton("清除并退出登录", (d,w) -> {
                        web.stopLoading(); web.loadUrl("about:blank");
                        android.webkit.WebStorage.getInstance().deleteAllData(); web.clearCache(true); pages.clear();
                        CookieManager.getInstance().removeAllCookies(done -> { CookieManager.getInstance().flush(); navigate(0, services.get(0).url); web.clearHistory(); });
                    }).show(); break;
                case 5: new AlertDialog.Builder(this).setTitle("随行工具箱 0.2.0").setMessage("已集成 " + services.size() + " 个工具入口。\n\n客户端使用各站点现有账号与权限，各域名保持各自登录状态。登录数据保存在应用专属存储中，不包含预置账号。服务端任务继续由服务器执行。清除登录可删除本机站点数据。\n\n如需移除服务端账号，请使用对应服务的账号管理功能。").setPositiveButton("知道了", null).show(); break;
            }
            return true;
        }); menu.show();
    }
    private void invitation() {
        EditText input = new EditText(this); input.setSingleLine(true); input.setHint("粘贴专属链接或输入邀请码");
        input.setInputType(android.text.InputType.TYPE_CLASS_TEXT | android.text.InputType.TYPE_TEXT_VARIATION_URI);
        input.setImeOptions(android.view.inputmethod.EditorInfo.IME_FLAG_NO_EXTRACT_UI | android.view.inputmethod.EditorInfo.IME_FLAG_NO_FULLSCREEN | android.view.inputmethod.EditorInfo.IME_ACTION_DONE);
        input.setPadding(dp(20), dp(12), dp(20), dp(12));
        AlertDialog dialog = new AlertDialog.Builder(this).setTitle("使用专属链接").setView(input).setNegativeButton("取消", null).setPositiveButton("打开并登录", null).create();
        dialog.setOnShowListener(d -> dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener(v -> {
            String value = input.getText().toString().trim(); String code = value;
            if (value.startsWith("http")) {
                Uri uri = Uri.parse(value); String route = uri.getPath();
                if (!internal(value) || !"home.1008086.xyz".equalsIgnoreCase(uri.getHost()) || !("/public".equals(route) || "/app/cmcc-public".equals(route) || "/app/cmcc-public/".equals(route) || "/app/cmcc-public/public".equals(route))) { input.setError("请使用本站的 HTTPS 专属链接"); return; }
                code = uri.getQueryParameter("link");
            }
            if (code == null || !code.matches("[a-zA-Z0-9_-]{6,128}")) { input.setError("请输入有效的专属链接或邀请码"); return; }
            navigate(0, ORIGIN + "/public?link=" + Uri.encode(code)); dialog.dismiss();
        })); dialog.show();
    }
    @Override protected void onActivityResult(int request, int result, Intent data) {
        super.onActivityResult(request, result, data);
        if (request == FILE_REQUEST && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(result, data)); fileCallback = null;
        }
    }
    @Override protected void onPause() { super.onPause(); if (web != null) { web.onPause(); CookieManager.getInstance().flush(); } }
    @Override protected void onResume() { super.onResume(); if (web != null) web.onResume(); }
    @Override protected void onDestroy() {
        if (fileCallback != null) { fileCallback.onReceiveValue(null); fileCallback = null; }
        for (WebView popup : pendingPopups.toArray(new WebView[0])) closePopup(popup);
        if (web != null) { web.stopLoading(); web.destroy(); }
        super.onDestroy();
    }
}
