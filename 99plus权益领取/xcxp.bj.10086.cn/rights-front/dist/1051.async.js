"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["1051"],
  {
    62033(e, t, n) {
      n.d(t, { v: () => C });
      var l = n(86070),
        o = (n(32949), n(74947)),
        a = n(41486),
        s = "Mask___M2HHj",
        r = "Content___j4Tg4",
        i = n(81566),
        c = n(2307),
        d = n(59028),
        u = n(88229),
        h = n(13526),
        _ = n(36436),
        f = n(18310);
      function m(e) {
        var { children: t } = e,
          { modalWrapperStyle: n } = (function () {
            var { windowWidth: e } = (0, f.lW)();
            return {
              modalWrapperStyle: (0, a.useMemo)(
                () =>
                  712 === e || 717 === e || 813 === e
                    ? { transform: "scale(0.6)" }
                    : {},
                [e]
              ),
            };
          })();
        return (0, l.jsx)("div", { style: n, children: t });
      }
      function C(e) {
        var {
            open: t,
            children: n,
            onClose: f = u.l,
            onAfterClose: C = u.l,
            onAfterOpen: p = u.l,
            closeOnMaskClick: v = !1,
            contentClassName: g,
            maskClassName: y,
          } = e,
          x = (0, a.useCallback)(() => {
            0 === window.scrollY &&
              window.scrollTo({ top: 1, left: 0, behavior: "smooth" }),
              (0, i.Al)() && (0, d.fF)() && c.t.setPullRefresh(!1),
              _.M.updateHasCenterModalVisible(!0),
              p();
          }, [p]),
          N = (0, a.useCallback)(() => {
            (0, i.Al)() && (0, d.fF)() && c.t.setPullRefresh(!0),
              _.M.updateHasCenterModalVisible(!1),
              C();
          }, [C]);
        return (0, l.jsx)(o.Ay, {
          contentAtCenter: !0,
          visible: t,
          maskClosable: v,
          onClose: N,
          onOpen: x,
          close: f,
          gestureOutOfControl: !0,
          contentTransitionType: "rm-center-modal",
          maskClass: (0, h.A)(s, y),
          contentClass: (0, h.A)(r, g),
          children: (0, l.jsx)(m, { children: n }),
        });
      }
    },
    33843(e, t, n) {
      n.d(t, { R: () => P });
      var l = n(20837),
        o = n(86070),
        a = n(41486),
        s = "RmModal___y_Diw",
        r = "RmModalContent___XCcF5",
        i = "headWrap___I7jXY",
        c = "head___TTSOZ",
        d = "titleIcon___W44Ll",
        u = "typeIcon___roTkM",
        h = "rightsIcon___l23zj",
        _ = "title___PT1DJ",
        f = "body___EtwsK",
        m = "foot___tfyd2",
        C = "okButton___NTCwh",
        p = "cancelButton___CkGsH",
        v = "MZoneCloseButton___l28d7",
        g = "MZoneCloseButtonCloseButtonImage___idvUR",
        y = "NormalCloseButton___Fvsro",
        x = "NormalCloseButtonImage___G1Lrw",
        N = "MZoneHeadDecoration___wsd2G",
        k = "DiffNetNoticeModalContent___rDzSK",
        b = n(44841),
        A = n(21051),
        O = n(13526),
        B = n(62033),
        I = n(34158),
        M = {
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
          if ((0, A.O)(e)) return e;
          var n = M[e];
          return n
            ? (0, o.jsx)("img", {
                className: (0, O.A)(d, u),
                src: t ? n.MZone : n.Normal,
                alt: "",
              })
            : (0, o.jsx)("img", { className: (0, O.A)(d, h), src: e, alt: "" });
        };
      var j = (e) => {
          var {
              open: t,
              title: n,
              titleIcon: a,
              content: d = null,
              children: u = null,
              okButtonText: h = "我知道了",
              okButtonStyle: k = {},
              cancelButtonStyle: b = {},
              hasOkButton: O = !0,
              hasCancelButton: M = !1,
              cancelButtonText: j = "关闭",
              style: T = {},
              bodyStyle: w = {},
              onClose: P = () => {},
              onOk: R = () => {},
              onCancel: D = () => {},
              onAfterClose: E = () => {},
              hasFoot: L = !0,
              hasClose: H = !0,
              onAfterOpen: V = () => {},
            } = e,
            F = (0, I.e)(),
            W = (function (e) {
              var {
                hasOkButton: t,
                hasCancelButton: n,
                okButtonText: a,
                okButtonStyle: s,
                onOk: r,
              } = e;
              return (0, o.jsx)(o.Fragment, {
                children: t
                  ? (0, o.jsx)("div", {
                      className: C,
                      style: (0, l._)({ width: n ? "2.8rem" : "4.8rem" }, s),
                      onClick: r,
                      children: a,
                    })
                  : null,
              });
            })({
              hasOkButton: O,
              hasCancelButton: M,
              okButtonText: h,
              okButtonStyle: k,
              onOk: R,
            });
          return (0, o.jsx)(B.v, {
            open: t,
            onAfterClose: E,
            onAfterOpen: V,
            children: (0, o.jsxs)("div", {
              className: s,
              style: T,
              children: [
                F
                  ? (0, o.jsx)("img", {
                      className: N,
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202309/1f1a1016-da6b-4663-a563-d848af917ecd-awfewa.png"
                      ),
                      alt: "",
                    })
                  : null,
                (0, o.jsxs)("div", {
                  className: r,
                  children: [
                    (0, o.jsx)("div", {
                      className: i,
                      style: { marginBottom: F ? ".8rem" : ".4rem" },
                      children: (0, o.jsxs)("div", {
                        className: c,
                        children: [
                          a ? S(a, F) : null,
                          (0, A.O)(n)
                            ? n
                            : (0, o.jsx)("div", { className: _, children: n }),
                        ],
                      }),
                    }),
                    (0, o.jsxs)("div", {
                      className: f,
                      style: w,
                      children: [d, u],
                    }),
                    L
                      ? (0, o.jsxs)("div", {
                          className: m,
                          children: [
                            M
                              ? (0, o.jsx)("div", {
                                  className: p,
                                  style: (0, l._)(
                                    { width: M ? "2.8rem" : "3.2rem" },
                                    b
                                  ),
                                  onClick: D,
                                  children: j,
                                })
                              : null,
                            W,
                          ],
                        })
                      : null,
                    H
                      ? (0, o.jsx)(o.Fragment, {
                          children: F
                            ? (0, o.jsx)("div", {
                                className: v,
                                onClick: P,
                                children: (0, o.jsx)("img", {
                                  className: g,
                                  src: "".concat(
                                    gImgUrlPrefixLegacy,
                                    "/rights/202309/2aabe5b5-7e41-48fb-a097-ba983d4dc3d8-sdfaef.png"
                                  ),
                                  alt: "",
                                }),
                              })
                            : (0, o.jsx)("div", {
                                className: y,
                                onClick: P,
                                children: (0, o.jsx)("img", {
                                  className: x,
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
        T = b.Ay.create((e) => {
          var {
              title: t,
              titleIcon: n,
              content: l = null,
              hasFoot: s = !0,
              okButtonText: r = "我知道了",
              okButtonStyle: i,
              cancelButtonStyle: c,
              hasOkButton: d = !0,
              hasCancelButton: u = !1,
              cancelButtonText: h = "关闭",
              style: _ = {},
              bodyStyle: f = {},
              onClose: m = () => {},
              onOk: C = () => {},
              onCancel: p = () => {},
              onAfterClose: v = () => {},
              hasClose: g = !0,
              autoTriggerResolve: y = !1,
              onAfterOpen: x = () => {},
              autoHideAfterClickOk: N = !0,
              autoHideAfterClickCancel: k = !0,
            } = e,
            A = (0, b.hS)();
          return (
            (0, a.useEffect)(() => {
              y && A.resolve({ props: e });
            }, [y, A, e]),
            (0, o.jsx)(j, {
              open: A.visible,
              title: t,
              titleIcon: n,
              content: l,
              okButtonText: r,
              hasFoot: s,
              hasOkButton: d,
              okButtonStyle: i,
              cancelButtonStyle: c,
              hasCancelButton: u,
              cancelButtonText: h,
              style: _,
              bodyStyle: f,
              onClose: () => {
                A.hide(), m();
              },
              onOk: () => {
                N && A.hide(), C();
              },
              onCancel: () => {
                k && A.hide(), p();
              },
              onAfterClose: () => {
                A.resolveHide(), A.remove(), v();
              },
              hasClose: g,
              onAfterOpen: () => {
                x();
              },
            })
          );
        });
      function w(e) {
        return b.Ay.show(T, e);
      }
      var P = {
        ControlledComponent: j,
        open: w,
        close: function () {
          return b.Ay.hide(T);
        },
        openDiffNetNoticeModal: function (e) {
          var t = (null == e ? void 0 : e.title) ? e.title : "温馨提示",
            n = (null == e ? void 0 : e.contentText)
              ? e.contentText
              : "抱歉，仅限北京移动用户参与";
          w({
            title: t,
            content: (0, o.jsx)("div", { className: k, children: n }),
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
          w({
            titleIcon: "warning",
            title: "提交失败",
            content: (0, o.jsxs)("ul", {
              style: { fontSize: ".28rem", color: "#333", lineHeight: 1.6 },
              children: [
                (0, o.jsx)("li", { children: "办理失败，可能是以下原因：" }),
                (0, o.jsx)("li", { children: "1、您的号码已欠费停机。" }),
                (0, o.jsx)("li", { children: "2、您不符合办理条件。" }),
                (0, o.jsx)("li", { children: "如有疑问请您拨打10086咨询。" }),
              ],
            }),
            okButtonText: "我知道了",
          });
        },
      };
    },
    62116(e, t, n) {
      n.d(t, { R: () => O });
      var l = n(13454),
        o = n(20837),
        a = n(86070),
        s = (n(30913), n(30176)),
        r = n(41486),
        i = "container___nLuYx",
        c = "inputWrap___A8dKM",
        d = "phone___NakaE",
        u = "input___mu1rr",
        h = "aInputContainer___xAtsr",
        _ = "aInput___PBDnz",
        f = "action___gpg7k",
        m = n(15189),
        C = n(17148),
        p = n(53487),
        v = n(73508);
      var g = n(64308),
        y = n(13526),
        x = n(60707),
        N = n(59344),
        k = n(35574),
        b = n(31738),
        A = (e, t) => {
          var {
              wrapVisible: n,
              autoSendCodeWhenWrapOpen: A = !0,
              offerId: O,
              legalRightsNbr: B,
              phoneNo: I,
              style: M = {},
              inputStyle: S = {},
              inputWrapStyle: j = {},
              buttonStyle: T = {},
              legalRightsId: w,
              buttonTextColor: P = "#FD982A",
              codeInputColor: R = "#333",
              codeInputStyle: D = {},
              templateId: E,
              discount: L,
              onCheck: H = () => {},
              Mzone: V = !1,
              module: F = "",
              petroChina: W = !1,
              activeId: Z,
              hasPhoneNo: U = !0,
              inputClassName: G,
            } = e,
            Y = (0, r.useMemo)(() => {
              var e = {};
              return V
                ? ((e.legalRightsId = w), (e.module = F), e)
                : ((0, x.A)(E) || (e.templateId = E),
                  (0, x.A)(I) || (e.phoneNo = I),
                  (0, x.A)(L) || (e.discount = L),
                  (0, x.A)(Z) || (e.activeId = Z),
                  (0, x.A)(B)
                    ? ((0, x.A)(O) || (e.offerId = O), e)
                    : ((e.rightsCode = B), e));
            }, [V, E, I, L, B, O, Z, w, F]),
            z = (0, r.useMemo)(
              () =>
                JSON.stringify({
                  templateId: E,
                  legalRightsNbr: B,
                  offerId: O,
                }),
              [B, O, E]
            ),
            K = (0, k.nc)((e) => e.userInfo),
            J = (null == K ? void 0 : K.desensitizedPhoneNumber) || "",
            X = (0, r.useMemo)(() => (I ? (0, g.kM)(I) : J), [I, J]),
            q = (function (e) {
              var { data: t } = (0, v.A)(
                () =>
                  (0, l._)(function* () {
                    return "string" != typeof e
                      ? 6
                      : (yield (0, m.tf)(e))
                      ? 4
                      : 6;
                  })(),
                {
                  refreshDeps: [e],
                  cacheKey: "queryIsCloudShelfRights".concat(e),
                }
              );
              return t || 6;
            })(B),
            [Q, $] = (0, r.useState)(""),
            [ee, te] = (0, C.A)("_RM_OV_NEED_VERIFY_".concat(z), {
              defaultValue: !1,
            }),
            [ne, le] = (0, r.useState)(),
            [oe, ae] = (0, C.A)("_RM_OV_COUNTDOWN_GLOBAL", {
              defaultValue: void 0,
            }),
            [se, re] = (0, C.A)("_RM_OV_COUNTDOWN_START_GLOBAL", {
              defaultValue: void 0,
            }),
            [ie, ce] = (0, r.useState)(!1),
            [de, ue] = (0, r.useState)(!1),
            he = (0, r.useMemo)(
              () => (null == ne ? void 0 : ne.includes("s")),
              [ne]
            );
          (0, r.useEffect)(() => {
            if (se && oe) {
              var e = Math.floor((Date.now() - se) / 1e3),
                t = Math.max(0, 60 - e);
              t > 0
                ? (ae(t), le("".concat(t, "s")))
                : (ae(void 0), re(void 0), le("重新发送验证码"));
            }
          }, [se, oe, ae, le, re]);
          var _e = (0, r.useCallback)(
              () =>
                (0, l._)(function* () {
                  return (
                    le("发送中..."),
                    "0" ===
                    (W
                      ? yield (0, b.h)()
                      : V
                      ? yield (0, m.cW)(Y)
                      : I
                      ? yield (0, m.BD)(Y)
                      : yield (0, m.X9)(Y)
                    ).resultCode
                      ? (N.Z.info("验证码已发送"),
                        ae(60),
                        re(Date.now()),
                        le("".concat(60, "s")),
                        !0)
                      : (N.Z.info("验证码发送频繁，请稍后再试"),
                        ae(void 0),
                        re(void 0),
                        le("重新发送验证码"),
                        !1)
                  );
                })(),
              [I, Y, ae, le, re, V, W]
            ),
            fe = (0, p.A)(
              () => {
                if ("number" == typeof oe) {
                  if (oe <= 1)
                    return ae(void 0), re(void 0), void le("重新发送验证码");
                  ae(oe - 1), le("".concat(oe - 1, "s"));
                }
              },
              oe ? 1e3 : void 0
            ),
            me = (0, r.useCallback)(() => {
              ne && ["重新发送验证码", "获取验证码"].includes(ne) && _e();
            }, [ne, _e]),
            Ce = (0, r.useCallback)(
              () =>
                (0, l._)(function* () {
                  if (!de && !ie) {
                    ce(!0);
                    try {
                      if (W || I || V) H(!0), te(!0);
                      else {
                        var e = !!(yield (0, m.Y4)(Y)).data;
                        H(e), te(e);
                      }
                    } finally {
                      ce(!1), ue(!0);
                    }
                  }
                })(),
              [I, Y, H, te, ie, de, V, W]
            );
          (0, r.useEffect)(() => {
            n ? de || Ce() : $("");
          }, [n, Ce, de]),
            (0, r.useEffect)(() => {
              n || (ue(!1), ce(!1));
            }, [z, n]),
            (0, r.useEffect)(() => {
              if (n && ee && de && !he && "发送中..." !== ne) {
                if (ne) {
                  if ("重新发送验证码" === ne) return;
                } else le("获取验证码");
                !A || (ne && "获取验证码" !== ne) || _e();
              }
            }, [n, ee, he, ne, A, _e, de, le]);
          var pe = (0, r.useCallback)(() => {
              if (ee)
                if (0 !== Q.length) {
                  if (!(Q.length < 4)) return Q;
                  N.Z.info("验证码格式不正确");
                } else N.Z.info("请输入验证码");
            }, [Q, ee]),
            ve = (0, r.useCallback)(() => {
              ae(void 0), re(void 0), le("重新发送验证码"), fe();
            }, [fe, ae, le, re]);
          return (
            (0, r.useImperativeHandle)(t, () => ({
              getVerificationCode: pe,
              clearCountdown: ve,
            })),
            n && ee
              ? (0, a.jsxs)("div", {
                  className: i,
                  style: M,
                  children: [
                    U
                      ? (0, a.jsx)("div", {
                          className: d,
                          style: S,
                          children: X,
                        })
                      : null,
                    (0, a.jsxs)("div", {
                      className: c,
                      style: j,
                      children: [
                        (0, a.jsx)("div", {
                          className: (0, y.A)(u, G),
                          children: (0, a.jsx)(s.A, {
                            className: h,
                            inputClass: _,
                            inputStyle: (0, o._)({ color: R }, D),
                            type: "text",
                            maxLength: q,
                            placeholder: "请输入验证码",
                            value: Q,
                            clearable: !0,
                            border: "none",
                            onChange: (e, t) => $(t),
                            onClear: () => $(""),
                          }),
                        }),
                        (0, a.jsx)("div", {
                          className: f,
                          style: (0, o._)({ color: P }, T),
                          onClick: me,
                          children: ne,
                        }),
                      ],
                    }),
                  ],
                })
              : null
          );
        };
      A.displayName = "OrderValidator";
      var O = (0, r.forwardRef)(A);
    },
    31738(e, t, n) {
      n.d(t, { _: () => a, h: () => s });
      var l = n(13454),
        o = n(78337);
      function a() {
        return (0, l._)(function* () {
          return yield (0,
          o.t)({ abilityCode: "PETRO_CHINA_GET_HANDLE_INFO", data: {} });
        })();
      }
      function s() {
        return (0, l._)(function* () {
          return (0,
          o.t)({ abilityCode: "PETRO_CHINA_SEND_CONFIRM_CODE", data: {} });
        })();
      }
    },
    34158(e, t, n) {
      n.d(t, { e: () => o });
      var l = n(4927);
      function o() {
        var e = (0, l.P)((e) => e.theme),
          t = (0, l.P)((e) => e.pageType);
        return "M-ZONE" === e && "Plus" === t;
      }
    },
    4927(e, t, n) {
      n.d(t, { P: () => s });
      var l = n(20696),
        o = n(99751),
        a = n(65059),
        s = (0, o.vt)()(
          (0, a.lt)(
            (e, t) => ({
              theme: "NORMAL",
              pageType: null,
              updateTheme: (t) => e(() => ({ theme: t })),
              updatePageType: (t) => e(() => ({ pageType: t })),
              showOpenTipsModal: () => {
                var { pageType: e } = t();
                l.x.navToPath(
                  "Plus" === e ? "/memberOpen/selectMeaI" : "/memberOpen"
                );
              },
            }),
            { name: "RMS_VIP_PAGE" }
          )
        );
    },
    36436(e, t, n) {
      n.d(t, { C: () => l, M: () => o });
      var l = (0, n(99751).vt)()(() => ({
          hasCenterModalVisible: !1,
          wxSdkStatus: "waiting",
        })),
        o = {
          updateHasCenterModalVisible: (e) => {
            l.setState({ hasCenterModalVisible: e });
          },
          updateWxSdkStatus: (e) => {
            l.setState({ wxSdkStatus: e });
          },
        };
    },
    88229(e, t, n) {
      n.d(t, { l: () => l, y: () => o });
      var l = () => {},
        o = (e) => new Promise((t) => setTimeout(t, e));
    },
  },
]);
