"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["3574"],
  {
    73156() {},
    78130(e, t, l) {
      l.d(t, { w: () => c });
      var a = l(86070),
        n = l(41486),
        r = {
          ExchangeItem: "ExchangeItem___HnmRp",
          imgBox: "imgBox___XxRbN",
          qqticon: "qqticon___E60Ms",
          icon: "icon___lMP_7",
          prodName: "prodName___bs_uH",
          Number: "Number___taEC2",
          button: "button___Ppwxr",
          subTitle: "subTitle___bZLpj",
          buyBtn: "buyBtn___ulXk9",
          price: "price___s93WB",
          VIPPrice: "VIPPrice___XYYYn",
          nomalPrice: "nomalPrice___PiqEZ",
          onlyNomalPrice: "onlyNomalPrice___Q3YrN",
          FallsItem: "FallsItem___uQrfc",
          buyButton: "buyButton___Nw1kH",
          salePrice: "salePrice___k8mCJ",
          salePrice2: "salePrice2___W5rMk",
          vipTitle: "vipTitle___wWhxR",
          prodName2: "prodName2___DcsT8",
          prodBox: "prodBox___hVuUb",
          vipPrice: "vipPrice___hucDD",
          symbol: "symbol___nPtTR",
          vipIcon: "vipIcon___IDgTq",
          exclusive: "exclusive___XERuP",
          noExclusive: "noExclusive___T8_u0",
          buy: "buy___irtLn",
        },
        s = l(13526),
        i = l(10059),
        o = {
          myHot: "".concat(
            gImgUrlPrefixLegacy,
            "/rights/202303/a94c403c-7418-413f-8e41-e7e9e77aefd5-myHot.png"
          ),
          myNew: "".concat(
            gImgUrlPrefixLegacy,
            "/rights/202303/cad53482-df50-49a4-935e-1a6503ae14cc-myNew.png"
          ),
          myUsual: "".concat(
            gImgUrlPrefixLegacy,
            "/rights/202303/a554de85-6bc4-490e-bebd-2b78db4e446f-myUsual.png"
          ),
          global: "".concat(
            gImgUrlPrefixLegacy,
            "/rights/202303/874c123d-2f6a-4259-a3f4-6f25d8a773a6-global.png"
          ),
        };
      function c(e) {
        var t,
          l,
          {
            data: c,
            alias: d = {
              prodName2: "prodName2",
              prodName: "prodName",
              salePrice: "salePrice",
              price: "price",
              imgSrc: "imgSrc",
              id: "id",
              exclusive: "exclusive",
              Desc: "Desc",
            },
            onClick: u,
            imgClassName: _,
            itemClassName: v,
            salePriceClassName: g,
            goodsDetailsRender: h,
          } = e,
          [m, f] = (0, n.useState)({
            prodName2: "prodName2",
            prodName: "prodName",
            salePrice: "salePrice",
            price: "price",
            imgSrc: "imgSrc",
            id: "id",
            exclusive: "exclusive",
            Desc: "Desc",
          });
        return (
          (0, n.useEffect)(() => {
            var e = m;
            Object.keys(d).forEach((t) => {
              e[t] = d[t];
            }),
              f(e);
          }, [d]),
          "1000" != c.belongAreas && "1011" != c.belongAreas
            ? (0, a.jsxs)("div", {
                className: (0, s.A)(r.ExchangeItem, v),
                onClick: () => {
                  u(c);
                },
                children: [
                  (0, a.jsxs)("div", {
                    className: r.imgBox,
                    children: [
                      (0, a.jsx)(i.Y, { statusCd: c.statusCd, size: "lg" }),
                      (0, a.jsx)("img", { src: c.imgSrc, alt: "" }),
                    ],
                  }),
                  "1000" === c.qqtFirst
                    ? (0, a.jsx)("img", {
                        className: r.qqticon,
                        src: o.global,
                        alt: "",
                      })
                    : "",
                  "1" === c.isHot
                    ? (0, a.jsx)("img", {
                        className: r.icon,
                        src: o.myHot,
                        alt: "",
                      })
                    : "1" === c.isNew
                    ? (0, a.jsx)("img", {
                        className: r.icon,
                        src: o.myNew,
                        alt: "",
                      })
                    : "1" === c.isUsual
                    ? (0, a.jsx)("img", {
                        className: r.icon,
                        src: o.myUsual,
                        alt: "",
                      })
                    : "",
                  (0, a.jsx)("div", {
                    className: r.prodName,
                    children: null == c ? void 0 : c.prodName2,
                  }),
                  (0, a.jsxs)("div", {
                    className: r.Number,
                    children: [
                      null == c ? void 0 : c.certificateNum,
                      "张兑换券",
                    ],
                  }),
                  (0, a.jsx)("div", {
                    className: r.button,
                    children: "立即兑换",
                  }),
                ],
              })
            : (0, a.jsxs)("div", {
                className: (0, s.A)(v, r.FallsItem),
                onClick: () => {
                  u(c);
                },
                children: [
                  (0, a.jsxs)("div", {
                    className: r.imgBox,
                    children: [
                      (0, a.jsx)(i.Y, { statusCd: c.statusCd, size: "lg" }),
                      (0, a.jsx)("img", {
                        className: _ || r.prodImg,
                        src: c[m.imgSrc],
                        alt: "",
                      }),
                    ],
                  }),
                  h ||
                    (0, a.jsxs)(a.Fragment, {
                      children: [
                        (0, a.jsx)("div", {
                          className: (0, s.A)({
                            [r.prodName]:
                              (null === (t = c[m.prodName]) || void 0 === t
                                ? void 0
                                : t.length) <= 6,
                            [r.prodName2]:
                              (null === (l = c[m.prodName]) || void 0 === l
                                ? void 0
                                : l.length) >= 7,
                          }),
                          children: (0, a.jsx)("div", {
                            className: r.prodBox,
                            children: c[m.prodName],
                          }),
                        }),
                        (0, a.jsx)("div", {
                          className: (0, s.A)(g, r.vipPrice),
                          children: (0, a.jsx)("span", {
                            className: r.symbol,
                            children:
                              "1" == c.justForMember && c[m.price]
                                ? (0, a.jsxs)("span", {
                                    children: ["标准价￥", c[m.price]],
                                  })
                                : "超值权益",
                          }),
                        }),
                        (0, a.jsxs)("div", {
                          className: r.buyButton,
                          children: [
                            (0, a.jsxs)("div", {
                              className: (0, s.A)(r.salePrice, {
                                [r.salePrice2]: c[m.salePrice].length >= 5,
                              }),
                              children: [
                                "￥",
                                "1" == c.justForMember
                                  ? (0, a.jsxs)(a.Fragment, {
                                      children: [
                                        c[m.salePrice].slice(
                                          0,
                                          c[m.salePrice].indexOf(".")
                                        ),
                                        (0, a.jsx)("span", {
                                          children: c[m.salePrice].slice(
                                            c[m.salePrice].indexOf(".")
                                          ),
                                        }),
                                      ],
                                    })
                                  : (0, a.jsxs)(a.Fragment, {
                                      children: [
                                        c[m.price].slice(
                                          0,
                                          c[m.price].indexOf(".")
                                        ),
                                        (0, a.jsx)("span", {
                                          children: c[m.price].slice(
                                            c[m.price].indexOf(".")
                                          ),
                                        }),
                                      ],
                                    }),
                              ],
                            }),
                            (0, a.jsx)("div", {
                              className: r.vipTitle,
                              children:
                                "1" == c.justForMember ? "会员价" : "立购",
                            }),
                          ],
                        }),
                      ],
                    }),
                ],
              })
        );
      }
    },
    74212(e, t, l) {
      l.d(t, { J: () => p });
      var a = l(13454),
        n = l(86070),
        r = (l(41486), "HotRightsModule___wZx1V"),
        s = "head___mREG3",
        i = "body___dIYDK",
        o = "itemWrap___hL7vy",
        c = "item___Wx2em",
        d = "img___aoH75",
        u = "price___vd1g9",
        _ = l(15189),
        v = l(73508),
        g = l(64308),
        h = l(20696),
        m = l(95526),
        f = l(28237),
        x = l(78130);
      function p() {
        var { data: e } = (0, v.A)(() =>
            (0, a._)(function* () {
              var e = yield (0, _.Se)({
                showNum: "999",
                notInBelongAreas: ["DETAILS_ORDER_VISIBLE_ONLY"],
              });
              return (0, m.A)(e.data)
                ? e.data
                    .filter((e) => "QY1611325110881" !== e.legalRightsNbr)
                    .map((e) =>
                      (0, g.ju)(
                        {
                          certificateNum: e.certificateNum,
                          legalRightsName: e.legalRightsDesc,
                          legalRightsName2: e.legalRightsName,
                          legalRightsId: e.legalRightsId,
                          legalRightsNbr: e.legalRightsNbr,
                          legalRightsType: e.legalRightsType,
                          legalRightsAttrs: e.legalRightsAttrs,
                          exclusive: !0,
                          brandDTO: null == e ? void 0 : e.brandDTO,
                        },
                        "img_330_182"
                      )
                    )
                : [];
            })()
          ),
          t = (e) => {
            h.x.utils.navToRightsDetailPage(e);
          };
        return (0, n.jsxs)("div", {
          className: r,
          children: [
            (0, n.jsx)("div", { className: s, children: "猜你喜欢" }),
            e
              ? (0, n.jsx)("div", {
                  className: i,
                  children: e.map((e) =>
                    (0, n.jsx)(
                      "div",
                      {
                        className: o,
                        children: (0, n.jsx)(
                          x.w,
                          {
                            place: "wxl",
                            data: e,
                            onClick: t,
                            itemClassName: c,
                            imgClassName: d,
                            salePriceClassName: u,
                          },
                          e.legalRightsNbr
                        ),
                      },
                      e.legalRightsNbr
                    )
                  ),
                })
              : (0, n.jsx)(f.gM, { count: 9 }),
          ],
        });
      }
    },
    86384(e, t, l) {
      l.d(t, { N: () => x, J: () => f });
      var a = l(86070),
        n = (l(41486), "OrderPayDiscountModal___lAiNA"),
        r = "tips___GW8cb",
        s = "orderIdWrap___PdX7f",
        i = "copyButton___lHohF",
        o = "endTime___hOc2p",
        c = l(15189),
        d = l(2307),
        u = l(54447),
        _ = l(891),
        v = l(64850),
        g = l(33843),
        h = l(58349),
        m = l(59344);
      function f(e) {
        (0, v.fx)()
          ? u.a.navigateTo({
              url: "/package-a/pages/pay-discount-exchange/index?id=".concat(e),
            })
          : d.t
              .openMiniProgram({
                userName: "gh_f66fe1a519f1",
                path: "/package-a/pages/pay-discount-exchange/index?id=".concat(
                  e
                ),
                miniProgramType: 0,
              })
              .catch(() => {
                m.Z.loading(),
                  (0, c.Az)({
                    path: "package-a/pages/pay-discount-exchange/index",
                    query: "id=".concat(e),
                    envVersion: "release",
                  })
                    .then((e) => {
                      var t;
                      m.Z.clear(),
                        (
                          null === (t = e.data) || void 0 === t
                            ? void 0
                            : t.startsWith("https")
                        )
                          ? (window.location.href = e.data)
                          : m.Z.info("跳转失败，请手动兑换");
                    })
                    .catch(() => {
                      m.Z.clear();
                    });
              });
      }
      function x(e) {
        var {
          open: t,
          orderId: l,
          tipsText: c,
          onClose: d,
          onAfterClose: u = () => {},
          endTime: v,
        } = e;
        return (0, a.jsx)(g.R.ControlledComponent, {
          open: t,
          title: "温馨提示",
          onClose: d,
          okButtonText: "存入卡包",
          onOk: () => {
            f(l);
          },
          onAfterClose: u,
          children: (0, a.jsxs)("div", {
            className: n,
            children: [
              (0, a.jsx)(h.s, { className: r, text: c }),
              (0, a.jsxs)("div", {
                className: s,
                children: [
                  (0, a.jsxs)("span", { children: ["订单号：", l] }),
                  (0, a.jsx)("div", {
                    className: i,
                    onClick: () => {
                      _.V.writeText({ text: l });
                    },
                    children: "复制",
                  }),
                ],
              }),
              v
                ? (0, a.jsxs)("div", {
                    className: o,
                    children: ["有效期至：", v],
                  })
                : null,
            ],
          }),
        });
      }
    },
    89321(e, t, l) {
      l.d(t, { h: () => N });
      var a = l(13454),
        n = l(86070),
        r = (l(41486), "modal___dGXRS"),
        s = "withBanner___tLm_M",
        i = "head___f_Rlr",
        o = "body___zG9it",
        c = "foot___Wc9nv",
        d = "button___zQdqC",
        u = "closeButton___SktVn",
        _ = "okButton___REDgi",
        v = "banner___S1bHE",
        g = "bannerImage___bIMJJ",
        h = l(36847),
        m = l(73508),
        f = l(20696),
        x = l(13526),
        p = l(62033);
      function N(e) {
        var { open: t, hasBanner: l = !1, onClose: N, onOk: y } = e,
          { data: j } = (0, m.A)(
            () =>
              (0, a._)(function* () {
                var e;
                if (l) {
                  var t = yield (0, h.n3)("ResultsPagePop");
                  return (
                    null === (e = t.data) || void 0 === e ? void 0 : e.length
                  )
                    ? t.data[0]
                    : null;
                }
              })(),
            { refreshDeps: [l] }
          ),
          C = Boolean(l ? j && t : t);
        return (0, n.jsx)(p.v, {
          open: C,
          children: (0, n.jsxs)("div", {
            className: (0, x.A)(r, j && s),
            children: [
              (0, n.jsx)("div", { className: i, children: "订单处理中..." }),
              (0, n.jsxs)("div", {
                className: o,
                children: [
                  "您的订单正在处理中，请您耐心等待15秒，15秒如未刷新办理进度，请退出本页面。",
                  (0, n.jsx)("br", {}),
                  "订单结果详情见短信或点击查看订单。",
                ],
              }),
              (0, n.jsxs)("div", {
                className: c,
                children: [
                  (0, n.jsx)("div", {
                    className: (0, x.A)(d, u),
                    onClick: N,
                    children: "关闭",
                  }),
                  (0, n.jsx)("div", {
                    className: (0, x.A)(d, _),
                    onClick: y,
                    children: "查看订单",
                  }),
                ],
              }),
              j
                ? (0, n.jsx)("div", {
                    className: v,
                    onClick: () => {
                      f.x.navToOp({ data: j });
                    },
                    children: (0, n.jsx)("img", {
                      className: g,
                      src: "".concat(gImgUrlPrefixLegacy).concat(j.icon),
                      alt: "",
                    }),
                  })
                : null,
            ],
          }),
        });
      }
    },
    62033(e, t, l) {
      l.d(t, { v: () => m });
      var a = l(86070),
        n = (l(32949), l(74947)),
        r = l(41486),
        s = "Mask___M2HHj",
        i = "Content___j4Tg4",
        o = l(81566),
        c = l(2307),
        d = l(59028),
        u = l(88229),
        _ = l(13526),
        v = l(36436),
        g = l(18310);
      function h(e) {
        var { children: t } = e,
          { modalWrapperStyle: l } = (function () {
            var { windowWidth: e } = (0, g.lW)();
            return {
              modalWrapperStyle: (0, r.useMemo)(
                () =>
                  712 === e || 717 === e || 813 === e
                    ? { transform: "scale(0.6)" }
                    : {},
                [e]
              ),
            };
          })();
        return (0, a.jsx)("div", { style: l, children: t });
      }
      function m(e) {
        var {
            open: t,
            children: l,
            onClose: g = u.l,
            onAfterClose: m = u.l,
            onAfterOpen: f = u.l,
            closeOnMaskClick: x = !1,
            contentClassName: p,
            maskClassName: N,
          } = e,
          y = (0, r.useCallback)(() => {
            0 === window.scrollY &&
              window.scrollTo({ top: 1, left: 0, behavior: "smooth" }),
              (0, o.Al)() && (0, d.fF)() && c.t.setPullRefresh(!1),
              v.M.updateHasCenterModalVisible(!0),
              f();
          }, [f]),
          j = (0, r.useCallback)(() => {
            (0, o.Al)() && (0, d.fF)() && c.t.setPullRefresh(!0),
              v.M.updateHasCenterModalVisible(!1),
              m();
          }, [m]);
        return (0, a.jsx)(n.Ay, {
          contentAtCenter: !0,
          visible: t,
          maskClosable: x,
          onClose: j,
          onOpen: y,
          close: g,
          gestureOutOfControl: !0,
          contentTransitionType: "rm-center-modal",
          maskClass: (0, _.A)(s, N),
          contentClass: (0, _.A)(i, p),
          children: (0, a.jsx)(h, { children: l }),
        });
      }
    },
    33843(e, t, l) {
      l.d(t, { R: () => B });
      var a = l(20837),
        n = l(86070),
        r = l(41486),
        s = "RmModal___y_Diw",
        i = "RmModalContent___XCcF5",
        o = "headWrap___I7jXY",
        c = "head___TTSOZ",
        d = "titleIcon___W44Ll",
        u = "typeIcon___roTkM",
        _ = "rightsIcon___l23zj",
        v = "title___PT1DJ",
        g = "body___EtwsK",
        h = "foot___tfyd2",
        m = "okButton___NTCwh",
        f = "cancelButton___CkGsH",
        x = "MZoneCloseButton___l28d7",
        p = "MZoneCloseButtonCloseButtonImage___idvUR",
        N = "NormalCloseButton___Fvsro",
        y = "NormalCloseButtonImage___G1Lrw",
        j = "MZoneHeadDecoration___wsd2G",
        C = "DiffNetNoticeModalContent___rDzSK",
        b = l(44841),
        I = l(21051),
        P = l(13526),
        A = l(62033),
        R = l(34158),
        k = {
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
        w = (e, t) => {
          if ((0, I.O)(e)) return e;
          var l = k[e];
          return l
            ? (0, n.jsx)("img", {
                className: (0, P.A)(d, u),
                src: t ? l.MZone : l.Normal,
                alt: "",
              })
            : (0, n.jsx)("img", { className: (0, P.A)(d, _), src: e, alt: "" });
        };
      var T = (e) => {
          var {
              open: t,
              title: l,
              titleIcon: r,
              content: d = null,
              children: u = null,
              okButtonText: _ = "我知道了",
              okButtonStyle: C = {},
              cancelButtonStyle: b = {},
              hasOkButton: P = !0,
              hasCancelButton: k = !1,
              cancelButtonText: T = "关闭",
              style: S = {},
              bodyStyle: O = {},
              onClose: B = () => {},
              onOk: L = () => {},
              onCancel: D = () => {},
              onAfterClose: M = () => {},
              hasFoot: E = !0,
              hasClose: U = !0,
              onAfterOpen: F = () => {},
            } = e,
            H = (0, R.e)(),
            Y = (function (e) {
              var {
                hasOkButton: t,
                hasCancelButton: l,
                okButtonText: r,
                okButtonStyle: s,
                onOk: i,
              } = e;
              return (0, n.jsx)(n.Fragment, {
                children: t
                  ? (0, n.jsx)("div", {
                      className: m,
                      style: (0, a._)({ width: l ? "2.8rem" : "4.8rem" }, s),
                      onClick: i,
                      children: r,
                    })
                  : null,
              });
            })({
              hasOkButton: P,
              hasCancelButton: k,
              okButtonText: _,
              okButtonStyle: C,
              onOk: L,
            });
          return (0, n.jsx)(A.v, {
            open: t,
            onAfterClose: M,
            onAfterOpen: F,
            children: (0, n.jsxs)("div", {
              className: s,
              style: S,
              children: [
                H
                  ? (0, n.jsx)("img", {
                      className: j,
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202309/1f1a1016-da6b-4663-a563-d848af917ecd-awfewa.png"
                      ),
                      alt: "",
                    })
                  : null,
                (0, n.jsxs)("div", {
                  className: i,
                  children: [
                    (0, n.jsx)("div", {
                      className: o,
                      style: { marginBottom: H ? ".8rem" : ".4rem" },
                      children: (0, n.jsxs)("div", {
                        className: c,
                        children: [
                          r ? w(r, H) : null,
                          (0, I.O)(l)
                            ? l
                            : (0, n.jsx)("div", { className: v, children: l }),
                        ],
                      }),
                    }),
                    (0, n.jsxs)("div", {
                      className: g,
                      style: O,
                      children: [d, u],
                    }),
                    E
                      ? (0, n.jsxs)("div", {
                          className: h,
                          children: [
                            k
                              ? (0, n.jsx)("div", {
                                  className: f,
                                  style: (0, a._)(
                                    { width: k ? "2.8rem" : "3.2rem" },
                                    b
                                  ),
                                  onClick: D,
                                  children: T,
                                })
                              : null,
                            Y,
                          ],
                        })
                      : null,
                    U
                      ? (0, n.jsx)(n.Fragment, {
                          children: H
                            ? (0, n.jsx)("div", {
                                className: x,
                                onClick: B,
                                children: (0, n.jsx)("img", {
                                  className: p,
                                  src: "".concat(
                                    gImgUrlPrefixLegacy,
                                    "/rights/202309/2aabe5b5-7e41-48fb-a097-ba983d4dc3d8-sdfaef.png"
                                  ),
                                  alt: "",
                                }),
                              })
                            : (0, n.jsx)("div", {
                                className: N,
                                onClick: B,
                                children: (0, n.jsx)("img", {
                                  className: y,
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
        S = b.Ay.create((e) => {
          var {
              title: t,
              titleIcon: l,
              content: a = null,
              hasFoot: s = !0,
              okButtonText: i = "我知道了",
              okButtonStyle: o,
              cancelButtonStyle: c,
              hasOkButton: d = !0,
              hasCancelButton: u = !1,
              cancelButtonText: _ = "关闭",
              style: v = {},
              bodyStyle: g = {},
              onClose: h = () => {},
              onOk: m = () => {},
              onCancel: f = () => {},
              onAfterClose: x = () => {},
              hasClose: p = !0,
              autoTriggerResolve: N = !1,
              onAfterOpen: y = () => {},
              autoHideAfterClickOk: j = !0,
              autoHideAfterClickCancel: C = !0,
            } = e,
            I = (0, b.hS)();
          return (
            (0, r.useEffect)(() => {
              N && I.resolve({ props: e });
            }, [N, I, e]),
            (0, n.jsx)(T, {
              open: I.visible,
              title: t,
              titleIcon: l,
              content: a,
              okButtonText: i,
              hasFoot: s,
              hasOkButton: d,
              okButtonStyle: o,
              cancelButtonStyle: c,
              hasCancelButton: u,
              cancelButtonText: _,
              style: v,
              bodyStyle: g,
              onClose: () => {
                I.hide(), h();
              },
              onOk: () => {
                j && I.hide(), m();
              },
              onCancel: () => {
                C && I.hide(), f();
              },
              onAfterClose: () => {
                I.resolveHide(), I.remove(), x();
              },
              hasClose: p,
              onAfterOpen: () => {
                y();
              },
            })
          );
        });
      function O(e) {
        return b.Ay.show(S, e);
      }
      var B = {
        ControlledComponent: T,
        open: O,
        close: function () {
          return b.Ay.hide(S);
        },
        openDiffNetNoticeModal: function (e) {
          var t = (null == e ? void 0 : e.title) ? e.title : "温馨提示",
            l = (null == e ? void 0 : e.contentText)
              ? e.contentText
              : "抱歉，仅限北京移动用户参与";
          O({
            title: t,
            content: (0, n.jsx)("div", { className: C, children: l }),
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
          O({
            titleIcon: "warning",
            title: "提交失败",
            content: (0, n.jsxs)("ul", {
              style: { fontSize: ".28rem", color: "#333", lineHeight: 1.6 },
              children: [
                (0, n.jsx)("li", { children: "办理失败，可能是以下原因：" }),
                (0, n.jsx)("li", { children: "1、您的号码已欠费停机。" }),
                (0, n.jsx)("li", { children: "2、您不符合办理条件。" }),
                (0, n.jsx)("li", { children: "如有疑问请您拨打10086咨询。" }),
              ],
            }),
            okButtonText: "我知道了",
          });
        },
      };
    },
    99126(e, t, l) {
      l.d(t, { D: () => i });
      var a = l(86070),
        n = l(41486),
        r = l.n(n),
        s = r().lazy(() =>
          Promise.all([
            l.e("1191"),
            l.e("7853"),
            l.e("3344"),
            l.e("8016"),
          ]).then(l.bind(l, 41894))
        );
      function i() {
        return (0, a.jsx)(r().Suspense, {
          fallback: null,
          children: (0, a.jsx)(s, {}),
        });
      }
    },
    10059(e, t, l) {
      l.d(t, { Y: () => o });
      var a = l(86070),
        n = l(41486),
        r = {
          StackStatusBadge: "StackStatusBadge___NXhGS",
          center: "center___EATJ2",
          sm: "sm___exTPc",
          md: "md___L_Vn4",
          lg: "lg___aBUVZ",
        },
        s = l(66782),
        i = l(13526),
        o = (0, n.memo)((e) => {
          var { size: t = "md", position: l = "center", statusCd: n } = e;
          return (0, s.nt)(n)
            ? (0, a.jsx)("div", {
                className: (0, i.A)(r.StackStatusBadge, r[l], r[t]),
                children: "补货中",
              })
            : null;
        });
      o.displayName = "StackStatusBadge";
    },
    58349(e, t, l) {
      l.d(t, { s: () => g });
      var a = l(20837),
        n = l(43952),
        r = l(50654),
        s = l(86070),
        i = (l(75837), l(19784)),
        o = l(41486),
        c = l.n(o),
        d = "WithImagePreview____6O8T",
        u = l(20696),
        _ = l(13526);
      function v(e) {
        if ("undefined" == typeof window || "undefined" == typeof DOMParser)
          return [];
        var t = new DOMParser().parseFromString(e, "text/html");
        return Array.from(t.querySelectorAll("img"))
          .map((e) =>
            (function (e) {
              if (!e || "undefined" == typeof window) return null != e ? e : "";
              try {
                return new URL(e, window.location.href).href;
              } catch (t) {
                return e;
              }
            })(e.getAttribute("src"))
          )
          .filter(Boolean);
      }
      var g = c().forwardRef((e, t) => {
        var { text: l, enableImagePreview: o, className: g, onClick: h } = e,
          m = (0, r._)(e, [
            "text",
            "enableImagePreview",
            "className",
            "onClick",
          ]),
          {
            assignRef: f,
            handleContainerClick: x,
            closePreview: p,
            previewOpenIndex: N,
            previewImages: y,
          } = (function (e, t, l, a) {
            var n = c().useRef(null),
              [r, s] = c().useState(-1),
              i = c().useMemo(
                () => (t && "string" == typeof e ? v(e) : []),
                [t, e]
              );
            return (
              c().useLayoutEffect(() => {
                t &&
                  n.current &&
                  n.current.querySelectorAll("img").forEach((e, t) => {
                    e.dataset.previewIndex = String(t);
                  });
              }, [e, t]),
              {
                assignRef: c().useCallback(
                  (e) => {
                    (n.current = e),
                      "function" == typeof l ? l(e) : l && (l.current = e);
                  },
                  [l]
                ),
                handleContainerClick: c().useCallback(
                  (e) => {
                    var l = e.target.closest("a");
                    if (l) {
                      e.preventDefault();
                      var n = l.dataset.type,
                        r = l.href;
                      return r.includes("sourceid")
                        ? void u.x.navToZGYD(r)
                        : r.includes("mpf.tuopukeji.cn")
                        ? void u.x.navToOuter(r)
                        : void (n
                            ? u.x.navToOp({ data: { linkValue: r, text6: n } })
                            : u.x.navToHref(r));
                    }
                    if ((null == a || a(e), t && !e.defaultPrevented)) {
                      var { target: o } = e;
                      if (o instanceof HTMLImageElement) {
                        var c = o.dataset.previewIndex;
                        if (void 0 !== c) {
                          var d = Number(c);
                          !Number.isFinite(d) || d < 0 || d >= i.length || s(d);
                        }
                      }
                    }
                  },
                  [t, i.length, a]
                ),
                closePreview: c().useCallback(() => {
                  s(-1);
                }, []),
                previewOpenIndex: r,
                previewImages: i.map((e) => ({ src: e })),
              }
            );
          })(l, o, t, h);
        return "string" != typeof l
          ? null
          : (0, s.jsxs)(s.Fragment, {
              children: [
                (0, s.jsx)(
                  "div",
                  (0, n._)((0, a._)({}, m), {
                    ref: f,
                    className: (0, _.A)(o && d, g),
                    onClick: x,
                    dangerouslySetInnerHTML: { __html: l },
                  })
                ),
                o && y.length > 0
                  ? (0, s.jsx)(i.Ay, {
                      images: y,
                      openIndex: N,
                      close: p,
                      onClose: p,
                    })
                  : null,
              ],
            });
      });
      g.displayName = "RichText";
    },
    95553(e, t, l) {
      l.d(t, { p: () => i });
      var a = l(41486),
        n = l(52112),
        r = l(19694),
        s = l(90570);
      function i(e) {
        var { rightsNbr: t, queryList: l = !1 } = e,
          i = (0, a.useRef)({}),
          [o, c] = (0, a.useState)(!1),
          [d, u] = (0, a.useState)(null),
          [_, v] = (0, a.useState)(null),
          g = () => {
            try {
              t &&
                (0, n.Y)(t).then((e) => {
                  if ("0" !== e.resultCode || r.A(e.data) || s.A(e.data))
                    return c(!1), void (i.current._is = !1);
                  c(!0),
                    u(e.data),
                    (i.current._is = !0),
                    (i.current._data = e.data);
                }),
                l &&
                  (0, n.W)().then((e) => {
                    "0" !== e.resultCode ||
                      r.A(e.data) ||
                      s.A(e.data) ||
                      (v(e.data), (i.current._list = e.data));
                  });
            } catch (e) {}
          };
        return (
          (0, a.useEffect)(() => {
            g();
          }, []),
          {
            isSeckillRight: o,
            seckillRightData: d,
            seckillRightList: _,
            getIsSeckillRight: () => i.current._is,
            getSeckillRightData: () => i.current._data,
            getSeckillRightList: () => i.current._list,
            fresh: () => {
              g();
            },
          }
        );
      }
    },
    89622(e, t, l) {
      l.r(t), l.d(t, { member99PlusConfigList: () => a, moduleIds: () => n });
      var a = [
          {
            bannerBg: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202507/925b4d70-09a1-4df6-9ea8-897838d115ce-02.png"
            ),
            offerOrderBtn: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/e218c62c-dd2a-4c75-80ca-fc5279b0335b-07.png"
            ),
            offerName: "99Plus-畅享版",
            offerId: "111004275441",
            offerRulesText: "",
          },
          {
            bannerBg: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202507/09a12ccc-c9b3-482a-b038-c0c36b2d0044-06.png"
            ),
            offerOrderBtn: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/de170fd0-fbe1-4e8c-9702-fb142b50fbea-zxh.png"
            ),
            offerName: "99Plus-优享版",
            offerId: "111004275440",
            offerRulesText: "",
          },
          {
            bannerBg: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202507/dd854633-6366-4643-8897-93957f3dcdef-01.png"
            ),
            offerOrderBtn: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/ab5ac777-4610-4e90-a4c1-9945d6a85721-agkal.png"
            ),
            offerName: "99Plus-尊享版",
            offerId: "111004275439",
            offerRulesText: "",
          },
        ],
        n = {
          banner: "module-banner",
          categories: "module-categories",
          stickyCategories: "module-categories-sticky",
          flow: "module-flow",
          core: "module-core",
          exclusive: "module-exclusive",
          discount: "module-discount",
        };
    },
    47645(e, t, l) {
      l.d(t, {
        HF: () => v,
        Px: () => g,
        dT: () => d,
        fW: () => u,
        gu: () => m,
        mf: () => _,
        uM: () => h,
      });
      var a = l(13454),
        n = l(20837),
        r = l(81566),
        s = l(6655),
        i = l(78337),
        o = l(2307),
        c = l(32553);
      function d() {
        return (0, a._)(function* () {
          var e;
          return (
            (null ===
              (e = (yield (0, i.t)({
                abilityCode: "PLUS99_AREA_RIGHTS_QRY",
                data: { notInBelongAreas: [], belongAreas: ["99PLUS_CORE"] },
              })).data) || void 0 === e
              ? void 0
              : e.map((e) => (0, s.F)(e))) || []
          );
        })();
      }
      function u() {
        return (0, a._)(function* () {
          var e;
          return (
            (null ===
              (e = (yield (0, i.t)({
                abilityCode: "PLUS99_AREA_RIGHTS_QRY",
                data: {
                  notInBelongAreas: [],
                  belongAreas: ["99PLUS_DISCOUNT"],
                },
              })).data) || void 0 === e
              ? void 0
              : e.map((e) => (0, s.F)(e))) || []
          );
        })();
      }
      function _() {
        return (0, a._)(function* () {
          var e = yield (0, i.t)({
            abilityCode: "PLUS99_SPEC_AREA_QRY",
            data: { operateCode: "99PLUS_EXCL" },
          });
          return (
            Array.isArray(e.data) &&
              (e.data = e.data.map((e) =>
                (0, n._)({}, e, (0, c.getExclusiveRightsName)(e))
              )),
            e.data
          );
        })();
      }
      function v(e) {
        return (0, a._)(function* () {
          var t = yield o.t.getConcatenationInfo();
          return (
            t && ((e.wtAc = t.wtAc), (e.wtAcId = t.wtAcId)),
            (0, r.D8)() && (e.platform = 1),
            (0, i.t)({
              abilityCode: "PLUS99_AREA_OPEN_LIMIT",
              data: e,
              showToast: !0,
            })
          );
        })();
      }
      function g(e) {
        return (0, a._)(function* () {
          var t = yield o.t.getConcatenationInfo();
          return (
            t && ((e.wtAc = t.wtAc), (e.wtAcId = t.wtAcId)),
            (0, r.D8)() && (e.platform = 1),
            (0, i.t)({
              abilityCode: "PLUS99_CARD_ACT_OPEN",
              data: e,
              showToast: !0,
            })
          );
        })();
      }
      function h() {
        return (0, a._)(function* () {
          return (0,
          i.t)({ abilityCode: "NINETY_NINE_PLUS_GET_INFO", data: { activeId: 10007 } });
        })();
      }
      function m(e) {
        return (0, a._)(function* () {
          return (0, i.t)({ abilityCode: "RIGHTS_DETAIL_QRY_H5", data: e });
        })();
      }
    },
    32553(e, t, l) {
      l.r(t),
        l.d(t, {
          getExclusiveRightsName: () => o,
          isSlotIndex: () => i,
          navToPhoneCouponUsePage: () => c,
          scrollToModule: () => d,
        });
      var a = l(81566),
        n = l(64308),
        r = l(20696),
        s = l(89622);
      function i(e) {
        return [0, 1, 2].includes(e);
      }
      function o(e) {
        try {
          var t = e.discountName.split("_");
          return { name: t[0], subName: t[1] };
        } catch (e) {
          return { name: "", subName: "" };
        }
      }
      function c() {
        (0, a.D8)()
          ? r.x.navToHref("https://touch.10086.cn/i/mobile/mycoupons.html")
          : (0, a.Q0)()
          ? r.x.navToHref(
              "https://h.app.coc.10086.cn/activity/transit/transferDownload.html?targetURL=https%3A%2F%2Ftouch.10086.cn%2Fi%2Fmobile%2Fmycoupons.html%3Fc%3D11%26e%3D99&pageId=10022120716544486&sellerId=1510034HD1701300016"
            )
          : r.x.navToHref(
              "https://h.app.coc.10086.cn/activity/transit/transferDownload.html?targetURL=https%3A%2F%2Ftouch.10086.cn%2Fi%2Fmobile%2Fmycoupons.html%3Fc%3D11%26e%3D99&pageId=10022120716544486&sellerId=1510034HD1701300017"
            );
      }
      function d(e) {
        var t = 89,
          l = document.querySelector("#".concat(s.moduleIds.stickyCategories));
        l && (t = l.clientHeight + 8), (0, n.PA)("#".concat(e), -t);
      }
    },
    51010(e, t, l) {
      l.d(t, { BL: () => c, HF: () => i, zu: () => o });
      var a = l(13454),
        n = l(81566),
        r = l(78337),
        s = l(2307);
      function i(e) {
        return (0, a._)(function* () {
          var t = yield s.t.getConcatenationInfo();
          return (
            t && ((e.wtAc = t.wtAc), (e.wtAcId = t.wtAcId)),
            (0, n.D8)() && (e.platform = 1),
            (0, r.t)({
              abilityCode: "USER_MODEL_VALUE_OPEN",
              data: e,
              showToast: !0,
            })
          );
        })();
      }
      function o() {
        return (0, a._)(function* () {
          return (0,
          r.t)({ abilityCode: "USER_MODEL_VALUE_GET_INFO", data: {} });
        })();
      }
      function c(e) {
        return (0, a._)(function* () {
          return (0,
          r.t)({ abilityCode: "USER_MODEL_VALUE_GET_DETAIL", data: e });
        })();
      }
    },
    34158(e, t, l) {
      l.d(t, { e: () => n });
      var a = l(4927);
      function n() {
        var e = (0, a.P)((e) => e.theme),
          t = (0, a.P)((e) => e.pageType);
        return "M-ZONE" === e && "Plus" === t;
      }
    },
    38704(e, t, l) {
      l.r(t), l.d(t, { default: () => ot });
      var a = l(13454),
        n = l(86070),
        r = l(41486),
        s = l.n(r),
        i = "Page___XbFPu",
        o = "Container___ZbgTE",
        c = l(12457),
        d = l(21051),
        u = l(346),
        _ = l(5068);
      function v(e) {
        return (0, a._)(function* () {
          var { custOrderId: t, queryFn: l } = e;
          if ("queryCouponRecords" === l) {
            var a,
              n,
              r,
              s,
              i,
              o = yield (0, c.AQ)({
                busiNbr: "LegalRights",
                custOrderType: "9003",
              });
            return (
              null === (a = o.data) || void 0 === a
                ? void 0
                : a.couponRecodeList.length
            )
              ? [
                  {
                    cardPwd:
                      null === (r = o.data) ||
                      void 0 === r ||
                      null === (n = r.couponRecodeList[0]) ||
                      void 0 === n
                        ? void 0
                        : n.custOrderId,
                    endDate: (0, d.Yq)(
                      null === (i = o.data) ||
                        void 0 === i ||
                        null === (s = i.couponRecodeList[0].custOrderAttrs) ||
                        void 0 === s
                        ? void 0
                        : s.expTime
                    ),
                  },
                ]
              : [];
          }
          if ("queryOrderDetail" === l && (0, _.uI)(t)) {
            var v,
              g = yield (0, c.H7)({ custOrderId: t });
            if (!g.data) return [];
            var h =
              null == g || null === (v = g.data) || void 0 === v
                ? void 0
                : v.resourceCode;
            if ((0, _.uI)(h)) {
              var m = (0, u.L)(h);
              return (null == m ? void 0 : m.length)
                ? m.map((e) => {
                    var t;
                    return {
                      cardPwd: e,
                      endDate: (0, d.Yq)(
                        null == g || null === (t = g.data) || void 0 === t
                          ? void 0
                          : t.expTime
                      ),
                    };
                  })
                : [];
            }
            return [];
          }
          return [];
        })();
      }
      var g = l(15189),
        h = l(63540),
        m = l(47645),
        f = l(51010);
      function x(e, t) {
        return (0, a._)(function* () {
          var l,
            a = "";
          if (t) a = t;
          else {
            var n,
              r = yield (0, g.AV)({ page: 1, rows: 1, legalRightsNbr: e });
            if (!(null === (n = r.data) || void 0 === n ? void 0 : n.length))
              return null;
            a = r.data[0].legalRightsId;
          }
          if (!a) return null;
          var s =
            null ===
              (l = (yield (0, g.eP)({
                certificateId: h.z,
                rightIdList: [a],
                queryScope: "1",
              })).data) || void 0 === l
              ? void 0
              : l.legalRightsList[0];
          return s || null;
        })();
      }
      function p(e, t) {
        return (0, a._)(function* () {
          if (!e) return null;
          var t = yield (0, m.gu)({ legalRightsNbr: e, discount: 100 });
          return t.data ? t.data : null;
        })();
      }
      function N(e, t) {
        return (0, a._)(function* () {
          if (!e) return null;
          var t = yield (0, f.BL)({ legalRightsNbr: e });
          return t.data ? t.data : null;
        })();
      }
      var y = l(73508),
        j = l(80085);
      var C = l(33843),
        b = l(64308),
        I = l(66782),
        P = l(20696),
        A = l(74212),
        R = l(89321),
        k = l(99126),
        w = l(59344),
        T = "ButtonGroup___YtP4O",
        S = "MainButton___yYbD9",
        O = "SecButton___bPF8Y",
        B = "GreenButton___taac8",
        L = l(81566),
        D = (l(96562), l(38458)),
        M = "SecButtonSkeleton___Z1Po7",
        E = "Button___yIPoc";
      function U() {
        return (0, n.jsx)(D.A, {
          className: M,
          animation: "breath",
          title: !1,
          paragraph: !1,
          children: (0, n.jsx)(D.A.Node, { className: E }),
        });
      }
      var F = l(86384),
        H = l(52185);
      function Y(e) {
        var {
            resoultAB: t,
            belongAreas: l,
            codeList: a,
            receiveMode: r,
            queryRightsInfoLoading: s,
          } = e,
          {
            id: i,
            codeUrl: o,
            resoult: c,
            from: d,
            pageType: u,
            custOrderType: _ = "",
            act: v,
          } = (0, j.dj)(),
          g =
            "2" !== t &&
            ("1" === t ||
              "1" === c ||
              "4" === c ||
              "5" === c ||
              "seckill-1" === c),
          h = l.includes("FillShippingAddress")
            ? "点击填写配送地址"
            : "QY1689749726840" === i
            ? "美食专区"
            : "获取卡密",
          m = "memberDosage" === d ? "查看我的兑换券" : "查看订单",
          f = g
            ? l.includes("99PLUS_EXCL_RB_30004")
              ? "前往自提专区"
              : "1500" === r
              ? "存入卡包"
              : "再逛逛"
            : "再逛逛",
          x = () => {
            var e;
            "存入卡包" === f &&
              (null === (e = a[0]) || void 0 === e ? void 0 : e.cardPwd) &&
              (0, F.J)(a[0].cardPwd);
            if (("前往自提专区" === f && P.x.navToZGYD(H.W9), "再逛逛" === f)) {
              if ("exact" === d)
                return void P.x.navToZGYD(
                  "https://h5.bj.10086.cn/cmcc_vact/young-zone/index.html"
                );
              if ("99plus" === v) return void P.x.replace("/99plus");
              if ("99plus2" === v) return void P.x.replace("/99plus2");
              if (
                (0, I.h1)({
                  belongAreas: l,
                  targetAreas: [
                    "M2_VIP_LUCKY_BAG",
                    "M3_VIP_LUCKY_BAG",
                    "M4_VIP_LUCKY_BAG",
                    "M5_VIP_LUCKY_BAG",
                    "M2_VIP_DISCOUNT_PURCHASE",
                    "M3_VIP_DISCOUNT_PURCHASE",
                    "M4_VIP_DISCOUNT_PURCHASE",
                    "M5_VIP_DISCOUNT_PURCHASE",
                  ],
                })
              )
                return void P.x.replace("/Mzone");
              if ((0, L.Al)())
                try {
                  window.leadeon.closeCurrentWebView({ debug: !1 });
                } catch (e) {
                  P.x.utils.replaceToHomePage();
                }
              else P.x.utils.replaceToHomePage();
            }
          };
        return "QY1650613475930" === i ||
          "QY1632470416498" === i ||
          "QY1708589422101" === i
          ? (0, n.jsx)("div", {
              className: B,
              onClick: () => {
                P.x.navToOuter(o);
              },
              children: "查看并使用",
            })
          : o
          ? (0, n.jsx)("div", {
              className: B,
              onClick: () => {
                P.x.navToOuter(o);
              },
              children: h,
            })
          : (0, n.jsxs)("div", {
              className: T,
              children: [
                g && "FiveOff" !== u
                  ? (0, n.jsx)("div", {
                      className: S,
                      onClick: () => {
                        "查看我的兑换券" !== m
                          ? _
                            ? P.x.navToPath("/orderList", { custOrderType: _ })
                            : P.x.navToPath("/orderList", {
                                custOrderType: "9003",
                              })
                          : P.x.replace("/myVoucher/exchangeNote", {
                              noteType: "currency",
                            });
                      },
                      children: m,
                    })
                  : null,
                s
                  ? (0, n.jsx)(U, {})
                  : (0, n.jsx)("div", {
                      className: O,
                      onClick: x,
                      children: f,
                    }),
              ],
            });
      }
      l(30913);
      var V = l(30176),
        q = "CodeDisplay1___fHB5K",
        Q = "Product___vpTNi",
        Z = "ProductIcon___mS6Fk",
        W = "ProductName___wqK4P",
        G = "Description___f5hzY",
        K = "CodeItem___ehjL7",
        z = "CopyButton___J6Cvs",
        J = "Disabled___L0mfI",
        X = "DateRange___SRb5M",
        $ = "PhoneNo___teEOw",
        ee = "CodeInput___CMrxB",
        te = "CodeInputInner___iCiDW",
        le = "ButtonGroup___toVFC",
        ae = "RechargeButton___E9Wox",
        ne = "MeiTuanButton___VmpqP",
        re = l(891),
        se = l(13526),
        ie = l(35574),
        oe = l(58349);
      function ce(e) {
        var t,
          l,
          { rightsInfo: s, order: i, onRechargeSuccess: o } = e,
          { id: d = "", legalRightsNbr: u = "" } = (0, j.dj)(),
          _ = (0, ie.nc)((e) => e.userInfo),
          v = (null == _ ? void 0 : _.phoneNo) || "",
          g = (null == _ ? void 0 : _.desensitizedPhoneNumber) || "",
          h = (0, r.useRef)(null);
        return i.length
          ? (0, n.jsxs)("div", {
              className: q,
              children: [
                (0, n.jsxs)("div", {
                  className: Q,
                  children: [
                    (0, n.jsx)("img", {
                      className: Z,
                      src: (0, b.lK)(
                        null == s ? void 0 : s.legalRightsAttrs,
                        "img_330_182",
                        !0
                      ),
                      alt: "",
                    }),
                    (0, n.jsxs)("span", {
                      className: W,
                      children: [" ", null == s ? void 0 : s.legalRightsName],
                    }),
                  ],
                }),
                i.map((e, t) =>
                  (0, n.jsxs)(
                    "div",
                    {
                      className: K,
                      children: [
                        "兑换码：",
                        e.cardPwd,
                        (0, n.jsx)("br", {}),
                        e.cardNo ? "兑换账号" : "",
                        (0, n.jsx)("div", {
                          className: (0, se.A)(z, "1" === e.state && J),
                          onClick: () => {
                            var t;
                            "1" !== e.state &&
                              re.V.writeText({
                                text: (
                                  null == e ||
                                  null === (t = e.cardPwd) ||
                                  void 0 === t
                                    ? void 0
                                    : t.length
                                )
                                  ? e.cardPwd
                                  : e.cardNo,
                              });
                          },
                          children: "1" === e.state ? "已使用" : "复制",
                        }),
                      ],
                    },
                    t
                  )
                ),
                i[0].startDate
                  ? (0, n.jsxs)("div", {
                      className: X,
                      children: [
                        "使用时间：",
                        null === (t = i[0]) || void 0 === t
                          ? void 0
                          : t.startDate,
                        "~",
                        null === (l = i[0]) || void 0 === l
                          ? void 0
                          : l.endDate,
                      ],
                    })
                  : null,
                (0, n.jsx)("input", {
                  className: $,
                  type: "text",
                  value: g,
                  disabled: !0,
                  style: { color: "#666" },
                }),
                (0, n.jsx)(V.A, {
                  className: ee,
                  inputClass: te,
                  blockChangeWhenCompositing: !0,
                  placeholder: "粘贴券码在此处进行兑换",
                  clearable: !0,
                  border: "none",
                  ref: h,
                  maxLength: 30,
                }),
                (0, n.jsxs)("div", {
                  className: le,
                  children: [
                    (0, n.jsx)("div", {
                      className: ae,
                      onClick: () =>
                        (0, a._)(function* () {
                          var e,
                            t,
                            l =
                              null === (t = h.current) ||
                              void 0 === t ||
                              null === (e = t.input) ||
                              void 0 === e
                                ? void 0
                                : e.value;
                          if (l)
                            try {
                              var a,
                                n,
                                r = yield (0, c.Q)({
                                  cardNo: v,
                                  cardCode: l,
                                  sku: u,
                                }),
                                s = JSON.parse(r.data),
                                i =
                                  null == s ||
                                  null === (a = s.body) ||
                                  void 0 === a
                                    ? void 0
                                    : a.chargeState,
                                _ =
                                  null == s ||
                                  null === (n = s.body) ||
                                  void 0 === n
                                    ? void 0
                                    : n.chargeDesc;
                              if (!i || "0" !== i)
                                return void w.Z.info(_ || "充值失败");
                              o(),
                                (0, I.N8)(d)
                                  ? w.Z.info("请点击“前往美团外卖点单”下单使用")
                                  : w.Z.success("充值成功");
                            } catch (e) {
                              w.Z.info("充值失败，请稍后重试");
                            }
                        })(),
                      children: "立即充值",
                    }),
                    "QY1709621567103" === u
                      ? (0, n.jsx)("div", {
                          className: ne,
                          onClick: () => {
                            P.x.navToZGYD(
                              "https://dev.coc.10086.cn/coc3/rights-singlepages/mswmzzy?sourceid=056002"
                            );
                          },
                          children: "前往美团外卖点单",
                        })
                      : null,
                  ],
                }),
                (0, n.jsx)(oe.s, {
                  className: G,
                  text: (0, b.lK)(
                    null == s ? void 0 : s.legalRightsAttrs,
                    "instructions"
                  ),
                }),
              ],
            })
          : null;
      }
      var de = "useExplain___nVpmq",
        ue = "title1___VPtP9",
        _e = "name___gFlBN",
        ve = "content___WrAxr",
        ge = "copyList___jvlYq",
        he = "useTime___w5pV6",
        me = "flexBox___Ej9GB",
        fe = "marqueeContainer___r3zbV",
        xe = "marqueeText___SECHp";
      function pe(e) {
        var t,
          l,
          {
            isShowQrcodeRights: a,
            order: i,
            order2: o,
            belongAreas: c,
            rightsInfo: d,
            receiveMode: u,
          } = e,
          [_, v] = (0, r.useState)(!1),
          g = (e) => {
            if (null == e ? void 0 : e.length)
              try {
                var t, l, a;
                null === (a = navigator) ||
                  void 0 === a ||
                  null === (l = a.clipboard) ||
                  void 0 === l ||
                  null === (t = l.writeText(e)) ||
                  void 0 === t ||
                  t.then(
                    () => {
                      v(!0);
                    },
                    () => {
                      v(!1);
                    }
                  );
              } catch (e) {}
          };
        (0, r.useEffect)(() => {
          var e = "";
          if (o.length > 0) {
            var t,
              l,
              a = null === (t = o[0]) || void 0 === t ? void 0 : t.cardPwd,
              n = null === (l = o[0]) || void 0 === l ? void 0 : l.cardNo;
            (e = (null == a ? void 0 : a.length) ? a : n), g(e);
          } else if (i.length > 0) {
            var r,
              s,
              c = null === (r = i[0]) || void 0 === r ? void 0 : r.cardPwd,
              d = null === (s = i[0]) || void 0 === s ? void 0 : s.cardNo;
            (e = (null == c ? void 0 : c.length) ? c : d), g(e);
          }
        }, [o, i]);
        var h = (e) => {
          var t = "兑换码：";
          return (
            "1500" === (0, I.xI)(d) && (t = "订单号："),
            "1300" ===
              (0, b.lK)(
                null == d ? void 0 : d.legalRightsAttrs,
                "receiveMode"
              ) && (t = "使用链接："),
            (0, I.H)(d, ["Ticket_Code_Password"]) &&
              0 === e &&
              (t = "兑换密码："),
            (0, I.H)(d, ["Ticket_Code_Password"]) &&
              1 === e &&
              (t = "电子券码："),
            (0, I.H)(d, ["TiktokLife"]) && 0 === e && (t = "兑换码1："),
            (0, I.H)(d, ["TiktokLife"]) && 1 === e && (t = "兑换码2："),
            t
          );
        };
        return (0, n.jsx)(n.Fragment, {
          children:
            a ||
            !((null == o ? void 0 : o.length) > 0) ||
            (null == i ? void 0 : i.length) > 0 ||
            c.includes("UnitedStatesTuanZone")
              ? null
              : (0, n.jsxs)("div", {
                  className: de,
                  children: [
                    1 === (null == o ? void 0 : o.length)
                      ? (0, n.jsxs)("div", {
                          className: ue,
                          style: { color: _ ? "#f27139" : "#555" },
                          children: [(0, n.jsx)("span", {}), " 已自动帮您复制"],
                        })
                      : null,
                    (0, n.jsxs)("div", {
                      className: _e,
                      children: [
                        (0, n.jsx)("img", {
                          src: (0, b.lK)(
                            null == d ? void 0 : d.legalRightsAttrs,
                            "img_330_182",
                            !0
                          ),
                          alt: "",
                        }),
                        (0, n.jsx)("span", {
                          children: null == d ? void 0 : d.legalRightsName,
                        }),
                      ],
                    }),
                    (0, n.jsx)("div", {
                      className: ge,
                      children:
                        null == o
                          ? void 0
                          : o.map((e, t) =>
                              (0, n.jsxs)(
                                s().Fragment,
                                {
                                  children: [
                                    (0, I.H)(d, ["TiktokLife"])
                                      ? null
                                      : (0, n.jsxs)("div", {
                                          style: {
                                            display: "flex",
                                            width: "100%",
                                            justifyContent: "space-between",
                                          },
                                          children: [
                                            "" !==
                                              (null == e ? void 0 : e.cardNo) &&
                                            (null == e ? void 0 : e.cardNo)
                                              ? "".concat(
                                                  (0, I.H)(d, [
                                                    "Ticket_Code_Password",
                                                  ])
                                                    ? "兑换卡号："
                                                    : "兑换账号："
                                                )
                                              : null,
                                            "" !==
                                              (null == e ? void 0 : e.cardNo) &&
                                            (null == e ? void 0 : e.cardNo)
                                              ? e.cardNo
                                              : null,
                                            "" !==
                                              (null == e ? void 0 : e.cardNo) &&
                                            (null == e ? void 0 : e.cardNo)
                                              ? (0, n.jsx)("div", {
                                                  style: {
                                                    color:
                                                      "1" === e.state
                                                        ? "#ccc"
                                                        : "#ff6200",
                                                    whiteSpace: "nowrap",
                                                    marginLeft: "4px",
                                                  },
                                                  onClick: () => {
                                                    if ("1" !== e.state)
                                                      try {
                                                        re.V.writeText({
                                                          text: e.cardNo,
                                                        });
                                                      } catch (e) {}
                                                  },
                                                  children: e.cardNo
                                                    ? "1" !== e.state
                                                      ? "复制"
                                                      : "已使用"
                                                    : "",
                                                })
                                              : null,
                                          ],
                                        }),
                                    (0, n.jsxs)("div", {
                                      style: {
                                        display: "flex",
                                        width: "100%",
                                        justifyContent: "space-between",
                                      },
                                      children: [
                                        (0, I.H)(d, ["TiktokLife"])
                                          ? (0, n.jsxs)("div", {
                                              className: me,
                                              children: [
                                                e.cardPwd ? h(t) : "",
                                                (0, n.jsx)("div", {
                                                  className: fe,
                                                  children: (0, n.jsx)("span", {
                                                    className: xe,
                                                    children: e.cardPwd
                                                      ? e.cardPwd
                                                      : "",
                                                  }),
                                                }),
                                              ],
                                            })
                                          : (0, n.jsxs)(n.Fragment, {
                                              children: [
                                                "" !== e.cardPwd ? h(t) : null,
                                                "" !== e.cardPwd
                                                  ? e.cardPwd
                                                  : null,
                                              ],
                                            }),
                                        "" !== e.cardPwd
                                          ? (0, n.jsx)("div", {
                                              style: {
                                                color:
                                                  "1" === e.state
                                                    ? "#ccc"
                                                    : "#ff6200",
                                                whiteSpace: "nowrap",
                                                marginLeft: "4px",
                                              },
                                              onClick: () => {
                                                "1" !== e.state &&
                                                  re.V.writeText({
                                                    text: e.cardNo,
                                                  });
                                              },
                                              children: e.cardPwd
                                                ? "1" !== e.state
                                                  ? "复制"
                                                  : "已使用"
                                                : "",
                                            })
                                          : null,
                                      ],
                                    }),
                                  ],
                                },
                                t
                              )
                            ),
                    }),
                    (null === (t = o[0]) || void 0 === t ? void 0 : t.endDate)
                      ? (0, n.jsxs)("div", {
                          className: he,
                          children: [
                            "有效期至：",
                            null === (l = o[0]) || void 0 === l
                              ? void 0
                              : l.endDate,
                            (0, n.jsx)("br", {}),
                            (0, I.H)(d, ["Ticket_Code_Password"])
                              ? "电子券码有效期至：".concat(o[1].endDate)
                              : "",
                          ],
                        })
                      : null,
                    (0, n.jsx)(oe.s, {
                      className: ve,
                      text: (0, b.lK)(
                        null == d ? void 0 : d.legalRightsAttrs,
                        "instructions"
                      ),
                    }),
                  ],
                }),
        });
      }
      var Ne = "QrcodeModule___bgUQz",
        ye = "head___uXbcx",
        je = "rightsIcon___jYtVE",
        Ce = "title___dE5b3",
        be = "body___JMGu8",
        Ie = "tips___dE1GR",
        Pe = "qrcode___JQ4Qr",
        Ae = "state___zlYHW",
        Re = "acState___OXDJ2",
        ke = "QrCodeValue___f3mw2",
        we = "endTime___rKNWb",
        Te = l(88815),
        Se = (e) => {
          var t,
            l,
            a,
            s,
            i,
            { rightsInfo: o, codeList: c, isShowQrcodeRights: d } = e,
            u = null == o ? void 0 : o.legalRightsName,
            _ = (0, b.lK)(
              null == o ? void 0 : o.legalRightsAttrs,
              "instructions"
            ),
            v = (0, b.lK)(
              null == o ? void 0 : o.legalRightsAttrs,
              "img_330_182",
              !0
            ),
            g = (null == c ? void 0 : c.length)
              ? null === (t = c[0]) || void 0 === t
                ? void 0
                : t.cardPwd
              : "",
            h = (null === (l = c[0]) || void 0 === l ? void 0 : l.endDate)
              ? null === (a = c[0]) || void 0 === a
                ? void 0
                : a.endDate
              : "",
            m = (null === (s = c[0]) || void 0 === s ? void 0 : s.state)
              ? null === (i = c[0]) || void 0 === i
                ? void 0
                : i.state
              : "0",
            f = (0, r.useMemo)(() => (0, I.Wj)(o), [o]);
          return d
            ? (0, n.jsxs)("div", {
                className: Ne,
                children: [
                  (0, n.jsxs)("div", {
                    className: ye,
                    children: [
                      (0, n.jsx)("img", { className: je, src: v, alt: "" }),
                      (0, n.jsx)("div", { className: Ce, children: u }),
                    ],
                  }),
                  (0, n.jsxs)("div", {
                    className: be,
                    children: [
                      (0, n.jsx)("div", {
                        className: Ie,
                        children: (0, n.jsx)(oe.s, { text: _ }),
                      }),
                      (0, n.jsx)("div", {
                        className: Pe,
                        children: (0, n.jsx)(Te.h, { value: g, size: 100 }),
                      }),
                      (0, n.jsx)("div", {
                        className: (0, se.A)(
                          { [Ae]: "0" !== m },
                          { [Re]: "0" === m }
                        ),
                        children: "0" !== m ? "已使用" : "待使用",
                      }),
                      f
                        ? (0, n.jsx)("div", { className: ke, children: g })
                        : null,
                      h
                        ? (0, n.jsxs)("div", {
                            className: we,
                            children: ["有效期至：", h],
                          })
                        : null,
                    ],
                  }),
                ],
              })
            : null;
        },
        Oe = "ResultDescription___n2HT7",
        Be = "ShopCartResultDescription___ROSMS",
        Le = "Description___DYIIc",
        De = "Dotted___sJAMh",
        Me = "Hint___PkNOK",
        Ee = "Tips___V1HIk";
      function Ue() {
        return (0, n.jsxs)("div", {
          className: Be,
          children: [
            (0, n.jsx)("div", {
              className: Le,
              children:
                "您的购物车订单已提交，正在处理中… 请在我的订单中查看办理结果。",
            }),
            (0, n.jsx)("div", { className: De }),
            (0, n.jsx)("div", { className: Me, children: "温馨提示" }),
            (0, n.jsxs)("div", {
              className: Ee,
              children: [
                "若购物车内 ",
                (0, n.jsx)("span", {
                  style: { color: "#FD1111" },
                  children: "提交的订单兑换失败",
                }),
                "， 权益平台会",
                (0, n.jsx)("span", {
                  style: { color: "#FD1111" },
                  children: "自动回退相应通用兑换券",
                }),
                "，您可稍后查看，并再次兑换符合条件的权益",
              ],
            }),
          ],
        });
      }
      function Fe(e) {
        var { resoultAB: t, type: l, resoult: a, resultMsg: r } = e,
          s = {
            0: void 0,
            1: "您的订单办理成功，订购结果详见短信或查看订单。",
            2: "您的订单办理失败，兑换券已退回，请重新选择兑换权益。",
          },
          i = {
            custom: r,
            "seckill-1": "您的订单已经提交成功，订购结果详情见短信。",
            "seckill-0-1001": "秒杀还未开始，请稍后再试。",
            "seckill-0-1002": "秒杀产品已被抢光了，请关注下期秒杀活动。",
            1: "您的订单已经提交成功，订购结果详情见短信或查看订单",
            2: "该业务仅限北京移动用户办理",
            3: "对不起，办理失败，可能是以下原因：1.余额不足；2.您不符合办理条件；如有疑问请拨打10086查询。",
            4: "订购成功后，权益到账有延迟。请以收到10086【订购成功提醒】短信为准。\n          \n若兑换券信息未能更新，  请重新登录，查看到账的兑换券。",
            5: "您的订单，及咪咕视频月会员（赠品）订单已提交成功，订购结果详见短信或查看订单。",
            6: "本月五折权益在其他活动页面已购买，请您下月再来",
            7: "本月权益福袋在其他活动页面已领取，请您下月再来",
          },
          o = "您已经开通了北京移动".concat(
            "gold" === l ? "黄金会员" : "Plus会员"
          ),
          c = s[t] || i[a] || o;
        return "shopCar" === l
          ? (0, n.jsx)(Ue, {})
          : (0, n.jsx)("div", { className: Oe, children: c });
      }
      var He = "ResultTitle___PrkUV",
        Ye = "success2___sJNnS",
        Ve = "success3___NXk9m",
        qe = "success4___qL1TW";
      function Qe(e) {
        var { type: t, resoult: l } = e;
        return "seckill-0-1001" === l || "seckill-0-1002" === l
          ? (0, n.jsx)("img", {
              src: "".concat(
                gImgUrlPrefixLegacy,
                "/rights/202303/30182b09-2611-4689-ac64-7db26536dea0-tan.png"
              ),
              alt: "",
              className: Ye,
            })
          : (0, n.jsxs)(n.Fragment, {
              children: [
                "shopCar" === t
                  ? (0, n.jsx)("img", {
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202303/5151d408-000a-4dc1-bc57-863697bc0a63-success.png"
                      ),
                      alt: "",
                      className: qe,
                    })
                  : null,
                "1" === l || "4" === l || "5" === l || "seckill-1" === l
                  ? (0, n.jsx)("img", {
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202303/5151d408-000a-4dc1-bc57-863697bc0a63-success.png"
                      ),
                      alt: "",
                      className: "shopCar" === t ? Ve : Ye,
                    })
                  : (0, n.jsx)("img", {
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202303/30182b09-2611-4689-ac64-7db26536dea0-tan.png"
                      ),
                      alt: "",
                      className: "shopCar" === t ? Ve : Ye,
                    }),
              ],
            });
      }
      function Ze(e) {
        var { resoult: t, type: l, resoultAB: a } = e;
        return (0, n.jsxs)("div", {
          className: He,
          children: [
            (0, n.jsx)(Qe, { resoult: t, type: l }),
            "shopCar" === l ? "购物车" : "",
            (() => {
              switch (a) {
                case "1":
                  return "办理成功";
                case "2":
                  return "办理失败";
                case "0":
                  return "提交";
                default:
                  return "";
              }
            })(),
            "0" === a
              ? "shopCar" === l
                ? ("shopCar" === l && "1" === t) || "4" === t
                  ? "订单已提交,正在处理中！"
                  : ""
                : "1" === t || "4" === t || "5" === t || "seckill-1" === t
                ? "成功"
                : "失败"
              : "",
          ],
        });
      }
      var We = "SpikeOP___Dh2dZ",
        Ge = "badge___eC5_j",
        Ke = "content___RdSQu",
        ze = "rights___vrHRD",
        Je = "period___laOES",
        Xe = "count___dw7LX",
        $e = l(95553),
        et = l(77952);
      function tt() {
        var e,
          t,
          { legalRightsNbr: l } = (0, j.dj)(),
          [a, s] = (0, r.useState)(null),
          { isSeckillRight: i, seckillRightData: o } = (0, $e.p)({
            rightsNbr: l,
          });
        return (
          (0, r.useEffect)(() => {
            l &&
              (0, g.AV)({ legalRightsNbr: l, page: 1, rows: 1 }).then((e) => {
                e.data && s(e.data[0]);
              });
          }, [l]),
          i && o
            ? (0, n.jsxs)("div", {
                className: We,
                children: [
                  (0, n.jsx)("div", { className: Ge }),
                  (0, n.jsxs)("div", {
                    className: Ke,
                    children: [
                      (0, n.jsxs)("div", {
                        className: ze,
                        children: [
                          (0, n.jsx)("img", {
                            src: a
                              ? (0, b.lK)(
                                  null == a ? void 0 : a.legalRightsAttrs,
                                  "img_211_151",
                                  !0
                                )
                              : "",
                            alt: "",
                          }),
                          (0, n.jsx)("span", {
                            children: o.nextSeckillVO.rightsName,
                          }),
                        ],
                      }),
                      (0, n.jsx)("div", {
                        className: Je,
                        children: (0, n.jsx)("span", {
                          children: (0, et.Y)(
                            null === (e = o.nextSeckillVO) || void 0 === e
                              ? void 0
                              : e.seckillStartDate,
                            null === (t = o.nextSeckillVO) || void 0 === t
                              ? void 0
                              : t.seckillEndDate
                          ),
                        }),
                      }),
                      (0, n.jsxs)("div", {
                        className: Xe,
                        children: [
                          o.nextSeckillVO.totalStockNum,
                          "个 先到先得",
                        ],
                      }),
                    ],
                  }),
                ],
              })
            : null
        );
      }
      var lt = "TipsCard___uBtoo",
        at = "body___KpHd4",
        nt = "head___gpW27",
        rt = "button4___gWaSD",
        st = "button5___oNDt7";
      function it(e) {
        var { legalRightsId: t, isShowQrcodeRights: l, receiveMode: a } = e,
          [s, i] = (0, r.useState)(!1),
          [o, c] = (0, r.useState)(),
          d = (e, t) => {
            var l;
            return null === (l = e.find((e) => e.attrNbr === t)) || void 0 === l
              ? void 0
              : l.attrValue;
          };
        return (
          (0, r.useEffect)(() => {
            (0, g.eP)({
              certificateId: h.z,
              rightIdList: [t],
              queryScope: "1",
              returnExchangeTimes: "0",
            }).then((e) => {
              var t,
                l =
                  null == e || null === (t = e.data) || void 0 === t
                    ? void 0
                    : t.legalRightsList;
              if (l && l.length) {
                var { legalRightsAttrs: a } = l[0];
                a &&
                  (i(
                    "1100" !== d(a, "receiveMode") &&
                      "1200" !== d(a, "receiveMode") &&
                      "1300" !== d(a, "receiveMode")
                  ),
                  c({
                    icon: d(a, "img_211_151") || "",
                    name: l[0].legalRightsName,
                    desc: d(a, "instructions") || "",
                    legalRightsAttrs: a,
                  }));
              }
            });
          }, []),
          !l && "1500" !== a && t.length && t
            ? (0, n.jsx)(n.Fragment, {
                children:
                  s && o
                    ? (0, n.jsxs)("div", {
                        className: lt,
                        children: [
                          (0, n.jsxs)("div", {
                            className: nt,
                            children: [
                              (0, n.jsx)("img", {
                                style: {
                                  borderRadius: 4,
                                  width: "0.5rem",
                                  height: "0.5rem",
                                },
                                src: ""
                                  .concat(gImgUrlPrefixLegacy)
                                  .concat(null == o ? void 0 : o.icon),
                                alt: "",
                              }),
                              (0, n.jsx)("span", {
                                children: null == o ? void 0 : o.name,
                              }),
                            ],
                          }),
                          (null == o ? void 0 : o.desc)
                            ? (0, n.jsx)(oe.s, {
                                className: at,
                                text: null == o ? void 0 : o.desc,
                              })
                            : null,
                          "1798989978579685377" === t
                            ? (0, n.jsx)("div", {
                                className: rt,
                                onClick: () => {
                                  P.x.navToZGYD(
                                    "https://dev.coc.10086.cn/coc2/web/pullapp/index.html?targetURL=https://h.app.coc.10086.cn/cmcc-app/eleme/eleme.html"
                                  );
                                },
                                children: "前往饿了么点单",
                              })
                            : null,
                          (0, b.pB)(
                            null == o ? void 0 : o.legalRightsAttrs,
                            "appleButton"
                          )
                            ? (0, n.jsx)("div", {
                                className: st,
                                onClick: () => {
                                  P.x.navToZGYD(
                                    "https://plus.migu.cn/c/0fl4yn?sourceid=012041&tp=ANDT"
                                  );
                                },
                                children: "去使用",
                              })
                            : null,
                        ],
                      })
                    : null,
              })
            : null
        );
      }
      function ot() {
        var e;
        (e = (0, j.pg)()),
          (0, r.useEffect)(() => {
            window.scrollTo(0, 0);
          }, [e]),
          (() => {
            var { id: e } = (0, j.dj)();
            (0, r.useEffect)(() => {
              "QY1657279699640" === e &&
                setTimeout(() => {
                  C.R.open({
                    title: "温馨提示",
                    content:
                      "2022年12月1日起，云闪付电费调整为每人每月仅可领取“1次”。",
                  });
                }, 500);
            }, [e]);
          })();
        var {
            resoult: t = "1",
            type: l = "gold",
            resultMsg: s,
            custOrderId: _ = "",
            legalRightsNbr: g = "",
            legalRightsId: h = "",
            act: m = "",
          } = (0, j.dj)(),
          [f, T] = (0, r.useState)("0"),
          [S, O] = (0, r.useState)(),
          [B, L] = (0, r.useState)(!1),
          [D, M] = (0, r.useState)([]),
          [E, U] = (0, r.useState)([]),
          [F, H] = (0, r.useState)(!1),
          [V, q] = (0, r.useState)(4),
          Q = (0, r.useMemo)(() => (0, I.Cg)(S), [S]),
          Z = (0, r.useMemo)(() => (0, I.xI)(S), [S]),
          W = (0, r.useMemo)(
            () =>
              (0, d.w3)(
                (0, b.lK)(
                  null == S ? void 0 : S.legalRightsAttrs,
                  "receiveMode"
                )
              ) && (null == E ? void 0 : E.length),
            [
              null == S ? void 0 : S.legalRightsAttrs,
              null == E ? void 0 : E.length,
            ]
          ),
          { run: G, cancel: K } = (0, y.A)(
            () =>
              (0, a._)(function* () {
                var e, t, l, n;
                q(V + 2);
                var r = yield (0, c.H7)({ custOrderId: _ });
                if (
                  "1000" ===
                  (null == r ||
                  null === (t = r.data) ||
                  void 0 === t ||
                  null === (e = t.customerOrder) ||
                  void 0 === e
                    ? void 0
                    : e.statusCd)
                ) {
                  var s, i, o;
                  if (
                    (H(!1),
                    T("1"),
                    K(),
                    "1500" ===
                      (0, b.lK)(
                        null == S ? void 0 : S.legalRightsAttrs,
                        "receiveMode"
                      ))
                  ) {
                    try {
                      setTimeout(
                        () =>
                          (0, a._)(function* () {
                            var e = yield v({
                              queryFn:
                                "99plus" === m || "Mzone" === m
                                  ? "queryOrderDetail"
                                  : "queryCouponRecords",
                              custOrderId:
                                "99plus" === m || "Mzone" === m ? _ : void 0,
                            });
                            U(e);
                          })(),
                        200
                      );
                    } catch (e) {}
                    return;
                  }
                  if (
                    "QY1709621567103" ===
                    (null == S ? void 0 : S.legalRightsNbr)
                  ) {
                    var h,
                      f = (0, u.L)(
                        null == r || null === (h = r.data) || void 0 === h
                          ? void 0
                          : h.resourceCode
                      );
                    (null == f ? void 0 : f.length) &&
                      M(f.map((e) => ({ cardPwd: e })));
                  } else if (
                    (null == r || null === (s = r.data) || void 0 === s
                      ? void 0
                      : s.resourceCode) &&
                    null !==
                      (null == r || null === (i = r.data) || void 0 === i
                        ? void 0
                        : i.resourceCode) &&
                    "" !==
                      (null == r || null === (o = r.data) || void 0 === o
                        ? void 0
                        : o.resourceCode) &&
                    "1000" !==
                      (0, b.lK)(
                        null == S ? void 0 : S.legalRightsAttrs,
                        "receiveMode"
                      ) &&
                    "QY1683717381999" !==
                      (null == S ? void 0 : S.legalRightsNbr) &&
                    "QY1632823068390" !==
                      (null == S ? void 0 : S.legalRightsNbr) &&
                    "QY1725326825616" !==
                      (null == S ? void 0 : S.legalRightsNbr)
                  ) {
                    var x,
                      p = (0, u.L)(
                        null == r || null === (x = r.data) || void 0 === x
                          ? void 0
                          : x.resourceCode
                      );
                    (null == p ? void 0 : p.length) &&
                      U(
                        p.map((e) => {
                          var t;
                          return {
                            cardPwd: e,
                            endDate: (0, d.Yq)(
                              null == r || null === (t = r.data) || void 0 === t
                                ? void 0
                                : t.expTime
                            ),
                          };
                        })
                      );
                  }
                  setTimeout(() => {
                    (0, a._)(function* () {
                      if (
                        "1500" ===
                        (0, b.lK)(
                          null == S ? void 0 : S.legalRightsAttrs,
                          "receiveMode"
                        )
                      ) {
                        var e = yield v({
                          queryFn:
                            "99plus" === m || "Mzone" === m
                              ? "queryOrderDetail"
                              : "queryCouponRecords",
                          custOrderId:
                            "99plus" === m || "Mzone" === m ? _ : void 0,
                        });
                        U(e);
                      } else
                        "1200" ===
                        (0, b.lK)(
                          null == S ? void 0 : S.legalRightsAttrs,
                          "receiveMode"
                        )
                          ? (0, c.tv)({
                              extOrderId: _,
                              sku: g,
                              extCustOrderId: _,
                            }).then((e) => {
                              var t, l, a;
                              "0" === (null == e ? void 0 : e.resultCode) &&
                                (null == e ||
                                null === (t = e.data) ||
                                void 0 === t
                                  ? void 0
                                  : t.length) &&
                                ("" ===
                                  (null == e ||
                                  null === (l = e.data[0]) ||
                                  void 0 === l
                                    ? void 0
                                    : l.cardNo) &&
                                "" ===
                                  (null == e ||
                                  null === (a = e.data[0]) ||
                                  void 0 === a
                                    ? void 0
                                    : a.cardPwd)
                                  ? w.Z.info("订单正在提交")
                                  : M(null == e ? void 0 : e.data));
                            })
                          : ("1100" ===
                              (0, b.lK)(
                                null == S ? void 0 : S.legalRightsAttrs,
                                "receiveMode"
                              ) ||
                              "1300" ===
                                (0, b.lK)(
                                  null == S ? void 0 : S.legalRightsAttrs,
                                  "receiveMode"
                                )) &&
                            (0, c.tv)({
                              extOrderId: _,
                              sku: g,
                              extCustOrderId: _,
                            }).then((e) => {
                              var t, l, a;
                              "0" === (null == e ? void 0 : e.resultCode) &&
                                (null == e ||
                                null === (t = e.data) ||
                                void 0 === t
                                  ? void 0
                                  : t.length) &&
                                ("" ===
                                  (null == e ||
                                  null === (l = e.data[0]) ||
                                  void 0 === l
                                    ? void 0
                                    : l.cardNo) &&
                                "" ===
                                  (null == e ||
                                  null === (a = e.data[0]) ||
                                  void 0 === a
                                    ? void 0
                                    : a.cardPwd)
                                  ? w.Z.info("订单正在提交")
                                  : U(null == e ? void 0 : e.data));
                            });
                    })();
                  }, 8e3);
                }
                "1200" ===
                  (null == r ||
                  null === (n = r.data) ||
                  void 0 === n ||
                  null === (l = n.customerOrder) ||
                  void 0 === l
                    ? void 0
                    : l.statusCd) && (H(!1), T("2"), K());
              })(),
            { manual: !0, pollingInterval: 2e3, pollingWhenHidden: !1 }
          );
        return (
          (0, r.useEffect)(() => {
            (0, a._)(function* () {
              var e;
              (e = "99plus" === m ? p : "Mzone" === m ? N : x), L(!0);
              var l = yield e(g, h);
              if ((L(!1), l)) {
                O(l);
                var n = (0, b.lK)(l.legalRightsAttrs, "receiveMode");
                if ("QY1670293878985" !== l.legalRightsNbr)
                  if (
                    "1200" !==
                      (null == l ? void 0 : l.legalRightsSubordinate) ||
                    "1000" !==
                      (0, b.lK)(
                        null == l ? void 0 : l.legalRightsAttrs,
                        "syncGroup"
                      ) ||
                    ("1" !== t && "4" !== t && "5" !== t && "seckill-1" !== t)
                  )
                    if ("1500" === n)
                      try {
                        setTimeout(
                          () =>
                            (0, a._)(function* () {
                              var e = yield v({
                                queryFn:
                                  "99plus" === m || "Mzone" === m
                                    ? "queryOrderDetail"
                                    : "queryCouponRecords",
                                custOrderId:
                                  "99plus" === m || "Mzone" === m ? _ : void 0,
                              });
                              U(e);
                            })(),
                          2e3
                        );
                      } catch (e) {}
                    else
                      "1200" === n
                        ? (0, c.tv)({
                            extOrderId: _,
                            sku: g,
                            extCustOrderId: _,
                          }).then((e) => {
                            var t, l, a;
                            "0" === (null == e ? void 0 : e.resultCode) &&
                              (null == e ||
                              null === (t = e.data) ||
                              void 0 === t
                                ? void 0
                                : t.length) &&
                              ("" ===
                                (null == e ||
                                null === (l = e.data[0]) ||
                                void 0 === l
                                  ? void 0
                                  : l.cardNo) &&
                              "" ===
                                (null == e ||
                                null === (a = e.data[0]) ||
                                void 0 === a
                                  ? void 0
                                  : a.cardPwd)
                                ? w.Z.info("订单正在提交")
                                : M(e.data));
                          })
                        : ("1100" !== n && "1300" !== n) ||
                          (0, c.tv)({
                            extOrderId: _,
                            sku: g,
                            extCustOrderId: _,
                          }).then((e) => {
                            var t, l, a;
                            "0" === (null == e ? void 0 : e.resultCode) &&
                              (null == e ||
                              null === (t = e.data) ||
                              void 0 === t
                                ? void 0
                                : t.length) &&
                              ("" ===
                                (null == e ||
                                null === (l = e.data[0]) ||
                                void 0 === l
                                  ? void 0
                                  : l.cardNo) &&
                              "" ===
                                (null == e ||
                                null === (a = e.data[0]) ||
                                void 0 === a
                                  ? void 0
                                  : a.cardPwd)
                                ? w.Z.info("订单正在提交")
                                : U(e.data));
                          });
                  else
                    H(!0),
                      setTimeout(() => {
                        G();
                      }, 2e3);
              }
            })();
          }, []),
          (0, r.useEffect)(
            () => () => {
              K();
            },
            [K]
          ),
          (0, n.jsxs)(n.Fragment, {
            children: [
              (0, n.jsxs)("div", {
                className: i,
                children: [
                  (0, n.jsxs)("div", {
                    className: o,
                    children: [
                      (0, n.jsx)(Ze, { resoultAB: f, resoult: t, type: l }),
                      (0, n.jsx)(Fe, {
                        type: l,
                        resoult: t,
                        resoultAB: f,
                        resultMsg: s,
                      }),
                      (0, n.jsx)(ce, {
                        order: D,
                        rightsInfo: S,
                        onRechargeSuccess: () => {
                          setTimeout(() => {
                            (0, c.tv)({
                              extOrderId: _,
                              sku: g,
                              extCustOrderId: _,
                            }).then((e) => {
                              "0" === e.resultCode &&
                                e.data &&
                                "" !== e.data.cardNo &&
                                M(e.data);
                            });
                          }, 2e3);
                        },
                      }),
                      (0, n.jsx)(Se, {
                        isShowQrcodeRights: W,
                        rightsInfo: S,
                        codeList: E,
                      }),
                      (0, n.jsx)(pe, {
                        isShowQrcodeRights: W,
                        order2: E,
                        order: D,
                        belongAreas: Q,
                        rightsInfo: S,
                        receiveMode: Z,
                      }),
                      (0, n.jsx)(Y, {
                        resoultAB: f,
                        queryRightsInfoLoading: B,
                        belongAreas: Q,
                        codeList: E,
                        receiveMode: Z,
                      }),
                      (0, n.jsx)(it, {
                        isShowQrcodeRights: W,
                        legalRightsId: h,
                        receiveMode: Z,
                      }),
                    ],
                  }),
                  (0, n.jsx)(tt, {}),
                  (0, n.jsx)(k.D, {}),
                  (0, n.jsx)(A.J, {}),
                ],
              }),
              (0, n.jsx)(R.h, {
                open: F,
                hasBanner: !0,
                onClose: () => {
                  K(), H(!1);
                },
                onOk: () => {
                  K(), H(!1), P.x.navToPath("/orderList");
                },
              }),
            ],
          })
        );
      }
    },
    4927(e, t, l) {
      l.d(t, { P: () => s });
      var a = l(20696),
        n = l(99751),
        r = l(65059),
        s = (0, n.vt)()(
          (0, r.lt)(
            (e, t) => ({
              theme: "NORMAL",
              pageType: null,
              updateTheme: (t) => e(() => ({ theme: t })),
              updatePageType: (t) => e(() => ({ pageType: t })),
              showOpenTipsModal: () => {
                var { pageType: e } = t();
                a.x.navToPath(
                  "Plus" === e ? "/memberOpen/selectMeaI" : "/memberOpen"
                );
              },
            }),
            { name: "RMS_VIP_PAGE" }
          )
        );
    },
    52112(e, t, l) {
      l.d(t, { W: () => r, Y: () => s });
      var a = l(13454),
        n = l(78337);
      function r() {
        return (0, a._)(function* () {
          return (0, n.t)({ abilityCode: "SECKILL_LIST_QRY", data: {} });
        })();
      }
      function s(e) {
        return (0, a._)(function* () {
          return (0,
          n.t)({ abilityCode: "SECKILL_DETAIL_QRY", data: { rightsNbr: e } });
        })();
      }
    },
    36436(e, t, l) {
      l.d(t, { C: () => a, M: () => n });
      var a = (0, l(99751).vt)()(() => ({
          hasCenterModalVisible: !1,
          wxSdkStatus: "waiting",
        })),
        n = {
          updateHasCenterModalVisible: (e) => {
            a.setState({ hasCenterModalVisible: e });
          },
          updateWxSdkStatus: (e) => {
            a.setState({ wxSdkStatus: e });
          },
        };
    },
    6655(e, t, l) {
      l.d(t, { F: () => r });
      var a = l(20837);
      function n(e) {
        return e
          ? e
              .replace(/(\d+)_(\d+)/g, "$1x$2")
              .split("_")
              .filter(Boolean)
              .map((e) => e[0].toUpperCase() + e.slice(1))
              .join("")
          : "";
      }
      function r(e) {
        if (!e || "object" != typeof e || Array.isArray(e)) return e;
        var t = (0, a._)({}, e),
          l = ["belongAreas"].map((e) => "_feAttr".concat(n(e)));
        return (
          ["legalRightsAttrs", "entityAttrs", "attrs"].forEach((a) => {
            var r = e[a];
            Array.isArray(r) &&
              r.forEach((e) => {
                var a, r;
                if ("attrNbr" in e && "attrValue" in e)
                  ({ attrNbr: a, attrValue: r } = e);
                else {
                  var s = Object.keys(e);
                  if (1 !== s.length) return;
                  ([a] = s), (r = e[a]);
                }
                if (a && void 0 !== r) {
                  var i = "_feAttr".concat(n(a));
                  void 0 === t[i]
                    ? (t[i] = l.includes(i) ? [r] : r)
                    : Array.isArray(t[i])
                    ? t[i].push(r)
                    : (t[i] = [t[i], r]);
                }
              });
          }),
          t
        );
      }
    },
    77952(e, t, l) {
      l.d(t, { Y: () => s, d: () => i });
      var a = l(56287),
        n = l.n(a),
        r = l(60707);
      function s(e, t) {
        if (r.A(e) || r.A(t)) return "";
        function l(e) {
          var [t, l] = e.split(" "),
            [a, n, r] = t.split("-"),
            [s, i, o] = l.split(":");
          return {
            year: parseInt(a, 10),
            month: parseInt(n, 10),
            day: parseInt(r, 10),
            hour: parseInt(s, 10),
            minute: i,
            second: o,
          };
        }
        var a = l(e),
          n = l(t);
        return ""
          .concat(a.month, "月")
          .concat(a.day, "日  ")
          .concat(a.hour, ":")
          .concat(a.minute, "-")
          .concat(n.hour, ":")
          .concat(n.minute);
      }
      function i(e, t) {
        var l = n()(),
          a = n()(e),
          r = n()(t);
        return l.isAfter(a) && l.isBefore(r);
      }
    },
    88229(e, t, l) {
      l.d(t, { l: () => a, y: () => n });
      var a = () => {},
        n = (e) => new Promise((t) => setTimeout(t, e));
    },
  },
]);
