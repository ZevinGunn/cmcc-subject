!(function () {
  function o(e) {
    var t = r[e];
    return void 0 !== t
      ? t.exports
      : ((t = r[e] = { exports: {} }),
        n[e].call(t.exports, t, t.exports, o),
        t.exports);
  }
  var n = {
      9859: function (e, t, n) {
        function a() {
          function e(e) {
            (e = r(e)),
              c.status
                ? "false" != e.attr("clickhide")
                  ? e.addClass("ariaHide")
                  : e.attr("closeText") && e.html(e.attr("closeText"))
                : (e.removeClass("ariaHide"),
                  e.attr("openText") && e.html(e.attr("openText")));
          }
          e(".cnwza"), e("#cnwza"), e("#cniil_wza");
        }
        var r = n(1439),
          o = n(954),
          i = n(2713),
          c = n(8962),
          s = n(57),
          g = n(2264),
          l = n(755);
        n(5602);
        var u = n(2087),
          d = n(9564),
          f = n(9228),
          h = n(1337),
          b = n(1855);
        n(5045);
        var p = n(3385),
          m = n(6057),
          v = n(5553),
          y = {};
        if (
          ((y.status = function () {
            return c.status;
          }),
          (y.support = l.check()),
          (y.browserSupport = {
            error: function () {
              r(".cnwza").addClass("ariaHide"),
                r("#cnwza").addClass("ariaHide"),
                r("#cniil_wza").addClass("ariaHide"),
                alert("您浏览器版本太低，请升级您的浏览器");
            },
            success: function () {},
          }),
          (window.globalActiveElem = document.body),
          (window.globalActiveDialogElem = null),
          o.checkJs(),
          (y.end = function () {
            (c.status = !1),
              (c.tellerMode = !1),
              f.isMobile()
                ? (v.stop(), u.end(), b.end(), (c.status = !1))
                : (v.stop(), i.end(), p.end()),
              a();
          }),
          (y.startFrame = function (e) {
            i.start(e);
          }),
          (y.start = function (e) {
            y.support
              ? ((c.appid = "e4634471b17a7f059a81d47613d67632"),
                o.init().then(function () {
                  f.isMobile()
                    ? (u.start(), b.start(), (c.status = !0), a())
                    : (function () {
                        try {
                          i.start(),
                            p.start(),
                            (c.status = !0),
                            a(),
                            y.browserSupport &&
                              y.browserSupport.error &&
                              "function" == typeof y.browserSupport.success &&
                              y.browserSupport.success();
                        } catch (e) {}
                      })(),
                    e && "function" == typeof e && e();
                }))
              : y.browserSupport &&
                y.browserSupport.error &&
                "function" == typeof y.browserSupport.error &&
                y.browserSupport.error();
          }),
          f.isMobile() ? h.start() : d.start(y.start, y.end),
          r(document.body).on("click", ".cnwza,#cnwza,#cniil_wza", function () {
            c.status ? y.end() : y.start();
          }),
          "0" == f.queryString.val("aria") && (c.status = !1),
          c.status || "1" == f.queryString.val("aria"))
        )
          try {
            setTimeout(function () {
              y.start();
            }, 100);
          } catch (e) {}
        (y.settings = {
          get voice() {
            return c.voice.enable;
          },
          set voice(e) {
            e || v.stop(), (c.voice.enable = e);
          },
          get voiceRate() {
            return c.voice.rate;
          },
          set voiceRate(e) {
            c.voice.rate = e;
          },
          get scale() {
            return c.scale;
          },
          set scale(e) {
            (c.scale = e), m.setBodyTran();
          },
          get themes() {
            return c.Themes;
          },
          get theme() {
            return c.defaultTheme;
          },
          set theme(e) {
            (c.defaultTheme = e), m.setSettingTheme();
          },
        }),
          s.registerEvent(g.globalStart, y.start, 0),
          s.registerEvent(g.globalEnd, y.end, 0),
          (window.aria = y),
          (e.exports = y);
      },
      1266: function (e, t, n) {
        var r = n(8057),
          o = n(9228),
          n = (n(8962), n(9898));
        e.exports = {
          checkDialogShow: function () {
            var n,
              e = new r(o.arrToSizzle(o.HtmlElemRoles.dialog));
            return (
              o.each(e, function (e, t) {
                return (t = new r(t)), t.isHidden() ? void 0 : (n = t);
              }),
              n
            );
          },
          eventKeyCode: n.eventKeyCode,
          checkKeyCode: n.checkKeyCode,
          keyCodeSettings: n.keyCodeSettings,
        };
      },
      9898: function (e, t, n) {
        function o(e) {
          return (o =
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
                })(e);
        }
        var i = n(9724),
          a = n(1643);
        e.exports = {
          eventKeyCode: function (e) {
            return e.keyCode || e.which || e.charCode;
          },
          checkKeyCode: function (e, t) {
            if (!e || !t) return !1;
            if (
              (void 0 === (t = t.keyCode ? t : { keyCode: t }).status &&
                (t.status = !0),
              t.status && !i.get(a.keys.runtime.status))
            )
              return !1;
            var n = e.keyCode || e.which || e.charCode;
            if (
              n &&
              !(
                ("number" == typeof t.keyCode && t.keyCode != n) ||
                ("object" == o(t.keyCode) && [].indexOf.call(t.keyCode, n) < 0)
              )
            ) {
              var r = e.ctrlKey,
                n = e.shfitKey,
                e = e.altKey;
              return !(
                (t.ctrlKey && !r) ||
                (t.shfitKey && !n) ||
                (t.altKey && !e)
              );
            }
          },
          keyCodeSettings: {
            wakeup: {
              shiftKey: !1,
              ctrlKey: !0,
              altKey: !1,
              status: !1,
              keyCode: 192,
            },
            wakupConfig: {
              shiftKey: !1,
              ctrlKey: !0,
              altKey: !0,
              status: !0,
              keyCode: 76,
            },
            dialogClose: { shiftKey: !1, ctrlKey: !1, altKey: !1, keyCode: 27 },
            changeRegion: {
              next: {
                shiftKey: !1,
                ctrlKey: !0,
                altKey: !0,
                status: !0,
                keyCode: [34, 40],
              },
              pre: {
                shiftKey: !1,
                ctrlKey: !0,
                altKey: !0,
                status: !0,
                keyCode: [33, 38],
              },
            },
            opVoice: {
              shiftKey: !1,
              ctrlKey: !0,
              altKey: !0,
              status: !0,
              keyCode: 86,
            },
            vocierate: {
              shiftKey: !1,
              ctrlKey: !0,
              altKey: !0,
              status: !0,
              keyCode: 75,
            },
            mouseb: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 77 },
            mouseten: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 78 },
            reset: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 67 },
            readsrc: {
              shiftKey: !1,
              ctrlKey: !0,
              altKey: !0,
              status: !1,
              keyCode: 82,
            },
            bigsrc: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 66 },
            readtype: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 70 },
            exitservice: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 69 },
            changeTheme: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 84 },
            fontTob: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 187 },
            fontTos: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 189 },
            help: { shiftKey: !1, ctrlKey: !0, altKey: !0, keyCode: 191 },
          },
        };
      },
      755: function (e, t, n) {
        var r = n(9228);
        e.exports = {
          check: function () {
            var e = r.browser.getBrowserInfo();
            switch (e.browser) {
              case "IE":
                return 9 < e.version;
              case "firefox":
                return 50 <= e.version;
              case "chrome":
                return 33 <= e.version;
              case "safari":
                return 9 <= e.version;
            }
            return !0;
          },
        };
      },
      7316: function (e, t, n) {
        var r = n(9724),
          o = n(1643).keys,
          n = "/api/services/Accessibility",
          i = {
            data: {
              config: n + "/Configuration/GetAll",
              curconf: n + "/Configuration/GetConf",
              security: n + "/Security/Get",
              ttsurl: n + "/TTS/Create",
            },
            get serviceUrl() {
              var e =
                  location.protocol +
                  "://" +
                  location.host +
                  ":" +
                  location.port,
                t = r.get(o.runtime.serviceUrl);
              return null != t ? t : e;
            },
            set serviceUrl(e) {
              r.set(o.runtime.serviceUrl, e);
            },
            get config() {
              return this.serviceUrl + i.data.config;
            },
            get curconf() {
              return this.serviceUrl + i.data.curconf;
            },
            get security() {
              return this.serviceUrl + i.data.security;
            },
            get ttsurl() {
              return i.data.ttsurl.indexOf("//") < 0
                ? this.serviceUrl + i.data.ttsurl
                : i.data.ttsurl;
            },
          };
        e.exports = {
          keys: o,
          api: i,
          elem: { shortCutIcon: "aria-shortCutIcon" },
          copyright: {
            name: "aria",
            version: "3.0.1",
            description: "无障碍功能脚本",
            author: "Locas",
          },
        };
      },
      1643: function (e) {
        var t = "aria/runtime/settings",
          n = "aria/data/settings",
          r = "aria/runtime",
          o = "aria/data";
        e.exports = {
          keys: {
            road: "aria/road",
            root: "aria",
            runtime: {
              root: r,
              serviceUrl: r + "/serviceUrl",
              security: r + "/security",
              appid: r + "/appid",
              status: r + "/status",
              settings: {
                root: t,
                highlight: {
                  root: t + "/highlight",
                  enable: t + "/highlight/enable",
                  rate: t + "/highlight/rate",
                  mode: t + "/highlight/mode",
                },
                voice: {
                  root: t + "/voice",
                  enable: t + "/voice/enable",
                  maxRate: t + "/voice/maxRate",
                  minRate: t + "/voice/minRate",
                  rate: t + "/voice/rate",
                },
                curregion: { id: t + "/curregion/id" },
                golabSkipScale: t + "/golabSkipScale",
                golabSkipAll: t + "/golabSkipAll",
                golabSkipTheme: t + "/golabSkipTheme",
                golabFocus: t + "/golabFocus",
                golabRegion1: t + "/golabRegion1",
                golabRegion2: t + "/golabRegion2",
                golabRegion3: t + "/golabRegion3",
                golabRegion4: t + "/golabRegion4",
                golabReplaceBg: t + "/golabReplaceBg",
                tellerMode: t + "/tellerMode",
                defaultTheme: t + "/defaultTheme",
                defaultLanguage: t + "/defaultLanguage",
                shortCutIcon: t + "/shortCutIcon",
                scale: t + "/scale",
                css: t + "/css",
                closeShortIcon: t + "/closeShortIcon",
                bodyfont: t + "/bodyfont",
                ariaPointerRead: t + "/ariaPointerRead",
                reticle: t + "/reticle",
                bigpoint: t + "/bigpoint",
                spacing: t + "/spacing",
                padding: t + "/padding",
                leftfixed: t + "/leftfixed",
                topfixed: t + "/fixed",
                readtype: t + "/readtype",
                readsrc: t + "/readsrc",
                maxZoom: t + "/maxZoom",
                minZoom: t + "/minZoom",
                mousemode: t + "/mousemode",
                mouseten: t + "/mouseten",
                py: t + "/py",
                big5: t + "/big5",
                bigsrc: t + "/bigsrc",
                canRead: t + "/canRead",
              },
            },
            data: {
              root: o,
              version: "aria/version",
              languages: o + "/languages",
              themes: o + "/theme",
              golbalElems: o + "/golbalElems",
              roles: o + "/roles",
              conf: { root: o + "/conf", region: o + "/conf/region" },
              settings: {
                root: n,
                enable: t + "/enable",
                highlight: {
                  root: n + "/highlight",
                  enable: n + "/highlight/enable",
                  rate: n + "/highlight/rate",
                  mode: n + "/highlight/mode",
                },
                voice: {
                  root: n + "/voice",
                  enable: n + "/voice/enable",
                  rate: n + "/voice/rate",
                },
                tellerMode: n + "/tellerMode",
                defaultTheme: n + "/defaultTheme",
                defaultLanguage: n + "/defaultLanguage",
                shortCutIcon: n + "/shortCutIcon",
                scale: n + "/scale",
                spacing: n + "/spacing",
                padding: n + "/padding",
              },
            },
          },
        };
      },
      954: function (e, t, n) {
        function i(e) {
          return (i =
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
                })(e);
        }
        var a = n(7316),
          s = n(9632),
          c = n(8962),
          l = n(9228);
        e.exports = {
          init: function (o) {
            return new Promise(function (t) {
              c.conf && 30 < c.conf.lenght && (c.conf = []);
              var r = c.conf || [];
              r && "object" != i(r) && (r = JSON.parse(r)),
                s.getService().then(function () {
                  if (((o = o || {}), !c.appid && !o.appid))
                    throw "请先设置Appid字段，请登录后台查看";
                  if (c.curpageConf) return t(c.conf);
                  var n;
                  o.serviceUrl && (c.serviceUrl = o.serviceUrl),
                    o.appid && (c.appid = o.appid),
                    o.appid || (o.appid = c.appid),
                    o.beforeInit &&
                      "function" == typeof o.beforeInit &&
                      o.beforeInit(),
                    (n = o),
                    new Promise(function (t) {
                      s.checkUpdateToken()
                        ? s
                            .get(a.api.config, { appid: n.appid })
                            .then(function (e) {
                              (c.data = e), c.init(e.settings), t(e);
                            })
                        : t(c.data);
                    }).then(
                      function () {
                        s.get(a.api.curconf).then(function (e) {
                          r.push(
                            null != e
                              ? { name: window.location.href, value: e }
                              : { name: window.location.href, value: {} }
                          ),
                            (c.conf = r),
                            t(e);
                        });
                      },
                      function () {}
                    );
                });
            });
          },
          settings: c,
          checkJs: function () {
            var o = !1;
            return (
              s.checkUpdateToken() && c.clear(),
              l.each(document.scripts, function (e, t) {
                var n = t.src.indexOf("/aria.");
                if (
                  ((n = 0 >= n ? t.src.indexOf("/_aria.") : n) <= 0 &&
                    (n = t.src.indexOf("/assist")),
                  null !== t.src && n > -1)
                ) {
                  var r = l.queryString.val("appid", t.src);
                  return (
                    r && (c.appid = r),
                    (o = !0),
                    (c.road = t.src.substr(0, n + 1)),
                    !1
                  );
                }
              }),
              o
            );
          },
        };
      },
      9632: function (e, t, n) {
        function o(e) {
          return (o =
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
                })(e);
        }
        function u() {
          var e = s.get(l.keys.runtime.security);
          return (
            void 0 === e ||
            null == e ||
            !e ||
            !e.token ||
            !e.timestamp ||
            e.timestamp < new Date().getTime() - 864e5
          );
        }
        function i() {
          return new Promise(function (t) {
            var n = s.get(l.keys.runtime.serviceUrl),
              r = s.get(l.keys.road);
            n
              ? t()
              : a.get(r + "config.json").then(function (e) {
                  (e = "object" != o(e) ? JSON.parse(e) : e).url ||
                    (e.url = location.protocol + "//" + location.host),
                    s.set(l.keys.runtime.serviceUrl, e.url),
                    t();
                });
          });
        }
        function r(r) {
          return new Promise(function (n) {
            (r = r || {}),
              i().then(function () {
                new Promise(function (t, n) {
                  var r,
                    o,
                    e,
                    i = s.get(l.keys.runtime.security);
                  u()
                    ? ((r = new Date().getTime()),
                      (o = s.get(l.keys.runtime.appid)),
                      (e = {
                        data: { timestamp: r, appid: o },
                        headers: [],
                        url: l.api.security,
                        error: function () {},
                      }),
                      a.ajax(e).then(function (e) {
                        void 0 !== e
                          ? ((e = (e = c.isIE() ? JSON.parse(e) : e).result),
                            s.set(l.keys.runtime.security, {
                              timestamp: r,
                              appid: o,
                              token: e.token,
                            }),
                            t({ timestamp: r, token: e.token, appid: o }))
                          : n("未传出参数");
                      }))
                    : t(i);
                }).then(function (e) {
                  (e.referer = encodeURIComponent(document.location.href)),
                    r.data &&
                      "function" == typeof r.data &&
                      ((r.success = r.data), (r.data = {})),
                    (r.data = Object.assign({}, r.data, e)),
                    r.headers || (r.headers = []),
                    r.headers &&
                      "object" === o(r.headers) &&
                      !r.headers["Content-Type"] &&
                      r.headers.push({ "Content-Type": "application/json" }),
                    r.error || (r.error = function () {});
                  var t = r.success;
                  (r.success = null),
                    a.ajax(r).then(
                      function (e) {
                        c.isIE() && (e = JSON.parse(e)),
                          t && "function" == typeof t && t(e.result),
                          n(e.result);
                      },
                      function () {}
                    );
                });
              });
          });
        }
        var a = n(9438),
          s = n(9724),
          c = n(9228),
          l = n(7316);
        e.exports = {
          ajax: r,
          get: function (e, t, n) {
            return r({ url: e, type: "GET", data: t, success: n });
          },
          post: function (e, t, n) {
            return r({ url: e, type: "POST", data: t, success: n });
          },
          checkUpdateToken: u,
          getService: i,
        };
      },
      8962: function (e, t, n) {
        function r(e) {
          return (r =
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
                })(e);
        }
        var o,
          i = n(7316),
          a = n(2392),
          s = n(9724),
          c = n(9228),
          l = i.keys.runtime,
          u = i.keys.data,
          d = {
            hostEnable: {
              get highlight() {
                return d.Theme ? d.Theme.highlight.enable : void 0;
              },
              get mouseover() {
                return d.Theme ? d.Theme.mouseover.enable : void 0;
              },
              get focus() {
                return d.Theme ? d.Theme.focus.enable : void 0;
              },
              get region() {
                return d.Theme ? d.Theme.region.enable : void 0;
              },
              get voice() {
                return s.get(u.settings.voice.enable);
              },
              get shortCutIcon() {
                return s.get(u.settings.shortCutIcon);
              },
              get fontScal() {
                return 0 <= s.get(u.settings.scale);
              },
              get enable() {
                return s.get(u.settings.enable);
              },
            },
            init: function (e) {
              var t = s.get(l.settings.root),
                t = a(!0, e, t);
              s.set(l.settings.root, t);
            },
            clear: function () {
              s.remove(i.keys.data.root);
            },
            reset: function () {
              var e = s.get(i.keys.data.settings.root);
              s.set(l.settings.root, e);
            },
            className: {
              region: "ariaregion",
              highlight: "ariahighlight",
              focus: "ariafocus",
            },
            get golabSkipScale() {
              return s.get(l.settings.golabSkipScale);
            },
            get golabReplaceBg() {
              return s.get(l.settings.golabReplaceBg);
            },
            get golabSkipAll() {
              return s.get(l.settings.golabSkipAll);
            },
            get golabFocus() {
              return s.get(l.settings.golabFocus);
            },
            get golabRegion1() {
              return s.get(l.settings.golabRegion1);
            },
            get golabRegion2() {
              return s.get(l.settings.golabRegion2);
            },
            get golabRegion3() {
              return s.get(l.settings.golabRegion3);
            },
            get golabRegion4() {
              return s.get(l.settings.golabRegion4);
            },
            get golabSkipTheme() {
              return s.get(l.settings.golabSkipTheme);
            },
            get topfixed() {
              return s.get(l.settings.topfixed);
            },
            set topfixed(e) {
              s.set(l.settings.topfixed, e);
            },
            get minZoom() {
              var e = s.get(l.settings.minZoom);
              return (e = 0 == e ? 0.5 : e);
            },
            get maxZoom() {
              var e = s.get(l.settings.maxZoom);
              return (e = 0 == e ? 0.5 : e);
            },
            get py() {
              return s.get(l.settings.py);
            },
            set py(e) {
              s.set(l.settings.py, e);
            },
            get big5() {
              return s.get(l.settings.big5);
            },
            set big5(e) {
              s.set(l.settings.big5, e);
            },
            get canRead() {
              return s.get(l.settings.canRead);
            },
            set canRead(e) {
              s.set(l.settings.canRead, e);
            },
            get readsrc() {
              return s.get(l.settings.readsrc);
            },
            set readsrc(e) {
              s.set(l.settings.readsrc, e);
            },
            get readtype() {
              return s.get(l.settings.readtype);
            },
            set readtype(e) {
              s.set(l.settings.readtype, e);
            },
            get leftfixed() {
              return s.get(l.settings.leftfixed);
            },
            set leftfixed(e) {
              s.set(l.settings.leftfixed, e);
            },
            get bigpoint() {
              return s.get(l.settings.bigpoint);
            },
            set bigpoint(e) {
              s.set(l.settings.bigpoint, e);
            },
            get reticle() {
              return s.get(l.settings.reticle);
            },
            set reticle(e) {
              s.set(l.settings.reticle, e);
            },
            set conf(e) {
              "object" != r(e) && (e = JSON.parse(e)), s.set(u.conf.root, e);
            },
            get golbalElems() {
              return s.get(u.golbalElems);
            },
            get conf() {
              return s.get(u.conf.root);
            },
            get curpageConf() {
              var t = top.location.href,
                e = s.get(u.conf.root);
              return e &&
                0 <
                  (e = (e = "object" != r(e) ? JSON.parse(e) : e).filter(
                    function (e) {
                      return e.name == t;
                    }
                  )).length
                ? e[0]
                : void 0;
            },
            confQuerySelector: function (e) {
              if (e && (n = e.key)) {
                switch (e.type) {
                  case 1:
                    for (
                      var t = n.split(" "),
                        n = "#" === t[0].substr(0, 1) ? t[0] : "#" + t[0],
                        r = 1;
                      r < t.length;
                      r++
                    )
                      0 < (i = t[r]).length &&
                        ((n += ":is("),
                        (n += "#" === i.substr(0, 1) ? i : "#" + i),
                        (n += ")"));
                    return n;
                  case 2:
                    var o = n.split(" ");
                    n = "." === o[0].substr(0, 1) ? o[0] : "." + o[0];
                    for (var i, r = 1; r < o.length; r++)
                      0 < (i = o[r]).length &&
                        ((n += ":is("),
                        (n += "." === i.substr(0, 1) ? i : "." + i),
                        (n += ")"));
                    return n;
                }
                return n;
              }
            },
            get shortCutIcon() {
              return s.get(l.settings.shortCutIcon);
            },
            set shortCutIcon(e) {
              s.set(l.settings.shortCutIcon, e);
            },
            get scale() {
              return s.get(l.settings.scale);
            },
            set scale(e) {
              s.set(l.settings.scale, e);
            },
            get road() {
              return s.get(i.keys.road);
            },
            set road(e) {
              s.set(i.keys.road, e);
            },
            get ariaPointerRead() {
              return s.get(l.settings.ariaPointerRead);
            },
            set ariaPointerRead(e) {
              s.set(l.settings.ariaPointerRead, e);
            },
            get bodyfont() {
              var e = s.get(l.settings.bodyfont);
              return (
                e ||
                ((e = parseInt(c.getStyle(document.body)["font-size"], 10)),
                s.set(l.settings.bodyfont, e),
                e)
              );
            },
            get inFrame() {
              return window.self !== top;
            },
            get data() {
              return s.get(i.keys.data.root);
            },
            set data(e) {
              s.set(i.keys.data.root, e);
            },
            get appid() {
              return s.get(l.appid);
            },
            set appid(e) {
              s.set(l.appid, e);
            },
            get serviceUrl() {
              return s.get(l.serviceUrl);
            },
            set serviceUrl(e) {
              s.set(l.serviceUrl, e);
            },
            get root() {
              return s.get(l.root);
            },
            get settingsRoot() {
              return s.get(l.settings.root);
            },
            voice: {
              set enable(e) {
                s.set(i.keys.runtime.settings.voice.enable, e);
              },
              get enable() {
                return s.get(i.keys.runtime.settings.voice.enable);
              },
              get maxRate() {
                var e = s.get(i.keys.runtime.settings.voice.maxRate);
                return (e = 2 > e ? 3 : e);
              },
              get minRate() {
                var e = s.get(i.keys.runtime.settings.voice.minRate);
                return (e = 0.8 >= e ? 0.8 : e);
              },
              get rate() {
                return s.get(i.keys.runtime.settings.voice.rate);
              },
              set rate(e) {
                s.set(i.keys.runtime.settings.voice.rate, e);
              },
            },
            highlight: {
              set enable(e) {
                s.set(l.settings.highlight.enable, e);
              },
              get enable() {
                return s.get(l.settings.highlight.enable);
              },
              get rate() {
                return s.get(l.settings.highlight.rate);
              },
              set rate(e) {
                s.set(l.settings.highlight.rate, e);
              },
              get mode() {
                return s.get(l.settings.highlight.mode);
              },
              set mode(e) {
                s.set(l.settings.highlight.mode, e);
              },
            },
            get padding() {
              return s.get(l.settings.padding);
            },
            set padding(e) {
              s.set(l.settings.padding, e);
            },
            get spacing() {
              return s.get(l.settings.spacing);
            },
            set spacing(e) {
              s.set(l.settings.spacing, e);
            },
            get tellerMode() {
              return s.get(l.settings.tellerMode);
            },
            set tellerMode(e) {
              s.set(l.settings.tellerMode, e);
            },
            get status() {
              return s.get(l.status);
            },
            set status(e) {
              s.set(l.status, e);
            },
            get mousemode() {
              return s.get(l.settings.mousemode);
            },
            set mousemode(e) {
              s.set(l.settings.mousemode, e);
            },
            get mouseten() {
              return s.get(l.settings.mouseten);
            },
            set mouseten(e) {
              s.set(l.settings.mouseten, e);
            },
            get bigsrc() {
              return s.get(l.settings.bigsrc);
            },
            set bigsrc(e) {
              s.set(l.settings.bigsrc, e);
            },
            get defaultTheme() {
              return s.get(l.settings.defaultTheme);
            },
            set defaultTheme(t) {
              var e;
              s.set(l.settings.defaultTheme, t),
                t
                  ? 0 <
                      (e = (e =
                        "object" != r((e = s.get(i.keys.data.themes)))
                          ? JSON.parse(e)
                          : e).filter(function (e) {
                        return e.name == t;
                      })).length && (o = e[0].value)
                  : (o = null);
            },
            get Theme() {
              if (o) return o;
              var t = s.get(l.settings.defaultTheme);
              if (t) {
                var e = s.get(i.keys.data.themes),
                  e = (e = "object" != r(e) ? JSON.parse(e) : e).filter(
                    function (e) {
                      return e.name == t;
                    }
                  );
                return (o = 0 < e.length ? e[0].value : o);
              }
              o = null;
            },
            get Themes() {
              var e = s.get(i.keys.data.themes);
              return void 0 === e ? [] : "object" != r(e) ? JSON.parse(e) : e;
            },
            get defaultLanguage() {
              return s.get(l.settings.defaultLanguage);
            },
            set defaultLanguage(e) {
              s.set(l.settings.defaultLanguage, e);
            },
            get Language() {
              var e = this.defaultLanguage;
              return e ? s.get(i.keys.data.languages)[e] : void 0;
            },
            get Languages() {
              return s.get(i.keys.data.languages);
            },
            getText: function (e) {
              var t = this.Language;
              return t ? t[e] : void 0;
            },
            set closeShortIcon(e) {
              s.set(l.settings.closeShortIcon, e);
            },
            get closeShortIcon() {
              return s.get(l.settings.closeShortIcon);
            },
          };
        e.exports = d;
      },
      2264: function (e) {
        e.exports = {
          globalListen: "globalListen",
          voicePlay: "voicePlay",
          click: "click",
          focusIn: "focusIn",
          blur: "blur",
          globalStart: "globalStart",
          globalEnd: "globalEnd",
          startService: "startService",
          endService: "endService",
          SizzleKeyDown: "SizzleKeyDown",
          TouchWakeup: "TouchWakeup",
        };
      },
      57: function (e, t, n) {
        function r(e) {
          return (r =
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
                })(e);
        }
        var i = n(9228),
          n = n(2264),
          a = [];
        e.exports = {
          registerEvent: function (e, t, n) {
            "object" == r(e) && a.push(e),
              a.push({ name: e, event: t, priority: n });
          },
          execEvent: function (t, n) {
            if (t) {
              for (var r = !1, o = 0; 10 > o; o++) {
                var e = a.filter(function (e) {
                  return e.name == t && e.priority == o;
                });
                i.each(e, function (e, t) {
                  t &&
                    t.event &&
                    "function" == typeof t.event &&
                    (r =
                      "array" == i.type(n)
                        ? r || t.event.apply(this, n)
                        : r || t.event.call(this, n));
                });
              }
              return r;
            }
          },
          eventNames: n,
        };
      },
      2133: function (e, t, n) {
        function i(e) {
          if (void 0 !== e) {
            (l = l || a.Language), (u = "");
            var t = f.checkDialogShow(),
              n = [],
              r = new d(document.activeElement);
            t &&
              0 < t.length &&
              !r.aria.dialog &&
              (document.activeElement.blur(),
              (t.aria.tabindex = 0),
              t.focus(),
              (u = t.aria.lastText));
            var o,
              i = !1;
            for (o in e) {
              var g,
                s = o.type,
                h = o.target;
              switch (s) {
                case "childList":
                  i = !0;
                  break;
                case "attributes":
                  -1 < [].indexOf.call(c, o.attributeName) &&
                    (g = new d(h).attr(o.attributeName)) &&
                    [].indexOf.call(n, h) < 0 &&
                    ((u += l[o.attributeName] + g), n.push(h));
              }
            }
            i && (p.end(), a.status && p.start()), u.length;
          }
        }
        var l,
          r,
          u,
          d = n(8057),
          f = n(1266),
          a = n(8962),
          c = (n(5553), ["aria-message", "aria-error", "aria-success"]),
          p = n(5602),
          o =
            (window.document,
            window.MutationObserver ||
              window.WebKitMutationObserver ||
              window.MozMutationObserver);
        e.exports = {
          start: function (e) {
            !r &&
              o &&
              (r = new o(i)).observe(e.body, {
                childList: !1,
                subtree: !0,
                attributes: !0,
                attributeOldValue: !0,
              });
          },
          end: function () {
            r && r.disconnect();
          },
        };
      },
      7524: function (e, t, n) {
        var r = n(5553),
          o = n(8057);
        e.exports = {
          start: function () {
            var e =
              (e = new o('[name="description"]', document.head).attr(
                "content"
              )) || document.title;
            r.play(e);
          },
        };
      },
      1151: function (e, t, n) {
        function d(e) {
          var t;
          2 != u.readtype &&
            (l.checkDialogShow(),
            (t = e.target),
            "true" == (t = new o(t)).ariaAttr("skipall") ||
              0 < t.closest('[aria-skipall="true"]').length ||
              (t.aria.dialog || (globalActiveElem = t),
              a.focus(e),
              s.focus(e),
              r.setClass(t, e.view.document.body),
              window.playElem != t && i.play(t.aria.lastText),
              (window.playElem = t),
              c.triggerEvent(e.target, "mouseover")));
        }
        var r = n(5045),
          o = n(8057),
          i = n(5553),
          a = n(1820),
          s = n(3565),
          c = n(9228),
          l = n(1266),
          u = n(8962);
        e.exports = {
          start: function (e) {
            (e = e || document), new o(e.body).on("focusin", "*", d);
          },
          end: function (e) {
            (e = e || document), new o(e.body).off("focusin", "*", d);
          },
        };
      },
      1820: function (e, t, n) {
        var r = n(8057);
        e.exports = {
          focus: function (e) {
            var t;
            "menu" != (e = e.target).getAttribute("role") ||
              ((t = new r(e).aria.owns) &&
                setTimeout(function () {
                  (t = new r(t)).show();
                }, 35));
          },
          blur: function () {},
        };
      },
      3565: function (e, t, n) {
        var r = n(8057);
        e.exports = {
          focus: function (e) {
            var t = e.target;
            "select" != t.getAttribute("role") ||
              ((t = (e = new r(t)).aria.owns) &&
                ((t = new r(t)).ariaAttr("ownsfor", "#" + e.attr("id")),
                t.find("li").attr("tabindex", -1),
                t.attr("role", "selectlistbox"),
                (e.ariaAttr("listitem")
                  ? new r(e.ariaAttr("listitem"))
                  : t.find("li")
                ).attr("role", "option"),
                t.show()));
          },
          blur: function () {},
        };
      },
      7629: function (e, t, n) {
        function r(t) {
          var n, r;
          (window.canRead = !0),
            2 != s.readtype &&
              ((n = t.view.document),
              (r = t.keyCode || t.which || t.charCode),
              t.target != n.body &&
                (setTimeout(function () {
                  var e = new o(n.activeElement);
                  "true" == e.ariaAttr("skipall") ||
                    0 < e.closest('[aria-skipall="true"]').length ||
                    (e.aria.hidden &&
                      9 == r &&
                      (t.shiftKey
                        ? e.aria.preFocus && e.aria.preFocus.focus()
                        : e.aria.nextFocus && e.aria.nextFocus.focus()));
                }, 5),
                (window.preAcitveElem = n.activeElement),
                i.execEvent(a.SizzleKeyDown, t),
                13 == r && (new o(t.target).click(), t.preventDefault()),
                27 == r && c.triggerEvent(document.body, "mouseover")));
        }
        var o = n(8057),
          i = n(57),
          a = n(2264),
          s = n(8962);
        n(1712), n(2303), n(7246), n(8093), n(9672), n(5932), n(5779), n(7598);
        var c = n(9228);
        e.exports = {
          start: function (e) {
            (e = e || document), new o(e.body).on("keydown", "*", r);
          },
          end: function (e) {
            (e = e || document), new o(e.body).off("keydown", "*", r);
          },
        };
      },
      1712: function (e, t, n) {
        function s(e) {
          var t = i.eventKeyCode(e),
            n = !0;
          ((n =
            "dialogclose" == new r(e.target).aria.action && 13 == t ? !1 : n) &&
            !i.checkKeyCode(e, i.keyCodeSettings.dialogClose)) ||
            ((t = i.checkDialogShow()) &&
              (0 < t.closest(".aria-container").length
                ? new r(".icon-close").click()
                : 0 <
                  (e = n
                    ? t.find("[aria-action='dialogclose']")
                    : new r(e.target)).length
                ? e.click()
                : (t.css("display", "none"), t.attr("tabindex", -1))));
        }
        var r = n(8057),
          o = n(9228),
          i = n(1266),
          a = n(57),
          n = n(2264);
        a.registerEvent(n.globalListen, s, 0),
          (e.exports = {
            doEventTab: function (e) {
              var t = !1,
                n = i.checkDialogShow();
              return (
                !!n &&
                !!i.checkKeyCode(e, 9) &&
                ((e = new r(e.target || e.currentTarget)).aria.isDialog ||
                  (t = !0),
                (t = e.aria.dialog.firstNode != n.firstNode || t)
                  ? (o.stopBubble(), o.stopDefault(), !0)
                  : void 0)
              );
            },
            KeyEsc: s,
          });
      },
      9564: function (e, t, n) {
        function f(e) {
          return (
            (window.canRead = !0),
            (function (e) {
              return (
                e.keyCode || e.which || e.charCode,
                l.checkKeyCode(e, l.keyCodeSettings.wakeup)
                  ? ((i.status ? o : r)(), 1)
                  : void (
                      d.checkKeyCode(e, d.keyCodeSettings.readsrc) &&
                      (i.status || ((i.voice.enable = !1), r()))
                    )
              );
            })(e)
              ? void 0
              : a.execEvent(s.globalListen, e)
          );
        }
        var r,
          o,
          i = n(8962),
          a = n(57),
          s = n(2264),
          c = n(8057),
          l = n(1266),
          u = n(755),
          d = n(9898);
        e.exports = {
          start: function (e, t) {
            u.check() &&
              ((r = e), (o = t), new c(document.body).on("keydown", f));
          },
        };
      },
      8093: function (e, t, n) {
        function a(e) {
          var t = new r(e.target);
          if ("menu" == t.aria.role) {
            var n = new r(t.aria.owns);
            if (0 != n.length)
              switch (c.eventKeyCode(e)) {
                case 9:
                case 13:
                  n.hide();
                  break;
                case 37:
                case 38:
                  n.isHidden() && n.show(),
                    s.stopDefault(),
                    n.find("[role='menuitem']").last().focus();
                  break;
                case 39:
                case 40:
                  n.isHidden() && n.show(),
                    s.stopDefault(),
                    n.find("[role='menuitem']").first().focus();
              }
          }
        }
        var r = n(8057),
          o = n(57),
          i = n(2264),
          c = n(1266),
          s = n(9228);
        o.registerEvent(i.SizzleKeyDown, a, 0), (e.exports = { doEvent: a });
      },
      9672: function (e, t, n) {
        function i(e) {
          var t = new s(e.target);
          if ("menuitem" == t.aria.role) {
            var n = e.ctrlKey,
              r = e.shfitKey,
              o = e.altKey;
            if (!(n || r || o)) {
              var o = c.eventKeyCode(e),
                i = t.closest("[role='menulistbox']");
              switch (o) {
                case 40:
                  a.stopBubble(e),
                    a.stopDefault(e),
                    (function (e, t) {
                      (t = t.find("[role='menuitem']")),
                        0 != t.length &&
                          ((e = e.index(t)) < t.length - 1
                            ? t[e + 1]
                            : t[0]
                          ).focus();
                    })(t, i);
                  break;
                case 38:
                  a.stopBubble(e),
                    a.stopDefault(e),
                    (function (e, t) {
                      (t = t.find("[role='menuitem']")),
                        (e = e.index(t)),
                        e > 0 && t[e - 1].focus();
                    })(t, i);
                  break;
                case 9:
                case 27:
                  l(i);
              }
            }
          }
        }
        function l(e) {
          0 < e.length &&
            ((e.aria.expanded = !1),
            e.hide(),
            new s(e.ariaAttr("ownsfor")).focus());
        }
        var a = n(9228),
          s = n(8057),
          r = n(57),
          o = n(2264),
          c = n(1266);
        r.registerEvent(o.SizzleKeyDown, i, 0), (e.exports = { doEvent: i });
      },
      7246: function (e, t, n) {
        function i(e) {
          var t,
            n,
            r,
            o = new u(e.target);
          if ("option" == o.aria.role && "option" !== o.aria.nodeName) {
            var i = e.ctrlKey,
              a = e.shfitKey,
              s = e.altKey;
            if (!(i || a || s)) {
              var s = d.eventKeyCode(e),
                c = o.closest("[role='selectlistbox']");
              switch (s) {
                case 40:
                  l.stopBubble(e),
                    l.stopDefault(e),
                    (r = (n = o).parent().child()),
                    (n = n.index(r)) < r.length - 1 && r[n + 1].focus();
                  break;
                case 38:
                  l.stopBubble(e),
                    l.stopDefault(e),
                    (n = (t = o).parent().child()),
                    0 < (t = t.index(n)) && n[t - 1].focus();
                  break;
                case 13:
                  o.firstNode.click();
                  break;
                case 9:
                case 27:
                  0 < (t = c).length && ((t.aria.expanded = !1), t.hide());
              }
            }
          }
        }
        var l = n(9228),
          u = n(8057),
          r = n(57),
          o = n(2264),
          d = n(1266);
        r.registerEvent(o.SizzleKeyDown, i, 0), (e.exports = { doEvent: i });
      },
      5932: function (e, t, n) {
        function a(e) {
          var t;
          i.checkKeyCode(e, i.keyCodeSettings.changeRegion.next) &&
            ((t = new c(e.target, e.view.document.body)),
            0 != (t = new c(t.aria.regionN)).length &&
              (s.setClass(t, e.view.document.body), t.focus()));
        }
        function l(e) {
          var t;
          i.checkKeyCode(e, i.keyCodeSettings.changeRegion.pre) &&
            ((t = new c(e.target, e.view.document.body)),
            0 != (t = new c(t.aria.regionP)).length &&
              (s.setClass(t, e.view.document.body), t.focus()));
        }
        var r = n(57),
          o = n(2264),
          i = n(1266),
          c = n(8057),
          s = n(5045);
        r.registerEvent(o.globalListen, a, 0),
          r.registerEvent(o.globalListen, l, 0),
          (e.exports = { goNext: a, goPre: l });
      },
      2303: function (e, t, n) {
        function a(e) {
          var t = new c(e.target);
          if ("select" == t.aria.role) {
            var n = e.ctrlKey,
              r = e.shfitKey,
              o = e.altKey;
            if (!(n || r || o) && "select" !== t.aria.nodeName && t.aria.owns)
              switch (s.eventKeyCode(e)) {
                case 40:
                case 38:
                  i.stopBubble(),
                    i.stopDefault(),
                    (function (e) {
                      var t,
                        n = e.controls;
                      n && n.firstNode && (t = n.firstNode),
                        (t =
                          t ||
                          new c(e.aria.owns).find("[role='option']").first()),
                        t && t.focus();
                    })(t);
                  break;
                case 9:
                  new c(t.aria.owns).hide();
              }
          }
        }
        var i = n(9228),
          c = n(8057),
          r = n(57),
          o = n(2264),
          s = n(1266);
        r.registerEvent(o.SizzleKeyDown, a, 0), (e.exports = { doEvent: a });
      },
      5779: function (e, t, n) {
        function a(e) {
          var t = new i(e.target);
          if ("tab" == t.aria.role) {
            var n = e.ctrlKey,
              r = e.shfitKey,
              o = e.altKey;
            if (!(n || r || o))
              switch (c.eventKeyCode(e)) {
                case 40:
                case 39:
                  s.stopBubble(e),
                    s.stopDefault(e),
                    (function (e) {
                      e.attr("activeTabindex", 0),
                        (e = e.find("[role='tablistbox']").first()),
                        null != e && e.focus();
                    })(t);
                  break;
                case 38:
                case 37:
                  s.stopBubble(e),
                    s.stopDefault(e),
                    (function (e) {
                      e.attr(
                        "activeTabindex",
                        e.find("[role='tablistbox']").length - 1
                      ),
                        (e = e.find("[role='tablistbox']").last()),
                        null != e && e.focus();
                    })(t);
              }
          }
        }
        var i = n(8057),
          r = n(57),
          o = n(2264),
          c = n(1266),
          s = n(9228);
        r.registerEvent(o.SizzleKeyDown, a, 0), (e.exports = { doEvent: a });
      },
      7598: function (e, t, n) {
        function a(e) {
          var t = new i(e.target);
          if ("tablistbox" == t.aria.role) {
            var n = e.ctrlKey,
              r = e.shfitKey,
              o = e.altKey;
            if (!(n || r || o))
              switch (c.eventKeyCode(e)) {
                case 40:
                case 39:
                  s.stopBubble(e),
                    s.stopDefault(e),
                    (function (e) {
                      var t = e.attr("aria-ownsfor"),
                        n = new i(t),
                        e = n.find("[role='tablistbox']"),
                        t = n.attr("activetabindex");
                      (t = t || 0),
                        t < e.length - 1 &&
                          ((t = parseInt(t) + 1),
                          n.attr("activetabindex", t),
                          e[t].focus(),
                          e[t].click(),
                          s.triggerEvent(e[t], "mouseover"));
                    })(t);
                  break;
                case 38:
                case 37:
                  s.stopBubble(e),
                    s.stopDefault(e),
                    (function (e) {
                      var t = e.attr("aria-ownsfor"),
                        n = new i(t),
                        e = n.find("[role='tablistbox']"),
                        t = n.attr("activetabindex");
                      (t = t || 0),
                        t > 0 &&
                          ((t = parseInt(t) - 1),
                          n.attr("activetabindex", t),
                          e[t].focus(),
                          e[t].click(),
                          s.triggerEvent(e[t], "mouseover"));
                    })(t);
              }
          }
        }
        var i = n(8057),
          r = n(57),
          o = n(2264),
          c = n(1266),
          s = n(9228);
        r.registerEvent(o.SizzleKeyDown, a, 0), (e.exports = { doEvent: a });
      },
      1194: function (e, t, n) {
        function l(e) {
          var t, n;
          (window.canRead = !0),
            2 != c.readtype &&
              e.target != document.body &&
              ((void 0 !== r && e.target == r) ||
                (1 == e.target.nodeType &&
                  ("true" == (t = new o(e.target)).ariaAttr("skipall") ||
                    0 < t.closest('[aria-skipall="true"]').length ||
                    ((n = document.activeElement),
                    t.aria.focusable ||
                      (0 == t.find(n).length &&
                        ((n = t.aria.firstFocus)
                          ? n.focus()
                          : (0 < t.child().length && (t = new o(t.child()[0])),
                            i.setClass(t, e.view.document.body),
                            0 <
                              new o(e.target, e.view.document.body).find("*")
                                .length || a.play(t.aria.lastText)))),
                    (r = e.target)))));
        }
        var r,
          o = n(8057),
          i = n(5045),
          a = n(5553),
          s = n(7623),
          c = n(8962);
        e.exports = {
          start: function (e) {
            (e = e || document),
              new o(e.body).on("click", "*", l),
              new o(e.body).on(
                "click",
                '[aria-action="dialogclose"]',
                s.dialogClose
              );
          },
          end: function (e) {
            (e = e || document),
              new o(e.body).off("click", "*", l),
              new o(e.body).off(
                "click",
                '[aria-action="dialogclose"]',
                s.dialogClose
              );
          },
        };
      },
      7623: function (e, t, n) {
        var r = n(8057),
          o = n(9228);
        e.exports = {
          dialogClose: function () {
            var e = o.arrToSizzle(o.HtmlElemRoles.dialog);
            0 < (e = new r(this).closest(e)).length &&
              ((e.aria.tabindex = -1),
              e.hide(),
              globalActiveElem && globalActiveElem.focus());
          },
        };
      },
      630: function (e, t, n) {
        function l(e) {
          if (
            ((e = (function (e) {
              return (
                e ||
                  (((e = window.event).target = e.srcElement),
                  (e.layerX = e.offsetX),
                  (e.layerY = e.offsetY)),
                (e.mx = e.pageX || e.clientX + document.body.scrollLeft),
                (e.my = e.pageY || e.clientY + document.body.scrollTop),
                e
              );
            })(e)),
            !((a && e == a) || (a && e.target == a.target)))
          ) {
            var t = new r(e.target);
            if (!t.aria.skipall || 0 != t.closest("#ariaToptoolbar").length) {
              if (2 == i.readtype)
                return (
                  s || (o.setContiueObj(t), (s = !0)),
                  setTimeout(function () {
                    c.screenX == e.screenX &&
                      c.screenY == e.screenY &&
                      o.setContiueObj(t);
                  }, 3e3),
                  (c.screenX = e.screenX),
                  void (c.screenY = e.screenY)
                );
              if (((s = !1), "BODY" != e.target.nodeName)) {
                var n = new r(e.target);
                if (
                  ("li" == n.aria.role &&
                    1 == e.target.childNodes.length &&
                    1 == e.target.children.length &&
                    1 == e.target.children[0].nodeType &&
                    (n = new r(e.target.children[0])),
                  window.playElem != n)
                ) {
                  if (
                    5 < Math.abs(c.screenX - e.screenX) ||
                    5 < Math.abs(c.screenY - e.screenY)
                  ) {
                    if (
                      [].indexOf.call(
                        ["td", "li", "dd", "label", "span", "a", "p"],
                        n.aria.role
                      ) < 0 &&
                      3 < n.find("*").length
                    )
                      return;
                    o.play(n.aria.lastText), (window.playElem = n);
                  }
                  (c.screenX = e.screenX), (c.screenY = e.screenY), (a = e);
                }
              } else o.play(document.body.title);
            }
          }
        }
        var a,
          r = n(8057),
          o = n(5553),
          i = n(8962),
          s = !1,
          c = { screenX: 0, screenY: 0 };
        e.exports = {
          start: function (e) {
            (e = e || document),
              new r(e).on("mouseover", "*:not([aria-hidden='true'])", l);
          },
          end: function (e) {
            (e = e || document),
              new r(e).off("mouseover", "*:not([aria-hidden='true'])", l);
          },
        };
      },
      8141: function (e, t, n) {
        function i(e) {
          (e = new r(e.target)), o.play(e.aria.lastText);
        }
        var r = n(8057),
          o = n(5553);
        e.exports = {
          start: function (e) {
            (e = e || document), new r(e).on("change", "*", i);
          },
          end: function (e) {
            (e = e || document), new r(e).off("change", "*", i);
          },
        };
      },
      3827: function (e, t, n) {
        function l(e) {
          var t = window.history[e],
            n = new Event(e);
          return function () {
            var e = t.apply(this, arguments);
            return (n.arguments = arguments), window.dispatchEvent(n), e;
          };
        }
        function a() {
          f ||
            ((f = new Date().getTime() + d),
            setTimeout(function () {
              f && c();
            }, d)),
            f < new Date().getTime() ? (c(), (f = 0)) : 0;
        }
        function c() {
          s.init().then(function () {
            i.start(), h.end(), h.start();
          });
        }
        function p(e, t, n, r, o) {
          for (
            var i = r.getElementsByTagName("iframe"), a = 0;
            a < i.length;
            a++
          ) {
            var s = i[a].contentWindow;
            try {
              s.document.body &&
                (o
                  ? (new g(s.document.body).on(e, t, n),
                    new g(s.document.body).attr("ariaevent", "true"))
                  : (new g(s.document.body).off(e, t, n),
                    new g(s.document.body).removeAttr("ariaevent")),
                p(e, t, n, s.document, o));
            } catch (e) {}
          }
        }
        var r,
          g = n(8057),
          o = n(9228),
          i = n(8458),
          h = n(5602),
          s = n(954);
        if (!o.isIE())
          try {
            (history.pushState = l("pushState")),
              (history.replaceState = l("replaceState"));
          } catch (e) {}
        var u = location.href,
          d = 100,
          f = 0;
        e.exports = {
          start: function () {
            var e;
            o.addEventListener(window, "pushState", c),
              o.addEventListener(window, "replaceState", c),
              new g(document.body).on("DOMNodeInserted", a),
              "onhashchange" in window &&
              (void 0 === document.documentMode || 8 === document.documentMode)
                ? (window.onhashchange = c)
                : (e = setInterval(function () {
                    u == location.href ||
                      ((u = location.href), 0) ||
                      (c(), clearInterval(e), (e = null));
                  }, 150));
          },
          end: function () {
            new g(document.body).off("DOMNodeInserted", a),
              window.removeEventListener("pushState", c),
              window.removeEventListener("replaceState", c),
              "onhashchange" in window &&
                (void 0 === document.documentMode ||
                  8 === document.documentMode) &&
                (window.onhashchange = null),
              clearInterval(r),
              (r = null);
          },
          removelistenIncludeIframe: function (e, t, n) {
            p(e, t, n, document, !1), new g(document.body).off(e, t, n);
          },
          listenIncludeIframe: function (e, t, n) {
            p(e, t, n, document, !0), new g(document.body).on(e, t, n);
          },
        };
      },
      5553: function (e, t, n) {
        function m(e) {
          e &&
            "string" ==
              typeof (e = (e = e.jTool ? e.aria.lastText : e).trim()) &&
            0 != e.length &&
            "," != e &&
            "|" != e.trim() &&
            r != e &&
            ((r = e).length > j
              ? ((w = o.splitBylength(e, j)), (C = []), a(w[0]))
              : v.hostEnable.voice && v.voice.enable
              ? ((w = []), (p = 0), (C = []), a(e))
              : v.bigsrc && g(e));
        }
        function a(e) {
          var t;
          window.playTarget != e &&
            ((window.playTarget = e),
            Date.now() - T < 150 ||
              !window.canRead ||
              (audio && !audio.paused && audio.pause(),
              s.post(y.api.ttsurl, { text: (t = e) }).then(function (e) {
                C.push(v.serviceUrl + e),
                  0 < w.length && c(w[1]),
                  v.bigsrc && g(t),
                  x(v.serviceUrl + e);
              })));
        }
        function c(e) {
          s.post(y.api.ttsurl, { text: e }).then(function (e) {
            C.push(v.serviceUrl + e);
          });
        }
        function x(e) {
          v.status &&
            v.hostEnable.voice &&
            v.voice.enable &&
            ((audio.loop = !1),
            (audio.playbackRate = v.voice.rate || 1),
            (audio.defaultPlaybackRate = v.voice.rate),
            (audio.src = e),
            audio.load(),
            setTimeout(function () {
              try {
                var e = audio.play();
                e &&
                  e
                    .then(function () {
                      setTimeout(function () {}, 1e3 * audio.duration);
                    })
                    .catch(function () {});
              } catch (e) {}
              (T = Date.now()), 0;
            }, 200));
        }
        function g(e) {
          if (
            (v.big5 && (e = f.toBig5(e)), v.py && "undefined" != typeof ariaPY)
          ) {
            new d("#accscreen #acctip").html("");
            for (var t = 0; t < e.length; t++) {
              for (
                var n = ariaPY.parse_word(e[t]),
                  r = '<div class="pinyin">',
                  o = 0;
                o < n.length;
                o++
              )
                !1 !== n[o] &&
                  (r += "<b><i>" + n[o][1] + "</i><i>" + n[o][0] + "</i></b>");
              (r += "</div>"), new d("#accscreen #acctip").append(r);
            }
          } else new d("#accscreen #acctip").html(e);
        }
        function h() {
          audio && !audio.paused && audio.pause();
        }
        function b(e) {
          var t;
          void 0 !== e &&
            0 != (e = e.jTool ? e : new d(e)).length &&
            (e.isHidden()
              ? b(e.nextNode())
              : ((O = e).focus(),
                0 < (t = e.aria.lastText).length && "," != t
                  ? (e.focus(), m(o.formatStrToRead(e.aria.lastText, !0)))
                  : b(e.nextNode())));
        }
        var r,
          o = n(9228),
          i = n(9724),
          v = n(8962),
          s = n(9632),
          y = n(7316),
          l = n(57),
          u = n(2264),
          d = n(8057),
          f = n(4001);
        window.audio = new Audio();
        var w = [],
          j = 48,
          p = 0,
          T = Date.now();
        setInterval(function () {
          window.playTarget = null;
        }, 15e3),
          audio.addEventListener(
            "ended",
            function () {
              h(),
                w.length > p + 1
                  ? (x(C[(p += 1)]),
                    v.bigsrc && g(w[p]),
                    p + 1 < w.length && c(w[p + 1]))
                  : ((w = []),
                    (p = 0),
                    (w = []),
                    2 == v.readtype &&
                      b(
                        0 < O.aria.atomicElem.length
                          ? O.aria.atomicElem.nextNode()
                          : O.nextNode()
                      ));
            },
            !1
          );
        var O,
          C = [];
        o.addEventListener(window, "visibilitychange", function () {
          "hidden" == document.visibilityState &&
            audio &&
            !audio.paused &&
            audio.pause(),
            (v.hostEnable.voice && v.voice.enable) ||
              ("visible" == document.visibilityState && audio.play());
        }),
          l.registerEvent(u.endService, h, 0),
          l.registerEvent(u.globalEnd, h, 0),
          (e.exports = {
            play: m,
            setVoiceid: function (e) {
              var t = o.genID();
              return (e.voiceid = t), i.set("aria/voiceid", t), e;
            },
            pText: r,
            stop: h,
            setContiueObj: b,
          });
      },
      1689: function (e, t, n) {
        function r(e) {
          var t, n, r;
          void 0 !== (e = e || window.event) &&
            e.view == top &&
            ((t = e.clientX),
            (n = e.clientY),
            (t = (r = (function (e) {
              var t = e.view;
              if (t == window || !t.parent)
                return { x: e.clientX, y: e.clientY };
              for (
                var n = t.parent, r = t.location, o = null, i = 0, a = 0;
                null != n && void 0 !== n;

              ) {
                for (var s = 0; s < n.frames.length; s++)
                  if (r == n.frames[s].location) {
                    o = n.frames[s].frameElement;
                    break;
                  }
                for (
                  ;
                  (i += o.offsetLeft - o.scrollLeft || 0),
                    (a += o.offsetTop - o.scrollTop || 0),
                    (o = o.offsetParent);

                );
                (r = n.location), (n = n.parent);
              }
              return { x: i + e.clientX, y: a + e.clientY };
            })(e)).x),
            (n = r.y),
            (e = new o("#ariamouseten1").firstNode),
            (r = new o("#ariamouseten2").firstNode),
            (e.style.left = t - 250 + "px"),
            (e.style.top = n - 5 + "px"),
            (r.style.left = t - 5 + "px"),
            (r.style.top = n - 250 + "px"));
        }
        var o = n(8057);
        n(9228),
          (e.exports = {
            start: function (e) {
              (e = e || document) == document &&
                (function (e) {
                  e = e || window.event;
                  var t = document.createElement("div"),
                    n = document.createElement("div");
                  (t.style.width = "500px"),
                    (t.style.height = "4px"),
                    (t.className = "mouseten"),
                    (t.style.left = e.clientX - 2),
                    t.setAttribute("id", "ariamouseten1"),
                    t.setAttribute("aria-skipall", "true"),
                    document.body.appendChild(t),
                    (n.style.height = "500px"),
                    (n.style.width = "4px"),
                    (n.className = "mouseten"),
                    (n.style.top = e.clientY - 2),
                    n.setAttribute("aria-skipall", "true"),
                    n.setAttribute("id", "ariamouseten2"),
                    document.body.appendChild(n),
                    r(e);
                })(),
                new o(e.body).on("mousemove", "*:not([type='iframe'])", r);
            },
            end: function (e) {
              (e = e || document) == document &&
                (new o("#ariamouseten1").remove(),
                new o("#ariamouseten2").remove()),
                new o(e.body).off("mousemove", "*:not([type='iframe'])", r);
            },
          });
      },
      4001: function (e) {
        e.exports = {
          toBig5: function (e) {
            if (e) {
              for (var t = "", n = 0; n < e.length; n++) {
                var r = e[n],
                  o =
                    "皚藹礙愛翺襖奧壩罷擺敗頒辦絆幫綁鎊謗剝飽寶報鮑輩貝鋇狽備憊繃筆畢斃閉邊編貶變辯辮鼈癟瀕濱賓擯餅撥缽鉑駁蔔補參蠶殘慚慘燦蒼艙倉滄廁側冊測層詫攙摻蟬饞讒纏鏟産闡顫場嘗長償腸廠暢鈔車徹塵陳襯撐稱懲誠騁癡遲馳恥齒熾沖蟲寵疇躊籌綢醜櫥廚鋤雛礎儲觸處傳瘡闖創錘純綽辭詞賜聰蔥囪從叢湊竄錯達帶貸擔單鄲撣膽憚誕彈當擋黨蕩檔搗島禱導盜燈鄧敵滌遞締點墊電澱釣調叠諜疊釘頂錠訂東動棟凍鬥犢獨讀賭鍍鍛斷緞兌隊對噸頓鈍奪鵝額訛惡餓兒爾餌貳發罰閥琺礬釩煩範販飯訪紡飛廢費紛墳奮憤糞豐楓鋒風瘋馮縫諷鳳膚輻撫輔賦複負訃婦縛該鈣蓋幹趕稈贛岡剛鋼綱崗臯鎬擱鴿閣鉻個給龔宮鞏貢鈎溝構購夠蠱顧剮關觀館慣貫廣規矽歸龜閨軌詭櫃貴劊輥滾鍋國過駭韓漢閡鶴賀橫轟鴻紅後壺護滬戶嘩華畫劃話懷壞歡環還緩換喚瘓煥渙黃謊揮輝毀賄穢會燴彙諱誨繪葷渾夥獲貨禍擊機積饑譏雞績緝極輯級擠幾薊劑濟計記際繼紀夾莢頰賈鉀價駕殲監堅箋間艱緘繭檢堿鹼揀撿簡儉減薦檻鑒踐賤見鍵艦劍餞漸濺澗漿蔣槳獎講醬膠澆驕嬌攪鉸矯僥腳餃繳絞轎較稭階節莖驚經頸靜鏡徑痙競淨糾廄舊駒舉據鋸懼劇鵑絹傑潔結誡屆緊錦僅謹進晉燼盡勁荊覺決訣絕鈞軍駿開凱顆殼課墾懇摳庫褲誇塊儈寬礦曠況虧巋窺饋潰擴闊蠟臘萊來賴藍欄攔籃闌蘭瀾讕攬覽懶纜爛濫撈勞澇樂鐳壘類淚籬離裏鯉禮麗厲勵礫曆瀝隸倆聯蓮連鐮憐漣簾斂臉鏈戀煉練糧涼兩輛諒療遼鐐獵臨鄰鱗凜賃齡鈴淩靈嶺領餾劉龍聾嚨籠壟攏隴樓婁摟簍蘆盧顱廬爐擄鹵虜魯賂祿錄陸驢呂鋁侶屢縷慮濾綠巒攣孿灤亂掄輪倫侖淪綸論蘿羅邏鑼籮騾駱絡媽瑪碼螞馬罵嗎買麥賣邁脈瞞饅蠻滿謾貓錨鉚貿麽黴沒鎂門悶們錳夢謎彌覓綿緬廟滅憫閩鳴銘謬謀畝鈉納難撓腦惱鬧餒膩攆撚釀鳥聶齧鑷鎳檸獰甯擰濘鈕紐膿濃農瘧諾歐鷗毆嘔漚盤龐國愛賠噴鵬騙飄頻貧蘋憑評潑頗撲鋪樸譜臍齊騎豈啓氣棄訖牽扡釺鉛遷簽謙錢鉗潛淺譴塹槍嗆牆薔強搶鍬橋喬僑翹竅竊欽親輕氫傾頃請慶瓊窮趨區軀驅齲顴權勸卻鵲讓饒擾繞熱韌認紉榮絨軟銳閏潤灑薩鰓賽傘喪騷掃澀殺紗篩曬閃陝贍繕傷賞燒紹賒攝懾設紳審嬸腎滲聲繩勝聖師獅濕詩屍時蝕實識駛勢釋飾視試壽獸樞輸書贖屬術樹豎數帥雙誰稅順說碩爍絲飼聳慫頌訟誦擻蘇訴肅雖綏歲孫損筍縮瑣鎖獺撻擡攤貪癱灘壇譚談歎湯燙濤縧騰謄銻題體屜條貼鐵廳聽烴銅統頭圖塗團頹蛻脫鴕馱駝橢窪襪彎灣頑萬網韋違圍爲濰維葦偉僞緯謂衛溫聞紋穩問甕撾蝸渦窩嗚鎢烏誣無蕪吳塢霧務誤錫犧襲習銑戲細蝦轄峽俠狹廈鍁鮮纖鹹賢銜閑顯險現獻縣餡羨憲線廂鑲鄉詳響項蕭銷曉嘯蠍協挾攜脅諧寫瀉謝鋅釁興洶鏽繡虛噓須許緒續軒懸選癬絢學勳詢尋馴訓訊遜壓鴉鴨啞亞訝閹煙鹽嚴顔閻豔厭硯彥諺驗鴦楊揚瘍陽癢養樣瑤搖堯遙窯謠藥爺頁業葉醫銥頤遺儀彜蟻藝億憶義詣議誼譯異繹蔭陰銀飲櫻嬰鷹應纓瑩螢營熒蠅穎喲擁傭癰踴詠湧優憂郵鈾猶遊誘輿魚漁娛與嶼語籲禦獄譽預馭鴛淵轅園員圓緣遠願約躍鑰嶽粵悅閱雲鄖勻隕運蘊醞暈韻雜災載攢暫贊贓髒鑿棗竈責擇則澤賊贈紮劄軋鍘閘詐齋債氈盞斬輾嶄棧戰綻張漲帳賬脹趙蟄轍鍺這貞針偵診鎮陣掙睜猙幀鄭證織職執紙摯擲幟質鍾終種腫衆謅軸皺晝驟豬諸誅燭矚囑貯鑄築駐專磚轉賺樁莊裝妝壯狀錐贅墜綴諄濁茲資漬蹤綜總縱鄒詛組鑽緻鐘麼為隻兇準啟闆裡靂餘鍊洩"[
                      "皑蔼碍爱翱袄奥坝罢摆败颁办绊帮绑镑谤剥饱宝报鲍辈贝钡狈备惫绷笔毕毙闭边编贬变辩辫鳖瘪濒滨宾摈饼拨钵铂驳卜补参蚕残惭惨灿苍舱仓沧厕侧册测层诧搀掺蝉馋谗缠铲产阐颤场尝长偿肠厂畅钞车彻尘陈衬撑称惩诚骋痴迟驰耻齿炽冲虫宠畴踌筹绸丑橱厨锄雏础储触处传疮闯创锤纯绰辞词赐聪葱囱从丛凑窜错达带贷担单郸掸胆惮诞弹当挡党荡档捣岛祷导盗灯邓敌涤递缔点垫电淀钓调迭谍叠钉顶锭订东动栋冻斗犊独读赌镀锻断缎兑队对吨顿钝夺鹅额讹恶饿儿尔饵贰发罚阀珐矾钒烦范贩饭访纺飞废费纷坟奋愤粪丰枫锋风疯冯缝讽凤肤辐抚辅赋复负讣妇缚该钙盖干赶秆赣冈刚钢纲岗皋镐搁鸽阁铬个给龚宫巩贡钩沟构购够蛊顾剐关观馆惯贯广规硅归龟闺轨诡柜贵刽辊滚锅国过骇韩汉阂鹤贺横轰鸿红后壶护沪户哗华画划话怀坏欢环还缓换唤痪焕涣黄谎挥辉毁贿秽会烩汇讳诲绘荤浑伙获货祸击机积饥讥鸡绩缉极辑级挤几蓟剂济计记际继纪夹荚颊贾钾价驾歼监坚笺间艰缄茧检碱硷拣捡简俭减荐槛鉴践贱见键舰剑饯渐溅涧浆蒋桨奖讲酱胶浇骄娇搅铰矫侥脚饺缴绞轿较秸阶节茎惊经颈静镜径痉竞净纠厩旧驹举据锯惧剧鹃绢杰洁结诫届紧锦仅谨进晋烬尽劲荆觉决诀绝钧军骏开凯颗壳课垦恳抠库裤夸块侩宽矿旷况亏岿窥馈溃扩阔蜡腊莱来赖蓝栏拦篮阑兰澜谰揽览懒缆烂滥捞劳涝乐镭垒类泪篱离里鲤礼丽厉励砾历沥隶俩联莲连镰怜涟帘敛脸链恋炼练粮凉两辆谅疗辽镣猎临邻鳞凛赁龄铃凌灵岭领馏刘龙聋咙笼垄拢陇楼娄搂篓芦卢颅庐炉掳卤虏鲁赂禄录陆驴吕铝侣屡缕虑滤绿峦挛孪滦乱抡轮伦仑沦纶论萝罗逻锣箩骡骆络妈玛码蚂马骂吗买麦卖迈脉瞒馒蛮满谩猫锚铆贸么霉没镁门闷们锰梦谜弥觅绵缅庙灭悯闽鸣铭谬谋亩钠纳难挠脑恼闹馁腻撵捻酿鸟聂啮镊镍柠狞宁拧泞钮纽脓浓农疟诺欧鸥殴呕沤盘庞国爱赔喷鹏骗飘频贫苹凭评泼颇扑铺朴谱脐齐骑岂启气弃讫牵扦钎铅迁签谦钱钳潜浅谴堑枪呛墙蔷强抢锹桥乔侨翘窍窃钦亲轻氢倾顷请庆琼穷趋区躯驱龋颧权劝却鹊让饶扰绕热韧认纫荣绒软锐闰润洒萨鳃赛伞丧骚扫涩杀纱筛晒闪陕赡缮伤赏烧绍赊摄慑设绅审婶肾渗声绳胜圣师狮湿诗尸时蚀实识驶势释饰视试寿兽枢输书赎属术树竖数帅双谁税顺说硕烁丝饲耸怂颂讼诵擞苏诉肃虽绥岁孙损笋缩琐锁獭挞抬摊贪瘫滩坛谭谈叹汤烫涛绦腾誊锑题体屉条贴铁厅听烃铜统头图涂团颓蜕脱鸵驮驼椭洼袜弯湾顽万网韦违围为潍维苇伟伪纬谓卫温闻纹稳问瓮挝蜗涡窝呜钨乌诬无芜吴坞雾务误锡牺袭习铣戏细虾辖峡侠狭厦锨鲜纤咸贤衔闲显险现献县馅羡宪线厢镶乡详响项萧销晓啸蝎协挟携胁谐写泻谢锌衅兴汹锈绣虚嘘须许绪续轩悬选癣绚学勋询寻驯训讯逊压鸦鸭哑亚讶阉烟盐严颜阎艳厌砚彦谚验鸯杨扬疡阳痒养样瑶摇尧遥窑谣药爷页业叶医铱颐遗仪彝蚁艺亿忆义诣议谊译异绎荫阴银饮樱婴鹰应缨莹萤营荧蝇颖哟拥佣痈踊咏涌优忧邮铀犹游诱舆鱼渔娱与屿语吁御狱誉预驭鸳渊辕园员圆缘远愿约跃钥岳粤悦阅云郧匀陨运蕴酝晕韵杂灾载攒暂赞赃脏凿枣灶责择则泽贼赠扎札轧铡闸诈斋债毡盏斩辗崭栈战绽张涨帐账胀赵蛰辙锗这贞针侦诊镇阵挣睁狰帧郑证织职执纸挚掷帜质钟终种肿众诌轴皱昼骤猪诸诛烛瞩嘱贮铸筑驻专砖转赚桩庄装妆壮状锥赘坠缀谆浊兹资渍踪综总纵邹诅组钻致钟么为只凶准启板里雳余链泄".indexOf(
                        r
                      )
                    ];
                t += void 0 === o ? r : o;
              }
              return t;
            }
          },
        };
      },
      1282: function (e, t, n) {
        var a = n(8057),
          r = n(9228);
        e.exports = {
          start: function (e) {
            (e = new a("A,Form", e)),
              r.each(e, function (e, t) {
                var n = new a(t),
                  r = n.attr("href") || n.attr("action");
                if (r && -1 < r.indexOf("//"))
                  try {
                    r.split("//")[1].split("/")[0] != document.location.host &&
                      r.indexOf("aria=1") < 0 &&
                      ((r = 0 < r.indexOf("?") ? r + "&aria=1" : r + "?aria=1"),
                      "A" == t.nodeName
                        ? n.attr("href", r)
                        : n.attr("action", r));
                  } catch (e) {}
              });
          },
          end: function (e) {
            (e = new a("A,Form", e)),
              r.each(e, function (e, t) {
                var n = new a(t);
                if (
                  (i = n.attr("href") || n.attr("action")) &&
                  -1 < i.indexOf("//")
                )
                  try {
                    var r = i.split("//")[1].split("/")[0],
                      o = document.location.host,
                      i = i.replace("?aria=1", "").replace("&aria=1", "");
                    r != o &&
                      i.indexOf("aria=0") < 0 &&
                      ((i = 0 < i.indexOf("?") ? i + "&aria=0" : i + "?aria=0"),
                      "A" == t.nodeName
                        ? n.attr("href", i)
                        : n.attr("action", i));
                  } catch (e) {}
              });
          },
        };
      },
      5020: function (e, t, n) {
        n(8057), (e.exports = { iframeMouse: function () {} });
      },
      8458: function (e, t, n) {
        function a(e, t) {
          e.aria.tabindex || (e.aria.tabindex = t);
        }
        function r(e, t) {
          var n = e.selector;
          if (n) {
            var r,
              o = new u(n, t.body);
            if (!o.hasClass("setedaria") && 0 < o.length) {
              for (var i in ((o.aria.focusable =
                e.focusable && !o.isHidden() ? 0 : -1),
              e.role && (o.aria.role = e.role),
              e.prop))
                e.prop[i] &&
                  Object.hasOwnProperty.call(e.prop, i) &&
                  ((r = e.prop[i]), o.ariaAttr(i, r));
              e.prop &&
                e.prop.dialogclose &&
                o.find(e.prop.dialogclose).ariaAttr("action", "dialogclose");
            }
          }
        }
        var l = n(9228),
          u = n(8057),
          d = n(8962);
        n(6057),
          (e.exports = {
            start: function (e) {
              var i;
              e ||
                ((e = document),
                (function () {
                  var e = [
                    "ariatoolcss",
                    "ariaToptoolbar",
                    "accscreen",
                    "ariamouseten1",
                    "ariamouseten2",
                  ];
                  if ("true" != document.body.getAttribute("ariaCopy")) {
                    var t = document.createElement("div");
                    (t.id = "ariaContainer"), (t.className = "elemscale");
                    for (
                      var n = document.body.children, r = n.length - 1;
                      r > -1;
                      r--
                    ) {
                      var o = n[r];
                      [].indexOf.call(e, o.id) < 0 &&
                        t.insertBefore(o, t.firstChild);
                    }
                    document.body.insertBefore(t, document.body.firstChild),
                      document.body.setAttribute("ariaCopy", !0);
                  }
                })()),
                (i = e),
                (e = d.curpageConf),
                i.body &&
                  ((function (e) {
                    var t = d.golabSkipAll;
                    t &&
                      ((n = new u(t, e.body)),
                      l.each(n, function (e, t) {
                        new u(t), t.setAttribute("aria-skipall", "true");
                      }));
                    var n = d.golabFocus;
                    n &&
                      ((r = new u(n, e.body)),
                      l.each(r, function (e, t) {
                        t.setAttribute("tabindex", 0);
                      }));
                    var r = d.golabRegion1;
                    r &&
                      ((o = new u(r, e.body)),
                      l.each(o, function (e, t) {
                        (t = new u(t)),
                          t.ariaAttr("region", "true"),
                          t.ariaAttr("regiontype", 1),
                          t.attr("tabindex", 0);
                      }));
                    var o = d.golabRegion2;
                    o &&
                      ((i = new u(o, e.body)),
                      l.each(i, function (e, t) {
                        (t = new u(t)),
                          t.ariaAttr("region", "true"),
                          t.ariaAttr("regiontype", 2),
                          t.attr("tabindex", 0);
                      }));
                    var i = d.golabRegion3;
                    i &&
                      ((a = new u(i, e.body)),
                      l.each(a, function (e, t) {
                        (t = new u(t)),
                          t.ariaAttr("region", "true"),
                          t.ariaAttr("regiontype", 3),
                          t.attr("tabindex", 0);
                      }));
                    var a = d.golabRegion4;
                    a &&
                      ((s = new u(a, e.body)),
                      l.each(s, function (e, t) {
                        (t = new u(t)),
                          t.ariaAttr("region", "true"),
                          t.ariaAttr("regiontype", 4),
                          t.attr("tabindex", 0);
                      }));
                    var s = d.golabSkipTheme;
                    s &&
                      ((c = new u(s, e.body)),
                      l.each(c, function (e, t) {
                        new u(t).ariaAttr("skiptheme", "true");
                      }));
                    var c = d.golabSkipScale;
                    c &&
                      ((e = new u(c, e.body)),
                      l.each(e, function (e, t) {
                        new u(t).ariaAttr("skipscale", "true");
                      }));
                  })(i),
                  (function (n) {
                    var e = d.golbalElems;
                    e &&
                      l.each(e, function (e, t) {
                        r(t, n);
                      });
                  })(i),
                  e && e.name && null != e.value && null != e.value.name
                    ? (function (e, n) {
                        e.value &&
                          e.value.elems &&
                          l.each(e.value.elems, function (e, t) {
                            r(t, n);
                          }),
                          e.value &&
                            e.value.templateElems &&
                            l.each(e.value.templateElems, function (e, t) {
                              r(t, n);
                            });
                      })(e, i)
                    : (function (e) {
                        var t = new u("form,.login_box", e.body);
                        l.each(t, function (e, t) {
                          (t = new u(t)),
                            "true" != t.ariaAttr("region") &&
                              0 == t.closest('[aria-region="true"]').length &&
                              (t.ariaAttr("region", "true"),
                              t.ariaAttr("regiontype", 3),
                              (t.aria.focusable = 1));
                        }),
                          (t = new u(
                            "header,nav,#header,#nav,.header,.nav,.left-nav,.d-subnav",
                            e.body
                          )),
                          l.each(t, function (e, t) {
                            (t = new u(t)),
                              "true" != t.ariaAttr("region") &&
                                0 == t.closest('[aria-region="true"]').length &&
                                (t.ariaAttr("region", "true"),
                                t.ariaAttr("regiontype", 2),
                                (t.aria.focusable = 1));
                          }),
                          (t = new u(
                            ".content,#content,.wrapper,#wrapper,.main-r,.main,#main",
                            e.body
                          )),
                          l.each(t, function (e, t) {
                            (t = new u(t)),
                              "true" != t.ariaAttr("region") &&
                                0 == t.closest('[aria-region="true"]').length &&
                                (t.ariaAttr("region", "true"),
                                t.ariaAttr("regiontype", 1),
                                (t.aria.focusable = 1));
                          }),
                          (e = new u(".footer,#footer,footer", e.body)),
                          l.each(e, function (e, t) {
                            (t = new u(t)),
                              "true" != t.ariaAttr("region") &&
                                0 == t.closest('[aria-region="true"]').length &&
                                (t.ariaAttr("region", "true"),
                                t.ariaAttr("regiontype", 4),
                                (t.aria.focusable = 1));
                          });
                      })(i),
                  (e = new u("[role]:not([setedaria='true'])", i.body)
                    .nodeList),
                  l.each(e, function (e, t) {
                    var n = !1,
                      r = new u(t);
                    if (
                      (r.attr("id") || r.attr("id", l.genID()),
                      t.setAttribute("setedaria", "true"),
                      r.isHidden()
                        ? (a(r, -1), (n = !0))
                        : (!n &&
                            -1 <
                              [].indexOf.call(
                                l.HtmlElemRoles.foucsable0,
                                r.aria.role
                              ) &&
                            (a(r, 0), (n = !0)),
                          !n &&
                            -1 <
                              [].indexOf.call(
                                l.HtmlElemRoles.foucsable1,
                                r.aria.role
                              ) &&
                            (a(r, -1), (n = !0)),
                          !n &&
                            -1 <
                              [].indexOf.call(
                                l.HtmlElemRoles.foucsable0,
                                r.aria.nodeName
                              ) &&
                            (a(r, 0), (n = !0)),
                          !n &&
                            -1 <
                              [].indexOf.call(
                                l.HtmlElemRoles.foucsable1,
                                r.aria.nodeName
                              ) &&
                            (a(r, -1), (n = !0))),
                      (n = r.aria.role),
                      r.aria.owns && n)
                    ) {
                      var o = new u(r.aria.owns, i.body);
                      switch (
                        (o.ariaAttr("ownsfor", "#" + r.attr("id")),
                        o.find("li").attr("tabindex", -1),
                        o.attr("role", n + "listbox"),
                        n)
                      ) {
                        case "menu":
                          (r.ariaAttr("listitem")
                            ? new u(r.ariaAttr("listitem"), i.body)
                            : o.find("li")
                          ).attr("role", "menuitem");
                          break;
                        case "select":
                          (r.ariaAttr("listitem")
                            ? new u(r.ariaAttr("listitem"), i.body)
                            : o.find("li")
                          ).attr("role", "option");
                          break;
                        case "tab":
                          o.attr("tabindex", "-1"),
                            o.find("a").attr("tabindex", "-1");
                      }
                    }
                  }),
                  (e = new u("p:not([setedaria='true'])", i.body)),
                  l.each(e, function (e, t) {
                    var n = new u(t);
                    t.setAttribute("setedaria", "true"),
                      (t = l.reMoveHtml(n.text())),
                      t && 0 < t.length && (n.aria.tabindex = 0);
                  }),
                  (e = new u("[aria-hidden='true']", i.body)),
                  l.each(e, function (e, t) {
                    new u(t).aria.tabindex = -1;
                  }),
                  new u(i.body).addClass("ariatheme"),
                  (e = new u(i.body).find("*:not(.ariatheme):not(svg)")),
                  l.each(e, function (e, t) {
                    try {
                      var n;
                      1 == t.nodeType &&
                        "svg" != t.nodeName.toLowerCase() &&
                        (((n = new u(t)).aria &&
                          (n.aria.skipall || n.aria.skiptheme)) ||
                          n.addClass("ariatheme"));
                    } catch (e) {}
                  }),
                  new u("[aria-region='true']").attr("tabindex", "0"),
                  new u("[role='floatingwindow']").remove(),
                  (function (e) {
                    var t = new u("[aria-atomic='true']", e.body).find("*");
                    l.each(t, function (e, t) {
                      t.setAttribute("tabindex", -1);
                    }),
                      new u(e.body).on(
                        "keydown",
                        "[aria-atomic='true']",
                        function (e) {
                          13 != e.keyCode ||
                            (0 <
                              (e = new u(this).find(
                                "a,[role='a'],[role='button']"
                              )).length &&
                              e.firstNode.click());
                        }
                      );
                  })(i),
                  l.isMobile() &&
                    (function (e) {
                      var t = new u("#ariabodyscale");
                      0 < t.length && t.remove(),
                        new u("#ariabodyscale").remove(),
                        (e = new u("*:not(.setfont)", e.body)),
                        l.each(e, function (e, t) {
                          try {
                            var n = new u(t),
                              r = l.getStyle(t);
                            24 < (r = parseInt(r.fontSize, 10)) && (r = 24),
                              n.addClass("setfont ariafont" + r);
                          } catch (e) {}
                        });
                    })(i));
            },
          });
      },
      6057: function (e, t, n) {
        function r() {
          var e = "",
            t = s.curpageConf;
          t && t.value.pageCss && (e += t.value.pageCss);
          var n = ".ariatheme:not(i):not(input){",
            r = ".ariatheme a{",
            o = s.Theme;
          (e += ".ariaHide{display:none !important;}"),
            o &&
              (s.hostEnable.region &&
                ((e += d(o.region, ".ariaregion")),
                o.region.link &&
                  ((e += ".ariaregion a{ "),
                  (e += " color:" + o.region.link + "!important;"),
                  (e += "}"))),
              o.backgroundColor &&
                (n += "background-color:" + o.backgroundColor + " !important;"),
              o.color && (n += "color:" + o.color + " !important;"),
              o.link && (r += "color:" + o.link + " !important;"),
              (e += "input:disabled{"),
              o.backgroundColor &&
                (e += "background-color:" + o.backgroundColor + " !important;"),
              o.color && (e += "color:" + o.color + " !important;"),
              (e += "}"));
          var i = s.scale,
            t = s.bodyfont;
          return (
            s.hostEnable.fontScal &&
              ((i = parseFloat(i)),
              s.padding,
              s.spacing,
              (e += "input[type='checkbox'],input[type='radio'] {"),
              (e += "min-height:  " + (t = s.bodyfont * i) + "px !important;"),
              (e += "min-width:   " + t + "px !important;"),
              (e += "}")),
            s.golabReplaceBg &&
              s.Theme &&
              s.Theme.backgroundColor &&
              ((e += s.golabReplaceBg + "{"),
              (e += "background-image:none !important;"),
              (e += "}")),
            o &&
              (s.hostEnable.focus &&
                ((e += d(o.focus, ".ariafocus")),
                (t = o.focus.value) &&
                  t.value &&
                  (delete t.value.outline, (e += d(t, ".ariafocus *")))),
              s.hostEnable.mouseover && (e += d(o.mouseover, ".mouseover"))),
            (e = n + "}" + r + "}" + e),
            (r = s.highlight),
            s.hostEnable.highlight &&
              r.enable &&
              (r.rate && r.rate > i && r.rate,
              (e += ".ariahighlight{"),
              o &&
                ((r = o.highlight.backgroundColor),
                (i = o.highlight.color) &&
                  (e += " color: " + i + " !important;"),
                r && (e += "background-color: " + r + " !important;"),
                (e += "}"),
                (o = o.highlight.link) &&
                  ((e += ".ariahighlight a{"),
                  (e += " color: " + o + "  !important;"),
                  (e += "}")))),
            a.set(c.keys.runtime.settings.css, e),
            e
          );
        }
        function l() {
          var e = s.scale,
            t = "";
          if (o.isMobile())
            for (var n = 10; 30 > n; n++)
              (t +=
                ".ariafont" +
                n +
                "{font-size:" +
                parseInt(n * e) +
                "px  !important;}"),
                (t +=
                  ".ariafont" +
                  n +
                  " a {font-size:" +
                  parseInt(n * e) +
                  "px  !important;}");
          else
            (t += ".elemscale{"),
              (t += "zoom:" + e + ";"),
              (t += "-moz-transform: matrix(" + e + ",0,0," + e + ",0,0);"),
              (t += "transform-origin: center top;"),
              (t += "}"),
              (t += ".elemscale>*{"),
              (t += "-moz-transform: none;"),
              (t += "-webkit-transform: none;"),
              (t += "-o-transform: none;"),
              (t += "-ms-transform: none;"),
              (t += "transform: none;"),
              (t += "}");
          new i("#ariabodyscale").remove();
          var r = document.createElement("style");
          r.setAttribute("id", "ariabodyscale"),
            (r.innerHTML = t),
            document.body.appendChild(r);
        }
        function u(e, t) {
          new i("#ariacss", e).remove();
          var n = e.createElement("style");
          n.setAttribute("type", "text/css"),
            n.setAttribute("id", "ariacss"),
            (n.innerHTML = t),
            e.head.appendChild(n);
        }
        function d(e, t) {
          var n = "ariafocus" == t ? ":focus," : "";
          return (
            e &&
              e.enable &&
              ((n += t + "{"),
              o.each(e, function (e, t) {
                "enable" != e &&
                  null != t &&
                  ("outline" == e &&
                    (n += "border-radius: 3px;box-shadow: 0 0 0 2px #01AAed;"),
                  (n += o.toCssCamelCase(e) + ":" + t + " !important;"));
              }),
              (n += "}")),
            n
          );
        }
        var o = n(9228),
          a = n(9724),
          s = n(8962),
          c = n(7316),
          i = n(8057);
        e.exports = {
          start: function (e) {
            e = e || document;
            var t = a.get(c.keys.runtime.settings.css) || r();
            0 == new i("#ariaiconstyle").length &&
              new i(e.head).append(
                '<link rel="stylesheet" id="ariaiconstyle" href="' +
                  s.road +
                  'css/font.min.css"></link>'
              ),
              u(e, t),
              o.isMobile() || e != document || l();
          },
          end: function (e) {
            (e = e || document),
              new i("#ariacss", e.parentNode).remove(),
              new i("#ariaiconstyle", e.parentNode).remove(),
              new i("#ariabodyscale", e.parentNode).remove(),
              new i("#ariacss", e).remove(),
              new i("#ariaiconstyle", e).remove(),
              new i("#ariabodyscale", e).remove();
          },
          setSettingTheme: function (e) {
            u((e = e || document), r()), e == document && l();
          },
          setBodyTran: l,
          addPy: function () {
            var e = document.createElement("script");
            e.setAttribute("id", "ariapy"),
              e.setAttribute("charset", "UTF-8"),
              (e.src = s.road + "html/pinyin.min.js"),
              document.body.appendChild(e);
          },
          setMouseb: function (e) {
            var t = (e = e || document).createElement("style");
            t.setAttribute("title", "ariatoolbarstylemouse");
            var n = "\n * {\n";
            (n += "cursor: url(" + s.road + "imgs/allaw.cur), auto;\n"),
              (t.innerHTML = n += "}\n"),
              e.head.appendChild(t);
          },
          removeMouseb: function (e) {
            (e
              ? new i('[title="ariatoolbarstylemouse"]', e.head)
              : new i('[title="ariatoolbarstylemouse"]')
            ).remove();
          },
        };
      },
      5045: function (e, t, n) {
        function a() {}
        var r = n(8057),
          o = (n(9228), n(8962)),
          i = n(57),
          n = n(2264);
        i.registerEvent(n.startService, a, 0),
          (e.exports = {
            setFontSize: a,
            setClass: function (e, t) {
              var n;
              0 != e.length &&
                ((t = t || document),
                new r(t)
                  .find("." + o.className.focus)
                  .removeClass(o.className.focus),
                e.aria.canSetClass && e.addClass(o.className.focus),
                (n = e.aria.regionElem),
                new r("." + o.className.region, t).removeClass(
                  o.className.region
                ),
                n &&
                  0 < n.length &&
                  e.aria.canSetClass &&
                  n.addClass(o.className.region),
                (n = e),
                0 <
                  (n = n =
                    1 === o.highlight.mode ? new r(n.aria.regionElem) : n)
                    .length &&
                  o.highlight.enable &&
                  (new r(".ariahighlight", t).removeClass("ariahighlight"),
                  e.aria.canSetClass && n.addClass(o.className.highlight)),
                0 < n.length &&
                  o.highlight.enable &&
                  !n.hasClass("ariahighlightScale") &&
                  n.width() * o.highlight.rate + n.firstNode.offsetLeft <=
                    document.body.scrollWidth &&
                  e.aria.canSetClass &&
                  (new r(".ariahighlightScale", t).removeClass(
                    "ariahighlightScale"
                  ),
                  e.aria.canSetClass && n.addClass("ariahighlightScale")));
            },
          });
      },
      3385: function (e, t, n) {
        function a() {
          window.open(l.road + "instructions.html");
        }
        function c(e) {
          var t = l.py;
          e && ((l.py = !t), f.play(t ? "拼音已关闭" : "拼音已启用")),
            (t = l.py) && "undefined" == typeof ariaPY && z.addPy();
        }
        function g() {
          l.big5,
            "繁体" == new s("#accscreen-jt").html()
              ? (new s("#accscreen-jt").html("简体"),
                (l.big5 = !1),
                f.play("简体已启用"))
              : (new s("#accscreen-jt").html("繁体"),
                (l.big5 = !0),
                f.play("繁体已启用"));
        }
        function x() {
          f.stop(),
            D(),
            N(),
            (l.mouseten = null),
            B.endMouseTen(),
            new s("#ariaToptoolbar").remove(),
            new s("#accscreen").remove(),
            new s("#ariatoolcss").remove(),
            r || (clearInterval(r), (r = null)),
            B.end(),
            new s(document.body).off("click", ".ariavoice", _),
            new s(document.body).off("click", ".ariatopfixed", M),
            new s(document.body).off("click", ".ariathemebtn", K),
            new s(document.body).off("click", ".ariazoomb", R),
            new s(document.body).off("click", ".ariazooms", I),
            new s(document.body).off("click", ".ariaVoiceRate", L),
            new s(document.body).off("click", ".ariaReadtype", S),
            new s(document.body).off("click", ".ariareset", y),
            new s(document.body).off("click", ".ariamouseb", A),
            new s(document.body).off("click", ".ariamouseten", E),
            new s(document.body).off("click", ".ariahighlighttool", k),
            new s(document.body).off("click", ".ariaexit", C),
            new s(document.body).off("click", ".ariablackgroud", q),
            new s(document.body).off("click", ".ariabigsrc", P),
            new s(document.body).off("click", "#accscreen-py", c),
            new s(document.body).off("click", "#accscreen-jt", g),
            new s(document.body).off("click", ".ariaReadScreen", v);
        }
        function h(e) {
          new s("#acccont-logo-img").css(
            "background-image",
            "url(" + l.road + "imgs/logo41.png)"
          ),
            new s(".ariazoomb").attr("title", H.airafontScaleTextToBig),
            new s(".ariazooms").attr("title", H.airafontScaleTextToSmall),
            new s(".ariaTopsubzoomb").html(H.ariaTopsubzoomb),
            new s(".ariaTopsubzooms").html(H.ariaTopsubzooms),
            new s(".ariathemebtn").attr(
              "title",
              H.ariathemebtn +
                (l.Theme && l.Theme.displayName ? l.Theme.displayName : "无")
            ),
            new s(".ariaTopsubtheme").html(H.ariaTopsubtheme),
            new s(".ariaReadScreen").attr("title", H.ariaReadScreen),
            new s(".ariaTopsubReadScreen").html(H.ariaTopsubReadScreen),
            new s(".ariaTopsubVoice").html(H.ariaTopsubVoice),
            T(),
            new s(".ariaTopsubVoiceRate").html(H.ariaTopsubVoiceRate),
            O(),
            new s(".ariaTopsubReadtype").html(H.ariaTopsubReadtype),
            j(),
            new s(".ariaTopsubten ").html(H.ariaTopsubten),
            w(),
            new s(".ariareset").attr("title", H.ariareset),
            new s(".ariaTopsubreset").html(H.ariaTopsubreset),
            new s(".ariatopfixedtext").attr("title", H.ariatopfixedtext),
            new s(".ariaTopsubtopfixed").html(H.ariaTopsubtopfixed),
            new s(".ariaTopsubigsrc").html(H.ariaTopsubigsrc),
            new s(".ariabigsrc").attr(
              "title",
              l.bigsrc ? H.ariabigsrcopen : H.ariabigsrcclose
            ),
            new s(".ariaTopsubtopexit").html(H.ariaTopsubtopexit),
            new s(".ariaexit").attr("title", H.ariaexit),
            new s(".ariaacchelpbook").attr("title", H.ariaacchelpbook),
            new s(".ariaTopacchelpbook").html(H.ariaTopacchelpbook),
            _(e),
            M(),
            K(null),
            A(null),
            E(null),
            P(null),
            S(null),
            L(),
            b(),
            (r = setInterval(b, 3e3));
        }
        function b() {
          for (
            var e = new s(".onlineread"),
              t = new s(".readsrc").length < 2,
              n = 1;
            7 > n;
            n++
          ) {
            var r,
              o = new s("[aria-regiontype='" + n + "']").length;
            t
              ? ((r =
                  '<div id="acccross" class="readsrc acccross' +
                  n +
                  " " +
                  (0 == o ? "disable" : "") +
                  '">'),
                (r +=
                  ' <span class="title">' +
                  (H["regiontype" + n] || H[void 0]) +
                  '<label>(<t id="regioncount' +
                  n +
                  '">' +
                  o +
                  "</t>)</label></span>"),
                (r += '<span class="desc">ALT+' + n + "</span>"),
                (r += "</div>"),
                e.append(r))
              : o != parseInt(new s("#regioncount" + n).html()) &&
                (new s("#regioncount" + n).html(o),
                o > 0
                  ? new s(".acccross" + n).removeClass("disable")
                  : new s(".acccross" + n).addClass("disable"));
          }
          v();
        }
        function v(e) {
          var t = l.readsrc;
          void 0 !== e && ((l.readsrc = !t), (t = !t)),
            t
              ? (new s(".notonlineread").addClass("hidden"),
                new s(".onlineread").removeClass("hidden"))
              : (new s(".notonlineread").removeClass("hidden"),
                new s(".onlineread").addClass("hidden"));
        }
        function y() {
          l.reset(),
            h(),
            N(),
            (l.defaultTheme = null),
            B.setSettingTheme(),
            (window.canRead = !0),
            f.play(H.ariaresetsuccess);
        }
        function w() {
          "ariamouseb" == l.mousemode
            ? new s(".ariamouseb").attr("title", H.ariamousebopen)
            : new s(".ariamouseb").attr("title", H.ariamousebclose),
            l.mouseten
              ? new s(".ariamouseten").attr("title", H.ariamousetenopen)
              : new s(".ariamouseten").attr("title", H.ariamousetenclose);
        }
        function j() {
          var e = 2 == l.readtype ? "2" : "1",
            e = H["ariaReadtype" + e];
          new s(".ariaReadtype").attr("title", e);
        }
        function T(e) {
          e || l.voice.enable
            ? new s(".ariavoice").attr("title", H.openvoice)
            : new s(".ariavoice").attr("title", H.closevoice);
        }
        function O() {
          var e = l.voice.rate,
            t = "正常";
          1 != e && (t += e + "倍"),
            new s(".ariaVoiceRate").attr(
              "title",
              H.ariaVoiceRate.replace("{0}", t)
            );
        }
        function C() {
          f.stop(), x(), u.execEvent(d.globalEnd), B.end();
        }
        function S(e) {
          var t = l.readtype,
            n = new s(".ariaReadtype");
          e &&
            ((t = l.readtype = 2 == t ? 1 : 2),
            f.play(H["ariaReadtype" + (2 == l.readtype ? "2" : "1")])),
            2 == t
              ? (n.removeClass("ariaicon-finger_reading"),
                n.addClass("ariaicon-continuous_reading"))
              : ((l.readtype = 1),
                n.addClass("ariaicon-finger_reading"),
                n.removeClass("ariaicon-continuous_reading")),
            j();
        }
        function k(e) {
          var t = l.highlight.enable;
          e
            ? t
              ? ((l.highlight.enable = !1),
                new s(".ariahighlighttool").parent().removeClass("fixedSelect"),
                new s(".ariahighlighttool").ariaAttr(
                  "success",
                  H.unsethighlight
                ))
              : ((l.highlight.enable = !0),
                new s(".ariahighlighttool").parent().addClass("fixedSelect"),
                new s(".ariahighlighttool").ariaAttr("success", H.sethighlight))
            : t && new s(".ariahighlighttool").parent().addClass("fixedSelect");
        }
        function E(e) {
          var t = l.mouseten;
          e &&
            ((l.mouseten = t = !t),
            w(),
            f.play(t ? H.ariamousetenopen : H.ariamousetenclose)),
            t ? B.startMouseTen() : B.endMouseTen();
        }
        function A(e) {
          var t = new s(".ariamouseb"),
            n = l.mousemode;
          e
            ? ("ariamouseb" != n
                ? ((l.mousemode = "ariamouseb"), f.play(H.ariamousebopen))
                : (t.removeClass("fixedSelect"),
                  (l.mousemode = null),
                  f.play(H.ariamousebclose)),
              (n = l.mousemode),
              w())
            : "ariamouseb" == n && t.addClass("fixedSelect"),
            N(n);
        }
        function N(e) {
          e ? "ariamouseb" == e && B.startBigMouse() : B.endBigMouse();
        }
        function L(e) {
          var t;
          l.voice.enable
            ? ((t = l.voice.rate),
              e &&
                (t >= l.voice.maxRate ? (t = l.voice.minRate) : (t += 0.5),
                (l.voice.rate = parseFloat(t.toFixed(1))),
                f.play(H.ariaCurVoiceRate.replace("{0}", t.toFixed(1)))),
              (e = new s(".ariaVoiceRate")),
              1 >= t
                ? (e.removeClass("ariaicon-quick_read"),
                  e.addClass("ariaicon-slow_read"))
                : (e.addClass("ariaicon-quick_read"),
                  e.removeClass("ariaicon-slow_read")),
              O())
            : f.play(H.ariaVoiceUnEnable);
        }
        function R() {
          var e = l.scale;
          e >= l.maxZoom
            ? f.play(H.maxZoomPage)
            : (e ? (e += 0.1) : (e = 1),
              (l.scale = parseFloat(e.toFixed(1))),
              f.play(H.curZoomPage.replace("{0}", e.toFixed(1))),
              z.setBodyTran());
        }
        function I() {
          var e = l.scale;
          e <= l.minZoom
            ? f.play(H.minZoomPage)
            : (e ? ((e -= 0.1), (l.scale = parseFloat(e.toFixed(2)))) : (e = 1),
              f.play(H.curZoomPage.replace("{0}", e.toFixed(2))),
              z.setBodyTran());
        }
        function K(e) {
          var t,
            n = l.Themes,
            r = l.defaultTheme;
          if (e) {
            if (r) {
              for (var o = 0; o < n.length; o++)
                if (n[o].name == r) {
                  l.defaultTheme =
                    o == n.length - 1 ? n[0].name : n[o + 1].name;
                  break;
                }
            } else l.defaultTheme = n[0].name;
            N(l.mousemode),
              B.setSettingTheme(),
              f.play(
                H.ariathemebtn +
                  (l.Theme && l.Theme.displayName ? l.Theme.displayName : "无")
              ),
              new s(".ariathemebtn").attr(
                "title",
                H.ariathemebtn +
                  (l.Theme && l.Theme.displayName ? l.Theme.displayName : "无")
              );
          }
          if (((r = l.defaultTheme), n && 0 < n.length)) {
            for (var i, o = 0; o < n.length; o++)
              if (n[o].name == r) {
                t = o + 1 < n.length ? n[o + 1] : n[0];
                break;
              }
            t
              ? ((i = t.value.color || "black"),
                (e = t.value.backgroundColor || "white"),
                F.addCss(
                  "#ariaToptoolbar .ariathemebtn",
                  {
                    color: i + " !important",
                    "background-color": e + " !important",
                  },
                  "ariathemebtn"
                ))
              : new s("[title='ariathemebtn']").remove();
          }
        }
        function _(e) {
          var t = l.voice.enable,
            n = new s(".ariavoice");
          e &&
            ((l.voice.enable = t = !t)
              ? f.play(H.openvoice)
              : (f.play(H.closevoice), f.stop()),
            T()),
            t
              ? (n.removeClass("ariaicon-close_sound"),
                n.addClass("ariaicon-open_sound"))
              : (n.removeClass("ariaicon-open_sound"),
                n.addClass("ariaicon-close_sound"));
        }
        function P(e) {
          var t,
            n = l.bigsrc;
          e &&
            ((l.bigsrc = !n),
            (e = (n = !n) ? H.ariabigsrcopen : H.ariabigsrcclose),
            new s(".ariabigsrc").attr("title", e),
            f.play(e)),
            n
              ? (new s(document.body).css("margin-bottom") < 150 &&
                  new s(document.body).addClass("ariabodybottomfiexed"),
                new s("#accscreen").addClass("expanded"),
                new s(".ariabigsrc").addClass("fixedSelect"),
                (t = new s("div,footer")),
                F.each(t, function (e, t) {
                  var n = new s(t),
                    t = n.css("bottom");
                  "fixed" == n.css("position") &&
                    !n.aria.skipall &&
                    99 > t &&
                    (n.css("bottom", t + 150), n.addClass("fixedbottom100"));
                }))
              : (new s(".ariabigsrc").removeClass("fixedSelect"),
                new s(document.body).removeClass("ariabodybottomfiexed"),
                new s("#accscreen").removeClass("expanded"),
                (t = new s(".fixedbottom100")),
                F.each(t, function (e, t) {
                  var n = new s(t),
                    t = n.css("bottom");
                  n.css("bottom", t - 150);
                }),
                new s(".fixedbottom100").removeClass("fixedbottom100"));
        }
        function D() {
          new s(".ariabodytopfiexed").removeClass("ariabodytopfiexed"),
            new s(".fiexdTop100"),
            new s(".fiexdToabsolute").css("positon", "absolute"),
            new s(".fiexdToabsolute").removeClass("fiexdToabsolute"),
            new s(".fiexdTop100").removeClass("fiexdTop100"),
            new s("#ariaToptoolbar").removeClass("expanded");
        }
        function M(e) {
          var t = l.topfixed;
          e && (l.topfixed = t = !t);
          var n = new s(".ariatopfixed");
          t
            ? (new s(document.body).addClass("ariabodytopfiexed"),
              (t = new s("div,header")),
              F.each(t, function (e, t) {
                new s(t).css("top");
              }),
              e && f.play(H.ariatopfixedtextopen),
              n.addClass("fixedSelect"),
              new s("#ariaToptoolbar").addClass("expanded"))
            : (n.removeClass("fixedSelect"),
              D(),
              e && f.play(H.ariatopfixedtextclose));
        }
        function q() {
          new s("#ariaToptoolbar").removeClass("showpannel");
        }
        var H,
          r,
          o = n(9438),
          s = n(8057),
          F = n(9228),
          l = n(8962),
          i = n(1266),
          u = n(57),
          d = n(2264),
          f = (n(57), n(5553)),
          B = n(2713),
          z = n(6057),
          p = n(5045),
          m = l.hostEnable,
          U = n(7524);
        l.hostEnable &&
          (u.registerEvent(
            d.globalListen,
            function (e) {
              var t = i.eventKeyCode(e);
              l.status && t >= 49 && 54 >= t && e.altKey
                ? (function (e) {
                    var t,
                      n,
                      r,
                      o,
                      i = new s("[aria-regiontype='" + e + "']");
                    new s(".readsrc").removeClass("select"),
                      0 != i.length
                        ? ((t = new s(".currentRegion" + e)),
                          (i =
                            0 == t.length
                              ? i.nodeList[0]
                              : (o = t.index(i)) == i.length - 1
                              ? i.nodeList[0]
                              : i.nodeList[o + 1]) &&
                            ((n = new s(i)),
                            new s(".currentRegion" + e).removeClass(
                              "currentRegion" + e
                            ),
                            n.addClass("currentRegion" + e),
                            n.attr("tabindex", 0),
                            (r = new s(".acccross" + e)).addClass("select"),
                            setTimeout(function () {
                              r.removeClass("select");
                            }, 500),
                            null != (o = n.aria.owns)
                              ? (0 < (o = new s(o)).length &&
                                  ("click" == (i = o.aria.expandShowMethod)
                                    ? F.triggerEvent(o.firstNode, "click")
                                    : "focus" == i
                                    ? o.firstNode.focus()
                                    : F.triggerEvent(
                                        new s(o).firstNode,
                                        "mouseover"
                                      ),
                                  (window.canRead = !1)),
                                setTimeout(function () {
                                  (window.canRead = !0),
                                    p.setClass(n),
                                    n.focus();
                                }, 350))
                              : (p.setClass(n), n.focus())))
                        : f.play(
                            H.noregiontype.replace("{0}", H["regiontype" + e])
                          );
                  })(t - 48)
                : i.checkKeyCode(e, i.keyCodeSettings.readtype)
                ? S(e)
                : i.checkKeyCode(e, i.keyCodeSettings.readsrc)
                ? v(e)
                : i.checkKeyCode(e, i.keyCodeSettings.help)
                ? a()
                : i.checkKeyCode(e, i.keyCodeSettings.wakupConfig)
                ? M(e)
                : i.checkKeyCode(e, i.keyCodeSettings.opVoice)
                ? _(e)
                : i.checkKeyCode(e, i.keyCodeSettings.vocierate)
                ? L(e)
                : i.checkKeyCode(e, i.keyCodeSettings.changeTheme)
                ? K(e)
                : i.checkKeyCode(e, i.keyCodeSettings.fontTob)
                ? R()
                : i.checkKeyCode(e, i.keyCodeSettings.fontTos)
                ? I()
                : i.checkKeyCode(e, i.keyCodeSettings.mouseb)
                ? A(e)
                : i.checkKeyCode(e, i.keyCodeSettings.mouseten)
                ? E(e)
                : i.checkKeyCode(e, i.keyCodeSettings.reset)
                ? y()
                : i.checkKeyCode(e, i.keyCodeSettings.bigsrc)
                ? P(e)
                : i.checkKeyCode(e, i.keyCodeSettings.exitservice) && C();
            },
            1
          ),
          u.registerEvent(
            d.TouchWakeup,
            function () {
              new s("#ariaToptoolbar").addClass("showpannel");
            },
            0
          )),
          (e.exports = {
            start: function () {
              U.start(),
                (H = H || l.Language),
                m.enable &&
                  void 0 !== l.road &&
                  (l.inFrame ||
                    0 < new s("#ariaToptoolbar").length ||
                    o.getText(l.road + "html/toolbar.min.html", function (e) {
                      0 == new s("#ariaiconstyle").length &&
                        new s(document.head).append(
                          '<link rel="stylesheet" id="ariaiconstyle" href="' +
                            l.road +
                            'css/font.min.css"></link>'
                        ),
                        (e = F.replaceAll(e, "{road}", l.road)),
                        new s(document.body).append(e),
                        h(),
                        new s(document.body).on("click", ".ariavoice", _),
                        new s(document.body).on("click", ".ariatopfixed", M),
                        new s(document.body).on("click", ".ariathemebtn", K),
                        new s(document.body).on("click", ".ariazoomb", R),
                        new s(document.body).on("click", ".ariazooms", I),
                        new s(document.body).on("click", ".ariareset", y),
                        new s(document.body).on("click", ".ariaVoiceRate", L),
                        new s(document.body).on("click", ".ariaReadtype", S),
                        new s(document.body).on("click", ".ariamouseb", A),
                        new s(document.body).on("click", ".ariamouseten", E),
                        new s(document.body).on(
                          "click",
                          ".ariahighlighttool",
                          k
                        ),
                        new s(document.body).on("click", ".ariaexit", C),
                        new s(document.body).on("click", ".ariabigsrc", P),
                        new s(document.body).on("click", ".ariablackgroud", q),
                        new s(document.body).on("click", "#accscreen-py", c),
                        new s(document.body).on("click", "#accscreen-jt", g),
                        new s(document.body).on("click", ".ariaacchelpbook", a),
                        new s(document.body).on("click", ".ariaReadScreen", v);
                    }));
            },
            end: x,
          });
      },
      2713: function (e, t, n) {
        function a(e) {
          var t;
          (e = e || document),
            o.start(e),
            r.start(e),
            i.start(e),
            s.start(e),
            c.mouseten && d.start(e),
            c.bigpoint && u.setMouseb(e),
            e == document &&
              (m(document),
              null == p &&
                (p = setInterval(function () {
                  c.status ||
                    null == clearInterval ||
                    (clearInterval(p), (p = null)),
                    m(document);
                }, 2e3)),
              (t = e),
              u.setSettingTheme(t),
              f.iframeMouse(e)),
            e != document && c.status;
        }
        function m(e) {
          for (
            var t = e.getElementsByTagName("iframe"), n = 0;
            n < t.length;
            n++
          )
            try {
              var r = t[n].contentWindow.document;
              if (!r.body) continue;
              [].indexOf.call(h, r) < 0 && h.push(r),
                "true" != r.body.getAttribute("ariaevent") &&
                  (r.body.setAttribute("ariaevent", !0), a(r)),
                m(r);
            } catch (e) {}
        }
        var r = n(5602),
          o = n(7608),
          i = n(3827),
          c = n(8962),
          s = n(2133),
          g = n(9228),
          l = n(8057),
          u = n(6057),
          d = n(1689),
          f = n(5020),
          h = [],
          p = null;
        e.exports = {
          start: a,
          end: function () {
            i.end(),
              o.end(),
              r.end(),
              (c.status = !1),
              s.end(),
              u.end(),
              clearInterval(p),
              (p = null),
              g.each(h, function (e, t) {
                new l("body", t).attr("ariaevent", "false"),
                  o.end(t),
                  r.end(t),
                  u.end(t),
                  i.end(t);
              });
          },
          startBigMouse: function () {
            u.setMouseb(document),
              0 == h.length && m(document),
              g.each(h, function (e, t) {
                u.setMouseb(t);
              });
          },
          endBigMouse: function () {
            u.removeMouseb(),
              g.each(h, function (e, t) {
                u.removeMouseb(t);
              });
          },
          startMouseTen: function () {
            d.start(),
              0 == h.length && m(document),
              g.each(h, function (e, t) {
                d.start(t);
              });
          },
          endMouseTen: function () {
            d.end(),
              g.each(h, function (e, t) {
                d.end(t);
              });
          },
          setSettingTheme: function () {
            u.setSettingTheme(),
              0 == h.length && m(document),
              g.each(h, function (e, t) {
                u.setSettingTheme(t);
              });
          },
        };
      },
      5602: function (e, t, n) {
        var r = n(1194),
          o = n(1151),
          i = n(7629),
          a = n(8141),
          s = n(630);
        e.exports = {
          start: function (e) {
            (e = e || document),
              i.start(e),
              o.start(e),
              r.start(e),
              a.start(e),
              s.start(e);
          },
          end: function (e) {
            (e = e || document),
              i.end(e),
              o.end(e),
              r.end(e),
              a.end(e),
              s.end(e);
          },
        };
      },
      7608: function (e, t, n) {
        var r = n(8962),
          o = n(6057),
          i = n(8458),
          a = n(5045),
          s = n(1282);
        e.exports = {
          start: function (e) {
            (e = e || document),
              i.start(e),
              o.start(e),
              a.setFontSize(e),
              s.start(e),
              r.py &&
                "undefined" == typeof ariaPY &&
                e == document &&
                o.addPy();
          },
          end: function (e) {
            (e = e || document), o.end(e), s.end(e);
          },
        };
      },
      8690: function (e, t, n) {
        var r,
          o = n(9228),
          s = n(2491),
          a = n(7156),
          l = n(1771),
          u = n(8962),
          d = n(4152);
        e.exports = function (i, c) {
          function t(e) {
            if (e && 0 < e.length) {
              e = e.split(",");
              for (var t = "", n = 0; n < e.length; n++) {
                var r = e[n];
                0 < r.length && (t += "," + r);
              }
              0 < t.length && (t = t.substring(1, t.length));
              var o = i.find(t);
              return 0 == o.length ? new c(t) : o;
            }
            return null;
          }
          function e(e) {
            if (((e = t(e)), !e)) return "";
            var n = "";
            return (
              o.each(e.nodeList, function (e, t) {
                (n += t.value || t.textContent), (n += ",");
              }),
              (n = o.reMoveHtml(n))
            );
          }
          return (
            (r = r || u.Language),
            {
              get id() {
                return i.attr("id");
              },
              get canSetClass() {
                return !(
                  "true" === i.ariaAttr("skipall") ||
                  0 < i.closest("[aria-skipall='true']").length ||
                  "true" === i.ariaAttr("skiptheme")
                );
              },
              set id(e) {
                i.attr("id", e);
              },
              get isregion() {
                return "true" === i.ariaAttr("region") || !1;
              },
              get region() {
                return i.ariaAttr("region");
              },
              set region(e) {
                i.ariaAttr("region", e);
              },
              get regions() {
                return new c("[aria-region='true']");
              },
              get regionN() {
                var e = i.aria.regionElem,
                  t = i.aria.regions;
                return e
                  ? ((e = e.index(t.nodeList)),
                    e < t.length - 1 ? t[e + 1] : null)
                  : t.firstNode;
              },
              get regionP() {
                var e = i.aria.regionElem,
                  t = i.aria.regions;
                return e
                  ? ((e = e.index(t.nodeList)), e > 0 ? t[e - 1] : null)
                  : t.firstNode;
              },
              get expandShowMethod() {
                return i.ariaAttr("expandShowMethod");
              },
              get regionElem() {
                return "true" == i.ariaAttr("region")
                  ? i
                  : new c(i.closest("[aria-region='true']"));
              },
              get nodeName() {
                if (0 === i.length) return null;
                var e = i.firstNode.nodeName.toLowerCase();
                return -1 < [].indexOf.call(o.HtmlElemRoles.select, e)
                  ? "select"
                  : e;
              },
              get role() {
                return l.getRole(i);
              },
              set role(e) {
                i.attr("role", e);
              },
              get roleText() {
                return l.getRoleText(i);
              },
              get mainText() {
                return s.mainText(i.aria);
              },
              get descText() {
                return s.descText(i.aria);
              },
              get orientation() {
                return i.ariaAttr("orientation");
              },
              set orientation(e) {
                i.ariaAttr("orientation", e);
              },
              get errormessage() {
                return i.ariaAttr("errormessage") || i.attr("errormessage");
              },
              set errormessage(e) {
                i.ariaAttr("errormessage", e);
              },
              get description() {
                return i.ariaAttr("description");
              },
              set description(e) {
                i.ariaAttr("description", e);
              },
              get current() {
                return i.ariaAttr("current");
              },
              set current(e) {
                i.ariaAttr("current", e);
              },
              get modal() {
                return i.ariaAttr("modal");
              },
              set modal(e) {
                i.ariaAttr("modal", e);
              },
              get pressed() {
                return i.ariaAttr("pressed");
              },
              set pressed(e) {
                i.ariaAttr("pressed", e);
              },
              get valueText() {
                return a(i);
              },
              set valueText(e) {
                i.ariaAttr("valuetext", e), i.val(e), i.text(e);
              },
              get valuenow() {
                return i.ariaAttr("valuenow") || i.val();
              },
              set valuenow(e) {
                i.ariaAttr("valuenow", e), i.val(e);
              },
              get valuemin() {
                return i.ariaAttr("valuemin") || i.attr("min");
              },
              get valueminText() {
                return this.valuemin ? r.min + this.valuemin : null;
              },
              set valuemin(e) {
                i.ariaAttr("valuemin", e), i.attr("min", e);
              },
              get valuemax() {
                return i.ariaAttr("valuemax") || i.attr("max");
              },
              set valuemax(e) {
                i.ariaAttr("valuemax", e), i.attr("max", e);
              },
              get valuemaxText() {
                return this.valuemax ? r.max + this.valuemax : null;
              },
              get value() {
                return i.val();
              },
              get text() {
                return i.text();
              },
              get sort() {
                return i.ariaAttr("sort") || i.attr("sort");
              },
              set sort(e) {
                i.ariaAttr("sort", e), i.attr("sort", e);
              },
              get relevant() {
                return i.ariaAttr("relevant");
              },
              set relevant(e) {
                i.ariaAttr("relevant", e);
              },
              get posinset() {
                return o.formatInt(i.ariaAttr("posinset"));
              },
              set posinset(e) {
                i.ariaAttr("posinset", e);
              },
              get owns() {
                return i.ariaAttr("owns");
              },
              set owns(e) {
                i.ariaAttr("owns", e);
              },
              get live() {
                return i.ariaAttr("live");
              },
              set live(e) {
                i.ariaAttr("live", e);
              },
              get computedName() {
                return i.attr("computedName");
              },
              get describedby() {
                return t(i.ariaAttr("describedby"));
              },
              set describedby(e) {
                i.ariaAttr("describedby", e);
              },
              get describedbyText() {
                return e(i.ariaAttr("describedby"));
              },
              get labelledbyText() {
                return e(i.ariaAttr("labelledby") || i.attr("labelled-by"));
              },
              get labelledby() {
                return i.ariaAttr("labelledby") || i.attr("labelled-by");
              },
              set labelledby(e) {
                i.ariaAttr("labelledby", e);
              },
              get toolTipText() {
                return i.attr("data-tooltip-text");
              },
              get labelforText() {
                var e = i.attr("id");
                return e && 0 !== e.length
                  ? ((e = new c("label[for='" + e + "']")),
                    0 < e.nodeList.length ? e.text() : null)
                  : null;
              },
              get labelfor() {
                return i.attr("for");
              },
              set labelfor(e) {
                i.attr("for", e);
              },
              get labelWrapperText() {
                if (0 === i.nodeList.length) return null;
                var e = i.nodeList[0];
                if (!e.labels || 0 === e.labels.length) return null;
                var r = "";
                return (
                  o.each(e.labels, function (e, t) {
                    var n = new c(t),
                      t = n.aria.descText;
                    t && (r += t), (r += n.aria.valueText);
                  }),
                  r
                );
              },
              get placeholder() {
                return i.attr("placeholder");
              },
              set placeholder(e) {
                i.attr("placeholder", e);
              },
              get title() {
                return i.attr("title");
              },
              set title(e) {
                i.attr("title", e);
              },
              get alt() {
                return i.attr("alt");
              },
              set alt(e) {
                i.attr("alt", e);
              },
              get label() {
                return i.ariaAttr("label");
              },
              set label(e) {
                i.ariaAttr("label", e);
              },
              get described() {
                return i.ariaAttr("described");
              },
              set described(e) {
                i.ariaAttr("described", e);
              },
              get grabbed() {
                return i.ariaAttr("grabbed");
              },
              set grabbed(e) {
                i.ariaAttr("grabbed", e);
              },
              get flowto() {
                return t(i.ariaAttr("flowto"));
              },
              set flowto(e) {
                i.ariaAttr("flowto", e);
              },
              get dropeffect() {
                return i.ariaAttr("dropeffect");
              },
              set dropeffect(e) {
                i.ariaAttr("dropeffect", e);
              },
              get controls() {
                return t(i.ariaAttr("controls"));
              },
              get nextFocus() {
                return d.nextFocus1(i, c);
              },
              get preFocus() {
                return d.preFocus1(i, c);
              },
              get firstFocus() {
                return d.firstFocus1(i, c);
              },
              get lastFocus() {
                return d.lastFocus1(i, c);
              },
              set controls(e) {
                i.ariaAttr("controls", e);
              },
              get busy() {
                return o.strToObj(i.ariaAttr("busy"));
              },
              set busy(e) {
                i.ariaAttr("busy", e);
              },
              get autocomplete() {
                return i.ariaAttr("autocomplete");
              },
              set autocomplete(e) {
                "none" === e
                  ? i.attr("autocomplete", "off")
                  : i.attr("autocomplete", "on"),
                  i.ariaAttr("autocomplete", e);
              },
              get atomic() {
                return o.strToObj(i.ariaAttr("atomic"));
              },
              set atomic(e) {
                i.ariaAttr("atomic", e);
              },
              get atomicElem() {
                return i.closest("[aria-atomic='true']");
              },
              get atomicText() {
                var e =
                  "true" == i.ariaAttr("atomic")
                    ? i
                    : i.closest("[aria-atomic='true']");
                return e ? e.textAll(!0) : null;
              },
              get activedescendant() {
                return i.ariaAttr("activedescendant");
              },
              set activedescendant(e) {
                i.ariaAttr("activedescendant", e);
              },
              get hidden() {
                return o.strToObj(i.ariaAttr("hidden") || i.isHidden());
              },
              set hidden(e) {
                i.ariaAttr("hidden", e), e ? i.hidden() : i.show();
              },
              get expanded() {
                return o.strToObj(i.ariaAttr("expanded"));
              },
              set expanded(e) {
                i.ariaAttr("expanded", e), i.attr("expanded", e);
              },
              get checked() {
                return -1 <
                  ["checkbox", "radiobox", "switch"].indexOf(i.aria.role) &&
                  void 0 !== i.is("checked")
                  ? i.is("checked")
                  : o.strToObj(i.attr("checked") || i.ariaAttr("checked"));
              },
              set checked(e) {
                e
                  ? (i.ariaAttr("checked", e), i.attr("checked", e))
                  : (i.removeAttr("checked"), i.removeAttr("aria-checked"));
              },
              get haspopup() {
                return o.strToObj(i.attr("haspopup") || i.ariaAttr("haspopup"));
              },
              set haspopup(e) {
                i.ariaAttr("haspopup", e), i.attr("haspopup", e);
              },
              get disabled() {
                return (
                  i.is("disabled") ||
                  o.strToObj(i.attr("disabled") || i.ariaAttr("disabled"))
                );
              },
              set disabled(e) {
                i.ariaAttr("disabled", e), i.attr("disabled", e);
              },
              get invalid() {
                return o.strToObj(i.ariaAttr("invalid"));
              },
              set invalid(e) {
                i.ariaAttr("invalid", e);
              },
              get selected() {
                return o.strToObj(
                  i.is("selected") ||
                    i.attr("selected") ||
                    i.ariaAttr("selected")
                );
              },
              set selected(e) {
                i.ariaAttr("selected", e), i.attr("selected", e);
              },
              get level() {
                var e,
                  t = i.ariaAttr("level");
                return (
                  t ||
                    ((e = this.nodeName),
                    -1 < o.HtmlElemRoles.heading.indexOf(e) &&
                      (t = e.replace("h", ""))),
                  o.strToObj(t)
                );
              },
              set level(e) {
                i.ariaAttr("level", e);
              },
              get multiselectable() {
                return o.strToObj(i.ariaAttr("multiselectable"));
              },
              set multiselectable(e) {
                i.ariaAttr("multiselectable", e);
              },
              get required() {
                return o.strToObj(i.ariaAttr("required") || i.attr("required"));
              },
              set required(e) {
                i.ariaAttr("required", e), i.attr("required", e);
              },
              get readonly() {
                return (
                  i.is("readonly") ||
                  o.strToObj(i.ariaAttr("readonly") || i.attr("readonly"))
                );
              },
              set readonly(e) {
                i.ariaAttr("readonly", e), i.attr("readonly", e);
              },
              get multiLine() {
                return o.strToObj(
                  i.ariaAttr("multiline") || i.attr("multiline")
                );
              },
              set multiLine(e) {
                i.ariaAttr("multiline", e), i.attr("multiline", e);
              },
              get focusable() {
                if (i.isHidden()) return !1;
                var e = i.firstNode;
                if (!e) return !1;
                if (1 == e.nodeType) {
                  if ("0" == e.getAttribute("tabindex")) return !0;
                  if ("INPUT" == e.tagName) {
                    var t = e.getAttribute("type");
                    if (!t || "hidden" != t) return !0;
                  }
                  if (
                    ("A" == e.tagName && e.getAttribute("href")) ||
                    "SELECT" == e.tagName ||
                    "TEXTAREA" == e.tagName ||
                    "BUTTON" == e.tagName
                  )
                    return !0;
                }
                return !1;
              },
              set focusable(e) {
                i.attr("tabindex", (e = e || 0));
              },
              get skiptheme() {
                return (
                  "true" == i.ariaAttr("skiptheme") ||
                  0 < i.closest("[aria-skiptheme='true']").length ||
                  "true" == i.ariaAttr("skipall") ||
                  0 < i.closest("[aria-skipall='true']").length
                );
              },
              get skipall() {
                return (
                  "true" == i.ariaAttr("skipall") ||
                  0 < i.closest("[aria-skipall='true']").length
                );
              },
              get skipscale() {
                return (
                  "true" == i.ariaAttr("skipscale") ||
                  0 < i.closest("[aria-skipscale='true']").length ||
                  "true" == i.ariaAttr("skipall") ||
                  0 < i.closest("[aria-skipall='true']").length
                );
              },
              get isDialog() {
                return (
                  -1 < [].indexOf.call(o.HtmlElemRoles.dialog, i.aria.role) ||
                  0 < i.closest(o.arrToSizzle(o.HtmlElemRoles.dialog)).length
                );
              },
              get dialog() {
                if (-1 < [].indexOf.call(o.HtmlElemRoles.dialog, i.aria.role))
                  return i;
                var e = i.closest(o.arrToSizzle(o.HtmlElemRoles.dialog));
                return 0 < e.length ? e : null;
              },
              get action() {
                return i.ariaAttr("action");
              },
              get lastText() {
                return s.lastDesc(i);
              },
              get tabindex() {
                return i.attr("tabindex");
              },
              set tabindex(e) {
                null != e ? i.attr("tabindex", e) : i.removeAttr("tabindex");
              },
            }
          );
        };
      },
      2087: function (e, t, n) {
        var r = n(9722),
          o = n(365),
          i = n(2998),
          a = n(994),
          s = n(9427),
          c = n(6057),
          l = n(8458),
          u = n(8962),
          d = n(954);
        e.exports = {
          start: function () {
            d.init().then(function () {
              l.start(),
                c.start(),
                r.start(),
                o.start(),
                i.start(),
                a.start(),
                s.start(),
                (u.status = !0);
            });
          },
          end: function () {
            r.end(),
              o.end(),
              i.end(),
              a.end(),
              s.end(),
              c.end(),
              (u.status = !1);
          },
        };
      },
      1855: function (e, t, n) {
        function a(e) {
          (e = new r(e.target)), o.play(e.aria.lastText);
        }
        var r = n(8057),
          o = n(5553),
          i = n(2087);
        e.exports = {
          start: function () {
            var e, t;
            "onpopstate" in window
              ? window.addEventListener("popstate", i.start, !1)
              : ((e = function (e) {
                  var t = history[e],
                    n = new Event(e);
                  return function () {
                    var e = t.apply(this, arguments);
                    return (
                      (n.arguments = arguments), window.dispatchEvent(n), e
                    );
                  };
                }),
                (history.pushState = e("pushState")),
                (history.replaceState = e("replaceState")),
                window.addEventListener("pushState", i.start),
                window.addEventListener("replaceState", i.start)),
              "onhashchange" in window &&
              (void 0 === document.documentMode || 8 === document.documentMode)
                ? window.addEventListener("hashchange", i.start)
                : (t = setInterval(function () {
                    isHashChanged() && (i.start(), clearInterval(t));
                  }, 150)),
              new r(document).on("change", "*", a);
          },
          end: function () {
            window.removeEventListener("popstate", i.start, !1),
              window.removeEventListener("pushState", i.start),
              window.removeEventListener("replaceState", i.start),
              window.removeEventListener("hashchange", i.start),
              new r(document).off("change", "*", a);
          },
        };
      },
      9427: function (e, t, n) {
        function o() {
          window.doubletap = !0;
        }
        n(8057);
        var r = n(5014);
        e.exports = {
          start: function () {
            r.on(document, "doubletap", "*", o);
          },
          end: function () {
            r.off(document, "doubletap", "*", o);
          },
        };
      },
      1337: function (e, t, n) {
        function a(e) {
          (window.canRead = !0),
            2 == e.fingersCount &&
              (o.status ? i.end() : i.start(), (window.ariaHold = !0));
        }
        var r = n(5014),
          o = n(8962),
          i = n(2087);
        e.exports = {
          start: function () {
            r.on(document, "hold", "*", a);
          },
          end: function () {
            r.off(document, "hold", "*", a);
          },
        };
      },
      2998: function (e, t, n) {
        function o(e) {
          var t = e.fingersCount,
            n = e.distance,
            e = e.direction;
          if (!(100 > n) && window.startSwipe) {
            if (1 == t) {
              if (!(n = window.ariaFocusElem) || "BODY" == n.nodeName)
                return (
                  (n = new i("#ariaContainer").child()[0]),
                  (window.ariaFocusElem = n),
                  (r = new i(n)).focus(),
                  s.play(r.aria.lastText),
                  void c.setClass(r)
                );
              var r,
                o = (r = new i(n));
              switch (e) {
                case "left":
                  o = r.aria.preFocus;
                  break;
                case "right":
                  o = r.aria.nextFocus;
              }
              (o = (window.ariaFocusElem = o).jTool ? o : new i(o)) != r &&
                (o.focus(), s.play(o.aria.lastText), c.setClass(o));
            }
            if (2 == t)
              switch (e) {
                case "up":
                  a.scroll(0, 0);
                  break;
                case "down":
                  a.scroll(0, document.body.scrollHeight);
                  break;
                case "right":
                  (l += 1), u();
                  break;
                case "left":
                  --l, u();
              }
            window.startSwipe = !1;
          }
        }
        function u() {
          var e = new i("[aria-region='true']");
          0 != e.length &&
            ((l = 0 > l ? e.length - 1 : l) >= e.length && (l = 0),
            (e = new i(e[l])).focus(),
            c.setClass(e),
            s.play(e.aria.lastText));
        }
        var i = n(8057),
          a = n(9228),
          r = n(5014),
          s = n(5553),
          c = n(5045),
          l = 0;
        e.exports = {
          start: function () {
            r.on(document, "swipe", "*", o);
          },
          end: function () {
            r.off(document, "swipe", "*", o);
          },
        };
      },
      994: function (e, t, n) {
        function s(e) {
          (window.canRead = !0),
            (e = new i(e.target)),
            3 < e.child().length ||
              ((window.ariaFocusElem = e),
              o.play(e.aria.lastText),
              a.setClass(e, document));
        }
        var r = n(5014),
          o = n(5553),
          i = n(8057),
          a = n(5045);
        n(9228),
          (e.exports = {
            start: function () {
              r.on(document, "tap", "*", s);
            },
            end: function () {
              r.off(document, "tap", "*", s);
            },
          });
      },
      5014: function (e, t, n) {
        "use strict";
        var r;
        void 0 ===
          (r =
            "function" ==
            typeof (r = function () {
              function a() {
                var e = "mouseup mousedown mousemove mouseout",
                  t = "touchstart touchmove touchend touchcancel",
                  n = c.hasTouch ? t : e;
                n.split(" ").forEach(function (e) {
                  document.addEventListener(e, r, !1);
                });
              }
              var c = {
                PCevts: {
                  touchstart: "mousedown",
                  touchmove: "mousemove",
                  touchend: "mouseup",
                  touchcancel: "mouseout",
                },
              };
              (c.hasTouch = "ontouchstart" in window),
                (c.getType = function (e) {
                  return Object.prototype.toString
                    .call(e)
                    .match(/\s([a-z|A-Z]+)/)[1]
                    .toLowerCase();
                }),
                (c.getSelector = function (e) {
                  if (e.id) return "#" + e.id;
                  if (e.className) {
                    var t = e.className.split(/\s+/);
                    return "." + t.join(".");
                  }
                  return e === document ? "body" : e.tagName.toLowerCase();
                }),
                (c.matchSelector = function (e, t) {
                  return e.webkitMatchesSelector(t);
                }),
                (c.getEventListeners = function (e) {
                  return e.listeners;
                }),
                (c.getPCevts = function (e) {
                  return this.PCevts[e] || e;
                }),
                (c.forceReflow = function () {
                  var e = "reflowDivBlock",
                    t = document.getElementById(e);
                  t ||
                    ((t = document.createElement("div")),
                    (t.id = e),
                    document.body.appendChild(t));
                  var n = t.parentNode,
                    r = t.nextSibling;
                  n.removeChild(t), n.insertBefore(t, r);
                }),
                (c.simpleClone = function (e) {
                  return Object.create(e);
                }),
                (c.getPosOfEvent = function (e) {
                  if (this.hasTouch) {
                    for (
                      var t = [], n = null, r = 0, o = e.touches.length;
                      o > r;
                      r++
                    )
                      (n = e.touches[r]), t.push({ x: n.pageX, y: n.pageY });
                    return t;
                  }
                  return [{ x: e.pageX, y: e.pageY }];
                }),
                (c.getDistance = function (e, t) {
                  var n = t.x - e.x,
                    r = t.y - e.y;
                  return Math.sqrt(n * n + r * r);
                }),
                (c.getFingers = function (e) {
                  return e.touches ? e.touches.length : 1;
                }),
                (c.calScale = function (e, t) {
                  if (e.length >= 2 && t.length >= 2) {
                    var n = this.getDistance(e[1], e[0]),
                      r = this.getDistance(t[1], t[0]);
                    return r / n;
                  }
                  return 1;
                }),
                (c.getAngle = function (e, t) {
                  return (180 * Math.atan2(t.y - e.y, t.x - e.x)) / Math.PI;
                }),
                (c.getAngle180 = function (e, t) {
                  var n =
                    Math.atan((-1 * (t.y - e.y)) / (t.x - e.x)) *
                    (180 / Math.PI);
                  return 0 > n ? n + 180 : n;
                }),
                (c.getDirectionFromAngle = function (e) {
                  var t = {
                    up: -45 > e && e > -135,
                    down: e >= 45 && 135 > e,
                    left: e >= 135 || -135 >= e,
                    right: e >= -45 && 45 >= e,
                  };
                  for (var n in t) if (t[n]) return n;
                  return null;
                }),
                (c.getXYByElement = function (e) {
                  for (var t = 0, n = 0; e.offsetParent; )
                    (t += e.offsetLeft),
                      (n += e.offsetTop),
                      (e = e.offsetParent);
                  return { left: t, top: n };
                }),
                (c.reset = function () {
                  (i = t = v = null),
                    (T = j = y = u = !1),
                    (w = !1),
                    (h = {}),
                    (f = !1);
                }),
                (c.isTouchMove = function (e) {
                  return "touchmove" === e.type || "mousemove" === e.type;
                }),
                (c.isTouchEnd = function (e) {
                  return (
                    "touchend" === e.type ||
                    "mouseup" === e.type ||
                    "touchcancel" === e.type
                  );
                }),
                (c.env = (function () {
                  var e = {},
                    t = navigator.userAgent,
                    n = t.match(/(Android)[\s\/]+([\d\.]+)/),
                    r = t.match(/(iPad|iPhone|iPod)\s+OS\s([\d_\.]+)/),
                    o = t.match(/(Windows\s+Phone)\s([\d\.]+)/),
                    i = /WebKit\/[\d.]+/i.test(t),
                    a = r
                      ? navigator.standalone
                        ? i
                        : /Safari/i.test(t) &&
                          !/CriOS/i.test(t) &&
                          !/MQQBrowser/i.test(t)
                      : !1;
                  return (
                    n && ((e.android = !0), (e.version = n[2])),
                    r &&
                      ((e.ios = !0),
                      (e.version = r[2].replace(/_/g, ".")),
                      (e.ios7 = /^7/.test(e.version)),
                      "iPad" === r[1]
                        ? (e.ipad = !0)
                        : "iPhone" === r[1]
                        ? ((e.iphone = !0), (e.iphone5 = 568 == screen.height))
                        : "iPod" === r[1] && (e.ipod = !0)),
                    o &&
                      ((e.wp = !0),
                      (e.version = o[2]),
                      (e.wp8 = /^8/.test(e.version))),
                    i && (e.webkit = !0),
                    a && (e.safari = !0),
                    e
                  );
                })());
              var g = {
                  proxyid: 0,
                  proxies: [],
                  trigger: function (t, n, r) {
                    r = r || {};
                    var o,
                      i = { bubbles: !0, cancelable: !0, detail: r };
                    try {
                      "undefined" != typeof CustomEvent
                        ? ((o = new CustomEvent(n, i)), t && t.dispatchEvent(o))
                        : ((o = document.createEvent("CustomEvent")),
                          o.initCustomEvent(n, !0, !0, r),
                          t && t.dispatchEvent(o));
                    } catch (e) {}
                  },
                  bind: function (t, n, o) {
                    (t.listeners = t.listeners || {}),
                      t.listeners[n]
                        ? t.listeners[n].push(o)
                        : (t.listeners[n] = [o]);
                    var r = function (t) {
                      c.env.ios7 && c.forceReflow(), (t.originEvent = t);
                      for (var n in t.detail)
                        "type" !== n && (t[n] = t.detail[n]);
                      t.startRotate = function () {
                        f = !0;
                      };
                      var r = o.call(t.target, t);
                      "undefined" == typeof r ||
                        r ||
                        (t.stopPropagation(), t.preventDefault());
                    };
                    (o.proxy = o.proxy || {}),
                      o.proxy[n]
                        ? o.proxy[n].push(this.proxyid++)
                        : (o.proxy[n] = [this.proxyid++]),
                      this.proxies.push(r),
                      t.addEventListener && t.addEventListener(n, r, !1);
                  },
                  unbind: function (t, n, r) {
                    if (r) {
                      var i = r.proxy[n];
                      i &&
                        i.length &&
                        i.forEach(function () {
                          t.removeEventListener &&
                            t.removeEventListener(
                              n,
                              this.proxies[this.proxyid],
                              !1
                            );
                        });
                    } else {
                      var o = t.listeners[n];
                      o &&
                        o.length &&
                        o.forEach(function (e) {
                          t.removeEventListener(n, e, !1);
                        });
                    }
                  },
                  delegate: function (a, t, l, u) {
                    var n = function (t) {
                      var n, r;
                      t.originEvent = t;
                      for (var o in t.detail)
                        "type" !== o && (t[o] = t.detail[o]);
                      t.startRotate = function () {
                        f = !0;
                      };
                      var i = c.getSelector(a) + " " + l,
                        g = c.matchSelector(t.target, i),
                        s = c.matchSelector(
                          t.target,
                          i + " " + t.target.nodeName
                        );
                      if (!g && s) {
                        for (
                          c.env.ios7 && c.forceReflow(), n = t.target;
                          !c.matchSelector(n, i);

                        )
                          n = n.parentNode;
                        (r = u.call(t.target, t)),
                          "undefined" == typeof r ||
                            r ||
                            (t.stopPropagation(), t.preventDefault());
                      } else
                        c.env.ios7 && c.forceReflow(),
                          (g || s) &&
                            ((r = u.call(t.target, t)),
                            "undefined" == typeof r ||
                              r ||
                              (t.stopPropagation(), t.preventDefault()));
                    };
                    (u.proxy = u.proxy || {}),
                      u.proxy[t]
                        ? u.proxy[t].push(this.proxyid++)
                        : (u.proxy[t] = [this.proxyid++]),
                      this.proxies.push(n),
                      (a.listeners = a.listeners || {}),
                      a.listeners[t]
                        ? a.listeners[t].push(n)
                        : (a.listeners[t] = [n]),
                      a.addEventListener && a.addEventListener(t, n, !1);
                  },
                  undelegate: function (t, n, r, o) {
                    if (o) {
                      var a = o.proxy[n],
                        s = this;
                      a.length &&
                        a.forEach(function (e) {
                          t.removeEventListener &&
                            t.removeEventListener(n, s.proxies[e], !1);
                        });
                    } else {
                      var i = t.listeners[n];
                      i.forEach(function (e) {
                        t.removeEventListener(n, e, !1);
                      });
                    }
                  },
                },
                p = {
                  tap: !0,
                  doubleTap: !0,
                  tapMaxDistance: 10,
                  hold: !0,
                  tapTime: 200,
                  holdTime: 650,
                  maxDoubleTapInterval: 300,
                  swipe: !0,
                  swipeTime: 300,
                  swipeMinDistance: 18,
                  swipeFactor: 5,
                  drag: !0,
                  pinch: !0,
                  minScaleRate: 0,
                  minRotationAngle: 0,
                },
                m = {
                  TOUCH_START: "touchstart",
                  TOUCH_MOVE: "touchmove",
                  TOUCH_END: "touchend",
                  TOUCH_CANCEL: "touchcancel",
                  MOUSE_DOWN: "mousedown",
                  MOUSE_MOVE: "mousemove",
                  MOUSE_UP: "mouseup",
                  CLICK: "click",
                  PINCH_START: "pinchstart",
                  PINCH_END: "pinchend",
                  PINCH: "pinch",
                  PINCH_IN: "pinchin",
                  PINCH_OUT: "pinchout",
                  ROTATION_LEFT: "rotateleft",
                  ROTATION_RIGHT: "rotateright",
                  ROTATION: "rotate",
                  SWIPE_START: "swipestart",
                  SWIPING: "swiping",
                  SWIPE_END: "swipeend",
                  SWIPE_LEFT: "swipeleft",
                  SWIPE_RIGHT: "swiperight",
                  SWIPE_UP: "swipeup",
                  SWIPE_DOWN: "swipedown",
                  SWIPE: "swipe",
                  DRAG: "drag",
                  DRAGSTART: "dragstart",
                  DRAGEND: "dragend",
                  HOLD: "hold",
                  TAP: "tap",
                  DOUBLE_TAP: "doubletap",
                },
                h = { start: null, move: null, end: null },
                b = 0,
                i = null,
                t = null,
                v = null,
                y = !1,
                u = !1,
                w = !1,
                x = {},
                j = !1,
                s = null,
                T = !1,
                l = null,
                d = 1,
                f = !1,
                O = [],
                C = 0,
                S = 0,
                k = 0,
                E = null,
                A = {
                  getAngleDiff: function (t) {
                    for (
                      var n = parseInt(C - c.getAngle180(t[0], t[1]), 10),
                        r = 0;
                      Math.abs(n - S) > 90 && r++ < 50;

                    )
                      0 > S ? (n -= 180) : (n += 180);
                    return (S = parseInt(n, 10));
                  },
                  pinch: function (t) {
                    var n = t.target;
                    if (p.pinch) {
                      if (!j) return;
                      if (c.getFingers(t) < 2 && !c.isTouchEnd(t)) return;
                      var r = c.calScale(h.start, h.move),
                        o = this.getAngleDiff(h.move),
                        i = {
                          type: "",
                          originEvent: t,
                          scale: r,
                          rotation: o,
                          direction: o > 0 ? "right" : "left",
                          fingersCount: c.getFingers(t),
                        };
                      if (
                        (u
                          ? c.isTouchMove(t)
                            ? ((i.fingerStatus = "move"),
                              g.trigger(n, m.PINCH, i))
                            : c.isTouchEnd(t) &&
                              ((i.fingerStatus = "end"),
                              g.trigger(n, m.PINCH_END, i),
                              c.reset())
                          : ((u = !0),
                            (i.fingerStatus = "start"),
                            g.trigger(n, m.PINCH_START, i)),
                        Math.abs(1 - r) > p.minScaleRate)
                      ) {
                        var a = c.simpleClone(i),
                          s = 1e-11;
                        r > d
                          ? ((d = r - s), g.trigger(n, m.PINCH_OUT, a, !1))
                          : d > r &&
                            ((d = r + s), g.trigger(n, m.PINCH_IN, a, !1)),
                          c.isTouchEnd(t) && (d = 1);
                      }
                      if (Math.abs(o) > p.minRotationAngle) {
                        var l,
                          b = c.simpleClone(i);
                        (l = o > 0 ? m.ROTATION_RIGHT : m.ROTATION_LEFT),
                          g.trigger(n, l, b, !1),
                          g.trigger(n, m.ROTATION, i);
                      }
                    }
                  },
                  rotateSingleFinger: function (t) {
                    var n = t.target;
                    if (f && c.getFingers(t) < 2) {
                      if (!h.move) return;
                      if (O.length < 2) {
                        var r = c.getXYByElement(n);
                        (O = [
                          {
                            x: r.left + n.offsetWidth / 2,
                            y: r.top + n.offsetHeight / 2,
                          },
                          h.move[0],
                        ]),
                          (C = parseInt(c.getAngle180(O[0], O[1]), 10));
                      }
                      var o = [O[0], h.move[0]],
                        i = this.getAngleDiff(o),
                        a = {
                          type: "",
                          originEvent: t,
                          rotation: i,
                          direction: i > 0 ? "right" : "left",
                          fingersCount: c.getFingers(t),
                        };
                      c.isTouchMove(t)
                        ? (a.fingerStatus = "move")
                        : (c.isTouchEnd(t) || "mouseout" === t.type) &&
                          ((a.fingerStatus = "end"),
                          g.trigger(n, m.PINCH_END, a),
                          c.reset());
                      var s = i > 0 ? m.ROTATION_RIGHT : m.ROTATION_LEFT;
                      g.trigger(n, s, a), g.trigger(n, m.ROTATION, a);
                    }
                  },
                  swipe: function (t) {
                    var n = t.target;
                    if (j && h.move && !(c.getFingers(t) > 1)) {
                      var r = Date.now(),
                        o = r - b,
                        i = c.getDistance(h.start[0], h.move[0]),
                        a = { x: h.move[0].x - x.left, y: h.move[0].y - x.top },
                        s = c.getAngle(h.start[0], h.move[0]),
                        v = c.getDirectionFromAngle(s),
                        l = o / 1e3,
                        u = 10 * (10 - p.swipeFactor) * l * l,
                        d = {
                          type: m.SWIPE,
                          originEvent: t,
                          position: a,
                          direction: v,
                          distance: i,
                          distanceX: h.move[0].x - h.start[0].x,
                          distanceY: h.move[0].y - h.start[0].y,
                          x: h.move[0].x - h.start[0].x,
                          y: h.move[0].y - h.start[0].y,
                          angle: s,
                          duration: o,
                          fingersCount: c.getFingers(t),
                          factor: u,
                        };
                      if (p.swipe) {
                        var f = function () {
                          var t = m;
                          switch (v) {
                            case "up":
                              g.trigger(n, t.SWIPE_UP, d);
                              break;
                            case "down":
                              g.trigger(n, t.SWIPE_DOWN, d);
                              break;
                            case "left":
                              g.trigger(n, t.SWIPE_LEFT, d);
                              break;
                            case "right":
                              g.trigger(n, t.SWIPE_RIGHT, d);
                          }
                        };
                        y
                          ? c.isTouchMove(t)
                            ? ((d.fingerStatus = d.swipe = "move"),
                              g.trigger(n, m.SWIPING, d),
                              o > p.swipeTime &&
                                o < p.swipeTime + 50 &&
                                i > p.swipeMinDistance &&
                                (f(), g.trigger(n, m.SWIPE, d, !1)))
                            : (c.isTouchEnd(t) || "mouseout" === t.type) &&
                              ((d.fingerStatus = d.swipe = "end"),
                              g.trigger(n, m.SWIPE_END, d),
                              p.swipeTime > o &&
                                i > p.swipeMinDistance &&
                                (f(), g.trigger(n, m.SWIPE, d, !1)))
                          : ((d.fingerStatus = d.swipe = "start"),
                            (y = !0),
                            g.trigger(n, m.SWIPE_START, d));
                      }
                      p.drag &&
                        (w
                          ? c.isTouchMove(t)
                            ? ((d.fingerStatus = d.swipe = "move"),
                              g.trigger(n, m.DRAG, d))
                            : c.isTouchEnd(t) &&
                              ((d.fingerStatus = d.swipe = "end"),
                              g.trigger(n, m.DRAGEND, d))
                          : ((d.fingerStatus = d.swipe = "start"),
                            (w = !0),
                            g.trigger(n, m.DRAGSTART, d)));
                    }
                  },
                  tap: function (t) {
                    var n = t.target;
                    if (p.tap) {
                      var r = Date.now(),
                        o = r - b,
                        i = c.getDistance(
                          h.start[0],
                          h.move ? h.move[0] : h.start[0]
                        );
                      clearTimeout(s);
                      var a = (function () {
                        if (
                          E &&
                          p.doubleTap &&
                          b - k < p.maxDoubleTapInterval
                        ) {
                          var e = c.getDistance(E, h.start[0]);
                          if (16 > e) return !0;
                        }
                        return !1;
                      })();
                      if (a)
                        return (
                          clearTimeout(l),
                          void g.trigger(n, m.DOUBLE_TAP, {
                            type: m.DOUBLE_TAP,
                            originEvent: t,
                            position: h.start[0],
                          })
                        );
                      if (p.tapMaxDistance < i) return;
                      p.holdTime > o &&
                        c.getFingers(t) <= 1 &&
                        ((T = !0),
                        (k = r),
                        (E = h.start[0]),
                        (l = setTimeout(function () {
                          g.trigger(n, m.TAP, {
                            type: m.TAP,
                            originEvent: t,
                            fingersCount: c.getFingers(t),
                            position: E,
                          });
                        }, p.tapTime)));
                    }
                  },
                  hold: function (t) {
                    var n = t.target;
                    p.hold &&
                      (clearTimeout(s),
                      (s = setTimeout(function () {
                        if (h.start) {
                          var e = c.getDistance(
                            h.start[0],
                            h.move ? h.move[0] : h.start[0]
                          );
                          p.tapMaxDistance < e ||
                            T ||
                            g.trigger(n, "hold", {
                              type: "hold",
                              originEvent: t,
                              fingersCount: c.getFingers(t),
                              position: h.start[0],
                            });
                        }
                      }, p.holdTime)));
                  },
                },
                r = function (t) {
                  var n = t.target;
                  switch (t.type) {
                    case "touchstart":
                    case "mousedown":
                      (O = []),
                        (j = !0),
                        (!h.start || h.start.length < 2) &&
                          (h.start = c.getPosOfEvent(t)),
                        c.getFingers(t) >= 2 &&
                          (C = parseInt(
                            c.getAngle180(h.start[0], h.start[1]),
                            10
                          )),
                        (b = Date.now()),
                        (i = t),
                        (x = {});
                      var r = n.getBoundingClientRect(),
                        o = document.documentElement;
                      (x = {
                        top:
                          r.top +
                          (window.pageYOffset || o.scrollTop) -
                          (o.clientTop || 0),
                        left:
                          r.left +
                          (window.pageXOffset || o.scrollLeft) -
                          (o.clientLeft || 0),
                      }),
                        A.hold(t);
                      break;
                    case "touchmove":
                    case "mousemove":
                      if (!j || !h.start) return;
                      (h.move = c.getPosOfEvent(t)),
                        c.getFingers(t) >= 2
                          ? A.pinch(t)
                          : f
                          ? A.rotateSingleFinger(t)
                          : A.swipe(t);
                      break;
                    case "touchend":
                    case "touchcancel":
                    case "mouseup":
                    case "mouseout":
                      if (!j) return;
                      (v = t),
                        u
                          ? A.pinch(t)
                          : f
                          ? A.rotateSingleFinger(t)
                          : y
                          ? A.swipe(t)
                          : A.tap(t),
                        c.reset(),
                        (C = 0),
                        (S = 0),
                        t.touches &&
                          1 === t.touches.length &&
                          ((j = !0), (f = !0));
                  }
                },
                o = function () {
                  function s(t) {
                    c.hasTouch || (t = c.getPCevts(t)),
                      a.forEach(function (e) {
                        g.delegate(e, t, o, r[t]);
                      });
                  }
                  function l(t) {
                    c.hasTouch || (t = c.getPCevts(t)),
                      a.forEach(function (e) {
                        g.bind(e, t, r[t]);
                      });
                  }
                  var t,
                    n,
                    r,
                    o,
                    i = arguments;
                  if (i.length < 2 || i > 4) return void 0;
                  var a =
                    "string" === c.getType(i[0])
                      ? document.querySelectorAll(i[0])
                      : i[0];
                  if (
                    ((a = a.length ? Array.prototype.slice.call(a) : [a]),
                    3 === i.length && "string" === c.getType(i[1]))
                  )
                    return (
                      (t = i[1].split(" ")),
                      (n = i[2]),
                      void t.forEach(function (t) {
                        c.hasTouch || (t = c.getPCevts(t)),
                          a.forEach(function (e) {
                            g.bind(e, t, n);
                          });
                      })
                    );
                  if (3 !== i.length || "object" !== c.getType(i[1]))
                    if (2 !== i.length || "object" !== c.getType(i[1])) {
                      if (4 === i.length && "object" === c.getType(i[2]))
                        return (
                          (t = i[1].split(" ")),
                          (n = i[3]),
                          void t.forEach(function (t) {
                            c.hasTouch || (t = c.getPCevts(t)),
                              a.forEach(function (e) {
                                g.bind(e, t, n);
                              });
                          })
                        );
                      if (4 === i.length) {
                        var d = a[0];
                        return (
                          (t = i[1].split(" ")),
                          (o = i[2]),
                          (n = i[3]),
                          void t.forEach(function (e) {
                            c.hasTouch || (e = c.getPCevts(e)),
                              g.delegate(d, e, o, n);
                          })
                        );
                      }
                    } else {
                      r = i[1];
                      for (var u in r) l(u);
                    }
                  else {
                    (r = i[1]), (o = i[2]);
                    for (var h in r) s(h);
                  }
                },
                N = function () {
                  var n,
                    r,
                    o = arguments;
                  if (o.length < 1 || o.length > 4) return void 0;
                  var t =
                    "string" === c.getType(o[0])
                      ? document.querySelectorAll(o[0])
                      : o[0];
                  if (
                    ((t = t.length ? Array.prototype.slice.call(t) : [t]),
                    1 === o.length || 2 === o.length)
                  )
                    return void t.forEach(function (t) {
                      (n = o[1] ? o[1].split(" ") : Object.keys(t.listeners)),
                        n.length &&
                          n.forEach(function (e) {
                            c.hasTouch || (e = c.getPCevts(e)),
                              g.unbind(t, e),
                              g.undelegate(t, e);
                          });
                    });
                  if (3 === o.length && "function" === c.getType(o[2]))
                    return (
                      (r = o[2]),
                      void t.forEach(function (t) {
                        (n = o[1].split(" ")),
                          n.forEach(function (e) {
                            c.hasTouch || (e = c.getPCevts(e)),
                              g.unbind(t, e, r);
                          });
                      })
                    );
                  if (3 === o.length && "string" === c.getType(o[2])) {
                    var i = o[2];
                    return void t.forEach(function (t) {
                      (n = o[1].split(" ")),
                        n.forEach(function (e) {
                          c.hasTouch || (e = c.getPCevts(e)),
                            g.undelegate(t, e, i);
                        });
                    });
                  }
                  return 4 === o.length
                    ? ((r = o[3]),
                      void t.forEach(function (t) {
                        (n = o[1].split(" ")),
                          n.forEach(function (e) {
                            c.hasTouch || (e = c.getPCevts(e)),
                              g.undelegate(t, e, i, r);
                          });
                      }))
                    : void 0;
                },
                L = function (t, n, r) {
                  var o = arguments;
                  c.hasTouch || (n = c.getPCevts(n));
                  var i =
                    "string" === c.getType(o[0])
                      ? document.querySelectorAll(o[0])
                      : o[0];
                  (i = i.length ? Array.prototype.call(i) : [i]),
                    i.forEach(function (e) {
                      g.trigger(e, n, r);
                    });
                };
              a();
              var R = {};
              return (
                (R.on = R.bind = R.live = o),
                (R.off = R.unbind = R.die = N),
                (R.config = p),
                (R.trigger = L),
                R
              );
            })
              ? r.call(t, n, t, e)
              : r) || (e.exports = r);
      },
      365: function (e, t, n) {
        function o(e) {
          (window.doubletap && !window.ariaHold) ||
            (e.preventDefault(), e.stopPropagation());
        }
        var r = n(5014);
        e.exports = {
          start: function () {
            r.on(document, "touchend", "*", o);
          },
          end: function () {
            r.off(document, "touchend", "*", o);
          },
        };
      },
      9722: function (e, t, n) {
        function o() {
          (window.doubletap = !1),
            (window.canRead = !0),
            (window.startSwipe = !0),
            (window.ariaHold = !1);
        }
        var r = n(5014);
        e.exports = {
          start: function () {
            r.on(document, "touchstart", "*", o);
          },
          end: function () {
            r.off(document, "touchstart", "*", o);
          },
        };
      },
      1771: function (e, t, n) {
        var r = n(9228),
          o = n(954);
        e.exports = {
          getRole: function (e) {
            if (0 !== e.nodeList.length) {
              var t = e.attr("role");
              return (
                e.hasClass("alert") && (t = "alert"),
                e.hasClass("nav") && (t = "navigation"),
                e.hasClass("alertdialog") && (t = "alertdialog"),
                e.hasClass("log") && (t = "log"),
                e.hasClass("menu") && (t = "menu"),
                e.hasClass("menubar") && (t = "menubar"),
                e.hasClass("menuitem") && (t = "menuitem"),
                e.hasClass("row") && (t = "row"),
                e.hasClass("separator") && (t = "separator"),
                e.hasClass("slider") && (t = "slider"),
                e.hasClass("spinbutton") && (t = "spinbutton"),
                e.hasClass("tab") && (t = "tab"),
                e.hasClass("tablist") && (t = "tablist"),
                e.hasClass("tabpanel") && (t = "tabpanel"),
                e.hasClass("timer") && (t = "timer"),
                e.hasClass("toolbar") && (t = "toolbar"),
                e.hasClass("tooltip") && (t = "tooltip"),
                e.hasClass("tree") && (t = "tree"),
                e.hasClass("treeitem") && (t = "treeitem"),
                (t =
                  (t =
                    (t = e.hasClass("button") ? "button" : t) && 0 !== t.length
                      ? t
                      : e.firstNode.type ||
                        e.firstNode.nodeName.toLowerCase()) &&
                  -1 < [].indexOf.call(r.HtmlElemRoles.heading, t)
                    ? "heading"
                    : t)
              );
            }
          },
          getRoleText: function (e) {
            var t = e.aria.role,
              n = e.aria.nodeName;
            return e.aria.role
              ? (n && "textbox" === t && (t = n),
                (n = o.settings.getText(e.aria.role)),
                "heading" === t && e.aria.level && (n += e.aria.level),
                n)
              : "";
          },
        };
      },
      2491: function (e, t, n) {
        function s(e) {
          return (
            e.labelledbyText ||
            e.label ||
            e.describedbyText ||
            e.labelWrapperText ||
            e.labelforText ||
            e.toolTipText ||
            e.placeholder ||
            e.title ||
            e.alt ||
            ""
          );
        }
        function a(e) {
          var t = "";
          return e.atomicText
            ? (t += "," + e.atomicText)
            : e.label || e.title || e.alt || e.toolTipText
            ? ""
            : (e.valueText
                ? (t += "," + e.valueText)
                : e.value
                ? (t += "," + o.curvalue + e.value)
                : e.text && (t += "," + e.text),
              e.valueminText && (t += "," + o.min + e.valueminText),
              e.valuemaxText && (t += "," + o.max + e.valuemaxText),
              t);
        }
        function l(e, t) {
          var n = "";
          return (n = void 0 !== t ? (t ? "," + o[e] : "," + o["un" + e]) : n);
        }
        function u(e, t) {
          var n = "";
          return (n = t ? "," + o[e] : n);
        }
        var o,
          i = n(9228),
          c = n(954);
        e.exports = {
          lastDesc: function (e) {
            var t = "",
              n = e.aria;
            if (((o = o || c.settings.Language), !n || n.busy)) return null;
            (t += u("readonly", n.readonly)),
              (t += u("multiselectable", n.multiselectable)),
              (t += u("multiLine", n.multiLine)),
              (t += u("haspopup", n.haspopup)),
              n.multiple && (t += o.multiple),
              n.isregion && (t += o["regiontype" + e.ariaAttr("regiontype")]),
              n.roleText && (t += n.roleText);
            var r = s(n);
            return (
              "" != r ||
                !n.isregion ||
                (0 <
                  (e = e.find("h1,h2,h3,h4,h5,h6,title,.title,title")).length &&
                  (r = e.aria.text)),
              (t += "," + r),
              n.isregion ||
                ((t += "," + a(n)),
                (t +=
                  "," +
                  (function (e) {
                    var t = "";
                    return (
                      (t += u("disabled", e.disabled)),
                      (t += l("checked", e.checked)),
                      (t += l("expanded", e.expanded)),
                      0 < (t += l("selected", e.selected)).length &&
                        (t = o.curstatus + t),
                      t
                    );
                  })(n))),
              n.described && (t += "," + n.described),
              (t = i.formatStrToRead(t, !0))
            );
          },
          descText: s,
          mainText: a,
        };
      },
      998: function (e, t, n) {
        var i = n(8057),
          r = n(9228);
        e.exports = {
          getText: function (e, t) {
            return null !== t && -1 < [].indexOf.call(r.HtmlElemRoles.select, t)
              ? (function (e) {
                  var t = [];
                  if ("SELECT" === e.nodeName) {
                    for (var n = 0; n < e.length; n++)
                      e.options[n].selected && t.push(e[n].text);
                    return 0 === t.length ? void 0 : 1 === t.length ? t[0] : t;
                  }
                  var r = new i(e);
                  if (
                    "select" !== r.aria.nodeName &&
                    "select" === r.aria.role
                  ) {
                    var o = e.getAttribute("aria-controls");
                    if (o)
                      return (
                        (r = o.substring(0, 1)),
                        [].indexOf.call(["#", "."], r) < 0 && (o = "#" + o),
                        (t = document.querySelector(o)
                          ? document.querySelector(o).textContent
                          : t)
                      );
                  }
                })(e)
              : e.textContent || e.value;
          },
        };
      },
      4152: function (e) {
        function r(e, o) {
          return (function e(t) {
            for (var n = 0; n < t.length; n++) {
              var r = t.nodeList[n];
              if ((r = new o(r)).aria.focusable && !r.aria.hidden) return r;
              if (0 < (r = new o(r.child())).length) return e(r);
            }
          })((e = "BODY" == e.firstNode.nodeName ? new o(e.child()) : e));
        }
        function o(e, o) {
          return (function e(t) {
            for (var n = t.length - 1; n >= 0; n--) {
              var r = t.nodeList[n];
              if ((r = new o(r)).aria.focusable && !r.aria.hidden) return r;
              if (0 < (r = new o(r.child())).length) return e(r);
            }
          })((e = "BODY" == e.firstNode.nodeName ? new o(e.child()) : e));
        }
        e.exports = {
          nextFocus1: function e(t, n) {
            return "BODY" == (t = t.jTool ? t : new n(t)).firstNode.nodeName
              ? r(t, n)
              : ((t = new n(t.firstNode).nextNode()),
                (t = new n(t)),
                t && t.aria && t.aria.focusable && !t.aria.hidden
                  ? t
                  : e(t, n));
          },
          preFocus1: function e(t, n) {
            return "BODY" == (t = t.jTool ? t : new n(t)).firstNode.nodeName
              ? o(t, n)
              : ((t = new n(t.firstNode).preNode()),
                (t = new n(t)),
                t && t.aria && t.aria.focusable && !t.aria.hidden
                  ? t
                  : e(t, n));
          },
          firstFocus1: r,
          lastFocus1: o,
        };
      },
      7156: function (e, t, n) {
        var r,
          o = n(9228),
          i = n(954);
        e.exports = function (e) {
          var t = "";
          return (
            (r = r || i.settings.Language),
            -1 < [].indexOf.call(o.HtmlElemRoles.select, e.aria.role)
              ? void 0 !== (t = o.reMoveHtml(e.text())) && 0 < t.length
                ? r.selectedelem + t
                : r.unselectedelem
              : ((t = e.attr("aria-valuetext") || e.html()), o.reMoveHtml(t))
          );
        };
      },
      9489: function (e, t, n) {
        var l = n(9228),
          u = n(3655),
          n = {
            visibility: function () {
              l.each(this.nodeList, function (e, t) {
                t.style.visibility = "visible";
              });
            },
            unvisibility: function () {
              l.each(this.nodeList, function (e, t) {
                t.style.visibility = "hidden";
              });
            },
            show: function () {
              return (
                l.each(this.nodeList, function (e, t) {
                  var n = "";
                  if (-1 !== t.nodeName.indexOf(["SPAN", "A", "FONT", "I"]))
                    return (
                      t.style.visibility && (t.style.visibility = "visible"),
                      (t.style.display = "inline-block"),
                      this
                    );
                  switch (t.nodeName) {
                    case "TABLE":
                      n = "table";
                      break;
                    case "THEAD":
                      n = "table-header-group";
                      break;
                    case "TBODY":
                      n = "table-row-group";
                      break;
                    case "TR":
                      n = "table-row";
                      break;
                    case "TH":
                    case "TD":
                      n = "table-cell";
                      break;
                    default:
                      n = "block";
                  }
                  t.style.visibility && (t.style.visibility = "visible"),
                    (t.style.display = n);
                }),
                this
              );
            },
            hide: function () {
              return (
                l.each(this.nodeList, function (e, t) {
                  t.style.visibility && (t.style.visibility = "hidden"),
                    (t.style.display = "none");
                }),
                this
              );
            },
            animate: function (e, t, n) {
              var r,
                o,
                i = this,
                a = "",
                s = "",
                c = i.nodeList[0];
              e &&
                ("undefined" === l.type(n) &&
                  "function" === l.type(t) &&
                  ((n = t), (t = 0)),
                "undefined" === l.type(n) && (n = l.noop),
                "undefined" === l.type(t) && (t = 0),
                l.each(e, function (e, t) {
                  (a += e + ":" + l.getStyle(c, e) + ";"),
                    (s += e + ":" + t + ";");
                }),
                (r =
                  "@keyframes jToolAnimate {from {" + a + "}to {" + s + "}}"),
                ((o = document.createElement("style")).className =
                  "jTool-animate-style"),
                (o.type = "text/css"),
                document.head.appendChild(o),
                (o.textContent = o.textContent + r),
                (c.style.animation =
                  "jToolAnimate " + t / 1e3 + "s ease-in-out forwards"),
                window.setTimeout(function () {
                  u.css.call(i, e),
                    (c.style.animation = ""),
                    document.head.removeChild(o),
                    n();
                }, t));
            },
          };
        e.exports = n;
      },
      6981: function (e, t, n) {
        var o = n(9228);
        e.exports = {
          addClass: function (e) {
            return this.changeClass(e, "add");
          },
          removeClass: function (e) {
            return this.changeClass(e, "remove");
          },
          toggleClass: function (e) {
            return this.changeClass(e, "toggle");
          },
          hasClass: function (e) {
            var t = this.firstNode;
            return !!t && t.classList.contains(e);
          },
          parseClassName: function (e) {
            return e.indexOf(" ") ? e.split(" ") : [e];
          },
          changeClass: function (e, r) {
            var t = this.parseClassName(e);
            return (
              o.each(this.nodeList, function (e, n) {
                o.each(t, function (e, t) {
                  try {
                    n.classList[r](t);
                  } catch (e) {}
                });
              }),
              this
            );
          },
        };
      },
      3655: function (e, t, n) {
        var s = n(9228),
          n = {
            css: function (e, t) {
              function a(n, r) {
                (n = n.replace(/[A-Z]/g, function (e) {
                  return "-" + e.toLowerCase();
                })),
                  "number" === s.type(r) && (r = r.toString() + "px"),
                  -1 !== i.indexOf(n) && -1 === r.indexOf("px") && (r += "px"),
                  s.each(o.nodeList, function (e, t) {
                    t.style[n] = r;
                  });
              }
              var o = this;
              if (0 != o.length) {
                var i = [
                  "width",
                  "height",
                  "min-width",
                  "max-width",
                  "min-height",
                  "min-height",
                  "top",
                  "left",
                  "right",
                  "bottom",
                  "padding-top",
                  "padding-right",
                  "padding-bottom",
                  "padding-left",
                  "font-size",
                  "margin-top",
                  "margin-right",
                  "margin-bottom",
                  "margin-left",
                  "border-width",
                  "border-top-width",
                  "border-left-width",
                  "border-right-width",
                  "border-bottom-width",
                ];
                if ("string" === s.type(e) && !t && 0 !== t)
                  return -1 !== i.indexOf(e)
                    ? parseInt(s.getStyle(this.firstNode, e), 10)
                    : s.getStyle(this.firstNode, e);
                if ("object" === s.type(e)) {
                  var n,
                    r = e;
                  for (n in r) a(n, r[n]);
                } else a(e, t);
                return this;
              }
            },
            width: function (e) {
              return this.css("width", e);
            },
            height: function (e) {
              return this.css("height", e);
            },
          };
        e.exports = n;
      },
      5924: function (e, t, n) {
        var o = n(9228),
          n = {
            data: function (e, t) {
              return (
                "data-" !== (e = e.toLowerCase()).substr(0, 5) &&
                  (e = "data-" + e),
                this.attr(e, t)
              );
            },
            removeData: function (e) {
              "data-" !== (e = e.toLowerCase()).substr(0, 5) &&
                (e = "data-" + e),
                this.removeAttr(e);
            },
            ariaAttr: function (e, t) {
              return (
                "aria-" !== (e = e.toLowerCase()).substr(0, 5) &&
                  (e = "aria-" + e),
                this.attr(e, t)
              );
            },
            removeAriaAttr: function (e) {
              "aria-" !== (e = e.toLowerCase()).substr(0, 5) &&
                (e = "aria-" + e),
                this.removeAttr(e);
            },
            attr: function (n, r) {
              return 0 !== this.nodeList.length
                ? void 0 === n && void 0 === r
                  ? null
                  : void 0 !== r
                  ? (o.each(this.nodeList, function (e, t) {
                      t.setAttribute(n, r);
                    }),
                    this)
                  : this.transformValue(this.firstNode.getAttribute(n))
                : void 0;
            },
            removeAttr: function (n) {
              void 0 !== n &&
                o.each(this.nodeList, function (e, t) {
                  t.removeAttribute(n);
                });
            },
            prop: function (n, r) {
              return 0 !== this.nodeList.length
                ? void 0 === n && void 0 === r
                  ? null
                  : void 0 !== r
                  ? (o.each(this.nodeList, function (e, t) {
                      t[n] = r;
                    }),
                    this)
                  : this.transformValue(this.firstNode[n])
                : void 0;
            },
            removeProp: function (n) {
              void 0 !== n &&
                o.each(this.nodeList, function (e, t) {
                  delete t[n];
                });
            },
            val: function (e) {
              return this.prop("value", e) || null;
            },
            transformValue: function (e) {
              return (e = "null" === o.type(e) ? void 0 : e);
            },
          };
        e.exports = n;
      },
      3284: function (e, t, n) {
        var a = n(9228),
          s = n(8057),
          i = n(998),
          n = {
            append: function (e) {
              return this.html(e, "append");
            },
            prepend: function (e) {
              return this.html(e, "prepend");
            },
            before: function (e) {
              e.jTool && (e = e.nodeList[0]);
              var t = this.firstNode;
              return t.parentNode.insertBefore(e, t), this;
            },
            after: function (e) {
              var n;
              (e = "string" == typeof e ? new s(e) : e).jTool &&
                ((n = this.firstNode.parentNode),
                a.each(e.nodeList, function (e, t) {
                  n.appendChild(t);
                }));
            },
            text: function (n) {
              return 0 !== this.nodeList.length
                ? void 0 !== n
                  ? (a.each(this.nodeList, function (e, t) {
                      t.textContent = n;
                    }),
                    this)
                  : i.getText(
                      this.firstNode,
                      this.aria ? this.aria.role : this.nodeName.toLowerCase()
                    )
                : void 0;
            },
            html: function (t, r) {
              if (0 !== this.nodeList.length) {
                if (this.firstNode && void 0 === t && void 0 === r)
                  try {
                    return this.firstNode.innerHTML;
                  } catch (e) {
                    return;
                  }
                var o,
                  e = a.type(t);
                return (
                  t.jTool
                    ? (t = t.nodeList)
                    : "string" === e
                    ? (t = a.createDOM(t || ""))
                    : "number" === e
                    ? (t = a.createDOM(t.toString() || ""))
                    : "element" === e && (t = [t]),
                  a.each(this.nodeList, function (e, n) {
                    r
                      ? "prepend" === r && (o = n.firstChild)
                      : (n.innerHTML = ""),
                      a.each(t, function (e, t) {
                        (t = t.cloneNode(!0)).nodeType ||
                          (t = document.createTextNode(t)),
                          o ? n.insertBefore(t, o) : n.appendChild(t),
                          n.normalize();
                      });
                  }),
                  this
                );
              }
            },
            wrap: function (r, o) {
              var i;
              return (
                a.each(this.nodeList, function (e, t) {
                  i = t.parentNode;
                  var n = new s(r, t.ownerDocument).get(0);
                  i.insertBefore(n, t),
                    n.querySelector(o ? o : ":empty").appendChild(t);
                }),
                this
              );
            },
            closest: function (e) {
              if (0 !== this.nodeList.length) {
                var t = this.firstNode.parentNode;
                if (void 0 === e) return new s(t);
                var n = document.querySelectorAll(e);
                return (
                  (function e() {
                    t && 0 !== n.length && 1 === t.nodeType
                      ? -1 === [].indexOf.call(n, t) &&
                        ((t = t.parentNode), e())
                      : (t = null);
                  })(),
                  new s(t)
                );
              }
            },
            parent: function () {
              return this.closest();
            },
            clone: function (e) {
              return new s(this.firstNode.cloneNode(e || !1));
            },
            remove: function () {
              a.each(this.nodeList, function (e, t) {
                t.parentNode.removeChild(t);
              });
            },
            textAll: function (e) {
              if (0 !== this.nodeList.length) {
                var t = "",
                  t = (function r(e) {
                    var e = e.childNodes,
                      o = "";
                    return (
                      a.each(e, function (e, t) {
                        var n;
                        t.childNodes && 0 < t.childNodes.length
                          ? ((n = (n =
                              t.getAttribute("role") ||
                              t.nodeName).toLowerCase()),
                            (o +=
                              -1 < [].indexOf.call(a.HtmlElemRoles.select, n)
                                ? "," + i.getText(t, n)
                                : "," + r(t)))
                          : (t = (function (e) {
                              var t = e.nodeType;
                              if (
                                1 == t &&
                                "checkbox" == e.type &&
                                "on" == e.value
                              )
                                return "";
                              var n = "";
                              switch (t) {
                                case 1:
                                  n = e.textContent || e.value;
                                  break;
                                case 3:
                                  n = e.nodeValue.trim();
                              }
                              return n;
                            })(t)) && (o += "," + t);
                      }),
                      o
                    );
                  })(this.firstNode);
                return (t = e ? a.formatStrToRead(t, e) : t);
              }
            },
          };
        e.exports = n;
      },
      3873: function (e, t, n) {
        var a = n(8057),
          s = n(9228),
          n = {
            focus: function () {
              this.jTool && this.firstNode && this.firstNode.focus();
            },
            blur: function () {
              this.jTool && this.firstNode && this.firstNode.blur();
            },
            next: function () {
              if (0 != this.length) {
                var e,
                  t = this.firstNode;
                return null != (e = t.nextElementSibling)
                  ? -1 <
                    [].indexOf.call(["HEAD", "STYLE", "SCRIPT"], e.nodeName)
                    ? new a(e).next()
                    : 1 === e.nodeType
                    ? e
                    : void 0
                  : null == t.parentNode &&
                    t.defaultView &&
                    t.defaultView.frameElement
                  ? new a(t.defaultView.frameElement).next()
                  : null != t.parentNode
                  ? new a(t.parentNode).next()
                  : void 0;
              }
            },
            pre: function () {
              if (0 != this.length) {
                var e,
                  t = this.firstNode;
                return null != (e = t.previousElementSibling)
                  ? -1 <
                    [].indexOf.call(["HEAD", "STYLE", "SCRIPT"], e.nodeName)
                    ? new a(e).pre()
                    : 1 === e.nodeType
                    ? e
                    : void 0
                  : null == t.parentNode &&
                    t.defaultView &&
                    t.defaultView.frameElement
                  ? new a(t.defaultView.frameElement).pre()
                  : null != t.parentNode
                  ? new a(t.parentNode).pre()
                  : void 0;
              }
            },
            nextAll: function () {
              if (0 != this.length) {
                for (var e = this.firstNode, t = next(e), n = []; null != t; )
                  n.push(t), (t = next(t));
                return n;
              }
            },
            preAll: function () {
              if (0 != this.length) {
                for (var e = this.firstNode, t = pre(e), n = []; null != t; )
                  n.push(t), (t = pre(t));
                return n;
              }
            },
            get: function (e) {
              return this.nodeList[e];
            },
            is: function (e) {
              return e && 0 !== this.length
                ? (0 === e.indexOf(":") && (e = e.subStr(1, e.length)),
                  this.firstNode[e])
                : void 0;
            },
            eq: function (e) {
              return new a(this.nodeList[e]);
            },
            first: function () {
              return this.firstNode;
            },
            last: function () {
              return this.nodeList[this.nodeList.length - 1];
            },
            child: function () {
              var e = this.firstNode.childNodes,
                n = [];
              return (
                s.each(e, function (e, t) {
                  1 === t.nodeType && n.push(t);
                }),
                n
              );
            },
            find: function (r) {
              if (r instanceof HTMLElement) {
                var o,
                  e = r.getAttribute("id");
                return e
                  ? new a(e, this)
                  : ((function n(e) {
                      s.each(e, function (e, t) {
                        t == r
                          ? (o = new a(r))
                          : o || ((t = new a(t).child()), n(t));
                      });
                    })(this),
                    (o = o || new a()));
              }
              return new a(r, this);
            },
            isHidden: function () {
              return (
                "none" === this.css("display") ||
                "hidden" === this.css("visibility") ||
                "hidden" === this.attr("type")
              );
            },
            index: function (e) {
              var t = this.firstNode;
              return (
                e
                  ? e.jTool && (e = e.nodeList)
                  : (e = this.parent().child().nodeList),
                e ? [].indexOf.call(e, t) : -1
              );
            },
            nextNode: function () {
              var e = this.next();
              if ((e = e || this.parent().next())) {
                "IFRAME" == e.nodeName && (e = e.contentDocument);
                var t = new a(e).child();
                return 0 == t
                  ? e
                  : (function e(t) {
                      for (i = 0; i < t.length; i++) {
                        var n = new a(t[i]).child();
                        return 0 == n.length ? t[i] : e(n);
                      }
                    })(t);
              }
            },
            preNode: function () {
              var e = this.pre();
              if ((e = e || this.parent().pre())) {
                "IFRAME" == e.nodeName && (e = e.contentDocument);
                var t = new a(e).child();
                return 0 == t
                  ? e
                  : (function e(t) {
                      for (i = t.length - 1; i >= 0; i--) {
                        var n = new a(t[i]).child();
                        return 0 == n.length ? t[i] : e(n);
                      }
                    })(t);
              }
            },
          };
        e.exports = n;
      },
      5538: function (e, t, n) {
        var a = n(9228),
          n = {
            dblclick: function (e, t, n) {
              return this.on("dblclick", e, t, n);
            },
            click: function (e, t, n) {
              return e ? this.on("click", e, t, n) : this.trigger("click");
            },
            mousemove: function (e, t, n) {
              return this.on("mousemove", e, t, n);
            },
            mousedown: function (e, t, n) {
              return this.on("mousedown", e, t, n);
            },
            touchstart: function (e, t, n) {
              return this.on("touchstart", e, t, n);
            },
            touchend: function (e, t, n) {
              return this.on("touchend", e, t, n);
            },
            touchmove: function (e, t, n) {
              return this.on("touchmove", e, t, n);
            },
            change: function (e, t, n) {
              return this.on("change", e, t, n);
            },
            on: function (e, t, n, r) {
              return this.addEvent(this.getEventObject(e, t, n, r));
            },
            off: function (e, t) {
              return this.removeEvent(this.getEventObject(e, t));
            },
            bind: function (e, t, n) {
              return this.on(e, void 0, t, n);
            },
            unbind: function (e) {
              return this.removeEvent(this.getEventObject(e));
            },
            trigger: function (r) {
              return (
                a.each(this.nodeList, function (e, t) {
                  try {
                    var n;
                    t.qToolEvent &&
                    t.qToolEvent[r] &&
                    0 < t.qToolEvent[r].length
                      ? ((n = new Event(r)), t.dispatchEvent(n))
                      : "click" !== r || ("click" === r && t[r]());
                  } catch (e) {}
                }),
                this
              );
            },
            getEventObject: function (e, n, r, o) {
              if (
                ("function" == typeof n &&
                  ((o = r || !1), (r = n), (n = void 0)),
                !e)
              )
                return this;
              var i;
              "" !== (n = n && "element" === a.type(this.firstNode) ? n : "") &&
                ((i = r),
                (r = function (e) {
                  for (var t = e.target; t && t !== this; ) {
                    if (-1 !== [].indexOf.call(this.querySelectorAll(n), t)) {
                      i.apply(t, arguments);
                      break;
                    }
                    t = t.parentNode;
                  }
                }));
              var c,
                e = e.split(" "),
                s = [];
              return (
                a.each(e, function (e, t) {
                  return (
                    "" === t.trim() ||
                    ((c = t.split(".")),
                    (c = {
                      eventName: t + n,
                      type: c[0],
                      querySelector: n,
                      callback: r || a.noop,
                      useCapture: o || !1,
                      nameScope: c[1] || void 0,
                    }),
                    void s.push(c))
                  );
                }),
                s
              );
            },
            addEvent: function (e) {
              var t = this;
              return (
                a.each(e, function (e, n) {
                  a.each(t.nodeList, function (e, t) {
                    (t.qToolEvent = t.qToolEvent || {}),
                      (t.qToolEvent[n.eventName] =
                        t.qToolEvent[n.eventName] || []),
                      t.qToolEvent[n.eventName].push(n),
                      a.addEventListener(t, n.type, n.callback, n.useCapture);
                  });
                }),
                t
              );
            },
            removeEvent: function (e) {
              var r,
                n = this;
              return (
                a.each(e, function (e, t) {
                  a.each(n.nodeList, function (e, n) {
                    n.qToolEvent &&
                      (r = n.qToolEvent[t.eventName]) &&
                      (a.each(r, function (e, t) {
                        n.removeEventListener(t.type, t.callback);
                      }),
                      delete n.qToolEvent[t.eventName]);
                  });
                }),
                n
              );
            },
          };
        e.exports = n;
      },
      3068: function (e, t, n) {
        var r = n(9228);
        e.exports = {
          offset: function () {
            var e = { top: 0, left: 0 },
              t = this.firstNode;
            return t.getClientRects().length
              ? "none" === r.getStyle(t, "display")
                ? e
                : ((e = t.getBoundingClientRect()),
                  (t = t.ownerDocument.documentElement),
                  {
                    top: e.top + window.pageYOffset - t.clientTop,
                    left: e.left + window.pageXOffset - t.clientLeft,
                  })
              : e;
          },
          scrollTop: function (e) {
            return this.scrollFN(e, "top");
          },
          scrollLeft: function (e) {
            return this.scrollFN(e, "left");
          },
          scrollFN: function (e, t) {
            var n = this.firstNode;
            return e || 0 === e
              ? (this.setScrollFN(n, t, e), this)
              : this.getScrollFN(n, t);
          },
          getScrollFN: function (e, t) {
            return r.isWindow(e)
              ? "top" === t
                ? e.pageYOffset
                : e.pageXOffset
              : 9 === e.nodeType
              ? "top" === t
                ? e.body.scrollTop
                : e.body.scrollLeft
              : 1 === e.nodeType
              ? "top" === t
                ? e.scrollTop
                : e.scrollLeft
              : void 0;
          },
          setScrollFN: function (e, t, n) {
            return r.isWindow(e)
              ? "top" === t
                ? (e.document.body.scrollTop = n)
                : (e.document.body.scrollLeft = n)
              : 9 === e.nodeType
              ? "top" === t
                ? (e.body.scrollTop = n)
                : (e.body.scrollLeft = n)
              : 1 === e.nodeType
              ? "top" === t
                ? (e.scrollTop = n)
                : (e.scrollLeft = n)
              : void 0;
          },
        };
      },
      8057: function (e, t, n) {
        var o = n(8690),
          i = n(9228),
          a = n(2392),
          n = function e(n, t) {
            var r;
            if (n)
              if (i.isWindow(n)) (r = [n]), (t = void 0);
              else if (n === document) (r = [document]), (t = void 0);
              else if (n instanceof HTMLElement) (r = [n]), (t = void 0);
              else if (n instanceof NodeList || n instanceof Array)
                (r = n), (t = void 0);
              else if (n.jTool) (r = n.nodeList), (t = void 0);
              else if (/<.+>/.test(n)) (r = i.createDOM(n)), (t = void 0);
              else {
                if (t)
                  "string" == typeof t
                    ? (t = document.querySelectorAll(t))
                    : t instanceof HTMLElement
                    ? (t = [t])
                    : t instanceof NodeList ||
                      (t.jTool
                        ? (t = t.nodeList)
                        : "document" == i.type(t) || (t = void 0));
                else
                  try {
                    r = document.querySelectorAll(n);
                  } catch (e) {
                    (r = [n]), (t = void 0);
                  }
                if (t)
                  if (((r = []), "document" == i.type(t)))
                    try {
                      r = t.querySelectorAll(n);
                    } catch (e) {}
                  else
                    i.each(t, function (e, t) {
                      i.each(t.querySelectorAll(n), function (e, t) {
                        t && r.push(t);
                      });
                    });
              }
            else n = null;
            return (
              (r && 0 !== r.length) || (r = []),
              (this.jTool = !0),
              (this.context = t || document),
              (this.nodeList = r),
              (this.length = this.nodeList ? this.nodeList.length : 0),
              (this.querySelector = n),
              (e.prototype.extend = a),
              e.prototype.extend(r),
              0 < this.length
                ? ((this.aria = o(this, e)),
                  (this.firstNode = this.nodeList[0]))
                : ((this.aria = null), (this.firstNode = null)),
              this
            );
          };
        e.exports = n;
      },
      9724: function (e) {
        function o(e) {
          return (o =
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
                })(e);
        }
        function i(e) {
          if (null === e) return "null";
          if (e != e) return "nan";
          if ("function" == typeof Array.isArray) {
            if (Array.isArray(e)) return "array";
          } else if ("[object Array]" === Object.prototype.toString.call(e))
            return "array";
          return o(e).toLowerCase();
        }
        function t() {
          this.name = "Store";
        }
        t.prototype = {
          init: function (e) {
            return (this.store = window[e]), this;
          },
          set: function (e, t) {
            if (null != (e = "object" === o(e) ? e.root : e)) {
              var n = e.split("/"),
                r = (r = this.get(n[0])) || {};
              switch (
                i(
                  (r =
                    1 < n.length
                      ? (function e(t, n, r, o) {
                          return (
                            (t = t || {})[n[o]] || (t[n[o]] = {}),
                            o >= n.length - 1
                              ? void 0 === r
                                ? delete t[n[o]]
                                : (t[n[o]] = r)
                              : e(t[n[o]], n, r, o + 1),
                            t
                          );
                        })(r, n, t, 1)
                      : r)
                )
              ) {
                case "object":
                case "array":
                  this.store.setItem(n[0], JSON.stringify(r));
                  break;
                default:
                  this.store.setItem(n[0], r);
              }
            }
          },
          get: function (e) {
            return (
              (e = e.split("/")),
              (function e(t, n, r) {
                if (null === t) return null;
                try {
                  t = "number" === i(+t) ? t : JSON.parse(t);
                } catch (e) {}
                return 1 === n.length
                  ? t
                  : ("object" === o(t) && (t = t[n[r]]),
                    (r += 1) > n.length - 1 ? t : e(t, n, r));
              })(this.store.getItem(e[0]), e, 1)
            );
          },
          getAll: function () {
            var e,
              t = JSON.parse(JSON.stringify(this.store)),
              n = {},
              r = "";
            for (e in t) {
              try {
                r = "number" === i(+(r = t[e])) ? r : JSON.parse(r);
              } catch (e) {}
              n[e] = r;
            }
            return n;
          },
          remove: function (e) {
            this.store.removeItem(e);
          },
          clear: function () {
            this.store.clear();
          },
        };
        var n = new t().init("localStorage");
        new t().init("sessionStorage"), (e.exports = n);
      },
      9438: function (e, t, n) {
        function a(e) {
          return (a =
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
                })(e);
        }
        function o(i) {
          var e = {
            url: null,
            type: "GET",
            data: null,
            headers: {},
            async: !0,
            xhrFields: {},
            beforeSend: c.noop,
            complete: c.noop,
            success: c.noop,
            error: c.noop,
          };
          if ((i = r(e, i)).url) {
            i.data = i.data || {};
            var a = new XMLHttpRequest(),
              s = new Promise(function (e, t) {
                var n,
                  r,
                  o = "";
                for (r in ("GET" === i.type.toUpperCase() &&
                  ((n = ""),
                  (o =
                    "object" === c.type(i.data)
                      ? (c.each(i.data, function (e, t) {
                          void 0 !== t &&
                            ("" !== n && (n += "&"), (n += e + "=" + t));
                        }),
                        n)
                      : i.data) &&
                    (i.url =
                      i.url + (-1 === i.url.indexOf("?") ? "?" : "&") + o),
                  (o = null)),
                a.open(i.type, i.url, i.async),
                i.xhrFields))
                  a[r] = i.xhrFields[r];
                "POST" === i.type.toUpperCase() &&
                  (a.setRequestHeader(
                    "Content-Type",
                    "application/json;charset=utf-8"
                  ),
                  (o = JSON.stringify(i.data))),
                  i.beforeSend(a),
                  a.responseType || (a.responseType = "json"),
                  a.send(o),
                  i.async
                    ? ((a.onload = function () {
                        200 === a.status
                          ? (s.done &&
                              "function" == typeof s.done &&
                              s.done(
                                a.responseJSON || a.response || a.responseText
                              ),
                            i.success && i.success(a.response, a.status),
                            e &&
                              "function" == typeof e &&
                              e(a.response || a.responseText))
                          : t && "function" == typeof t && t(a, a.status);
                      }),
                      (a.onerror = function () {
                        i.error && i.error(a, a.status),
                          t && "function" == typeof t && t(a, a.status);
                      }))
                    : 200 === a.status
                    ? (s.done &&
                        "function" == typeof s.done &&
                        s.done(a.responseJSON || a.response || a.responseText),
                      i.success && i.success(a.response, a.status),
                      e(a.response || a.responseText))
                    : (i.error && i.error(a, a.status),
                      t && "function" == typeof t && t(a, a.status));
              });
            return s;
          }
        }
        var r = n(2392),
          c = n(9228);
        e.exports = {
          ajax: o,
          post: function (e, t, n) {
            return o({ url: e, type: "POST", data: t, success: n });
          },
          get: function (e, t, n) {
            return o({ url: e, type: "GET", data: t, success: n });
          },
          getText: function (e, t) {
            return o({
              url: e,
              type: "GET",
              headers: { "Content-Type": "text/html;charset:utf-8" },
              xhrFields: { responseType: "text" },
              success: t,
            });
          },
          jsonp: function (e, r) {
            var o,
              i = document.createElement("script");
            return (
              "object" === a(e) && ((e = (r = e).url), delete r.url),
              (e =
                e +
                (0 < e.indexOf("?") ? "&" : "?") +
                (function (e) {
                  var t,
                    n = [];
                  for (t in e)
                    n.push(
                      encodeURIComponent(t) + "=" + encodeURIComponent(e[t])
                    );
                  return n.join("&");
                })(r.data)),
              new Promise(function (t, n) {
                (i.onerror = function (e) {
                  return r.error && r.error(e), n("出错了");
                }),
                  (o = ("jsonp_" + Math.random()).replace(".", "")),
                  (window[o] = function (e) {
                    return (
                      document.head.removeChild(i),
                      r.success && r.success(e),
                      t(e)
                    );
                  }),
                  (i.src =
                    e +
                    (0 <= e.indexOf("?") ? "&" : "?") +
                    (r.callback || "callback") +
                    "=" +
                    o),
                  document.head.append(i);
              })
            );
          },
        };
      },
      2392: function (e, t, n) {
        function r(e) {
          return (r =
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
                })(e);
        }
        var i = n(9228);
        e.exports = function () {
          if (0 === arguments.length) return {};
          var o = !1,
            e = 1,
            t = arguments[0];
          for (
            1 === arguments.length && "object" === r(arguments[0])
              ? ((t = this), (e = 0))
              : 2 === arguments.length && "boolean" == typeof arguments[0]
              ? ((o = arguments[0]), (t = this), (e = 1))
              : 2 < arguments.length &&
                "boolean" == typeof arguments[0] &&
                ((o = arguments[0]), (t = arguments[1] || {}), (e = 2));
            e < arguments.length;
            e++
          )
            (function e(t, n) {
              for (var r in t)
                Object.prototype.hasOwnProperty.call(t, r) &&
                  (o && "object" === i.type(t[r])
                    ? ("object" !== i.type(n[r]) && (n[r] = {}), e(t[r], n[r]))
                    : (n[r] = t[r]));
            })(arguments[e] || {}, t);
          return t;
        };
      },
      6413: function () {
        Array.from ||
          (Array.from = function (e) {
            return Array.apply(this, e);
          }),
          "function" != typeof Object.assign &&
            (Object.assign = function (e) {
              "use strict";
              if (null == e)
                throw new TypeError(
                  "Cannot convert undefined or null to object"
                );
              e = Object(e);
              for (var t = 1; t < arguments.length; t++) {
                var n = arguments[t];
                if (null != n)
                  for (var r in n)
                    Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
              }
              return e;
            }),
          "classList" in document.documentElement ||
            Object.defineProperty(HTMLElement.prototype, "classList", {
              get: function () {
                function e(r) {
                  return function (e) {
                    var t = o.className.split(/\s+/g),
                      n = t.indexOf(e);
                    r(t, n, e), (o.className = t.join(" "));
                  };
                }
                var o = this;
                return {
                  add: e(function (e, t, n) {
                    ~t || e.push(n);
                  }),
                  remove: e(function (e, t) {
                    ~t && e.splice(t, 1);
                  }),
                  toggle: e(function (e, t, n) {
                    ~t ? e.splice(t, 1) : e.push(n);
                  }),
                  contains: function (e) {
                    return !!~o.className.split(/\s+/g).indexOf(e);
                  },
                  item: function (e) {
                    return o.className.split(/\s+/g)[e] || null;
                  },
                };
              },
            });
      },
      1439: function (e, t, n) {
        var r = n(8057),
          o = n(2392),
          i = n(9228),
          a = n(9438),
          s = n(5538),
          c = n(3655),
          l = n(6981),
          u = n(3284),
          d = n(3068),
          f = n(3873),
          g = n(9489),
          h = n(5924),
          p = n(9724),
          n = function (e, t) {
            return new r(e, t);
          };
        (r.prototype = n.prototype = {}),
          (n.extend = n.prototype.extend = o),
          n.extend(i),
          n.extend(a),
          (n.store = p),
          n.prototype.extend(s),
          n.prototype.extend(c),
          n.prototype.extend(l),
          n.prototype.extend(u),
          n.prototype.extend(d),
          n.prototype.extend(f),
          n.prototype.extend(g),
          n.prototype.extend(h),
          (window.jTool = n),
          (e.exports = n);
      },
      9228: function (e, t, n) {
        function a(e) {
          return (
            o[Object.prototype.toString.call(e)] ||
            (e instanceof Element ? "element" : "")
          );
        }
        function i(e, t) {
          var n = a((e = e && e.jTool ? e.nodeList : e));
          if ("array" === n || "nodeList" === n || "arguments" === n)
            for (
              var r = Array.prototype.slice.call(e, 0, e.length), o = 0;
              o < r.length;
              o++
            ) {
              var i = r[o];
              t.call(i, o, i);
            }
          else if ("object" === n)
            for (var o in e) if (!1 === t.call(e[o], o, e[o])) break;
        }
        function s(e, t, n) {
          return e
            ? ((t = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
              e.replace(new RegExp(t, "g"), n))
            : "";
        }
        function c(e) {
          return e
            ? (e = (e = (e = (e = (e = (e = (e = (e = (e = (e = (e =
                e.toString()).replace(
                /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
                ""
              )).replace(/aria-[a-zA-z]+=\"(.*?)\"/gi, "")).replace(
                "  ",
                ""
              )).replace("  ", "")).replace("  ", "")).replace(
                /<style\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/style>/gi,
                ""
              )).replace(/ /g, "acaicaele")).replace(
                /<\/?[^>]*>|(\n|\t|\r)|(\s)/g,
                ""
              )).replace(/acaicaele/g, " ")).trim())
            : void 0;
        }
        try {
          var r = n(2702);
          window.Promise || r.polyfill(), n(6413);
        } catch (e) {}
        var o = {
          "[object String]": "string",
          "[object Boolean]": "boolean",
          "[object Undefined]": "undefined",
          "[object Number]": "number",
          "[object Object]": "object",
          "[object Error]": "error",
          "[object Function]": "function",
          "[object Date]": "date",
          "[object Array]": "array",
          "[object RegExp]": "regexp",
          "[object Null]": "null",
          "[object Arguments]": "arguments",
          "[object Window]": "window",
          "[object HTMLDocument]": "document",
          "[object NodeList]": "array",
          "[object HTMLCollection]": "array",
        };
        (r = {
          getBrowserInfo: function () {
            var e,
              t = navigator.userAgent.toLowerCase(),
              n = "",
              r = "";
            return (
              0 < t.indexOf("msie")
                ? ((n = "IE"), (r = "" + t.match(/msie [\d.]+;/gi)))
                : 0 < t.indexOf("trident")
                ? ((n = "IE"), (r = 11))
                : 0 < t.indexOf("edge")
                ? ((n = "IE"), (r = 12))
                : 0 < t.indexOf("firefox")
                ? ((n = "firefox"), (r = "" + t.match(/firefox\/[\d.]+/gi)))
                : 0 < t.indexOf("chrome")
                ? ((n = "chrome"), (r = "" + t.match(/chrome\/[\d.]+/gi)))
                : 0 < t.indexOf("safari") && t.indexOf("chrome") < 0
                ? ((n = "safari"), (r = "" + t.match(/version\/[\d.]+/gi)))
                : 0 <= t.indexOf("opera")
                ? ((n = "opera"), (r = "" + t.match(/version\/[\d.]+/gi)))
                : "Netscape" == navigator.appName &&
                  ((r = t
                    .split(";")[7]
                    .replace(/[ ]/g, "")
                    .match(/[\d\.]/g)
                    .toString()
                    .replace(/[,]/g, "")),
                  (n = "IE")),
              (e = (r + "").replace(/[^0-9.]/gi, "")),
              { browser: n, version: parseInt(e) }
            );
          },
          language: (
            navigator.browserLanguage || navigator.language
          ).toLowerCase(),
        }),
          (n = {
            toJson: function (e) {
              for (
                var t = {},
                  n = (e = e || location.search.substring(1)).split("&"),
                  r = 0;
                r < n.length;
                r++
              ) {
                var o = n[r].indexOf("=");
                if (-1 !== o) {
                  var i = n[r].substring(0, o),
                    o = n[r].substring(o + 1),
                    o = decodeURIComponent(o);
                  try {
                    t[i] = JSON.parse(o);
                  } catch (e) {
                    t[i] = o;
                  }
                }
              }
              return t;
            },
            val: function (e, t) {
              if (
                ((t = t || location.search.substring(1)),
                !new RegExp("(^|/?|&)" + e + "=([^&]*)(/s|&|$)", "i").test(t))
              )
                return "";
              try {
                return JSON.parse(RegExp.$2);
              } catch (e) {
                return RegExp.$2;
              }
            },
          }),
          (e.exports = {
            addEventListener: function (e, t, n, r) {
              if (e)
                try {
                  e.addEventListener
                    ? e.addEventListener(t, n, r)
                    : e.attachEvent("on" + t, n.bind(e));
                } catch (e) {}
            },
            removeEventListener: function (e, t, n) {
              e.removeEventListener
                ? e.removeEventListener(t, n, !1)
                : e.detachEvent("on" + t, n.bind(e));
            },
            isWindow: function (e) {
              return null !== e && e === e.window;
            },
            noop: function () {},
            type: a,
            isEmptyObject: function (e) {
              var t,
                n = !0;
              for (t in e)
                Object.prototype.hasOwnProperty.call(e, t) && (n = !1);
              return n;
            },
            each: i,
            createDOM: function (e) {
              var t = document.createElement("div");
              return (t.innerHTML = e), t.childNodes;
            },
            getStyle: function (e, t) {
              return t
                ? window.getComputedStyle(e)[t]
                : window.getComputedStyle(e);
            },
            version: "1.3.0",
            browser: r,
            genID: function (e) {
              return (
                (e = e || 4),
                "aria" +
                  Number(
                    Math.random().toString().substr(3, e) + Date.now()
                  ).toString(36)
              );
            },
            splitBylength: function (e, t) {
              for (var n = Math.ceil(e.length / t), r = [], o = 0; n > o; o++)
                r.push(e.substring(o * t, (o + 1) * t));
              return r;
            },
            replaceAll: s,
            formatString: function () {
              if (arguments.length < 1) return null;
              for (var e = arguments[0], t = 1; t < arguments.length; t++)
                e = s(e, "{" + (t - 1) + "}", arguments[t]);
              return e;
            },
            toPascalCase: function (e) {
              return e && e.length
                ? 1 === e.length
                  ? e.charAt(0).toUpperCase()
                  : e.charAt(0).toUpperCase() + e.substr(1)
                : e;
            },
            toCamelCase: function (e) {
              return e && e.length
                ? 1 === e.length
                  ? e.charAt(0).toLowerCase()
                  : e.charAt(0).toLowerCase() + e.substr(1)
                : e;
            },
            queryString: n,
            formatBoolean: function (e) {
              return void 0 === e ? e : Boolean(e);
            },
            formatInt: function (e) {
              return void 0 === e ? 0 : parseInt(e);
            },
            reMoveHtml: c,
            formatStrToRead: function (e, t) {
              var n;
              return e
                ? (t && ((e = s(c(e), ",,", ",")), (e = s(e, ",,", ","))),
                  (n = { lt: "<", gt: ">", nbsp: " ", amp: "&", quot: '"' }),
                  (e =
                    1 <
                      (e = e.replace(
                        /&(lt|gt|nbsp|amp|quot);/gi,
                        function (e, t) {
                          return n[t];
                        }
                      )).length &&
                    "," ===
                      (e =
                        "," === e.substr(0, 1)
                          ? e.substr(1, e.length)
                          : e).substr(e.length - 1, 1)
                      ? e.substr(0, e.length - 1)
                      : e))
                : void 0;
            },
            strToObj: function (e) {
              if (void 0 === e) return e;
              try {
                return JSON.parse(e);
              } catch (e) {
                return {};
              }
            },
            HtmlElemRoles: {
              moveoverBesides: ["div", "ul", "table", "tr", "html", "body"],
              noregion: ["option", "radiobox", "checkbox"],
              heading: ["h1", "h2", "h3", "h4", "h5", "h6", "h7"],
              textbox: ["text", "tel", "date"],
              dialog: ["alert", "alertdialog", "dialog", "confirm"],
              select: ["combobox", "select", "select-one", "select-multiple"],
              foucsable0: [
                "0",
                "region",
                "combobox",
                "select",
                "select-one",
                "select-multiple",
                "input",
                "textarea",
                "a",
                "button",
                "checkbox",
                "group",
                "heading",
                "log",
                "menu",
                "menubar",
                "option",
                "radio",
                "radiogroup",
                "row",
              ],
              foucsable1: [
                "tablistbox",
                "alert",
                "alertdialog",
                "dialog",
                "dd",
                "dt",
                "confirm",
                "tab",
                "application",
                "grid",
                "gridcell",
                "menuitem",
                "menuitemcheckbox",
                "menuitemradio",
                "presentation",
                "tr",
                "td",
                "th",
                "li",
              ],
            },
            stopBubble: function (e) {
              (e = e || window.event) && e.stopPropagation
                ? e.stopPropagation()
                : (e.cancelBubble = !0);
            },
            stopDefault: function (e) {
              return (
                (e = e || window.event) && e.preventDefault
                  ? e.preventDefault()
                  : (e.returnValue = !1),
                !1
              );
            },
            arrToSizzle: function (e) {
              var n = e.toString();
              return (
                i(e, function (e, t) {
                  n += ",[role='" + t + "']";
                }),
                n
              );
            },
            triggerEvent: function (e, t) {
              var n;
              document.createEvent
                ? ((n = document.createEvent("HTMLEvents")).initEvent(
                    t,
                    !0,
                    !0
                  ),
                  (n.eventName = t),
                  e.dispatchEvent(n))
                : (((n = document.createEventObject()).eventType = t),
                  (n.eventName = t),
                  e.fireEvent("on" + n.eventType, n));
            },
            addCss: function (e, t, n) {
              void 0 === n && (n = "sheet");
              var r,
                o = Array.from(document.styleSheets).reduce(function (e, t) {
                  return t.title == n ? t : e;
                }, null);
              o
                ? 0 < o.length && (o = o[o.length - 1])
                : (((r = document.createElement("style")).title = n),
                  document.body.appendChild(r),
                  (o = document.styleSheets[document.styleSheets.length - 1]));
              var i,
                a = "";
              for (i in t)
                a +=
                  i.replace(/[A-Z]/g, function (e) {
                    return "-" + e.toLowerCase();
                  }) +
                  ":" +
                  ("number" == typeof t[i] ? t[i] + "px" : t[i]) +
                  ";";
              o.addRule
                ? o.addRule(e, a, o.cssRules.length)
                : o && o.insertRule(e + "{" + a + "}", 0);
            },
            colorRgbToHex: function (e) {
              if (/^(rgb|RGB)/.test(e)) {
                for (
                  var t = e.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(","),
                    n = "#",
                    r = 0;
                  r < t.length;
                  r++
                ) {
                  var o = Number(t[r]).toString(16);
                  n += o = o.length < 2 ? "0" + o : o;
                }
                return (n = 7 !== n.length ? e : n);
              }
              if (/^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(e)) {
                var i = e.replace(/#/, "").split("");
                if (6 === i.length) return e;
                if (3 === i.length) {
                  for (var a = "#", s = 0; s < i.length; s += 1)
                    a += i[s] + i[s];
                  return a;
                }
              }
              return e;
            },
            colorHexToRgb: function (e) {
              if (
                (e = e.toLowerCase()) &&
                /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/.test(e)
              ) {
                if (4 === e.length) {
                  for (var t = "#", n = 1; 4 > n; n += 1)
                    t += e.slice(n, n + 1).concat(e.slice(n, n + 1));
                  e = t;
                }
                for (var r = [], o = 1; 7 > o; o += 2)
                  r.push(parseInt("0x" + e.slice(o, o + 2)));
                return "RGB(" + r.join(",") + ")";
              }
              return e;
            },
            isMobile: function () {
              return (
                /mobile/i.test(navigator.userAgent) ||
                /android/i.test(navigator.userAgent)
              );
            },
            toCssCamelCase: function (e) {
              return e.replace(/[A-Z]/g, function (e) {
                return "-" + e.toLowerCase();
              });
            },
            isIE: function () {
              return -1 < navigator.userAgent.toLowerCase().indexOf("trident");
            },
            hasScrollbar: function () {
              return (
                document.body.scrollHeight >
                (window.innerHeight || document.documentElement.clientHeight)
              );
            },
            getMouseOffset: function (e) {
              var t =
                document.documentElement.scrollTop || document.body.scrollTop;
              return {
                x:
                  (document.documentElement.scrollLeft ||
                    document.body.scrollLeft) + e.clientX,
                y: t + e.clientY,
              };
            },
            isElementInViewport: function (e) {
              return (
                0 <= (e = e.getBoundingClientRect()).top &&
                0 <= e.left &&
                e.bottom <=
                  (window.innerHeight ||
                    document.documentElement.clientHeight) &&
                e.right <=
                  (window.innerWidth || document.documentElement.clientWidth)
              );
            },
            scroll: function t(n, r) {
              var o = r - n,
                i = n;
              setTimeout(function () {
                var e = Math.ceil(o / 10);
                (i += e),
                  window.scrollTo(i, n),
                  o > 10 || -10 > o ? t(i, r) : window.scrollTo(i, r);
              }, 1);
            },
          });
      },
      2702: function (e, t, re) {
        e.exports = (function () {
          "use strict";
          function r(e) {
            var t = typeof e;
            return null !== e && ("object" === t || "function" === t);
          }
          function a(e) {
            return "function" == typeof e;
          }
          function s(e) {
            i = e;
          }
          function l(e) {
            U = e;
          }
          function p() {
            return function () {
              return process.nextTick(x);
            };
          }
          function m() {
            return "undefined" != typeof t
              ? function () {
                  t(x);
                }
              : h();
          }
          function c() {
            var e = 0,
              t = new f(x),
              n = document.createTextNode("");
            return (
              t.observe(n, { characterData: !0 }),
              function () {
                n.data = e = ++e % 2;
              }
            );
          }
          function g() {
            var e = new MessageChannel();
            return (
              (e.port1.onmessage = x),
              function () {
                return e.port2.postMessage(0);
              }
            );
          }
          function h() {
            var e = setTimeout;
            return function () {
              return e(x, 1);
            };
          }
          function x() {
            for (var e = 0; o > e; e += 2) {
              var t = V[e],
                n = V[e + 1];
              t(n), (V[e] = void 0), (V[e + 1] = void 0);
            }
            o = 0;
          }
          function b() {
            try {
              var e = Function("return this")().require("vertx");
              return (t = e.runOnLoop || e.runOnContext), m();
            } catch (e) {
              return h();
            }
          }
          function v(e, t) {
            var n = this,
              r = new this.constructor(w);
            void 0 === r[G] && P(r);
            var o = n._state;
            if (o) {
              var i = arguments[o - 1];
              U(function () {
                return K(o, r, i, n._result);
              });
            } else R(n, r, e, t);
            return r;
          }
          function y(e) {
            var t = this;
            if (e && "object" == typeof e && e.constructor === t) return e;
            var n = new t(w);
            return E(n, e), n;
          }
          function w() {}
          function j() {
            return new TypeError("You cannot resolve a promise with itself");
          }
          function T() {
            return new TypeError(
              "A promises callback cannot return that same promise."
            );
          }
          function O(e, t, n, r) {
            try {
              e.call(t, n, r);
            } catch (e) {
              return e;
            }
          }
          function C(e, r, o) {
            U(function (t) {
              var n = !1,
                e = O(
                  o,
                  r,
                  function (e) {
                    n || ((n = !0), r !== e ? E(t, e) : N(t, e));
                  },
                  function (e) {
                    n || ((n = !0), L(t, e));
                  },
                  "Settle: " + (t._label || " unknown promise")
                );
              !n && e && ((n = !0), L(t, e));
            }, e);
          }
          function S(t, e) {
            e._state === Z
              ? N(t, e._result)
              : e._state === $
              ? L(t, e._result)
              : R(
                  e,
                  void 0,
                  function (e) {
                    return E(t, e);
                  },
                  function (e) {
                    return L(t, e);
                  }
                );
          }
          function k(e, t, n) {
            t.constructor === e.constructor &&
            n === v &&
            t.constructor.resolve === y
              ? S(e, t)
              : void 0 === n
              ? N(e, t)
              : a(n)
              ? C(e, t, n)
              : N(e, t);
          }
          function E(t, e) {
            if (t === e) L(t, j());
            else if (r(e)) {
              var n = void 0;
              try {
                n = e.then;
              } catch (e) {
                return void L(t, e);
              }
              k(t, e, n);
            } else N(t, e);
          }
          function A(e) {
            e._onerror && e._onerror(e._result), I(e);
          }
          function N(e, t) {
            e._state === J &&
              ((e._result = t),
              (e._state = Z),
              0 !== e._subscribers.length && U(I, e));
          }
          function L(e, t) {
            e._state === J && ((e._state = $), (e._result = t), U(A, e));
          }
          function R(e, t, n, r) {
            var o = e._subscribers,
              i = o.length;
            (e._onerror = null),
              (o[i] = t),
              (o[i + Z] = n),
              (o[i + $] = r),
              0 === i && e._state && U(I, e);
          }
          function I(e) {
            var t = e._subscribers,
              n = e._state;
            if (0 !== t.length) {
              for (
                var r = void 0, o = void 0, i = e._result, a = 0;
                a < t.length;
                a += 3
              )
                (r = t[a]), (o = t[a + n]), r ? K(n, r, o, i) : o(i);
              e._subscribers.length = 0;
            }
          }
          function K(e, t, n, r) {
            var o = a(n),
              i = void 0,
              c = void 0,
              s = !0;
            if (o) {
              try {
                i = n(r);
              } catch (e) {
                (s = !1), (c = e);
              }
              if (t === i) return void L(t, T());
            } else i = r;
            t._state !== J ||
              (o && s
                ? E(t, i)
                : s === !1
                ? L(t, c)
                : e === Z
                ? N(t, i)
                : e === $ && L(t, i));
          }
          function q(n, e) {
            try {
              e(
                function (t) {
                  E(n, t);
                },
                function (t) {
                  L(n, t);
                }
              );
            } catch (e) {
              L(n, e);
            }
          }
          function _() {
            return Q++;
          }
          function P(e) {
            (e[G] = Q++),
              (e._state = void 0),
              (e._result = void 0),
              (e._subscribers = []);
          }
          function D() {
            return new Error("Array Methods must be provided an Array");
          }
          function M(e) {
            return new et(this, e).promise;
          }
          function H(o) {
            var i = this;
            return new i(
              n(o)
                ? function (e, t) {
                    for (var n = o.length, r = 0; n > r; r++)
                      i.resolve(o[r]).then(e, t);
                  }
                : function (e, t) {
                    return t(new TypeError("You must pass an array to race."));
                  }
            );
          }
          function F(e) {
            var t = this,
              n = new t(w);
            return L(n, e), n;
          }
          function B() {
            throw new TypeError(
              "You must pass a resolver function as the first argument to the promise constructor"
            );
          }
          function z() {
            throw new TypeError(
              "Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function."
            );
          }
          function ne() {
            var e = void 0;
            if ("undefined" != typeof re.g) e = re.g;
            else if ("undefined" != typeof self) e = self;
            else
              try {
                e = Function("return this")();
              } catch (e) {
                throw new Error(
                  "polyfill failed because global object is unavailable in this environment"
                );
              }
            var t = e.Promise;
            if (t) {
              var n = null;
              try {
                n = Object.prototype.toString.call(t.resolve());
              } catch (e) {}
              if ("[object Promise]" === n && !t.cast) return;
            }
            e.Promise = tt;
          }
          var e = void 0;
          e = Array.isArray
            ? Array.isArray
            : function (e) {
                return "[object Array]" === Object.prototype.toString.call(e);
              };
          var n = e,
            o = 0,
            t = void 0,
            i = void 0,
            U = function (t, n) {
              (V[o] = t), (V[o + 1] = n), (o += 2), 2 === o && (i ? i(x) : X());
            },
            u = "undefined" != typeof window ? window : void 0,
            d = u || {},
            f = d.MutationObserver || d.WebKitMutationObserver,
            Y =
              "undefined" == typeof self &&
              "undefined" != typeof process &&
              "[object process]" === {}.toString.call(process),
            W =
              "undefined" != typeof Uint8ClampedArray &&
              "undefined" != typeof importScripts &&
              "undefined" != typeof MessageChannel,
            V = new Array(1e3),
            X = void 0;
          X = Y ? p() : f ? c() : W ? g() : void 0 === u ? b() : h();
          var G = Math.random().toString(36).substring(2),
            J = void 0,
            Z = 1,
            $ = 2,
            Q = 0,
            et = (function () {
              function e(e, t) {
                (this._instanceConstructor = e),
                  (this.promise = new e(w)),
                  this.promise[G] || P(this.promise),
                  n(t)
                    ? ((this.length = t.length),
                      (this._remaining = t.length),
                      (this._result = new Array(this.length)),
                      0 === this.length
                        ? N(this.promise, this._result)
                        : ((this.length = this.length || 0),
                          this._enumerate(t),
                          0 === this._remaining &&
                            N(this.promise, this._result)))
                    : L(this.promise, D());
              }
              return (
                (e.prototype._enumerate = function (t) {
                  for (var n = 0; this._state === J && n < t.length; n++)
                    this._eachEntry(t[n], n);
                }),
                (e.prototype._eachEntry = function e(t, n) {
                  var r = this._instanceConstructor,
                    o = r.resolve;
                  if (o === y) {
                    var i = void 0,
                      a = void 0,
                      s = !1;
                    try {
                      i = t.then;
                    } catch (e) {
                      (s = !0), (a = e);
                    }
                    if (i === v && t._state !== J)
                      this._settledAt(t._state, n, t._result);
                    else if ("function" != typeof i)
                      this._remaining--, (this._result[n] = t);
                    else if (r === tt) {
                      var c = new r(w);
                      s ? L(c, a) : k(c, t, i), this._willSettleAt(c, n);
                    } else
                      this._willSettleAt(
                        new r(function (e) {
                          return e(t);
                        }),
                        n
                      );
                  } else this._willSettleAt(o(t), n);
                }),
                (e.prototype._settledAt = function (t, n, r) {
                  var o = this.promise;
                  o._state === J &&
                    (this._remaining--,
                    t === $ ? L(o, r) : (this._result[n] = r)),
                    0 === this._remaining && N(o, this._result);
                }),
                (e.prototype._willSettleAt = function (t, n) {
                  var r = this;
                  R(
                    t,
                    void 0,
                    function (e) {
                      return r._settledAt(Z, n, e);
                    },
                    function (e) {
                      return r._settledAt($, n, e);
                    }
                  );
                }),
                e
              );
            })(),
            tt = (function () {
              function t(e) {
                (this[G] = _()),
                  (this._result = this._state = void 0),
                  (this._subscribers = []),
                  w !== e &&
                    ("function" != typeof e && B(),
                    this instanceof t ? q(this, e) : z());
              }
              return (
                (t.prototype.catch = function (t) {
                  return this.then(null, t);
                }),
                (t.prototype.finally = function (t) {
                  var n = this,
                    r = n.constructor;
                  return a(t)
                    ? n.then(
                        function (e) {
                          return r.resolve(t()).then(function () {
                            return e;
                          });
                        },
                        function (e) {
                          return r.resolve(t()).then(function () {
                            throw e;
                          });
                        }
                      )
                    : n.then(t, t);
                }),
                t
              );
            })();
          return (
            (tt.prototype.then = v),
            (tt.all = M),
            (tt.race = H),
            (tt.resolve = y),
            (tt.reject = F),
            (tt._setScheduler = s),
            (tt._setAsap = l),
            (tt._asap = U),
            (tt.polyfill = ne),
            (tt.Promise = tt)
          );
        })();
      },
    },
    r = {};
  (o.g = (function () {
    if ("object" == typeof globalThis) return globalThis;
    try {
      return this || new Function("return this")();
    } catch (e) {
      if ("object" == typeof window) return window;
    }
  })()),
    o(9859);
})();
