"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["4362"],
  {
    84737(e, s, n) {
      n.d(s, { D: () => xe });
      var t = n(13454),
        l = n(86070),
        i = n(41486),
        a = n.n(i),
        o = n(12457),
        d = n(44418),
        r = n(73508),
        c = n(82647),
        u = n(84910),
        v = n(20696),
        _ = n(88229),
        h = "confirmBox___g9pn4",
        m = "close___h3tVp",
        f = "title___duI7j",
        g = "titleIcon___FHTTm",
        x = "titleText___lnldX",
        p = "phone___Zy7e2",
        N = "contreBox___MOs7r",
        C = "contre___RuiCl",
        j = "getWay___m0EW7",
        b = "getButton___MvGs2",
        I = "Disabled___pkejS",
        O = "loading___WSIPh",
        k = "loadingIcon___ndXxX",
        y = "hintFont___qdhS3",
        R = n(13526),
        S = n(35574),
        M = n(99545),
        D = n(62033),
        L = n(62116),
        B = n(7960),
        T = n(58349);
      function A(e) {
        var {
            open: s,
            onClose: n,
            onOk: t,
            rightsInfo: o,
            isOkButtonLoading: d,
          } = e,
          r = (0, S.nc)((e) => {
            var s;
            return (
              (null === (s = e.userInfo) || void 0 === s
                ? void 0
                : s.desensitizedPhoneNumber) || ""
            );
          }),
          c = a().useRef(null),
          [v, _] = (0, i.useState)(!1),
          A = (0, M.Mb)((e) => {
            var s;
            return (
              0 ===
              (null === (s = e.goldRightsBagReceiveStatus) || void 0 === s
                ? void 0
                : s.canUse)
            );
          }),
          E = (0, i.useMemo)(
            () =>
              A
                ? {
                    buttonContent: "您本月已领取，请下月再来",
                    buttonDisabled: !0,
                  }
                : d
                ? {
                    buttonContent: (0, l.jsxs)("div", {
                      className: O,
                      children: [
                        (0, l.jsx)("span", { className: k }),
                        (0, l.jsx)("span", { children: "正在领取中" }),
                      ],
                    }),
                    buttonDisabled: !0,
                  }
                : { buttonContent: "确认领取", buttonDisabled: !1 },
            [A, d]
          ),
          w = (0, i.useCallback)(() => {
            var e;
            if (!E.buttonDisabled) {
              var s =
                null === (e = c.current) || void 0 === e
                  ? void 0
                  : e.getVerificationCode();
              (!v || "string" == typeof s) && t({ verifyCode: s });
            }
          }, [v, t, E.buttonDisabled]);
        return (0, l.jsx)(D.v, {
          open: s,
          children: (0, l.jsxs)("div", {
            className: h,
            children: [
              (0, l.jsx)("div", { className: m, onClick: n }),
              (0, l.jsxs)("div", {
                className: f,
                children: [
                  (0, l.jsx)(B._, {
                    className: g,
                    src: (0, u.DO)(o, "330x182"),
                    alt: "",
                    fit: "fill",
                  }),
                  (0, l.jsx)("div", {
                    className: x,
                    children: null == o ? void 0 : o.legalRightsDesc,
                  }),
                ],
              }),
              (0, l.jsx)("div", {
                className: y,
                children: "确认本月领取".concat(
                  null == o ? void 0 : o.legalRightsDesc
                ),
              }),
              (0, l.jsxs)("div", {
                className: p,
                children: ["充值号码", (0, l.jsx)("span", { children: r })],
              }),
              (0, l.jsxs)("div", {
                className: N,
                children: [
                  (0, l.jsxs)("div", {
                    className: C,
                    children: [
                      "包含内容",
                      (0, l.jsx)("span", {
                        children: null == o ? void 0 : o.legalRightsDesc,
                      }),
                    ],
                  }),
                  (0, l.jsxs)("div", {
                    className: j,
                    children: [
                      "领取方式",
                      (0, l.jsx)(T.s, { text: (0, u.TL)(o) }),
                    ],
                  }),
                ],
              }),
              (0, l.jsx)(L.R, {
                wrapVisible: s && !A,
                style: { marginBottom: ".3rem", padding: "0 0.3rem" },
                ref: c,
                legalRightsNbr: null == o ? void 0 : o.legalRightsNbr,
                onCheck: _,
              }),
              (0, l.jsx)("div", {
                className: (0, R.A)(b, E.buttonDisabled && I),
                onClick: w,
                children: E.buttonContent,
              }),
            ],
          }),
        });
      }
      var E = "resultBox___kwQoL",
        w = "title___QXkzy",
        P = "TTTicon___DJ4z0",
        F = "name___NZzX8",
        V = "contentCode___hiXJS",
        W = "contentFont___FHFbS",
        z = "code___W7KWL",
        H = "useCopy___FfQV7",
        U = "time___Bz13_",
        Z = "contentExchange___gQMcT",
        G = "titleFz___jYhpv",
        X = "fz___E00hh",
        Q = "phone___A6Qpi",
        J = "ZTbutton___vbDYz",
        Y = "exchangeButton___PSmLE",
        K = "bottomButton___O_NOx",
        q = "button1___rPEHk",
        $ = "button2___inllG",
        ee = "OrderSuccessGoldRightsBag___Clkov",
        se = "close____WhEs",
        ne = "head___oyLTd",
        te = "statusImg___Bva5a",
        le = n(891),
        ie = n(59344);
      function ae(e) {
        var { codeList: s, instructions: n } = e;
        return (0, l.jsxs)("div", {
          className: V,
          children: [
            (0, l.jsx)("div", { className: w, children: "已自动帮您复制券码" }),
            (0, l.jsx)("div", { className: W, children: n }),
            s.map((e, s) =>
              (0, l.jsxs)(
                "div",
                { className: z, children: ["券码：", e.cardPwd] },
                s
              )
            ),
            s[0].endDate
              ? (0, l.jsxs)("div", {
                  className: U,
                  children: ["有效期至：", s[0].endDate],
                })
              : null,
          ],
        });
      }
      function oe(e) {
        var { custOrderId: s, receiveMode: n, rightsInfo: t, codeList: a } = e,
          d = (0, S.nc)((e) => e.userInfo),
          r = (0, i.useRef)();
        return (0, l.jsxs)("div", {
          className: Z,
          children: [
            (0, l.jsxs)("div", {
              className: G,
              children: [
                "请点击",
                (0, l.jsx)("span", { className: X, children: "“复制”" }),
                "按钮，粘贴到兑换处进行兑换",
              ],
            }),
            a.map((e, s) =>
              (0, l.jsxs)(
                "div",
                {
                  className: z,
                  children: [
                    "兑换码：",
                    e.cardPwd ? e.cardPwd : null,
                    e.cardNo ? e.cardNo : null,
                    (0, l.jsx)("span", {
                      className: (0, R.A)({ [H]: "1" === e.state }),
                      onClick: () => {
                        "1" !== e.state &&
                          le.V.writeText({
                            text: e.cardPwd ? e.cardPwd : e.cardNo,
                          });
                      },
                      children: "1" === e.state ? "已使用" : "复制",
                    }),
                  ],
                },
                s
              )
            ),
            (0, l.jsxs)("div", {
              className: U,
              children: ["有效期间至：", a[0].endDate],
            }),
            (0, l.jsx)("div", {
              className: Q,
              children: null == d ? void 0 : d.desensitizedPhoneNumber,
            }),
            (0, l.jsx)("input", {
              type: "text",
              ref: (e) => {
                r = e;
              },
              className: J,
              placeholder: "粘贴券码在此处进行兑换",
            }),
            (0, l.jsx)("div", {
              className: Y,
              onClick: () => {
                try {
                  var e = r.value;
                  (0, o.Q)({
                    cardNo: (null == d ? void 0 : d.phoneNo) || "",
                    cardCode: e,
                    sku: (null == t ? void 0 : t.legalRightsNbr) || "",
                  }).then((e) => {
                    "0" === JSON.parse(e.data).body.chargeState
                      ? ie.Z.success("充值成功")
                      : ie.Z.info(JSON.parse(e.data).body.chargeDesc);
                  });
                } catch (e) {
                  ie.Z.info("提交失败，稍后再试");
                }
              },
              children: "立即兑换",
            }),
          ],
        });
      }
      function de(e) {
        var { codeList: s, instructions: n } = e;
        return (0, l.jsxs)("div", {
          className: V,
          children: [
            (0, l.jsx)("div", { className: w, children: "已自动帮您复制链接" }),
            (0, l.jsx)("div", { className: W }),
            s.map((e, s) =>
              (0, l.jsxs)(
                "div",
                { className: z, children: ["账号绑定链接：", e.cardPwd] },
                s
              )
            ),
            s[0].endDate
              ? (0, l.jsxs)("div", {
                  className: U,
                  children: ["有效期至：", s[0].endDate],
                })
              : null,
          ],
        });
      }
      function re(e) {
        var {
            open: s,
            custOrderId: n,
            receiveMode: t,
            rightsInfo: a,
            onClose: d,
          } = e,
          r = (function (e) {
            var { open: s, custOrderId: n, receiveMode: t, rightsInfo: l } = e,
              [a, d] = (0, i.useState)(null);
            return (
              (0, i.useEffect)(() => {
                s
                  ? ("1100" !== t && "1200" !== t && "1300" !== t) ||
                    (0, o.tv)({
                      extOrderId: n,
                      sku: (null == l ? void 0 : l.legalRightsNbr) || "",
                      extCustOrderId: n,
                    }).then((e) => {
                      "0" === e.resultCode && d(e.data);
                    })
                  : d([]);
              }, [n, s, t, l, null == l ? void 0 : l.legalRightsNbr]),
              a
            );
          })({ open: s, custOrderId: n, receiveMode: t, rightsInfo: a }),
          _ = (0, i.useMemo)(() => (0, u.GU)(a), [a]);
        return (0, l.jsxs)("div", {
          className: E,
          children: [
            (0, l.jsxs)("div", {
              className: w,
              children: [(0, l.jsx)("span", { className: P }), "领取成功"],
            }),
            a && r && r.length
              ? "1100" === t
                ? (0, l.jsx)(ae, { codeList: r, instructions: _ })
                : "1200" === t
                ? (0, l.jsx)(oe, {
                    custOrderId: n,
                    receiveMode: t,
                    rightsInfo: a,
                    codeList: r,
                  })
                : "1300" === t
                ? (0, l.jsx)(de, { codeList: r, instructions: _ })
                : null
              : null,
            (0, l.jsxs)("div", {
              className: K,
              children: [
                (0, l.jsx)("div", {
                  className: q,
                  onClick: () => {
                    c.U.bpEverythingClick({
                      busName: "黄金会员",
                      moduleName: "领取成功弹窗",
                      pointPosition: "查看订单按钮",
                      nextUrl: "/orderList",
                    }),
                      v.x.navToPath("/orderList", { custOrderType: "9005" });
                  },
                  children: "查看订单",
                }),
                (0, l.jsx)("div", {
                  className: $,
                  onClick: d,
                  children: "我知道了",
                }),
              ],
            }),
          ],
        });
      }
      function ce(e) {
        var { onClose: s, onOrderBtnClick: n } = e;
        return (0, l.jsxs)("div", {
          className: ee,
          children: [
            (0, l.jsx)("div", { className: se, onClick: s }),
            (0, l.jsxs)("div", {
              className: ne,
              children: [
                (0, l.jsx)("img", {
                  src: "".concat(
                    gImgUrlPrefixLegacy,
                    "/rights/202303/5151d408-000a-4dc1-bc57-863697bc0a63-success.png"
                  ),
                  alt: "",
                  className: te,
                }),
                (0, l.jsx)("div", { className: w, children: "提交成功" }),
              ],
            }),
            (0, l.jsx)("div", {
              className: F,
              children: "您的订单已提交成功，订购结果详见短信。",
            }),
            (0, l.jsxs)("div", {
              className: K,
              children: [
                (0, l.jsx)("div", {
                  className: q,
                  onClick: n,
                  children: "查看订单",
                }),
                (0, l.jsx)("div", {
                  className: $,
                  onClick: s,
                  children: "关闭",
                }),
              ],
            }),
          ],
        });
      }
      function ue(e) {
        var {
            rightsInfo: s,
            custOrderId: n,
            open: t,
            onClose: a,
            onOrderBtnClick: o,
          } = e,
          d = (0, i.useMemo)(() => (0, u.xI)(s), [s]);
        return (0, l.jsx)(D.v, {
          open: t,
          children:
            "1100" === d || "1200" === d || "1300" === d
              ? (0, l.jsx)(re, {
                  open: t,
                  custOrderId: n,
                  receiveMode: d,
                  rightsInfo: s,
                  onClose: a,
                })
              : (0, l.jsx)(ce, { onClose: a, onOrderBtnClick: o }),
        });
      }
      var ve = a().memo(ue),
        _e = n(89321),
        he = n(33843),
        me = n(74219),
        fe = n(49965),
        ge = (e, s) => {
          var { bpOrderResp: n = _.l } = e,
            a = (0, fe.r)((e) => e.updateGoldIcons),
            h = (0, M.Mb)((e) => e.updateGoldRightsBagReceiveStatus),
            m = (0, M.Mb)((e) => {
              var s;
              return (
                0 ===
                (null === (s = e.goldRightsBagReceiveStatus) || void 0 === s
                  ? void 0
                  : s.canUse)
              );
            }),
            [f, g] = (0, i.useState)(),
            [x, p] = (0, i.useState)(!1),
            [N, C] = (0, i.useState)(!1),
            [j, b] = (0, i.useState)(!1),
            [I, O] = (0, i.useState)(!1),
            [k, y] = (0, i.useState)(!1),
            [R, S] = (0, i.useState)(""),
            [D, L] = (0, i.useState)(""),
            [B, T] = (0, i.useState)(0),
            { run: E, cancel: w } = (0, r.A)(
              (e) =>
                (0, t._)(function* () {
                  var s, n, t, l;
                  if ((T(B + 1), B >= 6))
                    return w(), T(0), O(!1), void v.x.navToPath("/orderList");
                  var i = yield (0, o.H7)({ custOrderId: e });
                  "0" === i.resultCode &&
                    ("1000" ===
                      (null === (n = i.data) ||
                      void 0 === n ||
                      null === (s = n.customerOrder) ||
                      void 0 === s
                        ? void 0
                        : s.statusCd) && (w(), T(0), O(!1), b(!0)),
                    "1200" ===
                      (null === (l = i.data) ||
                      void 0 === l ||
                      null === (t = l.customerOrder) ||
                      void 0 === t
                        ? void 0
                        : t.statusCd) &&
                      (w(), T(0), O(!1), he.R.openCommonOrderFailModal()));
                })(),
              { manual: !0, pollingInterval: 2e3, pollingWhenHidden: !1 }
            ),
            P = (0, i.useCallback)(
              (e) =>
                (0, t._)(function* () {
                  var s, t, i;
                  if (f) {
                    c.U.bpOrderConfirmButtonClick({
                      name: "".concat(null == f ? void 0 : f.legalRightsName),
                      goodsId: "".concat((0, u.Et)(f)),
                    });
                    var { verifyCode: o } = e,
                      r = {
                        rightCode: f.legalRightsNbr || "",
                        offerId: (0, u.Et)(f),
                      };
                    o && (r.verifyCode = o), p(!0);
                    var v = yield (0, d.BD)(r);
                    if (
                      (p(!1),
                      n(f, v),
                      "0" !== (null == v ? void 0 : v.resultCode))
                    )
                      "短信验证码错误" !== v.resultMsg
                        ? (C(!1),
                          "用户已无剩余参与次数" !==
                          (null == v ? void 0 : v.resultMsg)
                            ? -1 ===
                              (null == v ||
                              null === (s = v.resultMsg) ||
                              void 0 === s
                                ? void 0
                                : s.indexOf("库存"))
                              ? -1 ===
                                (null == v ||
                                null === (t = v.resultMsg) ||
                                void 0 === t
                                  ? void 0
                                  : t.indexOf("订购异常"))
                                ? -1 ===
                                  (null == v ||
                                  null === (i = v.resultMsg) ||
                                  void 0 === i
                                    ? void 0
                                    : i.indexOf("在途订单"))
                                  ? v.resultMsg.includes("权益订购次数限制") ||
                                    v.resultMsg.includes("权益订购金额限制")
                                    ? he.R.open({
                                        titleIcon: "warning",
                                        title: "温馨提示",
                                        content:
                                          "您30天内(非自然月)成功订购（含领取及购买）权益笔数或一个自然月内金额已达上限，请您下月再来。",
                                      })
                                    : he.R.openCommonOrderFailModal()
                                  : he.R.open({
                                      titleIcon: "warning",
                                      title: "温馨提示",
                                      content: (0, l.jsx)("div", {
                                        style: {
                                          fontSize: ".3rem",
                                          lineHeight: "1.5",
                                        },
                                        children: (0, l.jsx)("div", {
                                          children:
                                            "您当前有未完成的在途订单，系统无法为您订购本产品。 请您确认结束上笔订单后，再来领取/订购您的权益~",
                                        }),
                                      }),
                                    })
                                : he.R.open({
                                    titleIcon: "warning",
                                    title: "温馨提示",
                                    content: "现在订购繁忙，请稍后再试",
                                  })
                              : he.R.open({
                                  titleIcon: "warning",
                                  title: "温馨提示",
                                  content: "对不起办理失败，此产品库存不足",
                                })
                            : he.R.open({
                                titleIcon: "warning",
                                title: "温馨提示",
                                content:
                                  "本月权益福袋在其他活动页面已领取,请您下月再来",
                              }))
                        : ie.Z.info("验证码校验失败");
                    else {
                      var _;
                      C(!1);
                      var m,
                        g =
                          "1200" ===
                            (null == f ? void 0 : f.legalRightsSubordinate) &&
                          "1000" === (0, u.$N)(f);
                      L(
                        (null === (_ = v.data) || void 0 === _
                          ? void 0
                          : _.custOrderId) || ""
                      ),
                        g
                          ? (E(
                              (null === (m = v.data) || void 0 === m
                                ? void 0
                                : m.custOrderId) || ""
                            ),
                            O(!0))
                          : b(!0),
                        setTimeout(() => {
                          a(), h();
                        }, 2e3);
                    }
                  }
                })(),
              [n, f, E, a, h]
            ),
            F = (0, i.useCallback)(() => {
              C(!1);
            }, []),
            V = (0, i.useCallback)(() => {
              b(!1);
            }, []),
            W = (0, i.useCallback)(() => {
              c.U.bpEverythingClick({
                nextUrl: "/orderList",
                moduleName: "订购结果弹窗",
                pointPosition: "查看订单",
              }),
                v.x.navToPath("/orderList", { custOrderType: "9005" });
            }, []),
            z = (0, i.useCallback)(() => {
              w(), O(!1);
            }, [w]),
            H = (0, i.useCallback)(() => {
              w(), O(!1), v.x.navToPath("/orderList");
            }, [w]),
            U = (0, i.useCallback)(() => {
              y(!1), C(!0);
            }, []),
            Z = (0, i.useCallback)(() => {
              y(!1);
            }, []),
            G = (0, i.useCallback)(
              (e) =>
                (0, t._)(function* () {
                  if ((g(e), m)) C(!0);
                  else {
                    var s = (0, u.tR)(e);
                    if (s.length) return S(s), void y(!0);
                    C(!0);
                  }
                })(),
              [m]
            );
          return (
            (0, i.useImperativeHandle)(s, () => ({ select: G }), [G]),
            (0, l.jsxs)(l.Fragment, {
              children: [
                (0, l.jsx)(me.a, {
                  open: k,
                  content: R,
                  onClose: Z,
                  onCancel: Z,
                  onConfirm: U,
                  button: "确认领取",
                }),
                (0, l.jsx)(A, {
                  isOkButtonLoading: x,
                  rightsInfo: f,
                  open: N,
                  onClose: F,
                  onOk: P,
                }),
                (0, l.jsx)(_e.h, { open: I, onClose: z, onOk: H }),
                (0, l.jsx)(ve, {
                  rightsInfo: f,
                  custOrderId: D,
                  open: j,
                  onClose: V,
                  onOrderBtnClick: W,
                }),
              ],
            })
          );
        };
      ge.displayName = "OrderFlowGoldRB";
      var xe = (0, i.memo)((0, i.forwardRef)(ge));
    },
    62116(e, s, n) {
      n.d(s, { R: () => O });
      var t = n(13454),
        l = n(20837),
        i = n(86070),
        a = (n(30913), n(30176)),
        o = n(41486),
        d = "container___nLuYx",
        r = "inputWrap___A8dKM",
        c = "phone___NakaE",
        u = "input___mu1rr",
        v = "aInputContainer___xAtsr",
        _ = "aInput___PBDnz",
        h = "action___gpg7k",
        m = n(15189),
        f = n(17148),
        g = n(53487),
        x = n(73508);
      var p = n(64308),
        N = n(60707),
        C = n(59344),
        j = n(35574),
        b = n(31738),
        I = (e, s) => {
          var {
              wrapVisible: n,
              autoSendCodeWhenWrapOpen: I = !0,
              offerId: O,
              legalRightsNbr: k,
              phoneNo: y,
              style: R = {},
              inputStyle: S = {},
              inputWrapStyle: M = {},
              buttonStyle: D = {},
              legalRightsId: L,
              buttonTextColor: B = "#FD982A",
              codeInputColor: T = "#333",
              codeInputStyle: A = {},
              templateId: E,
              discount: w,
              onCheck: P = () => {},
              Mzone: F = !1,
              module: V = "",
              petroChina: W = !1,
              activeId: z,
            } = e,
            H = (0, o.useMemo)(() => {
              var e = {};
              return F
                ? ((e.legalRightsId = L), (e.module = V), e)
                : ((0, N.A)(E) || (e.templateId = E),
                  (0, N.A)(y) || (e.phoneNo = y),
                  (0, N.A)(w) || (e.discount = w),
                  (0, N.A)(z) || (e.activeId = z),
                  (0, N.A)(k)
                    ? ((0, N.A)(O) || (e.offerId = O), e)
                    : ((e.rightsCode = k), e));
            }, [F, E, y, w, k, O, z, L, V]),
            U = (0, o.useMemo)(
              () =>
                JSON.stringify({
                  templateId: E,
                  legalRightsNbr: k,
                  offerId: O,
                }),
              [k, O, E]
            ),
            Z = (0, j.nc)((e) => e.userInfo),
            G = (null == Z ? void 0 : Z.desensitizedPhoneNumber) || "",
            X = (0, o.useMemo)(() => (y ? (0, p.kM)(y) : G), [y, G]),
            Q = (function (e) {
              var { data: s } = (0, x.A)(
                () =>
                  (0, t._)(function* () {
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
              return s || 6;
            })(k),
            [J, Y] = (0, o.useState)(""),
            [K, q] = (0, f.A)("_RM_OV_NEED_VERIFY_".concat(U), {
              defaultValue: !1,
            }),
            [$, ee] = (0, o.useState)(),
            [se, ne] = (0, f.A)("_RM_OV_COUNTDOWN_GLOBAL", {
              defaultValue: void 0,
            }),
            [te, le] = (0, f.A)("_RM_OV_COUNTDOWN_START_GLOBAL", {
              defaultValue: void 0,
            }),
            [ie, ae] = (0, o.useState)(!1),
            [oe, de] = (0, o.useState)(!1),
            re = (0, o.useMemo)(
              () => (null == $ ? void 0 : $.includes("s")),
              [$]
            );
          (0, o.useEffect)(() => {
            if (te && se) {
              var e = Math.floor((Date.now() - te) / 1e3),
                s = Math.max(0, 60 - e);
              s > 0
                ? (ne(s), ee("".concat(s, "s")))
                : (ne(void 0), le(void 0), ee("重新发送验证码"));
            }
          }, [te, se, ne, ee, le]);
          var ce = (0, o.useCallback)(
              () =>
                (0, t._)(function* () {
                  return (
                    ee("发送中..."),
                    "0" ===
                    (W
                      ? yield (0, b.h)()
                      : F
                      ? yield (0, m.cW)(H)
                      : y
                      ? yield (0, m.BD)(H)
                      : yield (0, m.X9)(H)
                    ).resultCode
                      ? (C.Z.info("验证码已发送"),
                        ne(60),
                        le(Date.now()),
                        ee("".concat(60, "s")),
                        !0)
                      : (C.Z.info("验证码发送频繁，请稍后再试"),
                        ne(void 0),
                        le(void 0),
                        ee("重新发送验证码"),
                        !1)
                  );
                })(),
              [y, H, ne, ee, le, F, W]
            ),
            ue = (0, g.A)(
              () => {
                if ("number" == typeof se) {
                  if (se <= 1)
                    return ne(void 0), le(void 0), void ee("重新发送验证码");
                  ne(se - 1), ee("".concat(se - 1, "s"));
                }
              },
              se ? 1e3 : void 0
            ),
            ve = (0, o.useCallback)(() => {
              $ && ["重新发送验证码", "获取验证码"].includes($) && ce();
            }, [$, ce]),
            _e = (0, o.useCallback)(
              () =>
                (0, t._)(function* () {
                  if (!oe && !ie) {
                    ae(!0);
                    try {
                      if (W || y || F) P(!0), q(!0);
                      else {
                        var e = !!(yield (0, m.Y4)(H)).data;
                        P(e), q(e);
                      }
                    } finally {
                      ae(!1), de(!0);
                    }
                  }
                })(),
              [y, H, P, q, ie, oe, F, W]
            );
          (0, o.useEffect)(() => {
            n ? oe || _e() : Y("");
          }, [n, _e, oe]),
            (0, o.useEffect)(() => {
              n || (de(!1), ae(!1));
            }, [U, n]),
            (0, o.useEffect)(() => {
              if (n && K && oe && !re && "发送中..." !== $) {
                if ($) {
                  if ("重新发送验证码" === $) return;
                } else ee("获取验证码");
                !I || ($ && "获取验证码" !== $) || ce();
              }
            }, [n, K, re, $, I, ce, oe, ee]);
          var he = (0, o.useCallback)(() => {
              if (K)
                if (0 !== J.length) {
                  if (!(J.length < 4)) return J;
                  C.Z.info("验证码格式不正确");
                } else C.Z.info("请输入验证码");
            }, [J, K]),
            me = (0, o.useCallback)(() => {
              ne(void 0), le(void 0), ee("重新发送验证码"), ue();
            }, [ue, ne, ee, le]);
          return (
            (0, o.useImperativeHandle)(s, () => ({
              getVerificationCode: he,
              clearCountdown: me,
            })),
            n && K
              ? (0, i.jsxs)("div", {
                  className: d,
                  style: R,
                  children: [
                    (0, i.jsx)("div", { className: c, style: S, children: X }),
                    (0, i.jsxs)("div", {
                      className: r,
                      style: M,
                      children: [
                        (0, i.jsx)("div", {
                          className: u,
                          children: (0, i.jsx)(a.A, {
                            className: v,
                            inputClass: _,
                            inputStyle: (0, l._)({ color: T }, A),
                            type: "text",
                            maxLength: Q,
                            placeholder: "请输入验证码",
                            value: J,
                            clearable: !0,
                            border: "none",
                            onChange: (e, s) => Y(s),
                            onClear: () => Y(""),
                          }),
                        }),
                        (0, i.jsx)("div", {
                          className: h,
                          style: (0, l._)({ color: B }, D),
                          onClick: ve,
                          children: $,
                        }),
                      ],
                    }),
                  ],
                })
              : null
          );
        };
      I.displayName = "OrderValidator";
      var O = (0, o.forwardRef)(I);
    },
    31738(e, s, n) {
      n.d(s, { _: () => i, h: () => a });
      var t = n(13454),
        l = n(37740);
      function i() {
        return (0, t._)(function* () {
          return yield (0,
          l.t)({ abilityCode: "PETRO_CHINA_GET_HANDLE_INFO", data: {} });
        })();
      }
      function a() {
        return (0, t._)(function* () {
          return (0,
          l.t)({ abilityCode: "PETRO_CHINA_SEND_CONFIRM_CODE", data: {} });
        })();
      }
    },
  },
]);
