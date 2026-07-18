function ifThirdMenu() {
  $(".js_list_active>li>a").each(function () {
    $(this).next("ul").length > 0 && $(this).addClass("list-second");
    $(this);
    $(this).on("click", function (e) {
      var e = e || window.event;
      e.preventDefault(),
        $(this).addClass("li-active"),
        $(this).next("ul.list-c1-son").is(":hidden")
          ? ($(this).next("ul.list-c1-son").show(),
            $(this).addClass("li-active"))
          : ($(this).next("ul.list-c1-son").hide(),
            $(this).removeClass("li-active"));
    });
  });
}
function ued_common_tab(a) {
  $(a).click(function () {
    $(this).parent().find(".on").removeClass("on"), $(this).addClass("on");
    var a = $(this).parent().children("li").index($(this));
    $(this).parent().parent().next().children("div").css("display", "none"),
      $(this)
        .parent()
        .parent()
        .next()
        .children("div")
        .eq(a)
        .css("display", "block");
  });
}
function ued_viwe() {}
function ued_phoneNum() {
  $(".js_phoneNum")
    .on("focus", function () {
      var a = $(this),
        c = a.offset().left - 1,
        h = a.offset().top + 42,
        _ = "";
      (_ =
        "<div class='phone-num' id='hphone-num' style='position:absolute;z-index:100010;top:" +
        h +
        "px;left:" +
        c +
        "px;display:none;><span class='pull-phone'>请仔细核对</span></div>"),
        $("#hphone-num").hide().remove(),
        $("body").append(_);
      var g = a.val();
      if (
        ((g = g.replace(/[^0-9]/g, "")),
        a.val(g.length < 3 ? "" : g),
        a.val().length > 0 && a.val().length < 18)
      ) {
        $(this).val();
      }
    })
    .on("keyup", function () {
      $(this).siblings(".pull-down").hide();
      var a = $(this).val();
      if (((a = a.replace(/[^0-9]/g, "")), $(this).val(a), a)) {
        var c = pswInit(a) + "<span class='pull-phone'>请仔细核对</span>";
        $("#hphone-num").html(c).show();
      } else $("#hphone-num").hide().remove();
      if ($(this).val().length >= 11) {
        var h = $(this).val().substring(0, 11);
        $(this).val(h),
          $("#hphone-num")
            .html(pswInit(h) + "<span class='pull-phone'>请仔细核对</span>")
            .show(),
          setTimeout("$('#hphone-num').slideUp()", 1e3);
      }
    })
    .on("blur", function () {
      $("#hphone-num").hide().remove();
    });
}
function ui_lhlog(a, c, h) {
  var _ = $(h).width() / 2,
    g = $(h).height() / 2;
  $(h).css("margin-left", -_ + "px"),
    /msie/.test(navigator.userAgent.toLowerCase()) &&
      $(h).css({ marginTop: -g + "px" }),
    $(a).click(function () {
      $("#thick_bj").show(), $(h).show();
    }),
    $(c).click(function () {
      return $("#thick_bj").hide(), $(h).hide(), !1;
    });
}
function __parseUri(a) {
  var c = __reg.uri_parser,
    h = [
      "source",
      "protocol",
      "authority",
      "userInfo",
      "user",
      "password",
      "host",
      "port",
      "relative",
      "path",
      "directory",
      "file",
      "query",
      "anchor",
    ],
    m = c.exec(a || ""),
    _ = {};
  return (
    $.each(h, function (i, a) {
      _[a] = m[i] || "";
    }),
    _
  );
}
function __parseQuery(a) {
  var i,
    c,
    p,
    n,
    h,
    _,
    g = [];
  if ("undefined" == typeof a || null === a || "" === a) return g;
  for (
    0 === a.indexOf("?") && (a = a.substring(1)),
      c = a.toString().split(__reg.query_separator),
      i = 0,
      l = c.length;
    l > i;
    i++
  )
    (p = c[i]),
      (n = p.indexOf("=")),
      0 !== n &&
        ((h = decodeURIComponent(p.substring(0, n))),
        (_ = decodeURIComponent(p.substring(n + 1))),
        g.push(-1 === n ? [p, null] : [h, _]));
  return g;
}
function __getQueryParamValue(a, c) {
  var h, i;
  for (i = 0, l = a.length; l > i; i++)
    if (((h = a[i]), c === h[0])) return h[1];
}
function base64encode(a) {
  var c, i, h, _, g, v;
  for (h = a.length, i = 0, c = ""; h > i; ) {
    if (((_ = 255 & a.charCodeAt(i++)), i == h)) {
      (c += base64EncodeChars.charAt(_ >> 2)),
        (c += base64EncodeChars.charAt((3 & _) << 4)),
        (c += "==");
      break;
    }
    if (((g = a.charCodeAt(i++)), i == h)) {
      (c += base64EncodeChars.charAt(_ >> 2)),
        (c += base64EncodeChars.charAt(((3 & _) << 4) | ((240 & g) >> 4))),
        (c += base64EncodeChars.charAt((15 & g) << 2)),
        (c += "=");
      break;
    }
    (v = a.charCodeAt(i++)),
      (c += base64EncodeChars.charAt(_ >> 2)),
      (c += base64EncodeChars.charAt(((3 & _) << 4) | ((240 & g) >> 4))),
      (c += base64EncodeChars.charAt(((15 & g) << 2) | ((192 & v) >> 6))),
      (c += base64EncodeChars.charAt(63 & v));
  }
  return c;
}
function base64decode(a) {
  var c, h, _, g, i, v, C;
  for (v = a.length, i = 0, C = ""; v > i; ) {
    do c = base64DecodeChars[255 & a.charCodeAt(i++)];
    while (v > i && -1 == c);
    if (-1 == c) break;
    do h = base64DecodeChars[255 & a.charCodeAt(i++)];
    while (v > i && -1 == h);
    if (-1 == h) break;
    C += String.fromCharCode((c << 2) | ((48 & h) >> 4));
    do {
      if (((_ = 255 & a.charCodeAt(i++)), 61 == _)) return C;
      _ = base64DecodeChars[_];
    } while (v > i && -1 == _);
    if (-1 == _) break;
    C += String.fromCharCode(((15 & h) << 4) | ((60 & _) >> 2));
    do {
      if (((g = 255 & a.charCodeAt(i++)), 61 == g)) return C;
      g = base64DecodeChars[g];
    } while (v > i && -1 == g);
    if (-1 == g) break;
    C += String.fromCharCode(((3 & _) << 6) | g);
  }
  return C;
}
function utf16to8(a) {
  var c, i, h, _;
  for (c = "", h = a.length, i = 0; h > i; i++)
    (_ = a.charCodeAt(i)),
      _ >= 1 && 127 >= _
        ? (c += a.charAt(i))
        : _ > 2047
        ? ((c += String.fromCharCode(224 | ((_ >> 12) & 15))),
          (c += String.fromCharCode(128 | ((_ >> 6) & 63))),
          (c += String.fromCharCode(128 | ((_ >> 0) & 63))))
        : ((c += String.fromCharCode(192 | ((_ >> 6) & 31))),
          (c += String.fromCharCode(128 | ((_ >> 0) & 63))));
  return c;
}
function utf8to16(a) {
  var c, i, h, _, g, v;
  for (c = "", h = a.length, i = 0; h > i; )
    switch (((_ = a.charCodeAt(i++)), _ >> 4)) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        c += a.charAt(i - 1);
        break;
      case 12:
      case 13:
        (g = a.charCodeAt(i++)),
          (c += String.fromCharCode(((31 & _) << 6) | (63 & g)));
        break;
      case 14:
        (g = a.charCodeAt(i++)),
          (v = a.charCodeAt(i++)),
          (c += String.fromCharCode(
            ((15 & _) << 12) | ((63 & g) << 6) | ((63 & v) << 0)
          ));
    }
  return c;
}
function deleteFunOld(a) {
  var c = $(a).parent().prev()[0].innerHTML;
  if ("" != histDel[search_settings.tabType]) {
    var h = basePath + histDel[search_settings.tabType];
    $.ajax({
      type: "get",
      url: h,
      data: { word: c },
      dataType: "jsonp",
      jsonp: "jsonpcallback",
      cache: !1,
      success: function (a) {
        1 == a && getSearchHistoryData();
      },
    });
  }
}
function deleteFun(a) {
  var c = $(a).parent().prev()[0].innerHTML,
    h = window.localStorage.getItem("uni_search_items"),
    _ = (h && JSON.parse(h)) || [];
  (_ = _.filter(function (a) {
    return a != c ? a : void 0;
  })),
    window.localStorage.setItem("uni_search_items", JSON.stringify(_)),
    getSearchHistoryData();
}
function onmouseleaveFun(a, c) {
  a.className = c;
  var h = $(a).find("a")[1];
  h.innerHTML = "搜索历史";
}
function onmouseoverFun(a, c) {
  a.className = c;
  var h = $(a).find("a")[1];
  h.innerHTML = "删除";
}
function getSearchHistoryDataOld() {
  if ("" != histUrl[search_settings.tabType]) {
    var a = basePath + histUrl[search_settings.tabType],
      c = "";
    $.ajax({
      type: "get",
      url: a,
      data: { charset: search_settings.charset },
      dataType: "jsonp",
      cache: !1,
      jsonp: "jsonpcallback",
      success: function (a) {
        null != a && "" != a
          ? ($(searchHistory).empty(),
            $.each(a, function (i) {
              c =
                a[i].Word == defw[search_settings.tabType] ? "10703" : "10701";
              var h =
                herfUrl[search_settings.tabType].format(
                  a[i],
                  search_settings.provinceId,
                  search_settings.cityId
                ) +
                "&from=" +
                c +
                "&no_re=1";
              $(searchHistory).append(
                historyTemplate.replace(
                  /\{NAME\}/gi,
                  "<a target='_blank' style='display:block;' href='" +
                    basePath +
                    h +
                    "'>" +
                    a[i] +
                    "</a>"
                )
              );
            }),
            $(searchHistory).append(
              "<span class='" + search_settings.close_line + "'></span>"
            ),
            $(searchHistory).append(
              "<span class='" + search_settings.close_class + "'>关闭</span>"
            ),
            $(searchHistory).show())
          : $(searchHistory).empty();
      },
    });
  }
}
function getSearchHistoryData() {
  var a = window.localStorage.getItem("uni_search_items"),
    c = (a && JSON.parse(a)) || [];
  null != c && "" != c
    ? ($(searchHistory).empty(),
      $.each(c, function (i) {
        from = c[i].Word == defw[search_settings.tabType] ? "10703" : "10701";
        var a = herfUrl[search_settings.tabType].format(c[i]);
        $(searchHistory).append(
          historyTemplate.replace(
            /\{NAME\}/gi,
            "<a target='_blank' style='display:block;' href='" +
              basePath +
              a +
              "'>" +
              c[i] +
              "</a>"
          )
        );
      }),
      $(searchHistory).append(
        "<span class='" + search_settings.close_line + "'></span>"
      ),
      $(searchHistory).append(
        "<span class='" + search_settings.close_class + "'>关闭</span>"
      ),
      $(searchHistory).show())
    : $(searchHistory).empty();
}
function getDefword() {
  if ("" != defWord[search_settings.tabType]) {
    var a = basePath + defWord[search_settings.tabType];
    $.ajax({
      type: "get",
      url: a,
      data: { areacode: search_settings.provinceId },
      dataType: "jsonp",
      jsonp: "jsonpcallback",
      cache: "false",
      success: function (a) {
        $("#" + search_settings.searchID).val(a.defword),
          (defw[search_settings.tabType] = a.defword);
      },
    });
  }
}
function getPromptWordData(a) {
  if ("" != proUrl[search_settings.tabType]) {
    var c = basePath + proUrl[search_settings.tabType];
    $.ajax({
      type: "get",
      data: {
        content: a,
        charset: search_settings.charset,
        areacode: search_settings.provinceId,
      },
      url: c,
      dataType: "jsonp",
      jsonp: "jsonpcallback",
      success: function (c) {
        if (null != c && "undefind" != c && "" != c)
          if (($(promptWord).empty(), c.searchWord.length > 0)) {
            for (var i in c.searchWord)
              if (void 0 != c.searchWord[i].Word) {
                var h =
                  herfUrl[search_settings.tabType].format(
                    c.searchWord[i].Word,
                    search_settings.provinceId,
                    search_settings.cityId
                  ) + "&no_re=1";
                $(promptWord).append(
                  $(
                    promptTemplate.replace(
                      /\{NAME\}/gi,
                      "<a target='_blank' style='display:block;' href='" +
                        basePath +
                        h +
                        "'showname = " +
                        c.searchWord[i].Word +
                        ">" +
                        c.searchWord[i].Word.replace(
                          a,
                          "<font color='red'>" + a + "</font>"
                        ) +
                        "</a>"
                    )
                  )
                );
              }
            $(promptWord).show();
          } else $(promptWord).css("display", "none");
        else $(promptWord).hide();
      },
    });
  }
}
function findCmProvid() {
  for (var a, c = document.cookie.split("; "), i = 0; i < c.length; i++) {
    var h = c[i].split("=");
    if ("CmProvid" == h[0]) {
      a = h[1];
      break;
    }
  }
  return a;
}
function getPageCharset() {
  var a = "",
    c = getBrowser();
  switch (c) {
    case "IE":
      a = document.charset;
      break;
    case "FIREFOX":
      a = document.characterSet;
      break;
    case "CHROME":
      a = document.characterSet;
      break;
    default:
      a = document.charset;
  }
  return a;
}
function getBrowser() {
  var a = "";
  return (
    -1 != navigator.userAgent.indexOf("MSIE")
      ? (a = "IE")
      : -1 != navigator.userAgent.indexOf("Firefox")
      ? (a = "FIREFOX")
      : -1 != navigator.userAgent.indexOf("WebKit") && (a = "CHROME"),
    a
  );
}
function writeHotLog(a) {
  var c = '{"hotword":' + a.innerText + ',"index":' + a.type + "}",
    h = visitTime(),
    _ = "<%=base64 %>",
    g = "<%=digest %>";
  $.ajax({
    type: "post",
    data: { str: _, digest: g, hotword: c, stayTime: h },
    url: "write.json",
    dataType: "json",
    success: function () {},
  });
}
function getHotSearchWord() {
  if ("" != hotWord[search_settings.tabType]) {
    var a = basePath + hotWord[search_settings.tabType];
    $.ajax({
      type: "get",
      data: {
        provinceId: search_settings.provinceId,
        charset: search_settings.charset,
      },
      url: a,
      dataType: "jsonp",
      jsonp: "jsonpcallback",
      success: function (a) {
        var c = "#" + search_settings.tabName + "hotsearch";
        if (0 == a.length || null == a) return $(c).html(""), !1;
        $(c).html("");
        var h = "";
        require(["stcDic"], function () {
          for (var i in a) {
            var _ = a[i].hotWord;
            if (void 0 != _) {
              var g = a[i].isLight,
                v = "search_blue fl";
              1 == g && (v = "search_red fl");
              var C = "";
              if ("" != $.trim(a[i].url)) {
                var y =
                  $.trim(a[i].url).indexOf("?") < 0 ? "?no_re=1" : "&no_re=1";
                C = $.trim(a[i].url) + y;
              } else
                C =
                  basePath +
                  herfUrl[search_settings.tabType].format(
                    a[i].hotWord,
                    search_settings.provinceId,
                    search_settings.cityId
                  ) +
                  "&from=10702&no_re=1";
              h =
                h +
                "<a target='_blank' onclick='writeHotLog(this)' type='" +
                a[i].position +
                "' class='" +
                v +
                "' href='" +
                C +
                "'>" +
                _ +
                "</a>";
            }
          }
          $(c).html(h);
        });
      },
    });
  }
}
function searchFun() {
  var a = "",
    c = $("#" + search_settings.searchID).val();
  if (
    ((a = c == defw[search_settings.tabType] ? "10703" : "10701"),
    null == c || "" == c || "undefined" == c)
  )
    return !1;
  var h =
    basePath +
    herfUrl[search_settings.tabType].format(
      c,
      search_settings.provinceId,
      search_settings.cityId
    ) +
    "&from=" +
    a +
    "&no_re=1";
  window.open(h);
}
$(document).ready(function () {
  var c = $(document).outerWidth();
  1200 > c &&
    (jQuery("head").append("<link>"),
    (a = jQuery("head").children(":last")),
    a.attr({
      rel: "stylesheet",
      type: "text/css",
      href: "/i/nresource/css/responseType.css",
    }));
});
var _resize = !0;
$(window).resize(function () {
  var c = $(window).width();
  1200 > c && _resize
    ? (jQuery("head").append("<link>"),
      (a = jQuery("head").children(":last")),
      a.attr({
        rel: "stylesheet",
        type: "text/css",
        href: "/i/nresource/css/responseType.css",
      }),
      (_resize = !1))
    : c >= 1200 &&
      !_resize &&
      (jQuery("head").children("link:eq(0)").siblings("link").remove(),
      (_resize = !0));
}),
  $(function () {
    ued_viwe(),
      ui_lhlog(".js_lhlog", ".js_x_close", ".thick-content"),
      $("div.js_hover2").hover(
        function () {
          $(this).children(".js_hoverCont").show();
        },
        function () {
          $(this).children(".js_hoverCont").hide();
        }
      ),
      $(".js_info").hover(
        function () {
          $(this).children(".ued-tag").show();
        },
        function () {
          $(this).children(".ued-tag").hide();
        }
      ),
      $(".js_oper tr").hover(
        function () {
          $(this).find(".oper-link").css("visibility", "visible");
        },
        function () {
          $(this).find(".oper-link").css("visibility", "hidden");
        }
      ),
      $(".stc-inner").hover(
        function () {
          $(this).find(".hide").show();
        },
        function () {
          $(this).find(".hide").hide();
        }
      ),
      $(document).on("click", ".js_head_por li", function () {
        $(this).addClass("active").siblings().removeClass("active");
      }),
      $(document).on("click", ".js-item-select li", function () {
        $(this).addClass("active").siblings().removeClass("active");
      }),
      $(".link-group a").click(function () {
        $(this).addClass("active").siblings("a").removeClass("active");
      }),
      $(".js_selectNumber li .num-input").click(function () {
        var i = $(this).val();
        (inputPhone =
          i.substring(0, 3) +
          " " +
          i.substring(4, 8) +
          " " +
          i.substring(9, 13)),
          $(".ipt-style").val(inputPhone);
      }),
      $(".js_bookPhone").toggle(
        function () {
          $(this).siblings(".pull-down").show();
        },
        function () {
          $(this).siblings(".pull-down").hide();
        }
      ),
      $(".book-write").on("click", function () {
        $(this).hide(),
          $(this).siblings(".book-name,.book-num").hide(),
          $(this).siblings(".name-input,.num-input,.book-bc").show(),
          $(this).siblings(".book-bc").css("display", "inline-block");
      }),
      $(".book-bc").on("click", function () {
        $(this).css("display", "none"),
          $(this).siblings(".book-name,.book-num,.book-write").show(),
          $(this).siblings(".name-input,.num-input").hide();
      }),
      $(".book-close").on("click", function () {
        $(this).parent("li").remove();
      }),
      $(".stc-ad").on("click", function () {
        $(this).addClass("stc-adc").siblings(".stc-au").removeClass("stc-auc");
      }),
      $(".stc-au").on("click", function () {
        $(this).addClass("stc-auc").siblings(".stc-ad").removeClass("stc-adc");
      }),
      $("div.js_collapse").each(function () {
        var a = $(this),
          c = a.children(".js_collapsett"),
          h = a.children(".js_collapseArea");
        a.hasClass("collapse-on") && h.css("display", "block"),
          c.click(function () {
            "none" == h.css("display")
              ? (h.slideDown(300), a.addClass("collapse-on"))
              : (h.slideUp(300), a.removeClass("collapse-on"));
          });
      }),
      $("input[type='radio'].inp-radio").each(function () {
        {
          var a = $(this),
            c = a.next();
          a.attr("name") || "";
        }
        a.is(":checked")
          ? c.addClass("bon-radio")
          : c.hasClass("bon-radio") && c.removeClass("bon-radio"),
          c.click(function () {
            a.trigger("click"),
              $("input[type='radio']:checked") &&
                ($("input[type='radio']:checked").next().addClass("bon-radio"),
                $("input[type='radio']:not(:checked)")
                  .next()
                  .removeClass("bon-radio"));
          });
      });
  }),
  $(window).resize(function () {
    var a = $(".ued-viwe").parent().width();
    $(".ued-viwe-big li").css("width", a + "px"), ued_viwe();
  }),
  $(".js_phoneNum").on("blur", function () {
    var a = new Array(3);
    $(a).each(function (i) {
      a[i] = "";
    });
    var c = $(this)
      .val()
      .replace(/[^0-9]/g, "");
    return (
      11 == c.length &&
        ((a[0] = c.substring(0, 3)),
        (a[1] = c.substring(3, 7)),
        (a[2] = c.substring(7, 11))),
      a[0].length > 0 &&
        a[1].length > 0 &&
        a[2].length > 0 &&
        ((c = a[0].toString() + " " + a[1].toString() + " " + a[2].toString()),
        $(this).val(c)),
      !1
    );
  }),
  +(function () {})(jQuery),
  (function () {
    for (
      var a,
        c = function () {},
        h = [
          "assert",
          "clear",
          "count",
          "debug",
          "dir",
          "dirxml",
          "error",
          "exception",
          "group",
          "groupCollapsed",
          "groupEnd",
          "info",
          "log",
          "markTimeline",
          "profile",
          "profileEnd",
          "table",
          "time",
          "timeEnd",
          "timeline",
          "timelineEnd",
          "timeStamp",
          "trace",
          "warn",
        ],
        _ = h.length,
        g = (window.console = window.console || {});
      _--;

    )
      (a = h[_]), g[a] || (g[a] = c);
    String.prototype.trim = function () {
      return this.replace(/^s+|s+$/g, "");
    };
  })();
