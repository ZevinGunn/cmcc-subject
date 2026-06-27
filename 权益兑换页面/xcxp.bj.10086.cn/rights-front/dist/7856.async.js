"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["7856"],
  {
    4600(e, t, r) {
      r.r(t), r.d(t, { member99PlusConfigList: () => n, moduleIds: () => a });
      var n = [
          {
            bannerBg: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202603/36874d34-51f4-4b77-a2bf-931e70122532-f2.png"
            ),
            offerOrderBtn: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/e218c62c-dd2a-4c75-80ca-fc5279b0335b-07.png"
            ),
            offerName: "99Plus-畅享版（新）",
            offerId: "111004275825",
            offerRulesText: "",
          },
          {
            bannerBg: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202603/3829aea9-0004-4a26-b781-effa7fb24daa-f1.png"
            ),
            offerOrderBtn: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/de170fd0-fbe1-4e8c-9702-fb142b50fbea-zxh.png"
            ),
            offerName: "99Plus-优享版（新）",
            offerId: "111004275824",
            offerRulesText: "",
          },
          {
            bannerBg: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202603/ec20cfcf-5abe-47b1-9a1e-218b18c4bb2e-f3.png"
            ),
            offerOrderBtn: "".concat(
              gImgUrlPrefixLegacy,
              "/rights/202505/ab5ac777-4610-4e90-a4c1-9945d6a85721-agkal.png"
            ),
            offerName: "99Plus-尊享版（新）",
            offerId: "111004275823",
            offerRulesText: "",
          },
        ],
        a = {
          banner: "module-banner",
          categories: "module-categories",
          stickyCategories: "module-categories-sticky",
          comm: "module-comm",
          core: "module-core",
          exclusive: "module-exclusive",
          discount: "module-discount",
        };
    },
    62144(e, t, r) {
      r.r(t), r.d(t, { useMemberIndex: () => i });
      var n = r(55370),
        a = r(35574);
      function i() {
        var e = (0, n.a)(),
          t = (0, a.nc)((e) => {
            var t;
            return (
              (null === (t = e.userInfo) || void 0 === t
                ? void 0
                : t.starValue) || 0
            );
          });
        return (0, a.nc)((e) => {
          var t;
          return null === (t = e.userInfo) || void 0 === t
            ? void 0
            : t.isThreePointFiveStar;
        })
          ? 1
          : 0 === e
          ? t < 4
            ? 0
            : t <= 5
            ? 1
            : 2
          : e - 1;
      }
    },
    55370(e, t, r) {
      r.d(t, { a: () => a });
      var n = r(35574);
      function a() {
        return (0, n.nc)((e) => {
          var t;
          return (
            (null === (t = e.userInfo) || void 0 === t
              ? void 0
              : t.member99Plus2Level) || 0
          );
        });
      }
    },
    86503(e, t, r) {
      r.d(t, {
        HF: () => h,
        Px: () => _,
        an: () => v,
        dT: () => d,
        fW: () => f,
        gu: () => p,
        mf: () => m,
        uM: () => g,
      });
      var n = r(13454),
        a = r(20837),
        i = r(81566),
        o = r(6655),
        u = r(78337),
        l = r(2307),
        s = r(52180);
      function c(e) {
        return (0, n._)(function* () {
          var t;
          return (
            (null ===
              (t = (yield (0, u.t)({
                abilityCode: "rights_qry_new99plus",
                data: { belongAreas: [e] },
              })).data) || void 0 === t
              ? void 0
              : t.map((e) => (0, o.F)(e))) || []
          );
        })();
      }
      function d() {
        return (0, n._)(function* () {
          var [e, t, r] = yield Promise.all([
              c("99PLUS2_CORE_MO"),
              c("99PLUS2_CORE_YR"),
              (0, n._)(function* () {
                return (
                  (yield (0, u.t)({
                    abilityCode: "PLUS99_CLAIM_METHOD_QUERY",
                    data: {},
                  })).data || "none"
                );
              })(),
            ]),
            a = e.some((e) => e.groupOrderTimes && e.groupOrderTimes > 0)
              ? 0
              : 1,
            i = t.some((e) => e.groupOrderTimes && e.groupOrderTimes > 0)
              ? 0
              : 1,
            o = !1;
          return (
            "yearly" === r ? (o = 0 === i) : "monthly" === r && (o = 0 === a),
            {
              hasClaimed: o,
              claimMethod: r,
              monthlyRights: { canUse: a, list: e },
              yearlyRights: { canUse: i, list: t },
            }
          );
        })();
      }
      function f() {
        return (0, n._)(function* () {
          var e;
          return (
            (null ===
              (e = (yield (0, u.t)({
                abilityCode: "PLUS99_AREA_RIGHTS_QRY",
                data: {
                  notInBelongAreas: [],
                  belongAreas: ["99PLUS2_DISCOUNT"],
                },
              })).data) || void 0 === e
              ? void 0
              : e.map((e) => (0, o.F)(e))) || []
          );
        })();
      }
      function m() {
        return (0, n._)(function* () {
          var e = yield (0, u.t)({
            abilityCode: "PLUS99_SPEC_AREA_QRY",
            data: { operateCode: "99PLUS2_EXCL", memberType: "99PLUS_NEW" },
          });
          return (
            Array.isArray(e.data) &&
              (e.data = e.data.map((e) =>
                (0, a._)({}, e, (0, s.getExclusiveRightsName)(e))
              )),
            e.data
          );
        })();
      }
      function g() {
        return (0, n._)(function* () {
          return (0,
          u.t)({ abilityCode: "NINETY_NINE_PLUS_GET_INFO", data: { activeId: 10008 } });
        })();
      }
      function p(e) {
        return (0, n._)(function* () {
          return (0, u.t)({ abilityCode: "RIGHTS_DETAIL_QRY_H5", data: e });
        })();
      }
      function v() {
        return (0, n._)(function* () {
          var e = yield c("99PLUS2_COMM");
          if (2 !== e.length) return { hasClaimed: !1, list: [] };
          var t = e.find(
              (e) =>
                "111602054897" === e._feAttrOfferId ||
                "111602056029" === e._feAttrOfferId ||
                "111602056803" === e._feAttrOfferId
            ),
            r = e.find((e) => "111602054898" === e._feAttrOfferId);
          if (!t || !r) return { hasClaimed: !1, list: [] };
          var n = [t, r];
          return {
            hasClaimed: n.some(
              (e) => e.groupOrderTimes && e.groupOrderTimes > 0
            ),
            list: n,
          };
        })();
      }
      function h(e) {
        return (0, n._)(function* () {
          var t = yield l.t.getConcatenationInfo();
          return (
            t && ((e.wtAc = t.wtAc), (e.wtAcId = t.wtAcId)),
            (0, i.D8)() && (e.platform = 1),
            (0, u.t)({
              abilityCode: "open_rights_new99plus",
              data: e,
              showToast: !0,
            })
          );
        })();
      }
      function _(e) {
        return (0, n._)(function* () {
          var t = yield l.t.getConcatenationInfo();
          return (
            t && ((e.wtAc = t.wtAc), (e.wtAcId = t.wtAcId)),
            (0, i.D8)() && (e.platform = 1),
            (0, u.t)({
              abilityCode: "PLUS99_CARD_ACT_OPEN",
              data: e,
              showToast: !0,
            })
          );
        })();
      }
    },
    50067(e, t, r) {
      r.r(t),
        r.d(t, {
          useStoreActions: () => R,
          useInitMembershipCardData: () => T,
          useOpenOfferOrderConfirmModal: () => O,
          useInitIndexCardData: () => I,
          useStore: () => b,
          useInitializeStore: () => L,
        });
      var n = r(13454),
        a = r(50654),
        i = r(41486),
        o = r(36847),
        u = r(86503),
        l = r(20837),
        s = r(43952),
        c = r(73508),
        d = r(62144),
        f = r(4600),
        m = "99PLUS2_ORDER_DESC",
        g = "99PLUS2_RULES",
        p = "99PLUS2_APP_RIGHTS";
      var v = r(88229),
        h = r(99751),
        _ = r(65059),
        A = r(35574),
        C = r(33843),
        y = r(59344),
        b = (0, h.vt)()(
          (0, _.Zr)(
            (e, t) => ({
              memberConfig: null,
              actRules: null,
              offerOrderConfirmModalVisible: !1,
              discountInfo: {
                state: null,
                discountCode: null,
                effectiveTime: null,
                expiredTime: null,
              },
              coreRights: null,
              discountRightsList: null,
              exclusiveRightsList: null,
              isAgreement: !1,
              shakeAgreement: !1,
              currentSelectedCoupon: null,
              cmccAppRights: null,
              commRights: null,
              commOrderConfirmModal: { open: !1, data: null },
              actions: {
                updateMemberConfig: (t) => {
                  e(() => ({ memberConfig: t }));
                },
                updateActRules: () =>
                  (0, n._)(function* () {
                    var t = yield (0, o.n3)(g);
                    Array.isArray(t.data) &&
                      t.data.length > 0 &&
                      e(() => ({ actRules: t.data }));
                  })(),
                updateOfferOrderConfirmModalVisible: (t) => {
                  e(() => ({ offerOrderConfirmModalVisible: t }));
                },
                updateDiscountInfo: () =>
                  (0, n._)(function* () {
                    var t = yield (0, u.uM)();
                    if ("您不是本网用户,暂不能办理此业务!" === t.resultMsg) {
                      var r = {
                        state: 0,
                        discountCode: null,
                        effectiveTime: null,
                        expiredTime: null,
                      };
                      return e(() => ({ discountInfo: r })), null;
                    }
                    if ("0" !== t.resultCode) return null;
                    if (!t.data) return null;
                    var n = {
                      state: t.data.state,
                      discountCode: t.data.discountCode || null,
                      effectiveTime: t.data.effectiveTime || null,
                      expiredTime: t.data.expiredTime || null,
                    };
                    return e(() => ({ discountInfo: n })), !0;
                  })(),
                updateCoreRights: () =>
                  (0, n._)(function* () {
                    var t = yield (0, u.dT)();
                    e(() => ({ coreRights: t }));
                  })(),
                updateDiscountRightsList: () =>
                  (0, n._)(function* () {
                    var t = yield (0, u.fW)();
                    e(() => ({ discountRightsList: t }));
                  })(),
                updateExclusiveRightsList: () =>
                  (0, n._)(function* () {
                    var t = yield (0, u.mf)();
                    e(() => ({ exclusiveRightsList: t }));
                  })(),
                updateIsAgreement: (t) => {
                  e(() => ({ isAgreement: t }));
                },
                updateShakeAgreement: (t) => {
                  e(() => ({ shakeAgreement: t }));
                },
                updateCurrentSelectedCoupon: (t) => {
                  e(() => ({ currentSelectedCoupon: t }));
                },
                updateCmccAppRights: () =>
                  (0, n._)(function* () {
                    var t = yield (0, o.n3)(p);
                    if (Array.isArray(t.data) && t.data[0]) {
                      var r = {
                        card: t.data[0].icon,
                        buttonList: t.data.slice(1),
                      };
                      e(() => ({ cmccAppRights: r }));
                    }
                  })(),
                updateCommRights: () =>
                  (0, n._)(function* () {
                    var t = yield (0, u.an)();
                    e(() => ({ commRights: t }));
                  })(),
                updateCommOrderConfirmModal: (t) => {
                  e(() => ({ commOrderConfirmModal: t }));
                },
              },
            }),
            {
              name: "99PLUS2_STORE_STORAGE",
              storage: (0, _.KU)(() => localStorage),
              partialize: (e) => {
                var { actions: t } = e;
                return (0, a._)(e, ["actions"]);
              },
            }
          )
        );
      function R() {
        return b((e) => e.actions);
      }
      function I() {
        var e = R();
        (0, i.useEffect)(() => {
          e.updateCoreRights();
        }, [e]);
      }
      function T() {
        var e = R();
        (0, i.useEffect)(() => {
          e.updateCoreRights(),
            e.updateExclusiveRightsList(),
            e.updateCommRights();
        }, [e]);
      }
      function L() {
        var e = (function () {
            var e = (0, d.useMemberIndex)(),
              { data: t } = (0, c.A)(() =>
                (0, n._)(function* () {
                  var e = yield (0, o.n3)(m);
                  return Array.isArray(e.data) && e.data.length > 0
                    ? e.data
                    : null;
                })()
              );
            return (0, i.useMemo)(() => {
              var r,
                n = f.member99PlusConfigList[e],
                a =
                  (null == t || null === (r = t[e]) || void 0 === r
                    ? void 0
                    : r.rightsRemarks) || "";
              return (0, s._)((0, l._)({}, n), { offerRulesText: a });
            }, [e, t]);
          })(),
          t = R();
        (0, i.useEffect)(() => {
          e && t.updateMemberConfig(e);
        }, [t, e]),
          (0, i.useEffect)(() => {
            t.updateActRules(),
              t.updateCoreRights(),
              t.updateExclusiveRightsList(),
              t.updateCmccAppRights(),
              t.updateCommRights();
          }, [t]);
      }
      function O() {
        var e = b((e) => e.isAgreement),
          t = R(),
          r = (0, A.nc)((e) => {
            var t;
            return null === (t = e.userInfo) || void 0 === t
              ? void 0
              : t.isLocalUser;
          });
        return {
          openOfferOrderConfirmModal: (0, i.useCallback)(
            (a) =>
              (0, n._)(function* () {
                if (r) {
                  var n = Object.assign(
                    {},
                    { scrollToAgreement: !1, sleepDuration: 1e3 },
                    a
                  );
                  e
                    ? t.updateOfferOrderConfirmModalVisible(!0)
                    : n.scrollToAgreement
                    ? (window.scrollTo({ top: 0, behavior: "smooth" }),
                      yield (0, v.y)(n.sleepDuration),
                      y.Z.info({
                        content: "请先阅读活动规则并同意",
                        colorInvert: !0,
                      }),
                      t.updateShakeAgreement(!0),
                      setTimeout(() => {
                        t.updateShakeAgreement(!1);
                      }, 600))
                    : (t.updateShakeAgreement(!0),
                      setTimeout(() => {
                        t.updateShakeAgreement(!1);
                      }, 600),
                      y.Z.info({
                        content: "请先阅读活动规则并同意",
                        colorInvert: !0,
                      }));
                } else C.R.openDiffNetNoticeModal();
              })(),
            [t, e, r]
          ),
        };
      }
    },
    52180(e, t, r) {
      r.r(t),
        r.d(t, {
          getExclusiveRightsName: () => l,
          isSlotIndex: () => u,
          navToPhoneCouponUsePage: () => s,
          scrollToModule: () => c,
        });
      var n = r(81566),
        a = r(64308),
        i = r(20696),
        o = r(4600);
      function u(e) {
        return [0, 1, 2].includes(e);
      }
      function l(e) {
        try {
          var t = e.discountName.split("_");
          return { name: t[0], subName: t[1] };
        } catch (e) {
          return { name: "", subName: "" };
        }
      }
      function s() {
        (0, n.D8)()
          ? i.x.navToHref("https://touch.10086.cn/i/mobile/mycoupons.html")
          : (0, n.Q0)()
          ? i.x.navToHref(
              "https://h.app.coc.10086.cn/activity/transit/transferDownload.html?targetURL=https%3A%2F%2Ftouch.10086.cn%2Fi%2Fmobile%2Fmycoupons.html%3Fc%3D11%26e%3D99&pageId=10022120716544486&sellerId=1510034HD1701300016"
            )
          : i.x.navToHref(
              "https://h.app.coc.10086.cn/activity/transit/transferDownload.html?targetURL=https%3A%2F%2Ftouch.10086.cn%2Fi%2Fmobile%2Fmycoupons.html%3Fc%3D11%26e%3D99&pageId=10022120716544486&sellerId=1510034HD1701300017"
            );
      }
      function c(e) {
        var t = 89,
          r = document.querySelector("#".concat(o.moduleIds.stickyCategories));
        r && (t = r.clientHeight + 8), (0, a.PA)("#".concat(e), -t);
      }
    },
    6655(e, t, r) {
      r.d(t, { F: () => i });
      var n = r(20837);
      function a(e) {
        return e
          ? e
              .replace(/(\d+)_(\d+)/g, "$1x$2")
              .split("_")
              .filter(Boolean)
              .map((e) => e[0].toUpperCase() + e.slice(1))
              .join("")
          : "";
      }
      function i(e) {
        if (!e || "object" != typeof e || Array.isArray(e)) return e;
        var t = (0, n._)({}, e),
          r = ["belongAreas"].map((e) => "_feAttr".concat(a(e)));
        return (
          ["legalRightsAttrs", "entityAttrs", "attrs"].forEach((n) => {
            var i = e[n];
            Array.isArray(i) &&
              i.forEach((e) => {
                var n, i;
                if ("attrNbr" in e && "attrValue" in e)
                  ({ attrNbr: n, attrValue: i } = e);
                else {
                  var o = Object.keys(e);
                  if (1 !== o.length) return;
                  ([n] = o), (i = e[n]);
                }
                if (n && void 0 !== i) {
                  var u = "_feAttr".concat(a(n));
                  void 0 === t[u]
                    ? (t[u] = r.includes(u) ? [i] : i)
                    : Array.isArray(t[u])
                    ? t[u].push(i)
                    : (t[u] = [t[u], i]);
                }
              });
          }),
          t
        );
      }
    },
  },
]);
