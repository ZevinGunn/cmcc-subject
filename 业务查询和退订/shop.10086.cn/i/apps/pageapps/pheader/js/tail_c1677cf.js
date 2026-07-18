define(function (require) {
  var KNET_change = function (a) {
      var c = document.getElementById(a).href,
        h = c.substring(0, c.length - 6);
      (h += KNET_RndNum(6)), (document.getElementById(a).href = h);
    },
    KNET_RndNum = function (a) {
      for (var c = "", i = 0; a > i; i++) c += Math.floor(10 * Math.random());
      return c;
    },
    _initTail = function (pobj) {
      var link = document.createElement("link");
      link.setAttribute("rel", "stylesheet"),
        link.setAttribute("type", "text/css"),
        link.setAttribute("href", "/i/nresource/headcss/tail.css");
      var heads = document.getElementsByTagName("head");
      heads.length
        ? heads[0].appendChild(link)
        : document.documentElement.appendChild(link);
      var linksJson = eval(
          '[{"name":"新闻中心","href":"http://www.10086.cn/aboutus/news/","editable":"3","responsible":"0","isEdit":"0","highLight":"0"},{"name":"诚聘英才","href":"http://job.10086.cn/","editable":"3","responsible":"0","isEdit":"0","highLight":"0"},{"name":"企业合作","href":"http://www.10086.cn/aboutus/hezuo/","editable":"3","responsible":"0","isEdit":"0","highLight":"0"},{"name":"联系我们","href":"http://www.10086.cn/web_notice/contact/","editable":"3","responsible":"0","isEdit":"0","highLight":"0"},{"name":"站点导航","href":"http://www.10086.cn/web_notice/navigation/","editable":"3","responsible":"0","isEdit":"0","highLight":"0"}]'
        ),
        footer = document.getElementById("stc_tail"),
        divFooter = document.createElement("div");
      (divFooter.className = "footer"), footer.appendChild(divFooter);
      var footerCon = document.createElement("div");
      (footerCon.className = "footcon"), divFooter.appendChild(footerCon);
      var pFooter1 = document.createElement("p");
      $(pFooter1).addClass("stc-footp"), footerCon.appendChild(pFooter1);
      for (var cur_attr = pobj.abbr, i = 0; i < linksJson.length; i++)
        if ("xz" == cur_attr || 1 != linksJson[i].responsible) {
          var a = document.createElement("a");
          if (
            ((a.href = linksJson[i].href),
            (a.innerHTML = linksJson[i].name),
            "hl" == cur_attr &&
              "网站地图" == linksJson[i].name &&
              (a.href = "http://www.hl.10086.cn/apps/map.html"),
            "cq" == cur_attr &&
              "网站地图" == linksJson[i].name &&
              (a.href = "http://service.cq.10086.cn/svcquery/webSite2014.html"),
            "fj" == cur_attr &&
              "网站地图" == linksJson[i].name &&
              (a.href = "http://www.fj.10086.cn/siteinfo/sitemap/index.html"),
            "zj" == cur_attr &&
              "网站地图" == linksJson[i].name &&
              (a.href = "http://www.zj.10086.cn/sitemap/"),
            pFooter1.appendChild(a),
            i != linksJson.length - 1)
          ) {
            var span = document.createElement("span");
            (span.innerHTML = "&nbsp;|&nbsp;"), pFooter1.appendChild(span);
          }
        }
      if ("xz" == cur_attr) {
        var spanLink1 = document.createElement("span");
        (spanLink1.innerHTML = "&nbsp;|&nbsp;"),
          pFooter1.appendChild(spanLink1);
        var tianshang = document.createElement("a");
        (tianshang.href = "http://www.ctibet.cn/"),
          (tianshang.target = "_blank"),
          (tianshang.innerHTML = "天上西藏"),
          pFooter1.appendChild(tianshang);
      }
      var spanLink = document.createElement("span");
      (spanLink.innerHTML = "&nbsp;|&nbsp;"), pFooter1.appendChild(spanLink);
      var aLink = document.createElement("a");
      (aLink.href = "http://www.10086.cn/web_notice/links/"),
        (aLink.innerHTML = "友情链接"),
        pFooter1.appendChild(aLink);
      var pFooter2 = document.createElement("p");
      $(pFooter2).addClass("stc-footp"), footerCon.appendChild(pFooter2);
      var spanFooter4 = document.createElement("span");
      (spanFooter4.innerHTML = "&nbsp;"), pFooter2.appendChild(spanFooter4);
      var spanFooter1 = document.createElement("span");
      (spanFooter1.innerHTML = "掌上营业厅："),
        pFooter2.appendChild(spanFooter1);
      var aFooter1 = document.createElement("a");
      (aFooter1.href = "http://wap.10086.cn"),
        (aFooter1.innerHTML = "wap.10086.cn"),
        pFooter2.appendChild(aFooter1);
      var spanFooter2 = document.createElement("span");
      (spanFooter2.innerHTML =
        "&nbsp;语音自助服务：10086  短信营业厅：10086&nbsp;"),
        pFooter2.appendChild(spanFooter2);
      var aFooter2 = document.createElement("a");
      (aFooter2.href = "http://www.10086.cn/support/channel/self_service/"),
        (aFooter2.innerHTML = "自助终端"),
        pFooter2.appendChild(aFooter2);
      var spanFooter3 = document.createElement("span");
      (spanFooter3.innerHTML = "&nbsp;"), pFooter2.appendChild(spanFooter3);
      var aFooter3 = document.createElement("a");
      (aFooter3.href = "http://www.10086.cn/support/channel/Entity1/"),
        (aFooter3.innerHTML = "营业厅"),
        pFooter2.appendChild(aFooter3);
      var spanFooter4 = document.createElement("span");
      (spanFooter4.innerHTML = "&nbsp;"), pFooter2.appendChild(spanFooter4);
      var aFooter4 = document.createElement("a");
      (aFooter4.href = "http://www.10086.cn/cmccclient/index.htm"),
        (aFooter4.innerHTML = "手机营业厅下载"),
        pFooter2.appendChild(aFooter4);
      var fullYear = new Date().getFullYear(),
        pFooter3 = document.createElement("p");
      (pFooter3.className = "xuke"),
        (pFooter3.innerHTML =
          "Copyright&copy;1999-" +
          fullYear +
          "&nbsp;&nbsp;中国移动&nbsp;&nbsp;版权所有"),
        footerCon.appendChild(pFooter3);
      var pFooter4 = document.createElement("p");
      (pFooter4.className = "xuke"), footerCon.appendChild(pFooter4);
      var pFooter4_span = document.createElement("span");
      (pFooter4_span.innerHTML =
        "中华人民共和国增值电信业务经营许可证&nbsp;&nbsp;经营许可证编号：A2.B1.B2-20100001"),
        pFooter4.appendChild(pFooter4_span);
      var divFootGov = document.createElement("div");
      if (((divFootGov.className = "footgov"), "xj" == cur_attr)) {
        var spanXJGS = document.createElement("span");
        spanXJGS.id = "XJGS";
        var spanXJGSContext = document.createElement("span");
        spanXJGSContext.className = "xjgsContext";
        var aXJGS = document.createElement("a");
        (aXJGS.tabindex = "-1"),
          (aXJGS.target = "_blank"),
          (aXJGS.style.display = "inline-block");
        var imgXJGS = document.createElement("img");
        (imgXJGS.width = 43),
          (imgXJGS.height = 59),
          (imgXJGS.style.border = "none"),
          (imgXJGS.oncontextmenu = "return false"),
          aXJGS.appendChild(imgXJGS),
          spanXJGSContext.appendChild(aXJGS),
          spanXJGS.appendChild(spanXJGSContext),
          divFootGov.appendChild(spanXJGS);
      }
      var KXWZYZ = document.createElement("div");
      KXWZYZ.setAttribute("id", "KXWZ"),
        (KXWZYZ.className = "kxyz"),
        divFootGov.appendChild(KXWZYZ);
      var spanKXYZ = document.createElement("span");
      KXWZYZ.appendChild(spanKXYZ);
      var aKXYZ = document.createElement("a");
      aKXYZ.setAttribute("id", "urlknet"),
        (aKXYZ.href =
          "https://ss.knet.cn/verifyseal.dll?sn=e130905110100423008ilb000000&pa=500267"),
        (aKXYZ.tabindex = "-1"),
        (aKXYZ.target = "_blank"),
        spanKXYZ.appendChild(aKXYZ);
      var imgKXYZ = document.createElement("img");
      (imgKXYZ.alt = "&#x53EF;&#x4FE1;&#x7F51;&#x7AD9;"),
        (imgKXYZ.name = "KNET_seal"),
        (imgKXYZ.src = "/i/nresource/headimages/knetSealLogo.png"),
        (imgKXYZ.width = 128),
        (imgKXYZ.height = 47),
        (imgKXYZ.oncontextmenu = "return false"),
        imgKXYZ.setAttribute("onclick", "KNET_change('urlknet')"),
        aKXYZ.appendChild(imgKXYZ);
      var divGovtxt = document.createElement("div");
      divGovtxt.className = "govtxt";
      var pGov = document.createElement("p");
      (pGov.className = "gov"),
        (pGov.innerHTML =
          "<a href='http://www.miibeian.gov.cn/'>京ICP备05002571号</a>"),
        divGovtxt.appendChild(pGov),
        divFootGov.appendChild(divGovtxt),
        divFooter.appendChild(divFootGov);
    };
  return {
    initTail: function (a) {
      _initTail(a);
    },
  };
});
