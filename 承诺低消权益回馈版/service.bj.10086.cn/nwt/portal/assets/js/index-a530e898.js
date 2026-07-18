import { _ as _0x19e769 } from "./handle_bg-661c25ef.js";
import { b as _0x2ca774 } from "./vue-router-chunk-4fc4f9d5.js";
import { l as _0x38819f } from "./lodash-a6bf4121.js";
import { A as _0x391ae9 } from "./index-7a608eaf.js";
import { t as _0x130ff6 } from "./handle-013bc058.js";
import {
  r as _0x5e5c39,
  a9 as _0x28d260,
  k as _0x3bcfee,
  I as _0xfc4088,
  P as _0x511d60,
  U as _0x55a33e,
  X as _0xd3c554,
  W as _0xfd938,
  u as _0x5a6888,
  aa as _0x47d8fd,
} from "./vue-chunk-46ba52cf.js";
import "./axios-chunk-a2c95b13.js";
import "./crypto-chunk-09e7fd01.js";
import "./node-rsa-chunk-fdb28174.js";
const v = { class: "container" },
  f = { class: "content" },
  b = { class: "gear-row" },
  k = { class: "gear-title" },
  g = { class: "price" },
  w = { class: "gear-con" },
  y = { class: "combo" },
  C = { class: "zyjz" },
  j = { class: "p1" },
  x = { class: "num" },
  z = { class: "num" },
  F = { class: "rule" },
  I = { class: "p1" },
  N = { class: "fw\x20underline" },
  S = { class: "p1" },
  R = { class: "fw\x20underline" },
  T = { class: "p1" },
  _ = { class: "fw\x20underline" },
  G = {
    __name: "index",
    setup(_0xd4d0dc) {
      const _0x514678 = _0x2ca774(),
        _0x15f915 = _0x5e5c39({
          feeRange: "",
          planFee: "",
          flow: "",
          voice: "",
          penalty: "",
          productCode: "",
          userInfo: "",
          submitFlag: !0x1,
        }),
        {
          feeRange: _0x1868da,
          planFee: _0x1955e0,
          flow: _0x4d365e,
          voice: _0x49b79f,
          penalty: _0x17ea9b,
          productCode: _0x126649,
          submitFlag: _0x459fb1,
        } = _0x28d260(_0x15f915),
        _0x15a16e = _0x38819f["debounce"](async () => {
          const _0x2b627e = {
            common: { operType: "commitProductNew" },
            body: {
              content: {
                packageId: "55412",
                packageCode: "CNDXZYHK",
                productShowCode: _0x126649["value"],
                pitemShowCode: "KT",
              },
            },
          };
          await _0x130ff6(_0x2b627e);
        }, 0x1f4),
        _0x35311e = () => {
          _0x459fb1["value"] ||
            ((_0x459fb1["value"] = !0x0),
            _0x15a16e(),
            setTimeout(() => {
              _0x459fb1["value"] = !0x1;
            }, 0x7d0));
        };
      return (
        _0x3bcfee(() => {
          const _0x5a87fc = JSON["parse"](localStorage["getItem"]("userInfo"));
          (_0x15f915["userInfo"] = _0x5a87fc),
            _0x391ae9["Cndxzykhb"]
              ["init"]({ proType: "CNDXZYHK" })
              ["then"]((_0x1b3eaa) => {
                const _0x26bf4d = _0x1b3eaa["data"];
                if (_0x26bf4d)
                  switch (_0x26bf4d["resultCode"]) {
                    case "00":
                      (_0x1868da["value"] = _0x26bf4d["feeRange"] || ""),
                        (_0x1955e0["value"] = _0x26bf4d["planFee"] || ""),
                        (_0x4d365e["value"] = _0x26bf4d["LL"] || ""),
                        (_0x49b79f["value"] = _0x26bf4d["voice"] || ""),
                        (_0x17ea9b["value"] = _0x26bf4d["WY"] || ""),
                        (_0x126649["value"] = _0x26bf4d["productCode"] || "");
                      break;
                    case "33":
                      _0x514678["push"]({
                        path: "/cndxzykhbSuccess",
                        query: {
                          productName: encodeURIComponent(
                            _0x26bf4d["productName"] || ""
                          ),
                        },
                      });
                      break;
                    default:
                      _0x514678["push"]({ path: "/cndxzykhbFail" });
                  }
                else _0x514678["push"]({ path: "/cndxzykhbFail" });
              })
              ["catch"]((_0x4d3388) => {
                _0x514678["push"]({ path: "/cndxzykhbFail" });
              });
        }),
        (_0x5e26ed, _0x216dea) => (
          _0xfc4088(),
          _0x511d60("div", v, [
            _0x55a33e("div", f, [
              _0x216dea[0xa] ||
                (_0x216dea[0xa] = _0x55a33e(
                  "header",
                  { class: "banner" },
                  [
                    _0x55a33e("img", {
                      src: _0x19e769,
                      alt: "承诺低消资源回馈版",
                      class: "banner-img",
                    }),
                  ],
                  -0x1
                )),
              _0x55a33e("div", b, [
                _0x55a33e("h3", k, [
                  _0x216dea[0x0] ||
                    (_0x216dea[0x0] = _0xd3c554("您的主套餐档位是：")),
                  _0x55a33e(
                    "span",
                    g,
                    _0xfd938(_0x5a6888(_0x1868da)) + "元",
                    0x1
                  ),
                ]),
                _0x55a33e("div", w, [
                  _0x55a33e(
                    "p",
                    null,
                    "需承诺每月实际通信消费" +
                      _0xfd938(_0x5a6888(_0x1955e0)) +
                      "元及主套餐不降档",
                    0x1
                  ),
                ]),
              ]),
              _0x55a33e("div", y, [
                _0x55a33e("div", C, [
                  _0x216dea[0x4] ||
                    (_0x216dea[0x4] = _0x55a33e(
                      "div",
                      { class: "zyjz-title" },
                      [_0x55a33e("span", { class: "txt" }, "每月可得")],
                      -0x1
                    )),
                  _0x55a33e("div", j, [
                    _0x55a33e(
                      "span",
                      x,
                      _0xfd938(_0x5a6888(_0x4d365e)) + "GB",
                      0x1
                    ),
                    _0x216dea[0x1] || (_0x216dea[0x1] = _0xd3c554("流量\x20")),
                    _0x216dea[0x2] ||
                      (_0x216dea[0x2] = _0x55a33e(
                        "span",
                        { class: "add" },
                        "+",
                        -0x1
                      )),
                    _0x55a33e("span", z, _0xfd938(_0x5a6888(_0x49b79f)), 0x1),
                    _0x216dea[0x3] || (_0x216dea[0x3] = _0xd3c554("分钟\x20")),
                  ]),
                  _0x216dea[0x5] ||
                    (_0x216dea[0x5] = _0x55a33e(
                      "div",
                      { class: "p2" },
                      [_0xd3c554("合约期"), _0x55a33e("em", null, "24个月")],
                      -0x1
                    )),
                ]),
              ]),
              _0x55a33e("div", { class: "btn-handle", onClick: _0x35311e }),
              _0x55a33e("div", F, [
                _0x216dea[0x6] ||
                  (_0x216dea[0x6] = _0x47d8fd(
                    "<h3\x20class=\x22rule-title\x22></h3><p\x20class=\x22p1\x22><span\x20class=\x22fw\x20underline\x22>活动名称：承诺低消资源回馈版</span></p><p\x20class=\x22p1\x22><span\x20class=\x22fw\x20underline\x22>此活动为合约业务，确认办理后立即生效，合约期24个自然月。合约期内规则如下：</span></p>",
                    0x3
                  )),
                _0x55a33e("p", I, [
                  _0x55a33e(
                    "span",
                    N,
                    "1、活动生效次月起，需承诺每月实际通信消费不得低于" +
                      _0xfd938(_0x5a6888(_0x1955e0)) +
                      "元，如果您同时办理了其他承诺最低消费类合约，最低消费金额按照就高原则计算。",
                    0x1
                  ),
                  _0xd3c554(
                    "若整月停机，当月仍按" +
                      _0xfd938(_0x5a6888(_0x1955e0)) +
                      "元扣费，活动资源正常发放。每月通信费不含购买非通信类产品的费用、违约金，以及为其他人代付的万能副卡、宽带等费用。\x20",
                    0x1
                  ),
                ]),
                _0x216dea[0x7] ||
                  (_0x216dea[0x7] = _0x55a33e(
                    "p",
                    { class: "p1" },
                    [
                      _0x55a33e(
                        "span",
                        { class: "fw\x20underline" },
                        "2、需承诺主套餐不降档。"
                      ),
                    ],
                    -0x1
                  )),
                _0x55a33e("p", S, [
                  _0x55a33e(
                    "span",
                    R,
                    "3、每月可获得" +
                      _0xfd938(_0x5a6888(_0x4d365e)) +
                      "GB国内通用流量及" +
                      _0xfd938(_0x5a6888(_0x49b79f)) +
                      "分钟国内主叫通话分钟数，以上资源均不含港澳台，仅当月有效，不可分享或转赠。活动赠送的流量优先级高于套餐内国内通用流量。",
                    0x1
                  ),
                ]),
                _0x55a33e("p", T, [
                  _0x55a33e(
                    "span",
                    _,
                    "4、变更/销户/携转等需取消该业务，可拨打10086或到移动营业厅办理。活动生效第2-23个月内提前取消活动需承担违约责任，并缴纳违约金，违约金金额等于" +
                      _0xfd938(_0x5a6888(_0x17ea9b)) +
                      "元。首月和到期月取消活动不收取违约金。",
                    0x1
                  ),
                ]),
                _0x216dea[0x8] ||
                  (_0x216dea[0x8] = _0x55a33e(
                    "p",
                    { class: "p1" },
                    "5、本活动不可与\x22承诺低消有礼\x22、其他5G畅享套餐承诺类、主套餐月费优惠类、终端合约类活动同时办理。",
                    -0x1
                  )),
                _0x216dea[0x9] ||
                  (_0x216dea[0x9] = _0x55a33e(
                    "p",
                    { class: "p1" },
                    [
                      _0x55a33e(
                        "span",
                        { class: "fw\x20underline" },
                        "6、自当前协议签署日起，至活动合约期结束，须持续使用中国移动网络。"
                      ),
                    ],
                    -0x1
                  )),
              ]),
            ]),
          ])
        )
      );
    },
  };
export { G as default };
