(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-101e6094"],
  {
    1274: function (e, t, i) {
      "use strict";
      i.r(t);
      var n = function () {
          var e = this,
            t = e._self._c;
          return e.isOnlyAPP
            ? t(
                "div",
                {
                  staticClass: "isOnlyAPPClass",
                },
                [
                  t("img", {
                    attrs: {
                      src: i("f3f7"),
                      alt: "",
                    },
                  }),
                ]
              )
            : e.timeEndShow
            ? t(
                "div",
                {
                  style: {
                    backgroundImage: e.backgroundUrl
                      ? `url(${e.backgroundUrl})`
                      : "",
                    backgroundSize: "cover",
                    height: e.backgroundUrlHeight
                      ? e.backgroundUrlHeight + "rem"
                      : "auto",
                    opacity: 1,
                  },
                  attrs: {
                    id: "page-content",
                  },
                },
                [
                  e.lcpLoading
                    ? e._e()
                    : t(
                        "div",
                        e._l(e.info, function (i) {
                          return t(
                            "div",
                            {
                              key: i.id,
                            },
                            [
                              t(i.moduleId, {
                                tag: "component",
                                attrs: {
                                  info: e.handleData(i.specify),
                                  jumpTo: e.jumpTo,
                                  showPrivew: !1,
                                },
                              }),
                            ],
                            1
                          );
                        }),
                        0
                      ),
                  e.lcpLoading
                    ? t(
                        "div",
                        {
                          staticClass: "lcpLoadbox",
                        },
                        [
                          t("img", {
                            attrs: {
                              src: i("6417"),
                              alt: "",
                            },
                          }),
                        ]
                      )
                    : e._e(),
                ]
              )
            : t(
                "div",
                {
                  staticClass: "timeEndClass",
                },
                [
                  t("img", {
                    attrs: {
                      src: i("938e"),
                      alt: "",
                    },
                  }),
                ]
              );
        },
        a = [];
      i("7fd1"), i("1758"), i("0bba");
      let o = {
        dianquAuth: "dianqu_auth",
        authToken: "auth_token",
        authPhoneNumber: "auth_phonenumber",
        uidTest: "auth_uid_test",
        channel: "auth_channel",
        channelId: "channel_id",
        provinceId: "province_id",
        cityId: "city_id",
        is_H5: !0,
        PAGE_INFO: "page_info",
        LAST_PAGEID: "page_id",
        LAST_PAGENAME: "page_name",
        LAST_URL: "url",
        USER_INFO: "user_info",
        VIP_INFO: "vip_info",
        CHANNEL_VALUE: "channel_value",
        CHANNEL_KEY: "channel_key",
        LOGIN_FLAG: "login_flag",
        GOODSID_KEY: "goodsid_key",
        GOODSID_VALUE: "goodsid_value",
        GOODS_NAME: "GOODS_NAME",
        GOODS_LOGO: "GOODS_LOGO",
        timeDiff: 0,
        isVipPurchase: "isVipPurchase",
        EXPIRES_TIME: 120,
        getDianquAuthObj() {
          let e = localStorage[this.dianquAuth],
            t = e ? JSON.parse(e) : {};
          return t;
        },
        getAuthToken() {
          let e = this.getDianquAuthObj(),
            t = e ? e[this.authToken] : null;
          return t &&
            t.token &&
            (!t.expires || t.expires > new Date().valueOf())
            ? t.token
            : null;
        },
        getMobilePhone() {
          let e = this.getDianquAuthObj();
          return e ? e[this.authPhoneNumber] : null;
        },
        getValue(e) {
          let t = this.getDianquAuthObj();
          return t ? t[e] : null;
        },
        setValue(e, t) {
          let i = this.getDianquAuthObj();
          (i[e] = t || null),
            (localStorage[this.dianquAuth] = JSON.stringify(i));
        },
        getIsLogin() {
          let e = this.getDianquAuthObj(),
            t = e ? e[this.LOGIN_FLAG] : null;
          return !(
            !t ||
            !t.isLogin ||
            1 !== t.isLogin ||
            (t.expires && !(t.expires > new Date().valueOf()))
          );
        },
        setIsLogin(e, t) {
          let i = this.getDianquAuthObj(),
            n = t ? new Date().valueOf() + 60 * t * 1e3 : null;
          (i[this.LOGIN_FLAG] = {
            isLogin: e,
            expires: n,
          }),
            (localStorage[this.dianquAuth] = JSON.stringify(i));
        },
      };
      var s = o;
      function r() {
        const e = navigator.userAgent;
        let t = !!e.match(/AppleWebKit.*Mobile.*/),
          i = e.match(/(Android);?[\s\/]+([\d.]+)?/),
          n = e.match(/(iPad).*OS\s([\d_]+)/),
          a = e.match(/(iPod)(.*OS\s([\d_]+))?/),
          o = !n && e.match(/(iPhone\sOS)\s([\d_]+)/),
          s = e.match(/MicroMessenger\/([\d.]+)/),
          r = e.match(/IEMobile\/([\d.]+)/),
          c =
            /(iPad|iPhone|iPod).*? (IPad)?QQ\/([\d\.]+)/.test(e) ||
            /\bV1_AND_SQI?_([\d\.]+)(.*? QQ\/([\d\.]+))?/.test(e),
          l = e.match(/Chrome\/([\d.]+)/) || e.match(/CriOS\/([\d.]+)/),
          d = {};
        return (
          i && ((d.android = !0), (d.version = i[2])),
          o &&
            !a &&
            ((d.ios = d.iphone = !0), (d.version = o[2].replace(/_/g, "."))),
          n && ((d.ios = d.ipad = !0), (d.version = n[2].replace(/_/g, "."))),
          a &&
            ((d.ios = d.ipod = !0),
            (d.version = a[3] ? a[3].replace(/_/g, ".") : null)),
          s && ((d.wx = !0), (d.version = s[1])),
          r && ((d.wp = !0), (d.version = r[1])),
          d.ios || d.android || (d.pc = !0),
          l && l && !c && (d.Achrome = !0),
          t && (d.mobile = !0),
          d
        );
      }
      function c() {
        const e = navigator.userAgent,
          t = e.match(/leadeon/gi);
        return t && t.length;
      }
      function l() {
        const e = navigator.userAgent,
          t = e.match(/MicroMessenger/gi);
        return t && t.length;
      }
      function d(e) {
        let t;
        return (
          /grey|online/.test(e)
            ? location.href.replace(
                /(?:grey|online)\/(\w*)(?:\??)/g,
                (...[, e]) => {
                  t = e;
                }
              )
            : (t = ""),
          t
        );
      }
      function u() {
        let e = localStorage.getItem("jumpInfo");
        return e
          ? JSON.parse(e)
          : {
              pageInfo: {
                name: "",
                path: "",
                id: "",
              },
              info: {
                exampleId: "",
                exampleName: "",
                name: "",
              },
              goodsNo: "",
              pointPosition: "",
            };
      }
      const h = {
        methods: {
          sendClickLog({
            pointPosition: e = "",
            goodsNo: t = "",
            nextUrl: i = "",
            info: n = {
              exampleId: "",
              exampleName: "",
              name: "",
            },
          }) {
            let a = {
              id: "",
              path: "",
              name: "",
            };
            s.getValue(s.PAGE_INFO) &&
              (a = JSON.parse(s.getValue(s.PAGE_INFO)));
            u();
            i = d(i) || i;
          },
          sendJumpLog(
            {
              pointPosition: e = "",
              goodsNo: t = "",
              nextUrl: i = "",
              info: n = {
                exampleId: "",
                exampleName: "",
                name: "",
              },
            },
            a
          ) {
            let o = {
              id: "",
            };
            s.getValue(s.PAGE_INFO) &&
              (o = JSON.parse(s.getValue(s.PAGE_INFO)));
            s.getValue(s.LAST_PAGEID),
              s.getValue(s.LAST_PAGENAME),
              s.getValue(s.LAST_URL);
            (i = d(i) || i),
              s.setValue(s.LAST_PAGEID, o.id),
              s.setValue(s.LAST_PAGENAME, o.name),
              s.setValue(s.LAST_URL, o.path);
          },
          sendPageVisit() {
            JSON.parse(s.getValue(s.PAGE_INFO)), u();
            localStorage.setItem("jumpInfo", "");
          },
        },
      };
      i("a15c"), i("815b"), i("69fa"), i("18e6");
      var g = i("82ae"),
        p = i.n(g);
      function m(e) {
        const t = window.location.href;
        let i = "";
        i =
          -1 !== t.indexOf("staging")
            ? "https://dev.coc.10086.cn/staging-coc"
            : "https://dev.coc.10086.cn/coc";
        var n = encodeURIComponent(location.href.split("#")[0]);
        p()({
          method: "post",
          baseURL: i,
          url: "gateway/api/wechat/share",
          data: {
            type: "CMCC_FLOW_ASSISTANT",
            url: n,
          },
        }).then((t) => {
          let i = t.data;
          if ("0" == i.code) {
            var n = i.data.timestamp,
              a = i.data.nonceStr,
              o = i.data.signature,
              s = i.data.appId;
            wx.config({
              debug: !1,
              appId: s,
              timestamp: n,
              nonceStr: a,
              signature: o,
              jsApiList: [
                "updateAppMessageShareData",
                "updateTimelineShareData",
              ],
            }),
              wx.ready(function () {
                wx.checkJsApi({
                  jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"],
                  success: function (e) {},
                }),
                  wx.ready(function () {
                    wx.updateAppMessageShareData({
                      title: e.title,
                      desc: e.desc,
                      link: e.link,
                      imgUrl: e.imgUrl,
                      type: "",
                      dataUrl: "",
                      success: function () {},
                    });
                  }),
                  wx.ready(function () {
                    wx.updateTimelineShareData({
                      title: e.title,
                      link: e.link,
                      imgUrl: e.imgUrl,
                      success: function () {},
                    });
                  });
              }),
              wx.error(function (e) {});
          }
        });
      }
      function f(e) {
        leadeon.enableShared({
          debug: !1,
          enable: !0,
          shareObj: e,
          success: function (e) {},
          error: function (e) {},
        });
      }
      var _ = i("db49"),
        P = i.n(_);
      let A,
        w = 0,
        I = "",
        v = "",
        b = "";
      const {
        VUE_APP_JSON_PATH: O,
        VUE_APP_TYPE_CON: S,
        PROJECT_NAME: E,
        VUE_APP_JSON_PATH_GREY: T,
      } = P.a;
      let y,
        N,
        k,
        x = `${O}${S}.${E}`,
        $ = window.location.href;
      function L(e, t, i, n, a) {
        if (e && e[a])
          return new Promise((t, i) => {
            t({
              status: 200,
              data: e[a],
            });
          });
        {
          let e;
          switch (n) {
            case "application":
              e = `${x}.application.json`;
              break;
            case "layout":
              e = `${x}.${t}.layout.${a}.json`;
              break;
            case "instance":
              e = `${x}.${t}.instance.${a}.json`;
              break;
            case "rule":
              e = `${x}.rule.${a}.json`;
              break;
            default:
              break;
          }
          return p.a.get(e);
        }
      }
      function U(e, t, i, n) {
        (N = n), (y = t), (A = i);
        let a = location.href.split(`/${t}/${e}`)[0],
          o = new Date().getTime();
        L([], t, o, "application")
          .then((n) => {
            let s = n.data;
            (I = s.shareTitle),
              (v = s.shareDescription),
              (b = s.sharePictureUrl),
              window.localStorage.setItem("application_h5", JSON.stringify(s)),
              L([], t, o, "layout", e)
                .then((n) => {
                  let s = n.data;
                  i.$store.dispatch("PageInfo", s),
                    s.shareTitle &&
                      s.shareDescription &&
                      s.sharePictureUrl &&
                      ((I = s.shareTitle),
                      (v = s.shareDescription),
                      (b = s.sharePictureUrl)),
                    V(),
                    s.title && (document.title = s.title),
                    0 == s.isGrey
                      ? (window.isGrey = !1)
                      : 1 == s.isGrey && (window.isGrey = !0),
                    D(s, a, o, e, t);
                })
                .catch((e) => C(e, t, s, a));
          })
          .catch((e) => C(e, t, "", a));
      }
      function C(e, t, i, n) {}
      function D(e, t, i, n, a) {
        let { ruleCases: o } = e;
        if (o && o.length) {
          let s = o.sort((e, t) =>
              e.priority === t.priority ? t.id - e.id : e.priority - t.priority
            ),
            r = [];
          s.forEach((e) => {
            r.push(e.specify);
          }),
            r.forEach((a, o) => {
              if (0 == w && a.ruleDetails.length && J(a.ruleDetails)) {
                if (((w = 1), s[o].outUrl && 1 == s[o].type))
                  return void window.location.replace(s[o].outUrl);
                let a = s[o].toPagePath;
                L([], y, i, "layout", a)
                  .then((a) => {
                    let o = a.data;
                    that.$store.dispatch("PageInfo", o),
                      o.shareTitle &&
                        o.shareDescription &&
                        o.sharePictureUrl &&
                        ((I = o.shareTitle),
                        (v = o.shareDescription),
                        (b = o.sharePictureUrl)),
                      V(),
                      o.title && (document.title = o.title),
                      0 == e.isGrey
                        ? (window.isGrey = !1)
                        : 1 == e.isGrey && (window.isGrey = !0),
                      G(o, t, i, n, y);
                  })
                  .catch((a) => {
                    G(e, t, i, n, y);
                  });
              }
            }),
            0 == w && G(e, t, i, n, a);
        } else G(e, t, i, n, a);
      }
      function G(e, t, i, n, a) {
        let { pageInstanceList: o } = e;
        if (o && o.length) {
          k = o;
          let t = [],
            i = [],
            n = [],
            a = [],
            s = [];
          if (
            (o.forEach((e) => {
              if ((t.push(e.instance), e.ruleIds)) {
                let t = e.ruleIds.split(",");
                i.push({
                  idsList: t,
                  instanceId: e.instanceId,
                  ruleCasesList: e.ruleCases,
                }),
                  (n = [...n, ...t]);
              }
            }),
            t.length)
          )
            if (n.length)
              if (
                (i.forEach((e) => {
                  let t = !0,
                    i = [];
                  e.idsList.forEach((t) => {
                    let n = e.ruleCasesList.find((e) => e.id == t);
                    n && n.ruleDetails[0] && (i = [...i, ...n.ruleDetails]);
                  }),
                    (t = J(i)),
                    t || s.push(e.instanceId);
                }),
                s.length)
              ) {
                let i = t.filter((e) => !s.includes(e.id));
                (e.specify = JSON.stringify(i)), H(e);
              } else (e.specify = JSON.stringify(a)), H(e);
            else (e.specify = JSON.stringify(t)), H(e);
        } else console.log("没有组件"), N && N([]), (e.specify = "");
      }
      function H(e) {
        let { specify: t } = e;
        (A.showLoading = !1),
          s.setValue(s.PAGE_INFO, JSON.stringify(e)),
          A.sendPageVisit(),
          (A.info = JSON.parse(t)),
          localStorage.setItem("pageInfo", t),
          N && N(k);
      }
      function J(e) {
        return e.every((e) => {
          let { dimensionParam: t, params: i, isContain: n } = e;
          if ("dimension_terminal" == t.replace(/\s/g, "")) {
            let e = r();
            i = "string" === typeof i ? JSON.parse(i) : i;
            let t = !1;
            return (
              i.includes(0) && e.android && (t = !0),
              i.includes(1) && e.ios && (t = !0),
              i.includes(2) && (t = !0),
              0 === n ? !t : t
            );
          }
          if ("dimension_ABtest" == t.replace(/\s/g, "")) {
            const e = Math.random(),
              t = e < i;
            return 0 === n ? !t : t;
          }
          if ("dimension_channelCode" == t.replace(/\s/g, "")) {
            let e = [];
            e = window.location.search.slice(1).split("&");
            let t = "";
            e.forEach((e) => {
              let i = e.split("=");
              "channelId" == i[0] && (t = i[1]);
            });
            let a,
              o = i.split(",");
            return (a = !!t && o.includes(t)), 0 === n ? !a : a;
          }
          if ("dimension_time" == t.replace(/\s/g, "")) {
            let e = new Date().getTime(),
              t = "string" === typeof i ? JSON.parse(i) : i,
              a = t[0] < e && e < t[1];
            return 0 === n ? !a : a;
          }
        });
      }
      function V() {
        try {
          const e = window.atom.default;
          console.log("加载成功"),
            e.invoke("setMoreInfo", {
              hasRefresh: !1,
              hasShare: !1,
              hasFollow: !1,
            });
        } catch (e) {}
        l() &&
          m({
            title: I,
            desc: v,
            imgUrl: b,
            link: window.location.href,
          }),
          c() &&
            f({
              title: I,
              link: window.location.href,
              imgUrl: b,
              content: v,
            });
      }
      -1 !== $.indexOf("grey") && (x = `${T}${S}.${E}`);
      var M = i("7736");
      const j = window.location.href,
        R = /^(http:\/\/|https:\/\/)|([^\/]*\/)/g,
        W = j.match(R);
      let Y = "";
      -1 !== j.indexOf("10086.cn")
        ? (Y =
            -1 !== j.indexOf("sandbox")
              ? W[0] + W[1] + "38857911/"
              : W[0] + W[1] + W[2])
        : -1 !== j.indexOf("cmsc.local") && (Y = W[0] + W[1]);
      const B = p.a.create({
        baseURL: Y,
        withCredentials: !0,
      });
      B.interceptors.request.use(
        (e) => (Y && (e.url = e.url.replace("/coc1/", "/")), e),
        (e) => Promise.reject(e)
      ),
        B.interceptors.response.use(
          (e) => e.data,
          (e) => Promise.reject(e)
        );
      var F = B;
      function q(e) {
        return F({
          url: "/personalization/page/getInsertCode",
          method: "post",
          data: e,
        });
      }
      var z = i("e22e");
      function Z(e, t) {
        let i =
            "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/canvas/package-h5-canvas/production/build-h5cdn",
          n = [];
        window.timestamp = new Date().valueOf();
        let a = localStorage.getItem("application_h5") || null,
          o = a.moduleVersion ? JSON.parse(a.moduleVersion) : {};
        for (let s in o) o[s] = new Date(o[s]).getTime();
        e.forEach((e) => {
          o.hasOwnProperty(`"${e.moduleId}"`)
            ? n.push({
                moduleName: {
                  entry: `${i}/${
                    e.moduleId
                  }/h5webcomponents.umd.min.js?timestamp=${
                    o[`"${e.moduleId}"`]
                  }`,
                  styles: [
                    `${i}/${e.moduleId}/h5webcomponents.css?timestamp=${
                      o[`"${e.moduleId}"`]
                    }`,
                  ],
                },
              })
            : n.push({
                moduleName: {
                  entry: `${i}/${e.moduleId}/h5webcomponents.umd.min.js?timestamp=${window.timestamp}`,
                  styles: [
                    `${i}/${e.moduleId}/h5webcomponents.css?timestamp=${window.timestamp}`,
                  ],
                },
              });
        }),
          e.length || (t && t()),
          e.forEach((e) => {
            z["default"].component(e.moduleId, (i, a) => {
              window.app
                .$moduleLoader(n)
                .then(() => {
                  t && t(), i(window.AllComps[e.moduleId].comp);
                  const n = document.querySelector("#cmcc_loading");
                  n && (n.style.display = "none");
                })
                .catch((e) => {
                  a(e);
                });
            });
          });
      }
      var K = {
          validateURL(e) {
            const t =
              /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
            return t.test(e);
          },
          validateLowerCase(e) {
            const t = /^[a-z]+$/;
            return t.test(e);
          },
          validateUpperCase(e) {
            const t = /^[A-Z]+$/;
            return t.test(e);
          },
          validateAlphabets(e) {
            const t = /^[A-Za-z]+$/;
            return t.test(e);
          },
          validatePhone(e) {
            const t = /^(1[3-9][0-9])\d{8}$/;
            return t.test(e);
          },
          validateIDCard(e) {
            const t = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/;
            return t.test(e);
          },
          validateImageFile(e) {
            const t = /^.*?(gif|jpg|jpeg|png)$/;
            return t.test(e) || (e = ""), e;
          },
          validateAudioFile(e) {
            const t = /^.*?(mp3|wma)$/;
            return t.test(e);
          },
          validateExcel(e) {
            const t = /^.*?(xls|xlsx)$/;
            return t.test(e);
          },
          validateWord(e) {
            const t = /^.*?(doc|docx)$/;
            return t.test(e);
          },
          validatePpt(e) {
            const t = /^.*?(ppt|pptx)$/;
            return t.test(e);
          },
          validateVideo(e) {
            const t =
              /^.*?(avi|rmvb|rm|asf|divx|mpg|mpeg|mpe|wmv|mp4|mkv|vob)$/;
            return t.test(e);
          },
          validateCad(e) {
            const t = /^.*?(dwt|dwg|dws|dxf)$/;
            return t.test(e);
          },
          validateZip(e) {
            const t = /^.*?(rar|zip|arj|z|gz)$/;
            return t.test(e);
          },
          validteNumber(e) {
            const t = /^[0-9]+$/;
            return t.test(e);
          },
          validteCharacter(e) {
            const t = String(e),
              i = t.trim(),
              n = /^[A-Za-z0-9]+$/;
            return n.test(i);
          },
          validateEmail(e) {
            const t =
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return t.test(e);
          },
          validateChina(e) {
            return !!/^[\u4e00-\u9fa5]+$/.test(e);
          },
          validateWeixin(e) {
            let t = navigator.userAgent.toLowerCase();
            return "micromessenger" == t.match(/MicroMessenger/i);
          },
          validateAndroid(e) {
            let t = navigator.userAgent.toLowerCase();
            return "android" == t.match(/android/i);
          },
          validateIphone(e) {
            let t = navigator.userAgent.toLowerCase();
            return "iphone" == t.match(/iphone/i);
          },
          validateChinaMoblieApp(e) {
            let t = navigator.userAgent.toLowerCase();
            return "leadeon" == t.match(/leadeon/i);
          },
          getIsWechatMiniprogram() {
            let e = navigator.userAgent.toLowerCase();
            return "miniProgram" == e.match(/miniProgram/i);
          },
          getIsAli() {
            let e = navigator.userAgent.toLowerCase();
            return "AlipayClient" == e.match(/AlipayClient/i);
          },
          getisDouyinClient() {
            let e = navigator.userAgent.toLowerCase();
            return "aweme" == e.match(/aweme/i);
          },
          getPC() {
            return !/Android|webOS|iPhone|iPod|BlackBerry/i.test(
              navigator.userAgent
            );
          },
        },
        Q = {
          name: "Index",
          data() {
            return {
              info: [],
              showLoading: !1,
              backgroundImageHeight: "100%",
              isHandleDefaultPhone: !1,
              backgroundUrlHeight: "",
              backgroundUrl: "",
              pageId: "",
              resultType: "",
              timeEndShow: !0,
              lcpLoading: !1,
              isOnlyAPP: !1,
              pageLoadTimer: null,
            };
          },
          mixins: [h],
          watch: {
            $route: {
              handler() {
                this.getJSON();
              },
              deep: !0,
            },
            "$store.state.pageInfo": {
              handler(e) {
                e.onlyHallOpen && !c()
                  ? (this.isOnlyAPP = !0)
                  : (this.isOnlyAPP = !1),
                  e.beginTime && e.endTime && this.IstimeEnd(e),
                  e.backgroundUrl && (this.backgroundUrl = e.backgroundUrl),
                  this.getBackgroundImageHeight();
              },
              deep: !0,
              immediate: !0,
            },
            "$store.state.isHandSingleSuccess": {
              handler(e) {
                this.getBackgroundImageHeight();
              },
              deep: !0,
              immediate: !0,
            },
          },
          computed: {
            ...Object(M["b"])(["pageInfo"]),
          },
          created() {
            (this.showLoading = !0),
              this.addNetworkEventListener(),
              console.log("触发开始全局注册RainbowBridge的dispatchEvent"),
              (window.RainbowBridge = {
                onComplete: (e, t) => {
                  const i = new CustomEvent(e, {
                    detail: {
                      obj: t,
                    },
                    bubbles: !0,
                    cancelable: !0,
                  });
                  window.dispatchEvent(i);
                },
              }),
              this.getJSON(),
              (this.lcpLoading = !0);
          },
          mounted() {
            let e = new Proxy(this.$route.query, {
              get(e, t) {
                return Reflect.has(e, t) ? e[t] : null;
              },
            });
            (this.pageId = e.pageId || sessionStorage.getItem("PageId") || ""),
              (this.touchCode =
                e.channelId || sessionStorage.getItem("TouchCode") || ""),
              (this.channelSeqId = e.channelSeqId),
              (this.sellerId = e.sellerId),
              (this.resultType = e.resultType || ""),
              gdp("setGeneralProps", {
                WT_pageid: this.pageId,
                WT_channelid: this.touchCode,
                WT_mc_ev: "210810_PACKAGE2PZHYM",
              }),
              K.validateChinaMoblieApp()
                ? gdp("setGeneralProps", {
                    WT_plat: "000_JTAPP",
                  })
                : K.validateWeixin()
                ? gdp("setGeneralProps", {
                    WT_plat: "000_JTWX",
                  })
                : gdp("setGeneralProps", {
                    WT_plat: "000_OTHER",
                  }),
              gdp("track", "pageview", {
                WT_et: "pageview",
                WT_event: "H5PageShow",
              }),
              this.resultType ||
                gdp("track", "pageview", {
                  WT_et: "pageview",
                  WT_event: "210810_PACKAGE2PZHYM_JHY_DDY_YMFWS",
                  WT_envName: "package2配置化页面_订单页_页面访问时",
                }),
              (this.pageLoadTimer = setTimeout(() => {
                this.getPageLoadTime();
              }, 100)),
              this.pageId &&
                this.touchCode &&
                (sessionStorage.setItem("PageId", this.pageId),
                sessionStorage.setItem("TouchCode", this.touchCode)),
              this.pageId && this.getToutiaoCode();
          },
          beforeDestroy() {
            this.pageLoadTimer &&
              (clearTimeout(this.pageLoadTimer), (this.pageLoadTimer = null));
          },
          methods: {
            getPageLoadTime() {
              const e = window.performance.timing,
                t = e.loadEventEnd - e.navigationStart;
              gdp("track", "pageview", {
                WT_es: location.origin + location.pathname,
                WT_et: "pageview",
                WT_event: "210810_PACKAGE2PZHYM_JHY_SY_YMFWS",
                WT_ed: t,
              }),
                console.log(t, "页面加载时长");
            },
            getToutiaoCode() {
              q({
                pageId: this.pageId,
              })
                .then((e) => {
                  if (0 == e.code) {
                    let t = e.data.touTiaoConvertId,
                      i = e.data.touTiaoScriptId;
                    i && t && this.InsertToutiao(window, document, "script", i),
                      this.$store.dispatch("toutiaoInfo", {
                        convert_id: t,
                        script_id: i,
                      });
                  } else
                    this.$store.dispatch("toutiaoInfo", {
                      convert_id: "",
                      script_id: "",
                    });
                })
                .catch((e) => {
                  this.$store.dispatch("toutiaoInfo", {
                    convert_id: "",
                    script_id: "",
                  });
                });
            },
            InsertToutiao(e, t, i, n) {
              var a = (e.meteor = e.meteor || []);
              (a.methods = ["track", "off", "on"]),
                (a.factory = function (e) {
                  return function () {
                    var t = Array.prototype.slice.call(arguments);
                    return t.unshift(e), a.push(t), a;
                  };
                });
              for (var o = 0; o < a.methods.length; o++) {
                var s = a.methods[o];
                a[s] = a.factory(s);
              }
              (a.load = function () {
                var e,
                  a = t.getElementsByTagName(i)[0];
                (e = t.createElement(i)),
                  (e.src =
                    "https://analytics.snssdk.com/meteor.js/v1/" + n + "/sdk"),
                  a.parentNode.insertBefore(e, a);
              }),
                a.load(),
                a.invoked || ((a.invoked = !0), a.track("pageview"));
            },
            getBackgroundImageHeight() {
              if (this.pageInfo && this.pageInfo.backgroundUrl) {
                let e = !1;
                const t = new Image();
                (t.src = this.pageInfo.backgroundUrl),
                  1 == this.$store.getters.isHandSingleSuccess &&
                  this.pageInfo.loginBackgroundUrl &&
                  1 == this.pageInfo.isRegister
                    ? ((t.src = this.pageInfo.loginBackgroundUrl),
                      (this.backgroundUrl = this.pageInfo.loginBackgroundUrl),
                      this.pageInfo.loginBackgroundImgHeight &&
                        this.pageInfo.loginBackgroundImgWidth &&
                        ((this.backgroundUrlHeight =
                          (375 * this.pageInfo.loginBackgroundImgHeight) /
                          this.pageInfo.loginBackgroundImgWidth /
                          100),
                        (e = !0)))
                    : this.pageInfo.backgroundImgHeight &&
                      this.pageInfo.backgroundImgWidth &&
                      ((this.backgroundUrlHeight =
                        (375 * this.pageInfo.backgroundImgHeight) /
                        this.pageInfo.backgroundImgWidth /
                        100),
                      (e = !0)),
                  e ||
                    (t.onload = () => {
                      const e = t.width / t.height;
                      document.body.clientWidth,
                        document.body.clientH,
                        document.body.clientWidth;
                      this.backgroundUrlHeight = t.height / 2 / 100;
                    });
              }
            },
            IstimeEnd(e) {
              let t = Number(new Date().valueOf()),
                i = Number(new Date(e.endTime.replace(/-/g, "/")).getTime()),
                n = Number(new Date(e.beginTime.replace(/-/g, "/")).getTime());
              n && i && (this.timeEndShow = n < t && t < i);
            },
            handleData(e) {
              if (e) return JSON.parse(e);
            },
            jumpTo(e) {
              e && (window.location = e);
            },
            addNetworkEventListener() {
              window.addEventListener("offline", () => {
                (sessionStorage.locationUrl = window.location.href),
                  this.$router.replace("/networkError");
              }),
                window.addEventListener("online", () => {
                  sessionStorage.locationUrl &&
                    (window.location.href = sessionStorage.locationUrl);
                });
            },
            getJSON() {
              let { page: e, env: t } = this.$route.params;
              if ("grey" != t && "online" != t)
                return (
                  this.$toast("请检查输入的地址是否正确"),
                  void (this.showLoading = !1)
                );
              U(e, t, this, (e) => {
                Z(e, (this.lcpLoading = !1));
              }),
                this.$store.dispatch("Userinfo", {}),
                this.$store.dispatch("Goodsinfo", {});
            },
          },
        },
        X = Q,
        ee = (i("a125"), i("aea8"), i("829d")),
        te = Object(ee["a"])(X, n, a, !1, null, "3bd8109e", null);
      t["default"] = te.exports;
    },
    "56a7": function (e, t, i) {},
    6417: function (e, t, i) {
      e.exports = i.p + "img/lcpLoading.8946bb22.png";
    },
    "69fa": function (e, t, i) {
      "use strict";
      var n = i("9a40"),
        a = i("0cb8"),
        o = i("237f"),
        s = i("de67"),
        r = i("8bc1"),
        c = i("2d05"),
        l = i("e0ca"),
        d = i("27d4"),
        u = d("find", TypeError);
      n(
        {
          target: "Iterator",
          proto: !0,
          real: !0,
          forced: u,
        },
        {
          find: function (e) {
            r(this);
            try {
              s(e);
            } catch (n) {
              l(this, "throw", n);
            }
            if (u) return a(u, this, e);
            var t = c(this),
              i = 0;
            return o(
              t,
              function (t, n) {
                if (e(t, i++)) return n(t);
              },
              {
                IS_RECORD: !0,
                INTERRUPTED: !0,
              }
            ).result;
          },
        }
      );
    },
    "815b": function (e, t, i) {
      "use strict";
      var n = i("9a40"),
        a = i("0cb8"),
        o = i("237f"),
        s = i("de67"),
        r = i("8bc1"),
        c = i("2d05"),
        l = i("e0ca"),
        d = i("27d4"),
        u = d("every", TypeError);
      n(
        {
          target: "Iterator",
          proto: !0,
          real: !0,
          forced: u,
        },
        {
          every: function (e) {
            r(this);
            try {
              s(e);
            } catch (n) {
              l(this, "throw", n);
            }
            if (u) return a(u, this, e);
            var t = c(this),
              i = 0;
            return !o(
              t,
              function (t, n) {
                if (!e(t, i++)) return n();
              },
              {
                IS_RECORD: !0,
                INTERRUPTED: !0,
              }
            ).stopped;
          },
        }
      );
    },
    "938e": function (e, t, i) {
      e.exports = i.p + "img/timeEndBgc.047056a4.png";
    },
    a125: function (e, t, i) {
      "use strict";
      i("b10b");
    },
    aea8: function (e, t, i) {
      "use strict";
      i("56a7");
    },
    b10b: function (e, t, i) {},
    db49: function (e, t) {
      const i = {
          development: {
            VUE_APP_JSON_PATH: "/sandboxApi/package/cdn/fixedPath/",
            VUE_APP_JSON_PATH_GREY: "/sandboxApi/package/cdn/fixedPath/",
            VUE_APP_TYPE_CON: "test",
          },
          sandbox: {
            VUE_APP_JSON_PATH:
              -1 !== location.href.indexOf("localhost")
                ? "/sandboxApi/package/cdn/fixedPath/"
                : "https://sandbox.open.10086.cn/38857911/package/cdn/fixedPath/",
            VUE_APP_JSON_PATH_GREY:
              -1 !== location.href.indexOf("localhost")
                ? "/sandboxApi/package/cdn/fixedPath/"
                : "https://sandbox.open.10086.cn/38857911/package/cdn/fixedPath/",
            VUE_APP_TYPE_CON: "test",
          },
          staging: {
            VUE_APP_JSON_PATH:
              -1 !== location.href.indexOf("localhost")
                ? "/resApi/res/cdn/staging/coc1/fixedPath/"
                : "https://res.coc.10086.cn/res/cdn/staging/coc1/fixedPath/",
            VUE_APP_JSON_PATH_GREY:
              -1 !== location.href.indexOf("localhost")
                ? "/resApi/res/cdn/staging/coc1/fixedPath/"
                : "https://dev.coc.10086.cn/res/cdn/staging/coc1/fixedPath/",
            VUE_APP_TYPE_CON: "staging",
          },
          production: {
            VUE_APP_JSON_PATH:
              -1 !== location.href.indexOf("localhost")
                ? "/resApi/res/cdn/coc1/fixedPath/"
                : "https://res.coc.10086.cn/res/cdn/coc1/fixedPath/",
            VUE_APP_JSON_PATH_GREY:
              -1 !== location.href.indexOf("localhost")
                ? "/resApi/res/cdn/coc1/fixedPath/"
                : "https://dev.coc.10086.cn/res/cdn/coc1/fixedPath/",
            VUE_APP_TYPE_CON: "production",
          },
        },
        n = {
          PROJECT_NAME: "package-h5-canvas",
          canvasPrefix: "/canvas/canvas-serve",
          isH5: !!["h5cdn", "development"].indexOf("production") > -1,
        };
      e.exports = {
        ...i["production"],
        ...n,
      };
    },
    f3f7: function (e, t, i) {
      e.exports = i.p + "img/isNOApp.acf66036.png";
    },
  },
]);
