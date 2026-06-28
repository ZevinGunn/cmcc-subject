(window["webpackJsonp"] = window["webpackJsonp"] || []).push([
  ["chunk-b0083200"],
  {
    "0dcb": function (e, t, n) {
      "use strict";
      n("11b7");
    },
    "11b7": function (e, t, n) {},
    "1aa7": function (e, t, n) {
      "use strict";
      n("5e00");
    },
    "5e00": function (e, t, n) {},
    "6d8b": function (e, t, n) {
      e.exports = n.p + "static/img/xkloing.51a96927.png";
    },
    8802: function (e, t, n) {
      e.exports = n.p + "static/img/scrat-login.6d0fc94f.png";
    },
    a6b3: function (e, t, n) {
      "use strict";
      var a = function () {
          var e = this,
            t = e.$createElement,
            n = e._self._c || t;
          return n("div", { staticClass: "content" }, [
            n(
              "section",
              { staticClass: "page-main", staticStyle: { height: "100%" } },
              [
                n(
                  "div",
                  {
                    staticClass: "configBody StarCardLogon",
                    class: e.paddingNone ? "pd-0" : "",
                  },
                  [
                    n("img", {
                      attrs: {
                        src: e.backgroundImg,
                        width: "100%",
                        height: "auto",
                      },
                    }),
                  ]
                ),
                n(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: e.onceLogin,
                        expression: "onceLogin",
                      },
                    ],
                    staticClass: "activityBox pdb-10",
                    staticStyle: { "padding-top": "5.2rem" },
                  },
                  [
                    n(
                      "div",
                      {
                        staticClass: "ui-row pd-30",
                        staticStyle: { position: "relative", top: "0.5rem" },
                      },
                      [
                        n(
                          "div",
                          { staticClass: "ui-panel bor-rad40 tc pd-40" },
                          [
                            n(
                              "p",
                              { staticClass: "fs-48 color-333 font-dinal" },
                              [e._v(e._s(e.phoneNo))]
                            ),
                            n(
                              "div",
                              { staticClass: "ui-row pdt-40 pdb-40" },
                              [
                                n(
                                  "van-button",
                                  {
                                    staticClass:
                                      "ui-payBtn btn-size-xl color-white fs-32",
                                    attrs: { block: "", color: "#4672FF" },
                                    on: {
                                      click: function (t) {
                                        return e.goToPasswrodFreeLogin(
                                          "S17320"
                                        );
                                      },
                                    },
                                  },
                                  [e._v("本机号码一键登录")]
                                ),
                              ],
                              1
                            ),
                            n(
                              "div",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: e.skipLogin,
                                    expression: "skipLogin",
                                  },
                                ],
                              },
                              [
                                n(
                                  "p",
                                  {
                                    staticClass: "fs-28",
                                    staticStyle: { color: "rgb(70, 121, 255)" },
                                    on: {
                                      click: function (t) {
                                        return e.skipThisCallback();
                                      },
                                    },
                                  },
                                  [e._v(" 跳过登录 ")]
                                ),
                              ]
                            ),
                            n(
                              "div",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: e.toOtherLoginPage,
                                    expression: "toOtherLoginPage",
                                  },
                                ],
                              },
                              [
                                n(
                                  "p",
                                  {
                                    staticClass: "fs-28",
                                    staticStyle: { color: "rgb(70, 121, 255)" },
                                    on: {
                                      click: function (t) {
                                        return e.toLoginPage();
                                      },
                                    },
                                  },
                                  [e._v(" 使用其他方式登录 ")]
                                ),
                              ]
                            ),
                            n(
                              "div",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: e.phoneSMS,
                                    expression: "phoneSMS",
                                  },
                                ],
                              },
                              [
                                n(
                                  "p",
                                  { staticClass: "color-999 fs-24 pdb-40" },
                                  [e._v("—— 其他登录方式 ——")]
                                ),
                                n(
                                  "p",
                                  {
                                    staticClass: "fs-28",
                                    staticStyle: { color: "rgb(70, 121, 255)" },
                                    on: {
                                      click: function (t) {
                                        return e.updateMethodLogin();
                                      },
                                    },
                                  },
                                  [e._v(" 短信验证码登录 ")]
                                ),
                              ]
                            ),
                            e._m(0),
                          ]
                        ),
                      ]
                    ),
                  ]
                ),
                n(
                  "div",
                  {
                    directives: [
                      {
                        name: "show",
                        rawName: "v-show",
                        value: !e.onceLogin,
                        expression: "!onceLogin",
                      },
                    ],
                    staticClass: "activityBox pdb-10",
                    staticStyle: { "padding-top": "5.2rem" },
                  },
                  [
                    n("div", { staticClass: "ui-row pd-30" }, [
                      n("div", { staticClass: "ui-panel bor-rad40 tc pd-40" }, [
                        n(
                          "div",
                          { staticClass: "ui-row" },
                          [
                            n(
                              "van-cell-group",
                              {
                                staticClass: "ui-field-cell confie-cell mgb-20",
                              },
                              [
                                n("van-field", {
                                  attrs: {
                                    placeholder:
                                      "" != e.phoneTips
                                        ? e.phoneTips
                                        : "请输入手机号码",
                                    maxlength: 11,
                                  },
                                  model: {
                                    value: e.phoneNo,
                                    callback: function (t) {
                                      e.phoneNo = t;
                                    },
                                    expression: "phoneNo",
                                  },
                                }),
                                n("van-field", {
                                  attrs: {
                                    maxlength: 4,
                                    placeholder: "请输入图形验证码",
                                  },
                                  scopedSlots: e._u([
                                    {
                                      key: "button",
                                      fn: function () {
                                        return [
                                          n("img", {
                                            staticClass: "code-inp",
                                            attrs: { src: e.randImg },
                                            on: { click: e.checkImg },
                                          }),
                                        ];
                                      },
                                      proxy: !0,
                                    },
                                  ]),
                                  model: {
                                    value: e.idvalue,
                                    callback: function (t) {
                                      e.idvalue = t;
                                    },
                                    expression: "idvalue",
                                  },
                                }),
                                n("van-field", {
                                  attrs: {
                                    maxlength: 6,
                                    placeholder: "请输入短信验证码",
                                  },
                                  scopedSlots: e._u([
                                    {
                                      key: "button",
                                      fn: function () {
                                        return [
                                          n(
                                            "van-button",
                                            {
                                              staticClass: "ui-btn-l",
                                              attrs: {
                                                color: "#4679FF",
                                                round: "",
                                                plain: "",
                                                size: "small",
                                              },
                                              on: { click: e.getRandCode },
                                            },
                                            [e._v(e._s(e.randTip))]
                                          ),
                                        ];
                                      },
                                      proxy: !0,
                                    },
                                  ]),
                                  model: {
                                    value: e.codevalue,
                                    callback: function (t) {
                                      e.codevalue = t;
                                    },
                                    expression: "codevalue",
                                  },
                                }),
                              ],
                              1
                            ),
                            n(
                              "div",
                              { staticClass: "ui-row pdl-30 pdr-30 pdb-40" },
                              [
                                n(
                                  "van-button",
                                  {
                                    staticClass:
                                      "ui-payBtn btn-size-xl color-white fs-32",
                                    attrs: {
                                      block: "",
                                      color:
                                        "linear-gradient(90deg,#4496ff, #4474ff)",
                                    },
                                    on: {
                                      click: function (t) {
                                        return e.loginBtn();
                                      },
                                    },
                                  },
                                  [e._v("登录")]
                                ),
                              ],
                              1
                            ),
                            n("p", { staticClass: "color-999 fs-24 pdb-40" }, [
                              e._v("—— 其他登录方式 ——"),
                            ]),
                            n(
                              "p",
                              {
                                staticClass: "fs-28",
                                staticStyle: { color: "rgb(70, 121, 255)" },
                                on: {
                                  click: function (t) {
                                    return e.updateMethodLogin();
                                  },
                                },
                              },
                              [e._v(" 本机号码一键登录 ")]
                            ),
                          ],
                          1
                        ),
                      ]),
                    ]),
                  ]
                ),
              ]
            ),
          ]);
        },
        o = [
          function () {
            var e = this,
              t = e.$createElement,
              n = e._self._c || t;
            return n("div", { staticClass: "ui-row pdt-40" }, [
              n(
                "p",
                {
                  staticClass: "fs-28 color-black",
                  staticStyle: { "text-align": "left" },
                },
                [
                  e._v(
                    " 本机号码一键登录功能，仅限电信移动网络下使用，如使用wifi网络或其他运营商网络，请使用短信验证码登录。 "
                  ),
                ]
              ),
            ]);
          },
        ],
        i = n("1da1"),
        s =
          (n("96cf"),
          n("ac1f"),
          n("841c"),
          n("d3b7"),
          n("3ca3"),
          n("ddb0"),
          n("2b3d"),
          n("4ec3")),
        r = n("01ea"),
        c = {
          name: "LoginComponent",
          props: {
            phoneSMS: { type: Boolean, default: !0 },
            onceLoginFlag: { type: Boolean, default: !0 },
            skipLogin: { type: Boolean, default: !1 },
            IDcardName: { type: Boolean, default: !1 },
            backgroundImg: {
              type: String,
              default:
                "https://wapbj.189.cn/selfwapimage/wap_vue_static/assets/images/login/once-login.png",
            },
            bgImage: { type: String, default: "" },
            paddingNone: { type: Boolean, default: !1 },
            toOtherLoginPage: Function,
            skipcallback: Function,
          },
          data: function () {
            return {
              phoneNo: "",
              idvalue: "",
              codevalue: "",
              randTime: 60,
              randTip: "获取验证码",
              randSend: !0,
              randImg: "",
              randImgSend: !0,
              randImgFlag: !1,
              loginStatu: "",
              source: "",
              phoneTips: "",
              onceLogin: !0,
            };
          },
          created: function () {},
          mounted: function () {
            (this.loginStatu = this.$route.query.logStatu || ""),
              (this.source = this.$route.query.source || ""),
              this.checkImg();
          },
          methods: {
            toLoginPage: function () {
              this.toOtherLoginPage();
            },
            skipThisCallback: function () {
              this.skipcallback();
            },
            updateMethodLogin: function () {
              this.onceLogin = !this.onceLogin;
            },
            goToPasswrodFreeLogin: function (e) {
              var t = location.search,
                n = "&";
              "" == t && ((t = "?"), (n = "")),
                sessionStorage.setItem(
                  "onceLoginUrl",
                  window.location.href || ""
                ),
                sessionStorage.removeItem("starFalseFlag"),
                (window.location.href =
                  "/wap2017/index/apwFreeLoginIn.html" +
                  t +
                  n +
                  "syscode=" +
                  e +
                  "&busiId=COMMON");
            },
            getRandCode: function () {
              var e = this;
              return Object(i["a"])(
                regeneratorRuntime.mark(function t() {
                  var n, a, o;
                  return regeneratorRuntime.wrap(function (t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (e.randSend) {
                            t.next = 2;
                            break;
                          }
                          return t.abrupt("return");
                        case 2:
                          if (r["a"].regEx.phoneNo.test(e.phoneNo)) {
                            t.next = 5;
                            break;
                          }
                          return (
                            e.$toast("请输入正确的手机号码"), t.abrupt("return")
                          );
                        case 5:
                          if ("" != e.idvalue && null != e.idvalue) {
                            t.next = 8;
                            break;
                          }
                          return (
                            e.$toast("请输入图形验证码"), t.abrupt("return")
                          );
                        case 8:
                          return (
                            (n = { validate: "", randCode: e.idvalue }),
                            e.$toast.loading({ message: "加载中..." }),
                            (t.next = 12),
                            Object(s["C"])(n)
                          );
                        case 12:
                          if (
                            ((a = t.sent),
                            e.$toast.clear(),
                            "000000" == a.retCode
                              ? (e.randImgFlag = !0)
                              : (e.randImgFlag = !1),
                            e.randImgFlag)
                          ) {
                            t.next = 19;
                            break;
                          }
                          return (
                            e.$toast("请输入正确的图形验证码"),
                            e.checkImg(),
                            t.abrupt("return")
                          );
                        case 19:
                          return (
                            e.$toast.loading({ message: "加载中..." }),
                            (t.next = 22),
                            Object(s["Wi"])({ accNo: e.phoneNo })
                          );
                        case 22:
                          (o = t.sent),
                            e.$toast.clear(),
                            "0001" == o.retCode ||
                              ("0" == o.result
                                ? (e.$popup.show({
                                    title: "提示",
                                    content: "验证码已下发至手机，请注意查收",
                                  }),
                                  e.randCodeTime())
                                : e.$popup.show({
                                    title: "提示",
                                    content: o.retMsg,
                                  }));
                        case 25:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            checkImg: function () {
              var e = this;
              this.randImgSend &&
                ((this.randImgSend = !1),
                Object(s["Qb"])()
                  .then(function (t) {
                    (e.randImgRevoke = !1), (e.randImgSend = !0);
                    var n = t;
                    window.URL.revokeObjectURL(e.randImg),
                      (e.randImg = window.URL.createObjectURL(n));
                  })
                  .catch(function (t) {
                    console.log(t), e.$toast.clear();
                  }));
            },
            loginBtn: function () {
              var e = this;
              return Object(i["a"])(
                regeneratorRuntime.mark(function t() {
                  var n;
                  return regeneratorRuntime.wrap(function (t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (r["a"].regEx.phoneNo.test(e.phoneNo)) {
                            t.next = 3;
                            break;
                          }
                          return (
                            e.$toast("请输入正确的手机号码"), t.abrupt("return")
                          );
                        case 3:
                          if ("" != e.idvalue && null != e.idvalue) {
                            t.next = 6;
                            break;
                          }
                          return (
                            e.$toast("请输入图形验证码"), t.abrupt("return")
                          );
                        case 6:
                          if ("" != e.codevalue && null != e.codevalue) {
                            t.next = 9;
                            break;
                          }
                          return (
                            e.$toast("请输入短信验证码"), t.abrupt("return")
                          );
                        case 9:
                          return (
                            e.$toast.loading({ message: "加载中..." }),
                            (t.next = 12),
                            Object(s["Vj"])({ rand_code: e.codevalue })
                          );
                        case 12:
                          (n = t.sent),
                            e.$toast.clear(),
                            "000000" == n.retCode
                              ? e.preDepositInit(e.phoneNo)
                              : e.$popup.show({
                                  title: "提示",
                                  content: "验证码错误，请重试！",
                                });
                        case 15:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            preDepositInit: function (e) {
              var t = this,
                n = { phoneNumber: e };
              this.$toast.loading({ message: "加载中..." }),
                Object(s["nf"])(n)
                  .then(function (e) {
                    t.$toast.clear(),
                      "0" == e.result
                        ? t.$router.go(0)
                        : t.$popup.show({
                            title: "提示",
                            content: "系统繁忙，请稍后再试",
                          });
                  })
                  .catch(function (e) {
                    console.log(e), t.$toast.clear();
                  });
            },
            qryLoginAccno: function () {
              Object(s["rg"])()
                .then(function (e) {
                  0 == e.result && (window.loginNum = e.object);
                })
                .catch(function () {
                  next();
                });
            },
            randCodeTime: function () {
              var e = this;
              (this.randSend = !1),
                (this.randTip = this.randTime + "s后可重新发送");
              var t = setInterval(function () {
                (e.randTime = e.randTime - 1),
                  (e.randTip = e.randTime + "s后可重新发送"),
                  e.randTime <= 0 &&
                    (clearInterval(t),
                    (e.randTip = "获取验证码"),
                    (e.randSend = !0),
                    (e.randTime = 60));
              }, 1e3);
            },
          },
          watch: {},
        },
        l = c,
        d = (n("0dcb"), n("2877")),
        u = Object(d["a"])(l, a, o, !1, null, "38466ecf", null);
      t["a"] = u.exports;
    },
    d9ae: function (e, t, n) {
      "use strict";
      n.r(t);
      var a = function () {
          var e = this,
            t = e.$createElement,
            a = e._self._c || t;
          return a(
            "div",
            { staticStyle: { height: "100%" } },
            [
              e.loginOnceFlag
                ? a("LoginComponentStar", {
                    attrs: {
                      toOtherLoginPage: e.changePage(),
                      phoneSMS: !1,
                      paddingNone: !0,
                      bgImage: n("6d8b"),
                      backgroundImg: n("8802"),
                    },
                  })
                : e._e(),
              a(
                "div",
                {
                  directives: [
                    {
                      name: "show",
                      rawName: "v-show",
                      value: !e.loginOnceFlag,
                      expression: "!loginOnceFlag",
                    },
                  ],
                  staticClass: "content",
                },
                [
                  a("section", { staticClass: "page-main" }, [
                    a("div", { staticClass: "StarCardLogon" }, [
                      a(
                        "div",
                        {
                          staticClass: "ui-panel bor-rad40 tc pd-40",
                          staticStyle: {
                            "margin-top": "-1.8rem",
                            position: "relative",
                            top: "7rem",
                          },
                        },
                        [
                          a(
                            "div",
                            { staticClass: "logincheckbox" },
                            e._l(e.loginchecklist, function (t, n) {
                              return a(
                                "div",
                                {
                                  key: n,
                                  staticClass: "logincheck",
                                  class: { active: e.logincheckindex == n },
                                  on: {
                                    click: function (t) {
                                      return e.loginCheckClick(n);
                                    },
                                  },
                                },
                                [e._v(" " + e._s(t) + " ")]
                              );
                            }),
                            0
                          ),
                          a(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: 0 == e.logincheckindex,
                                  expression: "logincheckindex == 0",
                                },
                              ],
                              staticClass: "ui-row",
                            },
                            [
                              a(
                                "van-cell-group",
                                {
                                  staticClass:
                                    "ui-field-cell confie-cell mgb-20",
                                },
                                [
                                  a("van-field", {
                                    attrs: {
                                      maxlength: "11",
                                      placeholder: "请输入手机号码",
                                    },
                                    model: {
                                      value: e.phoneNo,
                                      callback: function (t) {
                                        e.phoneNo = t;
                                      },
                                      expression: "phoneNo",
                                    },
                                  }),
                                  a("van-field", {
                                    attrs: {
                                      maxlength: "6",
                                      placeholder: "请输入短信验证码",
                                    },
                                    scopedSlots: e._u([
                                      {
                                        key: "button",
                                        fn: function () {
                                          return [
                                            a(
                                              "van-button",
                                              {
                                                staticClass: "ui-btn-l",
                                                attrs: {
                                                  color: "#4679FF",
                                                  round: "",
                                                  plain: "",
                                                  size: "small",
                                                },
                                                on: { click: e.getRandCode },
                                              },
                                              [e._v(e._s(e.randTip))]
                                            ),
                                          ];
                                        },
                                        proxy: !0,
                                      },
                                    ]),
                                    model: {
                                      value: e.smscode,
                                      callback: function (t) {
                                        e.smscode = t;
                                      },
                                      expression: "smscode",
                                    },
                                  }),
                                ],
                                1
                              ),
                              a(
                                "div",
                                { staticClass: "ui-row pdt-20" },
                                [
                                  a(
                                    "van-button",
                                    {
                                      staticClass:
                                        "ui-payBtn btn-size-xl color-white fs-32",
                                      attrs: {
                                        block: "",
                                        color:
                                          "linear-gradient(90deg,#4496ff, #4474ff)",
                                      },
                                      on: {
                                        click: function (t) {
                                          return e.businessLogin();
                                        },
                                      },
                                    },
                                    [e._v("立即登录")]
                                  ),
                                  a(
                                    "van-button",
                                    {
                                      staticClass: "mgt-40",
                                      attrs: {
                                        block: "",
                                        color: "#4672FF",
                                        plain: "",
                                      },
                                      on: {
                                        click: function (t) {
                                          return e.updatePage();
                                        },
                                      },
                                    },
                                    [e._v("返回一键登录")]
                                  ),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                          a(
                            "div",
                            {
                              directives: [
                                {
                                  name: "show",
                                  rawName: "v-show",
                                  value: 1 == e.logincheckindex,
                                  expression: "logincheckindex == 1",
                                },
                              ],
                              staticClass: "ui-row",
                            },
                            [
                              a(
                                "van-cell-group",
                                {
                                  staticClass:
                                    "ui-field-cell confie-cell mgb-20",
                                },
                                [
                                  a("van-field", {
                                    attrs: {
                                      maxlength: "11",
                                      placeholder: "请输入手机号码",
                                    },
                                    model: {
                                      value: e.dxPhoneNo,
                                      callback: function (t) {
                                        e.dxPhoneNo = t;
                                      },
                                      expression: "dxPhoneNo",
                                    },
                                  }),
                                  a("van-field", {
                                    attrs: {
                                      maxlength: "16",
                                      placeholder: "请输入密码",
                                      type: "password",
                                    },
                                    model: {
                                      value: e.password,
                                      callback: function (t) {
                                        e.password = t;
                                      },
                                      expression: "password",
                                    },
                                  }),
                                ],
                                1
                              ),
                              a(
                                "div",
                                { staticClass: "ui-row pdt-20" },
                                [
                                  a(
                                    "van-button",
                                    {
                                      staticClass:
                                        "ui-payBtn btn-size-xl color-white fs-32",
                                      attrs: {
                                        block: "",
                                        color:
                                          "linear-gradient(90deg,#4496ff, #4474ff)",
                                      },
                                      on: {
                                        click: function (t) {
                                          return e.passwordCheck();
                                        },
                                      },
                                    },
                                    [e._v("立即登录")]
                                  ),
                                  a(
                                    "van-button",
                                    {
                                      staticClass: "mgt-40",
                                      attrs: {
                                        block: "",
                                        color: "#4672FF",
                                        plain: "",
                                      },
                                      on: {
                                        click: function (t) {
                                          return e.updatePage();
                                        },
                                      },
                                    },
                                    [e._v("返回一键登录")]
                                  ),
                                ],
                                1
                              ),
                            ],
                            1
                          ),
                        ]
                      ),
                    ]),
                  ]),
                ]
              ),
            ],
            1
          );
        },
        o = [],
        i = n("1da1"),
        s = (n("ac1f"), n("96cf"), n("4ec3")),
        r = n("01ea"),
        c = n("ed08"),
        l = n("a6b3"),
        d = {
          name: "scratchLogon",
          components: { LoginComponentStar: l["a"] },
          data: function () {
            return {
              phoneNo: "",
              dxPhoneNo: "",
              smscode: "",
              password: "",
              logincheckindex: 0,
              loginOnceFlag: !0,
              loginchecklist: ["验证码登录", "密码登录"],
              randTime: 60,
              randTip: "获取验证码",
              randSend: !0,
              staffCode: "",
              channelId: "",
              loginNum: "",
            };
          },
          mounted: function () {
            (this.channelId = this.$route.query.channelId || ""),
              (this.staffCode = this.$route.query.staffCode || ""),
              (this.loginNum = window.loginNum ? window.loginNum + "" : "");
            var e = sessionStorage.getItem("starFalseFlag");
            null != this.loginNum &&
              "" != this.loginNum &&
              "1" != e &&
              this.ruleCheck(this.loginNum);
          },
          methods: {
            loginCheckClick: function (e) {
              (this.phoneNo = ""),
                (this.smscode = ""),
                (this.logincheckindex = e);
            },
            getRandCode: function () {
              var e = this;
              return Object(i["a"])(
                regeneratorRuntime.mark(function t() {
                  var n;
                  return regeneratorRuntime.wrap(function (t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (r["a"].regEx.phoneNo.test(e.phoneNo)) {
                            t.next = 4;
                            break;
                          }
                          e.$popup.show({
                            title: "提示",
                            content: "请输入正确的手机号码！",
                          }),
                            (t.next = 12);
                          break;
                        case 4:
                          if (e.randSend) {
                            t.next = 6;
                            break;
                          }
                          return t.abrupt("return");
                        case 6:
                          return (
                            e.$toast.loading({ message: "加载中..." }),
                            (t.next = 9),
                            Object(s["Wi"])({ accNo: e.phoneNo })
                          );
                        case 9:
                          (n = t.sent),
                            e.$toast.clear(),
                            "0" == n.result
                              ? (e.$popup.show({
                                  title: "提示",
                                  content: "验证码已下发至手机，请注意查收",
                                }),
                                e.randCodeTime())
                              : e.$popup.show({
                                  title: "提示",
                                  content: n.retMsg,
                                });
                        case 12:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            passwordCheck: function () {
              var e = this;
              if (r["a"].regEx.phoneNo.test(this.dxPhoneNo))
                if (this.password) {
                  var t = /^(-)?\d+(\.\d+)?$/;
                  if (null != t.exec(this.password) && "" != this.password) {
                    var n = Object(c["c"])(
                        this.password,
                        "askgakjgidign399ew3593er",
                        "2156ghrb"
                      ),
                      a = { password: n, phoneNum: this.dxPhoneNo };
                    this.$toast.loading({ message: "加载中..." }),
                      Object(s["Pe"])(a)
                        .then(function (t) {
                          "0" == t.result
                            ? e.ruleCheck(e.dxPhoneNo)
                            : (e.$toast.clear(),
                              e.$popup.show({
                                title: "提示",
                                content: t.retMsg,
                              }));
                        })
                        .catch(function (t) {
                          console.log(t), e.$toast.clear();
                        });
                  } else this.$toast("服务密码为数字，请重新输入");
                } else this.$toast("请输入您的服务密码");
              else this.$toast("请输入正确的手机号码");
            },
            businessLogin: function () {
              var e = this;
              return Object(i["a"])(
                regeneratorRuntime.mark(function t() {
                  var n;
                  return regeneratorRuntime.wrap(function (t) {
                    while (1)
                      switch ((t.prev = t.next)) {
                        case 0:
                          if (r["a"].regEx.phoneNo.test(e.phoneNo)) {
                            t.next = 4;
                            break;
                          }
                          e.$popup.show({
                            title: "提示",
                            content: "请输入正确的手机号码！",
                          }),
                            (t.next = 13);
                          break;
                        case 4:
                          if ("" != e.smscode) {
                            t.next = 8;
                            break;
                          }
                          e.$popup.show({
                            title: "提示",
                            content: "请输入验证码！",
                          }),
                            (t.next = 13);
                          break;
                        case 8:
                          return (
                            e.$toast.loading({ message: "加载中..." }),
                            (t.next = 11),
                            Object(s["Vj"])({ rand_code: e.smscode })
                          );
                        case 11:
                          (n = t.sent),
                            "000000" == n.retCode
                              ? (e.$toast.clear(), e.preDepositInit(e.phoneNo))
                              : (e.$toast.clear(),
                                e.$popup.show({
                                  title: "提示",
                                  content: "验证码错误，请重试！",
                                }));
                        case 13:
                        case "end":
                          return t.stop();
                      }
                  }, t);
                })
              )();
            },
            preDepositInit: function (e) {
              var t = this,
                n = { phoneNumber: e };
              this.$toast.loading({ message: "加载中..." }),
                Object(s["nf"])(n)
                  .then(function (n) {
                    "0" == n.result
                      ? t.ruleCheck(e)
                      : (t.$toast.clear(),
                        t.$popup.show({
                          title: "提示",
                          content: "系统繁忙，请稍后再试",
                        }));
                  })
                  .catch(function (e) {
                    console.log(e), t.$toast.clear();
                  });
            },
            ruleCheck: function (e) {
              var t = this,
                n = { activeId: "310" };
              this.$toast.loading({ message: "加载中..." }),
                Object(s["P"])(n)
                  .then(function (n) {
                    t.$toast.clear(),
                      "0" == +n.retCode || "101" == n.retCode
                        ? t.$router.push({
                            path: "/scratchCard",
                            query: {
                              phoneNumber: e,
                              channelId: t.channelId,
                              staffCode: t.staffCode,
                            },
                          })
                        : "106" == n.retCode
                        ? t.$popup.show({
                            title: "提示",
                            content:
                              "啊哦～今天抽奖次数已达上限，请您明天再来参与活动！",
                          })
                        : (t.$toast.clear(),
                          t.$popup.show({ title: "提示", content: n.retMsg }));
                  })
                  .catch(function (e) {
                    console.log(e), t.$toast.clear();
                  });
            },
            randCodeTime: function () {
              var e = this;
              (this.randSend = !1),
                (this.randTip = this.randTime + "s后重新发送");
              var t = setInterval(function () {
                (e.randTime = e.randTime - 1),
                  (e.randTip = e.randTime + "s后重新发送"),
                  e.randTime <= 0 &&
                    (clearInterval(t),
                    (e.randTip = "获取验证码"),
                    (e.randSend = !0),
                    (e.randTime = 60));
              }, 1e3);
            },
            changePage: function () {
              return this.updatePage;
            },
            updatePage: function () {
              this.loginOnceFlag
                ? (this.loginOnceFlag = !1)
                : (this.loginOnceFlag = !0);
            },
          },
        },
        u = d,
        p = (n("1aa7"), n("2877")),
        g = Object(p["a"])(u, a, o, !1, null, "7a94029a", null);
      t["default"] = g.exports;
    },
  },
]);
