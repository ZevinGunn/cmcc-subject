import {
  b as _0x1c1b15,
  k as _0x22cca5,
  I as _0x62f5a5,
  P as _0x529bdf,
  U as _0x3fc8ae,
  aa as _0x2f71ba,
  S as _0x188d71,
  X as _0x5e9b69,
  N as _0x1ebca2,
  C as _0x219e5f,
  D as _0x2db8cd,
} from "./vue-chunk-46ba52cf.js";
import { b as _0x2bb70d } from "./vue-router-chunk-4fc4f9d5.js";
import "./lodash-a6bf4121.js";
import { A as _0x30bd70, d as _0x11ee09 } from "./index-7a608eaf.js";
import { _ as _0x105617 } from "./_plugin-vue_export-helper-1b428a4d.js";
import "./axios-chunk-a2c95b13.js";
import "./crypto-chunk-09e7fd01.js";
import "./node-rsa-chunk-fdb28174.js";
const h = { class: "container" },
  m = { class: "content" },
  x = { class: "tabbar" },
  g = { class: "tabbar-header" },
  M = { key: 0x0, class: "popup1" },
  k = { class: "loading" },
  f = _0x105617(
    {
      __name: "index",
      setup(_0x5cc759) {
        const _0x59a130 = _0x2bb70d(),
          _0x20349d = _0x1c1b15(0x1),
          _0x5a580d = _0x1c1b15(""),
          _0x55ec91 = _0x1c1b15(!0x1),
          _0x149f33 = _0x1c1b15(!0x1),
          _0x3bb64a = (_0x51b7ae) => {
            _0x20349d["value"] = _0x51b7ae;
          },
          _0x25410c = () => {
            _0x55ec91["value"] = !0x1;
          },
          _0x4ff0b1 = () => {
            _0x25410c(),
              (window["location"]["href"] =
                "https://service.bj.10086.cn/m/bbConsole/checkAddressModel.action?PACKAGECODE=SCKD");
          },
          _0x32fd54 = () => {
            "Y" !== _0x5a580d["value"]
              ? (sessionStorage["setItem"](
                  "gearInfo",
                  JSON["stringify"]({
                    gearId: "111602057454",
                    gearName: "融合宽带1000M优享套餐（三年）",
                  })
                ),
                _0x59a130["push"]({ name: "integratedBroadband1000MOrder" }))
              : (_0x55ec91["value"] = !0x0);
          },
          _0xee22a7 = () => {
            _0x30bd70["IntegratedBroadband1000M"]
              ["index1000MYXTC"]()
              ["then"]((_0x1eec9d) => {
                !0x0 === _0x1eec9d["data"]
                  ? _0x30bd70["IntegratedBroadband1000M"]
                      ["integratedBroadband1000MIndex"]()
                      ["then"]((_0x2764c1) => {
                        _0x2764c1["data"] &&
                          "Y" === _0x2764c1["data"]["data"] &&
                          ((_0x5a580d["value"] = _0x2764c1["data"]["data"]),
                          (_0x55ec91["value"] = !0x0));
                      })
                      ["catch"]((_0x2d4060) => {
                        _0x11ee09(
                          (null == _0x2d4060
                            ? void 0x0
                            : _0x2d4060["message"]) || "系统繁忙，请稍后重试"
                        );
                      })
                  : _0x59a130["push"]({
                      name: "integratedBroadband1000MTips2",
                    });
              })
              ["catch"](() => {
                _0x59a130["push"]({ name: "integratedBroadband1000MTips1" });
              });
          };
        return (
          _0x22cca5(() => {
            _0xee22a7();
          }),
          (_0x1e6093, _0x19aa87) => (
            _0x62f5a5(),
            _0x529bdf("div", h, [
              _0x3fc8ae("div", m, [
                _0x19aa87[0x4] ||
                  (_0x19aa87[0x4] = _0x3fc8ae(
                    "div",
                    { class: "banner" },
                    null,
                    -0x1
                  )),
                _0x3fc8ae("div", { class: "card-box" }, [
                  _0x3fc8ae("div", { class: "card" }, [
                    _0x19aa87[0x2] ||
                      (_0x19aa87[0x2] = _0x2f71ba(
                        "<div\x20class=\x22card-content\x22\x20data-v-dc0e0636><div\x20class=\x22card-tag\x22\x20data-v-dc0e0636></div><h2\x20class=\x22card-title\x22\x20data-v-dc0e0636><span\x20class=\x22speed\x22\x20data-v-dc0e0636>1000M</span>宽带</h2><p\x20class=\x22card-desc\x22\x20data-v-dc0e0636>承诺每月手机实付通信费100元即可办理</p></div>",
                        0x1
                      )),
                    _0x3fc8ae("div", {
                      class: "submit-btn",
                      onClick: _0x32fd54,
                    }),
                  ]),
                ]),
                _0x3fc8ae("div", x, [
                  _0x3fc8ae("div", g, [
                    _0x3fc8ae(
                      "p",
                      {
                        class: _0x188d71([
                          "tabbar-item",
                          { active: 0x1 === _0x20349d["value"] },
                        ]),
                        onClick:
                          _0x19aa87[0x0] ||
                          (_0x19aa87[0x0] = (_0x3f820b) => _0x3bb64a(0x1)),
                      },
                      "\x20业务规则\x20",
                      0x2
                    ),
                    _0x3fc8ae(
                      "p",
                      {
                        class: _0x188d71([
                          "tabbar-item",
                          { active: 0x2 === _0x20349d["value"] },
                        ]),
                        onClick:
                          _0x19aa87[0x1] ||
                          (_0x19aa87[0x1] = (_0xae6c44) => _0x3bb64a(0x2)),
                      },
                      "\x20温馨提示\x20",
                      0x2
                    ),
                  ]),
                  _0x3fc8ae(
                    "div",
                    {
                      class: _0x188d71([
                        "tabbar-content",
                        "tabbar-content"["concat"](_0x20349d["value"]),
                      ]),
                    },
                    _0x19aa87[0x3] ||
                      (_0x19aa87[0x3] = [
                        _0x2f71ba(
                          "<div\x20class=\x22tabbar-content-item\x20product-infomation\x22\x20data-v-dc0e0636><div\x20class=\x22rule-content\x22\x20data-v-dc0e0636><p\x20data-v-dc0e0636>1、融合宽带1000M优享套餐(三年)套餐，<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>仅限参与福利狂欢奖上加奖活动中奖的客户新装办理，</span>合约期36个月。合约期内，客户需持续使用中国移动网络，<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>承诺每月手机实付通信费100元，如未达到将按承诺金额收取补差款。</span>手机实付通信费包含话音、流量、点对点短信、国际长途、国际漫游等费用；<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>不含购买非通信类产品费用、违约金、为其他人或办理其他业务代付的费用。</span></p><p\x20data-v-dc0e0636>2、宽带安装成功即可使用，安装成功当月不收费，宽带套餐将在宽带安装成功的次月生效。</p><p\x20data-v-dc0e0636>3、宽带使用期间，<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>如代付手机号码停机，宽带不停机且正常计费。</span>如客户办理<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>变更宽带代付手机号码，手机号码离网、转户、分户、合户，携号转品牌等业务，需先取消宽带套餐后方可办理。</span>。</p><p\x20data-v-dc0e0636>4、合约期内，如客户<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>取消方案需承担违约责任，交纳承诺合约款200元。</span></p><p\x20data-v-dc0e0636>5、合约期满时，如任何一方未向对方提出终止或变更要求，<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>宽带合约期将自动延续36个月，延期不受次数限制；新合约期内取消方案仍需承担违约责任，按照上述约定交纳承诺合约款。</span></p><p\x20data-v-dc0e0636>6、客户取消宽带可前往营业厅办理，<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>并归还北京移动提供使用的光猫、机顶盒、路由器等设备及配件(如不涉及请忽略)，</span>如无法归还，应按公示价格交纳<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>终端赔偿款(光猫不低于250元/套、机顶盒不低于220元/套、路由器不低于200元/套)。</span></p><p\x20data-v-dc0e0636>7、宽带使用期内，客户可申请移机，移机的目的地址需是北京移动已提供宽带业务接入服务的地区。<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>客户办理宽带移机时应按照当前公示价格交纳移机费用。</span></p><p\x20data-v-dc0e0636>8、副卡号码及非FTTH小区无法办理本宽带套餐。</p></div></div><div\x20class=\x22tabbar-content-item\x20tips-infomation\x20rule-content\x22\x20data-v-dc0e0636><p\x20data-v-dc0e0636>1、客户通过北京移动线上渠道按提示自助办理宽带报装业务，报装成功后会有工作人员联系确认装机详细信息，如经核实客户的报装地址已覆盖移动宽带，将安排工作人员上门装机，装机情况与实际安装环境相关，最终装机结果以工作人员上门确认为准。如经核实后客户的报装地址尚未覆盖移动宽带或不具备安装条件，或由于其他业务规则导致无法线上报装，工作人员将取消宽带报装业务。敬请谅解。</p><p\x20data-v-dc0e0636>2、<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>使用北京移动手机号码报装宽带的客户，报装宽带的手机号码机主及入网等相关信息将同步至宽带账户，办理的宽带的机主信息与您手机号码机主信息一致，报装手机号码的机主将成为该条宽带机主。</span></p><p\x20data-v-dc0e0636>3、宽带安装成功时客户需交纳相关费用，若宽带安装不成功，报装业务自动失效。</p><p\x20data-v-dc0e0636>4、单位户(即客户姓名为***公司)在线上渠道无法办理，客户需持公司介绍信及相关手续到营业厅办理。</p><p\x20data-v-dc0e0636>5、<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>宽带的收据、发票均为电子票据。宽带装机成功后，客户可去营业厅申请开具相关电子票据。若客户后期想补领电子发票，可通过10086热线进行电子发票的查询及补推送。融合宽带月资费由客户承诺的手机号码出账，不单独开具宽带发票。</span></p><p\x20data-v-dc0e0636>6、移动宽带接入形式：光宽带接入。FTTH接入小区可办理全部宽带方案，<span\x20class=\x22text-underline\x22\x20data-v-dc0e0636>FTTB接入小区仅支持办理100M及以下宽带方案。</span></p><p\x20data-v-dc0e0636>7、移动宽带的接入速率均指下行速率，具体上下行速率如下：</p><table\x20data-v-dc0e0636><tbody\x20data-v-dc0e0636><tr\x20data-v-dc0e0636><th\x20width=\x2231.7800%\x22\x20data-v-dc0e0636><p\x20data-v-dc0e0636>产品速率</p></th><th\x20width=\x2233.6000%\x22\x20data-v-dc0e0636><p\x20data-v-dc0e0636>下行速率<br\x20data-v-dc0e0636>（bps）</p></th><th\x20width=\x2234.6000%\x22\x20data-v-dc0e0636><p\x20data-v-dc0e0636>上行速率<br\x20data-v-dc0e0636>（bps）</p></th></tr><tr\x20data-v-dc0e0636><td\x20width=\x2231.7800%\x22\x20data-v-dc0e0636><p\x20data-v-dc0e0636>1000M</p></td><td\x20width=\x2233.6000%\x22\x20data-v-dc0e0636><p\x20data-v-dc0e0636>1000M</p></td><td\x20width=\x2234.6000%\x22\x20data-v-dc0e0636><p\x20data-v-dc0e0636>50M\x20</p></td></tr></tbody></table><p\x20data-v-dc0e0636>8、宽带速率与访问内容、所处互联网位置、路由情况、访问网站本身的网速性能等因素均有关系，任何一个环节都可能影响宽带速率。同时，宽带存在一定的网络自耗，可能不能完全达到其理论上下行速率。</p></div>",
                          0x2
                        ),
                      ]),
                    0x2
                  ),
                ]),
              ]),
              _0x55ec91["value"]
                ? (_0x62f5a5(),
                  _0x529bdf("div", M, [
                    _0x3fc8ae("div", { class: "popbox" }, [
                      _0x19aa87[0x5] ||
                        (_0x19aa87[0x5] = _0x3fc8ae(
                          "h3",
                          null,
                          "温馨提示",
                          -0x1
                        )),
                      _0x19aa87[0x6] ||
                        (_0x19aa87[0x6] = _0x3fc8ae(
                          "div",
                          { class: "user" },
                          [
                            _0x5e9b69("\x20尊敬的客户："),
                            _0x3fc8ae("br"),
                            _0x5e9b69(
                              "\x20您的手机号码当前已办理一条融合宽带（宽带套餐已生效或即将生效）。\x20"
                            ),
                          ],
                          -0x1
                        )),
                      _0x3fc8ae(
                        "div",
                        {
                          class: "confirm",
                          style: {
                            "margin-top": "0.6rem",
                            "font-size": ".3rem",
                          },
                          onClick: _0x4ff0b1,
                        },
                        "\x20使用本号码前往办理二条宽带\x20"
                      ),
                      _0x3fc8ae("div", {
                        class: "popup-close",
                        style: { "margin-top": "1.1rem" },
                        onClick: _0x25410c,
                      }),
                    ]),
                  ]))
                : _0x1ebca2("", !0x0),
              _0x219e5f(_0x3fc8ae("div", k, null, 0x200), [
                [_0x2db8cd, _0x149f33["value"]],
              ]),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-dc0e0636"]]
  );
export { f as default };
