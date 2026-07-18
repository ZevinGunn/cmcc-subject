define(function (require) {
  var a = "",
    v = [],
    a = [],
    c = null,
    h = null,
    g = null,
    y = function (req, c, y, b) {
      null == req.user
        ? "function" == typeof y && y("", "请求参数错误")
        : ((a[req.user] = new Date().getTime()),
          (h = null),
          (g = null),
          (req.prod_sort = 0),
          require(["commonutil"], function (a) {
            var h =
              "/v1/cust/favprod/" + req.user + "?prod_sort=" + req.prod_sort;
            a.GET(
              h,
              {},
              function (a) {
                var h = [];
                a.length > 0 && (h = a), (v[req.user] = h), c(h);
              },
              y,
              b
            );
          }));
    },
    b = function (req, c, h, g) {
      if (null == req.user)
        return void ("function" == typeof h && h("", "user为空"));
      var b = v[req.user];
      if (null != b) {
        var I = new Date().getTime(),
          T = a[req.user];
        I - T >= 5e3
          ? y(
              req,
              function (a) {
                "function" == typeof c && c(a);
              },
              h,
              g
            )
          : "function" == typeof c && c(b);
      } else
        y(
          req,
          function (a) {
            "function" == typeof c && c(a);
          },
          h,
          g
        );
    },
    I = function (a, v, h) {
      null == c
        ? require(["commonutil"], function (g) {
            g.GET(
              "/v1/res/dictionary/25",
              {},
              function (v) {
                if (v.length > 0) {
                  for (var h = [], g = 0; g < v.length; g++) {
                    if (v[g].itemName) var y = v[g].itemName.split("#");
                    h.push({ region: y[0], text: y[1] });
                  }
                  c = h;
                } else c = [];
                a(c);
              },
              v,
              h
            );
          })
        : a(c);
    },
    T = function (a, v) {
      for (var c = 0; c < v.length; c++) {
        if (v[c].region)
          var h = v[c].region.split("-"),
            g = parseInt(h[0]),
            y = parseInt(h[1]);
        var b = parseInt(a);
        if (b >= g && y >= b) return { region: v[c].region, text: v[c].text };
      }
      return null;
    },
    L = function (req, a, c, h) {
      b(
        req,
        function () {
          for (var c = v[req.user], h = [], y = {}, b = 0; b < c.length; b++) {
            var I = (c[b], c[b].prodLabel);
            if (null != I && "" != $.trim(I))
              for (var T = I.split("，"), i = 0; i < T.length; i++) {
                var L = T[i];
                if ("" != L) {
                  var S = !1;
                  "undefined" == typeof y[L] ? (y[L] = 1) : y[L]++;
                  for (var N = 0; N < h.length; N++) {
                    var W = h[N];
                    if (L == W.prodLabel) {
                      (W.num = W.num + 1), (S = !0);
                      break;
                    }
                  }
                  S || h.push({ prodLabel: L });
                }
              }
          }
          for (var k = 0; k < h.length; k++) h[k].count = y;
          (g = h), "function" == typeof a && a();
        },
        c,
        h
      );
    },
    S = function (req, a, c, g) {
      b(
        req,
        function () {
          I(
            function (c) {
              for (
                var g = v[req.user], y = [], b = {}, I = 0;
                I < g.length;
                I++
              ) {
                var L = g[I],
                  S = (g[I].prodType, !1),
                  N = T(L.prodType, c);
                if (null != N) {
                  "undefined" == typeof b[N.text]
                    ? (b[N.text] = 1)
                    : b[N.text]++;
                  for (var W = 0; W < y.length; W++) {
                    var k = y[W];
                    if (k.prodTypeName == N.text) {
                      (k.num = k.num + 1), (S = !0);
                      break;
                    }
                  }
                  S || y.push({ region: N.region, prodTypeName: N.text });
                }
              }
              for (var w = 0; w < y.length; w++) y[w].count = b;
              (h = y), "function" == typeof a && a();
            },
            c,
            g
          );
        },
        c,
        g
      );
    },
    N = function (req, a, c, y) {
      b(
        req,
        function () {
          I(
            function (c) {
              for (
                var y = v[req.user], b = [], I = [], L = {}, S = {}, N = 0;
                N < y.length;
                N++
              ) {
                var W = y[N],
                  k = y[N].prodLabel,
                  w = (y[N].prodType, !1),
                  E = T(W.prodType, c);
                if (
                  ("undefined" == typeof L[E.text]
                    ? (L[E.text] = 1)
                    : L[E.text]++,
                  null != E)
                ) {
                  for (var O = 0; O < b.length; O++) {
                    var P = b[O];
                    P.prodTypeName == E.text && ((P.num = P.num + 1), (w = !0));
                  }
                  if (
                    (w || b.push({ region: E.region, prodTypeName: E.text }),
                    null != k && "" != $.trim(k))
                  )
                    for (var V = k.split("，"), i = 0; i < V.length; i++) {
                      var _ = V[i];
                      if ("" != _) {
                        var D = !1;
                        "undefined" == typeof S[_] ? (S[_] = 1) : S[_]++;
                        for (var O = 0; O < I.length; O++) {
                          var G = I[O];
                          if (_ == G.prodLabel) {
                            (G.num = G.num + 1), (D = !0);
                            break;
                          }
                        }
                        D || I.push({ prodLabel: _ });
                      }
                    }
                }
              }
              for (var C = 0; C < b.length; C++) b[C].count = L;
              for (var C = 0; C < I.length; C++) I[C].count = S;
              (h = b), (g = I), "function" == typeof a && a();
            },
            c,
            y
          );
        },
        c,
        y
      );
    },
    W = function (a, c, h, g) {
      return null == a.user || null == a.favId
        ? void ("function" == typeof h && h("", "请求参数错误"))
        : void require(["commonutil"], function (y) {
            var b = "/v1/cust/favproddel/" + a.user + "/" + a.favId;
            y.POST(
              b,
              {},
              function (y) {
                if ("function" == typeof c) {
                  for (
                    var b = a.favId,
                      I = b.split("-"),
                      T = v[a.user],
                      L = [],
                      S = 0;
                    S < T.length;
                    S++
                  ) {
                    for (var W = !1, k = 0; k < I.length; k++)
                      I[k] == T[S].prodId && (W = !0);
                    W || L.push(T[S]);
                  }
                  (v[a.user] = L),
                    N(
                      a,
                      function () {
                        c(y);
                      },
                      h,
                      g
                    );
                }
              },
              h,
              g
            );
          });
    },
    k = function (req, a, v, c) {
      return null == req.user ||
        null == req.paraValue ||
        null == req.paraValue.prodId
        ? void ("function" == typeof v && v("", "请求参数错误"))
        : void require(["commonutil"], function (h) {
            h.POST(
              "/v1/cust/favprod/" + req.user + "?src=1",
              req.paraValue,
              a,
              v,
              c,
              { unlogin: "special" }
            );
          });
    },
    w = function (req, a, c, h) {
      return null == req.user || null == req.prodLabel
        ? void ("function" == typeof c && c("", "请求参数错误"))
        : void require(["commonutil"], function (g) {
            var y = "/v1/cust/favprodmodify/" + req.user + "/" + req.prodId;
            g.POST(
              y,
              { prodLabel: req.prodLabel },
              function (g) {
                for (var y = !1, b = v[req.user], I = 0; I < b.length; I++)
                  req.prodId == b[I].prodId &&
                    ((b[I].prodLabel = req.prodLabel), (y = !0));
                y
                  ? N(
                      req,
                      function () {
                        a(g);
                      },
                      c,
                      h
                    )
                  : c("", "未找到对应id");
              },
              c,
              h
            );
          });
    };
  return {
    getShopWishInfo: function (req, a, v, c) {
      return null == req.user
        ? void ("function" == typeof v && v("", "user为空"))
        : void (
            "function" == typeof a &&
            b(
              req,
              function (v) {
                a(v);
              },
              v,
              c
            )
          );
    },
    getShopWishTypeInfo: function (a, v, c) {
      I(a, v, c);
    },
    getShopWishClassify: function (req, a, v, c) {
      S(
        req,
        function () {
          a(h);
        },
        v,
        c
      );
    },
    getShopWishLabel: function (req, a, v, c) {
      L(
        req,
        function () {
          a(g);
        },
        v,
        c
      );
    },
    getShopWishs: function (req, a, v, c) {
      return null == req.user
        ? void ("function" == typeof v && v("", "user为空"))
        : void (
            "function" == typeof a &&
            b(
              req,
              function (v) {
                var c = [],
                  h = [],
                  g = [];
                if (null == req.qryString) {
                  if (null != req.prodTypeName && null != req.region)
                    for (var y = 0; y < v.length; y++) {
                      var b = v[y],
                        I = req.region.split("-"),
                        T = parseInt(I[0]),
                        L = parseInt(I[1]),
                        S = parseInt(b.prodType);
                      S >= T && L >= S && c.push(y);
                    }
                  else for (var m = 0; m < v.length; m++) c.push(m);
                  if (null != req.prodLabel)
                    for (var y = 0; y < v.length; y++)
                      for (
                        var N = (v[y], v[y].prodLabel.split("，")), i = 0;
                        i < N.length;
                        i++
                      ) {
                        var W = N[i];
                        if ("" != W && W == req.prodLabel) {
                          h.push(y);
                          break;
                        }
                      }
                  else for (var m = 0; m < v.length; m++) h.push(m);
                  for (var i = 0; i < c.length; i++)
                    for (var k = 0; k < h.length; k++)
                      if (parseInt(c[i]) == parseInt(h[k])) {
                        g.push(v[c[i]]);
                        break;
                      }
                  return void a(g);
                }
                if (null != req.qryString) {
                  for (var w = [], y = 0; y < v.length; y++) {
                    var E = v[y],
                      O = !1;
                    try {
                      var P = String(E.prodName),
                        V = new RegExp(req.qryString, "i");
                      -1 != P.search(V) && (O = !0);
                    } catch (_) {
                      O = !1;
                    }
                    O && w.push(E);
                  }
                  return void a(w);
                }
                a(v);
              },
              v,
              c
            )
          );
    },
    deleteShopWish: function (req, a, v, c) {
      W(req, a, v, c);
    },
    postShopWish: function (req, a, v, c) {
      k(req, a, v, c);
    },
    putShopWish: function (req, a, v, c) {
      w(req, a, v, c);
    },
  };
});
