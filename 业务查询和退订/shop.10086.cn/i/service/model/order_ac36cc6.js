define(function (require) {
  var c = require("stcutil");
  (cancelOrderCodePara = {
    eventCode: "UCenter_MyOrderInfo_Cancel",
    flag: "false",
  }),
    (deleteOrderCodePara = {
      eventCode: "UCenter_MyOrderInfo_Delete",
      flag: "false",
    }),
    (returnOrderCodePara = {
      eventCode: "UCenter_MyOrderInfo_Return",
      flag: "false",
    }),
    (cancelPreOrderCodePara = {
      eventCode: "UCenter_MyPreOrder_Cancel",
      flag: "false",
    }),
    (deletePreOrderCodePara = {
      eventCode: "UCenter_MyPreOrder_Delete",
      flag: "false",
    });
  var a = function (c, a, y, g) {
      require(["commonutil"], function (T) {
        T.GET("/v1/busi/order/" + c, {}, a, y, g, {
          inx: "busiqrydeal",
          flag: "true",
        });
      });
    },
    y = function (c, a, y, g, T) {
      null != a &&
        require(["commonutil"], function (c) {
          c.POST("/v1/busi/ordermodify/" + _phonenum, a, y, g, T, {
            eventCode: "UCenter_UnProduct_TDCZ",
            flag: "false",
          });
        });
    },
    g = function (req, c, a) {
      T(
        req,
        function (a, y) {
          "function" == typeof c &&
            ($.isEmptyObject(y) || null == y.paging.totalNum
              ? c(a, 0)
              : c(a, y.paging.totalNum));
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        }
      );
    },
    T = function (req, a, y, g) {
      require(["commonutil"], function (T) {
        var C, v;
        "1" == req.isLoginlessQ
          ? ((C = "/v1/cust/orderlistqry/000000"),
            (req.credentialsNo = c.encrypt(req.credentialsNo, "WfSzPkoO")),
            (req.credentialsNo = base64encode(req.credentialsNo)),
            (req.loginLessqCode = c.encrypt(req.loginLessqCode, "WfSzPkoO")),
            (req.loginLessqCode = base64encode(req.loginLessqCode)),
            (_Constant.IDENTIFY = req.credentialsNo),
            (_Constant.LESSQCODE = req.loginLessqCode),
            (v = {
              credentialsNo: req.credentialsNo,
              loginLessqCode: req.loginLessqCode,
              captchaVal: req.captchaVal,
              orderSubTypes: req.ordertype,
              status: req.orderstates,
              startTime: req.starttime,
              endTime: req.endtime,
              currentPage: req.pageno,
              channelId: "00",
              pageSize: req.pagesize,
              isLoginlessQ: "1",
              orderType: "002",
            }))
          : ((C = "/v1/cust/orderlistqry/" + req.user),
            (v = {
              orderType: "002",
              status: req.orderstates,
              startTime: req.starttime,
              endTime: req.endtime,
              currentPage: req.pageno,
              channelId: "00",
              pageSize: req.pagesize,
              orderSubTypes: req.ordertype,
            })),
          T.GET(C, v, a, y, g);
      });
    },
    C = function (req, c, a) {
      v(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        }
      );
    },
    v = function (req, a, y, g) {
      var T, C;
      require(["commonutil"], function (v) {
        "1" == req.isLoginlessQ
          ? ((T = "/v1/cust/orderlistqry/000000"),
            (req.credentialsNo = c.encrypt(req.credentialsNo, "WfSzPkoO")),
            (req.credentialsNo = base64encode(req.credentialsNo)),
            (req.loginLessqCode = c.encrypt(req.loginLessqCode, "WfSzPkoO")),
            (req.loginLessqCode = base64encode(req.loginLessqCode)),
            (_Constant.IDENTIFY = req.credentialsNo),
            (_Constant.LESSQCODE = req.loginLessqCode),
            (C = {
              loginLessqCode: req.loginLessqCode,
              credentialsNo: req.credentialsNo,
              currentPage: req.pageno,
              pageSize: req.pagesize,
              orderSubTypes: req.ordertype,
              startTime: req.starttime,
              endTime: req.endtime,
              isLoginlessQ: "1",
              captchaVal: req.captchaVal,
              channelId: "00",
              orderType: "002",
            }))
          : ((T = "/v1/cust/orderlistqry/" + req.user),
            (C = {
              currentPage: req.pageno,
              pageSize: req.pagesize,
              orderType: "002",
              orderSubTypes: req.ordertype,
              status: req.orderstates,
              startTime: req.starttime,
              endTime: req.endtime,
              channelId: "00",
            })),
          v.GET(T, C, a, y, g);
      });
    },
    I = function (req, c, a, y) {
      O(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    O = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        if (req instanceof Array) {
          var T = "/v1/cust/shoporder/" + req[0] + "/" + req[1];
          g.GET(T, {}, c, a, y);
        } else {
          var T = "/v1/cust/shoporder4freelogin/1/detail";
          if ("1" == req.isReturnOrder)
            var C = {
              credentialsNo: req.credentialsNo,
              loginLessqCode: req.loginLessqCode,
              consignee: req.consignee,
              orderId: req.orderId,
              userId: req.userId,
              isReturnOrder: req.isReturnOrder,
            };
          else
            var C = {
              credentialsNo: req.credentialsNo,
              loginLessqCode: req.loginLessqCode,
              consignee: req.consignee,
            };
          g.GET(T, C, c, a, y);
        }
      });
    },
    L = function (req, c, a, y) {
      h(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, g) {
          "function" == typeof a && y(c, g);
        }
      );
    },
    h = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        if ("guest" == req[0]) {
          req[0] = "2350011673";
          var T = "/v1/cust/shoporder4freelogin/" + req[0] + "/his/" + req[1];
        } else var T = "/v1/cust/shoporder/" + req[0] + "/his/" + req[1];
        g.GET(T, {}, c, a, y);
      });
    },
    N = function (req, c, a, y) {
      _(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, g) {
          "function" == typeof a && y(c, g);
        }
      );
    },
    _ = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        var T = "/v1/cust/logistics/" + req[0] + "/" + req[1] + "/" + req[2];
        g.GET(T, {}, c, a, y);
      });
    },
    S = function (req, c, a, y) {
      P(
        req,
        function (a, y) {
          "function" == typeof c && c(a, y.paging.totalNum);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    P = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        if (req instanceof Object) {
          var T = "/v1/cust/orderlistqry/" + req.user,
            C = {
              currentPage: req.pageno,
              pageSize: req.pagesize,
              orderType: "002",
              orderSubTypes: req.ordertype,
              status: req.orderstates,
              startTime: req.starttime,
              endTime: req.endtime,
              channelId: "00",
              isLoginlessQ: "3",
              orderId: req.orderId,
              returnOrderId: req.returnOrderId,
            };
          g.GET(T, C, c, a, y);
        } else {
          var T = "/v1/cust/orderlistqry/000000",
            C = {
              orderId: req.orderId,
              orderType: req.orderType,
              isLoginlessQ: "3",
            };
          g.GET(T, C, c, a, y);
        }
      });
    },
    E = function (req, c, a, y) {
      b(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    b = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        if ("1" == req.isLoginlessQ)
          var T =
            "/v1/cust/shoporderunidel/" +
            req.user_id +
            "/" +
            req.order_id +
            "?isLoginlessQ=1&orderType=" +
            req.orderType;
        else
          var T =
            "/v1/cust/shoporderunidel/" +
            req.user_id +
            "/" +
            req.order_id +
            "?isLoginlessQ=0&orderType=" +
            req.orderType;
        var C = {
          user_id: req.user_id,
          order_id: req.order_id,
          isLoginlessQ: req.isLoginlessQ,
          orderType: req.orderType,
          payDate: req.payDate,
          channel: "00",
        };
        g.POST(T, C, c, a, y);
      });
    },
    z = function (req, c, a, y) {
      Q(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    Q = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        var T =
            "/v1/cust/shoporderunimodify/" + req.user_id + "/" + req.order_id,
          C = {
            cancelSubType: req.cancelSubType,
            cancelReason: req.cancelReason,
            user_id: req.user_id,
            order_id: req.order_id,
            isLoginlessQ: req.isLoginlessQ,
            credentialsNo: req.credentialsNo,
            loginLessqCode: req.loginLessqCode,
            consignee: req.consignee,
            orderType: req.orderType,
          };
        g.POST(T, C, c, a, y);
      });
    },
    G = function (req, c, a, y) {
      D(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    D = function (req, c, a, y) {
      var g, T;
      require(["commonutil"], function (C) {
        req instanceof Array
          ? ((g =
              "/v1/cust/shopordermodify/" +
              req.user +
              "/return/" +
              req.orderid),
            (T = {
              type: req.type,
              merchantId: req.merchantId,
              reason: req.reason,
              memo: req.memo,
            }))
          : ((g =
              "/v1/cust/shoporders4freeloginmodify/1/2350011673/" +
              req.order_id +
              "/returngoods"),
            (T = {
              merchantId: req.merchantId,
              type: req.type,
              reason: req.reason,
              memo: req.memo,
              consignee: req.consignee,
              credentialsNo: req.credentialsNo,
              loginLessqCode: req.loginLessqCode,
            })),
          C.POST(g, T, c, a, y, returnOrderCodePara);
      });
    },
    k = function (req, c, a, y) {
      R(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    R = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        var T = "/v1/cust/cartNumber/" + req.userId;
        g.GET(T, { userType: req.userType }, c, a, y);
      });
    },
    U = function (req, c, a, y) {
      V(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    V = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        var T = "/v1/cust/cartInfo/" + req.userId;
        g.GET(T, { userType: req.userType }, c, a, y);
      });
    },
    M = function (req, c, a, y) {
      W(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    W = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        var T = "/v1/cust/deleteCartdel/" + req.userId;
        g.POST(
          T,
          {
            userType: req.userType,
            skuId: req.skuId,
            detailId: req.detailId,
            packageId: req.packageId,
          },
          c,
          a,
          y
        );
      });
    },
    B = function (req, c, a, y) {
      j(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    j = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        var T = "/v1/cust/mergeCart/" + req.userId;
        g.GET(T, { userType: req.userType, tempKey: req.tempKey }, c, a, y);
      });
    },
    A = function (req, c, a, y) {
      F(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        function (c, y) {
          "function" == typeof a && a(c, y);
        },
        function (c, a) {
          "function" == typeof y && y(c, a);
        }
      );
    },
    F = function (req, c, a, y) {
      require(["commonutil"], function (g) {
        var T = "/v1/cust/orderlistqry/" + req.phoneNo;
        (data = {
          captchaVal: req.captchaVal,
          orderType: "002",
          serialNo: req.serialNo,
          startTime: "",
          endTime: "",
          currentPage: req.pageNo,
          channelId: "00",
          pageSize: req.pageSize,
          isLoginlessQ: "2",
        }),
          g.GET(T, data, c, a, y);
      });
    };
  return {
    getOrderedBusi: function (c, y, g, T) {
      a(c, y, g, T);
    },
    putOrderBusi: function (c, a, g, T, C) {
      y(phonenum, a, g, T, C);
    },
    getOrderInfo: function (req, c, a, y) {
      g(req, c, a, y);
    },
    getOrderBackInfos: function (req, c, a, y) {
      C(req, c, a, y);
    },
    getOrderDetail: function (req, c, a, y) {
      I(req, c, a, y);
    },
    qryOrderHisInfo: function (req, c, a, y) {
      L(req, c, a, y);
    },
    qryRouteInfo: function (req, c, a, y) {
      N(req, c, a, y);
    },
    getExtraOrderInfo: function (req, c, a, y) {
      S(req, c, a, y);
    },
    deleteOrder: function (req, c, a, y) {
      E(req, c, a, y);
    },
    cancelOrder: function (req, c, a, y) {
      z(req, c, a, y);
    },
    returnOrder: function (req, c, a, y) {
      G(req, c, a, y);
    },
    cardOutOrder: function (req, c, a, y) {
      A(req, c, a, y);
    },
    getShoppingGoodsCount: function (req, c, a, y) {
      k(req, c, a, y);
    },
    getShoppingCarList: function (req, c, a, y) {
      U(req, c, a, y);
    },
    shoppingCarDetele: function (req, c, a, y) {
      M(req, c, a, y);
    },
    mergeShoppingCarGoods: function (req, c, a, y) {
      B(req, c, a, y);
    },
  };
});
