"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["4903"],
  {
    98415(e, t, a) {
      a.r(t), a.d(t, { default: () => k });
      var n = a(86070),
        o = a(41486),
        i = a(95041),
        r = a(13454),
        c = a(15189),
        d = a(80085),
        u = a(20696),
        s = a(35574);
      var l = a(53219),
        p = a(81566),
        v = a(2307);
      var f = a(65903);
      var h = a(73508),
        m = a(64850),
        S = a(88229),
        w = a(36436);
      function g() {
        var {
            protocol: e,
            hostname: t,
            port: a,
            pathname: n,
            searchParams: o,
          } = new URL(window.location.href),
          i = [];
        o.forEach((e, t) => {
          i.push({ key: t, value: e });
        });
        var r = i
          .map((e) => {
            var { key: t, value: a } = e,
              n = (function (e) {
                var t = e || "";
                try {
                  return t !== decodeURIComponent(t);
                } catch (e) {
                  return !1;
                }
              })(a)
                ? a
                : encodeURIComponent(a);
            return "".concat(t, "=").concat(n);
          })
          .join("&");
        return ""
          .concat(e, "//")
          .concat(t)
          .concat(a ? ":".concat(a) : "")
          .concat(n)
          .concat(r ? "?".concat(r) : "");
      }
      function k() {
        var e, t, a;
        !(function () {
          var e = (0, d.pg)(),
            [t] = (0, d.ok)(),
            a = t.get("category"),
            n =
              "/orderList" === e && "local" === a
                ? { cmccAppPageTitle: "", documentTitle: "会员权益" }
                : { cmccAppPageTitle: "会员权益", documentTitle: "会员权益" };
          (0, l.A)(() => {
            (0, p.D8)()
              ? v.t.setTitle(n.cmccAppPageTitle)
              : (document.title = n.documentTitle);
          });
        })(),
          (e = (0, d.pg)()),
          (t = (0, o.useContext)(f.jb).navigator),
          (0, o.useLayoutEffect)(() => {
            t &&
              t.listen((t) => {
                "PUSH" === t.action &&
                  t.location.pathname !== e &&
                  window.scrollTo(0, 0);
              });
          }, [t, e]),
          (function () {
            var e = (0, d.pg)(),
              t = (0, s.nc)((e) => e.userInfo);
            (0, o.useEffect)(() => {
              (0, r._)(function* () {
                var a, n, o;
                if (!/oss|jituan|oauth2|Maintenance/.test(e)) {
                  var i = yield (0, c.kW)();
                  if (
                    1 !==
                      (null === (a = i.data) || void 0 === a
                        ? void 0
                        : a.effectiveStatus) ||
                    0 !== i.data.checkWhitelist
                  ) {
                    if (
                      i.data &&
                      0 !==
                        (null === (n = i.data) || void 0 === n
                          ? void 0
                          : n.effectiveStatus) &&
                      !/login|oss|jituan|oauth2|Maintenance/.test(e) &&
                      (null == t ? void 0 : t.phoneNo)
                    ) {
                      var r = yield (0, c.VV)({
                        phoneNumber: null == t ? void 0 : t.phoneNo,
                      });
                      1 ===
                        (null === (o = i.data) || void 0 === o
                          ? void 0
                          : o.effectiveStatus) &&
                        !1 === (null == r ? void 0 : r.data) &&
                        u.x.replace("/Maintenance");
                    }
                  } else u.x.replace("/Maintenance");
                }
              })();
            }, [e, null == t ? void 0 : t.phoneNo]);
          })(),
          (a = (0, d.pg)()),
          (0, h.A)(
            () =>
              (0, r._)(function* () {
                if ((0, m.Jv)()) {
                  w.M.updateWxSdkStatus("loading"), yield (0, S.y)(500);
                  var e = g(),
                    t = yield (0, c.MU)(e);
                  "0" === t.resultCode && t.data
                    ? (window.wx.config({
                        debug: !1,
                        appId: "wx34378e5f9b150511",
                        timestamp: t.data.timestamp,
                        nonceStr: t.data.noncestr,
                        signature: t.data.signature,
                        jsApiList: [
                          "scanQRCode",
                          "updateAppMessageShareData",
                          "updateTimelineShareData",
                        ],
                      }),
                      window.wx.ready(() => {
                        w.M.updateWxSdkStatus("ready");
                      }),
                      window.wx.error(() => {
                        w.M.updateWxSdkStatus("error");
                      }))
                    : w.M.updateWxSdkStatus("error");
                }
              })(),
            { refreshDeps: [a] }
          );
        var k = (0, i.Ju)();
        return (0, n.jsx)(n.Fragment, { children: k });
      }
    },
    36436(e, t, a) {
      a.d(t, { C: () => n, M: () => o });
      var n = (0, a(99751).vt)()(() => ({
          hasCenterModalVisible: !1,
          wxSdkStatus: "waiting",
        })),
        o = {
          updateHasCenterModalVisible: (e) => {
            n.setState({ hasCenterModalVisible: e });
          },
          updateWxSdkStatus: (e) => {
            n.setState({ wxSdkStatus: e });
          },
        };
    },
    88229(e, t, a) {
      a.d(t, { l: () => n, y: () => o });
      var n = () => {},
        o = (e) => new Promise((t) => setTimeout(t, e));
    },
  },
]);
