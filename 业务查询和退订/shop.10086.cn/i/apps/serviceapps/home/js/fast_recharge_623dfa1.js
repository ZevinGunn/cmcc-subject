define(function (require) {
  function a(a) {
    var g;
    return (g =
      18 == a.length || 17 == a.length
        ? _pswInit18(a)
        : 13 == a.length
        ? h(a)
        : c(a));
  }
  function c(a) {
    return (
      a.length > 3 &&
        (a.length > 7
          ? ((a =
              a.substring(0, 3) +
              " " +
              a.substring(3, 7) +
              " " +
              a.substring(7, a.length)),
            a.length > 11 && (a = a.substring(0, 13)))
          : (a = a.substring(0, 3) + " " + a.substring(3, a.length))),
      a
    );
  }
  function h(a) {
    return (
      a.length > 1 &&
        (a.length > 5
          ? ((a =
              a.substring(0, 1) +
              " " +
              a.substring(1, 5) +
              " " +
              a.substring(5, a.length)),
            a.length > 11 &&
              ((a =
                a.substring(0, 1) +
                " " +
                a.substring(2, 6) +
                " " +
                a.substring(7, 11) +
                " " +
                a.substring(11, a.length)),
              a.length > 16 && (a = a.substring(0, 16))))
          : (a = a.substring(0, 1) + " " + a.substring(1, a.length))),
      a
    );
  }
  var g = [];
  (g[0] = "50"), (g[1] = "100"), (g[2] = "300"), (g[3] = "500");
  var _ = [],
    b = require("appmanage"),
    w = require("stcutil"),
    v = !0,
    C = function () {
      var c = Namespace("all.constant");
      $(".tel").focus(function () {
        $(this).val($(this).val().replace(/ /g, ""));
      }),
        $(".tel").keyup(function () {
          var a = $(this).attr("sign");
          y(a) && j();
          var c = $("#charge_tel").val();
          $("#charge_tel").css(
            "" == c ? { width: "165px" } : { width: "140px" }
          );
        }),
        $(".tel").blur(function () {
          var c = $(".tel").val().replace(/ /g, "");
          "" == c
            ? ($(".tel").attr("placeholder", "请输入11位移动手机号码"),
              $("#charge_tel").css({ width: "165px" }),
              $("#charge_tel_err").hide())
            : $("#charge_tel").css({ width: "140px" }),
            11 === c.length && (c = a(c)),
            $("#charge_tel").val(c),
            $("#charge_tel").css("color", "#333");
        }),
        $("#chargegprs_tel").focus(function () {
          $(this).val($(this).val().replace(/ /g, ""));
        }),
        $("#chargegprs_tel").keyup(function () {
          var a = $(this).attr("sign");
          y(a) && k();
          var c = $("#chargegprs_tel").val();
          $("#chargegprs_tel").css(
            "" == c ? { width: "165px" } : { width: "140px" }
          );
        }),
        $("#chargegprs_tel").blur(function () {
          var c = $("#chargegprs_tel").val().replace(/ /g, "");
          "" == c
            ? ($("#chargegprs_tel").attr(
                "placeholder",
                "请输入11位移动手机号码"
              ),
              $("#chargegprs_tel").css({ width: "165px" }),
              $("#chargegprs_tel_err").hide())
            : $("#chargegprs_tel").css({ width: "140px" }),
            11 === c.length && (c = a(c)),
            $("#chargegprs_tel").val(c),
            $("#chargegprs_tel").css("color", "#333");
        }),
        $(".rechargecredit-level").delegate("a", "click", function () {
          $(this).addClass("active").siblings("a").removeClass("active");
        }),
        $("#fare_btn").click(function () {
          var a = "charge",
            h = 0,
            g = $("#" + a + "_tel").val();
          (void 0 == g || "" == g) &&
            (h++,
            $("#" + a + "_tel").attr("placeholder", ""),
            $("#" + a + "_tel_err").text("请输入11位移动手机号码"),
            $("#" + a + "_tel_err").show());
          var _ = E(a);
          v || h++,
            !h > 0 &&
              (stcEcode.commTrack("UCenter_Content_LJCZ", !1),
              (c.CHARGEPHONE = _.telephone),
              (c.CHARGEAMOUNT = $(".link-group  a.active").attr("amount")),
              b.initpage("rechargecredit"));
        }),
        $(".rechargegprs-level").delegate("a", "click", function () {
          $(this).addClass("active").siblings("a").removeClass("active");
        }),
        $("#rechargegprs-btn").click(function () {
          (c.CHARGEPHONE = $("#chargegprs_tel").val()),
            (c.CHARGEAMOUNT = $(".rechargegprs-level a.active").attr("amount")),
            b.initpage("rechargegprs");
        }),
        $("#stc_chargecent").on(
          "click",
          ".js_ued_tab .nav-tab li",
          function () {
            $(this).addClass("curr").siblings().removeClass("curr");
            var a = $(this).index(),
              c = $(this).width(),
              h = a * c;
            $(this)
              .parent()
              .parent()
              .siblings(".tab-content")
              .find(".tab-pane")
              .eq(a)
              .addClass("on")
              .siblings()
              .removeClass("on"),
              $(this)
                .parent()
                .siblings(".tab-arrow")
                .stop(!0, !1)
                .animate({ left: h }, 350);
          }
        ),
        require(["appmanage"], function (c) {
          var h = c.data[0].mobile;
          if ("1" == c.data[0].data.userType && h == c.data[0].data.loginValue)
            $("#charge_tel").css({ width: "165px" }),
              $("#chargegprs_tel").val(""),
              $("#chargegprs_tel").css({ width: "165px" });
          else {
            var g = a(h);
            $("#charge_tel").val(g),
              $("#charge_tel").css("color", "#333"),
              $("#charge_tel").css({ width: "140px" }),
              $("#chargegprs_tel").val(g),
              $("#chargegprs_tel").css("color", "#333"),
              $("#chargegprs_tel").css({ width: "140px" }),
              k(),
              j();
          }
        });
    },
    k = function () {
      require(["/i/service/model/user_a79371f.js"], function (a) {
        var req = {},
          c =
            ($("#chargegprs_tel").attr("sign"),
            $("#chargegprs_tel").val().replace(/ /g, ""));
        $("#chargegprs_tel_err").css(
          "background",
          "url(/i/nresource/image/icon-info.png) left 5px no-repeat"
        ),
          "" != c && void 0 != c
            ? a.getUserBelongInfo(
                c,
                function (a) {
                  $("#rechargegprs-btn").removeAttr("disabled"),
                    (v = !0),
                    (req.provCode = a.prov_cd),
                    $("#chargegprs_tel_err")
                      .text(a.id_name_cd)
                      .css(
                        "background",
                        "url(/i/nresource/image/icon-info.png) left 5px no-repeat"
                      ),
                    $("#chargegprs_tel_err").show(),
                    z(req);
                },
                function (a) {
                  $("#min_discount").text(""),
                    (v = !1),
                    $("#rechargegprs-btn").attr("disabled", "disabled"),
                    "700001" == a
                      ? ($("#chargegprs_tel_err")
                          .text("请输入移动手机号码")
                          .css("background", "none"),
                        $("#chargegprs_tel_err").show())
                      : ($("#chargegprs_tel_err")
                          .text("系统繁忙，请稍后再试！")
                          .css("background", "none"),
                        $("#chargegprs_tel_err").show());
                },
                function () {
                  $("#min_discount").text(""),
                    (v = !1),
                    $("#chargegprs_tel_err")
                      .text("请输入中国移动手机号码")
                      .css("background", "none"),
                    $("#chargegprs_tel_err").show(),
                    $("#rechargegprs-btn").attr("disabled", "disabled");
                }
              )
            : require(["/i/service/model/user_a79371f.js"], function (a) {
                a.getAreaCodeByIp(
                  function (a) {
                    var c = "";
                    (c = "undefined" != typeof a.provCode ? a.provCode : "100"),
                      (req.provCode = c),
                      z(req);
                  },
                  function () {
                    var a = A();
                    void 0 == a && (a = "100"), (req.provCode = a), z(req);
                  },
                  function () {
                    var a = A();
                    void 0 == a && (a = "100"), (req.provCode = a), z(req);
                  }
                );
              });
      });
    },
    j = function () {
      require(["/i/service/model/user_a79371f.js"], function (a) {
        var req = {},
          c = $(".tel").attr("sign"),
          h = $(".tab-content .on .tel").val().replace(/ /g, "");
        $("#" + c + "_tel_err").css(
          "background",
          "url(/i/nresource/image/icon-info.png) left 5px no-repeat"
        ),
          "" != h && void 0 != h
            ? a.getUserBelongInfo(
                h,
                function (a) {
                  $(".ued-btn").removeAttr("disabled"),
                    (v = !0),
                    (req.provCode = a.prov_cd),
                    $("#" + c + "_tel_err")
                      .text(a.id_name_cd)
                      .css(
                        "background",
                        "url(/i/nresource/image/icon-info.png) left 5px no-repeat"
                      ),
                    $("#" + c + "_tel_err").show(),
                    z(req);
                },
                function (a) {
                  $("#min_discount").text(""),
                    (v = !1),
                    $(".ued-btn").attr("disabled", "disabled"),
                    "700001" == a
                      ? ($("#" + c + "_tel_err")
                          .text("请输入移动手机号码")
                          .css("background", "none"),
                        $("#" + c + "_tel_err").show())
                      : ($("#" + c + "_tel_err")
                          .text("系统繁忙，请稍后再试！")
                          .css("background", "none"),
                        $("#" + c + "_tel_err").show());
                },
                function () {
                  $("#min_discount").text(""),
                    (v = !1),
                    $("#" + c + "_tel_err")
                      .text("请输入中国移动手机号码")
                      .css("background", "none"),
                    $("#" + c + "_tel_err").show(),
                    $(".ued-btn").attr("disabled", "disabled");
                }
              )
            : require(["/i/service/model/user_a79371f.js"], function (a) {
                a.getAreaCodeByIp(
                  function (a) {
                    var c = "";
                    (c = "undefined" != typeof a.provCode ? a.provCode : "100"),
                      (req.provCode = c),
                      z(req);
                  },
                  function () {
                    var a = A();
                    void 0 == a && (a = "100"), (req.provCode = a), z(req);
                  },
                  function () {
                    var a = A();
                    void 0 == a && (a = "100"), (req.provCode = a), z(req);
                  }
                );
              });
      });
    },
    A = function () {
      for (
        var a, c = document.cookie, h = c.split("; "), i = 0;
        i < h.length;
        i++
      ) {
        var g = h[i].split("=");
        if (2 <= g.length && "CmLocation" == g[0]) {
          var _ = g[1],
            b = _.split("|");
          if (2 <= b.length)
            for (var w = b[0], i = 0; i < H.length; i++)
              if (H[i].code == w || H[i].abbr == w) {
                a = H[i].code;
                break;
              }
          break;
        }
      }
      return a;
    },
    y = function (a) {
      var c = $("#" + a + "_tel").val();
      return (
        (c = c.replace(/ /g, "")),
        $("#" + a + "_tel_err").css(
          "background",
          "url(/i/nresource/image/icon-info.png) left 5px no-repeat"
        ),
        "" == c
          ? ($("#" + a + "_tel_err").hide(),
            $(".ued-btn").removeAttr("disabled"),
            $("#rechargegprs-btn").removeAttr("disabled"),
            !0)
          : c.length < 11
          ? ((v = !1),
            $("#" + a + "_tel_err")
              .text("手机号码位数不够")
              .css("background", "none"),
            $("#" + a + "_tel_err").show(),
            $(".ued-btn").attr("disabled", "disabled"),
            $("#rechargegprs-btn").attr("disabled", "disabled"),
            !1)
          : w.forMobil(c)
          ? ((v = !0),
            $("#" + a + "_tel_err").css(
              "background",
              "url(/i/nresource/image/icon-info.png) left 5px no-repeat"
            ),
            $("#" + a + "_tel_err").hide(),
            $(".ued-btn").removeAttr("disabled"),
            $("#rechargegprs-btn").removeAttr("disabled"),
            !0)
          : ((v = !1),
            $("#" + a + "_tel_err")
              .text("请输入正确的手机号码")
              .css("background", "none"),
            $("#" + a + "_tel_err").show(),
            $(".ued-btn").attr("disabled", "disabled"),
            $("#rechargegprs-btn").attr("disabled", "disabled"),
            !1)
      );
    },
    E = function (a) {
      var c = {};
      return (
        (c.telephone = $("#" + a + "_tel").val()),
        (c.amount =
          "charge" == a
            ? g[$(".tab-content  .on .link-group a.active").attr("i")]
            : $(".tab-content  .on .link-group a.active").text()),
        c
      );
    },
    z = function (req) {
      $("#min_discount").text(""),
        require(["/i/service/model/recharge_15cca2a.js"], function (a) {
          req.channel = "00";
          var c = [],
            h = g[$(".link-group a.active").attr("i")];
          a.getFastRechargePro(
            req,
            function (a) {
              for (var i = 0; i < a.length; i++)
                c[a[i].money_sum] = a[i].special_offer;
              _[req.provCode] = c;
              var g = void 0 != c[h] ? "交费" + c[h] : "";
              $("#min_discount").text(g);
            },
            function () {},
            function () {}
          );
        });
    },
    H = [
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
    ];
  return {
    getFastRecharge: function () {
      C();
    },
  };
});