var __reg = {
    query_separator: /[&;]/,
    uri_parser:
      /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
  },
  Namespace = (function (a) {
    var c = function (a) {
        return "object" == typeof a && a.sort ? a : new Array(a);
      },
      h = function (c) {
        var h = arguments[1] || !1,
          _ = a;
        if ("" != c)
          for (
            var g = c.split(Namespace.separator), i = 0, v = g.length;
            v > i;
            i++
          )
            _[g[i]] || (_[g[i]] = {}), (_ = _[g[i]]);
        if (h) for (var C in h) _[C] = h[C];
        return _;
      };
    return (
      (h.use = function (_, g) {
        for (
          var v = g ? a : {},
            C = c(_),
            i = (arguments[1] || !1, 0),
            y = C.length;
          y > i;
          i++
        ) {
          _ = C[i];
          var $ = _.split(Namespace.separator),
            b = $.pop(),
            H = h($.join(Namespace.separator));
          if ("*" == b) for (var w in H) v[w] = H[w];
          else H[b] && (v[b] = H[b]);
        }
        return v;
      }),
      h
    );
  })(window);
$.ajaxSetup({ cache: !0 }),
  "undefined" == typeof JSON &&
    (JSON = (function () {
      var m = {
          "\b": "\\b",
          "	": "\\t",
          "\n": "\\n",
          "\f": "\\f",
          "\r": "\\r",
          '"': '\\"',
          "\\": "\\\\",
        },
        s = {
          boolean: function (x) {
            return String(x);
          },
          number: function (x) {
            return isFinite(x) ? String(x) : "null";
          },
          string: function (x) {
            return (
              /["\\\x00-\x1f]/.test(x) &&
                (x = x.replace(/([\x00-\x1f\\"])/g, function (a, c) {
                  var h = m[c];
                  return h
                    ? h
                    : ((h = c.charCodeAt()),
                      "\\u00" +
                        Math.floor(h / 16).toString(16) +
                        (h % 16).toString(16));
                })),
              '"' + x + '"'
            );
          },
          object: function (x) {
            if (x) {
              var a,
                f,
                i,
                l,
                c,
                h = [];
              if (x instanceof Array) {
                for (h[0] = "[", l = x.length, i = 0; l > i; i += 1)
                  (c = x[i]),
                    (f = s[typeof c]),
                    f &&
                      ((c = f(c)),
                      "string" == typeof c &&
                        (a && (h[h.length] = ","),
                        (h[h.length] = c),
                        (a = !0)));
                h[h.length] = "]";
              } else {
                if (!(x instanceof Object)) return;
                h[0] = "{";
                for (i in x)
                  (c = x[i]),
                    (f = s[typeof c]),
                    f &&
                      ((c = f(c)),
                      "string" == typeof c &&
                        (a && (h[h.length] = ","),
                        h.push(s.string(i), ":", c),
                        (a = !0)));
                h[h.length] = "}";
              }
              return h.join("");
            }
            return "null";
          },
        };
      return {
        stringify: function (a) {
          var f = s[typeof a];
          return f && ((a = f(a)), "string" == typeof a) ? a : null;
        },
        parse: function (text) {
          try {
            return (
              !/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                text.replace(/"(\\.|[^"\\])*"/g, "")
              ) && eval("(" + text + ")")
            );
          } catch (e) {
            return !1;
          }
        },
      };
    })());
