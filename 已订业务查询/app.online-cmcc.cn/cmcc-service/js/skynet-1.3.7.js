!(function () {
  var e = {
      785: function (e) {
        var t = {
          getItem: function (e) {
            try {
              return JSON.parse(localStorage.getItem(e));
            } catch (e) {
              return "";
            }
          },
          clear: function (e) {
            try {
              return localStorage.setItem(e, "");
            } catch (e) {
              return "";
            }
          },
          setItem: function (e, t) {
            try {
              var n = localStorage.getItem(e),
                r = [];
              n && ((r = JSON.parse(n)).length || (r = [r])),
                t.length ? (r = r.concat(t)) : r.push(t),
                localStorage.setItem(e, JSON.stringify(r));
            } catch (e) {}
          },
        };
        e.exports = t;
      },
      944: function (e) {
        var t = !1,
          n = !1;
        window.__SKYNET &&
          window.__SKYNET.appName &&
          !window.__SKYNET.init &&
          ((t = !0),
          (void 0 === window.__SKYNET.sendError || window.__SKYNET.sendError) &&
            (n = !0),
          void 0 !== window.__SKYNET.rate &&
            (t =
              0 !== window.__SKYNET.rate &&
              (100 === window.__SKYNET.rate ||
                (100 * Math.random()) >> 1 <= window.__SKYNET.rate))),
          (e.exports = { needSendPerformance: t, needSendError: n });
      },
      713: function (e, t, n) {
        n(782);
        var r = n(947),
          o = n(607),
          i = n(181),
          s = n(493),
          a = n(607),
          p = a.sendWithInfo,
          d = a.sendBeaconWithInfo,
          u = n(944),
          c =
            performance.timing.navigationStart || performance.timing.fetchStart,
          l = document.documentElement.clientHeight;
        window.__SKYNET = window.__SKYNET || {};
        var f,
          h,
          w,
          m = document.documentElement,
          g = 0,
          _ = !1,
          x = 0,
          v = 0,
          y = {},
          S = 0,
          b = 0,
          E = 0,
          O = {},
          T = 0,
          M = 0,
          N = null,
          L = { type: "", time: 0, message: "" },
          Y = { node: null, time: 0 },
          K = !1,
          k = null;
        function R() {
          try {
            return Math.round(
              (performance.getEntriesByName("first-paint")[0] || {})
                .startTime || 0
            );
          } catch (e) {
            return new Date() - c;
          }
        }
        function H() {
          try {
            return Math.round(
              (performance.getEntriesByName("first-contentful-paint")[0] || {})
                .startTime || 0
            );
          } catch (e) {
            return 0;
          }
        }
        if (!window.__SKYNET.init) {
          var V = function (e) {
              h || (h = { time: Date.now() });
              var t = 0,
                n = e[0],
                r = n.nodeName.toLowerCase();
              if (
                ("script" !== r &&
                  "style" !== r &&
                  "link" !== r &&
                  "#text" !== r &&
                  1 == ++g &&
                  setTimeout(function () {
                    M = Date.now() - c;
                  }, 0),
                E < 2 &&
                  "script" !== r &&
                  "style" !== r &&
                  "link" !== r &&
                  "#text" !== r &&
                  n.getBoundingClientRect)
              ) {
                var o = Date.now();
                (site = n.getBoundingClientRect()),
                  (t = site.y || site.top),
                  site.height &&
                    site.height < l &&
                    t + site.height + 20 >= l &&
                    (++E > 1 && (b = o - c),
                    (N = n),
                    (O = { time: b, node: n }),
                    P());
              }
              e.length &&
                (clearTimeout(w),
                (Y.time = Date.now() - c),
                (Y.node = e[0]),
                (w = setTimeout(function () {
                  (O = Y), (T = Y.time), P(T);
                }, 200)));
            },
            B = function (e) {
              v++,
                (y[e.url] = {}),
                (y[e.url].timer = setTimeout(function () {
                  (y[e.url].timeout = !0), v--, P();
                }, 1e3 * s.maxXHR));
            },
            P = function (e) {
              x ||
                (function (e) {
                  if (T && !x) {
                    var t = R() || M,
                      n = H(),
                      i = 0;
                    (T || b) &&
                      v <= 1 &&
                      ((i = Math.max(S || T, b, n) >> 0),
                      clearTimeout(k),
                      (k = setTimeout(function () {
                        (t = R() || M),
                          (i = Math.max(t, S || T, b) >> 0),
                          (x = e - c),
                          r.off("__networkBack"),
                          r.off("__networkSend", B),
                          (x = Math.max(e - c, i)),
                          i === S
                            ? ((L.type = "lcp"), (L.time = i))
                            : i === T
                            ? ((L.type = O.type || "lcpfix"),
                              (L.time = i),
                              (L.message = O.node
                                ? (O.node.outerHTML || "").slice(0, 100)
                                : ""))
                            : ((L.type = "bottom"),
                              (L.time = i),
                              (L.message = N
                                ? (N.outerHTML || "").slice(0, 100)
                                : "")),
                          K ||
                            ((K = !0),
                            r.fire("profilekeys", { fp: t, fsp: i, tti: x })),
                          i >= 1e4 &&
                            o.sendWithInfo(
                              "keypoints",
                              "slow",
                              JSON.stringify(L)
                            ),
                          f.disconnect && f.disconnect();
                      }, 1e3)));
                  }
                })(e || Date.now());
            },
            X = function () {
              return !_ && g < 4 && document.body.innerText.length < 50;
            };
          try {
            u.needSendPerformance &&
              (f = new MutationObserver(function (e) {
                for (var t, n = 0, r = e.length; n < r; n++)
                  (t = e[n]).addedNodes.length && V(t.addedNodes);
              })).observe(m, { childList: !0, attributes: !1, subtree: !0 });
          } catch (e) {
            (_ = !0), console.error(e), (window.errors += e.message);
          }
          try {
            u.needSendPerformance &&
              new PerformanceObserver(function (e) {
                var t = e.getEntries(),
                  n = t[t.length - 1];
                (S = Math.round(n.renderTime || n.loadTime)), P();
              }).observe({ type: "largest-contentful-paint", buffered: !0 });
          } catch (e) {}
          u.needSendPerformance &&
            (r.on("__networkSend", B),
            r.on("__networkBack", function (e) {
              y[e.url].timeout || (v--, clearTimeout(y[e.url].timer), P());
            }),
            u.needSendError &&
              (r.on("longRequest", function (e) {
                o.sendWithInfo("xhr", "slow", JSON.stringify(e));
              }),
              r.on("longRun", function (e) {
                o.sendWithInfo("jsRun", "slow", JSON.stringify(e));
              }),
              r.on("error", function (e) {
                ("ajaxError" !== e.name && "fetchError" !== e.name) ||
                !window.__SKYNET.ajaxErrorFilter
                  ? o.sendWithInfo(e.name, e.type, e.msg)
                  : window.__SKYNET.ajaxErrorFilter(e.url) ||
                    o.sendWithInfo(e.name, e.type, e.msg);
              })));
          var I = !1;
          u.needSendPerformance &&
            (setTimeout(function () {
              X() &&
                !I &&
                ((I = !0),
                p(
                  "whiteScreen",
                  "paintError",
                  g + " - " + document.body.innerText
                )),
                K || ((K = !0), r.fire("profilekeys", A()));
            }, 1e4),
            r.bindBrowserEvent(window, "beforeunload", function () {
              !I &&
                X() &&
                Date.now() - c > 5e3 &&
                ((I = !0),
                d(
                  "whiteScreen",
                  "paintError",
                  "unload - " +
                    g +
                    " - " +
                    document.body.innerText +
                    (Date.now() - c)
                ));
            }));
        }
        function A() {
          var e = R() >> 0 || M;
          i.init();
          var t = Math.max(S || T, b, H()) >> 0;
          return { fp: e, fsp: t, tti: (x = Math.max(x, t) >> 0) };
        }
        e.exports = A;
      },
      947: function (e) {
        var t = {};
        e.exports = {
          bindBrowserEvent: function (e, t, n, r) {
            var o = !1;
            void 0 !== r && (o = r),
              e.addEventListener
                ? e.addEventListener(t, n, o)
                : e.attachEvent && e.attachEvent("on" + t, n);
          },
          off: function (e, n) {
            var r = t[e];
            if (r && r.length)
              if (n) {
                for (var o = 0, i = r.length; o < i; o++)
                  if (r[o] === n) {
                    r.splice(o, 1);
                    break;
                  }
              } else t[e] = [];
          },
          on: function (e, n) {
            t[e] || (t[e] = []), t[e].push(n);
          },
          fire: function (e, n) {
            var r = t[e];
            if (r && r.length)
              for (var o = 0, i = r.length; o < i && !1 !== r[o](n); o++);
          },
        };
      },
      374: function (e) {
        var t,
          n,
          r =
            "1" ===
            ((t = location.search.substring(1)),
            (n = {}),
            t.split("&").forEach(function (e) {
              var t = e.split("=");
              n[t[0]] = t[1];
            }),
            n).debug;
        e.exports = r;
      },
      782: function (e, t, n) {
        function r(e) {
          return (
            (r =
              "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
                ? function (e) {
                    return typeof e;
                  }
                : function (e) {
                    return e &&
                      "function" == typeof Symbol &&
                      e.constructor === Symbol &&
                      e !== Symbol.prototype
                      ? "symbol"
                      : typeof e;
                  }),
            r(e)
          );
        }
        var o = n(947),
          i = n(493),
          s = n(944),
          a = 1e3 * i.maxXHR,
          p = 1e3 * i.maxJsRun,
          d = window.XMLHttpRequest,
          u = 0;
        function c(e) {
          try {
            return (
              -1 === e.indexOf("cmos/profile") &&
              -1 === e.indexOf("tracker") &&
              -1 === e.indexOf("/pf") &&
              -1 === e.indexOf("/printLog")
            );
          } catch (e) {
            return !0;
          }
        }
        if (
          ((window.__SKYNET = window.__SKYNET || {}),
          !window.__SKYNET.init && s.needSendPerformance)
        ) {
          try {
            if (window.fetch) {
              var l = window.fetch;
              window.fetch = function (e, t) {
                return new Promise(function (n, i) {
                  var s = Date.now(),
                    p = 0;
                  (t ? l(e, t) : l(e))
                    .then(function (t) {
                      var i = "object" === r(e) ? e.url : e;
                      if (t.ok)
                        (p = Date.now() - s) > a &&
                          o.fire("longRequest", { time: p, url: i });
                      else if (c(i))
                        if (window.__SKYNET.xhrStatusFilter)
                          try {
                            -1 ===
                              window.__SKYNET.xhrStatusFilter.indexOf(
                                t.status
                              ) &&
                              o.fire("error", {
                                name: "fetchError",
                                type: "network",
                                msg: i + " status " + t.status,
                                url: i,
                              });
                          } catch (e) {}
                        else
                          o.fire("error", {
                            name: "fetchError",
                            type: "network",
                            msg: i + " status " + t.status,
                            url: i,
                          });
                      n(t);
                    })
                    .catch(function (t) {
                      var n = "object" === r(e) ? e.url : e;
                      c(n) &&
                        o.fire("error", {
                          name: "fetchError",
                          type: "network",
                          msg:
                            n +
                            " " +
                            (t.type || t.name) +
                            " " +
                            (t.message || "").substring(100) +
                            " status -1",
                          url: n,
                        }),
                        i(t);
                    });
                });
              };
            }
          } catch (e) {
            o.fire("JsError", {
              name: "jsRun",
              type: "fetchRun",
              msg: e.message,
            });
          }
          (window.XMLHttpRequest = function () {
            (this._id = u++),
              (this._start = 0),
              (this._xhr = new d()),
              (this.readyState = 0),
              (this.status = 0),
              (this.onreadystatechange = null),
              (this.responseText = ""),
              (this.responseURL = ""),
              (this.responseXML = null),
              (this.response = ""),
              (this.responseType = "");
            var e = 0;
            (this.aborted = !1),
              (this.upload = this._xhr.upload),
              (this.withCredentials = this._xhr.withCredentials);
            var t = this,
              n = "",
              r = !1;
            Object.defineProperty(this, "withCredentials", {
              set: function (e) {
                t._xhr.withCredentials = r = e;
              },
              get: function () {
                return r;
              },
            }),
              Object.defineProperty(this, "timeout", {
                set: function (n) {
                  (e = n), (t._xhr.timeout = n);
                },
                get: function () {
                  return e;
                },
              }),
              Object.defineProperty(this, "responseType", {
                set: function (e) {
                  (n = e), (t._xhr.responseType = e);
                },
                get: function () {
                  return n;
                },
              });
          }),
            (XMLHttpRequest.prototype.open = function (e, t, n) {
              void 0 === n && (n = !0),
                (this._url = t),
                (this._type = n),
                (this._method = e),
                (this._start = Date.now()),
                this._xhr.open(e, t, n);
            }),
            (XMLHttpRequest.prototype.send = function (e) {
              var t = this;
              c(t._url) && o.fire("__networkSend", { url: t._url }),
                Object.defineProperty ||
                  "" === this.responseType ||
                  (this._xhr.responseType = this.responseType),
                (this._xhr.onreadystatechange = function (e) {
                  if (4 === t._xhr.readyState)
                    if (
                      (t._xhr.status >= 200 && t._xhr.status < 300) ||
                      304 === t._xhr.status
                    ) {
                      var n = Date.now() - t._start;
                      if (
                        (n > a &&
                          o.fire("longRequest", { time: n, url: t._url }),
                        (t.responseURL = t._xhr.responseURL),
                        ("" !== this.responseType &&
                          "text" !== this.responseType) ||
                          (t.responseText = t._xhr.responseText),
                        ("" !== this.responseType &&
                          "" !== this.responseType) ||
                          (t.responseXML = t._xhr.responseXML),
                        (t.response = t._xhr.response),
                        "json" === t.responseType &&
                          "string" == typeof t.response)
                      )
                        try {
                          t.response = JSON.parse(t.response);
                        } catch (e) {}
                      t._type && (t._start = Date.now()),
                        setTimeout(function () {
                          var e = Date.now() - t._start - 10;
                          c(t._url) &&
                            o.fire("__networkBack", {
                              url: t._url,
                              useTime: e,
                            }),
                            e > p &&
                              o.fire("longRun", { time: e, url: t._url });
                        }, 10);
                    } else {
                      if (c(t._url))
                        if (window.__SKYNET.xhrStatusFilter)
                          try {
                            -1 ===
                              window.__SKYNET.xhrStatusFilter.indexOf(
                                t._xhr.status
                              ) &&
                              o.fire("error", {
                                name: "ajaxError",
                                type: "network",
                                msg: t._url + " status " + t._xhr.status,
                                url: t._url,
                              });
                          } catch (e) {}
                        else
                          o.fire("error", {
                            name: "ajaxError",
                            type: "network",
                            msg: t._url + " status " + t._xhr.status,
                            url: t._url,
                          });
                      o.fire("__networkBack", {
                        url: t._url,
                        useTime: n,
                        type: "error",
                      });
                    }
                  (t.readyState = t._xhr.readyState),
                    (t.status = t._xhr.status),
                    t.onreadystatechange && t.onreadystatechange(e);
                }),
                (this._xhr.onload = function (e) {
                  t.onload && t.onload(e);
                }),
                (this._xhr.ontimeout = function (e) {
                  t.ontimeout && t.ontimeout(e);
                }),
                (this._xhr.onabort = function (e) {
                  t.onabrot && t.onabort(e);
                }),
                (this._xhr.onloadend = function (e) {
                  t.onloadend && t.onloadend(e);
                }),
                (this._xhr.onerror = function (e) {
                  t.onerror && t.onerror(e);
                }),
                (this._xhr.onloadstart = function (e) {
                  t.onloadstart && t.onloadstart(e);
                }),
                (this._xhr.onprogress = function (e) {
                  t.onprogress && t.onprogress(e);
                }),
                this._xhr.send(e);
            }),
            (XMLHttpRequest.prototype.setRequestHeader = function (e, t) {
              this._xhr.setRequestHeader(e, t);
            }),
            (XMLHttpRequest.prototype.getResponseHeader = function (e) {
              return this._xhr.getResponseHeader(e);
            }),
            (XMLHttpRequest.prototype.getAllResponseHeaders = function () {
              return this._xhr.getAllResponseHeaders();
            }),
            (XMLHttpRequest.prototype.abort = function () {
              return (this.aborted = !0), this._xhr.abort();
            }),
            (XMLHttpRequest.prototype.addEventListener = function (e, t, n) {
              return this._xhr.addEventListener(e, t, n);
            }),
            (XMLHttpRequest.prototype.removeEventListener = function (e, t, n) {
              return this._xhr.removeEventListener(e, t, n);
            }),
            (XMLHttpRequest.prototype.overrideMimeType = function (e) {
              this._xhr.overrideMimeType(e);
            }),
            (XMLHttpRequest.prototype.__zone_symbol__addEventListener =
              XMLHttpRequest.prototype.addEventListener),
            (XMLHttpRequest.prototype.__zone_symbol__removeEventListener =
              XMLHttpRequest.prototype.removeEventListener);
        }
        e.exports = {
          XHR: d,
          getMaxTime: function () {
            return {};
          },
        };
      },
      607: function (e, t, n) {
        n(785);
        var r,
          o = n(782),
          i = "https://mtm.online-cmcc.cn/cmos/profile",
          s = n(658),
          a = n(951),
          p = n(944),
          d = n(374),
          u = s(),
          c = [],
          l = [],
          f = 0,
          h = {},
          w = {
            post: function (e) {
              if (
                p.needSendPerformance &&
                0 !== e.length &&
                !((window.__SKYNET && window.__SKYNET.dev) || f > 3)
              ) {
                var t = JSON.stringify(e),
                  n = new (0, o.XHR)();
                (n.timeout = 5e3),
                  n.addEventListener("error", function () {}),
                  n.open("POST", i),
                  n.send(t),
                  (n.onreadystatechange = function () {
                    4 === n.readyState &&
                      ((n.status >= 200 && n.status < 300) ||
                        304 === n.status ||
                        f++);
                  });
                try {
                  var r = window.leadeon || window.cmcc || {};
                  r.webViewLog &&
                    u.clientVersion.substring(0, 5).replaceAll(/\./g, "") >=
                      925 &&
                    d &&
                    r.webViewLog({ debug: !1, logList: [t] });
                } catch (e) {}
              }
            },
            sendBeacon: function (e) {
              (window.__SKYNET && window.__SKYNET.dev) ||
                (p.needSendPerformance &&
                  navigator.sendBeacon(i, JSON.stringify(e)));
            },
            sendBeaconWithInfo: function (e, t, n, r) {
              (window.__SKYNET && window.__SKYNET.dev) ||
                (p.needSendPerformance &&
                  navigator.sendBeacon(
                    i,
                    JSON.stringify({
                      event: r || "error",
                      sys: u.appName,
                      sysV: u.appVersion,
                      clientV: u.clientVersion,
                      pageName:
                        "whiteScreen" === e
                          ? location.href.split("?")[0]
                          : u.page(),
                      os: u.os,
                      osV: u.OSVersion,
                      browser: u.browser,
                      browserV: u.browserVersion,
                      product: u.product,
                      time: Date.now(),
                      errorName: e,
                      errorType: t,
                      errorLog: n,
                      uuid: a(),
                    })
                  ));
            },
            send: function (e, t) {
              p.needSendPerformance &&
                (t
                  ? w.post(e)
                  : (clearTimeout(r),
                    e.length ? (l = l.concat(e)) : l.push(e),
                    setTimeout(function () {
                      l.length && (w.post(l), (l.length = 0));
                    }, 500)));
            },
            sendWithInfo: function (e, t, n, o) {
              p.needSendPerformance &&
                ((function (e, t) {
                  return !(
                    !e ||
                    "string" != typeof e ||
                    ((n = "network" === t ? e : e.substring(0, 100)),
                    h[n] ? (h[n] += 1) : (h[n] = 1),
                    h[n] < 3)
                  );
                  var n;
                })(n, t) ||
                  (clearTimeout(r),
                  c.push({
                    event: o || "error",
                    sys: u.appName,
                    sysV: u.appVersion,
                    clientV: u.clientVersion,
                    pageName:
                      "whiteScreen" === e
                        ? location.href.split("?")[0]
                        : u.page(),
                    os: u.os,
                    osV: u.OSVersion,
                    browser: u.browser,
                    browserV: u.browserVersion,
                    product: u.product,
                    time: Date.now(),
                    errorName: e,
                    errorType: t,
                    errorLog: n,
                    uuid: a(),
                  }),
                  setTimeout(function () {
                    c.length && (w.post(c), (c.length = 0));
                  }, 500)));
            },
          };
        e.exports = w;
      },
      857: function (e) {
        var t = { browser: "", bv: "", os: "", ov: "", product: "" },
          n = { MicroMessenger: "WeChat" };
        e.exports = function (e) {
          try {
            var r;
            return e.match(/\([^\)]*\)/g)
              ? (function (e) {
                  var t,
                    r,
                    o = e.match(/\([^\)]*\)/g),
                    i = o[0];
                  i = i.split(" ");
                  var s,
                    a,
                    p,
                    d,
                    u = [];
                  if (-1 !== e.indexOf("iPhone")) {
                    (r = e.split(o[1])[1]),
                      (t = e.split(o[1])[1].split(/\s+/g)),
                      -1 !== e.indexOf("wkwebview")
                        ? (u = ["wkwebview", ""])
                        : -1 !== e.indexOf("MicroMessenger")
                        ? (u = t[2].split("(")[0].split("/"))
                        : -1 !== e.indexOf("AlipayClient")
                        ? (u = [
                            "AlipayClient",
                            r.split("AlipayClient/")[1].split(" ")[0],
                          ])
                        : -1 !== e.indexOf("shydhn") ||
                          -1 !== e.indexOf("GDMobile") ||
                          -1 !== e.indexOf("ynmobileapp_ios") ||
                          -1 !== e.indexOf("sjyyt") ||
                          -1 !== e.indexOf("ImgoTV")
                        ? 1 === (u = t[t.length - 1].split("/")).length &&
                          (u = t[t.length - 2].split("/"))
                        : (u =
                            -1 !== e.indexOf("anhuiAPP")
                              ? [
                                  t[2].split("=")[1],
                                  t[t.length - 2].split("=")[1],
                                ]
                              : -1 !== e.indexOf("10086APP")
                              ? ["10086APP", ""]
                              : -1 !== e.indexOf("woxin_IOS")
                              ? ["woxin", ""]
                              : -1 !== e.indexOf("UCBrowser") ||
                                -1 !== e.indexOf("QQTheme") ||
                                -1 !== e.indexOf("toon")
                              ? t[2].split("/")
                              : -1 !== e.indexOf("Quark")
                              ? ["Quark", e.split("Quark/")[1].split(" ")[0]]
                              : -1 !== e.indexOf("SogouMobileBrowser")
                              ? t[t.length - 1].split("/")
                              : -1 !== e.indexOf("CqmcClient")
                              ? ["CqmcClient", ""]
                              : -1 !== e.indexOf("ysapp_ios")
                              ? ["ysapp", ""]
                              : -1 !== e.indexOf("GxMobileEhallAppMessenger")
                              ? [
                                  "GxMobileEhallAppMessenger",
                                  t[t.length - 1].split("@")[1],
                                ]
                              : -1 !== e.indexOf("Youku")
                              ? ["Youku", t[4].split("/")[1].split("(")[0]]
                              : -1 !== e.indexOf("gmcchh")
                              ? [
                                  "gmcchh",
                                  t[t.length - 2].split("/")[1] ||
                                    t[t.length - 1].split("/")[1],
                                ]
                              : -1 !== e.indexOf("weibo")
                              ? ["weibo", t[t.length - 1].split("__")[2]]
                              : -1 !== e.indexOf("baiduboxapp")
                              ? t[4].split("/")
                              : -1 !== e.indexOf("jsmcc")
                              ? t[t.length - 2].split("/")
                              : -1 !== e.indexOf("scmcc")
                              ? ["scmcc", t[1].split("/")[2]]
                              : -1 !== e.indexOf("iHeYueSX")
                              ? ["iHeYueSX", t[2].split(";")[3]]
                              : -1 !== e.indexOf("Migu")
                              ? [
                                  "Migu",
                                  t[2].split("(")[0].split("/")[2] ||
                                    t[3].split("V")[1],
                                ]
                              : t.length < 3
                              ? (r = e.split(") ")[1].split(" ")[0].split("/"))
                              : e.split(") ")[1].split(" ")[0].split("/")),
                      u[1] || (u = e.split(") ")[1].split(" ")[0].split("/"));
                    for (
                      var c = 0, l = i.length;
                      c < l &&
                      ((p = i[c].replace(/\_/g, ".")), /[a-zA-Z]/.test(p));
                      c++
                    );
                    s = {
                      browser: n[u[0]] || u[0],
                      bv: u[1].split("(")[0],
                      os: "iOS",
                      ov: p,
                      product: i[0].replace("(", "").replace(";", ""),
                    };
                  } else
                    (u =
                      -1 !== e.indexOf("MicroMessenger")
                        ? [
                            "MicroMessenger",
                            e
                              .split("MicroMessenger/")[1]
                              .split("(")[0]
                              .split(" ")[0],
                          ]
                        : -1 !== e.indexOf("MQQBrowser")
                        ? [
                            "MQQBrowser",
                            e.split("MQQBrowser/")[1].split(" ")[0],
                          ]
                        : -1 !== e.indexOf("AlipayClient")
                        ? [
                            "AlipayClient",
                            e.split("AlipayClient/")[1].split(" ")[0],
                          ]
                        : -1 !== e.indexOf("10086APP")
                        ? ["10086APP", ""]
                        : -1 !== e.indexOf("HuaweiBrowser")
                        ? [
                            "HuaweiBrowser",
                            e.split("HuaweiBrowser/")[1].split(" ")[0],
                          ]
                        : -1 !== e.indexOf("UCBrowser")
                        ? ["UCBrowser", e.split("UCBrowser/")[1].split(" ")[0]]
                        : -1 !== e.indexOf("Quark")
                        ? ["Quark", e.split("Quark/")[1].split(" ")[0]]
                        : -1 !== e.indexOf("GDMobile")
                        ? ["GDMobile", e.split("GDMobile/")[1].split(" ")[0]]
                        : -1 !== e.indexOf("MiuiBrowser")
                        ? [
                            "MiuiBrowser",
                            e.split("MiuiBrowser/")[1].split(" ")[0],
                          ]
                        : -1 !== e.indexOf("Youku")
                        ? ["Youku", e.split("Youku/")[1].split(" ")[0]]
                        : -1 !== e.indexOf("Firefox")
                        ? [
                            "Firefox",
                            e.split("Firefox/")[1].split(" ")[0].split("_")[0],
                          ]
                        : -1 !== e.indexOf("HeyTapBrowser")
                        ? [
                            "HeyTapBrowser",
                            e.split("HeyTapBrowser/")[1].split(" ")[0],
                          ]
                        : -1 !== e.indexOf("NokiaBrowser")
                        ? [
                            "NokiaBrowser",
                            e.split("NokiaBrowser/")[1].split(" ")[0],
                          ]
                        : -1 !== e.indexOf("Chrome")
                        ? ["Chrome", e.split("Chrome/")[1].split(" ")[0]]
                        : e.split(") ")[1].split(" ")[0].split("/")),
                      -1 !== e.indexOf("Flyme")
                        ? ((a = e.split("Meizu-")[1].split("/")[0]),
                          (s = {
                            browser: "AppleWebKit",
                            bv: e
                              .split("AppleWebKit")[1]
                              .split("(")[0]
                              .split(" ")[0],
                            os: "Flyme",
                            ov: e.split("Flyme")[1],
                            product: a,
                          }))
                        : -1 !== i[0].indexOf("inux")
                        ? ("ZTE" ===
                            (a =
                              i.length < 4
                                ? ""
                                : "HUAWEI" !== (i[3] || "").replace(";", "")
                                ? i[3].replace(";", "")
                                : (i[4] || "").replace(";", "")) ||
                          "HarmonyOS" === a
                            ? (a = i[4])
                            : "Redmi" === a ||
                              "Le" === a ||
                              "HM" === a ||
                              "OPPO" === a ||
                              "vivo" === a
                            ? (a = i[3] + " " + i[4])
                            : -1 !== e.indexOf("GIONEE") &&
                              ((a =
                                -1 === e.indexOf("GIONEE-")
                                  ? i[3] +
                                    " " +
                                    (-1 !== i[4].indexOf("/") ? "" : i[4])
                                  : e.split("GIONEE-")[1].split("/")[0]),
                              (u = [
                                "AppleWebKit",
                                e
                                  .split("AppleWebKit")[1]
                                  .split("(")[0]
                                  .split(" ")[0]
                                  .replace("/", ""),
                              ])),
                          (d = i[1]),
                          (p = (i[2] || "").replace(")", "")),
                          -1 !== e.indexOf("HarmonyOS")
                            ? ((d = "HarmonyOS"), (p = ""))
                            : "U;" === d &&
                              ((d = i[2]), (p = (i[3] || "").replace(";", ""))),
                          a === p &&
                            (("Redmi" !== (a = i[5]) &&
                              "Le" !== a &&
                              "HM" !== a &&
                              "OPPO" !== a &&
                              "vivo" !== a) ||
                              (a = i[5] + " " + i[6])),
                          "8848" === a && (a = i[5] + " " + i[6]),
                          /[^\d]/.test(a) || (a = ""),
                          a && (a = a.replace(")", "")),
                          p && (p = p.replace(")", "")),
                          a &&
                            -1 !== a.indexOf("Build/") &&
                            (a = -1 !== a.indexOf("-") ? a.split("/")[1] : ""),
                          (s = {
                            browser: n[u[0]] || u[0],
                            bv: u[1],
                            os: d,
                            ov: p,
                            product: a,
                          }))
                        : -1 !== i[0].indexOf("iPad")
                        ? ((p = (
                            (p = "OS" === i[3] ? i[4] : i[3]) || ""
                          ).replace("_", ".")),
                          (s = {
                            browser: n[u[0]] || u[0],
                            bv: u[1],
                            os: "Mac OS",
                            ov: p,
                            product: "iPad",
                          }))
                        : -1 !== i[0].indexOf("Macintosh")
                        ? (s = {
                            browser: n[u[0]] || u[0],
                            bv: u[1],
                            os: "Mac OS",
                            ov: (i[5] || "").replace("_", ".").replace(")", ""),
                            product: "Macintosh",
                          })
                        : -1 !== i[0].indexOf("X11")
                        ? (s = {
                            browser: n[u[0]] || u[0],
                            bv: u[1],
                            os: "Linux X11",
                            ov: "Linux X11",
                            product: "Linux X11",
                          })
                        : -1 !== i[0].indexOf("Windows")
                        ? (s = {
                            browser: n[u[0]] || u[0],
                            bv: u[1],
                            os: "Windows",
                            ov: {
                              5: "Windows XP",
                              6: "windows 7",
                              10: "Windows 10",
                            }[parseInt(i[2] || "") || parseInt(i[4] || "")],
                            product: "Windows",
                          })
                        : -1 !== i[0].indexOf("Android")
                        ? (s = {
                            browser: n[u[0]] || u[0],
                            bv: u[1],
                            os: "Android",
                            ov: i[1].replace(";", ""),
                            product: "",
                          })
                        : -1 !== i[0].indexOf("Symbian") &&
                          (s = {
                            browser: n[u[0]] || u[0],
                            bv: u[1],
                            os: "Symbian",
                            ov: (i[0].split("/")[1] || "").replace(";", ""),
                            product: i[2].split("/")[0],
                          });
                  return (
                    s ||
                      (s = {
                        browser: "",
                        bv: "",
                        os: "",
                        ov: "",
                        product: "",
                      }),
                    (s.product = s.product || ""),
                    s
                  );
                })(e)
              : "Hisense" === (r = e.split(" "))[0]
              ? ((i = (o = r)[2].split("/")),
                (s = o[1].split("/")[0]),
                {
                  browser: (a = o[4].split("/"))[1],
                  bv: a[2],
                  os: i[0],
                  ov: i[1],
                  product: s,
                })
              : -1 !== r[0].indexOf("Xiao")
              ? (function (e) {
                  var t, n, r;
                  return (
                    1 === e.length
                      ? ((t = ["", ""]), (n = "xiaomi"), (r = e[0].split("/")))
                      : 8 === e.length
                      ? ((t = ["Android", e[1].split("/").pop()]),
                        (n = e[0].split("/")[0]),
                        (r = e.pop().split("/")))
                      : ((t = e[2].split("/")),
                        (n = e[0].split("/")[0]),
                        (r = e.pop().split("/"))),
                    { browser: r[1], bv: r[2], os: t[0], ov: t[1], product: n }
                  );
                })(r)
              : -1 !== r[0].indexOf("Xingcheweishi")
              ? {
                  browser: "",
                  bv: "",
                  os: "Xingcheweishi",
                  ov: r[0].split("/")[1],
                  product: "",
                }
              : -1 !== r[0].indexOf("MTK")
              ? (function (e) {
                  var t = e[2].split("/"),
                    n = e[0].split("/")[0],
                    r = e[5].split("/");
                  return {
                    browser: r[0],
                    bv: r[1],
                    os: t[0],
                    ov: t[1],
                    product: n,
                  };
                })(r)
              : t;
          } catch (e) {
            return t;
          }
          var o, i, s, a;
        };
      },
      181: function (e, t, n) {
        var r = n(607),
          o = n(493),
          i = n(944),
          s = 1e3 * o.maxResource,
          a = {};
        function p() {
          var e = [];
          try {
            e = window.performance.getEntriesByType("resource");
          } catch (e) {}
          for (var t = [], n = 0, o = e.length; n < o; n++)
            "xmlhttprequest" !== e[n].initiatorType &&
              "fetch" !== e[n].initiatorType &&
              "" !== e[n].nextHopProtocol &&
              e[n].duration > s &&
              !a[e[n].name] &&
              -1 === (e[n].name || "").indexOf("dcs.gif") &&
              -1 === (e[n].name || "").indexOf("sa.gif") &&
              ((a[e[n].name] = !0),
              t.push(e[n].name + " - " + (e[n].duration >> 0)));
          t.length &&
            i.needSendPerformance &&
            i.needSendError &&
            r.sendWithInfo("resourse", "slow", { msg: t }),
            setTimeout(p, 5e3);
        }
        var d = !1;
        e.exports = {
          init: function () {
            d || ((d = !0), p());
          },
        };
      },
      493: function (e) {
        e.exports = { maxXHR: 3, maxJsRun: 0.5, maxResource: 2 };
      },
      658: function (e, t, n) {
        var r = n(857);
        function o() {
          return (
            document.title,
            (window.__SKYNET.formatUrl
              ? "" + window.__SKYNET.formatUrl(location.href)
              : window.__SKYNET.usePathKey
              ? ("" + location.pathname).replace(/\/$/, "")
              : "" +
                location.href
                  .replace(/\:/g, "")
                  .replace(/yx=[^&]*&*|touch_id=[^&]*&*|ys=[^&]*&*/g, "")
            ).substring(0, 200)
          );
        }
        (window.__SKYNET = window.__SKYNET || {}),
          (window.__SKYNET.__versions = "1.3.6");
        var i = r(navigator.userAgent),
          s = (/leadeon\/([^\/]+)/.exec(navigator.userAgent) || ["", "0"])[1];
        e.exports = function (e) {
          return {
            browser: ("0" === s ? "" : "webview-") + (i.browser || ""),
            browserVersion: i.bv || "0",
            product: i.product || "0",
            os: i.os || "0",
            OSVersion: i.ov || "0",
            appName: window.__SKYNET.appName || "unknown",
            appVersion: window.__SKYNET.appVersion || "0",
            clientVersion: s,
            page: o,
          };
        };
      },
      951: function (e) {
        var t =
          (performance.timing.navigationStart ||
            performance.timing.fetchStart) + "-";
        (t += (function () {
          for (var e = "", t = 4; t--; )
            e +=
              "01234456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
                (63 * Math.random()) >> 0
              ];
          return e;
        })()),
          (e.exports = function () {
            return window.__SKYNET.getUID
              ? window.__SKYNET.getUID() + "-" + t
              : t;
          });
      },
      140: function (e, t, n) {
        var r = n(947),
          o = r.bindBrowserEvent,
          i = n(607),
          s = n(658),
          a = n(951),
          p = n(944),
          d = s();
        function u(e) {
          var t,
            n,
            o = e.target || e.srcElement,
            s = "",
            p = o.src || o.href,
            u = (
              e.message ||
              (e.reason ? e.reason.message : "") ||
              ""
            ).substring(0, 200);
          o === window
            ? (window.__SKYNET.errorFilter && window.__SKYNET.errorFilter(u)
                ? (s = "")
                : "" !== u.replace(/\s+/g, "") &&
                  ((n = "9.2.0"),
                  (s =
                    "0" !== (t = d.clientVersion) &&
                    (t[0] < n[0] || t[2] < n[2] || t[4] < n[4]) &&
                    -1 !== u.indexOf("Script error")
                      ? ""
                      : JSON.stringify({
                          line: e.lineno || 0,
                          column: e.colno || 0,
                          msg: u || "",
                          fileName: e.filename || "",
                          stack: (e.error || e.reason || {}).stack || "",
                          pageName: d.page(),
                        }))),
              s &&
                (r.fire("JsError", s),
                i.send({
                  event: "error",
                  sys: d.appName,
                  sysV: d.appVersion,
                  clientV: d.clientVersion,
                  pageName: d.page(),
                  os: d.os,
                  osV: d.OSVersion,
                  browser: d.browser,
                  browserV: d.browserVersion,
                  product: d.product,
                  errorName: "JsError",
                  errorType: "runtime",
                  errorLog: s,
                  time: Date.now(),
                  uuid: a(),
                })))
            : p &&
              "mini-img-qrcode-show data:image/png;base64," !== p &&
              "mini-img-qrcode data:image/png;base64," !== p &&
              p !== location.href &&
              i.sendWithInfo(
                o.tagName,
                "resource",
                (o.className || "") + " " + p
              );
        }
        e.exports = function () {
          p.needSendPerformance &&
            p.needSendError &&
            (o(window, "error", u, !0), o(window, "unhandledrejection", u, !0));
        };
      },
    },
    t = {};
  function n(r) {
    var o = t[r];
    if (void 0 !== o) return o.exports;
    var i = (t[r] = { exports: {} });
    return e[r](i, i.exports, n), i.exports;
  }
  !(function () {
    var e = n(658),
      t = n(947),
      r = n(607),
      o = n(140),
      i = n(713),
      s = n(181),
      a = n(951),
      p = n(607),
      d = n(944),
      u = t.bindBrowserEvent;
    if (((window.__SKYNET = window.__SKYNET || {}), !window.__SKYNET.init)) {
      var c = function () {
          var t,
            n = new Date().getTime(),
            r =
              (t = window.performance
                ? performance.getEntriesByType("navigation").length
                  ? performance.getEntriesByType("navigation")[0]
                  : performance.timing
                  ? performance.timing
                  : {}
                : {}).unloadEventEnd - t.unloadEventStart,
            o = t.domainLookupStart - t.fetchStart,
            i = t.domainLookupEnd - t.domainLookupStart,
            s = t.responseStart - (t.requestStart || t.fetchStart),
            p = t.responseEnd - t.responseStart,
            d = t.connectEnd - t.connectStart,
            u = t.loadEventEnd - (t.navigationStart || t.fetchStart),
            c = t.domContentLoadedEventEnd - t.responseEnd,
            l = t.domComplete - t.responseEnd,
            f = e();
          return {
            event: "performance",
            sys: f.appName,
            pageName: f.page(),
            sysV: f.appVersion,
            clientV: f.clientVersion,
            time: n,
            fp: 0,
            fsp: 0,
            interactive: 0,
            unload: Math.max(Math.round(r, 0), 0),
            cache: Math.max(Math.round(o, 0), 0),
            tcp: Math.max(Math.round(d || 0), 0),
            dns: Math.max(Math.round(i || 0), 0),
            fb: Math.max(Math.round(s || 0), 0),
            domready: Math.max(Math.round(c || 0), 0),
            fullLoad: Math.max(Math.round(u || 0), 0),
            htmlLoad: Math.max(Math.round(p || 0), 0),
            pageRender: Math.max(Math.round(l || 0), 0),
            os: f.os,
            osV: f.OSVersion,
            browser: f.browser,
            browserV: f.browserVersion,
            product: f.product,
            uuid: a(),
          };
        },
        l = function (e, t) {
          if (!f) {
            f = !0;
            var n = t;
            n || (n = i());
            var o = c();
            (o.fp = Math.round(n.fp)),
              (o.interactive = Math.round(n.tti)),
              (o.fsp = Math.round(n.fsp)),
              "unload" === e
                ? ((o.sendType = "unload"), r.sendBeacon(o))
                : r.send(o);
          }
        };
      o();
      var f = !1;
      t.on("profilekeys", function (e) {
        var t = c(),
          n = null;
        t.fullLoad > 0
          ? (s.init(),
            (t.fp = Math.round(e.fp)),
            (t.interactive = Math.round(e.tti)),
            (t.fsp = Math.round(e.fsp)),
            (f = !0),
            r.send(t, !0))
          : (e.fp < e.fsp && (n = e),
            u(window, "load", function () {
              setTimeout(function () {
                l("load", n);
              }, 100);
            }));
      }),
        u(window, "beforeunload", function () {
          d.needSendPerformance && l("unload");
        }),
        (window.__SKYNET.send = function (e, t) {
          "string" != typeof e && (e = JSON.stringify(e)),
            p.sendWithInfo("custom", t || "user", e);
        }),
        (window.__SKYNET.init = !0);
    }
  })();
})();
