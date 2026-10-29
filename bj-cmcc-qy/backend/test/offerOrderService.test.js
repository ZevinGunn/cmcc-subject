import assert from "node:assert/strict";
import test from "node:test";
import { buildOfferOrderBody } from "../src/services/offerOrderService.js";

test("keeps the previous offer request body when offerType is empty", () => {
  assert.deepEqual(buildOfferOrderBody({ offerId: "111602016645", offerType: "" }), {
    offerId: "111602016645"
  });
});

test("passes a custom offerType through every offer request", () => {
  assert.deepEqual(buildOfferOrderBody({ offerId: " 111602016645 ", offerType: " 2 " }), {
    offerId: "111602016645",
    offerType: "2"
  });
});

test("adds the verification code only for the final order request", () => {
  const payload = { offerId: "111602016645", offerType: "2", verifyCode: " 123456 " };
  assert.deepEqual(buildOfferOrderBody(payload), {
    offerId: "111602016645",
    offerType: "2"
  });
  assert.deepEqual(buildOfferOrderBody(payload, true), {
    offerId: "111602016645",
    offerType: "2",
    verifyCode: "123456"
  });
});