var PHONE_NO = "",
  MASTER_SERV_ID = "",
  POP_TYPE = "",
  OPCODE = "",
  SMVALUE = "",
  CUST_ID = "",
  CUST_NAME = "",
  PERSONAL_GROUP = "";
Namespace.separator = ".";
var __urlparse = __parseUri(location.href),
  __params = __parseQuery(__urlparse.query),
  _Constant = Namespace("all.constant");
(_Constant.FUNCODE = __getQueryParamValue(__params, "f")),
  (_Constant.CHARGE_STATU = __getQueryParamValue(__params, "p")),
  (_Constant.CREDITORDERID = __getQueryParamValue(__params, "orderId")),
  (_Constant.CHARGEPHONE = __getQueryParamValue(__params, "mobileNo")
    ? __getQueryParamValue(__params, "mobileNo")
    : ""),
  (_Constant.CHARGEAMOUNT = __getQueryParamValue(__params, "amount")
    ? __getQueryParamValue(__params, "amount")
    : ""),
  (_Constant.FLOWTYPE = __getQueryParamValue(__params, "flowtype")
    ? __getQueryParamValue(__params, "flowtype")
    : ""),
  (_Constant.OPERATEID = __getQueryParamValue(__params, "operateId")
    ? __getQueryParamValue(__params, "operateId")
    : ""),
  (_Constant.LOVETYPE = __getQueryParamValue(__params, "type")
    ? __getQueryParamValue(__params, "type")
    : ""),
  (_Constant.CHARGEFLOW = ""),
  (_Constant.TARCE_ID =
    new Date().getTime() + "-" + parseInt(1e6 * Math.random())),
  (_Constant.INNEROPCPDE = ""),
  (_Constant.SALEORDERID = ""),
  (_Constant.BANDORDERID = ""),
  (_Constant.USERID = ""),
  (_Constant.PRESTATE = ""),
  (_Constant.ORDERTYPE = ""),
  (_Constant.CURRENTMENUS = ""),
  (_Constant.CURRFUNC = ""),
  (_Constant.CURRFUNCODE = ""),
  (_Constant.STATUS = ""),
  (_Constant.PASSDATA = ""),
  (_Constant.ORDERID = ""),
  (_Constant.TENNANTID = ""),
  (_Constant.BUYTIME = ""),
  (_Constant.CHARGEMENUS = []),
  (_Constant.LOVEPHONE = ""),
  (_Constant.ADDLOVE = ""),
  (_Constant.FATHERORDER = ""),
  (_Constant.MOBILE = ""),
  (_Constant.MOBILEFLAG = ""),
  (_Constant.NICK = ""),
  (_Constant.LOVEJUMP = ""),
  (_Constant.DEFALTWARMTIP = ""),
  (_Constant.IDENTIFY = ""),
  (_Constant.CONSIGNEE = ""),
  (_Constant.LESSQCODE = ""),
  (_Constant.JFFLAG = !0),
  (_Constant.SAMEPROV = !0),
  (_Constant.POINTVALUE = ""),
  (_Constant.TELEBILL = ""),
  (_Constant.CURRINX = 1),
  (_Constant.UPGRADEPARAS = {}),
  (_Constant.COUPONLEN = ""),
  (_Constant.TPNCOUPONARR = []),
  (_Constant.FPNCOUPONARR = []),
  (_Constant.REFRESHTPL = !1),
  (_Constant.HAVE_PAYRULE = !0),
  (_Constant.FIRSTLOGINLIFEPAGE = !0),
  (_Constant.popAddLv = "0"),
  (_Constant.popAddLvPhone = ""),
  Namespace.use("all.constant.*", !0),
  "undefined" == typeof OBJJSON &&
    (OBJJSON = (function () {
      var m = {
          "\b": "\\b",
          "	": "\\t",
          "\n": "\\n",
          "\f": "\\f",
          "\r": "\\r",
          '"': '\\"',
          "\\": "\\\\",
        },
        s = {
          boolean: function (x) {
            return String(x);
          },
          number: function (x) {
            return isFinite(x) ? String(x) : "null";
          },
          string: function (x) {
            return (
              /["\\\x00-\x1f]/.test(x) &&
                (x = x.replace(/([\x00-\x1f\\"])/g, function (a, c) {
                  var h = m[c];
                  return h
                    ? h
                    : ((h = c.charCodeAt()),
                      "\\u00" +
                        Math.floor(h / 16).toString(16) +
                        (h % 16).toString(16));
                })),
              '"' + x + '"'
            );
          },
          object: function (x) {
            if (x) {
              var a,
                f,
                i,
                l,
                c,
                h = [];
              if (x instanceof Array) {
                for (h[0] = "[", l = x.length, i = 0; l > i; i += 1)
                  (c = x[i]),
                    (f = s[typeof c]),
                    f &&
                      ((c = f(c)),
                      "string" == typeof c &&
                        (a && (h[h.length] = ","),
                        (h[h.length] = c),
                        (a = !0)));
                h[h.length] = "]";
              } else {
                if (!(x instanceof Object)) return;
                h[0] = "{";
                for (i in x)
                  (c = x[i]),
                    (f = s[typeof c]),
                    f &&
                      ((c = f(c)),
                      "string" == typeof c &&
                        (a && (h[h.length] = ","),
                        h.push(s.string(i), ":", c),
                        (a = !0)));
                h[h.length] = "}";
              }
              return h.join("");
            }
            return "null";
          },
        };
      return {
        stringify: function (a) {
          var f = s[typeof a];
          return f && ((a = f(a)), "string" == typeof a) ? a : null;
        },
        parse: function (text) {
          try {
            return (
              !/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                text.replace(/"(\\.|[^"\\])*"/g, "")
              ) && eval("(" + text + ")")
            );
          } catch (e) {
            return !1;
          }
        },
      };
    })());
