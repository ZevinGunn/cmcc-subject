define(function (require) {
  var c = function (req, c, a, b) {
      require(["commonutil"], function (g) {
        g.GET(
          "/v1/busi/order/" + req.user,
          {},
          function (a, b) {
            "function" == typeof c &&
              (null != b.paging.sOperTime ? c(a, b.paging.sOperTime) : c(a));
          },
          function (c, b, g) {
            a(c, b, g);
          },
          b,
          { inx: "busiqrydeal", flag: "true" }
        );
      });
    },
    a = function (req, c, a, b, g) {
      require(["commonutil"], function (T) {
        T.POST(
          "/v1/busi/ordermodify/" + req.user,
          { orderInfos: c },
          function (c) {
            a(c);
          },
          b,
          g,
          { eventCode: "UCenter_UnProduct_TDCZ", flag: "false" }
        );
      });
    },
    b = function (req, c, a, b) {
      require(["commonutil"], function (g) {
        g.GET(
          "/v1/busi/eborder/" + req.user,
          {},
          function (a, b) {
            "function" == typeof c &&
              (null != b.paging.sOperTime ? c(a, b.paging.sOperTime) : c(a));
          },
          function (c, b, g) {
            a(c, b, g);
          },
          b,
          { inx: "busiqrydeal", flag: "true" }
        );
      });
    },
    g = function (req, c, a, b) {
      require(["commonutil"], function (g) {
        var T = "/v1/busi/ebordermodify/" + req.user,
          C = {
            bunessType: req.bunessType,
            productId: req.productId,
            spId: req.spid,
            bizCode: req.bizCode,
            oprCode: req.oprCode,
            unFlag: req.unFlag,
            chanid: req.chanid,
            orderID: req.orderID,
          };
        g.POST(T, C, c, a, b, {
          eventCode: "UCenter_UnProduct_TDCZ",
          flag: "false",
        });
      });
    },
    T = function (req, c, a, b) {
      require(["commonutil"], function (g) {
        g.GET("/v1/busi/ebordercheck/" + req.user, {}, c, a, b);
      });
    };
  return {
    getEnbusiInfo: function (req, c, a, g) {
      b(req, c, a, g);
    },
    cancelEnbusi: function (req, c, a, b) {
      g(req, c, a, b);
    },
    eborderCheck: function (req, c, a, b) {
      T(req, c, a, b);
    },
    getBusiDeal: function (req, a, b, g) {
      c(req, a, b, g);
    },
    cancelBusi: function (req, c, b, g, T) {
      a(req, c, b, g, T);
    },
  };
});
