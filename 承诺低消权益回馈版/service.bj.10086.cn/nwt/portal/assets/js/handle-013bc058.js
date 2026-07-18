import { A as _0x5b2a1a, d as _0x1c7ecf } from "./index-7a608eaf.js";
const t = async (_0x42e2f2) => {
    var _0x2c2fc0, _0x2c2894;
    (null == (_0x2c2fc0 = null == _0x42e2f2 ? void 0x0 : _0x42e2f2["body"])
      ? void 0x0
      : _0x2c2fc0["content"]) &&
      (_0x42e2f2["body"]["content"] = (function (_0x5a80fe) {
        if (!_0x5a80fe) return {};
        const _0x3e0702 = {
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
          _0x157c22 = {};
        for (const _0x4317b4 in _0x5a80fe)
          _0x5a80fe["hasOwnProperty"](_0x4317b4) &&
            (_0x157c22[_0x3e0702[_0x4317b4] || _0x4317b4] =
              _0x5a80fe[_0x4317b4]);
        return _0x157c22;
      })(
        null == (_0x2c2894 = null == _0x42e2f2 ? void 0x0 : _0x42e2f2["body"])
          ? void 0x0
          : _0x2c2894["content"]
      ));
    const _0x31ae75 = { param: _0x42e2f2, handleMethod: "toHandle" };
    return (
      localStorage["setItem"]("commitData", JSON["stringify"](_0x31ae75)),
      await new Promise((_0x5aaaa5, _0x56d6bf) => {
        _0x5b2a1a["Common"]
          ["compositeCommit"](_0x42e2f2)
          ["then"]((_0x260454) => {
            var _0x31e96f;
            "showbljg" ===
            (null ==
            (_0x31e96f = null == _0x260454 ? void 0x0 : _0x260454["data"])
              ? void 0x0
              : _0x31e96f["resType"])
              ? n(_0x5aaaa5, _0x56d6bf)
              : _0x5aaaa5(_0x260454);
          })
          ["catch"]((_0x22272b) => {
            _0x56d6bf(_0x22272b), _0x1c7ecf("接口调用失败，请稍后再试");
          });
      })
    );
  },
  n = (_0x5a7799, _0x38edee) => {
    _0x5b2a1a["Common"]
      ["showBLJG"]()
      ["then"]((_0x4724a5) => {
        var _0x4c94c5, _0x2c8d5e, _0x2224a8;
        localStorage["setItem"](
          "resultInfo",
          JSON["stringify"](null == _0x4724a5 ? void 0x0 : _0x4724a5["data"])
        ),
          localStorage["getItem"]("resultInfo"),
          "success" !==
          (null ==
          (_0x4c94c5 = null == _0x4724a5 ? void 0x0 : _0x4724a5["data"])
            ? void 0x0
            : _0x4c94c5["resType"])
            ? "successNew" !==
              (null ==
              (_0x2c8d5e = null == _0x4724a5 ? void 0x0 : _0x4724a5["data"])
                ? void 0x0
                : _0x2c8d5e["resType"])
              ? "spring" !==
                (null ==
                (_0x2224a8 = null == _0x4724a5 ? void 0x0 : _0x4724a5["data"])
                  ? void 0x0
                  : _0x2224a8["resType"])
                ? _0x5a7799(_0x4724a5)
                : (window["location"]["href"] = "businessSuccessSpring")
              : (window["location"]["href"] = "proResultPage")
            : (window["location"]["href"] = "businessSuccess");
      })
      ["catch"]((_0x57259f) => {
        _0x38edee(_0x57259f), _0x1c7ecf("接口调用失败，请稍后再试");
      });
  };
export { t };
