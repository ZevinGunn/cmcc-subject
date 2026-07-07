import { A as _0x4243b4, d as _0x316233 } from "./index-3d6000c8.js";
const t = async (_0x3336d9) => {
    var _0x2d9a94, _0x50bd7d;
    (null == (_0x2d9a94 = null == _0x3336d9 ? void 0x0 : _0x3336d9["body"])
      ? void 0x0
      : _0x2d9a94["content"]) &&
      (_0x3336d9["body"]["content"] = (function (_0x1af357) {
        if (!_0x1af357) return {};
        const _0x2725f4 = {
            PACKAGEID: "packageId",
            PACKAGENAME: "packageName",
            PACKAGECODE: "packageCode",
            PRODUCTSHOWCODE: "productShowCode",
            PRODUCTSHOWNAME: "productShowName",
            PITEMSHOWCODE: "pitemShowCode",
            PITEMSHOWNAME: "pitemShowName",
            PRODUCTSENDURL: "productSendUrl",
            PITEMSENDURL: "pitemSendUrl",
            PRODVALUE: "prodValue",
            isqd2018: "isQd2018",
          },
          _0x1c424c = {};
        for (const _0x540c18 in _0x1af357)
          _0x1af357["hasOwnProperty"](_0x540c18) &&
            (_0x1c424c[_0x2725f4[_0x540c18] || _0x540c18] =
              _0x1af357[_0x540c18]);
        return _0x1c424c;
      })(
        null == (_0x50bd7d = null == _0x3336d9 ? void 0x0 : _0x3336d9["body"])
          ? void 0x0
          : _0x50bd7d["content"]
      ));
    const _0x2953f0 = { param: _0x3336d9, handleMethod: "toHandle" };
    return (
      localStorage["setItem"]("commitData", JSON["stringify"](_0x2953f0)),
      await new Promise((_0x82e27c, _0x240993) => {
        _0x4243b4["Common"]
          ["compositeCommit"](_0x3336d9)
          ["then"]((_0x4310be) => {
            var _0x5f1a42;
            "showbljg" ===
            (null ==
            (_0x5f1a42 = null == _0x4310be ? void 0x0 : _0x4310be["data"])
              ? void 0x0
              : _0x5f1a42["resType"])
              ? n(_0x82e27c, _0x240993)
              : _0x82e27c(_0x4310be);
          })
          ["catch"]((_0x442681) => {
            _0x240993(_0x442681), _0x316233("接口调用失败，请稍后再试");
          });
      })
    );
  },
  n = (_0x37ee14, _0x3941b3) => {
    _0x4243b4["Common"]
      ["showBLJG"]()
      ["then"]((_0xd5db5b) => {
        var _0x32800, _0x58526a, _0x1df326;
        localStorage["setItem"](
          "resultInfo",
          JSON["stringify"](null == _0xd5db5b ? void 0x0 : _0xd5db5b["data"])
        ),
          localStorage["getItem"]("resultInfo"),
          "success" !==
          (null == (_0x32800 = null == _0xd5db5b ? void 0x0 : _0xd5db5b["data"])
            ? void 0x0
            : _0x32800["resType"])
            ? "successNew" !==
              (null ==
              (_0x58526a = null == _0xd5db5b ? void 0x0 : _0xd5db5b["data"])
                ? void 0x0
                : _0x58526a["resType"])
              ? "spring" !==
                (null ==
                (_0x1df326 = null == _0xd5db5b ? void 0x0 : _0xd5db5b["data"])
                  ? void 0x0
                  : _0x1df326["resType"])
                ? _0x37ee14(_0xd5db5b)
                : (window["location"]["href"] = "businessSuccessSpring")
              : (window["location"]["href"] = "proResultPage")
            : (window["location"]["href"] = "businessSuccess");
      })
      ["catch"]((_0x38d3a4) => {
        _0x3941b3(_0x38d3a4), _0x316233("接口调用失败，请稍后再试");
      });
  };
export { t };
