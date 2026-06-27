"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["7843"],
  {
    66420(e, l, t) {
      t.r(l),
        t.d(l, {
          multipleCodeRightsNbr: () => i,
          telFeeRecordsIgnoreRightsType: () => r,
        });
      var i = [
          "QY1656670801142",
          "QY1709621567103",
          "QY1657789125042",
          "QY1651155514697",
          "QY1651213843552",
          "QY1651214117903",
        ],
        r = ["3000"];
    },
    73147(e, l, t) {
      t.r(l), t.d(l, { useStoreActions: () => L, useStore: () => M });
      var i = t(13454),
        r = t(20837),
        n = t(43952),
        o = t(12457),
        s = t(15189),
        a = t(66782),
        d = t(66420),
        u = t(35574),
        g = ["3000"],
        _ = [
          "halfPriceArea-Gold",
          "halfPriceArea-Plus",
          "COMMON_HALF_PRICE",
          "LIMIT_M1_BJ_WZG",
          "1000",
          "LIMIT_M1_V_FOOD_FF",
          "LIMIT_M1_V_MOVIE_FF",
          "LIMIT_M1_V_SUPERMARKET_FF",
          "LOCAL_MEM_BONUS",
          "99PLUS_DISCOUNT",
          "99PLUS2_DISCOUNT",
          "M2_VIP_DISCOUNT_PURCHASE",
          "M3_VIP_DISCOUNT_PURCHASE",
          "M4_VIP_DISCOUNT_PURCHASE",
          "M5_VIP_DISCOUNT_PURCHASE",
          "ZWRIGHTS",
          "ACT_RIGHTS_PICK",
          "ACT_RIGHTS_PICK2",
        ],
        c = ["CERTIFICATE_0"];
      function I(e, l, t) {
        return (0, i._)(function* () {
          var i,
            r = {
              filterBelongAreas: ["1000"],
              filterLegalRightsTypes: [],
              needBelongAreas: [
                "LIMIT_M2_1",
                "LIMIT_M1_2",
                "LIMIT_M1_1",
                "LIMIT_M1_ WHOLE_BASEGOLD",
                "1016",
                "1003",
                "LIMIT_M1_BJ_FD",
                "LIMIT_M1_BJ_FD_ENJOY",
                "LIMIT_M2_BJ_LL",
                "LIMIT_M1_BJ_LL_ENJOY",
                "2023",
                "2024",
                "2025",
                "2053",
                "2054",
                "2061",
                "2062",
                "2063",
                "2032",
                "LIMIT_M1_V_FOOD_RB",
                "LIMIT_M1_V_FOOD_FLOW",
                "LIMIT_M1_V_MOVIE_RB",
                "LIMIT_M1_V_MOVIE_FLOW",
                "LIMIT_M1_V_SUPERMARKET_RB",
                "LIMIT_M1_V_SUPERMARKET_FLOW",
                "LIMIT_M1_CAR_FW_1",
                "LIMIT_M1_CAR_FW_2",
                "CERTIFICATE_0",
                "LIMIT_M1_CAR_RE",
                "LIMIT_M1_JL_COLLECT",
                "99PLUS_CORE",
                "99PLUS2_CORE_YR",
                "99PLUS2_CORE_MO",
                "M2_VIP_LUCKY_BAG",
                "M3_VIP_LUCKY_BAG",
                "M4_VIP_LUCKY_BAG",
                "M5_VIP_LUCKY_BAG",
                "Rights_FKS",
                "JINGXIFUDI_FREE",
                "JINGXIFUDI_HALF_PRICE",
                "JINGXIFUDI_CONSUMER",
              ],
              memberOfferIds:
                (null === (i = u.nc.getState().userInfo) || void 0 === i
                  ? void 0
                  : i.vMemberOfferIds) || null,
              showNotExistLegalRights: 2,
            };
          t && (r.queryMonth = t);
          var n = "0";
          "9005" === l &&
            ("all" === e && (n = "0"),
            "success" === e && (n = "1000"),
            "closed" === e && (n = "1200")),
            "0" !== n && (r.statusCd = n);
          var s = { notInActIdList: [10007] };
          t && (s.queryMonth = t);
          var a,
            g,
            _,
            [c, I] = yield Promise.all([(0, o.aK)(s), (0, o.fR)(r)]),
            R = c.data || [],
            v = I.data,
            h = [];
          "0" !== n
            ? (h =
                (null == v ||
                null === (g = v.couponRecodeList) ||
                void 0 === g ||
                null ===
                  (a = g.filter(
                    (e) =>
                      !d.telFeeRecordsIgnoreRightsType.includes(
                        e.legalRightsType
                      ) ||
                      e.legalRightsName.includes("咪咕") ||
                      e.legalRightsName.includes("NBA")
                  )) ||
                void 0 === a
                  ? void 0
                  : a.filter((e) => (null == e ? void 0 : e.statusCd) === n)) ||
                [])
            : (h =
                (null == v || null === (_ = v.couponRecodeList) || void 0 === _
                  ? void 0
                  : _.filter(
                      (e) =>
                        !d.telFeeRecordsIgnoreRightsType.includes(
                          e.legalRightsType
                        ) ||
                        e.legalRightsName.includes("咪咕") ||
                        e.legalRightsName.includes("NBA")
                    )) || []);
          var f = [];
          null == h ||
            h.forEach((e, l) => {
              var t;
              (f[l] = {
                createDate: e.date || e.createDate,
                date: e.date || e.createDate,
                prizeDesc: e.legalRightsDesc,
                prizeImg: "",
                statusCd: null == e ? void 0 : e.statusCd,
                legalRightsAttrs: null == e ? void 0 : e.legalRightsAttrs,
                legalRightsType: null == e ? void 0 : e.legalRightsType,
                legalRightsNbr: null == e ? void 0 : e.legalRightsNbr,
                legalRightsName: null == e ? void 0 : e.legalRightsName,
                custOrderId: null == e ? void 0 : e.custOrderId,
                custOrderAttrs: null == e ? void 0 : e.custOrderAttrs,
                orderSource: (null == e ? void 0 : e.orderSource) || "",
                appointRenewId: (null == e ? void 0 : e.appointRenewId) || "",
                offerId: (null == e ? void 0 : e.offerId) || "",
              }),
                null == e ||
                  null === (t = e.legalRightsAttrs) ||
                  void 0 === t ||
                  t.forEach((e) => {
                    (null == e ? void 0 : e.img_211_151) &&
                      ((f[l].prizeImg = e.img_211_151),
                      (f[l].offerId = e.offerId));
                  });
            });
          var M = [];
          return (
            null == (M = "0" === n ? [...R, ...f] : f) ||
              M.forEach((e) => (e.infoTip = "receiveInfoTip")),
            M.sort(
              (e, l) =>
                Number(new Date(l.createDate)) - Number(new Date(e.createDate))
            ),
            M
          );
        })();
      }
      function R(e, l, t) {
        return (0, i._)(function* () {
          var i,
            s = {},
            u = [];
          "all" === l &&
            ("all" === e && (u = []),
            "trading" === e && (u = ["1400"]),
            "success" === e && (u = ["1000", "1300"]),
            "closed" === e && (u = ["1100", "1200"])),
            0 !== u.length && (s.statusCd = u),
            t && (s.queryMonth = t);
          var { data: _ } = yield (0, o.Z0)(s);
          if (!(null == _ ? void 0 : _.length)) return [];
          var c,
            I = [];
          0 !== (null == u ? void 0 : u.length)
            ? (I =
                (null == _ ||
                null ===
                  (c = _.filter(
                    (e) =>
                      !d.telFeeRecordsIgnoreRightsType.includes(
                        null == e ? void 0 : e.legalRightsType
                      ) ||
                      (null == e
                        ? void 0
                        : e.legalRightsName.includes("咪咕")) ||
                      (null == e ? void 0 : e.legalRightsName.includes("NBA"))
                  )) ||
                void 0 === c
                  ? void 0
                  : c.filter((e) =>
                      null == u
                        ? void 0
                        : u.includes(null == e ? void 0 : e.statusCd)
                    )) || [])
            : (I =
                (null == _
                  ? void 0
                  : _.filter(
                      (e) =>
                        !(null === d.telFeeRecordsIgnoreRightsType ||
                        void 0 === d.telFeeRecordsIgnoreRightsType
                          ? void 0
                          : d.telFeeRecordsIgnoreRightsType.includes(
                              null == e ? void 0 : e.legalRightsType
                            )) ||
                        (null == e
                          ? void 0
                          : e.legalRightsName.includes("咪咕")) ||
                        (null == e ? void 0 : e.legalRightsName.includes("NBA"))
                    )) || []);
          var R = [];
          return (
            null == I ||
              I.forEach((e, l) => {
                var t;
                (R[l] = {
                  createDate: e.date || e.createDate,
                  date: null == e ? void 0 : e.date,
                  prizeDesc: null == e ? void 0 : e.legalRightsDesc,
                  prizeImg: "",
                  statusCd: null == e ? void 0 : e.statusCd,
                  legalRightsAttrs: null == e ? void 0 : e.legalRightsAttrs,
                  legalRightsType: null == e ? void 0 : e.legalRightsType,
                  legalRightsNbr: null == e ? void 0 : e.legalRightsNbr,
                  counonInfo: null == e ? void 0 : e.counonInfo,
                  legalRightsName: null == e ? void 0 : e.legalRightsName,
                  legalRightsSubordinate:
                    null == e ? void 0 : e.legalRightsSubordinate,
                  custOrderAttrs: null == e ? void 0 : e.custOrderAttrs,
                  legalRightsDesc: null == e ? void 0 : e.legalRightsDesc,
                  custOrderId: null == e ? void 0 : e.custOrderId,
                  custOrderType: null == e ? void 0 : e.custOrderType,
                  certificateNum: null == e ? void 0 : e.certificateNum,
                  zwRightsCode: null == e ? void 0 : e.zwRightsCode,
                  orderSource: (null == e ? void 0 : e.orderSource) || "",
                  appointRenewId: (null == e ? void 0 : e.appointRenewId) || "",
                  offerId: (null == e ? void 0 : e.offerId) || "",
                }),
                  null == e ||
                    null === (t = e.legalRightsAttrs) ||
                    void 0 === t ||
                    t.forEach((e) => {
                      (null == e ? void 0 : e.img_211_151) &&
                        ((R[l].prizeImg = e.img_211_151),
                        (R[l].offerId = e.offerId));
                    });
              }),
            null == R ||
            null ===
              (i = R.filter(
                (e) =>
                  !d.telFeeRecordsIgnoreRightsType.includes(
                    null == e ? void 0 : e.legalRightsType
                  ) ||
                  (null == e ? void 0 : e.legalRightsName.includes("咪咕")) ||
                  (null == e ? void 0 : e.legalRightsName.includes("NBA"))
              )) ||
            void 0 === i
              ? void 0
              : i
                  .filter(
                    (e) => !g.includes(null == e ? void 0 : e.legalRightsType)
                  )
                  .map((e) =>
                    (0, n._)((0, r._)({}, e), {
                      legalRightsName:
                        "LifeZone" ===
                        (0, a.ul)(
                          null == e ? void 0 : e.legalRightsAttrs,
                          "belongAreas"
                        )
                          ? "".concat(
                              null == e ? void 0 : e.legalRightsName,
                              "-生活"
                            )
                          : null == e
                          ? void 0
                          : e.legalRightsName,
                    })
                  )
          );
        })();
      }
      function v(e) {
        return (0, i._)(function* () {
          var l,
            { queryMonth: t, statusCd: i } = e,
            r = {};
          t && (r.queryMonth = t), i && (r.statusCd = i);
          var n = yield (0, s.xh)(r);
          return Array.isArray(
            null === (l = n.data) || void 0 === l ? void 0 : l.couponRecodeList
          )
            ? n.data.couponRecodeList
            : [];
        })();
      }
      var h = (e, l, t) =>
          (0, i._)(function* () {
            if (!e || !l) return [];
            if ("all" === l) {
              if ("all" === e) return R(e, l, t);
              if ("trading" === e) return R(e, l, t);
              if ("success" === e) return R(e, l, t);
              if ("closed" === e) return R(e, l, t);
            }
            if ("9003" === l) {
              if ("all" === e)
                return (
                  (s = t),
                  (0, i._)(function* () {
                    try {
                      var e,
                        l,
                        t = {
                          busiNbr: "LegalRights",
                          custOrderType: "9003",
                          filterBelongAreas: c,
                        };
                      s && (t.queryMonth = s);
                      var { data: i } = yield (0, o.AQ)(t);
                      return (
                        null == i ||
                        null === (e = i.couponRecodeList) ||
                        void 0 === e
                          ? void 0
                          : e.length
                      )
                        ? null == i ||
                          null === (l = i.couponRecodeList) ||
                          void 0 === l
                          ? void 0
                          : l
                              .filter(
                                (e) =>
                                  !(null == g
                                    ? void 0
                                    : g.includes(
                                        null == e ? void 0 : e.legalRightsType
                                      ))
                              )
                              .map((e) =>
                                (0, n._)((0, r._)({}, e), {
                                  legalRightsName:
                                    "LifeZone" ===
                                    (0, a.ul)(e.legalRightsAttrs, "belongAreas")
                                      ? "".concat(
                                          null == e
                                            ? void 0
                                            : e.legalRightsName,
                                          "-生活"
                                        )
                                      : null == e
                                      ? void 0
                                      : e.legalRightsName,
                                })
                              )
                        : [];
                    } catch (e) {
                      return [];
                    }
                  })()
                );
              if ("trading" === e)
                return (function (e) {
                  return (0, i._)(function* () {
                    try {
                      var l,
                        t,
                        i = {
                          statusCd: "1400",
                          custOrderType: "9003",
                          filterBelongAreas: c,
                        };
                      e && (i.queryMonth = e);
                      var [s, d] = yield Promise.all([
                          (0, o.td)(),
                          (0, o.AQ)(i),
                        ]),
                        u = ((null == s ? void 0 : s.data) || []).map((e) =>
                          (0, n._)((0, r._)({}, e), {
                            legalRightsAttrs: e.entityAttrs,
                            statusCd: "1400",
                            date: e.createDate,
                          })
                        ),
                        _ =
                          (null === (t = d.data) ||
                          void 0 === t ||
                          null === (l = t.couponRecodeList) ||
                          void 0 === l
                            ? void 0
                            : l.filter(
                                (e) =>
                                  !g.includes(e.legalRightsType) &&
                                  "1400" === e.statusCd
                              )) || [];
                      return u
                        .concat(_)
                        .map((e) =>
                          (0, n._)((0, r._)({}, e), {
                            legalRightsName: (0, a.H)(e, ["LifeZone"])
                              ? "".concat(e.legalRightsName, "-生活")
                              : e.legalRightsName,
                          })
                        );
                    } catch (e) {
                      return [];
                    }
                  })();
                })(t);
              if ("success" === e)
                return (function (e) {
                  return (0, i._)(function* () {
                    try {
                      var l,
                        t = {
                          statusCd: "1000",
                          custOrderType: "9003",
                          filterBelongAreas: c,
                        };
                      e && (t.queryMonth = e);
                      var { data: i } = yield (0, o.AQ)(t);
                      return (null == i ? void 0 : i.couponRecodeList)
                        ? null == i ||
                          null === (l = i.couponRecodeList) ||
                          void 0 === l
                          ? void 0
                          : l
                              .filter((e) => !g.includes(e.legalRightsType))
                              .map((e) =>
                                (0, n._)((0, r._)({}, e), {
                                  legalRightsName:
                                    "LifeZone" ===
                                    (0, a.ul)(e.legalRightsAttrs, "belongAreas")
                                      ? "".concat(e.legalRightsName, "-生活")
                                      : e.legalRightsName,
                                })
                              )
                        : [];
                    } catch (e) {
                      return [];
                    }
                  })();
                })(t);
              if ("closed" === e)
                return (function (e) {
                  return (0, i._)(function* () {
                    try {
                      var l,
                        t = {
                          statusCd: "1200",
                          custOrderType: "9003",
                          filterBelongAreas: c,
                        };
                      e && (t.queryMonth = e);
                      var { data: i } = yield (0, o.AQ)(t);
                      return (null == i ? void 0 : i.couponRecodeList.length)
                        ? null == i ||
                          null === (l = i.couponRecodeList) ||
                          void 0 === l
                          ? void 0
                          : l
                              .filter((e) => !g.includes(e.legalRightsType))
                              .map((e) =>
                                (0, n._)((0, r._)({}, e), {
                                  legalRightsName:
                                    "LifeZone" ===
                                    (0, a.ul)(e.legalRightsAttrs, "belongAreas")
                                      ? "".concat(e.legalRightsName, "-生活")
                                      : e.legalRightsName,
                                })
                              )
                        : [];
                    } catch (e) {
                      return [];
                    }
                  })();
                })(t);
            }
            var s;
            if ("9004" === l) {
              if ("all" === e)
                return (function (e) {
                  return (0, i._)(function* () {
                    var l,
                      t,
                      i =
                        (null === (l = u.nc.getState().userInfo) || void 0 === l
                          ? void 0
                          : l.vMemberOfferIds) || null,
                      r = {
                        filterBelongAreas: [
                          "LIMIT_M2_1",
                          "LIMIT_M1_2",
                          "LIMIT_M1_BJ_FD",
                          "LIMIT_M1_BJ_FD_ENJOY",
                          "LIMIT_M1_BJ_LL_ENJOY",
                          "LIMIT_M2_BJ_LL",
                          "1003",
                          "1016",
                          "LIMIT_M1_ WHOLE_BASEGOLD",
                          "1009",
                        ],
                        filterLegalRightsTypes: [
                          2023, 2024, 2025, 2053, 2054, 2061, 2062, 2063, 2032,
                        ],
                        needBelongAreas: _,
                        showNotExistLegalRights: 1,
                        memberOfferIds: i,
                        filterActiveIds: [
                          "10164",
                          "10480",
                          "13241",
                          "13242",
                          "13243",
                        ],
                      };
                    e && (r.queryMonth = e);
                    var { data: n } = yield (0, o.fR)(r);
                    return (null == n ? void 0 : n.couponRecodeList.length)
                      ? null == n ||
                        null === (t = n.couponRecodeList) ||
                        void 0 === t
                        ? void 0
                        : t.filter(
                            (e) =>
                              !d.telFeeRecordsIgnoreRightsType.includes(
                                e.legalRightsType
                              ) ||
                              e.legalRightsName.includes("咪咕") ||
                              e.legalRightsName.includes("NBA")
                          )
                      : [];
                  })();
                })(t);
              if ("trading" === e) return [];
              if ("success" === e)
                return (function (e) {
                  return (0, i._)(function* () {
                    var l,
                      t,
                      i =
                        (null === (l = u.nc.getState().userInfo) || void 0 === l
                          ? void 0
                          : l.vMemberOfferIds) || null,
                      r = {
                        filterBelongAreas: [
                          "LIMIT_M2_1",
                          "LIMIT_M1_2",
                          "LIMIT_M1_BJ_FD",
                          "LIMIT_M1_BJ_FD_ENJOY",
                          "LIMIT_M1_BJ_LL_ENJOY",
                          "LIMIT_M2_BJ_LL",
                          "1003",
                          "1016",
                          "LIMIT_M1_ WHOLE_BASEGOLD",
                          "1009",
                        ],
                        filterLegalRightsTypes: [
                          2023, 2024, 2025, 2053, 2054, 2061, 2062, 2063, 2032,
                        ],
                        needBelongAreas: _,
                        showNotExistLegalRights: 1,
                        statusCd: "1000",
                        custOrderType: "9004",
                        memberOfferIds: i,
                        filterActiveIds: [
                          "10164",
                          "10480",
                          "13241",
                          "13242",
                          "13243",
                        ],
                      };
                    e && (r.queryMonth = e);
                    var { data: n } = yield (0, o.fR)(r);
                    return (null == n ? void 0 : n.couponRecodeList.length)
                      ? null == n ||
                        null === (t = n.couponRecodeList) ||
                        void 0 === t
                        ? void 0
                        : t
                            .filter(
                              (e) =>
                                !d.telFeeRecordsIgnoreRightsType.includes(
                                  e.legalRightsType
                                ) ||
                                e.legalRightsName.includes("咪咕") ||
                                e.legalRightsName.includes("NBA")
                            )
                            .filter((e) => "1000" === e.statusCd)
                      : [];
                  })();
                })(t);
              if ("closed" === e)
                return (function (e) {
                  return (0, i._)(function* () {
                    var l,
                      t,
                      i,
                      r =
                        (null === (l = u.nc.getState().userInfo) || void 0 === l
                          ? void 0
                          : l.vMemberOfferIds) || null,
                      n = {
                        filterBelongAreas: [
                          "LIMIT_M2_1",
                          "LIMIT_M1_2",
                          "LIMIT_M1_BJ_FD",
                          "LIMIT_M1_BJ_FD_ENJOY",
                          "LIMIT_M1_BJ_LL_ENJOY",
                          "LIMIT_M2_BJ_LL",
                          "1003",
                          "1016",
                          "LIMIT_M1_ WHOLE_BASEGOLD",
                          "1009",
                        ],
                        filterLegalRightsTypes: [
                          2023, 2024, 2025, 2053, 2054, 2061, 2062, 2063, 2032,
                        ],
                        needBelongAreas: _,
                        showNotExistLegalRights: 1,
                        statusCd: "1200",
                        custOrderType: "9004",
                        memberOfferIds: r,
                        filterActiveIds: [
                          "10164",
                          "10480",
                          "13241",
                          "13242",
                          "13243",
                        ],
                      };
                    e && (n.queryMonth = e);
                    var { data: s } = yield (0, o.fR)(n);
                    return (null == s ? void 0 : s.couponRecodeList.length)
                      ? null == s ||
                        null === (i = s.couponRecodeList) ||
                        void 0 === i ||
                        null ===
                          (t = i.filter(
                            (e) =>
                              !d.telFeeRecordsIgnoreRightsType.includes(
                                e.legalRightsType
                              ) ||
                              e.legalRightsName.includes("咪咕") ||
                              e.legalRightsName.includes("NBA")
                          )) ||
                        void 0 === t
                        ? void 0
                        : t.filter(
                            (e) =>
                              "1200" === e.statusCd || "1100" === e.statusCd
                          )
                      : [];
                  })();
                })(t);
            }
            if ("9005" === l) {
              if ("all" === e) return I(e, l, t);
              if ("trading" === e) return [];
              if ("success" === e) return I(e, l, t);
              if ("closed" === e) return I(e, l, t);
            }
            if ("local" === l) {
              if ("all" === e) return v({ queryMonth: t });
              if ("trading" === e) return [];
              if ("success" === e)
                return v({ queryMonth: t, statusCd: "1000" });
              if ("closed" === e) return [];
            }
            return [];
          })(),
        f = t(88799),
        M = (0, t(99751).vt)()((e, l) => ({
          orderList: [],
          orderListLoading: !0,
          currentOrderInfo: void 0,
          codeList: [],
          payDiscountModal: {
            open: !1,
            orderId: "",
            tipsText: "",
            endTime: "",
          },
          singleCodeModal: { open: !1 },
          multiCodeModal: { open: !1 },
          viewModal: { open: !1 },
          qrCodeModal: {
            open: !1,
            data: {},
            code: "",
            endTime: "",
            startTime: "",
            state: "0",
          },
          repayModal: { open: !1 },
          paymentMethodModal: { open: !1 },
          currentPaymentMethod: "WEIXIN-WAP",
          actions: {
            batchUpdate: (l) => e((e) => (0, r._)({}, e, l)),
            updateOrderList: (l, t, r) =>
              (0, i._)(function* () {
                (0, f.t)("activeTabKeys", [
                  { orderStatus: l, orderCategory: t, date: r },
                ]),
                  e(() => ({ orderListLoading: !0 }));
                var i = yield h(l, t, r);
                e(() => ({ orderListLoading: !1 })),
                  e(() => ({ orderList: i }));
              })(),
          },
        }));
      function L() {
        return M((e) => e.actions);
      }
    },
  },
]);
