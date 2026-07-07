(window.webpackJsonp = window.webpackJsonp || []).push([
  [4],
  {
    492: function (t, e, i) {
      var n = i(506);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("1d926a84", n, !0, {});
    },
    493: function (t, e, i) {
      var n = i(511);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("794d38b6", n, !0, {});
    },
    501: function (t, e, i) {
      var n = i(547);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("46f378c2", n, !0, {});
    },
    502: function (t, e, i) {
      var n = i(549);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("599e74ee", n, !0, {});
    },
    503: function (t, e, i) {
      var n = i(551);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("4fb31e0f", n, !0, {});
    },
    504: function (t, e, i) {
      var n = i(553);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("724f06b2", n, !0, {});
    },
    505: function (t, e, i) {
      "use strict";
      var n = i(492);
      i.n(n).a;
    },
    506: function (t, e, i) {},
    507: function (t, e, i) {
      var n = i(555);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("43f6373e", n, !0, {});
    },
    508: function (t, e, i) {
      var n = i(557);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("406e514f", n, !0, {});
    },
    509: function (t, e, i) {
      var n = i(559);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("2f95060f", n, !0, {});
    },
    510: function (t, e, i) {
      "use strict";
      var n = i(493);
      i.n(n).a;
    },
    511: function (t, e, i) {},
    512: function (t, e, i) {
      var n = i(561);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("0cf9f09c", n, !0, {});
    },
    513: function (t, e, i) {
      var n = i(563);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("5bc16005", n, !0, {});
    },
    514: function (t, e, i) {
      var n = i(565);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("fac3bdca", n, !0, {});
    },
    515: function (t, e, i) {
      var n = i(567);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("380f3ff4", n, !0, {});
    },
    516: function (t, e, i) {
      var n = i(569);
      "string" == typeof n && (n = [[t.i, n, ""]]),
        n.locals && (t.exports = n.locals);
      (0, i(4).default)("76d93208", n, !0, {});
    },
    531: function (t, e, i) {
      "use strict";
      var n = {
          name: "LifeServiceCon",
          props: {
            showLabel: { type: Boolean, default: !0 },
            showAll: { type: Boolean, default: !1 },
            jumpName: { type: String, default: "" },
            jumpUrl: { type: String, default: "" },
            list: {
              default: function () {
                return [];
              },
              type: Array,
            },
          },
          computed: {},
          methods: {},
        },
        s = (i(505), i(6)),
        a = Object(s.a)(
          n,
          function () {
            var t = this,
              e = t.$createElement,
              n = t._self._c || e;
            return n(
              "div",
              { staticClass: "life-service-content" },
              [
                t._l(t.list, function (e, s) {
                  return n(
                    "div",
                    {
                      key: e.id,
                      staticClass: "life-service-item",
                      class: "life-service-item" + (s % 2),
                      on: {
                        click: function (i) {
                          return t.handleItemClick(e);
                        },
                      },
                    },
                    [
                      (e.miniProgram || 8 === e.tag) && t.isSigned
                        ? n(
                            "wx-open-launch-weapp",
                            {
                              staticClass: "wx-open-launch-weapp",
                              attrs: { path: e.path, username: e.appId },
                            },
                            [
                              n(
                                "script",
                                { attrs: { type: "text/wxtag-template" } },
                                [
                                  t._v(
                                    '\n                <style>\n                .terminalSettingsBtn{\n                width: 500px;\n                height: 500px;\n                }\n                </style>\n                <div class="terminalSettingsBtn"></div>\n            '
                                  ),
                                ]
                              ),
                            ]
                          )
                        : t._e(),
                      t._v(" "),
                      n("div", { staticClass: "life-service-item__conwrap" }, [
                        n("div", { staticClass: "life-service-item__imgbox" }, [
                          n("img", {
                            staticClass: "life-service-item__img",
                            attrs: { src: e.bannerUrl },
                          }),
                        ]),
                        t._v(" "),
                        n("div", { staticClass: "life-service-item__con" }, [
                          n("p", { staticClass: "life-service-item__title" }, [
                            t._v(
                              "\n                    " +
                                t._s(e.title) +
                                "\n                "
                            ),
                          ]),
                          t._v(" "),
                          n(
                            "p",
                            { staticClass: "life-service-item__buypoint" },
                            [
                              t._v(
                                "\n                    " +
                                  t._s(e.brief) +
                                  "\n                "
                              ),
                            ]
                          ),
                          t._v(" "),
                          t.showLabel
                            ? n(
                                "p",
                                {
                                  staticClass: "life-service-item__label",
                                  style: {
                                    visibility: e.label ? "inherit" : "hidden",
                                  },
                                },
                                [
                                  t._v(
                                    "\n                    " +
                                      t._s(e.label) +
                                      "\n                "
                                  ),
                                ]
                              )
                            : t._e(),
                        ]),
                      ]),
                      t._v(" "),
                      t._m(0, !0),
                      t._v(" "),
                      e.newShelf
                        ? n("i", { staticClass: "life-service-item__new2" })
                        : t._e(),
                      t._v(" "),
                      n("div", {
                        staticClass: "life-service-item__angle",
                        style: {
                          backgroundImage:
                            "url(" + i(91)("./" + t.pagePicData.angle) + ")",
                        },
                      }),
                    ],
                    1
                  );
                }),
                t._v(" "),
                t.showAll
                  ? n(
                      "div",
                      {
                        staticClass: "life-service-more",
                        on: {
                          click: function (e) {
                            return t.handleItemClick({
                              jumpName: t.jumpName,
                              jumpUrl: t.jumpUrl,
                            });
                          },
                        },
                      },
                      [t._v("查看全部")]
                    )
                  : t._e(),
              ],
              2
            );
          },
          [
            function () {
              var t = this.$createElement,
                e = this._self._c || t;
              return e("div", { staticClass: "life-service-item__descwrap" }, [
                e("div", { staticClass: "life-service-item__desc" }),
                this._v(" "),
                e("div", { staticClass: "life-service-item__btn" }, [
                  this._v("领取"),
                ]),
              ]);
            },
          ],
          !1,
          null,
          null,
          null
        );
      e.a = a.exports;
    },
    532: function (t, e, i) {
      "use strict";
      var n = {
          name: "Countdown",
          replace: !0,
          props: {
            tipText: { type: String, default: "距离开始" },
            tipTextEnd: { type: String, default: "距离结束" },
            id: { type: String, default: "1" },
            type: { type: String, default: "" },
            currentTime: { type: Number, default: new Date().getTime() },
            startTime: { type: Number, default: 0 },
            endTime: { type: Number, default: 0 },
            endText: { type: String, default: "已结束" },
            dayTxt: { type: String, default: "天" },
            hourTxt: { type: String, default: "时" },
            minutesTxt: { type: String, default: "分" },
            secondsTxt: { type: String, default: "秒" },
            secondsFixed: { type: Boolean, default: !1 },
          },
          data: function () {
            return {
              tipShow: !0,
              msTime: { show: !1, day: "", hour: "", minutes: "", seconds: "" },
              start: "",
              end: "",
              current: "",
            };
          },
          watch: {
            currentTime: function () {
              this.init();
            },
          },
          mounted: function () {
            this.init();
          },
          methods: {
            init: function () {
              var t = this;
              (this.start = this.startTime),
                (this.end = this.endTime),
                (this.current = this.currentTime),
                this.end < this.current
                  ? ((this.msTime.show = !1), this.end_message())
                  : this.current < this.start
                  ? (this.$set(this, "tipShow", !0),
                    setTimeout(function () {
                      t.runTime(t.start, t.current, t.start_message);
                    }, 0))
                  : ((this.end > this.current && this.start < this.current) ||
                      this.start === this.current) &&
                    (this.$set(this, "tipShow", !1),
                    (this.msTime.show = !0),
                    setTimeout(function () {
                      t.runTime(t.end, t.current, t.end_message, !0);
                    }, 1));
            },
            runTime: function (t, e, i, n) {
              var s = this,
                a = this.$data.msTime,
                o = t - e;
              o > 0
                ? ((this.msTime.show = !0),
                  (a.day = Math.floor(o / 864e5)),
                  (o -= 864e5 * a.day),
                  (a.hour = Math.floor(o / 36e5)),
                  (o -= 36e5 * a.hour),
                  (a.minutes = Math.floor(o / 6e4)),
                  (o -= 6e4 * a.minutes),
                  (a.seconds = Math.floor(o / 1e3).toFixed(0)),
                  (o -= 1e3 * a.seconds),
                  a.hour < 10 && (a.hour = "0" + a.hour),
                  a.minutes < 10 && (a.minutes = "0" + a.minutes),
                  a.seconds < 10 && (a.seconds = "0" + a.seconds),
                  setTimeout(function () {
                    n
                      ? s.runTime(s.end, (e += 1e3), i, !0)
                      : s.runTime(s.start, (e += 1e3), i);
                  }, 1e3))
                : i();
            },
            start_message: function () {
              var t = this;
              this.$set(this, "tipShow", !1),
                this.$emit("startCallback", this.msTime.show),
                setTimeout(function () {
                  t.runTime(t.end, t.start, t.end_message, !0);
                }, 1);
            },
            end_message: function () {
              (this.msTime.show = !1),
                this.currentTime <= 0 ||
                  this.$emit("end_callback", this.msTime.show);
            },
          },
        },
        s = (i(510), i(6)),
        a = Object(s.a)(
          n,
          function () {
            var t = this,
              e = t.$createElement,
              i = t._self._c || e;
            return i("div", { class: t.type }, [
              t.msTime.show
                ? i("p", [
                    t.msTime.day > 0
                      ? i("span", [
                          i("span", { staticClass: "num" }, [
                            t._v(t._s(t.msTime.day)),
                          ]),
                          i("i", { staticClass: "text" }, [
                            t._v(t._s(t.dayTxt)),
                          ]),
                        ])
                      : t._e(),
                    t._v(" "),
                    i("span", { staticClass: "num" }, [
                      t._v(t._s(t.msTime.hour)),
                    ]),
                    i("i", { staticClass: "text" }, [t._v(t._s(t.hourTxt))]),
                    t._v(" "),
                    i("span", { staticClass: "num" }, [
                      t._v(t._s(t.msTime.minutes)),
                    ]),
                    i("i", { staticClass: "text" }, [t._v(t._s(t.minutesTxt))]),
                    t._v(" "),
                    i("span", { staticClass: "num" }, [
                      t._v(t._s(t.msTime.seconds)),
                    ]),
                    t.secondsTxt
                      ? i("i", { staticClass: "text" }, [
                          t._v(t._s(t.secondsTxt)),
                        ])
                      : t._e(),
                  ])
                : t._e(),
            ]);
          },
          [],
          !1,
          null,
          "eb197d5e",
          null
        );
      e.a = a.exports;
    },
    543: function (t, e, i) {
      var n = {
        "./banner_apply.jpg": 231,
        "./icon_kugou.png": 155,
        "./icon_qqcjhy.png": 156,
        "./icon_qqyyhhlz.png": 157,
        "./icon_txsp.png": 158,
        "./icon_xlwb.png": 159,
        "./icon_zhihu.png": 160,
        "./title.png": 161,
      };
      function s(t) {
        var e = a(t);
        return i(e);
      }
      function a(t) {
        if (!i.o(n, t)) {
          var e = new Error("Cannot find module '" + t + "'");
          throw ((e.code = "MODULE_NOT_FOUND"), e);
        }
        return n[t];
      }
      (s.keys = function () {
        return Object.keys(n);
      }),
        (s.resolve = a),
        (t.exports = s),
        (s.id = 543);
    },
    544: function (t, e) {
      (t.exports = function (t) {
        throw new TypeError('"' + t + '" is read-only');
      }),
        (t.exports.default = t.exports),
        (t.exports.__esModule = !0);
    },
    545: function (t, e, i) {
      var n = {
        "./RightDetail/banner_heijing.png": 150,
        "./RightDetail/banner_weibo.png": 151,
        "./RightDetail/detail_heijing.png": 152,
        "./RightDetail/detail_weibo.png": 153,
        "./RightDetail/icon_sec.png": 154,
        "./angle.png": 164,
        "./apply/applyHeader.png": 165,
        "./apply/avatar.png": 166,
        "./apply/benifit-a.png": 167,
        "./apply/benifit-b.png": 168,
        "./apply/benifit-c.png": 169,
        "./apply/icon-warning.png": 170,
        "./apply/moneyIcon.png": 171,
        "./apply/ok@3x.png": 172,
        "./apply/vipCard.png": 173,
        "./banner_recharge.png": 175,
        "./brandDesc/bg-coupon.png": 176,
        "./brandDesc/icon-add.png": 177,
        "./brandDesc/icon-flag-new.png": 178,
        "./brand_act.png": 179,
        "./close.png": 180,
        "./familyCard/btn.png": 181,
        "./familyCard/card1.png": 182,
        "./familyCard/card2.png": 183,
        "./familyCard/widget.png": 184,
        "./fire.png": 185,
        "./footer.png": 186,
        "./header.png": 187,
        "./header_act.png": 188,
        "./header_bj.png": 189,
        "./header_by.png": 190,
        "./header_hj.png": 191,
        "./header_qc.png": 192,
        "./header_wkhy.png": 193,
        "./icon-敬请期待@2x.png": 194,
        "./icon_arrow.png": 195,
        "./icon_arrow2.png": 196,
        "./icon_arrow3.png": 197,
        "./icon_close.png": 198,
        "./icon_information.png": 199,
        "./icon_lock.png": 200,
        "./icon_more.png": 201,
        "./icon_music.png": 202,
        "./icon_new.png": 203,
        "./icon_new2.png": 204,
        "./icon_num_1.png": 205,
        "./icon_num_2.png": 206,
        "./icon_num_3.png": 207,
        "./icon_update.png": 208,
        "./icon_video.png": 209,
        "./icon_vip.png": 210,
        "./icon_vip_0.png": 211,
        "./icon_vip_1.png": 212,
        "./icon_vip_2.png": 213,
        "./icon_vip_3.png": 214,
        "./icon_vip_4.png": 215,
        "./icon_vip_5.png": 216,
        "./icon_vip_6.png": 217,
        "./icons/icon_jyqyb.png": 218,
        "./icons/icon_kskb.png": 219,
        "./icons/icon_kugou.png": 220,
        "./icons/icon_mobai.png": 221,
        "./icons/icon_qqcjhy.png": 222,
        "./icons/icon_qqhy.png": 223,
        "./icons/icon_qqkj.png": 224,
        "./icons/icon_qqyylz.png": 225,
        "./icons/icon_txsp.png": 226,
        "./icons/icon_weiyun.png": 227,
        "./icons/icon_zhihu.png": 228,
        "./laborDay/banner.png": 229,
        "./n_choose_1.png": 230,
        "./notWK/icon_kugou.png": 155,
        "./notWK/icon_qqcjhy.png": 156,
        "./notWK/icon_qqyyhhlz.png": 157,
        "./notWK/icon_txsp.png": 158,
        "./notWK/icon_xlwb.png": 159,
        "./notWK/icon_zhihu.png": 160,
        "./notWK/title.png": 161,
        "./orderVIP/bg_gift.png": 232,
        "./orderVIP/button.png": 233,
        "./orderVIP/footer.png": 234,
        "./orderVIP/header.png": 235,
        "./orderVIP/icon-¥9.9秒杀@2x.png": 236,
        "./orderVIP/icon-会员折扣购@2x.png": 237,
        "./orderVIP/icon-敬请期待@2x.png": 238,
        "./orderVIP/icon-新品体验@2x.png": 239,
        "./orderVIP/icon-活动特权@2x.png": 240,
        "./orderVIP/icon-生活福利@2x.png": 241,
        "./orderVIP/icon-购机福利@2x.png": 242,
        "./orderVIP/icon_cal.png": 243,
        "./orderVIP/icon_right.png": 244,
        "./orderVIP/privilege_title.png": 245,
        "./orderVIP/privilege_title_fit.png": 246,
        "./orderVIP/券-会员秒杀@2x.png": 247,
        "./orderVIP/券-知乎盐选@2x.png": 248,
        "./orderVIP/券-绿钻@2x.png": 249,
        "./orderVIP/券-腾讯视频@2x.png": 250,
        "./orderVIP/限量尝新-守护功能包@2x.png": 251,
        "./orderVIP/限量尝新-王卡加速宝@2x.png": 252,
        "./phone.png": 253,
        "./qjt.png": 254,
        "./qrcode.png": 92,
        "./sec_kill.png": 255,
        "./super/angle.png": 256,
        "./super/brand_act.png": 257,
        "./super/fire.png": 258,
        "./super/footer.png": 259,
        "./super/header.png": 260,
        "./super/header_act.png": 261,
        "./super/header_nogoto.png": 262,
        "./super/icon_arrow.png": 263,
        "./super/icon_arrow2.png": 264,
        "./super/icon_vip.png": 265,
        "./super/icon_vip_0.png": 266,
        "./super/icon_vip_1.png": 267,
        "./super/icon_vip_2.png": 268,
        "./super/icon_vip_3.png": 269,
        "./super/icon_vip_4.png": 270,
        "./super/icon_vip_5.png": 271,
        "./super/icon_vip_6.png": 272,
        "./super/phone.png": 273,
        "./super/vip.png": 274,
        "./super/vip_act.png": 275,
        "./title_am.png": 276,
        "./title_am_ad.png": 277,
        "./title_pm.png": 278,
        "./title_pm_ad.png": 279,
        "./vip.png": 280,
        "./vip_act.png": 281,
        "./vip_day.png": 282,
        "./wk_qq.png": 283,
        "./yysxh_gq.png": 284,
        "./yysxh_sp.png": 285,
        "./yysxh_vip.png": 286,
      };
      function s(t) {
        var e = a(t);
        return i(e);
      }
      function a(t) {
        if (!i.o(n, t)) {
          var e = new Error("Cannot find module '" + t + "'");
          throw ((e.code = "MODULE_NOT_FOUND"), e);
        }
        return n[t];
      }
      (s.keys = function () {
        return Object.keys(n);
      }),
        (s.resolve = a),
        (t.exports = s),
        (s.id = 545);
    },
    546: function (t, e, i) {
      "use strict";
      var n = i(501);
      i.n(n).a;
    },
    547: function (t, e, i) {},
    548: function (t, e, i) {
      "use strict";
      var n = i(502);
      i.n(n).a;
    },
    549: function (t, e, i) {},
    550: function (t, e, i) {
      "use strict";
      var n = i(503);
      i.n(n).a;
    },
    551: function (t, e, i) {},
    552: function (t, e, i) {
      "use strict";
      var n = i(504);
      i.n(n).a;
    },
    553: function (t, e, i) {},
    554: function (t, e, i) {
      "use strict";
      var n = i(507);
      i.n(n).a;
    },
    555: function (t, e, i) {},
    556: function (t, e, i) {
      "use strict";
      var n = i(508);
      i.n(n).a;
    },
    557: function (t, e, i) {},
    558: function (t, e, i) {
      "use strict";
      var n = i(509);
      i.n(n).a;
    },
    559: function (t, e, i) {},
    560: function (t, e, i) {
      "use strict";
      var n = i(512);
      i.n(n).a;
    },
    561: function (t, e, i) {},
    562: function (t, e, i) {
      "use strict";
      var n = i(513);
      i.n(n).a;
    },
    563: function (t, e, i) {},
    564: function (t, e, i) {
      "use strict";
      var n = i(514);
      i.n(n).a;
    },
    565: function (t, e, i) {},
    566: function (t, e, i) {
      "use strict";
      var n = i(515);
      i.n(n).a;
    },
    567: function (t, e, i) {},
    568: function (t, e, i) {
      "use strict";
      var n = i(516);
      i.n(n).a;
    },
    569: function (t, e, i) {},
    642: function (t, e, i) {
      "use strict";
      i.r(e);
      i(544);
      var n = {
          name: "UserInfo",
          components: { avatar: i(142).a },
          props: {},
          computed: {
            privilegeInfo: function () {
              return this.homePageData.privilegeInfo;
            },
            title: function () {
              var t = "立即绑定";
              return this.isBind && (t = this.vipInfo.phone), t;
            },
            gotoInfo: function () {
              var t = { desc: "", btn: "" };
              return (
                this.isBind
                  ? this.isSigned
                    ? this.isSigned &&
                      (this.isWK ||
                        (t = {
                          desc: "申请王卡，享受海量特权福利",
                          btn: "立即申请",
                        }),
                      2 === this.flowTag &&
                        (t = {
                          desc: "免费升级，月享40GB专属流量特权",
                          btn: "立即升级",
                        }))
                    : ((t = {
                        desc: "加入王卡会员，享王卡会员福利",
                        btn: "立即加入",
                      }),
                      2 === this.flowTag &&
                        (t = {
                          desc: "0元/月，加入王卡会员，升级成40GB流量",
                          btn: "立即加入",
                        }))
                  : (t = { desc: "绑定号码，免费入会", btn: "立即绑定" }),
                t
              );
            },
            styleInfo: function () {
              var t = {};
              return (
                this.inActTime &&
                  (t = { avatar: { border: "1px solid rgba(235,80,29,1)" } }),
                t
              );
            },
          },
          methods: {
            handleClickGoto: function () {
              this.isBind
                ? this.isSigned
                  ? this.isSigned &&
                    (this.isWK
                      ? 2 === this.flowTag
                        ? this.signAgreement()
                        : this.isWKSuperSigned
                        ? (window.location.href = this.linkList.superVip)
                        : (window.location.href = this.linkList.NChooseOne5G)
                      : this.gotoApplyForNotWK())
                  : this.handleItemClick({})
                : this.gotoBind();
            },
            gotoAllPrivilege: function () {
              this.$router.push({
                name: "allPrivilege",
                query: { id: this.privilegeInfo[0].id },
              });
            },
            handleAvatarClick: function () {
              this.$emit("handleAvatarClick");
            },
          },
        },
        s = (i(546), i(6)),
        a = Object(s.a)(
          n,
          function () {
            var t = this,
              e = t.$createElement,
              n = t._self._c || e;
            return n(
              "div",
              {
                staticClass: "user full-bg",
                style: {
                  backgroundImage:
                    "url(" + i(545)("./" + t.pagePicData.header + ".png") + ")",
                },
              },
              [
                n(
                  "div",
                  { staticClass: "user-info" },
                  [
                    n("avatar", {
                      staticClass: "user-info_avatar",
                      style: t.styleInfo.avatar,
                      attrs: { "bg-image": t.vipInfo.headUrl, width: 48 },
                      on: { click: t.handleAvatarClick },
                    }),
                    t._v(" "),
                    t.pagePicData.brand
                      ? n("div", {
                          staticClass: "user-info_brand",
                          style: {
                            backgroundImage:
                              "url(" + i(91)("./" + t.pagePicData.brand) + ")",
                          },
                        })
                      : t._e(),
                    t._v(" "),
                    n("div", { staticClass: "user-info_detail" }, [
                      t.isBind
                        ? n(
                            "div",
                            {
                              staticClass: "user-info_detail__title",
                              style: t.styleInfo.title,
                            },
                            [
                              t._v(
                                "\n                " +
                                  t._s(t.title) +
                                  "\n            "
                              ),
                            ]
                          )
                        : n(
                            "div",
                            {
                              staticClass: "user-info_detail__title",
                              style: t.styleInfo.title,
                              on: { click: t.gotoBind },
                            },
                            [
                              t._v(
                                "\n                " +
                                  t._s(t.title) +
                                  "\n            "
                              ),
                            ]
                          ),
                      t._v(" "),
                      t.isBind && !t.isWK
                        ? n("div", { staticClass: "user-info_detail__nowk" }, [
                            t._v("\n                非王卡\n            "),
                          ])
                        : t._e(),
                    ]),
                    t._v(" "),
                    n(
                      "div",
                      {
                        staticClass: "user-info_rights",
                        on: { click: t.gotoAllPrivilege },
                      },
                      [
                        t._v("\n            查看会员特权"),
                        n("i", {
                          staticClass: "icon-arrow2 full-bg",
                          style: {
                            backgroundImage:
                              "url(" +
                              i(91)("./" + t.pagePicData.iconArrow2) +
                              ")",
                          },
                        }),
                      ]
                    ),
                  ],
                  1
                ),
                t._v(" "),
                t.isSuper
                  ? t._e()
                  : n("div", { staticClass: "user-vip" }, [
                      n("div", { staticClass: "user-vip_detail" }, [
                        n("img", {
                          staticClass: "user-vip_detail__img",
                          attrs: {
                            src: i(91)("./" + t.pagePicData.vip),
                            alt: "",
                          },
                        }),
                      ]),
                      t._v(" "),
                      t.isSigned && t.isWK
                        ? n("div", {
                            staticClass: "user-vip_grade full-bg",
                            style: {
                              backgroundImage:
                                "url(" +
                                i(91)("./" + t.pagePicData.iconVip) +
                                ")",
                            },
                          })
                        : t.isSigned
                        ? t._e()
                        : n("div", { staticClass: "user-vip_nosign" }, [
                            t._v("未加入"),
                          ]),
                    ]),
                t._v(" "),
                !t.isSuper && t.gotoInfo.btn
                  ? n(
                      "div",
                      {
                        staticClass: "user-goto",
                        on: { click: t.handleClickGoto },
                      },
                      [
                        t.isSigned && !t.isWK
                          ? n("div", { staticClass: "user-goto-qq full-bg" })
                          : t._e(),
                        t._v(" "),
                        n("div", { staticClass: "user-goto-desc" }, [
                          t._v(t._s(t.gotoInfo.desc)),
                        ]),
                        t._v(" "),
                        n("div", { staticClass: "user-goto-btn" }, [
                          t._v("\n            " + t._s(t.gotoInfo.btn)),
                          n("i", { staticClass: "icon-arrow3 full-bg" }),
                        ]),
                      ]
                    )
                  : t._e(),
              ]
            );
          },
          [],
          !1,
          null,
          null,
          null
        ).exports,
        o = i(0),
        c = Object(o.b)(),
        r = c.isWeChat,
        l = c.isUnicom,
        u = {
          name: "PrivilegeCon",
          props: {
            data: {
              default: function () {
                return [];
              },
              type: Array,
            },
          },
          computed: {
            showMore: function () {
              return this.data.length % 4 != 0;
            },
          },
          methods: {
            handleItemClick: function (t) {
              if (
                ((t.gotoUrl = ""),
                t.linkUrl && (t.gotoUrl = t.linkUrl),
                t.jumpUrl && (t.gotoUrl = t.jumpUrl),
                t.LINK && (t.gotoUrl = t.LINK),
                !r && t.nonWechatUrl && (t.gotoUrl = t.nonWechatUrl),
                l && t.stUrl && (t.gotoUrl = t.stUrl),
                t.justGo || this.isSigned || this.isSuper)
              )
                switch (t.id) {
                  case 10012:
                  case 10020:
                    this.$router.push({
                      name: "allPrivilege",
                      query: { id: t.id },
                    });
                    break;
                  case 10011:
                    this.$router.push({ name: "allSecKill" });
                    break;
                  case 10001:
                    this.isSuper
                      ? ((t.eventId || t.EVENTID) &&
                          this.clickStat(t.eventId ? t.eventId : t.EVENTID),
                        this.jumpToUrl(t.gotoUrl))
                      : this.$router.push({
                          name: "allPrivilege",
                          query: { id: t.id },
                        });
                    break;
                  default:
                    (t.eventId || t.EVENTID) &&
                      this.clickStat(t.eventId ? t.eventId : t.EVENTID),
                      this.jumpToUrl(t.gotoUrl);
                }
              else
                this.isWK
                  ? this.$router.push({
                      name: "allPrivilege",
                      query: { id: t.id },
                    })
                  : this.isBind
                  ? this.$router.push({
                      name: "allPrivilege",
                      query: { id: t.id },
                    })
                  : this.showBindBox();
            },
          },
        },
        p =
          (i(548),
          Object(s.a)(
            u,
            function () {
              var t = this,
                e = t.$createElement,
                i = t._self._c || e;
              return i("div", { staticClass: "privilege" }, [
                i(
                  "div",
                  {
                    class: [
                      "privilege-content",
                      t.data && t.data.length < 5
                        ? "privilege-content__flex"
                        : "",
                    ],
                  },
                  t._l(t.data, function (e, n) {
                    return i(
                      "div",
                      {
                        key: n,
                        staticClass: "privilege-item",
                        on: {
                          click: function (i) {
                            return t.handleItemClick(e);
                          },
                        },
                      },
                      [
                        i("div", { staticClass: "privilege-item__box" }, [
                          i(
                            "div",
                            {
                              class: [
                                "privilege-item__icon",
                                !t.isWKSuperSigned ||
                                (10008 !== e.id &&
                                  10009 !== e.id &&
                                  10001 !== e.id &&
                                  1e4 !== e.id)
                                  ? ""
                                  : "super-white",
                                10020 === e.id ? "im" : "",
                              ],
                            },
                            [
                              t.isSuper
                                ? i("img", {
                                    staticClass: "privilege-item__img",
                                    attrs: { src: e.superIconUrl },
                                  })
                                : i("img", {
                                    staticClass: "privilege-item__img",
                                    attrs: {
                                      src:
                                        !t.isWKSuperSigned ||
                                        (10008 !== e.id &&
                                          10009 !== e.id &&
                                          10001 !== e.id &&
                                          1e4 !== e.id)
                                          ? e.iconUrl
                                          : e.whiteIconUrl,
                                    },
                                  }),
                              t._v(" "),
                              10020 === e.id && 2 === t.flowTag
                                ? i("div", {
                                    staticClass: "privilege-item__update",
                                  })
                                : t._e(),
                            ]
                          ),
                          t._v(" "),
                          i("div", { staticClass: "privilege-item__txt" }, [
                            i(
                              "p",
                              {
                                staticClass: "privilege-item__name",
                                class:
                                  !t.isWKSuperSigned ||
                                  (10008 !== e.id &&
                                    10009 !== e.id &&
                                    10001 !== e.id &&
                                    1e4 !== e.id)
                                    ? ""
                                    : "super-white",
                              },
                              [
                                t._v(
                                  "\n                        " +
                                    t._s(e.privilegeName) +
                                    "\n                    "
                                ),
                              ]
                            ),
                          ]),
                        ]),
                      ]
                    );
                  }),
                  0
                ),
              ]);
            },
            [],
            !1,
            null,
            null,
            null
          ).exports),
        d = {
          name: "BenifitColumn",
          props: {
            justGo: { type: Boolean, default: !1 },
            type: { type: String, default: "default" },
            iconUrl: { type: String, default: "" },
            name: { type: String, default: "" },
            subName: { type: String, default: "" },
            desc: { type: String, default: "" },
            jumpName: { type: String, default: "" },
            jumpUrl: { type: String, default: "" },
            showAll: { type: Boolean, default: !0 },
            allTxt: { type: String, default: "全部" },
          },
          methods: {
            jumpToAll: function () {
              var t = this.jumpName,
                e = this.jumpUrl;
              "" === e
                ? this.$router.push({ name: t })
                : (window.location.href = e);
            },
          },
        },
        m =
          (i(550),
          Object(s.a)(
            d,
            function () {
              var t = this,
                e = t.$createElement,
                i = t._self._c || e;
              return i(
                "div",
                { staticClass: "benifit-column", class: t.type },
                [
                  i("div", { staticClass: "benifit-column-head" }, [
                    i("div", { staticClass: "benifit-column-head__left" }, [
                      i("p", { staticClass: "benifit-column-head__name" }, [
                        t._v(
                          "\n                " + t._s(t.name) + "\n            "
                        ),
                      ]),
                      t._v(" "),
                      t.subName
                        ? i(
                            "p",
                            { staticClass: "benifit-column-head__subname" },
                            [
                              t._v(
                                "\n                " +
                                  t._s(t.subName) +
                                  "\n            "
                              ),
                            ]
                          )
                        : t._e(),
                      t._v(" "),
                      t.iconUrl
                        ? i("i", {
                            staticClass: "benifit-column-head__icon full-bg",
                            style: {
                              backgroundImage: "url('" + t.iconUrl + "')",
                            },
                          })
                        : t._e(),
                    ]),
                    t._v(" "),
                    t.showAll
                      ? i(
                          "div",
                          { staticClass: "benifit-column-head__right" },
                          [
                            i(
                              "div",
                              {
                                staticClass: "benifit-column-head__all",
                                on: {
                                  click: function (e) {
                                    return t.handleItemClick({
                                      jumpUrl: t.jumpUrl,
                                      jumpName: t.jumpName,
                                      justGo: t.justGo,
                                    });
                                  },
                                },
                              },
                              [
                                i(
                                  "span",
                                  {
                                    staticClass: "benifit-column-head__alltxt",
                                  },
                                  [t._v(t._s(t.allTxt))]
                                ),
                                t._v(" "),
                                i("icon-arrow"),
                              ],
                              1
                            ),
                          ]
                        )
                      : t._e(),
                  ]),
                  t._v(" "),
                  t._t("default"),
                ],
                2
              );
            },
            [],
            !1,
            null,
            null,
            null
          ).exports),
        _ = {
          props: {
            justGo: { type: Boolean, default: !1 },
            jumpName: { type: String, default: "" },
            jumpUrl: { type: String, default: "" },
            showMore: { type: Boolean, default: !0 },
          },
          data: function () {
            return {};
          },
          computed: {},
          mounted: function () {},
          methods: {
            jumpToAll: function () {
              var t = this.jumpName,
                e = this.jumpUrl;
              "" === e
                ? this.$router.push({ name: t })
                : (window.location.href = e);
            },
          },
        },
        g =
          (i(552),
          Object(s.a)(
            _,
            function () {
              var t = this,
                e = t.$createElement,
                i = t._self._c || e;
              return i("div", { staticClass: "swipe-right-list" }, [
                i("div", { staticClass: "swipe-right-list-box" }, [
                  i(
                    "div",
                    { staticClass: "swipe-right-list-content" },
                    [
                      t._t("default"),
                      t._v(" "),
                      t.showMore
                        ? i(
                            "div",
                            {
                              staticClass: "more",
                              on: {
                                click: function (e) {
                                  return t.handleItemClick({
                                    jumpUrl: t.jumpUrl,
                                    jumpName: t.jumpName,
                                    justGo: t.justGo,
                                  });
                                },
                              },
                            },
                            [t._v("更多")]
                          )
                        : t._e(),
                    ],
                    2
                  ),
                ]),
              ]);
            },
            [],
            !1,
            null,
            null,
            null
          ).exports),
        h = i(531),
        v = {
          name: "ProductExperienceCon",
          props: {
            showAll: { type: Boolean, default: !1 },
            jumpName: { type: String, default: "" },
            jumpUrl: { type: String, default: "" },
            list: {
              default: function () {
                return [];
              },
              type: Array,
            },
          },
          computed: {},
          methods: {},
        },
        f =
          (i(554),
          Object(s.a)(
            v,
            function () {
              var t = this,
                e = t.$createElement,
                i = t._self._c || e;
              return i(
                "div",
                { staticClass: "product-experience-content" },
                [
                  t._l(t.list, function (e) {
                    return i(
                      "div",
                      {
                        key: e.iconUrl,
                        staticClass: "product-experience-item",
                        on: {
                          click: function (i) {
                            return t.handleItemClick(e, "productExperience");
                          },
                        },
                      },
                      [
                        i(
                          "div",
                          { staticClass: "product-experience-item__imgbox" },
                          [
                            i("img", {
                              staticClass: "product-experience-item__img",
                              attrs: { src: e.iconUrl },
                            }),
                          ]
                        ),
                        t._v(" "),
                        i(
                          "div",
                          { staticClass: "product-experience-item__con" },
                          [
                            i(
                              "p",
                              { staticClass: "product-experience-item__name" },
                              [
                                t._v(
                                  "\n                " +
                                    t._s(e.name) +
                                    "\n            "
                                ),
                              ]
                            ),
                            t._v(" "),
                            i(
                              "p",
                              {
                                staticClass:
                                  "product-experience-item__buypoint",
                              },
                              [
                                t._v(
                                  "\n                " +
                                    t._s(e.point) +
                                    "\n            "
                                ),
                              ]
                            ),
                          ]
                        ),
                      ]
                    );
                  }),
                  t._v(" "),
                  t.showAll
                    ? i(
                        "div",
                        {
                          staticClass: "product-experience-more",
                          on: {
                            click: function (e) {
                              return t.handleItemClick({
                                jumpUrl: t.jumpUrl,
                                jumpName: t.jumpName,
                              });
                            },
                          },
                        },
                        [t._v("查看全部")]
                      )
                    : t._e(),
                ],
                2
              );
            },
            [],
            !1,
            null,
            null,
            null
          ).exports),
        C = {
          name: "DiscountCon",
          props: {
            jumpUrl: { type: String, default: "" },
            data: {
              default: function () {
                return [];
              },
              type: Array,
            },
          },
          data: function () {
            return { num1: 3, num2: 4 };
          },
          computed: {
            showMore: function () {
              return this.data.length % 3 != 0;
            },
            list1: function () {
              return this.data.slice(0, this.num1);
            },
            list2: function () {
              return this.data.slice(this.num1, this.num1 + this.num2);
            },
          },
          methods: {},
        },
        w =
          (i(556),
          Object(s.a)(
            C,
            function () {
              var t = this,
                e = t.$createElement,
                i = t._self._c || e;
              return i("div", { staticClass: "tencent-discount-content" }, [
                t.isWK
                  ? i("div", { staticClass: "tencent-discount-title" }, [
                      i(
                        "span",
                        { staticClass: "tencent-discount-title__txt" },
                        [t._v("会员折扣")]
                      ),
                    ])
                  : t._e(),
                t._v(" "),
                i(
                  "div",
                  { staticClass: "tencent-discount-list" },
                  t._l(t.list1, function (e, n) {
                    return i(
                      "div",
                      {
                        key: n,
                        staticClass: "tencent-discount-item",
                        on: {
                          click: function (i) {
                            return t.handleItemClick(e);
                          },
                        },
                      },
                      [
                        i(
                          "div",
                          { staticClass: "tencent-discount-item__box" },
                          [
                            i("img", {
                              staticClass: "tencent-discount-item__img",
                              attrs: { src: e.picUrl },
                            }),
                            t._v(" "),
                            i(
                              "p",
                              { staticClass: "tencent-discount-item__name" },
                              [t._v(t._s(e.name))]
                            ),
                            t._v(" "),
                            i(
                              "div",
                              { staticClass: "tencent-discount-item__prices" },
                              [
                                i(
                                  "div",
                                  {
                                    staticClass: "tencent-discount-item__price",
                                  },
                                  [
                                    t._v(
                                      t._s(t.isSuper ? e.superPrice : e.price)
                                    ),
                                  ]
                                ),
                                t._v(" "),
                                i(
                                  "div",
                                  {
                                    staticClass:
                                      "tencent-discount-item__offprice",
                                  },
                                  [
                                    t._v(
                                      t._s(
                                        t.isSuper ? e.superOffPrice : e.offPrice
                                      )
                                    ),
                                  ]
                                ),
                              ]
                            ),
                          ]
                        ),
                      ]
                    );
                  }),
                  0
                ),
                t._v(" "),
                i(
                  "div",
                  {
                    staticClass: "tencent-discount-more",
                    on: {
                      click: function (e) {
                        return t.handleItemClick({
                          jumpUrl: t.jumpUrl,
                          justGo: !0,
                        });
                      },
                    },
                  },
                  [
                    i(
                      "div",
                      { staticClass: "tencent-discount-more__icons" },
                      t._l(t.list2, function (t, e) {
                        return i(
                          "div",
                          {
                            key: e,
                            staticClass: "tencent-discount-more__icon",
                          },
                          [
                            i("img", {
                              staticClass: "tencent-discount-more__img",
                              attrs: { src: t.picUrl },
                            }),
                          ]
                        );
                      }),
                      0
                    ),
                    t._v(" "),
                    i("div", { staticClass: "tencent-discount-more__txt" }, [
                      t._v("更多省钱会员"),
                    ]),
                    t._v(" "),
                    i("icon-arrow"),
                  ],
                  1
                ),
              ]);
            },
            [],
            !1,
            null,
            null,
            null
          ).exports),
        b = i(10),
        x = {
          name: "HotRecommend",
          props: {
            data: {
              default: function () {
                return [];
              },
              type: Array,
            },
          },
          computed: {
            showMore: function () {
              return this.data.length % 3 != 0;
            },
          },
          methods: {
            handleHotClick: function (t) {
              var e = this;
              this.isSigned && 2 === t.showDuration
                ? b.a.clickhot(t.id).then(function (i) {
                    "0" === i.code
                      ? e.handleItemClick(t)
                      : e.$dialog({ content: i.message });
                  })
                : this.handleItemClick(t);
            },
          },
        },
        y =
          (i(558),
          Object(s.a)(
            x,
            function () {
              var t = this,
                e = t.$createElement,
                n = t._self._c || e;
              return n("div", { staticClass: "hot-recommend" }, [
                n("i", {
                  staticClass: "hot-recommend-fire",
                  style: {
                    backgroundImage:
                      "url(" + i(91)("./" + t.pagePicData.fire) + ")",
                  },
                }),
                t._v(" "),
                t._m(0),
                t._v(" "),
                n(
                  "div",
                  { staticClass: "hot-recommend-content" },
                  t._l(t.data, function (e, i) {
                    return n(
                      "div",
                      { key: e.id, staticClass: "hot-recommend-item" },
                      [
                        n("wk-click-area", {
                          attrs: { "item-data": e, index: i },
                        }),
                        t._v(" "),
                        n("div", {
                          staticClass: "hot-recommend-item__num fullbg",
                          class: "hot-recommend-item__num" + (i + 1),
                        }),
                        t._v(" "),
                        n("div", { staticClass: "hot-recommend-item__box" }, [
                          n("img", {
                            staticClass: "hot-recommend-item__img",
                            attrs: { src: e.imageUrl },
                          }),
                          t._v(" "),
                          n("p", { staticClass: "hot-recommend-item__name" }, [
                            t._v(t._s(e.text)),
                          ]),
                          t._v(" "),
                          n(
                            "p",
                            { staticClass: "hot-recommend-item__feature" },
                            [t._v(t._s(e.text1))]
                          ),
                        ]),
                      ],
                      1
                    );
                  }),
                  0
                ),
              ]);
            },
            [
              function () {
                var t = this.$createElement,
                  e = this._self._c || t;
                return e("div", { staticClass: "hot-recommend-title-wrap" }, [
                  e("div", { staticClass: "hot-recommend-title" }, [
                    this._v("热门关注榜"),
                  ]),
                  this._v(" "),
                  e("div", { staticClass: "hot-recommend-subtitle" }, [
                    this._v("#聚焦上周人气权益"),
                  ]),
                ]);
              },
            ],
            !1,
            null,
            null,
            null
          ).exports),
        k = i(144),
        I = i(21),
        T = i.n(I),
        S = {
          name: "SecKill",
          components: { countdown: i(532).a },
          data: function () {
            return {
              curTime: Date.now(),
              swiperOption: {
                autoplay: { disableOnInteraction: !1, delay: 3e3 },
                speed: 500,
                slidesPerView: 2,
                loop: !0,
              },
            };
          },
          computed: {
            actData: function () {
              var t = {
                  state: 0,
                  descTxt: "",
                  countTime1: 0,
                  countTime2: 0,
                  nextDescTxt: "",
                  nextList: [],
                  actList: [],
                },
                e = new Date(this.curTime).getDate(),
                i = this.seckillProductList[0][0].welfareSeckillTime,
                n = this.seckillProductList[1][0].welfareSeckillTime,
                s = i - this.curTime,
                a = new Date(n).getDate(),
                c = T()(this.seckillProductList, 2);
              return (
                (t.actList = c[0]),
                (t.nextList = c[1]),
                (t.nextDescTxt = ""
                  .concat(e === a ? "今日" : "明日")
                  .concat(Object(o.e)(n, "hh:mm"))),
                (t.actList = t.actList.slice(0, 2)),
                (t.nextList = t.nextList.slice(0, 2)),
                s > 0
                  ? ((t.descTxt = "距离".concat(
                      Object(o.e)(i, "hh:mm"),
                      "场开始时间"
                    )),
                    (t.countTime1 = s),
                    (t.countTime2 = 0))
                  : Math.abs(s) < this.secKillDuration &&
                    ((t.descTxt = "距离".concat(
                      Object(o.e)(i, "hh:mm"),
                      "场结束时间"
                    )),
                    (t.countTime1 = 0),
                    (t.countTime2 = this.secKillDuration + i - this.curTime)),
                t
              );
            },
          },
          methods: {
            countdownCallback: function () {
              this.curTime = Date.now();
            },
            countdownEndCallback: function () {
              this.updateSeckillProductList();
            },
          },
        },
        j =
          (i(560),
          i(562),
          Object(s.a)(
            S,
            function () {
              var t = this,
                e = t.$createElement,
                i = t._self._c || e;
              return i(
                "div",
                {
                  staticClass: "sec-kill",
                  on: {
                    click: function (e) {
                      return t.handleItemClick({
                        jumpName: "allSecKill",
                        eventId: "12992c21d04640c5a93c27f0d23ded8e",
                      });
                    },
                  },
                },
                [
                  i("div", { staticClass: "sec-kill-first" }, [
                    i("div", { staticClass: "sec-kill-txt-wrap" }, [
                      i("div", { staticClass: "sec-kill-title" }, [
                        t._v("会员秒杀"),
                      ]),
                      t._v(" "),
                      i("div", { staticClass: "sec-kill-desc" }, [
                        t._v(
                          "\n                " +
                            t._s(t.actData.descTxt) +
                            "\n            "
                        ),
                      ]),
                      t._v(" "),
                      i(
                        "div",
                        { staticClass: "sec-kill-countdown" },
                        [
                          t.updatingSec
                            ? t._e()
                            : i("countdown", {
                                attrs: {
                                  "hour-txt": ":",
                                  "minutes-txt": ":",
                                  "seconds-txt": "",
                                  type: "default",
                                  "current-time": t.curTime,
                                  "start-time":
                                    t.actData.actList[0].welfareSeckillTime,
                                  "end-time":
                                    t.actData.actList[0].welfareSeckillTime +
                                    t.secKillDuration,
                                },
                                on: {
                                  startCallback: t.countdownCallback,
                                  end_callback: t.countdownEndCallback,
                                },
                              }),
                        ],
                        1
                      ),
                    ]),
                    t._v(" "),
                    i(
                      "div",
                      { staticClass: "sec-kill-vip-wrap" },
                      t._l(t.actData.actList, function (e, n) {
                        return i(
                          "div",
                          { key: n, staticClass: "sec-kill-icon-wrap" },
                          [
                            i("img", {
                              staticClass: "sec-kill-icon",
                              attrs: { src: e.icon },
                            }),
                            t._v(" "),
                            i("div", { staticClass: "sec-kill-price-wrap" }, [
                              i("div", { staticClass: "sec-kill-price" }, [
                                t._v("￥" + t._s(e.welfareSeckillPrice / 100)),
                              ]),
                              t._v(" "),
                              i(
                                "div",
                                {
                                  staticClass:
                                    "sec-kill-price__tag zoom-infinite",
                                },
                                [t._v("抢")]
                              ),
                            ]),
                          ]
                        );
                      }),
                      0
                    ),
                  ]),
                  t._v(" "),
                  i("div", { staticClass: "sec-kill-next" }, [
                    i("div", { staticClass: "sec-kill-next__txt" }, [
                      t._v(
                        "预告：下一场会员秒杀 " + t._s(t.actData.nextDescTxt)
                      ),
                    ]),
                    t._v(" "),
                    i(
                      "div",
                      { staticClass: "sec-kill-next__icons" },
                      t._l(t.actData.nextList, function (t, e) {
                        return i("img", {
                          key: e,
                          staticClass: "sec-kill-next__icon",
                          attrs: { src: t.icon },
                        });
                      }),
                      0
                    ),
                  ]),
                ]
              );
            },
            [],
            !1,
            null,
            "e6ca1468",
            null
          ).exports),
        P = {
          data: function () {
            return {};
          },
          mounted: function () {},
          methods: {},
        },
        D =
          (i(564),
          Object(s.a)(
            P,
            function () {
              var t = this,
                e = t.$createElement,
                i = t._self._c || e;
              return i(
                "div",
                { staticClass: "center widgetWrapper" },
                t._l(t.widgetList, function (e, n) {
                  return i(
                    "div",
                    {
                      key: n,
                      staticClass: "widget active",
                      style: { backgroundImage: "url(" + e.imgUrl + ")" },
                      on: {
                        click: function (i) {
                          return t.handleItemClick(e);
                        },
                      },
                    },
                    [
                      e.miniProgram || 2 === e.gotoType
                        ? i(
                            "wx-open-launch-weapp",
                            {
                              staticClass: "wx-open-launch-weapp",
                              attrs: {
                                path: e.path || e.minaPagePath,
                                username: e.appId || e.minaAppId,
                              },
                            },
                            [
                              i(
                                "script",
                                { attrs: { type: "text/wxtag-template" } },
                                [
                                  t._v(
                                    '\n                <style>\n                .terminalSettingsBtn{\n                width: 500px;\n                height: 500px;\n                }\n                </style>\n                <div class="terminalSettingsBtn"></div>\n            '
                                  ),
                                ]
                              ),
                            ]
                          )
                        : t._e(),
                    ],
                    1
                  );
                }),
                0
              );
            },
            [],
            !1,
            null,
            "05cc1692",
            null
          ).exports),
        U = {
          name: "HomeDialog",
          components: {},
          props: {},
          data: function () {
            return { showClose: !0, listenMaskClick: !1 };
          },
          computed: {
            banner: function () {
              var t = this.$store.state.bannerList3;
              return (t && t[0]) || {};
            },
          },
          mounted: function () {},
          methods: {
            close: function () {
              this.$emit("close"), o.a.beforeClose();
            },
            maskClick: function () {
              this.listenMaskClick && this.close();
            },
            clickGrid: function (t) {
              window.location.href = t.link;
            },
          },
        },
        E =
          (i(566),
          Object(s.a)(
            U,
            function () {
              var t = this,
                e = t.$createElement,
                i = t._self._c || e;
              return i("transition", { attrs: { name: "home-dialog" } }, [
                i("div", { attrs: { id: "home-dialog" } }, [
                  i("div", {
                    staticClass: "home-dialog-mask",
                    on: { click: t.maskClick },
                  }),
                  t._v(" "),
                  i("div", { staticClass: "home-dialog-contentBox" }, [
                    t.banner.miniProgram
                      ? i(
                          "section",
                          [
                            i(
                              "wx-open-launch-weapp",
                              {
                                staticClass: "wx-open-launch-weapp",
                                attrs: {
                                  id: "launch-btn",
                                  username: t.banner.appId,
                                  path: t.banner.path,
                                  "env-version": "release",
                                },
                              },
                              [
                                i(
                                  "script",
                                  { attrs: { type: "text/wxtag-template" } },
                                  [
                                    t._v(
                                      '\n                        <style>\n                        .terminalSettingsBtn{\n                        width: 500px;\n                        height: 500px;\n                        }\n                        </style>\n                        <div class="terminalSettingsBtn"></div>\n                    '
                                    ),
                                  ]
                                ),
                              ]
                            ),
                            t._v(" "),
                            i("img", {
                              staticClass: "bannerImg",
                              attrs: {
                                src: t.banner.imgUrl,
                                alt: "",
                                srcset: "",
                              },
                            }),
                          ],
                          1
                        )
                      : i(
                          "section",
                          {
                            on: {
                              click: function (e) {
                                return t.clickGrid(t.banner);
                              },
                            },
                          },
                          [
                            i("img", {
                              staticClass: "bannerImg",
                              attrs: {
                                src: t.banner.imgUrl,
                                alt: "",
                                srcset: "",
                              },
                            }),
                          ]
                        ),
                    t._v(" "),
                    t.showClose
                      ? i("i", {
                          staticClass: "close-btn",
                          on: { click: t.close },
                        })
                      : t._e(),
                  ]),
                ]),
              ]);
            },
            [],
            !1,
            null,
            "24bd4215",
            null
          ).exports),
        L = Object(o.b)(),
        N = L.isWeChat,
        K = L.isUnicom,
        V = {
          components: {
            homeDialog: E,
            discountCon: w,
            hotRecommendCon: y,
            secKill: j,
            "wk-widget": D,
            userInfo: a,
            "privilege-con": p,
            "benifit-column": m,
            "swipe-right-list": g,
            "life-service-con": h.a,
            "product-experience-con": f,
            "wk-footer": k.a,
          },
          data: function () {
            return {
              showHomeDialog: !1,
              showChooseVip: !1,
              lifeItemNum: 6,
              vipExamList: [
                {
                  icon: "icon_txsp.png",
                  name: "腾讯视频VIP",
                  desc: "限量秒杀",
                },
                {
                  icon: "icon_qqyyhhlz.png",
                  name: "绿钻豪华版",
                  desc: "限量秒杀",
                },
                { icon: "icon_xlwb.png", name: "微博会员", desc: "限量秒杀" },
                {
                  icon: "icon_qqcjhy.png",
                  name: "QQ超级会员",
                  desc: "限量秒杀",
                },
              ],
            };
          },
          computed: {
            privilegeInfo: function () {
              return this.homePageData.privilegeInfo;
            },
            actions: function () {
              return (1 !== this.vipInfo.cardTag &&
                0 !== this.vipInfo.cardTag) ||
                !this.vipInfo.signed
                ? [{ name: "加入王卡会员" }]
                : [{ name: "退订王卡会员", subname: this.vipInfo.expiredTime }];
            },
            bannerList: function () {
              var t = this.$store.state.bannerList;
              return (
                t.forEach(function (t) {
                  t.justGo = !0;
                }),
                t || []
              );
            },
            pmpList1: function () {
              var t = this.$store.state.pmpList1;
              return (
                t.forEach(function (t) {
                  t.justGo = !0;
                }),
                t || []
              );
            },
            bannerList2: function () {
              var t = this.$store.state.bannerList2;
              return (
                t.forEach(function (t) {
                  t.justGo = !0;
                }),
                t || []
              );
            },
            hotRecommend: function () {
              var t = this.$store.state.hotList;
              return (
                t.forEach(function (t) {
                  t.justGo = !0;
                }),
                t ? t.slice(0, 3) : []
              );
            },
            productExperience: function () {
              return this.homePageData.productExperience;
            },
            tencentDiscount: function () {
              return (
                this.homePageData.contentRecommendation.tencentDiscount.forEach(
                  function (t) {
                    t.justGo = !0;
                  }
                ),
                this.homePageData.contentRecommendation.tencentDiscount
              );
            },
            mobileDiscount: function () {
              return this.homePageData.contentRecommendation.mobileDiscount;
            },
            lifeServiceInners: function () {
              return this.interestsList
                .filter(function (t) {
                  return t.type && t.type.indexOf("3") > -1;
                })
                .slice(0, this.lifeItemNum);
            },
            gotoUrlData: function () {
              var t = "".concat(
                  window.location.origin,
                  "/KCard/wxCommon/goto?state=PREFERENTIAL_VIP_LISTPAGE"
                ),
                e = "".concat(
                  window.location.origin,
                  "/KCard/wxCommon/goto?state=WX_KCARD_KINDS_PHONE"
                );
              return (
                N ||
                  ((e = "".concat(
                    window.location.origin,
                    "/KCard/wxCommon/goto_direct?state=WX_KCARD_KINDS_PHONE"
                  )),
                  (t = "".concat(
                    window.location.origin,
                    "/KCard/wxCommon/goto_direct?state=PREFERENTIAL_VIP_LISTPAGE"
                  ))),
                K &&
                  ((e =
                    "https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://txwk.10010.com/KCard/wxCommon/goto_direct?state=WX_KCARD_KINDS_PHONE"),
                  (t =
                    "https://m.client.10010.com/mobileService/openPlatform/openPlatLine.htm?to_url=https://txwk.10010.com/KCard/wxCommon/goto_direct?state=PREFERENTIAL_VIP_LISTPAGE")),
                { phone: e, tencent: t }
              );
            },
          },
          mounted: function () {
            this.showHomeDialog = !0;
          },
          methods: {
            closeHomeDialog: function () {
              this.showHomeDialog = !1;
            },
            handleAvatarClick: function () {
              (1 !== this.vipInfo.cardTag && 0 !== this.vipInfo.cardTag) ||
                (this.showChooseVip = !0);
            },
            onSelect: function () {
              (1 !== this.vipInfo.cardTag && 0 !== this.vipInfo.cardTag) ||
              !this.vipInfo.signed
                ? ((this.showChooseVip = !1),
                  this.showKcVIPApplyFor("applyFor"))
                : this.showUnsubscribeBox();
            },
            onCancel: function () {},
            showUnsubscribeBox: function () {
              var t = this;
              this.$dialog({
                showTitle: !0,
                title: "温馨提示",
                content:
                  "退订王卡会员（0元/月）后，您将无法享受会员秒杀5折起、领免费礼包等特权，建议您继续保留尊贵身份～",
                mode: "confirm",
                cancelText: "残忍退订",
                confirmText: "我再看看",
                listenMaskClick: !0,
                target: document.body,
              })
                .then(function () {
                  t.showChooseVip = !1;
                })
                .catch(function () {
                  t.unsubscribeAgreement();
                });
            },
            unsubscribeAgreement: function () {
              var t = this;
              b.a.unsubscribeAgreement().then(function (e) {
                var i = e.code,
                  n = e.message;
                "0" === i
                  ? ((t.showChooseVip = !1),
                    t.getHomeData(),
                    t.$toast({ content: "退订成功" }))
                  : t.showAlert({ content: n, time: 600 });
              });
            },
          },
        },
        $ =
          (i(568),
          Object(s.a)(
            V,
            function () {
              var t = this,
                e = t.$createElement,
                n = t._self._c || e;
              return n(
                "div",
                { staticClass: "home" },
                [
                  n("user-info", {
                    on: { handleAvatarClick: t.handleAvatarClick },
                  }),
                  t._v(" "),
                  n("privilege-con", { attrs: { data: t.privilegeInfo } }),
                  t._v(" "),
                  t.bannerList2 && t.bannerList2.length > 0
                    ? n(
                        "div",
                        { staticClass: "bannerBig" },
                        [
                          n(
                            "swipe-right-list",
                            {
                              staticClass: "bannerBig-content",
                              attrs: { "show-more": !1 },
                            },
                            t._l(t.bannerList2, function (e, i) {
                              return n(
                                "a",
                                {
                                  key: i,
                                  staticClass: "bannerBig-item",
                                  on: {
                                    click: function (i) {
                                      return t.handleItemClick(e);
                                    },
                                  },
                                },
                                [
                                  n(
                                    "div",
                                    {
                                      staticClass: "bannerBig-box",
                                      on: {
                                        click: function (i) {
                                          return t.handleItemClick(e);
                                        },
                                      },
                                    },
                                    [
                                      e.miniProgram
                                        ? n(
                                            "wx-open-launch-weapp",
                                            {
                                              staticClass:
                                                "wx-open-launch-weapp",
                                              attrs: {
                                                path: e.path,
                                                username: e.appId,
                                              },
                                            },
                                            [
                                              n(
                                                "script",
                                                {
                                                  attrs: {
                                                    type: "text/wxtag-template",
                                                  },
                                                },
                                                [
                                                  t._v(
                                                    '\n                            <style>\n                            .terminalSettingsBtn{\n                            width: 500px;\n                            height: 500px;\n                            }\n                            </style>\n                            <div class="terminalSettingsBtn"></div>\n                        '
                                                  ),
                                                ]
                                              ),
                                            ]
                                          )
                                        : t._e(),
                                      t._v(" "),
                                      n("img", {
                                        class: [
                                          "bannerBig-item__img",
                                          1 === t.bannerList2.length
                                            ? "full"
                                            : "",
                                        ],
                                        attrs: { src: e.imgUrl },
                                      }),
                                    ],
                                    1
                                  ),
                                ]
                              );
                            }),
                            0
                          ),
                        ],
                        1
                      )
                    : t._e(),
                  t._v(" "),
                  n(
                    "van-swipe",
                    {
                      staticClass: "banner",
                      attrs: { autoplay: 3e3, duration: 1e3 },
                    },
                    t._l(t.pmpList1, function (e, i) {
                      return n(
                        "van-swipe-item",
                        { key: i, staticClass: "banner-item" },
                        [
                          n(
                            "div",
                            { staticClass: "banner__box" },
                            [
                              n("wk-click-area", {
                                attrs: { itemData: e, index: i },
                              }),
                              t._v(" "),
                              n("img", {
                                staticClass: "banner-item__img",
                                attrs: { src: e.imageUrl },
                              }),
                            ],
                            1
                          ),
                        ]
                      );
                    }),
                    1
                  ),
                  t._v(" "),
                  t.hotRecommend && t.hotRecommend.length > 0
                    ? n("hot-recommend-con", {
                        attrs: { data: t.hotRecommend },
                      })
                    : t._e(),
                  t._v(" "),
                  n(
                    "benifit-column",
                    {
                      staticClass: "tencent-discount",
                      attrs: {
                        name: "会员折扣购",
                        "just-go": !0,
                        "jump-url": t.gotoUrlData.tencent,
                        "show-all": !1,
                      },
                    },
                    [
                      !t.isSignedNotWK &&
                      t.seckillProductList &&
                      t.seckillProductList.length > 0
                        ? n("sec-kill", {
                            staticClass: "tencent-discount-sec-kill",
                          })
                        : t._e(),
                      t._v(" "),
                      n("discount-con", {
                        attrs: {
                          "jump-url": t.gotoUrlData.tencent,
                          data: t.tencentDiscount,
                        },
                      }),
                    ],
                    1
                  ),
                  t._v(" "),
                  t.isSignedNotWK
                    ? t._e()
                    : n(
                        "benifit-column",
                        {
                          staticClass: "product-experience",
                          attrs: { name: "特惠业务", "show-all": !1 },
                        },
                        [
                          n("product-experience-con", {
                            attrs: {
                              "show-all": !1,
                              list: t.productExperience,
                            },
                          }),
                        ],
                        1
                      ),
                  t._v(" "),
                  t.vipInfo.luckyBag
                    ? t.lifeServiceInners && t.lifeServiceInners.length > 0
                      ? n(
                          "benifit-column",
                          {
                            staticClass: "life-service",
                            attrs: {
                              name: "领生活好券",
                              type: "noBg",
                              "show-all": !0,
                              "jump-url": "#/allLifeService",
                            },
                          },
                          [
                            n("life-service-con", {
                              attrs: {
                                "show-all": !1,
                                list: t.lifeServiceInners,
                              },
                            }),
                          ],
                          1
                        )
                      : t._e()
                    : n(
                        "benifit-column",
                        {
                          staticClass: "vip-bag",
                          attrs: { name: "会员福袋", "show-all": !1 },
                        },
                        [
                          n(
                            "div",
                            {
                              staticClass: "vip-bag-wrap",
                              on: {
                                click: function (e) {
                                  return t.openLuckyBag("1");
                                },
                              },
                            },
                            [
                              n("img", {
                                staticClass: "vip-bag-pic",
                                attrs: { src: i(174), alt: "会员福袋" },
                              }),
                            ]
                          ),
                        ]
                      ),
                  t._v(" "),
                  t.isSignedNotWK
                    ? n(
                        "div",
                        { staticClass: "for-not-wk" },
                        [
                          t._m(0),
                          t._v(" "),
                          n("div", {
                            staticClass: "banner-apply full-bg",
                            on: { click: t.gotoApplyForNotWK },
                          }),
                          t._v(" "),
                          n(
                            "benifit-column",
                            { attrs: { name: "热门会员秒杀", "show-all": !1 } },
                            [
                              n("div", { staticClass: "vip-exam-wrap" }, [
                                n(
                                  "ul",
                                  { staticClass: "vip-exam-list" },
                                  t._l(t.vipExamList, function (e) {
                                    return n(
                                      "li",
                                      {
                                        key: e.name,
                                        staticClass: "item",
                                        on: { click: t.handleClickVipExam },
                                      },
                                      [
                                        n("div", {
                                          staticClass: "icon full-bg",
                                          style: {
                                            backgroundImage:
                                              "url(" +
                                              i(543)("./" + e.icon) +
                                              ")",
                                          },
                                        }),
                                        t._v(" "),
                                        n("div", { staticClass: "con-wrap" }, [
                                          n("div", { staticClass: "name" }, [
                                            t._v(t._s(e.name)),
                                          ]),
                                        ]),
                                      ]
                                    );
                                  }),
                                  0
                                ),
                                t._v(" "),
                                n(
                                  "div",
                                  {
                                    staticClass: "more",
                                    on: { click: t.handleClickVipExam },
                                  },
                                  [
                                    t._v(
                                      "\n                    更多会员秒杀资格>>\n                "
                                    ),
                                  ]
                                ),
                              ]),
                            ]
                          ),
                          t._v(" "),
                          n(
                            "benifit-column",
                            {
                              staticClass: "product-experience",
                              attrs: { name: "王卡特惠业务", "show-all": !1 },
                            },
                            [
                              n(
                                "div",
                                { staticClass: "product-experience-wrap" },
                                [
                                  n("product-experience-con", {
                                    attrs: {
                                      "show-all": !1,
                                      list: t.productExperience,
                                    },
                                  }),
                                  t._v(" "),
                                  n(
                                    "div",
                                    {
                                      staticClass: "more",
                                      on: {
                                        click: t.handleClickProductExperience,
                                      },
                                    },
                                    [
                                      t._v(
                                        "\n                    更多特惠业务资格>>\n                "
                                      ),
                                    ]
                                  ),
                                ],
                                1
                              ),
                            ]
                          ),
                        ],
                        1
                      )
                    : t._e(),
                  t._v(" "),
                  n("wk-footer"),
                  t._v(" "),
                  n("van-action-sheet", {
                    attrs: {
                      round: !1,
                      actions: t.actions,
                      "cancel-text": "取消",
                    },
                    on: { select: t.onSelect, cancel: t.onCancel },
                    model: {
                      value: t.showChooseVip,
                      callback: function (e) {
                        t.showChooseVip = e;
                      },
                      expression: "showChooseVip",
                    },
                  }),
                  t._v(" "),
                  n("wk-widget"),
                  t._v(" "),
                  t.$store.state.bannerList3 &&
                  t.$store.state.bannerList3.length > 0 &&
                  t.showHomeDialog
                    ? n("homeDialog", { on: { close: t.closeHomeDialog } })
                    : t._e(),
                ],
                1
              );
            },
            [
              function () {
                var t = this.$createElement,
                  e = this._self._c || t;
                return e("div", { staticClass: "title" }, [
                  e("div", { staticClass: "title-img full-bg" }, [
                    this._v("申请王卡 享以下更多福利"),
                  ]),
                ]);
              },
            ],
            !1,
            null,
            null,
            null
          ));
      e.default = $.exports;
    },
  },
]);
