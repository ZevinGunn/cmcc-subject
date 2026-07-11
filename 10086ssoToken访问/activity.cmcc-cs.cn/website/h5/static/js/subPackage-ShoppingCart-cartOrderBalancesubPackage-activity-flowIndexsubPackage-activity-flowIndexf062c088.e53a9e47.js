(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [
    "subPackage-ShoppingCart-cartOrderBalance~subPackage-activity-flowIndex~subPackage-activity-flowIndex~f062c088",
  ],
  {
    "4ae5": function (e, r, t) {
      "use strict";
      var n = t("4ea4");
      Object.defineProperty(r, "__esModule", { value: !0 }),
        (r.queryFollowShopList =
          r.queryGovEntAppointOrder =
          r.getStoreDetail =
          r.getStoreList =
          r.checkAgreement =
          r.waterFallInfo =
          r.queryMainPackageRecommends =
          r.getHallStoreCardDataV2 =
          r.storeFollow =
          r.getOperInfo =
          r.receiveCoupon =
          r.queryCardSortShow =
          r.eSimAppoint =
          r.couponCollection =
          r.queryMergeLinkProductList =
          r.nationalSubsidyUnBind =
          r.getSubsidyQualificationCode =
          r.getNearStoreRooms =
          r.getHallStoreListItem =
          r.getHallStoreList =
          r.getHallStoreShopData =
          r.getHallStoreCardData =
          r.getShopTypeByPageId =
          r.queryBrandList =
          r.getAgentIdByPhone =
          r.queryNavagationIOP =
          r.registerOrInvite =
          r.getSecondPosterImg =
          r.getEWMImg =
          r.customerCheck =
          r.getShoperRefer =
          r.cancelRefer =
          r.addRefer =
          r.getResultInfo =
          r.getDetailByMergeCode =
          r.getPageData =
          r.getShopPageData =
          r.getPageidByProvinceCode =
          r.getShopPageIdByProvince =
          r.getPageListData =
          r.getCategoryData =
          r.shopSearchData =
          r.updataShopInfo =
          r.productNameByWord =
          r.getMerchantConfig =
            void 0),
        t("96cf");
      var a = n(t("1da1")),
        u = n(t("b775")),
        o = n(t("b893")),
        i = function (e) {
          return (0, u.default)({
            method: "POST",
            data: e,
            url: "/nrapigate/nrshop/atom/merchant/config",
          });
        };
      r.getMerchantConfig = i;
      var c = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrshop/atom/shop/productNameByWord",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.productNameByWord = c;
      var p = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            var t;
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return (
                      (e.next = 2),
                      (0, u.default)({
                        method: "POST",
                        isToast: !1,
                        url: "/nrapigate/nrmix/shop/page/updateShopName",
                        data: r,
                      })
                    );
                  case 2:
                    return (t = e.sent), e.abrupt("return", t);
                  case 4:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.updataShopInfo = p;
      var l = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrshop/atom/shop/searchProductFromShop",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.shopSearchData = l;
      var d = function (e) {
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrshop/atom/shop/productTypeList",
        });
      };
      r.getCategoryData = d;
      var s = function (e) {
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrshop/atom/shop/productListByType",
        });
      };
      r.getPageListData = s;
      var f = function (e) {
        return (0, u.default)({
          method: "POST",
          url: "/nrapigate/nrshop/atom/shop/queryPageId",
          data: e,
        });
      };
      r.getShopPageIdByProvince = f;
      var g = function (e) {
        return (0, u.default)({
          method: "POST",
          loading: !1,
          data: e,
          url: "/nrapigate/nrshop/atom/shop/queryPageId",
        });
      };
      r.getPageidByProvinceCode = g;
      var h = function (e) {
        return (0, u.default)({
          method: "POST",
          isToast: !1,
          data: o.default.getUrlParams(e.pageDataUrl),
          url: e.pageDataUrl,
        });
      };
      r.getShopPageData = h;
      var m = function (e) {
        return (0, u.default)({
          method: "POST",
          loading: !1,
          data: e,
          url: "/nrapigate/nrmix/shop/page/shopPage",
        });
      };
      r.getPageData = m;
      var v = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/shop/integration/queryProductPageNew",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getDetailByMergeCode = v;
      var S = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrshop/atom/shop/queryResultPage",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getResultInfo = S;
      var w = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/shop/refer/addRefer",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.addRefer = w;
      var y = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrshop/atom/refer/cancelRefer",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.cancelRefer = y;
      var P = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        loading: !1,
                        data: r,
                        url: "/nrapigate/nrmix/shop/refer/referInfo",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getShoperRefer = P;
      var R = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        silent: !0,
                        loading: !1,
                        data: r,
                        url: "/nrapigate/nrshop/atom/shop/customerCheck",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.customerCheck = R;
      var O = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url:
                          (r.requestUrl &&
                            "getEWMImg" == r.requestUrl &&
                            r.from &&
                            "shop" == r.from) ||
                          (r.requestUrl && "getEWMImgQR" == r.requestUrl)
                            ? "/nrapigate/nrmix/shop/poster/".concat(
                                r.urlAddress
                              )
                            : "/nrapigate/nrshop/atom/poster/posterImg",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getEWMImg = O;
      var T = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/shop/poster/shopPosterInfo",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getSecondPosterImg = T;
      var x = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/shop/saleman/registerOrInvite",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.registerOrInvite = x;
      var b = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        loading: !1,
                        silent: !0,
                        data: r,
                        url: "/nrapigate/nrmix/contactPoint/queryIopHomeShop",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.queryNavagationIOP = b;
      var k = function (e) {
        return (0, u.default)({
          method: "POST",
          url: "/nrapigate/nrshop/atom/shop/queryAgentId",
          data: e,
        });
      };
      r.getAgentIdByPhone = k;
      var q = function (e) {
        return (0, u.default)({
          method: "POST",
          url: "/nrapigate/nrshop/atom/shop/queryBrandList",
          data: e,
        });
      };
      r.queryBrandList = q;
      var I = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/shop/shopType",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getShopTypeByPageId = I;
      var C = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrhall/netStore/queryNearStore",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getHallStoreCardData = C;
      var L = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/shop/queryLocalPage",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getHallStoreShopData = L;
      var D = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrhall/netStore/queryNearStoreList",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getHallStoreList = D;
      var B = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrhall/netStore/storeDetail",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getHallStoreListItem = B;
      var M = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrhall/netStore/queryNearStoreRooms",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getNearStoreRooms = M;
      var N = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/nationalSubsidy/qualificationCode/queryStatus",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getSubsidyQualificationCode = N;
      var A = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/nationalSubsidy/qualificationCode/unBinding",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.nationalSubsidyUnBind = A;
      var H = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/productMerge/queryMergeLinkProductList",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.queryMergeLinkProductList = H;
      var F = function (e) {
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrmix/nationalSubsidy/qualificationCode/couponCollection",
        });
      };
      r.couponCollection = F;
      var U = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrmix/opportunity/eSimAppoint",
        });
      };
      r.eSimAppoint = U;
      var E = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrhall/nearbyHall/queryCardSortShow",
        });
      };
      r.queryCardSortShow = E;
      var W = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrhall/nearbyHall/receiveCoupon",
        });
      };
      r.receiveCoupon = W;
      var z = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrmix/shandong/getOperInfo",
        });
      };
      r.getOperInfo = z;
      var G = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrhall/netStore/storeFollow",
        });
      };
      r.storeFollow = G;
      var Q = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrhall/netStore/queryNearStoreV2",
        });
      };
      r.getHallStoreCardDataV2 = Q;
      var V = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrzone/contact/list",
        });
      };
      r.queryMainPackageRecommends = V;
      var J = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrzone/contact/waterFallInfo",
        });
      };
      r.waterFallInfo = J;
      var _ = function () {
        var e =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return (0, u.default)({
          method: "POST",
          data: e,
          url: "/nrapigate/nrzone/tczq/checkAgreement",
        });
      };
      r.checkAgreement = _;
      var j = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrterminal/netStore/queryNearStoreList",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getStoreList = j;
      var K = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrterminal/netStore/storeDetail",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.getStoreDetail = K;
      var X = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrmix/terminal/appointOrder/createGovEntAppointOrder",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.queryGovEntAppointOrder = X;
      var Y = (function () {
        var e = (0, a.default)(
          regeneratorRuntime.mark(function e(r) {
            return regeneratorRuntime.wrap(function (e) {
              while (1)
                switch ((e.prev = e.next)) {
                  case 0:
                    return e.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: r,
                        url: "/nrapigate/nrhall/netStore/queryStoreFollowList",
                      })
                    );
                  case 1:
                  case "end":
                    return e.stop();
                }
            }, e);
          })
        );
        return function (r) {
          return e.apply(this, arguments);
        };
      })();
      r.queryFollowShopList = Y;
    },
  },
]);
