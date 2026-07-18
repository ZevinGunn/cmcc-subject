define(function (require) {
  var a = "040000",
    c = "040100;040200;040400;",
    h = require("appmanage"),
    g = require("/i/service/model/componet_set_0a0af91.js"),
    v = require("/i/service/model/user_a79371f.js"),
    b = require("/i/service/model/mynews_966658e.js"),
    E = require("stcutil"),
    w = require("stcDic"),
    y = Namespace("all.constant"),
    C = function (a) {
      return "2" != h.data[0].data.userType || E.inArray(a, w.getNologinFun())
        ? !0
        : (sessionStorage.setItem("naviMenu", a),
          (top.location.href = w.getLoginaddr() + "?f=" + a),
          !1);
    },
    N = function (a) {
      var c = new RegExp("^[0-9]{14}$");
      if (c.test(a)) {
        var h = new Date(),
          g = a.substr(0, 4),
          m = a.substr(4, 2),
          d = a.substr(6, 2),
          v = a.substr(8, 2),
          b = a.substr(10, 2),
          s = a.substr(12, 2),
          E = g + "/" + m + "/" + d + " " + v + ":" + b + ":" + s;
        return (h = new Date(E)), h.getTime();
      }
      return a;
    },
    A = function (a, c, h, g, v) {
      var b = !1,
        E = [],
        $ = [],
        w = {};
      "undefind" != typeof a && null != a && ((E = a.all), ($ = a.part));
      for (var i in E)
        if (E[i].funcCode == h) {
          N(E[i].eTime) >= c &&
            N(E[i].bTime) <= c &&
            ((w.desc = E[i].desc), (b = !0));
          break;
        }
      var C = "040100;040200;",
        A = h + ";";
      if (!b && "" != h && -1 == C.indexOf(A))
        for (var i in $)
          if ($[i].pcode == g) {
            var R = $[i].funcList;
            for (var T in R)
              if (R[T].funcCode == h) {
                N(R[T].eTime) >= c &&
                  N(R[T].bTime) <= c &&
                  ((w.desc = R[T].desc), (b = !0));
                break;
              }
            break;
          }
      if (b) {
        var U = "很抱歉！该页面正在升级维护";
        "040400" == h && (U = "AI豆充值功能即将开放，敬请期待！"),
          (w.buildTit = U),
          (y.UPGRADEPARAS = w),
          v(w);
      } else v();
    },
    R = function (a) {
      var c = require(["/i/service/model/recharge_15cca2a.js"]),
        h = require("pluspop"),
        g = require("appmanage");
      if (
        "1" != a.userType ||
        (null != a.userAccountList &&
          0 != a.userAccountList.length &&
          a.loginValue != g.data[0].mobile)
      )
        return !1;
      var v = [];
      if (null != v) {
        var b = parseInt(v.p);
        if (1 == b)
          c.getPayCallBack(
            v,
            function () {},
            function () {},
            function () {}
          );
        else {
          var E = require("appmanage"),
            w = require("stcDic"),
            C = E.data[0].data.userAccountList;
          if (null == C || ("undefined" != typeof C && 0 == C.length)) {
            var N =
                "AI豆充值需要对手机号码进行AI豆扣减，您还没有绑定手机号码，赶快先去绑定吧！",
              A =
                "<div style='color: rgb(236, 43, 138);'>温馨提示：绑定成功后需要重新登录哦！</div>";
            h.confirm(
              N,
              {
                fn: function () {
                  window.open(
                    "https://login.10086.cn/account/bind.htm?backurl=" +
                      w.getWebAddress(),
                    ""
                  );
                },
              },
              A
            );
          } else {
            for (
              var N =
                  "<div><div style=' margin-left: 35px; margin-bottom: 10px;'>请选择AI豆扣减的手机账户:</div><select id='stc_accounts' style='margin-left: 35px; font-size: 14px;'>",
                i = 0;
              i < C.length;
              i++
            )
              N +=
                '<option value="' +
                C[i].userAccountID +
                '">' +
                C[i].userAccountID +
                "</option>";
            (N += "</select></div>"),
              h.confirm(N, {
                fn: function () {
                  (E.data[0].mobile = $("#stc_accounts").val()),
                    (y.FUNCODE = "rechargejf"),
                    E.initpage("stcMenu");
                },
              });
          }
        }
      }
    },
    T = function (b, N, T) {
      for (var k = b.menu, i = 0; i < k.length; i++)
        if ((g.joinJson(k[i], 0), "undefined" != typeof k[i].child))
          for (var M = 0; M < k[i].child.length; M++)
            g.joinJson(k[i].child[M], 0);
      for (var S = (b.menu, []), i = 0; i < b.menu.length; i++)
        if (b.menu[i].funcode == a) {
          for (var M = 0; M < b.menu[i].child.length; M++)
            c.indexOf(b.menu[i].child[M].funcode + "") > -1 &&
              S.push(b.menu[i].child[M]);
          for (var _ = 0, I = [], M = 0; M < b.menu[i].child.length; M++)
            c.indexOf(b.menu[i].child[M].funcode + "") > -1
              ? (0 == _ &&
                  I.push({
                    funcode: "040300",
                    inx: "rechargecredit",
                    name: "手机交费",
                  }),
                _++)
              : I.push(b.menu[i].child[M]);
          b.menu[i].child = I;
        }
      for (var j = w.getHiddenMenu(), i = 0; i < j.length; i++)
        if (c.indexOf(j[i].funcode + "") > -1) {
          for (var L = 0, M = 0; M < S.length; M++)
            if (j[i].funcode == S[M].funcode) {
              L++;
              break;
            }
          0 == L && S.push(j[i]);
        }
      if (S.length < 3)
        for (var D = 0, i = 0; i < S.length; i++)
          if ("040400" == S[i].funcode) {
            D = 1;
            break;
          }
      (y.CHARGEMENUS = S),
        $("#stcnavmenu").html(N({ data: b })),
        "2" != h.data[0].data.userType ? U() : $(".news-noread-tip").hide(),
        $("#shop_home").unbind(),
        $("#shop_home").bind("click", function () {
          {
            var a = this,
              c = $(a).attr("alis");
            $(a).attr("code");
          }
          C(c),
            stcEcode.pvTrack(c),
            h.initpage(c),
            $(".list-c1-son>li>a").removeClass("color-2"),
            E.starEntry(c);
        }),
        $(".list-c1-son>li>a").each(function () {
          var a = this;
          $(a).bind("click", function () {
            (y.MOBILEFLAG = ""),
              $.cookie("inx", "myorders", { secure: !0 }),
              $.cookie("inx2", "returnorderqry", { secure: !0 }),
              $("html,body").animate(
                { scrollTop: $("#stc_anchor").offset().top },
                1e3
              ),
              $(".list-c1-son>li>a").removeClass("color-2"),
              $(this).addClass("color-2");
            var c = $(a).attr("alis"),
              b = $(a).attr("hlink");
            if (
              (stcEcode.commTrack(c, !0, !1),
              stcEcode.pvTrack(c),
              "rechargejf" != c || !R(h.data[0].data))
            ) {
              var w = $(a).attr("code");
              C(c);
              var N = !0;
              if (
                ((y.UPGRADEPARAS = {}),
                N
                  ? E.getSysTime(function (a) {
                      v.getFuncAuthInfo(
                        function (v) {
                          A(v, a, w, T, function (a) {
                            if ("undefined" != typeof a)
                              h.initpage("stcUpgrade");
                            else if ("undefined" != typeof b && "1" == b) {
                              if (
                                "redeem" == c &&
                                "991" == h.data[0].data.provice
                              )
                                return void window.open(
                                  "https://jf.10086.cn/#/helpCenter?type=1"
                                );
                              window.open(g.getObject(w, 0).attr.href);
                            } else h.initpage(c);
                          });
                        },
                        function () {
                          h.initpage(c);
                        },
                        function () {
                          h.initpage(c);
                        }
                      );
                    })
                  : h.initpage(c),
                E.starEntry(c, "1"),
                "passwordmg" == $(a).attr("alis"))
              ) {
                var U = null,
                  f = $("#mainContain").attr("data-f");
                $(".list-c1-son>li>a").each(function (a, c) {
                  return $(c).attr("alis") == f ? ((U = $(c)), !1) : void 0;
                }),
                  null != U &&
                    ($(".list-c1-son>li>a").removeClass("color-2"),
                    U.addClass("color-2"));
              }
            }
          });
        }),
        ifThirdMenu();
    },
    U = function () {
      if (null == document.getElementById("newNumber")) {
        var a = $("#divLogin")[0],
          c = document.createElement("span");
        c.id = "mail";
        var g = document.createElement("span");
        (g.className = "news-number-pic"),
          $(c).click(function () {
            h.initpage("mynews");
          }),
          c.appendChild(g);
        var v = document.createElement("span");
        (v.className = "news-number"),
          (v.innerHTML = "消息0"),
          (v.id = "newNumber"),
          c.appendChild(v),
          a.appendChild(c);
        var req = {};
        (req.user_id = h.data[0].data.loginValue),
          b.unReadNewsNumber(
            req,
            function (a) {
              null != a && a.totalCount > 0
                ? $("#newNumber").html("消息" + a.totalCount)
                : $(".news-noread-tip").hide();
            },
            function () {
              $(".news-noread-tip").hide();
            },
            function () {
              $(".news-noread-tip").hide();
            }
          );
      }
    },
    k = function (a, c) {
      if ("" != y.CURRENTMENUS && "undefined" != typeof y.CURRENTMENUS) {
        for (var g = w.getHiddenMenu(), i = 0; i < g.length; i++)
          if (c == g[i].inx) {
            a = c;
            break;
          }
        for (var i = 0; i < y.CURRENTMENUS.menu.length; i++)
          if ("undefined" != typeof y.CURRENTMENUS.menu[i].child)
            for (var v = 0; v < y.CURRENTMENUS.menu[i].child.length; v++)
              if (c == y.CURRENTMENUS.menu[i].child[v].inx) {
                a = c;
                break;
              }
      }
      if ("" != y.CHARGEMENUS && "undefined" != typeof y.CHARGEMENUS)
        for (var i = 0; i < y.CHARGEMENUS.length; i++)
          if (c == y.CHARGEMENUS[i].inx) {
            a = c;
            break;
          }
      "passwordmg" == a
        ? (window.open(
            "https://login.10086.cn/account/modify_pwd.htm?backurl=http://shop.10086.cn/i/"
          ),
          h.initpage("home"))
        : "kdrecharge" == a
        ? (window.open(
            "http://www.qh.10086.cn/business/service/broadBand.html"
          ),
          h.initpage("home"))
        : h.initpage(a),
        "rechargecredit" == a || "rechargegprs" == a
          ? E.starEntry(a, "3")
          : E.starEntry(a, "2");
    };
  return {
    dealMenu: function (a, c, h) {
      T(a, c, h);
    },
    emit: function (a, c) {
      k(a, c);
    },
    isToLogin: function (a) {
      return C(a);
    },
    setUserForJf: function (a) {
      return R(a);
    },
  };
});
