package com.qqt;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

public class Worker {
    private static final String REFERER_PAGE = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdrNormal.html";
    private static final String XINGDONG_REFERER_PAGE = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/res/wap/xdractivity.html?sspId=75442";
    private static final String INFO_URL = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/queryVipLevel.do";
    private static final String CLAIM_URL = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/normal/initNormalNewQy?mcyp";
    private static final String XINGDONG_CLAIM_URL = "https://qqt.cmicrwx.cn/2016tyjf/xhmqqthy/member/func/initQyStatus.do";
    private static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final HttpClient HTTP_CLIENT = HttpClient.newBuilder()
        .connectTimeout(Duration.ofSeconds(10))
        .version(HttpClient.Version.HTTP_1_1)
        .build();

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class Config {
        @JsonProperty("cookies_text") String cookiesText;
        @JsonProperty("accounts") List<AccountConfig> accounts;
        @JsonProperty("run_mode") String runMode;
        @JsonProperty("max_workers") int maxWorkers;
        @JsonProperty("jitter_ms") int jitterMs;
        @JsonProperty("poll_times") int pollTimes;
        @JsonProperty("poll_interval_ms") int pollIntervalMs;
        @JsonProperty("start_delay_ms") int startDelayMs;
        @JsonProperty("is_random") String isRandom;
        @JsonProperty("source") String source;
        @JsonProperty("receive_phone") String receivePhone;
        @JsonProperty("channel_code") String channelCode;
        @JsonProperty("product_id") String productId;
        @JsonProperty("activity_type") String activityType;
        @JsonProperty("xingdong_slot") String xingdongSlot;
        @JsonProperty("xingdong_product_id") String xingdongProductId;
        @JsonProperty("daily_xingdong_product_id") String dailyXingdongProductId;
        @JsonProperty("per_account_delay_ms") int perAccountDelayMs;
        @JsonProperty("accounts_per_poll") int accountsPerPoll;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    static class AccountConfig {
        @JsonProperty("cookie") String cookie;
        @JsonProperty("receive_phone") String receivePhone;
        @JsonProperty("phone") String phone;
        @JsonProperty("display_phone") String displayPhone;
    }

    static class RttStats {
        private final List<Double> values = new ArrayList<>();

        synchronized void add(double ms) {
            if (ms <= 0) return;
            values.add(ms);
        }

        synchronized List<Double> snapshot() {
            return new ArrayList<>(values);
        }
    }

    public static void main(String[] args) {
        if (args.length < 1) {
            System.out.println("Usage: java -jar worker.jar <config_json>");
            return;
        }

        try {
            Config cfg = MAPPER.readValue(args[0], Config.class);
            List<AccountConfig> accounts = parseAccounts(cfg);
            if (accounts.isEmpty()) {
                System.out.println("No accounts provided");
                return;
            }

            if (cfg.productId == null || cfg.productId.isEmpty()) {
                cfg.productId = "3566";
            }
            if (cfg.activityType == null || cfg.activityType.isEmpty()) {
                cfg.activityType = "normal";
            }
            if (cfg.xingdongSlot == null || cfg.xingdongSlot.isEmpty()) {
                cfg.xingdongSlot = "all";
            }
            if ("xingdong".equals(cfg.activityType)) {
                resolveXingdongRuntime(cfg);
            }

            if (cfg.startDelayMs > 0) {
                System.out.printf("[%s] [JAVA-WORKER] 等待 %dms 后启动...%n", now(), cfg.startDelayMs);
                Thread.sleep(cfg.startDelayMs);
            }

            RttStats stats = new RttStats();
            System.out.printf("[%s] [JAVA-WORKER] 开始执行，账号数: %d, 轮询: %d, activity=%s, slot=%s%n",
                    now(), accounts.size(), cfg.pollTimes, cfg.activityType, cfg.xingdongSlot);

            runPoll(accounts, cfg, stats);

            List<Double> rtts = stats.snapshot();
            if (rtts.isEmpty()) {
                System.out.printf("[%s] [JAVA-WORKER] RTT统计: 无数据。%n", now());
            } else {
                rtts.sort(Double::compareTo);
                int count = rtts.size();
                double total = 0;
                for (double v : rtts) total += v;
                double avg = total / count;
                double min = rtts.get(0);
                double max = rtts.get(count - 1);
                int idx = (int) Math.ceil(0.95 * count) - 1;
                if (idx < 0) idx = 0;
                double p95 = rtts.get(idx);
                System.out.printf("[%s] [JAVA-WORKER] RTT统计: count=%d avg=%.1fms min=%.1fms max=%.1fms p95=%.1fms%n",
                        now(), count, avg, min, max, p95);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static int effectiveAccountsPerPoll(int total, int configured) {
        if (total <= 0) return 0;
        if (configured <= 0 || configured >= total) return total;
        return configured;
    }

    private static List<AccountConfig> selectAccountsForPoll(List<AccountConfig> all, int pollIndex, int accountsPerPoll) {
        int total = all.size();
        if (total == 0) return List.of();
        int limit = effectiveAccountsPerPoll(total, accountsPerPoll);
        if (limit >= total) return all;
        int start = ((pollIndex - 1) * limit) % total;
        List<AccountConfig> chunk = new ArrayList<>(limit);
        for (int j = 0; j < limit; j++) {
            chunk.add(all.get((start + j) % total));
        }
        return chunk;
    }

    private static void runPoll(List<AccountConfig> accounts, Config cfg, RttStats stats) throws InterruptedException {
        if (cfg.perAccountDelayMs > 0) {
            System.out.printf("[%s] [JAVA-WORKER] 每轮账号间隔 %dms，单轮账号数: %d%n",
                    now(), cfg.perAccountDelayMs, effectiveAccountsPerPoll(accounts.size(), cfg.accountsPerPoll));
        }
        boolean sequentialRounds = "sequential".equals(cfg.runMode);
        if (sequentialRounds) {
            for (int i = 1; i <= cfg.pollTimes; i++) {
                List<AccountConfig> chunk = selectAccountsForPoll(accounts, i, cfg.accountsPerPoll);
                System.out.printf("[%s] [JAVA-WORKER] ===== 轮询 %d/%d 开始 (账号 %d) =====%n", now(), i, cfg.pollTimes, chunk.size());
                runOnce(chunk, cfg, stats);
                System.out.printf("[%s] [JAVA-WORKER] ===== 轮询 %d/%d 结束 =====%n", now(), i, cfg.pollTimes);
                if (i < cfg.pollTimes && cfg.pollIntervalMs > 0) Thread.sleep(cfg.pollIntervalMs);
            }
            return;
        }
        ExecutorService rounds = Executors.newFixedThreadPool(Math.max(1, cfg.pollTimes));
        for (int i = 1; i <= cfg.pollTimes; i++) {
            final int round = i;
            final List<AccountConfig> chunk = selectAccountsForPoll(accounts, i, cfg.accountsPerPoll);
            System.out.printf("[%s] [JAVA-WORKER] ===== 轮询 %d/%d 发起 (账号 %d) =====%n", now(), i, cfg.pollTimes, chunk.size());
            rounds.submit(() -> {
                try {
                    runOnce(chunk, cfg, stats);
                    System.out.printf("[%s] [JAVA-WORKER] ===== 轮询 %d/%d 结束 =====%n", now(), round, cfg.pollTimes);
                } catch (Exception e) {
                    System.out.printf("[%s] [JAVA-WORKER] 轮询 %d 执行异常 => %s%n", now(), round, e.getMessage());
                }
            });
            if (i < cfg.pollTimes && cfg.pollIntervalMs > 0) Thread.sleep(cfg.pollIntervalMs);
        }
        rounds.shutdown();
        rounds.awaitTermination(1, TimeUnit.HOURS);
    }

    private static void runOnce(List<AccountConfig> accounts, Config cfg, RttStats stats) throws InterruptedException {
        int workers = cfg.maxWorkers > 0 ? cfg.maxWorkers : accounts.size();
        
        if ("sequential".equals(cfg.runMode) || workers <= 1) {
            for (int i = 0; i < accounts.size(); i++) {
                processOne(i + 1, accounts.get(i), cfg, stats);
                if (cfg.perAccountDelayMs > 0 && i < accounts.size() - 1) {
                    Thread.sleep(cfg.perAccountDelayMs);
                }
            }
        } else {
            ExecutorService executor = Executors.newFixedThreadPool(workers);
            for (int i = 0; i < accounts.size(); i++) {
                final int idx = i + 1;
                final AccountConfig account = accounts.get(i);
                executor.submit(() -> {
                    try {
                        if (cfg.perAccountDelayMs > 0) Thread.sleep((long) (idx - 1) * cfg.perAccountDelayMs);
                    } catch (InterruptedException e) {
                        Thread.currentThread().interrupt();
                        return;
                    }
                    processOne(idx, account, cfg, stats);
                });
            }
            executor.shutdown();
            executor.awaitTermination(1, TimeUnit.HOURS);
        }
    }

    private static void processOne(int idx, AccountConfig account, Config cfg, RttStats stats) {
        try {
            if (cfg.jitterMs > 0) {
                Thread.sleep((long) (Math.random() * cfg.jitterMs));
            }

            HttpClient client = HTTP_CLIENT;

            String phone = "#" + idx;
            String province = "-";
            int netAge = -1;
            if ("xingdong".equals(cfg.activityType)) {
                com.fasterxml.jackson.databind.JsonNode info = queryUserInfo(client, accessTokenCookie(account.cookie));
                if (info != null && info.has("data")) {
                    com.fasterxml.jackson.databind.JsonNode data = info.get("data");
                    if (data.has("phone")) phone = data.get("phone").asText("-");
                    if (data.has("province")) province = data.get("province").asText("-");
                    if (data.has("netAge")) {
                        try {
                            netAge = data.get("netAge").asInt(-1);
                        } catch (Exception ignored) {}
                    }
                }
                String reason = xingdongSkipReason(netAge, cfg.xingdongSlot);
                if (!reason.isEmpty()) {
                    System.out.printf("[%s] [JAVA-WORKER] 账号 %s %s 跳过 => %s%n", now(), phone, province, reason);
                    return;
                }
            }

            // Build request body
            String receivePhone = account.receivePhone != null && !account.receivePhone.isBlank()
                ? account.receivePhone
                : (cfg.receivePhone != null ? cfg.receivePhone : "");
            StringBuilder body = new StringBuilder();
            body.append("productId=").append(cfg.productId);
            body.append("&receivePhone=").append(receivePhone);
            if ("xingdong".equals(cfg.activityType)) {
                String channelCode = cfg.channelCode != null && !cfg.channelCode.isBlank() ? cfg.channelCode : "75442";
                body.append("&channelCode=").append(channelCode);
                body.append("&mailCheck=1");
                body.append("&ischeck=1");
            } else {
                body.append("&channelCode=").append(cfg.channelCode != null ? cfg.channelCode : "");
                body.append("&isRandom=").append(cfg.isRandom != null ? cfg.isRandom : "0");
            }
            body.append("&sourece=").append(cfg.source != null ? cfg.source : "1");

            String claimUrl = "xingdong".equals(cfg.activityType) ? XINGDONG_CLAIM_URL : CLAIM_URL;
            HttpRequest.Builder builder = HttpRequest.newBuilder()
                .uri(URI.create(claimUrl))
                .header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36")
                .header("X-Requested-With", "XMLHttpRequest")
                .header("Origin", "https://qqt.cmicrwx.cn")
                .header("Referer", refererPage(cfg.activityType))
                .header("Cookie", "xingdong".equals(cfg.activityType) ? accessTokenCookie(account.cookie) : account.cookie);
            if ("xingdong".equals(cfg.activityType)) {
                builder.header("Cache-Control", "no-cache")
                    .header("Pragma", "no-cache");
            }
            HttpRequest request = builder
                .POST(HttpRequest.BodyPublishers.ofString(body.toString()))
                .build();

            String sendTime = now();
            long start = System.nanoTime();
            HttpResponse<String> response;
            try {
                response = client.send(request, HttpResponse.BodyHandlers.ofString());
            } catch (Exception e) {
                String recvTime = now();
                double rttMs = (System.nanoTime() - start) / 1_000_000.0;
                if (stats != null) stats.add(rttMs);
                System.out.printf("[%s] [JAVA-WORKER] 账号#%d 请求发送 %s 返回 %s RTT %.1fms 执行异常 => %s%n",
                        now(), idx, sendTime, recvTime, rttMs, e.getMessage());
                return;
            }
            String recvTime = now();
            double rttMs = (System.nanoTime() - start) / 1_000_000.0;
            if (stats != null) stats.add(rttMs);
            
            // Simple parsing assuming JSON response
            String respBody = response.body();
            String status = "unknown";
            String msg = "";
            
            // Quick regex extraction to avoid full JSON parsing overhead for every request if possible, 
            // but we use jackson since we imported it.
            try {
                 com.fasterxml.jackson.databind.JsonNode node = MAPPER.readTree(respBody);
                 if (node.has("status")) status = node.get("status").asText();
                 else if (node.has("code")) status = node.get("code").asText();
                 else status = String.valueOf(response.statusCode());
                 
                 if (node.has("msg")) msg = node.get("msg").asText();
                 else if (node.has("message")) msg = node.get("message").asText();
            } catch (Exception e) {
                status = String.valueOf(response.statusCode());
                msg = respBody.length() > 50 ? respBody.substring(0, 50) + "..." : respBody;
            }

            String netAgeText = "xingdong".equals(cfg.activityType) && netAge >= 0 ? " 网龄 " + netAge : "";
            System.out.printf("[%s] [JAVA-WORKER] 账号 %s %s%s 请求发送 %s 返回 %s RTT %.1fms 领取结果 => %s %s%n",
                    now(), phone, province, netAgeText, sendTime, recvTime, rttMs, status, msg);

        } catch (Exception e) {
            System.out.printf("[%s] [JAVA-WORKER] 账号#%d 执行异常 => %s%n", now(), idx, e.getMessage());
        }
    }

    private static boolean isXingdongDay() {
        int day = LocalDate.now().getDayOfMonth();
        return day >= 26 && day <= 28;
    }

    private static String accessTokenCookie(String cookie) {
        String text = cookie == null ? "" : cookie.trim();
        if (text.isEmpty()) return "";
        for (String part : text.split(";")) {
            String item = part.trim();
            if (item.startsWith("access_token=")) {
                return item;
            }
        }
        if (!text.contains("=")) {
            return "access_token=" + text;
        }
        return text;
    }

    private static void resolveXingdongRuntime(Config cfg) {
        if (isXingdongDay()) {
            if (cfg.xingdongProductId != null && !cfg.xingdongProductId.isBlank()) {
                cfg.productId = cfg.xingdongProductId.trim();
            }
            return;
        }
        cfg.activityType = "daily_xingdong";
        if (cfg.dailyXingdongProductId != null && !cfg.dailyXingdongProductId.isBlank()) {
            cfg.productId = cfg.dailyXingdongProductId.trim();
        }
    }

    private static com.fasterxml.jackson.databind.JsonNode queryUserInfo(HttpClient client, String cookie) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(INFO_URL))
                .header("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
                .header("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36")
                .header("X-Requested-With", "XMLHttpRequest")
                .header("Origin", "https://qqt.cmicrwx.cn")
                .header("Referer", XINGDONG_REFERER_PAGE)
                .header("Cookie", cookie)
                .POST(HttpRequest.BodyPublishers.ofString("sspId=75442&tag=qqtindex"))
                .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            return MAPPER.readTree(response.body());
        } catch (Exception e) {
            return null;
        }
    }

    private static String refererPage(String activityType) {
        return "xingdong".equals(activityType) ? XINGDONG_REFERER_PAGE : REFERER_PAGE;
    }

    private static String xingdongSkipReason(int netAge, String slot) {
        if ("early".equals(slot)) {
            if (netAge < 0) return "网龄未知，不能参加 09:30 提前场";
            if (netAge < 15) return "网龄 " + netAge + " 年，未满 15 年，跳过 09:30 提前场";
        }
        if ("normal".equals(slot) && netAge >= 15) {
            return "网龄 " + netAge + " 年，已归入 09:30 提前场，跳过 10:00 普通场";
        }
        return "";
    }

    private static List<String> parseCookies(String text) {
        List<String> list = new ArrayList<>();
        if (text != null) {
            for (String line : text.split("\n")) {
                line = line.trim();
                if (!line.isEmpty()) {
                    list.add(line);
                }
            }
        }
        return list;
    }

    private static List<AccountConfig> parseAccounts(Config cfg) {
        List<AccountConfig> list = new ArrayList<>();
        if (cfg.accounts != null) {
            for (AccountConfig item : cfg.accounts) {
                if (item == null || item.cookie == null || item.cookie.isBlank()) continue;
                list.add(item);
            }
        }
        if (!list.isEmpty()) return list;
        for (String cookie : parseCookies(cfg.cookiesText)) {
            AccountConfig item = new AccountConfig();
            item.cookie = cookie;
            list.add(item);
        }
        return list;
    }

    private static String now() {
        return LocalDateTime.now().format(DATE_FMT);
    }
}
