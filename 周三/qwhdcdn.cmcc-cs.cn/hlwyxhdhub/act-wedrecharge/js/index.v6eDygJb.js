function e() {
  import.meta.url, import("_").catch(() => 1), (async function* () {})().next();
}
import {
  g as o,
  r as a,
  s as i,
  i as n,
  l as t,
  j as r,
  k as s,
  m as l,
  q as u,
  t as c,
  S as p,
  v as d,
  x as v,
  y as h,
  u as w,
  z as g,
  A as P,
  V as f,
} from "./vendor/static.gather.rQc4DgSB.js";
import { v as m } from "./vendor/vconsole.Sr2s3mPh.js";
import {
  g as S,
  q as y,
  a as b,
  u as z,
  b as C,
  c as D,
  d as _,
  e as T,
  f as k,
  h as L,
  i as x,
  j as E,
  m as I,
} from "./vendor/hooks.DEWJMU6T.js";
import "./vendor/js.plugin.Db-L3WCG.js";
!(function () {
  const e = document.createElement("link").relList;
  if (!(e && e.supports && e.supports("modulepreload"))) {
    for (const e of document.querySelectorAll('link[rel="modulepreload"]'))
      o(e);
    new MutationObserver((e) => {
      for (const a of e)
        if ("childList" === a.type)
          for (const e of a.addedNodes)
            "LINK" === e.tagName && "modulepreload" === e.rel && o(e);
    }).observe(document, { childList: !0, subtree: !0 });
  }
  function o(e) {
    if (e.ep) return;
    e.ep = !0;
    const o = (function (e) {
      const o = {};
      return (
        e.integrity && (o.integrity = e.integrity),
        e.referrerPolicy && (o.referrerPolicy = e.referrerPolicy),
        "use-credentials" === e.crossOrigin
          ? (o.credentials = "include")
          : "anonymous" === e.crossOrigin
          ? (o.credentials = "omit")
          : (o.credentials = "same-origin"),
        o
      );
    })(e);
    fetch(e.href, o);
  }
})();
const R = {
    0: "助力成功无奖励",
    160047: "获得充值奖励不能获得助力奖励",
    160048: "助力奖励无库存",
    160049: "助力奖励发放失败",
    160050: "重复进入活动助力链接",
    160051: "邀请奖励都无库存",
    160052: "助力链接失效",
    160053: "助力达到上限",
    160054: "网络原因",
    160055: "重复助力",
    160030: "网络原因",
    160061: "不满足客群",
  },
  j = {
    160050: "您已为好友助力过了，不可重复助力",
    160051: "助力失败，奖励邀请已发完～",
    160052: "当前助力链接已失效！",
    160053: "邀请任务每日最多可完成2次",
    160030: "网络异常，请稍后重试！",
    160054: "网络异常，请稍后重试！",
    160055: "每人每月仅1次助力机会，不可重复助力",
    160061: "抱歉，因为您本月已经登录过中国\r移动APP，不符合助力条件哦",
  },
  V = {
    fee: "周三充值券",
    share: "邀请好友得好券",
    power: "邀请好友得好券",
    th: "天降神券",
    wuyou: "出行券",
    yw: "惊喜福利 限量派发",
    sdc: "山东专属券",
    xr: "新人专属券",
    ch: "充值回馈券",
    benefit: "权益券",
    flow: "流量券",
    cardfee: "周三充值券",
    puzzle: "拼图充值券",
    qy: "权益券",
  },
  O = [
    "fee",
    "share",
    "power",
    "th",
    "hb",
    "qb",
    "xr",
    "hbzs",
    "hbxr",
    "ch",
    "gq",
    "cy",
    "xe",
    "zz",
    "sxzs",
    "hnxr",
    "seckill",
    "cqzs",
    "hanzs",
  ],
  q = ["fee_sd"],
  A = ["xr_0", "xr_1", "xr_2"],
  { PageView: F } = C(),
  G = o("userInfoStore", () => {
    const e = a(!1),
      o = a(!1),
      r = i({}),
      s = n(r),
      l = a(),
      u = a(),
      c = a(!1),
      p = a(!1),
      d = a(!1),
      v = a(),
      h = a(1),
      w = a({}),
      g = a(!1),
      P = t.throttle(
        async () => {
          var e;
          const { code: o, data: a } = await S();
          "0" === o &&
            a &&
            (p.value =
              (null ==
              (e = a.prizeList.find(
                (e) =>
                  ["UNUSED", "TOSEND", "1"].includes(e.sendStatus) &&
                  O.includes(e.prizeType)
              ))
                ? void 0
                : e.prizeId) || !1);
        },
        1e3,
        { leading: !0, trailing: !1 }
      ),
      f = t.throttle(
        async () => {
          var e, o;
          const { code: a, data: i } = await y();
          "0" === a &&
            i &&
            ((d.value = i.popShow),
            (v.value =
              null != (o = null == (e = i.prizeList) ? void 0 : e[0])
                ? o
                : []));
        },
        1e3,
        { leading: !0, trailing: !1 }
      ),
      m = t.throttle(
        async () => {
          const { code: e, data: o } = await b();
          "0" === e && o && (w.value = o);
        },
        1e3,
        { leading: !0, trailing: !1 }
      );
    return {
      initStatus: e,
      authStatus: o,
      userInfo: s,
      init: async function () {
        var a;
        try {
          const { code: e, data: i } = await z(),
            { dataTrackIniter: n } = C();
          if ("0" === e) {
            (u.value = i.strategy),
              (i.seckillTime = null != (a = i.seckillTime) ? a : [8, 12, 18]),
              Object.assign(r, i),
              (o.value = !0);
            const {
                provinceCode: e,
                cityCode: t,
                mobile: p,
                mobileCode: d,
              } = s,
              v = window.location.href.includes("guidePage"),
              {
                // token: token_id,
                gsmState: h,
                version: w,
                clientID: g,
              } = await D(),
              { token: S } = await _();
            n(
              { provinceCode: e, cityCode: t, sensorMobile: p, gioMobile: d },
              S,
              h,
              w,
              g
            ),
              F({
                page_name: v
                  ? "活动攻略页"
                  : "周三充值日-首页已登录_".concat(T[s.group] || "兜底用户"),
              });
            const y = k("giveCodes"),
              b = k("shareCodes"),
              z = k("inviteCodes");
            y || b || z || f(), (l.value = i.currentTime);
            const C = new Date(i.currentTime);
            (c.value = 3 === C.getDay()), await m(), P();
          } else (u.value = i.strategy), n();
        } catch (i) {}
        e.value = !0;
      },
      currentTime: l,
      strategy: u,
      ifWeek: c,
      getPrizeUnuse: P,
      unUseShow: p,
      chPopShow: d,
      chInfo: v,
      ifMid: h,
      activityInfo: w,
      queryActivityInfo: m,
      ifShowXrl: g,
    };
  }),
  N = o("popupStore", () => {
    const e = a(!1),
      o = a(!1),
      i = a(!1),
      n = a(),
      t = a(!1),
      r = a(!1),
      s = a(!1),
      l = a(!1),
      u = a(!1),
      c = a(!1),
      p = a(),
      d = a(!1),
      v = a(!1),
      h = a(!1),
      w = a(!1),
      g = a(!1),
      P = a(!1),
      f = a(!1),
      m = a(),
      S = a(),
      y = a(!1),
      b = a(),
      z = a(),
      C = a(!1),
      D = a(!0),
      _ = a(!1),
      T = a(1),
      k = a(!1),
      L = a(0),
      x = a(!1),
      E = a(!1),
      I = a(!1),
      R = a(0),
      j = a(!1),
      V = a([]),
      O = a(!1),
      q = a([]),
      A = a(),
      F = a(!1),
      G = a(),
      N = a(!1),
      U = a(!1),
      M = a(),
      W = a(!1),
      B = a(!1),
      H = a(!1),
      J = a(!1),
      K = a(!1),
      X = a(),
      Q = a(!1),
      Y = a(),
      Z = a(!1),
      $ = a(!1),
      ee = a(""),
      oe = a(!1),
      ae = a(!1),
      ie = a(0),
      ne = a(0),
      te = a(!1),
      re = a(""),
      se = a(!1),
      le = a(0),
      ue = a(!0),
      ce = a(""),
      pe = a(!1),
      de = a({}),
      ve = a(!0),
      he = a("");
    return {
      ruleShow: e,
      ruleType: o,
      openRulePop: (a, i = !1) => {
        (e.value = a), (o.value = i);
      },
      prizeShow: i,
      prizeType: n,
      openPrizePop: (e, o = "th") => {
        (i.value = e), (n.value = o);
      },
      assistShow: c,
      assistData: p,
      openAssitPop: (e, o) => {
        (c.value = e), (p.value = o);
      },
      subscribeShow: s,
      openSubscribePop: (e) => {
        s.value = e;
      },
      permissionShow: u,
      openPermissionPop: (e) => {
        u.value = e;
      },
      receiveConfirmShow: d,
      openConfirmPop: (e) => {
        d.value = e;
      },
      receiveShow: v,
      openReceivePop: (e) => {
        v.value = e;
      },
      inviteDetailShow: h,
      openInviteDetailPop: (e) => {
        h.value = e;
      },
      posterVisible: f,
      inviteCode: m,
      ifDownLoad: S,
      posterPop: (e, o, a = !1) => {
        (f.value = e), (m.value = o), (S.value = a);
      },
      posterDownLoadPop: (e, o, a) => {
        (y.value = e), (b.value = o), (z.value = a);
      },
      downLoadVisible: y,
      giveCode: b,
      givePrizeObj: z,
      guideVisible: C,
      guideType: D,
      openGuidePop: (e, o = !0) => {
        (C.value = e), (D.value = o);
      },
      skPopShow: t,
      openSkPop: (e) => {
        t.value = e;
      },
      secPrizeShow: r,
      openSecPrizePop: (e) => {
        r.value = e;
      },
      jkReceiveShow: _,
      openJkReceivePop: (e) => {
        _.value = e;
      },
      highRiskVisible: k,
      highRiskType: T,
      openHighRiskPop: (e, o = 1) => {
        (k.value = e), (T.value = o);
      },
      wyReceiveShow: E,
      openWyReceivePop: (e) => {
        E.value = e;
      },
      cardReceiveShow: I,
      receiveIndex: R,
      openCardReceivePop: (e, o) => {
        (I.value = e), (R.value = o);
      },
      autoPopShow: j,
      openAutoPop: (e, o) => {
        (V.value = o), (j.value = e);
      },
      autoPopList: V,
      sePopShow: O,
      seData: q,
      seType: A,
      openSePop: (e, o, a = 1) => {
        (O.value = e), (q.value = o), (A.value = a);
      },
      openHbAutoPop: (e) => {
        F.value = e;
      },
      hbAutoShow: F,
      openHbPosterPop: (e, o) => {
        (N.value = e), (G.value = o);
      },
      hbPosterShow: N,
      hbyPrizeObj: G,
      givePopShow: U,
      giveData: M,
      openGivePop: (e, o) => {
        (U.value = e), (M.value = o);
      },
      bargainShow: W,
      openBargainPop: (e) => {
        W.value = e;
      },
      bargainConfirmShow: B,
      openBargainConfirmPop: (e) => {
        B.value = e;
      },
      bargainRecordShow: H,
      openBargainRecordPop: (e) => {
        H.value = e;
      },
      selectPrizeShow: J,
      openSelectPrizePop: (e) => {
        J.value = e;
      },
      inviteShow: K,
      inviteData: X,
      openInvitePop: (e, o) => {
        (K.value = e), (X.value = o);
      },
      commonPosterVisible: Q,
      conmmonInviteCode: Y,
      commoPosterPop: (e, o) => {
        (Q.value = e), (Y.value = o);
      },
      conWxSubPopShow: l,
      openConWxSubPop: (e) => {
        l.value = e;
      },
      failedCardDialogShow: $,
      failedCardDialogType: ee,
      openFailedCardDialog: (e, o) => {
        ($.value = e), o >= 0 && (ee.value = o);
      },
      inviteListDialogShow: Z,
      openInviteListDialog: (e) => {
        Z.value = e;
      },
      myCardDialogShow: oe,
      openMyCardDialog: (e) => {
        oe.value = e;
      },
      giveCardSuccessDialogShow: ae,
      giveCardSuccessDialogType: ne,
      giveCardSuccessDialogCardId: ie,
      openGiveCardSuccessDialog: (e, o, a) => {
        (ae.value = e), (ne.value = o), (ie.value = a);
      },
      inviteFriendsShow: te,
      inviteFriendsToken: re,
      openInviteFriendsDialog: (e, o) => {
        (te.value = e), (re.value = o);
      },
      givenCardShareDialogShow: se,
      givenCardType: le,
      cardIsGive: ue,
      giveCardToken: ce,
      openGivenCardShareDialog: (e, o, a, i) => {
        (se.value = e), (le.value = o), (ue.value = a), (ce.value = i);
      },
      puzzleDetailShow: w,
      openPuzzleDetailPop: (e) => {
        w.value = e;
      },
      sendPuzzleShow: g,
      openSendPuzzlePop: (e) => {
        g.value = e;
      },
      taskListShow: P,
      openTaskListPop: (e) => {
        P.value = e;
      },
      picFailedVisible: x,
      picFailedType: L,
      openPicFailedPop: (e, o = 0) => {
        (x.value = e), (L.value = o);
      },
      sendPuzzlePosterVisible: pe,
      openSendPuzzlePosterPop: (e, o, a, i) => {
        (pe.value = e), (de.value = o), (ve.value = a), (he.value = i);
      },
      givenCard: de,
      cardIsGiven: ve,
      cardToken: he,
    };
  });
