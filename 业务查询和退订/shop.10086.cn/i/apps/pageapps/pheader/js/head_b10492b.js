define(function (require) {
  var _ = (require("appmanage"), require("/i/service/model/user_a79371f.js")),
    c = require("stcutil"),
    y = require("stcDic"),
    a = (require("cookie"), {}),
    v = {},
    h = null,
    b = {};
  (b[0] = "UCenter_Title_MSJ"),
    (b[1] = "UCenter_Title_BTC"),
    (b[2] = "UCenter_Title_BYW"),
    (b[3] = "UCenter_Title_XHM"),
    (b[4] = "UCenter_Title_LJCZ"),
    (b[5] = "UCenter_Title_GRZX");
  var g = [
      {
        ahref: "http://shop.10086.cn/list/101_{prov}_{prov}_0_0_0_0.html",
        imgInx: "2",
        type: "out",
      },
      {
        ahref: "http://shop.10086.cn/list/134_{prov}_{prov}_0_0_0_0.html",
        imgInx: "4",
        type: "out",
      },
      {
        ahref: "http://shop.10086.cn/list/128_{prov}_{prov}_0_0_0_0.html",
        imgInx: "6",
        type: "out",
      },
      { ahref: y.getWebAddress(), imgInx: "8", type: "out" },
      {
        ahref: "http://shop.10086.cn/mall_{prov}_{prov}.html",
        imgInx: "10",
        type: "inner",
      },
      { ahref: "client", imgInx: "14", type: "out" },
    ],
    w = ["043A", "lyZA", "OQGK", "043A", "6ykk", "OQGK", "lyZA", "6ykk"],
    E = w
      .filter(function (e, i) {
        return i % 2 == 0;
      })
      .join(""),
    k = function (_) {
      return _.replace(/&/g, "&amp;")
        .replace(/\"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    },
    T = function (_) {
      var c = $("#secMenu" + _);
      null != c && c.css("display", "block"), $("#navTop" + _).addClass("open");
    },
    C = function (_) {
      var c = $("#secMenu" + _);
      null != c && c.css("display", "none"),
        $("#navTop" + _).removeClass("open");
    },
    A = function () {
      var _ = new Array(2);
      (_[0] = 0), (_[1] = 0);
      for (
        var c = document.cookie, y = c.split("; "), i = 0;
        i < y.length;
        i++
      ) {
        var h = y[i].split("=");
        if (2 <= h.length && "CmLocation" == h[0]) {
          var b = h[1],
            g = b.split("|");
          2 <= g.length &&
            ((a = j(g[0])),
            (v = L(g[1])),
            null != a && null != v && ((_[0] = v.prov_id), (_[1] = v.city_id)));
          break;
        }
      }
      return _;
    },
    j = function (_) {
      for (var c = {}, i = 0; i < V.length; i++)
        if (V[i].code == _ || V[i].abbr == _) {
          c = V[i];
          break;
        }
      return c;
    },
    L = function (_) {
      for (var c = {}, i = 0; i < K.length; i++)
        if (K[i].city_id == _ || K[i].city_id_district == _) {
          c = K[i];
          break;
        }
      return c;
    },
    S = function (_, c, y) {
      var h = _[0],
        b = _[1];
      0 != h && 0 != b
        ? ((a = j(h)), (v = L(b)))
        : ((h = "100"), (b = "100"), (a = j(h)), (v = L(b)));
      var g = 90,
        exp = new Date();
      exp.setTime(exp.getTime() + 24 * g * 60 * 60 * 1e3),
        0 != h &&
          0 != b &&
          (document.cookie =
            "CmLocation=" +
            h +
            "|" +
            b +
            ";path=/;domain=10086.cn;expires=" +
            exp.toGMTString()),
        a &&
          a.abbr &&
          (document.cookie =
            "CmProvid=" +
            a.abbr +
            ";path=/;domain=10086.cn;expires=" +
            exp.toGMTString()),
        null == document.getElementById("topbar") && "" != c && c.initTail(a),
        "" != c && c.initTail(a),
        $(window).on("resize orientationchange", function () {
          P();
        }),
        P(),
        G(),
        J(a, v),
        Y(a, v),
        R(a, v),
        O(a, v),
        H(a, v),
        M(a, v),
        U(a, v);
      var w = "";
      X(a, v), N(w, a, v), "" != y && Q(y, h);
    },
    I = function (c, y, a) {
      h = a;
      var v = [];
      1 == h.userType || 2 == h.userType
        ? ((v = A()),
          0 == v[0]
            ? _.getAreaCodeByIp(
                function (_) {
                  "undefined" != typeof _.provCode && (v[0] = _.provCode),
                    S(v, c, y);
                },
                function () {
                  S(v, c, y);
                },
                function () {
                  S(v, c, y);
                }
              )
            : S(v, c, y))
        : (v.push(h.provice),
          _.getUserBelongInfo(
            h.loginValue,
            function (_) {
              v.push(
                0 == _.id_area_cd.indexOf("00")
                  ? "0" + _.id_area_cd.substring(2)
                  : _.id_area_cd.indexOf("0") > -1 &&
                    0 != _.id_area_cd.indexOf("0")
                  ? _.id_area_cd
                  : 3 == _.id_area_cd.length && 0 == _.id_area_cd.indexOf("0")
                  ? _.id_area_cd.substring(1) + "0"
                  : _.id_area_cd.substring(1)
              ),
                S(v, c, y);
            },
            function () {
              S(v, c, y);
            },
            function () {
              S(v, c, y);
            }
          ));
    },
    B = function () {
      "" == $("#yytbar-img").attr("src") &&
        $("#yytbar-img").attr("src", "/i/nresource/headimages/ewm.jpg"),
        $("#yytbar").css("display", "block"),
        $("#sjyyt").addClass("open");
    },
    D = function () {
      $("#yytbar").css("display", "none"), $("#sjyyt").removeClass("open");
    },
    N = function (_, c, y) {
      {
        var a = document.URL,
          v = a.split("/");
        v[3];
      }
      "/" == a.charAt(a.length - 1) && (a = a.substring(0, a.length - 1));
      for (
        var h = !1, b = !1, g = !1, w = !1, E = z.navsJson, k = 0;
        k < E.length;
        k++
      ) {
        var A = document.createElement("div");
        (A.className = "dropdown-menu"),
          (A.id = "secMenu" + k),
          $(A).bind("onmouseover", function () {
            T(k);
          }),
          $(A).bind("onmouseout", function () {
            C(k);
          }),
          document.getElementById("navTop" + k).appendChild(A);
        for (var i = 0; i < E[k].length; i++)
          for (var j = 0; j < E[k][i].length; j++) {
            var L = E[k][i][j].href;
            "/" == L.charAt(L.length - 1) && (L = L.substring(0, L.length - 1)),
              a == L &&
                (0 == k
                  ? (h = !0)
                  : 1 == k
                  ? (b = !0)
                  : 2 == k
                  ? (g = !0)
                  : 3 == k && (w = !0));
            var p = document.createElement("p");
            A.appendChild(p);
            var S = document.createElement("a");
            $(S).attr("target", "_blank");
            var I = E[k][i][j].href;
            (I = I.replace(new RegExp("\\{prov\\}", "g"), "" + y.prov_id)),
              (I = I.replace(new RegExp("\\{city\\}", "g"), "" + y.city_id)),
              (S.href = I),
              (S.innerHTML = E[k][i][j].name),
              p.appendChild(S);
          }
      }
    },
    U = function (_) {
      var c = z.support;
      null != _ && "undefined" != typeof _ && "undefined" != typeof _.abbr
        ? $("#topA3").attr("href", c.href + _.abbr + "/")
        : $("#topA3").attr("href", c.href);
    },
    M = function (_, c) {
      $("#topA2").attr({
        href:
          "http://shop.10086.cn/list/101_" +
          c.prov_id +
          "_" +
          c.city_id +
          "_1_0_0_0_0_0_2_0.html",
      });
    },
    H = function (_, c) {
      var y = z.myMobile,
        a = y[1].href;
      (a = a.replace(new RegExp("\\{prov\\}", "g"), "" + c.prov_id)),
        (a = a.replace(new RegExp("\\{city\\}", "g"), "" + c.city_id)),
        $("#topA0").attr("href", a);
    },
    O = function () {
      var _ = $("#searchbtn");
      _.click(function () {
        W();
      });
      var c = $("#textkeywords");
      c.keyup(function () {
        13 == event.keyCode ? W() : $("#textkeywords").css("color", "#333");
      }),
        c.blur(function () {
          $("#textkeywords").css("color", "#999");
        });
      var y = document.createElement("script");
      y.setAttribute("type", "text/javascript"),
        y.setAttribute("charset", "UTF-8");
      var a = document.getElementsByTagName("head");
      a.length ? a[0].appendChild(y) : document.documentElement.appendChild(y);
    },
    R = function () {
      for (
        var c = $("#divLogin").attr("starsPage"),
          a = $("#divLogin")[0],
          v = document.cookie,
          b = v.split("; "),
          g = null,
          w = null,
          i = 0;
        i < b.length;
        i++
      ) {
        var E = b[i].split("=");
        if ("loginName" == E[0]) {
          g = E[1];
          break;
        }
      }
      for (var i = 0; i < b.length; i++) {
        var E = b[i].split("=");
        if ("CmWebtokenid" == E[0]) {
          var T = E[1].replace(/\"/g, "").split(",");
          "bj" == T[1] && (w = T[0]);
          break;
        }
      }
      var g = h.loginValue;
      if (g && "2" != h.userType) {
        var C = {};
        $(a).find("#mail") && (C = $("#mail").clone().get(0)), $(a).empty();
        var A = document.createElement("span");
        (A.className = "loginStr"),
          A.setAttribute("id", "loginStr"),
          (A.innerHTML = k(
            g.length > 11 ? g.substring(0, 8) + "..." : h.loginValueResc
          )),
          A.setAttribute("title", g),
          "0" == h.userType &&
            ((A.innerHTML = h.loginValueResc),
            A.setAttribute("title", h.utloginValueResc)),
          a.appendChild(A),
          (cookieStr = $.cookie("loginName")),
          (cookieStr1 = $.cookie("is_login"));
        var j = document.createElement("a");
        (j.id = "logout"), (j.className = "login");
        var L = new Date();
        L.setTime(L.getTime() - 1e3),
          $(j).click(function () {
            _.getLogout(function () {
              $.cookie("loginName", cookieStr, {
                domain: ".10086.cn",
                path: "/",
                expires: L,
              }),
                $.cookie("is_login", cookieStr1, {
                  domain: ".10086.cn",
                  path: "/",
                  expires: L,
                }),
                "starsPage" == c
                  ? location.reload()
                  : (top.location.href = y.getLoginaddr());
            }, null);
          }),
          (j.innerHTML = "[退出]"),
          a.appendChild(j),
          $.isEmptyObject(C) || a.appendChild(C);
      } else {
        $(a).empty();
        var S = window.location.href,
          j = $("<a></a>");
        j.attr("id", "dropdownMenu2"),
          j.attr("class", "t3 dropdown-toggle rose"),
          j.html("登录"),
          j.click(function () {
            window.location.href = y.getloginAddress() + S;
          }),
          a.appendChild(j[0]);
      }
    },
    W = function () {
      if ("" == $("#textkeywords").val() || $("#textkeywords").val().length < 1)
        return $("#textkeywords").focus(), !1;
      var _ = $("#textkeywords").val(),
        c =
          y.getProtalStr() +
          "//search.10086.cn/isearch/mobileShop/index.html?key=" +
          encodeURIComponent(_),
        a = window.localStorage.getItem("uni_search_items"),
        v = (a && JSON.parse(a)) || [];
      return (
        (v = v.filter(function (c) {
          return c != _ ? c : void 0;
        })),
        v.unshift(_),
        window.localStorage.setItem("uni_search_items", JSON.stringify(v)),
        window.open(c),
        !1
      );
    },
    Y = function (_, c) {
      $(function () {
        $("#textkeywords").search({
          type: 1,
          maxResult: 10,
          provinceId: _.code,
          cityId: c.city_id,
          searchID: "textkeywords",
          tabType: 1,
          charset: "utf-8",
        }),
          getDefword(),
          getHotSearchWord(),
          $("#textkeywords").bind("focus", function () {
            $(this).val("");
          });
      });
    },
    z = {
      myMobile: [
        {
          name: "我的移动",
          href: "http://www..10086.cn/my/",
          editable: "2",
          responsible: "1",
          isEdit: "0",
          highLight: "0",
        },
        {
          name: "移动商城",
          href: "http://shop.10086.cn/mall_{prov}_{city}.html",
          editable: "2",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
      ],
      onlineBusiness: {
        name: "网上营业厅",
        href: "http://www.bj.10086.cn/service/",
        editable: "2",
        responsible: "1",
        isEdit: "0",
        highLight: "0",
      },
      support: {
        name: "服务与支持",
        href: "http://www.10086.cn/support/",
        editable: "2",
        responsible: "1",
        isEdit: "2",
      },
      navsJson: [
        [
          [
            {
              name: "买手机",
              href: "http://shop.10086.cn/list/101_{prov}_{city}_0_0_0_0.html",
              editable: "3",
              responsible: "0",
              isEdit: "0",
              highLight: "0",
            },
          ],
          [
            {
              name: "办套餐",
              href: "http://shop.10086.cn/list/140_{prov}_{city}_0_0_0_0.html",
              editable: "3",
              responsible: "0",
              isEdit: "0",
              highLight: "0",
            },
          ],
          [
            {
              name: "办业务",
              href: "http://shop.10086.cn/list/146_{prov}_{city}_0_0_0_0.html",
              editable: "3",
              responsible: "0",
              isEdit: "0",
              highLight: "0",
            },
          ],
          [
            {
              name: "挑配件",
              href: "http://shop.10086.cn/list/128_{prov}_{city}_0_0_0_0.html",
              editable: "3",
              responsible: "0",
              isEdit: "0",
              highLight: "0",
            },
          ],
          [
            {
              name: "立即充值",
              href: "http://shop.10086.cn/i/?f=rechargecredit",
              editable: "3",
              responsible: "0",
              isEdit: "0",
              highLight: "0",
            },
          ],
          [
            {
              name: "我的移动",
              href: "http://shop.10086.cn/i/",
              editable: "3",
              responsible: "0",
              isEdit: "0",
              highLight: "0",
            },
          ],
        ],
      ],
      publicBar: [
        {
          name: "ENGLISH",
          href: "http://www.chinamobileltd.com/?lang=en",
          editable: "3",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
        {
          name: "政企客户",
          href: "http://zhengqi.10086.cn",
          editable: "3",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
        {
          name: "手机营业厅",
          href: "http://www.10086.cn/cmccclient",
          editable: "3",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
        {
          name: "积分商城",
          href: "http://jf.10086.cn/",
          editable: "3",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
        {
          name: "关于中国移动",
          href: "http://www.10086.cn/aboutus/",
          editable: "3",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
      ],
      hotWordsJson: [
        {
          name: "iphoneSE",
          href: "http://search.10086.cn/Query?database=jt&qt=iphoneSE",
          editable: "1",
          responsible: "0",
          isEdit: "0",
          highLight: "1",
        },
        {
          name: "200元用一年",
          href: "http://search.10086.cn/Query?database=jt&qt=200%E5%85%83%E7%94%A8%E4%B8%80%E5%B9%B4",
          editable: "1",
          responsible: "0",
          isEdit: "0",
          highLight: "1",
        },
        {
          name: "宽带低至0元",
          href: "http://search.10086.cn/Query?database=jt&qt=%E5%AE%BD%E5%B8%A6%E4%BD%8E%E8%87%B30%E5%85%83",
          editable: "1",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
        {
          name: "volte",
          href: "http://search.10086.cn/Query?database=jt&qt=volte",
          editable: "1",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
        {
          name: "服务密码重置",
          href: "http://search.10086.cn/Query?database=jt&qt=%E6%9C%8D%E5%8A%A1%E5%AF%86%E7%A0%81%E9%87%8D%E7%BD%AE",
          editable: "1",
          responsible: "0",
          isEdit: "0",
          highLight: "0",
        },
        {
          name: "流量月月送",
          href: "http://search.10086.cn/Query?database=jt&qt=%E6%B5%81%E9%87%8F%E6%9C%88%E6%9C%88%E9%80%81",
          editable: "1",
          responsible: "0",
          isEdit: "0",
          highLight: "1",
        },
      ],
    },
    J = function (_, c) {
      for (var y = z.publicBar, i = 0; i < y.length; i++) {
        var a = document.getElementById("tempBar" + i);
        a &&
          ((a.innerHTML = y[i].name),
          (a.href = y[i].href),
          "政企客户" == y[i].name &&
            (a.href =
              "sh" == _.abbr
                ? "http://www.sh.10086.cn/sh/power"
                : "cq" == _.abbr
                ? "http://www.cq.10086.cn/group/app"
                : "http://zhengqi.10086.cn"));
        var v = "",
          b = y[i].name;
        "手机营业厅" == b
          ? (v = "INDEX_TOP_SJYYT")
          : "积分商城" == b
          ? (v = "INDEX_TOP_JFSC")
          : "关于中国移动" == b
          ? (v = "INDEX_TOP_GYZGYD")
          : "政企客户" == b
          ? (v = "INDEX_TOP_ZQKH")
          : "ENGLISH" == b && (v = "INDEX_TOP_ENGLISH");
      }
      $("#sjyyt")
        .on("mouseenter", function () {
          B();
        })
        .on("mouseleave", function () {
          D();
        }),
        2 != h.userType &&
          ($("#dropdownMenu3").html(_.name),
          $("#dropdownMenu4").html(c.city_name));
      for (
        var g = document.cookie, w = g.split("; "), E = null, k = null, i = 0;
        i < w.length;
        i++
      ) {
        var T = w[i].split("=");
        if ("loginName" == T[0]) {
          E = T[1];
          break;
        }
      }
      for (var i = 0; i < w.length; i++) {
        var T = w[i].split("=");
        if ("CmWebtokenid" == T[0]) {
          var C = T[1].replace(/\"/g, "").split(",");
          "bj" == C[1] && (k = C[0]);
          break;
        }
      }
    },
    G = function () {
      if ("1200px" == $("#main").css("width")) {
        var _ = "/i/nresource/headcss/head1200.css";
        $("#cssHead").attr({ href: _ });
      }
    },
    P = function () {
      var _ = "/i/nresource/headcss/head1000.css",
        c = "/i/nresource/headcss/head1200.css",
        y = $("meta[name=twosize]").attr("content");
      "true" == y &&
        (0 == $("#cssHead").length
          ? F()
          : $("#cssHead").attr(
              1200 <= document.body.clientWidth ? { href: c } : { href: _ }
            ));
    },
    Z = function (s, _) {
      if ("undefined" != typeof _)
        for (var i = 0; i < _.length; i++) if (s == _[i]) return !0;
      return !1;
    },
    Q = function (a, v) {
      for (var i = 0; i < g.length; i++)
        if (
          ((g[i].ahref = g[i].ahref.replace(
            new RegExp("\\{prov\\}", "g"),
            "" + v
          )),
          "client" == g[i].ahref)
        ) {
          var b = [
              "100",
              "311",
              "220",
              "531",
              "571",
              "431",
              "250",
              "280",
              "898",
              "971",
              "230",
              "771",
              "240",
              "351",
              "551",
              "471",
              "270",
              "200",
              "591",
              "371",
              "731",
              "210",
              "931",
              "851",
              "290",
              "791",
              "451",
              "891",
              "951",
              "991",
              "871",
            ],
            w = new Date(),
            k = new Date("2019/07/02 00:30:00");
          if ((k > w && (b = []), Z(v, b))) {
            var T = y.getAspireShopId(),
              C = T[v];
            g[i].ahref = y.getOrderRobotUrl() + "&tenantId=" + C;
          } else g.splice(i, 1);
        }
      $("#easyentry").html(a({ data: g })),
        require([
          "/i/apps/serviceapps/shoppingcar/js/shoppingcar_1660fb4.js",
        ], function (_) {
          _.sideInit();
        }),
        $("#order-online").on("click", function () {
          stcEcode.commTrack("UCenter_rightside_service", !1);
          var y =
              "https://wx.10086.cn/website/customerService/auth/JNJaNFso8ZZHcARDsPYwmwM3ulEctUyp",
            a = c.getAesString(y, E, E),
            v = base64encode(a),
            req = {};
          return (
            (req.phoneNo = h.loginValue),
            (req.targetSysId = "ZXKF"),
            (req.param1 = v.substring(0, 100)),
            (req.param2 = v.substring(100)),
            _.getThirdUrl(
              req,
              function (_) {
                _.extUrl &&
                  setTimeout(function () {
                    window.location.href = _.extUrl;
                  }, 2e3);
              },
              function () {
                window.location.href = y;
              },
              function () {
                window.location.href = y;
              }
            ),
            !1
          );
        }),
        $(".stc-easy-entry-item-ico").on("click", function () {
          "out" === $(this).attr("flag")
            ? window.open($(this).attr("ahref"))
            : "inner" === $(this).attr("flag")
            ? (top.location.href =
                "rechargelove" == $(this).attr("ahref")
                  ? y.getWebAddress() + "?f=rechargelove"
                  : $(this).attr("ahref"))
            : window.scroll(0, 0);
        });
    },
    X = function (_) {
      $("#topA4").attr(
        null != _ && "undefined" != typeof _ && "undefined" != typeof _.abbr
          ? { href: "http://www.10086.cn/" + _.abbr + "/" }
          : { href: "http://www.10086.cn/" }
      ),
        $("#topA4").click(function () {
          stcEcode.commTrack("UCenter_Title_SY", !1);
        }),
        $("#topA4")
          .mouseover(function () {
            T(4);
          })
          .mouseout(function () {
            C(4);
          }),
        $("#topA0").click(function () {
          stcEcode.commTrack("UCenter_Title_YDSC", !1);
        }),
        $("#navTop0")
          .mouseover(function () {
            T(0);
          })
          .mouseout(function () {
            C(0);
          }),
        $("#topA1").click(function () {
          require(["appmanage"], function (_) {
            $("#stc_first_loc").hide(),
              $("#stc_first_arrow").hide(),
              $("#stc_second_loc").html("我的移动"),
              _.initpage("home");
          }),
            stcEcode.commTrack("UCenter_Title_WDYD", !1);
        }),
        $("#navTop1")
          .mouseover(function () {
            T(1);
          })
          .mouseout(function () {
            C(1);
          }),
        $("#topA2").click(function () {
          stcEcode.commTrack("UCenter_Title_WSYYT", !1);
        }),
        $("#navTop2")
          .mouseover(function () {
            T(2);
          })
          .mouseout(function () {
            C(2);
          }),
        $("#topA3").click(function () {
          stcEcode.commTrack("UCenter_Title_FWYZC", !1);
        }),
        $("#navTop3")
          .mouseover(function () {
            T(3);
          })
          .mouseout(function () {
            C(3);
          });
    },
    F = function () {
      var _ = document.createElement("link");
      _.setAttribute("rel", "stylesheet"),
        _.setAttribute("type", "text/css"),
        _.setAttribute("id", "cssHead");
      var c = $("meta[name=twosize]").attr("content");
      "true" == c && 1200 <= document.body.clientWidth
        ? _.setAttribute("href", "/i/nresource/headcss/head1200.css")
        : _.setAttribute("href", "/i/nresource/headcss/head1000.css");
      var y = document.getElementsByTagName("head");
      y.length ? y[0].appendChild(_) : document.documentElement.appendChild(_);
    },
    V = [
      {
        code: 100,
        name: "北京",
        href: "http://www.10086.cn/bj",
        url: "http://shop.10086.cn/mall_100_100.html",
        abbr: "bj",
      },
      {
        code: 551,
        name: "安徽",
        href: "http://www.10086.cn/ah",
        url: "http://shop.10086.cn/mall_551_551.html",
        abbr: "ah",
      },
      {
        code: 230,
        name: "重庆",
        href: "http://www.10086.cn/cq",
        url: "http://shop.10086.cn/mall_230_230.html",
        abbr: "cq",
      },
      {
        code: 591,
        name: "福建",
        href: "http://www.10086.cn/fj",
        url: "http://shop.10086.cn/mall_591_591.html",
        abbr: "fj",
      },
      {
        code: 200,
        name: "广东",
        href: "http://www.10086.cn/gd",
        url: "http://shop.10086.cn/mall_200_200.html",
        abbr: "gd",
      },
      {
        code: 771,
        name: "广西",
        href: "http://www.10086.cn/gx",
        url: "http://shop.10086.cn/mall_771_771.html",
        abbr: "gx",
      },
      {
        code: 931,
        name: "甘肃",
        href: "http://www.10086.cn/gs",
        url: "http://shop.10086.cn/mall_931_931.html",
        abbr: "gs",
      },
      {
        code: 851,
        name: "贵州",
        href: "http://www.10086.cn/gz",
        url: "http://shop.10086.cn/mall_851_851.html",
        abbr: "gz",
      },
      {
        code: 311,
        name: "河北",
        href: "http://www.10086.cn/he",
        url: "http://shop.10086.cn/mall_311_311.html",
        abbr: "he",
      },
      {
        code: 371,
        name: "河南",
        href: "http://www.10086.cn/ha",
        url: "http://shop.10086.cn/mall_371_371.html",
        abbr: "ha",
      },
      {
        code: 898,
        name: "海南",
        href: "http://www.10086.cn/hi",
        url: "http://shop.10086.cn/mall_898_898.html",
        abbr: "hi",
      },
      {
        code: 270,
        name: "湖北",
        href: "http://www.10086.cn/hb",
        url: "http://shop.10086.cn/mall_270_270.html",
        abbr: "hb",
      },
      {
        code: 731,
        name: "湖南",
        href: "http://www.10086.cn/hn",
        url: "http://shop.10086.cn/mall_731_731.html",
        abbr: "hn",
      },
      {
        code: 451,
        name: "黑龙江",
        href: "http://www.10086.cn/hl",
        url: "http://shop.10086.cn/mall_451_451.html",
        abbr: "hl",
      },
      {
        code: 431,
        name: "吉林",
        href: "http://www.10086.cn/jl",
        url: "http://shop.10086.cn/mall_431_431.html",
        abbr: "jl",
      },
      {
        code: 250,
        name: "江苏",
        href: "http://www.10086.cn/js",
        url: "http://shop.10086.cn/mall_250_250.html",
        abbr: "js",
      },
      {
        code: 791,
        name: "江西",
        href: "http://www.10086.cn/jx",
        url: "http://shop.10086.cn/mall_791_791.html",
        abbr: "jx",
      },
      {
        code: 240,
        name: "辽宁",
        href: "http://www.10086.cn/ln",
        url: "http://shop.10086.cn/mall_240_240.html",
        abbr: "ln",
      },
      {
        code: 471,
        name: "内蒙古",
        href: "http://www.10086.cn/nm",
        url: "http://shop.10086.cn/mall_471_471.html",
        abbr: "nm",
      },
      {
        code: 951,
        name: "宁夏",
        href: "http://www.10086.cn/nx",
        url: "http://shop.10086.cn/mall_951_951.html",
        abbr: "nx",
      },
      {
        code: 971,
        name: "青海",
        href: "http://www.10086.cn/qh",
        url: "http://shop.10086.cn/mall_971_971.html",
        abbr: "qh",
      },
      {
        code: 210,
        name: "上海",
        href: "http://www.10086.cn/sh",
        url: "http://shop.10086.cn/mall_210_210.html",
        abbr: "sh",
      },
      {
        code: 280,
        name: "四川",
        href: "http://www.10086.cn/sc",
        url: "http://shop.10086.cn/mall_280_280.html",
        abbr: "sc",
      },
      {
        code: 531,
        name: "山东",
        href: "http://www.10086.cn/sd",
        url: "http://shop.10086.cn/mall_531_531.html",
        abbr: "sd",
      },
      {
        code: 351,
        name: "山西",
        href: "http://www.10086.cn/sx",
        url: "http://shop.10086.cn/mall_351_351.html",
        abbr: "sx",
      },
      {
        code: 290,
        name: "陕西",
        href: "http://www.10086.cn/sn",
        url: "http://shop.10086.cn/mall_290_290.html",
        abbr: "sn",
      },
      {
        code: 220,
        name: "天津",
        href: "http://www.10086.cn/tj",
        url: "http://shop.10086.cn/mall_220_220.html",
        abbr: "tj",
      },
      {
        code: 991,
        name: "新疆",
        href: "http://www.10086.cn/xj",
        url: "http://shop.10086.cn/mall_991_991.html",
        abbr: "xj",
      },
      {
        code: 891,
        name: "西藏",
        href: "http://www.10086.cn/xz",
        url: "http://shop.10086.cn/mall_891_891.html",
        abbr: "xz",
      },
      {
        code: 871,
        name: "云南",
        href: "http://www.10086.cn/yn",
        url: "http://shop.10086.cn/mall_871_871.html",
        abbr: "yn",
      },
      {
        code: 571,
        name: "浙江",
        href: "http://www.10086.cn/zj",
        url: "http://shop.10086.cn/mall_571_571.html",
        abbr: "zj",
      },
    ],
    K = [
      {
        city_id: 100,
        city_id_district: 1000010,
        city_name: "北京",
        prov_id: 100,
      },
      {
        city_id: 200,
        city_id_district: 1000020,
        city_name: "广州",
        prov_id: 200,
      },
      {
        city_id: 660,
        city_id_district: 1000660,
        city_name: "汕尾",
        prov_id: 200,
      },
      {
        city_id: 662,
        city_id_district: 1000662,
        city_name: "阳江",
        prov_id: 200,
      },
      {
        city_id: 663,
        city_id_district: 1000663,
        city_name: "揭阳",
        prov_id: 200,
      },
      {
        city_id: 668,
        city_id_district: 1000668,
        city_name: "茂名",
        prov_id: 200,
      },
      {
        city_id: 750,
        city_id_district: 1000750,
        city_name: "江门",
        prov_id: 200,
      },
      {
        city_id: 751,
        city_id_district: 1000751,
        city_name: "韶关",
        prov_id: 200,
      },
      {
        city_id: 752,
        city_id_district: 1000752,
        city_name: "惠州",
        prov_id: 200,
      },
      {
        city_id: 753,
        city_id_district: 1000753,
        city_name: "梅州",
        prov_id: 200,
      },
      {
        city_id: 754,
        city_id_district: 1000754,
        city_name: "汕头",
        prov_id: 200,
      },
      {
        city_id: 755,
        city_id_district: 1000755,
        city_name: "深圳",
        prov_id: 200,
      },
      {
        city_id: 756,
        city_id_district: 1000756,
        city_name: "珠海",
        prov_id: 200,
      },
      {
        city_id: 757,
        city_id_district: 1000757,
        city_name: "佛山",
        prov_id: 200,
      },
      {
        city_id: 758,
        city_id_district: 1000758,
        city_name: "肇庆",
        prov_id: 200,
      },
      {
        city_id: 759,
        city_id_district: 1000759,
        city_name: "湛江",
        prov_id: 200,
      },
      {
        city_id: 760,
        city_id_district: 1000760,
        city_name: "中山",
        prov_id: 200,
      },
      {
        city_id: 762,
        city_id_district: 1000762,
        city_name: "河源",
        prov_id: 200,
      },
      {
        city_id: 763,
        city_id_district: 1000763,
        city_name: "清远",
        prov_id: 200,
      },
      {
        city_id: 766,
        city_id_district: 1000766,
        city_name: "云浮",
        prov_id: 200,
      },
      {
        city_id: 768,
        city_id_district: 1000768,
        city_name: "潮州",
        prov_id: 200,
      },
      {
        city_id: 769,
        city_id_district: 1000769,
        city_name: "东莞",
        prov_id: 200,
      },
      {
        city_id: 210,
        city_id_district: 1000021,
        city_name: "上海",
        prov_id: 210,
      },
      {
        city_id: 220,
        city_id_district: 1000022,
        city_name: "天津",
        prov_id: 220,
      },
      {
        city_id: 230,
        city_id_district: 1000023,
        city_name: "重庆",
        prov_id: 230,
      },
      {
        city_id: 240,
        city_id_district: 1000024,
        city_name: "沈阳",
        prov_id: 240,
      },
      {
        city_id: 410,
        city_id_district: 1000410,
        city_name: "铁岭",
        prov_id: 240,
      },
      {
        city_id: 411,
        city_id_district: 1000411,
        city_name: "大连",
        prov_id: 240,
      },
      {
        city_id: 412,
        city_id_district: 1000412,
        city_name: "鞍山",
        prov_id: 240,
      },
      {
        city_id: 413,
        city_id_district: 1000413,
        city_name: "抚顺",
        prov_id: 240,
      },
      {
        city_id: 414,
        city_id_district: 1000414,
        city_name: "本溪",
        prov_id: 240,
      },
      {
        city_id: 415,
        city_id_district: 1000415,
        city_name: "丹东",
        prov_id: 240,
      },
      {
        city_id: 416,
        city_id_district: 1000416,
        city_name: "锦州",
        prov_id: 240,
      },
      {
        city_id: 417,
        city_id_district: 1000417,
        city_name: "营口",
        prov_id: 240,
      },
      {
        city_id: 418,
        city_id_district: 1000418,
        city_name: "阜新",
        prov_id: 240,
      },
      {
        city_id: 419,
        city_id_district: 1000419,
        city_name: "辽阳",
        prov_id: 240,
      },
      {
        city_id: 421,
        city_id_district: 1000421,
        city_name: "朝阳",
        prov_id: 240,
      },
      {
        city_id: 427,
        city_id_district: 1000427,
        city_name: "盘锦",
        prov_id: 240,
      },
      {
        city_id: 429,
        city_id_district: 1000429,
        city_name: "葫芦岛",
        prov_id: 240,
      },
      {
        city_id: 250,
        city_id_district: 1000025,
        city_name: "南京",
        prov_id: 250,
      },
      {
        city_id: 510,
        city_id_district: 1000510,
        city_name: "无锡",
        prov_id: 250,
      },
      {
        city_id: 511,
        city_id_district: 1000511,
        city_name: "镇江",
        prov_id: 250,
      },
      {
        city_id: 512,
        city_id_district: 1000512,
        city_name: "苏州",
        prov_id: 250,
      },
      {
        city_id: 513,
        city_id_district: 1000513,
        city_name: "南通",
        prov_id: 250,
      },
      {
        city_id: 514,
        city_id_district: 1000514,
        city_name: "扬州",
        prov_id: 250,
      },
      {
        city_id: 515,
        city_id_district: 1000515,
        city_name: "盐城",
        prov_id: 250,
      },
      {
        city_id: 516,
        city_id_district: 1000516,
        city_name: "徐州",
        prov_id: 250,
      },
      {
        city_id: 517,
        city_id_district: 1000517,
        city_name: "淮安",
        prov_id: 250,
      },
      {
        city_id: 518,
        city_id_district: 1000518,
        city_name: "连云港",
        prov_id: 250,
      },
      {
        city_id: 519,
        city_id_district: 1000519,
        city_name: "常州",
        prov_id: 250,
      },
      {
        city_id: 520,
        city_id_district: 1000520,
        city_name: "宿迁",
        prov_id: 250,
      },
      {
        city_id: 523,
        city_id_district: 1000523,
        city_name: "泰州",
        prov_id: 250,
      },
      {
        city_id: 270,
        city_id_district: 1000027,
        city_name: "武汉",
        prov_id: 270,
      },
      {
        city_id: 710,
        city_id_district: 1000710,
        city_name: "襄阳",
        prov_id: 270,
      },
      {
        city_id: 711,
        city_id_district: 1000711,
        city_name: "鄂州",
        prov_id: 270,
      },
      {
        city_id: 712,
        city_id_district: 1000712,
        city_name: "孝感",
        prov_id: 270,
      },
      {
        city_id: 713,
        city_id_district: 1000713,
        city_name: "黄冈",
        prov_id: 270,
      },
      {
        city_id: 714,
        city_id_district: 1000714,
        city_name: "黄石",
        prov_id: 270,
      },
      {
        city_id: 715,
        city_id_district: 1000715,
        city_name: "咸宁",
        prov_id: 270,
      },
      {
        city_id: 716,
        city_id_district: 1000716,
        city_name: "荆州",
        prov_id: 270,
      },
      {
        city_id: 717,
        city_id_district: 1000717,
        city_name: "宜昌",
        prov_id: 270,
      },
      {
        city_id: 718,
        city_id_district: 1000718,
        city_name: "恩施土家族苗族自治州",
        prov_id: 270,
      },
      {
        city_id: 719,
        city_id_district: 1000719,
        city_name: "十堰",
        prov_id: 270,
      },
      {
        city_id: 722,
        city_id_district: 1000722,
        city_name: "随州",
        prov_id: 270,
      },
      {
        city_id: 724,
        city_id_district: 1000724,
        city_name: "荆门",
        prov_id: 270,
      },
      {
        city_id: 7281,
        city_id_district: 1007281,
        city_name: "仙桃",
        prov_id: 270,
      },
      {
        city_id: 7282,
        city_id_district: 1007282,
        city_name: "潜江",
        prov_id: 270,
      },
      {
        city_id: 7283,
        city_id_district: 1007283,
        city_name: "天门",
        prov_id: 270,
      },
      {
        city_id: 280,
        city_id_district: 1000028,
        city_name: "成都",
        prov_id: 280,
      },
      {
        city_id: 812,
        city_id_district: 1000812,
        city_name: "攀枝花",
        prov_id: 280,
      },
      {
        city_id: 813,
        city_id_district: 1000813,
        city_name: "自贡",
        prov_id: 280,
      },
      {
        city_id: 816,
        city_id_district: 1000816,
        city_name: "绵阳",
        prov_id: 280,
      },
      {
        city_id: 817,
        city_id_district: 1000817,
        city_name: "南充",
        prov_id: 280,
      },
      {
        city_id: 818,
        city_id_district: 1000818,
        city_name: "达州",
        prov_id: 280,
      },
      {
        city_id: 825,
        city_id_district: 1000825,
        city_name: "遂宁",
        prov_id: 280,
      },
      {
        city_id: 826,
        city_id_district: 1000826,
        city_name: "广安",
        prov_id: 280,
      },
      {
        city_id: 827,
        city_id_district: 1000827,
        city_name: "巴中",
        prov_id: 280,
      },
      {
        city_id: 830,
        city_id_district: 1000830,
        city_name: "泸州",
        prov_id: 280,
      },
      {
        city_id: 831,
        city_id_district: 1000831,
        city_name: "宜宾",
        prov_id: 280,
      },
      {
        city_id: 832,
        city_id_district: 1000832,
        city_name: "内江",
        prov_id: 280,
      },
      {
        city_id: 833,
        city_id_district: 1000833,
        city_name: "乐山",
        prov_id: 280,
      },
      {
        city_id: 834,
        city_id_district: 1000834,
        city_name: "凉山彝族自治州",
        prov_id: 280,
      },
      {
        city_id: 835,
        city_id_district: 1000835,
        city_name: "雅安",
        prov_id: 280,
      },
      {
        city_id: 836,
        city_id_district: 1000836,
        city_name: "甘孜藏族自治州",
        prov_id: 280,
      },
      {
        city_id: 837,
        city_id_district: 1000837,
        city_name: "阿坝藏族羌族自治州",
        prov_id: 280,
      },
      {
        city_id: 838,
        city_id_district: 1000838,
        city_name: "德阳",
        prov_id: 280,
      },
      {
        city_id: 839,
        city_id_district: 1000839,
        city_name: "广元",
        prov_id: 280,
      },
      {
        city_id: 840,
        city_id_district: 1000840,
        city_name: "资阳",
        prov_id: 280,
      },
      {
        city_id: 841,
        city_id_district: 1000841,
        city_name: "眉山",
        prov_id: 280,
      },
      {
        city_id: 290,
        city_id_district: 1000029,
        city_name: "西安",
        prov_id: 290,
      },
      {
        city_id: 911,
        city_id_district: 1000911,
        city_name: "延安",
        prov_id: 290,
      },
      {
        city_id: 912,
        city_id_district: 1000912,
        city_name: "榆林",
        prov_id: 290,
      },
      {
        city_id: 913,
        city_id_district: 1000913,
        city_name: "渭南",
        prov_id: 290,
      },
      {
        city_id: 914,
        city_id_district: 1000914,
        city_name: "商洛",
        prov_id: 290,
      },
      {
        city_id: 915,
        city_id_district: 1000915,
        city_name: "安康",
        prov_id: 290,
      },
      {
        city_id: 916,
        city_id_district: 1000916,
        city_name: "汉中",
        prov_id: 290,
      },
      {
        city_id: 917,
        city_id_district: 1000917,
        city_name: "宝鸡",
        prov_id: 290,
      },
      {
        city_id: 919,
        city_id_district: 1000919,
        city_name: "铜川",
        prov_id: 290,
      },
      {
        city_id: 920,
        city_id_district: 1000920,
        city_name: "咸阳",
        prov_id: 290,
      },
      {
        city_id: 311,
        city_id_district: 1000311,
        city_name: "石家庄",
        prov_id: 311,
      },
      {
        city_id: 310,
        city_id_district: 1000310,
        city_name: "邯郸",
        prov_id: 311,
      },
      {
        city_id: 312,
        city_id_district: 1000312,
        city_name: "保定",
        prov_id: 311,
      },
      {
        city_id: 313,
        city_id_district: 1000313,
        city_name: "张家口",
        prov_id: 311,
      },
      {
        city_id: 314,
        city_id_district: 1000314,
        city_name: "承德",
        prov_id: 311,
      },
      {
        city_id: 315,
        city_id_district: 1000315,
        city_name: "唐山",
        prov_id: 311,
      },
      {
        city_id: 316,
        city_id_district: 1000316,
        city_name: "廊坊",
        prov_id: 311,
      },
      {
        city_id: 317,
        city_id_district: 1000317,
        city_name: "沧州",
        prov_id: 311,
      },
      {
        city_id: 318,
        city_id_district: 1000318,
        city_name: "衡水",
        prov_id: 311,
      },
      {
        city_id: 319,
        city_id_district: 1000319,
        city_name: "邢台",
        prov_id: 311,
      },
      {
        city_id: 335,
        city_id_district: 1000335,
        city_name: "秦皇岛",
        prov_id: 311,
      },
      {
        city_id: 351,
        city_id_district: 1000351,
        city_name: "太原",
        prov_id: 351,
      },
      {
        city_id: 349,
        city_id_district: 1000349,
        city_name: "朔州",
        prov_id: 351,
      },
      {
        city_id: 350,
        city_id_district: 1000350,
        city_name: "忻州",
        prov_id: 351,
      },
      {
        city_id: 352,
        city_id_district: 1000352,
        city_name: "大同",
        prov_id: 351,
      },
      {
        city_id: 353,
        city_id_district: 1000353,
        city_name: "阳泉",
        prov_id: 351,
      },
      {
        city_id: 354,
        city_id_district: 1000354,
        city_name: "晋中",
        prov_id: 351,
      },
      {
        city_id: 355,
        city_id_district: 1000355,
        city_name: "长治",
        prov_id: 351,
      },
      {
        city_id: 356,
        city_id_district: 1000356,
        city_name: "晋城",
        prov_id: 351,
      },
      {
        city_id: 357,
        city_id_district: 1000357,
        city_name: "临汾",
        prov_id: 351,
      },
      {
        city_id: 358,
        city_id_district: 1000358,
        city_name: "吕梁",
        prov_id: 351,
      },
      {
        city_id: 359,
        city_id_district: 1000359,
        city_name: "运城",
        prov_id: 351,
      },
      {
        city_id: 371,
        city_id_district: 1000371,
        city_name: "郑州",
        prov_id: 371,
      },
      {
        city_id: 370,
        city_id_district: 1000370,
        city_name: "商丘",
        prov_id: 371,
      },
      {
        city_id: 372,
        city_id_district: 1000372,
        city_name: "安阳",
        prov_id: 371,
      },
      {
        city_id: 373,
        city_id_district: 1000373,
        city_name: "新乡",
        prov_id: 371,
      },
      {
        city_id: 374,
        city_id_district: 1000374,
        city_name: "许昌",
        prov_id: 371,
      },
      {
        city_id: 375,
        city_id_district: 1000375,
        city_name: "平顶山",
        prov_id: 371,
      },
      {
        city_id: 376,
        city_id_district: 1000376,
        city_name: "信阳",
        prov_id: 371,
      },
      {
        city_id: 377,
        city_id_district: 1000377,
        city_name: "南阳",
        prov_id: 371,
      },
      {
        city_id: 378,
        city_id_district: 1000378,
        city_name: "开封",
        prov_id: 371,
      },
      {
        city_id: 379,
        city_id_district: 1000379,
        city_name: "洛阳",
        prov_id: 371,
      },
      {
        city_id: 391,
        city_id_district: 1000391,
        city_name: "焦作",
        prov_id: 371,
      },
      {
        city_id: 392,
        city_id_district: 1000392,
        city_name: "鹤壁",
        prov_id: 371,
      },
      {
        city_id: 393,
        city_id_district: 1000393,
        city_name: "濮阳",
        prov_id: 371,
      },
      {
        city_id: 394,
        city_id_district: 1000394,
        city_name: "周口",
        prov_id: 371,
      },
      {
        city_id: 395,
        city_id_district: 1000395,
        city_name: "漯河",
        prov_id: 371,
      },
      {
        city_id: 396,
        city_id_district: 1000396,
        city_name: "驻马店",
        prov_id: 371,
      },
      {
        city_id: 397,
        city_id_district: 1000397,
        city_name: "济源市",
        prov_id: 371,
      },
      {
        city_id: 398,
        city_id_district: 1000398,
        city_name: "三门峡",
        prov_id: 371,
      },
      {
        city_id: 431,
        city_id_district: 1000431,
        city_name: "长春",
        prov_id: 431,
      },
      {
        city_id: 432,
        city_id_district: 1000432,
        city_name: "吉林",
        prov_id: 431,
      },
      {
        city_id: 433,
        city_id_district: 1000433,
        city_name: "延边朝鲜族自治州",
        prov_id: 431,
      },
      {
        city_id: 434,
        city_id_district: 1000434,
        city_name: "四平",
        prov_id: 431,
      },
      {
        city_id: 435,
        city_id_district: 1000435,
        city_name: "通化",
        prov_id: 431,
      },
      {
        city_id: 436,
        city_id_district: 1000436,
        city_name: "白城",
        prov_id: 431,
      },
      {
        city_id: 437,
        city_id_district: 1000437,
        city_name: "辽源",
        prov_id: 431,
      },
      {
        city_id: 438,
        city_id_district: 1000438,
        city_name: "松原",
        prov_id: 431,
      },
      {
        city_id: 439,
        city_id_district: 1000439,
        city_name: "白山",
        prov_id: 431,
      },
      {
        city_id: 451,
        city_id_district: 1000451,
        city_name: "哈尔滨",
        prov_id: 451,
      },
      {
        city_id: 452,
        city_id_district: 1000452,
        city_name: "齐齐哈尔",
        prov_id: 451,
      },
      {
        city_id: 453,
        city_id_district: 1000453,
        city_name: "牡丹江",
        prov_id: 451,
      },
      {
        city_id: 454,
        city_id_district: 1000454,
        city_name: "佳木斯",
        prov_id: 451,
      },
      {
        city_id: 455,
        city_id_district: 1000455,
        city_name: "绥化",
        prov_id: 451,
      },
      {
        city_id: 456,
        city_id_district: 1000456,
        city_name: "黑河",
        prov_id: 451,
      },
      {
        city_id: 457,
        city_id_district: 1000457,
        city_name: "大兴安岭",
        prov_id: 451,
      },
      {
        city_id: 458,
        city_id_district: 1000458,
        city_name: "伊春",
        prov_id: 451,
      },
      {
        city_id: 459,
        city_id_district: 1000459,
        city_name: "大庆",
        prov_id: 451,
      },
      {
        city_id: 464,
        city_id_district: 1000464,
        city_name: "七台河",
        prov_id: 451,
      },
      {
        city_id: 467,
        city_id_district: 1000467,
        city_name: "鸡西",
        prov_id: 451,
      },
      {
        city_id: 468,
        city_id_district: 1000468,
        city_name: "鹤岗",
        prov_id: 451,
      },
      {
        city_id: 469,
        city_id_district: 1000469,
        city_name: "双鸭山",
        prov_id: 451,
      },
      {
        city_id: 471,
        city_id_district: 1000471,
        city_name: "呼和浩特",
        prov_id: 471,
      },
      {
        city_id: 470,
        city_id_district: 1000470,
        city_name: "呼伦贝尔",
        prov_id: 471,
      },
      {
        city_id: 472,
        city_id_district: 1000472,
        city_name: "包头",
        prov_id: 471,
      },
      {
        city_id: 473,
        city_id_district: 1000473,
        city_name: "乌海",
        prov_id: 471,
      },
      {
        city_id: 474,
        city_id_district: 1000474,
        city_name: "乌兰察布",
        prov_id: 471,
      },
      {
        city_id: 475,
        city_id_district: 1000475,
        city_name: "通辽",
        prov_id: 471,
      },
      {
        city_id: 476,
        city_id_district: 1000476,
        city_name: "赤峰",
        prov_id: 471,
      },
      {
        city_id: 477,
        city_id_district: 1000477,
        city_name: "鄂尔多斯",
        prov_id: 471,
      },
      {
        city_id: 478,
        city_id_district: 1000478,
        city_name: "巴彦淖尔",
        prov_id: 471,
      },
      {
        city_id: 479,
        city_id_district: 1000479,
        city_name: "锡林郭勒盟",
        prov_id: 471,
      },
      {
        city_id: 482,
        city_id_district: 1000482,
        city_name: "兴安盟",
        prov_id: 471,
      },
      {
        city_id: 483,
        city_id_district: 1000483,
        city_name: "阿拉善盟",
        prov_id: 471,
      },
      {
        city_id: 531,
        city_id_district: 1000531,
        city_name: "济南",
        prov_id: 531,
      },
      {
        city_id: 530,
        city_id_district: 1000530,
        city_name: "菏泽",
        prov_id: 531,
      },
      {
        city_id: 532,
        city_id_district: 1000532,
        city_name: "青岛",
        prov_id: 531,
      },
      {
        city_id: 533,
        city_id_district: 1000533,
        city_name: "淄博",
        prov_id: 531,
      },
      {
        city_id: 534,
        city_id_district: 1000534,
        city_name: "德州",
        prov_id: 531,
      },
      {
        city_id: 535,
        city_id_district: 1000535,
        city_name: "烟台",
        prov_id: 531,
      },
      {
        city_id: 536,
        city_id_district: 1000536,
        city_name: "潍坊",
        prov_id: 531,
      },
      {
        city_id: 537,
        city_id_district: 1000537,
        city_name: "济宁",
        prov_id: 531,
      },
      {
        city_id: 538,
        city_id_district: 1000538,
        city_name: "泰安",
        prov_id: 531,
      },
      {
        city_id: 539,
        city_id_district: 1000539,
        city_name: "临沂",
        prov_id: 531,
      },
      {
        city_id: 543,
        city_id_district: 1000543,
        city_name: "滨州",
        prov_id: 531,
      },
      {
        city_id: 546,
        city_id_district: 1000546,
        city_name: "东营",
        prov_id: 531,
      },
      {
        city_id: 631,
        city_id_district: 1000631,
        city_name: "威海",
        prov_id: 531,
      },
      {
        city_id: 632,
        city_id_district: 1000632,
        city_name: "枣庄",
        prov_id: 531,
      },
      {
        city_id: 633,
        city_id_district: 1000633,
        city_name: "日照",
        prov_id: 531,
      },
      {
        city_id: 634,
        city_id_district: 1000634,
        city_name: "莱芜",
        prov_id: 531,
      },
      {
        city_id: 635,
        city_id_district: 1000635,
        city_name: "聊城",
        prov_id: 531,
      },
      {
        city_id: 551,
        city_id_district: 1000551,
        city_name: "合肥",
        prov_id: 551,
      },
      {
        city_id: 550,
        city_id_district: 1000550,
        city_name: "滁州",
        prov_id: 551,
      },
      {
        city_id: 552,
        city_id_district: 1000552,
        city_name: "蚌埠",
        prov_id: 551,
      },
      {
        city_id: 553,
        city_id_district: 1000553,
        city_name: "芜湖",
        prov_id: 551,
      },
      {
        city_id: 554,
        city_id_district: 1000554,
        city_name: "淮南",
        prov_id: 551,
      },
      {
        city_id: 555,
        city_id_district: 1000555,
        city_name: "马鞍山",
        prov_id: 551,
      },
      {
        city_id: 556,
        city_id_district: 1000556,
        city_name: "安庆",
        prov_id: 551,
      },
      {
        city_id: 557,
        city_id_district: 1000557,
        city_name: "宿州",
        prov_id: 551,
      },
      {
        city_id: 558,
        city_id_district: 1000558,
        city_name: "阜阳",
        prov_id: 551,
      },
      {
        city_id: 559,
        city_id_district: 1000559,
        city_name: "黄山",
        prov_id: 551,
      },
      {
        city_id: 561,
        city_id_district: 1000561,
        city_name: "淮北",
        prov_id: 551,
      },
      {
        city_id: 562,
        city_id_district: 1000562,
        city_name: "铜陵",
        prov_id: 551,
      },
      {
        city_id: 563,
        city_id_district: 1000563,
        city_name: "宣城",
        prov_id: 551,
      },
      {
        city_id: 564,
        city_id_district: 1000564,
        city_name: "六安",
        prov_id: 551,
      },
      {
        city_id: 565,
        city_id_district: 1000565,
        city_name: "巢湖",
        prov_id: 551,
      },
      {
        city_id: 566,
        city_id_district: 1000566,
        city_name: "池州",
        prov_id: 551,
      },
      {
        city_id: 567,
        city_id_district: 1000567,
        city_name: "亳州",
        prov_id: 551,
      },
      {
        city_id: 571,
        city_id_district: 1000571,
        city_name: "杭州",
        prov_id: 571,
      },
      {
        city_id: 570,
        city_id_district: 1000570,
        city_name: "衢州",
        prov_id: 571,
      },
      {
        city_id: 572,
        city_id_district: 1000572,
        city_name: "湖州",
        prov_id: 571,
      },
      {
        city_id: 573,
        city_id_district: 1000573,
        city_name: "嘉兴",
        prov_id: 571,
      },
      {
        city_id: 574,
        city_id_district: 1000574,
        city_name: "宁波",
        prov_id: 571,
      },
      {
        city_id: 575,
        city_id_district: 1000575,
        city_name: "绍兴",
        prov_id: 571,
      },
      {
        city_id: 576,
        city_id_district: 1000576,
        city_name: "台州",
        prov_id: 571,
      },
      {
        city_id: 577,
        city_id_district: 1000577,
        city_name: "温州",
        prov_id: 571,
      },
      {
        city_id: 578,
        city_id_district: 1000578,
        city_name: "丽水",
        prov_id: 571,
      },
      {
        city_id: 579,
        city_id_district: 1000579,
        city_name: "金华",
        prov_id: 571,
      },
      {
        city_id: 580,
        city_id_district: 1000580,
        city_name: "舟山",
        prov_id: 571,
      },
      {
        city_id: 591,
        city_id_district: 1000591,
        city_name: "福州",
        prov_id: 591,
      },
      {
        city_id: 592,
        city_id_district: 1000592,
        city_name: "厦门",
        prov_id: 591,
      },
      {
        city_id: 593,
        city_id_district: 1000593,
        city_name: "宁德",
        prov_id: 591,
      },
      {
        city_id: 594,
        city_id_district: 1000594,
        city_name: "莆田",
        prov_id: 591,
      },
      {
        city_id: 595,
        city_id_district: 1000595,
        city_name: "泉州",
        prov_id: 591,
      },
      {
        city_id: 596,
        city_id_district: 1000596,
        city_name: "漳州",
        prov_id: 591,
      },
      {
        city_id: 597,
        city_id_district: 1000597,
        city_name: "龙岩",
        prov_id: 591,
      },
      {
        city_id: 598,
        city_id_district: 1000598,
        city_name: "三明",
        prov_id: 591,
      },
      {
        city_id: 599,
        city_id_district: 1000599,
        city_name: "南平",
        prov_id: 591,
      },
      {
        city_id: 731,
        city_id_district: 1000731,
        city_name: "长沙",
        prov_id: 731,
      },
      {
        city_id: 730,
        city_id_district: 1000730,
        city_name: "岳阳",
        prov_id: 731,
      },
      {
        city_id: 732,
        city_id_district: 1000732,
        city_name: "湘潭",
        prov_id: 731,
      },
      {
        city_id: 733,
        city_id_district: 1000733,
        city_name: "株洲",
        prov_id: 731,
      },
      {
        city_id: 734,
        city_id_district: 1000734,
        city_name: "衡阳",
        prov_id: 731,
      },
      {
        city_id: 735,
        city_id_district: 1000735,
        city_name: "郴州",
        prov_id: 731,
      },
      {
        city_id: 736,
        city_id_district: 1000736,
        city_name: "常德",
        prov_id: 731,
      },
      {
        city_id: 737,
        city_id_district: 1000737,
        city_name: "益阳",
        prov_id: 731,
      },
      {
        city_id: 738,
        city_id_district: 1000738,
        city_name: "娄底",
        prov_id: 731,
      },
      {
        city_id: 739,
        city_id_district: 1000739,
        city_name: "邵阳",
        prov_id: 731,
      },
      {
        city_id: 743,
        city_id_district: 1000743,
        city_name: "湘西土家族苗族自治州",
        prov_id: 731,
      },
      {
        city_id: 744,
        city_id_district: 1000744,
        city_name: "张家界",
        prov_id: 731,
      },
      {
        city_id: 745,
        city_id_district: 1000745,
        city_name: "怀化",
        prov_id: 731,
      },
      {
        city_id: 746,
        city_id_district: 1000746,
        city_name: "永州",
        prov_id: 731,
      },
      {
        city_id: 771,
        city_id_district: 1000771,
        city_name: "南宁",
        prov_id: 771,
      },
      {
        city_id: 770,
        city_id_district: 1000770,
        city_name: "防城港",
        prov_id: 771,
      },
      {
        city_id: 772,
        city_id_district: 1000772,
        city_name: "柳州",
        prov_id: 771,
      },
      {
        city_id: 773,
        city_id_district: 1000773,
        city_name: "桂林",
        prov_id: 771,
      },
      {
        city_id: 774,
        city_id_district: 1000774,
        city_name: "梧州",
        prov_id: 771,
      },
      {
        city_id: 775,
        city_id_district: 1000775,
        city_name: "玉林",
        prov_id: 771,
      },
      {
        city_id: 776,
        city_id_district: 1000776,
        city_name: "百色",
        prov_id: 771,
      },
      {
        city_id: 777,
        city_id_district: 1000777,
        city_name: "钦州",
        prov_id: 771,
      },
      {
        city_id: 778,
        city_id_district: 1000778,
        city_name: "河池",
        prov_id: 771,
      },
      {
        city_id: 779,
        city_id_district: 1000779,
        city_name: "北海",
        prov_id: 771,
      },
      {
        city_id: 780,
        city_id_district: 1000780,
        city_name: "崇左",
        prov_id: 771,
      },
      {
        city_id: 781,
        city_id_district: 1000781,
        city_name: "来宾",
        prov_id: 771,
      },
      {
        city_id: 782,
        city_id_district: 1000782,
        city_name: "贵港",
        prov_id: 771,
      },
      {
        city_id: 783,
        city_id_district: 1000783,
        city_name: "贺州",
        prov_id: 771,
      },
      {
        city_id: 791,
        city_id_district: 1000791,
        city_name: "南昌",
        prov_id: 791,
      },
      {
        city_id: 701,
        city_id_district: 1000701,
        city_name: "鹰潭",
        prov_id: 791,
      },
      {
        city_id: 790,
        city_id_district: 1000790,
        city_name: "新余",
        prov_id: 791,
      },
      {
        city_id: 792,
        city_id_district: 1000792,
        city_name: "九江",
        prov_id: 791,
      },
      {
        city_id: 793,
        city_id_district: 1000793,
        city_name: "上饶",
        prov_id: 791,
      },
      {
        city_id: 794,
        city_id_district: 1000794,
        city_name: "抚州",
        prov_id: 791,
      },
      {
        city_id: 795,
        city_id_district: 1000795,
        city_name: "宜春",
        prov_id: 791,
      },
      {
        city_id: 796,
        city_id_district: 1000796,
        city_name: "吉安",
        prov_id: 791,
      },
      {
        city_id: 797,
        city_id_district: 1000797,
        city_name: "赣州",
        prov_id: 791,
      },
      {
        city_id: 798,
        city_id_district: 1000798,
        city_name: "景德镇",
        prov_id: 791,
      },
      {
        city_id: 799,
        city_id_district: 1000799,
        city_name: "萍乡",
        prov_id: 791,
      },
      {
        city_id: 851,
        city_id_district: 1000851,
        city_name: "贵阳",
        prov_id: 851,
      },
      {
        city_id: 852,
        city_id_district: 1000852,
        city_name: "遵义",
        prov_id: 851,
      },
      {
        city_id: 853,
        city_id_district: 1000853,
        city_name: "安顺",
        prov_id: 851,
      },
      {
        city_id: 856,
        city_id_district: 1000856,
        city_name: "铜仁",
        prov_id: 851,
      },
      {
        city_id: 857,
        city_id_district: 1000857,
        city_name: "毕节",
        prov_id: 851,
      },
      {
        city_id: 858,
        city_id_district: 1000858,
        city_name: "六盘水",
        prov_id: 851,
      },
      {
        city_id: 860,
        city_id_district: 1000860,
        city_name: "黔西南布依族苗族自治州",
        prov_id: 851,
      },
      {
        city_id: 861,
        city_id_district: 1000861,
        city_name: "黔东南苗族侗族自治州",
        prov_id: 851,
      },
      {
        city_id: 862,
        city_id_district: 1000862,
        city_name: "黔南布依族苗族自治州",
        prov_id: 851,
      },
      {
        city_id: 871,
        city_id_district: 1000871,
        city_name: "昆明",
        prov_id: 871,
      },
      {
        city_id: 691,
        city_id_district: 1000691,
        city_name: "西双版纳",
        prov_id: 871,
      },
      {
        city_id: 692,
        city_id_district: 1000692,
        city_name: "德宏",
        prov_id: 871,
      },
      {
        city_id: 870,
        city_id_district: 1000870,
        city_name: "昭通",
        prov_id: 871,
      },
      {
        city_id: 872,
        city_id_district: 1000872,
        city_name: "大理",
        prov_id: 871,
      },
      {
        city_id: 873,
        city_id_district: 1000873,
        city_name: "红河州",
        prov_id: 871,
      },
      {
        city_id: 874,
        city_id_district: 1000874,
        city_name: "曲靖",
        prov_id: 871,
      },
      {
        city_id: 875,
        city_id_district: 1000875,
        city_name: "保山",
        prov_id: 871,
      },
      {
        city_id: 876,
        city_id_district: 1000876,
        city_name: "文山",
        prov_id: 871,
      },
      {
        city_id: 877,
        city_id_district: 1000877,
        city_name: "玉溪",
        prov_id: 871,
      },
      {
        city_id: 878,
        city_id_district: 1000878,
        city_name: "楚雄",
        prov_id: 871,
      },
      {
        city_id: 879,
        city_id_district: 1000879,
        city_name: "普洱",
        prov_id: 871,
      },
      {
        city_id: 883,
        city_id_district: 1000883,
        city_name: "临沧",
        prov_id: 871,
      },
      {
        city_id: 886,
        city_id_district: 1000886,
        city_name: "怒江",
        prov_id: 871,
      },
      {
        city_id: 887,
        city_id_district: 1000887,
        city_name: "迪庆",
        prov_id: 871,
      },
      {
        city_id: 888,
        city_id_district: 1000888,
        city_name: "丽江",
        prov_id: 871,
      },
      {
        city_id: 891,
        city_id_district: 1000891,
        city_name: "拉萨",
        prov_id: 891,
      },
      {
        city_id: 892,
        city_id_district: 1000892,
        city_name: "日喀则",
        prov_id: 891,
      },
      {
        city_id: 893,
        city_id_district: 1000893,
        city_name: "山南",
        prov_id: 891,
      },
      {
        city_id: 894,
        city_id_district: 1000894,
        city_name: "林芝",
        prov_id: 891,
      },
      {
        city_id: 895,
        city_id_district: 1000895,
        city_name: "昌都",
        prov_id: 891,
      },
      {
        city_id: 896,
        city_id_district: 1000896,
        city_name: "那曲",
        prov_id: 891,
      },
      {
        city_id: 897,
        city_id_district: 1000897,
        city_name: "阿里",
        prov_id: 891,
      },
      {
        city_id: 898,
        city_id_district: 1000898,
        city_name: "海口",
        prov_id: 898,
      },
      {
        city_id: 721,
        city_id_district: 1000721,
        city_name: "三亚",
        prov_id: 898,
      },
      {
        city_id: 889,
        city_id_district: 1000889,
        city_name: "屯昌县",
        prov_id: 898,
      },
      {
        city_id: 890,
        city_id_district: 1000890,
        city_name: "儋州市",
        prov_id: 898,
      },
      {
        city_id: 899,
        city_id_district: 1000899,
        city_name: "五指山市",
        prov_id: 898,
      },
      {
        city_id: 900,
        city_id_district: 1000900,
        city_name: "文昌市",
        prov_id: 898,
      },
      {
        city_id: 904,
        city_id_district: 1000904,
        city_name: "澄迈县",
        prov_id: 898,
      },
      {
        city_id: 905,
        city_id_district: 1000905,
        city_name: "琼海市",
        prov_id: 898,
      },
      {
        city_id: 907,
        city_id_district: 1000907,
        city_name: "定安县",
        prov_id: 898,
      },
      {
        city_id: 980,
        city_id_district: 1000980,
        city_name: "临高县",
        prov_id: 898,
      },
      {
        city_id: 981,
        city_id_district: 1000981,
        city_name: "白沙县",
        prov_id: 898,
      },
      {
        city_id: 982,
        city_id_district: 1000982,
        city_name: "昌江县",
        prov_id: 898,
      },
      {
        city_id: 983,
        city_id_district: 1000983,
        city_name: "乐东县",
        prov_id: 898,
      },
      {
        city_id: 984,
        city_id_district: 1000984,
        city_name: "陵水县",
        prov_id: 898,
      },
      {
        city_id: 985,
        city_id_district: 1000985,
        city_name: "保亭县",
        prov_id: 898,
      },
      {
        city_id: 986,
        city_id_district: 1000986,
        city_name: "琼中县",
        prov_id: 898,
      },
      {
        city_id: 988,
        city_id_district: 1000988,
        city_name: "万宁市",
        prov_id: 898,
      },
      {
        city_id: 989,
        city_id_district: 1000989,
        city_name: "东方市",
        prov_id: 898,
      },
      {
        city_id: 931,
        city_id_district: 1000931,
        city_name: "兰州",
        prov_id: 931,
      },
      {
        city_id: 930,
        city_id_district: 1000930,
        city_name: "临夏",
        prov_id: 931,
      },
      {
        city_id: 932,
        city_id_district: 1000932,
        city_name: "定西",
        prov_id: 931,
      },
      {
        city_id: 933,
        city_id_district: 1000933,
        city_name: "平凉",
        prov_id: 931,
      },
      {
        city_id: 934,
        city_id_district: 1000934,
        city_name: "庆阳",
        prov_id: 931,
      },
      {
        city_id: 935,
        city_id_district: 1000935,
        city_name: "武威",
        prov_id: 931,
      },
      {
        city_id: 936,
        city_id_district: 1000936,
        city_name: "张掖",
        prov_id: 931,
      },
      {
        city_id: 937,
        city_id_district: 1000937,
        city_name: "酒泉",
        prov_id: 931,
      },
      {
        city_id: 938,
        city_id_district: 1000938,
        city_name: "天水",
        prov_id: 931,
      },
      {
        city_id: 939,
        city_id_district: 1000939,
        city_name: "陇南",
        prov_id: 931,
      },
      {
        city_id: 941,
        city_id_district: 1000941,
        city_name: "甘南",
        prov_id: 931,
      },
      {
        city_id: 943,
        city_id_district: 1000943,
        city_name: "白银",
        prov_id: 931,
      },
      {
        city_id: 945,
        city_id_district: 1000945,
        city_name: "金昌",
        prov_id: 931,
      },
      {
        city_id: 947,
        city_id_district: 1000947,
        city_name: "嘉峪关",
        prov_id: 931,
      },
      {
        city_id: 951,
        city_id_district: 1000951,
        city_name: "银川",
        prov_id: 951,
      },
      {
        city_id: 952,
        city_id_district: 1000952,
        city_name: "石嘴山",
        prov_id: 951,
      },
      {
        city_id: 953,
        city_id_district: 1000953,
        city_name: "吴忠",
        prov_id: 951,
      },
      {
        city_id: 954,
        city_id_district: 1000954,
        city_name: "固原",
        prov_id: 951,
      },
      {
        city_id: 955,
        city_id_district: 1000955,
        city_name: "中卫",
        prov_id: 951,
      },
      {
        city_id: 971,
        city_id_district: 1000971,
        city_name: "西宁",
        prov_id: 971,
      },
      {
        city_id: 970,
        city_id_district: 1000970,
        city_name: "海北藏族自治州",
        prov_id: 971,
      },
      {
        city_id: 972,
        city_id_district: 1000972,
        city_name: "海东",
        prov_id: 971,
      },
      {
        city_id: 973,
        city_id_district: 1000973,
        city_name: "黄南藏族自治州",
        prov_id: 971,
      },
      {
        city_id: 974,
        city_id_district: 1000974,
        city_name: "海南藏族自治州",
        prov_id: 971,
      },
      {
        city_id: 975,
        city_id_district: 1000975,
        city_name: "果洛藏族自治州",
        prov_id: 971,
      },
      {
        city_id: 976,
        city_id_district: 1000976,
        city_name: "玉树藏族自治州",
        prov_id: 971,
      },
      {
        city_id: 977,
        city_id_district: 1000977,
        city_name: "海西蒙古自治州",
        prov_id: 971,
      },
      {
        city_id: 979,
        city_id_district: 1000979,
        city_name: "格尔木市",
        prov_id: 971,
      },
      {
        city_id: 991,
        city_id_district: 1000991,
        city_name: "乌鲁木齐",
        prov_id: 991,
      },
      {
        city_id: 901,
        city_id_district: 1000901,
        city_name: "塔城",
        prov_id: 991,
      },
      {
        city_id: 902,
        city_id_district: 1000902,
        city_name: "哈密",
        prov_id: 991,
      },
      {
        city_id: 903,
        city_id_district: 1000903,
        city_name: "和田",
        prov_id: 991,
      },
      {
        city_id: 906,
        city_id_district: 1000906,
        city_name: "阿勒泰",
        prov_id: 991,
      },
      {
        city_id: 908,
        city_id_district: 1000908,
        city_name: "克孜勒苏柯尔克孜自治州",
        prov_id: 991,
      },
      {
        city_id: 909,
        city_id_district: 1000909,
        city_name: "博尔塔拉蒙古自治州",
        prov_id: 991,
      },
      {
        city_id: 990,
        city_id_district: 1000990,
        city_name: "克拉玛依",
        prov_id: 991,
      },
      {
        city_id: 994,
        city_id_district: 1000994,
        city_name: "昌吉回族自治州",
        prov_id: 991,
      },
      {
        city_id: 995,
        city_id_district: 1000995,
        city_name: "吐鲁番",
        prov_id: 991,
      },
      {
        city_id: 996,
        city_id_district: 1000996,
        city_name: "巴音郭楞蒙古自治州",
        prov_id: 991,
      },
      {
        city_id: 997,
        city_id_district: 1000997,
        city_name: "阿克苏",
        prov_id: 991,
      },
      {
        city_id: 998,
        city_id_district: 1000998,
        city_name: "喀什",
        prov_id: 991,
      },
      {
        city_id: 999,
        city_id_district: 1000999,
        city_name: "伊犁哈萨克自治州",
        prov_id: 991,
      },
      {
        city_id: 1100,
        city_id_district: 1001100,
        city_name: "省直辖行政单位",
        prov_id: 991,
      },
    ];
  return {
    initHead: function (_, c, y) {
      I(_, c, y);
    },
  };
});
