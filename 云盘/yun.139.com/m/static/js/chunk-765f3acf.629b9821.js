(window.webpackJsonp = window.webpackJsonp || []).push([
  ["chunk-765f3acf"],
  {
    "06da": function (t, e, a) {
      "use strict";
      a("a551");
      var i = a("4ed7"),
        o = a("f20f"),
        n = a("eb2f"),
        s =
          (a("1e8b"),
          a("2664"),
          a("1dd7"),
          a("874c"),
          a("ffc9"),
          a("5b3b"),
          a("08f2"),
          a("ab5c"),
          a("233c"),
          a("d0e3"),
          a("9163"),
          a("cfaf"),
          a("129e"),
          a("d407"),
          a("4cd2"),
          a("5450"),
          a("5529"),
          a("a249"),
          a("afe7"),
          a("6eef")),
        r = a("6638"),
        c = a("fe2b"),
        l = a("c276"),
        u = a("63bb"),
        d = a.n(u),
        f = a("98a5"),
        h = a("df5f"),
        m = (function () {
          return Object(h.a)(
            function t(e, a) {
              Object(f.a)(this, t),
                (this.id = "countdown-" + (e || "root")),
                (this.maxSeconds = 60),
                (this.seconds = 0),
                (this.startTime = 0),
                (this.updateFunc = a);
              var i = sessionStorage.getItem(this.id);
              if (i) {
                this.startTime = +i;
                var o = (Date.now() - this.startTime) / 1e3;
                o < this.maxSeconds &&
                  this.start(parseInt(this.maxSeconds - o), !0);
              }
            },
            [
              {
                key: "start",
                value: function (t, e) {
                  this.setSeconds(Math.min(t || this.seconds, this.maxSeconds)),
                    e ||
                      ((this.startTime = Date.now()),
                      sessionStorage.setItem(this.id, this.startTime)),
                    this.loop();
                },
              },
              {
                key: "setSeconds",
                value: function (t) {
                  (this.seconds = t),
                    this.updateFunc && this.updateFunc(this.seconds);
                },
              },
              {
                key: "loop",
                value: function () {
                  var t = this;
                  this.timer = setTimeout(function () {
                    t.setSeconds(
                      t.maxSeconds - parseInt((Date.now() - t.startTime) / 1e3)
                    ),
                      t.seconds > 0 ? t.loop() : t.stop();
                  }, 1e3);
                },
              },
              {
                key: "stop",
                value: function (t) {
                  this.timer && (clearTimeout(this.timer), (this.timer = null)),
                    this.setSeconds(t || 0);
                },
              },
              {
                key: "release",
                value: function () {
                  this.stop(),
                    sessionStorage.removeItem(this.id),
                    (this.updateFunc = null);
                },
              },
            ]
          );
        })(),
        p = a("4f52"),
        g = a("2a0b"),
        b = {
          name: "ComDropdown",
          props: {
            dropMode: { type: String, default: "normal" },
            currentKey: { default: "" },
            options: { required: !0, type: Array },
          },
          data: function () {
            return { direction: "top", visible: !1 };
          },
          computed: {
            label: function () {
              var t = this,
                e = this.options.find(function (e) {
                  return e.key === t.currentKey;
                });
              return e && e.label;
            },
          },
          created: function () {
            window.dropdown = this;
          },
          beforeDestroy: function () {
            this.onClose();
          },
          methods: {
            onClose: function () {
              (this.visible = !1),
                document.body.removeEventListener("click", this.clickHandler),
                (this.clickHandler = null);
            },
            onOpen: function () {
              var t = this;
              "normal" === this.dropMode
                ? this.$el.getBoundingClientRect().top >
                  window.screen.availHeight / 2
                  ? (this.direction = "top")
                  : (this.direction = "bottom")
                : (this.direction = "bottom");
              (this.visible = !0),
                this.clickHandler ||
                  ((this.clickHandler = this.onClose.bind(this)),
                  setTimeout(function () {
                    document.body.addEventListener("click", t.clickHandler);
                  }, 100));
            },
            onSelect: function (t) {
              this.$emit("select", t), this.onClose();
            },
          },
        },
        v = (a("9588"), a("212b")),
        A = Object(v.a)(
          b,
          function () {
            var t = this,
              e = t._self._c;
            return e(
              "div",
              { class: { "com-dropdown": !0, "dropdown-visible": t.visible } },
              [
                e(
                  "div",
                  { staticClass: "content flex-row", on: { click: t.onOpen } },
                  [
                    e("p", { staticClass: "flex-one" }, [t._v(t._s(t.label))]),
                    e("img", {
                      staticClass: "drop-pointer",
                      attrs: { src: a("287d"), alt: "" },
                    }),
                  ]
                ),
                e("transition", { attrs: { name: "slide-to-top" } }, [
                  e(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: t.visible,
                          expression: "visible",
                        },
                      ],
                      class: [
                        "dropdown-" + t.dropMode,
                        "dropdown-" + t.direction,
                      ],
                    },
                    [
                      e(
                        "div",
                        { staticClass: "options" },
                        t._l(t.options, function (a) {
                          return e(
                            "div",
                            {
                              key: a.key,
                              class: {
                                item: !0,
                                "item-selected": a.key === t.currentKey,
                              },
                              on: {
                                click: function (e) {
                                  return t.onSelect(a);
                                },
                              },
                            },
                            [t._v(t._s(a.label))]
                          );
                        }),
                        0
                      ),
                    ]
                  ),
                ]),
              ],
              1
            );
          },
          [],
          !1,
          null,
          "62122e14",
          null
        ).exports,
        w = a("cb9f"),
        C = a("56d7"),
        S = a("3bcc"),
        y = a("e418"),
        I = a("9b59"),
        k = /^[0-9a-zA-Z_~@#$^]*$/,
        x = /^[A-Za-z0-9_+-]+@[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+$/,
        D = ["pw", "email", "qa", "success"],
        R = ["settingPw"],
        O = ["login"],
        M = ["phone", "email", "qa", "pw", "success"],
        B = ["phone", "choice"],
        E = ["phone", "choice", "qa", "pw", "success"],
        L = ["phone", "choice", "email", "pw", "success"],
        j = {
          name: "ComSafeAuth",
          components: { ComDropdown: A, ComTitleBar: w.a },
          data: function () {
            return {
              docmHeight: document.documentElement.clientHeight,
              showHeight: document.documentElement.clientHeight,
              isActivation: !1,
              hasCloseFunc: !1,
              selfCode0: "",
              selfCode1: "",
              smsCode: "",
              smsCountdown: -1,
              smsOncePage: !1,
              isGetSmsCode: !1,
              emailAccount: "",
              emailCode: "",
              emailCountdown: -1,
              emailOncePage: !1,
              isGetEmailCode: !1,
              questionList: [],
              questions: [],
              answers: [],
              guardSteps: [],
              guardIndex: 0,
              PW_MIN: 4,
              PW_MAX: 16,
              random: "",
              ticket: "",
              appSessionID: "",
              isPDSUser: Object(S.h)(),
            };
          },
          watch: {
            isSafeChecked: {
              immediate: !0,
              handler: function () {
                this.initGuardStep();
              },
            },
            answers: {
              deep: !0,
              handler: function (t) {
                for (var e = 0; e < t.length; e++)
                  if (t[e].length > 20) {
                    if (
                      ((t[e] = t[e].substr(0, 20)),
                      this.toastTime && Date.now() - this.toastTime < 3e3)
                    )
                      break;
                    this.$toast("输入字数超过限制"),
                      (this.toastTime = Date.now());
                    break;
                  }
              },
            },
          },
          created: function () {
            var t = this;
            C.eventBus.$on("clearSafeBoxTimeCount", function () {
              t.resetParams();
            }),
              (window.safeAuth = this),
              this.isSafeChecked || this.$store.dispatch("safe/getSafeStatus"),
              (this.emailCD = new m("safe-email", function (e) {
                t.emailCountdown = e;
              })),
              (this.smsCD = new m("safe-sms", function (e) {
                t.smsCountdown = e;
              }));
          },
          mounted: function () {
            var t = this;
            window.onresize = function () {
              if (
                ((t.showHeight = document.body.clientHeight),
                t.showHeight < t.docmHeight && "login" === t.currentStep)
              ) {
                var e = document.getElementsByClassName("auth-next")[0],
                  a = document.getElementsByClassName("input-wrapper")[0];
                (t.observer = new IntersectionObserver(
                  function (i) {
                    var o = !1,
                      n = !1;
                    i.forEach(function (t) {
                      "input-wrapper" === t.target.className &&
                      t.intersectionRatio < 1
                        ? (o = !0)
                        : "auth-next" === t.target.className &&
                          t.intersectionRatio < 1 &&
                          (n = !0);
                    }),
                      o
                        ? (t.observer.unobserve(a),
                          t.observer.unobserve(e),
                          t.observer.disconnect(),
                          (t.observer = null),
                          a.scrollIntoView())
                        : n &&
                          (t.observer.unobserve(e),
                          e.scrollIntoView(!1),
                          setTimeout(function () {
                            t.observer.unobserve(a),
                              t.observer.disconnect(),
                              (t.observer = null);
                          }, 300));
                  },
                  {
                    threshold: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
                  }
                )),
                  t.observer.observe(a),
                  t.observer.observe(e);
              }
            };
          },
          activated: function () {
            this.isSimChecked || this.$store.dispatch("safe/getSimAbility"),
              this.initGuardStep();
            var t = this.$options._parentListeners || {};
            this.hasCloseFunc = !!t.close;
          },
          deactivated: function () {
            this.initGuardStep(), this.resetParams();
          },
          filters: {
            cnIndexFilter: function (t) {
              switch (t) {
                case 0:
                  return "一";
                case 1:
                  return "二";
                case 2:
                  return "三";
                case 3:
                  return "四";
                case 4:
                  return "五";
                case 5:
                  return "六";
                case 6:
                  return "七";
                case 7:
                  return "八";
                case 8:
                  return "九";
                default:
                  return "";
              }
            },
          },
          computed: Object(n.a)(
            Object(n.a)(
              {
                backVisible: function () {
                  return !this.hasCloseFunc || this.guardIndex > 0;
                },
                title: function () {
                  var t = !this.hasSafe || !this.hasSafeGuard;
                  switch (this.currentStep) {
                    case "phone":
                      return "验证手机号";
                    case "choice":
                      return "选择验证方式";
                    case "email":
                      return t ? "设置安全邮箱" : "邮箱验证";
                    case "qa":
                      return t ? "设置安全问题" : "安全问题验证";
                    case "pw":
                      return this.hasSafe ? "设置新密码" : "设置保险箱密码";
                    case "success":
                      return "设置完成";
                    default:
                      return "保险箱";
                  }
                },
                pwNextDisabled: function () {
                  var t = this.selfCode0 || "",
                    e = this.selfCode1 || "",
                    a = this.PW_MIN;
                  return t.length < a || e.length < a;
                },
                phoneNextDisabled: function () {
                  var t = this.smsCode || "",
                    e = this.PW_MIN;
                  return t.length < e || /^[ ]+$/.test(t);
                },
                emailNextDisabled: function () {
                  var t = (this.emailCode || "").length < this.PW_MIN;
                  if (!this.hasSafeGuard) {
                    var e = this.emailAccount || "";
                    return t || !x.test(e);
                  }
                  return t;
                },
                qaNextDisabled: function () {
                  return (
                    !this.answers.length ||
                    this.answers.some(function (t) {
                      return !t;
                    })
                  );
                },
                loginNextDisabled: function () {
                  var t = this.selfCode0 || "",
                    e = this.PW_MIN;
                  return t.length < e || /^[ ]+$/.test(t);
                },
                smsCountdownText: function () {
                  var t = this.smsCountdown;
                  return t > 0
                    ? t + "s后重试"
                    : 0 === t && this.smsOncePage
                    ? "重新获取"
                    : "获取验证码";
                },
                emailCountdownText: function () {
                  var t = this.emailCountdown;
                  return t > 0
                    ? t + "s后重试"
                    : 0 === t && this.emailOncePage
                    ? "重新获取"
                    : "获取验证码";
                },
                currentStep: function () {
                  return this.guardSteps[this.guardIndex] || "";
                },
                maskEmail: function () {
                  var t = this.safeEmail || "";
                  return !t.length || t.length < 8
                    ? t
                    : t.lastIndexOf("@") > 8
                    ? t.replace(/^(\w{3})\w{4}(.*)$/, "$1****$2")
                    : t.replace(/^(\w{2})\w{3}(.*)$/, "$1***$2");
                },
              },
              Object(s.e)({
                isOnline: function (t) {
                  return t.isOnline;
                },
                isSafeChecked: function (t) {
                  return t.safe.isSafeChecked;
                },
                isSimChecked: function (t) {
                  return t.safe.isSimChecked;
                },
                simSupport: function (t) {
                  return t.safe.simSupport;
                },
                hasSafe: function (t) {
                  return t.safe.hasSafe;
                },
                isSafe: function (t) {
                  return t.safe.isSafe;
                },
                safeEmail: function (t) {
                  return t.safe.email;
                },
                secQuestionList: function (t) {
                  return t.safe.secQuestionList;
                },
                maskPhone: function (t) {
                  return t.auth.account;
                },
                realAccount: function (t) {
                  return t.auth.completeAccount;
                },
                RSAKey: function (t) {
                  return t.safe.RSAKey;
                },
                account: function (t) {
                  return t.auth.account;
                },
                isSetPin: function (t) {
                  return t.safe.isSetPin;
                },
              })
            ),
            Object(s.c)({
              isGuardReady: "safe/isGuardReady",
              hasSafeGuard: "safe/hasSafeGuard",
            })
          ),
          methods: Object(n.a)(
            {
              initGuardStep: function () {
                this.isSafeChecked &&
                  (this.hasSafe && this.isSetPin
                    ? (this.guardSteps = O)
                    : this.hasSafe && !this.isSetPin
                    ? (this.guardSteps = R)
                    : (this.guardSteps = D),
                  (this.guardIndex = 0));
              },
              resetParams: function () {
                (this.guardIndex = 0),
                  (this.selfCode0 = ""),
                  (this.selfCode1 = ""),
                  (this.smsCode = ""),
                  (this.emailAccount = ""),
                  (this.emailCode = ""),
                  (this.answers = []),
                  (this.smsOncePage = !1),
                  (this.isGetSmsCode = !1),
                  (this.emailOncePage = !1),
                  (this.isGetEmailCode = !1),
                  this.smsCD && this.smsCD.stop(),
                  this.emailCD && this.emailCD.stop();
              },
              onPreviousStep: function () {
                if (0 === this.guardIndex)
                  return (
                    this.hasSafe &&
                    this.isSetPin &&
                    "login" !== this.currentStep
                      ? (this.guardSteps = O)
                      : this.hasCloseFunc
                      ? this.onClose()
                      : Object(l.H)(),
                    void (this.emailOncePage = !1)
                  );
                !this.hasSafe && this.isPDSUser
                  ? (this.guardIndex =
                      1 === this.guardIndex
                        ? 2
                        : 2 === this.guardIndex
                        ? 0
                        : 3 === this.guardIndex
                        ? 1
                        : 0)
                  : this.guardIndex--,
                  (this.smsOncePage = !1);
              },
              onNextStep: function () {
                var t = this,
                  e =
                    arguments.length > 0 && void 0 !== arguments[0]
                      ? arguments[0]
                      : {},
                  a = this.selfCode0,
                  i = this.selfCode1,
                  o = this.PW_MIN,
                  n = this.PW_MAX;
                switch (this.currentStep) {
                  case "login":
                    if (!this.isOnline)
                      return void this.$toast("网络异常，请稍后重试");
                    I.a.fmDataReport(
                      { page_title: "保险箱", click_object: "进入保险箱" },
                      "page_click"
                    ),
                      this.onLoginSafebox();
                    break;
                  case "pw":
                    if (
                      a.length < o ||
                      a.length > n ||
                      i.length < o ||
                      i.length > n
                    )
                      return void this.$toast(
                        "密码为".concat(o, "-").concat(n, "位字符，请重新输入")
                      );
                    if (!k.test(a))
                      return void this.$toast("密码不支持_~@#$^以外的特殊符号");
                    if (!k.test(i))
                      return void this.$toast("密码不支持_~@#$^以外的特殊符号");
                    if (a !== i) return void this.$toast("两次密码输入不一致");
                    this.hasSafe
                      ? this.onSetSafe(function (e) {
                          t.guardIndex++, t.onEnterSafebox();
                        })
                      : Object(S.h)()
                      ? ((this.guardIndex += 2),
                        this.hasSafeGuard || this.getSafeQuestionList())
                      : this.guardIndex++;
                    break;
                  case "settingPw":
                    if (
                      a.length < o ||
                      a.length > n ||
                      i.length < o ||
                      i.length > n
                    )
                      return void this.$toast(
                        "密码为".concat(o, "-").concat(n, "位字符，请重新输入")
                      );
                    if (!k.test(a))
                      return void this.$toast("密码不支持_~@#$^以外的特殊符号");
                    if (!k.test(i))
                      return void this.$toast("密码不支持_~@#$^以外的特殊符号");
                    if (a !== i) return void this.$toast("两次密码输入不一致");
                    this.hasSafe &&
                      this.onSetHasSafePw(function () {
                        t.guardIndex++, t.onEnterSafebox();
                      });
                    break;
                  case "phone":
                    if (!this.isGetSmsCode)
                      return void this.$toast("验证码错误，请先获取验证码");
                    this.$loading(),
                      this.verifySmsCode().then(function (e) {
                        e
                          ? t.isGuardReady
                            ? (t.$loading.hide(),
                              t.hasSafeGuard
                                ? (t.guardSteps = B)
                                : (t.guardSteps = M),
                              t.guardIndex++)
                            : t.$store
                                .dispatch("safe/getSafeGuardInfo")
                                .then(function (e) {
                                  e.success
                                    ? t.$nextTick(function () {
                                        t.hasSafeGuard
                                          ? (t.guardSteps = B)
                                          : (t.guardSteps = M),
                                          t.guardIndex++;
                                      })
                                    : t.$toast(
                                        g.a.getMessage(e.status, "safe") ||
                                          "保险箱信息获取失败，请重试"
                                      );
                                })
                                .finally(function () {
                                  t.$loading.hide();
                                })
                          : t.$loading.hide();
                      });
                    break;
                  case "choice":
                    "qa" === e.nextStep
                      ? ((this.guardSteps = E),
                        this.buildQuestionList(
                          this.$store.state.safe.secQuestionList
                        ),
                        (this.answers = [""]))
                      : ((this.guardSteps = L),
                        (this.emailAccount = this.$store.state.safe.email)),
                      this.guardIndex++;
                    break;
                  case "email":
                    if (!this.isGetEmailCode)
                      return void this.$toast("验证码错误，请先获取验证码");
                    this.verifyEmailCode().then(function (e) {
                      e &&
                        (!t.hasSafe && Object(S.h)()
                          ? t.onSetSafe(function (e) {
                              t.guardIndex += 2;
                            })
                          : (t.guardIndex++,
                            t.hasSafeGuard || t.getSafeQuestionList()));
                    });
                    break;
                  case "qa":
                    this.hasSafe
                      ? this.hasSafeGuard
                        ? this.verifySafeQuestion().then(function (e) {
                            e && t.guardIndex++;
                          })
                        : Object(S.h)()
                        ? this.setSecQuestions().then(function (e) {
                            e && t.guardIndex++;
                          })
                        : this.guardIndex++
                      : Object(S.h)()
                      ? this.guardIndex--
                      : this.onSetSafe(function (e) {
                          t.guardIndex++;
                        });
                }
              },
              getSafeQuestionList: function () {
                var t = this;
                this.questionList.length ||
                  (this.$loading(),
                  Object(c.i)()
                    .then(function (e) {
                      if (e.success) {
                        var a = (e.data.qrySysSecQuestionRes || {})
                          .sysSecQuestionList;
                        t.buildQuestionList(a);
                      } else t.$toast(g.a.getMessage(status, "safe") || "安全问题列表获取失败，请重试");
                    })
                    .finally(function () {
                      t.$loading.hide();
                    }));
              },
              buildQuestionList: function (t) {
                for (
                  var e = (t || []).map(function (t) {
                      var e = t.quesGroupID;
                      return t.quesIDList.map(function (t) {
                        return Object(n.a)(
                          {
                            key: t.quesID,
                            label: t.quesContent,
                            quesGroupID: t.quesGroupID || e,
                          },
                          t
                        );
                      });
                    }),
                    a = [],
                    i = [],
                    o = 0,
                    s = e.length;
                  o < s;
                  o++
                )
                  a.push(JSON.parse(JSON.stringify(e[o][0]))), i.push("");
                (this.questionList = e),
                  (this.questions = a),
                  (this.answers = i);
              },
              handleSelect: function (t, e) {
                var a = this.questions[e],
                  i = t[0];
                for (var o in i) a[o] = i[o];
              },
              onChangeQuestion: function () {
                var t = this.questionList[0];
                void 0 === this.questionIndex && (this.questionIndex = 1),
                  (this.questions = [
                    JSON.parse(
                      JSON.stringify(t[this.questionIndex % t.length])
                    ),
                  ]),
                  (this.answers = [""]),
                  this.questionIndex++;
              },
              verifySafeQuestion: function () {
                var t = this;
                return Object(o.a)(
                  Object(i.a)().m(function e() {
                    var a, o, n, s, r, l, u;
                    return Object(i.a)().w(
                      function (e) {
                        for (;;)
                          switch ((e.p = e.n)) {
                            case 0:
                              if (t.questions[0] && t.answers[0]) {
                                e.n = 1;
                                break;
                              }
                              return (
                                t.$toast("问题答案校验出错，请重试"), e.a(2, !1)
                              );
                            case 1:
                              if (!t.questionVerifying) {
                                e.n = 2;
                                break;
                              }
                              return e.a(2);
                            case 2:
                              return (
                                (t.questionVerifying = !0),
                                (e.n = 3),
                                t.getSyncRSAKey()
                              );
                            case 3:
                              if ((a = e.v).isOk) {
                                e.n = 4;
                                break;
                              }
                              return (
                                (t.questionVerifying = !1),
                                !a.error &&
                                  t.$toast(a.msg || "问题答案校验失败，请重试"),
                                e.a(2, !1)
                              );
                            case 4:
                              return (
                                (e.p = 4),
                                (o = t.questions[0]),
                                (n = o.quesGroupID),
                                (s = o.quesID),
                                (r = o.quesContent),
                                (l = Object(S.h)()
                                  ? {
                                      questionGroupId: n,
                                      questionId: s,
                                      questionContent: r,
                                      encryptedAnswer: p.a.aesCbcEncrypt(
                                        t.answers[0]
                                      ),
                                      encryptedKey: p.a.rsaPK1v15Encrypt(
                                        t.RSAKey
                                      ),
                                    }
                                  : {
                                      verSecQuestionReq: {
                                        quesGroupId: n,
                                        quesId: s,
                                        quesContent: r,
                                        quesContentAnswer: p.a.RSAEncrypt(
                                          t.answers[0],
                                          t.RSAKey
                                        ),
                                      },
                                    }),
                                (e.n = 5),
                                Object(c.x)(l)
                              );
                            case 5:
                              if (
                                ((u = e.v),
                                (t.questionVerifying = !1),
                                u.success)
                              ) {
                                e.n = 6;
                                break;
                              }
                              return (
                                t.$toast(
                                  g.a.getMessage(u.status, "safe") ||
                                    "问题答案校验失败，请重试"
                                ),
                                e.a(2, !1)
                              );
                            case 6:
                              return (
                                Object(S.h)() && (t.ticket = u.data.ticket),
                                e.a(2, !0)
                              );
                            case 7:
                              return (
                                (e.p = 7),
                                e.v,
                                (t.questionVerifying = !1),
                                e.a(2, !1)
                              );
                          }
                      },
                      e,
                      null,
                      [[4, 7]]
                    );
                  })
                )();
              },
              getSmsCode: function (t) {
                var e = this;
                if (this.isOnline) {
                  if (!(this.smsCountdown > 0)) {
                    this.smsCD.setSeconds(60);
                    var a = { safeBoxGetAppPwdReq: { type: 1 } };
                    Object(S.h)() &&
                      ((this.random = p.a.getRandomSring(32)),
                      (a = { random: this.random })),
                      Object(c.d)(a)
                        .then(function (a) {
                          if (((a.data = a.data.appLoginRspInfo), !a.data))
                            return (
                              e.smsCD.stop(),
                              void e.$toast(
                                g.a.getMessage(a.status, "safe") ||
                                  "验证码发送失败，请稍后重试"
                              )
                            );
                          e.isGetSmsCode = !0;
                          var i = +a.data.status;
                          if (0 === i) {
                            e.$toast(
                              "验证码已发送手机: " + e.$store.state.auth.account
                            ),
                              (e.smsOncePage = !0),
                              e.smsCD.start();
                            var o = t.target;
                            o &&
                              o.previousElementSibling &&
                              o.previousElementSibling.focus();
                          } else e.smsCD.stop(), e.$toast(g.a.getMessage(i, "safe") || "验证码发送失败，请稍后重试");
                        })
                        .catch(function () {
                          e.smsCD.stop();
                        });
                  }
                } else this.$toast("网络异常，请稍后重试");
              },
              verifySmsCode: function () {
                var t = this;
                return Object(o.a)(
                  Object(i.a)().m(function e() {
                    var a, o, n, s;
                    return Object(i.a)().w(
                      function (e) {
                        for (;;)
                          switch ((e.p = e.n)) {
                            case 0:
                              return (e.n = 1), t.getSyncRSAKey();
                            case 1:
                              if ((a = e.v).isOk) {
                                e.n = 2;
                                break;
                              }
                              return e.a(2, !1);
                            case 2:
                              return (
                                (e.p = 2),
                                (o = {
                                  safeBoxVerAppPwdReq: {
                                    secinfo: p.a.RSAEncrypt(
                                      t.smsCode,
                                      a.rsaKey
                                    ),
                                  },
                                }),
                                Object(S.h)() &&
                                  ((n = ""
                                    .concat(t.random)
                                    .concat(t.$store.state.auth.userDomainId)
                                    .concat(t.smsCode)),
                                  (o = { idenCode: d()(n) })),
                                (e.n = 3),
                                Object(c.v)(o)
                              );
                            case 3:
                              if ((s = e.v).success) {
                                e.n = 4;
                                break;
                              }
                              return (
                                t.$toast(
                                  g.a.getMessage(s.status, "safe") ||
                                    "验证码校验失败，请稍后重试"
                                ),
                                e.a(2, !1)
                              );
                            case 4:
                              return (
                                Object(S.h)() && (t.ticket = s.data.ticket),
                                e.a(2, !0)
                              );
                            case 5:
                              return (e.p = 5), e.v, e.a(2, !1);
                          }
                      },
                      e,
                      null,
                      [[2, 5]]
                    );
                  })
                )();
              },
              sendEmailCode: function (t) {
                var e = this;
                return Object(o.a)(
                  Object(i.a)().m(function a() {
                    var o, n, s, r;
                    return Object(i.a)().w(function (a) {
                      for (;;)
                        switch (a.n) {
                          case 0:
                            if (e.isOnline) {
                              a.n = 1;
                              break;
                            }
                            return e.$toast("网络异常，请稍后重试"), a.a(2);
                          case 1:
                            if (!t) {
                              a.n = 3;
                              break;
                            }
                            if ((o = e.emailAccount || "").length) {
                              a.n = 2;
                              break;
                            }
                            return e.$toast("请输入邮箱"), a.a(2);
                          case 2:
                            if (x.test(o)) {
                              a.n = 3;
                              break;
                            }
                            return e.$toast("邮箱格式错误，请重新输入"), a.a(2);
                          case 3:
                            if (!(e.emailCountdown > 0)) {
                              a.n = 4;
                              break;
                            }
                            return a.a(2);
                          case 4:
                            e.emailCD.setSeconds(60),
                              (e.emailRandom = Object(l.q)(6)),
                              Object(S.h)() &&
                                (e.emailRandom = p.a.getRandomSring(32)),
                              (n = {
                                getSecMailIdenCodeReq: {
                                  secMail: e.emailAccount,
                                  random: e.emailRandom,
                                },
                              }),
                              Object(S.h)() && !e.hasSafeGuard
                                ? ((s = {}),
                                  (r = y.a),
                                  (s.random = e.emailRandom),
                                  (s.secMail = e.emailAccount),
                                  (s.ticket = e.ticket),
                                  e.hasSafe || ((r = y.d), (s.ticket = void 0)),
                                  r(s)
                                    .then(function (t) {
                                      if (!t.success)
                                        return (
                                          e.$toast(
                                            g.a.getMessage(t.status, "safe") ||
                                              "邮件验证码发送失败，请重试"
                                          ),
                                          void e.emailCD.stop()
                                        );
                                      (e.isGetEmailCode = !0),
                                        e.emailCD.start(),
                                        (e.emailOncePage = !0),
                                        e.$toast("验证码已发送至对应邮箱");
                                    })
                                    .catch(function () {
                                      e.emailCD.stop();
                                    }))
                                : Object(c.r)(n)
                                    .then(function (t) {
                                      if (!t.success)
                                        return (
                                          e.$toast(
                                            g.a.getMessage(t.status, "safe") ||
                                              "邮件验证码发送失败，请重试"
                                          ),
                                          void e.emailCD.stop()
                                        );
                                      (e.isGetEmailCode = !0),
                                        e.emailCD.start(),
                                        (e.emailOncePage = !0),
                                        e.$toast("验证码已发送至对应邮箱");
                                    })
                                    .catch(function () {
                                      e.emailCD.stop();
                                    });
                          case 5:
                            return a.a(2);
                        }
                    }, a);
                  })
                )();
              },
              checkEmailAccount: function () {
                var t = this;
                return Object(o.a)(
                  Object(i.a)().m(function e() {
                    var a, o, n;
                    return Object(i.a)().w(
                      function (e) {
                        for (;;)
                          switch ((e.p = e.n)) {
                            case 0:
                              if (!t.emailAccoutChecking) {
                                e.n = 1;
                                break;
                              }
                              return e.a(2, !1);
                            case 1:
                              if (
                                ((t.emailAccoutChecking = !0), (a = t.emails))
                              ) {
                                e.n = 6;
                                break;
                              }
                              return (e.p = 2), (e.n = 3), Object(c.g)();
                            case 3:
                              if (
                                ((o = e.v),
                                (t.emailAccoutChecking = !1),
                                o.success)
                              ) {
                                e.n = 4;
                                break;
                              }
                              return (
                                t.$toast(
                                  g.a.getMessage(o.status, "safe") ||
                                    "邮箱检测失败，请重试"
                                ),
                                e.a(2, !1)
                              );
                            case 4:
                              (a =
                                o.data.querySecMailAddListRes.secMailAddList ||
                                []),
                                (t.emails = a),
                                (e.n = 6);
                              break;
                            case 5:
                              return (
                                (e.p = 5),
                                e.v,
                                (t.emailAccoutChecking = !1),
                                e.a(2, !1)
                              );
                            case 6:
                              if (
                                ((t.emailAccoutChecking = !1),
                                (n = t.emailAccount),
                                !a.find(function (t) {
                                  return t === n;
                                }))
                              ) {
                                e.n = 7;
                                break;
                              }
                              return (
                                t.$toast(
                                  "不支持使用当前中国移动云盘账号对应的139邮箱，请重新填写"
                                ),
                                e.a(2, !1)
                              );
                            case 7:
                              return e.a(2, !0);
                          }
                      },
                      e,
                      null,
                      [[2, 5]]
                    );
                  })
                )();
              },
              verifyEmailCode: function () {
                var t = this;
                return Object(o.a)(
                  Object(i.a)().m(function e() {
                    var a, o, s, r, l, u, f, h, m, p, b, v;
                    return Object(i.a)().w(
                      function (e) {
                        for (;;)
                          switch ((e.p = e.n)) {
                            case 0:
                              if (t.emailRandom) {
                                e.n = 1;
                                break;
                              }
                              return (
                                t.$toast("请点击获取邮箱验证码"), e.a(2, !1)
                              );
                            case 1:
                              if (t.hasSafe || !Object(S.h)()) {
                                e.n = 2;
                                break;
                              }
                              return e.a(2, !0);
                            case 2:
                              if (
                                ((a = ""
                                  .concat(t.emailRandom)
                                  .concat(t.realAccount)
                                  .concat(t.emailCode)),
                                (o = ""
                                  .concat(a)
                                  .concat(Math.floor(Date.now() / 1e3 / 300))
                                  .concat(t.emailAccount)) !==
                                  t.oldEmailPalinText)
                              ) {
                                e.n = 3;
                                break;
                              }
                              return e.a(2, !0);
                            case 3:
                              if (!t.emailCodeVerifying) {
                                e.n = 4;
                                break;
                              }
                              return e.a(2, !1);
                            case 4:
                              if (
                                ((t.emailCodeVerifying = !0),
                                (s = {
                                  verSecMailIdenCodeReq: {
                                    secMail: t.emailAccount,
                                    secinfo: d()(a).toUpperCase(),
                                  },
                                }),
                                Object(S.h)() &&
                                  ((r = ""
                                    .concat(t.emailRandom)
                                    .concat(t.$store.state.auth.userDomainId)
                                    .concat(t.emailCode)),
                                  (s = {
                                    verSecMailIdenCodeReq: { idenCode: d()(r) },
                                  })),
                                (e.p = 5),
                                !Object(S.h)() || t.hasSafeGuard)
                              ) {
                                e.n = 7;
                                break;
                              }
                              return (
                                (u = ""
                                  .concat(t.emailRandom)
                                  .concat(t.$store.state.auth.userDomainId)
                                  .concat(t.emailCode)),
                                (f = d()(u)),
                                (h = Object(n.a)({}, { idenCode: f })),
                                (e.n = 6),
                                Object(y.h)(h)
                              );
                            case 6:
                              (l = e.v), (e.n = 9);
                              break;
                            case 7:
                              return (e.n = 8), Object(c.w)(s);
                            case 8:
                              (l = e.v).data.ticket &&
                                (t.ticket = l.data.ticket);
                            case 9:
                              if (((t.emailCodeVerifying = !1), l.success)) {
                                e.n = 10;
                                break;
                              }
                              return (
                                (p = (m = l).status),
                                (b = m.message),
                                (v = void 0 === b ? "" : b),
                                208000400 == +p && v.includes("address format")
                                  ? t.$toast("邮箱格式错误或不存在")
                                  : t.$toast(
                                      g.a.getMessage(p, "safe") ||
                                        "邮箱验证码校验失败，请重试"
                                    ),
                                e.a(2, !1)
                              );
                            case 10:
                              return (t.oldEmailPalinText = o), e.a(2, !0);
                            case 11:
                              return (
                                (e.p = 11),
                                e.v,
                                (t.emailCodeVerifying = !1),
                                e.a(2, !1)
                              );
                          }
                      },
                      e,
                      null,
                      [[5, 11]]
                    );
                  })
                )();
              },
              onForget: function () {
                I.a.fmDataReport(
                  { page_title: "保险箱", click_object: "忘记密码" },
                  "page_click"
                ),
                  (this.guardSteps = B),
                  this.resetParams();
              },
              getSyncRSAKey: function () {
                var t = this;
                return Object(o.a)(
                  Object(i.a)().m(function e() {
                    var a, o;
                    return Object(i.a)().w(
                      function (e) {
                        for (;;)
                          switch ((e.p = e.n)) {
                            case 0:
                              if (!t.RSAKey) {
                                e.n = 1;
                                break;
                              }
                              return e.a(2, { isOk: !0, rsaKey: t.RSAKey });
                            case 1:
                              return (e.p = 1), (e.n = 2), Object(r.f)(2);
                            case 2:
                              if ((a = e.v).success) {
                                e.n = 3;
                                break;
                              }
                              return e.a(2, {
                                isOk: !1,
                                msg: g.a.getMessage(a.status, "safe"),
                              });
                            case 3:
                              return (
                                t.$store.commit(
                                  "safe/setRSAKey",
                                  a.data.publicKey
                                ),
                                e.a(2, { isOk: !0, rsaKey: a.data.publicKey })
                              );
                            case 4:
                              return (
                                (e.p = 4),
                                (o = e.v),
                                e.a(2, { isOk: !1, error: o })
                              );
                          }
                      },
                      e,
                      null,
                      [[1, 4]]
                    );
                  })
                )();
              },
              onSetSafe: function (t) {
                var e = this;
                if (!this.isSetSafeRequesting) {
                  this.isSetSafeRequesting = !0;
                  var a = { newPwd: this.selfCode0, pwdType: 1 },
                    i = this.hasSafe,
                    o = function () {
                      if (!e.hasSafeGuard) {
                        var o = e.questions,
                          n = e.answers,
                          s = o.map(function (t, a) {
                            return {
                              quesID: t.quesID,
                              quesContent: t.quesContent,
                              quesContentAnswer: p.a.RSAEncrypt(n[a], e.RSAKey),
                            };
                          });
                        (a.secMail = e.emailAccount),
                          (a.secQuestionList = [
                            { quesGroupID: "001", quesIDList: s },
                          ]);
                      }
                      var r = { safeBoxSetAppPwdReq: a };
                      if (Object(S.h)())
                        if (i)
                          r = {
                            encryptedPin: p.a.aesCbcEncrypt(e.selfCode0),
                            encryptedKey: p.a.rsaPK1v15Encrypt(e.RSAKey),
                            ticket: e.ticket,
                          };
                        else {
                          var c = ""
                            .concat(e.emailRandom)
                            .concat(e.$store.state.auth.userDomainId)
                            .concat(e.emailCode);
                          r = {
                            encryptedPin: p.a.aesCbcEncrypt(e.selfCode0),
                            encryptedKey: p.a.rsaPK1v15Encrypt(e.RSAKey),
                            questionGroups: e.getPDSQuestions(),
                            idenCode: d()(c).toLowerCase(),
                          };
                        }
                      e.updateSafeBox(r)
                        .then(function (a) {
                          0 !== a.status
                            ? e.$toast(
                                a.msg ||
                                  g.a.getMessage(a.status, "safe") ||
                                  "保险箱设置失败"
                              )
                            : (Object(S.h)() &&
                                a.ticket &&
                                ((e.ticket = a.ticket),
                                (e.appSessionID = a.appSessionID)),
                              (e.isActivation = !i),
                              t && t(!0),
                              e.$store.commit("safe/_setGuardStatus", -2));
                        })
                        .finally(function () {
                          e.isSetSafeRequesting = !1;
                        });
                    };
                  this.RSAKey
                    ? ((a.newPwd = p.a.RSAEncrypt(a.newPwd, this.RSAKey)), o())
                    : this.getSyncRSAKey()
                        .then(function (t) {
                          if (!t.isOk)
                            return (
                              (e.isSetSafeRequesting = !1),
                              void (!t.error && e.$toast(t.msg || "设置失败"))
                            );
                          (a.newPwd = p.a.RSAEncrypt(a.newPwd, t.rsaKey)), o();
                        })
                        .catch(function () {
                          e.isSetSafeRequesting = !1;
                        });
                }
              },
              onSetHasSafePw: function (t) {
                var e = this;
                if (!this.isSetSafeRequesting) {
                  this.isSetSafeRequesting = !0;
                  var a = function () {
                    var a = {
                      encryptedPin: p.a.aesCbcEncrypt(e.selfCode0),
                      encryptedKey: p.a.rsaPK1v15Encrypt(e.RSAKey),
                    };
                    e.updateSafeBox(a)
                      .then(function (a) {
                        0 !== a.status
                          ? e.$toast(
                              a.msg ||
                                g.a.getMessage(a.status, "safe") ||
                                "保险箱设置失败"
                            )
                          : (Object(S.h)() &&
                              a.ticket &&
                              ((e.ticket = a.ticket),
                              (e.appSessionID = a.appSessionID)),
                            (e.isActivation = !e.hasSafe),
                            t && t(!0),
                            e.$store.commit("safe/_setGuardStatus", -2));
                      })
                      .finally(function () {
                        e.isSetSafeRequesting = !1;
                      });
                  };
                  this.RSAKey
                    ? a()
                    : this.getSyncRSAKey()
                        .then(function (t) {
                          if (!t.isOk)
                            return (
                              (e.isSetSafeRequesting = !1),
                              void (!t.error && e.$toast(t.msg || "设置失败"))
                            );
                          a();
                        })
                        .catch(function () {
                          e.isSetSafeRequesting = !1;
                        });
                }
              },
              jumpAPP: function () {
                I.a.fmDataReport(
                  { page_title: "保险箱", click_object: "前往APP使用" },
                  "page_click"
                ),
                  Object(l.g)(this);
              },
              onLoginSafebox: function () {
                var t = this;
                if (!this.isSafeLogining) {
                  this.isSafeLogining = !0;
                  var e = {
                      safeBoxAppLoginReq: { pwd: this.selfCode0, pwdType: 1 },
                    },
                    a = function () {
                      Object(S.h)()
                        ? (e = {
                            isUserIdentifiId: !1,
                            encryptedPin: p.a.aesCbcEncrypt(
                              e.safeBoxAppLoginReq.pwd
                            ),
                            encryptedKey: p.a.rsaPK1v15Encrypt(t.RSAKey),
                          })
                        : (e.safeBoxAppLoginReq.pwd = p.a.RSAEncrypt(
                            e.safeBoxAppLoginReq.pwd,
                            t.RSAKey
                          )),
                        t
                          .loginSafeBox(e)
                          .then(function (e) {
                            if (0 !== e.status) {
                              var a = e.msg || g.a.getMessage(e.status, "safe");
                              t.$toast(a || "登录失败");
                            } else t.resetParams();
                          })
                          .finally(function () {
                            t.isSafeLogining = !1;
                          });
                    };
                  this.RSAKey
                    ? a()
                    : this.getSyncRSAKey()
                        .then(function (e) {
                          if (!e.isOk)
                            return (
                              (t.isSafeLogining = !1),
                              void (!e.error && t.$toast(e.msg || "登录失败"))
                            );
                          a();
                        })
                        .catch(function () {
                          t.isSafeLogining = !1;
                        });
                }
              },
              onClose: function () {
                this.resetParams(), this.$emit("close");
              },
              onEnterSafebox: function () {
                this.$emit("safe", this.isActivation),
                  this.isActivation
                    ? this.$toast("保险箱激活成功")
                    : this.$toast("保险箱密码修改成功"),
                  I.a.fmDataReport(
                    { page_title: "保险箱", click_object: "进入保险箱" },
                    "page_click"
                  ),
                  this.initGuardStep(),
                  this.resetParams();
              },
              setSecQuestions: function () {
                var t = this;
                return Object(o.a)(
                  Object(i.a)().m(function e() {
                    var a, o, n;
                    return Object(i.a)().w(function (e) {
                      for (;;)
                        switch (e.n) {
                          case 0:
                            return (
                              (a = t.getPDSQuestions()),
                              (o = {
                                questionGroups: a,
                                ticket: t.ticket,
                                appSessionID: t.appSessionID,
                              }),
                              (e.n = 1),
                              Object(y.i)(o)
                            );
                          case 1:
                            if ("faild" !== (n = e.v)) {
                              e.n = 2;
                              break;
                            }
                            return (
                              t.$toast.error("网络异常，请稍后再试", !0),
                              e.a(2, !1)
                            );
                          case 2:
                            if (
                              !n ||
                              !n.result ||
                              "0" !== n.result.resultCode
                            ) {
                              e.n = 3;
                              break;
                            }
                            return e.a(2, !0);
                          case 3:
                            return e.a(2);
                        }
                    }, e);
                  })
                )();
              },
              getPDSQuestions: function () {
                var t = this,
                  e = this.questions,
                  a = this.answers,
                  i = e.map(function (e, i) {
                    return {
                      quesID: e.quesID,
                      quesContent: e.quesContent,
                      quesContentAnswer: p.a.RSAEncrypt(a[i], t.RSAKey),
                    };
                  });
                e = [];
                var o = 1;
                return (
                  i.map(function (a) {
                    var i = {};
                    (i.questionId = a.quesID),
                      (i.questionContent = a.quesContent),
                      (i.encryptedAnswer = p.a.aesCbcEncrypt(
                        a.quesContentAnswer
                      )),
                      (i.encryptedKey = p.a.rsaPK1v15Encrypt(t.RSAKey)),
                      e.push({ questionGroupId: o.toString(), questions: [i] }),
                      o++;
                  }),
                  e
                );
              },
            },
            Object(s.b)({
              updateSafeBox: "safe/updateSafeBox",
              loginSafeBox: "safe/loginSafeBox",
            })
          ),
          beforeDestroy: function () {
            this.smsCD.release(),
              this.emailCD.release(),
              (this.smsCD = null),
              (this.emailCD = null),
              C.eventBus.$off("clearSafeBoxTimeCount");
          },
        },
        P =
          (a("165e"),
          a("55b4"),
          Object(v.a)(
            j,
            function () {
              var t = this,
                e = t._self._c;
              return t.isSafeChecked
                ? e(
                    "div",
                    {
                      class: [
                        "safe-auth",
                        t.hasSafe ? "safe-activated" : "safe-deactivated",
                      ],
                    },
                    [
                      e("com-title-bar", {
                        class: { "back-none": !t.backVisible },
                        attrs: { visible: !0, title: t.title, autoBack: !1 },
                        on: { "go-back": t.onPreviousStep },
                        scopedSlots: t._u(
                          [
                            t.backVisible
                              ? null
                              : {
                                  key: "default",
                                  fn: function () {
                                    return [
                                      e("button", {
                                        staticClass: "auth-close",
                                        on: { click: t.onClose },
                                      }),
                                    ];
                                  },
                                  proxy: !0,
                                },
                          ],
                          null,
                          !0
                        ),
                      }),
                      e("div", { staticClass: "auth-body" }, [
                        e(
                          "div",
                          { staticClass: "scroll" },
                          [
                            "pw" === t.currentStep ||
                            "settingPw" === t.currentStep
                              ? [
                                  t.hasSafe
                                    ? e("div", {
                                        staticClass: "safe-image newPassword",
                                      })
                                    : e("div", {
                                        staticClass: "safe-image password",
                                      }),
                                  e("div", { staticClass: "inputs-wrapper" }, [
                                    e("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: t.selfCode0,
                                          expression: "selfCode0",
                                        },
                                        {
                                          name: "placeholder",
                                          rawName: "v-placeholder",
                                          value: "请输入"
                                            .concat(t.PW_MIN, "～")
                                            .concat(t.PW_MAX, "位密码"),
                                          expression:
                                            "`请输入${PW_MIN}～${PW_MAX}位密码`",
                                        },
                                      ],
                                      attrs: {
                                        type: "password",
                                        maxlength: "21",
                                        "data-hecaiyun-click": "",
                                      },
                                      domProps: { value: t.selfCode0 },
                                      on: {
                                        input: function (e) {
                                          e.target.composing ||
                                            (t.selfCode0 = e.target.value);
                                        },
                                      },
                                    }),
                                    e("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: t.selfCode1,
                                          expression: "selfCode1",
                                        },
                                        {
                                          name: "placeholder",
                                          rawName: "v-placeholder",
                                          value: "请再次输入密码",
                                          expression: "'请再次输入密码'",
                                        },
                                      ],
                                      attrs: {
                                        type: "password",
                                        maxlength: "21",
                                      },
                                      domProps: { value: t.selfCode1 },
                                      on: {
                                        input: function (e) {
                                          e.target.composing ||
                                            (t.selfCode1 = e.target.value);
                                        },
                                      },
                                    }),
                                  ]),
                                  e(
                                    "button",
                                    {
                                      staticClass: "auth-next",
                                      attrs: { disabled: t.pwNextDisabled },
                                      on: {
                                        click: function (e) {
                                          return t.onNextStep();
                                        },
                                      },
                                    },
                                    [
                                      t._v(
                                        t._s(
                                          t.hasSafe && t.isSetPin
                                            ? "确定"
                                            : t.hasSafe && !t.isSetPin
                                            ? "设置密码"
                                            : "下一步"
                                        )
                                      ),
                                    ]
                                  ),
                                  t.hasSafe
                                    ? t._e()
                                    : e(
                                        "div",
                                        {
                                          directives: [
                                            {
                                              name: "show",
                                              rawName: "v-show",
                                              value: t.simSupport,
                                              expression: "simSupport",
                                            },
                                          ],
                                          staticClass: "sim-tip",
                                        },
                                        [
                                          t._v(
                                            " 首次使用保险箱，推荐您使用中国移动专享SIM盾服务，为您的保险箱提供金融级安全保障！ "
                                          ),
                                          e(
                                            "span",
                                            {
                                              directives: [
                                                {
                                                  name: "log",
                                                  rawName: "v-log",
                                                  value: {
                                                    key: "StrongboxSIMGuide",
                                                    dsc: "SIM盾访问引导点击量",
                                                  },
                                                  expression:
                                                    "{key:'StrongboxSIMGuide',dsc:'SIM盾访问引导点击量'}",
                                                },
                                              ],
                                              attrs: {
                                                "data-hecaiyun-click": "",
                                              },
                                              on: { click: t.jumpAPP },
                                            },
                                            [t._v("前往中国移动云盘APP使用>")]
                                          ),
                                        ]
                                      ),
                                ]
                              : "email" === t.currentStep
                              ? [
                                  t.hasSafeGuard
                                    ? [
                                        e("div", {
                                          staticClass:
                                            "safe-image-small verify-email",
                                        }),
                                        e(
                                          "div",
                                          { staticClass: "input-wrapper" },
                                          [
                                            e("div", { staticClass: "text" }, [
                                              t._v(
                                                "验证码将发送至您的邮箱：" +
                                                  t._s(t.maskEmail)
                                              ),
                                            ]),
                                          ]
                                        ),
                                        e(
                                          "div",
                                          { staticClass: "input-wrapper" },
                                          [
                                            e("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value: t.emailCode,
                                                  expression: "emailCode",
                                                },
                                                {
                                                  name: "placeholder",
                                                  rawName: "v-placeholder",
                                                  value: "请输入验证码",
                                                  expression: "'请输入验证码'",
                                                },
                                              ],
                                              attrs: { maxlength: "6" },
                                              domProps: { value: t.emailCode },
                                              on: {
                                                input: function (e) {
                                                  e.target.composing ||
                                                    (t.emailCode =
                                                      e.target.value);
                                                },
                                              },
                                            }),
                                            e(
                                              "button",
                                              {
                                                attrs: {
                                                  disabled:
                                                    t.emailCountdown > 0,
                                                },
                                                on: {
                                                  click: function (e) {
                                                    return t.sendEmailCode();
                                                  },
                                                },
                                              },
                                              [t._v(t._s(t.emailCountdownText))]
                                            ),
                                          ]
                                        ),
                                      ]
                                    : [
                                        e("div", {
                                          staticClass: "safe-image set-email",
                                        }),
                                        e(
                                          "div",
                                          { staticClass: "input-wrapper" },
                                          [
                                            e("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value: t.emailAccount,
                                                  expression: "emailAccount",
                                                },
                                                {
                                                  name: "placeholder",
                                                  rawName: "v-placeholder",
                                                  value: "请输入邮箱",
                                                  expression: "'请输入邮箱'",
                                                },
                                              ],
                                              key: "emial-account",
                                              attrs: { maxlength: "35" },
                                              domProps: {
                                                value: t.emailAccount,
                                              },
                                              on: {
                                                input: function (e) {
                                                  e.target.composing ||
                                                    (t.emailAccount =
                                                      e.target.value);
                                                },
                                              },
                                            }),
                                            e(
                                              "button",
                                              {
                                                class: {
                                                  disableButton:
                                                    !t.emailAccount ||
                                                    t.emailCountdown > 0,
                                                },
                                                attrs: {
                                                  disabled:
                                                    t.emailCountdown > 0 ||
                                                    !t.emailAccount,
                                                },
                                                on: {
                                                  click: function (e) {
                                                    return t.sendEmailCode(!0);
                                                  },
                                                },
                                              },
                                              [t._v(t._s(t.emailCountdownText))]
                                            ),
                                          ]
                                        ),
                                        e(
                                          "div",
                                          { staticClass: "input-wrapper" },
                                          [
                                            e("input", {
                                              directives: [
                                                {
                                                  name: "model",
                                                  rawName: "v-model",
                                                  value: t.emailCode,
                                                  expression: "emailCode",
                                                },
                                                {
                                                  name: "placeholder",
                                                  rawName: "v-placeholder",
                                                  value: "请输入验证码",
                                                  expression: "'请输入验证码'",
                                                },
                                              ],
                                              attrs: { maxlength: "6" },
                                              domProps: { value: t.emailCode },
                                              on: {
                                                input: function (e) {
                                                  e.target.composing ||
                                                    (t.emailCode =
                                                      e.target.value);
                                                },
                                              },
                                            }),
                                          ]
                                        ),
                                      ],
                                  e(
                                    "button",
                                    {
                                      staticClass: "auth-next",
                                      staticStyle: { "margin-top": "5rem" },
                                      attrs: { disabled: t.emailNextDisabled },
                                      on: {
                                        click: function (e) {
                                          return t.onNextStep();
                                        },
                                      },
                                    },
                                    [t._v("下一步")]
                                  ),
                                  e("div", { staticClass: "sim-tip" }, [
                                    t._v(
                                      " 为提高保险箱安全性，建议使用非当前中国移动云盘账号对应139邮箱作为安全邮箱！ "
                                    ),
                                  ]),
                                ]
                              : "phone" === t.currentStep
                              ? [
                                  e("div", {
                                    staticClass:
                                      "safe-image-small verify-phone",
                                  }),
                                  e("div", { staticClass: "input-wrapper" }, [
                                    e(
                                      "div",
                                      {
                                        staticClass: "text",
                                        staticStyle: { padding: "0" },
                                      },
                                      [
                                        t._v(
                                          "验证码将发送至手机：" +
                                            t._s(t.maskPhone)
                                        ),
                                      ]
                                    ),
                                  ]),
                                  e("div", { staticClass: "input-wrapper" }, [
                                    e("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: t.smsCode,
                                          expression: "smsCode",
                                        },
                                        {
                                          name: "placeholder",
                                          rawName: "v-placeholder",
                                          value: "请输入验证码",
                                          expression: "'请输入验证码'",
                                        },
                                      ],
                                      attrs: { maxlength: "6" },
                                      domProps: { value: t.smsCode },
                                      on: {
                                        input: function (e) {
                                          e.target.composing ||
                                            (t.smsCode = e.target.value);
                                        },
                                      },
                                    }),
                                    e(
                                      "button",
                                      {
                                        attrs: { disabled: t.smsCountdown > 0 },
                                        on: {
                                          click: function (e) {
                                            return t.getSmsCode(e);
                                          },
                                        },
                                      },
                                      [t._v(t._s(t.smsCountdownText))]
                                    ),
                                  ]),
                                  e(
                                    "button",
                                    {
                                      staticClass: "auth-next",
                                      staticStyle: { "margin-top": "5rem" },
                                      attrs: { disabled: t.phoneNextDisabled },
                                      on: {
                                        click: function (e) {
                                          return t.onNextStep();
                                        },
                                      },
                                    },
                                    [t._v("下一步")]
                                  ),
                                ]
                              : "qa" === t.currentStep
                              ? [
                                  t.hasSafeGuard
                                    ? e(
                                        "div",
                                        { staticClass: "auth-question" },
                                        [
                                          e("div", {
                                            staticClass:
                                              "safe-image-small verify-question",
                                          }),
                                          t.questions[0]
                                            ? e(
                                                "div",
                                                {
                                                  staticClass: "input-wrapper",
                                                },
                                                [
                                                  e(
                                                    "div",
                                                    {
                                                      staticClass:
                                                        "text text-border",
                                                      staticStyle: {
                                                        "padding-right": "6rem",
                                                      },
                                                    },
                                                    [
                                                      t._v(
                                                        t._s(
                                                          t.questions[0].label
                                                        )
                                                      ),
                                                    ]
                                                  ),
                                                  e(
                                                    "button",
                                                    {
                                                      on: {
                                                        click:
                                                          t.onChangeQuestion,
                                                      },
                                                    },
                                                    [t._v("换一个")]
                                                  ),
                                                ]
                                              )
                                            : t._e(),
                                          e(
                                            "div",
                                            { staticClass: "input-wrapper" },
                                            [
                                              e("input", {
                                                directives: [
                                                  {
                                                    name: "model",
                                                    rawName: "v-model",
                                                    value: t.answers[0],
                                                    expression: "answers[0]",
                                                  },
                                                  {
                                                    name: "placeholder",
                                                    rawName: "v-placeholder",
                                                    value: "请输入问题答案",
                                                    expression:
                                                      "'请输入问题答案'",
                                                  },
                                                ],
                                                attrs: { maxlength: "21" },
                                                domProps: {
                                                  value: t.answers[0],
                                                },
                                                on: {
                                                  input: function (e) {
                                                    e.target.composing ||
                                                      t.$set(
                                                        t.answers,
                                                        0,
                                                        e.target.value
                                                      );
                                                  },
                                                },
                                              }),
                                            ]
                                          ),
                                        ]
                                      )
                                    : e(
                                        "div",
                                        t._l(t.questionList, function (a, i) {
                                          return e(
                                            "div",
                                            {
                                              key: i,
                                              staticClass: "question-item",
                                            },
                                            [
                                              e("p", [
                                                t._v(
                                                  "问题" +
                                                    t._s(
                                                      t._f("cnIndexFilter")(i)
                                                    )
                                                ),
                                              ]),
                                              e("com-dropdown", {
                                                attrs: {
                                                  dropMode: "action-sheet",
                                                  currentKey:
                                                    t.questions[i].key,
                                                  options: a,
                                                },
                                                on: {
                                                  select: function (e) {
                                                    return t.handleSelect(
                                                      arguments,
                                                      i
                                                    );
                                                  },
                                                },
                                              }),
                                              e("input", {
                                                directives: [
                                                  {
                                                    name: "model",
                                                    rawName: "v-model",
                                                    value: t.answers[i],
                                                    expression:
                                                      "answers[index]",
                                                  },
                                                  {
                                                    name: "placeholder",
                                                    rawName: "v-placeholder",
                                                    value: "请输入答案".concat(
                                                      t.$options.filters.cnIndexFilter(
                                                        i
                                                      )
                                                    ),
                                                    expression:
                                                      "`请输入答案${$options.filters.cnIndexFilter(index)}`",
                                                  },
                                                ],
                                                attrs: { maxlength: "21" },
                                                domProps: {
                                                  value: t.answers[i],
                                                },
                                                on: {
                                                  input: function (e) {
                                                    e.target.composing ||
                                                      t.$set(
                                                        t.answers,
                                                        i,
                                                        e.target.value
                                                      );
                                                  },
                                                },
                                              }),
                                            ],
                                            1
                                          );
                                        }),
                                        0
                                      ),
                                  e(
                                    "button",
                                    {
                                      staticClass: "auth-next",
                                      style: t.hasSafe
                                        ? "margin-top: 5rem;"
                                        : "margin-top: 3rem;",
                                      attrs: { disabled: t.qaNextDisabled },
                                      on: {
                                        click: function (e) {
                                          return t.onNextStep();
                                        },
                                      },
                                    },
                                    [
                                      t._v(
                                        t._s(
                                          t.hasSafe || t.isPDSUser
                                            ? "下一步"
                                            : "提交"
                                        )
                                      ),
                                    ]
                                  ),
                                ]
                              : "choice" === t.currentStep
                              ? [
                                  e(
                                    "div",
                                    {
                                      staticClass: "auth-type-item flex-row",
                                      on: {
                                        click: function (e) {
                                          return t.onNextStep();
                                        },
                                      },
                                    },
                                    [
                                      e("img", {
                                        staticClass: "type-icon",
                                        attrs: { src: a("e1d5"), alt: "" },
                                      }),
                                      e(
                                        "div",
                                        {
                                          staticClass: "type-content flex-one",
                                        },
                                        [
                                          e("p", [t._v(t._s(t.maskEmail))]),
                                          e("p", [
                                            t._v("通过安全邮箱验证身份"),
                                          ]),
                                        ]
                                      ),
                                      e("img", {
                                        staticClass: "type-pointer",
                                        attrs: { src: a("287d"), alt: "" },
                                      }),
                                    ]
                                  ),
                                  t.secQuestionList && t.secQuestionList.length
                                    ? e(
                                        "div",
                                        {
                                          staticClass:
                                            "auth-type-item flex-row",
                                          on: {
                                            click: function (e) {
                                              return t.onNextStep({
                                                nextStep: "qa",
                                              });
                                            },
                                          },
                                        },
                                        [
                                          e("img", {
                                            staticClass: "type-icon",
                                            attrs: { src: a("8740"), alt: "" },
                                          }),
                                          t._m(0),
                                          e("img", {
                                            staticClass: "type-pointer",
                                            attrs: { src: a("287d"), alt: "" },
                                          }),
                                        ]
                                      )
                                    : t._e(),
                                ]
                              : "success" === t.currentStep
                              ? e("div", [
                                  t._m(1),
                                  e(
                                    "button",
                                    {
                                      staticClass: "auth-next",
                                      staticStyle: { "margin-top": "5rem" },
                                      on: { click: t.onEnterSafebox },
                                    },
                                    [
                                      t._v(
                                        t._s(
                                          t.hasCloseFunc
                                            ? "保险箱激活成功"
                                            : "进入保险箱"
                                        )
                                      ),
                                    ]
                                  ),
                                ])
                              : "login" === t.currentStep
                              ? [
                                  e("div", {
                                    staticClass: "safe-image password",
                                  }),
                                  e("div", { staticClass: "input-wrapper" }, [
                                    e("input", {
                                      directives: [
                                        {
                                          name: "model",
                                          rawName: "v-model",
                                          value: t.selfCode0,
                                          expression: "selfCode0",
                                        },
                                        {
                                          name: "placeholder",
                                          rawName: "v-placeholder",
                                          value: "请输入保险箱密码",
                                          expression: "'请输入保险箱密码'",
                                        },
                                      ],
                                      attrs: {
                                        type: "password",
                                        maxlength: "21",
                                      },
                                      domProps: { value: t.selfCode0 },
                                      on: {
                                        input: function (e) {
                                          e.target.composing ||
                                            (t.selfCode0 = e.target.value);
                                        },
                                      },
                                    }),
                                  ]),
                                  e(
                                    "div",
                                    { staticClass: "flex-row auth-menus" },
                                    [
                                      e(
                                        "div",
                                        { staticClass: "flex-one right" },
                                        [
                                          e(
                                            "button",
                                            {
                                              directives: [
                                                {
                                                  name: "log",
                                                  rawName: "v-log",
                                                  value: {
                                                    key: "StrongboxForgetpassword",
                                                    dsc: "忘记密码",
                                                  },
                                                  expression:
                                                    "{key:'StrongboxForgetpassword',dsc:'忘记密码'}",
                                                },
                                              ],
                                              on: { click: t.onForget },
                                            },
                                            [t._v("忘记密码？")]
                                          ),
                                        ]
                                      ),
                                    ]
                                  ),
                                  e(
                                    "button",
                                    {
                                      directives: [
                                        {
                                          name: "log",
                                          rawName: "v-log",
                                          value: {
                                            key: "StrongboxLogin",
                                            dsc: "保险箱登陆按钮点击",
                                          },
                                          expression:
                                            "{key:'StrongboxLogin',dsc:'保险箱登陆按钮点击'}",
                                        },
                                      ],
                                      staticClass: "auth-next",
                                      staticStyle: { "margin-top": "2.6rem" },
                                      attrs: { disabled: t.loginNextDisabled },
                                      on: {
                                        click: function (e) {
                                          return t.onNextStep();
                                        },
                                      },
                                    },
                                    [t._v("进入保险箱")]
                                  ),
                                  e(
                                    "div",
                                    {
                                      directives: [
                                        {
                                          name: "show",
                                          rawName: "v-show",
                                          value: t.simSupport,
                                          expression: "simSupport",
                                        },
                                      ],
                                      staticClass: "sim-tip",
                                    },
                                    [
                                      t._v(
                                        " 推荐您使用中国移动专享SIM盾服务，为您的保险箱提供金融级安全保障！ "
                                      ),
                                      e(
                                        "span",
                                        {
                                          directives: [
                                            {
                                              name: "log",
                                              rawName: "v-log",
                                              value: {
                                                key: "StrongboxSIMGuide",
                                                dsc: "SIM盾访问引导点击量",
                                              },
                                              expression:
                                                "{key:'StrongboxSIMGuide',dsc:'SIM盾访问引导点击量'}",
                                            },
                                          ],
                                          on: { click: t.jumpAPP },
                                        },
                                        [t._v("前往中国移动云盘APP使用>")]
                                      ),
                                    ]
                                  ),
                                ]
                              : t._e(),
                          ],
                          2
                        ),
                      ]),
                    ],
                    1
                  )
                : t._e();
            },
            [
              function () {
                var t = this._self._c;
                return t("div", { staticClass: "type-content flex-one" }, [
                  t("p", [this._v("安全问题验证")]),
                  t("p", [this._v("通过安全提示问题验证身份")]),
                ]);
              },
              function () {
                var t = this._self._c;
                return t("div", { staticClass: "safe-success" }, [
                  t("p", { staticClass: "text" }, [this._v("保险箱设置完成")]),
                ]);
              },
            ],
            !1,
            null,
            "3ea1fba4",
            null
          ));
      e.a = P.exports;
    },
    "0ab7": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAABtElEQVRYR+2WvUoDQRSFz2xsNgv6FLZaWwj+YCX6AGK6Zab1pxEtgo3aaZvZdPEJFCsbRdBesPIpLEyKyFyZZTesMckoyw4E7lZJJgc+vjl7ZwSm7BFTxgsGrnrH2DAbHjLAleBKcCWq7gAbZsOTDfAcrrohbJgNu+Zwo9GIoihaNcbMAyAA771e76HT6Xy67PnI/uiwUmqdiE4AzBbhhBAfAC5ardb9OGhf2QFwHMdrtVrtnIhqo6CEENb28Shon9kU2G5lGIa3uVkhRB/AMxEFAJYAzNj/WdPdbne7WA/f2RRYKbVFRM0Mqm+MiZMkecvWFomolUMDaGqt7/Jd8J3NgQ+IaMdCENFjkiSHxVpIKS8BLGe/XWutrwrAXrMpsJRyD8BuBvGktd7/K7DvbA68CeA0g/wyxsh2u/1qv8dxvBAEgR5XCSml1+zgpavX6zdENJdDA3jJPjtfOp/ZwVhTSm0AOCOikfeLSWPNZ3b44LDQRwXTqeQ/Hhxesr9sZnN1BYA9mu3zr6M5DMNKs3y9dF2Qyq6z4bIGXXk27DJUdp0NlzXoyrNhl6Gy62y4rEFX/hsVibY8xZO0DAAAAABJRU5ErkJggg==";
    },
    "0b9b": function (t, e, a) {
      var i = a("8791");
      i.__esModule && (i = i.default),
        "string" == typeof i && (i = [[t.i, i, ""]]),
        i.locals && (t.exports = i.locals);
      (0, a("c69b").default)("3e645aa6", i, !0, {
        sourceMap: !1,
        shadowMode: !1,
      });
    },
    1251: function (t, e, a) {
      t.exports = a.p + "static/img/safe-verifyQuestion.b59e835b.png";
    },
    "165e": function (t, e, a) {
      "use strict";
      a("a556");
    },
    "177c": function (t, e, a) {
      (e = a("ee2b")(!1)).push([
        t.i,
        ".move-container[data-v-469b4276]{position:fixed;top:0;right:0;bottom:0;left:0;z-index:1999;background:#f8f9fb}.mescroll[data-v-469b4276]{position:fixed;top:4.4rem;bottom:4.8rem;height:auto}.header[data-v-469b4276]{height:4.4rem;position:fixed;top:0;left:0;right:0}.header .header-icon[data-v-469b4276]{-webkit-box-sizing:content-box;box-sizing:content-box;width:2rem;height:2rem;padding:1.2rem 1rem}.header .title[data-v-469b4276]{height:100%;line-height:4.4rem;max-width:60%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:1.6rem;font-weight:600;position:absolute;left:50%;-webkit-transform:translate(-50%);transform:translate(-50%)}.header .icon-back[data-v-469b4276]{position:absolute;left:.6rem}.header .icon-close[data-v-469b4276]{position:absolute;right:.6rem}.footer[data-v-469b4276]{position:fixed;bottom:0;left:0;right:0;height:4.8rem;-webkit-box-shadow:0 -.6rem 1rem -.3rem rgba(0,0,0,.05);box-shadow:0 -.6rem 1rem -.3rem rgba(0,0,0,.05);background:#fff;font-weight:500}.footer .create-btn[data-v-469b4276]{position:absolute;left:1.6rem;height:100%;font-size:1.4rem;font-weight:500;color:#3181f9;line-height:4.9rem}.footer .move-btn[data-v-469b4276]{position:absolute;right:1.6rem;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);padding:.7rem 2.1rem;font-size:1.4rem;line-height:2rem;color:#fff;background:#3181f9;border-radius:.4rem}",
        "",
      ]),
        (t.exports = e);
    },
    "18ce": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAzlJREFUWAntWEuLE0EQzmMTlyAuLqx4UFjBgyw+DtmgV0FBQXwhIuJhT3mRoPGxoOISPIguSA6BvA7qxbP4CxZRL8aAiAriTXdNUFh8kZC3X8XpUITOTCZ2FpEZ6HR1VfVX39TUdPfEZrMuKwNWBqwMrHkG4vH4eLvdto8isHLQQCBwym63z4PwCtpcLpf7rpK4QyUYYYHsCRAl3K1oe0mn8lJOGGTdjKCLyUpE5YSVsNIBsQjrJEeJycqwkjTqgFgZ1kmOEpOVYSVp1AEZ07H1NeG8cBLGGbfb/SCZTC73dZQYotHollqtNoct/G0mk3kkcdFVmS6JYDA4DcSraMer1ep9jDfpRmBGkJ2iOTQXW/g1DYt5GIumCTscjqaARZY2IvAdHCcNnxT51Ov12zRHzOdYQmfUmyacSqU+ATTDgHeVSqWLbCwVi8XiBdzcHmbMaFhMZSyaJkyQqL176J4KeBA5HQqFDotxb4+aPwjdGaZ/pmEw1WDiUITxWNtOp/MGQnRfuFardT0cDm/vDRuJRLZBt8D0n/GyLhAG0w0sOgf27HHM5/O12dnZAtRH0KiGx5DpfejXoa1Hs+GmXjQajRjITdEYVw0+kXQ6vfJnaP53aMIUqlAorIJ0CeJ+LfQG9B2yNAa5nSC7WbNRdwufTM/Z2LT4V4QpGkh/8Hq9kyA2I4k+LnSwP85mszkxHrYfqoYlwe4im28k+o4KZN+7XK7FfnYzeulXcywWmyyXy/ME5PF4FhOJxKoRKG0gePEeglx3ndXm/ITuHFYFw7odJK40w5VK5SyCHaCmyUZ8aan7AmLn4chv7hvGVwYhSwEGiSsljLkTBKBdXBY6aY8afYcncgw72CWQv4wyOQrdS6mzXMljcbnrTcuR0gvlUwHgE6WgDKxfhpnLvyX+H4Txtne3TdShdCUZRd55LM6Bx5LWMF6YZeZ0CIeXHWw8SnFagPdwEOrOGaA7EALOAEu4wwDumM4FtFutFeEOBZCtYqVZEnx4L92acbD54fP5PsKRDjP8zz0+dyQyyP5Cu4kD0itZAN369Pv9E8j2bmRbnLZkGMp0yOrXZrP5WvV/ysoIWkBWBhRk4DebSgNOLbyiTQAAAABJRU5ErkJggg==";
    },
    "1a5f": function (t, e, a) {
      t.exports = a.p + "static/img/safe-setEmail.947b8833.png";
    },
    2101: function (t, e, a) {
      var i = a("3774");
      i.__esModule && (i = i.default),
        "string" == typeof i && (i = [[t.i, i, ""]]),
        i.locals && (t.exports = i.locals);
      (0, a("c69b").default)("bfb84026", i, !0, {
        sourceMap: !1,
        shadowMode: !1,
      });
    },
    "287d": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADYAAAA2CAYAAACMRWrdAAAEPElEQVRoQ+2YXWgcVRTH/2d2Nzt5kNbEKGqIUrXggxbWTXZmEgKLYJ5EUQmChT5IC35Uqd+2otvUovgg+EEVRS0+aAmVIGhAhA5SsskmKyupq4/RBEs01gdNO0kmc49cSCRMJta69067Ye/rzp57fud/5sw5h7BJD21SLjTA6k3ZhmINxS6RCDRS8RIR4j+70VDsfKFiZmNycrJ5aGjIKxQK4nzP6/5diWKlUqlVCHGEmXcQUVkI8UR3d/dvup3/N/s1gw0ODiY6OjqOCSHuW3PR90S0y7Ks74jooqhXM1ilUtnqed44gJvWgDERnTIM40Aul/viYihXM5hUrL29/TMAd0UAnDEM48VcLvdu3MrVDCZhxsbGrhJCfA7gNgDJEOA5AC8vLi6+lc/n5+NSTwmYdLZYLF4L4DCA+wGkQwBnAXxkmuZAJpOZiwNOGZh0duV92w/g6bDzzBwYhuEC2G3b9k+64ZSCrTo7Ojq6l5kLAFoiAE4mk8mHurq6qjrhtIBVq9Wm+fn5e4MgeAXAdREAp4jowMzMzHB/f3+gA1ALmHTUdd2kaZq3MvMggBsinJ+VnwPP8z7O5/PLquG0ga06WqlUrvc87yiAHgCJtQBEdJaInkkmk0ez2aysnsqOdrCVinkjEb3EzA8A6/YsPhG9w8yvOY7ziyqyWMCks+VyeYvv+/uYWVbNVEg5n5m/NE1zj6rPQWxgEmR4eDjd2tr6WBAEzwO4PEKdE01NTXeqSMtYwVbhWlpa+oUQhzaomHsdx3m71pSMHUw6XCgUjL6+vk5mfh/ALaG0/Nq27TvqEkwOpePj491BEHwQmgokzwnHcW6vO7CpqSlzdnZ2JzMfBHBNGICI9ti2LZWs6cSaiq7rmqZpPil7SWbeEgF1LJVKPVhXxWOlQX4WwFMRo40P4DiARx3H+aMmqVb+HItipVJpuxDiIDPLkSZ8FonoDSJ63bKsX1VASRvawSYmJrb5vi9bKifcUgH40zCMfUKITx3H8VRBaQWTTXBzc/MOIYRsgrdFOH3aMIznpqenP9HR4WtRbM3Y8iqAjggoub3ab1nWV7p2IVrAisXiIwAGNhg0v1leXn64t7f3B5Wpt67CqjQuG92lpSVZ+WQvGD7LROSm0+ndmUzmZ5X3RtlSpli5XL7a9/1DQoidRLRumUNEH6ZSqYFsNvu7bihlxaNcLl/h+/4QM+fCIwmAc0R0eGFh4c26Wr+tLExl5bsnQokzsue1bfuIriKxkfo1p6LrultN0ywx8/bVS4iImblqGMYLlmXJRWrsp2YwZk6USqXjQoi714D9mEgkdnV2dn4bt1L/+KAilCMjI1cS0XtEdDMzTwohHu/p6Tmtwvb/tVGzYqsXy3etra3tsrm5ub90dBIXCqgM7EIv1v18A0x3hFXbbyimOqK67TUU0x1h1fYbiqmOqG57m1axvwEYln5GPLuW7QAAAABJRU5ErkJggg==";
    },
    "2ebd": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAACOUlEQVRYR+2YMWgUQRSG/7c33qUQIthrk8LC2ipVKgmIYCcYuYjMLFxpE1JHBBvT3N3OcKWkjZ0oFpYpUghCAorVoYUErIQkB/Nkj5wcx+5mds+9m8Pddt8/880/b2beDGHBPlowXlTAZc9Y5XDl8IQDVUrMLSWazeZSo9FYJ6IVa61IATkD8MYY8y3pv1LqHoDbzOwykydCiLedTqefNejEhlqt1vXBYGAA3HRw7Lsx5v5kXBiGd6y1HQf93xBmPq3X60/a7faXNF0isJRyB8Bdx87+GXDcHxG911pv5wX+CODqRQMHzPyjpJRYA3Btou0jY8zjvMCHI4G1dqPX6x07uu0cJqV8BuDhpICIjrXWG14BJ8CeA6hfzKhfwAmwfSJ6x8xPvQNOgg2CQDHzKjMPF5o3KZEGG0XRT6XUA6+As2BjV70CvgzWK2AXWG+AXWG9AA7DcM1a+3Js8+/Hu0G8wJIOhPG6g4g+aK23ZnpwjC8iAJmwI7C4smPmG7Vaba/b7f6aKbCU8goACWAZgDHGnDif2ZcEplVrpdcSRQdQARd1zlXnjcNzXXSubo3i5r6t5QX2qpZwga+Ay7jTjTv/Xzp8AGD42sPML5j5yCUXi8YIIdattcMbNBF91lpv5qollFKvmflWUYBpdEEQ7EdR9DwXsJRyFcCreMDTdF5A+1sI8SjrfS0VKIYmopCZV0bpUQDAVXJGRJ8A7Gqtv2aJZu2g6wBS4yrgqS0sUsCX3ek07S9cSvwBGJjlPAYV3C0AAAAASUVORK5CYII=";
    },
    "304a": function (t, e, a) {
      "use strict";
      a("eb23");
      var i = a("4ed7"),
        o = a("eb2f"),
        n = a("f20f"),
        s =
          (a("d99a"),
          a("a551"),
          a("2664"),
          a("1dd7"),
          a("874c"),
          a("4b03"),
          a("2fca"),
          a("ffc9"),
          a("356c"),
          a("08f2"),
          a("ab5c"),
          a("233c"),
          a("d0e3"),
          a("9163"),
          a("3464"),
          a("cfaf"),
          a("129e"),
          a("d407"),
          a("4cd2"),
          a("5529"),
          a("5437"),
          a("afe7"),
          a("56d7")),
        r = a("6eef"),
        c = a("c276"),
        l = a("b441"),
        u = a("2176"),
        d = a("090e"),
        f = a("06da"),
        h = a("bf85"),
        m = {
          data: function () {
            return { duration: "", shareLink: "", durationDate: "永久有效" };
          },
          props: {
            visible: { type: Boolean, default: !1 },
            hint: { type: Object, default: function () {} },
            actionList: {
              type: Array,
              default: function () {
                return [];
              },
            },
          },
          created: function () {},
          methods: {
            onCopy: function () {
              var t = this,
                e = new this.clipboard(".copyBtn");
              e.on("success", function () {
                t.isOnline
                  ? (t.$toast("加密分享链接已复制到剪贴板", "center", "1500"),
                    e.destroy(),
                    t.onClose())
                  : t.$toast("网络异常，请稍后重试", "center");
              }),
                e.on("error", function () {
                  t.$toast("加密分享链接复制失败", "center", "1500"),
                    e.destroy();
                });
            },
            onClose: function () {
              this.$emit("update:visible", !1), (this.shareLink = "");
            },
            reqLink: function () {
              var t = this,
                e = [],
                a = [];
              this.actionList.forEach(function (t) {
                t.catalogID ? e.push(t.catalogID) : a.push(t.contentID);
              });
              var i = {
                catalogIDs: e,
                contentIDs: a,
                pubType: 1,
                period: this.duration,
                periodUnit: 1,
              };
              Object(u.d)(i).then(function (e) {
                var a = e.getOutLinkRes.getOutLinkResSet[0].linkUrl;
                t.shareLink =
                  "链接：" +
                  a +
                  " 提取码：" +
                  e.getOutLinkRes.getOutLinkResSet[0].passwd +
                  " 复制内容打开中国移动云盘APP，操作更方便哦";
              });
            },
          },
          watch: Object(o.a)(
            {
              visible: function (t) {
                if (((this.shareLink = ""), t)) {
                  var e = this.hint.name;
                  this.hint.length > 1
                    ? e.length > 16 &&
                      (this.hint.name = ""
                        .concat(e.substring(0, 7), "...")
                        .concat(e.substring(e.length - 7, e.length)))
                    : e.length > 22 &&
                      (this.hint.name = ""
                        .concat(e.substring(0, 8), "...")
                        .concat(e.substring(e.length - 8, e.length))),
                    document.getElementById("permanent").click();
                }
              },
              duration: function (t) {
                t
                  ? "7" === t
                    ? (this.durationDate = "7天有效")
                    : "1" === t && (this.durationDate = "1天有效")
                  : (this.durationDate = "永久有效");
              },
            },
            Object(r.e)(["isOnline"])
          ),
          computed: Object(o.a)({}, Object(r.e)(["isOnline"])),
        },
        p = (a("6425"), a("212b")),
        g = Object(p.a)(
          m,
          function () {
            var t = this,
              e = t._self._c;
            return e(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: t.visible,
                    expression: "visible",
                  },
                ],
                staticClass: "confirm-modal",
              },
              [
                t.shareLink
                  ? e("transition", [
                      e("div", { staticClass: "confirm-main2" }, [
                        e("div", { staticClass: "confirm-main2-content" }, [
                          e("div", { staticClass: "share-info" }, [
                            e("img", { attrs: { src: a("b468"), alt: "" } }),
                            e("p", { staticClass: "gray" }, [
                              t._v(
                                "生成加密分享链接，" +
                                  t._s(t.durationDate) +
                                  "："
                              ),
                            ]),
                            e("p", { staticClass: "hint" }, [
                              t._v(t._s(t.hint.name)),
                              t.hint.length > 1
                                ? e("span", [
                                    t._v("等" + t._s(t.hint.length) + "个文件"),
                                  ])
                                : t._e(),
                            ]),
                          ]),
                          e("div", { staticClass: "copy-content" }, [
                            e("span", { staticClass: "vertical-align-span" }),
                            e(
                              "p",
                              {
                                staticClass: "copyBtn",
                                attrs: {
                                  "data-clipboard-text": t.shareLink,
                                  "data-clipboard-action": "copy",
                                },
                                on: { click: t.onCopy },
                              },
                              [t._v("复制分享链接")]
                            ),
                          ]),
                        ]),
                        e("div", { staticClass: "confirm-footer" }, [
                          e("img", {
                            attrs: { src: a("f36e"), alt: "" },
                            on: { click: t.onClose },
                          }),
                        ]),
                      ]),
                    ])
                  : e("transition", { attrs: { name: "fade-in" } }, [
                      e(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: t.visible,
                              expression: "visible",
                            },
                          ],
                          staticClass: "confirm-main",
                          on: {
                            touchmove: function (t) {
                              t.preventDefault();
                            },
                          },
                        },
                        [
                          e("div", { staticClass: "confirm-title" }, [
                            t._v("分享：“"),
                            e("span", { staticClass: "name" }, [
                              t._v(t._s(t.hint.name)),
                            ]),
                            t._v("”"),
                            e(
                              "span",
                              {
                                directives: [
                                  {
                                    name: "show",
                                    rawName: "v-show",
                                    value: t.hint.length > 1,
                                    expression: "hint.length > 1",
                                  },
                                ],
                              },
                              [t._v("等" + t._s(t.hint.length) + "个文件")]
                            ),
                          ]),
                          e("div", { staticClass: "confirm-content" }, [
                            e("p", [t._v("分享有效期：")]),
                            e("div", { staticClass: "input-radius" }, [
                              e("div", [
                                e("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: t.duration,
                                      expression: "duration",
                                    },
                                  ],
                                  attrs: {
                                    name: "termDate",
                                    type: "radio",
                                    id: "permanent",
                                    value: "",
                                    checked: "",
                                  },
                                  domProps: { checked: t._q(t.duration, "") },
                                  on: {
                                    change: function (e) {
                                      t.duration = "";
                                    },
                                  },
                                }),
                                e("label", { attrs: { for: "permanent" } }, [
                                  e("em"),
                                  t._v("永久有效"),
                                ]),
                              ]),
                              e("div", [
                                e("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: t.duration,
                                      expression: "duration",
                                    },
                                  ],
                                  attrs: {
                                    name: "termDate",
                                    type: "radio",
                                    id: "sevenDay",
                                    value: "7",
                                  },
                                  domProps: { checked: t._q(t.duration, "7") },
                                  on: {
                                    change: function (e) {
                                      t.duration = "7";
                                    },
                                  },
                                }),
                                e("label", { attrs: { for: "sevenDay" } }, [
                                  e("em"),
                                  t._v("7天有效"),
                                ]),
                              ]),
                              e("div", [
                                e("input", {
                                  directives: [
                                    {
                                      name: "model",
                                      rawName: "v-model",
                                      value: t.duration,
                                      expression: "duration",
                                    },
                                  ],
                                  attrs: {
                                    name: "termDate",
                                    type: "radio",
                                    id: "oneDay",
                                    value: "1",
                                  },
                                  domProps: { checked: t._q(t.duration, "1") },
                                  on: {
                                    change: function (e) {
                                      t.duration = "1";
                                    },
                                  },
                                }),
                                e("label", { attrs: { for: "oneDay" } }, [
                                  e("em"),
                                  t._v("1天有效"),
                                ]),
                              ]),
                            ]),
                          ]),
                          e("div", { staticClass: "confirm-btn" }, [
                            e("button", { on: { click: t.onClose } }, [
                              t._v("取消"),
                            ]),
                            e(
                              "button",
                              {
                                staticClass: "copyBtn",
                                on: { click: t.reqLink },
                              },
                              [t._v("生成链接")]
                            ),
                          ]),
                        ]
                      ),
                    ]),
                e("div", {
                  staticClass: "confirm-mask",
                  on: {
                    click: function (e) {
                      return (
                        e.stopPropagation(), t.onClose.apply(null, arguments)
                      );
                    },
                  },
                }),
              ],
              1
            );
          },
          [],
          !1,
          null,
          "466ee7fa",
          null
        ).exports,
        b = a("3bcc"),
        v = a("9b59"),
        A = {
          name: "ComActionBar",
          components: {
            ComSafeAuth: f.a,
            ComFileMove: h.a,
            ComShareConfirm: g,
          },
          props: {
            optional: { type: Object, default: null },
            showActionBar: { type: Boolean, default: !1 },
            actionList: {
              type: Array,
              default: function () {
                return [];
              },
            },
            isSafeBox: { type: Boolean, default: !1 },
            isShowDownload: { type: Number, default: 0 },
            isShowCopyContents: { type: Number, default: 0 },
            isShowDelete: { type: Number, default: 0 },
            isShowShare: { type: Number, default: 0 },
            isShowAccusation: { type: Number, default: 0 },
            isShowRename: { type: Number, default: 0 },
            isShowMove: { type: Number, default: 0 },
            isShowMoveInSafeBox: { type: Number, default: 0 },
            isShowMoveOutSafeBox: { type: Number, default: 0 },
            pageModule: { type: String, default: "myCloud" },
            callerRoutePath: { type: String, default: "" },
            pageTitle: { type: String, default: "" },
          },
          data: function () {
            return {
              showMoreAction: !1,
              safeAuthVisible: !1,
              showFileMove: !1,
              showShareConfirm: !1,
              shareHint: {},
              shareLink: "",
              routerPath: "",
              routerName: "",
              buttonList: {
                download: {
                  name: "下载",
                  url: a("18ce"),
                  key: l.e.download[this.pageModule],
                  desc: "点击下载",
                  click: "handleDownload",
                },
                share: {
                  name: "分享",
                  url: a("de73"),
                  key: "SelectShare",
                  desc: "点击分享",
                  click: "handleShare",
                },
                copyContents: {
                  name: "转存",
                  url: a("2ebd"),
                  key: l.e.copyContents[this.pageModule],
                  desc: "点击转存",
                  click: "handleCopyContents",
                },
                moveOutSafeBox: {
                  name: "移出保险箱",
                  url: a("e5c0"),
                  key: "StrongboxMoveOut",
                  desc: "点击移出保险箱",
                  click: "handleMoveoutSafebox",
                },
                delete: {
                  name: "删除",
                  url: a("45c8"),
                  key: l.e.delete[this.pageModule],
                  desc: "点击删除",
                  click: "handleDelete",
                },
                accusation: {
                  name: "举报",
                  url: a("cd73"),
                  key: "ShareReport",
                  desc: "点击举报",
                  click: "handleAccusation",
                },
                rename: {
                  name: "重命名",
                  url: a("41aa"),
                  moreUrl: a("5a49"),
                  key: l.e.rename[this.pageModule],
                  desc: "点击重命名",
                  click: "handleRename",
                },
                move: {
                  name: "移动",
                  url: a("9c8f"),
                  moreUrl: a("7d67"),
                  key: l.e.move[this.pageModule],
                  desc: "点击移动",
                  click: "handleMove",
                },
                moveInSafeBox: {
                  name: "移入保险箱",
                  url: a("55e5"),
                  moreUrl: a("cbdb"),
                  key: "StrongboxMoveIn",
                  desc: "点击移入保险箱",
                  click: "handleMoveInSafebox",
                },
              },
              operateType: "",
            };
          },
          created: function () {
            (this.routerPath = decodeURIComponent(this.$route.path)),
              (this.routerName = this.$route.name),
              (window.comActionBar = this);
          },
          beforeUpdate: function () {},
          mounted: function () {
            var t = this;
            window.onbeforeunload = function (e) {
              (e = e || window.event) &&
                (sessionStorage.setItem(
                  "showBatchOperation",
                  t.showBatchOperation
                ),
                sessionStorage.setItem(
                  "needUpdatePath",
                  JSON.stringify(t.needUpdatePath)
                )),
                sessionStorage.setItem(
                  "showBatchOperation",
                  t.showBatchOperation
                ),
                sessionStorage.setItem(
                  "needUpdatePath",
                  JSON.stringify(t.needUpdatePath)
                );
            };
          },
          activated: function () {
            (this.routerPath = decodeURIComponent(this.$route.path)),
              (this.routerName = this.$route.name),
              (this.showFileMove = !1),
              (this.showShareConfirm = !1),
              this.handleSafeClose();
          },
          methods: {
            toClick: function (t) {
              "handleDelete" === t
                ? this.handleDelete()
                : "handleDownload" === t
                ? this.handleDownload()
                : "handleShare" === t
                ? this.handleShare()
                : "handleCopyContents" === t
                ? this.handleCopyContents()
                : "handleMoveoutSafebox" === t
                ? this.handleMoveoutSafebox()
                : "handleAccusation" === t
                ? this.handleAccusation()
                : "handleRename" === t
                ? this.handleRename()
                : "handleMove" === t
                ? this.handleMove()
                : "handleMoveInSafebox" === t && this.handleMoveInSafebox();
            },
            handleDownload: function () {
              var t = this;
              return Object(n.a)(
                Object(i.a)().m(function e() {
                  var a, n, s, r, d, f, h, m, p, g, A, w, C, S;
                  return Object(i.a)().w(function (e) {
                    for (;;)
                      switch (e.n) {
                        case 0:
                          if (
                            (v.a.fmDataReport(
                              { page_title: t.pageTitle, click_object: "下载" },
                              "file_click"
                            ),
                            t.isOnline)
                          ) {
                            e.n = 1;
                            break;
                          }
                          return t.$toast("网络异常，请稍后重试"), e.a(2);
                        case 1:
                          if (
                            ((a = t.optional || {}),
                            (n = 1),
                            1 !== t.actionList.length)
                          ) {
                            e.n = 7;
                            break;
                          }
                          if (
                            ((s = t.actionList[0]),
                            "qqBrowser" !== Object(c.r)().Browser ||
                            1 !== s.contentType ||
                            (Object(b.h)() &&
                              ["myCloud", "safeBox"].includes(t.pageModule))
                              ? (r = !0)
                              : ((n = "default"), (r = !1)),
                            (d = { contentID: s.contentID }),
                            !a.groupID)
                          ) {
                            e.n = 3;
                            break;
                          }
                          return (
                            t.$loading("加载中...", !1),
                            (e.n = 2),
                            Object(u.x)(
                              {
                                contentID: d.contentID,
                                path: "".concat(l.S).concat(s.parentCatalogID),
                                groupID: a.groupID,
                                useCdn: r,
                              },
                              function (e) {
                                t.$loading.hide(),
                                  e.success
                                    ? Object(c.m)(e.url, s.contentName, n)
                                    : ("1909015006" === e.status &&
                                        (t.$toast("文件夹不存在"),
                                        window.location.reload()),
                                      "1909011503" === e.status &&
                                        t.$router.go(-1));
                              }
                            )
                          );
                        case 2:
                          return e.a(2, !1);
                        case 3:
                          if (!a.isFamilyCloud) {
                            e.n = 5;
                            break;
                          }
                          return (
                            (f = Object(o.a)(
                              Object(o.a)(Object(o.a)({}, d), a),
                              {},
                              { useCdn: r }
                            )),
                            a.isFamilyMusic
                              ? (f.catalogType = 2)
                              : a.isFamilyAlbum
                              ? (f.catalogType = 1)
                              : (f.catalogType = 3),
                            (e.n = 4),
                            Object(u.s)(f).then(
                              function (t) {
                                t && Object(c.m)(t, s.contentName, n);
                              },
                              function (e) {
                                ("1809011501" !== e.status &&
                                  "1809012303" !== e.status) ||
                                  (sessionStorage.setItem("family_refresh", !0),
                                  t.$emit("toRefresh", {
                                    type: "refreshFamily",
                                  })),
                                  "1809111400" === e.status &&
                                    (t.$store.commit("setPageNeedUpdate", {
                                      page: "/familyCloud?tab=album",
                                      status: {
                                        status: !0,
                                        action: "refreshAlbum",
                                      },
                                    }),
                                    t.$toast("相册不存在"),
                                    t.$router.go(-1));
                              }
                            )
                          );
                        case 4:
                          return e.a(2);
                        case 5:
                          return (
                            (e.n = 6),
                            Object(u.l)(d, {
                              isSafeBox: t.isSafeBox,
                              useCdn: r,
                            })
                          );
                        case 6:
                          (h = e.v),
                            Object(c.m)(h, s.contentName, n),
                            (e.n = 14);
                          break;
                        case 7:
                          if (
                            ((m = t.actionList.map(function (t) {
                              return {
                                contentID: t.contentID,
                                contentName: t.contentName,
                              };
                            })),
                            200,
                            !(a.isFamilyCloud && m.length > 200))
                          ) {
                            e.n = 8;
                            break;
                          }
                          return (
                            t.$toast(
                              "下载失败，文件数超过".concat(
                                200,
                                "个或总大小超过4G"
                              )
                            ),
                            e.a(2)
                          );
                        case 8:
                          if (((p = ""), !a.isFamilyCloud)) {
                            e.n = 10;
                            break;
                          }
                          return (
                            (g = Object(o.a)(
                              { zipFileName: p, contentInfos: m },
                              a
                            )),
                            a.isFamilyMusic
                              ? (g.catalogType = 2)
                              : a.isFamilyAlbum
                              ? (g.catalogType = 1)
                              : (g.catalogType = 3),
                            (e.n = 9),
                            Object(u.k)(g)
                          );
                        case 9:
                          return (
                            (A = e.v) && A.downloadURL
                              ? Object(c.m)(A.downloadURL, p, n)
                              : A.success ||
                                ("1809011501" === A.status &&
                                  t.$emit("toRefresh", {
                                    type: "refreshFamily",
                                  })),
                            e.a(2)
                          );
                        case 10:
                          if (!a.groupID) {
                            e.n = 12;
                            break;
                          }
                          return (
                            (w = ""
                              .concat(l.S)
                              .concat(t.actionList[0].parentCatalogID)),
                            (C = Object(o.a)(
                              { zipFileName: p, contentInfos: m, path: w },
                              a
                            )),
                            (e.n = 11),
                            Object(u.w)(C).then(function (t) {
                              t && Object(c.m)(t, p, n);
                            })
                          );
                        case 11:
                          return e.a(2);
                        case 12:
                          return (
                            Object(b.h)() && (p = "".concat(m[0].contentName)),
                            (e.n = 13),
                            Object(u.n)(
                              { zipFileName: p, contentInfos: m },
                              { isSafeBox: t.isSafeBox }
                            )
                          );
                        case 13:
                          (S = e.v), Object(c.m)(S, p, n);
                        case 14:
                          return e.a(2);
                      }
                  }, e);
                })
              )();
            },
            handleDelete: function () {
              var t = this;
              if (
                (v.a.fmDataReport(
                  { page_title: this.pageTitle, click_object: "删除" },
                  "file_click"
                ),
                this.optional &&
                  (this.optional.isFamilyCloud || this.optional.groupID))
              ) {
                var e = "";
                this.actionList.forEach(function (t) {
                  var a = l.lb[t.contentType] || "4";
                  -1 === e.indexOf(a) && (e = e ? e + "," + a : a);
                }),
                  v.a.fmDataReport(
                    {
                      groupid: this.optional.groupID || this.optional.cloudID,
                      file_type: e,
                      file_num: this.actionList.length,
                      file_title:
                        this.actionList.length > 1
                          ? ""
                          : this.actionList[0].catalogName ||
                            this.actionList[0].contentName,
                    },
                    "delete_file"
                  );
              }
              var a = this,
                s = a.setIdList(),
                r = "文件";
              s.catalogIDs.length > 0 &&
                0 === s.contentIDs.length &&
                (r = "文件夹"),
                s.catalogIDs.length > 0 &&
                  s.contentIDs.length > 0 &&
                  (r = "文件(夹)");
              var c,
                d = "确定删除".concat(r, "？");
              if (this.isSafeBox)
                c = "删除后无法找回".concat(r, "，将永久删除");
              else if (this.optional && this.optional.isFamilyCloud) {
                d = "确定删除？";
                var f = this.optional.isFamilyOwner;
                if (f) c = "删除后无法恢复，家庭内的好友将无法查看";
                else {
                  var h = [],
                    m = [];
                  this.actionList.forEach(function (e) {
                    var a = e.modifier === t.completeAccount;
                    e.catalogID
                      ? (f || a) && h.push(e.catalogID)
                      : (f || a) && m.push(e.contentID);
                  });
                  var p = h.length + m.length;
                  if (p === this.actionList.length)
                    c = "删除后无法恢复，家庭内的好友将无法查看";
                  else {
                    if (
                      ((c =
                        "您只能删除自己上传的文件，家庭创建者才能删除其他成员的分享或删除文件夹"),
                      !(p > 0))
                    )
                      return void this.$confirm({
                        smallTips: !0,
                        title: "无法删除",
                        content: c,
                        showCancelButton: !1,
                        confirmText: "知道了",
                      });
                    (s.catalogIDs = h), (s.contentIDs = m), (s.isPart = !0);
                  }
                }
              } else if (this.optional && this.optional.groupID) {
                sessionStorage.setItem("isPart", !1), (d = "确定删除？");
                var g = [],
                  b = [],
                  A = [];
                this.actionList.forEach(function (e) {
                  var a = (e.uploader || e.creator) === t.completeAccount;
                  (1 === t.optional.userRole || a) &&
                    (e.catalogID ? g.push(e.path) : b.push(e.path)),
                    e.catalogID && A.push(e.path);
                }),
                  (s.catalogIDs = g),
                  (s.contentIDs = b);
                var w = g.length + b.length;
                if (
                  1 === this.optional.userRole ||
                  (2 === this.optional.userRole && w === this.actionList.length)
                )
                  c = "删除后无法恢复，共享群内的好友将无法查看";
                else if (
                  2 === this.optional.userRole &&
                  w !== this.actionList.length
                ) {
                  if (
                    ((c =
                      A.length > 0
                        ? "您只能删除自己上传的文件(夹)，全权限才能删除其他成员的分享"
                        : "您只能删除自己上传的文件，全权限才能删除其他成员的分享"),
                    !(w > 0))
                  )
                    return void this.$confirm({
                      smallTips: !0,
                      title: "无法删除",
                      content: c,
                      showCancelButton: !1,
                      confirmText: "知道了",
                    });
                  (s.isPart = !0), sessionStorage.setItem("isPart", s.isPart);
                }
              } else c = "删除后可在回收站找回已删除".concat(r);
              this.$confirm({
                smallTips: !0,
                title: d,
                content: c,
                onConfirm: function () {
                  return Object(n.a)(
                    Object(i.a)().m(function t() {
                      var e;
                      return Object(i.a)().w(function (t) {
                        for (;;)
                          switch (t.n) {
                            case 0:
                              if ((a.$confirm.hide(), a.isOnline)) {
                                t.n = 1;
                                break;
                              }
                              return a.$toast("网络异常，请稍后重试"), t.a(2);
                            case 1:
                              if (
                                ((e = {
                                  module: "",
                                  taskID: "",
                                  imgType: "recycleBin",
                                  actionType: "",
                                  title: "删除文件中",
                                }),
                                !a.isSafeBox)
                              ) {
                                t.n = 3;
                                break;
                              }
                              return (
                                (t.n = 2),
                                Object(u.h)(s).then(function (t) {
                                  (e.module = "safeBox"),
                                    (e.taskID = t.data.taskID),
                                    (e.actionType = "safeBoxDelete"),
                                    a.toShowBatchOpr(e);
                                })
                              );
                            case 2:
                              t.n = 8;
                              break;
                            case 3:
                              if (!a.optional || !a.optional.isFamilyCloud) {
                                t.n = 5;
                                break;
                              }
                              return (
                                (t.n = 4),
                                Object(u.f)(
                                  Object(o.a)(
                                    Object(o.a)(Object(o.a)({}, s), a.optional),
                                    {},
                                    { isBatch: !0 }
                                  )
                                ).then(function (t) {
                                  "1809011501" !== t.status &&
                                  "1809012303" !== t.status
                                    ? ((e.module = "familyCloud"),
                                      (e.taskID = t.data.taskID),
                                      (e.actionType = "familyCloudDelete"),
                                      a.toShowBatchOpr(e))
                                    : a.$emit("toRefresh", {
                                        type: "refreshFamily",
                                      });
                                })
                              );
                            case 4:
                              t.n = 8;
                              break;
                            case 5:
                              if (!a.optional || !a.optional.groupID) {
                                t.n = 7;
                                break;
                              }
                              return (
                                a.$loading("操作中..."),
                                (t.n = 6),
                                Object(u.i)(
                                  Object(o.a)(Object(o.a)({}, s), a.optional)
                                )
                                  .then(function (t) {
                                    (e.module = "sharedGroup"),
                                      (e.taskID = t.data.taskID),
                                      (e.actionType = "sharedGroupDelete"),
                                      a.toShowBatchOpr(e);
                                  })
                                  .finally(function () {
                                    a.$loading.hide();
                                  })
                              );
                            case 6:
                              t.n = 8;
                              break;
                            case 7:
                              return (
                                (t.n = 8),
                                Object(u.D)(s).then(function (t) {
                                  (e.module = "myCloud"),
                                    (e.taskID = t.data.taskID),
                                    (e.actionType = "myCloudDelete"),
                                    (a.operateType = "delete"),
                                    a.toShowBatchOpr(e),
                                    a.$route.query.isSearchResult &&
                                      (s.catalogIDs.forEach(function (t) {
                                        a.$store.commit(
                                          "setSearchResultModify",
                                          t
                                        );
                                      }),
                                      s.contentIDs.forEach(function (t) {
                                        a.$store.commit(
                                          "setSearchResultModify",
                                          t
                                        );
                                      }));
                                })
                              );
                            case 8:
                              return t.a(2);
                          }
                      }, t);
                    })
                  )();
                },
              });
            },
            setIdList: function () {
              var t = [],
                e = [];
              return (
                this.actionList.forEach(function (a) {
                  a.catalogID ? t.push(a.catalogID) : e.push(a.contentID);
                }),
                { catalogIDs: t, contentIDs: e }
              );
            },
            handleRename: function () {
              v.a.fmDataReport(
                { page_title: this.pageTitle, click_object: "重命名" },
                "file_click"
              );
              var t = !1,
                e = this,
                a = e.actionList[0],
                s = "." + a.contentSuffix,
                r = a.catalogID ? "文件夹" : "文件";
              if (e.optional && e.optional.groupID) {
                var c = a.uploader || a.creator;
                if (1 !== e.optional.userRole && c !== e.completeAccount)
                  return void e.$toast("您只能重命名自己上传的文件(夹)");
              }
              (this.showMoreAction = !1),
                this.$confirm({
                  title: "重命名",
                  showInput: !0,
                  closeOnConfirm: !1,
                  msg: e.msg,
                  onConfirm: function (c) {
                    return Object(n.a)(
                      Object(i.a)().m(function n() {
                        var l, f, h, m, p, g, b;
                        return Object(i.a)().w(function (i) {
                          for (;;)
                            switch (i.n) {
                              case 0:
                                if ((l = c.trim())) {
                                  i.n = 1;
                                  break;
                                }
                                return (
                                  e.$toast("".concat(r, "名称不可为空")), i.a(2)
                                );
                              case 1:
                                if (!/[|\\/:*?<>"]/g.test(l)) {
                                  i.n = 2;
                                  break;
                                }
                                return (
                                  e.$toast(
                                    "".concat(r, "名称包含非法字符，请重新输入")
                                  ),
                                  i.a(2)
                                );
                              case 2:
                                if (a.contentID || !/\.$/.test(l)) {
                                  i.n = 3;
                                  break;
                                }
                                return (
                                  e.$toast("".concat(r, "名称不能以.结尾")),
                                  i.a(2)
                                );
                              case 3:
                                if (!a.contentID || !/^\./.test(l)) {
                                  i.n = 4;
                                  break;
                                }
                                return (
                                  e.$toast("".concat(r, "名称不能以.开头")),
                                  i.a(2)
                                );
                              case 4:
                                if (l !== e.msg) {
                                  i.n = 5;
                                  break;
                                }
                                return e.$confirm.hide(), i.a(2);
                              case 5:
                                if (!a.contentID) {
                                  i.n = 11;
                                  break;
                                }
                                if (
                                  ((h = {
                                    contentID: a.contentID,
                                    contentName: l + s,
                                  }),
                                  !e.isSafeBox)
                                ) {
                                  i.n = 7;
                                  break;
                                }
                                return (
                                  (i.n = 6),
                                  Object(u.L)(h)
                                    .then(function (e) {
                                      (t = !0),
                                        (f =
                                          e.data.safeBoxUpdateContentInfoRes
                                            .contentName);
                                    })
                                    .catch(function (t) {
                                      ("9438" !== t.status &&
                                        "9406" !== t.status) ||
                                        (e.$confirm.hide(),
                                        e.$emit("toRefresh"));
                                    })
                                );
                              case 6:
                                i.n = 10;
                                break;
                              case 7:
                                if (!e.optional || !e.optional.groupID) {
                                  i.n = 9;
                                  break;
                                }
                                return (
                                  (i.n = 8),
                                  Object(u.z)(
                                    Object(o.a)(Object(o.a)({}, e.optional), h)
                                  )
                                    .then(function (e) {
                                      (t = !0), (f = e.data.contentName);
                                    })
                                    .catch(function (t) {
                                      ("1909011511" !== t.status &&
                                        "1909015006" !== t.status) ||
                                        (e.$confirm.hide(),
                                        e.$emit("toRefresh"));
                                    })
                                );
                              case 8:
                                i.n = 10;
                                break;
                              case 9:
                                return (
                                  (i.n = 10),
                                  Object(u.M)(h)
                                    .then(function (i) {
                                      (t = !0),
                                        (f =
                                          i.data.updateContentInfoRes
                                            .contentName),
                                        e.$route.query.isSearchResult &&
                                          e.$store.commit(
                                            "setSearchResultModify",
                                            a.contentID
                                          );
                                    })
                                    .catch(function (t) {
                                      "9438" === t.status &&
                                        (e.$confirm.hide(),
                                        e.$emit("toRefresh"));
                                    })
                                );
                              case 10:
                                i.n = 18;
                                break;
                              case 11:
                                if (
                                  ((m = {
                                    catalogID: a.catalogID,
                                    catalogName: l,
                                  }),
                                  !e.isSafeBox)
                                ) {
                                  i.n = 13;
                                  break;
                                }
                                return (
                                  (i.n = 12),
                                  Object(u.J)(m)
                                    .then(function (e) {
                                      (t = !0),
                                        (f =
                                          e.data.safeBoxUpdateCatalogInfoRes
                                            .contentName);
                                    })
                                    .catch(function (t) {
                                      "9406" === t.status &&
                                        (e.$confirm.hide(),
                                        e.$emit("toRefresh"));
                                    })
                                );
                              case 12:
                                i.n = 18;
                                break;
                              case 13:
                                if (!e.optional || !e.optional.groupID) {
                                  i.n = 17;
                                  break;
                                }
                                if (
                                  ((m.path = a.path),
                                  "groupFile" !== e.$route.name ||
                                    e.$route.params.catalogID)
                                ) {
                                  i.n = 15;
                                  break;
                                }
                                return (
                                  (i.n = 14),
                                  Object(d.q)(e.groupData.data).catch(function (
                                    t
                                  ) {})
                                );
                              case 14:
                                p = i.v;
                              case 15:
                                return (
                                  (i.n = 16),
                                  Object(u.y)(
                                    Object(o.a)(Object(o.a)({}, e.optional), m)
                                  )
                                    .then(function (e) {
                                      (t = !0), (f = e.data.catalogName);
                                    })
                                    .catch(function (t) {
                                      if ("1909015006" === t.status) {
                                        if (
                                          !JSON.parse(
                                            localStorage.getItem("catalogIDArr")
                                          ).length
                                        )
                                          if (
                                            p.data.getGroupContentResult.catalogList.some(
                                              function (t) {
                                                return (
                                                  t.catalogID === m.catalogID
                                                );
                                              }
                                            )
                                          )
                                            return void e.$confirm({
                                              smallTips: !0,
                                              title: "无权限重命名隐藏文件夹",
                                              content:
                                                "选中文件夹为隐藏文件夹，非群主不支持重命名操作，请重新选择其他文件（夹）操作",
                                              showCancelButton: !1,
                                              confirmText: "知道了",
                                            });
                                        e.$confirm.hide(), e.$emit("toRefresh");
                                      }
                                      "1909011505" === t.status &&
                                        (e.$confirm.hide(),
                                        e.$emit("toRefresh"));
                                    })
                                );
                              case 16:
                                i.n = 18;
                                break;
                              case 17:
                                return (
                                  (i.n = 18),
                                  Object(u.K)(m)
                                    .then(function (i) {
                                      (t = !0),
                                        (f =
                                          i.data.updateCatalogRes.catalogName),
                                        e.$route.query.isSearchResult &&
                                          e.$store.commit(
                                            "setSearchResultModify",
                                            a.catalogID
                                          );
                                    })
                                    .catch(function (t) {
                                      "9406" === t.status &&
                                        (e.$confirm.hide(),
                                        e.$emit("toRefresh"));
                                    })
                                );
                              case 18:
                                e.optional || e.$confirm.hide(),
                                  t &&
                                    ((l += a.contentID
                                      ? ".".concat(
                                          a.contentSuffix.toLowerCase()
                                        )
                                      : ""),
                                    e.$emit("toRefresh", {
                                      type: "rename",
                                      data: {
                                        newName: null != f ? f : l,
                                        contentID:
                                          null !== (g = a.contentID) &&
                                          void 0 !== g
                                            ? g
                                            : "",
                                        catalogID:
                                          null !== (b = a.catalogID) &&
                                          void 0 !== b
                                            ? b
                                            : "",
                                        contentSuffix: a.contentID
                                          ? a.contentSuffix.toLowerCase()
                                          : "",
                                      },
                                    }));
                              case 19:
                                return i.a(2);
                            }
                        }, n);
                      })
                    )();
                  },
                });
            },
            handleMove: function () {
              var t = this;
              v.a.fmDataReport(
                { page_title: this.pageTitle, click_object: "移动" },
                "file_click"
              );
              var e = this.setIdList(),
                a = e.catalogIDs,
                o = e.contentIDs,
                s = {
                  isSafeBox: this.isSafeBox,
                  catalogId: "",
                  isMoveOutSafe: !1,
                  isShareGroup: !0,
                  selectedCaIdList: a,
                  selectedCoIdList: o,
                  length: this.actionList.length,
                  parentCatalogId: this.actionList[0].parentCatalogId,
                };
              if (this.optional && this.optional.groupID) {
                s.groupMess = {};
                var r = [],
                  c = [];
                if (
                  (sessionStorage.setItem("isPart", !1),
                  2 === this.optional.userRole)
                ) {
                  this.actionList.forEach(function (e) {
                    (e.uploader || e.creator) === t.completeAccount &&
                      (e.catalogID ? r.push(e.path) : c.push(e.path));
                  }),
                    (s.selectedCaIdList = r),
                    (s.selectedCoIdList = c);
                  var u = r.length + c.length;
                  if (!(u > 0 && u <= this.actionList.length))
                    return void this.$confirm({
                      smallTips: !0,
                      title: "无法移动",
                      content:
                        "您只能移动自己上传的文件，全权限才能移动其他成员的分享",
                      showCancelButton: !1,
                      confirmText: "知道了",
                    });
                  if (
                    ((s.groupMess.isPartialSharing =
                      u !== this.actionList.length),
                    u < this.actionList.length)
                  ) {
                    var f = this;
                    return void this.$confirm({
                      title: "确定移动？",
                      closeOnConfirm: !1,
                      content:
                        "您只能移动自己上传的文件(夹)，全权限才能移动其他成员的分享",
                      onConfirm: function (t) {
                        return Object(n.a)(
                          Object(i.a)().m(function t() {
                            return Object(i.a)().w(function (t) {
                              for (;;)
                                switch (t.n) {
                                  case 0:
                                    return (
                                      (s.parentCatalogId =
                                        f.actionList[0].parentCatalogID),
                                      (s.groupMess.isCopyContents = !1),
                                      (s.groupMess.groupID =
                                        f.optional.groupID),
                                      (s.groupMess.catalogID = ""
                                        .concat(l.S)
                                        .concat(f.optional.catalogID)),
                                      Object(d.p)({
                                        pageParameter: {
                                          pageNum: 1,
                                          pageSize: 10,
                                          isReturnTotal: 1,
                                        },
                                        groupIDList: [f.optional.groupID],
                                      }).then(function (t) {
                                        t.message &&
                                          t.data.groupList &&
                                          t.data.groupList.length > 0 &&
                                          (s.groupMess.groupName =
                                            t.data.groupList[0].groupName),
                                          f.$nextTick(function () {
                                            f.$store.commit("setMoveInfo", s),
                                              f.$confirm.hide(),
                                              (f.showFileMove = !0),
                                              f.$toast(
                                                "您只能移动自己上传的文件(夹)"
                                              ),
                                              sessionStorage.setItem(
                                                "isPart",
                                                !0
                                              );
                                          });
                                      }),
                                      t.a(2, !1)
                                    );
                                }
                            }, t);
                          })
                        )();
                      },
                    });
                  }
                } else
                  1 === this.optional.userRole &&
                    ((s.groupMess.isPartialSharing = !1),
                    this.actionList.forEach(function (t) {
                      t.catalogID ? r.push(t.path) : c.push(t.path);
                    }),
                    (s.selectedCaIdList = r),
                    (s.selectedCoIdList = c));
                return (
                  (s.parentCatalogId = this.actionList[0].parentCatalogID),
                  (s.groupMess.isCopyContents = !1),
                  (s.groupMess.groupID = this.optional.groupID),
                  (s.groupMess.catalogID = ""
                    .concat(l.S)
                    .concat(this.optional.catalogID)),
                  Object(d.p)({
                    pageParameter: {
                      pageNum: 1,
                      pageSize: 10,
                      isReturnTotal: 1,
                    },
                    groupIDList: [this.optional.groupID],
                  }).then(function (e) {
                    e.message &&
                      e.data.groupList &&
                      e.data.groupList.length > 0 &&
                      (s.groupMess.groupName = e.data.groupList[0].groupName),
                      t.$nextTick(function () {
                        t.$store.commit("setMoveInfo", s),
                          (t.showFileMove = !0);
                      });
                  }),
                  !1
                );
              }
              this.$store.commit("setMoveInfo", s),
                (this.showFileMove = !0),
                (this.operateType = "move");
            },
            handleMoveInSafebox: function () {
              var t = this;
              if (
                (v.a.fmDataReport(
                  { page_title: this.pageTitle, click_object: "移入保险箱" },
                  "file_click"
                ),
                this.isOnline)
              ) {
                if (!this.isSafeChecked)
                  return (
                    this.$toast("保险箱状态异常，请重试"),
                    void this.$store.dispatch("safe/getSafeStatus")
                  );
                if (!this.hasSafe)
                  return (
                    (this.safeAuthVisible = !0),
                    (this.$root._preventBackFunc = function () {
                      t.handleSafeClose();
                    }),
                    void this.$toast("请先激活保险箱")
                  );
                if (!this.isMoving) {
                  this.isMoving = !0;
                  var e = this.setIdList(),
                    a = e.catalogIDs,
                    i = {
                      contentInfoList: e.contentIDs,
                      catalogInfoList: a,
                      newCatalogID: Object(l.V)(),
                      moveType: "3",
                    };
                  Object(u.E)(i)
                    .then(function (e) {
                      e.success &&
                        ((t.showMoreAction = !1),
                        t.toShowBatchOpr({
                          module: "myCloud",
                          taskID: e.data.taskID,
                          actionType: "safeBoxMoveIn",
                          imgType: "safeBox",
                          title: "移入保险箱中",
                        }));
                    })
                    .finally(function () {
                      t.isMoving = !1;
                    });
                }
              } else this.$toast("网络异常，请稍后重试");
            },
            handleSafeClose: function () {
              (this.safeAuthVisible = !1), (this.$root._preventBackFunc = null);
            },
            handleSafe: function (t) {
              this.handleSafeClose(), t && this.handleMoveInSafebox();
            },
            handleMoveoutSafebox: function () {
              if (
                (v.a.fmDataReport(
                  { page_title: this.pageTitle, click_object: "移出保险箱" },
                  "file_click"
                ),
                this.isOnline)
              ) {
                var t = this.setIdList(),
                  e = {
                    isSafeBox: !0,
                    isMoveOutSafe: !0,
                    selectedCaIdList: t.catalogIDs,
                    selectedCoIdList: t.contentIDs,
                    length: this.actionList.length,
                    parentCatalogId: this.actionList[0].parentCatalogId,
                  };
                this.$store.commit("setMoveInfo", e), (this.showFileMove = !0);
              } else this.$toast("网络异常，请稍后重试");
            },
            handleMoreActionModal: function () {
              this.showMoreAction = !0;
            },
            hideMoreActionModal: function () {
              this.showMoreAction = !1;
            },
            handleRefresh: function (t) {
              (this.showFileMove = !1),
                this.hideMoreActionModal(),
                "refreshFamily" === t.type &&
                  this.$emit("toRefresh", { type: "refreshFamily" }),
                "moveGroupContentCatalogFail" === t.type &&
                  this.$emit("toRefresh");
            },
            handleShare: function () {
              v.a.fmDataReport(
                { page_title: this.pageTitle, click_object: "分享" },
                "file_click"
              );
              var t = [],
                e = [];
              if (this.actionList.length > 50)
                this.$toast("单次分享不能超过".concat(50, "个文件"));
              else {
                try {
                  this.actionList.forEach(function (a) {
                    if (a.catalogID) t.push(a.catalogID);
                    else {
                      if (l.k.includes(a.contentSuffix.toLowerCase()))
                        throw new Error();
                      e.push(a.contentID);
                    }
                  });
                } catch (t) {
                  return void this.$toast("包含无法分享的文件格式，请重新选择");
                }
                var a = this.actionList[this.actionList.length - 1].contentName
                  ? this.actionList[this.actionList.length - 1].contentName
                  : this.actionList[this.actionList.length - 1].catalogName;
                (this.shareHint.name = a),
                  (this.shareHint.length = this.actionList.length),
                  (this.showShareConfirm = !0);
              }
            },
            getShareLink: function () {
              var t = this,
                e = [],
                a = [];
              try {
                this.actionList.forEach(function (t) {
                  if (t.catalogID) e.push(t.catalogID);
                  else {
                    if (l.k.includes(t.contentSuffix.toLowerCase()))
                      throw new Error();
                    a.push(t.contentID);
                  }
                });
              } catch (t) {
                return void this.$toast("包含无法分享的文件格式，请重新选择");
              }
              var i = { catalogIDs: e, contentIDs: a, pubType: 1 };
              Object(u.d)(i).then(function (e) {
                var a = e.getOutLinkRes.getOutLinkResSet[0].linkUrl;
                t.shareLink =
                  "链接：" +
                  a +
                  " 提取码：" +
                  e.getOutLinkRes.getOutLinkResSet[0].passwd +
                  " 复制内容打开中国移动云盘手机APP，操作更方便哦";
              });
            },
            handleCopyContents: function () {
              v.a.fmDataReport(
                { page_title: this.pageTitle, click_object: "转存" },
                "file_click"
              );
              var t = this.optional || {};
              if (t.isFamilyCloud) {
                var e = this.setIdList(),
                  a = e.catalogIDs,
                  i = e.contentIDs;
                t.path &&
                  ((a = a.map(function (e) {
                    return t.path + "/" + e;
                  })),
                  (i = i.map(function (e) {
                    return t.path + "/" + e;
                  })));
                var o = {
                  isFamilyCloud: t.isFamilyCloud,
                  selectedCaIdList: a,
                  selectedCoIdList: i,
                  length: this.actionList.length,
                  parentCatalogId: this.actionList[0].parentCatalogId || "",
                };
                if (o.isFamilyCloud) {
                  var n = 1002;
                  t.isFamilyMusic ? (n = 1001) : t.isFamilyAlbum && (n = 1e3),
                    (o.sourceType = n),
                    (o.cloudID = t.cloudID);
                }
                this.$store.commit("setMoveInfo", o), (this.showFileMove = !0);
              } else this.$emit("toCopyContents");
            },
            handleAccusation: function () {
              v.a.fmDataReport(
                { page_title: this.pageTitle, click_object: "举报" },
                "file_click"
              ),
                1 === this.actionList.length
                  ? this.$emit("toAccusation")
                  : this.$toast("只能举报单个文件");
            },
            toShowBatchOpr: function (t) {
              this.$store.state.batch.isSync ||
                this.$store.commit("setShowBatchOperation", !0),
                t.imgType || (t.imgType = "fileFolder"),
                s.eventBus.$emit("batchInit", t);
            },
          },
          computed: Object(o.a)(
            {
              btnList: function () {
                var t = [];
                this.isShowDownload &&
                  this.canDownload &&
                  (t[this.isShowDownload] = this.buttonList.download),
                  this.isShowShare &&
                    (t[this.isShowShare] = this.buttonList.share),
                  this.isShowCopyContents &&
                    (t[this.isShowCopyContents] = this.buttonList.copyContents),
                  this.isShowMoveOutSafeBox &&
                    (t[this.isShowMoveOutSafeBox] =
                      this.buttonList.moveOutSafeBox),
                  this.isShowDelete &&
                    (t[this.isShowDelete] = this.buttonList.delete),
                  this.isShowAccusation &&
                    this.canAccusation &&
                    (t[this.isShowAccusation] = this.buttonList.accusation),
                  this.isShowRename &&
                    this.canRename &&
                    (t[this.isShowRename] = this.buttonList.rename),
                  this.isShowMove &&
                    (t[this.isShowMove] = this.buttonList.move),
                  this.isShowMoveInSafeBox &&
                    (t[this.isShowMoveInSafeBox] =
                      this.buttonList.moveInSafeBox);
                for (var e = t.length - 1; e >= 0; e--)
                  void 0 === t[e] && t.splice(e, 1);
                return t;
              },
              outsideButtonList: function () {
                var t;
                return (
                  (t = this.btnList.length > 4 ? 3 : this.btnList.length),
                  this.btnList.slice(0, t)
                );
              },
              moreActionButtonList: function () {
                return (
                  this.btnList.length > 4 &&
                  this.btnList.slice(3, this.btnList.length)
                );
              },
              canDownload: function () {
                var t = this.actionList.every(function (t) {
                  return t.contentID;
                });
                return "ios" !== this.deviceInfo.Os && t;
              },
              canAccusation: function () {
                var t = this.actionList.every(function (t) {
                  return t.contentID;
                });
                return 1 === this.actionList.length && t;
              },
              canRename: function () {
                return 1 === this.actionList.length;
              },
              isBatchOpr: function () {
                return (
                  this.actionList.length > 1 ||
                  (1 === this.actionList.length &&
                    "catalogID" in this.actionList[0])
                );
              },
              msg: function () {
                if (1 === this.actionList.length) {
                  var t = this.actionList[0];
                  if (t.contentName) {
                    var e = t.contentName.lastIndexOf(".");
                    return -1 === e
                      ? t.contentName
                      : t.contentName.substring(0, e);
                  }
                  if (t.catalogName) return t.catalogName;
                }
                return "";
              },
            },
            Object(r.e)({
              defaultSafeCatalogID: function (t) {
                return t.safe.rootID;
              },
              deviceInfo: function (t) {
                return t.deviceInfo;
              },
              isSafeChecked: function (t) {
                return t.safe.isSafeChecked;
              },
              hasSafe: function (t) {
                return t.safe.hasSafe;
              },
              isBatchOprSuccess: function (t) {
                return t.batch.isBatchOprSuccess;
              },
              batchResult: function (t) {
                return t.batch.batchResult;
              },
              needUpdatePath: function (t) {
                return t.batch.needUpdatePath;
              },
              showBatchOperation: function (t) {
                return t.showBatchOperation;
              },
              batchOperationType: function (t) {
                return t.batch.actionType;
              },
              groupData: function (t) {
                return t.batch.groupData;
              },
              completeAccount: function (t) {
                return t.auth.completeAccount;
              },
              isOnline: function (t) {
                return t.isOnline;
              },
              belongsPlatform: function (t) {
                return t.auth.belongsPlatform;
              },
            })
          ),
          watch: {
            $route: function (t, e) {
              t.name === this.routerName &&
                (this.routerPath = decodeURIComponent(this.$route.path)),
                (this.showFileMove = !1);
            },
            showActionBar: function (t) {
              t || ((this.showMoreAction = !1), (this.showFileMove = !1));
            },
            isBatchOprSuccess: function (t) {
              var e = decodeURIComponent(this.$route.path);
              if ("/main" === this.$route.path) var a = Object(l.Q)();
              else
                a =
                  "/safe" === this.$route.path
                    ? Object(l.V)()
                    : this.$route.params.catalogID;
              if (
                (console.log("批处理操作成功", this.routerPath, e),
                t &&
                  this.routerPath === e &&
                  (console.log("待刷新页面", e, this.needUpdatePath),
                  this.needUpdatePath.indexOf(e) > -1 ||
                    this.needUpdatePath.indexOf(a) > -1))
              ) {
                var i = this.$route.name;
                "groupFile" === i &&
                "sharedGroupCopyContentToMyCloud" === this.batchOperationType
                  ? this.$emit("toRefresh", { batchResult: this.batchResult })
                  : "familyCloud" === i &&
                    "familyCloudCopyContentToMyCloud" ===
                      this.batchOperationType
                  ? this.$emit("toRefresh", { type: "move" })
                  : "myCloudPictureDelete" === this.batchOperationType ||
                    this.$emit("toRefresh", { batchResult: this.batchResult });
                var o = this.needUpdatePath.indexOf(e) > -1 ? e : a;
                this.$store.commit("batch/resetBatchResult"),
                  this.$store.commit("batch/removeUpdatePath", o);
              }
            },
          },
        },
        w =
          (a("3b8a"),
          Object(p.a)(
            A,
            function () {
              var t = this,
                e = t._self._c;
              return e(
                "div",
                { staticClass: "action-bar-wrap" },
                [
                  e("transition", { attrs: { name: "fade-in" } }, [
                    e(
                      "div",
                      {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: t.showActionBar,
                            expression: "showActionBar",
                          },
                        ],
                        staticClass: "bottom-action-bar",
                      },
                      [
                        t._l(t.outsideButtonList, function (a, i) {
                          return e(
                            "div",
                            { key: i, staticClass: "bottom-action-bar-item" },
                            [
                              e(
                                "div",
                                {
                                  directives: [
                                    {
                                      name: "log",
                                      rawName: "v-log",
                                      value: { key: a.key, desc: a.desc },
                                      expression:
                                        "{ key: item.key, desc: item.desc }",
                                    },
                                  ],
                                  staticClass: "bottom-action-bar-click-area",
                                  attrs: { "data-hecaiyun-click": "" },
                                  on: {
                                    click: function (e) {
                                      return t.toClick(a.click);
                                    },
                                  },
                                },
                                [
                                  e("img", {
                                    attrs: {
                                      "data-hecaiyun-click": "",
                                      src: a.url,
                                      alt: "",
                                    },
                                  }),
                                  e(
                                    "div",
                                    {
                                      staticClass: "action-text",
                                      attrs: { "data-hecaiyun-click": "" },
                                    },
                                    [t._v(t._s(a.name))]
                                  ),
                                ]
                              ),
                            ]
                          );
                        }),
                        e(
                          "div",
                          {
                            directives: [
                              {
                                name: "show",
                                rawName: "v-show",
                                value: t.moreActionButtonList,
                                expression: "moreActionButtonList",
                              },
                            ],
                            staticClass: "bottom-action-bar-item",
                          },
                          [
                            e(
                              "div",
                              { staticClass: "bottom-action-bar-item" },
                              [
                                e(
                                  "div",
                                  {
                                    staticClass: "bottom-action-bar-click-area",
                                    on: { click: t.handleMoreActionModal },
                                  },
                                  [
                                    e("img", {
                                      attrs: { src: a("0ab7"), alt: "" },
                                    }),
                                    e("div", { staticClass: "action-text" }, [
                                      t._v("更多"),
                                    ]),
                                  ]
                                ),
                              ]
                            ),
                          ]
                        ),
                      ],
                      2
                    ),
                  ]),
                  e("transition", { attrs: { name: "fade-in" } }, [
                    t.showMoreAction
                      ? e("div", { staticClass: "more-action-modal" }, [
                          e(
                            "div",
                            { staticClass: "modal-content" },
                            t._l(t.moreActionButtonList, function (a, i) {
                              return e(
                                "div",
                                {
                                  directives: [
                                    {
                                      name: "log",
                                      rawName: "v-log",
                                      value: { key: a.key, desc: a.desc },
                                      expression:
                                        "{ key: item.key, desc: item.desc }",
                                    },
                                  ],
                                  key: i,
                                  staticClass: "more-item",
                                  on: {
                                    click: function (e) {
                                      return t.toClick(a.click);
                                    },
                                  },
                                },
                                [
                                  e("img", {
                                    attrs: {
                                      src: a.moreUrl ? a.moreUrl : a.url,
                                      alt: "",
                                    },
                                  }),
                                  e("div", { staticClass: "action-text" }, [
                                    t._v(t._s(a.name)),
                                  ]),
                                ]
                              );
                            }),
                            0
                          ),
                          e(
                            "div",
                            {
                              staticClass: "modal-footer",
                              on: { click: t.hideMoreActionModal },
                            },
                            [t._v("取消")]
                          ),
                        ])
                      : t._e(),
                  ]),
                  t.showMoreAction
                    ? e("div", {
                        staticClass: "more-action-mask",
                        on: {
                          click: function (e) {
                            return (
                              e.stopPropagation(),
                              t.hideMoreActionModal.apply(null, arguments)
                            );
                          },
                        },
                      })
                    : t._e(),
                  t.isShowMoveInSafeBox > 0
                    ? e("com-safe-auth", {
                        directives: [
                          {
                            name: "show",
                            rawName: "v-show",
                            value: t.safeAuthVisible,
                            expression: "safeAuthVisible",
                          },
                        ],
                        on: { safe: t.handleSafe, close: t.handleSafeClose },
                      })
                    : t._e(),
                  e("com-file-move", {
                    attrs: { visible: t.showFileMove },
                    on: {
                      "update:visible": function (e) {
                        t.showFileMove = e;
                      },
                      toRefresh: t.handleRefresh,
                      toShowBatchOpr: t.toShowBatchOpr,
                    },
                  }),
                  e(
                    "transition",
                    { attrs: { name: "fade" } },
                    [
                      e("com-share-confirm", {
                        attrs: {
                          visible: t.showShareConfirm,
                          hint: t.shareHint,
                          actionList: t.actionList,
                        },
                        on: {
                          "update:visible": function (e) {
                            t.showShareConfirm = e;
                          },
                          toRefresh: function (e) {
                            t.showShareConfirm = !1;
                          },
                        },
                      }),
                    ],
                    1
                  ),
                ],
                1
              );
            },
            [],
            !1,
            null,
            "3dabf4d6",
            null
          ));
      e.a = w.exports;
    },
    3774: function (t, e, a) {
      (e = a("ee2b")(!1)).push([
        t.i,
        ".safe-auth .dir-header{z-index:1001}.safe-auth .back-none .icon-back{display:none}",
        "",
      ]),
        (t.exports = e);
    },
    "3b8a": function (t, e, a) {
      "use strict";
      a("0b9b");
    },
    "41aa": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAzZJREFUWAntWDuIE1EUzWdjAuuKghATQbLaWFhZ2IiFhSAI2wgiiJBC8iMShYAiW6Tajx+iEvIDIQtaiGixWFhpoY2FroiFjWixm6QQRY2wJJuJ5y25w93JTGaGzARcZmB5995373lnzr55dyYul3M5CjgKOApsKwXcZu4mFov52u2210hNJBJp53I5yUgu8iYajcZMr9ebCofDj+BvaNUZIhyPx0+53e44ACNaQCrxvx6PZ7ZUKr1WmZNDIOcB2UUETvaDc5VK5ZmcoDA8Cn/ATSQSxxGcN0lW4ExKknR2AFARaDabGYSIrEuorEjZ4uoSRvbFLRXGnR4UfjksHWKcA8ELlAP7E7bcY/LVxgm1II8B5CDzF3w+3zvma5rI+5XP539oJSSTyRPAztI8ttwabvBqrVZbp5jaqEsYRfJDBsDVQqHwVQ3ITCydTh/udDrzqKH/8G/YGez3n3o4RgjrYZiaT6VS+0D2LooC/cINoTQetG9GgOgOjeSOnAOyO7vd7j0A7WVguWq1+p75Q82xERZnLU6Nm2BziDEqQdkXzNc1x7YlcNbeAJtjjNEyyD5gviFzLAqjQ14CmxnG6G0oFJpjvmHTdoXRJU+DTYIx+uL1eq8Na78sd8C0lTCUPYoVc2zV7yCbKRaLLRbbNJErHsQzODo/lsvlFeU8+bZtCXSxCJrBbSxEoqyjmVwB2SYtzkfkLuDvMo64Ms7pMJ/jti2E0cX2YBFxfO0Si4GIBGWvo+l8Fr7GNd2Pe3H0HdDIkTuN1rzpeDQaDWDBPJTaT8UgfAvKviF/lNFyhQOBwHkQPEKksCcfouU+IX/U0XLCUFa8F9D1KhgM3ifHipEeCCuwNjFwvi7X6/UpqPxH2Di+JMvAAWQ54f75umQlSY5l+Zbg4HbYDmE7VOWYjsJcDTtsR2E7VOWY21LhHt0h2q78yU8xq0aOjZcneU0lvm6nQ4tdBdhuUYjxDr4gLG21jNAOssXvH2QrR13CIPkcRfT2pZuvXMCsD4FW8MWxplWnu4dR/BTFSwCyS1nO7YPf75/lAaXtVga0/Gw2O9lqtaaxv2xRGZ9PTa3PJy1OTtxR4H9U4B8MqPhfN0KW2QAAAABJRU5ErkJggg==";
    },
    "45c8": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAAAXNSR0IArs4c6QAAAgRJREFUWAntWL1OwzAQbqBigBVQJCQmRjY6wSuwMIKY01DxBix5A9hIM3WCR2BhLkLqyBMgIVUww4D6w10VV9fGPhP5EqmSI7W+3Nnf9/WzE7luNPzlHVhtBwJp+Z1O52A6nZ5OJpPXbrf7Io2/Jg04Ho/vQOwl4N5GUbQtjS8uGASGucgmXDurIFha4wJeFQ4vEEjfGB+6drt9DmRX8NmUJrXg/UD9Hh7YR10/zuEYBtQtFjUiJ3JrL6PgIAietSNqSHLcxiWBuuC1tA9P+lYNGucUo9HoO8uy93nCBzU7wC6JJEk2hsPhBWoKw/AB7n+r0FeGp8kJQLGwL7jGPhBj08Mv6asMj/EtkYvaI+JoTNIiIcWmcQGcdbjQW5OwTaetroFkU86CbdNpq7PqNEXbktAMKaToFNJYdaQ5Gqt6qVZCcClC185esKuDtvHeYZtDrnXvsKuDtvHeYZtDrnUJhz+ICBqrNM3RWNVLtc57Cdwn51vP2Z55md1WX+5vu3cWnG/qeyYiW900zpSXWBIm7EryXnAlthLQlXOYfejgD+iX+nFw5nsSx/GNupdsERtOe2aQlFPHwQoGkD4ARDgQ4l2Iz3QgrjklNufpc3jrXHEwGHy2Wi3scsT1E6xlcGr5xOGxBylqICyFQ3D3GJwQP1FHDlwGOJtpmr4pTt96B/7pwB9Nqas+DGxQFQAAAABJRU5ErkJggg==";
    },
    "4ad37": function (t, e, a) {
      t.exports = a.p + "static/img/safe-propaganda_2x.c1bffc82.png";
    },
    "55b4": function (t, e, a) {
      "use strict";
      a("2101");
    },
    "55e5": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAADrUlEQVRYR+2Z72scRRjHn2d2qdaQ4ElfWA1GJPpCyCsppC+aFPRNoGiIHOora7I7u3dcIYK0IH1RFPOqJS9M7nZmL0R9oZGQGPwPDBZDMYg/8I36RtCKGC60NYGQm0cGdmG7XnK3aXeTo7evbneemecz33n2eWbnENrswjbjhQ5w2ivWUfhQFeacDzDGhpVSPWmDhOMzxm4ppb6SUv7YyOeeIcE5dwDAzgq0gR9fSinizxsCa2UBYP4QYUPXb8WVbgjsum5JKXVe90LEf4hoNSt4RBwiohPaH2PsI8/zZqK+91L4XQAYCwyXpZRTWQFzzvf13QG+15XIVOHJyclHt7e3TxHRMwDQg4i3GWN/EtGa53l/tzKZTIAty+o1TbOglHoRAMwGYAQA64yxGc/zftoPPHVg27ZfZoxdJKKHmymIiBp8XghRAQD9+3/XgYBt236VMTaoR1NKrfm+v9RocNu2X0fEd2JtdxDxByLaQERdIQeI6LG7UhPil0KI9+4bcDOldLtlWS8wxrRSLLD/lzE2u7GxsbK4uLgTGYO5rnuWiN4mopPhcyK66vv+QtxXywrn8/ljuVzuDQB4MjbIH7Va7bMoRD6fN3K53OcA8HRgq1UtCiF+3muyhUIhp5SaJaLnwgkahjFaqVRq0T4tA3PO3wSAC3s4/FBK+XHYZtv2MCJeC+8NwyhVKpW1ZitTLBYf393dXQSA49oWEatCCC91YMdx3ieikcDpmhCiFHU6MTHRZ5rmKCJ+63ne9Wib4zgXiEiLo4F/E0K8diDgJCHhOM4KEfVqR0T0ge/7X8SgFoioHxHrhmG8Ui6X/wrbHcd5nog+idgPSSm3wvuWQ6LZcsaAvg7TGGPM9jzvu1bbOeePAEB0MzUmpfw9beBVItKOddpzqtXqeubACUNiiYj6gjicEkIsHzQkurq6zkxPT28nVjhJlnBd94pS6lzg5IaUspj5S5cEOJ7WlFKlarWabVpLEhK6unHOPwWA/kDZzXq97s7Nzf2aWeFIkiW0rS7NiFhGRCOI5S2lVHlzc3M5k9KcFFjbc87zAHAp2hcRt4joewDQm59updQAIqa7+bEsaxARnw0Kwy/7xWehUBip1+uXAeChZpNObXvZrNrEwUql0hM7Ozs6U7x05DfwUfjx8fFu0zRPA8BTAJDTn0gAcBMRvzlSn0jNQiFJe7PV7XzmJ1Gzke2DoXA7nq211+llUMXa53w4sjdtnxP4e33b0+rf+RcpLWXDcf8DacK1S35dFZ8AAAAASUVORK5CYII=";
    },
    "5a49": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAHkUlEQVR4Xu2dfWiTRxzHn3vSPKnxJV1imrFpsc4FnI7Zqk8RLZJ0uBeKtd0fXTdWbVpmXIWBQwRR57QIbrA3lRmtsUjFDqt1otJumClaXOKsY9SCTgmlqSMJeUy6GdMkPjeuJF3ppqRN+lxMf89/LXf3vft873f33JN7nkPMqMvhcMxmGKaEYZhFGGMtQih7dBr4O3ECGOMQQsjLMMxvDMNc5Hm+b2RuFP8DYyxzOBw1DMMUcxzXpVQq77As6+c4Lpy4HKQcTSAcDnOiKOYEg0F9OBwuZBjmCs/zRxFCj0naIQNi8LezLCvXarXnEEIAfQL6EsaY83q9paIohnmebyAmDBlgt9vrWJbNz83NPT0BulDkKAIej6dCFEVnUVFRIyJjPsa4QafTHYSeL01fIZHgdrvNCKFtxIB1crlcpVarr0ojDyqEgCAIKyKRSIAY8LVKperIzs72ABrpCIRCodxAIPAGstvtx9Vq9X6425EOPlEid0eCIGwkEXBKp9PtkVYe1AgBt9u9FQyg2BfAAIrwIQIowwcDwIA0IEC5CjAHgAGUCVCWhwgAAygToCwPEQAGUCZAWR4iAAygTICyPEQAGECZAGV5iAAwgB6BUCgkO3PmzEqFQvGwvLzcTqMmkzoCLBbLRwMDA8sI+Hnz5u2nYQJ1A+x2+4uCIGgwxsM79MbSE7VarXfp0qX3x5KHpG1paVnV19f3QTxfXl6etbKy8uexlpNsemoGdHd3a202W/3g4OBLSTYC6/X6b8vKyn5NtBybzfZyV1fXVoxxFsnDcVzv2rVrP8vJyYkkWkaq0lExwO/3y5uamvZEIpHnU9EQjUZz3mQytSRSltPpnNHW1tbw+PHj50h6mUz2cNWqVdsXLlxINs9KflExoLW1tdjpdH4Yby3Lsn/HN6qOlUBWVpbHaDR+lwjAUCjENjY2bnn06NErMR08f/78L0tLS8muZSoXFQMOHz681u/3v05aPG3atK4NGzZ8JUXrrVZrpc/nK41rzZw584eamppWKbSfpEHFgEOHDtUFAoGVpFIajeYnk8l0bKIhnD17dvHt27c/ju8GnzJlSrfZbP48KysLT7T208qfFAbcvHlTZ7PZdomiqIyN+741a9Zsnzt37l804RPtjDfA5/Nxzc3NO8PhMHnrh1zRJUuWNBgMhnu04U8KAywWi3lgYGB5HHZeXl5TZWXlxXSAn/EGnDhxosTlcq2Lw54xY0bn+vXrD6YL/Iw24PLly3MdDsd2hmGGFltyubyvpqZmp0qlSqtXrzJyDujt7Z126tQpstjSEPgsywaNRuOOgoICdzr1/oyMgGg0iiwWy+ZgMPgqaSBCiDyq+Gb16tU30g1+RhrQ1NT0jtfrXROHrdFozplMpu/TEX7GGXDhwoXXbt269cmIxVZPXV3d3uzsbBEMGEFgIlbC5Olqe3v7bozx1Nhi60F5efm2/Pz8gXSFnzERQJ6uHjt2bMfg4OCc2LgfLSws3GM0Gv9IBH57e/vC/v7+Ar1ef7W4uNiZSJ5UpcmIu6CREUXAzJo1q7mqqqojEUgul2tqS0vLPoyxXCaTBTZt2rQxkXypSvPMG9Da2rrS6XTWxYFMnz79F7PZfCBRQNevX3/h0qVLe+PpTSZTrUajkWyt8Ewb0NnZOefatWs7SO+NLbb6q6urP1Wr1YNgwFMIpGISJkPHyZMnd0ejUW1s3A8ZDIYdixcv/jNR+CQdRMA4fw+wWq1VPp/v7ThsvV6/r6yszDEW+GBAEj/IWK3W93w+31sEolqtbq+trT0+VvhgQBIGeDye7I6OjjdlMlmooqLix/EutmAIGucQNJ7e/n95wAAwQPpvRaTiLggiIAkCYMC/8J7phVgSfWA4K8wBMAfAHADPgiTYGfek4QqGIBiCYAiCIQiGIGm/mgjrAFgHwDpA6vcD4C5oBIEjR468LwjCm+RfCoXirsFgOKBQKIa+pS/1dePGjSUul6s6phvdvHkzOT9BsovKo4jz588X9PT0bJKslQkKKZXK3+vr679IMHlKklExILZ/c0swGFyQklakoBDy2f7ly5fvWrZsWW8Kiku4CCoGkNoJgqBoa2t71+/3rxBFkeoZNQqF4t6CBQuaS0pK7iZMLkUJqRkQrz95dfT+/ftTEULjelM+WQ4qlWpwLNtYktUbnZ+6Aalu0LNWHhhA2TEwAAygTICyPEQAGECZAGV5iAAwgDIByvIQAWAAZQKU5SECwADKBCjLQwSAAZQJUJaHCAADKBOgLA8RAAZQJkBZfigC4EBnOi6QA50fPHhQD0ea0+HPDB9p7nA41snlcpVarb5KqS6TUlYQhBWRSCRAImA2xrhBp9MdJPtjJiUNiRuNMebcbrcZIbRtaDuI3W6vY1k2Pzc397TEdZmUch6Pp0IURWdRUVHjkAEYYxn5zibLsnKtVnsOImFi+gXp+V6vt1QUxTDP8w3ks/3DG6JiJpDNqcUcx3Uplco7LMv6OY6DYSkJP8jdjiiKOcFgUB8OhwsZhrnC8/zR+JkJ/9mRRuYEhmFKGIZZhDHWIoSobh1Mou1pkRVjHEIIkRM6yEERF3me7xtZsX8Aa5RMe7Kt0egAAAAASUVORK5CYII=";
    },
    6425: function (t, e, a) {
      "use strict";
      a("f145");
    },
    7794: function (t, e, a) {
      t.exports = a.p + "static/img/safe-activated.5ff91d49.png";
    },
    "7d67": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAIV0lEQVR4Xu2dcWwT1x3H3zvnDs8VOLITG5Aj4hIVRmEMEBeKCv6jYgjwIqAEYS2IxKtSplCVxLTd2vJPhYq0DqkUhKMJ4SoosEWsVSgkNEsYUZMFn5RSJ5ChQhS0GpVzEoODYxzbuate1IvSNE3OPt8dOO/+SnS/3+/73vdz72zf3XsHwaSNYZg8AMArAIDf8jyfCyHUTo7B/4t3gOf5KISwHwDwDQCghabp7yZmQ+Efnuc1DMOUAQA2UBT1tU6n+5YgiEcURcXEy+HIyQ7EYjGK47jsSCTyQiwWWw0A+IqmaQ+EcBTFjgH40fzDBEGQubm5lyCE2HQZjiWe56n+/n47x3ExmqaPIAhjALxe72sEQVhNJtNnMujikpMcCAQCOzmO6yssLDwN0Tmf5/kjZrO5Gh/5yhwraCSwLLsfQvg+AlBKkqTeYDC0KSOPVZADwWDw5Xg8HkIAPtbr9V9qtdoAtkY5B6LRqCkUCm2GXq+31mAwnMTfdpQzHymhb0fBYPAAGgH/MpvNHyorj9WQAyzLvosBqHgsYAAqmo9HgMrmYwAYwFPggMpNwJ8BGIDKDqgsj0cABqCyAyrL4xGAAajsgMryeARgACo7oLI8HgEYgMoOqCyPR8BsAeD3+59raWnZPDQ09OLo6OhzKvd7Snn0QIJOp+tbvXr1lTVr1nyvRBsVGQHd3d05zc3N7yUSiRwlOiVVA4FYtmzZJ1u3bvVJrTVTviIATpw48W40Gv31TI15mvZrNJrh3bt3uywWy7Cc7ZIdgM/nMzU1NR0TOjFv3rxrRqPxtpydSrV2JBIxsCy7EwCQhWpYrdbTu3btak21npg82QFcuXJleXd39zuoMQRBRFwu1+tiGqZWzKlTpw4ODw+vQfo5OTlflJWV1cnZFtkBNDQ0rLx169Yh1AmNRhOqqqo6IGeHpNaurq6uePz48TpUx2g0NjidzvNSa06XjwFMcgcDkPNwE1EbAxBhkpwhGICc7oqojQGIMEnOEAwgCXdv3Lhh7ujocFAUFSwqKqozmUzRJNKnDMUAknDQ7XYfCIfDhSiFoqi+bdu2HSsoKAglUeJnoRhAEu55PJ49AwMD24QUkiQDNpvtr6tWrWKTKPOTUAwgCefC4XBWbW1t+dDQ0EtCGkEQj9euXXts48aNvUmUGg/NaAAEQYRcLlfafwmfOXPGMTg4uHUChJElS5actNvtaF5uUlvGAejp6cm5fPnyR+gCl06n66qoqEB/p307f/78Zr/f/wdh2i2a/rlo0aJPi4uLryUjlnEAUOfb29vz/X6/1WazeefPnx9JxpBkYuvr6+k7d+7s53meFPJMJtPn+/btEz31NiMBJGOi1Njm5ualXV1dByfedcvOzr62d+9ej1ar5WaqjwHM5JCI/QzDWNrb2w8lEgmjEK7T6b5xOBwnDQbDyHQlMAARBosJuX37tqGxsfGtRCJhEeLnzJnTW1JScnQ6CLMSQDQaJerr622RSMQsxlyxMYlE4lehUMiG1sEQcma6xj8rAZw7d+539+/f3yvWWClxWVlZbGVl5dgNoqm2WQmgpqbm9yzL7pZirNjcrKysgcrKykoMYIIDg4OD1MWLF4tGRkbSegpCt6HD4TBadIoS5PR6/X/Ky8vPYABiD9kU4wKBgLauru7NJ0+eLBdKoNPP9u3bP7BarUMYQIrGikm7e/euvqGh4dDIyEi+EE+S5D273f63ma6WzsrPADGmio1B9whaW1vfjsfjpgm/AbqLi4s/EXO/AAMQ6/QUca2trc93dna6RkdH5wm7586d+9/S0tK/a7XasfXZZtowgJkc+oX9jY2Nv+np6XmD47jxFR6NRuNlp9P5j2RKZiyAUChE6fV6WRYCvHDhwoZ79+79ccIPLt5isdQ6HI4vkzEfxWYcAGS8x+M5HI/HFy1YsKCupKTkUrKmTBd/9uzZogcPHuwSLkMDABIFBQXVO3bs8Kaik3EAmpqaXvT5fH9GZmg0msGqqqqDqRgzVc6P9wBKhH0QwicrV678eNOmTT2pamQcADmfDXW73ZXhcBgthIrgPlq3bt1H69ev/3+q5mfkKUhOAFevXl3i8/leJ0kyaLPZqlesWDEgxXwMQKp7acjHp6A0mCilBAYgxb005GIAaTBRSgkMQIp7acjFANJgopQSGIAU99KQm3EA0EWymzdvvoW8IQgi7HK5/pQGn2Qr4Xa73wiHwzQSMBqNl5xO5z9lE1Ni6eKOjg5LW1vbUaETCxcuPJefn/8/OTuVau2BgQFDb29vufBQl8ViqXE4HP9OtZ6YPNlnSaJGHD9+/GgsFht/PkdMw9SOgRDG7Xb7oaVLlwblbIsiANra2p6/fv36X3ief1bexsTn5eXV7Nmzp1lO81FtRQAgoc7OzgUMw7w6PDy8nOf5p3a1FK1W27d48eKLW7Zs6ZLbfEUBKNGZZ1FDsRHwLJqjRJsxACVcnkYDA8AAVHZAZXk8AjAAlR1QWR6PAAxAZQdUlscjAANQ2QGV5fEIwABUdkBleTwCMACVHVBZHo+ApwEAfqGzOhTQC50fPnxYgV9pro7/YPyV5gzDlJIkqTcYDG0qtWVWygaDwZfj8XgIjYA8nuePmM3mavTyglnphsKdRrP3WZbdDyF8HyJtr9f7GkEQVpPJJHp1KYXbnFFygUBgJ8dxfYWFhafHAKAZhgzDHCYIgszNzb2ER4I8vNGR39/fb+c4LkbT9BG0tt0YgAkQygAAGyiK+lqn031LEMQjiqLwaUkCD/Rth+O47Egk8kIsFkNz2r6iadqDzEdlxwEIGugzAQDwCgAArTSSCyF8Vh6okmCTfKk8z0chhP0AALSMZgtN099NVPsBAWmke8Cis3IAAAAASUVORK5CYII=";
    },
    8740: function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAADrUlEQVRoQ+2bT2gUVxzHv7+XzGyI2FKKBg9t1GJt6r/dBKF4KihIFbFUCQi2R+2hVAhFiZqdN5vUNl5ayclDoSB4qCjSehAspfSSFtmd6MGkNSB4ymHRZpPqzuxmfjImu51IJtnNZsnb3Znjzpu3v8/v+/29N+/xhtBgFzUYL0Lgeld8UYV3yey7QtA3YNoH8GtqJ4MyIP7Vdbn3nmz5JyjWQOCXsCT+BPgNtUFfjY6euux+EAQdCBxL2NfB+KS2YOeiJdyw4pEjC8UeDGw6k+rbONC4GcvQXy8T2Gb/A5YRUXpEj5mlxbuIwqV1oIrlQ+AAR4YKFyxaqkVCS69SBkoVKLR0aOm5DITz8CrVatDfKlvDuwf4rZybf7uJsCZP/G82Mzn698V1U5XmTyngLsmtLJwvXMZJAjbPh6M8CL9DUL91XvtjueDKAEfl841E4mcAOxaDYcAliLOWoQ0uB1oJ4K2DvLY16/wFoOMVVTMATwPYAMzfZmKge8SIXCsXWgngmLRNEOL/B09JEvxpqk8fA4h3Sl7fRM73AI75AMctI7KlNoHN7ARAbbPBU9pmbdMDSZ6yxetDyc2T5IwA2Fb4UTA6kjIyVg70qivcJe33XMJoIWgGfTdi6D0LQcTM3LeAe6Zwj1h8lJLa7ZoCjvXn9sF17xQhQJ+nDP3yQhBR0+4l4IIPeG9Kar/VFPD2r6fbtHxLZyHoZm6y7kqaWFhh21Nzf9HSrt6eNOlxTQGXGmzUzB8mzNz0tX9oxfWtIJq3xbRUf6tew0sF6N2PmvmDhJmfALT6RvLPLEO/Usrz/jbKA8f67aNwcRWA5oMdsgztlDdl1RVwVGYPEJFn4wIsg0TcimsD5YIW2iurcGyA2zGTu1/Y8559paQTlqH/sFxY7zl1gRPOJTB/WYRj9Fkysmxl1VfYtB8B2OgFyqAnDmsbHkhyKlFXXYWZKZZwPLjml8CEWyPxyKFKYZUFfl+yrsMeKr5gCDGcius/1i3wSoAF9aHmoMVM0YT9FUF8DOa00MhMntNTK5EIJYE7E84JZvYtIDg9xf+9My7fzFQKrSRwNOFcIebj8+BI7LHi2nBdAncm7NPM8O9ZPROstyclpesS2BulW0RuiBndAKcJTT0po/mXSmGVnZZWAqy2RukqEis5aFWRV93FQ7WgQ4XDMx6z3gpPAJS7oK5WTZbbb1jDYQ0vWcONdri00Y4PN9wBcc/xDfUJQLnTQq20V/rQdzWSGAJXI6sq9fkCJ1WLW0D4b0YAAAAASUVORK5CYII=";
    },
    8791: function (t, e, a) {
      (e = a("ee2b")(!1)).push([
        t.i,
        ".fade-in-enter-active[data-v-3dabf4d6]{-webkit-transition:all .2s linear;transition:all .2s linear}.fade-in-leave-active[data-v-3dabf4d6]{-webkit-transition:all 0s;transition:all 0s}.fade-in-enter[data-v-3dabf4d6],.fade-in-leave-to[data-v-3dabf4d6]{-webkit-transform:translateY(4.8rem);transform:translateY(4.8rem)}.fade-enter-active[data-v-3dabf4d6],.fade-leave-active[data-v-3dabf4d6]{-webkit-transition:opacity .5s;transition:opacity .5s}.fade-enter[data-v-3dabf4d6],.fade-leave-to[data-v-3dabf4d6]{opacity:0}.bottom-action-bar[data-v-3dabf4d6]{position:fixed;bottom:0;left:0;right:0;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;height:4.8rem;text-align:center;background:#fff;letter-spacing:0;-webkit-box-shadow:0 -.6rem 1rem -.3rem rgba(0,0,0,.05);box-shadow:0 -.6rem 1rem -.3rem rgba(0,0,0,.05);z-index:199}.bottom-action-bar .bottom-action-bar-item[data-v-3dabf4d6]{-webkit-box-flex:1;-ms-flex:1;flex:1;height:100%}.bottom-action-bar .bottom-action-bar-item .bottom-action-bar-click-area[data-v-3dabf4d6]{width:-webkit-max-content;width:-moz-max-content;width:max-content;margin:auto;height:100%}.bottom-action-bar .bottom-action-bar-item .bottom-action-bar-click-area img[data-v-3dabf4d6]{width:2.2rem;height:2.2rem;margin:.4rem auto}.bottom-action-bar .bottom-action-bar-item .bottom-action-bar-click-area .action-text[data-v-3dabf4d6]{font-size:1.1rem;font-weight:400;color:#666}.more-action-mask[data-v-3dabf4d6]{top:0;z-index:999;background:rgba(0,0,0,.3)}.more-action-mask[data-v-3dabf4d6],.more-action-modal[data-v-3dabf4d6]{position:fixed;bottom:0;left:0;right:0}.more-action-modal[data-v-3dabf4d6]{z-index:1000;height:15.8rem;background:#fff;font-size:1.2rem;border-radius:.4rem .4rem 0 0}.modal-content[data-v-3dabf4d6]{height:10.4rem;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-ms-flex-pack:distribute;justify-content:space-around}.more-item[data-v-3dabf4d6]{height:100%;color:#666;text-align:center}.more-item img[data-v-3dabf4d6]{width:4.8rem;height:4.8rem;margin:1.8rem auto 1rem}.more-item .action-text[data-v-3dabf4d6]{font-size:1.1rem;font-weight:400;color:#666}.modal-footer[data-v-3dabf4d6]{color:#3181f9;font-size:1.6rem;border-top:1px solid #f2f2f2;height:5.4rem;line-height:5.4rem;text-align:center}.safe-auth-mask[data-v-3dabf4d6]{position:fixed;left:0;top:0;width:100%;height:100%;z-index:1000;background-color:#fff}",
        "",
      ]),
        (t.exports = e);
    },
    9588: function (t, e, a) {
      "use strict";
      a("af44");
    },
    "9c8f": function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAADiUlEQVRYR+2ZT2gUVxzHf783ugm7UjAWxUJPEkp7tCraGgxUKi1UvISiNZDQzXuzhG3IxTYXV8GDkEIEQ3bey4QsikgJvSS9FDzkUNSrIDWHgmACOQjZm2bNzPuVKVkZktnt7MtOYnD3uPP783nf93vvN+8Nwi774S7jhRZw0jPWUnhHFc7n8x94nnd4bW2NJQ1iWZZXqVQWS6XSar1ckSXR19fXnkqlfgGAbwEgcdgqICIGsNNSyqla0JHAnPMCAHyXtKo1oRBHpZS/RT3fBByUQaVSebCdym4EQ8QlKeWFWMC5XO4T3/fvVY0zmUzX2NjY66TV5pwfBQC1nkcrpU7EAs5ms58yxu5WjZVSx5KGDeLHzbupJOI6NnsQcfO2gAPlc7ncft/3LxHR4uTk5Gyc2dhRhYUQN4no7DroXLlcvjEzM+PXA3+XgAERH6bT6Z/r7TY7Csw5/xAAbgNAZ0jVZ77vD01NTa1EKW0MbNv2Qa31H0HjQMSXUspv4tTgRpuenp59HR0do0R0PNR6lyzLyk9MTCxutDcGDgLZtn1Oa/0lIv4upXxiAhz4cM73AsA1ADgXilFmjA07jvM0HHdLwKaANfyQcz4EAJdDz4POOaKU+qv6XyLAQftExC4AsAwG9RURHQqVxyoR9SillrfU6WqBDA4OHvA8b46IUgawkS6MsXHHcUqJAGez2UOWZc0SkYm6kcCIWKy++yZSErZtd2utz5iUBCJ+Hi4JAHijtf7Bdd3niSi8lTIYGBjoRcSfAN5eK3iMsYLjOH8muugMoFEIMUxEl0KL7RVj7EqxWHzc1G2tu7t7z/z8vGcA+Z9LsAcj4nUi+roag4hWiGjIdd1nTWschUKBLS8vjwHAKQC4o5QabxS6t7c3k06nfw13OQBY1FrnXdddiopnvOg450cAoHoAfKOU+qJRYCHEVSI6H/L727KsoWKxWK4Vyxg4rmO9QQghbhHR6XWbR5lM5sr/nQvj5k3kxNHf3/9xKpXiiPhiYWFhOs5a2FHgRktoS/tw3JGaQNXziZs3kZIwGcz7AyyE6CSi+yGVuNY68ZsfRPwMEUfW83pKqZNRM7WpJIKby7a2tgdE1G4ytc3wQcQFKWX4hf9t2MjbSyHEj0SUa0ZygxgEAMPh00g4Rs1PBkKI7wHgIhF9tE03mR4i/kNETi3YALz1jcOgBBpyaSnckFwGxv8CKVvEPCi+hkMAAAAASUVORK5CYII=";
    },
    a204: function (t, e, a) {
      t.exports = a.p + "static/img/safe-verifyEmail.7951ba28.png";
    },
    a556: function (t, e, a) {
      var i = a("e629");
      i.__esModule && (i = i.default),
        "string" == typeof i && (i = [[t.i, i, ""]]),
        i.locals && (t.exports = i.locals);
      (0, a("c69b").default)("3fbb8963", i, !0, {
        sourceMap: !1,
        shadowMode: !1,
      });
    },
    aa82: function (t, e, a) {
      t.exports = a.p + "static/img/safe-verifyPhone.25c79d00.png";
    },
    af44: function (t, e, a) {
      var i = a("d501");
      i.__esModule && (i = i.default),
        "string" == typeof i && (i = [[t.i, i, ""]]),
        i.locals && (t.exports = i.locals);
      (0, a("c69b").default)("b03c98ce", i, !0, {
        sourceMap: !1,
        shadowMode: !1,
      });
    },
    b468: function (t, e, a) {
      t.exports = a.p + "static/img/share_background.31468e95.png";
    },
    bf85: function (t, e, a) {
      "use strict";
      var i = a("eb2f"),
        o = a("c5ea"),
        n = a("4ed7"),
        s = a("f20f"),
        r =
          (a("a551"),
          a("2664"),
          a("874c"),
          a("4b03"),
          a("ffc9"),
          a("08f2"),
          a("129e"),
          a("d407"),
          a("4cd2"),
          a("5529"),
          a("a249"),
          a("5437"),
          a("afe7"),
          a("6eef")),
        c = a("090e"),
        l = a("ad7e"),
        u = a("fe2b"),
        d = a("2176"),
        f = a("b441"),
        h = a("b09a"),
        m = a("6d9b"),
        p = a("11cd"),
        g = a("c276"),
        b = [],
        v = {
          name: "fileMove",
          components: { ComFileList: h.a, ComEmptyList: m.a, MescrollVue: p.a },
          props: { visible: { type: Boolean, default: !1 } },
          data: function () {
            return {
              catalogId: "",
              title: "",
              catalogInfo: [],
              pageNum: 1,
              loadingEnd: !1,
              isCreatedCatalog: !1,
              nodeCount: 0,
              isCreating: !1,
              catalogSortType: 0,
              contentSortType: 0,
              sortDirection: 1,
              failedType: "",
              mescroll: null,
              mescrollDown: { use: !1 },
              mescrollUp: {
                callback: this.upCallback,
                page: { num: 0, size: f.M },
                noMoreSize: 99999,
                lazyLoad: { use: !0 },
              },
              nextPageCursor: null,
              isCompleted: !1,
            };
          },
          created: function () {
            (window.comFileMove = this), this.init();
          },
          methods: {
            mescrollInit: function (t) {
              this.mescroll = t;
            },
            init: function () {
              this.$store.commit("setCurRouter");
              var t = this.move.currentRouter,
                e = t.id,
                a = t.title;
              (this.catalogId = e), (this.title = decodeURIComponent(a));
            },
            closeModal: function () {
              this.isCreatedCatalog
                ? (this.$emit("toRefresh", { type: "move-create-catalog" }),
                  (this.isCreatedCatalog = !1))
                : this.$emit("update:visible", !1);
            },
            handleCreate: function () {
              if (this.isOnline) {
                var t = this,
                  e = !1;
                "baidu" === Object(g.r)().Browser &&
                  "ios" === Object(g.r)().Os &&
                  (e = !0),
                  this.$confirm({
                    title: "新建文件夹",
                    showInput: !0,
                    closeOnConfirm: e,
                    msg: "新建文件夹",
                    onConfirm: function (e) {
                      return Object(s.a)(
                        Object(n.a)().m(function a() {
                          var i, o, s;
                          return Object(n.a)().w(
                            function (a) {
                              for (;;)
                                switch ((a.p = a.n)) {
                                  case 0:
                                    if (!t.isCreating) {
                                      a.n = 1;
                                      break;
                                    }
                                    return a.a(2);
                                  case 1:
                                    if ((i = e.trim())) {
                                      a.n = 2;
                                      break;
                                    }
                                    return t.$toast("名称不可为空"), a.a(2);
                                  case 2:
                                    if (!f.w.test(i)) {
                                      a.n = 3;
                                      break;
                                    }
                                    return (
                                      (i = i.replace(
                                        /[|/\\:*?？：“”<>"‘&]/g,
                                        ""
                                      )),
                                      t.$toast("名称包含非法字符"),
                                      a.a(2)
                                    );
                                  case 3:
                                    if (!(Object(g.s)(i) > 240)) {
                                      a.n = 4;
                                      break;
                                    }
                                    return (
                                      t.$toast(
                                        t.$t(
                                          "shareCommon.Folder_name_too_long_new_creation_failed"
                                        )
                                      ),
                                      a.a(2)
                                    );
                                  case 4:
                                    if (!/\.$/.test(i)) {
                                      a.n = 5;
                                      break;
                                    }
                                    return (
                                      t.$toast("名称夹不能以.字符结尾"), a.a(2)
                                    );
                                  case 5:
                                    if (
                                      !t.move.isShareGroup ||
                                      !t.move.groupMess ||
                                      t.move.groupMess.isCopyContents
                                    ) {
                                      a.n = 10;
                                      break;
                                    }
                                    return (
                                      (t.isCreating = !0),
                                      (a.p = 6),
                                      (a.n = 7),
                                      Object(d.c)(
                                        {
                                          parentCatalogID: t.catalogId,
                                          newCatalogName: e,
                                          isShareGroup: !0,
                                          groupID: t.move.groupMess.groupID,
                                        },
                                        t.move.isSafeBox &&
                                          !t.move.isMoveOutSafe,
                                        {
                                          isShareGroup: !0,
                                          groupID: t.move.groupMess.groupID,
                                          catalogID:
                                            0 !== b.length ? t.catalogId : "",
                                        }
                                      )
                                    );
                                  case 7:
                                    (o = a.v),
                                      t.catalogId === Object(f.Q)() &&
                                        t.$store.commit("setPageNeedUpdate", {
                                          page: "/main",
                                          status: !0,
                                        }),
                                      (t.isCreatedCatalog = !0),
                                      t.$confirm.hide(),
                                      t.$store.commit("pushRouterStack", {
                                        id: o.catalogID,
                                        title: encodeURIComponent(
                                          o.catalogName
                                        ),
                                      }),
                                      t.toRefresh(),
                                      setTimeout(function () {
                                        t.isCreating = !1;
                                      }, 500),
                                      (a.n = 9);
                                    break;
                                  case 8:
                                    (a.p = 8),
                                      "1909015006" === a.v.status &&
                                        t.routerPop(),
                                      (t.isCreating = !1);
                                  case 9:
                                    return a.a(2);
                                  case 10:
                                    return (
                                      (a.n = 11),
                                      Object(d.c)(
                                        {
                                          parentCatalogID: t.catalogId,
                                          newCatalogName: e,
                                        },
                                        t.move.isSafeBox &&
                                          !t.move.isMoveOutSafe
                                      )
                                    );
                                  case 11:
                                    (s = a.v),
                                      t.catalogId === Object(f.Q)() &&
                                        t.$store.commit("setPageNeedUpdate", {
                                          page: "/main",
                                          status: !0,
                                        }),
                                      (t.isCreatedCatalog = !0),
                                      t.$confirm.hide(),
                                      t.$store.commit("pushRouterStack", {
                                        id: s.catalogInfo.catalogID,
                                        title: encodeURIComponent(
                                          s.catalogInfo.catalogName
                                        ),
                                      }),
                                      t.toRefresh();
                                  case 12:
                                    return a.a(2);
                                }
                            },
                            a,
                            null,
                            [[6, 8]]
                          );
                        })
                      )();
                    },
                  });
              } else this.$toast("网络异常，请稍后重试");
            },
            routerPop: function () {
              this.$store.commit("popRouterStack"), this.toRefresh();
            },
            toRefresh: function () {
              this.init(),
                (this.catalogInfo = []),
                (this.nextPageCursor = null),
                (this.isCompleted = !1),
                (this.loadingEnd = !1),
                this.mescroll.resetUpScroll();
            },
            doRefresh: function () {
              var t = this;
              (this.failedType = ""),
                (this.nextPageCursor = null),
                (this.isCompleted = !1),
                this.getListData(1, this.pageNum * f.M, function (e) {
                  (t.catalogInfo = e.catalogInfo), (t.nodeCount = e.nodeCount);
                });
            },
            doMove: function () {
              var t = this;
              return Object(s.a)(
                Object(n.a)().m(function e() {
                  var a, i, o;
                  return Object(n.a)().w(
                    function (e) {
                      for (;;)
                        switch ((e.p = e.n)) {
                          case 0:
                            if (
                              (sessionStorage.setItem(
                                "moveLength",
                                t.move.length
                              ),
                              t.isOnline)
                            ) {
                              e.n = 1;
                              break;
                            }
                            return t.$toast("网络异常，请稍后重试"), e.a(2);
                          case 1:
                            if (
                              (t.$loading("操作中..."),
                              t.isPDSUser ||
                                !t.move.parentCatalogId.includes(t.catalogId))
                            ) {
                              e.n = 2;
                              break;
                            }
                            return (
                              t.$toast("无法移动至自身所在目录"),
                              t.$loading.hide(),
                              e.a(2)
                            );
                          case 2:
                            if (
                              !t.isPDSUser ||
                              (t.move.parentCatalogId !== t.catalogId &&
                                (t.catalogId !== Object(f.Q)() ||
                                  "root" !== t.move.parentCatalogId))
                            ) {
                              e.n = 3;
                              break;
                            }
                            return (
                              t.$toast("无法移动至自身所在目录"),
                              t.$loading.hide(),
                              e.a(2)
                            );
                          case 3:
                            if (
                              (t.$store.commit(
                                "setMoveTargetCatalogId",
                                t.catalogId
                              ),
                              (e.p = 4),
                              t.move.isSafeBox)
                            ) {
                              e.n = 11;
                              break;
                            }
                            if (
                              !(a = { isFamilyCloud: t.move.isFamilyCloud })
                                .isFamilyCloud
                            ) {
                              e.n = 5;
                              break;
                            }
                            (a.cloudID = t.move.familyOptional.cloudID),
                              (a.sourceType = t.move.familyOptional.sourceType),
                              (e.n = 9);
                            break;
                          case 5:
                            if (!t.move.groupMess) {
                              e.n = 9;
                              break;
                            }
                            if (
                              ((i = "move"), t.move.groupMess.isCopyContents)
                            ) {
                              e.n = 7;
                              break;
                            }
                            return (
                              (o = {
                                groupID: t.move.groupMess.groupID,
                                moveSrcCatalogIDList: t.move.selectedCaIdList,
                                moveSrcContentIDList: t.move.selectedCoIdList,
                                moveDestCatalogID:
                                  t.move.moveTargetCatalogId !==
                                  t.move.groupMess.groupID
                                    ? "00019700101000000001/00019700101000000216/"
                                        .concat(t.move.groupMess.groupID, "/")
                                        .concat(t.move.moveTargetCatalogId)
                                    : "00019700101000000001/00019700101000000216/".concat(
                                        t.move.moveTargetCatalogId
                                      ),
                              }),
                              (e.n = 6),
                              Object(d.A)(o)
                                .then(function (e) {
                                  t.$emit("toShowBatchOpr", {
                                    module: "sharedGroup",
                                    taskID: e.data.taskID,
                                    actionType: "sharedGroupMove",
                                    title: "移动文件中",
                                  }),
                                    t.$loading.hide();
                                })
                                .catch(function (e) {
                                  t.$loading.hide(),
                                    (i = "moveGroupContentCatalogFail");
                                })
                            );
                          case 6:
                            e.n = 8;
                            break;
                          case 7:
                            return (
                              (e.n = 8),
                              Object(d.u)({
                                groupID: t.move.groupMess.groupID,
                                catalogIDList: t.move.selectedCaIdList,
                                contentIDList: t.move.selectedCoIdList,
                                destProfileCatalogID:
                                  t.move.moveTargetCatalogId,
                              })
                                .then(function (e) {
                                  t.$emit("toShowBatchOpr", {
                                    module: "sharedGroup",
                                    taskID: e.data.taskID,
                                    actionType:
                                      "sharedGroupCopyContentToMyCloud",
                                    isPictureViewCopy: t.move.isPictureViewCopy,
                                    title: t.move.isPictureViewCopy
                                      ? "转存中"
                                      : "转存文件中",
                                  }),
                                    t.$loading.hide();
                                })
                                .catch(function () {
                                  t.$loading.hide(),
                                    t.$emit("toRefresh", { type: "move" });
                                })
                            );
                          case 8:
                            return (
                              (t.move.groupMess.isGroupIndex = !1),
                              t.$emit("toRefresh", { type: i }),
                              e.a(2, !1)
                            );
                          case 9:
                            return (
                              (e.n = 10),
                              Object(d.F)(
                                {
                                  contentInfoList: t.move.selectedCoIdList,
                                  catalogInfoList: t.move.selectedCaIdList,
                                  newCatalogID: t.move.moveTargetCatalogId,
                                },
                                a
                              ).then(function (e) {
                                if (!e.success)
                                  return "1809011501" === e.status ||
                                    "1809012303" === e.status
                                    ? (t.$loading.hide(),
                                      void t.$emit("toRefresh", {
                                        type: "refreshFamily",
                                      }))
                                    : void 0;
                                var i = a.isFamilyCloud
                                    ? "转存文件中"
                                    : "移动文件中",
                                  o = a.isFamilyCloud
                                    ? "familyCloudCopyContentToMyCloud"
                                    : "myCloudMove";
                                t.$emit("toShowBatchOpr", {
                                  module: e.module,
                                  taskID: e.data.taskID,
                                  actionType: o,
                                  isPictureViewCopy: t.move.isPictureViewCopy,
                                  title: t.move.isPictureViewCopy
                                    ? "转存中"
                                    : i,
                                }),
                                  t.$loading.hide();
                              })
                            );
                          case 10:
                            e.n = 12;
                            break;
                          case 11:
                            return (
                              (e.n = 12),
                              Object(d.E)({
                                contentInfoList: t.move.selectedCoIdList,
                                catalogInfoList: t.move.selectedCaIdList,
                                newCatalogID: t.move.moveTargetCatalogId,
                                moveType: t.move.isMoveOutSafe ? "2" : "1",
                              }).then(function (e) {
                                var a = t.move.isMoveOutSafe
                                    ? "移出保险箱中"
                                    : "移动文件中",
                                  i = t.move.isMoveOutSafe
                                    ? "safeBoxMoveOut"
                                    : "safeBoxMove";
                                t.$emit("toShowBatchOpr", {
                                  module: "safeBox",
                                  taskID: e.data.taskID,
                                  actionType: i,
                                  title: a,
                                }),
                                  t.$loading.hide();
                              })
                            );
                          case 12:
                            t.$emit("toRefresh", { type: "move" }), (e.n = 14);
                            break;
                          case 13:
                            (e.p = 13),
                              e.v,
                              t.$loading.hide(),
                              t.$emit("toRefresh", { type: "move" });
                          case 14:
                            return e.a(2);
                        }
                    },
                    e,
                    null,
                    [[4, 13]]
                  );
                })
              )();
            },
            getListData: function (t, e, a) {
              var i = this;
              return Object(s.a)(
                Object(n.a)().m(function s() {
                  var r, d, h, m, p, g, v, A, w, C, S, y, I;
                  return Object(n.a)().w(function (n) {
                    for (;;)
                      switch (n.n) {
                        case 0:
                          if (((i.failedType = ""), !i.visible)) {
                            n.n = 4;
                            break;
                          }
                          return (
                            (r = {
                              catalogID: i.catalogId,
                              catalogSortType: i.catalogSortType,
                              contentSortType: i.contentSortType,
                              filterType: 1,
                              startNumber: e * (t - 1) + 1,
                              endNumber: e * t,
                              sortDirection: i.sortDirection,
                              catalogType: -1,
                              pageCursor: i.nextPageCursor,
                            }),
                            (d = i.move.isSafeBox && !i.move.isMoveOutSafe),
                            (h = d ? u.f : l.h),
                            i.move.groupMess &&
                              !i.move.groupMess.isCopyContents &&
                              ((h = c.q),
                              (r.groupID = i.move.groupMess.groupID),
                              (r.catalogType = 0),
                              i.move.groupMess.groupID === i.catalogId
                                ? ((b = []),
                                  (r.catalogID = ""),
                                  (r.path = f.S + i.move.groupMess.groupID))
                                : (-1 === b.indexOf(i.catalogId)
                                    ? b.push(i.catalogId)
                                    : (b = b.slice(
                                        0,
                                        b.indexOf(i.catalogId) + 1
                                      )),
                                  (m = ""),
                                  b.forEach(function (t) {
                                    m += "/" + t;
                                  }),
                                  (r.catalogID = i.catalogId),
                                  (r.path = ""
                                    .concat(f.S)
                                    .concat(i.move.groupMess.groupID)
                                    .concat(m)))),
                            (n.n = 1),
                            h(r)
                              .then(function (t) {
                                return [null, t];
                              })
                              .catch(function (t) {
                                return [t, null];
                              })
                          );
                        case 1:
                          if (
                            ((A = n.v),
                            (w = Object(o.a)(A, 2)),
                            (C = w[0]),
                            !(S = w[1]))
                          ) {
                            n.n = 2;
                            break;
                          }
                          (g = S.success),
                            (p = S.data),
                            (v = S.status),
                            (n.n = 3);
                          break;
                        case 2:
                          if (!C) {
                            n.n = 3;
                            break;
                          }
                          return (
                            i.mescroll.endErr(),
                            i.catalogInfo.length > 0
                              ? i.$toast("网络异常，请稍后再试")
                              : ((i.failedType = "network_error"),
                                i.$nextTick(function () {
                                  i.mescroll.endBySize(0, 0);
                                })),
                            n.a(2)
                          );
                        case 3:
                          "1909015006" === v
                            ? (i.$toast("文件夹不存在"), i.routerPop())
                            : "1909011503" === v
                            ? (i.$toast("操作失败，您已不在共享群内"),
                              i.$router.go(-1))
                            : ("9149" !== v && "04000010" !== v) ||
                              (i.$toast("文件夹不存在"), i.routerPop()),
                            (i.loadingEnd = !0),
                            g
                              ? ((p =
                                  i.move.groupMess &&
                                  !i.move.groupMess.isCopyContents
                                    ? p.getGroupContentResult
                                    : p.getDiskResult),
                                !i.isPDSUser ||
                                  (i.move.groupMess &&
                                    !i.move.groupMess.isCopyContents) ||
                                  ((i.nextPageCursor = p.nextPageCursor),
                                  (i.isCompleted = p.isCompleted)),
                                (y = []),
                                p.catalogList
                                  ? (y = p.catalogList)
                                  : p.getGroupContentResult &&
                                    p.getGroupContentResult.catalogList &&
                                    p.getGroupContentResult.catalogList.length >
                                      0 &&
                                    (y = p.getGroupContentResult.catalogList),
                                (I = {
                                  catalogInfo: y,
                                  curListSize: y.length,
                                  nodeCount: p.nodeCount,
                                  isCompleted: p.isCompleted,
                                }),
                                a(I))
                              : (i.mescroll.endErr(),
                                i.catalogInfo.length > 0
                                  ? i.$toast("系统繁忙，请稍后再试")
                                  : ((i.failedType = "api_error"),
                                    i.$nextTick(function () {
                                      i.mescroll.endBySize(0, 0);
                                    })));
                        case 4:
                          return n.a(2);
                      }
                  }, s);
                })
              )();
            },
            upCallback: function (t) {
              var e = this;
              (this.pageNum = t.num),
                this.getListData(t.num, t.size, function (t) {
                  t.catalogInfo.length > 0 &&
                    (e.catalogInfo = e.catalogInfo.concat(t.catalogInfo)),
                    (e.nodeCount = t.nodeCount || e.catalogInfo.length),
                    e.$nextTick(function () {
                      !e.isPDSUser ||
                      (e.move.groupMess && !e.move.groupMess.isCopyContents)
                        ? e.mescroll.endBySize(t.curListSize, t.nodeCount)
                        : e.mescroll.endSuccess(f.M, !t.isCompleted);
                    });
                });
            },
          },
          filters: {},
          computed: Object(i.a)(
            Object(i.a)(
              {},
              Object(r.e)({
                move: function (t) {
                  return t.move;
                },
                isOnline: function (t) {
                  return t.isOnline;
                },
                cutoverStatus: function (t) {
                  return t.auth.cutoverStatus;
                },
              })
            ),
            {},
            {
              isPDSUser: function () {
                return 1 == this.cutoverStatus;
              },
              iconType: function () {
                return this.failedType ? this.failedType : "folder_empty";
              },
              emptyText: function () {
                return this.failedType
                  ? "api_error" === this.failedType
                    ? "系统繁忙，请稍后再试"
                    : "网络异常，请重新刷新"
                  : "无子文件夹";
              },
              showEmpty: function () {
                return (
                  "api_error" === this.failedType ||
                  "network_error" === this.failedType ||
                  (this.loadingEnd && 0 === this.catalogInfo.length)
                );
              },
              rootCatalogId: function () {
                return this.move.isShareGroup
                  ? this.move.groupMess && !this.move.groupMess.isCopyContents
                    ? this.move.groupMess.groupID
                    : Object(f.Q)()
                  : this.move.isSafeBox && !this.move.isMoveOutSafe
                  ? Object(f.V)()
                  : Object(f.Q)();
              },
              noMoreData: function () {
                return !this.isPDSUser ||
                  (this.move.groupMess && !this.move.groupMess.isCopyContents)
                  ? this.catalogInfo.length === this.nodeCount &&
                      0 !== this.nodeCount
                  : this.isCompleted && 0 !== this.catalogInfo.length;
              },
              moveBtnText: function () {
                var t = this.move.isFamilyCloud ? "转存" : "移动";
                if (this.move.isShareGroup && this.move.groupMess) {
                  if (!this.move.groupMess.isCopyContents) {
                    var e =
                      this.move.selectedCaIdList.length +
                      this.move.selectedCoIdList.length;
                    return "移动(".concat(e, ")");
                  }
                  t = "转存";
                }
                return "".concat(t, "(").concat(this.move.length, ")");
              },
            }
          ),
          watch: {
            visible: function (t) {
              t && this.toRefresh();
            },
          },
        },
        A = (a("eb27"), a("212b")),
        w = Object(A.a)(
          v,
          function () {
            var t = this,
              e = t._self._c;
            return e(
              "div",
              {
                directives: [
                  {
                    name: "show",
                    rawName: "v-show",
                    value: t.visible,
                    expression: "visible",
                  },
                ],
                staticClass: "move-container",
              },
              [
                e("div", { staticClass: "header" }, [
                  t.catalogId !== t.rootCatalogId
                    ? e("img", {
                        staticClass: "header-icon icon-back",
                        attrs: { src: a("3827"), alt: "" },
                        on: { click: t.routerPop },
                      })
                    : t._e(),
                  e("div", { staticClass: "title" }, [t._v(t._s(t.title))]),
                  e("img", {
                    staticClass: "header-icon icon-close",
                    attrs: { src: a("a37d"), alt: "" },
                    on: { click: t.closeModal },
                  }),
                ]),
                e(
                  "mescroll-vue",
                  {
                    ref: "mescroll",
                    attrs: { up: t.mescrollUp, down: t.mescrollDown },
                    on: { init: t.mescrollInit },
                  },
                  [
                    e("com-file-list", {
                      attrs: {
                        catalogInfo: t.catalogInfo,
                        isShowSelectIcon: !1,
                        isMovePage: !0,
                      },
                      on: { toRefresh: t.toRefresh },
                    }),
                    e("com-empty-list", {
                      attrs: {
                        visible: t.showEmpty,
                        iconType: t.iconType,
                        emptyText: t.emptyText,
                      },
                      on: { toRefresh: t.toRefresh },
                    }),
                    t.noMoreData
                      ? e("p", { staticClass: "cy-list-footer" }, [
                          t._v("共 " + t._s(t.nodeCount) + " 项"),
                        ])
                      : t._e(),
                  ],
                  1
                ),
                e("div", { staticClass: "footer" }, [
                  e(
                    "div",
                    {
                      staticClass: "create-btn",
                      on: { click: t.handleCreate },
                    },
                    [t._v("新建文件夹")]
                  ),
                  e(
                    "div",
                    {
                      staticClass: "move-btn",
                      attrs: { "data-hecaiyun-click": "" },
                      on: { click: t.doMove },
                    },
                    [t._v(" " + t._s(t.moveBtnText) + " ")]
                  ),
                ]),
              ],
              1
            );
          },
          [],
          !1,
          null,
          "469b4276",
          null
        );
      e.a = w.exports;
    },
    cbdb: function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAALRklEQVR4Xu2de1QT2R3HZybM5AGVNYbEKIIPFKu0PugOra9dkGqtioLFIraCj7qKiLzWs2fVnt2z7rZ/9Fh3TxF8gPZ0VegpnGIpsvVxuiygBFZ0FUUrcBoQTVIi0RDCJJnpuSmzJ4cmIZgMo/HOX4R77+937/dzf3du7tw7QZFhl0qlmoIgyHIEQeYzDBOCoqhoeB742XMFGIYxoyiqQxDkJoIgV0iS7HIsjbIfGIYRqFSqrQiCLCUI4oZEInmAYVgfQRCU5+5gzuEKUBRF0DT9hslkmkVR1EIEQb4iSfI0iqI2kNcOYEj8QxiG4SEhIVUoikLROehLDMMQOp1uDU3TFEmShwEEO4DGxsYdGIZNk8vlFRz4hSaHKaDVapNomu6MiYk5hYIxn2GYwwqFogj2/LHpKyASNBrNLhRFDwIA6TiOB0ul0rqxcQ+9AAX0ev0Si8ViAACOBgcHfyESibRQmrFTwGw2yw0Gw0q0sbHxrFQq/QOc7Yyd+MATmB3p9fpMEAHlCoXik7F1D70BBTQazfsQAI99AQLgUXwYATyLDwFAAC+BAjxXAd4DIACeFeDZPYwACIBnBXh2DyMAAuBZAZ7dwwiAAHhWgGf3MAIgAJ4V4Nn9mETA3bt3ZXV1deuNRmMUTdPf4bnNLt2jKGolCKJ78uTJV5KSkhrGop6cA6itrZ3a3Nz8ns1mCxyLBvnKh1Qqvbx9+/Y/+sqeKzucAjCbzVhRUdFvLRaLkuuGcGE/MjLyaEJCwtdc2GZtcgrg8uXLs1taWg6wzhQKxV+USmUbhmEMl416UdsDAwOShw8fbrJYLJOAjcDAwJaMjIwjL2rPk3KcAigrK4tVq9XbQEUIgujat2/f+55Uis885eXlSzo6Ot4BdcBx/HF2dvZ+LuvDKYDS0tL4rq6uNNAAkUj0cO/evR9y2Rhf2L5w4cKb9+/fzwK2AgICdDk5Obm+sMvLPQACGBkdjIBhGsEIGLnTcJoDAuBU3pGNQwBuNNJqtSKVSjVbq9V+d3BwcILVah03dLN8LpFIHimVyvvLli1rE4lE9oMPL3JBAE5Ua25unnjjxo2fPnv2bDHY1u1OWIFA8Ewmk/1j3bp1F4ODg0d9yAQCcFDXbDYLSktLE3Q6XQKYFY6mRwsEgqcRERF/SkhIaBpNOQhgSK3Hjx+Ly8vLswcGBuY4CggOkAiFwn8FBgZ2CoXCZzRN4xRFjTcajTMpigoflpeRyWSV6enp5Z5C8CsAbW1tUrVabV8HEovFpqVLl3Z6IoRGoxGWlpYeoChqGpsfw7DnSqXyQmxs7JdKpXLAmZ3bt2/Lrl+/vtZgMLwFzryxecaPH//Fjh07PvfEt18B8KTBzvIUFRXtff78OcmmicXib1auXHl85syZzzyxWVdXF97U1JRttVplbP7w8PBTGzdu/HKk8q89gIqKih+2t7fvYYUaN27ctbS0tCKRSESPJJ5jemdn57jKysqD7EosiqKWVatWvTt37txed3ZeaQB6vV5YU1PzFkVR//fQBRzHDAsLux0bG9vuSgCj0Rhw4sSJIzabbTzIIxQKO7Zt2/ZRUFCQdTTis3lv3rw58cqVKx/SNC0B/wsODq7buXPncb8FcPLkye19fX1vu2og6IXr16/PiYiIMDjLU1FRsai9vX33UBq9ePHiQ4sWLVK/iPhsmbNnz67q6elJZW3Gx8fvX7BggcaVzVc6AgoLC7OMRuObbgRjVqxYkT9v3jynhwELCgreM5lMc0H5oKCgpt27d3/mjfig7FBU/d5ms70BPsvl8vK0tLS/+iWA1tbWCfX19Yk2my3ISQNpmUx2Izk52elRWCBUUVHRcfaL1pw5c46sXr26xZVQYLirqqr6CY7j5sTExEvu7hHFxcVper0+HtgSi8X3MzMzD/slAG96a319/dSGhoaP2KEiPT19V0hIiNPpJshTUlLy897e3jXg76lTpxYnJyf/05X/qqqqhffu3csB6SiKDuTn5++EAIYpUF1dPa+1tTUf/BvDMENeXl6mO6CFhYV7jUajfaoqk8n+tnXr1j+7yt/Q0BBWX1//MZuekpLyzpQpU0zO8r/S9wBvIsBx+hkQEKDJycmxw3B1jQYAGBqrq6uPsrYSExMzXU0EXlsAjsMEhmGmvLw8+3NZNwAyjUZjjCcRALbGNDY2ssMbkpaW9iu5XG6GEeCgwPBhYtOmTbtCQ0P7XQE4c+ZMok6nSwLpM2bMKHS3kcqxVwsEgv7c3NxdfnkPaGpqmtTU1JRis9mc7X6jJ0yY8HVqamq1s8YPnwWNJCpYKa2srFyG4/hAUlLSdXfR4vj9RCwW383MzPyNXwI4duxYbn9//wJ3YsTFxe2Pjo5+7CxPQUHBuyaT6fsgLTAw8FZGRsbvvLmvgLJgunr69OmjNE3bp8aTJk0q3bx589/9EkBJSckvent7V7pqHJgCJicn54aHhxud5SkvL/9RR0dHBpsWHR19OC4u7r43EByHKrAcsmbNmtzZs2fr/RIAGBYuXrz4g8HBQadDUGRkZKu7ZQCr1YoWFBR8QlFUKBAIbIxKSUn5YOLEiU6njCOBAd8trl27doj9cufJfs/XdhbEillVVTX/3r17eexnsVh8Jzk5+ahCoRgcSXDH9Fu3bsmvXr16wGq1SsH/QfRt2LAhf9q0aW6XtF97AECs4uLiX+r1+hWsoARB/Hv58uWfRkVFgVc/jnjV1NREtba27mHHffBOwlmzZn22bt265pEKQwAIgoBd1cXFxfkmk+l7rGBgJVUqlV4iSfKyKxC1tbUz7ty5s7a/vz/aUWiwKXjLli2VI4kP0iGAIZXAtPTcuXPbDAbD0uHCgY2+QqGwiyCIPoZhAiwWC3gn50z2OYIDNFtoaOjnKSkplz0R3+8AXLp0KVKtVtvXa0Qi0X82b9580VMh2HxlZWXLu7u7f+YwnHhkAsfxR1FRUWfi4+PbPCowlMmvIsBXm3OfPHkiqampWa3X69+22Wz2zViuLhzHeyZPnnxx7dq1taN9jOl3EeArAKzYYJrb0NAQ0dPTM3NgYEBhtVolKIrSAQEBz4OCgnqmT5/eRpJk92h6/PC8MAK8Uc8HZSEAH4jojQkIwBv1fFAWAvCBiN6YgAC8Uc8HZSEAH4jojQm/AgC+RKnV6nQgiFAobM/KyvrAG3HGomxlZSX54MGDvcAXjuPa7OzsbxcGufDP6SE9x96EYZg5Li7uoLvlaC4aOBqbYDm8pKRkp8FgWDLUaR5mZWVxerSWUwDd3d2BZWVln9I0LQQNAg9EBAKBy4choxGLi7wMw4gdN5WNZhHvRevDKQBQqfPnz6/q7u5m92a+aD3HvBx4GJSamvprV7snfFUhzgEMQfhxT08PWFCz71J+2S+JRPJNfHz8ycjIyD6u6zomAEAjent7iZaWlukmk+mlfl9QWFjYI1ebh7mAMWYAuKi8P9iEAHimCAFAADwrwLN7GAEQAM8K8OweRgAEwLMCPLuHEQAB8KwAz+5hBEAAPCvAs3sYARAAzwrw7B5GwMsAAP6gMz8UwA86P336dA/8SXN+9AcHUf73k+YqlSodx/FgqVTq9E0mPNXP793q9folFovFAABMYRjmsEKhKAJvJfT7lr8EDQQnNzUazS4URQ+ioD6NjY07MAybJpfLK16C+vl9FbRabRJN050xMTGn7ADAax5VKtUhDMPwkJCQKhgJ3PQB0PN1Ot0amqYpkiQPg71SdgAOELYiCLKUIIgbEonkAYZhfQRBwGHJCx5gtkPTNDhIOIuiqIUIgnxFkuRpID4w+y0A1ge4JyAIshxBkPkMw4SgKCrywv9rX5RhGDOKouCM800EQa6QJNnlKMp/AaFcIZn/tKI+AAAAAElFTkSuQmCC";
    },
    cd73: function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAFnElEQVRYR+2Yf2gcRRTH35uLl0SjaWIRG5XGigTFUrUiIiJFLVLFipCzrbHxNHczd9ek+KP+wJ/nj6qISmlLbmf2Us5oqDVVqb8Q/9CiWFFQK0VpEX+gtSkFm1KraZLbfTJhNmzS5G4vSaOBzl87s2/e+8x33szOLMIMKzjDeOEE8PGesRMKzyiFI5FIuLq6+jrG2AWMsX4A+NyyrG+nchBTlhKc8zmIuJ6Izh0FuE0p9QwA0FSATwlwOp1m+/btywHAhWNBIeI6KeVr/xvgRCKx3HXdNR4QEe1AxLMAYK5p6ysrK4u0t7fvnyz0pBVOJBJnuK7bDQCnaBhE3CGlXJ1Kpc7M5/O6vdJAfqqUuvc/B+acvwAA1xjYo4i4zLKsP3RdCHE7Ed3tg7xfKfXJZKAnpTDn/CoAWOcBMMY2Wpalc3moRCKRUE1NTScANJimAwDQqJT6Z6LQEwaORqMV5eXl3UQ0x6j70549e5q2b9+e98O0tLRcFAqFNgEAM+2blVIvTTtwIpFY7bpuswlMiBiTUn43FogQ4kEiipiBOUR0h1Jq90SgJ6SwEOJ8InoVAMp0UMbY25ZlrR0PIJVKVTmOs5WIZhubH+rq6qLpdNotFXoiwCiE2ERE841iB48cOdLY1dV1WNc55wIR79TPruu22Lb9vVmAi4noOV++v2hZ1uvHHVgI0UhED3mBEPFxKeUHXl0I0aanXNeJKGbb9k7fO/0lvNLU/2aMRSzL0gsxcClJ4ebm5tMrKyv11J5qInyllEr5oxUCbm1trRscHHyDiCrM7HwspXwgMK3e50sxTiQSa13Xvd70GQCA5Uqp34ICa7t4PB5FxFavj+u692Sz2c+CcgQGjsViV+h91ufYUkplRwcqpLC2XbRoUVlDQ0MXEZ1nVO7p7++P5HK5o0GgAwG3tbWVDwwMbCGis43TXwFghVJqsFRgswAXEJEe7FB8xlinZVnrpww4Ho+nEPEuowgxxhKZTObrsQIUU9jrwzl/BABuMfU8Iq6UUv5YDLqowslkcp7runoKTzLO3lNKpcdzHBS4qanptKqqKr2Aa40Qu6SUWpSC5+ZiwMg5VwBwiXF6qL+/vzGXyx2aLLBZgEsQ8WnPFyI+L6XcWkjlgsBCiJuJ6DHPARE9Zdv2O4UcBlXYlxrtAHC5EeSvvr6+xs7Ozj/HizEucDKZrHFdV09ZtXH2jZRSFJsyzvl8RFxgFtP7mUymt9AAU6nUOfl8fgsAhE2cj6SUD5cMLIR4kohuNE4GHce5LZvN/lJsUUzkPec8BgAJX2q0SSm/GMvXmAoLIS4DgAwRee87lFKZIDBCCL1lXaxtHcd5t6Oj42CxfpxzvaA3A0C9EWhvOBxetmHDBn3zHlGOAdZX9dra2s1E5N3Hfu/t7V3W3d2tv2xFS6k57DlMJpMLXde1PJEQcZOUUud3YWDOOdeHLp/VKqXUl0VJjcFEgXV3zvkTAHCTl4aMsaZMJvOzP/YIhVtaWuaGQiE9NUMLAAA+VEo9GhRW200GOBqNzgqHw3pbm6V9EdFO27bj/oU+AphzbgGAzl9dDjuO0xgkB/0DEkIsBoBrdZvjOBuz2ezeUgYcj8eX6iOr10fv01LKbcN17yEWiy1kjEmf4bNSyrdKCTZVtkIIRUSXGn/76+rqlnq3k2GFOeerAGDopoCIu6WUK4vtuVMFONoP51yf5PTePFRCodCtXi77gVcDwNClEhF39fX1ramoqBhxAz5egKP96r9GRPSKd5pDxBXewWgYWAhxNRG9PF1QQeMg4iEiWuIdZYeB9Q+9np4e/bFYGNTZdNjpi6tt228es+h0A+f8ZAC4DxFv8B0np4NrrBgHEFH6d4ihdB3LUl9j6uvrZzPGvL810wqNiEfH206LnYenFTRIsBPAQVSajM2MU/hfoL2bSwkmykwAAAAASUVORK5CYII=";
    },
    d501: function (t, e, a) {
      var i = a("ee2b"),
        o = a("8992"),
        n = a("de93");
      e = i(!1);
      var s = o(n);
      e.push([
        t.i,
        '.com-dropdown[data-v-62122e14]{position:relative;line-height:4.4rem;color:#333;font-size:1.4rem;font-family:PingFangSC-Regular,PingFang SC,sans-serif;font-weight:400}.com-dropdown .drop-pointer[data-v-62122e14]{display:inline-block;width:1.8rem;height:1.8rem;-webkit-transform:rotate(90deg);transform:rotate(90deg);-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}.com-dropdown .flex-row[data-v-62122e14]{-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding:0 1rem;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.com-dropdown .dropdown-normal[data-v-62122e14]{position:absolute;z-index:100;width:100%;max-height:17rem}.com-dropdown .dropdown-normal.dropdown-top[data-v-62122e14]{bottom:4.4rem}.com-dropdown .dropdown-normal.dropdown-bottom[data-v-62122e14]{top:4.4rem}.com-dropdown .dropdown-action-sheet[data-v-62122e14]{position:fixed;top:0;right:0;bottom:0;left:0;z-index:100;background-color:rgba(0,0,0,.3)}.com-dropdown .dropdown-action-sheet.dropdown-bottom .options[data-v-62122e14]{position:fixed;right:0;bottom:0;left:0;width:100%;height:auto;border-radius:4px 4px 0 0}.com-dropdown .options[data-v-62122e14]{height:100%;padding:1rem 0;-webkit-box-sizing:border-box;box-sizing:border-box;overflow-y:auto;background-color:#fff}.com-dropdown .item[data-v-62122e14]{padding:0 1.6rem;line-height:5rem}.com-dropdown .item-selected[data-v-62122e14]{padding-right:7.5rem;position:relative;color:#3181f9}.com-dropdown .item-selected[data-v-62122e14]:after{content:"";position:absolute;top:50%;right:5rem;-webkit-transform:translateY(-50%);transform:translateY(-50%);display:inline-block;width:1.8rem;height:1.8rem;background-size:100%;background-image:url(' +
          s +
          ")}.dropdown-visible .drop-pointer[data-v-62122e14]{-webkit-transform:rotate(-90deg);transform:rotate(-90deg)}.slide-to-top-enter-active[data-v-62122e14],.slide-to-top-leave-active[data-v-62122e14]{-webkit-transition:opacity .3s;transition:opacity .3s}.slide-to-top-enter-active.dropdown-action-sheet .options[data-v-62122e14],.slide-to-top-leave-active.dropdown-action-sheet .options[data-v-62122e14]{-webkit-transition:-webkit-transform .3s;transition:-webkit-transform .3s;transition:transform .3s;transition:transform .3s,-webkit-transform .3s}.slide-to-top-enter[data-v-62122e14],.slide-to-top-leave-to[data-v-62122e14]{opacity:0}.slide-to-top-enter.dropdown-action-sheet .options[data-v-62122e14],.slide-to-top-leave-to.dropdown-action-sheet .options[data-v-62122e14]{-webkit-transform:translateY(60%);transform:translateY(60%)}",
        "",
      ]),
        (t.exports = e);
    },
    d758: function (t, e, a) {
      (e = a("ee2b")(!1)).push([
        t.i,
        '.confirm-modal[data-v-466ee7fa]{display:fixed;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-ms-flex-line-pack:center;align-content:center}.fade-in-enter-active[data-v-466ee7fa]{-webkit-transition:all .2s linear;transition:all .2s linear}.fade-in-leave-active[data-v-466ee7fa]{-webkit-transition:all 0s;transition:all 0s}.fade-in-enter[data-v-466ee7fa],.fade-in-leave-to[data-v-466ee7fa]{-webkit-transform:translateY(4.8rem);transform:translateY(4.8rem)}.confirm-modal[data-v-466ee7fa]{text-align:center;letter-spacing:0}.confirm-mask[data-v-466ee7fa],.confirm-modal[data-v-466ee7fa]{position:fixed;top:0;bottom:0;left:0;right:0;z-index:999}.confirm-mask[data-v-466ee7fa]{background:rgba(0,0,0,.6)}.confirm-main[data-v-466ee7fa]{display:block;width:100%;height:19.4rem;background-color:#fff;border-top-left-radius:.4rem;border-top-right-radius:.4rem;padding-top:2rem;position:absolute;bottom:0;left:0;z-index:1000}.confirm-main .confirm-title[data-v-466ee7fa]{display:-webkit-box;display:-ms-flexbox;display:flex;font-size:1.4rem;color:#333;text-align:center;-ms-flex-line-pack:center;align-content:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.confirm-main .confirm-title span[data-v-466ee7fa]{display:inline-block;width:auto;height:100%;padding-top:.1rem}.confirm-main .confirm-content[data-v-466ee7fa]{display:block;width:100%;padding:0 2.6rem;margin-top:2.2rem;text-align:left}.confirm-main .confirm-content>p[data-v-466ee7fa]{color:#999;font-size:1.2rem;padding:0 .2rem}.confirm-main .confirm-content .input-radius[data-v-466ee7fa]{display:-webkit-box;display:-ms-flexbox;display:flex;width:100%;margin-top:1.6rem;-webkit-box-pack:justify;-ms-flex-pack:justify;justify-content:space-between;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.confirm-main .confirm-content .input-radius input[type=radio][data-v-466ee7fa]{display:none}.confirm-main .confirm-content .input-radius input:checked+label em[data-v-466ee7fa]{border-color:#3c7afc}.confirm-main .confirm-content .input-radius input:checked+label em[data-v-466ee7fa]:after{background-color:#3c7afc}.confirm-main .confirm-content .input-radius label[data-v-466ee7fa]{display:-webkit-box;display:-ms-flexbox;display:flex;font-size:1.4rem;-webkit-box-pack:start;-ms-flex-pack:start;justify-content:flex-start;-webkit-box-align:center;-ms-flex-align:center;align-items:center;padding-top:.1rem}.confirm-main .confirm-content .input-radius label em[data-v-466ee7fa]{display:block;width:3.2rem;height:3.2rem;margin-top:-.1rem;margin-right:-1.1rem;border-radius:50%;border:.24rem solid #ccc;position:relative;-webkit-transform:scale(.5);transform:scale(.5);-webkit-transform-origin:0 center;transform-origin:0 center}.confirm-main .confirm-content .input-radius label em[data-v-466ee7fa]:after{content:"";display:block;width:1.6rem;height:1.6rem;-webkit-box-sizing:border-box;box-sizing:border-box;border-radius:50%;background-color:transparent;position:absolute;top:50%;left:50%;margin:-.8rem 0 0 -.8rem}.confirm-main .shareLink[data-v-466ee7fa]{width:auto;max-width:80%;margin:2rem auto;font-size:1.4rem;color:#666;line-height:1.8rem}.confirm-main .confirm-btn[data-v-466ee7fa]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-flex:1;-ms-flex:1;flex:1;width:100%;height:5.3rem;position:absolute;left:0;bottom:0;border-top:1px solid hsla(0,0%,87.5%,.4)}.confirm-main .confirm-btn button[data-v-466ee7fa]{display:block;width:100%;position:relative;font-size:1.6rem;color:#666}.confirm-main .confirm-btn button[data-v-466ee7fa]:not(:first-child){color:#3181f9}.confirm-main .confirm-btn button[data-v-466ee7fa]:not(:first-child):after{content:"";display:block;width:.1rem;height:3rem;background-color:hsla(0,0%,87.5%,.4);position:absolute;top:50%;left:0;margin-top:-1.5rem}.border-center[data-v-466ee7fa]{width:1px;height:3rem;background:#f2f2f2}.confirm-info[data-v-466ee7fa]{color:#3181f9}.confirm-warning[data-v-466ee7fa]{color:#f84c51}.confirm-main2[data-v-466ee7fa]{width:27.1rem;position:absolute;top:50%;left:50%;margin:-18rem 0 0 -13.55rem;z-index:10000}.confirm-main2 .confirm-main2-content[data-v-466ee7fa]{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;width:27.1rem;height:31rem;background-color:#fff;border-radius:.4rem}.confirm-main2 .share-info[data-v-466ee7fa]{margin-top:auto;margin-bottom:auto}.confirm-main2 img[data-v-466ee7fa]{width:20.5rem;height:11.5rem}.confirm-main2 .gray[data-v-466ee7fa]{height:1.8rem;margin-top:2rem;font-size:1.2rem;font-weight:400;color:#999;line-height:1.7rem}.confirm-main2 .hint[data-v-466ee7fa]{width:80%;margin:1.6rem auto 0;font-size:1.4rem;font-weight:400;color:#333;line-height:2rem}.confirm-main2 .copy-content[data-v-466ee7fa]{width:100%;height:5.3rem;border-top:.5px solid hsla(0,0%,87.5%,.8)}.confirm-main2 .copy-content .vertical-align-span[data-v-466ee7fa]{display:inline-block;width:1px;height:100%;vertical-align:middle}.confirm-main2 .copy-content p[data-v-466ee7fa]{height:2.2rem;display:inline-block;vertical-align:middle;font-size:1.6rem;font-weight:400;color:#3181f9;line-height:2.2rem}.confirm-main2 .confirm-footer[data-v-466ee7fa]{width:27.1rem;margin-top:2.5rem}.confirm-main2 .confirm-footer img[data-v-466ee7fa]{height:2.8rem;width:2.8rem;margin:.1rem}',
        "",
      ]),
        (t.exports = e);
    },
    de73: function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAEHElEQVRYR+2YTWhdRRTH58y7BE1DrEEXL/i1UhdZCNFCVDTFiFKy8JsuKqjozOTGF1SeG+3iKiqhBrGY3DdncNfqQkrxCyy4aGvAb1yI0eJGV0Gy0DR+pEnfmyMv9Jbh5n4lNrkpZnbz5syZ3/vPf868ecAusgYXGS/bBt7oHdtWeFvhmAKlWUII8QxjbF+bBwDOcM4PNBqND/N2qBRgIcQEY2wwAe4VY8z7WdCbDiyE+DYTCOAUIq4on9Q2FVhKeYyIrsjddoDXEPFoqcBBEHizs7NfOhCfGWOei/pSymkiujTqG2NuLhVYKfW0tfaxLCDXLr29vbuCILBx6E2zhJSyQUS3nKsK04j4bBwm5u99xphTpQErpV601t4flTFEvD0L2PO8wTAM/yoNWAhxhDF2XQTQ0dHx8OTk5C9RXyn1qrX2ntI9rJQKrLXDiQcI4G/G2BdENOSOA8BXiDj6nw+dEOJJABgkop0A8GOlUnkjDMPfkhIrpfZaa+t5JSxpPK1CrNipSEIp5btEdH1abE9Pz93j4+N/tMd937+p2Wy+nRTred5LXV1dJ+bn54+nKH4aEe/KYsoFzruZouScc5+I3iKiSnxBzvl7WusD7uejo6PXtlqtxxljVxPRTLVanQyCYDlPwExgpdSn1trLY/5q3/W/M8YeJKLLMtUA+B4Rn8iDWMt4KnCtVrtyaWnpEyfZMWPMfjd5QszKMADMV6vVe4MgaK4FpkhsKrCUEomo/xzAWUQcSEro+/7uZrP5umONPVrruSKLrycmFdj1Lue8rrU+kbaAG5t1wtcDGJ9TCNjzvOG08tVO6AJ3d3ffOTEx0a6vG9IKAQPAm4h4eKsr/AJj7IEIMm2rpZT7ieg+x8MPaa1/3RB5sy4OIgIp5TfRwgDwDyLe4YIopZ6y1soEOMs5f2QjwDPrsBDiZcbYnlXGB6D2FyqgYia4UmqYiK7inM80Go3pAvnyr2Yp5WEiujEvWWdn59Di4uIHRLQjT3Ep5cmUuK+NMX7WWkVUYiMjI0OtVms8KREAfIeIIhqr1Wrdy8vLH6WBM8Z4JhDAmaTfyuetmaecOx4EwSVzc3MD1tqdlUplZmpq6ue0+Tng56cBwOmEK/6IMSZZoLUAryc2DZxzHmitP45yKqXesdbekFeVClliPaDxObHyZ40xu+Ix7gXU19d329jY2NKqA38hYIrkiP02OY6Iz2cBe573aBiGP5UJXCeivW0AACBEXHlBu81VuL+/f0BKebY04Hq9vmNhYeFkBMA5P6i1PhT1pZRHieiaLePhNoiU8nMi6nBVA4BW/JUCAIcQ8WBiGS3ivwsZk/fkAoA/EXF32pqbViVcgIw/BVe9akrzcJJivu/f2n6EWmtntNY/FNnJUhQuAralLPG/Av4XKMXLPDv7YA8AAAAASUVORK5CYII=";
    },
    e14b: function (t, e, a) {
      var i = a("177c");
      i.__esModule && (i = i.default),
        "string" == typeof i && (i = [[t.i, i, ""]]),
        i.locals && (t.exports = i.locals);
      (0, a("c69b").default)("1374d57c", i, !0, {
        sourceMap: !1,
        shadowMode: !1,
      });
    },
    e1d5: function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAEQ0lEQVRoQ+2aT2gcZRjGn3c2M7tNsbWVgiIYQSkq0mQ3VASLB9GDeFELEquoxB5q6slC/2i6O5s0EWup1lwsFsQarSiK+OcgihQ8WMTNJpYqlupBLB5qqSalyc7Mfo/spsHdmclO0+wkm+zscb+d931/3/O8785+O4Ime0mT8SICXu6KRwpHCi+zHYgsvcwE9eBECkcKL7Md8LV0uzm1XtPkZVDuB7hqaTHLOITfKMU9Y2bitLt2D3AZVrQTANcsLVAP2gVFdbcb2gOc7Ct8DOLRpQ17uXrBJ/l0fHMlixc4a/279Gw8mzwyns8YqwOAC6yh7hkR6RpJG7lGcEB7xt6kaWoYQNts9eQz8SpRfRSuCVyKawlk90hGfx2QWpsT3p58yFjHL06vgL0AW2oluhrgMQDt7qAEvozReCZnyt/hkXkjJ/dNtkkxNkxwk3dVcgA7K9+fM/AFGivWin2Agh6QbkecpaY9ObpXP74Q0Kk+5zGyeBjAtZX5CCiNODgF46W4WIV5Ac/sUCpbeERBjgi41gVXBDGQP2X04SMphgG+4VWujE3ab4Ds9on/F6E9PZrRvy6tJbPVLTlnhSsv6MxcuklpLe8DvMfHTt8VqW/5yZQ/6wndOWCllMNjANZ72kq0L6SlpTv/opybWasrcDloeWBYWRHZDTJWXYSch6Z15/e2fDZvaFI6+p0dQjUAwHDFmwJkZz5jDLnz1B/4coZUv30fVXEYkBtcSQmRoYlz+s4zQ1LVT1e6CRtNXu+IfRTgA55rRE5p0B/PpeWkX7zQgMv9Msh1sK13ADzoTi6QfJGqy+9+thZ4Z9Z5SMF5G5B1VZ8TIYg3E//oO75/TSZnixEq8HRSSjLrvACoQbf1CFwUke35tHE0SN2bTSbWSGE/IM8DnuPj8xqxNWfGPw2KswDA0yV09FkbhTgG8BafgfZugXrPz6Zc9LXhIO+AbZUG0wYfC3+rNOepsd7Ws0GwZdfVc0oHJbzV5KprNOswiC4f6NNK0DWWNvKVa8ms9RyAAwBbXdfYBDKjNF6BKSoo98z6ggL/n9R6FoJDIFdWFkqgAHDXaCZx6LY9vK51hXWExMM+ML/FYrLlx17jhysFXVTgUvJUP2+nsj8A6LUp8BWAOwHc6Gf/Swl9+6+7ZGKusAtuaXeB04PIPgjBNp/bUvfHxwXoGcnE37sa0EVXuLpPC5sBeWv2UxQ54VA9cdJM/D4f2EVXuAp6H9tQLN9M3FvxvgXB/tXKyB43xZkvbEMBz8CU79CIu0hOxJT+eS4rf9QDtKEsXU+goFiL8rUUVFSY6xHwXM+03D+gw1SnHrEjhSOFXT4KskQ9bBdmjKD6A8+lox4OU546xI4UjoZWNLRqn9zXoc1CDRH1cHAPN9sf4s32yEPTPdRSmihN9dhSqCO0AYJHz1o2gAihlhApHOr2NkDwSOEGECHUEppO4f8ApolYW7Rdcc8AAAAASUVORK5CYII=";
    },
    e5c0: function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAYAAAAehFoBAAAEeklEQVRYR+1ZXWgcVRQ+985G4g+2AdGg1SL+IVVfFMmLfw+ComJVItWH2i6zZ2Y3FVnwB6olrkpQKuRB4+7c2WS3olSJ1oIUfRBslUIefKuiaAUfqklUTFUSiMzcIyfckXGZ3Uzr7sbV3Kede8/c8813v3vOuXcF9FgTPYYX1gF3esXWGV5ThhHxWinlLVrrczsNJJpfSvmb1vqIUupYks+mkkBEBwBy3QKa4MdXSnmN/YmAmVkAqK0h2Mj1zkamEwG7rrtLa72D3xJC/ExEn3QLvBDiZiI6j/1JKeuVSuXVuO9mDO8GgPuN4QGl1Fi3ACNiS9//b8CIeAkRXS+EGASAcwDgVwD4UWv9WbVaPZFmlTrO8OjoqJybm7sHAB4mostagDpuWda+crn8IQBQM7uOAh4ZGdkcBMFzRLQlDXvG5ssgCJ6ampr6IemdjgG2bfs6y7LGiWhDg+M5APgKAH4HgI1CiCuJ6IIGm5MAUExKDqcFOJfLPSClHGInWusZ3/ffjTssFAoXB0GwDwDiGfBoX1+fmpiY+KKROdd1r9FauwCwMqdpJ4Mg2N7I9GkBbrW8rNnZ2VkGe7WJ0yEA7PU8753VZJHL5bZJKYtEZEXyUEptj2s6NeDh4eEzBgYGHgKAixocf7+wsLB/enr6D+53HOdeItoT2QghXkwCi4hnEdEm3/e/js/HoIUQj0d9lmXtKZfLH0TPqQEj4iMA8GgTll5RSjGrgIhvAcDlJhMdrVQqjzXZPPsB4AoAeFMpNR63QUTOXpE8jiultnUEsG3bl0opp6PJpZQ7KpXK50mAHcc5yAzzGBG95vv+VGRnNF2PnrXWW6M4nZrhNJJwXfc+rfXTRruznudx/E1s2Wz2qkwmw9UWJxCuScY8zzsQGTuOcygWPV5QSh00K3jqqbkZCMdxCkSUNQA+9jzviRiA24loZSPG9L2FM5951kS02/f9jwwwlslNZkxxaztgRHwSAB40Tt5XSpX4t23bmyzLeo+IWh65hBCLg4ODt5VKJY2IzwLA3Waut5VSe08JcBpJICLyvjNOPlVKFfl3sVg8c3Fx8Q0A2NxsdcyqHPM8b2dbGE4TJRBxKwA8Y5zPe553V1wBhULh7Oh5aWkp09/fP6a1vtHYf7u8vOzU63XOchwe/5mG0wDmpZdSrmwObqtEiRIRRR/0XRiGODk5+Qu/17UoYZbyrzgMADNKqV1JMkDEwxwhiOhEEAS5Wq32U2TXljjcSnvxsXw+f2cYhs9HfUT0su/7/BF/a67r3qq1HtJa16rV6nw02LZMlxYwh1REfD1eS2itx5NAN87Z1loiPrlt20NCCE6rnKW+qVarM/HxbDZ7YSaTYdAbY/0zUspKUubreLW2Wno0WuarAA7+cdCc0eaJiAsePh5t6Eo9nAYwgzZMvxTJI6Ws1ubEEY+/+Xz+jjAMudpbqeKatLU/0zUCM3H6BgA4n+Xwrzw1p5RBarPV5PjfuEjpxbu13rq9NHG2d+6HY0VK79zAp97WXTZc/xep04T/CV+gA1pqkWCeAAAAAElFTkSuQmCC";
    },
    e629: function (t, e, a) {
      var i = a("ee2b"),
        o = a("8992"),
        n = a("a37d"),
        s = a("4ad37"),
        r = a("f08a"),
        c = a("1a5f"),
        l = a("aa82"),
        u = a("1251"),
        d = a("a204"),
        f = a("7794");
      e = i(!1);
      var h = o(n),
        m = o(s),
        p = o(r),
        g = o(c),
        b = o(l),
        v = o(u),
        A = o(d),
        w = o(f);
      e.push([
        t.i,
        ".safe-auth .auth-close[data-v-3ea1fba4]{width:2rem;height:2rem;background-image:url(" +
          h +
          ");background-size:100% 100%}.safe-auth .auth-body[data-v-3ea1fba4]{position:fixed;top:5rem;right:0;bottom:0;left:0;z-index:1001;background-color:#f8f9fb}.safe-auth .auth-body .scroll[data-v-3ea1fba4]{height:100%;padding:2rem 1.6rem;-webkit-box-sizing:border-box;box-sizing:border-box;overflow-y:auto}.safe-auth .auth-menus[data-v-3ea1fba4]{margin-top:1.2rem}.safe-auth .auth-menus .left[data-v-3ea1fba4]{text-align:left}.safe-auth .auth-menus .right[data-v-3ea1fba4]{text-align:right}.safe-auth .auth-menus button[data-v-3ea1fba4]{color:#5a9afa}.safe-auth .auth-next[data-v-3ea1fba4]{display:block;width:100%;height:4.4rem;margin-top:5rem;border-radius:.4rem;background:#3181f9;color:#fff;font-size:1.6rem;font-family:PingFangSC-Regular,PingFang SC,sans-serif;font-weight:400}.safe-auth .auth-next[data-v-3ea1fba4]:disabled{background:#98c0fc}.safe-auth .auth-question .input-wrapper .text[data-v-3ea1fba4],.safe-auth .auth-question .input-wrapper input[data-v-3ea1fba4]{padding-left:1rem}.safe-auth .auth-question .verify-question+.input-wrapper[data-v-3ea1fba4]{background:hsla(0,0%,87.5%,.3);border-radius:4px}.safe-auth .auth-question .verify-question+.input-wrapper .text[data-v-3ea1fba4]{font-family:PingFangSC-Regular,PingFang SC,sans-serif;font-weight:400;color:#333;border-bottom:none}.safe-auth .auth-question .verify-question+.input-wrapper button[data-v-3ea1fba4]{width:auto;right:1.4rem;border-left:none}.safe-auth button[data-v-3ea1fba4]{padding:0;outline:none;font-size:1.2rem}.safe-auth input[data-v-3ea1fba4]{display:block;width:100%;height:4.4rem;background:transparent;font-size:1.4rem;border:none;border-radius:0;border-bottom:1px solid #ebeced;-webkit-appearance:none;-moz-appearance:none;appearance:none;padding-left:0}.safe-auth input[data-v-3ea1fba4]::-webkit-input-placeholder{color:#999}.safe-auth input[data-v-3ea1fba4]:focus{border-color:#5a9afa}.safe-auth .sim-tip[data-v-3ea1fba4]{font-size:1.2rem;font-weight:400;color:#999;line-height:1.7rem;margin-top:2rem;text-align:left}.safe-auth .sim-tip span[data-v-3ea1fba4]{color:#5a9afa}.safe-auth .safe-image[data-v-3ea1fba4]{text-align:center;margin:0 auto 2rem;background-size:100% 100%;width:18rem;height:16rem}.safe-auth .safe-image-small[data-v-3ea1fba4]{width:12rem;height:12rem;margin:0 auto 4rem;background-size:100% 100%}.safe-auth .password[data-v-3ea1fba4]{background-image:url(" +
          m +
          ")}.safe-auth .newPassword[data-v-3ea1fba4]{background-image:url(" +
          p +
          ")}.safe-auth .set-email[data-v-3ea1fba4]{background-image:url(" +
          g +
          ")}.safe-auth .verify-phone[data-v-3ea1fba4]{background-image:url(" +
          b +
          ")}.safe-auth .verify-question[data-v-3ea1fba4]{background-image:url(" +
          v +
          ")}.safe-auth .verify-email[data-v-3ea1fba4]{background-image:url(" +
          A +
          ')}.safe-auth .safe-success[data-v-3ea1fba4]{text-align:center;margin-top:3.8rem}.safe-auth .safe-success[data-v-3ea1fba4]:before{content:"";display:inline-block;width:22.4rem;height:15.4rem;background-size:100% 100%;background-image:url(' +
          w +
          ")}.safe-auth .safe-success .text[data-v-3ea1fba4]{margin-top:.8rem;font-size:1.4rem;font-family:PingFangSC-Regular,PingFang SC,sans-serif;font-weight:400;color:#666;line-height:2rem}.safe-auth .input-wrapper[data-v-3ea1fba4]{position:relative}.safe-auth .input-wrapper+.input-wrapper[data-v-3ea1fba4]{margin-top:2rem}.safe-auth .input-wrapper input[data-v-3ea1fba4]{padding-right:9rem}.safe-auth .input-wrapper button[data-v-3ea1fba4]{width:8.2rem;height:1.8rem;position:absolute;right:0;top:1.3rem;padding:0;text-align:center;color:#3181f9;line-height:1.7rem;font-size:1.2rem;font-family:PingFangSC-Regular,PingFang SC,sans-serif;font-weight:400;border-left:1px solid #ebeced}.safe-auth .input-wrapper .disableButton[data-v-3ea1fba4],.safe-auth .input-wrapper button[data-v-3ea1fba4]:disabled{color:#999}.safe-auth .input-wrapper .text[data-v-3ea1fba4]{line-height:4.4rem;font-size:1.4rem}.safe-auth .input-wrapper .text-border[data-v-3ea1fba4]{border-bottom:1px solid #ebeced}.safe-auth .question-item[data-v-3ea1fba4]{margin-bottom:2rem;text-align:left}.safe-auth .question-item p[data-v-3ea1fba4]{font-size:1.2rem;font-family:PingFangSC-Regular,PingFang SC,sans-serif;font-weight:400;color:#333;line-height:1.7rem;margin-bottom:1rem}.safe-auth .question-item .com-dropdown[data-v-3ea1fba4]{background-color:hsla(0,0%,87.5%,.3);border-radius:4px;margin-bottom:1.2rem}.safe-auth .question-item input[data-v-3ea1fba4]{padding:0 1rem}.safe-auth .auth-type-item[data-v-3ea1fba4]{height:8rem;padding:0 1.6rem 0 2.5rem;margin-bottom:1.4rem;-webkit-box-align:center;-ms-flex-align:center;align-items:center;background-color:#fff;-webkit-box-shadow:0 1px 4px 0 rgba(0,0,0,.04);box-shadow:0 1px 4px 0 rgba(0,0,0,.04);border-radius:4px}.safe-auth .auth-type-item .type-content[data-v-3ea1fba4]{padding:0 0 0 2.7rem;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-ms-flex-direction:column;flex-direction:column;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center}.safe-auth .auth-type-item p[data-v-3ea1fba4]{color:#333;font-size:1.4rem;font-family:PingFangSC-Regular,PingFang SC,sans-serif;font-weight:400;line-height:2rem}.safe-auth .auth-type-item p[data-v-3ea1fba4]:last-child{margin-top:.8rem;color:#999}.safe-auth .auth-type-item img[data-v-3ea1fba4]{display:inline-block}.safe-auth .auth-type-item .type-icon[data-v-3ea1fba4]{width:3rem;height:3rem}.safe-auth .auth-type-item .type-pointer[data-v-3ea1fba4]{width:1.8rem;height:1.8rem}.safe-activated .inputs-wrapper[data-v-3ea1fba4]{overflow:hidden}.safe-activated .inputs-wrapper input+input[data-v-3ea1fba4]{margin-top:2rem}.safe-deactivated .inputs-wrapper input+input[data-v-3ea1fba4]{margin-top:1.2rem}",
        "",
      ]),
        (t.exports = e);
    },
    eb27: function (t, e, a) {
      "use strict";
      a("e14b");
    },
    f08a: function (t, e, a) {
      t.exports = a.p + "static/img/safe-newPassword.207ef455.png";
    },
    f145: function (t, e, a) {
      var i = a("d758");
      i.__esModule && (i = i.default),
        "string" == typeof i && (i = [[t.i, i, ""]]),
        i.locals && (t.exports = i.locals);
      (0, a("c69b").default)("e28118a4", i, !0, {
        sourceMap: !1,
        shadowMode: !1,
      });
    },
    f36e: function (t, e) {
      t.exports =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAYAAACohjseAAAEHUlEQVRoQ92aT6hXRRTHv199uFEjpUx8tsjXJiQMQVxEIEgb/23aKIQIbqpF29KFCeJfaNHGFgUtwlz7B1RoJYIiSvAWtSkK3iOhINHShaLfmMf8nufNb+69M/fe3+/qnc3jvTdz5nxmzj1zzswhet44Sj5J2wF8CGAngKUlc/0E4DyAL0n+26ZOrQJKcvK+AbC/oZL33aKQvNpQDloBlPQWgGkAE00Vioz/nuTeunIbAUpaDeBOxeQO/Jw3wV9IPhj09+O3AtgF4AMAi0tknSHpzD2r1QaU5L6bdwpm+5zkySxNfGdJawFcBrC+YPxmkjdTZWcDSnoFwN+RCe4CmCLpfrbSJH0B4HBE2CWS21ImyQKUtAfAD4FgAXiNZAw6RYfKPpK+A7Av6PiY5JKqwcmAko4BOBAIPEEy/FvVnLX+L8k5sEfAQsdIspQhCbAAbpLkn7W0bTBIkjs63rMiyiArAQvMchFJZ5qdNElfAfjUTC6Si2LKlALGHEqVSYyLWNJBAEfNfLMkXw/nrwIMd6nTnQuVl3QWwG7z96HjqRAwcs518s1VWYSkvwC8avpNkHwy+D0KGIlQjpN0JvFcNknW0u6RfLkK0A4o/ICfF1pJ7wK4ZvTZSNJFWsPBtg+cfzadV43yEG9rkST9A2CFl/eU5FxcO2Sikh6brOAuyZWpSki6AGCG5CepY2L9vPf+EcDHJK+nyJK0HIBLswZtHcnfFwD6fO6p6bQyNbb0cDv82KjLTlR0CsCv899QRaRiZUpygA7UtT9IvhECfmuT1ZwzT9LXAD4yE2ZDSloAN2dieYAbAdy2ixMCWueSnfJImgHg0p1BS4aMwQF4k+RvKTs/6BN41PcLAXNWLjCTbMi24JweklyC/bbX6cY8oL8guljH9sMVztnJNuE8oLsdcDcIc80C2rBnmuSGHNOoA9k2XMxMLeB/5mrvCMlDTQD9ahaa66jg/LzzvsQCWgezieStpoBFkAC22KPAz5PtUIr0s46mCHApyYdtABZAhqJbg0vawboetGxBIo5n0L1VOA94D8BLoZN5ZrcZh2vqLhd8c3dIrkmVkdpP0iyAyXEDhg6nux0EsMzeQKeuXMlHXwQ3EsgUJ9NLL9r7c7D3kYx7rOxvLDp0QNY8KnICbRM7DuWBdVIlzxDPJkJAAL3MB5tk9KfdHYo5KpKT3bKdzImqJFVm9C427e+djDfT/t6qeUBXUNDfe9GIs+nXzbYHDKsnxvaSWyfuzX6b8JBhFUV/XpeM237R3gc/I3nKWkHVA+hQyUjOuVTH3FLHtPLC6001VjrS6Utva2/0xlRjJSSdfJOtV1lUQI7t5XekdTIGsr+VTgayv7Vq1sONsNrQXfdd6azaMIDsb71oANrPit/wUO5tzXbJhW/nVff/A3Xduy2j+JFBAAAAAElFTkSuQmCC";
    },
  },
]);