o("mainStore", () => ({}));
const U = (e, o) => {
  const a = e.__vccOpts || e;
  for (const [i, n] of o) a[i] = n;
  return a;
};
const M = U({}, [
    [
      "render",
      function (e, o) {
        const a = r("RouterView");
        return s(), l(p, null, { default: u(() => [c(a)]), _: 1 });
      },
    ],
  ]),
  W = {},
  B = function (e, o, a) {
    let i = Promise.resolve();
    if (o && o.length > 0) {
      const e = document.getElementsByTagName("link");
      i = Promise.all(
        o.map((o) => {
          if (
            (o = (function (e) {
              return (
                "https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge/" + e
              );
            })(o)) in W
          )
            return;
          W[o] = !0;
          const i = o.endsWith(".css"),
            n = i ? '[rel="stylesheet"]' : "";
          if (!!a)
            for (let a = e.length - 1; a >= 0; a--) {
              const n = e[a];
              if (n.href === o && (!i || "stylesheet" === n.rel)) return;
            }
          else if (
            document.querySelector('link[href="'.concat(o, '"]').concat(n))
          )
            return;
          const t = document.createElement("link");
          return (
            (t.rel = i ? "stylesheet" : "modulepreload"),
            i || ((t.as = "script"), (t.crossOrigin = "")),
            (t.href = o),
            document.head.appendChild(t),
            i
              ? new Promise((e, a) => {
                  t.addEventListener("load", e),
                    t.addEventListener("error", () =>
                      a(new Error("Unable to preload CSS for ".concat(o)))
                    );
                })
              : void 0
          );
        })
      );
    }
    return i
      .then(() => e())
      .catch((e) => {
        const o = new Event("vite:preloadError", { cancelable: !0 });
        if (((o.payload = e), window.dispatchEvent(o), !o.defaultPrevented))
          throw e;
      });
  };
