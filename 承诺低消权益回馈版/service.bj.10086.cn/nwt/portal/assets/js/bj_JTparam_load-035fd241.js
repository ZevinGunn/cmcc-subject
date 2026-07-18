import { $ as _0x9c50a4, A as _0x4b984a } from "./index-7a608eaf.js";
const n = () => {
  _0x9c50a4["getScript"](
    "https://res.app.coc.10086.cn/appother/js/public/cmcc.js",
    () => {
      cmcc["getConcatenationInfo"]({
        debug: !0x1,
        success(_0x10f160) {
          const _0x29e916 = _0x10f160["channelId"],
            _0x3ac074 = _0x10f160["yx"],
            _0x528d80 = _0x10f160["token"];
          _0x4b984a["Common"]
            ["saveOrderToJTParam"]({
              channelId: _0x29e916,
              yx: _0x3ac074,
              token: _0x528d80,
            })
            ["then"]((_0x42685b) => {})
            ["catch"]((_0x2cae57) => {});
        },
        error(_0x5c47dc) {},
      });
    }
  );
};
export { n as b };
