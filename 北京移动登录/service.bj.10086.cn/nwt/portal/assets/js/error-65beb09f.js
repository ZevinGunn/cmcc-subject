import { _ as _0x57a362 } from "./user_offline-966110a0.js";
import { _ as _0x56f13b } from "./user_online-b442c65b.js";
import { c as _0x13c097 } from "./index-ad9a8e48.js";
import { _ as _0x8db105 } from "./_plugin-vue_export-helper-1b428a4d.js";
import {
  r as _0x4ed992,
  a9 as _0x1db845,
  k as _0x390d0b,
  I as _0x3d34e7,
  P as _0xdfea43,
  U as _0x58883d,
  X as _0x32372a,
  u as _0x33ad85,
  W as _0x1ccd38,
  aa as _0x559879,
} from "./vue-chunk-46ba52cf.js";
import "./axios-chunk-a2c95b13.js";
import "./crypto-chunk-4557dc58.js";
import "./node-rsa-chunk-00e7725d.js";
import "./vue-router-chunk-4fc4f9d5.js";
const g = { class: "error" },
  v = { class: "box_bt" },
  u = {
    class: "home",
    href: "https://service.bj.10086.cn/m/personal/personalIndex.action",
  },
  E = { key: 0x0, src: _0x57a362, alt: "请登录" },
  M = { key: 0x1, src: _0x56f13b, alt: "已登录" },
  I = { style: { "text-align": "center", margin: "30px\x200px" } },
  w = { class: "congratulation" },
  B = _0x8db105(
    {
      __name: "error",
      setup(_0x3a28de) {
        const _0x2605fb = _0x4ed992({
            actionErrors: [],
            userInfo: null,
            errMessage: "",
          }),
          {
            actionErrors: _0x49df7a,
            userInfo: _0x5b1855,
            errMessage: _0xa36324,
          } = _0x1db845(_0x2605fb);
        return (
          _0x390d0b(() => {
            const _0x38a2fb = localStorage["getItem"]("errMessage");
            (_0xa36324["value"] = _0x38a2fb || "系统错误，请您稍后重试！"),
              _0x13c097(
                "meta",
                "Keywords",
                "中国移动,中国移动通信,中移动,手机,全球通,神州行,动感地带,政企客户,gotone,easyown,m-zone,infowin"
              ),
              _0x13c097(
                "meta",
                "Description",
                "欢迎您访问中国移动统一门户网站。中国移动通信集团公司，是中国规模最大的移动通信运营商，主要经营移动话音、数据、IP电话和多媒体业务，并具有计算机互联网国际联网单位经营权和国际出入口局业务经营权。"
              ),
              _0x13c097(
                "META",
                "DESCRIPTION",
                "实时在线，快速登录，选择多样，轻松便捷。移动数据流量为您提供高速稳定的网络平台，助您畅游网络、通行无阻！"
              ),
              _0x13c097("META", "KEYWORDS", "移动数据流量业务"),
              _0x13c097("META", "type", "网厅"),
              _0x13c097("META", "subcat", "业务办理"),
              _0x13c097("META", "brand", "其他"),
              _0x13c097("META", "extendedkw", "移动数据流量业务"),
              _0x13c097("META", "imgurl", ""),
              _0x13c097("META", "banliurl", ""),
              _0x13c097("META", "index", "yes");
            const _0x33daf8 = localStorage["getItem"]("userInfo");
            _0x5b1855["value"] = _0x33daf8 ? JSON["parse"](_0x33daf8) : null;
          }),
          (_0x428df3, _0x4d26ee) => (
            _0x3d34e7(),
            _0xdfea43("div", g, [
              _0x58883d("div", v, [
                _0x4d26ee[0x0] ||
                  (_0x4d26ee[0x0] = _0x58883d(
                    "a",
                    { class: "pre", href: "javascript:history.go(-1)" },
                    [
                      _0x58883d("img", {
                        src: "data:image/png;base64,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",
                        alt: "",
                      }),
                    ],
                    -0x1
                  )),
                _0x4d26ee[0x1] || (_0x4d26ee[0x1] = _0x32372a("\x20提示\x20")),
                _0x58883d("a", u, [
                  _0x33ad85(_0x5b1855)
                    ? (_0x3d34e7(), _0xdfea43("img", M))
                    : (_0x3d34e7(), _0xdfea43("img", E)),
                ]),
              ]),
              _0x58883d("div", I, [
                _0x58883d("div", null, [
                  _0x58883d("p", w, _0x1ccd38(_0x33ad85(_0xa36324)), 0x1),
                ]),
              ]),
              _0x4d26ee[0x2] ||
                (_0x4d26ee[0x2] = _0x559879(
                  "<div\x20class=\x22box_bottom\x22\x20data-v-70611e9d><ul\x20data-v-70611e9d><li\x20data-v-70611e9d><a\x20href=\x22https://service.bj.10086.cn/m/ssolog/ssoUserInfo.action?RelayState=&lt;s:property\x20value=&#39;backURL&#39;\x20/&gt;\x22\x20data-v-70611e9d>登录</a></li><li\x20data-v-70611e9d><a\x20href=\x22javascript:void(0);\x22\x20data-v-70611e9d>下载app</a></li><li\x20data-v-70611e9d><a\x20href=\x22http://www.bj.10086.cn\x22\x20data-v-70611e9d>电脑版</a></li><li\x20style=\x22border:none;\x22\x20data-v-70611e9d><a\x20href=\x22http://www.10086.cn/support/focus/onlineservice/index.htm\x22\x20data-v-70611e9d>在线客服</a></li></ul><p\x20data-v-70611e9d>\x202014\u00a0\u00a0\u00a0\u00a0北京移动\u00a0\u00a0\u00a0\u00a0版权所有\x20</p></div>",
                  0x1
                )),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-70611e9d"]]
  );
export { B as default };
