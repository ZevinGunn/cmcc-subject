import assert from "node:assert/strict";
import test from "node:test";
import {
  buildExchangeBody,
  buildPublicZeroCostExchangeBody,
  exchangeCost,
  isPublicZeroCostRight,
  mergePublicZeroCostRights,
  shouldExposeRight
} from "../src/services/fortuneBagService.js";
import { couponEnough } from "../src/services/rightsCatalog.js";

const DAOXIANGCUN_RIGHT = {
  legalRightsId: "right-id",
  legalRightsNbr: "QY1765335520502",
  legalRightsName: "稻香村20元消费券",
  offerId: "111602052831",
  certificateNum: 0,
  exchangeNum: 0
};

test("keeps all interface rights visible, including zero-cost rights", () => {
  assert.equal(shouldExposeRight({ userInfo: { phoneNo: "13900000000" } }, DAOXIANGCUN_RIGHT), true);
  assert.equal(
    shouldExposeRight(
      { userInfo: { phoneNo: "13900000000" } },
      { legalRightsNbr: "QY1765338097429", offerId: "111602052832", certificateNum: 0 }
    ),
    true
  );
  assert.equal(
    shouldExposeRight(
      { userInfo: { phoneNo: "13900000000" } },
      { legalRightsNbr: "QY-OTHER-ZERO", certificateNum: 0 }
    ),
    true
  );
});

test("pins both public zero-cost rights and removes duplicate list entries", () => {
  const rows = mergePublicZeroCostRights(
    [
      { legalRightsNbr: "QY1765335520502", legalRightsName: "duplicate" },
      { legalRightsNbr: "QY-PAID", legalRightsName: "paid" }
    ],
    [
      { legalRightsNbr: "QY1765335520502", offerId: "111602052831", certificateNum: 0 },
      { legalRightsNbr: "QY1765338097429", offerId: "111602052832", certificateNum: 0 }
    ]
  );
  assert.deepEqual(rows.map((item) => item.legalRightsNbr), [
    "QY1765335520502",
    "QY1765338097429",
    "QY-PAID"
  ]);
});

test("keeps a zero certificate cost in exchange calculations and request body", () => {
  assert.equal(exchangeCost(DAOXIANGCUN_RIGHT), 0);
  assert.deepEqual(buildExchangeBody(DAOXIANGCUN_RIGHT), {
    offerId: "111602052831",
    rightCode: "QY1765335520502",
    rightId: "right-id",
    certificateId: "1387830401690525697",
    certificateNum: 0,
    checkSwitch: false
  });
});

test("builds a rightId-free fallback request only for the two public zero-cost rights", () => {
  assert.equal(isPublicZeroCostRight(DAOXIANGCUN_RIGHT), true);
  assert.equal(isPublicZeroCostRight({ legalRightsNbr: "QY1765338097429" }), true);
  assert.equal(isPublicZeroCostRight({ legalRightsNbr: "QY-OTHER-ZERO" }), false);
  assert.deepEqual(
    buildPublicZeroCostExchangeBody(
      { userInfo: { phoneNo: "13900000000" } },
      DAOXIANGCUN_RIGHT
    ),
    {
      accNbr: "13900000000",
      offerId: "111602052831",
      rightCode: "QY1765335520502",
      memberLevelCode: "1"
    }
  );
});

test("allows a zero-cost right when the account has no available Plus coupons", () => {
  assert.equal(
    couponEnough(
      { universalCouponCanUseNum: 0, exclusiveCouponList: [] },
      {
        ...DAOXIANGCUN_RIGHT,
        certificateList: [
          {
            certificateId: "1387830401690525697",
            certificateType: "1001",
            exchangeNum: 0
          }
        ]
      },
      "1387830401690525697"
    ),
    true
  );
});
