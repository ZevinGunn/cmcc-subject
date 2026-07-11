import {
  r as e,
  f as t,
  B as a,
  c as s,
  k as n,
  C as l,
  D as c,
  m as i,
  q as o,
  E as u,
  F as d,
  G as r,
  H as p,
  I as v,
  J as _,
  K as m,
  l as g,
  w as h,
  L as y,
  M as w,
  N as b,
  O as I,
  P as f,
  Q as k,
  R as z,
  T as P,
  U as E,
  t as C,
  W as S,
  X as T,
  Y as x,
  Z as D,
  n as A,
  _ as L,
  $ as N,
  a0 as R,
  a1 as j,
  a2 as O,
  a3 as U,
  a4 as H,
} from "./vendor/static.gather.rQc4DgSB.js";
import {
  h as V,
  f as q,
  k as B,
  b as M,
  l as F,
  n as W,
  o as X,
  p as G,
  g as Y,
  w as Z,
  r as Q,
  s as K,
  t as J,
  v as $,
  x as ee,
  y as te,
  z as ae,
  A as se,
  B as ne,
  e as le,
  C as ce,
  D as ie,
  E as oe,
  F as ue,
  G as de,
  H as re,
  I as pe,
  J as ve,
  K as _e,
  L as me,
  M as ge,
  N as he,
  O as ye,
  P as we,
  Q as be,
  R as Ie,
  S as fe,
  T as ke,
  U as ze,
  V as Pe,
  W as Ee,
  X as Ce,
  Y as Se,
  Z as Te,
  _ as xe,
  $ as De,
  a0 as Ae,
  a1 as Le,
  a2 as Ne,
  a3 as Re,
  i as je,
  a4 as Oe,
  a5 as Ue,
  c as He,
  a6 as Ve,
  a7 as qe,
  a8 as Be,
  a9 as Me,
  aa as Fe,
  ab as We,
  ac as Xe,
  ad as Ge,
  j as Ye,
  ae as Ze,
  af as Qe,
  ag as Ke,
  ah as Je,
  ai as $e,
  aj as et,
  ak as tt,
  al as at,
  am as st,
} from "./vendor/hooks.DEWJMU6T.js";
import {
  _ as nt,
  p as lt,
  u as ct,
  c as it,
  x as ot,
  t as ut,
  f as dt,
  a as rt,
  i as pt,
  T as vt,
} from "./index.v6eDygJb.js";
import { L as _t } from "./vendor/lottie-web.C_QYx6Z4.js";
import {
  S as mt,
  A as gt,
  U as ht,
  a as yt,
  b as wt,
} from "./vendor/js.plugin.Db-L3WCG.js";
import { A as bt, b as It, a as ft } from "./vendor/json.BeDsP0r3.js";
import "./vendor/vconsole.Sr2s3mPh.js";
const kt = ["extinfo"],
  zt = ((e) => (p("data-v-5828e8fd"), (e = e()), v(), e))(() =>
    _(
      "button",
      {
        style: {
          position: "absolute",
          top: "0",
          left: "0",
          width: "100%",
          height: "100%",
        },
      },
      " 这是开放标签测试 ",
      -1
    )
  ),
  Pt = nt(
    {
      __name: "LaunchAppBtn",
      props: {
        // 微信开放标签拉端地址 特殊场景下需要单独配置链接
        wechatUrl: { type: String, default: "", required: !1 },
        launchUrl: {
          //一键拉端地址
          type: String,
          required: !0,
        },
        middleLaunchUrl: {
          //中间页拉端地址
          type: String,
          default:
            "https://h.app.coc.10086.cn/activity/transit/transferDownload.html",
        },
        functionCode: {
          // 按钮功能码
          type: String,
          default: "",
        },
        btnName: {
          // 按钮名称
          type: String,
          required: !0,
        },
        popName: {
          //弹窗的名字
          type: String,
          default: "",
        },
        btnPosition: {
          // 按钮位置
          type: String,
          default: "",
        },
        dataTrackType: {
          // 埋点类型   PopClick-弹窗按钮点击事件   ButtonClick-固定按钮点击事件
          type: String,
          default: "ButtonClick",
        },
        beforeJump: { type: Function, default: () => {} },
        launchWxUrl: {
          //微信小程序地址
          type: String,
          // default: 'https://mp.weixin.qq.com/s/x4xZZybgiwyevrn_8LBMrg'
          default: "https://mp.weixin.qq.com/s/dnnajjRWPiU31Ch8Rw2k4g",
        },
      },
      emits: ["launchSuccess", "launchError"],
      setup(p, { emit: v }) {
        const _ = p,
          { PopClick: m, ButtonClick: g } = M(),
          h = e(null),
          y = v,
          w = window.__env || V(),
          b = e(!0),
          I = e(),
          f = t(() =>
            _.wechatUrl
              ? _.wechatUrl
              : _.functionCode
              ? "functionCode=".concat(_.functionCode)
              : _.launchUrl
          );
        function k() {
          const e = E();
          if ("dlwmh" === w && b.value) {
            _.beforeJump && _.beforeJump();
            try {
              I.value.wakeup(I.value.options);
            } catch (t) {
              B(e.button_url);
            }
            y("launchSuccess");
          } else if ("app" === w)
            if (_.functionCode)
              try {
                window.cmcc.goNativePage({ bizCode: _.functionCode });
              } catch (t) {
                B(e.button_url);
              }
            else B(e.button_url);
          else
            try {
              B(e.button_url), y("launchSuccess");
            } catch (a) {
              y("launchError", a);
            }
        }
        function z() {
          localStorage.setItem("wxLaunchSuccess", "true"),
            E(),
            _.beforeJump && _.beforeJump(),
            y("launchSuccess");
        }
        function P() {
          _.beforeJump && _.beforeJump(),
            E(!1),
            y("launchError"),
            B(_.middleLaunchUrl);
        }
        function E(e = !0) {
          let t = {
            button_name: _.btnName,
            button_position: _.btnPosition || "",
            button_url: _.launchUrl,
            extend_attribute: "",
            page_touch_id: "",
            element_four_channel: "",
            button_type: "APP引流",
          };
          return (
            "wechat" === w
              ? (t.extend_attribute = e ? "微信拉端成功" : "微信拉端失败")
              : "app" === w
              ? (_.functionCode
                  ? (t.button_url = _.functionCode)
                  : (t.button_url = _.launchUrl),
                (t.page_touch_id = q("touch_id", t.button_url) || ""),
                (t.element_four_channel = q("channelId", t.button_url) || ""),
                (t.button_type = ""))
              : "alimini" === w || "alipay" === w
              ? (_.functionCode
                  ? (t.button_url = "pullAPP://functionCode=" + _.functionCode)
                  : (t.button_url = "pullAPP://url=" + _.launchUrl),
                (t.page_touch_id = q("touch_id", _.launchUrl) || ""),
                (t.element_four_channel = q("channelId", _.launchUrl) || ""))
              : "wxmini" === w
              ? ((t.button_url = _.launchWxUrl),
                (t.page_touch_id = q("touch_id", t.button_url) || ""),
                (t.element_four_channel = q("channelId", t.button_url) || ""))
              : ((t.button_url = _.middleLaunchUrl),
                (t.page_touch_id = q("touch_id", t.button_url) || ""),
                (t.element_four_channel = q("channelId", t.button_url) || "")),
            "PopClick" === _.dataTrackType
              ? ((t.window_id = ""),
                (t.window_name = _.popName),
                (t.window_type = t.button_type),
                delete t.button_type,
                m(t))
              : "ButtonClick" === _.dataTrackType && g(t),
            t
          );
        }
        return (
          a(() => {
            let e = {};
            ["pageId", "channelId", "sellerId", "extendId"].forEach((t) => {
              e[t] = q("".concat(t));
            });
            let t = { ...e };
            try {
              _.functionCode
                ? Object.assign(t, { functionCode: _.functionCode })
                : _.launchUrl
                ? Object.assign(t, { targetUrl: _.launchUrl })
                : Object.assign(t, { targetUrl: _.middleLaunchUrl });
            } catch (s) {}
            let a = {
              systemId: "1005",
              data: t,
              onReady: () => {},
              callback: () => {
                E(!1), (window.location.href = _.middleLaunchUrl);
              },
            };
            try {
              "dlwmh" === w && (I.value = new YdldInstall(a));
            } catch (n) {
              b.value = !1;
            }
          }),
          s(() => {}),
          (e, t) => (
            n(),
            l(
              "div",
              {
                class: "LaunchAppBtn",
                id: "LaunchAppBtn",
                onClick: r(k, ["stop"]),
              },
              [
                "wechat" === c(w)
                  ? (n(),
                    l(
                      "wx-open-launch-app",
                      {
                        key: 0,
                        class: "launch-app",
                        ref_key: "launchRef",
                        ref: h,
                        appid: "wxba9074d7f4eeae4e",
                        extinfo: f.value,
                        onLaunch: z,
                        onError: P,
                      },
                      [
                        (n(),
                        i(
                          u("script"),
                          { type: "text/wxtag-template" },
                          { default: o(() => [zt]), _: 1 }
                        )),
                      ],
                      40,
                      kt
                    ))
                  : d("", !0),
              ]
            )
          )
        );
      },
    },
    [["__scopeId", "data-v-5828e8fd"]]
  ),
  Et = (e) => (p("data-v-31fc8afb"), (e = e()), v(), e),
  Ct = { class: "dialog-content-top" },
  St = ["onClick"],
  Tt = { class: "dialog-content-tab" },
  xt = ["onClick"],
  Dt = { key: 0, class: "dialog-nonet" },
  At = Et(() => _("p", { class: "dialog-nonet-error" }, null, -1)),
  Lt = Et(() =>
    _("p", { class: "dialog-nonet-text" }, "网络异常，请刷新重试～", -1)
  ),
  Nt = { key: 0, class: "dialog-gift-item-type" },
  Rt = { key: 1, class: "dialog-gift-item-send" },
  jt = { key: 2, class: "dialog-gift-item-send" },
  Ot = { class: "dialog-gift-item-left" },
  Ut = ["src"],
  Ht = { key: 1 },
  Vt = { key: 0, class: "name" },
  qt = { key: 1, class: "subtitle" },
  Bt = { class: "dialog-gift-item-center" },
  Mt = { class: "title text-overflow" },
  Ft = { key: 0, class: "date" },
  Wt = { key: 1, class: "date" },
  Xt = Et(() => _("span", null, "距失效:", -1)),
  Gt = { key: 0 },
  Yt = { class: "time" },
  Zt = ["onClick"],
  Qt = { key: 0 },
  Kt = { key: 2, class: "dialog-none" },
  Jt = [
    Et(() => _("p", { class: "dialog-none-img" }, null, -1)),
    Et(() =>
      _("p", { class: "dialog-none-text" }, "暂无奖励，快去参与活动吧~", -1)
    ),
  ],
  $t = nt(
    {
      __name: "myPrizePop",
      setup(t) {
        const a = window.__env || V(),
          { PopExposure: s, PopClick: u } = M(),
          r = lt(),
          p = ct(),
          { currentTime: v, activityInfo: E, ifMid: C } = m(p),
          S = [
            { title: "全部", name: "all" },
            { title: "充值券", name: "fee" },
            { title: "出行券", name: "wuyou" },
            { title: "权益券", name: "qy" },
          ],
          T = [
            { name: "待使用", status: "UNUSED" },
            { name: "已使用", status: "USED" },
            { name: "已过期", status: "EXPIRED" },
          ],
          x = e(!1),
          D = e(),
          A = e(),
          L = e(!1),
          N = e("th"),
          R = e("UNUSED"),
          j = e("all"),
          O = ["yw", "benefit", "flow"],
          U = ["qy"],
          H = ["fee", "puzzle"],
          B = (e, t, a) => {
            e &&
              e.map((e) => {
                ["share", "power", "ch"].includes(e.prizeType) &&
                  (e.type = e.prizeType),
                  dt.includes(e.prizeType) && (e.prizeType = "fee"),
                  e.sendStatus.includes("可用") &&
                    ((e.tag = "hbTag"),
                    (e.xrlStatus = e.sendStatus),
                    (e.sendStatus = "UNUSED"));
                const t = { 1: "UNUSED", 6: "USED", 7: "EXPIRED" };
                switch (
                  (t[e.sendStatus] && (e.sendStatus = t[e.sendStatus]),
                  e.sendStatus)
                ) {
                  case "SENDED":
                    e.status = "USED";
                    break;
                  case "LOCKED":
                  case "TOLOOK":
                  case "TOSEND":
                    e.status = "UNUSED";
                    break;
                  default:
                    e.status = e.sendStatus;
                }
              });
            const s = e && e.filter((e) => e.status === t);
            (A.value =
              "all" === a
                ? s
                : "qt" === a
                ? s && s.filter((e) => O.includes(e.prizeType))
                : "fee" === a
                ? s && s.filter((e) => H.includes(e.prizeType))
                : "qy" === a
                ? s && s.filter((e) => U.includes(e.prizeType))
                : s && s.filter((e) => e.prizeType === a)),
              (x.value = !1);
          },
          ee = async (e = "UNUSED", t = "all") => {
            try {
              let { data: a, code: n } = await Y();
              if ("0" === n) {
                if (
                  ((D.value = a.prizeList),
                  B(a.prizeList, e, t),
                  a.sdc && 4 === S.length)
                ) {
                  let e = { title: "山东专属券", name: "sdc" };
                  S.splice(2, 0, e);
                }
              } else A.value = [];
              s({
                window_name: "我的奖品弹窗",
                button_name: "我的奖品弹窗_奖品名称_去使用",
              }),
                a.prizeList
                  ? (L.value = !1)
                  : ((L.value = !0),
                    s({
                      window_name: "我的奖品弹窗_异常",
                      button_name: "我的奖品弹窗_异常_点击刷新一下",
                    })),
                (x.value = !1),
                f();
            } catch (a) {
              f(),
                (x.value = !1),
                (L.value = !0),
                s({
                  window_name: "我的奖品弹窗_异常",
                  button_name: "我的奖品弹窗_异常_点击刷新一下",
                });
            }
          },
          te = ["sxzs", "hbzs", "hnzs", "cqzs", "hanzs"],
          ae = {
            sxzs: "陕西专属",
            hbzs: "湖北专属",
            hnzs: "湖南专属",
            cqzs: "重庆专属",
            hanzs: "海南专属",
          },
          se = (e) => ae[e] || "",
          ne = () => {
            const e = new Date(v.value);
            return e.setHours(24, 0, 0, 0), e.getTime() - v.value;
          },
          le = g.throttle(
            () => {
              (A.value = []), (x.value = !0), ee(R.value, j.value);
            },
            1500,
            { leading: !0, trailing: !1 }
          ),
          ce = () => {
            (x.value = !0),
              (L.value = !1),
              k({ message: "加载中..." }),
              u({
                window_name: "我的奖品弹窗_异常",
                button_name: "我的奖品弹窗_异常_点击刷新一下",
              }),
              ee();
          },
          ie = () => {
            r.openPrizePop(!1);
          },
          oe = g.throttle(
            async (e) => {
              var t, s, n;
              if ("TOSEND" === e.sendStatus) {
                const a = await F({
                  round: ""
                    .concat(
                      null !=
                        (s = null == (t = e.prizeId) ? void 0 : t.split("_")[1])
                        ? s
                        : "",
                      "_"
                    )
                    .concat(null != (n = e.seckillRound) ? n : ""),
                });
                u({
                  window_name: "我的礼包",
                  button_name: "我的礼包_充值券_去赠送",
                }),
                  r.posterDownLoadPop(!0, a.data, e),
                  ie();
              } else if ("wuyou" === e.prizeType) {
                const t = Z.app;
                u({
                  window_name: "我的奖品弹窗",
                  button_name: "必领好券_".concat(e.name, "_去使用"),
                  button_url: t,
                  page_touch_id: q("touch_id", t),
                  element_four_channel: q("channelId", t),
                  button_type: "app" != a ? "APP引流" : "",
                }),
                  W(!0)(t);
              } else if ("yw" === e.prizeType) {
                const t = e.jumpUrl;
                u({
                  window_name: "我的奖品弹窗",
                  button_name: "我的奖品弹窗_".concat(e.name, "_去使用"),
                  button_url: t,
                  page_touch_id: q("touch_id", t),
                  element_four_channel: q("channelId", t),
                  window_type: "营销点位",
                }),
                  t.includes("QWHD_YDRZ") ? W(!0)(t) : W(!1)(t);
              } else if ("qy" === e.prizeType) {
                const t = Q.app;
                u({
                  window_name: "我的奖品弹窗",
                  button_name: "必领好券_".concat(e.name, "_去使用"),
                  button_url: t,
                  page_touch_id: q("touch_id", t),
                  element_four_channel: q("channelId", t),
                  button_type: "app" != a ? "APP引流" : "",
                }),
                  W(!0)(t);
              }
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          ue = () => {
            r.openGuidePop(!0, !1),
              u({
                window_name: "我的奖品弹窗",
                button_name: "我的奖品弹窗_话费券使用指南",
              });
          },
          de = (e, t) => {
            var s;
            return it.includes(e.prizeId) ||
              ["LOCKED", "TOLOOK"].includes(e.sendStatus)
              ? K[null != t ? t : a]
              : "benefit" === e.prizeType
              ? J[null != t ? t : a]
              : "flow" === e.prizeType
              ? K[null != t ? t : a]
              : "qy" === e.prizeType
              ? Q[null != t ? t : a]
              : e.cardNo
              ? $(
                  null != t ? t : "app",
                  null == (s = E.value) ? void 0 : s.telNo,
                  e.cardNo
                )
              : K[null != t ? t : a];
          },
          re = (e) => {
            const t = new Set(ot),
              a = new Set(["TOSEND", "SENDED"]);
            return e.type
              ? ut[e.type]
              : t.has(e.prizeId)
              ? "新人专属券"
              : (e.sendStatus && a.has(e.sendStatus)) || e.from
              ? "充值立减"
              : ut[e.prizeType];
          };
        return (
          h(
            () => r.prizeShow,
            (e) => {
              e &&
                (r.prizeType && (N.value = r.prizeType),
                (R.value = "UNUSED"),
                (j.value = "all"),
                ee(R.value, j.value));
            }
          ),
          (e, t) => {
            const a = z,
              s = P;
            return (
              n(),
              i(
                s,
                {
                  show: c(r).prizeShow,
                  position: "bottom",
                  class: y(["dialog", "dialog" + c(C)]),
                },
                {
                  default: o(() => [
                    _(
                      "div",
                      { class: y(["dialog-content", R.value + "Bg"]) },
                      [
                        _("div", Ct, [
                          (n(),
                          l(
                            w,
                            null,
                            b(T, (e, t) =>
                              _(
                                "div",
                                {
                                  key: t,
                                  onClick: (t) =>
                                    ((e) => {
                                      (R.value = e.status),
                                        B(D.value, e.status, j.value);
                                    })(e),
                                },
                                I(R.value === e.status ? "" : e.name),
                                9,
                                St
                              )
                            ),
                            64
                          )),
                        ]),
                        _("div", Tt, [
                          (n(),
                          l(
                            w,
                            null,
                            b(S, (e, t) =>
                              _("div", { key: t }, [
                                _(
                                  "div",
                                  {
                                    class: y([
                                      "dialog-content-tab-item",
                                      [
                                        j.value === e.name ? "seleced" : "",
                                        e.name,
                                      ],
                                    ]),
                                    onClick: (t) =>
                                      ((e) => {
                                        (j.value = e.name),
                                          (A.value = []),
                                          (x.value = !0),
                                          B(D.value, R.value, e.name);
                                      })(e),
                                  },
                                  I(e.title),
                                  11,
                                  xt
                                ),
                              ])
                            ),
                            64
                          )),
                        ]),
                        L.value
                          ? (n(),
                            l("div", Dt, [
                              At,
                              Lt,
                              _(
                                "p",
                                { class: "dialog-nonet-refresh", onClick: ce },
                                "刷新一下"
                              ),
                            ]))
                          : A.value && A.value.length > 0
                          ? (n(),
                            l(
                              "div",
                              {
                                key: 1,
                                class: "dialog-gift",
                                onClick:
                                  t[0] ||
                                  (t[0] = (...t) =>
                                    e.contentClick && e.contentClick(...t)),
                              },
                              [
                                (n(!0),
                                l(
                                  w,
                                  null,
                                  b(A.value, (e, t) => {
                                    return (
                                      n(),
                                      l(
                                        "div",
                                        {
                                          key: t,
                                          class: y([
                                            "dialog-gift-item",
                                            { noDate: 0 === e.date },
                                          ]),
                                        },
                                        [
                                          _(
                                            "div",
                                            {
                                              class: y([
                                                "dialog-gift-item-tag",
                                                e.prizeType,
                                              ]),
                                            },
                                            I(re(e)),
                                            3
                                          ),
                                          ((s = e.leftShow),
                                          te.includes(s)
                                            ? (n(),
                                              l(
                                                "div",
                                                Nt,
                                                I(se(e.leftShow)),
                                                1
                                              ))
                                            : d("", !0)),
                                          e.from
                                            ? (n(),
                                              l(
                                                "div",
                                                Rt,
                                                " 尾号" +
                                                  I(e.from) +
                                                  "好友赠送 ",
                                                1
                                              ))
                                            : d("", !0),
                                          e.send
                                            ? (n(),
                                              l(
                                                "div",
                                                jt,
                                                " 已赠送至尾号" +
                                                  I(e.send) +
                                                  "好友 ",
                                                1
                                              ))
                                            : d("", !0),
                                          _("div", Ot, [
                                            "yw" === e.prizeType ||
                                            "qy" === e.prizeType
                                              ? (n(),
                                                l(
                                                  "img",
                                                  {
                                                    key: 0,
                                                    src: e.img,
                                                    class: "img",
                                                  },
                                                  null,
                                                  8,
                                                  Ut
                                                ))
                                              : (n(),
                                                l("div", Ht, [
                                                  e.shortName
                                                    ? (n(),
                                                      l("div", Vt, [
                                                        _(
                                                          "span",
                                                          null,
                                                          I(
                                                            c(X)(e.shortName)[0]
                                                          ),
                                                          1
                                                        ),
                                                        _(
                                                          "span",
                                                          null,
                                                          I(
                                                            c(X)(e.shortName)[1]
                                                          ),
                                                          1
                                                        ),
                                                      ]))
                                                    : d("", !0),
                                                  "UNUSED" === e.status
                                                    ? (n(),
                                                      l(
                                                        "div",
                                                        qt,
                                                        I(e.subTitle),
                                                        1
                                                      ))
                                                    : d("", !0),
                                                ])),
                                          ]),
                                          _("div", Bt, [
                                            _(
                                              "div",
                                              Mt,
                                              I(
                                                ["TOSEND", "SENDED"].includes(
                                                  e.sendStatus
                                                ) || e.from
                                                  ? "好友福利券"
                                                  : e.name
                                              ),
                                              1
                                            ),
                                            e.countdown &&
                                            "TOLOOK" === e.sendStatus
                                              ? (n(),
                                                l("div", Ft, " 次月1-5日可用 "))
                                              : e.countdown &&
                                                "UNUSED" === e.status
                                              ? (n(),
                                                l("div", Wt, [
                                                  Xt,
                                                  e.countdown.includes("天")
                                                    ? (n(),
                                                      l(
                                                        "div",
                                                        Gt,
                                                        I(e.countdown),
                                                        1
                                                      ))
                                                    : (n(),
                                                      i(
                                                        a,
                                                        {
                                                          key: 1,
                                                          time: ne(),
                                                          onFinish: c(le),
                                                        },
                                                        null,
                                                        8,
                                                        ["time", "onFinish"]
                                                      )),
                                                ]))
                                              : d("", !0),
                                            _(
                                              "div",
                                              Yt,
                                              "获取时间：" + I(e.getTime),
                                              1
                                            ),
                                          ]),
                                          _(
                                            "div",
                                            {
                                              class: y([
                                                "dialog-gift-item-right",
                                                [
                                                  e.sendStatus,
                                                  e.tag,
                                                  "fee" === e.prizeType &&
                                                  "UNUSED" === e.sendStatus &&
                                                  c(G)
                                                    ? "proWxUnUse"
                                                    : "",
                                                ],
                                              ]),
                                              onClick: (t) => c(oe)(e),
                                            },
                                            [
                                              e.xrlStatus
                                                ? (n(),
                                                  l(
                                                    "div",
                                                    Qt,
                                                    I(e.xrlStatus),
                                                    1
                                                  ))
                                                : [
                                                    "UNUSED",
                                                    "LOCKED",
                                                    "TOLOOK",
                                                  ].includes(e.sendStatus) &&
                                                  !c(G) &&
                                                  "wuyou" !== e.prizeType &&
                                                  "yw" !== e.prizeType &&
                                                  "qy" !== e.prizeType
                                                ? (n(),
                                                  i(
                                                    c(Pt),
                                                    {
                                                      key: 1,
                                                      "launch-url": de(e),
                                                      "middle-launch-url": de(
                                                        e,
                                                        "middleLaunchUrl"
                                                      ),
                                                      "pop-name":
                                                        "我的奖品弹窗",
                                                      "data-track-type":
                                                        "PopClick",
                                                      "btn-name":
                                                        "我的奖品弹窗_".concat(
                                                          e.name,
                                                          "_去使用"
                                                        ),
                                                    },
                                                    null,
                                                    8,
                                                    [
                                                      "launch-url",
                                                      "middle-launch-url",
                                                      "btn-name",
                                                    ]
                                                  ))
                                                : d("", !0),
                                            ],
                                            10,
                                            Zt
                                          ),
                                        ],
                                        2
                                      )
                                    );
                                    var s;
                                  }),
                                  128
                                )),
                              ]
                            ))
                          : x.value
                          ? d("", !0)
                          : (n(), l("div", Kt, Jt)),
                        A.value && A.value.length > 0
                          ? (n(),
                            l("div", {
                              key: 3,
                              class: "dialog-content-guide",
                              onClick: ue,
                            }))
                          : d("", !0),
                      ],
                      2
                    ),
                    _("div", { class: "dialog-close", onClick: ie }),
                  ]),
                  _: 1,
                },
                8,
                ["show", "class"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-31fc8afb"]]
  ),
  ea = { key: 0, class: "cd" },
  ta = { class: "cd-main-pic" },
  aa = ["src"],
  sa = { class: "cd-main-text" },
  na = nt(
    {
      __name: "Countdown",
      setup(a) {
        let c = null,
          i = Symbol("TIMMING"),
          o = Symbol("ERROR"),
          u = Symbol("FINISH_SUCCESS"),
          r = Symbol("FINISH_ERROR");
        const p = e({}),
          v = e(3),
          m = e(!1),
          g = e(i),
          h = t(() => g.value === o || g.value === u || g.value === r),
          y = t(() =>
            g.value === o
              ? "任务异常"
              : g.value === i
              ? "浏览".concat(v.value, "s，完成任务")
              : g.value === u
              ? p.value.finishDesc
              : g.value === r
              ? p.value.errorDesc
              : void 0
          );
        async function w() {
          clearInterval(c);
          let e = null;
          try {
            e = await (function () {
              const e = { cToken: p.value.cToken };
              return ee("/api/open/_pub/task/openFinish", e);
            })();
          } catch (t) {
            g.value = r;
          }
          "SUCCESS" === (null == e ? void 0 : e.code)
            ? (g.value = u)
            : (g.value = r);
        }
        async function b() {
          let e = "";
          const t = q("taskToken");
          if (t) e = t;
          else {
            const t = q("jtToken");
            t && (e = t);
          }
          if (!e) return;
          m.value = !0;
          let a = null;
          try {
            a = await (function (e) {
              return ee("/api/open/_pub/task/getOneTaskInfo", { jtToken: e });
            })(e);
          } catch (s) {
            g.value = o;
          }
          "SUCCESS" === (null == a ? void 0 : a.code)
            ? ((p.value = a.data),
              (v.value = parseInt(p.value.scanTime)),
              c && clearInterval(c),
              (c = setInterval(() => {
                let e = v.value - 1;
                e <= 0 ? w() : (v.value = e);
              }, 1e3)))
            : (g.value = o);
        }
        function f() {
          if (g.value === i) k(p.value.unfinishedPageToast);
          else {
            const e = p.value.backUrl;
            if (!e) return;
            "alimini" == window.__env || "alipay" == window.__env
              ? (window.location.href = e)
              : B(e);
          }
        }
        function z() {
          m.value = !1;
        }
        return (
          s(() => {
            b();
          }),
          E(() => {
            c && clearInterval(c);
          }),
          (e, t) =>
            m.value
              ? (n(),
                l("div", ea, [
                  _("div", { class: "cd-main", onClick: f }, [
                    _("div", ta, [
                      _("img", { src: p.value.iconUrl, alt: "" }, null, 8, aa),
                    ]),
                    _("div", sa, I(y.value), 1),
                  ]),
                  h.value
                    ? (n(), l("div", { key: 0, class: "cd-close", onClick: z }))
                    : d("", !0),
                ]))
              : d("", !0)
        );
      },
    },
    [["__scopeId", "data-v-34c0c089"]]
  ),
  { img: la, img2: ca } = te();
class ia {
  // 检查系统通知权限开关状态
  static getPermissionStatus() {
    return new Promise((e, t) => {
      try {
        window.cmcc.checkNotificationEnabled({
          debug: !1,
          success: (t) => {
            e(t.notificationEnabled);
          },
          error: (e) => {
            t(e);
          },
        });
      } catch (a) {}
    });
  }
  // 申请开启系统通知权限弹窗
  static showRequesPop() {
    try {
      window.cmcc.showRequestNotificationDialog({
        debug: !1,
        success: function (e) {},
        error: function (e) {},
      });
    } catch (e) {}
  }
  // 从app跳转微信小程序订阅
  static subTask(e, t) {
    window.cmcc.openMiniProgram({
      debug: !1,
      wx: {
        //微信小程序
        userName: "gh_3400f59b94d0",
        //小程序的username
        path: "/subPackageB/activity/rechargeDate/index?subPageId=PG20241014003&phone="
          .concat(e, "&stoken=")
          .concat(t),
        //打开小程序指定页面路径
        miniProgramType: "0",
      },
      success: function (e) {},
      error: function (e) {},
    });
  }
  //  微信小程序内跳转订阅
  static wxSubTask(e, t) {
    window.wx.miniProgram.navigateTo({
      url: "/subPackageB/activity/rechargeDate/index?subPageId=PG20241014005&phone="
        .concat(e, "&stoken=")
        .concat(t),
    });
  }
  // 端内原生编码跳转, 默认跳充值中心
  static goNativePage(e = "CN00052") {
    window.cmcc.goNativePage({
      debug: !1,
      bizCode: e,
      //功能编码，详见“客户端功能编码”
      success: function (e) {},
      error: function (e) {},
    });
  }
  // 分享好友 >9.5
  static quickShare(e, t, a) {
    return new Promise((s) => {
      try {
        window.cmcc.quickShare({
          debug: !1,
          title: e,
          //分享标题 -必传(V4.3变更)
          link: t,
          //分享链接,参数中如果有中文，需要对参数进行编码 -必传(V4.3变更)
          imgUrl: 1 === a ? ca : la,
          //分享图标 -必传(V4.3变更)
          content:
            "独乐乐不如众乐乐，领取好友赠送的话费券，先到先得，一起来薅移动羊毛！",
          //分享内容 -必传(V4.3变更)
          funCode: "",
          // 功能编码-V3.8新加
          stepId: "",
          // 步骤ID-V3.8新加
          shareChannel: "1",
          //分享渠道 -必传 9.5新增  0: 微信朋友圈，1:微信好友，2:新浪微博，,4: QQ，5: QQ空间
          shareType: "2",
          //分享类型 -必传 9.5新增   1：纯图   2：图文、视频、移动小程序 3：小程序（微信小程序）
          success: function (e) {
            s(e);
          },
          error: function (e) {
            s("");
          },
        });
      } catch (n) {}
    });
  }
  // 分享好友 <9.5
  static shareMessage(e, t, a) {
    return new Promise((s) => {
      try {
        window.cmcc.shareMessage({
          debug: !1,
          title: e,
          //分享标题 -必传(V4.3变更)
          link: t,
          //分享链接,参数中如果有中文，需要对参数进行编码 -必传(V4.3变更)
          imgUrl: 1 === a ? ca : la,
          //分享图标 -必传(V4.3变更)
          content:
            "独乐乐不如众乐乐，领取好友赠送的话费券，先到先得，一起来薅移动羊毛！",
          //分享内容 -必传(V4.3变更)
          type: "",
          //分享类型,music、video或link，不填默认为link (ios只支持link)
          dataUrl: "",
          //如果type是music或video，则要提供数据链接，默认为空
          funCode: "",
          // 功能编码-V3.8新加
          stepId: "",
          // 步骤ID-V3.8新加
          shareChannelArray: ["1"],
          // 分享渠道列表，默认不传-5.0新增   5.1 新增快照选项，⚠️5.2修改： 建议截屏长度不超过5屏
          //-3: 微信快照, -2:朋友圈快照, -1:保存快照到相册, 0: 微信朋友圈, 1:微信好友, 2:新浪微博, 3:二维码,4：QQ, 5：QQ空间, 6：短信, 7: 更多
          qrCodeUrl: "",
          //活动URL，客户端负责转成二维码图片（截屏分享才有）5.2 新增
          success: function (e) {
            s(e);
          },
          error: function (e) {
            s("");
          },
        });
      } catch (n) {}
    });
  }
  // 实时活动
  static handleDynamicIslandMessage(e, t) {
    return new Promise(() => {
      try {
        window.cmcc.handleDynamicIslandMessage({
          debug: !1,
          pushId: "02",
          //推送类型，String类型，必填，01为实时推送，02为预约推送
          templateId: "03",
          //模版类型，String类型，必填，
          businessId: ["991", "891"].includes(t)
            ? "rAPQEg6T1024101716"
            : "6tifPnoa1024101716",
          //业务活动id，String类型，必填
          operateStatus: e,
          //操作类型，String类型，必填  'start' | 'update' | 'end' | 'subscribe'
          ext: '{"isDurable":"1"}',
          // 1长期活动 0 短期活动
          success: function (e) {},
          error: function (e) {},
        });
      } catch (a) {}
    });
  }
}
const oa = { key: 0, class: "swiper" },
  ua = ["src", "onClick"],
  da = {
    __name: "actSwiper",
    setup(t) {
      const a = window.__env || V(),
        { ButtonExposure: u, ButtonClick: r } = M(),
        p = e([]),
        v = g.throttle(
          (e) => {
            let t = "app" === a ? e.url || e.nativeCode : e.dwUrl || "";
            r({
              button_name: "底部广告位_".concat(e.title, "_banner"),
              button_url: t,
              page_touch_id: q("touch_id", t),
              element_four_channel: q("channelId", t),
            }),
              e.nativeCode && "app" === a
                ? ia.goNativePage(e.nativeCode)
                : W(!0)(t);
          },
          1e3,
          { leading: !0, trailing: !1 }
        );
      return (
        s(() => {
          (async () => {
            const e = await ae();
            if ("0" === e.code && e.data) {
              p.value = e.data.banners;
              let t = p.value[0],
                s = "app" === a ? t.url || t.nativeCode : t.dwUrl || "";
              u({
                button_name: "底部广告位_".concat(t.title, "_banner"),
                button_url: s,
                page_touch_id: q("touch_id", s),
                element_four_channel: q("channelId", s),
              });
            }
          })();
        }),
        (e, t) => {
          var a;
          const s = S,
            u = T;
          return (null == (a = p.value) ? void 0 : a.length)
            ? (n(),
              l("div", oa, [
                C(
                  u,
                  {
                    autoplay: 3e3,
                    "lazy-render": "",
                    "show-indicators": p.value.length > 1,
                  },
                  {
                    default: o(() => [
                      (n(!0),
                      l(
                        w,
                        null,
                        b(
                          p.value,
                          (e, t) => (
                            n(),
                            i(
                              s,
                              { key: t },
                              {
                                default: o(() => [
                                  _(
                                    "img",
                                    { src: e.img, onClick: (t) => c(v)(e) },
                                    null,
                                    8,
                                    ua
                                  ),
                                ]),
                                _: 2,
                              },
                              1024
                            )
                          )
                        ),
                        128
                      )),
                    ]),
                    _: 1,
                  },
                  8,
                  ["show-indicators"]
                ),
              ]))
            : d("", !0);
        }
      );
    },
  },
  ra = nt(da, [["__scopeId", "data-v-35ecb262"]]),
  pa = (e) => (p("data-v-0aeed302"), (e = e()), v(), e),
  va = pa(() => _("span", null, "京ICP备05002571", -1)),
  _a = {
    __name: "beiAnHao",
    setup(t) {
      const a = ct(),
        { currentTime: c } = m(a),
        i = e(""),
        o = () => {
          W()(se);
        };
      return (
        s(() => {
          c.value
            ? (i.value = new Date(c.value).getFullYear())
            : (i.value = new Date().getFullYear());
        }),
        (e, t) => (
          n(),
          l("div", { class: "text", onClick: o }, [
            x(" Copyright©" + I(i.value) + " 中国移动 备案号：", 1),
            va,
          ])
        )
      );
    },
  },
  ma = nt(_a, [["__scopeId", "data-v-0aeed302"]]),
  ga = (e) => (p("data-v-a86f15e1"), (e = e()), v(), e),
  ha = { key: 0 },
  ya = { key: 0, class: "success-card" },
  wa = { key: 0, class: "success-card-title" },
  ba = { class: "highlight" },
  Ia = { key: 1, class: "thMillion-title" },
  fa = ["src"],
  ka = { class: "success-card-prize-text" },
  za = { class: "success-card-prize-price" },
  Pa = { class: "success-card-prize-text" },
  Ea = { key: 0, class: "tag" },
  Ca = { class: "title" },
  Sa = ga(() => _("span", null, "￥", -1)),
  Ta = { class: "outer" },
  xa = { key: 0, class: "usable" },
  Da = { class: "text" },
  Aa = { key: 1, class: "active" },
  La = { key: 5, class: "success-card-scripts" },
  Na = { key: 6, class: "success-card-date" },
  Ra = { key: 7, class: "success-card-msg" },
  ja = { key: 1, class: "imgNotEnoughText" },
  Oa = { key: 3, class: "pop-network" },
  Ua = {
    __name: "receivePop",
    props: {
      popShow: { type: Boolean, default: !1 },
      // 邀请奖励invite, 无忧行wy, 卡券激活activate, 湖北新人礼hb, 陕西新人礼sx, 湖南新人礼hn, 庆三亿模块thMillion，重庆cq，海南han
      popUpType: { type: String, default: "" },
      // 领取接口参数
      popParam: { type: String, default: "" },
      // 特殊：是否为初始奖品
      isInitPrize: { type: Boolean, default: !1 },
    },
    emits: ["requestAgain", "closePop"],
    setup(a, { emit: s }) {
      const { PopExposure: u, PopClick: r } = M(),
        p = window.__env || V(),
        v = ct(),
        { activityInfo: f, userInfo: k } = m(v),
        z = e(!0),
        E = e(ne.app),
        C = e(ne.middleLaunchUrl),
        S = e("95折拼图碎片数量全部大于0才可以领取！"),
        T = a,
        D = e(null),
        A = e(),
        L = e(),
        N = e(),
        R = e([]),
        j = e(!1),
        O = e(!1),
        U = s,
        H = ["hb", "hn", "sx", "han"],
        B = t(() => H.includes(T.popUpType)),
        F = t(() => ["hb", "hn"].includes(T.popUpType)),
        G = t(
          () =>
            "success" === D.value &&
            ["wy", "thMillion", "cq", "year26Prize"].includes(T.popUpType)
        ),
        Y = {
          sxzs: "陕西专属",
          hbzs: "湖北专属",
          hnzs: "湖南专属",
          cqzs: "重庆专属",
          hanzs: "海南专属",
        },
        K = le[k.value.group] || le.default,
        J = () => {
          var e;
          return null !=
            (e = {
              invite: "拼图模块_",
              wy: "必领好券模块_",
              activate: "",
              sx: "陕西专属_话费充值券_",
              hb: "湖北新人礼充值券_",
              hn: "湖南新人礼充值券_",
              thMillion: "庆3亿领88元话费_",
              cq: "重庆专属_充值加赠券_",
              han: "海南专属_话费加赠券_",
              year26Prize: "抽奖模块_",
            }[T.popUpType])
            ? e
            : "";
        },
        ee = e(),
        te = g.throttle(
          async (e) => {
            try {
              const t = {
                  sx: ce,
                  hb: ie,
                  hn: oe,
                  cq: ue,
                  han: de,
                  year26Prize: re,
                  activate: () => pe({ prizeId: T.popParam }),
                  thMillion: () => ve({ prizeId: T.popParam }),
                  wy: () => _e({ round: T.popParam }),
                  // default: () => receiveInvite({ round: props.popParam })
                  default: () => me({ round: T.popParam }),
                },
                a = t[T.popUpType] || t.default,
                s = T.isInitPrize
                  ? await ge({ prizeId: T.popParam })
                  : await a();
              "0" === s.code
                ? ((D.value = "success"),
                  B.value
                    ? ((R.value = s.data.actPrize),
                      (j.value = s.data.labelShow),
                      (E.value = $(
                        "app",
                        f.value.telNo,
                        s.data.actPrize[0].cardNo
                      )),
                      (C.value = $(
                        "middleLaunchUrl",
                        f.value.telNo,
                        s.data.actPrize[0].cardNo
                      )),
                      (ee.value = s.data.actPrize.reduce(
                        (e, t) => e + parseFloat(t.shortName),
                        0
                      )),
                      (N.value = ""
                        .concat(J(), "领取成功弹窗_")
                        .concat(A.value ? "".concat(A.value, "_") : "")
                        .concat(
                          "year26Prize" === T.popUpType
                            ? ""
                            : ["sx", "han", "year26Prize"].includes(T.popUpType)
                            ? "开心收下"
                            : "去使用"
                        )),
                      u({
                        window_name: "".concat(J(), "领取成功弹窗_").concat(K),
                        button_name: N.value + "_".concat(K),
                      }))
                    : "activate" === T.popUpType ||
                      "invite" === T.popUpType ||
                      "thMillion" === T.popUpType ||
                      "cq" === T.popUpType ||
                      "year26Prize" === T.popUpType
                    ? ((L.value = s.data.actPrizes[0]),
                      (A.value = L.value.shortName + L.value.prizeName),
                      (j.value = "cq" === T.popUpType || s.data.labelShow),
                      (E.value = $("app", f.value.telNo, L.value.cardNo)),
                      (C.value = $(
                        "middleLaunchUrl",
                        f.value.telNo,
                        L.value.cardNo
                      )),
                      (N.value = ""
                        .concat(J(), "领取成功弹窗_")
                        .concat(A.value ? "".concat(A.value, "_") : "")
                        .concat(
                          "year26Prize" === T.popUpType
                            ? ""
                            : ["sx", "han", "year26Prize"].includes(T.popUpType)
                            ? "开心收下"
                            : "去使用"
                        )),
                      u({
                        window_name: "".concat(J(), "领取成功弹窗_").concat(K),
                        button_name: N.value + "_".concat(K),
                      }))
                    : "wy" === T.popUpType &&
                      ((L.value = s.data),
                      (N.value = ""
                        .concat(J(), "领取成功弹窗_")
                        .concat(A.value ? "".concat(A.value, "_") : "")
                        .concat(
                          "year26Prize" === T.popUpType
                            ? ""
                            : ["sx", "han", "year26Prize"].includes(T.popUpType)
                            ? "开心收下"
                            : "去使用"
                        )),
                      u({
                        window_name: ""
                          .concat(J(), "领取成功弹窗_")
                          .concat(L.value.prizeName, "_")
                          .concat(L.value.shortName, "_")
                          .concat(K),
                        button_name: N.value + "_".concat(K),
                      })),
                  (O.value = !0))
                : "160002" == s.code
                ? ((D.value = "noStock"),
                  u({
                    window_name: ""
                      .concat(J(), "领取失败弹窗_无库存_")
                      .concat(K),
                    button_name: "已领完",
                  }),
                  (O.value = !0))
                : "160205" == s.code
                ? ((D.value = "imgNotEnough"),
                  (S.value = s.msg),
                  u({
                    window_name: ""
                      .concat(J(), "领取失败弹窗_拼图碎片数量不足_")
                      .concat(K),
                    button_name: "我知道了",
                  }),
                  (O.value = !0))
                : ((D.value = e ? "failed-again" : "failed"),
                  u({
                    window_name: ""
                      .concat(J(), "领取失败弹窗_网络限流_")
                      .concat(K),
                    button_name: ""
                      .concat(J(), "领取失败弹窗_立即重试_")
                      .concat(K),
                  }),
                  (O.value = !0)),
                (z.value = !0);
            } catch (t) {
              (D.value = e ? "failed-again" : "failed"),
                (z.value = !0),
                (O.value = !0);
            }
          },
          1e3,
          { leading: !0, trailing: !1 }
        ),
        ae = () => {
          U("closePop", T.popUpType);
        },
        se = () => {
          r({
            window_name: "".concat(J(), "领取成功弹窗"),
            button_name: "".concat(J(), "开心收下"),
          }),
            ae();
        },
        he = () => {
          r({
            window_name: "".concat(J(), "领取成功弹窗"),
            button_name: ""
              .concat(J(), "领取成功弹窗_")
              .concat(A.value, "_我知道了"),
          }),
            ae();
        },
        ye = g.throttle(
          () => {
            if ("failed" === D.value)
              (z.value = !1),
                te("p"),
                r({
                  window_name: ""
                    .concat(J(), "_领取失败弹窗_网络限流_")
                    .concat(K),
                  button_name: ""
                    .concat(J(), "_领取失败弹窗_立即重试_")
                    .concat(K),
                });
            else if ("success" === D.value && L.value.img) {
              const e = Q["app" == p ? "app" : "dlwmh"];
              r({
                window_name: "出行无忧行_领取成功弹窗_",
                button_name: "出行无忧行_领取成功弹窗_立即使用",
                button_url: e,
                page_touch_id: q("touch_id", e),
                element_four_channel: q("channelId", e),
                window_type: "app" != p ? "APP引流" : "",
              }),
                W(!0)(e),
                ae();
            } else if ("success" === D.value) {
              const e = Z.app;
              r({
                window_name: "出行无忧行_领取成功弹窗_",
                button_name: "出行无忧行_领取成功弹窗_立即使用",
                button_url: e,
                page_touch_id: q("touch_id", e),
                element_four_channel: q("channelId", e),
                window_type: "app" != p ? "APP引流" : "",
              }),
                W(!0)(e),
                ae();
            }
          },
          1e3,
          { leading: !0, trailing: !1 }
        );
      return (
        h(
          () => T.popShow,
          (e) => {
            e && ((D.value = ""), (L.value = ""), (R.value = []), te());
          }
        ),
        (e, t) => {
          const s = Pt,
            u = P;
          return z.value
            ? (n(),
              l("div", ha, [
                (n(),
                i(
                  u,
                  { key: a.popUpType, show: a.popShow },
                  {
                    default: o(() => [
                      _(
                        "div",
                        {
                          class: y([
                            "pop",
                            "".concat(a.popUpType, "Bg"),
                            "".concat(D.value, "-bg"),
                          ]),
                        },
                        [
                          "success" == D.value
                            ? (n(),
                              l("div", ya, [
                                B.value
                                  ? (n(),
                                    l("div", wa, [
                                      x(" 恭喜您获得"),
                                      _("span", ba, I(ee.value), 1),
                                      x("元话费券包 "),
                                    ]))
                                  : "thMillion" === a.popUpType ||
                                    "cq" === a.popUpType
                                  ? (n(), l("div", Ia, " 奖励领取成功 "))
                                  : d("", !0),
                                L.value.img
                                  ? (n(),
                                    l(
                                      "div",
                                      {
                                        key: 2,
                                        class: y([
                                          "success-card-prize",
                                          "".concat(a.popUpType, "CardBenefit"),
                                        ]),
                                      },
                                      [
                                        _(
                                          "img",
                                          {
                                            class: "success-card-prize-icon",
                                            src: L.value.img,
                                          },
                                          null,
                                          8,
                                          fa
                                        ),
                                        _("div", ka, [
                                          _(
                                            "p",
                                            null,
                                            I(L.value.prizeName) +
                                              I(L.value.shortName),
                                            1
                                          ),
                                        ]),
                                      ],
                                      2
                                    ))
                                  : L.value
                                  ? (n(),
                                    l(
                                      "div",
                                      {
                                        key: 3,
                                        class: y([
                                          "success-card-prize",
                                          "".concat(a.popUpType, "Card"),
                                        ]),
                                      },
                                      [
                                        _("div", za, [
                                          _(
                                            "span",
                                            null,
                                            I(c(X)(L.value.shortName)[0]),
                                            1
                                          ),
                                          _(
                                            "span",
                                            null,
                                            I(c(X)(L.value.shortName)[1]),
                                            1
                                          ),
                                        ]),
                                        _("div", Pa, [
                                          _(
                                            "p",
                                            {
                                              class: y(
                                                "".concat(a.popUpType, "Text")
                                              ),
                                            },
                                            I(L.value.prizeName),
                                            3
                                          ),
                                          _("p", null, I(L.value.subTitle), 1),
                                        ]),
                                      ],
                                      2
                                    ))
                                  : d("", !0),
                                R.value.length
                                  ? (n(),
                                    l(
                                      "div",
                                      {
                                        key: 4,
                                        class: y([
                                          "success-card-list",
                                          "list"
                                            .concat(a.popUpType)
                                            .concat(R.value.length),
                                        ]),
                                      },
                                      [
                                        (n(!0),
                                        l(
                                          w,
                                          null,
                                          b(R.value, (e, t) => {
                                            return (
                                              n(),
                                              l(
                                                "div",
                                                {
                                                  key: t,
                                                  class: y([
                                                    "success-card-list-item",
                                                    [
                                                      "".concat(
                                                        a.popUpType,
                                                        "-item"
                                                      ),
                                                      F.value
                                                        ? "hb-item".concat(t)
                                                        : "",
                                                    ],
                                                  ]),
                                                },
                                                [
                                                  e.leftShow
                                                    ? (n(),
                                                      l(
                                                        "div",
                                                        Ea,
                                                        I(
                                                          ((s = e.leftShow),
                                                          Y[s] || "")
                                                        ),
                                                        1
                                                      ))
                                                    : d("", !0),
                                                  _("div", Ca, [
                                                    Sa,
                                                    _(
                                                      "span",
                                                      null,
                                                      I(c(X)(e.shortName)[0]),
                                                      1
                                                    ),
                                                  ]),
                                                  _("div", Ta, [
                                                    e.sendStatus.includes(
                                                      "可用"
                                                    ) && F.value
                                                      ? (n(),
                                                        l(
                                                          "span",
                                                          xa,
                                                          I(e.sendStatus),
                                                          1
                                                        ))
                                                      : d("", !0),
                                                    _(
                                                      "div",
                                                      Da,
                                                      I(e.prizeName),
                                                      1
                                                    ),
                                                    e.sendStatus.includes(
                                                      "可用"
                                                    ) &&
                                                    ["sx", "han"].includes(
                                                      a.popUpType
                                                    )
                                                      ? (n(),
                                                        l(
                                                          "span",
                                                          Aa,
                                                          I(e.sendStatus),
                                                          1
                                                        ))
                                                      : d("", !0),
                                                  ]),
                                                ],
                                                2
                                              )
                                            );
                                            var s;
                                          }),
                                          128
                                        )),
                                      ],
                                      2
                                    ))
                                  : d("", !0),
                                R.value.length
                                  ? (n(),
                                    l("div", La, I(R.value[0].subTitle), 1))
                                  : d("", !0),
                                G.value
                                  ? (n(), l("div", Na, "预计24小时内到账"))
                                  : d("", !0),
                                j.value ? (n(), l("div", Ra)) : d("", !0),
                              ]))
                            : "imgNotEnough" == D.value
                            ? (n(), l("div", ja, I(S.value), 1))
                            : (n(),
                              l(
                                "div",
                                {
                                  key: 2,
                                  class: y(["".concat(D.value, "-card")]),
                                },
                                null,
                                2
                              )),
                          "failed" == D.value
                            ? (n(), l("div", Oa, "网络异常，请稍后重试~"))
                            : d("", !0),
                          "success" == D.value &&
                          ["sx", "han", "year26Prize"].includes(a.popUpType)
                            ? (n(),
                              l("div", {
                                key: 4,
                                class: "accept-btn",
                                onClick: se,
                              }))
                            : "success" == D.value &&
                              "thMillion" === a.popUpType
                            ? (n(),
                              l("div", {
                                key: 5,
                                class: "know-btn",
                                onClick: he,
                              }))
                            : "imgNotEnough" == D.value
                            ? (n(),
                              l("div", {
                                key: 6,
                                class: "know-btn1",
                                onClick: he,
                              }))
                            : (n(),
                              l(
                                "div",
                                {
                                  key: 7,
                                  class: y([
                                    "pop-btn",
                                    "".concat(D.value, "-btn"),
                                    "".concat(a.popUpType, "-btn"),
                                  ]),
                                  onClick:
                                    t[0] ||
                                    (t[0] = (...e) => c(ye) && c(ye)(...e)),
                                },
                                [
                                  "success" == D.value && "wy" !== a.popUpType
                                    ? (n(),
                                      i(
                                        s,
                                        {
                                          key: 0,
                                          "launch-url": E.value,
                                          "middle-launch-url": C.value,
                                          "pop-name": "".concat(
                                            J(),
                                            "领取成功弹窗"
                                          ),
                                          "data-track-type": "PopClick",
                                          "btn-name": N.value,
                                        },
                                        null,
                                        8,
                                        [
                                          "launch-url",
                                          "middle-launch-url",
                                          "pop-name",
                                          "btn-name",
                                        ]
                                      ))
                                    : d("", !0),
                                ],
                                2
                              )),
                        ],
                        2
                      ),
                      O.value
                        ? (n(),
                          l("div", { key: 0, class: "close", onClick: ae }))
                        : d("", !0),
                    ]),
                    _: 1,
                  },
                  8,
                  ["show"]
                )),
              ]))
            : d("", !0);
        }
      );
    },
  },
  Ha = nt(Ua, [["__scopeId", "data-v-a86f15e1"]]),
  Va = (e) => (p("data-v-d1ffe072"), (e = e()), v(), e),
  qa = { key: 0, class: "cq" },
  Ba = { class: "cq-top" },
  Ma = Va(() => _("div", { class: "cq-top-title" }, "重庆专属优惠", -1)),
  Fa = { class: "cq-content" },
  Wa = Va(() => _("div", { class: "cq-content-tag" }, null, -1)),
  Xa = { class: "cq-content-price" },
  Ga = Va(() => _("span", null, "￥", -1)),
  Ya = { class: "cq-content-text" },
  Za = { key: 1 },
  Qa = { key: 2 },
  Ka = { key: 3, class: "wrapper" },
  Ja = Va(() => _("span", null, "去使用", -1)),
  $a = Va(() =>
    _(
      "div",
      { class: "cq-tips" },
      [_("span", null, "Tips"), x("快邀请您的亲友薅羊毛~ ")],
      -1
    )
  ),
  es = {
    __name: "cqFloor",
    setup(a) {
      const i = ct(),
        { userInfo: o, activityInfo: u } = m(i),
        { ButtonClick: r, ButtonExposure: p } = M(),
        v = e(!1),
        w = e(""),
        b = e(""),
        f = e(""),
        z = e(""),
        P = { 0: "receive", 1: "toUse", 2: "used", 3: "noStock" },
        E = e(""),
        S = e(!1),
        T = e(""),
        x = e(""),
        D = t(() => 1 === String(w.value || "").length),
        A = g.throttle(
          async () => {
            try {
              if ("230" !== o.value.provinceCode) return;
              const { code: e, data: t } = await he();
              if (!t.isCqShow) return;
              "0" === e &&
                t.isCqShow &&
                ((v.value = t.isCqShow),
                (w.value = ye(t.prizeList[0].shortName) || ""),
                (b.value = t.prizeList[0].name || ""),
                (f.value = t.prizeList[0].subTitle || ""),
                (E.value = P[t.prizeList[0].sendStatus] || "noStock"),
                (z.value = t.prizeList[0].iopName || "新用户"),
                (T.value = $("app", u.value.telNo, t.prizeList[0].cardNo)),
                (x.value = $(
                  "middleLaunchUrl",
                  u.value.telNo,
                  t.prizeList[0].cardNo
                ))),
                p({ button_name: "重庆专属优惠_".concat(z.value) });
            } catch (e) {
              v.value = !1;
            }
          },
          1e3,
          { leading: !0, trailing: !1 }
        ),
        L = async () => {
          v.value &&
            "receive" === E.value &&
            (r({
              button_name: "重庆专属_"
                .concat(w.value, "元_")
                .concat(z.value, "_立即领取"),
            }),
            (S.value = !0));
        },
        N = () => {
          (S.value = !1), A();
        },
        R = g.debounce(
          () => {
            r({ button_name: "重庆专属优惠_刷新按钮" }),
              k({ message: "加载中...", forbidClick: !0 }),
              (E.value = ""),
              A();
          },
          1e3,
          { leading: !0, trailing: !1 }
        );
      h(
        () => o.value,
        () => {
          A();
        },
        { deep: !0 }
      );
      const j = () => {
        "visible" === document.visibilityState && A();
      };
      return (
        s(() => {
          A(), document.addEventListener("visibilitychange", j);
        }),
        (e, t) =>
          v.value
            ? (n(),
              l("div", qa, [
                _("div", Ba, [
                  Ma,
                  _("div", {
                    class: "cq-top-refresh",
                    onClick: t[0] || (t[0] = (...e) => c(R) && c(R)(...e)),
                  }),
                ]),
                _("div", Fa, [
                  Wa,
                  _("div", Xa, [
                    Ga,
                    _(
                      "span",
                      { class: y(D.value ? "single" : "double") },
                      I(w.value),
                      3
                    ),
                  ]),
                  _("div", Ya, [
                    _("p", null, I(b.value), 1),
                    _("p", null, I(f.value), 1),
                  ]),
                  _(
                    "div",
                    { class: y(["cq-content-btn", E.value]) },
                    [
                      "receive" === E.value
                        ? (n(), l("span", { key: 0, onClick: L }, "立即领取"))
                        : d("", !0),
                      "used" === E.value
                        ? (n(), l("span", Za, "已使用"))
                        : d("", !0),
                      "noStock" === E.value
                        ? (n(), l("span", Qa, "已领完"))
                        : d("", !0),
                      "toUse" === E.value
                        ? (n(),
                          l("div", Ka, [
                            C(
                              c(Pt),
                              {
                                "launch-url": T.value,
                                "middle-launch-url": x.value,
                                "btn-name": "重庆专属_"
                                  .concat(w.value, "元_")
                                  .concat(z.value, "_去使用"),
                              },
                              null,
                              8,
                              ["launch-url", "middle-launch-url", "btn-name"]
                            ),
                            Ja,
                          ]))
                        : d("", !0),
                    ],
                    2
                  ),
                ]),
                $a,
                C(
                  c(Ha),
                  { "pop-show": S.value, "pop-up-type": "cq", onClosePop: N },
                  null,
                  8,
                  ["pop-show"]
                ),
              ]))
            : d("", !0)
      );
    },
  },
  ts = nt(es, [["__scopeId", "data-v-d1ffe072"]]),
  as = {
    __name: "Lottie",
    props: {
      renderer: { type: String, default: "canvas" },
      // 循环播放
      loop: { type: Boolean, default: !0 },
      // 自动播放
      autoplay: { type: Boolean, default: !0 },
      // 动画数据
      animationData: { type: Object, default: () => ({}) },
      name: { type: String, default: "" },
    },
    emits: ["getAnimation", "animationLoaded", "animationComplete"],
    setup(t, { emit: a }) {
      const c = t,
        i = a,
        o = e(null),
        u = e(null);
      return (
        s(() => {
          c.animationData &&
            ((u.value = _t.loadAnimation({
              container: o.value,
              // 用于渲染的容器
              // 渲染方式 svg、canvas、html
              renderer: c.renderer,
              // 是否循环
              loop: c.loop,
              autoplay: c.autoplay,
              // 自动播放
              // UED 提供的 动画的 json 文件
              animationData: c.animationData,
              name: c.name,
            })),
            u.value.addEventListener("DOMLoaded", () => {
              i("animationLoaded", u.value);
            }),
            u.value.addEventListener("complete", () => {
              i("animationComplete", u.value);
            }),
            i("getAnimation", u.value));
        }),
        E(() => {
          u.value.destroy(), (u.value = null);
        }),
        (e, a) =>
          t.animationData
            ? (n(),
              l(
                "div",
                { key: 0, id: "Lottie", ref_key: "LottieRef", ref: o },
                null,
                512
              ))
            : d("", !0)
      );
    },
  },
  ss = nt(as, [["__scopeId", "data-v-98154ae2"]]),
  ns = { class: "sk" },
  ls = { key: 0, class: "sk-time-day" },
  cs = { key: 1 },
  is = { key: 2, class: "sk-time-down" },
  os = nt(
    {
      __name: "skCount",
      props: {
        // 倒计时文案
        skText: { type: String, default: "距离开始" },
        // 倒计时文案字体大小
        skTextFontSize: { type: String, default: "3.5vw" },
        // 目标小时
        skHour: { type: Number, default: 8 },
        // 文本颜色
        textColor: { type: String, default: "#ff0529" },
        // 背景颜色
        bgColor: { type: String, default: "#ffffff" },
        // 时间字体大小
        fontSize: { type: String, default: "3.2vw" },
        fontWeight: { type: String, default: "600" },
        // 时间文本宽度
        blockWidth: { type: String, default: "5.3vw" },
        // 时间文本高度
        blockHeight: { type: String, default: "5.3vw" },
        colonColor: { type: String, default: "#ffffff" },
        currentTime: { type: Number, default: 0 },
      },
      emits: ["skStart"],
      setup(a, { emit: c }) {
        const i = a,
          u = c,
          r = e(),
          p = e(0),
          v = e(null),
          m = t(() => ({
            width: i.blockWidth,
            height: i.blockHeight,
            lineHeight: i.blockHeight,
            color: i.textColor,
            backgroundColor: i.bgColor,
            fontSize: i.fontSize,
            fontWeight: i.fontWeight,
          })),
          g = t(() => ({ fontSize: i.skTextFontSize })),
          y = t(() => ({ color: i.colonColor })),
          w = () => {
            const e = new Date(i.currentTime),
              t = e.getDay();
            if (3 === t) {
              e.setHours(i.skHour, 0, 0, 0);
              const t = e.getTime();
              r.value = t - i.currentTime;
            } else {
              const e = 3 - t;
              p.value = e > 0 ? e : e + 7;
            }
          },
          b = () => {
            u("skStart"), clearInterval(v.value);
          };
        return (
          s(() => {
            i.currentTime && w();
          }),
          h(
            () => i.currentTime,
            (e) => {
              e && w();
            }
          ),
          E(() => {
            clearInterval(v.value);
          }),
          (e, t) => {
            const s = z;
            return (
              n(),
              l("div", ns, [
                _(
                  "div",
                  { class: "sk-time", style: D(g.value) },
                  [
                    _("p", null, I(a.skText), 1),
                    p.value
                      ? (n(), l("p", ls, [_("span", null, I(p.value), 1)]))
                      : d("", !0),
                    p.value
                      ? (n(), l("p", cs, "天"))
                      : (n(),
                        l("p", is, [
                          C(
                            s,
                            { time: r.value, format: "HH:mm:ss", onFinish: b },
                            {
                              default: o((e) => [
                                _(
                                  "span",
                                  { class: "block", style: D(m.value) },
                                  I(("0" + e.hours).slice(-2)),
                                  5
                                ),
                                _(
                                  "span",
                                  { class: "colon", style: D(y.value) },
                                  ":",
                                  4
                                ),
                                _(
                                  "span",
                                  { class: "block", style: D(m.value) },
                                  I(("0" + e.minutes).slice(-2)),
                                  5
                                ),
                                _(
                                  "span",
                                  { class: "colon", style: D(y.value) },
                                  ":",
                                  4
                                ),
                                _(
                                  "span",
                                  { class: "block", style: D(m.value) },
                                  I(("0" + e.seconds).slice(-2)),
                                  5
                                ),
                              ]),
                              _: 1,
                            },
                            8,
                            ["time"]
                          ),
                        ])),
                  ],
                  4
                ),
              ])
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-bba9d2f0"]]
  ),
  us = ["path"],
  ds = ((e) => (p("data-v-fdf12e1e"), (e = e()), v(), e))(() =>
    _(
      "div",
      {
        style: {
          position: "absolute",
          border: "none",
          top: "0",
          left: "0",
          "z-index": "3",
          width: "100%",
          height: "100%",
          opacity: "0",
        },
      },
      null,
      -1
    )
  ),
  rs = nt(
    {
      __name: "LaunchWeApp",
      setup(e) {
        const { ButtonClick: a } = M(),
          { activityInfo: s } = ct(),
          c = t(() =>
            "/subPackageB/activity/rechargeDate/index?subPageId=PG20241014004&phone="
              .concat(s.signMobile, "&stoken=")
              .concat(s.stoken)
          ),
          d = () => {},
          p = () => {
            a({ button_name: "微信公众号_首页开启微信小程序订阅" });
          };
        return (e, t) => (
          n(),
          l("div", { class: "launch-box", onClick: r(d, ["stop"]) }, [
            _(
              "wx-open-launch-weapp",
              {
                id: "launch-btn",
                class: "launch-app",
                appid: "wx43aab19a93a3a6f2",
                path: c.value,
                onLaunch: p,
              },
              [
                (n(),
                i(
                  u("script"),
                  { type: "text/wxtag-template" },
                  { default: o(() => [ds]), _: 1 }
                )),
              ],
              40,
              us
            ),
          ])
        );
      },
    },
    [["__scopeId", "data-v-fdf12e1e"]]
  ),
  ps = ["src"],
  vs = nt(
    {
      __name: "floatWindow",
      props: {
        // 图标链接
        iconUrl: { type: String, default: "" },
        // 图标宽度
        width: { type: String, default: "" },
        // 图标高度
        height: { type: String, default: "" },
        // 图标位置
        positionTop: { type: String, default: "" },
        // 图标位置
        positionRight: { type: String, default: "" },
      },
      emits: ["clickBack"],
      setup(a, { emit: i }) {
        const o = a,
          u = t(() => ({
            width: o.width,
            height: o.height,
            top: o.positionTop,
            right: o.positionRight,
          })),
          d = i,
          r = e(),
          p = e(!1),
          v = g.throttle(
            () => {
              d("clickBack");
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          m = () => {
            (document.body.style.overflow = "auto"), p.value || v();
          },
          h = (e) => {
            (p.value = !1),
              (document.body.style.overflow = "hidden"),
              (r.value = e.touches[0].pageY);
          },
          y = g.throttle((e) => {
            p.value = !0;
            const t = e.touches[0].pageY,
              a = document.querySelector("#floatWindow"),
              s = window.innerHeight - 60;
            t < -10 || t > s || (a.style.top = t + "px");
          }, 200);
        return (
          s(() => {
            A(() => {
              const e = document.querySelector("#floatWindow");
              e &&
                (e.addEventListener("touchstart", h, !0),
                e.addEventListener("touchend", m, !0),
                e.addEventListener("touchmove", y, !0));
            });
          }),
          E(() => {
            const e = document.querySelector("#floatWindow");
            e &&
              (e.removeEventListener("touchstart", h, !0),
              e.removeEventListener("touchend", m, !0),
              e.removeEventListener("touchmove", y, !0));
          }),
          (e, t) => (
            n(),
            l(
              "div",
              { onClick: t[0] || (t[0] = (...e) => c(v) && c(v)(...e)) },
              [
                _(
                  "img",
                  { id: "floatWindow", style: D(u.value), src: o.iconUrl },
                  null,
                  12,
                  ps
                ),
              ]
            )
          )
        );
      },
    },
    [["__scopeId", "data-v-d9ddf8b0"]]
  ),
  _s = (e) => (p("data-v-09ff8244"), (e = e()), v(), e),
  ms = { class: "se" },
  gs = { key: 1, class: "se-pop" },
  hs = { class: "se-pop-top" },
  ys = { class: "se-pop-top-title" },
  ws = { key: 0, class: "se-pop-list" },
  bs = { key: 0, class: "se-pop-list-text" },
  Is = _s(() => _("br", null, null, -1)),
  fs = ["src"],
  ks = { class: "se-pop-list-item-text" },
  zs = { class: "title" },
  Ps = { class: "subTitle" },
  Es = ["onClick"],
  Cs = { key: 1, class: "se-pop-refresh" },
  Ss = _s(() =>
    _("div", { class: "se-pop-refresh-text" }, "奖券发放中 ...", -1)
  ),
  Ts = nt(
    {
      __name: "sePop",
      props: { skSession: { type: Number, default: 0 } },
      emits: ["updateYwList", "updateSePop"],
      setup(t, { emit: a }) {
        const s = ct();
        m(s);
        const u = lt(),
          { PopExposure: r, PopClick: p } = M();
        let v = null;
        const f = e(null),
          k = e(!1),
          z = e(""),
          E = ["额外送您专享福利", "二重礼享不停", "惊喜福利  限量派发"],
          C = [
            "二重礼_充值券未中奖抽中业务券_业务券弹窗",
            "二重礼_中奖_业务券弹窗",
            "二重礼_悬浮按钮弹窗",
          ],
          S = e([]),
          T = e(!1),
          D = a,
          L = t,
          N = () => {
            u.openSePop(!1, [], u.seType), D("updateSePop", u.seType);
          },
          R = g.throttle(
            (e) => {
              let t = e.jumpUrl || e.jumpUrlfc;
              p({
                window_name: C[u.seType],
                button_name: C[u.seType] + "_".concat(e.title, "_去使用"),
                button_url: t,
                page_touch_id: q("touch_id", t),
                element_four_channel: q("channelId", t),
                window_type: "营销点位",
              }),
                u.openSePop(!1, [], u.seType),
                t.includes("QWHD_YDRZ") ? W(!0)(t) : W(!1)(t);
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          j = () => {
            var e;
            r({
              window_name: C[u.seType],
              button_name: C[u.seType] + "_奖品名称_去使用",
            }),
              (T.value = !0),
              (e = bt),
              v && v.destroy(),
              A(() => {
                const t = {
                  name: "VenueAnimation",
                  container: f.value,
                  renderer: "svg",
                  loop: !1,
                  autoplay: !0,
                  animationData: e,
                };
                (v = _t.loadAnimation(t)),
                  v.addEventListener("DOMLoaded", () => {
                    const e = document.getElementById("ani_btn1");
                    e &&
                      e.addEventListener("click", () => {
                        N();
                      });
                  }),
                  v.addEventListener("complete", () => {
                    v.playSegments([150, 240], !0);
                  }),
                  v.addEventListener("enterFrame", (e) => {
                    e.currentTime >= 12 && (k.value = !0);
                  });
              });
          },
          O = () => {
            p({
              window_name: C[u.seType],
              button_name: C[u.seType] + "_我知道了",
            }),
              N();
          },
          U = () => {
            u.openSePop(!1, [], u.seType), D("updateYwList");
          };
        return (
          h(
            () => u.sePopShow,
            (e) => {
              e && ((z.value = E[u.seType]), (S.value = u.seData), j());
            }
          ),
          (e, t) => (
            n(),
            i(
              c(P),
              { show: c(u).sePopShow },
              {
                default: o(() => {
                  var e;
                  return [
                    _("div", ms, [
                      T.value
                        ? (n(),
                          l(
                            "div",
                            {
                              key: 0,
                              ref_key: "skAnimation",
                              ref: f,
                              class: "se-animation",
                            },
                            null,
                            512
                          ))
                        : d("", !0),
                      k.value
                        ? (n(),
                          l("div", gs, [
                            _("div", hs, [_("div", ys, I(z.value), 1)]),
                            (null == (e = S.value) ? void 0 : e.length) > 0
                              ? (n(),
                                l("div", ws, [
                                  0 === c(u).seType
                                    ? (n(),
                                      l("div", bs, [
                                        x(" 很遗憾~未中充值券"),
                                        Is,
                                        x(
                                          I(
                                            2 === L.skSession
                                              ? "下周"
                                              : "下场活动"
                                          ) + "早点来哦~ ",
                                          1
                                        ),
                                      ]))
                                    : d("", !0),
                                  (n(!0),
                                  l(
                                    w,
                                    null,
                                    b(
                                      S.value,
                                      (e, t) => (
                                        n(),
                                        l(
                                          "div",
                                          {
                                            key: t,
                                            class: y([
                                              "se-pop-list-item",
                                              { ifBg: 0 === t },
                                            ]),
                                          },
                                          [
                                            _(
                                              "img",
                                              {
                                                src: e.img,
                                                class: "se-pop-list-item-img",
                                              },
                                              null,
                                              8,
                                              fs
                                            ),
                                            _("div", ks, [
                                              _(
                                                "div",
                                                zs,
                                                I(e.prizeName || e.title),
                                                1
                                              ),
                                              _("div", Ps, I(e.subTitle), 1),
                                            ]),
                                            _(
                                              "div",
                                              {
                                                class: "se-pop-list-item-btn",
                                                onClick: (t) => c(R)(e),
                                              },
                                              null,
                                              8,
                                              Es
                                            ),
                                          ],
                                          2
                                        )
                                      )
                                    ),
                                    128
                                  )),
                                  2 !== c(u).seType
                                    ? (n(),
                                      l("div", {
                                        key: 1,
                                        class: "se-pop-list-know",
                                        onClick: O,
                                      }))
                                    : d("", !0),
                                ]))
                              : 2 === c(u).seType
                              ? (n(),
                                l("div", Cs, [
                                  Ss,
                                  _(
                                    "div",
                                    { class: "se-pop-refresh-btn", onClick: U },
                                    "刷新"
                                  ),
                                ]))
                              : d("", !0),
                            k.value
                              ? (n(),
                                l("div", {
                                  key: 2,
                                  class: "se-pop-close",
                                  onClick: N,
                                }))
                              : d("", !0),
                          ]))
                        : d("", !0),
                    ]),
                  ];
                }),
                _: 1,
              },
              8,
              ["show"]
            )
          )
        );
      },
    },
    [["__scopeId", "data-v-09ff8244"]]
  ),
  xs = { key: 0 },
  Ds = { key: 0, class: "success-card" },
  As = { key: 1, class: "success-card-prize" },
  Ls = { class: "success-card-prize-price" },
  Ns = { class: "success-card-prize-text" },
  Rs = { key: 2, class: "success-card-date" },
  js = { key: 0, class: "sk-failed" },
  Os = ((e) => (p("data-v-0c90e5d8"), (e = e()), v(), e))(() =>
    _("div", { class: "sk-failed-title" }, "未中奖，下周早点来哦！", -1)
  ),
  Us = { class: "sk-failed-btn" },
  Hs = { key: 2, class: "pop-network" },
  Vs = nt(
    {
      __name: "receivePop",
      props: {
        popShow: { type: Boolean, default: !1 },
        // 邀请奖励invite, 无忧行wy, 卡券激活activate, 湖北新人礼hb, 陕西新人礼sx, 湖南新人礼hn, 庆三亿模块thMillion，重庆cq，海南han
        popUpType: { type: String, default: "" },
      },
      emits: ["requestAgain", "closePop"],
      setup(t, { emit: a }) {
        const { PopExposure: s, PopClick: u } = M();
        window.__env || V();
        const r = ct(),
          { activityInfo: p, userInfo: v } = m(r),
          w = e(!0),
          b = e(ne.app),
          f = e(ne.middleLaunchUrl),
          k = e(!1),
          z = t,
          E = e(null),
          S = e(),
          T = e(),
          D = e(),
          L = e(!1),
          N = a,
          R = le[v.value.group] || le.default,
          j = e(!1),
          O = e(null),
          U = e(!1);
        let H = null;
        const q = () => {
            H && (H.destroy(), (H = null));
          },
          B = () => {
            (k.value = !1), (U.value = !1), q(), N("closePop", z.popUpType);
          },
          F = g.throttle(
            async (e) => {
              try {
                const t = await re();
                if ("0" === t.code) {
                  (E.value = "success"),
                    (T.value = t.data.actPrizes[0]),
                    (S.value = T.value.shortName + T.value.prizeName),
                    (w.value = !0),
                    (j.value = !0);
                  const { default: e } = await rt(
                    () => import("./vendor/json.BeDsP0r3.js").then((e) => e.Z),
                    __vite__mapDeps([])
                  );
                  ((e) => {
                    q(),
                      A(() => {
                        const t = {
                          name: "VenueAnimation",
                          container: O.value,
                          renderer: "svg",
                          loop: !1,
                          autoplay: !0,
                          animationData: e,
                        };
                        (H = _t.loadAnimation(t)),
                          H.addEventListener("DOMLoaded", () => {
                            const e = document.getElementById("closeBtn");
                            e &&
                              e.addEventListener("click", () => {
                                B();
                              });
                            const t = document.getElementById("acceptJoy");
                            t &&
                              t.addEventListener("click", () => {
                                const e = "抽奖模块_领取成功弹窗";
                                u({
                                  window_name: e,
                                  button_name: e + "_开心收下",
                                }),
                                  B();
                              });
                          }),
                          H.addEventListener("enterFrame", (e) => {
                            e.currentTime >= 20 && (U.value = !0);
                          });
                      });
                  })(e),
                    (b.value = $("app", p.value.telNo, T.value.cardNo)),
                    (f.value = $(
                      "middleLaunchUrl",
                      p.value.telNo,
                      T.value.cardNo
                    )),
                    (D.value = ""
                      .concat("抽奖模块_", "领取成功弹窗_")
                      .concat(S.value ? "".concat(S.value, "_") : "")
                      .concat(
                        "year26Prize" === z.popUpType
                          ? ""
                          : ["sx", "han", "year26Prize"].includes(z.popUpType)
                          ? "开心收下"
                          : "去使用"
                      )),
                    s({
                      window_name: ""
                        .concat("抽奖模块_", "领取成功弹窗_")
                        .concat(R),
                      button_name: D.value + "_".concat(R),
                    }),
                    (L.value = !1);
                } else
                  "160002" == t.code
                    ? ((E.value = "noStock"),
                      s({
                        window_name: ""
                          .concat("抽奖模块_", "领取失败弹窗_无库存_")
                          .concat(R),
                        button_name: "抽奖模块_领取失败弹窗_去充值_".concat(R),
                      }),
                      (k.value = !0),
                      (L.value = !0))
                    : ((E.value = e ? "failed-again" : "failed"),
                      s({
                        window_name: ""
                          .concat("抽奖模块_", "领取失败弹窗_网络限流_")
                          .concat(R),
                        button_name: ""
                          .concat("抽奖模块_", "领取失败弹窗_立即重试_")
                          .concat(R),
                      }),
                      (L.value = !0));
                w.value = !0;
              } catch (t) {
                (E.value = e ? "failed-again" : "failed"),
                  (w.value = !0),
                  (L.value = !0);
              }
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          W = g.throttle(
            () => {
              q(),
                (w.value = !1),
                F("p"),
                u({
                  window_name: ""
                    .concat("抽奖模块_", "_领取失败弹窗_网络限流_")
                    .concat(R),
                  button_name: ""
                    .concat("抽奖模块_", "_领取失败弹窗_立即重试_")
                    .concat(R),
                });
            },
            1e3,
            { leading: !0, trailing: !1 }
          );
        return (
          h(
            () => z.popShow,
            (e) => {
              e && ((E.value = ""), (T.value = ""), F());
            }
          ),
          (e, a) => {
            const s = Pt,
              u = P;
            return w.value
              ? (n(),
                l("div", xs, [
                  (n(),
                  i(
                    u,
                    { key: t.popUpType, show: t.popShow, teleport: "body" },
                    {
                      default: o(() => [
                        _(
                          "div",
                          {
                            class: y([
                              "pop",
                              "".concat(t.popUpType, "Bg"),
                              "".concat(E.value, "-bg"),
                            ]),
                          },
                          [
                            "success" == E.value
                              ? (n(),
                                l("div", Ds, [
                                  j.value
                                    ? (n(),
                                      l(
                                        "div",
                                        {
                                          key: 0,
                                          ref_key: "skAnimation",
                                          ref: O,
                                          class: "success-card-animation",
                                        },
                                        null,
                                        512
                                      ))
                                    : d("", !0),
                                  T.value && U.value
                                    ? (n(),
                                      l("div", As, [
                                        _("div", Ls, [
                                          _(
                                            "span",
                                            null,
                                            I(c(X)(T.value.shortName)[0]),
                                            1
                                          ),
                                          _(
                                            "span",
                                            null,
                                            I(c(X)(T.value.shortName)[1]),
                                            1
                                          ),
                                        ]),
                                        _("div", Ns, [
                                          _("p", null, I(T.value.prizeName), 1),
                                          _("p", null, I(T.value.subTitle), 1),
                                        ]),
                                      ]))
                                    : d("", !0),
                                  U.value
                                    ? (n(), l("div", Rs, "预计24小时内到账"))
                                    : d("", !0),
                                ]))
                              : (n(),
                                l(
                                  "div",
                                  {
                                    key: 1,
                                    class: y(["".concat(E.value, "-card")]),
                                  },
                                  [
                                    k.value
                                      ? (n(),
                                        l("div", js, [
                                          Os,
                                          _("div", Us, [
                                            x(" 去充值 "),
                                            C(
                                              s,
                                              {
                                                "launch-url": b.value,
                                                "middle-launch-url": f.value,
                                                "data-track-type": "PopClick",
                                                "pop-name":
                                                  "抽奖模块_未中奖弹窗_".concat(
                                                    c(R)
                                                  ),
                                                "btn-name":
                                                  "抽奖模块_未中奖弹窗_去充值_".concat(
                                                    c(R)
                                                  ),
                                              },
                                              null,
                                              8,
                                              [
                                                "launch-url",
                                                "middle-launch-url",
                                                "pop-name",
                                                "btn-name",
                                              ]
                                            ),
                                          ]),
                                        ]))
                                      : d("", !0),
                                  ],
                                  2
                                )),
                            "failed" == E.value || "failed-again" == E.value
                              ? (n(),
                                l("div", Hs, " 活动太火爆了，请稍后重试~ "))
                              : d("", !0),
                            _(
                              "div",
                              {
                                class: y([
                                  "pop-btn",
                                  "".concat(E.value, "-btn"),
                                  "".concat(t.popUpType, "-btn"),
                                ]),
                                onClick:
                                  a[0] || (a[0] = (...e) => c(W) && c(W)(...e)),
                              },
                              null,
                              2
                            ),
                          ],
                          2
                        ),
                        L.value
                          ? (n(),
                            l("div", { key: 0, class: "close", onClick: B }))
                          : d("", !0),
                      ]),
                      _: 1,
                    },
                    8,
                    ["show"]
                  )),
                ]))
              : d("", !0);
          }
        );
      },
    },
    [["__scopeId", "data-v-0c90e5d8"]]
  ),
  qs = (e) => (p("data-v-d5130177"), (e = e()), v(), e),
  Bs = { class: "thmill" },
  Ms = { class: "top" },
  Fs = { class: "top_logo" },
  Ws = qs(() => _("div", { class: "top_logo_title" }, "领88元话费", -1)),
  Xs = { class: "top_logo_hour" },
  Gs = qs(() => _("span", null, "点起", -1)),
  Ys = { class: "top_subscribe_text" },
  Zs = { class: "swiper-wrapper" },
  Qs = { class: "slide-item" },
  Ks = { class: "slide-item-title" },
  Js = { class: "slide-item-prize" },
  $s = { class: "slide-item-text" },
  en = { key: 0, class: "card" },
  tn = { class: "card_outer" },
  an = { key: 0, class: "card_outer_price" },
  sn = { class: "right" },
  nn = { class: "name" },
  ln = { key: 1, class: "card_outer_benefit" },
  cn = { class: "name" },
  on = { key: 2, class: "card_outer_text" },
  un = { key: 1, class: "noPrize" },
  dn = qs(() => _("div", { class: "noPrize-checkInfo" }, null, -1)),
  rn = { class: "noPrize-recharge" },
  pn = { key: 2, class: "thmill-down" },
  vn = { key: 4, class: "thmill-outer" },
  _n = nt(
    {
      __name: "drawPrizeVe",
      setup(a) {
        const o = ct(),
          { userInfo: u, activityInfo: r } = m(o),
          p = le[u.value.group] || le.default,
          v = lt(),
          f = window.__env || V(),
          { ButtonClick: z, PopExposure: P, PopClick: E } = M(),
          S = be.app,
          T = be.dlwmh,
          D = ne.app,
          R = ne.middleLaunchUrl,
          j = [
            "bargain",
            "start",
            "noChance",
            "grant",
            "goUse",
            "used",
            "noWeek",
            "countDown",
          ],
          O = {
            grant: "发放中",
            UNUSED: G.value ? "去中国移动客户端使用" : "去使用",
            USED: "已使用",
            EXPIRED: "已过期",
            TOSEND: "送好友",
            SENDED: "已赠送",
            TOLOOK: "去查看",
          },
          U = e(8),
          H = e(),
          F = e(),
          W = e(0),
          Y = t(
            () =>
              ({
                app: "订阅提醒",
                wechat: W.value ? "已订阅" : "开启订阅",
                wxmini: W.value ? "已订阅" : "开启订阅",
              }[f] || "")
          ),
          Q = t(() => (Ie(H.value) ? "距离开始" : "距离开始还有")),
          J = t(() => new Date(H.value).getHours());
        t(() => {
          const e = new Date(H.value);
          return e.setHours(24, 0, 0, 0), e.getTime() - H.value;
        });
        const ee = t(() => [j[7], j[6]].includes(F.value)),
          te = t(() => [j[1], j[6], j[7]].includes(F.value)),
          ae = e(null),
          se = u.value.Seckillnfos.concat(u.value.Seckillnfos),
          ce = e(null),
          ie = () => {
            "app" === f
              ? (z({ button_name: "首页_APP订阅提醒" }), v.openSubscribePop(!0))
              : "wxmini" !== f ||
                W.value ||
                (z({ button_name: "微信小程序_首页开启微信小程序订阅" }),
                ia.wxSubTask(r.value.signMobile, r.value.stoken));
          },
          oe = e(),
          ue = (e) => {
            if (!Ie(H.value)) return void (F.value = j[6]);
            if (
              (J.value < U.value && F.value === j[1]
                ? (F.value = j[7])
                : (F.value = j[oe.value] || j[1]),
              !e)
            )
              return;
            const t = {
              [j[0]]: "周三抽奖模块_已经参与抽奖",
              [j[1]]: "周三抽奖模块_未参与抽奖",
              [j[2]]: "周三抽奖模块_未中奖",
              [j[3]]: "周三抽奖模块_已经领取奖品",
            };
            P({ window_name: (t[F.value] || t[j[3]]) + "_" + p });
          },
          de = e(),
          re = g.throttle(
            async (e = !1) => {
              const t = await we();
              if ("0" === t.code) {
                if (
                  ((H.value = t.data.currentTime),
                  (oe.value = t.data.rdStatus),
                  (F.value = j[oe.value] || j[1]),
                  ue(e),
                  t.data.getPrize)
                ) {
                  const { getPrize: e } = t.data,
                    a = e.sendStatus;
                  (e.sendStatus = "3" === a ? "grant" : a), (de.value = e);
                }
              } else (H.value = Date.now()), ue();
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          pe = () => {
            F.value === j[7] ? (F.value = j[1]) : ((H.value = ""), re());
          },
          ve = e(!1);
        e("");
        const _e = e("year26Prize"),
          me = () => {
            z({ button_name: "抽奖模块_立即开抢_".concat(p) }), (ve.value = !0);
          },
          ge = () => {
            (ve.value = !1), re();
          },
          he = e(!1),
          ye = e([]),
          ke = () => {
            v.openSePop(!0, ye.value, 2);
          },
          ze = e(!1),
          Pe = g.throttle(
            async () => {
              z({ button_name: "周三抽奖模块_刷新" }), (ze.value = !0);
              try {
                await re();
              } catch (e) {
                k("刷新失败");
              } finally {
                setTimeout(() => {
                  (ze.value = !1), k({ message: "已刷新" });
                }, 500);
              }
            },
            2e3,
            { leading: !0, trailing: !1 }
          ),
          Ee = (e, t) => {
            var a;
            return "recharge" === e.subscript
              ? $(
                  null != t ? t : "app",
                  (null == (a = r.value) ? void 0 : a.telNo) || "",
                  e.cardNo
                )
              : K[null != t ? t : f];
          };
        return (
          h(
            () => r.value,
            (e) => {
              e && (W.value = !0 === r.value.subscribeStatus ? 1 : 0);
            }
          ),
          s(() => {
            document.addEventListener("visibilitychange", () => {
              ["wechat", "wxmini", "app"].includes(f) && o.queryActivityInfo();
            }),
              re(!0),
              (async () => {
                var e, t;
                const a = await fe();
                "0" === a.code &&
                  ((he.value = null == (e = a.data) ? void 0 : e.floatWindow),
                  (ye.value = null == (t = a.data) ? void 0 : t.ywFloors));
              })(),
              A(() => {
                ae.value &&
                  void 0 !== mt &&
                  (ce.value = new mt(ae.value, {
                    modules: [gt],
                    effect: "cards",
                    // 使用卡片效果
                    grabCursor: !0,
                    // 鼠标悬停时显示抓手
                    centeredSlides: !0,
                    // 居中显示
                    slidesPerView: "auto",
                    // 自动计算可见卡片数量
                    initialSlide: 2,
                    loop: !0,
                    // 循环滑动（可选）
                    observer: !0,
                    observeParents: !0,
                    observeSlideChildren: !0,
                    // 自动播放设置
                    autoplay: { delay: 2e3, disableOnInteraction: !1 },
                  }));
              }),
              r.value && (W.value = !0 === r.value.subscribeStatus ? 1 : 0),
              ("891" !== u.value.provinceCode &&
                "991" !== u.value.provinceCode) ||
                (U.value = 10),
              "app" !== f ||
                ["991", "891"].includes(u.value.provinceCode) ||
                ia.handleDynamicIslandMessage("end", u.value.provinceCode);
          }),
          (e, t) => {
            const a = rs,
              s = Pt,
              o = os,
              r = ss;
            return (
              n(),
              l("div", Bs, [
                _("div", Ms, [
                  _("div", Fs, [
                    Ws,
                    _("div", Xs, [
                      x(" 每周三"),
                      _("span", null, I(U.value), 1),
                      Gs,
                      x("准时抢 "),
                    ]),
                  ]),
                  _(
                    "div",
                    {
                      class: y([
                        "top_subscribe",
                        [
                          "subscribe" + c(f),
                          {
                            xjSubscribe: ["991", "891"].includes(
                              c(u).provinceCode
                            ),
                          },
                        ],
                      ]),
                      onClick: ie,
                    },
                    [
                      _("div", Ys, I(Y.value), 1),
                      "wechat" !== c(f) || W.value
                        ? d("", !0)
                        : (n(), i(a, { key: 0, class: "wechatBtn" })),
                    ],
                    2
                  ),
                  _(
                    "div",
                    {
                      class: y(["top_refresh", { rotating: ze.value }]),
                      onClick: t[0] || (t[0] = (...e) => c(Pe) && c(Pe)(...e)),
                    },
                    null,
                    2
                  ),
                ]),
                L(
                  _(
                    "div",
                    { ref_key: "swiperRef", ref: ae, class: "swiper" },
                    [
                      _("div", Zs, [
                        (n(!0),
                        l(
                          w,
                          null,
                          b(
                            c(se),
                            (e, t) => (
                              n(),
                              l(
                                "div",
                                { key: t, class: "swiper-slide slide" },
                                [
                                  _("div", Qs, [
                                    _("div", Ks, I(e.title), 1),
                                    _("div", Js, [
                                      _("span", null, I(c(X)(e.name)[0]), 1),
                                      _("span", null, I(c(X)(e.name)[1]), 1),
                                    ]),
                                    _("span", $s, I(e.subTitle), 1),
                                  ]),
                                ]
                              )
                            )
                          ),
                          128
                        )),
                      ]),
                    ],
                    512
                  ),
                  [[N, te.value]]
                ),
                de.value
                  ? (n(),
                    l("div", en, [
                      _("div", tn, [
                        "benefit" !== de.value.subscript
                          ? (n(),
                            l("div", an, [
                              _(
                                "div",
                                {
                                  class: y([
                                    "price" +
                                      c(X)(de.value.shortName)[0].length,
                                  ]),
                                },
                                I(c(X)(de.value.shortName)[0]),
                                3
                              ),
                              _("div", sn, [
                                _("p", nn, I(de.value.name), 1),
                                _("p", null, I(c(X)(de.value.shortName)[1]), 1),
                              ]),
                            ]))
                          : (n(),
                            l("div", ln, [
                              _("p", cn, I(de.value.prizeName), 1),
                            ])),
                        de.value.subTitle && "benefit" !== de.value.subscript
                          ? (n(), l("div", on, I(de.value.subTitle), 1))
                          : d("", !0),
                        _(
                          "div",
                          {
                            class: "card_outer_btn",
                            onClick:
                              t[1] ||
                              (t[1] = (e) =>
                                ((e) => {
                                  if (
                                    ("grant" === e.sendStatus &&
                                      k("加急发放中，预计24小时内到账"),
                                    "travel" === e.subscript)
                                  ) {
                                    const t = Z.app;
                                    E({
                                      window_name: "我的奖品弹窗",
                                      button_name: "出行无忧行_".concat(
                                        e.name,
                                        "_去使用"
                                      ),
                                      button_url: t,
                                      page_touch_id: q("touch_id", t),
                                      element_four_channel: q("channelId", t),
                                      button_type: "app" != f ? "APP引流" : "",
                                    }),
                                      B(t);
                                  }
                                })(de.value)),
                          },
                          [
                            _(
                              "div",
                              { class: y(de.value.sendStatus) },
                              I(O[de.value.sendStatus]),
                              3
                            ),
                            !c(G) &&
                            ["UNUSED", "TOLOOK"].includes(
                              de.value.sendStatus
                            ) &&
                            "travel" !== de.value.subscript
                              ? (n(),
                                i(
                                  s,
                                  {
                                    key: 0,
                                    "launch-url": Ee(de.value),
                                    "middle-launch-url": Ee(
                                      de.value,
                                      "middleLaunchUrl"
                                    ),
                                    "btn-name": "抽奖模块_"
                                      .concat(
                                        de.value.shortName + de.value.name,
                                        "_去使用_"
                                      )
                                      .concat(c(p)),
                                  },
                                  null,
                                  8,
                                  [
                                    "launch-url",
                                    "middle-launch-url",
                                    "btn-name",
                                  ]
                                ))
                              : d("", !0),
                          ]
                        ),
                      ]),
                    ]))
                  : d("", !0),
                F.value === j[2]
                  ? (n(),
                    l("div", un, [
                      dn,
                      _("div", rn, [
                        C(
                          s,
                          {
                            "launch-url": c(D),
                            "middle-launch-url": c(R),
                            "btn-name": "抽奖模块_去充值_".concat(c(p)),
                          },
                          null,
                          8,
                          ["launch-url", "middle-launch-url", "btn-name"]
                        ),
                      ]),
                    ]))
                  : d("", !0),
                ee.value
                  ? (n(),
                    l("div", pn, [
                      C(
                        o,
                        {
                          "sk-text": Q.value,
                          "current-time": H.value,
                          "sk-hour": U.value,
                          "sk-text-font-size": "3.8vw",
                          onSkStart: pe,
                        },
                        null,
                        8,
                        ["sk-text", "current-time", "sk-hour"]
                      ),
                    ]))
                  : d("", !0),
                F.value === j[1] && c(It) && "app" == c(f)
                  ? (n(),
                    i(
                      r,
                      {
                        key: 3,
                        "animation-data": c(It),
                        class: "thmill-skbtn",
                        onClick: me,
                      },
                      null,
                      8,
                      ["animation-data"]
                    ))
                  : F.value === j[1] && "app" !== c(f)
                  ? (n(),
                    l("div", vn, [
                      C(
                        s,
                        {
                          "launch-url": c(S),
                          "middle-launch-url": c(T),
                          "btn-name": "抽奖按钮-端外",
                        },
                        null,
                        8,
                        ["launch-url", "middle-launch-url"]
                      ),
                    ]))
                  : d("", !0),
                C(
                  Vs,
                  {
                    "pop-show": ve.value,
                    "pop-up-type": _e.value,
                    onClosePop: ge,
                  },
                  null,
                  8,
                  ["pop-show", "pop-up-type"]
                ),
                he.value
                  ? (n(),
                    i(
                      c(vs),
                      {
                        key: 5,
                        "icon-url": he.value,
                        width: "16vw",
                        height: "16vw",
                        "position-top": "47vw",
                        "position-right": "1.4vw",
                        onClickBack: ke,
                      },
                      null,
                      8,
                      ["icon-url"]
                    ))
                  : d("", !0),
                C(c(Ts)),
              ])
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-d5130177"]]
  ),
  mn = { key: 0, class: "pop-prize" },
  gn = { class: "pop-prize-short" },
  hn = { class: "pop-prize-name" },
  yn = { class: "pop-prize-title" },
  wn = { key: 1, class: "pop-lable" },
  bn = nt(
    {
      __name: "feeChPop",
      emits: ["closePop"],
      setup(t, { emit: a }) {
        const { PopExposure: u, PopClick: r } = M(),
          p = ct(),
          { chInfo: v } = m(p),
          h = e("success"),
          w = e(!0),
          b = a,
          f = async (e) => {
            try {
              const t = await ke({ prizeId: v.value.prizeId });
              "0" === t.code
                ? ((w.value = !1), b("closePop", 2))
                : "160002" == t.code
                ? ((h.value = "noStock"),
                  u({
                    window_name: "充值回馈礼_领取失败弹窗_无库存",
                    button_name: "已领完",
                  }))
                : ((h.value = e ? "failed-again" : "failed"),
                  u({
                    window_name: "充值回馈礼_领取失败弹窗_网络限流",
                    button_name: "充值回馈礼_领取失败弹窗_立即重试",
                  }),
                  (w.value = !0));
            } catch (t) {
              (h.value = e ? "failed-again" : "failed"), (w.value = !0);
            }
          },
          k = () => {
            w.value = !1;
          },
          z = g.throttle(
            () => {
              "success" === h.value
                ? (f(),
                  r({
                    window_name: "充值回馈礼_奖品弹窗",
                    button_name: "充值回馈礼_弹窗_立即领取",
                  }))
                : "failed" === h.value &&
                  ((w.value = !1),
                  f("p"),
                  r({
                    window_name: "充值回馈礼_领取失败弹窗",
                    button_name: "充值回馈礼_领取失败弹窗_立即重试",
                  }));
            },
            1e3,
            { leading: !0, trailing: !1 }
          );
        return (
          s(() => {
            u({
              window_name: "充值回馈礼_奖品弹窗",
              button_name: "充值回馈礼_弹窗_立即领取",
            });
          }),
          (e, t) => {
            const a = P;
            return (
              n(),
              i(
                a,
                { show: w.value },
                {
                  default: o(() => [
                    _(
                      "div",
                      { class: y(["pop", "".concat(h.value, "-bg")]) },
                      [
                        "success" == h.value
                          ? (n(),
                            l("div", mn, [
                              _("div", gn, [
                                _("span", null, I(c(X)(c(v).shortName)[0]), 1),
                                _("span", null, I(c(X)(c(v).shortName)[1]), 1),
                              ]),
                              _("div", hn, I(c(v).name), 1),
                              _("div", yn, I(c(v).subTitle), 1),
                            ]))
                          : d("", !0),
                        "success" == h.value ? (n(), l("div", wn)) : d("", !0),
                        _(
                          "div",
                          {
                            class: y(["pop-btn", "".concat(h.value, "-btn")]),
                            onClick:
                              t[0] || (t[0] = (...e) => c(z) && c(z)(...e)),
                          },
                          null,
                          2
                        ),
                      ],
                      2
                    ),
                    _("div", { class: "close", onClick: k }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-74d252af"]]
  ),
  In = ["src"],
  fn = { key: 0, class: "videoBox" },
  kn = nt(
    {
      __name: "guidePage",
      setup(t) {
        const a = ct(),
          { strategy: s, activityInfo: u } = m(a),
          { PopExposure: r, ButtonClick: p } = M(),
          v = lt(),
          g = e(),
          w = e(!1),
          b = e(null),
          I = e(null),
          f = () => {
            v.openGuidePop(!1);
            const e = document.getElementById("scrollup");
            e.removeEventListener("touchstart", z, !0),
              e.removeEventListener("touchmove", E, !0);
          },
          k = () => {
            w.value = !1;
          };
        function z(e) {
          g.value = e.touches[0].pageY;
        }
        function E(e) {
          if (e.touches[0].pageY - g.value < 0) {
            const e = document.querySelector(".guide");
            (e.style.transition = "height 0.5s"), (e.style.height = "180vw");
          }
        }
        function S() {
          (w.value = !1), I.value && I.value.dispose();
        }
        function T() {
          const e = document.querySelector("#my-player video");
          e.paused ? e.play() : e.pause();
        }
        return (
          h(
            () => v.guideVisible,
            (e) => {
              e &&
                (u.value.video,
                r({
                  window_name: v.guideType
                    ? "攻略页弹窗"
                    : "话费券使用指南弹窗",
                }),
                A(() => {
                  if (v.guideType) {
                    const e = document.getElementById("scrollup");
                    e.addEventListener("touchstart", z, !0),
                      e.addEventListener("touchmove", E, !0);
                  }
                }));
            }
          ),
          (e, t) => {
            const a = P;
            return (
              n(),
              i(
                a,
                { show: c(v).guideVisible, position: "bottom" },
                {
                  default: o(() => [
                    (n(),
                    l(
                      "div",
                      {
                        key: c(v).guideVisible,
                        class: y(["guide", { Bg2: !c(v).guideType }]),
                      },
                      [
                        (n(),
                        l(
                          "div",
                          {
                            id: "scrollup",
                            key: c(v).guideType,
                            class: "guide-content",
                          },
                          [
                            _(
                              "img",
                              {
                                src: c(v).guideType
                                  ? c(s)
                                  : "https://qwhdcdn.cmcc-cs.cn/prd-hlwyxmb/file/062665dc51694f47b7cbadbbf76fdc8c.png",
                                alt: "",
                              },
                              null,
                              8,
                              In
                            ),
                          ]
                        )),
                        _("div", { class: "guide-close", onClick: f }),
                      ],
                      2
                    )),
                    C(
                      a,
                      {
                        show: w.value,
                        "show-close": !0,
                        position: "center",
                        "overlay-style": {
                          "background-color": "rgba(0,0,0,.8)!important",
                        },
                        class: "playPop",
                        onClosePop: S,
                      },
                      {
                        default: o(() => [
                          w.value
                            ? (n(),
                              l("div", fn, [
                                _(
                                  "video",
                                  {
                                    id: "my-player",
                                    ref_key: "videoPlayer",
                                    ref: b,
                                    style: {
                                      height: "100%",
                                      width: "100%",
                                      "background-color": "#fff",
                                    },
                                    controlslist: "nofullscreen",
                                    "x5-playsinline": "true",
                                    playsinline: "true",
                                    "webkit-playsinline": "true",
                                    "x-webkit-airplay": "true",
                                    "x5-video-orientation": "portraint",
                                    class:
                                      "video-js vjs-default-skin vjs-big-play-centered",
                                    "data-setup": "{}",
                                  },
                                  null,
                                  512
                                ),
                                _("div", { class: "playDiv", onClick: T }),
                              ]))
                            : d("", !0),
                          _("div", { class: "close", onClick: k }),
                        ]),
                        _: 1,
                      },
                      8,
                      ["show", "overlay-style"]
                    ),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-412c92d3"]]
  ),
  zn = (e) => (p("data-v-207d2977"), (e = e()), v(), e),
  Pn = { key: 0, class: "han" },
  En = { class: "han-top" },
  Cn = zn(() => _("div", { class: "han-top-title" }, "海南专属优惠", -1)),
  Sn = zn(() => _("div", { class: "han-receive-tag" }, null, -1)),
  Tn = { class: "han-receive-price" },
  xn = zn(() => _("span", null, "￥", -1)),
  Dn = { class: "han-receive-text" },
  An = zn(() => _("p", null, "话费加赠券包", -1)),
  Ln = ["innerHTML"],
  Nn = { key: 0 },
  Rn = { key: 1, class: "han-list" },
  jn = { key: 0, class: "han-list-item-tag" },
  On = { class: "han-list-item-left" },
  Un = zn(() => _("span", null, "￥", -1)),
  Hn = { class: "han-list-item-right" },
  Vn = { class: "han-list-item-right-text" },
  qn = { key: 1, class: "btn5" },
  Bn = zn(() =>
    _(
      "div",
      { class: "han-tips" },
      [_("span", null, "Tips"), x("快邀请您的亲友薅羊毛~")],
      -1
    )
  ),
  Mn = nt(
    {
      __name: "hanFloor",
      setup(a) {
        const o = ct(),
          { activityInfo: u, userInfo: r } = m(o),
          { ButtonClick: p, ButtonExposure: v } = M(),
          h = e(!1),
          f = e(!1),
          z = e(),
          P = e(""),
          E = t(() => P.value.replace(/(\d+元)/g, "<strong>$1</strong>")),
          S = e(),
          T = e(""),
          D = e(!1),
          A = e(""),
          L = e(),
          N = ["noStart", "receive", "noStock"],
          R = e(),
          j = e(!0),
          O = g.throttle(
            async () => {
              if ("898" !== r.value.provinceCode) return;
              const { code: e, data: t } = await ze();
              if ("0" === e && t) {
                if (!t.isHanShow || !t.prizeList.length) return;
                h.value = t.isHanShow;
                const e = ["本月", "次月", "次次月"];
                let a = !1,
                  s = !0;
                (T.value = t.prizeList[0].iopName),
                  t.prizeList.forEach((t, n) => {
                    const l =
                      t.sendStatus.includes("激活") ||
                      t.sendStatus.includes("可用");
                    (t.btnName = e[n]),
                      (t.showTag = l),
                      (t.sortNumber = l ? 5 : t.sendStatus),
                      9 != t.sendStatus && (s = !1),
                      8 != t.sendStatus && (a = !0);
                  }),
                  s ? (R.value = N[2]) : a ? (f.value = !0) : (R.value = N[1]),
                  (z.value = t.prizeList.reduce(
                    (e, t) => e + parseFloat(t.shortName),
                    0
                  )),
                  (P.value = t.prizeList
                    .map(
                      (e) =>
                        ("本月" === e.btnName ? "当月" : e.btnName) +
                        e.shortName
                    )
                    .join("+")),
                  j.value &&
                    !f.value &&
                    v({
                      button_name: "海南_专属优惠_".concat(
                        t.prizeList[0].iopName
                      ),
                    }),
                  (j.value = !1),
                  (S.value = t.prizeList.sort(
                    (e, t) => e.sortNumber - t.sortNumber
                  ));
              }
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          U = () => {
            R.value === N[1] &&
              (p({
                button_name: "海南_"
                  .concat(z.value, "元_")
                  .concat(S.value[0].iopName, "_立即领取"),
              }),
              (L.value = "han"),
              (D.value = !0));
          },
          H = () => {
            (D.value = !1), O(), o.getPrizeUnuse();
          },
          V = g.debounce(
            () => {
              p({ button_name: "海南专属优惠_刷新按钮" }),
                k({ message: "加载中...", forbidClick: !0 }),
                (R.value = ""),
                O();
            },
            1e3,
            { leading: !0, trailing: !1 }
          );
        return (
          s(() => {
            O(),
              document.addEventListener("visibilitychange", () => {
                O();
              });
          }),
          (e, t) => {
            var a;
            const s = Ha;
            return h.value
              ? (n(),
                l("div", Pn, [
                  _("div", En, [
                    Cn,
                    _("div", {
                      class: "han-top-refresh",
                      onClick: t[0] || (t[0] = (...e) => c(V) && c(V)(...e)),
                    }),
                  ]),
                  f.value
                    ? d("", !0)
                    : (n(),
                      l(
                        "div",
                        {
                          key: 0,
                          class: y([
                            "han-receive",
                            { noStockBg: R.value === N[2] },
                          ]),
                        },
                        [
                          Sn,
                          _("div", Tn, [xn, _("span", null, I(z.value), 1)]),
                          _("div", Dn, [
                            An,
                            _("p", { innerHTML: E.value }, null, 8, Ln),
                          ]),
                          _(
                            "div",
                            {
                              class: y(["han-receive-btn", R.value]),
                              onClick: U,
                            },
                            [
                              R.value === N[0]
                                ? (n(), l("span", Nn, "未开始"))
                                : d("", !0),
                            ],
                            2
                          ),
                        ],
                        2
                      )),
                  f.value && (null == (a = S.value) ? void 0 : a.length) > 0
                    ? (n(),
                      l("div", Rn, [
                        (n(!0),
                        l(
                          w,
                          null,
                          b(S.value, (e, t) => {
                            var a, s, o;
                            return (
                              n(),
                              l("div", { key: t }, [
                                _(
                                  "div",
                                  {
                                    class: y([
                                      "han-list-item",
                                      [
                                        2 ===
                                        (null == (a = S.value)
                                          ? void 0
                                          : a.length)
                                          ? "item2"
                                          : "item1",
                                      ],
                                    ]),
                                  },
                                  [
                                    "hanzs" === e.leftShow
                                      ? (n(), l("div", jn))
                                      : d("", !0),
                                    _("div", On, [
                                      Un,
                                      x(),
                                      _(
                                        "span",
                                        null,
                                        I(c(X)(e.shortName)[0]),
                                        1
                                      ),
                                    ]),
                                    _("div", Hn, [
                                      _("div", Vn, I(e.name), 1),
                                      _(
                                        "div",
                                        {
                                          class: y([
                                            "han-list-item-right-btn",
                                            "btn" + e.sendStatus,
                                          ]),
                                        },
                                        [
                                          "1" === e.sendStatus
                                            ? (n(),
                                              i(
                                                c(Pt),
                                                {
                                                  key: 0,
                                                  "launch-url": c($)(
                                                    "app",
                                                    (null == (s = c(u))
                                                      ? void 0
                                                      : s.telNo) || "",
                                                    e.cardNo
                                                  ),
                                                  "middle-launch-url": c($)(
                                                    "middleLaunchUrl",
                                                    (null == (o = c(u))
                                                      ? void 0
                                                      : o.telNo) || "",
                                                    e.cardNo
                                                  ),
                                                  "btn-name": "海南_"
                                                    .concat(z.value, "元_")
                                                    .concat(T.value, "_去使用"),
                                                },
                                                null,
                                                8,
                                                [
                                                  "launch-url",
                                                  "middle-launch-url",
                                                  "btn-name",
                                                ]
                                              ))
                                            : d("", !0),
                                          e.showTag
                                            ? (n(),
                                              l("div", qn, I(e.sendStatus), 1))
                                            : d("", !0),
                                        ],
                                        2
                                      ),
                                    ]),
                                  ],
                                  2
                                ),
                              ])
                            );
                          }),
                          128
                        )),
                      ]))
                    : d("", !0),
                  Bn,
                  C(
                    s,
                    {
                      "pop-show": D.value,
                      "pop-up-type": L.value,
                      "pop-param": A.value,
                      onClosePop: H,
                    },
                    null,
                    8,
                    ["pop-show", "pop-up-type", "pop-param"]
                  ),
                ]))
              : d("", !0);
          }
        );
      },
    },
    [["__scopeId", "data-v-207d2977"]]
  ),
  Fn = { class: "barrage" },
  Wn = { id: "scrollingText", class: "barrage_container" },
  Xn = ["src"],
  Gn = { class: "barrage_container_item_text" },
  Yn = nt(
    {
      __name: "hbBarrage",
      setup(t) {
        const a = e([]);
        function c() {
          const e = document.getElementById("scrollingText"),
            t = e.scrollWidth,
            a = Math.max(t / 100, 80);
          (e.style.width = "".concat(t, "px")),
            (e.style.animationDuration = "".concat(a, "s"));
        }
        return (
          s(() => {
            (a.value = Array.from({ length: 30 }, () => {
              const e = String(Math.floor(1e4 * Math.random())).padStart(
                  4,
                  "0"
                ),
                t = Math.random() < 0.33 ? 3 : Math.random() < 0.67 ? 4 : 5,
                a = Math.random() < 0.33 ? 50 : Math.random() < 0.67 ? 10 : 5,
                s = [
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAC+lBMVEUAAADz/9Hz/9H3/87z/9Hy/9Ly/9Hz/9Hy/9Hy/9Hy/9H0/871/8/z/9Hy/9Hy/9Hy/87y/9Lz/9Lx/9Py/9Dy/9Hy/9Hy/9Hy/9Hv/872/9Hy/9Ly/9Hz/9Hy/9Hy/9Hy/9Hz/9Lz/9P0/9Ly/9Hw/9nx/9Hz/9Hz/9Hy/9H0/9Lz/9Lz/9Hz/9Hz/9Dx/9Ly/9Hz/9Lz/9D3/9Xs/9Dx/9Hy/9Dz/9Hy/9Hy/9Hy/9Dz/9Hx/9Dw/9Dy/9Lz/9Ly/9Dz/8//6jTy/9Hx/9j/6S3y/9Py/9bx/9n/6jP/6DH/6DP/6CsAAAD/6S/y/9X/6Cf/6Cny/tP+6jH/9Tn/6ir/5hv97EH//vby/tD/+zj+6Df/6jD/5ir/5yT8+/vx/9v68m7/7DY1MjEYGBj/5hb7+vbo6Ojf3+Hy/c3z/cv2+JX78nT88F797lIiIiISExH////+/vz+++30/MH1+qr49ov59Hz+60f/+0P//Dw7Ozv/7jf/5y4mJS06MyX/5h7++/Lo6e/y8ezk4+C+xeDOz871+7b1+7L1+a/2+J349YT+8YT8723871ZMTEk/Pjn+9jMtKCTx/9/AwcCwsLyvr7T2+KT39JJxcXr972RSUFD87U787Uk5ND3+6Dvs6Tb/7CjWyxd7Wgrv/+z8/Ojj4+Xr6uP/++H++ODi4NjW19fy+9Omrsry/Mj++sRvfMDSzr3+9rnOx6OTlZuOi5aSk5L+8Y359n5iWnH69W/9/G01OFxeTlL87UxEQ0luZEj/7z7/6z5gVTz96zouLS3p4Snd1B4gHx0xKRwrJxg0LRLPvRE8OA/UmgRKLAS1eQLr7fDr6+j6+dH/+cyVoMva1srj3sWmrMDPy7mdpbmEi7Gmp6/Z0qyZmaanp6RQWKO8t6C5tJ/X0p22sJlmbZljapbSyotWWoh7fIbIxoGinYGTiWxBRmq2sWk6P2eGfGD76FtWVlX98Ufm6EDg4Dr38zL89Sz/6CDWxxLPtw2KZwkFBQQEAwLX91+bAAAAQnRSTlMA6PkK/PLw9vTsohcH5d6HEncUDtXNx8RIHhvZs5GMgl4+NSwmBeLSraVwbWllWFVOMCIeGryvqZ1LO+C6r658ckBzxjyNAAAFZUlEQVQ4y4WVBXDTYBTH21LZOlpgg20Md3d36JekSZrVXem2bszZxsYGbAx3d3d3d3d3d3d3u+OlpYPjkP9d7941v3v5f9+TcP6soi1riosLAyRNytYrWZjzTxWuWKR4oAiBeEJJ9fLB/2KL1qkWgBAhB6kIxOeWbfQHqEoh7xuDinARkpMgDEQSKKBZw9/AkJId6rSv3aJyUHC7QIQwbGDSNF3u7uRELdA8ccSvbFC9MtUkgUIhV1q6XFWExsQn6XA7DlKmDAJaWKxQAVoovAZXBC4JAiG+AKGOy4crGSVFySga18zIBDq0wEhwMSkPqcAeCT85sKrJgMp8squzE0gUWLvwj8N7D4RpB0wckpUZj5EYOVGJA/tDODMEI3jNi/outQ4XEaRq8HBKp9MpTVnxc7XTGFpWIAVuwuSoREkvXLE4IjrGD6MZHKRRO14tXWpT0wDRCgXLynBNFxWSVPSZCECkZXgua5KS0VGjRm3ZaPQYjbP0er2M9sEDCMQNZ+GWxcFvEuMzqejRbdT+Dzm7dpt2Wd/P1OujIDmbmUCSCixcMxCRA204RQEK7IE5J+bcmbdw4bwHc0582d8tSiGjNTqLHEkrs3ANEUG6lUogFXQP69HDL+5tzRvvil2b9+z+1iOzrVE07hiGEfzWQSwMLshs1jD47TY779ypuN5rU1fdSh3XO673ykMHuvVw2gZiSOArYSBYlnkdK/Qzj6xcMrLziE7rDvUc7w1uHps5ytFVK0fc+hw/DJaBjbIend6ve2Rk5Ii41O5x3qBf9KecrI5jCCQSV2LhagBvx2k2sfXkposxwMT03zdlbGc2WLbt+JYE6AGgm7K0WERgXQ34D/gyy6T64VSAc96kDEkgVYhXHWpYC66uy14DBXds/Ty9X3Rk5Nf1fQ92j4Pg2/p+o2dbDRq1abCcQIJyRTkNSkDDTcw12BUK/bvDV/qPjHkdt65nz3H9u8dM6f3w2Fs9DW1qSwRaWp8TUk6A5NqNNofBMSvned7V+Z06PRp96e7o8RBMynucMwtqSKlndMFQQBkOp2QbPlJpJ0xldE7DmesxOyZNH33bFfvk4I5J0anjVjjVMpDSkSRX8cPgiBVC+VAY7aAJbmOSedWenjuvnU53LVgDwXnzZCPOwpSBksuRkG3oemEC6NK5CUn56rNpffr2WRM99kb0BQjSVmggMStGBz0d4G3/BqV57NzZGM/kXum9zIujYzqPXGA2p2Uk59t9ME7BvAk4rCqXgNl35+IytXGDKzYjffHLp33NGbGuDfmMf7Ygsw+uUpeLyAE2Bmru9AzNcKWnxcampbsyhhrV/tHS2L2eQSFFAqCKuBL+hdwpqxf1Mpt7LVqd4gHWp1xNskrFD/VumNJ8OTZVSftemO/MHjZ06LDsfA/jZymNbpD3nkGNQ6GZTP5NQTMfjUaPZ5pJ7R9xGjd01apQ1fJeOIyFcYD9DxmnI3FAthO3UxRlV2oMm7VwcWW9wxLcjCeXJ4ONAkUxmswxmSk449XeLC2GUIlKvlVXTEBgiQ78J0yrTQkdSctg91TT9uSsLnBtqFX5HwssXILIhBnOAlbBGBIxAmGExRIfbyHYjS6tFcLxKaIJtOkEhZr2e8bdYJKPCIyVCiFh6XD/zgUfQgRGaDWupGklrrFvtmBIFCYV8hC7g7lhxX79UESIYeeqBiZTSh2N61IGswcqFV6hpjhUWqJ6ufoRkPYXVW7Kg9zaQUPc7q6ZFvCLJLUKcQoVbdwwIhjI31SxrQBon4Dllaodwvm7GhWp6vtSQFYeV1wB8v1DIS3KlOIKRSIBt1TzukGc/ym4Ut0i4hplyzcIqvJn4DskVv/nquEE/gAAAABJRU5ErkJggg==",
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAuCAMAAACPpbA7AAAC91BMVEUAAADy/9Hy/9Hz/9Hy/9Hw/8/5/9H4/9b1/9jy/9Hy/9Hz/9Hx/9D0/9Hx/9Tw/87y/9Hy/9Ly/9Hz/9Ly/9Hy/9Hz/9Lz/9Lz/9Hz/9Hy/9Hy/9Hz/9Hy/9Hy/9Hy/9Hx/9Hz/9Pz/9Lz/9Hy/9Hy/9Hy/9Dy/9Ly/9Ly/9Ly/9Ly/9Hx/9H0/9vy/9Hz/9Ly/9Hx/9Hy/9Hy/9H/////gs4AAAD9/v7y+9H/gM3/d87/f87/e87y/tH/fc7/es3/i9z/htL/dc7+gs7/hNj/ec7z79Hy99D/hND6ts/8o8/+fM739/f/idn+h87/cs0nCBX/h9z/ftry/dErGCAhIB7r9O//iNT06dHK1M/9ks7+hM4+Eirt7O3/kODa5d/8h9ry9tHy+dD07dD24dD23M/+cbPiXZ1lZmQ/Pj0tLy35+vn19PTx8PH6gtLy89H/f9H31tD8m9Die8q3vbqZJWpaX1tWWVdeF0EoJicsDBwdGRoHBgf7/fzg7efd3d3+gNX50NP3zc/+ic7Lzczld8bdeMH/eby0srPbVLPQVaiAhIF+FlFLS0s/R0JZDS06CBwXFhYREBANDQ3y+vb/levl7+nV39r+ktf/eNT5etLR0NH/ddHz9dD5u9D7sdD4yc/9l8/vdsm/zsXnY73hYLiwuLLdTKv3YqTNTKTYX5KOjI28NIl8enuoHXLJLW2zMGZkXmCnGUxUHT1BByAeCBAYAAnp5+jk5OTd6eH+vdzY19f4gdXR2tT4cdH5v9D7rND4xc/9jc7tfc71e83jgczJyMnmgsnEw8TyYcHXabrjZ7qnvLCtq6yisKnVQqL0WKGbpaC4Xp6TpZqSlZPGL47bR4aoKHjROXd0cXNwIE9yEkuDEjU1NDNCGTD/g+LX19jwg9T6udPy+dLz8tHz8dHGz8n/hcbHcrvqWbftaqbdaKDCSZ7SMJjEQpe4RZGGkInBLoh4fXjcKnSMLGdbb2LBI1+IHVyxJ1lKV019Ezk/Hy41ICN7t3m+AAAAM3RSTlMA/urk9B4PCQfxhGUjHBQN4d377cW4gGsu5rTZ0p1xYTQpGPe8kHdWTkrLrjwFpEZCNsCKSgV3AAAF0klEQVRIx41VdVRTcRTewJEDASkVUOyu98beexvrwZptbHQalIgoIaDS3WB3d3d3d3d3d8cf3rfZividA2c7+2599/7upfwEC5on3ZNmRvk/mNNaObV0bOnk3MmmaePs7vQOjiYOCIJQmzR3cm5t3gi9acc+llTECDBxc7H9J93W2ZRke2O+0b7eCMCkfZt/0a1MgOPvM0Qqk8nyfTD4Ytm+4QhmLs2BET01VM5hc9hcoXQKGcGloRosrE0hZx8Zl8thMRgsDlc8dAoVobbsDZrZ0lzpnjZm3X/m09qR3mViDuMrOIKh0QjSxIrezaOHm529nWP7VnTzH+5dmiEIJpVzGPh3A0KKIdRmjnaWpMJgatKlw/f6bVpA8HycTdJxFk4ascTCIORXNHN3tTDyO0GxviFcnM/ji/j8QL4EDNhsCADw9sf6Yr4YKXHbLh0NVZhZNUG8B8g5yQf2RR3Q5iYli5R8Bu6nugNRfQds36kSFszY5gMW1C6tv6WDycQMXvmqk6sWvzh3pnxOLk/iJwyiYgNkOBcgZotDhkA4h6404LvaI4hPqACPSMmqqYuPi0tP0J3bFTFBOORW3nitJlCCQzlsQr7DH3roDIPYEdLvLyT4Yw6q41M3BAQEjJ1VfbVYE7hxo2jizF0TNRFKpQQUlg+BlBzpFIo1jMIAnM2bmZEeyURJMLPfhBWN2Txv6aWMjLTylM2HoiIkHD/VYBDJ2pzSiuQLRRPThkWiipxBBoux6RfL067GV8w98fJKWOXF2cVJEkKe541QW9iAfzKfa2W6WUxFhb5qExqeo0CD69UrgseOZo4cHXlKv7py1T4l9NwXQew9KZ1hePoVaJ8kRKKFdV5eCUeq9BWJg4ZBNCOYhZnqp1F83JCQnSulmx3oM37y0rgA9LQXYJSXV10pM3w9U7Fp0iCDweGsOTwJQyDshyCmnQ16Dh66leSn1nsZMGLJQBQduChz+BLF+r05IwNWpCUF4t/4NCcq0nfahDPV2WjihREG/vBSECpnOHy4kDBKv585t7aIhwtUJL8npakzOQ+aMv04FE1cAgb18UfAPVpI2pJ/wwYFqw8pcWKnD/B7wbyBQLfHb82oAFZiXF16ajiTqWCi6654GRG/Llg3W8MiZkSDPq4UCt0egYS0C3SHIYvw/eHw//qicJQ5KcFAr1+kuLummMeVT8UM+lNsYeC8+ydrF+tPBYAaI7PHpVaNOjESDDJBrapSxcDnl2YqYQChv+SbtiA7PCVkgnaxLn1ucOTR+M869Zrhp7OZaKl+xd5ElDkr85go2W+GLzxp40SDQv7Tubm8orSwTH3NylexsbErs6qDmYpCsgEbPmTc0AhUMG9t3W0Ni7ODJbRARfB5SXtO1i6bHxOz8FFM7OWEcWSzRm8ZVjNPRLCmY+S4GZ+kqxsVHjzBZvDH3FfHlsScX6M+WzL/Y3Vq8JajcZ/ePdBOJotFkHa0r8sTniQSFCpm4LyUsPcxJcvWrn0bc+/s2iydLqzy2G7RZLnUF+im4N6IbvZQgVQMATQLVi9/eHz58uMl81dWHkyZU7Q7V0sUTO9L0l3Mvi9EMkA/oZjF4Ec9zqpZtnBh7PnLtQsiIpQ8SF3W35+ke/x0FXq3hN2xAypg8EWzX4epa1erw55FBeJcPyIkj8yFauph9P6tAktocgjBYjEkoqiUsrJ5xXuSAtkCdqi0n2H5OFr/eqbo7ajwzDhs2AaSQKVGKeLxkgWE6mYQZrgG7p4Wvx0vD2gytl3Age2BM0IlLIEft0BqZDvYefx5C2x6OMA7U3EZsEZZhEDMCtnmA2VCKs1btPrbyexkBz/ms9ksLiGWh07rH21gU5u379zG4q9HxhlKxmR+BCdUlj8YM+5xUyfrBs8SrSsVrkzI0Lwg48lzsHSz6gW+G0RHMqO+mLfxpJp27dD6R4caysgIqkk7q55tzCmNwMa9mQN4NrF3sqaB68ZBt3I0cXN3aU1r2PUXse/tvbTjlj0AAAAASUVORK5CYII=",
                  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAAqCAMAAAAgTTMxAAAC7lBMVEUAAADy/9Hu/9Hx/8/1/8/z/9Hy/9Hz/8/y/9Hy/9Hy/9Hz/9Hy/8Dy/9Hz/9Hz/9Ly/9H1/9Hy/9Lz/9D0/9Dy/9Ly/9Hy/9Hy/9Hz/9Hx/9Hz/9Hz/9Ly/9Hy/9Lz/9Ly/9Hy/9Hz/9Hy/9Hy/9Hz/9Hy/9Hy/9Hz/9Hy/9Lz/9Hz/8/y/9Hy/9Dy/9Hz/9Hz/9Hy/9Hy/9Hy/9Hw/9EA0f8Az//y/9EAzf/5/8/1/9D3/9ACyv/9/84A1//7/88I0P30/dD3/s4B3/8A+P74/9cB4v8FAAAA6f8A2/8B7f4JzP3z/9Po/NLs/NHv/dD9/8vu/pQBx/8n1vj8/9IW0/wc0Pke1vg63PR+6uiM7OWX7uMAz+H0/9bg+9MCkroGVnwHLEQC5f8SzvwB5fkx2fYA4O5v6usA1+bO+NgAxdja+tfl+9LY9okBO1MCEx4Bxf8A4vRb4+sAxeei8eGu8t7E9tn8/9jN+Kn9/3sCS3oCRWQFNEUAIi0m+f4S6P5D3/NU4e9k5OwCz+wAtOxq5uuq8+EAv+C79dsArNUAodT3/9L4+9IAlsv09Mrn/pkBb5cDYIQs8/8I2v067fsi6flF7/jV+vZ69fQr3/QGxPFM3/DH/eI2zd3y/ssAp8uf88nw7McDZI38/4qdlHYCUm79/2MFIz4mLjgCHClMJR4X8f4Y2/us+fgcz/MX6PDA++5x5O5R6e044ugJy+bO5uLc5N4frdu049jX1dTv+NGK7sjv6MIAgb/p5b7Ew7vu/bqm9boAprg5nbcAdK/2/6jQzqYBgaXf9poDb4fv/YLI53j3/HWAhnLW52NXY1qmXEVPST1dLSY7GBwEEBkhFhYhxvpg8vOV9ePv5uF78tiTy9Zx5tN46NJz6c81tc0dmskfv8bx08RjrMDE27609LzZ3ryq8Lbj/bGmvKYDmabg/aXR+ZzFuZPWmIJsi4K93Wy3dWHc6F+Cdl8aPl13ZVRQWk86OzJzOisdICR28KetAAAANXRSTlMA/QcXCuTfHPr0uWME9+ro8B/yEA7tyKaPaTEUrZ1POMG0g3pvYCrc1cyTJId/d1U90FwmRFUxM9UAAAZ6SURBVEjHjZZlVBtBEMdzhCgkIbRAgVLq7m1uz+JCEogUKRRKgba41N3d3d3d3d3d3d3dv3Uu0ryWvr7Ol2TltzOz89/d45QybkBUaFR4RFn46xcZ6c/5T4uszBNhImmtetGR1RuXqx0ezfXzDfpz5WzTZ2Ujy/i7OvwCZIgiaYSCa0bVkookIbxKAWVcUwLLCppWEdcQe5psj6BCvbDa9QMqRDcRVBdjFGnXKUkKCTEUhxDC+AGBnMAy8gp1Q3lBGNv082AVxLJgoSQoRMbjh1YUIXWrlCH5OjWQCEAwcfXq1Wo3kokwRNOwTiWum5OzLkiSpigKehGl7NqGSRow3EEmOo/snwtccMUaIRIEc5TaIgdC/Doed5CRzaalKBpgGHSmaQiC0KSkFeoWFR+fm84uBmNK0pE/pKON9nL+9YMoR272wNQuXQsdOp3OqdugwRUKgoi/uuH52VP7dcColWpdfouUNsxGB4mJuR5/Uko9lGFwXKNJSpgxNbdFAqEyt1bEx65tPv/j++IjzkRdUZeBCRqciG8znKRElT01rVMDI7UDGQInCAafsnnSJEI1+d5MFXO3uHv34lNnj3dNG5CgUeA4jGfbSIxXIdDNlaktgT1MYnCIbeq+5WPMqsn7LmV2mFG8tEezV81OP2sei4O5Qs+laGEY11u/hjUwmmwRTyiYpPXnY3q17bfmQ0yfTlNedz/QbFyzRU9iCWBYI2K70iioqt8vsVQORspWzRmc6Ld1ZUyfQX23fI9pN8K8MXnTyWbNesyP92A4kWyjsRrRPpVVr4WR6tT2DD5xx5WYFZ36blkZc3lkv5u7doG/Hh3bE16uBU1hNetH/JKof5UgRNoS2jMebutF8Nf6wNKTgI1LZrxhJrdykpgkhF+pWlkPKKiEUcrO8czEGytjeudMmXY+pk+eYVPx0kU9Tt+BvD3+krrYlSA/VqL+bn/yupChvX/71dPeXhrfVjH94cUTHUbMnDG/e/fbsV5MAQXOTm0FwkUoNIKtQ0SVilIMKZ2zt/WcM+3WTAuTtGb7uvHtxlig8owb82ZIJAwZXkQhaTjEWI4Px4NUKufOntOnz4O+BrPZvGrdy3ZLBlkIxlMCH8jEt0mlqODagAUjCihHl1lJ1oLe7TLntWxZkFHS7kRbk6vaf3BE8yH5WtZfVRmi1VRhajboT2HtcKwkKyurd1aveW31ir9Qmo75OgqhRhGc8kKa6twxWQNrA6i35gwbOWZkQU5rFVClsJQuWjUN6VUpy6mJkfYUyAN3b5nKZLW2NuktPmc+Lrmznb0/RI2qcDngj1Ln9ydcG8Bq12JSqRQuqhSXXeSE4vEqV4fqsflRSltHnGDPicrUetDhwSqFmyoVZ66WRJIwAVBsGUIQIrUtNARu0Q/uZDi2bJilFOLhYjurKYxfzS1PbmUZgGTaapPZMGLJwV4ZhtYQ5t/B5oVKhNWM9pzbqnyoe+L6OYcz8hZeLmmZ00GFl2Zc+TP9HSTCyss9x6FBKBbXbe+5XiWZGSt6T+g1YbAeyD8ptodgcnUkEpXjcrxXmnH04sy8gszMngsLxvcc6eJ8agHGpGd3DlJMI2kkC/d3H/hyom67zw0zGFr27Lkkz5DD1hymWeDXg6k6DZpEsDdX+zZD4fCK5W5/9YKNY89kAFeyZ8xgk17h0o6prcYja8LSIfNdWouBA/qnpDSf1YpE/AiO+xEKGdXtxbKDeeOzNq+alToAKFxlbbnwvl4BJLjW53x+kzhKq8Uc9sKuNgo4b5xkeu6EZSVZh6bPtjuHt2EUekNB7y+PpycTBCsIU97yo4m0y1zPjSdObiVMXTS57bZH29NHkWpnUYLKas34sXhsorIVXN5g5mHL9xoxoVCIAQRSC/Dui4S0p14vTDfSNAXiuWZtOeHC0dHGOHiDbGnZsQrzvG8LjMKaYeXFoXwe/9fTGdhYirRaLXvnSIIwKnFoRtan3d3SEYaBkEh756n99lwArnydSK6gTnQT31MtKC9EFGg9mB9VT4a6Pf26eKwxDgWJK4ZgCHyioYfOjE0X1S39kdCwPC8kiFexSsNIuBLjRi+AGDFeXbk8XCwVwn2QuHMnipM2CCzFBXIbhldtKoAF/arxUJwxHQlrNS4DLUG1MB68taOMCAttwvmb+QHk+xCRhUX7ubu5DaJ4EkwiDW0AHf8ybrWoilEBcl8sgvCwWmFVI37DfgLlQx5DKJlyeAAAAABJRU5ErkJggg==",
                ];
              return {
                text: "尾号"
                  .concat(e, "，连续充值")
                  .concat(t, "个月抽中")
                  .concat(a, "元充值券"),
                img: s[Math.floor(Math.random() * s.length)],
              };
            })),
              A(() => {
                c(a.value);
              }),
              window.addEventListener("load", c),
              window.addEventListener("resize", c);
          }),
          (e, t) => (
            n(),
            l("div", Fn, [
              _("div", Wn, [
                (n(!0),
                l(
                  w,
                  null,
                  b(
                    a.value,
                    (e, t) => (
                      n(),
                      l("div", { key: t, class: "barrage_container_item" }, [
                        _("img", { src: e.img }, null, 8, Xn),
                        _("p", Gn, I(e.text), 1),
                      ])
                    )
                  ),
                  128
                )),
              ]),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-cf79058f"]]
  ),
  Zn = (e) => (p("data-v-9f86486b"), (e = e()), v(), e),
  Qn = { key: 0, class: "hb" },
  Kn = { class: "hb-top" },
  Jn = { class: "hb-top-title" },
  $n = Zn(() =>
    _("div", { class: "hb-top-xr" }, "新人: 近6个月APP未充值~", -1)
  ),
  el = { class: "hb-receive-tag" },
  tl = Zn(() =>
    _(
      "div",
      { class: "hb-receive-price" },
      [_("span", null, "￥"), _("span", null, "50")],
      -1
    )
  ),
  al = Zn(() =>
    _(
      "div",
      { class: "hb-receive-text" },
      [
        _("p", null, "充值加赠券"),
        _("p", null, [
          _("span", null, "10"),
          x("元*"),
          _("span", null, "5"),
          x("个月"),
        ]),
      ],
      -1
    )
  ),
  sl = { key: 0 },
  nl = { key: 1, class: "hb-list" },
  ll = { class: "hb-list-item" },
  cl = { key: 0, class: "hb-list-item-tag" },
  il = { class: "hb-list-item-left" },
  ol = Zn(() => _("span", null, "￥", -1)),
  ul = { class: "hb-list-item-right" },
  dl = { class: "hb-list-item-right-text" },
  rl = { key: 1, class: "btn5" },
  pl = { class: "hb-tips" },
  vl = Zn(() => _("span", null, "Tips", -1)),
  _l = nt(
    {
      __name: "hbFloor",
      setup(a) {
        const o = ct(),
          { activityInfo: u, userInfo: r, ifShowXrl: p } = m(o),
          { ButtonClick: v, ButtonExposure: h } = M(),
          z = e(!1),
          P = e(),
          E = e(!1),
          S = e(""),
          T = e(),
          D = ["noStart", "receive", "noStock"],
          A = e(),
          L = e(!0),
          N = e(7),
          R = {
            270: {
              type: "hb",
              api: Pe,
              text: "湖北专属",
              showCondition: (e) => e.isHbShow,
            },
            731: {
              type: "hn",
              api: Ee,
              text: "湖南专属",
              showCondition: (e) => e.isHnShow,
            },
          }[r.value.provinceCode],
          j = t(() => (null == R ? void 0 : R.text)),
          O = g.throttle(
            async () => {
              try {
                const { code: e, data: t } = await R.api();
                if (((p.value = R.showCondition(t)), !t || !p.value)) return;
                if (((N.value = t.startTime), "0" === e && t)) {
                  t.prizeList.forEach((e, t) => {
                    (e.btnName = [
                      "本月",
                      "次月",
                      "次次月",
                      "次次次月",
                      "次次次次月",
                    ][t]),
                      (e.sortNumber = t),
                      e.sendStatus.includes("激活") ||
                      e.sendStatus.includes("可用")
                        ? ((e.showTag = !0), (e.sortNumber = 5))
                        : (e.sortNumber = e.sendStatus);
                  });
                  if (new Date(t.currentTime).getHours() < N.value)
                    return void (A.value = D[0]);
                  t.prizeList.every((e) => 9 == e.sendStatus)
                    ? (A.value = D[2])
                    : t.prizeList.every((e) => 8 == e.sendStatus)
                    ? (A.value = D[1])
                    : (z.value = !0),
                    L.value &&
                      !z.value &&
                      h({ button_name: "".concat(j.value, "优惠") }),
                    (L.value = !1),
                    t.prizeList.sort((e, t) => e.sortNumber - t.sortNumber),
                    (P.value = t.prizeList);
                }
                f();
              } catch (e) {
                p.value = !1;
              }
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          U = () => {
            A.value === D[1] &&
              (v({ button_name: "".concat(j.value, "_充值加赠券_立即领取") }),
              (T.value = null == R ? void 0 : R.type),
              (E.value = !0));
          },
          H = () => {
            (E.value = !1), O(), o.getPrizeUnuse();
          },
          V = g.debounce(
            () => {
              v({ button_name: "".concat(j.value, "_刷新按钮") }),
                k({ message: "加载中...", forbidClick: !0 }),
                (A.value = ""),
                O();
            },
            1e3,
            { leading: !0, trailing: !1 }
          );
        return (
          s(() => {
            O(),
              document.addEventListener("visibilitychange", () => {
                O();
              });
          }),
          (e, t) => {
            var a;
            const s = Ha;
            return c(p)
              ? (n(),
                l("div", Qn, [
                  _("div", Kn, [
                    _("div", Jn, I(j.value) + "优惠", 1),
                    $n,
                    _("div", {
                      class: "hb-top-refresh",
                      onClick: t[0] || (t[0] = (...e) => c(V) && c(V)(...e)),
                    }),
                  ]),
                  z.value
                    ? d("", !0)
                    : (n(),
                      l(
                        "div",
                        {
                          key: 0,
                          class: y([
                            "hb-receive",
                            { noStockBg: A.value === D[2] },
                          ]),
                        },
                        [
                          _("div", el, I(j.value), 1),
                          tl,
                          al,
                          _(
                            "div",
                            {
                              class: y(["hb-receive-btn", A.value]),
                              onClick: U,
                            },
                            [
                              A.value === D[0]
                                ? (n(), l("span", sl, "未开始"))
                                : d("", !0),
                            ],
                            2
                          ),
                        ],
                        2
                      )),
                  z.value && (null == (a = P.value) ? void 0 : a.length) > 0
                    ? (n(),
                      l("div", nl, [
                        (n(!0),
                        l(
                          w,
                          null,
                          b(P.value, (e, t) => {
                            var a, s;
                            return (
                              n(),
                              l("div", { key: t }, [
                                _("div", ll, [
                                  e.leftShow
                                    ? (n(), l("div", cl, I(j.value), 1))
                                    : d("", !0),
                                  _("div", il, [
                                    ol,
                                    x(),
                                    _("span", null, I(c(X)(e.shortName)[0]), 1),
                                  ]),
                                  _("div", ul, [
                                    _("div", dl, I(e.name), 1),
                                    _(
                                      "div",
                                      {
                                        class: y([
                                          "hb-list-item-right-btn",
                                          "btn" + e.sendStatus,
                                        ]),
                                      },
                                      [
                                        "1" === e.sendStatus
                                          ? (n(),
                                            i(
                                              c(Pt),
                                              {
                                                key: 0,
                                                "launch-url": c($)(
                                                  "app",
                                                  (null == (a = c(u))
                                                    ? void 0
                                                    : a.telNo) || "",
                                                  e.cardNo
                                                ),
                                                "middle-launch-url": c($)(
                                                  "middleLaunchUrl",
                                                  (null == (s = c(u))
                                                    ? void 0
                                                    : s.telNo) || "",
                                                  e.cardNo
                                                ),
                                                "btn-name": ""
                                                  .concat(
                                                    j.value,
                                                    "充值加赠券_"
                                                  )
                                                  .concat(e.btnName, "_去使用"),
                                              },
                                              null,
                                              8,
                                              [
                                                "launch-url",
                                                "middle-launch-url",
                                                "btn-name",
                                              ]
                                            ))
                                          : d("", !0),
                                        e.showTag
                                          ? (n(),
                                            l("div", rl, I(e.sendStatus), 1))
                                          : d("", !0),
                                      ],
                                      2
                                    ),
                                  ]),
                                ]),
                              ])
                            );
                          }),
                          128
                        )),
                      ]))
                    : d("", !0),
                  _("div", pl, [
                    vl,
                    x("快邀请亲友，"),
                    _("span", null, "每天" + I(N.value) + "点", 1),
                    x("准时抢限量福利，先到先得。 "),
                  ]),
                  C(
                    s,
                    {
                      "pop-show": E.value,
                      "pop-up-type": T.value,
                      "pop-param": S.value,
                      onClosePop: H,
                    },
                    null,
                    8,
                    ["pop-show", "pop-up-type", "pop-param"]
                  ),
                ]))
              : d("", !0);
          }
        );
      },
    },
    [["__scopeId", "data-v-9f86486b"]]
  ),
  ml = { class: "assist" },
  gl = nt(
    {
      __name: "assistResult",
      setup(t) {
        const { PopExposure: a, PopClick: s } = M(),
          l = lt(),
          u = ["PRIZE", "SUCCESS", "ERROR", "NETWORK", "HIGHRISK"],
          d = e(),
          r = e(),
          p = e(!1);
        let v = null;
        const m = e(null),
          g = () => {
            const e = [u[0], u[1]].includes(d.value) ? "成功" : "失败";
            s({
              window_name: "拼图模块_助力".concat(e, "弹窗"),
              button_name: "拼图模块_助力".concat(e, "弹窗_我知道了"),
            }),
              l.openAssitPop(!1),
              v && v.destroy();
          },
          y = (e) => {
            v && v.destroy(),
              A(() => {
                const t = {
                  name: "VenueAnimation",
                  container: m.value,
                  renderer: "svg",
                  loop: !1,
                  autoplay: !0,
                  animationData: e,
                };
                (v = _t.loadAnimation(t)),
                  v.addEventListener("DOMLoaded", () => {
                    const e = document.getElementById("errorCloseBtn");
                    e &&
                      e.addEventListener("click", () => {
                        g();
                      });
                    const t = document.getElementById("knowBtn");
                    p.value &&
                      (t.children[0].href.baseVal =
                        "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/go_share.CYz6j6mD.png"),
                      t &&
                        t.addEventListener("click", () => {
                          p.value &&
                            (async () => {
                              const e = await Ce({ constId: window.__constId });
                              "0" === e.code && e.data
                                ? l.posterPop(!0, e.data)
                                : "160030" === e.code && l.openHighRiskPop(!0);
                            })(),
                            g();
                        });
                  }),
                  v.addEventListener("complete", () => {
                    v.playSegments([100, 200], !0);
                  });
              });
          };
        return (
          h(
            () => l.assistShow,
            (e) => {
              e &&
                (async (e) => {
                  const { code: t, data: s } = e;
                  if (
                    ((p.value = s && s.finished),
                    ["0", "160047", "160048", "160049"].includes(t))
                  ) {
                    a({
                      window_name: "拼图模块_助力成功弹窗_".concat(pt[t]),
                      button_name: "拼图模块_助力成功弹窗_我知道了",
                    }),
                      (d.value = u[1]),
                      (r.value = vt[t]);
                    const { default: e } = await rt(
                        () =>
                          import("./vendor/json.BeDsP0r3.js").then((e) => e.c),
                        __vite__mapDeps([])
                      ),
                      n = e.layers.find((e) => "prizePhone" === e.ln);
                    n &&
                      (n.t.d.k[0].s.t = "您已为好友".concat(
                        s.inviter,
                        "\r成功助力"
                      )),
                      y(e);
                  } else {
                    a({
                      window_name: "拼图模块_助力失败弹窗_".concat(pt[t]),
                      button_name: "拼图模块_助力失败_点击我知道了",
                    }),
                      (d.value = u[2]),
                      (r.value = vt[null != t ? t : "160054"]);
                    const { default: e } = await rt(
                        () =>
                          import("./vendor/json.BeDsP0r3.js").then((e) => e.d),
                        __vite__mapDeps([])
                      ),
                      s = e.layers.find((e) => "errorTitle" === e.ln);
                    s && (s.t.d.k[0].s.t = "很遗憾，助力失败");
                    const n = e.layers.find((e) => "errorText" === e.ln);
                    n && (n.t.d.k[0].s.t = r.value), y(e);
                  }
                })(l.assistData);
            }
          ),
          (e, t) => (
            n(),
            i(
              c(P),
              { show: c(l).assistShow },
              {
                default: o(() => [
                  _("div", ml, [
                    _(
                      "div",
                      {
                        ref_key: "assistAnimation",
                        ref: m,
                        class: "assist-animation",
                      },
                      null,
                      512
                    ),
                  ]),
                ]),
                _: 1,
              },
              8,
              ["show"]
            )
          )
        );
      },
    },
    [["__scopeId", "data-v-53a51f98"]]
  ),
  hl = { class: "confirm" },
  yl = ((e) => (p("data-v-c21aebcf"), (e = e()), v(), e))(() =>
    _("div", { class: "confirm-text" }, "活动太火爆了，请稍后重试", -1)
  ),
  wl = nt(
    {
      __name: "FailedPop",
      emits: ["retry", "close"],
      setup(e, { emit: t }) {
        const a = lt(),
          { PopExposure: s, PopClick: l } = M(),
          u = t,
          d = () => {
            u("close");
          },
          r = () => {
            1 != a.picFailedType &&
              (l({
                window_name: "邀请模块_抽卡弹窗_抽卡失败_网络异常",
                button_name: "邀请模块_抽卡弹窗_抽卡失败_立即重试",
              }),
              u("retry"));
          };
        return (
          h(
            () => a.picFailedVisible,
            (e) => {
              e && s({ window_name: "邀请模块_抽卡弹窗_抽卡失败_网络异常" });
            }
          ),
          (e, t) => {
            const s = P;
            return (
              n(),
              i(
                s,
                { show: c(a).picFailedVisible },
                {
                  default: o(() => [
                    _("div", hl, [
                      yl,
                      _(
                        "div",
                        {
                          class: y([
                            "confirm-btn",
                            { disabled: 1 == c(a).picFailedType },
                          ]),
                          onClick: r,
                        },
                        null,
                        2
                      ),
                    ]),
                    _("div", { class: "confirm-close", onClick: d }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-c21aebcf"]]
  ),
  bl = { class: "confirm" },
  Il = ((e) => (p("data-v-4136cf3e"), (e = e()), v(), e))(() =>
    _("div", { class: "confirm-text" }, "网络异常，请稍后重试～", -1)
  ),
  fl = nt(
    {
      __name: "highRiskPop",
      setup(e) {
        const { PopExposure: t } = M(),
          a = lt(),
          s = () => {
            a.openHighRiskPop(!1);
          };
        return (
          h(
            () => a.highRiskVisible,
            (e) => {
              e &&
                t({
                  // 砍价高风险弹窗
                  window_name: "邀请模块_抽卡弹窗_抽卡失败_高风险",
                });
            }
          ),
          (e, t) => {
            const l = P;
            return (
              n(),
              i(
                l,
                { show: c(a).highRiskVisible },
                {
                  default: o(() => [
                    _("div", bl, [
                      Il,
                      _("div", {
                        class: "confirm-btn",
                        onClick: t[0] || (t[0] = (e) => s()),
                      }),
                    ]),
                    _("div", {
                      class: "confirm-close",
                      onClick: t[1] || (t[1] = (e) => s()),
                    }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-4136cf3e"]]
  ),
  kl = (e) => (p("data-v-409e8964"), (e = e()), v(), e),
  zl = { class: "detail" },
  Pl = kl(() => _("div", { class: "detail_title" }, "我的邀请明细", -1)),
  El = { key: 0, class: "detail_content" },
  Cl = { class: "detail_content_item_text" },
  Sl = { key: 1, class: "detail_nolist" },
  Tl = [
    kl(() => _("div", { class: "detail_nolist_img" }, null, -1)),
    kl(() =>
      _("div", { class: "detail_nolist_text" }, "您暂时还没邀请到好友哦~", -1)
    ),
  ],
  xl = kl(() => _("div", { class: "detail_tips" }, "我的邀请每月会清空哦", -1)),
  Dl = nt(
    {
      __name: "inviteDetail",
      setup(t) {
        const a = lt(),
          s = e([]),
          u = () => {
            a.openInviteDetailPop(!1);
          };
        return (
          h(
            () => a.inviteDetailShow,
            (e) => {
              e &&
                (async () => {
                  const { code: e, data: t } = await Se();
                  "0" == e && (s.value = t);
                })();
            }
          ),
          (e, t) => {
            const d = P;
            return (
              n(),
              i(
                d,
                { show: c(a).inviteDetailShow },
                {
                  default: o(() => [
                    _("div", zl, [
                      Pl,
                      s.value && s.value.length > 0
                        ? (n(),
                          l("div", El, [
                            (n(!0),
                            l(
                              w,
                              null,
                              b(
                                s.value,
                                (e, t) => (
                                  n(),
                                  l(
                                    "div",
                                    { key: t, class: "detail_content_item" },
                                    [_("div", Cl, "尾号" + I(e), 1)]
                                  )
                                )
                              ),
                              128
                            )),
                          ]))
                        : (n(), l("div", Sl, Tl)),
                      xl,
                    ]),
                    _("div", { class: "close", onClick: u }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-409e8964"]]
  ),
  Al =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp1_0.DisbhI8V.png",
  Ll =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp1_1.DNpiTUS_.png",
  Nl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp1_2.1JMeM7E2.png",
  Rl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp1_3.CZEkj8N9.png",
  jl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp2_0.CtVel02-.png",
  Ol =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp2_1.VxXGsK68.png",
  Ul =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp2_2.D0tEW2Td.png",
  Hl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp2_3.DZZds0rK.png",
  Vl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp2_4.D1v8bN6c.png",
  ql =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp2_5.BedrM6Vs.png",
  Bl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_0.B0mlsLvO.png",
  Ml =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_1.Bhy77qJN.png",
  Fl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_2.C5BaVZvD.png",
  Wl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_3.ZJ-9aGEP.png",
  Xl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_4.DP56UYKj.png",
  Gl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_5.DNlGD8Mp.png",
  Yl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_6.C7_armU7.png",
  Zl =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_7.c5HHTVdH.png",
  Ql =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/dp3_8.jl_v6ZCz.png";
const Kl = nt(
    {
      name: "ScrollBar",
      props: {
        designWidth: { type: [Number, String], default: 750, required: !1 },
        width: { type: [Number, String], required: !0 },
        height: { type: [Number, String], required: !0 },
        mode: { type: String, default: "y", required: !1 },
        thicknessX: { type: [Number, String], default: 10, required: !1 },
        thicknessY: { type: [Number, String], default: 10, required: !1 },
        trackColorX: { type: String, default: "#FFE0BF", required: !1 },
        trackColorY: { type: String, default: "#FFE0BF", required: !1 },
        barColorX: { type: String, default: "#FFBE79", required: !1 },
        barColorY: { type: String, default: "#FFBE79", required: !1 },
        offsetY: { type: [Number, String], default: 10, required: !1 },
        barRadiusX: { type: [Number, String], default: 10, required: !1 },
        barRadiusY: { type: [Number, String], default: 10, required: !1 },
        clickActionX: { type: Boolean, default: !0, required: !1 },
        clickActionY: { type: Boolean, default: !0, required: !1 },
      },
      setup(a, { expose: n }) {
        const l = e(null),
          c = e(!1),
          i = e(!1),
          o = e(0),
          u = e(0),
          d = e(0),
          r = e(0),
          p = e(0),
          v = e(0),
          _ = e(0),
          m = e(0),
          g = (e) => 100 * (e / a.designWidth).toFixed(4),
          y = t(() => ({
            position: "relative",
            width: "".concat(g(a.width), "vw"),
            height: "".concat(g(a.height), "vw"),
          })),
          w = t(() => ({
            width: "".concat(g(a.thicknessY), "vw"),
            backgroundColor: a.trackColorY,
            borderRadius: "".concat(g(a.barRadiusY), "vw"),
            right: "-".concat(g(a.offsetY), "vw"),
          })),
          b = t(() => ({
            width: "".concat(g(a.thicknessY), "vw"),
            opacity: 0,
            borderRadius: "".concat(g(a.barRadiusY), "vw"),
          })),
          I = t(() => ({
            height: "".concat(g(a.thicknessX), "vw"),
            backgroundColor: a.trackColorX,
            borderRadius: "".concat(g(a.barRadiusX), "vw"),
          })),
          f = t(() => ({
            height: "".concat(g(a.thicknessX), "vw"),
            opacity: 0,
            borderRadius: "".concat(g(a.barRadiusX), "vw"),
          })),
          k = t(() =>
            a.mode.includes("y")
              ? d.value < o.value
                ? (1 - d.value / o.value).toFixed(4) * o.value
                : 0.5 * o.value * (o.value / d.value)
              : 0
          ),
          z = t(() =>
            a.mode.includes("x")
              ? r.value < u.value
                ? (1 - r.value / u.value).toFixed(4) * u.value
                : 0.5 * u.value * (u.value / r.value)
              : 0
          ),
          P = t(() => ({
            top: p.value + "%",
            height: (k.value / o.value) * 100 + "%",
            left: v.value + "%",
            width: (z.value / u.value) * 100 + "%",
          })),
          E = t(() => ({
            width: "".concat(g(a.thicknessY), "vw"),
            backgroundColor: a.barColorY,
            borderRadius: "".concat(g(a.barRadiusY), "vw"),
            top: P.value.top,
            height: P.value.height,
          })),
          C = t(() => ({
            height: "".concat(g(a.thicknessX), "vw"),
            backgroundColor: a.barColorX,
            borderRadius: "".concat(g(a.barRadiusX), "vw"),
            left: P.value.left,
            width: P.value.width,
          })),
          S = t(() => ({
            position: "absolute",
            width: "".concat(
              a.mode.includes("y") ? g(a.width - a.thicknessY) : g(a.width),
              "vw"
            ),
            height: "".concat(
              a.mode.includes("x") ? g(a.height - a.thicknessX) : g(a.height),
              "vw"
            ),
            overflowY: "".concat(a.mode.includes("y") ? "auto" : "hidden"),
            overflowX: "".concat(a.mode.includes("x") ? "auto" : "hidden"),
          })),
          T = () => {
            a.mode.includes("y") &&
              ((o.value =
                (document.body.clientWidth / a.designWidth) * a.height),
              (p.value = 0),
              (d.value = l.value.scrollHeight - o.value),
              (i.value = d.value > 1)),
              a.mode.includes("x") &&
                ((u.value =
                  (document.body.clientWidth / a.designWidth) * a.width),
                (v.value = 0),
                (r.value = l.value.scrollWidth - u.value),
                (c.value = r.value > 1)),
              l.value.scrollTo(0, 0);
          },
          x = (e) => 1 - Math.pow(1 - e, 3);
        return (
          s(() => {
            T(), window.addEventListener("resize", T);
          }),
          h(
            () => [a.width, a.height],
            () => {
              T();
            }
          ),
          n({ reset: T }),
          {
            wrapRef: l,
            showScrollbarX: c,
            showScrollbarY: i,
            containerStyle: y,
            trackYStyle: w,
            trackYClickStyle: b,
            trackXStyle: I,
            trackXClickStyle: f,
            barYStyle: E,
            barXStyle: C,
            wrapStyle: S,
            scrollHandler: (e) => {
              e.preventDefault(),
                a.mode.includes("y") &&
                  ((p.value =
                    100 *
                    (
                      ((e.target.scrollTop / d.value) * (o.value - k.value)) /
                      o.value
                    ).toFixed(4)),
                  (_.value = e.target.scrollTop)),
                a.mode.includes("x") &&
                  ((v.value =
                    100 *
                    (
                      ((e.target.scrollLeft / r.value) * (u.value - z.value)) /
                      u.value
                    ).toFixed(4)),
                  (m.value = e.target.scrollLeft));
            },
            trackYClick: (e) => {
              if (!a.clickActionY) return;
              const t = o.value - k.value,
                s = l.value.scrollHeight - o.value;
              let n = 0;
              (n = e.offsetY < t ? (e.offsetY / t) * s : s),
                l.value.scrollTo(m.value, n),
                (_.value = n);
            },
            trackXClick: (e) => {
              if (!a.clickActionX) return;
              const t = u.value - z.value,
                s = l.value.scrollWidth - u.value;
              let n = 0;
              (n = e.offsetX < t ? (e.offsetX / t) * s : s),
                l.value.scrollTo(n, _.value),
                (m.value = n);
            },
            scrollXTo: (e, t = { animate: !0, duration: 2 }) => {
              if ("number" != typeof e || e < 0) return;
              if ("object" != typeof t) return;
              if ("number" != typeof t.duration) return;
              const s = e > 1 ? 1 : e;
              if (a.mode.includes("x")) {
                const e = s * (l.value.scrollWidth - u.value);
                if (!0 === t.animate) {
                  const a = 1e3 * t.duration,
                    s = 30;
                  let n = parseInt(a / s);
                  const c = e - m.value;
                  let i = 1,
                    o = 0;
                  const u = setInterval(() => {
                    if (i <= n) {
                      const e = x(i / n) * c;
                      l.value.scrollTo(m.value + e - o, _.value),
                        (o = _.value + e - o),
                        i++;
                    } else clearInterval(u);
                  }, s);
                } else l.value.scrollTo(e, _.value), (m.value = e);
              }
            },
            scrollYTo: (e, t = { animate: !0, duration: 2 }) => {
              if ("number" != typeof e || e < 0) return;
              if ("object" != typeof t) return;
              if ("number" != typeof t.duration) return;
              const s = e > 1 ? 1 : e;
              if (a.mode.includes("y")) {
                const e = s * (l.value.scrollHeight - o.value);
                if (!0 === t.animate) {
                  const a = 1e3 * t.duration,
                    s = 30;
                  let n = parseInt(a / s);
                  const c = e - _.value;
                  let i = 1,
                    o = 0;
                  const u = setInterval(() => {
                    if (i <= n) {
                      const e = x(i / n) * c;
                      l.value.scrollTo(m.value, _.value + e - o),
                        (o = _.value + e - o),
                        i++;
                    } else clearInterval(u);
                  }, s);
                } else l.value.scrollTo(m.value, e), (_.value = e);
              }
            },
          }
        );
      },
    },
    [
      [
        "render",
        function (e, t, a, s, c, i) {
          return (
            n(),
            l(
              "div",
              { style: D(s.containerStyle), class: "scroll-container" },
              [
                s.showScrollbarY
                  ? (n(),
                    l(
                      "div",
                      {
                        key: 0,
                        class: "track track-y",
                        style: D(s.trackYStyle),
                      },
                      [
                        _(
                          "div",
                          { class: "bar bar-y", style: D(s.barYStyle) },
                          null,
                          4
                        ),
                      ],
                      4
                    ))
                  : d("", !0),
                s.showScrollbarY
                  ? (n(),
                    l(
                      "div",
                      {
                        key: 1,
                        class: "track track-y",
                        style: D(s.trackYClickStyle),
                        onClick:
                          t[0] ||
                          (t[0] = (...e) =>
                            s.trackYClick && s.trackYClick(...e)),
                      },
                      null,
                      4
                    ))
                  : d("", !0),
                s.showScrollbarX
                  ? (n(),
                    l(
                      "div",
                      {
                        key: 2,
                        class: "track track-x",
                        style: D(s.trackXStyle),
                      },
                      [
                        _(
                          "div",
                          { class: "bar bar-x", style: D(s.barXStyle) },
                          null,
                          4
                        ),
                      ],
                      4
                    ))
                  : d("", !0),
                s.showScrollbarX
                  ? (n(),
                    l(
                      "div",
                      {
                        key: 3,
                        class: "track track-x",
                        style: D(s.trackXClickStyle),
                        onClick:
                          t[1] ||
                          (t[1] = (...e) =>
                            s.trackXClick && s.trackXClick(...e)),
                      },
                      null,
                      4
                    ))
                  : d("", !0),
                _(
                  "div",
                  {
                    ref: "wrapRef",
                    class: "wrap",
                    style: D(s.wrapStyle),
                    onScroll:
                      t[2] ||
                      (t[2] = (...e) =>
                        s.scrollHandler && s.scrollHandler(...e)),
                  },
                  [R(e.$slots, "default", {}, void 0, !0)],
                  36
                ),
              ],
              4
            )
          );
        },
      ],
      ["__scopeId", "data-v-ef12a445"],
    ]
  ),
  Jl = (e) => (p("data-v-aa231a07"), (e = e()), v(), e),
  $l = { class: "detail" },
  ec = { class: "detail-content-tab" },
  tc = ["onClick"],
  ac = { class: "detail-list" },
  sc = { class: "detail-list-item-right" },
  nc = { class: "detail-list-item-right-title" },
  lc = { class: "detail-list-item-right-subtitle" },
  cc = { class: "detail-list-item-right-subtitle-txt" },
  ic = { key: 1, class: "detail-empty" },
  oc = [
    Jl(() => _("div", { class: "detail-empty-img" }, null, -1)),
    Jl(() =>
      _("div", { class: "detail-empty-text" }, "您还没有拼图哦，快去拼图吧", -1)
    ),
  ],
  uc = Jl(() => _("div", { class: "detail-tips" }, "拼图记录每月会清空哦", -1)),
  dc = nt(
    {
      __name: "puzzleDetail",
      setup(t) {
        const { PopExposure: a, PopClick: s } = M(),
          u = lt(),
          r = ["95折拼图", "9折拼图", "8折拼图"],
          p = ["抽奖", "赠出", "获赠"],
          v = e(0),
          m = e({}),
          g = e([]),
          f = e("r95"),
          k = [
            { index: 0, name: "95折拼图", status: "r95" },
            { index: 1, name: "9折拼图", status: "r9" },
            { index: 2, name: "8折拼图", status: "r8" },
          ],
          z = () => {
            u.openPuzzleDetailPop(!1);
          },
          E = (e) => {
            (v.value = e.index), (f.value = e.status);
            if (document.querySelector(".detail-content-tab-item.middle")) {
              const t = document.querySelector(
                ".detail-content-tab-item:nth-child(2)"
              );
              t.style.setProperty("--left", "1"),
                t.style.setProperty("--right", "1"),
                0 === e.index
                  ? t.style.setProperty("--left", "0")
                  : 1 === e.index
                  ? (t.style.setProperty("--left", "0"),
                    t.style.setProperty("--right", "0"))
                  : 2 === e.index && t.style.setProperty("--right", "0");
            }
            g.value = [];
            const t = ["dp1", "dp2", "dp3"][e.index];
            (g.value = m.value[t] || []),
              s({ window_name: "拼图模块_拼图记录弹窗_" + r[e.index] });
          };
        return (
          h(
            () => u.puzzleDetailShow,
            (e) => {
              e &&
                (a({ window_name: "拼图模块_拼图记录弹窗_" + r[v.value] }),
                (async () => {
                  const e = await Te();
                  "0" === e.code && ((m.value = e.data), E(k[0]));
                })());
            }
          ),
          (e, t) => {
            const a = P;
            return (
              n(),
              i(
                a,
                { show: c(u).puzzleDetailShow },
                {
                  default: o(() => [
                    _("div", $l, [
                      _(
                        "div",
                        { class: y(["detail-content", f.value]) },
                        [
                          _("div", ec, [
                            (n(),
                            l(
                              w,
                              null,
                              b(k, (e) =>
                                _(
                                  "div",
                                  {
                                    key: e,
                                    class: y([
                                      "detail-content-tab-item",
                                      [
                                        {
                                          active: v.value == e.index,
                                          middle: 1 === e.index,
                                        },
                                      ],
                                    ]),
                                    onClick: (t) => E(e),
                                  },
                                  I(e.name),
                                  11,
                                  tc
                                )
                              ),
                              64
                            )),
                          ]),
                        ],
                        2
                      ),
                      g.value.length
                        ? (n(),
                          i(
                            c(Kl),
                            {
                              key: v.value,
                              width: 577,
                              height: 582,
                              "bar-color-y": "#CAC8D7",
                              "track-color-y": "#F6EBF4",
                            },
                            {
                              default: o(() => [
                                _("ul", ac, [
                                  (n(!0),
                                  l(
                                    w,
                                    null,
                                    b(g.value, (e, t) => {
                                      return (
                                        n(),
                                        l(
                                          "li",
                                          { key: t, class: "detail-list-item" },
                                          [
                                            _(
                                              "div",
                                              {
                                                class: "detail-list-item-left",
                                                style: D({
                                                  backgroundImage:
                                                    "url(".concat(
                                                      ((a = e.prize),
                                                      new URL(
                                                        Object.assign({
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp1_0.png":
                                                            Al,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp1_1.png":
                                                            Ll,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp1_2.png":
                                                            Nl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp1_3.png":
                                                            Rl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_0.png":
                                                            jl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_1.png":
                                                            Ol,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_2.png":
                                                            Ul,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_3.png":
                                                            Hl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_4.png":
                                                            Vl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_5.png":
                                                            ql,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_0.png":
                                                            Bl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_1.png":
                                                            Ml,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_2.png":
                                                            Fl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_3.png":
                                                            Wl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_4.png":
                                                            Xl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_5.png":
                                                            Gl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_6.png":
                                                            Yl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_7.png":
                                                            Zl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_8.png":
                                                            Ql,
                                                        })[
                                                          "/src/assets/img/ImgInvite/tcpuzzle/".concat(
                                                            a,
                                                            ".png"
                                                          )
                                                        ],
                                                        import.meta.url
                                                      ).href),
                                                      ")"
                                                    ),
                                                }),
                                              },
                                              null,
                                              4
                                            ),
                                            _("div", sc, [
                                              _("div", nc, I(e.type), 1),
                                              _("div", lc, [
                                                0 != e.tag
                                                  ? (n(),
                                                    l(
                                                      "div",
                                                      {
                                                        key: 0,
                                                        class: y([
                                                          "detail-list-item-right-subtitle-tag",
                                                          {
                                                            send: 1 === e.tag,
                                                            get: 2 === e.tag,
                                                          },
                                                        ]),
                                                      },
                                                      I(p[e.tag]),
                                                      3
                                                    ))
                                                  : d("", !0),
                                                _(
                                                  "div",
                                                  cc,
                                                  " 获得时间：" + I(e.time),
                                                  1
                                                ),
                                              ]),
                                            ]),
                                          ]
                                        )
                                      );
                                      var a;
                                    }),
                                    128
                                  )),
                                ]),
                              ]),
                              _: 1,
                            }
                          ))
                        : (n(), l("div", ic, oc)),
                      uc,
                    ]),
                    _("div", { class: "close", onClick: z }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-aa231a07"]]
  ),
  rc = { class: "container" },
  pc = { class: "title" },
  vc = { key: 0, class: "msg" },
  _c = ["src"],
  mc = { class: "container1" },
  gc = { class: "title" },
  hc = { class: "title1" },
  yc = ["src"],
  wc = { class: "btns" },
  bc = nt(
    {
      __name: "sendCardResult",
      emits: ["refresh"],
      setup(t, { emit: a }) {
        const { PopExposure: c, PopClick: i } = M(),
          u = a,
          d = e(""),
          r = e(!1),
          p = e(!1),
          v = e("领取成功"),
          m = e(""),
          g = e(""),
          h = e(""),
          y = e(""),
          b = e(""),
          f = () => {
            (r.value = !1), u("refresh"), xe("giveCard"), xe("requestCard");
          },
          k = () => {
            i({
              window_name: "拼图模块_拼图".concat(v.value),
              button_name: "拼图模块_拼图".concat(v.value, "_我知道了"),
            }),
              f();
          },
          z = () => {
            (p.value = !1),
              i({
                window_name: "拼图模块_赠送拼图二次确认弹窗_".concat(d.value),
                button_name: "拼图模块_赠送拼图二次确认弹窗_".concat(
                  d.value,
                  "_取消"
                ),
              });
          };
        return (
          s(() => {
            (async () => {
              const e = q("giveCard");
              if (((b.value = q("requestCard")), e)) {
                const t = await De({ givePuzzleToken: e });
                if ("0" === t.code) {
                  (r.value = !0), (v.value = "领取成功");
                  const e = t.data.puzzleId,
                    a = Object.assign({
                      "/src/assets/img/ImgInvite/tcpuzzle/dp1_0.png": () =>
                        rt(
                          () => import("./dp1_0.CQVEuHAq.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp1_1.png": () =>
                        rt(
                          () => import("./dp1_1.D7jzuXm5.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp1_2.png": () =>
                        rt(
                          () => import("./dp1_2.B2Tln9mg.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp1_3.png": () =>
                        rt(
                          () => import("./dp1_3.Ssx4tGzC.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_0.png": () =>
                        rt(
                          () => import("./dp2_0.uuUWxz8a.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_1.png": () =>
                        rt(
                          () => import("./dp2_1.CGdgrjbU.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_2.png": () =>
                        rt(
                          () => import("./dp2_2.CIeRUln8.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_3.png": () =>
                        rt(
                          () => import("./dp2_3.DfZ-zV4I.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_4.png": () =>
                        rt(
                          () => import("./dp2_4.BxhT1xce.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_5.png": () =>
                        rt(
                          () => import("./dp2_5.Bi04ASSl.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_0.png": () =>
                        rt(
                          () => import("./dp3_0.B4pc_mEW.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_1.png": () =>
                        rt(
                          () => import("./dp3_1.ByVCIxhg.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_2.png": () =>
                        rt(
                          () => import("./dp3_2.DwziPhPp.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_3.png": () =>
                        rt(
                          () => import("./dp3_3.BJu0bHgk.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_4.png": () =>
                        rt(
                          () => import("./dp3_4.6Pn82OTK.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_5.png": () =>
                        rt(
                          () => import("./dp3_5.BjcFsL_-.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_6.png": () =>
                        rt(
                          () => import("./dp3_6.Dd3NuJr0.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_7.png": () =>
                        rt(
                          () => import("./dp3_7.DqVR2V7y.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_8.png": () =>
                        rt(
                          () => import("./dp3_8.BtNKGtw4.js"),
                          __vite__mapDeps([])
                        ),
                    }),
                    s = Object.keys(a).find((t) => t.includes(e)),
                    n = await a[s]();
                  (h.value = n.default),
                    c({
                      window_name: "拼图模块_拼图领取成功_".concat(
                        t.data.puzzleName
                      ),
                      button_name: "拼图模块_拼图领取成功_".concat(
                        t.data.puzzleName,
                        "_我知道了"
                      ),
                    });
                } else
                  "160201" === t.code
                    ? xe("giveCard")
                    : ((r.value = !0),
                      (v.value = "领取失败"),
                      c({
                        window_name: "拼图模块_拼图领取失败_".concat(t.msg),
                        button_name: "拼图模块_拼图领取失败_".concat(
                          d.value,
                          "_我知道了"
                        ),
                      }),
                      (y.value = t.msg));
              } else if (b.value) {
                const e = await Ae({ reqPuzzleToken: b.value });
                if ("0" === e.code) {
                  const t = q("phone"),
                    a = e.data.puzzleId,
                    s = e.data.puzzleName;
                  d.value = e.data.puzzleName;
                  const n = e.data.puzzleNum;
                  (m.value =
                    1 === n
                      ? "".concat(s, "您只有1张，")
                      : "您确认要赠送尾号".concat(t, "好友")),
                    (g.value =
                      1 === n
                        ? "确认要赠送尾号".concat(t, "好友吗！")
                        : "一张".concat(s, "吗！"));
                  const l = Object.assign({
                      "/src/assets/img/ImgInvite/tcpuzzle/dp1_0.png": () =>
                        rt(
                          () => import("./dp1_0.CQVEuHAq.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp1_1.png": () =>
                        rt(
                          () => import("./dp1_1.D7jzuXm5.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp1_2.png": () =>
                        rt(
                          () => import("./dp1_2.B2Tln9mg.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp1_3.png": () =>
                        rt(
                          () => import("./dp1_3.Ssx4tGzC.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_0.png": () =>
                        rt(
                          () => import("./dp2_0.uuUWxz8a.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_1.png": () =>
                        rt(
                          () => import("./dp2_1.CGdgrjbU.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_2.png": () =>
                        rt(
                          () => import("./dp2_2.CIeRUln8.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_3.png": () =>
                        rt(
                          () => import("./dp2_3.DfZ-zV4I.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_4.png": () =>
                        rt(
                          () => import("./dp2_4.BxhT1xce.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp2_5.png": () =>
                        rt(
                          () => import("./dp2_5.Bi04ASSl.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_0.png": () =>
                        rt(
                          () => import("./dp3_0.B4pc_mEW.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_1.png": () =>
                        rt(
                          () => import("./dp3_1.ByVCIxhg.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_2.png": () =>
                        rt(
                          () => import("./dp3_2.DwziPhPp.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_3.png": () =>
                        rt(
                          () => import("./dp3_3.BJu0bHgk.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_4.png": () =>
                        rt(
                          () => import("./dp3_4.6Pn82OTK.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_5.png": () =>
                        rt(
                          () => import("./dp3_5.BjcFsL_-.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_6.png": () =>
                        rt(
                          () => import("./dp3_6.Dd3NuJr0.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_7.png": () =>
                        rt(
                          () => import("./dp3_7.DqVR2V7y.js"),
                          __vite__mapDeps([])
                        ),
                      "/src/assets/img/ImgInvite/tcpuzzle/dp3_8.png": () =>
                        rt(
                          () => import("./dp3_8.BtNKGtw4.js"),
                          __vite__mapDeps([])
                        ),
                    }),
                    i = Object.keys(l).find((e) => e.includes(a)),
                    o = await l[i]();
                  (h.value = o.default),
                    (p.value = !0),
                    c({
                      window_name: "拼图模块_赠送拼图二次确认弹窗_".concat(s),
                      button_name: "拼图模块_赠送拼图二次确认弹窗_"
                        .concat(s, "_取消，拼图模块_赠送拼图二次确认弹窗_")
                        .concat(s, "_确认"),
                    });
                } else
                  "160201" === e.code
                    ? xe("requestCard")
                    : ((r.value = !0),
                      (v.value = "赠送失败"),
                      c({
                        window_name: "拼图模块_拼图赠送失败_".concat(e.msg),
                        button_name: "拼图模块_拼图赠送失败_".concat(
                          d.value,
                          "_我知道了"
                        ),
                      }),
                      (y.value = e.msg));
              }
            })();
          }),
          (e, t) => {
            const a = P;
            return (
              n(),
              l(
                w,
                null,
                [
                  C(
                    a,
                    { show: r.value },
                    {
                      default: o(() => [
                        _("div", rc, [
                          _("div", pc, I(v.value), 1),
                          v.value.includes("失败")
                            ? (n(), l("div", vc, I(y.value), 1))
                            : (n(),
                              l(
                                "img",
                                { key: 1, class: "img", src: h.value },
                                null,
                                8,
                                _c
                              )),
                          _("div", { class: "footer-btn" }, [
                            _(
                              "div",
                              { class: "confirm-btn", onClick: k },
                              "我知道了"
                            ),
                          ]),
                        ]),
                        _("div", { class: "close", onClick: f }),
                      ]),
                      _: 1,
                    },
                    8,
                    ["show"]
                  ),
                  C(
                    a,
                    { show: p.value },
                    {
                      default: o(() => [
                        _("div", mc, [
                          _("p", gc, I(m.value), 1),
                          _("p", hc, I(g.value), 1),
                          _("img", { class: "img", src: h.value }, null, 8, yc),
                          _("div", wc, [
                            _("div", { class: "cancel", onClick: z }, "取消"),
                            _(
                              "div",
                              {
                                class: "confirm",
                                onClick:
                                  t[0] ||
                                  (t[0] = (e) =>
                                    (async (e) => {
                                      (p.value = !1),
                                        i({
                                          window_name:
                                            "拼图模块_赠送拼图二次确认弹窗_".concat(
                                              d.value
                                            ),
                                          button_name:
                                            "拼图模块_赠送拼图二次确认弹窗_".concat(
                                              d.value,
                                              "_确认"
                                            ),
                                        });
                                      const t = await Le({ reqPuzzleToken: e });
                                      if (((r.value = !0), "0" === t.code)) {
                                        v.value = "赠送成功";
                                        const e = t.data.puzzleId,
                                          a = Object.assign({
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp1_0.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp1_0.CQVEuHAq.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp1_1.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp1_1.D7jzuXm5.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp1_2.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp1_2.B2Tln9mg.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp1_3.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp1_3.Ssx4tGzC.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp2_0.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp2_0.uuUWxz8a.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp2_1.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp2_1.CGdgrjbU.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp2_2.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp2_2.CIeRUln8.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp2_3.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp2_3.DfZ-zV4I.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp2_4.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp2_4.BxhT1xce.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp2_5.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp2_5.Bi04ASSl.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_0.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_0.B4pc_mEW.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_1.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_1.ByVCIxhg.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_2.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_2.DwziPhPp.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_3.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_3.BJu0bHgk.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_4.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_4.6Pn82OTK.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_5.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_5.BjcFsL_-.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_6.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_6.Dd3NuJr0.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_7.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_7.DqVR2V7y.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                            "/src/assets/img/ImgInvite/tcpuzzle/dp3_8.png":
                                              () =>
                                                rt(
                                                  () =>
                                                    import(
                                                      "./dp3_8.BtNKGtw4.js"
                                                    ),
                                                  __vite__mapDeps([])
                                                ),
                                          }),
                                          s = Object.keys(a).find((t) =>
                                            t.includes(e)
                                          ),
                                          n = await a[s]();
                                        (h.value = n.default),
                                          c({
                                            window_name:
                                              "拼图模块_拼图赠送成功_".concat(
                                                t.data.puzzleName
                                              ),
                                            button_name:
                                              "拼图模块_拼图赠送成功_".concat(
                                                t.data.puzzleName,
                                                "_我知道了"
                                              ),
                                          });
                                      }
                                    })(b.value)),
                              },
                              "确定"
                            ),
                          ]),
                        ]),
                      ]),
                      _: 1,
                    },
                    8,
                    ["show"]
                  ),
                ],
                64
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-c3d5b42b"]]
  ),
  Ic = (e) => (p("data-v-d60220c9"), (e = e()), v(), e),
  fc = { class: "senddetail" },
  kc = { class: "senddetail-content-tab" },
  zc = ["onClick"],
  Pc = { class: "senddetail-content-secTab" },
  Ec = ["onClick"],
  Cc = { class: "senddetail-list" },
  Sc = { class: "senddetail-list-item-right" },
  Tc = { class: "senddetail-list-item-right-title" },
  xc = { class: "senddetail-list-item-right-subtitle" },
  Dc = { class: "senddetail-list-item-right-subtitle-num" },
  Ac = Ic(() =>
    _("span", { class: "senddetail-list-item-right-subtitle-text" }, " 张", -1)
  ),
  Lc = ["onClick"],
  Nc = { key: 1, class: "senddetail-empty" },
  Rc = Ic(() => _("div", { class: "senddetail-empty-img" }, null, -1)),
  jc = { class: "senddetail-empty-text" },
  Oc = Ic(() =>
    _("div", { class: "senddetail-tips" }, "拼图记录每月会清空哦", -1)
  ),
  Uc = Ic(() =>
    _(
      "div",
      { class: "senddetail-tips2" },
      "拼图奖品领取后，拼图数量大于1才可赠送",
      -1
    )
  ),
  Hc = nt(
    {
      __name: "sendPuzzle",
      props: {
        unlockStatusList: { type: Array, default: () => [] },
        activeIdx: { type: Number, default: 0 },
      },
      setup(t) {
        const { PopExposure: a, PopClick: s } = M(),
          u = lt(),
          d = ["95折拼图", "9折拼图", "8折拼图"],
          r = e(0),
          p = e({}),
          v = e([]),
          m = e([]),
          g = e("r95"),
          f = e(0),
          k = ["dp1", "dp2", "dp3"],
          z = [
            { index: 0, name: "95折拼图", status: "r95" },
            { index: 1, name: "9折拼图", status: "r9" },
            { index: 2, name: "8折拼图", status: "r8" },
          ],
          E = [
            { title: "全部", name: "all" },
            { title: "已获得", name: "get" },
            { title: "未获得", name: "noget" },
          ],
          C = ["求拼图", "大于1可赠", "去赠送"],
          S = e("您还没有拼图哦，快去拼图吧"),
          T = t,
          A = () => {
            u.openSendPuzzlePop(!1);
          },
          L = (e) => {
            (f.value = e),
              (m.value = v.value.filter((e) => {
                switch (f.value) {
                  case 0:
                  default:
                    return !0;
                  case 1:
                    return e.num > 0;
                  case 2:
                    return 0 === e.num;
                }
              })),
              (() => {
                const e = d[r.value];
                if (3 === T.unlockStatusList[r.value])
                  return (
                    (m.value = []), void (S.value = "".concat(e, "还未解锁哦~"))
                  );
                1 !== f.value
                  ? 2 !== f.value
                    ? (S.value = "您还没有拼图哦，快去拼图吧")
                    : (S.value = "您的".concat(e, "已经全部获得哦~"))
                  : (S.value = "您还未获得".concat(e, "哦~"));
              })(),
              s({ window_name: "拼图模块_赠/求卡弹窗_" + E[e].title });
          },
          N = (e) => {
            (r.value = e.index), (g.value = e.status);
            if (document.querySelector(".senddetail-content-tab-item.middle")) {
              const t = document.querySelector(
                ".senddetail-content-tab-item:nth-child(2)"
              );
              t.style.setProperty("--left", "1"),
                t.style.setProperty("--right", "1"),
                0 === e.index
                  ? t.style.setProperty("--left", "0")
                  : 1 === e.index
                  ? (t.style.setProperty("--left", "0"),
                    t.style.setProperty("--right", "0"))
                  : 2 === e.index && t.style.setProperty("--right", "0");
            }
            v.value = [];
            const t = k[e.index];
            (v.value = p.value[t] || []),
              L(0),
              s({ window_name: "拼图模块_赠/求拼图弹窗_" + d[e.index] });
          };
        return (
          h(
            () => u.sendPuzzleShow,
            (e) => {
              e &&
                (a({ window_name: "拼图模块_赠/求拼图_" + d[r.value] }),
                (async () => {
                  const e = await Ne();
                  "0" === e.code && ((p.value = e.data), N(z[T.activeIdx]));
                })());
            }
          ),
          (e, t) => {
            const a = P;
            return (
              n(),
              i(
                a,
                { show: c(u).sendPuzzleShow },
                {
                  default: o(() => [
                    _("div", fc, [
                      _(
                        "div",
                        { class: y(["senddetail-content", g.value]) },
                        [
                          _("div", kc, [
                            (n(),
                            l(
                              w,
                              null,
                              b(z, (e) =>
                                _(
                                  "div",
                                  {
                                    key: e,
                                    class: y([
                                      "senddetail-content-tab-item",
                                      [
                                        {
                                          active: r.value == e.index,
                                          middle: 1 === e.index,
                                        },
                                      ],
                                    ]),
                                    onClick: (t) => N(e),
                                  },
                                  I(e.name),
                                  11,
                                  zc
                                )
                              ),
                              64
                            )),
                          ]),
                          _("div", Pc, [
                            (n(),
                            l(
                              w,
                              null,
                              b(E, (e, t) =>
                                _(
                                  "div",
                                  {
                                    key: t,
                                    class: y([
                                      "senddetail-content-secTab-item",
                                      { active: f.value === t },
                                    ]),
                                    onClick: (e) => L(t),
                                  },
                                  I(e.title),
                                  11,
                                  Ec
                                )
                              ),
                              64
                            )),
                          ]),
                        ],
                        2
                      ),
                      m.value.length
                        ? (n(),
                          i(
                            c(Kl),
                            {
                              key: r.value,
                              width: 577,
                              height: 510,
                              "bar-color-y": "#CAC8D7",
                              "track-color-y": "#F6EBF4",
                            },
                            {
                              default: o(() => [
                                _("ul", Cc, [
                                  (n(!0),
                                  l(
                                    w,
                                    null,
                                    b(m.value, (e, t) => {
                                      return (
                                        n(),
                                        l(
                                          "li",
                                          {
                                            key: t,
                                            class: "senddetail-list-item",
                                          },
                                          [
                                            _(
                                              "div",
                                              {
                                                class: y([
                                                  "senddetail-list-item-left",
                                                  { ungot: 0 == e.num },
                                                ]),
                                                style: D({
                                                  backgroundImage:
                                                    "url(".concat(
                                                      ((a = e.prize),
                                                      new URL(
                                                        Object.assign({
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp1_0.png":
                                                            Al,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp1_1.png":
                                                            Ll,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp1_2.png":
                                                            Nl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp1_3.png":
                                                            Rl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_0.png":
                                                            jl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_1.png":
                                                            Ol,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_2.png":
                                                            Ul,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_3.png":
                                                            Hl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_4.png":
                                                            Vl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp2_5.png":
                                                            ql,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_0.png":
                                                            Bl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_1.png":
                                                            Ml,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_2.png":
                                                            Fl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_3.png":
                                                            Wl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_4.png":
                                                            Xl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_5.png":
                                                            Gl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_6.png":
                                                            Yl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_7.png":
                                                            Zl,
                                                          "/src/assets/img/ImgInvite/tcpuzzle/dp3_8.png":
                                                            Ql,
                                                        })[
                                                          "/src/assets/img/ImgInvite/tcpuzzle/".concat(
                                                            a,
                                                            ".png"
                                                          )
                                                        ],
                                                        import.meta.url
                                                      ).href),
                                                      ")"
                                                    ),
                                                }),
                                              },
                                              null,
                                              6
                                            ),
                                            _("div", Sc, [
                                              _("div", Tc, I(e.name), 1),
                                              _("div", xc, [
                                                x(" 数量： "),
                                                _("span", Dc, I(e.num), 1),
                                                Ac,
                                              ]),
                                              _(
                                                "div",
                                                {
                                                  class: y([
                                                    "senddetail-list-item-right-btn",
                                                    {
                                                      unSend: 1 == e.btnStatus,
                                                      ask: 0 === e.btnStatus,
                                                    },
                                                  ]),
                                                  onClick: (t) =>
                                                    (async (e) => {
                                                      if (2 === e.btnStatus) {
                                                        s({
                                                          window_name:
                                                            "拼图模块_赠/求拼图_" +
                                                            e.name +
                                                            "_赠拼图",
                                                        });
                                                        const { data: t } =
                                                          await Re({
                                                            type: 2,
                                                            puzzleName: e.prize,
                                                          });
                                                        u.openSendPuzzlePosterPop(
                                                          !0,
                                                          e,
                                                          !0,
                                                          t.data
                                                        );
                                                      } else if (
                                                        0 === e.btnStatus
                                                      ) {
                                                        s({
                                                          window_name:
                                                            "拼图模块_赠/求拼图_" +
                                                            e.name +
                                                            "_求拼图",
                                                        });
                                                        const { data: t } =
                                                          await Re({
                                                            type: 1,
                                                            puzzleName: e.prize,
                                                          });
                                                        u.openSendPuzzlePosterPop(
                                                          !0,
                                                          e,
                                                          !1,
                                                          t.data
                                                        );
                                                      }
                                                    })(e),
                                                },
                                                I(C[e.btnStatus]),
                                                11,
                                                Lc
                                              ),
                                            ]),
                                          ]
                                        )
                                      );
                                      var a;
                                    }),
                                    128
                                  )),
                                ]),
                              ]),
                              _: 1,
                            }
                          ))
                        : (n(),
                          l("div", Nc, [Rc, _("div", jc, I(S.value), 1)])),
                      Oc,
                      Uc,
                    ]),
                    _("div", { class: "close", onClick: A }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-d60220c9"]]
  ),
  Vc =
    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/poster_bg.DcutNfTs.png",
  qc = lt(),
  Bc = ct(),
  { userInfo: Mc, activityInfo: Fc } = m(Bc);
function Wc() {
  const t = e(!1),
    a = e(""),
    s = e(""),
    n = e(""),
    l = e(""),
    c = e(""),
    i = e(""),
    o = e("周三充值日低至8折"),
    u = e(1),
    d = e(""),
    r = e(""),
    p = () => {
      try {
        const e = window.devicePixelRatio || 1;
        return Math.min(e, 2);
      } catch (e) {
        return 1;
      }
    },
    v = (e) => {
      (t.value = !1),
        A(() => {
          const a = document.getElementById("posterCanvas");
          if (a)
            try {
              const c = p(),
                i = 375,
                o = 667;
              (a.width = i * c),
                (a.height = o * c),
                (a.style.width = "".concat(i, "px")),
                (a.style.height = "".concat(o, "px"));
              let v = a.getContext("2d", { willReadFrequently: !0 }),
                _ = new Image();
              _.setAttribute("crossorigin", "anonymous"),
                (_.src = d.value),
                (_.onload = async () => {
                  var c;
                  try {
                    if (
                      (v.clearRect(0, 0, a.width, a.height),
                      v.drawImage(_, 0, 0, 375 * p(), 667 * p()),
                      r.value)
                    )
                      if (r.value.prize) {
                        ((
                          e,
                          t,
                          a,
                          s,
                          n = 16,
                          l = "#6C1414",
                          c = "center",
                          i = null,
                          o = null
                        ) => {
                          (e.font = "900 ".concat(n, "px Arial, sans-serif")),
                            (e.fillStyle = l),
                            (e.textAlign = c),
                            (e.textBaseline = "middle");
                          let u = a;
                          null !== i &&
                            null !== o &&
                            "center" === c &&
                            (u = i + o / 2);
                          e.fillText(t, u, s);
                        })(
                          v,
                          qc.cardIsGiven
                            ? "送你一张".concat(r.value.name, "，助你一臂之力!")
                            : "请送我一张".concat(
                                r.value.name,
                                "，助我一臂之力!"
                              ),
                          187.5 * p(),
                          // 相当于 375px 宽度的中心点
                          330 * p(),
                          30,
                          "#6C1414",
                          "center",
                          0,
                          // 容器起始 X
                          375 * p()
                        );
                        try {
                          const e = qc.givenCard.prize,
                            t = Object.assign({
                              "/src/assets/img/ImgInvite/tcpuzzle/dp1_0.png":
                                () =>
                                  rt(
                                    () => import("./dp1_0.CQVEuHAq.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp1_1.png":
                                () =>
                                  rt(
                                    () => import("./dp1_1.D7jzuXm5.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp1_2.png":
                                () =>
                                  rt(
                                    () => import("./dp1_2.B2Tln9mg.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp1_3.png":
                                () =>
                                  rt(
                                    () => import("./dp1_3.Ssx4tGzC.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp2_0.png":
                                () =>
                                  rt(
                                    () => import("./dp2_0.uuUWxz8a.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp2_1.png":
                                () =>
                                  rt(
                                    () => import("./dp2_1.CGdgrjbU.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp2_2.png":
                                () =>
                                  rt(
                                    () => import("./dp2_2.CIeRUln8.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp2_3.png":
                                () =>
                                  rt(
                                    () => import("./dp2_3.DfZ-zV4I.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp2_4.png":
                                () =>
                                  rt(
                                    () => import("./dp2_4.BxhT1xce.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp2_5.png":
                                () =>
                                  rt(
                                    () => import("./dp2_5.Bi04ASSl.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_0.png":
                                () =>
                                  rt(
                                    () => import("./dp3_0.B4pc_mEW.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_1.png":
                                () =>
                                  rt(
                                    () => import("./dp3_1.ByVCIxhg.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_2.png":
                                () =>
                                  rt(
                                    () => import("./dp3_2.DwziPhPp.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_3.png":
                                () =>
                                  rt(
                                    () => import("./dp3_3.BJu0bHgk.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_4.png":
                                () =>
                                  rt(
                                    () => import("./dp3_4.6Pn82OTK.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_5.png":
                                () =>
                                  rt(
                                    () => import("./dp3_5.BjcFsL_-.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_6.png":
                                () =>
                                  rt(
                                    () => import("./dp3_6.Dd3NuJr0.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_7.png":
                                () =>
                                  rt(
                                    () => import("./dp3_7.DqVR2V7y.js"),
                                    __vite__mapDeps([])
                                  ),
                              "/src/assets/img/ImgInvite/tcpuzzle/dp3_8.png":
                                () =>
                                  rt(
                                    () => import("./dp3_8.BtNKGtw4.js"),
                                    __vite__mapDeps([])
                                  ),
                            }),
                            a = Object.keys(t).find((t) => t.includes(e));
                          if (a) {
                            const e = (await t[a]()).default,
                              s = new Image();
                            s.setAttribute("crossorigin", "anonymous"),
                              (s.src = e),
                              await new Promise((e, t) => {
                                (s.onload = () => {
                                  const t = p(),
                                    a = 124 * t,
                                    n = 340 * t,
                                    l = 130 * t,
                                    c = 130 * t;
                                  v.drawImage(s, a, n, l, c), e();
                                }),
                                  (s.onerror = t);
                              });
                          }
                        } catch (i) {}
                      } else
                        try {
                          const e = document.getElementById("cardCanvas");
                          if (!e) return;
                          const t = e.getContext("2d");
                          (t.font = "bold 100px Arial, sans-serif"),
                            (t.textAlign = "center"),
                            (t.textBaseline = "middle"),
                            (t.fillStyle =
                              4 === u.value || 1 === u.value
                                ? "#FF0505"
                                : "#FE4706"),
                            t.fillText(X(r.value.shortName)[0], 127, 100),
                            (t.font = "bold 36px Arial, sans-serif");
                          const a = [0, 173, 200, 225];
                          t.fillText(
                            "".concat(X(r.value.shortName)[1]),
                            a[
                              (null == (c = r.value.shortName)
                                ? void 0
                                : c.length) - 1
                            ],
                            118
                          ),
                            (t.font = "bold 42px Arial, sans-serif"),
                            (t.textAlign = "left"),
                            (t.fillStyle = "#FFFFFF"),
                            t.fillText(
                              "".concat(r.value.name || r.value.prizeName),
                              340,
                              r.value.subTitle ? 80 : 100
                            ),
                            r.value.subTitle &&
                              ((t.font = "24px Arial, sans-serif"),
                              t.fillText(
                                "".concat(r.value.subTitle),
                                330,
                                125
                              )),
                            v.drawImage(
                              e,
                              28 * p(),
                              367 * p(),
                              320 * p(),
                              110 * p()
                            );
                        } catch (o) {}
                    ((e, t) =>
                      new Promise((a, n) => {
                        let l = new ht();
                        (l.data = s.value),
                          (l.size = 130),
                          (l.version = 8),
                          (l.errorCorrectionLevel = "H"),
                          (l.foregroundColor = "#000000"),
                          (l.backgroundColor = "#FFFFFF"),
                          l.make();
                        const c = document.getElementById("qrcode");
                        if (!c)
                          return void n(new Error("qrcode canvas 元素不存在"));
                        const i = p() || window.devicePixelRatio || 1,
                          o = l.size;
                        (c.width = o * i),
                          (c.height = o * i),
                          (c.style.width = "".concat(o, "px")),
                          (c.style.height = "".concat(o, "px"));
                        const u = c.getContext("2d");
                        u
                          ? (u.scale(i, i),
                            (u.imageSmoothingEnabled = !1),
                            (l.canvasContext = u),
                            l
                              .drawCanvas()
                              .then(() => {
                                try {
                                  const s = p(),
                                    n = t.x * s,
                                    l = t.y * s,
                                    i = o * s,
                                    u = o * s;
                                  (e.fillStyle = "#FFFFFF"),
                                    e.fillRect(
                                      n - 2 * s,
                                      l - 2 * s,
                                      i + 4 * s,
                                      u + 4 * s
                                    ),
                                    (e.imageSmoothingEnabled = !1),
                                    (e.imageSmoothingQuality = "high"),
                                    e.drawImage(
                                      c,
                                      0,
                                      0,
                                      c.width,
                                      c.height,
                                      n,
                                      l,
                                      i,
                                      u
                                    ),
                                    a();
                                } catch (s) {
                                  n(
                                    new Error(
                                      "绘制图像失败: ".concat(s.message)
                                    )
                                  );
                                }
                              })
                              .catch((e) => {
                                n(
                                  new Error(
                                    "二维码绘制失败: ".concat(e.message || e)
                                  )
                                );
                              }))
                          : n(new Error("无法获取 canvas 2d 上下文"));
                      }))(v, e)
                      .then(() => {
                        let e = a.toDataURL("image/png", 1);
                        (n.value = e),
                          (l.value = e.slice(22, e.length - 1)),
                          (t.value = !0);
                      })
                      .catch((e) => ((t.value = !0), Promise.resolve()));
                  } catch (d) {
                    t.value = !0;
                  }
                }),
                (_.onerror = (e) => {
                  t.value = !0;
                });
            } catch (c) {
              t.value = !0;
            }
          else t.value = !0;
        });
    };
  return {
    valIsOk: t,
    handleWxShare: (e) => {
      window.cmcc.imagesShare({
        debug: !1,
        type: e,
        //默认朋友圈，可不传。0: 朋友圈; 1: 好友。String 类型
        imagesArray: [n.value],
        //URL数组,数组元素数量<=9,只允许png和jpg图片分享
        success: () => {},
        error: (e) => {},
      });
    },
    handleImgShare: async () => {
      if (window.cmcc)
        try {
          const e = (() => {
              let e = navigator.userAgent || "";
              return /android/i.test(e) ? n.value : l.value;
            })(),
            { phoneNumber: t } = await He(),
            a = {
              debug: !1,
              type: 2,
              // 图片传参方式：1表示url方式，2表示base64方式,3表示pdf方式（只对安卓有效）
              data: e,
              // 注意data值不合法的时候会报错
              //根据type值不同，data为url链接或者base64数据
              phoneNum: null != t ? t : "",
              //手机号（只有android使用，用于图片命名）
              success: () => {
                k("保存成功，快去分享给好友吧～");
              },
              error: (e) => {
                k("网络异常、请稍后重试！");
              },
            };
          window.cmcc.savePhoto(a);
        } catch (e) {
          k("当前分享人数过多，请稍后重试！");
        }
      else k("当前分享人数过多，请稍后重试！");
    },
    handleCodeShare: async () => {
      if (!window.cmcc) return void k("当前分享人数过多，请稍后重试！");
      const { phoneNumber: e } = await He();
      try {
        window.cmcc.createPassWordCode({
          debug: !1,
          urlAddress: a.value,
          //活动URL链接地址，String类型
          imageUrl: c.value,
          //活动展示图片URL链接地址  String类型
          shareNum: null != e ? e : "",
          //分享人号码信息，String类型
          channelCode: "11",
          //渠道编码，见附录口令渠道编码，String类型
          // activityName: '周三充值低至88折', //活动名称 String类型
          activityName: o.value,
          //活动名称 String类型
          activitySubtitle: "给您分享了一个活动",
          //活动副标题 String类型
          commandMould: i.value,
          //口令模板，模板中必须存在******字符，String类型
          pageId: q("pageId") || "pageId",
          //统计插码用的pageId，String类型
          channelId: q("channelId") || "channelId",
          //统计插码用的channelId，String类型
          extendId: q("extendId") || "extendId",
          //统计插码用的extendId，String类型
          sellerId: q("sellerId") || "sellerId",
          //统计插码用的sellerId，String类型
          success: (e) => {
            window.cmcc.copyToClipboard({
              debug: !1,
              text: e.commandInfo,
              // 口令信息， String类型 需要写入剪切板的字符串，不能为空。String类型
              success: () => {
                k("口令保存成功，快去分享给好友吧～");
              },
              error: (e) => {
                k("当前分享人数过多，请稍后重试！");
              },
            });
          },
          error: (e) => {
            k("当前分享人数过多，请稍后重试！");
          },
        });
      } catch (t) {
        k("当前分享人数过多，请稍后重试！");
      }
    },
    startCanvas: async (e, t, n) => {
      var l, p, _, m, g, h;
      switch (((r.value = n || ""), (u.value = e), e)) {
        case 1:
          (d.value = null == (l = Fc.value) ? void 0 : l.inviteImg.poster),
            (a.value = "".concat(je, "?shareCodes=").concat(t)),
            (s.value = ""
              .concat(Oe, "?targetUrl=")
              .concat(
                encodeURIComponent(a.value),
                "&pageId=99992603311033047&channelId=P00000116211&sellerId=1636941HD1301000012"
              )),
            (c.value = null == (p = Fc.value) ? void 0 : p.homeImg.klImg),
            (i.value =
              "我正在集拼图赢8折充值券，******复制此消息，打开中国移动客户端为我助力，你也有机会参与得好礼哦");
          break;
        case 2:
          (d.value =
            "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/give_bg.CkLFTT0p.png"),
            (a.value = s.value =
              "".concat(je, "?channelId=P00000016570&giveCodes=").concat(t)),
            A(() => {
              (() => {
                const e = document.getElementById("codeCanvas");
                if (!e) return;
                const t = e.getContext("2d");
                (t.imageSmoothingEnabled = !1),
                  (t.webkitImageSmoothingEnabled = !1);
                const a = new Image();
                a.setAttribute("crossorigin", "anonymous"),
                  (a.src =
                    "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/password.Bp2SxJvB.png"),
                  (a.onload = function () {
                    t.drawImage(a, 0, 0, e.width, e.height),
                      (t.font = "bold 74px Arial, sans-serif"),
                      (t.textAlign = "center"),
                      (t.textBaseline = "middle"),
                      (t.fillStyle = "white"),
                      t.fillText(
                        "尾号".concat(Mc.value.phone.slice(-4), "的用户"),
                        e.width / 2,
                        450
                      ),
                      t.fillText("送您一张话费券红包", e.width / 2, 550);
                    const s = document.getElementById("codeCanvas");
                    c.value = s.toDataURL("image/jpeg", 0.3);
                  });
              })();
            }),
            (i.value = "送你一张".concat(
              null == n ? void 0 : n.shortName,
              "话费券，******复制此消息，打开中国移动客户端即可查收，一起薅羊毛！"
            ));
          break;
        case 3:
          (d.value =
            "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/poster_bg.DPaC7Gtm.png"),
            (s.value = Ue);
          break;
        case 4:
          (d.value = null == (_ = Fc.value) ? void 0 : _.thMillionImg.poster),
            (a.value = "".concat(je, "?inviteCodes=").concat(t)),
            (s.value = ""
              .concat(Oe, "?targetUrl=")
              .concat(
                encodeURIComponent(a.value),
                "&pageId=1849008675699650560%26channelId=P00000116211&failedType=0&bkName=248cf734ed7444fe8ab96b9a1450b74b20260302.png&btnName=4789f54b3784469e988cb4725158e57f20260302.png&contentName=93105baeac4c432d95ab0fa14a0e181120260302.png&prefix=new"
              )),
            (c.value = null == (m = Fc.value) ? void 0 : m.homeImg.klImg),
            (o.value = "周三充值日邀好友领88元"),
            (i.value =
              "我正在领88元充值券，******复制此消息，打开中国移动客户端为我砍话费，你也有机会领取哦~");
          break;
        case 5:
          (d.value = Vc),
            (a.value = "".concat(je, "?giveCard=").concat(t)),
            (s.value = ""
              .concat(Oe, "?targetUrl=")
              .concat(
                encodeURIComponent(a.value),
                "&pageId=99992603311033047&channelId=P00000116211&sellerId=1636941HD1301000012"
              )),
            (o.value = "集拼图，赢至高8折充值券"),
            (i.value = "送你一张多余的‘"
              .concat(n.name, "’！，快来一起集拼图，")
              .concat(
                n.name.replace(/(\d+折).*/, "$1充值券"),
                "等你来赢，****** 复制此消息，打开中国移动客户端，马上领取。"
              )),
            (c.value = null == (g = Fc.value) ? void 0 : g.homeImg.klImg);
          break;
        case 6:
          (d.value = Vc),
            (a.value = ""
              .concat(je, "?requestCard=")
              .concat(t, "&phone=")
              .concat(Mc.value.phone.slice(-4))),
            (s.value = ""
              .concat(Oe, "?targetUrl=")
              .concat(
                encodeURIComponent(a.value),
                "&pageId=99992603311033047&channelId=P00000116211&sellerId=1636941HD1301000012"
              )),
            (o.value = "集拼图，赢至高8折充值券"),
            (i.value = "我正在集拼图赢"
              .concat(n.name.replace(/(\d+折).*/, "$1充值券"), "，还差一张‘")
              .concat(
                n.name,
                "’，****** 复制此消息，打开中国移动客户端为我助力，你也能参与得好礼哦。"
              )),
            (c.value = null == (h = Fc.value) ? void 0 : h.homeImg.klImg);
      }
      let y = {
        x: 4 === e ? 122 : 124,
        y: 4 === e ? 489 : 495,
        width: 130,
        height: 130,
      };
      [5, 6, 7].includes(e) && ((y.y = 490), (y.x = 125)),
        1 === e && ((y.x = 125), (y.y = 491)),
        v(y);
    },
    androidtranscodeUrl: n,
  };
}
const Xc = (e) => (p("data-v-b4d697b0"), (e = e()), v(), e),
  Gc = { key: 0, class: "poster" },
  Yc = { key: 0, class: "poster-title" },
  Zc = { key: 1, class: "poster-title1" },
  Qc = ["src"],
  Kc = { class: "poster_btn" },
  Jc = { key: 1, class: "loading" },
  $c = { class: "poster-canvas" },
  ei = Xc(() =>
    _(
      "canvas",
      {
        id: "cardCanvas",
        "canvas-id": "cardCanvas",
        width: "640",
        height: "220",
      },
      null,
      -1
    )
  ),
  ti = {
    id: "qrcode",
    ref: "canvas",
    "canvas-id": "qrcode",
    width: "130",
    height: "130",
  },
  ai = Xc(() =>
    _(
      "canvas",
      {
        id: "posterCanvas",
        "canvas-id": "posterCanvas",
        width: "375",
        height: "667",
      },
      null,
      -1
    )
  ),
  si = nt(
    {
      __name: "sendPoster",
      setup(t) {
        const a = lt(),
          {
            valIsOk: s,
            startCanvas: u,
            handleImgShare: r,
            handleCodeShare: p,
          } = Wc(),
          { PopExposure: v, PopClick: g } = M(),
          w = ct(),
          { ifMid: b, activityInfo: f } = m(w);
        e({});
        const k = e("");
        let z = a.cardIsGiven ? "赠拼图" : "求拼图";
        const E = () => {
            g({
              window_name: "拼图模块_" + z + "_海报",
              button_name: "拼图模块_" + z + "_海报_保存图片",
            }),
              r();
          },
          S = () => {
            g({
              window_name: "拼图模块_" + z + "_海报",
              button_name: "拼图模块_" + z + "_海报_口令分享",
            }),
              p();
          },
          T = () => {
            a.openSendPuzzlePosterPop(!1);
            const e = document.getElementById("cardCanvas");
            e.getContext("2d").clearRect(0, 0, e.width, e.height);
          };
        return (
          h(
            () => a.sendPuzzlePosterVisible,
            async (e) => {
              if (e) {
                const e = a.givenCard.prize,
                  t = Object.assign({
                    "/src/assets/img/ImgInvite/tcpuzzle/dp1_0.png": () =>
                      rt(
                        () => import("./dp1_0.CQVEuHAq.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp1_1.png": () =>
                      rt(
                        () => import("./dp1_1.D7jzuXm5.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp1_2.png": () =>
                      rt(
                        () => import("./dp1_2.B2Tln9mg.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp1_3.png": () =>
                      rt(
                        () => import("./dp1_3.Ssx4tGzC.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp2_0.png": () =>
                      rt(
                        () => import("./dp2_0.uuUWxz8a.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp2_1.png": () =>
                      rt(
                        () => import("./dp2_1.CGdgrjbU.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp2_2.png": () =>
                      rt(
                        () => import("./dp2_2.CIeRUln8.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp2_3.png": () =>
                      rt(
                        () => import("./dp2_3.DfZ-zV4I.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp2_4.png": () =>
                      rt(
                        () => import("./dp2_4.BxhT1xce.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp2_5.png": () =>
                      rt(
                        () => import("./dp2_5.Bi04ASSl.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_0.png": () =>
                      rt(
                        () => import("./dp3_0.B4pc_mEW.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_1.png": () =>
                      rt(
                        () => import("./dp3_1.ByVCIxhg.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_2.png": () =>
                      rt(
                        () => import("./dp3_2.DwziPhPp.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_3.png": () =>
                      rt(
                        () => import("./dp3_3.BJu0bHgk.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_4.png": () =>
                      rt(
                        () => import("./dp3_4.6Pn82OTK.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_5.png": () =>
                      rt(
                        () => import("./dp3_5.BjcFsL_-.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_6.png": () =>
                      rt(
                        () => import("./dp3_6.Dd3NuJr0.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_7.png": () =>
                      rt(
                        () => import("./dp3_7.DqVR2V7y.js"),
                        __vite__mapDeps([])
                      ),
                    "/src/assets/img/ImgInvite/tcpuzzle/dp3_8.png": () =>
                      rt(
                        () => import("./dp3_8.BtNKGtw4.js"),
                        __vite__mapDeps([])
                      ),
                  }),
                  s = Object.keys(t).find((t) => t.includes(e)),
                  n = await t[s]();
                (k.value = n.default),
                  v({
                    window_name: "拼图模块_" + z + "_海报",
                    button_name: "口令分享，保存图片分享",
                  }),
                  a.cardIsGiven
                    ? u(5, a.cardToken, a.givenCard)
                    : u(6, a.cardToken, a.givenCard);
              } else s.value = !1;
            }
          ),
          (e, t) => {
            const u = j,
              r = P;
            return (
              n(),
              i(
                r,
                { show: c(a).sendPuzzlePosterVisible },
                {
                  default: o(() => [
                    c(s)
                      ? (n(),
                        l("div", Gc, [
                          c(a).cardIsGiven
                            ? (n(),
                              l(
                                "div",
                                Yc,
                                " 赠送好友一张" +
                                  I(c(a).givenCard.name) +
                                  "，助他一臂之力 ",
                                1
                              ))
                            : (n(),
                              l(
                                "div",
                                Zc,
                                " 请送我一张" +
                                  I(c(a).givenCard.name) +
                                  "，助我一臂之力 ",
                                1
                              )),
                          _(
                            "img",
                            { class: "poster-img", src: k.value },
                            null,
                            8,
                            Qc
                          ),
                          _("div", Kc, [
                            _(
                              "div",
                              {
                                class: y([
                                  "poster_btn_img",
                                  "img".concat(c(b)),
                                ]),
                                onClick: E,
                              },
                              null,
                              2
                            ),
                            _(
                              "div",
                              {
                                class: y([
                                  "poster_btn_pdcode",
                                  "pdcode".concat(c(b)),
                                ]),
                                onClick: S,
                              },
                              null,
                              2
                            ),
                          ]),
                        ]))
                      : (n(),
                        l("div", Jc, [
                          C(
                            u,
                            { size: "24px", vertical: "" },
                            { default: o(() => [x("加载中...")]), _: 1 }
                          ),
                        ])),
                    c(s)
                      ? (n(),
                        l(
                          "div",
                          { key: 2, class: y(["card", "card".concat(c(b))]) },
                          null,
                          2
                        ))
                      : d("", !0),
                    _("div", { class: "poster-close", onClick: T }),
                    _("div", $c, [ei, _("canvas", ti, null, 512), ai]),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-b4d697b0"]]
  ),
  ni = (e) => (p("data-v-3545d935"), (e = e()), v(), e),
  li = { class: "poster_btn" },
  ci = { key: 1, class: "loading" },
  ii = { class: "card-price" },
  oi = { class: "card-text" },
  ui = { key: 0 },
  di = { class: "poster-canvas" },
  ri = ni(() =>
    _(
      "canvas",
      {
        id: "cardCanvas",
        "canvas-id": "cardCanvas",
        width: "640",
        height: "220",
      },
      null,
      -1
    )
  ),
  pi = {
    id: "qrcode",
    ref: "canvas",
    "canvas-id": "qrcode",
    width: "130",
    height: "130",
  },
  vi = ni(() =>
    _(
      "canvas",
      {
        id: "posterCanvas",
        "canvas-id": "posterCanvas",
        width: "375",
        height: "667",
      },
      null,
      -1
    )
  ),
  _i = nt(
    {
      __name: "sharePoster",
      setup(t) {
        const a = lt(),
          {
            valIsOk: s,
            startCanvas: u,
            handleImgShare: r,
            handleCodeShare: p,
          } = Wc(),
          { PopExposure: v, PopClick: g } = M(),
          w = ct(),
          { ifMid: b, activityInfo: f } = m(w),
          k = e({}),
          z = () => {
            g({
              window_name: "拼图模块_邀请海报",
              button_name: "拼图模块_邀请海报_保存图片",
            }),
              r();
          },
          E = () => {
            g({
              window_name: "拼图模块_邀请海报",
              button_name: "拼图模块_邀请海报_口令分享",
            }),
              p();
          },
          S = () => {
            a.posterPop(!1);
            const e = document.getElementById("cardCanvas");
            e.getContext("2d").clearRect(0, 0, e.width, e.height);
          };
        return (
          h(
            () => a.posterVisible,
            (e) => {
              var t;
              e
                ? (v({
                    window_name: "拼图模块_邀请海报",
                    button_name: "口令分享，保存图片分享",
                  }),
                  (k.value =
                    null == (t = f.value) ? void 0 : t.inviteImg.prizeObj),
                  u(1, a.inviteCode, k.value))
                : (s.value = !1);
            }
          ),
          (e, t) => {
            const u = j,
              r = P;
            return (
              n(),
              i(
                r,
                { show: c(a).posterVisible },
                {
                  default: o(() => {
                    var e;
                    return [
                      c(s)
                        ? (n(),
                          l(
                            "div",
                            {
                              key: 0,
                              class: "poster",
                              style: D({
                                backgroundImage: "url(".concat(
                                  null == (e = c(f)) ? void 0 : e.inviteImg.pop,
                                  ")"
                                ),
                              }),
                            },
                            [
                              _("div", li, [
                                _(
                                  "div",
                                  {
                                    class: y([
                                      "poster_btn_img",
                                      "img".concat(c(b)),
                                    ]),
                                    onClick: z,
                                  },
                                  null,
                                  2
                                ),
                                _(
                                  "div",
                                  {
                                    class: y([
                                      "poster_btn_pdcode",
                                      "pdcode".concat(c(b)),
                                    ]),
                                    onClick: E,
                                  },
                                  null,
                                  2
                                ),
                              ]),
                            ],
                            4
                          ))
                        : (n(),
                          l("div", ci, [
                            C(
                              u,
                              { size: "24px", vertical: "" },
                              { default: o(() => [x("加载中...")]), _: 1 }
                            ),
                          ])),
                      c(s)
                        ? (n(),
                          l(
                            "div",
                            { key: 2, class: y(["card", "card".concat(c(b))]) },
                            [
                              _("div", ii, [
                                _(
                                  "span",
                                  null,
                                  I(c(X)(k.value.shortName)[0]),
                                  1
                                ),
                                _(
                                  "span",
                                  null,
                                  I(c(X)(k.value.shortName)[1]),
                                  1
                                ),
                              ]),
                              _("div", oi, [
                                _("p", null, I(k.value.name), 1),
                                k.value.subTitle
                                  ? (n(), l("p", ui, I(k.value.subTitle), 1))
                                  : d("", !0),
                              ]),
                            ],
                            2
                          ))
                        : d("", !0),
                      _("div", { class: "poster-close", onClick: S }),
                      _("div", di, [ri, _("canvas", pi, null, 512), vi]),
                    ];
                  }),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-3545d935"]]
  ),
  mi = (e) => (p("data-v-b456509a"), (e = e()), v(), e),
  gi = { class: "task" },
  hi = { key: 0, class: "task-nonet" },
  yi = mi(() => _("div", { class: "task-nonet-error" }, null, -1)),
  wi = mi(() =>
    _("div", { class: "task-nonet-text" }, "网络异常，请稍后重试～", -1)
  ),
  bi = { key: 1, class: "task-list" },
  Ii = { class: "task-list-item-left" },
  fi = { class: "circle" },
  ki = ["src"],
  zi = { class: "text" },
  Pi = { class: "title" },
  Ei = { class: "tips" },
  Ci = ["onClick"],
  Si = { class: "tips" },
  Ti = { class: "num" },
  xi = nt(
    {
      __name: "taskList",
      emits: ["updateTimes"],
      setup(t, { emit: a }) {
        const { PopClick: u, ButtonClick: r, PopExposure: p } = M(),
          v = a,
          f = lt(),
          z = Ve(),
          C = e([]),
          S = e(!1),
          T = ct();
        m(T);
        const D = g.throttle(
            async () => {
              try {
                const e = await qe();
                "0" == e.code ? (C.value = e.data) : (S.value = !0);
              } catch (e) {
                (S.value = !0),
                  p({
                    window_name: "拼图模块_做任务弹窗_任务加载失败",
                    button_name: "拼图模块_做任务弹窗_任务加载失败_立即重试",
                  });
              }
            },
            1e3,
            { leading: !0, trailing: !0 }
          ),
          A = (e = 1) => {
            (S.value = !1),
              k({ message: "已刷新" }),
              u(
                1 == e
                  ? {
                      window_name: "拼图模块_做任务弹窗_刷新",
                      button_name: "刷新",
                    }
                  : {
                      window_name: "拼图模块_做任务弹窗_任务加载失败",
                      button_name: "拼图模块_做任务弹窗_任务加载失败_立即重试",
                    }
              ),
              D();
          },
          L = () => {
            u({ button_name: "拼图模块_做任务弹窗_我的邀请" }),
              f.openInviteDetailPop(!0);
          },
          N = () => {
            f.openTaskListPop(!1), v("updateTimes");
          },
          R = async (e) => {
            try {
              const t = await Be({ taskId: e.taskId });
              "0" == (null == t ? void 0 : t.code) &&
                setTimeout(() => {
                  D(), v("updateTimes");
                }, 500);
            } catch (t) {
              k("网络异常，请检查网络后重试");
            }
          },
          j = {
            1: async (e) => {
              try {
                R(e), B(e.jumpUrl);
              } catch (t) {
                k("网络异常，请检查网络后重试");
              }
            },
            //需要跳转而且点击即完成的任务
            2: async (e) => {
              0 == e.status &&
                (async () => {
                  const e = await Ce({ constId: window.__constId });
                  "0" === e.code && e.data
                    ? f.posterPop(!0, e.data)
                    : "160030" === e.code && f.openHighRiskPop(!0);
                })();
            },
            //邀请任务
            3: async (e) => {
              try {
                const t = await Me(e.taskId);
                if (t.data && e.jumpUrl) {
                  const a = e.jumpUrl + "&" + e.taskId + "=" + t.data;
                  B(a);
                }
              } catch (t) {
                k("网络异常，请检查网络后重试");
              }
            },
            //购买任务
            4: async (e) => {
              const t = (null == e ? void 0 : e.jumpUrl) || "",
                a = await Fe({ taskId: e.taskId, activityId: "1024101716" });
              B(t + "&jtToken=" + a.data);
            },
            //浏览型任务
            5: async (e) => {
              const t = (null == e ? void 0 : e.jumpUrl) || "",
                a = {
                  type: "0",
                  // 0: 旧版无进度条 1: 新版有进度条（-7.1新增）
                  showText: "浏览获取抽奖机会",
                  // 非必填，新版进度条模式有效
                  code: null == e ? void 0 : e.taskId,
                  // 任务编号
                  currentUrl: window.location.href,
                  // 当前页面地址
                  destinationPath:
                    "https://wx.10086.cn/hlwyxhdhub/act-wedrecharge/1024101716",
                  // 浮窗跳转目标地址
                  imgUrl:
                    "https://qwhdcdn.cmcc-cs.cn/qwhdhub/mgrupload/266dceb4133144429d912e8fbac56e3720260427.png",
                  // 宽高比11:4，建议220px:80px
                  countDown: "5",
                  // 倒计时秒数（大于0整数）
                  finishText: "点击返回领抽奖机会",
                };
              window.cmcc.newWebview({
                debug: !1,
                markID: "",
                type: "",
                funCode: "",
                bizCode: "",
                url: t,
                isHiddenNavigationBar: !1,
                floatWindow: a,
                fromLive: !1,
                success: () => {
                  (async (e) => {
                    (window.cmcc.countFinished = async () => {
                      R(e);
                    }),
                      setTimeout(() => {
                        window.cmcc.getFloatWindowStatus({
                          debug: !1,
                          currentUrl: window.location.href,
                          //当前页面地址,
                          code: null == e ? void 0 : e.taskId,
                          //需要查询状态的任务编号
                          success: async function (t) {
                            "1" == t.status && R(e);
                          },
                          error: function (e) {},
                        });
                      }, 6500);
                  })(e);
                },
                error: (e) => {},
              }),
                z && R(e);
            },
            //浏览游戏日
            6: R,
          },
          O = g.throttle(
            async (e) => {
              0 == e.status &&
                (u({
                  window_name: "拼图模块_做任务弹窗",
                  button_name: "拼图模块_做任务弹窗_"
                    .concat(e.title, "_")
                    .concat(e.buttontxt),
                }),
                j[e.taskType](e));
            },
            1e3,
            { leading: !0, trailing: !1 }
          );
        h(
          () => f.taskListShow,
          // 监听的目标状态
          (e) => {
            e && D();
          },
          { immediate: !1 }
        );
        const U = () => {
          f.taskListShow && D();
        };
        return (
          s(() => {
            document.addEventListener("visibilitychange", U);
          }),
          E(() => {
            document.removeEventListener("visibilitychange", U);
          }),
          (e, t) => {
            const a = Kl,
              s = P;
            return (
              n(),
              i(
                s,
                { show: c(f).taskListShow, position: "bottom" },
                {
                  default: o(() => {
                    var e;
                    return [
                      _("div", gi, [
                        _("div", {
                          class: "task-refresh",
                          onClick: t[0] || (t[0] = (e) => A(1)),
                        }),
                        _("div", { class: "task-close", onClick: N }),
                        S.value
                          ? (n(),
                            l("div", hi, [
                              yi,
                              wi,
                              _(
                                "div",
                                {
                                  class: "task-nonet-refresh",
                                  onClick: t[1] || (t[1] = (e) => A(2)),
                                },
                                "立即重试"
                              ),
                            ]))
                          : C.value && C.value.length > 0
                          ? (n(),
                            l("div", bi, [
                              (null == (e = C.value) ? void 0 : e.length)
                                ? (n(),
                                  i(
                                    a,
                                    {
                                      key: 0,
                                      width: 700,
                                      height: 680,
                                      "bar-color-y": "#FFC0D3",
                                      "track-color-y": "#fff",
                                    },
                                    {
                                      default: o(() => [
                                        (n(!0),
                                        l(
                                          w,
                                          null,
                                          b(
                                            C.value,
                                            (e, t) => (
                                              n(),
                                              l(
                                                "div",
                                                {
                                                  key: t,
                                                  class: y([
                                                    "task-list-item",
                                                    [
                                                      "status-".concat(
                                                        e.status
                                                      ),
                                                    ],
                                                  ]),
                                                },
                                                [
                                                  _("div", Ii, [
                                                    _(
                                                      "div",
                                                      fi,
                                                      I(e.taskDate),
                                                      1
                                                    ),
                                                    _(
                                                      "img",
                                                      {
                                                        class: "icon",
                                                        src: e.imgUrl,
                                                      },
                                                      null,
                                                      8,
                                                      ki
                                                    ),
                                                    _("div", zi, [
                                                      _(
                                                        "div",
                                                        Pi,
                                                        I(e.title),
                                                        1
                                                      ),
                                                      _("div", Ei, [
                                                        _(
                                                          "span",
                                                          null,
                                                          I(
                                                            null == e
                                                              ? void 0
                                                              : e.description
                                                          ),
                                                          1
                                                        ),
                                                        2 == e.taskType
                                                          ? (n(),
                                                            l("div", {
                                                              key: 0,
                                                              class:
                                                                "inviteDetails",
                                                              onClick: L,
                                                            }))
                                                          : d("", !0),
                                                      ]),
                                                    ]),
                                                  ]),
                                                  _(
                                                    "div",
                                                    {
                                                      class:
                                                        "task-list-item-right",
                                                      onClick: (t) => c(O)(e),
                                                    },
                                                    [
                                                      _(
                                                        "div",
                                                        {
                                                          class: y([
                                                            "btntxt",
                                                            "status-".concat(
                                                              e.status
                                                            ),
                                                          ]),
                                                        },
                                                        I(e.buttontxt),
                                                        3
                                                      ),
                                                      _("div", Si, [
                                                        x(" 抽拼图机会"),
                                                        _(
                                                          "span",
                                                          Ti,
                                                          "+" +
                                                            I(e.addDrawTimes),
                                                          1
                                                        ),
                                                      ]),
                                                    ],
                                                    8,
                                                    Ci
                                                  ),
                                                ],
                                                2
                                              )
                                            )
                                          ),
                                          128
                                        )),
                                      ]),
                                      _: 1,
                                    }
                                  ))
                                : d("", !0),
                            ]))
                          : d("", !0),
                      ]),
                    ];
                  }),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-b456509a"]]
  ),
  Di = (e) => (p("data-v-16f308fb"), (e = e()), v(), e),
  Ai = { key: 0 },
  Li = { class: "invite" },
  Ni = { class: "invite-top" },
  Ri = Di(() => _("div", { class: "invite-top-title" }, "每日拼图", -1)),
  ji = Di(() => _("div", { class: "invite-top-msg" }, "三套集齐均可领", -1)),
  Oi = { class: "invite-puzzle" },
  Ui = ["onClick"],
  Hi = { key: 0, class: "invite-puzzle-board-count" },
  Vi = ["src"],
  qi = { class: "invite-icons" },
  Bi = { class: "invite-list" },
  Mi = ["onClick"],
  Fi = { class: "invite-line" },
  Wi = Di(() => _("div", { class: "invite-line-none" }, null, -1)),
  Xi = { class: "invite-btns" },
  Gi = { class: "invite-btns-times" },
  Yi = Di(() =>
    _(
      "div",
      { class: "invite-msg" },
      [
        _(
          "p",
          null,
          " * 每日参与即送1次抽卡机会，各档位拼图每月限完成1次且每月1号0点重置进度；奖品需手动领取，卡券领取可能存在延迟，领取后预计24小时内到账，数量有限领完即止。 "
        ),
      ],
      -1
    )
  ),
  Zi = { key: 1, class: "outer" },
  Qi = Di(() =>
    _(
      "div",
      { class: "outer-top" },
      [
        _("div", { class: "outer-top-title" }, "每日拼图"),
        _("div", { class: "outer-top-msg" }, "三套集齐均可领"),
      ],
      -1
    )
  ),
  Ki = Di(() => _("div", { class: "outer-img" }, null, -1)),
  Ji = { class: "outer-btn" },
  $i = "拼图模块_",
  eo = nt(
    {
      __name: "ImgInvite",
      setup(t) {
        const a = window.__env || V(),
          {
            ButtonClick: i,
            PopClick: u,
            ButtonExposure: r,
            PopExposure: p,
          } = M(),
          v = ct(),
          { activityInfo: h, currentTime: f } = m(v),
          z = lt(),
          E = be.app,
          S = be.dlwmh,
          T = e(),
          x = e(),
          L = [
            "noReceive",
            "goReceive",
            "goUse",
            "Lock",
            "noStock",
            "Used",
            "Expired",
          ],
          N = ["95折", "9折", "8折"],
          R = e(null),
          j = e(0),
          O = e(0),
          U = e(0),
          H = [
            { key: "p22", label: "95折话费券", receive: "r6" },
            { key: "p23", label: "9折话费券", receive: "r5" },
            { key: "p33", label: "8折话费券", receive: "r4" },
          ],
          F = e([
            { dp1_0: "0", dp1_1: "0", dp1_2: "0", dp1_3: "0" },
            {
              dp2_0: "0",
              dp2_5: "0",
              dp2_1: "0",
              dp2_2: "0",
              dp2_3: "0",
              dp2_4: "0",
            },
            {
              dp3_8: "0",
              dp3_4: "0",
              dp3_5: "0",
              dp3_6: "0",
              dp3_7: "0",
              dp3_0: "0",
              dp3_1: "0",
              dp3_2: "0",
              dp3_3: "0",
            },
          ]),
          W = e([1, 4, 4]),
          X = e([2, 3, 3]),
          G = (e) => {
            j.value = e.activeIndex;
          },
          Y = e(),
          Z = e(!1),
          Q = e(),
          K = () => {
            let e = "";
            switch (O.value) {
              case 0:
              default:
                e = 86;
                break;
              case 1:
                e = 50;
                break;
              case 2:
                e = 0;
            }
            return e + "%";
          },
          J = () => {
            z.openTaskListPop(!0), i({ button_name: $i + "做任务赢机会" });
          },
          ee = (e) => {
            e < 0 || e > 2 || ((j.value = e), R.value.$el.swiper.slideTo(e));
          },
          te = e(!1),
          ae = e(null);
        let se = null;
        const le = () => {
            (te.value = !1), ue(), se && (se.destroy(), (se = null));
          },
          ce = g.throttle(
            async (e, t) => {
              var a;
              if (
                (2 == X.value[e] &&
                  (i({ button_name: $i + "做任务赢机会_按钮点击" }), J()),
                6 == X.value[e] && 2 != j.value)
              ) {
                const e = 0 == j.value ? 9 : 8;
                i({ button_name: $i + "去抽" + e + "折拼图_按钮点击" }),
                  ee(j.value + 1);
              }
              if (1 == X.value[e]) {
                i({ button_name: $i + "抽取" + N[j.value] + "拼图" });
                try {
                  const s = await We({ round: "dp".concat(e + 1) });
                  if ("0" == s.code) {
                    const { default: e } = await rt(
                        () =>
                          import("./vendor/json.BeDsP0r3.js").then((e) => e.e),
                        __vite__mapDeps([])
                      ),
                      t =
                        null == (a = null == s ? void 0 : s.data)
                          ? void 0
                          : a.prize.prizeId,
                      n = Object.assign({
                        "/src/assets/img/ImgInvite/tcpuzzle/dp1_0.png": () =>
                          rt(
                            () => import("./dp1_0.CQVEuHAq.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp1_1.png": () =>
                          rt(
                            () => import("./dp1_1.D7jzuXm5.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp1_2.png": () =>
                          rt(
                            () => import("./dp1_2.B2Tln9mg.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp1_3.png": () =>
                          rt(
                            () => import("./dp1_3.Ssx4tGzC.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp2_0.png": () =>
                          rt(
                            () => import("./dp2_0.uuUWxz8a.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp2_1.png": () =>
                          rt(
                            () => import("./dp2_1.CGdgrjbU.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp2_2.png": () =>
                          rt(
                            () => import("./dp2_2.CIeRUln8.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp2_3.png": () =>
                          rt(
                            () => import("./dp2_3.DfZ-zV4I.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp2_4.png": () =>
                          rt(
                            () => import("./dp2_4.BxhT1xce.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp2_5.png": () =>
                          rt(
                            () => import("./dp2_5.Bi04ASSl.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_0.png": () =>
                          rt(
                            () => import("./dp3_0.B4pc_mEW.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_1.png": () =>
                          rt(
                            () => import("./dp3_1.ByVCIxhg.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_2.png": () =>
                          rt(
                            () => import("./dp3_2.DwziPhPp.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_3.png": () =>
                          rt(
                            () => import("./dp3_3.BJu0bHgk.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_4.png": () =>
                          rt(
                            () => import("./dp3_4.6Pn82OTK.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_5.png": () =>
                          rt(
                            () => import("./dp3_5.BjcFsL_-.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_6.png": () =>
                          rt(
                            () => import("./dp3_6.Dd3NuJr0.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_7.png": () =>
                          rt(
                            () => import("./dp3_7.DqVR2V7y.js"),
                            __vite__mapDeps([])
                          ),
                        "/src/assets/img/ImgInvite/tcpuzzle/dp3_8.png": () =>
                          rt(
                            () => import("./dp3_8.BtNKGtw4.js"),
                            __vite__mapDeps([])
                          ),
                      }),
                      l = Object.keys(n).find((e) => e.includes(t)),
                      c = await n[l]();
                    (e.assets[10].p = c.default),
                      (te.value = !0),
                      ((e) => {
                        A(() => {
                          const t = {
                            name: "VenueAnimation",
                            container: ae.value,
                            renderer: "svg",
                            loop: !1,
                            autoplay: !0,
                            animationData: e,
                          };
                          (se = _t.loadAnimation(t)),
                            se.addEventListener("DOMLoaded", () => {
                              const e = document.getElementById("ani_close");
                              e &&
                                e.addEventListener("click", () => {
                                  le();
                                });
                              const t = document.getElementById("ani_btn");
                              t &&
                                t.addEventListener("click", () => {
                                  const e = "拼图模块_领取成功弹窗";
                                  u({
                                    window_name: e,
                                    button_name: e + "_开心收下",
                                  }),
                                    le();
                                });
                            });
                        });
                      })(e),
                      p({ window_name: $i + "抽卡弹窗_抽卡成功_" + t });
                  } else
                    "160030" == s.code
                      ? z.openHighRiskPop(!0, 2)
                      : 0 == t
                      ? (z.openPicFailedPop(!0),
                        p({ window_name: $i + "抽卡弹窗_抽卡失败_网络异常" }))
                      : z.openPicFailedPop(!0, 1);
                } catch (s) {
                  0 == t
                    ? (z.openPicFailedPop(!0),
                      p({ window_name: $i + "抽卡弹窗_抽卡失败_网络异常" }))
                    : z.openPicFailedPop(!0, 1),
                    p({ window_name: $i + "抽卡弹窗_抽卡失败_网络异常" });
                }
              }
            },
            3e3,
            { leading: !0, trailing: !1 }
          ),
          ie = () => {
            z.openPicFailedPop(!1), ce.cancel(), ce(j.value, 1);
          };
        const oe = (e) =>
          4 === e &&
          (function (e) {
            const t = new Date(e);
            return (
              1 ===
              new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1).getDate()
            );
          })(f.value)
            ? 5
            : e;
        async function ue() {
          var e, t;
          try {
            const { code: a, data: s } = await Xe();
            "0" === a &&
              ((O.value = s.activeIndex - 1),
              (X.value = [
                oe(s.r6DrawStatus),
                oe(s.r5DrawStatus),
                oe(s.r4DrawStatus),
              ]),
              (W.value = [s.r6Status, s.r5Status, s.r4Status]),
              (F.value = [
                s.pictureList[1],
                s.pictureList[2],
                s.pictureList[3],
              ]),
              F.value.forEach((e, t) => {
                var a;
                F.value[t] = (a = e)
                  ? Object.keys(a)
                      .sort()
                      .reduce((e, t) => ((e[t] = a[t]), e), {})
                  : {};
              }),
              (U.value = s.drawTimes),
              (T.value = $(
                "app",
                (null == (e = h.value) ? void 0 : e.telNo) || "",
                s.cardNo
              )),
              (x.value = $(
                "middleLaunchUrl",
                (null == (t = h.value) ? void 0 : t.telNo) || "",
                s.cardNo
              )));
          } catch (a) {}
        }
        const de = () => {
            (Z.value = !1), ue(), v.getPrizeUnuse();
          },
          re = () => {
            z.openPicFailedPop(!1, z.picFailedType);
          },
          pe = e(!1),
          ve = g.throttle(
            async () => {
              i({ button_name: $i + "刷新按钮" }), (pe.value = !0);
              try {
                await ue();
              } catch (e) {
                k("刷新失败");
              } finally {
                setTimeout(() => {
                  (pe.value = !1),
                    k({
                      message: "已刷新",
                      teleport: ".invite",
                      className: "toast-puzzle",
                    });
                }, 500);
              }
            },
            2e3,
            { leading: !0, trailing: !1 }
          );
        function _e(e, t) {
          return new URL(
            Object.assign({
              "/src/assets/img/ImgInvite/puzzle/p22-0.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p22-0.D9CSXuwW.png",
              "/src/assets/img/ImgInvite/puzzle/p22-1.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p22-1.czvjOILE.png",
              "/src/assets/img/ImgInvite/puzzle/p22-2.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p22-2.sHzRxTeq.png",
              "/src/assets/img/ImgInvite/puzzle/p22-3.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p22-3.B7Dy7RGy.png",
              "/src/assets/img/ImgInvite/puzzle/p23-0.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p23-0.Brw7C_xu.png",
              "/src/assets/img/ImgInvite/puzzle/p23-1.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p23-1.B7XV-c-E.png",
              "/src/assets/img/ImgInvite/puzzle/p23-2.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p23-2.BBuOdKUT.png",
              "/src/assets/img/ImgInvite/puzzle/p23-3.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p23-3.CGI8ZijW.png",
              "/src/assets/img/ImgInvite/puzzle/p23-4.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p23-4.Cv4dXz2x.png",
              "/src/assets/img/ImgInvite/puzzle/p23-5.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p23-5.CE_GEti3.png",
              "/src/assets/img/ImgInvite/puzzle/p33-0.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-0.DBJzYkpJ.png",
              "/src/assets/img/ImgInvite/puzzle/p33-1.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-1.DYtu6kH5.png",
              "/src/assets/img/ImgInvite/puzzle/p33-2.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-2.Cmh5_AbR.png",
              "/src/assets/img/ImgInvite/puzzle/p33-3.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-3.CjzktNGA.png",
              "/src/assets/img/ImgInvite/puzzle/p33-4.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-4.DLC3PfLq.png",
              "/src/assets/img/ImgInvite/puzzle/p33-5.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-5.CCXIULcj.png",
              "/src/assets/img/ImgInvite/puzzle/p33-6.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-6.DeRyXTuy.png",
              "/src/assets/img/ImgInvite/puzzle/p33-7.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-7.Bxxhok_t.png",
              "/src/assets/img/ImgInvite/puzzle/p33-8.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/p33-8.Bn9noHIv.png",
              "/src/assets/img/ImgInvite/puzzle/status-p22-1.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/status-p22-1.Dt0rxbaw.png",
              "/src/assets/img/ImgInvite/puzzle/status-p23-4.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/status-p23-4.WNY-tvri.png",
              "/src/assets/img/ImgInvite/puzzle/status-p33-4.png":
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/status-p33-4.BVL7P43a.png",
            })[
              "/src/assets/img/ImgInvite/puzzle/"
                .concat(e, "-")
                .concat(t, ".png")
            ],
            import.meta.url
          ).href;
        }
        return (
          s(async () => {
            (Y.value = L[0]), await ue();
            const e = q("shareCodes");
            e &&
              (async function (e) {
                try {
                  const t = await Ge({ code: e });
                  if (e) {
                    let t = setTimeout(() => {
                      history.replaceState(
                        null,
                        null,
                        window.location.href.replace(e, "")
                      ),
                        Ye("router"),
                        clearTimeout(t);
                    }, 1e3);
                  }
                  if ("160019" === t.code) return;
                  z.openAssitPop(!0, t);
                } catch (t) {}
              })(e),
              R.value.$el.swiper.slideTo(O.value),
              r({ button_name: $i + H[O.value].label });
          }),
          (e, t) => {
            const s = P;
            return !0
              ? (n(),
                l("div", Ai, [
                  C(
                    s,
                    { show: te.value },
                    {
                      default: o(() => [
                        _(
                          "div",
                          {
                            ref_key: "skAnimation",
                            ref: ae,
                            class: "animation",
                          },
                          null,
                          512
                        ),
                      ]),
                      _: 1,
                    },
                    8,
                    ["show"]
                  ),
                  _("div", Li, [
                    _("div", Ni, [
                      Ri,
                      ji,
                      _(
                        "div",
                        {
                          class: "invite-top-record",
                          onClick:
                            t[0] ||
                            (t[0] = (e) => (
                              z.openPuzzleDetailPop(!0),
                              void i({ button_name: $i + "拼图记录" })
                            )),
                        },
                        "拼图记录"
                      ),
                      _(
                        "div",
                        {
                          class: y([
                            "invite-top-refresh",
                            { rotating: pe.value },
                          ]),
                          onClick:
                            t[1] || (t[1] = (...e) => c(ve) && c(ve)(...e)),
                        },
                        null,
                        2
                      ),
                    ]),
                    _("div", Oi, [
                      _("div", {
                        class: "invite-puzzle-arrowLeft",
                        onClick: t[2] || (t[2] = (e) => ee(j.value - 1)),
                      }),
                      _("div", {
                        class: "invite-puzzle-arrowRight",
                        onClick: t[3] || (t[3] = (e) => ee(j.value + 1)),
                      }),
                      C(
                        c(wt),
                        {
                          ref_key: "swiperRef",
                          ref: R,
                          "slides-per-view": 1,
                          "space-between": 0,
                          "centered-slides": !0,
                          class: "puzzle-img",
                          loop: !1,
                          autoplay: !1,
                          "allow-touch-move": !0,
                          onSlideChange: G,
                        },
                        {
                          default: o(() => [
                            (n(),
                            l(
                              w,
                              null,
                              b(H, (e, t) =>
                                C(
                                  c(yt),
                                  { key: t },
                                  {
                                    default: o(() => [
                                      _(
                                        "div",
                                        {
                                          class: y([
                                            "invite-puzzle-board",
                                            [
                                              "puzzle"
                                                .concat(t, "-")
                                                .concat(W.value[t]),
                                              "puzzle".concat(t),
                                            ],
                                          ]),
                                        },
                                        [
                                          _(
                                            "div",
                                            {
                                              class: y([
                                                "invite-puzzle-board-status",
                                                "status" +
                                                  e.key +
                                                  "-" +
                                                  W.value[t],
                                              ]),
                                              onClick: (a) =>
                                                (async (e, t) => {
                                                  2 == W.value[t]
                                                    ? ((Q.value = e.receive),
                                                      (Z.value = !0),
                                                      i({
                                                        button_name:
                                                          $i +
                                                          e.label +
                                                          "_立即领取",
                                                      }))
                                                    : 3 == W.value[t] &&
                                                      (B(ne.app),
                                                      i({
                                                        button_name:
                                                          $i +
                                                          e.label +
                                                          "_去使用",
                                                        button_url: ne.app,
                                                      }));
                                                })(e, t),
                                            },
                                            null,
                                            10,
                                            Ui
                                          ),
                                          (n(!0),
                                          l(
                                            w,
                                            null,
                                            b(
                                              F.value[t],
                                              (t, a, s) => (
                                                n(),
                                                l("div", { key: a }, [
                                                  t > 1
                                                    ? (n(),
                                                      l(
                                                        "div",
                                                        Hi,
                                                        " x" + I(t),
                                                        1
                                                      ))
                                                    : d("", !0),
                                                  t > 0
                                                    ? (n(),
                                                      l(
                                                        "img",
                                                        {
                                                          key: 1,
                                                          class:
                                                            "invite-puzzle-board-item",
                                                          src: _e(e.key, s),
                                                        },
                                                        null,
                                                        8,
                                                        Vi
                                                      ))
                                                    : d("", !0),
                                                ])
                                              )
                                            ),
                                            128
                                          )),
                                        ],
                                        2
                                      ),
                                    ]),
                                    _: 2,
                                  },
                                  1024
                                )
                              ),
                              64
                            )),
                          ]),
                          _: 1,
                        },
                        512
                      ),
                    ]),
                    _("div", qi, [
                      (n(),
                      l(
                        w,
                        null,
                        b(3, (e) =>
                          _("div", { key: e }, [
                            _(
                              "div",
                              {
                                class: y([
                                  "invite-icons-icon",
                                  { active: j.value === e - 1 },
                                ]),
                              },
                              null,
                              2
                            ),
                          ])
                        ),
                        64
                      )),
                    ]),
                    _("div", Bi, [
                      (n(!0),
                      l(
                        w,
                        null,
                        b(
                          X.value,
                          (e, t) => (
                            n(),
                            l(
                              "div",
                              {
                                key: t,
                                class: y([
                                  "invite-list-outer",
                                  { active: j.value === t },
                                ]),
                                onClick: (e) => ee(t),
                              },
                              [
                                _(
                                  "div",
                                  {
                                    class: y([
                                      "invite-list-item",
                                      [
                                        "item",
                                        "item".concat(t),
                                        { active: j.value === t },
                                      ],
                                    ]),
                                  },
                                  null,
                                  2
                                ),
                                _(
                                  "div",
                                  {
                                    class: y([
                                      "invite-list-logo",
                                      O.value >= t ? "logo-active" : "",
                                    ]),
                                  },
                                  null,
                                  2
                                ),
                              ],
                              10,
                              Mi
                            )
                          )
                        ),
                        128
                      )),
                    ]),
                    _("div", Fi, [
                      Wi,
                      _(
                        "div",
                        {
                          class: "invite-line-round",
                          style: D({ width: K() }),
                        },
                        null,
                        4
                      ),
                    ]),
                    _("div", Xi, [
                      _("div", {
                        class: "invite-btns-detail",
                        onClick:
                          t[4] ||
                          (t[4] = (e) => (
                            z.openSendPuzzlePop(!0),
                            void i({ button_name: $i + "赠/求拼图_按钮点击" })
                          )),
                      }),
                      _("div", Gi, "剩余" + I(U.value) + "次", 1),
                      _(
                        "div",
                        {
                          class: y([
                            "invite-btns-draw",
                            "drawStatus"
                              .concat(j.value, "-")
                              .concat(X.value[j.value]),
                          ]),
                          onClick: t[5] || (t[5] = (e) => c(ce)(j.value, 0)),
                        },
                        null,
                        2
                      ),
                      _("div", { class: "invite-btns-task", onClick: J }),
                    ]),
                    Yi,
                    C(
                      c(Hc),
                      { "unlock-status-list": X.value, "active-idx": O.value },
                      null,
                      8,
                      ["unlock-status-list", "active-idx"]
                    ),
                    C(c(si)),
                    C(c(bc), { onRefresh: ue }),
                    C(c(dc)),
                    C(c(Dl)),
                    C(c(xi), { onUpdateTimes: ue }),
                    C(c(_i)),
                    C(
                      c(Ha),
                      {
                        "pop-show": Z.value,
                        "pop-up-type": "invite",
                        "pop-param": Q.value,
                        onClosePop: de,
                      },
                      null,
                      8,
                      ["pop-show", "pop-param"]
                    ),
                    C(c(gl)),
                    C(c(fl)),
                    C(c(wl), { onRetry: ie, onClose: re }),
                  ]),
                ]))
              : (n(),
                l("div", Zi, [
                  Qi,
                  Ki,
                  _("div", Ji, [
                    C(
                      c(Pt),
                      {
                        "launch-url": c(E),
                        "middle-launch-url": c(S),
                        "btn-name": "首页-端外_去中国移动客户端参与",
                      },
                      null,
                      8,
                      ["launch-url", "middle-launch-url"]
                    ),
                  ]),
                ]));
          }
        );
      },
    },
    [["__scopeId", "data-v-16f308fb"]]
  ),
  to = (e) => (p("data-v-09c75fd4"), (e = e()), v(), e),
  ao = { key: 0, class: "point" },
  so = { class: "point-number" },
  no = { class: "point-list" },
  lo = ["src"],
  co = { class: "point-list-item-content" },
  io = to(() =>
    _("div", { class: "point-list-item-content-count" }, "话费充值", -1)
  ),
  oo = { class: "point-list-item-content-discount" },
  uo = to(() => _("span", null, "￥", -1)),
  ro = { class: "point-btn" },
  po = nt(
    {
      __name: "pointDiscount",
      setup(e) {
        const t = window.__env || V(),
          { ButtonExposure: a } = M(),
          i = ct(),
          { activityInfo: o } = m(i),
          u = [
            {
              count: 10,
              discount: 5,
              imgUrl:
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/img1.Bo4G5qHL.png",
            },
            {
              count: 100,
              discount: 90,
              imgUrl:
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/assets/img2.Bt8vyv0I.png",
            },
          ];
        return (
          s(() => {
            var e;
            if (null == (e = o.value) ? void 0 : e.isPointModuleShow) {
              const e = ne.app;
              a({
                button_name: "充值享积分折扣模块",
                button_url: e,
                page_touch_id: q("touch_id", e),
                element_four_channel: q("channelId", e),
                button_type: "app" != t ? "APP引流" : "",
              });
            }
          }),
          (e, t) => {
            var a, s;
            return (null == (a = c(o)) ? void 0 : a.isPointModuleShow)
              ? (n(),
                l("div", ao, [
                  _("div", so, [
                    x(" 我的积分"),
                    _(
                      "span",
                      null,
                      I((null == (s = c(o)) ? void 0 : s.jkPoints) || 0),
                      1
                    ),
                  ]),
                  _("div", no, [
                    (n(),
                    l(
                      w,
                      null,
                      b(u, (e, t) =>
                        _("div", { key: t, class: "point-list-item" }, [
                          _(
                            "img",
                            { src: e.imgUrl, class: "point-list-item-logo" },
                            null,
                            8,
                            lo
                          ),
                          _("div", co, [
                            io,
                            _("div", oo, [
                              x(" 售价:"),
                              _("span", null, "￥" + I(e.count), 1),
                              uo,
                              _("span", null, I(e.discount), 1),
                            ]),
                          ]),
                        ])
                      ),
                      64
                    )),
                  ]),
                  _("div", ro, [
                    C(
                      c(ss),
                      { "animation-data": c(ft), class: "point-btn-animation" },
                      null,
                      8,
                      ["animation-data"]
                    ),
                    C(
                      c(Pt),
                      {
                        class: "point-btn-launch",
                        "launch-url": c($)("app", c(o).telNo),
                        "middle-launch-url": c($)(
                          "middleLaunchUrl",
                          c(o).telNo
                        ),
                        "btn-name": "充值享积分折扣_去充值",
                      },
                      null,
                      8,
                      ["launch-url", "middle-launch-url"]
                    ),
                  ]),
                ]))
              : d("", !0);
          }
        );
      },
    },
    [["__scopeId", "data-v-09c75fd4"]]
  ),
  vo = { key: 0 },
  _o = { key: 0, class: "pop-title" },
  mo = { key: 1, class: "pop-text" },
  go = { key: 2, class: "success-card" },
  ho = { key: 0, class: "success-card-outer" },
  yo = { class: "success-card-outer-price" },
  wo = { class: "success-card-outer-text" },
  bo = { key: 4, class: "pop-date" },
  Io = { key: 5, class: "pop-errortext" },
  fo = { key: 6, class: "pop-network" },
  ko = nt(
    {
      __name: "receiveGivePop",
      emits: ["closeGivePop"],
      setup(t, { emit: a }) {
        const { PopExposure: s, PopClick: i } = M(),
          u = lt(),
          r = e(!0),
          p = e(null),
          v = e(),
          m = e(),
          g = a,
          w = {
            160065: "来晚一步\n充值券已经失效啦",
            160066: "不能领取自己分享的充值券~",
            160067: "来晚一步\n充值券已经被别人领走啦~",
            160068: "您这个月已经使用充值券啦\n这张充值券留给其他人吧~",
            160069: "您有未使用的充值券啦\n这张充值券留给其他人吧~",
            160054: "网络异常，请稍后重试",
          },
          b = {
            160065: "充值券失效弹窗",
            160066: "领取自己分享的充值券弹窗",
            160067: "充值券已经被别人领走弹窗",
            160068: "这个月已经使用充值券弹窗",
            160069: "有未使用的充值券弹窗",
            160054: "网络异常弹窗",
          },
          f = e(""),
          k = e(!1),
          z = () => {
            k.value && g("closeGivePop", 1), u.openGivePop(!1);
            const e = q("giveCodes");
            if (q("giveCodes")) {
              let t = setTimeout(() => {
                history.replaceState(
                  null,
                  null,
                  window.location.href.replace(e, "")
                ),
                  clearTimeout(t);
              }, 1e3);
            }
          },
          E = async (e) => {
            try {
              const t = await Qe({ code: q("giveCodes") });
              "0" === t.code
                ? ((k.value = !0), z())
                : "160067" == t.code
                ? ((p.value = "noStock"),
                  (f.value = w[t.code]),
                  s({
                    window_name: "周三转赠_领取充值券失败弹窗",
                    button_name: "已领完",
                  }))
                : ((p.value = e
                    ? "failed-again"
                    : "160067" == t.code
                    ? "noStock"
                    : "failed"),
                  (f.value = w[t.code]),
                  s({
                    window_name: "周三转赠_领取充值券失败弹窗",
                    button_name: "周三转赠_领取失败弹窗_奖励领取失败_立即重试",
                  })),
                (r.value = !0);
            } catch (t) {
              (p.value = e ? "failed-again" : "failed"), (r.value = !0);
            }
          },
          S = async () => {
            "success" === p.value
              ? (i({
                  window_name: "周三转赠_转赠充值券弹窗",
                  button_name: "周三转赠_转赠充值券弹窗_开心收下",
                }),
                E())
              : "failed" === p.value
              ? (i({
                  window_name: "周三转赠_领取充值券失败弹窗",
                  button_name: "周三转赠_领取失败弹窗_奖励领取失败_立即重试",
                }),
                (r.value = !1),
                E(!0))
              : "error" === p.value && u.openGivePop(!1);
          };
        return (
          h(
            () => u.givePopShow,
            (e) => {
              e &&
                ((k.value = !1),
                (async () => {
                  var e, t;
                  const a = q("giveCodes");
                  try {
                    const n = await Ze({ code: a });
                    "0" === n.code
                      ? ((p.value = "success"),
                        (m.value = n.data.actPrize[0]),
                        (v.value = m.value.shortName + m.value.prizeName),
                        s({
                          window_name: "周三转赠_转赠充值券弹窗",
                          button_name: "周三转赠_转赠充值券弹窗_开心收下",
                        }))
                      : ((p.value = "error"),
                        (f.value = null != (e = w[n.code]) ? e : w[160054]),
                        s({
                          window_name:
                            "周三转赠_" +
                            (null != (t = b[n.code]) ? t : b[160054]),
                          button_name: "我知道了",
                        }));
                  } catch (n) {}
                })());
            }
          ),
          (e, t) => {
            const a = P;
            return r.value
              ? (n(),
                l("div", vo, [
                  C(
                    a,
                    { show: c(u).givePopShow },
                    {
                      default: o(() => [
                        _(
                          "div",
                          { class: y(["pop", "".concat(p.value, "-bg")]) },
                          [
                            "success" == p.value
                              ? (n(),
                                l(
                                  "div",
                                  _o,
                                  " 尾号" +
                                    I(m.value.from) +
                                    "好友赠送您一张充值券 ",
                                  1
                                ))
                              : d("", !0),
                            "noStock" == p.value
                              ? (n(), l("div", mo, "奖励领取失败"))
                              : d("", !0),
                            "success" == p.value
                              ? (n(),
                                l("div", go, [
                                  m.value
                                    ? (n(),
                                      l("div", ho, [
                                        _("div", yo, [
                                          _(
                                            "span",
                                            null,
                                            I(c(X)(m.value.shortName)[0]),
                                            1
                                          ),
                                          _(
                                            "span",
                                            null,
                                            I(c(X)(m.value.shortName)[1]),
                                            1
                                          ),
                                        ]),
                                        _("div", wo, [
                                          _("p", null, I(m.value.prizeName), 1),
                                          _("p", null, I(m.value.subTitle), 1),
                                        ]),
                                      ]))
                                    : d("", !0),
                                ]))
                              : (n(),
                                l(
                                  "div",
                                  {
                                    key: 3,
                                    class: y(["".concat(p.value, "-card")]),
                                  },
                                  null,
                                  2
                                )),
                            "success" == p.value
                              ? (n(), l("div", bo, "预计24小时内到账"))
                              : d("", !0),
                            ["noStock", "error"].includes(p.value)
                              ? (n(), l("div", Io, I(f.value), 1))
                              : d("", !0),
                            "failed" == p.value
                              ? (n(), l("div", fo, "网络异常，请稍后重试~"))
                              : d("", !0),
                            _(
                              "div",
                              {
                                class: y([
                                  "pop-btn",
                                  "".concat(p.value, "-btn"),
                                ]),
                                onClick: S,
                              },
                              null,
                              2
                            ),
                          ],
                          2
                        ),
                        _("div", { class: "close", onClick: z }),
                      ]),
                      _: 1,
                    },
                    8,
                    ["show"]
                  ),
                ]))
              : d("", !0);
          }
        );
      },
    },
    [["__scopeId", "data-v-d9b5c9cd"]]
  ),
  zo = (e) => (p("data-v-c279aea6"), (e = e()), v(), e),
  Po = { class: "rule" },
  Eo = { key: 0, class: "rule_content" },
  Co = [
    zo(() =>
      _(
        "div",
        { class: "rule_content_title" },
        [
          x(
            " 活动期间，中国移动用户（不含中国港澳台地区）进入活动页面可参与领取充值券包，"
          ),
          _("span", null, "每用户限参加一次"),
          x("，数量有限，先到先得，发完即止。活动奖品如下： "),
        ],
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        { class: "rule_content_list" },
        [
          _("table", { border: "0", cellspacing: "0", cellpadding: "0" }, [
            _("tr", null, [
              _("th", { style: { width: "90px" } }, "奖品类型"),
              _("th", { style: { width: "90px" } }, "券包档位"),
              _("th", { style: { width: "70px" } }, "第一月"),
              _("th", { style: { width: "70px" } }, "第二月"),
              _("th", { style: { width: "70px" } }, "第三月"),
              _("th", { style: { width: "120px" } }, "券可用档位"),
            ]),
            _("tr", null, [
              _("td", null, "充值券包"),
              _("td", null, "10元"),
              _("td", null, "5元"),
              _("td", null, "2元"),
              _("td", null, "3元"),
              _("td", null, "充值10元及以上立减"),
            ]),
          ]),
        ],
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        null,
        [
          x(
            " 1、本活动充值券包内含3张充值立减券，分三个月可用，当月获得券包用户当月可使用1张，次月可领取第二张，次次月可领取第三张，"
          ),
          _(
            "span",
            null,
            "次月或者次次月需进入活动页面手动领取，当月逾期未领取卡券资格自动失效"
          ),
          x("。 "),
        ],
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        null,
        [
          x(" 2、话费优惠券仅限在中国移动APP充值使用，所得"),
          _("span", null, "卡券不转账、不提现、不退还、不支持打印发票"),
          x(
            "。话费充值立减券，充值10元及以上可用，充值时使用可立减优惠，例如充值10元即支付5元到账10元话费。 "
          ),
        ],
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        null,
        [
          x(" 3、话费充值优惠券"),
          _(
            "span",
            null,
            "仅限获取该券的手机号码使用，不可转赠，不可为他人兑换"
          ),
          x("，所得卡券"),
          _("span", null, "不结转、不退换、不共享"),
          x("，同一手机号算作一个用户。 "),
        ],
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        null,
        " 4、本活动所涉及话费券将于用户中奖后24小时内到账，用户可前往中国移动APP“首页-卡券中心”或“首页-我的卡券”或“中国移动APP-我的-服务大厅-我的卡券”中查看话费券并使用，有效期为5天，请在有效期内使用，逾期自动失效，请合理安排使用。 ",
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        null,
        [
          x(" 5、活动期间请用户保持号码状态正常，"),
          _(
            "span",
            null,
            "若因销户、停机等因素导致奖励无法到账，移动公司不予补赠"
          ),
          x("。 "),
        ],
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        null,
        " 6、若发现作弊行为，我司可取消其获赠资格，不作任何补偿，包括但不限于作弊、机器刷分、扰乱系统、实施网络攻击，中国移动有权终止其参与活动、取消活动资格。 ",
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        null,
        " 7、活动仅限中国移动用户（不含中国港澳台地区）参与，机器卡、行业卡、互联网账号、异网号码不能参加活动，活动期间客户号码需保持状态正常，欠费、停机、销户、携号转网、未进行实名制认证等异常状态会导致无法参与活动。 ",
        -1
      )
    ),
    zo(() =>
      _(
        "div",
        null,
        " 8、部分省侧套餐因业务限制导致互斥无法领取成功，因各省政策不同，非实名制客户、M-Free卡客户、无线通、随E行、移动总机、固话、商话、公话、快捷通、金卡快捷通、WAP封顶套餐、2G/3G不限量套餐、4G随心王、携号转网及家庭副卡等用户可能无法享受充值折扣，请以各省实际规则为准。 ",
        -1
      )
    ),
    zo(() => _("div", null, "9、其他活动未尽事宜，详询 10086。", -1)),
  ],
  So = ["innerHTML"],
  To = nt(
    {
      __name: "rulePop",
      setup(t) {
        const a = lt(),
          s = e("");
        h(
          () => a.ruleShow,
          (e) => {
            e &&
              (a.ruleType ||
                (async function () {
                  const { data: e } = await Ke();
                  s.value = e.activityInfo.rules;
                })());
          }
        );
        const u = () => {
          (s.value = ""), a.openRulePop(!1);
        };
        return (e, t) => {
          const d = P;
          return (
            n(),
            i(
              d,
              { show: c(a).ruleShow, onClickOverlay: u },
              {
                default: o(() => [
                  _("div", Po, [
                    c(a).ruleType
                      ? (n(), l("div", Eo, Co))
                      : (n(),
                        l(
                          "div",
                          { key: 1, class: "rule_content", innerHTML: s.value },
                          null,
                          8,
                          So
                        )),
                  ]),
                  _("div", { class: "close", onClick: u }),
                ]),
                _: 1,
              },
              8,
              ["show"]
            )
          );
        };
      },
    },
    [["__scopeId", "data-v-c279aea6"]]
  ),
  xo = (e) => (p("data-v-2e76b04b"), (e = e()), v(), e),
  Do = xo(() => _("div", { class: "permission-title" }, "开启通知权限", -1)),
  Ao = xo(() =>
    _(
      "div",
      { class: "permission-text" },
      [
        x(" 您的系统通知权限未开启,"),
        _("br"),
        x("无法接受通知，请前往开启"),
        _("br"),
      ],
      -1
    )
  ),
  Lo = nt(
    {
      __name: "permissionPop",
      emits: ["closeCallBack"],
      setup(e, { emit: t }) {
        const a = lt(),
          { PopExposure: s, PopClick: l } = M(),
          u = t,
          d = () => {
            l({
              window_name: "未开启系统通知权限弹窗",
              button_name: "未开启系统通知权限弹窗_去开启",
            }),
              ia.showRequesPop(),
              a.openSubscribePop(!1),
              a.openPermissionPop(!1);
          },
          r = () => {
            u("closeCallBack"), a.openPermissionPop(!1);
          };
        return (
          h(
            () => a.permissionShow,
            (e) => {
              e &&
                s({
                  window_name: "未开启系统通知权限弹窗",
                  button_name: "未开启系统通知权限弹窗_去开启",
                });
            }
          ),
          (e, t) => {
            const s = P;
            return (
              n(),
              i(
                s,
                { show: c(a).permissionShow },
                {
                  default: o(() => [
                    _("div", { class: "permission" }, [
                      Do,
                      Ao,
                      _("div", { class: "permission-btn", onClick: d }),
                    ]),
                    _("div", { class: "permission-close", onClick: r }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-2e76b04b"]]
  ),
  No = (e) => (p("data-v-cb998d9d"), (e = e()), v(), e),
  Ro = No(() => _("div", { class: "confirm-title" }, "提示", -1)),
  jo = No(() =>
    _(
      "div",
      { class: "confirm-content" },
      [
        x("  您正在使用订阅功能，我们将为您提供"),
        _("br"),
        x(" 微信第三方订阅路径，是否使用订阅功能"),
      ],
      -1
    )
  ),
  Oo = nt(
    {
      __name: "conWxSubPop",
      emits: ["confirmGoWx"],
      setup(e, { emit: t }) {
        const { PopExposure: a, PopClick: s } = M(),
          l = t,
          u = lt(),
          d = () => {
            s({
              window_name: "端内订阅微信小程序确认弹窗",
              button_name: "端内订阅微信小程序确认弹窗_确认",
            }),
              u.openConWxSubPop(!1),
              l("confirmGoWx");
          },
          r = () => {
            s({
              window_name: "端内订阅微信小程序确认弹窗",
              button_name: "端内订阅微信小程序确认弹窗_取消",
            }),
              u.openConWxSubPop(!1);
          };
        return (
          h(
            () => u.conWxSubPopShow,
            (e) => {
              e &&
                a({
                  window_name: "端内订阅微信小程序确认弹窗",
                  button_name:
                    "端内订阅微信小程序确认弹窗_确认，端内订阅微信小程序确认弹窗_取消",
                });
            }
          ),
          (e, t) => {
            const a = P;
            return (
              n(),
              i(
                a,
                { show: c(u).conWxSubPopShow },
                {
                  default: o(() => [
                    _("div", { class: "confirm" }, [
                      Ro,
                      jo,
                      _("div", { class: "confirm-btn" }, [
                        _(
                          "div",
                          { class: "confirm-btn-cancel", onClick: r },
                          "取消"
                        ),
                        _(
                          "div",
                          { class: "confirm-btn-confirm", onClick: d },
                          "确认"
                        ),
                      ]),
                    ]),
                    _("div", { class: "close", onClick: r }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-cb998d9d"]]
  ),
  Uo = (e) => (p("data-v-ff39018e"), (e = e()), v(), e),
  Ho = { class: "subscribe" },
  Vo = Uo(() => _("div", { class: "subscribe-title" }, "订阅提醒", -1)),
  qo = { class: "subscribe-list" },
  Bo = { class: "subscribe-list-top" },
  Mo = Uo(() =>
    _("div", { class: "subscribe-list-top-title" }, "APP消息提醒", -1)
  ),
  Fo = Uo(() =>
    _(
      "div",
      { class: "subscribe-list-text" },
      "订阅后，将在充值券开抢前为您发送通知",
      -1
    )
  ),
  Wo = { key: 0, class: "subscribe-list" },
  Xo = Uo(() =>
    _("div", { class: "subscribe-list-top-title" }, "系统通知权限提醒", -1)
  ),
  Go = Uo(() =>
    _(
      "div",
      { class: "subscribe-list-text" },
      " 您的系统通知权限未开启无法接受通知，请前往开启 ",
      -1
    )
  ),
  Yo = { class: "subscribe-list" },
  Zo = { class: "subscribe-list-top" },
  Qo = Uo(() =>
    _("div", { class: "subscribe-list-top-title" }, "微信消息提醒", -1)
  ),
  Ko = Uo(() =>
    _(
      "div",
      { class: "subscribe-list-text" },
      "订阅后将由中国移动10086微信小程序为您发送通知",
      -1
    )
  ),
  Jo = nt(
    {
      __name: "subscribePop",
      setup(t) {
        const a = ct(),
          { activityInfo: s } = m(a),
          u = lt(),
          { PopExposure: r, PopClick: p } = M(),
          v = e(!1),
          w = e(),
          b = e(!1),
          I = e(!1),
          f = g.throttle(
            async () => {
              const { code: e, data: t } = await Je();
              "0" === e
                ? (p({
                    window_name: "APP订阅弹窗",
                    button_name: "APP订阅弹窗_".concat(
                      t ? "开启" : "关闭",
                      "订阅"
                    ),
                  }),
                  (v.value = t),
                  k("APP消息订阅已经".concat(t ? "开启" : "关闭")),
                  a.queryActivityInfo(),
                  t && !w.value ? u.openPermissionPop(!0) : (b.value = !1),
                  ia.handleDynamicIslandMessage(t ? "subscribe" : "cancel"))
                : k("APP消息订阅开启失败");
            },
            2e3,
            { leading: !0, trailing: !1 }
          ),
          z = () => {
            u.openSubscribePop(!1);
          },
          E = () => {
            p({
              window_name: "APP订阅弹窗_未开启系统通知",
              button_name: "APP订阅弹窗_未开启系统通知_去开启",
            }),
              ia.showRequesPop(),
              z();
          },
          S = () => {
            if (I.value) return !1;
            p({
              window_name: "APP订阅弹窗",
              button_name: "APP订阅弹窗_订阅微信小程序消息提醒_去订阅",
            }),
              u.openConWxSubPop(!0);
          },
          T = () => {
            u.openSubscribePop(!1),
              ia.subTask(s.value.signMobile, s.value.stoken);
          },
          x = () => {
            b.value = !0;
          };
        return (
          h(
            () => u.subscribeShow,
            (e) => {
              e &&
                ((v.value = s.value.appSubscribeStatus),
                (I.value = s.value.subscribeStatus),
                (async () => {
                  const e = await ia.getPermissionStatus();
                  (w.value = "1" == e),
                    v.value && !w.value
                      ? ((b.value = !0),
                        r({
                          window_name: "APP订阅弹窗_未开启系统通知",
                          button_name: "APP订阅弹窗_未开启系统通知_去开启",
                        }))
                      : (b.value = !1);
                })(),
                r({
                  window_name: "APP订阅弹窗",
                  button_name: "APP订阅弹窗_".concat(
                    v.value ? "关闭" : "开启",
                    "订阅"
                  ),
                }));
            }
          ),
          (e, t) => {
            const a = O,
              s = P;
            return (
              n(),
              i(
                s,
                { show: c(u).subscribeShow, position: "bottom", round: "" },
                {
                  default: o(() => [
                    _("div", { class: "close", onClick: z }),
                    _("div", Ho, [
                      Vo,
                      _("div", qo, [
                        _("div", Bo, [
                          Mo,
                          C(
                            a,
                            {
                              "model-value": v.value,
                              size: "20px",
                              "active-color": "#4AD763",
                              "onUpdate:modelValue": c(f),
                            },
                            null,
                            8,
                            ["model-value", "onUpdate:modelValue"]
                          ),
                        ]),
                        Fo,
                      ]),
                      b.value
                        ? (n(),
                          l("div", Wo, [
                            _("div", { class: "subscribe-list-top" }, [
                              Xo,
                              _("div", {
                                class: "subscribe-list-top-btn goApp",
                                onClick: E,
                              }),
                            ]),
                            Go,
                          ]))
                        : d("", !0),
                      _("div", Yo, [
                        _("div", Zo, [
                          Qo,
                          _(
                            "div",
                            {
                              class: y([
                                "subscribe-list-top-btn goSubscribe",
                                { subscribed: I.value },
                              ]),
                              onClick: S,
                            },
                            null,
                            2
                          ),
                        ]),
                        Ko,
                      ]),
                    ]),
                    C(c(Lo), { onCloseCallBack: x }),
                    C(c(Oo), { onConfirmGoWx: T }),
                  ]),
                  _: 1,
                },
                8,
                ["show"]
              )
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-ff39018e"]]
  ),
  $o = (e) => (p("data-v-9ad8491e"), (e = e()), v(), e),
  eu = { key: 0, class: "sx" },
  tu = { class: "sx-top" },
  au = $o(() => _("div", { class: "sx-top-title" }, "陕西专属优惠", -1)),
  su = $o(() => _("div", { class: "sx-receive-tag" }, null, -1)),
  nu = { class: "sx-receive-price" },
  lu = $o(() => _("span", null, "￥", -1)),
  cu = { class: "sx-receive-text" },
  iu = $o(() => _("p", null, "话费加赠券包", -1)),
  ou = ["innerHTML"],
  uu = { key: 0 },
  du = { key: 1, class: "sx-list" },
  ru = { key: 0, class: "sx-list-item-tag" },
  pu = { class: "sx-list-item-left" },
  vu = $o(() => _("span", null, "￥", -1)),
  _u = { class: "sx-list-item-right" },
  mu = { class: "sx-list-item-right-text" },
  gu = { key: 1, class: "btn5" },
  hu = $o(() =>
    _(
      "div",
      { class: "sx-tips" },
      [_("span", null, "Tips"), x("快邀请您的亲友薅羊毛~")],
      -1
    )
  ),
  yu = nt(
    {
      __name: "sxFloor",
      setup(a) {
        const o = ct(),
          { activityInfo: u, userInfo: r } = m(o),
          { ButtonClick: p, ButtonExposure: v } = M(),
          h = e(!1),
          f = e(!1),
          z = e(),
          P = e(""),
          E = t(() => P.value.replace(/(\d+元)/g, "<strong>$1</strong>")),
          S = e(),
          T = e(!1),
          D = e(""),
          A = e(),
          L = ["noStart", "receive", "noStock"],
          N = e(),
          R = e(!0),
          j = g.throttle(
            async () => {
              if ("290" !== r.value.provinceCode) return;
              const { code: e, data: t } = await $e();
              if ("0" === e && t) {
                if (!t.isSxShow || !t.prizeList.length) return;
                h.value = t.isSxShow;
                const e = ["本月", "次月", "次次月"];
                let a = !1,
                  s = !0;
                t.prizeList.forEach((t, n) => {
                  const l =
                    t.sendStatus.includes("激活") ||
                    t.sendStatus.includes("可用");
                  (t.btnName = e[n]),
                    (t.showTag = l),
                    (t.sortNumber = l ? 5 : t.sendStatus),
                    9 != t.sendStatus && (s = !1),
                    8 != t.sendStatus && (a = !0);
                }),
                  s ? (N.value = L[2]) : a ? (f.value = !0) : (N.value = L[1]),
                  (z.value = t.prizeList.reduce(
                    (e, t) => e + parseFloat(t.shortName),
                    0
                  )),
                  (P.value = t.prizeList
                    .map(
                      (e) =>
                        ("本月" === e.btnName ? "当月" : e.btnName) +
                        e.shortName
                    )
                    .join("+")),
                  R.value &&
                    !f.value &&
                    v({
                      button_name: "陕西专属优惠_".concat(
                        t.prizeList[0].iopName
                      ),
                    }),
                  (R.value = !1),
                  (S.value = t.prizeList.sort(
                    (e, t) => e.sortNumber - t.sortNumber
                  ));
              }
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          O = () => {
            N.value === L[1] &&
              (p({
                button_name: "陕西专属_"
                  .concat(z.value, "元_")
                  .concat(S.value[0].iopName, "_立即领取"),
              }),
              (A.value = "sx"),
              (T.value = !0));
          },
          U = () => {
            (T.value = !1), j(), o.getPrizeUnuse();
          },
          H = g.debounce(
            () => {
              p({ button_name: "湖北专属优惠_刷新按钮" }),
                k({ message: "加载中...", forbidClick: !0 }),
                (N.value = ""),
                j();
            },
            1e3,
            { leading: !0, trailing: !1 }
          );
        return (
          s(() => {
            j(),
              document.addEventListener("visibilitychange", () => {
                j();
              });
          }),
          (e, t) => {
            var a;
            const s = Ha;
            return h.value
              ? (n(),
                l("div", eu, [
                  _("div", tu, [
                    au,
                    _("div", {
                      class: "sx-top-refresh",
                      onClick: t[0] || (t[0] = (...e) => c(H) && c(H)(...e)),
                    }),
                  ]),
                  f.value
                    ? d("", !0)
                    : (n(),
                      l(
                        "div",
                        {
                          key: 0,
                          class: y([
                            "sx-receive",
                            { noStockBg: N.value === L[2] },
                          ]),
                        },
                        [
                          su,
                          _("div", nu, [lu, _("span", null, I(z.value), 1)]),
                          _("div", cu, [
                            iu,
                            _("p", { innerHTML: E.value }, null, 8, ou),
                          ]),
                          _(
                            "div",
                            {
                              class: y(["sx-receive-btn", N.value]),
                              onClick: O,
                            },
                            [
                              N.value === L[0]
                                ? (n(), l("span", uu, "未开始"))
                                : d("", !0),
                            ],
                            2
                          ),
                        ],
                        2
                      )),
                  f.value && (null == (a = S.value) ? void 0 : a.length) > 0
                    ? (n(),
                      l("div", du, [
                        (n(!0),
                        l(
                          w,
                          null,
                          b(S.value, (e, t) => {
                            var a, s, o;
                            return (
                              n(),
                              l("div", { key: t }, [
                                _(
                                  "div",
                                  {
                                    class: y([
                                      "sx-list-item",
                                      [
                                        2 ===
                                        (null == (a = S.value)
                                          ? void 0
                                          : a.length)
                                          ? "item2"
                                          : "item1",
                                      ],
                                    ]),
                                  },
                                  [
                                    "sxzs" === e.leftShow
                                      ? (n(), l("div", ru))
                                      : d("", !0),
                                    _("div", pu, [
                                      vu,
                                      x(),
                                      _(
                                        "span",
                                        null,
                                        I(c(X)(e.shortName)[0]),
                                        1
                                      ),
                                    ]),
                                    _("div", _u, [
                                      _("div", mu, I(e.name), 1),
                                      _(
                                        "div",
                                        {
                                          class: y([
                                            "sx-list-item-right-btn",
                                            "btn" + e.sendStatus,
                                          ]),
                                        },
                                        [
                                          "1" === e.sendStatus
                                            ? (n(),
                                              i(
                                                c(Pt),
                                                {
                                                  key: 0,
                                                  "launch-url": c($)(
                                                    "app",
                                                    (null == (s = c(u))
                                                      ? void 0
                                                      : s.telNo) || "",
                                                    e.cardNo
                                                  ),
                                                  "middle-launch-url": c($)(
                                                    "middleLaunchUrl",
                                                    (null == (o = c(u))
                                                      ? void 0
                                                      : o.telNo) || "",
                                                    e.cardNo
                                                  ),
                                                  "btn-name": "陕西专属模块_"
                                                    .concat(z.value, "元_")
                                                    .concat(
                                                      e.btnName,
                                                      "_去使用"
                                                    ),
                                                },
                                                null,
                                                8,
                                                [
                                                  "launch-url",
                                                  "middle-launch-url",
                                                  "btn-name",
                                                ]
                                              ))
                                            : d("", !0),
                                          e.showTag
                                            ? (n(),
                                              l("div", gu, I(e.sendStatus), 1))
                                            : d("", !0),
                                        ],
                                        2
                                      ),
                                    ]),
                                  ],
                                  2
                                ),
                              ])
                            );
                          }),
                          128
                        )),
                      ]))
                    : d("", !0),
                  hu,
                  C(
                    s,
                    {
                      "pop-show": T.value,
                      "pop-up-type": A.value,
                      "pop-param": D.value,
                      onClosePop: U,
                    },
                    null,
                    8,
                    ["pop-show", "pop-up-type", "pop-param"]
                  ),
                ]))
              : d("", !0);
          }
        );
      },
    },
    [["__scopeId", "data-v-9ad8491e"]]
  ),
  wu = { class: "water" },
  bu = {
    "transition-duration": "0.3s",
    "item-selector": ".item",
    gutter: 10,
    class: "water-list",
  },
  Iu = ["onClick"],
  fu = { class: "item-img" },
  ku = ["src"],
  zu = { class: "item-content" },
  Pu = { class: "item-content-title" },
  Eu = { key: 0, class: "item-content-subtitle" },
  Cu = { class: "item-content-tag" },
  Su = { key: 0 },
  Tu = { key: 1 },
  xu = { key: 1, class: "item-content-price" },
  Du = { key: 1, class: "swiper" },
  Au = ["src", "onClick"],
  Lu = { class: "container" },
  Nu = ["src"],
  Ru = nt(
    {
      __name: "waterFall",
      setup(t) {
        const a = window.__env || V(),
          u = ct(),
          { userInfo: r } = m(u),
          { ButtonClick: p } = M(),
          v = e([]),
          h = e(""),
          y = e(!1),
          f = () => {},
          k = () => {},
          z = () => {
            y.value = !1;
          },
          E = g.throttle(
            async (e, t, s) => {
              let n = "";
              if (
                (t.vLinkUrl.includes("transferDownload") &&
                  "app" !== a &&
                  (n = "APP引流"),
                p({
                  button_name: "瀑布流_"
                    .concat(e + 1, "_")
                    .concat("QWHDCZ01" === s ? "全图" : "图文", "_")
                    .concat(t.vSubject),
                  button_url: t.vLinkUrl,
                  button_type: n,
                  page_touch_id: q("touch_id", t.vLinkUrl),
                  element_four_channel: q("channelId", t.vLinkUrl),
                }),
                t.vLinkUrl.includes(
                  "https://wx.10086.cn/website/businessPlatform/productPage"
                ))
              ) {
                const e = await et("017018");
                "SUCCESS" == e.code || "0" == e.code
                  ? (h.value = t.vLinkUrl + "&leadeonToken=".concat(e.data))
                  : (h.value = t.vLinkUrl),
                  (y.value = !0);
              } else B(t.vLinkUrl);
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          x = async function () {
            const { version: e } = await He(),
              t = window.localStorage.getItem("rechargeFloorData"),
              s = new Date().getTime();
            let n = null;
            if (t && s - JSON.parse(t).time < 3e5)
              n = JSON.parse(JSON.parse(t).contactData);
            else {
              try {
                const t = {
                  sysSource: "sys_app",
                  mobile: r.value.mobile,
                  provinceCode: r.value.provinceCode,
                  floorRuleCode: "00404",
                  version: "app" === a ? e : "-1",
                };
                n = await tt(t);
              } catch (l) {}
              "0" === (null == n ? void 0 : n.code)
                ? window.localStorage.setItem(
                    "rechargeFloorData",
                    JSON.stringify({ time: s, contactData: JSON.stringify(n) })
                  )
                : (n = []);
            }
            !(async function (e) {
              const { version: t } = await He(),
                s = window.localStorage.getItem("rechargeWaterFullData"),
                n = new Date().getTime();
              let c = null;
              if (s && n - JSON.parse(s).time < 3e5)
                c = JSON.parse(JSON.parse(s).contactData);
              else {
                try {
                  c = await at({
                    sysSource: "sys_app",
                    mobile: r.value.mobile,
                    provinceCode: r.value.provinceCode,
                    cityCode: r.value.cityCode,
                    contactorCode: e.data.contactCodeAll.join(","),
                    version: "app" === a ? t : "-1",
                  });
                  const s = e.data.contactCodeAll,
                    n = c.data || {},
                    l = {};
                  (l.filterFloor = n.filterFloor || []),
                    s.forEach((e) => {
                      l[e] = n[e] || [];
                    }),
                    (c.data = l);
                } catch (l) {}
                "0" === (null == c ? void 0 : c.code)
                  ? window.localStorage.setItem(
                      "rechargeWaterFullData",
                      JSON.stringify({
                        time: n,
                        contactData: JSON.stringify(c),
                      })
                    )
                  : (c = []);
              }
              let i = e.data.contactCodeMapping,
                o = c.data;
              const u = [];
              for (let a in o)
                Object.hasOwnProperty.call(o, a) &&
                  i.forEach((e) => {
                    let t = {};
                    e.contactCode === a &&
                      o[a].length > 0 &&
                      ((t.moduleId = e.moduleId),
                      (t.contactData = o[a]),
                      ("QWHDCZ01" !== e.moduleId &&
                        "QWHDCZ02" !== e.moduleId) ||
                        u.push(t));
                  });
              v.value = u;
            })(n);
          };
        return (
          s(() => {
            x();
          }),
          (e, t) => {
            const a = S,
              s = T,
              u = P,
              r = U("masonry-tile"),
              p = U("masonry");
            return (
              n(),
              l("div", wu, [
                L(
                  (n(),
                  l("div", bu, [
                    (n(!0),
                    l(
                      w,
                      null,
                      b(v.value, (e, t) =>
                        L(
                          (n(),
                          l("div", { key: t, class: "item" }, [
                            "QWHDCZ02" === e.moduleId && e.contactData
                              ? (n(),
                                l(
                                  "div",
                                  {
                                    key: 0,
                                    style: { height: "100%" },
                                    onClick: (a) =>
                                      c(E)(
                                        t,
                                        e.contactData[0].elementMap,
                                        e.moduleId
                                      ),
                                  },
                                  [
                                    _("div", fu, [
                                      _(
                                        "img",
                                        {
                                          src: e.contactData[0].elementMap
                                            .vImage,
                                        },
                                        null,
                                        8,
                                        ku
                                      ),
                                    ]),
                                    _("div", zu, [
                                      _(
                                        "div",
                                        Pu,
                                        I(
                                          e.contactData[0].elementMap.vSubject1
                                        ),
                                        1
                                      ),
                                      e.contactData[0].elementMap.vSubject2
                                        ? (n(),
                                          l(
                                            "div",
                                            Eu,
                                            I(
                                              e.contactData[0].elementMap
                                                .vSubject2
                                            ),
                                            1
                                          ))
                                        : d("", !0),
                                      _("div", Cu, [
                                        e.contactData[0].elementMap.vSubject7
                                          ? (n(),
                                            l(
                                              "span",
                                              Su,
                                              I(
                                                e.contactData[0].elementMap
                                                  .vSubject7
                                              ),
                                              1
                                            ))
                                          : d("", !0),
                                        e.contactData[0].elementMap.vSubject8
                                          ? (n(),
                                            l(
                                              "span",
                                              Tu,
                                              I(
                                                e.contactData[0].elementMap
                                                  .vSubject8
                                              ),
                                              1
                                            ))
                                          : d("", !0),
                                      ]),
                                      e.contactData[0].elementMap.amount
                                        ? (n(),
                                          l(
                                            "div",
                                            xu,
                                            I(
                                              e.contactData[0].elementMap.amount
                                            ),
                                            1
                                          ))
                                        : d("", !0),
                                    ]),
                                  ],
                                  8,
                                  Iu
                                ))
                              : d("", !0),
                            "QWHDCZ01" === e.moduleId &&
                            e.contactData.length > 0
                              ? (n(),
                                l("div", Du, [
                                  C(
                                    s,
                                    {
                                      autoplay: 3e3,
                                      "lazy-render": "",
                                      "show-indicators":
                                        e.contactData.length > 1,
                                    },
                                    {
                                      default: o(() => [
                                        (n(!0),
                                        l(
                                          w,
                                          null,
                                          b(
                                            e.contactData,
                                            (s, l) => (
                                              n(),
                                              i(
                                                a,
                                                { key: l },
                                                {
                                                  default: o(() => [
                                                    _(
                                                      "img",
                                                      {
                                                        src: s.elementMap
                                                          .vImage,
                                                        class: "swiper-img",
                                                        onClick: (a) =>
                                                          c(E)(
                                                            t,
                                                            s.elementMap,
                                                            e.moduleId
                                                          ),
                                                      },
                                                      null,
                                                      8,
                                                      Au
                                                    ),
                                                  ]),
                                                  _: 2,
                                                },
                                                1024
                                              )
                                            )
                                          ),
                                          128
                                        )),
                                      ]),
                                      _: 2,
                                    },
                                    1032,
                                    ["show-indicators"]
                                  ),
                                ]))
                              : d("", !0),
                          ])),
                          [[r]]
                        )
                      ),
                      128
                    )),
                  ])),
                  [[p]]
                ),
                C(
                  u,
                  { show: y.value, position: "bottom", class: "zdPop" },
                  {
                    default: o(() => [
                      _("div", { class: "close", onClick: z }),
                      _("div", Lu, [
                        (n(),
                        l(
                          "iframe",
                          { key: h.value, src: h.value, onLoad: f, onError: k },
                          null,
                          40,
                          Nu
                        )),
                      ]),
                    ]),
                    _: 1,
                  },
                  8,
                  ["show"]
                ),
              ])
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-ee4acfd3"]]
  ),
  ju = (e) => (p("data-v-e343ff4b"), (e = e()), v(), e),
  Ou = { class: "wy" },
  Uu = { class: "wy-top" },
  Hu = ju(() => _("div", { class: "wy-top-title" }, "必领好券", -1)),
  Vu = ju(() => _("div", { class: "wy-top-msg" }, "每周三0点开始领取", -1)),
  qu = { class: "wy-list" },
  Bu = { class: "wy-list-item" },
  Mu = { class: "wy-list-item-name" },
  Fu = { class: "wy-list-item-price" },
  Wu = ju(() => _("span", null, "￥", -1)),
  Xu = { class: "wy-list-item-range" },
  Gu = { key: 0, class: "wy-list-item-goUse" },
  Yu = ["onClick"],
  Zu = { class: "wy-benelist" },
  Qu = { class: "wy-benelist-item" },
  Ku = ["src"],
  Ju = { class: "wy-benelist-item-name" },
  $u = { class: "wy-benelist-item-name1" },
  ed = { key: 0, class: "wy-benelist-item-goUse" },
  td = ["onClick"],
  ad = nt(
    {
      __name: "wyModule",
      setup(t) {
        const a = window.__env || V(),
          { ButtonClick: i } = M(),
          o = ct(),
          { activityInfo: u } = m(o),
          r = e(),
          p = { 0: "noStart", 1: "receive", 4: "goUse", 6: "noStock" },
          v = {
            noStart: "未开始",
            receive: "立即领取",
            goUse: "去使用",
            noStock: "已领完",
          },
          f = e([]),
          z = e([]),
          P = e([]),
          E = e(!0),
          S = e(!1),
          T = () => {
            (f.value = u.value.wuyouPrize),
              (z.value = u.value.qyPrize),
              E.value
                ? (f.value.forEach((e, t) => {
                    e.sortNumber2 = t;
                  }),
                  (P.value = [...f.value]))
                : (P.value.sort(
                    (e, t) => (
                      (e.status = u.value["".concat(e.round)]),
                      (t.status = u.value["".concat(t.round)]),
                      e.sortNumber2 - t.sortNumber2
                    )
                  ),
                  (f.value = P.value)),
              (z.value = [...z.value].sort((e, t) => {
                const a = (e) =>
                  4 === e ? 0 : 1 === e ? 1 : 6 === e ? 2 : 0 === e ? 3 : 99;
                return a(e.status) - a(t.status);
              }));
          },
          x = g.throttle(
            (e) => {
              if ("receive" === p[e.status])
                i({
                  button_name: "必领好券模块_"
                    .concat(e.prizeName, "_")
                    .concat(e.name, "_立即领取"),
                }),
                  (r.value = e.round),
                  (S.value = !0);
              else if ("goUse" === p[e.status]) {
                const t = Z.app;
                i({
                  button_name: "必领好券模块_"
                    .concat(e.prizeName, "_")
                    .concat(e.name, "_去使用"),
                  button_url: t,
                  page_touch_id: q("touch_id", t),
                  element_four_channel: q("channelId", t),
                  button_type: "app" != a ? "APP引流" : "",
                }),
                  W(!0)(t);
              }
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          D = g.throttle(
            (e) => {
              if ("receive" === p[e.status])
                i({
                  button_name: "必领好券模块_"
                    .concat(e.prizeName, "_")
                    .concat(e.name, "_立即领取"),
                }),
                  (r.value = e.round),
                  (S.value = !0);
              else if ("goUse" === p[e.status]) {
                const t = Q.app;
                i({
                  button_name: "必领好券模块_"
                    .concat(e.prizeName, "_")
                    .concat(e.name, "_去使用"),
                  button_url: t,
                  page_touch_id: q("touch_id", t),
                  element_four_channel: q("channelId", t),
                  button_type: "app" != a ? "APP引流" : "",
                }),
                  W(!0)(t);
              }
            },
            1e3,
            { leading: !0, trailing: !1 }
          ),
          A = e(!1),
          L = g.throttle(
            () => {
              i({ button_name: "必领好券模块_刷新" }), (A.value = !0);
              try {
                (E.value = !0), o.queryActivityInfo();
              } catch (e) {
                k("刷新失败");
              } finally {
                setTimeout(() => {
                  (A.value = !1), k({ message: "已刷新" });
                }, 500);
              }
            },
            2e3,
            { leading: !0, trailing: !1 }
          ),
          N = () => {
            (S.value = !1), o.queryActivityInfo(), (E.value = !1);
          };
        return (
          s(() => {
            u.value && T();
          }),
          h(
            () => u.value,
            (e) => {
              e && T();
            }
          ),
          (e, t) => (
            n(),
            l("div", Ou, [
              _("div", Uu, [
                Hu,
                Vu,
                _(
                  "div",
                  {
                    class: y(["wy-top-refresh", { rotating: A.value }]),
                    onClick: t[0] || (t[0] = (...e) => c(L) && c(L)(...e)),
                  },
                  null,
                  2
                ),
              ]),
              _("div", qu, [
                (n(!0),
                l(
                  w,
                  null,
                  b(
                    f.value,
                    (e, t) => (
                      n(),
                      l("div", { key: t }, [
                        _("div", Bu, [
                          _("div", Mu, I(e.prizeName), 1),
                          _("div", Fu, [Wu, _("span", null, I(e.prize), 1)]),
                          _("div", Xu, I(e.name), 1),
                          "goUse" === e.status
                            ? (n(), l("div", Gu))
                            : d("", !0),
                          _(
                            "div",
                            {
                              class: y(["wy-list-item-btn", p[e.status]]),
                              onClick: (t) => c(x)(e),
                            },
                            I(v[p[e.status]]),
                            11,
                            Yu
                          ),
                        ]),
                      ])
                    )
                  ),
                  128
                )),
              ]),
              _("div", Zu, [
                (n(!0),
                l(
                  w,
                  null,
                  b(
                    z.value,
                    (e, t) => (
                      n(),
                      l("div", { key: t }, [
                        _("div", Qu, [
                          _(
                            "img",
                            { class: "wy-benelist-item-icon", src: e.img },
                            null,
                            8,
                            Ku
                          ),
                          _("div", Ju, I(e.prizeName), 1),
                          _("div", $u, I(e.name), 1),
                          "goUse" === e.status
                            ? (n(), l("div", ed))
                            : d("", !0),
                          _(
                            "div",
                            {
                              class: y(["wy-benelist-item-btn", p[e.status]]),
                              onClick: (t) => c(D)(e),
                            },
                            I(v[p[e.status]]),
                            11,
                            td
                          ),
                        ]),
                      ])
                    )
                  ),
                  128
                )),
              ]),
              C(
                c(Ha),
                {
                  "pop-show": S.value,
                  "pop-up-type": "wy",
                  "pop-param": r.value,
                  onClosePop: N,
                },
                null,
                8,
                ["pop-show", "pop-param"]
              ),
            ])
          )
        );
      },
    },
    [["__scopeId", "data-v-e343ff4b"]]
  ),
  sd = { class: "home" },
  nd = { class: "home_top" },
  ld = ((e) => (p("data-v-f1ed42dc"), (e = e()), v(), e))(() =>
    _("p", { class: "home_top_icon" }, null, -1)
  ),
  cd = { class: "home_top_phone" },
  id = { key: 1, class: "home_top_unuse" },
  od = nt(
    {
      __name: "HomeView",
      setup(t) {
        const a = window.__env || V(),
          { ButtonClick: u, ButtonExposure: r } = M(),
          p = ct(),
          {
            userInfo: v,
            activityInfo: g,
            ifWeek: h,
            unUseShow: w,
            chPopShow: b,
            ifShowXrl: f,
          } = m(p),
          k = lt(),
          z = e(!1),
          E = e(),
          S = () => {
            u({ button_name: "首页我的礼包_按钮" }), k.openPrizePop(!0);
          },
          T = () => {
            u({ button_name: "规则" }), k.openRulePop(!0);
          },
          A = () => {
            u({
              button_name: "客服入口",
              button_type: "客服",
              button_url: st[a],
            }),
              W()(st[a]);
          },
          L = () => {
            u({ button_name: "攻略_按钮" }), k.openGuidePop(!0);
          },
          N = (e) => {
            (z.value = !0), (E.value = e), p.getPrizeUnuse();
          },
          R = () => {
            z.value = !1;
          },
          j = [
            {
              selector: ".home_top",
              // 元素选择器
              imgField: "headImg",
              // homeImg 中的字段名
              fallbackImg:
                "https://qwhdcdn.cmcc-cs.cn/qwhdhub/mgrupload/fd568b4689464f418b630662f039e39420260227.png",
            },
            {
              selector: ".home_top_guide",
              imgField: "guideImg",
              fallbackImg:
                "https://qwhdcdn.cmcc-cs.cn/qwhdhub/mgrupload/c14f92c7c342414ea564fe98ba49221d20260311.png",
            },
            {
              selector: ".home_top_rule",
              imgField: "ruleImg",
              fallbackImg:
                "https://qwhdcdn.cmcc-cs.cn/qwhdhub/mgrupload/4a52a68d4bc34726910d5d1bf2b6ff6720260311.png",
            },
            {
              selector: ".home_top_prize",
              imgField: "prizeImg",
              fallbackImg:
                "https://qwhdcdn.cmcc-cs.cn/qwhdhub/mgrupload/70be38bfaeba4708a1b34ec199ca8a1d20260311.png",
            },
          ],
          O = () => {
            u({ button_name: "预告通知栏_关闭按钮" });
          };
        return (
          s(async () => {
            var e;
            (e = g.value),
              j.forEach((t) => {
                var a;
                const s = document.querySelector(t.selector),
                  n =
                    (null == (a = e.homeImg) ? void 0 : a[t.imgField]) ||
                    t.fallbackImg;
                s.style.backgroundImage = "url('".concat(n, "')");
              }),
              g.value.isShowNotice && r({ button_name: "预告通知栏" });
            q("giveCodes") && k.openGivePop(!0);
          }),
          (e, t) => {
            var a;
            const s = H,
              u = P;
            return (
              n(),
              l("div", sd, [
                _("div", nd, [
                  ld,
                  _("p", cd, I(c(v).phone), 1),
                  _("p", { class: "home_top_rule", onClick: T }),
                  _("p", { class: "home_top_prize", onClick: S }),
                  _("p", { class: "home_top_serve", onClick: A }),
                  _("p", { class: "home_top_guide", onClick: L }),
                  c(g).isShowNotice
                    ? (n(),
                      i(
                        s,
                        {
                          key: 0,
                          class: "home_top_notice",
                          "left-icon": "volume-o",
                          mode: "closeable",
                          style: D({ marginTop: c(f) ? "-20px" : "0" }),
                          onClose: O,
                        },
                        { default: o(() => [x(I(c(g).noticeText), 1)]), _: 1 },
                        8,
                        ["style"]
                      ))
                    : d("", !0),
                  c(w) ? (n(), l("p", id)) : d("", !0),
                ]),
                C(c(To)),
                C(c($t)),
                ["270", "731"].includes(c(v).provinceCode)
                  ? (n(), i(c(_l), { key: 0 }))
                  : d("", !0),
                C(c(yu)),
                C(c(ts)),
                C(c(Mn)),
                c(h) ? (n(), i(c(_n), { key: 1 })) : d("", !0),
                (null == (a = c(g)) ? void 0 : a.isPictureShow)
                  ? (n(), i(c(eo), { key: 2 }))
                  : d("", !0),
                c(h) ? d("", !0) : (n(), i(c(_n), { key: 3 })),
                C(c(po)),
                C(c(ad)),
                C(c(ra)),
                C(c(Ru)),
                C(c(ma)),
                C(c(kn)),
                c(f)
                  ? (n(), i(c(Yn), { key: 4, class: "home-barrage" }))
                  : d("", !0),
                C(c(Jo)),
                C(c(ko), { onCloseGivePop: N }),
                c(b) ? (n(), i(c(bn), { key: 5, onClosePop: N })) : d("", !0),
                C(c(na)),
                C(
                  u,
                  { show: z.value, class: "leadPop" },
                  {
                    default: o(() => [
                      _(
                        "div",
                        {
                          class: y(["leadPop-img", "img" + E.value]),
                          onClick: R,
                        },
                        null,
                        2
                      ),
                    ]),
                    _: 1,
                  },
                  8,
                  ["show"]
                ),
              ])
            );
          }
        );
      },
    },
    [["__scopeId", "data-v-f1ed42dc"]]
  );
export { od as default };
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = [];
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i]);
}
