import {
  r as _0x3f5c93,
  a9 as _0x5f3432,
  k as _0x33abc7,
  C as _0x3446a8,
  D as _0x1907a3,
  u as _0x5dac07,
  I as _0x5e1568,
  P as _0x12fe7a,
  U as _0x5371ed,
  X as _0x1a67e4,
  W as _0x2f2ef9,
} from "./vue-chunk-46ba52cf.js";
import { _ as _0x34223d } from "./banner-a37a6889.js";
import { A as _0x1254eb, d as _0x112be1 } from "./index-3d6000c8.js";
import { u as _0x4e485b, b as _0x46e4e3 } from "./vue-router-chunk-4fc4f9d5.js";
import { t as _0x58338d } from "./handle-bb0c37e5.js";
import { l as _0x966a2b } from "./lodash-a6bf4121.js";
import { _ as _0x16886f } from "./_plugin-vue_export-helper-1b428a4d.js";
import "./axios-chunk-a2c95b13.js";
import "./crypto-chunk-09e7fd01.js";
import "./node-rsa-chunk-fdb28174.js";
const D = { class: "container" },
  v = { class: "content", style: { "text-align": "center" } },
  C = { class: "commitment" },
  j = { class: "txt" },
  b = { class: "card" },
  P = { class: "item" },
  h = { class: "left" },
  x = { class: "voice" },
  L = { class: "rule" },
  F = { class: "p1" },
  S = { class: "fwb" },
  G = { class: "p1" },
  R = { class: "fwb" },
  U = { class: "p1" },
  W = { class: "fwb" },
  y = _0x16886f(
    {
      __name: "index",
      setup(_0x402b61) {
        _0x4e485b();
        const _0x10779a = _0x46e4e3(),
          _0x3fa475 = _0x3f5c93({
            ifShow: !0x1,
            planFee: "",
            flowNum: "",
            money: "",
            productShowCode: "",
            packageCode: "HCLLFF26",
            packageId: "55412",
          }),
          {
            ifShow: _0x399c9e,
            planFee: _0x2b3d75,
            flowNum: _0x3c2f0b,
            money: _0x1e70eb,
            productShowCode: _0x4f7c31,
            packageCode: _0x2ef08e,
            packageId: _0x2cf171,
          } = _0x5f3432(_0x3fa475),
          _0x1e87fb = _0x966a2b["debounce"](async () => {
            const _0x382910 = {
              common: { operType: "commitProductNew" },
              body: {
                content: {
                  packageId: _0x2cf171["value"],
                  packageCode: _0x2ef08e["value"],
                  productShowCode: _0x4f7c31["value"],
                  pitemShowCode: "KT",
                  mtOtherParams: "1-"["concat"](_0x2b3d75["value"]),
                },
              },
            };
            await _0x58338d(_0x382910);
          }, 0x1f4);
        return (
          _0x33abc7(() => {
            sessionStorage["getItem"]("trafficParams") &&
              sessionStorage["removeItem"]("trafficParams"),
              _0x1254eb["EnjoyTrafficDoubling"]
                ["HCLLFFInitData"]()
                ["then"]((_0x482557) => {
                  var _0x3a350d,
                    _0x2fdbf2,
                    _0x5509f2,
                    _0x12e619,
                    _0x4b624b,
                    _0x6be5aa,
                    _0x59a0fd,
                    _0x52619d,
                    _0x2c7d4e,
                    _0x1fa8c6;
                  "00" ===
                  (null == (_0x3a350d = _0x482557["data"])
                    ? void 0x0
                    : _0x3a350d["resultCode"])
                    ? ((_0x399c9e["value"] = !0x0),
                      (_0x2b3d75["value"] =
                        (null == (_0x2fdbf2 = _0x482557["data"])
                          ? void 0x0
                          : _0x2fdbf2["plan_fee"]) || ""),
                      (_0x4f7c31["value"] =
                        null == (_0x5509f2 = _0x482557["data"])
                          ? void 0x0
                          : _0x5509f2["productCode"]),
                      (_0x3c2f0b["value"] =
                        null == (_0x12e619 = _0x482557["data"])
                          ? void 0x0
                          : _0x12e619["productDesc"]["split"]("|")[0x0]),
                      (_0x1e70eb["value"] =
                        null == (_0x4b624b = _0x482557["data"])
                          ? void 0x0
                          : _0x4b624b["productDesc"]["split"]("|")[0x1]))
                    : "11" ===
                      (null == (_0x6be5aa = _0x482557["data"])
                        ? void 0x0
                        : _0x6be5aa["resultCode"])
                    ? ((_0x2b3d75["value"] =
                        (null == (_0x59a0fd = _0x482557["data"])
                          ? void 0x0
                          : _0x59a0fd["plan_fee"]) || ""),
                      (_0x3c2f0b["value"] =
                        null == (_0x52619d = _0x482557["data"])
                          ? void 0x0
                          : _0x52619d["productDesc"]["split"]("|")[0x0]),
                      sessionStorage["setItem"](
                        "trafficParams",
                        JSON["stringify"]({
                          date:
                            (null == (_0x2c7d4e = _0x482557["data"])
                              ? void 0x0
                              : _0x2c7d4e["productCrtDate"]) || "",
                          planFee: _0x2b3d75["value"],
                          flowNum: _0x3c2f0b["value"],
                        })
                      ),
                      _0x10779a["push"]({ path: "/trafficDoublingProcessed" }))
                    : (null == (_0x1fa8c6 = _0x482557["data"]) ||
                        _0x1fa8c6["resultCode"],
                      _0x10779a["push"]({
                        path: "/trafficDoublingDissatisfied",
                      }));
                })
                ["catch"]((_0x33d9a9) => {
                  _0x112be1(
                    (null == _0x33d9a9 ? void 0x0 : _0x33d9a9["message"]) ||
                      "接口调用失败，请稍后重试"
                  );
                });
          }),
          (_0x23be8f, _0x17f528) =>
            _0x3446a8(
              (_0x5e1568(),
              _0x12fe7a(
                "div",
                D,
                [
                  _0x5371ed("div", v, [
                    _0x17f528[0xe] ||
                      (_0x17f528[0xe] = _0x5371ed(
                        "div",
                        { class: "banner" },
                        [_0x5371ed("img", { src: _0x34223d, alt: "banner" })],
                        -0x1
                      )),
                    _0x5371ed("div", C, [
                      _0x5371ed("p", j, [
                        _0x17f528[0x1] ||
                          (_0x17f528[0x1] =
                            _0x1a67e4("需承诺每月实际通信消费")),
                        _0x5371ed(
                          "em",
                          null,
                          _0x2f2ef9(_0x5dac07(_0x2b3d75)),
                          0x1
                        ),
                        _0x17f528[0x2] || (_0x17f528[0x2] = _0x1a67e4("元")),
                      ]),
                      _0x17f528[0x3] ||
                        (_0x17f528[0x3] = _0x5371ed(
                          "img",
                          {
                            class: "decs",
                            src: "data:image/png;base64,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",
                          },
                          null,
                          -0x1
                        )),
                    ]),
                    _0x5371ed("ul", b, [
                      _0x17f528[0x6] ||
                        (_0x17f528[0x6] = _0x5371ed(
                          "p",
                          { class: "tips" },
                          "合约期24个月，到期自动失效",
                          -0x1
                        )),
                      _0x5371ed("li", P, [
                        _0x5371ed("div", h, [
                          _0x5371ed(
                            "p",
                            x,
                            _0x2f2ef9(_0x5dac07(_0x3c2f0b)) + "GB",
                            0x1
                          ),
                          _0x17f528[0x4] ||
                            (_0x17f528[0x4] = _0x5371ed(
                              "p",
                              { class: "tip" },
                              [
                                _0x5371ed("b", null, "国内通用流量"),
                                _0x1a67e4("（不含港澳台）"),
                              ],
                              -0x1
                            )),
                        ]),
                        _0x17f528[0x5] ||
                          (_0x17f528[0x5] = _0x5371ed(
                            "div",
                            { class: "right" },
                            [_0x5371ed("p", { class: "txt" }, "流量")],
                            -0x1
                          )),
                      ]),
                    ]),
                    _0x5371ed("div", {
                      class: "btn-handle",
                      onClick:
                        _0x17f528[0x0] ||
                        (_0x17f528[0x0] = (..._0x2c58ed) =>
                          _0x5dac07(_0x1e87fb) &&
                          _0x5dac07(_0x1e87fb)(..._0x2c58ed)),
                    }),
                    _0x17f528[0xf] ||
                      (_0x17f528[0xf] = _0x5371ed(
                        "h3",
                        { class: "title" },
                        null,
                        -0x1
                      )),
                    _0x5371ed("div", L, [
                      _0x17f528[0xb] ||
                        (_0x17f528[0xb] = _0x5371ed(
                          "p",
                          { class: "p1" },
                          [
                            _0x1a67e4(
                              "入网6个月以上用户可办理，办理后立即生效，"
                            ),
                            _0x5371ed(
                              "span",
                              { class: "fwb" },
                              "合约期24个自然月，"
                            ),
                            _0x1a67e4("到期自动失效，合约期内规则如下:"),
                          ],
                          -0x1
                        )),
                      _0x5371ed("p", F, [
                        _0x17f528[0x7] ||
                          (_0x17f528[0x7] = _0x1a67e4("1、合约期内")),
                        _0x5371ed(
                          "span",
                          S,
                          "需承诺每月实付通信费不低于" +
                            _0x2f2ef9(_0x5dac07(_0x2b3d75)) +
                            "元。若您参加其他有承诺消费活动，每月承诺消费金额将就高计算。整月停机仍按承诺消费金额扣除，活动资源正常赠送。",
                          0x1
                        ),
                        _0x17f528[0x8] ||
                          (_0x17f528[0x8] = _0x1a67e4(
                            "(通信消费不含购买非通信类产品的费用、违约金，以及为其他人代付的万能副卡、宽带等费用)。\x20"
                          )),
                      ]),
                      _0x5371ed("p", G, [
                        _0x17f528[0x9] ||
                          (_0x17f528[0x9] = _0x1a67e4("2、合约期内")),
                        _0x5371ed(
                          "span",
                          R,
                          "每月可获赠" +
                            _0x2f2ef9(_0x5dac07(_0x3c2f0b)) +
                            "GB的国内通用流量(不含港澳台)。优先级高于套内国内通用流量，流量不可分享、不可结转、不可转赠。",
                          0x1
                        ),
                      ]),
                      _0x17f528[0xc] ||
                        (_0x17f528[0xc] = _0x5371ed(
                          "p",
                          { class: "p1" },
                          [
                            _0x5371ed(
                              "span",
                              { class: "fwb" },
                              "3、自订购成功至有效期结束，须持续使用中国移动网络。"
                            ),
                          ],
                          -0x1
                        )),
                      _0x5371ed("p", U, [
                        _0x17f528[0xa] ||
                          (_0x17f528[0xa] = _0x1a67e4(
                            "4、变更/退订/销户/携转需承担违约责任;"
                          )),
                        _0x5371ed(
                          "span",
                          W,
                          "活动生效第2-23个月退订，需缴纳承诺合约款" +
                            _0x2f2ef9(_0x5dac07(_0x1e70eb)) +
                            "元。",
                          0x1
                        ),
                      ]),
                      _0x17f528[0xd] ||
                        (_0x17f528[0xd] = _0x5371ed(
                          "p",
                          { class: "p1" },
                          "5、可拨打10086或前往营业厅退订活动，退订后活动包含的流量资源将于当月月底同步失效。",
                          -0x1
                        )),
                    ]),
                  ]),
                ],
                0x200
              )),
              [[_0x1907a3, _0x5dac07(_0x399c9e)]]
            )
        );
      },
    },
    [["__scopeId", "data-v-04197653"]]
  );
export { y as default };