var base64EncodeChars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
  base64DecodeChars = new Array(
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    62,
    -1,
    -1,
    -1,
    63,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    -1,
    -1,
    -1,
    -1,
    -1
  );
!(function (a) {
  var c = {
      trackSwitch: !0,
      loginData: null,
      eventItems: {
        home_hfcx: { sin: "i_HFCX" },
        home_jfcx: { sin: "i_JFCX" },
        mainpackchange: { eventCode: "UCenter_MyHome_Product", sin: "i_ZFTC" },
        browse_handle: {
          eventCode: "UCenter_MyHome_ProductBuy",
          sin: "i_YWBL",
        },
        pointqry: { eventCode: "UCenter_MyHome_Integral", sin: "i_JFMXCX" },
        packremainqry: {
          eventCode: "UCenter_MyHome_Remainder",
          eventCodeH: "UCenter_Head_Remainder",
          sin: "i_TCYLCX",
        },
        recharhisqry: {
          eventCode: "UCenter_MyHome_ReChargeLog",
          eventCodeH: "UCenter_Head_ReChargeLog",
          sin: "i_JFJLCX",
        },
        billqry: {
          eventCode: "UCenter_MyHome_Bill",
          eventCodeH: "UCenter_Head_Bill",
          sin: "i_ZDCX",
        },
        billdetailqry: { eventCode: "UCenter_MyHome_Order", sin: "i_XDCX" },
        busiqrydeal: { eventCode: "UCenter_MyHome_UnProduct", sin: "i_YWCXTD" },
        myorders: {
          eventCode: "UCenter_MyHome_MyOrder",
          eventCodeH: "UCenter_Head_MyOrder",
          sin: "i_SPDD",
        },
        clientorders: {
          eventCode: "UCenter_MyHome_MyOrder",
          eventCodeH: "UCenter_Head_MyOrder",
          sin: "i_SPDD",
        },
        mypreorders: { eventCode: "UCenter_MyHome_PreOrder", sin: "i_YGDD" },
        rechargerecord: {
          eventCode: "UCenter_MyHome_RechargeOrder",
          eventCodeH: "UCenter_Head_RechargeOrder",
          sin: "i_CZDD",
        },
        rechargeurecord: {
          eventCode: "UCenter_MyHome_RechargeUorder",
          eventCodeH: "UCenter_Head_RechargeUorder",
          sin: "i_WDLCZDD",
        },
        myfav: { eventCode: "UCenter_MyHome_MyCollect", sin: "i_WDSC" },
        rechargecredit: {
          eventCode: "UCenter_MyHome_Recharge",
          eventCodeH: "UCenter_Head_Recharge",
          sin: "i_CZJF",
        },
        rechargeonline: {
          eventCode: "UCenter_Recharge_online",
          eventCodeH: "UCenter_Recharge_online",
          sin: "i_ZXCZ",
        },
        rechargelove: {
          eventCode: "UCenter_MyHome_Rechargelove",
          sin: "i_AXCZ",
        },
        rechargecard: {
          eventCode: "UCenter_MyHome_RechargeCard",
          eventCodeH: "UCenter_Head_RechargeCard",
          sin: "i_CZKCZ",
        },
        rechargejf: { eventCode: "UCenter_MyHome_RechargeJf", sin: "i_JFCZ" },
        rechargegprs: {
          eventCode: "UCenter_MyHome_RechargeData",
          sin: "i_LLKCZ",
        },
        rechargelovegprs: { sin: "i_AXLLKCZ" },
        rechargeinterofth: {
          eventCode: "UCenter_MyHome_Rechargeinterofth",
          sin: "i_WLWCZ",
        },
        returnorderqry: {
          eventCode: "UCenter_MyHome_ReturnOrder",
          sin: "i_THSQCX",
        },
        clientreturn: {
          eventCode: "UCenter_MyHome_ReturnOrder",
          sin: "i_THSQCX",
        },
        myinvoice: { eventCode: "UCenter_MyHome_MyInvoice", sin: "i_WDFP" },
        message: { eventCode: "UCenter_MyHome_MyMsg" },
        custinfoqry: { eventCode: "UCenter_MyHome_NetInfo", sin: "i_RWXXCX" },
        recaddrmag: {
          eventCode: "UCenter_MyHome_DeliveryAddress",
          sin: "i_SHDZ",
        },
        invoicemag: { eventCode: "UCenter_MyHome_InvoiceInfo", sin: "i_FPZZ" },
        noticeinfo: { sin: "i_GGXX" },
        recharge1111: { sin: "i_11CZ" },
        reginfoset: { eventCode: "UCenter_MyHome_MyInfoSet" },
        phone_manage: { eventCode: "UCenter_MyHome_NumberBind" },
        belongqry: { eventCode: "UCenter_MyHome_BelongInfo", sin: "i_HMGSDCX" },
        remail: { eventCode: "UCenter_MyHome_email139", sin: "i_139mail" },
        securitycenter: { eventCode: "UCenter_MyHome_SafeAssistant" },
        phone_manage: { eventCode: "UCenter_MyHome_NumberBind" },
        securitysetting: { eventCode: "UCenter_MyHome_EncryptSet" },
        loginsafe: { eventCode: "UCenter_MyHome_SafeLogin" },
        passwordmg: { eventCode: "UCenter_MyHome_PwdManager" },
        feepresent: {
          eventCode: "UCenter_MyHome_GiveAndReceive",
          sin: "i_ZSYFH",
        },
        liferecharhisqry: {
          eventCode: "UCenter_MyHome_RechargeLifejlcx",
          sin: "i_SHJFJLCX",
        },
        rechargelife: {
          eventCode: "UCenter_MyHome_rechargelife",
          sin: "i_rechargelifesf",
        },
        msgremind: { eventCode: "UCenter_MyHome_MsgRemind", sin: "i_XXTX" },
        advicearrival: { sin: "i_DHTZ" },
        mynews: { eventCode: "UCenter_MyHome_Messageview", sin: "i_XXCK" },
        newcomment: { sin: "i_FBPJ" },
        commentstatu: { sin: "i_PJZT" },
        commentdetail: { sin: "i_PJXQ" },
        commentdetaillist: { sin: "i_PJLB" },
        commentlistscore: { sin: "i_PJPF" },
        starprefecture: { sin: "i_XJZQ" },
        bandorderqry: { sin: "i_KDYYDD" },
        setprotect: { eventCode: "UCenter_MyHome_HSN" },
        flowqry: { eventCode: "UCenter_MyHome_GprsBill" },
        advicearrival: {
          eventCode: "UCenter_MyHome_AdviceArrival",
          sin: "i_DYCX",
        },
        mycoupons: { eventCode: "UCenter_MyHome_Coupon", sin: "i_WDKQ" },
        myfcode: { eventCode: "UCenter_MyHome_FCoupon", sin: "i_WDFM" },
        rechargebroband: { eventCode: "UCenter_MyHome_RechargeWB" },
        newBroadBandOrder: { eventCode: "Ucenter_MyHome_newBroadBandOrder" },
        rechargelandline: { eventCode: "UCenter_MyHome_Rechargefix" },
        privilegeDec: { eventCode: "UCenter_MyHome_PrivilegeDec" },
        familyorder: { eventCode: "UCenter_MyHome_MyOrder_Business" },
        haraprotect: { eventCode: "UCenter_My_haraprotect" },
      },
    },
    h = {
      startGlobalTrack: function () {},
      changeMeta: function () {},
      getMeta: function () {},
      commTrack: function () {},
      eventTrack: function () {},
      getEventCodeByInx: function (a, h) {
        var _ = c.eventItems[a],
          g = null;
        return (
          null != _ &&
            (h && "undefined" != typeof _.eventCodeH
              ? (g = _.eventCodeH)
              : "undefined" != typeof _.eventCode && (g = _.eventCode)),
          g
        );
      },
      getFuncNameByInx: function (a) {
        var h = c.eventItems[a],
          _ = null;
        return null != h && "undefined" != typeof h.sin && (_ = h.sin), _;
      },
      pvTrack: function () {},
      pvTrack_nor: function () {},
    };
  a.stcEcode = h;
})(window);
var basePath = window.location.protocol + "//search.10086.cn/",
  searchUrl = "",
  herfUrl = new Array(
    "search?content={0}&areacode={1}&c={2}",
    "isearch/mobileShop/index.html?key={0}"
  ),
  proUrl = new Array([""], [""]),
  histUrl = new Array(
    ["historySearch/searchHistory_jsonp.json"],
    ["shop/shopSearch/searchHistory_jsonp.json"]
  ),
  histDel = new Array(
    ["historySearch/del_history_jsonp.json"],
    ["shop/shopSearch/del_history_jsonp.json"]
  ),
  hotWord = new Array([""], [""]),
  defWord = new Array([""], [""]),
  defw = new Array(),
  search_settings = {
    type: 1,
    maxResult: 10,
    maxPinLei: 5,
    top: 0,
    left: 0,
    width: 0,
    out: "search_toplist",
    innerOn: "",
    innerOff: "search_li_yidong",
    areacode: "",
    cityId: "",
    provinceId: "",
    charset: "",
    searchID: "",
    search_li_history: "search_li_history",
    close_line: "close_line",
    close_class: "colse_class",
    tabType: 0,
    tabName: "text",
    showDefaultWord: 0,
    showHotSearchWord: 0,
  },
  identityId = +new Date(),
  searchHistory = "#" + search_settings.tabName + "searchHistory" + identityId,
  promptWord = "#" + search_settings.tabName + "searchKeyWord" + identityId,
  sign,
  inputWord,
  historyTemplate =
    "<li class='" +
    search_settings.innerOn +
    "'  onmouseover=onmouseoverFun(this,'" +
    search_settings.innerOff +
    "') onmouseout=onmouseleaveFun(this,'" +
    search_settings.innerOn +
    "')  tag='0' >{NAME}<span class='" +
    search_settings.search_li_history +
    "'><a href='javascript:void(0);' onclick='deleteFun(this)'>搜索历史</a></span></li>",
  promptTemplate =
    "<li class='" +
    search_settings.innerOn +
    "'  onmouseover='this.className=\"" +
    search_settings.innerOff +
    "\";' onmouseout='this.className=\"" +
    search_settings.innerOn +
    "\"'  tag='0' >{NAME}</li>",
  currentThis;
