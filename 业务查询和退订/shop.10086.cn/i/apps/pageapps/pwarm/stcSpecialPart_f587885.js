define(function (require) {
  var a = Namespace("all.constant"),
    c = require("appmanage"),
    h = require("stcutil"),
    _ = require("/i/service/model/user_a79371f.js"),
    w = function () {
      for (
        var a = "100", c = document.cookie, $ = c.split("; "), i = 0;
        i < $.length;
        i++
      ) {
        var h = $[i].split("=");
        if (2 <= h.length && "CmLocation" == h[0]) {
          var _ = h[1],
            w = _.split("|");
          2 <= w.length && (a = w[0]);
          break;
        }
      }
      return a;
    },
    g = function (_, g) {
      var v,
        T,
        req = { areaID: "", provCode: _.provCode, channel: "00" },
        C = h.getProvince(
          c.data[0].data,
          c.data[0].data.userType,
          c.data[0].data.loginValue,
          c.data[0].mobile
        ),
        I = "/i/nresource/image/img-01.jpg";
      ("999" == C || "000" == C) && (C = w()),
        (req.provCode = C),
        $("#stc_opertaion_tip").addClass("none"),
        $("#stc-module-banner").removeClass("stc-confirm-record").off("click"),
        "dhome" == g.inx
          ? ($("#rechargelove").on("click", function () {
              return (
                stcEcode.commTrack("UCenter_HOME_rechargelove", !1),
                c.initpage("rechargelove"),
                !1
              );
            }),
            $("#rechargejf").on("click", function () {
              return (
                stcEcode.commTrack("UCenter_HOME_rechargejf", !1),
                c.initpage("rechargejf"),
                !1
              );
            }),
            $("#threePrefer").on("click", function () {
              return (
                stcEcode.commTrack("UCenter_HOME_noractivys", !1),
                (window.location.href = "/i/noractivys.html"),
                !1
              );
            }),
            require(["/i/service/model/user_a79371f.js"], function (a) {
              a.getOperationInfo(
                function (a) {
                  if (((T = a[g.funcode]), !$.isEmptyObject(T)))
                    for (var i = 0; i < T.length; i++) {
                      v = T[i];
                      for (var c = 0; c < v.picItems.length; c++) {
                        $($("#stc-unlogin-opr").children().eq(c))
                          .children()
                          .eq(0)
                          .attr("src", v.picItems[c].picUrl);
                        var h = v.picItems[c].linkUrl,
                          _ = v.picItems[c].picID;
                        $.isEmptyObject(h) ||
                          "" == h ||
                          ($("#stc-unlogin-opr")
                            .children()
                            .eq(c)
                            .attr("tlink", h),
                          $("#stc-unlogin-opr")
                            .children()
                            .eq(c)
                            .attr("tpId", _)),
                          $("#stc-unlogin-opr")
                            .children()
                            .each(function () {
                              $.isEmptyObject($(this).attr("tlink")) ||
                                "" == $(this).attr("tlink") ||
                                $(this)
                                  .off("click")
                                  .on("click", function () {
                                    return (
                                      stcEcode.commTrack(
                                        "UCenter_HOME_" + $(this).attr("tpId"),
                                        !1
                                      ),
                                      (window.location.href =
                                        $(this).attr("tlink")),
                                      !1
                                    );
                                  });
                            });
                      }
                    }
                },
                function () {},
                function () {},
                _.mobile,
                req
              );
            }))
          : h.inArray(g.inx, [
              "packremainqry",
              "rechargecredit",
              "rechargecard",
              "rechargejf",
              "rechargelove",
            ]) &&
            ($("#stc-module-banner").removeClass("stc-confirm-record"),
            h.inArray(g.inx, [
              "rechargecredit",
              "rechargecard",
              "rechargejf",
            ]) &&
              ($("#stc_opertaion_tip").removeClass("none"),
              $("#stc-module-banner").attr("src", I),
              $("#stc-module-banner").off("click")),
            require(["/i/service/model/user_a79371f.js"], function (c) {
              c.getOperationInfo(
                function (c) {
                  if (((T = c[g.funcode]), !$.isEmptyObject(T))) {
                    h.inArray(g.inx, ["rechargelove"]) ||
                      (1 != a.CHARGE_STATU &&
                        $("#stc_opertaion_tip").removeClass("none"));
                    for (var i = 0; i < T.length; i++) {
                      v = T[i];
                      for (var _ = 0; _ < T[i].picItems.length; _++) {
                        var w = v.picItems[_].picUrl;
                        if (!$.isEmptyObject(w) && "" != w)
                          if ("rechargelove" == g.inx)
                            $(".stc-rl-banner").find("img").attr("src", w);
                          else {
                            $("#stc-module-banner").attr("src", w);
                            var C = v.picItems[_].linkUrl,
                              I = v.picItems[_].picID;
                            $.isEmptyObject(C) ||
                              "" == C ||
                              ($("#stc-module-banner").addClass(
                                "stc-confirm-record"
                              ),
                              $("#stc-module-banner").on("click", function () {
                                return (
                                  stcEcode.commTrack(
                                    "UCenter_" + g.inx + "_" + I,
                                    !1
                                  ),
                                  (window.location.href = C),
                                  !1
                                );
                              }));
                          }
                      }
                    }
                  }
                },
                function () {
                  h.inArray(g.inx, [
                    "rechargecredit",
                    "rechargecard",
                    "rechargejf",
                  ]) &&
                    ($("#stc_opertaion_tip").removeClass("none"),
                    $("#stc-module-banner").attr("src", I),
                    $("#stc-module-banner").off("click"));
                },
                function () {
                  h.inArray(g.inx, [
                    "rechargecredit",
                    "rechargecard",
                    "rechargejf",
                  ]) &&
                    ($("#stc_opertaion_tip").removeClass("none"),
                    $("#stc-module-banner").attr("src", I),
                    $("#stc-module-banner").off("click"));
                },
                _.mobile,
                req
              );
            }));
    },
    v = function (c, h, _) {
      $("#stc_warm_tip").empty(),
        "070000" != _ &&
          require([
            "/i/apps/pageapps/pwarm/tpl/warmtip_444a516.js",
            "/i/apps/pageapps/pwarm/tpl/noractivy_661d963.js",
            "/i/service/model/user_a79371f.js",
          ], function (w, g, v) {
            a.DEFALTWARMTIP
              ? v.getWarmTip(
                  function (c) {
                    "undefined" != typeof c[_] &&
                    "" != $.trim(c[_]) &&
                    null != c[_]
                      ? ($("#stc_warm_tip").html("180000" == _ ? g() : w()),
                        $("#stc_warm_content").html(c[_]),
                        "180002" == _ && $("#gprsfloor-warm").html(c[_]),
                        "180001" == _ && $("#arrow-top-warm").html(c[_]),
                        $("#stars-active-warm").html(c[_]),
                        "180010" == _ && $("#sc-area-warm").html(c[_]),
                        "180009" == _ && $("#wg-warmtip").html(c[_]),
                        "180011" == _ && $("#sm-area-warm").html(c[_]),
                        "180013" == _ && $("#fp-warm-content").html(c[_]),
                        "180014" == _ && $("#fp-warm-content").html(c[_]),
                        "180015" == _ && $("#fp-warm-content").html(c[_]),
                        ("180016" == _ || "180017" == _) &&
                          $("#fp-warm-content").html(c[_]),
                        "020600" == _ && $("#stc_warm_tip").addClass("none"),
                        "040900" == _ && $("#stc_warm_tip").addClass("none"))
                      : null == c[_] &&
                        null != a.DEFALTWARMTIP[_] &&
                        "" != $.trim(a.DEFALTWARMTIP[_]) &&
                        ($("#stc_warm_tip").html("180000" == _ ? g() : w()),
                        $("#stc_warm_content").html(a.DEFALTWARMTIP[_]),
                        "180002" == _ &&
                          $("#gprsfloor-warm").html(a.DEFALTWARMTIP[_]),
                        "180001" == _ &&
                          $("#arrow-top-warm").html(a.DEFALTWARMTIP[_]),
                        $("#stars-active-warm").html(a.DEFALTWARMTIP[_]),
                        "180010" == _ &&
                          $("#sc-area-warm").html(a.DEFALTWARMTIP[_]),
                        "180009" == _ && $("#wg-warmtip").html(c[_]),
                        "180011" == _ && $("#sm-area-warm").html(c[_]),
                        "180013" == _ && $("#fp-warm-content").html(c[_]),
                        "180014" == _ && $("#fp-warm-content").html(c[_]),
                        "180015" == _ && $("#fp-warm-content").html(c[_]),
                        ("180016" == _ || "180017" == _) &&
                          $("#fp-warm-content").html(c[_]),
                        "020600" == _ && $("#stc_warm_tip").addClass("none"),
                        "040900" == _ && $("#stc_warm_tip").addClass("none")),
                      "020300" == _ && $("#stc_warm_tip").addClass("none");
                  },
                  function () {},
                  function () {},
                  c,
                  h
                )
              : v.getWarmTip(
                  function (T) {
                    (a.DEFALTWARMTIP = T),
                      v.getWarmTip(
                        function (a) {
                          "undefined" != typeof a[_] &&
                          "" != $.trim(a[_]) &&
                          null != a[_]
                            ? ($("#stc_warm_tip").html(
                                "180000" == _ ? g() : w()
                              ),
                              $("#stc_warm_content").html(a[_]),
                              "180002" == _ && $("#gprsfloor-warm").html(a[_]),
                              "180001" == _ && $("#arrow-top-warm").html(a[_]),
                              $("#stars-active-warm").html(a[_]),
                              "180010" == _ && $("#sc-area-warm").html(a[_]),
                              "180009" == _ && $("#wg-warmtip").html(a[_]),
                              "180011" == _ && $("#sm-area-warm").html(a[_]),
                              "180013" == _ && $("#fp-warm-content").html(a[_]),
                              "180014" == _ && $("#fp-warm-content").html(a[_]),
                              "180015" == _ && $("#fp-warm-content").html(a[_]),
                              ("180016" == _ || "180017" == _) &&
                                $("#fp-warm-content").html(a[_]),
                              "020600" == _ &&
                                $("#stc_warm_tip").addClass("none"),
                              "040900" == _ &&
                                $("#stc_warm_tip").addClass("none"))
                            : null == a[_] &&
                              null != T[_] &&
                              "" != $.trim(T[_]) &&
                              ($("#stc_warm_tip").html(
                                "180000" == _ ? g() : w()
                              ),
                              $("#stc_warm_content").html(T[_]),
                              "180002" == _ && $("#gprsfloor-warm").html(T[_]),
                              "180001" == _ && $("#arrow-top-warm").html(T[_]),
                              $("#stars-active-warm").html(T[_]),
                              "180010" == _ && $("#sc-area-warm").html(T[_]),
                              "180009" == _ && $("#wg-warmtip").html(a[_]),
                              "180011" == _ && $("#sm-area-warm").html(a[_]),
                              "180013" == _ && $("#fp-warm-content").html(a[_]),
                              "180014" == _ && $("#fp-warm-content").html(a[_]),
                              "180015" == _ && $("#fp-warm-content").html(a[_]),
                              ("180016" == _ || "180017" == _) &&
                                $("#fp-warm-content").html(a[_]),
                              "020600" == _ &&
                                $("#stc_warm_tip").addClass("none"),
                              "040900" == _ &&
                                $("#stc_warm_tip").addClass("none")),
                            "020300" == _ &&
                              $("#stc_warm_tip").addClass("none");
                        },
                        function () {},
                        function () {},
                        c,
                        h
                      );
                  },
                  function () {},
                  function () {},
                  "",
                  "99"
                );
          });
    },
    T = function (a, c, h) {
      _.getWarmTip(
        function (a) {
          for (var c = {}, _ = "", i = 0; i < h.length; i++)
            (_ = h[i]),
              "undefined" != typeof a[_] &&
                "" != $.trim(a[_]) &&
                null != a[_] &&
                (c[_] = a[_]);
          sessionStorage.setItem("warmTip", JSON.stringify(c));
        },
        function () {},
        function () {},
        a,
        c
      );
    },
    C = function (a, c) {
      "home" == a
        ? ($("#stc_first_loc").hide(),
          $("#stc_first_arrow").hide(),
          $("#stc_second_loc").html("我的移动"))
        : "rechargejf" == a || "rechargecredit" == a || "rechargecard" == a
        ? ($("#stc_first_loc").removeClass("color-2"),
          $("#stc_first_loc").show(),
          $("#stc_second_loc").show(),
          $("#stc_first_arrow").show(),
          $("#stc_second_loc").html("手机交费"))
        : ($("#stc_first_loc").removeClass("color-2"),
          $("#stc_first_loc").show(),
          $("#stc_second_loc").show(),
          $("#stc_first_arrow").show(),
          $("#stc_second_loc").html(c.name));
    },
    I = function (a) {
      $("#stc_warm_tip").empty(),
        require(["/i/apps/pageapps/pwarm/tpl/warmtip_444a516.js"], function (
          c
        ) {
          $("#stc_warm_tip").html(c()), $("#stc_warm_content").html(a);
        });
    };
  return {
    getNoractWarmTip: function (a, c, $) {
      T(a, c, $);
    },
    getWarmTipPart: function (a, c, $) {
      v(a, c, $);
    },
    getCrumbPart: function (a, c) {
      C(a, c);
    },
    setWarmTip: function (a) {
      I(a);
    },
    getOperationInfo: function (a, c) {
      g(a, c);
    },
  };
});
