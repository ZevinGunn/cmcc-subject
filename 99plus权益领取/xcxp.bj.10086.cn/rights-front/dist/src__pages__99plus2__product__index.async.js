"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["5901"],
  {
    98165(e, t, s) {
      s.d(t, { f: () => m });
      var n = s(20837),
        i = s(43952),
        l = s(86070),
        o = (s(79495), s(75834)),
        a =
          (s(41486),
          {
            modal: "modal___sTGwL",
            close: "close___Twvc_",
            head: "head___GsVwY",
            body: "body___j37d1",
            foot: "foot___ifJBQ",
            okButton: "okButton___TIf2l",
            disabled: "disabled___oMrIZ",
          }),
        r = s(13526),
        c = "".concat(
          gImgUrlPrefixLegacy,
          "/rights/202303/9b46080e-9f19-47ed-9839-6a546817c2b1-icon-close.png"
        ),
        d = 998,
        u = 999;
      function m(e) {
        var t,
          {
            rounded: s = !0,
            roundedValue: m = ".2rem",
            visible: v = !1,
            titleText: h,
            okButton: _,
            okButtonText: g = "确定",
            okButtonStyle: f = {},
            hasCloseButton: x = !0,
            hasOkButton: p = !0,
            disableOkButton: C = !1,
            maskClosable: N = !1,
            hasFoot: j = !0,
            hasHead: b = !0,
            rootClassName: y,
            modalClassName: R,
            maskStyle: P = {},
            contentStyle: w = {},
            footStyle: I = {},
            bodyStyle: k = {},
            headStyle: M = {},
            onClose: S = () => {},
            onAfterClose: A = () => {},
            onOk: O = () => {},
            onMaskClick: D = () => {},
          } = e,
          T =
            ((t = s ? { borderTopLeftRadius: m, borderTopRightRadius: m } : {}),
            (0, i._)((0, n._)({}, w, t), { zIndex: u })),
          L = (0, l.jsx)("div", {
            className: (0, r.$)(a.okButton, C && a.disabled),
            style: f,
            onClick: () => {
              C || O();
            },
            children: g,
          }),
          B =
            j && p
              ? (0, l.jsx)("div", {
                  className: a.foot,
                  style: I,
                  children: _ || L,
                })
              : null,
          E =
            b && h
              ? (0, l.jsx)("div", {
                  className: a.head,
                  style: M,
                  children: (0, l.jsx)("div", {
                    className: a.title,
                    children: h,
                  }),
                })
              : null;
        return (0, l.jsx)(o.Ay, {
          visible: v,
          close: S,
          onClose: A,
          gestureOutOfControl: !0,
          contentStyle: T,
          onMaskClick: D,
          maskClosable: N,
          contentClass: y,
          maskStyle: (0, n._)({ zIndex: d }, P),
          children: (0, l.jsxs)("div", {
            className: (0, r.$)(a.modal, R),
            children: [
              E,
              (0, l.jsx)("div", {
                className: a.body,
                style: k,
                children: e.children,
              }),
              B,
              x
                ? (0, l.jsx)("div", {
                    className: a.close,
                    onClick: S,
                    children: (0, l.jsx)("img", { src: c, alt: "" }),
                  })
                : null,
            ],
          }),
        });
      }
    },
    32762(e, t, s) {
      s.d(t, { E: () => c });
      var n = s(86070),
        i = (s(41486), "CommonDetails___LhIfl"),
        l = "descCard___N0UA1",
        o = "descCardTitle___i4X_9",
        a = "descCardContent___saEdn",
        r = s(58349);
      function c(e) {
        var { descList: t } = e;
        return (0, n.jsx)("div", {
          className: i,
          children: t.map((e) =>
            (0, n.jsxs)(
              "div",
              {
                className: l,
                children: [
                  e.title.length
                    ? (0, n.jsx)(r.s, { className: o, text: e.title })
                    : null,
                  e.content.length
                    ? (0, n.jsx)(r.s, { className: a, text: e.content })
                    : null,
                ],
              },
              e.title
            )
          ),
        });
      }
    },
    91098(e, t, s) {
      s.d(t, { R: () => d });
      var n = s(86070),
        i = s(41486),
        l = {
          PBPDetails: "PBPDetails___l2q6f",
          title: "title___yridA",
          text: "text___R9fhK",
          SupplementImg: "SupplementImg___GjdHd",
        },
        o = s(24374),
        a = s(66782),
        r = s(32762),
        c = s(58349);
      function d(e) {
        var { data: t } = e,
          s = (0, i.useMemo)(() => (0, a.TL)(t), [t]),
          d = (0, i.useMemo)(() => (0, a.FR)(t), [t]),
          u = (0, i.useMemo)(
            () =>
              d
                ? d.startsWith("http")
                  ? d
                  : "".concat(gImgUrlPrefixLegacy, "/").concat(d)
                : "",
            [d]
          ),
          m = (0, i.useMemo)(() => {
            var e = (0, a.gX)(t);
            return e
              ? e.startsWith("http")
                ? e
                : "".concat(gImgUrlPrefixLegacy, "/").concat(e)
              : "";
          }, [t]),
          v = (0, i.useMemo)(() => (0, o.e)(m), [m]),
          h = (0, i.useMemo)(
            () => [
              { title: "权益提供方", content: (0, a.Z7)(t) },
              { title: "常见问题", content: (0, a.fS)(t) },
              { title: "温馨提示", content: (0, a.cW)(t) },
              { title: "补充说明", content: (0, a.gR)(t) },
            ],
            [t]
          );
        return (null == v ? void 0 : v.length)
          ? (0, n.jsx)(r.E, { descList: v })
          : (0, n.jsx)(n.Fragment, {
              children: (0, n.jsxs)("ul", {
                className: l.PBPDetails,
                children: [
                  (0, n.jsxs)("li", {
                    style: { wordBreak: "break-all" },
                    children: [
                      (0, n.jsx)("div", {
                        className: l.title,
                        children: "权益须知",
                      }),
                      (0, n.jsx)("div", {
                        className: l.text,
                        children:
                          s.indexOf("</") >= 0 || s.indexOf("<b") >= 0
                            ? (0, n.jsx)(c.s, { className: l.line, text: s })
                            : (0, n.jsx)("div", {
                                className: l.line,
                                children: s,
                              }),
                      }),
                    ],
                  }),
                  h.map((e) =>
                    (0, n.jsxs)(
                      "li",
                      {
                        style: { wordBreak: "break-all" },
                        hidden: "" === e.content || "no" === e.content,
                        children: [
                          (0, n.jsx)("div", {
                            className: l.title,
                            children: e.title,
                          }),
                          (0, n.jsx)("div", {
                            className: l.text,
                            children: (0, n.jsx)(c.s, { text: e.content }),
                          }),
                          "补充说明" === e.title && d
                            ? (0, n.jsx)("img", {
                                className: l.SupplementImg,
                                alt: "",
                                src: u,
                              })
                            : null,
                        ],
                      },
                      e.title
                    )
                  ),
                ],
              }),
            });
      }
    },
    7960(e, t, s) {
      s.d(t, { _: () => u });
      var n = s(20837),
        i = s(50654),
        l = s(86070),
        o = (s(79065), s(28535), s(49703)),
        a = s(13438),
        r = s(41486),
        c = s.n(r),
        d = s(99496);
      function u(e) {
        var {
            lazy: t = !0,
            hasBottomOverlap: s = !1,
            offset: r = 0,
            src: u,
          } = e,
          m = (0, i._)(e, ["lazy", "hasBottomOverlap", "offset", "src"]),
          v = (0, d.$)(u),
          [h, _] = c().useState(!1);
        return t
          ? (0, l.jsx)(o.A, {
              style: { fontSize: 0 },
              onVisibleChange: (e) => _(e),
              offset: r,
              once: !0,
              children: (0, l.jsx)(
                a.A,
                (0, n._)(
                  {
                    src: v,
                    showImage: h,
                    bottomOverlap: s ? void 0 : null,
                    animateDuration: 150,
                  },
                  m
                )
              ),
            })
          : (0, l.jsx)(
              a.A,
              (0, n._)({ bottomOverlap: null, animateDuration: 150, src: v }, m)
            );
      }
    },
    58349(e, t, s) {
      s.d(t, { s: () => h });
      var n = s(20837),
        i = s(43952),
        l = s(50654),
        o = s(86070),
        a = (s(75837), s(19784)),
        r = s(41486),
        c = s.n(r),
        d = "WithImagePreview____6O8T",
        u = s(20696),
        m = s(13526);
      function v(e) {
        if ("undefined" == typeof window || "undefined" == typeof DOMParser)
          return [];
        var t = new DOMParser().parseFromString(e, "text/html");
        return Array.from(t.querySelectorAll("img"))
          .map((e) =>
            (function (e) {
              if (!e || "undefined" == typeof window) return null != e ? e : "";
              try {
                return new URL(e, window.location.href).href;
              } catch (t) {
                return e;
              }
            })(e.getAttribute("src"))
          )
          .filter(Boolean);
      }
      var h = c().forwardRef((e, t) => {
        var { text: s, enableImagePreview: r, className: h, onClick: _ } = e,
          g = (0, l._)(e, [
            "text",
            "enableImagePreview",
            "className",
            "onClick",
          ]),
          {
            assignRef: f,
            handleContainerClick: x,
            closePreview: p,
            previewOpenIndex: C,
            previewImages: N,
          } = (function (e, t, s, n) {
            var i = c().useRef(null),
              [l, o] = c().useState(-1),
              a = c().useMemo(
                () => (t && "string" == typeof e ? v(e) : []),
                [t, e]
              );
            return (
              c().useLayoutEffect(() => {
                t &&
                  i.current &&
                  i.current.querySelectorAll("img").forEach((e, t) => {
                    e.dataset.previewIndex = String(t);
                  });
              }, [e, t]),
              {
                assignRef: c().useCallback(
                  (e) => {
                    (i.current = e),
                      "function" == typeof s ? s(e) : s && (s.current = e);
                  },
                  [s]
                ),
                handleContainerClick: c().useCallback(
                  (e) => {
                    var s = e.target.closest("a");
                    if (s) {
                      e.preventDefault();
                      var i = s.dataset.type,
                        l = s.href;
                      return l.includes("sourceid")
                        ? void u.x.navToZGYD(l)
                        : l.includes("mpf.tuopukeji.cn")
                        ? void u.x.navToOuter(l)
                        : void (i
                            ? u.x.navToOp({ data: { linkValue: l, text6: i } })
                            : u.x.navToHref(l));
                    }
                    if ((null == n || n(e), t && !e.defaultPrevented)) {
                      var { target: r } = e;
                      if (r instanceof HTMLImageElement) {
                        var c = r.dataset.previewIndex;
                        if (void 0 !== c) {
                          var d = Number(c);
                          !Number.isFinite(d) || d < 0 || d >= a.length || o(d);
                        }
                      }
                    }
                  },
                  [t, a.length, n]
                ),
                closePreview: c().useCallback(() => {
                  o(-1);
                }, []),
                previewOpenIndex: l,
                previewImages: a.map((e) => ({ src: e })),
              }
            );
          })(s, r, t, _);
        return "string" != typeof s
          ? null
          : (0, o.jsxs)(o.Fragment, {
              children: [
                (0, o.jsx)(
                  "div",
                  (0, i._)((0, n._)({}, g), {
                    ref: f,
                    className: (0, m.A)(r && d, h),
                    onClick: x,
                    dangerouslySetInnerHTML: { __html: s },
                  })
                ),
                r && N.length > 0
                  ? (0, o.jsx)(a.Ay, {
                      images: N,
                      openIndex: C,
                      close: p,
                      onClose: p,
                    })
                  : null,
              ],
            });
      });
      h.displayName = "RichText";
    },
    73852(e, t, s) {
      s.d(t, { i: () => a });
      var n = s(41486),
        i = s(12457),
        l = s(80085),
        o = s(20696);
      function a() {
        var e = (0, l.MT)(),
          t = (0, n.useCallback)(() => {
            "" !== e &&
              (0, i.VD)({ pageCode: e }).then((e) => {
                ("20001" !== e.resultCode && "20002" !== e.resultCode) ||
                  o.x.navToPath("activity/offline");
              });
          }, [e]);
        (0, n.useEffect)(() => {
          t();
        }, [t]);
      }
    },
    2533(e, t, s) {
      s.r(t), s.d(t, { default: () => De, useBottomButton: () => Oe });
      var n = s(13454),
        i = s(86070),
        l = s(41486),
        o = s.n(l),
        a = s(25657),
        r = "Page___aE4jS",
        c = s(73508),
        d = s(73852),
        u = s(82647),
        m = s(66782),
        v = s(20696),
        h = s(55370),
        _ = s(77602),
        g = s(71395),
        f = s(91098),
        x = "BottomActions___ynTfR",
        p = "Button___vM4hh",
        C = "Disabled___KiyU1",
        N = s(13526);
      function j(e) {
        var { disabled: t = !1, buttonText: s, onButtonClick: n } = e;
        return (0, i.jsx)("div", {
          className: x,
          children: (0, i.jsx)("button", {
            className: (0, N.A)(p, t && C),
            type: "button",
            onClick: () => {
              t || n(s);
            },
            children: s,
          }),
        });
      }
      var b = "Modal___NM3WL",
        y = "PriceWrap___b2O7S",
        R = "PriceSymbol___xccYI",
        P = "DiscountedPrice___u6Hhr",
        w = "DiscountedSuffix___XHfBy",
        I = "SavedAmount___PLZqs",
        k = "DescList___HXuA1",
        M = "DescItem___VA_xY",
        S = "DescItemLabel___ShLv2",
        A = "DescItemValue___tbiWQ",
        O = "PhoneBills___mlQoQ",
        D = "PhoneBillsIcon___YoYxH",
        T = "PhoneBillsText___rFqDP",
        L = "Coupon___KeDhG",
        B = "CouponIcon___Kjo78",
        E = "CouponText___I7FuF",
        U = "CouponButton___dEnxr",
        Y = "CouponButtonText___QXNIy",
        V = "CouponButtonImg___kjz4w",
        F = "button___fgNZN",
        H = "Tips___veCIf",
        K = s(64308),
        Q = s(68520),
        W = "Content___u4c2Q",
        Z = "CloseButton___Gty60",
        q = "CloseButtonIcon___enDuK",
        z = "CloseButtonText___Phwsw",
        G = "CouponList____QTjH",
        X = s(71976),
        $ = s(31501),
        J = "DiscountCoupon___SP1jl",
        ee = "Info___vTsgV",
        te = "InfoL___Wh7HH",
        se = "InfoM___GnSVP",
        ne = "Name___b7Bkh",
        ie = "Date___vMyHf",
        le = "Desc___dhs5k",
        oe = "CheckButton___ieZ1E",
        ae = "CheckButtonIcon___fF3iv",
        re = s(50067);
      function ce(e) {
        var { checked: t, discountCouponInfo: s } = e,
          n = (0, re.useStoreActions)(),
          l = (0, re.useStore)((e) => e.currentSelectedCoupon);
        return (0, i.jsxs)("div", {
          className: J,
          onClick: () => {
            u.U.bpEverythingClick({
              moduleName: "优惠券选择弹窗",
              pointPosition: "优惠券".concat(s.discountValue),
            }),
              (null == l ? void 0 : l.discountValue) === s.discountValue
                ? n.updateCurrentSelectedCoupon(null)
                : n.updateCurrentSelectedCoupon(s);
          },
          children: [
            (0, i.jsxs)("div", {
              className: ee,
              children: [
                (0, i.jsxs)("div", {
                  className: te,
                  children: [s.discountNum, "折"],
                }),
                (0, i.jsxs)("div", {
                  className: se,
                  children: [
                    (0, i.jsxs)("div", {
                      className: ne,
                      children: [s.discountNum, "折券"],
                    }),
                    (0, i.jsxs)("div", {
                      className: ie,
                      children: [s.effectiveTime, "-", s.expiredTime],
                    }),
                  ],
                }),
                (0, i.jsx)("div", {
                  className: oe,
                  children: t
                    ? (0, i.jsx)($.A, { className: ae })
                    : (0, i.jsx)(X.A, { className: ae }),
                }),
              ],
            }),
            (0, i.jsx)("div", {
              className: le,
              children:
                "折扣券仅限在本会员帮你省钱专区购买权益商品，折扣券当月有效，月底失效",
            }),
          ],
        });
      }
      var de = s(98165),
        ue = s(56287),
        me = s.n(ue);
      function ve(e) {
        var { open: t, onClose: s } = e,
          n = (function () {
            var e = (0, re.useStore)((e) => e.discountInfo),
              t = (0, re.useStoreActions)();
            return (
              (0, l.useEffect)(() => {
                t.updateDiscountInfo();
              }, [t]),
              (0, l.useMemo)(() => {
                var t = {
                    effectiveTime: me()().startOf("month").format("YYYY.MM.DD"),
                    expiredTime: me()().endOf("month").format("YYYY.MM.DD"),
                    discountValue: 95,
                    discountNum: "9.5",
                  },
                  s = {
                    effectiveTime: me()(e.effectiveTime).format("YYYY.MM.DD"),
                    expiredTime: me()(e.expiredTime).format("YYYY.MM.DD"),
                    discountValue: 50,
                    discountNum: "5",
                  },
                  n = {
                    effectiveTime: me()(e.effectiveTime).format("YYYY.MM.DD"),
                    expiredTime: me()(e.expiredTime).format("YYYY.MM.DD"),
                    discountValue: 80,
                    discountNum: "8",
                  };
                return 2 === e.state
                  ? [t]
                  : "50" === e.discountCode
                  ? [t, s]
                  : "80" === e.discountCode
                  ? [t, n]
                  : [t];
              }, [e.discountCode, e.effectiveTime, e.expiredTime, e.state])
            );
          })(),
          o = (0, re.useStore)((e) => e.currentSelectedCoupon),
          a = (0, re.useStoreActions)();
        return (
          (0, l.useEffect)(() => {
            var e = n.reduce((e, t) =>
              t.discountValue < e.discountValue ? t : e
            );
            a.updateCurrentSelectedCoupon(e);
          }, [a, n]),
          (0, i.jsx)(de.f, {
            visible: t,
            hasFoot: !1,
            hasHead: !1,
            hasCloseButton: !1,
            onClose: s,
            bodyStyle: { padding: 0 },
            maskStyle: { backgroundColor: "rgba(0, 0, 0, 0.2)", zIndex: 999 },
            maskClosable: !0,
            children: (0, i.jsxs)("div", {
              className: W,
              children: [
                (0, i.jsxs)("div", {
                  className: Z,
                  onClick: s,
                  children: [
                    (0, i.jsx)("img", {
                      className: q,
                      src: "".concat(
                        gImgUrlPrefixLegacy,
                        "/rights/202505/8b3c4c84-da74-4375-bb0b-01e63c09f4ac-djdtytdj.png"
                      ),
                      alt: "",
                    }),
                    (0, i.jsx)("span", {
                      className: z,
                      children: "选择优惠券",
                    }),
                  ],
                }),
                (0, i.jsx)("div", {
                  className: G,
                  children: n.map((e) =>
                    (0, i.jsx)(
                      ce,
                      {
                        discountCouponInfo: e,
                        checked:
                          e.discountValue ===
                          (null == o ? void 0 : o.discountValue),
                      },
                      e.discountValue
                    )
                  ),
                }),
              ],
            }),
          })
        );
      }
      var he = s(33843),
        _e = s(62116),
        ge = s(59344),
        fe = s(86503),
        xe = s(5168);
      var pe = (e) => {
          var { data: t, open: s, onClose: a } = e,
            r = (0, re.useStoreActions)(),
            [c, d] = (0, l.useState)(!1),
            h = null == t ? void 0 : t.legalRightsDesc,
            _ = (0, l.useMemo)(
              () =>
                (0, K.lK)(
                  null == t ? void 0 : t.legalRightsAttrs,
                  "effExplain"
                ) || "详见产品介绍",
              [null == t ? void 0 : t.legalRightsAttrs]
            ),
            g = (0, l.useMemo)(() => (0, m.Cg)(t), [t]),
            f = (0, l.useMemo)(
              () =>
                (0, m.h1)({
                  belongAreas: g,
                  targetAreas: ["99PLUS2_CORE_YR", "99PLUS2_CORE_MO"],
                }),
              [g]
            ),
            x = g.includes("99PLUS2_DISCOUNT"),
            p = (0, re.useStore)((e) => e.currentSelectedCoupon),
            { price: C } = (function (e) {
              var { rightsInfo: t, isSelectDiscount: s } = e,
                n = (0, l.useMemo)(
                  () =>
                    (0, K.lK)(
                      null == t ? void 0 : t.legalRightsAttrs,
                      "vipPrice"
                    ),
                  [t]
                ),
                i = (0, l.useMemo)(() => (0, m.Cg)(t), [t]),
                o = (0, l.useMemo)(
                  () =>
                    (0, m.h1)({
                      belongAreas: i,
                      targetAreas: ["99PLUS2_CORE_YR", "99PLUS2_CORE_MO"],
                    }),
                  [i]
                );
              return {
                price: (0, l.useMemo)(
                  () =>
                    o
                      ? { discountedPrice: "0", savedAmount: "0.00" }
                      : s
                      ? {
                          discountedPrice: t.discountPrice,
                          savedAmount: (0, Q.jq)(n, t.discountPrice),
                        }
                      : { discountedPrice: n, savedAmount: "0.00" },
                  [o, s, t.discountPrice, n]
                ),
              };
            })({ rightsInfo: t, isSelectDiscount: !!p }),
            N = o().useRef(null),
            [j, W] = (0, l.useState)(!1);
          return (0, i.jsxs)(i.Fragment, {
            children: [
              (0, i.jsx)(de.f, {
                visible: s,
                hasFoot: !1,
                onClose: a,
                children: (0, i.jsxs)("div", {
                  className: b,
                  children: [
                    (0, i.jsxs)("div", {
                      className: y,
                      children: [
                        (0, i.jsx)("span", { className: R, children: "￥" }),
                        (0, i.jsx)("span", {
                          className: P,
                          children: C.discountedPrice,
                        }),
                        (0, i.jsx)("span", { className: w, children: "/次" }),
                        "0.00" === C.savedAmount
                          ? null
                          : (0, i.jsxs)("span", {
                              className: I,
                              children: ["已优惠¥", C.savedAmount],
                            }),
                      ],
                    }),
                    (0, i.jsxs)("div", {
                      className: k,
                      children: [
                        (0, i.jsxs)("div", {
                          className: M,
                          children: [
                            (0, i.jsx)("div", {
                              className: S,
                              children: "已选商品",
                            }),
                            (0, i.jsx)("div", { className: A, children: h }),
                          ],
                        }),
                        (0, i.jsxs)("div", {
                          className: M,
                          children: [
                            (0, i.jsx)("div", {
                              className: S,
                              children: "生效时间",
                            }),
                            (0, i.jsx)("div", {
                              className: A,
                              children: "以权益到账短信或权益方说明为准",
                            }),
                          ],
                        }),
                        (0, i.jsxs)("div", {
                          className: M,
                          children: [
                            (0, i.jsx)("div", {
                              className: S,
                              children: "续订规则",
                            }),
                            (0, i.jsx)("div", { className: A, children: _ }),
                          ],
                        }),
                      ],
                    }),
                    (0, i.jsx)("div", {
                      className: H,
                      children: "订购生效时间以订购成功短信为准",
                    }),
                    (0, i.jsxs)("div", {
                      className: O,
                      style: f ? { marginBottom: "0.6rem" } : void 0,
                      children: [
                        (0, i.jsx)("img", {
                          className: D,
                          src: "".concat(
                            gImgUrlPrefixLegacy,
                            "/rights/202303/a509fe8a-a9c4-435f-8493-00cbbf944d5e-584.png"
                          ),
                          alt: "",
                        }),
                        (0, i.jsx)("div", {
                          className: T,
                          children: "话费支付",
                        }),
                      ],
                    }),
                    f
                      ? null
                      : (0, i.jsxs)("div", {
                          className: L,
                          onClick: () => {
                            u.U.bpEverythingClick({
                              moduleName: "订购二次确认弹窗",
                              pointPosition: "优惠券",
                            }),
                              d(!0);
                          },
                          children: [
                            (0, i.jsx)("img", {
                              className: B,
                              src: "".concat(
                                gImgUrlPrefixLegacy,
                                "/rights/202505/060a5507-f454-4717-966b-000209159949-afga.png"
                              ),
                              alt: "",
                            }),
                            (0, i.jsx)("div", {
                              className: E,
                              children: "优惠券",
                            }),
                            (0, i.jsxs)("div", {
                              className: U,
                              children: [
                                "0.00" === C.savedAmount
                                  ? null
                                  : (0, i.jsxs)("span", {
                                      className: Y,
                                      children: ["-", C.savedAmount],
                                    }),
                                (0, i.jsx)("img", {
                                  className: V,
                                  src: "".concat(
                                    gImgUrlPrefixLegacy,
                                    "/rights/202302/8072e4b2-b574-4de9-8204-974ea979ffc0-backIcon.png"
                                  ),
                                  alt: "",
                                }),
                              ],
                            }),
                          ],
                        }),
                    (0, i.jsx)(_e.R, {
                      wrapVisible: s,
                      autoSendCodeWhenWrapOpen: f,
                      style: { marginBottom: ".4rem" },
                      ref: N,
                      offerId: void 0,
                      legalRightsNbr: null == t ? void 0 : t.legalRightsNbr,
                      discount: (null == p ? void 0 : p.discountValue) || 100,
                      activeId: 10008,
                      onCheck: W,
                    }),
                    (0, i.jsx)("div", {
                      className: F,
                      onClick: () =>
                        (0, n._)(function* () {
                          var e, s, n, i, l, o, c, d, h;
                          u.U.bpEverythingClick({
                            moduleName: "订购二次确认弹窗",
                            pointPosition: "确认支付",
                          });
                          var _ =
                            null === (e = N.current) || void 0 === e
                              ? void 0
                              : e.getVerificationCode();
                          if (!j || "string" == typeof _) {
                            var g = { legalRightsCode: t.legalRightsNbr };
                            _ && (g.verifyCode = _),
                              x &&
                                (g.discount =
                                  (null == p ? void 0 : p.discountValue) ||
                                  100);
                            var C = yield (0, fe.HF)(g);
                            if (
                              (u.U.bpProductionOrder({
                                productName: t.legalRightsName,
                                rightsCode: t.legalRightsNbr,
                                orderResp: C,
                              }),
                              "0" === C.resultCode)
                            ) {
                              var b, y, R;
                              null === (b = N.current) ||
                                void 0 === b ||
                                b.clearCountdown(),
                                f && r.updateCoreRights(),
                                x &&
                                  (r.updateDiscountInfo(),
                                  r.updateDiscountRightsList());
                              var { legalRightsNbr: P } = t,
                                w = "";
                              "QY1622773673923" === P ||
                              "QY1620247316277" === P ||
                              "QY1615703527610" === P
                                ? (w = "6")
                                : "QY1650613475930" === P
                                ? (w = "3")
                                : "QY1632470416498" === P
                                ? (w = "4")
                                : (0, m.N8)(P) && (w = "5");
                              var I = {
                                codeUrl: (0, K.lK)(
                                  null == t ? void 0 : t.legalRightsAttrs,
                                  "linkUrl"
                                ),
                                title: (0, K.lK)(
                                  null == t ? void 0 : t.legalRightsAttrs,
                                  "effExplain"
                                ),
                                scene: w,
                                id: null == t ? void 0 : t.legalRightsNbr,
                                legalRightsNbr:
                                  null == t ? void 0 : t.legalRightsNbr,
                                custOrderId:
                                  null === (y = C.data) || void 0 === y
                                    ? void 0
                                    : y.custOrderId,
                                extCustOrderId:
                                  null === (R = C.data) || void 0 === R
                                    ? void 0
                                    : R.extCustOrderId,
                                legalRightsId:
                                  null == t ? void 0 : t.legalRightsId,
                                receiveMode: (0, K.lK)(
                                  null == t ? void 0 : t.legalRightsAttrs,
                                  "receiveMode"
                                ),
                                resoult: "1",
                                custOrderType: f ? "9005" : "9004",
                                act: "99plus2",
                              };
                              return (
                                xe.ArrayMigu.includes(P) && (I.resoult = "5"),
                                void v.x.navToPath(
                                  "/plusThird/orderSuccessfully",
                                  I
                                )
                              );
                            }
                            "-1002" !== C.resultCode
                              ? -1 === C.resultMsg.indexOf("频率过快")
                                ? (a(),
                                  -1 ===
                                  (null == C ||
                                  null === (s = C.resultMsg) ||
                                  void 0 === s
                                    ? void 0
                                    : s.indexOf("在途订单"))
                                    ? -1 ===
                                      (null == C ||
                                      null === (n = C.resultMsg) ||
                                      void 0 === n
                                        ? void 0
                                        : n.indexOf(
                                            "预付费校验，后付费不校验检查不通过"
                                          ))
                                      ? -1 ===
                                        (null == C ||
                                        null === (i = C.resultMsg) ||
                                        void 0 === i
                                          ? void 0
                                          : i.indexOf("互斥"))
                                        ? -1 ===
                                            (null == C ||
                                            null === (l = C.resultMsg) ||
                                            void 0 === l
                                              ? void 0
                                              : l.indexOf("停机")) &&
                                          -1 ===
                                            (null == C ||
                                            null === (o = C.resultMsg) ||
                                            void 0 === o
                                              ? void 0
                                              : o.indexOf("过渡期"))
                                          ? -1 ===
                                            (null == C ||
                                            null === (c = C.resultMsg) ||
                                            void 0 === c
                                              ? void 0
                                              : c.indexOf("用户已订购北京移动"))
                                            ? -1 ===
                                              (null == C ||
                                              null === (d = C.resultMsg) ||
                                              void 0 === d
                                                ? void 0
                                                : d.indexOf("订单受理中"))
                                              ? -1 ===
                                                (null == C ||
                                                null === (h = C.resultMsg) ||
                                                void 0 === h
                                                  ? void 0
                                                  : h.indexOf(
                                                      "用户订购次数超过"
                                                    ))
                                                ? v.x.navToPath(
                                                    "/plusThird/orderSuccessfully",
                                                    {
                                                      resoult: "3",
                                                      id: t.legalRightsNbr,
                                                      legalRightsNbr:
                                                        t.legalRightsNbr,
                                                      legalRightsId:
                                                        t.legalRightsId,
                                                      act: "99plus2",
                                                    }
                                                  )
                                                : he.R.open({
                                                    titleIcon: "warning",
                                                    title: "温馨提示",
                                                    content:
                                                      "【办理失败】尊敬的用户您好，您的手机号订购次数超过限制，具体情况请您详细观看订购规则，感谢您的使用。【中国移动】",
                                                  })
                                              : he.R.open({
                                                  titleIcon: "warning",
                                                  title: "温馨提示",
                                                  content:
                                                    "【办理失败】尊敬的用户您好，因系统繁忙您所申请的业务无法受理，请您稍后再试，给您带来的不便，敬请谅解。【中国移动】",
                                                })
                                            : he.R.open({
                                                titleIcon: "warning",
                                                title: "温馨提示",
                                                content:
                                                  "【办理失败】尊敬的客户您好，您申请的该业务已处于开通状态。感谢您的使用。【中国移动】",
                                              })
                                          : he.R.open({
                                              titleIcon: "warning",
                                              title: "温馨提示",
                                              content:
                                                "【办理失败】尊敬的用户您好，您的手机号订购异常，感谢您的使用。【中国移动】",
                                            })
                                        : he.R.open({
                                            titleIcon: "warning",
                                            title: "温馨提示",
                                            content:
                                              "【办理失败】尊敬的用户您好，由于您参加了其他产品，与该产品不能同时订购，感谢您的使用。【中国移动】",
                                          })
                                      : he.R.open({
                                          titleIcon: "warning",
                                          title: "温馨提示",
                                          content:
                                            "【余额不足提醒】尊敬的客户您好，您的账户余额不足，不能成功扣费，请充值后在办理此业务。【中国移动】",
                                        })
                                    : he.R.open({
                                        titleIcon: "warning",
                                        title: "温馨提示",
                                        content:
                                          "【办理失败】尊敬的用户您好，因系统繁忙您所申请的业务无法受理，请您稍后再试，给您带来的不便，敬请谅解。【中国移动】",
                                      }))
                                : ge.Z.info("操作频繁，请稍后再试")
                              : ge.Z.info("验证码校验失败");
                          }
                        })(),
                      children: "确认支付",
                    }),
                  ],
                }),
              }),
              (0, i.jsx)(ve, {
                open: c,
                onClose: () => {
                  u.U.bpEverythingClick({
                    moduleName: "优惠券选择弹窗",
                    pointPosition: "关闭按钮",
                  }),
                    d(!1);
                },
              }),
            ],
          });
        },
        Ce = "Panel___EDJlu",
        Ne = "Head___T1ME9",
        je = "Name___NqvrH",
        be = "Icon___FyBLI",
        ye = "Body___bteMM",
        Re = "RightsCard___k7E2a",
        Pe = "Type___RBJUN",
        we = "Date___sCVCv",
        Ie = "VipPrice___lSZjB",
        ke = "MarketPrice___V9_mj";
      function Me(e) {
        return (0, i.jsxs)("div", {
          className: Re,
          children: [
            (0, i.jsx)("div", { className: Pe, children: e.goodsName }),
            (0, i.jsx)("div", { className: we, children: e.goodsAttr }),
            (0, i.jsxs)("div", {
              className: Ie,
              children: [(0, i.jsx)("span", { children: "￥" }), e.vipPrice],
            }),
            e.normalPrice
              ? (0, i.jsx)("div", {
                  className: ke,
                  children: "标准价￥".concat(e.normalPrice),
                })
              : null,
          ],
        });
      }
      var Se = s(7960);
      function Ae(e) {
        var { data: t } = e,
          { price: s } = (function (e) {
            var t = (0, l.useMemo)(
                () =>
                  (0, K.lK)(null == e ? void 0 : e.legalRightsAttrs, "price"),
                [null == e ? void 0 : e.legalRightsAttrs]
              ),
              s = (0, l.useMemo)(
                () =>
                  (0, K.lK)(
                    null == e ? void 0 : e.legalRightsAttrs,
                    "vipPrice"
                  ),
                [null == e ? void 0 : e.legalRightsAttrs]
              ),
              n = (0, l.useMemo)(() => (0, m.Cg)(e), [e]),
              i = (0, l.useMemo)(
                () =>
                  (0, m.h1)({
                    belongAreas: n,
                    targetAreas: ["99PLUS2_CORE_YR", "99PLUS2_CORE_MO"],
                  }),
                [n]
              );
            return {
              price: (0, l.useMemo)(
                () =>
                  i
                    ? { normalPrice: t, vipPrice: "0" }
                    : { normalPrice: s, vipPrice: e.discountPrice },
                [e.discountPrice, i, t, s]
              ),
            };
          })(t),
          n = (0, l.useMemo)(
            () => ({
              icon: (0, K.lK)(
                null == t ? void 0 : t.legalRightsAttrs,
                "img_330_182",
                !0
              ),
              legalRightsDesc: null == t ? void 0 : t.legalRightsDesc,
              goodsName: (0, K.lK)(
                null == t ? void 0 : t.legalRightsAttrs,
                "goodsName"
              ),
              goodsAttr: (0, K.lK)(
                null == t ? void 0 : t.legalRightsAttrs,
                "goodsAttr"
              ),
            }),
            [t]
          );
        return (0, i.jsxs)("div", {
          className: Ce,
          children: [
            (0, i.jsxs)("div", {
              className: Ne,
              children: [
                (0, i.jsx)(Se._, { className: be, lazy: !1, src: n.icon }),
                (0, i.jsx)("div", {
                  className: je,
                  children: n.legalRightsDesc,
                }),
              ],
            }),
            (0, i.jsx)("div", {
              className: ye,
              children: (0, i.jsx)(Me, {
                goodsAttr: n.goodsAttr,
                goodsName: n.goodsName,
                vipPrice: s.vipPrice,
                normalPrice: s.normalPrice,
              }),
            }),
          ],
        });
      }
      function Oe(e) {
        var t = (0, h.a)(),
          s = (0, l.useMemo)(() => (0, m.Cg)(e), [e]),
          n = (0, re.useStore)((e) => {
            var t;
            return null === (t = e.coreRights) || void 0 === t
              ? void 0
              : t.claimMethod;
          }),
          i = (0, re.useStore)((e) => {
            var t;
            return null === (t = e.coreRights) || void 0 === t
              ? void 0
              : t.hasClaimed;
          }),
          o = (0, l.useMemo)(
            () =>
              (0, m.h1)({
                belongAreas: s,
                targetAreas: ["99PLUS2_CORE_YR", "99PLUS2_CORE_MO"],
              }),
            [s]
          ),
          a = (0, l.useMemo)(
            () =>
              s.includes("99PLUS2_CORE_YR")
                ? "yearly"
                : s.includes("99PLUS2_CORE_MO")
                ? "monthly"
                : null,
            [s]
          );
        return (0, m.nt)(null == e ? void 0 : e.statusCd)
          ? { text: "库存不足，补货中敬请期待", disabled: !0 }
          : "1700" !== (null == e ? void 0 : e.statusCd)
          ? { text: "本权益已下线，请您浏览其他权益", disabled: !0 }
          : 0 === t
          ? { text: "开通会员，立享权益", disabled: !1 }
          : o
          ? n !== a
            ? { text: "立即领取", disabled: !1 }
            : i
            ? { text: "本月已领，下月再来", disabled: !0 }
            : { text: "立即领取", disabled: !1 }
          : { text: "立即订购", disabled: !1 };
      }
      function De() {
        (0, d.i)();
        var [e] = (0, a.ok)(),
          t = e.get("nbr"),
          s = (0, re.useStore)((e) => {
            var t;
            return (
              (null === (t = e.currentSelectedCoupon) || void 0 === t
                ? void 0
                : t.discountValue) || 100
            );
          }),
          { data: o } = (0, c.A)(
            () =>
              (0, n._)(function* () {
                if ("string" != typeof t || !t.length) return null;
                var e = yield (0, fe.gu)({ legalRightsNbr: t, discount: s });
                return e.data ? e.data : null;
              })(),
            {
              refreshDeps: [t, s],
              cacheKey: "99plus-product-".concat(t, "-").concat(s),
            }
          ),
          [m, h] = (0, l.useState)(!1),
          x = Oe(o);
        return o
          ? (0, i.jsxs)("div", {
              className: r,
              children: [
                (0, i.jsx)(_.Q, { title: "权益详情页" }),
                (0, i.jsx)(Ae, { data: o }),
                (0, i.jsx)(f.R, { data: o }),
                (0, i.jsx)(j, {
                  disabled: x.disabled,
                  buttonText: x.text,
                  onButtonClick: (e) =>
                    "开通会员，立享权益" === e
                      ? (u.U.bpEverythingClick({
                          moduleName: "底部按钮",
                          pointPosition: "开通会员，立享权益",
                        }),
                        void v.x.navToPath("/99plus2"))
                      : "立即领取" === e
                      ? (u.U.bpEverythingClick({
                          moduleName: "底部按钮",
                          pointPosition: "立即领取",
                        }),
                        void h(!0))
                      : void (
                          "立即订购" === e &&
                          (u.U.bpEverythingClick({
                            moduleName: "底部按钮",
                            pointPosition: "立即订购",
                          }),
                          h(!0))
                        ),
                }),
                (0, i.jsx)(pe, {
                  data: o,
                  open: m,
                  onClose: () => {
                    h(!1);
                  },
                }),
              ],
            })
          : (0, i.jsx)(g.L, {});
      }
    },
    5168(e, t, s) {
      s.r(t), s.d(t, { ArrayMigu: () => n });
      var n = [];
    },
    99496(e, t, s) {
      s.d(t, { $: () => a, h: () => r });
      var n = s(13454),
        i = s(81566),
        l = s(2307),
        o = /^\d{6}\//;
      function a(e) {
        if (!e) return "";
        if (/^https?:\/\//i.test(e)) return e;
        var t = e.replace(/^\/+/, "");
        return (
          t.startsWith("images/rights/") && (t = t.slice("images/".length)),
          !t.startsWith("rights/") && o.test(t) && (t = "rights/".concat(t)),
          "".concat(gImgUrlPrefixLegacy, "/").concat(t)
        );
      }
      function r(e, t) {
        return (0, n._)(function* () {
          try {
            if ((0, i.D8)()) {
              try {
                l.t.savePhoto({ type: "1", data: e, phoneNum: t });
              } catch (e) {
                throw new Error("保存图片失败，请稍后重试");
              }
              return;
            }
            var s = e.startsWith("http")
                ? e
                : "".concat(window.location.origin).concat(e),
              o = yield fetch(s);
            if (!o.ok) throw new Error("图片加载失败");
            var a = yield o.blob(),
              r = window.URL.createObjectURL(a),
              c = document.createElement("a");
            (c.href = r),
              (c.download = t || "image_".concat(Date.now(), ".png")),
              (c.style.display = "none"),
              document.body.appendChild(c),
              c.click(),
              document.body.removeChild(c),
              window.URL.revokeObjectURL(r);
          } catch (s) {
            try {
              yield (function (e, t) {
                return (0, n._)(function* () {
                  return new Promise((s, n) => {
                    var i = new Image();
                    (i.crossOrigin = "anonymous"),
                      (i.onload = () => {
                        try {
                          var e = document.createElement("canvas");
                          (e.width = i.width), (e.height = i.height);
                          var l = e.getContext("2d");
                          if (!l)
                            return void n(new Error("无法创建 Canvas 上下文"));
                          l.drawImage(i, 0, 0),
                            e.toBlob(
                              (e) => {
                                if (e) {
                                  var i = window.URL.createObjectURL(e),
                                    l = document.createElement("a");
                                  (l.href = i),
                                    (l.download =
                                      t || "image_".concat(Date.now(), ".png")),
                                    (l.style.display = "none"),
                                    document.body.appendChild(l),
                                    l.click(),
                                    document.body.removeChild(l),
                                    window.URL.revokeObjectURL(i),
                                    s();
                                } else n(new Error("图片转换失败"));
                              },
                              "image/png",
                              1
                            );
                        } catch (e) {
                          n(e);
                        }
                      }),
                      (i.onerror = () => {
                        n(new Error("图片加载失败"));
                      }),
                      (i.src = e);
                  });
                })();
              })(e, t);
            } catch (e) {
              throw new Error("保存图片失败，请稍后重试");
            }
          }
        })();
      }
    },
    68520(e, t, s) {
      s.d(t, { Cd: () => a, Ld: () => l, jq: () => o });
      var n = s(93418),
        i = s(88827);
      function l(e) {
        var t = Number(e);
        return n.A(t) ? new i.A(t).times(100).toString() : "";
      }
      function o(e, t) {
        var s = new i.A(e),
          n = new i.A(t);
        if (s.lte(0) || n.lt(0)) throw new Error("价格必须是正数");
        if (n.gt(s)) throw new Error("优惠价不能高于原价");
        return s.minus(n).toFixed(2);
      }
      function a(e) {
        return new i.A(e).div(100).toFixed(2);
      }
    },
  },
]);
