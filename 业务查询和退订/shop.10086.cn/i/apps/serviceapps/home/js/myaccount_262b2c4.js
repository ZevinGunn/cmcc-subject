define(function (require) {
  var loginuser = "",
    stcDic = require("stcDic"),
    _Constant = Namespace("all.constant"),
    prov_online = stcDic.getProvOnlineForJf(),
    tipShow = function () {
      $(".js_info").hover(
        function () {
          $(this).removeClass("bg-tip-1").addClass("bg-tip-2"),
            $(this).children(".ued-tag").show();
        },
        function () {
          $(this).removeClass("bg-tip-2").addClass("bg-tip-1"),
            $(this).children(".ued-tag").hide();
        }
      ),
        $("#stc_bill_btn").unbind("click"),
        $("#stc_bill_btn").bind("click", function () {
          stcEcode.commTrack("UCenter_Content_ZDCX", !1),
            require(["appmanage", "uri"], function (a) {
              a.initpage("billqry");
            });
        }),
        $("#stc_qoint_btn").unbind("click"),
        $("#stc_qoint_btn").bind("click", function () {
          stcEcode.commTrack("UCenter_Content_JFMX", !1),
            require(["appmanage", "uri"], function (a) {
              a.initpage("pointqry");
            });
        });
    },
    _rollingEffect = function () {},
    getBalance = function (a, c) {
      c.getBalance(
        function (a) {
          var c = "" == a.curFee ? "0.00" : a.curFee;
          0 == Math.abs(parseFloat(c)) &&
            ((c = a.oweFee), (c = -1 * Math.abs(parseFloat(c)))),
            $("#stc_balance").removeClass("sub-site-loading").html(c);
          var b = "" == a.oweFee ? "0.00" : parseFloat(a.oweFee).toFixed(2);
          0 != b
            ? ($(".myinfo div").removeClass("none"),
              $("#stc_arrearage").removeClass("sub-site-loading").html(b))
            : $("#ye-arrearage").remove();
          var I =
            "" == a.curFeeTotal ? "0.00" : parseFloat(a.curFeeTotal).toFixed(2);
          $("#stc_tolbalance").removeClass("sub-site-loading").html(I);
          var h =
            "" == $.trim(a.realFee) ? "" : parseFloat(a.realFee).toFixed(2);
          $("#stc_real").removeClass("sub-site-loading").html(h);
        },
        function () {
          $("#stc_balance_unit").empty(),
            $("#stc_tolbalance_unit").empty(),
            $("#stc_arrearage_unit").empty(),
            $("#stc_real_unit").empty(),
            $("#stc_balance")
              .removeClass("sub-site-loading fs-18")
              .html("获取失败"),
            $("#stc_tolbalance")
              .removeClass("sub-site-loading fs-18")
              .html("获取失败"),
            $("#stc_arrearage")
              .removeClass("sub-site-loading fs-18")
              .html("获取失败"),
            $("#stc_real")
              .removeClass("sub-site-loading fs-18")
              .html("获取失败");
        },
        a
      );
    },
    getPoint = function (a, c) {
      c.getTotalPoint(
        function (a) {
          if (
            ($("#stc_point")
              .removeClass("sub-site-loading")
              .html(
                "" != a.pointValue && void 0 != a.pointValue
                  ? a.pointValue
                  : "0"
              ),
            a.pointValue > 9)
          ) {
            var c = require("appmanage");
            prov_online.indexOf(c.data[0].data.provice) < 0
              ? ($("#stc_point_jump").html("明细>"),
                $(".bl-integration").on("click", function () {
                  require(["appmanage", "uri"], function (a) {
                    a.initpage("pointqry");
                  });
                }))
              : ($("#stc_point_jump").html("兑话费>"),
                $("#stc_point_jump").css("padding-left", "6px"),
                $(".bl-integration").on("click", function () {
                  require(["appmanage", "uri"], function (a) {
                    a.initpage("rechargejf");
                  });
                }));
          } else
            $("#stc_point_jump").html("明细>"),
              $(".bl-integration").on("click", function () {
                require(["appmanage", "uri"], function (a) {
                  a.initpage("pointqry");
                });
              });
        },
        function () {
          $("#stc_point_unit").empty(),
            $("#stc_point")
              .removeClass("sub-site-loading fs-18")
              .html("获取失败");
        },
        a
      );
    },
    drawExpenseChart = function (a) {
      for (var c = [], b = [], i = a.length - 1; i >= 0; i--) {
        var I = a[i];
        ("" == I.bill ||
          "-0" == I.bill ||
          "-" == I.bill ||
          null == I.bill ||
          "undefined" == typeof I.bill) &&
          (I.bill = "0"),
          c.push(I.month.substring(4, 6) + "月"),
          b.push(parseFloat(I.bill));
      }
      require(["highcharts"], function () {
        $("#chartline").highcharts(
          {
            chart: { type: "areaspline" },
            title: { text: "", x: -20 },
            subtitle: { text: "", x: -20 },
            exporting: { enabled: !1 },
            credits: { enabled: !1 },
            xAxis: {
              categories: c,
              tickWidth: 0,
              lineColor: "#f8f8f8",
              labels: { style: { color: "#a4a4a4", fontSize: "15px" } },
            },
            yAxis: {
              gridLineWidth: 1,
              gridLineDashStyle: "Dash",
              maxPadding: 0.3,
              title: { text: "" },
              labels: {
                enabled: !0,
                style: { fontSize: 15, color: "#999999" },
              },
            },
            legend: { enabled: !1 },
            plotOptions: {
              areaspline: { enableMouseTracking: !1 },
              series: {
                lineWidth: 2,
                events: {
                  click: function (a) {
                    return !1;
                  },
                },
              },
              area: {
                fillOpacity: 0.3,
                marker: {
                  enabled: !0,
                  symbol: "circle",
                  fillColor: {
                    linearGradient: [0, 0, 0, 60],
                    stops: [
                      [0, "#7687ff"],
                      [1, "#6a9eff"],
                    ],
                  },
                  radius: 2,
                  states: { hover: { enabled: !0 } },
                },
              },
            },
            tooltip: {
              hideDelay: 999999999,
              enabled: !0,
              formatter: function () {
                return (
                  '<span><i style="font-size: 12px;font-style:normal;">¥</i>' +
                  Highcharts.numberFormat(this.y, 2) +
                  "</span>"
                );
              },
              backgroundColor: {
                linearGradient: [0, 0, 0, 40],
                stops: [
                  [0, "#7687ff"],
                  [1, "#6a9eff"],
                ],
              },
              borderRadius: 5,
              borderWidth: 0,
              borderColor: "#7686ff",
              padding: 4,
              shadow: !0,
              animation: !0,
              valueDecimals: 2,
              style: { color: "#fff", fontSize: "16px" },
            },
            series: [
              {
                data: b,
                marker: { enabled: !0, lineColor: "#fff", lineWidth: 3 },
                color: "#3c9cff",
                fillColor: {
                  linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                  stops: [
                    [0, "#e3efff"],
                    [1, "#ffffff"],
                  ],
                },
              },
            ],
          },
          function (a) {
            var c = a.series[0].points,
              b = c.length;
            setTimeout(function () {
              a.tooltip.refresh(c[b - 1]),
                $($(a.xAxis[0].labelGroup.element).children()[b - 1])
                  .css("fill", "#00a4ff")
                  .siblings("text")
                  .css("fill", "#999999"),
                $($(".highcharts-markers").children()[0])
                  .css("visibility", "visible")
                  .siblings()
                  .css("visibility", "hidden");
            }, 1e3),
              $(".highcharts-markers")
                .children()
                .each(function () {
                  $(this).css("visibility", "hidden");
                }),
              Highcharts.addEvent(
                a.xAxis[0].labelGroup.element,
                "click",
                function (e) {
                  var I = $($(e.target).context).html(),
                    h = a.xAxis[0].categories.indexOf(I),
                    M = h;
                  a.tooltip.refresh(c[M]),
                    $($(a.xAxis[0].labelGroup.element).children()[M])
                      .css("fill", "#00a4ff")
                      .siblings("text")
                      .css("fill", "#999999"),
                    $(
                      $(".highcharts-markers").children()[Math.abs(M - (b - 1))]
                    )
                      .css("visibility", "visible")
                      .siblings()
                      .css("visibility", "hidden");
                }
              );
          }
        );
      });
    },
    dealPackRemain = function (outdata) {
      for (var data = [], i = 0; i < outdata.length; i++)
        "1" == outdata[i].type && (data = outdata[i].arr);
      var detail1 = {
          icon: "icon-meal",
          colors: "count-purple",
          name: "语音",
          useMeal: 0,
          totalMeal: 0,
          balMeal: 0,
          realUnit: "01",
          percent: "100",
        },
        detail2 = {
          icon: "icon-meal2",
          colors: "count-yellow",
          name: "流量",
          useMeal: 0,
          totalMeal: 0,
          balMeal: 0,
          realUnit: "04",
          percent: "100",
          unLimitTypeinfo: "1",
        },
        detail3 = {
          icon: "icon-meal4",
          colors: "count-green",
          name: "WLAN",
          useMeal: 0,
          totalMeal: 0,
          balMeal: 0,
          realUnit: "04",
          percent: "100",
        },
        detail4 = {
          icon: "icon-meal3",
          colors: "count-purple",
          name: "短信",
          useMeal: 0,
          totalMeal: 0,
          balMeal: 0,
          realUnit: "02",
          percent: "100",
        },
        detail5 = {
          icon: "icon-meal4",
          colors: "count-green",
          name: "WLAN",
          useMeal: 0,
          totalMeal: 0,
          balMeal: 0,
          realUnit: "01",
          percent: "100",
        },
        limited;
      if ("undefined" != data) {
        for (var key = 0; key < data.length; key++) {
          var obj = data[key];
          if (1 != obj.expireFlag)
            for (var k = 0; k < obj.resInfos.length; k++)
              switch (obj.resInfos[k].resCode) {
                case "01":
                  for (var m = 0; m < obj.resInfos[k].secResInfos.length; m++) {
                    var use1 =
                        obj.resInfos[k].secResInfos[m].resConInfo.useMeal,
                      total1 =
                        obj.resInfos[k].secResInfos[m].resConInfo.totalMeal,
                      bal1 = obj.resInfos[k].secResInfos[m].resConInfo.balMeal;
                    ("" == use1 ||
                      null == use1 ||
                      "null" == use1 ||
                      "undefined" == typeof use1) &&
                      (obj.resInfos[k].secResInfos[m].resConInfo.useMeal = 0),
                      ("" == total1 ||
                        null == total1 ||
                        "null" == total1 ||
                        "undefined" == typeof total1) &&
                        (obj.resInfos[k].secResInfos[
                          m
                        ].resConInfo.totalMeal = 0),
                      ("" == bal1 ||
                        null == bal1 ||
                        "null" == bal1 ||
                        "undefined" == typeof bal1) &&
                        (obj.resInfos[k].secResInfos[m].resConInfo.balMeal = 0),
                      (detail1.useMeal += eval(
                        obj.resInfos[k].secResInfos[m].resConInfo.useMeal
                      )),
                      (detail1.totalMeal += eval(
                        obj.resInfos[k].secResInfos[m].resConInfo.totalMeal
                      )),
                      (detail1.balMeal += eval(
                        obj.resInfos[k].secResInfos[m].resConInfo.balMeal
                      )),
                      (detail1.realUnit =
                        obj.resInfos[k].secResInfos[m].resConInfo.unit);
                  }
                  break;
                case "02":
                  for (var m = 0; m < obj.resInfos[k].secResInfos.length; m++) {
                    var use1 =
                        obj.resInfos[k].secResInfos[m].resConInfo.useMeal,
                      total1 =
                        obj.resInfos[k].secResInfos[m].resConInfo.totalMeal,
                      bal1 = obj.resInfos[k].secResInfos[m].resConInfo.balMeal;
                    ("" == use1 ||
                      null == use1 ||
                      "null" == use1 ||
                      "undefined" == typeof use1) &&
                      (obj.resInfos[k].secResInfos[m].resConInfo.useMeal = 0),
                      ("" == total1 ||
                        null == total1 ||
                        "null" == total1 ||
                        "undefined" == typeof total1) &&
                        (obj.resInfos[k].secResInfos[
                          m
                        ].resConInfo.totalMeal = 0),
                      ("" == bal1 ||
                        null == bal1 ||
                        "null" == bal1 ||
                        "undefined" == typeof bal1) &&
                        (obj.resInfos[k].secResInfos[m].resConInfo.balMeal = 0),
                      (detail4.useMeal += eval(
                        obj.resInfos[k].secResInfos[m].resConInfo.useMeal
                      )),
                      (detail4.totalMeal += eval(
                        obj.resInfos[k].secResInfos[m].resConInfo.totalMeal
                      )),
                      (detail4.balMeal += eval(
                        obj.resInfos[k].secResInfos[m].resConInfo.balMeal
                      )),
                      (detail4.realUnit =
                        obj.resInfos[k].secResInfos[m].resConInfo.unit);
                  }
                  break;
                case "04":
                  for (var m = 0; m < obj.resInfos[k].secResInfos.length; m++)
                    if (
                      "10-" !=
                        obj.resInfos[k].secResInfos[m].resConName.substr(
                          0,
                          3
                        ) &&
                      !isNaN(
                        obj.resInfos[k].secResInfos[m].resConInfo.totalMeal
                      )
                    ) {
                      var use1 =
                          obj.resInfos[k].secResInfos[m].resConInfo.useMeal,
                        total1 =
                          obj.resInfos[k].secResInfos[m].resConInfo.totalMeal,
                        bal1 =
                          obj.resInfos[k].secResInfos[m].resConInfo.balMeal;
                      (limited = obj.resInfos[k].secResInfos[m].unLimitType),
                        "" == total1 ||
                        null == total1 ||
                        "null" == total1 ||
                        "undefined" == typeof total1 ||
                        "0" == total1
                          ? ((obj.resInfos[k].secResInfos[
                              m
                            ].resConInfo.totalMeal = 0),
                            (obj.resInfos[k].secResInfos[
                              m
                            ].resConInfo.balMeal = 0),
                            (obj.resInfos[k].secResInfos[
                              m
                            ].resConInfo.useMeal = 0))
                          : (("" == use1 ||
                              null == use1 ||
                              "null" == use1 ||
                              "undefined" == typeof use1) &&
                              (obj.resInfos[k].secResInfos[
                                m
                              ].resConInfo.useMeal = 0),
                            ("" == bal1 ||
                              null == bal1 ||
                              "null" == bal1 ||
                              "undefined" == typeof bal1) &&
                              (obj.resInfos[k].secResInfos[
                                m
                              ].resConInfo.balMeal = 0)),
                        (detail2.useMeal += eval(
                          obj.resInfos[k].secResInfos[m].resConInfo.useMeal
                        )),
                        (detail2.totalMeal += eval(
                          obj.resInfos[k].secResInfos[m].resConInfo.totalMeal
                        )),
                        (detail2.balMeal += eval(
                          obj.resInfos[k].secResInfos[m].resConInfo.balMeal
                        )),
                        (detail2.realUnit =
                          obj.resInfos[k].secResInfos[m].resConInfo.unit);
                    }
                  break;
                case "05":
                  for (var m = 0; m < obj.resInfos[k].secResInfos.length; m++) {
                    var use1 =
                        obj.resInfos[k].secResInfos[m].resConInfo.useMeal,
                      total1 =
                        obj.resInfos[k].secResInfos[m].resConInfo.totalMeal,
                      bal1 = obj.resInfos[k].secResInfos[m].resConInfo.balMeal;
                    ("" == use1 ||
                      null == use1 ||
                      "null" == use1 ||
                      "undefined" == typeof use1) &&
                      (obj.resInfos[k].secResInfos[m].resConInfo.useMeal = 0),
                      ("" == total1 ||
                        null == total1 ||
                        "null" == total1 ||
                        "undefined" == typeof total1) &&
                        (obj.resInfos[k].secResInfos[
                          m
                        ].resConInfo.totalMeal = 0),
                      ("" == bal1 ||
                        null == bal1 ||
                        "null" == bal1 ||
                        "undefined" == typeof bal1) &&
                        (obj.resInfos[k].secResInfos[m].resConInfo.balMeal = 0),
                      "03" == obj.resInfos[k].secResInfos[m].resConInfo.unit
                        ? ((detail3.useMeal += eval(
                            obj.resInfos[k].secResInfos[m].resConInfo.useMeal
                          )),
                          (detail3.totalMeal += eval(
                            obj.resInfos[k].secResInfos[m].resConInfo.totalMeal
                          )),
                          (detail3.balMeal += eval(
                            obj.resInfos[k].secResInfos[m].resConInfo.balMeal
                          )),
                          (detail3.realUnit =
                            obj.resInfos[k].secResInfos[m].resConInfo.unit))
                        : ((detail5.useMeal += eval(
                            obj.resInfos[k].secResInfos[m].resConInfo.useMeal
                          )),
                          (detail5.totalMeal += eval(
                            obj.resInfos[k].secResInfos[m].resConInfo.totalMeal
                          )),
                          (detail5.balMeal += eval(
                            obj.resInfos[k].secResInfos[m].resConInfo.balMeal
                          )),
                          (detail5.realUnit =
                            obj.resInfos[k].secResInfos[m].resConInfo.unit));
                  }
              }
        }
        for (var n = 0; n < limited.length; n++) {
          var limiteds = limited[n];
          detail2.unLimitTypeinfo = -1 != limiteds.indexOf("2") ? "2" : "1";
        }
        "04" == detail2.realUnit
          ? ((detail2.useMeal = 1024 * detail2.useMeal),
            (detail2.totalMeal = 1024 * detail2.totalMeal),
            (detail2.balMeal = 1024 * detail2.balMeal))
          : "05" == detail2.realUnit &&
            ((detail2.useMeal = 1024 * detail2.useMeal * 1024),
            (detail2.totalMeal = 1024 * detail2.totalMeal * 1024),
            (detail2.balMeal = 1024 * detail2.balMeal * 1024)),
          (detail2.useMeal = (detail2.useMeal / 1024).toFixed(2)),
          (detail2.totalMeal = (detail2.totalMeal / 1024).toFixed(2)),
          (detail2.balMeal = (detail2.balMeal / 1024).toFixed(2)),
          (detail2.realUnit = "04"),
          "03" == detail3.realUnit &&
            ((detail3.useMeal = (detail3.useMeal / 1024).toFixed(2)),
            (detail3.totalMeal = (detail3.totalMeal / 1024).toFixed(2)),
            (detail3.balMeal = (detail3.balMeal / 1024).toFixed(2)),
            (detail3.realUnit = "04"));
      }
      for (
        var dt = [detail1, detail2, detail3, detail4, detail5], o = 0;
        o < dt.length;
        o++
      ) {
        if (0 != dt[o].totalMeal) {
          var percent = ((dt[o].balMeal / dt[o].totalMeal) * 100).toFixed();
          dt[o].percent = percent > 100 ? 100 : percent;
        }
        dt[o].colors =
          dt[o].percent >= 0 && dt[o].percent < 50
            ? "count-purple"
            : dt[o].percent >= 50 && dt[o].percent < 90
            ? "count-yellow"
            : "count-green";
      }
      var temp = [];
      return (
        parseInt(detail3.totalMeal) > 0
          ? (0 != detail1.totalMeal && temp.push(detail1),
            0 != detail2.totalMeal && temp.push(detail2),
            0 != detail3.totalMeal && temp.push(detail3),
            0 != detail4.totalMeal && temp.push(detail4))
          : parseInt(detail5.totalMeal) > 0
          ? (0 != detail1.totalMeal && temp.push(detail1),
            0 != detail2.totalMeal && temp.push(detail2),
            0 != detail5.totalMeal && temp.push(detail3),
            0 != detail4.totalMeal && temp.push(detail4))
          : (0 != detail1.totalMeal && temp.push(detail1),
            0 != detail2.totalMeal && temp.push(detail2),
            0 != detail3.totalMeal && temp.push(detail3),
            0 != detail4.totalMeal && temp.push(detail4)),
        temp
      );
    },
    getShopOrder = function (a, c) {
      $("#pre-order").on("click", function () {
        require(["appmanage"], function (a) {
          a.initpage("mypreorders");
        });
      }),
        $("#recharge-order").on("click", function () {
          require(["appmanage"], function (a) {
            a.initpage("rechargerecord");
          });
        }),
        null != a &&
          "unedfined" != typeof a &&
          -1 == a.indexOf("@") &&
          ("998" != c
            ? $("#image-alert").on("click", function () {
                require(["appmanage"], function (a) {
                  a.initpage("custinfoqry");
                });
              })
            : $("#image-alert img").css("cursor", "default")),
        require([
          "/i/service/model/order_ac36cc6.js",
          "appmanage",
          "uri",
        ], function (c, b) {
          var req = {};
          (req.user = a),
            (req.usertype = stcDic.getMobileUser()),
            (req.pageno = 1),
            (req.pagesize = 50),
            (req.ordertype = "O"),
            (req.orderstates = ""),
            (req.goodname = ""),
            (_qrytime = ""),
            c.getOrderInfo(
              req,
              function (a) {
                var c = a.length,
                  I = 0,
                  h = 0,
                  M = 0,
                  g = [],
                  k = [],
                  C = [];
                if (c > 0)
                  for (var v in a)
                    a[v].state == stcDic.getFinish()
                      ? (I++, g.push(a[v]))
                      : a[v].state == stcDic.getClstatus()
                      ? (h++, k.push(a[v]))
                      : a[v].state == stcDic.getWaitpay() &&
                        (M++, C.push(a[v]));
                $("#order-wait").html(M),
                  $("#order-ss").html(I),
                  $("#order-cal").html(h),
                  $(".point-pp").on("click", function () {
                    (_Constant.STATUS = "PP,SP"), b.initpage("myorders");
                  }),
                  $(".point-ss").on("click", function () {
                    (_Constant.STATUS = stcDic.getFinish()),
                      b.initpage("myorders");
                  }),
                  $(".point-cl").on("click", function () {
                    (_Constant.STATUS = stcDic.getClstatus()),
                      b.initpage("myorders");
                  });
              },
              function () {
                $("#order-wait").html("0"),
                  $("#order-ss").html("0"),
                  $("#order-cal").html("0");
              },
              function () {
                $("#order-wait").html("0"),
                  $("#order-ss").html("0"),
                  $("#order-cal").html("0");
              }
            );
        });
    };
  return {
    tipShow: function () {
      tipShow();
    },
    rollingEffect: function () {
      _rollingEffect();
    },
    getBalance: function (a, c) {
      getBalance(a, c);
    },
    getPoint: function (a, c) {
      getPoint(a, c);
    },
    drawExpenseChart: function (a) {
      drawExpenseChart(a);
    },
    dealPackRemain: function (a) {
      return dealPackRemain(a);
    },
    getShopOrder: function (a, c) {
      getShopOrder(a, c);
    },
  };
});
