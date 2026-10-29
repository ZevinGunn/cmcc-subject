import assert from "node:assert/strict";
import { test } from "node:test";
import {
  CLASSIC_RIGHTS,
  classicSuccess,
  claimMessage,
  explainClassicEligibility,
  findClassicOffer,
} from "../src/services/classicRights.js";

const available = (overrides = {}) => ({
  result: 0,
  retCode: "000000",
  object: {
    handle: "1",
    receive: "0",
    columnList: [
      {
        realNumber: 1,
        offerList: [
          {
            offercode: CLASSIC_RIGHTS.friday_wdmei.offerCode,
            offerName: CLASSIC_RIGHTS.friday_wdmei.offerName,
            receiveMark: "P",
          },
        ],
      },
    ],
    ...overrides,
  },
});

test("经典权益只选择固定默认权益并拒绝资格不足", () => {
  const definition = CLASSIC_RIGHTS.friday_wdmei;
  const activity = available();
  const offer = findClassicOffer(activity, definition);
  assert.equal(classicSuccess(activity), true);
  assert.equal(offer.offercode, definition.offerCode);
  assert.equal(explainClassicEligibility(activity, offer, definition), "");
  assert.match(
    explainClassicEligibility(
      available({ handle: "2" }),
      offer,
      definition,
    ),
    /暂不具备/,
  );
  assert.match(
    explainClassicEligibility(
      available({ handle: "3" }),
      { ...offer, realNumber: 0 },
      definition,
    ),
    /达到领取上限/,
  );
});

test("经典权益拒绝错误编码和领取失败响应", () => {
  const definition = CLASSIC_RIGHTS.rights_bag_cash;
  assert.equal(classicSuccess({ result: 1, retCode: "000000" }), false);
  assert.equal(
    explainClassicEligibility(
      { result: 0, retCode: "000000", object: { columnList: [] } },
      null,
      definition,
    ),
    `活动未提供默认权益：${definition.offerName}`,
  );
  assert.equal(
    claimMessage({
      result: 0,
      retCode: "000000",
      object: { resultCode: "100500", resultMessage: "已达到上限" },
    }),
    "已达到上限",
  );
  assert.match(claimMessage({ result: 1, retMsg: "服务繁忙" }), /服务繁忙/);
});
