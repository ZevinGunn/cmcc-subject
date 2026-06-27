"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["1678"],
  {
    98165(t, e, n) {
      n.d(e, { f: () => f });
      var o = n(20837),
        a = n(43952),
        r = n(86070),
        i = (n(79495), n(75834)),
        c =
          (n(41486),
          {
            modal: "modal___sTGwL",
            close: "close___Twvc_",
            head: "head___GsVwY",
            body: "body___j37d1",
            foot: "foot___ifJBQ",
            okButton: "okButton___TIf2l",
            disabled: "disabled___oMrIZ",
          }),
        l = n(13526),
        s = "".concat(
          gImgUrlPrefixLegacy,
          "/rights/202303/9b46080e-9f19-47ed-9839-6a546817c2b1-icon-close.png"
        ),
        d = 998,
        u = 999;
      function f(t) {
        var e,
          {
            rounded: n = !0,
            roundedValue: f = ".2rem",
            visible: _ = !1,
            titleText: v,
            okButton: h,
            okButtonText: w = "确定",
            okButtonStyle: m = {},
            hasCloseButton: g = !0,
            hasOkButton: I = !0,
            disableOkButton: y = !1,
            maskClosable: p = !1,
            hasFoot: C = !0,
            hasHead: A = !0,
            rootClassName: b,
            modalClassName: T,
            maskStyle: k = {},
            contentStyle: x = {},
            footStyle: E = {},
            bodyStyle: R = {},
            headStyle: O = {},
            onClose: L = () => {},
            onAfterClose: N = () => {},
            onOk: P = () => {},
            onMaskClick: j = () => {},
          } = t,
          B =
            ((e = n ? { borderTopLeftRadius: f, borderTopRightRadius: f } : {}),
            (0, a._)((0, o._)({}, x, e), { zIndex: u })),
          D = (0, r.jsx)("div", {
            className: (0, l.$)(c.okButton, y && c.disabled),
            style: m,
            onClick: () => {
              y || P();
            },
            children: w,
          }),
          S =
            C && I
              ? (0, r.jsx)("div", {
                  className: c.foot,
                  style: E,
                  children: h || D,
                })
              : null,
          M =
            A && v
              ? (0, r.jsx)("div", {
                  className: c.head,
                  style: O,
                  children: (0, r.jsx)("div", {
                    className: c.title,
                    children: v,
                  }),
                })
              : null;
        return (0, r.jsx)(i.Ay, {
          visible: _,
          close: L,
          onClose: N,
          gestureOutOfControl: !0,
          contentStyle: B,
          onMaskClick: j,
          maskClosable: p,
          contentClass: b,
          maskStyle: (0, o._)({ zIndex: d }, k),
          children: (0, r.jsxs)("div", {
            className: (0, l.$)(c.modal, T),
            children: [
              M,
              (0, r.jsx)("div", {
                className: c.body,
                style: R,
                children: t.children,
              }),
              S,
              g
                ? (0, r.jsx)("div", {
                    className: c.close,
                    onClick: L,
                    children: (0, r.jsx)("img", { src: s, alt: "" }),
                  })
                : null,
            ],
          }),
        });
      }
    },
    25755(t, e, n) {
      n.d(e, { K: () => c, Q: () => s });
      var o = n(20837),
        a = n(43952),
        r = n(50654),
        i = n(86070);
      n(41486);
      function c(t) {
        var { color: e = "#FF6300" } = t,
          n = (0, r._)(t, ["color"]);
        return (0, i.jsxs)(
          "svg",
          (0, a._)(
            (0, o._)(
              { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none" },
              n
            ),
            {
              children: [
                (0, i.jsx)("path", {
                  d: "M18.5 10C18.5 14.6944 14.6944 18.5 10 18.5C5.30558 18.5 1.5 14.6944 1.5 10C1.5 5.30558 5.30558 1.5 10 1.5C14.6944 1.5 18.5 5.30558 18.5 10Z",
                  stroke: e,
                }),
                (0, i.jsx)("path", {
                  fillRule: "evenodd",
                  clipRule: "evenodd",
                  d: "M10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z",
                  fill: e,
                }),
              ],
            }
          )
        );
      }
      var l = n(71976);
      function s(t) {
        var { color: e = "#FF6300" } = t,
          n = (0, r._)(t, ["color"]);
        return (0, i.jsx)(l.A, (0, o._)({ color: e }, n));
      }
    },
    7960(t, e, n) {
      n.d(e, { _: () => u });
      var o = n(20837),
        a = n(50654),
        r = n(86070),
        i = (n(79065), n(28535), n(49703)),
        c = n(13438),
        l = n(41486),
        s = n.n(l),
        d = n(99496);
      function u(t) {
        var {
            lazy: e = !0,
            hasBottomOverlap: n = !1,
            offset: l = 0,
            src: u,
          } = t,
          f = (0, a._)(t, ["lazy", "hasBottomOverlap", "offset", "src"]),
          _ = (0, d.$)(u),
          [v, h] = s().useState(!1);
        return e
          ? (0, r.jsx)(i.A, {
              style: { fontSize: 0 },
              onVisibleChange: (t) => h(t),
              offset: l,
              once: !0,
              children: (0, r.jsx)(
                c.A,
                (0, o._)(
                  {
                    src: _,
                    showImage: v,
                    bottomOverlap: n ? void 0 : null,
                    animateDuration: 150,
                  },
                  f
                )
              ),
            })
          : (0, r.jsx)(
              c.A,
              (0, o._)({ bottomOverlap: null, animateDuration: 150, src: _ }, f)
            );
      }
    },
    58349(t, e, n) {
      n.d(e, { s: () => v });
      var o = n(20837),
        a = n(43952),
        r = n(50654),
        i = n(86070),
        c = (n(75837), n(19784)),
        l = n(41486),
        s = n.n(l),
        d = "WithImagePreview____6O8T",
        u = n(20696),
        f = n(13526);
      function _(t) {
        if ("undefined" == typeof window || "undefined" == typeof DOMParser)
          return [];
        var e = new DOMParser().parseFromString(t, "text/html");
        return Array.from(e.querySelectorAll("img"))
          .map((t) =>
            (function (t) {
              if (!t || "undefined" == typeof window) return null != t ? t : "";
              try {
                return new URL(t, window.location.href).href;
              } catch (e) {
                return t;
              }
            })(t.getAttribute("src"))
          )
          .filter(Boolean);
      }
      var v = s().forwardRef((t, e) => {
        var { text: n, enableImagePreview: l, className: v, onClick: h } = t,
          w = (0, r._)(t, [
            "text",
            "enableImagePreview",
            "className",
            "onClick",
          ]),
          {
            assignRef: m,
            handleContainerClick: g,
            closePreview: I,
            previewOpenIndex: y,
            previewImages: p,
          } = (function (t, e, n, o) {
            var a = s().useRef(null),
              [r, i] = s().useState(-1),
              c = s().useMemo(
                () => (e && "string" == typeof t ? _(t) : []),
                [e, t]
              );
            return (
              s().useLayoutEffect(() => {
                e &&
                  a.current &&
                  a.current.querySelectorAll("img").forEach((t, e) => {
                    t.dataset.previewIndex = String(e);
                  });
              }, [t, e]),
              {
                assignRef: s().useCallback(
                  (t) => {
                    (a.current = t),
                      "function" == typeof n ? n(t) : n && (n.current = t);
                  },
                  [n]
                ),
                handleContainerClick: s().useCallback(
                  (t) => {
                    var n = t.target.closest("a");
                    if (n) {
                      t.preventDefault();
                      var a = n.dataset.type,
                        r = n.href;
                      return r.includes("sourceid")
                        ? void u.x.navToZGYD(r)
                        : r.includes("mpf.tuopukeji.cn")
                        ? void u.x.navToOuter(r)
                        : void (a
                            ? u.x.navToOp({ data: { linkValue: r, text6: a } })
                            : u.x.navToHref(r));
                    }
                    if ((null == o || o(t), e && !t.defaultPrevented)) {
                      var { target: l } = t;
                      if (l instanceof HTMLImageElement) {
                        var s = l.dataset.previewIndex;
                        if (void 0 !== s) {
                          var d = Number(s);
                          !Number.isFinite(d) || d < 0 || d >= c.length || i(d);
                        }
                      }
                    }
                  },
                  [e, c.length, o]
                ),
                closePreview: s().useCallback(() => {
                  i(-1);
                }, []),
                previewOpenIndex: r,
                previewImages: c.map((t) => ({ src: t })),
              }
            );
          })(n, l, e, h);
        return "string" != typeof n
          ? null
          : (0, i.jsxs)(i.Fragment, {
              children: [
                (0, i.jsx)(
                  "div",
                  (0, a._)((0, o._)({}, w), {
                    ref: m,
                    className: (0, f.A)(l && d, v),
                    onClick: g,
                    dangerouslySetInnerHTML: { __html: n },
                  })
                ),
                l && p.length > 0
                  ? (0, i.jsx)(c.Ay, {
                      images: p,
                      openIndex: y,
                      close: I,
                      onClose: I,
                    })
                  : null,
              ],
            });
      });
      v.displayName = "RichText";
    },
    62127(t, e, n) {
      n.d(e, { x: () => i });
      var o = n(13454),
        a = n(53219),
        r = n(88229);
      var i = (t, e) => {
        (0, a.A)(() => {
          !(function (t, e) {
            (0, o._)(function* () {
              if (null == t ? void 0 : t.length) {
                e && e > 0 && (yield (0, r.y)(e));
                var n = [];
                !(function (t) {
                  for (var e = 0; e < t.length; e += 1)
                    (n[e] = new Image()), (n[e].src = t[e]);
                })(t);
              }
            })();
          })(t, e);
        });
      };
    },
    40998(t, e, n) {
      n.d(e, { q: () => l });
      var o = n(15189),
        a = n(53219),
        r = n(8356),
        i = n(56287),
        c = n.n(i);
      function l() {
        var t = (0, r.ow)();
        return (
          (0, a.A)(() => {
            t &&
              (0, o.TK)({
                assistantUserInfo: t.assistantUserInfo,
                goodsInfo: t.goodsInfo,
                customerPhone: t.customerPhone,
                clickTime: c()().format("YYYY-MM-DD HH:mm:ss"),
              });
          }),
          {
            isFromStarFire: "OUTERXHGJ" === (0, r.si)().main,
            starfireParams: t,
          }
        );
      }
    },
    1232(t, e, n) {
      n.d(e, { t: () => c });
      var o = n(86070),
        a = n(41486),
        r = {
          Badge: "Badge___FnLqU",
          topRight: "topRight___kpN9B",
          CL: "CL___I8Zza",
          HD: "HD___TmXZA",
          XP: "XP___po3ix",
          RM: "RM___x3THp",
          ZS: "ZS___yoDIA",
          ZSBJ: "ZSBJ___KRZcf",
          YL: "YL___Wr5Ch",
          YXF: "YXF___VtwZU",
        },
        i = n(13526),
        c = (0, a.memo)((t) => {
          var { status: e, placement: n = "topLeft" } = t;
          return e
            ? (0, o.jsx)("div", {
                className: (0, i.A)(
                  r.Badge,
                  r[e],
                  "topRight" === n && r.topRight
                ),
              })
            : null;
        });
      c.displayName = "RightsCardBadge";
    },
    44418(t, e, n) {
      n.d(e, {
        BD: () => v,
        JD: () => I,
        VD: () => f,
        _f: () => g,
        ij: () => h,
        kn: () => _,
        lk: () => m,
        qs: () => w,
        wk: () => d,
        yI: () => y,
        zt: () => u,
      });
      var o = n(13454),
        a = n(20837),
        r = n(43952),
        i = n(81566),
        c = n(78337),
        l = n(2307),
        s = n(35574);
      function d(t) {
        var e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, o._)(function* () {
          var n = Object.assign({}, t, { checkSwitch: !1 }),
            o = yield l.t.getConcatenationInfo();
          return (
            o && ((n.wtAc = o.wtAc), (n.wtAcId = o.wtAcId)),
            (0, i.D8)() && (n.platform = 1),
            ("1.5" !== n.certificateNum && 1.5 !== n.certificateNum) ||
              (n.certificateNum = "1"),
            (0, c.t)({
              abilityCode: "COUPON_OPEN_TEL_FEE_AUTH",
              data: n,
              showToast: e,
            })
          );
        })();
      }
      function u(t) {
        var e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, o._)(function* () {
          var n = yield l.t.getConcatenationInfo();
          return (
            n && ((t.wtAc = n.wtAc), (t.wtAcId = n.wtAcId)),
            (0, i.D8)() && (t.platform = 1),
            (0, c.t)({
              abilityCode: "INNER_OPEN_TEL_FEE_AUTH",
              data: t,
              showToast: e,
            })
          );
        })();
      }
      function f(t) {
        var e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, o._)(function* () {
          var n = yield l.t.getConcatenationInfo();
          return (
            n && ((t.wtAc = n.wtAc), (t.wtAcId = n.wtAcId)),
            (0, i.D8)() && (t.platform = 1),
            (0, c.t)({
              abilityCode: "INNER_OPEN_MEMBER_SHIP",
              data: t,
              showToast: e,
            })
          );
        })();
      }
      function _(t) {
        var e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, o._)(function* () {
          var n = yield l.t.getConcatenationInfo();
          return (
            n && ((t.wtAc = n.wtAc), (t.wtAcId = n.wtAcId)),
            (0, i.D8)() && (t.platform = 1),
            (0, c.t)({
              abilityCode: "OPEN_TEL_AUTH_LIMIT_MORE",
              data: t,
              showToast: e,
            })
          );
        })();
      }
      function v(t) {
        return (0, o._)(function* () {
          var { userInfo: e } = s.nc.getState(),
            n = [];
          (null == e ? void 0 : e.isRegularGold) &&
            n.push("memberOfferIdLevel5"),
            (null == e ? void 0 : e.isBasicGold) &&
              n.push("goldMemberInfoBase");
          var o = (0, a._)(
              {
                memberIdentify: "isHaigouPlus",
                activeId: "10480",
                price: "0",
                attrNbrList: n,
              },
              t
            ),
            r = yield l.t.getConcatenationInfo();
          return (
            r && ((o.wtAc = r.wtAc), (o.wtAcId = r.wtAcId)),
            (0, i.D8)() && (o.platform = 1),
            (0, c.t)({
              abilityCode: "OPEN_TEL_AUTH_LIMIT_MORE",
              data: o,
              showToast: !0,
            })
          );
        })();
      }
      function h(t) {
        var e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, o._)(function* () {
          var n = yield l.t.getConcatenationInfo();
          return (
            n && ((t.wtAc = n.wtAc), (t.wtAcId = n.wtAcId)),
            (0, i.D8)() && (t.platform = 1),
            (0, c.t)({
              abilityCode: "OPEN_TEL_HALF_PRICE",
              data: t,
              showToast: e,
            })
          );
        })();
      }
      function w(t) {
        var e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, o._)(function* () {
          var n = yield l.t.getConcatenationInfo();
          return (
            n && ((t.wtAc = n.wtAc), (t.wtAcId = n.wtAcId)),
            (0, i.D8)() && (t.platform = 1),
            (0, c.t)({
              abilityCode: "OPEN_TEL_HALF_PRICE",
              data: (0, r._)((0, a._)({}, t), { activeId: "10163" }),
              showToast: e,
            })
          );
        })();
      }
      function m(t) {
        var e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, o._)(function* () {
          var n = yield l.t.getConcatenationInfo();
          return (
            n && ((t.wtAc = n.wtAc), (t.wtAcId = n.wtAcId)),
            (0, i.D8)() && (t.platform = 1),
            (0, c.t)({ abilityCode: "5G_GOLD_RECEIVE", data: t, showToast: e })
          );
        })();
      }
      function g() {
        return (0, o._)(function* () {
          var t = {},
            e = yield l.t.getConcatenationInfo();
          return (
            e && ((t.wtAc = e.wtAc), (t.wtAcId = e.wtAcId)),
            (0, i.D8)() && (t.platform = 1),
            (0, c.t)({
              abilityCode: "RIGHTS_SUBMIT_SHOPPING_CAR",
              data: {},
              showToast: !0,
            })
          );
        })();
      }
      function I(t) {
        var e =
          !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return (0, o._)(function* () {
          var n = yield l.t.getConcatenationInfo();
          return (
            n && ((t.wtAc = n.wtAc), (t.wtAcId = n.wtAcId)),
            (0, c.t)({
              abilityCode: "OPEN_TEL_AUTH_LIMIT",
              data: t,
              showToast: e,
            })
          );
        })();
      }
      function y(t) {
        return (0, o._)(function* () {
          return (0,
          c.t)({ abilityCode: "activityPlus", data: (0, a._)({ offerId: t.offerId }, t.id && { id: t.id }, t.conId && { conId: t.conId }), showToast: !0 });
        })();
      }
    },
    99496(t, e, n) {
      n.d(e, { $: () => c, h: () => l });
      var o = n(13454),
        a = n(81566),
        r = n(2307),
        i = /^\d{6}\//;
      function c(t) {
        if (!t) return "";
        if (/^https?:\/\//i.test(t)) return t;
        var e = t.replace(/^\/+/, "");
        return (
          e.startsWith("images/rights/") && (e = e.slice("images/".length)),
          !e.startsWith("rights/") && i.test(e) && (e = "rights/".concat(e)),
          "".concat(gImgUrlPrefixLegacy, "/").concat(e)
        );
      }
      function l(t, e) {
        return (0, o._)(function* () {
          try {
            if ((0, a.D8)()) {
              try {
                r.t.savePhoto({ type: "1", data: t, phoneNum: e });
              } catch (t) {
                throw new Error("保存图片失败，请稍后重试");
              }
              return;
            }
            var n = t.startsWith("http")
                ? t
                : "".concat(window.location.origin).concat(t),
              i = yield fetch(n);
            if (!i.ok) throw new Error("图片加载失败");
            var c = yield i.blob(),
              l = window.URL.createObjectURL(c),
              s = document.createElement("a");
            (s.href = l),
              (s.download = e || "image_".concat(Date.now(), ".png")),
              (s.style.display = "none"),
              document.body.appendChild(s),
              s.click(),
              document.body.removeChild(s),
              window.URL.revokeObjectURL(l);
          } catch (n) {
            try {
              yield (function (t, e) {
                return (0, o._)(function* () {
                  return new Promise((n, o) => {
                    var a = new Image();
                    (a.crossOrigin = "anonymous"),
                      (a.onload = () => {
                        try {
                          var t = document.createElement("canvas");
                          (t.width = a.width), (t.height = a.height);
                          var r = t.getContext("2d");
                          if (!r)
                            return void o(new Error("无法创建 Canvas 上下文"));
                          r.drawImage(a, 0, 0),
                            t.toBlob(
                              (t) => {
                                if (t) {
                                  var a = window.URL.createObjectURL(t),
                                    r = document.createElement("a");
                                  (r.href = a),
                                    (r.download =
                                      e || "image_".concat(Date.now(), ".png")),
                                    (r.style.display = "none"),
                                    document.body.appendChild(r),
                                    r.click(),
                                    document.body.removeChild(r),
                                    window.URL.revokeObjectURL(a),
                                    n();
                                } else o(new Error("图片转换失败"));
                              },
                              "image/png",
                              1
                            );
                        } catch (t) {
                          o(t);
                        }
                      }),
                      (a.onerror = () => {
                        o(new Error("图片加载失败"));
                      }),
                      (a.src = t);
                  });
                })();
              })(t, e);
            } catch (t) {
              throw new Error("保存图片失败，请稍后重试");
            }
          }
        })();
      }
    },
  },
]);
