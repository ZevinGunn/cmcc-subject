define(function (require) {
  var a,
    c,
    h = require("stcutil"),
    g = {
      width: "21px",
      height: "13px",
      display: "inline-block",
      "margin-left": "5px",
      cursor: "pointer",
    },
    _ = function (a, c) {
      require([
        "appmanage",
        "/i/apps/pageapps/ptop/tpl/userinfo_00b457d.js",
      ], function (y, b) {
        var C = h.encryption(y.data[0].mobile);
        (y.data[0].haveuse = a), (y.data[0].haveclick = c);
        var k = $.extend(!0, { mobile2: C }, y.data[0]);
        $("#stc_user_info").html(b({ data: k, type: "userinfo" }));
        {
          var j = $("#stc_welcome");
          $("#stc_careLang");
        }
        h.getSysDate(function (a) {
          var c = a.getHours();
          $(j).html(
            c > 10 && 14 > c
              ? "中午好，"
              : c >= 14 && 18 > c
              ? "下午好，"
              : c >= 18 && 24 > c
              ? "晚上好，"
              : "早上好，"
          );
        }),
          "0" == y.data[0].data.userType &&
            ($("#loginStr").html($(".selItem").text()),
            $("#loginStr").attr("title", $(".selItem").text())),
          $("#eyes")
            .off("click")
            .on("click", function () {
              "undefined" == typeof y.data[0].haveuse
                ? v()
                : "1" == y.data[0].haveuse &&
                  ("1" == y.data[0].haveclick
                    ? _(1, 0)
                    : "0" == y.data[0].haveclick && _(1, 1));
            }),
          $("#eyes").css(g),
          $("#eyes").removeClass("eyesclose").addClass("eyesopen"),
          0 == y.data[0].haveclick || null == y.data[0].haveclick
            ? $("#eyes").removeClass("eyesopen").addClass("eyesclose")
            : $("#eyes").removeClass("eyesclose").addClass("eyesopen");
      });
    },
    v = function () {
      "undefined" != typeof a && clearTimeout(a),
        require([
          "appmanage",
          "/i/service/model/fee_7871fe8.js",
          "pluspop",
        ], function (g, v, b) {
          b.remotehtml("/i/apps/pageapps/ptop/showvec.html", {}, function (v) {
            (c = v),
              $("#ptop_phone").html(h.encryption(g.data[0].mobile)),
              $(".dialog-header-r")
                .parent()
                .parent()
                .parent()
                .attr("style", "padding:0px;"),
              (config.send_sms = $("#stc-send-sms2")),
              (config.sms_count = $("#stc-jf-sms-count2")),
              $(config.send_sms).on("click", function () {
                var c = 60;
                $(config.send_sms).hide(),
                  $(config.sms_count).html(c),
                  $(config.sms_count).parent().show(),
                  (a = setTimeout(function () {
                    y(c);
                  }, 1e3)),
                  $("#failremind2").addClass("dis-hide"),
                  $(this).attr("getcode", 1),
                  $("#error2").addClass("dis-hide").find("#tip2").html(""),
                  b(g.data[0].mobile);
              });
            var b = function (a) {
                var req = {};
                (req.phoneNo = a),
                  require(["/i/service/model/coupon_1a10fc1.js"], function (a) {
                    a.sms(
                      req,
                      function (a) {
                        $("#vecbtn2").on("click", function () {
                          $("#error2")
                            .addClass("dis-hide")
                            .find("#tip2")
                            .html(""),
                            C(a);
                        });
                      },
                      function () {
                        alert("发送失败");
                      },
                      function () {
                        alert("请重新获取");
                      }
                    );
                  });
              },
              C = function (a) {
                var req = {};
                (req.phoneNo = g.data[0].mobile),
                  (req.serialNo = a),
                  (req.smsCode = $("#vec_smspasswd2").val());
                var h = !1;
                require(["/i/service/model/coupon_1a10fc1.js"], function (a) {
                  a.smsvalid(
                    req,
                    function () {
                      (h = !0),
                        h &&
                          (c.remove(),
                          _(1, 1),
                          $("#loginStr").html(g.data[0].mobile),
                          $("#loginStr").attr("title", g.data[0].mobile));
                    },
                    function () {
                      alert("验证失败");
                    },
                    function () {
                      alert("验证错误");
                    }
                  );
                });
              };
            $("#vecClose2").on("click", function () {
              c.remove();
            }),
              $(".dialog-close").on("click", function () {
                c.remove();
              }),
              $("#vec_smspasswd2")
                .on("focus", function () {
                  $("#detailerrmsg2").html(""),
                    "1" == $(config.send_sms).attr("getcode") &&
                      $(this).triggerHandler("blur");
                })
                .on("keyup", function () {
                  6 == $(this).val().length &&
                    "1" == $(config.send_sms).attr("getcode") &&
                    $(this).triggerHandler("blur");
                })
                .on("blur", function () {
                  var a = $(this);
                  setTimeout(function () {
                    "1" == $(config.send_sms).attr("getcode")
                      ? 6 == a.val().length
                        ? ($("#error2")
                            .addClass("dis-hide")
                            .find("#tip2")
                            .html(""),
                          $("#vecbtn2")
                            .removeClass("ued-small-gey")
                            .addClass("ued-btn-small")
                            .removeAttr("disabled"))
                        : 0 == a.val().length
                        ? ($("#error2")
                            .addClass("dis-hide")
                            .find("#tip2")
                            .html(""),
                          $("#vecbtn2")
                            .removeClass("ued-btn-small")
                            .addClass("ued-small-gey")
                            .attr("disabled", "disabled"))
                        : ($("#error2")
                            .removeClass("dis-hide")
                            .find("#tip2")
                            .html("短信密码不能多于或少于6位"),
                          $("#vecbtn2")
                            .removeClass("ued-btn-small")
                            .addClass("ued-small-gey")
                            .attr("disabled", "disabled"))
                      : a.val().length > 0 &&
                        $("#error2")
                          .removeClass("dis-hide")
                          .find("#tip2")
                          .html("请获取短信验证码后输入");
                  }, 0);
                });
          });
        });
    },
    y = function (c) {
      var h = c;
      h--,
        h > 0
          ? ($(config.sms_count).html(h),
            (a = setTimeout(function () {
              y(h);
            }, 1e3)))
          : ($(config.send_sms).show(),
            $(config.send_sms).html("重新获取"),
            $(config.sms_count).parent().hide(),
            clearTimeout(a));
    },
    b = function () {
      ui_lhlog(".js_lhlog", ".js_x_close", ".thick-content"),
        $(".js_select").off(),
        $(".js_select").on("click", function (a) {
          a.stopPropagation(), $(this).find(".js_selList").toggle();
        }),
        $(".js_selList li").off(),
        $(".js_selList li").on("click", function () {
          {
            var a = $(this).text();
            $(this).attr("class");
          }
          $(this).closest(".js_select").find(".js_selItem").text(a),
            require(["appmanage"], function (c) {
              (c.data[0].mobile = a), c.initpage("stcMenu"), c.initpage("home");
            });
        });
    },
    C = function (a, c) {
      var h = a.getFullYear(),
        $ = a.getMonth(),
        g = c.getFullYear(),
        _ = c.getMonth(),
        v = 12 * h + $ - (12 * g + _),
        y = v % 12,
        b = (v - (v % 12)) / 12;
      return b > 0 ? b + "年" + y + "个月" : y + "个月";
    },
    k = function (a) {
      var c = "";
      switch (a) {
        case "1":
          c = "银卡";
          break;
        case "2":
          c = "金卡";
          break;
        case "3":
          c = "白金卡";
          break;
        case "4":
          c = "钻石卡";
          break;
        case "5":
          c = "钻石卡";
      }
      return c;
    },
    j = function () {
      require([
        "appmanage",
        "/i/service/model/user_a79371f.js",
        "/i/apps/pageapps/ptop/tpl/userinfo_00b457d.js",
      ], function (a, c, g) {
        h.getSysDate(function (_) {
          var v = a.data[0].data,
            y = v.userType;
          "1" == y
            ? ("998" != v.provice &&
                ($("#stc_user_acc").html(g({ type: "1" })),
                $("#stc_reg_acc").click(function () {
                  window.open("https://login.10086.cn/account/bind.htm");
                })),
              c.getInfoAccess(
                function (a) {
                  var c = C(_, new Date(h.formartStr2Date(a.registerTime)));
                  "undefined" != typeof a.netAge && (c = a.netAge),
                    $("#stc_net_age").html(c);
                },
                function () {
                  $("#stc_net_age").addClass("color-1").html("获取失败");
                },
                function () {
                  $("#stc_net_age").addClass("color-1").html("获取失败");
                }
              ))
            : "0" == y &&
              ($("#stc_user_acc").html(g({ type: "0" })),
              c.getMobileInfo(
                function (a) {
                  var c = 0,
                    g = 5,
                    _ = 0;
                  "undefined" != typeof a.starLevel &&
                    ((_ = parseInt(a.starLevel)),
                    _ >= 5 ? ((c = 5), (g = 0)) : ((c = _), (g = 5 - c))),
                    $("div.js_hover2").hover(
                      function () {
                        $(this).children(".js_hoverCont").show();
                      },
                      function () {
                        $(this).children(".js_hoverCont").hide();
                      }
                    ),
                    "100" == v.provice
                      ? _ > 0 && 3 >= _
                        ? L(_, c, a)
                        : $("#stc_user_acc ul li:first").addClass("none")
                      : L(_, c, a),
                    "09" != a.brand &&
                      "02" != a.brand &&
                      $("#stc_user_bland").html(
                        h.getBrandName(a.brand) +
                          k(a.gsmState) +
                          "&nbsp;|&nbsp;"
                      );
                },
                function () {
                  $("#stc_rank_info")
                    .empty()
                    .addClass("color-1")
                    .html("获取失败"),
                    $("#stc_user_bland")
                      .html("品牌获取失败")
                      .addClass("color-1");
                },
                v.loginValue
              ),
              c.getPackagesInfo(
                v.loginValue,
                function (a) {
                  $("#stc_cur_packages").html(a.curPlanName);
                },
                function () {
                  $("#stc_cur_packages").html("获取失败").addClass("color-1");
                }
              ));
        });
      });
    },
    w = function (a) {
      require([
        "appmanage",
        "/i/apps/pageapps/ptop/tpl/userinfo_00b457d.js",
      ], function (c, y) {
        var b = h.encryption(c.data[0].mobile),
          C = $.extend(!0, { mobile2: b }, c.data[0]);
        $("#stc_user_info").html(y({ data: C, type: "userinfo" }));
        var k = $("#stc_welcome"),
          j = ($("#stc_careLang"), parseInt(a.substring(8, 10)));
        $(k).html(
          j > 10 && 14 > j
            ? "中午好，"
            : j >= 14 && 18 > j
            ? "下午好，"
            : j >= 18 && 24 > j
            ? "晚上好，"
            : "早上好，"
        ),
          $("#eyes").css(g),
          $("#eyes").removeClass("eyesopen").addClass("eyesclose"),
          0 == c.data[0].haveclick || null == c.data[0].haveclick
            ? $("#eyes").removeClass("eyesopen").addClass("eyesclose")
            : $("#eyes").removeClass("eyesclose").addClass("eyesopen"),
          "0" == c.data[0].data.userType &&
            ($("#loginStr").html($(".selItem").text()),
            $("#loginStr").attr("title", $(".selItem").text())),
          $("#eyes")
            .off("click")
            .on("click", function () {
              void 0 == c.data[0].haveuse
                ? v()
                : "1" == c.data[0].haveuse
                ? "1" == c.data[0].haveclick
                  ? _(1, 0)
                  : "0" == c.data[0].haveclick
                  ? _(1, 1)
                  : alert("出错了")
                : alert("出错啦");
            });
      });
    },
    I = function () {
      ui_lhlog(".js_lhlog", ".js_x_close", ".thick-content"),
        $(".js_select").off(),
        $(".js_select").on("click", function (a) {
          a.stopPropagation(), $(this).find(".js_selList").toggle();
        }),
        $(".js_selList li").off(),
        $(".js_selList li").on("click", function () {
          {
            var a = $(this).text();
            $(this).attr("class");
          }
          $(this).closest(".js_select").find(".js_selItem").text(a),
            require(["appmanage"], function (c) {
              (c.data[0].mobile = a), c.initpage("stcMenu"), c.initpage("home");
            });
        });
    },
    S = function (a, c) {
      var h = a.getFullYear(),
        $ = a.getMonth(),
        g = c.getFullYear(),
        _ = c.getMonth(),
        v = 12 * h + $ - (12 * g + _),
        y = v % 12,
        b = (v - (v % 12)) / 12;
      return b > 0 ? b + "年" + y + "个月" : y + "个月";
    },
    T = function (a, c, g) {
      require([
        "appmanage",
        "/i/service/model/user_a79371f.js",
        "/i/apps/pageapps/ptop/tpl/userinfo_00b457d.js",
      ], function (_, v, y) {
        var b = _.data[0].data,
          C = b.userType;
        if ("1" == C)
          "998" != b.provice &&
            ($("#stc_user_acc").html(y({ type: "1" })),
            $("#stc_reg_acc").click(function () {
              window.open("https://login.10086.cn/account/bind.htm");
            })),
            v.getInfoAccess(
              function (c) {
                var g = S(
                  new Date(h.formartStr2Date(a)),
                  new Date(h.formartStr2Date(c.registerTime))
                );
                "undefined" != typeof c.netAge && (g = c.netAge),
                  $("#stc_reg_acc").click(function () {
                    window.open("https://login.10086.cn/account/bind.htm");
                  }),
                  $("#stc_net_age").html(g);
              },
              function () {
                $("#stc_net_age").addClass("color-1").html("获取失败");
              },
              function () {
                $("#stc_net_age").addClass("color-1").html("获取失败");
              }
            );
        else if ("0" == C) {
          $("#stc_user_acc").html(y({ type: "0" }));
          var j = 0,
            w = 5,
            I = 0;
          "undefined" != typeof c.starLevel &&
            ((I = parseInt(c.starLevel)),
            I >= 5 ? ((j = 5), (w = 0)) : ((j = I), (w = 5 - j))),
            $("div.js_hover2").hover(
              function () {
                $(this).children(".js_hoverCont").show();
              },
              function () {
                $(this).children(".js_hoverCont").hide();
              }
            ),
            "100" == b.provice
              ? I > 0 && 3 >= I
                ? L(I, j, c)
                : $("#stc_user_acc ul li:first").addClass("none")
              : L(I, j, c),
            "09" != c.brand &&
              "02" != c.brand &&
              $("#stc_user_bland").html(
                h.getBrandName(c.brand) + k(c.gsmState) + "&nbsp;|&nbsp;"
              ),
            $("#stc_cur_packages").html(g.curPlanName);
        }
      });
    },
    L = function (a, c, h) {
      6 > a
        ? $("#stc_rank_info")
            .children()
            .each(function (h) {
              c > h && $(this).addClass("pngfix"),
                $(".stc-level").html(a + "星级");
            })
        : 6 == a
        ? $("#stc_rank_info")
            .children()
            .each(function () {
              $(this).removeClass("star").addClass("ued-ministar1"),
                $(".stc-level").html("五星金");
            })
        : a > 6 &&
          $("#stc_rank_info")
            .children()
            .each(function () {
              $(this).removeClass("star").addClass("ued-ministar2"),
                $(".stc-level").html("五星钻");
            }),
        0 == a && $(".stc-level").html("无星级"),
        h && h.starScore && $("#mylevel").text(h.starScore);
    },
    D = function () {
      require(["/i/service/model/user_a79371f.js", "appmanage"], function (
        a,
        c
      ) {
        var req = { user: c.data[0].mobile },
          h = c.data[0].data.userType;
        "0" == h
          ? a.getMergeInfo(
              req,
              function (a) {
                I(),
                  w(a.sysTime),
                  T(a.sysTime, a.custInfoQryOut, a.curPlanQryOut);
              },
              function () {
                b(), _(), j();
              },
              function () {
                b(), _(), j();
              }
            )
          : (b(), _(), j());
      });
    };
  return {
    initpage: function () {
      D();
    },
  };
});