(String.prototype.format = function (a) {
  var c = this;
  if (arguments.length > 0)
    if (1 == arguments.length && "object" == typeof a) {
      for (var h in a)
        if (void 0 != a[h]) {
          var _ = new RegExp("({" + h + "})", "g");
          c = c.replace(_, a[h]);
        }
    } else
      for (var i = 0; i < arguments.length; i++)
        if (void 0 != arguments[i]) {
          var _ = new RegExp("({[" + i + "]})", "g");
          c = c.replace(_, arguments[i]);
        }
  return c;
}),
  $.fn.extend({
    search: function (a) {
      (a = a || {}), $.extend(search_settings, a), (currentThis = this);
      var c = $(this),
        h = c.attr("tagName");
      if (
        null == h ||
        "undefind" == h ||
        "input" == c.attr("tagName").toLowerCase()
      ) {
        var _ = $(searchHistory);
        if (0 == _.length) {
          var g = $("<ul></ul>");
          $(this).after(g),
            $(g).attr({
              id: search_settings.tabName + "searchHistory" + identityId,
              class: search_settings.out,
            }),
            (_ = g),
            $(searchHistory).hide();
          var v = $(promptWord);
          if (0 == v.length) {
            var C = $("<ul></ul>");
            $(this).after(C),
              $(C).attr({
                id: search_settings.tabName + "searchKeyWord" + identityId,
                class: search_settings.out,
              }),
              (v = C);
          }
          return (
            $(promptWord)
              .hide()
              .on("mouseover", "li.history-inner-prompt", function () {
                this.className =
                  "history-inner-prompt " + search_settings.innerOff;
              })
              .on("mouseout", "li.history-inner-prompt", function () {
                this.className =
                  "history-inner-prompt " + search_settings.innerOn;
              }),
            $(this).bind("keydown", function (e) {
              var a = e.keyCode;
              (38 == a || 40 == a) &&
                !(function () {
                  var c = $(currentThis).val();
                  if ("" == c || void 0 == c || null == c || 1 == sign) {
                    var h = null;
                    if (
                      ($(searchHistory)
                        .find("li")
                        .each(function (i, a) {
                          return $(a).attr("class") == search_settings.innerOff
                            ? ((h = a), !1)
                            : void 0;
                        }),
                      38 == a)
                    )
                      if (null == h || void 0 == h) {
                        if (
                          ($(searchHistory).find("li").length > 0 &&
                            $(searchHistory)
                              .find("li:last")
                              .attr("class", search_settings.innerOff),
                          "1" != $(searchHistory).find("li:last").attr("tag"))
                        ) {
                          var _ = $(searchHistory).find("li:last A")[0],
                            g = $(searchHistory).find("li:last A")[1];
                          void 0 != _ &&
                            ($(currentThis).val(_.innerHTML),
                            (g.innerHTML = "删除"));
                        }
                      } else if (
                        ($(h).attr("class", search_settings.innerOn),
                        $(h).prev().attr("class", search_settings.innerOff),
                        "1" != $(h).prev())
                      ) {
                        var v = $(h).prev(),
                          _ = v.find("A")[0],
                          g = v.find("A")[1],
                          C = v.next().find("A")[1];
                        if (void 0 != _)
                          $(currentThis).val(_.innerHTML),
                            (g.innerHTML = "删除"),
                            (C.innerHTML = "搜索历史");
                        else {
                          var y = v.prevObject;
                          y.find("A")[1].innerHTML = "搜索历史";
                        }
                      }
                    if (40 == a)
                      if (((sign = 1), null == h || void 0 == h)) {
                        if (
                          ($(searchHistory).find("li").length > 0 &&
                            $(searchHistory)
                              .find("li:first")
                              .attr("class", search_settings.innerOff),
                          "1" != $(currentThis).attr("tag"))
                        ) {
                          var _ = $(searchHistory).find("li:first a")[0],
                            g = $(searchHistory).find("li:first a")[1];
                          void 0 != _ &&
                            ($(currentThis).val(_.innerHTML),
                            (g.innerHTML = "删除"));
                        }
                      } else {
                        $(h).attr("class", search_settings.innerOn);
                        var b = $(h).next().attr("class");
                        if (
                          (b != search_settings.close_line &&
                            $(h).next().attr("class", search_settings.innerOff),
                          "1" != $(h).next().attr("tag"))
                        ) {
                          var v = $(h).next(),
                            _ = v.find("A")[0],
                            g = v.find("A")[1],
                            C = v.prev().find("A")[1];
                          void 0 != _
                            ? ($(currentThis).val(_.innerHTML),
                              (C.innerHTML = "搜索历史"),
                              (g.innerHTML = "删除"))
                            : (C.innerHTML = "搜索历史");
                        }
                      }
                  } else {
                    var h = null;
                    if (
                      ($(promptWord)
                        .find("li")
                        .each(function (i, a) {
                          return $(a).attr("class") == search_settings.innerOff
                            ? ((h = a), !1)
                            : void 0;
                        }),
                      38 == a)
                    )
                      if (null == h || void 0 == h)
                        $(promptWord).find("li").length > 0 &&
                          $(promptWord)
                            .find("li:last")
                            .attr("class", search_settings.innerOff),
                          "1" != $(promptWord).find("li:last").attr("tag") &&
                            $(currentThis).val(
                              $(promptWord).find("li:last A").attr("showname")
                            );
                      else if (
                        ($(h).attr("class", search_settings.innerOn),
                        $(h).prev().attr("class", search_settings.innerOff),
                        "1" != $(h).prev().attr("tag"))
                      ) {
                        var H = $(h).prev().find("A").attr("showname");
                        ("" == H || void 0 == H) && (H = inputWord),
                          $(currentThis).val(H);
                      }
                    if (40 == a)
                      if (((sign = 2), null == h || void 0 == h))
                        $(promptWord).find("li").length > 0 &&
                          $(promptWord)
                            .find("li:first")
                            .attr("class", search_settings.innerOff),
                          "1" != $(currentThis).attr("tag") &&
                            $(currentThis).val(
                              $(promptWord).find("li:first a").attr("showname")
                            );
                      else if (
                        ($(h).attr("class", search_settings.innerOn),
                        $(h).next().attr("class", search_settings.innerOff),
                        "1" != $(h).next().attr("tag"))
                      ) {
                        var w = $(h).next().find("A").attr("showname");
                        ("" == w || void 0 == w) && (w = inputWord),
                          $(currentThis).val(w);
                      }
                  }
                })();
            }),
            $("body").click(function (e) {
              var a = $(e.target).attr("id"),
                c = search_settings.searchID;
              c != a &&
                ("" == $("#" + c).val() &&
                  $("#" + c).val(defw[search_settings.tabType]),
                $(searchHistory).empty(),
                $(searchHistory).hide(),
                $(promptWord).empty(),
                $(promptWord).hide());
            }),
            $(this).bind("mouseup", function () {
              var a = $(currentThis).val();
              defw[search_settings.tabType] == a &&
                ($("#" + search_settings.searchID).val(""), (a = "")),
                "" == a || void 0 == a || null == a
                  ? ((sign = 1),
                    $(promptWord).empty(),
                    $(promptWord).hide(),
                    $(searchHistory).is(":visible") || getSearchHistoryData())
                  : ((sign = 2),
                    (inputWord = a),
                    $(searchHistory).empty(),
                    $(searchHistory).hide(),
                    $(promptWord).is(":visible") || getPromptWordData(a));
            }),
            $("#frm_search_id").bind("mouseleave", function () {
              $(searchHistory).empty(),
                $(searchHistory).hide(),
                $(promptWord).empty(),
                $(promptWord).hide();
            }),
            c.bind("keyup", function (e) {
              var a = e.keyCode;
              if (38 != a && 40 != a) {
                var c = $(currentThis).val();
                "" == c || void 0 == c || null == c
                  ? ((sign = 1),
                    $(promptWord).empty(),
                    $(promptWord).hide(),
                    getSearchHistoryData())
                  : ((sign = 2),
                    (inputWord = c),
                    $(searchHistory).empty(),
                    $(searchHistory).hide(),
                    getPromptWordData(c));
              }
            }),
            a.showDefaultWord && getDefword(),
            a.showHotSearchWord && getHotSearchWord(),
            this
          );
        }
      }
    },
  });
