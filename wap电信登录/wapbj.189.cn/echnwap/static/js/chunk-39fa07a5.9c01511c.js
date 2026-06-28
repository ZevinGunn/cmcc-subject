(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-39fa07a5"],
  {
    "0fa2": function (t, e, n) {},
    "498a": function (t, e, n) {
      "use strict";
      var a = n("23e7"),
        s = n("58a8").trim,
        i = n("c8d2");
      a(
        { target: "String", proto: !0, forced: i("trim") },
        {
          trim: function () {
            return s(this);
          },
        }
      );
    },
    "84c2": function (t, e, n) {
      "use strict";
      n("0fa2");
    },
    8622: function (t, e, n) {
      "use strict";
      n("a9f2");
    },
    a9f2: function (t, e, n) {},
    c8d2: function (t, e, n) {
      var a = n("d039"),
        s = n("5899"),
        i = "​᠎";
      t.exports = function (t) {
        return a(function () {
          return !!s[t]() || i[t]() != i || s[t].name !== t;
        });
      };
    },
    c94e: function (t, e, n) {
      "use strict";
      n.r(e);
      var a = function () {
          var t = this,
            e = t.$createElement,
            n = t._self._c || e;
          return n("div", { staticClass: "content" }, [
            n("section", { staticClass: "page-main" }, [
              n(
                "div",
                { staticClass: "scratchCard", style: t.scratchCardStyle },
                [
                  n("div", { staticClass: "textimg" }, [
                    n("img", {
                      attrs: {
                        src: t.webActiveImage,
                        width: "100%",
                        height: "auto",
                      },
                    }),
                  ]),
                  n("div", { staticClass: "ui-row pdt-50 tc" }, [
                    n("div", { staticClass: "scratchbox" }, [
                      n("div", { staticClass: "showitem" }, [
                        n(
                          "div",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: t.queryOfferName,
                                expression: "queryOfferName",
                              },
                            ],
                            staticClass: "acestbox",
                          },
                          [
                            t._m(0),
                            n("p", { staticClass: "textb" }, [
                              t._v(t._s(t.queryOfferName)),
                            ]),
                          ]
                        ),
                        n("div", { staticClass: "acestbox hide" }, [
                          t._m(1),
                          n(
                            "p",
                            { staticClass: "textb" },
                            [
                              n(
                                "van-button",
                                {
                                  staticClass: "fs-28",
                                  attrs: {
                                    color:
                                      "linear-gradient(to right,#64c2f7, #4474ff )",
                                  },
                                },
                                [t._v("继续刮奖")]
                              ),
                            ],
                            1
                          ),
                        ]),
                      ]),
                      n("div", {
                        staticClass: "dowupbox",
                        style: t.styleObject,
                      }),
                      t.showDiv
                        ? n("div", { staticClass: "linkbtnbox" }, [
                            n("div", { staticClass: "ui-row" }, [
                              n("p", [
                                t._v(" 当前可参与刮奖次数 "),
                                n("span", [t._v(t._s(t.rollNum) + " 次")]),
                              ]),
                              n(
                                "button",
                                {
                                  staticClass: "clickbtn",
                                  class: { "gray-btn": 0 === t.rollNum },
                                  attrs: { type: "button" },
                                  on: {
                                    click: function (e) {
                                      t.$utils.throttle(function () {
                                        0 === t.rollNum
                                          ? t.showNoChancePopup()
                                          : t.submit();
                                      }, 500);
                                    },
                                  },
                                },
                                [t._v(" 点我刮奖 ")]
                              ),
                            ]),
                          ])
                        : t._e(),
                    ]),
                  ]),
                  n("div", { staticClass: "ui-row pd-20 mgt-70" }, [
                    n("div", { staticClass: "awardinfo" }, [
                      n(
                        "p",
                        {
                          staticStyle: {
                            "font-weight": "bold",
                            "font-size": "0.35rem",
                          },
                        },
                        [t._v(" 本期奖品 ")]
                      ),
                      n("p", {
                        staticClass: "mgt-10",
                        staticStyle: {
                          "font-weight": "bold",
                          "font-size": "0.28rem",
                        },
                        domProps: { innerHTML: t._s(t.wapActiveDesc) },
                      }),
                    ]),
                  ]),
                  n("div", { staticClass: "myaward" }, [
                    n("span", { staticClass: "postitle" }, [t._v("我的奖品")]),
                    n("div", { staticClass: "itemcent" }, [
                      n(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: 0 == t.checkNum(),
                              expression: "checkNum() == 0",
                            },
                          ],
                          staticClass: "noaward",
                        },
                        [t._m(2)]
                      ),
                      n(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: t.checkNum() > 0,
                              expression: "checkNum() > 0",
                            },
                          ],
                          staticClass: "awardshow",
                        },
                        t._l(t.offerName, function (e, a) {
                          return n(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: e.num >= 1,
                                  expression: "item.num >= 1",
                                },
                              ],
                              key: a,
                              staticClass: "items",
                            },
                            [
                              n(
                                "label",
                                {
                                  directives: [
                                    {
                                      name: "show",
                                      rawName: "v-show",
                                      value: e.num > 1,
                                      expression: "item.num > 1",
                                    },
                                  ],
                                  staticClass: "poshot",
                                },
                                [t._v("x" + t._s(e.num))]
                              ),
                              n("span", {
                                staticClass: "pospn",
                                class:
                                  "100分钟全国语音" == e.offerName
                                    ? "pospn-voice"
                                    : "",
                                domProps: {
                                  innerHTML: t._s(t.offerNameObj[e.offerName]),
                                },
                              }),
                              n("p", { staticClass: "foterbtn" }, [
                                n("span", [
                                  t._v(t._s(t.offerPriceObj[e.offerName])),
                                ]),
                              ]),
                            ]
                          );
                        }),
                        0
                      ),
                    ]),
                  ]),
                  n("div", { staticClass: "activitybox" }, [
                    n("dl", [
                      n("dt", [t._v("活动说明")]),
                      n("dd", {
                        domProps: { innerHTML: t._s(t.wapTariffDesc) },
                      }),
                    ]),
                    n("dl", [
                      n("dt", [t._v("奖品使用说明")]),
                      n("dd", {
                        domProps: { innerHTML: t._s(t.wapOpeningDesc) },
                      }),
                    ]),
                  ]),
                ]
              ),
            ]),
          ]);
        },
        s = [
          function () {
            var t = this,
              e = t.$createElement,
              n = t._self._c || e;
            return n("p", { staticClass: "texta" }, [
              n("img", {
                attrs: {
                  src: "https://wapbj.189.cn/selfwapimage/wap_vue_static/assets/images/tianyi/manyi.png",
                },
              }),
              n("span", [t._v("恭喜您获得")]),
            ]);
          },
          function () {
            var t = this,
              e = t.$createElement,
              n = t._self._c || e;
            return n("p", { staticClass: "texta" }, [
              n("img", {
                attrs: {
                  src: "https://wapbj.189.cn/selfwapimage/wap_vue_static/assets/images/tianyi/bumanyi.png",
                },
              }),
              n("span", { staticClass: "color-blue" }, [
                t._v("未中奖，继续刮奖"),
              ]),
            ]);
          },
          function () {
            var t = this,
              e = t.$createElement,
              n = t._self._c || e;
            return n("div", { staticClass: "ui-row tc" }, [
              n("img", {
                attrs: {
                  src: "https://wapbj.189.cn/selfwapimage/wap_vue_static/assets/images/tianyi/nodatas.png",
                },
              }),
              n("p", [t._v("您还没有获得奖品，快去刮奖区试试吧～")]),
            ]);
          },
        ],
        i =
          (n("159b"),
          n("498a"),
          n("a9e3"),
          n("d81d"),
          n("b64b"),
          n("99af"),
          n("ff53")),
        r = n.n(i),
        o = n("4ec3"),
        c = {
          name: "scratchCard",
          components: { scratchCard: r.a },
          data: function () {
            return {
              wapWarmTipsLinkText: "北京电信活动专区",
              webWarmTipsRoute: "/Double11Active",
              wapTariffDesc:
                "1.活动时间:2026年4月1日-2026年12月31日。<br>2.本活动限北京电信指定活动办理用户参与，用户每办理成功一笔业务，可参与一次抽奖。活动期间每位用户最多可参与60次抽奖。<br>3.用户领取奖品时，参与活动的手机号需处于正常使用状态，如遇号码停机、销户、离网等异常状态导致奖励领取失败，视为自动放弃奖励。<br>4.活动期间奖品随机派发，领完为止。若奖品提前发放完毕，电信有权即时终止活动并下架相关页面，不再另行公告，具体奖品库存以实际发放情况为准。<br>5.活动为以下奖品随机派发：60元话费直降券(消费满300元使用)、20元话费直降券(消费满100元使用)、10元话费直降券(消费满50元使用)、爱奇艺黄金VIP会员周卡、腾讯视频会员周卡、优酷视频会员周卡、5GB全国通用流量。直降券有效期30天，请尽快使用，过期不补。",
              wapOpeningDesc:
                '1.话费直降券：<br>(1）60元话费券单笔消费满300元使用，20元话费券单笔消费满100元使用，10元话费券单笔消费满50元使用，直降券有效期30天，请尽快使用，过期不补。<br>(2）中奖后用户可在“翼支付APP-我的-权益金”进行査看获奖详情。<br>(3）本券为话费权益，需在翼支付APP为北京电信号码充值使用。<br>(4）仅限北京电信手机号码，且翼支付实名及二星及以上用户可使用，可在“翼支付APP-账户-银行卡”中查询或完成快捷银行卡绑定。<br>(5）每笔消费仅可叠加使用权益金，最多叠加10张，权益金不兑现。<br>(6）若发生退款，翼支付将按优惠比例退还用户实际支付的金额、权益金优惠金额。<br>(7）如遇支付困难，可咨询"翼支付官方服务号-我的服务-在线客服"，或拨打中国电信客服10000。<br>2.视频会员周卡：<br>如抽中爱奇艺黄金VIP会员周卡、腾讯视频会员周卡以及优酷视频会员周卡，权益将以会员直充形式自动充值至登录手机号中，礼品会在超过有效期后失效。<br>3.5GB全国通用流量：<br>中奖当月有效，未使用完清零，到期自动失效，失效后剩余流量清零，流量不可结转。流量自动发放，可通过北京电信APP查看发放情况。',
              wapActiveDesc:
                "视频会员周卡、充值满减话费券10-60元、5GB全国通用流量随机",
              wapActiveImage: "",
              webActiveImage: "",
              showDiv: !0,
              isExpanded: !1,
              animationDuration: "1s",
              showGift: !1,
              loginNum: "",
              staffCode: "",
              channelId: "",
              queryOfferName: "",
              offerName: [],
              offerNameObj: {
                满300元减60元话费券: "60<i>元</i>",
                满100元减20元话费券: "20<i>元</i>",
                满50元减10元话费券: "10<i>元</i>",
                爱奇艺黄金VIP会员周卡: "周卡",
                优酷视频会员周卡: "周卡",
                腾讯视频会员周卡: "周卡",
                "5G全国流量": "5<i>GB</i>",
              },
              offerPriceObj: {
                满300元减60元话费券: "满300元可使用",
                满100元减20元话费券: "满100元可使用",
                满50元减10元话费券: "满50元可使用",
                爱奇艺黄金VIP会员周卡: "爱奇艺黄金VIP会员",
                优酷视频会员周卡: "优酷视频会员",
                腾讯视频会员周卡: "腾讯视频会员",
                "5G全国流量": "全国流量",
              },
              rollNum: 0,
            };
          },
          computed: {
            styleObject: function () {
              return {
                transition: "width ".concat(this.animationDuration, " ease"),
                width: this.isExpanded ? "0" : "100%",
              };
            },
            scratchCardStyle: function () {
              var t = this.wapActiveImage || "";
              return t ? { backgroundImage: "url(".concat(t, ")") } : {};
            },
          },
          mounted: function () {
            (this.loginNum = window.loginNum ? window.loginNum + "" : ""),
              (this.channelId = this.$route.query.channelId || ""),
              (this.staffCode = this.$route.query.staffCode || ""),
              "" == this.loginNum
                ? this.$router.push({ path: "/scratchLogon" })
                : (this.loadPreactiveInfo(), this.ruleCheck());
          },
          methods: {
            mergeOfferCounts: function (t, e) {
              var n = {},
                a = Array.isArray(e) ? e : [];
              if (
                (a.forEach(function (t) {
                  if (t && null != t.offerName && "" !== t.offerName) {
                    var e = String(t.offerName).trim();
                    e && (n[e] = Number(t.num) || 0);
                  }
                }),
                t)
              )
                for (var s in t) {
                  var i = t[s],
                    r =
                      i && null != i.offerName
                        ? String(i.offerName).trim()
                        : "";
                  r && (n[r] = (n[r] || 0) + 1);
                }
              return Object.keys(n).map(function (t) {
                return { offerName: t, num: n[t] };
              });
            },
            toggle: function () {
              (this.showDiv = !1), (this.isExpanded = !0);
            },
            loadPreactiveInfo: function () {
              var t = this,
                e = {
                  activeId: "310",
                  channelId: this.channelId,
                  staffCode: this.staffCode,
                };
              Object(o["Ih"])(e)
                .then(function (e) {
                  if (e && e.object) {
                    var n = e.object || {};
                    null != n.wap_warm_tips &&
                      "" !== n.wap_warm_tips &&
                      (t.wapWarmTipsLinkText = n.wap_warm_tips),
                      null != n.web_warm_tips &&
                        "" !== n.web_warm_tips &&
                        (t.webWarmTipsRoute = n.web_warm_tips),
                      n.wap_tariff_desc &&
                        (t.wapTariffDesc = n.wap_tariff_desc),
                      n.wap_opening_desc &&
                        (t.wapOpeningDesc = n.wap_opening_desc),
                      n.wap_active_desc &&
                        (t.wapActiveDesc = n.wap_active_desc),
                      n.wap_active_image &&
                        (t.wapActiveImage = n.wap_active_image),
                      n.web_active_image &&
                        (t.webActiveImage = n.web_active_image);
                  }
                })
                .catch(function () {});
            },
            submit: function () {
              var t = this,
                e = {
                  activeId: "310",
                  channelId: this.channelId,
                  staffCode: this.staffCode,
                };
              this.$toast.loading({ message: "活动火爆，正在为您抽取奖品。" }),
                Object(o["Ic"])(e)
                  .then(function (e) {
                    if ((t.$toast.clear(), "0" == +e.retCode))
                      (t.offerName = t.mergeOfferCounts(e.object, t.offerName)),
                        (t.queryOfferName = e.retMsg),
                        t.toggle(),
                        t.$popup.show({
                          title: "恭喜您",
                          content: "恭喜您获得【".concat(e.retMsg, "】"),
                          callBack: function () {
                            window.location.reload();
                          },
                        });
                    else {
                      if ("105" == e.retCode)
                        return void t.$popup.show({
                          title: "啊哦，领取失败啦！",
                          content: e.retMsg,
                        });
                      if ("101" == e.retCode)
                        return void t.$popup.show({
                          title: "提示",
                          content: t.getWarmPopupHtml(),
                          showCancelButton: !0,
                        });
                      if ("102" == e.retCode)
                        return void t.$popup.show({
                          title: "参与失败",
                          content: e.retMsg,
                        });
                      t.$toast.clear(),
                        e.retMsg.indexOf("未登陆状态") > -1
                          ? ((t.offerName = ""),
                            t.$router.push({ path: "/scratchLogon" }))
                          : t.$popup.show({
                              title: "参与失败",
                              content: e.retMsg,
                            });
                    }
                  })
                  .catch(function (e) {
                    console.log(e), t.$toast.clear();
                  });
            },
            checkNum: function () {
              if (!Array.isArray(this.offerName)) return 0;
              var t = 0;
              for (var e in this.offerName) t += this.offerName[e].num;
              return t;
            },
            buildOfferName: function (t) {
              this.offerName = this.mergeOfferCounts(t.object, []);
            },
            ruleCheck: function () {
              var t = this,
                e = { activeId: "310" };
              this.$toast.loading({ message: "加载中..." }),
                Object(o["P"])(e)
                  .then(function (e) {
                    if ((t.$toast.clear(), "0" == +e.retCode))
                      (t.rollNum = e.retMsg), t.buildOfferName(e);
                    else {
                      if ((t.$toast.clear(), "101" == e.retCode))
                        return (
                          (t.rollNum = 0),
                          t.buildOfferName(e),
                          void t.$popup.show({
                            title: "提示",
                            content: t.getWarmPopupHtml(),
                            showCancelButton: !0,
                          })
                        );
                      if ("106" == e.retCode)
                        return (
                          (t.rollNum = e.retMsg),
                          t.buildOfferName(e),
                          void t.$popup.show({
                            title: "提示",
                            content:
                              "啊哦～今天抽奖次数已达上限，请您明天再来参与活动！",
                          })
                        );
                      if ("107" == e.retCode)
                        return (
                          (t.rollNum = e.retMsg),
                          t.buildOfferName(e),
                          void t.$popup.show({
                            title: "提示",
                            content:
                              "啊哦～本次活动抽奖次数已达上限，感谢您的参与！",
                          })
                        );
                      e.retMsg.indexOf("未登陆状态") > -1
                        ? ((t.offerName = ""),
                          t.$router.push({ path: "/scratchLogon" }))
                        : t.$popup.show({
                            title: "参与失败",
                            content: e.retMsg,
                          });
                    }
                  })
                  .catch(function (e) {
                    console.log(e), t.$toast.clear();
                  });
            },
            showNoChancePopup: function () {
              this.$popup.show({
                title: "提示",
                content: this.getWarmPopupHtml(),
                showCancelButton: !0,
              });
            },
            getWarmPopupHtml: function () {
              var t = "暂无抽奖次数，办理业务可获取抽奖资格。",
                e = (this.wapWarmTipsLinkText || "").trim();
              if (!e) return t;
              var n = this.webWarmTipsRoute;
              return ""
                .concat(t, '<br><a style="color: #0094ff;" href="')
                .concat(n, '">')
                .concat(e, "</a>");
            },
          },
        },
        u = c,
        l = (n("8622"), n("84c2"), n("2877")),
        d = Object(l["a"])(u, a, s, !1, null, "5a1c9ca4", null);
      e["default"] = d.exports;
    },
    ff53: function (t, e, n) {
      !(function (e, n) {
        t.exports = n();
      })("undefined" != typeof self && self, function () {
        return (function (t) {
          function e(a) {
            if (n[a]) return n[a].exports;
            var s = (n[a] = { i: a, l: !1, exports: {} });
            return t[a].call(s.exports, s, s.exports, e), (s.l = !0), s.exports;
          }
          var n = {};
          return (
            (e.m = t),
            (e.c = n),
            (e.d = function (t, n, a) {
              e.o(t, n) ||
                Object.defineProperty(t, n, {
                  configurable: !1,
                  enumerable: !0,
                  get: a,
                });
            }),
            (e.n = function (t) {
              var n =
                t && t.__esModule
                  ? function () {
                      return t.default;
                    }
                  : function () {
                      return t;
                    };
              return e.d(n, "a", n), n;
            }),
            (e.o = function (t, e) {
              return Object.prototype.hasOwnProperty.call(t, e);
            }),
            (e.p = "/dist/"),
            e((e.s = 1))
          );
        })([
          function (t, e, n) {
            "use strict";
            e.a = {
              name: "vueScratchCard",
              data: function () {
                return {
                  supportTouch: !1,
                  events: [],
                  startMoveHandler: null,
                  moveHandler: null,
                  endMoveHandler: null,
                  showLucky: !1,
                  firstTouch: !0,
                };
              },
              props: {
                elementId: { type: String, default: "scratch" },
                width: { type: String, default: "600px" },
                height: { type: String, default: "300px" },
                moveRadius: { type: Number, default: 15 },
                ratio: { type: Number, default: 0.5 },
                startCallback: { type: Function, default: function () {} },
                clearCallback: { type: Function, default: function () {} },
                coverColor: { type: String, default: "#C5C5C5" },
                coverImg: {
                  type: String,
                  default:
                    "https://liquid-games.oss-cn-beijing.aliyuncs.com/single_game_images/entertainment/scratch_card_mask_up.png",
                },
                result: {
                  type: String,
                  default:
                    '<p style="height:100%;width:100%;display:flex;justify-content:center;align-items:center;color:red;font-size:50px;text-align:center;background:#666666;border-radius:12px;"><span>恭喜中奖<span></p>',
                },
              },
              mounted: function () {
                var t = this;
                this.$nextTick(function () {
                  t.init();
                });
              },
              methods: {
                init: function () {
                  if (this.isSupportCanvas()) {
                    var t = document.getElementById(this.elementId);
                    (this.canvas = t.querySelector("#scratchCanvas")),
                      (this.ctx = this.canvas.getContext("2d")),
                      (this.canvas.width = t.clientWidth),
                      (this.canvas.height = t.clientHeight),
                      this.createCanvasStyle(),
                      this.bindEvent();
                  } else alert("当前浏览器不支持canvas");
                },
                isSupportCanvas: function () {
                  var t = document.createElement("canvas");
                  return !(!t.getContext || !t.getContext("2d"));
                },
                createCanvasStyle: function () {
                  var t = this;
                  if (this.coverImg) {
                    var e = new Image();
                    e.setAttribute("crossOrigin", "anonymous"),
                      (e.src = this.coverImg),
                      (e.onload = function () {
                        t.ctx.drawImage(
                          e,
                          0,
                          0,
                          t.canvas.width,
                          t.canvas.height
                        );
                      });
                  } else
                    (t.ctx.fillStyle = t.coverColor),
                      t.ctx.fillRect(0, 0, t.canvas.width, t.canvas.height);
                },
                bindEvent: function () {
                  "ontouchstart" in window && (this.supportTouch = !0),
                    (this.events = this.supportTouch
                      ? ["touchstart", "touchmove", "touchend"]
                      : ["mousedown", "mousemove", "mouseup"]),
                    this.addEvent();
                },
                addEvent: function () {
                  (this.startMoveHandler = this.startEventHandler.bind(this)),
                    this.canvas.addEventListener(
                      this.events[0],
                      this.startMoveHandler,
                      !1
                    );
                },
                startEventHandler: function (t) {
                  t.preventDefault(),
                    this.firstTouch &&
                      (this.startCallback(), (this.firstTouch = !1)),
                    (this.showLucky = !0),
                    (this.moveHandler = this.moveEventHandler.bind(this)),
                    (this.endMoveHandler = this.endEventHandler.bind(this)),
                    this.canvas.addEventListener(
                      this.events[1],
                      this.moveHandler,
                      !1
                    ),
                    document.addEventListener(
                      this.events[2],
                      this.endMoveHandler,
                      !1
                    );
                },
                moveEventHandler: function (t) {
                  t.preventDefault(),
                    (t = this.supportTouch ? t.touches[0] : t);
                  var e = this.canvas.getBoundingClientRect(),
                    n =
                      document.documentElement.scrollTop ||
                      document.body.scrollTop,
                    a =
                      document.documentElement.scrollLeft ||
                      document.body.scrollLeft,
                    s = t.pageX - e.left - a,
                    i = t.pageY - e.top - n;
                  this.ctx.beginPath(),
                    (this.ctx.fillStyle = "#FFFFFF"),
                    (this.ctx.globalCompositeOperation = "destination-out"),
                    this.ctx.arc(s, i, this.moveRadius, 0, 2 * Math.PI),
                    this.ctx.fill();
                },
                endEventHandler: function (t) {
                  t.preventDefault(),
                    this.canvas.removeEventListener(
                      this.events[1],
                      this.moveHandler,
                      !1
                    ),
                    document.removeEventListener(
                      this.events[2],
                      this.endMoveHandler,
                      !1
                    ),
                    (this.endMoveHandler = null),
                    this.caleArea();
                },
                caleArea: function () {
                  var t = this.ctx.getImageData(
                      0,
                      0,
                      this.canvas.width,
                      this.canvas.height
                    ),
                    e = [];
                  t.data.map(function (n, a) {
                    var s = t.data[a + 3];
                    0 === s && e.push(s);
                  }),
                    e.length / t.data.length > this.ratio &&
                      (this.ctx.clearRect(
                        0,
                        0,
                        this.canvas.width,
                        this.canvas.height
                      ),
                      this.canvas.removeEventListener(
                        this.events[0],
                        this.startMoveHandler
                      ),
                      this.canvas.removeEventListener(
                        this.events[1],
                        this.moveHandler,
                        !1
                      ),
                      document.removeEventListener(
                        this.events[2],
                        this.endMoveHandler,
                        !1
                      ),
                      this.clearCallback());
                },
              },
            };
          },
          function (t, e, n) {
            "use strict";
            Object.defineProperty(e, "__esModule", { value: !0 });
            var a = n(2);
            (a.a.install = function (t) {
              return t.component(a.a.name, a.a);
            }),
              (e.default = a.a);
          },
          function (t, e, n) {
            "use strict";
            function a(t) {
              n(3);
            }
            var s = n(0),
              i = n(9),
              r = n(8),
              o = a,
              c = r(s.a, i.a, !1, o, null, null);
            e.a = c.exports;
          },
          function (t, e, n) {
            var a = n(4);
            "string" == typeof a && (a = [[t.i, a, ""]]),
              a.locals && (t.exports = a.locals),
              n(6)("b711abee", a, !0, {});
          },
          function (t, e, n) {
            (e = t.exports = n(5)(!1)),
              e.push([
                t.i,
                "*{padding:0;margin:0}.scratchCard{position:relative;border-radius:.1rem}.scratchCard .result{position:absolute;width:calc(100% - 4px);height:calc(100% - 2px);top:0;left:0;right:0;bottom:0;margin:auto}.scratchCard .pic{width:calc(100% - 2px);height:calc(100% - 2px)}.scratchCard canvas{position:relative;z-index:2;position:absolute;top:0;left:0}",
                "",
              ]);
          },
          function (t, e) {
            function n(t, e) {
              var n = t[1] || "",
                s = t[3];
              if (!s) return n;
              if (e && "function" == typeof btoa) {
                var i = a(s);
                return [n]
                  .concat(
                    s.sources.map(function (t) {
                      return "/*# sourceURL=" + s.sourceRoot + t + " */";
                    })
                  )
                  .concat([i])
                  .join("\n");
              }
              return [n].join("\n");
            }
            function a(t) {
              return (
                "/*# sourceMappingURL=data:application/json;charset=utf-8;base64," +
                btoa(unescape(encodeURIComponent(JSON.stringify(t)))) +
                " */"
              );
            }
            t.exports = function (t) {
              var e = [];
              return (
                (e.toString = function () {
                  return this.map(function (e) {
                    var a = n(e, t);
                    return e[2] ? "@media " + e[2] + "{" + a + "}" : a;
                  }).join("");
                }),
                (e.i = function (t, n) {
                  "string" == typeof t && (t = [[null, t, ""]]);
                  for (var a = {}, s = 0; s < this.length; s++) {
                    var i = this[s][0];
                    "number" == typeof i && (a[i] = !0);
                  }
                  for (s = 0; s < t.length; s++) {
                    var r = t[s];
                    ("number" == typeof r[0] && a[r[0]]) ||
                      (n && !r[2]
                        ? (r[2] = n)
                        : n && (r[2] = "(" + r[2] + ") and (" + n + ")"),
                      e.push(r));
                  }
                }),
                e
              );
            };
          },
          function (t, e, n) {
            function a(t) {
              for (var e = 0; e < t.length; e++) {
                var n = t[e],
                  a = l[n.id];
                if (a) {
                  a.refs++;
                  for (var s = 0; s < a.parts.length; s++)
                    a.parts[s](n.parts[s]);
                  for (; s < n.parts.length; s++) a.parts.push(i(n.parts[s]));
                  a.parts.length > n.parts.length &&
                    (a.parts.length = n.parts.length);
                } else {
                  var r = [];
                  for (s = 0; s < n.parts.length; s++) r.push(i(n.parts[s]));
                  l[n.id] = { id: n.id, refs: 1, parts: r };
                }
              }
            }
            function s() {
              var t = document.createElement("style");
              return (t.type = "text/css"), d.appendChild(t), t;
            }
            function i(t) {
              var e,
                n,
                a = document.querySelector("style[" + g + '~="' + t.id + '"]');
              if (a) {
                if (p) return v;
                a.parentNode.removeChild(a);
              }
              if (w) {
                var i = h++;
                (a = f || (f = s())),
                  (e = r.bind(null, a, i, !1)),
                  (n = r.bind(null, a, i, !0));
              } else
                (a = s()),
                  (e = o.bind(null, a)),
                  (n = function () {
                    a.parentNode.removeChild(a);
                  });
              return (
                e(t),
                function (a) {
                  if (a) {
                    if (
                      a.css === t.css &&
                      a.media === t.media &&
                      a.sourceMap === t.sourceMap
                    )
                      return;
                    e((t = a));
                  } else n();
                }
              );
            }
            function r(t, e, n, a) {
              var s = n ? "" : a.css;
              if (t.styleSheet) t.styleSheet.cssText = b(e, s);
              else {
                var i = document.createTextNode(s),
                  r = t.childNodes;
                r[e] && t.removeChild(r[e]),
                  r.length ? t.insertBefore(i, r[e]) : t.appendChild(i);
              }
            }
            function o(t, e) {
              var n = e.css,
                a = e.media,
                s = e.sourceMap;
              if (
                (a && t.setAttribute("media", a),
                m.ssrId && t.setAttribute(g, e.id),
                s &&
                  ((n += "\n/*# sourceURL=" + s.sources[0] + " */"),
                  (n +=
                    "\n/*# sourceMappingURL=data:application/json;base64," +
                    btoa(unescape(encodeURIComponent(JSON.stringify(s)))) +
                    " */")),
                t.styleSheet)
              )
                t.styleSheet.cssText = n;
              else {
                for (; t.firstChild; ) t.removeChild(t.firstChild);
                t.appendChild(document.createTextNode(n));
              }
            }
            var c = "undefined" != typeof document;
            if ("undefined" != typeof DEBUG && DEBUG && !c)
              throw new Error(
                "vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
              );
            var u = n(7),
              l = {},
              d =
                c &&
                (document.head || document.getElementsByTagName("head")[0]),
              f = null,
              h = 0,
              p = !1,
              v = function () {},
              m = null,
              g = "data-vue-ssr-id",
              w =
                "undefined" != typeof navigator &&
                /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
            t.exports = function (t, e, n, s) {
              (p = n), (m = s || {});
              var i = u(t, e);
              return (
                a(i),
                function (e) {
                  for (var n = [], s = 0; s < i.length; s++) {
                    var r = i[s],
                      o = l[r.id];
                    o.refs--, n.push(o);
                  }
                  e ? ((i = u(t, e)), a(i)) : (i = []);
                  for (s = 0; s < n.length; s++) {
                    o = n[s];
                    if (0 === o.refs) {
                      for (var c = 0; c < o.parts.length; c++) o.parts[c]();
                      delete l[o.id];
                    }
                  }
                }
              );
            };
            var b = (function () {
              var t = [];
              return function (e, n) {
                return (t[e] = n), t.filter(Boolean).join("\n");
              };
            })();
          },
          function (t, e) {
            t.exports = function (t, e) {
              for (var n = [], a = {}, s = 0; s < e.length; s++) {
                var i = e[s],
                  r = i[0],
                  o = i[1],
                  c = i[2],
                  u = i[3],
                  l = { id: t + ":" + s, css: o, media: c, sourceMap: u };
                a[r]
                  ? a[r].parts.push(l)
                  : n.push((a[r] = { id: r, parts: [l] }));
              }
              return n;
            };
          },
          function (t, e) {
            t.exports = function (t, e, n, a, s, i) {
              var r,
                o = (t = t || {}),
                c = typeof t.default;
              ("object" !== c && "function" !== c) ||
                ((r = t), (o = t.default));
              var u,
                l = "function" == typeof o ? o.options : o;
              if (
                (e &&
                  ((l.render = e.render),
                  (l.staticRenderFns = e.staticRenderFns),
                  (l._compiled = !0)),
                n && (l.functional = !0),
                s && (l._scopeId = s),
                i
                  ? ((u = function (t) {
                      (t =
                        t ||
                        (this.$vnode && this.$vnode.ssrContext) ||
                        (this.parent &&
                          this.parent.$vnode &&
                          this.parent.$vnode.ssrContext)),
                        t ||
                          "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                          (t = __VUE_SSR_CONTEXT__),
                        a && a.call(this, t),
                        t &&
                          t._registeredComponents &&
                          t._registeredComponents.add(i);
                    }),
                    (l._ssrRegister = u))
                  : a && (u = a),
                u)
              ) {
                var d = l.functional,
                  f = d ? l.render : l.beforeCreate;
                d
                  ? ((l._injectStyles = u),
                    (l.render = function (t, e) {
                      return u.call(e), f(t, e);
                    }))
                  : (l.beforeCreate = f ? [].concat(f, u) : [u]);
              }
              return { esModule: r, exports: o, options: l };
            };
          },
          function (t, e, n) {
            "use strict";
            var a = function () {
                var t = this,
                  e = t.$createElement,
                  n = t._self._c || e;
                return n(
                  "div",
                  {
                    staticClass: "scratchCard",
                    style: "width:" + t.width + ";height:" + t.height + ";",
                    attrs: { id: t.elementId },
                  },
                  [
                    n(
                      "div",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: t.showLucky,
                            expression: "showLucky",
                          },
                        ],
                        staticClass: "result",
                      },
                      [
                        t._t("result"),
                        t._v(" "),
                        n("div", {
                          staticClass: "pic",
                          domProps: { innerHTML: t._s(t.result) },
                        }),
                      ],
                      2
                    ),
                    t._v(" "),
                    n("canvas", { attrs: { id: "scratchCanvas" } }),
                  ]
                );
              },
              s = [],
              i = { render: a, staticRenderFns: s };
            e.a = i;
          },
        ]);
      });
    },
  },
]);
