"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["2419"],
  {
    7518(e, n, t) {
      t.d(n, { X: () => m });
      var o = t(86070),
        a = t(41486),
        i = {
          modal: "modal___YkcQZ",
          close: "close___QQprw",
          closeIcon: "closeIcon___dbxHF",
          title: "title___yTh2l",
          exchange: "exchange___cz98c",
          number: "number___YtHx2",
          hintFont: "hintFont___lqaeo",
          phone: "phone___aPFJY",
          contreBox: "contreBox___T4Bu9",
          getwayButton: "getwayButton___UFQpt",
          contre: "contre___G1iBB",
          getWay: "getWay___CTZk9",
          hint: "hint___FFKn4",
          getButton: "getButton___dQLUG",
          getButtonGray: "getButtonGray___wUjZh",
          AFTER_15: "AFTER_15____3PJ_",
          toast: "toast___bylsW",
        },
        l = t(50050),
        u = t(95480),
        r = t(84910),
        s = t(20696),
        c = t(13526),
        d = t(90570),
        p = t(62033),
        _ = t(35574),
        v = t(39692),
        C = t(58349);
      function m(e) {
        var {
            open: n,
            initialCate: t = "auto",
            rightsInfo: m,
            QQVideoInfoCard: h,
            onClose: f = () => {},
            onOk: x = () => {},
            onAfterClose: g = () => {},
          } = e,
          y = (0, _.nc)((e) => e.userInfo),
          N = (null == y ? void 0 : y.desensitizedPhoneNumber) || "",
          I = (0, a.useMemo)(() => (0, r.H)(m, ["CERTIFICATE_0"]), [m]),
          [b, j] = (0, a.useState)(null),
          T = (0, a.useMemo)(() => (0, r.Uw)(m), [m]),
          L = I
            ? (0, o.jsxs)("div", {
                className: i.exchange,
                children: [
                  (0, o.jsx)("span", { className: i.number, children: "0" }),
                  (0, o.jsx)("span", { children: "元" }),
                ],
              })
            : (0, o.jsxs)("div", {
                className: i.exchange,
                children: [
                  (0, o.jsx)("span", {
                    className: i.number,
                    children: m.certificateNum,
                  }),
                  (0, o.jsx)("span", { children: "张兑换券" }),
                ],
              }),
          { isCouponEnough: U } = (0, l.C)(m),
          E = (0, a.useMemo)(
            () =>
              U
                ? null
                : T
                ? "您当前专属券不足，无法兑换"
                : "您当前兑换券不足，无法兑换",
            [U, T]
          ),
          M = (0, a.useMemo)(() => {
            if (!m || d.A(m)) return { text: "确认兑换", type: "OK" };
            if (!U)
              return T ? null : { text: "获取更多兑换券", type: "NO_COUPONS" };
            if ((0, r.H)(m, ["CERTIFICATE_0"])) {
              var e = (0, u.c)(m.orderStatus),
                n = "OK";
              return (
                "1" === m.orderStatus
                  ? (n = "AFTER_15")
                  : "2" === m.orderStatus && (n = "YEAR_LIMIT"),
                { text: e, type: n }
              );
            }
            var t = (0, r.uF)(m);
            if (
              (null == t ? void 0 : t.length) &&
              m.dailyExchangeTimes >= Number(t)
            )
              return {
                text: "您本日兑换已达上限(".concat(t, "次)"),
                type: "DAILY_LIMIT",
              };
            var o = (0, r.yx)(m);
            return (null == o ? void 0 : o.length) &&
              m.monthExchangeTimes >= Number(o)
              ? {
                  text: "您本月兑换已达上限(".concat(o, "次)"),
                  type: "MONTH_LIMIT",
                }
              : { text: "确认兑换", type: "OK" };
          }, [U, T, m]);
        return (0, o.jsx)(p.v, {
          open: n,
          onAfterClose: g,
          children: (0, o.jsxs)("div", {
            className: i.modal,
            children: [
              (0, o.jsx)("div", {
                className: i.close,
                onClick: f,
                children: (0, o.jsx)("img", {
                  className: i.closeIcon,
                  src: "".concat(
                    gImgUrlPrefixLegacy,
                    "/rights/202303/88f2bad3-261e-4392-bb49-bb38fe3b397b-close.png"
                  ),
                  alt: "",
                }),
              }),
              (0, o.jsxs)("div", {
                className: i.title,
                children: [
                  (0, o.jsx)("img", { src: (0, r.DO)(m, "330x182"), alt: "" }),
                  m.legalRightsName,
                ],
              }),
              L,
              (0, o.jsxs)("div", {
                className: i.hintFont,
                children: ["确认本月兑换", m.legalRightsName],
              }),
              (0, o.jsxs)("div", {
                className: i.phone,
                children: ["充值号码", (0, o.jsx)("span", { children: N })],
              }),
              (0, o.jsxs)("div", {
                className: i.contreBox,
                children: [
                  (0, o.jsxs)("div", {
                    className: i.contre,
                    children: [
                      "包含内容",
                      (0, o.jsx)("span", { children: m.legalRightsDesc }),
                    ],
                  }),
                  (0, o.jsxs)("div", {
                    className: i.getWay,
                    children: [
                      "领取方式",
                      (0, o.jsx)(C.s, { text: (0, r.TL)(m) }),
                    ],
                  }),
                  (0, r._R)(m)
                    ? (0, o.jsx)("div", {
                        className: i.getwayButton,
                        onClick: () => {
                          s.x.navToOuter((0, r._R)(m));
                        },
                        children: "获取卡密",
                      })
                    : null,
                ],
              }),
              h || null,
              (0, o.jsx)(v.o, {
                style: { marginTop: ".2rem" },
                layout: "vertical",
                rightsInfo: m,
                initialCate: t,
                onCertificateIdChange: j,
              }),
              E ? (0, o.jsx)("div", { className: i.hint, children: E }) : null,
              M
                ? (0, o.jsx)("div", {
                    className: (0, c.A)(
                      i.getButton,
                      "OK" !== M.type && i.getButtonGray,
                      i[M.type]
                    ),
                    onClick: () => {
                      if (M)
                        return "NO_COUPONS" === M.type
                          ? (f(), void s.x.navToPath("/activity/memberDosage"))
                          : void ("OK" === M.type && x(b));
                    },
                    children: M.text,
                  })
                : null,
            ],
          }),
        });
      }
    },
    39692(e, n, t) {
      t.d(n, { o: () => N });
      var o = t(86070),
        a = t(41486),
        i = {
          CouponSelector: "CouponSelector___Ihg9q",
          horizontal: "horizontal___OLoBS",
          vertical: "vertical___K4bNz",
          CouponsType: "CouponsType___Au0vp",
          Label: "Label___hhXFW",
          CouponsTypeGroupWrap: "CouponsTypeGroupWrap___VaIom",
        },
        l = t(62127),
        u = t(50050),
        r = t(62285);
      var s = t(13526),
        c = "CouponsTypeGroup___TAcXK",
        d = "CouponsTypeItem___RE47b",
        p = "Disabled___HIqU0",
        _ = "Active___iQBcU",
        v = (e) => {
          var { coupons: n, currentCouponCate: t, onCateChange: a } = e;
          return (0, o.jsx)("div", {
            className: c,
            children: n.map((e) =>
              (0, o.jsx)(
                "div",
                {
                  className: (0, s.A)(
                    d,
                    (null == t ? void 0 : t.type) === e.type && _,
                    e.disabled && p
                  ),
                  onClick: () => {
                    e.disabled || a(e);
                  },
                  children: e.name,
                },
                e.type
              )
            ),
          });
        },
        C = "RadioGroup___ONHab",
        m = "RadioItem___ceWyt",
        h = "RadioLabel___uS5RY",
        f = "RadioIcon___xo76r",
        x = "Active___AXBBR",
        g = (e) => {
          var {
            currentCouponCate: n,
            exclCouponCanUseList: t,
            currentExclCertificateId: a,
            onExclCertificateIdChange: i,
          } = e;
          return "excl" !== (null == n ? void 0 : n.type)
            ? null
            : (0, o.jsx)("div", {
                className: C,
                children: t.map((e) =>
                  (0, o.jsxs)(
                    "div",
                    {
                      className: m,
                      onClick: () => {
                        i(e.certificateId);
                      },
                      children: [
                        (0, o.jsx)("div", {
                          className: h,
                          children: e.offerName,
                        }),
                        (0, o.jsx)("div", {
                          className: (0, s.A)(f, e.certificateId === a && x),
                        }),
                      ],
                    },
                    e.certificateId
                  )
                ),
              });
        },
        y = t(63540),
        N = (e) => {
          var {
            style: n,
            rightsInfo: t,
            layout: c,
            initialCate: d = "auto",
            onCertificateIdChange: p,
          } = e;
          (0, l.x)([
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202412/184d5f7a-f594-40d2-803a-c822c8b6ca8c-1.png"
            ),
          ]);
          var _ = (0, r.F)((e) => {
              var n;
              return (
                (null === (n = e.coupon) || void 0 === n
                  ? void 0
                  : n.universalCouponCanUseNum) || 0
              );
            }),
            [C, m] = (0, a.useState)(null),
            [h, f] = (0, a.useState)(null),
            {
              hasCouponSelector: x,
              exclCouponCanUseList: N,
              exclCouponCanUseNum: I,
              uniCouponCanUseNum: b,
            } = (function (e) {
              var n = (0, a.useMemo)(
                  () => (null == e ? void 0 : e.certificateList) || [],
                  [null == e ? void 0 : e.certificateList]
                ),
                t = (0, r.F)((e) => {
                  var n;
                  return (
                    (null === (n = e.coupon) || void 0 === n
                      ? void 0
                      : n.exclusiveCouponList) || []
                  );
                }),
                o = (0, r.F)((e) => {
                  var n;
                  return (
                    (null === (n = e.coupon) || void 0 === n
                      ? void 0
                      : n.universalCouponList) || []
                  );
                }),
                { isCouponEnough: i } = (0, u.C)(e),
                l = (0, a.useMemo)(
                  () =>
                    (null == n
                      ? void 0
                      : n.filter((e) => "1002" === e.certificateType)) || [],
                  [n]
                ),
                s = (0, a.useMemo)(
                  () =>
                    (null == n
                      ? void 0
                      : n.filter((e) => "1001" === e.certificateType)) || [],
                  [n]
                ),
                c = (0, a.useMemo)(() => {
                  if (!i) return !1;
                  if (!l.length || !t.length) return !1;
                  var e = new Set(l.map((e) => e.certificateId));
                  return t.some((n) => e.has(n.certificateId));
                }, [t, i, l]),
                d = (0, a.useMemo)(
                  () =>
                    t.filter(
                      (e) =>
                        e.exclusiveCouponCanUseNum > 0 &&
                        l.some((n) => n.certificateId === e.certificateId)
                    ),
                  [l, t]
                ),
                p = (0, a.useMemo)(
                  () => d.reduce((e, n) => e + n.exclusiveCouponCanUseNum, 0),
                  [d]
                ),
                _ = (0, a.useMemo)(
                  () =>
                    o.filter(
                      (e) =>
                        e.universalCouponCanUseNum > 0 &&
                        s.some((n) => n.certificateId === e.certificateId)
                    ),
                  [s, o]
                ),
                v = (0, a.useMemo)(
                  () => _.reduce((e, n) => e + n.universalCouponCanUseNum, 0),
                  [_]
                );
              return {
                hasCouponSelector: c,
                exclCouponCanUseList: d,
                exclCouponCanUseNum: p,
                uniCouponCanUseList: _,
                uniCouponCanUseNum: v,
              };
            })(t),
            j = (0, a.useMemo)(() => {
              var e = [
                { type: "uni", name: "通兑券", disabled: !1 },
                { type: "excl", name: "专属兑换券", disabled: !1 },
              ];
              return (
                x &&
                  (_ <= 0 && (e[0].disabled = !0),
                  b <= 0 && (e[0].disabled = !0)),
                N.length || (e[1].disabled = !0),
                e
              );
            }, [N.length, x, b, _]),
            T = (0, a.useMemo)(
              () =>
                x
                  ? "uni" === (null == C ? void 0 : C.type)
                    ? y.z
                    : "excl" === (null == C ? void 0 : C.type)
                    ? h
                    : null
                  : y.z,
              [null == C ? void 0 : C.type, h, x]
            );
          return (
            (0, a.useEffect)(() => {
              if (x) {
                var e = b > 0 && _ > 0;
                m(
                  ("excl" === d && I > 0) || (!e && I > 0)
                    ? j[1]
                    : e
                    ? j[0]
                    : j[1]
                );
              }
            }, [j, I, x, d, b, _]),
            (0, a.useEffect)(() => {
              p(T);
            }, [T, p]),
            (0, a.useEffect)(() => {
              "excl" === (null == C ? void 0 : C.type) &&
                N.length &&
                f(N[0].certificateId);
            }, [null == C ? void 0 : C.type, N]),
            x
              ? (0, o.jsxs)("div", {
                  className: (0, s.A)(i.CouponSelector, i[c]),
                  style: n,
                  children: [
                    (0, o.jsx)("div", {
                      className: i.Label,
                      children: "选择兑换券",
                    }),
                    (0, o.jsxs)("div", {
                      className: i.CouponsTypeGroupWrap,
                      children: [
                        (0, o.jsx)(v, {
                          coupons: j,
                          currentCouponCate: C,
                          onCateChange: m,
                        }),
                        (0, o.jsx)(g, {
                          currentCouponCate: C,
                          exclCouponCanUseList: N,
                          currentExclCertificateId: h,
                          onExclCertificateIdChange: f,
                        }),
                      ],
                    }),
                  ],
                })
              : null
          );
        };
    },
    50050(e, n, t) {
      t.d(n, { C: () => u, R: () => l });
      var o = t(60762),
        a = t(41486),
        i = t(62285);
      function l(e, n) {
        var t = function (n) {
            if (0 === n.exchangeNum) return { v: !0 };
            if ("1001" === n.certificateType) {
              if (e.universalCouponCanUseNum >= n.exchangeNum) return { v: !0 };
            } else if ("1002" === n.certificateType) {
              var t = e.exclusiveCouponList.find(
                (e) => e.certificateId === n.certificateId
              );
              if (t && t.exclusiveCouponCanUseNum >= n.exchangeNum)
                return { v: !0 };
            }
          },
          a = (null == n ? void 0 : n.certificateList) || [],
          i =
            (null == n ? void 0 : n.certificateNum) ||
            (null == n ? void 0 : n.exchangeNum) ||
            0;
        if (!e) return !1;
        if (!(null == a ? void 0 : a.length))
          return "number" == typeof i && e.universalCouponCanUseNum >= i;
        for (var l of a) {
          var u = t(l);
          if ("object" === (0, o._)(u)) return u.v;
        }
        return !1;
      }
      function u(e) {
        var n = (0, i.F)((e) => e.coupon);
        return {
          isCouponEnough: (0, a.useMemo)(() => l(n, e), [n, e]),
          loading: null === n,
        };
      }
    },
    62127(e, n, t) {
      t.d(n, { x: () => l });
      var o = t(13454),
        a = t(53219),
        i = t(88229);
      var l = (e, n) => {
        (0, a.A)(() => {
          !(function (e, n) {
            (0, o._)(function* () {
              if (null == e ? void 0 : e.length) {
                n && n > 0 && (yield (0, i.y)(n));
                var t = [];
                !(function (e) {
                  for (var n = 0; n < e.length; n += 1)
                    (t[n] = new Image()), (t[n].src = e[n]);
                })(e);
              }
            })();
          })(e, n);
        });
      };
    },
    62285(e, n, t) {
      t.d(n, { F: () => r, H: () => s });
      var o = t(13454),
        a = t(41486),
        i = t(15189),
        l = t(99751),
        u = t(65059),
        r = (0, l.vt)()(
          (0, u.lt)(
            (e, n) => ({
              coupon: null,
              couponLoading: !1,
              updateCoupon: () =>
                (0, o._)(function* () {
                  e(() => ({ couponLoading: !0 }));
                  var n = yield (0, i.hM)();
                  n.data
                    ? e(() => ({ coupon: n.data, couponLoading: !1 }))
                    : e(() => ({ couponLoading: !1 }));
                })(),
            }),
            { name: "RM_COUPON_STORE" }
          )
        ),
        s = () => {
          var e = r((e) => e.coupon),
            n = r((e) => e.updateCoupon);
          return (
            (0, a.useEffect)(() => {
              n();
            }, [n]),
            { coupon: e }
          );
        };
    },
    95480(e, n, t) {
      function o(e) {
        return "0" !== e && "1" !== e && "2" !== e
          ? ""
          : {
              0: "立即领取",
              1: "请您于自领取之日起15日后再来领取",
              2: "您本年度领取已达上限（2次）",
            }[e];
      }
      t.d(n, { c: () => o });
    },
  },
]);
