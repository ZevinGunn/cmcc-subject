(self["webpackChunkcmcc_service_website"] =
  self["webpackChunkcmcc_service_website"] || []).push([
  [3064],
  {
    40588: function (e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, {
          default: function () {
            return f;
          },
        });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t("div", [
            e._m(0),
            e.isTouch
              ? e._e()
              : t("div", { staticClass: "login-out" }, [
                  t("span", { staticClass: "number" }, [
                    e._v(e._s(e.userInfo.phoneMask)),
                  ]),
                  t("span", { staticClass: "line" }),
                  t(
                    "span",
                    {
                      ref: "logoutBtn",
                      staticClass: "out-btn",
                      on: { click: e.logout },
                    },
                    [e._v("退出")]
                  ),
                ]),
          ]);
        },
        o = [
          function () {
            var e = this,
              t = e._self._c;
            return t("div", { staticClass: "bottom-img" }, [
              t("img", { attrs: { src: a(64156), alt: "" } }),
            ]);
          },
        ],
        i = (a(26699), a(15222)),
        r = a(51327),
        l = a(26294),
        s = a(42094),
        c = a(42642),
        u = a(26090),
        d = {
          name: "CommonFooter",
          computed: {
            ...(0, l.mapState)({
              userInfo: (e) => e.userInfo,
              isTouch: (e) => e.login.isTouch,
            }),
            ...(0, l.mapGetters)(["pageName"]),
          },
          methods: {
            logout() {
              this.traceClick(), (0, i.K8)();
              let e = (0, i.eY)("channelName"),
                t = r.FO && e && e.includes("appwechat_1");
              if (t) {
                let e = (0, i.$5)(window.location.href, "token");
                console.log("6项服务微信渠道登录状态保持", e),
                  (e = `https://wx.10086.cn/website/bind/unBindAppWechat?channelName=appwechat_1&redirectUrl=${encodeURIComponent(
                    e
                  )}`),
                  (window.location.href = e);
              } else window.location.reload();
            },
            traceClick() {
              (0, c.Z)("clk", {
                WT_envName: "退出",
                WT_event: u.ez["clk"][this.pageName] || "",
              });
            },
          },
          mounted() {
            this.isTouch ||
              (console.log("端外退出登录按钮 mounted"),
              this.$nextTick(() => {
                (0, s.L)({
                  element: this.$refs.logoutBtn,
                  handler: (e) => {
                    if (e)
                      return (
                        console.log("端外退出登录按钮 traceImp"),
                        (0, c.Z)("imp", {
                          WT_envName: "退出",
                          WT_event: u.ez["imp"][this.pageName] || "",
                        }),
                        !0
                      );
                  },
                });
              }));
          },
        },
        m = d,
        p = a(1001),
        h = (0, p.Z)(m, n, o, !1, null, "1b6ec25a", null),
        f = h.exports;
    },
    87169: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return I;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            {
              staticClass: "common-header",
              class: { care: e.isCare, "skin-mode": e.hasSkin },
            },
            [
              e.hasSkin
                ? t("div", {
                    staticClass: "immersion-title",
                    style: { height: e.statusBarHeight },
                    attrs: { "data-html2canvas-ignore": "" },
                  })
                : e._e(),
              e._t("market"),
              t(
                "div",
                {
                  staticClass: "header-content",
                  class: e.isLite ? "header-content-lite" : "",
                },
                [
                  t("div", { staticClass: "header-bg" }),
                  e.isLite
                    ? e._e()
                    : t(
                        "user-info",
                        e._b(
                          {
                            attrs: { "has-skin": e.isSkinPage },
                            scopedSlots: e._u(
                              [
                                {
                                  key: "sensitiveInfo",
                                  fn: function () {
                                    return [e._t("sensitiveInfo")];
                                  },
                                  proxy: !0,
                                },
                                {
                                  key: "topExtra",
                                  fn: function () {
                                    return [e._t("topExtra")];
                                  },
                                  proxy: !0,
                                },
                                {
                                  key: "gotone",
                                  fn: function () {
                                    return [e._t("gotone")];
                                  },
                                  proxy: !0,
                                },
                              ],
                              null,
                              !0
                            ),
                          },
                          "user-info",
                          e.$attrs,
                          !1
                        )
                      ),
                  e._t("extra"),
                ],
                2
              ),
              e._t("default"),
            ],
            2
          );
        },
        o = [],
        i =
          (a(26699),
          function () {
            var e = this,
              t = e._self._c;
            return t(
              "div",
              { class: e.isCare ? "userInfo-care" : "userInfo" },
              [
                t(
                  "div",
                  { staticClass: "info-top" },
                  [
                    e._t("sensitiveInfo", function () {
                      return [
                        e.isCare
                          ? [
                              e.isLoginWithUserInfo
                                ? t(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "speech",
                                          rawName: "v-speech",
                                          value: e.readPhone,
                                          expression: "readPhone",
                                        },
                                      ],
                                      staticClass: "phoneNumber",
                                    },
                                    [e._v(e._s(e.userInfo.phoneMask))]
                                  )
                                : e._e(),
                              "loadCompleted" !== e.userInformationLoadState
                                ? t("dot-loading", {
                                    attrs: {
                                      "has-skin": e.hasSkin,
                                      size: "big",
                                    },
                                  })
                                : t("span", { staticClass: "name" }, [
                                    e._v(e._s(e.userName)),
                                  ]),
                            ]
                          : [
                              e.isLoginWithUserInfo
                                ? t("span", { staticClass: "phoneNumber" }, [
                                    e._v(e._s(e.userInfo.phoneMask)),
                                  ])
                                : e._e(),
                              "loadCompleted" !== e.userInformationLoadState
                                ? t("dot-loading", {
                                    attrs: { "has-skin": e.hasSkin },
                                  })
                                : t("span", { staticClass: "name" }, [
                                    e._v(e._s(e.userName)),
                                  ]),
                              e._t("topExtra"),
                            ],
                      ];
                    }),
                  ],
                  2
                ),
                e._t("gotone", function () {
                  return [
                    e.showBrandAndStarLevel
                      ? t(
                          "div",
                          { staticClass: "info-bottom" },
                          [
                            e.brandImg
                              ? [
                                  e.brandFlexibleData && e.isGotone
                                    ? t(
                                        "market-point",
                                        {
                                          attrs: {
                                            "flexible-data": e.flexibleImpData(
                                              e.brandFlexibleData
                                            ),
                                            "inline-block": "",
                                          },
                                        },
                                        [
                                          t("img", {
                                            staticClass: "tags",
                                            attrs: { src: e.brandImg, alt: "" },
                                            on: { click: e.brandClick },
                                          }),
                                        ]
                                      )
                                    : t("img", {
                                        staticClass: "tags",
                                        attrs: { src: e.brandImg, alt: "" },
                                        on: { click: e.brandClick },
                                      }),
                                ]
                              : e._e(),
                            e.showStarLevel
                              ? t("img", {
                                  staticClass: "tags",
                                  attrs: { src: e.starLevelImg, alt: "" },
                                })
                              : e._e(),
                          ],
                          2
                        )
                      : e._e(),
                  ];
                }),
              ],
              2
            );
          }),
        r = [],
        l = a(26294),
        s = a(15222),
        c = a(15744),
        u = a(72856),
        d = a(76322),
        m = a(9768);
      u["default"].registerModule("userInformation", d.Z);
      var p = {
          name: "UserInfoUnified",
          components: { DotLoading: m.Z },
          props: {
            brandFlexibleData: null,
            hasSkin: { type: Boolean, default: !1 },
          },
          data() {
            return {};
          },
          computed: {
            ...(0, l.mapState)({
              userInfo: (e) => e.userInfo,
              isTouch: (e) => e.login.isTouch,
              websiteTarget: (e) => e.websiteTarget,
              hideStarProvince: (e) => e.remoteState.WMH_APP_hide_star_province,
            }),
            ...(0, l.mapState)("userInformation", {
              userName: (e) => e.userName,
              gsmState: (e) => e.gsmState,
              userBrand: (e) => e.userBrand,
              starLevel: (e) => e.starLevel,
              userInformationLoadState: (e) => e.userInformationLoadState,
            }),
            ...(0, l.mapGetters)([
              "pageGroup",
              "pageName",
              "isLoginWithUserInfo",
            ]),
            isCare() {
              return "care" === this.pageGroup;
            },
            isGotone() {
              return ["0", "1", "2", "3", "4", "5", "8"].includes(
                this.gsmState
              );
            },
            brandImg() {
              let e = this.isCare ? "-care" : "",
                t = "";
              switch (
                (e
                  ? (t = "-care")
                  : this.brandFlexibleData && this.isGotone && (t = "-arrow"),
                this.gsmState)
              ) {
                case "0":
                case "1":
                case "2":
                case "3":
                  return (0, s.av)(
                    `/cmcc-service/img/app/brand${this.gsmState}${t}.png?t=20240830`
                  );
                case "4":
                case "5":
                  return (0, s.av)(`/cmcc-service/img/app/brand4${t}.png`);
                case "8":
                  return (0, s.av)(`/cmcc-service/img/app/brand8${t}.png`);
                default:
                  return "03" === this.userBrand
                    ? (0, s.av)(
                        `/cmcc-service/img/app/brand-donggandidai${t}.png`
                      )
                    : "";
              }
            },
            starLevelImg() {
              let e = this.isCare ? "-care" : "";
              switch (this.starLevel) {
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                  return (0, s.av)(
                    `/cmcc-service/img/app/starLevel${this.starLevel}${e}.png`
                  );
                default:
                  return "";
              }
            },
            readPhone() {
              return this.userInfo.phoneMask
                ? `尊敬的${
                    this.isGotone ? "全球通用户" : "用户"
                  }，您好，您的手机尾号${this.userInfo.phoneMask.slice(-4)}`
                : "";
            },
            hiddenStar() {
              return JSON.parse(this.hideStarProvince).includes(
                this.userInfo.loginProvince
              );
            },
            showBrandAndStarLevel() {
              let {
                userInformationLoadState: e,
                adverListLoadState: t,
                showStarLevel: a,
                brandImg: n,
              } = this;
              return (
                "loadCompleted" === e &&
                ["loadCompleted", "loadError"].includes(t) &&
                (a || n)
              );
            },
            showStarLevel() {
              let { starLevelImg: e, hiddenStar: t, isGotone: a } = this;
              return e && !t && !a;
            },
            adverListLoadState() {
              var e, t;
              return "app" === this.websiteTarget &&
                ["main", "care"].includes(this.pageGroup) &&
                null !== (e = this.$store.state) &&
                void 0 !== e &&
                null !== (t = e.market) &&
                void 0 !== t &&
                t.adverListLoadState
                ? this.$store.state.market.adverListLoadState
                : "loadCompleted";
            },
          },
          methods: {
            flexibleImpData(e) {
              var t, a, n;
              let o = Object.assign({}, e);
              return (
                (o.otherParams = {
                  WT_area_type_1: "楼层",
                  WT_area_type_2: "个人信息区",
                  area_id:
                    (null === (t = c.Z[this.pageName]) ||
                    void 0 === t ||
                    null === (a = t.areaId) ||
                    void 0 === a ||
                    null === (n = a.fixedId) ||
                    void 0 === n
                      ? void 0
                      : n[0]) + "_",
                  WT_area_name: "个人信息区",
                  XY_env_type: "button",
                }),
                o
              );
            },
            brandClick() {
              var e, t, a, n;
              console.log("brandClick-统建", this.brandFlexibleData);
              let o = {
                WT_area_type_1: "楼层",
                WT_area_type_2: "个人信息区",
                WT_area_name: "个人信息区",
                XY_env_type: "button",
                XY_gd_source:
                  null === (e = this.brandFlexibleData) || void 0 === e
                    ? void 0
                    : e.source,
                area_id:
                  (null === (t = c.Z[this.pageName]) ||
                  void 0 === t ||
                  null === (a = t.areaId) ||
                  void 0 === a ||
                  null === (n = a.fixedId) ||
                  void 0 === n
                    ? void 0
                    : n[0]) + "_",
              };
              "app" === this.websiteTarget &&
                this.brandFlexibleData &&
                this.isGotone &&
                this.marketSectionClick(this.brandFlexibleData, {
                  otherTraceParams: o,
                });
            },
          },
        },
        h = p,
        f = a(1001),
        g = (0, f.Z)(h, i, r, !1, null, "20fc8f7e", null),
        v = g.exports,
        A = a(6648),
        y = {
          name: "CommonHeaderUnified",
          components: { UserInfo: v },
          props: { isLite: { type: Boolean, default: !1 } },
          data() {
            return {};
          },
          computed: {
            ...(0, l.mapState)({
              isTouch: (e) => e.login.isTouch,
              websiteTarget: (e) => e.websiteTarget,
            }),
            ...(0, l.mapGetters)(["pageGroup", "pageName"]),
            isCare() {
              return (
                "app" === this.websiteTarget &&
                "care" === this.$store.getters.pageGroup
              );
            },
            hasSkin() {
              return this.isTouch && this.isSkinPage;
            },
            statusBarHeight() {
              var e;
              if (this.hasSkin)
                return null === (e = this.$store.state.skin) || void 0 === e
                  ? void 0
                  : e.statusBarHeight;
            },
            isSkinPage() {
              let e = [
                "main/balanceQuery",
                "main/businessQuery",
                "main/detailQuery",
                "main/marginQuery",
                "main/myPackage",
                "main/phoneBills",
                "care/phoneBills",
                "care/marginQuery",
                "care/balanceQuery",
                "care/businessQuery",
              ];
              return (
                "lite" === this.pageGroup ||
                e.includes(`${this.pageGroup}/${this.pageName}`)
              );
            },
          },
          mounted() {
            this.isTouch &&
              !this.isSkinPage &&
              (0, A.lZ)({
                debug: !1,
                bkColor: "#DCF0FF",
                txtColor: "#000000",
                iconType: "1",
              });
          },
        },
        T = y,
        S = (0, f.Z)(T, n, o, !1, null, "451e6fef", null),
        I = S.exports;
    },
    53932: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return c;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t("span", {
            staticClass: "confirm-loading-circle",
            class: `confirm-loading-circle-${e.size}`,
          });
        },
        o = [],
        i = {
          name: "ConfirmButtonLoading",
          props: { size: { type: String, default: "normal" } },
        },
        r = i,
        l = a(1001),
        s = (0, l.Z)(r, n, o, !1, null, "e59b4efe", null),
        c = s.exports;
    },
    9768: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return c;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            {
              staticClass: "dot-loading-wrap",
              class: `dot-loading-color-${e.color} dot-loading-size-${e.size} ${
                e.hasSkin && "skin-mode"
              }`,
            },
            [
              t("div", { staticClass: "dot-loading-item" }),
              t("div", { staticClass: "dot-loading-item" }),
              t("div", { staticClass: "dot-loading-item" }),
            ]
          );
        },
        o = [],
        i = {
          name: "dotLoading",
          props: {
            color: { type: String, default: "gray" },
            size: { type: String, default: "normal" },
            hasSkin: { type: Boolean, default: !1 },
          },
        },
        r = i,
        l = a(1001),
        s = (0, l.Z)(r, n, o, !1, null, "42a2902c", null),
        c = s.exports;
    },
    60091: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return C;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return e.isLogin || e.isExternalEnvironment
            ? t(
                "div",
                [
                  e.isHighRisk
                    ? t(
                        "div",
                        { staticClass: "face-auth-guard" },
                        [
                          t(e.currentScreenComponent, { tag: "component" }),
                          t(
                            "popup",
                            {
                              attrs: {
                                round: "",
                                "get-container": "body",
                                "close-on-click-overlay": !1,
                                "overlay-style": {
                                  "background-color": "rgba(0, 0, 0, 0.6)",
                                },
                              },
                              model: {
                                value: e.showPopup,
                                callback: function (t) {
                                  e.showPopup = t;
                                },
                                expression: "showPopup",
                              },
                            },
                            [
                              t(
                                "div",
                                {
                                  class: [
                                    "pop-content",
                                    {
                                      "pop-content-care":
                                        "care" === e.pageGroup,
                                    },
                                  ],
                                },
                                [
                                  t("div", { staticClass: "title-wrap" }, [
                                    e._v("安全提示"),
                                  ]),
                                  e.supportFaceAuth
                                    ? t(
                                        "div",
                                        {
                                          staticClass: "face-auth-content-wrap",
                                        },
                                        [
                                          t(
                                            "div",
                                            { staticClass: "text-content" },
                                            [
                                              e._v(
                                                " 您好！系统检测到您的" +
                                                  e._s(
                                                    e.phoneNum.replace(
                                                      /(\d{3})\d{4}(\d{4})/,
                                                      "$1****$2"
                                                    )
                                                  ) +
                                                  "手机号码当前处于高风险登录环境，请输入"
                                              ),
                                              t("span", [e._v("姓名")]),
                                              e._v("、"),
                                              t("span", [e._v("身份证号")]),
                                              e._v("，并开启"),
                                              t("span", [e._v("相机权限")]),
                                              e._v(
                                                "进行身份验证，以继续使用当前服务。 "
                                              ),
                                            ]
                                          ),
                                          t(
                                            "div",
                                            { staticClass: "input-content" },
                                            [
                                              t(
                                                "div",
                                                { staticClass: "input-name" },
                                                [
                                                  t("input", {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model.trim",
                                                        value: e.nameValue,
                                                        expression: "nameValue",
                                                        modifiers: { trim: !0 },
                                                      },
                                                    ],
                                                    attrs: {
                                                      type: "text",
                                                      placeholder: "请输入姓名",
                                                    },
                                                    domProps: {
                                                      value: e.nameValue,
                                                    },
                                                    on: {
                                                      input: function (t) {
                                                        t.target.composing ||
                                                          (e.nameValue =
                                                            t.target.value.trim());
                                                      },
                                                      blur: function (t) {
                                                        return e.$forceUpdate();
                                                      },
                                                    },
                                                  }),
                                                ]
                                              ),
                                              t(
                                                "div",
                                                { staticClass: "input-number" },
                                                [
                                                  t("input", {
                                                    directives: [
                                                      {
                                                        name: "model",
                                                        rawName: "v-model.trim",
                                                        value: e.idCardValue,
                                                        expression:
                                                          "idCardValue",
                                                        modifiers: { trim: !0 },
                                                      },
                                                    ],
                                                    attrs: {
                                                      type: "text",
                                                      placeholder:
                                                        "请输入身份证号",
                                                      maxlength: "18",
                                                    },
                                                    domProps: {
                                                      value: e.idCardValue,
                                                    },
                                                    on: {
                                                      input: function (t) {
                                                        t.target.composing ||
                                                          (e.idCardValue =
                                                            t.target.value.trim());
                                                      },
                                                      blur: function (t) {
                                                        return e.$forceUpdate();
                                                      },
                                                    },
                                                  }),
                                                ]
                                              ),
                                            ]
                                          ),
                                          e.errorTipText
                                            ? t(
                                                "div",
                                                {
                                                  staticClass:
                                                    "error-tip-content",
                                                },
                                                [
                                                  e._v(
                                                    " " +
                                                      e._s(e.errorTipText) +
                                                      " "
                                                  ),
                                                ]
                                              )
                                            : e._e(),
                                          t(
                                            "div",
                                            { staticClass: "policy-content" },
                                            [
                                              t("div", {
                                                class: [
                                                  "policy-icon",
                                                  {
                                                    "policy-selected-icon":
                                                      e.policySelected,
                                                  },
                                                ],
                                                on: {
                                                  click: function (t) {
                                                    return (
                                                      t.stopPropagation(),
                                                      e.changeSelected.apply(
                                                        null,
                                                        arguments
                                                      )
                                                    );
                                                  },
                                                },
                                              }),
                                              t(
                                                "div",
                                                { staticClass: "policy-text" },
                                                [
                                                  e._v(
                                                    " 本人同意授权开启相机权限，并将姓名、身份证号及面部识别信息用于人脸识别验证，已阅读并同意"
                                                  ),
                                                  t(
                                                    "span",
                                                    {
                                                      on: {
                                                        click: e.jumpToNewPage,
                                                      },
                                                    },
                                                    [
                                                      e._v(
                                                        "《实名认证服务隐私协议》"
                                                      ),
                                                    ]
                                                  ),
                                                ]
                                              ),
                                            ]
                                          ),
                                        ]
                                      )
                                    : t(
                                        "div",
                                        { staticClass: "text-content-wrap" },
                                        [
                                          e._v(
                                            " 您好！系统检测到您的" +
                                              e._s(
                                                e.phoneNum.replace(
                                                  /(\d{3})\d{4}(\d{4})/,
                                                  "$1****$2"
                                                )
                                              ) +
                                              "手机号码当前处于高风险登录环境，为保障账户安全，请升级APP版本后重试。 "
                                          ),
                                        ]
                                      ),
                                  e.supportFaceAuth
                                    ? t(
                                        "div",
                                        { staticClass: "face-auth-btn-wrap" },
                                        [
                                          t(
                                            "div",
                                            {
                                              staticClass: "cancel-btn",
                                              on: {
                                                click: function (t) {
                                                  return (
                                                    t.stopPropagation(),
                                                    e.closePage.apply(
                                                      null,
                                                      arguments
                                                    )
                                                  );
                                                },
                                              },
                                            },
                                            [e._v("取消")]
                                          ),
                                          t(
                                            "div",
                                            {
                                              class: [
                                                "confirm-btn",
                                                {
                                                  "confirm-verify-btn":
                                                    e.isClickable,
                                                },
                                              ],
                                              on: {
                                                click: function (t) {
                                                  return (
                                                    t.stopPropagation(),
                                                    e.queryRealNameAuthInfo.apply(
                                                      null,
                                                      arguments
                                                    )
                                                  );
                                                },
                                              },
                                            },
                                            [e._v(" 确认 ")]
                                          ),
                                        ]
                                      )
                                    : t(
                                        "div",
                                        { staticClass: "text-btn-wrap" },
                                        [
                                          t(
                                            "div",
                                            {
                                              staticClass: "know-btn",
                                              on: {
                                                click: function (t) {
                                                  return (
                                                    t.stopPropagation(),
                                                    e.closePage.apply(
                                                      null,
                                                      arguments
                                                    )
                                                  );
                                                },
                                              },
                                            },
                                            [e._v("知道了")]
                                          ),
                                        ]
                                      ),
                                ]
                              ),
                            ]
                          ),
                        ],
                        1
                      )
                    : [e._t("default")],
                ],
                2
              )
            : e._e();
        },
        o = [],
        i = (a(20058), a(36695)),
        r = a(26294),
        l = a(75150),
        s = a(72856),
        c = a(51327),
        u = (a(26699), a(15222)),
        d = a(6648),
        m = a(53306);
      async function p() {
        try {
          const e = s["default"].state.login.isTouch,
            t =
              "1" ===
              s["default"].state.remoteState.CMCC_Not_FaceAuth_WhiteList_Result,
            a = h(
              s["default"].state.remoteState.CMCC_Face_Auth_Page_Rules,
              s["default"].state.userInfo.loginProvince,
              s["default"].state.userInfo.loginCity,
              s["default"].getters.pageGroup,
              s["default"].getters.pageName
            );
          if (
            (console.log("人脸白名单", t),
            console.log(
              "人脸省市区",
              s["default"].state.remoteState.CMCC_Face_Auth_Page_Rules
            ),
            console.log("人脸前置判断", !e, t, !a),
            !e || t || !a)
          )
            return !1;
          const n = s["default"].state.userInfo.version;
          if (
            (console.log("人脸版本号", n),
            console.log("人脸版本号比较", -1 === (0, u.yC)(n, "12.0.8")),
            -1 === (0, u.yC)(n, "12.0.8") &&
              (console.log(
                "人脸登陆方式",
                s["default"].state.userInfo.loginType
              ),
              !["1001", "1002"].includes(
                s["default"].state.userInfo.loginType
              )))
          )
            return console.log("人脸非短信登录不弹窗"), !1;
          const o = await (0, d.XH)();
          console.log("人脸本机号码", o);
          let i =
            (null === o || void 0 === o ? void 0 : o.resultSimPhoneNumber) ===
            s["default"].state.userInfo.phoneNumber;
          if ((console.log("人脸本机号码比对结果", i), i)) return !1;
          const r = await (0, d.ww)({
            debug: !1,
            key: `FaceAuth_${(0, m.MD5)(
              s["default"].state.userInfo.phoneNumber
            )}_timestamp`,
          });
          if (
            (console.log("人脸认证记录", r), r && r.value && (0, u.D8)(r.value))
          ) {
            const e = Date.now(),
              t = Number(r.value);
            console.log("人脸verifyTime", t);
            const a = Number(
              s["default"].state.remoteState.CMCC_Face_Auth_Validity || 0
            );
            console.log("人脸validityDays", a);
            const n = t + 24 * a * 60 * 60 * 1e3;
            if ((console.log("人脸expireTime", n), e < n))
              return console.log("人脸有效期内", e, n), !1;
          }
          let l = !0;
          return console.log("人脸弹窗最终条件", !i && l), !i && l;
        } catch (e) {
          return console.log("shouldInterceptWithFaceAuth failed", e), !1;
        }
      }
      function h(e, t, a, n, o) {
        try {
          var i, r, l;
          let s;
          s = JSON.parse(e);
          const c =
            null === (i = s) ||
            void 0 === i ||
            null === (r = i[n]) ||
            void 0 === r ||
            null === (l = r[o]) ||
            void 0 === l
              ? void 0
              : l[t];
          if (!c) return !1;
          const u = c.split(",");
          return u.includes("all") || u.includes(a);
        } catch {
          return !1;
        }
      }
      function f(e) {
        (0, d.kv)({
          debug: !1,
          key: `FaceAuth_${(0, m.MD5)(
            s["default"].state.userInfo.phoneNumber
          )}_timestamp`,
          value: e,
        });
      }
      var g = a(44830),
        v = a(42642),
        A = a(14034),
        y = a(76507),
        T = {
          name: "FaceAuthGuard",
          components: { Popup: i.Z },
          data() {
            return {
              isHighRisk: !0,
              currentScreenComponent: null,
              phoneNum: "",
              showPopup: !1,
              supportFaceAuth: !1,
              nameValue: "",
              idCardValue: "",
              errorTipText: "",
              policySelected: !1,
              isConfirming: !1,
              isExternalEnvironment: !1,
            };
          },
          computed: {
            ...(0, r.mapState)({
              isTouch: (e) => e.login.isTouch,
              isLogin: (e) => e.login.isLogin,
              userInfo: (e) => e.userInfo,
            }),
            ...(0, r.mapGetters)(["pageName", "pageGroup"]),
            isClickable() {
              return (
                this.nameValue &&
                (18 === this.idCardValue.length ||
                  15 === this.idCardValue.length) &&
                this.policySelected
              );
            },
          },
          mounted() {
            this.initAuth(),
              document.addEventListener("visibilitychange", () => {
                console.log("监听人脸 document.hidden", document.hidden),
                  document.hidden ||
                    (console.log("人脸页面变为可见状态，重新触发验证"),
                    this.initAuth());
              });
          },
          methods: {
            async initAuth() {
              if (
                ((this.showPopup = !1),
                -1 === navigator.userAgent.indexOf("leadeon"))
              )
                return (
                  (this.isExternalEnvironment = !0), (this.isHighRisk = !1), !1
                );
              if (
                (await (0, l.Z)("login", () =>
                  s["default"].dispatch("login/login")
                ),
                (this.isHighRisk = await p()),
                console.log("人脸isHighRisk", this.isHighRisk),
                this.isHighRisk)
              ) {
                await this.loadComponent(this.pageGroup, this.pageName),
                  (this.phoneNum = s["default"].state.userInfo.phoneNumber);
                const e = this.userInfo.version,
                  t = 1 !== (0, u.yC)(e, "11.6.0"),
                  a = c.UB && 1 !== (0, u.yC)(e, "11.1.0");
                (this.supportFaceAuth = t || a),
                  (this.showPopup = !0),
                  this.insertCode("imp", { WT_envName: "弹出" });
              }
            },
            async queryRealNameAuthInfo() {
              if (((this.errorTipText = ""), !this.isClickable)) return;
              if (this.isConfirming) return;
              this.isConfirming = !0;
              const e =
                  "系统遇到小问题，部分功能暂无法使用，请稍后再试。给您带来不便，敬请谅解~",
                t = "系统遇到小问题，请稍后再试。给您带来不便，敬请谅解~",
                a =
                  "系统遇到小问题，正在紧急修复中，请稍后再试。给您带来不便，敬请谅解~";
              try {
                let o = await (0, y.EM)(() =>
                  (0, A.Zo)({
                    provCode: this.userInfo.loginProvince,
                    custName: this.nameValue,
                    custCertNo: this.idCardValue,
                  })
                );
                if ("000000" === o.retCode && o.rspBody) {
                  let a = o.rspBody.encodeParams,
                    {
                      requestSource: i,
                      transactionID: r,
                      param: l,
                      signature: s,
                    } = a;
                  if (i && r && l && s)
                    try {
                      console.log("人脸验证入参", {
                        requestSource: i,
                        transactionId: r,
                        params: l,
                        signature: s,
                      });
                      let e = await (0, d.VG)({
                        requestSource: i,
                        transactionId: r,
                        params: l,
                        signature: s,
                      });
                      e && 0 === Number(e.resCode)
                        ? (f(Date.now().toString()), (this.isHighRisk = !1))
                        : (this.errorTipText = "身份验证失败，请重试~");
                    } catch (n) {
                      console.log("facialVerification error", n),
                        (this.errorTipText = e);
                    }
                  else
                    console.log("人脸认证入参不完整"), (this.errorTipText = t);
                } else
                  "500002" === o.retCode
                    ? (this.errorTipText = a)
                    : (this.errorTipText = o.retDesc || t);
              } catch (n) {
                console.log("queryRealNameAuthInfo error", n),
                  (this.errorTipText = t);
              } finally {
                this.insertCode("clk", {
                  XY_env_type: "button",
                  WT_envName: "确认",
                }),
                  setTimeout(() => {
                    this.isConfirming = !1;
                  }, 300);
              }
            },
            changeSelected() {
              (this.policySelected = !this.policySelected),
                this.insertCode("clk", {
                  XY_env_type: "button",
                  WT_envName: this.policySelected ? "勾选协议" : "取消勾选",
                });
            },
            closePage() {
              this.insertCode("clk", {
                XY_env_type: "button",
                WT_envName: this.supportFaceAuth ? "取消" : "知道了",
              }),
                (0, d.dM)();
            },
            jumpToNewPage() {
              let e =
                "care" === this.pageGroup
                  ? "https://wx.10086.cn/cmcc-service/app-pages/extra/realNameAuthPrivacyAgreementCare"
                  : "https://wx.10086.cn/cmcc-service/app-pages/extra/realNameAuthPrivacyAgreement";
              this.insertCode("clk", {
                XY_env_type: "button",
                WT_envName: "实名认证服务隐私协议",
                WT_next_url: e,
              }),
                g.Z.go({ url: e });
            },
            async loadComponent(e, t) {
              try {
                const n = {
                    main: {
                      myPackage: () => a.e(7375).then(a.bind(a, 87375)),
                      marginQuery: () => a.e(6762).then(a.bind(a, 56762)),
                      phoneBills: () => a.e(2534).then(a.bind(a, 32534)),
                      businessQuery: () => a.e(1643).then(a.bind(a, 71643)),
                    },
                    care: {
                      marginQuery: () => a.e(2748).then(a.bind(a, 22748)),
                      phoneBills: () => a.e(4326).then(a.bind(a, 54326)),
                      businessQuery: () => a.e(773).then(a.bind(a, 20773)),
                    },
                  },
                  o = n[e][t],
                  i = await o();
                this.currentScreenComponent = i.default || i;
              } catch {
                this.currentScreenComponent = null;
              }
            },
            insertCode(e, t) {
              (0, v.Z)(e, {
                ...t,
                WT_et: e,
                WT_area_type_1: "弹窗",
                WT_area_type_2: "安全提示",
                WT_area_name: this.supportFaceAuth
                  ? "人脸认证前置信息输入"
                  : "版本升级",
              });
            },
          },
        },
        S = T,
        I = a(1001),
        b = (0, I.Z)(S, n, o, !1, null, "cb2f7fda", null),
        C = b.exports;
    },
    23901: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return v;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "container" },
            [
              e.isCanPullApp
                ? e._e()
                : t("div", { staticClass: "top-text" }, [
                    "1" === e.textType
                      ? t("div", [e._v("更多" + e._s(e.moreText))])
                      : t("div", [e._v("能力升级中...")]),
                  ]),
              e.isCanPullApp
                ? t(
                    "pull-app-point",
                    e._b(
                      {
                        attrs: {
                          urlParams: e.urlParams,
                          channelId: e.channelId,
                        },
                        on: { launchClick: e.launchClick },
                      },
                      "pull-app-point",
                      { pullingTypeLocation: "5" },
                      !1
                    ),
                    [
                      t("div", { staticClass: "btn-wrap" }, [
                        t("img", {
                          staticClass: "icon",
                          attrs: { src: a(18147), alt: "" },
                        }),
                        t("div", { staticClass: "btn-text" }, [
                          e._v(
                            " " +
                              e._s(
                                "1" === e.textType
                                  ? `更多${e.moreText}`
                                  : "能力升级中..."
                              ) +
                              "，请前往中国移动APP" +
                              e._s("1" === e.textType ? "" : "查看") +
                              " "
                          ),
                        ]),
                      ]),
                    ]
                  )
                : "1" === e.textType
                ? t("div", { staticClass: "btn-wrap-none pb-25" }, [
                    e._v(" 可前往"),
                    t("span", { staticClass: "text-blue" }, [
                      e._v("中国移动APP"),
                    ]),
                    e._v("查看 "),
                  ])
                : "2" === e.textType
                ? t("div", { staticClass: "btn-wrap-none" }, [
                    e._v(" 可前往"),
                    t("span", { staticClass: "text-blue" }, [
                      e._v("中国移动APP"),
                    ]),
                    e._v("使用 "),
                    t("div", [e._v(e._s(e.moreText) + "服务")]),
                  ])
                : e._e(),
            ],
            1
          );
        },
        o = [],
        i = (a(26699), a(26294)),
        r = a(87630),
        l = a(88922),
        s = a(42642),
        c = a(15222),
        u = a(26090);
      let d = {
        balanceQuery: {
          moreText: "余额明细",
          name: "余额查询",
          WT_area_type_2: "余额明细区",
        },
        phoneBills: { moreText: "账单解读", name: "账单查询" },
        myPackage: {
          moreText0: "套餐详情",
          moreText1: "宽带、电视详情",
          name: "我的套餐",
          WT_area_type_2: "套餐明细区",
        },
        businessQuery: {
          moreText: "已订业务查询",
          name: "已订业务",
          WT_area_type_2: "业务明细区",
        },
        detailQuery: { moreText: "详单查询", name: "详单查询" },
        marginQuery: {
          moreText0: "流量明细",
          moreText1: "通话明细",
          moreText2: "短彩信明细",
          moreText3: "余量明细",
          name: "余量查询",
          WT_area_type_2: "余量明细区",
        },
      };
      const m = window.location.pathname.split("/").pop();
      var p = {
          name: "HideDetailButton",
          components: { PullAppPoint: r.Z },
          data() {
            return { appConfig: {}, isCanPullApp: (0, l.c5)() };
          },
          props: {
            tabActiveIndex: { type: Number, default: 0 },
            tabName: { type: String, default: "" },
            urlParams: { type: String, default: "" },
          },
          computed: {
            ...(0, i.mapState)({
              pullingWayData: (e) => e.common.pullingWayData,
            }),
            textType() {
              return ["businessQuery", "detailQuery"].includes(m) ? "2" : "1";
            },
            moreText() {
              return ["marginQuery", "myPackage"].includes(m)
                ? d[m]["moreText" + this.tabActiveIndex] || ""
                : d[m].moreText || "";
            },
            channelId() {
              return (0, c.eY)("channelId");
            },
            pageIdValue() {
              return u.Z9[this.$store.getters.pageName];
            },
            targetUrlValue() {
              let e = `${window.location.origin}${window.location.pathname}?pageId=${this.pageIdValue}&channelId=${this.channelId}`;
              return this.urlParams ? `${e}&${this.urlParams}` : e;
            },
          },
          mounted() {
            this.setImpTrace(), console.log("urlParams", this.urlParams);
          },
          methods: {
            setImpTrace() {
              let e = this.genTraceParam();
              console.log("setImpTrace", e), (0, s.Z)("imp", e);
            },
            launchClick() {
              let e = this.genTraceParam();
              console.log("launchClickTrace", e), (0, s.Z)("clk", e);
            },
            genTraceParam() {
              let e = {
                WT_page_type: "服务功能",
                WT_area_type_1: "楼层",
                WT_area_type_2: d[m].WT_area_type_2,
                WT_area_name: this.tabName || "",
                XY_env_type: this.isCanPullApp ? "button" : "pic",
                WT_envName: "请前往中国移动APP",
                WT_channelid: this.channelId,
                WT_pageid: (0, c.eY)("pageId"),
                WT_next_url: this.isCanPullApp ? this.targetUrlValue : "",
                XY_env_extend_attribute: this.getExtend_attribute(),
                XY_env_class: "APP引流",
              };
              return e;
            },
            getExtend_attribute() {
              let e = navigator.userAgent.toLowerCase();
              return e.includes("micromessenger")
                ? "微信拉端"
                : e.includes("alipay")
                ? "支付宝拉端"
                : "独立微门户拉端";
            },
          },
        },
        h = p,
        f = a(1001),
        g = (0, f.Z)(h, n, o, !1, null, "ee38b4d2", null),
        v = g.exports;
    },
    23082: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return b;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "idAuth-wrap" },
            [
              t("div", { staticClass: "title" }, [e._v("身份认证")]),
              t("div", { staticClass: "phone-number" }, [
                e._v(e._s(e._f("numFilter")(e.userInfo.phoneNumber))),
              ]),
              t(
                "field",
                {
                  staticClass: "field passwd-field",
                  attrs: {
                    inputmode: "numeric",
                    pattern: "[0-9]*",
                    border: !1,
                    placeholder: "请输入服务密码",
                    maxlength: "8",
                    type: "text",
                    autocomplete: "off",
                  },
                  model: {
                    value: e.passwd,
                    callback: function (t) {
                      e.passwd = t;
                    },
                    expression: "passwd",
                  },
                },
                [
                  e.forgetPasswordLink
                    ? t(
                        "div",
                        {
                          staticClass: "forget-btn",
                          attrs: { slot: "button" },
                          on: { click: e.jumpPasswordLink },
                          slot: "button",
                        },
                        [e._v("忘记密码?")]
                      )
                    : e._e(),
                ]
              ),
              t(
                "field",
                {
                  staticClass: "field sms-field",
                  attrs: {
                    border: !1,
                    type: "number",
                    placeholder: "请输入短信验证码",
                    maxlength: "6",
                  },
                  model: {
                    value: e.mesCode,
                    callback: function (t) {
                      e.mesCode = t;
                    },
                    expression: "mesCode",
                  },
                },
                [
                  t(
                    "div",
                    {
                      staticClass: "sms-send-btn",
                      attrs: { slot: "extra" },
                      on: { click: e.getSmsCode },
                      slot: "extra",
                    },
                    [e._v(e._s(e.smsSendBtnName))]
                  ),
                ]
              ),
              t("div", { staticClass: "agreement" }, [
                t("div", { on: { click: e.changeCheckAgreement } }, [
                  e.isCheckAgreement
                    ? t("img", {
                        staticClass: "select-icon",
                        attrs: { src: a(27693), alt: "" },
                      })
                    : t("img", {
                        staticClass: "select-icon",
                        attrs: { src: a(32957), alt: "" },
                      }),
                ]),
                t("div", { staticClass: "text" }, [
                  e._v(" 查看并同意"),
                  t(
                    "span",
                    {
                      staticClass: "name",
                      on: {
                        click: function (t) {
                          return e.viewPolicy("service");
                        },
                      },
                    },
                    [e._v("《服务协议》")]
                  ),
                  e._v("、"),
                  t(
                    "span",
                    {
                      staticClass: "name",
                      on: {
                        click: function (t) {
                          return e.viewPolicy("children");
                        },
                      },
                    },
                    [e._v("《儿童隐私保护须知》")]
                  ),
                  e._v("及"),
                  t(
                    "span",
                    {
                      staticClass: "name",
                      on: {
                        click: function (t) {
                          return e.viewPolicy("privacy");
                        },
                      },
                    },
                    [e._v("《隐私政策》")]
                  ),
                ]),
              ]),
              t(
                "div",
                {
                  staticClass: "certify-btn",
                  style: { opacity: e.availableCertifyBtn ? "1" : "0.24" },
                  on: { click: e.certify },
                },
                [
                  e._v(" 认证 "),
                  "loading" === e.certifyStatus
                    ? t("div", { staticClass: "loading" })
                    : e._e(),
                ]
              ),
              e._m(0),
              t("id-auth-agreement", {
                ref: "showAgreementModal",
                on: {
                  checkAgreement: function (t) {
                    e.isCheckAgreement = !0;
                  },
                  viewPolicy: e.viewPolicy,
                },
              }),
            ],
            1
          );
        },
        o = [
          function () {
            var e = this,
              t = e._self._c;
            return t("div", { staticClass: "safe-tip" }, [
              t("img", {
                staticClass: "icon",
                attrs: { src: a(96829), alt: "" },
              }),
              t("span", [e._v("为保障您的账户隐私安全，请进行身份认证")]),
            ]);
          },
        ],
        i = (a(48792), a(8739)),
        r = a(26294),
        l = a(42642),
        s = function () {
          var e = this,
            t = e._self._c;
          return t(
            "popup",
            {
              staticClass: "modal-wrap",
              model: {
                value: e.show,
                callback: function (t) {
                  e.show = t;
                },
                expression: "show",
              },
            },
            [
              t("div", { staticClass: "title" }, [e._v("温馨提示")]),
              t("div", { staticClass: "content" }, [
                e._v(" 请阅读并同意"),
                t(
                  "span",
                  {
                    staticClass: "name",
                    on: {
                      click: function (t) {
                        return e.$emit("viewPolicy", "service", "popup");
                      },
                    },
                  },
                  [e._v("《服务协议》")]
                ),
                e._v("、"),
                t(
                  "span",
                  {
                    staticClass: "name",
                    on: {
                      click: function (t) {
                        return e.$emit("viewPolicy", "children", "popup");
                      },
                    },
                  },
                  [e._v("《儿童隐私保护须知》")]
                ),
                e._v("和"),
                t(
                  "span",
                  {
                    staticClass: "name",
                    on: {
                      click: function (t) {
                        return e.$emit("viewPolicy", "privacy", "popup");
                      },
                    },
                  },
                  [e._v("《隐私政策》")]
                ),
                e._v("后进行登录。 "),
              ]),
              t("div", { staticClass: "footer" }, [
                t(
                  "div",
                  { staticClass: "btn cancel", on: { click: e.cancel } },
                  [e._v("取消关闭")]
                ),
                t(
                  "div",
                  { staticClass: "btn", on: { click: e.readAndAgree } },
                  [e._v("已阅读并同意")]
                ),
              ]),
            ]
          );
        },
        c = [],
        u = (a(20058), a(36695)),
        d = {
          name: "IdAuthAgreement",
          components: { Popup: u.Z },
          data() {
            return { show: !1 };
          },
          watch: {
            show(e) {
              e &&
                (0, l.Z)("imp", {
                  WT_area_type_1: "弹窗",
                  WT_area_type_2: "温馨提示弹窗",
                  WT_area_name: "二次鉴权认证",
                  WT_envName: "弹出",
                });
            },
          },
          methods: {
            readAndAgree() {
              (0, l.Z)("clk", {
                WT_area_type_1: "弹窗",
                WT_area_type_2: "温馨提示弹窗",
                WT_area_name: "二次鉴权认证",
                XY_env_type: "button",
                WT_envName: "已阅读并同意",
              }),
                (this.show = !1),
                this.$emit("checkAgreement");
            },
            cancel() {
              (0, l.Z)("clk", {
                WT_area_type_1: "弹窗",
                WT_area_type_2: "温馨提示弹窗",
                WT_area_name: "二次鉴权认证",
                XY_env_type: "button",
                WT_envName: "取消关闭",
              }),
                (this.show = !1);
            },
          },
        },
        m = d,
        p = a(1001),
        h = (0, p.Z)(m, s, c, !1, null, "792a331c", null),
        f = h.exports,
        g = a(14034),
        v = a(44830),
        A = a(6648),
        y = a(51327),
        T = {
          name: "IdAuth",
          components: { IdAuthAgreement: f, Field: i.Z },
          data() {
            return {
              policyUrl: {
                service:
                  "https://h.app.coc.10086.cn/cmcc-app/app-pages/hmServicePolicy.html",
                children:
                  "https://h.app.coc.10086.cn/cmcc-app/privacyPolicy/childrenPrivacyPolicy.html",
                privacy:
                  "https://h.app.coc.10086.cn/cmcc-app/privacyPolicy/privacyPolicy.html",
              },
              passwd: "",
              forgetPasswordLink: "",
              mesCode: "",
              smsSendBtnName: "获取验证码",
              isCheckAgreement: !1,
              codeCount: 0,
              timer: null,
              getSmsCodeStatus: "",
              certifyStatus: "",
              oldTitle: "",
            };
          },
          computed: {
            ...(0, r.mapState)({ userInfo: (e) => e.userInfo }),
            availableCertifyBtn() {
              return 6 === this.mesCode.length && this.passwd.length >= 6;
            },
          },
          filters: {
            numFilter(e) {
              return e.slice(0, 3) + "****" + e.slice(7, 11);
            },
          },
          created() {
            this.getForgetPasswordLinkConfig();
          },
          mounted() {
            (this.oldTitle = document.title),
              console.log("****isAndroid", y.Dt),
              y.Dt ? (document.title = "​") : (document.title = ""),
              document.body.setAttribute(
                "style",
                "overflow:hidden;position:fixed;"
              ),
              this.disableScreenCaptureHandler(),
              (0, l.Z)("imp", {
                WT_area_type_1: "楼层",
                WT_area_name: "二次鉴权认证",
                WT_envName: "弹出",
              });
          },
          watch: {
            isCheckAgreement(e) {
              (0, l.Z)("clk", {
                WT_area_type_1: "楼层",
                WT_area_name: "二次鉴权认证",
                XY_env_type: "button",
                WT_envName: e ? "勾选协议" : "取消勾选协议",
              });
            },
          },
          methods: {
            disableScreenCaptureHandler() {
              (0, A.Z3)({
                debug: !1,
                success: function (e) {},
                error: function (e) {},
              });
            },
            getRecordingOrScreenshotStatusHandler() {
              (0, A.Sp)({ debug: !1, success: function (e) {} });
            },
            async getForgetPasswordLinkConfig() {
              let e = await (0, g.mn)();
              "000000" === e.retCode &&
                e.rspBody &&
                e.rspBody.redirectUrl &&
                (this.forgetPasswordLink = e.rspBody.redirectUrl);
            },
            changeCheckAgreement() {
              this.isCheckAgreement = !this.isCheckAgreement;
            },
            jumpPasswordLink() {
              (0, l.Z)("clk", {
                WT_area_type_1: "楼层",
                WT_area_name: "二次鉴权认证",
                XY_env_type: "button",
                WT_envName: "忘记密码",
                WT_next_url: this.forgetPasswordLink,
              }),
                window.open(this.forgetPasswordLink, "_blank");
            },
            async getSmsCode() {
              if (
                ((0, l.Z)("clk", {
                  WT_area_type_1: "楼层",
                  WT_area_name: "二次鉴权认证",
                  XY_env_type: "button",
                  WT_envName: this.smsSendBtnName,
                }),
                this.codeCount > 0 || "loading" === this.getSmsCodeStatus)
              )
                return;
              this.getSmsCodeStatus = "loading";
              let e = await (0, g.lW)(),
                { retCode: t, retDesc: a } = e;
              "000000" === t ? this.checkTime() : this.$toast(a),
                (this.getSmsCodeStatus = "completed");
            },
            checkTime() {
              (this.codeCount = 59),
                (this.smsSendBtnName = this.codeCount + "s"),
                (this.timer = setInterval(() => {
                  this.codeCount--,
                    (this.smsSendBtnName = this.codeCount + "s"),
                    this.codeCount <= 0 &&
                      ((this.smsSendBtnName = "重新获取"),
                      clearInterval(this.timer));
                }, 1e3));
            },
            async certify() {
              if (
                ((0, l.Z)("clk", {
                  WT_area_type_1: "楼层",
                  WT_area_name: "二次鉴权认证",
                  XY_env_type: "button",
                  WT_envName: "认证",
                }),
                !this.availableCertifyBtn || "loading" === this.certifyStatus)
              )
                return;
              if (!this.isCheckAgreement)
                return void (this.$refs.showAgreementModal.show = !0);
              this.certifyStatus = "loading";
              let e = await (0, g.T)({
                password: this.passwd,
                captcha: this.mesCode,
              });
              console.log("认证请求"),
                console.log(e),
                "000000" === (null === e || void 0 === e ? void 0 : e.retCode)
                  ? (console.log(e), this.success(e.rspBody))
                  : e.retDesc &&
                    (this.$toast(e.retDesc),
                    (this.certifyStatus = "completed"));
            },
            async success(e) {
              this.getRecordingOrScreenshotStatusHandler(),
                console.log("****title", document.title),
                (document.title = this.oldTitle),
                this.$emit("authSuccess", e);
            },
            viewPolicy(e, t) {
              const a = {
                service: "服务协议",
                children: "儿童隐私保护须知",
                privacy: "隐私政策",
              };
              (0, l.Z)("clk", {
                WT_area_type_1: "popup" === t ? "弹窗" : "楼层",
                WT_area_type_2: "popup" === t ? "温馨提示弹窗" : "",
                WT_area_name: "二次鉴权认证",
                XY_env_type: "button",
                WT_envName: a[e] || "",
                WT_next_url: this.policyUrl[e],
              }),
                e && this.policyUrl[e] && v.Z.go({ url: this.policyUrl[e] });
            },
          },
          beforeDestroy() {
            document.body.setAttribute("style", "overflow:auto;");
          },
        },
        S = T,
        I = (0, p.Z)(S, n, o, !1, null, "3e00897c", null),
        b = I.exports;
    },
    41753: function (e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, {
          default: function () {
            return h;
          },
        });
      var n = function () {
          var e = this,
            t = e._self._c;
          e._self._setupProxy;
          return !e.redisDate || (e.redisDate && e.dataArr.length > 0)
            ? t(
                "div",
                { class: ["navigation", e.redisDate ? "redisMonth" : ""] },
                [
                  t(
                    "div",
                    {
                      class: [
                        "ulBox",
                        e.redisDate && e.dataArr.length <= 7
                          ? "maxWidthBox"
                          : "",
                      ],
                    },
                    [
                      t(
                        "ul",
                        {
                          ref: "slideLift",
                          class: [
                            e.redisDate && e.dataArr.length <= 7
                              ? "maxWidthUl"
                              : "",
                          ],
                        },
                        e._l(e.dataArr, function (a, n) {
                          return t(
                            "pull-app-point",
                            {
                              key: n,
                              attrs: {
                                "url-params": e.getPullUrlParams(a),
                                disabledPull: e.activeIndex === n,
                                "pulling-type-location": "2",
                              },
                              on: {
                                nonLaunchClick: function (t) {
                                  return e.changeTab(a, n);
                                },
                              },
                            },
                            [
                              t(
                                "li",
                                {
                                  class: [
                                    "voice1-" + a.year + "-" + a.month,
                                    e.activeIndex === n ? "active" : "",
                                    "nav-bar-list",
                                  ],
                                },
                                [
                                  t("p", { staticClass: "month" }, [
                                    e._v(e._s(a.month) + "月"),
                                  ]),
                                  t("span", { staticClass: "year" }, [
                                    e._v(e._s(a.year)),
                                  ]),
                                ]
                              ),
                            ]
                          );
                        }),
                        1
                      ),
                    ]
                  ),
                  !e.redisDate || (e.redisDate && e.dataArr.length > 7)
                    ? t(
                        "div",
                        { staticClass: "calendarShadow-box" },
                        [
                          t("img", {
                            staticClass: "calendarShadow",
                            attrs: {
                              "aria-hidden": "true",
                              src: a(42988),
                              alt: "",
                            },
                          }),
                          t(
                            "pull-app-point",
                            {
                              staticClass: "calendar",
                              attrs: { "pulling-type-location": "2" },
                              on: { nonLaunchClick: e.showCalendarHandle },
                            },
                            [
                              t("img", {
                                attrs: {
                                  "aria-hidden": "true",
                                  src: a(62774),
                                  alt: "",
                                },
                              }),
                            ]
                          ),
                        ],
                        1
                      )
                    : e._e(),
                  e.showCalendar
                    ? t("div", {
                        staticClass: "calendared",
                        on: {
                          click: function (t) {
                            e.showCalendar = !1;
                          },
                        },
                      })
                    : e._e(),
                  e.showCalendar
                    ? t(
                        "div",
                        {
                          staticClass: "calendarPopupBox",
                          on: {
                            click: function (t) {
                              e.showCalendar = !1;
                            },
                          },
                        },
                        [
                          t("div", { staticClass: "calendarPopup" }, [
                            t("img", {
                              staticClass: "triangle",
                              attrs: { src: a(51732), alt: "" },
                            }),
                            t(
                              "div",
                              { staticClass: "calendarCard" },
                              e._l(e.dataArr, function (a, n) {
                                return t(
                                  "div",
                                  {
                                    key: n,
                                    staticClass: "item",
                                    class:
                                      e.activeIndex === n ? "activeCard" : "",
                                    on: {
                                      click: function (t) {
                                        return (
                                          t.stopPropagation(), e.changeTab(a, n)
                                        );
                                      },
                                    },
                                  },
                                  [
                                    t("p", { staticClass: "month" }, [
                                      e._v(e._s(a.month) + "月"),
                                    ]),
                                    t("span", { staticClass: "year" }, [
                                      e._v(e._s(a.year) + "年"),
                                    ]),
                                  ]
                                );
                              }),
                              0
                            ),
                          ]),
                        ]
                      )
                    : e._e(),
                ]
              )
            : e._e();
        },
        o = [],
        i = a(10311),
        r = a.n(i),
        l = a(26294),
        s = a(87630),
        c = a(23692),
        u = r().extend({
          name: "MonthAppSelector",
          components: { PullAppPoint: s.Z },
          data() {
            return {
              activeIndex: 0,
              showCalendar: !1,
              traceConfigMap: {
                businessQuery: {
                  tab: "P00000096595",
                  icon: "P00000096596",
                  float: "P00000096597",
                },
              },
            };
          },
          props: {
            userModeChange: { type: Boolean, default: !1 },
            redisDate: { type: Boolean, default: !1 },
          },
          computed: {
            ...(0, l.mapState)({
              dataArr: (e) => e.common.dataArr,
              currentItem: (e) => e.common.currentItem,
              userMode: (e) => {
                var t;
                return null === (t = e.balanceQuery) || void 0 === t
                  ? void 0
                  : t.userMode;
              },
            }),
          },
          watch: {
            userModeChange() {
              this.showCalendar = !1;
            },
          },
          mounted() {
            this.init();
          },
          methods: {
            ...(0, l.mapMutations)("common", {
              setCurrentItem: "SET_CURRENT_ITEM",
            }),
            ...(0, l.mapActions)("market", ["syncMonthSelector2Market"]),
            init() {
              console.log("this.dataArr===", this.dataArr),
                console.log("this.currentItem===", this.currentItem),
                (this.activeIndex = this.dataArr.findIndex(
                  (e) =>
                    e.year === this.currentItem.year &&
                    e.month === this.currentItem.month
                )),
                console.log("this.activeIndex===", this.activeIndex),
                this.$nextTick(() => {
                  this.tabScroll(this.activeIndex),
                    this.syncMonthSelector2Market({
                      ...this.currentItem,
                      isReactive: !0,
                    });
                });
            },
            showCalendarHandle() {
              (this.showCalendar = !0),
                this.traceConfigMap[this.$store.getters.pageName] &&
                  (0, c["default"])("clk", {
                    WT_envName: "月份筛选icon",
                    WT_event:
                      this.traceConfigMap[this.$store.getters.pageName].icon,
                  });
            },
            changeTab(e, t) {
              if (t !== this.activeIndex) {
                var a;
                let n = "";
                (n =
                  null !== (a = this.userMode) && void 0 !== a && a.show
                    ? this.userModeChange
                      ? "合户"
                      : "个人"
                    : "月份筛选"),
                  (0, c["default"])("clk", {
                    WT_envName: `${e.year + e.month.padStart(2, "0")}`,
                    WT_et: "clk",
                    WT_area_type_1: "日历",
                    WT_area_type_2: "个人信息区",
                    WT_area_name: n,
                    XY_env_type: "button",
                  }),
                  (this.activeIndex = t),
                  this.tabScroll(t),
                  (this.showCalendar = !1),
                  this.setCurrentItem(e),
                  this.$emit("changeMonth"),
                  this.syncMonthSelector2Market({ ...e, isReactive: !0 });
              }
            },
            tabScroll(e) {
              console.log("tabScroll.i===", e);
              let t = document.querySelectorAll(".nav-bar-list");
              const a = document.querySelector("ul");
              if (!a) return;
              const n = a.offsetWidth / 2,
                o = a.scrollWidth - a.offsetWidth;
              let i;
              (i = 0 !== e ? t[e].offsetLeft + t[e].offsetWidth / 2 - n : 0),
                i < 0 && (i = 0),
                i > o && (i = o);
              const r = a.scrollLeft;
              let l = ~~((i - r) / 15);
              (l = l > 0 ? Math.ceil(l) : Math.floor(l)),
                this.tabAnimateInterval &&
                  cancelAnimationFrame(this.tabAnimateInterval),
                0 !== l && this.tabStepAnimate(i, l);
            },
            tabStepAnimate(e, t) {
              let a = document.querySelector("ul").scrollLeft + t;
              Math.abs(a - e) <= Math.abs(t) && (a = e),
                (document.querySelector("ul").scrollLeft = a),
                a !== e &&
                  (this.tabAnimateInterval = requestAnimationFrame(() => {
                    this.tabStepAnimate(e, t);
                  }));
            },
            getPullUrlParams(e) {
              return "yearMonth=" + (e.year + "-" + e.month.padStart(2, "0"));
            },
          },
        }),
        d = u,
        m = a(1001),
        p = (0, m.Z)(d, n, o, !1, null, "47c7f648", null),
        h = p.exports;
    },
    84682: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return A;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          e._self._setupProxy;
          return t("div", { staticClass: "navigation" }, [
            t(
              "div",
              {
                staticClass: "ulBox",
                style: e.isShowCalendar ? "" : "overflow-x:visible",
              },
              [
                t(
                  "ul",
                  {
                    ref: "slideLift",
                    style: e.isShowCalendar ? "" : "overflow-x:visible",
                  },
                  e._l(e.dataArr, function (a, n) {
                    return t(
                      "pull-app-point",
                      e._b(
                        {
                          key: n,
                          on: {
                            nonLaunchClick: function (t) {
                              return e.changeTab(a, n);
                            },
                          },
                        },
                        "pull-app-point",
                        {
                          urlParams: e.getPullUrlParams(a),
                          disabledPull: e.activeIndex === n,
                          pullingTypeLocation: "2",
                        },
                        !1
                      ),
                      [
                        t(
                          "li",
                          {
                            class: [
                              "voice1-" + a.year + "-" + a.month,
                              e.activeIndex === n ? "active" : "",
                              "nav-bar-list",
                              e.isShowCalendar ? "" : "li-7",
                            ],
                          },
                          [
                            t("p", { staticClass: "month" }, [
                              e._v(e._s(a.month) + "月"),
                            ]),
                            t("span", { staticClass: "year" }, [
                              e._v(e._s(a.year)),
                            ]),
                          ]
                        ),
                      ]
                    );
                  }),
                  1
                ),
              ]
            ),
            e.isShowCalendar
              ? t(
                  "div",
                  { staticClass: "calendarShadow-box" },
                  [
                    t("img", {
                      staticClass: "calendarShadow",
                      attrs: { "aria-hidden": "true", src: a(42988), alt: "" },
                    }),
                    t(
                      "pull-app-point",
                      e._b(
                        {
                          staticClass: "calendar",
                          on: { nonLaunchClick: e.showCalendarHandle },
                        },
                        "pull-app-point",
                        { pullingTypeLocation: "2" },
                        !1
                      ),
                      [
                        t("img", {
                          attrs: {
                            "aria-hidden": "true",
                            src: a(62774),
                            alt: "",
                          },
                        }),
                      ]
                    ),
                  ],
                  1
                )
              : e._e(),
            e.showCalendar
              ? t("div", {
                  staticClass: "calendared",
                  on: {
                    click: function (t) {
                      e.showCalendar = !1;
                    },
                  },
                })
              : e._e(),
            e.showCalendar
              ? t(
                  "div",
                  {
                    staticClass: "calendarPopupBox",
                    on: {
                      click: function (t) {
                        e.showCalendar = !1;
                      },
                    },
                  },
                  [
                    t(
                      "div",
                      { staticClass: "calendarPopup" },
                      [
                        t("img", {
                          staticClass: "triangle",
                          attrs: { src: a(51732), alt: "" },
                        }),
                        e.isShowIndicators
                          ? t(
                              "swipe",
                              {
                                staticClass: "month-swipe",
                                attrs: {
                                  id: "swipe",
                                  "show-indicators": !0,
                                  loop: !1,
                                  "initial-swipe": e.currentSwipe,
                                },
                              },
                              e._l(e.data2DArr, function (a, n) {
                                return t(
                                  "swipe-item",
                                  {
                                    key: `swipe-${n}`,
                                    staticClass: "month-swipe-item",
                                  },
                                  e._l(a, function (a, o) {
                                    return t(
                                      "div",
                                      {
                                        key: o,
                                        staticClass: "item",
                                        class:
                                          e.activeIndex === 16 * n + o
                                            ? "activeCard"
                                            : "",
                                        on: {
                                          click: function (t) {
                                            return (
                                              t.stopPropagation(),
                                              e.changeTab(a, 16 * n + o)
                                            );
                                          },
                                        },
                                      },
                                      [
                                        t("p", { staticClass: "month" }, [
                                          e._v(e._s(a.month) + "月"),
                                        ]),
                                        t("span", { staticClass: "year" }, [
                                          e._v(e._s(a.year) + "年"),
                                        ]),
                                      ]
                                    );
                                  }),
                                  0
                                );
                              }),
                              1
                            )
                          : t(
                              "div",
                              { staticClass: "calendarCard" },
                              e._l(e.dataArr, function (a, n) {
                                return t(
                                  "div",
                                  {
                                    key: n,
                                    staticClass: "item",
                                    class:
                                      e.activeIndex === n ? "activeCard" : "",
                                    on: {
                                      click: function (t) {
                                        return (
                                          t.stopPropagation(), e.changeTab(a, n)
                                        );
                                      },
                                    },
                                  },
                                  [
                                    t("p", { staticClass: "month" }, [
                                      e._v(e._s(a.month) + "月"),
                                    ]),
                                    t("span", { staticClass: "year" }, [
                                      e._v(e._s(a.year) + "年"),
                                    ]),
                                  ]
                                );
                              }),
                              0
                            ),
                      ],
                      1
                    ),
                  ]
                )
              : e._e(),
          ]);
        },
        o = [],
        i = (a(60332), a(62602)),
        r = (a(95196), a(53121)),
        l = a(10311),
        s = a.n(l),
        c = a(26294),
        u = a(87630),
        d = a(42642),
        m = a(72856),
        p = a(24631);
      m["default"].registerModule("monthSelectInfo", p.Z);
      var h = s().extend({
          name: "MonthAppSelector",
          components: { PullAppPoint: u.Z, Swipe: r.Z, SwipeItem: i.Z },
          data() {
            return { activeIndex: 0, showCalendar: !1 };
          },
          props: {
            userModeChange: { type: Boolean, default: !1 },
            isShowCalendar: { type: Boolean, default: !0 },
            isShowIndicators: { type: Boolean, default: !1 },
          },
          computed: {
            ...(0, c.mapState)({
              dataArr: (e) => e.monthSelectInfo.dataArr,
              currentItem: (e) => e.monthSelectInfo.currentItem,
              websiteTarget: (e) => e.websiteTarget,
            }),
            data2DArr() {
              return this.convertTo2DArray(this.dataArr);
            },
            currentSwipe() {
              if (this.isShowIndicators)
                return Math.floor(this.activeIndex / 16);
            },
          },
          watch: {
            userModeChange() {
              this.showCalendar = !1;
            },
          },
          mounted() {
            this.init();
          },
          methods: {
            ...(0, c.mapMutations)("monthSelectInfo", {
              setCurrentItem: "SET_CURRENT_ITEM",
            }),
            ...(0, c.mapActions)("market", ["syncMonthSelector2Market"]),
            init() {
              console.log("this.dataArr===", this.dataArr),
                console.log("this.currentItem===", this.currentItem),
                (this.activeIndex = this.dataArr.findIndex(
                  (e) =>
                    e.year === this.currentItem.year &&
                    e.month === this.currentItem.month
                )),
                console.log("this.activeIndex===", this.activeIndex),
                this.$nextTick(() => {
                  this.tabScroll(this.activeIndex),
                    this.syncMonthSelector2Market({
                      ...this.currentItem,
                      isReactive: !0,
                    });
                });
            },
            showCalendarHandle() {
              (this.showCalendar = !0),
                (0, d.Z)("clk", {
                  WT_area_type_1: "日历",
                  WT_area_type_2: "个人信息区",
                  XY_env_type: "icon",
                  WT_area_name: "月份筛选",
                  WT_envName: "月份筛选icon",
                });
            },
            changeTab(e, t) {
              t !== this.activeIndex &&
                ((0, d.Z)("clk", {
                  WT_area_type_1: "日历",
                  WT_area_type_2: "个人信息区",
                  XY_env_type: "button",
                  WT_area_name: "月份筛选",
                  WT_envName: `${e.year + e.month.padStart(2, "0")}`,
                }),
                (this.activeIndex = t),
                this.tabScroll(t),
                (this.showCalendar = !1),
                this.setCurrentItem(e),
                this.$emit("changeMonth"),
                this.syncMonthSelector2Market({ ...e, isReactive: !0 }));
            },
            tabScroll(e) {
              console.log("tabScroll.i===", e);
              let t = document.querySelectorAll(".nav-bar-list");
              const a = document.querySelector("ul");
              if (!a) return;
              const n = a.offsetWidth / 2,
                o = a.scrollWidth - a.offsetWidth;
              let i;
              (i = 0 !== e ? t[e].offsetLeft + t[e].offsetWidth / 2 - n : 0),
                i < 0 && (i = 0),
                i > o && (i = o);
              const r = a.scrollLeft;
              let l = ~~((i - r) / 15);
              (l = l > 0 ? Math.ceil(l) : Math.floor(l)),
                this.tabAnimateInterval &&
                  cancelAnimationFrame(this.tabAnimateInterval),
                0 !== l && this.tabStepAnimate(i, l);
            },
            tabStepAnimate(e, t) {
              let a = document.querySelector("ul").scrollLeft + t;
              Math.abs(a - e) <= Math.abs(t) && (a = e),
                (document.querySelector("ul").scrollLeft = a),
                a !== e &&
                  (this.tabAnimateInterval = requestAnimationFrame(() => {
                    this.tabStepAnimate(e, t);
                  }));
            },
            getPullUrlParams(e) {
              return "yearMonth=" + (e.year + "-" + e.month.padStart(2, "0"));
            },
            convertTo2DArray(e) {
              const t = [],
                a = 16;
              for (let n = 0; n < e.length; n += a) {
                const o = e.slice(n, n + a);
                t.push(o);
              }
              return t;
            },
          },
        }),
        f = h,
        g = a(1001),
        v = (0, g.Z)(f, n, o, !1, null, "67b9f364", null),
        A = v.exports;
    },
    14721: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return m;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          e._self._setupProxy;
          return !e.redisDate || (e.redisDate && e.dateList.length > 0)
            ? t("div", { staticClass: "navigation-care" }, [
                e.dateList.length
                  ? t(
                      "div",
                      {
                        directives: [
                          {
                            name: "speech",
                            rawName: "v-speech",
                            value: e.getTxt,
                            expression: "getTxt",
                          },
                        ],
                        staticClass: "ulBox",
                      },
                      [
                        t(
                          "ul",
                          { ref: "slideLift" },
                          e._l(e.dateList, function (a, n) {
                            return t(
                              "li",
                              {
                                key: n,
                                class: [
                                  "voice1-" + a.year + "-" + a.month,
                                  e.activeIndex === n ? "active" : "",
                                  "nav-bar-list",
                                ],
                                on: {
                                  click: function (t) {
                                    return e.changeTab(a, n);
                                  },
                                },
                              },
                              [
                                t("p", { staticClass: "month" }, [
                                  e._v(e._s(a.month) + "月"),
                                ]),
                                t("span", { staticClass: "year" }, [
                                  e._v(e._s(a.year)),
                                ]),
                              ]
                            );
                          }),
                          0
                        ),
                      ]
                    )
                  : e._e(),
              ])
            : e._e();
        },
        o = [],
        i = a(10311),
        r = a.n(i),
        l = a(26294),
        s = r().extend({
          name: "MonthSelector",
          data() {
            return {};
          },
          props: {
            redisDate: { type: Boolean, default: !1 },
            speechPrefix: { type: String, default: "" },
          },
          computed: {
            ...(0, l.mapState)({ dateList: (e) => e.common.dataArr }),
            ...(0, l.mapGetters)("common", { activeIndex: "monthActiveIndex" }),
            getTxt() {
              return `${this.speechPrefix}${
                this.dateList[this.activeIndex].year
              }年${this.dateList[this.activeIndex].month}月`;
            },
          },
          watch: {
            activeIndex(e) {
              console.log("activeIndex=========", e), this.tabScroll(e);
            },
          },
          mounted() {
            this.tabScroll(this.activeIndex);
          },
          methods: {
            ...(0, l.mapMutations)("common", ["SET_CURRENT_ITEM"]),
            changeTab(e, t) {
              t !== this.activeIndex &&
                (this.tabScroll(t),
                this.SET_CURRENT_ITEM(e),
                this.$emit("targetMonth", e, t));
            },
            tabScroll(e) {
              let t = document.querySelectorAll(".nav-bar-list");
              const a = document.querySelector("ul");
              if (!a) return;
              const n = a.offsetWidth / 2,
                o = a.scrollWidth - a.offsetWidth;
              let i;
              (i = 0 !== e ? t[e].offsetLeft + t[e].offsetWidth / 2 - n : 0),
                i < 0 && (i = 0),
                i > o && (i = o);
              const r = a.scrollLeft;
              let l = ~~((i - r) / 15);
              (l = l > 0 ? Math.ceil(l) : Math.floor(l)),
                this.tabAnimateInterval &&
                  cancelAnimationFrame(this.tabAnimateInterval),
                0 !== l && this.tabStepAnimate(i, l);
            },
            tabStepAnimate(e, t) {
              let a = document.querySelector("ul").scrollLeft + t;
              Math.abs(a - e) <= Math.abs(t) && (a = e),
                (document.querySelector("ul").scrollLeft = a),
                a !== e &&
                  (this.tabAnimateInterval = requestAnimationFrame(() => {
                    this.tabStepAnimate(e, t);
                  }));
            },
          },
        }),
        c = s,
        u = a(1001),
        d = (0, u.Z)(c, n, o, !1, null, "7f831e26", null),
        m = d.exports;
    },
    64209: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return d;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "data-error-wrap" }, [
            t("img", { staticClass: "img", attrs: { src: a(8930) } }),
            t("div", { staticClass: "text" }, [
              e._v(e._s(e.mainInterfaceError.tipContent)),
            ]),
            e.mainInterfaceError.reLogin
              ? t("div", { staticClass: "reLogin", on: { click: e.reLogin } }, [
                  e._v("重新登录"),
                ])
              : e._e(),
          ]);
        },
        o = [],
        i = (a(26699), a(26294)),
        r = a(6648),
        l = {
          computed: {
            ...(0, i.mapState)({
              mainInterfaceError: (e) => e.common.mainInterfaceError,
            }),
          },
          methods: {
            reLogin() {
              location.href.includes("detailQuery") ? (0, r.Pp)() : (0, r.fb)();
            },
          },
        },
        s = l,
        c = a(1001),
        u = (0, c.Z)(s, n, o, !1, null, "06ee1ee2", null),
        d = u.exports;
    },
    95806: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return h;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "data-error-wrap" }, [
            t("div", { staticClass: "text" }, [
              e._v("自助服务查询，办理更便捷～"),
            ]),
            t("div", { staticClass: "btn-wrap", on: { click: e.goPage } }, [
              e._v(" 服务大厅 "),
              t("img", {
                staticClass: "img",
                attrs: { src: a(53920), alt: "" },
              }),
            ]),
          ]);
        },
        o = [],
        i = a(42642),
        r = a(44830);
      const l = {
          myPackageLite: "套餐明细区",
          scoreLite: "积分明细区",
          phoneBillsLite: "账单明细区",
          businessQueryLite: "业务明细区",
          balanceQueryLite: "余额明细区",
          marginQueryLite: "余量明细区",
        },
        s = window.location.pathname.split("/").pop(),
        c =
          "https://h.app.coc.10086.cn/cmcc-app/navigation/category.html?navId=2";
      var u = {
          mounted() {
            (0, i.Z)("imp", {
              WT_area_type_1: "楼层",
              WT_area_type_2: l[s] || "",
              WT_area_name: l[s] || "",
              XY_env_type: "button",
              WT_envName: "服务大厅",
              WT_next_url: c,
            });
          },
          methods: {
            goPage() {
              (0, i.Z)("clk", {
                WT_area_type_1: "楼层",
                WT_area_type_2: l[s] || "",
                WT_area_name: l[s] || "",
                XY_env_type: "button",
                WT_envName: "服务大厅",
                WT_next_url: c,
              }),
                r.Z.go({ url: c });
            },
          },
        },
        d = u,
        m = a(1001),
        p = (0, m.Z)(d, n, o, !1, null, "31aceb76", null),
        h = p.exports;
    },
    32938: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return m;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "data-error-wrap" }, [
            t("img", { staticClass: "img", attrs: { src: a(94408) } }),
            t("div", { staticClass: "text" }, [
              e._v(e._s(e.mainInterfaceError.tipContent)),
            ]),
            e.mainInterfaceError.reLogin
              ? t("div", { staticClass: "reLogin", on: { click: e.reLogin } }, [
                  e._v("重新登录"),
                ])
              : e._e(),
          ]);
        },
        o = [],
        i = (a(26699), a(26294)),
        r = a(6648),
        l = a(15222),
        s = {
          computed: {
            ...(0, i.mapState)({
              mainInterfaceError: (e) => e.common.mainInterfaceError,
              isTouch: (e) => e.login.isTouch,
            }),
          },
          methods: {
            reLogin() {
              this.isTouch
                ? location.href.includes("detailQuery")
                  ? (0, r.JQ)()
                  : (0, r.fb)()
                : ((0, l.K8)(), window.location.reload());
            },
          },
        },
        c = s,
        u = a(1001),
        d = (0, u.Z)(c, n, o, !1, null, "21f6b638", null),
        m = d.exports;
    },
    67517: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return c;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t("transition", { attrs: { name: "fade" } }, [
            t(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: e.show,
                    expression: "show",
                  },
                ],
                staticClass: "custom-popup-wrap",
                on: {
                  click: function (t) {
                    return t.target !== t.currentTarget
                      ? null
                      : e.$emit("close");
                  },
                },
              },
              [e._t("default")],
              2
            ),
          ]);
        },
        o = [],
        i = {
          props: ["show"],
          watch: {
            show(e) {
              e
                ? (document.body.setAttribute("style", "overflow:hidden;"),
                  (document.documentElement.style.overflow = "hidden"))
                : (document.body.setAttribute("style", "overflow:auto;"),
                  (document.documentElement.style.overflow = "auto"));
            },
          },
        },
        r = i,
        l = a(1001),
        s = (0, l.Z)(r, n, o, !1, null, "07c2e28c", null),
        c = s.exports;
    },
    82360: function (e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, {
          default: function () {
            return A;
          },
        });
      a(26699);
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "pull-app-float" },
            [
              e.pullingTypeLayer.includes("1")
                ? t(
                    "div",
                    { staticClass: "top-float" },
                    [
                      e._m(0),
                      t(
                        "pull-app-point",
                        {
                          staticClass: "btn",
                          attrs: { "pulling-type-location": "float1" },
                          on: {
                            beforePull: function (t) {
                              return e.traceData("float1");
                            },
                            nonLaunchClick: e.pullError,
                          },
                        },
                        [e._v(" 立即前往 ")]
                      ),
                    ],
                    1
                  )
                : e._e(),
              e.pullingTypeLayer.includes("3")
                ? t(
                    "pull-app-point",
                    {
                      staticClass: "right-float",
                      attrs: { "pulling-type-location": "float3" },
                      on: {
                        beforePull: function (t) {
                          return e.traceData("float3");
                        },
                        nonLaunchClick: e.pullError,
                      },
                    },
                    [
                      t("img", {
                        staticClass: "icon",
                        attrs: { src: a(52413), alt: "" },
                      }),
                      t("span", { staticClass: "desc" }, [e._v("打开APP")]),
                      t("i", { staticClass: "arrow" }),
                    ]
                  )
                : e._e(),
              e.pullingTypeLayer.includes("2")
                ? t(
                    "pull-app-point",
                    {
                      staticClass: "bottom-float",
                      attrs: { "pulling-type-location": "float2" },
                      on: {
                        beforePull: function (t) {
                          return e.traceData("float2");
                        },
                        nonLaunchClick: e.pullError,
                      },
                    },
                    [
                      t("img", {
                        staticClass: "icon",
                        attrs: { src: a(52413), alt: "" },
                      }),
                      t("span", { staticClass: "desc" }, [e._v("APP内打开")]),
                    ]
                  )
                : e._e(),
            ],
            1
          );
        },
        o = [
          function () {
            var e = this,
              t = e._self._c;
            return t("div", { staticClass: "info" }, [
              t("img", {
                staticClass: "icon",
                attrs: { src: a(52413), alt: "" },
              }),
              t("div", [
                t("div", { staticClass: "desc1" }, [e._v("前往中国移动APP")]),
                t("div", { staticClass: "desc2" }, [e._v("查看更详细内容")]),
              ]),
            ]);
          },
        ],
        i = (a(2490), a(34514), a(26294)),
        r = a(15222),
        l = a(23692),
        s = a(26090),
        c = a(87630),
        u = a(75150),
        d = a(14034),
        m = a(88922),
        p = a(76507),
        h = {
          name: "PullAppFloat",
          components: { PullAppPoint: c.Z },
          computed: {
            ...(0, i.mapState)({
              userInfo: (e) => e.userInfo,
              isTouch: (e) => e.login.isTouch,
            }),
          },
          data() {
            return {
              pullingType: "",
              pullingTypeLayer: "",
              pullingEndSdkObj: {},
            };
          },
          mounted() {
            !this.isTouch && (0, m.c5)() && this.getPullingWayConfig();
          },
          methods: {
            async getPullingWayConfig() {
              try {
                var e;
                let {
                    loginProvince: t,
                    loginCity: a,
                    phoneNumber: n,
                  } = this.$store.state.userInfo,
                  o = (0, r.eY)("channelId") || "0",
                  i = await (0, u.Z)("getPullingWay", () =>
                    (0, p.EM)(() =>
                      (0, d.DI)({
                        provinceCode: t,
                        cityCode: a,
                        cellNum: n,
                        pageInfo: s.dK[this.$store.getters.pageName],
                        channleId: o,
                      })
                    )
                  );
                if (
                  "000000" ===
                    (null === i || void 0 === i ? void 0 : i.retCode) &&
                  null !== i &&
                  void 0 !== i &&
                  null !== (e = i.rspBody) &&
                  void 0 !== e &&
                  e.pullingType
                ) {
                  if (
                    ((this.pullingType = i.rspBody.pullingType || ""),
                    !this.pullingType.includes("0") &&
                      !this.pullingType.includes("1"))
                  )
                    return;
                  (this.pullingTypeLayer = i.rspBody.pullingTypeLayer || ""),
                    console.log("getPullingWayConfig----data", i),
                    this.pullingTypeLayer &&
                      this.pullingTypeLayer.split(",").forEach((e) => {
                        this.floatTrace("imp", `float${e}`);
                      });
                }
              } catch (t) {
                console.log("getPullingWayConfig-----err", t);
              }
            },
            floatTrace(e, t) {
              let a = t.split("_")[0],
                n = {
                  float1: "顶部浮层拉端",
                  float2: "底部浮层拉端",
                  float3: "侧边浮层拉端",
                };
              (0, l["default"])(e, {
                WT_envName: n[a],
                WT_event: s.x7[this.$store.getters.pageName][a],
              });
            },
            traceData(e) {
              this.floatTrace("clk", e);
            },
            pullError() {
              this.$toast("系统繁忙，请稍后再试～");
            },
          },
        },
        f = h,
        g = a(1001),
        v = (0, g.Z)(f, n, o, !1, null, "265efd53", null),
        A = v.exports;
    },
    12206: function (e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, {
          default: function () {
            return A;
          },
        });
      var n = function () {
          var e = this,
            t = e._self._c;
          return e.showEle
            ? t(
                "div",
                {
                  attrs: { id: e.idData },
                  on: {
                    "!click": function (t) {
                      return e.clickWrap.apply(null, arguments);
                    },
                  },
                },
                [e._t("default")],
                2
              )
            : e._e();
        },
        o = [],
        i = (a(26699), a(2490), a(9924), a(26090)),
        r = a(26294),
        l = a(55844),
        s = a(75150),
        c = a(88922),
        u = a(15222),
        d = a(23692),
        m = a(86842),
        p = a.n(m),
        h = {
          name: "PullAppPoint",
          props: {
            eleId: { type: String, default: "" },
            pullingTypeLocation: { type: String, default: "" },
            urlParams: { type: String, default: "" },
            pullUrl: {
              type: String,
              default: `${window.location.origin}${window.location.pathname}`,
            },
            pullUrlType: { type: String, default: "link" },
            uninstallUrl: { type: String, default: "" },
            pageId: { type: String, default: "" },
            channelId: { type: String, default: "" },
            disabledPull: { type: Boolean, default: !1 },
            coverClick: { type: Function },
            phoneNum: { type: String, default: "" },
            deviceId: { type: String, default: "" },
          },
          data() {
            return { pullObj: null, isPullingTypeConfig: !1 };
          },
          watch: {
            pullingAppExtraParam: {
              handler() {
                this.pullInit();
              },
              deep: !0,
            },
          },
          computed: {
            ...(0, r.mapState)({
              userInfo: (e) => e.userInfo,
              isTouch: (e) => e.login.isTouch,
              pullingWayData: (e) => e.common.pullingWayData,
              pullingAppExtraParam: (e) => e.common.pageTabUrlParam,
            }),
            idData() {
              if (this.eleId) return this.eleId;
              const e = Date.now(),
                t = Math.floor(1e3 + 9e3 * Math.random());
              return `e${e}${t}`;
            },
            isMainPage() {
              return ["main"].includes(this.$store.getters.pageGroup);
            },
            channelIdValue() {
              if (this.isMainPage && this.pullingTypeLocation) {
                let e = this.pullingTypeLocation.includes("float")
                  ? this.pullingTypeLocation
                  : "location" + this.pullingTypeLocation;
                return i.x7[this.$store.getters.pageName][e] || "";
              }
              return this.channelId || "";
            },
            pageIdValue() {
              return this.isMainPage && this.pullingTypeLocation
                ? i.Z9[this.$store.getters.pageName]
                : this.pageId;
            },
            sidCode() {
              if ("99999999999" === this.userInfo.phoneNumber) return "";
              let e = (0, l.Oo)(this.userInfo.phoneNumber);
              const t = p()();
              let a = t.format("MMDDHHmmss");
              return console.log("timestamp", a), a + e;
            },
            targetUrlValue() {
              let e = (0, c.CO)(this.urlParams, this.pullingAppExtraParam);
              if (this.isMainPage) {
                let t = (0, u.eY)("acct_view"),
                  a = (0, u.eY)("grayscale"),
                  n = `${window.location.origin}${window.location.pathname}?pageId=${this.pageIdValue}&channelId=${this.channelIdValue}`;
                return (
                  t && (n += `&acct_view=${t}`),
                  a && (n += `&grayscale=${a}`),
                  e ? `${n}&${e}` : n
                );
              }
              return "link" === this.pullUrlType
                ? e
                  ? `${this.pullUrl}?${e}`
                  : this.pullUrl
                : "";
            },
            paramListItem() {
              let e = {},
                t = i.Xj[this.$store.getters.pageName],
                a = (0, c.CO)(this.urlParams, this.pullingAppExtraParam);
              if (t) {
                let n = (0, c.H9)(a, this.$store.getters.pageName);
                e.version = t.map((e) => ({
                  ...e,
                  linkAdress: `${e.linkAdress}?pageId=${
                    this.pageIdValue
                  }&channelId=${this.channelIdValue}${n ? `&${n}` : ""}`,
                }));
              }
              return (
                console.log("==========mergedUrlParams=============", a),
                console.log("extra", e),
                {
                  systemId: "1001",
                  eleId: this.idData,
                  targetUrl: this.targetUrlValue,
                  functionCode: "code" === this.pullUrlType ? this.pullUrl : "",
                  uninstallUrl: "",
                  timeout: "2000",
                  extra: e,
                  data: {
                    pageId: this.pageIdValue,
                    channelId: this.channelIdValue,
                    sellerId: (0, u.eY)("sellerId") || "",
                    extendId: "",
                    phone: "",
                    LDStaffNumber: "",
                    LDStaffPhone: "",
                    LDUserPhone: "",
                    sid: this.sidCode,
                  },
                  wxOpenLaunchAppClick: () => {
                    this.handleLaunchClick();
                  },
                }
              );
            },
            needPullPage() {
              var e;
              return null === (e = i.SL[this.$store.getters.pageGroup]) ||
                void 0 === e
                ? void 0
                : e.includes(this.$store.getters.pageName);
            },
            showEle() {
              if (this.pullingWayData) {
                let {
                  pullingType: e = "",
                  pullingTypeLayer: t = "",
                  pullingTypeLocation: a = "",
                } = this.pullingWayData;
                if (["main"].includes(this.$store.getters.pageGroup)) {
                  let n =
                    (this.pullingTypeLocation.includes("float") &&
                      (e.includes("0") || e.includes("1")) &&
                      t.includes(this.pullingTypeLocation.slice(-1))) ||
                    ((e.includes("0") || e.includes("2")) &&
                      a.includes(this.pullingTypeLocation));
                  if (n && !(0, c.c5)() && "2" !== this.pullingTypeLocation)
                    return !1;
                }
              }
              return !0;
            },
          },
          mounted() {
            this.pullInit();
          },
          methods: {
            async pullInit() {
              if (!this.disabledPull && !this.isTouch && this.needPullPage)
                try {
                  var e;
                  if (
                    ((this.pullObj = await (0, s.Z)("initPullApp", () =>
                      (0, c.iX)({
                        pageInfo: i.dK[this.$store.getters.pageName],
                      })
                    )),
                    ["main"].includes(this.$store.getters.pageGroup))
                  ) {
                    var t;
                    let {
                      pullingType: e = "",
                      pullingTypeLayer: a = "",
                      pullingTypeLocation: n = "",
                    } = null === (t = this.pullObj) || void 0 === t
                      ? void 0
                      : t.pullingWayData;
                    if (
                      ((this.isPullingTypeConfig =
                        (this.pullingTypeLocation.includes("float") &&
                          (e.includes("0") || e.includes("1")) &&
                          a.includes(this.pullingTypeLocation.slice(-1))) ||
                        ((e.includes("0") || e.includes("2")) &&
                          n.includes(this.pullingTypeLocation))),
                      !this.isPullingTypeConfig)
                    )
                      return;
                    if (!(0, c.c5)()) return;
                  }
                  if (null !== (e = this.pullObj) && void 0 !== e && e.update) {
                    let e = {
                      paramList: [this.paramListItem],
                      onReady: () => {},
                      isWxOpenLaunchApp: !0,
                      phoneNum: "",
                    };
                    this.phoneNum && (e.phoneNum = this.phoneNum),
                      this.deviceId && (e.deviceId = this.deviceId),
                      this.pullObj.update(e);
                  }
                } catch (a) {
                  console.log("拉端初始化失败", a);
                }
            },
            async clickWrap(e) {
              if (
                (0, c.c5)() ||
                !this.isPullingTypeConfig ||
                "2" !== this.pullingTypeLocation
              )
                if (this.coverClick) this.coverClick();
                else if (
                  (this.$emit("beforePull"),
                  this.disabledPull || this.isTouch || !this.needPullPage)
                )
                  console.log("nonLaunchClick-----1"),
                    this.$emit("nonLaunchClick");
                else if (["main"].includes(this.$store.getters.pageGroup)) {
                  var t;
                  null !== (t = this.pullObj) &&
                  void 0 !== t &&
                  t.wakeupOrInstall &&
                  this.isPullingTypeConfig
                    ? (this.handleLaunchClick(),
                      this.pullObj.wakeupOrInstall(this.paramListItem),
                      e.stopPropagation())
                    : this.$emit("nonLaunchClick");
                } else {
                  var a;
                  null !== (a = this.pullObj) &&
                  void 0 !== a &&
                  a.wakeupOrInstall
                    ? (this.handleLaunchClick(),
                      this.pullObj.wakeupOrInstall(this.paramListItem))
                    : this.$emit("errorPull");
                }
            },
            handleLaunchClick() {
              this.clickTrace(), this.$emit("launchClick");
            },
            clickTrace() {
              if (
                ["main"].includes(this.$store.getters.pageGroup) &&
                ["1", "2", "3"].includes(this.pullingTypeLocation)
              ) {
                var e, t, a, n;
                let o = {
                    1: "营销触点拉端",
                    2: "分类/月份拉端",
                    3: "页面触点拉端",
                  },
                  i =
                    (null === (e = this.pullObj) ||
                    void 0 === e ||
                    null === (t = e.pullingWayData) ||
                    void 0 === t
                      ? void 0
                      : t.advBusiType) || "",
                  r =
                    (null === (a = this.pullObj) ||
                    void 0 === a ||
                    null === (n = a.pullingWayData) ||
                    void 0 === n
                      ? void 0
                      : n.markId) || "";
                (0, d["default"])("clk", {
                  WT_envName: o[this.pullingTypeLocation],
                  WT_et: "clk",
                  WT_event: this.channelIdValue,
                  WT_next_url: this.targetUrlValue ? this.targetUrlValue : "",
                  WT_markId: i + "_" + r,
                });
              }
            },
          },
        },
        f = h,
        g = a(1001),
        v = (0, g.Z)(f, n, o, !1, null, "37ca0774", null),
        A = v.exports;
    },
    28236: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return C;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "voice-broadcast-care" }, [
            t(
              "div",
              { staticClass: "voice-broadcast_btn" },
              [
                e.isLoadCompleted
                  ? t(
                      "div",
                      { staticClass: "voice-btn", on: { click: e.voiceStart } },
                      [
                        e.isVoice
                          ? t("SvgPlay", { staticClass: "voice-play_img" })
                          : t("SvgPause", { staticClass: "voice-play_img" }),
                        e._v(
                          " " + e._s(e.isVoice ? "语音播报" : "暂停播报") + " "
                        ),
                      ],
                      1
                    )
                  : t("dot-loading", { attrs: { size: "big" } }),
              ],
              1
            ),
          ]);
        },
        o = [],
        i = (a(2490), a(34514), a(26294)),
        r = a(6648),
        l = function () {
          var e = this,
            t = e._self._c;
          return t(
            "svg",
            {
              staticStyle: { overflow: "visible" },
              attrs: {
                viewBox: "0 0 56 56",
                version: "1.1",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
              },
            },
            [
              t(
                "g",
                {
                  attrs: {
                    stroke: "none",
                    "stroke-width": "1",
                    fill: "none",
                    "fill-rule": "evenodd",
                  },
                },
                [
                  t(
                    "g",
                    {
                      attrs: {
                        transform: "translate(-261, -3567)",
                        "fill-rule": "nonzero",
                      },
                    },
                    [
                      t("g", { attrs: { transform: "translate(0, 3523)" } }, [
                        t("g", { attrs: { transform: "translate(261, 44)" } }, [
                          t("path", {
                            staticClass: "icon-color",
                            attrs: {
                              d: "M28,3 C14.1941964,3 3,14.1941964 3,28 C3,41.8058036 14.1941964,53 28,53 C41.8058036,53 53,41.8058036 53,28 C53,14.1941964 41.8058036,3 28,3 Z M37.2074413,29.7065637 L25.0429,37.14045 C24.1003909,37.7164278 22.8694141,37.4192954 22.2934363,36.4767863 C22.1015378,36.1627705 22,35.8018958 22,35.4338863 L22,20.5661137 C22,19.4615442 22.8954305,18.5661137 24,18.5661137 C24.3680095,18.5661137 24.7288842,18.6676514 25.0429,18.85955 L37.2074413,26.2934363 C38.1499504,26.8694141 38.4470827,28.1003909 37.8711049,29.0429 C37.7056577,29.3136318 37.4781731,29.5411165 37.2074413,29.7065637 Z",
                            },
                          }),
                        ]),
                      ]),
                    ]
                  ),
                ]
              ),
            ]
          );
        },
        s = [],
        c = { name: "SvgPause" },
        u = c,
        d = a(1001),
        m = (0, d.Z)(u, l, s, !1, null, "116915da", null),
        p = m.exports,
        h = function () {
          var e = this,
            t = e._self._c;
          return t(
            "svg",
            {
              staticStyle: { overflow: "visible" },
              attrs: {
                viewBox: "0 0 56 56",
                version: "1.1",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
              },
            },
            [
              t(
                "g",
                {
                  attrs: {
                    stroke: "none",
                    "stroke-width": "1",
                    fill: "none",
                    "fill-rule": "evenodd",
                  },
                },
                [
                  t(
                    "g",
                    {
                      attrs: {
                        transform: "translate(-318, -126)",
                        "fill-rule": "nonzero",
                      },
                    },
                    [
                      t("g", { attrs: { transform: "translate(57, 82)" } }, [
                        t("g", { attrs: { transform: "translate(24, 18)" } }, [
                          t(
                            "g",
                            { attrs: { transform: "translate(237, 26)" } },
                            [
                              t("path", {
                                staticClass: "icon-color",
                                attrs: {
                                  d: "M28,3 C14.1941964,3 3,14.1941964 3,28 C3,41.8058036 14.1941964,53 28,53 C41.8058036,53 53,41.8058036 53,28 C53,14.1941964 41.8058036,3 28,3 Z M23,18 C24.1045695,18 25,18.8954305 25,20 L25,36 C25,37.1045695 24.1045695,38 23,38 C21.8954305,38 21,37.1045695 21,36 L21,20 C21,18.8954305 21.8954305,18 23,18 Z M33,18 C34.1045695,18 35,18.8954305 35,20 L35,36 C35,37.1045695 34.1045695,38 33,38 C31.8954305,38 31,37.1045695 31,36 L31,20 C31,18.8954305 31.8954305,18 33,18 Z",
                                },
                              }),
                            ]
                          ),
                        ]),
                      ]),
                    ]
                  ),
                ]
              ),
            ]
          );
        },
        f = [],
        g = { name: "SvgPause" },
        v = g,
        A = (0, d.Z)(v, h, f, !1, null, "1dd155fc", null),
        y = A.exports,
        T = a(9768),
        S = {
          components: { SvgPause: y, SvgPlay: p, DotLoading: T.Z },
          props: { isLoadCompleted: { type: Boolean, default: !1 } },
          data() {
            return {
              isVoice: !0,
              playIndex: 0,
              voiceList: [],
              hasReaded: !1,
              isPauseFromLingXi: !1,
              voiceBreakTxt: "",
            };
          },
          computed: { ...(0, i.mapState)({ userInfo: (e) => e.userInfo }) },
          mounted() {
            window.cmPauseOrResumeVoice = (e) => {
              console.log("isPause", e, typeof e),
                console.log("cmPauseOrResumeVoice hasReaded", this.hasReaded),
                console.log(
                  "cmPauseOrResumeVoice isPauseFromLingXi",
                  this.isPauseFromLingXi
                ),
                this.hasReaded &&
                  ("0" == e
                    ? (this.voiceStop(),
                      console.log("cmPauseOrResumeVoice voiceStop"),
                      (this.isPauseFromLingXi = !0))
                    : "1" == e &&
                      this.isVoice &&
                      this.isPauseFromLingXi &&
                      (console.log("cmPauseOrResumeVoice voiceStart"),
                      this.voiceStart()));
            };
          },
          methods: {
            initFun(e = "") {
              (this.voiceBreakTxt = e),
                this.voiceStop(),
                this.clearVoiceBg(),
                (this.playIndex = 0),
                (this.voiceList = []);
            },
            clearVoiceBg() {
              this.voiceList.length > 0 &&
                this.voiceList.forEach(() => {
                  let e = document.querySelectorAll("[speech-txt]");
                  Array.prototype.forEach.call(e, function (e) {
                    e.classList.remove("voiceBg");
                  });
                });
            },
            voiceStart() {
              (0, r.qq)()
                .then((e) => {
                  console.log("isAccessibilityOpen-res：", e),
                    "1" !== e.isOpen && this.voicePlayClickFunc();
                })
                .catch(() => {
                  this.voicePlayClickFunc();
                });
            },
            voicePlayClickFunc() {
              if (this.isVoice) {
                (this.voiceList = []), (this.isVoice = !this.isVoice);
                let e = document.querySelectorAll("[speech-txt]");
                e.forEach((e) => {
                  this.voiceList.push(e.getAttribute("speech-txt"));
                }),
                  this.voiceBreakTxt &&
                    ((this.playIndex = this.voiceList.indexOf(
                      this.voiceBreakTxt
                    )),
                    (this.voiceBreakTxt = "")),
                  console.log(
                    "voiceList:",
                    this.voiceList,
                    "version",
                    this.userInfo.version
                  ),
                  this.voicePlay();
              } else this.voiceStop(), (this.isPauseFromLingXi = !1);
            },
            voiceStop() {
              (this.isVoice = !0),
                (0, r.oe)({
                  text: "",
                  languageType: "1",
                  isStop: !0,
                  isCareMode: !0,
                  success: function () {},
                  error: function () {},
                });
            },
            voicePlay() {
              if (
                ((this.hasReaded = !0),
                this.clearVoiceBg(),
                this.playIndex <= this.voiceList.length - 1)
              ) {
                let e = document.querySelectorAll("[speech-txt]");
                null ===
                  e[this.playIndex].getAttribute("data-voiceBg-noDisplay") &&
                  e[this.playIndex].classList.add("voiceBg");
                let t = e[this.playIndex].getBoundingClientRect().top,
                  a = e[this.playIndex].getBoundingClientRect().height,
                  n = (130 * window.innerWidth) / 750;
                t >= window.innerHeight / 2 && window.scrollBy(0, a + n),
                  console.log(
                    "---播报文字-----",
                    this.voiceList[this.playIndex]
                  ),
                  (0, r.oe)({
                    text: this.voiceList[this.playIndex],
                    languageType: "1",
                    isStop: !1,
                    isCareMode: !0,
                    numReadType: "0",
                    success: () => {
                      this.playIndex++, this.voicePlay();
                    },
                    error: () => {
                      this.isVoice = !0;
                    },
                  });
              } else this.initFun();
              this.$emit("startVoice", !0);
            },
          },
        },
        I = S,
        b = (0, d.Z)(I, n, o, !1, null, "2553b4cc", null),
        C = b.exports;
    },
    18203: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return c;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "svg",
            {
              staticStyle: { overflow: "visible" },
              attrs: {
                viewBox: "0 0 24 24",
                version: "1.1",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
              },
            },
            [
              t(
                "g",
                {
                  attrs: {
                    stroke: "none",
                    "stroke-width": "1",
                    fill: "none",
                    "fill-rule": "evenodd",
                  },
                },
                [
                  t("g", { attrs: { transform: "translate(-771, -3415)" } }, [
                    t("g", { attrs: { transform: "translate(635, 3407)" } }, [
                      t("g", { attrs: { transform: "translate(136, 8)" } }, [
                        t("polyline", {
                          staticClass: "icon-color",
                          attrs: {
                            "stroke-width": "2",
                            "stroke-linecap": "round",
                            "stroke-linejoin": "round",
                            transform:
                              "translate(13, 12) rotate(-90) translate(-13, -12)",
                            points: "21 9 12.9271691 15 5 9",
                          },
                        }),
                      ]),
                    ]),
                  ]),
                ]
              ),
            ]
          );
        },
        o = [],
        i = { name: "SvgArrow" },
        r = i,
        l = a(1001),
        s = (0, l.Z)(r, n, o, !1, null, "71f883a4", null),
        c = s.exports;
    },
    20071: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return h;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t("div", { class: e.isCare ? "userInfo-care" : "userInfo" }, [
            t(
              "div",
              { staticClass: "info-top" },
              [
                e.isCare
                  ? [
                      t(
                        "span",
                        {
                          directives: [
                            {
                              name: "speech",
                              rawName: "v-speech",
                              value: e.readPhone,
                              expression: "readPhone",
                            },
                          ],
                          staticClass: "phoneNumber",
                        },
                        [e._v(e._s(e.userInfo.phoneMask))]
                      ),
                      t("span", { staticClass: "name" }, [
                        e._v(e._s(e.userName)),
                      ]),
                    ]
                  : [
                      t("span", { staticClass: "phoneNumber" }, [
                        e._v(e._s(e.userInfo.phoneMask)),
                      ]),
                      t("span", { staticClass: "name" }, [
                        e._v(e._s(e.userName)),
                      ]),
                      e._t("topExtra"),
                    ],
              ],
              2
            ),
            t(
              "div",
              { staticClass: "info-bottom" },
              [
                e.brandImg
                  ? [
                      e.brandFlexibleData && e.isGotone
                        ? t(
                            "flexible-point",
                            {
                              staticClass: "tags-wrap",
                              attrs: {
                                "flexible-data": e.flexibleImpData(
                                  e.brandFlexibleData
                                ),
                              },
                            },
                            [
                              e.brandImg
                                ? t("img", {
                                    staticClass: "tags",
                                    attrs: { src: e.brandImg, alt: "" },
                                    on: { click: e.brandClick },
                                  })
                                : e._e(),
                            ]
                          )
                        : t("img", {
                            staticClass: "tags",
                            attrs: { src: e.brandImg, alt: "" },
                            on: { click: e.brandClick },
                          }),
                    ]
                  : e._e(),
                !e.starLevelImg || e.hiddenStar || e.isGotone
                  ? e._e()
                  : t("img", {
                      staticClass: "tags",
                      attrs: { src: e.starLevelImg, alt: "" },
                    }),
              ],
              2
            ),
          ]);
        },
        o = [],
        i = (a(26699), a(26294)),
        r = a(15222),
        l = a(30001),
        s = a(5101),
        c = a(15744),
        u = {
          name: "UserInfoApp",
          components: { FlexiblePoint: s.Z },
          props: { brandFlexibleData: null },
          data() {
            return {};
          },
          computed: {
            ...(0, i.mapState)(["userInfo"]),
            ...(0, i.mapState)("common", {
              userName: (e) => e.userName,
              gsmState: (e) => e.gsmState,
              userBrand: (e) => e.userBrand,
              starLevel: (e) => e.starLevel,
            }),
            ...(0, i.mapState)({
              hideStarProvince: (e) => e.remoteState.WMH_APP_hide_star_province,
            }),
            ...(0, i.mapGetters)(["pageGroup", "pageName"]),
            isCare() {
              return "care" === this.pageGroup;
            },
            isGotone() {
              return ["0", "1", "2", "3", "4", "5", "8"].includes(
                this.gsmState
              );
            },
            brandImg() {
              let e = this.isCare ? "-care" : "",
                t = "";
              switch (
                (e
                  ? (t = "-care")
                  : this.brandFlexibleData && this.isGotone && (t = "-arrow"),
                this.gsmState)
              ) {
                case "0":
                case "1":
                case "2":
                case "3":
                  return (0, r.av)(
                    `/cmcc-service/img/app/brand${this.gsmState}${t}.png?t=20240830`
                  );
                case "4":
                case "5":
                  return (0, r.av)(`/cmcc-service/img/app/brand4${t}.png`);
                case "8":
                  return (0, r.av)(`/cmcc-service/img/app/brand8${t}.png`);
                default:
                  return "03" === this.userBrand
                    ? (0, r.av)(
                        `/cmcc-service/img/app/brand-donggandidai${t}.png`
                      )
                    : "";
              }
            },
            starLevelImg() {
              let e = this.isCare ? "-care" : "";
              switch (this.starLevel) {
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                  return (0, r.av)(
                    `/cmcc-service/img/app/starLevel${this.starLevel}${e}.png`
                  );
                default:
                  return "";
              }
            },
            readPhone() {
              return this.userInfo.phoneMask
                ? `尊敬的${
                    this.isGotone ? "全球通用户" : "用户"
                  }，您好，您的手机尾号${this.userInfo.phoneMask.slice(-4)}`
                : "";
            },
            hiddenStar() {
              return JSON.parse(this.hideStarProvince).includes(
                this.userInfo.loginProvince
              );
            },
          },
          methods: {
            flexibleImpData(e) {
              var t, a;
              let n = Object.assign({}, e);
              return (
                (n.otherParams = {
                  WT_area_type_1: "楼层",
                  WT_area_type_2: "个人信息区",
                  area_id:
                    (null === (t = c.Z[this.pageName]) ||
                    void 0 === t ||
                    null === (a = t.areaId) ||
                    void 0 === a
                      ? void 0
                      : a.fixedId[0]) + "_",
                  WT_area_name: "个人信息区",
                  XY_env_type: "button",
                }),
                n
              );
            },
            brandClick() {
              var e, t, a;
              let n = {
                WT_area_type_1: "楼层",
                WT_area_type_2: "个人信息区",
                WT_area_name: "个人信息区",
                XY_env_type: "button",
                XY_gd_source:
                  null === (e = this.brandFlexibleData) || void 0 === e
                    ? void 0
                    : e.source,
                area_id:
                  (null === (t = c.Z[this.pageName]) ||
                  void 0 === t ||
                  null === (a = t.areaId) ||
                  void 0 === a
                    ? void 0
                    : a.fixedId[0]) + "_",
              };
              console.log("brandClick--app", this.brandFlexibleData),
                this.brandFlexibleData &&
                  this.isGotone &&
                  (0, l.E)(this.brandFlexibleData, n);
            },
          },
        },
        d = u,
        m = a(1001),
        p = (0, m.Z)(d, n, o, !1, null, "70874012", null),
        h = p.exports;
    },
    5101: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return m;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "pull-app-point",
            {
              staticClass: "flexible-wrapper",
              attrs: { "pulling-type-location": "1" },
              on: { launchClick: e.launchClick },
            },
            [
              e.preventMarketClick
                ? t("div", { staticClass: "flexible-overlay" })
                : e._e(),
              e._t("default"),
            ],
            2
          );
        },
        o = [],
        i = a(42094),
        r = a(42642),
        l = a(87630),
        s = {
          name: "FlexiblePoint",
          components: { PullAppPoint: l.Z },
          props: {
            flexibleData: null,
            areaId: { type: String, default: "" },
            pointName: { type: String, default: "" },
          },
          data() {
            return { preventMarketClick: !1 };
          },
          mounted() {
            (0, i.L)({
              element: () => this.$el,
              handler: (e) => {
                if (e) {
                  let e = this.flexibleData,
                    t = "";
                  t =
                    "qqd" === (null === e || void 0 === e ? void 0 : e.source)
                      ? e.markId
                      : e.advBusiType + "_" + e.markId;
                  let a = {
                    WT_et: "imp",
                    WT_envName:
                      e.markTitle ||
                      e.vSubject1 ||
                      e.vSubject ||
                      e.activityName,
                    WT_markId: t,
                    WT_event: e.channelId,
                    WT_next_url: e.vLinkUrl,
                    WT_es: window.location.href,
                    WT_ti: document.title,
                  };
                  return (
                    e.otherParams
                      ? (0, r.Z)("imp", Object.assign(a, e.otherParams))
                      : (0, r.Z)("imp", a),
                    !0
                  );
                }
              },
            });
          },
          methods: {
            launchClick() {
              (this.preventMarketClick = !0), console.log("market-launchClick");
            },
          },
        },
        c = s,
        u = a(1001),
        d = (0, u.Z)(c, n, o, !1, null, "1d5f1a5e", null),
        m = d.exports;
    },
    93879: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return p;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: e.show,
                  expression: "show",
                },
              ],
              ref: "FloatButtonTemplate",
              staticClass: "draggable-wrapper",
              style: [{ top: e.posY + "px" }, { left: e.posX + "px" }],
              on: {
                touchstart: e.onTouchStart,
                touchmove: function (t) {
                  return (
                    t.preventDefault(), e.onTouchMove.apply(null, arguments)
                  );
                },
                touchend: e.onTouchEnd,
              },
            },
            [
              t(
                "pull-app-point",
                e._b(
                  {
                    staticClass: "pull-app-wrapper",
                    on: { nonLaunchClick: e.goPage },
                  },
                  "pull-app-point",
                  { pullingTypeLocation: "1" },
                  !1
                ),
                [
                  t("div", {
                    staticClass: "float-img",
                    style: [
                      e.floatArea.imageUrl && {
                        "background-image": `url(${e.floatArea.imageUrl})`,
                      },
                    ],
                  }),
                ]
              ),
              t("img", {
                staticClass: "close",
                attrs: { src: a(86644), alt: "" },
                on: {
                  click: function (t) {
                    return t.stopPropagation(), e.close.apply(null, arguments);
                  },
                },
              }),
            ],
            1
          );
        },
        o = [],
        i = a(26294),
        r = a(42642),
        l = a(30001),
        s = a(87630),
        c = {
          name: "FloatButtonTemplate",
          components: { PullAppPoint: s.Z },
          data() {
            return {
              isDragging: !1,
              startX: 0,
              startY: 0,
              posX: "",
              posY: "",
              pageWidth: 0,
              pageHeight: 0,
              show: !1,
            };
          },
          computed: {
            ...(0, i.mapState)({
              userInfo: (e) => e.userInfo,
              floatArea: (e) => e.market.floatArea,
            }),
          },
          mounted() {
            (this.show = !!this.floatArea.imageUrl),
              (this.pageWidth = document.documentElement.clientWidth),
              (this.pageHeight = document.documentElement.clientHeight),
              this.$nextTick(() => {
                setTimeout(() => {
                  (this.posX = this.$refs.FloatButtonTemplate.offsetLeft),
                    (this.posY = this.$refs.FloatButtonTemplate.offsetTop);
                }, 300);
              }),
              this.init();
          },
          methods: {
            init() {
              this.setGdpParams("imp");
            },
            setGdpParams(e) {
              try {
                let t = this.floatArea,
                  a = "";
                a =
                  "qqd" === t.source
                    ? t.markId
                    : t.advBusiType + "_" + t.markId;
                let n = {
                  area_id: t.areaId + "_" + t.channelId,
                  WT_area_type_1: "浮窗",
                  XY_gd_source: t.source,
                  WT_et: "imp" === e ? "imp" : "clk",
                  WT_envName: "imp" === e ? "弹出" : "关闭",
                  WT_markId: a,
                  WT_event: t.channelId,
                  WT_next_url: t.vLinkUrl,
                  WT_area_name: t.vSubject1 || t.vSubject,
                };
                (0, r.Z)(e, n);
              } catch (t) {
                console.log(t, "浮窗插码--catch-");
              }
            },
            onTouchStart(e) {
              (this.isDragging = !0),
                (this.startX = e.touches[0].clientX - this.posX),
                (this.startY = e.touches[0].clientY - this.posY);
            },
            onTouchMove(e) {
              if (!this.isDragging) return;
              let t = e.touches[0].clientX - this.startX,
                a = e.touches[0].clientY - this.startY;
              t < 0 && (t = 0),
                t + this.$el.clientWidth > this.pageWidth &&
                  (t = this.pageWidth - this.$el.clientWidth),
                a < 0
                  ? (a = 0)
                  : a + this.$el.clientHeight > this.pageHeight &&
                    (a = this.pageHeight - this.$el.clientHeight),
                (this.posX = t),
                (this.posY = a);
            },
            onTouchEnd() {
              this.isDragging = !1;
            },
            goPage() {
              let e = {
                WT_area_type_1: "浮窗",
                XY_env_type: "pic",
                WT_area_name:
                  this.floatArea.vSubject1 || this.floatArea.vSubject,
                area_id: this.floatArea.areaId + "_" + this.floatArea.channelId,
              };
              (0, l.E)(this.floatArea, e);
            },
            close() {
              (this.show = !1), this.setGdpParams("clk");
            },
          },
        },
        u = c,
        d = a(1001),
        m = (0, d.Z)(u, n, o, !1, null, "128e423d", null),
        p = m.exports;
    },
    35433: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return _a;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            e._l(e.moduleList, function (a, n) {
              return t(
                "pull-app-point",
                {
                  key: n,
                  class: ["section", "section" + n],
                  attrs: { "pulling-type-location": "1" },
                  on: { launchClick: e.launchClick },
                },
                [
                  e.preventMarketClick
                    ? t("div", { staticClass: "section-overlay" })
                    : e._e(),
                  "market-noticeText-1-001" === a.moduleId &&
                  0 !== a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("NoticeBarTemplate", {
                            attrs: {
                              data: a,
                              cusLeftIcon: "text",
                              cusIsClose: !1,
                              indexInArea: n,
                            },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-noticeText-2-001" === a.moduleId &&
                  0 !== a.adverList.length
                    ? t(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: !e.noticeBarCloseStatus[n],
                              expression: "!noticeBarCloseStatus[index]",
                            },
                          ],
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("NoticeBarTemplate", {
                            attrs: {
                              data: a,
                              cusLeftIcon: "text",
                              cusIsClose: !0,
                              indexInArea: n,
                            },
                            on: { onClose: e.noticeClose },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-noticeIcon-1-001" === a.moduleId &&
                  0 !== a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("NoticeBarTemplate", {
                            attrs: {
                              data: a,
                              cusLeftIcon: "icon",
                              cusIsClose: !1,
                              indexInArea: n,
                            },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-noticeIcon-2-001" === a.moduleId &&
                  0 !== a.adverList.length
                    ? t(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: !e.noticeBarCloseStatus[n],
                              expression: "!noticeBarCloseStatus[index]",
                            },
                          ],
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("NoticeBarTemplate", {
                            attrs: {
                              data: a,
                              cusLeftIcon: "icon",
                              cusIsClose: !0,
                              indexInArea: n,
                            },
                            on: { onClose: e.noticeClose },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  ("market-icon-1-001" === a.moduleId &&
                    2 === a.adverList.length) ||
                  ("market-icon-1-002" === a.moduleId &&
                    3 === a.adverList.length)
                    ? t(
                        "div",
                        { class: [e.tab ? "" : "section-box"] },
                        [
                          t("IconAcrossTemplate", {
                            attrs: { data: a, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  ("market-icon-2-001" === a.moduleId &&
                    2 === a.adverList.length) ||
                  ("market-icon-2-002" === a.moduleId &&
                    3 === a.adverList.length) ||
                  ("market-icon-2-003" === a.moduleId &&
                    4 === a.adverList.length) ||
                  ("market-icon-2-004" === a.moduleId &&
                    5 === a.adverList.length)
                    ? t(
                        "div",
                        { class: [e.tab ? "" : "section-box"] },
                        [
                          t("IconVerticalTemplate", {
                            attrs: { data: a, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-icon-3-001" === a.moduleId && 3 === a.adverList.length
                    ? t(
                        "div",
                        { class: [e.tab ? "" : "section-box"] },
                        [
                          t("IconTitleTemplate", {
                            attrs: { data: a, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-banner-1-001" === a.moduleId &&
                  0 !== a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("BannerTemplate", {
                            attrs: {
                              data: a,
                              tab: e.tab,
                              frameBannerNum: 1,
                              indexInArea: n,
                            },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-banner-2-001" === a.moduleId &&
                  a.adverList.length >= 2
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("BannerTemplate", {
                            attrs: {
                              data: a,
                              tab: e.tab,
                              frameBannerNum: 2,
                              indexInArea: n,
                            },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-banner-3-001" === a.moduleId &&
                  a.adverList.length >= 3
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("BannerTemplate", {
                            attrs: {
                              data: a,
                              tab: e.tab,
                              frameBannerNum: 3,
                              indexInArea: n,
                            },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-button-1-001" === a.moduleId &&
                  2 === a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                          staticStyle: { padding: "0" },
                          style: e.suctionBottom ? "margin: 0;" : "",
                        },
                        [
                          t("ButtonTemplate1", {
                            attrs: { data: a, tab: e.tab, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-button-2-001" === a.moduleId &&
                  3 === a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                          staticStyle: { padding: "0" },
                          style: e.suctionBottom ? "margin: 0;" : "",
                        },
                        [
                          t("ButtonTemplate2", {
                            attrs: { data: a, tab: e.tab, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-textButton-1-001" === a.moduleId &&
                  0 !== a.adverList.length
                    ? t(
                        "div",
                        { class: [e.tab ? "" : "section-box"] },
                        [
                          t("TextButtonTemplate", {
                            attrs: { data: a, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-card-1-001" === a.moduleId && 2 === a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("CardTemplate1", {
                            attrs: { data: a, tab: e.tab, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-card-2-001" === a.moduleId && 2 === a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("CardTemplate2", {
                            attrs: { data: a, tab: e.tab, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-card-3-001" === a.moduleId && 2 === a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("CardTemplate3", {
                            attrs: { data: a, tab: e.tab, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-card-4-001" === a.moduleId && 3 === a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("CardTemplate4", {
                            attrs: { data: a, tab: e.tab, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-tab-1-001" === a.moduleId
                    ? t(
                        "div",
                        { class: [e.tab ? "" : "section-box"] },
                        [
                          t("TabTemplate", {
                            attrs: { data: a, type: "1", indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-tab-2-001" === a.moduleId
                    ? t(
                        "div",
                        { class: [e.tab ? "" : "section-box"] },
                        [
                          t("TabTemplate", {
                            attrs: { data: a, type: "2", indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-tab-3-001" === a.moduleId
                    ? t(
                        "div",
                        { class: [e.tab ? "" : "section-box"] },
                        [
                          t("TabTemplate", {
                            attrs: { data: a, type: "3", indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market_reminder_001" === a.moduleId
                    ? t(
                        "div",
                        { staticClass: "section-box" },
                        [
                          t("ReminderTemplate", {
                            class: [
                              e.tab ? "section-noticeIn" : "section-noticeOut",
                            ],
                            attrs: { data: a, tab: e.tab, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-slice-001" === a.moduleId
                    ? t(
                        "div",
                        { staticClass: "section-box" },
                        [
                          t("FlowSliceTemplate", {
                            attrs: { sliceData: a, indexInArea: n },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-cube-001" === a.moduleId
                    ? t(
                        "div",
                        [
                          t("CubeTemplate", {
                            attrs: {
                              pluginContainerTag: e.pluginContainerTag,
                              data: a,
                              indexInArea: n,
                            },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-banner-5-001" === a.moduleId &&
                  0 !== a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("BannerWideTemplate", {
                            attrs: { data: a, tab: e.tab },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                  "market-banner-4-001" === a.moduleId &&
                  0 !== a.adverList.length
                    ? t(
                        "div",
                        {
                          class: [
                            e.tab ? "section-box1" : "section-box",
                            { "section-mt18": a.Special },
                          ],
                        },
                        [
                          t("BannerNarrowTemplate", {
                            attrs: { data: a, tab: e.tab },
                          }),
                        ],
                        1
                      )
                    : e._e(),
                ]
              );
            }),
            1
          );
        },
        o = [],
        i =
          (a(2490),
          a(34514),
          function () {
            var e = this,
              t = e._self._c;
            return t(
              "div",
              { staticClass: "noticeBarTemplate", class: [e.type] },
              [
                t("div", { staticClass: "noticeBarTemplate-left" }, [
                  "text" === e.leftIcon
                    ? t("div", { staticClass: "noticeBarTemplate-left-text" }, [
                        t("div", { staticClass: "tag" }, [
                          e._v(" " + e._s(e.leftText) + " "),
                        ]),
                      ])
                    : e._e(),
                  "icon" === e.leftIcon
                    ? t("div", { staticClass: "noticeBarTemplate-left-icon" }, [
                        t("img", {
                          staticClass: "icon",
                          attrs: { src: e.leftIconUrl },
                        }),
                      ])
                    : e._e(),
                ]),
                t(
                  "div",
                  { staticClass: "noticeBarTemplate-content" },
                  [
                    e.roll
                      ? t("div", { staticClass: "shadow-left" }, [
                          "default" === e.type
                            ? t("img", {
                                staticClass: "img",
                                attrs: { src: a(59638) },
                              })
                            : e._e(),
                          "primary" === e.type
                            ? t("img", {
                                staticClass: "img",
                                attrs: { src: a(46924) },
                              })
                            : e._e(),
                          "success" === e.type
                            ? t("img", {
                                staticClass: "img",
                                attrs: { src: a(3267) },
                              })
                            : e._e(),
                          "warning" === e.type
                            ? t("img", {
                                staticClass: "img",
                                attrs: { src: a(81896) },
                              })
                            : e._e(),
                        ])
                      : e._e(),
                    t("van-notice-bar", {
                      attrs: { scrollable: e.roll, text: e.noticeText },
                    }),
                    e.roll
                      ? t("div", { staticClass: "shadow-right" }, [
                          "default" === e.type
                            ? t("img", {
                                staticClass: "img",
                                attrs: { src: a(50932) },
                              })
                            : e._e(),
                          "primary" === e.type
                            ? t("img", {
                                staticClass: "img",
                                attrs: { src: a(32521) },
                              })
                            : e._e(),
                          "success" === e.type
                            ? t("img", {
                                staticClass: "img",
                                attrs: { src: a(42139) },
                              })
                            : e._e(),
                          "warning" === e.type
                            ? t("img", {
                                staticClass: "img",
                                attrs: { src: a(59780) },
                              })
                            : e._e(),
                        ])
                      : e._e(),
                  ],
                  1
                ),
                t("div", { staticClass: "noticeBarTemplate-right" }, [
                  "text" === e.rightIcon && e.rightShow
                    ? t(
                        "div",
                        {
                          staticClass: "noticeBarTemplate-right-text",
                          on: {
                            click: function (t) {
                              return e.marketSectionClick(
                                e.item,
                                e.otherParams
                              );
                            },
                          },
                        },
                        [
                          t("div", { staticClass: "text" }, [
                            e._v(" " + e._s(e.rightText) + " "),
                          ]),
                          e.isClose
                            ? e._e()
                            : t("div", { staticClass: "icon" }, [
                                t("img", {
                                  staticClass: "img",
                                  attrs: { src: a(35751) },
                                }),
                              ]),
                        ]
                      )
                    : e._e(),
                  "button" === e.rightIcon && e.rightShow
                    ? t(
                        "div",
                        {
                          staticClass: "noticeBarTemplate-right-button",
                          on: {
                            click: function (t) {
                              return e.marketSectionClick(
                                e.item,
                                e.otherParams
                              );
                            },
                          },
                        },
                        [
                          t("div", { staticClass: "button" }, [
                            e._v(" " + e._s(e.rightText) + " "),
                          ]),
                        ]
                      )
                    : e._e(),
                  e.isClose
                    ? t(
                        "div",
                        {
                          staticClass: "noticeBarTemplate-right-close",
                          on: { click: e.onClose },
                        },
                        [
                          t("img", {
                            staticClass: "icon",
                            attrs: { src: a(95738) },
                          }),
                        ]
                      )
                    : e._e(),
                ]),
              ]
            );
          }),
        r = [],
        l = (a(65138), a(64469)),
        s = a(26294),
        c = a(30001),
        u = a(42094),
        d = a(42642),
        m = a(72856),
        p = a(23692),
        h = {
          mounted() {
            (0, u.L)({
              element: this.$el,
              handler: (e) => {
                if (e) {
                  let e = this.data.adverList;
                  if (e && e.length > 0) {
                    let t = "",
                      a = {};
                    return (
                      e.forEach((e) => {
                        var n, o, i, r, l, s;
                        ((t =
                          "qqd" === e.source
                            ? e.markId
                            : e.advBusiType + "_" + e.markId),
                        "NoticeBarTemplate" !== this.$options.name)
                          ? ((a = {
                              WT_et: "imp",
                              area_id:
                                (null === (n = this.data) || void 0 === n
                                  ? void 0
                                  : n.areaId) +
                                "_" +
                                (null === (o = this.data) || void 0 === o
                                  ? void 0
                                  : o.moduleId),
                              type: "once",
                              WT_area_type_1: "楼层",
                              WT_area_type_2: "营销区域",
                              WT_area_name:
                                (null === (i = this.data) || void 0 === i
                                  ? void 0
                                  : i.areaName) || "",
                            }),
                            (a[e.channelId] = JSON.stringify({
                              WT_envName:
                                e.markTitle ||
                                e.vSubject1 ||
                                e.vSubject ||
                                e.activityName,
                              WT_markId: t,
                              WT_event: e.channelId,
                              WT_next_url: e.vLinkUrl,
                              XY_brand_info:
                                p.gsmStateMap[
                                  null === (r = m["default"].state.userInfo) ||
                                  void 0 === r
                                    ? void 0
                                    : r.gsmState
                                ] || "其他非全球通用户",
                              XY_gd_source: e.source,
                              XY_point_position:
                                null === e || void 0 === e
                                  ? void 0
                                  : e.adverLocation,
                            })))
                          : (a = {
                              WT_et: "imp",
                              area_id:
                                this.data.areaId + "_" + this.data.moduleId,
                              WT_envName:
                                e.markTitle ||
                                e.vSubject1 ||
                                e.vSubject ||
                                e.activityName,
                              WT_markId: t,
                              WT_event: e.channelId,
                              WT_next_url: e.vLinkUrl,
                              XY_brand_info:
                                p.gsmStateMap[
                                  null === (l = m["default"].state.userInfo) ||
                                  void 0 === l
                                    ? void 0
                                    : l.gsmState
                                ] || "其他非全球通用户",
                              XY_gd_source: e.source,
                              XY_point_position:
                                null === e || void 0 === e
                                  ? void 0
                                  : e.adverLocation,
                              WT_area_type_1: "楼层",
                              WT_area_type_2: "横幅提示条",
                              WT_area_name:
                                (null === (s = this.data) || void 0 === s
                                  ? void 0
                                  : s.areaName) || "",
                            });
                        (0, d.Z)("imp", a);
                      }),
                      !0
                    );
                  }
                }
              },
            });
          },
        },
        f = {
          name: "NoticeBarTemplate",
          mixins: [h],
          components: { VanNoticeBar: l.Z },
          props: ["data", "cusLeftIcon", "cusIsClose", "indexInArea"],
          data() {
            return {
              type: "warning",
              roll: !1,
              leftIcon: "icon",
              leftText: "四字标签",
              leftIconUrl: "",
              rightIcon: "text",
              rightText: "订购流量",
              isClose: !1,
              noticeText: "",
              item: null,
              rightShow: !1,
            };
          },
          computed: {
            ...(0, s.mapState)({ userInfo: (e) => e.userInfo }),
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "横幅提示条",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          watch: {
            data: {
              handler(e) {
                if (e.adverList && 0 !== e.adverList.length) {
                  const t = e.adverList[0];
                  (this.item = t),
                    t.imageUrl && (this.leftIconUrl = t.imageUrl),
                    t.tagTxt && (this.leftText = t.tagTxt),
                    t.mainTxt && (this.noticeText = t.mainTxt),
                    t.linkTxt && (this.rightText = t.linkTxt),
                    "0" == t.colorMatch && (this.type = "warning"),
                    "1" == t.colorMatch && (this.type = "default"),
                    this.noticeText.length > 18 && (this.roll = !0),
                    t.linkTxt && t.vLinkUrl && (this.rightShow = !0);
                }
              },
              deep: !0,
              immediate: !0,
            },
          },
          mounted() {
            this.init();
          },
          methods: {
            marketSectionClick: c.E,
            init() {
              this.cusLeftIcon && (this.leftIcon = this.cusLeftIcon),
                this.cusIsClose && (this.isClose = this.cusIsClose);
            },
            onClose() {
              this.$emit("onClose", this.indexInArea);
            },
          },
        },
        g = f,
        v = a(1001),
        A = (0, v.Z)(g, i, r, !1, null, "45203f82", null),
        y = A.exports,
        T = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "iconAcrossTemplate" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  staticClass: "iconAcrossTemplate-item",
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [
                  t("div", { staticClass: "iconAcrossTemplate-item-icon" }, [
                    t("img", { attrs: { src: a.imageUrl } }),
                  ]),
                  t("div", { staticClass: "iconAcrossTemplate-item-title" }, [
                    e._v(" " + e._s(e.cutOutStr(a.vSubject1, 5)) + " "),
                  ]),
                ]
              );
            }),
            0
          );
        },
        S = [],
        I = a(2780),
        b = {
          name: "IconAcrossTemplate",
          mixins: [h],
          props: ["data", "indexInArea"],
          computed: {
            ...(0, s.mapState)({ userInfo: (e) => e.userInfo }),
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E, cutOutStr: I.Ds },
        },
        C = b,
        w = (0, v.Z)(C, T, S, !1, null, "3e78d312", null),
        _ = w.exports,
        k = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "iconVerticalTemplate" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  staticClass: "iconVerticalTemplate-item",
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [
                  t("div", { staticClass: "iconVerticalTemplate-item-icon" }, [
                    t("img", { attrs: { src: a.imageUrl } }),
                  ]),
                  t("div", { staticClass: "iconVerticalTemplate-item-title" }, [
                    e._v(" " + e._s(e.cutOutStr(a.vSubject1, 5)) + " "),
                  ]),
                ]
              );
            }),
            0
          );
        },
        N = [],
        P = {
          name: "IconVerticalTemplate",
          mixins: [h],
          components: {},
          props: ["data", "indexInArea"],
          computed: {
            ...(0, s.mapState)({ userInfo: (e) => e.userInfo }),
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { cutOutStr: I.Ds, marketSectionClick: c.E },
        },
        B = P,
        L = (0, v.Z)(B, k, N, !1, null, "181393a2", null),
        D = L.exports,
        E = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "iconTitleTemplate sectionDom" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  staticClass: "iconTitleTemplate-item",
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [
                  t("div", { staticClass: "iconTitleTemplate-item-icon" }, [
                    t("img", { attrs: { src: a.imageUrl } }),
                  ]),
                  t("div", { staticClass: "iconTitleTemplate-item-title" }, [
                    e._v(" " + e._s(e.cutOutStr(a.vSubject1, 5)) + " "),
                  ]),
                  t("div", { staticClass: "iconTitleTemplate-item-hint" }, [
                    e._v(" " + e._s(e.cutOutStr(a.vSubject2, 6)) + " "),
                  ]),
                ]
              );
            }),
            0
          );
        },
        x = [],
        M = {
          name: "IconTitleTemplate",
          mixins: [h],
          props: ["data", "indexInArea"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { cutOutStr: I.Ds, marketSectionClick: c.E },
        },
        W = M,
        R = (0, v.Z)(W, E, x, !1, null, "5d8e5f4e", null),
        O = R.exports,
        U = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "bannerTemplate" },
            [
              t(
                "van-swipe",
                {
                  ref: "swipe",
                  staticClass: "bannerTemplate-swipe",
                  attrs: { autoplay: 3e3 },
                  on: { change: e.onChange },
                  scopedSlots: e._u([
                    {
                      key: "indicator",
                      fn: function () {
                        return [
                          e.list.length > 1
                            ? t("div", { staticClass: "custom-indicator" }, [
                                e._v(
                                  e._s(e.current + 1) +
                                    "/" +
                                    e._s(e.list.length)
                                ),
                              ])
                            : e._e(),
                        ];
                      },
                      proxy: !0,
                    },
                  ]),
                },
                e._l(e.list, function (a, n) {
                  return t(
                    "van-swipe-item",
                    {
                      key: n,
                      class: [
                        e.tab
                          ? "bannerTemplate-swipe-item1"
                          : "bannerTemplate-swipe-item",
                        "bannerTemplateAll",
                      ],
                    },
                    [
                      1 === e.frameBannerNum
                        ? t("BannerSingleTemplate", {
                            attrs: {
                              data: a,
                              tab: e.tab,
                              gdpProps: e.gdpProps,
                            },
                          })
                        : e._e(),
                      2 === e.frameBannerNum
                        ? t("BannerCoupleTemplate", {
                            attrs: {
                              data: a,
                              tab: e.tab,
                              gdpProps: e.gdpProps,
                            },
                          })
                        : e._e(),
                      3 === e.frameBannerNum
                        ? t("BannerThreeTemplate", {
                            attrs: {
                              data: a,
                              tab: e.tab,
                              gdpProps: e.gdpProps,
                            },
                          })
                        : e._e(),
                    ],
                    1
                  );
                }),
                1
              ),
            ],
            1
          );
        },
        F = [],
        Z = (a(60332), a(62602)),
        V = (a(95196), a(53121)),
        Q =
          (a(26699),
          a(59849),
          function () {
            var e = this,
              t = e._self._c;
            return t(
              "div",
              { staticClass: "bannerSingleTemplate" },
              e._l(e.data, function (a, n) {
                return t(
                  "div",
                  {
                    key: n,
                    class: [
                      e.tab
                        ? "bannerSingleTemplate-item1"
                        : "bannerSingleTemplate-item",
                    ],
                    on: {
                      click: function (t) {
                        return e.marketSectionClick(a, e.otherParams);
                      },
                    },
                  },
                  [
                    t("img", { attrs: { src: a.imageUrl } }),
                    "1" == a.adverLabel
                      ? t("span", { staticClass: "cormark" })
                      : e._e(),
                  ]
                );
              }),
              0
            );
          }),
        Y = [],
        G = {
          name: "BannerSingleTemplate",
          props: ["data", "tab", "gdpProps"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.gdpProps.areaName,
                area_id: this.gdpProps.areaId + "_" + this.gdpProps.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        j = G,
        q = (0, v.Z)(j, Q, Y, !1, null, "25734cbb", null),
        H = q.exports,
        J = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "bannerCoupleTemplate" },
            e._l(e.data, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  class: [
                    e.tab
                      ? "bannerCoupleTemplate-item1"
                      : "bannerCoupleTemplate-item",
                  ],
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [
                  t("img", { attrs: { src: a.imageUrl } }),
                  "1" == a.adverLabel
                    ? t("span", { staticClass: "cormark" })
                    : e._e(),
                ]
              );
            }),
            0
          );
        },
        z = [],
        X = {
          name: "BannerCoupleTemplate",
          props: ["data", "tab", "gdpProps"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.gdpProps.areaName,
                area_id: this.gdpProps.areaId + "_" + this.gdpProps.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        K = X,
        $ = (0, v.Z)(K, J, z, !1, null, "5528faa6", null),
        ee = $.exports,
        te = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "bannerThreeTemplate" },
            e._l(e.data, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  class: [
                    e.tab
                      ? "bannerThreeTemplate-item1"
                      : "bannerThreeTemplate-item",
                  ],
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [
                  t("img", { attrs: { src: a.imageUrl } }),
                  "1" == a.adverLabel
                    ? t("span", { staticClass: "cormark" })
                    : e._e(),
                ]
              );
            }),
            0
          );
        },
        ae = [],
        ne = {
          name: "BannerThreeTemplate",
          props: ["data", "tab", "gdpProps"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.gdpProps.areaName,
                area_id: this.gdpProps.areaId + "_" + this.gdpProps.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        oe = ne,
        ie = (0, v.Z)(oe, te, ae, !1, null, "3bba6fbe", null),
        re = ie.exports,
        le = a(11671),
        se = {
          name: "BannerTemplate",
          components: {
            VanSwipe: V.Z,
            VanSwipeItem: Z.Z,
            BannerSingleTemplate: H,
            BannerCoupleTemplate: ee,
            BannerThreeTemplate: re,
          },
          props: ["data", "frameBannerNum", "tab", "indexInArea"],
          errorCaptured(e, t, a) {
            return !1;
          },
          data() {
            return {
              current: 0,
              isVisible: !1,
              alreadyTrace: [],
              gdpProps: { areaId: "", areaName: "", moduleId: "" },
            };
          },
          watch: {
            data: {
              handler(e) {
                e &&
                  (this.gdpProps = {
                    areaId: e.areaId,
                    areaName: e.areaName,
                    moduleId: e.moduleId,
                  });
              },
              immediate: !0,
            },
          },
          computed: {
            ...(0, s.mapState)({ userInfo: (e) => e.userInfo }),
            list() {
              if (this.data.adverList && this.data.adverList.length > 0) {
                let e = this.data.adverList,
                  t = [];
                return (t = this.arraySlice(e, this.frameBannerNum)), t;
              }
              return [];
            },
          },
          mounted() {
            this.tab &&
              le.Z.$on("resizeBannerSwipe", () => {
                console.log("resizeBanner"), this.$refs.swipe.resize();
              }),
              (0, u.L)({
                element: this.$el,
                handler: (e) => (
                  (this.isVisible = e), e && this.setTrace(), !1
                ),
              });
          },
          destroyed() {
            le.Z.$off("resizeBannerSwipe");
          },
          methods: {
            onChange(e) {
              (this.current = e), this.isVisible && this.setTrace();
            },
            arraySlice(e, t) {
              let a = [],
                n = 1;
              n = 1 == t ? 1 : 9;
              for (let o = 0; o < e.length; o++)
                if (e[o] && e[o].adverLocation) {
                  let i = (Number(e[o].adverLocation) - 1) % n;
                  9 == n
                    ? a[i] instanceof Array
                      ? a[i].length < t && a[i].push(e[o])
                      : (a[i] = [e[o]])
                    : (a[o] = [e[o]]);
                }
              return (a = a.filter((e) => e.length == this.frameBannerNum)), a;
            },
            setTrace() {
              var e, t, a;
              if (this.alreadyTrace.includes(this.current)) return;
              this.alreadyTrace.push(this.current);
              let n = this.list[this.current],
                o = "",
                i = {
                  WT_et: "imp",
                  type: "once",
                  area_id:
                    (null === (e = this.data) || void 0 === e
                      ? void 0
                      : e.areaId) +
                    "_" +
                    (null === (t = this.data) || void 0 === t
                      ? void 0
                      : t.moduleId),
                  WT_area_type_1: "楼层",
                  WT_area_type_2: "营销区域",
                  WT_area_name:
                    null === (a = this.data) || void 0 === a
                      ? void 0
                      : a.areaName,
                };
              n &&
                n.length > 0 &&
                (n.forEach((e) => {
                  (o =
                    "qqd" === e.source
                      ? e.markId
                      : e.advBusiType + "_" + e.markId),
                    (i[e.channelId] = JSON.stringify({
                      WT_envName:
                        e.markTitle ||
                        e.vSubject1 ||
                        e.vSubject ||
                        e.activityName,
                      WT_markId: o,
                      WT_event: e.channelId,
                      WT_next_url: e.vLinkUrl,
                      XY_brand_info:
                        p.gsmStateMap[this.userInfo.gsmState] ||
                        "其他非全球通用户",
                      XY_gd_source: e.source,
                      XY_point_position: e.adverLocation,
                    }));
                }),
                (0, d.Z)("imp", i));
            },
          },
        },
        ce = se,
        ue = (0, v.Z)(ce, U, F, !1, null, "9f5f7ba8", null),
        de = ue.exports,
        me = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "TextButtonTemplate sectionDom" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  staticClass: "TextButtonTemplate-item",
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [e._v(" " + e._s(a.vSubject1.substr(0, 4)) + " ")]
              );
            }),
            0
          );
        },
        pe = [],
        he = {
          name: "TextButtonTemplate",
          mixins: [h],
          props: ["data", "indexInArea"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        fe = he,
        ge = (0, v.Z)(fe, me, pe, !1, null, "7562377e", null),
        ve = ge.exports,
        Ae = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "CardTemplate1 sectionDom" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  class: [e.tab ? "CardTemplate1-item1" : "CardTemplate1-item"],
                },
                [
                  t("div", { staticClass: "title" }, [
                    a.tagTxt
                      ? t("div", { staticClass: "title-tag" }, [
                          e._v(" " + e._s(a.tagTxt.substring(0, 2)) + " "),
                        ])
                      : e._e(),
                    t("div", { staticClass: "title-text" }, [
                      e._v(" " + e._s(a.vSubject1.substring(0, 8)) + " "),
                    ]),
                  ]),
                  t("div", { staticClass: "subTitle" }, [
                    e._v(" " + e._s(a.vSubject4.substring(0, 12)) + " "),
                  ]),
                  t("div", { staticClass: "item-bottom" }, [
                    t("div", { staticClass: "icon" }, [
                      t("img", { attrs: { src: a.imageUrl } }),
                    ]),
                    t("div", { staticClass: "hint" }, [
                      e._v(" " + e._s(a.vSubject5.substring(0, 10)) + " "),
                    ]),
                    t(
                      "div",
                      {
                        staticClass: "btn",
                        on: {
                          click: function (t) {
                            return e.marketSectionClick(a, e.otherParams);
                          },
                        },
                      },
                      [e._v(" " + e._s(a.vSubject3.substring(0, 6)) + " ")]
                    ),
                  ]),
                ]
              );
            }),
            0
          );
        },
        ye = [],
        Te = {
          name: "CardTemplate1",
          mixins: [h],
          props: ["data", "tab", "indexInArea"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        Se = Te,
        Ie = (0, v.Z)(Se, Ae, ye, !1, null, "25c44c6a", null),
        be = Ie.exports,
        Ce = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "CardTemplate2 sectionDom" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  class: [e.tab ? "CardTemplate2-item1" : "CardTemplate2-item"],
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [
                  t("div", { staticClass: "icon" }, [
                    t("img", { attrs: { src: a.imageUrl, alt: "" } }),
                  ]),
                  t("div", { staticClass: "content" }, [
                    t("div", { staticClass: "title" }, [
                      e._v(" " + e._s(a.vSubject1.substring(0, 6)) + " "),
                    ]),
                    t("div", { staticClass: "subTitle" }, [
                      e._v(" " + e._s(a.vSubject2.substring(0, 7)) + " "),
                    ]),
                  ]),
                ]
              );
            }),
            0
          );
        },
        we = [],
        _e = {
          name: "CardTemplate2",
          mixins: [h],
          props: ["data", "tab", "indexInArea"],
          computed: {
            otherParams() {
              var e, t;
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id:
                  (null === (e = this.data) || void 0 === e
                    ? void 0
                    : e.areaId) +
                  "_" +
                  (null === (t = this.data) || void 0 === t
                    ? void 0
                    : t.moduleId),
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        ke = _e,
        Ne = (0, v.Z)(ke, Ce, we, !1, null, "4d9e592d", null),
        Pe = Ne.exports,
        Be = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "CardTemplate3 sectionDom" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  class: [e.tab ? "CardTemplate3-item1" : "CardTemplate3-item"],
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [
                  t("div", { staticClass: "title" }, [
                    t("div", { staticClass: "title-text" }, [
                      e._v(" " + e._s(a.vSubject1.substring(0, 6)) + " "),
                    ]),
                    a.tagTxt
                      ? t("div", { staticClass: "title-tag" }, [
                          e._v(" " + e._s(a.tagTxt.substring(0, 4)) + " "),
                        ])
                      : e._e(),
                  ]),
                  t("div", { staticClass: "subTitle" }, [
                    e._v(" " + e._s(a.vSubject2.substring(0, 11)) + " "),
                  ]),
                ]
              );
            }),
            0
          );
        },
        Le = [],
        De = {
          name: "CardTemplate3",
          mixins: [h],
          props: ["data", "tab", "indexInArea"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        Ee = De,
        xe = (0, v.Z)(Ee, Be, Le, !1, null, "0371004f", null),
        Me = xe.exports,
        We = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "CardTemplate4 sectionDom" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  class: [e.tab ? "CardTemplate4-item1" : "CardTemplate4-item"],
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [
                  t("div", { staticClass: "title" }, [
                    e._v(" " + e._s(a.vSubject1.substring(0, 6)) + " "),
                  ]),
                  t(
                    "div",
                    {
                      staticClass: "tag",
                      class: { orange: "2" == a.vDiyParameter },
                    },
                    [e._v(" " + e._s(a.tagTxt.substring(0, 4)) + " ")]
                  ),
                ]
              );
            }),
            0
          );
        },
        Re = [],
        Oe = {
          name: "CardTemplate4",
          mixins: [h],
          props: ["data", "tab", "indexInArea"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        Ue = Oe,
        Fe = (0, v.Z)(Ue, We, Re, !1, null, "569edd06", null),
        Ze = Fe.exports,
        Ve = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "ButtonTemplate1 sectionDom" },
            e._l(e.data.adverList, function (a, n) {
              return t(
                "div",
                {
                  key: n,
                  class: [
                    e.tab ? "ButtonTemplate1-item1" : "ButtonTemplate1-item",
                  ],
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(a, e.otherParams);
                    },
                  },
                },
                [e._v(" " + e._s(a.vSubject3.substring(0, 6)) + " ")]
              );
            }),
            0
          );
        },
        Qe = [],
        Ye = {
          name: "ButtonTemplate1",
          mixins: [h],
          props: ["data", "tab", "indexInArea"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        Ge = Ye,
        je = (0, v.Z)(Ge, Ve, Qe, !1, null, "8af9f454", null),
        qe = je.exports,
        He = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "ButtonTemplate2 sectionDom" }, [
            t(
              "div",
              {
                class: [e.tab ? "icon1" : "icon"],
                on: {
                  click: function (t) {
                    return e.marketSectionClick(
                      e.data.adverList[0],
                      e.otherParams
                    );
                  },
                },
              },
              [
                t("div", { staticClass: "icon-img" }, [
                  t("img", {
                    attrs: { src: e.data.adverList[0].imageUrl, alt: "" },
                  }),
                ]),
                t("div", { staticClass: "icon-text" }, [
                  e._v(
                    " " +
                      e._s(e.data.adverList[0].vSubject1.substring(0, 4)) +
                      " "
                  ),
                ]),
              ]
            ),
            t("div", { class: [e.tab ? "btn1" : "btn"] }, [
              t(
                "div",
                {
                  staticClass: "left",
                  class: [e.tab ? "btn1-item" : "btn-item"],
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(
                        e.data.adverList[1],
                        e.otherParams
                      );
                    },
                  },
                },
                [
                  e._v(
                    " " +
                      e._s(e.data.adverList[1].vSubject3.substring(0, 6)) +
                      " "
                  ),
                ]
              ),
              t(
                "div",
                {
                  staticClass: "right",
                  class: [e.tab ? "btn1-item" : "btn-item"],
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(
                        e.data.adverList[2],
                        e.otherParams
                      );
                    },
                  },
                },
                [
                  e._v(
                    " " +
                      e._s(e.data.adverList[2].vSubject3.substring(0, 6)) +
                      " "
                  ),
                ]
              ),
            ]),
          ]);
        },
        Je = [],
        ze = {
          name: "ButtonTemplate2",
          mixins: [h],
          props: ["data", "tab", "indexInArea"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        Xe = ze,
        Ke = (0, v.Z)(Xe, He, Je, !1, null, "476e1177", null),
        $e = Ke.exports,
        et = function () {
          var e = this,
            t = e._self._c;
          return t("div", [
            e.data.show && e.data.tabList.length > 1
              ? t(
                  "div",
                  { staticClass: "TabTemplate" },
                  [
                    t(
                      "div",
                      { staticClass: "tab" },
                      e._l(e.data.tabList, function (a, n) {
                        return t(
                          "div",
                          {
                            key: a.tabCode,
                            staticClass: "tab-item",
                            class: { active: e.tabIndex == n },
                            on: {
                              click: function (t) {
                                return e.tabClick(n);
                              },
                            },
                          },
                          [e._v(" " + e._s(a.tabName) + " ")]
                        );
                      }),
                      0
                    ),
                    e._l(e.data.tabList, function (a, n) {
                      return t(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: e.tabIndex == n,
                              expression: "tabIndex == index",
                            },
                          ],
                          key: a.tabMarkId,
                          staticClass: "main",
                        },
                        e._l(a.adverList, function (a, n) {
                          return t(
                            "div",
                            { key: n, staticClass: "main-item" },
                            [
                              "1" == e.type
                                ? t("TabMainItem1", {
                                    attrs: { data: a, gdpProps: e.gdpProps },
                                  })
                                : "2" == e.type
                                ? t("TabMainItem2", {
                                    attrs: { data: a, gdpProps: e.gdpProps },
                                  })
                                : "3" == e.type
                                ? t("TabMainItem3", {
                                    attrs: { data: a, gdpProps: e.gdpProps },
                                  })
                                : e._e(),
                            ],
                            1
                          );
                        }),
                        0
                      );
                    }),
                  ],
                  2
                )
              : e._e(),
          ]);
        },
        tt = [],
        at = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            {
              staticClass: "TabMainItem1",
              on: {
                click: function (t) {
                  return e.marketSectionClick(e.data, e.otherParams);
                },
              },
            },
            [
              t("div", { staticClass: "TabMainItem1-title" }, [
                e._v(" " + e._s(e.cutOutStr(e.data.vSubject1, 5)) + " "),
              ]),
              t("div", { staticClass: "TabMainItem1-subTitle" }, [
                e._v(" " + e._s(e.cutOutStr(e.data.vSubject2, 7)) + " "),
              ]),
              t("div", { staticClass: "TabMainItem1-tag" }, [
                e._v(" " + e._s(e.cutOutStr(e.data.vSubject4, 7)) + " "),
              ]),
              e.data.cornerMarkType && "1" == e.data.cornerMarkType
                ? t("div", { staticClass: "TabMainItem1-mark" }, [
                    e._v(" " + e._s(e.cutOutStr(e.data.cornerMark, 2)) + " "),
                  ])
                : e._e(),
            ]
          );
        },
        nt = [],
        ot = {
          name: "TabMainItem1",
          props: ["data", "gdpProps"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.gdpProps.areaName,
                area_id: this.gdpProps.areaId + "_" + this.gdpProps.moduleId,
              };
            },
          },
          methods: { cutOutStr: I.Ds, marketSectionClick: c.E },
        },
        it = ot,
        rt = (0, v.Z)(it, at, nt, !1, null, "c55bbf7a", null),
        lt = rt.exports,
        st = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            {
              staticClass: "TabMainItem2",
              on: {
                click: function (t) {
                  return e.marketSectionClick(e.data, e.otherParams);
                },
              },
            },
            [
              t("div", { staticClass: "TabMainItem2-title" }, [
                e._v(" " + e._s(e.cutOutStr(e.data.vSubject1, 10)) + " "),
              ]),
              t("div", { staticClass: "TabMainItem2-tag" }, [
                e._v(" " + e._s(e.cutOutStr(e.data.vSubject4, 7)) + " "),
              ]),
              e.data.cornerMarkType && "1" == e.data.cornerMarkType
                ? t("div", { staticClass: "TabMainItem2-mark" }, [
                    e._v(" " + e._s(e.cutOutStr(e.data.cornerMark, 2)) + " "),
                  ])
                : e._e(),
            ]
          );
        },
        ct = [],
        ut = {
          name: "TabMainItem2",
          props: ["data", "gdpProps"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.gdpProps.areaName,
                area_id: this.gdpProps.areaId + "_" + this.gdpProps.moduleId,
              };
            },
          },
          methods: { cutOutStr: I.Ds, marketSectionClick: c.E },
        },
        dt = ut,
        mt = (0, v.Z)(dt, st, ct, !1, null, "e1d135d6", null),
        pt = mt.exports,
        ht = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            {
              staticClass: "TabMainItem3",
              on: {
                click: function (t) {
                  return e.marketSectionClick(e.data, e.otherParams);
                },
              },
            },
            [
              t("div", { staticClass: "TabMainItem3-title" }, [
                e._v(" " + e._s(e.cutOutStr(e.data.vSubject1, 5)) + " "),
              ]),
              t("div", { staticClass: "TabMainItem3-subTitle" }, [
                e._v(" " + e._s(e.cutOutStr(e.data.vSubject2, 7)) + " "),
              ]),
              e.data.cornerMarkType && "1" == e.data.cornerMarkType
                ? t("div", { staticClass: "TabMainItem3-mark" }, [
                    e._v(" " + e._s(e.cutOutStr(e.data.cornerMark, 2)) + " "),
                  ])
                : e._e(),
            ]
          );
        },
        ft = [],
        gt = {
          name: "TabMainItem3",
          props: ["data", "gdpProps"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.gdpProps.areaName,
                area_id: this.gdpProps.areaId + "_" + this.gdpProps.moduleId,
              };
            },
          },
          methods: { cutOutStr: I.Ds, marketSectionClick: c.E },
        },
        vt = gt,
        At = (0, v.Z)(vt, ht, ft, !1, null, "3bc75294", null),
        yt = At.exports,
        Tt = {
          name: "TabTemplate",
          components: { TabMainItem1: lt, TabMainItem2: pt, TabMainItem3: yt },
          props: ["data", "type", "indexInArea"],
          data() {
            return {
              tabIndex: 0,
              isVisible: !1,
              alreadyTrace: [],
              gdpProps: { areaId: "", areaName: "", moduleId: "" },
            };
          },
          watch: {
            data: {
              handler(e) {
                e &&
                  (this.gdpProps = {
                    areaId: e.areaId,
                    areaName: e.areaName,
                    moduleId: e.moduleId,
                  });
              },
              immediate: !0,
            },
          },
          computed: { ...(0, s.mapState)({ userInfo: (e) => e.userInfo }) },
          mounted() {
            (0, u.L)({
              element: this.$el,
              handler: (e) => ((this.isVisible = e), e && this.setTrace(), !1),
            });
          },
          methods: {
            setTrace() {
              if (!this.data.show) return;
              if (this.alreadyTrace.includes(this.tabIndex)) return;
              this.alreadyTrace.push(this.tabIndex);
              let e = this.data.areaId,
                t = this.data.moduleId,
                a = {
                  area_id: e + "_" + t,
                  type: "once",
                  WT_area_type_1: "楼层",
                  WT_area_type_2: "营销区域",
                  WT_area_name: this.data.areaName,
                },
                n = this.data.tabList[this.tabIndex];
              n &&
                n.adverList &&
                n.adverList.length > 0 &&
                (n.adverList.forEach((e, t) => {
                  let n = "";
                  (n =
                    "qqd" === e.source
                      ? e.markId
                      : e.advBusiType + "_" + e.markId),
                    (a[e.channelId] = JSON.stringify({
                      WT_envName:
                        e.markTitle ||
                        e.vSubject1 ||
                        e.vSubject ||
                        e.activityName,
                      WT_markId: n,
                      WT_event: e.channelId,
                      WT_next_url: e.vLinkUrl,
                      XY_brand_info:
                        p.gsmStateMap[this.userInfo.gsmState] ||
                        "其他非全球通用户",
                      XY_gd_source: e.source,
                      XY_point_position: e.adverLocation,
                    }));
                }),
                (0, d.Z)("imp", a));
            },
            tabClick(e) {
              this.tabIndex != e &&
                ((this.tabIndex = e), this.isVisible && this.setTrace());
            },
          },
        },
        St = Tt,
        It = (0, v.Z)(St, et, tt, !1, null, "67e2ffdb", null),
        bt = It.exports,
        Ct = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "notice-view" }, [
            t(
              "div",
              { class: ["notice-content", e.tab ? "notice-padding" : ""] },
              e._l(e.noticeList, function (a) {
                return t(
                  "div",
                  { key: a.markId, staticClass: "notice-content-item" },
                  [e._v(e._s(a))]
                );
              }),
              0
            ),
          ]);
        },
        wt = [],
        _t = a(86842),
        kt = a.n(_t),
        Nt = {
          name: "ReminderTemplate",
          props: ["data", "tab", "indexInArea"],
          computed: {
            ...(0, s.mapState)({ userInfo: (e) => e.userInfo }),
            noticeList() {
              let e =
                this.data &&
                this.data.adverList &&
                this.data.adverList.length > 0
                  ? this.data.adverList[0].noticeTxt
                  : [];
              if (0 === e.length) return [];
              let t = e
                .replace(
                  /#phoneNum#/g,
                  this.formatTel(this.userInfo.phoneNumber)
                )
                .replace(/#date#/g, kt()().format("YYYY-MM-DD"))
                .replace(/#datetime#/g, kt()().format("YYYY-MM-DD HH:mm:ss"))
                .replace(/#datetime_nosec#/g, kt()().format("YYYY-MM-DD HH:mm"))
                .replace(
                  /#datetime_hour#/g,
                  kt()().format("YYYY年MM月DD日HH时")
                );
              return t.split("\\n");
            },
          },
          methods: {
            formatTel(e) {
              return e ? e.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "";
            },
          },
        },
        Pt = Nt,
        Bt = (0, v.Z)(Pt, Ct, wt, !1, null, "1b61857b", null),
        Lt = Bt.exports,
        Dt = function () {
          var e = this,
            t = e._self._c;
          return e.showFlowSlice
            ? t("div", { staticClass: "flowSliceTemplate" }, [
                t("img", {
                  attrs: { src: e.sliceData.adverList[0].imageUrl },
                  on: {
                    click: function (t) {
                      return e.marketSectionClick(
                        e.sliceData.adverList[0],
                        e.otherParams
                      );
                    },
                  },
                }),
                "1" == e.sliceData.adverList[0].isAdvert
                  ? t("span", { staticClass: "cormark" })
                  : e._e(),
              ])
            : e._e();
        },
        Et = [],
        xt = {
          name: "FlowSliceTemplate",
          props: ["sliceData", "indexInArea"],
          computed: {
            ...(0, s.mapState)({ userInfo: (e) => e.userInfo }),
            showFlowSlice() {
              return (
                this.sliceData &&
                this.sliceData.adverList &&
                this.sliceData.adverList.length > 0
              );
            },
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.sliceData.areaName,
                area_id: this.sliceData.areaId + "_" + this.sliceData.moduleId,
              };
            },
          },
          methods: {
            marketSectionClick: c.E,
            setTrace() {
              let e = this.sliceData.areaId,
                t = this.sliceData.moduleId,
                a = this.$store.getters.pageName,
                n = {
                  area_id: e + "_" + t,
                  type: "once",
                  WT_area_type_1: "楼层",
                  WT_area_type_2: "营销区域",
                  WT_area_name: this.sliceData.areaName,
                };
              this.sliceData.adverList.forEach((e, t) => {
                let a = "";
                (a =
                  "qqd" == e.source
                    ? e.markId
                    : e.advBusiType + "_" + e.markId),
                  (n[e.channelId] = JSON.stringify({
                    WT_et: "imp",
                    WT_envName:
                      e.markTitle ||
                      e.vSubject1 ||
                      e.vSubject ||
                      e.activityName,
                    WT_markId: a,
                    WT_event: e.channelId,
                    WT_next_url: e.vLinkUrl,
                    XY_brand_info:
                      p.gsmStateMap[this.userInfo.gsmState] ||
                      "其他非全球通用户",
                    XY_gd_source: e.source,
                    XY_point_position: e.adverLocation,
                  }));
              }),
                (0, d.Z)("imp", n);
              let o =
                  JSON.parse(
                    localStorage.getItem(
                      "markId-" + a + "-" + this.userInfo.phoneNumber
                    )
                  ) || [],
                i = this.sliceData.adverList[0].markId,
                r = new Date().getTime(),
                l = 7776e6,
                s = { expireDate: r + l, markId: i };
              o.push(s),
                localStorage.setItem(
                  "markId-" + a + "-" + this.userInfo.phoneNumber,
                  JSON.stringify(o)
                );
            },
          },
          mounted() {
            this.showFlowSlice && this.setTrace();
          },
        },
        Mt = xt,
        Wt = (0, v.Z)(Mt, Dt, Et, !1, null, "7861422a", null),
        Rt = Wt.exports,
        Ot = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "cubeTemplate" }, [
            e.allLoaded
              ? t(
                  "div",
                  { ref: "temBox", staticClass: "tem-box" },
                  [
                    e.displayTabList.length > 1 ||
                    (1 === e.displayTabList.length &&
                      1 == e.displayTabList[0].isShowCardName)
                      ? t("div", { staticClass: "list-box" }, [
                          e.displayTabList.length > 1
                            ? t(
                                "div",
                                { staticClass: "list" },
                                e._l(e.displayTabList, function (a, n) {
                                  return t(
                                    "div",
                                    {
                                      key: n,
                                      class: [
                                        "tab-items",
                                        {
                                          tab_act: n === e.actTabIdx,
                                          isLink: e.filterIsLink(a.vSubject6),
                                        },
                                      ],
                                      on: {
                                        click: function (t) {
                                          return e.changeTab(n, !0);
                                        },
                                      },
                                    },
                                    [
                                      e._v(" " + e._s(a.vSubject5) + " "),
                                      t("div", { staticClass: "act-line" }),
                                    ]
                                  );
                                }),
                                0
                              )
                            : t(
                                "div",
                                {
                                  class: [
                                    "list-items",
                                    {
                                      itemIsLink: e.filterIsLink(
                                        e.displayTabList[0].vSubject6
                                      ),
                                    },
                                  ],
                                },
                                [
                                  e._v(
                                    " " +
                                      e._s(e.displayTabList[0].vSubject5) +
                                      " "
                                  ),
                                ]
                              ),
                        ])
                      : e._e(),
                    e._l(e.displayTabList, function (a, n) {
                      return t("div", { key: n }, [
                        t(
                          "div",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: n === e.actTabIdx,
                                expression: "index === actTabIdx",
                              },
                            ],
                          },
                          [
                            e.filterIsLink(a.vSubject6)
                              ? t("div", {
                                  attrs: {
                                    id: `tab_${e.data.areaId}_${
                                      e.indexInArea
                                    }_${e.pluginContainerTag || ""}_${n}`,
                                  },
                                })
                              : "flow001" === a.vSubject6 ||
                                "voice001" === a.vSubject6
                              ? t("CubeBarTemplate1", {
                                  attrs: {
                                    hisPlanRemainQry: e.hisPlanRemainQry,
                                    chartClientHeight: e.chartClientHeight,
                                    type: a.vSubject6,
                                  },
                                })
                              : "flow002" === a.vSubject6 ||
                                "voice002" === a.vSubject6 ||
                                "message002" === a.vSubject6
                              ? t("CubeBarTemplate2", {
                                  attrs: {
                                    hisPlanRemainQry: e.hisPlanRemainQry,
                                    chartClientHeight: e.chartClientHeight,
                                    type: a.vSubject6,
                                  },
                                })
                              : e._e(),
                          ],
                          1
                        ),
                      ]);
                    }),
                  ],
                  2
                )
              : e._e(),
            t("div", { ref: "chart", staticClass: "chart-placeholder" }),
          ]);
        },
        Ut = [],
        Ft =
          (a(59461),
          a(9924),
          a(72608),
          a(41874),
          function () {
            var e = this,
              t = e._self._c;
            return t("div", { staticClass: "flow-tbox" }, [
              t(
                "div",
                {
                  class: [
                    "chart-content-wrapper",
                    e.showTips && e.isSingleMonth
                      ? "chart-content-padding"
                      : "",
                  ],
                },
                [
                  t("div", { staticClass: "chart-head" }, [
                    t("div", { staticClass: "chart-select-month" }, [
                      t("div", { staticClass: "select-month-tit" }, [
                        e._v(
                          e._s(
                            e.isSingleMonth
                              ? `${e.flowAverageValueData.monthNum}月：`
                              : "平均："
                          )
                        ),
                      ]),
                      t("div", { staticClass: "select-month-used" }, [
                        e._v(
                          " " +
                            e._s(
                              e.isFlowType
                                ? e.isSingleMonth
                                  ? e.valueUnitFormat(
                                      e.flowAverageValueData.flowTotalUsed
                                    ).value
                                  : e.valueUnitFormat(
                                      e.allMonthFlowData.monthAverageData
                                    ).value
                                : e.isSingleMonth
                                ? e.flowAverageValueData.flowTotalUsed
                                : e.allMonthFlowData.monthAverageData
                            )
                        ),
                        t(
                          "span",
                          { class: [e.isFlowType ? "" : "minute-class"] },
                          [
                            e._v(
                              e._s(
                                e.isFlowType
                                  ? e.isSingleMonth
                                    ? e.valueUnitFormat(
                                        e.flowAverageValueData.flowTotalUsed
                                      ).unit
                                    : e.valueUnitFormat(
                                        e.allMonthFlowData.monthAverageData
                                      ).unit
                                  : "分钟"
                              )
                            ),
                          ]
                        ),
                      ]),
                      t(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: !e.isSingleMonth,
                              expression: "!isSingleMonth",
                            },
                          ],
                          staticClass: "select-month-text",
                        },
                        [e._v("/月")]
                      ),
                    ]),
                    t("div", { staticClass: "changeBtn" }, [
                      t(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: e.showTips && e.isSingleMonth,
                              expression: "showTips && isSingleMonth",
                            },
                          ],
                          staticClass: "tips-text",
                        },
                        [
                          e._v(" 点击柱状图可查看其他月份 "),
                          t("img", {
                            staticClass: "tips-close",
                            attrs: { src: a(66737), alt: "" },
                            on: {
                              click: function (t) {
                                e.showTips = !1;
                              },
                            },
                          }),
                          t("img", {
                            staticClass: "tips-arrow",
                            attrs: { src: a(50245), alt: "" },
                          }),
                        ]
                      ),
                      t(
                        "div",
                        {
                          staticClass: "changeBtn-item",
                          class: [
                            e.isSingleMonth ? "" : "changeBtn-item-active",
                          ],
                          on: {
                            click: function (t) {
                              return e.changeChartType(1, !0);
                            },
                          },
                        },
                        [e._v(" 月均 ")]
                      ),
                      t(
                        "div",
                        {
                          staticClass: "changeBtn-item",
                          class: [
                            e.isSingleMonth ? "changeBtn-item-active" : "",
                          ],
                          on: {
                            click: function (t) {
                              return e.changeChartType(2, !0);
                            },
                          },
                        },
                        [e._v(" 单月 ")]
                      ),
                    ]),
                  ]),
                  t(
                    "div",
                    { staticClass: "chart-values-wrapper" },
                    [
                      t("div", { staticClass: "line" }, [
                        t(
                          "div",
                          {
                            staticClass: "ave-line",
                            class: [
                              e.isSingleMonth ? "monthSelected-line" : "",
                            ],
                            style: { bottom: e.averageLineHeight },
                          },
                          [
                            t("div", { staticClass: "ave-inner-line" }, [
                              t("div", {
                                staticClass: "aveLine-area",
                                on: {
                                  click: function (t) {
                                    return e.changeAverageArea("line");
                                  },
                                },
                              }),
                            ]),
                            t(
                              "div",
                              {
                                staticClass: "ave-inner-text",
                                on: {
                                  click: function (t) {
                                    return e.changeAverageArea("text");
                                  },
                                },
                              },
                              [e._v("平均")]
                            ),
                          ]
                        ),
                      ]),
                      e._l(e.flowXValue, function (a, n) {
                        return t(
                          "div",
                          {
                            key: n,
                            staticClass: "chart-value-wrapper",
                            class: [
                              e.isSingleMonth && e.selectedMonth === n
                                ? "chart-value-wrapperActive"
                                : "",
                              e.isSingleMonth ? "opacityClass" : "",
                            ],
                            on: {
                              click: function (t) {
                                return e.changeMonth(n);
                              },
                            },
                          },
                          [
                            t(
                              "div",
                              {
                                staticClass: "bar-line",
                                style: {
                                  height: `${
                                    e.isShowAllDataZero ? "16px" : a.height
                                  }`,
                                },
                              },
                              [
                                e.isShowAllDataZero
                                  ? [
                                      t(
                                        "div",
                                        {
                                          class: [
                                            e.isSingleMonth &&
                                            e.selectedMonth === n
                                              ? ""
                                              : "opacityNoneClass",
                                          ],
                                        },
                                        [
                                          t("div", {
                                            staticClass: "none-green",
                                          }),
                                          t("div", {
                                            staticClass: "none-blue",
                                          }),
                                        ]
                                      ),
                                    ]
                                  : e.isFlowType
                                  ? [
                                      t("div", {
                                        staticClass: "bar-other",
                                        style: {
                                          height:
                                            (a.flowTotalUsed
                                              ? (a.otherFlowTotal /
                                                  a.flowTotalUsed) *
                                                100
                                              : 0) + "%",
                                        },
                                      }),
                                      t("div", {
                                        staticClass: "bar-orientation",
                                        style: {
                                          height:
                                            (a.flowTotalUsed
                                              ? (a.OrientationFlowTotal /
                                                  a.flowTotalUsed) *
                                                100
                                              : 0) + "%",
                                        },
                                      }),
                                      t("div", {
                                        staticClass: "bar-universal",
                                        style: {
                                          height:
                                            (a.flowTotalUsed
                                              ? (a.flowTotal /
                                                  a.flowTotalUsed) *
                                                100
                                              : 0) + "%",
                                        },
                                      }),
                                    ]
                                  : [
                                      t("div", {
                                        staticClass: "bar-orientation",
                                        style: {
                                          height:
                                            (a.voiceTotalUsed
                                              ? (a.otherVoice /
                                                  a.voiceTotalUsed) *
                                                100
                                              : 0) + "%",
                                        },
                                      }),
                                      t("div", {
                                        staticClass: "bar-universal",
                                        style: {
                                          height:
                                            (a.voiceTotalUsed
                                              ? (a.voiceTotal /
                                                  a.voiceTotalUsed) *
                                                100
                                              : 0) + "%",
                                        },
                                      }),
                                    ],
                              ],
                              2
                            ),
                            t(
                              "div",
                              {
                                staticClass: "num-month",
                                on: {
                                  click: function (t) {
                                    return t.stopPropagation(), e.clickMonth(n);
                                  },
                                },
                              },
                              [
                                t("span", { staticClass: "chart-value-num" }, [
                                  e._v(e._s(a.month)),
                                ]),
                                t(
                                  "span",
                                  { staticClass: "chart-value-month" },
                                  [e._v("月")]
                                ),
                              ]
                            ),
                          ]
                        );
                      }),
                    ],
                    2
                  ),
                  t(
                    "div",
                    { staticClass: "chart-average-wrapper" },
                    [
                      e.isFlowType
                        ? [
                            t("div", { staticClass: "chart-average-used" }, [
                              t("div", { staticClass: "average-used-num" }, [
                                e._v(
                                  " " +
                                    e._s(
                                      e.isSingleMonth
                                        ? e.valueUnitFormat(
                                            e.flowAverageValueData
                                              .universalAverage
                                          ).valueUnit
                                        : e.valueUnitFormat(
                                            e.allMonthFlowData.universalAverage
                                          ).valueUnit
                                    ) +
                                    " "
                                ),
                              ]),
                              t("div", { staticClass: "average-used-desc" }, [
                                t("div", {
                                  staticClass: "average-used-tag universal",
                                }),
                                t("div", { staticClass: "average-used-text" }, [
                                  t(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: !e.isSingleMonth,
                                          expression: "!isSingleMonth",
                                        },
                                      ],
                                    },
                                    [e._v("平均")]
                                  ),
                                  e._v("通用流量"),
                                ]),
                              ]),
                            ]),
                            t("div", { staticClass: "chart-average-used" }, [
                              t("div", { staticClass: "average-used-num" }, [
                                e._v(
                                  " " +
                                    e._s(
                                      e.isSingleMonth
                                        ? e.valueUnitFormat(
                                            e.flowAverageValueData
                                              .orientationAverage
                                          ).valueUnit
                                        : e.valueUnitFormat(
                                            e.allMonthFlowData
                                              .orientationAverage
                                          ).valueUnit
                                    ) +
                                    " "
                                ),
                              ]),
                              t("div", { staticClass: "average-used-desc" }, [
                                t("div", {
                                  staticClass: "average-used-tag orientation",
                                }),
                                t("div", { staticClass: "average-used-text" }, [
                                  t(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: !e.isSingleMonth,
                                          expression: "!isSingleMonth",
                                        },
                                      ],
                                    },
                                    [e._v("平均")]
                                  ),
                                  e._v("定向流量"),
                                ]),
                              ]),
                            ]),
                            t("div", { staticClass: "chart-average-used" }, [
                              t("div", { staticClass: "average-used-num" }, [
                                e._v(
                                  " " +
                                    e._s(
                                      e.isSingleMonth
                                        ? e.valueUnitFormat(
                                            e.flowAverageValueData.otherAverage
                                          ).valueUnit
                                        : e.valueUnitFormat(
                                            e.allMonthFlowData.otherAverage
                                          ).valueUnit
                                    ) +
                                    " "
                                ),
                              ]),
                              t("div", { staticClass: "average-used-desc" }, [
                                t("div", {
                                  staticClass: "average-used-tag other",
                                }),
                                t("div", { staticClass: "average-used-text" }, [
                                  t(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: !e.isSingleMonth,
                                          expression: "!isSingleMonth",
                                        },
                                      ],
                                    },
                                    [e._v("平均")]
                                  ),
                                  e._v("其他流量"),
                                ]),
                              ]),
                            ]),
                          ]
                        : [
                            t("div", { staticClass: "chart-average-used" }, [
                              t("div", { staticClass: "average-used-num" }, [
                                e._v(
                                  " " +
                                    e._s(
                                      e.isSingleMonth
                                        ? e.flowAverageValueData
                                            .universalAverage
                                        : e.allMonthFlowData.universalAverage
                                    )
                                ),
                                t("span", { staticClass: "minute-class" }, [
                                  e._v("分钟"),
                                ]),
                              ]),
                              t("div", { staticClass: "average-used-desc" }, [
                                t("div", {
                                  staticClass: "average-used-tag universal",
                                }),
                                t("div", { staticClass: "average-used-text" }, [
                                  t(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: !e.isSingleMonth,
                                          expression: "!isSingleMonth",
                                        },
                                      ],
                                    },
                                    [e._v("平均")]
                                  ),
                                  e._v("国内通用通话"),
                                ]),
                              ]),
                            ]),
                            t("div", { staticClass: "chart-average-used" }, [
                              t("div", { staticClass: "average-used-num" }, [
                                e._v(
                                  " " +
                                    e._s(
                                      e.isSingleMonth
                                        ? e.flowAverageValueData.otherAverage
                                        : e.allMonthFlowData.otherAverage
                                    )
                                ),
                                t("span", { staticClass: "minute-class" }, [
                                  e._v("分钟"),
                                ]),
                              ]),
                              t("div", { staticClass: "average-used-desc" }, [
                                t("div", {
                                  staticClass: "average-used-tag orientation",
                                }),
                                t("div", { staticClass: "average-used-text" }, [
                                  t(
                                    "span",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: !e.isSingleMonth,
                                          expression: "!isSingleMonth",
                                        },
                                      ],
                                    },
                                    [e._v("平均")]
                                  ),
                                  e._v("国内其他通话"),
                                ]),
                              ]),
                            ]),
                          ],
                    ],
                    2
                  ),
                ]
              ),
            ]);
          }),
        Zt = [],
        Vt = a(50813),
        Qt = a.n(Vt),
        Yt = {
          name: "CubeBarTemplate1",
          props: ["hisPlanRemainQry", "chartClientHeight", "type"],
          data() {
            return {
              isSingleMonth: !1,
              selectedMonth: null,
              flowAverageValueData: {},
              showTips: !0,
            };
          },
          computed: {
            ...(0, s.mapGetters)(["pageName"]),
            isFlowType() {
              return "flow001" === this.type;
            },
            flowYValues() {
              return this.isFlowType
                ? this.calculateYValues(
                    this.hisPlanRemainQry.map((e) => e.flowTotalUsed)
                  ).slice(1)
                : this.calculateYValues(
                    this.hisPlanRemainQry.map((e) => e.voiceTotalUsed)
                  ).slice(1);
            },
            flowYValuesReverse() {
              let e = Qt()(this.flowYValues);
              return e.reverse();
            },
            flowXValue() {
              return this.isFlowType
                ? this.hisPlanRemainQry.map((e) => ({
                    ...e,
                    height: `${(
                      (e.flowTotalUsed / this.flowYValuesReverse[0]) *
                      this.chartClientHeight
                    ).toFixed(2)}px`,
                  }))
                : this.hisPlanRemainQry.map((e) => ({
                    ...e,
                    height: `${(
                      (e.voiceTotalUsed / this.flowYValuesReverse[0]) *
                      this.chartClientHeight
                    ).toFixed(2)}px`,
                  }));
            },
            averageLineHeight() {
              let e;
              return (
                (e = this.isFlowType
                  ? (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.flowTotalUsed)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  : (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.voiceTotalUsed)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(0)),
                (e / this.flowYValuesReverse[0]) * this.chartClientHeight + "px"
              );
            },
            allMonthFlowData() {
              if (this.isFlowType) {
                let e = Number(
                    (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.flowTotal)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  ),
                  t = Number(
                    (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.OrientationFlowTotal)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  ),
                  a = Number(
                    (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.otherFlowTotal)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  ),
                  n = Number(
                    (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.flowTotalUsed)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  );
                return {
                  universalAverage: e,
                  orientationAverage: t,
                  otherAverage: a,
                  monthAverageData: n,
                };
              }
              {
                let e = Number(
                    (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.voiceTotal)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  ),
                  t = Number(
                    (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.otherVoice)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  ),
                  a = Number(
                    (
                      this.flowXValue.reduce(
                        (e, t) => ((e += Number(t.voiceTotalUsed)), e),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  );
                return {
                  universalAverage: e,
                  otherAverage: t,
                  monthAverageData: a,
                };
              }
            },
            isShowAllDataZero() {
              const e = this.flowXValue.reduce(
                  (e, t) => e + Number(t.flowTotalUsed),
                  0
                ),
                t = this.flowXValue.reduce(
                  (e, t) => e + Number(t.voiceTotalUsed),
                  0
                );
              return this.isFlowType ? !e : !t;
            },
          },
          methods: {
            calculateYValues(e) {
              if (!Array.isArray(e) || 0 === e.length) return [];
              const t = Math.max(...e);
              let a = 5 * (Math.floor(t / 15) + 2);
              t < 15 && (a = 5);
              const n = [];
              for (let o = 0; o < 4; o++) {
                const e = "" + o * a;
                n.push(e);
              }
              return n;
            },
            filterNumStr(e) {
              return e || "0";
            },
            changeMonth(e, t = !1) {
              (this.selectedMonth = e), (this.isSingleMonth = !0);
              let a = this.flowXValue[this.selectedMonth];
              if (
                (this.isFlowType
                  ? ((this.flowAverageValueData.universalAverage =
                      this.filterNumStr(a.flowTotal)),
                    (this.flowAverageValueData.orientationAverage =
                      this.filterNumStr(a.OrientationFlowTotal)),
                    (this.flowAverageValueData.otherAverage = this.filterNumStr(
                      a.otherFlowTotal
                    )),
                    (this.flowAverageValueData.flowTotalUsed =
                      this.filterNumStr(a.flowTotalUsed)))
                  : ((this.flowAverageValueData.universalAverage =
                      this.filterNumStr(a.voiceTotal)),
                    (this.flowAverageValueData.otherAverage = this.filterNumStr(
                      a.otherVoice
                    )),
                    (this.flowAverageValueData.flowTotalUsed =
                      this.filterNumStr(a.voiceTotalUsed))),
                (this.flowAverageValueData.monthNum = a.month),
                !t)
              ) {
                let t = "",
                  a = this.isFlowType
                    ? `流量tab_柱${e + 1}`
                    : `通话tab_柱${e + 1}`;
                switch (e) {
                  case 0:
                    t = this.isFlowType ? "P00000083944" : "P00000083958";
                    break;
                  case 1:
                    t = this.isFlowType ? "P00000083946" : "P00000083960";
                    break;
                  case 2:
                    t = this.isFlowType ? "P00000083948" : "P00000083962";
                    break;
                  case 3:
                    t = this.isFlowType ? "P00000083950" : "P00000083964";
                    break;
                  case 4:
                    t = this.isFlowType ? "P00000083952" : "P00000083966";
                    break;
                  case 5:
                    t = this.isFlowType ? "P00000083954" : "P00000083968";
                    break;
                  default:
                    break;
                }
                this.insertCode(t, a);
              }
            },
            clickMonth(e) {
              this.changeMonth(e, !0);
              let t = this.flowXValue[e].month,
                a = "",
                n = this.isFlowType
                  ? `流量tab_柱${e + 1}_[${t}]`
                  : `通话tab_柱${e + 1}_[${t}]`;
              switch (e) {
                case 0:
                  a = this.isFlowType ? "P00000083945" : "P00000083959";
                  break;
                case 1:
                  a = this.isFlowType ? "P00000083947" : "P00000083961";
                  break;
                case 2:
                  a = this.isFlowType ? "P00000083949" : "P00000083963";
                  break;
                case 3:
                  a = this.isFlowType ? "P00000083951" : "P00000083965";
                  break;
                case 4:
                  a = this.isFlowType ? "P00000083953" : "P00000083967";
                  break;
                case 5:
                  a = this.isFlowType ? "P00000083955" : "P00000083969";
                  break;
                default:
                  break;
              }
              this.insertCode(a, n);
            },
            changeChartType(e, t = !1) {
              if (
                (1 == e
                  ? (this.isSingleMonth = !1)
                  : 2 == e &&
                    ((this.isSingleMonth = !0), this.changeMonth(5, !0)),
                t)
              )
                if (1 == e) {
                  let e = this.isFlowType ? "P00000085239" : "P00000085241",
                    t = "月均";
                  this.insertCode(e, t);
                } else if (2 == e) {
                  let e = this.isFlowType ? "P00000085240" : "P00000085242",
                    t = "单月";
                  this.insertCode(e, t);
                }
            },
            changeAverageArea(e) {
              if ((this.changeChartType(1), "line" === e)) {
                let e = this.isFlowType ? "P00000083943" : "P00000083957",
                  t = this.isFlowType
                    ? "流量tab_柱状图平均线"
                    : "通话tab_柱状图平均线";
                this.insertCode(e, t);
              } else if ("text" === e) {
                let e = this.isFlowType ? "P00000083942" : "P00000083956",
                  t = this.isFlowType
                    ? "流量tab_柱状图平均按钮"
                    : "通话tab_柱状图平均按钮";
                this.insertCode(e, t);
              }
            },
            insertCode(e, t) {
              let a =
                "余量查询" === document.title
                  ? "余量明细区"
                  : "余额查询" === document.title
                  ? "余额明细区"
                  : "";
              (0, d.Z)("clk", {
                WT_envName: t,
                WT_event: e,
                WT_area_type_1: "楼层",
                WT_area_type_2: a,
                WT_area_name: a,
                XY_env_type: "button",
              });
            },
            valueUnitFormat(e) {
              const t = Number(e),
                a = 1024,
                n = 1048576;
              return t < a
                ? {
                    value: Number(t.toFixed(2)),
                    unit: 0 === t ? "" : "KB",
                    valueUnit: Number(t.toFixed(2)) + (0 === t ? "" : "KB"),
                  }
                : t < n
                ? {
                    value: Number((t / a).toFixed(2)),
                    unit: "MB",
                    valueUnit: Number((t / a).toFixed(2)) + "MB",
                  }
                : {
                    value: Number((t / n).toFixed(2)),
                    unit: "GB",
                    valueUnit: Number((t / n).toFixed(2)) + "GB",
                  };
            },
          },
        },
        Gt = Yt,
        jt = (0, v.Z)(Gt, Ft, Zt, !1, null, "15e6aaae", null),
        qt = jt.exports,
        Ht = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "flow-tbox" }, [
            t("div", { staticClass: "chart-content-wrapper" }, [
              t(
                "div",
                { staticClass: "chart-items-wrapper" },
                e._l(e.flowYValuesReverse, function (e, a) {
                  return t("div", {
                    key: a,
                    staticClass: "chart-item-wrapper",
                    class: { "chart-item-wrapper-top": 0 === a },
                  });
                }),
                0
              ),
              t(
                "div",
                { staticClass: "chart-values-wrapper" },
                e._l(e.flowXValue, function (a, n) {
                  return t(
                    "div",
                    { key: n, staticClass: "chart-value-wrapper" },
                    [
                      t("div", [
                        t("span", { staticClass: "chart-value-num" }, [
                          e._v(e._s(a.month)),
                        ]),
                        t("span", { staticClass: "chart-value-month" }, [
                          e._v("月"),
                        ]),
                      ]),
                      t(
                        "div",
                        {
                          class: [
                            e.isShowAllDataZero ? "none-data-bar" : "bar-line",
                          ],
                          style: {
                            height: `${e.isShowAllDataZero ? "8px" : a.height}`,
                          },
                        },
                        [
                          t("div", { staticClass: "bar-content" }, [
                            t("div", { staticClass: "bar-content-txt" }, [
                              t("div", { staticClass: "bar-txt" }, [
                                e._v(
                                  " " +
                                    e._s(
                                      e.isFlowType
                                        ? e.valueUnitFormat(a.flowTotal).value
                                        : e.isVoiceType
                                        ? a.voiceTotal
                                        : a.msgTotal
                                    ) +
                                    " "
                                ),
                              ]),
                              t("div", { staticClass: "bar-unit" }, [
                                e._v(
                                  " " +
                                    e._s(
                                      e.isFlowType
                                        ? e.valueUnitFormat(a.flowTotal).unit
                                        : e.chartUnit
                                    ) +
                                    " "
                                ),
                              ]),
                            ]),
                          ]),
                        ]
                      ),
                    ]
                  );
                }),
                0
              ),
              t("div", { staticClass: "chart-average-wrapper" }, [
                t("div", { staticClass: "chart-average-key" }, [
                  e._v("每月使用量"),
                ]),
                t("div", { staticClass: "chart-average-val" }, [
                  t("div", [e._v("平均")]),
                  e.isFlowType
                    ? t("div", { staticClass: "average-value" }, [
                        e._v(
                          e._s(e.valueUnitFormat(e.flowAverageValue).valueUnit)
                        ),
                      ])
                    : t("div", { staticClass: "average-value" }, [
                        e._v(" " + e._s(e.flowAverageValue)),
                        t("span", { staticClass: "average-value-unit" }, [
                          e._v(e._s(e.chartUnit)),
                        ]),
                      ]),
                  t("div", [e._v("/月")]),
                ]),
              ]),
            ]),
          ]);
        },
        Jt = [],
        zt = {
          name: "CubeBarTemplate2",
          props: ["hisPlanRemainQry", "chartClientHeight", "type"],
          data() {
            return {};
          },
          computed: {
            isFlowType() {
              return "flow002" == this.type;
            },
            isVoiceType() {
              return "voice002" == this.type;
            },
            chartUnit() {
              return "voice002" == this.type
                ? "分钟"
                : "message002" == this.type
                ? "条"
                : void 0;
            },
            flowYValues() {
              return this.isFlowType
                ? this.calculateYValues(
                    this.hisPlanRemainQry.map((e) => e.flowTotal)
                  ).slice(1)
                : this.isVoiceType
                ? this.calculateYValues(
                    this.hisPlanRemainQry.map((e) => e.voiceTotal)
                  ).slice(1)
                : this.calculateYValues(
                    this.hisPlanRemainQry.map((e) => e.msgTotal)
                  ).slice(1);
            },
            flowYValuesReverse() {
              let e = Qt()(this.flowYValues);
              return e.reverse();
            },
            flowAverageValue() {
              return this.flowXValue.length > 0
                ? Number(
                    (
                      this.flowXValue.reduce(
                        (e, t) => (
                          (e += Number(
                            this.isFlowType
                              ? t.flowTotal
                              : this.isVoiceType
                              ? t.voiceTotal
                              : t.msgTotal
                          )),
                          e
                        ),
                        0
                      ) / this.flowXValue.length
                    ).toFixed(2)
                  )
                : 0;
            },
            flowXValue() {
              return this.isFlowType
                ? this.hisPlanRemainQry.map((e) => ({
                    ...e,
                    height:
                      (e.flowTotal / this.flowYValuesReverse[0]) *
                        this.chartClientHeight +
                      "px",
                  }))
                : this.isVoiceType
                ? this.hisPlanRemainQry.map((e) => ({
                    ...e,
                    height:
                      (e.voiceTotal / this.flowYValuesReverse[0]) *
                        this.chartClientHeight +
                      "px",
                  }))
                : this.hisPlanRemainQry.map((e) => ({
                    ...e,
                    height:
                      (e.msgTotal / this.flowYValuesReverse[0]) *
                        this.chartClientHeight +
                      "px",
                  }));
            },
            isShowAllDataZero() {
              const e = this.flowXValue.reduce(
                  (e, t) => e + Number(t.flowTotal),
                  0
                ),
                t = this.flowXValue.reduce(
                  (e, t) => e + Number(t.voiceTotal),
                  0
                ),
                a = this.flowXValue.reduce((e, t) => e + Number(t.msgTotal), 0);
              return this.isFlowType ? !e : this.isVoiceType ? !t : !a;
            },
          },
          methods: {
            calculateYValues(e) {
              if (!Array.isArray(e) || 0 === e.length) return [];
              const t = Math.max(...e);
              let a = 5 * (Math.floor(t / 15) + 2);
              t < 15 && (a = 5);
              const n = [];
              for (let o = 0; o < 4; o++) {
                const e = "" + o * a;
                n.push(e);
              }
              return n;
            },
            valueUnitFormat(e) {
              const t = Number(e),
                a = 1024,
                n = 1048576;
              return t < a
                ? {
                    value: Number(t.toFixed(2)),
                    unit: 0 === t ? "" : "KB",
                    valueUnit: Number(t.toFixed(2)) + (0 === t ? "" : "KB"),
                  }
                : t < n
                ? {
                    value: Number((t / a).toFixed(2)),
                    unit: "MB",
                    valueUnit: Number((t / a).toFixed(2)) + "MB",
                  }
                : {
                    value: Number((t / n).toFixed(2)),
                    unit: "GB",
                    valueUnit: Number((t / n).toFixed(2)) + "GB",
                  };
            },
          },
        },
        Xt = zt,
        Kt = (0, v.Z)(Xt, Ht, Jt, !1, null, "43938284", null),
        $t = Kt.exports,
        ea = a(75150),
        ta = a(76507),
        aa = a(63688),
        na = a(49034),
        oa = a(15222);
      m["default"].registerModule("hisComboMealRes", aa.Z);
      var ia = {
          name: "CubeTemplate",
          props: ["data", "pluginContainerTag", "indexInArea"],
          components: { CubeBarTemplate1: qt, CubeBarTemplate2: $t },
          data() {
            return {
              actTabIdx: 0,
              hisPlanRemainQry: [],
              chartClientHeight: 210,
              showedTabNumArr: [],
              isVisible: !1,
              allData: null,
            };
          },
          watch: {
            data: {
              handler() {
                this.allData = Qt()(this.data);
              },
              deep: !0,
              immediate: !0,
            },
            allLoaded: {
              handler(e) {
                e &&
                  this.$nextTick(() => {
                    let e = this.$refs.temBox.clientHeight;
                    e > 0 && this.impGdp(0),
                      this.displayTabList.forEach((e, t) => {
                        e.callLibrary && e.callLibrary(t);
                      });
                  });
              },
              immediate: !0,
            },
          },
          computed: {
            ...(0, s.mapGetters)(["pageName"]),
            ...(0, s.mapState)({
              userInfo: (e) => e.userInfo,
              reportLingXiData: (e) => e.market.reportLingXiData,
            }),
            allLoaded() {
              return (
                !!(this.calculateTabList && this.calculateTabList.length > 0) &&
                !Boolean(
                  this.calculateTabList.find((e) => "loading" === e.loadStatus)
                )
              );
            },
            displayTabList() {
              let e = this.calculateTabList.filter(
                  (e) => "success" === e.loadStatus
                ),
                t = e.findIndex((e) => "flow001" === e.vSubject6);
              t > -1 &&
                this.hisPlanRemainQry.some(
                  (e) =>
                    null == e.flowTotal &&
                    null == e.OrientationFlowTotal &&
                    null == e.otherFlowTotal
                ) &&
                e.splice(t, 1);
              let a = e.findIndex((e) => "flow002" === e.vSubject6);
              a > -1 &&
                this.hisPlanRemainQry.some((e) => null == e.flowTotal) &&
                e.splice(a, 1);
              let n = e.findIndex((e) => "voice001" === e.vSubject6);
              n > -1 &&
                this.hisPlanRemainQry.some(
                  (e) => null == e.voiceTotal && null == e.otherVoice
                ) &&
                e.splice(n, 1);
              let o = e.findIndex((e) => "voice002" === e.vSubject6);
              o > -1 &&
                this.hisPlanRemainQry.some((e) => null == e.voiceTotal) &&
                e.splice(o, 1);
              let i = e.findIndex((e) => "message002" === e.vSubject6);
              return (
                i > -1 &&
                  this.hisPlanRemainQry.some((e) => null == e.msgTotal) &&
                  e.splice(i, 1),
                e
              );
            },
            calculateTabList() {
              var e;
              let t =
                null === (e = this.allData) || void 0 === e
                  ? void 0
                  : e.tabList.filter((e) => "2" === e.tabId);
              return t &&
                t.length > 0 &&
                t[0].tabModuleList &&
                t[0].tabModuleList.length > 0
                ? (t[0].tabModuleList[0].tabModuleAdVerList.forEach((e) => {
                    e.loadStatus || this.$set(e, "loadStatus", "loading");
                  }),
                  t[0].tabModuleList[0].tabModuleAdVerList)
                : [];
            },
          },
          mounted() {
            this.calculateTabList.length > 0 &&
              (this.calculateTabList.forEach((e) => {
                this.createLoadTask(e);
              }),
              this.$nextTick(() => {
                this.chartClientHeight =
                  this.$refs.chart && this.$refs.chart.clientHeight;
              })),
              this.$eventBus.$on("cubeTemplateChartResize", () => {
                this.$nextTick(() => {
                  if (!this.$refs.chart || !this.$refs.temBox) return;
                  if (
                    ((this.chartClientHeight =
                      this.$refs.chart && this.$refs.chart.clientHeight),
                    !this.$refs.temBox)
                  )
                    return;
                  let e = this.$refs.temBox.clientHeight;
                  e > 0 && this.impGdp(0);
                });
              }),
              (0, u.L)({
                element: this.$el,
                handler: (e) => {
                  (this.isVisible = e), e && this.allLoaded && this.impGdp(0);
                },
              });
          },
          beforeDestroy() {
            this.$eventBus.$off("cubeTemplateChartResize"),
              this.$eventBus.$off("onPageInfoChange");
          },
          methods: {
            ...(0, s.mapActions)("hisComboMealRes", [
              "getHisComboMealResource",
            ]),
            ...(0, s.mapActions)("market", ["emitPageInfoChange"]),
            impGdp(e) {
              try {
                if (!this.displayTabList[e]) return;
                let t = this.displayTabList[e].vSubject5,
                  a = this.displayTabList[e].channelId,
                  n = this.displayTabList[e].markId,
                  o =
                    "余量查询" === document.title
                      ? "余量明细区"
                      : "余额查询" === document.title
                      ? "余额明细区"
                      : "";
                this.showedTabNumArr.includes(e) ||
                  (0, d.Z)("imp", {
                    WT_event: a,
                    WT_envName: "tab" + (Number(e) + 1) + "_ [" + t + "]",
                    WT_markId: n,
                    WT_area_type_1: "楼层",
                    WT_area_type_2: o,
                    WT_area_name: o,
                    XY_env_type: "button",
                    XY_brand_info:
                      p.gsmStateMap[this.userInfo.gsmState] ||
                      "其他非全球通用户",
                    XY_gd_source: this.displayTabList[e].source || "",
                    XY_point_position:
                      this.displayTabList[e].adverLocation || "",
                  }),
                  this.showedTabNumArr.push(e);
              } catch (t) {
                console.log(t);
              }
            },
            createLoadTask(e) {
              this.filterIsLink(e.vSubject6)
                ? this.loadPlugin(e.vSubject6, (t, a) => {
                    (e.loadStatus = t && a ? "success" : "error"),
                      t &&
                        (e.callLibrary = (n) => {
                          try {
                            let i = document.querySelector(
                              `#tab_${this.data.areaId}_${this.indexInArea}_${
                                this.pluginContainerTag || ""
                              }_${n}`
                            );
                            if (!i) return;
                            const r = document.createElement("div");
                            i.appendChild(r);
                            try {
                              let n = {
                                gdpTrace: d.Z,
                                YDRZToken: a,
                                eventBus: this.$eventBus,
                                onMainRequestEnd() {
                                  console.log("onMainRequestEnd");
                                },
                              };
                              this.filterIsLingXiLink(e.vSubject6) &&
                                (n = { ...n, pageData: this.reportLingXiData }),
                                console.log("h5插件传参：", n),
                                t(r, n),
                                this.$nextTick(() => {
                                  this.emitPageInfoChange();
                                });
                            } catch (o) {
                              console.log("callLibrary", o);
                            }
                          } catch (o) {}
                        });
                  })
                : this.calculateTabList.filter((e) =>
                    [
                      "flow001",
                      "flow002",
                      "voice001",
                      "voice002",
                      "message002",
                    ].includes(e.vSubject6)
                  ).length > 0 && this.fetchHisComboMealResource(e);
            },
            fetchHisComboMealResource(e) {
              (0, ea.Z)("getHisComboMealResource", () =>
                this.getHisComboMealResource()
              )
                .then((t) => {
                  this.historyChartData(t),
                    (e.loadStatus =
                      this.hisPlanRemainQry.length > 0 ? "success" : "error");
                })
                .catch(() => {
                  e.loadStatus = "error";
                });
            },
            findResourceCodeList(e, t) {
              if (!e || 0 === e.length) return [];
              let a = e.find((e) => e.resourcesCode === t);
              return a && a.planRemianAllList && a.planRemianAllList.length > 0
                ? a.planRemianAllList
                : [];
            },
            calculateTotal(e, t) {
              const a = e.filter((e) => e.type === t.toString());
              return 0 === a.length
                ? null
                : a.reduce((e, t) => {
                    if (!(0, oa.q6)(t.usdNum)) {
                      let a = Number(t.usdNum);
                      "04" == t.unit && (a *= 1024),
                        "05" == t.unit && (a = 1024 * a * 1024),
                        (e = (e || 0) + a);
                    }
                    return e;
                  }, 0);
            },
            historyChartData(e) {
              let t = new Array(6)
                .fill(1)
                .map((e, t) =>
                  kt()()
                    .subtract(t + 1, "month")
                    .format("YYYY-MM")
                )
                .reverse();
              if (
                Boolean(e) &&
                "000000" === e.retCode &&
                e.rspBody &&
                e.rspBody.qryInfoRsp &&
                e.rspBody.qryInfoRsp.hisPlanRemainQryListRes
              ) {
                let a = e.rspBody.qryInfoRsp.hisPlanRemainQryListRes;
                if (a && 6 === a.length) {
                  let e = t
                    .map((e) =>
                      a.find((t) => t.month === e.split("-").join(""))
                    )
                    .filter((e) => e);
                  if (6 !== e.length) return;
                  this.hisPlanRemainQry = e.map((e) => {
                    let t = { month: parseInt(e.month.slice(-2)) },
                      a = this.findResourceCodeList(e.planRemianAll, "04"),
                      n = this.findResourceCodeList(e.planRemianAll, "01"),
                      o = this.findResourceCodeList(e.planRemianAll, "02"),
                      i = this.findResourceCodeList(e.planRemianAll, "03"),
                      r = this.calculateTotal(a, "0"),
                      l = this.calculateTotal(a, "1"),
                      s = this.calculateTotal(a, "2"),
                      c = this.calculateTotal(n, "0"),
                      u = this.calculateTotal(n, "1"),
                      d = this.calculateTotal(o, "0"),
                      m = this.calculateTotal(i, "1"),
                      p = 0;
                    return (
                      d || 0 === d || m || 0 === m
                        ? ((m = m || 0), (d = d || 0), (p = m + d))
                        : (p = null),
                      (t.flowTotal = r ? Number(r.toFixed(2)) : r),
                      (t.OrientationFlowTotal = l ? Number(l.toFixed(2)) : l),
                      (t.otherFlowTotal = s ? Number(s.toFixed(2)) : s),
                      (t.voiceTotal = c ? Number(c.toFixed(2)) : c),
                      (t.otherVoice = u ? Number(u.toFixed(2)) : u),
                      (t.voiceTotalUsed = Number(
                        ((c || 0) + (u || 0)).toFixed(2)
                      )),
                      (t.msgTotal = (0, oa.D8)(p) ? Number(p.toFixed(2)) : p),
                      (t.flowTotalUsed = Number(
                        (
                          Number(t.flowTotal) +
                          Number(t.OrientationFlowTotal) +
                          Number(t.otherFlowTotal)
                        ).toFixed(2)
                      )),
                      t
                    );
                  });
                }
              }
              this.hisPlanRemainQry.length > 0 &&
                this.$nextTick(() => {
                  this.chartClientHeight =
                    this.$refs.chart && this.$refs.chart.clientHeight;
                });
            },
            filterIsLink(e) {
              let t =
                /^(http|https):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]+(\/.*)?$/;
              return t.test(e);
            },
            filterIsLingXiLink(e) {
              return e.includes("zxkf_AI_sdk.js");
            },
            changeTab(e) {
              var t, a, n;
              if (e === this.actTabIdx) return;
              let o = this.displayTabList[e].vSubject5,
                i = this.displayTabList[e].channelId,
                r = this.displayTabList[e].markId;
              (0, d.Z)("clk", {
                WT_et: "clk",
                WT_event: i,
                WT_envName: "tab" + (Number(e) + 1) + "_ [" + o + "]",
                WT_markId: r,
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name:
                  null === (t = this.allData) || void 0 === t
                    ? void 0
                    : t.areaName,
                area_id:
                  (null === (a = this.allData) || void 0 === a
                    ? void 0
                    : a.areaId) +
                  "_" +
                  (null === (n = this.allData) || void 0 === n
                    ? void 0
                    : n.moduleId),
                XY_point_position: e + 1,
              }),
                (this.actTabIdx = e),
                this.impGdp(e);
            },
            getUrl(e) {
              let t = {};
              if (e.indexOf("?") >= 0) {
                let a = e.split("?"),
                  n = a[1].split("&");
                for (let e = 0; e < n.length; e++) {
                  let a = n[e].split("=");
                  t[a[0]] = a[1];
                }
              }
              return t;
            },
            loadPlugin(e, t) {
              let a = this.getUrl(e).cmccYDRZSourceId || "";
              Promise.race([
                (0, ta.GR)(1e4),
                Promise.all([
                  this.loadJs(e.trim()),
                  (0, na.L)({ targetsourceid: a }),
                ]),
              ])
                .then(([e, a]) => {
                  t(e, a);
                })
                .catch((e) => {
                  console.info(2222, e), t();
                });
            },
            loadJs(e) {
              let [t] = e.split("/").reverse(),
                [a] = t.split("."),
                n = `h5Plugin_${a}`;
              return new Promise((t, o) => {
                (0, ta.PE)(n).lock(() => {
                  let i = document.createElement("script");
                  (i.type = "text/javascript"),
                    (i.onload = () => {
                      t(window[a]),
                        (0, ta.PE)(n).unlock(),
                        console.log("完成后解锁", a);
                    }),
                    (i.onerror = (e) => {
                      o(e), (0, ta.PE)(n).unlock();
                    }),
                    (i.src = e),
                    document.getElementsByTagName("head")[0].appendChild(i);
                });
              });
            },
          },
        },
        ra = ia,
        la = (0, v.Z)(ra, Ot, Ut, !1, null, "8dd5be68", null),
        sa = la.exports,
        ca = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "bannerWideTemplate" }, [
            t(
              "div",
              {
                class: [
                  e.tab
                    ? "bannerWideTemplate-item1"
                    : "bannerWideTemplate-item",
                ],
                on: {
                  click: function (t) {
                    return e.marketSectionClick(
                      e.data.adverList[0],
                      e.otherParams
                    );
                  },
                },
              },
              [
                t("img", { attrs: { src: e.data.adverList[0].imageUrl } }),
                "1" == e.data.adverList[0].adverLabel
                  ? t("span", { staticClass: "cormark" })
                  : e._e(),
              ]
            ),
          ]);
        },
        ua = [],
        da = {
          name: "BannerWideTemplate",
          mixins: [h],
          props: ["data", "tab"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        ma = da,
        pa = (0, v.Z)(ma, ca, ua, !1, null, "665455e4", null),
        ha = pa.exports,
        fa = function () {
          var e = this,
            t = e._self._c;
          return t("div", { staticClass: "bannerNarrowTemplate" }, [
            t(
              "div",
              {
                class: [
                  e.tab
                    ? "bannerNarrowTemplate-item1"
                    : "bannerNarrowTemplate-item",
                ],
                on: {
                  click: function (t) {
                    return e.marketSectionClick(
                      e.data.adverList[0],
                      e.otherParams
                    );
                  },
                },
              },
              [
                t("img", { attrs: { src: e.data.adverList[0].imageUrl } }),
                "1" == e.data.adverList[0].adverLabel
                  ? t("span", { staticClass: "cormark" })
                  : e._e(),
              ]
            ),
          ]);
        },
        ga = [],
        va = {
          name: "BannerNarrowTemplate",
          mixins: [h],
          props: ["data", "tab"],
          computed: {
            otherParams() {
              return {
                WT_area_type_1: "楼层",
                WT_area_type_2: "营销区域",
                WT_area_name: this.data.areaName,
                area_id: this.data.areaId + "_" + this.data.moduleId,
              };
            },
          },
          methods: { marketSectionClick: c.E },
        },
        Aa = va,
        ya = (0, v.Z)(Aa, fa, ga, !1, null, "035f0a35", null),
        Ta = ya.exports,
        Sa = a(24521),
        Ia = a(87630),
        ba = {
          name: "MarketSection",
          components: {
            PullAppPoint: Ia.Z,
            NoticeBarTemplate: y,
            IconAcrossTemplate: _,
            IconVerticalTemplate: D,
            IconTitleTemplate: O,
            BannerTemplate: de,
            TextButtonTemplate: ve,
            CardTemplate1: be,
            CardTemplate2: Pe,
            CardTemplate3: Me,
            CardTemplate4: Ze,
            ButtonTemplate1: qe,
            ButtonTemplate2: $e,
            TabTemplate: bt,
            ReminderTemplate: Lt,
            FlowSliceTemplate: Rt,
            CubeTemplate: sa,
            BannerWideTemplate: ha,
            BannerNarrowTemplate: Ta,
          },
          props: ["areaData", "suctionBottom", "tab", "pluginContainerTag"],
          data() {
            return { preventMarketClick: !1, noticeBarCloseStatus: {} };
          },
          computed: {
            ...(0, s.mapState)({
              userInfo: (e) => e.userInfo,
              isTouch: (e) => e.login.isTouch,
            }),
            moduleList() {
              let e = Qt()(this.areaData);
              if (e && e.moduleList) {
                let t = e.moduleList;
                return (
                  t.forEach((e, t) => {
                    if (
                      ((e.areaId = this.areaData.areaId),
                      (e.areaName = this.areaData.areaName || ""),
                      ("market-noticeText-2-001" !== e.moduleId &&
                        "market-noticeIcon-2-001" !== e.moduleId) ||
                        this.$set(this.noticeBarCloseStatus, t, !1),
                      null != e.tabList)
                    ) {
                      let t = !0;
                      e.tabList.forEach((a) => {
                        a.tabModuleList &&
                          a.tabModuleList.length > 0 &&
                          a.tabModuleList.forEach((n) => {
                            n.tabModuleAdVerList.length >= 1
                              ? (a.adverList = n.tabModuleAdVerList)
                              : (t = !1),
                              (e.moduleId = n.tabModuleId);
                          });
                      }),
                        (e.show = t);
                    }
                  }),
                  t.forEach((e, t) => {
                    (0, Sa.nY)([
                      {
                        eleId:
                          "location1_" + e.areaId + "_" + e.moduleId + "_" + t,
                      },
                    ]);
                  }),
                  t
                );
              }
              return [];
            },
          },
          methods: {
            noticeClose(e) {
              this.$set(this.noticeBarCloseStatus, e, !0);
            },
            launchClick() {
              (this.preventMarketClick = !0), console.log("market-launchClick");
            },
          },
        },
        Ca = ba,
        wa = (0, v.Z)(Ca, n, o, !1, null, "434d2a78", null),
        _a = wa.exports;
    },
    77362: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return m;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return e.noticeList && e.noticeList.length
            ? t("div", { staticClass: "notice-view" }, [
                t(
                  "div",
                  { class: ["notice-content"] },
                  e._l(e.noticeList, function (a) {
                    return t(
                      "div",
                      {
                        directives: [
                          {
                            name: "speech",
                            rawName: "v-speech",
                            value: e.readTxt(a),
                            expression: "readTxt(item)",
                          },
                        ],
                        key: a.markId,
                        staticClass: "notice-content-item",
                      },
                      [e._v(" " + e._s(e.showTxt(a)) + " ")]
                    );
                  }),
                  0
                ),
              ])
            : e._e();
        },
        o = [],
        i = (a(2490), a(59461), a(26294)),
        r = a(86842),
        l = a.n(r),
        s = {
          name: "ReminderTemplateCare",
          computed: {
            ...(0, i.mapState)({
              userInfo: (e) => e.userInfo,
              areaList: (e) => e.market.areaList,
              remindCodeObj: (e) => e.common.remindCodeObj,
            }),
            noticeList() {
              let e =
                  this.areaList &&
                  this.areaList.length &&
                  this.areaList.find(
                    (e) => e.areaId === this.remindCodeObj[document.title]
                  ),
                t =
                  e && e.moduleList[0] && e.moduleList[0].adverList.length > 0
                    ? e.moduleList[0].adverList[0].noticeTxt
                    : [];
              return 0 === t.length ? [] : t.split("\\n");
            },
          },
          methods: {
            formatTel(e) {
              return e ? e.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "";
            },
            readPhone() {
              return this.userInfo.phoneNumber
                ? "手机尾号" + this.userInfo.phoneNumber.slice(-4)
                : "手机号暂未获取";
            },
            showTxt(e) {
              return e
                .replace(
                  /#phoneNum#/g,
                  this.formatTel(this.userInfo.phoneNumber)
                )
                .replace(/#date#/g, l()().format("YYYY-MM-DD"))
                .replace(/#datetime#/g, l()().format("YYYY-MM-DD HH:mm:ss"))
                .replace(/#datetime_nosec#/g, l()().format("YYYY-MM-DD HH:mm"))
                .replace(
                  /#datetime_hour#/g,
                  l()().format("YYYY年MM月DD日HH时")
                );
            },
            readTxt(e) {
              return e
                .replace(
                  /#phoneNum#/g,
                  this.readPhone(this.userInfo.phoneNumber)
                )
                .replace(/#date#/g, l()().format("YYYY年MM月DD日"))
                .replace(
                  /#datetime#/g,
                  l()().format("YYYY年MM月DD日 HH时mm分ss秒")
                )
                .replace(
                  /#datetime_nosec#/g,
                  l()().format("YYYY年MM月DD日 HH时mm分")
                )
                .replace(/#datetime_hour#/g, l()().format("YYYY年MM月DD日HH时"))
                .replace(/\b(10086|10080)\b/g, (e) => e.split("").join(" "));
            },
          },
        },
        c = s,
        u = a(1001),
        d = (0, u.Z)(c, n, o, !1, null, "1af9f93f", null),
        m = d.exports;
    },
    94564: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return Q;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return e.bottomArea && e.bottomArea.moduleList
            ? t(
                "div",
                [
                  t("div", {
                    style: `background: #f5f5f5;height:${e.shadowHeight}px`,
                  }),
                  t(
                    "div",
                    {
                      ref: "SuctionBottomFloor",
                      class: [
                        "SuctionBottomFloor",
                        e.isSetPaddingBtm ? "paddingBtm" : "",
                      ],
                    },
                    [
                      t("MarketSection", {
                        attrs: { areaData: e.bottomArea, suctionBottom: !0 },
                      }),
                    ],
                    1
                  ),
                  e.marketServiceList.length > 0 ? t("FloatingBar") : e._e(),
                ],
                1
              )
            : e._e();
        },
        o = [],
        i = (a(2490), a(59849), a(9924), a(35433)),
        r = (a(20726), a(10521)),
        l = (a(26699), a(34514), a(15222)),
        s = a(6648),
        c = a(72856),
        u = a(14034),
        d = a(42642),
        m = a(10936),
        p = a.n(m),
        h = a(11671),
        f = a(44830);
      function g(e) {
        let t =
            "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890",
          a = "";
        for (let n = 0; n < e; n++)
          a += t.charAt(Math.floor(Math.random() * t.length));
        return a;
      }
      let v = {
          myPackage: {
            scene: "我的套餐",
            imp: { immediate: {}, delay: {} },
            close: {
              immediate: { WT_envName: "关闭", WT_event: "P00000088904" },
              delay: { WT_envName: "关闭", WT_event: "P00000088903" },
            },
            jump: { immediate: {}, delay: {} },
          },
          balanceQuery: {
            scene: "余额查询",
            imp: { immediate: {}, delay: {} },
            close: {
              immediate: { WT_envName: "关闭", WT_event: "P00000088906" },
              delay: { WT_envName: "关闭", WT_event: "P00000088905" },
            },
            jump: { immediate: {}, delay: {} },
          },
          detailQuery: {
            scene: "详单查询",
            imp: { immediate: {}, delay: {} },
            close: {
              immediate: { WT_envName: "关闭", WT_event: "" },
              delay: { WT_envName: "关闭", WT_event: "P00000088907" },
            },
            jump: { immediate: {}, delay: {} },
          },
          marginQuery: {
            scene: "余量查询",
            imp: { immediate: {}, delay: {} },
            close: {
              immediate: { WT_envName: "关闭", WT_event: "P00000090467" },
              delay: { WT_envName: "关闭", WT_event: "P00000090469" },
            },
            jump: { immediate: {}, delay: {} },
          },
          phoneBills: {
            scene: "账单查询",
            imp: { immediate: {}, delay: {} },
            close: {
              immediate: { WT_envName: "关闭", WT_event: "P00000090463" },
              delay: { WT_envName: "关闭", WT_event: "P00000090465" },
            },
            jump: { immediate: {}, delay: {} },
          },
          businessQuery: {
            scene: "已订业务",
            imp: { immediate: {}, delay: {} },
            close: {
              immediate: { WT_envName: "关闭", WT_event: "P00000099310" },
              delay: { WT_envName: "关闭", WT_event: "P00000099311" },
            },
            jump: { immediate: {}, delay: {} },
          },
          myPackageLite: {
            scene: "套餐提醒服务",
            imp: { immediate: {}, delay: {} },
            close: { immediate: {}, delay: {} },
            jump: { immediate: {}, delay: {} },
          },
          scoreLite: {
            scene: "积分提醒服务",
            imp: { immediate: {}, delay: {} },
            close: { immediate: {}, delay: {} },
            jump: { immediate: {}, delay: {} },
          },
          phoneBillsLite: {
            scene: "账单提醒服务",
            imp: { immediate: {}, delay: {} },
            close: { immediate: {}, delay: {} },
            jump: { immediate: {}, delay: {} },
          },
          businessQueryLite: {
            scene: "业务提醒服务",
            imp: { immediate: {}, delay: {} },
            close: { immediate: {}, delay: {} },
            jump: { immediate: {}, delay: {} },
          },
          balanceQueryLite: {
            scene: "余额提醒服务",
            imp: { immediate: {}, delay: {} },
            close: { immediate: {}, delay: {} },
            jump: { immediate: {}, delay: {} },
          },
          marginQueryLite: {
            scene: "余量提醒服务",
            imp: { immediate: {}, delay: {} },
            close: { immediate: {}, delay: {} },
            jump: { immediate: {}, delay: {} },
          },
        },
        A = `${String(parseInt(new Date().getTime() / 1e3))}${g(22)}`,
        y = [],
        T = "1",
        S = !1,
        I = "",
        b = !1;
      function C() {
        y &&
          y.length &&
          y.forEach((e) => {
            e.refreshWaitTask();
          });
      }
      function w(e) {
        try {
          if (!e) return "";
          const t = (0, l.eY)("ext", e);
          if (t) {
            const e = JSON.parse(decodeURIComponent(t));
            return e.scene ? e.scene : "";
          }
        } catch (t) {
          return console.log("getSceneFromSkillLink error", t), "";
        }
      }
      let _ = () => {},
        k = () => {};
      const N = (e) => {
        (b = !!e.isCollapsedOnScroll),
          "clickJump" === e.businessName
            ? (console.log("showBottomFloatView clickJump", e), _())
            : "btnFunction" === e.businessName &&
              (console.log("showBottomFloatView btnFunction", e), k());
      };
      class P {
        constructor(e, t) {
          (this.options = {
            cellNum: c["default"].state.userInfo.phoneNumber,
            provinceCode: c["default"].state.userInfo.province,
            open: !1,
            serviceType: "",
            stayDuration: "",
            btnTxt: "",
            title: "",
            image: "",
            url: "",
            channelId: "",
            markId: "",
            envName: "",
            serial_no: "",
            actionFun: null,
            timeoutID: null,
            actionType: null,
            serviceAppendParams: {
              XY_cs_type: "",
              XY_scene: "",
              XY_kf_fixedvalue: "客服",
            },
          }),
            (this.pageConfig = v[c["default"].getters.pageName]),
            (this.userInfo = c["default"].state.userInfo),
            (this.marketService = e),
            (this.hasShow = !1),
            (this.getBottomFloorHeightFun = t);
        }
        obtainFromMarketService() {
          this.options.open = "0" === this.marketService.vDiyParameter;
          let e = this.marketService.vSubject4 || "0";
          (this.options.stayDuration = 1e3 * parseInt(e)),
            (this.options.serviceType = this.marketService.vDiyParameter1
              ? JSON.stringify(this.marketService.vDiyParameter1)
              : ""),
            (this.options.channelId = this.marketService.channelId),
            (this.options.markId = this.marketService.markId),
            (this.options.envName =
              this.marketService.vSubject1 || this.marketService.vSubject),
            "3" === this.marketService.marketionType &&
            this.marketService.subActivityId
              ? (this.options.serialNo =
                  "IOP_" + this.marketService.subActivityId)
              : "4" === this.marketService.marketionType &&
                this.marketService.subActivityId &&
                (this.options.serialNo =
                  "PRIOP_" + this.marketService.subActivityId);
        }
        async obtainFromMindStrategy() {
          let e = `${String(parseInt(new Date().getTime() / 1e3))}${g(22)}`,
            t = new Date().getTime(),
            a = await (0, u.u0)({
              cellNum: this.options.cellNum,
              provinceCode: this.options.provinceCode,
              callId: e,
              requestId: e,
              sessionId: A,
              sellerId: (0, l.eY)("sellerId") || "",
              channelEX: {
                businessId: this.options.channelId || "",
                scene: this.pageConfig.scene,
              },
            }),
            n = new Date().getTime();
          if (
            (console.log("mindStrategy time", n - t),
            (this.options.mindStrategy = a),
            "000000" === a.retCode)
          ) {
            let t = a.rspBody,
              { beans: n, bean: o } = t,
              { action: i, data: l } = n,
              c = "expand-7" === i && this.options.serviceType.includes("4"),
              u =
                "expand-hotline" === i &&
                this.options.serviceType.includes("0");
            if (c || u) {
              console.log("配置音视频客服", this.options),
                c
                  ? ((this.options.title = this.marketService.vSubject13),
                    (this.options.image = this.marketService.vImage6),
                    (this.options.btnTxt = this.marketService.vSubject14),
                    (this.options.serviceAppendParams.XY_cs_type = "1"))
                  : ((this.options.title = this.marketService.vSubject5),
                    (this.options.image = this.marketService.vImage2),
                    (this.options.btnTxt = this.marketService.vSubject6),
                    (this.options.serviceAppendParams.XY_cs_type = "0"));
              let t = c ? l.videoSkills : l.audioSkills,
                a = l.sceneEntry,
                n = c ? l.videoSkills.split("#")[0] : o.companyId;
              this.options.serviceAppendParams.XY_scene = a;
              let i = {
                debug: !1,
                type: c ? "1" : "0",
                useOneScreen: !0,
                useGonetoneUserFlag: !1,
                voiceCallUseOnline: !1,
                appKey: t,
                companyId: n,
                provinceCode: this.options.provinceCode,
                sceneEntry: a,
                guideVideoNumber: "0",
                guideVoiceNumber: "0",
                ext: { callId: e, requestId: e, sessionId: A },
              };
              this.options.actionFun = () => {
                console.log("call startVoipVoiceOrVideo", i),
                  (0, s.h)(i)
                    .then((e) => {
                      console.log("音视频客服拉起回调success方法", e);
                    })
                    .catch((e) => {
                      (0, r.Z)("客服开小差了，请稍后再试~~"),
                        console.log("音视频客服拉起回调error方法", e);
                    });
              };
            } else
              "expand-text" === i && this.options.serviceType.includes("1")
                ? ((this.options.url = l.skillLink),
                  (this.options.title = this.marketService.vSubject7),
                  (this.options.image = this.marketService.vImage3),
                  (this.options.btnTxt = this.marketService.vSubject8),
                  (this.options.serviceAppendParams.XY_cs_type = "2"),
                  (this.options.serviceAppendParams.XY_scene = w(l.skillLink)))
                : ("expand-2" !== i && "expand-3" !== i) ||
                  !this.options.serviceType.includes("2")
                ? "pagejump" === i &&
                  this.options.serviceType.includes("3") &&
                  ((this.options.title = this.marketService.vSubject11),
                  (this.options.image = this.marketService.vImage5),
                  (this.options.btnTxt = this.marketService.vSubject12),
                  (this.options.url = this.marketService.vLinkUrl),
                  (this.options.actionType = this.marketService.actionType))
                : ((this.options.url = l.skillLink),
                  (this.options.title = this.marketService.vSubject9),
                  (this.options.image = this.marketService.vImage4),
                  (this.options.btnTxt = this.marketService.vSubject10),
                  (this.options.serviceAppendParams.XY_cs_type = "3"),
                  (this.options.serviceAppendParams.XY_scene = w(l.skillLink)));
          }
        }
        async callShowBottomFloatView() {
          if (
            (console.log("调用前 document.hidden", document.hidden),
            document.hidden)
          )
            return !0;
          await this.obtainFromMindStrategy();
          const e = {
            imgUrl: this.options.image || "",
            contentTxt: this.options.title || "",
            btnText: this.options.btnTxt || "",
            url: "",
            isClickJump: !0,
            bottom: 0,
          };
          this.options.url
            ? ((e.url = this.options.url),
              (_ = () => {
                f.Z.go({
                  actionType: this.options.actionType || "1",
                  url: e.url,
                }),
                  this.traceJumpClk(!1),
                  C(),
                  (T = "1");
              }))
            : this.options.actionFun &&
              ((e.isClickJump = !1),
              (k = () => {
                this.options.actionFun(), this.traceJumpClk(!0), C(), (T = "1");
              }));
          try {
            let t = this.getBottomFloorHeightFun();
            e.bottom = t || 0;
          } catch (t) {
            console.log("getBottomFloorHeightFun error", t);
          }
          console.log("call showBottomFloatView", e),
            (!e.url && e.isClickJump) ||
              (h.Z.$emit("FloatingBarShow", e),
              (this.hasShow = !0),
              this.traceImp());
        }
        callShowBottomFloatViewByTimeout() {
          console.log("call showBottomFloatView", this.options.stayDuration),
            (this.options.timeoutID = setTimeout(() => {
              this.callShowBottomFloatView();
            }, this.options.stayDuration));
        }
        traceImp() {
          var e, t, a, n, o, i, r;
          let l = 0 === this.options.stayDuration ? "immediate" : "delay",
            s = this.pageConfig["imp"][l],
            c = {
              ...s,
              ...this.options.serviceAppendParams,
              WT_envName: this.options.envName || "",
              WT_event: this.options.channelId || "",
              WT_next_url: this.options.url || "",
              WT_markId: this.options.markId || "",
              XY_gd_source:
                (null === (e = this.marketService) || void 0 === e
                  ? void 0
                  : e.source) || "",
            };
          var u;
          "1" ===
            (null === (t = this.options) ||
            void 0 === t ||
            null === (a = t.serviceAppendParams) ||
            void 0 === a
              ? void 0
              : a.XY_cs_type) ||
          "0" ===
            (null === (n = this.options) ||
            void 0 === n ||
            null === (o = n.serviceAppendParams) ||
            void 0 === o
              ? void 0
              : o.XY_cs_type) ||
          "2" ===
            (null === (i = this.options) ||
            void 0 === i ||
            null === (r = i.serviceAppendParams) ||
            void 0 === r
              ? void 0
              : r.XY_cs_type)
            ? ((S = !0),
              (c = {
                ...this.options.serviceAppendParams,
                WT_event: this.options.channelId || "",
                WT_area_type_1: "浮条",
                WT_area_name:
                  0 === this.options.stayDuration ? "即时浮条" : "延时浮条",
                WT_area_type_2: "客服类",
                WT_envName: "弹出",
                WT_next_url: this.options.url || "",
                area_id: I + "_market-service-001",
                WT_markId: this.options.markId || "",
                XY_gd_source:
                  (null === (u = this.marketService) || void 0 === u
                    ? void 0
                    : u.source) || "",
              }))
            : (S = !1);
          (0, d.Z)("imp", c), console.log("traceImp", c);
        }
        traceJumpClk(e) {
          var t, a;
          const n = 0 === this.options.stayDuration ? "即时" : "延时",
            o = b ? "icon" : "浮条";
          let i = {
            ...this.options.serviceAppendParams,
            WT_event: this.options.channelId || "",
            WT_area_type_1: "浮条",
            WT_area_name: `${n}${o}`,
            WT_area_type_2: "客服类",
            XY_env_type: b ? "icon" : "button",
            WT_next_url: e ? "" : this.options.url || "",
            WT_envName:
              (null === (t = this.options) || void 0 === t
                ? void 0
                : t.envName) || "",
            XY_gd_source:
              (null === (a = this.marketService) || void 0 === a
                ? void 0
                : a.source) || "",
            WT_markId:
              "qqd" === this.marketService.source
                ? this.marketService.markId
                : this.marketService.advBusiType +
                  "_" +
                  this.marketService.markId,
            area_id: I + "_market-service-001",
          };
          (0, d.Z)("clk", i), console.log("traceJumpClk", i);
        }
        traceCloseClk() {
          let e = 0 === this.options.stayDuration ? "immediate" : "delay",
            t = this.pageConfig["close"][e],
            a = {
              ...t,
              WT_envName: "关闭",
              WT_next_url: this.options.url || "",
              WT_markId: this.options.markId || "",
            };
          S &&
            (a = {
              ...this.options.serviceAppendParams,
              WT_event: this.options.channelId || "",
              WT_area_type_1: "浮条",
              WT_area_name: 0 === this.options.stayDuration ? "即时" : "延时",
              WT_area_type_2: "客服类",
              XY_env_type: "button",
              WT_envName: "关闭",
              WT_next_url: this.options.url || "",
              area_id: I + "_market-service-001",
            }),
            (0, d.Z)("clk", a),
            console.log("traceCloseClk", a);
        }
        async execute() {
          console.log("执行策略", this.marketService);
          try {
            this.marketService && this.obtainFromMarketService(),
              console.log("执行策略 拉取完数据", this.options),
              this.options.open &&
                (0 === this.options.stayDuration
                  ? this.callShowBottomFloatView()
                  : this.options.stayDuration > 0 &&
                    (this.callShowBottomFloatViewByTimeout(), y.push(this)));
          } catch (e) {
            console.log("intelligentSchedule execute error", e);
          }
        }
        refreshWaitTask() {
          this.hasShow ||
            (0 !== this.options.stayDuration &&
              (clearTimeout(this.options.timeoutID),
              this.callShowBottomFloatViewByTimeout()));
        }
      }
      function B(e, t, a = "") {
        if (((I = a), e && t))
          try {
            let a = v[c["default"].getters.pageName];
            if (!a)
              return void console.log("intelligentSchedule no pageConfig");
            h.Z.$off("FloatingBarClick", N), h.Z.$on("FloatingBarClick", N);
            let n = null;
            document.addEventListener(
              "scroll",
              p()(
                () => {
                  "1" === T &&
                    h.Z.$emit("FloatingBarToggleExpand", {
                      toggle: "0",
                      callback: () => {
                        (T = "0"), console.log("收缩===浮条回调success方法", T);
                      },
                    }),
                    clearTimeout(n),
                    (n = setTimeout(() => {
                      h.Z.$emit("FloatingBarToggleExpand", {
                        toggle: "1",
                        callback: () => {
                          (T = "1"),
                            console.log("展开===浮条回调success方法", T);
                        },
                      });
                    }, 3e3));
                },
                100,
                { leading: !0 }
              )
            ),
              document.addEventListener("visibilitychange", function () {
                console.log("监听 document.hidden", document.hidden),
                  document.hidden
                    ? console.log("标签页被切换到后台")
                    : (console.log("标签页被切换到前台"), C());
              }),
              e.forEach((e) => {
                e &&
                  e.forEach((e) => {
                    let a = new P(e, t);
                    a.execute();
                  });
              });
          } catch (n) {
            console.log("intelligentSchedule error", n);
          }
        else console.log("intelligentSchedule input error", e, t);
      }
      var L = a(26294),
        D = function () {
          var e = this,
            t = e._self._c;
          return t("transition", { attrs: { name: "expand" } }, [
            e.visible
              ? t(
                  "div",
                  {
                    staticClass: "floating-bar-container",
                    style: e.containerStyle,
                  },
                  [
                    t(
                      "div",
                      {
                        staticClass: "inner-layout",
                        style: e.innerLayoutStyle,
                      },
                      [
                        t(
                          "div",
                          {
                            staticClass: "icon-wrap",
                            on: { click: e.handleIconClick },
                          },
                          [
                            e.floatingBarData.imgUrl
                              ? t("img", {
                                  staticClass: "icon-img",
                                  attrs: { src: e.floatingBarData.imgUrl },
                                })
                              : e._e(),
                          ]
                        ),
                        t("div", { staticClass: "right-content" }, [
                          t("div", { staticClass: "text-content" }, [
                            t("div", { staticClass: "text-display" }, [
                              e._v(e._s(e.floatingBarData.contentTxt || "")),
                            ]),
                          ]),
                          t(
                            "div",
                            {
                              staticClass: "action-btn",
                              on: { click: e.handleClick },
                            },
                            [
                              t("span", { staticClass: "action-btn-text" }, [
                                e._v(e._s(e.floatingBarData.btnText || "")),
                              ]),
                            ]
                          ),
                        ]),
                      ]
                    ),
                  ]
                )
              : e._e(),
          ]);
        },
        E = [];
      function x(e) {
        return (e / 750) * 100 + "vw";
      }
      var M = {
          name: "FloatingBar",
          data() {
            return {
              floatingBarData: {
                imgUrl: "",
                contentTxt: "",
                btnText: "",
                isClickJump: !0,
                bottom: 0,
              },
              visible: !1,
              isCollapsedOnScroll: !1,
            };
          },
          computed: {
            dynamicBottom() {
              return 0 === this.floatingBarData.bottom
                ? x(68)
                : `calc(${this.floatingBarData.bottom}px + ${x(10)} )`;
            },
            containerStyle() {
              let e = 76,
                t = 76,
                a = 0,
                n = 38;
              return (
                this.visible &&
                  (this.isCollapsedOnScroll
                    ? ((e = 76), (t = 76), (a = 0.85), (n = 38))
                    : ((e = 554), (t = 92), (a = 1), (n = 48))),
                {
                  width: x(e),
                  height: x(t),
                  opacity: a,
                  borderRadius: x(n),
                  bottom: this.dynamicBottom,
                }
              );
            },
            innerLayoutStyle() {
              const e = this.visible && !this.isCollapsedOnScroll,
                t = e ? 16 : 6;
              return {
                width: "100%",
                paddingLeft: x(t),
                paddingRight: x(t),
                height: "100%",
              };
            },
          },
          mounted() {
            h.Z.$on("FloatingBarToggleExpand", this.handleToggleExpand),
              h.Z.$on("FloatingBarShow", this.handleShowFloatingBar);
          },
          beforeDestroy() {
            h.Z.$off("FloatingBarToggleExpand"), h.Z.$off("FloatingBarShow");
          },
          methods: {
            handleShowFloatingBar(e) {
              (this.floatingBarData = { ...e }),
                this.visible ||
                  ((this.visible = !0), (this.isCollapsedOnScroll = !1));
            },
            handleToggleExpand({ toggle: e, callback: t }) {
              this.visible &&
                ((this.isCollapsedOnScroll = "1" !== e),
                console.log(
                  "this.isCollapsedOnScroll 是否收起",
                  this.isCollapsedOnScroll
                ),
                t && t());
            },
            handleIconClick() {
              this.isCollapsedOnScroll && this.handleClick();
            },
            handleClick() {
              this.visible = !1;
              const e = this.floatingBarData.isClickJump
                ? "clickJump"
                : "btnFunction";
              h.Z.$emit("FloatingBarClick", {
                businessName: e,
                isCollapsedOnScroll: this.isCollapsedOnScroll,
              }),
                (this.isCollapsedOnScroll = !1);
            },
          },
        },
        W = M,
        R = a(1001),
        O = (0, R.Z)(W, D, E, !1, null, "0b825b76", null),
        U = O.exports,
        F = {
          name: "SuctionBottomFloor",
          components: { FloatingBar: U, MarketSection: i.Z },
          data() {
            return { shadowHeight: 0, marketServiceList: [] };
          },
          computed: {
            ...(0, L.mapState)({
              userInfo: (e) => e.userInfo,
              bottomArea: (e) => e.market.bottomArea,
              isTouch: (e) => e.login.isTouch,
            }),
            isSetPaddingBtm() {
              if (
                this.bottomArea &&
                this.bottomArea.moduleList &&
                this.bottomArea.moduleList.length
              ) {
                let e = this.bottomArea.moduleList.filter((e) => {
                    var t;
                    return (
                      "market-button-1-001" === e.moduleId &&
                      2 ===
                        (null === (t = e.adverList) || void 0 === t
                          ? void 0
                          : t.length)
                    );
                  }),
                  t = this.bottomArea.moduleList.filter((e) => {
                    var t;
                    return (
                      "market-button-2-001" === e.moduleId &&
                      3 ===
                        (null === (t = e.adverList) || void 0 === t
                          ? void 0
                          : t.length)
                    );
                  });
                return e.length > 0 || t.length > 0;
              }
              return !1;
            },
          },
          mounted() {
            this.init();
          },
          methods: {
            init() {
              this.$nextTick(() => {
                const e = this.$refs.SuctionBottomFloor.offsetHeight;
                if (
                  ((this.shadowHeight = e),
                  this.bottomArea &&
                    this.bottomArea.moduleList &&
                    this.bottomArea.moduleList.length &&
                    this.isTouch)
                ) {
                  let t = this.bottomArea.moduleList
                    .filter((e) => "market-service-001" === e.moduleId)
                    .map((e) => e.adverList);
                  if (!t || 0 === t.length)
                    return void console.log(
                      "intelligentSchedule 未命中marketService数据"
                    );
                  (this.marketServiceList = t),
                    console.log("intelligentSchedule marketServiceList", t),
                    B(this.marketServiceList, () => e, this.bottomArea.areaId);
                }
              });
            },
          },
        },
        Z = F,
        V = (0, R.Z)(Z, n, o, !1, null, "0dd15c12", null),
        Q = V.exports;
    },
    42223: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return y;
        },
      });
      var n = function () {
          var e = this,
            t = e._self._c;
          return t(
            "popup",
            {
              style: { backgroundColor: "transparent" },
              attrs: {
                position: "center",
                round: "",
                "get-container": "body",
                "close-on-click-overlay": !1,
                "overlay-style": { "background-color": "rgba(0, 0, 0, 0.6)" },
              },
              model: {
                value: e.showPopup,
                callback: function (t) {
                  e.showPopup = t;
                },
                expression: "showPopup",
              },
            },
            [
              e.realTimePopupData
                ? t("div", { staticClass: "container-center" }, [
                    t("div", { staticClass: "popup-container" }, [
                      e.imageMap[e.realTimePopupData.styleType]
                        ? t("img", {
                            staticClass: "top-img",
                            attrs: {
                              src: e.imageMap[e.realTimePopupData.styleType],
                              alt: "",
                            },
                          })
                        : e._e(),
                      t("div", { staticClass: "content-wrap" }, [
                        t(
                          "div",
                          { staticClass: "icon-container" },
                          [
                            t("SvgPlaint", { staticClass: "icon" }),
                            t("div", { staticClass: "content-text" }, [
                              e._v(e._s(e.realTimePopupData.popTxt)),
                            ]),
                          ],
                          1
                        ),
                        t("div", { staticClass: "btn-wrap" }, [
                          t(
                            "div",
                            {
                              staticClass: "left-btn",
                              on: { click: e.leftBtnClick },
                            },
                            [e._v(e._s(e.realTimePopupData.leftBtn))]
                          ),
                          t(
                            "div",
                            {
                              staticClass: "right-btn",
                              on: { click: e.rightBtnClick },
                            },
                            [e._v(e._s(e.realTimePopupData.rightBtn))]
                          ),
                        ]),
                      ]),
                    ]),
                    t("div", { staticClass: "close-btn-wrap" }, [
                      t("img", {
                        attrs: { src: a(52238), alt: "" },
                        on: { click: e.closePopup },
                      }),
                    ]),
                  ])
                : e._e(),
            ]
          );
        },
        o = [],
        i = (a(20058), a(36695)),
        r = a(26294),
        l = function () {
          var e = this,
            t = e._self._c;
          return t(
            "svg",
            {
              attrs: {
                width: "56px",
                height: "56px",
                viewBox: "0 0 56 56",
                version: "1.1",
                xmlns: "http://www.w3.org/2000/svg",
                "xmlns:xlink": "http://www.w3.org/1999/xlink",
              },
            },
            [
              t(
                "g",
                {
                  attrs: {
                    stroke: "none",
                    "stroke-width": "1",
                    fill: "none",
                    "fill-rule": "evenodd",
                  },
                },
                [
                  t(
                    "g",
                    {
                      staticClass: "icon-color",
                      attrs: {
                        transform: "translate(-109.000000, -733.000000)",
                        "fill-rule": "nonzero",
                      },
                    },
                    [
                      t(
                        "g",
                        {
                          attrs: {
                            transform: "translate(109.000000, 733.000000)",
                          },
                        },
                        [
                          t("path", {
                            attrs: {
                              d: "M28,56 C12.5356,56 0,43.4644 0,28 C0,12.5356 12.5356,0 28,0 C43.4644,0 56,12.5356 56,28 C56,43.4644 43.4644,56 28,56 Z M28,50.4 C40.3711784,50.4 50.4,40.3711784 50.4,28 C50.4,15.6288216 40.3711784,5.60000004 28,5.60000004 C15.6288218,5.60000004 5.60000051,15.6288218 5.60000051,28 C5.60000051,40.3711782 15.6288218,50.4 28,50.4 Z M28.1484,34.7452 C29.4489631,34.7450254 30.6508078,35.4387673 31.3011398,36.5650589 C31.9514717,37.6913505 31.9514717,39.0790494 31.3011398,40.2053411 C30.6508078,41.3316327 29.4489631,42.0253746 28.1484,42.0252 C26.1382744,42.0249301 24.5088887,40.3953256 24.5088887,38.3852 C24.5088887,36.3750743 26.1382744,34.7454699 28.1484,34.7452 L28.1484,34.7452 Z M28,14 C29.5463973,14 30.8,15.2536027 30.8,16.8 L30.8,28 C30.8,29.5463973 29.5463973,30.8 28,30.8 C26.4536027,30.8 25.2,29.5463973 25.2,28 L25.2,16.8 C25.2,15.2536027 26.4536027,14 28,14 L28,14 Z",
                            },
                          }),
                        ]
                      ),
                    ]
                  ),
                ]
              ),
            ]
          );
        },
        s = [],
        c = { name: "SvgPlaint" },
        u = c,
        d = a(1001),
        m = (0, d.Z)(u, l, s, !1, null, "441a1bf5", null),
        p = m.exports,
        h = a(44830),
        f = a(42642),
        g = {
          name: "RealTimePopup",
          components: { Popup: i.Z, SvgPlaint: p },
          computed: {
            ...(0, r.mapState)({
              realTimePopupData: (e) => e.realTimePopup.realTimePopupData,
              showPopup: (e) => e.realTimePopup.showRealTimePopup,
              isSkinMode: (e) => e.skin.isSkinMode,
            }),
            imageMap() {
              return this.isSkinMode
                ? {
                    1: "https://app.online-cmcc.cn/rn-module/prod/common/popup-balance-skin.png",
                    2: "https://app.online-cmcc.cn/rn-module/prod/common/popup-consume-skin.png",
                    3: "https://app.online-cmcc.cn/rn-module/prod/common/popup-traffic-skin.png",
                    4: "https://app.online-cmcc.cn/rn-module/prod/common/popup-call-skin.png",
                  }
                : {
                    1: "https://app.online-cmcc.cn/rn-module/prod/common/popup-balance.png",
                    2: "https://app.online-cmcc.cn/rn-module/prod/common/popup-consume.png",
                    3: "https://app.online-cmcc.cn/rn-module/prod/common/popup-traffic.png",
                    4: "https://app.online-cmcc.cn/rn-module/prod/common/popup-call.png",
                  };
            },
            styleTypeName() {
              const e = {
                1: "话费不足类",
                2: "消费过高类",
                3: "流量不足类",
                4: "通话不足类",
              };
              return e[this.realTimePopupData.styleType] || "";
            },
            traceParams() {
              return {
                WT_area_type_1: "弹窗",
                WT_area_type_2: "实时弹窗",
                area_id: `${this.realTimePopupData.areaId}_${this.realTimePopupData.moduleId}`,
                WT_area_name: this.styleTypeName,
                WT_event: this.realTimePopupData.channelId,
                XY_gd_source: this.realTimePopupData.source,
                WT_markId:
                  ("qqd" === this.realTimePopupData.source
                    ? ""
                    : this.realTimePopupData.advBusiType + "_") +
                  this.realTimePopupData.markId,
              };
            },
          },
          created() {
            (0, f.Z)("imp", {
              ...this.traceParams,
              WT_et: "imp",
              WT_envName: "弹出",
            }),
              (0, f.Z)("imp", {
                ...this.traceParams,
                WT_et: "imp",
                XY_env_type: "button",
                WT_envName: this.realTimePopupData.leftBtn,
                WT_next_url: this.realTimePopupData.vLinkUrl1 || "",
              }),
              (0, f.Z)("imp", {
                ...this.traceParams,
                WT_et: "imp",
                XY_env_type: "button",
                WT_envName: this.realTimePopupData.rightBtn,
                WT_next_url: this.realTimePopupData.linkUrl || "",
              });
          },
          mounted() {},
          methods: {
            ...(0, r.mapMutations)("realTimePopup", ["setShowRealTimePopup"]),
            leftBtnClick() {
              let e = this.realTimePopupData.vLinkUrl1;
              (0, f.Z)("clk", {
                ...this.traceParams,
                WT_et: "clk",
                XY_env_type: "button",
                WT_envName: this.realTimePopupData.leftBtn,
                WT_next_url: e || "",
              }),
                e && h.Z.go({ url: e }),
                this.setShowRealTimePopup(!1);
            },
            rightBtnClick() {
              let e = this.realTimePopupData.linkUrl;
              (0, f.Z)("clk", {
                ...this.traceParams,
                WT_et: "clk",
                XY_env_type: "button",
                WT_envName: this.realTimePopupData.rightBtn,
                WT_next_url: e || "",
              }),
                e && h.Z.go({ url: e }),
                this.setShowRealTimePopup(!1);
            },
            closePopup() {
              this.setShowRealTimePopup(!1),
                (0, f.Z)("clk", {
                  ...this.traceParams,
                  WT_et: "clk",
                  XY_env_type: "button",
                  WT_envName: "关闭",
                });
            },
          },
        },
        v = g,
        A = (0, d.Z)(v, n, o, !1, null, "616857da", null),
        y = A.exports;
    },
    48032: function (e, t, a) {
      "use strict";
      a.d(t, {
        GE: function () {
          return m;
        },
        L$: function () {
          return l;
        },
        Q6: function () {
          return u;
        },
        SK: function () {
          return c;
        },
        TE: function () {
          return s;
        },
        Te: function () {
          return p;
        },
        em: function () {
          return r;
        },
        i6: function () {
          return i;
        },
        s1: function () {
          return d;
        },
      });
      var n = a(16456),
        o = a(83587);
      function i(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/billPayment/qryFriendList",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
      function r(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/sms/getSmsCode",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
      function l(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/billPayment/bindRelaDel",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
      function s(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/billPayment/addCheck",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
      function c(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/billPayment/addFriend",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
      function u(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/billPayment/sendSms",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
      function d(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/billPayment/placeOrder",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
      function m(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/billPayment/qryBillPaymentRecord",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
      function p(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/billPayment/qryFriendHistoryBill",
          data: e,
          contentType: !0,
          noLoading: !0,
          urlToken: !0,
        });
      }
    },
    2442: function (e, t, a) {
      "use strict";
      a.d(t, {
        S: function () {
          return r;
        },
        a: function () {
          return i;
        },
      });
      var n = a(16456),
        o = a(83587);
      function i(e) {
        return (0, n.Z)({
          url: o.ni + "inline/app/iservice/direct/unsubscribe/reason",
          contentType: !0,
          data: e,
          urlToken: !0,
        });
      }
      function r(e) {
        return (0, n.Z)({
          url:
            o.ni +
            "inline/app/iservice/direct/unsubscribe/unSubscribeRiskControl",
          contentType: !0,
          data: e,
          urlToken: !0,
        });
      }
    },
    49034: function (e, t, a) {
      "use strict";
      a.d(t, {
        L: function () {
          return f;
        },
        eP: function () {
          return h;
        },
        rG: function () {
          return g;
        },
      });
      var n = a(16456),
        o = a(83587),
        i = a(15222),
        r = a(6648);
      const l = o.GP + "BN/tinyTokenLogin/YDRZgetlogin",
        s = o.GP + "BN/newTinyTokenLogin/YDRZgetlogin",
        c = o.GP + "BN/tinyGetToken/YDRZgetBigNetToken",
        u = o.GP + "BN/newTinyGetToken/YDRZgetBigNetToken";
      let d = "1" === (0, i.eY)("appoptcl"),
        m = "1" === (0, i.ej)("appoptcl"),
        p = navigator.userAgent.toLowerCase().indexOf("leadeon") > -1;
      const h = (e, t, a = {}) => {
          let o = l;
          return (
            (d || m) && (o = s),
            (0, n.Z)({ url: o, data: { ...e, reqBody: t }, ...a })
          );
        },
        f = async (e) => {
          try {
            if (p) {
              let t = await (0, r.Bh)({ sourceId: e.targetsourceid });
              return t.token;
            }
            {
              let t = c;
              (d || m) && (t = u);
              let a = await (0, n.Z)({ url: t, data: e });
              return "000000" === a.retCode ? a.rspBody && a.rspBody.token : "";
            }
          } catch (t) {
            return console.log("getBigNetLoginToken error", t), "";
          }
        },
        g = () => {
          d && !p && (0, i.d8)("appoptcl", "1", 30, "/");
        };
    },
    25672: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return o;
        },
      });
      var n = a(72671);
      function o(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getAccoutInfo",
          ...t,
        })(e);
      }
    },
    89221: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return o;
        },
      });
      var n = a(72671);
      function o(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getAuthorizeSyn",
          ...t,
        })(e);
      }
    },
    59305: function (e, t, a) {
      "use strict";
      a.d(t, {
        z: function () {
          return o;
        },
      });
      var n = a(72671);
      function o(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getRealFee",
          ...t,
        })(e);
      }
    },
    14034: function (e, t, a) {
      "use strict";
      a.d(t, {
        A9: function () {
          return f;
        },
        AJ: function () {
          return p;
        },
        At: function () {
          return A;
        },
        DI: function () {
          return h;
        },
        Eu: function () {
          return y;
        },
        H8: function () {
          return T;
        },
        O_: function () {
          return I;
        },
        Rw: function () {
          return m;
        },
        SQ: function () {
          return v;
        },
        T: function () {
          return _;
        },
        Th: function () {
          return d;
        },
        Uf: function () {
          return u;
        },
        Z3: function () {
          return x;
        },
        Zo: function () {
          return L;
        },
        dg: function () {
          return D;
        },
        fv: function () {
          return C;
        },
        g_: function () {
          return l;
        },
        hV: function () {
          return b;
        },
        iB: function () {
          return B;
        },
        lW: function () {
          return w;
        },
        mn: function () {
          return k;
        },
        s: function () {
          return N;
        },
        s1: function () {
          return E;
        },
        sH: function () {
          return P;
        },
        tv: function () {
          return c;
        },
        u0: function () {
          return g;
        },
        wc: function () {
          return S;
        },
        x4: function () {
          return s;
        },
      });
      var n = a(16456),
        o = a(83587),
        i = a(72856),
        r = a(6648);
      const l = (e, t) =>
          (0, n.Z)({
            url: o.OC + "LH/uamrandcodeH5/sendMsgLoginH5",
            data: { ...e, reqBody: t },
          }),
        s = (e, t) =>
          (0, n.Z)({
            url: o.OC + "LH/uamrandcodeloginH5/loginH5",
            data: { ...e, reqBody: t },
          }),
        c = (e, t) =>
          (0, n.Z)({
            url: o.OC + "DA/local/getLocal",
            data: { ...e, reqBody: t },
          }),
        u = (e) =>
          i["default"].state.login.isTouch
            ? (0, r.Bh)({ sourceId: e.targetsourceid })
            : (0, n.Z)({
                url: o.GP + "BN/tinyGetToken/YDRZgetBigNetToken",
                data: e,
              });
      function d(e) {
        return (0, n.Z)({
          contentType: !0,
          url: o.OC + "DA/baseServiceFunction/getAdverList",
          data: e,
        });
      }
      const m = (e) =>
          (0, n.Z)({
            contentType: !0,
            url: o.OC + "SHS/reportPage/sendSMSCode",
            data: e,
          }),
        p = (e) =>
          (0, n.Z)({
            contentType: !0,
            url: o.OC + "SHS/reportPage/checkSMSCode",
            data: e,
          });
      function h(e) {
        return (0, n.Z)({
          contentType: !0,
          url: o.OC + "DH/serviceFunction/getPullingWay",
          data: e,
        });
      }
      function f(e) {
        return (0, n.Z)({
          url: o.OC + "SA/advertisingClickNew/printLog",
          setReqBody(t) {
            let {
                osType: a,
                phoneNumber: n,
                version: o,
                province: i,
                city: r,
              } = t,
              l = [],
              s = Object.assign(
                {},
                {
                  cellNum: n,
                  clientVer: o,
                  sysType: "ios" === a ? "2" : "android" === a ? "1" : "",
                  provinceCode: i,
                  cityCode: r,
                },
                e
              );
            return l.push(s), { adverList: l };
          },
        });
      }
      function g(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/recommend/mindStrategy",
          data: e,
          timeOut: 6e4,
          noLoading: !0,
          contentType: !0,
        });
      }
      function v(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/customer/configQuery",
          data: e,
          contentType: !0,
        });
      }
      function A(e) {
        return (0, n.Z)({
          contentType: !0,
          url:
            o.OC +
            "SHS/bill/autoRedepositSwitch?" +
            i["default"].state.userInfo.token,
          data: e,
          timeOut: 6e4,
        });
      }
      function y(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/cloudDisk/userStatus",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function T(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/cloudDisk/verifyCodeAcquire",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function S(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/cloudDisk/VerificationCodeVerify",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function I(e) {
        return (0, n.Z)({
          url: o.ni + "inline/app/iservice/direct/contactInfo/floorRuleInfo",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function b(e) {
        return (0, n.Z)({
          url: o.ni + "inline/app/iservice/direct/rights/queryLuckyBagTimes",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function C(e) {
        return (0, n.Z)({
          url:
            o.ni +
            "inline/app/iservice/direct/contract/customerContractInfoQry",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function w(e) {
        return (0, n.Z)({
          url: o.ni + "inline/app/iservice/sms/busi/record/send",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function _(e) {
        return (0, n.Z)({
          url: o.ni + "inline/app/iservice/sms/busi/record/verify",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function k(e) {
        return (0, n.Z)({
          contentType: !0,
          url: o.OC + "DN/forgetPassword/getInterlinkage",
          data: e,
        });
      }
      function N(e) {
        return (0, n.Z)({
          url: o.OC + "DH/familyZone/getPersonalBroadbandQuery",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function P(e) {
        return (0, n.Z)({
          url: o.ni + "inline/app/openapi/monitor/rnReport",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function B(e) {
        return (0, n.Z)({
          url: o.P3 + "cache_server/api/cache/encrypt/reportV2",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function L(e) {
        return (0, n.Z)({
          url:
            o.ni +
            "inline/app/iservice/direct/livingCheck/queryLivingEncodeParams",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function D(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/bj/getAccountCancellationPaymentInfo",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function E(e) {
        return (0, n.Z)({
          url: o.OC + "SHS/cancelUserRecharge/placeOrder",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
      function x(e) {
        return (0, n.Z)({
          url: o.ni + "inline/app/iservice/direct/intranetcsf/waterFall",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      }
    },
    92239: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return i;
        },
      });
      var n = a(16456),
        o = a(83587);
      function i(e) {
        return (0, n.Z)({
          contentType: !0,
          url: o.OC + "UN/message/pushMessageBatch",
          data: e,
        });
      }
    },
    67817: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return r;
        },
      });
      a(26699);
      var n = a(16456),
        o = a(83587),
        i = a(72856);
      function r(e) {
        let t = ["main"];
        if (
          i["default"].state.login.isTouch &&
          t.includes(i["default"].getters.pageGroup)
        )
          return (0, n.Z)({
            url: o.OC + "UN/message/recordUserMessage",
            data: e,
            contentType: !0,
          });
      }
    },
    21722: function (e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, {
          billCustInfoOrder: function () {
            return g;
          },
          contractTd: function () {
            return w;
          },
          contractTdAuth: function () {
            return C;
          },
          getAccountInfo: function () {
            return y;
          },
          getAuthorizeStatus: function () {
            return T;
          },
          getAuthorizeSyn: function () {
            return S;
          },
          getBandNewBills: function () {
            return I;
          },
          getBillCustInfoQry: function () {
            return f;
          },
          getDayFlowInfo: function () {
            return s;
          },
          getDefaultInfoQry: function () {
            return _;
          },
          getFlowInfoQry: function () {
            return c;
          },
          getHisComboMealResource: function () {
            return d;
          },
          getNewBills: function () {
            return v;
          },
          getNewDetail: function () {
            return h;
          },
          getNewPlanRemainQry: function () {
            return m;
          },
          getPayFeesHistory: function () {
            return k;
          },
          getPersonalInfo: function () {
            return p;
          },
          getQueryBusiness: function () {
            return N;
          },
          getRealFee: function () {
            return A;
          },
          getScoreQuery: function () {
            return b;
          },
          getSmsCode: function () {
            return E;
          },
          getUnifyCancel: function () {
            return B;
          },
          getUserInformation: function () {
            return r;
          },
          getUserPlanQryNew: function () {
            return u;
          },
          getUserShareInfo: function () {
            return l;
          },
          qryBindedBusiness: function () {
            return L;
          },
          qryOrderedBusiness: function () {
            return P;
          },
          updatePlan: function () {
            return D;
          },
        });
      var n = a(72671),
        o = a(15222),
        i = a(89629);
      function r(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getUserInformation",
          ...t,
        })(e);
      }
      function l(e = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getUserShareInfo",
          ...e,
        })();
      }
      function s(e = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getDayFlowInfo",
          ...e,
        })();
      }
      function c(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getFlowInfoQryOld",
          ...t,
        })(e);
      }
      function u(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getUserPlanQryNew",
          ...t,
        })(e);
      }
      function d(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getHisComboMealResource",
          ...t,
        })(e);
      }
      function m(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getNewPlanRemainQry",
          ...t,
        })(e);
      }
      function p(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getPersonalInfo",
          ...t,
        })(e);
      }
      function h(e, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getNewDetail",
          ...t,
        })(e);
      }
      function f(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getBillCustInfoQry",
          ...t,
        })(e);
      }
      function g(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "billCustInfoOrder",
          ...t,
        })(e);
      }
      function v(e = {}, t = {}) {
        return (
          console.log("app api getNewBills", "params:", e, t),
          (0, n.ZP)({
            moduleName: "CMCCService_module",
            functionName: "getNewBills",
            ...t,
          })(e)
        );
      }
      function A(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getRealFee",
          ...t,
        })(e);
      }
      function y(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getAccoutInfo",
          ...t,
        })(e);
      }
      function T(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getAuthorizeStatus",
          ...t,
        })(e);
      }
      function S(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getAuthorizeSyn",
          ...t,
        })(e);
      }
      function I(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getBandNewBills",
          ...t,
        })(e);
      }
      function b(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getScoreQuery",
          ...t,
        })(e);
      }
      function C(e = {}, t = {}) {
        let { reqBody: a, version: i } = e;
        return i && (0, o.yC)("11.9.6", i) >= 0
          ? (0, n.ZP)({
              moduleName: "CMCCService_module",
              functionName: "contractTdAuth",
              ...t,
            })(a)
          : (0, n.f1)({
              moduleName: "CMCCService_module",
              functionName: "contractTdAuth",
              ...t,
            })(a);
      }
      function w(e = {}, t = {}) {
        let { reqBody: a, version: i } = e;
        return i && (0, o.yC)("11.9.6", i) >= 0
          ? (0, n.ZP)({
              moduleName: "CMCCService_module",
              functionName: "contractTd",
              ...t,
            })(a)
          : (0, n.f1)({
              moduleName: "CMCCService_module",
              functionName: "contractTd",
              ...t,
            })(a);
      }
      function _(e = {}, t = {}) {
        let { reqBody: a, version: i } = e;
        return i && (0, o.yC)("11.9.6", i) >= 0
          ? (0, n.ZP)({
              moduleName: "CMCCService_module",
              functionName: "getDefaultInfoQry",
              ...t,
            })(a)
          : (0, n.f1)({
              moduleName: "CMCCService_module",
              functionName: "getDefaultInfoQry",
              ...t,
            })(a);
      }
      function k(e) {
        return (0, i.ZP)(window.BasicService_H5module.getPayFeesHistory)(e, {
          contentType: "application/json;charset=UTF-8",
        });
      }
      function N(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getQueryBusiness",
          ...t,
        })(e);
      }
      function P(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "qryOrderedBusiness",
          contentType: "application/json;charset=UTF-8",
          ...t,
        })(e);
      }
      function B(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getUnifyCancel",
          ...t,
        })(e);
      }
      function L(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "qryBindedBusiness",
          contentType: "application/json;charset=UTF-8",
          ...t,
        })(e);
      }
      function D(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "updatePlan",
          ...t,
        })(e);
      }
      function E(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getSmsCode",
          ...t,
        })(e);
      }
    },
    30660: function (e, t, a) {
      "use strict";
      var n = a(21722);
      const o = n;
      t.Z = {
        getUserInformation: o.getUserInformation,
        getUserShareInfo: o.getUserShareInfo,
        getDayFlowInfo: o.getDayFlowInfo,
        getFlowInfoQry: o.getFlowInfoQry,
        getUserPlanQryNew: o.getUserPlanQryNew,
        getHisComboMealResource: o.getHisComboMealResource,
        getNewPlanRemainQry: o.getNewPlanRemainQry,
        getPersonalInfo: o.getPersonalInfo,
        getScoreQuery: o.getScoreQuery,
        getBillCustInfoQry: o.getBillCustInfoQry,
        billCustInfoOrder: o.billCustInfoOrder,
        getNewBills: o.getNewBills,
        getRealFee: o.getRealFee,
        getAccountInfo: o.getAccountInfo,
        getAuthorizeStatus: o.getAuthorizeStatus,
        getAuthorizeSyn: o.getAuthorizeSyn,
        getBandNewBills: o.getBandNewBills,
        getNewDetail: o.getNewDetail,
        contractTdAuth: o.contractTdAuth,
        getDefaultInfoQry: o.getDefaultInfoQry,
        contractTd: o.contractTd,
        getPayFeesHistory: o.getPayFeesHistory,
        getQueryBusiness: o.getQueryBusiness,
        qryOrderedBusiness: o.qryOrderedBusiness,
        getUnifyCancel: o.getUnifyCancel,
        qryBindedBusiness: o.qryBindedBusiness,
        updatePlan: o.updatePlan,
        getSmsCode: o.getSmsCode,
      };
    },
    23899: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return C;
        },
      });
      a(2490), a(59849), a(34514);
      var n = a(10311),
        o = a.n(n),
        i = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: e.value,
                  expression: "value",
                },
              ],
              staticClass: "cmcc-toast-loading",
            },
            [
              t("img", {
                staticClass: "cmcc-loading-border",
                attrs: { src: a(93374), alt: "" },
              }),
            ]
          );
        },
        r = [];
      let l = 0;
      function s(e) {
        e
          ? (l ||
              (document.getElementsByTagName("body")[0].className =
                "cmcc-toast-loading--unclickable"),
            l++)
          : (l--,
            l || (document.getElementsByTagName("body")[0].className = ""));
      }
      var c = {
          props: { forbidClick: { type: Boolean, default: !0 } },
          data() {
            return { clickable: !1, value: !0 };
          },
          mounted() {
            this.toggleClickable();
          },
          destroyed() {
            this.toggleClickable();
          },
          watch: { value: "toggleClickable", forbidClick: "toggleClickable" },
          methods: {
            toggleClickable() {
              const e = this.value && this.forbidClick;
              this.clickable !== e && ((this.clickable = e), s(e));
            },
          },
        },
        u = c,
        d = a(1001),
        m = (0, d.Z)(u, i, r, !1, null, "6bef8c7f", null),
        p = m.exports;
      const h = {
        value: !0,
        duration: 0,
        forbidClick: !0,
        getContainer: "body",
      };
      let f = {},
        g = [],
        v = { ...h };
      function A(e) {
        return null !== e && "object" === typeof e;
      }
      function y(e) {
        return A(e) ? e : { message: e };
      }
      function T(e) {
        return document.body.contains(e);
      }
      function S() {
        if (((g = g.filter((e) => !e.$el.parentNode || T(e.$el))), !g.length)) {
          const e = new (o().extend(p))();
          document.body.appendChild(e.$mount().$el), g.push(e);
        }
        return g[g.length - 1];
      }
      function I(e) {
        return { ...e, duration: void 0 };
      }
      function b(e = {}) {
        const t = S();
        return (
          (e = y(e)),
          (e = { ...v, ...f[e.type || v.type], ...e }),
          (e.clear = () => {
            t.value = !1;
          }),
          Object.assign(t, I(e)),
          clearTimeout(t.timer),
          e.duration > 0 &&
            (t.timer = setTimeout(() => {
              t.clear();
            }, e.duration)),
          t
        );
      }
      (b.show = () => {
        b();
      }),
        (b.clear = (e) => {
          g.length &&
            (e
              ? (g.forEach((e) => {
                  e.clear();
                }),
                (g = []))
              : g[0].clear());
        });
      var C = b;
    },
    47018: function (e, t, a) {
      "use strict";
      var n = a(40588);
      let o = n;
      t.Z = o.default;
    },
    92520: function (e, t, a) {
      "use strict";
      var n = a(41753);
      let o = n;
      t.Z = o.default;
    },
    73044: function (e, t, a) {
      "use strict";
      var n = a(82360);
      let o = n;
      t.Z = o.default;
    },
    87630: function (e, t, a) {
      "use strict";
      var n = a(12206);
      let o = n;
      t.Z = o.default;
    },
    88922: function (e, t, a) {
      "use strict";
      a.d(t, {
        CO: function () {
          return p;
        },
        H9: function () {
          return h;
        },
        c5: function () {
          return d;
        },
        iX: function () {
          return u;
        },
        kI: function () {
          return f;
        },
      });
      a(26699), a(2490), a(9924), a(72608);
      var n = a(15222),
        o = a(72856),
        i = a(14034),
        r = a(75150),
        l = a(76507),
        s = a(26090);
      async function c() {
        let e = (0, n.eY)("psiesdkTesth")
          ? "https://testh.app.coc.10086.cn/ngpsie/psiesdk/1.3.0/js/index.js"
          : "https://res.app.coc.10086.cn/ngpsie/psiesdk/1.3.0/js/index.js?cmccservice=1";
        await (0, r.Z)("loadPsiesdk", () => (0, n.Vp)(e));
        let t = {};
        try {
          t = await new Promise((e, t) => {
            new YdldInstall({
              paramList: [],
              onReady: (t) => {
                console.log("初始化psiesdk------", t), e(t);
              },
              onError: (e) => {
                console.log("初始化/更新psiesdk失败------", e), t(e);
              },
              isWxOpenLaunchApp: !0,
              phoneNum: "",
            });
          });
        } catch (a) {}
        return t;
      }
      async function u({ pageInfo: e = "" }) {
        let t = {},
          a = {};
        try {
          if (["main"].includes(o["default"].getters.pageGroup)) {
            var s;
            let u = (0, n.eY)("channelId") || "0",
              {
                loginProvince: d,
                loginCity: m,
                phoneNumber: p,
              } = o["default"].state.userInfo,
              h = await (0, r.Z)("getPullingWay", () =>
                (0, l.EM)(() =>
                  (0, i.DI)({
                    provinceCode: d,
                    cityCode: m,
                    cellNum: p,
                    pageInfo: e,
                    channleId: u,
                  })
                )
              );
            "000000" === (null === h || void 0 === h ? void 0 : h.retCode) &&
              null !== h &&
              void 0 !== h &&
              null !== (s = h.rspBody) &&
              void 0 !== s &&
              s.pullingType &&
              ((t = h.rspBody), (a = await c()));
          } else a = await c();
        } catch (u) {
          console.log("initPullApp--error", u);
        }
        return { ...a, pullingWayData: t };
      }
      function d() {
        let e = navigator.userAgent.toLowerCase();
        return !(
          e.includes("alipay") ||
          (e.includes("micromessenger") && e.includes("miniprogram"))
        );
      }
      function m(e) {
        return e.split("&").reduce((e, t) => {
          const [a, n] = t.split("=");
          return (e[a] = n), e;
        }, {});
      }
      function p(e, t) {
        if (!e && !t) return "";
        if (!e) return t;
        if (!t) return e;
        const a = m(e),
          n = m(t),
          o = { ...n, ...a };
        return Object.entries(o)
          .map(([e, t]) => `${e}=${t}`)
          .join("&");
      }
      function h(e, t) {
        if (!e) return "";
        if (!s.IK[t]) return e;
        let a = m(e);
        return (
          "myPackage" === t &&
            ((a.currentTab = s.IK["myPackage"][a.pageName] || ""),
            delete a.pageName),
          Object.entries(a)
            .map(([e, t]) => `${e}=${t}`)
            .join("&")
        );
      }
      function f(e, { key: t, value: a }) {
        try {
          const n = m(e);
          n[t] = a;
          const o = [];
          for (const [e, t] of Object.entries(n)) o.push(`${e}=${t}`);
          return o.join("&");
        } catch (n) {
          return "";
        }
      }
    },
    60886: function (e, t, a) {
      "use strict";
      const n = {
        install: function (e) {
          e.directive("speech", {
            inserted(e, t, a, n) {
              e && "" !== t.value && e.setAttribute("speech-txt", t.value);
            },
            update(e, t) {
              e && "" !== t.value
                ? e.setAttribute("speech-txt", t.value)
                : (e &&
                    e.classList.contains("voiceBg") &&
                    e.classList.remove("voiceBg"),
                  e &&
                    e.hasAttribute("speech-txt") &&
                    e.removeAttribute("speech-txt"));
            },
            unbind(e, t) {
              e && "" !== t.value && e.removeAttribute("speech-txt");
            },
          });
        },
      };
      t.Z = /^(2923|4153|7458|7938)$/.test(a.j) ? n : null;
    },
    24521: function (e, t, a) {
      "use strict";
      a.d(t, {
        AY: function () {
          return d;
        },
        aZ: function () {
          return m;
        },
        nY: function () {
          return u;
        },
      });
      a(26699), a(2490), a(59461), a(9924);
      var n = a(72856),
        o = a(75150),
        i = a(26090),
        r = a(50813),
        l = a.n(r),
        s = a(23899),
        c = a(15222);
      function u(e) {
        ["main", "lite"].includes(n["default"].getters.pageGroup) ||
          ["businessHandlingRecords"].includes(n["default"].getters.pageName) ||
          n["default"].commit("common/SET_OPEN_APP_OPTIONS", e);
      }
      function d() {
        let e = `https://res.app.coc.10086.cn/ngpsie/psiesdk/1.3.0/js/index.js?t=${Date.now()}`;
        return (0, o.Z)("initPullAppSdk", async () => {
          await (0, c.Vp)(e);
          let t = l()(n["default"].state.common.openAppOptions);
          console.log("openAppOptions----", t);
          let a = t.map((e) => {
              let { pageId: t, channelId: a, ...o } = e,
                r = e.eleId.split("_")[0];
              t || (t = i.Z9[n["default"].getters.pageName] || ""),
                a ||
                  (a = i.x7[n["default"].getters.pageName]
                    ? i.x7[n["default"].getters.pageName][r]
                    : "");
              let l = {
                systemId: "1001",
                targetUrl: "",
                functionCode: "",
                uninstallUrl: "",
                timeout: "2000",
                extra: "",
                data: {
                  pageId: t,
                  channelId: a,
                  sellerId: (0, c.eY)("sellerId") || "",
                  extendId: "",
                  phone: "",
                  LDStaffNumber: "",
                  LDStaffPhone: "",
                  LDUserPhone: "",
                  sid: "",
                },
              };
              return Object.assign(l, o);
            }),
            o = {
              paramList: a,
              onReady: (e) => {
                console.log("初始化psiesdk------", e);
              },
              isWxOpenLaunchApp: !1,
            },
            r = new YdldInstall(o);
          return (
            console.log("Object.assign------------options", o),
            (window.pullingEndSdkObj = { pullingEndSdk: r, options: o }),
            window.pullingEndSdkObj
          );
        });
      }
      async function m(e) {
        try {
          s.Z.show();
          let t = await d();
          if (
            (console.log("initPullAppSdk-------", t),
            s.Z.clear(),
            t && t.pullingEndSdk)
          ) {
            let { pullingEndSdk: a, options: n = {} } = t,
              o = e.includes("location1")
                ? n.paramList.find((e) => e.eleId.includes("location1"))
                : n.paramList.find((t) => t.eleId === e);
            return (
              console.log("pullAppClick-----------option", o),
              a.wakeupOrInstall(o),
              !0
            );
          }
          return !1;
        } catch (t) {
          return console.log("try------catch", t), s.Z.clear(), !1;
        }
      }
    },
    2780: function (e, t, a) {
      "use strict";
      a.d(t, {
        Ds: function () {
          return u;
        },
        dr: function () {
          return c;
        },
        m9: function () {
          return d;
        },
      });
      a(26699), a(2490), a(59849), a(34514), a(9924), a(41874);
      var n = a(16456),
        o = a(83587);
      function i(e) {
        return (0, n.Z)({
          contentType: !0,
          url: o.OC + "DH/baseServiceFunction/getSectionList",
          data: e,
        });
      }
      function r(e) {
        if (e.moduleList && e.moduleList.length) {
          let t = [];
          for (const a of e.moduleList)
            a.adverList && a.adverList.length && (t = [...t, ...a.adverList]);
          return t;
        }
        return [];
      }
      function l(e) {
        let t = [
          "market-noticeText-1-001",
          "market-noticeText-2-001",
          "market-noticeIcon-1-001",
          "market-noticeIcon-2-001",
          "market-banner-1-001",
          "market-banner-2-001",
          "market-banner-3-001",
          "market-button-1-001",
          "market-button-2-001",
          "market-card-1-001",
          "market-card-2-001",
          "market-card-3-001",
          "market-card-4-001",
          "market_reminder_001",
          "market-banner-4-001",
          "market-banner-5-001",
        ];
        return t.includes(e) ? 2 : 1;
      }
      function s(e) {
        for (let t = 0; t < e.length; t++) {
          const a = e[t];
          if (((a.Special = !1), t >= 1)) {
            const n = e[t - 1];
            1 == n.templateType && 2 == a.templateType && (a.Special = !0);
          }
        }
        return e;
      }
      function c({
        fixedId: e,
        topId: t,
        floatId: a,
        bottomId: n,
        areaList: o,
        tabID: i,
      }) {
        let c = {},
          u = null,
          d = null,
          m = null,
          p = [],
          h = [],
          f = [];
        return (
          o.forEach((g, v) => {
            if (g.areaId == t) {
              let e = r(g);
              if (e.length) {
                let t = {};
                for (const a of e) t[a.channelId] = a;
                u = t;
              }
            } else if (g.areaId == a) {
              let e = r(g);
              e.length && ((e[0].areaId = a), (d = e[0]));
            } else if (g.areaId == n)
              g.moduleList && g.moduleList.length && (m = g);
            else if (
              g.areaId == i &&
              g.moduleList &&
              g.moduleList.length &&
              null != g.moduleList[0].tabList
            )
              g.moduleList[0].tabList.forEach((e) => {
                (e.moduleListUp = {
                  moduleList: [],
                  topTemplateType: 0,
                  bottomTemplateType: 0,
                  areaId: e.tabMarkId,
                }),
                  (e.moduleListDown = {
                    moduleList: [],
                    topTemplateType: 0,
                    bottomTemplateType: 0,
                    areaId: e.tabMarkId,
                  }),
                  (e.flexibleOne = {});
                let t = 99,
                  a = e.tabModuleList.filter((e) =>
                    "market_information_001" === e.tabModuleId
                      ? e
                      : 0 !== e.tabModuleAdVerList.length
                  );
                for (let n = 0; n < a.length; n++) {
                  const o = a[n];
                  let i = {};
                  if (
                    ((i.adverList = o.tabModuleAdVerList),
                    (i.moduleId = o.tabModuleId),
                    (i.ruleCode = o.ruleCode),
                    (i.templateType = l(o.tabModuleId)),
                    n < t && "market_information_001" != o.tabModuleId)
                  )
                    e.moduleListUp.moduleList.push(i);
                  else if ("market_information_001" === o.tabModuleId) {
                    t = n;
                    for (const t of o.tabModuleAdVerList)
                      e.flexibleOne[t.channelId] = t;
                  } else e.moduleListDown.moduleList.push(i);
                }
                e.moduleListUp.moduleList.length &&
                  ((e.moduleListUp.moduleList = s(e.moduleListUp.moduleList)),
                  (e.moduleListUp.topTemplateType =
                    e.moduleListUp.moduleList[0].templateType),
                  (e.moduleListUp.bottomTemplateType =
                    e.moduleListUp.moduleList[
                      e.moduleListUp.moduleList.length - 1
                    ].templateType),
                  (e.moduleListUp.areaName =
                    null === g || void 0 === g ? void 0 : g.areaName)),
                  e.moduleListDown.moduleList.length &&
                    ((e.moduleListDown.moduleList = s(
                      e.moduleListDown.moduleList
                    )),
                    (e.moduleListDown.topTemplateType =
                      e.moduleListDown.moduleList[0].templateType),
                    (e.moduleListDown.bottomTemplateType =
                      e.moduleListDown.moduleList[
                        e.moduleListDown.moduleList.length - 1
                      ].templateType),
                    (e.moduleListDown.areaName =
                      null === g || void 0 === g ? void 0 : g.areaName));
              }),
                (p = g.moduleList[0].tabList),
                h.push([...f]),
                (f = []);
            else if (g.areaId == i) h.push([...f]), (f = []);
            else {
              let t = !1;
              for (const a of e)
                if (a == g.areaId) {
                  let e = r(g),
                    n = {};
                  if (e.length) for (const t of e) n[t.channelId] = t;
                  (c[a] = n), (t = !0);
                }
              t ? (h.push([...f]), (f = [])) : f.push(g);
            }
            v == o.length - 1 && h.push([...f]);
          }),
          { fixed: c, top: u, float: d, bottom: m, flex: h, tab: p }
        );
      }
      function u(e, t) {
        return e ? (t ? e.substring(0, t) : e) : "";
      }
      async function d(e, t, a) {
        if (["marginQuery", "phoneBills"].includes(t) && e.length > 0)
          for (const n of e)
            if (n && n.length)
              for (const e of n)
                if (e.moduleList && e.moduleList.length)
                  for (const n of e.moduleList)
                    if ("market-slice-001" === n.moduleId) {
                      let e =
                          JSON.parse(
                            localStorage.getItem(`markId-${t}-${a}`)
                          ) || [],
                        o = new Date().getTime();
                      e = e.filter((e) => e.expireDate > o);
                      let r = e.map((e) => e.markId),
                        l = await i({ ruleCode: n.ruleCode, showId: r });
                      if (
                        "000000" === l.retCode &&
                        l.rspBody &&
                        l.rspBody.adverList &&
                        l.rspBody.adverList.length > 0
                      ) {
                        n.adverList = l.rspBody.adverList;
                        let o = l.rspBody.adverList[0].markId,
                          i = e.some((e) => e.markId === o);
                        i && localStorage.removeItem(`markId-${t}-${a}`);
                      }
                      break;
                    }
        return e;
      }
    },
    26090: function (e, t, a) {
      "use strict";
      a.d(t, {
        Eg: function () {
          return g;
        },
        IK: function () {
          return c;
        },
        Nj: function () {
          return p;
        },
        Pc: function () {
          return u;
        },
        SL: function () {
          return i;
        },
        Xj: function () {
          return s;
        },
        Z: function () {
          return v;
        },
        Z9: function () {
          return r;
        },
        dK: function () {
          return o;
        },
        ez: function () {
          return d;
        },
        i$: function () {
          return m;
        },
        lp: function () {
          return f;
        },
        m7: function () {
          return A;
        },
        oO: function () {
          return h;
        },
        x7: function () {
          return l;
        },
      });
      var n = a(15222);
      const o = {
          marginQuery: "1",
          phoneBills: "2",
          detailQuery: "3",
          businessQuery: "4",
          balanceQuery: "5",
          myPackage: "6",
        },
        i = {
          extra: ["smartSms", "serviceCommitments", "serviceCommitmentsCare"],
          main: [
            "marginQuery",
            "phoneBills",
            "detailQuery",
            "businessQuery",
            "balanceQuery",
            "myPackage",
          ],
        },
        r = {
          marginQuery: "99992305291447173",
          phoneBills: "99992208190928244",
          get businessQuery() {
            const e = (0, n.eY)("acct_view");
            return "vista" === e
              ? "99992308311206085"
              : "horizon" === e
              ? "99992308311302586"
              : "99992405161505433";
          },
          detailQuery: "99992208191441336",
          myPackage: "99992306131601192",
          balanceQuery: "99992405101630445",
        },
        l = {
          marginQuery: {
            float1: "P00000074595",
            float2: "P00000074600",
            float3: "P00000074601",
            location1: "P00000074602",
            location2: "P00000074603",
            location3: "P00000074604",
          },
          phoneBills: {
            float1: "P00000074605",
            float2: "P00000074607",
            float3: "P00000074609",
            location1: "P00000074610",
            location2: "P00000074618",
            location3: "P00000074619",
          },
          get businessQuery() {
            const e = (0, n.eY)("acct_view");
            return "vista" === e
              ? {
                  float1: "P00000074622",
                  float2: "P00000074623",
                  float3: "P00000074624",
                  location1: "P00000074625",
                  location2: "P00000074626",
                  location3: "P00000074628",
                  location4: "P00000095533",
                }
              : "horizon" === e
              ? {
                  float1: "P00000074629",
                  float2: "P00000074630",
                  float3: "P00000074631",
                  location1: "P00000074632",
                  location2: "P00000074633",
                  location3: "P00000074634",
                  location4: "P00000095532",
                }
              : {
                  float1: "P00000096009",
                  float2: "P00000096016",
                  float3: "P00000096019",
                  location1: "P00000096020",
                  location2: "P00000096021",
                  location3: "P00000096023",
                  location4: "P00000096025",
                };
          },
          detailQuery: {
            float1: "P00000074641",
            float2: "P00000074642",
            float3: "P00000074643",
            location1: "P00000074644",
            location2: "P00000074645",
            location3: "P00000074646",
          },
          myPackage: {
            float1: "P00000074647",
            float2: "P00000074648",
            float3: "P00000074649",
            location1: "P00000074650",
            location2: "P00000074651",
            location3: "P00000074652",
          },
          balanceQuery: {
            float1: "P00000074659",
            float2: "P00000074660",
            float3: "P00000074661",
            location1: "P00000074662",
            location2: "P00000074663",
            location3: "P00000074664",
          },
        },
        s = {},
        c = { myPackage: { 0: "", 1: "integrateRes" } },
        u = {
          main: {
            balanceQuery: "H5_HFYETJB",
            businessQuery: "H5_YDYWTJB",
            detailQuery: "H5_XDCXTJB",
            myPackage: "H5_WDTCTJB",
            marginQuery: "H5_YLCXTJB",
            phoneBills: "H5_HFZDTJB",
          },
          care: {
            phoneBills: "H5_HFZDDZTJB",
            balanceQuery: "H5_YECXDZTJB",
            businessQuery: "H5_YDYWDZTJB",
          },
          extra: { smartSms: "H5_ZHDX" },
          lite: {},
        },
        d = {
          imp: {
            balanceQuery: "P00000098487",
            businessQuery: "P00000098489",
            detailQuery: "P00000098503",
            myPackage: "P00000098488",
            marginQuery: "P00000098485",
            phoneBills: "P00000098486",
          },
          clk: {
            balanceQuery: "P00000098487",
            businessQuery: "P00000098489",
            detailQuery: "P00000098503",
            myPackage: "P00000098488",
            marginQuery: "P00000098485",
            phoneBills: "P00000098486",
          },
        },
        m = {
          "2136956HD1226500001": { operationCode: "44919", brand: "华为" },
          "2136956HD1226500002": { operationCode: "49708", brand: "小米" },
          "2136956HD1226500003": { operationCode: "49707", brand: "VIVO" },
          "2136956HD1226500004": { operationCode: "49706", brand: "OPPO" },
          "2136956HD1226500005": { operationCode: "49709", brand: "荣耀" },
          "1036904FW1066600001": { operationCode: "92329", brand: "1008611" },
        },
        p = { contractTdAuth: "getAuth", contractTd: "tocontractTd" },
        h = {
          cC: "currentCount",
          t1: "currentOutBillStart",
          t2: "currentOutBillEnd",
          t3: "currentShieldStart",
          t4: "currentShieldEnd",
          cS: "currentOutBillSpan",
          cB: "currentBlockDays",
          cT: "currentText",
          lC: "lastCount",
          t5: "lastOutBillStart",
          t6: "lastOutBillEnd",
          t7: "lastShieldStart",
          t8: "lastShieldEnd",
          lS: "lastOutBillSpan",
          lB: "lastBlockDays",
          lT: "lastText",
        },
        f = {
          marginQuery: "余量查询",
          phoneBills: "账单查询",
          businessQuery: "已订业务",
          detailQuery: "详单查询",
          myPackage: "我的套餐",
          balanceQuery: "余额查询",
        },
        g = {
          "main/balanceQuery": "monthSelectInfo",
          "main/phoneBills": "monthSelectInfo",
          "care/phoneBills": "common",
          "lite/phoneBillsLite": "monthSelectInfo",
          "extra/queryPolymerize": "monthSelectInfo",
          "extra/billsHelper": "common",
        },
        v = { 0: "paymentFunction", 1: "lastMonthPayment" },
        A = {
          "01": "套餐及固定费",
          "02": "套餐外通话费",
          "03": "套餐外上网费",
          "04": "套餐外短彩信费",
          "05": "增值业务费",
          "06": "代收费",
          "07": "其他费用",
        };
    },
    54229: function (e, t, a) {
      "use strict";
      a.d(t, {
        PU: function () {
          return o;
        },
        XY: function () {
          return n;
        },
        jP: function () {
          return i;
        },
      });
      const n = {
          100: "北京",
          200: "广东",
          210: "上海",
          220: "天津",
          230: "重庆",
          240: "辽宁",
          250: "江苏",
          270: "湖北",
          280: "四川",
          290: "陕西",
          311: "河北",
          351: "山西",
          371: "河南",
          431: "吉林",
          451: "黑龙江",
          471: "内蒙古",
          531: "山东",
          551: "安徽",
          571: "浙江",
          591: "福建",
          731: "湖南",
          771: "广西",
          791: "江西",
          851: "贵州",
          871: "云南",
          891: "西藏",
          898: "海南",
          931: "甘肃",
          951: "宁夏",
          971: "青海",
          991: "新疆",
        },
        o = {
          Flow: "0",
          Voice: "1",
          ShortMessage: "2",
          Other: "3",
          0: "0",
          1: "1",
          2: "2",
          3: "3",
        },
        i = { 1: "立即失效", 0: "下月失效", 3: "次日失效" };
    },
    58735: function (e, t, a) {
      "use strict";
      a.d(t, {
        CJ: function () {
          return w;
        },
        RE: function () {
          return f;
        },
        VW: function () {
          return d;
        },
        Xz: function () {
          return r;
        },
        ZA: function () {
          return b;
        },
        bb: function () {
          return I;
        },
        cP: function () {
          return C;
        },
        de: function () {
          return y;
        },
        fh: function () {
          return T;
        },
        gF: function () {
          return h;
        },
        h9: function () {
          return k;
        },
        oM: function () {
          return _;
        },
        pe: function () {
          return m;
        },
        q5: function () {
          return v;
        },
        rs: function () {
          return S;
        },
        wC: function () {
          return u;
        },
        yi: function () {
          return c;
        },
        zt: function () {
          return P;
        },
      });
      a(26699),
        a(2490),
        a(59849),
        a(59461),
        a(82499),
        a(34514),
        a(9924),
        a(72608),
        a(41874);
      var n = a(15222),
        o = a(86842),
        i = a.n(o);
      function r(e, t, a) {
        let n = null,
          o = null,
          i = null,
          r = null;
        return (
          t
            ? "01" === e.limitType
              ? m(t.unit, t.flowRemainNum) || m(t.unit, t.flowSumNum)
                ? (n = s(t, a))
                : Number(t.flowRemainNum) <= 0
                ? ((o = g(t.flowRemainNum, t.unit, "needJudgeValue0ShowUnit")),
                  (n = s(t, a)),
                  null !== a && (i = g(a, "03")))
                : ((o = g(t.flowRemainNum, t.unit, "needJudgeValue0ShowUnit")),
                  (n = s(t, a)))
              : "02" === e.limitType || "03" === e.limitType
              ? (n = s(t, a))
              : ("04" !== e.limitType && "05" !== e.limitType) ||
                (Number(t.flowRemainNum) <= 0
                  ? ((n = s(t, a)), null !== a && (i = g(a, "03")))
                  : (n = s(t, a)))
            : null !== a &&
              ((o = { num: 0, unit: "" }),
              (n = g(a, "03", "needJudgeValue0ShowUnit")),
              (i = g(a, "03"))),
          e.state &&
            ["01", "03"].includes(e.state) &&
            (r = { num: e.limitRate ? e.limitRate : "", unit: "Mbps" }),
          { useNumObj: n, remainNumObj: o, exceedNumObj: i, limitNumObj: r }
        );
      }
      function l(e) {
        return parseFloat(Number(e).toFixed(2));
      }
      function s(e, t) {
        let a = 0;
        try {
          if ((0, n.q6)(e.flowUsdNum) && (0, n.q6)(t))
            return { num: "--", unit: "GB" };
          if ((0, n.q6)(e.flowUsdNum)) (0, n.q6)(t) || (a = t);
          else {
            let n = Number(e.flowUsdNum);
            "04" === e.unit && (n *= 1024), (a = t && t > 0 ? n + t : n);
          }
          return 0 === a ? { num: "0", unit: "" } : g(a, "03");
        } catch (o) {
          return { num: "--", unit: "GB" };
        }
      }
      function c(e, t) {
        let a = null,
          n = null,
          o = null;
        return (
          t &&
            (m(t.unit, t.flowRemainNum) ||
              m(t.unit, t.flowSumNum) ||
              (n = g(t.flowRemainNum, t.unit)),
            (a = g(t.flowUsdNum, t.unit)),
            e.state &&
              ["01", "03"].includes(e.state) &&
              (o = { num: e.limitRate ? e.limitRate : "", unit: "Mbps" })),
          { useNumObj: a, remainNumObj: n, limitNumObj: o }
        );
      }
      function u(e, t) {
        let a = null,
          o = null,
          i = null,
          r = null;
        return (
          e
            ? m(e.unit, e.voiceRemainNum) || m(e.unit, e.voiceSumNum)
              ? (0, n.q6)(e.voiceUsdNum)
                ? (a = (0, n.q6)(t) ? "--" : l(t))
                : ((a = l(e.voiceUsdNum)), (0, n.q6)(t) || (a += l(t)))
              : ((e.voiceRemainNum && !(Number(e.voiceRemainNum) <= 0)) ||
                (0, n.q6)(t)
                  ? ((0, n.q6)(e.voiceUsdNum)
                      ? (a = (0, n.q6)(t) ? "--" : l(t))
                      : ((a = l(e.voiceUsdNum)), (0, n.q6)(t) || (a += l(t))),
                    (o = (0, n.q6)(e.voiceRemainNum)
                      ? "--"
                      : l(e.voiceRemainNum)))
                  : ((a = (0, n.q6)(e.voiceUsdNum)
                      ? l(t)
                      : l(e.voiceUsdNum) + l(t)),
                    (i = l(t))),
                (r = (0, n.q6)(e.voiceSumNum) ? "--" : l(e.voiceSumNum)))
            : (0, n.q6)(t) || ((a = l(t)), (i = l(t))),
          0 === a && (a = "0"),
          0 === o && (o = "0"),
          0 === i && (i = "0"),
          0 === r && (r = "0"),
          { usedValue: a, remainValue: o, exceedValue: i, sumValue: r }
        );
      }
      function d(e) {
        let t = null,
          a = null,
          o = null;
        return (
          e &&
            (m(e.unit, e.voiceRemainNum) || m(e.unit, e.voiceSumNum)
              ? (t = (0, n.q6)(e.voiceUsdNum) ? "--" : Number(e.voiceUsdNum))
              : ((t = (0, n.q6)(e.voiceUsdNum) ? "--" : Number(e.voiceUsdNum)),
                (a = (0, n.q6)(e.voiceRemainNum)
                  ? "--"
                  : Number(e.voiceRemainNum)),
                (o = (0, n.q6)(e.voiceSumNum) ? "--" : Number(e.voiceSumNum)))),
          0 === t && (t = "0"),
          0 === a && (a = "0"),
          0 === o && (o = "0"),
          { usedValue: t, remainValue: a, sumValue: o }
        );
      }
      function m(e, t) {
        let a = !1;
        return (
          !(0, n.q6)(t) &&
          ("N" === t
            ? (a = !0)
            : "01" === e
            ? Number(t) >= 99999 && (a = !0)
            : "02" === e || "04" === e
            ? Number(t) >= 9999 && (a = !0)
            : ("03" !== e && "1" !== e) || (Number(t) >= 10238976 && (a = !0)),
          a)
        );
      }
      function p(e, t) {
        let a = !1;
        return (
          !(0, n.q6)(t) &&
          ("N" === t
            ? (a = !0)
            : "01" === e
            ? Number(t) >= 99999 && (a = !0)
            : "02" === e || "05" === e
            ? Number(t) >= 9999 && (a = !0)
            : "03" === e
            ? Number(t) >= 10382321664 && (a = !0)
            : "04" === e && Number(t) >= 10238976 && (a = !0),
          a)
        );
      }
      function h(e) {
        let t = null;
        if ("04" === e.plantype) t = e.dayPlanParaInfoRes;
        else if ("06" === e.plantype) {
          var a;
          t = null === (a = e.flowInfoRes) || void 0 === a ? void 0 : a[0];
        } else t = e.flowInfoItem;
        if (e && t) {
          let a = e.plantype,
            o = t.usedRes,
            i = t.totalRes,
            r = t.unit,
            l = 0;
          return (
            "2" === e.expireFlag
              ? (l = 0)
              : (0, n.q6)(i) || 0 !== Number(i)
              ? "03" === a
                ? (l = 0)
                : "02" === a
                ? ((o = "03" === r ? o / 1024 : o),
                  (i = e.limitRes),
                  (l =
                    (0, n.q6)(i) || "N" === i || (0, n.q6)(o) || "N" === o
                      ? 1
                      : o / i))
                : (l =
                    (0, n.q6)(i) || "N" === i || (0, n.q6)(o) || "N" === o
                      ? 0
                      : o / i)
              : (l = 1),
            l > 1 ? "100%" : 100 * l + "%"
          );
        }
        return "0%";
      }
      function f(e, t, a = "") {
        t += "";
        try {
          if (
            "needJudgeValue0ShowUnit" === a &&
            !(0, n.q6)(e) &&
            0 === Number(e) &&
            ["03", "04"].includes(t)
          )
            return "0";
          if ("01" === t) return (0, n.q6)(e) ? "--" : l(e) + "分钟";
          if ("02" === t) return (0, n.q6)(e) ? "--" : l(e) + "条";
          if ("03" === t) {
            if ((0, n.q6)(e)) return "--";
            if (e >= 1024) {
              let t = (parseFloat(e) / 1024).toFixed(2);
              return l(t) + "GB";
            }
            return l(e) + "MB";
          }
          return "04" === t
            ? (0, n.q6)(e)
              ? "--"
              : l(e) + "GB"
            : "05" === t
            ? (0, n.q6)(e)
              ? "--"
              : l(e) + "次"
            : "06" === t
            ? (0, n.q6)(e)
              ? "--"
              : l(e) + "天"
            : (0, n.q6)(e)
            ? "--"
            : l(e);
        } catch (o) {
          return "--";
        }
      }
      function g(e, t, a) {
        try {
          if (
            ((t += ""),
            "needJudgeValue0ShowUnit" === a &&
              !(0, n.q6)(e) &&
              0 === Number(e) &&
              ["03", "04"].includes(t))
          )
            return { num: "0", unit: "" };
          if ("01" === t)
            return (0, n.q6)(e)
              ? { num: "--", unit: "分钟" }
              : { num: l(e), unit: "分钟" };
          if ("02" === t)
            return (0, n.q6)(e)
              ? { num: "--", unit: "条" }
              : { num: l(e), unit: "条" };
          if ("03" === t) {
            if ((0, n.q6)(e)) return { num: "--", unit: "GB" };
            if (e >= 1024) {
              let t = (parseFloat(e) / 1024).toFixed(2);
              return { num: l(t), unit: "GB" };
            }
            return { num: l(e), unit: "MB" };
          }
          return "04" === t
            ? (0, n.q6)(e)
              ? { num: "--", unit: "GB" }
              : { num: l(e), unit: "GB" }
            : "05" === t
            ? (0, n.q6)(e)
              ? { num: "--", unit: "次" }
              : { num: l(e), unit: "次" }
            : "06" === t
            ? (0, n.q6)(e)
              ? { num: "--", unit: "天" }
              : { num: l(e), unit: "天" }
            : { num: (0, n.q6)(e) ? "--" : l(e), unit: "" };
        } catch (o) {
          return { num: "--", unit: "" };
        }
      }
      function v(e) {
        let t = "";
        switch (e) {
          case "01":
            t = "分钟";
            break;
          case "02":
            t = "条";
            break;
          case "03":
            t = "MB";
            break;
          case "04":
            t = "GB";
            break;
          case "05":
            t = "次";
            break;
          case "06":
            t = "天";
            break;
          default:
            break;
        }
        return t;
      }
      function A(e, t, a) {
        try {
          if ((0, n.q6)(e))
            return { value: "--", unit: "01" === t ? "分钟" : "MB" };
          if ("needJudgeValue0ShowUnit" === a && 0 === Number(e))
            return { value: "0", unit: "" };
          switch (t) {
            case "01":
              return { value: l(e), unit: "分钟" };
            case "03":
              return e >= 1048576
                ? {
                    value: Number((parseFloat(e) / 1024 / 1024).toFixed(2)),
                    unit: "GB",
                  }
                : e >= 1024
                ? {
                    value: Number((parseFloat(e) / 1024).toFixed(2)),
                    unit: "MB",
                  }
                : { value: l(e), unit: "KB" };
            case "04":
              return e >= 1024
                ? {
                    value: Number((parseFloat(e) / 1024).toFixed(2)),
                    unit: "GB",
                  }
                : { value: l(e), unit: "MB" };
            case "05":
              return { value: l(e), unit: "GB" };
            default:
              return { value: l(e), unit: "" };
          }
        } catch (o) {
          return { value: "--", unit: "01" === t ? "分钟" : "MB" };
        }
      }
      function y(e, t = "") {
        if ("needJudgeValue0ShowUnit" === t && !(0, n.q6)(e) && 0 === Number(e))
          return "0";
        if (e >= 1024) {
          let t = (parseFloat(e) / 1024).toFixed(2);
          return Number(t) + "GB";
        }
        let a = parseFloat(e).toFixed(2);
        return Number(a) + "MB";
      }
      function T(e) {
        return e
          ? 8 === e.length
            ? i()(e).format("YYYY-MM-DD")
            : 14 === e.length
            ? i()(e).format("YYYY-MM-DD HH:mm:ss")
            : i()(e).format("YYYY-MM-DD")
          : "";
      }
      function S(e, t, a, o) {
        let i = e.filter((e) => e.cardstate === t)[0],
          r = null,
          l = null,
          s = null,
          c = !1;
        if (!i) return null;
        if (i.shareDetailInfo && i.shareDetailInfo.length > 0) {
          let e = i.shareDetailInfo.filter((e) => e.resourcesCode === a),
            t = "";
          e.forEach((e) => {
            (p(e.unit, e.shareTotalRes) || p(e.unit, e.shareRemainRes)) &&
              (c = !0),
              "01" === e.unit
                ? ((e.shareRemainRes = Number(e.shareRemainRes)),
                  (e.unit = "01"),
                  (t = "01"))
                : "03" === e.unit
                ? ((e.shareRemainRes = Number(e.shareRemainRes)),
                  (e.unit = "03"),
                  (t = "03"))
                : "04" === e.unit
                ? ((e.shareRemainRes = 1024 * Number(e.shareRemainRes)),
                  (e.unit = "03"),
                  (t = "03"))
                : "05" === e.unit &&
                  ((e.shareRemainRes = 1024 * Number(e.shareRemainRes) * 1024),
                  (e.unit = "03"),
                  (t = "03"));
          });
          let n = e.reduce((e, t) => e + t.shareRemainRes, 0);
          s = 0 === Number(n) ? A(0, "01" === a ? "01" : "04") : A(n, t);
        }
        let u = null;
        if (
          (i.allUserShareInfo &&
            i.allUserShareInfo.length > 0 &&
            (u = i.allUserShareInfo.find((e) => e.resourcesCodeAll === a)),
          u && u.shareUsedRes)
        )
          (l = A(u.shareUsedRes, u.unit)),
            (r = u.allShareDetailInfo || []),
            (r = r.map((e) => {
              let t = A(e.usedResSum, e.unit);
              return { usedTel: e.usedTerms, usedRes: t.value, unit: t.unit };
            }));
        else if (i.shareDetailInfo && i.shareDetailInfo.length > 0) {
          let e = i.shareDetailInfo.filter((e) => e.resourcesCode === a);
          if (((r = e.flatMap((e) => e.shareUsedResInfo)), r.length > 0)) {
            r.forEach((e) => {
              "01" === e.unit
                ? ((e.usedRes = Number(e.usedRes)), (e.unit = "01"))
                : "03" === e.unit
                ? ((e.usedRes = Number(e.usedRes)), (e.unit = "03"))
                : "04" === e.unit
                ? ((e.usedRes = 1024 * e.usedRes), (e.unit = "03"))
                : "05" === e.unit &&
                  ((e.usedRes = 1024 * e.usedRes * 1024), (e.unit = "03"));
            }),
              (r = (0, n.St)(r, "usedTerm", "usedRes"));
            let e = r.reduce((e, t) => e + t.summedValue, 0),
              t = "";
            (r = r.map((e) => {
              t = e.unit;
              let a = A(e.summedValue, e.unit);
              return { usedTel: e.usedTerm, usedRes: a.value, unit: a.unit };
            })),
              (l =
                0 === Number(e)
                  ? "01" === a
                    ? A(0, "01")
                    : { value: "0", unit: "" }
                  : A(e, t));
          }
        }
        if (r && r.length > 0) {
          const e = (e) => e.usedTel === o;
          (r = (0, n.Dp)(r, e)),
            "1" === t && (r = r.filter((e) => e.usedTel === o));
        }
        return (
          "04" === a &&
            (l && (0, n.D8)(l.value) && 0 === Number(l.value) && (l.unit = ""),
            s && (0, n.D8)(s.value) && 0 === Number(s.value) && (s.unit = ""),
            r &&
              r.length > 0 &&
              (r = r.map(
                (e) => (
                  (0, n.D8)(e.usedRes) &&
                    0 === Number(e.usedRes) &&
                    (e.unit = ""),
                  e
                )
              ))),
          {
            isUnLimitPackage: c,
            overallUsedData: l,
            overallRemainData: s,
            overallDetailData: r,
          }
        );
      }
      function I({ userShareInfo: e, resourcesCode: t, phoneNumber: a }) {
        const n = e.filter((e) => "0" === e.cardstate)[0],
          o = e.filter((e) => "1" === e.cardstate)[0];
        let i = !1,
          r = !1;
        var l, s;
        n &&
          (i = Boolean(
            ((null === (l = n.shareDetailInfo) || void 0 === l
              ? void 0
              : l.length) &&
              n.shareDetailInfo.find((e) => e.resourcesCode === t)) ||
              ((null === (s = n.allUserShareInfo) || void 0 === s
                ? void 0
                : s.length) &&
                n.allUserShareInfo.find(
                  (e) =>
                    e.resourcesCodeAll === t &&
                    e.allShareDetailInfo &&
                    e.allShareDetailInfo.length > 0
                ))
          ));
        if (o) {
          var c, u;
          let e = !1,
            n = !1;
          (null === o ||
          void 0 === o ||
          null === (c = o.shareDetailInfo) ||
          void 0 === c
            ? void 0
            : c.length) > 0 &&
            (e = o.shareDetailInfo.some(
              (e) =>
                e.resourcesCode === t &&
                e.shareUsedResInfo &&
                e.shareUsedResInfo.some((e) => e.usedTerm === a)
            )),
            (null === o ||
            void 0 === o ||
            null === (u = o.allUserShareInfo) ||
            void 0 === u
              ? void 0
              : u.length) > 0 &&
              (n = o.allUserShareInfo.some(
                (e) =>
                  e.resourcesCodeAll === t &&
                  e.allShareDetailInfo &&
                  e.allShareDetailInfo.some((e) => e.usedTerms === a)
              )),
            (r = e || n);
        }
        return { isShowMainShareData: i, isShowSubShareData: r };
      }
      function b({ userShareInfo: e, resourcesCode: t, phoneNumber: a }) {
        var o, i;
        let r = e.filter((e) => "0" === e.cardstate)[0];
        if (
          ((r =
            null !== (o = r) &&
            void 0 !== o &&
            null !== (i = o.shareDetailInfo) &&
            void 0 !== i &&
            i.length
              ? r.shareDetailInfo.filter((e) => {
                  var a;
                  return (
                    e.resourcesCode === t &&
                    (null === (a = e.shareUsedResInfo) || void 0 === a
                      ? void 0
                      : a.length)
                  );
                })
              : []),
          r.length > 0)
        ) {
          const e = "04" === t ? "needJudgeValue0ShowUnit" : "";
          return r.map((t) => {
            let o = A(t.shareTotalRes, t.unit),
              i = A(t.shareRemainRes, t.unit, e),
              r = A(t.shareUsedRes, t.unit, e);
            p(t.unit, t.shareTotalRes) || p(t.unit, t.shareRemainRes)
              ? (t.isUnLimitPackage = !0)
              : (t.isUnLimitPackage = !1),
              (t.shareTotalRes = o.value),
              (t.shareRemainRes = i.value),
              (t.shareUsedRes = r.value),
              (t.totalValueUnit = o.unit),
              (t.remainValueUnit = i.unit),
              (t.usedValueUnit = r.unit);
            const l = (e) => e.usedTerm === a;
            return (
              (t.shareUsedResInfo = (0, n.Dp)(t.shareUsedResInfo, l)),
              t.shareUsedResInfo.forEach((t) => {
                let a = A(t.usedRes, t.unit, e);
                (t.usedRes = a.value),
                  (t.unit = a.unit),
                  (t.usedTel = t.usedTerm);
              }),
              t
            );
          });
        }
        return null;
      }
      function C(e, t = null, a = null) {
        return [
          "04",
          "05",
          "06",
          "07",
          "08",
          "09",
          "10",
          "11",
          "12",
          "13",
        ].includes(e)
          ? "封顶"
          : ["01", "03"].includes(e)
          ? "限速"
          : null !== t && ((a && Number(a.flowRemainNum) <= 0) || !a)
          ? "超套"
          : "";
      }
      function w(e, t) {
        if (t) {
          if (t.remainNumObj) {
            let e = t.remainNumObj.unit;
            if (
              ((0, n.D8)(t.remainNumObj.num) &&
                0 === Number(t.remainNumObj.num) &&
                ((t.remainNumObj.unit = ""), (e = "")),
              (t.firstData = {
                title: "剩余：",
                value: t.remainNumObj.num,
                unit: e,
              }),
              t.useNumObj)
            ) {
              let e = t.useNumObj.unit;
              (0, n.D8)(t.useNumObj.num) &&
                0 === Number(t.useNumObj.num) &&
                ((t.useNumObj.unit = ""), (e = "")),
                (t.secondData = {
                  title: "已用：",
                  value: t.useNumObj.num,
                  unit: e,
                });
            }
          } else if (t.useNumObj) {
            let e = t.useNumObj.unit;
            (0, n.D8)(t.useNumObj.num) &&
              0 === Number(t.useNumObj.num) &&
              ((t.useNumObj.unit = ""), (e = "")),
              (t.firstData = {
                title: "已用：",
                value: t.useNumObj.num,
                unit: e,
              });
          }
        } else
          t =
            "国内通用流量" === e
              ? {
                  firstData: { title: "剩余：", value: "--", unit: "GB" },
                  secondData: { title: "已用：", value: "--", unit: "GB" },
                  cornerMark: "",
                }
              : null;
        return t;
      }
      function _(e, t) {
        return "国内通用通话" === e
          ? (t
              ? t.remainValue
                ? ((t.firstData = {
                    title: "剩余",
                    value: t.remainValue,
                    unit: "分钟",
                  }),
                  (t.secondData = {
                    title: "已用",
                    value: t.usedValue,
                    unit: "分钟",
                  }))
                : t.usedValue && t.exceedValue
                ? ((t.firstData = {
                    title: "已用",
                    value: t.usedValue,
                    unit: "分钟",
                  }),
                  (t.secondData = {
                    title: "超套",
                    value: t.exceedValue,
                    unit: "分钟",
                  }))
                : t.usedValue
                ? (t.firstData = {
                    title: "已用",
                    value: t.usedValue,
                    unit: "分钟",
                  })
                : (t = {
                    firstData: { title: "剩余", value: "--", unit: "分钟" },
                    secondData: { title: "已用", value: "--", unit: "分钟" },
                    cornerMark: "",
                  })
              : (t = {
                  firstData: { title: "剩余", value: "--", unit: "分钟" },
                  secondData: { title: "已用", value: "--", unit: "分钟" },
                }),
            t)
          : (t
              ? t.remainValue
                ? ((t.firstData = {
                    title: "剩余",
                    value: t.remainValue,
                    unit: "分钟",
                  }),
                  (t.secondData = {
                    title: "已用",
                    value: t.usedValue,
                    unit: "分钟",
                  }))
                : t.usedValue
                ? (t.firstData = {
                    title: "已用",
                    value: t.usedValue,
                    unit: "分钟",
                  })
                : (t = null)
              : (t = null),
            t);
      }
      function k(e, t) {
        let a = {
          firstData: {
            type: "0" === e ? "短信" : "彩信",
            title: "剩余",
            value: "--",
            unit: "条",
            speechText: "",
          },
          secondData: {
            type: "0" === e ? "短信" : "彩信",
            title: "已用",
            value: "--",
            unit: "条",
            speechText: "",
          },
          careData: {
            type: "0" === e ? "短信" : "彩信",
            title: "剩余",
            value: "--",
            sumValue: "--",
            unit: "条",
            speechText: "总量暂未获取剩余暂未获取",
          },
          interfaceHasOverallData: !1,
        };
        if (t) {
          let o = t.find((t) => t.mSGType === e);
          o &&
            (a =
              Number(o.mSGresSum) >= 9999 ||
              "N" === o.mSGresSum ||
              Number(o.mSGSum) >= 9999 ||
              "N" === o.mSGSum
                ? {
                    firstData: {
                      type: "0" === e ? "短信" : "彩信",
                      title: "已用",
                      value: (0, n.q6)(o.mSGuserd) ? "--" : l(o.mSGuserd),
                      unit: "条",
                      speechText: (0, n.q6)(o.mSGuserd)
                        ? ""
                        : `已用${l(o.mSGuserd)}条`,
                    },
                    careData: {
                      type: "0" === e ? "短信" : "彩信",
                      title: "已用",
                      value: (0, n.q6)(o.mSGuserd) ? "--" : l(o.mSGuserd),
                      unit: "条",
                      speechText:
                        "已用" +
                        ((0, n.q6)(o.mSGuserd) ? "" : l(o.mSGuserd)) +
                        "条",
                    },
                    interfaceHasOverallData: !0,
                  }
                : {
                    firstData: {
                      type: "0" === e ? "短信" : "彩信",
                      title: "剩余",
                      value: (0, n.q6)(o.mSGresSum) ? "--" : l(o.mSGresSum),
                      unit: "条",
                      speechText: (0, n.q6)(o.mSGresSum)
                        ? ""
                        : `剩余${l(o.mSGresSum)}条`,
                    },
                    secondData: {
                      type: "0" === e ? "短信" : "彩信",
                      title: "已用",
                      value: (0, n.q6)(o.mSGuserd) ? "--" : l(o.mSGuserd),
                      unit: "条",
                      speechText: (0, n.q6)(o.mSGuserd)
                        ? ""
                        : `已用${l(o.mSGuserd)}条`,
                    },
                    careData: {
                      type: "0" === e ? "短信" : "彩信",
                      title: "剩余",
                      value: (0, n.q6)(o.mSGresSum) ? "--" : l(o.mSGresSum),
                      sumValue: (0, n.q6)(o.mSGSum) ? "--" : l(o.mSGSum) + "",
                      unit: "条",
                      speechText:
                        "总量" +
                        ((0, n.q6)(o.mSGSum) ? "" : l(o.mSGSum)) +
                        "条剩余" +
                        ((0, n.q6)(o.mSGresSum) ? "" : l(o.mSGresSum)) +
                        "条",
                    },
                    interfaceHasOverallData: !0,
                  });
        }
        return a;
      }
      function N(e, t) {
        const a = Boolean(e),
          n = Boolean(t);
        return a && n ? "BOTH_EXIST" : "OTHER_EXIST";
      }
      function P(e, t) {
        const a = N(e, t);
        switch (a) {
          case "BOTH_EXIST":
            return `${e} - ${t}`;
          case "OTHER_EXIST":
            return e || t || "";
        }
      }
    },
    41110: function (e, t, a) {
      "use strict";
      a.d(t, {
        M: function () {
          return i;
        },
        r: function () {
          return o;
        },
      });
      a(2490), a(59849), a(82499), a(72608), a(41874);
      var n = a(15222);
      function o(e) {
        let t = "",
          a = "";
        try {
          const o = e.filter((e) => {
            var t;
            return (
              ("1" === e.type || "4" === e.type) &&
              (null === (t = e.busiInfo) || void 0 === t ? void 0 : t.length) >
                0
            );
          });
          if (o.length > 0) {
            const e = o.flatMap((e) => e.busiInfo);
            if (
              e.some(
                (e) => "N" === (null === e || void 0 === e ? void 0 : e.busiNum)
              )
            )
              t = "不限量";
            else {
              const o = e.filter(
                (e) =>
                  !(0, n.q6)(null === e || void 0 === e ? void 0 : e.busiNum)
              );
              if (0 === o.length) t = "未订购";
              else {
                const e = o.reduce(
                  (e, t) => (
                    (e = e || 0),
                    "03" === (null === t || void 0 === t ? void 0 : t.unit) &&
                      (e += parseFloat(
                        null === t || void 0 === t ? void 0 : t.busiNum
                      )),
                    "05" === (null === t || void 0 === t ? void 0 : t.unit) &&
                      (e +=
                        1024 *
                        parseFloat(
                          null === t || void 0 === t ? void 0 : t.busiNum
                        )),
                    e
                  ),
                  0
                );
                0 === Number(e)
                  ? ((t = "0"), (a = "MB"))
                  : e >= 1024
                  ? ((t = Number((e / 1024).toFixed(2)) + ""), (a = "GB"))
                  : ((t = Number(e.toFixed(2)) + ""), (a = "MB"));
              }
            }
          } else t = "未订购";
        } catch (o) {
          console.log("parse20066FlowData err:", o), (t = "暂无数据");
        }
        return { flowData: t, flowUnit: a };
      }
      function i(e, t) {
        let a = "";
        try {
          const o = e.filter((e) => {
            var a;
            return (
              e.type === t &&
              (null === (a = e.busiInfo) || void 0 === a ? void 0 : a.length) >
                0
            );
          });
          if (o.length > 0) {
            const e = o.flatMap((e) => e.busiInfo);
            if (
              e.some(
                (e) => "N" === (null === e || void 0 === e ? void 0 : e.busiNum)
              )
            )
              a = "不限量";
            else {
              const t = e.filter(
                (e) =>
                  !(0, n.q6)(null === e || void 0 === e ? void 0 : e.busiNum)
              );
              0 === t.length
                ? (a = "未订购")
                : ((a = t.reduce(
                    (e, t) => (
                      (e = e || 0),
                      (e += Number(
                        null === t || void 0 === t ? void 0 : t.busiNum
                      )),
                      e
                    ),
                    0
                  )),
                  (a += ""));
            }
          } else a = "未订购";
        } catch (o) {
          console.log("parse20066VoiceSmsData err:", o), (a = "暂无数据");
        }
        return a;
      }
    },
    12730: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return h;
        },
      });
      a(26699), a(2490), a(59461), a(34514), a(41874);
      var n = a(25672),
        o = a(67817),
        i = a(16456),
        r = a(83587);
      const l = (e) =>
        (0, i.Z)({
          contentType: !0,
          url: r.OC + "UN/message/cacheMessage",
          data: e,
        });
      var s = a(15744),
        c = a(89629),
        u = a(15222),
        d = a(72856),
        m = a(86842),
        p = a.n(m),
        h = {
          namespaced: !0,
          state: {
            activeTabName: "",
            balanceInfo: {
              accoutType: "",
              billingDetails: "",
              customizeInfoList: "",
              totalBills: "",
              accountQryInfoList: [],
            },
            userMode: { omnibusAccount: "", personal: "", show: !1 },
            isFreeErr: !1,
            copyWriting: "",
            defaultErrMsg:
              "查询遇到问题，请稍后再试，或联系10086查询。感谢您的理解与支持~",
            ledgerTabIndex: 0,
            isGuideShadow: !1,
            flexible1: null,
            flexible2: null,
            flexible3: null,
            flexible4: null,
            flexible5: null,
            flexible6: null,
            flexible7: null,
            flexible8: null,
            flexible9: null,
            flexible10: null,
            flexible11: null,
            flexible12: null,
            flexible13: null,
            flexible14: null,
            flexible15: null,
            flexible16: null,
            flexible17: null,
            accoutInfoLoadState: "loadInit",
            flexibleLoadState: "loadInit",
          },
          getters: {
            marketConfig(e, t, a, n) {
              return s.Z[n.pageName];
            },
            billsTotalShowType(e, t, a) {
              if (a.remoteState.CMCC_BalanceQuery_BillsTotalType) {
                let e = JSON.parse(
                  a.remoteState.CMCC_BalanceQuery_BillsTotalType
                );
                if (e && e[a.userInfo.loginProvince])
                  return e[a.userInfo.loginProvince].showType;
              }
              return "0";
            },
            billsFormulaSwitch(e, t, a) {
              if (a.remoteState.CMCC_BalanceQuery_FormulaSwitch) {
                let e = JSON.parse(
                  a.remoteState.CMCC_BalanceQuery_FormulaSwitch
                );
                return !Boolean(e.includes(a.userInfo.loginProvince));
              }
              return !0;
            },
            getBalanceIntroduceProvince(e, t, a, n) {
              if (
                (console.log(a.remoteState.CMCC_PhoneBill_BalanceRule),
                a.remoteState.CMCC_PhoneBill_BalanceRule)
              )
                return !!Object.keys(
                  JSON.parse(a.remoteState.CMCC_PhoneBill_BalanceRule)
                ).includes(a.userInfo.loginProvince);
            },
            accountType(e, t, a, n) {
              let o = ["1", "2"];
              if (a.remoteState.CMCC_BalanceQuery_AccountType) {
                var i;
                let e = JSON.parse(a.remoteState.CMCC_BalanceQuery_AccountType);
                (null === (i = e[a.userInfo.loginProvince]) || void 0 === i
                  ? void 0
                  : i.length) > 0 && (o = e[a.userInfo.loginProvince]);
              }
              return o;
            },
            isSpecialProvince(e, t, a) {
              if (a.remoteState.CMCC_BalanceQuery_SpecialProvince) {
                let e = JSON.parse(
                  a.remoteState.CMCC_BalanceQuery_SpecialProvince
                );
                return e.includes(a.userInfo.loginProvince);
              }
              return !1;
            },
            customizeText(e, t, a) {
              let n = {
                0: "信控额度",
                1: "往期欠费",
                2: "本期话费",
                3: "未返还金额",
              };
              if (
                (console.log(a.remoteState, "rootState.remoteState????"),
                a.remoteState.CMCC_BalanceQuery_CustomizeText)
              ) {
                let e = JSON.parse(
                  a.remoteState.CMCC_BalanceQuery_CustomizeText
                );
                if (e && e[a.userInfo.loginProvince]) {
                  let t = e[a.userInfo.loginProvince];
                  return { ...n, ...t };
                }
              }
              return n;
            },
            balanceCardNotHasValue(e, t) {
              var a, n, o, i, r, l, s;
              const c = t.billsTotalShowType,
                u =
                  (("1" === c || "2" === c) &&
                    (null === (a = e.balanceInfo.totalBills) || void 0 === a
                      ? void 0
                      : a.totalBillsAllThisMonthBill)) ||
                  "--",
                d =
                  "0" === c || "1" === c
                    ? null === (n = e.balanceInfo.totalBills) ||
                      void 0 === n ||
                      null === (o = n.totalBillsGeneralBalance) ||
                      void 0 === o
                      ? void 0
                      : o.thisMonthBill
                    : "--",
                m =
                  "0" === c || "1" === c
                    ? null === (i = e.balanceInfo.totalBills) ||
                      void 0 === i ||
                      null === (r = i.totalBillsOtherBalance) ||
                      void 0 === r
                      ? void 0
                      : r.thisMonthBill
                    : "--";
              let p = !1;
              return (
                null !== (l = e.balanceInfo) &&
                  void 0 !== l &&
                  null !== (s = l.customizeInfoList) &&
                  void 0 !== s &&
                  s.length &&
                  (p = e.balanceInfo.customizeInfoList.some((e) => {
                    const t = e.data;
                    return (
                      !(!t || !t.values) &&
                      ("0" === t.type
                        ? t.usedres && t.value
                        : ["1", "2", "3"].includes(t.type) && t.values)
                    );
                  })),
                "--" === u && "--" === d && "--" === m && !p
              );
            },
          },
          mutations: {
            setLoadState(e, { stateName: t, value: a }) {
              e[t] = a;
            },
            SET_USER_MODE(e, t) {
              Object.assign(e.userMode, t);
            },
            SET_BALANCE_INFO(e, t) {
              Object.assign(e.balanceInfo, t);
            },
            SET_ERROR_STATUS(e, t) {
              e.isFreeErr = t;
            },
            SET_ACCOUNT_INFO_ERROR_TEXT(e, t) {
              e.copyWriting = t;
            },
            SET_ACTIVE_TAB_NAME(e, t) {
              e.activeTabName = t;
            },
            SET_LEDGER_TAB_INDEX(e, t) {
              e.ledgerTabIndex = t;
            },
            SET_GUIDE_SHADOW(e, t) {
              e.isGuideShadow = t;
            },
            SET_FLEXIBLE(e, { num: t, flexible: a }) {
              console.log("SET_FLEXIBLE", `flexible${t}`, a),
                (e[`flexible${t}`] = a);
            },
          },
          actions: {
            async changeAccountInfo(
              { state: e, commit: t, rootState: a, dispatch: i },
              r = !1
            ) {
              let s = a.common.currentItem,
                u = s.year + "-" + s.month.padStart(2, "0");
              d["default"].commit("common/setYearMonthAnchorValue", u),
                d["default"].commit("common/setPageTabUrlParam", {
                  key: "yearMonth",
                  value: u,
                }),
                console.log("changeAccountInfo yearMonth--", u),
                t("setLoadState", {
                  stateName: "accoutInfoLoadState",
                  value: "loading",
                }),
                t("SET_ERROR_STATUS", !1),
                t("SET_ACCOUNT_INFO_ERROR_TEXT", "");
              let m = await (0, n.Z)(
                { beginMonth: u, endMonth: u },
                { timeout: 9500 }
              )
                .then(c.ep)
                .then(c.um);
              console.log("changeAccountInfo res--", m),
                a.login.isTouch &&
                  r &&
                  "000000" === m.retCode &&
                  (0, o.Z)({
                    busCode: "20073",
                    messageBody: JSON.stringify(m),
                    flag: "1",
                  });
              let h = a.common.currentItem,
                f = h.year + "-" + h.month.padStart(2, "0");
              if (u === f) {
                m.rspBody &&
                  l([
                    {
                      busCode: "20073",
                      messageBody: JSON.stringify(m.rspBody),
                    },
                  ]),
                  "250" !== a.userInfo.loginProvince &&
                    t("SET_GUIDE_SHADOW", !0);
                try {
                  var g, v, A;
                  let e =
                    (null === (g = m.rspBody) ||
                    void 0 === g ||
                    null === (v = g.accoutQryInfoHis) ||
                    void 0 === v ||
                    null === (A = v[0]) ||
                    void 0 === A
                      ? void 0
                      : A.billCycleStartDate) || "";
                  e &&
                    d["default"].commit(
                      "common/SET_BILL_CYCLE_START_DATA",
                      p()(e).format("YYYY-MM-DD")
                    );
                } catch (y) {
                  d["default"].commit("common/SET_BILL_CYCLE_START_DATA", ""),
                    console.log(
                      "SET_BILL_CYCLE_START_DATA-billCycleStartDate-error:",
                      y
                    );
                }
                "000000" === m.retCode &&
                m.rspBody &&
                m.rspBody.accoutQryInfoHis &&
                m.rspBody.accoutQryInfoHis.length
                  ? (t("SET_ERROR_STATUS", !1),
                    t("SET_ACCOUNT_INFO_ERROR_TEXT", ""),
                    d["default"].commit("market/setReportLingXiData", {
                      dataName: "accoutInfo",
                      data: m.rspBody,
                    }),
                    i("handleData", m),
                    d["default"].commit("common/SET_MAIN_REQ_END", !0),
                    a.common.paymentLogicData &&
                      d["default"].dispatch(
                        "common/setCurrentOrLastBillStatus"
                      ))
                  : (t("SET_ERROR_STATUS", !0),
                    t(
                      "SET_ACCOUNT_INFO_ERROR_TEXT",
                      "000000" === m.retCode
                        ? "暂未查询到数据"
                        : m.retDesc || e.defaultErrMsg
                    ),
                    d["default"].commit("common/SET_MAIN_REQ_END", !0),
                    !/^4\d{5}$/.test(m.retCode) &&
                      a.common.paymentLogicData &&
                      d["default"].dispatch(
                        "common/setCurrentOrLastBillStatus"
                      )),
                  t("setLoadState", {
                    stateName: "accoutInfoLoadState",
                    value: "loadCompleted",
                  });
              } else console.log("getAccoutInfo非最新的数据，舍弃");
            },
            handleData(
              { state: e, commit: t, getters: a, rootState: n, rootGetters: o },
              i
            ) {
              let r = { omnibusAccount: "", personal: "", show: !1 };
              i.rspBody.accoutQryInfoHis.forEach((e) => {
                var t;
                let i = {
                    totalBillsGeneralBalance: {
                      thisMonthBill: "--",
                      billInfoShow: !1,
                      thisMonthBillMsg: "",
                      businessDetailsList: null,
                    },
                    totalBillsOtherBalance: {
                      thisMonthBill: "--",
                      billInfoShow: !1,
                      thisMonthBillMsg: "",
                      businessDetailsList: null,
                    },
                    totalBillsAllThisMonthBill: "",
                    totalBillsAllBalanceColor: !1,
                    totalBillsGeneralBalanceColor: !1,
                  },
                  l = {
                    billTimeScope: {
                      billCycleStartDate: "",
                      billCycleEndDate: "",
                    },
                    allBalanceData: {
                      all: [],
                      income: [],
                      expend: [],
                      lastMonthBill: "--",
                      thisMonthEntryBill: "--",
                      thisMonthOutBill: "--",
                    },
                    generalBalanceData: {
                      all: [],
                      income: [],
                      expend: [],
                      lastMonthBill: "--",
                      thisMonthEntryBill: "--",
                      thisMonthOutBill: "--",
                    },
                    otherBalanceData: {
                      all: [],
                      income: [],
                      expend: [],
                      lastMonthBill: "--",
                      thisMonthEntryBill: "--",
                      thisMonthOutBill: "--",
                    },
                  },
                  s = [];
                if (
                  ((l.billTimeScope.billCycleStartDate = e.billCycleStartDate),
                  (l.billTimeScope.billCycleEndDate = e.billCycleEndDate),
                  (i.totalBillsAllThisMonthBill = e.allThisMonthBill || "--"),
                  e.specialTTZ || (e.specialTTZ = 10),
                  (i.totalBillsAllBalanceColor =
                    "N" !== e.specialTTZ && e.thisMonthBill < e.specialTTZ),
                  null !== (t = e.accoutQryInfo) && void 0 !== t && t.length)
                ) {
                  let t = [],
                    n = [],
                    r = [],
                    c = [],
                    u = [],
                    d = [],
                    m = [],
                    p = [];
                  a.isSpecialProvince &&
                    (e.accoutQryInfo.forEach((e) => {
                      console.log("element", e),
                        (e.lastMonthBill = e.lastMonthBill
                          ? e.lastMonthBill
                          : "--"),
                        (e.thisMonthEntryBill = e.thisMonthEntryBill
                          ? e.thisMonthEntryBill
                          : "--"),
                        (e.thisMonthOutBill = e.thisMonthOutBill
                          ? e.thisMonthOutBill
                          : "--"),
                        (e.thisMonthBill = e.thisMonthBill
                          ? e.thisMonthBill
                          : "--"),
                        0 !== o["common/monthActiveIndex"] &&
                          ((e.expendSwicth = !1),
                          (e.incomeSwitch = !1),
                          (e.owefeeSwitch = !1),
                          (e.dealList = []),
                          e.owefee &&
                            (e.owefeeData = [
                              {
                                payTypeName: "本月欠费金额",
                                entryBillnum: e.owefee,
                              },
                            ]));
                    }),
                    (s = JSON.parse(JSON.stringify(e.accoutQryInfo)))),
                    e.accoutQryInfo.forEach((a) => {
                      if ("0" === a.accoutState || "1" === a.accoutState) {
                        let g =
                          a.thisMonthBillmsg ||
                          (a.thisMonthBillInfo &&
                            a.thisMonthBillInfo.businessdetailsList &&
                            Array.isArray(
                              a.thisMonthBillInfo.businessdetailsList
                            ) &&
                            a.thisMonthBillInfo.businessdetailsList.length);
                        if (
                          (a.thisMonthEntryBillmsg &&
                            a.thisMonthEntryBillmsg.forEach((e) => {
                              (e.billName = e.payTypeName),
                                (e.billtime = e.entryBilltime),
                                (e.billnum = e.entryBillnum),
                                (e.billmsg = e.entryBillmsg),
                                (e.billmsgInfo = e.entryBillmsgInfo),
                                (e.billType = a.accoutState),
                                (e.iaeType = "1");
                            }),
                          a.thisMonthOutBillmsg &&
                            a.thisMonthOutBillmsg.forEach((e) => {
                              (e.billName = e.expendName),
                                (e.billtime = e.expendTime),
                                (e.billnum = e.expendNum),
                                (e.billmsg = e.expendmsg),
                                (e.billmsgInfo = e.expendmsgInfo),
                                (e.billType = a.accoutState),
                                (e.iaeType = "0");
                            }),
                          "0" === a.accoutState)
                        ) {
                          var o, s;
                          (i.totalBillsGeneralBalanceColor =
                            "N" !== e.specialTTZ &&
                            a.thisMonthBill < e.specialTTZ),
                            (i.totalBillsGeneralBalance = {
                              thisMonthBill: a.thisMonthBill || "--",
                              billInfoShow: g,
                              thisMonthBillMsg: a.thisMonthBillmsg,
                              businessDetailsList:
                                a.thisMonthBillInfo &&
                                a.thisMonthBillInfo.businessdetailsList,
                            }),
                            (l.generalBalanceData.lastMonthBill =
                              a.lastMonthBill || "--"),
                            (l.generalBalanceData.thisMonthEntryBill =
                              a.thisMonthEntryBill || "--"),
                            (l.generalBalanceData.thisMonthOutBill =
                              a.thisMonthOutBill || "--"),
                            null !== (o = a.thisMonthEntryBillmsg) &&
                              void 0 !== o &&
                              o.length &&
                              a.thisMonthEntryBillmsg.forEach((e) => {
                                e.entryBilltime ? t.push(e) : n.push(e);
                              }),
                            null !== (s = a.thisMonthOutBillmsg) &&
                              void 0 !== s &&
                              s.length &&
                              a.thisMonthOutBillmsg.forEach((e) => {
                                e.expendTime ? r.push(e) : c.push(e);
                              });
                          let u = [...t, ...r].sort(function (e, t) {
                            let a = Number(e.entryBilltime || e.expendTime),
                              n = Number(t.entryBilltime || t.expendTime);
                            return n - a;
                          });
                          l.generalBalanceData.all = [...u, ...n, ...c];
                          let d = t.sort(function (e, t) {
                              return (
                                Number(t.entryBilltime) -
                                Number(e.entryBilltime)
                              );
                            }),
                            m = r.sort(function (e, t) {
                              return (
                                Number(t.expendTime) - Number(e.expendTime)
                              );
                            });
                          (l.generalBalanceData.income = [...d, ...n]),
                            (l.generalBalanceData.expend = [...m, ...c]),
                            [
                              l.generalBalanceData.all,
                              l.generalBalanceData.income,
                              l.generalBalanceData.expend,
                            ].forEach((e) => e);
                        } else {
                          var h, f;
                          (i.totalBillsOtherBalance = {
                            thisMonthBill: a.thisMonthBill || "--",
                            billInfoShow: g,
                            thisMonthBillMsg: a.thisMonthBillmsg,
                            businessDetailsList:
                              a.thisMonthBillInfo &&
                              a.thisMonthBillInfo.businessdetailsList,
                          }),
                            (l.otherBalanceData.lastMonthBill =
                              a.lastMonthBill || "--"),
                            (l.otherBalanceData.thisMonthEntryBill =
                              a.thisMonthEntryBill || "--"),
                            (l.otherBalanceData.thisMonthOutBill =
                              a.thisMonthOutBill || "--"),
                            null !== (h = a.thisMonthEntryBillmsg) &&
                              void 0 !== h &&
                              h.length &&
                              a.thisMonthEntryBillmsg.forEach((e) => {
                                e.entryBilltime ? u.push(e) : d.push(e);
                              }),
                            null !== (f = a.thisMonthOutBillmsg) &&
                              void 0 !== f &&
                              f.length &&
                              a.thisMonthOutBillmsg.forEach((e) => {
                                e.expendTime ? m.push(e) : p.push(e);
                              });
                          let e = [...u, ...m].sort(function (e, t) {
                            let a = Number(e.entryBilltime || e.expendTime),
                              n = Number(t.entryBilltime || t.expendTime);
                            return n - a;
                          });
                          l.otherBalanceData.all = [...e, ...d, ...p];
                          let t = u.sort(function (e, t) {
                              return (
                                Number(t.entryBilltime) -
                                Number(e.entryBilltime)
                              );
                            }),
                            n = m.sort(function (e, t) {
                              return (
                                Number(t.expendTime) - Number(e.expendTime)
                              );
                            });
                          (l.otherBalanceData.income = [...t, ...d]),
                            (l.otherBalanceData.expend = [...n, ...p]),
                            [
                              l.otherBalanceData.all,
                              l.otherBalanceData.income,
                              l.otherBalanceData.expend,
                            ].forEach((e) => e);
                        }
                      }
                    }),
                    (l.allBalanceData.lastMonthBill =
                      e.allLastMonthBill || "--"),
                    (l.allBalanceData.thisMonthEntryBill =
                      e.allThisMonthEntryBill || "--"),
                    (l.allBalanceData.thisMonthOutBill =
                      e.allThisMonthOutBill || "--");
                  let h = [...t, ...r, ...u, ...m].sort(function (e, t) {
                    let a = Number(e.entryBilltime || e.expendTime),
                      n = Number(t.entryBilltime || t.expendTime);
                    return n - a;
                  });
                  l.allBalanceData.all = [...h, ...n, ...c, ...d, ...p];
                  let f = [...t, ...u].sort(function (e, t) {
                      return Number(t.entryBilltime) - Number(e.entryBilltime);
                    }),
                    g = [...r, ...m].sort(function (e, t) {
                      return Number(t.expendTime) - Number(e.expendTime);
                    });
                  (l.allBalanceData.income = [...f, ...n, ...d]),
                    (l.allBalanceData.expend = [...g, ...c, ...p]),
                    [
                      l.allBalanceData.all,
                      l.allBalanceData.income,
                      l.allBalanceData.expend,
                    ].forEach((e) => e);
                }
                let c = "",
                  u = n.common.dataArr.findIndex(
                    (e) =>
                      e.year === n.common.currentItem.year &&
                      e.month === n.common.currentItem.month
                  );
                e.customizeInfo &&
                  0 === u &&
                  ((c = [
                    { index: "0", data: "" },
                    { index: "2", data: "" },
                    { index: "1", data: "" },
                    { index: "3", data: "" },
                  ]),
                  c.forEach((t) => {
                    e.customizeInfo.forEach((e) => {
                      t.index === e.type && (t.data = e);
                    });
                  })),
                  console.log(e.accoutType, "accoutType////999"),
                  "1" === e.accoutType
                    ? (r.omnibusAccount = {
                        accoutType: e.accoutType,
                        totalBills: i,
                        billingDetails: l,
                        customizeInfoList: c,
                        accountQryInfoList: s,
                      })
                    : (r.personal = {
                        accoutType: e.accoutType,
                        totalBills: i,
                        billingDetails: l,
                        customizeInfoList: c,
                        accountQryInfoList: s,
                      }),
                  console.log(r, "userMod////999");
              }),
                r.omnibusAccount && r.personal
                  ? ((r.show = !0),
                    e.userMode.omnibusAccount && e.userMode.personal
                      ? "1" === e.balanceInfo.accoutType
                        ? t("SET_BALANCE_INFO", r.omnibusAccount)
                        : t("SET_BALANCE_INFO", r.personal)
                      : t("SET_BALANCE_INFO", r.omnibusAccount))
                  : r.omnibusAccount
                  ? ((r.show = !1),
                    t("SET_BALANCE_INFO", r.omnibusAccount),
                    (r.personal = ""))
                  : ((r.show = !1),
                    t("SET_BALANCE_INFO", r.personal),
                    (r.omnibusAccount = "")),
                t("SET_USER_MODE", r),
                t("SET_LEDGER_TAB_INDEX", (0, u.eY)("LedgerTab") || 0);
            },
            injectFlexiblePoint({ dispatch: e }) {
              e("topPointDis"), e("flexPointDis");
            },
            topPointDis({ state: e, commit: t, rootState: a }) {
              a.login.isTouch &&
                a.market.topArea &&
                (t("SET_FLEXIBLE", {
                  num: 1,
                  flexible: a.market.topArea["P00000051319"],
                }),
                t("SET_FLEXIBLE", {
                  num: 2,
                  flexible: a.market.topArea["P00000051320"],
                }),
                console.log("state.flexible1", e.flexible1),
                console.log("state.flexible2", e.flexible2));
            },
            flexPointDis({ state: e, getters: t, commit: a, rootState: n }) {
              var o, i;
              let r = t.marketConfig.areaId,
                l = n.market.areaList.find((e) => {
                  var t;
                  return (
                    e.areaId === r.tabID &&
                    (null === (t = e.moduleList) || void 0 === t
                      ? void 0
                      : t.length) > 0
                  );
                }),
                s =
                  null === l ||
                  void 0 === l ||
                  null === (o = l.moduleList) ||
                  void 0 === o
                    ? void 0
                    : o.find((e) => "market-explain-1" === e.moduleId);
              n.market.fixedArea &&
                n.market.fixedArea[r.fixedId[0]] &&
                (a("SET_FLEXIBLE", {
                  num: 3,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000070692"] || null,
                }),
                a("SET_FLEXIBLE", {
                  num: 4,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000098249"] || null,
                }),
                a("SET_FLEXIBLE", {
                  num: 5,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000110063"] || null,
                }),
                a("SET_FLEXIBLE", {
                  num: 6,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000110064"] || null,
                }),
                a("SET_FLEXIBLE", {
                  num: 7,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000110065"] || null,
                }),
                a("SET_FLEXIBLE", {
                  num: 14,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000132007"] || null,
                }),
                a("SET_FLEXIBLE", {
                  num: 15,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000132008"] || null,
                }),
                a("SET_FLEXIBLE", {
                  num: 16,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000132009"] || null,
                }),
                a("SET_FLEXIBLE", {
                  num: 17,
                  flexible:
                    n.market.fixedArea[r.fixedId[0]]["P00000132010"] || null,
                })),
                n.market.areaList &&
                  null !== s &&
                  void 0 !== s &&
                  null !== (i = s.adverList) &&
                  void 0 !== i &&
                  i.length &&
                  (a("SET_FLEXIBLE", {
                    num: 8,
                    flexible:
                      s.adverList.find((e) => "P00000110067" === e.channelId) ||
                      null,
                  }),
                  a("SET_FLEXIBLE", {
                    num: 9,
                    flexible:
                      s.adverList.find((e) => "P00000110068" === e.channelId) ||
                      null,
                  }),
                  a("SET_FLEXIBLE", {
                    num: 10,
                    flexible:
                      s.adverList.find((e) => "P00000110069" === e.channelId) ||
                      null,
                  }),
                  a("SET_FLEXIBLE", {
                    num: 11,
                    flexible:
                      s.adverList.find((e) => "P00000110070" === e.channelId) ||
                      null,
                  }),
                  a("SET_FLEXIBLE", {
                    num: 12,
                    flexible:
                      s.adverList.find((e) => "P00000110071" === e.channelId) ||
                      null,
                  }),
                  a("SET_FLEXIBLE", {
                    num: 13,
                    flexible:
                      s.adverList.find((e) => "P00000110072" === e.channelId) ||
                      null,
                  })),
                console.log(e, "state"),
                a("setLoadState", {
                  stateName: "flexibleLoadState",
                  value: "loadCompleted",
                });
            },
          },
        };
    },
    69197: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return N;
        },
      });
      a(26699),
        a(2490),
        a(59849),
        a(59461),
        a(34514),
        a(9924),
        a(72608),
        a(41874);
      var n = a(72671);
      function o(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getUserPlanType",
          ...t,
        })(e);
      }
      function i(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getUnifyQuery",
          ...t,
        })(e);
      }
      function r(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getSmsCode",
          ...t,
        })(e);
      }
      function l(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getUnifyCancel",
          ...t,
        })(e);
      }
      function s(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "updatePlan",
          ...t,
        })(e);
      }
      function c(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getNewQueryBusiness",
          ...t,
        })(e);
      }
      var u = a(15744),
        d = a(89629),
        m = a(72856),
        p = a(75150),
        h = a(14034),
        f = a(23899),
        g = a(86842),
        v = a.n(g),
        A = a(15222),
        y = a(50813),
        T = a.n(y),
        S = a(67817),
        I = a(76507),
        b = a(30660),
        C = a(79846);
      const w = {
        0: "mobileInfoList",
        1: "fixedLineInfoList",
        2: "broadBandInfoList",
      };
      function _(e, t = "") {
        return e
          ? t.substring(0, 3) + "****" + t.substring(7)
          : t.substring(0, 4) + "****" + t.substring(8);
      }
      function k(e = "") {
        return e.length > 6
          ? e.substring(0, 4) + "****" + e.substring(e.length - 2)
          : e.substring(0, 1) + "****" + e.substring(e.length - 1);
      }
      var N = {
        namespaced: !0,
        state: {
          planType: "0",
          mainTab: 0,
          sortActive: 0,
          currentMonth: 0,
          currentNum: {},
          planTypeTabs: [],
          numberList: [],
          infoList: [],
          defaultList: [],
          mobileInfoList: [],
          fixedLineInfoList: [],
          broadBandInfoList: [],
          mainRequestFirstBusiType: "initial",
          mobileChangePlanBeforeMainTab: 0,
          fixedLineChangePlanBeforeMainTab: 0,
          broadBandChangePlanBeforeMainTab: 0,
          listStatus: { loading: !0, none: !1, noneTip: "暂未查询到数据" },
          flexible1: null,
          flexible2: null,
          flexible3: null,
          flexible4: null,
          flexible5: null,
          flexible6: null,
          flexible7: null,
          flexible8: null,
          reasonData: {},
          rateData: null,
          countdown: 0,
          pullingData: null,
          foldByIndex: null,
          businessMarketLoadState: "loading",
          eyeStatus: { show: !1, switch: !1 },
        },
        getters: {
          marketConfig(e, t, a, n) {
            return u.Z[n.pageName];
          },
          isCurrentMonth(e, t, a) {
            return (
              v()().year() === Number(a.common.currentItem.year) &&
              v()().month() + 1 === Number(a.common.currentItem.month)
            );
          },
          isFamilyScene(e, t, a) {
            var n;
            const o =
              null === (n = a.remoteState) || void 0 === n
                ? void 0
                : n.CMCC_BusinessQuery_UserPlanTypeProvince;
            return null === o || void 0 === o
              ? void 0
              : o.includes(a.userInfo.loginProvince);
          },
          isFoldProvince(e, t, a, n) {
            var o;
            return (
              "care" !== n.pageGroup &&
              "bizfocus" === (0, A.eY)("ui_custom") &&
              (null === (o = a.userInfo) || void 0 === o
                ? void 0
                : o.loginProvince) &&
              a.login.isTouch &&
              ["250"].includes(a.userInfo.loginProvince)
            );
          },
        },
        mutations: {
          SET_BUSINESS_MARKET_LOAD_STATE(e, t) {
            e.businessMarketLoadState = t;
          },
          SET_LIST_STATUS(e, { loading: t, none: a, noneTip: n }) {
            e.listStatus = { loading: t, none: a, noneTip: n };
          },
          SET_PLAN_TYPE(e, t) {
            e.planType = t;
          },
          SET_MAIN_TAB(e, t) {
            (e.mainTab = t),
              (e.sortActive = 0),
              m["default"].commit("common/setPageTabUrlParam", {
                key: "contentTab",
                value: t,
              });
          },
          SET_SORT_ACTIVE(e, t) {
            if (
              ((e.foldByIndex = null),
              (e.sortActive = t),
              console.log("sortActive-----------", t),
              0 === t)
            )
              e.infoList = T()(e.defaultList);
            else {
              let a = { 1: "expireDate", 2: "validDate", 3: "orderTime" },
                n = T()(e.defaultList),
                o = /^[\u4E00-\u9FA5]+$/,
                i = n
                  .filter((e) => e[a[t]] && !o.test(e[a[t]]))
                  .sort((e, n) =>
                    v()(e[a[t]]).isAfter(v()(n[a[t]])) ? 1 : -1
                  ),
                r = n.filter((e) => !(e[a[t]] && !o.test(e[a[t]])));
              e.infoList = [...i, ...r];
            }
          },
          SET_CURRENT_NUM(e, t) {
            e.currentNum = t;
          },
          SET_PLAN_TYPE_TABS(e, t) {
            e.planTypeTabs = t;
          },
          SET_NUMBERS_LIST(e, t) {
            e.numberList = t;
          },
          SET_INFO_LIST(e, t) {
            e.infoList = t;
          },
          SET_DEFAULT_LIST(e, t) {
            e.defaultList = t;
          },
          SET_MOBILE_INFO_LIST(e, t) {
            e.mobileInfoList = t;
          },
          SET_FIXED_LINE_INFO_LIST(e, t) {
            e.fixedLineInfoList = t;
          },
          SET_BROAD_BAND_INFO_LIST(e, t) {
            e.broadBandInfoList = t;
          },
          SET_FLEXIBLE(e, { num: t, flexible: a }) {
            e[`flexible${t}`] = a;
          },
          SET_REASON_DATA(e, t) {
            e.reasonData = t;
          },
          SET_RATE_DATA(e, t) {
            e.rateData = t;
          },
          SET_COUNTDOWN(e, t) {
            e.countdown = t;
          },
          SET_PULLING_DATA(e, t) {
            e.pullingData = t;
          },
          SET_FOLD_BY_INDEX(e, t) {
            const { id: a, reset: n } = t;
            e.foldByIndex = n ? null : a;
          },
          SET_MAIN_REQUEST_BUSI_TYPE(e, t) {
            e.mainRequestFirstBusiType = t;
          },
          SET_CHANGE_PLAN_BEFORE_MAIN_TAB(e, { mainTab: t, planType: a }) {
            "0" === a
              ? (e.mobileChangePlanBeforeMainTab = t)
              : "1" === a
              ? (e.fixedLineChangePlanBeforeMainTab = t)
              : "2" === a && (e.broadBandChangePlanBeforeMainTab = t);
          },
          SET_EYE_STATUS(e, t) {
            e.eyeStatus = t;
          },
        },
        actions: {
          needsRefetch({ state: e }, t = "") {
            const a = e.mainRequestFirstBusiType,
              n = e.mobileChangePlanBeforeMainTab,
              o = e.fixedLineChangePlanBeforeMainTab,
              i = e.broadBandChangePlanBeforeMainTab,
              r = e.planType,
              l = e.mainTab,
              s = { 0: n, 1: o, 2: i },
              c = s[r];
            return "plan" === t ? a && c !== l : a;
          },
          async changePlanType({ state: e, dispatch: t, commit: a }, n) {
            const o = e.mainTab;
            a("SET_CHANGE_PLAN_BEFORE_MAIN_TAB", {
              planType: n.actPlanTypeTab,
              mainTab: o,
            }),
              a("SET_PLAN_TYPE", n.type),
              a("SET_SORT_ACTIVE", 0),
              a("SET_NUMBERS_LIST", []);
            const i = await t("needsRefetch", "plan");
            e[w[e.planType]].length > 0 && !i
              ? (t("getNumberList"), t("getListInfo"))
              : t("getNewQueryBusiness");
          },
          async changeMonth({ dispatch: e, commit: t, rootState: a }) {
            t("SET_SORT_ACTIVE", 0),
              t("SET_FIXED_LINE_INFO_LIST", []),
              t("SET_BROAD_BAND_INFO_LIST", []),
              t("SET_MOBILE_INFO_LIST", []),
              t("SET_PLAN_TYPE_TABS", []);
            let n = a.common.currentItem,
              o = `${n.year}-${n.month.padStart(2, "0")}`;
            m["default"].commit("common/setYearMonthAnchorValue", o),
              m["default"].commit("common/setPageTabUrlParam", {
                key: "yearMonth",
                value: o,
              }),
              await e("getAllBusinessQryList");
          },
          async getAllBusinessQryList(
            { state: e, getters: t, commit: a, dispatch: n, rootState: o },
            i = ""
          ) {
            if (i) {
              let e =
                o.common.currentItem.year +
                "-" +
                o.common.currentItem.month.padStart(2, "0");
              m["default"].commit("common/setYearMonthAnchorValue", e);
              let t = Number((0, A.eY)("contentTab"));
              [0, 1, 2, 3].includes(t) && a("SET_MAIN_TAB", t),
                m["default"].commit("common/setPageTabUrlParam", {
                  key: "yearMonth",
                  value: e,
                });
            }
            if (
              (a("SET_LIST_STATUS", { loading: !0, none: !1 }), t.isFamilyScene)
            ) {
              let t = new Date().getTime(),
                o = await n("getUserPlanType");
              if ((console.log("getUserPlanType", o), "abandon" === o)) return;
              e.planTypeTabs.find((e) => e.type === (0, A.eY)("planType")) &&
                (0, A.eY)("planType") &&
                "init" === i &&
                a("SET_PLAN_TYPE", (0, A.eY)("planType")),
                console.log("state.planTypeTabs------", e.planTypeTabs),
                console.log("await------1");
              let r = new Date().getTime(),
                l = 9500 - (r - t);
              (l = l <= 0 ? 1 : l),
                await n("getNewQueryBusiness", { moment: i, mainTimeout: l });
            } else await n("getNewQueryBusiness", { moment: i });
            n(
              "market/syncMonthSelector2Market",
              {
                year: o.common.currentItem.year,
                month: o.common.currentItem.month,
                shouldNotEmit: !0,
              },
              { root: !0 }
            ),
              n(
                "market/syncTabSelector2Market",
                {
                  accountTab: e.planType,
                  currentTab: String(e.mainTab),
                  shouldNotEmit: !0,
                },
                { root: !0 }
              ),
              n("market/emitPageInfoChange", {}, { root: !0 }),
              console.log("await------2");
          },
          async getUserPlanType({ commit: e, rootState: t, state: a }) {
            try {
              let n = t.common.yearMonthAnchorValue,
                i = [{ type: "0", label: "手机" }],
                r = await (0, I.EM)(() =>
                  o({
                    bgnMonth: t.common.yearMonthAnchorValue,
                    endMonth: t.common.yearMonthAnchorValue,
                  })
                ).then();
              if (t.common.yearMonthAnchorValue !== n) return "abandon";
              if ("000000" === r.retCode) {
                let t = r.rspBody.userPlanTypeInfo;
                t &&
                  (t.userBroadbandState &&
                    "1" === t.userBroadbandState &&
                    i.push({ type: "2", label: "宽带" }),
                  t.userTelphoneState &&
                    "1" === t.userTelphoneState &&
                    i.push({ type: "1", label: "固话" }));
                const n = a.planType,
                  o = i.some((e) => e.type === n);
                o || (e("SET_MAIN_TAB", 0), e("SET_PLAN_TYPE", "0"));
              }
              e("SET_PLAN_TYPE_TABS", i);
            } catch (n) {
              e("SET_PLAN_TYPE_TABS", [{ type: "0", label: "手机" }]);
            }
          },
          async getNewQueryBusiness(
            { state: e, commit: t, rootState: a, dispatch: n },
            o = {}
          ) {
            var i, r;
            const { moment: l = "", mainTimeout: s = 9500 } = o;
            t("SET_LIST_STATUS", { loading: !0, none: !1 });
            let u = a.common.yearMonthAnchorValue,
              m = e.planType,
              p = e.mainTab,
              h = e.mainRequestFirstBusiType;
            const f = { 0: "01", 1: "02", 2: "03", 3: "04" };
            console.log(
              "month-----------------------",
              u,
              a.common.yearMonthAnchorValue
            );
            let g = await c(
              { bgnMonth: u, endMonth: u, planType: m, busiType: f[p] || "01" },
              { timeout: s }
            )
              .then(d.ep)
              .then(d.um);
            if (
              ("init" === l &&
                "000000" ===
                  (null === g || void 0 === g ? void 0 : g.retCode) &&
                (0, S.Z)({
                  busCode: "20109",
                  messageBody: JSON.stringify(g),
                  flag: "1",
                }),
              a.common.yearMonthAnchorValue !== u)
            )
              return;
            if ((e.planType !== m || e.mainTab !== p) && h) return;
            const v =
              (null === g ||
              void 0 === g ||
              null === (i = g.rspBody) ||
              void 0 === i
                ? void 0
                : i.busiType) || "";
            if (
              ("initial" === h && t("SET_MAIN_REQUEST_BUSI_TYPE", v),
              "000000" === (null === g || void 0 === g ? void 0 : g.retCode) &&
                null !== g &&
                void 0 !== g &&
                null !== (r = g.rspBody) &&
                void 0 !== r &&
                r.allBusiQryList &&
                g.rspBody.allBusiQryList[0] &&
                g.rspBody.allBusiQryList[0].allBusiInfoList &&
                g.rspBody.allBusiQryList[0].allBusiInfoList[0])
            ) {
              t("SET_LIST_STATUS", { loading: !1, none: !1, noneTip: "" });
              let { planType: e, busiTypeInfoList: a = [] } =
                g.rspBody.allBusiQryList[0].allBusiInfoList[0];
              t(
                "1" === e
                  ? "SET_FIXED_LINE_INFO_LIST"
                  : "2" === e
                  ? "SET_BROAD_BAND_INFO_LIST"
                  : "SET_MOBILE_INFO_LIST",
                a
              ),
                n("getNumberList"),
                n("getListInfo"),
                console.log("getNewQueryBusiness------------------------", g);
            } else
              console.log("getNewQueryBusiness------------------------22", g),
                a.common.identcodeTips
                  ? t("SET_LIST_STATUS", {
                      loading: !1,
                      none: !0,
                      noneTip: a.common.identcodeTips,
                    })
                  : t("SET_LIST_STATUS", {
                      loading: !1,
                      none: !0,
                      noneTip:
                        "000000" === g.retCode
                          ? "暂未查询到数据"
                          : g.retDesc
                          ? g.retDesc
                          : "查询遇到问题，请稍后再试，或联系10086查询。感谢您的理解与支持~",
                    });
          },
          checkEyeStatus({ state: e, commit: t, rootState: a }) {
            let n = e[w[e.planType]];
            const o = e.eyeStatus,
              i = /\*{4,}/,
              r = a.userInfo.phoneNumber;
            let l = (n || []).some(
              (e) =>
                i.test(String(e.busiID || "")) || i.test(String(e.busiValue))
            );
            "0" === e.planType && r && (l = l || i.test(String(r))),
              t("SET_EYE_STATUS", { show: !l, switch: o.switch });
          },
          getNumberList({ state: e, commit: t, rootState: a, dispatch: n }) {
            n("checkEyeStatus");
            let o = e[w[e.planType]]
              .map((t) => ({
                busiID: t.busiID,
                maskID: _("0" === e.planType, t.busiID),
                busiValue: "0" === e.planType ? "副号" : k(t.busiValue),
                originBusiValue: "0" === e.planType ? "副号" : t.busiValue,
              }))
              .filter((e) => e.busiID);
            "0" === e.planType &&
              o.length > 0 &&
              o.unshift({
                busiID: a.userInfo.phoneNumber,
                maskID: a.userInfo.phoneMask,
                busiValue: "主号",
                originBusiValue: "主号",
              });
            const i = e.currentNum,
              r =
                null === o || void 0 === o
                  ? void 0
                  : o.findIndex(
                      (e) =>
                        e.busiID ===
                        (null === i || void 0 === i ? void 0 : i.busiID)
                    );
            let l = {};
            null !== o &&
              void 0 !== o &&
              o.length &&
              (l = -1 !== r ? o[r || 0] : o[0]),
              t("SET_NUMBERS_LIST", o),
              t("SET_CURRENT_NUM", l);
          },
          async getListInfo({
            state: e,
            getters: t,
            commit: a,
            dispatch: n,
            rootGetters: o,
          }) {
            a("SET_FOLD_BY_INDEX", { reset: !0 });
            let i = {},
              r = {};
            console.log("state.mainTab--------------", e.mainTab);
            let l = `0${e.mainTab + 1}`;
            try {
              var s, c, u, d;
              if (
                ((r =
                  "0" === e.planType
                    ? e.mobileInfoList.find(
                        (e) => e.busiInfoList && e.busiInfoList.length > 0
                      )
                    : e[w[e.planType]].find(
                        (t) =>
                          t.busiInfoList && t.busiID === e.currentNum.busiID
                      )),
                (i =
                  null === (s = r) ||
                  void 0 === s ||
                  null === (c = s.busiInfoList) ||
                  void 0 === c
                    ? void 0
                    : c.find((e) => e.productType === l)),
                (null === (u = i) ||
                void 0 === u ||
                null === (d = u.productInfoList) ||
                void 0 === d
                  ? void 0
                  : d.length) > 0)
              ) {
                let r = await n("sortList", i.productInfoList);
                a("SET_INFO_LIST", r),
                  a("SET_DEFAULT_LIST", r),
                  a("SET_LIST_STATUS", {
                    loading: e.listStatus.loading,
                    none: !1,
                    noneTip: "",
                  }),
                  t.isCurrentMonth &&
                    "care" !== o.pageGroup &&
                    n("getBusinessMarketData");
              } else
                console.log("未查询到您的业务信息-------------------------", l),
                  a("SET_INFO_LIST", []),
                  a("SET_DEFAULT_LIST", []),
                  a("SET_LIST_STATUS", {
                    loading: e.listStatus.loading,
                    none: !0,
                    noneTip: e.listStatus.noneTip || "暂未查询到数据",
                  });
            } catch (m) {
              console.log("getListInfo---catch---error", m);
            }
          },
          async sortList({ state: e, commit: t, dispatch: a }, n) {
            let o = [],
              i = [],
              r = [],
              l = [],
              s = [];
            return (
              n.forEach((e) => {
                "3" === e.busiState ? s.push(e) : l.push(e);
              }),
              0 === e.mainTab
                ? (l.forEach((e) => {
                    ["0", "2"].includes(e.majorType)
                      ? "2" === e.majorType
                        ? o.push(e)
                        : i.push(e)
                      : r.push(e);
                  }),
                  o.length >= 2 &&
                    ((0, C.eZ)(o, "validDate"),
                    o.forEach((e, t) => {
                      v()().isBefore(v()(e.validDate)) &&
                        ("0" === e.cancelFlag && "1" === e.unsubscribeFlag
                          ? (o[t].revokeSign = "1")
                          : "0" === e.unsubscribeFlag
                          ? (o[t].revokeSign = "0")
                          : "2" === e.unsubscribeFlag &&
                            (o[t].revokeSign = "2"));
                    })),
                  i.length >= 2 &&
                    ((0, C.eZ)(i, "validDate"),
                    i.forEach((e, t) => {
                      v()().isBefore(v()(e.validDate)) &&
                        ("0" === e.cancelFlag && "1" === e.unsubscribeFlag
                          ? (i[t].revokeSign = "1")
                          : "0" === e.unsubscribeFlag
                          ? (i[t].revokeSign = "0")
                          : "2" === e.unsubscribeFlag &&
                            (i[t].revokeSign = "2"));
                    })),
                  o.length > 0
                    ? (o[0].majorFlexibleSign = 1)
                    : i.length > 0 && (i[0].majorFlexibleSign = 1),
                  [...o, ...i, ...r, ...s])
                : [...l, ...s]
            );
          },
          async getBindBusiness({}, e) {
            var t, a;
            f.Z.show();
            let n = await (0, I.EM)(() =>
              i({ bindedFlag: "2", instanceId: e })
            );
            if (
              (f.Z.clear(),
              "000000" === (null === n || void 0 === n ? void 0 : n.retCode) &&
                null !== n &&
                void 0 !== n &&
                null !== (t = n.rspBody) &&
                void 0 !== t &&
                t.uniQryRecList &&
                null !== (a = n.rspBody.uniQryRecList[0]) &&
                void 0 !== a &&
                a.prodInfo &&
                n.rspBody.uniQryRecList[0].prodInfo.length > 0)
            ) {
              let { prodInfo: t = [] } = n.rspBody.uniQryRecList[0],
                a = t.filter(
                  (e) =>
                    e.busiInfomsg &&
                    (e.busiInfomsg.includes("1") || e.busiInfomsg.includes("2"))
                ),
                o = t.filter(
                  (e) =>
                    e.busiInfomsg &&
                    (e.busiInfomsg.includes("0") || e.busiInfomsg.includes("2"))
                );
              return (
                console.log("instanceId--------", e, {
                  relatedList: a,
                  bindList: o,
                }),
                { relatedList: a, bindList: o }
              );
            }
            return { relatedList: [], bindList: [] };
          },
          async getPullingWayData({ state: e, commit: t, rootState: a }) {
            if (!a.login.isTouch) {
              var n;
              let e = (0, A.eY)("channelId") || "0",
                { loginProvince: o, loginCity: i, phoneNumber: r } = a.userInfo,
                l = await (0, p.Z)("getPullingWay", () =>
                  (0, I.EM)(() =>
                    (0, h.DI)({
                      provinceCode: o,
                      cityCode: i,
                      cellNum: r,
                      pageInfo: "4",
                      channleId: e,
                    })
                  )
                );
              if (
                "000000" ===
                  (null === l || void 0 === l ? void 0 : l.retCode) &&
                null !== l &&
                void 0 !== l &&
                null !== (n = l.rspBody) &&
                void 0 !== n &&
                n.pullingType
              ) {
                let { pullingType: e = "", pullingTypeLocation: a = "" } =
                  l.rspBody;
                (e.includes("0") || e.includes("2")) &&
                  a &&
                  t("SET_PULLING_DATA", l.rspBody);
              }
            }
          },
          async getBusinessMarketData({
            state: e,
            commit: t,
            rootState: a,
            dispatch: n,
          }) {
            try {
              var o, i;
              t("SET_BUSINESS_MARKET_LOAD_STATE", "loading");
              const l =
                null === (o = e.infoList) || void 0 === o
                  ? void 0
                  : o
                      .reduce((e, t) => {
                        const a = [];
                        if (null !== t && void 0 !== t && t.productCode) {
                          var n;
                          a.push(t.productCode);
                          const e =
                            null === t ||
                            void 0 === t ||
                            null === (n = t.contractList) ||
                            void 0 === n
                              ? void 0
                              : n.contractDetailsList;
                          if (Array.isArray(e))
                            for (const n of e)
                              null !== n &&
                                void 0 !== n &&
                                n.contractId &&
                                ((n.contractProductCode =
                                  t.productCode + "-" + n.contractId),
                                null !== n &&
                                  void 0 !== n &&
                                  n.contractProductCode &&
                                  a.push(n.contractProductCode));
                        }
                        return e.concat(a);
                      }, [])
                      .filter((e) => Boolean(e));
              if (!l || 0 === l.length) return;
              let s = (0, A.eY)("channelId") || "",
                c = {
                  pageInfo: "4",
                  externalChannel: a.login.isTouch ? "" : s,
                  userInfo: { bunessCode: l },
                };
              const u = await n("needsRefetch");
              let d = {};
              if (
                ((d = u
                  ? await (0, I.EM)(() => (0, h.Th)(c))
                  : await (0, p.Z)(
                      "getBusinessMarketData$" + JSON.stringify(l),
                      () => (0, I.EM)(() => (0, h.Th)(c))
                    )),
                t("SET_BUSINESS_MARKET_LOAD_STATE", "loadCompleted"),
                "000000" ===
                  (null === (i = d) || void 0 === i ? void 0 : i.retCode) &&
                  d.rspBody &&
                  d.rspBody.areaList &&
                  d.rspBody.areaList.length)
              ) {
                var r;
                const a = d.rspBody.areaList,
                  n = (0, C.rZ)(a, "20240415008", "P00000101618"),
                  o = (0, C.cE)((0, C.rZ)(a, "20231212010", "P00000101619")),
                  i = (0, C.cE)((0, C.rZ)(a, "20231212010", "P00000125402")),
                  l = a.find(
                    (e) =>
                      "20240415006" === e.areaId &&
                      e.moduleList.find((e) => {
                        var t, a;
                        return (
                          (null === e ||
                          void 0 === e ||
                          null === (t = e.adverList) ||
                          void 0 === t
                            ? void 0
                            : t.length) > 0 ||
                          (null === e ||
                          void 0 === e ||
                          null === (a = e.tabList) ||
                          void 0 === a
                            ? void 0
                            : a.length) > 0
                        );
                      })
                  ),
                  s =
                    null === l ||
                    void 0 === l ||
                    null === (r = l.moduleList) ||
                    void 0 === r
                      ? void 0
                      : r.find((e) => e.tabList);
                if (n || o || l || i) {
                  let a = e.infoList.map((e) => {
                    var t, a, r;
                    let c = { ...e };
                    null !== n &&
                      void 0 !== n &&
                      null !== (t = n.bunessCode) &&
                      void 0 !== t &&
                      t.split("、").includes(e.productCode) &&
                      (c = { ...c, rateData: n }),
                      null !== o &&
                        void 0 !== o &&
                        null !== (a = o.bunessCode) &&
                        void 0 !== a &&
                        a.split("、").includes(e.productCode) &&
                        (c = { ...c, reasonData: o });
                    const u =
                      null === e ||
                      void 0 === e ||
                      null === (r = e.contractList) ||
                      void 0 === r
                        ? void 0
                        : r.contractDetailsList;
                    if (Array.isArray(u))
                      for (const n of u) {
                        var d;
                        console.log("contractItem", n, i);
                        const e =
                          null === n || void 0 === n
                            ? void 0
                            : n.contractProductCode;
                        e &&
                          null !== i &&
                          void 0 !== i &&
                          null !== (d = i.bunessCode) &&
                          void 0 !== d &&
                          d.split("、").includes(e) &&
                          (n.reasonData = i);
                      }
                    return (
                      null === l ||
                        void 0 === l ||
                        l.moduleList.forEach((t) => {
                          var a, n;
                          if (
                            (null === t ||
                            void 0 === t ||
                            null === (a = t.tabList) ||
                            void 0 === a
                              ? void 0
                              : a.length) > 0
                          ) {
                            let a = (0, C.ml)(t.tabList, e.productCode, e);
                            c = { ...c, tabList: a };
                          }
                          (null === (n = t.adverList) || void 0 === n
                            ? void 0
                            : n.length) > 0 &&
                            t.adverList.forEach((a) => {
                              c = (0, C.TI)(a, e, t, c, !!s);
                            });
                        }),
                      c
                    );
                  });
                  console.log("info_list", a), t("SET_INFO_LIST", a);
                }
              }
            } catch (l) {
              console.log("getBusinessMarketData", l);
            }
          },
          async getSmsCode(
            { dispatch: e },
            { business: t = {}, effectiveTimeType: a = "", contract: n = !1 }
          ) {
            f.Z.show();
            let {
              businessName: o = "",
              contractName: i = "",
              bizCode: l = "",
              sPCode: s = "",
              productCode: c = "",
              codeType: u = "",
              busiReturnEffTime: d = "",
              contractReturnEffTime: m = "",
              bindList: p = [],
              planId: h = "",
              contractId: g = "",
            } = t;
            console.log("busiReturnEffTime---", d);
            let v = { 0: "2", 1: "1", 3: "5" },
              A = "",
              y = "",
              T = "",
              S = "";
            n
              ? ((A = i), (T = g), (S = "3"), (y = v["2" === m ? a : m]))
              : ((A = o),
                (T = c),
                (S = "1"),
                p.forEach((e) => {
                  A += `,${e.bunessName}`;
                }),
                (y = v["2" === d ? a : d] || 3));
            let b = {
              busType: S,
              productName: A,
              effectiveType: y,
              productId: T,
              planId: h,
              ...("1" === S && { spid: s, bizCode: l, productType: u }),
            };
            console.log(b), console.log("******getSmsCode-reqBody", b);
            let C = await (0, I.EM)(() => r(b));
            return f.Z.clear(), "000000" === C.retCode && e("getCountdown"), C;
          },
          getCountdown({ commit: e }) {
            let t = 60;
            e("SET_COUNTDOWN", t);
            let a = setInterval(() => {
              t--, e("SET_COUNTDOWN", t), t <= 0 && clearInterval(a);
            }, 1e3);
          },
          async getUnifyCancel(
            { state: e },
            {
              businessName: t,
              productType: a,
              productId: n,
              spid: o,
              bizCode: i,
              smsCode: r,
              busiReturnEffTime: s,
              instanceId: c,
            }
          ) {
            f.Z.show();
            const u = (0, C._U)(e.planType, e.currentNum);
            let d = await (0, I.EM)(() =>
              l({
                productType: a,
                productId: n,
                spid: o,
                bizCode: i,
                smsCode: r,
                busiReturnEffTime: s,
                instanceId: c,
                ...u,
              })
            );
            f.Z.clear();
            let m = d;
            if (
              ("000000" === (null === d || void 0 === d ? void 0 : d.retCode) &&
                (m.rspBody = { ...d.rspBody, bunessName: t, bunessCode: n }),
              (0, S.Z)({
                busCode: "20057",
                messageBody: JSON.stringify(m),
                flag:
                  "000000" === (null === d || void 0 === d ? void 0 : d.retCode)
                    ? "1"
                    : "0",
              }),
              "312008" === d.retCode)
            ) {
              let e = "当前验证码校验失败，请重新获取！";
              return (
                d.retDesc &&
                  (e =
                    "验证码错误，请重新输入" === d.retDesc
                      ? "验证码错误，错误3次需重新获取"
                      : d.retDesc),
                { ...d, errorMsg: e }
              );
            }
            return "312009" === d.retCode
              ? { ...d, errorMsg: "验证码与当前业务不符，请重新获取" }
              : d;
          },
          async updatePlan({}, { productCode: e, smsCode: t }) {
            f.Z.show();
            let a = await (0, I.EM)(() =>
              s({ planId: e, smsCode: t, flag: "0" })
            );
            if ((f.Z.clear(), "312008" === a.retCode)) {
              let e = "当前验证码校验失败，请重新获取！";
              return (
                a.retDesc &&
                  (e =
                    "验证码错误，请重新输入" === a.retDesc
                      ? "验证码错误，错误3次需重新获取"
                      : a.retDesc),
                { ...a, errorMsg: e }
              );
            }
            return "312010" === a.retCode
              ? { ...a, errorMsg: "验证码与当前业务不符，请重新获取" }
              : a;
          },
          async getCustomerConfig({}, e) {
            var t, a;
            f.Z.show();
            let n = await (0, p.Z)("queryCustomerConfig" + e, () =>
              (0, I.EM)(() => (0, h.SQ)({ channelCode: "30011", pageName: e }))
            );
            return (
              f.Z.clear(),
              null !== n &&
              void 0 !== n &&
              null !== (t = n.rspBody) &&
              void 0 !== t &&
              null !== (a = t.object) &&
              void 0 !== a &&
              a.data
                ? n.rspBody.object.data
                : {}
            );
          },
          injectFlexiblePoint({
            state: e,
            getters: t,
            commit: a,
            dispatch: n,
            rootState: o,
            rootGetters: i,
          }) {
            n("topPointDis"),
              n("flexPointDis"),
              n("tabPointDis"),
              "zenith" === C.gM && n("ratePointDis"),
              n("reasonPointDis");
          },
          topPointDis({ commit: e, rootState: t }) {
            t.login.isTouch &&
              t.market.topArea &&
              (e("SET_FLEXIBLE", {
                num: 1,
                flexible: t.market.topArea["P00000047893"],
              }),
              e("SET_FLEXIBLE", {
                num: 2,
                flexible: t.market.topArea["P00000047894"],
              }));
          },
          flexPointDis({
            state: e,
            getters: t,
            commit: a,
            dispatch: n,
            rootState: o,
            rootGetters: i,
          }) {
            let r = t.marketConfig.areaId;
            o.market.fixedArea &&
              o.market.fixedArea[r.fixedId[0]] &&
              (a("SET_FLEXIBLE", {
                num: 3,
                flexible:
                  o.market.fixedArea[r.fixedId[0]]["P00000052165"] || null,
              }),
              a("SET_FLEXIBLE", {
                num: 7,
                flexible:
                  o.market.fixedArea[r.fixedId[0]]["P00000098237"] || null,
              }));
          },
          tabPointDis(
            {
              state: e,
              getters: t,
              commit: a,
              dispatch: n,
              rootState: o,
              rootGetters: i,
            },
            r = 0
          ) {
            if (
              ((r = Number(r)),
              o.market.tabArea &&
                o.market.tabArea.length > 0 &&
                o.market.tabArea[r])
            )
              switch (r) {
                case 0:
                  a("SET_FLEXIBLE", {
                    num: 4,
                    flexible:
                      o.market.tabArea[r].flexibleOne["P00000052166"] || null,
                  }),
                    a("SET_FLEXIBLE", {
                      num: 5,
                      flexible:
                        o.market.tabArea[r].flexibleOne["P00000093199"] || null,
                    }),
                    a("SET_FLEXIBLE", {
                      num: 6,
                      flexible:
                        o.market.tabArea[r].flexibleOne["P00000093205"] || null,
                    }),
                    a("SET_FLEXIBLE", {
                      num: 8,
                      flexible:
                        o.market.tabArea[r].flexibleOne["P00000125328"] || null,
                    });
                  break;
              }
          },
          reasonPointDis({ commit: e, rootState: t }) {
            let a,
              n = t.market.areaList.find((e) => {
                var t;
                return (
                  "20231212010" === e.areaId &&
                  (null === (t = e.moduleList) || void 0 === t
                    ? void 0
                    : t.length) > 0
                );
              });
            if (
              (null === n ||
                void 0 === n ||
                n.moduleList.find((e) => {
                  var t;
                  if (
                    (null === (t = e.adverList) || void 0 === t
                      ? void 0
                      : t.length) > 0
                  )
                    return (
                      (a = e.adverList.find(
                        (e) => "P00000080054" === e.channelId
                      )),
                      a
                    );
                }),
              a)
            ) {
              let t = {
                channelId: a.channelId,
                markId: a.markId,
                source: a.source,
                advBusiType: a.advBusiType,
                optionList: [],
                rightBtnText: a.rightBtnText || "",
                vLinkUrl: a.vLinkUrl || "",
                actionType: a.actionType || "",
              };
              for (let e = 0; e < 10; e++)
                a[`vOptionCopy${e + 1}`] &&
                  a[`vOptionType${e + 1}`] &&
                  t.optionList.push({
                    type: a[`vOptionType${e + 1}`],
                    text: a[`vOptionCopy${e + 1}`],
                  });
              console.log("cancelReason------------------", t),
                e("SET_REASON_DATA", t);
            }
          },
          ratePointDis: function ({ commit: e, rootState: t }) {
            let a,
              n,
              o = t.market.areaList.find((e) => {
                var t;
                return (
                  "20240415008" === e.areaId &&
                  (null === (t = e.moduleList) || void 0 === t
                    ? void 0
                    : t.length) > 0
                );
              });
            o &&
              o.moduleList.find((e) => {
                var t;
                if (
                  (null === (t = e.adverList) || void 0 === t
                    ? void 0
                    : t.length) > 0
                )
                  return (
                    e.adverList.find(
                      (e) => (
                        "P00000101621" === e.channelId && (a = e),
                        "P00000093207" === e.channelId &&
                          (e.vSubject5 ||
                            e.vSubject6 ||
                            e.vSubject7 ||
                            e.vSubject8 ||
                            e.vSubject9) &&
                          (n = e),
                        n
                      )
                    ),
                    n
                  );
              });
            let i = n || a;
            i && (e("SET_RATE_DATA", i), console.log("SET_RATE_DATA---", i));
          },
          async checkUnsubscribeState({ dispatch: e, rootState: t }, a) {
            var n;
            if (
              (console.log("*********", t.userInfo.loginProvince),
              null !== (n = t.remoteState) &&
                void 0 !== n &&
                n.CMCC_BusinessQuery_ContractUnsubscribe_Scenario)
            ) {
              var o;
              let n = JSON.parse(
                null === (o = t.remoteState) || void 0 === o
                  ? void 0
                  : o.CMCC_BusinessQuery_ContractUnsubscribe_Scenario
              );
              console.log("*********", n);
              let i = [];
              for (let e in n)
                n[e].includes(t.userInfo.loginProvince) && i.push(e);
              if ((console.log("*********", i), 0 === i.length))
                return { type: "service" };
              {
                f.Z.show();
                let t = [
                  e("contractAuth", a),
                  e("getDefaultInfoQry", { business: a, scenario: i }),
                ];
                return await Promise.allSettled(t)
                  .then(async (t) => {
                    console.log("All promises settled:", t);
                    const a = t
                      .filter((e) => "fulfilled" === e.status)
                      .map((e) => e.value);
                    return 2 === a.length
                      ? e("checkAuthOrInfo", {
                          authRes: a[0],
                          infoRes: a[1],
                          scenario: i,
                        })
                      : { type: "fail" };
                  })
                  .finally(() => {
                    f.Z.clear();
                  });
              }
            }
            return { type: "service" };
          },
          checkAuthOrInfo({}, { authRes: e, infoRes: t, scenario: a }) {
            var n;
            let o = {};
            if (
              "213052" === (null === e || void 0 === e ? void 0 : e.retCode)
            ) {
              var i, r, l;
              if (
                a.includes("phone_payment_provinces") &&
                "000000" ===
                  (null === t || void 0 === t ? void 0 : t.retCode) &&
                "0" ===
                  (null === t ||
                  void 0 === t ||
                  null === (i = t.rspBody) ||
                  void 0 === i
                    ? void 0
                    : i.payType) &&
                "1" ===
                  (null === t ||
                  void 0 === t ||
                  null === (r = t.rspBody) ||
                  void 0 === r
                    ? void 0
                    : r.flag) &&
                null !== t &&
                void 0 !== t &&
                null !== (l = t.rspBody) &&
                void 0 !== l &&
                l.liquidatedDamages
              ) {
                let e = (null === t || void 0 === t ? void 0 : t.rspBody) || {};
                return (
                  (e.specialCodeOfConfirm = !0),
                  (o.type = "confirm"),
                  (o.penaltyInfo = e),
                  o
                );
              }
              return (
                (o = {
                  type: "fail",
                  checkRes:
                    (null === e || void 0 === e ? void 0 : e.retDesc) || "",
                  failCode:
                    (null === e || void 0 === e ? void 0 : e.retCode) || "",
                }),
                o
              );
            }
            if (
              "000000" === (null === e || void 0 === e ? void 0 : e.retCode) &&
              "0" ===
                (null === e ||
                void 0 === e ||
                null === (n = e.rspBody) ||
                void 0 === n
                  ? void 0
                  : n.checkResult)
            ) {
              var s, c, u, d, m, p, h;
              let e = {
                0: "phone_payment_provinces",
                1: "cash_payment_provinces",
              };
              var f, g;
              if (
                "000000" ===
                  (null === t || void 0 === t ? void 0 : t.retCode) &&
                null !== t &&
                void 0 !== t &&
                null !== (s = t.rspBody) &&
                void 0 !== s &&
                s.liquidatedDamages &&
                ["0", "1"].includes(
                  null === t ||
                    void 0 === t ||
                    null === (c = t.rspBody) ||
                    void 0 === c
                    ? void 0
                    : c.payType
                ) &&
                ((["0", "1"].includes(
                  null === t ||
                    void 0 === t ||
                    null === (u = t.rspBody) ||
                    void 0 === u
                    ? void 0
                    : u.flag
                ) &&
                  "0" ===
                    (null === t ||
                    void 0 === t ||
                    null === (d = t.rspBody) ||
                    void 0 === d
                      ? void 0
                      : d.payType)) ||
                  ((["0", "1"].includes(
                    null === t ||
                      void 0 === t ||
                      null === (m = t.rspBody) ||
                      void 0 === m
                      ? void 0
                      : m.flag
                  ) ||
                    null === t ||
                    void 0 === t ||
                    null === (p = t.rspBody) ||
                    void 0 === p ||
                    !p.flag) &&
                    "1" ===
                      (null === t ||
                      void 0 === t ||
                      null === (h = t.rspBody) ||
                      void 0 === h
                        ? void 0
                        : h.payType)))
              )
                if (
                  a.includes("zero_penalty_provinces") &&
                  "0" ===
                    (null === t ||
                    void 0 === t ||
                    null === (f = t.rspBody) ||
                    void 0 === f
                      ? void 0
                      : f.liquidatedDamages)
                )
                  (o.type = "confirm"),
                    (o.penaltyInfo =
                      null === t || void 0 === t ? void 0 : t.rspBody);
                else if (
                  a.includes(
                    e[
                      null === t ||
                      void 0 === t ||
                      null === (g = t.rspBody) ||
                      void 0 === g
                        ? void 0
                        : g.payType
                    ]
                  )
                ) {
                  var v, A;
                  "1" ===
                    (null === t ||
                    void 0 === t ||
                    null === (v = t.rspBody) ||
                    void 0 === v
                      ? void 0
                      : v.payType) &&
                  Number(
                    null === t ||
                      void 0 === t ||
                      null === (A = t.rspBody) ||
                      void 0 === A
                      ? void 0
                      : A.liquidatedDamages
                  ) > 0
                    ? (o.type = "service")
                    : ((o.type = "confirm"),
                      (o.penaltyInfo =
                        null === t || void 0 === t ? void 0 : t.rspBody));
                } else o.type = "fail";
              else
                o = {
                  type: "fail",
                  checkRes:
                    ("000000" !==
                      (null === t || void 0 === t ? void 0 : t.retCode) &&
                      (null === t || void 0 === t ? void 0 : t.retDesc)) ||
                    "",
                  failCode:
                    "000000" !==
                    (null === t || void 0 === t ? void 0 : t.retCode)
                      ? null === t || void 0 === t
                        ? void 0
                        : t.retCode
                      : "",
                };
            } else {
              var y;
              o = {
                type: "fail",
                checkRes:
                  "000000" === (null === e || void 0 === e ? void 0 : e.retCode)
                    ? (null === e ||
                      void 0 === e ||
                      null === (y = e.rspBody) ||
                      void 0 === y
                        ? void 0
                        : y.checkRes) || ""
                    : (null === e || void 0 === e ? void 0 : e.retDesc) || "",
                failCode:
                  (null === e || void 0 === e ? void 0 : e.retCode) || "",
              };
            }
            return o;
          },
          async contractAuth({ state: e, rootState: t }, a = {}) {
            const n = (0, C._U)(e.planType, e.currentNum),
              o = (0, C.OW)(a);
            let i = {
                contractReturnEffTime: a.contractReturnEffTime || "",
                oprcode: "0",
                contractId: a.contractId,
                contractInstanceId: a.contractInstanceId,
                codeType: a.codeType,
                ...o,
                ...n,
              },
              r = await (0, I.EM)(() =>
                b.Z.contractTdAuth({ reqBody: i, version: t.userInfo.version })
              );
            return r;
          },
          async getDefaultInfoQry({ rootState: e }, { business: t }) {
            const a = (0, C.OW)(t);
            let n = {
                contractId: t.contractId,
                contractInstanceId: t.contractInstanceId,
                codeType: t.codeType,
                ...a,
              },
              o = await (0, I.EM)(() =>
                b.Z.getDefaultInfoQry({
                  reqBody: n,
                  version: e.userInfo.version,
                })
              );
            return o;
          },
          async contractTd(
            { state: e, rootState: t },
            {
              contractReturnEffTime: a,
              oprcode: n,
              contractId: o,
              contractInstanceId: i,
              codeType: r,
              productCode: l,
              spCode: s,
              bizCode: c,
              smsCode: u,
            }
          ) {
            f.Z.show();
            const d = (0, C._U)(e.planType, e.currentNum);
            let m = {
              contractReturnEffTime: a,
              oprcode: n,
              contractId: o,
              contractInstanceId: i,
              codeType: r,
              productCode: l,
              spCode: s,
              bizCode: c,
              smsCode: u,
              ...d,
            };
            console.log("******contractTd-reqBody", m);
            let p = await (0, I.EM)(() =>
              b.Z.contractTd({ reqBody: m, version: t.userInfo.version })
            );
            if ((f.Z.clear(), "312008" === p.retCode)) {
              let e = "当前验证码校验失败，请重新获取！";
              return (
                p.retDesc &&
                  (e =
                    "验证码错误，请重新输入" === p.retDesc
                      ? "验证码错误，错误3次需重新获取"
                      : p.retDesc),
                { ...p, errorMsg: e }
              );
            }
            return "312009" === p.retCode
              ? { ...p, errorMsg: "验证码与当前业务不符，请重新获取" }
              : p;
          },
        },
      };
    },
    97889: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return C;
        },
      });
      a(26699), a(2490), a(34514);
      var n = a(72671);
      function o(e = {}, t = {}) {
        return (0, n.ZP)({
          moduleName: "CMCCService_module",
          functionName: "getUserInformation",
          ...t,
        })(e);
      }
      var i,
        r,
        l,
        s,
        c = a(14034),
        u = a(86842),
        d = a.n(u),
        m = a(72856),
        p = a(15222),
        h = a(75150),
        f = a(26090),
        g = a(51327),
        v = a(76507),
        A = a(88922),
        y = a(22709);
      const T = a(86719);
      function S(e, t = "") {
        if ((console.log("paymentValidator0：", e, t), "1" === t)) {
          let t = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(e);
          return console.log("paymentValidator1res：", t), t;
        }
        if ("2" === t) {
          let t = /^\d{4}-\d{2}-\d{2}$/.test(e);
          return console.log("paymentValidator2res：", t), t;
        }
        {
          let t = /^[1-9]\d*$/.test(e);
          return console.log("paymentValidator3res：", t), t;
        }
      }
      function I(e, t) {
        return d()(e).add(t, "day").format("YYYY-MM-DD");
      }
      function b(e, t, a) {
        console.log("isBetweenDates：", e, t, a);
        let n = d()(e).isBetween(d()(t), d()(a), "second");
        return console.log("isBetweenDates res：", n), n;
      }
      d().extend(T), (window.pageEntryTime = Date.now());
      var C = {
        namespaced: !0,
        state: {
          isShield: !1,
          isOuting: !1,
          paymentBillMsg: "",
          defaultPaymentMsg:
            "出账中，暂无法查询。请于出账后再试，感谢您的理解与支持~ ",
          paymentLogicData: null,
          billCycleStartDate: null,
          currentItem: "",
          dataArr: [],
          userName: "",
          gsmState: "",
          userBrand: "",
          starLevel: "",
          mainInterfaceError: {
            pageError: !1,
            reLogin: !1,
            tipContent: "",
            code: "",
          },
          identcodeTips: "",
          yearMonthAnchorValue: "",
          openAppOptions: [],
          remindCodeObj: {},
          pullingWayData: null,
          pullingWayLoadState: "loadInit",
          isHideDetail: !1,
          paymentLogicLoadState: "loadInit",
          mainReqEnd: !1,
          pageTabUrlParam: "",
          reportData: {
            collectId: m["default"].getters.pageName + "_" + window.serverTime,
            pageName: m["default"].getters.pageName,
            pageUrl: window.location.href,
            openPageTimeStamp: performance.timing.navigationStart,
            loadSourceStartTime: performance.timing.fetchStart,
            pageEnterTime:
              (null === (i = window.skynetTime) || void 0 === i
                ? void 0
                : i.pageEnterTime) || "",
            pageEntryTime: window.pageEntryTime || "",
            nodeStartReqTime:
              (null === (r = window.nodeRenderInfo) || void 0 === r
                ? void 0
                : r.pageRenderStartTime) || "",
            nodeResponseReqTime:
              (null === (l = window.nodeRenderInfo) || void 0 === l
                ? void 0
                : l.pageRenderEndTime) || "",
            ip:
              (null === (s = window.nodeRenderInfo) || void 0 === s
                ? void 0
                : s.ip) || "",
            apiKey: {},
          },
          pendingLogs: [],
          idleCallbackId: null,
        },
        mutations: {
          SET_IS_SHIELD(e, t) {
            e.isShield = t;
          },
          SET_IS_OUTING(e, t) {
            e.isOuting = t;
          },
          SET_PAYMENT_BILL_MSG(e, t) {
            e.paymentBillMsg = t;
          },
          SET_PAYMENT_LOGIC_DATA(e, t) {
            e.paymentLogicData = t;
          },
          SET_BILL_CYCLE_START_DATA(e, t) {
            e.billCycleStartDate = t;
          },
          SET_CURRENT_ITEM(e, t) {
            e.currentItem = t;
          },
          SET_DATA_ARR(e, t) {
            e.dataArr = t;
          },
          setUserInformation(
            e,
            {
              userName: t = "",
              gsmState: a = "",
              userBrand: n = "",
              starLevel: o = "",
            }
          ) {
            (e.userName = t),
              (e.gsmState = a),
              (e.userBrand = n),
              (e.starLevel = o);
          },
          setMainInterfaceError(
            e,
            { pageError: t, tipContent: a, reLogin: n, code: o }
          ) {
            e.mainInterfaceError = {
              pageError: t,
              tipContent: a,
              reLogin: n,
              code: o,
            };
          },
          setYearMonthAnchorValue(e, t) {
            e.yearMonthAnchorValue = t;
          },
          SET_OPEN_APP_OPTIONS(e, t) {
            "1" === t.replace
              ? (e.openAppOptions = t.options)
              : (e.openAppOptions = [...e.openAppOptions, ...t]);
          },
          SET_REMIND_CODE_OBJ(e, t) {
            e.remindCodeObj = t;
          },
          SET_IDENTCODE_TIPS(e, t) {
            e.identcodeTips = t;
          },
          setPullingWayData(e, t) {
            e.pullingWayData = t;
          },
          setIsHideDetail(e, t) {
            e.isHideDetail = t;
          },
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
          SET_MAIN_REQ_END(e, t) {
            e.mainReqEnd = t;
          },
          setPageTabUrlParam(e, { key: t, value: a }) {
            e.pageTabUrlParam = (0, A.kI)(e.pageTabUrlParam, {
              key: t,
              value: a,
            });
          },
          SET_REPORT_DATA(e, t) {
            const { reportApiDataKey: a, reportValueObj: n } = t;
            e.reportData.apiKey[a]
              ? Object.assign(e.reportData.apiKey[a], n)
              : (e.reportData.apiKey[a] = n);
          },
          SET_IDLECALLBACKID(e, t) {
            e.idleCallbackId = t;
          },
        },
        actions: {
          setMonth({ commit: e, rootState: t, rootGetters: a }, n) {
            let o = window.serverTime || JSON.stringify(new Date().getTime()),
              i = d()(Number(o)),
              r = [];
            if ("redis" === n) {
              n = 13;
              let e = {};
              try {
                t.remoteState &&
                  t.remoteState[`CMCC_SET_MonthSelector_${a.pageName}`] &&
                  (e = JSON.parse(
                    t.remoteState[`CMCC_SET_MonthSelector_${a.pageName}`]
                  ));
              } catch (c) {
                console.log("JSON.parse(redis):error", c);
              }
              if (
                e &&
                e[t.userInfo.loginProvince] &&
                "0" !== e[t.userInfo.loginProvince]
              ) {
                let a = e[t.userInfo.loginProvince].slice(0, 2),
                  i = e[t.userInfo.loginProvince].slice(2, 4),
                  r = d()(d()(Number(o)).format("YYYY-MM")),
                  l = d()("20" + a + "-" + i),
                  s = r.diff(l, "month") + 1;
                s < 13 && s > 0 && (n = s);
              } else "0" === e[t.userInfo.loginProvince] && (n = 0);
            }
            let l = 0 === n ? 0 : n || 13;
            if (0 !== n)
              for (let u = 0; u < l; u++)
                r.push({
                  year: i.year().toString(),
                  month: (i.month() + 1).toString(),
                }),
                  (i = i.subtract(1, "month"));
            console.log("dataArr--", r), e("SET_DATA_ARR", r);
            let s = { year: "", month: "" };
            if (0 === n)
              (s = {
                year: i.year().toString(),
                month: (i.month() + 1).toString(),
              }),
                e("SET_CURRENT_ITEM", s);
            else if ((0, p.eY)("yearMonth")) {
              let e = (0, p.eY)("yearMonth").split("-");
              console.log("yearMonth queryArr--", e);
              let t = r.some((t) => {
                if (
                  Number(e[0]) === Number(t.year) &&
                  Number(e[1]) === Number(t.month)
                )
                  return (s = t), !0;
              });
              console.log("yearMonth monthExist--", t),
                t || (s = r[0]),
                console.log("yearMonth currentItem--", s);
            } else if ((0, p.eY)("lastMonth"))
              (s = r[1]), console.log("lastMonth currentItem--", s);
            else if ((0, p.eY)("relativemonth")) {
              let e = Number((0, p.eY)("relativemonth"));
              (e > 12 || e < 0) && (e = 0),
                console.log("relativeMonth num--", e),
                (s = r[e]),
                console.log("relativeMonth currentItem--", s);
            } else (s = r[0]), console.log("default currentItem--", s);
            console.log("currentItem", s), e("SET_CURRENT_ITEM", s);
          },
          async getUserInformation({ commit: e }, t = {}) {
            try {
              let a = await o({}, t);
              return (
                "000000" === a.retCode &&
                  a.rspBody &&
                  a.rspBody.userInfo &&
                  e("setUserInformation", {
                    userName: a.rspBody.userInfo.userName || "",
                    gsmState: a.rspBody.userInfo.gsmState,
                    userBrand: a.rspBody.userInfo.userBrand,
                    starLevel: a.rspBody.userInfo.starLevel,
                  }),
                a
              );
            } catch (a) {
              console.log(a, "getUserInformation---e--报错");
            }
          },
          async getPaymentLogic({ state: e, commit: t, dispatch: a }, n) {
            const { pageCode: o } = n;
            if (e.paymentLogicData)
              e.mainReqEnd && a("setCurrentOrLastBillStatus");
            else
              try {
                t("setLoadState", {
                  stateName: "paymentLogicLoadState",
                  value: "loading",
                });
                let n = await (0, v.EM)(() => (0, y.Z)({ pageCode: o }));
                console.log(n, "paymentLogic>>>res"),
                  "000000" === n.retCode &&
                    (t("SET_PAYMENT_LOGIC_DATA", n.rspBody),
                    e.mainReqEnd && a("setCurrentOrLastBillStatus")),
                  t("setLoadState", {
                    stateName: "paymentLogicLoadState",
                    value: "loadCompleted",
                  });
              } catch (i) {
                t("setLoadState", {
                  stateName: "paymentLogicLoadState",
                  value: "loadCompleted",
                }),
                  t("SET_PAYMENT_LOGIC_DATA", ""),
                  console.log("getPaymentLogicDataError:", i);
              }
          },
          setCurrentOrLastBillStatus({
            state: e,
            commit: t,
            getters: a,
            dispatch: n,
          }) {
            t("SET_IS_SHIELD", !1), t("SET_IS_OUTING", !1);
            let o = a.monthActiveIndex;
            if (![0, 1].includes(o)) return;
            if (!e.paymentLogicData) return;
            let {
              currentTime: i,
              currentCount: r,
              currentShieldStart: l,
              currentShieldEnd: s,
              currentOutBillStart: c,
              currentOutBillEnd: u,
              currentOutBillSpan: d,
              currentBlockDays: m,
              currentText: p,
              lastCount: h,
              lastShieldStart: f,
              lastShieldEnd: g,
              lastOutBillStart: v,
              lastOutBillEnd: A,
              lastOutBillSpan: y,
              lastBlockDays: T,
              lastText: S,
            } = e.paymentLogicData;
            n(
              "setBillStatus",
              0 === o
                ? {
                    currentTime: i,
                    billCount: r,
                    shieldStart: l,
                    shieldEnd: s,
                    outBillStart: c,
                    outBillEnd: u,
                    outBillSpan: d,
                    outDays: m,
                    billText: p,
                  }
                : {
                    currentTime: i,
                    billCount: h,
                    shieldStart: f,
                    shieldEnd: g,
                    outBillStart: v,
                    outBillEnd: A,
                    outBillSpan: y,
                    outDays: T,
                    billText: S,
                  }
            );
          },
          setBillStatus(
            { state: e, commit: t, dispatch: a },
            {
              currentTime: n,
              billCount: o,
              shieldStart: i,
              shieldEnd: r,
              outBillStart: l,
              outBillEnd: s,
              outBillSpan: c,
              outDays: u,
              billText: d,
            }
          ) {
            try {
              "1" === o && S(i, o) && S(r, o) && b(n, i, r)
                ? (console.log("屏蔽期"),
                  t("SET_PAYMENT_BILL_MSG", d || e.defaultPaymentMsg),
                  t("SET_IS_SHIELD", !0))
                : "1" === o && S(l, o) && S(s, o) && b(n, l, s)
                ? (console.log("出账期"),
                  t("SET_PAYMENT_BILL_MSG", d || e.defaultPaymentMsg),
                  t("SET_IS_OUTING", !0))
                : "2" === o &&
                  a("dynamicBill", {
                    currentTime: n,
                    outBillSpan: c,
                    outDays: u,
                    billText: d,
                  });
            } catch (m) {
              console.log("setBillStatus--error:", m),
                t("SET_PAYMENT_BILL_MSG", "");
            }
          },
          dynamicBill(
            { state: e, commit: t },
            { currentTime: a, outBillSpan: n, outDays: o, billText: i }
          ) {
            if (
              (console.log("灵活出账，账期开始时间：", e.billCycleStartDate),
              e.billCycleStartDate)
            ) {
              var r, l;
              let s = window.serverTime || JSON.stringify(new Date().getTime()),
                c = d()(Number(s)),
                u = c.year(),
                m = (c.month() + 1).toString().padStart(2, "0"),
                p =
                  null === (r = e.billCycleStartDate) ||
                  void 0 === r ||
                  null === (l = r.split("-")) ||
                  void 0 === l
                    ? void 0
                    : l[2],
                h = `${u}-${m}-${p}`,
                f = S(n) && I(h, n),
                g = S(o) && I(h, o);
              console.log(
                "灵活账期5个时间：",
                a,
                e.billCycleStartDate,
                h,
                f,
                g
              ),
                S(h, "2") && S(g, "2") && b(a, h, g)
                  ? (console.log("灵活账期isBetweenDates 屏蔽期：", a, h, g),
                    t("SET_PAYMENT_BILL_MSG", i || e.defaultPaymentMsg),
                    t("SET_IS_SHIELD", !0))
                  : S(h, "2") &&
                    S(f, "2") &&
                    b(a, h, f) &&
                    (console.log("灵活账期isBetweenDates 出账期：", a, h, f),
                    t("SET_PAYMENT_BILL_MSG", i || e.defaultPaymentMsg),
                    t("SET_IS_OUTING", !0));
            } else t("SET_PAYMENT_BILL_MSG", "");
          },
          initRemindAreaList({ commit: e }) {
            let t = {};
            (t = {
              话费账单: "20230822008",
              余额查询: "20230719006",
              已订业务: "20230621016",
              余量查询: "20230907004",
            }),
              e("SET_REMIND_CODE_OBJ", t);
          },
          async initPullingWay({ commit: e, rootGetters: t, rootState: a }) {
            try {
              if (
                (e("setLoadState", {
                  stateName: "pullingWayLoadState",
                  value: "loading",
                }),
                !g.Ds)
              ) {
                var n;
                let o = (0, p.eY)("channelId") || "0",
                  i = f.dK[t.pageName],
                  {
                    loginProvince: r,
                    loginCity: l,
                    phoneNumber: s,
                  } = a.userInfo,
                  u = await (0, h.Z)("getPullingWay", () =>
                    (0, v.EM)(() =>
                      (0, c.DI)({
                        provinceCode: r,
                        cityCode: l,
                        cellNum: s,
                        pageInfo: i,
                        channleId: o,
                      })
                    )
                  );
                if (
                  "000000" ===
                    (null === u || void 0 === u ? void 0 : u.retCode) &&
                  null !== u &&
                  void 0 !== u &&
                  null !== (n = u.rspBody) &&
                  void 0 !== n &&
                  n.pullingType
                ) {
                  let t = u.rspBody,
                    { pullingType: a = "", pullingTypeLocation: n = "" } = t;
                  e("setPullingWayData", t),
                    (a.includes("0") || a.includes("2")) &&
                      n.includes("5") &&
                      (e("setIsHideDetail", !0),
                      console.log("setIsHideDetail=====", !0)),
                    console.log("setPullingWayData=====", t);
                }
              }
              e("setLoadState", {
                stateName: "pullingWayLoadState",
                value: "loadCompleted",
              });
            } catch (o) {
              e("setLoadState", {
                stateName: "pullingWayLoadState",
                value: "loadCompleted",
              }),
                console.log("initPullingWay error", o);
            }
          },
          scheduleSend(
            { state: e, rootState: t, getters: a, commit: n, rootGetters: o },
            { reportApiDataKey: i, reportValueObj: r }
          ) {
            var l;
            console.log(window.pageEntryTime, "pageEntryTime", t.userInfo);
            const {
              sn: s = "",
              osType: u = "",
              sv: d = "",
              version: m = "",
            } = t.userInfo;
            let p = JSON.parse(JSON.stringify(e.reportData));
            if (
              null !== (l = e.reportData.apiKey[i]) &&
              void 0 !== l &&
              l.retEndTime
            )
              return;
            const {
              reqStartTime: h = "",
              retCode: g = "",
              retEndTime: v = "",
            } = r || {};
            if (!(h && g && v)) return;
            (p.apiKey = {}),
              (p.apiKey[i] = r),
              Object.assign(p, { sn: s, osType: u, sv: d, version: m });
            let A = {
              type: "qqd_website_keep_record",
              data: {
                loginNumber: t.userInfo.phoneNumber,
                userMobile: t.userInfo.phoneNumber,
                eventName: f.lp[o.pageName] + "_" + i,
                logData: JSON.stringify(p),
              },
            };
            if (
              (console.log(e.reportData.apiKey, p, "apikey--"),
              n("SET_REPORT_DATA", { reportApiDataKey: i, reportValueObj: r }),
              window.requestIdleCallback)
            ) {
              console.log("走--requestIdleCallback");
              const e = window.requestIdleCallback(
                (e) => {
                  (e.timeRemaining() > 0 || e.didTimeout) && (0, c.sH)(A);
                },
                { timeout: 2e3 }
              );
              n("SET_IDLECALLBACKID", e);
            } else
              console.log("不兼容requestIdleCallback-走settimeout"),
                setTimeout(() => (0, c.sH)(A), 2e3);
          },
        },
        getters: {
          monthActiveIndex(e) {
            let t = 0;
            return (
              e.dataArr.forEach((a, n) => {
                a.year === e.currentItem.year &&
                  a.month === e.currentItem.month &&
                  (console.log(n, "index>>>"), (t = n));
              }),
              t
            );
          },
        },
      };
    },
    45689: function (e, t, a) {
      "use strict";
      a(2490), a(34514);
      var n = a(15744),
        o = a(86842),
        i = a.n(o);
      t.Z = {
        namespaced: !0,
        state: {
          flexible1: null,
          flexible2: null,
          flexible3: null,
          requestTime: "",
        },
        getters: {
          marketConfig(e, t, a, o) {
            return n.Z[o.pageName];
          },
        },
        mutations: {
          setFlexible(e, { num: t, flexible: a }) {
            e[`flexible${t}`] = a;
          },
          setRequestTime(e) {
            e.requestTime = i()().format("YYYY-MM-DD HH:mm:ss");
          },
        },
        actions: {
          injectFlexiblePoint({
            state: e,
            getters: t,
            commit: a,
            dispatch: n,
            rootState: o,
            rootGetters: i,
          }) {
            n("flexPointDis");
          },
          flexPointDis({
            state: e,
            getters: t,
            commit: a,
            dispatch: n,
            rootState: o,
            rootGetters: i,
          }) {
            let r = t.marketConfig.areaId,
              l = t.marketConfig.flexPointIds;
            if (
              o.market.fixedArea &&
              o.market.fixedArea[r.fixedId[0]] &&
              l &&
              l.length > 0
            ) {
              let e = o.market.fixedArea[r.fixedId[0]];
              l.forEach((t, n) => {
                a("setFlexible", { num: n + 1, flexible: e[t] || null });
              });
            }
          },
        },
      };
    },
    89908: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return q;
        },
      });
      a(2490), a(59849), a(26699);
      var n = a(51327),
        o = a(72856),
        i = a(6648),
        r = a(3846),
        l = a(55844);
      async function s() {
        try {
          if (!n.Ds && !window.location.href.includes("localhost")) return !1;
          try {
            const t = await (0, i.iQ)();
            if (0 === t.status) return (0, i.TX)(), !1;
            try {
              let e = await (0, i.bG)(),
                a = "",
                n = await (0, i.g0)(e);
              return (
                (a = null !== n && void 0 !== n && n.token ? n.token : ""),
                o["default"].commit(
                  "setUserInfo",
                  Object.assign({}, e, { userStatus: t.status, appTokenId: a })
                ),
                await c(e.phoneNumber),
                !0
              );
            } catch (e) {
              return (0, r.dj)("getUserInfoError", JSON.stringify(e)), !1;
            }
          } catch (e) {
            return (0, r.dj)("userStatusError", JSON.stringify(e)), !1;
          }
        } catch (e) {
          return console.log("端内登录异常", e), !1;
        }
      }
      async function c(e) {
        try {
          if (!n.Tt) return;
          let t = o["default"].getters.pageName,
            a = o["default"].getters.pageGroup,
            r = `${a}_${t}_${(0, l.Pu)(e)}_count4xx`,
            s = await (0, i.ww)({ debug: !1, key: r });
          if (s && s.value) {
            let e = parseInt(s.value);
            console.log("check4xxStatus count", e),
              e > 0 &&
                (sessionStorage.setItem("count4xx", e.toString()),
                (0, i.kv)({ debug: !1, key: r, value: "0" }));
          }
        } catch (t) {
          console.log("check4xxStatus error", t);
        }
      }
      var u = a(10311),
        d = a.n(u),
        m = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            { staticClass: "popup" },
            [
              t(
                "popup",
                {
                  attrs: {
                    round: "",
                    position: "bottom",
                    "close-on-click-overlay": !!e.popupCloseable,
                    duration: e.popupDuration,
                  },
                  on: { close: e.handleClose },
                  model: {
                    value: e.numShowPopup,
                    callback: function (t) {
                      e.numShowPopup = t;
                    },
                    expression: "numShowPopup",
                  },
                },
                [
                  e.popupCloseable
                    ? t("div", {
                        staticClass: "close-btn",
                        on: { click: e.closePopup },
                      })
                    : e._e(),
                  t("div", { staticClass: "tel" }, [e._v("短信验证码")]),
                  t("div", { staticClass: "outnum" }, [
                    t("span", { staticClass: "numle" }, [e._v("+86")]),
                    t("span", [
                      t("input", {
                        directives: [
                          {
                            name: "model",
                            rawName: "v-model.trim",
                            value: e.phoneNum,
                            expression: "phoneNum",
                            modifiers: { trim: !0 },
                          },
                        ],
                        staticClass: "num",
                        attrs: {
                          type: "text",
                          maxlength: "11",
                          placeholder: "请输入移动手机号码",
                        },
                        domProps: { value: e.phoneNum },
                        on: {
                          input: [
                            function (t) {
                              t.target.composing ||
                                (e.phoneNum = t.target.value.trim());
                            },
                            e.tel,
                          ],
                          blur: function (t) {
                            return e.$forceUpdate();
                          },
                        },
                      }),
                    ]),
                  ]),
                  t("div", { staticClass: "codeOut" }, [
                    t("input", {
                      directives: [
                        {
                          name: "model",
                          rawName: "v-model.trim",
                          value: e.codeNum,
                          expression: "codeNum",
                          modifiers: { trim: !0 },
                        },
                      ],
                      staticClass: "nums code",
                      attrs: {
                        type: "text",
                        maxlength: "6",
                        placeholder: "请输入验证码",
                      },
                      domProps: { value: e.codeNum },
                      on: {
                        input: [
                          function (t) {
                            t.target.composing ||
                              (e.codeNum = t.target.value.trim());
                          },
                          e.incode,
                        ],
                        blur: function (t) {
                          return e.$forceUpdate();
                        },
                      },
                    }),
                    t(
                      "div",
                      {
                        ref: "tels",
                        class: e.allowPhone ? "codeBtn" : "codeBtn noBtn",
                        on: {
                          click: function (t) {
                            e.judgePhone() && e.toSendMsg();
                          },
                        },
                      },
                      [e._v(" " + e._s(e.sendText) + " ")]
                    ),
                  ]),
                  t(
                    "div",
                    {
                      class:
                        e.allowPhone && e.allowCode ? "loginBtn" : " noLogin",
                      on: {
                        click: function (t) {
                          e.judgePhone() && e.toLogin();
                        },
                      },
                    },
                    [e._v("登录")]
                  ),
                ]
              ),
            ],
            1
          );
        },
        p = [],
        h = (a(20058), a(36695)),
        f = a(14034),
        g = a(23692),
        v = a(26294),
        A = {
          name: "appSms",
          components: { Popup: h.Z },
          props: {
            loginSuccess: { type: Function },
            popupCloseable: { type: Boolean, default: !1 },
            popupDuration: { type: String, default: "0" },
          },
          data() {
            return {
              numShowPopup: !1,
              phoneNum: "",
              codeNum: "",
              allowPhone: !1,
              allowCode: !1,
              sendText: "获取验证码",
              time: 60,
              sendMsgState: "none",
              msgTimer: null,
            };
          },
          computed: { ...(0, v.mapState)({ userInfo: (e) => e.userInfo }) },
          methods: {
            show() {
              (this.numShowPopup = !0),
                (0, g.gdpTrace)("clk", {
                  WT_markId: "10689",
                  WT_adverType: "122",
                  WT_event: "qwbh2203160018",
                }),
                (0, f.A9)(
                  {
                    adverType: "122",
                    markId: "10689",
                    eventCode: "qwbh2203160018",
                  },
                  this.userInfo
                );
            },
            async toLogin() {
              if (
                ((0, g.gdpTrace)("clk", {
                  WT_markId: "10943",
                  WT_adverType: "122",
                  WT_event: "qwbh2206140006",
                }),
                (0, f.A9)(
                  {
                    adverType: "122",
                    markId: "10943",
                    eventCode: "qwbh2206140006",
                  },
                  this.userInfo
                ),
                "获取验证码" === this.sendText)
              )
                return this.$toast("请获取验证码"), !1;
              let e = await (0, f.x4)(this.userInfo, {
                  cellNum: this.phoneNum.toString(),
                  verifyCode: this.codeNum,
                  sendSmsFlag: 0,
                  sx: this.sx,
                  channlCode: "2",
                }),
                { retCode: t, rspBody: a, retDesc: n } = e;
              if ("000000" === t && a) {
                let {
                  provinceCode: e,
                  cityCode: t,
                  userBrand: n,
                  userName: o,
                } = a;
                this.closePopup(),
                  this.loginSuccess &&
                    this.loginSuccess({
                      province: e,
                      loginProvince: e,
                      city: t,
                      loginCity: t,
                      userBrand: n,
                      phoneNumber: o,
                    }),
                  (0, g.gdpTrace)("clk", {
                    WT_markId: "10693",
                    WT_adverType: "122",
                    WT_event: "qwbh2203160022",
                  }),
                  (0, f.A9)(
                    {
                      adverType: "122",
                      markId: "10693",
                      eventCode: "qwbh2203160022",
                    },
                    this.userInfo
                  );
              } else
                "310001" === t
                  ? this.$toast("请先获取验证码")
                  : (this.$toast(n),
                    (0, g.gdpTrace)("clk", {
                      WT_markId: "10694",
                      WT_adverType: "122",
                      WT_event: "qwbh2203160023",
                    }),
                    (0, f.A9)(
                      {
                        adverType: "122",
                        markId: "10694",
                        eventCode: "qwbh2203160023",
                      },
                      this.userInfo
                    ));
            },
            toSendMsg() {
              this.allowPhone &&
                "获取验证码" === this.sendText &&
                ((0, g.gdpTrace)("clk", {
                  WT_markId: "10941",
                  WT_adverType: "122",
                  WT_event: "qwbh2206140005",
                }),
                (0, f.A9)(
                  {
                    adverType: "122",
                    markId: "10941",
                    eventCode: "qwbh2206140005",
                  },
                  this.userInfo
                ),
                this.sendCode());
            },
            judgePhone() {
              if (!this.phoneNum) return !1;
              let e = !1;
              return (
                /^1[3456789]\d{9}$/.test(this.phoneNum)
                  ? (e = !0)
                  : this.$toast("请输入正确的手机号码"),
                e
              );
            },
            async sendCode() {
              if ("loading" !== this.sendMsgState)
                try {
                  this.sendMsgState = "loading";
                  let e = await (0, f.g_)(this.userInfo, {
                      cellNum: this.phoneNum.toString(),
                      channlCode: "2",
                    }),
                    { retCode: t, rspBody: a } = e;
                  if ("000000" === t && a) {
                    let { sx: e } = a;
                    this.checkTime(), (this.sx = e);
                  } else this.$toast.fail("获取失败");
                } finally {
                  this.sendMsgState = "none";
                }
            },
            checkTime() {
              (this.sendText = this.time + "s"),
                (this.msgTimer = setInterval(() => {
                  (this.time = this.time - 1),
                    (this.sendText = this.time + "s"),
                    this.time <= 0 &&
                      ((this.sendText = "获取验证码"),
                      (this.time = 60),
                      this.msgTimer && clearInterval(this.msgTimer));
                }, 1e3));
            },
            tel(e) {
              (this.phoneNum = e.target.value =
                e.target.value.replace(/[^\d]/g, "")),
                (this.phoneNum.length > 0 && this.phoneNum.length < 11) ||
                0 === this.phoneNum.length
                  ? (this.allowPhone = !1)
                  : 11 === this.phoneNum.length && (this.allowPhone = !0);
            },
            incode(e) {
              (this.codeNum = e.target.value =
                e.target.value.replace(/[^\d]/g, "")),
                (this.codeNum.length > 0 && this.codeNum.length < 6) ||
                0 === this.codeNum.length
                  ? (this.allowCode = !1)
                  : 6 === this.codeNum.length && (this.allowCode = !0);
            },
            closePopup() {
              this.numShowPopup = !1;
            },
            handleClose() {
              console.log("关闭登录弹窗"),
                this.popupDuration &&
                  (this.msgTimer && clearInterval(this.msgTimer),
                  (this.time = 60),
                  (this.allowPhone = !1),
                  (this.allowCode = !1),
                  (this.phoneNum = ""),
                  (this.codeNum = ""),
                  (this.sendMsgState = "none"),
                  (this.sendText = "获取验证码"));
            },
          },
        },
        y = A,
        T = a(1001),
        S = (0, T.Z)(y, m, p, !1, null, "6f812ea8", null),
        I = S.exports;
      let b,
        C = {};
      function w(e) {
        return document.body.contains(e);
      }
      function _() {
        b && b.$destroy();
        let e = d().extend(I);
        (b = new e({ store: o["default"] }).$mount()),
          document.body.appendChild(b.$el);
      }
      async function k(e) {
        if (o["default"].state.login.isTouch) return !1;
        console.log("短信验证码登录");
        let t = new Promise((t) => {
            (0, r.zp)(!1);
            try {
              var a, n;
              if (
                window.skynetTime &&
                null !== (a = window) &&
                void 0 !== a &&
                null !== (n = a.__SKYNET) &&
                void 0 !== n &&
                n.fire
              ) {
                window.skynetTime.loginSmsTime = Date.now();
                let e =
                  window.skynetTime.loginSmsTime -
                  window.skynetTime.pageEnterTime;
                console.log(
                  "window.__SKYNET.fire sms",
                  { p1: e, p2: 0 },
                  window.skynetTime
                ),
                  window.__SKYNET.fire("userProfile", { p1: e, p2: 0 });
              }
            } catch (o) {}
            I.showDialog({
              popupCloseable: e.popupCloseable,
              popupDuration: e.popupDuration || "0",
              loginSuccess: (e) => {
                t(e);
              },
            });
          }),
          a = await t;
        return a && o["default"].commit("setUserInfo", a), !0;
      }
      I.showDialog = function (e) {
        const t = e || {};
        (b && w(b.$el)) || _(), Object.assign(b, C, t), b.show();
      };
      var N = a(15222),
        P = a(49034);
      async function B(e) {
        let t = await (0, P.eP)(o["default"].state.userInfo, {
          token: e,
          mhrzNeed: "1",
        });
        if ("000000" === t.retCode && Boolean(t.rspBody)) {
          let e = t.rspBody.userName;
          if (e)
            return o["default"].commit("setUserInfo", { phoneNumber: e }), !0;
        }
        return (
          window.history.pushState(
            "",
            "",
            (0, N.ch)(window.location.href, ["token"])
          ),
          !1
        );
      }
      async function L() {
        if (o["default"].state.login.isTouch) return !1;
        try {
          console.log("大网登录");
          const e = (0, N.eY)("token");
          return !!e && B(e);
        } catch (e) {
          return !1;
        }
      }
      var D = function () {
          var e = this,
            t = e._self._c;
          return t(
            "div",
            [
              t(
                "popup",
                {
                  attrs: {
                    round: "",
                    position: "bottom",
                    "close-on-click-overlay": !!e.popupCloseable,
                    duration: e.popupDuration,
                  },
                  model: {
                    value: e.G4ShowPopup,
                    callback: function (t) {
                      e.G4ShowPopup = t;
                    },
                    expression: "G4ShowPopup",
                  },
                },
                [
                  e.popupCloseable
                    ? t("div", {
                        staticClass: "close-btn",
                        on: { click: e.closePopup },
                      })
                    : e._e(),
                  t("div", { staticClass: "pall" }, [
                    t("p", { staticClass: "ett" }, [e._v("手机号登录")]),
                    t("p", { staticClass: "sjh num" }, [
                      e._v(e._s(e.phoneMask)),
                    ]),
                    t(
                      "div",
                      { staticClass: "loginBtn", on: { click: e.GLogin } },
                      [e._v("本机号码一键登录")]
                    ),
                    t("p", { staticClass: "oth", on: { click: e.smsLogin } }, [
                      e._v("其他号码登录"),
                    ]),
                    t("div", { staticClass: "xiy" }, [
                      t("img", {
                        staticClass: "selimg",
                        attrs: { src: e.isSel ? a(70415) : a(7615), alt: "" },
                        on: { click: e.isAgree },
                      }),
                      t("div", { staticClass: "xtext" }, [
                        e._v(" 使用手机号码一键登录即代表您已同意 "),
                        t(
                          "span",
                          { staticClass: "link", on: { click: e.goToPage } },
                          [e._v("《中国移动认证服务条款》")]
                        ),
                        e._v(" 并使用本机号码登录。 "),
                      ]),
                    ]),
                    t("p", { staticClass: "jie" }, [
                      e._v("中国移动为您提供本机号码认证服务"),
                    ]),
                  ]),
                ]
              ),
            ],
            1
          );
        },
        E = [],
        x = a(23899),
        M = {
          name: "",
          components: { Popup: h.Z },
          props: {
            loginSuccess: { type: Function },
            popupCloseable: { type: Boolean, default: !1 },
            popupDuration: { type: String, default: "0" },
            phoneMask: { type: String, default: "99999999999" },
          },
          data() {
            return { isSel: "", G4ShowPopup: !1 };
          },
          computed: {
            ...(0, v.mapState)({
              userInfo: (e) => e.userInfo,
              isTouch: (e) => e.login.isTouch,
            }),
          },
          methods: {
            show() {
              this.G4ShowPopup = !0;
            },
            goToPage() {
              let e = (0, N.nP)("/cmcc-app/familyAgree/familyAgree.html");
              (0, g.gdpTrace)("clk", { WT_markId: "", WT_adverType: "122" }),
                (0, f.A9)(
                  { adverType: "122", markId: "", eventCode: "" },
                  this.userInfo
                ),
                this.isTouch ? (0, i.gU)(e) : (window.location.href = e);
            },
            isAgree() {
              (this.isSel = !this.isSel),
                this.isSel &&
                  ((0, g.gdpTrace)("clk", {
                    WT_markId: "10692",
                    WT_adverType: "122",
                    WT_event: "qwbh2203160021",
                  }),
                  (0, f.A9)(
                    {
                      adverType: "122",
                      markId: "10692",
                      eventCode: "qwbh2203160021",
                    },
                    this.userInfo
                  ));
            },
            GLogin() {
              (0, g.gdpTrace)("clk", {
                WT_markId: "10690",
                WT_adverType: "122",
                WT_event: "qwbh2203160019",
              }),
                (0, f.A9)(
                  {
                    adverType: "122",
                    markId: "10690",
                    eventCode: "qwbh2203160019",
                  },
                  this.userInfo
                ),
                this.isSel
                  ? (x.Z.show(),
                    leadeon4GLogin.gateWayLogin(
                      this.fourGSuccess,
                      window.location.href,
                      "formal",
                      this.fourGFail,
                      this.internetLogin,
                      this.fourGFail,
                      function () {
                        x.Z.clear(),
                          this.$toast("当前业务使用人数较多，请稍后再试。");
                      }
                    ))
                  : this.$toast("请同意服务隐私");
            },
            internetLogin() {
              x.Z.clear(),
                this.$toast("仅支持中国移动手机号码"),
                this.fourGFail();
            },
            fourGFail() {
              x.Z.clear(),
                (this.G4ShowPopup = !1),
                this.$toast("获取手机号失败，请使用验证码登录"),
                this.loginSuccess();
            },
            fourGSuccess() {
              if ((x.Z.clear(), (this.G4ShowPopup = !1), this.loginSuccess))
                try {
                  let e = (0, l.y0)((0, N.ej)("telNum"));
                  this.loginSuccess({ phoneNumber: e });
                } catch (e) {
                  this.fourGFail();
                }
            },
            smsLogin() {
              (0, g.gdpTrace)("clk", {
                WT_markId: "10691",
                WT_adverType: "122",
                WT_event: "qwbh2203160020",
              }),
                (0, f.A9)(
                  {
                    adverType: "122",
                    markId: "10691",
                    eventCode: "qwbh2203160020",
                  },
                  this.userInfo
                ),
                (this.G4ShowPopup = !1),
                o["default"]
                  .dispatch("login/login", { targetStrategyList: ["appSms"] })
                  .then((e) => {
                    this.loginSuccess && this.loginSuccess(e);
                  });
            },
            closePopup() {
              this.G4ShowPopup = !1;
            },
          },
        },
        W = M,
        R = (0, T.Z)(W, D, E, !1, null, "66fac897", null),
        O = R.exports;
      let U,
        F = {};
      function Z(e) {
        return document.body.contains(e);
      }
      function V() {
        U && U.$destroy();
        let e = d().extend(O);
        (U = new e({ store: o["default"] }).$mount()),
          document.body.appendChild(U.$el);
      }
      function Q() {
        return new Promise((e) => {
          let t = document.createElement("img"),
            a = new Date(),
            n = "http://app.10086.cn";
          (t.src = `${n}/biz-sso/autoLogin/gateWayLogincellNumShow?date=${a.getTime()}`),
            document.body.appendChild(t),
            (t.onload = () => {
              document.body.removeChild(t);
              let a = (0, N.ej)("cellNum");
              if (a)
                try {
                  (a = (0, l.y0)(a)), e(a);
                } catch (n) {
                  e("");
                }
              else e(a);
            }),
            (t.onerror = () => {
              document.body.removeChild(t);
              let a = (0, N.ej)("cellNum");
              if (a)
                try {
                  (a = (0, l.y0)(a)), e(a);
                } catch (n) {
                  e("");
                }
              else e(a);
            });
        });
      }
      async function Y(e) {
        if (o["default"].state.login.isTouch) return !1;
        if (window.leadeon4GLogin && window.leadeon4GLogin.gateWayLogin) {
          console.log("4G登录");
          let t = await Q();
          if (t && "99999999999" !== t) {
            let a = new Promise((a) => {
                (0, r.zp)(!1),
                  O.showDialog({
                    popupCloseable: e.popupCloseable,
                    popupDuration: e.popupDuration || "0",
                    phoneMask: t,
                    loginSuccess: (e) => {
                      a(e);
                    },
                  });
              }),
              n = await a;
            if (n) return o["default"].commit("setUserInfo", n), !0;
          }
        }
        return !1;
      }
      async function G() {
        if (o["default"].state.login.isTouch) return !1;
        let e = (0, N.ej)("telNum"),
          t = (0, N.ej)("is4GLogin"),
          a = (0, N.ej)("is_login"),
          n = "";
        if (e)
          try {
            e = (0, l.y0)((0, N.ej)("telNum"));
          } catch (r) {
            return !1;
          }
        let i = e;
        if (
          ((n = t ? "4GLogin" : a ? "ITSms" : "appSms"),
          i && "99999999999" !== i)
        ) {
          o["default"].commit("setUserInfo", {
            phoneNumber: i,
            loginStrategy: n,
          });
          let e = await (0, f.tv)(o["default"].state.userInfo, { cellNum: i }),
            { retCode: t, rspBody: a } = e;
          if ("000000" === t && Boolean(a)) {
            let { provinceCode: e, cityCode: t } = a;
            return (
              o["default"].commit("setUserInfo", {
                province: e,
                city: t,
                loginProvince: e,
                loginCity: t,
                loginStrategy: n,
              }),
              !0
            );
          }
        }
        return !1;
      }
      O.showDialog = function (e) {
        const t = e || {};
        (U && Z(U.$el)) || V(), Object.assign(U, F, t), U.show();
      };
      let j = { inApp: s, silent: G, bigNet: L, "4G": Y, appSms: k };
      var q = {
        namespaced: !0,
        state: {
          isLogin: !1,
          loginComplete: !1,
          isTouch: navigator.userAgent.indexOf("leadeon") > -1,
        },
        actions: {
          async login({ state: e, rootState: t, commit: a }, n = {}) {
            let { targetStrategyList: o = [] } = n;
            0 === o.length &&
              ((o = ["inApp", "silent", "bigNet", "4G", "appSms"]),
              "testh.app.coc.10086.cn" === location.host &&
                (o = o.filter((e) => "4G" !== e)));
            try {
              for (let a of o) {
                let o = j[a],
                  i = await o(n);
                if (i) {
                  (e.isLogin = !0),
                    (e.loginComplete = !0),
                    (t.userInfo.loginStrategy = a),
                    ("bigNet" !== a && "4G" !== a && "appSms" !== a) ||
                      (0, P.rG)();
                  break;
                }
              }
              if (!e.isLogin) throw new Error("登录失败");
              let {
                loginProvince: i,
                loginCity: r,
                phoneNumber: s,
              } = t.userInfo;
              if ("9999" === i || "0000" === r) {
                let e = await (0, f.tv)(t.userInfo, { cellNum: s }),
                  { retCode: n, rspBody: o } = e;
                if ("000000" === n && o) {
                  let { provinceCode: e, cityCode: t } = o;
                  a(
                    "setUserInfo",
                    { province: e, city: t, loginProvince: e, loginCity: t },
                    { root: !0 }
                  );
                }
              }
              return (
                (0, g.setGdpGeneralProps)(t.userInfo),
                window.__SKYNET &&
                  (window.__SKYNET.getUID = () => (0, l.ie)(s)),
                console.log("用户信息", t.userInfo),
                t.userInfo
              );
            } catch (i) {
              throw (console.log("登录出现异常", i), i);
            }
          },
        },
      };
    },
    90875: function (e, t, a) {
      "use strict";
      a(26699);
      var n = a(14034),
        o = a(2780),
        i = a(15222),
        r = a(15744),
        l = a(76507),
        s = a(72856),
        c = a(11671);
      const u = ["businessQuery"];
      t.Z = {
        namespaced: !0,
        state: {
          isMarketLoaded: !1,
          areaList: null,
          fixedArea: {},
          flexArea: [],
          tabArea: [],
          floatArea: null,
          topArea: null,
          bottomArea: null,
          adverListLoadState: "loadInit",
          reportLingXiData: {},
          hideTopAndMiddleArea: !1,
          latestMonthParams: {},
          latestTabParams: {},
        },
        getters: {
          marketConfig(e, t, a, n) {
            return r.Z[n.pageName];
          },
          isITDialTestPhoneNum(e, t, a) {
            var n;
            return (
              "1" ===
              (null === (n = a.remoteState) || void 0 === n
                ? void 0
                : n.CMCC_Check_IT_Dial_WhiteList_Result)
            );
          },
          pageInfoParams(e, t, a, n) {
            const { pageName: o, pageGroup: i } = n,
              { latestMonthParams: r, latestTabParams: l } = e;
            return {
              pageName: o,
              pageGroup: i,
              yearMonth: r,
              accountTab: l.accountTab,
              currentTab: l.currentTab,
            };
          },
        },
        mutations: {
          setAreaList(e, t) {
            e.areaList = t;
          },
          setFixedArea(e, t) {
            e.fixedArea = t;
          },
          setFlexArea(e, t) {
            e.flexArea = t;
          },
          setTabArea(e, t) {
            e.tabArea = t;
          },
          setFloatArea(e, t) {
            e.floatArea = t;
          },
          setTopArea(e, t) {
            e.topArea = t;
          },
          setBottomArea(e, t) {
            e.bottomArea = t;
          },
          setMarketLoaded(e, t) {
            e.isMarketLoaded = t;
          },
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
          setReportLingXiData(e, { dataName: t, data: a }) {
            e.reportLingXiData[t] = a;
          },
          setHideTopMiddleArea(e, t) {
            e.hideTopAndMiddleArea = t;
          },
          setMonthParams(e, t) {
            e.latestMonthParams = { ...e.latestMonthParams, ...t };
          },
          setTabParams(e, t) {
            e.latestTabParams = { ...e.latestTabParams, ...t };
          },
        },
        actions: {
          async getAdverList({ commit: e, getters: t, rootState: a }) {
            try {
              let o = {};
              if (a.login.isTouch && s["default"].hasModule("skin")) {
                let e = await s["default"].dispatch("skin/getUserGsmState");
                o = { userInfo: { gsmFlag: e } };
              }
              let r = await (0, l.EM)(() =>
                (0, n.Th)({
                  pageInfo: t.marketConfig.pageId,
                  externalChannel: a.login.isTouch
                    ? ""
                    : (0, i.eY)("channelId") || "",
                  ...o,
                })
              );
              "000000" === r.retCode
                ? (r.rspBody &&
                    r.rspBody.areaList &&
                    r.rspBody.areaList.length &&
                    (e("setAreaList", r.rspBody.areaList),
                    e("setLoadState", {
                      stateName: "adverListLoadState",
                      value: "loadCompleted",
                    })),
                  r.rspBody &&
                    (await s["default"].dispatch(
                      "skin/saveSkin",
                      r.rspBody.skinData
                    )))
                : e("setLoadState", {
                    stateName: "adverListLoadState",
                    value: "loadError",
                  });
            } catch (o) {
              e("setLoadState", {
                stateName: "adverListLoadState",
                value: "loadError",
              }),
                console.log("getAdverList error", o);
            }
          },
          async fetchMarketAreaData({
            commit: e,
            state: t,
            getters: a,
            dispatch: n,
            rootGetters: i,
            rootState: r,
          }) {
            try {
              if (a.isITDialTestPhoneNum)
                return (
                  e("setMarketLoaded", !0),
                  void e("setLoadState", {
                    stateName: "adverListLoadState",
                    value: "loadCompleted",
                  })
                );
              if (
                "main" === i.pageGroup &&
                ("phoneBills" === i.pageName || "balanceQuery" === i.pageName)
              ) {
                var l;
                const t =
                  "1" ===
                  (null === (l = r.remoteState) || void 0 === l
                    ? void 0
                    : l.CMCC_Check_IT_Top_Middle_Result);
                e("setHideTopMiddleArea", t);
              }
              if (
                (await n("getAdverList"), "loadError" === t.adverListLoadState)
              )
                return;
              let s = (0, o.dr)({
                areaList: t.areaList,
                ...a.marketConfig.areaId,
              });
              const c = await (0, o.m9)(
                s.flex,
                i.pageName,
                r.userInfo.phoneNumber
              );
              e("setFlexArea", c),
                e("setFixedArea", s.fixed),
                e("setTabArea", s.tab),
                e("setFloatArea", s.float),
                e("setTopArea", s.top),
                e("setBottomArea", s.bottom),
                e("setMarketLoaded", !0);
            } catch (s) {
              console.log("fetchMarketAreaData", s);
            }
          },
          syncMonthSelector2Market(
            { getters: e, commit: t, dispatch: a, rootGetters: n },
            o
          ) {
            return (
              (!u.includes(n.pageName) || !o.isReactive) &&
              (t("setMonthParams", o),
              console.log("syncMonthSelector2Market-----", o),
              (null === o || void 0 === o || !o.shouldNotEmit) &&
                void a("emitPageInfoChange"))
            );
          },
          syncTabSelector2Market({ commit: e, dispatch: t }, a) {
            if (
              (e("setTabParams", a),
              console.log("syncTabSelector2Market-----", a),
              null !== a && void 0 !== a && a.shouldNotEmit)
            )
              return !1;
            t("emitPageInfoChange");
          },
          emitPageInfoChange({ getters: e }) {
            const t = e.pageInfoParams;
            c.Z.$emit("onPageInfoChange", t),
              console.log("syncOnPageInfoChange-----", t);
          },
        },
      };
    },
    15744: function (e, t) {
      "use strict";
      t.Z = {
        marginQuery: {
          pageId: "1",
          areaId: {
            fixedId: ["20230510013"],
            tabID: "20230515014",
            topId: "20230510012",
            floatId: "20230515015",
            bottomId: "20230612004",
            serviceAreaId: "20240125004",
          },
        },
        myPackage: {
          pageId: "5",
          areaId: {
            fixedId: ["20230621024"],
            tabID: "20230621028",
            topId: "20230621018",
            floatId: "20230705008",
            bottomId: "20230705006",
          },
        },
        balanceQuery: {
          pageId: "6",
          areaId: {
            fixedId: ["20230721002"],
            tabID: "20230907002",
            topId: "20230613002",
            floatId: "20230719008",
            bottomId: "20230719010",
          },
        },
        detailQuery: {
          pageId: "3",
          areaId: {
            fixedId: ["20230802058"],
            tabID: "20230802062",
            topId: "20230802052",
            floatId: "20230802070",
            bottomId: "20230802068",
          },
        },
        phoneBills: {
          pageId: "2",
          areaId: {
            fixedId: ["20230515002", "20230515003"],
            topId: "20230515001",
            floatId: "20230515004",
            bottomId: "20230612002",
          },
        },
        businessQuery: {
          pageId: "4",
          areaId: {
            fixedId: ["20230621008"],
            tabID: "20230621012",
            topId: "20230621002",
            floatId: "20230705004",
            bottomId: "20230705002",
          },
        },
        myPackageLite: {
          pageId: "10",
          areaId: { fixedId: ["20250305004"], bottomId: "20250305008" },
          flexPointIds: ["P00000117712", "P00000117713", "P00000117714"],
        },
        scoreLite: {
          pageId: "12",
          areaId: { fixedId: ["20250305012"], bottomId: "20250305016" },
          flexPointIds: ["P00000117722"],
        },
        phoneBillsLite: {
          pageId: "8",
          areaId: { fixedId: ["20250305036"], bottomId: "20250305040" },
          flexPointIds: ["P00000117715", "P00000117716", "P00000117717"],
        },
        businessQueryLite: {
          pageId: "9",
          areaId: { fixedId: ["20250305020"], bottomId: "20250305024" },
          flexPointIds: ["P00000117720", "P00000117721"],
        },
        balanceQueryLite: {
          pageId: "11",
          areaId: { fixedId: ["20250305044"], bottomId: "20250305048" },
          flexPointIds: ["P00000117718", "P00000117719"],
        },
        marginQueryLite: {
          pageId: "7",
          areaId: { fixedId: ["20250305028"], bottomId: "20250305032" },
          flexPointIds: ["P00000117711"],
        },
        businessHandlingRecords: { pageId: "13", areaId: { fixedId: [] } },
      };
    },
    98126: function (e, t, a) {
      "use strict";
      a(2490), a(34514);
      var n = a(76507),
        o = a(14034),
        i = a(15744),
        r = a(55844),
        l = a(6648),
        s = a(15222),
        c = a(86842),
        u = a.n(c);
      t.Z = {
        namespaced: !0,
        state: { realTimePopupData: null, showRealTimePopup: !1 },
        getters: {
          marketConfig(e, t, a, n) {
            return i.Z[n.pageName];
          },
        },
        mutations: {
          setRealTimePopupData(e, t) {
            e.realTimePopupData = t;
          },
          setShowRealTimePopup(e, t) {
            e.showRealTimePopup = t;
          },
        },
        actions: {
          async getRealTimePopupData({
            state: e,
            commit: t,
            getters: a,
            rootState: i,
            rootGetters: c,
            dispatch: d,
          }) {
            try {
              if (i.login.isTouch && a.marketConfig) {
                var m, p;
                let { phoneNumber: e } = i.userInfo,
                  d = (0, r.Pu)(e);
                console.log("实时弹窗页面：", `${d}_${c.pageName}`);
                const h = await (0, l.ww)({
                    debug: !1,
                    key: `${d}_${c.pageName}_lastVisitDate`,
                  }),
                  f = (null === h || void 0 === h ? void 0 : h.value) || "";
                console.log("实时弹窗上次弹出时间", f);
                let g = 0,
                  v = 0;
                if ((0, s.bq)(f, "day")) {
                  const e = await (0, l.ww)({
                    debug: !1,
                    key: `${d}_${c.pageName}_dayPopupCount`,
                  });
                  console.log("实时弹窗每日已弹出次数", e),
                    (g =
                      Number(null === e || void 0 === e ? void 0 : e.value) ||
                      0);
                }
                if ((0, s.bq)(f, "week")) {
                  const e = await (0, l.ww)({
                    debug: !1,
                    key: `${d}_${c.pageName}_weekPopupCount`,
                  });
                  console.log("实时弹窗每周已弹出次数", e),
                    (v =
                      Number(null === e || void 0 === e ? void 0 : e.value) ||
                      0);
                }
                console.log("dayPopupCount,weekPopupCount", g, v);
                let A = await (0, n.EM)(() =>
                  (0, o.Th)({
                    pageInfo: a.marketConfig.pageId,
                    popupFlag: "1",
                    dayNum: g,
                    weekNum: v,
                  })
                );
                if (
                  "000000" === A.retCode &&
                  null !== (m = A.rspBody) &&
                  void 0 !== m &&
                  m.areaList &&
                  null !== (p = A.rspBody) &&
                  void 0 !== p &&
                  p.areaList.length
                ) {
                  const e = A.rspBody.areaList;
                  let a = [];
                  if (
                    (e.forEach((e) => {
                      var t;
                      (null === (t = e.moduleList) || void 0 === t
                        ? void 0
                        : t.length) > 0 &&
                        e.moduleList.forEach((t) => {
                          var n;
                          (null === (n = t.adverList) || void 0 === n
                            ? void 0
                            : n.length) > 0 &&
                            t.adverList.forEach((n) => {
                              let o = {
                                ...n,
                                areaId: e.areaId || "",
                                moduleId: t.moduleId || "",
                              };
                              n.leftBtn &&
                                n.rightBtn &&
                                n.popTxt &&
                                n.styleType &&
                                a.push(o);
                            });
                        });
                    }),
                    console.log("popData", a),
                    a.length > 0)
                  ) {
                    t("setRealTimePopupData", a[0]),
                      t("setShowRealTimePopup", !0);
                    const e = g + 1,
                      n = v + 1,
                      o = u()().format("YYYY-MM-DD");
                    console.log("实时弹窗更新次数和时间", e, n, o),
                      (0, l.kv)({
                        debug: !1,
                        key: `${d}_${c.pageName}_dayPopupCount`,
                        value: e.toString(),
                      }),
                      (0, l.kv)({
                        debug: !1,
                        key: `${d}_${c.pageName}_weekPopupCount`,
                        value: n.toString(),
                      }),
                      (0, l.kv)({
                        debug: !1,
                        key: `${d}_${c.pageName}_lastVisitDate`,
                        value: o.toString(),
                      });
                  }
                }
              }
            } catch (h) {
              console.log("实时弹窗getAdverList error", h);
            }
          },
        },
      };
    },
    26364: function (e, t, a) {
      "use strict";
      a(26699);
      var n = a(75150),
        o = a(15744),
        i = a(51327);
      async function r(e) {
        try {
          let t = await fetch(e);
          return await t.json();
        } catch (t) {
          return console.log("fetch Error:", t), null;
        }
      }
      t.Z = {
        namespaced: !0,
        state: {
          realBalanceFee: "",
          curFee: "",
          isError: !1,
          copyWriting: "",
          flexible1: null,
          flexible2: null,
          flexible3: null,
          flexible4: null,
          flexible5: null,
          flexible6: null,
          flexible7: null,
          flexible8: null,
          flexible9: null,
          flexible10: null,
          flexible11: null,
          flexible12: null,
          flexible13: null,
          flexible14: null,
          flexible15: null,
          flexible16: null,
          flexible17: null,
          flexible18: null,
          flexible19: null,
          flexible20: null,
          flexible21: null,
          flexible22: null,
          flexible23: null,
          saveUrl: "",
          defaultErrMsg:
            "查询遇到问题，请稍后再试，或联系10086查询。感谢您的理解与支持~",
          rulePopupNewData: null,
          isHarmonyOS: i.UB,
          rulePopupNewDataLoadState: "init",
          combineState: "personal",
        },
        getters: {
          billTipsPosition(e, t, a) {
            return ["100"].includes(a.userInfo.loginProvince)
              ? "card"
              : "detail";
          },
          marketConfig(e, t, a, n) {
            return o.Z[n.pageName];
          },
          billsCombineShowType(e, t, a) {
            if (a.remoteState.CMCC_PhoneBills_CombineType) {
              let e = JSON.parse(a.remoteState.CMCC_PhoneBills_CombineType);
              if (e && e[a.userInfo.loginProvince])
                return e[a.userInfo.loginProvince].showType;
            }
            return "0";
          },
          getSpeechDetailsTitle(e, t, a, n) {
            var o;
            const { billInfoAll: i, historyBillInfo: r } = a.billsData,
              l =
                "2" === t.billsCombineShowType && i
                  ? i.allRealValue || "--"
                  : r.realConsumeBill || "--",
              s =
                "2" === t.billsCombineShowType && i
                  ? i.allRaalPay || "--"
                  : r.realPayBill || "--";
            let c = "--";
            return (
              n["common/monthActiveIndex"] > 0
                ? ["250"].includes(a.userInfo.loginProvince) &&
                  "--" !== e.allThisMonthBill &&
                  (c = e.allThisMonthBill)
                : "--" !==
                    (null === (o = a.pageUseBalance.accountInformation) ||
                    void 0 === o
                      ? void 0
                      : o.monthBill) &&
                  (c = a.pageUseBalance.accountInformation.monthBill),
              console.log("本月共消费：" + l, "实际应付" + s, "当前余额" + c),
              "--" === l && "--" === s && "--" === c
                ? "账单明细如下"
                : "账单明细"
            );
          },
          businessDetailsPopupType(e, t, a) {
            if (a.remoteState.CMCC_PhoneBills_BusinessDetailsPopupType) {
              let e = JSON.parse(
                a.remoteState.CMCC_PhoneBills_BusinessDetailsPopupType
              );
              if (e && e[a.userInfo.loginProvince])
                return e[a.userInfo.loginProvince];
            }
            return { showType: "1" };
          },
          refundsText(e, t, a) {
            if (a.remoteState.CMCC_PhoneBills_RefundsText) {
              let e = JSON.parse(a.remoteState.CMCC_PhoneBills_RefundsText);
              var n;
              if (e && e[a.userInfo.loginProvince])
                return (
                  (null === (n = e[a.userInfo.loginProvince]) || void 0 === n
                    ? void 0
                    : n.text) || "活动返费"
                );
            }
            return "活动返费";
          },
          refundsPopupAmountTitle(e, t, a) {
            if (a.remoteState.CMCC_PhoneBills_RefundsPopupAmountTitle) {
              let e = JSON.parse(
                a.remoteState.CMCC_PhoneBills_RefundsPopupAmountTitle
              );
              var n;
              if (e && e[a.userInfo.loginProvince])
                return (
                  (null === (n = e[a.userInfo.loginProvince]) || void 0 === n
                    ? void 0
                    : n.text) || "本月使用返费"
                );
            }
            return "本月使用返费";
          },
        },
        mutations: {
          SET_RULE_POPUP_NEW_DATA_LOAD_STATE(e, t) {
            e.rulePopupNewDataLoadState = t;
          },
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
          SET_COPY_WRITING(e, t) {
            e.copyWriting = t;
          },
          SET_IS_ERROR(e, t) {
            e.isError = t;
          },
          setFlexible(e, { num: t, flexible: a }) {
            console.log(`flexible${t}`, a), (e[`flexible${t}`] = a);
          },
          SET_SAVE_URL(e, t) {
            e.saveUrl = t;
          },
          SET_RULE_POPUP_NEW_DATA(e, t) {
            e.rulePopupNewData = t;
          },
          SET_COMBINE_STATE(e, t) {
            e.combineState = t;
          },
        },
        actions: {
          injectFlexiblePoint({ dispatch: e }) {
            e("topPointDis"), e("flexPointDis");
          },
          topPointDis({
            state: e,
            getters: t,
            commit: a,
            dispatch: n,
            rootState: o,
            rootGetters: i,
          }) {
            o.login.isTouch &&
              o.market.topArea &&
              (a("setFlexible", {
                num: 1,
                flexible: o.market.topArea["P00000047842"],
              }),
              a("setFlexible", {
                num: 2,
                flexible: o.market.topArea["P00000047843"],
              }));
          },
          flexPointDis({ getters: e, commit: t, dispatch: a, rootState: n }) {
            let o = e.marketConfig.areaId;
            if (n.market.fixedArea && n.market.fixedArea[o.fixedId[0]]) {
              let e = n.market.fixedArea[o.fixedId[0]];
              t("setFlexible", { num: 3, flexible: e["P00000047848"] || null }),
                t("setFlexible", {
                  num: 4,
                  flexible: e["P00000047849"] || null,
                }),
                t("setFlexible", {
                  num: 5,
                  flexible: e["P00000050008"] || null,
                }),
                t("setFlexible", {
                  num: 6,
                  flexible: e["P00000047853"] || null,
                }),
                t("setFlexible", {
                  num: 9,
                  flexible: e["P00000058819"] || null,
                }),
                t("setFlexible", {
                  num: 11,
                  flexible: e["P00000067718"] || null,
                }),
                t("setFlexible", {
                  num: 14,
                  flexible: e["P00000067719"] || null,
                }),
                t("setFlexible", {
                  num: 15,
                  flexible: e["P00000110985"] || null,
                }),
                a("getRulePopupNewData", e["P00000067718"]);
            } else t("SET_RULE_POPUP_NEW_DATA_LOAD_STATE", "loadCompleted");
            if (n.market.fixedArea && n.market.fixedArea[o.fixedId[1]]) {
              let e = n.market.fixedArea[o.fixedId[1]];
              t("setFlexible", { num: 7, flexible: e["P00000050009"] || null }),
                t("setFlexible", {
                  num: 8,
                  flexible: e["P00000050010"] || null,
                }),
                t("setFlexible", {
                  num: 10,
                  flexible: e["P00000062121"] || null,
                }),
                t("setFlexible", {
                  num: 12,
                  flexible: e["P00000069496"] || null,
                }),
                t("setFlexible", {
                  num: 13,
                  flexible: e["P00000081698"] || null,
                }),
                t("setFlexible", {
                  num: 16,
                  flexible: e["P00000145612"] || null,
                }),
                t("setFlexible", {
                  num: 17,
                  flexible: e["P00000146952"] || null,
                }),
                t("setFlexible", {
                  num: 18,
                  flexible: e["P00000146953"] || null,
                }),
                t("setFlexible", {
                  num: 19,
                  flexible: e["P00000146954"] || null,
                }),
                t("setFlexible", {
                  num: 20,
                  flexible: e["P00000146955"] || null,
                }),
                t("setFlexible", {
                  num: 21,
                  flexible: e["P00000146956"] || null,
                }),
                t("setFlexible", {
                  num: 22,
                  flexible: e["P00000146957"] || null,
                }),
                t("setFlexible", {
                  num: 23,
                  flexible: e["P00000146958"] || null,
                }),
                console.log(n, "9999");
            }
          },
          getRulePopupNewData({ state: e, commit: t, rootState: a }, o) {
            if (o && o.vUpload) {
              let a = o.vUpload;
              console.log("resource:", a);
              try {
                e.rulePopupNewData
                  ? t("SET_RULE_POPUP_NEW_DATA_LOAD_STATE", "loadCompleted")
                  : (0, n.Z)("RulesPopupNew", () => r(a)).then((e) => {
                      console.log("规则数据", e),
                        e && e.v1
                          ? t("SET_RULE_POPUP_NEW_DATA", e.v1)
                          : t("SET_RULE_POPUP_NEW_DATA", e),
                        t(
                          "SET_RULE_POPUP_NEW_DATA_LOAD_STATE",
                          "loadCompleted"
                        );
                    });
              } catch (i) {
                t("SET_RULE_POPUP_NEW_DATA_LOAD_STATE", "loadCompleted"),
                  console.log(i);
              }
            } else t("SET_RULE_POPUP_NEW_DATA_LOAD_STATE", "loadCompleted");
          },
        },
      };
    },
    25381: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return q;
        },
      });
      a(20726);
      var n = a(10521),
        o = a(76507),
        i = a(89629),
        r = a(59305),
        l = a(6648),
        s = a(83587),
        c = (a(26699), a(2490), a(9924), a(72608), a(47467)),
        u = a.n(c),
        d = a(15222),
        m = a(81839),
        p = a(51327);
      (function (e, t) {
        const a = e();
        function n(e, t) {
          return w(e - -735, t);
        }
        function o(e, t) {
          return w(e - 270, t);
        }
        while (1)
          try {
            const e =
              (-parseInt(n(-506, "$Y[D")) / 1) *
                (-parseInt(n(-559, "sAB6")) / 2) +
              (parseInt(n(-550, "m9$U")) / 3) * (parseInt(o(475, "tead")) / 4) +
              parseInt(o(502, "L#Cj")) / 5 +
              (-parseInt(o(481, "Y7T(")) / 6) *
                (-parseInt(o(440, "QSCf")) / 7) +
              -parseInt(o(511, "t^wY")) / 8 +
              parseInt(n(-560, "4WQi")) / 9 +
              -parseInt(n(-545, "xrFd")) / 10;
            if (e === t) break;
            a["push"](a["shift"]());
          } catch (i) {
            a["push"](a["shift"]());
          }
      })(v, 261161);
      const h = (function () {
          const e = {
            ERfcw: n(-769, "bmsr"),
            QwXKO: t(-491, "HB4L"),
            rOGKf: function (e, t) {
              return e < t;
            },
            XPkBa: function (e, t, a) {
              return e(t, a);
            },
            MxNNt: function (e, t) {
              return e !== t;
            },
            Fwcoc: "DilTU",
            WKiFt: "kGsem",
          };
          function t(e, t) {
            return w(e - -705, t);
          }
          let a = !0;
          function n(e, t) {
            return w(e - -985, t);
          }
          return function (n, o) {
            function i(e, a) {
              return t(e - 233, a);
            }
            function r(e, a) {
              return t(a - 506, e);
            }
            const l = {
              juWpf: function (t, a) {
                return e["rOGKf"](t, a);
              },
              lXPet: function (t, a, n) {
                return e["XPkBa"](t, a, n);
              },
            };
            if (e["MxNNt"](e[r("[R2G", -18)], e[i(-301, "xrFd")])) {
              const t = a
                ? function () {
                    const t = {};
                    t[s("pXiv", 981)] = e[s("t^wY", 955)];
                    const a = t;
                    function l(e, t) {
                      return r(t, e - -255);
                    }
                    function s(e, t) {
                      return i(t - 1260, e);
                    }
                    if (o) {
                      if ("cdCar" !== e[s("Zs20", 1026)]) {
                        const e = _0x532561(_0x523424),
                          t = _0x417a0a[l(-256, "m9$U")](_0x43b825, e, {
                            iv: new _0x4b886b()["encode"](_0x1737bb),
                            mode: a["rqOAT"],
                          });
                        return t;
                      }
                      {
                        const e = o[l(-235, "HcRw")](n, arguments);
                        return (o = null), e;
                      }
                    }
                  }
                : function () {};
              return (a = !1), t;
            }
            {
              const e = [];
              for (
                let t = 0;
                l[i(-281, "4)O1")](t, _0x4b1ce7[i(-275, "Tx79")]);
                t += 2
              )
                e[i(-250, "J8Xq")](
                  l[i(-255, "sQMc")](
                    _0x42dd08,
                    _0x413e69[r("HB4L", -20)](t, t + 2),
                    16
                  )
                );
              return new _0x2a4efb(e);
            }
          };
        })(),
        f = h(void 0, function () {
          function e(e, t) {
            return w(t - 663, e);
          }
          function t(e, t) {
            return w(e - -300, t);
          }
          return f[e("t^wY", 841)]()
            [e("Tx79", 832)](t(-92, "L#Cj") + "+$")
            [e("4)O1", 858)]()
            [e("HcRw", 836) + "r"](f)
            [t(-123, "U3^k")](e("Zs20", 891) + "+$");
        });
      function g(e, t) {
        return w(e - -629, t);
      }
      function v() {
        const e = [
          "W7ddV8oN",
          "zSoKDKu",
          "rSkUqmotWPmSWPfmW6jw",
          "WPNdPsmkW6buW5NdJG",
          "f8kVW4JcQKa/",
          "pu0AW4CqWOGek09/",
          "sthcIxVcO8oCWQTUcmkdW7GEWRO",
          "W4pdGmomW50XW5RcU8kNWQFcJG",
          "WQxcI3qoWP4",
          "b8kIbJOE",
          "amkYW6ddT8oX",
          "W7hdUmk3ff4mqtxdTCoD",
          "p8oXmmk2W7C",
          "FMPSi8owWQbEqKLEaNnaW5u",
          "kmo/y8kUf8kfWO42ifC",
          "W77cV8oABbb+W4DkWOxdHmovwha",
          "h2hcQCkYW5ayW4OsW5ddIgWNsq",
          "EaWuW5S",
          "W43dPLjUWOyfWP7dQbCu",
          "W5XIrMNcGCozf28hW7i",
          "kSkCW7ZcHwPxzXdcImoz",
          "itebWR8/WO4RWPJdK8ov",
          "WRFcKCoxc8oHDxRdUCkEW7a",
          "kgpdQJCZW5pcUMjuvComFWC",
          "WRXtmCoKWPFdVJf/g1q",
          "vSoeW60ecColWQ8dWPJcRa",
          "pqObWP5mW5i3WOhdR8kR",
          "umoQW7VcOeCKaSoFeCka",
          "W7bGW4xcUYFcP8o3W443W4G",
          "ofHtWPyAW5LIWRpcHCoVq8obW40",
          "zYZdLCkooSkijmkLyZC",
          "amkiW5ldSvJdPKndgCkP",
          "WP7dOavQWOKkWPFdRHqt",
          "l27dO2yWWOBdRbjQja",
          "WOJdMmkoo1u",
          "hgZdKJZdRSkBW6O",
          "pdW5yCknW78",
          "WO06hYVdT8kfqeSCW6PDW5DR",
          "W7axW4tcJCoJ",
          "W6pdVmoGFHHDuxq",
          "WQ1RjSk7WPWhFWhdPxq",
          "WOpdTxRdG8ofWQngFSocW6i",
          "FepdS8kHeSkyW5aUiXldPcJdRW",
          "W69Dn8oLWPJcNZyBmI/cHW",
          "WP1fWOCvwZe",
          "WRNdPCk7lfaNWPf4",
          "oCkNACo5qa",
          "v8oEaNm7ohG1Agy",
          "DmokWOFcRqi",
          "bCkYW6q",
          "WR0aD8k4W4lcPYmKgGG",
          "W4dcKCooW5O2WO3dQ8o8W7xcHG",
          "WQm9WPhcVcldS8oDW6n2WPdcL3e",
          "a8kmv3nQAc41yZe",
          "Ft/dPZe1W5pcV0LOkW",
          "oCkaW4NcIKC",
          "u8k9WQdcOHaGa8klq8oB",
          "WPzVWPNdU8kVWRqoW4JcGmknoMiCuq",
          "W6ZdM0f/yq",
          "eCoYWPRdTujOW6TwWPxcLq",
          "omk+B8oNaa",
          "kmkGlcG",
          "W7ldGuv7DrNcVJm",
          "W6FcNCoxwSoGjxlcQmooWQi",
          "iZW2DmkAW78",
          "W7DQW4xdUM7cTmoI",
          "Bu4BW4qxWOajkKKS",
          "WRT5kHX2EGyDbgq",
          "WPzSW4VdV8oZWROeW4ddUSkj",
          "W7xdKCksua",
          "W7RdQCoFybf3WPWPWP/dSW",
          "oIOgW6n9WQW0",
          "b8kceIHynx48",
          "W6lcKd5ZWQGht8oNl8kh",
          "mmo6zSklhCk2W7rQF8k4",
          "uchcMwdcVmocWRupECoJ",
          "imkxWRVcJG5FzuK",
          "W7pcT8k7vmk4y8oeW4P7W4G",
          "WQiUWPBdHmkZW4mA",
          "Fmo2gmkrzSkZdNJdG8kR",
          "WQq8WPdcSchcK8oZW7PcWRdcNa",
          "kCkVq8o7vW",
          "irajuCkL",
          "BWSe",
          "prhdO8kpEa",
          "W4pcNmohWOWZWOZcUSkNWQddNW",
          "WQ90omkKWPe",
          "u8oCW5FcOftcSu4remkU",
          "W4u/WPVcQSkNWRmaW4hdSSko",
          "qWlcP8k0",
          "vSoyW5FdULFcS09demo9",
          "W4mZW6JcPCo0W7fpWOJcTW",
          "WOzOrIRdUSkprdiLWRy",
        ];
        return (
          (v = function () {
            return e;
          }),
          v()
        );
      }
      function A(e, t) {
        return w(e - 737, t);
      }
      f();
      const y = {};
      (y[A(920, "sAB6") + "t"] =
        "04e3bab506" +
        A(981, "$Y[D") +
        g(-429, "V$#M") +
        g(-463, "^l^#") +
        A(898, "m9$U") +
        "18ab455a41" +
        g(-471, "ci(R") +
        "d267b4ed20" +
        A(940, "t^wY") +
        A(926, "Y28U") +
        "de38604e82" +
        A(901, "[R2G") +
        "be3920b5f7"),
        (y[A(980, "bmsr")] =
          "04e3bab506e051761bff" +
          g(-419, "CxAu") +
          g(-445, "#[qk") +
          A(917, "tead") +
          "18ab455a41" +
          g(-409, "[R2G") +
          "d267b4ed207c7839c6bc" +
          g(-398, "QlCZ") +
          g(-406, "[R2G") +
          g(-474, "FL5c") +
          g(-392, "s3Kg")),
        (y[A(931, "2]%L")] =
          "04bc7443e9" +
          g(-430, "QlCZ") +
          A(897, "Y28U") +
          A(933, "FL5c") +
          g(-396, "#[qk") +
          A(911, "nSIh") +
          A(977, "HB4L") +
          A(924, "^l^#") +
          g(-472, "sAB6") +
          A(958, "xrFd") +
          g(-422, "tr4X") +
          g(-428, "xrFd") +
          g(-411, "#[qk")),
        (y[g(-402, "z1n#")] =
          g(-475, "9[yf") +
          g(-476, "yAG#") +
          A(943, "Xc2J") +
          A(962, "QSCf") +
          A(900, "sQMc") +
          "0fd8edf44d" +
          g(-443, "tead") +
          A(949, "pXiv") +
          g(-464, "$Y[D") +
          g(-437, "4)sh") +
          A(896, "bmsr") +
          "0513d291be75159c2d74");
      let T = y[p.Xr || "prod"];
      function S(e) {
        const t = {
          djTPx: function (e, t, a) {
            return e(t, a);
          },
          nIQBK: function (e, t) {
            return e + t;
          },
        };
        function a(e, t) {
          return g(t - -124, e);
        }
        const n = [];
        for (let o = 0; o < e["length"]; o += 2)
          n[a("FL5c", -551)](
            t["djTPx"](
              parseInt,
              e[a("HB4L", -574)](o, t[a("Tx79", -538)](o, 2)),
              16
            )
          );
        return new Uint8Array(n);
      }
      function I(e) {
        function t(e, t) {
          return A(t - -488, e);
        }
        let a = "";
        for (let n = 0; n < e["length"]; n++)
          a += e[t("QSCf", 494)](n)
            ["toString"](16)
            [t("s3Kg", 421)](2, "0")
            ["toLowerCase"]();
        return a;
      }
      function b(e) {
        const t = 1,
          a = m.sm2[n(-426, "xrFd")](e, T, t);
        function n(e, t) {
          return A(e - -1387, t);
        }
        return "04" + a;
      }
      function C(e, t, a) {
        const n = {
          HpKkJ: function (e, t) {
            return e(t);
          },
          fbgSP: o(-146, "7dtl"),
        };
        function o(e, t) {
          return g(e - 301, t);
        }
        function i(e, t) {
          return A(t - -1129, e);
        }
        const r = n[o(-93, "2]%L")](S, t),
          l = m.sm4["encrypt"](e, r, {
            iv: new TextEncoder()["encode"](a),
            mode: n[i("7dtl", -156)],
          });
        return l;
      }
      function w(e, t) {
        e -= 153;
        const a = v();
        let n = a[e];
        if (void 0 === w["iYABOy"]) {
          var o = function (e) {
            const t =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
            let a = "",
              n = "",
              i = a + o;
            for (
              let o, r, l = 0, s = 0;
              (r = e["charAt"](s++));
              ~r && ((o = l % 4 ? 64 * o + r : r), l++ % 4)
                ? (a +=
                    i["charCodeAt"](s + 10) - 10 !== 0
                      ? String["fromCharCode"](255 & (o >> ((-2 * l) & 6)))
                      : l)
                : 0
            )
              r = t["indexOf"](r);
            for (let o = 0, r = a["length"]; o < r; o++)
              n +=
                "%" + ("00" + a["charCodeAt"](o)["toString"](16))["slice"](-2);
            return decodeURIComponent(n);
          };
          const e = function (e, t) {
            let a,
              n,
              i = [],
              r = 0,
              l = "";
            for (e = o(e), n = 0; n < 256; n++) i[n] = n;
            for (n = 0; n < 256; n++)
              (r = (r + i[n] + t["charCodeAt"](n % t["length"])) % 256),
                (a = i[n]),
                (i[n] = i[r]),
                (i[r] = a);
            (n = 0), (r = 0);
            for (let o = 0; o < e["length"]; o++)
              (n = (n + 1) % 256),
                (r = (r + i[n]) % 256),
                (a = i[n]),
                (i[n] = i[r]),
                (i[r] = a),
                (l += String["fromCharCode"](
                  e["charCodeAt"](o) ^ i[(i[n] + i[r]) % 256]
                ));
            return l;
          };
          (w["aTHvjc"] = e), (w["iYBzQC"] = {}), (w["iYABOy"] = !0);
        }
        const i = a[0],
          r = e + i,
          l = w["iYBzQC"][r];
        if (l) n = l;
        else {
          if (void 0 === w["DCBxPQ"]) {
            const e = function (e) {
              (this["gYIBZT"] = e),
                (this["ZXNTvz"] = [1, 0, 0]),
                (this["yCNdsN"] = function () {
                  return "newState";
                }),
                (this["CZfakP"] = "\\w+ *\\(\\) *{\\w+ *"),
                (this["EbkKsF"] = "['|\"].+['|\"];? *}");
            };
            (e["prototype"]["MVWTyT"] = function () {
              const e = new RegExp(this["CZfakP"] + this["EbkKsF"]),
                t = e["test"](this["yCNdsN"]["toString"]())
                  ? --this["ZXNTvz"][1]
                  : --this["ZXNTvz"][0];
              return this["dUkbqk"](t);
            }),
              (e["prototype"]["dUkbqk"] = function (e) {
                return Boolean(~e) ? this["wvBZQd"](this["gYIBZT"]) : e;
              }),
              (e["prototype"]["wvBZQd"] = function (e) {
                for (let t = 0, a = this["ZXNTvz"]["length"]; t < a; t++)
                  this["ZXNTvz"]["push"](Math["round"](Math["random"]())),
                    (a = this["ZXNTvz"]["length"]);
                return e(this["ZXNTvz"][0]);
              }),
              new e(w)["MVWTyT"](),
              (w["DCBxPQ"] = !0);
          }
          (n = w["aTHvjc"](n, t)), (w["iYBzQC"][r] = n);
        }
        return n;
      }
      function _(e, t, a) {
        function n(e, t) {
          return A(e - -45, t);
        }
        const o = {
            oowwU: function (e, t) {
              return e(t);
            },
            KAbOc: l("s3Kg", 207),
          },
          i = o["oowwU"](S, t),
          r = m.sm4[l("L#Cj", 149)](e, i, {
            iv: new TextEncoder()[n(922, "4)sh")](a),
            mode: o[l("4)sh", 169)],
          });
        function l(e, t) {
          return A(t - -756, e);
        }
        return r;
      }
      function k(e) {
        function t(e, t) {
          return A(e - -194, t);
        }
        const a = {
          ossHO: function (e, t) {
            return e(t);
          },
        };
        return a[t(777, "zAuW")](m.sm3, e);
      }
      var N = a(75150),
        P = a(72856);
      (function (e, t) {
        function a(e, t) {
          return M(t - -690, e);
        }
        const n = e();
        function o(e, t) {
          return M(e - 459, t);
        }
        while (1)
          try {
            const e =
              (parseInt(o(1047, "mwN&")) / 1) *
                (-parseInt(o(1028, "uOh@")) / 2) +
              parseInt(o(985, "s%Ex")) / 3 +
              parseInt(a("IF)J", -56)) / 4 +
              parseInt(a("$nBR", -138)) / 5 +
              (parseInt(o(1252, "^GDW")) / 6) * (parseInt(o(968, "@VvA")) / 7) +
              (parseInt(a("OY^q", -25)) / 8) * (parseInt(o(1110, "7jtg")) / 9) +
              (parseInt(o(1249, "2QjQ")) / 10) *
                (-parseInt(a("#JUI", -222)) / 11);
            if (e === t) break;
            n["push"](n["shift"]());
          } catch (i) {
            n["push"](n["shift"]());
          }
      })(D, 926780);
      const B = (function () {
          function e(e, t) {
            return M(e - -619, t);
          }
          const t = {
            yKgVW: e(-89, "9DDq") + e(64, "eF0M") + "rse error",
            jIElU: a("iHsh", 774),
            OFlYv: a("r^sk", 867) + a("qIj*", 762),
            gFwZi: function (e, t, a) {
              return e(t, a);
            },
            HAgEO: e(143, "mwN&"),
            xXJQo: function (e, t) {
              return e === t;
            },
            aiLNI: a("]f1V", 965),
            aToJa: function (e, t) {
              return e !== t;
            },
            Frive: e(81, "$nBR"),
          };
          function a(e, t) {
            return M(t - 181, e);
          }
          let n = !0;
          return function (e, o) {
            function i(e, t) {
              return a(t, e - 662);
            }
            function r(e, t) {
              return a(e, t - 114);
            }
            const l = {
              nNgeO: function (e, a, n) {
                function o(e, t) {
                  return M(e - -140, t);
                }
                return t[o(577, "ndrD")](e, a, n);
              },
              GjWgE: function (e, t) {
                return e === t;
              },
              TUzHd: t[i(1335, "ndrD")],
              RqcVh: function (e, a) {
                return t["xXJQo"](e, a);
              },
              OEOPv: t[i(1519, "r^sk")],
            };
            if (t[i(1539, "UuzF")](t[i(1353, "ndrD")], i(1498, "qIj*"))) {
              _0x151cd6["log"](t[i(1370, "9DDq")], _0x597193);
              const e = {};
              return (
                (e["retCode"] = t[r("#JUI", 979)]),
                (e[r("VuZk", 811)] = t[i(1591, "p%DO")]),
                e
              );
            }
            {
              const t = n
                ? function () {
                    const t = {
                      UPqaq: function (e, t, a) {
                        function n(e, t) {
                          return M(t - -65, e);
                        }
                        return l[n("UuzF", 714)](e, t, a);
                      },
                    };
                    function a(e, t) {
                      return r(e, t - -726);
                    }
                    function n(e, t) {
                      return r(t, e - 547);
                    }
                    if (
                      l[a("e6ek", 188)](l[n(1596, "muGm")], l[n(1512, "gazf")])
                    ) {
                      if (o) {
                        if (
                          l[a("EWp]", 360)](
                            l[n(1444, "OY^q")],
                            l[a("$nBR", 227)]
                          )
                        ) {
                          const t = o[n(1586, "@^#U")](e, arguments);
                          return (o = null), t;
                        }
                        _0x221544[_0x32c8e4] = _0x12520d;
                      }
                    } else
                      (_0x1fb672["sm4Key"] = _0x2dc32e(
                        t[n(1560, "e6ek")](_0x599da1, 16, !0)
                      )),
                        (_0x1de08b[n(1341, "OUbR")] = _0xff45fc(16, !0));
                  }
                : function () {};
              return (n = !1), t;
            }
          };
        })(),
        L = B(void 0, function () {
          function e(e, t) {
            return M(e - 828, t);
          }
          const t = {};
          function a(e, t) {
            return M(e - -402, t);
          }
          t[e(1302, "3IkE")] = a(318, "]@n7") + "+$";
          const n = t;
          return L["toString"]()
            [a(242, "OUbR")](n["GkNFB"])
            [a(148, "ingZ")]()
            [e(1309, "LqYl") + "r"](L)
            [e(1325, "As(v")](a(397, "OUbR") + "+$");
        });
      function D() {
        const e = [
          "mmoFW6TlWOuKaJb1",
          "vKDlrZhcKGddSW",
          "WPZdUCk9yrPaW6pdImoGEW",
          "WODfcbtdPa",
          "FMVdPCkRWRBdNWZdQYhcVW",
          "W6LHW6yUgvr7W7/dQHm",
          "lhtcMmkaW7y",
          "WRpdQYJcPNu",
          "WPX0t8k6iCoxWQ88",
          "WQ1+vSkuk8oDWR4",
          "aSoIdmk0",
          "kmkPobJcOq",
          "vCk1sCoJjvWgWRVcTMu",
          "WRyMW7v0sqO",
          "W6Dxn8kX",
          "WPddUaFdLmkwFXtdKmoYra",
          "WP9HjaRdGa",
          "WRRcVCkcWOCDWO/dPq",
          "W5FcHCoaWPhcHapcGG",
          "W57cO2LEbNpcMIJdQSkS",
          "W4XGWPGLi1CKvN/dKq",
          "iSkDfq3cPW",
          "W5FcKxa",
          "l8kkdttcNSkUmHucW7K",
          "5ysZ6k+qW4O",
          "W6/cQSk/n2xdSW",
          "v8o1W5H4fJbdyGju",
          "W4pcQJmmW5m",
          "W6K7CSk3ztaLlMXO",
          "W7/cVdahW7K",
          "CConW7edWPu5jW",
          "uvj4WQPFW70wWObi",
          "W65ZWRy",
          "WP1MWOFcQG0",
          "ExbkyH4",
          "W6CLWR7dOsS",
          "W4FcNCouW6uSWQ0",
          "cSkYBmkPWPm",
          "5ywG6kY+W6q",
          "dmoSeCk7",
          "5yEg6k+cW7a",
          "WQ8wW4HVW6e",
          "BSoFsCo4aa",
          "iYOEWPn7",
          "WP3dLSkiWR1HW7e",
          "W5exsCkpua",
          "dr8BgxddH1tcSmkDW7tcKZFcRCkP",
          "WO1wWQvkhL1N",
          "WOpdPLdcMK3cVSkjrsL/W4pdJga",
          "WORdQqFdP8oxAba",
          "W5WztmoTnvJcMSkzW5VcGW",
          "W7bBD8kzWR0",
          "j3JcTG",
          "W60IASk2uG",
          "6k2m5Rk/5PAh5Rkt5y2d55ko77+l6k+y56Q65zgX",
          "W5WiwCo5Ce/cMW",
          "WQ0EhSoT",
          "WRJcRSoxW6fp",
          "5ys16k6AwG",
          "WPVcVCkbWPGvWOpdRSoaWRpcMW",
          "WPNcGSkOWQNcJHNcT8kXW70",
          "WRVcVCkg",
          "E8kBW4DJWOK",
          "W7i3uSo0xq",
          "WRddOb3dICoB",
          "5yAW6k2tW5K",
          "W73dQ8osimo3rCo9",
          "WQ94WQtcSXO",
          "aCoyW68+WQO",
          "W6vcW4uFWQ7dNG",
          "W7VdP8olbSo3vmoS",
          "WQ4PjSoddW",
          "E8o1sCoVf8k8W6zzWOBdJG",
          "W6RcThz1FG",
          "kCodkfmH",
          "t8oJWPv/aZT0EGzU",
          "W4NcQmkbigS",
          "WO/dI1r1WQFcUmo3qSoreXRcRmoK",
          "W6/dPmoTpmoT",
          "WQtdJ8kmCszTW4K",
          "WRLxzCkLeW",
          "nCooW7GsWPu",
          "WQHmu8kXpa",
          "W7hcOSoDWQlcGq",
          "W48bWRNdScSiW5m",
          "h8oahCkHdW",
          "WRJdVSkloCkOtmk6W655",
          "ArldJSkCFam",
          "W7zmdmk3WOG",
          "W43dLCo7WQFcNYBcL8kP",
          "WOXzWQvz",
          "W70CiSk8WQ4",
          "W77dThncrG",
          "WOldJqxcOfBcGgq",
          "W65nW48qWQxdKM5QgSk8udmU",
          "WQlcQ8osWOmDWOldPmo/WRpcQa",
          "W6/cV8kIjcJdTCkJWRqZW5S",
          "WPhdQ8oYFZRcPJJdKCokzW",
          "W7bCWQiuja",
          "WPiFlI7cRIxcLSkhCSoQ",
          "WP7dQIhdNCon",
          "WOFcNCk9WRSk",
          "W7jikmk9eWecFW",
          "W4GdC8kAtW",
          "WOLCWRrkba",
          "bGnlCCkb",
          "WOTvWRjBnvDWW5e",
          "WQ8sWPTi",
          "WQyer8k1ycmL",
          "W6ZdVmkcWOOoWO3dRCoGW6S",
          "W5tcMcBdTcO",
          "WQRdIwNcPdn8",
          "j3JcSSk2W7hdILldUq",
          "WO3dSsFcPZi",
          "W5VdN8kWFG",
          "WP0voq",
          "W6b/WQuLoLv7W6O",
          "W7hdVhX0yJBdJG",
          "WQDRp8oMh3S",
          "WPNdPt/dQSoX",
          "o8krxCkEWRpdTa",
          "WOioldpcRZddN8kuEa",
          "daK8WPrz",
          "WQVdGsZcMJn2bW",
          "uwDowXu",
          "WRddNmoWBcO",
          "W508c8kAWPH8FahdUCo+",
          "W6LBWOmQlq",
          "W6RdV3v7fW",
          "5PAi5O+I6kAq5PY05B665BI077256k2b56QA5zgK",
          "WROMW7v/sGKVW4NdJaRcTg7dMW",
          "WPFdOqpcKMq",
          "uCkMW6LIWPy",
          "gCoRe1ScAta",
          "WP/dQqtcKfVcUMLpWRpcOG",
          "Fmowgmodbq",
          "maLmqq",
          "WRJdHCkwusW0",
          "W4hcGCoaWRm",
          "lCk7eGRcKa",
          "WRHHeXRdTNpcTq",
          "W4hdSK5uyG",
          "WQtdJ8kjCczTW5u",
          "WOBcGCk7WQOu",
          "W5RcRupdHbVdO8oDBqrN",
          "W5tdKSo8W7xdHfq",
          "dSo3dmkLy3yjWPVcLX4",
          "fZnfDG",
          "WQtcNSojW612",
          "W6FcN15Qpa",
          "W5BcJCkaWPVcNq",
          "WQSxfslcGa",
          "b8oHbW",
          "W7hdJLvEsG",
          "W68/i8k7WO8",
          "W4ldPCksqWtdUHlcUaHL",
          "W5Gcx8o0EW",
          "W5PcuSoUELpdK8olW5FcMq",
          "bqCrWPn+",
          "WOrxWRzrgrD4W4FdH8kr",
          "W7JcJCk6dge",
          "ACkHW6fLWR0",
          "l03cGCkOWOtdQG",
          "j8ktbmkKwmozWQixW4tcIq",
          "W4S/f8kCWOi",
          "WQXKnCoPfhDZm0rHW5BdNYG",
          "xSoJWOHKgcWhFajR",
          "W73dQ8oClSo9rmoaW5y",
          "nL/cP8kMWPZdUIm",
          "W7FdTMO",
          "W4NcMbmfW7VdRmkI",
          "W7RdP8ol",
          "WRRcVCkgWQ8zWP/dOW",
          "W5pdMvyV",
          "WQ3dJt7cHdnXoKddIW",
          "hSopW4OXWPS",
          "fqFdVmkWW68",
          "W6z8WRi0ev9S",
          "xLLyrY3cLqtdTmkaW70",
          "arTFCu1xg8o8qmkm",
          "W5RcRupdHbVdO8oDBqrO",
          "W5xdUxv8",
          "W5/cUwLlj3hcMt3cVSkX",
          "l8o9W6ONWPi",
          "WQjQWOzDfG",
          "EvbcwYG",
          "W5GcxW",
          "W5uDsmoXBa",
          "W5VcK01cna",
          "mSoUpmkLja",
          "W7bMWRqVfL12W7xdTG",
          "W7iIWQhdRtG",
          "WOVdPYxcPIm",
          "WOH+sCogW4i6lXBcSCkM",
          "WRZdIINcNt9Gaa",
          "W4KShZdcHZBdKW",
          "W4ldQLLkha",
          "p8oBgNWk",
          "W61kWO9TW7RcLcXh",
          "zSkDW6btWRG",
          "WOjlW7fqfLzWW4tdHCk2",
          "W7xdPhnMdmoO",
          "5PEj5O6q6kEK5P+V5B6Q5BQb772c6k+N56QJ5zcY",
          "rCoxWRvgoG",
          "oYP3r2u",
          "kYa/WQTH",
          "WPFdJqBdKmoqrrVdGSoYga",
          "WR0wcCoNlKNcSNy",
          "sSkuW6iPWRKYW6CZtW",
          "WQisfbxcPW",
          "WOXdWPBcKW",
          "WP3dRchcIfi",
          "WO1uaCkKlaq",
          "WPqjlJxcRYtdK8osCCoU",
          "WROwdCoI",
          "W4tcNuddKaxdGJDFWPNcNCkzpCkt",
          "W73dJConjSo3",
          "W7mZCSk8tG",
          "DXBdM8knDW",
          "nmoFW6KkWPePdG",
          "W5tcPmkdjuq",
          "W7lcJSkmwYrSW5/dSSoiuG",
          "iSkHgIxcVG",
          "WRSmd8kSlK/cIv3cNW",
          "WONdUCoJBHS",
          "W5JcHXldIbq",
          "W5FcPw5lis/cItNcRmoZ",
          "dCksDmkPWOi",
          "WQ/cV8oYW49A",
          "W7xdTwvGza",
          "WPWCbCoGaW",
          "W7tdMxX0fSotBZtdOSk0",
          "W57cRaVdOsW",
          "WRRcGmoKiMpcGMZdHJvhWQemWPDO",
          "W5VdS8oCe8oW",
          "W7iLWONdVZ0",
          "bmkYW4SPrw0xvcrnWPdcNqG",
          "oxlcTCkIW6BdHG",
          "WQ3cPSollmo1vCo6W6yQW5e",
          "EmoKWQLPaW",
          "uuzF",
          "W7PgiCk7WQO",
          "mL/cH8oaneldQN7cHmk4",
          "WR3dJs7cNZDXegW",
          "WO7cHmkRWQRcLaO",
          "WRRdIZpcIt9I",
          "W63cRSk8hfVdJ8kE",
          "W78HiCknWQC",
          "WQVdQqddL8oryXVdPCoYga",
          "W5yenCk9WPK",
          "WRiJWRunfuLUW4C",
          "yIddU8kKwa",
          "WRnnWRdcSXCAudvVW5a",
          "cMJcUSkgWQ4",
          "W63dShX8Da",
          "ECohWQ9rgG",
          "EejMBqy",
          "W6FcKsZdHZq",
          "WQSEcWdcPW",
          "WPBdVCoNyrlcQZS",
          "umkEW7C",
          "W47dLLj7sq",
          "urJdOCkDuW",
          "khJcV8kKW7hdKuJdTgFcRa",
          "WQ9QeYZdUMxcPq",
          "W5yWWQi7dwKh",
          "W4D1WOK+lq",
          "WP0votpcRW",
          "W7i9yq",
          "WPBdQHZdRmoDBrhdK8oLgq",
          "iCoDl3O",
          "pmoUm8kTda",
          "ianwy8km",
          "AqFdG8khAW",
          "W5FcISkQe0C",
          "DCoSWQjDlG",
          "vvOiqYxcMahdRmkmW5W",
          "W4SMhmkB",
          "WOZdRmoJFv3cUZ/dMmoNla",
          "W7xdTxnGgSoZ",
          "WQ1+u8kvk8oDWQi",
          "ArRcM8kNAq",
          "WR93aG",
          "jW1m",
          "nmkAdGhcSG",
          "W4CadmowCeq",
          "ugHDxYZcVWVdTmkmW6a",
          "WQH0Amk4dG",
          "W6ZcPSo5h34",
          "oc9ZwmkI",
          "WOhcHmkI",
          "AfVcM8kSWOZdQGC",
          "W5NcUCkKig0",
          "WQnxWP9loW",
          "W6G6W7BdTeXJdIXSW47cKN/cLW",
          "lmkcA8kFWP8",
          "WROdWQHuW5O",
          "6k2b5Rkv5PE95Ro75y6c55cu77+W6k6656Uh5zoq",
          "W6VdVgLuyJFdNG",
          "W4ezumouE0NcJCkzW5FcLa",
          "vKDCtJBcLqddSmkDW70",
          "W4z0oCkejG",
          "BWtdIG",
          "W4NcMbmcW7hdU8kK",
          "W6ZcV8k/p2BdP8k5WRC4",
          "ob/dOG",
          "o03cH8kRWQC",
          "WOZdVCo2ArBcUI0",
          "W6xcKSolbh46WPZdGSoHzSoXW78B",
          "WPtcOmkIWPRcQG",
          "W5ZcHSkofvFdImkKWQuXW4e",
          "W6Oxm8k9WQ8",
          "WOxcN8kXWRZcRGZcSmk5WQ0I",
          "W5amtmo8",
          "WQrRct3dTJ0",
          "WP8vmdNcPa",
          "W7xcVdldLq4",
          "dmknWQr4W78GWRW7bW",
          "WPZdRqFdHq",
          "WRldNZBdT8oRrtRdUmoElG",
          "DHJdIa",
          "W6j0WQm",
          "W4ZcJwinW6hdLYH/W6zz",
          "W4VcNbu1W7e",
          "WO3dICozWPDWW60",
          "mGvtA8kD",
          "W6zHhmk/kW",
          "WRVcRmktWP8z",
          "W65Ye8k8WQO",
          "W6VdVgXAvaVdSW",
          "W6bzlCk2WQie",
          "ErldN8kACbNdOsldNmo0",
          "WR5RncRdOwNcUa4",
          "WQiZkCoyhW",
          "W7ZdRCodW59kW53cSmo3WPNcPghdG1u",
          "WOxdNSkkWRNcIsZcPSkS",
          "W70pASoAza",
          "W7FdTNnZyG",
          "W5zXWP8LyKO2vtRcJa",
        ];
        return (
          (D = function () {
            return e;
          }),
          D()
        );
      }
      function E(e, t) {
        return M(t - 439, e);
      }
      L();
      const x = {};
      function M(e, t) {
        e -= 467;
        const a = D();
        let n = a[e];
        if (void 0 === M["ZEYsbZ"]) {
          var o = function (e) {
            const t =
              "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
            let a = "",
              n = "",
              i = a + o;
            for (
              let o, r, l = 0, s = 0;
              (r = e["charAt"](s++));
              ~r && ((o = l % 4 ? 64 * o + r : r), l++ % 4)
                ? (a +=
                    i["charCodeAt"](s + 10) - 10 !== 0
                      ? String["fromCharCode"](255 & (o >> ((-2 * l) & 6)))
                      : l)
                : 0
            )
              r = t["indexOf"](r);
            for (let o = 0, r = a["length"]; o < r; o++)
              n +=
                "%" + ("00" + a["charCodeAt"](o)["toString"](16))["slice"](-2);
            return decodeURIComponent(n);
          };
          const e = function (e, t) {
            let a,
              n,
              i = [],
              r = 0,
              l = "";
            for (e = o(e), n = 0; n < 256; n++) i[n] = n;
            for (n = 0; n < 256; n++)
              (r = (r + i[n] + t["charCodeAt"](n % t["length"])) % 256),
                (a = i[n]),
                (i[n] = i[r]),
                (i[r] = a);
            (n = 0), (r = 0);
            for (let o = 0; o < e["length"]; o++)
              (n = (n + 1) % 256),
                (r = (r + i[n]) % 256),
                (a = i[n]),
                (i[n] = i[r]),
                (i[r] = a),
                (l += String["fromCharCode"](
                  e["charCodeAt"](o) ^ i[(i[n] + i[r]) % 256]
                ));
            return l;
          };
          (M["QpOMnJ"] = e), (M["DoPfhh"] = {}), (M["ZEYsbZ"] = !0);
        }
        const i = a[0],
          r = e + i,
          l = M["DoPfhh"][r];
        if (l) n = l;
        else {
          if (void 0 === M["xqdhGE"]) {
            const e = function (e) {
              (this["bMIywl"] = e),
                (this["Iyvhay"] = [1, 0, 0]),
                (this["GrJpbj"] = function () {
                  return "newState";
                }),
                (this["mvFgHc"] = "\\w+ *\\(\\) *{\\w+ *"),
                (this["qvUAKJ"] = "['|\"].+['|\"];? *}");
            };
            (e["prototype"]["YCFFZC"] = function () {
              const e = new RegExp(this["mvFgHc"] + this["qvUAKJ"]),
                t = e["test"](this["GrJpbj"]["toString"]())
                  ? --this["Iyvhay"][1]
                  : --this["Iyvhay"][0];
              return this["YzoSJz"](t);
            }),
              (e["prototype"]["YzoSJz"] = function (e) {
                return Boolean(~e) ? this["NSsCvw"](this["bMIywl"]) : e;
              }),
              (e["prototype"]["NSsCvw"] = function (e) {
                for (let t = 0, a = this["Iyvhay"]["length"]; t < a; t++)
                  this["Iyvhay"]["push"](Math["round"](Math["random"]())),
                    (a = this["Iyvhay"]["length"]);
                return e(this["Iyvhay"][0]);
              }),
              new e(M)["YCFFZC"](),
              (M["xqdhGE"] = !0);
          }
          (n = M["QpOMnJ"](n, t)), (M["DoPfhh"][r] = n);
        }
        return n;
      }
      (x["method"] = E("]cUq", 1206)),
        (x[U("EWp]", 668)] = 3e4),
        (x[U("OY^q", 630) + U("VuZk", 517)] = !0);
      const W = u()[E("iHsh", 1040)](x);
      async function R(e) {
        const t = {
            llxpc: W(916, "$OR&"),
            tknCG: "http error",
            UeCTS: W(972, "9DDq"),
            mdXLK: W(881, "IF)J") + W(865, "9DDq"),
            mePXB: function (e, t) {
              return e !== t;
            },
            UcolH: function (e, t) {
              return e !== t;
            },
            gmnRA: "HlhNh",
            UDIOG: W(983, "@^#U"),
            wWqfx:
              O("r^sk", 692) +
              O("3#6u", 821) +
              "uthInterce" +
              W(923, "ndrD") +
              "nfo:",
            KoNsL: function (e, t) {
              return e === t;
            },
            ejujC: W(912, "uOh@"),
            xWTJG: function (e, t) {
              return e(t);
            },
            datbN: O("s%Ex", 679),
            WcQIG: W(886, "$nBR") + W(827, ")12t"),
            uzOgC: "UID",
            GbvXZ: W(1034, "vM%A"),
            ShJOf: W(831, "LqYl") + "0",
            gVLOD: function (e, t) {
              return e === t;
            },
            ypbka: function (e, t) {
              return e === t;
            },
            ZmKxA: function (e, t) {
              return e === t;
            },
            knZNd: "Path=",
            dFEXP: function (e, t) {
              return e === t;
            },
            IbRGq: function (e, t) {
              return e === t;
            },
            ZAsUe: function (e, t) {
              return e === t;
            },
            fLGrW: function (e, t) {
              return e === t;
            },
            fmkKV: O("gazf", 851),
            AjBmr: W(982, "2QjQ") + "=",
            DAWAm: function (e, t) {
              return e === t;
            },
            TDgaY: function (e, t) {
              return e === t;
            },
            VcLvc: function (e, t) {
              return e === t;
            },
            vWqrj: function (e, t) {
              return e === t;
            },
            RXHHY: function (e, t) {
              return e(t);
            },
          },
          a = await (0, N.Z)(t[O("@VvA", 591)], () =>
            P["default"][O("gazf", 920)](O("&fBT", 836) + "n")
          );
        console["log"](t[O("@Fhi", 759)], a);
        const {
            token: n,
            phoneNumber: o,
            loginProvince: i,
            loginCity: r,
            version: l,
            imei: s,
            osType: c,
          } = a,
          u = {};
        (u["lt"] = o),
          (u["pr"] = i),
          (u["ct"] = r),
          (u["av"] = l),
          (u["im"] = s),
          (u["ot"] = c);
        const m = u;
        let p = "",
          h = "",
          f = "",
          g = "",
          v = "";
        if (
          (console[W(756, "OY^q")](
            "http.safe." +
              O("$nBR", 772) +
              O("@^#U", 637) +
              "ptor userI" +
              O("r^sk", 607),
            m
          ),
          P["default"][O("$nBR", 665)][W(955, "As(v")][O("@VvA", 845)])
        ) {
          const e = t[O("2^)L", 886)][O("OUbR", 611)]("|");
          let a = 0;
          while (1) {
            switch (e[a++]) {
              case "0":
                f =
                  null === n ||
                  t[O("&fBT", 631)](n, void 0) ||
                  null === (_ = n["match"](/UID=[\w-]+/g)) ||
                  t["gVLOD"](_, void 0) ||
                  null === (B = _[0]) ||
                  t[O("fqLP", 918)](B, void 0)
                    ? void 0
                    : B["replace"](W(1e3, "As(v"), "");
                continue;
              case "1":
                v =
                  (null === n ||
                  t[W(898, "vM%A")](n, void 0) ||
                  t["ZmKxA"]((I = n[W(1051, "gr^z")](/Path=[\w-]+/g)), null) ||
                  void 0 === I ||
                  null === (b = I[0]) ||
                  void 0 === b
                    ? void 0
                    : b["replace"](t["knZNd"], "")) || "/";
                continue;
              case "2":
                h =
                  t[W(838, "UuzF")](n, null) ||
                  t[W(824, "@^#U")](n, void 0) ||
                  t[O("p%DO", 712)](
                    (C = n[O("OUbR", 895)](/ticketID=[\w-]+/g)),
                    null
                  ) ||
                  t[W(754, "qIj*")](C, void 0) ||
                  t[O("3#6u", 787)]((w = C[0]), null) ||
                  t[O("kh&B", 664)](w, void 0)
                    ? void 0
                    : w[O(")12t", 896)](t[W(813, "lj[#")], "");
                continue;
              case "3":
                p =
                  null === n ||
                  t[O("2^)L", 828)](n, void 0) ||
                  null === (T = n[O("OY^q", 894)](/JSESSIONID=[\w-]+/g)) ||
                  t["KoNsL"](T, void 0) ||
                  t[W(907, "@Fhi")]((S = T[0]), null) ||
                  t[W(1047, "ndrD")](S, void 0)
                    ? void 0
                    : S[W(747, "gr^z")](t[W(860, "]cUq")], "");
                continue;
              case "4":
                g =
                  t[O("IF)J", 706)](n, null) ||
                  t[W(759, "uOh@")](n, void 0) ||
                  t[W(952, "gr^z")](
                    (A = n["match"](/Comment=[\w-]+/g)),
                    null
                  ) ||
                  t[O("^GDW", 593)](A, void 0) ||
                  t[W(903, "ndrD")]((y = A[0]), null) ||
                  t["vWqrj"](y, void 0)
                    ? void 0
                    : y[O("$nBR", 694)](O("@Fhi", 685), "");
                continue;
              case "5":
                var A, y, T, S, I, b, C, w, _, B;
                continue;
            }
            break;
          }
        } else if (t[O("OUbR", 600)](t[O("dTlR", 825)], O("uOh@", 866)))
          _0x55c7ed["rs"] = t[W(1056, "VuZk")];
        else {
          const e = O("e6ek", 655)[O("OY^q", 730)]("|");
          let a = 0;
          while (1) {
            switch (e[a++]) {
              case "0":
                p = t[O("IF)J", 704)](d.ej, t[W(794, "@VvA")]) || "";
                continue;
              case "1":
                v = "/";
                continue;
              case "2":
                g = t["WcQIG"];
                continue;
              case "3":
                f = (0, d.ej)(t[O("fqLP", 765)]) || "";
                continue;
              case "4":
                h = (0, d.ej)(t[W(895, ")12t")]) || "";
                continue;
            }
            break;
          }
        }
        const L = {};
        L[O("@Fhi", 618)] = e[O("&fBT", 767)] || {};
        const D = {
            comment: g,
            jsessionid: p,
            nonce: t[O("eF0M", 649)](d.zs, 8),
            params: JSON[W(1017, "#JUI")](L),
            path: v,
            ticketId: h,
            timestamp: Date[W(996, "VuZk")](),
            uid: f,
          },
          x = Object[O("gazf", 871)](D)["reduce"]((e, [a, n]) => {
            function o(e, t) {
              return O(e, t - -244);
            }
            function i(e, t) {
              return W(e - -1059, t);
            }
            if (
              t["mePXB"](n, null) &&
              t["UcolH"](n, void 0) &&
              t[i(-2, "vM%A")](n, "")
            ) {
              if (t["gmnRA"] !== t[i(-140, "VuZk")]) {
                _0x4a636f[i(-180, "LqYl")](t[i(-299, "lj[#")], _0x310ec6);
                const e = {};
                return (
                  (e[o("s%Ex", 512)] = t[o("ingZ", 449)]),
                  (e[o("ingZ", 573)] = t[o("mwN&", 591)]),
                  _0x4ee476[i(-99, "muGm")](e)
                );
              }
              e[a] = n;
            }
            return e;
          }, {}),
          M = Object[W(1004, "#JUI")](x)
            [O("#JUI", 709)](([e, t]) => e + "=" + t)
            [W(866, "uOh@")]("$$");
        function W(e, t) {
          return U(t, e - 225);
        }
        x[W(934, "7jtg")] = t[O("OUbR", 589)](k, M);
        const R = {};
        function O(e, t) {
          return E(e, t - -319);
        }
        return (
          (R[W(810, "voWY") + O("&fBT", 781)] = m), (R[W(1073, "ndrD")] = x), R
        );
      }
      function O(e) {
        const t = {
            Awysx: function (e, t) {
              return e !== t;
            },
            gcIWs:
              "http.safe." +
              l("3IkE", -495) +
              m(-214, "tji3") +
              l("2^)L", -333) +
              m(-117, "As(v") +
              "rs",
            nKNHo: function (e, t) {
              return e(t);
            },
            Fyjpl:
              "http.safe." +
              m(-322, "^GDW") +
              "oAuthInter" +
              l("UuzF", -409) +
              l("2QjQ", -318),
            QHCDi:
              l("uOh@", -286) +
              l("&fBT", -232) +
              l("3IkE", -485) +
              l("^GDW", -266) +
              "JSON",
          },
          {
            phoneNumber: a,
            loginProvince: n,
            loginCity: o,
          } = e[l("r^sk", -453)] || {},
          i = {};
        (i["lt"] = a), (i["pr"] = n), (i["ct"] = o);
        const r = Object[m(-423, "ingZ")](i)[l("LqYl", -195)]((e, [a, n]) => {
          function o(e, t) {
            return m(t - 1839, e);
          }
          return (
            void 0 !== n &&
              null !== n &&
              t[o("Rf(W", 1667)](n, "") &&
              (e[a] = n),
            e
          );
        }, {});
        function l(e, t) {
          return E(e, t - -1428);
        }
        console[m(-427, "e6ek")](t[l("LqYl", -426)], r);
        const s = {};
        s[l("s%Ex", -290)] = e[l("#!%]", -285)] || {};
        const c = {
            nonce: t[l("dTlR", -204)](d.zs, 8),
            params: JSON[l("2^)L", -311)](s),
            timestamp: Date[l("3IkE", -192)](),
            sign: "",
          },
          u =
            l("s%Ex", -295) +
            c[m(-350, "VuZk")] +
            "$$params=" +
            c[l("ndrD", -407)] +
            l("EWp]", -194) +
            "p=" +
            c["timestamp"];
        function m(e, t) {
          return E(t, e - -1344);
        }
        console[m(-233, "2^)L")](t[m(-163, "3IkE")], u),
          (c[l("eF0M", -494)] = t[m(-438, "eF0M")](k, u)),
          console[l("muGm", -280)](t[m(-199, "YOE*")], c);
        const p = {};
        return (p["userInfoHeaders"] = r), (p[l("VuZk", -442)] = c), p;
      }
      function U(e, t) {
        return M(t - 45, e);
      }
      W[U("YOE*", 784) + "rs"][E("gazf", 1119)][E("ingZ", 939)](async (e) => {
        const t = {
          XkSDe: s("EWp]", 398),
          MAoJw: "UID",
          HxFPG: r(-348, "r^sk"),
          ESYIX: s("r^sk", 560) + s("e6ek", 520),
          woJoJ: r(-161, "EWp]"),
          EbQyt: function (e, t) {
            return e === t;
          },
          ZdUZf: function (e, t, a, n) {
            return e(t, a, n);
          },
          dFWMP: function (e, t) {
            return e === t;
          },
          yZkfz: function (e, t) {
            return e(t);
          },
          GnZxQ: s("eF0M", 505) + r(-208, "]f1V"),
          RksQJ: "FEDCBA9876" + s("#JUI", 325),
          lGKxi: function (e, t, a) {
            return e(t, a);
          },
          iGsAb: function (e, t, a) {
            return e(t, a);
          },
          Hlnmc: function (e, t) {
            return e + t;
          },
          TBipj: function (e, t) {
            return e !== t;
          },
          xoikr: s("tji3", 319),
          hWHNM: function (e, t) {
            return e !== t;
          },
          WpXNy: "FZjiH",
          XuSWk: r(-332, "9DDq"),
          LqyFM: r(-255, "VuZk"),
          BMHgO: "s-header",
          ZlpWt: s("3IkE", 490) + s("@^#U", 469) + s("YOE*", 538) + "8",
        };
        t["dFWMP"](
          P["default"][s("]cUq", 379)][s("^GDW", 387) + "e"][
            r(-357, "ndrD") + "afeMockEnable"
          ],
          "1"
        )
          ? ((e["sm4Key"] = t["yZkfz"](I, t[s("eF0M", 559)])),
            (e[r(-277, "fqLP")] = t[s("lj[#", 417)]))
          : ((e[s("iHsh", 297)] = t["yZkfz"](
              I,
              t[r(-378, "lj[#")](d.zs, 16, !0)
            )),
            (e[s("$OR&", 462)] = t[r(-145, ")12t")](d.zs, 16, !0)));
        const a = t[r(-271, "dTlR")](
          b,
          t[r(-264, "r^sk")](e["sm4Key"], e[s("ndrD", 261)])
        );
        let n = {},
          o = {};
        if (
          (e["requestDon" + r(-256, "]@n7")]
            ? ({ userInfoHeaders: n, reqJSON: o } = O(e))
            : ({ userInfoHeaders: n, reqJSON: o } = await R(e)),
          P["default"][s(")12t", 393)][r(-400, "2^)L")]["isTouch"])
        )
          if (t[s("$OR&", 395)](t["xoikr"], s("EWp]", 528)))
            n["rs"] = s("qIj*", 238);
          else {
            const e = t[s("VuZk", 453)][s("eF0M", 476)]("|");
            let a = 0;
            while (1) {
              switch (e[a++]) {
                case "0":
                  _0x17b8fe = _0x13df89(t[r(-325, "ingZ")]) || "";
                  continue;
                case "1":
                  _0x12ef1c = _0x55689a(t[s("#!%]", 516)]) || "";
                  continue;
                case "2":
                  _0x51f393 = "/";
                  continue;
                case "3":
                  _0x35945f = t[s("eF0M", 403)];
                  continue;
                case "4":
                  _0x3059d7 = _0x5b33cf(t[r(-380, "@Fhi")]) || "";
                  continue;
              }
              break;
            }
          }
        else {
          if (t[r(-175, "VuZk")](t[r(-174, "eF0M")], r(-265, "@^#U"))) {
            var i;
            let e =
              t[r(-89, "^GDW")]((i = _0xd67ef4["data"]), null) ||
              t[r(-351, "3#6u")](i, void 0)
                ? void 0
                : i[r(-222, "&fBT")];
            const { sm4Key: a, sm4Iv: n } = _0x58ac6f[s("9DDq", 556)];
            return (
              (e = t["ZdUZf"](_0x5c9be4, e, a, n)),
              (e = _0x5e4902[r(-291, "]f1V")](e)),
              e
            );
          }
          n["rs"] = t[s(")12t", 487)];
        }
        function r(e, t) {
          return U(t, e - -930);
        }
        const l = C(
          JSON["stringify"](n),
          e[r(-217, "gazf")],
          e[r(-193, "]@n7")]
        );
        function s(e, t) {
          return E(e, t - -684);
        }
        return (
          (e[r(-354, "@^#U")] = {
            cmccBody: t[r(-409, "2^)L")](
              C,
              JSON[s("ndrD", 277)](o),
              e[r(-382, "@^#U")],
              e[r(-287, "7jtg")]
            ),
          }),
          e[s("gr^z", 280)][s("EWp]", 483)](t["LqyFM"], a),
          e[s("VuZk", 429)][s("$nBR", 373)](t[r(-254, "muGm")], l),
          e[r(-273, "@^#U")][r(-384, "lj[#")](
            "Content-Type",
            t[r(-129, "e6ek")]
          ),
          e
        );
      }),
        W[U("3IkE", 563) + "rs"][E("kh&B", 1098)][U("OUbR", 565)](
          (e) => {
            function t(e, t) {
              return E(e, t - -1283);
            }
            function a(e, t) {
              return U(e, t - -922);
            }
            const n = {
              mDPla: function (e, t) {
                return e === t;
              },
              VQuEi: a("YOE*", -301) + a("2^)L", -107) + a("vM%A", -97),
              WOOkN: a("OY^q", -202),
              ffRyu: a("voWY", -118) + t("eF0M", -229),
              nrhMV: a("YOE*", -362) + a("LqYl", -280),
              HjZMY: function (e, t) {
                return e !== t;
              },
              RCxIu: function (e, t) {
                return e !== t;
              },
              fxTrM:
                "http.safe." +
                a("#JUI", -315) +
                "oAuthInter" +
                t("OUbR", -295) +
                a("#!%]", -141) +
                "rs",
              JRWea: function (e, t) {
                return e(t);
              },
              xQMVM: function (e, t) {
                return e === t;
              },
              DzKXe: "localhost",
              xusAC: t("mwN&", -244),
              hYqdn: "mkcxZ",
              kLCTT: "BYCCi",
              wZbam: function (e, t) {
                return e === t;
              },
              mWyfZ: function (e, t, a, n) {
                return e(t, a, n);
              },
              gIrvW: "nGPoE",
            };
            if (
              (console[t("9DDq", -336)](a("qIj*", -300) + a("#JUI", -338), e),
              !n[a("^GDW", -117)](e["status"], 200) &&
                304 !== e[t("As(v", -86)])
            ) {
              if (n["xQMVM"](n["gIrvW"], n[t("tji3", -156)])) {
                const e = {};
                return (
                  (e[a("$OR&", -302)] = n[t("VuZk", -365)]),
                  (e[t("$nBR", -115)] = n[t("UuzF", -266)]),
                  e
                );
              }
              {
                const {
                    phoneNumber: e,
                    loginProvince: o,
                    loginCity: i,
                  } = _0x18a608[a("fqLP", -306)] || {},
                  r = {};
                (r["lt"] = e), (r["pr"] = o), (r["ct"] = i);
                const l = _0x2a5527[t("&fBT", -240)](r)["reduce"](
                  (e, [a, o]) => {
                    function i(e, a) {
                      return t(e, a - 1220);
                    }
                    return (
                      n[i("^GDW", 869)](o, _0x549771) &&
                        n["HjZMY"](o, null) &&
                        n[i("gazf", 1125)](o, "") &&
                        (e[a] = o),
                      e
                    );
                  },
                  {}
                );
                _0x3466d3["log"](n[a("7jtg", -363)], l);
                const s = {};
                s["reqBody"] = _0x70e694[t("lj[#", -151)] || {};
                const c = {
                    nonce: _0x294c34(8),
                    params: _0x39a8b7["stringify"](s),
                    timestamp: _0x2c5d05[t("voWY", -265)](),
                    sign: "",
                  },
                  u =
                    t("ingZ", -312) +
                    c[a("2^)L", -344)] +
                    t("$nBR", -178) +
                    c[a("@VvA", -158)] +
                    (t("s%Ex", -66) + "p=") +
                    c[t("9DDq", -227)];
                _0x5e13d7[a("OUbR", -339)](
                  t("qIj*", -288) +
                    a("3#6u", -140) +
                    t("]cUq", -374) +
                    "ceptor pre" +
                    t("As(v", -106),
                  u
                ),
                  (c[a("vM%A", -106)] = n[t("&fBT", -103)](_0x9fd818, u)),
                  _0x2a6381[a("@^#U", -134)](
                    a("gr^z", -381) +
                      "js handleN" +
                      t("r^sk", -81) +
                      a("^GDW", -154) +
                      a("muGm", -389),
                    c
                  );
                const d = {};
                return (
                  (d[t("gr^z", -190) + t("]@n7", -245)] = l),
                  (d["reqJSON"] = c),
                  d
                );
              }
            }
            if (
              window[a("LqYl", -208)]["origin"][a("3IkE", -319)](
                n[t("As(v", -91)]
              )
            )
              return e[t("vM%A", -231)];
            if (n[a("UuzF", -375)] === n[t("3#6u", -62)]) {
              const e = {};
              return (
                (e[t("@Fhi", -278)] = n[a("3#6u", -402)]),
                (e[t("p%DO", -203)] = n[a("3#6u", -88)]),
                e
              );
            }
            try {
              if (!n[t("tji3", -76)](a("mwN&", -198), n[a("vM%A", -326)])) {
                var o;
                let i =
                  null === (o = e[t("$OR&", -149)]) || n["wZbam"](o, void 0)
                    ? void 0
                    : o["cmccBody"];
                const { sm4Key: r, sm4Iv: l } = e[a("fqLP", -329)];
                return (
                  (i = n[a("e6ek", -188)](_, i, r, l)),
                  (i = JSON[t("IF)J", -303)](i)),
                  i
                );
              }
              try {
                var i;
                let e =
                  n[a("YOE*", -132)]((i = _0x3a3ae5[t("uOh@", -277)]), null) ||
                  n[a("fqLP", -331)](i, void 0)
                    ? void 0
                    : i[t("#JUI", -171)];
                const { sm4Key: o, sm4Iv: r } = _0x43528a[a("gazf", -75)];
                return (e = _0x2e8da7(e, o, r)), (e = _0x3f00a1["parse"](e)), e;
              } catch (r) {
                _0x2992d9[t("LqYl", -235)](n[t("]f1V", -331)], r);
                const e = {};
                return (
                  (e[a("EWp]", -250)] = n["WOOkN"]),
                  (e["retDesc"] = n[t("r^sk", -187)]),
                  e
                );
              }
            } catch (l) {
              console["log"](n[t("OY^q", -184)], l);
              const e = {};
              return (
                (e[t("IF)J", -117)] = t("@^#U", -75)),
                (e[a("tji3", -227)] = n[a("EWp]", -242)]),
                e
              );
            }
          },
          (e) => {
            function t(e, t) {
              return E(e, t - 209);
            }
            function a(e, t) {
              return U(t, e - -470);
            }
            const n = {};
            (n["OADKs"] = a(182, "@^#U")),
              (n[a(94, "kh&B")] = t("7jtg", 1274)),
              (n["nNfpQ"] = "请求无法受理，请稍后" + t("^GDW", 1270));
            const o = n;
            console[a(98, "Rf(W")](o[a(367, "p%DO")], e);
            const i = {};
            return (
              (i[t("r^sk", 1254)] = o[t("3IkE", 1239)]),
              (i[t("IF)J", 1169)] = o[t("3IkE", 1329)]),
              Promise["resolve"](i)
            );
          }
        );
      var F = W;
      function Z(e) {
        return F({ url: s.gB + "/charge/mumCharge/createOrder", data: e });
      }
      function V(e) {
        return F({
          url: s.gB + "/charge/mumCharge/queryPayResult",
          data: e,
          timeout: 5e3,
        });
      }
      var Q = a(12608),
        Y = a.n(Q),
        G = a(11601),
        j = a.n(G),
        q = {
          namespaced: !0,
          state: {
            currentPageShow: "FarmBalance",
            payStatus: "",
            userBalance: "--",
            rechargeList: [10, 20, 50, 100],
            index: -1,
            orderId: "",
            mobile: "",
            chargeFee: "",
          },
          getters: {
            rechargeMoney(e) {
              return e.index > -1 ? e.rechargeList[e.index] : 0;
            },
          },
          mutations: {
            SET_CURRENT_PAGE_SHOW(e, t) {
              e.currentPageShow = t;
            },
            SET_PAY_STATUS(e, t) {
              e.payStatus = t;
            },
            SET_USER_BALANCE(e, t) {
              e.userBalance = t;
            },
            SET_INDEX(e, t) {
              e.index = t;
            },
            SET_ORDER_ID(e, t) {
              e.orderId = t;
            },
            SET_MOBILE(e, t) {
              e.mobile = t;
            },
            SET_CHARGE_FEE(e, t) {
              e.chargeFee = t;
            },
          },
          actions: {
            async fetchBalanceInfo({ commit: e }) {
              try {
                let t = await (0, o.EM)(() => (0, r.z)(), 3e3).then(i.ep);
                if ("000000" === t.retCode && t.rspBody) {
                  let { realBalanceFee: a, curFee: n } = t.rspBody,
                    o = a || n;
                  (Y()(o) || (j()(o) && "" !== o)) && e("SET_USER_BALANCE", o);
                }
              } catch (t) {
                console.log("getRealFee error:", t);
              }
            },
            async tibetanFarmCreateOrder(
              { state: e, commit: t, dispatch: a, getters: o, rootState: i },
              r
            ) {
              t("SET_INDEX", r);
              const l = {
                chargeMoney: o.rechargeMoney,
                chargePhoneNumber: i.userInfo.phoneNumber,
              };
              try {
                n.Z.loading({
                  message: "加载中...",
                  forbidClick: !0,
                  duration: 0,
                });
                let e = await Z(l);
                n.Z.clear(),
                  "000000" === e.retCode && e.rspBody
                    ? (t("SET_ORDER_ID", e.rspBody.orderId),
                      await a("tibetanFarmGetNewPay"))
                    : (0, n.Z)("请求异常,请稍后再试");
              } catch (s) {
                n.Z.clear(),
                  console.log("createOrder error:", s),
                  (0, n.Z)("请求异常,请稍后再试");
              }
              t("SET_INDEX", -1);
            },
            async tibetanFarmGetNewPay({ state: e }) {
              await (0, l.d_)({ channelID: "20", orderID: e.orderId })
                .then((e) => {
                  console.log("getNewPay res:", e);
                })
                .catch((e) => {
                  console.log("getNewPay err:", e),
                    (0, n.Z)("请求异常,请稍后再试");
                });
            },
            async fetchPayResult({ state: e, commit: t, rootState: a }) {
              try {
                let e = await V({ orderId: (0, d.eY)("orderId") || "" });
                if ("000000" === e.retCode && e.rspBody) {
                  const {
                    payOrderStatus: a,
                    mobile: n,
                    chargeFee: o,
                  } = e.rspBody;
                  t("SET_MOBILE", n), t("SET_CHARGE_FEE", o);
                  let i = "";
                  switch (a) {
                    case "2":
                    case "4":
                      i = "rechargeSuccess";
                      break;
                    case "3":
                      i = "payFault";
                      break;
                    case "5":
                      i = "rechargeFault";
                      break;
                    case "0":
                      i = "ResultQueryFault";
                      break;
                    default:
                      i = "ResultQueryFault";
                      break;
                  }
                  t("SET_PAY_STATUS", i);
                } else t("SET_PAY_STATUS", "ResultQueryFault");
              } catch (n) {
                t("SET_PAY_STATUS", "ResultQueryFault"),
                  console.log("queryPayResult error:", n);
              }
            },
          },
        };
    },
    18888: function (e, t, a) {
      "use strict";
      a(26699), a(2490), a(59849), a(9924);
      function n(e, t) {
        var a;
        if (
          null === e ||
          void 0 === e ||
          null === (a = e.pageDataList) ||
          void 0 === a ||
          !a.length
        )
          return e;
        const n = { ...e };
        return (
          (n.pageDataList = e.pageDataList.map((e) => {
            var a;
            if (null === (a = e.buttonList) || void 0 === a || !a.length)
              return e;
            const n = { ...e };
            return (
              (n.buttonList = e.buttonList.map((e) => {
                var a;
                if (null === (a = e.linkConfig) || void 0 === a || !a.length)
                  return e;
                const n = { ...e };
                return (
                  (n.linkConfig = e.linkConfig.filter(
                    (e) =>
                      e.provinceCode &&
                      Array.isArray(e.provinceCode) &&
                      e.provinceCode.includes(t)
                  )),
                  n.linkConfig.length ||
                    (n.linkConfig = e.linkConfig.filter(
                      (e) => e.provinceCode && "000" === e.provinceCode
                    )),
                  n
                );
              })),
              (n.buttonList = n.buttonList.filter(
                (e) => e.linkConfig.length > 0
              )),
              n
            );
          })),
          n
        );
      }
      t.Z = {
        namespaced: !0,
        state: {},
        getters: {
          serviceCommitmentsInfo(e, t, a) {
            if (
              a.remoteState.CMCC_ServiceCommitments_ContentInfo &&
              a.userInfo.loginProvince
            )
              try {
                let e = JSON.parse(
                  a.remoteState.CMCC_ServiceCommitments_ContentInfo
                );
                return n(e, a.userInfo.loginProvince);
              } catch (o) {
                console.log("e", o);
              }
            return {};
          },
          serviceCommitmentsCareInfo(e, t, a) {
            if (
              a.remoteState.CMCC_ServiceCommitmentsCare_ContentInfo &&
              a.userInfo.loginProvince
            )
              try {
                let e = JSON.parse(
                  a.remoteState.CMCC_ServiceCommitmentsCare_ContentInfo
                );
                return n(e, a.userInfo.loginProvince);
              } catch (o) {
                console.log("e", o);
              }
            return {};
          },
        },
        mutations: {},
        actions: {},
      };
    },
    72856: function (e, t, a) {
      "use strict";
      a.d(t, {
        default: function () {
          return I;
        },
      });
      a(26699);
      var n = a(10311),
        o = a.n(n),
        i = a(26294),
        r = a.n(i),
        l = a(51327),
        s = a(53306);
      const c = h;
      function u(e, t = "cmcc-service-website") {
        const a = h,
          n = [];
        for (let c = 0; c < e[a(166)]; c += 2)
          n[a(181)](parseInt(e["substr"](c, 2), 16));
        const o = [];
        for (let c = 0; c < t["length"]; c++) o[a(181)](t[a(172)](c));
        const i = [];
        for (let c = 0; c < n[a(166)]; c++) c % 3 !== 0 && i[a(181)](n[c]);
        const r = [...Array(i[a(166)])[a(156)]()];
        for (let c = i[a(166)] - 1; c > 0; c--) {
          const e = (o[c % o[a(166)]] * (c + 1)) % (c + 1);
          [r[c], r[e]] = [r[e], r[c]];
        }
        const l = new Array(i[a(166)]);
        for (let c = 0; c < i[a(166)]; c++) l[r[c]] = i[c];
        const s = [];
        for (let c = 0; c < l[a(166)]; c++)
          s[a(181)](l[c] ^ o[c % o["length"]]);
        return String[a(154)](...s);
      }
      (function (e, t) {
        const a = h,
          n = e();
        while (1)
          try {
            const e =
              parseInt(a(173)) / 1 +
              -parseInt(a(169)) / 2 +
              (-parseInt(a(180)) / 3) * (parseInt(a(176)) / 4) +
              parseInt(a(179)) / 5 +
              (-parseInt(a(161)) / 6) * (-parseInt(a(170)) / 7) +
              (parseInt(a(152)) / 8) * (-parseInt(a(168)) / 9) +
              (parseInt(a(177)) / 10) * (-parseInt(a(160)) / 11);
            if (e === t) break;
            n["push"](n["shift"]());
          } catch (o) {
            n["push"](n["shift"]());
          }
      })(f, 156700);
      const d = s.enc["Utf8"][c(158)](
          u("63275365561f3129246b42457e5c526d3f67394652735730")
        ),
        m = s.enc[c(162)]["parse"](
          u("633552655a1431323f6b45467e5c536d3d7739465c735a29")
        );
      s.enc[c(162)]["parse"](
        u("63151a651b4b31041f6b0a0f7e07526d571e394350735419")
      ),
        s.enc[c(162)][c(158)](u(c(178)));
      function p(e, t = d, a = m) {
        const n = c,
          o = s.enc["Hex"][n(158)](e),
          i = s.enc[n(163)][n(151)](o),
          r = s.AES[n(165)](i, t, {
            iv: a,
            mode: s.mode[n(150)],
            padding: s.pad[n(155)],
          }),
          l = r[n(167)](s.enc[n(162)]);
        return l[n(167)]();
      }
      s.enc[c(162)][c(158)](
        u("63255265541e3129246b44467e58526d276739475573532d")
      ),
        s.enc[c(162)][c(158)](u(c(174)));
      function h(e, t) {
        const a = f();
        return (
          (h = function (e, t) {
            e -= 150;
            let n = a[e];
            return n;
          }),
          h(e, t)
        );
      }
      function f() {
        const e = [
          "632a5365531f31323f6b45467e58526d3665394754735027",
          "ciphertext",
          "92236wQMnAj",
          "16090iURXyu",
          "635f5065571831451f6b0a0f7e11056d1257390f1c730c52",
          "1154255JufNro",
          "9YnCXad",
          "push",
          "CBC",
          "stringify",
          "8YAzuiL",
          "635f5065571c3141566b46477e5b226d276e393320732452",
          "fromCharCode",
          "Pkcs7",
          "keys",
          "encrypt",
          "parse",
          "toUpperCase",
          "1639trqNeZ",
          "286146TfAAOe",
          "Utf8",
          "Base64",
          "632f206527683135546b40457e5d526d571e394354735022",
          "decrypt",
          "length",
          "toString",
          "928611EEwpUo",
          "206004KaClwt",
          "28RacdzY",
          "Hex",
          "charCodeAt",
          "250184VeaeTz",
        ];
        return (
          (f = function () {
            return e;
          }),
          f()
        );
      }
      const g = (e, t = u(c(153)), a = u(c(164))) => {
        const n = c,
          o = s.enc[n(171)]["parse"](e),
          i = s.enc[n(163)][n(151)](o),
          r = s.AES[n(165)](i, s.enc[n(162)][n(158)](t), {
            iv: s.enc[n(162)][n(158)](a),
            mode: s.mode[n(150)],
            padding: s.pad[n(155)],
          }),
          l = r[n(167)](s.enc[n(162)]);
        return l[n(167)]();
      };
      let v = {
        common: {
          phoneNumber: "99999999999",
          loginProvince: "9999",
          loginCity: "0000",
          channel: "web",
          phoneMask: "",
          appTokenId: "",
        },
        qqd: {
          uid: "",
          headimgurl: "",
          secondChannel: "",
          sensorId: "",
          wmhId: "",
          policy: "",
          recommendStatus: !0,
          servicePopupStatus: !0,
          activityPopupStatus: !0,
          marketingPopupStatus: !0,
        },
        app: {
          cid: "0",
          en: "0",
          token: "0",
          sn: "0",
          version: "0",
          st: "0",
          sv: "0",
          sp: "0",
          xk: "0",
          osType: "0",
          city: "0000",
          province: "100",
          userBrand: "",
          userStatus: 0,
          loginType: "",
        },
      };
      if ("qqd" === l.lQ && window.user) {
        "string" === typeof window.user &&
          (window.user = JSON.parse(window.user.replace(/&#34;/g, '"'))),
          Object.assign(v.common, {
            loginProvince: window.user.provinceCode,
            loginCity: window.user.cityCode,
            channel: window.user.channel,
          });
        let e = g(window.user.wmhId);
        try {
          Object.assign(v.qqd, window.user, {
            phoneNumber: e,
            phoneMask: e.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2"),
          });
        } catch (b) {
          console.log("wmhId解密失败", window.user.wmhId);
        }
      }
      var A = v;
      function y() {
        let e = window.f155a6b25c83;
        try {
          return e && (e = JSON.parse(p(e))), "object" === typeof e ? e : {};
        } catch (b) {
          return "object" === typeof e ? e : {};
        }
      }
      o().use(r());
      let T = new (r().Store)({
          state: {
            websiteTarget: l.lQ,
            userInfo: { ...A.common, ...("qqd" === l.lQ ? A.qqd : A.app) },
            remoteState: y() || {},
          },
          getters: {
            isLoginWithUserInfo(e, t, a, n) {
              return a.login.isLogin && e.userInfo.phoneMask;
            },
            pageName() {
              return window.location.pathname.split("/").pop();
            },
            pageGroup() {
              try {
                let e = window.location.pathname.split("/");
                return e[e.length - 2];
              } catch (b) {
                return "";
              }
            },
          },
          mutations: {
            setUserInfo(e, t) {
              t.phoneNumber &&
                (t.phoneMask = t.phoneNumber.replace(
                  /(\d{3})\d{4}(\d{4})/,
                  "$1****$2"
                )),
                Object.assign(e.userInfo, t);
            },
          },
          actions: {},
          modules: {},
        }),
        S = T.registerModule;
      (T.registerModule = function (e, t, a) {
        T.hasModule(e) || S.call(T, e, t, a);
      }),
        window.location.href.includes("__debug__") && (window.$store = T);
      var I = T;
    },
    32205: function (e, t, a) {
      "use strict";
      a(20726);
      var n = a(10521),
        o = a(30660),
        i = a(72856),
        r = a(26090);
      t.Z = {
        namespaced: !0,
        state: { authNewBills: {} },
        getters: {},
        mutations: {
          SET_AUTH_NEW_BILLS(e, t) {
            e.authNewBills = t;
          },
        },
        actions: {
          async getAuthNewBills(
            { commit: e, rootState: t, rootGetters: a },
            l
          ) {
            var s;
            e("SET_AUTH_NEW_BILLS", {});
            let { type: c, paidPhoneNum: u } = l,
              d =
                null === (s = t[r.Eg[a.pageGroup + "/" + a.pageName]]) ||
                void 0 === s
                  ? void 0
                  : s.currentItem,
              m = d.year + "-" + d.month.padStart(2, "0");
            console.log("data", l, "请求代付---api");
            try {
              var p;
              let a = await o.Z.getNewBills(
                { ...l, bgnMonth: m, endMonth: m },
                { timeout: 9500 }
              );
              var h;
              if ((console.log("store getAuthNewBills---", a), "1" === c))
                "000000" === a.retCode &&
                (null === (h = a.rspBody.historyBillInfo) || void 0 === h
                  ? void 0
                  : h.length) > 0
                  ? e("SET_AUTH_NEW_BILLS", a.rspBody.historyBillInfo[0])
                  : ((0, n.Z)(a.retDesc || ""), e("SET_AUTH_NEW_BILLS", {}));
              else if (
                "2" === c &&
                t.billsData.billInfoAll &&
                null !== (p = t.billsData.billInfoAll.billInfolist) &&
                void 0 !== p &&
                p.length
              ) {
                let e = t.billsData.billInfoAll.billInfolist.findIndex(
                  (e) => e.phoneNum === u
                );
                if (e < 0) return;
                var f, g;
                if ("000000" === a.retCode)
                  (null === (f = a.rspBody) ||
                  void 0 === f ||
                  null === (g = f.historyBillInfo) ||
                  void 0 === g
                    ? void 0
                    : g.length) > 0
                    ? i["default"].commit("billsData/SET_BILL_INFO_ITEM", {
                        index: e,
                        name: "historyBillInfo",
                        data: a.rspBody.historyBillInfo[0],
                      })
                    : (i["default"].commit("billsData/SET_BILL_INFO_ITEM", {
                        index: e,
                        name: "historyBillInfo",
                        data: null,
                      }),
                      i["default"].commit("billsData/SET_BILL_INFO_ITEM", {
                        index: e,
                        name: "errorMsg",
                        data: "暂未查询到数据",
                      }));
                else
                  i["default"].commit("billsData/SET_BILL_INFO_ITEM", {
                    index: e,
                    name: "historyBillInfo",
                    data: null,
                  }),
                    i["default"].commit("billsData/SET_BILL_INFO_ITEM", {
                      index: e,
                      name: "errorMsg",
                      data: a.retDesc || t.billsData.defaultErrorMsg,
                    });
              }
            } catch {
              if ("1" === c)
                (0, n.Z)("请求无法受理，请稍后再试"),
                  e("SET_AUTH_NEW_BILLS", {});
              else if ("2" === c) {
                let e = t.billsData.billInfoAll.billInfolist.findIndex(
                  (e) => e.phoneNum === u
                );
                e > -1 &&
                  (i["default"].commit("billsData/SET_BILL_INFO_ITEM", {
                    index: e,
                    name: "historyBillInfo",
                    data: null,
                  }),
                  i["default"].commit("billsData/SET_BILL_INFO_ITEM", {
                    index: e,
                    name: "errorMsg",
                    data: t.billsData.defaultErrorMsg,
                  }));
              }
            }
          },
        },
      };
    },
    43706: function (e, t, a) {
      "use strict";
      a(20726);
      var n = a(10521),
        o = a(30660);
      t.Z = {
        namespaced: !0,
        state: { authorizeStatus: {}, failMsg: "请求无法受理，请稍后再试。" },
        mutations: {
          SET_AUTHORIZE_STATUS(e, t) {
            e.authorizeStatus = t;
          },
        },
        actions: {
          async getAuthorizeStatus({ state: e, commit: t }, a) {
            t("SET_AUTHORIZE_STATUS", {});
            try {
              let e = await o.Z.getAuthorizeStatus(a, { timeout: 9500 });
              console.log("store getAuthorizeStatus", e),
                "000000" === e.retCode
                  ? t("SET_AUTHORIZE_STATUS", e.rspBody)
                  : (0, n.Z)(e.retDesc);
            } catch {
              (0, n.Z)(e.failMsg),
                console.log("getAuthorizeStatus获取账单代付授权状态接口报错");
            }
          },
        },
      };
    },
    91045: function (e, t, a) {
      "use strict";
      a(20726);
      var n = a(10521),
        o = a(30660),
        i = a(26090);
      t.Z = {
        namespaced: !0,
        state: { bandNewBills: {} },
        getters: {},
        mutations: {
          SET_BAND_NEW_BILLS(e, t) {
            e.bandNewBills = t;
          },
        },
        actions: {
          async getBandNewBills(
            { commit: e, rootState: t, rootGetters: a },
            r
          ) {
            var l;
            e("SET_BAND_NEW_BILLS", {}),
              console.log(r, "宽带查询--额外参数data--请求宽带---api");
            let s =
                null === (l = t[i.Eg[a.pageGroup + "/" + a.pageName]]) ||
                void 0 === l
                  ? void 0
                  : l.currentItem,
              c = s.year + "-" + s.month.padStart(2, "0");
            try {
              var u;
              let t = await o.Z.getBandNewBills({
                ...r,
                bgnMonth: c,
                endMonth: c,
              });
              console.log("store getBandNewBills---", t),
                "000000" === t.retCode &&
                (null === (u = t.rspBody.historyBillInfo) || void 0 === u
                  ? void 0
                  : u.length) > 0
                  ? e("SET_BAND_NEW_BILLS", t.rspBody.historyBillInfo[0])
                  : (0, n.Z)(t.retDesc);
            } catch (d) {
              console.log(d, "??"), (0, n.Z)("请求无法受理, 请稍后再试。");
            }
          },
        },
      };
    },
    70417: function (e, t, a) {
      "use strict";
      a(20726);
      var n = a(10521),
        o = a(48032),
        i = a(89629),
        r = a(23899);
      t.Z = {
        namespaced: !0,
        state: {
          resData: null,
          isFreeErr: !1,
          recordLoadState: "loadInit",
          historyBillLoadState: "loadInit",
        },
        getters: {},
        mutations: {
          SET_RES_DATA(e, t) {
            e.resData = t;
          },
          SET_ERROR_STATUS(e, t) {
            e.isFreeErr = t;
          },
          SET_LOAD_STATE(e, { stateName: t, value: a }) {
            e[t] = a;
          },
        },
        actions: {
          async getQryBillPaymentRecord({ commit: e }, t) {
            r.Z.show();
            let a = {};
            e("SET_LOAD_STATE", {
              stateName: "recordLoadState",
              value: "loading",
            }),
              (a = await (0, o.GE)(t, { timeout: 1e4 }).then(i.ep).then(i.um)),
              e("SET_LOAD_STATE", {
                stateName: "recordLoadState",
                value: "loadCompleted",
              }),
              console.log("qryBillPaymentRecord--", a),
              r.Z.clear(),
              "000000" === a.retCode
                ? a.rspBody
                  ? (e("SET_RES_DATA", a.rspBody), e("SET_ERROR_STATUS", !1))
                  : e("SET_ERROR_STATUS", !0)
                : ((0, n.Z)(a.retDesc), e("SET_ERROR_STATUS", !0));
          },
          async getQryFriendHistoryBill({ commit: e }, t) {
            let a =
              t.currentItem.year + "-" + t.currentItem.month.padStart(2, "0");
            r.Z.show();
            let l = {},
              s = { ...t, qryMonth: a };
            e("SET_LOAD_STATE", {
              stateName: "historyBillLoadState",
              value: "loading",
            }),
              (l = await (0, o.Te)(s, { timeout: 1e4 }).then(i.ep).then(i.um)),
              e("SET_LOAD_STATE", {
                stateName: "historyBillLoadState",
                value: "loadCompleted",
              }),
              console.log("qryFriendHistoryBill--", l),
              r.Z.clear(),
              "000000" === l.retCode && Object.keys(l.rspBody).length > 0
                ? (e("SET_RES_DATA", l.rspBody), e("SET_ERROR_STATUS", !1))
                : ((0, n.Z)(l.retDesc), e("SET_ERROR_STATUS", !0));
          },
        },
      };
    },
    95955: function (e, t, a) {
      "use strict";
      a(26699);
      var n = a(86842),
        o = a.n(n),
        i = a(26090),
        r = a(76507),
        l = a(22709);
      const s = a(86719);
      function c(e, t = "") {
        if ((console.log("paymentValidator0：", e, t), "1" === t)) {
          let t = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(e);
          return console.log("paymentValidator1res：", t), t;
        }
        if ("2" === t) {
          let t = /^\d{4}-\d{2}-\d{2}$/.test(e);
          return console.log("paymentValidator2res：", t), t;
        }
        {
          let t = /^[1-9]\d*$/.test(e);
          return console.log("paymentValidator3res：", t), t;
        }
      }
      function u(e, t) {
        return o()(e).add(t, "day").format("YYYY-MM-DD");
      }
      function d(e, t, a) {
        console.log("isBetweenDates：", e, t, a);
        let n = o()(e).isBetween(o()(t), o()(a), "second");
        return console.log("isBetweenDates res：", n), n;
      }
      o().extend(s),
        (t.Z = {
          namespaced: !0,
          state: {
            balanceOuting: !1,
            balanceShield: !1,
            paymentLogicData: null,
            balanceBillCycleStartDate: null,
            paymentLogicLoadState: "loadInit",
          },
          mutations: {
            SET_PAYMENT_LOGIC_DATA(e, t) {
              e.paymentLogicData = t;
            },
            SET_BALANCE_BILL_CYCLE_START_DATA(e, t) {
              e.balanceBillCycleStartDate = t;
            },
            setLoadState(e, { stateName: t, value: a }) {
              e[t] = a;
            },
            SET_BALANCE_OUTING(e, t) {
              e.balanceOuting = t;
            },
            SET_BALANCE_SHIELD(e, t) {
              e.balanceShield = t;
            },
          },
          actions: {
            async getPaymentLogic(
              { state: e, commit: t, dispatch: a, rootState: n },
              o
            ) {
              const { pageCode: i } = o;
              var s;
              if (e.paymentLogicData)
                "loadCompleted" ===
                  (null === (s = n.pageUseBalance) || void 0 === s
                    ? void 0
                    : s.curBalanceLoadState) && a("setCurrentOrLastBillStatus");
              else
                try {
                  t("setLoadState", {
                    stateName: "paymentLogicLoadState",
                    value: "loading",
                  });
                  let e = await (0, r.EM)(() => (0, l.Z)({ pageCode: i }));
                  var c;
                  if (
                    (console.log(e, "currentBalance--paymentLogic>>>res"),
                    "000000" === e.retCode)
                  )
                    t("SET_PAYMENT_LOGIC_DATA", e.rspBody),
                      "loadCompleted" ===
                        (null === (c = n.pageUseBalance) || void 0 === c
                          ? void 0
                          : c.curBalanceLoadState) &&
                        a("setCurrentOrLastBillStatus");
                  t("setLoadState", {
                    stateName: "paymentLogicLoadState",
                    value: "loadCompleted",
                  });
                } catch (u) {
                  t("setLoadState", {
                    stateName: "paymentLogicLoadState",
                    value: "loadCompleted",
                  }),
                    t("SET_PAYMENT_LOGIC_DATA", ""),
                    console.log("getPaymentLogicDataError--currentBalance:", u);
                }
            },
            setCurrentOrLastBillStatus({
              state: e,
              commit: t,
              getters: a,
              dispatch: n,
              rootGetters: o,
            }) {
              t("SET_BALANCE_OUTING", !1),
                t("SET_BALANCE_SHIELD", !1),
                console.log("setCurrentOrLastBillStatus---billsuse");
              const r = i.Eg[o.pageGroup + "/" + o.pageName],
                l = o[`${r}/monthActiveIndex`];
              if (![0, 1].includes(l)) return;
              if (!e.paymentLogicData) return;
              let {
                currentTime: s,
                currentCount: c,
                currentShieldStart: u,
                currentShieldEnd: d,
                currentOutBillStart: m,
                currentOutBillEnd: p,
                currentOutBillSpan: h,
                currentBlockDays: f,
                currentText: g,
                lastCount: v,
                lastShieldStart: A,
                lastShieldEnd: y,
                lastOutBillStart: T,
                lastOutBillEnd: S,
                lastOutBillSpan: I,
                lastBlockDays: b,
                lastText: C,
              } = e.paymentLogicData;
              n(
                "setBillStatus",
                0 === l
                  ? {
                      currentTime: s,
                      billCount: c,
                      shieldStart: u,
                      shieldEnd: d,
                      outBillStart: m,
                      outBillEnd: p,
                      outBillSpan: h,
                      outDays: f,
                      billText: g,
                    }
                  : {
                      currentTime: s,
                      billCount: v,
                      shieldStart: A,
                      shieldEnd: y,
                      outBillStart: T,
                      outBillEnd: S,
                      outBillSpan: I,
                      outDays: b,
                      billText: C,
                    }
              );
            },
            setBillStatus(
              { state: e, commit: t, dispatch: a },
              {
                currentTime: n,
                billCount: o,
                shieldStart: i,
                shieldEnd: r,
                outBillStart: l,
                outBillEnd: s,
                outBillSpan: u,
                outDays: m,
                billText: p,
              }
            ) {
              console.log("setBillStatus---billsuse");
              try {
                "1" === o && c(i, o) && c(r, o) && d(n, i, r)
                  ? (console.log("余额命中屏蔽期"), t("SET_BALANCE_SHIELD", !0))
                  : "1" === o && c(l, o) && c(s, o) && d(n, l, s)
                  ? (console.log("余额命中出账期"),
                    t(" SET_BALANCE_OUTING", !0))
                  : "2" === o &&
                    a("dynamicBill", {
                      currentTime: n,
                      outBillSpan: u,
                      outDays: m,
                      billText: p,
                    });
              } catch (h) {
                console.log("setBillStatus--error:", h);
              }
            },
            dynamicBill(
              { state: e, commit: t },
              { currentTime: a, outBillSpan: n, outDays: i, billText: r }
            ) {
              if (
                (console.log(
                  "灵活出账--currentBalance，账期开始时间：",
                  e.balanceBillCycleStartDate
                ),
                e.balanceBillCycleStartDate)
              ) {
                var l, s;
                let r =
                    window.serverTime || JSON.stringify(new Date().getTime()),
                  m = o()(Number(r)),
                  p = m.year(),
                  h = (m.month() + 1).toString().padStart(2, "0"),
                  f =
                    null === (l = e.balanceBillCycleStartDate) ||
                    void 0 === l ||
                    null === (s = l.split("-")) ||
                    void 0 === s
                      ? void 0
                      : s[2],
                  g = `${p}-${h}-${f}`,
                  v = c(n) && u(g, n),
                  A = c(i) && u(g, i);
                console.log(
                  "灵活账期5个时间：",
                  a,
                  e.balanceBillCycleStartDate,
                  g,
                  v,
                  A
                ),
                  c(g, "2") && c(A, "2") && d(a, g, A)
                    ? (console.log("灵活账期isBetweenDates 屏蔽期：", a, g, A),
                      t("SET_BALANCE_SHIELD", !0))
                    : c(g, "2") &&
                      c(v, "2") &&
                      d(a, g, v) &&
                      (console.log("灵活账期isBetweenDates  出账期：", a, g, v),
                      t("SET_BALANCE_OUTING", !0));
              }
            },
          },
          getters: {},
        });
    },
    34203: function (e, t, a) {
      "use strict";
      var n = a(2442),
        o = a(79846);
      t.Z = {
        namespaced: !0,
        state: {},
        mutations: {},
        actions: {
          async handleReportUnSubscribeRiskControl(
            { state: e, rootState: t },
            { business: a = {}, riskOtherParams: i = {} }
          ) {
            var r, l, s;
            let {
              businessName: c,
              bizCode: u,
              sPCode: d,
              productCode: m,
              codeType: p,
              instanceId: h,
            } = a;
            const f = t.businessQuery.planType,
              g = t.businessQuery.currentNum,
              v = (0, o._U)(f, g),
              A = {
                phoneNumber: t.userInfo.phoneNumber,
                channel:
                  null !== (r = t.userInfo) && void 0 !== r && r.CHANNEL
                    ? null === (l = t.userInfo) || void 0 === l
                      ? void 0
                      : l.CHANNEL
                    : (null === (s = t.userInfo) || void 0 === s
                        ? void 0
                        : s.channel) || "",
                appFlag: "1",
                busiName: c,
                productType: p || "",
                instanceId: h || "",
                ...v,
              };
            "01" === p
              ? (A.productId = m || "")
              : "02" === p && ((A.spid = d || ""), (A.bizCode = u || "")),
              await (0, n.S)({ ...A, ...i });
          },
          async handleReportUnSubscribeRiskControlNyAndBk(
            { state: e, rootState: t },
            { business: a = {}, riskOtherParams: o = {} }
          ) {
            var i, r, l;
            let {
              businessName: s,
              bizCode: c,
              spid: u,
              bunessCode: d,
              bunessType: m,
              instanceId: p,
            } = a;
            const h = {
              phoneNumber: t.userInfo.phoneNumber,
              channel:
                null !== (i = t.userInfo) && void 0 !== i && i.CHANNEL
                  ? null === (r = t.userInfo) || void 0 === r
                    ? void 0
                    : r.CHANNEL
                  : (null === (l = t.userInfo) || void 0 === l
                      ? void 0
                      : l.channel) || "",
              appFlag: "1",
              busiName: s,
              productType: m || "",
              instanceId: p || "",
            };
            "01" === m
              ? (h.productId = d || "")
              : "02" === m && ((h.spid = u || ""), (h.bizCode = c || "")),
              await (0, n.S)({ ...h, ...o });
          },
        },
      };
    },
    64061: function (e, t, a) {
      "use strict";
      var n = a(30660),
        o = a(89629);
      t.Z = {
        namespaced: !0,
        state: { pointValue: "", scoreQueryLoadState: "loadInit" },
        mutations: {
          setPointValue(e, t) {
            e.pointValue = t;
          },
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
        },
        actions: {
          async reqGetScoreQuery({ commit: e }, t = { isMainApi: !1 }) {
            let a = {};
            try {
              e("setLoadState", {
                stateName: "scoreQueryLoadState",
                value: "loading",
              }),
                (a = t.isMainApi
                  ? await n.Z.getScoreQuery({}, { timeout: 9500 })
                      .then(o.ep)
                      .then(o.um)
                  : await n.Z.getScoreQuery({}, { timeout: 9500 })),
                "000000" === a.retCode && a.rspBody && a.rspBody.pointValue
                  ? e("setPointValue", a.rspBody.pointValue)
                  : e("setPointValue", "--"),
                e("setLoadState", {
                  stateName: "scoreQueryLoadState",
                  value: "loadCompleted",
                });
            } catch (i) {
              e("setPointValue", "--"),
                e("setLoadState", {
                  stateName: "scoreQueryLoadState",
                  value: "loadCompleted",
                }),
                console.log("getScoreQuery error", i);
            }
          },
        },
      };
    },
    63688: function (e, t, a) {
      "use strict";
      a(2490), a(59849), a(59461), a(82499), a(34514), a(9924);
      var n = a(30660),
        o = a(86842),
        i = a.n(o),
        r = a(15222);
      const l = (e, t) => {
        const a = { "03": e / 1048576, "04": e / 1024, "05": e },
          n = a[t] || 0;
        return Number(n.toFixed(2));
      };
      t.Z = {
        namespaced: !0,
        state: { historyComboMealData: [] },
        getters: {
          historicalMonthUsage({ historyComboMealData: e }) {
            if (
              null === e ||
              void 0 === e ||
              !e.length ||
              (null === e || void 0 === e ? void 0 : e.length) < 6
            )
              return {};
            const t = new Array(6)
                .fill(1)
                .map((e, t) =>
                  i()()
                    .subtract(t + 1, "month")
                    .format("YYYYMM")
                )
                .reverse(),
              a = t.map((t) => e.find((e) => e.month === t)).filter((e) => e);
            if (6 !== (null === a || void 0 === a ? void 0 : a.length))
              return {};
            const n = {
              commonFlow: [],
              commonVoice: [],
              commonSms: [],
              flowAvg: 0,
              voiceAvg: 0,
              smsAvg: 0,
              flowOverUsed: !1,
              voiceOverUsed: !1,
            };
            let o = 0,
              s = 0,
              c = 0,
              u = a.length;
            return (
              a.slice(-3).flatMap(({ mealInfoUp: e }) =>
                null === e || void 0 === e
                  ? void 0
                  : e.flatMap(({ mealInfoUpCode: e, mealInfoUpSource: t }) =>
                      null === t || void 0 === t
                        ? void 0
                        : t.map(({ usageAmount: t, classify: a }) => {
                            t > 0 &&
                              ("01" === e && (n.voiceOverUsed = !0),
                              "04" === e &&
                                "02" === a &&
                                (n.flowOverUsed = !0));
                          })
                    )
              ),
              a.forEach(({ month: e, planRemianAll: t }) => {
                let a = 0,
                  i = 0,
                  u = 0;
                (e = parseInt(e.substring(4, 6))),
                  t.forEach(({ resourcesCode: e, planRemianAllList: t }) => {
                    t.forEach(({ usdNum: t, type: n, unit: o }) => {
                      let s = (0, r.q6)(t) ? 0 : t;
                      const c = Number(s);
                      "04" === e && "0" === n && (a += l(c, o)),
                        "01" === e && "0" === n && (i += c),
                        (("02" === e && "0" === n) ||
                          ("03" === e && "1" === n)) &&
                          (u += c);
                    });
                  }),
                  (o += a),
                  (s += i),
                  (c += u),
                  n.commonFlow.push({
                    title: "国内通用流量",
                    unit: "GB",
                    month: e,
                    used: a,
                  }),
                  n.commonVoice.push({
                    title: "国内通用通话",
                    unit: "分钟",
                    month: e,
                    used: Number(i.toFixed(2)),
                  }),
                  n.commonSms.push({
                    title: "短彩信",
                    unit: "条",
                    month: e,
                    used: Number(u.toFixed(2)),
                  });
              }),
              (n.flowAvg = Number((o / u).toFixed(2))),
              (n.voiceAvg = Number((s / u).toFixed(2))),
              (n.smsAvg = Number((c / u).toFixed(2))),
              n
            );
          },
        },
        mutations: {
          setHistoryComboMealData(e, t) {
            e.historyComboMealData = t;
          },
        },
        actions: {
          async getHisComboMealResource({ commit: e }) {
            try {
              let t = new Array(6)
                  .fill(1)
                  .map((e, t) =>
                    i()()
                      .subtract(t + 1, "month")
                      .format("YYYY-MM")
                  )
                  .reverse(),
                a = await n.Z.getHisComboMealResource(
                  { bgnMonth: t[0], endMonth: t[t.length - 1] },
                  { timeout: 9500 }
                );
              return (
                "000000" === a.retCode &&
                  a.rspBody &&
                  a.rspBody.qryInfoRsp &&
                  a.rspBody.qryInfoRsp.hisPlanRemainQryListRes &&
                  e(
                    "setHistoryComboMealData",
                    a.rspBody.qryInfoRsp.hisPlanRemainQryListRes
                  ),
                a
              );
            } catch (t) {
              return console.log("getHisComboMealResource error", t), [];
            }
          },
        },
      };
    },
    23047: function (e, t, a) {
      "use strict";
      a(2490), a(59849), a(34514);
      var n = a(30660),
        o = a(86842),
        i = a.n(o),
        r = a(50813),
        l = a.n(r),
        s = a(15222),
        c = a(58735);
      t.Z = {
        namespaced: !0,
        state: {
          nationalFlowPacketUsageInfoList: null,
          nationalStandardTariffUsageInfoList: null,
          flowInfoQryLoadState: "loadInit",
        },
        getters: {
          internationalFlowData(e, t) {
            var a, n;
            let o = null;
            if (
              (null === (a = e.nationalFlowPacketUsageInfoList) || void 0 === a
                ? void 0
                : a.length) > 0 ||
              (null === (n = e.nationalStandardTariffUsageInfoList) ||
              void 0 === n
                ? void 0
                : n.length) > 0
            ) {
              var i, r;
              if (
                ((o = []),
                (null === (i = e.nationalStandardTariffUsageInfoList) ||
                void 0 === i
                  ? void 0
                  : i.length) > 0)
              ) {
                let t = l()(e.nationalStandardTariffUsageInfoList);
                t.forEach((e) => {
                  var t;
                  (null === (t = e.visitInfoList) || void 0 === t
                    ? void 0
                    : t.length) > 0 &&
                    e.visitInfoList.forEach((t) => {
                      (0, s.q6)(t.visitFlows) ||
                        (t.visitFlows = (0, c.de)(
                          t.visitFlows,
                          "needJudgeValue0ShowUnit"
                        )),
                        (0, s.q6)(e.visitDate) ||
                          (e.visitDate = (0, c.fh)(e.visitDate)),
                        o.push({
                          ...t,
                          visitDate: e.visitDate,
                          flowType: "standardTariff",
                        });
                    });
                });
              }
              if (
                (null === (r = e.nationalFlowPacketUsageInfoList) ||
                void 0 === r
                  ? void 0
                  : r.length) > 0
              ) {
                let t = l()(e.nationalFlowPacketUsageInfoList),
                  a = t.filter(
                    (e) =>
                      ((0, s.D8)(e.allFlows) && 0 !== Number(e.allFlows)) ||
                      ((0, s.D8)(e.alldays) && 0 !== Number(e.alldays))
                  );
                a.length > 0 &&
                  a.forEach((e) => {
                    let t = "0%",
                      a = "",
                      n = "",
                      i = "",
                      r = "",
                      l = "",
                      u = "";
                    try {
                      if ((0, s.D8)(e.alldays) && 0 !== Number(e.alldays)) {
                        (0, s.D8)(e.usedDays) && (0, s.D8)(e.alldays)
                          ? ((t = ((e.usedDays / e.alldays) * 100).toFixed(2)),
                            (t = `${t <= 100 ? t : 100}%`))
                          : (t = "0%");
                        const o =
                            (0, s.D8)(e.usedDays) && 0 === Number(e.usedDays)
                              ? ""
                              : "天",
                          d =
                            (0, s.D8)(e.leftDays) && 0 === Number(e.leftDays)
                              ? ""
                              : "天";
                        (a = (0, s.D8)(e.usedDays) ? e.usedDays + o : "--"),
                          (n = (0, s.D8)(e.leftDays) ? e.leftDays + d : "--"),
                          (i = e.alldays + "天"),
                          (0, s.D8)(e.usedFlows) &&
                            0 !== Number(e.usedFlows) &&
                            ((r = (0, c.de)(
                              e.usedFlows,
                              "needJudgeValue0ShowUnit"
                            )),
                            (l = (0, s.D8)(e.leftFlows)
                              ? (0, c.de)(
                                  e.leftFlows,
                                  "needJudgeValue0ShowUnit"
                                )
                              : ""),
                            (u = (0, s.D8)(e.allFlows)
                              ? (0, c.de)(e.allFlows)
                              : ""));
                      } else
                        (0, s.D8)(e.allFlows) &&
                          0 !== Number(e.allFlows) &&
                          ((0, s.D8)(e.usedFlows) && (0, s.D8)(e.allFlows)
                            ? ((t = ((e.usedFlows / e.allFlows) * 100).toFixed(
                                2
                              )),
                              (t = `${t <= 100 ? t : 100}%`))
                            : (t = "0%"),
                          (a = (0, s.D8)(e.usedFlows)
                            ? (0, c.de)(e.usedFlows, "needJudgeValue0ShowUnit")
                            : "--"),
                          (n = (0, s.D8)(e.leftFlows)
                            ? (0, c.de)(e.leftFlows, "needJudgeValue0ShowUnit")
                            : "--"),
                          (i = (0, c.de)(e.allFlows)));
                    } catch (d) {
                      console.log(
                        "internationalFlowData calculate progress error:",
                        d
                      );
                    }
                    (0, s.q6)(e.prodeffTIMSI) ||
                      (e.prodeffTIMSI = (0, c.fh)(e.prodeffTIMSI)),
                      (0, s.q6)(e.prodexpireTIMSI) ||
                        (e.prodexpireTIMSI = (0, c.fh)(e.prodexpireTIMSI)),
                      (0, s.q6)(e.prodfirstTIMSI) ||
                        (e.prodfirstTIMSI = (0, c.fh)(e.prodfirstTIMSI)),
                      (0, s.q6)(e.prodendTime) ||
                        (e.prodendTime = (0, c.fh)(e.prodendTime)),
                      o.push({
                        ...e,
                        itemUsedValue: a,
                        itemRemainValue: n,
                        itemAllValue: i,
                        usedProgress: t,
                        flowType: "flowPacket",
                        itemUsedValueSecondLine: r,
                        itemRemainValueSecondLine: l,
                        itemAllValueSecondLine: u,
                      });
                  });
              }
              o = o.length > 0 ? o : null;
            }
            return o;
          },
          showInternationalFlowData(e, t) {
            return null !== t.internationalFlowData;
          },
          international20064VoiceData(e, t) {
            var a;
            let n = [];
            return (
              (null === (a = e.nationalFlowPacketUsageInfoList) || void 0 === a
                ? void 0
                : a.length) > 0 &&
                e.nationalFlowPacketUsageInfoList.forEach((e) => {
                  let t = l()(e);
                  if ((0, s.D8)(e.allVoice) && 0 !== Number(e.allVoice)) {
                    if (
                      ((t.is20064Data = !0),
                      (0, s.D8)(e.usedVoice) && (0, s.D8)(e.allVoice))
                    ) {
                      let e = ((t.usedVoice / t.allVoice) * 100).toFixed(2);
                      t.usedProgress = `${e <= 100 ? e : 100}%`;
                    } else t.usedProgress = "0%";
                    (0, s.D8)(e.usedVoice)
                      ? (t.itemUsedValue = e.usedVoice + "分钟")
                      : (t.itemUsedValue = "--"),
                      (0, s.D8)(e.leftVoice)
                        ? (t.itemRemainValue = e.leftVoice + "分钟")
                        : (t.itemRemainValue = "--"),
                      (0, s.D8)(e.allVoice)
                        ? (t.itemAllValue = e.allVoice + "分钟")
                        : (t.itemAllValue = "--"),
                      (0, s.D8)(e.alldays) &&
                        0 !== Number(e.alldays) &&
                        ((t.itemAllValueForDays = e.alldays + "天"),
                        (0, s.D8)(e.usedDays)
                          ? (t.itemUsedValueForDays = e.usedDays + "天")
                          : (t.itemUsedValueForDays = "--"),
                        (0, s.D8)(e.leftDays)
                          ? (t.itemRemainValueForDays = e.leftDays + "天")
                          : (t.itemRemainValueForDays = "--")),
                      (0, s.q6)(t.prodeffTIMSI) ||
                        (t.prodeffTIMSI = (0, c.fh)(t.prodeffTIMSI)),
                      (0, s.q6)(t.prodexpireTIMSI) ||
                        (t.prodexpireTIMSI = (0, c.fh)(t.prodexpireTIMSI)),
                      (0, s.q6)(t.prodfirstTIMSI) ||
                        (t.prodfirstTIMSI = (0, c.fh)(t.prodfirstTIMSI)),
                      (0, s.q6)(t.prodendTime) ||
                        (t.prodendTime = (0, c.fh)(t.prodendTime)),
                      n.push(t);
                  }
                }),
              n
            );
          },
        },
        mutations: {
          setNationalFlowPacketUsageInfoList(e, t) {
            e.nationalFlowPacketUsageInfoList = t;
          },
          setNationalStandardTariffUsageInfoList(e, t) {
            e.nationalStandardTariffUsageInfoList = t;
          },
          setLoadState(e, t) {
            e.flowInfoQryLoadState = t;
          },
        },
        actions: {
          async getFlowInfoQry({ commit: e }) {
            e("setLoadState", "loading");
            let t = {
              currentPeriodStartTm: i()()
                .startOf("month")
                .format("YYYYMMDDHHmmss"),
              currentPeriodEndTm: i()().endOf("month").format("YYYYMMDDHHmmss"),
            };
            try {
              let a = await n.Z.getFlowInfoQry(t, { timeout: 9500 });
              return (
                "000000" === a.retCode &&
                  a.rspBody &&
                  (a.rspBody.flowPacketUsageInfoList &&
                    a.rspBody.flowPacketUsageInfoList.length > 0 &&
                    e(
                      "setNationalFlowPacketUsageInfoList",
                      a.rspBody.flowPacketUsageInfoList
                    ),
                  a.rspBody.standardTariffUsageInfoList &&
                    a.rspBody.standardTariffUsageInfoList.length > 0 &&
                    e(
                      "setNationalStandardTariffUsageInfoList",
                      a.rspBody.standardTariffUsageInfoList
                    )),
                e("setLoadState", "loadCompleted"),
                a
              );
            } catch (a) {
              return (
                e("setLoadState", "loadCompleted"),
                console.log("getFlowInfoQryOld error", a),
                ""
              );
            }
          },
        },
      };
    },
    5039: function (e, t, a) {
      "use strict";
      a(26699), a(2490), a(59461), a(34514), a(41874);
      var n = a(30660),
        o = a(89629),
        i = a(50813),
        r = a.n(i),
        l = a(58735),
        s = a(72856);
      t.Z = {
        namespaced: !0,
        state: {
          newPlanRemainQry: null,
          newPlanRemainQryErrorText: "",
          newPlanRemainQryLoadState: "loadInit",
        },
        getters: {
          planRemainFlow(e) {
            return e.newPlanRemainQry &&
              e.newPlanRemainQry.planRemianFlowListRes
              ? e.newPlanRemainQry.planRemianFlowListRes
              : null;
          },
          show20085FlowDetail(e, t) {
            return !!(
              t.showDomesticCommonFlowDetail ||
              t.showExclusiveFlowDetail ||
              t.showDomesticOtherFlowDetail ||
              t.showWlanFlowDetail
            );
          },
          domesticCommonFlowData(e, t) {
            let a = null;
            return (
              t.planRemainFlow &&
                t.planRemainFlow.planRemianFlowRes &&
                ((a = t.planRemainFlow.planRemianFlowRes.find(
                  (e) => "0" === e.flowtype
                )),
                a && (a = r()(a))),
              a
            );
          },
          domesticCommonFlowOverallData(e, t) {
            let a = null;
            return (
              (t.domesticCommonFlowData || null !== t.outPlanFlowUsageAmount) &&
                ((a = (0, l.Xz)(
                  t.planRemainFlow,
                  t.domesticCommonFlowData,
                  t.outPlanFlowUsageAmount
                )),
                (a.cornerMark = (0, l.cP)(
                  t.planRemainFlow.state,
                  t.outPlanFlowUsageAmount,
                  t.domesticCommonFlowData
                )),
                (a = (0, l.CJ)("国内通用流量", a))),
              a
            );
          },
          showDomesticCommonFlowOverall(e, t) {
            return (
              null !== t.domesticCommonFlowOverallData ||
              (!t.showExclusiveFlowOverall && !t.showDomesticOtherFlowOverall)
            );
          },
          showDomesticCommonFlowDetail(e, t) {
            var a, n, o;
            return (
              (null === (a = t.domesticCommonFlowData) ||
              void 0 === a ||
              null === (n = a.planRemianFlowInfoRes) ||
              void 0 === n
                ? void 0
                : n.some((e) => {
                    var t;
                    return (
                      e.planName ||
                      (Array.isArray(e.flowInfoRes) &&
                        e.flowInfoRes.length > 0 &&
                        (null === (t = e.flowInfoRes[0]) || void 0 === t
                          ? void 0
                          : t.flowName))
                    );
                  })) ||
              (null === (o = t.outPlanFlowData) || void 0 === o
                ? void 0
                : o.some((e) => e.outPlanTitle))
            );
          },
          exclusiveFlowData(e, t) {
            let a = null;
            return (
              t.planRemainFlow &&
                t.planRemainFlow.planRemianFlowRes &&
                ((a = t.planRemainFlow.planRemianFlowRes.find(
                  (e) => "1" === e.flowtype
                )),
                a && (a = r()(a))),
              a
            );
          },
          exclusiveFlowOverallData(e, t) {
            let a = null;
            return (
              t.exclusiveFlowData &&
                ((a = (0, l.yi)(t.planRemainFlow, t.exclusiveFlowData)),
                (a.cornerMark = (0, l.cP)(t.planRemainFlow.state)),
                (a = (0, l.CJ)("定向流量", a))),
              a
            );
          },
          showExclusiveFlowOverall(e, t) {
            return null !== t.exclusiveFlowOverallData;
          },
          showExclusiveFlowDetail(e, t) {
            var a, n;
            return null === (a = t.exclusiveFlowData) ||
              void 0 === a ||
              null === (n = a.planRemianFlowInfoRes) ||
              void 0 === n
              ? void 0
              : n.some((e) => {
                  var t;
                  return (
                    e.planName ||
                    (Array.isArray(e.flowInfoRes) &&
                      e.flowInfoRes.length > 0 &&
                      (null === (t = e.flowInfoRes[0]) || void 0 === t
                        ? void 0
                        : t.flowName))
                  );
                });
          },
          domesticOtherFlowData(e, t) {
            let a = null;
            return (
              t.planRemainFlow &&
                t.planRemainFlow.planRemianFlowRes &&
                ((a = t.planRemainFlow.planRemianFlowRes.find(
                  (e) => "2" === e.flowtype
                )),
                a && (a = r()(a))),
              a
            );
          },
          domesticOtherFlowOverallData(e, t) {
            let a = null;
            return (
              t.domesticOtherFlowData &&
                ((a = (0, l.yi)(t.planRemainFlow, t.domesticOtherFlowData)),
                (a.cornerMark = (0, l.cP)(t.planRemainFlow.state)),
                (a = (0, l.CJ)("国内其他流量", a))),
              a
            );
          },
          showDomesticOtherFlowOverall(e, t) {
            return null !== t.domesticOtherFlowOverallData;
          },
          showDomesticOtherFlowDetail(e, t) {
            var a, n;
            return null === (a = t.domesticOtherFlowData) ||
              void 0 === a ||
              null === (n = a.planRemianFlowInfoRes) ||
              void 0 === n
              ? void 0
              : n.some((e) => {
                  var t;
                  return (
                    e.planName ||
                    (Array.isArray(e.flowInfoRes) &&
                      e.flowInfoRes.length > 0 &&
                      (null === (t = e.flowInfoRes[0]) || void 0 === t
                        ? void 0
                        : t.flowName))
                  );
                });
          },
          wlanFlowData(e, t) {
            let a = null;
            return (
              t.planRemainFlow &&
                t.planRemainFlow.planRemianFlowRes &&
                (a = t.planRemainFlow.planRemianFlowRes.find(
                  (e) => "3" === e.flowtype
                )),
              a
            );
          },
          showWlanFlowDetail(e, t) {
            var a, n;
            return null === (a = t.wlanFlowData) ||
              void 0 === a ||
              null === (n = a.planRemianFlowInfoRes) ||
              void 0 === n
              ? void 0
              : n.some((e) => {
                  var t;
                  return (
                    e.planName ||
                    (Array.isArray(e.flowInfoRes) &&
                      e.flowInfoRes.length > 0 &&
                      (null === (t = e.flowInfoRes[0]) || void 0 === t
                        ? void 0
                        : t.flowName))
                  );
                });
          },
          outPlanFlowData(e, t) {
            var a;
            return (
              (null === (a = t.planRemainFlow) || void 0 === a
                ? void 0
                : a.outPlanInfoRes) || null
            );
          },
          outPlanFlowUsageAmount(e, t) {
            let a = null,
              n = t.outPlanFlowData;
            if (n && n.length > 0) {
              a = 0;
              for (let e in n)
                "1" === n[e].unit || "03" === n[e].unit
                  ? (a += Number(n[e].usageAmount))
                  : "04" === n[e].unit &&
                    (a += 1024 * Number(n[e].usageAmount));
              a = Number(a.toFixed(2));
            }
            return a;
          },
          limitRuleResDesc(e, t, a) {
            var n;
            return ["250"].includes(a.userInfo.loginProvince)
              ? null === (n = t.planRemainFlow) || void 0 === n
                ? void 0
                : n.limitRuleRes
              : null;
          },
          planRemainVoice(e) {
            return e.newPlanRemainQry &&
              e.newPlanRemainQry.planRemianVoiceListRes
              ? e.newPlanRemainQry.planRemianVoiceListRes
              : null;
          },
          domesticCommonVoiceData(e, t) {
            var a;
            let n = null;
            return (
              null !== (a = t.planRemainVoice) &&
                void 0 !== a &&
                a.planRemianVoiceInfoRes &&
                ((n = t.planRemainVoice.planRemianVoiceInfoRes.find(
                  (e) => "0" === e.voicetype
                )),
                n && (n = r()(n))),
              n
            );
          },
          domesticCommonVoiceOverallData(e, t) {
            let a = null;
            return (
              (t.domesticCommonVoiceData ||
                null !== t.outPlanVoiceUsageAmount) &&
                ((a = (0, l.wC)(
                  t.domesticCommonVoiceData,
                  t.outPlanVoiceUsageAmount
                )),
                t.outPlanVoiceUsageAmount && (a.cornerMark = "超套"),
                (a = (0, l.oM)("国内通用通话", a))),
              a
            );
          },
          showDomesticCommonVoiceOverall(e, t) {
            return (
              null !== t.domesticCommonVoiceOverallData ||
              !t.domesticOtherVoiceOverallData
            );
          },
          domesticCommonVoiceDetail(e, t) {
            var a, n;
            return (null === (a = t.domesticCommonVoiceData) ||
            void 0 === a ||
            null === (n = a.planRemianVoiceRes) ||
            void 0 === n
              ? void 0
              : n.length) > 0
              ? t.domesticCommonVoiceData.planRemianVoiceRes
              : null;
          },
          showDomesticCommonVoiceDetail(e, t) {
            var a, n;
            return (
              (null === (a = t.domesticCommonVoiceDetail) || void 0 === a
                ? void 0
                : a.some((e) => {
                    var t, a;
                    return (
                      (e.planName &&
                        (null === (t = e.voiceInfoRes) || void 0 === t
                          ? void 0
                          : t.length) > 0) ||
                      (e.voiceInfoRes &&
                        (null === (a = e.voiceInfoRes) || void 0 === a
                          ? void 0
                          : a.length) > 0 &&
                        e.voiceInfoRes.some((e) => !!e.voiceName))
                    );
                  })) ||
              (null === (n = t.outPlanVoiceData) || void 0 === n
                ? void 0
                : n.some((e) => e.outPlanTitle))
            );
          },
          domesticOtherVoiceData(e, t) {
            var a;
            let n = null;
            return (
              null !== (a = t.planRemainVoice) &&
                void 0 !== a &&
                a.planRemianVoiceInfoRes &&
                ((n = t.planRemainVoice.planRemianVoiceInfoRes.find(
                  (e) => "1" === e.voicetype
                )),
                n && (n = r()(n))),
              n
            );
          },
          domesticOtherVoiceOverallData(e, t) {
            let a = null;
            return (
              t.domesticOtherVoiceData &&
                ((a = (0, l.VW)(t.domesticOtherVoiceData)),
                (a = (0, l.oM)("国内其他通话", a))),
              a
            );
          },
          showDomesticOtherVoiceOverall(e, t) {
            return null !== t.domesticOtherVoiceOverallData;
          },
          domesticOtherVoiceDetail(e, t) {
            var a, n;
            return (null === (a = t.domesticOtherVoiceData) ||
            void 0 === a ||
            null === (n = a.planRemianVoiceRes) ||
            void 0 === n
              ? void 0
              : n.length) > 0
              ? t.domesticOtherVoiceData.planRemianVoiceRes
              : null;
          },
          showDomesticOtherVoiceDetail(e, t) {
            var a;
            return null === (a = t.domesticOtherVoiceDetail) || void 0 === a
              ? void 0
              : a.some((e) => {
                  var t, a;
                  return (
                    (e.planName &&
                      (null === (t = e.voiceInfoRes) || void 0 === t
                        ? void 0
                        : t.length) > 0) ||
                    (e.voiceInfoRes &&
                      (null === (a = e.voiceInfoRes) || void 0 === a
                        ? void 0
                        : a.length) > 0 &&
                      e.voiceInfoRes.some((e) => !!e.voiceName))
                  );
                });
          },
          outPlanVoiceData(e, t) {
            var a;
            return (
              (null === (a = t.planRemainVoice) || void 0 === a
                ? void 0
                : a.outPlanInfoRes) || null
            );
          },
          outPlanVoiceUsageAmount(e, t) {
            let a = null,
              n = t.outPlanVoiceData;
            if (n && n.length > 0) {
              a = 0;
              for (let e in n) a += Number(n[e].usageAmount);
              a += "";
            }
            return a;
          },
          international20085VoiceData(e, t) {
            var a;
            let n = [];
            if (
              null !== (a = t.planRemainVoice) &&
              void 0 !== a &&
              a.planRemianVoiceInfoRes
            ) {
              var o;
              let e = t.planRemainVoice.planRemianVoiceInfoRes.find(
                (e) => "2" === e.voicetype
              );
              if (
                (null === e ||
                void 0 === e ||
                null === (o = e.planRemianVoiceRes) ||
                void 0 === o
                  ? void 0
                  : o.length) > 0
              ) {
                let t = r()(e.planRemianVoiceRes);
                t.forEach((e) => {
                  var t;
                  (null === (t = e.voiceInfoRes) || void 0 === t
                    ? void 0
                    : t.length) > 0 &&
                    e.voiceInfoRes.forEach((t) => {
                      let a = { ...e };
                      (a.voiceInfoRes = t), n.push(a);
                    });
                });
              }
            }
            return n;
          },
          planRemainMSG(e) {
            return e.newPlanRemainQry &&
              e.newPlanRemainQry.planRemianMSGInfoListRes
              ? e.newPlanRemainQry.planRemianMSGInfoListRes
              : null;
          },
          msgOverallData(e, t) {
            var a, n;
            return (null === (a = t.planRemainMSG) ||
            void 0 === a ||
            null === (n = a.planRemianMSGRes) ||
            void 0 === n
              ? void 0
              : n.length) > 0
              ? t.planRemainMSG.planRemianMSGRes
              : null;
          },
          smsOverallData(e, t) {
            return (0, l.h9)("0", t.msgOverallData);
          },
          showSmsOverallData(e, t) {
            return (
              t.smsOverallData.interfaceHasOverallData ||
              !t.mmsOverallData.interfaceHasOverallData
            );
          },
          mmsOverallData(e, t) {
            return (0, l.h9)("1", t.msgOverallData);
          },
          showMmsOverallData(e, t) {
            return (
              t.mmsOverallData.interfaceHasOverallData ||
              !t.smsOverallData.interfaceHasOverallData
            );
          },
          planRemainOther(e) {
            return e.newPlanRemainQry &&
              e.newPlanRemainQry.planRemianOtherListRes
              ? e.newPlanRemainQry.planRemianOtherListRes
              : null;
          },
        },
        mutations: {
          setNewPlanRemainQry(e, t) {
            e.newPlanRemainQry = t;
          },
          setNewPlanRemainQryErrorText(e, t) {
            e.newPlanRemainQryErrorText = t;
          },
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
        },
        actions: {
          async getNewPlanRemainQry(
            { commit: e, rootState: t, rootGetters: a },
            i = { isMainApi: !1 }
          ) {
            let r = {};
            try {
              return (
                e("setLoadState", {
                  stateName: "newPlanRemainQryLoadState",
                  value: "loading",
                }),
                (r = i.isMainApi
                  ? await n.Z.getNewPlanRemainQry({}, { timeout: 9500 })
                      .then(o.ep)
                      .then(o.um)
                  : await n.Z.getNewPlanRemainQry({}, { timeout: 9500 })),
                "000000" === r.retCode
                  ? (r.rspBody &&
                      e("setNewPlanRemainQry", r.rspBody.newPlanRemainQryRes),
                    "app" === t.websiteTarget &&
                      "marginQuery" === a.pageName &&
                      s["default"].commit("market/setReportLingXiData", {
                        dataName: "planRemain",
                        data: r.rspBody,
                      }))
                  : e(
                      "setNewPlanRemainQryErrorText",
                      r.retDesc ||
                        "查询遇到问题，请稍后再试，或联系10086查询。感谢您的理解与支持~"
                    ),
                e("setLoadState", {
                  stateName: "newPlanRemainQryLoadState",
                  value: "loadCompleted",
                }),
                r
              );
            } catch (l) {
              e(
                "setNewPlanRemainQryErrorText",
                "查询遇到问题，请稍后再试，或联系10086查询。感谢您的理解与支持~"
              ),
                e("setLoadState", {
                  stateName: "newPlanRemainQryLoadState",
                  value: "loadCompleted",
                }),
                console.log("getNewPlanRemainQry error", l);
            }
          },
        },
      };
    },
    84975: function (e, t, a) {
      "use strict";
      a(2490), a(59849);
      var n = a(50813),
        o = a.n(n),
        i = a(30660),
        r = a(58735);
      t.Z = {
        namespaced: !0,
        state: {
          userShareInfo: [],
          needShowMainCardShareOverallInFlowTabArea: !1,
          needShowSubCardShareOverallInFlowTabArea: !1,
          needShowMainCardShareOverallInVoiceTabArea: !1,
          needShowSubCardShareOverallInVoiceTabArea: !1,
          shareFlowOverallData: null,
          shareVoiceOverallData: null,
          shareFlowDetailData: null,
          shareVoiceDetailData: null,
          shareUserInfoLoadState: "loadInit",
        },
        mutations: {
          setUserShareInfo(e, t) {
            e.userShareInfo = t;
          },
          setNeedShowMainCardShareOverallInFlowTabArea(e, t) {
            e.needShowMainCardShareOverallInFlowTabArea = t;
          },
          setNeedShowSubCardShareOverallInFlowTabArea(e, t) {
            e.needShowSubCardShareOverallInFlowTabArea = t;
          },
          setNeedShowMainCardShareOverallInVoiceTabArea(e, t) {
            e.needShowMainCardShareOverallInVoiceTabArea = t;
          },
          setNeedShowSubCardShareOverallInVoiceTabArea(e, t) {
            e.needShowSubCardShareOverallInVoiceTabArea = t;
          },
          setShareFlowOverallData(e, t) {
            e.shareFlowOverallData = t;
          },
          setShareVoiceOverallData(e, t) {
            e.shareVoiceOverallData = t;
          },
          setShareFlowDetailData(e, t) {
            e.shareFlowDetailData = t;
          },
          setShareVoiceDetailData(e, t) {
            e.shareVoiceDetailData = t;
          },
          setLoadState(e, t) {
            e.shareUserInfoLoadState = t;
          },
        },
        actions: {
          async getUserShareInfo({ commit: e, dispatch: t }) {
            try {
              e("setLoadState", "loading");
              let a = await i.Z.getUserShareInfo({ timeout: 9500 });
              if (
                "000000" === a.retCode &&
                a.rspBody &&
                a.rspBody.userShareInfoRes &&
                a.rspBody.userShareInfoRes.length > 0
              ) {
                let n = a.rspBody.userShareInfoRes.filter(
                  (e) => "0" == e.cardstate || "1" == e.cardstate
                );
                e("setUserShareInfo", n),
                  t("getShareOverallAreaData"),
                  t("getShowShareInTabAreaData"),
                  t("getShareDetailInfo");
              }
              return e("setLoadState", "loadCompleted"), a;
            } catch (a) {
              return (
                e("setLoadState", "loadCompleted"),
                console.log("getUserShareInfo error", a),
                []
              );
            }
          },
          getShareOverallAreaData({
            state: e,
            getters: t,
            commit: a,
            rootState: n,
          }) {
            if (e.userShareInfo && e.userShareInfo.length > 0) {
              const t = (0, r.rs)(
                  o()(e.userShareInfo),
                  "0",
                  "04",
                  n.userInfo.phoneNumber
                ),
                i = (0, r.rs)(
                  o()(e.userShareInfo),
                  "1",
                  "04",
                  n.userInfo.phoneNumber
                ),
                l = { mainShareFlowOverallData: t, subShareFlowOverallData: i };
              a("setShareFlowOverallData", l);
              const s = (0, r.rs)(
                  o()(e.userShareInfo),
                  "0",
                  "01",
                  n.userInfo.phoneNumber
                ),
                c = (0, r.rs)(
                  o()(e.userShareInfo),
                  "1",
                  "01",
                  n.userInfo.phoneNumber
                ),
                u = {
                  mainShareVoiceOverallData: s,
                  subShareVoiceOverallData: c,
                };
              a("setShareVoiceOverallData", u);
            }
          },
          getShowShareInTabAreaData({ state: e, commit: t, rootState: a }) {
            let n = (0, r.bb)({
              userShareInfo: e.userShareInfo,
              resourcesCode: "04",
              phoneNumber: a.userInfo.phoneNumber,
            });
            t(
              "setNeedShowMainCardShareOverallInFlowTabArea",
              n.isShowMainShareData
            ),
              t(
                "setNeedShowSubCardShareOverallInFlowTabArea",
                n.isShowSubShareData
              );
            let o = (0, r.bb)({
              userShareInfo: e.userShareInfo,
              resourcesCode: "01",
              phoneNumber: a.userInfo.phoneNumber,
            });
            t(
              "setNeedShowMainCardShareOverallInVoiceTabArea",
              o.isShowMainShareData
            ),
              t(
                "setNeedShowSubCardShareOverallInVoiceTabArea",
                o.isShowSubShareData
              );
          },
          getShareDetailInfo({ state: e, commit: t, rootState: a }) {
            let n = (0, r.ZA)({
              userShareInfo: o()(e.userShareInfo),
              resourcesCode: "04",
              phoneNumber: a.userInfo.phoneNumber,
            });
            t("setShareFlowDetailData", n);
            let i = (0, r.ZA)({
              userShareInfo: o()(e.userShareInfo),
              resourcesCode: "01",
              phoneNumber: a.userInfo.phoneNumber,
            });
            t("setShareVoiceDetailData", i);
          },
        },
      };
    },
    24631: function (e, t, a) {
      "use strict";
      a(2490), a(34514);
      var n = a(15222),
        o = a(86842),
        i = a.n(o);
      t.Z = {
        namespaced: !0,
        state: {
          currentItem: "",
          dataArr: [],
          overRangeMonth: !1,
          yearMonthAnchorValue: "",
        },
        getters: {
          monthActiveIndex(e) {
            let t = 0;
            return (
              e.dataArr.forEach((a, n) => {
                a.year === e.currentItem.year &&
                  a.month === e.currentItem.month &&
                  (console.log(n, "index>>>>"), (t = n));
              }),
              t
            );
          },
        },
        mutations: {
          SET_CURRENT_ITEM(e, t) {
            e.currentItem = t;
          },
          SET_DATA_ARR(e, t) {
            e.dataArr = t;
          },
          SET_OVER_RANGE_MONTH(e, t) {
            e.overRangeMonth = t;
          },
          SET_YEAR_MONTH_ANCHOR_VALUE(e, t) {
            e.yearMonthAnchorValue = t;
          },
        },
        actions: {
          setMonth({ commit: e }, t) {
            let a = window.serverTime || JSON.stringify(new Date().getTime()),
              o = i()(Number(a)),
              r = [],
              l = t || 13;
            for (let n = 0; n < l; n++)
              r.push({
                year: o.year().toString(),
                month: (o.month() + 1).toString(),
              }),
                (o = o.subtract(1, "month"));
            console.log("dataArr--", r), e("SET_DATA_ARR", r);
            let s = { year: "", month: "" };
            if ((0, n.eY)("yearMonth")) {
              let t = (0, n.eY)("yearMonth").split("-");
              console.log("yearMonth queryArr--", t);
              let a = r.some((e) => {
                if (
                  Number(t[0]) === Number(e.year) &&
                  Number(t[1]) === Number(e.month)
                )
                  return (s = e), !0;
              });
              console.log("yearMonth monthExist--", a),
                a || (e("SET_OVER_RANGE_MONTH", !0), (s = r[0])),
                console.log("yearMonth currentItem--", s);
            } else if ((0, n.eY)("lastMonth"))
              (s = r[1]), console.log("lastMonth currentItem--", s);
            else if ((0, n.eY)("relativemonth")) {
              let e = Number((0, n.eY)("relativemonth"));
              (e > 12 || e < 0) && (e = 0),
                console.log("relativeMonth num--", e),
                (s = r[e]),
                console.log("relativeMonth currentItem--", s);
            } else (s = r[0]), console.log("default currentItem--", s);
            e("SET_CURRENT_ITEM", s);
          },
        },
      };
    },
    36309: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return g;
        },
      });
      a(26699), a(2490), a(59461), a(34514);
      var n = a(30660),
        o = a(86842),
        i = a.n(o),
        r = a(72856),
        l = a(51579),
        s = a(75150),
        c = a(15222),
        u = a(16456),
        d = a(83587);
      const m = (e) =>
        (0, u.Z)({
          url: d.OC + "SHS/balance/getBalanceRule",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      var p = a(76507),
        h = a(26090);
      function f(e) {
        const { version: t } = e;
        return (
          console.log("version:", t),
          Boolean(
            t &&
              (Number(t.substring(0, t.indexOf(".") + 2)) >= 9.6 ||
                parseFloat(t) >= 9.6)
          )
        );
      }
      var g = {
        namespaced: !0,
        state: {
          accountInformation: {
            monthBill: "--",
            method: null,
            specialTTZ: null,
          },
          allThisMonthBill: "--",
          feeInfo: { show: !1, owefee: 0 },
          otherFeeInfo: null,
          balanceDataLoadState: "loadInit",
          curBalanceLoadState: "loadInit",
        },
        getters: {
          switchBalanceRule(e, t, a) {
            var n;
            console.log(a, "rootState");
            let o = f(a.userInfo),
              i = "";
            var r;
            null !== (n = a.remoteState) &&
              void 0 !== n &&
              n.CMCC_PhoneBill_BalanceRule &&
              (i = JSON.parse(
                null === (r = a.remoteState) || void 0 === r
                  ? void 0
                  : r.CMCC_PhoneBill_BalanceRule
              ));
            let l = a.userInfo.loginProvince;
            return (
              console.log("isVersion96:", o, i, l, i[l]),
              o && l && i[l] ? i[l] : { switchType: "0", type: "1" }
            );
          },
        },
        mutations: {
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
          SET_ACCOUNT_INFORMATION(e, t) {
            console.log("SET_ACCOUNT_INFORMATION", t),
              (e.accountInformation = t);
          },
          SET_ALL_THIS_MONTH_BILL(e, t) {
            e.allThisMonthBill = t;
          },
          SET_FEE_INFO(e, t) {
            e.feeInfo = t;
          },
          SET_OTHER_FEE_INFO(e, t) {
            e.otherFeeInfo = t;
          },
        },
        actions: {
          async accountRuleCalculation(
            { rootState: e, getters: t, dispatch: a },
            n = ""
          ) {
            console.log(e, "rootState--pageUseBalance--");
            let o = await (0, s.Z)("login", () =>
                r["default"].dispatch("login/login")
              ),
              { version: i } = o;
            if (
              (console.log(i, -1 === (0, c.yC)("9.9.5", i), "版本比较》》》"),
              e.login.isTouch && -1 === (0, c.yC)("9.9.5", i))
            )
              return a("getBalanceOld");
            {
              let e = "",
                o = "";
              if ("redis" === n)
                ({ switchType: e, type: o } = t.switchBalanceRule);
              else {
                let t = await (0, p.EM)(() => m());
                "000000" === t.retCode &&
                  ({ switchType: e, type: o } = t.rspBody);
              }
              return (
                console.log("switchType, type:", e, o),
                "0" === e
                  ? a("getBalanceOld")
                  : "1" === e
                  ? a("getBalanceNew", o)
                  : Promise.resolve({ busCode: "", messageBody: "" })
              );
            }
          },
          async getBalanceOld({ state: e, commit: t }) {
            t("setLoadState", {
              stateName: "balanceDataLoadState",
              value: "loading",
            }),
              t("setLoadState", {
                stateName: "curBalanceLoadState",
                value: "loading",
              });
            let a = "--",
              o = {};
            try {
              o = await n.Z.getRealFee({}, { timeout: 9500 });
            } catch (i) {
              t("setLoadState", {
                stateName: "balanceDataLoadState",
                value: "loadCompleted",
              }),
                t("setLoadState", {
                  stateName: "curBalanceLoadState",
                  value: "loadCompleted",
                }),
                console.log("getRealFee error", i);
            }
            if (
              (t("setLoadState", {
                stateName: "curBalanceLoadState",
                value: "loadCompleted",
              }),
              console.log("getRealFrr", o),
              "000000" === o.retCode)
            ) {
              let { realBalanceFee: e, curFee: n } = o.rspBody;
              return (
                (a = e || n),
                t("SET_ACCOUNT_INFORMATION", {
                  monthBill: a,
                  method: 0,
                  specialTTZ: "N",
                }),
                t("setLoadState", {
                  stateName: "balanceDataLoadState",
                  value: "loadCompleted",
                }),
                Promise.resolve({
                  busCode: "20016",
                  messageBody: JSON.stringify(o.rspBody),
                })
              );
            }
            return (
              t("SET_ACCOUNT_INFORMATION", {
                monthBill: "--",
                method: 0,
                specialTTZ: "N",
              }),
              t("setLoadState", {
                stateName: "balanceDataLoadState",
                value: "loadCompleted",
              }),
              Promise.resolve({ busCode: "20016", messageBody: "" })
            );
          },
          async getBalanceNew({ commit: e, rootGetters: t, rootState: a }, o) {
            e("setLoadState", {
              stateName: "balanceDataLoadState",
              value: "loading",
            }),
              e("setLoadState", {
                stateName: "curBalanceLoadState",
                value: "loading",
              });
            let l,
              s = window.serverTime || JSON.stringify(new Date().getTime()),
              c = i()(Number(s)).format("YYYY-MM"),
              u = "phoneBills" === t.pageName,
              d = {},
              m = "";
            try {
              var p, h, f;
              (d = await n.Z.getAccountInfo(
                { beginMonth: c, endMonth: c },
                { timeout: 9500 }
              )),
                (m =
                  (null === (p = d.rspBody) ||
                  void 0 === p ||
                  null === (h = p.accoutQryInfoHis) ||
                  void 0 === h ||
                  null === (f = h[0]) ||
                  void 0 === f
                    ? void 0
                    : f.billCycleStartDate) || ""),
                m &&
                  u &&
                  r["default"].commit(
                    "billsUseBalancePayment/SET_BALANCE_BILL_CYCLE_START_DATA",
                    i()(m).format("YYYY-MM-DD")
                  );
            } catch (A) {
              e("setLoadState", {
                stateName: "balanceDataLoadState",
                value: "loadCompleted",
              }),
                e("setLoadState", {
                  stateName: "curBalanceLoadState",
                  value: "loadCompleted",
                }),
                console.log("getAccountInfo error", A);
            }
            if (
              (e("setLoadState", {
                stateName: "curBalanceLoadState",
                value: "loadCompleted",
              }),
              console.log("getBalanceAccount返回值", d),
              "000000" === d.retCode)
            ) {
              var g;
              let e = o || 1,
                t = "",
                n = "",
                i = "",
                s = "",
                c = "";
              switch (
                (d.rspBody.accoutQryInfoHis.forEach((e) => {
                  e.specialTTZ || (e.specialTTZ = 10),
                    (c = e.specialTTZ),
                    e.accoutQryInfo &&
                      e.accoutQryInfo.forEach((a) => {
                        "0" === e.accoutType
                          ? ("0" === a.accoutState && (i = a.thisMonthBill),
                            (s = e.allThisMonthBill))
                          : ("0" === a.accoutState && (t = a.thisMonthBill),
                            (n = e.allThisMonthBill));
                      });
                }),
                Number(e))
              ) {
                case 2:
                  l = { monthBill: n || s || "--", specialTTZ: c, method: 1 };
                  break;
                case 3:
                  (n = n || "--"), (s = s || "--");
                  let e = s;
                  "--" !== n && (e = Number(n) + Number(s)),
                    (l = { monthBill: e, specialTTZ: c, method: 1 });
                  break;
                case 4:
                  (t = t || "--"), (i = i || "--");
                  let a = i;
                  "--" !== t && (a = Number(t) + Number(i)),
                    (l = { monthBill: a, specialTTZ: c, method: 1 });
                  break;
                default:
                  l = { monthBill: t || i || "--", specialTTZ: c, method: 1 };
                  break;
              }
              null !== (g = a.billsUseBalancePayment) &&
                void 0 !== g &&
                g.paymentLogicData &&
                r["default"].dispatch(
                  "billsUseBalancePayment/setCurrentOrLastBillStatus"
                );
            } else {
              var v;
              (l = { monthBill: "--", specialTTZ: 10, method: 1 }),
                null !== (v = a.billsUseBalancePayment) &&
                  void 0 !== v &&
                  v.paymentLogicData &&
                  r["default"].dispatch(
                    "billsUseBalancePayment/setCurrentOrLastBillStatus"
                  );
            }
            return (
              e("SET_ACCOUNT_INFORMATION", l),
              e("setLoadState", {
                stateName: "balanceDataLoadState",
                value: "loadCompleted",
              }),
              Promise.resolve(
                "000000" === d.retCode
                  ? { busCode: "20073", messageBody: JSON.stringify(d.rspBody) }
                  : { busCode: "20073", messageBody: "" }
              )
            );
          },
          async getAccountInfoBalance({
            commit: e,
            rootState: t,
            rootGetters: a,
          }) {
            var o;
            const i = h.Eg[a.pageGroup + "/" + a.pageName],
              r = a[`${i}/monthActiveIndex`],
              l = null === (o = t[i]) || void 0 === o ? void 0 : o.currentItem;
            let s = t.userInfo;
            if (r > 0) {
              let a = l.year + "-" + l.month.padStart(2, "0"),
                o = null;
              try {
                var c;
                e("setLoadState", {
                  stateName: "balanceDataLoadState",
                  value: "loading",
                }),
                  (o = await n.Z.getAccountInfo(
                    { beginMonth: a, endMonth: a },
                    { timeout: 9500 }
                  ));
                let r =
                    null === (c = t[i]) || void 0 === c
                      ? void 0
                      : c.currentItem,
                  l = r.year + "-" + r.month.padStart(2, "0");
                if (a !== l)
                  return void console.log(
                    "getAccountInfoBalance非最新的数据，舍弃"
                  );
              } catch (A) {
                e("setLoadState", {
                  stateName: "balanceDataLoadState",
                  value: "loadCompleted",
                }),
                  console.log(A);
              }
              if (
                (console.log("getAccountInfo", o),
                ["250"].includes(s.loginProvince))
              ) {
                var u, d, m;
                let t =
                  (null === (u = o) ||
                  void 0 === u ||
                  null === (d = u.rspBody) ||
                  void 0 === d ||
                  null === (m = d.accoutQryInfoHis[0]) ||
                  void 0 === m
                    ? void 0
                    : m.allThisMonthBill) || "--";
                e("SET_ALL_THIS_MONTH_BILL", t);
              } else {
                var p, f, g, v;
                let t =
                  null === (p = o) ||
                  void 0 === p ||
                  null === (f = p.rspBody) ||
                  void 0 === f ||
                  null === (g = f.accoutQryInfoHis[0]) ||
                  void 0 === g ||
                  null === (v = g.accoutQryInfo) ||
                  void 0 === v
                    ? void 0
                    : v.find((e) => "0" === e.accoutState);
                if (t && "owefee" in t) {
                  let a = { show: !0, owefee: t.owefee };
                  e("SET_FEE_INFO", a);
                } else {
                  let t = { show: !1, owefee: 0 };
                  e("SET_FEE_INFO", t);
                }
              }
              e("setLoadState", {
                stateName: "balanceDataLoadState",
                value: "loadCompleted",
              });
            }
          },
          async getRealFeeBalance({
            commit: e,
            state: t,
            rootState: a,
            rootGetters: o,
          }) {
            const i = h.Eg[o.pageGroup + "/" + o.pageName],
              r = o[`${i}/monthActiveIndex`];
            if (1 === r && !t.otherFeeInfo) {
              e("setLoadState", {
                stateName: "balanceDataLoadState",
                value: "loading",
              });
              try {
                var s;
                let t = await n.Z.getRealFee({}, { timeout: 9500 }),
                  a =
                    null === t ||
                    void 0 === t ||
                    null === (s = t.rspBody) ||
                    void 0 === s
                      ? void 0
                      : s.otherFeeInfo;
                a && (0, l.isArray)(a) && a[0] && e("SET_OTHER_FEE_INFO", a[0]);
              } catch (c) {
                console.log("广东上月逻辑请求getRealFee:error", c);
              } finally {
                e("setLoadState", {
                  stateName: "balanceDataLoadState",
                  value: "loadCompleted",
                });
              }
            }
          },
        },
      };
    },
    63809: function (e, t, a) {
      "use strict";
      a(26699);
      var n = a(86842),
        o = a.n(n),
        i = a(22709),
        r = a(26090),
        l = a(76507);
      function s(e, t = "") {
        if ((console.log("paymentValidator0：", e, t), "1" === t)) {
          let t = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(e);
          return console.log("paymentValidator1res：", t), t;
        }
        if ("2" === t) {
          let t = /^\d{4}-\d{2}-\d{2}$/.test(e);
          return console.log("paymentValidator2res：", t), t;
        }
        {
          let t = /^[1-9]\d*$/.test(e);
          return console.log("paymentValidator3res：", t), t;
        }
      }
      function c(e, t) {
        return o()(e).add(t, "day").format("YYYY-MM-DD");
      }
      function u(e, t, a) {
        console.log("isBetweenDates：", e, t, a);
        let n = o()(e).isBetween(o()(t), o()(a), "second");
        return console.log("isBetweenDates res：", n), n;
      }
      t.Z = {
        namespaced: !0,
        state: {
          isShield: !1,
          isOuting: !1,
          paymentBillMsg: "",
          paymentLogicData: null,
          paymentLogicLoadState: "loadInit",
          defaultPaymentMsg:
            "出账中，暂无法查询。请于出账后再试，感谢您的理解与支持~ ",
          billCycleStartDate: null,
          mainReqEnd: !1,
        },
        mutations: {
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
          SET_IS_SHIELD(e, t) {
            e.isShield = t;
          },
          SET_IS_OUTING(e, t) {
            e.isOuting = t;
          },
          SET_PAYMENT_LOGIC_DATA(e, t) {
            e.paymentLogicData = t;
          },
          SET_PAYMENT_BILL_MSG(e, t) {
            e.paymentBillMsg = t;
          },
          SET_BILL_CYCLE_START_DATA(e, t) {
            e.billCycleStartDate = t;
          },
          SET_MAIN_REQ_END(e, t) {
            e.mainReqEnd = t;
          },
        },
        actions: {
          async getPaymentLogic(
            { state: e, commit: t, dispatch: a, rootState: n },
            o
          ) {
            const { pageCode: r } = o;
            if (e.paymentLogicData)
              e.mainReqEnd && a("setCurrentOrLastBillStatus");
            else
              try {
                t("setLoadState", {
                  stateName: "paymentLogicLoadState",
                  value: "loading",
                });
                let o = {};
                "app" === n.websiteTarget
                  ? ((o = await (0, l.EM)(() => (0, i.Z)({ pageCode: r }))),
                    "000000" === o.retCode &&
                      (t("SET_PAYMENT_LOGIC_DATA", o.rspBody),
                      e.mainReqEnd && a("setCurrentOrLastBillStatus")))
                  : "qqd" === n.websiteTarget &&
                    ((o = n.remoteState.WMH_PhoneBills_PaymentLogic),
                    o &&
                      (t("SET_PAYMENT_LOGIC_DATA", o),
                      a("setCurrentOrLastBillStatus"))),
                  t("setLoadState", {
                    stateName: "paymentLogicLoadState",
                    value: "loadCompleted",
                  }),
                  console.log("出账期res：", o);
              } catch (s) {
                t("setLoadState", {
                  stateName: "paymentLogicLoadState",
                  value: "loadCompleted",
                }),
                  t("SET_PAYMENT_LOGIC_DATA", ""),
                  console.log("getPaymentLogicDataError:", s);
              }
          },
          setCurrentOrLastBillStatus({
            state: e,
            commit: t,
            rootGetters: a,
            dispatch: n,
          }) {
            t("SET_IS_SHIELD", !1),
              t("SET_IS_OUTING", !1),
              console.log("账期计算开始执行");
            const o = r.Eg[a.pageGroup + "/" + a.pageName],
              i = a[`${o}/monthActiveIndex`];
            if (![0, 1].includes(i)) return;
            if (!e.paymentLogicData) return;
            let {
              currentTime: l,
              currentCount: s,
              currentShieldStart: c,
              currentShieldEnd: u,
              currentOutBillStart: d,
              currentOutBillEnd: m,
              currentOutBillSpan: p,
              currentBlockDays: h,
              currentText: f,
              lastCount: g,
              lastShieldStart: v,
              lastShieldEnd: A,
              lastOutBillStart: y,
              lastOutBillEnd: T,
              lastOutBillSpan: S,
              lastBlockDays: I,
              lastText: b,
            } = e.paymentLogicData;
            n(
              "setBillStatus",
              0 === i
                ? {
                    currentTime: l,
                    billCount: s,
                    shieldStart: c,
                    shieldEnd: u,
                    outBillStart: d,
                    outBillEnd: m,
                    outBillSpan: p,
                    outDays: h,
                    billText: f,
                  }
                : {
                    currentTime: l,
                    billCount: g,
                    shieldStart: v,
                    shieldEnd: A,
                    outBillStart: y,
                    outBillEnd: T,
                    outBillSpan: S,
                    outDays: I,
                    billText: b,
                  }
            );
          },
          setBillStatus(
            { state: e, commit: t, dispatch: a },
            {
              currentTime: n,
              billCount: o,
              shieldStart: i,
              shieldEnd: r,
              outBillStart: l,
              outBillEnd: c,
              outBillSpan: d,
              outDays: m,
              billText: p,
            }
          ) {
            console.log("currentTime", n),
              console.log("billCount", o),
              console.log("shieldStart", i),
              console.log("shieldEnd", r),
              console.log("outBillStart", l);
            try {
              "1" === o && s(i, o) && s(r, o) && u(n, i, r)
                ? (console.log("屏蔽期"),
                  t("SET_PAYMENT_BILL_MSG", p || e.defaultPaymentMsg),
                  t("SET_IS_SHIELD", !0))
                : "1" === o && s(l, o) && s(c, o) && u(n, l, c)
                ? (console.log("出账期"),
                  t("SET_PAYMENT_BILL_MSG", p || e.defaultPaymentMsg),
                  t("SET_IS_OUTING", !0))
                : "2" === o &&
                  a("dynamicBill", {
                    currentTime: n,
                    outBillSpan: d,
                    outDays: m,
                    billText: p,
                  });
            } catch (h) {
              console.log("setBillStatus--error:", h),
                t("SET_PAYMENT_BILL_MSG", "");
            }
          },
          dynamicBill(
            { state: e, commit: t },
            { currentTime: a, outBillSpan: n, outDays: i, billText: r }
          ) {
            if (
              (console.log("灵活出账，账期开始时间：", e.billCycleStartDate),
              e.billCycleStartDate)
            ) {
              var l, d;
              let m = window.serverTime || JSON.stringify(new Date().getTime()),
                p = o()(Number(m)),
                h = p.year(),
                f = (p.month() + 1).toString().padStart(2, "0"),
                g =
                  null === (l = e.billCycleStartDate) ||
                  void 0 === l ||
                  null === (d = l.split("-")) ||
                  void 0 === d
                    ? void 0
                    : d[2],
                v = `${h}-${f}-${g}`,
                A = s(n) && c(v, n),
                y = s(i) && c(v, i);
              console.log(
                "灵活账期5个时间：",
                a,
                e.billCycleStartDate,
                v,
                A,
                y
              ),
                s(v, "2") && s(y, "2") && u(a, v, y)
                  ? (console.log("灵活账期isBetweenDates 屏蔽期：", a, v, y),
                    t("SET_PAYMENT_BILL_MSG", r || e.defaultPaymentMsg),
                    t("SET_IS_SHIELD", !0))
                  : s(v, "2") &&
                    s(A, "2") &&
                    u(a, v, A) &&
                    (console.log("灵活账期isBetweenDates 出账期：", a, v, A),
                    t("SET_PAYMENT_BILL_MSG", r || e.defaultPaymentMsg),
                    t("SET_IS_OUTING", !0));
            } else t("SET_PAYMENT_BILL_MSG", "");
          },
        },
      };
    },
    26873: function (e, t, a) {
      "use strict";
      a(2490), a(59849);
      var n = a(30660),
        o = a(89629),
        i = a(15222);
      t.Z = {
        namespaced: !0,
        state: {
          wbInfo: null,
          personalInfoErrorText: "",
          personalInfoLoadState: "loadInit",
        },
        mutations: {
          wbInfo(e, t) {
            e.wbInfo = t;
          },
          setPersonalInfoErrorText(e, t) {
            e.personalInfoErrorText = t;
          },
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
        },
        actions: {
          async getPersonalInfo(
            { commit: e, state: t },
            a = { isMainApi: !1, isRefreshRequest: !1 }
          ) {
            if ("loadInit" !== t.personalInfoLoadState) return t.wbInfo;
            e("setLoadState", {
              stateName: "personalInfoLoadState",
              value: "loading",
            });
            let r = {};
            try {
              var l;
              if (
                ((r = a.isMainApi
                  ? await n.Z.getPersonalInfo({}, { timeout: 9500 })
                      .then(o.ep)
                      .then(o.um)
                  : await n.Z.getPersonalInfo({}, { timeout: 9500 })),
                "000000" === r.retCode)
              ) {
                if (r.rspBody)
                  if (
                    (null === (l = r.rspBody.wbInfor) || void 0 === l
                      ? void 0
                      : l.length) > 0
                  ) {
                    const t = r.rspBody.wbInfor.filter((e) =>
                      (0, i.D8)(e.maxRate)
                    ).length
                      ? r.rspBody.wbInfor.filter((e) => (0, i.D8)(e.maxRate))
                      : [{ ...r.rspBody.wbInfor[0], maxRate: "暂无数据" }];
                    e("wbInfo", t);
                  } else e("wbInfo", []);
              } else
                ("910000" !== r.retCode && "900000" !== r.retCode) ||
                  e("setPersonalInfoErrorText", r.retDesc);
              return (
                e("setLoadState", {
                  stateName: "personalInfoLoadState",
                  value: "loadCompleted",
                }),
                r
              );
            } catch (s) {
              e("setLoadState", {
                stateName: "personalInfoLoadState",
                value: "loadCompleted",
              }),
                console.log("getPersonalInfo error", s);
            }
          },
        },
      };
    },
    4715: function (e, t, a) {
      "use strict";
      a(26699), a(2490), a(34514);
      var n = a(30660),
        o = a(86842),
        i = a.n(o),
        r = a(72856),
        l = a(89629),
        s = a(67817),
        c = a(26090);
      t.Z = {
        namespaced: !0,
        state: {
          isError: !1,
          historyBillInfo: {},
          copyWriting: "",
          personBillInfo: "",
          defaultErrorMsg:
            "查询遇到问题，请稍后再试，或联系10086查询。感谢您的理解与支持~",
          newBillsLoadState: "loadInit",
          billInfoAll: null,
        },
        getters: {},
        mutations: {
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
          SET_HISTORY_BILL_INFO(e, t) {
            console.log("SET_HISTORY_BILL_INFO", e, t), (e.historyBillInfo = t);
          },
          SET_IS_ERROR(e, t) {
            e.isError = t;
          },
          SET_COPY_WRITING(e, t) {
            e.copyWriting = t;
          },
          SET_PERSON_BILL_INFO(e, t) {
            console.log(t, "personBillInfo>>>"), (e.personBillInfo = t);
          },
          SET_BILL_INFO_ALL(e, t) {
            e.billInfoAll = t;
          },
          SET_BILL_INFO_ITEM(e, { index: t, name: a, data: n }) {
            e.billInfoAll.billInfolist[t][a] = n;
          },
        },
        actions: {
          async getNewBills(
            { commit: e, rootState: t, state: a, rootGetters: o, getters: u },
            d = !1
          ) {
            var m;
            e("setLoadState", {
              stateName: "newBillsLoadState",
              value: "loading",
            }),
              e("SET_PERSON_BILL_INFO", ""),
              e("SET_BILL_INFO_ALL", null),
              e("SET_HISTORY_BILL_INFO", {});
            const p = c.Eg[o.pageGroup + "/" + o.pageName];
            let h =
                null === (m = t[p]) || void 0 === m ? void 0 : m.currentItem,
              f = !["lite", "extra"].includes(o.pageGroup);
            console.log("获取选中的年月item:", h);
            let g = h.year + "-" + h.month.padStart(2, "0");
            "main" === o.pageGroup &&
              r["default"].commit(
                "monthSelectInfo/SET_YEAR_MONTH_ANCHOR_VALUE",
                g
              );
            try {
              var v;
              const c = Date.now();
              let u = await n.Z.getNewBills(
                { bgnMonth: g, endMonth: g },
                { timeout: 9500 }
              )
                .then(l.ep)
                .then(l.um);
              const m = Date.now(),
                h = m - c;
              console.log("store getNewBills", u);
              let M =
                  null === (v = t[p]) || void 0 === v ? void 0 : v.currentItem,
                W = M.year + "-" + M.month.padStart(2, "0");
              if (g !== W)
                return void console.log("getNewBills非最新的数据，舍弃");
              try {
                var A, y, T;
                if (f) {
                  var S, I, b;
                  let e =
                    (null === (S = u.rspBody) ||
                    void 0 === S ||
                    null === (I = S.historyBillInfo) ||
                    void 0 === I ||
                    null === (b = I[0]) ||
                    void 0 === b
                      ? void 0
                      : b.billCycleStartDate) || "";
                  e &&
                    r["default"].commit(
                      "paymentLogic/SET_BILL_CYCLE_START_DATA",
                      i()(e).format("YYYY-MM-DD")
                    );
                }
                console.log(
                  i()(
                    null === (A = u.rspBody) ||
                      void 0 === A ||
                      null === (y = A.historyBillInfo) ||
                      void 0 === y ||
                      null === (T = y[0]) ||
                      void 0 === T
                      ? void 0
                      : T.billCycleStartDate
                  ).format("YYYY-MM-DD"),
                  "?????<><><><>--billsData"
                );
              } catch (x) {
                r["default"].commit(
                  "paymentLogic/SET_BILL_CYCLE_START_DATA",
                  ""
                ),
                  console.log(
                    "SET_BILL_CYCLE_START_DATA-billCycleStartDate-error:",
                    x
                  );
              }
              if ("000000" === u.retCode) {
                var C;
                if (
                  u.rspBody &&
                  u.rspBody.historyBillInfo &&
                  u.rspBody.historyBillInfo.length > 0
                ) {
                  var w, _, k, N, P, B;
                  if (
                    (e("SET_HISTORY_BILL_INFO", u.rspBody.historyBillInfo[0]),
                    "2" === o["phoneBills/billsCombineShowType"] &&
                      null !== (w = u.rspBody.historyBillInfo[0]) &&
                      void 0 !== w &&
                      w.billInfoAllRes &&
                      null !== (_ = u.rspBody.historyBillInfo[0]) &&
                      void 0 !== _ &&
                      _.billInfoAllRes.length &&
                      null !== (k = u.rspBody.historyBillInfo[0]) &&
                      void 0 !== k &&
                      null !== (N = k.billInfoAllRes[0].billInfolist) &&
                      void 0 !== N &&
                      N.length)
                  ) {
                    var L;
                    let n = JSON.parse(
                      JSON.stringify(
                        null === (L = u.rspBody.historyBillInfo[0]) ||
                          void 0 === L
                          ? void 0
                          : L.billInfoAllRes[0]
                      )
                    );
                    n.billInfolist.forEach((e) => {
                      e.detailFlag = !1;
                    }),
                      e("SET_BILL_INFO_ALL", n);
                    let o = a.billInfoAll.billInfolist.findIndex(
                      (e) => e.phoneNum === t.userInfo.phoneNumber
                    );
                    o > -1 &&
                      e("SET_BILL_INFO_ITEM", {
                        index: o,
                        name: "historyBillInfo",
                        data: a.historyBillInfo,
                      });
                  } else if (
                    "0" ===
                      (null === (P = u.rspBody.historyBillInfo[0]) ||
                      void 0 === P
                        ? void 0
                        : P.billFlag) &&
                    null !== (B = u.rspBody.historyBillInfo[0]) &&
                    void 0 !== B &&
                    B.billInfoMsg
                  ) {
                    var D;
                    e(
                      "SET_PERSON_BILL_INFO",
                      null === (D = u.rspBody.historyBillInfo[0]) ||
                        void 0 === D
                        ? void 0
                        : D.billInfoMsg
                    );
                  }
                  e("SET_IS_ERROR", !1);
                } else
                  e("SET_HISTORY_BILL_INFO", {}),
                    e("SET_IS_ERROR", !0),
                    e("SET_COPY_WRITING", "暂未查询到数据");
                f && r["default"].commit("paymentLogic/SET_MAIN_REQ_END", !0),
                  null !== t &&
                    void 0 !== t &&
                    null !== (C = t.paymentLogic) &&
                    void 0 !== C &&
                    C.paymentLogicData &&
                    r["default"].dispatch(
                      "paymentLogic/setCurrentOrLastBillStatus"
                    );
              } else {
                var E;
                e("SET_HISTORY_BILL_INFO", {}),
                  e("SET_IS_ERROR", !0),
                  e("SET_COPY_WRITING", u.retDesc || a.defaultErrorMsg),
                  f && r["default"].commit("paymentLogic/SET_MAIN_REQ_END", !0),
                  !/^4\d{5}$/.test(u.retCode) &&
                    null !== t &&
                    void 0 !== t &&
                    null !== (E = t.paymentLogic) &&
                    void 0 !== E &&
                    E.paymentLogicData &&
                    r["default"].dispatch(
                      "paymentLogic/setCurrentOrLastBillStatus"
                    );
              }
              return (
                !d && h < 500 && (await new Promise((e) => setTimeout(e, 200))),
                e("setLoadState", {
                  stateName: "newBillsLoadState",
                  value: "loadCompleted",
                }),
                d &&
                  "000000" === u.retCode &&
                  (0, s.Z)({
                    busCode: "20072",
                    messageBody: JSON.stringify(u),
                    flag: "1",
                  }),
                "000000" === u.retCode
                  ? Promise.resolve({
                      busCode: "20072",
                      messageBody: JSON.stringify(u.rspBody),
                    })
                  : Promise.resolve({ busCode: "20072", messageBody: "" })
              );
            } catch (x) {
              if (
                (console.log("error:", x),
                e("SET_HISTORY_BILL_INFO", {}),
                e("setLoadState", {
                  stateName: "newBillsLoadState",
                  value: "loadCompleted",
                }),
                !f)
              )
                return;
              r["default"].commit("paymentLogic/SET_MAIN_REQ_END", !0);
            }
          },
        },
      };
    },
    56339: function (e, t, a) {
      "use strict";
      a(26699), a(2490), a(34514);
      var n = a(86842),
        o = a.n(n),
        i = a(6648),
        r = a(55844),
        l = a(51327),
        s = a(15222),
        c = a(30660);
      t.Z = {
        namespaced: !0,
        state: {
          cacheDate: "",
          isSkinMode: !1,
          currentSkin: {
            color1: "#0b60e2",
            color2: "#2279ff",
            color3: "#2892ff",
            color4: "#3eb5fa",
            color5: "#e5f2ff",
            auxiliaryColor: "#000000",
            backImg: "#e3f3ff",
          },
          statusBarHeight: "0px",
        },
        mutations: {
          SET_SKIN(e, t) {
            e.currentSkin = t;
          },
          SET_CACHE_DATE(e, t) {
            e.cacheDate = t;
          },
          SET_IS_SKIN_MODE(e, t) {
            e.isSkinMode = t;
          },
          SET_STATUS_BAR_HEIGHT(e, t) {
            e.statusBarHeight = t;
          },
        },
        getters: {
          showNavCustomBtnMode(e) {
            return "#000000" === e.currentSkin.auxiliaryColor ? "0" : "1";
          },
        },
        actions: {
          async initSkin({ commit: e, dispatch: t, rootState: a }) {
            try {
              if (!a.login.isTouch) return;
              let n = await (0, i.ww)({
                  debug: !1,
                  key: `themeConfig_${(0, r.Pu)(a.userInfo.phoneNumber)}`,
                }),
                o = n.value;
              if (o && "0" !== o) {
                console.log(
                  "key:",
                  `themeConfig_${(0, r.Pu)(a.userInfo.phoneNumber)}`
                ),
                  console.log("value", o);
                let { cacheDate: n, data: i } = JSON.parse(o);
                e("SET_SKIN", i),
                  e("SET_CACHE_DATE", n),
                  t("applySkin"),
                  console.log("皮肤模式 - 已加载缓存皮肤", i, n);
              } else
                e("SET_IS_SKIN_MODE", !1),
                  console.log("非皮肤模式 - 使用默认皮肤");
              t("setNavigationBarStyles");
            } catch (n) {
              console.log("Failed to init skin:", n);
            }
          },
          async applySkin({ state: e, commit: t, dispatch: a }) {
            try {
              const a = e.currentSkin;
              let n = e.currentSkin.backImg;
              (0, s.sQ)(n) &&
                (n = `#F6F6F6 url(${n}) no-repeat left top / 100%`),
                Object.entries(a).forEach(([e, t]) => {
                  const a = `--${e
                    .replace(/([a-z])([A-Z])/g, "$1-$2")
                    .toLowerCase()}`;
                  "backImg" === e
                    ? document.documentElement.style.setProperty(a, n)
                    : document.documentElement.style.setProperty(a, t);
                });
              let o = document.querySelector(".skin-page-container");
              o && (o.style.background = n),
                t("SET_IS_SKIN_MODE", !0),
                console.log("已应用皮肤");
            } catch (n) {
              console.log("Failed to apply skin:", n);
            }
          },
          async saveSkin(
            { state: e, commit: t, dispatch: a, rootState: n },
            l
          ) {
            try {
              if (!n.login.isTouch) return;
              let s = e.cacheDate,
                c = o()().format("YYYY-MM-DD");
              if (
                (s !== c &&
                  e.isSkinMode &&
                  (0, i.kv)({
                    debug: !1,
                    key: `themeConfig_${(0, r.Pu)(n.userInfo.phoneNumber)}`,
                    value: "0",
                  }),
                !Array.isArray(l) ||
                  !l[0] ||
                  !l[0].skinAdverList ||
                  0 === l[0].skinAdverList.length)
              )
                return void (0, i.kv)({
                  debug: !1,
                  key: `themeConfig_${(0, r.Pu)(n.userInfo.phoneNumber)}`,
                  value: "0",
                });
              let u = l[0].skinAdverList[0];
              if (!u || (e.isSkinMode && c === s))
                console.log("不符合保存条件");
              else {
                let o = { ...e.currentSkin };
                for (const e of Object.keys(o)) u[e] && (o[e] = u[e]);
                let l = { data: o, cacheDate: c };
                console.log("保存皮肤数据", l),
                  (0, i.kv)({
                    debug: !1,
                    key: `themeConfig_${(0, r.Pu)(n.userInfo.phoneNumber)}`,
                    value: JSON.stringify(l),
                  }),
                  e.isSkinMode ||
                    (t("SET_SKIN", o),
                    t("SET_CACHE_DATE", c),
                    a("applySkin"),
                    a("setNavigationBarStyles"),
                    console.log("非皮肤模式下已切换并应用新皮肤"));
              }
            } catch (s) {
              console.log("Failed to saveSkin:", s);
            }
          },
          async getUserGsmState({ rootState: e }) {
            try {
              if (!e.login.isTouch) return "";
              let t = null;
              if ((0, s.U0)(e.userInfo)) {
                let a = await (0, i.Mt)({
                  operate: "get",
                  key: (0, r.Pu)(
                    `${e.userInfo.phoneNumber}_serviceModule_getUserInformation`
                  ),
                });
                a && "0" == a.resCode && a.result && (t = JSON.parse(a.result));
              } else {
                let e = await c.Z.getUserInformation({}, { timeout: 9500 }),
                  { retCode: a, rspBody: n } = e;
                "000000" === a && (t = n);
              }
              if (
                (console.log(
                  "operateNativeData key",
                  (0, r.Pu)(
                    `${e.userInfo.phoneNumber}_serviceModule_getUserInformation`
                  )
                ),
                console.log("operateNativeData data", t),
                t &&
                  t.userInfo &&
                  ["0", "1", "2", "3", "4", "5", "8"].includes(
                    t.userInfo.gsmState
                  ))
              ) {
                let e = t.userInfo.gsmState;
                return ["1", "2", "3", "4"].includes(e)
                  ? (+e + 1).toString()
                  : "5" === e
                  ? "5"
                  : "8" === e
                  ? "6"
                  : "0" === e
                  ? "7"
                  : "";
              }
              return "";
            } catch (t) {
              return console.log("Failed to getUserGsmState:", t), "";
            }
          },
          async setNavigationBarStyles({ state: e, commit: t, rootState: a }) {
            try {
              let n = await (0, i.X)(),
                o = n.titleHeight,
                { density: r } = a.userInfo,
                s = 0;
              l.Dt || l.UB
                ? (s = Math.floor(Number(o) / Number(r)))
                : l.Tt && (s = o),
                console.log("端能力获取的titleHeight和density", o, r),
                console.log("标题栏+状态栏高度高度:", s),
                t("SET_STATUS_BAR_HEIGHT", `${s}px`),
                document.documentElement.style.setProperty(
                  "--status-bar-height",
                  `${s}px`
                ),
                (0, i.lZ)({
                  debug: !1,
                  bkColor: "#ffffff",
                  txtColor: "#000000",
                  iconType: "1",
                  pageType: "1",
                  startTxtColor: e.currentSkin.auxiliaryColor,
                  startIconType:
                    "#000000" === e.currentSkin.auxiliaryColor ? "1" : "2",
                  offset: s,
                });
            } catch (n) {
              console.log("setNavigationBarStyles error", n);
            }
          },
        },
      };
    },
    76322: function (e, t, a) {
      "use strict";
      var n = a(89629),
        o = a(30660),
        i = a(72856);
      t.Z = {
        namespaced: !0,
        state: {
          userName: "",
          gsmState: "",
          userBrand: "",
          starLevel: "",
          userInformationLoadState: "loadInit",
        },
        mutations: {
          setUserInformation(
            e,
            {
              userName: t = "",
              gsmState: a = "",
              userBrand: n = "",
              starLevel: o = "",
            }
          ) {
            (e.userName = t),
              (e.gsmState = a),
              (e.userBrand = n),
              (e.starLevel = o);
          },
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
        },
        actions: {
          async getUserInformation(
            { commit: e, rootState: t, rootGetters: a },
            r = { isMainApi: !1 }
          ) {
            let l = {};
            try {
              return (
                e("setLoadState", {
                  stateName: "userInformationLoadState",
                  value: "loading",
                }),
                (l = r.isMainApi
                  ? await o.Z.getUserInformation({}, { timeout: 9500 })
                      .then(n.ep)
                      .then(n.um)
                  : await o.Z.getUserInformation({}, { timeout: 9500 })),
                "000000" === l.retCode &&
                  l.rspBody &&
                  l.rspBody.userInfo &&
                  ("app" === t.websiteTarget &&
                    "balanceQuery" === a.pageName &&
                    i["default"].commit("market/setReportLingXiData", {
                      dataName: "userInformation",
                      data: l.rspBody,
                    }),
                  e("setUserInformation", {
                    userName: l.rspBody.userInfo.userName || "",
                    gsmState: l.rspBody.userInfo.gsmState,
                    userBrand: l.rspBody.userInfo.userBrand,
                    starLevel: l.rspBody.userInfo.starLevel,
                  })),
                e("setLoadState", {
                  stateName: "userInformationLoadState",
                  value: "loadCompleted",
                }),
                l
              );
            } catch (s) {
              e("setLoadState", {
                stateName: "userInformationLoadState",
                value: "loadCompleted",
              }),
                console.log(s, "getUserInformation---e--报错");
            }
          },
        },
      };
    },
    80629: function (e, t, a) {
      "use strict";
      a(2490), a(59849), a(59461), a(34514), a(9924);
      var n = a(30660),
        o = a(41110),
        i = a(89629);
      t.Z = {
        namespaced: !0,
        state: {
          planQryInfos: null,
          accountType: "0",
          showAccountTypeSelector: !1,
          userPlanQryErrorText: "",
          userPlanQryNewLoadState: "loadInit",
        },
        getters: {
          planQryInfo(e, t, a, n) {
            try {
              return e.planQryInfos
                ? e.planQryInfos.find((t) => t.type == e.accountType) ||
                    e.planQryInfos[0]
                : {};
            } catch (o) {
              return console.log(o), {};
            }
          },
          familyPlanInfo(e, t, a, n) {
            try {
              if (!e.planQryInfos) return "";
              if (e.planQryInfos.length > 1)
                return e.planQryInfos.find((e) => 1 == e.type);
            } catch (o) {
              return console.log(o), "";
            }
          },
          personalPlanInfo(e, t, a, n) {
            try {
              return e.planQryInfos
                ? e.planQryInfos.find((e) => 0 == e.type) || e.planQryInfos[0]
                : "";
            } catch (o) {
              return console.log(o), "";
            }
          },
          showAccountTypeSelector(e) {
            return e.planQryInfos && e.planQryInfos.length > 1;
          },
          curPlanName(e, t) {
            return (t.planQryInfo && t.planQryInfo.curPlanName) || "----";
          },
          planPrice(e, t) {
            if (t.planQryInfo && t.planQryInfo.planPrice) {
              let e = Number(t.planQryInfo.planPrice);
              if (0 === e || Boolean(e)) return e.toFixed(2);
            }
            return "----";
          },
          planNameInfos(e, t) {
            let a = [
              {
                curPlanName: "套餐信息获取异常",
                curPlanType: "",
                curPlanId: "",
                curPlanBusinessDetails: "",
                curPlanMsgDetails: "",
              },
            ];
            try {
              return e.planQryInfos
                ? ((a =
                    e.planQryInfos.length > 1
                      ? e.planQryInfos
                          .filter((e) => "1" === e.type)
                          .map((e) => {
                            var t, a;
                            return {
                              curPlanName: e.curPlanName || "未获取到套餐名称",
                              curPlanType: "家庭",
                              curPlanId: e.curPlanId || "",
                              curPlanBusinessDetails:
                                e.curPlanName &&
                                (null === (t = e.businessdetailsInfo) ||
                                void 0 === t ||
                                null === (a = t.businessdetailsList) ||
                                void 0 === a
                                  ? void 0
                                  : a.length) > 0
                                  ? e.businessdetailsInfo
                                  : "",
                              curPlanMsgDetails:
                                e.curPlanName && e.busiInfomsg
                                  ? e.busiInfomsg
                                  : "",
                            };
                          })
                          .concat(
                            e.planQryInfos
                              .filter((e) => "0" === e.type)
                              .map((e) => {
                                var t, a;
                                return {
                                  curPlanName:
                                    e.curPlanName || "未获取到套餐名称",
                                  curPlanType: "个人",
                                  curPlanId: e.curPlanId || "",
                                  curPlanBusinessDetails:
                                    e.curPlanName &&
                                    (null === (t = e.businessdetailsInfo) ||
                                    void 0 === t ||
                                    null === (a = t.businessdetailsList) ||
                                    void 0 === a
                                      ? void 0
                                      : a.length) > 0
                                      ? e.businessdetailsInfo
                                      : "",
                                  curPlanMsgDetails:
                                    e.curPlanName && e.busiInfomsg
                                      ? e.busiInfomsg
                                      : "",
                                };
                              })
                          )
                      : e.planQryInfos.map((e) => {
                          var t, a;
                          return {
                            curPlanName: e.curPlanName || "未获取到套餐名称",
                            curPlanType: "",
                            curPlanId: e.curPlanId || "",
                            curPlanBusinessDetails:
                              e.curPlanName &&
                              (null === (t = e.businessdetailsInfo) ||
                              void 0 === t ||
                              null === (a = t.businessdetailsList) ||
                              void 0 === a
                                ? void 0
                                : a.length) > 0
                                ? e.businessdetailsInfo
                                : "",
                            curPlanMsgDetails:
                              e.curPlanName && e.busiInfomsg
                                ? e.busiInfomsg
                                : "",
                          };
                        })),
                  1 === a.length && (a[0].curPlanType = ""),
                  a)
                : a;
            } catch (n) {
              return console.log(n), a;
            }
          },
          packagePopupOverallData(e, t) {
            let a = [
              ...(t.familyPlanInfo ? [t.familyPlanInfo] : []),
              ...(t.personalPlanInfo ? [t.personalPlanInfo] : []),
            ];
            return a.length > 0
              ? (a.forEach((e) => {
                  var t, a;
                  let n = e.busiInfoList;
                  try {
                    (null === n || void 0 === n ? void 0 : n.length) > 0
                      ? ((e.flowData = (0, o.r)(n).flowData),
                        (e.flowUnit = (0, o.r)(n).flowUnit),
                        (e.voiceData = (0, o.M)(n, "0")),
                        (e.smsData = (0, o.M)(n, "2")))
                      : ((e.flowData = "未订购"),
                        (e.voiceData = "未订购"),
                        (e.smsData = "未订购"));
                  } catch (i) {
                    console.log("parseUserPlanQryNew 解析数据异常", i),
                      (e.flowData = "暂无数据"),
                      (e.voiceData = "暂无数据"),
                      (e.smsData = "暂无数据");
                  }
                  (null === (t = e.businessdetailsInfo) ||
                  void 0 === t ||
                  null === (a = t.businessdetailsList) ||
                  void 0 === a
                    ? void 0
                    : a.length) > 0 &&
                    (e.infoList = e.businessdetailsInfo.businessdetailsList.map(
                      (e) => {
                        let t = e.title,
                          a = [];
                        return (
                          e.titleValue && a.push({ remark: e.titleValue }),
                          e.businessdetails &&
                            (e.businessdetails.forEach((e) => {
                              e.bubtitle &&
                                e.vlues &&
                                a.push({
                                  bubtitle: e.bubtitle,
                                  vlues: e.vlues,
                                });
                            }),
                            e.businessdetails.forEach((e) => {
                              e.remark && a.push({ remark: e.remark });
                            })),
                          { title: t, detailList: a }
                        );
                      }
                    ));
                }),
                a)
              : [
                  {
                    curPlanName: "套餐信息获取异常",
                    flowData: "暂无数据",
                    voiceData: "暂无数据",
                    smsData: "暂无数据",
                  },
                ];
          },
          showCurrentPackageDetailQuestion(e, t) {
            var a, n, o;
            return (
              t.planQryInfo &&
              ((null === (a = t.planQryInfo) ||
              void 0 === a ||
              null === (n = a.businessdetailsInfo) ||
              void 0 === n ||
              null === (o = n.businessdetailsList) ||
              void 0 === o
                ? void 0
                : o.length) > 0 ||
                t.planQryInfo.busiInfomsg)
            );
          },
          showNextPackageArea(e, t) {
            var a, n;
            return (
              (null === (a = t.planQryInfo) || void 0 === a
                ? void 0
                : a.reservePlanInfo) &&
              t.planQryInfo.curPlanId !==
                (null === (n = t.planQryInfo.reservePlanInfo) || void 0 === n
                  ? void 0
                  : n.reservePlanId) &&
              t.planQryInfo.reservePlanInfo.reservePlanName
            );
          },
          showNextPackageDetail(e, t) {
            var a, n, o, i;
            return (
              (null === (a = t.planQryInfo) || void 0 === a
                ? void 0
                : a.reservePlanInfo) &&
              ((null === (n = t.planQryInfo.reservePlanInfo) ||
              void 0 === n ||
              null === (o = n.businessdetailsInfo) ||
              void 0 === o ||
              null === (i = o.businessdetailsList) ||
              void 0 === i
                ? void 0
                : i.length) > 0 ||
                t.planQryInfo.reservePlanInfo.busiInfomsg)
            );
          },
        },
        mutations: {
          setPlanQryInfos(e, t) {
            e.planQryInfos = t;
          },
          setAccountType(e, t) {
            e.accountType = t;
          },
          setUserPlanQryErrorText(e, t) {
            e.userPlanQryErrorText = t;
          },
          setLoadState(e, { stateName: t, value: a }) {
            e[t] = a;
          },
        },
        actions: {
          async getUserPlanQryNew({ commit: e }, t = { isMainApi: !1 }) {
            let a = {};
            try {
              var o, r;
              if (
                (e("setLoadState", {
                  stateName: "userPlanQryNewLoadState",
                  value: "loading",
                }),
                (a = t.isMainApi
                  ? await n.Z.getUserPlanQryNew({}, { timeout: 9500 })
                      .then(i.ep)
                      .then(i.um)
                  : await n.Z.getUserPlanQryNew({}, { timeout: 9500 })),
                "000000" === a.retCode && a.rspBody)
              )
                e("setPlanQryInfos", a.rspBody.planQryInfos),
                  2 ===
                  (null === (o = a.rspBody.planQryInfos) || void 0 === o
                    ? void 0
                    : o.length)
                    ? e("setAccountType", "1")
                    : 1 ===
                        (null === (r = a.rspBody.planQryInfos) || void 0 === r
                          ? void 0
                          : r.length) && e("setAccountType", "0");
              else
                e(
                  "setUserPlanQryErrorText",
                  a.retDesc ||
                    "查询遇到问题，请稍后再试，或联系10086查询。感谢您的理解与支持~"
                );
              return (
                e("setLoadState", {
                  stateName: "userPlanQryNewLoadState",
                  value: "loadCompleted",
                }),
                a
              );
            } catch (l) {
              console.log("getUserPlanQryNew error", l),
                e("setLoadState", {
                  stateName: "userPlanQryNewLoadState",
                  value: "loadCompleted",
                });
            }
          },
        },
      };
    },
    76507: function (e, t, a) {
      "use strict";
      a.d(t, {
        EM: function () {
          return m;
        },
        Fr: function () {
          return u;
        },
        GR: function () {
          return c;
        },
        PE: function () {
          return s;
        },
        xK: function () {
          return d;
        },
      });
      var n = a(72856),
        o = a(75150),
        i = a(72671);
      class r {
        constructor() {
          (this.locked = !1), (this.queue = []);
        }
        lock(e) {
          if (!this.locked) return (this.locked = !0), void e.call(null, null);
          this.queue.push(e);
        }
        unlock() {
          if (this.queue.length > 0) {
            const e = this.queue.shift();
            e.call(null, null);
          } else this.locked = !1;
        }
      }
      const l = new Map();
      function s(e) {
        let t = l.get(e);
        return t || ((t = new r()), l.set(e, t)), t;
      }
      function c(e) {
        return new Promise((t, a) => {
          setTimeout(() => {
            a("timeout");
          }, e);
        });
      }
      function u(e, t = !1, a = "default") {
        return t
          ? function (t) {
              return new Promise((n, o) => {
                s(a).lock(() => {
                  e.call(null, {
                    ...t,
                    success: function (e) {
                      n(e), s(a).unlock();
                    },
                    error: function (e) {
                      o(e), s(a).unlock();
                    },
                  });
                });
              });
            }
          : function (t) {
              return new Promise((a, n) => {
                e({
                  ...t,
                  success: function (e) {
                    a(e);
                  },
                  error: function (e) {
                    n(e);
                  },
                });
              });
            };
      }
      async function d(e, t = null) {
        return (
          await (0, o.Z)("login", () => n["default"].dispatch("login/login")),
          t && "function" === typeof t && t(),
          c(e)
        );
      }
      function m(e, t = 9500) {
        return Promise.race([(0, i.Up)(t), e()]);
      }
    },
    6648: function (e, t, a) {
      "use strict";
      a.d(t, {
        $z: function () {
          return T;
        },
        Bh: function () {
          return x;
        },
        CV: function () {
          return E;
        },
        Dh: function () {
          return z;
        },
        GY: function () {
          return g;
        },
        JQ: function () {
          return d;
        },
        Ju: function () {
          return D;
        },
        L: function () {
          return M;
        },
        Mt: function () {
          return V;
        },
        N$: function () {
          return y;
        },
        Pp: function () {
          return h;
        },
        Sp: function () {
          return Y;
        },
        TX: function () {
          return m;
        },
        VG: function () {
          return q;
        },
        X: function () {
          return j;
        },
        XH: function () {
          return O;
        },
        Z3: function () {
          return Q;
        },
        Zk: function () {
          return F;
        },
        Zv: function () {
          return A;
        },
        _c: function () {
          return P;
        },
        a3: function () {
          return B;
        },
        bG: function () {
          return w;
        },
        dM: function () {
          return R;
        },
        d_: function () {
          return H;
        },
        eG: function () {
          return N;
        },
        fb: function () {
          return u;
        },
        g0: function () {
          return U;
        },
        gU: function () {
          return p;
        },
        h: function () {
          return b;
        },
        iQ: function () {
          return C;
        },
        kv: function () {
          return k;
        },
        lZ: function () {
          return v;
        },
        mk: function () {
          return G;
        },
        oe: function () {
          return L;
        },
        qq: function () {
          return I;
        },
        qs: function () {
          return f;
        },
        rs: function () {
          return J;
        },
        ts: function () {
          return Z;
        },
        uE: function () {
          return S;
        },
        uf: function () {
          return W;
        },
        ww: function () {
          return _;
        },
      });
      a(26699);
      var n = a(15222),
        o = a(72856),
        i = a(76507),
        r = a(75150);
      const l = [
          "quitLogin",
          "showLogin",
          "newWebview",
          "showAuthentication",
          "showQuestionnaire",
          "CMCCFloatWindow",
          "navigationColorSetting",
          "showNavCustomBtn",
          "setNavigationFuncAtSecRightBtn",
          "enableShared",
          "getContactAll",
          "isAccessibilityOpen",
          "startVoipVoiceOrVideo",
          "showBottomFloatView",
          "userStatus",
          "assistiveControl",
          "getUserInfo",
          "getDataFromNative",
          "saveDataToNative",
          "queryCalendarSchedule",
          "addCalendarSchedule",
          "deleteCalendarSchedule",
          "speechBroadcast",
          "shareMessage",
          "goNativePage",
          "overTime",
          "networkBackup",
          "getYDRZToken",
          "getNetInfo",
          "closeCurrentWebView",
          "getCmccSimInfo",
          "getMobileCardSlotInformation",
          "callPhone",
          "getConcatenationInfo",
          "jumpHCYTelephoneBillPage",
          "savePhoto",
          "showRealTimeScenePopup",
          "serviceModule",
          "operateNativeData",
          "disableScreenCapture",
          "getRecordingOrScreenshotStatus",
          "checkSessionIsvalid",
          "getTitleHeight",
          "facialVerification",
          "getNewPay",
          "enterSwitchLogin",
          "getRiskLevel",
        ],
        s = Object.create(null);
      function c() {
        let { isTouch: e } = o["default"].state.login;
        return e || window.location.href.includes("localhost:8188") ? cmcc : s;
      }
      function u(e = !0) {
        c().quitLogin({
          success() {
            e && m();
          },
        });
      }
      function d() {
        c().quitLogin({
          success() {
            h();
          },
        });
      }
      function m() {
        c().showLogin();
      }
      function p({
        markID: e = "",
        type: t = "",
        funCode: a = "",
        bizCode: n = "",
        url: o = "",
      }) {
        c().newWebview({ markID: e, type: t, funCode: a, bizCode: n, url: o });
      }
      function h() {
        c().showAuthentication();
      }
      async function f(e) {
        let t = await (0, r.Z)("login", () =>
            o["default"].dispatch("login/login")
          ),
          { version: a } = t;
        (0, n.yC)("6.3", a) >= 0 && c().showQuestionnaire(e);
      }
      async function g(e) {
        let t = await (0, r.Z)("login", () =>
            o["default"].dispatch("login/login")
          ),
          { version: a } = t;
        (0, n.yC)("7.5", a) >= 0 && c().CMCCFloatWindow(e);
      }
      function v(e) {
        c().navigationColorSetting(e);
      }
      async function A(e) {
        let t = await (0, r.Z)("login", () =>
            o["default"].dispatch("login/login")
          ),
          { version: a } = t;
        (0, n.yC)("8.5", a) >= 0 &&
          c().showNavCustomBtn({
            mode: "0",
            isShow: !0,
            iconDataW:
              "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAFpOLgnAAAAAXNSR0IArs4c6QAABThJREFUaAXtmkuIHUUUhu9kHOMrCj7AJGIQ0SzEgAoiBiHiQlBRgi5EhIiCEFAEFypRRl0EHwtBiRs3btSFS8egG1ESFRFGd26CQ15kfEHEEDQmk5vv79unOV1d1Y+Zvip4D/xTVef859Q5XV11+/adwaBOhsPhDcDkcevQzq6S41QudC9x/UFmtMgYXrG+2pKRUNMVo82D55L1Palbf0ohoi7o7w0N6KbCDAvvkkEFF96aI5d52jkbFIR+OoTVisSyXghngKfSZ88KDRpjGKoAa0NOqVIzmgPjDabzbdQpJ7yP80FPbuwrNWSmkTgWQvquGQxOM2O1ViUbSwX1daFe3GoEWOg30SyFDhpXHCDvQK8FnqH/gkglQRlNSSRMezw548Yc0K1L6IfZfeSj1PUVpFJDnYNsqXW4Bttv4KhIjcLMn4PFRuJ/hpAdLaT8NRmdk8hK9e8Db7O3fjAOPuI/B24EV5g+aHUP36rlsxO+cqaYA5xp8Czw8gWDy4wTttiyhaMdfVKEhHBMBUvgNeBlC4NfQ25s3Pq+IqOjwMvvsYAxXfQkDYlEPoZuRmWYLZ/tD1QXmi7VtqqEQGtAdmMQ/HpwIg+4NhXY61tVYg4E1500z4RFRWara1tV4gLosumO1NZuLZ0qoQDtl05VKBPbjNpwqc14vohOdPCGEx13dt/VZkxtVM+b9P/hK6BD7FHmfCIx7yn0+8Gn4F3uruLTFr/b0W0Dup3PBTH5Cp8nsw9RHNrKcYi72pLFy2Y2h1gapoOjo2TBuHn7gNljrXEzW2kQYzsd3LvBvFMlu6W4pUHSpbvBx+10duG4HTzWeUo/Y8oZjn1EG13t5hRfeiNmnNIg4ZVzdL5lwnhROhvH2tyn090ln+KgpL9Wilhw08ku0bjVUc+GCk/dLRasVTuarz4rHwj+O7nPIa8P+6W4pUHIDMZwT+X8zwJTZViKWxpUqGVFzt1b1sZHPm6rNbEwkbUxU23bdTNmCdZGjBg7VYL//ZEYzSp/7ZrZ7Rk+bnG5TFnT6mtCJnC2gRM13NJG1SfjTjyfyv3D5mwUM6EyGOux589AZ0N9Mt5pg8aWZG52mT/U6DAhTK7A5Ap0uALsLn1YF+9j3W5bSfcQzjvApZYK/Y3gPVB7FmHvKtnzmY75y0FxSNL/FvwE2oj89R3+InA1OA9I9PVN5+FOstI4Jfsx6I2G3lv9BdqKfz2zPnNiovDB0JPaBi7xiLkKPAP8Sh9jfE+JuIwBMeydEN1MZhXGr8QywsZd+PQ4DV4H08BEL00+jnusXDuWQlaeVvcIvRfCYq8Hu0erXvkr/eie7p5rrUfXZ7pkMBK8AKO+q16bk07S7gY/go1ADyt3gcNw99Fu4lbrssFxqRGC9rLZibMXmEQflDA+bATa72rSSprwi2723laEmXX1rwK7uNIfJDL5xOk3uP6Ku70VQvKvko0QFa7kTRhUrMlb1umj7a2QWDIkrzP+ReAPlV8Y30fh38R8lqsbWyEUcQtJvZwndoB2K8l/v9xEm/z8lWridrXrBNsD/gYvjbMIJTa2FSHxk6zKh5oEKd4ojYb9/x1bIRRxJem+CabBZsZzFHew/xJGEcdWSJ702OKHFyQ20SNcvdtCYmKsX8v0yL8IjoADFKC2Voi/BoJe6OtXNmEdkK6NhO8lMx8Vou8CXrb6Qdc+SXoXPe0+Dx4ET4PVoG/J8o9W12UmEr8Yvl3VO+jrhwd9yUqJfrn9CMyBBaAV/ZmVjP77BLZ/XyjyDaCfoL8EeqicyP/mCpwBUP3nZhoGP6cAAAAASUVORK5CYII=",
            iconDataB:
              "iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAFpOLgnAAAAAXNSR0IArs4c6QAABLBJREFUaAXtWUuIjlEYnjGU2yCXMGRoDAuZQgmTGlkopGRWUiNKKbNFkwYLxEKpsbGxwcLSEBaiGSzksrOZTGPIvcil3Mfz/P//fp1z/nPOd870fVL+t545533P877nPdfv+/6pqkqRJWgfKmGXUu8cUXKsRklMKZWsV0kj65RjxaL412yssTVKn7/QKHWVF1FnRgxhlU0Wa7WZYeJtNhQGKxEkzQcwdAOiS3tGJVfElnW/JT7z6xxpaaCJ+cncaANhozlS2ijiUF9U9b8uJ7LOA4M6PV1jiqPSaXkwZKC22L9htI6V+dpkkcU4ZI0AYhPAbV8mNocOsLjAnKUDZR4wuFIit8dwKHBtDnWOQE4HI3CiOgedMMyKDJpdqZgPfZJhs6WexLuJ2stE++crciLvItPRjmzfwd4HnAYeKxzy9wNLgdmKXa1yD6+iQW54250iDryi9wHqAtyCPg1wiRyg5EnhIoqde/44QEdBC+pvgVSRbZJKBOE9oI7kQ4gTOa6b1PT/BAMPpKwh29nhR2ACFZ+EjqQWQWRjLEb9WynoTF9waQsdifC5k/hcU0ckbc4ydCQSgNNGaSwWYX9jR8LzEjUKpiEOPHAy57SrMk5VUOeCi580fZGKUfIwug6qQa2of3MGuIA7gD2OTn/CPgBcA84CXHSRNai0AdzOY8RolHegt9NGx1BwF3VF8JOkpAP4OoVXCV8lhcuy1ckuNgi3oGlKiuMGtPNaCREtrqaEeAdykrixd9dudLAzsBONlvSoWXVFHtHCZdmsU8o04RYaNKWMWjSQw/tNhO9KtPlEi6spDi9y1IuSD6vgTkKvevPWbXEk4zSHjER1PgOFPs9Uo6WuxdUUC1k18Zoh/4ZqdNS1uJricBAzub2ipJRJ3NA1kXjm2ojdW8YexiQ7b1SjMXYkWwz/YHVY2QVET+Kq0yVGV8nPBJE2VPgW6eLSrskRaJ8d+A67LxDb+Mbv8r+OtihZDrZ0uDXKs0KuzEBlBtJngA9rHlk5ZVmUfGR2AFMBkYWonAPS7qLY/gvvZ7zmZwDqJXkP+isgROjPb/iJQAMwFqDw8433IeGTATTyFw3+CPEVCBX155lZ4mS+GKok4cSWnJi9gLrS/DLfGBvIwufTX121TnLUlbD4DNvEj+oTQA3Ajola4DKQi+Q1kFyS9QXNYyDcs1cAdfmlTnuyp32JxbbFvtP54o9HI79VF5RIP1Ay8ScAb6x1wHrgOdAHNAExBxx0v2R12HvRjcy860Vpm8J56E/L2Wo97FmuCGd/HtAFXHCkcVWx1yv1TKpZrUhaMstA4PNJVu1gmoOj3boieRx2tX/e8fIsuY/6dOANsBI4DGQmWW4tM6kVMEiyT1HfDDwySVnpea4Ib7AegJ9nh4DcBoHYwf8vITdWeP1eLDmpvyjFxgni57m15iCDUwBfU5qBbmAQyEXyHAiTzjO+NiG2jraDsVpjuRV+W/BK5a+cLwAeapZpwhfIRoDfQkQdQFuIVLtIc9Egd3vWJbcTX0WOAnwdyTo+47UDZf/roi1WJsNBZnUt6q1AgycI/3N7CeAg+wGu6GuAz5t/Vk4iM3793Qb4UlmR/2YG/gCCm5OkG3/b5QAAAABJRU5ErkJggg==",
            ...e,
          });
      }
      function y(e) {
        c().setNavigationFuncAtSecRightBtn(e);
      }
      function T(e) {
        c().enableShared(e);
      }
      function S() {
        return (0, i.Fr)(c().getContactAll)();
      }
      async function I() {
        let e = await (0, r.Z)("login", () =>
            o["default"].dispatch("login/login")
          ),
          { version: t } = e;
        return (0, n.yC)("7.4", t) >= 0
          ? (0, i.Fr)(c().isAccessibilityOpen)()
          : Promise.reject();
      }
      function b(e) {
        return (0, i.Fr)(c().startVoipVoiceOrVideo)(e);
      }
      function C() {
        return (0, i.Fr)(c().userStatus)();
      }
      function w() {
        return (0, i.Fr)(c().getUserInfo)();
      }
      function _(e) {
        return (0, i.Fr)(c().getDataFromNative)(e);
      }
      function k(e) {
        c().saveDataToNative(e);
      }
      function N(e) {
        return (0, i.Fr)(c().queryCalendarSchedule)(e);
      }
      function P(e) {
        return (0, i.Fr)(c().addCalendarSchedule)(e);
      }
      function B(e) {
        return (0, i.Fr)(c().deleteCalendarSchedule)(e);
      }
      function L(e) {
        c().speechBroadcast(e);
      }
      function D(e) {
        c().savePhoto(e);
      }
      function E(e = "", t = "", a = "", n = "") {
        c().goNativePage({
          bizCode: e,
          uniLinkUrl: t,
          foot_picUrl: a,
          operationType: n,
        });
      }
      function x(e) {
        return (0, i.Fr)(c().getYDRZToken, !0, "getYDRZToken")(e);
      }
      function M(e) {
        return (0, i.Fr)(c().callPhone)(e);
      }
      function W() {
        return (0, i.Fr)(c().getNetInfo)();
      }
      function R() {
        c().closeCurrentWebView();
      }
      async function O() {
        let e = await (0, r.Z)("login", () =>
            o["default"].dispatch("login/login")
          ),
          { version: t } = e;
        return (0, n.yC)("10.2", t) >= 0
          ? (0, i.Fr)(c().getCmccSimInfo)()
          : Promise.reject();
      }
      function U(e) {
        let { version: t } = e;
        if (t)
          return (0, n.yC)("9.8.5", t) > 0
            ? (0, i.Fr)(c().getConcatenationInfo)()
            : "";
      }
      function F(e) {
        c().jumpHCYTelephoneBillPage(e);
      }
      function Z(e) {
        return (0, i.Fr)(c().serviceModule)(e);
      }
      async function V(e) {
        let t = await (0, r.Z)("login", () =>
          o["default"].dispatch("login/login")
        );
        return (0, n.U0)(t)
          ? (0, i.Fr)(c().operateNativeData)(e)
          : Promise.reject();
      }
      async function Q() {
        let e = await (0, r.Z)("login", () =>
            o["default"].dispatch("login/login")
          ),
          { version: t } = e;
        t && (0, n.yC)("9.0.0", t) > 0 && c().disableScreenCapture();
      }
      async function Y() {
        let e = await (0, r.Z)("login", () =>
            o["default"].dispatch("login/login")
          ),
          { version: t } = e;
        t && (0, n.yC)("10.2.0", t) > 0 && c().getRecordingOrScreenshotStatus();
      }
      async function G() {
        return (0, i.Fr)(c().checkSessionIsvalid)();
      }
      function j() {
        return (0, i.Fr)(c().getTitleHeight)();
      }
      function q(e) {
        return (0, i.Fr)(c().facialVerification)(e);
      }
      function H(e) {
        return (0, i.Fr)(c().getNewPay)(e);
      }
      function J(e) {
        return (0, i.Fr)(c().enterSwitchLogin)(e);
      }
      function z() {
        return (0, i.Fr)(c().getRiskLevel)();
      }
      l.forEach((e) => {
        s[e] = function () {
          console.log(`Bridge执行${e}方法`);
        };
      });
    },
    35354: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return w;
        },
      });
      a(20726);
      var n = a(10521),
        o = (a(51667), a(10311)),
        i = a.n(o),
        r = a(23692),
        l = a(11671),
        s = a(72856),
        c = a(89908),
        u = a(97889),
        d = a(75150),
        m = a(3846),
        p = a(44830),
        h = function () {
          var e = this,
            t = e._self._c;
          return t(
            "pull-app-point",
            {
              staticClass: "flexible-wrapper",
              class: { "inline-wrap": e.inlineBlock },
              attrs: { "pulling-type-location": "1", channelId: e.channelId },
            },
            [e._t("default")],
            2
          );
        },
        f = [],
        g = a(42094),
        v = a(42642),
        A = a(87630),
        y = {
          name: "MarketPointApp",
          components: { PullAppPoint: A.Z },
          props: {
            inlineBlock: { type: Boolean, default: !1 },
            flexibleData: null,
            areaId: { type: String, default: "" },
            pointName: { type: String, default: "" },
            traceNeedWaitLogin: { type: Boolean, default: !1 },
            channelId: { type: String, default: "" },
          },
          async mounted() {
            //!this.$store.getters.isLoginWithUserInfo: 若有用户信息数据了不等待
            this.traceNeedWaitLogin &&
              this.$store.state.login.isTouch &&
              (await (0, d.Z)("login", () =>
                this.$store.dispatch("login/login")
              )),
              (0, g.L)({
                element: () => this.$el,
                handler: (e) => {
                  if (e) {
                    let e = this.flexibleData,
                      t = "";
                    t =
                      "qqd" === (null === e || void 0 === e ? void 0 : e.source)
                        ? e.markId
                        : e.advBusiType + "_" + e.markId;
                    let a = {
                      WT_et: "imp",
                      WT_envName: e.vSubject1 || e.vSubject,
                      WT_markId: t,
                      WT_event: e.channelId,
                      WT_next_url: e.vLinkUrl,
                      WT_es: window.location.href,
                      WT_ti: document.title,
                      ...e.otherParams,
                    };
                    return (0, v.Z)("imp", a), !0;
                  }
                },
              });
          },
        },
        T = y,
        S = a(1001),
        I = (0, S.Z)(T, h, f, !1, null, "7d7da64c", null),
        b = I.exports,
        C = {
          components: { MarketPoint: b },
          methods: {
            marketSectionClick: (e, t) => {
              p.Z.go(e, { target: "marketSectionClick", ...t });
            },
          },
        };
      async function w(e = {}) {
        let t = {
          autoLogin: !0,
          gdpAppendParams: {},
          gdpAppendPageView: {},
          ...e,
        };
        i().use(n.Z),
          i().use(l.D),
          (i().config.productionTip = !1),
          s["default"].registerModule("login", c.Z),
          s["default"].registerModule("common", u.Z),
          (0, r.gdpInit)(e.gdpAppendParams, e.gdpAppendPageView),
          (0, m.Mv)(),
          (i().prototype.$fireP1P2 = m.zp),
          i().mixin(C),
          t.autoLogin &&
            (0, d.Z)("login", () => s["default"].dispatch("login/login"));
      }
    },
    22709: function (e, t, a) {
      "use strict";
      a.d(t, {
        Z: function () {
          return h;
        },
      });
      a(2490), a(9924);
      var n = a(26090),
        o = a(15222),
        i = a(16456),
        r = a(83587);
      const l = (e) =>
        (0, i.Z)({
          url: r.OC + "DA/billOut/paymentLogic",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      var s = a(72856),
        c = a(86842),
        u = a.n(c);
      const d = window.serverTime
          ? u()(window.serverTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
        m = {
          year: u()(d).year(),
          month: u()(d).month() + 1,
          maxDays: u()(d).daysInMonth(),
        };
      async function p(e, t) {
        let a = {};
        try {
          const t = [
            "currentOutBillStart",
            "currentOutBillEnd",
            "currentShieldStart",
            "currentShieldEnd",
            "lastOutBillStart",
            "lastOutBillEnd",
            "lastShieldStart",
            "lastShieldEnd",
          ];
          let i = (0, o.m0)(e, n.oO);
          t.forEach((e) => {
            const t = i[e],
              n = t ? t.split(" ")[0] : "",
              o = n.toString();
            if ((console.log(o, "payment-day-【日】"), n)) {
              const n = t.split(" ")[1],
                [i, r, l] = n.split(":").map(Number);
              o > m.maxDays
                ? (a[e] = "")
                : (a[e] = `${
                    m.year + "-" + m.month.toString().padStart(2, "0")
                  }-${o.toString().padStart(2, "0")} ${i
                    .toString()
                    .padStart(2, "0")}:${r.toString().padStart(2, "0")}:${l
                    .toString()
                    .padStart(2, "0")}`);
            } else a[e] = "";
          });
          const r = {
            retCode: "000000",
            retDesc: "成功",
            rspBody: { currentTime: d, ...i, ...a },
          };
          return console.log(r, "finalPaymentRes"), r;
        } catch (i) {
          return console.error(i, "处理redis账期数据报错"), l(t);
        }
      }
      function h(e) {
        var t;
        console.log(
          s["default"].state.remoteState,
          "store.state.remoteState999",
          e
        );
        let a = "";
        try {
          var n, o;
          a =
            null !== (n = s["default"].state.remoteState) &&
            void 0 !== n &&
            n.CMCC_Common_Payment_Logic
              ? JSON.parse(
                  null === (o = s["default"].state.remoteState) || void 0 === o
                    ? void 0
                    : o.CMCC_Common_Payment_Logic
                )[s["default"].state.userInfo.loginProvince]
              : "";
        } catch (i) {
          console.log("redisPaymentLogicData--redis处理报错");
        }
        return a &&
          "object" === typeof a &&
          "main" === s["default"].getters.pageGroup &&
          "phoneBills" === s["default"].getters.pageName &&
          "1" ===
            (null === (t = s["default"].state.remoteState) || void 0 === t
              ? void 0
              : t.CMCC_Check_Report_Result)
          ? (console.log(a, "redisPaymentLogicData--redis账期数据"), p(a, e))
          : l(e);
      }
    },
    15222: function (e, t, a) {
      "use strict";
      a.d(t, {
        $5: function () {
          return T;
        },
        D8: function () {
          return O;
        },
        Dp: function () {
          return E;
        },
        GT: function () {
          return S;
        },
        K8: function () {
          return P;
        },
        KC: function () {
          return j;
        },
        Os: function () {
          return B;
        },
        St: function () {
          return x;
        },
        U0: function () {
          return F;
        },
        Vp: function () {
          return I;
        },
        WA: function () {
          return W;
        },
        W_: function () {
          return Z;
        },
        av: function () {
          return D;
        },
        bq: function () {
          return q;
        },
        ch: function () {
          return N;
        },
        d8: function () {
          return b;
        },
        eY: function () {
          return A;
        },
        ej: function () {
          return C;
        },
        f_: function () {
          return Q;
        },
        ke: function () {
          return y;
        },
        le: function () {
          return V;
        },
        m0: function () {
          return Y;
        },
        nP: function () {
          return L;
        },
        pB: function () {
          return _;
        },
        q6: function () {
          return R;
        },
        s6: function () {
          return G;
        },
        sQ: function () {
          return U;
        },
        w_: function () {
          return M;
        },
        yC: function () {
          return k;
        },
        zs: function () {
          return H;
        },
      });
      a(26699), a(2490), a(59849), a(34514), a(9924);
      var n = a(51327),
        o = a(75150),
        i = a(58193),
        r = a.n(i),
        l = a(46211),
        s = a.n(l),
        c = a(28905),
        u = a.n(c),
        d = a(84726),
        m = a.n(d),
        p = a(97311),
        h = a.n(p),
        f = a(72856),
        g = a(86842),
        v = a.n(g);
      function A(e, t = location.search) {
        let [, a = ""] = t.split("?"),
          n = a.split("&"),
          o = {};
        return (
          n.forEach((e) => {
            let [t, a] = e.split("=");
            o[t] = a;
          }),
          o[e] || ""
        );
      }
      function y(e, t = location.search) {
        let [, a = ""] = t.split("?"),
          n = a.split("&");
        return n.map((e) => e.split("=")[0]).includes(e);
      }
      function T(e, t) {
        let a = e.split("?");
        if (a.length >= 2) {
          let e = encodeURIComponent(t) + "=",
            n = a[1].split(/[&;]/);
          for (let t = n.length; t-- > 0; )
            -1 !== n[t].lastIndexOf(e, 0) && n.splice(t, 1);
          return n.join("&") ? a[0] + "?" + n.join("&") : a[0];
        }
        return e;
      }
      function S(e, t, a) {
        try {
          let [n, o] = e.split("?");
          if (!o) return `${n}?${t}=${encodeURIComponent(a)}`;
          if (y(t, e)) {
            const e = o.split("&").map((e) => {
              const [n] = e.split("=");
              return n === t ? `${n}=${encodeURIComponent(a)}` : e;
            });
            return `${n}?${e.join("&")}`;
          }
          const i = `${t}=${encodeURIComponent(a)}`;
          return o ? `${n}?${o}&${i}` : `${n}?${i}`;
        } catch (n) {
          return console.error("Error processing the URL:", n), e;
        }
      }
      function I(e, t) {
        return new Promise((a, n) => {
          let o = document.createElement("script");
          (o.type = "text/javascript"),
            t && (o.crossorigin = "anonymous"),
            (o.onload = () => {
              a("success");
            }),
            (o.onerror = (e) => {
              n(e);
            }),
            (o.src = e),
            document.getElementsByTagName("head")[0].appendChild(o);
        });
      }
      function b(e, t, a = 0, n = "/cmcc-service", o = ".10086.cn") {
        let i = 0;
        a &&
          ((i = new Date()),
          i.setTime(i.getTime() + 60 * a * 1e3),
          (i = i.toUTCString())),
          (document.cookie = `${e}=${encodeURIComponent(
            t
          )}; expires=${i}; path=${n}; domain=${o}`);
      }
      function C(e) {
        let t = document.cookie.split("; ");
        for (let a = 0; a < t.length; a++) {
          let n = t[a].split("=");
          if (n[0] === e) return decodeURI(n[1]);
        }
        return "";
      }
      function w() {
        let e = {},
          t = navigator.userAgent;
        return (
          (n.Tt || n.Dt) &&
            (n.Tt
              ? ((e.type = "ios"),
                (e.OSVision = t.split(";")[1].match(/(\d+)_(\d+)_?(\d+)?/)[0]))
              : ((e.type = "android"),
                (e.OSVision = t
                  .split(";")[1]
                  .replace("Android", "")
                  .trim()
                  .toString()),
                (e.OsTouVision = t.split(";")[1].replace("Android", "").trim()),
                e.OsTouVision.includes(".") &&
                  (e.OsTouVision = e.OsTouVision.split(".")[0])),
            (e.OSVision = e.OSVision.replace(/_/g, "."))),
          e
        );
      }
      function _() {
        if (!n.FO) return !1;
        {
          let e = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i),
            t = w();
          if (e && e.length && k("7.0.12", e[1]) > -1)
            return (
              (n.Tt && k("10.3", t.OSVision) > -1) ||
              (n.Dt && t.OsTouVision >= 5)
            );
        }
      }
      function k(e, t) {
        (e = e.toString()), (t = t.toString());
        let a = 0,
          n = 0;
        const o = (e, t) => {
          let a = t;
          while ("." !== e[a] && a < e.length) a++;
          return a;
        };
        while (a < e.length && n < t.length) {
          const i = o(e, a),
            r = o(t, n),
            l = +e.substr(a, i - a),
            s = +t.substr(n, r - n);
          if (l !== s) return l > s ? -1 : 1;
          (a = i + 1), (n = r + 1);
        }
        while (a < e.length) {
          const t = o(e, a),
            n = +e.substr(a, t - a);
          if (n > 0) return -1;
          a = t + 1;
        }
        while (n < t.length) {
          const e = o(t, n),
            a = +t.substr(n, e - n);
          if (a > 0) return 1;
          n = e + 1;
        }
        return 0;
      }
      function N(e, t) {
        for (let n = 0; n < t.length; n++) {
          let a = t[n],
            o = e.indexOf(a + "=");
          if (-1 !== o) {
            let t = e.indexOf("=", o),
              n = e.indexOf("&", o),
              i = e.indexOf("#", o),
              r = "";
            if (-1 !== n) {
              let o = n - t;
              (r = new RegExp(a + "=.{" + o + "}")), (e = e.replace(r, ""));
            } else if (-1 !== i) {
              let n = i - t - 1;
              (r = new RegExp("&?" + a + "=.{" + n + "}")),
                (e = e.replace(r, ""));
            } else (r = new RegExp("&?" + a + "=.+")), (e = e.replace(r, ""));
          }
        }
        let a = e.indexOf("=");
        return -1 === a && (e = e.replace(/\?/, "")), e;
      }
      function P() {
        let e = document.cookie.split(";");
        for (let t = 0; t < e.length; t++) {
          let [a] = e[t].split("="),
            n = new Date(0).toUTCString();
          (document.cookie = `${a}=; path=/; domain=app.10086.cn; expires=${n}`),
            (document.cookie = `${a}=; path=/; domain=.10086.cn; expires=${n}`),
            (document.cookie = `${a}=; path=/; domain=flow.clientaccess.10086.cn; expires=${n}`),
            (document.cookie = `${a}=; path=/; domain=testh.app.coc.10086.cn; expires=${n}`),
            (document.cookie = `${a}=; path=/; domain=h.app.coc.10086.cn; expires=${n}`),
            (document.cookie = `${a}=; path=/cmcc-service; domain=.10086.cn; expires=${n}`),
            (document.cookie = `${a}=; path=; domain=; expires=${n}`);
        }
      }
      function B(e) {
        let [t] = e.split("/").reverse(),
          [a] = t.split(".");
        return (0, o.Z)(
          a,
          () =>
            new Promise((t, n) => {
              let i = document.createElement("script");
              (i.type = "text/javascript"),
                (i.tag = a),
                (i.onload = () => {
                  "function" === typeof window[a]
                    ? t(window[a])
                    : ((0, o.g)(a), i.remove(), n("插件导出的值不是一个函数"));
                }),
                (i.onerror = (e) => {
                  i.remove(), n(e);
                }),
                (i.src = e),
                document.getElementsByTagName("head")[0].appendChild(i);
            })
        );
      }
      function L(e) {
        let [, t, ...a] = e.split("/");
        return ["cmcc-app", "leadeon-cmcc-static"].includes(t)
          ? "test" === serverEnv
            ? `https://testh.app.coc.10086.cn/cmcc-app-gray/${a.join("/")}`
            : "grayscale" === serverEnv
            ? `https://h.app.coc.10086.cn/cmcc-app-UAT/${a.join("/")}`
            : `https://h.app.coc.10086.cn${e}`
          : e;
      }
      function D(e) {
        let t = e;
        if (t)
          if ("grayscale" === serverEnv) {
            let a = useCDN ? "https://app.online-cmcc.cn" : "";
            useCDN &&
              (t = a + e.replace("/cmcc-service/", "/cmcc-service/gray/"));
          } else if ("prod" === serverEnv) {
            let a = useCDN
              ? "https://app.online-cmcc.cn"
              : "https://res.online-cmcc.cn";
            t = a + e;
          }
        return t;
      }
      function E(e, t) {
        const a = e.findIndex(t);
        if (-1 !== a) {
          const [t] = e.splice(a, 1);
          e.unshift(t);
        }
        return e;
      }
      function x(e, t, a) {
        console.log("sumArrayElementByAttribute 处理前数据", e);
        try {
          e = e.filter((e) => e.hasOwnProperty(t) && e.hasOwnProperty(a));
          const n = r()(e, t);
          return s()(n, (e, t) => {
            const n = u()(e, a),
              o = m()(h()(e));
            return (o.summedValue = n), o;
          });
        } catch (n) {
          return console.log("sumArrayElementByAttribute err:", n), [];
        }
      }
      function M(e) {
        return e ? e.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2") : "";
      }
      function W(e) {
        if (!e) return;
        let t = e.length - 2,
          a = e.replace(
            /^([一-龟]{1})(.*)([一-龟])$/,
            "$1" + (0 == t ? "*" : "*".repeat(0 == t ? 1 : t) + "$3")
          );
        return a.length > 4
          ? a.slice(0, 1) + "**" + a.slice(a.length - 1, a.length)
          : a;
      }
      function R(e) {
        let t = !1;
        return (
          (t =
            0 !== e &&
            ("undefined" === e ||
              "null" === e ||
              "NaN" === e ||
              !("number" !== typeof e || !isNaN(e)) ||
              !e)),
          t
        );
      }
      function O(e) {
        return !R(e) && !isNaN(e);
      }
      function U(e) {
        let t = /^(http|https):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z0-9]+(\/.*)?$/;
        return t.test(e);
      }
      function F({ version: e, sv: t = "" }) {
        let a = k("11.9.0", e) < 0,
          o = k("11.9.6", e) < 0,
          i = k("15", t) < 0;
        return !(a || (n.Tt && o && i));
      }
      function Z(e, t, a) {
        return { reqStartTime: e, retEndTime: t, retCode: a };
      }
      function V(e) {
        try {
          if (e && "string" === typeof e) {
            const t = e.split("?")[0],
              a = t.split("/").filter(Boolean);
            return a.length >= 2 ? a.slice(-2).join("-") : "";
          }
        } catch (t) {
          console.log(t, e, "error--suffixUrl");
        }
      }
      function Q(e) {
        var t, a;
        const n =
          "1" ===
          (null === (t = f["default"].state.remoteState) || void 0 === t
            ? void 0
            : t.CMCC_Check_Report_Result);
        if (!n) return !1;
        const o =
          null === (a = f["default"].state.remoteState) || void 0 === a
            ? void 0
            : a.CMCC_PAGE_REPORT_API;
        if (!o) return !1;
        let i = "";
        try {
          i = JSON.parse(o);
        } catch (s) {
          return console.warn(s, "reportApiListObj--error"), !1;
        }
        const r =
            i[
              f["default"].getters.pageGroup +
                "-" +
                f["default"].getters.pageName
            ] || "",
          l = null === r || void 0 === r ? void 0 : r.includes(e);
        return n && l;
      }
      function Y(e, t) {
        return Object.fromEntries(
          Object.entries(e).map(([e, a]) => {
            const n = t[e] || e;
            return [n, a];
          })
        );
      }
      function G(e = "") {
        return e.replace(/[-_—]/g, " ");
      }
      function j(e) {
        const t = String(e).trim();
        if (!t) return t;
        if (/^1[3-9]\d{9}$/.test(t)) return t.slice(0, 3) + "****" + t.slice(7);
        const a = t.length;
        if (a <= 2) return t;
        const n = a >= 11 ? 4 : a >= 9 ? 3 : a >= 7 ? 2 : 1;
        return t.slice(0, n) + "****" + t.slice(-n);
      }
      function q(e, t) {
        if (!e || !t) return !1;
        try {
          const a = v()(e),
            n = v()();
          if (!a.isValid()) return !1;
          if ("day" === t) return a.isSame(n, "day");
          if ("week" === t) return a.isSame(n, "week");
        } catch (a) {
          return console.error("Error in isSameTime:", a), !1;
        }
      }
      function H(e, t = !1) {
        let a = "0123456789";
        t && (a += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
        let n = "";
        for (let o = 0; o < e; o++)
          n += a[Math.floor(Math.random() * a.length)];
        return n;
      }
    },
    80500: function (e, t, a) {
      "use strict";
      a.d(t, {
        V: function () {
          return i;
        },
      });
      var n = a(6648),
        o = a(51327);
      async function i(e) {
        try {
          let t = await (0, n.X)(),
            a = t.titleHeight,
            { density: i } = e || {},
            r = 0,
            l = "#e6f2fc";
          return (
            o.Dt || o.UB
              ? (r = Math.floor(Number(a) / Number(i)))
              : o.Tt && ((r = Number(a)), (l = "#b6d7f7")),
            console.log("端能力获取的titleHeight和density", a, i),
            console.log("标题栏+状态栏高度高度:", r),
            (0, n.lZ)({
              debug: !1,
              bkColor: l,
              txtColor: "#000000",
              iconType: "1",
              pageType: "1",
              startTxtColor: "#000000",
              startIconType: "1",
              offset: r,
            }),
            r
          );
        } catch (t) {
          return console.log("setNavigationBarStyles error", t), 0;
        }
      }
    },
    55844: function (e, t, a) {
      "use strict";
      a.d(t, {
        HQ: function () {
          return L;
        },
        K1: function () {
          return f;
        },
        Mu: function () {
          return C;
        },
        NG: function () {
          return g;
        },
        Oo: function () {
          return b;
        },
        Pu: function () {
          return k;
        },
        cA: function () {
          return v;
        },
        ci: function () {
          return _;
        },
        gy: function () {
          return M;
        },
        hL: function () {
          return I;
        },
        ie: function () {
          return h;
        },
        mA: function () {
          return W;
        },
        y0: function () {
          return S;
        },
      });
      var n = a(53306),
        o = a.n(n);
      const i = A;
      function r(e) {
        const t = A;
        if ("string" === typeof e) return e;
        let a = "",
          n = e;
        for (let o = 0; o < n["length"]; o++) {
          let e = n[o][t(558)](2),
            i = e[t(554)](/^1+?(?=0)/);
          if (i && 8 === e[t(564)]) {
            let e = i[0][t(564)],
              r = n[o][t(558)](2)[t(510)](7 - e);
            for (let a = 1; a < e; a++) r += n[a + o][t(558)](2)[t(510)](2);
            (a += String[t(508)](parseInt(r, 2))), (o += e - 1);
          } else a += String[t(508)](n[o]);
        }
        return a;
      }
      function l(e, t = i(495)) {
        const a = i,
          n = [];
        for (let i = 0; i < e[a(564)]; i += 2)
          n[a(549)](parseInt(e[a(528)](i, 2), 16));
        const o = [];
        for (let i = 0; i < t[a(564)]; i++) o[a(549)](t["charCodeAt"](i));
        const r = [];
        for (let i = 0; i < n[a(564)]; i++) i % 3 !== 0 && r[a(549)](n[i]);
        const l = [...Array(r[a(564)])[a(567)]()];
        for (let i = r[a(564)] - 1; i > 0; i--) {
          const e = (o[i % o["length"]] * (i + 1)) % (i + 1);
          [l[i], l[e]] = [l[e], l[i]];
        }
        const s = new Array(r[a(564)]);
        for (let i = 0; i < r[a(564)]; i++) s[l[i]] = r[i];
        const c = [];
        for (let i = 0; i < s[a(564)]; i++) c[a(549)](s[i] ^ o[i % o[a(564)]]);
        return String[a(508)](...c);
      }
      (function (e, t) {
        const a = A,
          n = e();
        while (1)
          try {
            const e =
              parseInt(a(523)) / 1 +
              (parseInt(a(524)) / 2) * (-parseInt(a(535)) / 3) +
              -parseInt(a(540)) / 4 +
              -parseInt(a(555)) / 5 +
              (parseInt(a(529)) / 6) * (parseInt(a(521)) / 7) +
              (parseInt(a(503)) / 8) * (parseInt(a(546)) / 9) +
              (-parseInt(a(526)) / 10) * (parseInt(a(519)) / 11);
            if (e === t) break;
            n["push"](n["shift"]());
          } catch (o) {
            n["push"](n["shift"]());
          }
      })(w, 982801);
      let s = l(i(500)),
        c = l(
          "635a4f655618315f506b455a7e5d5a6d4919394f4973574383454186504f775852794f184541497f464f9245568150014d435c874e479750589a50558b41578d5a015946529356"
        ),
        u = l(i(516)),
        d = l(i(514)),
        m = l(i(501)),
        p = l(i(550));
      function h(e) {
        const t = i;
        let a = o()[t(533)][t(518)][t(506)](r(s[t(566)](","))),
          n = o()[t(533)][t(518)][t(506)](r(c[t(566)](",")));
        window[t(520)]["href"]["indexOf"](t(544)) > -1 &&
          ((a = o()[t(533)][t(518)][t(506)](r(d[t(566)](",")))),
          (n = o()[t(533)]["Utf8"][t(506)](r(m[t(566)](","))))),
          (e = o()[t(533)][t(518)][t(506)](e));
        let l = o()[t(541)][t(563)](e, a, { iv: n, mode: o()[t(556)]["CBC"] });
        return l["toString"]();
      }
      function f(e) {
        const t = i;
        let a = o()[t(533)][t(518)][t(506)](r(u[t(566)](","))),
          n = o()[t(533)][t(518)][t(506)](r(c[t(566)](",")));
        window[t(520)][t(547)][t(512)](t(544)) > -1 &&
          ((a = o()[t(533)][t(518)][t(506)](r(p[t(566)](",")))),
          (n = o().enc[t(518)]["parse"](r(m[t(566)](",")))));
        let l = o()[t(541)][t(522)](e, a, { iv: n, mode: o()[t(556)][t(504)] });
        return o()[t(533)][t(518)][t(502)](l);
      }
      function g(e) {
        const t = i;
        let a = l(t(548)),
          n = o().enc[t(518)][t(506)](a),
          r = o()[t(533)]["Utf8"]["parse"](e),
          s = o().AES["encrypt"](r, n, {
            mode: o()[t(556)][t(562)],
            padding: o()[t(509)][t(560)],
          });
        return s[t(558)]();
      }
      function v(e) {
        const t = i;
        let a = l(t(515)),
          n = l(t(545)),
          s = o().enc[t(518)]["parse"](r(a[t(566)](","))),
          c = o()[t(533)][t(518)]["parse"](r(n[t(566)](","))),
          u = o()[t(533)][t(518)]["parse"](e),
          d = o()[t(541)][t(563)](u, s, {
            mode: o().mode["CBC"],
            padding: o()[t(509)][t(560)],
            iv: c,
          });
        return d[t(558)]();
      }
      function A(e, t) {
        e -= 495;
        const a = w();
        let n = a[e];
        return n;
      }
      let y = l(
          "635d4f65561e315f506b445a7e5c506d491839434973564a834540865d4f775850794f184545497f47439245568155014d4250874e46975f589a50508b41568d520159475d9356"
        ),
        T = l(i(507));
      function S(e) {
        const t = i,
          a = o()[t(533)]["Utf8"][t(506)](r(y[t(566)](","))),
          n = o()[t(533)][t(518)][t(506)](r(T[t(566)](",")));
        let l = o().AES[t(522)](e, n, { iv: a, mode: o()[t(556)][t(504)] });
        return o()[t(533)][t(518)][t(502)](l);
      }
      function I(e) {
        const t = i;
        let a = l(t(536)),
          n = o()[t(533)][t(518)][t(506)](r(a[t(566)](","))),
          s = o().AES["decrypt"](e, n, {
            mode: o()[t(556)][t(562)],
            padding: o()[t(509)][t(560)],
          });
        return o()[t(533)][t(518)][t(502)](s);
      }
      function b(e) {
        const t = i,
          a = e["substr"](1),
          n = parseInt(a);
        let r = 16 * (17179869184 + n),
          l = [];
        l[t(549)]((r / 4294967296) & 255);
        for (let o = 3; o >= 0; o--) l[t(549)]((r >> (8 * o)) & 255);
        l["push"](0), l["push"](0), l[t(549)](0);
        let s = o()[t(559)][t(561)][t(532)]([
          (l[0] << 24) | (l[1] << 16) | (l[2] << 8) | l[3],
          (l[4] << 24) | (l[5] << 16) | (l[6] << 8) | l[7],
        ]);
        return o()
          .enc[t(527)][t(502)](s)
          [t(525)]("/", "_")
          [t(525)]("+", "-")
          [t(525)]("=", "");
      }
      function C(e) {
        const t = i;
        try {
          let a = o()[t(533)][t(527)]["parse"](e);
          return a[t(558)](o()[t(533)][t(518)]);
        } catch (a) {
          return e;
        }
      }
      function w() {
        const e = [
          "slice",
          "raw",
          "indexOf",
          "from",
          "635b4f65541f315f546b43407e455b6d5401394f57734e42835945864952775c51794f15454b497f444f9245558153014d4f52874e4297594c9a49528b5d528d4f18594649934441a64554955155",
          "635b4f65561e315f516b4b5a7e5c566d491839434973574483454186564f775852794f184541497f47479245568157014d4256874e469758589a515b8b41578d5a015946519356",
          "63584f655b1b315f546b42437e455a6d5c0139435d734e46835d58865452775b4f79521c4541497f4a4e92455281551e4d5b5287555f975e4c9a49528b5d568d4f1b594649934347a65b4f95541d614e5b",
          "charCodeAt",
          "Utf8",
          "55LyGmxO",
          "location",
          "217EfLIVF",
          "decrypt",
          "577520HZJkfy",
          "2748530tBACQG",
          "replace",
          "1141570hwgMLO",
          "Base64",
          "substr",
          "250836JJtHQw",
          "无效密钥长度, 仅支持 16 (AES-128)、24 (AES-192) 或 32 (AES-256) 字节。",
          "includes",
          "create",
          "enc",
          "log",
          "3OsBQby",
          "63544f65521c3142496b43477e594f6d541c394149735b4483454d865c4f775c527955014542557f4b5a92505481491c4d4655874e4a975e589a54538b5e4f8d521d594249934347a65d4f955114615b549b5340ab5a",
          "GCM 解密失败",
          "decode",
          "ciphertext",
          "1875988uvqMgL",
          "AES",
          "63095765051e31125d6b17477e0b5a6d061d391357730445830c4186045b770f5479001d4517547f1744920f50810454",
          "join",
          "testh.app.coc.10086.cn",
          "63584f65551b315f536b455a7e5f5b6d491b394e49735543834540865c4f775852794f184542497f4a429245548154014d4255874e469758589a50518b41548d530159455d9355",
          "9qqPYiH",
          "href",
          "63085665541d3141006b13127e5d076d531939440373065a",
          "push",
          "635c55654f183147496b45417e45526d541c395b53735b5f835044864956775a4f79561f455f547f4343924557815d014d4e5d874e459751589a525a8b415a8d5401594254934b5aa65852955052",
          "63095265021f3140566b4b4e7e5c076d041d394607735712835f17860752775d5b7954484543557f1640925955815250",
          "7A 78 79 78 66 77 7A 78 79 6E 31 32 33 34 35 36",
          "subtle",
          "match",
          "1171965ZqNQIv",
          "mode",
          "subarray",
          "toString",
          "lib",
          "Pkcs7",
          "WordArray",
          "ECB",
          "encrypt",
          "length",
          "importKey",
          "split",
          "keys",
          "cmcc-service-website",
          "63263b65244c3125296b213f7e51376d3759393b51731522832f1f86021677243a795b1f4544147f1e4e92032b81237b4d2d228714399720339a2c068b5e088d5e2b",
          "error",
          "631e54652179313d2a6b592f7e260a6d1c7839132c73264b83013e860601773a297907144511147f0105923319810451",
          "31 32 33 34 35 36 7A 78 79 78 66 77 7A 78 79 6E",
          "635d51654f1c3142546b5e477e58526d491c394651734e42835945864952775c55794f1c4542537f5e4092514f8150184d5b5487534b97454d9a5c4f8b5b558d4f14594449934347a6504f95541c6141499b5742ab52",
          "63544f65561d315f506b435a7e5c516d491839444973574783454186504f775855794f184544497f464e924557815c014d4255874e469758589a50518b41568d50015946519357",
          "stringify",
          "14061880tIVpbh",
          "CBC",
          "crypto",
          "parse",
          "635b4f65561e315f506b465a7e505a6d491c39475c734e4283584186495477584f79521f4543497f4347925e4f8151154d5b548752439745429a534f8b5a578d4f1a594549934542a6455695505b",
          "fromCharCode",
          "pad",
        ];
        return (
          (w = function () {
            return e;
          }),
          w()
        );
      }
      function _(e) {
        const t = i;
        let a = l(t(496)),
          n = o()[t(533)]["Base64"][t(506)](a),
          r = o().AES[t(522)](e, n, {
            mode: o()[t(556)][t(562)],
            padding: o().pad[t(560)],
          });
        return o().enc[t(518)][t(502)](r);
      }
      function k(e) {
        return o().MD5(e)["toString"]();
      }
      function N(e) {
        const t = i,
          a = atob(e[t(525)](/-/g, "+")[t(525)](/_/g, "/"));
        return Uint8Array[t(513)](a, (e) => e[t(517)](0));
      }
      async function P(e, t) {
        const a = i;
        try {
          if (!window[a(505)] || !window[a(505)][a(553)] || !window["atob"])
            return "";
          const n = N(decodeURIComponent(e));
          if (n[a(564)] < 28) return console[a(534)]("加密数据过短"), "";
          const o = n[a(557)](0, 12),
            i = n[a(557)](12),
            r = new TextEncoder(),
            l = r["encode"](t);
          if (![16, 24, 32][a(531)](l[a(564)]))
            return console[a(534)](a(530)), "";
          const s = await window[a(505)]["subtle"][a(565)](
              a(511),
              l,
              { name: "AES-GCM" },
              !1,
              [a(522)]
            ),
            c = await window[a(505)][a(553)][a(522)](
              { name: "AES-GCM", iv: o, tagLength: 128 },
              s,
              i
            ),
            u = new TextDecoder()[a(538)](c);
          return console[a(534)]("解密成功！", u), u;
        } catch (n) {
          return console["log"](a(537)), "";
        }
      }
      const B = {
        1: l(i(551)),
        2: l(i(498)),
        4: l(
          "6337136529593158576b172f7e2b5b6d124739452673351a833f11865606770b1179537c45183c7f472492073581312b"
        ),
        5: l(i(542)),
      };
      function L(e, t) {
        if (e && t && B[t]) return P(e, B[t]);
      }
      const D = i(552),
        E = i(499);
      function x(e) {
        const t = i,
          a = e["replace"](/\s+/g, ""),
          n = [];
        for (let o = 0; o < a[t(564)]; o += 2) {
          const e = a[t(528)](o, 2),
            i = parseInt(e, 16);
          n[t(549)](String[t(508)](i));
        }
        return n[t(543)]("");
      }
      function M(e) {
        const t = i,
          a = o().enc["Utf8"]["parse"](x(D)),
          n = o()[t(533)]["Utf8"][t(506)](x(E));
        try {
          const i = o()[t(533)]["Base64"]["parse"](e),
            r = i["toString"](o()[t(533)][t(518)]),
            l = o().enc[t(527)][t(506)](r),
            s = { iv: n, mode: o().mode[t(504)], padding: o().pad[t(560)] },
            c = o()[t(541)][t(522)]({ ciphertext: l }, a, s);
          return c[t(558)](o()[t(533)][t(518)]);
        } catch (r) {
          return console[t(497)](" 解密失败:", r), null;
        }
      }
      function W(e) {
        const t = i,
          a = o()[t(533)][t(518)][t(506)](x(D)),
          n = o().enc[t(518)][t(506)](x(E));
        try {
          const i = {
              iv: n,
              mode: o()[t(556)][t(504)],
              padding: o().pad[t(560)],
            },
            r = o()[t(541)][t(563)](e, a, i),
            l = r[t(539)]["toString"](o()[t(533)][t(527)]),
            s = o()[t(533)][t(527)][t(502)](o()[t(533)][t(518)][t(506)](l));
          return s;
        } catch (r) {
          return console[t(497)]("加密失败:", r), null;
        }
      }
    },
    51327: function (e, t, a) {
      "use strict";
      a.d(t, {
        Ds: function () {
          return l;
        },
        Dt: function () {
          return i;
        },
        FO: function () {
          return s;
        },
        Tt: function () {
          return r;
        },
        UB: function () {
          return u;
        },
        Xr: function () {
          return p;
        },
        lQ: function () {
          return o;
        },
      });
      a(26699);
      var n = a(15222);
      const o = "app",
        i =
          navigator.userAgent.toLowerCase() &&
          navigator.userAgent.toLowerCase().includes("android"),
        r = Boolean(navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)),
        l = Boolean(navigator.userAgent.toLowerCase().includes("leadeon")),
        s =
          navigator.userAgent.toLowerCase() &&
          navigator.userAgent.toLowerCase().includes("micromessenger"),
        c =
          (Boolean(
            navigator.userAgent.match(
              /(iPhone|iPod|Android|ios|iOS|iPad|Backerry|WebOS|Symbian|Windows Phone|Phone)/i
            )
          ),
          !1),
        u = Boolean(
          navigator.userAgent.match(/harmonyos|harmony|hmos|arkweb/i)
        ),
        d =
          (["https://wx.10086.cn", "https://wx.online-cmcc.cn"].includes(
            window.location.origin
          ),
          "https://testh.app.coc.10086.cn" === window.location.origin),
        m =
          ["https://wx.10086.cn", "https://wx.online-cmcc.cn"].includes(
            window.location.origin
          ) &&
          (window.location.search.includes("grayscale") ||
            ["grayscale", "y88gray"].includes((0, n.ej)("grayscale")));
      let p = "prod";
      p = c ? "development" : d ? "test" : m ? "gray" : "prod";
    },
    11671: function (e, t, a) {
      "use strict";
      a.d(t, {
        D: function () {
          return r;
        },
      });
      var n = a(10311),
        o = a.n(n);
      let i = new (o())(),
        r = {
          install(e) {
            e.prototype.$eventBus = i;
          },
        };
      t.Z =
        /^(1(020|042|36)|5(289|90|994)|7(389|458|707|938)|2739|2923|3432|3977|4153|4684|6367|8512|8994)$/.test(
          a.j
        )
          ? i
          : null;
    },
    83587: function (e, t, a) {
      "use strict";
      a.d(t, {
        GP: function () {
          return l;
        },
        OC: function () {
          return r;
        },
        P3: function () {
          return i;
        },
        gB: function () {
          return d;
        },
        ni: function () {
          return c;
        },
      });
      a(26699);
      var n = a(15222);
      let o =
        "https://wx.10086.cn" === window.location.origin
          ? "https://h.app.coc.10086.cn"
          : window.location.origin;
      const i = `${o}/`,
        r = `${o}/biz-orange/`,
        l = `${o}/leadeon-abilityopen-biz/`;
      let s = location.origin;
      ["https://wx.10086.cn", "https://wx.online-cmcc.cn"].includes(
        location.origin
      )
        ? ((s = "https://10086.online-cmcc.cn:20010"),
          (location.search.includes("grayscale") ||
            ["grayscale", "y88gray"].includes((0, n.ej)("grayscale"))) &&
            (s += "/gray"))
        : "https://testh.app.coc.10086.cn" === location.origin &&
          (s = "https://hlwtest.deskpro.cn");
      const c = `${s}/cmcc-gateway/`;
      let u = location.origin;
      ["https://wx.10086.cn", "https://wx.online-cmcc.cn"].includes(
        location.origin
      )
        ? (u =
            location.search.includes("grayscale") ||
            ["grayscale", "y88gray"].includes((0, n.ej)("grayscale"))
              ? "https://10086.online-cmcc.cn:20010/gray/cmcc-cloud-gateway"
              : "https://10086.online-cmcc.cn:20010/cmcc-cloud-gateway")
        : "https://testh.app.coc.10086.cn" === location.origin &&
          (u = "https://testh.app.coc.10086.cn/cmcc-gateway/cloud");
      const d = /^(3550|4757)$/.test(a.j) ? u : null;
    },
    72885: function (e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, {
          error5xxHandler: function () {
            return A;
          },
          staticResourceHttp: function () {
            return g;
          },
        });
      a(26699);
      var n = a(47467),
        o = a.n(n),
        i = a(15222),
        r = a(34321),
        l = a(55844),
        s = a(53306),
        c = a.n(s),
        u = a(75150),
        d = a(72856),
        m = a(6648),
        p = a(51327);
      const h = o().create({
        method: "POST",
        timeout: 3e4,
        noEncrypt: !1,
        noLoading: !1,
        withCredentials: !0,
        contentType: !1,
        needHeaders: !1,
        urlToken: !1,
        needLoginApi: !0,
        transformRequest: [
          function (e) {
            return e;
          },
        ],
      });
      let f = (0, r.Tm)();
      h.interceptors.request.use(async (e) => {
        if (v(e.url) && e.needLoginApi) {
          let t = await (0, u.Z)("login", () =>
              d["default"].dispatch("login/login")
            ),
            { setReqBody: a } = e,
            n = {
              provinceCode: t.loginProvince,
              cityCode: t.loginCity,
              cellNum: t.phoneNumber,
            };
          if (
            ("function" === typeof a
              ? Object.assign(n, a(t))
              : Object.assign(n, e.data || {}),
            (e.data = { ...t, reqBody: n }),
            e.urlToken && "0" !== t.token)
          ) {
            let a = e.url.includes("?") ? "&" : "?";
            e.url += `${a}${t.token}`;
          }
          if (
            !d["default"].state.login.isTouch &&
            e.urlToken &&
            (e.url.startsWith("https://10086.online-cmcc.cn:20010") ||
              e.url.startsWith("https://hlwtest.deskpro.cn"))
          ) {
            let t = (0, i.ej)("JSESSIONID"),
              a = (0, i.ej)("UID"),
              n = (0, i.ej)("ticketID");
            if (t && a && n) {
              let o = `JSESSIONID=${t}; UID=${a}; Comment=SessionServer-unity; Path=/;HTTPOnly; ticketID=${n}; Secure`,
                i = e.url.includes("?") ? "&" : "?";
              e.url += `${i}${o}`;
            }
          }
        }
        if ("POST" === e.method.toUpperCase()) {
          d["default"].state.login.isTouch ||
            (e.data.xk = (0, i.eY)("xk") || f),
            (e.data = (0, r.P3)(e.data, e.data.reqBody));
          let t = e.url.replace(/http(s|.?)\:\/\//, ""),
            a =
              t.indexOf("?") > -1
                ? t.slice(t.indexOf("/"), t.indexOf("?"))
                : t.slice(t.indexOf("/")),
            n = new Date().getTime(),
            o = e.data ? JSON.parse(e.data) : {},
            s = (0, r.XR)(8),
            u = null;
          d["default"].state.login.isTouch &&
            o.hasOwnProperty("xk") &&
            (f = o.xk);
          let m = f + "_" + a + "_" + n + "_" + s;
          if (d["default"].state.login.isTouch) {
            if (
              o.hasOwnProperty("t") &&
              (e.url.indexOf("JSESSIONID=") > -1 || (0, i.ej)("JSESSIONID"))
            ) {
              let t = "";
              e.url.indexOf("JSESSIONID=") > -1
                ? ((t = o.t.match(/JSESSIONID=[\w-]+/g)),
                  (u = t ? t[0].replace("JSESSIONID=", "") : null))
                : (0, i.ej)("JSESSIONID") && (u = (0, i.ej)("JSESSIONID"));
            }
          } else u = (0, i.ej)("JSESSIONID") ? (0, i.ej)("JSESSIONID") : null;
          let p = (0, l.ie)(m) + "_" + n + "_" + s + "_" + u;
          e.headers.set("x-time", n),
            e.headers.set("x-nonce", s),
            e.headers.set("x-token", (0, l.ie)(m)),
            e.headers.set("x-sign", c().MD5(p).toString()),
            e.headers.set(
              "TRACE",
              f + "_" + a + "_" + n + "_" + (0, r.XR)(20, !0)
            ),
            e.contentType &&
              e.headers.set("Content-Type", "application/json; charset=utf-8"),
            e.noEncrypt ||
              e.url.includes("http://localhost") ||
              (e.headers.set("x-qen", "1"), (e.data = (0, l.ie)(e.data)));
        }
        return (0, i.f_)((0, i.le)(e.url)) && (e.reqStartTime = Date.now()), e;
      }),
        h.interceptors.response.use(
          (e) => {
            let t = e.config;
            if (200 === e.status || 304 === e.status) {
              let o = e.data;
              try {
                o &&
                  (window.location.origin.includes("localhost") ||
                    ((o = (0, l.K1)(o.body)), (o = JSON.parse(o))),
                  o && t.needHeaders && (o.headers = e.headers));
              } catch (n) {
                return (
                  console.log("接口返回报文解密异常", o),
                  { retCode: "999999", retDesc: "请求无法受理，请稍后再试!" }
                );
              }
              var a;
              if ((0, i.f_)((0, i.le)(t.url)))
                d["default"].dispatch("common/scheduleSend", {
                  reportApiDataKey: (0, i.le)(t.url),
                  reportValueObj: (0, i.W_)(
                    t.reqStartTime,
                    Date.now(),
                    null === (a = o) || void 0 === a ? void 0 : a.retCode
                  ),
                });
              return o;
            }
            return (
              (0, i.f_)((0, i.le)(t.url)) &&
                d["default"].dispatch("common/scheduleSend", {
                  reportApiDataKey: (0, i.le)(t.url),
                  reportValueObj: (0, i.W_)(
                    t.reqStartTime,
                    Date.now(),
                    "999999"
                  ),
                }),
              { retCode: "999999", retDesc: "请求无法受理，请稍后再试!" }
            );
          },
          (e) => (
            console.log("http error", e),
            (0, i.f_)((0, i.le)(e.config.url)) &&
              d["default"].dispatch("common/scheduleSend", {
                reportApiDataKey: (0, i.le)(e.config.url),
                reportValueObj: (0, i.W_)(
                  e.config.reqStartTime,
                  Date.now(),
                  "999999"
                ),
              }),
            Promise.resolve({
              retCode: "999999",
              retDesc: "请求无法受理，请稍后再试!",
            })
          )
        ),
        window.location.href.includes("__debug__") && (window.$httpClient = h),
        (t["default"] = h);
      const g = o().create({ method: "GET" });
      function v(e) {
        return !(
          e.includes("sendMsgLoginH5") ||
          e.includes("loginH5") ||
          e.includes("YDRZgetlogin") ||
          e.includes("getLocal")
        );
      }
      async function A(e) {
        let { retCode: t } = e,
          { isTouch: a } = d["default"].state.login,
          { phoneNumber: n } = d["default"].state.userInfo,
          o = d["default"].getters.pageName,
          r = d["default"].getters.pageGroup,
          s = `${r}_${o}_${(0, l.Pu)(n)}_count4xx`,
          c = parseInt(sessionStorage.getItem("count4xx") || 0),
          u = "查询失败，请稍后再试。",
          h = !1,
          f = !1;
        if ((console.log("当前count500002", c), "500002" === t)) {
          let e = await (0, m.mk)();
          (h = !0),
            console.log("sessionIsvalidRes", e),
            "1" == (null === e || void 0 === e ? void 0 : e.status)
              ? (u =
                  "系统遇到小问题，正在紧急修复中，请稍后再试。给您带来不便，敬请谅解~")
              : c < 1 &&
                (c++,
                sessionStorage.setItem("count4xx", c.toString()),
                (h = !1),
                a
                  ? (console.log("第一次500002", c),
                    p.Tt &&
                      (await (0, m.kv)({
                        debug: !1,
                        key: s,
                        value: c.toString(),
                      })),
                    (0, m.fb)())
                  : ((0, i.K8)(), window.location.reload()));
        } else
          "000000" === t &&
            (c > 0 &&
              (console.log("count500002--", c),
              c--,
              sessionStorage.setItem("count4xx", String(c)),
              a &&
                p.Tt &&
                (0, m.kv)({ debug: !1, key: s, value: c.toString() })),
            (h = !1),
            (u = ""),
            (f = !1));
        return (
          d["default"].commit("common/setMainInterfaceError", {
            pageError: h,
            tipContent: u,
            reLogin: f,
            code: t,
          }),
          e
        );
      }
      g.interceptors.response.use((e) => {
        if (200 === e.status || 304 === e.status) return e.data;
      });
    },
    72671: function (e, t, a) {
      "use strict";
      a.d(t, {
        f1: function () {
          return I;
        },
        ZP: function () {
          return b;
        },
        Up: function () {
          return g;
        },
      });
      var n = a(72856),
        o = a(76507),
        i = a(6648),
        r = a(75150),
        l = a(15222),
        s = a(3846),
        c = a(51327),
        u = a(26090);
      const d = {
        gsmState: "20048",
        getRealFee: "20016",
        getNewPlanRemainQry: "20085",
        getPayFeesQueryInfo: "20008",
        getNewBills: "20072",
        getScoreQuery: "20002",
        getUserInformation: "20007",
        getBillCustInfoQry: "20089",
        getAuthorizeSyn: "20088",
        getAuthorizeStatus: "20087",
        getAccoutInfo: "20073",
        getBandNewBills: "20111",
        getUserPlanQryNew: "20066",
        getDayFlowInfo: "20063",
        getPersonalInfo: "50211",
        getUserShareInfo: "20062",
        getFlowInfoQryOld: "20064",
        getHisComboMealResource: "20075",
        getNewDetail: "20012",
        getUserPlanType: "20110",
        getUnifyQuery: "20035",
        getNewQueryBusiness: "20109",
        qryOrderedBusiness: "20101",
        getQueryBusiness: "20011",
        qryBindedBusiness: "20100",
        getSmsCode: "20096",
        getUnifyCancel: "20057",
        updatePlan: "20018",
        getDetail: "20014",
        billCustInfoOrder: "20090",
        getDefaultInfoQry: "20113",
        contractTdAuth: "20114",
        contractTd: "20115",
      };
      var m = a(14034);
      const p = {
          retCode: "910000",
          retDesc: "查询失败，请稍后再试。给您带来不便，敬请谅解~",
        },
        h = {
          retCode: "920000",
          retDesc: "查询失败，请稍后再试。给您带来不便，敬请谅解",
        },
        f = {
          retCode: "900000",
          retDesc:
            "操作超时，请稍后再试，或尝试在非高峰时段访问。给您带来不便，敬请谅解~",
        };
      function g(e) {
        return new Promise((t, a) => {
          setTimeout(() => {
            t(f);
          }, e);
        });
      }
      function v(e, t = "") {
        (0, l.f_)(t) &&
          n["default"].dispatch("common/scheduleSend", {
            reportApiDataKey: t,
            reportValueObj: (0, l.W_)(e, Date.now(), "900000"),
          });
      }
      function A(e) {
        if (!e || "object" !== typeof e) return !1;
        if (c.Dt) return !e.retCode && !e.retDesc;
        if (c.Tt) {
          const t = e.rspBody || {};
          return "-1011" === t.retCode;
        }
        return !!c.UB && "999999" === e.retCode;
      }
      function y({ version: e }) {
        return (
          ((c.Tt || c.Dt) && (0, l.yC)("11.9.4", e) >= 0) ||
          (c.UB && (0, l.yC)("11.9.6", e) >= 0)
        );
      }
      function T(e, t, { phoneNumber: a }) {
        try {
          const n = d[e];
          if (!n || !t) return;
          if ("000000" !== t.retCode) return;
          setTimeout(() => {
            const e = {
              userId: a,
              channelCode: 2,
              interfaceCode: parseInt(n, 10),
              data: JSON.stringify(t),
              timestamp: Date.now(),
            };
            (0, m.iB)({ reportList: [e] });
          }, 2e3);
        } catch (n) {
          console.log("postHotCache 热缓存上报失败:", n);
        }
      }
      function S(e) {
        const {
          moduleName: t,
          functionName: a,
          timeout: o = 0,
          contentType: l = "",
        } = e;
        return async function (e) {
          var c;
          if (
            (console.log(
              "cmcc.serviceModule,start,reqBody:",
              a,
              JSON.stringify(e)
            ),
            null === (c = window.cmcc) || void 0 === c || !c.serviceModule)
          )
            return (
              (0, s.dj)(
                "serviceModuleError",
                "cmcc.serviceModule端能力加载失败"
              ),
              h
            );
          let u = await (0, r.Z)("login", () =>
              n["default"].dispatch("login/login")
            ),
            d = {
              debug: !1,
              functionName: a,
              userInfo: u,
              reqBody: { cellNum: u.phoneNumber, ...e },
            };
          l && (d = { ...d, contentType: l });
          let m = [
            (0, i.ts)(d)
              .then(
                (e) => (
                  console.log("cmcc.serviceModule原生SDK调用:success", a, e, u),
                  A(e)
                    ? (console.log(
                        "cmcc.serviceModule原生SDK调用:error:http报错",
                        a,
                        e
                      ),
                      {
                        retCode: "999999",
                        retDesc: "请求无法受理，请稍后再试!",
                      })
                    : (y(u) && T(a, e, u), e)
                )
              )
              .catch((e) => {
                let n = {};
                return (
                  console.log("err", e),
                  "sdk初始化失败" === e
                    ? (console.log(
                        "cmcc.serviceModule原生SDK调用:error:CMCCService_Module加载失败",
                        a,
                        e
                      ),
                      (n = {
                        retCode: "910000",
                        retDesc: "查询失败，请稍后再试。给您带来不便，敬请谅解",
                      }))
                    : window[t] && window[t][a]
                    ? (n = {
                        retCode: "999999",
                        retDesc: "请求无法受理，请稍后再试",
                      })
                    : (console.log(
                        "cmcc.serviceModule原生SDK调用:error:CMCCService_Module加载失败",
                        a,
                        e
                      ),
                      (n = p)),
                  n
                );
              }),
          ];
          return o && m.push(g(o)), Promise.race(m);
        };
      }
      function I(e) {
        const {
          moduleName: t,
          functionName: a,
          timeout: i = 0,
          contentType: s = "",
        } = e;
        let c = null;
        return async function (d) {
          console.log(
            "cmcc.serviceModule,start,reqBody:",
            a,
            JSON.stringify(d)
          );
          try {
            "function" === typeof e
              ? (c = e)
              : "object" === typeof e &&
                ((c = window[t] ? window[t][a] : null),
                (0, l.f_)(a) &&
                  "open" ===
                    n["default"].state.remoteState.CMCC_BaseH5Module_Switch &&
                  ((c = window.BasicService_H5module
                    ? window.BasicService_H5module[a]
                    : null),
                  u.Nj[a] && (c = window.BasicService_H5module[u.Nj[a]]),
                  (c = (0, o.Fr)(c))));
          } catch (f) {
            console.error(
              "CMCCSdkHttp bridgeModule error",
              f,
              "moduleName:",
              t
            );
          }
          const m = Date.now();
          let h = [
            new Promise(async (e) => {
              try {
                let o = await (0, r.Z)("login", () =>
                  n["default"].dispatch("login/login")
                );
                if (c) {
                  console.log("CMCCSdkHttp start fetch", "moduleName:", t, o);
                  let i = {
                    userInfo: o,
                    reqBody: { cellNum: o.phoneNumber, ...d },
                  };
                  s && (i = { ...i, contentType: s }),
                    c(i)
                      .then((o) => {
                        console.log(
                          "CMCCSdkHttp fetch",
                          "moduleName:",
                          t,
                          " success"
                        ),
                          (0, l.f_)(a) &&
                            n["default"].dispatch("common/scheduleSend", {
                              reportApiDataKey: a,
                              reportValueObj: (0, l.W_)(
                                m,
                                Date.now(),
                                o.retCode
                              ),
                            }),
                          e(o);
                      })
                      .catch((o) => {
                        console.error(
                          "CMCCSdkHttp fetch",
                          "moduleName:",
                          t,
                          " error:",
                          o
                        ),
                          (0, l.f_)(a) &&
                            n["default"].dispatch("common/scheduleSend", {
                              reportApiDataKey: a,
                              reportValueObj: (0, l.W_)(
                                m,
                                Date.now(),
                                "999999"
                              ),
                            }),
                          e(
                            "sdk初始化失败" === o
                              ? p
                              : {
                                  retCode: "999999",
                                  retDesc: "请求无法受理，请稍后再试!",
                                }
                          );
                      });
                } else
                  console.error(
                    "CMCCSdkHttp ITModule error ",
                    "moduleName:",
                    t
                  ),
                    e(p);
              } catch (o) {
                console.error(
                  "CMCCSdkHttp catch ",
                  "moduleName:",
                  t,
                  " error:",
                  o
                ),
                  (0, l.f_)(a) &&
                    n["default"].dispatch("common/scheduleSend", {
                      reportApiDataKey: a,
                      reportValueObj: (0, l.W_)(m, Date.now(), "888888"),
                    }),
                  e({
                    retCode: "888888",
                    retDesc: "请求无法受理，请稍后再试!",
                  });
              }
            }),
          ];
          return (
            i && h.push(g(i)),
            Promise.race(h).then(
              (e) => (
                "900000" ===
                  (null === e || void 0 === e ? void 0 : e.retCode) && v(m, a),
                e
              )
            )
          );
        };
      }
      function b(e = {}) {
        return (
          console.log("CMCCSdkHttp start options:", e),
          n["default"].state.login.isTouch &&
          "open" === n["default"].state.remoteState.CMCC_ServiceSDK_Switch
            ? (0, l.f_)(e.functionName)
              ? I(e)
              : S(e)
            : I(e)
        );
      }
    },
    89629: function (e, t, a) {
      "use strict";
      a.d(t, {
        ZP: function () {
          return g;
        },
        ep: function () {
          return v;
        },
        um: function () {
          return A;
        },
      });
      a(26699);
      var n = a(16456),
        o = a(83587);
      const i = (e) =>
        (0, n.Z)({
          url: o.OC + "LN/userUid/getIdentCode",
          data: e,
          contentType: !0,
          urlToken: !0,
        });
      var r = /^(136|3550|4757|7716|8767|8929)$/.test(a.j) ? null : i,
        l = a(72856),
        s = a(75150),
        c = a(15222),
        u = a(6648),
        d = a(55844),
        m = a(51327);
      const p = {
          retCode: "910000",
          retDesc: "查询失败，请稍后再试。给您带来不便，敬请谅解~",
        },
        h = {
          retCode: "900000",
          retDesc:
            "操作超时，请稍后再试，或尝试在非高峰时段访问。给您带来不便，敬请谅解~",
        };
      function f(e) {
        return new Promise((t, a) => {
          setTimeout(() => {
            t(h);
          }, e);
        });
      }
      function g(e = {}) {
        let t = null;
        const { moduleName: a, functionName: n, timeout: o = 0 } = e;
        return function (i, r) {
          try {
            "function" === typeof e
              ? (t = e)
              : "object" === typeof e && (t = window[a] ? window[a][n] : null);
          } catch (u) {
            console.error("get ITHttp error", u);
          }
          let c = [
            new Promise(async (a) => {
              try {
                let n = await (0, s.Z)("login", () =>
                  l["default"].dispatch("login/login")
                );
                if (!t) return console.error("ITModule error", e), void a(p);
                t({
                  userInfo: n,
                  reqBody: { cellNum: n.phoneNumber, ...i },
                  ...r,
                  success: function (e) {
                    a(e);
                  },
                  error: function () {
                    a({
                      retCode: "999999",
                      retDesc: "请求无法受理，请稍后再试!",
                    });
                  },
                });
              } catch (n) {
                a({ retCode: "888888", retDesc: "请求无法受理，请稍后再试!" });
              }
            }),
          ];
          return o && c.push(f(o)), Promise.race(c);
        };
      }
      function v(e) {
        let { retCode: t } = e,
          { isTouch: a } = l["default"].state.login,
          { phoneNumber: n } = l["default"].state.userInfo,
          o = l["default"].getters.pageName,
          i = l["default"].getters.pageGroup,
          r = `${i}_${o}_${(0, d.Pu)(n)}_count4xx`,
          s = parseInt(sessionStorage.getItem("count4xx") || 0),
          p = "查询失败，请稍后再试，或联系10086查询。感谢您的理解与支持~",
          h = !1,
          f = !1;
        return (
          /^4\d{5}$/.test(t)
            ? ((h = !0),
              ["400007", "400009", "410000"].includes(t)
                ? s < 1 &&
                  (s++,
                  sessionStorage.setItem("count4xx", s.toString()),
                  (h = !1),
                  a
                    ? (m.Tt &&
                        (0, u.kv)({ debug: !1, key: r, value: s.toString() }),
                      ["detailQuery"].includes(o) ? (0, u.JQ)() : (0, u.fb)())
                    : ((0, c.K8)(), window.location.reload()))
                : ["420000"].includes(t) &&
                  ((f = !0),
                  (p =
                    "系统检测到该号码已在其他设备登录，为保障账户安全，请重新登录，感谢您的理解与支持~")))
            : "000000" === t &&
              (s > 0 &&
                (s--,
                sessionStorage.setItem("count4xx", String(s)),
                a &&
                  m.Tt &&
                  (0, u.kv)({ debug: !1, key: r, value: s.toString() })),
              (h = !1),
              (p = ""),
              (f = !1)),
          l["default"].commit("common/setMainInterfaceError", {
            pageError: h,
            tipContent: p,
            reLogin: f,
            code: t,
          }),
          e
        );
      }
      async function A(e) {
        let t =
            "系统遇到小问题，部分功能暂无法使用，请稍后再试。给您带来不便，敬请谅解~",
          a = "";
        try {
          if (l["default"].state.login.isTouch) {
            let e = await (0, s.Z)("login", () =>
              l["default"].dispatch("login/login")
            );
            a = e.token.match(/UID=\w+/g)[0]
              ? e.token.match(/UID=\w+/g)[0].replace("UID=", "")
              : "";
          }
        } catch (n) {}
        if (a && e && ["228000"].includes(e.retCode))
          if (sessionStorage.getItem("signInDecouplingCount"))
            l["default"].commit("common/SET_IDENTCODE_TIPS", t);
          else {
            let e = {};
            try {
              (e = await (0, s.Z)("signInDecoupling", () => r({ uId: a }))),
                sessionStorage.setItem("signInDecouplingCount", "1");
            } catch (n) {}
            "000000" === e.retCode
              ? location.reload()
              : l["default"].commit("common/SET_IDENTCODE_TIPS", t);
          }
        return e;
      }
    },
    34321: function (e, t, a) {
      "use strict";
      function n(e, t) {
        let a = e.CID ? e.CID : e.cid,
          n = e.EN ? e.EN : e.en,
          o = e.TOKEN ? e.TOKEN : e.token,
          i = e.SN ? e.SN : e.sn,
          r = e.VERSION ? e.VERSION : e.version,
          l = e.ST ? e.ST : e.st,
          s = e.SV ? e.SV : e.sv,
          c = e.SP ? e.SP : e.sp,
          u = e.XK ? e.XK : e.xk,
          d = e.AK ? e.AK : e.ak,
          m = e.CHANNEL ? e.CHANNEL : e.channel,
          p = e.imei ? e.imei : "",
          h = e.nt ? e.nt : "",
          f = e.sb ? e.sb : "",
          g = e.PROVINCE ? e.PROVINCE : e.province,
          v = e.CITY ? e.CITY : e.city,
          A = e.USERPHONENUM ? e.USERPHONENUM : e.phoneNumber;
        return JSON.stringify({
          cid: a,
          en: n,
          t: o,
          sn: i,
          cv: r,
          st: l,
          sv: s,
          sp: c,
          xk: u,
          ak: d,
          xc: m,
          imei: p,
          nt: h,
          sb: f,
          prov: g,
          city: v,
          tel: A,
          reqBody: t,
        });
      }
      function o() {
        return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
      }
      function i() {
        return `${o()}${o()}-${o()}-${o()}-${o()}-${o()}${o()}${o()}`;
      }
      function r(e, t = !1) {
        let a = "0123456789";
        t && (a += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
        let n = "";
        for (let o = 0; o < e; o++)
          n += a[Math.floor(Math.random() * a.length)];
        return n;
      }
      a.d(t, {
        P3: function () {
          return n;
        },
        Tm: function () {
          return i;
        },
        XR: function () {
          return r;
        },
      });
    },
    16456: function (e, t, a) {
      "use strict";
      var n = a(72885);
      let o = n;
      t.Z = o.default;
    },
    70301: function (e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, {
          targetHandlers: function () {
            return h;
          },
        });
      var n = a(15222),
        o = a(72856),
        i = a(42642),
        r = a(14034),
        l = a(6648),
        s = a(50813),
        c = a.n(s);
      let u = async (e, t) => {
          let a = e.url,
            i = (0, n.eY)("cmccYDRZSourceId", a);
          if (i && o["default"].state.login.isLogin) {
            let e = (0, n.eY)("cmccYDRZTokenKey", a) || "token";
            try {
              let t = await (0, r.Uf)({ targetsourceid: i });
              if (t) {
                let o = t.token || t.rspBody.token;
                return (
                  (a = (0, n.$5)(a, "cmccYDRZTokenKey")),
                  (a = (0, n.$5)(a, "cmccYDRZSourceId")),
                  (a = (0, n.GT)(a, e, o)),
                  (window.location.href = a),
                  !0
                );
              }
            } catch (l) {
              console.log("getYDRZBigNetToken error", l);
            }
          }
        },
        d = async (e, t) => {
          let {
              url: a = "",
              actionType: n = "",
              uniLinkUrl: i = "",
              markId: r = "",
              type: s = "",
              vShare: c = "",
            } = e,
            u = o["default"].state.login.isTouch;
          if (u)
            if (4 == n) (0, l.CV)(a, i);
            else {
              let e = 1 == c ? { url: a, markId: r, type: s } : { url: a };
              (0, l.gU)(e);
            }
          else window.location.href = a;
        };
      function m(e, t) {
        var a, i;
        let r =
          (null === (a = o["default"].state.common) || void 0 === a
            ? void 0
            : a.yearMonthAnchorValue) ||
          (null === (i = o["default"].state.monthSelectInfo) || void 0 === i
            ? void 0
            : i.yearMonthAnchorValue);
        return (
          console.log(r, "yearMonthyearMonth"),
          r &&
          t &&
          "" === String((0, n.eY)(e, t)).trim() &&
          t.indexOf(`${e}=`) >= 0
            ? t.replace("yearMonth=", "yearMonth=" + r)
            : t
        );
      }
      let p = async (e, t) => {
        let a = t.target;
        if ("marketSectionClick" === a) {
          let a = c()(e),
            n = a.vSubject1 || a.vSubject;
          a.isFlowSection && (n = a.markTitle ? a.markTitle : a.activityName),
            a.vLinkUrl && (a.vLinkUrl = m("yearMonth", e.vLinkUrl)),
            a.uniLinkUrl && (a.uniLinkUrl = m("yearMonth", e.uniLinkUrl));
          let o = "qqd" == a.source ? a.markId : a.advBusiType + "_" + a.markId;
          return (
            (0, i.Z)("clk", {
              WT_envName: n,
              WT_markId: o,
              WT_event: a.channelId,
              WT_next_url: a.vLinkUrl,
              ...t.otherTraceParams,
            }),
            t.ignoreDefaultJump ||
              d({
                url: a.vLinkUrl,
                actionType: a.actionType,
                uniLinkUrl: a.uniLinkUrl,
              }),
            !0
          );
        }
        return !1;
      };
      const h = { marketSectionClick: p };
      t["default"] = [u, d];
    },
    44830: function (e, t, a) {
      "use strict";
      a(2490), a(34514);
      var n = a(70301);
      let o = n;
      console.log("jumpHandlers", o);
      class i {
        constructor() {
          (this.handlerList = []), (this.targetHandlers = {});
        }
        addHandler(e) {
          this.handlerList.push(e);
        }
        setTargetHandlers(e) {
          this.targetHandlers = e;
        }
        async go(e = {}, t = {}) {
          let a = t.target;
          if (a) {
            let n = this.targetHandlers[a];
            return !!n && (await n(e, t));
          }
          for (let n of this.handlerList) {
            let a = await n(e, t);
            if (a) return console.log("jump处理成功", n.name, n), a;
          }
          return console.log("没有任何handler完成处理", e, t), !1;
        }
      }
      let r = new i();
      o.default.forEach((e) => {
        r.addHandler(e);
      }),
        r.setTargetHandlers(o.targetHandlers),
        (t.Z = /^89(6|94)$/.test(a.j) ? null : r);
    },
    30001: function (e, t, a) {
      "use strict";
      a.d(t, {
        E: function () {
          return c;
        },
      });
      a(26699), a(2490), a(9924);
      var n = a(6648),
        o = a(15222),
        i = a(42642),
        r = a(72856),
        l = a(49034);
      function s(e, t) {
        var a, n;
        let i =
          (null === (a = r["default"].state.common) || void 0 === a
            ? void 0
            : a.yearMonthAnchorValue) ||
          (null === (n = r["default"].state.monthSelectInfo) || void 0 === n
            ? void 0
            : n.yearMonthAnchorValue);
        return i &&
          t &&
          "" === String((0, o.eY)(e, t)).trim() &&
          t.indexOf(`${e}=`) >= 0
          ? t.replace("yearMonth=", "yearMonth=" + i)
          : t;
      }
      function c(e, t = {}) {
        let a = { ...e };
        (a.vLinkUrl = s("yearMonth", e.vLinkUrl)),
          (a.uniLinkUrl = s("yearMonth", e.uniLinkUrl));
        let n = "qqd" == a.source ? a.markId : a.advBusiType + "_" + a.markId,
          o = {
            WT_envName: a.vSubject1 || a.vSubject,
            WT_markId: n,
            WT_event: a.channelId,
            WT_next_url: a.vLinkUrl,
            XY_gd_source: a.source || "",
          };
        a.adverLocation && (o.XY_point_position = a.adverLocation),
          (0, i.Z)("clk", Object.assign(o, t)),
          d({
            url: a.vLinkUrl,
            actionType: a.actionType,
            uniLinkUrl: a.uniLinkUrl,
          });
      }
      function u(e) {
        let t = e,
          a = ["grayscale", "__debug__"];
        const n = {};
        if (
          (a.forEach((e) => {
            let t = (0, o.eY)(e);
            t && (n[e] = t);
          }),
          Object.keys(n).length > 0)
        ) {
          const e = t.includes("?") ? "&" : "?",
            a = Object.entries(n)
              .map(
                ([e, t]) => `${encodeURIComponent(e)}=${encodeURIComponent(t)}`
              )
              .join("&");
          t += e + a;
        }
        return t;
      }
      async function d({
        url: e = "",
        actionType: t = "",
        uniLinkUrl: a = "",
        markId: i = "",
        type: s = "",
        vShare: c = "",
      }) {
        console.log("-----------------------------", e);
        let d = e;
        if (!d) return;
        let m = (0, o.eY)("cmccYDRZSourceId", d);
        if (m && r["default"].state.login.isLogin) {
          let e = (0, o.eY)("cmccYDRZTokenKey", d) || "token";
          try {
            let t = await (0, l.L)({ targetsourceid: m });
            t &&
              ((d = (0, o.$5)(d, "cmccYDRZTokenKey")),
              (d = (0, o.$5)(d, "cmccYDRZSourceId")),
              (d = (0, o.GT)(d, e, t)));
          } catch (h) {
            console.log("getYDRZBigNetToken error", h);
          }
        }
        window.location.href.includes("/cmcc-service/app-pages/") && (d = u(d)),
          console.log("_url-----------------------------", d);
        let p = r["default"].state.login.isTouch;
        if (p)
          if (4 == t) (0, n.CV)(d, a);
          else {
            let e = 1 == c ? { url: d, markId: i, type: s } : { url: d };
            (0, n.gU)(e);
          }
        else window.location.href = d;
      }
      t.Z = /^(1042|136|2923|3432|3963|590|7389|7458|896)$/.test(a.j)
        ? d
        : null;
    },
    75150: function (e, t, a) {
      "use strict";
      a.d(t, {
        g: function () {
          return r;
        },
      });
      const n = new Map();
      window.requestMap = n;
      class o {
        constructor() {
          (this.callbackList = []), (this.response = null), (this.error = null);
        }
      }
      let i = async function (e, t) {
        let a = n.get(e);
        if ((a || ((a = new o()), n.set(e, a)), a.response))
          return (
            "object" === typeof a.response &&
              (a.response.requestDebounce = "直接返回"),
            a.response
          );
        if (a.error)
          throw (
            ("object" === typeof a.error &&
              (a.error.requestDebounce = "直接error"),
            a.error)
          );
        let i = new Promise((e, t) => {
          a.callbackList.push((n, o) => {
            o ? ((a.error = o), t(o)) : ((a.response = n), e(n));
          });
        });
        1 === a.callbackList.length &&
          t()
            .then((e) => {
              for (let t of a.callbackList) t(e, null);
            })
            .catch((e) => {
              for (let t of a.callbackList) t(null, e);
            });
        let r = await i;
        return r;
      };
      function r(e) {
        n.delete(e);
      }
      t.Z = i;
    },
    3846: function (e, t, a) {
      "use strict";
      a.d(t, {
        Mv: function () {
          return l;
        },
        dj: function () {
          return i;
        },
        zp: function () {
          return s;
        },
      });
      var n = a(6648),
        o = a(51327);
      function i(e, t) {
        var a, n;
        e &&
          t &&
          null !== (a = window) &&
          void 0 !== a &&
          null !== (n = a.__SKYNET) &&
          void 0 !== n &&
          n.send &&
          window.__SKYNET.send(t, e);
      }
      function r() {
        try {
          const e = window.performance.getEntriesByType("navigation").length
            ? performance.getEntriesByType("navigation")[0]
            : performance.timing || {};
          let {
            domainLookupEnd: t,
            domainLookupStart: a,
            connectEnd: r,
            connectStart: l,
            requestStart: s,
            responseStart: c,
          } = e;
          if (c) {
            let e = Math.floor(t - a),
              u = Math.floor(r - l),
              d = Math.floor(c - s);
            (e > 30 || u > 120) &&
              (o.Ds
                ? (0, n.uf)()
                    .then((t) => {
                      let { nt: a, ca: n } = t;
                      i(
                        "netSlow",
                        `${e > 30 ? "dns超过30" : "dns正常"}--${e}--${
                          u > 120 ? "tcp超过120" : "tcp正常"
                        }--${u}--首字节--${d}--网络状态--${a}--运营商--${n}`
                      );
                    })
                    .catch((e) => {
                      console.log("获取网络状态异常", e);
                    })
                : i(
                    "netSlow",
                    `${e > 30 ? "dns超过30" : "dns正常"}--${e}--${
                      u > 120 ? "tcp超过120" : "tcp正常"
                    }--${u}--首字节--${d}--端外请求`
                  ));
          }
        } catch (e) {
          console.log("慢异常数据发送失败", e);
        }
      }
      function l() {
        window.skynetTime && (window.skynetTime.vueEnterTime = Date.now());
      }
      function s(e = !0) {
        try {
          var t, a;
          if (
            window.skynetTime &&
            null !== (t = window) &&
            void 0 !== t &&
            null !== (a = t.__SKYNET) &&
            void 0 !== a &&
            a.fire
          ) {
            window.skynetTime.mainRequestFinally = Date.now();
            let t =
                window.skynetTime.vueEnterTime -
                window.skynetTime.pageEnterTime,
              a = e
                ? window.skynetTime.mainRequestFinally -
                  window.skynetTime.vueEnterTime
                : 0;
            console.log(
              "window.__SKYNET.fire",
              { p1: t, p2: a },
              window.skynetTime
            ),
              window.__SKYNET.fire("userProfile", { p1: t, p2: a });
          }
          r();
        } catch (n) {
          console.log("fireP1P2", n);
        }
      }
    },
    42642: function (e, t, a) {
      "use strict";
      var n = a(23692);
      let o = n;
      t.Z = o.default;
    },
    23692: function (e, t, a) {
      "use strict";
      a.r(t),
        a.d(t, {
          gdpInit: function () {
            return y;
          },
          gdpTrace: function () {
            return g;
          },
          getPlat: function () {
            return T;
          },
          gsmStateMap: function () {
            return m;
          },
          setGdpGeneralProps: function () {
            return A;
          },
        });
      a(26699);
      var n = a(55844),
        o = a(72856),
        i = a(26090),
        r = a(76507),
        l = a(15222);
      let s = !1,
        c = [],
        u = {},
        d = {};
      const m = {
        0: "全球通普卡",
        1: "全球通银卡",
        2: "全球通金卡",
        3: "全球通白金卡",
        4: "全球通钻石卡（非终身全球通用户）",
        5: "终身全球通用户",
        6: "全球通体验用户",
        7: "其他非全球通用户",
        8: "全球通卓越钻卡",
      };
      function p() {
        try {
          return window.performance.getEntriesByType("navigation")[0]
            .loadEventEnd;
        } catch (e) {
          return console.log("getLoadEventEnd error", e), 0;
        }
      }
      let h = p();
      if (h > 0) {
        try {
          window.gdp("setGeneralProps", { WT_ed: h });
        } catch (S) {
          console.error(S);
        }
        s = !0;
      } else {
        let e = new Promise((e, t) => {
          window.addEventListener("pageshow", () => {
            let t = p();
            e(t);
          });
        });
        Promise.race([(0, r.GR)(5e3), e])
          .then((e) => {
            console.log("Nanotube setGeneralProps", e);
            try {
              window.gdp("setGeneralProps", { WT_ed: e });
            } catch (S) {
              console.error(S);
            }
          })
          .catch((e) => {
            console.log("获取ed超时", e);
          })
          .finally(() => {
            (s = !0),
              c.forEach((e) => {
                e();
              });
          });
      }
      function f(e) {
        s ? e() : c.push(e);
      }
      function g(e, t) {
        f(() => {
          try {
            window.gdp("track", e, { WT_et: e, ...t });
          } catch (S) {
            console.error(S);
          }
        });
      }
      function v() {
        try {
          let e = o["default"].getters.pageGroup,
            t = o["default"].getters.pageName;
          return i.Pc[e][t];
        } catch (S) {
          return console.log("未获取到scheme_id"), "";
        }
      }
      function A(e) {
        try {
          const {
            cid: t = "",
            clientID: a = "",
            userBrand: o = "",
            province: i = "",
            city: r = "",
            loginProvince: s = "",
            loginCity: c = "",
            osType: p = "",
            version: h = "",
            channel: f = "",
            appTokenId: A = "",
            gsmState: y = "",
          } = e;
          window.gdp("setGeneralProps", {
            WT_cid: t,
            WT_clientID: a,
            WT_userBrand: o,
            WT_loginProvince: s,
            WT_loginCity: c,
            WT_prov: i,
            WT_city: r,
            WT_av: "APP_" + p + "_" + h,
            WT_aav: h,
            WT_channel: f,
            WT_plat: T(),
            WT_es: window.location.href,
            WT_ti: document.title,
            scheme_id: v(),
            WT_channelid: (0, l.eY)("channelId") || "",
            WT_pageid: (0, l.eY)("pageId") || "",
            WT_page_type: "服务功能",
            WT_token_id: A,
            XY_brand_info: m[y] || "其他非全球通用户",
            ...u,
          }),
            "99999999999" !== e.phoneNumber &&
              (window.gdp("setUserId", (0, n.NG)(e.phoneNumber)),
              g("pageview", {
                WT_et: "pageview",
                WT_event: "H5PageShow",
                ...d,
              }));
        } catch (S) {
          console.error(S);
        }
      }
      function y(e = {}, t = {}) {
        try {
          let a = !1;
          window.gdp("init", "9e4e5fa7244c6b6e", "b95440ef47ec01fc", {
            host: "jiguang.coc.10086.cn",
            compress: "prod" === serverEnv,
            scheme: "https",
            requestTimeout: 3e3,
            hashtag: !0,
          }),
            a && (window._gr_ignore_local_rule = !0),
            (u = e),
            (d = t),
            A(o["default"].state.userInfo);
        } catch (S) {
          console.error(S);
        }
      }
      function T() {
        const e = navigator.userAgent ? navigator.userAgent.toLowerCase() : "";
        let t = "10086";
        return (
          e.includes("leadeon")
            ? (t = "30011")
            : e.includes("micromessenger")
            ? ((t = "10001"), e.includes("miniprogram") && (t = "10005"))
            : e.includes("alipay") &&
              ((t = "10003"), e.includes("miniprogram") && (t = "10009")),
          t
        );
      }
      t["default"] = g;
    },
    42094: function (e, t, a) {
      "use strict";
      a.d(t, {
        L: function () {
          return m;
        },
        k: function () {
          return p;
        },
      });
      var n = a(10936),
        o = a.n(n),
        i = a(10311),
        r = a.n(i);
      const l = [];
      window.$scrollObserverList = l;
      const s = window.innerHeight || document.documentElement.clientHeight,
        c = window.innerWidth || document.documentElement.clientWidth;
      function u(e) {
        try {
          const t = e.getBoundingClientRect(),
            a = t.top <= s && t.top + t.height > 0,
            n = t.left <= c && t.left + t.width > 0;
          return a && n;
        } catch (t) {
          console.log("computeVisible", e, t);
        }
      }
      function d(e) {
        try {
          if (!e._hasExposureComplete) {
            let t = "function" === typeof e.element ? e.element() : e.element;
            if (t && t instanceof Element) {
              let a = u(t),
                n = e.handler(a);
              e._hasExposureComplete = n;
            }
          }
        } catch (t) {
          console.log("visibleExposure checkElementVisible error", t);
        }
      }
      function m(e) {
        return (
          d(e),
          l.push(e),
          () => {
            d(e);
          }
        );
      }
      function p() {
        console.log("checkAllVisibleObserver"),
          r().nextTick(() => {
            l.forEach((e) => {
              d(e);
            });
          });
      }
      window.addEventListener(
        "scroll",
        o()(() => {
          l.forEach((e) => {
            d(e);
          });
        }, 500),
        { leading: !1 }
      );
    },
    73729: function () {
      console = window.originConsole;
    },
    25012: function (e, t, a) {
      "use strict";
      var n = a(15222);
      (0, n.ke)("__debug__") &&
        (0, n.Vp)("/cmcc-service/js/vconsole.min.js").then(() => {
          new window.VConsole();
        });
    },
    16549: function () {},
    96829: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAaCAMAAACEqFxyAAAAkFBMVEUAAAA3vDctti03vDc2vzY2vDY3vDc2vDYzuzM3vDc3vDc6wDostCw2vDY2vDY2vDY2uzYztjMfwR82vTY3vDc2vDY3vDc2vTY2vTY1vTU1vDU2vDY3vDc2vDY1vDU2vDY3vDc1tzUuui43uzc2vDY2vDY2uzY2vDY4ujg1ujU2vDY2vDY4vTg3vjc0uzQ3vDeknd8uAAAAL3RSTlMA8A3tHM/z+iL3VD0F/Obi1RII3cjBnJVqTDfqtHx1ckYXC6eNgWdiYCi3r4RPMcGbuAMAAADYSURBVCjPzcxXksMgEEXRRggBNgKUc3QaT9L+dzftYqxyKP/7fp6u14Cp2PPHrjX681AJL1YKbRLbIWc0oI0OQ84Du+sqMUGqaWLTthiqmizY5UYZLPKrHMVl5yFfg4VuAHsrjugtk27rGlPmMiHyIgOXPnuuI0FeIz64Pl4zf+YT4WCeuQ8S2PNHjlq5h9o+cHwytob5SO5YVSkpZ9wU8obnn4zkE2AiJyuLgZHdGRHz+8RxVGa0+RbwX7TJ8JEsMiNt6cOaEn3CQ8mb4jd2sh4OTOf1Ff8AzzAtz/7zJNgAAAAASUVORK5CYII=";
    },
    32957: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAANlBMVEUAAAC8vLy7u7u3t7e7u7u6urq8vLy7u7u8vLy6urq6urq5ubm8vLyxsbG8vLy9vb27u7u7u7taVnLIAAAAEXRSTlMA6eMekj7Yx8KxZFRIDYk+ijHPn80AAACeSURBVCjPfdPbDoQgDEXRw00FAd3//7OTGSfEKOl6pAkp7UFD6psDt/Wkp31hWHbdhRV8rEEKNXpYg4bk8EVD8bg0apCbblqGfzU4oh4i7rp5Jesls/76xDe9NM+354WiicIiHXhNeZJOoqYiXRtVU5VNjqCpgBNIc2AWzWvthrrxFHMI1vjMwVsrM5dtxsQOmB1NO9TDcV7f4TzG0QfcCglzqnHnIwAAAABJRU5ErkJggg==";
    },
    27693: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAZlBMVEUAAAAokv8mkf8okv8nkv8nkf8nk/8okv8okv8nkv/5/f/W6f////8okv/////q9P9Jo//0+f/w+P9aq/9Sp/8+nf/s9f/3+//k8f9frv9Npf9Fof9/vv9nsv9Xqv/b7P/E4f8yl/+VRAzMAAAADXRSTlMA6T75wokh2MdU2MdUl66D/wAAAMZJREFUKM9909kOgyAQheEZFtG2B7vZ3S7v/5KFUCEo5b8jX0IUBooJrVhKVlrQvM4gZrqMmhZZbZNMMGaxiCaxSP60YRTisHOLUsPaW1e2i904NCW7X6xdEYl/dh4F6ZL1zq7QpJa2DQZFDNfn/TpktnMGJgnX6JaT3k7TQgYc+qhHb08E5LTVwdve2n0wsP+gpMGOCCn/K0kf0XyaBJL6TjdMCSKTNDcTDj5pv0Wsy69seAzJ2upl18akPmD10awPdfU5fAEzsyBJrg/D/QAAAABJRU5ErkJggg==";
    },
    52238: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAMAAAC5zwKfAAAAOVBMVEX///8AAAD///////////////////////////////////////////////////////////////////9ESdXCAAAAEnRSTlNSAPFxRgVMQS4iGAqgYEg6FTLui6rDAAABz0lEQVRYw83ZWXKDMBAE0HY8ow0bCe5/2MhZLDtsA/RH+tMUr4oyoFGDy3q0xJC9OMCJzyEW3TgBa1gKHpP4kPQQWAaHhbih7AajYDUS94Aae2ymj2oFk8AUSSawyzAnd9tgctgRl7bAgJ0Jq6B67I7XZbATHIh0S2DX41D6VxE2zy42UAWHIzoDepyIn4IBpxL+ggknk97Bzp0FXfcGZpxOfgUTCEkNVGGAok8wgpL4BHsO2P+CEaTEH1Awl/vtdgew55h8g2X+nI9x/LjOe9fHsTmxfIED5nIbxyZOvJobphkeoLplsIqz3hLotIIJC5fcxKm3cMlIFQyYz7WJWz+3hAp6bIl2D/4CBTZFswcoCgyi2atchEW0epULMIlGr3IZNtHmVc7DKJq8ygmMosmDwMEomrzGbYjNo6SKds9xQQfhXrLAc/8Uj8y9bTIC98YOiNxHL6JwXw4Fyn19KS6e+YL1bZHiLAGhgom5SKW20FOWUadtFKEs9EMbljijSGnjHGVYkjZwcsa52EZiysDZ04d2+raCvfFhb83om0f29pa9AWdXBPQSg12zsIsgdlXFLtPIdR+7kGRXpuRSl107c4txcnX/Hz4uHPz88Qk6diYRSM6IkgAAAABJRU5ErkJggg==";
    },
    94408: function (e, t, a) {
      "use strict";
      e.exports = a.p + "img/dataError.b1be18b3.png";
    },
    8930: function (e, t, a) {
      "use strict";
      e.exports = a.p + "img/dataErrorCare.1a4ffdd2.jpg";
    },
    64156: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAAAyCAMAAABVq6YfAAADAFBMVEUAAAB0Tk0Bb7FZUVpZV1daWFgAbblaWFhZV1cAeL9ZV1daWFhZV1dWVFRaWFhZWFiXl5dZV1daWFhaWFhZV1daV1daWFhaWFhaWFhZV1dbWVlaWFhZV1f0SIH+fUZaWFhZV1cAbLdeSGJZV1f+iEb/bDkAltYAi8xdW1taWFj9xAf2S33+f0ZYVlYAWKkAV6cAY7FZV1f6aGMAX61ZV1f9xAb4XW7+iEj9wgn/ZzjvOo//aDcAWKv9vwz9wQr5Y2fwOY5ZV1daWVn4g0ReXFz8wgn/ajgAr+n9wQoAWKkAV6j2UncAVqgAYK/+ny7+hEf/ZzfwO4wAXaz+fUdZWFgAeML8sxr7d1f6elT/dz7/dj0Acrv3XG7/cTsAfsX9wQoAYa/9hEv8uRP6ZGj/eT//Zzf9wgn5Y2f2S33/bzr+lDn/f0TzS3sAmNoAod/9pij+mTUAWKn+oSwAgcj4V3P/aDiRJLz7c1nHL6P/azgAic79hkoAb7v9rSD9xAfKL6L9fkz/aDjxO4wAdL8AdcAAkdT9ljkAcLv6cVz9rCH/cz3+gkb8iUf/cDsAmNnNLqGsKrAAbrr/gEAAj9AAkNAAZ7j+tRcAabb9uxD9txX+j0H2UXj5vBLWMZ8Ag8oAkdQAfccAhsz9mDf+sBz9sxrvPYwAbbgAaLXbMpwAhMr8wQnGLqMAltcAic6sKa6QM7X7ky/9qyL9gEz9jkIAjdHvOY+iKLMAntz9wQr7jisAW60AdcAApeL+vA/9pSkAfcUAmtv6eVaKI78AZ7X+pyf+mzIAg8n6iUaHJMKRJLwAr+n+kj0AY7L6dlkAqub9pycAjtH7qyKtKa6HI8AAmtsAecMAouAAic6xKq39jUT4XG8ApeMAXa76d1gAecMAWqoAoN3nNJbgOZYAabf+mjMAY7EAmtr8nDOHI8CdJrcAitAAic78sB0AWar1pSwAm9sAfsYAdsAAjtEAesMAcr0Aod8AgskAXq8Al9gAZrQAic8AhMoAqOQAh8wAktUAtey8inQWAAAA73RSTlMABAQHluX+0RsJY+zBD96KQRXzyVpKIth8a/yroGtjUjQfC7p5ZBcP94KCY1M6WD0YdGkos3pwn5NbQzwQtqJQT0EoCf5rU/6cempXMaWlb2tdS0cumYaDbm1aVkExLqyakY98dnRzXksmiIAk4Leuno2NjISEfHhKReS7ubeLd1xNOPbkvq+pkZGQiIR8ZWBWPTk3JfDaysCvrHhEM/j09Na5pJqGeGhoYmFWSEI8GBLLq5OSc2dUVB3x7dvKv7KjnpOJgHZyYVlL78q9squad3RxavPPzbWDZzL0z8jHwotsFODIsIBROyj1p2G2a+LLhkQAABMfSURBVGje5Jd7TFpnGMa5HAQBYVwVBcQLAwO2ogYjmIDOsFjbCcXGGxgba8RKlzkRsZp4q+uy6bR2jcmMzi7R2rjq5qbNtElXzVqd2iy6rq7X2K5L26VRxFLF2u0DQbtudNLtH7NHYoDzkZzf9zzv+70HtjU9GB/pG+uD/T/U19QbbDSOGY0jY8jtyowIioqK8t7a2rampt4m4+DI+MiMcaavDwnbjorYc+P27aitrLxjapydnR6cNhqNM8YR48z4A9h2VPaJlSdDUVvh7W5srKxsHJxt6h0cGTGOzIxtz0rOql1aaon753Xwmu7uzsrKyp4e0yDweWxmfGxmWxJfbLdaj/7zspoBuXygs7uyss3UOz04Dkr5wf2RsRk4bBsJEQfE++3Z4mIxj8eLe6FxvfGnT3oWq7NTJZEPNLa1mRpND5qmewcHx+/fvw/71/KBvZq8ea9vKMIhBOzlCsrZk7Ov+PD8/HJdcXHx6N6NCwUFX3wTqy37YpNZx2IJVJ2dA3KJqq27p6fSNNvbNGjsHR+//yqhRtKDnyuVcCbnVXh5Zy9fftuhuqtXz5+vqKjYsxv+ku2JCPLeMfQEaMVsW55/Zlsw73DhluWVKLTcEq4is8CJrBcYOjslEsmASjKnamvrNrWZKk3TvdNNxmDkS6qejgXukRjYzftIYEIYOAePwqdu0vsl4hk0z0vj48tvPn08v7y8DAx7ZltdMC+1vAz4VMuNHaMrT+waGlpZWltbMGevX5GW5NlV0tDAZqularidt5WVzNLpaySSGhDqGkl3Y2VPY09PU+/seFPwXyNKcqFg+RCMHkAkUJ0bwPGL9udDVEIAlczc4KXycXh/NMnNfb7mth6Pn3s6/2wRkFoWVtfA/6Wl0QiYe+2zeO3NqfUCWnFge1mOOJbDtSUl3DxlQ15Dw4EDB9iFKeoCuF4nNhiSBQKdgCXXqUCqJXJJY6Mdumn2AfJFW8PxKBHS8Y6GIvvR8WEcHMN5KRVHpeEgPIpBJQe6lgfiQgJDUDSYp8DeZ68DXoezAMJssSx5dcW52xxvb++rto7srgqgYfCDu5OTjyZHHU3rG2VJSUksV8HN4GayCz9kh4ZeEorF4vxWg0CjYbF0cr1c0qaS6Gu6TaCSTdNNz7NyUmFIBpqI49vvH+OHIwRiKGQaEU1yXcfFc3CBEJPAj/ZxGQzxoWgcwPcU+PVfH6/7a16ye7bitXR3r7umtXPXqYuH5j+9eDorCs67ZbVYujbbVWwJSLNSqm3OyMzMONCcwv65fipfFmkQyzTA4uRWQU2NhCWZk88NzJl6Gk2VfRuRDqbD49F+RBQW8vUNtJMk8pk+xGgC1Zfo2hAaISwAx4AYWAJtMw8E/0Q+keQx8MdvzwPe9o6O4eETQENDJyaj3IXhHgjxisX2sN2chQg6bFtdzdrwSBqrVEqlyurYstiyjEJ1szo0NO3mhZtThlyDTJMsFgBonWBArlJ1gv7Vbequ7O1ZbxSkhIRoUTAlkS+CBWPoSHttQgQclUNkJqAoHFe5+ifiUJwALB0NkVwp54SRw/xw6EAPgRFnDi3arB3nT2UB7XBop7sHgriW4WEvME6eGD5yDJH94/Kzh8c2DM7TKrjKMmWsVMHVSoXCZmFKytRU6dSF0nz9tVyxLlmjYwlYAgGLpVLJa+Tyue62NkcjhydEpzJ9fcL8UcSN3oUlU8KplHg4h4gnOYFRkAiNCYAoOD7DtSycQExgBFL8owMxngDzPvrUZl0Y7kJs5cDuKi4+aTFXFBV1RcDOXn88fzjINWtUg+ot40pjYwu4mepmtrBKWBXTf3Pq5tT7ufkyjcygTwZqZQHp5DUS0LXn7txZZ2HwsVg0yYcYCBGRzvySQUMOo3CC4YGEBGeDQmPRKE4II55Kjnc6HE8gkiD/aFF0YqKvKHjrwEFf2+v3ShZsi6pbXM1ybM5pcG5/jXAZrJDmxQIBaoU2MyMTAMf0F4bu709jqzUysUyWny8WaK7dSQanlKAGBFvfJn9jvYBD+FQ62s8HCQ9HhdDWUQKIOD8mioIOY+JdNYxDoQgQDg1BvuueYwIJ0URfMhnlG47FE9DYrQNn14HJwXw0G4Qb4c5lcAXuCsRPjx+eQTjsBkPlRvalirwye/1WZ2qrm9lsoVAdWhhTXn4TOJxWqtGIIzXi/GS9XuOYu0CmwZ/E6TDTFwMHGYagAHIiGu5swDgahUonovwDfJyRxtNoFFoAFp/oS3NsExPsEQPNF4nsGUB6EGnE54etlqXafcePfw50/GPei9AIHnjM3xm1Oygibr3FnasLgv1FBVyuMra6WspVgERz1UJ2fXnM/vKY8v4P06vYwsh8IBng1umTda2tLJWgUy55w3WciuwOhpD9/XH4eGdaccBjCMsg4Pwp4Q5gEYGaSiGiieAbMsMximHs+0LxYVKQnjUt3sV2MGnU1l0+9/333//407c/nHn9T7gRx07tq0iaTNqza9feIIDMO/P5ccTfAANcLjiYADA3Q5ipZcfEhJYDxaSrq9IupMtk4nyNLBK4LDAIWg3gcWJAoHedp+smksLjU5HOPWCQOUwiNgAPpYpQjqOYxPSDcKgwFAXiiHAouutgIvuRKEQPj6WgfSDQ1uWnvwPZJ8xPTxZnbwJ5Z1+8VbvkdbQl53bS7aJdO+LcDr+KaqU0lqtUZnAbhCDSlyYm3vvkk5jymMK0tEvp6erSyEjZNY1MlituNbTqkpNVLME195M0B0JiAHyw/W0I1t7JQzCkED6WwrHbH+LMQSo+IABCpXoInH0L8M4/fvrmOvDyoq396DFvl/1Z5zvAPLJ0Iufunts3inJy9ro7sKRleVJFgaK6IUPbrM1gVx2cOHhwYuKr+v2h9f39Fy6kV6UBYFlkpFjcCl72Xq2HbU3BGIf9MBgdovvRHaTrhe4DicCwFebhpOWdNWxeWHQC20dqMEybbzm5eKdPrlrBBGY+ktPSNZmU8yipaHecG+ACrlSqVSiVB6TqguaqlIPvfDbxGbC4/lLK/lChurRUWCrLj4zMlxlycyMFYvu46fFTDhzmg3z+I8g6hhbsIXBEV61l1QH85tPltQWLxbIAECscHnufPbm2arWuAuja0Rs3iu4lJe3ctcONx99opWDG+qCsrDkzQ61+68t3v/vlvc/eq7fHGrSvlHSgSFlpfq44F7wEBlayHvbfyEPgqKNmy5od+PqhKy0tV450LFhXbTbreVDHiDN17QDftvjjuUN1p+91jT5KStoNxjCEG+A/yjUXmDSvKI6DQEGkEEF5B0WoClHRCpFlQiJKh0ZxcQUfW0tFxzKMRXFLM1eMjdZWfCROa8GQWh+Z0bSZVpPqVq1NtU26pWrSR0yXrcm6Nlmb2Xe61rY7PLTCtIXskWU7EhLhI19+93/uuef+7/fZvpYPiwoLS+PidsTN3phqNDd82ztqbOjiF48uxvE5nPw9+QX5+SVbS7Z+UgJNSMAAfwlwUNvhe3edwOW3B9qSk9sGT1c/f3r//ovuMW7QztN1mx4+ePy0fH/rsfb2tryzmVmJmSJR5QZJvW/bp9ta9llLWzhFcbMj6imLWX3jRkVDQ9do82JzcW5cLSe/4OBW+IOJXAKdSHqgAH8JcGrCoYfOlC6f57qEC+qY77n/4sWTpfLWDs2h35zA1fNczwIlShCJRNnZG3Ta297dsm2bdYu1tKj0vRnLyJS2b8pUoe7tBebelKbi5jJ+Lki8B4hLgPmjdWr0PwGcnfPbQ1C4fD761bpcDrxLj67Mf+fcKd6tPveKLzEzNSEP3tYvKW+3WN8qtBaWcXJz+yb7+vv65kwjpil1r7mhoqtr9PPmFH5TXMHBPbVnDpZs3fqBHwLjkhR/sESi/nDbwIATvj5Ud/QIJPDa7fEl4H20vLvqMAAfrXKbH26bLxmaLm42N3hd4H3vvmst+rS0tIwzaumzC+0jlimTZc5kMoHMvd9+3tVcXMY5kw/I+QdL8t8sMOx3M7A+iywKjY7yMYQiWUmbAwAW5eQcOHBA49U7dex38i6/c1Hz06a6054u5OT162NjVVVwcU5OTva6N0jf8rbV+llpUxnH2Nk5YpfaR+wWE0CrIbNvNMx28VNqi5sKzhRzzkBeT3hriQOhQr1W30g6hcDD+7DgMAT86mXIcEI8IiqJSAwLpEoHucL7s+O7rwHvO+9cHLus8fDG7IaW5PljpwsEFkDW+oX6rQ+LTmwBhXPNnRA2S7+lz2Lpm2ucm1Or1RVGo5E/yuGf4BTn7yl4z1vMCCwrHkVH49aoF8EihDPEKJ/rmDwsa3UQFDQBXJiEFUT5D7z+IJy8ArwvX164eA543aqfWnIDb3oN8PCnRS3WwtIyfkOnbHKkc0rWZ+vva+xfMM00qs3qWWPFKJ8PS3JxXH7tsPcvQ7EZPGQak/0KLZzEELPRBOQayx3HQGOYZMqqc4tihDAYBCw5lv1ngRHt10+5Os0LN1dq2clLfgAj3rYWWcuaypqmdDbbSKfFbrfZ9foZrdYypzabzbMVxlv8lMWU3NqCL3x4BTxBGoKKoayZwCEReB6GhGekeRxoOo5KyWASw1/9iA6okWIykxaJ+JPAOzWa6QsvIaeXT7XGuD+6fg2Anz57A3B6C+hbXMxXd3bKZTa7TC6b1OoMv+r7G7UzM07iWxVGfkpuSpy3wDh8OKQuABPC8O6spirCMTQsgYRPwpIj3dvfWDoCRyKT0OGeARFgmRkUHIpEpmEEAQAnirKTRVzv5imm6pt6zcULwLu8fOWYqyIHT58qL6+urj7qBk7YyCj42MopbErhmydlOrnKppNJZVqZXq/t1y5oGxfmZmYqGhYrjKN8b4GpVJwAKi0Ak5khHsuDx07CY8V0vEDMinfzwVCgBDR8CFHhns2xGcwQEpVKZLGY6M3+A3PzRNl5yXlBXtuJerCbNbsvLC8/erS0+3iQq6tubW0dHBy87CpaX4s2XEoKazlNzblmm1xu69TpdCqZSicX6vV6AG5cMN1Rq2crZo23kF75HIbHZjg3eYoQMg/oXHrycFRBCI2VFopCuvnEoU5bgIyJZa9YIDw6gRARAXMYK97uP3BwckJ2nmjtcwtBx68+AKrDVVeuAe/Spemda8q3G/jHjc8lPo4rPZF73ggKT8p1MtWkVCdUSZV3hPL+fq22ccY8ozZXnPfZ+2LAgBWDS7M9lrRSoQjhEWQmi46JWM16MRsFVi0hichYHShGCD0eK6bxwqiBzGFuligPmFNXR+D4bXBAgOps65UlOG+CrrrDoz+y7bQ7pTM3NjiRO86f4C+O2uR2KfCqpDaVSiisqZHrtVp9PxTsOdOCesKneWIRwwiC7QpEfCx+pf5GboaSRCMQV2cnCo/FwRubwvQcrVDRNDJNgYpkYIhMGo8X5rdrGSXKys6Dl4jLjQkOjt7ZevWXxwC86XBe9Hz5kxdwAFw9dhxaq6BU7vtXj7iK1veve8ghfUcTrD2myRG9zjmP5VKpVCJVCaUyqV6l7Ru3NDb6VGiQiorDwiRG0WMjEaHIFd1pGTw8bTVXkdvFOASOxcQwKWHu/8GAp6BZxFgWKZYeTxeH+QsMEickZIkyBxIG3h9svT7tNOUf3HvQMxiDiB7rhiOY58+P/KD5cmDgS02Pe1k6lPX653Z2wEah0SaVq+wymbzGGcArd6oslwzZtXfWaaIVRAwjXkBmEghYTwFC4rEMCoYV9EqYJKjSBEZYiGJF8ggclkInkSk0MdLpi/nvWmZnZomysjJ37Tqr6ekGSQHrWbVrM9F+tdtpgNx9UFdfX19939Np5SQiXh/vNeUuymQqULdGWiMcMkgkQolQKNOppAapftyX1yNXPDGDiSHSaDR3mQ6npW1mZxAZuJUsYGMwpLAwMZa2QoZMI1CoSAWamcELRwW0DqeKEjKzKsGv2nWgHvb7EE+rb3LdDu7+bpD42bNnz++/eOJpLfdmI94UX/BzTZOyhX69UipROgwGg7LGiaySK+XAu05QaSRUUlKaArc5FBfl0o+EhhqMh3mMTkO6FWeBb00hZpBZbDab7qRGCTDxDB6GFwG+lv++tEfjzJzKXbCN2Fv38B4w91R56lTwyf2XnkA4d0/uTqtub5sfRzIfnzeqZFq9UiscGpJIlOPjQqFBYpBIh5TI9UtdmO8hLwoF6LD88oiUeM818MJFoAlEDJbNCHVVO4FiM5WKgsHgKQIBBi5RZWVlDhD/XA/ARy+f465ABR+bLgdYCAAGP7NH4w8vAjl8/ledXH9L4hg3SIRSodIwJIRJLRwfDti3w+F81MMBou9eGBUVYGuZmpdQCRL//N3e+vofNO/HrFG/o3X61JIbuLvn9mAiwr9IH76lkzqAdkgJEgslNYZxicSRjvgn46vXPoWUnJ2XMAAnpm3JqUHeX0W3n4TqPX2z9djO6ABul6503HHm8ZBEqYRJrJTA9P03BTI4MTEZjo+C1xmNmOiO9vaOaJfwgSAPORwGkHgcJFYqHf8u3r8nkBMOg3JI6HA4JoYR/5MYHp6Y+C9q+zulWiFipGjlNwAAAABJRU5ErkJggg==";
    },
    59147: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUQAAAD+CAMAAAB1EoxTAAABTVBMVEUAAAD7+/32+P3Czu/y9v/Q3v/u9v/m7P/w9v/w9v/q8f/k7fzj6vvv+P7q8v/l7/7r8/7x9//p8v/z+P+kuvDv9f/y9//m8f/0+f/j7//i7v/k7//r8f/i7v/o8v/q8//3+//w9v/h7f/n8P/i7v/m8P/0+P/1+f/o8v/d7f/j7f/2+f/k7//w9f+60fqxzf3D0/a91P2yzPz///+Crv64z/l+rf+ArP660Pt7o/rE1vrd7P/////m7//t9P/x9/+hxf/p8f/z+P+tzf+Yv//i7f+lx/+nyP+71f/D2v+cwv/I3f+FtP+40/+Kt/+xz/+TvP/S4//X5v/c6f+00f+/1//M3/96rf+pyv9xqP92q/9rpP9kn/9/sP9vpv+Bsf9oov+Puf9gnf/O4f9emv/J1f/3+//R3P/W4P/d5v+yy//j6f/a4v/N2f/s8P/2zM+UAAAAO3RSTlMAUE9Ad5w1+PVIQiMWBWMrDevr1T/Op8mcdNm5EeJ/Vty4pY/tnZFmHfyWv6yErvJk+Nzv65aIzXle27UtCOkAABHISURBVHja7JtdaxNBFIbXr4AfQW8EQS+KF3ohNralIPbNptvNbrJN6+bbIIgUIf//J9gTtUczO9PJuAuzy3lAvH94z5yPdANBEARBEARBEARBEARBEARBEARBEARBEARBEARBEARBEATBd1pvnh/hmnXYTXZk9hdTZvKHH9csfzG6IWMWxPA3Bwef9j8+CmpI++0emLMdNZocEtYOicsNB/sf2kG9aG0UJtl8MM9CXBNZCzwhhcyuOVxkC9UhMZ8fHD8JasRbquLL7183fDnvAgjdilmXQ30QF8US50R+/CyoC/cBTC++3PBtaW/RJYfscMEOWSE7zPPOh6AeUA6H3/4hA9C1qWWn95AVci3/hhWSQ2K/FmFsAVh8/5eLKQD3IJodqrXMClWJ8eHjwHvae8DkYpurHhCWN9sQak+xchjHnaeB79wHwqvPCvntUTxx6ykZo+0p7JDIfbf46gjIPxcQAaHDfEjYzYeLzJxDlhh3PK/o90D3qojbonjitqiwQguH8R8OXwUe0z4C4nEhIRA59hTzkG1fy8x+4DF3gKi/Ydzf+n8EnO1ezBOmeMbmUrZ3uFqtfJ4X3wGjfjEpAMtlz3lf1jok/nY46Pi7Aj4DkJ5r6AJd91ouNYeDwcDfgr4DJKc6lob+PHOvZWJ3h4OVtx36BTBKdcyBtcOQ7ZZDQuOQJPocxT0gH2hZAyU7JG5dmIlth4Snr+Ir4Gylhx9Ft2XP/T1kbhym6cfASx4BSaxnAkS6GVuV6DwfGoPIDtPDwEvuA5NcTwaEjkdY9/dQVUikhJ/1/ALI5nqGQK/kOzZLtHbIEv0cuN8Bw0sDwNrhkL38oc8hF7NFX465ljccBz6yh/XQRM8ssfz5UO3L7PD01M9HEegZJUaAwaHjfKhKtHFIEjuBhzwBosxEAljVsjmHzH84PL0mDTzkMZBkJmZAmX3ZYdnjHBI+tucWMBuZYImqQ9cDov18qEr0cX1+CMyWJmaAWw4df5QyOSTuBf5BEmke0f0jid2iA+LU4j20z6EaQ/VB9FfiXWA2MUESbfsyoTi0mw/n+oW5HhKnJhKWWOYhW80hoenL5NBniXdsJLo5tD/c5OaeQgq9l2iEbmFODu0XZlaoHhC3HZ77KPEh8PqBiZdA19Zh+YcbxaGXEp+1Wu3botp1OcK6L8xqT2GFfkpkjBLdZ2xuzPYOBxqH9ZZocfwqaT5UF2Z2WG+JZofutUzY13K9JSYmhbMeSiacxHqH/SZKjFABYawr5n4TJG47TFAJkc5hAySqsw0qYlHssAlJVB9EVMS0OIcNSCIrrFxiUtRTmpBEJYdVStx2SBIbkMSi+XCKipgW1HL9y1mzL6MihgU9pd5JNOwpVY04qdpTmiRx6/hV0bCt1nL9JRoOiBWsfcu0uJaJcW0lFtXyxOlrM9MR1rAws8NmSSw8ZNt/bWZ//KIgNkmicoQt/lHK6g9uGFaoSFRyWH+Jlj+oOH1doeZQfRDHjZJo/vq21FruM+MGSCz1iz37nsI5bJTE3b5Qsc2hpqlwDpsg8Sd5Z7PjNAwE4IgDEhdOSIhdFSR+JBbxBjHZbtM0DW1Jm7QlsPxVlfL+j0BmN+0gbGfGbpHs8MFxdw+fxp6xPXbOdGMP4OdlLLKXPZC4QuxvqNAHzPqc0iuJxAGz6W0zqsbuk0SiPuTflJLrQ4Afh7udrxItOrLp7jnaIYZhvySeenM0NhjLwzhfwN9Y5+nk48FhDyQSHdmGOUUfh2lWJDfRhyQ8Uu6z9XC564HEUztuYlaRvSiu6ygJFRRZuvRdon0DIj8vV6uRQIMyxcbNG5IsiXR9aH9DBR3GpaijkODyYeAdINF0PkSJJjV2WgpxEzK4dP3dMI3Eve18yN/8mglxHfK4euXFg4qSRNWEeM6xHEei/hCyGfj19DFI7BrLq0hQXBd5TozlTIhRaMLV88AjQGJHHCaCw/Wiu7YphYhCQy5dvG9KSFQ7LAWPqCsQJ3BXJjTmwsULp1qJK/1grgWTTB+HaQQOLRh4k6VBojanbAWX8uCw+jungMMktOK1Lxb/kIgKj1lFcPmAcQigw8kNxKElg7eBF6BEebFnIDHR1TYJVNjWXDj9RqokUXJoOJw1DleYl624DHyglThTL/b4iUUey8BUiDo8iWeBB4BEfaNDIXjcqG/sVTUmFUuufNiPQInK9XIiOEQ51odGE2JZFCU1LXrwzRaQ2LVxs48498wkh6zBXM7yOM4zQqMHC0CQKDkEDG+BV7LD4TUxmLP4jmm3xdfur1waiXvF0yItPIeWm1+ruGUbdvIycB2UyG504DZ+1ZxABKZEbnE+FFHimQ9U6F3Y6eHX12E3bwLHAYlEIFoejo6o8mZRteRUmeP66g8kWjz5RQ/mBVlnL9KW3PeK+yAxQ87TTUwfS/ElXgRu00jckt824ztEhBAhU2IcUji+bAGJXR3ZU8uO7KkQIxOJXhfcIJFIzFYNNwW9fbOYtNASnwZOAxKJw1Hi6Tl15xdjP3vNl3jl9kE0SMQ4tHomaKJwmMKUyJdI8ihwGZTIy8vMrnYscFgSPZ8UQSIRhzYd2ZymkfWwpQobfF4/g0S7BXOqvxmAeYUp0fPM0kicYSCeZSwDnPP63EDi68BlQCJdH/KfTbu3OMbkzJJI43R6Bomn3gIfylelRiYS05DG6c4ckNg9H+ZyHNI36WuWxPYXOBKd3lMEiebPmZI3R6FMpMjhh7kSne4oAYldDmc3tdAR7VPlWB7zJMa9kogOJYkl1VKnGMs4nJkSJyGN0/uyIFFfZK8EwY3mxt41R+K4Zbg/Ag+UhSqcbsoBifr5sBYUU/WNPehJZEv8+HEINNNrmlZVnKk0On2Er5CIFjNBUhzqQxzLAOxr0xKXy3uHKLGxGMebUGIQuAxI1G7czARJon7SYc9Y9lVLlAgOjxLjvWfdYSBR45AvUb59u2FsQKQgEfgrElWh+C5wmUZiprx9CwUidzjLLy3FjK2w4VIznOOpZ+d9IFF/GMBILOonvziFYqySWN1FomcnVSBRv1DZkyWO7jkCxjZOpp0Tt35t4qBE2SFAFdupKg6BGSOzTDTDWW4Tex84DUpUL5izD7Ve4Vb/1FLFmBTLeKmqEzdynfg4cBqQaND5NcGObOJZDHLNAhTZJpsd2QL7MpS4cnojDCUS3zYzevILx7Mlno3mVqJVw40yLx+h+0j4vAjcBiQyHFZKh7jWUzxxUxL5mc/A6YVzK5F8WiTlPz2HL9x0pJa+3WUBiUQnrNVTSw1Eqchm4PQhFfAAJMq1DT8O1WMZgKXffxGIIHHDfr6PH4fAp4J3OdL/20Ag0eR2hf6tdsnhp3F9jgTtwZsaIJEubuj6UHbYQG+I+d6FgxLP8VQ7clAIJCfnloHThyuSRPJD1vJaD/4pHKLFpdQJ0cdLpncSNWPZorZBhS2pEHW/M/NBomlHNsahfj5smS9MpkXPTgX+lDil4xCg1ikoERV+ms83QkR9TiooUeXQvrZB5g322zmX7leIKJHz8VuEqm12qBCwj8WXvjhEiWabX5w4nB9YW82LrwJvAImnPO9MOgQmI1Enhq8zOX4ioJMojWUqLwNdYxkx3ly8cLqVTiXR+HtIAD2WkZ8/f05rgyF99c753S9ZIt+hfiNbzsvosOH7jr+n89SLZQohsas+BIukw7nssGGYsJ5EvfBpNkSJZt+UAozj8I7Pw5LUeOH6oZRG4qJjA3H4VyCOm/+6nEI6bNhtoo7Xyot4/iTwEJAozYeGm198h8B4Wo4iOR7LWbz7cXvrv0S6xib2HEiHwNevn8fxZl+USZI08srVNsuHn77eNvRAYkdeJhd7qFDnECW2fLnnxz23/ZBo9T2kHd+hrBBAhcAvzyWSDjEQ6fmQ77B3Ev9tTkGJgNqh3xIrxkb2v49DvyVWxELFbsH8/R52HHoscc1pdMBA/Hdx6LnEqoHZxMl0qJeIFhUOv3krsVXI6yY+3eGXDodeS2wdtqBBa4d0GKocei3xd3vn9pQ2EMVhxmEoiTQgDBelgkhBh+pbp53ObKDEotiiFdtBwNbe7b3//2NzMPYQct2DuKHDF40KL843v5M92V0jOrQvZpJDwNd9CjByONcSnYbl2dYyYHI41xJvZGEP8Z9DdDj3El96NDfecw7+m5uhw5gCDv8DiR6TX/QcWoN4MbCL4fxL3Hd0uHf0w47+j/5UHNgAv0UtbEPQ9yiCRNcb5iPtix2/Db5O8G2MX2N8/8dPO5rj/EHqI1KBfhaJIXHf5XrYZmjRxSYKddOKoFwzd2xZexIKMijRYafDC8ZOjoXTCQUZkOg6b/OJsQ/HwpkXiTb9IXg8ZexYPA9DQUaXuOe646bFWEc8j0NBBiS6TiA2mdYRz1xIdL7Xu2T1jngehYIMSHS713vOWKuj824EfIfn61dm+f68SHzptii1x9jpO/EEXuJri0PkpM3Y4VvxBL7ZbrstSnX1pL4VT2DnJWJxubiVYeyF2wSiytjTM/GEgsTd7cjSVqGaeZBaaYzQGOu6LTAzxo7PhBOIXjsRl5RCrpRa0RpmQGLLZYH5gLHGmXgeFhQ5ngiJ4V6kGK6WUlFdVsMBxi5d/lLqUA/qUDx9FUim8+XVYuTWZhdjEWU3k45qV4BCZ4lsz3ZcHtFi7GgonrY6TjK7s6tEYqHZsbwUzl3bQ4fOXDLWc6jlq8cgngyuGQ5HZx38GZj9+y3VArisrErLN127MuozOXTVqMFDEJ2e6HDEmDYcCKejOnNHVynfSIUnpHBmQ3MEFLrWM9YySjSquTcQT1/1Yn1nVU5MU79KLqUBvAqxnruWIOJD055diKen+iJdUSjVvb2VWdG8gFrW3KN4gEGcfHzfhXjOVP/c31S2efpmuYoJJEURr4qvbBeY4eFAr8/F01f5WCvLd30ZlDJRnwJRoUsU26YcYhC1wbl4XqncJDclL4/xKhYxSaO14T6wOtzX5b48N3jvwC28/0zloKUfRmGX4y4KpQcaQnNoLejGvuEQqTOmnr8Xz6kKUETmJQeFclrjdQgWPUdobW9CIjwduvNGPE/59BkCDY1Z2a4hzGi8eDusj7LIes/HBxVw+PyNeN6qvIBI9LiZsPSEKY0XVOhpUes9PTF4XYfG5414LrqkII5pXJvoHWMbmjYji1DSOo3T3mH7sAsD9uXJR/Gcd3kUWpMIn+vmqYocUaF/jUhv8FE8HexuiEkEaiaJKxSJmh+D9SuN2pVH7Vt/+Fk4758dqggxiXC+P6XEhg+HIPDfCc5w3AjNepOOikyZRLPE3MwuiWgPvqMJsx6jE1kiapwyiTWOgYXmEOsZTZIcWmgaUbT1S3BITeJ6bMoWh6+a4QvZoVWU8ToRgkCbJEKLw9Fsky0a6jCF8AUPv7VsFzZiDjGI0ydxM0G97UOFvhwaSTSEEmu5aWMW1FJREfo1MStzTEAQgoiY6tkSRGISwalTFAkOSUnMS7SpMGuHo/kyiIGkJtE6MJOGZ3o9t1AlToURJmWpOcTRuU5ucKxaDYGkSyJATyJOynp69LM84C3QPK40JuqZw6LdAadbCWILPniWB5BlXKiij81woEVqDs0e8TJpTeLUwwppoYq+ZOq7v8ETJYiGHcTU48wgiIQlU/LifYPj3hlP9BziceWOnkTV3iJ98Z6+jQQU8t6xUKrZ4hEw/JGSqDrVM30bCX1Dk//bZrx3pvc3Jqsq6uPOobNC+oYm+ta6hj8wifWbqWfz3IMFejXTt9ZNv8nT85YPLQL8N85mj3VTFRNyaKsQNnnWODd5zmS7set8InrkoWkZnzGKVnH+PE66q8B248A8e9u08d3aLFqiyFHOmDYUSEsiRDG5VtqpFRQpsh3sf+Mw+hOMcDlX0o1GUSYnqM38A7jjEhdNrmXzlXJYKcrxgP8XXceIxuIRqaiEd6u5jG51YyVKmpMFDJ1eytbT2fxOpVxYVYpSJB4LduDIJGLL8YgsLRWVrXBht1zN5TKZUqmUzaZTqdRGUmcFiALgLgrAK0lgYz2VTmezpVI+k8lVauXd8OqWUlyS5Eh8ORaYy9uCBQsWLFiwQCR/AcOtAl+GkmxmAAAAAElFTkSuQmCC";
    },
    50245: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAAJ1JREFUKFON0TEOAUEYxfHfFlS0HMAR1EqX0EmUGoVKL1FTEpVLqLWcgAPQUtHYSWaTzWZ3mWSaeV/+8977EswwUn2SGu0QxHCXGNYMlklHLDJ6Axv0/4ScMU0Bn7y9Fnbo/YBcMcErzBXzdbBHtwJyxxiPTC8rKDjYol2APOPPt/x7VcOhi3VabjMOv2PmS9FZ3YoGmMeYK5zKYn0B7qEUe65GOPwAAAAASUVORK5CYII=";
    },
    66737: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWBAMAAAA2mnEIAAAAAXNSR0IArs4c6QAAAA9QTFRFMzMzXl5eZ2dncHBwo6Ojg7aBFwAAAEZJREFUGNNjYCAGMCqAKSYBEOEMZpuAhUwMgAQzRARMgQUgNFQYLAETBkoYO8ONZXYxwMpGUoOsF8lMZLuQ3IDsNmQ3EwYAuSoJK51GmVEAAAAASUVORK5CYII=";
    },
    63558: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAICAYAAADwdn+XAAAAAXNSR0IArs4c6QAAAJ1JREFUKFON0TEOAUEYxfHfFlS0HMAR1EqX0EmUGoVKL1FTEpVLqLWcgAPQUtHYSWaTzWZ3mWSaeV/+8977EswwUn2SGu0QxHCXGNYMlklHLDJ6Axv0/4ScMU0Bn7y9Fnbo/YBcMcErzBXzdbBHtwJyxxiPTC8rKDjYol2APOPPt/x7VcOhi3VabjMOv2PmS9FZ3YoGmMeYK5zKYn0B7qEUe65GOPwAAAAASUVORK5CYII=";
    },
    29204: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAUVBMVEUAAAAyMjIyMjIzMzMyMjIzMzMxMTEyMjI0NDQqKiozMzMzMzMzMzMzMzMyMjIyMjIyMjIzMzMzMzMxMTEyMjIyMjIxMTE0NDQyMjI1NTUzMzPo3xteAAAAGnRSTlMA85D629CFIREJ9+bgw7uxp3ltYldNRDszGANwGRYAAACESURBVCjP5c1ZEoMwDANQOwTCvq+6/0GrDG1DgV6g1Zc0zzOWH81q7frNFgV0ubeZRp3vbMqBogDy6WpjBJTOlUA0nm2gWSfiLHX4tB5AvPm2xaz90Tpv6d5Tr12whLOiPbXiTF7LcNRZuM1qACZYQzto81YFWjmlBXT/qEYuMZrI3+QBVw8INZyhtZQAAAAASUVORK5CYII=";
    },
    94206: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAAVFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////8wXzyWAAAAHHRSTlMAsqzmmk42KGxRExGggEsZxaQgZ11cRkQ7LyMeLWr1igAAAMFJREFUKM99UtkOwyAMIzGl9ADWdvf+/z/XAwukac0LTgKOMZgcfQyj6hhib+oYvIiotboufih1p2K7tKHUWVHHeiPalF2NSs6cTO0O2rxM4nZ+1aPgAHd0VLc5nidvwJXcftUpNpN3QJehld5EYfYA7twj0QRJFA08M0wSzKjU2QIvYh2NWiYf4E1stWoMQF8aFZXx3hQqDmeU4ZTLoNzqgvPlMpcLVpYswFIsoYk8QROL7QzafvZQv097+hn+fp8vg0UGb3leDWEAAAAASUVORK5CYII=";
    },
    91397: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAMAAACelLz8AAAARVBMVEUAAACYmJiZmZmZmZmZmZmZmZmWlpabm5uYmJiZmZmYmJiZmZmXl5eXl5eAgICXl5eYmJiZmZmZmZmZmZmZmZmZmZmZmZn+QkUyAAAAFnRSTlMAM/jlvIMRLCO+npNRDQQZ7jntp3BrqGdZ8gAAAMRJREFUKM99kukOwkAIhCl79rKH+r3/oxq1GBqb5dcuwxAYRixK6oNq6FORc3SRX8TOAbcR1mGq81ynYYXxZkiOaMq/X1JiPjiR0J26B+KXNxIWOcUSGD81qHG2zXjKOxdJR6JCPZ6JKFLYs9WC8fNOkcQg/5AMJOmZrqCJXgL1CqoEUeYraEY9VKA4yDeU51NcQz+GLIu4Mfzwm+rmhy+stvIDHrbySvFC5fs9e6G8vCJO3sZRGqdsGsBss59t0zZbw6IvwlAM5QOXBlMAAAAASUVORK5CYII=";
    },
    59682: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYBAMAAAASWSDLAAAAGFBMVEUAAAAOVcYMXcULWsULXccMXMUNXMUMXcWZr+MlAAAAB3RSTlMAEs5dRPbFqkOdFQAAAClJREFUGNNjIAG4CSDYLOGKCA5zeRGSlHk5VaUQHIQyyiUQXkB4jhQAAL6zDl96QCuWAAAAAElFTkSuQmCC";
    },
    69366: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAMAAAC6V+0/AAAAP1BMVEUAAAAMXsUKXMQMXcUIWsMMXcUNXcYLXMcLXsYAV7wNXcUMXcYMXcYMXcYLXcUNXcQMXMQMXcUNXrwATbMMXcVeJB+WAAAAFHRSTlMAhzF6HuRjU0IM8syvkHAmZxYTCiWd48cAAABrSURBVBjTfZBHDoAwEANxQholofj/b4W9WULsXkYapXg9/c0cgyGkLHIgtheVyyw2oxg2biIvYNgzC4vYimjoTE1sRzWs3DUAcFoAMogtOAw7V5F3hJ1pidmVet39SCO54XVNtxCtzi/5Ow+G2gRTqLBYXQAAAABJRU5ErkJggg==";
    },
    15153: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcBAMAAACAI8KnAAAAMFBMVEUAAAAMXcULXMYIWsYMXcUMXMYMXMYMXcQMXMUMXcUNXMUJWcUOW8QMXMUJVcQMXcWisIZnAAAAD3RSTlMA4Vwe9Ya60MKlnjkkqw8Yico8AAAAqUlEQVQY02PACk7vQeIwpfz/76YA58l/XxpV/xHGn+9qwMDAHPITwmP7AeQB+f0JEMkLEGFesDTTDyBhKAwk+kG6GZ2BhP4nIGEiAGIFAIm394AEK0gs3wBmIfM3IOEONgBsaQkDA88vEINRAESuP8DA/RXBjd+AxkVXzOCO4JaALQJzYRbpB4C5MGcwOsO4JgIwL7AlgL2A7kFM7yMCBzPoEAGLHuyYAADkDDcfPzp69wAAAABJRU5ErkJggg==";
    },
    53896: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAA51BMVEUAAAAAd/sAdPcAff8Ae/0AcfUCcPMDgP8MhP8Fd/gYif8Je/o7kvgqlP8VgfoGdfUOdvMij/8wl/8fjf8Sh/8lh/c7nP9NnflFof82mv9Lpf8dhPkPfPhTqP9An/8Lf/s/m/4mkf9erf9Gnv0qjvpXqf41kvtVpPxCmPpFnPxDm/xVpv1Povw/mftUpPs7mPxfqvzJ4f6Zyf0ykvtZqP1Wp/1QoPra7P9VpPtOofyizf0pkP19u/283P6x1f3p8/4vk/0oj/3///8hgvUxjPYsiPZUoPlElfcVefMbffNGm/k2jvb3+//uvD8eAAAAQnRSTlMA9vry8/v+8fP59fn+9fn8/vX29fP89/739vj6+vn39gj0+V/4/Pnx+iDqb4+1Qzv1/vzVzLZ5/uHT/On6/f3+cpCpBFwTAAAFT0lEQVRYw53Y61baUBAF4GjBEoJRShErIGiUGAg3AQEv1SKECrz/83QuJ5nAWaG2Gxe/9Ft75pC4iLEvXccfDSdutepOpm3f6Rr/E6816l3fVqvVC8g55vKy2W55/6bUndF1qBBxRvkBaTv1zzOtHjCikPAtyuDtk5QwXIWRY87VFbw9vX2C6QwVQ11YYSEPKRQKecyg+7epfGFUGULIyEYB7tfe+Tysw4yUQYWR75gMvmWz+YG3Z6we12FGjRR2AUICUuEpcTwH6uxnvnJCyUk4revrsA4NJcx3YYQCKe8k9Pk780UkO0HqyFgxBhJnMIDBT4YlfU9eDxw4LNiOnJTGcFL4Fko7Z1cfosN1EhhxUiTVSMoP6luQD/uROjhVMsMBqWaXYU2/thZEDtVJZsRhqcbSTXxNQ3KojuxY381WLIulm4E4rVvYMzlX0gYSMjp0wBJXeos27UKh0JEPjs6Ig7FAsu1y4eYp3PcDDoYOn5XOsCIMByuhVMRKXEg5SUxKbyOVAAorOTiYcvSjyjxuLjRHqIpdBskhaEQLIkc/8Wx/NrvXGYGoUhsdr0qDsSMM59t4RpDOmGo4ghoenj0WOr4iRxjOxWYmkDgpYODFlRCaOzgZFwJHO6pncBDShmLHjJY0x9masGkYDJ1t5sv9jPMzb6V2mVDiJc2bhtG9gEJX5CAjTuZlFmXTv6/WWCEkskyebdHoGg5MBoNtOzBKfsyGYI8N2o68Dg8jCJbkn6tCMlcKcvY60/PSMLcckhjyjTYWKoADEeca16xn82yJQgmhtjHFVWcjKEV5niWlb5saZAM0MJoyGUApjvTRMrYRiRwdAgkZaZTYSSAZDc5fDl8c2lFinoU5OTxhaJ2LQyIdHMipadkUFZNOI2R9vBPU1KEDTGGcKD0qJg2NcDSEmgDRhYaQMBj7Jbbh/st4I5UsdqDRyQlB8/VAHX/WzmS+MCOJrjXbxKx+hlIPmG0oNzDaCBUAqsFoW45pPqtRQKFpGmrce3EAen9fzHNtw7+MIEscvqjMYMPQoYrFpV4EOsVdA+QbzuVZ46aQLdu1mmXt3nDMxistV0LSa1oFoN8fuKKcY3TPeUkEpaSNulOU8Z4dMXBQfdw2KUdHVIgmW3bhxqaWVENJ1YkkON7HzSpkcMf2BiBijqgQQ3BjM9rnu7OxIZdm6HB6AKFDhRBawGRtgFoAQaWybQNkRY4w4nD6s/ERhRyerAWQV7rLUaUQkrE0hXI36zN0GhVaekY4m1SKtTFNWkzcQaB/v1uobWAcrlQuCxSrEtURqdcLnbCQQ1Ad/iHljm+KUKmCkDhSRhgMb5qcIhZq1g3KA1VCqYKSae46oohzFA2WWz4AwpVQAogkE6BEJsRkQWsphJXO7xrzHSmt7SZeSS1oAU6JCnGlKVTSpLiiMezgglZTKsTpBCLhxs1DuLBDSQTQ2OG5iuSUOkYsfmmlJJskYIDSHKkjjr/zFYKlRZE/BYpCbJcRZ40ODybx3C0JS0WR/aQVQ58fclxP+5oVSoviu61KbYW6MMNjoRN0DC1OgFJuPgcJKGyFf3hyymElYpTjaAykRRKNB9T7x0elUvkdM1AhRo0FTivhyzFMh9SaKLQgBIhCTI7rSB99T0GwuluCRKuiMIcIK4oBx+3se4AQlErLJfzqHC3BIiVigqm3/5FGEARMrcmSoLKOmFu/buxPZ0oUW4hxEEFFMRMZK7nUg0sUWhJGQEHGfZA6+6kJULgtyd2KFWE+RzlDN2BMEqByO3Tq//ywDi0OG7fuqOUZ/5Nuyx9NJm6v504mI7/VNfbkD4bwlvRAq489AAAAAElFTkSuQmCC";
    },
    5280: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABaCAMAAADTj8UHAAAAclBMVEUAAABnl8n9/v/n7/jm7/jo8Pnn7vjs7PZnl8lnl8lmlslllclilMlnl8pnl8lnl8lml8lmlclnl8pnl8nn7/ikweDY5fOtx+Pk7fecvN2Ttdne6fWzy+VunMyBqdPQ3/C70Oh7pdB0oM6Kr9bA1OrI2u3L/sCaAAAAE3RSTlMA/gbyz8dsG/CYQSYP13TAVjW/mB3UrgAAAn1JREFUWMPtmI2OojAQgKsuLKDo7kH/aSkF3v8Vb0owrYfNai+5vdw5ybr5rJ9tWmZSBy1RlXXRPBxFXVboGscfzdNxOa7TFk1CFNUyL7hJtpvbrXlXfp7Qw7H/LHdu5bBo536gJ+PD2RUq4bVEz8aq1fB6fF4+glYjt10oIWDdBWrS5eYlv+Q/Ju/z7HDI8j1CX/FWfn9rl3h7R1/wVt67MUkZjO6vTDDuQ+5X3sg5uGZoGPzLVyYKY0U894574I2cgYWnRc5WxqJtdeeZUmADvJEPLQRZ5MPKhLRSzZ5hbjoQx3E5/PCAb9iMo7wnZ17OrmysaQOeYVZB7y0793K+8ux2J2AuGNMd8N2jAjk8Ku7GqGeplRIMOO0hkXLl5MfzL8uq/zSf23kKHhJCIYhneCOezy5jRfA4moFzTjzLweV3LJ+l5iD7/OUAv7DpY/ksuk4EKYjHweKAR3hj5a0M5o1MuSR28qw16VfeLJs1HL46KDuMQRpiz4I6vp/PrINV68lvkOCwR8ZzNzK2cOSoOhEelbaKB8yEtcCP5jORr3z+5+RvrCQTheiDyjFjTNobpjJWSTrOuQoSw9iOKuJ5spQPLFJJIHrLfAq69NPG89jBX/xm0IqwcszaUC09j+5agaM3A6lIKA9caOJ5UlgMOHozoGNY8NySOffc9t0sutjNgNkpvAloCvmPPVPeEiVjlWSC7QqOZh6sGqVnMlhr0isJYa9K8pIT5MSf/SCnNxxATm91OPnpJsvJNVm8nBDfLBfxsd35dDrv4uMFquODZwRxjo/XqIwPnpatjY+XqEqXK2impS77srTx0jasOP5uAxHmvqS3LtObpj8Bw1G2TxlTINUAAAAASUVORK5CYII=";
    },
    18147: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAABelBMVEUAAADw9Pjv8/ft8Pfq7/bf5/Dc4e7m5ubz9vrkEH/kD37kH4fiIYjhNZLka67////w8/gAhM/kAHeNwh/+/v78/f7v+PxMqd1Hp9wHh9Cg0e1+wefo9PsznNnz+f3a7fjD4vS53fKRyup6v+ZwuuRTrN/4wN09otvlB3v6/P7+/vzj8vrA4fN0vOVpt+NXrt8Yj9PQ5qPI4pLlC32kzkz8/fng8Pne7/fS6fbK5fX3+/Kz2vGr1++p1e+j0+6VzOuKxumCw+djtOE5n9oumtgqmNckldYglNUckdQTjdMPi9LW6a/mF4TmEYC723nkBHmx1WWo0VSgzET1+v3t9vD0+epcseDn8s/1nsvzjcLxgLvwcbTuX6ruW6jsUKLrRpzL45nB3oW22G6u0174+/v+9/vV6/f97/bx+O773OyXzev6zeT5yuPv9uD3utrtt9j2rNP1pc/g7sPwerjvaq/rSJ3nSJ3qP5noLY/D34nnIIi93H+ZyDeXxzI66tBzAAAAD3RSTlMA/u3kw3E7Cvf89N+ETRMcPcqOAAACJUlEQVQ4y3XUZXPbQBDGcWMcap6sckIz1YkhMYWZObEdxgbKzNzv3nU703FPyv+dZn4z0u3o1sUF/D6Pu1fqcz/X0dXdw4Br86qw90D5W+e9P6YduBNxu6wCXjj2SVG2K0wuKp09Lr/qjM6VrdcXSv/Zx4rS7fLBuWPl/O27kw9b/MIulwfOPfpe2To9Pj1h1OFy479ig4vh9JQA8GL78svXs22Fc/W2kpxBtLG4RJlRfnh2ucvAhsaLtDalAqHCehzck5f3m71pRVMmGRqi86nnWqxo4V+9LShBNKiKeeI2pqOrM04oSBTEwCHR+mQkvjw/spK3ozhRAnsG0UqUnyJGIbocktGrbNKCliEKh3BU/Vl+mA7GdCGh0jWghYmMCDb7uNuJ9OysJaGRWqn5VUMDuGLS2KxVn+r5hISG9qslkeLTXbOpT0B8q+7rOQmNHR40roDsDZvaMGYslOujQxKatFIHjZ33t2x2skg0j1q+iUloLj4YnKj3cWWIJA9rDNgpSWggE00Hh3/0/dqEukC09hjj09kjCWEsHNILYlggohOtjiK2QXnICFZGS+sh5HhYSyFMmqTv2RGSGS1pLpvU/BUsszkyB4TUUm58YVGfEYLHWhBwRJgrTovm9A0yZwFHxMWLKwspw6S1PFqRdBG05CqZ4bkIWnPbr5QqIOWRLqdjPumaO6X6pYXhlDcgrx577W3SErOnetm0rEN7bo/PH2DwG5PrfW+2rflQAAAAAElFTkSuQmCC";
    },
    52554: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAAXNSR0IArs4c6QAAAO9JREFUOE+tk81KAmEUhp93o7V12UbvIyhE8FKCkARX4Q0UtUkUBKUrKRAEA29DoW2bQPxZvPHBrGKcmW+Ysz/P4bznOaKiUkUcUkG2G8ArsJb0XmRYFmgC1IGJpGUe7OxqtttAD9gDj5K+s2CZGdnuAzfABhhKOp6D5YEukqyugE9Js1Kg0GS7BTwBNeBN0lcarND5bXeBO2AXcpP0+x9WFHQNDIBTAvqJBtkO+bwAl8Bc0kf0arZDLs9AE1hJGpUK2/Y90AGCQ8Gl4FRqZQl5CzwAh8ShbbSQya+NgeDRVNKi1ItU9rR506OvFgP8A+0qTBOdeTYkAAAAAElFTkSuQmCC";
    },
    42988: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAABaBAMAAAB+jKo+AAAAG1BMVEX7+/ulpaXs7Ox+fn7Dw8NgYGA8PDwlJSUSEhJtrlOpAAAACXRSTlMFDQgQChQXGRsPCIqrAAAAvklEQVQoz43S2w3DIAwFUMsbWHSBIjZADGDJK5Bu0I6Qjl/8CCKKKiUfHN3gJAQD48pFVoTHiFlIKUw2ReJTZJDBmjAzKSUQqgpRMpImYWUU1v+k2gEKHbQOqFiqfaRAInHt24CC1t+AT4eTQ237WJr4zd1T8AUUZU2vSPfZ56uv34uVTWzVweb0C1z939OZ2n2z2ty64kRCji13ygEFS6usf/bgbKrVsMHkPOZh0JrTQclBAavJCxCgAwHG+APVmkwEMPkF0QAAAABJRU5ErkJggg==";
    },
    62774: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAhhJREFUaEPtmb8vBUEQxz8vaHSISJT+AgUFhUahECIqjUJDQtQapUbtR0KjUFAKUSg0GgWFv0ChkIigk/gVMsmeXM7evbvbufeefbft2/nufOc7O3tvpoInq+IJD5qeyCIwAxwC20qqOmHmVeQSaAM+gCElIk6YeYlch5wfUCLihNkURFqACWAU6AM6TDrlJZ9FuG+Tti/ALXAOnABfcSBxTnUB60B/ltML3nsDrABPtnNsRESJnQYjEfguZBZsytiITAGrxlKq0i5wBjwaueUnp4sZo1wUU6piNzAGzJu0FtM14CiKYSOyESqpW8Ce5WCnUhlDJAlzDlgydrJvOQ2RU6DHbJwE7i0HOz1eMUSSMHuBY2P3AIynIRJERvbKYyfpVe8laSZ+yXoHhtMQuYLfbzCtx04jEMEdktI8mIZIERdZk4hg/Qmw7bKXRDTCnoCRGOBSkYKjb4NXV0Tq/WzopdXkJKV+P+bPmjqRC6Bd0/sI1iswYsFXJ+KNIgWKkQitrkhJxDECpSLWbxrHqLqYl4p4r0iWd+QN2AQOXHLK2KqnVtaX/Q6YbkQi3iiiENxcEOqplcsLBaOSyL8vv960g7xp0KVpmSrc3UwQuVqmaZrYmbxQ2JyriZ1mrKDgW1UI57GCN4MeCZUXo7dA8+gwtBNoDXXqq+aGwwbpuH8Cz67DUAcf6mNai1FzTZiVRGoS5gyHeKPIDxPZmDMMK2bNAAAAAElFTkSuQmCC";
    },
    51732: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAYAAADgbT9oAAAAAXNSR0IArs4c6QAAARpJREFUOE+t1D9KxEAcxfHvU9DCrSxttfVPZaFgLVY2gjfQPYHuCdwbuDdYC0FsxFrQwso/rbaeQAsFfRKYWZIx2WSDqcLMe58JzI+IBo/tGWAPMHAu6auuprpAtm/7AtgN2UtJ8b2yXgvbPgAGidCVlK4VImNh24vAA9BJ4HdgTdJr1SdXwrangBtgs6J8C2xJ+inbHwcfAf2aO+hJKs2UwrZXgHtgtgb+BNYlPaW5P3AYrQxdbTIxwGPACyNYBp8Axw3RGOtL6uU7Bdj2Rriw6Qnh73CRd7E3gm3PhdFamhCN8Zcwgh/ZQh4+BQ5borE2kNQdwba3gav8QS0PyP4lO5KuZXseeAYWWmJp7Q1YzuAhsP9PaGTOfgGQfFLDN90DiQAAAABJRU5ErkJggg==";
    },
    77757: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAoCAMAAADJ7yrpAAAAe1BMVEUAAAAzMzMzMzMzMzMzMzMzMzMwMDAzMzMwMDA5OTkzMzMzMzMyMjIyMjI0NDQyMjIzMzMzMzMzMzMzMzMzMzMzMzMyMjIzMzMzMzMzMzMzMzMzMzMzMzM0NDQzMzMzMzM1NTU0NDQyMjIzMzM0NDQzMzM0NDQyMjIzMzPGfBwTAAAAKHRSTlMA4/hL9O4SDAgE4Mm1oy0n3NjTzsWsnJWOh3RtZlhSNCEddV9eRjs42NI7XgAAALhJREFUKM+d0jcWAjEMRVGMJ+ccmEz0/leIfymNGnB5j/SOC11+eVopfUJljJMLaKqA4cOi6fhoCl0Y+qURstnVas2zMwK9mF15trDo7kw3ZOOQ6YTAwLMtVDP0ImQPph9kG569IzDybAJ98azCvxiGjcWI4Yj1GzUNS6gdrjXl0WBs7fqmg4MQXIXgjmBEg0GN4EYHeyxP1BZYSy13rBU+DVYIZnSww/JM7QlLhVMs/TM6mXjef74vj48YE/VXflIAAAAASUVORK5CYII=";
    },
    6511: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAAAYFBMVEX/VUTzUTv/VkHzUTv2Ujz4VED0UTv3VkDzUDv0UTvzUTvzUjrzUTr0Ujz0Ujr/Wjz1Uj30UDzzUTrzUTv0UTv0UTv0UTzzUTvzUjr1Uj31UjrzUTv1Uj72VD7zUTzzUTsjQsSqAAAAH3RSTlMPvhb5USXkIPHKx6umfXcRSy/w7be2jYFqZEebZzqa3FSjyQAAAcNJREFUSMeUk+uSgyAMhdOIoiJQq623mfX933LXRLY43uD8ccbwTcI5AY6FoquKrEmSJiuqTiAEKzVlMm+UlCYNQsfWkVu+HW/RZzmfqnxeD6zmS6mL4UU+O+XKiFoiyloY5f0WZ6x2R7JJ4Nb7KXM1fZxO5dDe7qu2d3iFB9ctuPbSeBK9fvGJIt2VVvYt4VTyvdIIW60zf6x/OP2T9Gf/rJMfeZUM4Oux/HuAryHZuyaYHeEOhpFp4ZnFQQ5wD8PAeX9NU3xfCIGB763+95l9tmGwZc/dnpeUr4QwGCTlXfqNNYTCoL3WLe0khsNIm9qS1WR+D+Ew9BTsYrihxjYGttTaOLt+IAaGabUMaWoRBwuaG/mbYxyMOXfseF/iYN7Jjt+iiYUNv8yCBoiE+bIFkOt1LFxTvtAsHxkLy6XUACWFsTBSVr+tl7ENwCAQAzPCpyUJ+48ZJHcIrjncIyH4t8/qsLq2ejD1VWpI1HiqxXArGTN4lk/6Dd1gBmRDEdgQGWAEBkjWG6H1Xg1YA9ilcdzUO1QQNyLoRMSqcDdYYYDGoJSCOIOPClwZmfuMzB2QWcC6rQm+oES1q0Z1tpSpOvgDO2BztNkTq6IAAAAASUVORK5CYII=";
    },
    88929: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAMAAAANIilAAAABFFBMVEUAAAArlf8sl/8sl/8qlf8qlf8slv8umP9Aq/8vmf8vmv83ov9ArP8plP8tlv8wmv8wm/80n/81oP84o/84pP86pf87qP86pv8+qf8vnf8ok/8qlP8slv8umP8tmf8wm/8xnP8xnP8ynf81oP8vmf86pP8vmv87p/8+qP89qf8/qf9CrP8qlf88p/8ypP8plP8umP8wm/8ynf8ynv80nv81oP81oP8umf81of82of84o/85pP85pf85pP80nf85pf88qf8rlv8tnv8okv8rlP8qlf8qk/8rlv8qlf8rlf8rmP8tl/8xm/8xnf8ynf85o/8tl/8ql/8+qv8ukf8okv8vmv8rlv8umf8okv83pf9Ns/9Av/+ilB9KAAAAXHRSTlMA4dbS6+jdzinDwHku8tm8tpN0WlRQSDYyC/bv5MzKsaqnm417Xk1EQDw5JCIdGcq6raOfmImGg4J/cG1pZWJhS0QR+e/k29nBko2IcWxnTEk/IRbqxLagWUEUBFVAgiQAAAEOSURBVEjH7dNXU4NAFIZh2GWBJAQJLb0TowZIrFixxPSmsev//x8ulgtvnMy5zb73z3wzZ+ZwLBaLtR45WpCF2vRGPFaDapfi4gtUb8ZjJakK1hTjyg1UU4zKYF3ESH2G6jsJqWLnAaqxKvJDqL5GIl9o+1A94HsErvsFImAPqO9FIuSRC9W8kE/2qf549z1v2WrJsqJkMumd7a23pm0vFpZlmobRCMNwPp/NplNddxwnCCaT8Xg0Ggq3yRzvcn7EvlDTvrJMo3F5cX52qicSJ8dHh/V66qC2v1et7Ja1TvQYEkYqvTahy7lum/P+xak/+Kn0jXskWu4+ctmlrKyEtZ/lwe8yeeVYLBaLBegTthkskgNyTlYAAAAASUVORK5CYII=";
    },
    73577: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAaVBMVEUAAAD////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8G612AAAAInRSTlMA+8vi5iIeBN7JuWEI8+3Rq52RgW5mXTkoJffVsphUTC8WwsjLywAAAPdJREFUSMft0NmugyAUBdCtFKSAs9XOw/n/j7wnmpDcctqmj01cDyYMm41gtfotvso1PtB55eOgItoc8NZhQ1TF0ZY4sccbe95P2zg0NkkI+61BpBVPlANeGEpeVvr5itx5h+DON05/Us+zWWfwxHTZfFbyjEWfzZHz+ED0GM/LbF8gNSmaZaemH7wf+uZECzVBUnBApgpIdrzkmpL+KRvH392rgqNBuHXOLhe3rrsFmONcIRdcsAg1UR2wuMgVheUz46PmRHl8WO6zacWViFpIAbS8dE0Cngu0HNBc4ZNAaOsRcgBj3QZIngLfcEQO35iUmrBa/bg/3/UbFrfFpTYAAAAASUVORK5CYII=";
    },
    16760: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAgVBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////9d3yJTAAAAKnRSTlMA+7zw35Kahm05KBbn2sKhi2gH88V3EtTKuKh+cWFGPx4dG+qrqlZSNOlcbQpsAAABNElEQVRIx+1U2RaCIBANFMXKvc1Wbc///8CAGBqt7HB66Zy6LzqXWS4DTO+Pb0Wfz6Mwz8NozvvvvavErRHcpOxOHpO6BRK/LpMl2t2JDoztI0eHJNlz/yC8qVgEhlnc9IWGwVip9LNTkz3OVJHVoz9XWtLHhVQp4216Kdli8LRxVK4tm+RG6onBKj23Ji4z7Ymlqg32HwwF5RkRuW7PGBhPWEMoDwQFg9UGPnCFSmiwJSLBRBtr6TllbCq/aySBbE2Aj9swgsw+LpsqFkBFQzPIJVZG91ComzkyGrBDRiC89GbH4veMku5sAy72kvCm0+5Nc8latHUCbUUHV3QdHIWDs78a9pcPX29aGRuXL+B6f/CA0BM9NtkTPFH7IdA9ZvaMHdCY+XSQYZTtUVlZDuM/fhZXL2dBcASuplAAAAAASUVORK5CYII=";
    },
    67409: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAA0CAMAAADypuvZAAAAYFBMVEUAAAAyMjIzMzM0NDQzMzMwMDAzMzMzMzMzMzMzMzMxMTEzMzMzMzMxMTEzMzM0NDQ2NjYzMzMzMzMzMzMyMjIzMzMyMjIzMzM0NDQ0NDQyMjIyMjI0NDQ1NTUzMzMzMzM9O2NUAAAAH3RSTlMAZbwP3iU++ciMMb3yKZZZF+LtqpN9UW9Fsn9ORB3jrfA/3QAAAaBJREFUSMetVkmSwyAMlMF4x+s4eyb//+VYipNKMJ1Q1PTBB+FGopGEyAOTtCod83xMVZsYCkBVDrc3DGX1jaJuHqhPNDPdACYYZZmvvxRzlxmtTdbNxWrKSy9F12ssSf9q7pM14lpvOTa9O8log+zuLrXk4NCIfUde7GTH5uD4EY7SBKCVsOybTXb6oQ/4kUhedxUN9vQRe1HjRWvXD/b1VN7kfB76CsX39bjlyYlWkB2Por578okEFbt1tb42i1hXV3n+s3qqUJCDjtc711qwFk9HmzxI2JpscuPhqhQVwkikVgF/edVDguaByPBqH0rq2WxktaBQEhVibpfvHE6aF3MrR+vCSZ3IlrLgmOQTPaWRTxZMEt1G4mTV4STNSRtFQuFlklwgPCQEtSwtEAJJTtT3REBycLkQcrkojUifz5pAGqGEtcOSzhYlLA2gcGCZDbAIG+mooAhRuUvPL0C5o8ZyyZebv/i2UriFkT2dLIEWhpqlADTLiLYc8wDEPDVRj1rM8xnzUEeOBPHDR/yYEz9QCaraR6mrfxgSo8bRPwg4TFNJma8CAAAAAElFTkSuQmCC";
    },
    4508: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUQAAAD+CAMAAAB1EoxTAAABblBMVEUAAAD5+v2zxO/x9v/Czu/X5v/m7P/t9f+kvfLj6vvm7/3k7v70+f/m8f/n8f/z+P/d7f/l7//n8f/x9//o8v/s9P/U6P3z+P/n8P/o8v/m8P/k7PzX5P/u9f/g7f/w9v/q8//j7//o8//s9P/d7P/n8P/x9//x9/+Suv/n8P/3+v/d7P/0+P/1+P/1+f/i7/+oyP6Yv/+Vvf/A0vikx/6awf+cwv/q8v+vy/ynyP+zzv3///+70vqKs/2Vu/37/P9+q/660fynyP+gxf/////y+P/d7P+ixf/u9f/k7v++1//I3f+ZwP/s8/+cwv+pyv+Dsv+Uvf97rf+nyP/i7f/m8P+Quv+tzf/W5v+Htf90qv+00P+61P+xz//p8f9pov/a6f+LuP9+sP9jnv/O4P+30v/C2f/S4/+Jtv9tpf9wp//E2v/f6//L3/9fm//P4v/c5f/Y4f/4+//L2P/I1f+yy//Q3P/S3f/j6f/O2f9g7G3rAAAARHRSTlMAUEB5QJP4QD8XKg2dkjRl8Z9a3Mq1B+zrc0klEumrqYPhHfTZ1TjTh2NJzJHKwFTW7M1uZUghvpz18tixWTHx597otrqMDtoAABTKSURBVHja7JzbaxNBFMZXVMQLioJ9UB988kFUBH3wUhDhC7lszVqTNJEkJUrbCNnQkv//wTO18bCZnZntbhdmwvkF8f3Hdy4zsxoJgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIgiAIvvPi1esvAFaNVrt/OVLFjBkxc8Xp6dE5y+UyzrBYnJzTYSadyeTr7rsnUYDsPPgMpnEZjWlBhyyRHS40h+ccHx9Pdt/tRGFx/1xhejJOxotvIL4Vd3gRRPqtHZ6Vz+GFRGI8nny4HQXEA5W+yfcf/+gOALTKBpEVskNTDBcZhcRaoXKo+HA3CoXrAEakcM3vmLNY1GFqrOXTfIeENYeK6fTT+ygMVA47vzMoi4NiDlmhu5Z1h1oMWSE5VOwGEcYXyuH3DUbAqmhDJIMlHJ4YZwrnUDH8+jTynh2aKaOfmxw0gFbhdphyPyyXQ5aoORwOP92JfOc62Tr4ozEF0C6WwzR/tyF4t4nzd5sTt8MQLD77Akx/5TBwRpHHsiGIl9kPNYcskSx6XtHPgcFBHiqKxXKYunNYwiErTJLk67PIY3YoiMP9XFq85hTcD8/WDkcb/XDpaohmh0RC7EYe84hM7ecTAw1nDlUQ7fshUS2HJJF4F/nLGyDey6cJwJVD935IlNixs8Ws+OTvEfAugGbXQBsYOA7MmsMS/ZDPeqZaVvT8LehrFLamiSXQKrYgkkJzLVfuh0Sv10u8ndD3gNgocQw0ih721hrnhmJ2OyQsOSQ+RJ7yGZj2jKwAi8O05GFPd0jk90N2SCSedsVnlLXETBtom3OY43Be/dLBkEOi6emAvkVRG5oZAYe6Qh7MWgxHVWuZg6g7bL6NvOQ6MJ+aiXMmS9qvcAnrdmgMIvXonp/1rObK2MwEaBS/g63ukGOo55DwtJ7fAJ3jCf2IvL9XaLhzeFZhyXbOZXZI+DmfP2M1sdHAKuuQg+jMYanzMkvUHfraFIFGx8YhoAdR7dh6DqvPFFMts8SPkYfcBg5PbPQBx47t7ofuSwdrDtkhEXnIHXK0sJECGYfmB5XKOXQ7JHwczy+ANLZBEi2DmRRaa9l96TAptB8yPj4TvARmSxsksW1Zbio9jhIF90PmRuQfSuKRDZZY4IG5+mOAPYddfyXObbBEYz8kyn60xAdmi0Pvk3iNJI5s9ElihX5Y4SI70XLoaxJJYuqUaOiHFXOoO7TP5a7PSUxnNtok0fWgwhIv55AouNtwFn2UeAt4eNPGY5JYqB+aHwNKXzroxdz1UuLd+/d3XFFt5/fD6svNuPhgJoFKoZ8SGYvEgh8g6jMlNn/5VdwhJzF8iVfeDzWFNoeqlMOXeEUfLXVK5bCr/oQtsW/bbWYNXDGt00Trh921w72wJebP5W+ogdaQHOYW817AEmccxOxcbqMWDjM55GLeC1iicji6yGH2hXmFeug0M6xrOWiJ/6t54y1ghpoYcQ7pt85h2BJNj6MpaqKfl8Mtkbi529QpkYO4FRLNB5Way5kPe0rhVkjMu8iudbCcT+UNh/thS8x9DOijFg61/XA7JBo+WhqgBloJ74cbDoOWaLrIXtZw7Dvq8VzecBi0RO1jkYpfZPMD89B0kc2DmRtiwBIzQZw7L25KftWu39toDoOWWOF/xahwgagN5tAlnpkcLjMKLbXsfmDOv3Rgh8FLNFxkx9X+hYrlPUWfy9sikR9UqvdDha2Wu1sqcdNhXMODinWoEAdbIvEvdWf34jQQBPBFEUVRVFBQRFREBB/8Fn3QBz03msT07qJNaltNNE161lK4///BzBl39rObtCdkfz6KF/g5uzs7uzu3WRzaLzqgQ3McDl2XKDtc/qfbc8msDFZVmtEsrVaBP405ha5LPIaXUvaFOfGLjMpky0l85NB1iRt3I0CJ1vlwUKbUROp7Q+cl/t/XZsCsouspErcl2l/fbpvbTCpqp0qcl7jBfNg2yR5XtB1VL+8ntpHY/UZ2t/lwEND23OzjG4w2Ev/HywB0OMtoFy4+JM4BEjfPD+03suOAduW8a/09G4n2W+2lNrmx5oeDinbnwR3iFiDRstdr3Z5FnQ+TlOqpv1msKtPf3u7juyqLxA1yG0NbDMnhNKMqVTmNo2a/HHqJX+kmxgvEJUDiuhd71YcdG+/TsTYQdQ6riafUHMLxynGLIHFNHLY7eH4/0zlMFIdBrNa+jvAWisXeNhqySFTjMNtpxyfNWB6kqkK9QyCSNd52aHUBieb5sPU1koUSh3El7+kik0Mgz71KWqPdyXQaictC97qi2GlLpizMARVYeOsd1gx9KV8krgASjclN2lriR9nhjPJk48jiEJgPMsrjzN4FJGr2y5tJxBqsqCMbCGcBRonzKBUWF1f20SDRkB92Gs5CHEqDOY2VOAREheBwPtq7KFQjiBvUEivzoVTrhaUUHY6FONQ5DINPO4e/B1wYgsPR6Klg8TRxApBodOinbVMcqYBYiWNZdeg1OXwgxGHNiQu8xbvECUCiwSHQLtn+MBUdTijHWHc4+m2nYTzkHIJEcplyXCYuABJNDoHi06FVYZVwDuVAXOjmwzH+48YhSiSXnAtFm8TuRVgxvak83cLMTRMROmwkXr3rWppTS1xtUciWc2wlEKfa/DBDiXGtMAeFR+zWEsl1ijwgDoASTQ47HzAnFAkim0SvlogOjySSmxRxobRYSyw0Dsst2gSVFIn1GxV+OPMOG4lnKXKL9B9JYvmXrVotpVwgqvPhEChQYsg7BIlSKN4m/Qclbt+uSh3NA8OGOUCJQ3SIEi9QxIHyLEq0TIitLy35lFGZig4LlJijQ5RIHlDGSdJ7UCIYPI7bxAVlTEJD4cZnDg/nWonXKOMK6T0g8RhuwnpIRhmeqfg1w5MFdMhLvMPVcvpfnAWJ2zjEsaxOiVVokjjFHQs65CWSuy5NiiBx68tz6DDityulsQg7YBK/oEJB4nmX9s+1xCXGYev8MFHnQzVLHBsL2R4+H0eHgsTLLmWKIHHz3EaRGPHl2BgdGiVmosQf/yRecKk0CxK3eBmgdqtaUUYkxCGS5yG+wRcdMonnXNo+1xIDy4TY/rWZWH1I1xzsMYmF4BAlkosOlcNAouqwa26DGrmjpsoQhwCTGIgOUeJdhzZ+INH2u3zsyQ12keTSxJXBIcAqvaXoECU+wESR9B2QuHFbXVSIT+kpo1hzwsze8/vo0CSRkr4DEiWHBomNQttLei4SUaFyOMrumo1Fh/sOR2Lbl1Jo0dQCkZ8TFYd4KMUadCSiw31358Q1DoNvh5aWGFKLG251Nl50GM3ZKWIsOtx3dnVek9tktuYsyhNmLk8MZYd4OMp+rsc7rHE2TzQvKitrmyClG0FAGZ7R4Yj94D3OIeDqjiUwz4f2ayS+3OLGp4zE6HCU/AvlxiGT6OreOTC+rih3rKRCD8QwDMeU4SsO8YD5N5sS0SHgahUnMCaIgV3ib7nXUkwZlcEhkBcQh+hwv8HVemJg3Oy1kai0nssoI1IdYg0298JdAB0Crla2/0lU93pthrPSnmVJGWNTHO4inEPA1TOWwFy3sS8sE6WzyIQyVhaHOJZliXddO+1bmDfMhc3hF7VPUEwRb53D+Vwj0dVzZ1EiOgRsyXas6XBToYAFOszFs9E8qGsQ7xcjUMjj6g2IxbpDqcWXQ7PCpbZLkE+RCONQkLj3ofkRQ1HiV1fv4pRdf3Erom0951EhFHUOR6yK82lXcPjV1Vth5aT1LwO3t5EECop4SnID+NzKJEp09X5iqa8fbt7xa0CRaijPh8BHlPiRV3gk8ZyLN2XLzm3T1KGMDoGKIr4ut+Hm2UN0CLh6Z7tsfxNWqcLqL8ImlGOQo0OdRHQIuPp6oGzdjkA6lDI5HAqhmEXiYAY+c/tGziFIvOfmO5ZSkx92X5dRYo1HOdJQ2euNUeIUHQKuvqjyuy4q0dqxfERJOapQ3uzhyvJRdDgSHF4ibgASW7erQiKTw8biXibEYiRvmPOPjcOR4DB39pWp3yUO0eD6l6Mx5cliueiwO/58ePh5Kk6IkbvvnX1Q2K3POO8Q0JzrTaiAPzIUblDh/owKnCKuABI7JtnmscyRDwu5IR1zCKgO91bSP3h0gzgCSOw0ljG5sbykhzxHoNxTHKLEkU9F0iR+9IK4AUg0OrTn2IDpokOYUlUjKuQd5j6VyKb1h9++IU4AEjvNh2rRwdzRIdP0PM0Vh7vxkspk4xh49Zy4AEjcaD60O5yPIBYVVjNvuNsY/JFHs4JSk0PPe/WMOABIbH0BEU9HQykQh/pTepwXJdLVMliujD3tpvhlFyyCRMtYtieI5kP64ZJ2p0r4b98nvQck6jfM1jXF7hCY0a4E0qdfkr4DEm0OUaHNoe4wwEtpFy5efiR/+l3fj+9BYoe6jX0sA6AQKzdy/mLrbnzjkfzpJz1Pu2uJk24HKqG91ZJcQAwL2o7l/Awh5MVb+cs9T7v1Ejv9ChWjw13EK9oo3Ds4AInkzSv5y497nXaDRGMcbj+WsegQBbb1pFYIEoHnr+TM9PEZ0l9AYocibNgmudE4BPJpRU2sBj8OgO+Nq2fqTv016S0g0R6H9rFsd7hfMxwsMiqTld7o18FfhyARLYopQX/TbpBoyw/tY9l+eQ43zHmU+EFRpTStimAyCEdff4FC4DtKJPfVnXpv026QqDpUsxvZoX0s24qwwK9aINAo5CWSl+JvpuuzxVrirNNlEeDYHDYcKBKBd0wi+25Pizoo0XoYEB2TQ0R0KEu8+kSp/j4hvQQkyoFoqh92nxDRIaIoRIeixHrrovzf9TPpBonaOESOeyzva+MQJSIvHksOezqeQaK5tQj82W4sA4JDRHKIEpE3j6UP9zNZrCWO/3scIhiH6lhGicgZ6cP93LeAxI6XOO0OVYn2+RD4qUgkz4UvP+5nUYxJjNsEosWhKLH7WMZIRJ7x3+1poggSLXG4ZW6DWBz+xEjkuf+nvbP9TSKG4/gMiQS4G2GAA3TCtjBkmTOa6F6Z+OJ32THGnhHwAebQTLdpFJ//e68g+dn1rqV3O9slfLrgxr0w++Tb9ndtj+H/+ygxoyUokbv4JV/bsBL58zImkbU4dqhngTOSyKkPJRwKx0P+gNgfNZSIPH40HA/vaZrDkUR0iISQQwdRDvsokeLJ46d6zssoEecUlwJxgs2AjtyASDmkguigsyuexNecBUS5eVmcQ7ZARPrXXqLnAmLr3Xc3Wt9bPHbdONw99AD7ghlxQfPNPjeJO1R9+Mr6+u0fvo74PebHiJ9jvrjyecgF8ouiSdF1aFCkNf+jX38lUgqp8XALrG+sRRYUytXK6kWI5puulPW8Z6Yk8k5x1gH23yinM6MzRCL3KZ+35PPElaO/RO683AZ40xlOwc4r9S9+F/71ZzM640hscRcQjwA66rlGEt3WbRpgjYpAfGUI/7qmmyuURM4C4gAae+rRdA2Mlbjjtn64A3C0px7tJb4eK3S7X24BtPeUc6K9xJe8p3y2AM5P1KN9sb3Fe5L+1EnqiXq0PZ4Yi0fnkgZAHWPISqwBbB6oZ0YrllZuJCNrxfX0vDUC4JS3GQAA7w+Uo0WZmIgXkiUjW5m3GABqnE8jOASwDtTzMFItxFXtDtyZnYus0e5YiQMcEJk12DpAe7iiiuuqBw74HSH8660m4WY5a+YfzP631cXYSrJUvI/yeBKhhXPKZYtHAO9ejMBTNMwPoV/fav6lVnO+cpm7pepKbCY8bq9GDA97NtMcBgAfPZ++3QaA/RfqOWoijkYCcZnKF25fdd+N5o37DcsD2+tNgK7ngZt3ABb+KmdOI68MYV/vUA6JReSmozJ6JT08EY0U0xaLOIlEIux6PQV+5MT0TD27qBCTSLF4Nx9NBOm/SaMyiT/PtwHaHht7mwCwfaaeOhVET8qpqp/evZQsLlhibF4SSRQP3U/P1QHssw/KOUCFwxfELZJVqV2t6JqwB4vHRNIAjl036bcHAC8/qIcUOOhRTNmMTmZw1Zi3JLA5SSQT9Cu3Tfo6mVZ66rlghkQhuVRBZDC+hgaDJ3FYcB+yEsmI+Lqnnn1qQESHIo9mnBfCdQsJnkQCgLV5+cDNfgOg1tOAdpOucCZnwyuO0fsWTfAkjiy2Ljm8AICOc0JGcettyitEMlG3gtCwkMBJpEpueLuDCp9vHwPATl89JzU/QURSCaYmTPtTKEqiPbRo1TfHEl/apPDpq+esTSuUt1i+VDvGfDm0xUkkDMDBOv54vnXeJkoHz/vq6Z0SedTsLM0ivVTh9OVQkogakfqLT+rZO0aB2J1lMSmJ81Y4SUTHg1Eev+xqoLC3XWcN+tGYoyWGlkTSqLelaNgNSbpd58uDJmmISw6bVJOUaISVRApZg6RJgxKlHTaDdedYOtQk2mPXsg5tgS+28XPYdXeIGqkmMbFgiRNqEu2r7std93e5Fr3xkcTybbbYDiGJtNXgCsVJxDFRQiF2ZpkkphLi277gSaT1EqVyEIuSoyK3PxOLqNKl1G7K3faJFyCCJ5G260uhnyGxwVHY5UaRTqK/BQhcCguexNCHxC6nwnHXOEl5E3wpDBdlw0iirMNJOrJUDmmH4jpRYlE2wPaALZVEP/3ZFglkQIdyURxPKuLtgQAbVcGTaPtxaEslURRFDCPjsCkcE3GjSn7L1FcS8c1gN3y2SKELPopELLR5W6ahbd6jRuFe6lXPK13X+dmbpmheYZOIm/dhHiMRJ5GuEqUUkhe5JPJLbc68gvrYYyShHWiST2LwIIrHRP68wqsR0R7nQFNoR+skkkh+kqxwbKE+ClFvFvZn+aN14R/yRLsh3DizSSRIFtp4LhEPeaogEV/F48YcgvZncRK78muJuUw2RY4ba/NhJLfw4HvIChHmbmWSCidX3iiakerq7JKen2xFPYIRMY3semWhEY5FTKK4SFzOlZ3ImZHkg2j8uvyZtMsRjcVXCnPJfMk0io7V9MKyRKktxVjZYiaTLabMUr46V1iJx/QOnG8SsaX4bLRwYy6ZzEdK5pphFIvZ7MZ6JlOppNPphSHLhLGfZcICIZdOL1bKmUxmYyNbLBop0yxF8snq3INCdDa+FNNmeJsyZcqUKVOmqOQPWKLCOFMrO5gAAAAASUVORK5CYII=";
    },
    93374: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEIAAABCCAMAAADUivDaAAAAjVBMVEUAAAAokv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv8okv/iUcWuAAAALnRSTlMA3/zwfhbTD8qUEwn18+jb17aZiHl0UDccBMOod3BjVCTQt6GNaV5BOjEqurJKo/CgngAAATVJREFUWMPt1UtzgkAQBOAGFlAeIuILNUoS4ytJ//+fl6GoVE45QJc3vvt27c5M7eBf4drtJ17A/IhB7lXEXzP0lxzs/J8SfYXnjB2/KKfucEzRT73Ku+M7d00xxK17QrHcYqCDT/N6wlDJG83sgsG2c5pFjMEazwKCE4Q7tAleIyTEUVvHEIK2kpMYgqUlFNIdbr5VsoEgbdu5hsJZwhSKMLd2xlBUJE9QxIH1E5KlXEvYZEeQbEi+QHIm/RASG6tPSEL9HWuLuMstzWpI3uW5wo7cQx6sCpoZuYImIz+goR4R2EP0WjhoInIBzRdZQjMlPWiOJBNIHhbxDUkdiGvI7MkCmgvJDSRxpk+GfTp5oi8Sp39cgXiNK/W+lqQvNuXhk/MUEqevtHqi/13bRZViNBo9xQ+ciye6mB0lfgAAAABJRU5ErkJggg==";
    },
    53920: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAArlBMVEUAAAADif8Af/8Eh/8Ii/8DjP8Ki/8GjP8GjP8Cjf8Ji/8Gi/8Djv8GjP8DjP8CjP8DjP8Miv8Af/8Cjf8Ji/8GjP8Cjf8Ki/8Gi/8Dhf8IjP8Kiv8Afv8Afv8Afv8AgP8Af/8AgP8Afv8Gjf8Bjf8Hi/8Miv8CjP8Li/8Afv8MjP8Af/8AgP8Af/8Afv8Af/8AgP8Af/8Af/8AgP8Cjf8Afv8Afv8Af/8Af/8Af/+378TNAAAAOXRSTlMAFgYdy8jIt4VwcFYZzcs+fMu5q6ugk5NYFIl8Yzgh+Oncx8LCwsKgoH0+LPTv5M2sqZuMiVNHDAhhyD71AAABBUlEQVQoz11S53qDMAy0wQsTMBuSELJX0731/i/Wr+DV+pek03cn64T0w3HLGeNtjJH/5sucVEJKUSUk86C7E5PhFIaSHZWpd/ll5rpmNel0f74IfN5gkaqR/3QZ68PKIvX+V2fJJp4d9JaNZgjhXE5ZD+sPg0QpRjEJdXaF9acOwyRGbWVV3+De6JQN4sLN8woPtykSHDHpTfoCm2ESoX+BFUBvAJ/qtoHnQFP54sMjFIEVj5PQzLiF4tuNi4kWwVvYfbkPupUU8DT3V4LwsR6Jr4WpB+fDaJYi/9b+niptFKl9o85pZ2K1p5GxNqIH5bpwRpJSRJEok1QfgzufhlPKG3s+P+q+EZRM2+RkAAAAAElFTkSuQmCC";
    },
    75264: function (e, t, a) {
      "use strict";
      e.exports = a.p + "img/no-data.be8895ee.png";
    },
    52413: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIgAAACICAMAAAALZFNgAAABnlBMVEUAAADa2tra2trZ2dnZ2dnb29va2trj4+PZ2dna2trZ2dna2tra2trZ2dna2tra2trZ2dna2trZ2dnc3Nzf39/d3d3b29vm5uba2trb29v///8AhdDZ2dmQwx8Ags8Agc4AhNAAf86MwRePwhz9/v6Nwhn8/fzv9/zy+f0ynNnh8frO6PYNitIJiNEGh9Eek9URjNPr6+vc3Nz4+Pjs9vyLyOoakNT5/P7l8/o/o9w8odve7/kjldbn9PuZzuxwuuVfs+FRq99DpdwtmtgomNe83/P7/f/0+v2s2PDv7+91veZbsOHf39/H5fXD4vR6wOY3n9qnz02HxulmteNUrd/u9t1Ip92cyjeYyDD5+fn8/fjV6/j5/PO/4fOg0e7y+OUUjtOVxij2+/7a7fnS6vey2vGDxOj2+uyQyuqSxSPp9fu33fKp1u/P5Z6r0lal1O+UzOzp89Lf7r7M45e+3Hu112qx1WH19fXz8/Ps7Ozm5ubh4eFMqd7b29vm8c252XKgzD9+wefX6q7B3oLj8MbT56bE4IhruOTa67XI4ZFGVob/AAAAGnRSTlMAYPrst1tEE/Lu18aSjotsUUw2JBgPDgphYtoyjQMAAAsYSURBVHjaxNbtbhJBFMbx6Sy7vFOgQNuzTwZINqMpqXZ2QzVYaRpjdHWjieHLxsRvTXoHvMm9u1pCidJWpsD8ruCf3ZNzhj0kXXXK9t5G2GWnmmYaGpVi3sKGWflipcHWcGinODCLJuFQerQRnhyGk2gG8JR9yP5PrZQBIhVI2jgZqAjIlGrscekCh68C2ppA+eCFR+flyIIfStoqGfqwjthD6ilgLGnr5BhI1dm9DnKYxrQT8RS5A3YPJwtFO6OQddhK+xwj2qER+P7KDvgB7VTgY0WJw/U79Eu488+cZhHQzgXI/jWx9RxGZMAIuTpbloIiIxRSbMkxpmTIFMdL98VCTIbEsO7uTgFjMmaMwuLuc1+SMdLntXlICSEZFKI0f49lfEkGST9z+2azocgoBXu+Q2IyKr7dJQ0eeWSUF/FGElKBIsMUKklIEQEZFqCYhORnkgyTs3wSYkX0BM/fvP9x863bv/7+jPRFVnJnMCFdJ/3P707dlki4Ly4G/bekaYI0q+qu1VfXgzPRFi13TjTF+acT3eVaZQ6GpONjz20uIhYt590PpGEIh5WhM6udq5ZwVxCi90VnWlFmNrz1/8rNmWgtfYe2SLSbf9LE6df1x9aDzfZA63o9EOLuE7gXV5fdfr97+fOl+7ul1ex1aF3Y0wjp/OK1zJrSCKIo/D8yxe1lmMggyzwIymJAQKSgkC0xFCCyGJC4J+CTFTXGLP863Q10DyR5Ycl90Wlnqj7vPefcThKFEY0dygZs7f/wc0Swmv8DJNOatgOj1M3WXLMCUSZhwDHXukGcPd+UAzwFiaFqN+sFDUPCvV4QV0WqFJn/8MexCeyvyc11guwcTTkwxGU75msrx96C4P76QOrmVKbgK6fV+Ua+2csWAh9Ot8fPaT4/sD6sC+TYL+XRyqjjfCWlIQBAyFN8qo/PmhYwDWXWA5KxphwolZen3ZwPqXkRT7wuoRnJOkDeeCVHOCJPr4OzGweTVkAM6DSFGMmHlYM4e1jOZU/KdLugwZ/rZk9YN2IyEmt/xSDpmGp/5UCKNGdvBxBW/DWSOhQWCwPzzuZKQQ7ikgMX5JKMhJANAydjZzfZsIcnq3Utsi1ENEhFVgiy8RZJ296onZMCxYGCTdEo52bMAxr2lfnDxxBoKLSxMpCPR0Sm+rU83Q/aOMA8VYAhwBhiaf5lAjQSd64IZEdOAFrKBReWneNox74HshrWUPxATAcwlFcDspuQHLbUbnoVB4aca87qbDxIHLqTgL3nqwBxJeRc/CrGAj6sOHA2Pf/VOc+zt5yk7gfwR1YAsh1HE46odKKzAIoDvEq/qk6TiAUO1+mhBei+s4LRuI4ECSTrki1m57DsOd44OXk98XaRk7i4mnxSJkuKtciGQ8zIbKjIeR3LF2s/R++r1cfn2/FnCcKmwxVbBuw5XA6kURuHNSFht+wQCxVZKKlse3ulU13XDdp+7otrCWslivOhVADMjaVAPg/FD/fe3q689dwTxUFC6kb4s0od49Jp6Z3IQZY/8CPNBQ8kuwxIrURfxup0SjPbYh0jtf5eXQ4Mhyz6+E2Q3BOMnnhPo8i7vwTIu4He/jarl7CNAyodifxd1x22Mtovk55gfMZj2EtM1xIdGVHj/Tvbgbto51Dx0XiggkOV7vjl5INMEOy7YL+cAfSW0MjJo2GU+n/lAC0gz/t31DFfujGsib2HwGKWceZIq7uEfT8NdHrX+BuH742aYInOIFBWrEF01OCiKiIU7TIik1QWBdnmGjQc9KEmHjsJojg8F/K1L+/prDxGl5cP3EL0rs/xTUBhZt68N9lZEKTJMv31A3XQoVNYR91aoXWumlY17By0dCu6NGKn9OqEX69TgOJMTgH/xoIgT+EDpsMr6jCex/a98MBkDas4/dq2y1R0QdRr7iNa4iSbfoAAa3BlZ0GQMinw/+3RYCSTpRqEuTV86ZjlGDVUGjqmJMcW4lcBt2tBkDOiZbgGqrrsST4K2L6G5+KDMqeoehlMSa594O8uHmi7KRLcFNZhJMPxVu0WfepWWBsas479Ll5Sqd82JiQ9QInOgiAiD5G5xXUw0KV3XHkpucaIzmbYZ/WpEjK96jN95AAKSwTa72bOrTmJGIrjfgzdzJwkQGUXWuChgFxbLooDI9SCxRkUsQjSOlq8PnW8z6jf2mR3m7PL0Jdd0OSR6XR+m5z8z8nJOekBdPK2JUgSXP51MhY9e41h/xXtT0kihWjfQm8TAOS0TmGuDO/jS5/qvlmRj+8Ynlmpo9GVyLhClMzxZiW4sk7TkLpQJEIWrpPTncfv8DxhW3TXQyI33X3ClwFBzITYsHs08xQ3o/KAb7/6OCLDz5imSIOtNa/cvxQkUblqPX4cEOROPy/0ECCdNK7s5Otnd+2Hfjn9ij76aQ68XkBu/53omZivVvFbQJB4WujhvUMKzakrC8IS/jwS5vH+uZfDt2avJqDC+2rMtdioHU0kxwFBTht7DwROkYKVcNRcTHLk8cOHw511so5ewB38SjrePY9G3oitkw9qrH1unQuDLVN6VFH+LbqDGBh4uKOaQg56lFAOSXzAhxCh4nTCOzHniFQ4R4+/JhRzR5b4OdDvCFfwPYSgzQEWzhGJ1/dx0/qDU8zmtIGt5zBiHyLR4aPgIKbFbT1cMMZP4mvkNOKRj9O+l6Po8/kymjh7GwQEvU25JEMTyvhlXMXruG3xn+/XqIej4KgoHkWeDR/eDgFitDnUTTHrv4C4c2K8fu6G7GIr4GwnCt6D1+W+EqNaLeFs4t9GGJC4BdCX835ICT3Zd7Ty01lEjJ3hnye+078adGAqviLn1nQT+ZHurnOWbw1ACMMdV7bff/n44/vL1aS0StO3VL5PJs350Z3wIPIs7xyRzBqIrVC6NimNHAdKuEYN+3d6Ym4A5PSSwqQrV6kGePr3jaU3j8W+xdANu7/Tw3xoEHmCBkiP7IQEEEirgwTKB2PIkcp63bASezM8iAwFGDQSkqQj8+vVFa3p+PJY4zX5T1qvhFwaNBMoVJxkEWGkbfrvkghyZPAAOJsojkJIY0WBPuQE6uduTl5AJT1RIXL48p8Xyg3zk/ON5eLjBUrA8XvHKSaW5yBpW2RrnKMejiYCLlOgRCW+wduJUhMId2T7IgOE0d1ie7k4aDAgHlkvYf6TMY+obA5EBuFAwHFk3Sa3L6vEAOJNP6svbyn3Z+fkNwkiz69AqFVycnsAZGUA6eXR/alokc1jG79Km8n8etPWs3x2wv0XaDR3gctYpBi1buVycRdUfnd0uMtx+mmqM0UZa1JPUnrTIEiScT999M3apfYtK2n2H6wrHZDQ2wExZhlBkpq75pd/Mcv22vPxg7hH7o/VtuXWyNgCCKo2g871l/F494d3SdsAMZIy/gHrmjnvWhSTweZ2yzYSdWAE9tqVNdPRU6ou1i+27UIW84BJZS1nKysYyyZl3tKBbYJgAQIBSP+6q2wl3j0oo8hxrB3ZKoiRLMpvB0rSl06ZU61MqMIAGNwxAoAEKf+K9/ZgpfALXU5mkQ9S/hWwIK5bhPUFcayWDFYQF7REsJXN0VUURknxvhGwRDB40WSinQNkYcAhM5jlAxdNhikjrVQH5RQBMRjZa3SqCSNEGWnIwtr4aFbNHi/Gd0umEaqwVqdSY22Kr7UpR9emQF+blgV9mji0aWvRptFHn9YnbZrB9GmPu3HzfzYM3tSxhVKfplJt2mztxuN/aLDYeKxvK7Y+zen6tOvr84CBPk86iHFLj0cuNHr2Q5+HUDR6Gkajx3L+x/NBfwFURAUSBRt35wAAAABJRU5ErkJggg==";
    },
    7615: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAn5JREFUSEu9lj9oFFEQxr/vCQkkCDlOQUhSpJCQwlZMQgxk7y6K4iHEK8RG0E4FC60strAxjaB2CjZicQpyQdHc7gY05A+2FhJSKMSgoMcWkmACvk9euAsXNcldit1ii91585v53sx7Q+zySOLU1NSQpFOS+kkelpRyy0jGkhZJzpF8NTIyMk1SO7nkTj/DMBwDcFtS726BVQNYAHArk8k8387+v8DJyckeY8xTAMeqC5cAlFwWJD9UKpXv7ns6nT4o6YjLHkAeQHfVft5ae350dPTT3+B/gOVyeZiki/AAyWWSfqVSeVwoFH7vlGWxWNyXTqcvSvIldQL4IWksl8u9rV+3BViFlQG0AJhYXV29kM/nfzYiZ82mVCrtb2trewLgDIB1Sbl66CawKuN7l5mke7Ozs9d937fNwGq2vu+bgYGBuySvuUyttUdr8m4CgyCYq+7ZxMzMzNm9wuqhg4ODL6qZzmez2f6NwnIvV42Snrk9W1lZ6WtWxu1UcPK2t7d/dHtK8pyrXro+i6LIfew1xlz2PO/RXmTcbk0URZestQ9JLnie1+dgx621rpKW4jju2a0amw3GVW8qlXLt0W2MGWYQBOMAbgB4kM1mrzbrsBH7IAjuA7hCcpxhGL6TNETyZCaTedOIg2ZtwjA8Iek1yWkH/CrpkDGmy/O85WadNWIfRVGntfYLyW9O0l8AWuM4bi0UCuuNOGjWplgstqRSqTUAa8kDE5c0yaIBsFE0dyTdTKwtkmj8jo6OzyS7Nho/8aMt8cO71lOJXk8OmvgF7KCJjhg1aRMdomrQRMfE+oM5sUG4Hlob9a21p0m6wXjLqA9gUdK8MeZlI6P+H2NR3v3gRTwsAAAAAElFTkSuQmCC";
    },
    70415: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAAXNSR0IArs4c6QAAAsFJREFUSEu9lk1IVFEUx39noExr/Egd7EPSQmZGWocu1EUQhEIquqhVX1SEDW1qVbs2uQgapZ2omzYJU2ItWgQ5lENRBBE6FBUYWTgpFX6Mytx4c2f0Oc7Hs5F5y/vOOb/z/vd/3z1CxkeJu5cGFM0RRb0INShKomnCrFJ8tAljCI/Hu/CDqHQlJd1Lp1d1CNwCnBn70gFBBTeCHhlKFZ8U6OxR1aK4D9RZBCWGBZRwKnhFviS+2AB0eVUTiiGEsv+E6TRFCKFjwiPPzXXWAaMweApszwq2lrwEHDNDV4FRGSO8yvrLEjtVhJSNI3F5V4EurxrLYs9SClKxC+61EKh1SL02tmFB7cYHWyTjapk9dhhsg8qi6FKniAwJKHF5Gd+E9S31tc8OA+2wv1CHL0UI5tlwi7tXNaoI65xkqWKaoMpCDdtr10HhFfA8Af8kTeL2qm4F17KFxPMPFGmYsXfGs7gCXSPwYhJE6BanV40KNGwFsLoYBtrAEYMtLMPlEQh8ix9N/OLqUVMoKszAgm1w97ju8uYzePcjczuHSqC/Dcp36tj5Zbg0DK+/m3KFH+LyqkUgz1zy6EHobdYrc0twYRjeTqWG1pRCfyuUFqzlXByGNxtzwkmBu/PBdxIcsW7TQZ1lGlaSr2F/w7rBFKqEk0pqJFYVw2B7emhtOfS1QvEODfsThvOP4P3PFGoYkqYzTTroYQf0nYDCGOz3Ipx7CB+mU0uvwC/uHnVbKa6nCksGvfMSrtaDPbbzswsaNh5Kb67osbBy8BOh5rIzC3DWB8FfmZ0sNpos/9qSQUPzcMYHn2Yyw4xpYMKDe1M/bzN0eg5O++DzrCUYCjqN0WPT11N5ATRWwehXmJ63BgMCEx7T9WSk5fwCNqA5HTHi4uR0iIpDczommm2Qs0F4vfdio36ElgjUJR31IYCNESuj/j/UZyM/IwPmwwAAAABJRU5ErkJggg==";
    },
    95738: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkBAMAAAATLoWrAAAAG1BMVEUAAACZmZmZmZmZmZmampqampqZmZmYmJiZmZmYaFSSAAAACHRSTlMARPb0PurnqXNoq9EAAABeSURBVCjPYxjMoFQAQjOGw4UyFCG0UBtcyLlJAKxIwwQuxGKhCFbU7MCArAyuCKEMoQihDK4IoQyuCKEMTRHQbItmAUJCCI2YxmM6Ar9TER7C9Da+wEEEIbaAHsQAAKTyFi9bBlAUAAAAAElFTkSuQmCC";
    },
    46924: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABICAYAAADs+TUPAAAAAXNSR0IArs4c6QAAARpJREFUWEftmbFuwzAMRB/loYv//ztNo0DdJhALumnhGrGlJOt50mKdeNSRJ8nePyM4/hYCD8MN/O44cAoegVvFbcCvFS8XfBxx6wIAN9sBJGiCHwG84WP+dwZgxkdU5gAvhSlgXlea0dht1VuA8gO6RtADACwGU4V5T1FNoFsUr1EEUwTzH0W/dO0iKIHXjOALvw4PRLBNbNJTcuJtwl9N8hFFCZxR3UvyUPFLbw5yIowJmP9t0w1Faz6Snu02fQRAOjgtFdJBs9hJB02KVvWqH5z2ZPWDHlehfnBYruWLmtYxnZ18UV+51vngrFzLFzV3kXxRkyL5ojZF8kXyRbovWpAOpAPpQDrou33XOVnn5PUNR+8HT78ffAPfYhPwwbbUaAAAAABJRU5ErkJggg==";
    },
    3267: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABICAYAAADs+TUPAAAAAXNSR0IArs4c6QAAARtJREFUWEftWcsOgzAMc9hhF/7/Owk7bNJQMwU6tUOUtuxqLuUhNcRuiGvkYU9D+XgBpgZRHyWO+bXfC+uz7fmCoIKbDnjriFHlegCJk5oGfM99DLq0BhDI0xBmf+MBmAyYU0bHAVIGdx2BegYCTCFOfAzRbwbdEKUAUAHUYIqMkw1/z2aI8HRz4JMiI1likO/EvyQ7wZ5FM8lHEKWVs/GQk9wNkZMKyEqwQ7RftvsAaRU1ksw6qFYy6+ASRKyDvP2cNBz2gw2oF/tBtdDYD04hoi5q1KbURdwfFLVpo3SkLqp+rrk/qEJU3oBQF1EX9bgt3CcXHS/qIuqiaKWVXMfGpk+/qNrRqIsuQUS/iH5R3y8W+kXVQvvXL/oAPiTC4cstZoQAAAAASUVORK5CYII=";
    },
    81896: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABICAYAAADs+TUPAAAAAXNSR0IArs4c6QAAARhJREFUWEftWMsOgzAMc+CwC///nYTLkCY1U18MWLsFzuZSJKSaOE0dR2ydDf1nhUEh0G1FfDeFDAoLn28DFEEUY1lfg2KaVG4BJEApm4cMfgZ4DAr8AxA8EbCkCERmmC3oRZAiFUWAYhSFCwBYAZkBW44Uxc0iTYW6fQQVwE3RF4CVfHRycBlgn2TEv67cn4AqRZeT3KLIk2Q3RfnPcoLjxt5j6k4y6+BvJbMOblHEOtjpT1twPBS5Kpl6cFmTqQeN9oh9kaOzox5QD7YGmP6A/qDnM9sWyiP69Af0yfVUNU4RffKx5ErbQp/cu4noD+gPfo41XS4zDgU5L7rV/CbaODfN9xP7IofLbBWap3V0VTL1gHrg0YM3/ZFW4egzSGEAAAAASUVORK5CYII=";
    },
    59638: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABICAYAAADs+TUPAAAAAXNSR0IArs4c6QAAAO9JREFUWEftWMsOhCAMnHr2/79TvKwXZdNFFAy4FeJtTEh8JIyd0teId86jfi0AXLa8D88i53u917Wu57dhcBhHJ48A4uZXgG3LQRXMBCDygffzbsEEYEbNAv37aJUZAFggMh0gNQsiPd0ASs1rPogbK7fK+dXJ3RSl9JROUTNAOKbBwTWKmk+ROplx8DeSGQdmihgHlZqTBxrrQYGmvOCwHhQpYj24zUXsix71puyLTOn61VyUbs75IPEH64F5yuR8UIlj1gPWg2PE5ZxMvcgmCrIvYl/0U327ZU3qpreTPvUiU6BRL6Je1JaLOvWiL0b+G9Ihv4m3AAAAAElFTkSuQmCC";
    },
    32521: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABICAYAAADs+TUPAAAAAXNSR0IArs4c6QAAARlJREFUWEftmc2OgzAMhL9Ei3b3gnn/5+TSQ+OV+emiNjQRvQ4XUIRwZmzHY5Pc/XsGG27YPWN+xzxjKWGU9e7x7JiDJceINda15T344eRKu4Fyw746DaTMWApTTowO00cGYvfLLisIAk0Yc+f3PYIZG4Y6RWHAHcsbLUeK9ucuBFUfsH78HYLwR5eBMx+cUhSGw+m9FJXhyclli5YnHxwiZ8SZ+hDM2IuBLUwXBIfQPPAeCPqjSHmgPHg9KpQHqgd7XqwVTfWgp2SqHkgXSRdVZIt00ZYY6g+WdqpLvqs/aGpT9QeXC4765OZZpD75QZH65OZZpHlRkyL1B5eP69pgVnPT/9m15qbAY1YhXXQ50aSLpIua/w/+ACpP5p326+2RAAAAAElFTkSuQmCC";
    },
    42139: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABICAYAAADs+TUPAAAAAXNSR0IArs4c6QAAASVJREFUWEftWUESgjAM3HZw1Avh/+/k4gHixBIsrWhRj8ulw6VJNkm72QZVPY8YZcZJFJN0iKJQUYTHGosVy39AEEDF/gFcsPOF3ECHSTQzEDNDtpFvGoB+BoYI9AoMfzSQPLbIkkGVgNgr9NoUQQlRHoFDVRpohAgy4yY1RMlby4fhbR5vcwDDvz0HdQRu4AnJTxClCrJEJ6/rJOcRxB6Yh0aIUpnmEHnFeLl6UnOIrJoOVRH74FUvbDqZffARIvZBA0S8D2qQlkbjffAFq+B94PV0kHiRFxXk19lcThXJizgfVOc1edGxEYq8iLxoHcDL07Vh0icvIi9a5RsXRagXrWoL9SJgl/xyPuB8sMjM1E0r9X0rLVM3fatd8/1gkff5fgDcAeN6tNQC20L+AAAAAElFTkSuQmCC";
    },
    59780: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABICAYAAADs+TUPAAAAAXNSR0IArs4c6QAAARdJREFUWEftWcsKg0AMnCxI68X4/3/Yu5ceNGUfwmJXo8VTGWGJKBjzmMwmK2b2ACbFe1EEU8zIcoFC4goKWxQiCoMCyDK+WyXwxM4lScE0KbpKgVn5ePUhk/wsKhAZYDYCMgBRegqOLFj/cs+CgAGG/poFtYs8Bdkqx0WuBTEOxW11DOJ9XicVzKYImyBbKAEtgd4G+XYXrZkUZMBiYwm8l0UvRde303Qbg1VB8v0dWUQcNJFMHFR1o13sjlxEHCTCIR98ZRH5wGW0iXxwlvRbOztv23I76f+0dSQOiIPUaLA/2O3REpLZH5AP3FLhVtPUfLc7ffIB2CdzXgTigDjInT7nppyb5kE456Y8P7h0AsK56V/NTT9vpV41vDvlZAAAAABJRU5ErkJggg==";
    },
    50932: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAABICAYAAADs+TUPAAAAAXNSR0IArs4c6QAAAOxJREFUWEftmEEPgyAMhV/1sO0i/v/f6dkuhHQQpgZNyVzyTAjRA0hb+rVPVPWBZQlY1wDVACDN45jf7Vuc4xBJcx5P7DxyeoO0+ARghsgE1RmA+wb579Mmr/MniMcfhryQma+7ibb9cDcTWQSVZqlNlB0czeh4gtIHXaKou5N5D5py0bcfHKOoTnSXUgXvQZFayQPjhWOYkgdNqcJuM3nwqfTKys4l2RngWRcB2E525AF50LeFIg/Ig7qdvVp4sU8+EENckEkekAfkQVYcqRftlo5Hwiz1oiboUy9qlvfZJ7NPjmj+Uen4T3XRG6Yuv4WN2DUkAAAAAElFTkSuQmCC";
    },
    35751: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAaVBMVEUAAACampqampqqqqqZmZmampqampqampqcnJyZmZmampqampqampqampqcnJyfn5+hoaGampqZmZmampqZmZmdnZ2enp6ZmZmampqbm5ubm5ucnJyZmZmZmZmZmZmampqampqampqZmZmyFQ55AAAAInRSTlMA+fMF5saVaSbUt6ydUCwPCe7DfjscFtiCXD833NfOjYZ5q/y85gAAAMZJREFUWMPtltcVgzAQBIXIWZhkjOP1X6S9Ndx+gN9NAfOlWZ0zDMM4C0Xqm8AQpSKSMURefuwEUQVRGetFXQTT6PRcIYoKvSisMF2cnpuAnGBqIBoWvahPYKqdnlZASzDVECW9XjR7IZWSC5gY7f5xKfGDVcpEKyWDqGQ9geRAj7IiZbKRwl0G0pTUpHFrBWykjaxIq+3nw/wj4U7q9UVakD2C6KMfohKep35lR3iijjTWb1L0ayCdftORjlGcx7EzDMM4D18dbxo5KKUw8AAAAABJRU5ErkJggg==";
    },
    86644: function (e) {
      "use strict";
      e.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAMAAADUMSJqAAABF1BMVEUAAAAAAAAAAAAAAAAEBAQJCQn9/f36+vr29vb////////////////////+/v7+/v78/Pz+/v75+fn8/Pzy8vLl5eX29vaxsbHi4uJ8fHyAgID29vbs7OyZmZng4ODY2Ni0tLT6+vr39/f29vb9/f3y8vL7+/vo6Oj4+Pjd3d319fXDw8O8vLzr6+vo6Oi+vr5dXV38/Pz+/v7X19f////Ey9vM0uDN1OHV2+bK0N7R1+PGzdzT2uXK0d/CydnQ1uLHzt3S2eTX3efDytrIz938/P3U2+XP1eLY3ujT2OTW3ef4+fva3+jDytnj5+7b4On9/v7z9fjo7PH19vng5Oz6+vzr7vPe4+vc4ery8/bl6O/w8vbv8vaMcOD/AAAANHRSTlMABwoNEhDTwqX59fDv7ePgzMGtn3hpYi8kHQafUSgbEQ3FtaqlmJN2b15VPTUzKyMasbBZS6EsIwAABulJREFUaN7dmWlbGjEQx4tytWA9UNGqra31qtZeIMsNy+1SFhABrd//c3RmIMe4LCj0Vf9PHjeZmfwyz5DEVV7959rZ34ys+1dXXr9eWfWvRzb3d/4R+P125G3MobeR7feLkj9sr8dctb79YQH0VeRNbKreRK7mRH/daAtI+/ax+9AbDJtNe9BrdR9vlWfj6zyl/izm3/ZbdYda/Vvh//zS4r87C8VId/1h3UWD/t0oJnT27kVbby1Gslpm3YRWr2tPEPYpf2sUt/aCrfklPEZzGO/jU+LDX55bkhOKr3TNZ6lbofCTZ5Xm8CcF39sMcWPeQON9wzSMG+OmeU8Tfh4+49is0w7rGiSYLyHQ0CL70MaLdNt0pj7MZPtpjwxgIkkB1VjBhX9A+8Y/g35IeVt1Q0lCpqlpUe5TK/PuB50aYL9UJp2pH9M+1RNiG0a1alQNaFWQ7Ksn941F9JMp+5tqYqoJDigpY2Qy1YwYC5tBlXHd7zthqjdORhEAfpDACCwcMzs8pK2O9PCOS8HXcA8OcYqcSOIgthCzD3FHrk0u+1kM9JBZQA9IOJt4x4bwXBYzRWgqno+ddt7HsxqacAN78P6umBhEwfwpxOwoHmNW8H73OH/vUFGKTNVWtyXBHE59cFe5nQrz1ZH4Bu7wVKqYGgU3io3GEA+1Zcsx/AC3jLEtvCiGZEeRD3f7xtPUr/CTHowgqQYBqsAGVWwwgJl8ILGIDSVAehXHUgPccVdPEo+MEgeuzLAFphE9RQuSGuN+A9mkFtqUH1OP8NQP8R2iR24J6cYUHcUgxCZ1pZ3UwzeOQ5b4NlZXgGWYpDeVlbMpJS4LbNseHR6gFLiKliu9qdhWI8XVBWNAh3/DMBNd+VSeBJ1UvcLo6CN7vqk7yCYEXRPN355U5VZAJSTFINLOzWRjSd3yuniCWBUGJ7EU6+5GkoBTXYIaHN+RmyzIDcRNk+fgG7ZHsncwUHlr+RoJOvn6E3qNGSgGGj2lMGLHI+D7MOqMgIlaIpFPaBM4nQ9VEtDU/A449yV8E0Z9dMkAEnSgMRzP20V98G5K+B6eYoQJMOvrQK1rJpT4HLw39jz6ERomXGUqJGO7ydaOkcfjh5GRmEnnbHcZ+Pbl8YzgS6swKiYS14lraNPpnC3m8H4DIlaXBHwFRikZAGITUEBnbAlScBWfh5AVCX8NI4SQ5CQmpCv29VQlIOa1A860IJyVpTY13lDs2fQaK8sq1jybvc46A8EIQjajG2Bn8fo4xT5Q3IoZdAoYl8ib0WWsmKeeDdyKEo6HqJl1lWRzuquaeIgkHI9/L5tNZpPQRIgcVycff8MtPtvD4y/heHF1yeEUYxuGNqiqGJ5YFy8uAacr9145oaPE2HxYTeIcEa/m39OVKy6XKIYmmUQwgyGIGyYKI6LyVlzGX3PGhDCGypBlNt3AX3PLEr4UxAudPOVkGZqIy3CQ05jhc6iP13lwScG3YNzRA6hf1jGNMorsRd1MsWyBDti3NDi9FOXBC1LBDT3Fstuimp3m5+mlCOCy6AGsS6FcgFYWSlo8b9IoRsvdSsJY92FVAlhyVhdLBKCg09TYBNAW1+hNsqnFLVYVhO/iK3R9xBWglsYWkouokrUKTHV8hd5FuKpLED9SHmZzNpei29zewb1CVVGpX7bBaKbThXQBWhqVtMZsHCs79RXdyhZ0vwmm9uUShy9vYOoyiJ4Ni/6WEUCUDkpZyM6kmTDxjWWAM/oFpjHgkclmqw4wNxWaLbvMTQOkXCCbp35EF0x6IdG1ckSJc/pBCBz9dDwNLc4kbPw5ydcHROhAsVXqpzHQ0AnT5ABLkW2IhFOROKP76F8i+fjcytO/RHyKreCe5WiYjvO8bNq64eiyR8B5Yc5jdJTmY8PxAZ2zorDCHKP/T7o0G1WKl6Bp/fgfnHvMisIL4/tE9AJNhCafUsrOF0kT+5OPF4UX5vtHqkyyxOWAP1WZavLxOxXFlb7rpwuj9rv0G1oJGn/mSrnc7xz1QWKcoGvIv0vsaXTKvW3n9MliAQaFNn7abcpbsd0rA3UH9Qs5pyRQV6Efo3qzmrjRvccUfGfnniX7jsKPvcSeTT8PU3ynMRvd6FBo+FywZ9J90bXYCF+djq4CGrUW9Un2bLr3NBQjWb2kGznZs0YxoVOvZM+mY2kOjmJj3fdqTnKtdy/8RwdYEsGeTafkL9TXZ5XHBzuVLMRzuXghmbIfHivq67MLTJvYL8NfBmd98Re8lOiX0RG/uxVwRwe2dhEt2HPgvQdbwUlftga3DrwMPQ8e+d7or829gPiaOLC3+SvqRfL8aMKP+bAAl29EFuhF+LAAykei7hIjL8jHJaRw5CQvvsKY+9/rLzjeB+XcUJptAAAAAElFTkSuQmCC";
    },
    42480: function () {},
  },
]);
