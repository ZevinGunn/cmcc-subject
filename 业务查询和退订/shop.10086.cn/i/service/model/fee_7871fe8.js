define(function (require) {
  var c,
    a = require("stcutil"),
    g = require("stclog"),
    v = (require("stcDic"), require("commonutil")),
    y = new Array(),
    _ = new Array(),
    T = new Array(),
    h = new Array(),
    b = 20,
    w = 100,
    A = new Array(),
    D = new Array(),
    S = new Array(),
    O = new Array(),
    M = new Array(),
    N = new Array(),
    I = new Array(),
    j = { inx: "billqry", flag: "true" },
    C = { inx: "billdetailqry", flag: "true" },
    E = function (req, c, a, g) {
      var y = {};
      v.GET("/v1/fee/touchbillinfo/" + req.userid, y, c, a, g, j);
    },
    G = function (req, c, a, g) {
      var y = "/v1/fee/customertrend/" + req.userid,
        _ = { nowMonth: req.nowMonth };
      v.GET(y, _, c, a, g);
    },
    P = function (req, g, v, _) {
      var T = req.userid,
        h = req.bgnMonth;
      a.getSysDate(
        "undefined" != typeof y[T + "_" + h] && null != y[T + "_" + h]
          ? function (a) {
              var b = a.getTime(),
                w = b - y[T + "_" + h][0];
              req.bgnMonth == req.endMonth && w > 9e5
                ? U(
                    req,
                    function (c, a) {
                      var y = V(c, b, h, T);
                      "function" == typeof g && null != y
                        ? null != a.paging.sOperTime
                          ? g(y, a.paging.sOperTime)
                          : g(y)
                        : v("", "");
                    },
                    function (c, a, g) {
                      v(c, a, g);
                    },
                    function (c, a, g) {
                      _(c, a, g);
                    }
                  )
                : g(y[T + "_" + h][1], c);
            }
          : function (a) {
              var y = a.getTime();
              U(
                req,
                function (a, _) {
                  c = _.paging.sOperTime;
                  var b = V(a, y, h, T);
                  "function" == typeof g && null != b
                    ? null != _.paging.sOperTime
                      ? g(b, _.paging.sOperTime)
                      : g(b)
                    : v("", "");
                },
                function (c, a) {
                  v(c, a);
                },
                function (c, a) {
                  _(c, a);
                }
              );
            }
      );
    },
    k = function (req, c, a, g) {
      var r = req[1],
        n = req[2];
      (req[1] = (r - 1) * n + 1), (req[2] = w);
      var v = req[0],
        y = req[3],
        T = req[4],
        j = 0,
        C = v + "_" + y + "_" + T + "_" + r,
        E = y + "_" + T,
        G = B(C);
      if (-1 != G) {
        var P = K(G),
          k = L(G),
          H = Q(G);
        z(P, k, H),
          F(G),
          (_infoNum = $.cookie("infoNums")),
          c(H, A[E], D[E], S[E], O[E], _infoNum, M[E], N[E], I[E]);
      } else
        W(
          req,
          function (a, g) {
            if ("function" == typeof c) {
              var v = g.paging.totalNum;
              if ("undefined" == typeof v || 0 >= v) c(null, 0);
              else {
                _data = a.msgRecords ? a.msgRecords : a;
                var w = a.msgInfos ? a.msgInfos : "";
                $.cookie("infoNums", w),
                  (A[E] = v),
                  (D[E] = g.paging.startDate),
                  (S[E] = g.paging.endDate),
                  (O[E] = g.paging.sOperTime),
                  (M[E] = g.paging.callerTime),
                  (N[E] = g.paging.calleeTime),
                  (I[E] = g.paging.allFlowNum);
                var G = _data.length,
                  P = req[0],
                  k = G / n,
                  H = (r - 1) * n + G;
                for (H == v && (k += 1), k = r - 1 + k, i = r; k > i; i++) {
                  var R = i - r,
                    J = _data.slice(R * n, (R + 1) * n),
                    V = P + "_" + y + "_" + T + "_" + i,
                    K = _.length;
                  if (K == b) F(0);
                  else {
                    var L = B(V);
                    -1 != L && F(L);
                  }
                  z(V, J.length, J);
                }
                for (var i = _.length - 1; i >= 0; i--)
                  if (_[i] == C) {
                    j = i;
                    break;
                  }
                c(h[j], A[E], D[E], S[E], O[E], w, M[E], N[E], I[E]);
              }
            }
          },
          function (c, g, v) {
            "function" == typeof a && a(c, g, v);
          },
          function (c, a, v) {
            "function" == typeof g && g(c, a, v);
          }
        );
    },
    H = function (req, c, a, g) {
      X(
        req,
        function () {
          "function" == typeof c && c();
        },
        function (c, g) {
          "function" == typeof a && a(c, g);
        },
        function (c, a) {
          "function" == typeof g && g(c, a);
        }
      );
    },
    R = function (req, c, a, g) {
      Y(
        req,
        function () {
          "function" == typeof c && c();
        },
        function (c, g) {
          "function" == typeof a && a(c, g);
        },
        function (c, a) {
          "function" == typeof g && g(c, a);
        }
      );
    },
    J = function (req, c, a) {
      var v = new Date();
      ee(
        req,
        function (a) {
          var y = {
            funCode: "010",
            userAccountID: req.user_id,
            operDesc: "/v1/fee/detailbilltempidentjsonp/" + req.user_id,
            param: JSON.stringify(a),
            startTime: v,
          };
          g.info(null, y), "function" == typeof c && c(a);
        },
        function (c, y) {
          var _ = {
            funCode: "010",
            userAccountID: req.user_id,
            operDesc: "/v1/fee/detailbilltempidentjsonp/" + req.user_id,
            param: JSON.stringify(y),
            startTime: v,
          };
          g.info(null, _), "function" == typeof a && a(c, y);
        },
        function (c, y) {
          var _ = {
            funCode: "010",
            userAccountID: req.user_id,
            operDesc: "/v1/fee/detailbilltempidentjsonp/" + req.user_id,
            param: JSON.stringify(y),
            startTime: v,
          };
          g.info(null, _),
            "function" == typeof a && a("999999", "系统异常,请稍后再试");
        }
      );
    },
    V = function (c, a, g, v) {
      for (var i in c) {
        var d = c[i],
          _ = d.billMonth;
        (y[v + "_" + _] = []), (y[v + "_" + _][0] = a), (y[v + "_" + _][1] = d);
      }
      return "undefined" != typeof y[v + "_" + g] &&
        "undefined" != typeof y[v + "_" + g][1]
        ? y[v + "_" + g][1]
        : null;
    },
    B = function (c) {
      var a = -1;
      if (_.length > 0) {
        for (var i = _.length - 1; i >= 0; i--)
          if (_[i] == c) {
            a = i;
            break;
          }
        return a;
      }
      return a;
    },
    F = function (c) {
      _.splice(c, 1), T.splice(c, 1), h.splice(c, 1);
    },
    z = function (c, a, g) {
      _.push(c), T.push(a), h.push(g);
    },
    K = function (c) {
      return _[c];
    },
    L = function (c) {
      return T[c];
    },
    Q = function (c) {
      return h[c];
    },
    U = function (req, c, a, g) {
      require(["commonutil"], function (v) {
        var y = "/v1/fee/touchbillinfo/" + req.userid,
          _ = { bgnMonth: req.bgnMonth, endMonth: req.endMonth };
        v.GET(y, _, c, a, g, j);
      });
    },
    W = function (req, c, a, g) {
      require(["commonutil"], function (v) {
        var y = "/v1/fee/detailbillinfojsonp/" + req[0];
        v.HTTPSGET(
          y,
          {
            curCuror: req[1],
            step: req[2],
            qryMonth: req[3],
            billType: req[4],
          },
          c,
          a,
          g,
          C
        );
      });
    },
    X = function (req, c, a, g) {
      require(["commonutil"], function (v) {
        var y = "/v1/fee/detbillrandomcodejsonp/" + req.userPhone;
        v.HTTPSGET(y, {}, c, a, g);
      });
    },
    Y = function (req, c, a, g) {
      require(["commonutil"], function (v) {
        var y = "/v1/cust/commonSms/" + req.phoneNo;
        v.POST(y, req, c, a, g);
      });
    },
    Z = function (req, c, a, g) {
      v.POST(
        "v1/pay/deleteorder/" + req.user_id,
        { orderId: req.order_id, payDate: req.qry_date, channel: req.channel },
        c,
        a,
        g
      );
    },
    ee = function (req, c, a, g) {
      require(["commonutil"], function (v) {
        var y = "/v1/fee/detailbilltempidentjsonp/" + req.user_id;
        v.HTTPSGET(
          y,
          {
            pwdTempSerCode: base64encode(utf16to8(req.servcode)),
            pwdTempRandCode: base64encode(utf16to8(req.veccode)),
            captchaVal: req.imgcode,
          },
          c,
          a,
          g
        );
      });
    };
  return {
    getBillInfoHome: function (req, c, a, g) {
      E(req, c, a, g);
    },
    getBillInfo: function (req, c, a, g) {
      P(req, c, a, g);
    },
    getDetailInfo: function (req, c, a, g) {
      k(req, c, a, g);
    },
    sendSmsVec: function (req, c, a) {
      H(req, c, a);
    },
    commonSms: function (req, c, a) {
      R(req, c, a);
    },
    submitDetailVec: function (req, c, a) {
      J(req, c, a);
    },
    deleteOrderRecord: function (req, c, a, g) {
      Z(req, c, a, g);
    },
    getconsumtrend: function (req, c, a, g) {
      G(req, c, a, g);
    },
  };
});
