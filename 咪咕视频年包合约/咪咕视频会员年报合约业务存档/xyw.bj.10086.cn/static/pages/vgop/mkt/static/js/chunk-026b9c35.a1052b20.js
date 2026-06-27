(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-026b9c35"],
  {
    "1da1": function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      n("d3b7");
      function o(e, t, n, o, r, a, c) {
        try {
          var i = e[a](c),
            s = i.value;
        } catch (u) {
          return void n(u);
        }
        i.done ? t(s) : Promise.resolve(s).then(o, r);
      }
      function r(e) {
        return function () {
          var t = this,
            n = arguments;
          return new Promise(function (r, a) {
            var c = e.apply(t, n);
            function i(e) {
              o(c, r, a, i, s, "next", e);
            }
            function s(e) {
              o(c, r, a, i, s, "throw", e);
            }
            i(void 0);
          });
        };
      }
    },
    "231d": function (e, t, n) {
      "use strict";
      (function (e) {
        n.d(t, "g", function () {
          return G;
        }),
          n.d(t, "f", function () {
            return H;
          }),
          n.d(t, "d", function () {
            return M;
          }),
          n.d(t, "a", function () {
            return F;
          }),
          n.d(t, "c", function () {
            return U;
          }),
          n.d(t, "e", function () {
            return D;
          }),
          n.d(t, "b", function () {
            return R;
          });
        var o = n("c7eb"),
          r = (n("e7e5"), n("d399")),
          a = n("1da1"),
          c =
            (n("ac1f"),
            n("5319"),
            n("d3b7"),
            n("25f0"),
            n("caad"),
            n("2532"),
            n("fb6a"),
            n("e9c4"),
            n("7ded")),
          i = n("bc3a"),
          s = n.n(i),
          u = n("f121"),
          l = n("f8b7"),
          h = n("6f6b"),
          d = n("3452"),
          g = n.n(d),
          f = n("2f5a"),
          p = l["a"].marketOrder,
          m = l["a"].starOrder,
          y = c["a"].encrypt,
          k = c["a"].login4g,
          v = c["a"].isLogin,
          b = c["a"].wgtScanIsLogin,
          S = c["a"].getMarketRule,
          P = c["a"].starLogin,
          T = c["a"].jtstOrderSyn,
          w = c["a"].scanToolCheckData,
          I = c["a"].decryptPhoneByTokenJt,
          O = c["a"].decryptPhoneByTokenYunPan,
          j = c["a"].decryptPhoneByTokenHjq,
          x = c["a"].decryptPhoneByTokenQwhd,
          C = c["a"].decryptPhoneByTokenXdr,
          L = c["a"].decryptPhoneByTokenCloudPhone,
          B = c["a"].decryptPhoneByTokenMiguVideo,
          A = c["a"].decryptPhoneByTokenHeBao,
          N = c["a"].decryptPhoneByTokenSm,
          _ = c["a"].decryptPhoneByTokenBjydxcx,
          E = c["a"].decryptPhoneByTokenLxbjznt,
          G =
            (f["a"].savePageClickLog,
            {
              data: function () {
                return {
                  loginCode: [
                    "189",
                    "252",
                    "298",
                    "300",
                    "231",
                    "309",
                    "237",
                    "260",
                    "243",
                    "257",
                    "337",
                  ],
                  isShowChange: !1,
                };
              },
              created: function () {
                this.$route.query.c
                  ? localStorage.setItem(
                      "c",
                      this.$route.query.c.replace(/\s*/g, "")
                    )
                  : localStorage.setItem("c", -1);
              },
              mounted: function () {
                var e = this;
                eventBus.$on("login", function (t) {
                  var n = t.phone,
                    o = t.isLogin;
                  (e.phone = n), (e.isLogin = o);
                });
              },
              watch: {
                isLogin: function (e) {
                  e &&
                    (this.getMktRule(),
                    localStorage.getItem("c") &&
                      173 == localStorage.getItem("c").substring(0, 3) &&
                      cmcc &&
                      this.cmccGroupOrderSyn(0));
                },
              },
              methods: {
                publicOrderProduct: function () {
                  var e = this;
                  return Object(a["a"])(
                    Object(o["a"])().mark(function t() {
                      var n;
                      return Object(o["a"])().wrap(function (t) {
                        while (1)
                          switch ((t.prev = t.next)) {
                            case 0:
                              if (e.verifyCode) {
                                t.next = 3;
                                break;
                              }
                              return (
                                Object(r["a"])("请输入验证码"),
                                t.abrupt("return", !1)
                              );
                            case 3:
                              if (
                                ((e.isShowLoading = !0),
                                (n = null),
                                243 != localStorage.getItem("c"))
                              ) {
                                t.next = 11;
                                break;
                              }
                              return (
                                (t.next = 8),
                                m({
                                  channelCode: "243",
                                  mktCode: e.mktCode,
                                  productCode: e.productCode,
                                  verifyCode: e.verifyCode,
                                })
                              );
                            case 8:
                              (n = t.sent), (t.next = 14);
                              break;
                            case 11:
                              return (
                                (t.next = 13),
                                p({
                                  mktCode: e.mktCode,
                                  productCode: e.productCode,
                                  verifyCode: e.verifyCode,
                                  channelCode: localStorage.getItem("c"),
                                })
                              );
                            case 13:
                              n = t.sent;
                            case 14:
                              if (((e.isShowLoading = !1), 210 != n.code)) {
                                t.next = 18;
                                break;
                              }
                              return (
                                Object(r["a"])("验证码错误"), t.abrupt("return")
                              );
                            case 18:
                              e.confirmReset(),
                                200 == n.code
                                  ? "true" === n.obj.result
                                    ? ((e.resultTitle = "订购成功"),
                                      (e.isSuccess = !0),
                                      (e.resultMsg =
                                        n.obj.descr || "恭喜您,订购成功"),
                                      252 == e.$route.query.c &&
                                        e.handelGdpOrderSuccess(
                                          e.$route.query.channelId,
                                          document.title,
                                          "mktoid_" + e.productCode
                                        ))
                                    : ((e.resultTitle = "订购失败"),
                                      (e.isSuccess = !1),
                                      (e.resultMsg = n.obj.descr))
                                  : ((e.resultTitle = "订购失败"),
                                    (e.isSuccess = !1),
                                    (e.resultMsg = n.msg || "订购失败")),
                                (e.isResult = !0);
                            case 21:
                            case "end":
                              return t.stop();
                          }
                      }, t);
                    })
                  )();
                },
                cmccGroupOrderSyn: function (e) {
                  var t = this.mktCode,
                    n = {},
                    o = this;
                  cmcc.getConcatenationInfo({
                    debug: !1,
                    success: function (r) {
                      r
                        ? ((n = {
                            channelId: r.channelId,
                            token: r.token,
                            yx: r.yx,
                            channelCode: localStorage.getItem("c"),
                            mktCode: t,
                          }),
                          0 != e && (n.r = e),
                          r.channelId && r.yx && r.token
                            ? T(n)
                            : e < 5
                            ? setTimeout(function () {
                                o.cmccGroupOrderSyn(e + 1);
                              }, 50)
                            : T(n))
                        : e < 5
                        ? setTimeout(function () {
                            o.cmccGroupOrderSyn(e + 1);
                          }, 50)
                        : ((n = {
                            channelId: "",
                            token: "",
                            yx: "",
                            channelCode: localStorage.getItem("c"),
                            r: 5,
                            mktCode: t,
                          }),
                          T(n));
                    },
                    error: function (e) {},
                  });
                },
                getMktRule: function () {
                  var e = this;
                  (this.isShowLoading = !0),
                    S({
                      channelCode: localStorage.getItem("c") || "",
                      mktCode: this.mktCode,
                    })
                      .then(function (t) {
                        (e.isShowLoading = !1),
                          "/diamondMemberYear" === e.$route.path &&
                            (e.arpuResult = t.obj.result),
                          t.obj.result || (e.isARPU = !0);
                      })
                      .catch(function () {
                        e.isShowLoading = !1;
                      });
                },
                encryptionHandler: function (e) {
                  var t = g.a.enc.Utf8.parse("9e5702ead4d643fd"),
                    n = g.a.enc.Utf8.parse(e),
                    o = g.a.AES.encrypt(n, t, {
                      mode: g.a.mode.ECB,
                      padding: g.a.pad.Pkcs7,
                    });
                  return o.toString();
                },
                handelGdpSetPhone: function (e, t) {
                  gdp("setUserId", this.encryptionHandler(e)),
                    this.handelGdpPageView(t);
                },
                handelGdpClearPhone: function () {
                  gdp("clearUserId");
                },
                handelGdpPageView: function (e) {
                  gdp("track", "pageview", {
                    WT_et: "pageview",
                    WT_event: "H5PageShow",
                    WT_channelid: e || "",
                  });
                },
                handelGdpOrderSuccess: function (e, t, n) {
                  gdp("track", "ordst", {
                    WT_et: "ordst",
                    WT_si_x: "99",
                    WT_si_n: t,
                    WT_goods_id: n,
                    WT_channelid: e || "",
                  });
                },
                loginByToken: function (e) {
                  var t = this;
                  return Object(a["a"])(
                    Object(o["a"])().mark(function n() {
                      var a, c, i, s, u;
                      return Object(o["a"])().wrap(function (n) {
                        while (1)
                          switch ((n.prev = n.next)) {
                            case 0:
                              if (
                                ((a = localStorage
                                  .getItem("c")
                                  .substring(0, 3)),
                                !t.$route.query.token)
                              ) {
                                n.next = 66;
                                break;
                              }
                              if (
                                ((c = t.$route.query.token),
                                (i = {
                                  channelCode: localStorage.getItem("c"),
                                  mktCode: t.mktCode,
                                  pageCode: t.pageCode,
                                  token: c,
                                }),
                                (s = null),
                                189 != a && 260 != a)
                              ) {
                                n.next = 11;
                                break;
                              }
                              return (n.next = 8), O(i);
                            case 8:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 11:
                              if (252 != a) {
                                n.next = 17;
                                break;
                              }
                              return (n.next = 14), x(i);
                            case 14:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 17:
                              if (298 != a) {
                                n.next = 23;
                                break;
                              }
                              return (n.next = 20), C(i);
                            case 20:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 23:
                              if (300 != a) {
                                n.next = 29;
                                break;
                              }
                              return (n.next = 26), L(i);
                            case 26:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 29:
                              if (231 != a) {
                                n.next = 35;
                                break;
                              }
                              return (n.next = 32), B(i);
                            case 32:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 35:
                              if (309 != a) {
                                n.next = 41;
                                break;
                              }
                              return (n.next = 38), A(i);
                            case 38:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 41:
                              if (237 != a) {
                                n.next = 47;
                                break;
                              }
                              return (n.next = 44), N(i);
                            case 44:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 47:
                              if (243 != a) {
                                n.next = 53;
                                break;
                              }
                              return (n.next = 50), P(i);
                            case 50:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 53:
                              if (257 != a) {
                                n.next = 59;
                                break;
                              }
                              return (n.next = 56), _(i);
                            case 56:
                              (s = n.sent), (n.next = 63);
                              break;
                            case 59:
                              if (337 != a) {
                                n.next = 63;
                                break;
                              }
                              return (n.next = 62), E(i);
                            case 62:
                              s = n.sent;
                            case 63:
                              200 == s.code
                                ? (Object(h["a"])(
                                    localStorage.getItem("pg"),
                                    localStorage.getItem("c")
                                  ),
                                  243 == a && Object(h["c"])(t.mktCode),
                                  s.obj.headerName
                                    ? localStorage.setItem(
                                        "headerName",
                                        s.obj.headerName
                                      )
                                    : localStorage.removeItem("headerName"),
                                  243 == a
                                    ? s.obj.sessionToken
                                      ? localStorage.setItem(
                                          "token",
                                          s.obj.sessionToken
                                        )
                                      : localStorage.removeItem("token")
                                    : s.obj.token
                                    ? localStorage.setItem("token", s.obj.token)
                                    : localStorage.removeItem("token"),
                                  (t.phone =
                                    243 == a ? s.obj.userPhone : s.obj.phone),
                                  (t.isLogin = !0),
                                  e && e(s),
                                  237 == a &&
                                    ((u = t.$route.query.data),
                                    w({ data: u }).then(function (e) {
                                      201 == e.code &&
                                        Object(r["a"])(
                                          "未获取到营业员信息，请重新扫码再试"
                                        );
                                    })))
                                : t.isHaveToken(),
                                (n.next = 67);
                              break;
                            case 66:
                              t.isHaveToken();
                            case 67:
                            case "end":
                              return n.stop();
                          }
                      }, n);
                    })
                  )();
                },
                verifyLogin: function (e) {
                  try {
                    var t = "";
                    if (
                      ((t = localStorage.getItem("c")
                        ? localStorage.getItem("c").substring(0, 3)
                        : "-1"),
                      276 == t)
                    )
                      return this.andFamilyLoginNew(e), !1;
                    if (173 == t) return this.groupLoginByToken(e), !1;
                    if (this.loginCode.includes(t))
                      return this.loginByToken(e), !1;
                    this.isHaveToken(e);
                  } catch (n) {}
                },
                isHaveToken: function (e) {
                  var t = this;
                  localStorage.getItem("token")
                    ? localStorage.getItem("c") &&
                      "316" == localStorage.getItem("c").substring(0, 3)
                      ? b({
                          token: localStorage.getItem("token"),
                          channelCode: localStorage.getItem("c"),
                        }).then(function (n) {
                          200 == n.code
                            ? ((t.isLogin = !0),
                              (t.phone = n.obj.phone),
                              Object(h["a"])(
                                localStorage.getItem("pg"),
                                localStorage.getItem("c")
                              ),
                              e && e(n))
                            : t.changePhone();
                        })
                      : v({
                          token: localStorage.getItem("token"),
                          channelCode: localStorage.getItem("c"),
                        }).then(function (n) {
                          200 == n.code
                            ? ((t.isLogin = !0),
                              (t.phone = n.obj.phone),
                              Object(h["a"])(
                                localStorage.getItem("pg"),
                                localStorage.getItem("c")
                              ),
                              e && e(n))
                            : t.login4g(e);
                        })
                    : this.login4g(e);
                },
                andFamilyLoginNew: function (e) {
                  var t = this;
                  window.bridge
                    ? ((t.showLoading = !0),
                      window.bridge.callHandler(
                        "getInfo",
                        { key: "token", targetSourceId: "026043" },
                        function (n) {
                          j({
                            token: n,
                            channelCode: localStorage.getItem("c"),
                            mktCode: t.mktCode,
                            pageCode: t.pageCode,
                          })
                            .then(function (n) {
                              (t.showLoading = !1),
                                200 == n.code
                                  ? (n.obj.headerName
                                      ? localStorage.setItem(
                                          "headerName",
                                          n.obj.headerName
                                        )
                                      : localStorage.removeItem("headerName"),
                                    n.obj.token
                                      ? localStorage.setItem(
                                          "token",
                                          n.obj.token
                                        )
                                      : localStorage.removeItem("token"),
                                    n.obj.phone
                                      ? localStorage.setItem("p", n.obj.phone)
                                      : localStorage.removeItem("p"),
                                    (t.phone = n.obj.phone),
                                    (t.isLogin = !0),
                                    e && e(n))
                                  : t.isHaveToken();
                            })
                            .catch(function () {
                              t.isHaveToken();
                            });
                        }
                      ))
                    : setTimeout(function () {
                        t.andFamilyLoginNew(e);
                      }, 500);
                },
                groupLoginByToken: function (e) {
                  var t = this,
                    n = window.navigator.userAgent || "";
                  if (-1 == n.indexOf("leadeon")) return this.isHaveToken(), !1;
                  cmcc.checkSessionIsvalid({
                    debug: !1,
                    success: function (n) {
                      var o = n.status;
                      0 == o
                        ? t.isHaveToken()
                        : cmcc.getYDRZToken({
                            debug: !1,
                            sourceId: "026043",
                            success: function (n) {
                              n.token
                                ? I({
                                    channelCode: localStorage.getItem("c"),
                                    mktCode: t.mktCode,
                                    pageCode: t.pageCode,
                                    token: n.token,
                                  }).then(function (n) {
                                    Object(h["a"])(
                                      localStorage.getItem("pg"),
                                      localStorage.getItem("c")
                                    ),
                                      200 == n.code
                                        ? (n.obj.headerName
                                            ? localStorage.setItem(
                                                "headerName",
                                                n.obj.headerName
                                              )
                                            : localStorage.removeItem(
                                                "headerName"
                                              ),
                                          n.obj.token
                                            ? localStorage.setItem(
                                                "t",
                                                n.obj.token
                                              )
                                            : localStorage.removeItem("t"),
                                          n.obj.phone &&
                                            (_tag.setMobile(n.obj.phone),
                                            localStorage.setItem(
                                              "p",
                                              n.obj.phone
                                            )),
                                          (t.phone = n.obj.phone),
                                          (t.isLogin = !0),
                                          e && e(n))
                                        : t.isHaveToken();
                                  })
                                : t.isHaveToken();
                            },
                            error: function (e) {
                              t.isHaveToken();
                            },
                          });
                    },
                    error: function (e) {
                      t.changePhone("免登录");
                    },
                  });
                },
              },
            }),
          H = {
            methods: {
              login4g: function (e) {
                var t = this;
                try {
                  var n = this,
                    o = "100019";
                  y({
                    appId: o,
                    token: window.VPI.getToken(o),
                    extendParam: localStorage.getItem("c"),
                  })
                    .then(function (a) {
                      "200" == a.code &&
                        window.VPI.check({
                          data: {
                            appId: o,
                            token: encodeURIComponent(a.obj.encryptToken),
                            expandParams: "",
                            isTest: "1",
                          },
                          success: function (c) {
                            var i = "";
                            (i = localStorage.getItem("c")
                              ? localStorage.getItem("c") + ""
                              : "-1"),
                              k({
                                appId: o,
                                token: a.obj.encryptToken,
                                extendParam:
                                  i + "|" + n.mktCode + "|" + n.pageCode,
                              })
                                .then(function (n) {
                                  if ("200" == n.code) {
                                    Object(h["a"])(
                                      localStorage.getItem("pg"),
                                      localStorage.getItem("c")
                                    );
                                    var o = n.obj,
                                      a = o.headerName,
                                      c = o.token,
                                      i = o.phone;
                                    if (
                                      (a
                                        ? localStorage.setItem("headerName", a)
                                        : localStorage.removeItem("headerName"),
                                      !c)
                                    )
                                      return (
                                        localStorage.removeItem("token"),
                                        void t.changePhone("免登录")
                                      );
                                    localStorage.setItem("token", c),
                                      i &&
                                        localStorage.setItem("p", i.slice(2)),
                                      (t.phone = n.obj.phone.slice(2)),
                                      (t.isLogin = !0),
                                      e && e(n);
                                    var s = localStorage
                                      .getItem("c")
                                      .substring(0, 3);
                                    if (237 == s) {
                                      var u = t.$route.query.data;
                                      w({ data: u }).then(function (e) {
                                        201 == e.code &&
                                          Object(r["a"])(
                                            "未获取到营业员信息，请重新扫码再试"
                                          );
                                      });
                                    }
                                  } else t.changePhone("免登录");
                                })
                                .catch(function () {
                                  t.changePhone("免登录");
                                });
                          },
                          error: function (e) {
                            t.changePhone("免登录");
                          },
                        });
                    })
                    .catch(function () {
                      t.changePhone("免登录");
                    });
                } catch (a) {
                  this.changePhone("免登录");
                }
              },
            },
          },
          M = {
            methods: {
              groupLogin: function (t) {
                try {
                  var n = this,
                    o = window.navigator.userAgent || "";
                  if (-1 == o.indexOf("leadeon"))
                    return this.changePhone("免登录"), !1;
                  cmcc.getUserInfo({
                    debug: !1,
                    success: function (o) {
                      if (null == o || "" == o || "null" == o)
                        n.changePhone("免登录");
                      else {
                        var r = o.phoneNumber;
                        null == r || "" == r || "undefined" == r
                          ? n.changePhone("免登录")
                          : cmcc.checkSessionIsvalid({
                              debug: !1,
                              success: function (o) {
                                var r = o.status;
                                if (0 == r) n.changePhone("免登录");
                                else {
                                  var a = e.browser
                                    ? "https://" + window.location.host
                                    : "/";
                                  cmcc.checkUID({
                                    debug: !1,
                                    domain: a,
                                    chanelId: "15100",
                                    success: function (e) {
                                      var o = e.uid;
                                      if (
                                        null == o ||
                                        "" == o ||
                                        "undefined" == o
                                      )
                                        n.changePhone("免登录");
                                      else {
                                        var r = "".concat(
                                          u["baseApi"],
                                          "/s/login/getAuthent"
                                        );
                                        s.a
                                          .post(r, {
                                            UID: o,
                                            channelCode:
                                              localStorage.getItem("c"),
                                          })
                                          .then(function (e) {
                                            var o = e.data.data;
                                            200 == o.code &&
                                              (Object(h["a"])(
                                                localStorage.getItem("pg"),
                                                localStorage.getItem("c")
                                              ),
                                              o.obj.headerName
                                                ? localStorage.setItem(
                                                    "headerName",
                                                    o.obj.headerName
                                                  )
                                                : localStorage.removeItem(
                                                    "headerName"
                                                  ),
                                              o.obj.token
                                                ? localStorage.setItem(
                                                    "token",
                                                    o.obj.token
                                                  )
                                                : localStorage.removeItem(
                                                    "token"
                                                  ),
                                              o.obj.phone &&
                                                (localStorage.setItem(
                                                  "p",
                                                  o.obj.phone
                                                ),
                                                "undefined" !== typeof _tag &&
                                                  _tag.setMobile(o.obj.phone)),
                                              (n.phone = o.obj.phone),
                                              (n.isLogin = !0),
                                              t && t(o));
                                          });
                                      }
                                    },
                                    error: function () {
                                      n.changePhone("免登录");
                                    },
                                  });
                                }
                              },
                              error: function (e) {
                                n.changePhone("免登录");
                              },
                            });
                      }
                    },
                    error: function () {
                      n.changePhone("免登录");
                    },
                  });
                } catch (r) {}
              },
            },
          },
          F = {
            methods: {
              bjSSOLoginGetData: function () {
                var e = this;
                setTimeout(function () {
                  var t = {
                    jsmethodname: "bjLogin",
                    channelsign: "B100037",
                    specialCode: 0,
                  };
                  try {
                    aspireweb.appparamsselect(JSON.stringify(t));
                  } catch (n) {
                    e.changePhone("免登录");
                  }
                }, 0);
              },
            },
          },
          U = {
            methods: {
              changePhone: function (e) {
                "免登录" == e
                  ? 1 == localStorage.getItem("useCaptchaDirectly") &&
                    (this.isShowChange = !0)
                  : (this.isShowChange = !0);
              },
            },
          },
          D = {
            methods: {
              hideChange: function () {
                this.isShowChange = !1;
              },
            },
          },
          R = {
            methods: {
              changeData: function (e) {
                var t = this;
                (this.isLogin = !1),
                  (this.phone = e),
                  this.$nextTick(function () {
                    t.isLogin = !0;
                  });
                var n = localStorage.getItem("c").substring(0, 3);
                if (237 == n) {
                  var o = this.$route.query.data;
                  w({ data: o }).then(function (e) {
                    201 == e.code &&
                      Object(r["a"])("未获取到营业员信息，请重新扫码再试");
                  });
                }
                localStorage.getItem("lightUpScreenTime") &&
                  localStorage.removeItem("lightUpScreenTime");
              },
            },
          };
      }.call(this, n("4362")));
    },
    3: function (e, t) {},
    "7ded": function (e, t, n) {
      "use strict";
      var o = n("5530"),
        r = n("3835"),
        a = n("b775"),
        c = {
          isLogin: "POST /s/login/isLogin",
          encrypt: "POST /s/phone/identify/encrypt",
          login4g: "POST /s/phone/identify/login4g",
          getMarketRule: "POST /s/marketRule/getMarketRule",
          starLogin: "POST /s/xhgj/xhgjSsoLoginToken",
          jtstOrderSyn: "POST /s/login/jtstOrderSyn",
          scanToolCheckData: "POST /s/login/scanToolCheckData",
          decryptPhoneByTokenJt: "POST /s/unifyAuth/decryptPhoneByTokenJt",
          decryptPhoneByTokenYunPan:
            "POST /s/unifyAuth/decryptPhoneByTokenYunPan",
          decryptPhoneByTokenHjq: "POST /s/unifyAuth/decryptPhoneByTokenHjq",
          decryptPhoneByTokenQwhd: "POST /s/unifyAuth/decryptPhoneByTokenQwhd",
          decryptPhoneByTokenXdr: "POST /s/unifyAuth/decryptPhoneByTokenXdr",
          decryptPhoneByTokenCloudPhone:
            "POST /s/unifyAuth/decryptPhoneByTokenCloudPhone",
          decryptPhoneByTokenMiguVideo:
            "POST /s/unifyAuth/decryptPhoneByTokenMiguVideo",
          decryptPhoneByTokenHeBao:
            "POST /s/unifyAuth/decryptPhoneByTokenHeBao",
          decryptPhoneByTokenSm: "POST /s/unifyAuth/decryptPhoneByTokenSm",
          decryptPhoneByTokenBjydxcx:
            "POST /s/unifyAuth/decryptPhoneByTokenBjydxcx",
          decryptPhoneByTokenLxbjznt:
            "POST /s/unifyAuth/decryptPhoneByTokenLxbjznt",
          wgtScanIsLogin: "POST /s/login/wgtScanIsLogin",
        },
        i = function (e) {
          var t = e,
            n = e.split(" "),
            c = Object(r["a"])(n, 3),
            i = c[0],
            s = c[1],
            u = c[2],
            l = void 0 === u ? "" : u;
          return (
            s ? (t = s) : (i = "GET"),
            function (e) {
              return Object(a["a"])(
                { url: t, data: Object(o["a"])({}, e), method: i },
                l
              );
            }
          );
        },
        s = {};
      for (var u in c) s[u] = i(c[u]);
      t["a"] = s;
    },
    c7eb: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      n("a4d3"),
        n("e01a"),
        n("d3b7"),
        n("d28b"),
        n("3ca3"),
        n("ddb0"),
        n("b636"),
        n("944a"),
        n("0c47"),
        n("23dc"),
        n("3410"),
        n("d9e2"),
        n("14d9"),
        n("159b"),
        n("b0c0"),
        n("131a"),
        n("1f68"),
        n("fb6a");
      var o = n("53ca");
      function r() {
        r = function () {
          return t;
        };
        var e,
          t = {},
          n = Object.prototype,
          a = n.hasOwnProperty,
          c =
            Object.defineProperty ||
            function (e, t, n) {
              e[t] = n.value;
            },
          i = "function" == typeof Symbol ? Symbol : {},
          s = i.iterator || "@@iterator",
          u = i.asyncIterator || "@@asyncIterator",
          l = i.toStringTag || "@@toStringTag";
        function h(e, t, n) {
          return (
            Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
              writable: !0,
            }),
            e[t]
          );
        }
        try {
          h({}, "");
        } catch (e) {
          h = function (e, t, n) {
            return (e[t] = n);
          };
        }
        function d(e, t, n, o) {
          var r = t && t.prototype instanceof v ? t : v,
            a = Object.create(r.prototype),
            i = new A(o || []);
          return c(a, "_invoke", { value: x(e, n, i) }), a;
        }
        function g(e, t, n) {
          try {
            return { type: "normal", arg: e.call(t, n) };
          } catch (e) {
            return { type: "throw", arg: e };
          }
        }
        t.wrap = d;
        var f = "suspendedStart",
          p = "suspendedYield",
          m = "executing",
          y = "completed",
          k = {};
        function v() {}
        function b() {}
        function S() {}
        var P = {};
        h(P, s, function () {
          return this;
        });
        var T = Object.getPrototypeOf,
          w = T && T(T(N([])));
        w && w !== n && a.call(w, s) && (P = w);
        var I = (S.prototype = v.prototype = Object.create(P));
        function O(e) {
          ["next", "throw", "return"].forEach(function (t) {
            h(e, t, function (e) {
              return this._invoke(t, e);
            });
          });
        }
        function j(e, t) {
          function n(r, c, i, s) {
            var u = g(e[r], e, c);
            if ("throw" !== u.type) {
              var l = u.arg,
                h = l.value;
              return h && "object" == Object(o["a"])(h) && a.call(h, "__await")
                ? t.resolve(h.__await).then(
                    function (e) {
                      n("next", e, i, s);
                    },
                    function (e) {
                      n("throw", e, i, s);
                    }
                  )
                : t.resolve(h).then(
                    function (e) {
                      (l.value = e), i(l);
                    },
                    function (e) {
                      return n("throw", e, i, s);
                    }
                  );
            }
            s(u.arg);
          }
          var r;
          c(this, "_invoke", {
            value: function (e, o) {
              function a() {
                return new t(function (t, r) {
                  n(e, o, t, r);
                });
              }
              return (r = r ? r.then(a, a) : a());
            },
          });
        }
        function x(t, n, o) {
          var r = f;
          return function (a, c) {
            if (r === m) throw new Error("Generator is already running");
            if (r === y) {
              if ("throw" === a) throw c;
              return { value: e, done: !0 };
            }
            for (o.method = a, o.arg = c; ; ) {
              var i = o.delegate;
              if (i) {
                var s = C(i, o);
                if (s) {
                  if (s === k) continue;
                  return s;
                }
              }
              if ("next" === o.method) o.sent = o._sent = o.arg;
              else if ("throw" === o.method) {
                if (r === f) throw ((r = y), o.arg);
                o.dispatchException(o.arg);
              } else "return" === o.method && o.abrupt("return", o.arg);
              r = m;
              var u = g(t, n, o);
              if ("normal" === u.type) {
                if (((r = o.done ? y : p), u.arg === k)) continue;
                return { value: u.arg, done: o.done };
              }
              "throw" === u.type &&
                ((r = y), (o.method = "throw"), (o.arg = u.arg));
            }
          };
        }
        function C(t, n) {
          var o = n.method,
            r = t.iterator[o];
          if (r === e)
            return (
              (n.delegate = null),
              ("throw" === o &&
                t.iterator["return"] &&
                ((n.method = "return"),
                (n.arg = e),
                C(t, n),
                "throw" === n.method)) ||
                ("return" !== o &&
                  ((n.method = "throw"),
                  (n.arg = new TypeError(
                    "The iterator does not provide a '" + o + "' method"
                  )))),
              k
            );
          var a = g(r, t.iterator, n.arg);
          if ("throw" === a.type)
            return (
              (n.method = "throw"), (n.arg = a.arg), (n.delegate = null), k
            );
          var c = a.arg;
          return c
            ? c.done
              ? ((n[t.resultName] = c.value),
                (n.next = t.nextLoc),
                "return" !== n.method && ((n.method = "next"), (n.arg = e)),
                (n.delegate = null),
                k)
              : c
            : ((n.method = "throw"),
              (n.arg = new TypeError("iterator result is not an object")),
              (n.delegate = null),
              k);
        }
        function L(e) {
          var t = { tryLoc: e[0] };
          1 in e && (t.catchLoc = e[1]),
            2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
            this.tryEntries.push(t);
        }
        function B(e) {
          var t = e.completion || {};
          (t.type = "normal"), delete t.arg, (e.completion = t);
        }
        function A(e) {
          (this.tryEntries = [{ tryLoc: "root" }]),
            e.forEach(L, this),
            this.reset(!0);
        }
        function N(t) {
          if (t || "" === t) {
            var n = t[s];
            if (n) return n.call(t);
            if ("function" == typeof t.next) return t;
            if (!isNaN(t.length)) {
              var r = -1,
                c = function n() {
                  for (; ++r < t.length; )
                    if (a.call(t, r)) return (n.value = t[r]), (n.done = !1), n;
                  return (n.value = e), (n.done = !0), n;
                };
              return (c.next = c);
            }
          }
          throw new TypeError(Object(o["a"])(t) + " is not iterable");
        }
        return (
          (b.prototype = S),
          c(I, "constructor", { value: S, configurable: !0 }),
          c(S, "constructor", { value: b, configurable: !0 }),
          (b.displayName = h(S, l, "GeneratorFunction")),
          (t.isGeneratorFunction = function (e) {
            var t = "function" == typeof e && e.constructor;
            return (
              !!t &&
              (t === b || "GeneratorFunction" === (t.displayName || t.name))
            );
          }),
          (t.mark = function (e) {
            return (
              Object.setPrototypeOf
                ? Object.setPrototypeOf(e, S)
                : ((e.__proto__ = S), h(e, l, "GeneratorFunction")),
              (e.prototype = Object.create(I)),
              e
            );
          }),
          (t.awrap = function (e) {
            return { __await: e };
          }),
          O(j.prototype),
          h(j.prototype, u, function () {
            return this;
          }),
          (t.AsyncIterator = j),
          (t.async = function (e, n, o, r, a) {
            void 0 === a && (a = Promise);
            var c = new j(d(e, n, o, r), a);
            return t.isGeneratorFunction(n)
              ? c
              : c.next().then(function (e) {
                  return e.done ? e.value : c.next();
                });
          }),
          O(I),
          h(I, l, "Generator"),
          h(I, s, function () {
            return this;
          }),
          h(I, "toString", function () {
            return "[object Generator]";
          }),
          (t.keys = function (e) {
            var t = Object(e),
              n = [];
            for (var o in t) n.push(o);
            return (
              n.reverse(),
              function e() {
                for (; n.length; ) {
                  var o = n.pop();
                  if (o in t) return (e.value = o), (e.done = !1), e;
                }
                return (e.done = !0), e;
              }
            );
          }),
          (t.values = N),
          (A.prototype = {
            constructor: A,
            reset: function (t) {
              if (
                ((this.prev = 0),
                (this.next = 0),
                (this.sent = this._sent = e),
                (this.done = !1),
                (this.delegate = null),
                (this.method = "next"),
                (this.arg = e),
                this.tryEntries.forEach(B),
                !t)
              )
                for (var n in this)
                  "t" === n.charAt(0) &&
                    a.call(this, n) &&
                    !isNaN(+n.slice(1)) &&
                    (this[n] = e);
            },
            stop: function () {
              this.done = !0;
              var e = this.tryEntries[0].completion;
              if ("throw" === e.type) throw e.arg;
              return this.rval;
            },
            dispatchException: function (t) {
              if (this.done) throw t;
              var n = this;
              function o(o, r) {
                return (
                  (i.type = "throw"),
                  (i.arg = t),
                  (n.next = o),
                  r && ((n.method = "next"), (n.arg = e)),
                  !!r
                );
              }
              for (var r = this.tryEntries.length - 1; r >= 0; --r) {
                var c = this.tryEntries[r],
                  i = c.completion;
                if ("root" === c.tryLoc) return o("end");
                if (c.tryLoc <= this.prev) {
                  var s = a.call(c, "catchLoc"),
                    u = a.call(c, "finallyLoc");
                  if (s && u) {
                    if (this.prev < c.catchLoc) return o(c.catchLoc, !0);
                    if (this.prev < c.finallyLoc) return o(c.finallyLoc);
                  } else if (s) {
                    if (this.prev < c.catchLoc) return o(c.catchLoc, !0);
                  } else {
                    if (!u)
                      throw new Error("try statement without catch or finally");
                    if (this.prev < c.finallyLoc) return o(c.finallyLoc);
                  }
                }
              }
            },
            abrupt: function (e, t) {
              for (var n = this.tryEntries.length - 1; n >= 0; --n) {
                var o = this.tryEntries[n];
                if (
                  o.tryLoc <= this.prev &&
                  a.call(o, "finallyLoc") &&
                  this.prev < o.finallyLoc
                ) {
                  var r = o;
                  break;
                }
              }
              r &&
                ("break" === e || "continue" === e) &&
                r.tryLoc <= t &&
                t <= r.finallyLoc &&
                (r = null);
              var c = r ? r.completion : {};
              return (
                (c.type = e),
                (c.arg = t),
                r
                  ? ((this.method = "next"), (this.next = r.finallyLoc), k)
                  : this.complete(c)
              );
            },
            complete: function (e, t) {
              if ("throw" === e.type) throw e.arg;
              return (
                "break" === e.type || "continue" === e.type
                  ? (this.next = e.arg)
                  : "return" === e.type
                  ? ((this.rval = this.arg = e.arg),
                    (this.method = "return"),
                    (this.next = "end"))
                  : "normal" === e.type && t && (this.next = t),
                k
              );
            },
            finish: function (e) {
              for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                var n = this.tryEntries[t];
                if (n.finallyLoc === e)
                  return this.complete(n.completion, n.afterLoc), B(n), k;
              }
            },
            catch: function (e) {
              for (var t = this.tryEntries.length - 1; t >= 0; --t) {
                var n = this.tryEntries[t];
                if (n.tryLoc === e) {
                  var o = n.completion;
                  if ("throw" === o.type) {
                    var r = o.arg;
                    B(n);
                  }
                  return r;
                }
              }
              throw new Error("illegal catch attempt");
            },
            delegateYield: function (t, n, o) {
              return (
                (this.delegate = { iterator: N(t), resultName: n, nextLoc: o }),
                "next" === this.method && (this.arg = e),
                k
              );
            },
          }),
          t
        );
      }
    },
    f8b7: function (e, t, n) {
      "use strict";
      var o = n("5530"),
        r = n("3835"),
        a = n("b775"),
        c = {
          getProductInfo: "POST /s/productInfo/getProductInfo",
          marketOrder: "POST /s/marketInfo/marketOrder",
          starOrder: "POST /s/xhgj/saveOrderLog",
          getMarketProInfo: "POST /s/orderConfirm/getMarketProInfo",
          getCrmOrderStatus: "POST /s/crmApiLog/getCrmOrderStatus",
          getProductStatusList: "POST /s/orderStatus/getProductStatusList",
          getOrderInfoAI: "POST /s/aiMoveFamily/getOrderInfo",
          getFlowPrizeByProduct:
            "POST /s/miguReadPolymerization/getFlowPrizeByProduct",
          marketOrderAndWhite: "POST /s/andMessageYear/marketOrderAndWhite",
          getUnifyAuthToken: "POST /s/unifyAuth/getUnifyAuthToken",
          getTokenFiveGCall: "POST /s/unifyAuth/getTokenFiveGCall",
          getTokenStarCall: "POST /s/unifyAuth/getTokenStarCall",
          getMarketProAll: "POST /s/orderConfirmAll/getMarketProList",
          sendVerifyCodeAll: "POST /s/orderConfirmAll/sendVerifyCodeAll",
          orderAll: "POST /s/orderConfirmAll/marketOrderList",
          orderMoveBigDisk: "POST /s/moveBigDisk/marketOrderProduct",
          orderProductProSale:
            "POST /s/sixEighteenFive/orderProductAddDrawCount",
          orderProductProSaleAll:
            "POST /s/sixEighteenFive/marketOrderListAddDrawCount",
          getTargetUserStatus: "POST /s/targetUser/getTargetUserStatus",
          getFlowProduct: "POST /s/flowVerify/getFlowProduct",
        },
        i = function (e) {
          var t = e,
            n = e.split(" "),
            c = Object(r["a"])(n, 3),
            i = c[0],
            s = c[1],
            u = c[2],
            l = void 0 === u ? "" : u;
          return (
            s ? (t = s) : (i = "GET"),
            function (e) {
              return Object(a["a"])(
                { url: t, data: Object(o["a"])({}, e), method: i },
                l
              );
            }
          );
        },
        s = {};
      for (var u in c) s[u] = i(c[u]);
      t["a"] = s;
    },
  },
]);