function H(e, o) {
  if (e) return void o();
  const a = window.__env || L();
  if ("app" == a || "wechat" == a) {
    const e = new URL(window.location.href);
    "wechat" == a && e.searchParams.set("prelogin", !0);
    const o = e.search;
    window.location.href = "".concat(x).concat(o);
  } else o({ name: "signup" });
}
const J = v({
  history: h("https://qwhdcdn.cmcc-cs.cn/hlwyxhdhub/act-wedrecharge"),
  routes: [
    { path: "/", redirect: "/home" },
    {
      path: "/home",
      name: "home",
      component: () =>
        B(
          () => import("./index.Bzze7T-t.js"),
          __vite__mapDeps([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
        ),
    },
    {
      path: "/signup",
      name: "signup",
      component: () =>
        B(
          () => import("./index.DewudZuB.js"),
          __vite__mapDeps([10, 5, 1, 2, 3, 4, 8, 11])
        ),
    },
    {
      path: "/guidePage",
      name: "guidePage",
      component: () =>
        B(
          () => import("./index.B6vZmOUd.js"),
          __vite__mapDeps([12, 1, 2, 3, 4, 5, 8, 13])
        ),
    },
  ],
});
J.beforeEach((e, o, a) => {
  "signup" == e.name || "guidePage" == e.name
    ? a()
    : (function (e) {
        const o = G();
        o.initStatus
          ? H(o.authStatus, e)
          : d(() => {
              o.initStatus && H(o.authStatus, e);
            });
      })(a);
}),
  J.afterEach((e, o) => {
    E("router");
  });
const { showConsole: K } = w("hash");
K && new m(), I();
const { dataTrackRegister: X } = C();
X(), E("main");
const Q = g(M),
  Y = P();
Q.use(Y);
const { init: Z } = G();
Z(),
  Q.use(J),
  Q.mount("#app"),
  Q.use(f),
  "undefined" != typeof window &&
    (window.addEventListener("unhandledrejection", (e) => {
      e.preventDefault();
    }),
    window.addEventListener("error", (e) => {
      e.preventDefault();
    }));
export {
  j as T,
  U as _,
  e as __vite_legacy_guard,
  B as a,
  q as c,
  O as f,
  R as i,
  N as p,
  V as t,
  G as u,
  A as x,
};
function __vite__mapDeps(indexes) {
  if (!__vite__mapDeps.viteFileDeps) {
    __vite__mapDeps.viteFileDeps = [
      "js/index.Bzze7T-t.js",
      "js/vendor/static.gather.rQc4DgSB.js",
      "js/vendor/js.plugin.Db-L3WCG.js",
      "css/vendor/js.CuXjb9qQ.css",
      "css/vendor/static.Bsq_7w5T.css",
      "js/vendor/hooks.DEWJMU6T.js",
      "js/vendor/lottie-web.C_QYx6Z4.js",
      "js/vendor/json.BeDsP0r3.js",
      "js/vendor/vconsole.Sr2s3mPh.js",
      "css/index.DZxOMe3z.css",
      "js/index.DewudZuB.js",
      "css/index.BvtbZV2H.css",
      "js/index.B6vZmOUd.js",
      "css/index.BJyqaBOS.css",
    ];
  }
  return indexes.map((i) => __vite__mapDeps.viteFileDeps[i]);
}
