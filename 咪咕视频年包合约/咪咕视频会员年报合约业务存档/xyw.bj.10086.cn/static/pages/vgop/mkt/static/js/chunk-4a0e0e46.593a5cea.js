(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-4a0e0e46"],
  {
    "0da0": function (e, t, i) {
      e.exports = i.p + "static/img/sure.3d1f6cb0.png";
    },
    "11e9": function (e, t, i) {
      var o = i("b041b");
      (t = e.exports = i("2350")(!1)),
        t.push([
          e.i,
          ".container[data-v-279b864c]{width:100%;position:relative;background-image:url(" +
            o(i("cefd")) +
            ");background-size:100% 100%;height:26.4rem;overflow:hidden;box-sizing:border-box}.container .once-order[data-v-279b864c]{width:2.66667rem;margin-top:8.85333rem;margin-left:6.4rem}.container .phone-bg[data-v-279b864c]{padding:.13333rem .26667rem;font-size:.26667rem;background:hsla(0,0%,100%,.7);border-top-left-radius:.4rem;border-bottom-left-radius:.4rem;color:brown;top:.4rem;position:absolute;right:0;z-index:1}.container .phone-bg span[data-v-279b864c]:nth-child(2){text-decoration:underline;margin-left:.13333rem}.container .ruleTxt[data-v-279b864c]{width:8.53333rem;margin-left:.72rem;margin-top:8.77333rem;z-index:1;font-size:.37333rem;line-height:.66667rem;position:relative;text-align:justify;height:4.8rem;overflow:scroll}.confirm-order[data-v-279b864c]{width:9.33333rem;height:-moz-fit-content;height:fit-content;background-image:url(" +
            o(i("3c22")) +
            ");background-repeat:no-repeat;background-size:100% 100%;padding:1.46667rem .66667rem .66667rem;font-size:.37333rem;color:#fff4d9}.confirm-order .confirm-phone[data-v-279b864c]{font-weight:700;font-size:.48rem;text-align:center;margin:.26667rem 0}.confirm-order .confirm-input[data-v-279b864c]{height:1.28rem;padding:.02667rem;position:relative;font-size:.37333rem;font-weight:700;color:#755500;border:.05333rem solid #c64e3b;background-size:100% 100%;background-color:#fff;box-sizing:border-box;border-radius:.26667rem;overflow:hidden}.confirm-order .confirm-input input[data-v-279b864c]{width:100%;outline:none;border:none;height:100%;padding-left:.4rem;box-sizing:border-box}.confirm-order .confirm-input input[data-v-279b864c]:-ms-input-placeholder{color:#755500}.confirm-order .confirm-input input[data-v-279b864c]::placeholder{color:#755500}.confirm-order .confirm-input>span[data-v-279b864c]{position:absolute;width:2.66667rem;z-index:2;height:100%;right:.26667rem;top:.21333rem;text-align:center;border-radius:.8rem;height:.85333rem;line-height:.8rem;color:#c64e3b}.confirm-order .confirm-btn[data-v-279b864c]{display:-ms-flexbox;display:flex;margin-top:.48rem;-ms-flex-pack:justify;justify-content:space-between}.confirm-order .confirm-btn img[data-v-279b864c]{width:3.2rem;height:100%}.success-modal[data-v-279b864c]{width:9.33333rem;height:-moz-fit-content;height:fit-content;padding:1.46667rem .53333rem .53333rem;background-image:url(" +
            o(i("a4a0")) +
            ");background-size:100% 100%;text-align:center}.success-modal .tips-s[data-v-279b864c]{width:100%;min-height:3.2rem;font-size:.53333rem;color:#fff4db;font-weight:700;line-height:1.5em;-ms-flex-pack:center;justify-content:center;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;white-space:pre-wrap}.success-modal img[data-v-279b864c]{width:4rem}.b-scale[data-v-279b864c]{animation:btnScale-data-v-279b864c 1s linear infinite}@keyframes btnScale-data-v-279b864c{0%{transform:scale(1)}50%{transform:scale(.9)}to{transform:scale(1)}}",
          "",
        ]);
    },
    "2b6f": function (e, t, i) {
      e.exports = i.p + "static/img/btn.3f03ddb3.gif";
    },
    "3ae5": function (e, t, i) {
      "use strict";
      var o = i("5530"),
        n = i("3835"),
        r = i("b775"),
        a = {
          getMarketStatus: "POST /s/marketInfo/getMarketStatus",
          getCrmOrderStatus: "POST /s/crmApiLog/getCrmOrderStatus",
        },
        c = function (e) {
          var t = e,
            i = e.split(" "),
            a = Object(n["a"])(i, 3),
            c = a[0],
            s = a[1],
            d = a[2],
            l = void 0 === d ? "" : d;
          return (
            s ? (t = s) : (c = "GET"),
            function (e) {
              return Object(r["a"])(
                { url: t, data: Object(o["a"])({}, e), method: c },
                l
              );
            }
          );
        },
        s = {};
      for (var d in a) s[d] = c(a[d]);
      t["a"] = s;
    },
    "3c22": function (e, t, i) {
      e.exports = i.p + "static/img/confirmbg.14f44e33.png";
    },
    "3c98": function (e, t, i) {
      (t = e.exports = i("2350")(!1)),
        t.push([
          e.i,
          ".confirm-once p{margin:.05333rem 0}.confirm-once span{font-weight:700}.confirm-once .confirm-detail{background-color:#b6744d;color:#fff4d9;border:.05333rem solid #fff4d9;border-radius:.4rem;box-sizing:border-box;padding:.13333rem .26667rem;height:4rem;overflow-y:scroll}",
          "",
        ]);
    },
    "45cc": function (e, t, i) {
      var o = i("11e9");
      o.__esModule && (o = o.default),
        "string" === typeof o && (o = [[e.i, o, ""]]),
        o.locals && (e.exports = o.locals);
      var n = i("499e").default;
      n("d068f678", o, !0, {});
    },
    "52dd": function (e, t, i) {
      e.exports = i.p + "static/img/cancel.373ff568.png";
    },
    "61f7": function (e, t, i) {
      "use strict";
      i.d(t, "a", function () {
        return o;
      });
      i("ac1f"), i("00b4"), i("498a");
      function o(e) {
        var t = /^0?1[3|4|5|6|7|8|9][0-9]\d{8}$/;
        return !!t.test(e);
      }
    },
    "6bae": function (e, t, i) {
      "use strict";
      i.d(t, "a", function () {
        return r;
      });
      var o = i("3ae5"),
        n = o["a"].getMarketStatus,
        r = {
          methods: {
            marketStatus: function (e, t, i) {
              n({ mktCode: e, channelCode: t }).then(function (e) {
                e &&
                  200 == e.code &&
                  (localStorage.setItem(
                    "useCaptchaDirectly",
                    e.obj.useCaptchaDirectly || 2
                  ),
                  i(e));
              });
            },
          },
        };
    },
    7998: function (e, t, i) {
      "use strict";
      var o = i("5530"),
        n = i("3835"),
        r = i("b775"),
        a = {
          sendOrderConfirmVerifyCode:
            "POST /s/orderConfirm/sendOrderConfirmVerifyCode",
          getProductInfo: "POST /s/productInfo/getProductInfo",
          sendFlowVerifyCode: "POST /s/flowVerify/sendFlowVerifyCode",
        },
        c = function (e) {
          var t = e,
            i = e.split(" "),
            a = Object(n["a"])(i, 3),
            c = a[0],
            s = a[1],
            d = a[2],
            l = void 0 === d ? "" : d;
          return (
            s ? (t = s) : (c = "GET"),
            function (e) {
              return Object(r["a"])(
                { url: t, data: Object(o["a"])({}, e), method: c },
                l
              );
            }
          );
        },
        s = {};
      for (var d in a) s[d] = c(a[d]);
      t["a"] = s;
    },
    "7f95": function (e, t, i) {
      e.exports = i.p + "static/img/confirm.d9c00ad8.png";
    },
    a4a0: function (e, t, i) {
      e.exports = i.p + "static/img/s-bg.ff76a2bf.png";
    },
    b041b: function (e, t) {
      e.exports = function (e) {
        return "string" !== typeof e
          ? e
          : (/^['"].*['"]$/.test(e) && (e = e.slice(1, -1)),
            /["'() \t\n]/.test(e)
              ? '"' + e.replace(/"/g, '\\"').replace(/\n/g, "\\n") + '"'
              : e);
      };
    },
    b0e2: function (e, t, i) {
      var o = i("3c98");
      o.__esModule && (o = o.default),
        "string" === typeof o && (o = [[e.i, o, ""]]),
        o.locals && (e.exports = o.locals);
      var n = i("499e").default;
      n("120a8ae8", o, !0, {});
    },
    cefd: function (e, t, i) {
      e.exports = i.p + "static/img/bg.ed7e8508.jpg";
    },
    d45c: function (e, t, i) {
      "use strict";
      i.d(t, "a", function () {
        return c;
      });
      i("e7e5");
      var o = i("d399"),
        n = i("7998"),
        r = n["a"].sendOrderConfirmVerifyCode,
        a = n["a"].sendFlowVerifyCode,
        c = {
          components: { Toast: o["a"] },
          data: function () {
            return { clickFlag: !1 };
          },
          methods: {
            getYzmFun: function (e) {
              var t = this;
              60 == this.num &&
                (this.clickFlag ||
                  ((this.clickFlag = !0),
                  r({
                    productCode: this.productCode,
                    mktCode: e,
                    channelCode: localStorage.getItem("c"),
                  })
                    .then(function (e) {
                      200 == e.code
                        ? (Object(o["a"])("短信发送成功"),
                          (t.timer = setInterval(t.get, 1e3)),
                          setTimeout(function () {
                            t.clickFlag = !1;
                          }, 1100))
                        : 201 == e.code
                        ? (Object(o["a"])("非北京移动手机号码"),
                          (t.clickFlag = !1))
                        : 202 == e.code
                        ? (Object(o["a"])("发送间隔少于60s"),
                          (t.clickFlag = !1))
                        : 203 == e.code
                        ? (Object(o["a"])("同一IP一分钟只能发一条短信"),
                          (t.clickFlag = !1))
                        : 204 == e.code
                        ? (Object(o["a"])("超过当天最大发送量"),
                          (t.clickFlag = !1))
                        : (Object(o["a"])(e.msg), (t.clickFlag = !1));
                    })
                    .catch(function () {
                      t.clickFlag = !1;
                    })));
            },
            getYzmFlow: function () {
              var e = this;
              60 == this.num &&
                (this.clickFlag ||
                  ((this.clickFlag = !0),
                  a({
                    usePrizeId: this.usePrizeId,
                    channelCode: localStorage.getItem("c"),
                    mktCode: this.mktCode,
                  })
                    .then(function (t) {
                      200 == t.code
                        ? (Object(o["a"])("短信发送成功"),
                          (e.timer = setInterval(e.get, 1e3)),
                          setTimeout(function () {
                            e.clickFlag = !1;
                          }, 1100))
                        : 201 == t.code
                        ? (Object(o["a"])("非北京移动手机号码"),
                          (e.clickFlag = !1))
                        : 202 == t.code
                        ? (Object(o["a"])("发送间隔少于60s"),
                          (e.clickFlag = !1))
                        : 203 == t.code
                        ? (Object(o["a"])("同一IP一分钟只能发一条短信"),
                          (e.clickFlag = !1))
                        : 204 == t.code
                        ? (Object(o["a"])("超过当天最大发送量"),
                          (e.clickFlag = !1))
                        : (Object(o["a"])(t.msg), (e.clickFlag = !1));
                    })
                    .catch(function () {
                      e.clickFlag = !1;
                    })));
            },
            get: function () {
              this.num--,
                (this.sendVerifyText = this.num + "s后再发送"),
                0 == this.num &&
                  ((this.num = 60),
                  (this.sendVerifyText = "获取验证码"),
                  clearInterval(this.timer),
                  (this.timer = null));
            },
          },
        };
    },
    ff95: function (e, t, i) {
      "use strict";
      i.r(t);
      i("e7e5");
      var o = i("d399"),
        n = (i("ac1f"), i("5319"), i("2964")),
        r = i("3a5e"),
        a = i("231d"),
        c = i("d45c"),
        s = i("6f6b"),
        d = i("6bae"),
        l = i("f8b7"),
        f = l["a"].getProductInfo,
        m = l["a"].getMarketProInfo,
        u = l["a"].marketOrder,
        g = {
          data: function () {
            return {
              isShowConfirm: !1,
              isShowChange: !1,
              isShowLoading: !1,
              isResult: !1,
              isLogin: !1,
              phone: "",
              buttonColor: "brown",
              verifyCode: "",
              sendVerifyText: "获取验证码",
              num: 60,
              resultTitle: "",
              resultMsg: "",
              isInvalid: !1,
              mktCode: "17a230e954bd28443c5dcdbaacaa8158",
              ruleTxt: "",
              confirmTxt: "",
              productCode: "f98e0730ee990b2b32553e8c571286f9",
              isARPU: !1,
              errMsg: "活动已下线",
              pageCode: "40037504236102b839b417e30cd9891e",
            };
          },
          components: { BindPhone: n["a"], Loading: r["a"], Toast: o["a"] },
          mixins: [
            a["g"],
            a["f"],
            a["d"],
            a["a"],
            a["c"],
            a["e"],
            a["b"],
            c["a"],
            d["a"],
          ],
          mounted: function () {
            this.marketStatus(
              this.mktCode,
              localStorage.getItem("c"),
              this.marketStatusCallback
            );
          },
          methods: {
            toConfirm: function () {
              var e = this;
              this.isLogin
                ? ((this.isShowLoading = !0),
                  m({
                    productCode: this.productCode,
                    mktCode: this.mktCode,
                  }).then(function (t) {
                    (e.isShowLoading = !1),
                      200 == t.code
                        ? ((e.confirmTxt = t.obj.full_descr),
                          (e.isShowConfirm = !0))
                        : Object(o["a"])("获取产品信息失败");
                  }))
                : this.changePhone();
            },
            orderProduct: function () {
              var e = this;
              if (!this.verifyCode) return Object(o["a"])("请输入验证码"), !1;
              (this.isShowLoading = !0),
                u({
                  mktCode: this.mktCode,
                  productCode: this.productCode,
                  verifyCode: this.verifyCode,
                })
                  .then(function (t) {
                    (e.isShowLoading = !1),
                      e.confirmReset(),
                      200 == t.code
                        ? ("false" != t.obj.result
                            ? ((e.resultTitle = "订购成功！"),
                              (e.resultMsg = "恭喜您，订购成功！"))
                            : ((e.resultTitle = "订购失败！"),
                              (e.resultMsg = t.obj.descr)),
                          (e.isResult = !0))
                        : 210 == t.code
                        ? Object(o["a"])("验证码错误")
                        : ((e.resultTitle = "订购失败！"),
                          (e.resultMsg = t.msg || "订购失败！"),
                          (e.isResult = !0));
                  })
                  .catch(function () {
                    e.$toast("系统繁忙，请稍后再试"), (e.isShowLoading = !1);
                  });
            },
            confirmReset: function () {
              (this.verifyCode = ""),
                (this.sendVerifyText = "获取验证码"),
                (this.num = 60),
                clearInterval(this.timer),
                (this.timer = null),
                (this.isShowConfirm = !1);
            },
            marketStatusCallback: function (e) {
              200 == e.code &&
                (1 == e.obj.status
                  ? (localStorage.setItem("pg", this.pageCode),
                    Object(s["a"])(this.pageCode, localStorage.getItem("c")),
                    this.verifyLogin(),
                    this.getDesc())
                  : window.location.replace(""));
            },
            getYzm: function () {
              this.getYzmFun(this.mktCode);
            },
            getDesc: function () {
              var e = this;
              f({
                channelCode: localStorage.getItem("c"),
                productCode: this.productCode,
              }).then(function (t) {
                200 == t.code && (e.ruleTxt = t.obj[0].descr);
              });
            },
          },
        },
        h = function () {
          var e = this,
            t = e.$createElement,
            o = e._self._c || t;
          return o(
            "div",
            { staticClass: "container" },
            [
              o(
                "div",
                { staticClass: "phone-bg", on: { click: e.changePhone } },
                [
                  o("span", [
                    e._v(e._s(e._f("hidePhone")(e.phone || "未登录"))),
                  ]),
                  e._v(" "),
                  e.phone ? o("span", [e._v(" 切换")]) : e._e(),
                ]
              ),
              e._v(" "),
              o("img", {
                staticClass: "once-order",
                attrs: { src: i("2b6f"), alt: "" },
                on: { click: e.toConfirm },
              }),
              e._v(" "),
              o("div", {
                staticClass: "ruleTxt",
                domProps: { innerHTML: e._s(e.ruleTxt) },
              }),
              e._v(" "),
              o(
                "van-overlay",
                { attrs: { show: e.isShowConfirm, "lock-scroll": !1 } },
                [
                  o(
                    "div",
                    { staticClass: "center confirm-order confirm-once" },
                    [
                      o("p", [
                        o("span", [e._v("手机号码：")]),
                        e._v(e._s(e._f("hidePhone")(e.phone))),
                      ]),
                      e._v(" "),
                      o("div", { domProps: { innerHTML: e._s(e.confirmTxt) } }),
                      e._v(" "),
                      o("div", { staticClass: "confirm-phone" }, [
                        e._v(e._s(e._f("hidePhone")(e.phone))),
                      ]),
                      e._v(" "),
                      o("div", { staticClass: "confirm-input" }, [
                        o("input", {
                          directives: [
                            {
                              name: "model",
                              rawName: "v-model",
                              value: e.verifyCode,
                              expression: "verifyCode",
                            },
                          ],
                          attrs: {
                            type: "text",
                            placeholder: "请输入验证码",
                            maxlength: "6",
                          },
                          domProps: { value: e.verifyCode },
                          on: {
                            input: function (t) {
                              t.target.composing ||
                                (e.verifyCode = t.target.value);
                            },
                          },
                        }),
                        e._v(" "),
                        o("span", { on: { click: e.getYzm } }, [
                          e._v(e._s(e.sendVerifyText)),
                        ]),
                      ]),
                      e._v(" "),
                      o("div", { staticClass: "confirm-btn" }, [
                        o("img", {
                          attrs: { src: i("52dd"), alt: "" },
                          on: { click: e.confirmReset },
                        }),
                        e._v(" "),
                        o("img", {
                          attrs: { src: i("7f95"), alt: "" },
                          on: { click: e.publicOrderProduct },
                        }),
                      ]),
                    ]
                  ),
                ]
              ),
              e._v(" "),
              o("van-overlay", { attrs: { show: e.isResult } }, [
                o("div", { staticClass: "center success-modal" }, [
                  o("div", { staticClass: "tips-s" }, [
                    e._v(e._s(e.resultMsg)),
                  ]),
                  e._v(" "),
                  o("img", {
                    attrs: { src: i("0da0"), alt: "" },
                    on: {
                      click: function (t) {
                        e.isResult = !1;
                      },
                    },
                  }),
                ]),
              ]),
              e._v(" "),
              e.isInvalid
                ? o("div", { staticClass: "invalidBox" }, [
                    o("div", { staticClass: "cover" }),
                    e._v(" "),
                    o("div", { staticClass: "txt" }, [e._v(e._s(e.errMsg))]),
                  ])
                : e._e(),
              e._v(" "),
              e.isARPU
                ? o("div", { staticClass: "invalidBox" }, [
                    o("div", { staticClass: "cover" }),
                    e._v(" "),
                    e._m(0),
                  ])
                : e._e(),
              e._v(" "),
              e.isShowChange
                ? o("BindPhone", {
                    ref: "bindphone",
                    attrs: {
                      buttonColor: e.buttonColor,
                      mktCode: e.mktCode,
                      pageCode: e.pageCode,
                      isShowChange: e.isShowChange,
                      isLogin: e.isLogin,
                    },
                    on: { hideChange: e.hideChange, changeData: e.changeData },
                  })
                : e._e(),
              e._v(" "),
              e.isShowLoading ? o("Loading") : e._e(),
            ],
            1
          );
        },
        b = [
          function () {
            var e = this,
              t = e.$createElement,
              i = e._self._c || t;
            return i("div", { staticClass: "txt" }, [
              e._v("您不在本活动的受邀范围内"),
              i("br"),
              e._v("详见活动规则"),
            ]);
          },
        ],
        p = i("2455");
      function v(e) {
        i("45cc"), i("b0e2");
      }
      var C = !1,
        k = v,
        x = "data-v-279b864c",
        w = null,
        _ = Object(p["a"])(g, h, b, C, k, x, w);
      t["default"] = _.exports;
    },
  },
]);
