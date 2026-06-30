(window.webpackJsonp = window.webpackJsonp || []).push([
  ["chunk-86d77ece"],
  {
    "0fc8": function (e, t, i) {},
    1: function (e, t) {},
    1132: function (e, t, i) {
      "use strict";
      i("73d0");
    },
    1274: function (e, t, i) {
      "use strict";
      i.r(t);
      var s = i("bc3a"),
        o = i.n(s),
        n = i("b775");
      var a = i("fa7d");
      function r(e) {
        let t = Object(a.o)();
        encodeURIComponent(location.href.split("#")[0]);
        (function (e) {
          let t;
          return (
            (t =
              "staging" == window.VUE_APP_CURRENTMODE
                ? "/coc3-user-center/open/api/wechat-mp/getSignatureTest"
                : "/coc3-user-center/open/api/wechat-mp/getSignature"),
            Object(n.a)({ url: t, method: "post", data: e })
          );
        })({
          url: (t.ios && window.marketOriginUrl) || location.href.split("#")[0],
        }).then((t) => {
          if ("0" == t.code) {
            var i = t.data.timestamp,
              s = t.data.nonceStr,
              o = t.data.signature,
              n = t.data.appId;
            wx.config({
              debug: !1,
              appId: n,
              timestamp: i,
              nonceStr: s,
              signature: o,
              jsApiList: [
                "updateAppMessageShareData",
                "updateTimelineShareData",
                "getLocation",
              ],
              openTagList: ["wx-open-subscribe", "wx-open-launch-weapp"],
            }),
              wx.ready(function () {
                window.ydConsole("通过ready接口处理成功验证"),
                  document.addEventListener(
                    "WeixinOpenTagsError",
                    function (e) {
                      window.ydConsoleErr(
                        "无法使用开放标签的错误原因:",
                        e.detail.errMsg
                      );
                    }
                  ),
                  wx.checkJsApi({
                    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"],
                    openTagList: ["wx-open-subscribe", "wx-open-launch-weapp"],
                    success: function (e) {
                      window.ydConsole(e, "微信api校验");
                    },
                  }),
                  wx.ready(function () {
                    wx.onMenuShareTimeline({
                      title: e.title,
                      link: e.link,
                      imgUrl: e.imgUrl,
                      success: function () {
                        e && e.wxShareSuccess && e.wxShareSuccess();
                      },
                    }),
                      wx.onMenuShareAppMessage({
                        title: e.title,
                        desc: e.desc,
                        link: e.link,
                        imgUrl: e.imgUrl,
                        type: "",
                        dataUrl: "",
                        success: function () {
                          e && e.wxShareSuccess && e.wxShareSuccess();
                        },
                      });
                  });
              }),
              wx.error(function (e) {
                window.ydConsole("wx分享失败", e);
              });
          } else window.ydConsole(data.message);
        });
      }
      var l = i("964a"),
        c = i("e65e"),
        d = i("1e4f"),
        h = i("bb7d");
      function p(e) {
        return Object(a.D)(window.location.href) === e ? 2500 : 1200;
      }
      function u(e = {}, t = {}) {
        let i = "",
          s = "";
        return (
          "sandbox" === window.VUE_APP_CURRENTMODE
            ? ((i = "/coc3-recommend/preference/strategyCenterShuntRule"),
              (s = "testWJKwlcjhdym1"))
            : "staging" === window.VUE_APP_CURRENTMODE
            ? ((i =
                "https://dev.coc.10086.cn/staging-coc3/coc3-recommend/preference/strategyCenterShuntRule"),
              (s = "testWJKwlcjhdym1"))
            : "production" === window.VUE_APP_CURRENTMODE &&
              ((i =
                "https://dev.coc.10086.cn/coc3/coc3-recommend/preference/strategyCenterShuntRule"),
              (s = "wlhkjxmh")),
          Object(h.a)({
            headers: e,
            url: i,
            method: "post",
            timeout: p(s),
            data: t,
          })
        );
      }
      var g = i("2b0e");
      let m,
        f,
        y,
        w = Object(a.m)(),
        v =
          "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/canvas/rightsmarket-h5-canvas/production/build-h5cdn";
      function C(e, t) {
        let i = window.AllComps ? Object.keys(window.AllComps) : [],
          s = e.filter(
            (t, s) =>
              !i.includes(t.moduleId) &&
              !e.find((e, i) => s < i && t.moduleId == e.moduleId)
          ),
          o = "production";
        ("h5cdn" != o && "pccdn" != o) || (o = w.typeCon);
        let n = [];
        window.timestamp = new Date().valueOf();
        let a,
          r,
          l = localStorage.getItem("application_h5")
            ? JSON.parse(localStorage.getItem("application_h5"))
            : null;
        try {
          a = l.version ? JSON.parse(l.version) : {};
        } catch {
          a = {};
        }
        try {
          r = l.moduleVersion ? JSON.parse(l.moduleVersion) : {};
        } catch {
          r = {};
        }
        for (let e in r) r[e] = new Date(r[e]).getTime();
        if (
          (s.forEach((e) => {
            let t = `${v}/${e.moduleId}/h5webcomponents.umd.min.js?timestamp=${window.timestamp}`,
              i = [
                `${v}/${e.moduleId}/h5webcomponents.css?timestamp=${window.timestamp}`,
              ];
            "staging" == o
              ? ((t = `${v}/${e.moduleId}/h5webcomponents.umd.min.js?timestamp=${window.timestamp}`),
                (i = [
                  `${v}/${e.moduleId}/h5webcomponents.css?timestamp=${window.timestamp}`,
                ]))
              : a.hasOwnProperty(e.moduleId)
              ? ((t = `${v}/${e.moduleId}/${
                  a[e.moduleId]
                }/h5webcomponents.umd.min.js?timestamp=${
                  r[`"${e.moduleId}"`]
                }`),
                (i = [
                  `${v}/${e.moduleId}/${
                    a[e.moduleId]
                  }/h5webcomponents.css?timestamp=${r[`"${e.moduleId}"`]}`,
                ]))
              : r.hasOwnProperty(`"${e.moduleId}"`)
              ? ((t = `${v}/${
                  e.moduleId
                }/h5webcomponents.umd.min.js?timestamp=${
                  r[`"${e.moduleId}"`]
                }`),
                (i = [
                  `${v}/${e.moduleId}/h5webcomponents.css?timestamp=${
                    r[`"${e.moduleId}"`]
                  }`,
                ]))
              : ((t = `${v}/${e.moduleId}/h5webcomponents.umd.min.js?timestamp=${window.timestamp}`),
                (i = [
                  `${v}/${e.moduleId}/h5webcomponents.css?timestamp=${window.timestamp}`,
                ])),
              n.push({ moduleName: { entry: t } });
          }),
          t)
        ) {
          let e = () => {
            window.app.$mount(), t && t();
          };
          if (y) {
            let e = new Set(y.map((e) => e.moduleName.entry.split("?")[0]));
            (n = n.filter((t) => !e.has(t.moduleName.entry.split("?")[0]))),
              (y = "");
          }
          window.app
            .$moduleLoader(n)
            .then(() => {
              s.forEach((e) => {
                g.default.component(
                  e.moduleId,
                  () =>
                    window.AllComps &&
                    window.AllComps[e.moduleId] &&
                    window.AllComps[e.moduleId].comp
                );
              }),
                m ? (f = e) : e();
            })
            .catch((e) => {
              window.ydConsoleErr("e: ", e);
            });
        } else
          (m = "loading"),
            (y = n),
            window.app
              .$moduleLoader(n)
              .then(() => {
                s.forEach((e) => {
                  g.default.component(
                    e.moduleId,
                    () =>
                      window.AllComps &&
                      window.AllComps[e.moduleId] &&
                      window.AllComps[e.moduleId].comp
                  );
                }),
                  (m = ""),
                  f && (f(), (f = ""));
              })
              .catch((e) => {
                window.ydConsoleErr("e: ", e);
              });
      }
      -1 !== location.href.indexOf("10086.cn") &&
        (v =
          -1 !== location.href.indexOf("sandbox")
            ? `https://sandbox.open.10086.cn/38857911/static/category/cdn-files/cdn-online/fixedPath/canvas/${w.SITE_NAME}/sandbox/build-h5cdn`
            : -1 !== location.href.indexOf("staging-coc3")
            ? `https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/canvas/${w.SITE_NAME}/staging/build-h5cdn`
            : `https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/canvas/${w.SITE_NAME}/production/build-h5cdn`);
      var b = {
          name: "OfflineComp",
          title: "上下线",
          preview: "preview-offline.png",
          components: {},
          props: {
            info: { type: Object, default: () => ({}) },
            jumpTo: { type: Function },
          },
          watch: {
            info: {
              handler(e) {
                JSON.stringify(e) != JSON.stringify(this.gotInfo) &&
                  (this.gotInfo = e);
              },
              deep: !0,
              immediate: !0,
            },
          },
          mixins: [c.a],
          data: () => ({ preview: "preview-offline.png" }),
          mounted() {
            this.showPrivew || this.sendExposurVisit({ info: this.info });
          },
          methods: {
            gotoHome() {
              const e = l.a.getValue(l.a.CHANNEL_KEY),
                t = l.a.getValue(l.a.CHANNEL_VALUE) || "P00000011939";
              window.location.href = `${this.info.prefix}/${this.info.env}/${
                this.info.indexUrl
              }${t ? `?${e}=${t}` : ""}`;
            },
          },
        },
        S = (i("c2ab"), i("0c7c")),
        I = Object(S.a)(
          b,
          function () {
            var e = this,
              t = e._self._c;
            return t(
              "div",
              { staticClass: "comp-wrapper rightsOffline-comp-wrapper" },
              [
                -2 == e.info.timeValidCode
                  ? t("div", { staticClass: "popup" }, [
                      t("img", {
                        directives: [{ name: "webp", rawName: "v-webp" }],
                        staticClass: "btn-close",
                        attrs: {
                          src: "https://res.coc.10086.cn/res/cdn/coc1/2022/10/25/1584785097951784960/1666677185915_636987.png",
                          alt: "",
                        },
                        on: { click: e.gotoHome },
                      }),
                      t("img", {
                        directives: [{ name: "webp", rawName: "v-webp" }],
                        staticClass: "img-tips",
                        attrs: {
                          src: "https://res.coc.10086.cn/res/cdn/coc1/2022/11/07/1589528336643641344/1667808060844_199046.png",
                          alt: "",
                        },
                      }),
                      t("div", { staticClass: "txt" }, [
                        e._v("您好，活动已结束！"),
                      ]),
                      t(
                        "div",
                        { staticClass: "btn", on: { click: e.gotoHome } },
                        [e._v("我知道了")]
                      ),
                    ])
                  : e._e(),
                -1 == e.info.timeValidCode
                  ? t("div", { staticClass: "popup" }, [
                      t("img", {
                        directives: [{ name: "webp", rawName: "v-webp" }],
                        staticClass: "btn-close",
                        attrs: {
                          src: "https://res.coc.10086.cn/res/cdn/coc1/2022/10/25/1584785097951784960/1666677185915_636987.png",
                          alt: "",
                        },
                        on: { click: e.gotoHome },
                      }),
                      t("img", {
                        directives: [{ name: "webp", rawName: "v-webp" }],
                        staticClass: "img-tips",
                        attrs: {
                          src: "https://res.coc.10086.cn/res/cdn/coc1/2022/11/07/1589528336392044544/1667808060844_902947.png",
                          alt: "",
                        },
                      }),
                      t("div", { staticClass: "txt" }, [
                        e._v("您好，活动尚未开始！"),
                      ]),
                      t(
                        "div",
                        { staticClass: "btn", on: { click: e.gotoHome } },
                        [e._v("我知道了")]
                      ),
                    ])
                  : e._e(),
              ]
            );
          },
          [],
          !1,
          null,
          "20716ca5",
          null
        ).exports;
      let k = {
        home1: [
          {
            moduleId: "Rights-SkeletonComp",
            specify: JSON.stringify({
              type: "pure",
              style: {
                wrapper: { paddingTop: ".1rem", paddingBottom: 0 },
                typeWrapper: { margin: "0 .1rem" },
              },
            }),
          },
          {
            moduleId: "Rights-SkeletonComp",
            specify: JSON.stringify({
              type: "login",
              style: { wrapper: { paddingTop: 0, paddingBottom: 0 } },
            }),
          },
          {
            moduleId: "Rights-SkeletonComp",
            specify: JSON.stringify({
              type: "repeat",
              repeatItem: 1,
              repeatCol: 4,
              repeatNum: 12,
              style: {
                wrapper: { paddingTop: 0 },
                typeWrapper: {
                  borderTopLeftRadius: 0,
                  borderTopRightRadius: 0,
                },
              },
            }),
          },
          {
            moduleId: "Rights-SkeletonComp",
            specify: JSON.stringify({
              type: "repeat",
              repeatItem: 2,
              repeatCol: 5,
              repeatNum: 5,
              style: { itemWrapper: { height: "1.03rem" } },
            }),
          },
          {
            moduleId: "Rights-SkeletonComp",
            specify: JSON.stringify({
              type: "pure",
              style: {
                typeWrapper: { backgroundColor: "#eeeff3", height: "1rem" },
              },
            }),
          },
          {
            moduleId: "Rights-SkeletonComp",
            specify: JSON.stringify({ type: "tabbar" }),
          },
        ],
        home: [
          {
            moduleId: "Rights-Skeleton2Comp",
            specify: JSON.stringify({
              children: [
                {
                  children: [
                    {
                      type: "round",
                      children: [
                        {
                          type: "repeat",
                          style: {
                            width: ".55rem",
                            height: ".55rem",
                            backgroundColor: "#FFF",
                            borderRadius: "50%",
                            marginLeft: ".15rem",
                            marginTop: ".05rem",
                            marginRight: ".05rem",
                          },
                          layout: "column",
                          class: "light",
                        },
                        {
                          type: "rect",
                          children: [
                            {
                              type: "rect",
                              style: {
                                width: "1rem",
                                height: ".2rem",
                                backgroundColor: "#FFF",
                                borderRadius: "0.05rem",
                                marginTop: ".08rem",
                                marginBottom: ".07rem",
                              },
                              class: "light",
                              layout: "column",
                            },
                            {
                              type: "rect",
                              children: [
                                {
                                  type: "rect",
                                  style: {
                                    width: "1rem",
                                    height: ".2rem",
                                    backgroundColor: "#FFF",
                                    borderRadius: "0.1rem",
                                    marginRight: ".05rem",
                                  },
                                  class: "light",
                                },
                                {
                                  type: "rect",
                                  style: {
                                    width: ".71rem",
                                    height: ".2rem",
                                    backgroundColor: "#FFF",
                                    borderRadius: "0.1rem",
                                  },
                                  class: "light",
                                },
                              ],
                            },
                          ],
                          childrenStyle: { alignItems: "flex-start" },
                          layout: "column",
                          class: "light",
                        },
                      ],
                    },
                    {
                      type: "rect",
                      children: [
                        {
                          style: {
                            width: "2.3rem",
                            height: ".9rem",
                            backgroundColor: "#FFF",
                            borderRadius: ".1rem",
                            marginRight: ".05rem",
                            marginLeft: ".12rem",
                          },
                          class: "light",
                        },
                        {
                          style: {
                            width: "1.16rem",
                            height: ".9rem",
                            backgroundColor: "#FFF",
                            borderRadius: ".1rem",
                          },
                          class: "light",
                        },
                      ],
                      style: { marginTop: ".08rem" },
                      class: "light",
                    },
                  ],
                  style: { width: "3.75rem", height: "2.22rem" },
                  childrenStyle: {
                    marginTop: "-.64rem",
                    alignItems: "flex-start",
                  },
                  layout: "column",
                  class: "light",
                },
                {
                  children: [
                    {
                      children: [
                        {
                          children: [
                            {
                              type: "round",
                              style: {
                                width: ".45rem",
                                height: ".45rem",
                                paddingTop: "0",
                                backgroundColor: "#F4F6F8",
                              },
                            },
                            {
                              type: "rect",
                              style: {
                                width: ".48rem",
                                height: ".15rem",
                                backgroundColor: "#f4f6f8",
                                marginTop: ".07rem",
                              },
                            },
                          ],
                          layout: "column",
                        },
                      ],
                      repeatNum: 5,
                      class: "light",
                      style: {
                        width: "3.51rem",
                        padding: ".1rem .21rem .09rem",
                        boxSizing: "border-box",
                      },
                    },
                    {
                      type: "rect",
                      children: [
                        {
                          type: "rect",
                          children: [
                            {
                              style: {
                                width: ".09rem",
                                height: ".03rem",
                                backgroundColor: "#8867EE",
                                borderRadius: ".2rem",
                              },
                            },
                          ],
                        },
                      ],
                      style: {
                        width: ".18rem",
                        height: ".03rem",
                        backgroundColor: "#F3EAFF",
                        borderRadius: ".2rem",
                        marginBottom: ".07rem",
                      },
                      class: "light",
                    },
                  ],
                  style: {
                    backgroundColor: "white",
                    width: "3.51rem",
                    margin: "-.54rem auto 0",
                    borderRadius: ".1rem",
                  },
                  layout: "column",
                  class: "light",
                },
                {
                  children: [
                    {
                      style: {
                        backgroundColor: "white",
                        width: "1.5rem",
                        height: "1.15rem",
                        borderRadius: ".1rem",
                        marginRight: ".1rem",
                        marginLeft: ".13rem",
                      },
                    },
                    {
                      style: {
                        backgroundColor: "white",
                        width: ".9rem",
                        height: "1.15rem",
                        borderRadius: ".1rem",
                        marginRight: ".1rem",
                      },
                    },
                    {
                      style: {
                        backgroundColor: "white",
                        width: ".9rem",
                        height: "1.15rem",
                        borderRadius: ".1rem",
                        marginRight: ".1rem",
                      },
                    },
                  ],
                  style: { marginTop: ".1rem" },
                  class: "light",
                },
                {
                  type: "rect",
                  children: [
                    {
                      type: "rect",
                      children: [
                        {
                          type: "rect",
                          style: {
                            width: ".35rem",
                            height: ".2rem",
                            backgroundColor: "#EAEDEF",
                            borderRadius: ".05rem",
                          },
                        },
                      ],
                      repeatNum: 5,
                      style: {
                        width: "3.51rem",
                        padding: ".1rem .12rem .05rem",
                        justifyContent: "space-between",
                        boxSizing: "border-box",
                      },
                      class: "light",
                    },
                    {
                      style: {
                        marginLeft: ".195rem",
                        width: ".2rem",
                        height: ".03rem",
                        borderRadius: ".02rem",
                        backgroundColor: "#8867EE",
                      },
                    },
                  ],
                  style: {},
                  layout: "column",
                  childrenStyle: { alignItems: "flex-start" },
                },
                {
                  type: "customChild0",
                  repeatNum: 2,
                  style: {
                    width: "3.44rem",
                    marginTop: ".1rem",
                    marginLeft: ".04rem",
                  },
                  class: "light",
                },
                {
                  type: "customChild0",
                  repeatNum: 2,
                  style: {
                    width: "3.44rem",
                    marginTop: ".1rem",
                    marginLeft: ".04rem",
                  },
                  class: "light",
                },
                {
                  type: "customChild0",
                  repeatNum: 2,
                  style: {
                    width: "3.44rem",
                    marginTop: ".1rem",
                    marginLeft: ".04rem",
                  },
                  class: "light",
                },
              ],
              customChildren: [
                {
                  children: [
                    {
                      type: "rect",
                      style: {
                        width: "1.67rem",
                        height: "1.67rem",
                        backgroundColor: "#FBFCFD",
                      },
                      class: "light",
                    },
                    {
                      type: "rect",
                      style: {
                        width: "1.47rem",
                        height: ".185rem",
                        backgroundColor: "#F4F6F8",
                        borderRadius: ".05rem",
                        marginTop: ".1rem",
                        marginLeft: ".10rem",
                      },
                      class: "light",
                    },
                    {
                      type: "rect",
                      style: {
                        width: ".85rem",
                        height: ".16rem",
                        backgroundColor: "#F4F6F8",
                        borderRadius: ".05rem",
                        marginTop: ".03rem",
                        marginLeft: ".10rem",
                      },
                      class: "light",
                    },
                    {
                      type: "rect",
                      style: {
                        width: "1.47rem",
                        height: ".35rem",
                        backgroundColor: "#FAF2FF",
                        borderRadius: ".05rem",
                        marginTop: ".055rem",
                        marginLeft: ".10rem",
                        marginBottom: ".1rem",
                      },
                      class: "light",
                    },
                  ],
                  childrenStyle: {
                    backgroundColor: "white",
                    borderRadius: ".06rem",
                    alignItems: "flex-start",
                  },
                  layout: "column",
                  class: "light",
                },
              ],
              layout: "column",
              class: "light",
              style: { backgroundColor: "#f4f5f6" },
            }),
          },
        ],
      };
      function O(e) {
        return k[e];
      }
      const A = {
        home: [
          "Rights-PicComp",
          "Rights-IntelUsValueComp",
          "Rights-DigialLifeModelComp02",
          "Rights-ActivityReslocComp",
          "Rights-AIModelComp",
          "Rights-DINavigationBarComp",
          "Rights-FloatComp",
          "Rights-DialogComp",
          "Rights-LingxiComp",
          "Rights-PageViewTaksComp",
          "Rights-IntelDynaFeedsComp",
        ],
        wdqy: [
          "Rights-PageViewTaksComp",
          "Rights-GuideGetPopupComp",
          "Rights-LingxiComp",
          "Rights-DialogComp",
          "Rights-FloatComp",
          "Rights-BulletinBoardComp",
          "Rights-MemberReceiveComp",
          "Rights-NewProductBrandComp",
          "Rights-NewMemberUpgradeComp",
          "Rights-ScrollGoodsListComp",
          "Rights-SwiperComp",
          "Rights-ProductShowModelComp",
          "Rights-PicComp",
          "Rights-ActivityReslocComp",
          "Rights-HomebarComp",
          "Rights-LocatingNavigationComp",
          "Rights-YourIntrestImgNewComp",
          "Rights-IntelDynaFeedsComp",
          "Rights-FuseProductRecommendComp",
        ],
      };
      var L = i("8d7b");
      const R = window.rightsMarket ? window.rightsMarket.store : null,
        P = {
          created() {
            (this.queryObj = this.$route.query || {}),
              this.getEnvAndPageNameByUrl(window.location.href);
          },
          data: () => ({
            pageName: "",
            pageEnv: "",
            queryObj: {},
            layoutJsonList: { instancesList: {}, rulesList: {} },
            needNewPage: 0,
            config: Object(a.m)(),
            ruleAndInstanceList: [],
            instanceRuleDimensionTypeSet: new Set(),
            instanceChildRulelist: {},
            instanceGrandChildRulelist: {},
            dialogCompIds: [],
            NoviceguidanceComp: [],
            strategyCenterShuntRuleList: [],
            strategyFlag: !1,
            strategyChange: !1,
            IopRuleList: [],
            iopFlag: !1,
            iopChange: !1,
            waitLoginCb: "",
            loginDoneFlag: !1,
            layoutRespond: "",
            showPage: !1,
            preciseInfoResponse: {},
            preloadPageCompsFlag: !1,
          }),
          computed: {
            compModuleId: () => (e) =>
              window.AllComps &&
              window.AllComps.hasOwnProperty(e) &&
              window.AllComps[e] &&
              window.AllComps[e].comp
                ? window.AllComps[e].comp
                : "",
          },
          methods: {
            handleData: (e) => JSON.parse(e),
            getEnvAndPageNameByUrl(e) {
              -1 == e.indexOf("/") &&
                (e =
                  window.location.href.slice(
                    0,
                    window.location.href.lastIndexOf("/")
                  ) +
                  "/" +
                  e);
              let t = e,
                i = l.a.getValue(l.a.CHANNEL_KEY),
                s = l.a.getValue(l.a.CHANNEL_VALUE),
                o = -1 != t.indexOf("?");
              if (
                (-1 != t.indexOf(i) && (t = `${t}${o ? "&" : "?"}${i}=${s}`),
                -1 != t.indexOf("rightsmarket-h5-canvas/"))
              ) {
                let e = t.split("rightsmarket-h5-canvas/")[1];
                this.pageEnv = e.split("/")[0];
                let i = e.split("/")[1];
                o && (i = i.split("?")[0]), (this.pageName = i);
              } else if (-1 != t.indexOf("http://localhost")) {
                let e = new URL(t).pathname.split("/");
                (this.pageEnv = e[1]), (this.pageName = e[2]);
              }
              this.config = Object(a.m)(e, this.pageEnv);
            },
            getJSON(e, t, i, s) {
              if (
                ("handleRouteChange" != i &&
                  ("home" == e
                    ? (this.info = O("home"))
                    : (this.showLoading = !0)),
                "onlyDealdata" == i)
              )
                return (
                  window.ydConsoleInfo("6611 getJSON onlyDealdata", i),
                  void this.dealData("", i)
                );
              let o = this,
                n = location.href.split(`/${t}/${e}`)[0],
                r = this.getCacheTimeStamp(),
                l = "home" === e,
                c = async () => {
                  let d = JSON.parse(
                    window.localStorage.getItem("application_h5")
                  );
                  try {
                    let h, p;
                    if (l) (h = { isHomeJson: !0 }), (l = !1);
                    else {
                      if (
                        ((h = await o.getJsonAxios(
                          o.config,
                          "",
                          t,
                          r,
                          "layout",
                          e
                        )),
                        200 !== h.status || !h.data || !h.data.applicationId)
                      )
                        throw h;
                      o.mainpage &&
                        "refresh" != i &&
                        (o.layoutRespond = h.data);
                      let s = o.checkTimeValid(
                        h.data.beginTime,
                        h.data.endTime
                      );
                      if (s < 0) {
                        (h = {
                          specify: JSON.stringify([
                            {
                              moduleId: "Rights-OfflineComp",
                              specify: JSON.stringify({
                                indexUrl: d.indexUrl,
                                timeValidCode: s,
                                prefix: n,
                                env: t,
                              }),
                            },
                          ]),
                          path: e,
                        }),
                          o.dealData(h);
                        const i = document.querySelector("#cmcc_loading");
                        return void (i && (i.style.display = "none"));
                      }
                      (h = o.transformInstanceListToPageInstanceList(h.data)),
                        (o.layoutJsonList = o.getInfoFromLayoutJson(h));
                    }
                    if ((window.ydConsole(h), h.isHomeJson)) {
                      let e = JSON.parse(
                        ("online" == t ? d.ruleCases : d.validateRuleCases) ||
                          null
                      );
                      (o.layoutJsonList = o.getInfoFromLayoutJson({
                        ruleCases: e,
                      })),
                        (p = () => {
                          o.getInstanceAndRulesFileByRespond(
                            {
                              isAbtest:
                                "online" == t ? d.isAbtest : d.validateIsAbtest,
                              abtestList: JSON.parse(
                                ("online" == t
                                  ? d.abtestList
                                  : d.validateAbtestList) || null
                              ),
                              ruleCases: e,
                            },
                            n,
                            "",
                            "home",
                            t,
                            i,
                            () => {
                              c();
                            }
                          );
                        });
                    } else
                      p = () => {
                        o.getInstanceAndRulesFileByRespond(h, n, r, e, t, i);
                      };
                    h.isHomeJson && Object(a.s)()
                      ? this.appCheckRuleProvince(
                          JSON.parse(
                            ("online" == t
                              ? d.ruleCases
                              : d.validateRuleCases) || null
                          ),
                          i,
                          () => {
                            s
                              ? o.$store.state.loginDoneFlag
                                ? p()
                                : (o.waitLoginCb = p)
                              : p();
                          }
                        )
                      : s
                      ? o.$store.state.loginDoneFlag
                        ? p()
                        : (o.waitLoginCb = p)
                      : p(),
                      Object(a.Q)("set", h);
                  } catch (i) {
                    window.ydConsole(i), o.handlePageFileErr(i, t, d, n, e);
                  }
                };
              window.hasGetApplicationJson &&
              window.localStorage.getItem("application_h5")
                ? (o.preloadPageComps(), c())
                : this.getJsonAxios(o.config, [], t, r, "application")
                    .then(function (e) {
                      if (0 != e.status || location.href.includes("refresh")) {
                        if (200 !== e.status) throw e;
                        (e = e.data),
                          window.localStorage.setItem(
                            "application_h5",
                            JSON.stringify(e)
                          ),
                          o.preloadPageComps(),
                          (window.hasGetApplicationJson = !0),
                          c();
                      } else {
                        let e = location.href;
                        location.href =
                          e.includes("?") || e.includes("&")
                            ? e + "&refresh=1"
                            : e + "?refresh=1";
                      }
                    })
                    .catch((i) => o.handlePageFileErr(i, t, "", n, e));
            },
            getJsonAxios(e, t, i, s, n, a) {
              if (
                this.mainpage &&
                "layout" == n &&
                this.layoutRespond &&
                this.layoutRespond.path == a
              )
                return new Promise((e, t) => {
                  e({ status: 200, data: this.layoutRespond });
                });
              if (t && t[a])
                return new Promise((e, i) => {
                  e({ status: 200, data: JSON.parse(JSON.stringify(t[a])) });
                });
              {
                let t,
                  { publicPath: r, typeCon: l, SITE_NAME: c } = e;
                switch (n) {
                  case "application":
                    t = `${r}${l}.${c}.application.json?tes=${s}`;
                    break;
                  case "layout":
                    t = `${r}${l}.${c}.${i}.layout.${a}.json?tes=${s}`;
                    break;
                  case "instance":
                    t = `${r}${l}.${c}.${i}.instance.${a}.json?tes=${s}`;
                    break;
                  case "rule":
                    t = `${r}${l}.${c}.rule.${a}.json?tes=${s}`;
                }
                return o.a.get(t);
              }
            },
            getInfoFromLayoutJson(e) {
              let t = {},
                i = {};
              if (e)
                return (
                  e.ruleCases &&
                    e.ruleCases.length &&
                    e.ruleCases.map((e) => {
                      t[e.ruleId] = e.specify;
                    }),
                  e.pageInstanceList &&
                    e.pageInstanceList.length &&
                    e.pageInstanceList.map((e) => {
                      e.instance && (i[e.instanceId] = e.instance),
                        e.ruleCases &&
                          e.ruleCases.map((e) => {
                            t[e.id] = e;
                          }),
                        e.linkDataRule &&
                          e.linkDataRule.map((e) => {
                            t[e.id] = e;
                          });
                    }),
                  this.getAllPreciseInfoFromLayoutJson(t),
                  { rulesList: t, instancesList: i }
                );
            },
            async getInstanceAndRulesFileByRespond(e, t, i, s, o, n, r) {
              if (
                (this.mainpage
                  ? window.timePoint.set("get_mainpage_layout_json_done")
                  : await this.getPreciseInfoResponse(),
                "onlyUntilGetLayoutJson" == n)
              )
                return;
              let c = this;
              if (
                (e.isRefresh && (this.refreshFlag = !0),
                (c.bgcolor = e.backgroundColor),
                localStorage.setItem("bgcolor", e.backgroundColor),
                e.isAbtest && e.abtestList && e.abtestList[0])
              ) {
                let d,
                  h = l.a.getValue(l.a.USER_INFO);
                if ("ORCHESTRATION_SYSTEM_MODE" == e.abtestList[0].abtestType) {
                  if (l.a.getIsLogin()) {
                    let l = +h.phoneMask.slice(-2),
                      p = 0;
                    for (let t of e.abtestList) {
                      if (l >= p && l < p + t.percentage) {
                        d = t.pagePath;
                        break;
                      }
                      p += t.percentage;
                    }
                    if (d) {
                      if (((d = Object(a.A)(d).pageName), d != s))
                        return (
                          (c.instanceChildRulelist = []),
                          (c.instanceGrandChildRulelist = []),
                          void c
                            .getJsonAxios(c.config, "", o, i, "layout", d)
                            .then((e) => {
                              if (
                                (window.ydConsole(
                                  "父页面找到符合规则条件的子页面json，重新走页面渲染流程，needNewPage重新置0"
                                ),
                                200 !== e.status)
                              )
                                throw e;
                              (e = c.transformInstanceListToPageInstanceList(
                                e.data
                              )),
                                (c.layoutJsonList = c.getInfoFromLayoutJson(e)),
                                c.getInstanceAndRulesFileByRespond(
                                  e,
                                  t,
                                  i,
                                  d,
                                  o,
                                  n
                                );
                            })
                            .catch((s) => {
                              r
                                ? r()
                                : c.getFileWithoutRulecases(e, t, i, d, o, n);
                            })
                        );
                      window.ydConsole("页面地址没变啦");
                    }
                  }
                } else if (
                  "STRATEGY_CENTER_MODE" == e.abtestList[0].abtestType
                ) {
                  let l,
                    p = e.abtestList[0],
                    g = h ? h.phone : "",
                    m = p.strategyId,
                    f = p.strategyGroupId,
                    y = m ? { strategyCode: [m] } : { strategyGroupCode: [f] };
                  try {
                    l = await u({ phone: g }, y);
                  } catch {
                    l = { code: 0 };
                  }
                  if (
                    200 == l.code &&
                    l.data &&
                    l.data[0] &&
                    l.data[0].text &&
                    l.data[0].text[0]
                  ) {
                    d = l.data[0].text[0];
                    let h = Object(a.A)(d);
                    if (!h.inner) return void c.jumpToFunc(d, !0);
                    if (((d = h.pageName), d != s))
                      return (
                        (c.instanceChildRulelist = []),
                        (c.instanceGrandChildRulelist = []),
                        void c
                          .getJsonAxios(c.config, "", o, i, "layout", d)
                          .then((e) => {
                            if (
                              (window.ydConsole(
                                "父页面找到符合规则条件的子页面json，重新走页面渲染流程，needNewPage重新置0"
                              ),
                              200 !== e.status)
                            )
                              throw e;
                            (e = c.transformInstanceListToPageInstanceList(
                              e.data
                            )),
                              (c.layoutJsonList = c.getInfoFromLayoutJson(e)),
                              c.getInstanceAndRulesFileByRespond(
                                e,
                                t,
                                i,
                                d,
                                o,
                                n
                              );
                          })
                          .catch((s) => {
                            r
                              ? r()
                              : c.getFileWithoutRulecases(e, t, i, d, o, n);
                          })
                      );
                  }
                }
              }
              let { ruleCases: d } = e;
              if (d && d.length) {
                let a = d.sort((e, t) =>
                  e.priority === t.priority
                    ? t.id - e.id
                    : e.priority - t.priority
                );
                window.ydConsoleTime("获取页面分流规则json耗时");
                let l = [];
                a.forEach((e) => {
                  l.push(
                    this.getJsonAxios(
                      this.config,
                      this.layoutJsonList.rulesList,
                      "",
                      i,
                      "rule",
                      e.ruleId
                    )
                  );
                }),
                  Promise.all(l).then(async (l) => {
                    window.ydConsoleTimeEnd("获取页面分流规则json耗时"),
                      window.ydConsole("resListRes===", l),
                      l
                        .map((e) => e.data.ruleDetails)
                        .forEach((e) => {
                          this.instanceRuleDimensionTypeSet.add(
                            e.dimensionType
                          );
                        });
                    let d = 0;
                    for (let h in l)
                      if (
                        0 == d &&
                        l[h].data &&
                        l[h].data.ruleDetails &&
                        l[h].data.ruleDetails.length &&
                        (await c.checkRule(l[h].data.ruleDetails))
                      ) {
                        if (
                          (window.ydConsole(
                            "父页面找到符合规则条件的子页面，需要分流到子页面"
                          ),
                          (d = 1),
                          (this.instanceChildRulelist = []),
                          (this.instanceGrandChildRulelist = []),
                          a[h].outUrl && 1 == a[h].type)
                        )
                          return void this.jumpToFunc(a[h].outUrl, !0);
                        let l = a[h].toPagePath;
                        this.getJsonAxios(c.config, "", o, i, "layout", l)
                          .then((e) => {
                            if (
                              (window.ydConsole(
                                "父页面找到符合规则条件的子页面json，重新走页面渲染流程，needNewPage重新置0"
                              ),
                              200 !== e.status)
                            )
                              throw e;
                            (e = c.transformInstanceListToPageInstanceList(
                              e.data
                            )),
                              (c.layoutJsonList = c.getInfoFromLayoutJson(e)),
                              c.getInstanceAndRulesFileByRespond(
                                e,
                                t,
                                i,
                                s,
                                o,
                                n
                              );
                          })
                          .catch((a) => {
                            r
                              ? r()
                              : c.getFileWithoutRulecases(e, t, i, s, o, n);
                          });
                        break;
                      }
                    0 == d &&
                      (window.ydConsole(
                        "父页面没有找到符合规则条件的子页面，不需要分流到子页面"
                      ),
                      r ? r() : c.getFileWithoutRulecases(e, t, i, s, o, n));
                  });
              } else r ? r() : this.getFileWithoutRulecases(e, t, i, s, o, n);
            },
            getFileWithoutRulecases(e, t, i, s, o, n) {
              let { pageInstanceList: a } = e;
              if (a && a.length) {
                let t = [],
                  s = [],
                  r = [],
                  l = [],
                  c = [],
                  d = [],
                  h = [],
                  p = [];
                window.ydConsoleTime("获取组件json耗时"),
                  (this.dialogCompIds = []),
                  (this.NoviceguidanceCompIds = []),
                  a.forEach((e) => {
                    let n,
                      a = {};
                    if (
                      (t.push(
                        this.getJsonAxios(
                          this.config,
                          this.layoutJsonList.instancesList,
                          o,
                          i,
                          "instance",
                          e.instanceId
                        )
                      ),
                      e.ruleIds || (e.preIds && e.preIds.length > 0))
                    ) {
                      let t = e.ruleIds ? e.ruleIds.split(",") : [];
                      s.push({
                        idsList: t,
                        instanceId: e.instanceId,
                        preIds: e.preIds,
                      }),
                        (l = [...l, ...t]);
                    }
                    if (
                      ("Rights-DialogComp" == e.moduleId &&
                        this.dialogCompIds.push(e.instanceId),
                      "Rights-NoviceguidanceComp" == e.moduleId &&
                        this.NoviceguidanceCompIds.push(e.instanceId),
                      e.ruleCases && 0 !== e.ruleCases.length)
                    ) {
                      let t = e.ruleCases[0].ruleDetails;
                      t &&
                        0 !== t.length &&
                        t.forEach((e) => {
                          if ("ruleByStrategy" == e.dimensionParam) {
                            let t = JSON.parse(e.params);
                            "object" != typeof t ||
                              Array.isArray(t) ||
                              (n = t.id && null !== t.id ? t.id : t.groupId);
                          }
                        });
                    }
                    (a = {
                      moduleId: e.moduleId,
                      ruleIds: e.ruleIds,
                      instanceId: e.instanceId,
                      serialNo: n,
                    }),
                      p.push(a),
                      this.$store.commit("setRuleComps", p);
                  }),
                  t.length &&
                    Promise.all(t).then((t) => {
                      window.ydConsoleTimeEnd("获取组件json耗时"),
                        (d = t
                          .filter((e) => 200 == e.status)
                          .map((e) => e.data)),
                        d.forEach((e) => {
                          let t = JSON.parse(e.specify);
                          t.goodsList &&
                            ((t.goodsList = this.handleProvinceDate(t)),
                            (e.specify = JSON.stringify(t))),
                            (t.linkDataSourceList || ["goodsList"]).forEach(
                              (i, s) => {
                                let o = t[i];
                                o &&
                                  o.length &&
                                  o.forEach((t) => {
                                    t.ruleList &&
                                      t.ruleList.length &&
                                      (t.ruleList.forEach((e) => {
                                        l.push(e.id);
                                      }),
                                      (this.instanceChildRulelist[e.id] = {
                                        instance: e,
                                        ruleDetails: [],
                                      }));
                                  });
                              }
                            );
                          ["nestGoodsList", "categoryList"].forEach((i, s) => {
                            let o = t[i] || [];
                            o &&
                              o.length &&
                              o.forEach((t) => {
                                t.subGoodsList &&
                                  t.subGoodsList.length &&
                                  t.subGoodsList.forEach((t) => {
                                    t.ruleList &&
                                      t.ruleList.length &&
                                      (t.ruleList.forEach((e) => {
                                        l.push(e.id);
                                      }),
                                      (this.instanceGrandChildRulelist[e.id] = {
                                        instance: e,
                                        ruleDetails: [],
                                      }));
                                  });
                              });
                          }),
                            t.isUseStrategy &&
                              this.strategyCenterShuntRuleList.push({
                                params: JSON.stringify({
                                  groupId: t.strategyGroupId,
                                  id: t.strategyId,
                                  type: t.strategyType,
                                }),
                              });
                        }),
                        l.length
                          ? (window.ydConsoleTime("获取组件分流规则json耗时"),
                            (l = Array.from(new Set(l))),
                            l.forEach((e) => {
                              r.push(
                                this.getJsonAxios(
                                  this.config,
                                  this.layoutJsonList.rulesList,
                                  "",
                                  i,
                                  "rule",
                                  e
                                )
                              );
                            }),
                            Promise.all(r)
                              .then(async (t) => {
                                window.ydConsoleTimeEnd(
                                  "获取组件分流规则json耗时"
                                ),
                                  (c = t
                                    .filter((e) => 200 == e.status)
                                    .map((e) => e.data));
                                for (let e = 0; e < s.length; e++) {
                                  let t = s[e],
                                    i = !0,
                                    o = [];
                                  t.idsList.forEach((e) => {
                                    let t = c.find((t) => t.id == e);
                                    t &&
                                      t.ruleDetails[0] &&
                                      (o = [...o, ...t.ruleDetails]);
                                  }),
                                    o.forEach((e) => {
                                      this.instanceRuleDimensionTypeSet.add(
                                        e.dimensionType
                                      );
                                    });
                                  let n = !1;
                                  if (t.preIds)
                                    for (let e of t.preIds)
                                      if (-1 == h.indexOf(e)) {
                                        n = !0;
                                        break;
                                      }
                                  (i = !n && (await this.checkRule(o))),
                                    i || h.push(t.instanceId),
                                    this.ruleAndInstanceList.push({
                                      instanceId: t.instanceId,
                                      ruleDetails: o,
                                    });
                                }
                                if (
                                  h.length ||
                                  Object.keys(this.instanceChildRulelist)
                                    .length ||
                                  Object.keys(this.instanceGrandChildRulelist)
                                    .length
                                ) {
                                  for (let e of d) {
                                    h.includes(e.id) && (e.hide = !0);
                                    let t = JSON.parse(e.specify);
                                    if (this.instanceChildRulelist[e.id]) {
                                      let i = JSON.parse(
                                        this.instanceChildRulelist[e.id]
                                          .instance.specify
                                      );
                                      i.linkDataSourceList =
                                        i.linkDataSourceList || ["goodsList"];
                                      for (
                                        let s = 0;
                                        s < i.linkDataSourceList.length;
                                        s++
                                      ) {
                                        let o = i.linkDataSourceList[s],
                                          n = i[o] || [];
                                        this.instanceChildRulelist[
                                          e.id
                                        ].ruleDetails[s] = [];
                                        for (let t = 0; t < n.length; t++) {
                                          let i = n[t].ruleList || [],
                                            o = [];
                                          for (let e of i) {
                                            let t = c.find((t) => t.id == e.id);
                                            t &&
                                              t.ruleDetails[0] &&
                                              (o = [...o, ...t.ruleDetails]);
                                          }
                                          if (
                                            (this.instanceChildRulelist[
                                              e.id
                                            ].ruleDetails[s].push(o),
                                            await this.checkRule(o))
                                          ) {
                                            if (o && 0 !== o.length) {
                                              let e = "";
                                              o.forEach((t) => {
                                                if (
                                                  "ruleByStrategy" ==
                                                  t.dimensionParam
                                                ) {
                                                  let i = JSON.parse(t.params);
                                                  "object" != typeof i ||
                                                    Array.isArray(i) ||
                                                    (e =
                                                      i.id && null !== i.id
                                                        ? i.id
                                                        : i.groupId);
                                                }
                                              }),
                                                "" !== e &&
                                                  n &&
                                                  n[t] &&
                                                  (n[t].compRuleIds = e);
                                            }
                                          } else n[t].ruleHide = !0;
                                        }
                                        t[o] = n;
                                      }
                                      e.specify = JSON.stringify(t);
                                    }
                                    if (this.instanceGrandChildRulelist[e.id]) {
                                      let i = JSON.parse(
                                        this.instanceGrandChildRulelist[e.id]
                                          .instance.specify
                                      );
                                      i.nestLinkDataSourceList = [
                                        "nestGoodsList",
                                        "categoryList",
                                      ];
                                      for (
                                        let s = 0;
                                        s < i.nestLinkDataSourceList.length;
                                        s++
                                      ) {
                                        let o = i.nestLinkDataSourceList[s],
                                          n = i[o] || [];
                                        this.instanceGrandChildRulelist[
                                          e.id
                                        ].ruleDetails = [];
                                        for (let t = 0; t < n.length; t++)
                                          if (
                                            n[t].subGoodsList &&
                                            n[t].subGoodsList.length
                                          )
                                            for (
                                              let i = 0;
                                              i < n[t].subGoodsList.length;
                                              i++
                                            ) {
                                              let s = n[t].subGoodsList,
                                                o = s[i].ruleList || [],
                                                a = [];
                                              for (let e of o) {
                                                let t = c.find(
                                                  (t) => t.id == e.id
                                                );
                                                t &&
                                                  t.ruleDetails[0] &&
                                                  (a = [
                                                    ...a,
                                                    ...t.ruleDetails,
                                                  ]);
                                              }
                                              if (
                                                (this.instanceGrandChildRulelist[
                                                  e.id
                                                ].ruleDetails.push(a),
                                                await this.checkRule(a))
                                              ) {
                                                if (a && 0 !== a.length) {
                                                  let e = "";
                                                  a.forEach((t) => {
                                                    if (
                                                      "ruleByStrategy" ==
                                                      t.dimensionParam
                                                    ) {
                                                      let i = JSON.parse(
                                                        t.params
                                                      );
                                                      "object" != typeof i ||
                                                        Array.isArray(i) ||
                                                        (e =
                                                          i.id && null !== i.id
                                                            ? i.id
                                                            : i.groupId);
                                                    }
                                                  }),
                                                    "" !== e &&
                                                      s &&
                                                      s[i] &&
                                                      (s[i].compRuleIds = e);
                                                }
                                              } else s[i].ruleHide = !0;
                                            }
                                        t[o] = n;
                                      }
                                      e.specify = JSON.stringify(t);
                                    }
                                  }
                                  (e.specify = JSON.stringify(d)),
                                    this.beforeDealdata(e, n);
                                } else
                                  (e.specify = JSON.stringify(d)),
                                    this.beforeDealdata(e, n);
                              })
                              .catch((e) => {
                                window.ydConsoleErr("获取分流规则出错", e);
                              }))
                          : ((e.specify = JSON.stringify(d)),
                            this.beforeDealdata(e, n));
                    });
              } else (e.specify = "[]"), this.beforeDealdata(e, n);
            },
            getCacheTimeStamp(e) {
              e ||
                (e =
                  "development" ===
                  Object({
                    NODE_ENV: "production",
                    VUE_APP_BUILD_PATH:
                      "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/coc3/rightsmarket-h5-canvas/build_production/",
                    VUE_APP_CURRENTMODE: "production",
                    VUE_APP_MODULE_H5COMPS_PATH:
                      "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/canvas/rightsmarket-h5-canvas/production/build-h5cdn",
                    VUE_APP_PATH_NAME:
                      "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/",
                    BASE_URL:
                      "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/coc3/rightsmarket-h5-canvas/build_production/",
                  }).ENV
                    ? 1
                    : 5);
              const t = new Date().getTime();
              let i = Number(localStorage.getItem("cacheTimeStamp"));
              return (
                i
                  ? (t - i) / 6e4 > e &&
                    (window.ydConsole("cacheOverTime"),
                    localStorage.setItem("cacheTimeStamp", t.toString()))
                  : (window.ydConsole("noCache"),
                    localStorage.setItem("cacheTimeStamp", t.toString())),
                (i = Number(localStorage.getItem("cacheTimeStamp"))),
                i
              );
            },
            handlePageFileErr(e, t, i, s, o) {
              if ((window.ydConsole(e), !this.mainpage)) {
                try {
                  this.sendH5ErrorLog({
                    info: {
                      exampleId: "ERROR",
                      exampleName: "H5错误日志",
                      name: o,
                    },
                    h5ErrorLog: JSON.stringify(e),
                    envName: "子页面json请求失败",
                  });
                } catch {}
                return;
              }
              const n = l.a.getValue(l.a.CHANNEL_KEY),
                a = l.a.getValue(l.a.CHANNEL_VALUE) || "P00000011939";
              window.ydConsole(
                i
                  ? "页面json渲染失败获取跳转至application默认首页"
                  : "application的json文件渲染失败，跳转至网络异常页"
              ),
                i
                  ? (window.ydConsole(
                      `jumpToIndexUrl:${s}/${t}/${i.indexUrl}${
                        a ? `?${n}=${a}` : ""
                      }`
                    ),
                    (window.location.href = `${s}/${t}/${i.indexUrl}${
                      a ? `?${n}=${a}` : ""
                    }`))
                  : ((sessionStorage.locationUrl = window.location.href),
                    this.$router.replace("/networkError"));
            },
            IopListRule() {
              if (l.a.getIsLogin() && this.IopRuleList.length > 0) {
                let e =
                  JSON.parse(window.localStorage.getItem("iopList")) || {};
                e instanceof Array && (e = {});
                let t = Object(a.D)(location.href),
                  i = l.a.getValue(l.a.USER_INFO)
                    ? l.a.getValue(l.a.USER_INFO).phone
                    : "",
                  s = [];
                this.IopRuleList.forEach((e) => {
                  s.push({
                    iopId: e.params.split("and")[0],
                    eventCode: e.params.split("and")[1],
                  });
                }),
                  R.commit("setIop", { iopFlag: !1, iopChange: !1 }),
                  Object(d.a)(s, { phone: i })
                    .then(async (i) => {
                      if (200 == i.code) {
                        let s = !0,
                          o = [];
                        for (let e of this.IopRuleList)
                          o.push(await this.checkRule([e]));
                        (e[t] = i.data),
                          window.localStorage.setItem(
                            "iopList",
                            JSON.stringify(e)
                          );
                        let n = [];
                        for (let e of this.IopRuleList)
                          n.push(await this.checkRule([e]));
                        (s = o.every((e, t) => e === n[t])),
                          s || R.commit("setIop", { iopChange: !0 }),
                          R.commit("setIop", { iopFlag: !0 }),
                          this.allInfoGot();
                      } else
                        -516 == i.code &&
                          (l.a.setIsLogin(0),
                          this.$store.commit("setIsLogin", "0"),
                          Object(a.s)() || location.reload()),
                          R.commit("setIop", { iopFlag: !0, iopChange: !1 }),
                          this.allInfoGot(!0);
                    })
                    .catch(() => {
                      R.commit("setIop", { iopFlag: !0, iopChange: !1 }),
                        this.allInfoGot(!0);
                    });
              } else R.commit("setIop", { iopFlag: !0 }), this.allInfoGot();
            },
            strategyCenterShuntRule() {
              if (
                l.a.getIsLogin() &&
                this.strategyCenterShuntRuleList.length > 0
              ) {
                let e =
                  JSON.parse(
                    window.localStorage.getItem("ruleByStrategyList")
                  ) || {};
                e instanceof Array && (e = {});
                let t = Object(a.D)(location.href),
                  i = l.a.getValue(l.a.USER_INFO)
                    ? l.a.getValue(l.a.USER_INFO).phone
                    : "",
                  s = [],
                  o = [];
                console.log(
                  this.strategyCenterShuntRuleList,
                  "strategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleListstrategyCenterShuntRuleList"
                ),
                  this.strategyCenterShuntRuleList.forEach((e) => {
                    1 == JSON.parse(e.params).type
                      ? JSON.parse(e.params).groupId &&
                        o.push(JSON.parse(e.params).groupId)
                      : JSON.parse(e.params).id &&
                        s.push(JSON.parse(e.params).id);
                  }),
                  R.commit("setStrategy", {
                    strategyFlag: !1,
                    strategyChange: !1,
                  });
                let n = new Date().getTime().toString();
                u({ phone: i }, { strategyCode: s, strategyGroupCode: o })
                  .then(async (i) => {
                    if (200 == i.code) {
                      let s = !0,
                        o = [];
                      for (let e of this.strategyCenterShuntRuleList)
                        e.ruleId && o.push(await this.checkRule([e]));
                      (e[t] = i.data),
                        window.localStorage.setItem(
                          "ruleByStrategyList",
                          JSON.stringify(e)
                        ),
                        R.commit("setRuleByStrategyList", JSON.stringify(e));
                      let n = [];
                      for (let e of this.strategyCenterShuntRuleList)
                        e.ruleId && n.push(await this.checkRule([e]));
                      (s = o.every((e, t) => e === n[t])),
                        s || R.commit("setStrategy", { strategyChange: !0 }),
                        R.commit("setStrategy", { strategyFlag: !0 }),
                        this.allInfoGot();
                    } else {
                      -516 == i.code &&
                        (l.a.setIsLogin(0),
                        this.$store.commit("setIsLogin", "0"),
                        Object(a.s)() || location.reload());
                      try {
                        console.log(this.$options.methods),
                          this.sendH5ErrorLog({
                            info: {
                              exampleId: "ERROR",
                              exampleName: "H5错误日志",
                              name: "strategyCenterShuntRule",
                            },
                            h5ErrorLog: JSON.stringify({
                              sTime: n,
                              cTime: new Date().getTime().toString(),
                              params: { strategyCode: s, strategyGroupCode: o },
                              error: i,
                            }),
                            envName: "策略请求非200",
                          });
                      } catch {}
                      R.commit("setStrategy", {
                        strategyFlag: !0,
                        strategyChange: !1,
                      }),
                        this.allInfoGot(!0);
                    }
                  })
                  .catch((e) => {
                    this.sendH5ErrorLog({
                      info: {
                        exampleId: "ERROR",
                        exampleName: "H5错误日志",
                        name: "strategyCenterShuntRule",
                      },
                      h5ErrorLog: JSON.stringify({
                        sTime: n,
                        cTime: new Date().getTime().toString(),
                        params: { strategyCode: s, strategyGroupCode: o },
                        error: e,
                      }),
                      envName: "策略请求超时或失败",
                    }),
                      R.commit("setStrategy", {
                        strategyFlag: !0,
                        strategyChange: !1,
                      }),
                      this.allInfoGot(!0);
                  });
              } else
                R.commit("setStrategy", { strategyFlag: !0 }),
                  this.allInfoGot();
            },
            async checkRule(e) {
              let t = e.every((e) => {
                let {
                    detailField: t,
                    dimensionParam: i,
                    dimensionType: s,
                    params: o,
                    isContain: n,
                    ruleId: r,
                  } = e,
                  c = t || i;
                if (2 === s || "dimension_time" === i) {
                  let e = "string" == typeof o && o ? JSON.parse(o) : o,
                    t = Date.parse(new Date()),
                    i = new Date().getDay(),
                    s = new Date().getDate(),
                    a = !1;
                  if (e.constructor == Object) {
                    let {
                      timestamp1: o,
                      timestamp2: n,
                      timeMode: r,
                      dateType: l,
                      dayArr: c,
                      dateArr: d,
                      dayArrTime: h,
                    } = e;
                    if (1 == r && o) a = o[0] < t && t < o[1];
                    else if (0 == r && n) {
                      let e = new Date().getFullYear(),
                        o = new Date().getMonth() + 1;
                      const r = (t) =>
                        new Date(`${e}/${o}/${s} ${t}`).valueOf();
                      1 == l
                        ? (a = r(n[0]) < t && t < r(n[1]))
                        : 2 == l
                        ? (a =
                            null == h
                              ? c.includes(i) && r(n[0]) < t && t < r(n[1])
                              : c.includes(i) &&
                                r(h[i][0]) < t &&
                                t < r(h[i][1]))
                        : 3 == l &&
                          (a = d.includes(s) && r(n[0]) < t && t < r(n[1]));
                    }
                  } else e.constructor == Array && (a = e[0] < t && t < e[1]);
                  return 0 === n ? !a : a;
                }
                if (
                  "dimension_channelCode" === i ||
                  "folders" === i ||
                  "self_define" === i ||
                  1 === s ||
                  3 === s ||
                  8 === s
                ) {
                  this.queryObj = this.$route.query || {};
                  let e = o.split(",").includes(this.queryObj[c]);
                  return 0 === n ? !e : e;
                }
                if (5 === s || "provincial" === i) {
                  l.a.getIsLogin(),
                    (o = "string" == typeof o ? JSON.parse(o) : o);
                  let e = [];
                  o.forEach((t) => {
                    e.push(t.provinceId);
                  });
                  const { user_info: t } = JSON.parse(
                    window.localStorage.getItem(l.a.dianquAuth)
                  );
                  let i = "";
                  t && t.provinceCode && (i = t.provinceCode);
                  const s = e.includes(i);
                  return 0 === n ? !s : s;
                }
                if (6 === s || "dimension_ABtest" === i) {
                  const e = Math.random() < o;
                  return 0 === n ? !e : e;
                }
                if (7 === s || "vipIdentity" === i) {
                  const e = l.a.getIsLogin();
                  let i,
                    s,
                    r,
                    c =
                      "string" == typeof t && "vipIdentity" !== t
                        ? JSON.parse(t)
                        : {
                            vipIdentityOnlyVip: 0,
                            vipIdentityType: 1,
                            vipIdentityJudge: 1,
                          };
                  c.hasOwnProperty("vipIdentityOnlyVip") ||
                    (c.vipIdentityOnlyVip = 0),
                    (o = "string" == typeof o ? JSON.parse(o) : o);
                  let d = o.findIndex((e) => "and" == e);
                  -1 == d
                    ? ((s = o), (r = []))
                    : ((s = o.slice(0, d)), (r = o.slice(d + 1)));
                  let h = r.findIndex((e) => "merge" == e);
                  if (-1 !== h) {
                    let e = r.slice(0, h);
                    if (
                      r.includes("20+QY00002") &&
                      (e.push(369), !r.includes("20+QY00001"))
                    ) {
                      let t;
                      e.forEach((e, i) => {
                        20 == e && (t = i);
                      }),
                        e.splice(t, 1);
                    }
                    r = e;
                  }
                  if (e && Object(a.G)()) {
                    if (1 === c.vipIdentityOnlyVip) {
                      let t = Object(a.G)();
                      if (1 === t.length) {
                        const o = t[0].vipLevel,
                          n = +t[0].memberId;
                        return (
                          (i = this.checkVipDimension(e, s, r, t[0], o, n)), i
                        );
                      }
                      return !1;
                    }
                    if (0 === c.vipIdentityOnlyVip)
                      if (1 === c.vipIdentityType) {
                        const t = Object(a.G)()[0].vipLevel,
                          o = +Object(a.G)()[0].memberId;
                        i = this.checkVipDimension(
                          e,
                          s,
                          r,
                          Object(a.G)()[0],
                          t,
                          o
                        );
                      } else if (2 === c.vipIdentityType) {
                        let t,
                          o,
                          n = [];
                        1 === c.vipIdentityJudge
                          ? (Object(a.G)().forEach((i) => {
                              (t = i.vipLevel),
                                (o = i.memberId),
                                n.push(
                                  this.checkVipDimension(e, s, r, i, t, o)
                                );
                            }),
                            (i = n.some((e) => e)))
                          : ((n = this.checkVipDimensionReverse(
                              s,
                              r,
                              c.vipIdentityJudge
                            )),
                            (i = n.every((e) => e)));
                      } else if (3 === c.vipIdentityType) {
                        let t = this.$route.query.memberId,
                          o = Object(a.G)().find((e) => e.memberId == t);
                        if (t && o) {
                          const t = o.vipLevel,
                            n = o.memberId;
                          i = this.checkVipDimension(e, s, r, o, t, n);
                        } else i = !1;
                      }
                  } else {
                    if (1 === c.vipIdentityOnlyVip) return !1;
                    0 === c.vipIdentityOnlyVip &&
                      (i = this.checkVipDimension(e, s, r, null, !1, !1));
                  }
                  return 0 === n ? !i : i;
                }
                if (9 === s || "brand" === i) {
                  let e = window.localStorage.getItem("gsmVipLevel");
                  (e = 0 == e ? -1 : e),
                    (o = "string" == typeof o ? JSON.parse(o) : o);
                  let t = !1;
                  return o.includes(Number(e)) && (t = !0), 0 === n ? !t : t;
                }
                if (10 === s || "dimension_terminal" === i) {
                  let e = Object(a.o)();
                  o = "string" == typeof o ? JSON.parse(o) : o;
                  let t = !1;
                  return (
                    o.includes(0) && e.android && (t = !0),
                    o.includes(1) && e.ios && (t = !0),
                    o.includes(2) && (t = !0),
                    0 === n ? !t : t
                  );
                }
                if ("otherNetWorkUser" === t) {
                  const { user_info: e } = JSON.parse(
                    window.localStorage.getItem(l.a.dianquAuth)
                  );
                  o = "string" == typeof o ? JSON.parse(o) : o;
                  let t = !1;
                  return (
                    o.includes(0) && e && "002" == e.numberNet && (t = !0),
                    o.includes(1) && e && "001" == e.numberNet && (t = !0),
                    o.includes(2) && e && "003" == e.numberNet && (t = !0),
                    o.includes(3) && e && !e.numberNet && (t = !0),
                    0 === n ? !t : t
                  );
                }
                if ("ruleByEnvironment" === t) {
                  if (((o = JSON.parse(o)), void 0 === n || 0 === o.length))
                    return !0;
                  let e = Object(a.s)()
                      ? "1"
                      : Object(a.z)()
                      ? Object(a.x)()
                        ? "3"
                        : "4"
                      : "2",
                    t = o.includes(e);
                  return 0 === n ? !t : t;
                }
                if ("ruleByiop" === t) {
                  const { user_info: e } = JSON.parse(
                    window.localStorage.getItem(l.a.dianquAuth)
                  );
                  let t = !1;
                  o = "string" == typeof o ? o : jSON.parse(o);
                  let i,
                    s = Object(a.D)(location.href);
                  if (this.mainpage) {
                    i =
                      (JSON.parse(window.localStorage.getItem("iopList")) ||
                        {})[s] || [];
                  } else i = this.preciseInfoResponse.iopRes || [];
                  return (
                    window.ydConsole(this.IopRuleList),
                    i.length > 0 &&
                      (t = i.some(
                        (e) =>
                          o.split("and")[0] == e.iopId &&
                          o.split("and")[1] == e.eventCode &&
                          o.split("and")[2] == e.productId
                      )),
                    !(!e || !e.phone) && (0 === n ? !t : t)
                  );
                }
                if ("ruleByStrategy" === t) {
                  const { user_info: e } = JSON.parse(
                    window.localStorage.getItem(l.a.dianquAuth)
                  );
                  let t = !1;
                  o = "string" == typeof o ? JSON.parse(o) : o;
                  let i,
                    s = Object(a.D)(location.href);
                  if (this.mainpage) {
                    i =
                      (JSON.parse(
                        window.localStorage.getItem("ruleByStrategyList")
                      ) || {})[s] || [];
                  } else i = this.preciseInfoResponse.strategyRes || [];
                  return (
                    i.length > 0 &&
                      (t = i.some((e) =>
                        o.type
                          ? !(
                              o.groupId != e.strategyGroupCode ||
                              (o.text && o.text != (e.text ? e.text[0] : "")) ||
                              (o.ruleCode && o.ruleCode != e.ruleCode)
                            )
                          : !(
                              o.id != e.strategyCode ||
                              (o.text && o.text != (e.text ? e.text[0] : "")) ||
                              (o.ruleCode && o.ruleCode != e.ruleCode)
                            )
                      )),
                    !(!e || !e.phone) && (0 === n ? !t : t)
                  );
                }
                if ("ruleAppVersion" === t) {
                  let e = !1;
                  if ((window.ydConsole(o, "pppppppppp"), Object(a.s)())) {
                    o = "string" == typeof o ? JSON.parse(o) : o;
                    let t = sessionStorage.getItem("appVersion") || "0.0.0";
                    if (
                      (window.ydConsole(t, "当前手厅版本 当前手厅版本"),
                      (o.version = o.version.replace(/。/g, ".")),
                      1 === o.versionMode)
                    )
                      if (o.version.includes(",") || o.version.includes("，")) {
                        (o.version = o.version.replace(/，/g, ",")),
                          o.version.split(",").forEach((i) => {
                            i == t && (e = !0);
                          });
                      } else o.version === t && (e = !0);
                    else {
                      let i, s;
                      (s = t.split(".").join("")),
                        o.version.includes(",") || o.version.includes("，")
                          ? ((o.version = o.version.replace(/，/g, ",")),
                            (i = o.version.split(",")[0]),
                            (i = i.split(".").join("")))
                          : (i = o.version.split(".").join("")),
                        2 === o.versionMode
                          ? Number(s) > Number(i) && (e = !0)
                          : 3 === o.versionMode &&
                            Number(s) < Number(i) &&
                            (e = !0);
                    }
                    return 0 === n ? !e : e;
                  }
                  return (
                    window.ydConsole("非手厅环境下-isContain", n),
                    0 === n ? !e : e
                  );
                }
              });
              return t || !1;
            },
            async appCheckRuleProvince(e, t, i) {
              let s = (e) => {
                let t = e.every((e) => {
                  let {
                    dimensionParam: t,
                    dimensionType: i,
                    params: s,
                    isContain: o,
                  } = e;
                  if (5 === i || "provincial" === t) {
                    s = "string" == typeof s ? JSON.parse(s) : s;
                    let e = [];
                    s.forEach((t) => {
                      e.push(t.provinceId);
                    });
                    let t = "";
                    this.appUserInfo &&
                      this.appUserInfo.loginProvince &&
                      (t = this.appUserInfo.loginProvince);
                    const i = e.includes(t);
                    return 0 === o ? !i : i;
                  }
                });
                return t || !1;
              };
              if ("onlyUntilGetLayoutJson" != t)
                if (this.appUserInfo && 200 == this.appUserInfo.loginProvince)
                  i();
                else if (e && e.length) {
                  let t = (e = e.filter(
                      (e) =>
                        e.outUrl &&
                        e.specify &&
                        e.specify.ruleDetails &&
                        e.specify.ruleDetails.every(
                          (e) =>
                            5 === e.dimensionType ||
                            "provincial" === e.dimensionParam
                        )
                    )).sort((e, t) =>
                      e.priority === t.priority
                        ? t.id - e.id
                        : e.priority - t.priority
                    ),
                    o = [];
                  t.forEach((e) => {
                    o.push(
                      this.getJsonAxios(
                        this.config,
                        this.layoutJsonList.rulesList,
                        "",
                        "",
                        "rule",
                        e.ruleId
                      )
                    );
                  }),
                    Promise.all(o).then(async (e) => {
                      for (let i in e)
                        if (
                          e[i].data &&
                          e[i].data.ruleDetails &&
                          e[i].data.ruleDetails.length &&
                          s(e[i].data.ruleDetails) &&
                          ((this.instanceChildRulelist = []),
                          (this.instanceGrandChildRulelist = []),
                          t[i].outUrl && 1 == t[i].type)
                        )
                          return void this.isAPPJump(
                            Object(L.b)(t[i].outUrl),
                            !0,
                            !1
                          );
                      i();
                    });
                } else i();
              else i();
            },
            handleProvinceDate(e) {
              let t = [];
              if (e.isProvincial) {
                const { user_info: i } = JSON.parse(
                  window.localStorage.getItem(l.a.dianquAuth)
                );
                let s = (i && i.provinceCode) || "all",
                  o =
                    (e.provincialObj && e.provincialObj[s]) ||
                    e.provincialObj.all,
                  n =
                    e.goodsList &&
                    e.goodsList.filter((e) => 0 == e.isProvincialEdit);
                n && n.length && (t = t.concat(n)),
                  o && ((t = t.concat(o)), t.sort((e, t) => e.sort - t.sort));
              } else t = e.goodsList;
              return t;
            },
            checkVipDimension(e, t, i, s, o, n) {
              let a = t.includes(o);
              if (!a) {
                let e,
                  t = [],
                  o = [];
                (e = i.findIndex((e) => "merge" == e)),
                  -1 == e
                    ? (a = i.includes(n))
                    : s && s.equityIdList && 0 !== s.equityIdList.length
                    ? (s.equityIdList.forEach((e) => {
                        o.push(`${s.memberId}+${e}`);
                      }),
                      (t = i.slice(e + 1)),
                      (a = o.some((e) => t.includes(e))))
                    : s && (a = i.includes(n));
              }
              return (
                t.includes(0) && !e && (a = !0),
                t.includes(100) && !o && e && (a = !0),
                t.includes(4) && 6 === o && (a = !0),
                a
              );
            },
            checkVipDimensionReverse(e, t, i) {
              let s,
                o = [],
                n = [],
                r = [],
                l = [];
              return (
                e &&
                  0 !== e.length &&
                  e.forEach((e) => {
                    4 == e && (e = 6),
                      o.push(Object(a.G)().some((t) => t.vipLevel == e));
                  }),
                t &&
                  0 !== t.length &&
                  ((s = t.findIndex((e) => "merge" == e)),
                  (l = -1 == s ? t : t.slice(0, s)),
                  (n = -1 == s ? [] : t.slice(s + 1)),
                  0 !== l.length &&
                    l.forEach((e) => {
                      o.push(Object(a.G)().some((t) => t.memberId == e));
                    }),
                  -1 !== s &&
                    o.push(
                      Object(a.G)().some((e) => {
                        if (
                          e &&
                          e.equityIdList &&
                          0 !== e.equityIdList.length
                        ) {
                          let t;
                          return (
                            e.equityIdList.forEach((t) => {
                              r.push(`${e.memberId}+${t}`);
                            }),
                            (t =
                              1 == i
                                ? r.some((e) => n.includes(e))
                                : n.every((e) => r.includes(e))),
                            t
                          );
                        }
                        return !1;
                      })
                    )),
                o
              );
            },
            setApiCache(e, t, i) {
              (this.apiCathe[e] = this.apiCathe[e] || {}),
                (this.apiCathe[e][JSON.stringify(t)] = i);
            },
            getApiCache(e, t) {
              return !!this.apiCathe[e] && this.apiCathe[e][JSON.stringify(t)];
            },
            transformInstanceListToPageInstanceList(e) {
              if (e.instanceList && e.instanceList.length > 0) {
                let t = e.instanceList,
                  i = [];
                for (let e of t) {
                  let t = [];
                  for (let s of e)
                    (s.preIds = JSON.parse(JSON.stringify(t))),
                      t.push(s.instanceId),
                      i.push(s);
                }
                e.pageInstanceList = i;
              }
              return e;
            },
            checkTimeValid(e, t) {
              if (!e || !t) return 2;
              {
                (e = e.replace(/-/g, "/")), (t = t.replace(/-/g, "/"));
                let i = new Date();
                if (new Date(e) <= i && i <= new Date(t)) return 1;
                if (new Date(e) > i) return -1;
                if (i > new Date(t)) return -2;
              }
            },
            beforeDealdata(e, t) {
              if (
                this.mainpage &&
                (window.timePoint.set("beforeDealdata"),
                "refresh" != t &&
                  "onlySkipDealdata" != t &&
                  (!this.refreshPage || this.refreshPage != this.page))
              )
                try {
                  window.timePoint.set("get_strategy_iop_info_start"),
                    this.strategyCenterShuntRule(),
                    this.IopListRule();
                } catch (e) {
                  window.ydConsole(e);
                }
              (this.showPage = !1),
                C(e.pageInstanceList, () => {
                  this.mainpage &&
                    window.timePoint.set("get_all_comps_umd_done"),
                    (this.showPage = !0),
                    this.dealData(e, t);
                }),
                (window.pageInfo = e.pageInstanceList),
                (window.pageRuleInfo = JSON.parse(e.specify));
            },
            getAllPreciseInfoFromLayoutJson(e) {
              let t = [];
              for (let i of Object.values(e)) t = t.concat(i.ruleDetails);
              t.map((e) => {
                let { detailField: t } = e;
                "ruleByStrategy" === t &&
                  this.strategyCenterShuntRuleList.findIndex(
                    (t) => t.ruleId == e.ruleId
                  ) < 0 &&
                  this.strategyCenterShuntRuleList.push(e),
                  "ruleByiop" === t &&
                    this.IopRuleList.findIndex((t) => t.ruleId == e.ruleId) <
                      0 &&
                    this.IopRuleList.push(e);
              });
            },
            async getPreciseInfoResponse() {
              let e = [];
              if (l.a.getIsLogin()) {
                let t = l.a.getValue(l.a.USER_INFO)
                    ? l.a.getValue(l.a.USER_INFO).phone
                    : "",
                  i = [];
                this.IopRuleList.length > 0 &&
                  this.IopRuleList.forEach((e) => {
                    i.push({
                      iopId: e.params.split("and")[0],
                      eventCode: e.params.split("and")[1],
                    });
                  }),
                  i.length > 0
                    ? e.push(Object(d.a)(i, { phone: t }))
                    : e.push("");
                let s = [],
                  o = [];
                this.strategyCenterShuntRuleList.length > 0 &&
                  this.strategyCenterShuntRuleList.forEach((e) => {
                    1 == JSON.parse(e.params).type
                      ? JSON.parse(e.params).groupId &&
                        o.push(JSON.parse(e.params).groupId)
                      : JSON.parse(e.params).id &&
                        s.push(JSON.parse(e.params).id);
                  }),
                  s.length > 0 || o.length > 0
                    ? e.push(
                        u(
                          { phone: t },
                          { strategyCode: s, strategyGroupCode: o }
                        )
                      )
                    : e.push("");
                let [n, a] = await Promise.allSettled(e);
                n &&
                  n.value &&
                  "200" == n.value.code &&
                  (this.preciseInfoResponse.iopRes = n.value.data),
                  a &&
                    a.value &&
                    "200" == a.value.code &&
                    (this.preciseInfoResponse.strategyRes = a.value.data);
              }
            },
            preloadPageComps() {
              if (
                this.mainpage &&
                !this.preloadPageCompsFlag &&
                location.href.indexOf("home") > -1
              ) {
                C(A.home.map((e) => ({ moduleId: e }))),
                  (this.preloadPageCompsFlag = !0);
              } else if (
                this.mainpage &&
                !this.preloadPageCompsFlag &&
                location.href.indexOf("wdqy") > -1
              ) {
                C(A.wdqy.map((e) => ({ moduleId: e }))),
                  (this.preloadPageCompsFlag = !0);
              }
            },
          },
          watch: {
            "$store.state.loginDoneFlag": {
              handler(e) {
                e &&
                  this.waitLoginCb &&
                  (this.waitLoginCb(),
                  this.$nextTick(() => {
                    this.waitLoginCb = "";
                  }));
              },
            },
          },
          components: { "Rights-OfflineComp": I },
        };
      var T = i("6171"),
        _ = i("db49"),
        x = i.n(_),
        N = {
          name: "jumpToast",
          props: {
            info: {
              type: Object,
              default: () => ({
                show: !1,
                closeBtn: !1,
                content: "",
                callback: "",
              }),
            },
          },
          data: function () {
            return {
              defaultObj: {
                show: !1,
                closeBtn: !0,
                content: "",
                callback: "",
                submitTxt: "我知道了",
                closeCallback: "",
              },
              jumpToastInfo: {},
              is_H5: x.a.isH5,
            };
          },
          methods: {
            submitClick() {
              x.a.isH5 &&
                ("function" == typeof this.jumpToastInfo.callback &&
                  (this.sendClickLog({
                    info: this.jumpToastInfo.riskPopupInfo,
                    pointPosition: "RiskPop_know",
                    nextUrl: this.jumpToastInfo.url,
                    envName: "点击“我知道了”按钮",
                  }),
                  this.jumpToastInfo.callback()),
                (this.jumpToastInfo.show = !1),
                (this.info.show = !1));
            },
            closePopup() {
              this.sendClickLog({
                info: this.jumpToastInfo.riskPopupInfo,
                pointPosition: "RiskPop_close",
                envName: "点击关闭弹窗 ",
              }),
                "function" == typeof this.jumpToastInfo.closeCallback &&
                  this.jumpToastInfo.closeCallback(),
                (this.jumpToastInfo.show = !1),
                (this.info.show = !1);
            },
          },
          watch: {
            "info.show": {
              handler: function (e) {
                e
                  ? (this.sendExposurVisit({
                      info: this.jumpToastInfo.riskPopupInfo,
                      envName: "第三方风险提示弹窗组件",
                      pointPosition: "Rights-RiskPop",
                    }),
                    (this.jumpToastInfo = Object.assign(
                      this.defaultObj,
                      this.info
                    )))
                  : (this.defaultObj = {
                      show: !1,
                      closeBtn: !0,
                      content: "",
                      callback: "",
                      submitTxt: "我知道了",
                      closeCallback: "",
                      riskPopupInfo: "",
                    });
              },
            },
          },
        },
        E =
          (i("d440"),
          Object(S.a)(
            N,
            function () {
              var e = this,
                t = e._self._c;
              return t(
                "div",
                { staticClass: "jump-toast" },
                [
                  t(
                    "van-popup",
                    {
                      attrs: { "close-on-click-overlay": !1 },
                      model: {
                        value: e.jumpToastInfo.show,
                        callback: function (t) {
                          e.$set(e.jumpToastInfo, "show", t);
                        },
                        expression: "jumpToastInfo.show",
                      },
                    },
                    [
                      t("img", {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: e.jumpToastInfo.closeBtn,
                            expression: "jumpToastInfo.closeBtn",
                          },
                          { name: "webp", rawName: "v-webp" },
                        ],
                        staticClass: "jump-toast-close",
                        attrs: {
                          src: "https://res.coc.10086.cn/res/cdn/coc1/2023/03/30/1641355085975654400/1680164516038_59465.png",
                          alt: "",
                        },
                        on: { click: e.closePopup },
                      }),
                      t("img", {
                        directives: [{ name: "webp", rawName: "v-webp" }],
                        staticClass: "jump-toast-logo",
                        attrs: {
                          src: "https://res.coc.10086.cn/res/cdn/coc1/2023/03/30/1641355086325108736/1680164516038_230167.png",
                          alt: "",
                        },
                      }),
                      t("div", {
                        staticClass: "jump-toast-content",
                        domProps: { innerHTML: e._s(e.jumpToastInfo.content) },
                      }),
                      t(
                        "div",
                        {
                          staticClass: "jump-toast-btn",
                          on: { click: e.submitClick },
                        },
                        [e._v(e._s(e.jumpToastInfo.submitTxt))]
                      ),
                    ]
                  ),
                ],
                1
              );
            },
            [],
            !1,
            null,
            "93c532b2",
            null
          ).exports),
        j = {
          name: "minipro-bar",
          data: () => ({
            backFlag: !1,
            forwardFlag: !1,
            homeFlag: !1,
            hiddenFlag: !0,
            indexUrl: "home",
            curPageName: "",
          }),
          props: { jumpTo: { type: Function } },
          created() {
            this.init(),
              sessionStorage.getItem("miniproBarShowed") &&
                ((this.backFlag = !0), (this.forwardFlag = !0)),
              sessionStorage.setItem("miniproBarShowed", !0);
          },
          methods: {
            goBack() {
              this.backFlag && window.history.go(-1);
            },
            goForward() {
              this.forwardFlag && window.history.go(1);
            },
            goHome() {
              this.homeFlag && this.jumpTo(this.indexUrl);
            },
            init() {
              (this.hiddenFlag =
                !Object(a.P)() || !Object(a.I)("wx63702e5c62ec4fa5")),
                (this.curPageName = Object(a.D)(location.href)),
                this.curPageName == this.indexUrl
                  ? (this.homeFlag = !1)
                  : (this.homeFlag = !0);
            },
          },
          watch: {
            $route: {
              handler() {
                this.init();
              },
            },
            "$store.state.jumpToUrlFlag": {
              handler(e) {
                e && ((this.backFlag = !0), (this.forwardFlag = !0));
              },
            },
          },
        },
        D =
          (i("cd85"),
          Object(S.a)(
            j,
            function () {
              var e = this._self._c;
              return e(
                "div",
                { class: ["minipro-bar", { hidden: this.hiddenFlag }] },
                [
                  e("div", { staticClass: "placeholder" }),
                  e("div", { staticClass: "bottom-bar" }, [
                    e("div", {
                      class: ["arrow-left", { active: this.backFlag }],
                      on: { click: this.goBack },
                    }),
                    e("div", {
                      class: ["logo", { active: this.homeFlag }],
                      on: { click: this.goHome },
                    }),
                    e("div", {
                      class: ["arrow-right", { active: this.forwardFlag }],
                      on: { click: this.goForward },
                    }),
                  ]),
                ]
              );
            },
            [],
            !1,
            null,
            "27da8878",
            null
          ).exports),
        B = {
          name: "skeletonChild",
          props: ["info"],
          data: () => ({ repeatNum: 1, children: [] }),
          created() {
            this.repeatNum = this.info.repeatNum || 1;
          },
          methods: {},
        },
        F =
          (i("5b76"),
          Object(S.a)(
            B,
            function () {
              var e = this,
                t = e._self._c;
              return e.info.children
                ? t(
                    "div",
                    {
                      staticClass: "layout",
                      class: e.info.class,
                      style: e.info.style,
                    },
                    e._l(e.repeatNum, function (i) {
                      return t(
                        "div",
                        {
                          key: i,
                          staticClass: "layout",
                          class: ["column" == e.info.layout ? "column" : ""],
                          style: e.info.childrenStyle,
                        },
                        e._l(e.info.children, function (e) {
                          return t("skeleton-child", { attrs: { info: e } });
                        }),
                        1
                      );
                    }),
                    0
                  )
                : "img" != e.info.type
                ? t("div", {
                    staticClass: "layout",
                    class: [e.info.type, e.info.class],
                    style: e.info.style,
                  })
                : t("img", {
                    staticClass: "layout",
                    class: e.info.type,
                    style: e.info.style,
                    attrs: { src: e.info.url },
                  });
            },
            [],
            !1,
            null,
            "5ce539ce",
            null
          ).exports);
      var $ = {
          name: "Skeleton2Comp",
          title: "骨架图",
          preview: "preview-skeleton.png",
          props: {
            showPrivew: { type: Boolean, default: !1 },
            info: { type: Object, default: () => ({}) },
            jumpTo: { type: Function },
          },
          data: () => ({ preview: "preview-skeleton.png", gotInfo: {} }),
          mounted() {},
          components: { skeChild: F },
          methods: {
            handleCustomEle(e) {
              let t = e;
              return (
                e.customChildren &&
                  e.customChildren.length &&
                  ((t = JSON.stringify(e)),
                  e.customChildren.forEach((e, i) => {
                    t = t.replaceAll(
                      '"type":"customChild' + i + '"',
                      JSON.stringify(e).slice(1, -1)
                    );
                  }),
                  (t = JSON.parse(t))),
                t
              );
            },
          },
          watch: {
            info: {
              handler(e) {
                e && (this.gotInfo = this.handleCustomEle(e));
              },
              deep: !0,
              immediate: !0,
            },
          },
        },
        U =
          (i("d8f8"),
          Object(S.a)(
            $,
            function () {
              var e = this._self._c;
              return this.showPrivew
                ? e("img", {
                    staticClass: "preview-image",
                    attrs: { src: this.preview, alt: "" },
                  })
                : e(
                    "div",
                    { staticClass: "comp-wrapper rightsSkeleton-comp-wrapper" },
                    [
                      this.info.html
                        ? e("div", {
                            domProps: { innerHTML: this._s(this.info.html) },
                          })
                        : this.info.img
                        ? e("img", {
                            staticClass: "img-whole",
                            attrs: { src: this.info.img, alt: "" },
                          })
                        : e(
                            "div",
                            { staticClass: "content" },
                            [e("skeChild", { attrs: { info: this.gotInfo } })],
                            1
                          ),
                    ]
                  );
            },
            [],
            !1,
            null,
            "20c58358",
            null
          ).exports),
        V = i("6dd8"),
        J = i("a198"),
        H = i("dcd0"),
        M = i("0f32"),
        z = i.n(M),
        G = {
          props: {
            value: { type: Boolean, default: () => !1 },
            jumpTo: { type: Function },
          },
          computed: {
            visible: {
              get() {
                return this.value;
              },
              set(e) {
                this.$emit("input", e);
              },
            },
            disabled() {
              return !(this.smsCode && 6 == this.smsCode.length);
            },
          },
          watch: {
            visible: {
              handler(e) {
                e && this.verifyTokenWechatCode();
              },
              immediate: !0,
              deep: !0,
            },
          },
          data: () => ({
            maskPhone: "",
            smsCode: "",
            downTime: 0,
            smsBtnText: "发送验证码",
            repeatClickFlag: !1,
            redirectUrl: "",
            show: !1,
          }),
          methods: {
            verifyTokenWechatCode() {
              J.a
                .verifyTokenWechatCode({
                  token: this.$route.query.wechatToken,
                  wechatCode: this.$route.query.wechatCode,
                })
                .then((e) => {
                  0 == e.code
                    ? ((this.redirectUrl = e.data.redirectUrl || ""),
                      e.data.match ? this.getMaskPhone() : (this.show = !0))
                    : this.$toast(e.message);
                });
            },
            confirmBindPhone() {
              (this.show = !1),
                J.a
                  .confirmBindPhone({ token: this.$route.query.wechatToken })
                  .then((e) => {
                    0 == e.code
                      ? ((this.redirectUrl = e.data.redirectUrl || ""),
                        this.getMaskPhone())
                      : this.$toast(e.message);
                  });
            },
            getMaskPhone() {
              J.a
                .getMaskPhone({ token: this.$route.query.wechatToken })
                .then((e) => {
                  0 == e.code
                    ? (this.maskPhone = e.data.phoneMask)
                    : this.$toast(e.message);
                });
            },
            sendSmsCode: z()(function () {
              J.a
                .sendSmsByToken({ token: this.$route.query.wechatToken })
                .then((e) => {
                  0 == e.code
                    ? this.startDownTime()
                    : this.$toast(e.message || "验证码发送失败");
                });
            }, 500),
            startDownTime() {
              (this.downTime = 60),
                (this.smsBtnText = `已发送(${this.downTime})`);
              const e = setInterval(() => {
                --this.downTime,
                  this.downTime <= 0
                    ? ((this.smsBtnText = "发送验证码"), clearInterval(e))
                    : (this.smsBtnText = `已发送(${this.downTime})`);
              }, 1e3);
            },
            goLogin: z()(function () {
              if (this.repeatClickFlag) return;
              this.repeatClickFlag = !0;
              const e = Base64.encode(this.smsCode)
                  .split("")
                  .reverse()
                  .join(""),
                t = sendCodeRSAEncrypt(e).p1;
              J.a
                .userLoginV2({
                  ticket: this.$route.query.wechatToken,
                  ticketType: 19,
                  businessType: "RIGHTS_MARKET",
                  s1: t,
                  s2: Object(H.a)(e, this.smsCode, 1),
                })
                .then((e) => {
                  if (0 == e.code) {
                    let t = {
                      iswhite: 0,
                      medalType: null,
                      phone: e.data.token,
                      phoneMask: e.data.mobileMask,
                      provinceCode: e.data.provinceCode,
                      numberNet: e.data.numberNet,
                      loginType: 7,
                      cityCode: e.data.cityCode,
                      refreshToken: e.data.refreshToken,
                    };
                    l.a.setValue(l.a.HLTOKEN, ""),
                      l.a.setValue(l.a.NESSTOKEN, ""),
                      localStorage.setItem("appLoginTimeout", "true");
                    l.a.setValue(l.a.USER_INFO, t),
                      l.a.setIsLogin(1, l.a.EXPIRES_TIME, Date.now(), 0),
                      this.redirectUrl
                        ? this.jumpTo(this.redirectUrl)
                        : (location.href = location.href),
                      (this.isLoading = !1);
                  } else (this.isLoading = !1), this.$toast(e.message);
                  this.repeatClickFlag = !1;
                })
                .catch((e) => {
                  this.$toast(e.message), (this.repeatClickFlag = !1);
                });
            }, 500),
          },
        },
        W =
          (i("c92a"),
          Object(S.a)(
            G,
            function () {
              var e = this,
                t = e._self._c;
              return t(
                "div",
                [
                  e.maskPhone
                    ? t(
                        "van-popup",
                        {
                          staticClass: "minipro-login-popup",
                          attrs: {
                            "close-on-click-overlay": !1,
                            "z-index": "2000",
                          },
                          model: {
                            value: e.visible,
                            callback: function (t) {
                              e.visible = t;
                            },
                            expression: "visible",
                          },
                        },
                        [
                          t("div", { staticClass: "title" }, [
                            e._v("请填写手机短信验证码"),
                          ]),
                          t(
                            "div",
                            [
                              t("van-field", {
                                attrs: {
                                  label: "手机号",
                                  placeholder: "填写手机号",
                                  "label-width": "0.68rem",
                                  disabled: "",
                                },
                                model: {
                                  value: e.maskPhone,
                                  callback: function (t) {
                                    e.maskPhone = t;
                                  },
                                  expression: "maskPhone",
                                },
                              }),
                              t("van-field", {
                                attrs: {
                                  center: "",
                                  clearable: "",
                                  label: "验证码",
                                  placeholder: "填写验证码",
                                  "label-width": "0.68rem",
                                  type: "number",
                                  maxlength: "6",
                                },
                                scopedSlots: e._u(
                                  [
                                    {
                                      key: "button",
                                      fn: function () {
                                        return [
                                          t(
                                            "van-button",
                                            {
                                              staticClass: "sms-button",
                                              class: {
                                                "disabled-button":
                                                  e.downTime > 0,
                                              },
                                              attrs: {
                                                size: "small",
                                                type: "primary",
                                                color:
                                                  e.downTime > 0
                                                    ? "#E5E5E5"
                                                    : "#2978FF",
                                                disabled: e.downTime > 0,
                                              },
                                              on: { click: e.sendSmsCode },
                                            },
                                            [e._v(e._s(e.smsBtnText))]
                                          ),
                                        ];
                                      },
                                      proxy: !0,
                                    },
                                  ],
                                  null,
                                  !1,
                                  1533436794
                                ),
                                model: {
                                  value: e.smsCode,
                                  callback: function (t) {
                                    e.smsCode = t;
                                  },
                                  expression: "smsCode",
                                },
                              }),
                            ],
                            1
                          ),
                          t(
                            "div",
                            [
                              t(
                                "van-button",
                                {
                                  staticClass: "next-button",
                                  class: { "disabled-button": e.disabled },
                                  attrs: {
                                    size: "small",
                                    type: "primary",
                                    color: e.disabled ? "#E5E5E5" : "#2978FF",
                                    disabled: e.disabled,
                                  },
                                  on: { click: e.goLogin },
                                },
                                [e._v("下一步")]
                              ),
                            ],
                            1
                          ),
                        ]
                      )
                    : e._e(),
                  t(
                    "van-popup",
                    {
                      staticClass: "minipro-tips-popup",
                      attrs: {
                        "close-on-click-overlay": !1,
                        "z-index": "2000",
                      },
                      model: {
                        value: e.show,
                        callback: function (t) {
                          e.show = t;
                        },
                        expression: "show",
                      },
                    },
                    [
                      t("div", { staticClass: "title" }, [
                        e._v(
                          "该手机号绑定的微信号发生变更，请确认是否更新为新微信号？"
                        ),
                      ]),
                      t("div", { staticClass: "btn" }, [
                        t(
                          "div",
                          {
                            on: {
                              click: function (t) {
                                e.show = !1;
                              },
                            },
                          },
                          [e._v("取消")]
                        ),
                        t("div", { on: { click: e.confirmBindPhone } }, [
                          e._v("确定"),
                        ]),
                      ]),
                    ]
                  ),
                ],
                1
              );
            },
            [],
            !1,
            null,
            "40d500fc",
            null
          ).exports);
      function q(e = {}, t = {}) {
        return Object(h.a)({
          url: "/gateway-route/gr-rights/rights/market/user/bizInfo/get",
          method: "post",
          headers: t,
          data: e,
        })
          .then((e) => Promise.resolve([void 0, e]))
          .catch((e) => Promise.resolve([e, void 0]));
      }
      function K(e = {}, t = {}) {
        return Object(h.a)({
          url: "/gateway-route/gr-rights/rights/market/user/goodsInfo/get",
          method: "post",
          headers: t,
          data: e,
        })
          .then((e) => Promise.resolve([void 0, e]))
          .catch((e) => Promise.resolve([e, void 0]));
      }
      function Y(e = {}, t = {}) {
        return Object(h.a)({
          url: "/gateway-route/gr-rights/rights/market/province/rights/list",
          method: "post",
          headers: t,
          data: e,
        })
          .then((e) => Promise.resolve([void 0, e]))
          .catch((e) => Promise.resolve([e, void 0]));
      }
      function X(e = {}, t = {}) {
        return Object(h.a)({
          url: "/gateway-route/gr-openapi-parent/coc3-gr-openapi/gsm/ifa10/userInfoDetails",
          method: "post",
          headers: t,
          data: e,
        })
          .then((e) => Promise.resolve([void 0, e]))
          .catch((e) => Promise.resolve([e, void 0]));
      }
      var Z = {
          name: "vipErrorPopup",
          data: () => ({ vipInfoErrorShow: !1 }),
          computed: {},
          watch: {
            "$store.state.vipErrorPopupShow": {
              handler(e) {
                this.vipInfoErrorShow = e;
              },
              immediate: !0,
            },
          },
          methods: {
            closePopup() {
              this.$store.commit("setVipErrorPopupShow", !1),
                window.history.back();
            },
            reload() {
              l.a.setValue(l.a.VIP_INFO, ""), window.location.reload();
            },
          },
        },
        Q =
          (i("829b"),
          Object(S.a)(
            Z,
            function () {
              var e = this,
                t = e._self._c;
              return t(
                "van-popup",
                {
                  staticClass: "vipInfo-error-popup",
                  attrs: { "close-on-click-overlay": !1 },
                  model: {
                    value: e.vipInfoErrorShow,
                    callback: function (t) {
                      e.vipInfoErrorShow = t;
                    },
                    expression: "vipInfoErrorShow",
                  },
                },
                [
                  t("div", { staticClass: "popup-wrap" }, [
                    t("img", {
                      directives: [{ name: "webp", rawName: "v-webp" }],
                      staticClass: "icon",
                      attrs: {
                        src: "https://res.coc.10086.cn/res/cdn/coc1/2022/05/16/1526028634649649152/close.png",
                      },
                      on: { click: e.closePopup },
                    }),
                    t("div", { staticClass: "title" }, [e._v("友情提示")]),
                    t("div", { staticClass: "text" }, [
                      t("span", [
                        e._v(
                          "系统服务繁忙，您的会员身份可能展示有误，请重新刷新页面~"
                        ),
                      ]),
                    ]),
                    t("div", { staticClass: "btn-wrap" }, [
                      t(
                        "div",
                        { staticClass: "btn-one", on: { click: e.closePopup } },
                        [e._v("我知道了")]
                      ),
                      t(
                        "div",
                        { staticClass: "btn-two", on: { click: e.reload } },
                        [e._v("重新加载")]
                      ),
                    ]),
                  ]),
                ]
              );
            },
            [],
            !1,
            null,
            "3bae7664",
            null
          ).exports),
        ee = i("4360"),
        te = {
          name: "toastOverlayShow",
          data: () => ({ overlayShow: !0, countdown: 3, time: "" }),
          watch: {
            "$store.state.overlayShow": {
              handler(e) {
                let t = this;
                (this.overlayShow = e),
                  e &&
                    ((this.countdown = 3),
                    (this.time = setInterval(function () {
                      (t.countdown = t.countdown - 1),
                        t.countdown <= 0 &&
                          (clearInterval(t.time),
                          ee.a.commit("setOverlayShow", !1));
                    }, 1e3)));
              },
              immediate: !0,
            },
          },
        },
        ie =
          (i("6a5a"),
          Object(S.a)(
            te,
            function () {
              var e = this._self._c;
              return e("van-overlay", { attrs: { show: this.overlayShow } }, [
                e(
                  "div",
                  { staticClass: "toast" },
                  [
                    e("van-loading", {
                      staticClass: "toast-loading",
                      attrs: { type: "spinner" },
                    }),
                    e("div", [
                      this._v(
                        "活动太火爆啦，请稍后重试~(" +
                          this._s(this.countdown) +
                          "s)"
                      ),
                    ]),
                  ],
                  1
                ),
              ]);
            },
            [],
            !1,
            null,
            "77b7d129",
            null
          ).exports),
        se = i("2f62"),
        oe = i("f3e4"),
        ne = i("231d"),
        ae = i("6b0d");
      let re = "SANDBOX" === i("c441").a.env ? "/coc3-market-activity" : "";
      var le = i("90c5"),
        ce = i.n(le),
        de = i("9816"),
        he = i("7d92"),
        pe = i("b047"),
        ue = i.n(pe);
      (window.CryptoJS = ce.a),
        (window.JSEncrypt = de.a),
        (window.Encrypt = he.b),
        (window.Decrypt = he.a),
        (window.sendCodeRSAEncrypt = he.g),
        (window.sendOrderCodeRSAEncrypt = he.h),
        (window.ydConsole = function (...e) {
          window.location.href.includes("debug=1") && console.log(e);
        }),
        (window.ydConsoleInfo = function (...e) {
          window.location.href.includes("debug=1") && console.info(e);
        }),
        (window.ydConsoleErr = function (...e) {
          window.location.href.includes("debug=1") && console.error(e);
        }),
        (window.ydConsoleTime = function (...e) {
          window.location.href.includes("debug=1") && console.time(e);
        }),
        (window.ydConsoleTimeEnd = function (...e) {
          window.location.href.includes("debug=1") && console.timeEnd(e);
        }),
        (window.ydConsoleWarn = function (...e) {
          window.location.href.includes("debug=1") && console.warn(e);
        }),
        o.a.interceptors.response.use(
          function (e) {
            return e;
          },
          function (e) {
            if ((window.ydConsoleInfo("请求错误信息："), !e.response))
              return "Network Error" == e.message
                ? { status: 0, message: "网络出错" }
                : { status: 500, message: e };
            let { status: t } = e.response;
            return 404 == t || 504 == t
              ? { status: 404, message: "服务器走丢了" }
              : 403 == t
              ? { status: 403, message: "权限不足，请联系管理员" }
              : 0 == t
              ? { status: 0, message: "网络出错" }
              : { status: 500, message: "未知错误" };
          }
        );
      var ge = {
          name: "Index",
          components: {
            "Rights-Skeleton2Comp": U,
            jumpToast: E,
            miniproBarVue: D,
            VipErrorPopup: Q,
            ToastOverlay: ie,
            miniproLogin: W,
          },
          data: () => ({
            miniproLoginVisible: !1,
            EventTrackingInfo: {
              exampleId: 11192102,
              exampleName: "Rights-WakeupAppToUrl2Comp",
              name: "Rights-WakeupAppToUrl2Comp",
            },
            info: [],
            isForceLogin: 0,
            showLoading: !1,
            loadingPage: "",
            st_login: !0,
            sign_login: !0,
            artifact_login: !0,
            actsign_login: !0,
            baiduMobile_login: !0,
            accessToken: "",
            actSign: "",
            token: "",
            sourceid: "",
            code: "",
            accountId: "",
            loadCount: 0,
            loading: !1,
            finished: !1,
            tempList: [],
            page: "",
            shareDescription: "",
            sharePictureUrl: "",
            shareRedirectUrl: "",
            isGrey: Number(window.sessionStorage.getItem("isGrey")) ? 1 : 0,
            artifact: "",
            phone: "",
            refreshKeyFlag: !1,
            bgcolor: "",
            apiCathe: {},
            refreshFlag: !1,
            tempRefreshFlag: !1,
            tempVarRefresh: !1,
            touchstartPosY: 0,
            isVisibilityState: !1,
            visibilityChange: "customvisibilitychange",
            changeState: "customvisibilityState",
            visibilityApiAvailable: !0,
            mainpage: !0,
            refreshPage: "",
            iopList: [],
            iopdata: [],
            oldInfo: "",
            iopindex: 0,
            iopdataNull: [],
            vipFlag: !1,
            gsmFlag: !1,
            preloadFlag: !1,
            preloadData: "",
            dialogLoginVisible: !1,
            isPageHide: !1,
            appLoginTimeout: { value: !1, timer: null },
            vipInfoErrorShow: !0,
            appUserInfo: "",
            lastLabel: "",
            verticalVipPages: [
              "gyhy",
              "gyhynew",
              "mshy",
              "newmshy",
              "szshscgw",
              "newschy",
              "shjfdfy",
              "travelsz",
              "travelzq",
              "carowner",
              "jtqy",
              "szsh",
              "duomaiduozeng",
              "mshypd",
              "newgyhy",
              "gazq",
              "petslife",
            ],
            excludePage: ["carstoredetail"],
            excludeChannelCode: ["P00000092338"],
            hasNavCustomBtnFlag: !1,
            isTouchCode: !1,
            touchCode: "",
            observerH: null,
            timeData: {
              sTime1: "",
              sTime2: "",
              sTime3: "",
              sTime4: "",
              eTime1: "",
              error: "",
              sourceId: "",
            },
            isForceUpApp: !1,
            forcedPullEnd: "",
            isUpApp: !1,
            lowerVersionShow: !1,
            wechatToken: "",
            wechatCode: "",
            secondScreenTimer: null,
          }),
          mixins: [c.a, P],
          computed: {
            ...Object(se.c)([
              "picLotteryList",
              "dialogShareList",
              "jumpToastInfo",
            ]),
          },
          watch: {
            $route: {
              handler(e, t) {
                e.query.showSecondPage ||
                e.query.addressType ||
                (Object(a.s)() && "home" == Object(a.D)(location.href))
                  ? (this.refreshFlag = !0)
                  : (this.refreshFlag = this.tempVarRefresh);
                let i = [
                  "pageKey",
                  "pageRecorded",
                  "pageLoginFlag",
                  "citySelect",
                  "syTabVal",
                  "addressType",
                  "token",
                  "prizeinstanceid",
                  "hbexampleId",
                  "bindingCardStatus",
                ];
                if (
                  ("mshyswdetail" == Object(a.D)(location.href) &&
                    i.push("skuId"),
                  this.isPageKeyChange(e, t, i))
                )
                  return;
                !sessionStorage.getItem("miniproBar_hasJumpFlag") &&
                  Object(a.x)() &&
                  (ee.a.commit("setStateParams", {
                    key: "jumpToUrlFlag",
                    value: !0,
                  }),
                  sessionStorage.setItem("miniproBar_hasJumpFlag", 1));
                let { page: s, env: o } = e.params;
                (this.page = s),
                  "grey" != o && "online" != o
                    ? ((sessionStorage.locationUrl = window.location.href),
                      this.$toast("请检查输入的地址是否正确"),
                      this.$router.replace("/networkError"))
                    : this.getJSON(s, o, "handleRouteChange");
              },
              deep: !0,
            },
            "$store.state.needRefresh": {
              handler(e, t) {
                if ((window.ydConsole("新增打印needRefresh", e), e)) {
                  window.timePoint.set("needRefresh_start"),
                    (function (e) {
                      e.map((e) => {
                        "Rights-DialogComp" === e.moduleId &&
                          Object(oe.a)("ad_" + e.id);
                      });
                    })(this.info.slice(0));
                  let { page: e, env: t } = this.$route.params;
                  (this.refreshKeyFlag = !0),
                    this.getJSON(e, t, "refresh"),
                    this.$store.commit("setNeedRefresh", 0);
                }
              },
              deep: !0,
            },
            "$store.state.renderStatus": {
              async handler(e) {
                if (
                  (window.ydConsoleInfo("renderStatus", e),
                  "allRenderDone" == e)
                ) {
                  let e = this.info;
                  if (
                    (this.setRenderCompsList(e, "LotteryReminderDialogComp"),
                    this.needRefreshComps(e, this.dialogCompIds),
                    this.needRefreshComps(
                      e,
                      this.NoviceguidanceCompIds,
                      "Rights-NoviceguidanceComp"
                    ),
                    this.isIncludesComp(e),
                    this.watchFirstScreen(),
                    (this.userInfo = l.a.getValue(l.a.USER_INFO)),
                    Object(a.x)() &&
                      l.a.getIsLogin() &&
                      this.userInfo &&
                      this.userInfo.phone &&
                      Object(a.I)("wxb991f21b7779dd36"))
                  ) {
                    let e = await J.a.getInternetTempToken(
                      { targetsourceid: "027010" },
                      { token: this.userInfo.phone }
                    );
                    wx.miniProgram.postMessage({
                      data: {
                        token: e.data,
                        targetSourceId: "056002",
                        authType: 2,
                        channel: "qycs",
                      },
                    });
                  }
                  l.a.getIsLogin() &&
                    this.userInfo &&
                    this.userInfo.phone &&
                    "qycswb" == this.$route.query.channelCode &&
                    !this.$route.query.code &&
                    (function (e) {
                      return Object(n.a)({
                        url: "/coc3-user-center/open/api/weibo/getWeiboUserInfoByPhone",
                        method: "post",
                        data: e,
                      });
                    })({ token: this.userInfo.phone }).then((e) => {
                      0 != e.code ||
                        (e.data && (!e.data || e.data.uid)) ||
                        (window.location.href = `https://api.weibo.com/oauth2/authorize?client_id=2545063256&response_type=code&redirect_uri=${window.location.origin}${window.location.pathname}?channelCode=qycswb`);
                    });
                }
              },
            },
            "$store.state.isVisibilityState": {
              handler(e) {
                if (e) {
                  if (localStorage.getItem("sendClickLogArr")) {
                    JSON.parse(localStorage.getItem("sendClickLogArr")).forEach(
                      (e, t) => {
                        this.sendClickLog(e, e.fn);
                      }
                    ),
                      localStorage.removeItem("sendClickLogArr");
                  }
                  if (localStorage.getItem("sendExposurVisitArr")) {
                    JSON.parse(
                      localStorage.getItem("sendExposurVisitArr")
                    ).forEach((e, t) => {
                      this.sendExposurVisit(e, e.fn);
                    }),
                      localStorage.removeItem("sendExposurVisitArr");
                  }
                  window.ydConsole("初始化index"),
                    localStorage.getItem("needDeleteCartNav") &&
                      (window.ydConsole("删除购物车icon"),
                      localStorage.removeItem("needDeleteCartNav"),
                      this.showNavCustomBtn());
                }
              },
              immediate: !0,
            },
            "$store.state.refreshFlagShow": {
              handler(e) {
                this.refreshFlag = !!e;
              },
            },
            touchCode: {
              handler(e, t) {
                e &&
                  e != t &&
                  this.sendExposurVisit({ info: this.EventTrackingInfo });
              },
              immediate: !0,
            },
          },
          created() {
            localStorage.getItem("FirstVisit") ||
              localStorage.setItem("FirstVisit", Date.now());
            let e = Object(a.p)();
            if (
              (window.ydConsole("created extendID", e),
              this.currentUrlTrim(),
              navigator.userAgent.match(/leadeon/gi) &&
                navigator.userAgent.match(/MiniProgram/gi))
            )
              return;
            if (
              (window.timePoint.set("commonpublic_created"),
              this.historyInit(),
              "wzryqydg" == Object(a.D)(location.href) &&
                !navigator.userAgent.match(/smobagamehelper/gi) &&
                !navigator.userAgent.match(/com.tencent.gamehelper.smoba/gi))
            )
              return void location.replace(Object(L.b)("wzryqydgts"));
            Object(a.s)() && (this.oldInfo = this.getCurInfo()),
              Object(a.s)() &&
                "home" == Object(a.D)(location.href) &&
                (this.refreshFlag = !0),
              (this.$route.query.showSecondPage ||
                this.$route.query.addressType) &&
                (this.refreshFlag = !0),
              window.ydConsoleTime("从created到dealData完成耗时");
            let t = this.$route.path.slice(
              this.$route.path.lastIndexOf("/") + 1,
              this.$route.path.length
            );
            "detail" !== t &&
              -1 === t.indexOf("sort") &&
              sessionStorage.removeItem("scrollTop" + t),
              "home" == Object(a.D)(location.href) &&
                ((this.info = O("home")),
                (this.loadingPage = "home"),
                this.setVisitTimes()),
              (this.showLoading = !0),
              setTimeout(() => {
                this.showLoading = !1;
              }, 5e3),
              window.addEventListener("offline", () => {
                (sessionStorage.locationUrl = window.location.href),
                  this.$router.replace("/networkError");
              }),
              window.addEventListener("online", () => {
                sessionStorage.locationUrl &&
                  (window.location.href = sessionStorage.locationUrl);
              }),
              window.addEventListener("shareEvent", () => {
                this.initShare();
              });
            let {
              channelCode: i,
              goodsId: s,
              channelId: o,
              selfChannelCode: n,
              actSign: r,
              token: c,
              sourceid: d,
              uid: h,
              artifact: p,
              code: u,
              accountId: g,
              check: m,
              wechatCode: f,
              wechatToken: y,
            } = this.$route.query;
            if (
              (m && sessionStorage.setItem("wakeupAppRrr", !0),
              (this.actSign = r ? decodeURIComponent(r) : ""),
              (this.token = c ? decodeURIComponent(c) : ""),
              (this.uid = h ? decodeURIComponent(h) : ""),
              (this.artifact = p ? decodeURIComponent(p) : ""),
              (this.sourceid = d ? decodeURIComponent(d) : ""),
              (this.wechatCode = f ? decodeURIComponent(f) : ""),
              (this.wechatToken = y ? decodeURIComponent(y) : ""),
              (this.code = u ? decodeURIComponent(u) : ""),
              (this.accountId = g ? decodeURIComponent(g) : ""),
              i && ((i = decodeURIComponent(i)), i.indexOf("?")))
            ) {
              let e = i.split("?");
              i = e[0];
              let t = e[1];
              if (t && t.indexOf("artifact")) {
                let t = e[1].split("=")[1];
                this.artifact = t;
              }
            }
            i
              ? ("P00000114611" == i &&
                  localStorage.setItem("Rights-LingxiComp-Jump", !0),
                l.a.setValue(l.a.CHANNEL_KEY, "channelCode"),
                Object(a.t)(i) && !Object(a.s)() && (i = "P00000011940"),
                l.a.setValue(l.a.CHANNEL_VALUE, i))
              : (l.a.setValue(l.a.CHANNEL_KEY, "channelCode"),
                l.a.setValue(l.a.CHANNEL_VALUE, "P00000011939")),
              o &&
                (l.a.setValue(l.a.CHANNEL_KEY, "channelId"),
                l.a.setValue(l.a.CHANNEL_VALUE, o)),
              n &&
                (l.a.setValue(l.a.CHANNEL_KEY, "channelCode"),
                Object(a.t)(i) && !Object(a.s)() && (i = "P00000011940"),
                l.a.setValue(l.a.CHANNEL_VALUE, i)),
              i || o || n || l.a.setValue(l.a.CHANNEL_VALUE, "P00000011939"),
              s &&
                (l.a.setValue(l.a.GOODSID_KEY, "goodsId"),
                l.a.setValue(l.a.GOODSID_VALUE, s)),
              l.a.getValue(l.a.CHANNEL_KEY) ||
                l.a.setValue(l.a.CHANNEL_KEY, "channelId"),
              l.a.getValue(l.a.GOODSID_KEY) ||
                l.a.setValue(l.a.GOODSID_KEY, "goodsId"),
              l.a.getValue(l.a.isVipPurchase) ||
                l.a.setValue(l.a.isVipPurchase, "isVipPurchase");
            let { page: w, env: v } = this.$route.params;
            if ("grey" != v && "online" != v)
              return (
                this.$toast("请检查输入的地址是否正确"),
                (sessionStorage.locationUrl = window.location.href),
                void this.$router.replace("/networkError")
              );
            void 0 !== document.hidden
              ? ((this.visibilityChange = "visibilitychange"),
                (this.changeState = "visibilityState"))
              : void 0 !== document.mozHidden
              ? ((this.visibilityChange = "mozvisibilitychange"),
                (this.changeState = "mozVisibilityState"))
              : void 0 !== document.msHidden
              ? ((this.visibilityChange = "msvisibilitychange"),
                (this.changeState = "msVisibilityState"))
              : void 0 !== document.webkitHidden
              ? ((this.visibilityChange = "webkitvisibilitychange"),
                (this.changeState = "webkitVisibilityState"))
              : (this.visibilityApiAvailable = !1);
            let C = l.a.getValue(l.a.USER_INFO);
            if (Object(a.s)()) {
              if (
                (!this.visibilityApiAvailable ||
                  "visible" === document[this.changeState]) &&
                -1 == window.location.href.indexOf("sandbox")
              ) {
                if (
                  (Object(L.a)("appLoginTimeout") ||
                    l.a.getIsLogin() ||
                    "true" !== localStorage.getItem("appLoginTimeout") ||
                    localStorage.removeItem("appLoginTimeout"),
                  (l.a.getIsLogin() &&
                    "true" === localStorage.getItem("appLoginTimeout")) ||
                    Object(L.a)("appLoginTimeout"))
                )
                  return (
                    window.timePoint.set("appLoginTimeout"),
                    void this.getJSON(w, v)
                  );
                let e = 5e3;
                this.$route.query.delay && (e = +this.$route.query.delay),
                  (this.appLoginTimeout.timer = setTimeout(() => {
                    this.timeData.eTime1 =
                      "timeout error eTime1 is " +
                      new Date().getTime().toString();
                    try {
                      this.sendH5ErrorLog({
                        info: {
                          exampleId: "ERROR",
                          exampleName: "H5错误日志",
                          name: "login",
                        },
                        h5ErrorLog: JSON.stringify(this.timeData),
                        envName: "手厅单点超时",
                      });
                    } catch {}
                    (this.appLoginTimeout.value = !0),
                      localStorage.setItem("appLoginTimeoutToast", "true");
                    let e = window.location.href,
                      t = encodeURIComponent(e);
                    window.timePoint.set("appLoginTimeout_callback"),
                      window.$utils.showRightsLogin(t, !0);
                  }, e));
              }
              window.ydConsole(
                "手厅单点开始时间",
                new Date().getTime().toString()
              ),
                (this.timeData.sTime1 = new Date().getTime().toString());
              try {
                cmcc.getUserInfo({
                  debug: !1,
                  success: (e) => {
                    (this.appUserInfo = e),
                      window.ydConsole(
                        "第一次调用getUserInfo结束时间",
                        new Date().getTime().toString()
                      ),
                      (this.timeData.sTime2 = new Date().getTime().toString());
                    let t = e.networkType || e.nt;
                    if (
                      (this.$route.query.networkType &&
                        (t = this.$route.query.networkType),
                      sessionStorage.setItem("networkType", t),
                      sessionStorage.setItem("phoneBrand", e.sb),
                      this.appLoginTimeout.value)
                    )
                      return;
                    let i = { WT_cid: e.cid, WT_clientID: e.clientID };
                    gdp("setGeneralProps", {
                      ...i,
                      WT_userBrand: e.userBrand,
                      WT_loginProvince: e.loginProvince,
                      WT_loginCity: e.loginCity,
                      WT_prov: e.province,
                      WT_city: e.city,
                    }),
                      this.visibilityApiAvailable
                        ? (window.ydConsoleInfo(
                            "6611",
                            "changeState",
                            document[this.changeState]
                          ),
                          "visible" === document[this.changeState]
                            ? (window.ydConsoleInfo("6611,非预加载"),
                              (this.isVisibilityState = !0),
                              this.$store.commit(
                                "setVisibilityState",
                                this.isVisibilityState
                              ),
                              this.apiPreload(),
                              this.loginAndGetjson(w, v))
                            : ((this.isVisibilityState = !1),
                              document.addEventListener(
                                this.visibilityChange,
                                this.startProcess,
                                !1
                              ),
                              this.$store.commit(
                                "setVisibilityState",
                                this.isVisibilityState
                              ),
                              this.sendPreloadLog(1),
                              this.isNeedPreload()
                                ? (this.sendPreloadLog(2),
                                  (this.preloadFlag = !0),
                                  window.ydConsoleInfo(
                                    "6611,预加载,只执行到获取json"
                                  ),
                                  3 == t
                                    ? ((window.timePoint.mode = 1),
                                      (this.lastLabel = "onlySkipDealdata"),
                                      this.apiPreload(),
                                      this.loginAndGetjson(
                                        w,
                                        v,
                                        "onlySkipDealdata"
                                      ))
                                    : ((window.timePoint.mode = 2),
                                      (this.lastLabel =
                                        "onlyUntilGetLayoutJson"),
                                      this.getJSON(
                                        w,
                                        v,
                                        "onlyUntilGetLayoutJson"
                                      )))
                                : ((window.timePoint.mode = 2),
                                  window.ydConsoleInfo(
                                    "6611,预加载,但不执行渲染"
                                  ),
                                  (this.preloadFlag = !1))))
                        : this.loginAndGetjson(w, v);
                  },
                  error: (e) => {
                    if (
                      (clearTimeout(this.appLoginTimeout.timer),
                      this.appLoginTimeout.value)
                    )
                      return;
                    (this.timeData.error = e),
                      (this.timeData.eTime1 =
                        "getUserInfo error is" +
                        new Date().getTime().toString());
                    try {
                      this.sendH5ErrorLog({
                        info: {
                          exampleId: "ERROR",
                          exampleName: "H5错误日志",
                          name: "login",
                        },
                        h5ErrorLog: JSON.stringify(this.timeData),
                        envName: "getUserinfo error",
                      });
                    } catch {}
                    let t = window.location.href,
                      i = encodeURIComponent(t);
                    window.timePoint.set("getUserInfo_error"),
                      window.$utils.showRightsLogin(i, !0);
                  },
                });
              } catch (e) {
                window.ydConsole(e, "报错版本");
              }
            } else
              C &&
                C.cityCode &&
                "000" != C.cityCode &&
                gdp("setGeneralProps", {
                  WT_loginProvince: C.provinceCode,
                  WT_loginCity: C.cityCode,
                }),
                this.apiPreload(),
                this.loginAndGetjson(w, v);
            (window.onload = () => {
              ("hidden" !== document[this.changeState] &&
                "prerender" !== document[this.changeState]) ||
                document.addEventListener(
                  this.visibilityChange,
                  this.listenAndSendLoadedLog,
                  !1
                ),
                "visible" === document[this.changeState] &&
                  document.removeEventListener(
                    this.visibilityChange,
                    this.listenAndSendLoadedLog,
                    !1
                  );
              let e = Object(a.o)();
              Object(a.s)() &&
                e.ios &&
                ((this.isPageHide = !1),
                window.addEventListener("pageshow", () => {
                  this.isPageHide &&
                    ((this.hasNavCustomBtnFlag = !1),
                    this.showNavCustomBtn(),
                    this.initShare());
                }),
                window.addEventListener("pagehide", () => {
                  this.isPageHide = !0;
                })),
                Object(a.s)() &&
                  ((this.$route.params.page.indexOf("detail") > -1 &&
                    !this.excludePage.includes(this.$route.params.page) &&
                    !this.excludeChannelCode.includes(
                      this.$route.query.channelCode
                    )) ||
                    this.verticalVipPages.includes(this.$route.params.page)) &&
                  (e.ios
                    ? window.addEventListener("pagehide", () => {
                        this.showNavCustomBtn("hideNav");
                      })
                    : window.addEventListener("beforeunload", () => {
                        this.showNavCustomBtn("hideNav");
                      }));
            }),
              sessionStorage.removeItem("renderComps"),
              sessionStorage.removeItem("hasBusinessOpportunity");
          },
          mounted() {
            window.$renewLogin.renewEnterPage(),
              window.$renewLogin.initPageVisibilityListener();
          },
          methods: {
            ...Object(se.b)(["setJumpToastInfo", "setCurrentPageInfo"]),
            rightsLogin(e) {
              if (Object(a.s)())
                if (
                  (window.ydConsole(
                    "rightsLogin开始时间",
                    new Date().getTime().toString()
                  ),
                  this.appUserInfo)
                ) {
                  let t = this.appUserInfo;
                  if (
                    (window.ydConsole(
                      "第二次调用getUserInfo结束时间",
                      new Date().getTime().toString()
                    ),
                    this.appLoginTimeout.value)
                  )
                    return;
                  if (
                    (sessionStorage.setItem("appVersion", t.version), t.token)
                  ) {
                    let i = window.$utils.md5(t.phoneNumber + ""),
                      s = l.a.getValue(l.a.USER_INFO);
                    if (
                      s &&
                      i == s.md5phone &&
                      (new Date().getTime() - s.updateTime) / 6e4 <= 30
                    ) {
                      clearTimeout(this.appLoginTimeout.timer);
                      let t = this;
                      Object(a.H)(
                        s,
                        e,
                        l.a.KEEP_EXPIRES,
                        this.instanceRuleDimensionTypeSet,
                        !1,
                        t
                      );
                    } else {
                      if (t.version.split(".").join("") >= 756)
                        if (this.appUserInfo && this.appUserInfo.token) {
                          window.ydConsole(
                            "jsid存在时，跳过单点登录",
                            this.appUserInfo.token
                          );
                          let t = this;
                          Object(ne.a)(
                            this.appUserInfo.token,
                            11,
                            e,
                            this.instanceRuleDimensionTypeSet,
                            { md5phone: i, updateTime: new Date().getTime() },
                            this.appLoginTimeout,
                            "",
                            this.timeData,
                            t,
                            this.appUserInfo.token
                          );
                        } else {
                          window.ydConsole("jsid不存在");
                          try {
                            this.sendH5ErrorLog({
                              info: {
                                exampleId: "ERROR",
                                exampleName: "H5错误日志",
                                name: "login",
                              },
                              h5ErrorLog: JSON.stringify(this.timeData),
                              envName: "jsid不存在",
                            });
                          } catch {}
                          this.appTokenLogin(e, i);
                        }
                    }
                  } else {
                    if (
                      (clearTimeout(this.appLoginTimeout.timer),
                      this.appLoginTimeout.value)
                    )
                      return;
                    l.a.setIsLogin(0),
                      ee.a.commit("changeRenderStatus", "startLastRender"),
                      ee.a.commit("setIsLogin", "0"),
                      e();
                  }
                } else {
                  if (
                    (clearTimeout(this.appLoginTimeout.timer),
                    this.appLoginTimeout.value)
                  )
                    return;
                  this.timeData.eTime1 =
                    "appUserInfo error eTime1 is " +
                    new Date().getTime().toString();
                  try {
                    this.sendH5ErrorLog({
                      info: {
                        exampleId: "ERROR",
                        exampleName: "H5错误日志",
                        name: "login",
                      },
                      h5ErrorLog: JSON.stringify(this.timeData),
                      envName: "appUserInfo获取不到",
                    });
                  } catch {}
                  let e = window.location.href,
                    t = encodeURIComponent(e);
                  window.$utils.showRightsLogin(t, !0);
                }
              else if (this.code && "qycswb" == this.$route.query.channelCode)
                (this.userInfo = l.a.getValue(l.a.USER_INFO) || {}),
                  (function (e) {
                    return Object(n.a)({
                      url: "/coc3-user-center/open/api/weibo/authAndBindPhone",
                      method: "post",
                      data: e,
                    });
                  })({ code: this.code, token: this.userInfo.phone })
                    .then((t) => {
                      0 == t.code && window.ydConsole("微博绑定成功"), e();
                    })
                    .catch((t) => {
                      e();
                    });
              else if (this.code && this.accountId && Object(a.z)())
                14 == this.accountId
                  ? (function (e) {
                      return Object(n.a)({
                        url: "https://dev.coc.10086.cn/coc/wechat/user/getOpenIdByCode",
                        method: "post",
                        data: e,
                      });
                    })({ code: this.code, accountId: this.accountId })
                      .then((t) => {
                        if (t.code + "" == "0") {
                          window.ydConsole(t, "芒果卡微信公众号单点");
                          let i = this;
                          Object(ne.a)(
                            t.data,
                            5,
                            e,
                            this.instanceRuleDimensionTypeSet,
                            "",
                            "",
                            "MG",
                            {},
                            i
                          );
                        } else e();
                      })
                      .catch((t) => {
                        e();
                      })
                  : (function (e) {
                      return Object(n.a)({
                        url: "/coc3-user-center/open/api/wechat-mp/getOpenidByCode",
                        method: "post",
                        data: e,
                      });
                    })({ wechatCode: this.code })
                      .then((t) => {
                        if (t.code + "" == "0") {
                          sessionStorage.setItem(
                            "HkOpenIdByCode",
                            JSON.stringify(t.data || {})
                          ),
                            window.ydConsole(t, "移动花卡微信公众号单点");
                          let i = this;
                          Object(ne.a)(
                            t.data.openid,
                            5,
                            e,
                            this.instanceRuleDimensionTypeSet,
                            "",
                            "",
                            "HK",
                            {},
                            i
                          );
                        } else e();
                      })
                      .catch((t) => {
                        e();
                      });
              else if (this.token) {
                let t = this;
                Object(ne.a)(
                  this.token,
                  8,
                  () => {
                    e(), this.clearUrlParams("token");
                  },
                  this.instanceRuleDimensionTypeSet,
                  "",
                  "",
                  "",
                  {},
                  t
                );
              } else if (this.artifact) {
                let t = this;
                Object(ne.a)(
                  this.artifact,
                  4,
                  e,
                  this.instanceRuleDimensionTypeSet,
                  "",
                  "",
                  "",
                  {},
                  t
                ),
                  this.clearUrlParams("artifact");
              } else if (this.actSign) {
                let t = this;
                Object(ne.a)(
                  this.actSign,
                  9,
                  e,
                  this.instanceRuleDimensionTypeSet,
                  "",
                  "",
                  "",
                  {},
                  t
                ),
                  this.clearUrlParams("actSign");
              } else
                e(),
                  this.wechatCode &&
                    this.wechatToken &&
                    (this.miniproLoginVisible = !0);
            },
            onLoad() {
              window.ydConsole("onload"),
                (-1 === this.page.indexOf("home") &&
                  -1 === this.page.indexOf("ghtest28")) ||
                  setTimeout(() => {
                    window.ydConsole("onLoad-setTimeout"),
                      this.tempList.length > 0
                        ? (this.info.push(this.tempList[this.loadCount]),
                          this.loadCount++,
                          (this.loading = !1),
                          this.info.length === this.tempList.length &&
                            (this.finished = !0))
                        : this.onLoad();
                  }, 100);
            },
            clearUrlParams(e) {
              let t = this.$route.params.page,
                i = { ...this.$route.query };
              i && i[e] && delete i[e],
                this.$router.replace({ path: t, query: i });
            },
            getUrlKey: function (e, t) {
              return (
                decodeURIComponent(
                  (new RegExp("[?|&]" + e + "=([^&;]+?)(&|#|;|$)").exec(t) || [
                    ,
                    "",
                  ])[1].replace(/\+/g, "%20")
                ) || null
              );
            },
            appTokenLogin(e, t) {
              try {
                window.ydConsole("未登录", new Date().getTime().toString());
                let i = {
                  debug: !1,
                  sourceId: "056002",
                  success: (i) => {
                    if (!this.appLoginTimeout.value)
                      if (
                        (window.ydConsole(
                          i,
                          "获取token成功",
                          new Date().getTime().toString()
                        ),
                        (this.timeData.sourceId = "056002"),
                        (this.timeData.sTime3 = new Date()
                          .getTime()
                          .toString()),
                        i.token)
                      ) {
                        let s = this;
                        Object(ne.a)(
                          i.token,
                          11,
                          e,
                          this.instanceRuleDimensionTypeSet,
                          { md5phone: t, updateTime: new Date().getTime() },
                          this.appLoginTimeout,
                          "",
                          this.timeData,
                          s,
                          this.appUserInfo.token
                        );
                      } else
                        clearTimeout(this.appLoginTimeout.timer),
                          this.appUidLogin(e, t);
                  },
                  error: (e) => {
                    if (
                      (clearTimeout(this.appLoginTimeout.timer),
                      this.appLoginTimeout.value)
                    )
                      return;
                    (this.timeData.sourceId = "056002"),
                      (this.timeData.error = e),
                      (this.timeData.eTime1 =
                        "getYDRZToken error eTime1 is " +
                        new Date().getTime().toString());
                    try {
                      this.sendH5ErrorLog({
                        info: {
                          exampleId: "ERROR",
                          exampleName: "H5错误日志",
                          name: "login",
                        },
                        h5ErrorLog: JSON.stringify(this.timeData),
                        envName: "getYDRZToken error",
                      });
                    } catch {}
                    let t = window.location.href,
                      i = encodeURIComponent(t);
                    window.$utils.showRightsLogin(i, !0);
                  },
                };
                Object(a.k)() > 1020 && (i.allowabnormal = 1),
                  cmcc.getYDRZToken(i);
              } catch (e) {
                window.ydConsole(e, "版本报错");
              }
            },
            initShare() {
              let e = "",
                t = l.a.getValue(l.a.CHANNEL_VALUE) || "P00000011939",
                i = this.shareTitle,
                s = this.shareDescription,
                o = this.shareRedirectUrl,
                n = this.sharePictureUrl;
              if (o) {
                let i = -1 !== o.indexOf("channelCode");
                e =
                  -1 !== o.indexOf("?")
                    ? o + "&channelCode=" + t
                    : i
                    ? o
                    : o + "?channelCode=" + t;
              }
              if (i && -1 !== i.indexOf("{salename}")) {
                const t = this.$store.state.goods_logo,
                  o = this.$store.state.goods_name;
                (i = i.replace(/{salename}/g, o)),
                  window.ydConsole(i, "shareTitle-20220104"),
                  (s = "这里有好多会员权益，速点>>"),
                  (e = window.location.href.replace(/&accountId=[0-9]+/, "")),
                  (e = e.replace(/&pageRecorded=true/, "")),
                  (e = e.replace(/&pageKey=[0-9]+/, "")),
                  "" !== t && (n = t),
                  window.ydConsole("rights=====goods_name", o),
                  window.ydConsole("rights=====goods_logo", t);
              } else
                "mshyswdetail" == Object(a.D)(location.href) &&
                  ((e = window.location.href.replace(/&accountId=[0-9]+/, "")),
                  (e = e.replace(/&pageRecorded=true/, "")),
                  (e = e.replace(/&pageKey=[0-9]+/, "")));
              var c;
              Object(a.x)() &&
                wx.miniProgram.postMessage({
                  data: { title: i, imageUrl: this.sharePictureUrl, path: e },
                }),
                Object(a.z)() &&
                  r({
                    title: i,
                    desc: s,
                    imgUrl: this.sharePictureUrl,
                    link: e,
                    wxShareSuccess: () => {
                      this.dialogShareList.forEach((e) => {
                        e.handleCloseWei(), e.sendCode();
                      }),
                        this.taskShare();
                    },
                  }),
                Object(a.s)() &&
                  (this.verticalVipPages.includes(this.$route.params.page)
                    ? cmcc.hiddenShareButton({
                        success: function (e) {},
                        error: function (e) {},
                      })
                    : Object(a.J)() &&
                      (Object(a.o)().ios &&
                        (window.ydConsole("ios删除分享图标，再重新创建"),
                        cmcc.hiddenShareButton({
                          success: function (e) {},
                          error: function (e) {},
                        })),
                      (c = { title: i, link: e, imgUrl: n, content: s }),
                      cmcc.enableShared({
                        debug: !1,
                        enable: !0,
                        shareObj: c,
                        success: function (e) {
                          c && c.success && c.success();
                        },
                        error: function (e) {},
                      }))),
                Object(a.w)() &&
                  MgtvApi.showShareMenus({
                    title: i,
                    desc: s,
                    shareUrl: e,
                    shareIcon: n,
                  });
            },
            taskShare() {
              if (
                (window.ydConsole("分享成功啦2"),
                (this.userInfo = l.a.getValue(l.a.USER_INFO)),
                window.ydConsole(
                  "登录状态判断",
                  this.userInfo && this.userInfo.phone
                ),
                this.userInfo && this.userInfo.phone)
              ) {
                let e = this.$router.history.current.query,
                  t =
                    l.a.getValue(l.a.PAGE_INFO) &&
                    JSON.parse(l.a.getValue(l.a.PAGE_INFO)),
                  i = { phone: this.userInfo.phone || "" },
                  s = {
                    channelCode:
                      e.channelCode ||
                      l.a.getValue(l.a.CHANNEL_VALUE) ||
                      "P00000011939",
                    visitUrl: t.path,
                  };
                window.ydConsole("相关参数", e, i, s),
                  (function (e = {}, t = {}) {
                    return Object(h.a)({
                      url: re + "/cmpp-manage/task/share",
                      method: "post",
                      data: e,
                      headers: t,
                    });
                  })(s, i).then((e) => {
                    window.ydConsole("响应", e),
                      0 == e.resultCode &&
                        (this.bus.$emit("castLotGetLeftChance"),
                        this.picLotteryList.forEach((e) => {
                          e.getLeftChance();
                        }),
                        setTimeout(() => {
                          window.ydConsole("更新任务数据2"),
                            this.bus.$emit("updateTaskStatus");
                        }, 500));
                  });
              }
            },
            setMaxMemberLevel(e) {
              const t = e ? e.split(",") : "",
                i = t ? Math.max(...t) : "";
              l.a.setValue("page_max_vip_level", i);
            },
            getPageURL(e) {
              return /^(https?):\/\//.test(e)
                ? e
                : `${window.VUE_APP_PATH_NAME}${this.$route.params.env}/${e}`;
            },
            async dealData(e, t) {
              if ("onlySkipDealdata" == t)
                return (
                  window.ydConsoleInfo("6611,onlySkipDealdata"),
                  void (this.preloadData = e)
                );
              if ("onlyDealdata" == t) {
                window.ydConsoleInfo("6611,onlyDealdata", this.preloadData);
                const t = () =>
                    new Promise((e) => {
                      setTimeout(e, 500);
                    }),
                  i = async () => {
                    for (; !this.preloadData; ) await t();
                  };
                await i(),
                  (e = JSON.parse(JSON.stringify(this.preloadData))),
                  (this.preloadData = "");
              }
              let {
                isLogin: i,
                title: s,
                shareTitle: o,
                shareDescription: n,
                sharePictureUrl: r,
                shareRedirectUrl: c,
                specify: d,
                path: h,
                isGrey: p,
                loginOption: u,
                loginUrl: g,
                isMembership: m,
                isRefresh: f,
                pageType: y,
                limitMemberLevel: w,
                isTouchCode: v,
                touchCode: C,
                isForcedPull: b,
                forcedPullEnd: S,
                isInstallApp: I,
                isHallShare: k,
                language: O,
              } = e;
              (this.language = O),
                this.setMaxMemberLevel(w),
                (this.tempVarRefresh = !!f),
                l.a.setValue(
                  l.a.PAGE_INFO,
                  JSON.stringify({
                    path: e.path,
                    id: e.id,
                    name: e.name,
                    activityHotTips: e.activityHotTips || "",
                    cancelGsm: e.cancelGsm || "",
                    autoAuthCode: e.autoAuthCode || "",
                    myVipErrorMessage: e.myVipErrorMessage || "",
                    cancelRepeatMyVip: e.cancelRepeatMyVip || "",
                    pageType: e.pageType || "",
                    isHallShare: void 0 === k ? 1 : e.isHallShare,
                    isForcedPull: e.isForcedPull,
                  })
                ),
                this.setCurrentPageInfo({
                  path: e.path,
                  id: e.id,
                  name: e.name,
                  originPath: Object(a.D)(window.location.href),
                  shareTitle: o,
                  shareDescription: n,
                  sharePictureUrl: r,
                  shareRedirectUrl: c,
                  title: s,
                }),
                this.setPageHistoryPage(),
                this.listeningPage(),
                sessionStorage.getItem("currentTitle") &&
                  ((s = sessionStorage.getItem("currentTitle")),
                  sessionStorage.removeItem("currentTitle")),
                (document.title = s || "中国移动"),
                (this.shareTitle = o),
                (this.shareRedirectUrl = this.getPageURL(c)),
                (this.shareDescription = n),
                (this.sharePictureUrl = r),
                (this.isGrey = p ? 1 : 0),
                window.sessionStorage.setItem("isGrey", this.isGrey),
                this.showNavCustomBtn(),
                this.initShare(),
                (this.page = h),
                (this.showLoading = !1);
              let A = JSON.parse(d);
              if ("refresh" == t) {
                if (Object(a.s)()) {
                  let e = sessionStorage.getItem("backup")
                    ? JSON.parse(sessionStorage.getItem("backup"))
                    : "";
                  if ((window.ydConsole("查看backup", e), e)) {
                    let { autobuy: t, abExampleId: i } = e;
                    sessionStorage.setItem("autobuy", t),
                      sessionStorage.setItem("abExampleId", i),
                      sessionStorage.removeItem("backup"),
                      window.ydConsole("备份复原缓存，清除备份", t, i);
                  }
                }
                (this.oldInfo = this.getCurInfo()),
                  window.ydConsole(
                    "这是二次渲染",
                    new Date().getTime().toString()
                  ),
                  (this.refreshPage = this.page),
                  setTimeout(() => {
                    this.refreshPage = "";
                  }, 4e4),
                  A.map((e) => {
                    (e.refreshKey = e.id + "0"),
                      "Rights-DialogComp" == e.moduleId && (e.hide = !0),
                      "Rights-NoviceguidanceComp" == e.moduleId &&
                        (e.hide = !0);
                  }),
                  this.setInfo(A, t),
                  (this.refreshKeyFlag = !1),
                  ee.a.commit("changeRenderStatus", "allRenderDone"),
                  (this.finished = !0);
              } else if (this.refreshPage && this.refreshPage == this.page)
                this.refreshPage = "";
              else {
                if (
                  (A.map((e) => {
                    if (
                      ((e.refreshKey = e.id),
                      "Rights-DialogComp" == e.moduleId && (e.hide = !0),
                      "Rights-NoviceguidanceComp" == e.moduleId)
                    ) {
                      let t = localStorage.getItem("noviceguidanceShowed"),
                        i = !1;
                      (i = !t || null === t),
                        sessionStorage.setItem(
                          "renderComps",
                          JSON.stringify({ NoviceguidanceComp: i })
                        ),
                        (e.hide = !0);
                    }
                    "Rights-BusinessOpportunityComp" == e.moduleId &&
                      (e.hide
                        ? sessionStorage.setItem("hasBusinessOpportunity", !1)
                        : sessionStorage.setItem("hasBusinessOpportunity", !0));
                  }),
                  "startLastRender" == this.$store.state.renderStatus
                    ? (ee.a.commit("changeRenderStatus", "allRenderDone"),
                      (this.finished = !0))
                    : ee.a.commit("changeRenderStatus", "firstRenderDone"),
                  this.setInfo(A, t),
                  this.isHomePage &&
                    localStorage.setItem("lastHomeInfo", JSON.stringify(A)),
                  "onlyDealdata" == t)
                )
                  try {
                    window.timePoint.set("get_strategy_iop_info_start"),
                      this.strategyCenterShuntRule(),
                      this.IopListRule();
                  } catch (e) {
                    window.ydConsole(e);
                  }
                this.compareUserOtherInfo();
              }
              let L = Object(a.g)();
              if (
                (l.a.getIsLogin() ||
                  Object(a.s)() ||
                  0 != u ||
                  1 != i ||
                  L ||
                  !b ||
                  Object(a.s)() ||
                  Object(a.r)() ||
                  Object(a.x)() ||
                  sessionStorage.setItem("disableLogin", !0),
                !l.a.getIsLogin() && i)
              )
                if (Object(a.s)()) cmcc.showLogin();
                else if (0 == u) {
                  if (1 == i && "login" !== this.$route.path.split("/")[2]) {
                    const e = window.location.href,
                      t = encodeURIComponent(e);
                    window.$utils.showRightsLogin(t);
                  }
                } else if (1 == u) {
                  const e = window.location.href;
                  let t = { backUrl: encodeURIComponent(e) };
                  this.$route.query.channelCode &&
                    (t.channelCode = this.$route.query.channelCode),
                    this.$router.push({
                      path: `/${this.$route.params.env}/${g}`,
                      query: t,
                    });
                } else 2 == u && (this.dialogLoginVisible = !0);
              let R = this.$route.params.page;
              if (ee.a.state.memberIdPath.includes(R) || m)
                ee.a.commit("setMemberIdPath", R), Object(a.C)(!0);
              else {
                let e = { ...this.$route.query };
                delete e.memberId, this.$router.replace({ path: R, query: e });
              }
              I && sessionStorage.setItem("isInstallApp", !0),
                L ||
                  1 != v ||
                  null == v ||
                  Object(a.s)() ||
                  Object(a.r)() ||
                  Object(a.x)() ||
                  A.some((e) => "Rights-WakeupAppToUrlComp" == e.moduleId) ||
                  sessionStorage.getItem("CarWide") ||
                  Object(a.o)().pc ||
                  ((this.isTouchCode = !0), (this.touchCode = C)),
                L ||
                  !b ||
                  sessionStorage.getItem("wakeupAppRrr") ||
                  Object(a.s)() ||
                  Object(a.r)() ||
                  Object(a.x)() ||
                  sessionStorage.getItem("CarWide") ||
                  Object(a.o)().pc ||
                  (this.sendExposurVisit({
                    info: this.EventTrackingInfo,
                    pointPosition: "pullapp_show",
                    envName: "功能曝光",
                  }),
                  console.log("强制拉端1"),
                  (this.isForceUpApp = !0),
                  (this.forcedPullEnd = S));
            },
            recordSortPosition() {
              let e = this.$route.path.slice(
                this.$route.path.lastIndexOf("/") + 1,
                this.$route.path.length
              );
              -1 !== e.indexOf("sort") &&
                document.querySelector(".tabs-content") &&
                sessionStorage.setItem(
                  "scrollTop" + e,
                  document.querySelector(".tabs-content").scrollTop
                );
            },
            isAPPJump(e, t, i) {
              try {
                this.sendH5ErrorLog({
                  info: {
                    exampleId: "ERROR",
                    exampleName: "H5错误日志",
                    name: "jump",
                  },
                  h5ErrorLog: JSON.stringify({
                    info: e,
                    needWebView: i,
                    timestamp: new Date().getTime(),
                  }),
                  envName: "页面跳转",
                });
              } catch {}
              !sessionStorage.getItem("miniproBar_hasJumpFlag") &&
                Object(a.x)() &&
                (ee.a.commit("setStateParams", {
                  key: "jumpToUrlFlag",
                  value: !0,
                }),
                sessionStorage.setItem("miniproBar_hasJumpFlag", 1)),
                (e = e.replace(/\s+/g, ""));
              let s = localStorage.getItem("jumpToType"),
                o = !1;
              s && "transfer" == s
                ? (localStorage.removeItem("jumpToType"), (o = !0))
                : (o = !1),
                t
                  ? location.replace(e)
                  : setTimeout(() => {
                      Object(a.s)() &&
                      (-1 !== this.$route.path.indexOf("home") || i)
                        ? (this.historyBeforeJump(e, !0),
                          (window.newWebview_flg = !0),
                          window.cmcc.newWebview({
                            debug: !1,
                            markID: "",
                            type: "",
                            funCode: "",
                            bizCode: "",
                            url: e,
                            success: function (e) {
                              window.ydConsole(e);
                            },
                            error: function (e) {
                              window.ydConsole(e);
                            },
                          }))
                        : (this.historyBeforeJump(e),
                          this.recordSortPosition(),
                          (window.newWebview_flg = !1),
                          o ? location.replace(e) : (location.href = e));
                    }, 300);
            },
            jumpTo(e, t, i, s) {
              if (e) {
                this.setJumpToastInfo({
                  callback: () => {
                    window.ydConsole("this", this), this.jumpToFunc(e, !1, i);
                  },
                }),
                  this.jumpToastInfo.jumpToastArr.some(
                    (i) => (
                      i &&
                        e.includes(i) &&
                        this.setJumpToastInfo({ show: !0, info: t || "" }),
                      e.includes(i)
                    )
                  ) || this.jumpToFunc(e, !1, i);
              }
            },
            clearUrlParam(e, t = []) {
              if (e.indexOf("?") > 0) {
                let i = e
                  .substring(e.indexOf("?") + 1)
                  .split("&")
                  .reduce(
                    (e, i) =>
                      e +
                      (t.includes(i.split("=")[0])
                        ? ""
                        : "&" + i.split("=")[0] + "=" + i.split("=")[1]),
                    []
                  );
                return (
                  e.substring(0, e.indexOf("?")) +
                  (i ? "?" + i.substring(1) : "")
                );
              }
              return e;
            },
            async jumpToFunc(e, t = !1, i = !1) {
              if (
                (window.ydConsole("link", e),
                (this.userInfo = l.a.getValue(l.a.USER_INFO)),
                e.includes("sourceid"))
              ) {
                window.ydConsole("有sourceid");
                let s = "12006",
                  o = this.getUrlKey("sourceid", e);
                window.ydConsole("targetsourceid", o);
                let n = this.clearUrlParam(e, ["sourceid"]);
                window.ydConsole("去掉sourceid的url", n);
                let r = !1;
                e.includes("mgtv.com") && (r = !0);
                let l = !1;
                e.includes("https://wx.10086.cn/website/sso/netUni") &&
                  (l = !0);
                let c = r ? "tk" : l ? "netUniToken" : "token";
                if (this.userInfo && 4 == this.userInfo.loginType)
                  this.isAPPJump(
                    `https://portal.cmpassport.com/sso-aggregator/index.html?channelID=${s}&sourceID=${o}&backUrl=${encodeURIComponent(
                      n
                    )}`,
                    t,
                    i
                  );
                else if (
                  !this.userInfo ||
                  (11 != this.userInfo.loginType &&
                    8 != this.userInfo.loginType &&
                    6 != this.userInfo.loginType &&
                    7 != this.userInfo.loginType)
                ) {
                  this.recordSortPosition();
                  let s = await this.handleServiceData(e);
                  s &&
                    (n =
                      n.includes("&") || n.includes("?")
                        ? `${n}&ext=${s}`
                        : `${n}?${c}=${s}`),
                    this.isAPPJump(n, t, i);
                } else
                  try {
                    let s = await Object(a.l)(o);
                    if (s)
                      if ((window.ydConsole("authToken", s), "017023" == o))
                        n =
                          e.includes("&") || e.includes("?")
                            ? `${e}&${c}=${s}`
                            : `${e}?${c}=${s}`;
                      else if (e.includes("esom-h5.haida2001.com")) {
                        window.ydConsole(
                          "手机保跳链特殊处理loginChannel",
                          this.userInfo.loginChannel
                        );
                        let e =
                          this.userInfo && 2 == this.userInfo.loginChannel
                            ? "026020"
                            : "056002";
                        window.ydConsole("手机保sourcecode", e);
                        const t = window.location.href;
                        let i = `sourcecode=${e}&token=${s}&backUrl=${encodeURIComponent(
                          t
                        )}`;
                        (n =
                          n.includes("&") || n.includes("?")
                            ? `${n}&${i}`
                            : `${n}?${i}`),
                          window.ydConsole("手机保url", n);
                      } else
                        n =
                          n.includes("&") || n.includes("?")
                            ? `${n}&${c}=${s}`
                            : `${n}?${c}=${s}`;
                    else
                      "017023" == o
                        ? ((n = !1), this.$toast("请稍后再试"))
                        : (n = n);
                    if (n) {
                      this.recordSortPosition();
                      let s = await this.handleServiceData(e);
                      s &&
                        (n =
                          n.includes("&") || n.includes("?")
                            ? `${n}&ext=${s}`
                            : `${n}?${c}=${s}`),
                        window.ydConsole(n, "url"),
                        this.isAPPJump(n, t, i);
                    }
                  } catch (e) {
                    "017023" == o && this.$toast("请稍后再试");
                  }
              } else if (e.includes("avenueid")) {
                let s = this.getUrlKey("avenueid", e),
                  o = this.getUrlKey("newFlag", e),
                  n = this.clearUrlParam(e, ["avenueid", "newFlag"]);
                this.userInfo && this.userInfo.phone
                  ? J.a
                      .getPnsign(
                        { channelId: s },
                        { token: this.userInfo.phone }
                      )
                      .then((e) => {
                        e.data &&
                          (n =
                            n.includes("?") || n.includes("&")
                              ? o
                                ? `${n}&mark=${e.data.mbmask}`
                                : `${n}&mark=${e.data.pnsign}`
                              : o
                              ? `${n}?mark=${e.data.mbmask}`
                              : `${n}?mark=${e.data.pnsign}`),
                          this.isAPPJump(n, t, i);
                      })
                  : this.isAPPJump(n, t, i);
              } else if ("2.0" == this.getUrlKey("loginVersion", e)) {
                let s = this.clearUrlParam(e, ["loginVersion"]);
                this.userInfo && this.userInfo.phone
                  ? J.a
                      .getAccessToken({ token: this.userInfo.phone })
                      .then((o) => {
                        0 == o.code && o.data && (s = `${e}&mark=${o.data}`),
                          this.isAPPJump(s, t, i);
                      })
                      .catch((e) => {
                        this.isAPPJump(s, t, i);
                      })
                  : this.isAPPJump(s, t);
              } else if ("https://sms.czfw.cn/QuanYi/CZMSQGB/Index" == e) {
                const e = (s) => {
                  this.userInfo && this.userInfo.phone
                    ? J.a
                        .getSecretaryToken({
                          token: this.userInfo.phone,
                          type: s,
                        })
                        .then((o) => {
                          window.ydConsole(o, "车主秘书"),
                            0 == o.code
                              ? o.data && null !== o.data
                                ? this.isAPPJump(
                                    "https://sms.czfw.cn/ykwebservice/loginSSO/access?" +
                                      o.data,
                                    t,
                                    i
                                  )
                                : 1 == s
                                ? e(2)
                                : this.isAPPJump(
                                    "https://sms.czfw.cn/QuanYi/CZMSQGB/Index",
                                    t,
                                    i
                                  )
                              : this.isAPPJump(
                                  "https://sms.czfw.cn/QuanYi/CZMSQGB/Index",
                                  t,
                                  i
                                );
                        })
                    : this.isAPPJump(
                        "https://sms.czfw.cn/QuanYi/CZMSQGB/Index",
                        t,
                        i
                      );
                };
                this.$dialog
                  .alert({
                    message:
                      "即将跳转到“车主秘书”专区，该专区由第三方提供服务。",
                    theme: "round-button",
                    confirmButtonColor: "#4CA2E5",
                    confirmButtonText: "我知道了",
                    showCancelButton: !0,
                    className: "vantDialog",
                  })
                  .then(() => {
                    e(1);
                  })
                  .catch((e) => {});
              } else if (
                e.includes(
                  "https://wx.10086.cn/website/customerService/auth/vfPh7s2yrEJ9IlpS2juGNyB8mfaXFV0G?provinceCode=000"
                )
              )
                if (window.location.href.includes("detail")) {
                  let s = await this.queryGoodsIdBySkuId(),
                    o = JSON.parse(sessionStorage.getItem("serviceInfo"));
                  o.goodsId = s;
                  let n = JSON.stringify(o),
                    a = encodeURIComponent(n),
                    r = e + "&ext=" + a;
                  this.isAPPJump(r, t, i);
                } else this.isAPPJump(e, t, i);
              else if (Object(a.u)(e))
                if (Object(a.s)()) {
                  let s = (sessionStorage.getItem("appVersion") || "0.0.0")
                      .split(".")
                      .join(""),
                    o = Object(a.o)();
                  (o.android && s >= 790) || (o.ios && s >= 890)
                    ? this.isAPPJump(Object(L.b)(e), t, i)
                    : this.isAPPJump(Object(L.b)(e), t, !0);
                } else Object(a.U)(e);
              else if (e.includes("https://chinamobileapp/rn"))
                if (Object(a.s)()) {
                  const s = navigator.userAgent;
                  let o = /OpenHarmony/i.test(s)
                    ? Object(a.k)() < 1e3
                    : Object(a.k)() < 1170;
                  if (
                    e.includes(
                      "https://chinamobileapp/rn/common/QW2501130001"
                    ) &&
                    Object(L.a)("h5Link", e)
                  )
                    if (o) {
                      let s = e.split("h5Link=")[1];
                      (s = s.replace(/^([^&]+)&/, "$1?")),
                        this.isAPPJump(Object(L.b)(s), t, i);
                    } else this.isAPPJump(Object(L.b)(e), t, !0);
                  else
                    o ? (this.lowerVersionShow = !0) : this.isAPPJump(e, t, !0);
                } else if (
                  e.includes("https://chinamobileapp/rn/common/QW2501130001") &&
                  Object(L.a)("h5Link", e)
                ) {
                  let s = e.split("h5Link=")[1];
                  (s = s.replace(/^([^&]+)&/, "$1?")),
                    this.isAPPJump(Object(L.b)(s), t, i);
                } else
                  Object(a.r)() || Object(a.x)()
                    ? this.$toast(
                        "该内容需在中国移动 APP 查看，建议您打开 APP 浏览～"
                      )
                    : Object(a.U)(window.location.href);
              else this.isAPPJump(Object(L.b)(e), t, i);
            },
            async queryGoodsIdBySkuId() {
              try {
                let e = { skuId: sessionStorage.getItem("currentSku") };
                const t = await Object(ae.e)(e);
                if (0 == t.code) return t.data.goodsId ? t.data.goodsId : "";
              } catch (e) {
                return window.ydConsole(e, "========error"), "";
              }
            },
            async handleServiceData(e) {
              if (
                e.includes(
                  "https://wx.10086.cn/website/customerService/auth/vfPh7s2yrEJ9IlpS2juGNyB8mfaXFV0G?provinceCode=000"
                )
              ) {
                if (window.location.href.includes("detail")) {
                  let e = await this.queryGoodsIdBySkuId(),
                    t = JSON.parse(sessionStorage.getItem("serviceInfo"));
                  t.goodsId = e;
                  let i = JSON.stringify(t);
                  return encodeURIComponent(i);
                }
                return !1;
              }
              return !1;
            },
            async checkAllInstanceRule() {
              window.ydConsole("checkAllInstanceRule");
              let e,
                t = this;
              e = this.info;
              for (let t = 0; t < this.ruleAndInstanceList.length; t++) {
                let i = this.ruleAndInstanceList[t],
                  s = e.findIndex((e) => e.id == i.instanceId),
                  o = await this.checkRule(i.ruleDetails);
                s > -1 && this.$set(e[s], "hide", !o);
              }
              await (async function () {
                if ("{}" != JSON.stringify(t.instanceChildRulelist))
                  for (let i of Object.keys(t.instanceChildRulelist)) {
                    let s = JSON.parse(
                      t.instanceChildRulelist[i].instance.specify
                    );
                    s.linkDataSourceList = s.linkDataSourceList || [
                      "goodsList",
                    ];
                    for (let e = 0; e < s.linkDataSourceList.length; e++) {
                      let o = s.linkDataSourceList[e],
                        n = s[o] || [];
                      for (let s = 0; s < n.length; s++) {
                        n[s].ruleList;
                        t.instanceChildRulelist[i].ruleDetails.length &&
                          (n[s].ruleHide = !(await t.checkRule(
                            t.instanceChildRulelist[i].ruleDetails[e][s]
                          )));
                      }
                      s[o] = n;
                    }
                    let o = e.findIndex(
                      (e) => e.id == t.instanceChildRulelist[i].instance.id
                    );
                    o > -1 && t.$set(e[o], "specify", JSON.stringify(s));
                  }
              })();
            },
            compareUserOtherInfo() {
              let e =
                l.a.getIsLogin() &&
                "true" === localStorage.getItem("appLoginTimeout");
              if (
                !l.a.getIsLogin() ||
                this.$route.query.actSign ||
                this.$route.query.token ||
                (Object(a.s)() && !e)
              )
                return void (
                  !l.a.getIsLogin() &&
                  ee.a.commit("changeRenderStatus", "allRenderDone")
                );
              this.oldInfo = this.getCurInfo();
              let t = l.a.getValue(l.a.USER_INFO),
                i = {
                  phone: t.phone,
                  channelCode:
                    l.a.getValue(l.a.CHANNEL_VALUE) || "P00000011939",
                },
                s = l.a.getValue(l.a.VIP_INFO);
              Object(a.f)() &&
              s &&
              s.refreshTime &&
              new Date().getTime() - s.refreshTime <= 12e4
                ? (ee.a.commit("setVipFlag", !0), this.allInfoGot())
                : J.a
                    .getVipInfo(i)
                    .then((e) => {
                      if (
                        509 == e.resultCode ||
                        503 == e.resultCode ||
                        506 == e.resultCode ||
                        510 == e.resultCode ||
                        400130 == e.resultCode
                      )
                        Object(a.O)() &&
                          this.$store.commit("setVipErrorPopupShow", !0);
                      else if (-1 == e.resultCode) {
                        const t = e.data || "";
                        l.a.setValue(l.a.VIP_INFO, Object(a.j)(t)),
                          l.a.setIsLogin(0),
                          this.$store.commit("setIsLogin", "0"),
                          Object(a.s)() || location.reload();
                      } else {
                        const t = e.data || "";
                        l.a.setValue(l.a.VIP_INFO, Object(a.j)(t));
                      }
                    })
                    .catch(() => {
                      Object(a.O)() &&
                        this.$store.commit("setVipErrorPopupShow", !0);
                    })
                    .finally(() => {
                      ee.a.commit("setVipFlag", !0), this.allInfoGot();
                    }),
                Object(a.e)()
                  ? (ee.a.commit("setGsmFlag", !0), this.allInfoGot())
                  : Object(d.b)({ token: t.phone })
                      .then((e) => {
                        101 == e.code &&
                          (l.a.setIsLogin(0),
                          this.$store.commit("setIsLogin", "0"),
                          Object(a.s)() || location.reload()),
                          window.localStorage.setItem(
                            "gsmVipLevel",
                            e && e.data && e.data.level ? e.data.level : null
                          ),
                          window.localStorage.setItem(
                            "isGsmVip",
                            !!(e && e.data && e.data.flag) && e.data.flag
                          );
                      })
                      .finally((e) => {
                        ee.a.commit("setGsmFlag", !0), this.allInfoGot();
                      });
            },
            allInfoGot(e) {
              let t = ee.a.state.strategyFlag,
                i = ee.a.state.iopFlag,
                s = ee.a.state.vipFlag,
                o = ee.a.state.gsmFlag;
              if (
                (t && i && window.timePoint.set("get_strategy_iop_info_done"),
                s && o && t && i)
              ) {
                let t = this.getCurInfo(),
                  i = ee.a.state.iopChange,
                  s = ee.a.state.strategyChange,
                  o = JSON.stringify(this.oldInfo) != JSON.stringify(t);
                !e && (o || i || s)
                  ? (o
                      ? JSON.stringify(this.oldInfo.myVip) !=
                        JSON.stringify(t.myVip)
                        ? (window.timePoint.needRefreshType = 0)
                        : (window.timePoint.needRefreshType = 1)
                      : i
                      ? (window.timePoint.needRefreshType = 2)
                      : s && (window.timePoint.needRefreshType = 3),
                    ee.a.commit("setNeedRefresh", "1"))
                  : "firstRenderDone" == ee.a.state.renderStatus ||
                    "allRenderDone" == ee.a.state.renderStatus
                  ? ee.a.commit("changeRenderStatus", "allRenderDone")
                  : ee.a.commit("changeRenderStatus", "startLastRender");
              }
            },
            getCurInfo: () => ({
              myVip: JSON.stringify(
                l.a.getValue(l.a.VIP_INFO)
                  ? l.a.getValue(l.a.VIP_INFO).myVip
                  : ""
              ),
              isGsmVIp: localStorage.getItem("isGsmVip"),
              gsmVipLevel: localStorage.getItem("gsmVipLevel"),
            }),
            onRefresh() {
              location.href = location.href;
            },
            touchmoveHandler(e) {
              if (!this.refreshFlag) {
                let t = e.touches[0].pageY - this.touchstartPosY;
                0 == this.getScrollTop(e) && t > 0
                  ? e.preventDefault()
                  : (this.refreshFlag = !0);
              }
            },
            touchestartHandler(e) {
              (this.tempRefreshFlag = this.refreshFlag),
                (this.touchstartPosY = e.touches[0].pageY);
            },
            touchendHandler() {
              this.refreshFlag = this.tempRefreshFlag;
            },
            getScrollTop(e) {
              var t = 0;
              return (
                (function e(i) {
                  i.scrollTop > 0
                    ? (t = i.scrollTop)
                    : "page-content" == i.id
                    ? document.documentElement &&
                      document.documentElement.scrollTop
                      ? (t = document.documentElement.scrollTop)
                      : document.body && (t = document.body.scrollTop)
                    : e(i.parentElement);
                })(e.target),
                t
              );
            },
            listeningPage() {
              if (
                (("hidden" !== document[this.changeState] &&
                  "prerender" !== document[this.changeState]) ||
                  (window.ydConsole(
                    "======最初页面不可见======" + new Date().getTime()
                  ),
                  (this.isVisibilityState = !1),
                  document.addEventListener(
                    this.visibilityChange,
                    this.switchTab,
                    !1
                  )),
                "visible" === document[this.changeState])
              ) {
                if (
                  (window.ydConsole(
                    `======最初${
                      this.changeState
                    }：页面可见======${new Date().getTime()}`
                  ),
                  (this.isVisibilityState = !0),
                  this.sendPageVisit(),
                  Object(T.e)("newSkuTrilateral") &&
                    "login" != this.$route.params.page)
                ) {
                  let e = Object(T.e)("newSkuTrilateral"),
                    t = new Date().getTime();
                  e + 18e5 > t && "mylist" != this.$route.params.page
                    ? this.jumpTo("mylist")
                    : e + 18e5 <= t &&
                      "home" != this.$route.params.page &&
                      (this.jumpTo("home"),
                      sessionStorage.removeItem("newSkuTrilateral"));
                }
                let e = sessionStorage.getItem("groupTrilateralReturnUrl");
                e &&
                  "login" != this.$route.params.page &&
                  (sessionStorage.removeItem("groupTrilateralReturnUrl"),
                  this.$route.params.page != Object(a.D)(e) && this.jumpTo(e)),
                  document.removeEventListener(
                    this.visibilityChange,
                    this.switchTab,
                    !1
                  );
              }
              this.$store.commit("setVisibilityState", this.isVisibilityState);
            },
            switchTab() {
              ("hidden" !== document[this.changeState] &&
                "prerender" !== document[this.changeState]) ||
                (window.ydConsole(
                  `======${
                    this.changeState
                  }：切换tab页面不可见======${new Date().getTime()}`
                ),
                (this.isVisibilityState = !1)),
                "visible" === document[this.changeState] &&
                  (window.ydConsole(
                    `======${
                      this.changeState
                    }：切换tab页面可见======${new Date().getTime()}`
                  ),
                  (this.isVisibilityState = !0),
                  this.sendPageVisit(),
                  document.removeEventListener(
                    this.visibilityChange,
                    this.switchTab,
                    !1
                  )),
                this.$store.commit(
                  "setVisibilityState",
                  this.isVisibilityState
                );
            },
            startProcess() {
              let { page: e, env: t } = this.$route.params;
              if (
                (window.ydConsoleInfo(
                  "6611,changeState——startProcess",
                  document[this.changeState]
                ),
                "visible" === document[this.changeState])
              ) {
                if (
                  ((this.isVisibilityState = !0),
                  this.$store.commit(
                    "setVisibilityState",
                    this.isVisibilityState
                  ),
                  window.timePoint.set("preload_user_enter"),
                  this.preloadFlag)
                )
                  if (l.a.getIsLogin()) {
                    window.ydConsoleInfo("6611,登录还没过期");
                    let i = l.a.getValue(l.a.USER_INFO),
                      s = l.a.getValue(l.a.LOGIN_FLAG).expires;
                    if (s) {
                      let o = Math.floor((s - new Date().getTime()) / 60 / 1e3);
                      window.ydConsoleInfo("6611,登录还有" + o + "分钟过期");
                      let n = this;
                      Object(a.H)(
                        i,
                        () => {
                          window.ydConsoleInfo("6611 initUserInfo callback"),
                            "onlySkipDealdata" == this.lastLabel &&
                              (window.timePoint.set("preload1_enter"),
                              this.getJSON(e, t, "onlyDealdata")),
                            "onlyUntilGetLayoutJson" == this.lastLabel &&
                              (this.apiPreload(),
                              window.timePoint.set("preload2_enter"),
                              this.getJSON(e, t, "onlyAfterGetLayoutJson"));
                        },
                        o,
                        "",
                        !1,
                        n
                      );
                    } else
                      window.ydConsoleInfo("6611,不知道登录什么时候过期"),
                        "onlySkipDealdata" == this.lastLabel &&
                          (window.timePoint.set("preload1_enter"),
                          this.loginAndGetjson(e, t, "onlyDealdata")),
                        "onlyUntilGetLayoutJson" == this.lastLabel &&
                          (this.apiPreload(),
                          window.timePoint.set("preload2_enter"),
                          this.loginAndGetjson(e, t, "onlyAfterGetLayoutJson"));
                  } else
                    window.ydConsoleInfo("6611,登录过期了"),
                      "onlySkipDealdata" == this.lastLabel &&
                        (window.timePoint.set("preload1_enter"),
                        this.loginAndGetjson(e, t, "onlyDealdata")),
                      "onlyUntilGetLayoutJson" == this.lastLabel &&
                        (this.apiPreload(),
                        window.timePoint.set("preload2_enter"),
                        this.loginAndGetjson(e, t, "onlyAfterGetLayoutJson"));
                else
                  window.ydConsoleInfo("6611,之前没有执行预加载渲染"),
                    this.apiPreload(),
                    this.loginAndGetjson(e, t);
                document.removeEventListener(
                  this.visibilityChange,
                  this.startProcess,
                  !1
                );
              } else
                (this.isVisibilityState = !1),
                  this.$store.commit(
                    "setVisibilityState",
                    this.isVisibilityState
                  );
            },
            listenAndSendLoadedLog() {
              "visible" === document[this.changeState] &&
                document.removeEventListener(
                  this.visibilityChange,
                  this.listenAndSendLoadedLog,
                  !1
                );
            },
            async needRefreshComps(e, t, i) {
              let s = !1;
              if (t && 0 !== t.length) {
                for (let i = 0; i < t.length; i++) {
                  let o = this.ruleAndInstanceList.find(
                      (e) => e.instanceId == t[i]
                    ),
                    n = !0;
                  o &&
                    ((n = await this.checkRule(o.ruleDetails)), n && (s = !0));
                  let a = e.findIndex((e) => e.id == t[i]);
                  a > -1 && this.$set(e[a], "hide", !n);
                }
                "Rights-NoviceguidanceComp" != i ||
                  s ||
                  ee.a.commit("setRenderComps", "noviceguidanceComp");
              }
            },
            setRenderCompsList(e, t) {
              if ("LotteryReminderDialogComp" === t) {
                let t = [];
                e.forEach((e) => {
                  "Rights-LotteryReminderDialogComp" == e.moduleId &&
                    t.push({
                      instanceId: e.instanceId,
                      isShow: !1,
                      isRender: !1,
                    });
                }),
                  t.length &&
                    sessionStorage.setItem(
                      "lotteryReminderDialogComp",
                      JSON.stringify(t)
                    );
              }
            },
            getCurrentUrlParams: () => new URLSearchParams(location.search),
            isIncludesComp(e) {
              const t = e.filter((e) => !e.hide).map((e) => e.id),
                i = +this.getCurrentUrlParams().get("instanceId");
              window.currentUrlInstanceId = i;
              const s = window.location.href
                .replace(/(\?|&)instanceId=[^&]*(&|$)/, "$1")
                .replace(/([?&])$/, "");
              window.history.replaceState({}, document.title, s),
                i &&
                  t.includes(i) &&
                  this.$nextTick(() => {
                    const e = document.querySelector(`[data-compid='${i}']`);
                    setTimeout(() => {
                      e.scrollIntoView({ behavior: "smooth" });
                    }, 1e3);
                  });
            },
            isNeedPreload() {
              let e = l.a.getValue(l.a.VIP_INFO);
              if (e && e.myVip && e.myVip[0] && e.refreshTime) {
                const i =
                    ((t = e.myVip[0]),
                    [
                      "CS49713701",
                      "CS49696038",
                      "CS81180102",
                      "CS78027018",
                      "CS81219459",
                    ].indexOf(t.vipCode) > -1),
                  s = new Date().getDate() > 3,
                  o = (function (e) {
                    let t = new Date().getMonth(),
                      i = new Date(e).getMonth();
                    return t === i;
                  })(e.refreshTime);
                return (
                  window.ydConsoleInfo("6611 三个条件", i, s, o),
                  i
                    ? s
                      ? o || this.sendPreloadLog(3, 3)
                      : this.sendPreloadLog(3, 2)
                    : this.sendPreloadLog(3, 1),
                  i && s && o
                );
              }
              return (
                e && e.myVip && e.myVip[0]
                  ? this.sendPreloadLog(3, 4)
                  : e && e.myVip
                  ? this.sendPreloadLog(3, 5)
                  : e
                  ? this.sendPreloadLog(3, 6)
                  : this.sendPreloadLog(3, 7),
                !1
              );
              var t;
            },
            setInfo(e, t) {
              if (!t || "refresh" == t) {
                if (
                  (e.forEach((e) => {
                    e.specify = this.handleData(e.specify);
                  }),
                  clearTimeout(this.secondScreenTimer),
                  window.removeEventListener(
                    "scroll",
                    this.splitScreenScroll,
                    !0
                  ),
                  e.length && e.every((e) => !!e.specify.compDefaultHeight))
                ) {
                  e.forEach((e) => {
                    e.secondScreen = !0;
                  });
                  let t =
                      (document.documentElement.clientHeight /
                        document.documentElement.clientWidth) *
                      375 *
                      1.2,
                    i = -1,
                    s = 0;
                  for (
                    ;
                    s < t &&
                    (i++,
                    (e[i].secondScreen = !1),
                    e[i].hide || (s += Number(e[i].specify.compDefaultHeight)),
                    i !== e.length - 1);

                  );
                  e.find((e) => e.secondScreen) &&
                    ((this.secondScreenTimer = setTimeout(() => {
                      e.forEach((e) => {
                        e.secondScreen = !1;
                      }),
                        window.removeEventListener(
                          "scroll",
                          this.splitScreenScroll,
                          !0
                        );
                    }, 4e3)),
                    window.addEventListener(
                      "scroll",
                      this.splitScreenScroll,
                      !0
                    ));
                }
                e.forEach((e) => {
                  e.specify = JSON.stringify(e.specify);
                });
              }
              this.info = e;
            },
            showNavCustomBtn(e) {
              if (Object(a.s)())
                if (
                  (this.verticalVipPages.includes(this.$route.params.page) &&
                    "hideNav" !== e &&
                    !["mshy", "newmshy"].includes(this.$route.params.page)) ||
                  (["mshy", "newmshy"].includes(this.$route.params.page) &&
                    "hideNav" !== e &&
                    !this.$route.query.showSecondPage)
                )
                  try {
                    if (this.hasNavCustomBtnFlag) return;
                    (this.hasNavCustomBtnFlag = !0),
                      setTimeout(() => {
                        this.hideNavCustomBtn();
                      }, 200),
                      setTimeout(() => {
                        let e =
                          "iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAYAAADj79JYAAABG2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIi8+CiA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgo8P3hwYWNrZXQgZW5kPSJyIj8+l1vpCgAAAAFzUkdCAK7OHOkAAApHSURBVHgB7Z19iB5HHcfvcsZori2tSvQuxSSkDdhCI+QusVxbc2kbSYw1QQOtkaAgiCLWtzOK9AgJSmOxFERRtK0K/SvQxpcaqBd6StNL7i5UWnOoWExA70oCkSaXNC+9i5/v4851d5/ZefZ5bua853l2YG92fvObl99nZ2dmZ+7ZbW3x4LZv3/72kydP9k5NTd3X2tp6C1l2Xr16tRP/Gg/Z/z+ymMSOcQoex46xtra23yxbtuz5/fv3X55tZVpnk0F3d/f7pqen+6ncDip23Wzymu9psfEsNj61YMGCPSMjI6/VWt+agG/atGnRqVOnvkOhX+Nor7XwOk13nno/umTJku8ePHjwUrU2VA08atXPUNCHqi2swfSP0Nq3VdvaqwK+bt262+inn+XWurHB4NVkDt3Mv2Cx+dixY6/kzSA3cLVsMh8pYCfRCjpHd96Wngt41GcPUpSrG7lC/AEdjOqjixcvHh8cHJwkXHdu/fr111y4cKGTu7mLym+NjoUOQ47Qp6/P06fnAr5mzZo9FPaQo0D16X3cWq86dOo2CvtXUvlHOLY5jNiL/f2O+FJUReDRIPkPtG2zkWlup2+Njo6qMg3vurq6+uhSH8bQBRZjzzOI3lSpa7ElTOSleTYCG+yWZoItKGpYsjkB6K1Ae8TqLYnlzAlcT5AUsMOSTqJnmqVlx+2PbFYXWubESszKImICJ3A9rnML2Z4gNUD2xfJptlPZLgYJJ1ZilhCmAk7gWhtJ6ZvggUYdII2BLj+yXTOyMudgVtJ1AucW0UKUzVkLsyk2sMzKwMGshMIJHA2t+JU5zbPLhE0mcDCwMjN4nMDpk6yJ9VBjMmhWP4tBFjPDyQkcJet6dr0+QRqjffgOBlZmpsxKwI1e4Xsi8DZP+SSy0Vz0xIkTe3gQ2ElERyJy/gcmeGL81fLly/t97PCkzQ0CPIK9K11YnYQ7aCi7sEHVzXqqrNmUIF1K1LJrrtR8SBjKhiDAAVZv3YjtGgexIRTwCZsFdSYLYkMQ4Bp06gxuWXVD2RAEuEZ4KrwPK4K0kjI6fgWapeyTDX6z/V9uzg0Idjqu2gpl8caZzpamEWW18AnSwhsRri+bCuC+SObMpwCeE5QvtQK4L5I58ymA5wTlS60A7otkznwK4DlB+VIrgPsimTOfAnhOUL7UCuC+SObMJ8gGRLHjk00/CPBixycbeJAuJdRuSbYZ/mNC2RAEOOYH2S3xj9WZYxAbQgGvx3XwNP0gNgQBHmq3JE0kZDiUDUGAFzs+2U3BuXNTy45GdlGNF1MLnyAtvPHQ+rOoAO6PZa6cCuC5MPlTKoD7Y5krpwJ4Lkz+lArg/ljmyqkAnguTP6WGBs7vbZzPGcK4du3ad/vDWTmnYMB5KPgcxmyoXAX/GpS7ivKf5LfxL23cuNH6s3WV2tPTcy2/q/wrun9G90v+a1KeY5D1cF6I8CDLm49xvClD+Ln0T03RwFiN/DMmXIu/YsWKXa6fgwDxLvItlXHmzJmfcf4pWzkXL158EPl7YodNzassCHCAvoNaTnNLK/+fAH0l0L+pmgNjFd5XdF6rO336tF4lcjkrPf9s+nPKvJPyd3I8QAseQvbDuD7vRLn+3LlzX49kJxYuXKj/9g3ugnQpGLePX+R+jNq/Lgswug+jHwtuTawAyvwCdTguEf7dbPu1xaJbJicnv0H4+kj21aGhoTfi8aHOnYMKkGb178p0Lbdi+CGO92KA3q1yO+8TGent7U0YHzcOEJvR/7VkLJF+vr29/Yl4vM75jeSbaRkteoB06Tc5dFDmDcjH0vrIu5C/E38K/8V4PLLL3JH3xGW281r4BOlSTOVge5wXk22gGzmEbBdGDGOMosuAmTQYMWXO6ZqmbXBNfMrvIayuLOGAqfCdCSGBSC5fFz8dfzGt7yscFLgqefTo0TFmA6sOHz58zlelXflwQY8DccCisxLZlkj+O/xX0zqkvYe0t6blPsPBgauycwVbZQFMA2TZoMyds5VoA/xxdA5IP+7Q0YymfoBT4e/RStRfJxyyF+henkwImzTgu4V/khZ2cwbLOQHOxf00F/7j6TogX0TdSmLOf4nOJYvOtUYnHecr7BU4hrxOhf8Tq5ymXc6ZUEzXyynla+DMGjxLZaBje63UzEDqpSIZmXgFziykO14OregM4RvistDnXPRDHD9OlwPkdRylhy/iv89x1KLzRXTuTst9hr0C91mxWvMC2D+58E+n03Pxp40MnSF0bIPmJqMTym844IBaDNyy/5qiRb8L0CWOOrfpKG0o0CbfRgSuhaqyxSoDW4Zz/rgBMNd+kLWUuTainsprmBZON/ERwGc2IFr1HcTvjS7OQ+i/kHWhiJvp77N0apXPOXC9GjvPa5+rNYgHqz+50tBna4pq3F8YNAdNYC79OQXOil4Pa9lad1Zrm7UD4kZaY65pHC08/kC2k7rcnqcCpDvEMsBzeXTz6MwZcAy8n8r/gkot0iuyaZGv5amgSwfYd5FnaW7t0rPEbSOdRVwuogy9Y7a+gGOc5ref5aD+rVMcKzifNXDy1Rp75lIvZcw4dNW/mz5e6XL10ypjJhMPJ8FaOEuynewZmpcmmnnxvzF0x/Dw8JCHurdwq/eTj46Kju5nK0rmNdSfsD34VMzEg4K54h6ySmYBbO2Cz3w3AdC/J/xBupI/JjWTIfRuNBLO8933JkEd+MFaOLCOcDsKgfrAbwP6URtAWt6PiO8hTvufl0ijnZuS43zYnDeKX6mFT9oM1VdAbPK4bMuWLdpVeR6Qd3Dr/8AGW/rIT+KtBq4GwHs5Lz1eI/8b6V6Rznx0+p8WW72ot3Nny9nCSayPv+nfGhJOn1xB8PeEMBXYvXu3BpsNKbEt+AfK6TURlPcGm8cH2c40/a2J8uF766KuXLlixqV0vZw/xnICJ6dxjjLgbAp3IXcCT9ciK8zg9RJxwVfpuFu0Oljpjs6qZpk8YlAmRyBmmc5ZAVrbWEZKjfjN7qwMHMxKvJzA9R3JDKpbGey0C96ULrLdCtzBrMTKCVwf7aR/PWuhquneIxZ5s4hk+8yU1xgtVmJmwja/zSY0srGxsamOjo73E05snUXxH1i6dOmF8fHxF41+M/gsUfRh55czbH1iYGAgq1coJXG2cGkwY9iDd76knfpDf/VwVIFUTGMGZatszrBOnwYTK6dztnClpAVPdnZ2ahf8w5acWpHdS/xqjtGJiYn4jr1FvT5F6rOxT7tEatmy2eb2MeP6rS0iLstKHNdpKT7vWPrEY1mfHYPk9/OOylhLqtxOxQdMY5R1ykBZ1QdMK/bhJn+tXzPl+agKMLJm98WCRri5mrX93MAFl/+EfZlCNGM50uywxUAsql3vqQq4IOtq6nO0nO7lsM5ekDeyk817xaCalm2A5Bo0jXLaV7/OIlM/V3oHt9Z16fhGCmPjWWx8SlO/WkAbFrMCbjLRa/P0HUkWdO6jYrcg76RyWlGsuIxr8phn/iR2aBFKq6VjelzXE6Trl3N56/9fJPbACmn+PcsAAAAASUVORK5CYII=";
                        cmcc.showNavCustomBtn({
                          debug: !1,
                          mode: "0",
                          iconDataW: e,
                          iconDataB: e,
                          isShow: !0,
                          pageTitle: "",
                          iconTitle: "",
                          success: (e) => {
                            if (e.status)
                              try {
                                cmcc.newWebview({
                                  debug: !1,
                                  markID: "",
                                  type: "",
                                  funCode: "",
                                  bizCode: "",
                                  url: Object(L.b)(
                                    "dingdan?channelCode=P00000096799"
                                  ),
                                  success: function (e) {},
                                  error: function (e) {},
                                });
                              } catch (e) {
                                window.ydConsole(e, "版本报错");
                              }
                          },
                          error: function (e) {
                            window.ydConsole("showNavCustomBtn error", e);
                          },
                        });
                      }, 400);
                  } catch (e) {
                    window.ydConsole(e, "版本报错");
                  }
                else if (
                  this.$route.params.page.indexOf("shoppingCart") > -1 ||
                  this.$route.params.page.indexOf("shoppingcart") > -1
                )
                  try {
                    if (this.hasNavCustomBtnFlag) return;
                    (this.hasNavCustomBtnFlag = !0),
                      setTimeout(() => {
                        this.hideNavCustomBtn();
                      }, 200),
                      setTimeout(() => {
                        const e =
                          "iVBORw0KGgoAAAANSUhEUgAAAFwAAABcCAYAAADj79JYAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAXKADAAQAAAABAAAAXAAAAABhCMkfAAAI7klEQVR4Ae2baWxVRRTHu9FSWwMlVoUEBQ0Sg0UFikKtQT8YXBpDQlESFIwa9w+ucY1FjRGjxhhBjCi4EaFxCbQsCQqm0Bao0URISIykGOOGLEJbutjW37nceZ333n2v95b77MKZ5HVmzjZn/nNmuXNv09I0KQKKgCKgCCgCioAioAgoAoqAIqAIKAKKgCKgCCgCioAioAgoAoqAIqAIKAKKgCKgCCgCioAioAgoAorAoEcgPVEPiouLZ3d3dxdlZGTUd3Z2fkdqSSTrhz516tTrsHV+V1dXfVlZ2d6KioouP3pDTSbLq0Pl5eWZ+/fvfwveBMBOS09P/5byLC/ZALTXALtI5KuqqtaR3RxAd8iIegLe2Ng4nx5OML0E8BWm3Jd82rRpJTJbLN3PrXK/FsU3HLg+FU4wo2t27dq12bYdBzhTPYMIfNYSOlJQUPClRL1FS1pcu3ZtF4PUbYQA+z5Thn4iPz9/XRB7ohtrU2gse8XYO0fKQVNWVtau2trav/DtCnSfCarvRx7bS5BLDjhg34LgRMtgwaFDh5r4WaTkxenTpy9A4lORKi0tLWxpaZlrNLCde/z48SP8DMlXjs0HEFxmC2PrOZapMpvmt8xSeROy1X7lw5KLivAZM2bkdnR0PB+WcbHT2tr6KFlOmDZTaOs3bC/3ss9MmsMAX+7yDpC/n0BuAXIXefGEFgU4YC9H2I7uZhrqgianmXzLSBv0dqseW/xXCJxMpqArgJsU0YMug5BtGORN2IwsQxbdKRLJce1h4zDM32Nlqcsyk+HSm8mPueVIxvraFqm4Bdr/raGh4cVYutTpy4VkBvBfOLV5yrEnXIlc74Aj+CAduF2Mu2kneSkOdEBPh19LXYxJ2jt+/PjplZWVnSer8X9xcBjUleg6g0pnWjMzMyfv3LnzJ5GWzQpeDUXnaAr/Mdp6V3h+E51e5CVL239BLxQedt/D7sNecv1Bc6LA7fwblgNHhw0bdisd6hAaTncD1kMUTQRO4SSTtBNE0FPITxZ9N71kwJY6IOzA7geGCfhLSkpKxpj6UM0ziIbRdLaSDkpEOgmw7qyvr290q07G8aYBgFYaGjovcEi4wNTtnA1uPEvA04aG3h7kXzV1kzOoT1D+262PYL1fanhDNc/geJQPII2mg5SX7t69+wtTt/Ps7GyJ2n+EBoC5/CJLgJxGmCnVDOABTgD7sfMKYvX8upgdd5vZIrom1dXVHWZwHzd1dEqxYe8hhjVk8iyZ5py9r6qurr4XAOcVFhbam1xUR+XcCiCLIco5fTXykYivqak5CNhnQj/PVbqKZWMms2AmbQjwnonBXYXeJYBdx76wnn0hbnP0VEwBkf5k44vxP6oF/MuD79Ao5ySSQyY3SjGm4mxYMbSk1VmzZmUxKBlewADubJaSjZaBi4nsfVb9fykChr1pvpls00T2EZx6PRWOMXuXEFBP2radEwRr7gyAkgeBXlNTU1Oa/Ij0OFmJAEb/hDXKy5CrixMMSMDxKvaQU7YTsNmUiDuAs+YKepFNLsSWrgH8a07VHv79gY2UA06wtOJvYwJ/R0MfITw3qA4kkBsLPS8BL/rBJ5HQaUTfwxJY7NVflp5V0BcKj0FpQO5qKccmZnQ1/Bti6aYe9aTpEg+SpyLaTZt+85cRdB5e/CoMBjkvwI8xeiv623kiSjab0wLw/sbad/vuZduhWAWmtH00e5Bpfo8tA/8bgsrXIcHWC6PsFeFRdnF2Kw6eHUVMQYWNqInjm9xN+07t7e1yrLXBjdPFd+ljVD9pKydO8H8iRDni1SYOy83XGC9eyLS4G72Q7Q8Icw7gjLg8QpmbP5PHOYjcMQYg2JuDOCs9BOzJ9cCoHkpPCZ74YXw5+YjXw3ZKvIxu3bBhw+wYchrHyDXQnCMc+VdcLSyPkYlbhlz+JPaOH2JkTdV+Ap2SRM7zfskYcQBnKr8NQX5JE+C8xtrneQ+cVDEBk+VqPqzVXmx8muhFt2num//NNk3KgBG5HmDgGmPfK8bKmzr9k+XpUlNPkss521MOG0nUei7pkwopMzwEel3Dw2tqYFrKycn5hM13qw/vFhO9ZSLHrPme7M7edLhd/TNWJijgRe4yEGunr/WZfVUMS09uQLElv6SJZeqwEQD4JpZWAT1wCgp4OY2VB25FFSIImBetEYIWUotA0Aj/kqvSdSlyyXl/miLbA8ZsUMC/lzc0A8b7PjrCssi+l97Ny5SRfKQ0xY8ZzvbnWnIjeYdwrVVPWOQV5h53n3BkggKe0PBgYLDxCbh38WZKrirmNjc3X8qLl6/74HsRA+BLD7l52JeX9E4KCvjlOHuHUU5VDghrOAW0hGGfaB6Jz/eT38XPfMizJQzbfbERFPA5gDGnLw0F0Rk+fLg8PYYCOHYW4fMir/YZAPlC7KgXz4N2BrRsobMcdaLr94ojam8KCriHH/1Pkg+I2tra5Exfwm8mYJyVwCv51G49G/87wuf6YAdZQQLZKDLL0SoIC4WI/VpmoOcbH+EnS0EBr8Rhz29WkjXigzeRTlT4kIuIuJ9Vr0KvlA+IxkUYHgV8roX8EZ9Jr9m2bZvfiPawdOqkoID/SFR8durNRlvg6VUisyKamrwmF1foFSE1zksSkPdA/5wB+Riff/aS6Q9aUMD7w8eEbQKmnBQuEwEAPka2BdpGjmKb+PjoV6EPtDSoAWct/oINsZ18U15eXi3LhWyCAzoFApwomiBfV4XdI0Cb1BebPITJ2iy/QZMCAc50vU1+g6Z3CRwlaIoZZD9XshELBFsOfTf1Ek4tTabiJ8/NzR27ffv2I4EA92N4MMiwBGUCuLy18Z0ssEVHLv0C6fPEKS+8o99mC6GXJLt96Ds+0VNAhzy/eOrFn0HHDhrhH4b5TtOg5R4Lt5t6qnOm9z4+SL0x1e3Y9nmr5DyZ+gH8KyJwlCgzFeVsG3riGHeYf+iqMoaZ7q2mnIrcffjZkArbalMRUAQUAUVAEVAEFAFFQBFQBBQBRUARUAQUAUVAEVAEFAFFQBFQBBQBRUARUAQUAUVAEVAEFAFFwEHgP1axKA+e4qxQAAAAAElFTkSuQmCC";
                        let t = e;
                        (t = (Object(a.o)().ios, e)),
                          cmcc.showNavCustomBtn({
                            debug: !1,
                            mode: "0",
                            iconDataW: t,
                            iconDataB: t,
                            isShow: !0,
                            pageTitle: "",
                            iconTitle: "",
                            success: (e) => {
                              if (e.status)
                                try {
                                  this.bus.$emit("changeEditStatus");
                                } catch (e) {
                                  window.ydConsole(e, "版本报错");
                                }
                            },
                            error: function (e) {
                              window.ydConsole("showNavCustomBtn error", e);
                            },
                          });
                      }, 400);
                  } catch (e) {
                    window.ydConsole(e, "版本报错");
                  }
                else {
                  if (window.isSetNavCustomBtn && !e) return;
                  this.hideNavCustomBtn();
                }
            },
            hideNavCustomBtn() {
              try {
                const e = navigator.userAgent,
                  t = /OpenHarmony/i.test(e);
                let i = Object(a.o)();
                Object(a.k)() >= 1205 &&
                  (i.ios || t) &&
                  cmcc.showTitleBarRightIcons({
                    debug: !1,
                    menuList: { iconList: [] },
                    success: (e) => {},
                    error: (e) => {},
                  }),
                  cmcc.showNavCustomBtn({
                    debug: !1,
                    mode: "0",
                    iconDataW: "",
                    iconDataB: "",
                    isShow: !1,
                    pageTitle: "",
                    iconTitle: "",
                    success: function (e) {},
                    error: function (e) {
                      window.ydConsole("hideNavCustomBtn error", e);
                    },
                  });
              } catch (e) {
                window.ydConsole(e, "hideNavCustomBtn-版本报错");
              }
            },
            historyInit() {
              if (
                Object(a.s)() &&
                Object(a.o)().ios &&
                this.$route.query.pageLoginFlag
              )
                try {
                  let e = { ...this.$route.query };
                  delete e.pageLoginFlag,
                    this.$router.replace({
                      path: this.$route.params.page,
                      query: e,
                    }),
                    cmcc.getDataFromNative({
                      debug: !1,
                      key: "pageHistoryPage",
                      success: (e) => {
                        e &&
                          e.value &&
                          (sessionStorage.setItem("pageHistoryPage", e.value),
                          cmcc.saveDataToNative({
                            debug: !1,
                            key: "pageHistoryPage",
                            value: "",
                            success: function (e) {},
                            error: function (e) {},
                          }));
                      },
                      error: (e) => {},
                    });
                } catch (e) {
                  window.ydConsole(e, "getDataFromNative-版本报错");
                }
              let e = localStorage.getItem("pageHistoryWebviewReferrer") || "";
              e &&
                e.split("&")[1] === Object(a.D)(location.href) &&
                sessionStorage.setItem(
                  "pageHistoryWebviewReferrer",
                  e.split("&")[0]
                ),
                localStorage.removeItem("pageHistoryWebviewReferrer");
            },
            setPageHistoryPage() {
              try {
                let e = sessionStorage.getItem("pageHistoryPage")
                    ? JSON.parse(sessionStorage.getItem("pageHistoryPage"))
                    : [],
                  t = sessionStorage.getItem("pageHistoryReferrer") || "";
                sessionStorage.removeItem("pageHistoryReferrer");
                let i =
                    -1 !== window.location.href.indexOf("localhost")
                      ? "localhost"
                      : "rightsmarket-h5-canvas",
                  s = t ? t.split("&")[0] : "",
                  o = "",
                  n = "",
                  r = !1,
                  l = this.$store.state.currentPageInfo;
                if (t && t.split("&")[1] === l.originPath) {
                  if (Object(a.s)() || ("login" !== s && "denglu" !== s)) o = s;
                  else {
                    o =
                      (sessionStorage.getItem("pageHistoryLogin")
                        ? JSON.parse(sessionStorage.getItem("pageHistoryLogin"))
                        : {})[l.originPath] || "";
                  }
                  r = !0;
                } else if (
                  document.referrer &&
                  -1 == document.referrer.indexOf(i) &&
                  !this.$route.query.pageRecorded
                ) {
                  let e = "/gr/static-2c/rightsget/";
                  if (-1 !== document.referrer.indexOf(e)) {
                    let e = sessionStorage.getItem("historyItems")
                      ? JSON.parse(sessionStorage.getItem("historyItems"))
                      : [];
                    o = e.length
                      ? e[e.length - 1].url
                      : document.referrer.split("?")[0];
                  } else o = document.referrer.split("?")[0];
                  (n = "true"), (r = !0);
                } else
                  document.referrer ||
                    this.$route.query.pageRecorded ||
                    ((o =
                      sessionStorage.getItem("pageHistoryWebviewReferrer") ||
                      ""),
                    (n = "true"),
                    (r = !0));
                if (r) {
                  let t = e.filter((e) => e.originPath === l.originPath),
                    i = "",
                    s = { ...this.$route.query };
                  t.length && (s.pageKey = i = t.length + 1),
                    n && (s.pageRecorded = "true"),
                    (t.length || n) &&
                      this.$router.replace({
                        path: this.$route.params.page,
                        query: s,
                      });
                  let a = {
                    originPath: l.originPath,
                    pageKey: i || null,
                    referrer: o,
                  };
                  e.push(a),
                    sessionStorage.setItem(
                      "pageHistoryPage",
                      JSON.stringify(e)
                    );
                }
              } catch (e) {
                window.ydConsole("setPageHistoryPage error", e),
                  sessionStorage.setItem("pageHistoryPage", JSON.stringify([]));
              }
            },
            historyBeforeJump(e, t) {
              let i = this.$store.state.currentPageInfo.path,
                s = this.$store.state.QYCS_syTabVal,
                o = this.$store.state.QYCS_CLTabVal;
              -1 !=
                e.indexOf(
                  -1 !== window.location.href.indexOf("localhost")
                    ? "localhost"
                    : "rightsmarket-h5-canvas"
                ) &&
                (i.includes("home") &&
                  (i = i + (s ? "_" + s : "") + ("SY2" == s ? "_" + o : "")),
                t
                  ? localStorage.setItem(
                      "pageHistoryWebviewReferrer",
                      `${i}&${Object(a.D)(e)}`
                    )
                  : sessionStorage.setItem(
                      "pageHistoryReferrer",
                      `${i}&${Object(a.D)(e)}`
                    ));
            },
            isPageKeyChange(e, t, i) {
              if (e.path !== t.path) return !1;
              let s = { ...e.query },
                o = { ...t.query };
              return (
                i.forEach((e) => {
                  delete s[e], delete o[e];
                }),
                JSON.stringify(s) === JSON.stringify(o) &&
                  (console.log("不变更"), !0)
              );
            },
            loginAndGetjson(e, t, i, s) {
              const o = () => {
                "onlySkipDealdata" == i &&
                  window.timePoint.set("loginAndGetjson_logincallback"),
                  this.$store.commit("setLoginDoneFlag", !0);
              };
              s
                ? (window.timePoint.set("loginAndGetjson_skipLogin"), o())
                : (window.timePoint.set("loginAndGetjson_start"),
                  this.$store.commit("setLoginDoneFlag", !1),
                  this.rightsLogin(o)),
                this.getJSON(e, t, i, !0);
            },
            setVisitTimes() {
              let e = localStorage.getItem("visitTimesPerMon");
              if (e) {
                let t = JSON.parse(e),
                  i = new Date(t.lastTs),
                  s = i.getFullYear(),
                  o = i.getMonth(),
                  n = i.getDate(),
                  r = new Date().getFullYear(),
                  l = new Date().getMonth(),
                  c = new Date().getDate();
                s == r && o == l
                  ? n != c &&
                    (localStorage.setItem(
                      "visitTimesPerMon",
                      JSON.stringify({
                        times: t.times + 1,
                        lastTs: new Date().getTime(),
                      })
                    ),
                    t.times >= 2 &&
                      !Object(a.M)() &&
                      Object(a.s)() &&
                      this.sendPreloadLog(3, 8))
                  : localStorage.setItem(
                      "visitTimesPerMon",
                      JSON.stringify({ times: 1, lastTs: new Date().getTime() })
                    );
              } else
                localStorage.setItem(
                  "visitTimesPerMon",
                  JSON.stringify({ times: 1, lastTs: new Date().getTime() })
                );
            },
            apiPreload() {
              let e = this;
              window.ydConsole("apiPreload");
              let t =
                -1 !== window.location.href.indexOf("sandbox") ||
                -1 !== window.location.href.indexOf("localhost")
                  ? "10011111"
                  : "100000120";
              if (location.href.indexOf("wdqy") > -1) {
                let i = [
                    {
                      name: "IFA10",
                      api: X,
                      respondName: "getIFA10InfoApiRespond",
                    },
                    {
                      name: "IFA1",
                      api: q,
                      respondName: "getIFA1InfoApiRespond",
                      nextApi: {
                        name: "IFA2",
                        api: K,
                        respondName: "getIFA2InfoApiRespond",
                        verifyParams: (e) =>
                          !(!e.bizTypeList || 0 == e.bizTypeList.length),
                        extendParams: {
                          bizTypeList: (e) =>
                            e && Array.isArray(e)
                              ? e.map((e) => e.bizType)
                              : [],
                        },
                      },
                    },
                    {
                      name: "IFA7",
                      api: Y,
                      respondName: "getIFA7InfoApiRespond",
                      extendParams: {
                        province: () => {
                          let e = l.a.getValue(l.a.USER_INFO);
                          return !e || (e && !e.phone) ? "" : e.provinceCode;
                        },
                      },
                    },
                  ],
                  s = (i, o) => {
                    let n = l.a.getValue(l.a.USER_INFO);
                    if (!n || (n && !n.phone)) return;
                    let a = {
                      token: n && n.phone ? n.phone : "",
                      channelId: t,
                    };
                    if (
                      (i.extendParams &&
                        Object.keys(i.extendParams).forEach((e) => {
                          a[e] = i.extendParams[e](o);
                        }),
                      i.verifyParams && !i.verifyParams(a))
                    )
                      return;
                    let r = `set${i.name}InfoApiRespond`;
                    ee.a.commit(r, "loading"),
                      i.api(a).then((t) => {
                        let o = i.name + "InfoApiRespond",
                          n = window.apiRespond || {};
                        (window.apiRespond = { ...n, [o]: t }),
                          ee.a.commit(r, "done"),
                          i.nextApi &&
                            ((window.apiRespond &&
                              window.apiRespond[i.nextApi.respondName]) ||
                              "loading" ==
                                e.$store.state[i.nextApi.respondName] ||
                              "done" == e.$store.state[i.nextApi.respondName] ||
                              (i.nextApi.extendParams
                                ? s(i.nextApi, t[1].data)
                                : s(i.nextApi)));
                      });
                  };
                l.a.getIsLogin()
                  ? i.forEach((t) => {
                      (window.apiRespond && window.apiRespond[t.respondName]) ||
                        "loading" == e.$store.state[t.respondName] ||
                        "done" == e.$store.state[t.respondName] ||
                        s(t);
                    })
                  : this.$watch("$store.state.loginDoneFlag", (t) => {
                      t &&
                        i.forEach((t) => {
                          (window.apiRespond &&
                            window.apiRespond[t.respondName]) ||
                            "loading" == e.$store.state[t.respondName] ||
                            "done" == e.$store.state[t.respondName] ||
                            s(t);
                        });
                    });
              }
            },
            currentUrlTrim() {
              if (location.href.indexOf("mtAuthToken") > -1) return;
              const e = decodeURIComponent(location.href);
              /\s/.test(e) && (location.href = e.replace(/\s/g, ""));
            },
            imgWakeUpApp() {
              let e = window.location.href;
              this.touchCode &&
                (-1 !== e.indexOf("channelCode") &&
                  (e = this.clearUrlParam(e, ["channelCode"])),
                (e =
                  e.includes("?") || e.includes("&")
                    ? `${e}&channelCode=${this.touchCode}`
                    : `${e}?channelCode=${this.touchCode}`));
              let t = Object(a.p)();
              window.ydConsole("imgWakeUpApp extendID", t),
                !Object(a.s)() &&
                  t &&
                  (-1 !== e.indexOf("extendID") &&
                    (e = this.clearUrlParam(e, ["extendID"])),
                  (e =
                    e.includes("?") || e.includes("&")
                      ? `${e}&extendID=${t}`
                      : `${e}?extendID=${t}`)),
                this.sendClickLog(
                  {
                    info: this.EventTrackingInfo,
                    pointPosition: "click_app",
                    envName: "点击拉起手厅",
                  },
                  () => {
                    if (
                      (window.ydConsole("imgWakeUpApp", t, e),
                      Object(a.z)() && !Object(a.x)() && Object(a.o)().android)
                    ) {
                      let t =
                          this.touchCode ||
                          this.clearUrlParam(e, ["channelCode"]),
                        i = `?channelCode=${t}&jumpUrl=${encodeURIComponent(
                          e
                        )}`,
                        s = Object(a.p)();
                      !Object(a.s)() &&
                        s &&
                        (i = `?channelCode=${t}&extendID=${s}&jumpUrl=${encodeURIComponent(
                          e
                        )}`);
                      let o = "";
                      (o = window.location.href.includes("staging-coc3")
                        ? "https://wx.10086.cn/wxpullapp/hzqy/staging-coc3/rights-singlepages/qycspullapp" +
                          i
                        : "https://wx.10086.cn/wxpullapp/hzqy/coc3/rights-singlepages/qycspullapp" +
                          i),
                        (location.href = o),
                        window.ydConsole("forceUpApp linkUrl", s, o);
                    } else Object(a.U)(e);
                  }
                );
            },
            watchFirstScreen() {
              let e = !1;
              if (
                (this.info.forEach((t) => {
                  ("Rights-DialogComp" != t.moduleId &&
                    "Rights-CTOPDialogComp" != t.moduleId) ||
                    !JSON.parse(t.specify) ||
                    (null != JSON.parse(t.specify).showTimeType &&
                      "1" != JSON.parse(t.specify).showTimeType) ||
                    (console.log("触点弹窗"), (e = !0));
                }),
                e)
              )
                try {
                  let e =
                      document.getElementById("page-content") || document.body,
                    t = this;
                  t.observerH = new V.a(
                    ue()((i) => {
                      i.forEach((i) => {
                        i.target === e &&
                          (ee.a.commit("setFirstScreenStatus", !0),
                          t.observerH.unobserve(e),
                          t.observerH.disconnect());
                      });
                    }, 300)
                  );
                  let i = { attributes: !0, childList: !0, subtree: !0 };
                  t.observerH.observe(e, i);
                } catch (e) {
                  window.ydConsole("watchFirstScreen ResizeObserver 异常", e),
                    ee.a.commit("setFirstScreenStatus", !0);
                }
            },
            forceUpApp(e) {
              e.stopPropagation(),
                e.preventDefault(),
                this.isUpApp ||
                  ((this.isUpApp = !0),
                  setTimeout(() => {
                    let e = window.location.href;
                    if (this.forcedPullEnd || this.touchCode) {
                      let t = this.forcedPullEnd || this.touchCode;
                      -1 !== e.indexOf("channelCode") &&
                        (e = this.clearUrlParam(e, ["channelCode"])),
                        (e =
                          e.includes("?") || e.includes("&")
                            ? `${e}&channelCode=${t}`
                            : `${e}?channelCode=${t}`);
                    }
                    let t = Object(a.p)();
                    !Object(a.s)() &&
                      t &&
                      (-1 !== e.indexOf("extendID") &&
                        (e = this.clearUrlParam(e, ["extendID"])),
                      (e =
                        e.includes("?") || e.includes("&")
                          ? `${e}&extendID=${t}`
                          : `${e}?extendID=${t}`)),
                      this.sendClickLog(
                        {
                          info: this.EventTrackingInfo,
                          pointPosition: "pullapp_click",
                          envName: "用户点击屏幕拉端",
                        },
                        () => {
                          let i = !!sessionStorage.getItem("isInstallApp");
                          if (
                            Object(a.z)() &&
                            !Object(a.x)() &&
                            Object(a.o)().android
                          ) {
                            let t =
                                this.touchCode ||
                                this.clearUrlParam(e, ["channelCode"]),
                              s = `?${
                                i ? `isCheckInstallApp=${i}&` : ""
                              }channelCode=${t}&jumpUrl=${encodeURIComponent(
                                e
                              )}`,
                              o = Object(a.p)();
                            !Object(a.s)() &&
                              o &&
                              (s = `?${
                                i ? `isCheckInstallApp=${i}&` : ""
                              }channelCode=${t}&extendID=${o}&jumpUrl=${encodeURIComponent(
                                e
                              )}`);
                            let n = "";
                            (n = window.location.href.includes("staging-coc3")
                              ? "https://wx.10086.cn/wxpullapp/hzqy/staging-coc3/rights-singlepages/qycspullapp" +
                                s
                              : "https://wx.10086.cn/wxpullapp/hzqy/coc3/rights-singlepages/qycspullapp" +
                                s),
                              (location.href = n),
                              window.ydConsole("forceUpApp linkUrl", o, n);
                          } else
                            window.ydConsole("forceUpApp url", t, e),
                              Object(a.U)(e);
                          this.isUpApp = !1;
                        }
                      );
                  }, 500));
            },
            splitScreenScroll() {
              (document.documentElement.scrollTop || document.body.scrollTop) >=
                10 &&
                (this.info.forEach((e) => {
                  e.secondScreen = !1;
                }),
                window.removeEventListener(
                  "scroll",
                  this.splitScreenScroll,
                  !0
                ),
                clearTimeout(this.secondScreenTimer));
            },
          },
          destroyed() {
            console.log("renewLoginMixin-页面销毁"),
              window.$renewLogin.destroyLoginRenew(),
              document.removeEventListener(
                this.visibilityChange,
                this.switchTab,
                !1
              ),
              document.removeEventListener(
                this.visibilityChange,
                this.startProcess,
                !1
              ),
              document.removeEventListener(
                this.visibilityChange,
                this.listenAndSendLoadedLog,
                !1
              ),
              window.removeEventListener("scroll", this.splitScreenScroll, !0),
              this.secondScreenTimer && clearTimeout(this.secondScreenTimer);
          },
        },
        me =
          (i("f531"),
          i("1132"),
          Object(S.a)(
            ge,
            function () {
              var e = this,
                t = e._self._c;
              return t(
                "van-pull-refresh",
                {
                  class: [e.isGrey ? "isGrey" : ""],
                  staticStyle: { background: "#f6f6f6" },
                  attrs: { disabled: e.refreshFlag },
                  on: { refresh: e.onRefresh },
                  scopedSlots: e._u([
                    {
                      key: "pulling",
                      fn: function (e) {
                        return [
                          t("div", {
                            staticClass: "loading_trigle",
                            style: {
                              borderTopWidth: e.distance / 100 + "rem",
                              borderLeftWidth: 350 / e.distance / 100 + "rem",
                              borderRightWidth: 350 / e.distance / 100 + "rem",
                              transform: `translateY(${
                                (45 - e.distance / 1) / 100
                              }rem)`,
                            },
                          }),
                        ];
                      },
                    },
                    {
                      key: "loosing",
                      fn: function (e) {
                        return [
                          t(
                            "div",
                            {
                              staticStyle: {
                                position: "relative",
                                height: ".6rem",
                                width: "100%",
                              },
                            },
                            [
                              t("div", {
                                staticClass: "loading_loosing_trigle",
                              }),
                              t("img", {
                                staticClass: "loading_loosing_gif",
                                attrs: {
                                  src: "https://res.coc.10086.cn/res/cdn/coc1/2022/03/14/1503192079274930176/loading.gif",
                                },
                              }),
                            ]
                          ),
                        ];
                      },
                    },
                    {
                      key: "loading",
                      fn: function () {
                        return [
                          t("cmcc-loading", {
                            attrs: {
                              "custom-container": { height: ".6rem" },
                              "custom-style": {
                                width: ".4rem",
                                height: ".4rem",
                              },
                            },
                          }),
                        ];
                      },
                      proxy: !0,
                    },
                  ]),
                  model: {
                    value: e.loading,
                    callback: function (t) {
                      e.loading = t;
                    },
                    expression: "loading",
                  },
                },
                [
                  t(
                    "div",
                    {
                      style: { backgroundColor: this.bgcolor },
                      attrs: { id: "page-content" },
                      on: {
                        touchmove: e.touchmoveHandler,
                        touchstart: e.touchestartHandler,
                        touchend: e.touchendHandler,
                      },
                    },
                    [
                      e._l(e.info, function (i) {
                        return t(
                          "div",
                          { key: i.id, attrs: { "data-compId": i.id } },
                          [
                            i.hide || i.secondScreen
                              ? e._e()
                              : t(e.compModuleId(i.moduleId) || i.moduleId, {
                                  key: i.refreshKey,
                                  tag: "component",
                                  attrs: {
                                    info: e.handleData(i.specify),
                                    jumpTo: e.jumpTo,
                                  },
                                }),
                          ],
                          1
                        );
                      }),
                      t("miniproBarVue", { attrs: { jumpTo: e.jumpTo } }),
                      t(
                        "van-overlay",
                        {
                          staticClass: "wrapper-overlay",
                          attrs: { show: e.showLoading },
                        },
                        [
                          t(
                            "div",
                            {
                              staticClass: "wrapper",
                              on: {
                                click: function (e) {
                                  e.stopPropagation();
                                },
                              },
                            },
                            [
                              t("cmcc-loading", {
                                attrs: {
                                  loadingPage: e.loadingPage,
                                  transparentPng: "",
                                },
                              }),
                            ],
                            1
                          ),
                        ]
                      ),
                      t("jump-toast", { attrs: { info: e.jumpToastInfo } }),
                      e.isTouchCode
                        ? t("img", {
                            staticClass: "wake-app",
                            attrs: {
                              src:
                                e.language && 2 == e.language
                                  ? e.iswebp
                                    ? "https://res.coc.10086.cn/res/cdn/coc1/2025/08/22/1958783876984004608/88192775ca424cdea044169faf190ba3.png.webp"
                                    : "https://res.coc.10086.cn/res/cdn/coc1/2025/08/22/1958783877138206720/88192775ca424cdea044169faf190ba3.png"
                                  : e.$iswebp
                                  ? "https://res.coc.10086.cn/res/cdn/coc1/2024/09/05/1831506118044618752/1725500056652_573927.png.webp"
                                  : "https://res.coc.10086.cn/res/cdn/coc1/2024/09/05/1831506118244241408/1725500056652_573927.png",
                              alt: "",
                            },
                            on: { click: e.imgWakeUpApp },
                          })
                        : e._e(),
                      e.isForceUpApp
                        ? t("div", {
                            staticClass: "force-app",
                            on: { touchstart: e.forceUpApp },
                          })
                        : e._e(),
                    ],
                    2
                  ),
                  t("dialog-login", {
                    attrs: { jumpTo: e.jumpTo },
                    model: {
                      value: e.dialogLoginVisible,
                      callback: function (t) {
                        e.dialogLoginVisible = t;
                      },
                      expression: "dialogLoginVisible",
                    },
                  }),
                  t("vip-error-popup"),
                  t("toast-overlay"),
                  t(
                    "van-dialog",
                    {
                      staticClass: "lower-version-wrap",
                      attrs: {
                        "close-on-click-overlay": !1,
                        showConfirmButton: !1,
                      },
                      model: {
                        value: e.lowerVersionShow,
                        callback: function (t) {
                          e.lowerVersionShow = t;
                        },
                        expression: "lowerVersionShow",
                      },
                    },
                    [
                      t("div", { staticClass: "lower-version" }, [
                        t("div", {
                          staticClass: "close-icon",
                          on: {
                            click: function (t) {
                              e.lowerVersionShow = !1;
                            },
                          },
                        }),
                        t("div", { staticClass: "content" }, [
                          e._v(
                            "很抱歉，当前app版本暂不支持打开该跳转页面，建议您更新版本后再尝试～"
                          ),
                        ]),
                        t(
                          "div",
                          {
                            staticClass: "btn",
                            on: {
                              click: function (t) {
                                e.lowerVersionShow = !1;
                              },
                            },
                          },
                          [e._v("我知道了")]
                        ),
                      ]),
                    ]
                  ),
                  t("miniproLogin", {
                    attrs: { jumpTo: e.jumpTo },
                    model: {
                      value: e.miniproLoginVisible,
                      callback: function (t) {
                        e.miniproLoginVisible = t;
                      },
                      expression: "miniproLoginVisible",
                    },
                  }),
                ],
                1
              );
            },
            [],
            !1,
            null,
            "5157d4e1",
            null
          ));
      t.default = me.exports;
    },
    "184a": function (e, t, i) {},
    2: function (e, t) {},
    3: function (e, t) {},
    4: function (e, t) {},
    4683: function (e, t, i) {},
    "4ab1": function (e, t, i) {},
    5: function (e, t) {},
    "5b76": function (e, t, i) {
      "use strict";
      i("184a");
    },
    6: function (e, t) {},
    "6a5a": function (e, t, i) {
      "use strict";
      i("c1db");
    },
    7: function (e, t) {},
    "73d0": function (e, t, i) {},
    7534: function (e, t, i) {},
    "7c13": function (e, t, i) {},
    8: function (e, t) {},
    "829b": function (e, t, i) {
      "use strict";
      i("dde99");
    },
    "90c5": function (e, t, i) {
      (function (t) {
        e.exports = (function () {
          var e,
            s,
            o,
            n,
            a,
            r,
            l,
            c,
            d,
            h,
            p,
            u,
            g,
            m,
            f,
            y,
            w,
            v,
            C,
            b,
            S,
            I,
            k,
            O,
            A,
            L,
            R,
            P,
            T,
            _,
            x,
            N,
            E,
            j,
            D,
            B,
            F,
            $,
            U,
            V,
            J,
            H,
            M,
            z,
            G,
            W,
            q,
            K,
            Y,
            X,
            Z,
            Q,
            ee,
            te,
            ie,
            se,
            oe,
            ne,
            ae,
            re,
            le,
            ce,
            de,
            he,
            pe,
            ue,
            ge,
            me,
            fe,
            ye,
            we,
            ve,
            Ce,
            be,
            Se,
            Ie,
            ke,
            Oe =
              Oe ||
              (function (e) {
                var s;
                if (
                  ("undefined" != typeof window &&
                    window.crypto &&
                    (s = window.crypto),
                  !s &&
                    "undefined" != typeof window &&
                    window.msCrypto &&
                    (s = window.msCrypto),
                  !s && void 0 !== t && t.crypto && (s = t.crypto),
                  !s)
                )
                  try {
                    s = i("1c46");
                  } catch (s) {}
                function o() {
                  if (s) {
                    if ("function" == typeof s.getRandomValues)
                      try {
                        return s.getRandomValues(new Uint32Array(1))[0];
                      } catch (e) {}
                    if ("function" == typeof s.randomBytes)
                      try {
                        return s.randomBytes(4).readInt32LE();
                      } catch (e) {}
                  }
                  throw new Error(
                    "Native crypto module could not be used to get secure random number."
                  );
                }
                var n =
                  Object.create ||
                  function (e) {
                    var t;
                    return (
                      (a.prototype = e), (t = new a()), (a.prototype = null), t
                    );
                  };
                function a() {}
                var r = {},
                  l = (r.lib = {}),
                  c = (l.Base = {
                    extend: function (e) {
                      var t = n(this);
                      return (
                        e && t.mixIn(e),
                        (t.hasOwnProperty("init") && this.init !== t.init) ||
                          (t.init = function () {
                            t.$super.init.apply(this, arguments);
                          }),
                        ((t.init.prototype = t).$super = this),
                        t
                      );
                    },
                    create: function () {
                      var e = this.extend();
                      return e.init.apply(e, arguments), e;
                    },
                    init: function () {},
                    mixIn: function (e) {
                      for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
                      e.hasOwnProperty("toString") &&
                        (this.toString = e.toString);
                    },
                    clone: function () {
                      return this.init.prototype.extend(this);
                    },
                  }),
                  d = (l.WordArray = c.extend({
                    init: function (e, t) {
                      (e = this.words = e || []),
                        (this.sigBytes = null != t ? t : 4 * e.length);
                    },
                    toString: function (e) {
                      return (e || p).stringify(this);
                    },
                    concat: function (e) {
                      var t = this.words,
                        i = e.words,
                        s = this.sigBytes,
                        o = e.sigBytes;
                      if ((this.clamp(), s % 4))
                        for (var n = 0; n < o; n++) {
                          var a = (i[n >>> 2] >>> (24 - (n % 4) * 8)) & 255;
                          t[(s + n) >>> 2] |= a << (24 - ((s + n) % 4) * 8);
                        }
                      else
                        for (n = 0; n < o; n += 4)
                          t[(s + n) >>> 2] = i[n >>> 2];
                      return (this.sigBytes += o), this;
                    },
                    clamp: function () {
                      var t = this.words,
                        i = this.sigBytes;
                      (t[i >>> 2] &= 4294967295 << (32 - (i % 4) * 8)),
                        (t.length = e.ceil(i / 4));
                    },
                    clone: function () {
                      var e = c.clone.call(this);
                      return (e.words = this.words.slice(0)), e;
                    },
                    random: function (e) {
                      for (var t = [], i = 0; i < e; i += 4) t.push(o());
                      return new d.init(t, e);
                    },
                  })),
                  h = (r.enc = {}),
                  p = (h.Hex = {
                    stringify: function (e) {
                      for (
                        var t = e.words, i = e.sigBytes, s = [], o = 0;
                        o < i;
                        o++
                      ) {
                        var n = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
                        s.push((n >>> 4).toString(16)),
                          s.push((15 & n).toString(16));
                      }
                      return s.join("");
                    },
                    parse: function (e) {
                      for (var t = e.length, i = [], s = 0; s < t; s += 2)
                        i[s >>> 3] |=
                          parseInt(e.substr(s, 2), 16) << (24 - (s % 8) * 4);
                      return new d.init(i, t / 2);
                    },
                  }),
                  u = (h.Latin1 = {
                    stringify: function (e) {
                      for (
                        var t = e.words, i = e.sigBytes, s = [], o = 0;
                        o < i;
                        o++
                      ) {
                        var n = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
                        s.push(String.fromCharCode(n));
                      }
                      return s.join("");
                    },
                    parse: function (e) {
                      for (var t = e.length, i = [], s = 0; s < t; s++)
                        i[s >>> 2] |=
                          (255 & e.charCodeAt(s)) << (24 - (s % 4) * 8);
                      return new d.init(i, t);
                    },
                  }),
                  g = (h.Utf8 = {
                    stringify: function (e) {
                      try {
                        return decodeURIComponent(escape(u.stringify(e)));
                      } catch (e) {
                        throw new Error("Malformed UTF-8 data");
                      }
                    },
                    parse: function (e) {
                      return u.parse(unescape(encodeURIComponent(e)));
                    },
                  }),
                  m = (l.BufferedBlockAlgorithm = c.extend({
                    reset: function () {
                      (this._data = new d.init()), (this._nDataBytes = 0);
                    },
                    _append: function (e) {
                      "string" == typeof e && (e = g.parse(e)),
                        this._data.concat(e),
                        (this._nDataBytes += e.sigBytes);
                    },
                    _process: function (t) {
                      var i,
                        s = this._data,
                        o = s.words,
                        n = s.sigBytes,
                        a = this.blockSize,
                        r = n / (4 * a),
                        l =
                          (r = t
                            ? e.ceil(r)
                            : e.max((0 | r) - this._minBufferSize, 0)) * a,
                        c = e.min(4 * l, n);
                      if (l) {
                        for (var h = 0; h < l; h += a)
                          this._doProcessBlock(o, h);
                        (i = o.splice(0, l)), (s.sigBytes -= c);
                      }
                      return new d.init(i, c);
                    },
                    clone: function () {
                      var e = c.clone.call(this);
                      return (e._data = this._data.clone()), e;
                    },
                    _minBufferSize: 0,
                  })),
                  f =
                    ((l.Hasher = m.extend({
                      cfg: c.extend(),
                      init: function (e) {
                        (this.cfg = this.cfg.extend(e)), this.reset();
                      },
                      reset: function () {
                        m.reset.call(this), this._doReset();
                      },
                      update: function (e) {
                        return this._append(e), this._process(), this;
                      },
                      finalize: function (e) {
                        return e && this._append(e), this._doFinalize();
                      },
                      blockSize: 16,
                      _createHelper: function (e) {
                        return function (t, i) {
                          return new e.init(i).finalize(t);
                        };
                      },
                      _createHmacHelper: function (e) {
                        return function (t, i) {
                          return new f.HMAC.init(e, i).finalize(t);
                        };
                      },
                    })),
                    (r.algo = {}));
                return r;
              })(Math);
          function Ae(e, t, i) {
            return e ^ t ^ i;
          }
          function Le(e, t, i) {
            return (e & t) | (~e & i);
          }
          function Re(e, t, i) {
            return (e | ~t) ^ i;
          }
          function Pe(e, t, i) {
            return (e & i) | (t & ~i);
          }
          function Te(e, t, i) {
            return e ^ (t | ~i);
          }
          function _e(e, t) {
            return (e << t) | (e >>> (32 - t));
          }
          function xe(e, t, i, s) {
            var o,
              n = this._iv;
            n ? ((o = n.slice(0)), (this._iv = void 0)) : (o = this._prevBlock),
              s.encryptBlock(o, 0);
            for (var a = 0; a < i; a++) e[t + a] ^= o[a];
          }
          function Ne(e) {
            if (255 == ((e >> 24) & 255)) {
              var t = (e >> 16) & 255,
                i = (e >> 8) & 255,
                s = 255 & e;
              255 === t
                ? ((t = 0),
                  255 === i ? ((i = 0), 255 === s ? (s = 0) : ++s) : ++i)
                : ++t,
                (e = 0),
                (e += t << 16),
                (e += i << 8),
                (e += s);
            } else e += 1 << 24;
            return e;
          }
          function Ee() {
            for (var e = this._X, t = this._C, i = 0; i < 8; i++) ue[i] = t[i];
            for (
              t[0] = (t[0] + 1295307597 + this._b) | 0,
                t[1] =
                  (t[1] + 3545052371 + (t[0] >>> 0 < ue[0] >>> 0 ? 1 : 0)) | 0,
                t[2] =
                  (t[2] + 886263092 + (t[1] >>> 0 < ue[1] >>> 0 ? 1 : 0)) | 0,
                t[3] =
                  (t[3] + 1295307597 + (t[2] >>> 0 < ue[2] >>> 0 ? 1 : 0)) | 0,
                t[4] =
                  (t[4] + 3545052371 + (t[3] >>> 0 < ue[3] >>> 0 ? 1 : 0)) | 0,
                t[5] =
                  (t[5] + 886263092 + (t[4] >>> 0 < ue[4] >>> 0 ? 1 : 0)) | 0,
                t[6] =
                  (t[6] + 1295307597 + (t[5] >>> 0 < ue[5] >>> 0 ? 1 : 0)) | 0,
                t[7] =
                  (t[7] + 3545052371 + (t[6] >>> 0 < ue[6] >>> 0 ? 1 : 0)) | 0,
                this._b = t[7] >>> 0 < ue[7] >>> 0 ? 1 : 0,
                i = 0;
              i < 8;
              i++
            ) {
              var s = e[i] + t[i],
                o = 65535 & s,
                n = s >>> 16,
                a = ((((o * o) >>> 17) + o * n) >>> 15) + n * n,
                r = (((4294901760 & s) * s) | 0) + (((65535 & s) * s) | 0);
              ge[i] = a ^ r;
            }
            (e[0] =
              (ge[0] +
                ((ge[7] << 16) | (ge[7] >>> 16)) +
                ((ge[6] << 16) | (ge[6] >>> 16))) |
              0),
              (e[1] = (ge[1] + ((ge[0] << 8) | (ge[0] >>> 24)) + ge[7]) | 0),
              (e[2] =
                (ge[2] +
                  ((ge[1] << 16) | (ge[1] >>> 16)) +
                  ((ge[0] << 16) | (ge[0] >>> 16))) |
                0),
              (e[3] = (ge[3] + ((ge[2] << 8) | (ge[2] >>> 24)) + ge[1]) | 0),
              (e[4] =
                (ge[4] +
                  ((ge[3] << 16) | (ge[3] >>> 16)) +
                  ((ge[2] << 16) | (ge[2] >>> 16))) |
                0),
              (e[5] = (ge[5] + ((ge[4] << 8) | (ge[4] >>> 24)) + ge[3]) | 0),
              (e[6] =
                (ge[6] +
                  ((ge[5] << 16) | (ge[5] >>> 16)) +
                  ((ge[4] << 16) | (ge[4] >>> 16))) |
                0),
              (e[7] = (ge[7] + ((ge[6] << 8) | (ge[6] >>> 24)) + ge[5]) | 0);
          }
          function je() {
            for (var e = this._X, t = this._C, i = 0; i < 8; i++) Se[i] = t[i];
            for (
              t[0] = (t[0] + 1295307597 + this._b) | 0,
                t[1] =
                  (t[1] + 3545052371 + (t[0] >>> 0 < Se[0] >>> 0 ? 1 : 0)) | 0,
                t[2] =
                  (t[2] + 886263092 + (t[1] >>> 0 < Se[1] >>> 0 ? 1 : 0)) | 0,
                t[3] =
                  (t[3] + 1295307597 + (t[2] >>> 0 < Se[2] >>> 0 ? 1 : 0)) | 0,
                t[4] =
                  (t[4] + 3545052371 + (t[3] >>> 0 < Se[3] >>> 0 ? 1 : 0)) | 0,
                t[5] =
                  (t[5] + 886263092 + (t[4] >>> 0 < Se[4] >>> 0 ? 1 : 0)) | 0,
                t[6] =
                  (t[6] + 1295307597 + (t[5] >>> 0 < Se[5] >>> 0 ? 1 : 0)) | 0,
                t[7] =
                  (t[7] + 3545052371 + (t[6] >>> 0 < Se[6] >>> 0 ? 1 : 0)) | 0,
                this._b = t[7] >>> 0 < Se[7] >>> 0 ? 1 : 0,
                i = 0;
              i < 8;
              i++
            ) {
              var s = e[i] + t[i],
                o = 65535 & s,
                n = s >>> 16,
                a = ((((o * o) >>> 17) + o * n) >>> 15) + n * n,
                r = (((4294901760 & s) * s) | 0) + (((65535 & s) * s) | 0);
              Ie[i] = a ^ r;
            }
            (e[0] =
              (Ie[0] +
                ((Ie[7] << 16) | (Ie[7] >>> 16)) +
                ((Ie[6] << 16) | (Ie[6] >>> 16))) |
              0),
              (e[1] = (Ie[1] + ((Ie[0] << 8) | (Ie[0] >>> 24)) + Ie[7]) | 0),
              (e[2] =
                (Ie[2] +
                  ((Ie[1] << 16) | (Ie[1] >>> 16)) +
                  ((Ie[0] << 16) | (Ie[0] >>> 16))) |
                0),
              (e[3] = (Ie[3] + ((Ie[2] << 8) | (Ie[2] >>> 24)) + Ie[1]) | 0),
              (e[4] =
                (Ie[4] +
                  ((Ie[3] << 16) | (Ie[3] >>> 16)) +
                  ((Ie[2] << 16) | (Ie[2] >>> 16))) |
                0),
              (e[5] = (Ie[5] + ((Ie[4] << 8) | (Ie[4] >>> 24)) + Ie[3]) | 0),
              (e[6] =
                (Ie[6] +
                  ((Ie[5] << 16) | (Ie[5] >>> 16)) +
                  ((Ie[4] << 16) | (Ie[4] >>> 16))) |
                0),
              (e[7] = (Ie[7] + ((Ie[6] << 8) | (Ie[6] >>> 24)) + Ie[5]) | 0);
          }
          return (
            (e = Oe.lib.WordArray),
            (Oe.enc.Base64 = {
              stringify: function (e) {
                var t = e.words,
                  i = e.sigBytes,
                  s = this._map;
                e.clamp();
                for (var o = [], n = 0; n < i; n += 3)
                  for (
                    var a =
                        (((t[n >>> 2] >>> (24 - (n % 4) * 8)) & 255) << 16) |
                        (((t[(n + 1) >>> 2] >>> (24 - ((n + 1) % 4) * 8)) &
                          255) <<
                          8) |
                        ((t[(n + 2) >>> 2] >>> (24 - ((n + 2) % 4) * 8)) & 255),
                      r = 0;
                    r < 4 && n + 0.75 * r < i;
                    r++
                  )
                    o.push(s.charAt((a >>> (6 * (3 - r))) & 63));
                var l = s.charAt(64);
                if (l) for (; o.length % 4; ) o.push(l);
                return o.join("");
              },
              parse: function (t) {
                var i = t.length,
                  s = this._map,
                  o = this._reverseMap;
                if (!o) {
                  o = this._reverseMap = [];
                  for (var n = 0; n < s.length; n++) o[s.charCodeAt(n)] = n;
                }
                var a = s.charAt(64);
                if (a) {
                  var r = t.indexOf(a);
                  -1 !== r && (i = r);
                }
                return (function (t, i, s) {
                  for (var o = [], n = 0, a = 0; a < i; a++)
                    if (a % 4) {
                      var r =
                        (s[t.charCodeAt(a - 1)] << ((a % 4) * 2)) |
                        (s[t.charCodeAt(a)] >>> (6 - (a % 4) * 2));
                      (o[n >>> 2] |= r << (24 - (n % 4) * 8)), n++;
                    }
                  return e.create(o, n);
                })(t, i, o);
              },
              _map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
            }),
            (function (e) {
              var t = Oe,
                i = t.lib,
                s = i.WordArray,
                o = i.Hasher,
                n = t.algo,
                a = [];
              !(function () {
                for (var t = 0; t < 64; t++)
                  a[t] = (4294967296 * e.abs(e.sin(t + 1))) | 0;
              })();
              var r = (n.MD5 = o.extend({
                _doReset: function () {
                  this._hash = new s.init([
                    1732584193, 4023233417, 2562383102, 271733878,
                  ]);
                },
                _doProcessBlock: function (e, t) {
                  for (var i = 0; i < 16; i++) {
                    var s = t + i,
                      o = e[s];
                    e[s] =
                      (16711935 & ((o << 8) | (o >>> 24))) |
                      (4278255360 & ((o << 24) | (o >>> 8)));
                  }
                  var n = this._hash.words,
                    r = e[t + 0],
                    p = e[t + 1],
                    u = e[t + 2],
                    g = e[t + 3],
                    m = e[t + 4],
                    f = e[t + 5],
                    y = e[t + 6],
                    w = e[t + 7],
                    v = e[t + 8],
                    C = e[t + 9],
                    b = e[t + 10],
                    S = e[t + 11],
                    I = e[t + 12],
                    k = e[t + 13],
                    O = e[t + 14],
                    A = e[t + 15],
                    L = n[0],
                    R = n[1],
                    P = n[2],
                    T = n[3];
                  (L = l(L, R, P, T, r, 7, a[0])),
                    (T = l(T, L, R, P, p, 12, a[1])),
                    (P = l(P, T, L, R, u, 17, a[2])),
                    (R = l(R, P, T, L, g, 22, a[3])),
                    (L = l(L, R, P, T, m, 7, a[4])),
                    (T = l(T, L, R, P, f, 12, a[5])),
                    (P = l(P, T, L, R, y, 17, a[6])),
                    (R = l(R, P, T, L, w, 22, a[7])),
                    (L = l(L, R, P, T, v, 7, a[8])),
                    (T = l(T, L, R, P, C, 12, a[9])),
                    (P = l(P, T, L, R, b, 17, a[10])),
                    (R = l(R, P, T, L, S, 22, a[11])),
                    (L = l(L, R, P, T, I, 7, a[12])),
                    (T = l(T, L, R, P, k, 12, a[13])),
                    (P = l(P, T, L, R, O, 17, a[14])),
                    (L = c(
                      L,
                      (R = l(R, P, T, L, A, 22, a[15])),
                      P,
                      T,
                      p,
                      5,
                      a[16]
                    )),
                    (T = c(T, L, R, P, y, 9, a[17])),
                    (P = c(P, T, L, R, S, 14, a[18])),
                    (R = c(R, P, T, L, r, 20, a[19])),
                    (L = c(L, R, P, T, f, 5, a[20])),
                    (T = c(T, L, R, P, b, 9, a[21])),
                    (P = c(P, T, L, R, A, 14, a[22])),
                    (R = c(R, P, T, L, m, 20, a[23])),
                    (L = c(L, R, P, T, C, 5, a[24])),
                    (T = c(T, L, R, P, O, 9, a[25])),
                    (P = c(P, T, L, R, g, 14, a[26])),
                    (R = c(R, P, T, L, v, 20, a[27])),
                    (L = c(L, R, P, T, k, 5, a[28])),
                    (T = c(T, L, R, P, u, 9, a[29])),
                    (P = c(P, T, L, R, w, 14, a[30])),
                    (L = d(
                      L,
                      (R = c(R, P, T, L, I, 20, a[31])),
                      P,
                      T,
                      f,
                      4,
                      a[32]
                    )),
                    (T = d(T, L, R, P, v, 11, a[33])),
                    (P = d(P, T, L, R, S, 16, a[34])),
                    (R = d(R, P, T, L, O, 23, a[35])),
                    (L = d(L, R, P, T, p, 4, a[36])),
                    (T = d(T, L, R, P, m, 11, a[37])),
                    (P = d(P, T, L, R, w, 16, a[38])),
                    (R = d(R, P, T, L, b, 23, a[39])),
                    (L = d(L, R, P, T, k, 4, a[40])),
                    (T = d(T, L, R, P, r, 11, a[41])),
                    (P = d(P, T, L, R, g, 16, a[42])),
                    (R = d(R, P, T, L, y, 23, a[43])),
                    (L = d(L, R, P, T, C, 4, a[44])),
                    (T = d(T, L, R, P, I, 11, a[45])),
                    (P = d(P, T, L, R, A, 16, a[46])),
                    (L = h(
                      L,
                      (R = d(R, P, T, L, u, 23, a[47])),
                      P,
                      T,
                      r,
                      6,
                      a[48]
                    )),
                    (T = h(T, L, R, P, w, 10, a[49])),
                    (P = h(P, T, L, R, O, 15, a[50])),
                    (R = h(R, P, T, L, f, 21, a[51])),
                    (L = h(L, R, P, T, I, 6, a[52])),
                    (T = h(T, L, R, P, g, 10, a[53])),
                    (P = h(P, T, L, R, b, 15, a[54])),
                    (R = h(R, P, T, L, p, 21, a[55])),
                    (L = h(L, R, P, T, v, 6, a[56])),
                    (T = h(T, L, R, P, A, 10, a[57])),
                    (P = h(P, T, L, R, y, 15, a[58])),
                    (R = h(R, P, T, L, k, 21, a[59])),
                    (L = h(L, R, P, T, m, 6, a[60])),
                    (T = h(T, L, R, P, S, 10, a[61])),
                    (P = h(P, T, L, R, u, 15, a[62])),
                    (R = h(R, P, T, L, C, 21, a[63])),
                    (n[0] = (n[0] + L) | 0),
                    (n[1] = (n[1] + R) | 0),
                    (n[2] = (n[2] + P) | 0),
                    (n[3] = (n[3] + T) | 0);
                },
                _doFinalize: function () {
                  var t = this._data,
                    i = t.words,
                    s = 8 * this._nDataBytes,
                    o = 8 * t.sigBytes;
                  i[o >>> 5] |= 128 << (24 - (o % 32));
                  var n = e.floor(s / 4294967296),
                    a = s;
                  (i[15 + (((64 + o) >>> 9) << 4)] =
                    (16711935 & ((n << 8) | (n >>> 24))) |
                    (4278255360 & ((n << 24) | (n >>> 8)))),
                    (i[14 + (((64 + o) >>> 9) << 4)] =
                      (16711935 & ((a << 8) | (a >>> 24))) |
                      (4278255360 & ((a << 24) | (a >>> 8)))),
                    (t.sigBytes = 4 * (i.length + 1)),
                    this._process();
                  for (var r = this._hash, l = r.words, c = 0; c < 4; c++) {
                    var d = l[c];
                    l[c] =
                      (16711935 & ((d << 8) | (d >>> 24))) |
                      (4278255360 & ((d << 24) | (d >>> 8)));
                  }
                  return r;
                },
                clone: function () {
                  var e = o.clone.call(this);
                  return (e._hash = this._hash.clone()), e;
                },
              }));
              function l(e, t, i, s, o, n, a) {
                var r = e + ((t & i) | (~t & s)) + o + a;
                return ((r << n) | (r >>> (32 - n))) + t;
              }
              function c(e, t, i, s, o, n, a) {
                var r = e + ((t & s) | (i & ~s)) + o + a;
                return ((r << n) | (r >>> (32 - n))) + t;
              }
              function d(e, t, i, s, o, n, a) {
                var r = e + (t ^ i ^ s) + o + a;
                return ((r << n) | (r >>> (32 - n))) + t;
              }
              function h(e, t, i, s, o, n, a) {
                var r = e + (i ^ (t | ~s)) + o + a;
                return ((r << n) | (r >>> (32 - n))) + t;
              }
              (t.MD5 = o._createHelper(r)),
                (t.HmacMD5 = o._createHmacHelper(r));
            })(Math),
            (o = (s = Oe).lib),
            (n = o.WordArray),
            (a = o.Hasher),
            (r = s.algo),
            (l = []),
            (c = r.SHA1 =
              a.extend({
                _doReset: function () {
                  this._hash = new n.init([
                    1732584193, 4023233417, 2562383102, 271733878, 3285377520,
                  ]);
                },
                _doProcessBlock: function (e, t) {
                  for (
                    var i = this._hash.words,
                      s = i[0],
                      o = i[1],
                      n = i[2],
                      a = i[3],
                      r = i[4],
                      c = 0;
                    c < 80;
                    c++
                  ) {
                    if (c < 16) l[c] = 0 | e[t + c];
                    else {
                      var d = l[c - 3] ^ l[c - 8] ^ l[c - 14] ^ l[c - 16];
                      l[c] = (d << 1) | (d >>> 31);
                    }
                    var h = ((s << 5) | (s >>> 27)) + r + l[c];
                    (h +=
                      c < 20
                        ? 1518500249 + ((o & n) | (~o & a))
                        : c < 40
                        ? 1859775393 + (o ^ n ^ a)
                        : c < 60
                        ? ((o & n) | (o & a) | (n & a)) - 1894007588
                        : (o ^ n ^ a) - 899497514),
                      (r = a),
                      (a = n),
                      (n = (o << 30) | (o >>> 2)),
                      (o = s),
                      (s = h);
                  }
                  (i[0] = (i[0] + s) | 0),
                    (i[1] = (i[1] + o) | 0),
                    (i[2] = (i[2] + n) | 0),
                    (i[3] = (i[3] + a) | 0),
                    (i[4] = (i[4] + r) | 0);
                },
                _doFinalize: function () {
                  var e = this._data,
                    t = e.words,
                    i = 8 * this._nDataBytes,
                    s = 8 * e.sigBytes;
                  return (
                    (t[s >>> 5] |= 128 << (24 - (s % 32))),
                    (t[14 + (((64 + s) >>> 9) << 4)] = Math.floor(
                      i / 4294967296
                    )),
                    (t[15 + (((64 + s) >>> 9) << 4)] = i),
                    (e.sigBytes = 4 * t.length),
                    this._process(),
                    this._hash
                  );
                },
                clone: function () {
                  var e = a.clone.call(this);
                  return (e._hash = this._hash.clone()), e;
                },
              })),
            (s.SHA1 = a._createHelper(c)),
            (s.HmacSHA1 = a._createHmacHelper(c)),
            (function (e) {
              var t = Oe,
                i = t.lib,
                s = i.WordArray,
                o = i.Hasher,
                n = t.algo,
                a = [],
                r = [];
              !(function () {
                function t(t) {
                  for (var i = e.sqrt(t), s = 2; s <= i; s++)
                    if (!(t % s)) return;
                  return 1;
                }
                function i(e) {
                  return (4294967296 * (e - (0 | e))) | 0;
                }
                for (var s = 2, o = 0; o < 64; )
                  t(s) &&
                    (o < 8 && (a[o] = i(e.pow(s, 0.5))),
                    (r[o] = i(e.pow(s, 1 / 3))),
                    o++),
                    s++;
              })();
              var l = [],
                c = (n.SHA256 = o.extend({
                  _doReset: function () {
                    this._hash = new s.init(a.slice(0));
                  },
                  _doProcessBlock: function (e, t) {
                    for (
                      var i = this._hash.words,
                        s = i[0],
                        o = i[1],
                        n = i[2],
                        a = i[3],
                        c = i[4],
                        d = i[5],
                        h = i[6],
                        p = i[7],
                        u = 0;
                      u < 64;
                      u++
                    ) {
                      if (u < 16) l[u] = 0 | e[t + u];
                      else {
                        var g = l[u - 15],
                          m =
                            ((g << 25) | (g >>> 7)) ^
                            ((g << 14) | (g >>> 18)) ^
                            (g >>> 3),
                          f = l[u - 2],
                          y =
                            ((f << 15) | (f >>> 17)) ^
                            ((f << 13) | (f >>> 19)) ^
                            (f >>> 10);
                        l[u] = m + l[u - 7] + y + l[u - 16];
                      }
                      var w = (s & o) ^ (s & n) ^ (o & n),
                        v =
                          ((s << 30) | (s >>> 2)) ^
                          ((s << 19) | (s >>> 13)) ^
                          ((s << 10) | (s >>> 22)),
                        C =
                          p +
                          (((c << 26) | (c >>> 6)) ^
                            ((c << 21) | (c >>> 11)) ^
                            ((c << 7) | (c >>> 25))) +
                          ((c & d) ^ (~c & h)) +
                          r[u] +
                          l[u];
                      (p = h),
                        (h = d),
                        (d = c),
                        (c = (a + C) | 0),
                        (a = n),
                        (n = o),
                        (o = s),
                        (s = (C + (v + w)) | 0);
                    }
                    (i[0] = (i[0] + s) | 0),
                      (i[1] = (i[1] + o) | 0),
                      (i[2] = (i[2] + n) | 0),
                      (i[3] = (i[3] + a) | 0),
                      (i[4] = (i[4] + c) | 0),
                      (i[5] = (i[5] + d) | 0),
                      (i[6] = (i[6] + h) | 0),
                      (i[7] = (i[7] + p) | 0);
                  },
                  _doFinalize: function () {
                    var t = this._data,
                      i = t.words,
                      s = 8 * this._nDataBytes,
                      o = 8 * t.sigBytes;
                    return (
                      (i[o >>> 5] |= 128 << (24 - (o % 32))),
                      (i[14 + (((64 + o) >>> 9) << 4)] = e.floor(
                        s / 4294967296
                      )),
                      (i[15 + (((64 + o) >>> 9) << 4)] = s),
                      (t.sigBytes = 4 * i.length),
                      this._process(),
                      this._hash
                    );
                  },
                  clone: function () {
                    var e = o.clone.call(this);
                    return (e._hash = this._hash.clone()), e;
                  },
                }));
              (t.SHA256 = o._createHelper(c)),
                (t.HmacSHA256 = o._createHmacHelper(c));
            })(Math),
            (function () {
              var e = Oe.lib.WordArray,
                t = Oe.enc;
              function i(e) {
                return ((e << 8) & 4278255360) | ((e >>> 8) & 16711935);
              }
              (t.Utf16 = t.Utf16BE =
                {
                  stringify: function (e) {
                    for (
                      var t = e.words, i = e.sigBytes, s = [], o = 0;
                      o < i;
                      o += 2
                    ) {
                      var n = (t[o >>> 2] >>> (16 - (o % 4) * 8)) & 65535;
                      s.push(String.fromCharCode(n));
                    }
                    return s.join("");
                  },
                  parse: function (t) {
                    for (var i = t.length, s = [], o = 0; o < i; o++)
                      s[o >>> 1] |= t.charCodeAt(o) << (16 - (o % 2) * 16);
                    return e.create(s, 2 * i);
                  },
                }),
                (t.Utf16LE = {
                  stringify: function (e) {
                    for (
                      var t = e.words, s = e.sigBytes, o = [], n = 0;
                      n < s;
                      n += 2
                    ) {
                      var a = i((t[n >>> 2] >>> (16 - (n % 4) * 8)) & 65535);
                      o.push(String.fromCharCode(a));
                    }
                    return o.join("");
                  },
                  parse: function (t) {
                    for (var s = t.length, o = [], n = 0; n < s; n++)
                      o[n >>> 1] |= i(t.charCodeAt(n) << (16 - (n % 2) * 16));
                    return e.create(o, 2 * s);
                  },
                });
            })(),
            (function () {
              if ("function" == typeof ArrayBuffer) {
                var e = Oe.lib.WordArray,
                  t = e.init;
                (e.init = function (e) {
                  if (
                    (e instanceof ArrayBuffer && (e = new Uint8Array(e)),
                    (e instanceof Int8Array ||
                      ("undefined" != typeof Uint8ClampedArray &&
                        e instanceof Uint8ClampedArray) ||
                      e instanceof Int16Array ||
                      e instanceof Uint16Array ||
                      e instanceof Int32Array ||
                      e instanceof Uint32Array ||
                      e instanceof Float32Array ||
                      e instanceof Float64Array) &&
                      (e = new Uint8Array(
                        e.buffer,
                        e.byteOffset,
                        e.byteLength
                      )),
                    e instanceof Uint8Array)
                  ) {
                    for (var i = e.byteLength, s = [], o = 0; o < i; o++)
                      s[o >>> 2] |= e[o] << (24 - (o % 4) * 8);
                    t.call(this, s, i);
                  } else t.apply(this, arguments);
                }).prototype = e;
              }
            })(),
            Math,
            (h = (d = Oe).lib),
            (p = h.WordArray),
            (u = h.Hasher),
            (g = d.algo),
            (m = p.create([
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 7, 4, 13, 1,
              10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8, 3, 10, 14, 4, 9, 15, 8,
              1, 2, 7, 0, 6, 13, 11, 5, 12, 1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7,
              15, 14, 5, 6, 2, 4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15,
              13,
            ])),
            (f = p.create([
              5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12, 6, 11, 3, 7,
              0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2, 15, 5, 1, 3, 7, 14, 6, 9,
              11, 8, 12, 2, 10, 0, 4, 13, 8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2,
              13, 9, 7, 10, 14, 12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3,
              9, 11,
            ])),
            (y = p.create([
              11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8, 7, 6, 8,
              13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12, 11, 13, 6, 7, 14,
              9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5, 11, 12, 14, 15, 14, 15, 9,
              8, 9, 14, 5, 6, 8, 6, 5, 12, 9, 15, 5, 11, 6, 8, 13, 12, 5, 12,
              13, 14, 11, 8, 5, 6,
            ])),
            (w = p.create([
              8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6, 9, 13, 15,
              7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11, 9, 7, 15, 11, 8, 6,
              6, 14, 12, 13, 5, 14, 13, 13, 7, 5, 15, 5, 8, 11, 14, 14, 6, 14,
              6, 9, 12, 9, 12, 5, 15, 8, 8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5,
              15, 13, 11, 11,
            ])),
            (v = p.create([0, 1518500249, 1859775393, 2400959708, 2840853838])),
            (C = p.create([1352829926, 1548603684, 1836072691, 2053994217, 0])),
            (b = g.RIPEMD160 =
              u.extend({
                _doReset: function () {
                  this._hash = p.create([
                    1732584193, 4023233417, 2562383102, 271733878, 3285377520,
                  ]);
                },
                _doProcessBlock: function (e, t) {
                  for (var i = 0; i < 16; i++) {
                    var s = t + i,
                      o = e[s];
                    e[s] =
                      (16711935 & ((o << 8) | (o >>> 24))) |
                      (4278255360 & ((o << 24) | (o >>> 8)));
                  }
                  var n,
                    a,
                    r,
                    l,
                    c,
                    d,
                    h,
                    p,
                    u,
                    g,
                    b,
                    S = this._hash.words,
                    I = v.words,
                    k = C.words,
                    O = m.words,
                    A = f.words,
                    L = y.words,
                    R = w.words;
                  for (
                    d = n = S[0],
                      h = a = S[1],
                      p = r = S[2],
                      u = l = S[3],
                      g = c = S[4],
                      i = 0;
                    i < 80;
                    i += 1
                  )
                    (b = (n + e[t + O[i]]) | 0),
                      (b +=
                        i < 16
                          ? Ae(a, r, l) + I[0]
                          : i < 32
                          ? Le(a, r, l) + I[1]
                          : i < 48
                          ? Re(a, r, l) + I[2]
                          : i < 64
                          ? Pe(a, r, l) + I[3]
                          : Te(a, r, l) + I[4]),
                      (b = ((b = _e((b |= 0), L[i])) + c) | 0),
                      (n = c),
                      (c = l),
                      (l = _e(r, 10)),
                      (r = a),
                      (a = b),
                      (b = (d + e[t + A[i]]) | 0),
                      (b +=
                        i < 16
                          ? Te(h, p, u) + k[0]
                          : i < 32
                          ? Pe(h, p, u) + k[1]
                          : i < 48
                          ? Re(h, p, u) + k[2]
                          : i < 64
                          ? Le(h, p, u) + k[3]
                          : Ae(h, p, u) + k[4]),
                      (b = ((b = _e((b |= 0), R[i])) + g) | 0),
                      (d = g),
                      (g = u),
                      (u = _e(p, 10)),
                      (p = h),
                      (h = b);
                  (b = (S[1] + r + u) | 0),
                    (S[1] = (S[2] + l + g) | 0),
                    (S[2] = (S[3] + c + d) | 0),
                    (S[3] = (S[4] + n + h) | 0),
                    (S[4] = (S[0] + a + p) | 0),
                    (S[0] = b);
                },
                _doFinalize: function () {
                  var e = this._data,
                    t = e.words,
                    i = 8 * this._nDataBytes,
                    s = 8 * e.sigBytes;
                  (t[s >>> 5] |= 128 << (24 - (s % 32))),
                    (t[14 + (((64 + s) >>> 9) << 4)] =
                      (16711935 & ((i << 8) | (i >>> 24))) |
                      (4278255360 & ((i << 24) | (i >>> 8)))),
                    (e.sigBytes = 4 * (t.length + 1)),
                    this._process();
                  for (var o = this._hash, n = o.words, a = 0; a < 5; a++) {
                    var r = n[a];
                    n[a] =
                      (16711935 & ((r << 8) | (r >>> 24))) |
                      (4278255360 & ((r << 24) | (r >>> 8)));
                  }
                  return o;
                },
                clone: function () {
                  var e = u.clone.call(this);
                  return (e._hash = this._hash.clone()), e;
                },
              })),
            (d.RIPEMD160 = u._createHelper(b)),
            (d.HmacRIPEMD160 = u._createHmacHelper(b)),
            (S = Oe.lib.Base),
            (I = Oe.enc.Utf8),
            (Oe.algo.HMAC = S.extend({
              init: function (e, t) {
                (e = this._hasher = new e.init()),
                  "string" == typeof t && (t = I.parse(t));
                var i = e.blockSize,
                  s = 4 * i;
                t.sigBytes > s && (t = e.finalize(t)), t.clamp();
                for (
                  var o = (this._oKey = t.clone()),
                    n = (this._iKey = t.clone()),
                    a = o.words,
                    r = n.words,
                    l = 0;
                  l < i;
                  l++
                )
                  (a[l] ^= 1549556828), (r[l] ^= 909522486);
                (o.sigBytes = n.sigBytes = s), this.reset();
              },
              reset: function () {
                var e = this._hasher;
                e.reset(), e.update(this._iKey);
              },
              update: function (e) {
                return this._hasher.update(e), this;
              },
              finalize: function (e) {
                var t = this._hasher,
                  i = t.finalize(e);
                return t.reset(), t.finalize(this._oKey.clone().concat(i));
              },
            })),
            (O = (k = Oe).lib),
            (A = O.Base),
            (L = O.WordArray),
            (R = k.algo),
            (P = R.SHA1),
            (T = R.HMAC),
            (_ = R.PBKDF2 =
              A.extend({
                cfg: A.extend({ keySize: 4, hasher: P, iterations: 1 }),
                init: function (e) {
                  this.cfg = this.cfg.extend(e);
                },
                compute: function (e, t) {
                  for (
                    var i = this.cfg,
                      s = T.create(i.hasher, e),
                      o = L.create(),
                      n = L.create([1]),
                      a = o.words,
                      r = n.words,
                      l = i.keySize,
                      c = i.iterations;
                    a.length < l;

                  ) {
                    var d = s.update(t).finalize(n);
                    s.reset();
                    for (
                      var h = d.words, p = h.length, u = d, g = 1;
                      g < c;
                      g++
                    ) {
                      (u = s.finalize(u)), s.reset();
                      for (var m = u.words, f = 0; f < p; f++) h[f] ^= m[f];
                    }
                    o.concat(d), r[0]++;
                  }
                  return (o.sigBytes = 4 * l), o;
                },
              })),
            (k.PBKDF2 = function (e, t, i) {
              return _.create(i).compute(e, t);
            }),
            (N = (x = Oe).lib),
            (E = N.Base),
            (j = N.WordArray),
            (D = x.algo),
            (B = D.MD5),
            (F = D.EvpKDF =
              E.extend({
                cfg: E.extend({ keySize: 4, hasher: B, iterations: 1 }),
                init: function (e) {
                  this.cfg = this.cfg.extend(e);
                },
                compute: function (e, t) {
                  for (
                    var i,
                      s = this.cfg,
                      o = s.hasher.create(),
                      n = j.create(),
                      a = n.words,
                      r = s.keySize,
                      l = s.iterations;
                    a.length < r;

                  ) {
                    i && o.update(i), (i = o.update(e).finalize(t)), o.reset();
                    for (var c = 1; c < l; c++) (i = o.finalize(i)), o.reset();
                    n.concat(i);
                  }
                  return (n.sigBytes = 4 * r), n;
                },
              })),
            (x.EvpKDF = function (e, t, i) {
              return F.create(i).compute(e, t);
            }),
            (U = ($ = Oe).lib.WordArray),
            (V = $.algo),
            (J = V.SHA256),
            (H = V.SHA224 =
              J.extend({
                _doReset: function () {
                  this._hash = new U.init([
                    3238371032, 914150663, 812702999, 4144912697, 4290775857,
                    1750603025, 1694076839, 3204075428,
                  ]);
                },
                _doFinalize: function () {
                  var e = J._doFinalize.call(this);
                  return (e.sigBytes -= 4), e;
                },
              })),
            ($.SHA224 = J._createHelper(H)),
            ($.HmacSHA224 = J._createHmacHelper(H)),
            (M = Oe.lib),
            (z = M.Base),
            (G = M.WordArray),
            ((W = Oe.x64 = {}).Word = z.extend({
              init: function (e, t) {
                (this.high = e), (this.low = t);
              },
            })),
            (W.WordArray = z.extend({
              init: function (e, t) {
                (e = this.words = e || []),
                  (this.sigBytes = null != t ? t : 8 * e.length);
              },
              toX32: function () {
                for (
                  var e = this.words, t = e.length, i = [], s = 0;
                  s < t;
                  s++
                ) {
                  var o = e[s];
                  i.push(o.high), i.push(o.low);
                }
                return G.create(i, this.sigBytes);
              },
              clone: function () {
                for (
                  var e = z.clone.call(this),
                    t = (e.words = this.words.slice(0)),
                    i = t.length,
                    s = 0;
                  s < i;
                  s++
                )
                  t[s] = t[s].clone();
                return e;
              },
            })),
            (function (e) {
              var t = Oe,
                i = t.lib,
                s = i.WordArray,
                o = i.Hasher,
                n = t.x64.Word,
                a = t.algo,
                r = [],
                l = [],
                c = [];
              !(function () {
                for (var e = 1, t = 0, i = 0; i < 24; i++) {
                  r[e + 5 * t] = (((i + 1) * (i + 2)) / 2) % 64;
                  var s = (2 * e + 3 * t) % 5;
                  (e = t % 5), (t = s);
                }
                for (e = 0; e < 5; e++)
                  for (t = 0; t < 5; t++)
                    l[e + 5 * t] = t + ((2 * e + 3 * t) % 5) * 5;
                for (var o = 1, a = 0; a < 24; a++) {
                  for (var d = 0, h = 0, p = 0; p < 7; p++) {
                    if (1 & o) {
                      var u = (1 << p) - 1;
                      u < 32 ? (h ^= 1 << u) : (d ^= 1 << (u - 32));
                    }
                    128 & o ? (o = (o << 1) ^ 113) : (o <<= 1);
                  }
                  c[a] = n.create(d, h);
                }
              })();
              var d = [];
              !(function () {
                for (var e = 0; e < 25; e++) d[e] = n.create();
              })();
              var h = (a.SHA3 = o.extend({
                cfg: o.cfg.extend({ outputLength: 512 }),
                _doReset: function () {
                  for (var e = (this._state = []), t = 0; t < 25; t++)
                    e[t] = new n.init();
                  this.blockSize = (1600 - 2 * this.cfg.outputLength) / 32;
                },
                _doProcessBlock: function (e, t) {
                  for (
                    var i = this._state, s = this.blockSize / 2, o = 0;
                    o < s;
                    o++
                  ) {
                    var n = e[t + 2 * o],
                      a = e[t + 2 * o + 1];
                    (n =
                      (16711935 & ((n << 8) | (n >>> 24))) |
                      (4278255360 & ((n << 24) | (n >>> 8)))),
                      (a =
                        (16711935 & ((a << 8) | (a >>> 24))) |
                        (4278255360 & ((a << 24) | (a >>> 8)))),
                      ((R = i[o]).high ^= a),
                      (R.low ^= n);
                  }
                  for (var h = 0; h < 24; h++) {
                    for (var p = 0; p < 5; p++) {
                      for (var u = 0, g = 0, m = 0; m < 5; m++)
                        (u ^= (R = i[p + 5 * m]).high), (g ^= R.low);
                      var f = d[p];
                      (f.high = u), (f.low = g);
                    }
                    for (p = 0; p < 5; p++) {
                      var y = d[(p + 4) % 5],
                        w = d[(p + 1) % 5],
                        v = w.high,
                        C = w.low;
                      for (
                        u = y.high ^ ((v << 1) | (C >>> 31)),
                          g = y.low ^ ((C << 1) | (v >>> 31)),
                          m = 0;
                        m < 5;
                        m++
                      )
                        ((R = i[p + 5 * m]).high ^= u), (R.low ^= g);
                    }
                    for (var b = 1; b < 25; b++) {
                      var S = (R = i[b]).high,
                        I = R.low,
                        k = r[b];
                      g =
                        k < 32
                          ? ((u = (S << k) | (I >>> (32 - k))),
                            (I << k) | (S >>> (32 - k)))
                          : ((u = (I << (k - 32)) | (S >>> (64 - k))),
                            (S << (k - 32)) | (I >>> (64 - k)));
                      var O = d[l[b]];
                      (O.high = u), (O.low = g);
                    }
                    var A = d[0],
                      L = i[0];
                    for (A.high = L.high, A.low = L.low, p = 0; p < 5; p++)
                      for (m = 0; m < 5; m++) {
                        var R = i[(b = p + 5 * m)],
                          P = d[b],
                          T = d[((p + 1) % 5) + 5 * m],
                          _ = d[((p + 2) % 5) + 5 * m];
                        (R.high = P.high ^ (~T.high & _.high)),
                          (R.low = P.low ^ (~T.low & _.low));
                      }
                    R = i[0];
                    var x = c[h];
                    (R.high ^= x.high), (R.low ^= x.low);
                  }
                },
                _doFinalize: function () {
                  var t = this._data,
                    i = t.words,
                    o = (this._nDataBytes, 8 * t.sigBytes),
                    n = 32 * this.blockSize;
                  (i[o >>> 5] |= 1 << (24 - (o % 32))),
                    (i[((e.ceil((1 + o) / n) * n) >>> 5) - 1] |= 128),
                    (t.sigBytes = 4 * i.length),
                    this._process();
                  for (
                    var a = this._state,
                      r = this.cfg.outputLength / 8,
                      l = r / 8,
                      c = [],
                      d = 0;
                    d < l;
                    d++
                  ) {
                    var h = a[d],
                      p = h.high,
                      u = h.low;
                    (p =
                      (16711935 & ((p << 8) | (p >>> 24))) |
                      (4278255360 & ((p << 24) | (p >>> 8)))),
                      (u =
                        (16711935 & ((u << 8) | (u >>> 24))) |
                        (4278255360 & ((u << 24) | (u >>> 8)))),
                      c.push(u),
                      c.push(p);
                  }
                  return new s.init(c, r);
                },
                clone: function () {
                  for (
                    var e = o.clone.call(this),
                      t = (e._state = this._state.slice(0)),
                      i = 0;
                    i < 25;
                    i++
                  )
                    t[i] = t[i].clone();
                  return e;
                },
              }));
              (t.SHA3 = o._createHelper(h)),
                (t.HmacSHA3 = o._createHmacHelper(h));
            })(Math),
            (function () {
              var e = Oe,
                t = e.lib.Hasher,
                i = e.x64,
                s = i.Word,
                o = i.WordArray,
                n = e.algo;
              function a() {
                return s.create.apply(s, arguments);
              }
              var r = [
                  a(1116352408, 3609767458),
                  a(1899447441, 602891725),
                  a(3049323471, 3964484399),
                  a(3921009573, 2173295548),
                  a(961987163, 4081628472),
                  a(1508970993, 3053834265),
                  a(2453635748, 2937671579),
                  a(2870763221, 3664609560),
                  a(3624381080, 2734883394),
                  a(310598401, 1164996542),
                  a(607225278, 1323610764),
                  a(1426881987, 3590304994),
                  a(1925078388, 4068182383),
                  a(2162078206, 991336113),
                  a(2614888103, 633803317),
                  a(3248222580, 3479774868),
                  a(3835390401, 2666613458),
                  a(4022224774, 944711139),
                  a(264347078, 2341262773),
                  a(604807628, 2007800933),
                  a(770255983, 1495990901),
                  a(1249150122, 1856431235),
                  a(1555081692, 3175218132),
                  a(1996064986, 2198950837),
                  a(2554220882, 3999719339),
                  a(2821834349, 766784016),
                  a(2952996808, 2566594879),
                  a(3210313671, 3203337956),
                  a(3336571891, 1034457026),
                  a(3584528711, 2466948901),
                  a(113926993, 3758326383),
                  a(338241895, 168717936),
                  a(666307205, 1188179964),
                  a(773529912, 1546045734),
                  a(1294757372, 1522805485),
                  a(1396182291, 2643833823),
                  a(1695183700, 2343527390),
                  a(1986661051, 1014477480),
                  a(2177026350, 1206759142),
                  a(2456956037, 344077627),
                  a(2730485921, 1290863460),
                  a(2820302411, 3158454273),
                  a(3259730800, 3505952657),
                  a(3345764771, 106217008),
                  a(3516065817, 3606008344),
                  a(3600352804, 1432725776),
                  a(4094571909, 1467031594),
                  a(275423344, 851169720),
                  a(430227734, 3100823752),
                  a(506948616, 1363258195),
                  a(659060556, 3750685593),
                  a(883997877, 3785050280),
                  a(958139571, 3318307427),
                  a(1322822218, 3812723403),
                  a(1537002063, 2003034995),
                  a(1747873779, 3602036899),
                  a(1955562222, 1575990012),
                  a(2024104815, 1125592928),
                  a(2227730452, 2716904306),
                  a(2361852424, 442776044),
                  a(2428436474, 593698344),
                  a(2756734187, 3733110249),
                  a(3204031479, 2999351573),
                  a(3329325298, 3815920427),
                  a(3391569614, 3928383900),
                  a(3515267271, 566280711),
                  a(3940187606, 3454069534),
                  a(4118630271, 4000239992),
                  a(116418474, 1914138554),
                  a(174292421, 2731055270),
                  a(289380356, 3203993006),
                  a(460393269, 320620315),
                  a(685471733, 587496836),
                  a(852142971, 1086792851),
                  a(1017036298, 365543100),
                  a(1126000580, 2618297676),
                  a(1288033470, 3409855158),
                  a(1501505948, 4234509866),
                  a(1607167915, 987167468),
                  a(1816402316, 1246189591),
                ],
                l = [];
              !(function () {
                for (var e = 0; e < 80; e++) l[e] = a();
              })();
              var c = (n.SHA512 = t.extend({
                _doReset: function () {
                  this._hash = new o.init([
                    new s.init(1779033703, 4089235720),
                    new s.init(3144134277, 2227873595),
                    new s.init(1013904242, 4271175723),
                    new s.init(2773480762, 1595750129),
                    new s.init(1359893119, 2917565137),
                    new s.init(2600822924, 725511199),
                    new s.init(528734635, 4215389547),
                    new s.init(1541459225, 327033209),
                  ]);
                },
                _doProcessBlock: function (e, t) {
                  for (
                    var i = this._hash.words,
                      s = i[0],
                      o = i[1],
                      n = i[2],
                      a = i[3],
                      c = i[4],
                      d = i[5],
                      h = i[6],
                      p = i[7],
                      u = s.high,
                      g = s.low,
                      m = o.high,
                      f = o.low,
                      y = n.high,
                      w = n.low,
                      v = a.high,
                      C = a.low,
                      b = c.high,
                      S = c.low,
                      I = d.high,
                      k = d.low,
                      O = h.high,
                      A = h.low,
                      L = p.high,
                      R = p.low,
                      P = u,
                      T = g,
                      _ = m,
                      x = f,
                      N = y,
                      E = w,
                      j = v,
                      D = C,
                      B = b,
                      F = S,
                      $ = I,
                      U = k,
                      V = O,
                      J = A,
                      H = L,
                      M = R,
                      z = 0;
                    z < 80;
                    z++
                  ) {
                    var G,
                      W,
                      q = l[z];
                    if (z < 16)
                      (W = q.high = 0 | e[t + 2 * z]),
                        (G = q.low = 0 | e[t + 2 * z + 1]);
                    else {
                      var K = l[z - 15],
                        Y = K.high,
                        X = K.low,
                        Z =
                          ((Y >>> 1) | (X << 31)) ^
                          ((Y >>> 8) | (X << 24)) ^
                          (Y >>> 7),
                        Q =
                          ((X >>> 1) | (Y << 31)) ^
                          ((X >>> 8) | (Y << 24)) ^
                          ((X >>> 7) | (Y << 25)),
                        ee = l[z - 2],
                        te = ee.high,
                        ie = ee.low,
                        se =
                          ((te >>> 19) | (ie << 13)) ^
                          ((te << 3) | (ie >>> 29)) ^
                          (te >>> 6),
                        oe =
                          ((ie >>> 19) | (te << 13)) ^
                          ((ie << 3) | (te >>> 29)) ^
                          ((ie >>> 6) | (te << 26)),
                        ne = l[z - 7],
                        ae = ne.high,
                        re = ne.low,
                        le = l[z - 16],
                        ce = le.high,
                        de = le.low;
                      (W =
                        (W =
                          (W =
                            Z + ae + ((G = Q + re) >>> 0 < Q >>> 0 ? 1 : 0)) +
                          se +
                          ((G += oe) >>> 0 < oe >>> 0 ? 1 : 0)) +
                        ce +
                        ((G += de) >>> 0 < de >>> 0 ? 1 : 0)),
                        (q.high = W),
                        (q.low = G);
                    }
                    var he,
                      pe = (B & $) ^ (~B & V),
                      ue = (F & U) ^ (~F & J),
                      ge = (P & _) ^ (P & N) ^ (_ & N),
                      me = (T & x) ^ (T & E) ^ (x & E),
                      fe =
                        ((P >>> 28) | (T << 4)) ^
                        ((P << 30) | (T >>> 2)) ^
                        ((P << 25) | (T >>> 7)),
                      ye =
                        ((T >>> 28) | (P << 4)) ^
                        ((T << 30) | (P >>> 2)) ^
                        ((T << 25) | (P >>> 7)),
                      we =
                        ((B >>> 14) | (F << 18)) ^
                        ((B >>> 18) | (F << 14)) ^
                        ((B << 23) | (F >>> 9)),
                      ve =
                        ((F >>> 14) | (B << 18)) ^
                        ((F >>> 18) | (B << 14)) ^
                        ((F << 23) | (B >>> 9)),
                      Ce = r[z],
                      be = Ce.high,
                      Se = Ce.low,
                      Ie = H + we + ((he = M + ve) >>> 0 < M >>> 0 ? 1 : 0),
                      ke = ye + me;
                    (H = V),
                      (M = J),
                      (V = $),
                      (J = U),
                      ($ = B),
                      (U = F),
                      (B =
                        (j +
                          (Ie =
                            (Ie =
                              (Ie =
                                Ie +
                                pe +
                                ((he += ue) >>> 0 < ue >>> 0 ? 1 : 0)) +
                              be +
                              ((he += Se) >>> 0 < Se >>> 0 ? 1 : 0)) +
                            W +
                            ((he += G) >>> 0 < G >>> 0 ? 1 : 0)) +
                          ((F = (D + he) | 0) >>> 0 < D >>> 0 ? 1 : 0)) |
                        0),
                      (j = N),
                      (D = E),
                      (N = _),
                      (E = x),
                      (_ = P),
                      (x = T),
                      (P =
                        (Ie +
                          (fe + ge + (ke >>> 0 < ye >>> 0 ? 1 : 0)) +
                          ((T = (he + ke) | 0) >>> 0 < he >>> 0 ? 1 : 0)) |
                        0);
                  }
                  (g = s.low = g + T),
                    (s.high = u + P + (g >>> 0 < T >>> 0 ? 1 : 0)),
                    (f = o.low = f + x),
                    (o.high = m + _ + (f >>> 0 < x >>> 0 ? 1 : 0)),
                    (w = n.low = w + E),
                    (n.high = y + N + (w >>> 0 < E >>> 0 ? 1 : 0)),
                    (C = a.low = C + D),
                    (a.high = v + j + (C >>> 0 < D >>> 0 ? 1 : 0)),
                    (S = c.low = S + F),
                    (c.high = b + B + (S >>> 0 < F >>> 0 ? 1 : 0)),
                    (k = d.low = k + U),
                    (d.high = I + $ + (k >>> 0 < U >>> 0 ? 1 : 0)),
                    (A = h.low = A + J),
                    (h.high = O + V + (A >>> 0 < J >>> 0 ? 1 : 0)),
                    (R = p.low = R + M),
                    (p.high = L + H + (R >>> 0 < M >>> 0 ? 1 : 0));
                },
                _doFinalize: function () {
                  var e = this._data,
                    t = e.words,
                    i = 8 * this._nDataBytes,
                    s = 8 * e.sigBytes;
                  return (
                    (t[s >>> 5] |= 128 << (24 - (s % 32))),
                    (t[30 + (((128 + s) >>> 10) << 5)] = Math.floor(
                      i / 4294967296
                    )),
                    (t[31 + (((128 + s) >>> 10) << 5)] = i),
                    (e.sigBytes = 4 * t.length),
                    this._process(),
                    this._hash.toX32()
                  );
                },
                clone: function () {
                  var e = t.clone.call(this);
                  return (e._hash = this._hash.clone()), e;
                },
                blockSize: 32,
              }));
              (e.SHA512 = t._createHelper(c)),
                (e.HmacSHA512 = t._createHmacHelper(c));
            })(),
            (K = (q = Oe).x64),
            (Y = K.Word),
            (X = K.WordArray),
            (Z = q.algo),
            (Q = Z.SHA512),
            (ee = Z.SHA384 =
              Q.extend({
                _doReset: function () {
                  this._hash = new X.init([
                    new Y.init(3418070365, 3238371032),
                    new Y.init(1654270250, 914150663),
                    new Y.init(2438529370, 812702999),
                    new Y.init(355462360, 4144912697),
                    new Y.init(1731405415, 4290775857),
                    new Y.init(2394180231, 1750603025),
                    new Y.init(3675008525, 1694076839),
                    new Y.init(1203062813, 3204075428),
                  ]);
                },
                _doFinalize: function () {
                  var e = Q._doFinalize.call(this);
                  return (e.sigBytes -= 16), e;
                },
              })),
            (q.SHA384 = Q._createHelper(ee)),
            (q.HmacSHA384 = Q._createHmacHelper(ee)),
            Oe.lib.Cipher ||
              (function () {
                var e = Oe,
                  t = e.lib,
                  i = t.Base,
                  s = t.WordArray,
                  o = t.BufferedBlockAlgorithm,
                  n = e.enc,
                  a = (n.Utf8, n.Base64),
                  r = e.algo.EvpKDF,
                  l = (t.Cipher = o.extend({
                    cfg: i.extend(),
                    createEncryptor: function (e, t) {
                      return this.create(this._ENC_XFORM_MODE, e, t);
                    },
                    createDecryptor: function (e, t) {
                      return this.create(this._DEC_XFORM_MODE, e, t);
                    },
                    init: function (e, t, i) {
                      (this.cfg = this.cfg.extend(i)),
                        (this._xformMode = e),
                        (this._key = t),
                        this.reset();
                    },
                    reset: function () {
                      o.reset.call(this), this._doReset();
                    },
                    process: function (e) {
                      return this._append(e), this._process();
                    },
                    finalize: function (e) {
                      return e && this._append(e), this._doFinalize();
                    },
                    keySize: 4,
                    ivSize: 4,
                    _ENC_XFORM_MODE: 1,
                    _DEC_XFORM_MODE: 2,
                    _createHelper: function (e) {
                      return {
                        encrypt: function (t, i, s) {
                          return c(i).encrypt(e, t, i, s);
                        },
                        decrypt: function (t, i, s) {
                          return c(i).decrypt(e, t, i, s);
                        },
                      };
                    },
                  }));
                function c(e) {
                  return "string" == typeof e ? C : w;
                }
                t.StreamCipher = l.extend({
                  _doFinalize: function () {
                    return this._process(!0);
                  },
                  blockSize: 1,
                });
                var d,
                  h = (e.mode = {}),
                  p = (t.BlockCipherMode = i.extend({
                    createEncryptor: function (e, t) {
                      return this.Encryptor.create(e, t);
                    },
                    createDecryptor: function (e, t) {
                      return this.Decryptor.create(e, t);
                    },
                    init: function (e, t) {
                      (this._cipher = e), (this._iv = t);
                    },
                  })),
                  u = (h.CBC =
                    (((d = p.extend()).Encryptor = d.extend({
                      processBlock: function (e, t) {
                        var i = this._cipher,
                          s = i.blockSize;
                        g.call(this, e, t, s),
                          i.encryptBlock(e, t),
                          (this._prevBlock = e.slice(t, t + s));
                      },
                    })),
                    (d.Decryptor = d.extend({
                      processBlock: function (e, t) {
                        var i = this._cipher,
                          s = i.blockSize,
                          o = e.slice(t, t + s);
                        i.decryptBlock(e, t),
                          g.call(this, e, t, s),
                          (this._prevBlock = o);
                      },
                    })),
                    d));
                function g(e, t, i) {
                  var s,
                    o = this._iv;
                  o ? ((s = o), (this._iv = void 0)) : (s = this._prevBlock);
                  for (var n = 0; n < i; n++) e[t + n] ^= s[n];
                }
                var m = ((e.pad = {}).Pkcs7 = {
                    pad: function (e, t) {
                      for (
                        var i = 4 * t,
                          o = i - (e.sigBytes % i),
                          n = (o << 24) | (o << 16) | (o << 8) | o,
                          a = [],
                          r = 0;
                        r < o;
                        r += 4
                      )
                        a.push(n);
                      var l = s.create(a, o);
                      e.concat(l);
                    },
                    unpad: function (e) {
                      var t = 255 & e.words[(e.sigBytes - 1) >>> 2];
                      e.sigBytes -= t;
                    },
                  }),
                  f =
                    ((t.BlockCipher = l.extend({
                      cfg: l.cfg.extend({ mode: u, padding: m }),
                      reset: function () {
                        var e;
                        l.reset.call(this);
                        var t = this.cfg,
                          i = t.iv,
                          s = t.mode;
                        this._xformMode == this._ENC_XFORM_MODE
                          ? (e = s.createEncryptor)
                          : ((e = s.createDecryptor),
                            (this._minBufferSize = 1)),
                          this._mode && this._mode.__creator == e
                            ? this._mode.init(this, i && i.words)
                            : ((this._mode = e.call(s, this, i && i.words)),
                              (this._mode.__creator = e));
                      },
                      _doProcessBlock: function (e, t) {
                        this._mode.processBlock(e, t);
                      },
                      _doFinalize: function () {
                        var e,
                          t = this.cfg.padding;
                        return (
                          this._xformMode == this._ENC_XFORM_MODE
                            ? (t.pad(this._data, this.blockSize),
                              (e = this._process(!0)))
                            : ((e = this._process(!0)), t.unpad(e)),
                          e
                        );
                      },
                      blockSize: 4,
                    })),
                    (t.CipherParams = i.extend({
                      init: function (e) {
                        this.mixIn(e);
                      },
                      toString: function (e) {
                        return (e || this.formatter).stringify(this);
                      },
                    }))),
                  y = ((e.format = {}).OpenSSL = {
                    stringify: function (e) {
                      var t = e.ciphertext,
                        i = e.salt;
                      return (
                        i
                          ? s
                              .create([1398893684, 1701076831])
                              .concat(i)
                              .concat(t)
                          : t
                      ).toString(a);
                    },
                    parse: function (e) {
                      var t,
                        i = a.parse(e),
                        o = i.words;
                      return (
                        1398893684 == o[0] &&
                          1701076831 == o[1] &&
                          ((t = s.create(o.slice(2, 4))),
                          o.splice(0, 4),
                          (i.sigBytes -= 16)),
                        f.create({ ciphertext: i, salt: t })
                      );
                    },
                  }),
                  w = (t.SerializableCipher = i.extend({
                    cfg: i.extend({ format: y }),
                    encrypt: function (e, t, i, s) {
                      s = this.cfg.extend(s);
                      var o = e.createEncryptor(i, s),
                        n = o.finalize(t),
                        a = o.cfg;
                      return f.create({
                        ciphertext: n,
                        key: i,
                        iv: a.iv,
                        algorithm: e,
                        mode: a.mode,
                        padding: a.padding,
                        blockSize: e.blockSize,
                        formatter: s.format,
                      });
                    },
                    decrypt: function (e, t, i, s) {
                      return (
                        (s = this.cfg.extend(s)),
                        (t = this._parse(t, s.format)),
                        e.createDecryptor(i, s).finalize(t.ciphertext)
                      );
                    },
                    _parse: function (e, t) {
                      return "string" == typeof e ? t.parse(e, this) : e;
                    },
                  })),
                  v = ((e.kdf = {}).OpenSSL = {
                    execute: function (e, t, i, o) {
                      o = o || s.random(8);
                      var n = r.create({ keySize: t + i }).compute(e, o),
                        a = s.create(n.words.slice(t), 4 * i);
                      return (
                        (n.sigBytes = 4 * t),
                        f.create({ key: n, iv: a, salt: o })
                      );
                    },
                  }),
                  C = (t.PasswordBasedCipher = w.extend({
                    cfg: w.cfg.extend({ kdf: v }),
                    encrypt: function (e, t, i, s) {
                      var o = (s = this.cfg.extend(s)).kdf.execute(
                        i,
                        e.keySize,
                        e.ivSize
                      );
                      s.iv = o.iv;
                      var n = w.encrypt.call(this, e, t, o.key, s);
                      return n.mixIn(o), n;
                    },
                    decrypt: function (e, t, i, s) {
                      (s = this.cfg.extend(s)), (t = this._parse(t, s.format));
                      var o = s.kdf.execute(i, e.keySize, e.ivSize, t.salt);
                      return (
                        (s.iv = o.iv), w.decrypt.call(this, e, t, o.key, s)
                      );
                    },
                  }));
              })(),
            (Oe.mode.CFB =
              (((te = Oe.lib.BlockCipherMode.extend()).Encryptor = te.extend({
                processBlock: function (e, t) {
                  var i = this._cipher,
                    s = i.blockSize;
                  xe.call(this, e, t, s, i),
                    (this._prevBlock = e.slice(t, t + s));
                },
              })),
              (te.Decryptor = te.extend({
                processBlock: function (e, t) {
                  var i = this._cipher,
                    s = i.blockSize,
                    o = e.slice(t, t + s);
                  xe.call(this, e, t, s, i), (this._prevBlock = o);
                },
              })),
              te)),
            (Oe.mode.ECB =
              (((ie = Oe.lib.BlockCipherMode.extend()).Encryptor = ie.extend({
                processBlock: function (e, t) {
                  this._cipher.encryptBlock(e, t);
                },
              })),
              (ie.Decryptor = ie.extend({
                processBlock: function (e, t) {
                  this._cipher.decryptBlock(e, t);
                },
              })),
              ie)),
            (Oe.pad.AnsiX923 = {
              pad: function (e, t) {
                var i = e.sigBytes,
                  s = 4 * t,
                  o = s - (i % s),
                  n = i + o - 1;
                e.clamp(),
                  (e.words[n >>> 2] |= o << (24 - (n % 4) * 8)),
                  (e.sigBytes += o);
              },
              unpad: function (e) {
                var t = 255 & e.words[(e.sigBytes - 1) >>> 2];
                e.sigBytes -= t;
              },
            }),
            (Oe.pad.Iso10126 = {
              pad: function (e, t) {
                var i = 4 * t,
                  s = i - (e.sigBytes % i);
                e.concat(Oe.lib.WordArray.random(s - 1)).concat(
                  Oe.lib.WordArray.create([s << 24], 1)
                );
              },
              unpad: function (e) {
                var t = 255 & e.words[(e.sigBytes - 1) >>> 2];
                e.sigBytes -= t;
              },
            }),
            (Oe.pad.Iso97971 = {
              pad: function (e, t) {
                e.concat(Oe.lib.WordArray.create([2147483648], 1)),
                  Oe.pad.ZeroPadding.pad(e, t);
              },
              unpad: function (e) {
                Oe.pad.ZeroPadding.unpad(e), e.sigBytes--;
              },
            }),
            (Oe.mode.OFB =
              ((se = Oe.lib.BlockCipherMode.extend()),
              (oe = se.Encryptor =
                se.extend({
                  processBlock: function (e, t) {
                    var i = this._cipher,
                      s = i.blockSize,
                      o = this._iv,
                      n = this._keystream;
                    o &&
                      ((n = this._keystream = o.slice(0)), (this._iv = void 0)),
                      i.encryptBlock(n, 0);
                    for (var a = 0; a < s; a++) e[t + a] ^= n[a];
                  },
                })),
              (se.Decryptor = oe),
              se)),
            (Oe.pad.NoPadding = { pad: function () {}, unpad: function () {} }),
            (ne = Oe.lib.CipherParams),
            (ae = Oe.enc.Hex),
            (Oe.format.Hex = {
              stringify: function (e) {
                return e.ciphertext.toString(ae);
              },
              parse: function (e) {
                var t = ae.parse(e);
                return ne.create({ ciphertext: t });
              },
            }),
            (function () {
              var e = Oe,
                t = e.lib.BlockCipher,
                i = e.algo,
                s = [],
                o = [],
                n = [],
                a = [],
                r = [],
                l = [],
                c = [],
                d = [],
                h = [],
                p = [];
              !(function () {
                for (var e = [], t = 0; t < 256; t++)
                  e[t] = t < 128 ? t << 1 : (t << 1) ^ 283;
                var i = 0,
                  u = 0;
                for (t = 0; t < 256; t++) {
                  var g = u ^ (u << 1) ^ (u << 2) ^ (u << 3) ^ (u << 4);
                  (g = (g >>> 8) ^ (255 & g) ^ 99), (s[i] = g);
                  var m = e[(o[g] = i)],
                    f = e[m],
                    y = e[f],
                    w = (257 * e[g]) ^ (16843008 * g);
                  (n[i] = (w << 24) | (w >>> 8)),
                    (a[i] = (w << 16) | (w >>> 16)),
                    (r[i] = (w << 8) | (w >>> 24)),
                    (l[i] = w),
                    (w =
                      (16843009 * y) ^
                      (65537 * f) ^
                      (257 * m) ^
                      (16843008 * i)),
                    (c[g] = (w << 24) | (w >>> 8)),
                    (d[g] = (w << 16) | (w >>> 16)),
                    (h[g] = (w << 8) | (w >>> 24)),
                    (p[g] = w),
                    i
                      ? ((i = m ^ e[e[e[y ^ m]]]), (u ^= e[e[u]]))
                      : (i = u = 1);
                }
              })();
              var u = [0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54],
                g = (i.AES = t.extend({
                  _doReset: function () {
                    if (!this._nRounds || this._keyPriorReset !== this._key) {
                      for (
                        var e = (this._keyPriorReset = this._key),
                          t = e.words,
                          i = e.sigBytes / 4,
                          o = 4 * (1 + (this._nRounds = 6 + i)),
                          n = (this._keySchedule = []),
                          a = 0;
                        a < o;
                        a++
                      )
                        a < i
                          ? (n[a] = t[a])
                          : ((g = n[a - 1]),
                            a % i
                              ? 6 < i &&
                                a % i == 4 &&
                                (g =
                                  (s[g >>> 24] << 24) |
                                  (s[(g >>> 16) & 255] << 16) |
                                  (s[(g >>> 8) & 255] << 8) |
                                  s[255 & g])
                              : ((g =
                                  (s[(g = (g << 8) | (g >>> 24)) >>> 24] <<
                                    24) |
                                  (s[(g >>> 16) & 255] << 16) |
                                  (s[(g >>> 8) & 255] << 8) |
                                  s[255 & g]),
                                (g ^= u[(a / i) | 0] << 24)),
                            (n[a] = n[a - i] ^ g));
                      for (
                        var r = (this._invKeySchedule = []), l = 0;
                        l < o;
                        l++
                      ) {
                        if (((a = o - l), l % 4)) var g = n[a];
                        else g = n[a - 4];
                        r[l] =
                          l < 4 || a <= 4
                            ? g
                            : c[s[g >>> 24]] ^
                              d[s[(g >>> 16) & 255]] ^
                              h[s[(g >>> 8) & 255]] ^
                              p[s[255 & g]];
                      }
                    }
                  },
                  encryptBlock: function (e, t) {
                    this._doCryptBlock(e, t, this._keySchedule, n, a, r, l, s);
                  },
                  decryptBlock: function (e, t) {
                    var i = e[t + 1];
                    (e[t + 1] = e[t + 3]),
                      (e[t + 3] = i),
                      this._doCryptBlock(
                        e,
                        t,
                        this._invKeySchedule,
                        c,
                        d,
                        h,
                        p,
                        o
                      ),
                      (i = e[t + 1]),
                      (e[t + 1] = e[t + 3]),
                      (e[t + 3] = i);
                  },
                  _doCryptBlock: function (e, t, i, s, o, n, a, r) {
                    for (
                      var l = this._nRounds,
                        c = e[t] ^ i[0],
                        d = e[t + 1] ^ i[1],
                        h = e[t + 2] ^ i[2],
                        p = e[t + 3] ^ i[3],
                        u = 4,
                        g = 1;
                      g < l;
                      g++
                    ) {
                      var m =
                          s[c >>> 24] ^
                          o[(d >>> 16) & 255] ^
                          n[(h >>> 8) & 255] ^
                          a[255 & p] ^
                          i[u++],
                        f =
                          s[d >>> 24] ^
                          o[(h >>> 16) & 255] ^
                          n[(p >>> 8) & 255] ^
                          a[255 & c] ^
                          i[u++],
                        y =
                          s[h >>> 24] ^
                          o[(p >>> 16) & 255] ^
                          n[(c >>> 8) & 255] ^
                          a[255 & d] ^
                          i[u++],
                        w =
                          s[p >>> 24] ^
                          o[(c >>> 16) & 255] ^
                          n[(d >>> 8) & 255] ^
                          a[255 & h] ^
                          i[u++];
                      (c = m), (d = f), (h = y), (p = w);
                    }
                    (m =
                      ((r[c >>> 24] << 24) |
                        (r[(d >>> 16) & 255] << 16) |
                        (r[(h >>> 8) & 255] << 8) |
                        r[255 & p]) ^
                      i[u++]),
                      (f =
                        ((r[d >>> 24] << 24) |
                          (r[(h >>> 16) & 255] << 16) |
                          (r[(p >>> 8) & 255] << 8) |
                          r[255 & c]) ^
                        i[u++]),
                      (y =
                        ((r[h >>> 24] << 24) |
                          (r[(p >>> 16) & 255] << 16) |
                          (r[(c >>> 8) & 255] << 8) |
                          r[255 & d]) ^
                        i[u++]),
                      (w =
                        ((r[p >>> 24] << 24) |
                          (r[(c >>> 16) & 255] << 16) |
                          (r[(d >>> 8) & 255] << 8) |
                          r[255 & h]) ^
                        i[u++]),
                      (e[t] = m),
                      (e[t + 1] = f),
                      (e[t + 2] = y),
                      (e[t + 3] = w);
                  },
                  keySize: 8,
                }));
              e.AES = t._createHelper(g);
            })(),
            (function () {
              var e = Oe,
                t = e.lib,
                i = t.WordArray,
                s = t.BlockCipher,
                o = e.algo,
                n = [
                  57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2,
                  59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 36, 63, 55, 47, 39,
                  31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 37,
                  29, 21, 13, 5, 28, 20, 12, 4,
                ],
                a = [
                  14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26,
                  8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51,
                  45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32,
                ],
                r = [1, 2, 4, 6, 8, 10, 12, 14, 15, 17, 19, 21, 23, 25, 27, 28],
                l = [
                  {
                    0: 8421888,
                    268435456: 32768,
                    536870912: 8421378,
                    805306368: 2,
                    1073741824: 512,
                    1342177280: 8421890,
                    1610612736: 8389122,
                    1879048192: 8388608,
                    2147483648: 514,
                    2415919104: 8389120,
                    2684354560: 33280,
                    2952790016: 8421376,
                    3221225472: 32770,
                    3489660928: 8388610,
                    3758096384: 0,
                    4026531840: 33282,
                    134217728: 0,
                    402653184: 8421890,
                    671088640: 33282,
                    939524096: 32768,
                    1207959552: 8421888,
                    1476395008: 512,
                    1744830464: 8421378,
                    2013265920: 2,
                    2281701376: 8389120,
                    2550136832: 33280,
                    2818572288: 8421376,
                    3087007744: 8389122,
                    3355443200: 8388610,
                    3623878656: 32770,
                    3892314112: 514,
                    4160749568: 8388608,
                    1: 32768,
                    268435457: 2,
                    536870913: 8421888,
                    805306369: 8388608,
                    1073741825: 8421378,
                    1342177281: 33280,
                    1610612737: 512,
                    1879048193: 8389122,
                    2147483649: 8421890,
                    2415919105: 8421376,
                    2684354561: 8388610,
                    2952790017: 33282,
                    3221225473: 514,
                    3489660929: 8389120,
                    3758096385: 32770,
                    4026531841: 0,
                    134217729: 8421890,
                    402653185: 8421376,
                    671088641: 8388608,
                    939524097: 512,
                    1207959553: 32768,
                    1476395009: 8388610,
                    1744830465: 2,
                    2013265921: 33282,
                    2281701377: 32770,
                    2550136833: 8389122,
                    2818572289: 514,
                    3087007745: 8421888,
                    3355443201: 8389120,
                    3623878657: 0,
                    3892314113: 33280,
                    4160749569: 8421378,
                  },
                  {
                    0: 1074282512,
                    16777216: 16384,
                    33554432: 524288,
                    50331648: 1074266128,
                    67108864: 1073741840,
                    83886080: 1074282496,
                    100663296: 1073758208,
                    117440512: 16,
                    134217728: 540672,
                    150994944: 1073758224,
                    167772160: 1073741824,
                    184549376: 540688,
                    201326592: 524304,
                    218103808: 0,
                    234881024: 16400,
                    251658240: 1074266112,
                    8388608: 1073758208,
                    25165824: 540688,
                    41943040: 16,
                    58720256: 1073758224,
                    75497472: 1074282512,
                    92274688: 1073741824,
                    109051904: 524288,
                    125829120: 1074266128,
                    142606336: 524304,
                    159383552: 0,
                    176160768: 16384,
                    192937984: 1074266112,
                    209715200: 1073741840,
                    226492416: 540672,
                    243269632: 1074282496,
                    260046848: 16400,
                    268435456: 0,
                    285212672: 1074266128,
                    301989888: 1073758224,
                    318767104: 1074282496,
                    335544320: 1074266112,
                    352321536: 16,
                    369098752: 540688,
                    385875968: 16384,
                    402653184: 16400,
                    419430400: 524288,
                    436207616: 524304,
                    452984832: 1073741840,
                    469762048: 540672,
                    486539264: 1073758208,
                    503316480: 1073741824,
                    520093696: 1074282512,
                    276824064: 540688,
                    293601280: 524288,
                    310378496: 1074266112,
                    327155712: 16384,
                    343932928: 1073758208,
                    360710144: 1074282512,
                    377487360: 16,
                    394264576: 1073741824,
                    411041792: 1074282496,
                    427819008: 1073741840,
                    444596224: 1073758224,
                    461373440: 524304,
                    478150656: 0,
                    494927872: 16400,
                    511705088: 1074266128,
                    528482304: 540672,
                  },
                  {
                    0: 260,
                    1048576: 0,
                    2097152: 67109120,
                    3145728: 65796,
                    4194304: 65540,
                    5242880: 67108868,
                    6291456: 67174660,
                    7340032: 67174400,
                    8388608: 67108864,
                    9437184: 67174656,
                    10485760: 65792,
                    11534336: 67174404,
                    12582912: 67109124,
                    13631488: 65536,
                    14680064: 4,
                    15728640: 256,
                    524288: 67174656,
                    1572864: 67174404,
                    2621440: 0,
                    3670016: 67109120,
                    4718592: 67108868,
                    5767168: 65536,
                    6815744: 65540,
                    7864320: 260,
                    8912896: 4,
                    9961472: 256,
                    11010048: 67174400,
                    12058624: 65796,
                    13107200: 65792,
                    14155776: 67109124,
                    15204352: 67174660,
                    16252928: 67108864,
                    16777216: 67174656,
                    17825792: 65540,
                    18874368: 65536,
                    19922944: 67109120,
                    20971520: 256,
                    22020096: 67174660,
                    23068672: 67108868,
                    24117248: 0,
                    25165824: 67109124,
                    26214400: 67108864,
                    27262976: 4,
                    28311552: 65792,
                    29360128: 67174400,
                    30408704: 260,
                    31457280: 65796,
                    32505856: 67174404,
                    17301504: 67108864,
                    18350080: 260,
                    19398656: 67174656,
                    20447232: 0,
                    21495808: 65540,
                    22544384: 67109120,
                    23592960: 256,
                    24641536: 67174404,
                    25690112: 65536,
                    26738688: 67174660,
                    27787264: 65796,
                    28835840: 67108868,
                    29884416: 67109124,
                    30932992: 67174400,
                    31981568: 4,
                    33030144: 65792,
                  },
                  {
                    0: 2151682048,
                    65536: 2147487808,
                    131072: 4198464,
                    196608: 2151677952,
                    262144: 0,
                    327680: 4198400,
                    393216: 2147483712,
                    458752: 4194368,
                    524288: 2147483648,
                    589824: 4194304,
                    655360: 64,
                    720896: 2147487744,
                    786432: 2151678016,
                    851968: 4160,
                    917504: 4096,
                    983040: 2151682112,
                    32768: 2147487808,
                    98304: 64,
                    163840: 2151678016,
                    229376: 2147487744,
                    294912: 4198400,
                    360448: 2151682112,
                    425984: 0,
                    491520: 2151677952,
                    557056: 4096,
                    622592: 2151682048,
                    688128: 4194304,
                    753664: 4160,
                    819200: 2147483648,
                    884736: 4194368,
                    950272: 4198464,
                    1015808: 2147483712,
                    1048576: 4194368,
                    1114112: 4198400,
                    1179648: 2147483712,
                    1245184: 0,
                    1310720: 4160,
                    1376256: 2151678016,
                    1441792: 2151682048,
                    1507328: 2147487808,
                    1572864: 2151682112,
                    1638400: 2147483648,
                    1703936: 2151677952,
                    1769472: 4198464,
                    1835008: 2147487744,
                    1900544: 4194304,
                    1966080: 64,
                    2031616: 4096,
                    1081344: 2151677952,
                    1146880: 2151682112,
                    1212416: 0,
                    1277952: 4198400,
                    1343488: 4194368,
                    1409024: 2147483648,
                    1474560: 2147487808,
                    1540096: 64,
                    1605632: 2147483712,
                    1671168: 4096,
                    1736704: 2147487744,
                    1802240: 2151678016,
                    1867776: 4160,
                    1933312: 2151682048,
                    1998848: 4194304,
                    2064384: 4198464,
                  },
                  {
                    0: 128,
                    4096: 17039360,
                    8192: 262144,
                    12288: 536870912,
                    16384: 537133184,
                    20480: 16777344,
                    24576: 553648256,
                    28672: 262272,
                    32768: 16777216,
                    36864: 537133056,
                    40960: 536871040,
                    45056: 553910400,
                    49152: 553910272,
                    53248: 0,
                    57344: 17039488,
                    61440: 553648128,
                    2048: 17039488,
                    6144: 553648256,
                    10240: 128,
                    14336: 17039360,
                    18432: 262144,
                    22528: 537133184,
                    26624: 553910272,
                    30720: 536870912,
                    34816: 537133056,
                    38912: 0,
                    43008: 553910400,
                    47104: 16777344,
                    51200: 536871040,
                    55296: 553648128,
                    59392: 16777216,
                    63488: 262272,
                    65536: 262144,
                    69632: 128,
                    73728: 536870912,
                    77824: 553648256,
                    81920: 16777344,
                    86016: 553910272,
                    90112: 537133184,
                    94208: 16777216,
                    98304: 553910400,
                    102400: 553648128,
                    106496: 17039360,
                    110592: 537133056,
                    114688: 262272,
                    118784: 536871040,
                    122880: 0,
                    126976: 17039488,
                    67584: 553648256,
                    71680: 16777216,
                    75776: 17039360,
                    79872: 537133184,
                    83968: 536870912,
                    88064: 17039488,
                    92160: 128,
                    96256: 553910272,
                    100352: 262272,
                    104448: 553910400,
                    108544: 0,
                    112640: 553648128,
                    116736: 16777344,
                    120832: 262144,
                    124928: 537133056,
                    129024: 536871040,
                  },
                  {
                    0: 268435464,
                    256: 8192,
                    512: 270532608,
                    768: 270540808,
                    1024: 268443648,
                    1280: 2097152,
                    1536: 2097160,
                    1792: 268435456,
                    2048: 0,
                    2304: 268443656,
                    2560: 2105344,
                    2816: 8,
                    3072: 270532616,
                    3328: 2105352,
                    3584: 8200,
                    3840: 270540800,
                    128: 270532608,
                    384: 270540808,
                    640: 8,
                    896: 2097152,
                    1152: 2105352,
                    1408: 268435464,
                    1664: 268443648,
                    1920: 8200,
                    2176: 2097160,
                    2432: 8192,
                    2688: 268443656,
                    2944: 270532616,
                    3200: 0,
                    3456: 270540800,
                    3712: 2105344,
                    3968: 268435456,
                    4096: 268443648,
                    4352: 270532616,
                    4608: 270540808,
                    4864: 8200,
                    5120: 2097152,
                    5376: 268435456,
                    5632: 268435464,
                    5888: 2105344,
                    6144: 2105352,
                    6400: 0,
                    6656: 8,
                    6912: 270532608,
                    7168: 8192,
                    7424: 268443656,
                    7680: 270540800,
                    7936: 2097160,
                    4224: 8,
                    4480: 2105344,
                    4736: 2097152,
                    4992: 268435464,
                    5248: 268443648,
                    5504: 8200,
                    5760: 270540808,
                    6016: 270532608,
                    6272: 270540800,
                    6528: 270532616,
                    6784: 8192,
                    7040: 2105352,
                    7296: 2097160,
                    7552: 0,
                    7808: 268435456,
                    8064: 268443656,
                  },
                  {
                    0: 1048576,
                    16: 33555457,
                    32: 1024,
                    48: 1049601,
                    64: 34604033,
                    80: 0,
                    96: 1,
                    112: 34603009,
                    128: 33555456,
                    144: 1048577,
                    160: 33554433,
                    176: 34604032,
                    192: 34603008,
                    208: 1025,
                    224: 1049600,
                    240: 33554432,
                    8: 34603009,
                    24: 0,
                    40: 33555457,
                    56: 34604032,
                    72: 1048576,
                    88: 33554433,
                    104: 33554432,
                    120: 1025,
                    136: 1049601,
                    152: 33555456,
                    168: 34603008,
                    184: 1048577,
                    200: 1024,
                    216: 34604033,
                    232: 1,
                    248: 1049600,
                    256: 33554432,
                    272: 1048576,
                    288: 33555457,
                    304: 34603009,
                    320: 1048577,
                    336: 33555456,
                    352: 34604032,
                    368: 1049601,
                    384: 1025,
                    400: 34604033,
                    416: 1049600,
                    432: 1,
                    448: 0,
                    464: 34603008,
                    480: 33554433,
                    496: 1024,
                    264: 1049600,
                    280: 33555457,
                    296: 34603009,
                    312: 1,
                    328: 33554432,
                    344: 1048576,
                    360: 1025,
                    376: 34604032,
                    392: 33554433,
                    408: 34603008,
                    424: 0,
                    440: 34604033,
                    456: 1049601,
                    472: 1024,
                    488: 33555456,
                    504: 1048577,
                  },
                  {
                    0: 134219808,
                    1: 131072,
                    2: 134217728,
                    3: 32,
                    4: 131104,
                    5: 134350880,
                    6: 134350848,
                    7: 2048,
                    8: 134348800,
                    9: 134219776,
                    10: 133120,
                    11: 134348832,
                    12: 2080,
                    13: 0,
                    14: 134217760,
                    15: 133152,
                    2147483648: 2048,
                    2147483649: 134350880,
                    2147483650: 134219808,
                    2147483651: 134217728,
                    2147483652: 134348800,
                    2147483653: 133120,
                    2147483654: 133152,
                    2147483655: 32,
                    2147483656: 134217760,
                    2147483657: 2080,
                    2147483658: 131104,
                    2147483659: 134350848,
                    2147483660: 0,
                    2147483661: 134348832,
                    2147483662: 134219776,
                    2147483663: 131072,
                    16: 133152,
                    17: 134350848,
                    18: 32,
                    19: 2048,
                    20: 134219776,
                    21: 134217760,
                    22: 134348832,
                    23: 131072,
                    24: 0,
                    25: 131104,
                    26: 134348800,
                    27: 134219808,
                    28: 134350880,
                    29: 133120,
                    30: 2080,
                    31: 134217728,
                    2147483664: 131072,
                    2147483665: 2048,
                    2147483666: 134348832,
                    2147483667: 133152,
                    2147483668: 32,
                    2147483669: 134348800,
                    2147483670: 134217728,
                    2147483671: 134219808,
                    2147483672: 134350880,
                    2147483673: 134217760,
                    2147483674: 134219776,
                    2147483675: 0,
                    2147483676: 133120,
                    2147483677: 2080,
                    2147483678: 131104,
                    2147483679: 134350848,
                  },
                ],
                c = [
                  4160749569, 528482304, 33030144, 2064384, 129024, 8064, 504,
                  2147483679,
                ],
                d = (o.DES = s.extend({
                  _doReset: function () {
                    for (var e = this._key.words, t = [], i = 0; i < 56; i++) {
                      var s = n[i] - 1;
                      t[i] = (e[s >>> 5] >>> (31 - (s % 32))) & 1;
                    }
                    for (var o = (this._subKeys = []), l = 0; l < 16; l++) {
                      var c = (o[l] = []),
                        d = r[l];
                      for (i = 0; i < 24; i++)
                        (c[(i / 6) | 0] |=
                          t[(a[i] - 1 + d) % 28] << (31 - (i % 6))),
                          (c[4 + ((i / 6) | 0)] |=
                            t[28 + ((a[i + 24] - 1 + d) % 28)] <<
                            (31 - (i % 6)));
                      for (
                        c[0] = (c[0] << 1) | (c[0] >>> 31), i = 1;
                        i < 7;
                        i++
                      )
                        c[i] = c[i] >>> (4 * (i - 1) + 3);
                      c[7] = (c[7] << 5) | (c[7] >>> 27);
                    }
                    var h = (this._invSubKeys = []);
                    for (i = 0; i < 16; i++) h[i] = o[15 - i];
                  },
                  encryptBlock: function (e, t) {
                    this._doCryptBlock(e, t, this._subKeys);
                  },
                  decryptBlock: function (e, t) {
                    this._doCryptBlock(e, t, this._invSubKeys);
                  },
                  _doCryptBlock: function (e, t, i) {
                    (this._lBlock = e[t]),
                      (this._rBlock = e[t + 1]),
                      h.call(this, 4, 252645135),
                      h.call(this, 16, 65535),
                      p.call(this, 2, 858993459),
                      p.call(this, 8, 16711935),
                      h.call(this, 1, 1431655765);
                    for (var s = 0; s < 16; s++) {
                      for (
                        var o = i[s],
                          n = this._lBlock,
                          a = this._rBlock,
                          r = 0,
                          d = 0;
                        d < 8;
                        d++
                      )
                        r |= l[d][((a ^ o[d]) & c[d]) >>> 0];
                      (this._lBlock = a), (this._rBlock = n ^ r);
                    }
                    var u = this._lBlock;
                    (this._lBlock = this._rBlock),
                      (this._rBlock = u),
                      h.call(this, 1, 1431655765),
                      p.call(this, 8, 16711935),
                      p.call(this, 2, 858993459),
                      h.call(this, 16, 65535),
                      h.call(this, 4, 252645135),
                      (e[t] = this._lBlock),
                      (e[t + 1] = this._rBlock);
                  },
                  keySize: 2,
                  ivSize: 2,
                  blockSize: 2,
                }));
              function h(e, t) {
                var i = ((this._lBlock >>> e) ^ this._rBlock) & t;
                (this._rBlock ^= i), (this._lBlock ^= i << e);
              }
              function p(e, t) {
                var i = ((this._rBlock >>> e) ^ this._lBlock) & t;
                (this._lBlock ^= i), (this._rBlock ^= i << e);
              }
              e.DES = s._createHelper(d);
              var u = (o.TripleDES = s.extend({
                _doReset: function () {
                  var e = this._key.words;
                  if (2 !== e.length && 4 !== e.length && e.length < 6)
                    throw new Error(
                      "Invalid key length - 3DES requires the key length to be 64, 128, 192 or >192."
                    );
                  var t = e.slice(0, 2),
                    s = e.length < 4 ? e.slice(0, 2) : e.slice(2, 4),
                    o = e.length < 6 ? e.slice(0, 2) : e.slice(4, 6);
                  (this._des1 = d.createEncryptor(i.create(t))),
                    (this._des2 = d.createEncryptor(i.create(s))),
                    (this._des3 = d.createEncryptor(i.create(o)));
                },
                encryptBlock: function (e, t) {
                  this._des1.encryptBlock(e, t),
                    this._des2.decryptBlock(e, t),
                    this._des3.encryptBlock(e, t);
                },
                decryptBlock: function (e, t) {
                  this._des3.decryptBlock(e, t),
                    this._des2.encryptBlock(e, t),
                    this._des1.decryptBlock(e, t);
                },
                keySize: 6,
                ivSize: 2,
                blockSize: 2,
              }));
              e.TripleDES = s._createHelper(u);
            })(),
            (function () {
              var e = Oe,
                t = e.lib.StreamCipher,
                i = e.algo,
                s = (i.RC4 = t.extend({
                  _doReset: function () {
                    for (
                      var e = this._key,
                        t = e.words,
                        i = e.sigBytes,
                        s = (this._S = []),
                        o = 0;
                      o < 256;
                      o++
                    )
                      s[o] = o;
                    o = 0;
                    for (var n = 0; o < 256; o++) {
                      var a = o % i,
                        r = (t[a >>> 2] >>> (24 - (a % 4) * 8)) & 255;
                      n = (n + s[o] + r) % 256;
                      var l = s[o];
                      (s[o] = s[n]), (s[n] = l);
                    }
                    this._i = this._j = 0;
                  },
                  _doProcessBlock: function (e, t) {
                    e[t] ^= o.call(this);
                  },
                  keySize: 8,
                  ivSize: 0,
                }));
              function o() {
                for (
                  var e = this._S, t = this._i, i = this._j, s = 0, o = 0;
                  o < 4;
                  o++
                ) {
                  i = (i + e[(t = (t + 1) % 256)]) % 256;
                  var n = e[t];
                  (e[t] = e[i]),
                    (e[i] = n),
                    (s |= e[(e[t] + e[i]) % 256] << (24 - 8 * o));
                }
                return (this._i = t), (this._j = i), s;
              }
              e.RC4 = t._createHelper(s);
              var n = (i.RC4Drop = s.extend({
                cfg: s.cfg.extend({ drop: 192 }),
                _doReset: function () {
                  s._doReset.call(this);
                  for (var e = this.cfg.drop; 0 < e; e--) o.call(this);
                },
              }));
              e.RC4Drop = t._createHelper(n);
            })(),
            (Oe.mode.CTRGladman =
              ((re = Oe.lib.BlockCipherMode.extend()),
              (le = re.Encryptor =
                re.extend({
                  processBlock: function (e, t) {
                    var i,
                      s = this._cipher,
                      o = s.blockSize,
                      n = this._iv,
                      a = this._counter;
                    n &&
                      ((a = this._counter = n.slice(0)), (this._iv = void 0)),
                      0 === ((i = a)[0] = Ne(i[0])) && (i[1] = Ne(i[1]));
                    var r = a.slice(0);
                    s.encryptBlock(r, 0);
                    for (var l = 0; l < o; l++) e[t + l] ^= r[l];
                  },
                })),
              (re.Decryptor = le),
              re)),
            (de = (ce = Oe).lib.StreamCipher),
            (he = ce.algo),
            (pe = []),
            (ue = []),
            (ge = []),
            (me = he.Rabbit =
              de.extend({
                _doReset: function () {
                  for (
                    var e = this._key.words, t = this.cfg.iv, i = 0;
                    i < 4;
                    i++
                  )
                    e[i] =
                      (16711935 & ((e[i] << 8) | (e[i] >>> 24))) |
                      (4278255360 & ((e[i] << 24) | (e[i] >>> 8)));
                  var s = (this._X = [
                      e[0],
                      (e[3] << 16) | (e[2] >>> 16),
                      e[1],
                      (e[0] << 16) | (e[3] >>> 16),
                      e[2],
                      (e[1] << 16) | (e[0] >>> 16),
                      e[3],
                      (e[2] << 16) | (e[1] >>> 16),
                    ]),
                    o = (this._C = [
                      (e[2] << 16) | (e[2] >>> 16),
                      (4294901760 & e[0]) | (65535 & e[1]),
                      (e[3] << 16) | (e[3] >>> 16),
                      (4294901760 & e[1]) | (65535 & e[2]),
                      (e[0] << 16) | (e[0] >>> 16),
                      (4294901760 & e[2]) | (65535 & e[3]),
                      (e[1] << 16) | (e[1] >>> 16),
                      (4294901760 & e[3]) | (65535 & e[0]),
                    ]);
                  for (i = this._b = 0; i < 4; i++) Ee.call(this);
                  for (i = 0; i < 8; i++) o[i] ^= s[(i + 4) & 7];
                  if (t) {
                    var n = t.words,
                      a = n[0],
                      r = n[1],
                      l =
                        (16711935 & ((a << 8) | (a >>> 24))) |
                        (4278255360 & ((a << 24) | (a >>> 8))),
                      c =
                        (16711935 & ((r << 8) | (r >>> 24))) |
                        (4278255360 & ((r << 24) | (r >>> 8))),
                      d = (l >>> 16) | (4294901760 & c),
                      h = (c << 16) | (65535 & l);
                    for (
                      o[0] ^= l,
                        o[1] ^= d,
                        o[2] ^= c,
                        o[3] ^= h,
                        o[4] ^= l,
                        o[5] ^= d,
                        o[6] ^= c,
                        o[7] ^= h,
                        i = 0;
                      i < 4;
                      i++
                    )
                      Ee.call(this);
                  }
                },
                _doProcessBlock: function (e, t) {
                  var i = this._X;
                  Ee.call(this),
                    (pe[0] = i[0] ^ (i[5] >>> 16) ^ (i[3] << 16)),
                    (pe[1] = i[2] ^ (i[7] >>> 16) ^ (i[5] << 16)),
                    (pe[2] = i[4] ^ (i[1] >>> 16) ^ (i[7] << 16)),
                    (pe[3] = i[6] ^ (i[3] >>> 16) ^ (i[1] << 16));
                  for (var s = 0; s < 4; s++)
                    (pe[s] =
                      (16711935 & ((pe[s] << 8) | (pe[s] >>> 24))) |
                      (4278255360 & ((pe[s] << 24) | (pe[s] >>> 8)))),
                      (e[t + s] ^= pe[s]);
                },
                blockSize: 4,
                ivSize: 2,
              })),
            (ce.Rabbit = de._createHelper(me)),
            (Oe.mode.CTR =
              ((fe = Oe.lib.BlockCipherMode.extend()),
              (ye = fe.Encryptor =
                fe.extend({
                  processBlock: function (e, t) {
                    var i = this._cipher,
                      s = i.blockSize,
                      o = this._iv,
                      n = this._counter;
                    o &&
                      ((n = this._counter = o.slice(0)), (this._iv = void 0));
                    var a = n.slice(0);
                    i.encryptBlock(a, 0), (n[s - 1] = (n[s - 1] + 1) | 0);
                    for (var r = 0; r < s; r++) e[t + r] ^= a[r];
                  },
                })),
              (fe.Decryptor = ye),
              fe)),
            (ve = (we = Oe).lib.StreamCipher),
            (Ce = we.algo),
            (be = []),
            (Se = []),
            (Ie = []),
            (ke = Ce.RabbitLegacy =
              ve.extend({
                _doReset: function () {
                  for (
                    var e = this._key.words,
                      t = this.cfg.iv,
                      i = (this._X = [
                        e[0],
                        (e[3] << 16) | (e[2] >>> 16),
                        e[1],
                        (e[0] << 16) | (e[3] >>> 16),
                        e[2],
                        (e[1] << 16) | (e[0] >>> 16),
                        e[3],
                        (e[2] << 16) | (e[1] >>> 16),
                      ]),
                      s = (this._C = [
                        (e[2] << 16) | (e[2] >>> 16),
                        (4294901760 & e[0]) | (65535 & e[1]),
                        (e[3] << 16) | (e[3] >>> 16),
                        (4294901760 & e[1]) | (65535 & e[2]),
                        (e[0] << 16) | (e[0] >>> 16),
                        (4294901760 & e[2]) | (65535 & e[3]),
                        (e[1] << 16) | (e[1] >>> 16),
                        (4294901760 & e[3]) | (65535 & e[0]),
                      ]),
                      o = (this._b = 0);
                    o < 4;
                    o++
                  )
                    je.call(this);
                  for (o = 0; o < 8; o++) s[o] ^= i[(o + 4) & 7];
                  if (t) {
                    var n = t.words,
                      a = n[0],
                      r = n[1],
                      l =
                        (16711935 & ((a << 8) | (a >>> 24))) |
                        (4278255360 & ((a << 24) | (a >>> 8))),
                      c =
                        (16711935 & ((r << 8) | (r >>> 24))) |
                        (4278255360 & ((r << 24) | (r >>> 8))),
                      d = (l >>> 16) | (4294901760 & c),
                      h = (c << 16) | (65535 & l);
                    for (
                      s[0] ^= l,
                        s[1] ^= d,
                        s[2] ^= c,
                        s[3] ^= h,
                        s[4] ^= l,
                        s[5] ^= d,
                        s[6] ^= c,
                        s[7] ^= h,
                        o = 0;
                      o < 4;
                      o++
                    )
                      je.call(this);
                  }
                },
                _doProcessBlock: function (e, t) {
                  var i = this._X;
                  je.call(this),
                    (be[0] = i[0] ^ (i[5] >>> 16) ^ (i[3] << 16)),
                    (be[1] = i[2] ^ (i[7] >>> 16) ^ (i[5] << 16)),
                    (be[2] = i[4] ^ (i[1] >>> 16) ^ (i[7] << 16)),
                    (be[3] = i[6] ^ (i[3] >>> 16) ^ (i[1] << 16));
                  for (var s = 0; s < 4; s++)
                    (be[s] =
                      (16711935 & ((be[s] << 8) | (be[s] >>> 24))) |
                      (4278255360 & ((be[s] << 24) | (be[s] >>> 8)))),
                      (e[t + s] ^= be[s]);
                },
                blockSize: 4,
                ivSize: 2,
              })),
            (we.RabbitLegacy = ve._createHelper(ke)),
            (Oe.pad.ZeroPadding = {
              pad: function (e, t) {
                var i = 4 * t;
                e.clamp(), (e.sigBytes += i - (e.sigBytes % i || i));
              },
              unpad: function (e) {
                var t = e.words,
                  i = e.sigBytes - 1;
                for (i = e.sigBytes - 1; 0 <= i; i--)
                  if ((t[i >>> 2] >>> (24 - (i % 4) * 8)) & 255) {
                    e.sigBytes = i + 1;
                    break;
                  }
              },
            }),
            Oe
          );
        })();
      }.call(this, i("c8ba")));
    },
    "9f29": function (e, t, i) {},
    c1db: function (e, t, i) {},
    c2ab: function (e, t, i) {
      "use strict";
      i("0fc8");
    },
    c92a: function (e, t, i) {
      "use strict";
      i("9f29");
    },
    cd85: function (e, t, i) {
      "use strict";
      i("4ab1");
    },
    d440: function (e, t, i) {
      "use strict";
      i("4683");
    },
    d8f8: function (e, t, i) {
      "use strict";
      i("7534");
    },
    dde99: function (e, t, i) {},
    f531: function (e, t, i) {
      "use strict";
      i("7c13");
    },
  },
]);
