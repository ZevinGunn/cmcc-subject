(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  [
    "subPackage-ShoppingCart-ShoppingCart~subPackage-ShoppingCart-cartOrderBalance~subPackage-activity-co~563ad4a2",
  ],
  {
    "4ff4": function (r, e, t) {
      "use strict";
      var n = t("4ea4");
      Object.defineProperty(e, "__esModule", { value: !0 }),
        (e.getLuckyDrawData =
          e.queryResultFlowData =
          e.queryEncryptPhone =
          e.queryMainPlanDetailedInfoSelf =
          e.queryHNBroadbandInfo =
          e.queryOrderRelation =
          e.smsValidateOrder =
          e.jsCreateOrder =
          e.submitEvaluate =
          e.querySubscribeInfo =
          e.queryProvinceProtocol =
          e.getHebeiProtocolDetail =
          e.packageCreateOrder =
          e.packagePreCheck =
          e.queryPackageProtocol =
          e.getPackageData =
          e.queryProductListCollectStatus =
          e.cancelCollectProduct =
          e.collectProduct =
          e.queryProductCollectStatus =
          e.createOrderWithPreCheck =
          e.querySHModuleInfo =
          e.queryRelevancy =
          e.getReferenceValue =
          e.queryBottomValue =
          e.createOrderByPhone =
          e.createOrder =
          e.productListPreCheck =
          e.productPreCheckNew =
          e.newSendMsg =
          e.getImeiChongqing =
          e.sendCouponResult =
          e.getProductData =
          e.getBankDiscountData =
          e.getNormData =
          e.getNewProductPersonalPage =
          e.getProductDataCustom =
          e.coupProductData =
          e.queryProdRelatedCouponNum =
          e.laXinCode =
          e.getPicture =
          e.getProdRelatedCoupon =
          e.getCouponListData =
          e.getRedPacketByProductId =
          e.getHandleGift =
          e.queryProductStock =
          e.queryNormList =
          e.queryRecommendRule =
          e.getCouponDataByCode =
          e.getSalesVolume =
          e.getJxProtocolData =
          e.familyProductByProvData =
          e.queryProtocolByIdAndVersion =
          e.getQueryBatchProtocolByIds =
          e.getDetailProtocol =
          e.getProductProtocolByPhone =
          e.getProductProtocol =
          e.getContractProtocol =
            void 0),
        t("99af"),
        t("96cf");
      var a = n(t("1da1")),
        u = n(t("b775")),
        o = n(t("6b43")),
        c = (function () {
          var r = (0, a.default)(
            regeneratorRuntime.mark(function r(e) {
              return regeneratorRuntime.wrap(function (r) {
                while (1)
                  switch ((r.prev = r.next)) {
                    case 0:
                      return r.abrupt(
                        "return",
                        (0, u.default)({
                          method: "POST",
                          data: e,
                          url: "/nrapigate/nrproduct/atom/protocol/queryProtocolById",
                        })
                      );
                    case 1:
                    case "end":
                      return r.stop();
                  }
              }, r);
            })
          );
          return function (e) {
            return r.apply(this, arguments);
          };
        })();
      e.getContractProtocol = c;
      var i = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrproduct/atom/protocol/queryProtocol",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getProductProtocol = i;
      var d = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/protocol/queryUserProtocol",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getProductProtocolByPhone = d;
      var l = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrproduct/atom/protocol/queryProtocolByIds",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getDetailProtocol = l;
      var p = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrproduct/atom/protocol/queryBatchProtocolByIds",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getQueryBatchProtocolByIds = p;
      var s = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrproduct/atom/protocol/queryProtocolByIdAndVersion",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.queryProtocolByIdAndVersion = s;
      var f = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        isToast: !1,
                        url: "/nrapigate/nrproduct/atom/product/familyProductByProv",
                        data: e,
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.familyProductByProvData = f;
      var m = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        isToast: !1,
                        url: "/nrapigate/nrmix/protocol/h5CreateProtocol",
                        data: e,
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getJxProtocolData = m;
      var h = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/chopdata/atom/stats/salesVolume",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getSalesVolume = h;
      var g = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/coupon/detail",
        });
      };
      e.getCouponDataByCode = g;
      var P = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/recommend/selectRuleById",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.queryRecommendRule = P;
      var v = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrproduct/atom/norm/normList",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.queryNormList = v;
      var y = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/seckill/queryProductStock",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.queryProductStock = y;
      var w = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrpromotion/atom/courtesy/hcByNorm",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getHandleGift = w;
      var R = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/coupon/getRedPacketByProductId",
        });
      };
      e.getRedPacketByProductId = R;
      var x = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/coupon/couponListData",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getCouponListData = x;
      var S = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/coupon/queryProdRelatedCoupon",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getProdRelatedCoupon = S;
      var k = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            var t;
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return (
                      (t = !1),
                      e.productId && (t = "picture-New-".concat(e.productId)),
                      r.abrupt(
                        "return",
                        (0, u.default)({
                          method: "POST",
                          storageId: t,
                          data: e,
                          url: "/nrapigate/nrproduct/atom/material/queryShareMaterialByProductId",
                        })
                      )
                    );
                  case 3:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getPicture = k;
      var O = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        url: "/nrapigate/nrproduct/atom/newComers/qrcodeUrl",
                        data: e,
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.laXinCode = O;
      var q = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        silent: !0,
                        loading: !0,
                        data: e,
                        platform: "other",
                        url: "/nrapigate/nrmix/coupon/queryProdRelatedCouponNum",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.queryProdRelatedCouponNum = q;
      var b = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        loading: !1,
                        data: e,
                        url: "/nrapigate/nrmix/coupon/coupProductData",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.coupProductData = b;
      var C = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/product/productPersonalPageById",
                        offline: !0,
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getProductDataCustom = C;
      var T = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/product/newProductPersonalPageById",
                        offline: !0,
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getNewProductPersonalPage = T;
      var I = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            var t;
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return (
                      (t = !1),
                      e && e.normId && (t = "normDataNew-".concat(e.normId)),
                      r.abrupt(
                        "return",
                        (0, u.default)({
                          method: "POST",
                          data: e,
                          storageId: t,
                          url: "/nrapigate/nrmix/product/norm",
                        })
                      )
                    );
                  case 3:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getNormData = I;
      var D = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/discount/findDiscountInfo",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getBankDiscountData = D;
      var B = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            var t, n;
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return (
                      (t = !1),
                      (n = "".concat(
                        o.default.storageKey(),
                        "-productDataNew"
                      )),
                      e.productCode &&
                        (t = "".concat(n, "-").concat(e.productCode)),
                      r.abrupt(
                        "return",
                        (0, u.default)({
                          method: "POST",
                          data: e,
                          storageId: t,
                          url: "/nrapigate/nrmix/product/prodWithNormList",
                        })
                      )
                    );
                  case 4:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getProductData = B;
      var N = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/coupon/sendCouponResult",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.sendCouponResult = N;
      var V = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/third/cq/queryImeiCode",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getImeiChongqing = V;
      var L = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        silent: !0,
                        loading: !1,
                        url: e.codeUrl,
                        data: e.reqData,
                        platform: "other",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.newSendMsg = L;
      var H = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/preCheck/productPreCheck",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.productPreCheckNew = H;
      var M = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e.relateNorms,
                        url: "/nrapigate/nrmix/preCheck/batchProductPreCheck",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.productListPreCheck = M;
      var j = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        url: "/nrapigate/nrmix/order/createOrder",
                        data: e,
                        timeout: 25e3,
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.createOrder = j;
      var A = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        url: "/nrapigate/nrmix/order/createUserOrder",
                        data: e,
                        timeout: 25e3,
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.createOrderByPhone = A;
      var E = function (r) {
        return (0, u.default)({
          method: "POST",
          url: "/nrapigate/nrmix/third/sc/queryBottomValue",
          data: r,
        });
      };
      e.queryBottomValue = E;
      var J = function (r) {
        return (0, u.default)({
          method: "POST",
          url: "/nrapigate/nrmix/fj/getReferenceValue",
          data: r,
        });
      };
      e.getReferenceValue = J;
      var U = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/product/queryRelevancy",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.queryRelevancy = U;
      var W = function (r) {
        return (0, u.default)({
          method: "POST",
          url: "/nrapigate/nrmix/third/sh/getSubscribeAndCheck",
          data: r,
        });
      };
      e.querySHModuleInfo = W;
      var F = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        url: "/nrapigate/nrmix/order/createOrderWithPreCheck",
                        data: e,
                        timeout: 25e3,
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.createOrderWithPreCheck = F;
      var G = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/collection/userItemCollection/queryCollectStatus",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.queryProductCollectStatus = G;
      var Q = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/collection/userItemCollection/add",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.collectProduct = Q;
      var X = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/collection/userItemCollection/cancel",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.cancelCollectProduct = X;
      var _ = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/collection/userItemCollection/queryByItemIds",
        });
      };
      e.queryProductListCollectStatus = _;
      var K = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/product/package/queryPackageInfo",
        });
      };
      e.getPackageData = K;
      var z = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/product/package/queryProtocol",
        });
      };
      e.queryPackageProtocol = z;
      var Y = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/product/package/preCheck",
        });
      };
      e.packagePreCheck = Y;
      var Z = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/product/package/createOrder",
        });
      };
      e.packageCreateOrder = Z;
      var $ = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/protocol/queryProtocol",
        });
      };
      e.getHebeiProtocolDetail = $;
      var rr = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/protocol/queryProvinceProtocol",
        });
      };
      e.queryProvinceProtocol = rr;
      var er = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/third/sh/querySubscribeInfo",
        });
      };
      e.querySubscribeInfo = er;
      var tr = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/order/saveSurveyRecord",
        });
      };
      e.submitEvaluate = tr;
      var nr = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/order/jsHeli/createOrder",
        });
      };
      e.jsCreateOrder = nr;
      var ar = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/order/jsHeli/smsValidateOrder",
        });
      };
      e.smsValidateOrder = ar;
      var ur = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/henanfilter/queryOrderRelation",
        });
      };
      e.queryOrderRelation = ur;
      var or = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/broadband/queryHNBroadbandInfo",
        });
      };
      e.queryHNBroadbandInfo = or;
      var cr = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/third/wmh/queryMainPlanDetailedInfoSelf",
        });
      };
      e.queryMainPlanDetailedInfoSelf = cr;
      var ir = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/shandong/encryptPhone",
        });
      };
      e.queryEncryptPhone = ir;
      var dr = function (r) {
        return (0, u.default)({
          method: "POST",
          data: r,
          url: "/nrapigate/nrmix/appCenter/queryContactInfoPbl",
        });
      };
      e.queryResultFlowData = dr;
      var lr = (function () {
        var r = (0, a.default)(
          regeneratorRuntime.mark(function r(e) {
            return regeneratorRuntime.wrap(function (r) {
              while (1)
                switch ((r.prev = r.next)) {
                  case 0:
                    return r.abrupt(
                      "return",
                      (0, u.default)({
                        method: "POST",
                        data: e,
                        url: "/nrapigate/nrmix/coupon/getPopupLotteryActivity",
                      })
                    );
                  case 1:
                  case "end":
                    return r.stop();
                }
            }, r);
          })
        );
        return function (e) {
          return r.apply(this, arguments);
        };
      })();
      e.getLuckyDrawData = lr;
    },
  },
]);
