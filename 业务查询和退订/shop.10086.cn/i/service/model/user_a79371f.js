define(function (require) {
  var c = require("commonutil"),
    a = require("stcutil"),
    g = require("stcDic"),
    v = null,
    y = null,
    T = new Array(),
    E = [],
    I = new Array(),
    h = new Array(),
    _ = null,
    b = function (c, a, g) {
      return null != y
        ? void ("function" == typeof c && c(y))
        : void require(["commonutil", "uri"], function (v) {
            v.GET(
              "/v1/res/funcavl",
              {},
              function (a) {
                (y = a), "function" == typeof c && c(a);
              },
              a,
              g
            );
          });
    },
    G = function (req, a, g, v, y, T) {
      var E = "/v1/cust/pageMask/" + req.phoneNo,
        I = { phoneNo: req.phoneNo, pageType: req.pageType };
      c.POST(E, I, a, g, v, y, T);
    },
    N = function (req, c, v) {
      return null != T[req] && "undefined" != typeof T[req]
        ? void ("function" == typeof c && c(T[req]))
        : void require(["commonutil", "uri"], function (y, E) {
            y.GET(
              "/v1/res/menu/" + req,
              {},
              function (a) {
                (T[req] = a), "function" == typeof c && c(a);
              },
              function () {
                var y = new E(location.href).getQueryParamValue("f");
                null != y && a.inArray(y, g.nologinFun)
                  ? c(g.DEBUG_USER_MENU_INFO)
                  : v("", "获取菜单信息失败");
              },
              function () {
                var y = new E(location.href).getQueryParamValue("f");
                null != y && a.inArray(y, g.nologinFun)
                  ? c(g.DEBUG_USER_MENU_INFO)
                  : v("", "获取菜单信息异常");
              }
            );
          });
    },
    S = function (req, c, a, g) {
      var v = "/v1/cust/mergecust/" + req.user;
      require(["commonutil"], function (y) {
        y.GET(v, {}, c, a, g);
      });
    },
    k = function (c, a) {
      var g = "9";
      C(
        function (v) {
          if ("function" == typeof a) {
            v.loginValue == c && ((g = v.brand), a(g));
            var y = v.userAccountList;
            if ("undefined" != typeof y && null != y) {
              for (var i = 0; i < y.length; i++)
                if (y[i].userAccountID == c) {
                  g = y[i].brand;
                  break;
                }
              a(g);
            }
          }
        },
        function () {
          a(g);
        }
      );
    },
    C = function (c, y, T, E) {
      return (
        E && (v = null),
        null != v
          ? void ("function" == typeof c && c(v))
          : void require(["commonutil", "uri"], function (T, E) {
              T.GET(
                "/v1/auth/loginfo",
                {},
                function (a) {
                  (a.loginValueResc = a.loginValue),
                    (a.loginValue = a.loginValue.replace("******", a.safeCode)),
                    "25" == a.userType || "26" == a.userType
                      ? ((a.userType = 1), (a.provice = "000"))
                      : 4 == parseInt(a.userType)
                      ? (a.userType = 0)
                      : 3 == parseInt(a.userType)
                      ? ((a.userType = 1), (a.provice = "998"))
                      : (a.provice = "999");
                  var g = "yxfmxifprj";
                  $.isEmptyObject(a.encryptToken) || (g = a.encryptToken),
                    sessionStorage.removeItem("aqjg_cmcc_month"),
                    a.msgId &&
                      sessionStorage.setItem("aqjg_cmcc_month", a.msgId),
                    sessionStorage.setItem("encryptToken", g),
                    $.cookie("tkpp", g),
                    (v = a),
                    "function" == typeof c && c(a);
                },
                function () {
                  sessionStorage.setItem("encryptToken", "yxfmxifprj");
                  var v = new E(location.href).getQueryParamValue("f");
                  null != v && a.inArray(v, g.nologinFun)
                    ? c(g.defaultUserInfo)
                    : y("", "获取用户信息失败");
                },
                function () {
                  sessionStorage.setItem("encryptToken", "yxfmxifprj");
                }
              );
            })
      );
    },
    D = function (c, a, g) {
      require(["commonutil", "uri"], function (v) {
        v.GET("/v1/fee/planbal/" + g, {}, c, a, function () {}, {
          inx: "packremainqry",
          flag: "true",
        });
      });
    },
    w = function (c, a, g, y) {
      var T = arguments.callee;
      if (null == c)
        return void ("function" == typeof g && g("", "请求参数错误"));
      if ("undefined" != typeof E[c]) return void a(E[c]);
      var I = new Date().getTime();
      "undefined" != typeof belongstamp && 300 > I - belongstamp
        ? setTimeout(function () {
            T(c, a, g, y);
          }, 100)
        : ((belongstamp = I),
          require(["commonutil"], function (T) {
            T.GET(
              "/v1/res/numarea/" + c,
              {},
              function (g) {
                var y = !1;
                if (null != v && "undefined" != typeof v)
                  if (0 == v.userType) v.loginValue == c && (y = !0);
                  else {
                    var T = v.userAccountList;
                    if ("undefined" != typeof T && null != T)
                      for (var i = 0; i < T.length; i++)
                        if (T[i].userAccountID == c) {
                          y = !0;
                          break;
                        }
                  }
                y && (E[c] = g), a(g);
              },
              g,
              y
            );
          }));
    },
    A = function (c, a, g) {
      require(["commonutil"], function (v) {
        v.GET("/v1/area/code", {}, c, a, g);
      });
    },
    B = function (c, a, g, v) {
      var req,
        y = "/v1/cust/hotsmart/" + c.user_id;
      (req = {
        province_id: c.province_id,
        city_id: c.city_id,
        catalog_id: c.catalog_id,
        type: c.type,
      }),
        require(["commonutil"], function (c) {
          c.GET(y, req, a, g, v);
        });
    },
    P = function (req, c, a, g) {
      var v = "/v1/cust/recomhobbies/" + req.user_id,
        y = {
          scene_id: req.scene_id,
          page_no: req.page_no,
          page_size: req.page_size,
        };
      require(["commonutil"], function (T) {
        T.GET(v, y, c, a, g);
      });
    },
    U = function (a, g, v, y, T) {
      "undefined" != typeof h[y]
        ? "function" == typeof a && a(h[y])
        : c.GET(
            "/v1/res/optInfoQry",
            T,
            function (c) {
              var g = c.optInfoList;
              h[y] = [];
              for (var i = 0; i < g.length; i++)
                h[y][g[i].areaID] = g[i].optItems;
              "function" == typeof a && a(h[y]);
            },
            g,
            v
          );
    },
    j = function (a, g, v, y, T) {
      var E = "";
      "undefined" != typeof y && "游客" != y
        ? "undefined" != typeof I[y]
          ? "function" == typeof a && a(I[y])
          : "undefined" != typeof T && "" != T
          ? ((E = T),
            "undefined" == typeof I[y] &&
              c.GET(
                "/v1/cust/tipcfg",
                { provCode: E },
                function (c) {
                  var g = c;
                  I[y] = [];
                  for (var i = 0; i < g.length; i++)
                    I[y][g[i].funcCode] = g[i].tipContent;
                  "function" == typeof a && a(I[y]);
                },
                g,
                v
              ))
          : y.indexOf("@") < 0
          ? w(
              y,
              function (T) {
                (E = T.prov_cd),
                  "undefined" == typeof I[y] &&
                    c.GET(
                      "/v1/cust/tipcfg",
                      { provCode: E },
                      function (c) {
                        var g = c;
                        I[y] = [];
                        for (var i = 0; i < g.length; i++)
                          I[y][g[i].funcCode] = g[i].tipContent;
                        "function" == typeof a && a(I[y]);
                      },
                      g,
                      v
                    );
              },
              function () {},
              function () {}
            )
          : "undefined" == typeof I[y]
          ? c.GET(
              "/v1/cust/tipcfg",
              { provCode: E },
              function (c) {
                var g = c;
                I[y] = [];
                for (var i = 0; i < g.length; i++)
                  I[y][g[i].funcCode] = g[i].tipContent;
                "function" == typeof a && a(I[y]);
              },
              g
            )
          : "function" == typeof a && a(I[y])
        : "undefined" == typeof I[y]
        ? c.GET(
            "/v1/cust/tipcfg",
            { provCode: E },
            function (c) {
              var g = c;
              I[y] = [];
              for (var i = 0; i < g.length; i++)
                I[y][g[i].funcCode] = g[i].tipContent;
              "function" == typeof a && a(I[y]);
            },
            g
          )
        : "function" == typeof a && a(I[y]);
    },
    O = function (a, g, v) {
      c.GET("/v1/auth/loginfoaccess", {}, a, g, v);
    },
    V = function (g, v, y) {
      c.GET(
        "/v1/cust/info/" + y,
        {},
        function (c) {
          c.contactNum = c.contactNum && base64decode(c.contactNum);
          var v = sessionStorage.getItem("encryptToken");
          v || (v = "yxfmxifprj"),
            (c.contactNum = c.contactNum && a.decryptByDES(c.contactNum, v)),
            g(c);
        },
        v,
        function () {},
        { inx: "custinfoqry", flag: "true" }
      );
    },
    F = function (a, g, v, y) {
      var T = "/v1/cust/noticeinfo/" + a;
      c.GET(T, {}, g, v, y);
    },
    L = function (a, g, v, y, T) {
      var E = "/v1/cust/noticeinfo/" + a + "/" + g;
      c.GET(E, {}, v, y, T);
    },
    M = function (a, g, v) {
      c.GET(
        "/v1/busi/plan/" + a,
        {},
        function (c) {
          "function" == typeof g && g(c);
        },
        function (c, a) {
          "function" == typeof v && v(c, a);
        },
        function () {}
      );
    },
    R = function (g, v, y, T) {
      var E = "/v1/cust/info/" + g;
      c.GET(
        E,
        {},
        function (c) {
          c.contactNum = c.contactNum && base64decode(c.contactNum);
          var g = sessionStorage.getItem("encryptToken");
          g || (g = "yxfmxifprj"),
            (c.contactNum = c.contactNum && a.decryptByDES(c.contactNum, g)),
            v(c);
        },
        y,
        T
      );
    },
    z = function (g, v, y, T, E) {
      var I = "/v1/cust/infomodify/" + g,
        h = sessionStorage.getItem("encryptToken");
      h || (h = "yxfmxifprj"),
        (v.contactNum = a.encrypt(v.contactNum, h)),
        (v.contactNum = base64encode(v.contactNum)),
        (v.email = a.encrypt(v.email, h)),
        (v.email = base64encode(v.email)),
        v.address &&
          ((v.address = a.encrypt(v.address, h)),
          (v.address = utf16to8(base64encode(v.address)))),
        c.POST(I, v, y, T, E, { inx: "custinfoqry", flag: "true" });
    },
    Q = function (c, a, g) {
      require(["commonutil"], function (v) {
        v.GET("/v1/fee/real/" + g, {}, c, a, function () {}, {
          inx: "home_hfcx",
          flag: "true",
        });
      });
    },
    W = function (c, a, g) {
      require(["commonutil"], function (v) {
        v.GET("/v1/fee/real/" + g, {}, c, a);
      });
    },
    Y = function (c, a, g) {
      require(["commonutil"], function (v) {
        v.GET("/v1/point/sum/" + g, {}, c, a, a, {
          inx: "home_jfcx",
          flag: "true",
        });
      });
    },
    H = function (c, a, g) {
      require(["commonutil"], function (v) {
        v.GET("/v1/point/sum/v2/" + g, {}, c, a, a, {
          inx: "home_jfcx",
          flag: "true",
        });
      });
    },
    J = function (req, c, a, g) {
      K(
        req,
        function (a) {
          "function" == typeof c && c(a);
        },
        a,
        g
      );
    },
    K = function (req, c, a, g) {
      require(["commonutil"], function (v) {
        var y = "/v2/res/numarea/" + req[0];
        v.GET(y, { captchaVal: req[1] }, c, a, g, {
          inx: "belongqry",
          flag: "true",
        });
      });
    },
    X = function (c) {
      var a = new Date(),
        g = null,
        v = null,
        y = new Date();
      nt(
        function (y) {
          if ("function" == typeof c) {
            g = y;
            var T = new RegExp("^[0-9]{14}$");
            if (T.test(g)) {
              var E = g.substr(0, 4),
                m = g.substr(4, 2),
                d = g.substr(6, 2),
                I = g.substr(8, 2),
                h = g.substr(10, 2),
                s = g.substr(12, 2),
                _ = E + "/" + m + "/" + d + " " + I + ":" + h + ":" + s;
              (v = new Date(_)), (a = v);
            }
            Z(a), c(a);
          }
        },
        function () {
          Z(y), c(y);
        },
        function () {
          Z(y), c(y);
        }
      );
    },
    Z = function (c) {
      (_ = c.getTime()),
        setInterval(function () {
          _ += 1e3;
        }, 1e3);
    },
    nt = function (c, a, g) {
      require(["commonutil"], function (v) {
        v.GET("/v1/res/sysdate", {}, c, a, g);
      });
    },
    tt = function (req, c, a, g) {
      require(["commonutil"], function (v) {
        v.POST("/v1/cust/getwblist/" + req.userId, req, c, a, g);
      });
    },
    et = function (req, c, a, g) {
      require(["commonutil"], function (v) {
        v.POST("/v1/cust/getwbdetail/" + req.userId, req, c, a, g);
      });
    },
    ot = function (c, a, g, v) {
      var req,
        y = "/v1/cust/recomhobbies/" + c.user_id;
      (req = {
        scene_id: c.scene_id,
        page_no: c.page_no,
        page_size: c.page_size,
      }),
        require(["commonutil"], function (c) {
          c.GET(y, req, a, g, v);
        });
    },
    it = function (req, c, a, g) {
      var v = "/v1/auth/updateInfo/" + req.user;
      require(["commonutil"], function (y) {
        y.GET(
          v,
          {},
          function (a) {
            "function" == typeof c && c(a);
          },
          a,
          g
        );
      });
    },
    ut = function (req, c, a, g) {
      var v = "/v1/cust/getThirdUrl/" + req.phoneNo;
      require(["commonutil"], function (y) {
        var T = {
          targetSysId: req.targetSysId,
          channelType: "1",
          extParam: { param1: req.param1, param2: req.param2 },
        };
        y.POST(v, T, c, a, g);
      });
    };
  return {
    getMenuInfo: function (req, c, a, g) {
      N(req, c, a, g);
    },
    getFuncAuthInfo: function (c, a, g) {
      b(c, a, g);
    },
    getMobileBrand: function () {
      k();
    },
    getBaseInfo: function (c, a, g, v) {
      C(c, a, g, v);
    },
    getPackRemain: function (c, a, g) {
      D(c, a, g);
    },
    getUserBelongInfo: function (c, a, g, v) {
      w(c, a, g, v);
    },
    getAreaCodeByIp: function (c, a, g) {
      A(c, a, g);
    },
    getShopYouLoveInfo: function (c, a, g, v) {
      B(c, a, g, v);
    },
    recomhobbies: function (req, c, a, g) {
      P(req, c, a, g);
    },
    getWarmTip: function (c, a, g, v, y) {
      j(c, a, g, v, y);
    },
    getInfoAccess: function (c, a, g) {
      O(c, a, g);
    },
    getMobileInfo: function (c, a, g) {
      V(c, a, g);
    },
    getNoticeList: function (c, a, g, v) {
      F(c, a, g, v);
    },
    getNoticeDetail: function (c, a, g, v, y) {
      L(c, a, g, v, y);
    },
    getPackagesInfo: function (c, a, g) {
      M(c, a, g);
    },
    getUserInfo: function (c, a, g, v) {
      R(c, a, g, v);
    },
    modifyUserInfo: function (c, a, g, v, y) {
      z(c, a, g, v, y);
    },
    getBalance: function (c, a, g) {
      Q(c, a, g);
    },
    getRealFee: function (c, a, g) {
      W(c, a, g);
    },
    getTotalPoint: function (c, a, g) {
      Y(c, a, g);
    },
    getTotalPointNoCathe: function (c, a, g) {
      H(c, a, g);
    },
    getUserBelong: function (req, c, a, g) {
      J(req, c, a, g);
    },
    getLogout: function (a, g) {
      c.GET("/v1/auth/userlogout", {}, a, g);
    },
    subEmail: function (req, a, g, v) {
      c.GET("/v1/cust/email/" + req.phoneno, {}, a, g, v);
    },
    getSysTime: function (c) {
      null != _
        ? c(_)
        : X(function () {
            c(_);
          });
    },
    getStarScore: function (a, g, v, y) {
      c.GET("/v1/cust/starscoreinfo/" + a, {}, g, v, y, {
        inx: "starprefecture",
        flag: "true",
      });
    },
    getMergeInfo: function (req, c, a, g) {
      S(req, c, a, g);
    },
    getBandReservaList: function (req, c, a, g) {
      tt(req, c, a, g);
    },
    getBandReservaOrderDetail: function (req, c, a, g) {
      et(req, c, a, g);
    },
    getELearnInfo: function (c, a, g, v) {
      ot(c, a, g, v);
    },
    getFlushBindInfo: function (req, c, a, g) {
      it(req, c, a, g);
    },
    getOperationInfo: function (c, a, g, v, y) {
      U(c, a, g, v, y);
    },
    getThirdUrl: function (req, c, a, g) {
      ut(req, c, a, g);
    },
    pageMask: function (req, c, a, g, v, y) {
      G(req, c, a, g, v, y);
    },
  };
});
