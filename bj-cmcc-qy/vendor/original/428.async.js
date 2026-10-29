"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["428"],
  {
    86384(e, l, t) {
      t.d(l, { N: () => p, J: () => x });
      var a = t(86070),
        s = (t(41486), "OrderPayDiscountModal___lAiNA"),
        n = "tips___GW8cb",
        i = "orderIdWrap___PdX7f",
        r = "copyButton___lHohF",
        o = "endTime___hOc2p",
        d = t(15189),
        c = t(2307),
        u = t(54447),
        _ = t(891),
        g = t(64850),
        h = t(33843),
        v = t(58349),
        m = t(59344);
      function x(e) {
        (0, g.fx)()
          ? u.a.navigateTo({
              url: "/package-a/pages/pay-discount-exchange/index?id=".concat(e),
            })
          : c.t
              .openMiniProgram({
                userName: "gh_f66fe1a519f1",
                path: "/package-a/pages/pay-discount-exchange/index?id=".concat(
                  e
                ),
                miniProgramType: 0,
              })
              .catch(() => {
                m.Z.loading(),
                  (0, d.Az)({
                    path: "package-a/pages/pay-discount-exchange/index",
                    query: "id=".concat(e),
                    envVersion: "release",
                  })
                    .then((e) => {
                      var l;
                      m.Z.clear(),
                        (
                          null === (l = e.data) || void 0 === l
                            ? void 0
                            : l.startsWith("https")
                        )
                          ? (window.location.href = e.data)
                          : m.Z.info("跳转失败，请手动兑换");
                    })
                    .catch(() => {
                      m.Z.clear();
                    });
              });
      }
      function p(e) {
        var {
          open: l,
          orderId: t,
          tipsText: d,
          onClose: c,
          onAfterClose: u = () => {},
          endTime: g,
        } = e;
        return (0, a.jsx)(h.R.ControlledComponent, {
          open: l,
          title: "温馨提示",
          onClose: c,
          okButtonText: "存入卡包",
          onOk: () => {
            x(t);
          },
          onAfterClose: u,
          children: (0, a.jsxs)("div", {
            className: s,
            children: [
              (0, a.jsx)(v.s, { className: n, text: d }),
              (0, a.jsxs)("div", {
                className: i,
                children: [
                  (0, a.jsxs)("span", { children: ["订单号：", t] }),
                  (0, a.jsx)("div", {
                    className: r,
                    onClick: () => {
                      _.V.writeText({ text: t });
                    },
                    children: "复制",
                  }),
                ],
              }),
              g
                ? (0, a.jsxs)("div", {
                    className: o,
                    children: ["有效期至：", g],
                  })
                : null,
            ],
          }),
        });
      }
    },
    30650(e, l, t) {
      t.d(l, { s: () => T });
      var a = t(86070),
        s = (t(41486), "QrcodeModal___JTdVb"),
        n = "CloseButton___ZFAzD",
        i = "CloseIcon___Qm7ap",
        r = "Header___VFp9R",
        o = "Icon___lFqRA",
        d = "Name___AQ5_E",
        c = "Body___XS0Y0",
        u = "Footer___rX12Z",
        _ = "OkButton___PbtOA",
        g = "Tips___C8EYz",
        h = "QrCodeWrap___b9VO5",
        v = "QrCode___qB842",
        m = "Disabled___UJvEC",
        x = "QrCodeValue___EgFAj",
        p = "StatusText___fn0_p",
        f = "TimeText___TJQte",
        N = "QrCodeBadge___oG9Xz",
        b = t(93521),
        C = t(13526),
        j = t(62033),
        I = t(58349),
        R = t(88815);
      function S(e) {
        var { statusText: l } = e;
        return "已过期" === l
          ? (0, a.jsx)("div", { className: N, children: "二维码已失效" })
          : "已使用" === l
          ? (0, a.jsx)("div", { className: N, children: "二维码已使用" })
          : null;
      }
      function T(e) {
        var {
            open: l,
            startTime: t,
            icon: N,
            title: T,
            description: L,
            qrcodeValue: A,
            showQrcodeValue: B = !1,
            onOk: O,
            state: k,
            endTime: y,
          } = e,
          P =
            "1" === k
              ? "已使用"
              : (0, b._d)(y)
              ? "已过期"
              : "0" === k
              ? "待使用"
              : null,
          E =
            "已过期" === P
              ? "过期时间：".concat(y)
              : "待使用" === P
              ? "使用时间：".concat(t, " - ").concat(y)
              : null;
        return (0, a.jsx)(j.v, {
          open: l,
          children: (0, a.jsxs)("div", {
            className: s,
            children: [
              (0, a.jsx)("div", {
                className: n,
                onClick: O,
                children: (0, a.jsx)("img", {
                  className: i,
                  src: "".concat(
                    gImgUrlPrefixLegacy,
                    "/rights/202508/0c3bf088-359d-4ee2-8551-dbbb5297a76d-agea.png"
                  ),
                  alt: "",
                }),
              }),
              (0, a.jsxs)("div", {
                className: r,
                children: [
                  (0, a.jsx)("img", { className: o, src: N, alt: "" }),
                  (0, a.jsx)("div", { className: d, children: T }),
                ],
              }),
              (0, a.jsxs)("div", {
                className: c,
                children: [
                  (0, a.jsx)("div", {
                    className: g,
                    children: (0, a.jsx)(I.s, { text: L }),
                  }),
                  (0, a.jsxs)("div", {
                    className: h,
                    children: [
                      (0, a.jsx)("div", {
                        className: (0, C.A)(v, "待使用" !== P && m),
                        children: (0, a.jsx)(R.h, { value: A, size: 100 }),
                      }),
                      P ? (0, a.jsx)(S, { statusText: P }) : null,
                    ],
                  }),
                  (0, a.jsx)("div", { className: p, children: P }),
                  B ? (0, a.jsx)("div", { className: x, children: A }) : null,
                  E ? (0, a.jsx)("div", { className: f, children: E }) : null,
                ],
              }),
              (0, a.jsx)("div", {
                className: u,
                children: (0, a.jsx)("button", {
                  className: _,
                  type: "button",
                  onClick: O,
                  children: "我知道了",
                }),
              }),
            ],
          }),
        });
      }
    },
    89321(e, l, t) {
      t.d(l, { h: () => N });
      var a = t(13454),
        s = t(86070),
        n = (t(41486), "modal___dGXRS"),
        i = "withBanner___tLm_M",
        r = "head___f_Rlr",
        o = "body___zG9it",
        d = "foot___Wc9nv",
        c = "button___zQdqC",
        u = "closeButton___SktVn",
        _ = "okButton___REDgi",
        g = "banner___S1bHE",
        h = "bannerImage___bIMJJ",
        v = t(36847),
        m = t(73508),
        x = t(20696),
        p = t(13526),
        f = t(62033);
      function N(e) {
        var { open: l, hasBanner: t = !1, onClose: N, onOk: b } = e,
          { data: C } = (0, m.A)(
            () =>
              (0, a._)(function* () {
                var e;
                if (t) {
                  var l = yield (0, v.n3)("ResultsPagePop");
                  return (
                    null === (e = l.data) || void 0 === e ? void 0 : e.length
                  )
                    ? l.data[0]
                    : null;
                }
              })(),
            { refreshDeps: [t] }
          ),
          j = Boolean(t ? C && l : l);
        return (0, s.jsx)(f.v, {
          open: j,
          children: (0, s.jsxs)("div", {
            className: (0, p.A)(n, C && i),
            children: [
              (0, s.jsx)("div", { className: r, children: "订单处理中..." }),
              (0, s.jsxs)("div", {
                className: o,
                children: [
                  "您的订单正在处理中，请您耐心等待15秒，15秒如未刷新办理进度，请退出本页面。",
                  (0, s.jsx)("br", {}),
                  "订单结果详情见短信或点击查看订单。",
                ],
              }),
              (0, s.jsxs)("div", {
                className: d,
                children: [
                  (0, s.jsx)("div", {
                    className: (0, p.A)(c, u),
                    onClick: N,
                    children: "关闭",
                  }),
                  (0, s.jsx)("div", {
                    className: (0, p.A)(c, _),
                    onClick: b,
                    children: "查看订单",
                  }),
                ],
              }),
              C
                ? (0, s.jsx)("div", {
                    className: g,
                    onClick: () => {
                      x.x.navToOp({ data: C });
                    },
                    children: (0, s.jsx)("img", {
                      className: h,
                      src: "".concat(gImgUrlPrefixLegacy).concat(C.icon),
                      alt: "",
                    }),
                  })
                : null,
            ],
          }),
        });
      }
    },
    75105(e, l, t) {
      t.d(l, { Z: () => Qe });
      var a = t(13454),
        s = t(20837),
        n = t(43952),
        i = t(86070),
        r = t(41486),
        o = "resultBox___hCeX_",
        d = "close___H_BIg",
        c = "title___kAisI",
        u = "TTTicon___EY4M2",
        _ = "name___LcTlT",
        g = "content___xGXEc",
        h = "contentCode___F2hM0",
        v = "contentFont___JWq5L",
        m = "code___JeygD",
        x = "useCopy___QB0VG",
        p = "time___V9RYo",
        f = "contentExchange___XgcJB",
        N = "titleFz___CsJdC",
        b = "fz___Srzad",
        C = "CodeList___4UlrG",
        j = "phone___M8KaY",
        I = "ZTbutton___M3Hj7",
        R = "exchangeButton___Kmxr4",
        S = "bottomButton___TXn0o",
        T = "button1___jUQfC",
        L = "button2___UYgxr",
        A = t(12457),
        B = t(44418),
        O = t(73508),
        k = t(37592),
        y = t(95553),
        P = t(82647),
        E = t(21051),
        D = t(891),
        w = t(346),
        Y = t(84910),
        V = t(20696),
        G = t(88229),
        M = t(13526),
        H = t(60707),
        U = t(7518),
        Q = t(86384),
        F = t(30650),
        z = t(89321),
        X = t(62033),
        Z = t(33843),
        W = "popContent___Mlboc",
        q = "close___gLSUQ",
        J = "head___ySBvL",
        K = "subtitle___IzCgF",
        $ = "confirmButton___fEAT2",
        ee = "descWrap___G2BBk",
        le = "SpikeOP___BLZLz",
        te = "badge___tsHWT",
        ae = "content___jc76_",
        se = "rights___OATUa",
        ne = "period___u0GKd",
        ie = "count___i6uPR",
        re = t(52112),
        oe = t(77952);
      function de(e) {
        var {
            visible: l,
            currentRightsInfo: t,
            onClose: a,
            onOk: s,
            onAfterClose: n = () => {},
          } = e,
          [o, d] = (0, r.useState)();
        return (
          (0, r.useEffect)(() => {
            l &&
              t.legalRightsNbr &&
              (0, re.Y)(t.legalRightsNbr).then((e) => {
                var l;
                "0" === e.resultCode &&
                  d(
                    null === (l = e.data) || void 0 === l
                      ? void 0
                      : l.nextSeckillVO
                  );
              });
          }, [l, t]),
          (0, i.jsx)(X.v, {
            open: l,
            onAfterClose: n,
            children: (0, i.jsxs)("div", {
              className: W,
              children: [
                (0, i.jsx)("div", {
                  className: q,
                  onClick: a,
                  children: (0, i.jsx)("img", {
                    src: "".concat(
                      gImgUrlPrefixLegacy,
                      "/rights/202304/5a4d4cb1-b0ea-4f10-a2d9-4f3809e42c6a-12113213.png"
                    ),
                    alt: "",
                  }),
                }),
                (0, i.jsxs)("div", {
                  className: J,
                  children: [
                    (0, i.jsx)("img", {
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202304/508d5254-fd8e-4f74-9c73-a06986c4a0f8-2222.png"
                      ),
                      alt: "",
                    }),
                    (0, i.jsx)("span", { children: "领取失败" }),
                  ],
                }),
                (0, i.jsx)("div", {
                  className: K,
                  children: "秒杀产品已被抢光了，请关注下期秒杀活动。",
                }),
                (0, i.jsx)("div", {
                  className: ee,
                  children: (0, i.jsxs)("div", {
                    className: le,
                    children: [
                      (0, i.jsx)("div", { className: te }),
                      (0, i.jsxs)("div", {
                        className: ae,
                        children: [
                          (0, i.jsxs)("div", {
                            className: se,
                            children: [
                              (0, i.jsx)("img", {
                                src: t ? (0, Y.DO)(t, "211x151") : "",
                                alt: "",
                              }),
                              (0, i.jsx)("span", {
                                children: o ? o.rightsName : null,
                              }),
                            ],
                          }),
                          o
                            ? (0, i.jsx)("div", {
                                className: ne,
                                children: (0, i.jsx)("span", {
                                  children: (0, oe.Y)(
                                    null == o ? void 0 : o.seckillStartDate,
                                    null == o ? void 0 : o.seckillEndDate
                                  ),
                                }),
                              })
                            : null,
                          (0, i.jsxs)("div", {
                            className: ie,
                            children: [
                              o ? o.totalStockNum : "--",
                              "个 先到先得",
                            ],
                          }),
                        ],
                      }),
                    ],
                  }),
                }),
                (0, i.jsx)("div", {
                  className: $,
                  onClick: s,
                  children: "我知道了",
                }),
              ],
            }),
          })
        );
      }
      var ce = "recPopup___NSSv2",
        ue = "subtitle___I2W9e",
        _e = "desc___OVL4q",
        ge = "banner___v2krS",
        he = "status___tILTe",
        ve = "count___R3bAD",
        me = "period___tSR8y",
        xe = "actions___qMqnX",
        pe = "disabledButton___dbrCz",
        fe = "exchangeNow___yeH8r",
        Ne = "openVipButton___aDm_1",
        be = "notEnoughGroup___CG6Yk",
        Ce = "tips___lZ7Hc",
        je = "get___AiqtV",
        Ie = t(19694),
        Re = t(35574),
        Se = t(58349);
      function Te(e) {
        var {
            visible: l,
            currentRightsInfo: t,
            universalCouponCanUseNum: a,
            rightsNbr: s,
            onExchange: n = () => {},
            onBuyVip: o = () => {},
            onClose: d = () => {},
            onAfterClose: c = () => {},
          } = e,
          u = (0, Re.nc)((e) => e.userInfo),
          [_, g] = (0, r.useState)(!1),
          [h, v] = (0, r.useState)(null),
          m = () => {
            V.x.navToPath("/activity/memberDosage");
          },
          x = (0, r.useCallback)(() => {
            if (!Ie.A(h) && !H.A(h.seckillStartDate)) {
              var e = (0, oe.d)(h.seckillStartDate, h.seckillEndDate);
              g(e);
            }
          }, [h]),
          p = (0, r.useMemo)(
            () =>
              Ie.A(h)
                ? null
                : _
                ? (0, oe.Y)(h.seckillStartDate, h.seckillEndDate)
                : (0, oe.Y)(
                    h.nextSeckillVO.seckillStartDate,
                    h.nextSeckillVO.seckillEndDate
                  ),
            [_, h]
          );
        (0, r.useEffect)(() => {
          s &&
            (0, re.Y)(s).then((e) => {
              "0" === e.resultCode && v(e.data);
            });
        }, [s, l]),
          (0, r.useEffect)(() => {
            x();
          }, [x, h]);
        var f = (0, r.useMemo)(() => {
          var e = parseInt((0, Y.uF)(t), 10);
          return (null == u ? void 0 : u.isLocalPlus) ||
            (null == u ? void 0 : u.isLhPlus)
            ? _
              ? 0 === (null == h ? void 0 : h.curStockNum)
                ? (0, i.jsxs)("div", {
                    className: pe,
                    children: [
                      (0, i.jsx)("span", { children: "当日库存已领取完" }),
                      (0, i.jsxs)("span", {
                        children: ["每人限兑换 ", e, "次/日"],
                      }),
                    ],
                  })
                : t.dailyExchangeTimes >= e
                ? (0, i.jsxs)("div", {
                    className: pe,
                    children: [
                      (0, i.jsx)("span", { children: "您兑换次数已达上限" }),
                      (0, i.jsxs)("span", {
                        children: ["每人限兑换 ", e || "--", "次/日"],
                      }),
                    ],
                  })
                : t.certificateNum > a
                ? (0, i.jsxs)("div", {
                    className: be,
                    children: [
                      (0, i.jsx)("div", {
                        className: Ce,
                        children: "兑换券不足，无法兑换",
                      }),
                      (0, i.jsx)("div", {
                        className: je,
                        onClick: m,
                        children: "获取兑换券",
                      }),
                    ],
                  })
                : (0, i.jsxs)("div", {
                    className: fe,
                    onClick: n,
                    children: [
                      (0, i.jsx)("span", { children: "立即兑换" }),
                      (0, i.jsxs)("span", {
                        children: ["每人限兑换 ", e, "次/日"],
                      }),
                    ],
                  })
              : (0, i.jsxs)("div", {
                  className: pe,
                  children: [
                    (0, i.jsx)("span", { children: "即将开始" }),
                    (0, i.jsx)("span", {
                      children: "每人限兑换 ".concat(e, "次/日"),
                    }),
                  ],
                })
            : (0, i.jsx)("div", {
                className: Ne,
                onClick: o,
                children: "开通会员",
              });
        }, [
          t,
          null == u ? void 0 : u.isLocalPlus,
          null == u ? void 0 : u.isLhPlus,
          _,
          null == h ? void 0 : h.curStockNum,
          a,
          n,
          o,
        ]);
        return (0, i.jsx)(Z.R.ControlledComponent, {
          open: l && !Ie.A(h),
          onClose: d,
          title: _
            ? null == h
              ? void 0
              : h.rightsName
            : null == h
            ? void 0
            : h.nextSeckillVO.rightsName,
          titleIcon: t ? (0, Y.DO)(t, "211x151") : "",
          hasFoot: !1,
          bodyStyle: { width: "100%" },
          onAfterClose: c,
          children: (0, i.jsxs)("div", {
            className: ce,
            children: [
              (0, i.jsxs)("div", {
                className: ue,
                children: [t.certificateNum, "张兑换券"],
              }),
              (0, i.jsx)(Se.s, { className: _e, text: t ? (0, Y.TL)(t) : "" }),
              (0, i.jsxs)("div", {
                className: ge,
                children: [
                  (0, i.jsx)("div", {
                    className: he,
                    children: (0, i.jsx)("span", {
                      children: _ ? "秒杀中" : "秒杀预告",
                    }),
                  }),
                  (0, i.jsxs)("div", {
                    className: ve,
                    children: [
                      _
                        ? null == h
                          ? void 0
                          : h.curStockNum
                        : null == h
                        ? void 0
                        : h.nextSeckillVO.totalStockNum,
                      "个 先到先得",
                    ],
                  }),
                  (0, i.jsx)("div", { className: me, children: p }),
                ],
              }),
              (0, i.jsx)("div", { className: xe, children: f }),
            ],
          }),
        });
      }
      var Le = "popContent___IwKvs",
        Ae = "subtitle___HmHE5",
        Be = "descWrap___t3zXp",
        Oe = "desc___Ofi4S",
        ke = "codeList___w3xnc",
        ye = "codeRow___PNjRe",
        Pe = "copyButton___FpLjo",
        Ee = t(95526);
      function De(e) {
        var {
          visible: l,
          codeList: t,
          currentRightsInfo: a,
          onClose: s,
          onOk: n,
          onAfterClose: r = () => {},
        } = e;
        return (0, i.jsx)(Z.R.ControlledComponent, {
          open: l,
          titleIcon: "success",
          title: "领取成功",
          onClose: s,
          okButtonText: "我知道了",
          onOk: n,
          onAfterClose: r,
          children: (0, i.jsxs)("div", {
            className: Le,
            children: [
              (0, i.jsx)("div", {
                className: Ae,
                children: "中石化加油权益包",
              }),
              (0, i.jsxs)("div", {
                className: Be,
                children: [
                  (0, i.jsx)(Se.s, { className: Oe, text: (0, Y.TL)(a) }),
                  (0, i.jsx)("div", {
                    className: ke,
                    children: Ee.A(t)
                      ? null == t
                        ? void 0
                        : t.map((e, l) => {
                            var t;
                            return (0, i.jsxs)(
                              "div",
                              {
                                className: ye,
                                children: [
                                  (0, i.jsxs)("span", {
                                    children: [
                                      "兑换码：",
                                      (
                                        null == e ||
                                        null === (t = e.cardPwd) ||
                                        void 0 === t
                                          ? void 0
                                          : t.length
                                      )
                                        ? null == e
                                          ? void 0
                                          : e.cardPwd
                                        : null == e
                                        ? void 0
                                        : e.cardNo,
                                    ],
                                  }),
                                  (0, i.jsx)("div", {
                                    className: Pe,
                                    onClick: () => {
                                      var l;
                                      "1" !== e.state &&
                                        D.V.writeText({
                                          text: (
                                            null == e ||
                                            null === (l = e.cardPwd) ||
                                            void 0 === l
                                              ? void 0
                                              : l.length
                                          )
                                            ? null == e
                                              ? void 0
                                              : e.cardPwd
                                            : null == e
                                            ? void 0
                                            : e.cardNo,
                                        });
                                    },
                                    children: "复制",
                                  }),
                                ],
                              },
                              l
                            );
                          })
                      : null,
                  }),
                ],
              }),
            ],
          }),
        });
      }
      var we = t(74219),
        Ye = t(23871),
        Ve = t(59344),
        Ge = t(62285),
        Me = t(63540),
        He = t(5168);
      var Ue = (e, l) => {
        var t,
          W,
          q,
          J,
          {
            bpOrderResp: K = G.l,
            initialCate: $ = "auto",
            onOrderSuccess: ee = G.l,
          } = e,
          le = (0, Re.nc)((e) => e.userInfo),
          te =
            6 !== (null == le ? void 0 : le.starValue) &&
            7 !== (null == le ? void 0 : le.starValue) &&
            8 !== (null == le ? void 0 : le.starValue),
          ae = (0, r.useRef)(),
          se =
            (0, Ge.F)((e) => {
              var l;
              return null === (l = e.coupon) || void 0 === l
                ? void 0
                : l.universalCouponCanUseNum;
            }) || 0,
          ne = (0, Ge.F)((e) => e.updateCoupon),
          [ie, re] = (0, r.useState)(""),
          [oe, ce] = (0, r.useState)({}),
          ue =
            "QY1650613475930" === (null == oe ? void 0 : oe.legalRightsNbr) ||
            "QY1708589422101" === (null == oe ? void 0 : oe.legalRightsNbr),
          [_e, ge] = (0, r.useState)(null),
          { getSeckillRightList: he } = (0, y.p)({ queryList: !0 }),
          { isCurrentSelectedRightsInSeckill: ve } = (function (e) {
            var { getSeckillRightList: l } = (0, y.p)({ queryList: !0 }),
              [t, a] = (0, r.useState)(!1);
            return (
              (0, r.useEffect)(() => {
                var t = l(),
                  s =
                    (null == t
                      ? void 0
                      : t.find((l) => l.rightsNbr === e.legalRightsNbr)) ||
                    (null == t
                      ? void 0
                      : t.find(
                          (l) => l.nextSeckillVO.rightsNbr === e.legalRightsNbr
                        ));
                a(!!s);
              }, [e, l]),
              { isCurrentSelectedRightsInSeckill: t }
            );
          })(oe),
          [me, xe] = (0, r.useState)(!1),
          [pe, fe] = (0, r.useState)(!1),
          [Ne, be] = (0, r.useState)(!1),
          [Ce, je] = (0, r.useState)(!1),
          [Ie, Le] = (0, r.useState)(),
          [Ae, Be] = (0, r.useState)(!1),
          [Oe, ke] = (0, r.useState)(!1),
          [ye, Pe] = (0, r.useState)(!1),
          [Ee, Ue] = (0, r.useState)(!1),
          [Qe, Fe] = (0, r.useState)(!1),
          [ze, Xe] = (0, r.useState)({
            open: !1,
            orderId: "",
            tipsText: "",
            endTime: "",
          }),
          {
            wxAuth: Ze,
            setWxAuth: We,
            needShowWxAuthModal: qe,
          } = (0, k.y)(oe.legalRightsNbr),
          [Je, Ke] = (0, r.useState)(0),
          { run: $e, cancel: el } = (0, O.A)(
            (e) =>
              (0, a._)(function* () {
                var l, t, a, s;
                if ((Ke(Je + 1), Je >= 6))
                  return el(), Ke(0), Fe(!1), void V.x.navToPath("/orderList");
                var n = yield (0, A.H7)({ custOrderId: e });
                if ("0" === n.resultCode) {
                  if (
                    "1000" ===
                    (null === (t = n.data) ||
                    void 0 === t ||
                    null === (l = t.customerOrder) ||
                    void 0 === l
                      ? void 0
                      : l.statusCd)
                  ) {
                    if ((el(), Ke(0), Fe(!1), "1500" === (0, Y.xI)(oe))) {
                      try {
                        var i,
                          r,
                          o = yield (0, A.AQ)({
                            busiNbr: "LegalRights",
                            custOrderType: "9003",
                          });
                        if (
                          !(null === (i = o.data) || void 0 === i
                            ? void 0
                            : i.couponRecodeList.length)
                        )
                          return;
                        var { custOrderId: d } = o.data.couponRecodeList[0];
                        Xe({
                          open: !0,
                          tipsText: (0, Y.GU)(oe),
                          orderId: d,
                          endTime: (0, E.Yq)(
                            null === (r = oe.custOrderAttrs) || void 0 === r
                              ? void 0
                              : r.expTime
                          ),
                        });
                      } catch (e) {}
                      return;
                    }
                    if (
                      (null == n ? void 0 : n.data.resourceCode) &&
                      null !== (null == n ? void 0 : n.data.resourceCode) &&
                      "" !== (null == n ? void 0 : n.data.resourceCode) &&
                      "QY1683717381999" !== oe.legalRightsNbr &&
                      "QY1632823068390" !== oe.legalRightsNbr &&
                      "1000" !== (0, Y.xI)(oe)
                    ) {
                      var c = (0, w.L)(n.data.resourceCode),
                        u = n.data.expTime ? (0, E.Yq)(n.data.expTime) : "";
                      if (c.length) {
                        var _ = c.map((e) => ({
                          cardPwd: e,
                          endDate: u,
                          state: "0",
                        }));
                        Le(_);
                      }
                    }
                    (0, E.w3)((0, Y.xI)(oe)) ? Ue(!0) : be(!0);
                  }
                  "1200" ===
                    (null === (s = n.data) ||
                    void 0 === s ||
                    null === (a = s.customerOrder) ||
                    void 0 === a
                      ? void 0
                      : a.statusCd) &&
                    (el(), Ke(0), Fe(!1), Z.R.openCommonOrderFailModal());
                }
              })(),
            { manual: !0, pollingInterval: 2e3, pollingWhenHidden: !1 }
          ),
          ll = (0, r.useCallback)(
            (e) =>
              (0, a._)(function* () {
                xe(!0);
                var l = yield (0, B.wk)(e);
                if (
                  (xe(!1),
                  K(oe, l),
                  fe(!1),
                  Be(!1),
                  "0" !== (null == l ? void 0 : l.resultCode))
                )
                  -1 === l.resultMsg.indexOf("库存")
                    ? -1 === l.resultMsg.indexOf("在途订单")
                      ? "-10001" !== (null == l ? void 0 : l.resultCode)
                        ? "-10002" !== (null == l ? void 0 : l.resultCode)
                          ? "BIZ-SECKILL-1001" !==
                            (null == l ? void 0 : l.resultCode)
                            ? "BIZ-SECKILL-1002" !==
                              (null == l ? void 0 : l.resultCode)
                              ? (null == l
                                  ? void 0
                                  : l.resultMsg.includes("权益订购次数限制")) ||
                                (null == l
                                  ? void 0
                                  : l.resultMsg.includes("权益订购金额限制"))
                                ? Z.R.open({
                                    titleIcon: "warning",
                                    title: "温馨提示",
                                    content:
                                      "您30天内(非自然月)成功订购（含领取及购买）权益笔数或一个自然月内金额已达上限，请您下月再来。",
                                  })
                                : Z.R.openCommonOrderFailModal()
                              : Pe(!0)
                            : Z.R.open({
                                titleIcon: "warning",
                                title: "温馨提示",
                                content: "秒杀还未开始，请稍后再试",
                              })
                          : Z.R.open({
                              titleIcon: "warning",
                              title: "温馨提示",
                              content: "现在系统繁忙，请稍后再试",
                            })
                        : Z.R.open({
                            titleIcon: "warning",
                            title: "温馨提示",
                            content: (0, i.jsxs)("div", {
                              style: { fontSize: ".28rem", lineHeight: "1.5" },
                              children: [
                                (0, i.jsx)("div", {
                                  children:
                                    "对不起，办理失败，可能是以下原因：",
                                }),
                                (0, i.jsx)("div", {
                                  children: "1、您的号码已欠费停机；",
                                }),
                                (0, i.jsx)("div", {
                                  children:
                                    "2、您不符合办理条件，如有疑问请拨打10086。",
                                }),
                              ],
                            }),
                          })
                      : Z.R.open({
                          titleIcon: "warning",
                          title: "温馨提示",
                          content: (0, i.jsx)("div", {
                            style: { fontSize: ".3rem", lineHeight: "1.5" },
                            children: (0, i.jsx)("div", {
                              children:
                                "您当前有未完成的在途订单，系统无法为您订购本产品。 请您确认结束上笔订单后，再来领取/订购您的权益~",
                            }),
                          }),
                        })
                    : Z.R.open({
                        titleIcon: "warning",
                        title: "温馨提示",
                        content: "对不起办理失败，此产品库存不足",
                      });
                else {
                  if (
                    (ee(oe, l),
                    ne(),
                    "1" === (0, Y.BK)(oe) ||
                      "QY1670293878985" === oe.legalRightsNbr)
                  )
                    return;
                  var t, a;
                  if (
                    (("1100" === (0, Y.xI)(oe) ||
                      "1200" === (0, Y.xI)(oe) ||
                      "1300" === (0, Y.xI)(oe) ||
                      ve) &&
                      (0, A.tv)({
                        extOrderId:
                          (null === (t = l.data) || void 0 === t
                            ? void 0
                            : t.custOrderId) || "",
                        extCustOrderId:
                          (null === (a = l.data) || void 0 === a
                            ? void 0
                            : a.custOrderId) || "",
                        sku: oe.legalRightsNbr,
                      }).then((e) => {
                        "0" === e.resultCode && Le(e.data);
                      }),
                    ve)
                  )
                    ke(!0);
                  else if (
                    "1200" === oe.legalRightsSubordinate &&
                    "1000" === (0, Y.$N)(oe)
                  )
                    Fe(!0),
                      setTimeout(() => {
                        var e;
                        $e(
                          (null === (e = l.data) || void 0 === e
                            ? void 0
                            : e.custOrderId) || ""
                        );
                      }, 4e3);
                  else {
                    if ("1500" === (0, Y.xI)(oe)) {
                      try {
                        var s,
                          n,
                          r = yield (0, A.AQ)({
                            busiNbr: "LegalRights",
                            custOrderType: "9003",
                          });
                        if (
                          !(null === (s = r.data) || void 0 === s
                            ? void 0
                            : s.couponRecodeList.length)
                        )
                          return;
                        var { custOrderId: o } = r.data.couponRecodeList[0];
                        Xe({
                          open: !0,
                          tipsText: (0, Y.GU)(oe),
                          orderId: o,
                          endTime: (0, E.Yq)(
                            null === (n = oe.custOrderAttrs) || void 0 === n
                              ? void 0
                              : n.expTime
                          ),
                        });
                      } catch (e) {}
                      return;
                    }
                    be(!0);
                  }
                }
              })(),
            [K, oe, ee, ne, ve, $e]
          ),
          tl = (0, r.useCallback)(
            (e) =>
              (0, a._)(function* () {
                var l = (0, Y.Cg)(e);
                if (
                  (0, Y.h1)({
                    belongAreas: l,
                    targetAreas: ["ACT_N_CHOOSE_2"],
                  }) ||
                  "QY1712920184378" === e.legalRightsNbr
                )
                  V.x.navToPath("/activity/MultipleGoodDetail");
                else if (
                  (0, Y.h1)({ belongAreas: l, targetAreas: ["Sport_Area"] })
                )
                  V.x.navToPath("/SportZone/goodDetail", {
                    legalRightsNbr: e.legalRightsNbr,
                  });
                else if (
                  (0, Y.h1)({ belongAreas: l, targetAreas: ["zw_1003"] })
                )
                  V.x.utils.navToZWPage(e);
                else if (
                  te &&
                  (0, Y.h1)({ belongAreas: l, targetAreas: ["GLOBAL_67_ONLY"] })
                )
                  Z.R.open({
                    title: (0, i.jsx)("img", {
                      style: {
                        width: "2.84rem",
                        height: ".72rem",
                        position: "relative",
                        top: "-0.4rem",
                      },
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202410/724c5aed-b6ee-4692-b12d-2b2ee1b046d4-01.png"
                      ),
                      alt: "",
                    }),
                    style: { borderRadius: ".3rem" },
                    cancelButtonStyle: {
                      borderColor: "#CE9064",
                      color: "#CE9064",
                    },
                    okButtonStyle: {
                      backgroundImage:
                        "linear-gradient(to bottom, #F4CA9B, #BA8354)",
                    },
                    content:
                      "尊敬的客户您好！本权益为全球通钻石卡/白金卡专属权益，升级为全球通钻石卡或白金卡身份即可领取。",
                    hasClose: !0,
                    hasCancelButton: !0,
                    okButtonText: "升级身份",
                    cancelButtonText: "我知道了",
                    onOk() {
                      V.x.navToZGYD(
                        "https://h.app.coc.10086.cn/activity/transferXcx/index.html?platform=cmcc&appId=6413852282228128&path=pages%2Findex%2Findex&pageId=1879370128044171264&channelId=P00000010862"
                      );
                    },
                  });
                else {
                  ce(e);
                  var t = he(),
                    a =
                      (null == t
                        ? void 0
                        : t.find((l) => l.rightsNbr === e.legalRightsNbr)) ||
                      (null == t
                        ? void 0
                        : t.find(
                            (l) =>
                              l.nextSeckillVO.rightsNbr === e.legalRightsNbr
                          ));
                  if (!H.A(a)) return Be(!0), void ge(e.legalRightsNbr);
                  var s = (0, Y.tR)(e);
                  re(s),
                    s.length ? je(!0) : qe ? We({ modalVisible: !0 }) : fe(!0);
                }
              })(),
            [he, te, qe, We]
          );
        return (
          (0, r.useImperativeHandle)(l, () => ({ select: tl }), [tl]),
          (0, i.jsxs)(i.Fragment, {
            children: [
              (0, i.jsx)(U.X, {
                initialCate: $,
                QQVideoInfoCard: (0, i.jsx)(Ye.r.InfoCard, {
                  visible: qe,
                  bindFlag: Ze.bindFlag,
                  isAgreeAuth: Ze.isAgreeAuth,
                  avatar: Ze.avatar,
                  nickname: Ze.nickname,
                  style: { margin: ".2rem auto 0", width: "6.2rem" },
                }),
                open: pe,
                rightsInfo: oe,
                onClose: () => fe(!1),
                onOk: (e) => {
                  me ||
                    (e &&
                      (P.U.bpOrderConfirmButtonClick({
                        name: "".concat(oe.legalRightsName),
                        goodsId: (0, Y.Et)(oe),
                      }),
                      "QY1678678370439" === oe.legalRightsNbr
                        ? (0, A.sA)({ rightsCode: "QY1678678370439" }).then(
                            (l) => {
                              "0" === l.resultCode
                                ? ll({
                                    offerId: (0, Y.Et)(oe),
                                    rightCode: oe.legalRightsNbr,
                                    rightId: oe.legalRightsId,
                                    certificateId: e,
                                    certificateNum: oe.certificateNum,
                                  })
                                : "Business Failed活动关联凭证查询失败" ===
                                  l.resultMsg
                                ? Z.R.open({
                                    titleIcon: "warning",
                                    title: "温馨提示",
                                    content:
                                      "权益兑换失败，请确认是否已注册支付宝账号或建议选择兑换其他权益。",
                                  })
                                : "作弊用户, 校验结果=ANTICHEAT_HIGHRISK" ===
                                  l.resultMsg
                                ? Z.R.open({
                                    titleIcon: "warning",
                                    title: "温馨提示",
                                    content:
                                      "由于支付宝账号异常，权益兑换失败，请您选择其他权益兑换或联系支付宝客服。",
                                  })
                                : Z.R.open({
                                    titleIcon: "warning",
                                    title: "温馨提示",
                                    content:
                                      "权益兑换失败，建议选择兑换其他权益。温馨提示：请确认支付宝账号是否已完成实名认证等流程。",
                                  });
                            }
                          )
                        : ll({
                            offerId: (0, Y.Et)(oe),
                            rightCode: oe.legalRightsNbr,
                            rightId: oe.legalRightsId,
                            certificateId: e,
                            certificateNum: oe.certificateNum,
                          })));
                },
              }),
              (0, i.jsx)(X.v, {
                open: Ne,
                children: (0, i.jsxs)("div", {
                  className: o,
                  children: [
                    (0, i.jsx)("div", {
                      className: d,
                      onClick: () => {
                        be(!1);
                      },
                    }),
                    (0, i.jsxs)("div", {
                      className: c,
                      children: [
                        (0, i.jsx)("span", { className: u }),
                        "领取成功",
                      ],
                    }),
                    (0, i.jsx)("div", {
                      className: _,
                      children: He.ArrayMigu.includes(oe.legalRightsNbr)
                        ? "您的订单，及咪咕视频月会员（赠品）订单已提交成功，订购结果详见短信或查看订单。"
                        : "已成功领取【".concat(oe.legalRightsName, "】"),
                    }),
                    "1100" === (0, Y.xI)(oe) &&
                    (null == Ie ? void 0 : Ie.length)
                      ? (0, i.jsxs)("div", {
                          className: h,
                          children: [
                            (0, i.jsx)("div", {
                              className: c,
                              children: "已自动帮您复制券码",
                            }),
                            (0, i.jsx)(Se.s, {
                              className: v,
                              text: (0, Y.GU)(oe),
                            }),
                            Ie.map((e, l) =>
                              (0, i.jsxs)(
                                "div",
                                {
                                  className: m,
                                  children: ["兑换码：", e.cardPwd],
                                },
                                l
                              )
                            ),
                            Ie[0].endDate
                              ? (0, i.jsxs)("div", {
                                  className: p,
                                  children: ["有效期至：", Ie[0].endDate],
                                })
                              : null,
                          ],
                        })
                      : "1300" === (0, Y.xI)(oe) &&
                        (null == Ie ? void 0 : Ie.length)
                      ? (0, i.jsxs)("div", {
                          className: h,
                          children: [
                            (0, i.jsx)("div", {
                              className: c,
                              children: "已自动帮您复制链接",
                            }),
                            (0, i.jsx)(Se.s, {
                              className: v,
                              text: (0, Y.GU)(oe),
                            }),
                            Ie.map((e, l) =>
                              (0, i.jsxs)(
                                "div",
                                {
                                  className: m,
                                  children: ["账号绑定链接：", e.cardPwd],
                                },
                                l
                              )
                            ),
                            Ie[0].endDate
                              ? (0, i.jsxs)("div", {
                                  className: p,
                                  children: ["有效期至：", Ie[0].endDate],
                                })
                              : null,
                          ],
                        })
                      : "1200" === (0, Y.xI)(oe) &&
                        (null == Ie ? void 0 : Ie.length)
                      ? (0, i.jsxs)("div", {
                          className: f,
                          children: [
                            (0, i.jsxs)("div", {
                              className: N,
                              children: [
                                "请点击",
                                (0, i.jsx)("span", {
                                  className: b,
                                  children: "“复制”",
                                }),
                                "按钮，粘贴到兑换处进行兑换",
                              ],
                            }),
                            (0, i.jsx)("div", {
                              className: C,
                              children: Ie.map((e, l) =>
                                (0, i.jsxs)(
                                  "div",
                                  {
                                    className: m,
                                    children: [
                                      "兑换码：",
                                      e.cardPwd ? e.cardPwd : null,
                                      e.cardNo ? e.cardNo : null,
                                      (0, i.jsx)("span", {
                                        className: (0, M.A)({
                                          [x]: "1" === e.state,
                                        }),
                                        onClick: () => {
                                          "1" !== e.state &&
                                            D.V.writeText({
                                              text: e.cardPwd
                                                ? e.cardPwd
                                                : e.cardNo,
                                            });
                                        },
                                        children:
                                          "1" === e.state ? "已使用" : "复制",
                                      }),
                                    ],
                                  },
                                  l
                                )
                              ),
                            }),
                            Ie[0].endDate
                              ? (0, i.jsxs)("div", {
                                  className: p,
                                  children: ["有效期至：", Ie[0].endDate],
                                })
                              : null,
                            (0, i.jsx)("input", {
                              className: j,
                              type: "text",
                              value:
                                null == le
                                  ? void 0
                                  : le.desensitizedPhoneNumber,
                              disabled: !0,
                              style: { color: "#666" },
                            }),
                            (0, i.jsx)("input", {
                              type: "text",
                              ref: (e) => {
                                ae = e;
                              },
                              className: I,
                              placeholder: "粘贴券码在此处进行兑换",
                            }),
                            (0, i.jsx)("div", {
                              className: R,
                              onClick: () => {
                                var e;
                                (e = ae.value),
                                  (0, a._)(function* () {
                                    if (
                                      !(null == Ie
                                        ? void 0
                                        : Ie.every((e) => "1" === e.state))
                                    ) {
                                      var l = yield (0, A.Q)({
                                          cardNo:
                                            (null == le
                                              ? void 0
                                              : le.phoneNo) || "",
                                          cardCode: e,
                                          sku: oe.legalRightsNbr,
                                        }),
                                        t = !1;
                                      try {
                                        var a, i;
                                        t =
                                          "0" ===
                                          (null === (i = JSON.parse(l.data)) ||
                                          void 0 === i ||
                                          null === (a = i.body) ||
                                          void 0 === a
                                            ? void 0
                                            : a.chargeState);
                                      } catch (e) {}
                                      if (t) {
                                        Ve.Z.success("兑换成功");
                                        var r = Ie.map((l) =>
                                          l.cardPwd === e
                                            ? (0, n._)((0, s._)({}, l), {
                                                state: "1",
                                              })
                                            : l
                                        );
                                        Le(r);
                                      } else Ve.Z.info("兑换失败，请稍后再试");
                                    }
                                  })();
                              },
                              children: "立即兑换",
                            }),
                          ],
                        })
                      : (0, i.jsx)(Se.s, { className: g, text: (0, Y.GU)(oe) }),
                    (0, i.jsxs)("div", {
                      className: S,
                      children: [
                        (0, i.jsx)("div", {
                          className: T,
                          onClick: () => {
                            be(!1),
                              P.U.bpEverythingClick({
                                envName: "订单页",
                                event: "首页_权益兑换成功弹窗_查看订单按钮",
                                nextUrl: "/orderList",
                                moduleName: "查看订单",
                                pointPosition: "跳转按钮",
                              }),
                              V.x.navToPath("/orderList");
                          },
                          children: "查看订单",
                        }),
                        (0, i.jsx)("div", {
                          className: L,
                          onClick: () => {
                            ue &&
                              (P.U.bpEverythingClick({
                                nextUrl: "https://mpf.tuopukeji.cn/food-zone/",
                                moduleName: "订购结果弹窗",
                                pointPosition: "查看并使用按钮",
                              }),
                              V.x.navToOuter(
                                "https://mpf.tuopukeji.cn/food-zone/"
                              )),
                              be(!1);
                          },
                          children: ue ? "查看并使用" : "我知道了",
                        }),
                      ],
                    }),
                  ],
                }),
              }),
              (0, i.jsx)(z.h, {
                open: Qe,
                onClose: () => {
                  Fe(!1);
                },
                onOk: () => {
                  Fe(!1), V.x.navToPath("/orderList");
                },
              }),
              (0, i.jsx)(we.a, {
                open: Ce,
                content: ie,
                contentStyle: { fontSize: ".28rem", lineHeight: "1.5" },
                onClose: () => je(!1),
                onCancel: () => je(!1),
                onConfirm: () => {
                  je(!1), qe ? We({ modalVisible: !0 }) : fe(!0);
                },
                button: "确认兑换",
              }),
              (0, i.jsx)(F.s, {
                open: Ee,
                icon: (0, Y.DO)(oe, "330x182"),
                title: oe.legalRightsName,
                description: (0, Y.GU)(oe),
                qrcodeValue: (null == Ie ? void 0 : Ie.length)
                  ? null === (t = Ie[0]) || void 0 === t
                    ? void 0
                    : t.cardPwd
                  : "",
                endTime: (null == Ie ? void 0 : Ie.length)
                  ? null === (W = Ie[0]) || void 0 === W
                    ? void 0
                    : W.endDate
                  : "",
                startTime: (null == Ie ? void 0 : Ie.length)
                  ? null === (q = Ie[0]) || void 0 === q
                    ? void 0
                    : q.startDate
                  : "",
                state: (null == Ie ? void 0 : Ie.length)
                  ? null === (J = Ie[0]) || void 0 === J
                    ? void 0
                    : J.state
                  : "",
                onOk: () => Ue(!1),
              }),
              (0, i.jsx)(Te, {
                visible: Ae,
                currentRightsInfo: oe,
                universalCouponCanUseNum: se,
                rightsNbr: _e || "",
                onBuyVip: () => {
                  (null == le ? void 0 : le.isLocalUser)
                    ? V.x.navToPath("/memberOpen/selectMeaI")
                    : Z.R.openDiffNetNoticeModal({
                        title: "开通说明",
                        contentText: "目前权益超市Plus会员仅限北京移动用户",
                      });
                },
                onExchange: () => {
                  ll({
                    offerId: (0, Y.Et)(oe),
                    rightCode: oe.legalRightsNbr,
                    rightId: oe.legalRightsId,
                    certificateId: Me.z,
                    certificateNum: oe.certificateNum,
                  });
                },
                onClose: () => Be(!1),
              }),
              (0, i.jsx)(De, {
                currentRightsInfo: oe,
                visible: Oe,
                codeList: Ie,
                onClose: () => ke(!1),
                onOk: () => ke(!1),
              }),
              (0, i.jsx)(de, {
                currentRightsInfo: oe,
                visible: ye,
                onClose: () => Pe(!1),
                onOk: () => Pe(!1),
              }),
              (0, i.jsx)(Q.N, {
                open: ze.open,
                onClose: () => {
                  Xe({ open: !1, orderId: "", tipsText: "", endTime: "" });
                },
                tipsText: ze.tipsText,
                orderId: ze.orderId,
                endTime: ze.endTime,
              }),
              (0, i.jsx)(Ye.r.Modal, {
                open: Ze.modalVisible,
                onClose: () => {
                  We({ isAgreeAuth: !1, modalVisible: !1 }), fe(!0);
                },
                onOk: () => {
                  We({ modalVisible: !1, isAgreeAuth: !0 }), fe(!0);
                },
              }),
            ],
          })
        );
      };
      Ue.displayName = "OrderFlowCoupon";
      var Qe = (0, r.memo)((0, r.forwardRef)(Ue));
    },
    85979(e, l, t) {
      t.d(l, { F: () => h, D: () => p });
      var a = t(20837),
        s = t(43952),
        n = t(50654),
        i = t(86070),
        r = t(41486),
        o = t.n(r),
        d = {
          RightsItemProfile: "RightsItemProfile___Jwz1x",
          gray: "gray___vNqLO",
          sm: "sm___TWVu2",
          name: "name___t0IDq",
          iconWrap: "iconWrap___oXYpD",
          icon: "icon___STdcS",
          badge: "badge___TQ8nS",
          CL: "CL___B6CO2",
          HD: "HD___INnMu",
          ZD: "ZD___PmUgT",
          XP: "XP___zwtLQ",
          RM: "RM___zpfsY",
          YL: "YL___uGOJf",
          LOCK: "LOCK___o1Ena",
          YXF: "YXF___miG5_",
          OTBC: "OTBC___XvDcf",
          TTBC: "TTBC___CKhgT",
          global: "global___bpSxV",
          ZS: "ZS___B7Lys",
          ZSBJ: "ZSBJ___a19tF",
          bottomBadge: "bottomBadge___mgYFH",
          ZDXF: "ZDXF___GP7n3",
        },
        c = t(13526),
        u = t(10059),
        _ = t(35574),
        g = t(7960);
      function h(e) {
        if (!e) return null;
        return (
          {
            CL: "常领",
            HD: "活动",
            XP: "新品",
            RM: "热门",
            YL: "已领",
            ZS: "专属",
            ZSBJ: "钻白",
            YXF: "已下发",
            OTBC: "待领1个",
            TTBC: "待领2个",
          }[e] || null
        );
      }
      function v(e) {
        var { badge: l, adapteGlobalBrandStyle: t = !1 } = e,
          a = (0, _.nc)((e) => e.userInfo),
          s = null == a ? void 0 : a.isGlobalLocalPlusOrGlobalBrand;
        return l
          ? l.startsWith("http")
            ? (0, i.jsx)("div", {
                className: d.badge,
                style: { backgroundImage: 'url("'.concat(l, '")') },
              })
            : (0, i.jsx)(i.Fragment, {
                children: l
                  ? (0, i.jsx)("div", {
                      className: (0, c.A)(d.badge, t && s && d.global, d[l]),
                    })
                  : null,
              })
          : null;
      }
      function m(e) {
        var { bottomBadge: l } = e;
        return l
          ? (0, i.jsx)("div", { className: (0, c.A)(d.bottomBadge, d[l]) })
          : null;
      }
      function x(e) {
        var {
            icon: l,
            name: t,
            badge: r,
            adapteGlobalBrandStyle: o,
            bottomBadge: _,
            statusCd: h,
            size: x = "md",
          } = e,
          p = (0, n._)(e, [
            "icon",
            "name",
            "badge",
            "adapteGlobalBrandStyle",
            "bottomBadge",
            "statusCd",
            "size",
          ]);
        return (0, i.jsxs)(
          "div",
          (0, s._)(
            (0, a._)(
              {
                className: (0, c.A)(
                  d.RightsItemProfile,
                  "YL" === r && d.gray,
                  d[x]
                ),
              },
              p
            ),
            {
              children: [
                (0, i.jsxs)("div", {
                  className: d.iconWrap,
                  children: [
                    (0, i.jsx)(u.Y, { statusCd: h, size: "sm" }),
                    (0, i.jsx)(v, { badge: r, adapteGlobalBrandStyle: o }),
                    (0, i.jsx)(g._, { className: d.icon, src: l }),
                  ],
                }),
                (0, i.jsx)("span", { className: d.name, children: t }),
                (0, i.jsx)(m, { bottomBadge: _ }),
              ],
            }
          )
        );
      }
      var p = o().memo(x);
      p.displayName = "RightsItem";
    },
    10059(e, l, t) {
      t.d(l, { Y: () => o });
      var a = t(86070),
        s = t(41486),
        n = {
          StackStatusBadge: "StackStatusBadge___NXhGS",
          center: "center___EATJ2",
          sm: "sm___exTPc",
          md: "md___L_Vn4",
          lg: "lg___aBUVZ",
        },
        i = t(84910),
        r = t(13526),
        o = (0, s.memo)((e) => {
          var { size: l = "md", position: t = "center", statusCd: s } = e;
          return (0, i.nt)(s)
            ? (0, a.jsx)("div", {
                className: (0, r.A)(n.StackStatusBadge, n[t], n[l]),
                children: "补货中",
              })
            : null;
        });
      o.displayName = "StackStatusBadge";
    },
    7960(e, l, t) {
      t.d(l, { _: () => c });
      var a = t(20837),
        s = t(43952),
        n = t(86070),
        i = (t(79065), t(28535), t(49703)),
        r = t(13438),
        o = t(41486),
        d = t.n(o);
      function c(e) {
        var { lazy: l = !0, hasBottomOverlap: t = !1, offset: o = 0 } = e,
          [c, u] = d().useState(!1);
        return l
          ? (0, n.jsx)(i.A, {
              style: { fontSize: 0 },
              onVisibleChange: (e) => u(e),
              offset: o,
              once: !0,
              children: (0, n.jsx)(
                r.A,
                (0, s._)((0, a._)({ showImage: c }, e), {
                  bottomOverlap: t ? void 0 : null,
                  animateDuration: 150,
                })
              ),
            })
          : (0, n.jsx)(
              r.A,
              (0, s._)((0, a._)({}, e), {
                bottomOverlap: null,
                animateDuration: 150,
              })
            );
      }
    },
    73581(e, l, t) {
      t.d(l, { cQ: () => s, kU: () => a, vW: () => n });
      var a = ["QY1650614620831"],
        s = ["1126", "3000", "9999"],
        n = [
          "QY1641379556640",
          "QY1673488650553",
          "QY1650614620831",
          "QY1648520729398",
        ];
    },
    5168(e, l, t) {
      t.r(l), t.d(l, { ArrayMigu: () => a });
      var a = [];
    },
    49965(e, l, t) {
      t.d(l, { W: () => x, r: () => p });
      var a = t(13454),
        s = t(20837),
        n = t(43952),
        i = t(12457),
        r = t(39480),
        o = t(64308),
        d = t(95296),
        c = t(84910),
        u = t(36765),
        _ = t(35574),
        g = t(99751),
        h = t(73581);
      function v(e, l, t) {
        return t < 0 || t > e.length ? e : [...e.slice(0, t), l, ...e.slice(t)];
      }
      function m(e, l) {
        var t = 4 === l || 5 === l;
        return (6 === l || 7 === l || 8 === l) &&
          (0, c.H)(e, ["GLOBAL_67_ONLY"])
          ? "ZSBJ"
          : t && (0, c.H)(e, ["GLOBAL_EXCLUSIVE_BADGE"])
          ? "ZS"
          : e.lastMonthBuyTimes
          ? "CL"
          : (0, o.pB)(e.legalRightsAttrs, "1008")
          ? "HD"
          : (0, o.pB)(e.legalRightsAttrs, "1010")
          ? "XP"
          : (0, o.pB)(e.legalRightsAttrs, "1009") &&
            !(0, o.pB)(e.legalRightsAttrs, "1010")
          ? "RM"
          : null;
      }
      function x(e) {
        return (
          (null == e ? void 0 : e.groupOrderTimes)
            ? null == e
              ? void 0
              : e.groupOrderTimes
            : e.buyTimes
        )
          ? "YL"
          : e.groupLastMonthBuyTimes
          ? "CL"
          : ((null == e ? void 0 : e.groupOrderTimes)
              ? null == e
                ? void 0
                : e.groupOrderTimes
              : e.buyTimes) && e.groupLastMonthBuyTimes
          ? null
          : "RM";
      }
      var p = (0, g.vt)()((e, l) => ({
        goldIcons: null,
        vPagePlusIcons: null,
        homePlusIcons: null,
        homeLhPlusIcons: null,
        newHomePlusRBIcons: null,
        updateGoldIcons: () =>
          (0, a._)(function* () {
            var l = (function (e) {
              var l;
              if (
                !(null == e || null === (l = e.data) || void 0 === l
                  ? void 0
                  : l.length)
              )
                return [];
              var t = [];
              return (
                e.data.forEach((e) => {
                  (null == e ? void 0 : e.groupOrderTimes) && t.push(e);
                }),
                e.data.forEach((e) => {
                  !(null == e ? void 0 : e.groupOrderTimes) &&
                    e.groupLastMonthBuyTimes &&
                    t.push(e);
                }),
                e.data.forEach((e) => {
                  (null == e ? void 0 : e.groupOrderTimes) ||
                    e.groupLastMonthBuyTimes ||
                    !(0, o.pB)(e.legalRightsAttrs, "1009") ||
                    t.push(e);
                }),
                e.data.forEach((e) => {
                  (null == e ? void 0 : e.groupOrderTimes) ||
                    e.groupLastMonthBuyTimes ||
                    (0, o.pB)(e.legalRightsAttrs, "1009") ||
                    t.push(e);
                }),
                t
                  .slice(0, 8)
                  .map((e, l) =>
                    (0, n._)((0, s._)({}, e), {
                      badge: l < 4 ? x(e) : "",
                      name: (0, c.$B)(e),
                      icon: (0, c.DO)(e, "330x182"),
                    })
                  )
              );
            })(yield (0, r.Sk)());
            e(() => ({ goldIcons: l }));
          })(),
        updatePlusIcons: () =>
          (0, a._)(function* () {
            var l = (function (e) {
              var l;
              if (!(null === (l = e.data) || void 0 === l ? void 0 : l.length))
                return {
                  homePlusIcons: [],
                  homeLhPlusIcons: [],
                  vPagePlusIcons: [],
                };
              var t,
                { userInfo: a } = _.nc.getState(),
                i = null == a ? void 0 : a.isGlobalLocalPlusOrGlobalBrand,
                r = (null == a ? void 0 : a.starValue) || 0,
                g =
                  4 === (null == a ? void 0 : a.starValue) ||
                  5 === (null == a ? void 0 : a.starValue),
                x =
                  6 === (null == a ? void 0 : a.starValue) ||
                  7 === (null == a ? void 0 : a.starValue) ||
                  8 === (null == a ? void 0 : a.starValue),
                p = null == a ? void 0 : a.isLocalPlusOrLhPlus,
                f = null == a ? void 0 : a.isExclCpn1PlanMember,
                N = !p && f,
                b = (function (e, l) {
                  return e.map(
                    (e) => (
                      l.forEach((l) => {
                        e.legalRightsName.includes(l) &&
                          (e.legalRightsName = e.legalRightsName.replace(
                            l,
                            ""
                          ));
                      }),
                      e
                    )
                  );
                })(e.data, ["-属地", "(会员专属)"]).filter(
                  (e) =>
                    (null == e ? void 0 : e.certificateNum) >= 1 &&
                    !h.cQ.includes(e.legalRightsType)
                );
              if (N) {
                var C = [
                    ...((null == a
                      ? void 0
                      : a.exclCpn1PlanMemberLevelInfoVOList) || []),
                  ].map((e) => "EXCL_RB_".concat(e.levelCode)),
                  j = e.data
                    .map((e) => ({
                      nbr: e.legalRightsNbr,
                      areas: (0, c.Cg)(e),
                    }))
                    .filter((e) => e.areas.some((e) => C.includes(e)))
                    .map((e) => e.nbr);
                b = e.data.filter((e) => j.includes(e.legalRightsNbr));
              }
              if (g) {
                var I = b.filter(
                    (e) =>
                      !(
                        (0, c.H)(e, ["GLOBAL_67_ONLY"]) &&
                        0 === e.lastMonthBuyTimes
                      )
                  ),
                  R = I.filter((e) =>
                    (0, c.H)(e, ["GLOBAL_EXCLUSIVE_BADGE"])
                  ).map((e) => (null == e ? void 0 : e.legalRightsNbr));
                t = (0, d.R4)(I, "legalRightsNbr", R);
              } else if (x) {
                var S = b.filter(
                    (e) => !(0, c.H)(e, ["GLOBAL_EXCLUSIVE_BADGE"])
                  ),
                  T = S.filter((e) => (0, c.H)(e, ["GLOBAL_67_ONLY"])).map(
                    (e) => (null == e ? void 0 : e.legalRightsNbr)
                  );
                t = (0, d.R4)(S, "legalRightsNbr", T);
              } else
                t = b.filter(
                  (e) =>
                    !(0, c.H)(e, ["GLOBAL_EXCLUSIVE_BADGE", "GLOBAL_67_ONLY"])
                );
              var L = t.map((e) =>
                  (0, n._)((0, s._)({}, e), {
                    _feShortName: (0, c.$B)(e),
                    badge: m(e, r),
                    name: (0, c.$B)(e),
                    icon: (0, o.lK)(e.legalRightsAttrs, "img_330_182", !0),
                  })
                ),
                A = [];
              i
                ? r >= 4
                  ? ((A = v(
                      (A = L.slice(0, 9)),
                      {
                        brand: "",
                        configId: new Date().getTime().toString(),
                        icon: "".concat(
                          gImgUrlPrefixLegacy,
                          "/rights/202406/46001ea7-8125-4b0e-8bc5-ec339fdde74f-002.png"
                        ),
                        linkValue: "/GlobalRights",
                        rightsTitle: "全球通",
                        text6: "1",
                        badge: "",
                        name: "全球通",
                      },
                      6
                    )),
                    (A = v(
                      A,
                      {
                        brand: "",
                        configId: new Date().getTime().toString(),
                        icon: "".concat(
                          gImgUrlPrefixLegacy,
                          "/rights/202408/58e25493-ca33-449d-97bc-6ffd2cc25bae-03.png"
                        ),
                        linkValue: "/Global67Rights",
                        rightsTitle: "钻石白金专区",
                        text6: "1",
                        badge: "",
                        name: "钻石白金专区",
                      },
                      10
                    )))
                  : (A = v(
                      (A = L.slice(0, 10)),
                      {
                        brand: "",
                        configId: new Date().getTime().toString(),
                        icon: "".concat(
                          gImgUrlPrefixLegacy,
                          "/rights/202406/46001ea7-8125-4b0e-8bc5-ec339fdde74f-002.png"
                        ),
                        linkValue: "/GlobalRights",
                        rightsTitle: "全球通",
                        text6: "1",
                        badge: "",
                        name: "全球通",
                      },
                      6
                    ))
                : (A = L.slice(0, 11));
              var B = u.A(L.slice(0, 9), 3),
                O = L.slice(0, 9);
              return {
                vPagePlusIcons: L,
                homePlusIcons: B,
                homeLhPlusIcons: A,
                newHomePlusRBIcons: O,
              };
            })(
              yield (0, i.o5)({
                usualCount: "3",
                returnTotalCount: "2000",
                operateCode: "HOME_LEGAL_RIGHTS",
                belongAreas: [
                  "1003",
                  "1007",
                  "1009",
                  "1010",
                  "1008",
                  "1019",
                  "Sport_Area",
                  "GLOBAL_EXCLUSIVE_BADGE",
                  "GLOBAL_67_ONLY",
                ],
                notInBelongAreas: ["ACT_N_CHOOSE_2"],
              })
            );
            e(() => l);
          })(),
      }));
    },
    95296(e, l, t) {
      t.d(l, {
        Hp: () => s,
        PT: () => d,
        R4: () => r,
        SD: () => n,
        gu: () => i,
        lW: () => o,
      });
      var a = t(60707);
      function s(e, l, t) {
        var s = Object.fromEntries(t.map((e, l) => [e, l]));
        return e.sort((e, t) => {
          var n = s[e[l]],
            i = s[t[l]];
          return (0, a.A)(n) || (0, a.A)(i)
            ? (0, a.A)(n)
              ? (0, a.A)(i)
                ? e[l].localeCompare(t[l])
                : 1
              : -1
            : n - i;
        });
      }
      function n(e, l) {
        var [t, a] = l;
        if (t < 0 || t >= e.length || a < 0 || a >= e.length) return e;
        var s = e[t];
        return (e[t] = e[a]), (e[a] = s), e;
      }
      function i(e, l) {
        var t = new Set();
        for (var a of e) {
          if (t.has(a[l])) return !0;
          t.add(a[l]);
        }
        return !1;
      }
      function r(e, l, t) {
        var a = [],
          s = [];
        return (
          e.forEach((e) => {
            t.includes(e[l]) ? a.push(e) : s.push(e);
          }),
          [...a, ...s]
        );
      }
      function o(e, l, t) {
        var a = [...e],
          s = a.findIndex((e) => e[l] === t[0]),
          n = a.findIndex((e) => e[l] === t[1]);
        return -1 !== s && -1 !== n && ([a[s], a[n]] = [a[n], a[s]]), a;
      }
      function d(e, l, t) {
        if (l < 0 || l > e.length) throw new RangeError("Index out of bounds");
        return [...e.slice(0, l), t, ...e.slice(l)];
      }
    },
    93521(e, l, t) {
      t.d(l, { _d: () => n, aL: () => r, dy: () => i });
      var a = t(56287),
        s = t.n(a);
      function n(e) {
        var l = s()(),
          t = s()(e);
        return l.isAfter(t);
      }
      function i(e) {
        return "string" != typeof e
          ? e
          : s()(e, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
      }
      function r(e) {
        return e
          ? s()(e, "HH:mm:ss").valueOf() - s()().startOf("day").valueOf()
          : 0;
      }
    },
  },
]);
