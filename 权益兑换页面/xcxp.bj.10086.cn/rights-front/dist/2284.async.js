"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["2284"],
  {
    98165(e, t, n) {
      n.d(t, { f: () => m });
      var o = n(20837),
        l = n(43952),
        s = n(86070),
        a = (n(79495), n(75834)),
        r =
          (n(41486),
          {
            modal: "modal___sTGwL",
            close: "close___Twvc_",
            head: "head___GsVwY",
            body: "body___j37d1",
            foot: "foot___ifJBQ",
            okButton: "okButton___TIf2l",
            disabled: "disabled___oMrIZ",
          }),
        i = n(13526),
        c = "".concat(
          gImgUrlPrefixLegacy,
          "/rights/202303/9b46080e-9f19-47ed-9839-6a546817c2b1-icon-close.png"
        ),
        d = 998,
        u = 999;
      function m(e) {
        var t,
          {
            rounded: n = !0,
            roundedValue: m = ".2rem",
            visible: h = !1,
            titleText: f,
            okButton: _,
            okButtonText: C = "确定",
            okButtonStyle: g = {},
            hasCloseButton: v = !0,
            hasOkButton: y = !0,
            disableOkButton: x = !1,
            maskClosable: k = !1,
            hasFoot: p = !0,
            hasHead: b = !0,
            rootClassName: B,
            modalClassName: j,
            maskStyle: N = {},
            contentStyle: T = {},
            footStyle: w = {},
            bodyStyle: O = {},
            headStyle: S = {},
            onClose: M = () => {},
            onAfterClose: P = () => {},
            onOk: A = () => {},
            onMaskClick: I = () => {},
          } = e,
          H =
            ((t = n ? { borderTopLeftRadius: m, borderTopRightRadius: m } : {}),
            (0, l._)((0, o._)({}, T, t), { zIndex: u })),
          F = (0, s.jsx)("div", {
            className: (0, i.$)(r.okButton, x && r.disabled),
            style: g,
            onClick: () => {
              x || A();
            },
            children: C,
          }),
          L =
            p && y
              ? (0, s.jsx)("div", {
                  className: r.foot,
                  style: w,
                  children: _ || F,
                })
              : null,
          R =
            b && f
              ? (0, s.jsx)("div", {
                  className: r.head,
                  style: S,
                  children: (0, s.jsx)("div", {
                    className: r.title,
                    children: f,
                  }),
                })
              : null;
        return (0, s.jsx)(a.Ay, {
          visible: h,
          close: M,
          onClose: P,
          gestureOutOfControl: !0,
          contentStyle: H,
          onMaskClick: I,
          maskClosable: k,
          contentClass: B,
          maskStyle: (0, o._)({ zIndex: d }, N),
          children: (0, s.jsxs)("div", {
            className: (0, i.$)(r.modal, j),
            children: [
              R,
              (0, s.jsx)("div", {
                className: r.body,
                style: O,
                children: e.children,
              }),
              L,
              v
                ? (0, s.jsx)("div", {
                    className: r.close,
                    onClick: M,
                    children: (0, s.jsx)("img", { src: c, alt: "" }),
                  })
                : null,
            ],
          }),
        });
      }
    },
    62033(e, t, n) {
      n.d(t, { v: () => C });
      var o = n(86070),
        l = (n(32949), n(74947)),
        s = n(41486),
        a = "Mask___M2HHj",
        r = "Content___j4Tg4",
        i = n(81566),
        c = n(2307),
        d = n(59028),
        u = n(88229),
        m = n(13526),
        h = n(36436),
        f = n(18310);
      function _(e) {
        var { children: t } = e,
          { modalWrapperStyle: n } = (function () {
            var { windowWidth: e } = (0, f.lW)();
            return {
              modalWrapperStyle: (0, s.useMemo)(
                () =>
                  712 === e || 717 === e || 813 === e
                    ? { transform: "scale(0.6)" }
                    : {},
                [e]
              ),
            };
          })();
        return (0, o.jsx)("div", { style: n, children: t });
      }
      function C(e) {
        var {
            open: t,
            children: n,
            onClose: f = u.l,
            onAfterClose: C = u.l,
            onAfterOpen: g = u.l,
            closeOnMaskClick: v = !1,
            contentClassName: y,
            maskClassName: x,
          } = e,
          k = (0, s.useCallback)(() => {
            0 === window.scrollY &&
              window.scrollTo({ top: 1, left: 0, behavior: "smooth" }),
              (0, i.Al)() && (0, d.fF)() && c.t.setPullRefresh(!1),
              h.M.updateHasCenterModalVisible(!0),
              g();
          }, [g]),
          p = (0, s.useCallback)(() => {
            (0, i.Al)() && (0, d.fF)() && c.t.setPullRefresh(!0),
              h.M.updateHasCenterModalVisible(!1),
              C();
          }, [C]);
        return (0, o.jsx)(l.Ay, {
          contentAtCenter: !0,
          visible: t,
          maskClosable: v,
          onClose: p,
          onOpen: k,
          close: f,
          gestureOutOfControl: !0,
          contentTransitionType: "rm-center-modal",
          maskClass: (0, m.A)(a, x),
          contentClass: (0, m.A)(r, y),
          children: (0, o.jsx)(_, { children: n }),
        });
      }
    },
    33843(e, t, n) {
      n.d(t, { R: () => I });
      var o = n(20837),
        l = n(86070),
        s = n(41486),
        a = "RmModal___y_Diw",
        r = "RmModalContent___XCcF5",
        i = "headWrap___I7jXY",
        c = "head___TTSOZ",
        d = "titleIcon___W44Ll",
        u = "typeIcon___roTkM",
        m = "rightsIcon___l23zj",
        h = "title___PT1DJ",
        f = "body___EtwsK",
        _ = "foot___tfyd2",
        C = "okButton___NTCwh",
        g = "cancelButton___CkGsH",
        v = "MZoneCloseButton___l28d7",
        y = "MZoneCloseButtonCloseButtonImage___idvUR",
        x = "NormalCloseButton___Fvsro",
        k = "NormalCloseButtonImage___G1Lrw",
        p = "MZoneHeadDecoration___wsd2G",
        b = "DiffNetNoticeModalContent___rDzSK",
        B = n(44841),
        j = n(21051),
        N = n(13526),
        T = n(62033),
        w = n(34158),
        O = {
          success: {
            MZone: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202309/68a420f3-0827-4105-be60-b101db62d4a4-12.png"
            ),
            Normal: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202303/876050c9-1184-4781-a898-8053470737dc-successIcon.png"
            ),
          },
          warning: {
            MZone: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202309/ad79ffe6-95c9-4078-a6fd-8bc0355ad36a-13.png"
            ),
            Normal: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202309/aba95335-6a14-4708-a61d-b1672df0666b-ewfaewe.png"
            ),
          },
        },
        S = (e, t) => {
          if ((0, j.O)(e)) return e;
          var n = O[e];
          return n
            ? (0, l.jsx)("img", {
                className: (0, N.A)(d, u),
                src: t ? n.MZone : n.Normal,
                alt: "",
              })
            : (0, l.jsx)("img", { className: (0, N.A)(d, m), src: e, alt: "" });
        };
      var M = (e) => {
          var {
              open: t,
              title: n,
              titleIcon: s,
              content: d = null,
              children: u = null,
              okButtonText: m = "我知道了",
              okButtonStyle: b = {},
              cancelButtonStyle: B = {},
              hasOkButton: N = !0,
              hasCancelButton: O = !1,
              cancelButtonText: M = "关闭",
              style: P = {},
              bodyStyle: A = {},
              onClose: I = () => {},
              onOk: H = () => {},
              onCancel: F = () => {},
              onAfterClose: L = () => {},
              hasFoot: R = !0,
              hasClose: Z = !0,
              onAfterOpen: U = () => {},
            } = e,
            G = (0, w.e)(),
            V = (function (e) {
              var {
                hasOkButton: t,
                hasCancelButton: n,
                okButtonText: s,
                okButtonStyle: a,
                onOk: r,
              } = e;
              return (0, l.jsx)(l.Fragment, {
                children: t
                  ? (0, l.jsx)("div", {
                      className: C,
                      style: (0, o._)({ width: n ? "2.8rem" : "4.8rem" }, a),
                      onClick: r,
                      children: s,
                    })
                  : null,
              });
            })({
              hasOkButton: N,
              hasCancelButton: O,
              okButtonText: m,
              okButtonStyle: b,
              onOk: H,
            });
          return (0, l.jsx)(T.v, {
            open: t,
            onAfterClose: L,
            onAfterOpen: U,
            children: (0, l.jsxs)("div", {
              className: a,
              style: P,
              children: [
                G
                  ? (0, l.jsx)("img", {
                      className: p,
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202309/1f1a1016-da6b-4663-a563-d848af917ecd-awfewa.png"
                      ),
                      alt: "",
                    })
                  : null,
                (0, l.jsxs)("div", {
                  className: r,
                  children: [
                    (0, l.jsx)("div", {
                      className: i,
                      style: { marginBottom: G ? ".8rem" : ".4rem" },
                      children: (0, l.jsxs)("div", {
                        className: c,
                        children: [
                          s ? S(s, G) : null,
                          (0, j.O)(n)
                            ? n
                            : (0, l.jsx)("div", { className: h, children: n }),
                        ],
                      }),
                    }),
                    (0, l.jsxs)("div", {
                      className: f,
                      style: A,
                      children: [d, u],
                    }),
                    R
                      ? (0, l.jsxs)("div", {
                          className: _,
                          children: [
                            O
                              ? (0, l.jsx)("div", {
                                  className: g,
                                  style: (0, o._)(
                                    { width: O ? "2.8rem" : "3.2rem" },
                                    B
                                  ),
                                  onClick: F,
                                  children: M,
                                })
                              : null,
                            V,
                          ],
                        })
                      : null,
                    Z
                      ? (0, l.jsx)(l.Fragment, {
                          children: G
                            ? (0, l.jsx)("div", {
                                className: v,
                                onClick: I,
                                children: (0, l.jsx)("img", {
                                  className: y,
                                  src: "".concat(
                                    gImgUrlPrefixLegacy,
                                    "/rights/202309/2aabe5b5-7e41-48fb-a097-ba983d4dc3d8-sdfaef.png"
                                  ),
                                  alt: "",
                                }),
                              })
                            : (0, l.jsx)("div", {
                                className: x,
                                onClick: I,
                                children: (0, l.jsx)("img", {
                                  className: k,
                                  src: "".concat(
                                    gImgUrlPrefixLegacy,
                                    "/rights/202309/9c6b21e4-f860-4bbd-b7d3-af3430900604-wqe.png"
                                  ),
                                  alt: "",
                                }),
                              }),
                        })
                      : null,
                  ],
                }),
              ],
            }),
          });
        },
        P = B.Ay.create((e) => {
          var {
              title: t,
              titleIcon: n,
              content: o = null,
              hasFoot: a = !0,
              okButtonText: r = "我知道了",
              okButtonStyle: i,
              cancelButtonStyle: c,
              hasOkButton: d = !0,
              hasCancelButton: u = !1,
              cancelButtonText: m = "关闭",
              style: h = {},
              bodyStyle: f = {},
              onClose: _ = () => {},
              onOk: C = () => {},
              onCancel: g = () => {},
              onAfterClose: v = () => {},
              hasClose: y = !0,
              autoTriggerResolve: x = !1,
              onAfterOpen: k = () => {},
              autoHideAfterClickOk: p = !0,
              autoHideAfterClickCancel: b = !0,
            } = e,
            j = (0, B.hS)();
          return (
            (0, s.useEffect)(() => {
              x && j.resolve({ props: e });
            }, [x, j, e]),
            (0, l.jsx)(M, {
              open: j.visible,
              title: t,
              titleIcon: n,
              content: o,
              okButtonText: r,
              hasFoot: a,
              hasOkButton: d,
              okButtonStyle: i,
              cancelButtonStyle: c,
              hasCancelButton: u,
              cancelButtonText: m,
              style: h,
              bodyStyle: f,
              onClose: () => {
                j.hide(), _();
              },
              onOk: () => {
                p && j.hide(), C();
              },
              onCancel: () => {
                b && j.hide(), g();
              },
              onAfterClose: () => {
                j.resolveHide(), j.remove(), v();
              },
              hasClose: y,
              onAfterOpen: () => {
                k();
              },
            })
          );
        });
      function A(e) {
        return B.Ay.show(P, e);
      }
      var I = {
        ControlledComponent: M,
        open: A,
        close: function () {
          return B.Ay.hide(P);
        },
        openDiffNetNoticeModal: function (e) {
          var t = (null == e ? void 0 : e.title) ? e.title : "温馨提示",
            n = (null == e ? void 0 : e.contentText)
              ? e.contentText
              : "抱歉，仅限北京移动用户参与";
          A({
            title: t,
            content: (0, l.jsx)("div", { className: b, children: n }),
            okButtonText: "选号入网北京移动",
            okButtonStyle: { width: "3.6rem" },
            hasCancelButton: !0,
            cancelButtonText: "关闭",
            cancelButtonStyle: { width: "2rem" },
            hasClose: !1,
            onOk() {
              window.location.href =
                "https://service.bj.10086.cn/m/num/num/commonNum/showFontPage.action?busiCode=BZKQHY29QUANYI&channelName=jtapp&sourceid=JT";
            },
          });
        },
        openCommonOrderFailModal: function () {
          A({
            titleIcon: "warning",
            title: "提交失败",
            content: (0, l.jsxs)("ul", {
              style: { fontSize: ".28rem", color: "#333", lineHeight: 1.6 },
              children: [
                (0, l.jsx)("li", { children: "办理失败，可能是以下原因：" }),
                (0, l.jsx)("li", { children: "1、您的号码已欠费停机。" }),
                (0, l.jsx)("li", { children: "2、您不符合办理条件。" }),
                (0, l.jsx)("li", { children: "如有疑问请您拨打10086咨询。" }),
              ],
            }),
            okButtonText: "我知道了",
          });
        },
      };
    },
    34158(e, t, n) {
      n.d(t, { e: () => l });
      var o = n(4927);
      function l() {
        var e = (0, o.P)((e) => e.theme),
          t = (0, o.P)((e) => e.pageType);
        return "M-ZONE" === e && "Plus" === t;
      }
    },
    4927(e, t, n) {
      n.d(t, { P: () => a });
      var o = n(20696),
        l = n(99751),
        s = n(65059),
        a = (0, l.vt)()(
          (0, s.lt)(
            (e, t) => ({
              theme: "NORMAL",
              pageType: null,
              updateTheme: (t) => e(() => ({ theme: t })),
              updatePageType: (t) => e(() => ({ pageType: t })),
              showOpenTipsModal: () => {
                var { pageType: e } = t();
                o.x.navToPath(
                  "Plus" === e ? "/memberOpen/selectMeaI" : "/memberOpen"
                );
              },
            }),
            { name: "RMS_VIP_PAGE" }
          )
        );
    },
    36436(e, t, n) {
      n.d(t, { C: () => o, M: () => l });
      var o = (0, n(99751).vt)()(() => ({
          hasCenterModalVisible: !1,
          wxSdkStatus: "waiting",
        })),
        l = {
          updateHasCenterModalVisible: (e) => {
            o.setState({ hasCenterModalVisible: e });
          },
          updateWxSdkStatus: (e) => {
            o.setState({ wxSdkStatus: e });
          },
        };
    },
    98973(e, t, n) {
      n.d(t, {
        BK: () => m,
        E$: () => s,
        KB: () => d,
        Ri: () => r,
        Vs: () => i,
        Y$: () => u,
        _g: () => a,
      });
      var o = n(56287),
        l = n.n(o);
      function s(e) {
        if ("string" != typeof e) return !1;
        var t = l()("2025-04-29 00:00:00");
        return l()(e).isAfter(t);
      }
      function a(e) {
        return "1500" === e;
      }
      function r(e) {
        return "1600" === e;
      }
      function i(e) {
        return "string" == typeof e ? e : String(e);
      }
      var c = /^Excl(\d+)HP$/;
      function d(e) {
        if (e) {
          var t = c.exec(e);
          if (t) {
            var n = Number(t[1]);
            if (Number.isFinite(n) && !(n < 1e4)) return n;
          }
        }
      }
      function u(e) {
        return void 0 !== d(e);
      }
      function m(e) {
        var { fromPageType2: t, userInfo: n } = e;
        if ("FiveDiscountGold" === t)
          return (null == n ? void 0 : n.isBasicGoldOnly) ? "8" : "6";
        if ("FiveDiscountPlus" === t) return "1";
        if ("PlatinumWZG" === t || "PlatinumRight" === t) return "5";
        if ("PtLiteHP" === t) return "18";
        if ("CarOwnerHP" === t) return "15";
        var o = d(t);
        return void 0 !== o ? i(o) : null;
      }
    },
    88229(e, t, n) {
      n.d(t, { l: () => o, y: () => l });
      var o = () => {},
        l = (e) => new Promise((t) => setTimeout(t, e));
    },
  },
]);
