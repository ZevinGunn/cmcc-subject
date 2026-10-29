"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["6180"],
  {
    64993() {},
    66314(e, a, r) {
      var t = r(5482),
        l = r(80462),
        i = r.n(l),
        s = r(41486),
        n = r(43941),
        c = r(4958),
        o = r(64176),
        d = r(3299);
      a.A = function (e, a) {
        var r;
        d.A && (0, o.Tn)(e);
        var l = (0, n.A)(e),
          u =
            null !== (r = null == a ? void 0 : a.wait) && void 0 !== r
              ? r
              : 1e3,
          g = (0, s.useMemo)(function () {
            return i()(
              function () {
                for (var e = [], a = 0; a < arguments.length; a++)
                  e[a] = arguments[a];
                return l.current.apply(
                  l,
                  (0, t.__spreadArray)([], (0, t.__read)(e), !1)
                );
              },
              u,
              a
            );
          }, []);
        return (
          (0, c.A)(function () {
            g.cancel();
          }),
          { run: g, cancel: g.cancel, flush: g.flush }
        );
      };
    },
    94463(e, a, r) {
      r.r(a), r.d(a, { default: () => je });
      var t = r(13454),
        l = r(86070),
        i = r(41486),
        s = r.n(i),
        n = "FlowModule___rb9sk",
        c = "flowListWrap___OIETe",
        o = "FallsItemWrap___UTflf",
        d = "flowList___UewNv",
        u = "tips___xJcjN",
        g = r(15189),
        m = r(73508),
        h = r(82647),
        v = r(64308),
        _ = r(20696),
        f = r(60707),
        p = r(16959),
        b = [
          { key: "1099", title: "猜你喜欢" },
          { key: "1000", title: "视频会员" },
          { key: "1001", title: "听阅会员" },
          { key: "1011", title: "通信业务" },
          { key: "1012", title: "购物消费" },
          { key: "1005", title: "生活服务" },
          { key: "1002", title: "出行工具" },
          { key: "1006", title: "办公工具" },
          { key: "1013", title: "少儿教育" },
          { key: "1007", title: "运动健康" },
          { key: "1014", title: "游戏动漫" },
        ],
        N = [
          { key: "1099", title: "猜你喜欢" },
          { key: "9999", title: "会员价" },
          { key: "1000", title: "视频会员" },
          { key: "1001", title: "听阅会员" },
          { key: "1011", title: "通信业务" },
          { key: "1012", title: "购物消费" },
          { key: "1005", title: "生活服务" },
          { key: "1002", title: "出行工具" },
          { key: "1006", title: "办公工具" },
          { key: "1013", title: "少儿教育" },
          { key: "1007", title: "运动健康" },
          { key: "1014", title: "游戏动漫" },
        ],
        x = "exchangeItem___W_9Gq",
        y = "imgBox___lNb11",
        A = "qqticon___q_QDm",
        j = "icon___i6yGr",
        k = "prodName___Sn7ph",
        R = "number___BA1Gj",
        T = "button___kcHbf",
        I = "fallsItem___VNLiQ",
        C = "buyButton___RNWzB",
        P = "salePrice___hKWbB",
        w = "sp___natl2",
        B = "salePrice2___ayWzV",
        E = "vipTitle___D3dTx",
        O = "prodName2___lAWRm",
        Y = "prodBox___tFneW",
        L = "vipPrice___PT2JB",
        Q = "symbol___PxI7_",
        V = "imgWrap___c5zbN",
        S = "prodImg___Acb3A",
        D = "oftenBuy____8L9c",
        U = r(13526),
        F = r(10059),
        W = r(7960),
        M = {
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
      function H(e) {
        var a,
          r,
          {
            data: t,
            alias: s = {
              prodName2: "prodName2",
              prodName: "prodName",
              salePrice: "salePrice",
              price: "price",
              imgSrc: "imgSrc",
              id: "id",
              exclusive: "exclusive",
              Desc: "Desc",
            },
            onClick: n,
            goodsDetailsRender: c,
            currentTabKey: o,
          } = e,
          [d, u] = (0, i.useState)({
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
          (0, i.useEffect)(() => {
            var e = d;
            Object.keys(s).forEach((a) => {
              e[a] = s[a];
            }),
              u(e);
          }, [s]),
          "1000" !== t.belongAreas && "1011" !== t.belongAreas
            ? (0, l.jsxs)("div", {
                className: x,
                onClick: () => {
                  n(t);
                },
                children: [
                  (0, l.jsx)("div", {
                    className: y,
                    children: (0, l.jsxs)("div", {
                      className: V,
                      children: [
                        (0, l.jsx)(F.Y, { statusCd: t.statusCd, size: "lg" }),
                        (0, l.jsx)(W._, { className: S, src: t.imgSrc }),
                      ],
                    }),
                  }),
                  "1000" === t.qqtFirst
                    ? (0, l.jsx)("img", {
                        className: A,
                        src: M.global,
                        alt: "",
                      })
                    : "",
                  "1" === t.isUsual
                    ? (0, l.jsx)("img", {
                        className: j,
                        src: M.myUsual,
                        alt: "",
                      })
                    : (0, l.jsx)("img", {
                        className: j,
                        src: M.myHot,
                        alt: "",
                      }),
                  (0, l.jsx)("div", {
                    className: k,
                    children: null == t ? void 0 : t.prodName2,
                  }),
                  (0, l.jsxs)("div", {
                    className: R,
                    children: [
                      null == t ? void 0 : t.certificateNum,
                      "张兑换券",
                    ],
                  }),
                  (0, l.jsx)("div", { className: T, children: "立即兑换" }),
                ],
              })
            : (0, l.jsxs)("div", {
                className: I,
                onClick: () => n(t),
                children: [
                  "1" === (null == t ? void 0 : t.isUsual) && "1099" === o
                    ? (0, l.jsx)("div", { className: D, children: "常买" })
                    : null,
                  (0, l.jsx)("div", {
                    className: y,
                    children: (0, l.jsxs)("div", {
                      className: V,
                      children: [
                        (0, l.jsx)(F.Y, { statusCd: t.statusCd, size: "lg" }),
                        (0, l.jsx)(W._, { className: S, src: t[d.imgSrc] }),
                      ],
                    }),
                  }),
                  c ||
                    (0, l.jsxs)(l.Fragment, {
                      children: [
                        (0, l.jsx)("div", {
                          className: (0, U.A)({
                            [k]:
                              (null === (a = t[d.prodName]) || void 0 === a
                                ? void 0
                                : a.length) <= 6,
                            [O]:
                              (null === (r = t[d.prodName]) || void 0 === r
                                ? void 0
                                : r.length) >= 7,
                          }),
                          children: (0, l.jsx)("div", {
                            className: Y,
                            children: t[d.prodName],
                          }),
                        }),
                        (0, l.jsx)("div", {
                          className: (0, U.A)(L),
                          children: (0, l.jsx)("span", {
                            className: Q,
                            children:
                              "1" === t.justForMember && t[d.price]
                                ? (0, l.jsxs)("span", {
                                    children: ["标准价￥", t[d.price]],
                                  })
                                : "超值权益",
                          }),
                        }),
                        (0, l.jsxs)("div", {
                          className: C,
                          children: [
                            (0, l.jsxs)("div", {
                              className: (0, U.A)(P, {
                                [B]: t[d.salePrice].length >= 5,
                              }),
                              children: [
                                "￥",
                                "1" === t.justForMember && t[d.salePrice]
                                  ? (0, l.jsxs)(l.Fragment, {
                                      children: [
                                        t[d.salePrice].slice(
                                          0,
                                          t[d.salePrice].indexOf(".")
                                        ),
                                        (0, l.jsx)("span", {
                                          className: (0, U.A)({
                                            [w]:
                                              -1 !==
                                              t[d.salePrice].indexOf("."),
                                          }),
                                          children: t[d.salePrice].slice(
                                            t[d.salePrice].indexOf(".")
                                          ),
                                        }),
                                      ],
                                    })
                                  : (0, l.jsxs)(l.Fragment, {
                                      children: [
                                        t[d.price].slice(
                                          0,
                                          t[d.price].indexOf(".")
                                        ),
                                        (0, l.jsx)("span", {
                                          className: (0, U.A)({
                                            [w]: -1 !== t[d.price].indexOf("."),
                                          }),
                                          children: t[d.price].slice(
                                            t[d.price].indexOf(".")
                                          ),
                                        }),
                                      ],
                                    }),
                              ],
                            }),
                            (0, l.jsx)("div", {
                              className: E,
                              children: (0, l.jsx)("span", {
                                children:
                                  "1" === t.justForMember && t[d.salePrice]
                                    ? "会员价"
                                    : "立购",
                              }),
                            }),
                          ],
                        }),
                      ],
                    }),
                ],
              })
        );
      }
      r(56969);
      var z = r(9559),
        q = "SwiperBox___RLq1y",
        G = "FlowOpCarousel___WRbey",
        K = "FlowOpItem___BDhQ3",
        J = r(36847),
        $ = r(95526);
      function Z() {
        var { data: e, loading: a } = (0, m.A)(() =>
          (0, t._)(function* () {
            var e = yield (0, J.n3)("VIDEO_AREA");
            return "0" !== e.resultCode ? [] : e.data;
          })()
        );
        return (0, l.jsx)(l.Fragment, {
          children:
            !a && $.A(e) && e.length
              ? (0, l.jsx)("div", {
                  className: q,
                  children: (0, l.jsx)(z.A, {
                    className: G,
                    indicatorType: "circle",
                    lazyloadCount: 1,
                    children: e.map((e, a) =>
                      (0, l.jsx)(
                        W._,
                        {
                          lazy: !1,
                          className: K,
                          onClick: () =>
                            (function (e, a) {
                              if (
                                (h.U.bpEverythingClick({
                                  busName: "通用运营位",
                                  moduleName: "权益商品推荐区",
                                  pointPosition: "影音专区-"
                                    .concat(a + 1, "-")
                                    .concat(e.rightsTitle),
                                }),
                                e.text6)
                              )
                                _.x.navToOp({ data: e });
                              else {
                                var r = {};
                                e.text1 &&
                                  (r = JSON.parse(
                                    null == e ? void 0 : e.text1
                                  )),
                                  "1100" === e.linkType
                                    ? _.x.navToPath("".concat(e.linkValue), r)
                                    : "1000" === e.linkType &&
                                      ("1" === e.text3
                                        ? _.x.navToOuter("".concat(e.linkValue))
                                        : _.x.navToHref(
                                            "".concat(e.linkValue)
                                          ));
                              }
                            })(e, a),
                          src: "".concat(gImgUrlPrefixLegacy).concat(e.icon),
                        },
                        e.configId
                      )
                    ),
                  }),
                })
              : null,
        });
      }
      r(96562);
      var X = r(38458),
        ee = "FallsItemWrap___LB82y",
        ae = "RightsCardSkeleton___SHP2H",
        re = "content___EnExA",
        te = "title___EUscJ",
        le = "subtitle___Zk4mR";
      function ie() {
        return (0, l.jsx)(l.Fragment, {
          children: Array.from(new Array(12).keys()).map((e) =>
            (0, l.jsx)(
              X.A,
              {
                animation: "breath",
                title: !1,
                paragraph: !1,
                className: ee,
                children: (0, l.jsx)("div", {
                  className: ae,
                  children: (0, l.jsxs)("div", {
                    className: re,
                    children: [
                      (0, l.jsx)(X.A.Node, { className: te }),
                      (0, l.jsx)(X.A.Node, { className: le }),
                    ],
                  }),
                }),
              },
              e
            )
          ),
        });
      }
      r(16024);
      var se = r(61322),
        ne = "tabbarPlaceholder___gRYEG",
        ce = "tabBar___J7WCy",
        oe = "tabBox___PHmaP",
        de = "rightBox___YUf3u",
        ue = "right___NrLc7",
        ge = "tab___K1yl3",
        me = "active___Dn7B8",
        he = "flowTabsPopover___iLIGn",
        ve = "ScreenBox___t8VMB",
        _e = r(66314),
        fe = r(19694),
        pe = r(35574);
      function be(e) {
        !(function () {
          var { run: e } = (0, _e.A)(
            () => {
              var e = document.documentElement,
                a = document.getElementById("tabbar-placeholder"),
                r = document.getElementById("custom-tabbar");
              fe.A(a) ||
                fe.A(e) ||
                fe.A(r) ||
                (a.getBoundingClientRect().top <= 0
                  ? (r.style.position = "fixed")
                  : (r.style.position = "relative"));
            },
            { leading: !0, trailing: !0, wait: 16 }
          );
          (0, i.useEffect)(
            () => (
              window.addEventListener("scroll", e),
              () => {
                window.removeEventListener("scroll", e);
              }
            ),
            [e]
          );
        })();
        var { currentTabIndex: a = 0, onTabChange: r } = e,
          t = (0, pe.tu)() ? N : b,
          s = (0, i.useCallback)(
            (e, a, t) => {
              r(e, a.title, t);
              var l = document.getElementById("tabbar_box"),
                i = document.getElementById(a.key);
              if (!fe.A(l) && !fe.A(i)) {
                var s =
                  i.offsetLeft -
                  l.clientWidth +
                  l.clientWidth / 2 +
                  i.clientWidth / 2;
                l.scrollTo({ left: s, behavior: "smooth" });
              }
            },
            [r]
          );
        return (0, l.jsx)("div", {
          className: ne,
          id: "tabbar-placeholder",
          children: (0, l.jsxs)("div", {
            className: ce,
            id: "custom-tabbar",
            children: [
              (0, l.jsx)("div", {
                className: (0, U.A)(oe),
                id: "tabbar_box",
                children: t.map((e, r) =>
                  (0, l.jsx)(
                    "div",
                    {
                      id: e.key,
                      className: (0, U.A)({ [me]: r === a, [ge]: !0 }),
                      onClick: () => s("navbar", e, r),
                      children: e.title,
                    },
                    e.key
                  )
                ),
              }),
              (0, l.jsx)("div", {
                className: de,
                children: (0, l.jsx)(se.A, {
                  innerPopoverClassName: he,
                  direction: "bottomRight",
                  theme: "white",
                  mode: "global",
                  clickSelfToClose: !0,
                  showMask: !0,
                  clickOtherToClose: !0,
                  touchOtherToClose: !0,
                  preventBodyClick: !0,
                  content: (0, l.jsx)("div", {
                    className: ve,
                    children: t.map((e, r) =>
                      (0, l.jsx)(
                        "div",
                        {
                          id: e.key,
                          className: (0, U.A)({ [me]: r === a, [ge]: !0 }),
                          onClick: () => s("popover", e, r),
                          children: e.title,
                        },
                        e.key
                      )
                    ),
                  }),
                  children: (0, l.jsxs)("div", {
                    id: "screen",
                    className: ue,
                    children: [(0, l.jsx)("span", {}), "筛选"],
                  }),
                }),
              }),
            ],
          }),
        });
      }
      var Ne = [
          "QY1673942858101",
          "QY1670920082470",
          "QY1673488650553",
          "QY1650614086469",
          "QY1676529973259",
        ],
        xe = [
          "QY1622613823700",
          "QY1647332740449",
          "QY1667896527855",
          "QY1667898438042",
          "QY1667898532929",
          "QY1650614086469",
          "QY1658298793746",
          "QY1622763806690",
          "QY1648520729398",
          "QY1645498970176",
        ],
        ye = [
          "QY1658298793746",
          "QY1645498970176",
          "QY1648520729398",
          "QY1650614086469",
          "QY1622613823700",
          "QY1622763806690",
        ];
      function Ae(e, a) {
        return (0, t._)(function* () {
          var r;
          if ("1099" === e) {
            var t,
              l = yield (0, g.Se)({
                showNum: "3000",
                notInBelongAreas: ["DETAILS_ORDER_VISIBLE_ONLY"],
              });
            if (!(null === (t = l.data) || void 0 === t ? void 0 : t.length))
              return [];
            var i = ["QY1611325110881"];
            return l.data
              .filter((e) => !i.includes(e.legalRightsNbr))
              .filter((e) => "1700" === e.statusCd);
          }
          if ("9999" === e) {
            var s = yield (0, g.AV)({
              belongAreas: ["1000"],
              rightsType: [
                "1000",
                "1001",
                "1002",
                "1005",
                "1006",
                "1007",
                "1012",
                "1013",
                "1014",
              ],
              page: 1,
              rows: 9999,
              notInBelongAreas: ["DETAILS_ORDER_VISIBLE_ONLY"],
              filterBigAttrFlag: !0,
            });
            return Array.isArray(s.data)
              ? (function (e) {
                  for (var a = [], r = new Map(), t = 0; t < e.length; t += 1) {
                    for (
                      var l = e[t], i = null, s = 0;
                      s < l.legalRightsAttrs.length;
                      s += 1
                    ) {
                      var n = l.legalRightsAttrs[s];
                      if ("rightsBrand" === n.attrNbr) {
                        i = null == n ? void 0 : n.attrValue;
                        break;
                      }
                    }
                    if (i)
                      if (r.has(i)) {
                        var c,
                          o,
                          d = r.get(i);
                        Number(
                          null ===
                            (c = d.legalRightsAttrs.find(
                              (e) => "vipPrice" === e.attrNbr
                            )) || void 0 === c
                            ? void 0
                            : c.attrValue
                        ) >
                          Number(
                            null ===
                              (o = l.legalRightsAttrs.find(
                                (e) => "vipPrice" === e.attrNbr
                              )) || void 0 === o
                              ? void 0
                              : o.attrValue
                          ) && r.set(i, l);
                      } else r.set(i, l);
                    else a.push(l);
                  }
                  return (
                    r.forEach((e) => {
                      a.push(e);
                    }),
                    (function (e) {
                      for (var a = 0; a < e.length - 1; a += 1)
                        for (var r = 0; r < e.length - 1 - a; r += 1)
                          if (
                            (void 0 === e[r].saleVolume &&
                              (e[r].saleVolume = 0),
                            void 0 === e[r + 1].saleVolume &&
                              (e[r + 1].saleVolume = 0),
                            e[r].saleVolume < e[r + 1].saleVolume)
                          ) {
                            var t = e[r];
                            (e[r] = e[r + 1]), (e[r + 1] = t);
                          }
                      return e;
                    })(a)
                  );
                })(
                  s.data.filter(
                    (e) =>
                      "1" === (0, v.lK)(e.legalRightsAttrs, "justForMember")
                  )
                )
              : [];
          }
          var n = yield (0, g.B_)({
            belongAreas: ["1000"],
            page: 1,
            rows: 500,
            rightsType: [e],
            notInBelongAreas: ["DETAILS_ORDER_VISIBLE_ONLY"],
          });
          if (
            "0" !== (null == n ? void 0 : n.resultCode) ||
            !(null === (r = n.data) || void 0 === r ? void 0 : r.length)
          )
            return [];
          a ? Ne.push(...ye) : Ne.push(...xe);
          var c = (function (e) {
            for (var a = [], r = new Map(), t = 0; t < e.length; t += 1) {
              for (
                var l, i = e[t], s = null, n = 0;
                n <
                (null == i || null === (l = i.legalRightsAttrs) || void 0 === l
                  ? void 0
                  : l.length);
                n += 1
              ) {
                var c;
                if (
                  "rightsBrand" ===
                  (null == i ||
                  null === (c = i.legalRightsAttrs[n]) ||
                  void 0 === c
                    ? void 0
                    : c.attrNbr)
                ) {
                  s = i.legalRightsAttrs[n].attrValue;
                  break;
                }
              }
              s ? (r.has(s) || r.set(s, []), r.get(s).push(i)) : a.push(i);
            }
            for (var [, o] of r) {
              var d = [];
              for (var u of o) {
                var g = void 0;
                for (var m of u.legalRightsAttrs)
                  if ("justForMember" === m.attrNbr) {
                    g = m.attrValue;
                    break;
                  }
                if ("0" === g) {
                  for (var h of u.legalRightsAttrs)
                    if ("price" === h.attrNbr) {
                      d.push(Number(h.attrValue));
                      break;
                    }
                } else if ("1" === g)
                  for (var v of u.legalRightsAttrs)
                    if ("vipPrice" === v.attrNbr) {
                      d.push(Number(v.attrValue));
                      break;
                    }
              }
              var _ = d.indexOf(Math.min(...d));
              a.push(o[_]);
            }
            return a;
          })(n.data.filter((e) => !Ne.includes(e.legalRightsNbr)))
            .filter((e) => !f.A(e))
            .filter((e) => !p.A(e, "certificateNum"));
          return c;
        })();
      }
      var je = s().memo(() => {
        var {
            data: e,
            loading: a,
            currentTabIndex: r,
            currentTabTitle: t,
            updateTab: g,
            currentTabKey: f,
          } = (function () {
            var e = (0, pe.nc)((e) => {
                var a;
                return !!(null === (a = e.userInfo) || void 0 === a
                  ? void 0
                  : a.isGlobalLocalPlusOrGlobalBrand);
              }),
              a = (0, pe.tu)(),
              [r, t] = (0, i.useState)(0),
              l = a ? N[r].key : b[r].key,
              s = a ? N[r].title : b[r].title,
              { data: n, loading: c } = (0, m.A)(() => Ae(l, e), {
                refreshDeps: [l, e],
              }),
              o = (0, i.useCallback)(
                (e) => {
                  r !== e && t(e);
                },
                [r]
              );
            return {
              data: n,
              loading: c,
              currentTabIndex: r,
              currentTabKey: l,
              currentTabTitle: s,
              updateTab: o,
            };
          })(),
          p = (0, i.useCallback)(
            (e) => {
              h.U.bpEverythingClick({
                busName: "通用运营位",
                moduleName: "权益商品推荐区",
                pointPosition: t,
                rightsCode: e.legalRightsNbr,
                offerId: e.offerId,
              }),
                _.x.utils.navToRightsDetailPage(e, {
                  busName: "通用运营位",
                  moduleName: "权益商品推荐区",
                  pointName: t,
                });
            },
            [t]
          ),
          x = (0, i.useCallback)(
            (e, a, r) => {
              g(r);
            },
            [g]
          ),
          y = (0, i.useMemo)(
            () =>
              a
                ? (0, l.jsx)("div", {
                    className: d,
                    children: (0, l.jsx)(ie, {}),
                  })
                : (null == e ? void 0 : e.length)
                ? (0, l.jsx)("div", {
                    className: d,
                    children: e.map((e, a) => {
                      var t = (0, v.ju)(
                        {
                          legalRightsNbr: e.legalRightsNbr,
                          legalRightsName: e.legalRightsDesc,
                          legalRightsName2: e.legalRightsName,
                          legalRightsId: e.legalRightsId,
                          legalRightsType: e.legalRightsType,
                          legalRightsAttrs: e.legalRightsAttrs,
                          exchangeNum: e.exchangeNum,
                          isHot: e.isHot,
                          isNew: e.isNew,
                          isUsual: e.isUsual,
                          shortUrl: e.shortUrl,
                          belongAreas: e.belongAreas,
                          exclusive: !0,
                          brandDTO: null == e ? void 0 : e.brandDTO,
                          certificateNum: e.certificateNum,
                          statusCd: e.statusCd,
                        },
                        "img_330_182"
                      );
                      return 9 === a && 0 === r
                        ? (0, l.jsxs)(
                            s().Fragment,
                            {
                              children: [
                                (0, l.jsx)(Z, {}),
                                (0, l.jsx)("div", {
                                  className: o,
                                  children: (0, l.jsx)(H, {
                                    data: t,
                                    onClick: p,
                                    alias:
                                      "1000" === t.belongAreas ||
                                      "1011" === t.belongAreas
                                        ? { prodName: "prodName2" }
                                        : {},
                                  }),
                                }),
                              ],
                            },
                            e.legalRightsNbr
                          )
                        : (0, l.jsx)(
                            "div",
                            {
                              className: o,
                              children: (0, l.jsx)(
                                H,
                                {
                                  currentTabKey: f,
                                  data: t,
                                  onClick: p,
                                  alias:
                                    "1000" === t.belongAreas ||
                                    "1011" === t.belongAreas
                                      ? { prodName: "prodName2" }
                                      : {},
                                },
                                e.legalRightsNbr
                              ),
                            },
                            e.legalRightsNbr
                          );
                    }),
                  })
                : null,
            [r, e, p, a, f]
          );
        return (0, l.jsxs)("div", {
          className: n,
          children: [
            (0, l.jsx)(be, { currentTabIndex: r, onTabChange: x }),
            (0, l.jsxs)("div", {
              className: c,
              id: "flow-list-wrap",
              children: [
                y,
                (0, l.jsx)("div", { className: u, children: "没有更多了" }),
              ],
            }),
          ],
        });
      });
    },
    79009(e, a, r) {
      r.d(a, { A: () => p });
      var t = r(95526),
        l = r(26995),
        i = r(58184);
      function s(e, a) {
        if ("function" != typeof e || (null != a && "function" != typeof a))
          throw new TypeError("Expected a function");
        var r = function () {
          var t = arguments,
            l = a ? a.apply(this, t) : t[0],
            i = r.cache;
          if (i.has(l)) return i.get(l);
          var s = e.apply(this, t);
          return (r.cache = i.set(l, s) || i), s;
        };
        return (r.cache = new (s.Cache || i.A)()), r;
      }
      s.Cache = i.A;
      var n = s;
      var c =
          /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        o = /\\(\\)?/g,
        d = (function (e) {
          var a = n(e, function (e) {
              return 500 === r.size && r.clear(), e;
            }),
            r = a.cache;
          return a;
        })(function (e) {
          var a = [];
          return (
            46 === e.charCodeAt(0) && a.push(""),
            e.replace(c, function (e, r, t, l) {
              a.push(t ? l.replace(o, "$1") : r || e);
            }),
            a
          );
        }),
        u = r(55842),
        g = r(22663),
        m = r(13027),
        h = u.A ? u.A.prototype : void 0,
        v = h ? h.toString : void 0;
      var _ = function e(a) {
        if ("string" == typeof a) return a;
        if ((0, t.A)(a)) return (0, g.A)(a, e) + "";
        if ((0, m.A)(a)) return v ? v.call(a) : "";
        var r = a + "";
        return "0" == r && 1 / a == -Infinity ? "-0" : r;
      };
      var f = function (e) {
        return null == e ? "" : _(e);
      };
      var p = function (e, a) {
        return (0, t.A)(e) ? e : (0, l.A)(e, a) ? [e] : d(f(e));
      };
    },
    96923(e, a, r) {
      var t = r(79009),
        l = r(61212),
        i = r(95526),
        s = r(31408),
        n = r(47227),
        c = r(31528);
      a.A = function (e, a, r) {
        for (var o = -1, d = (a = (0, t.A)(a, e)).length, u = !1; ++o < d; ) {
          var g = (0, c.A)(a[o]);
          if (!(u = null != e && r(e, g))) break;
          e = e[g];
        }
        return u || ++o != d
          ? u
          : !!(d = null == e ? 0 : e.length) &&
              (0, n.A)(d) &&
              (0, s.A)(g, d) &&
              ((0, i.A)(e) || (0, l.A)(e));
      };
    },
    26995(e, a, r) {
      var t = r(95526),
        l = r(13027),
        i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
        s = /^\w*$/;
      a.A = function (e, a) {
        if ((0, t.A)(e)) return !1;
        var r = typeof e;
        return (
          !(
            "number" != r &&
            "symbol" != r &&
            "boolean" != r &&
            null != e &&
            !(0, l.A)(e)
          ) ||
          s.test(e) ||
          !i.test(e) ||
          (null != a && e in Object(a))
        );
      };
    },
    31528(e, a, r) {
      var t = r(13027);
      a.A = function (e) {
        if ("string" == typeof e || (0, t.A)(e)) return e;
        var a = e + "";
        return "0" == a && 1 / e == -Infinity ? "-0" : a;
      };
    },
    16959(e, a, r) {
      r.d(a, { A: () => s });
      var t = Object.prototype.hasOwnProperty;
      var l = function (e, a) {
          return null != e && t.call(e, a);
        },
        i = r(96923);
      var s = function (e, a) {
        return null != e && (0, i.A)(e, a, l);
      };
    },
  },
]);
