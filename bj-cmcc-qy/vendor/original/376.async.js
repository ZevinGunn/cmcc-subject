"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["376"],
  {
    74219(e, t, a) {
      a.d(t, { a: () => f });
      var i = a(86070),
        n = (a(41486), "centerPopupBox___hw57w"),
        c = "centerPopup___knlrr",
        u = "centerPopupClose___J_yEn",
        l = "centerPopupTitle___T2a9K",
        s = "centerPopupCenter___BRfRJ",
        o = "centerPopupBottom___VSTok",
        r = "buttonLfet___GP9Yf",
        d = "buttonRight___aqKVt",
        v = a(62033),
        _ = a(58349);
      function f(e) {
        var {
          open: t,
          content: a,
          contentStyle: f = {},
          onClose: p = () => {},
          onCancel: S = () => {},
          onConfirm: g = () => {},
          button: R,
          onAfterClose: m = () => {},
        } = e;
        return (0, i.jsx)(v.v, {
          open: t,
          onAfterClose: m,
          children: (0, i.jsx)("div", {
            className: n,
            children: (0, i.jsxs)("div", {
              className: c,
              children: [
                (0, i.jsx)("img", {
                  className: u,
                  src: "".concat(
                    gImgUrlPrefixLegacy,
                    "/rights/202304/cdda6114-0a92-4ae9-b3be-6079a99ce232-8888.png"
                  ),
                  alt: "",
                  onClick: p,
                }),
                (0, i.jsx)("div", {
                  className: l,
                  children: "尊敬的客户您好：",
                }),
                (0, i.jsx)("div", {
                  className: s,
                  style: f,
                  children: (0, i.jsx)(_.s, { text: a }),
                }),
                (0, i.jsxs)("div", {
                  className: o,
                  children: [
                    (0, i.jsx)("div", {
                      className: r,
                      onClick: S,
                      children: "我再想想",
                    }),
                    (0, i.jsx)("div", {
                      className: d,
                      onClick: g,
                      children: R,
                    }),
                  ],
                }),
              ],
            }),
          }),
        });
      }
    },
    23871(e, t, a) {
      a.d(t, { r: () => b });
      var i = a(13454),
        n = a(86070),
        c = (a(94012), a(22810)),
        u = a(41486),
        l = a.n(u),
        s = "WxAuthModal___zuTjH",
        o = "head___u1HPz",
        r = "body___qql1h",
        d = "wx___itZE1",
        v = "Divider___UK7kZ",
        _ = "info___Gy7HI",
        f = "dot___s9Oua",
        p = "foot___hCSkC",
        S = "buttonCancel___LIAXa",
        g = "buttonConfirm___uWR8o",
        R = "InfoCard___YfULn",
        m = "InfoCardTop___pGemq",
        h = "InfoCardTopTitle___TZuB7",
        I = "avatarWrap____F8ta",
        F = "avatar____aAWK",
        A = "avatarBadge___WmYcd",
        w = "infoInner___QarMF",
        O = "nickname___vFoQN",
        C = "phone____JzK2",
        B = "InfoCardBottom___MPT5u",
        x = "buttonChange___mRtCV",
        E = a(36847),
        T = a(35574),
        y = a(62033),
        N = (e) =>
          [
            "",
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202309/fb8893e1-c278-4f03-bc26-e45db63ed0c0-eafjlkawe.png"
            ),
            "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202307/e2a1a8fd-2491-45f7-9184-695faccc20de-12321321.png"
            ),
          ][e],
        M = (e) => {
          var { open: t, onClose: a, onOk: i, onAfterClose: u = () => {} } = e,
            l = (0, T.nc)((e) => e.userInfo);
          return (0, n.jsx)(y.v, {
            open: t,
            onClose: a,
            onAfterClose: u,
            children: (0, n.jsxs)("div", {
              className: s,
              children: [
                (0, n.jsx)("div", { className: o, children: "微信授权" }),
                (0, n.jsxs)("div", {
                  className: r,
                  children: [
                    (0, n.jsxs)("div", {
                      className: d,
                      children: [
                        (0, n.jsx)("img", {
                          src: "".concat(
                            gImgUrlPrefixLegacy,
                            "/rights/202307/a9b53a9e-530d-4ec6-adee-f6115873b7f1-12321321.png"
                          ),
                          alt: "",
                        }),
                        (0, n.jsx)("span", {
                          children: "北京权益超市申请获取以下权限：",
                        }),
                      ],
                    }),
                    (0, n.jsx)(c.A, { hairline: !1, className: v }),
                    (0, n.jsxs)("div", {
                      className: _,
                      children: [
                        (0, n.jsxs)("p", {
                          children: [
                            "您的手机号：",
                            null == l ? void 0 : l.desensitizedPhoneNumber,
                          ],
                        }),
                        (0, n.jsxs)("p", {
                          children: [
                            (0, n.jsx)("span", { className: f }),
                            "获得您的公开信息(您在腾讯视频的昵称、头像)",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
                (0, n.jsxs)("div", {
                  className: p,
                  children: [
                    (0, n.jsx)("div", {
                      className: S,
                      onClick: a,
                      children: "拒绝",
                    }),
                    (0, n.jsx)("div", {
                      className: g,
                      onClick: i,
                      children: "确认授权",
                    }),
                  ],
                }),
              ],
            }),
          });
        },
        L = l().memo((e) => {
          var {
              visible: t,
              bindFlag: a,
              isAgreeAuth: i,
              avatar: c,
              nickname: u,
              style: l = {},
            } = e,
            s = (0, T.nc)((e) => e.userInfo),
            o =
              0 === a
                ? (0, n.jsx)("span", {
                    className: h,
                    children: "【您手机号当前未绑定腾讯账号】",
                  })
                : i
                ? (0, n.jsxs)(n.Fragment, {
                    children: [
                      (0, n.jsx)("span", {
                        className: h,
                        children: "【您手机当前绑定的腾讯账号】",
                      }),
                      (0, n.jsxs)("div", {
                        className: _,
                        children: [
                          (0, n.jsxs)("div", {
                            className: I,
                            children: [
                              (0, n.jsx)("img", {
                                className: F,
                                src: c,
                                alt: "",
                              }),
                              (0, n.jsx)("img", {
                                className: A,
                                src: N(a),
                                alt: "",
                              }),
                            ],
                          }),
                          (0, n.jsxs)("div", {
                            className: w,
                            children: [
                              (0, n.jsx)("span", { className: O, children: u }),
                              (0, n.jsx)("span", {
                                className: C,
                                children:
                                  null == s
                                    ? void 0
                                    : s.desensitizedPhoneNumber,
                              }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  })
                : (0, n.jsx)("span", {
                    className: h,
                    children: "【您未授权查询当前号码绑定的腾讯账号】",
                  });
          return (0, n.jsx)(n.Fragment, {
            children: t
              ? (0, n.jsxs)("div", {
                  className: R,
                  style: l,
                  children: [
                    (0, n.jsx)("div", { className: m, children: o }),
                    (0, n.jsxs)("div", {
                      className: B,
                      children: [
                        "腾讯视频权益将发放至当前号码绑定的腾讯视频账号中，如果这不是您的账号，",
                        " ",
                        (0, n.jsx)("span", {
                          className: x,
                          onClick: () => {
                            window.location.href =
                              "https://film.video.qq.com/act/phone-reward/index.html?buss_id=product.charge&buss_type=charge&ptag=bsk";
                          },
                          children: "点击去换绑",
                        }),
                        " ",
                        "，重新绑定账号后再来领取权益。",
                      ],
                    }),
                  ],
                })
              : null,
          });
        });
      (M.displayName = "WxAuthModal"), (L.displayName = "InfoCard");
      var b = {
        Modal: M,
        InfoCard: L,
        needShowWxAuthModal: (e) =>
          (0, i._)(function* () {
            var t;
            if (!e) return !1;
            var a = yield (0, E.n3)("TENCENT_VIDEO_BIND");
            return (
              !(
                "0" !== a.resultCode ||
                !(null === (t = a.data) || void 0 === t ? void 0 : t.length)
              ) &&
              a.data[0].rightsRemarks.replace(/\s/g, "").split(",").includes(e)
            );
          })(),
      };
    },
    37592(e, t, a) {
      a.d(t, { y: () => l });
      var i = a(15189),
        n = a(24495),
        c = a(73508),
        u = a(23871);
      function l(e) {
        var [t, a] = (0, n.A)({
            modalVisible: !1,
            bindFlag: 0,
            isAgreeAuth: !1,
            nickname: "",
            avatar: "",
          }),
          { data: l } = (0, c.A)(() => u.r.needShowWxAuthModal(e));
        return (
          (0, c.A)(i.gz, {
            onSuccess: (e) => {
              var { data: t } = e;
              a({
                bindFlag: (null == t ? void 0 : t.bind_flag) || 0,
                nickname: (null == t ? void 0 : t.nickname) || "",
                avatar: (null == t ? void 0 : t.avatar) || "",
              });
            },
          }),
          { wxAuth: t, needShowWxAuthModal: l, setWxAuth: a }
        );
      }
    },
    44418(e, t, a) {
      a.d(t, {
        BD: () => f,
        JD: () => m,
        VD: () => v,
        _f: () => R,
        ij: () => p,
        kn: () => _,
        lk: () => g,
        qs: () => S,
        wk: () => r,
        yI: () => h,
        zt: () => d,
      });
      var i = a(13454),
        n = a(20837),
        c = a(43952),
        u = a(81566),
        l = a(37740),
        s = a(2307),
        o = a(35574);
      function r(e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, i._)(function* () {
          var a = Object.assign({}, e, { checkSwitch: !1 }),
            i = yield s.t.getConcatenationInfo();
          return (
            i && ((a.wtAc = i.wtAc), (a.wtAcId = i.wtAcId)),
            (0, u.D8)() && (a.platform = 1),
            ("1.5" !== a.certificateNum && 1.5 !== a.certificateNum) ||
              (a.certificateNum = "1"),
            (0, l.t)({
              abilityCode: "COUPON_OPEN_TEL_FEE_AUTH",
              data: a,
              showToast: t,
            })
          );
        })();
      }
      function d(e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, i._)(function* () {
          var a = yield s.t.getConcatenationInfo();
          return (
            a && ((e.wtAc = a.wtAc), (e.wtAcId = a.wtAcId)),
            (0, u.D8)() && (e.platform = 1),
            (0, l.t)({
              abilityCode: "INNER_OPEN_TEL_FEE_AUTH",
              data: e,
              showToast: t,
            })
          );
        })();
      }
      function v(e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, i._)(function* () {
          var a = yield s.t.getConcatenationInfo();
          return (
            a && ((e.wtAc = a.wtAc), (e.wtAcId = a.wtAcId)),
            (0, u.D8)() && (e.platform = 1),
            (0, l.t)({
              abilityCode: "INNER_OPEN_MEMBER_SHIP",
              data: e,
              showToast: t,
            })
          );
        })();
      }
      function _(e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, i._)(function* () {
          var a = yield s.t.getConcatenationInfo();
          return (
            a && ((e.wtAc = a.wtAc), (e.wtAcId = a.wtAcId)),
            (0, u.D8)() && (e.platform = 1),
            (0, l.t)({
              abilityCode: "OPEN_TEL_AUTH_LIMIT_MORE",
              data: e,
              showToast: t,
            })
          );
        })();
      }
      function f(e) {
        return (0, i._)(function* () {
          var { userInfo: t } = o.nc.getState(),
            a = [];
          (null == t ? void 0 : t.isRegularGold) &&
            a.push("memberOfferIdLevel5"),
            (null == t ? void 0 : t.isBasicGold) &&
              a.push("goldMemberInfoBase");
          var i = (0, n._)(
              {
                memberIdentify: "isHaigouPlus",
                activeId: "10480",
                price: "0",
                attrNbrList: a,
              },
              e
            ),
            c = yield s.t.getConcatenationInfo();
          return (
            c && ((i.wtAc = c.wtAc), (i.wtAcId = c.wtAcId)),
            (0, u.D8)() && (i.platform = 1),
            (0, l.t)({
              abilityCode: "OPEN_TEL_AUTH_LIMIT_MORE",
              data: i,
              showToast: !0,
            })
          );
        })();
      }
      function p(e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, i._)(function* () {
          var a = yield s.t.getConcatenationInfo();
          return (
            a && ((e.wtAc = a.wtAc), (e.wtAcId = a.wtAcId)),
            (0, u.D8)() && (e.platform = 1),
            (0, l.t)({
              abilityCode: "OPEN_TEL_HALF_PRICE",
              data: e,
              showToast: t,
            })
          );
        })();
      }
      function S(e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, i._)(function* () {
          var a = yield s.t.getConcatenationInfo();
          return (
            a && ((e.wtAc = a.wtAc), (e.wtAcId = a.wtAcId)),
            (0, u.D8)() && (e.platform = 1),
            (0, l.t)({
              abilityCode: "OPEN_TEL_HALF_PRICE",
              data: (0, c._)((0, n._)({}, e), { activeId: "10163" }),
              showToast: t,
            })
          );
        })();
      }
      function g(e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, i._)(function* () {
          var a = yield s.t.getConcatenationInfo();
          return (
            a && ((e.wtAc = a.wtAc), (e.wtAcId = a.wtAcId)),
            (0, u.D8)() && (e.platform = 1),
            (0, l.t)({ abilityCode: "5G_GOLD_RECEIVE", data: e, showToast: t })
          );
        })();
      }
      function R() {
        return (0, i._)(function* () {
          var e = {},
            t = yield s.t.getConcatenationInfo();
          return (
            t && ((e.wtAc = t.wtAc), (e.wtAcId = t.wtAcId)),
            (0, u.D8)() && (e.platform = 1),
            (0, l.t)({
              abilityCode: "RIGHTS_SUBMIT_SHOPPING_CAR",
              data: {},
              showToast: !0,
            })
          );
        })();
      }
      function m(e) {
        var t =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, i._)(function* () {
          var a = yield s.t.getConcatenationInfo();
          return (
            a && ((e.wtAc = a.wtAc), (e.wtAcId = a.wtAcId)),
            (0, l.t)({
              abilityCode: "OPEN_TEL_AUTH_LIMIT",
              data: e,
              showToast: t,
            })
          );
        })();
      }
      function h(e) {
        return (0, i._)(function* () {
          return (0,
          l.t)({ abilityCode: "activityPlus", data: (0, n._)({ offerId: e.offerId }, e.id && { id: e.id }, e.conId && { conId: e.conId }), showToast: !0 });
        })();
      }
    },
    99545(e, t, a) {
      a.d(t, { $i: () => _, Mb: () => r, qc: () => v });
      var i = a(13454),
        n = a(41486),
        c = a.n(n),
        u = a(84851),
        l = a(35574),
        s = a(99751),
        o = a(65059);
      var r = (0, s.vt)()(
          (0, o.lt)(
            (e, t) => ({
              plusFiveOffReceiveStatus: null,
              updatePlusFiveOffReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.Od)();
                  e(() => ({ plusFiveOffReceiveStatus: t }));
                })(),
              hasReceivedCommunication: null,
              plusCommunicationStatus: null,
              updateCommunicationReceiveState: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.$6)();
                  e(() => ({
                    hasReceivedCommunication:
                      0 === (null == t ? void 0 : t.canUse),
                    plusCommunicationStatus: t,
                  }));
                })(),
              platinumLiteRightsBagReceiveStatus: null,
              platinumLiteFlowBagReceiveStatus: null,
              platinumLiteFiveOffReceiveStatus: null,
              updatePlatinumLiteRightsBagReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.SC)();
                  e(() => ({ platinumLiteRightsBagReceiveStatus: t }));
                })(),
              updatePlatinumLiteFlowBagReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.Hh)();
                  e(() => ({ platinumLiteFlowBagReceiveStatus: t }));
                })(),
              updatePlatinumLiteFiveOffReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.WT)();
                  e(() => ({ platinumLiteFiveOffReceiveStatus: t }));
                })(),
              platinumRightsBagReceiveStatus: null,
              platinumFlowBagReceiveStatus: null,
              platinumFiveOffReceiveStatus: null,
              updatePlatinumRightsBagReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.Ij)();
                  e(() => ({ platinumRightsBagReceiveStatus: t }));
                })(),
              updatePlatinumFlowBagReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.xu)();
                  e(() => ({ platinumFlowBagReceiveStatus: t }));
                })(),
              updatePlatinumFiveOffReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.y7)();
                  e(() => ({ platinumFiveOffReceiveStatus: t }));
                })(),
              goldRightsBagReceiveStatus: null,
              goldFlowBagReceiveStatus: null,
              goldFiveOffReceiveStatus: null,
              goldCommunicationStatus: null,
              updateGoldRightsBagReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.Ey)();
                  e(() => ({ goldRightsBagReceiveStatus: t }));
                })(),
              updateGoldFlowBagReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.hT)();
                  e(() => ({ goldFlowBagReceiveStatus: t }));
                })(),
              updateGoldFiveOffReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.Mp)();
                  e(() => ({ goldFiveOffReceiveStatus: t }));
                })(),
              updateGoldCommunicationStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.dO)();
                  e(() => ({ goldCommunicationStatus: t }));
                })(),
              vFoodRightsBagReceiveStatus: null,
              vFoodFlowBagReceiveStatus: null,
              vFoodFiveOffReceiveStatus: null,
              vSupermarketRightsBagReceiveStatus: null,
              vSupermarketFlowBagReceiveStatus: null,
              vSupermarketFiveOffReceiveStatus: null,
              vMovieRightsBagReceiveStatus: null,
              vMovieFlowBagReceiveStatus: null,
              vMovieFiveOffReceiveStatus: null,
              updateVRightsStatus: (a, n, c) =>
                (0, i._)(function* () {
                  var s = (function (e, t) {
                      var a,
                        i,
                        n,
                        c =
                          null === (a = l.nc.getState().userInfo) ||
                          void 0 === a
                            ? void 0
                            : a.vFoodOfferId,
                        s =
                          null === (i = l.nc.getState().userInfo) ||
                          void 0 === i
                            ? void 0
                            : i.vSupermarketOfferId,
                        o =
                          null === (n = l.nc.getState().userInfo) ||
                          void 0 === n
                            ? void 0
                            : n.vMovieOfferId;
                      return {
                        V_FOOD: {
                          RIGHTS_BAG: () => (0, u.Bt)("LIMIT_M1_V_FOOD_RB", c),
                          FLOW_BAG: () => (0, u.Bt)("LIMIT_M1_V_FOOD_FLOW", c),
                          FIVE_OFF: () => (0, u.Bt)("LIMIT_M1_V_FOOD_FF", c),
                        },
                        V_SUPERMARKET: {
                          RIGHTS_BAG: () =>
                            (0, u.Bt)("LIMIT_M1_V_SUPERMARKET_RB", s),
                          FLOW_BAG: () =>
                            (0, u.Bt)("LIMIT_M1_V_SUPERMARKET_FLOW", s),
                          FIVE_OFF: () =>
                            (0, u.Bt)("LIMIT_M1_V_SUPERMARKET_FF", s),
                        },
                        V_MOVIE: {
                          RIGHTS_BAG: () => (0, u.Bt)("LIMIT_M1_V_MOVIE_RB", o),
                          FLOW_BAG: () => (0, u.Bt)("LIMIT_M1_V_MOVIE_FLOW", o),
                          FIVE_OFF: () => (0, u.Bt)("LIMIT_M1_V_MOVIE_FF", o),
                        },
                      }[e][t];
                    })(a, n),
                    o = (function (e, t) {
                      return {
                        V_FOOD: {
                          RIGHTS_BAG: "vFoodRightsBagReceiveStatus",
                          FLOW_BAG: "vFoodFlowBagReceiveStatus",
                          FIVE_OFF: "vFoodFiveOffReceiveStatus",
                        },
                        V_SUPERMARKET: {
                          RIGHTS_BAG: "vSupermarketRightsBagReceiveStatus",
                          FLOW_BAG: "vSupermarketFlowBagReceiveStatus",
                          FIVE_OFF: "vSupermarketFiveOffReceiveStatus",
                        },
                        V_MOVIE: {
                          RIGHTS_BAG: "vMovieRightsBagReceiveStatus",
                          FLOW_BAG: "vMovieFlowBagReceiveStatus",
                          FIVE_OFF: "vMovieFiveOffReceiveStatus",
                        },
                      }[e][t];
                    })(a, n);
                  if (c) {
                    var r,
                      d = {
                        total: 1,
                        used: 1,
                        canUse: 0,
                        list:
                          (null === (r = t()[o]) || void 0 === r
                            ? void 0
                            : r.list) || [],
                      };
                    e(() => ({ [o]: d }));
                  } else
                    (0, i._)(function* () {
                      var t = yield s();
                      e(() => ({ [o]: t }));
                    })();
                })(),
              carOwnerRightsBagStatus: null,
              carOwnerFringeBagStatus: null,
              carRentalVoucherBagStatus: null,
              carOwnerHpReceiveStatus: null,
              updateCarOwnerRightsBagStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.lb)();
                  e(() => ({ carOwnerRightsBagStatus: t }));
                })(),
              updateCarOwnerFringeBagStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.f6)();
                  e(() => ({ carOwnerFringeBagStatus: t }));
                })(),
              updateCarRentalVoucherBagStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.h1)();
                  e(() => ({ carRentalVoucherBagStatus: t }));
                })(),
              updateCarOwnerHpReceiveStatus: () =>
                (0, i._)(function* () {
                  var t = yield (0, u.qO)();
                  e(() => ({ carOwnerHpReceiveStatus: t }));
                })(),
              excl10000HpReceiveStatus: null,
              excl10001HpReceiveStatus: null,
              excl10002HpReceiveStatus: null,
              excl10003HpReceiveStatus: null,
              updateExclHpReceiveStatus: (t) =>
                (0, i._)(function* () {
                  var a = yield (0, u.zW)(t),
                    i = {
                      1e4: "excl10000HpReceiveStatus",
                      10001: "excl10001HpReceiveStatus",
                      10002: "excl10002HpReceiveStatus",
                      10003: "excl10003HpReceiveStatus",
                    };
                  e(() => ({ [i[t]]: a }));
                })(),
            }),
            { name: "RM_STATUS" }
          )
        ),
        d = {
          1: {
            statusSelector: (e) => e.plusFiveOffReceiveStatus,
            updateAction: (e) => e.updatePlusFiveOffReceiveStatus,
          },
          5: {
            statusSelector: (e) => e.platinumFiveOffReceiveStatus,
            updateAction: (e) => e.updatePlatinumFiveOffReceiveStatus,
          },
          6: {
            statusSelector: (e) => e.goldFiveOffReceiveStatus,
            updateAction: (e) => e.updateGoldFiveOffReceiveStatus,
          },
          18: {
            statusSelector: (e) => e.platinumLiteFiveOffReceiveStatus,
            updateAction: (e) => e.updatePlatinumLiteFiveOffReceiveStatus,
          },
          15: {
            statusSelector: (e) => e.carOwnerHpReceiveStatus,
            updateAction: (e) => e.updateCarOwnerHpReceiveStatus,
          },
          1e4: {
            statusSelector: (e) => e.excl10000HpReceiveStatus,
            updateAction: (e) => () => e.updateExclHpReceiveStatus(1e4),
          },
          10001: {
            statusSelector: (e) => e.excl10001HpReceiveStatus,
            updateAction: (e) => () => e.updateExclHpReceiveStatus(10001),
          },
          10002: {
            statusSelector: (e) => e.excl10002HpReceiveStatus,
            updateAction: (e) => () => e.updateExclHpReceiveStatus(10002),
          },
          10003: {
            statusSelector: (e) => e.excl10003HpReceiveStatus,
            updateAction: (e) => () => e.updateExclHpReceiveStatus(10003),
          },
        };
      function v(e) {
        var t,
          a,
          i =
            e &&
            (null === (t = d[e]) || void 0 === t ? void 0 : t.statusSelector),
          n =
            e &&
            (null === (a = d[e]) || void 0 === a ? void 0 : a.updateAction),
          u = r(i || (() => null)),
          l = c().useCallback(() => {
            if (n) {
              var e = n(r.getState());
              e && e();
            }
          }, [n]);
        return (
          c().useEffect(() => {
            l();
          }, [l]),
          { status: u, update: l }
        );
      }
      function _() {
        var e = r((e) => e.goldCommunicationStatus),
          t = r((e) => e.updateGoldCommunicationStatus);
        return (
          c().useEffect(() => {
            t();
          }, [t]),
          { goldCommunicationStatus: e, updateGoldCommunicationStatus: t }
        );
      }
    },
  },
]);
