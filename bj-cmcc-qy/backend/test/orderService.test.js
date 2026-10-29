import assert from "node:assert/strict";
import test from "node:test";
import { resolveOrderOfferId } from "../src/services/orderService.js";

test("reads offerId from an order field", () => {
  assert.equal(resolveOrderOfferId({ offerId: " 111602016645 " }), "111602016645");
  assert.equal(resolveOrderOfferId({ offerid: "111602008211" }), "111602008211");
});

test("reads offerId from legal rights attributes", () => {
  assert.equal(
    resolveOrderOfferId({
      legalRightsAttrs: [{ attrNbr: "offerId", attrValue: "111004275825" }]
    }),
    "111004275825"
  );
  assert.equal(
    resolveOrderOfferId({
      legalRightsAttrs: [{ OFFER_ID: "111602056803" }]
    }),
    "111602056803"
  );
});

test("returns an empty value when the order has no offerId", () => {
  assert.equal(resolveOrderOfferId({ legalRightsAttrs: [] }), "");
});
