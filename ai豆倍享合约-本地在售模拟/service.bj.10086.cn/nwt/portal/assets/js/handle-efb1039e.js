import { A as _0xc3e1e5, d as _0x5067b6 } from "./index-6814ac2a.js";
const t = async (_0xd7d85b) => {
    var _0x2a419f, _0x57ab7c;
    (null == (_0x2a419f = null == _0xd7d85b ? void 0x0 : _0xd7d85b["body"])
      ? void 0x0
      : _0x2a419f["content"]) &&
      (_0xd7d85b["body"]["content"] = (function (_0x397628) {
        if (!_0x397628) return {};
        const _0x393506 = {
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
          _0x5ee207 = {};
        for (const _0x593faa in _0x397628)
          _0x397628["hasOwnProperty"](_0x593faa) &&
            (_0x5ee207[_0x393506[_0x593faa] || _0x593faa] =
              _0x397628[_0x593faa]);
        return _0x5ee207;
      })(
        null == (_0x57ab7c = null == _0xd7d85b ? void 0x0 : _0xd7d85b["body"])
          ? void 0x0
          : _0x57ab7c["content"]
      ));
    const _0x5b1aba = { param: _0xd7d85b, handleMethod: "toHandle" };
    return (
      localStorage["setItem"]("commitData", JSON["stringify"](_0x5b1aba)),
      await new Promise((_0x108dbb, _0x3e9d0e) => {
        _0xc3e1e5["Common"]
          ["compositeCommit"](_0xd7d85b)
          ["then"]((_0x1b7711) => {
            var _0x2bd75d;
            "showbljg" ===
            (null ==
            (_0x2bd75d = null == _0x1b7711 ? void 0x0 : _0x1b7711["data"])
              ? void 0x0
              : _0x2bd75d["resType"])
              ? n(_0x108dbb, _0x3e9d0e)
              : _0x108dbb(_0x1b7711);
          })
          ["catch"]((_0x4195ef) => {
            _0x3e9d0e(_0x4195ef), _0x5067b6("接口调用失败，请稍后再试");
          });
      })
    );
  },
  n = (_0x4c8c60, _0x1b28f5) => {
    _0xc3e1e5["Common"]
      ["showBLJG"]()
      ["then"]((_0x5237d1) => {
        var _0x26597a, _0x444385, _0x36f428;
        localStorage["setItem"](
          "resultInfo",
          JSON["stringify"](null == _0x5237d1 ? void 0x0 : _0x5237d1["data"])
        ),
          localStorage["getItem"]("resultInfo"),
          "success" !==
          (null ==
          (_0x26597a = null == _0x5237d1 ? void 0x0 : _0x5237d1["data"])
            ? void 0x0
            : _0x26597a["resType"])
            ? "successNew" !==
              (null ==
              (_0x444385 = null == _0x5237d1 ? void 0x0 : _0x5237d1["data"])
                ? void 0x0
                : _0x444385["resType"])
              ? "spring" !==
                (null ==
                (_0x36f428 = null == _0x5237d1 ? void 0x0 : _0x5237d1["data"])
                  ? void 0x0
                  : _0x36f428["resType"])
                ? _0x4c8c60(_0x5237d1)
                : (window["location"]["href"] = "businessSuccessSpring")
              : (window["location"]["href"] = "proResultPage")
            : (window["location"]["href"] = "businessSuccess");
      })
      ["catch"]((_0x2d4406) => {
        _0x1b28f5(_0x2d4406), _0x5067b6("接口调用失败，请稍后再试");
      });
  };
export { t };
