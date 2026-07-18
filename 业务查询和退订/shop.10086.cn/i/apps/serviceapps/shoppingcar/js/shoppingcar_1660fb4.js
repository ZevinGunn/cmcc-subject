define(function (require) {
  var a = require("stcDic"),
    c = function () {
      var a = $(".div-shopping-trolley"),
        c = $("#headShoppingTrolley");
      a
        .mouseenter(function () {
          c.show(),
            c.html(
              "<img style='margin: 5px auto;width: 40px;height: 40px;' src='/i/nresource/image/loading.gif'>"
            ),
            require([
              "/i/apps/serviceapps/shoppingcar/tpl/headershoppingcargoods_c8c0ad3.js",
            ], function (a) {
              w(c, a);
            });
        })
        .mouseleave(function () {
          c.empty(), c.hide();
        }),
        $(document).off("click", "#center-list .list-item .item-price a"),
        $(document).on(
          "click",
          "#center-list .list-item .item-price a",
          function () {
            var a = $(this),
              c = null;
            require([
              "/i/apps/serviceapps/shoppingcar/tpl/headershoppingcargoods_c8c0ad3.js",
              "/i/apps/serviceapps/shoppingcar/tpl/sideshoppingcargoods_38d01f7.js",
            ], function (h, g) {
              "block" == $("#headShoppingTrolley").css("display")
                ? ((c = $("#headShoppingTrolley")), C(a, c, h))
                : ((c = $("#sideShoppingTrolley")), C(a, c, g));
            });
          }
        ),
        $(document).on("click", ".go-shoppingcar-btn", function () {
          require(["stcDic", "stcutil"], function (a, c) {
            var h = a.shopping_car_url();
            window.open(c.dealOuterUrl(h));
          });
        }),
        $(document).on("click", ".item-content h5", function () {
          var a = $(this);
          I(a);
        });
    },
    h = function () {
      var a = $(".stc-easy-entry-itemsty-shoppingcar"),
        c = $("#sideShoppingTrolley");
      a.mouseenter(function () {
        $(".stc-easy-entry-item-shoppingcar").addClass("on"),
          c.show(),
          require([
            "/i/apps/serviceapps/shoppingcar/tpl/sideshoppingcargoods_38d01f7.js",
          ], function (a) {
            w(c, a);
          });
      }).mouseleave(function () {
        $(".stc-easy-entry-item-shoppingcar").removeClass("on"), c.hide();
      });
    },
    g = function (a) {
      for (
        var c = [], h = [], g = [], v = [], T = [], k = [], _ = a.length, i = 0;
        _ > i;
        i++
      ) {
        var S = a[i].promoType;
        switch (S) {
          case "-1":
            c.push(a[i]);
            break;
          case "7":
            h.push(a[i]);
            break;
          case "8":
            g.push(a[i]);
            break;
          case "13":
            v.push(a[i]);
            break;
          case "14":
            T.push(a[i]);
            break;
          default:
            k.push(a[i]);
        }
      }
      c.sort(function (a, c) {
        return c.createTime - a.createTime;
      }),
        h.sort(function (a, c) {
          return c.createTime - a.createTime;
        }),
        g.sort(function (a, c) {
          return c.createTime - a.createTime;
        }),
        v.sort(function (a, c) {
          return c.createTime - a.createTime;
        }),
        T.sort(function (a, c) {
          return c.createTime - a.createTime;
        });
      var w = [];
      if (
        (h.length > 0 && w.push(h),
        g.length > 0 && w.push(g),
        v.length > 0 && w.push(v),
        T.length > 0 && w.push(T),
        w.sort(function (a, c) {
          return c[0].createTime - a[0].createTime;
        }),
        !$.isEmptyObject(c))
      )
        for (var i = 0; i < c.length; i++) w.push(c[i]);
      w = w.sort(y);
      for (var C = w.length, I = [], b = 0; C > b; b++) I = I.concat(w[b]);
      return (I = I.concat(k));
    },
    y = function (a, c) {
      var h, g;
      return (
        (h = $.isArray(a) ? a[0].createTime : a.createTime),
        (g = $.isArray(c) ? c[0].createTime : c.createTime),
        h > g ? -1 : g > h ? 1 : 0
      );
    },
    v = function (a) {
      for (var c = a.length, h = [], i = 0; c > i; i++)
        "false" != a[i].isPrimePro && h.push(a[i]);
      return h;
    },
    T = function (a) {
      for (var c = a.length, h = 0, i = 0; c > i; i++)
        if (
          "true" == a[i].isPrimePro &&
          "51" == a[i].goodsStatus &&
          a[i].skuStock >= "0"
        ) {
          var g = a[i].promoType;
          switch (g) {
            case "7":
            case "8":
              h += parseInt(a[i].groupTotalPromoPrice);
              break;
            case "13":
            case "14":
              h += parseInt(a[i].singleTotalPromoPrice);
              break;
            case "-1":
              h += parseInt(a[i].totalPrice);
          }
        }
      return h;
    },
    k = function (a) {
      for (var c = a.length, i = 0; c > i; i++)
        if (
          ("-1" == a[i].promoType ||
            "7" == a[i].promoType ||
            "8" == a[i].promoType ||
            "13" == a[i].promoType ||
            "14" == a[i].promoType) &&
          "true" == a[i].isPrimePro &&
          "51" == a[i].goodsStatus &&
          a[i].skuStock >= "0"
        )
          return !1;
      return !0;
    },
    _ = function () {
      require([
        "/i/service/model/order_ac36cc6.js",
        "appmanage",
        "cookie",
      ], function (a, c) {
        var req = {};
        (req.userType = c.data[0].data.userType),
          (req.userId =
            "2" == req.userType
              ? window.sessionStorage.getItem("cart_code_key")
              : c.data[0].data.loginValue),
          a.getShoppingGoodsCount(
            req,
            function (a) {
              $("#shoppingCarCount").html(a.number),
                $("#sideShoppingcarCount").show(),
                $("#sideShoppingcarCount").html(a.number);
            },
            function () {
              $("#sideShoppingcarCount").hide();
            },
            function () {
              $("#sideShoppingcarCount").hide();
            }
          );
      });
    },
    S = function (req) {
      require(["/i/service/model/order_ac36cc6.js"], function (a) {
        a.mergeShoppingCarGoods(
          req,
          function (a) {
            _();
          },
          function () {
            _();
          },
          function () {
            _();
          }
        );
      });
    },
    w = function (c, h) {
      require(["/i/service/model/order_ac36cc6.js", "appmanage"], function (
        y,
        _
      ) {
        var req = {};
        (req.userType = _.data[0].data.userType),
          require(["cookie"], function () {
            req.userId =
              "2" == req.userType
                ? window.sessionStorage.getItem("cart_code_key")
                : _.data[0].data.loginValue;
          }),
          y.getShoppingCarList(
            req,
            function (y) {
              var _ = !0,
                S = 0;
              (null == y || void 0 == y) && (y = []),
                (y = g(y)),
                (S = T(y)),
                (_ = k(y)),
                0 == y.length
                  ? (c.html(h({ data: y })),
                    $("#shoppingCarCount").html("0"),
                    $("#sideShoppingcarCount").html("0"))
                  : _
                  ? c.html(h({ data: 2 }))
                  : ((y = v(y)),
                    c.html(h({ data: y, stcDic: a })),
                    $("#shoppingCarCount").html(y.length),
                    $("#sideShoppingcarCount").html(y.length)),
                (S = (S / 100).toFixed(2)),
                $(".totalPrice").html("¥" + S);
              var w = $(window).height() - 150 - 40 - 54 - 20;
              $(".stc-easy-entry-itemsty-shoppingcar .center-list").css(
                "max-height",
                w + "px"
              );
            },
            function (a) {
              require(["cookie"], function () {
                c.html(
                  "999999" == a &&
                    void 0 == window.sessionStorage.getItem("cart_code_key")
                    ? h({ data: [] })
                    : h({ data: 3 })
                );
              });
            },
            function () {
              c.html(h({ data: 3 }));
            }
          );
      });
    },
    C = function (a, c, h) {
      var req = {};
      require(["appmanage", "cookie"], function (c) {
        (req.skuId = a.next().html()),
          (req.detailId = a.next().next().html()),
          (req.packageId = a.next().next().next().html()),
          (req.userType = c.data[0].data.userType),
          (req.userId =
            "2" == req.userType
              ? window.sessionStorage.getItem("cart_code_key")
              : c.data[0].data.loginValue);
      }),
        a.html("正在删除中");
      require([
        "/i/service/model/order_ac36cc6.js",
        "appmanage",
        "cookie",
      ], function (g) {
        g.shoppingCarDetele(
          req,
          function () {
            setTimeout(function () {
              a.html("删除");
            }, 500),
              w(c, h);
          },
          function () {
            a.html("删除失败"),
              setTimeout(function () {
                a.html("删除");
              }, 500);
          },
          function () {
            a.html("删除失败"),
              setTimeout(function () {
                a.html("删除");
              }, 500);
          }
        );
      });
    },
    I = function (c) {
      var h = c.next().html();
      h = JSON.parse(h);
      var req = {};
      (req.goodsId = c.next().next().html()),
        (req.skuId = c.next().next().next().html());
      var g, y;
      for (y in h)
        if ("-1" == y) (req.province_id = "100"), (req.city_id = "100");
        else {
          var v = h[y];
          "-1" == v[0]
            ? ((req.province_id = y), (req.city_id = y))
            : ((req.province_id = y), (req.city_id = v[0]));
        }
      (g =
        a.getShopLink() +
        "goods/" +
        req.province_id +
        "_" +
        req.city_id +
        "_" +
        req.goodsId +
        "_" +
        req.skuId +
        ".html"),
        window.open(g);
    };
  return {
    init: function () {
      c();
    },
    sideInit: function () {
      h();
    },
    getShoppingCartNumber: function () {
      _();
    },
    mergeShoppingCarGoods: function (req) {
      S(req);
    },
  };
});
