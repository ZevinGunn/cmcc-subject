"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["1019"],
  {
    53487(e, t, n) {
      var a = n(41486),
        r = n(54670),
        s = n(64176);
      t.A = function (e, t, n) {
        void 0 === n && (n = {});
        var i = (0, r.A)(e),
          o = (0, a.useRef)(null),
          c = (0, a.useCallback)(function () {
            o.current && clearInterval(o.current);
          }, []);
        return (
          (0, a.useEffect)(
            function () {
              if ((0, s.Et)(t) && !(t < 0))
                return n.immediate && i(), (o.current = setInterval(i, t)), c;
            },
            [t, n.immediate]
          ),
          c
        );
      };
    },
    9034(e, t, n) {
      n.d(t, { t: () => m });
      var a = n(13454),
        r = n(41486),
        s = n(12457),
        i = n(5482),
        o = {},
        c = function (e, t) {
          var n = (0, i.__read)((0, r.useState)(e ? "loading" : "unset"), 2),
            a = n[0],
            s = n[1],
            c = (0, r.useRef)();
          return (
            (0, r.useEffect)(
              function () {
                if (e) {
                  var n = e.replace(/[|#].*$/, "");
                  if (
                    "css" === (null == t ? void 0 : t.type) ||
                    (!(null == t ? void 0 : t.type) && /(^css!|\.css$)/.test(n))
                  ) {
                    var a = (function (e, t) {
                      void 0 === t && (t = {});
                      var n = document.querySelector(
                        'link[href="'.concat(e, '"]')
                      );
                      if (!n) {
                        var a = document.createElement("link");
                        return (
                          (a.rel = "stylesheet"),
                          (a.href = e),
                          Object.keys(t).forEach(function (e) {
                            a[e] = t[e];
                          }),
                          "hideFocus" in a &&
                            a.relList &&
                            ((a.rel = "preload"), (a.as = "style")),
                          a.setAttribute("data-status", "loading"),
                          document.head.appendChild(a),
                          { ref: a, status: "loading" }
                        );
                      }
                      return {
                        ref: n,
                        status: n.getAttribute("data-status") || "ready",
                      };
                    })(e, null == t ? void 0 : t.css);
                    (c.current = a.ref), s(a.status);
                  } else if (
                    "js" === (null == t ? void 0 : t.type) ||
                    (!(null == t ? void 0 : t.type) && /(^js!|\.js$)/.test(n))
                  ) {
                    a = (function (e, t) {
                      void 0 === t && (t = {});
                      var n = document.querySelector(
                        'script[src="'.concat(e, '"]')
                      );
                      if (!n) {
                        var a = document.createElement("script");
                        return (
                          (a.src = e),
                          Object.keys(t).forEach(function (e) {
                            a[e] = t[e];
                          }),
                          a.setAttribute("data-status", "loading"),
                          document.body.appendChild(a),
                          { ref: a, status: "loading" }
                        );
                      }
                      return {
                        ref: n,
                        status: n.getAttribute("data-status") || "ready",
                      };
                    })(e, null == t ? void 0 : t.js);
                    (c.current = a.ref), s(a.status);
                  }
                  if (c.current) {
                    void 0 === o[e] ? (o[e] = 1) : (o[e] += 1);
                    var r = function (e) {
                      var t,
                        n = "load" === e.type ? "ready" : "error";
                      null === (t = c.current) ||
                        void 0 === t ||
                        t.setAttribute("data-status", n),
                        s(n);
                    };
                    return (
                      c.current.addEventListener("load", r),
                      c.current.addEventListener("error", r),
                      function () {
                        var n, a, s;
                        null === (n = c.current) ||
                          void 0 === n ||
                          n.removeEventListener("load", r),
                          null === (a = c.current) ||
                            void 0 === a ||
                            a.removeEventListener("error", r),
                          (o[e] -= 1),
                          0 !== o[e] ||
                            (null == t ? void 0 : t.keepWhenUnused) ||
                            null === (s = c.current) ||
                            void 0 === s ||
                            s.remove(),
                          (c.current = void 0);
                      }
                    );
                  }
                } else s("unset");
              },
              [e]
            ),
            a
          );
        },
        l = n(8356),
        u = n(64308),
        d = "https://www.cmpassport.com/NumberAbility/jssdk/jssdk.min.js";
      function m() {
        var e = c(d, { js: { async: !0 } }),
          [t, n] = (0, r.useState)(!0),
          [i, o] = (0, r.useState)(!1),
          m = (0, r.useCallback)(
            () =>
              (0, a._)(function* () {
                try {
                  var e = "300012053428",
                    t = window.YDRZ.getSign(e, "1.2"),
                    { data: a } = yield (0, s.v0)({ sign: t }),
                    r = yield ((d = {
                      version: "1.2",
                      appId: e,
                      sign: a.sign,
                      openType: "1",
                      expandParams: "",
                      isTest: "1",
                    }),
                    new Promise((e, t) => {
                      window.YDRZ.getTokenInfo({
                        data: d,
                        success(t) {
                          e(t);
                        },
                        error(e) {
                          t(e);
                        },
                      });
                    }));
                  if ("000000" !== r.code) return n(!1), void o(!1);
                  var i = (0, l.si)(),
                    c = (yield (0, s.mo)({
                      token: r.token,
                      userInformation: r.userInformation,
                      retailerCode: i.main,
                      sonRetailerCode: i.sub,
                      type: 5,
                    })).data;
                  c && "string" == typeof c.phoneNo
                    ? ((0, u.$K)(c), n(!1), o(!0))
                    : (n(!1), o(!1));
                } catch (e) {
                  n(!1), o(!1);
                }
                var d;
              })(),
            []
          );
        return (
          (0, r.useEffect)(() => {
            "ready" === e && m(), "error" === e && (n(!1), o(!1));
          }, [m, e]),
          { autoLoginLoading: t, autoLoginSuccess: i }
        );
      }
    },
    49269(e, t, n) {
      n.r(t), n.d(t, { default: () => R });
      var a = n(13454),
        r = n(86070),
        s = n(41486),
        i = "Page___XBWrc",
        o = "Brand___MmsZq",
        c = "BrandLogo___XHe_8",
        l = "BrandText___m0s77",
        u = "VerificationCodeLogin___kK4Nz",
        d = "Form___GrjK8",
        m = "FormItem___EyYUa",
        f = "FormItemIcon___gBcFZ",
        p = "FormItemInput___n0c7E",
        v = "CodeButton___m1CZJ",
        h = "SubmitButton___rQo4_",
        _ = "AutoLogin___d0ST9",
        g = "PhoneNo___K602o",
        j = "AutoLoginButton___EHRLQ",
        x = "ChangeTypeButton___OdZlq",
        y = "Agreements___jKAAm",
        N = "Checkbox___rnfdv",
        C = "AgreementItem___N0D1f",
        b = "Tips___tCuxI",
        L = "TipsHighlight___uYlN_",
        k = "AutoLoginError___pr2er",
        A = n(12457),
        I = n(53487),
        P = n(73508),
        S = n(9034),
        E = n(80085),
        w = n(8356),
        T = n(64308),
        Z = n(35574),
        O = n(59344);
      function B(e) {
        window.location.href = {
          contract: "https://wap.cmpassport.com/resources/html/contract.html",
          qyContract:
            "https://wap.cmpassport.com/resources/html/qyContract.html",
          preciseTouchAgreement:
            "https://wap.cmpassport.com/resources/html/preciseTouchAgreement.html",
        }[e];
      }
      function D() {
        return (0, r.jsxs)("div", {
          className: o,
          children: [
            (0, r.jsx)("img", {
              className: c,
              src: "".concat(
                gImgUrlPrefixLegacy,
                "/rights/202303/b5cf91b6-628b-4fd7-9ac9-b40700fba744-YD@2x.png"
              ),
              alt: "",
            }),
            (0, r.jsx)("div", { className: l, children: "欢迎登录 权益超市" }),
          ],
        });
      }
      function F() {
        var {
            loginType: e = "",
            toPath: t = "",
            appendParam: n = "",
          } = (0, E.dj)(),
          i = "HiGouLogin" === e ? "绑定手机号" : "登录",
          [o, c] = (0, s.useState)(""),
          [l, _] = (0, s.useState)(""),
          [g, j] = (0, s.useState)("获取验证码"),
          [x, y] = (0, s.useState)(),
          [N, C] = (0, s.useState)(60);
        (0, I.A)(() => {
          var e = 0,
            t = "获取验证码";
          N > 1
            ? (t = "".concat((e = N - 1), "秒后重试"))
            : ((e = 60), y(void 0)),
            C(e),
            j(t);
        }, x);
        var { run: b } = (0, P.A)(A.PF, {
            manual: !0,
            onSuccess: (e) =>
              (0, a._)(function* () {
                if ("0" === e.resultCode)
                  return (
                    (0, T.$K)(e.data),
                    void (0, T.Jv)({ toPath: t, appendParam: n })
                  );
                e.resultMsg.includes("不正确")
                  ? O.Z.info("手机号或验证码不正确")
                  : e.resultMsg.includes("已失效")
                  ? O.Z.info("验证码已失效,请重新获取")
                  : O.Z.info("系统繁忙，请稍后再试");
              })(),
          }),
          { run: L } = (0, P.A)(A.UV, {
            manual: !0,
            onSuccess: (e) =>
              (0, a._)(function* () {
                "0" === e.resultCode &&
                  ((0, T.$K)(e.data), (0, T.Jv)({ toPath: t, appendParam: n }));
              })(),
          });
        return (0, r.jsxs)("div", {
          className: u,
          children: [
            (0, r.jsxs)("div", {
              className: d,
              children: [
                (0, r.jsxs)("div", {
                  className: m,
                  children: [
                    (0, r.jsx)("img", {
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202303/217d8ad4-71cc-45f9-bd12-60ded8a8d465-liuliang@2x.png"
                      ),
                      className: f,
                      alt: "",
                    }),
                    (0, r.jsx)("input", {
                      className: p,
                      placeholder: "请输入手机号",
                      type: "phone",
                      value: o,
                      onChange: (e) => {
                        c(e.target.value.replace(/\D/g, ""));
                      },
                      maxLength: 11,
                    }),
                  ],
                }),
                (0, r.jsxs)("div", {
                  className: m,
                  children: [
                    (0, r.jsx)("img", {
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202303/abccfab6-ab3a-4c93-aa4a-3ffe6ddc172e-mimayanzhengma@2x.png"
                      ),
                      className: f,
                      alt: "",
                    }),
                    (0, r.jsx)("input", {
                      className: p,
                      placeholder: "请输入验证码",
                      type: "text",
                      inputMode: "numeric",
                      autoComplete: "one-time-code",
                      maxLength: 6,
                      value: l,
                      onChange: (e) => {
                        var t = e.target.value.replace(/\D/g, "");
                        t.length > 6 && (t = t.slice(0, 6)), _(t);
                      },
                    }),
                    (0, r.jsx)("span", {
                      className: v,
                      onClick: () =>
                        (0, a._)(function* () {
                          if (60 === N)
                            if (11 === o.length) {
                              if (
                                "短信发送成功" ===
                                (yield (0, A.Hg)({ receviNo: o })).data
                              )
                                return y(1e3), void O.Z.info("验证码获取成功");
                              O.Z.info("验证码获取太频繁，请过一段时间再试");
                            } else O.Z.info("请您输入正确的手机格式");
                        })(),
                      children: g,
                    }),
                  ],
                }),
              ],
            }),
            (0, r.jsx)("div", {
              className: h,
              onClick: () => {
                var e = (0, w.si)();
                11 === o.length
                  ? 6 === l.length
                    ? "登录" !== i
                      ? L({
                          receviNo: o,
                          verificationCode: l,
                          openId: (0, w.ND)() || "",
                          retailerCode: e.main,
                          sonRetailerCode: e.sub,
                        })
                      : b({
                          receviNo: o,
                          verificationCode: l,
                          retailerCode: e.main,
                          sonRetailerCode: e.sub,
                        })
                    : O.Z.info("验证码格式不正确")
                  : O.Z.info("请您输入正确的手机格式");
              },
              children: i,
            }),
          ],
        });
      }
      function G(e) {
        var { onLoginTypeChange: t } = e,
          { toPath: n = "", appendParam: i = "" } = (0, E.dj)(),
          [o, c] = (0, s.useState)(!1),
          l = (0, Z.nc)((e) => e.userInfo),
          { autoLoginLoading: u, autoLoginSuccess: d } = (0, S.t)(),
          m = u
            ? "号码获取中"
            : d
            ? (null == l ? void 0 : l.desensitizedPhoneNumber) || ""
            : "号码获取失败",
          f = u ? "号码获取中" : d ? "使用该号码登录" : "重试";
        return (0, r.jsxs)("div", {
          className: _,
          children: [
            (0, r.jsx)("div", { className: g, children: m }),
            (0, r.jsxs)("div", {
              className: b,
              children: [
                "温馨提示：双卡机的手机客户，请留意上方号码是否为",
                (0, r.jsx)("span", { className: L, children: "需要办理业务" }),
                "的号码",
              ],
            }),
            (0, r.jsx)("div", {
              className: j,
              onClick: () =>
                (0, a._)(function* () {
                  o
                    ? u ||
                      (d
                        ? (0, T.Jv)({ toPath: n, appendParam: i })
                        : window.location.reload())
                    : O.Z.info("请先阅读相关协议并勾选同意按钮");
                })(),
              children: f,
            }),
            (0, r.jsx)("div", {
              className: x,
              onClick: () => {
                o
                  ? ((0, w.FF)(), t("CODE_LOGIN"))
                  : O.Z.info("请先阅读相关协议并勾选同意按钮");
              },
              children: "用其他号码登录",
            }),
            (0, r.jsxs)("div", {
              className: y,
              children: [
                (0, r.jsx)("input", {
                  className: N,
                  type: "checkbox",
                  onClick: () => {
                    c(!o);
                  },
                }),
                (0, r.jsx)("span", { children: "我已阅读并同意" }),
                (0, r.jsx)("span", {
                  className: C,
                  onClick: () => B("contract"),
                  children: "《中国移动认证服务协议》、",
                }),
                (0, r.jsx)("span", {
                  className: C,
                  onClick: () => B("qyContract"),
                  children: "《移动认证数据回传工具隐私政策》、",
                }),
                (0, r.jsx)("span", {
                  className: C,
                  onClick: () => B("preciseTouchAgreement"),
                  children: "《移动认证精准触达工具服务协议》",
                }),
              ],
            }),
            u || d
              ? null
              : (0, r.jsx)("div", {
                  className: k,
                  children:
                    "获取号码失败，仅限4G移动网络可使用，可通过刷新页面再次尝试",
                }),
          ],
        });
      }
      function R() {
        var { loginType: e = "" } = (0, E.dj)(),
          [t, n] = (0, s.useState)(
            "HiGouLogin" === e ? "CODE_LOGIN" : "AUTO_LOGIN"
          );
        return (0, r.jsxs)("div", {
          className: i,
          children: [
            (0, r.jsx)(D, {}),
            "AUTO_LOGIN" === t
              ? (0, r.jsx)(G, { onLoginTypeChange: n })
              : (0, r.jsx)(F, {}),
          ],
        });
      }
    },
  },
]);
