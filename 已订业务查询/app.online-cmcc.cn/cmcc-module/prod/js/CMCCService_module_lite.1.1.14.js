window.location.href.indexOf("__debug__") > -1 &&
  (console = window.originConsole);
var CMCCService_module = (function () {
  "use strict";
  function e(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var r = 0, n = Array(t); r < t; r++) n[r] = e[r];
    return n;
  }
  function t(e, t, r, n, o, i, a) {
    try {
      var c = e[i](a),
        s = c.value;
    } catch (u) {
      return void r(u);
    }
    c.done ? t(s) : Promise.resolve(s).then(n, o);
  }
  function r(e) {
    return function () {
      var r = this,
        n = arguments;
      return new Promise(function (o, i) {
        var a = e.apply(r, n);
        function c(e) {
          t(a, o, i, c, s, "next", e);
        }
        function s(e) {
          t(a, o, i, c, s, "throw", e);
        }
        c(void 0);
      });
    };
  }
  function n(e, t) {
    if (!(e instanceof t))
      throw new TypeError("Cannot call a class as a function");
  }
  function o(e, t, r) {
    return (
      t &&
        (function (e, t) {
          for (var r = 0; r < t.length; r++) {
            var n = t[r];
            (n.enumerable = n.enumerable || !1),
              (n.configurable = !0),
              "value" in n && (n.writable = !0),
              Object.defineProperty(e, f(n.key), n);
          }
        })(e.prototype, t),
      Object.defineProperty(e, "prototype", { writable: !1 }),
      e
    );
  }
  function i(e, t) {
    var r =
      ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
    if (!r) {
      if (Array.isArray(e) || (r = p(e)) || t) {
        r && (e = r);
        var n = 0,
          o = function () {};
        return {
          s: o,
          n: function () {
            return n >= e.length ? { done: !0 } : { done: !1, value: e[n++] };
          },
          e: function (e) {
            throw e;
          },
          f: o,
        };
      }
      throw new TypeError(
        "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
      );
    }
    var i,
      a = !0,
      c = !1;
    return {
      s: function () {
        r = r.call(e);
      },
      n: function () {
        var e = r.next();
        return (a = e.done), e;
      },
      e: function (e) {
        (c = !0), (i = e);
      },
      f: function () {
        try {
          a || null == r.return || r.return();
        } finally {
          if (c) throw i;
        }
      },
    };
  }
  function a(e, t, r) {
    return (
      (t = f(t)) in e
        ? Object.defineProperty(e, t, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0,
          })
        : (e[t] = r),
      e
    );
  }
  function c(e, t) {
    var r = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var n = Object.getOwnPropertySymbols(e);
      t &&
        (n = n.filter(function (t) {
          return Object.getOwnPropertyDescriptor(e, t).enumerable;
        })),
        r.push.apply(r, n);
    }
    return r;
  }
  function s(e) {
    for (var t = 1; t < arguments.length; t++) {
      var r = null != arguments[t] ? arguments[t] : {};
      t % 2
        ? c(Object(r), !0).forEach(function (t) {
            a(e, t, r[t]);
          })
        : Object.getOwnPropertyDescriptors
        ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(r))
        : c(Object(r)).forEach(function (t) {
            Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(r, t));
          });
    }
    return e;
  }
  function u() {
    u = function () {
      return t;
    };
    var e,
      t = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      o =
        Object.defineProperty ||
        function (e, t, r) {
          e[t] = r.value;
        },
      i = "function" == typeof Symbol ? Symbol : {},
      a = i.iterator || "@@iterator",
      c = i.asyncIterator || "@@asyncIterator",
      s = i.toStringTag || "@@toStringTag";
    function l(e, t, r) {
      return (
        Object.defineProperty(e, t, {
          value: r,
          enumerable: !0,
          configurable: !0,
          writable: !0,
        }),
        e[t]
      );
    }
    try {
      l({}, "");
    } catch (A) {
      l = function (e, t, r) {
        return (e[t] = r);
      };
    }
    function f(e, t, r, n) {
      var i = t && t.prototype instanceof C ? t : C,
        a = Object.create(i.prototype),
        c = new M(n || []);
      return o(a, "_invoke", { value: k(e, r, c) }), a;
    }
    function p(e, t, r) {
      try {
        return { type: "normal", arg: e.call(t, r) };
      } catch (n) {
        return { type: "throw", arg: n };
      }
    }
    t.wrap = f;
    var g = "suspendedStart",
      d = "suspendedYield",
      v = "executing",
      h = "completed",
      y = {};
    function C() {}
    function m() {}
    function w() {}
    var S = {};
    l(S, a, function () {
      return this;
    });
    var b = Object.getPrototypeOf,
      _ = b && b(b(O([])));
    _ && _ !== r && n.call(_, a) && (S = _);
    var N = (w.prototype = C.prototype = Object.create(S));
    function x(e) {
      ["next", "throw", "return"].forEach(function (t) {
        l(e, t, function (e) {
          return this._invoke(t, e);
        });
      });
    }
    function B(e, t) {
      function r(o, i, a, c) {
        var s = p(e[o], e, i);
        if ("throw" !== s.type) {
          var u = s.arg,
            l = u.value;
          return l && "object" == typeof l && n.call(l, "__await")
            ? t.resolve(l.__await).then(
                function (e) {
                  r("next", e, a, c);
                },
                function (e) {
                  r("throw", e, a, c);
                }
              )
            : t.resolve(l).then(
                function (e) {
                  (u.value = e), a(u);
                },
                function (e) {
                  return r("throw", e, a, c);
                }
              );
        }
        c(s.arg);
      }
      var i;
      o(this, "_invoke", {
        value: function (e, n) {
          function o() {
            return new t(function (t, o) {
              r(e, n, t, o);
            });
          }
          return (i = i ? i.then(o, o) : o());
        },
      });
    }
    function k(t, r, n) {
      var o = g;
      return function (i, a) {
        if (o === v) throw Error("Generator is already running");
        if (o === h) {
          if ("throw" === i) throw a;
          return { value: e, done: !0 };
        }
        for (n.method = i, n.arg = a; ; ) {
          var c = n.delegate;
          if (c) {
            var s = I(c, n);
            if (s) {
              if (s === y) continue;
              return s;
            }
          }
          if ("next" === n.method) n.sent = n._sent = n.arg;
          else if ("throw" === n.method) {
            if (o === g) throw ((o = h), n.arg);
            n.dispatchException(n.arg);
          } else "return" === n.method && n.abrupt("return", n.arg);
          o = v;
          var u = p(t, r, n);
          if ("normal" === u.type) {
            if (((o = n.done ? h : d), u.arg === y)) continue;
            return { value: u.arg, done: n.done };
          }
          "throw" === u.type &&
            ((o = h), (n.method = "throw"), (n.arg = u.arg));
        }
      };
    }
    function I(t, r) {
      var n = r.method,
        o = t.iterator[n];
      if (o === e)
        return (
          (r.delegate = null),
          ("throw" === n &&
            t.iterator.return &&
            ((r.method = "return"),
            (r.arg = e),
            I(t, r),
            "throw" === r.method)) ||
            ("return" !== n &&
              ((r.method = "throw"),
              (r.arg = new TypeError(
                "The iterator does not provide a '" + n + "' method"
              )))),
          y
        );
      var i = p(o, t.iterator, r.arg);
      if ("throw" === i.type)
        return (r.method = "throw"), (r.arg = i.arg), (r.delegate = null), y;
      var a = i.arg;
      return a
        ? a.done
          ? ((r[t.resultName] = a.value),
            (r.next = t.nextLoc),
            "return" !== r.method && ((r.method = "next"), (r.arg = e)),
            (r.delegate = null),
            y)
          : a
        : ((r.method = "throw"),
          (r.arg = new TypeError("iterator result is not an object")),
          (r.delegate = null),
          y);
    }
    function T(e) {
      var t = { tryLoc: e[0] };
      1 in e && (t.catchLoc = e[1]),
        2 in e && ((t.finallyLoc = e[2]), (t.afterLoc = e[3])),
        this.tryEntries.push(t);
    }
    function D(e) {
      var t = e.completion || {};
      (t.type = "normal"), delete t.arg, (e.completion = t);
    }
    function M(e) {
      (this.tryEntries = [{ tryLoc: "root" }]),
        e.forEach(T, this),
        this.reset(!0);
    }
    function O(t) {
      if (t || "" === t) {
        var r = t[a];
        if (r) return r.call(t);
        if ("function" == typeof t.next) return t;
        if (!isNaN(t.length)) {
          var o = -1,
            i = function r() {
              for (; ++o < t.length; )
                if (n.call(t, o)) return (r.value = t[o]), (r.done = !1), r;
              return (r.value = e), (r.done = !0), r;
            };
          return (i.next = i);
        }
      }
      throw new TypeError(typeof t + " is not iterable");
    }
    return (
      (m.prototype = w),
      o(N, "constructor", { value: w, configurable: !0 }),
      o(w, "constructor", { value: m, configurable: !0 }),
      (m.displayName = l(w, s, "GeneratorFunction")),
      (t.isGeneratorFunction = function (e) {
        var t = "function" == typeof e && e.constructor;
        return (
          !!t && (t === m || "GeneratorFunction" === (t.displayName || t.name))
        );
      }),
      (t.mark = function (e) {
        return (
          Object.setPrototypeOf
            ? Object.setPrototypeOf(e, w)
            : ((e.__proto__ = w), l(e, s, "GeneratorFunction")),
          (e.prototype = Object.create(N)),
          e
        );
      }),
      (t.awrap = function (e) {
        return { __await: e };
      }),
      x(B.prototype),
      l(B.prototype, c, function () {
        return this;
      }),
      (t.AsyncIterator = B),
      (t.async = function (e, r, n, o, i) {
        void 0 === i && (i = Promise);
        var a = new B(f(e, r, n, o), i);
        return t.isGeneratorFunction(r)
          ? a
          : a.next().then(function (e) {
              return e.done ? e.value : a.next();
            });
      }),
      x(N),
      l(N, s, "Generator"),
      l(N, a, function () {
        return this;
      }),
      l(N, "toString", function () {
        return "[object Generator]";
      }),
      (t.keys = function (e) {
        var t = Object(e),
          r = [];
        for (var n in t) r.push(n);
        return (
          r.reverse(),
          function e() {
            for (; r.length; ) {
              var n = r.pop();
              if (n in t) return (e.value = n), (e.done = !1), e;
            }
            return (e.done = !0), e;
          }
        );
      }),
      (t.values = O),
      (M.prototype = {
        constructor: M,
        reset: function (t) {
          if (
            ((this.prev = 0),
            (this.next = 0),
            (this.sent = this._sent = e),
            (this.done = !1),
            (this.delegate = null),
            (this.method = "next"),
            (this.arg = e),
            this.tryEntries.forEach(D),
            !t)
          )
            for (var r in this)
              "t" === r.charAt(0) &&
                n.call(this, r) &&
                !isNaN(+r.slice(1)) &&
                (this[r] = e);
        },
        stop: function () {
          this.done = !0;
          var e = this.tryEntries[0].completion;
          if ("throw" === e.type) throw e.arg;
          return this.rval;
        },
        dispatchException: function (t) {
          if (this.done) throw t;
          var r = this;
          function o(n, o) {
            return (
              (c.type = "throw"),
              (c.arg = t),
              (r.next = n),
              o && ((r.method = "next"), (r.arg = e)),
              !!o
            );
          }
          for (var i = this.tryEntries.length - 1; i >= 0; --i) {
            var a = this.tryEntries[i],
              c = a.completion;
            if ("root" === a.tryLoc) return o("end");
            if (a.tryLoc <= this.prev) {
              var s = n.call(a, "catchLoc"),
                u = n.call(a, "finallyLoc");
              if (s && u) {
                if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
                if (this.prev < a.finallyLoc) return o(a.finallyLoc);
              } else if (s) {
                if (this.prev < a.catchLoc) return o(a.catchLoc, !0);
              } else {
                if (!u) throw Error("try statement without catch or finally");
                if (this.prev < a.finallyLoc) return o(a.finallyLoc);
              }
            }
          }
        },
        abrupt: function (e, t) {
          for (var r = this.tryEntries.length - 1; r >= 0; --r) {
            var o = this.tryEntries[r];
            if (
              o.tryLoc <= this.prev &&
              n.call(o, "finallyLoc") &&
              this.prev < o.finallyLoc
            ) {
              var i = o;
              break;
            }
          }
          i &&
            ("break" === e || "continue" === e) &&
            i.tryLoc <= t &&
            t <= i.finallyLoc &&
            (i = null);
          var a = i ? i.completion : {};
          return (
            (a.type = e),
            (a.arg = t),
            i
              ? ((this.method = "next"), (this.next = i.finallyLoc), y)
              : this.complete(a)
          );
        },
        complete: function (e, t) {
          if ("throw" === e.type) throw e.arg;
          return (
            "break" === e.type || "continue" === e.type
              ? (this.next = e.arg)
              : "return" === e.type
              ? ((this.rval = this.arg = e.arg),
                (this.method = "return"),
                (this.next = "end"))
              : "normal" === e.type && t && (this.next = t),
            y
          );
        },
        finish: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var r = this.tryEntries[t];
            if (r.finallyLoc === e)
              return this.complete(r.completion, r.afterLoc), D(r), y;
          }
        },
        catch: function (e) {
          for (var t = this.tryEntries.length - 1; t >= 0; --t) {
            var r = this.tryEntries[t];
            if (r.tryLoc === e) {
              var n = r.completion;
              if ("throw" === n.type) {
                var o = n.arg;
                D(r);
              }
              return o;
            }
          }
          throw Error("illegal catch attempt");
        },
        delegateYield: function (t, r, n) {
          return (
            (this.delegate = { iterator: O(t), resultName: r, nextLoc: n }),
            "next" === this.method && (this.arg = e),
            y
          );
        },
      }),
      t
    );
  }
  function l(e, t) {
    return (
      (function (e) {
        if (Array.isArray(e)) return e;
      })(e) ||
      (function (e, t) {
        var r =
          null == e
            ? null
            : ("undefined" != typeof Symbol && e[Symbol.iterator]) ||
              e["@@iterator"];
        if (null != r) {
          var n,
            o,
            i,
            a,
            c = [],
            s = !0,
            u = !1;
          try {
            if (((i = (r = r.call(e)).next), 0 === t));
            else
              for (
                ;
                !(s = (n = i.call(r)).done) &&
                (c.push(n.value), c.length !== t);
                s = !0
              );
          } catch (l) {
            (u = !0), (o = l);
          } finally {
            try {
              if (!s && null != r.return && ((a = r.return()), Object(a) !== a))
                return;
            } finally {
              if (u) throw o;
            }
          }
          return c;
        }
      })(e, t) ||
      p(e, t) ||
      (function () {
        throw new TypeError(
          "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
        );
      })()
    );
  }
  function f(e) {
    var t = (function (e, t) {
      if ("object" != typeof e || !e) return e;
      var r = e[Symbol.toPrimitive];
      if (void 0 !== r) {
        var n = r.call(e, t || "default");
        if ("object" != typeof n) return n;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === t ? String : Number)(e);
    })(e, "string");
    return "symbol" == typeof t ? t : t + "";
  }
  function p(t, r) {
    if (t) {
      if ("string" == typeof t) return e(t, r);
      var n = {}.toString.call(t).slice(8, -1);
      return (
        "Object" === n && t.constructor && (n = t.constructor.name),
        "Map" === n || "Set" === n
          ? Array.from(t)
          : "Arguments" === n ||
            /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
          ? e(t, r)
          : void 0
      );
    }
  }
  var g = "https://h.app.coc.10086.cn",
    d = [
      {
        interfaceCode: "20048",
        functionName: "gsmState",
        rzApi: "".concat(g, "/biz-orange/BRN/globalCommunications/gsmState"),
        serviceName: "新全球通标识查询",
        serviceDesc: "新全球通标识查询，IT接口，编码20048",
      },
      {
        interfaceCode: "20016",
        functionName: "getRealFee",
        rzApi: "".concat(g, "/biz-orange/BN/sscrz/getRealFee"),
        serviceName: "实时话费查询",
        serviceDesc: "实时话费查询，IT接口，编码20016",
      },
      {
        interfaceCode: "20085",
        functionName: "getNewPlanRemainQry",
        rzApi: "",
        serviceName: "新套餐余量查询",
        serviceDesc: "新套餐余量查询，IT接口，编码20085",
      },
      {
        interfaceCode: "20008",
        functionName: "getPayFeesQueryInfo",
        rzApi: "".concat(g, "/biz-orange/BRN/payFeesQuery/getPayFeesQueryInfo"),
        serviceName: "获取应缴费用查询",
        serviceDesc: "获取应缴费用查询，IT接口，编码20008",
      },
      {
        interfaceCode: "20072",
        functionName: "getNewBills",
        rzApi: "".concat(g, "/biz-orange/BRH/newBills/getNewBills"),
        serviceName: "消费数据",
        serviceDesc: "消费数据，IT接口，编码20072",
      },
      {
        interfaceCode: "20002",
        functionName: "getScoreQuery",
        rzApi: "".concat(g, "/biz-orange/BRN/score/getScoreQuery"),
        serviceName: "积分",
        serviceDesc: "积分，IT接口，编码20002",
      },
      {
        interfaceCode: "20007",
        functionName: "getUserInformation",
        rzApi: "".concat(
          g,
          "/biz-orange/BRN/userInformationService/getUserInformation"
        ),
        serviceName: "客户资料查询",
        serviceDesc: "客户资料查询，IT接口，编码20007",
      },
      {
        interfaceCode: "20089",
        functionName: "getBillCustInfoQry",
        rzApi: "".concat(
          g,
          "/biz-orange/BRH/billCustInfoReq/getBillCustInfoQry"
        ),
        serviceName: "账单定制信息查询",
        serviceDesc: "账单定制信息查询，IT接口，编码20089",
      },
      {
        interfaceCode: "20088",
        functionName: "getAuthorizeSyn",
        rzApi: "",
        serviceName: "授权",
        serviceDesc: "授权，IT接口，编码20088",
      },
      {
        interfaceCode: "20087",
        functionName: "getAuthorizeStatus",
        rzApi: "",
        serviceName: "授权状态信息查询",
        serviceDesc: "授权状态信息查询，IT接口，编码20087",
      },
      {
        interfaceCode: "20073",
        functionName: "getAccoutInfo",
        rzApi: "",
        serviceName: "账单账户信息查询",
        serviceDesc: "账单账户信息查询，IT接口，编码20073",
      },
      {
        interfaceCode: "20111",
        functionName: "getBandNewBills",
        rzApi: "",
        serviceName: "宽带账单查询",
        serviceDesc: "宽带账单查询，IT接口，编码20111",
      },
      {
        interfaceCode: "20066",
        functionName: "getUserPlanQryNew",
        rzApi: "",
        serviceName: "用户主套餐明细信息查询",
        serviceDesc: "用户主套餐明细信息查询，IT接口，编码20066",
      },
      {
        interfaceCode: "20063",
        functionName: "getDayFlowInfo",
        rzApi: "",
        serviceName: "流量专区-用户按日计费套餐查询",
        serviceDesc: "流量专区-用户按日计费套餐查询，IT接口，编码20063",
      },
      {
        interfaceCode: "50211",
        functionName: "getPersonalInfo",
        rzApi: "",
        serviceName: "个人宽带信息查询",
        serviceDesc: "个人宽带信息查询，IT接口，编码50211",
      },
      {
        interfaceCode: "20062",
        functionName: "getUserShareInfo",
        rzApi: "",
        serviceName: "流量专区-用户共享信息查询",
        serviceDesc: "流量专区-用户共享信息查询，IT接口，编码20062",
      },
      {
        interfaceCode: "20064",
        functionName: "getFlowInfoQryOld",
        rzApi: "",
        serviceName: "国际漫游流量综合查询",
        serviceDesc: "国际漫游流量综合查询，IT接口，编码20064",
      },
      {
        interfaceCode: "20075",
        functionName: "getHisComboMealResource",
        rzApi: "",
        serviceName: "历史套餐余量查询",
        serviceDesc: "历史套餐余量查询，IT接口，编码20075",
      },
      {
        interfaceCode: "20012",
        functionName: "getNewDetail",
        rzApi: "",
        serviceName: "新详单查询",
        serviceDesc: "新详单查询，IT接口，编码20012",
      },
      {
        interfaceCode: "20110",
        functionName: "getUserPlanType",
        rzApi: "",
        serviceName: "用户固话和宽带信息查询",
        serviceDesc: "用户固话和宽带信息查询，IT接口，编码20110",
      },
      {
        interfaceCode: "20035",
        functionName: "getUnifyQuery",
        rzApi: "",
        serviceName: "统一查询",
        serviceDesc: "统一查询，IT接口，编码20035",
      },
      {
        interfaceCode: "20109",
        functionName: "getNewQueryBusiness",
        rzApi: "",
        serviceName: "新版已订购业务查询",
        serviceDesc: "新版已订购业务查询，IT接口，编码20109",
      },
      {
        interfaceCode: "20101",
        functionName: "qryOrderedBusiness",
        rzApi: "",
        serviceName: "已订购业务查询",
        serviceDesc: "已订购业务查询，IT接口，编码20101",
      },
      {
        interfaceCode: "20011",
        functionName: "getQueryBusiness",
        rzApi: "",
        serviceName: "已订业务查询",
        serviceDesc: "已订业务查询，IT接口，编码20011",
      },
      {
        interfaceCode: "20100",
        functionName: "qryBindedBusiness",
        rzApi: "",
        serviceName: "联合业务查询",
        serviceDesc: "联合业务查询，IT接口，编码20100",
      },
      {
        interfaceCode: "20096",
        functionName: "getSmsCode",
        rzApi: "",
        serviceName: "短信验证码获取",
        serviceDesc: "短信验证码获取，IT接口，编码20096",
      },
      {
        interfaceCode: "20057",
        functionName: "getUnifyCancel",
        rzApi: "",
        serviceName: "统一退订",
        serviceDesc: "统一退订，IT接口，编码20057",
      },
      {
        interfaceCode: "20018",
        functionName: "updatePlan",
        rzApi: "",
        serviceName: "主套餐变更",
        serviceDesc: "主套餐变更，IT接口，编码20018",
      },
      {
        interfaceCode: "20014",
        functionName: "getDetail",
        rzApi: "",
        serviceName: "详单通话分析",
        serviceDesc: "详单通话分析，IT接口，编码20014",
      },
      {
        interfaceCode: "20090",
        functionName: "billCustInfoOrder",
        rzApi: "",
        serviceName: "账单定制办理",
        serviceDesc: "账单定制办理，IT接口，编码20090",
      },
      {
        interfaceCode: "20113",
        functionName: "getDefaultInfoQry",
        rzApi: "",
        serviceName: "违约金查询",
        serviceDesc: "违约金查询，IT接口，编码20113",
      },
      {
        interfaceCode: "20114",
        functionName: "contractTdAuth",
        rzApi: "",
        serviceName: "合约退订资格校验接口",
        serviceDesc: "合约退订资格校验接口，IT接口，编码20114",
      },
      {
        interfaceCode: "20115",
        functionName: "contractTd",
        rzApi: "",
        serviceName: "合约退订接口",
        serviceDesc: "合约退订接口，IT接口，编码20115",
      },
    ],
    v = { contractTdAuth: "getAuth", contractTd: "tocontractTd" },
    h = new Map(),
    y = o(function e() {
      n(this, e),
        (this.callbackList = []),
        (this.response = null),
        (this.error = null);
    }),
    C = (function () {
      var e = r(
        u().mark(function e(t, r) {
          var n, o, a;
          return u().wrap(function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (
                    ((n = h.get(t)) || ((n = new y()), h.set(t, n)),
                    !n.response)
                  ) {
                    e.next = 4;
                    break;
                  }
                  return e.abrupt("return", n.response);
                case 4:
                  if (!n.error) {
                    e.next = 6;
                    break;
                  }
                  throw n.error;
                case 6:
                  return (
                    (o = new Promise(function (e, t) {
                      n.callbackList.push(function (r, o) {
                        o ? ((n.error = o), t(o)) : ((n.response = r), e(r));
                      });
                    })),
                    1 === n.callbackList.length &&
                      r()
                        .then(function (e) {
                          var t,
                            r = i(n.callbackList);
                          try {
                            for (r.s(); !(t = r.n()).done; ) {
                              (0, t.value)(e, null);
                            }
                          } catch (o) {
                            r.e(o);
                          } finally {
                            r.f();
                          }
                        })
                        .catch(function (e) {
                          var t,
                            r = i(n.callbackList);
                          try {
                            for (r.s(); !(t = r.n()).done; ) {
                              (0, t.value)(null, e);
                            }
                          } catch (o) {
                            r.e(o);
                          } finally {
                            r.f();
                          }
                        }),
                    (e.next = 10),
                    o
                  );
                case 10:
                  return (a = e.sent), e.abrupt("return", a);
                case 12:
                case "end":
                  return e.stop();
              }
          }, e);
        })
      );
      return function (t, r) {
        return e.apply(this, arguments);
      };
    })();
  !(function (e) {
    if (!e.fetch) {
      var t = "URLSearchParams" in e,
        r = "Symbol" in e && "iterator" in Symbol,
        n =
          "FileReader" in e &&
          "Blob" in e &&
          (function () {
            try {
              return new Blob(), !0;
            } catch (e) {
              return !1;
            }
          })(),
        o = "FormData" in e,
        i = "ArrayBuffer" in e;
      if (i)
        var a = [
            "[object Int8Array]",
            "[object Uint8Array]",
            "[object Uint8ClampedArray]",
            "[object Int16Array]",
            "[object Uint16Array]",
            "[object Int32Array]",
            "[object Uint32Array]",
            "[object Float32Array]",
            "[object Float64Array]",
          ],
          c = function (e) {
            return e && DataView.prototype.isPrototypeOf(e);
          },
          s =
            ArrayBuffer.isView ||
            function (e) {
              return e && a.indexOf(Object.prototype.toString.call(e)) > -1;
            };
      (d.prototype.append = function (e, t) {
        (e = f(e)), (t = p(t));
        var r = this.map[e];
        this.map[e] = r ? r + "," + t : t;
      }),
        (d.prototype.delete = function (e) {
          delete this.map[f(e)];
        }),
        (d.prototype.get = function (e) {
          return (e = f(e)), this.has(e) ? this.map[e] : null;
        }),
        (d.prototype.has = function (e) {
          return this.map.hasOwnProperty(f(e));
        }),
        (d.prototype.set = function (e, t) {
          this.map[f(e)] = p(t);
        }),
        (d.prototype.forEach = function (e, t) {
          for (var r in this.map)
            this.map.hasOwnProperty(r) && e.call(t, this.map[r], r, this);
        }),
        (d.prototype.keys = function () {
          var e = [];
          return (
            this.forEach(function (t, r) {
              e.push(r);
            }),
            g(e)
          );
        }),
        (d.prototype.values = function () {
          var e = [];
          return (
            this.forEach(function (t) {
              e.push(t);
            }),
            g(e)
          );
        }),
        (d.prototype.entries = function () {
          var e = [];
          return (
            this.forEach(function (t, r) {
              e.push([r, t]);
            }),
            g(e)
          );
        }),
        r && (d.prototype[Symbol.iterator] = d.prototype.entries);
      var u = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
      (w.prototype.clone = function () {
        return new w(this, { body: this._bodyInit });
      }),
        m.call(w.prototype),
        m.call(b.prototype),
        (b.prototype.clone = function () {
          return new b(this._bodyInit, {
            status: this.status,
            statusText: this.statusText,
            headers: new d(this.headers),
            url: this.url,
          });
        }),
        (b.error = function () {
          var e = new b(null, { status: 0, statusText: "" });
          return (e.type = "error"), e;
        });
      var l = [301, 302, 303, 307, 308];
      (b.redirect = function (e, t) {
        if (-1 === l.indexOf(t)) throw new RangeError("Invalid status code");
        return new b(null, { status: t, headers: { location: e } });
      }),
        (e.Headers = d),
        (e.Request = w),
        (e.Response = b),
        (e.fetch = function (e, t) {
          return new Promise(function (r, o) {
            var i = new w(e, t),
              a = new XMLHttpRequest();
            (a.onload = function () {
              var e,
                t,
                n = {
                  status: a.status,
                  statusText: a.statusText,
                  headers:
                    ((e = a.getAllResponseHeaders() || ""),
                    (t = new d()),
                    e
                      .replace(/\r?\n[\t ]+/g, " ")
                      .split(/\r?\n/)
                      .forEach(function (e) {
                        var r = e.split(":"),
                          n = r.shift().trim();
                        if (n) {
                          var o = r.join(":").trim();
                          t.append(n, o);
                        }
                      }),
                    t),
                };
              n.url =
                "responseURL" in a
                  ? a.responseURL
                  : n.headers.get("X-Request-URL");
              var o = "response" in a ? a.response : a.responseText;
              r(new b(o, n));
            }),
              (a.onerror = function () {
                o(new TypeError("Network request failed"));
              }),
              (a.ontimeout = function () {
                o(new TypeError("Network request failed"));
              }),
              a.open(i.method, i.url, !0),
              "include" === i.credentials
                ? (a.withCredentials = !0)
                : "omit" === i.credentials && (a.withCredentials = !1),
              "responseType" in a && n && (a.responseType = "blob"),
              i.headers.forEach(function (e, t) {
                a.setRequestHeader(t, e);
              }),
              a.send(void 0 === i._bodyInit ? null : i._bodyInit);
          });
        }),
        (e.fetch.polyfill = !0);
    }
    function f(e) {
      if (
        ("string" != typeof e && (e = String(e)),
        /[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(e))
      )
        throw new TypeError("Invalid character in header field name");
      return e.toLowerCase();
    }
    function p(e) {
      return "string" != typeof e && (e = String(e)), e;
    }
    function g(e) {
      var t = {
        next: function () {
          var t = e.shift();
          return { done: void 0 === t, value: t };
        },
      };
      return (
        r &&
          (t[Symbol.iterator] = function () {
            return t;
          }),
        t
      );
    }
    function d(e) {
      (this.map = {}),
        e instanceof d
          ? e.forEach(function (e, t) {
              this.append(t, e);
            }, this)
          : Array.isArray(e)
          ? e.forEach(function (e) {
              this.append(e[0], e[1]);
            }, this)
          : e &&
            Object.getOwnPropertyNames(e).forEach(function (t) {
              this.append(t, e[t]);
            }, this);
    }
    function v(e) {
      if (e.bodyUsed) return Promise.reject(new TypeError("Already read"));
      e.bodyUsed = !0;
    }
    function h(e) {
      return new Promise(function (t, r) {
        (e.onload = function () {
          t(e.result);
        }),
          (e.onerror = function () {
            r(e.error);
          });
      });
    }
    function y(e) {
      var t = new FileReader(),
        r = h(t);
      return t.readAsArrayBuffer(e), r;
    }
    function C(e) {
      if (e.slice) return e.slice(0);
      var t = new Uint8Array(e.byteLength);
      return t.set(new Uint8Array(e)), t.buffer;
    }
    function m() {
      return (
        (this.bodyUsed = !1),
        (this._initBody = function (e) {
          if (((this._bodyInit = e), e))
            if ("string" == typeof e) this._bodyText = e;
            else if (n && Blob.prototype.isPrototypeOf(e)) this._bodyBlob = e;
            else if (o && FormData.prototype.isPrototypeOf(e))
              this._bodyFormData = e;
            else if (t && URLSearchParams.prototype.isPrototypeOf(e))
              this._bodyText = e.toString();
            else if (i && n && c(e))
              (this._bodyArrayBuffer = C(e.buffer)),
                (this._bodyInit = new Blob([this._bodyArrayBuffer]));
            else {
              if (!i || (!ArrayBuffer.prototype.isPrototypeOf(e) && !s(e)))
                throw new Error("unsupported BodyInit type");
              this._bodyArrayBuffer = C(e);
            }
          else this._bodyText = "";
          this.headers.get("content-type") ||
            ("string" == typeof e
              ? this.headers.set("content-type", "text/plain;charset=UTF-8")
              : this._bodyBlob && this._bodyBlob.type
              ? this.headers.set("content-type", this._bodyBlob.type)
              : t &&
                URLSearchParams.prototype.isPrototypeOf(e) &&
                this.headers.set(
                  "content-type",
                  "application/x-www-form-urlencoded;charset=UTF-8"
                ));
        }),
        n &&
          ((this.blob = function () {
            var e = v(this);
            if (e) return e;
            if (this._bodyBlob) return Promise.resolve(this._bodyBlob);
            if (this._bodyArrayBuffer)
              return Promise.resolve(new Blob([this._bodyArrayBuffer]));
            if (this._bodyFormData)
              throw new Error("could not read FormData body as blob");
            return Promise.resolve(new Blob([this._bodyText]));
          }),
          (this.arrayBuffer = function () {
            return this._bodyArrayBuffer
              ? v(this) || Promise.resolve(this._bodyArrayBuffer)
              : this.blob().then(y);
          })),
        (this.text = function () {
          var e,
            t,
            r,
            n = v(this);
          if (n) return n;
          if (this._bodyBlob)
            return (
              (e = this._bodyBlob),
              (t = new FileReader()),
              (r = h(t)),
              t.readAsText(e),
              r
            );
          if (this._bodyArrayBuffer)
            return Promise.resolve(
              (function (e) {
                for (
                  var t = new Uint8Array(e), r = new Array(t.length), n = 0;
                  n < t.length;
                  n++
                )
                  r[n] = String.fromCharCode(t[n]);
                return r.join("");
              })(this._bodyArrayBuffer)
            );
          if (this._bodyFormData)
            throw new Error("could not read FormData body as text");
          return Promise.resolve(this._bodyText);
        }),
        o &&
          (this.formData = function () {
            return this.text().then(S);
          }),
        (this.json = function () {
          return this.text().then(JSON.parse);
        }),
        this
      );
    }
    function w(e, t) {
      var r,
        n,
        o = (t = t || {}).body;
      if (e instanceof w) {
        if (e.bodyUsed) throw new TypeError("Already read");
        (this.url = e.url),
          (this.credentials = e.credentials),
          t.headers || (this.headers = new d(e.headers)),
          (this.method = e.method),
          (this.mode = e.mode),
          o || null == e._bodyInit || ((o = e._bodyInit), (e.bodyUsed = !0));
      } else this.url = String(e);
      if (
        ((this.credentials = t.credentials || this.credentials || "omit"),
        (!t.headers && this.headers) || (this.headers = new d(t.headers)),
        (this.method =
          ((r = t.method || this.method || "GET"),
          (n = r.toUpperCase()),
          u.indexOf(n) > -1 ? n : r)),
        (this.mode = t.mode || this.mode || null),
        (this.referrer = null),
        ("GET" === this.method || "HEAD" === this.method) && o)
      )
        throw new TypeError("Body not allowed for GET or HEAD requests");
      this._initBody(o);
    }
    function S(e) {
      var t = new FormData();
      return (
        e
          .trim()
          .split("&")
          .forEach(function (e) {
            if (e) {
              var r = e.split("="),
                n = r.shift().replace(/\+/g, " "),
                o = r.join("=").replace(/\+/g, " ");
              t.append(decodeURIComponent(n), decodeURIComponent(o));
            }
          }),
        t
      );
    }
    function b(e, t) {
      t || (t = {}),
        (this.type = "default"),
        (this.status = void 0 === t.status ? 200 : t.status),
        (this.ok = this.status >= 200 && this.status < 300),
        (this.statusText = "statusText" in t ? t.statusText : "OK"),
        (this.headers = new d(t.headers)),
        (this.url = t.url || ""),
        this._initBody(e);
    }
  })("undefined" != typeof self ? self : void 0);
  var m = {
      900001: "sdk初始化失败",
      900004: "app接口超时",
      900005: "参数异常",
    },
    w = function (e) {
      return m[e];
    },
    S = ""
      .concat(B())
      .concat(B(), "-")
      .concat(B(), "-")
      .concat(B(), "-")
      .concat(B(), "-")
      .concat(B())
      .concat(B())
      .concat(B()),
    b = (function () {
      var e = r(
        u().mark(function e(t) {
          var n,
            o,
            i,
            a,
            c,
            l,
            f,
            p,
            g,
            d,
            v,
            h,
            y,
            C,
            m,
            b,
            _,
            N,
            x,
            B,
            T,
            D,
            M;
          return u().wrap(function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  return (
                    (n = t.method),
                    (o = void 0 === n ? "POST" : n),
                    (i = t.url),
                    (a = t.data),
                    (c = t.allTime),
                    (l = t.needHeaders),
                    (f = void 0 !== l && l),
                    (p = t.noEncrypt),
                    (g = void 0 !== p && p),
                    (d = t.isPushHotCache),
                    (v = void 0 !== d && d),
                    (o = o.toUpperCase()),
                    navigator.userAgent.indexOf("leadeon") < 0 && (a.xk = S),
                    (O = a),
                    (A = a.reqBody),
                    (E = void 0),
                    (P = void 0),
                    (j = void 0),
                    (L = void 0),
                    (R = void 0),
                    (U = void 0),
                    (z = void 0),
                    (F = void 0),
                    (J = void 0),
                    (H = void 0),
                    (q = void 0),
                    (Q = void 0),
                    (K = void 0),
                    (G = void 0),
                    (V = void 0),
                    (Y = void 0),
                    (X = void 0),
                    (E = O.CID ? O.CID : O.cid),
                    (P = O.EN ? O.EN : O.en),
                    (j = O.TOKEN ? O.TOKEN : O.token),
                    (L = O.SN ? O.SN : O.sn),
                    (R = O.VERSION ? O.VERSION : O.version),
                    (U = O.ST ? O.ST : O.st),
                    (z = O.SV ? O.SV : O.sv),
                    (F = O.SP ? O.SP : O.sp),
                    (J = O.XK ? O.XK : O.xk),
                    (H = O.AK ? O.AK : O.ak),
                    (q = O.CHANNEL ? O.CHANNEL : O.channel),
                    (Q = O.imei ? O.imei : ""),
                    (K = O.nt ? O.nt : ""),
                    (G = O.sb ? O.sb : ""),
                    (V = O.PROVINCE ? O.PROVINCE : O.province),
                    (Y = O.CITY ? O.CITY : O.city),
                    (X = O.USERPHONENUM ? O.USERPHONENUM : O.phoneNumber),
                    (a = JSON.stringify({
                      cid: E,
                      en: P,
                      t: j,
                      sn: L,
                      cv: R,
                      st: U,
                      sv: z,
                      sp: F,
                      xk: J,
                      ak: H,
                      xc: q,
                      imei: Q,
                      nt: K,
                      sb: G,
                      prov: V,
                      city: Y,
                      tel: X,
                      reqBody: A,
                    })),
                    i.indexOf("?undefined=") < 0 &&
                      (i = i.replace("?undefined", "")),
                    (h = new Headers({
                      Accept: "application/json",
                      "Content-Type": "application/json; charset=utf-8",
                    })),
                    (y = i.replace(/http(s|.?)\:\/\//, "")),
                    (C =
                      y.indexOf("?") > -1
                        ? y.slice(y.indexOf("/"), y.indexOf("?"))
                        : y.slice(y.indexOf("/"))),
                    (m = new Date().getTime()),
                    (b = a ? JSON.parse(a) : {}),
                    (_ = k(8)),
                    (N = null),
                    navigator.userAgent.indexOf("leadeon") > -1 &&
                      b.hasOwnProperty("xk") &&
                      (S = b.xk),
                    (x = S + "_" + C + "_" + m + "_" + _),
                    navigator.userAgent.indexOf("leadeon") > -1
                      ? b.hasOwnProperty("t") &&
                        (i.indexOf("JSESSIONID=") > -1 || I("JSESSIONID")) &&
                        ((B = ""),
                        i.indexOf("JSESSIONID=") > -1
                          ? ((B = b.t.match(/JSESSIONID=[\w-]+/g)),
                            (N = B ? B[0].replace("JSESSIONID=", "") : null))
                          : I("JSESSIONID") && (N = I("JSESSIONID")))
                      : (N = I("JSESSIONID") || null),
                    null,
                    (T =
                      BasicService_H5module.encryptByAES(x) +
                      "_" +
                      m +
                      "_" +
                      _ +
                      "_" +
                      N),
                    h.append("x-time", m),
                    h.append("x-nonce", _),
                    h.append("x-token", BasicService_H5module.encryptByAES(x)),
                    h.append(
                      "x-sign",
                      BasicService_H5module.CryptoJS.MD5(T).toString()
                    ),
                    h.append("TRACE", S + "_" + C + "_" + m + "_" + k(20, !0)),
                    g ||
                      (h.append("x-qen", "1"),
                      (a = BasicService_H5module.encryptByAES(a))),
                    (D = {
                      method: o,
                      headers: h,
                      mode: "cors",
                      cache: "no-cache",
                      credentials: "include",
                      withCredentials: !0,
                    }),
                    "POST" === o && (D = s(s({}, D), {}, { body: a })),
                    (M = {}),
                    e.abrupt(
                      "return",
                      Promise.race([
                        new Promise(function (e, t) {
                          fetch(i, D)
                            .then(function (e) {
                              return f && (M = e.headers), v ? e : e.json();
                            })
                            .then(
                              (function () {
                                var t = r(
                                  u().mark(function t(r) {
                                    return u().wrap(function (t) {
                                      for (;;)
                                        switch ((t.prev = t.next)) {
                                          case 0:
                                            if (!v) {
                                              t.next = 3;
                                              break;
                                            }
                                            return (
                                              e({ data: r }), t.abrupt("return")
                                            );
                                          case 3:
                                            CMCCService_logger.log(
                                              "容灾接口调用，data:",
                                              r
                                            ),
                                              r.body &&
                                                (r = JSON.parse(
                                                  BasicService_H5module.decryptByAES(
                                                    r.body
                                                  )
                                                )),
                                              f && (r.headers = M),
                                              (r.isRZFetch = !0),
                                              CMCCService_logger.log(
                                                "容灾接口调用，resolve data + needSave:",
                                                { data: r, needSave: !0 }
                                              ),
                                              e({
                                                data: r,
                                                needSave: !0,
                                                allTime: c,
                                              });
                                          case 9:
                                          case "end":
                                            return t.stop();
                                        }
                                    }, t);
                                  })
                                );
                                return function (e) {
                                  return t.apply(this, arguments);
                                };
                              })()
                            )
                            .catch(function (e) {
                              CMCCService_logger.log(
                                "容灾接口调用，catch err，reject err:",
                                e
                              ),
                                t(e);
                            });
                        }),
                        new Promise(function (e, t) {
                          setTimeout(function () {
                            t(w("900004"));
                          }, 1e4);
                        }),
                      ])
                    )
                  );
                case 27:
                case "end":
                  return e.stop();
              }
            var O, A, E, P, j, L, R, U, z, F, J, H, q, Q, K, G, V, Y, X;
          }, e);
        })
      );
      return function (t) {
        return e.apply(this, arguments);
      };
    })();
  function _(e) {
    return N.apply(this, arguments);
  }
  function N() {
    return (N = r(
      u().mark(function e(t) {
        var r,
          n,
          o,
          i,
          a,
          c,
          l,
          f,
          p,
          g,
          d,
          v,
          h,
          y,
          C,
          m,
          w,
          S,
          b,
          _,
          N,
          x,
          B,
          k,
          T,
          D,
          M,
          O,
          A;
        return u().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  return (
                    (r = t.serviceName),
                    (n = t.serviceDesc),
                    (o = t.userInfo),
                    (i = t.result),
                    (a = t.rt),
                    (c = t.failCode),
                    (l = void 0 === c ? "" : c),
                    (e.prev = 1),
                    (f = navigator.userAgent.indexOf("leadeon") > -1),
                    (e.next = 5),
                    ue({ debug: !1, state: "1" })
                  );
                case 5:
                  (p = e.sent),
                    CMCCService_logger.log(
                      "监控上报逻辑，获取服务功能配置:",
                      p
                    ),
                    (g = p.reportRatio || 0),
                    CMCCService_logger.log("监控上报逻辑，采样率:", g),
                    (d = Math.random()),
                    CMCCService_logger.log("监控上报逻辑，随机数:", d),
                    100 * d < g &&
                      ((v = {
                        channel: "30011",
                        serviceName: r,
                        serviceDesc: n,
                        provinceCode: o.loginProvince,
                        result: i,
                        rt: a,
                        failCode: l,
                      }),
                      (h = ""),
                      (y = ""),
                      (C = ""),
                      (m = ""),
                      f
                        ? ((w = o.token),
                          (h = (S = void 0 === w ? "" : w)
                            .match(/JSESSIONID=(.*?);/)[1]
                            .replace("JSESSIONID=", "")),
                          (y = S.match(/ticketID=\w+/g)[0].replace(
                            "ticketID=",
                            ""
                          )),
                          (C = S.match(/Comment=\w+/g)[0].replace(
                            "Comment=",
                            ""
                          )),
                          (m = S.match(/UID=\w+/g)[0].replace("UID=", "")))
                        : ((h = I("JSESSIONID")),
                          (y = I("ticketID")),
                          (C = "SessionServer-unity"),
                          (m = I("UID"))),
                      (b = {
                        jsessionid: h,
                        ticketId: y,
                        comment: C,
                        path: "/",
                        uid: m,
                      }),
                      (_ = new Date().getTime()),
                      (N = o.phoneNumber),
                      (x = BasicService_H5module.encryptByAES(
                        "".concat(N, "#").concat(_)
                      )),
                      (B = BasicService_H5module.CryptoJS.MD5(x).toString()),
                      (k = "".concat(h, "#").concat(_, "#").concat(B)),
                      (T = BasicService_H5module.encryptByAES(k)),
                      (D = s(
                        s({}, v),
                        {},
                        {
                          header: {
                            "X-APP-JWT": T,
                            appSession: JSON.stringify(b),
                            "Content-Type": "application/json",
                          },
                        }
                      )),
                      CMCCService_logger.log("监控上报逻辑，newBody:", D),
                      (M = BasicService_H5module.encryptByAES(
                        JSON.stringify(D)
                      )),
                      (O = JSON.stringify({ encryptData: M })),
                      (A = { method: "POST", body: O }),
                      CMCCService_logger.log("监控上报逻辑，大入参options:", A),
                      fetch(
                        "https://wx.10086.cn/wmhnewcenter/86app-service/monitor/report",
                        A
                      )),
                    (e.next = 17);
                  break;
                case 14:
                  (e.prev = 14),
                    (e.t0 = e.catch(1)),
                    CMCCService_logger.log("监控上报逻辑，catch Error:", e.t0);
                case 17:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[1, 14]]
        );
      })
    )).apply(this, arguments);
  }
  var x = navigator.userAgent.indexOf("leadeon") > -1;
  function B() {
    return ((65536 * (1 + Math.random())) | 0).toString(16).substring(1);
  }
  function k(e) {
    var t = "0123456789";
    arguments.length > 1 &&
      void 0 !== arguments[1] &&
      arguments[1] &&
      (t += "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
    for (var r = "", n = 0; n < e; n++)
      r += t[Math.floor(Math.random() * t.length)];
    return r;
  }
  function I(e) {
    for (var t = document.cookie.split("; "), r = 0; r < t.length; r++) {
      var n = t[r].split("=");
      if (n[0] == e) return decodeURI(n[1]);
    }
    return "";
  }
  var T = (function () {
      return o(
        function e() {
          n(this, e), (this.locked = !1), (this.queue = []);
        },
        [
          {
            key: "lock",
            value: function (e) {
              if (!this.locked)
                return (this.locked = !0), void e.call(null, null);
              this.queue.push(e);
            },
          },
          {
            key: "unlock",
            value: function () {
              this.queue.length > 0
                ? this.queue.shift().call(null, null)
                : (this.locked = !1);
            },
          },
        ]
      );
    })(),
    D = new Map();
  function M(e) {
    var t = D.get(e);
    return t || ((t = new T()), D.set(e, t)), t;
  }
  function O(e) {
    var t =
      arguments.length > 2 && void 0 !== arguments[2]
        ? arguments[2]
        : "default";
    return arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
      ? function (r) {
          return new Promise(function (n, o) {
            M(t).lock(function () {
              e.call(
                null,
                s(
                  s({}, r),
                  {},
                  {
                    success: function (e) {
                      n(e), M(t).unlock();
                    },
                    error: function (e) {
                      o(e), M(t).unlock();
                    },
                  }
                )
              );
            });
          });
        }
      : function (t) {
          return new Promise(function (r, n) {
            e(
              s(
                s({}, t),
                {},
                {
                  success: function (e) {
                    r(e);
                  },
                  error: function (e) {
                    n(e);
                  },
                }
              )
            );
          });
        };
  }
  function A() {
    return (A = r(
      u().mark(function e(t) {
        var r, n, o, i, a, c;
        return u().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (
                    ((e.prev = 0),
                    (t = "CMCCSERVICE_".concat(t)),
                    (r = te()),
                    !(
                      Number(
                        String(r.version).split(".").splice(0, 3).join("")
                      ) > 810
                    ))
                  ) {
                    e.next = 23;
                    break;
                  }
                  if (R("__testGetBug__"))
                    for (n = Number(L("__testGetBug__")), o = 0; o < n; o++)
                      cmcc.getDataFromNative({
                        debug: !1,
                        key: t,
                        success: function (e) {
                          window.CMCCService_getCount =
                            window.CMCCService_getCount + 1;
                        },
                        error: function (e) {
                          window.CMCCService_getCount =
                            window.CMCCService_getCount + 1;
                        },
                      });
                  return (
                    (i = new Date().getTime()),
                    (e.next = 9),
                    O(
                      cmcc.getDataFromNative,
                      !0,
                      "getDataFromNative"
                    )({ debug: !1, key: t })
                  );
                case 9:
                  if (
                    ((a = e.sent),
                    (c = new Date().getTime() - i),
                    CMCCService_logger.log("获取原生缓存耗时", t, c),
                    c >= 1e3 &&
                      c < 5e3 &&
                      _({
                        serviceName: "缓存获取耗时超1秒",
                        serviceDesc: "缓存获取耗时超1秒",
                        userInfo: r,
                        result: "success",
                        rt: c,
                      }),
                    c >= 5e3 &&
                      c < 1e4 &&
                      _({
                        serviceName: "缓存获取耗时超5秒",
                        serviceDesc: "缓存获取耗时超5秒",
                        userInfo: r,
                        result: "success",
                        rt: c,
                      }),
                    c >= 1e4 &&
                      _({
                        serviceName: "缓存获取耗时超10秒",
                        serviceDesc: "缓存获取耗时超10秒",
                        userInfo: r,
                        result: "success",
                        rt: c,
                      }),
                    CMCCService_logger.log("获取原生缓存成功", {
                      key: t,
                      value: a.value || "",
                    }),
                    "--" !== a.value)
                  ) {
                    e.next = 20;
                    break;
                  }
                  return e.abrupt("return", "");
                case 20:
                  return e.abrupt("return", a.value || "");
                case 21:
                  e.next = 24;
                  break;
                case 23:
                  return e.abrupt("return", "");
                case 24:
                  e.next = 30;
                  break;
                case 26:
                  return (
                    (e.prev = 26),
                    (e.t0 = e.catch(0)),
                    CMCCService_logger.error("获取原生缓存失败", e.t0),
                    e.abrupt("return", "")
                  );
                case 30:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[0, 26]]
        );
      })
    )).apply(this, arguments);
  }
  function E() {
    return (E = r(
      u().mark(function e(t, r) {
        var n, o, i, a, c;
        return u().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (
                    ((e.prev = 0),
                    (t = "CMCCSERVICE_".concat(t)),
                    "" === r && (r = "--"),
                    (n = te()),
                    !(
                      Number(
                        String(n.version).split(".").splice(0, 3).join("")
                      ) > 810
                    ))
                  ) {
                    e.next = 16;
                    break;
                  }
                  if (R("__testSetBug__"))
                    for (o = Number(L("__testSetBug__")), i = 0; i < o; i++)
                      cmcc.saveDataToNative({
                        debug: !1,
                        key: t,
                        value: r,
                        success: function (e) {
                          window.CMCCService_setCount =
                            window.CMCCService_setCount + 1;
                        },
                        error: function (e) {
                          window.CMCCService_setCount =
                            window.CMCCService_setCount + 1;
                        },
                      });
                  return (
                    (a = new Date().getTime()),
                    (e.next = 10),
                    O(
                      cmcc.saveDataToNative,
                      !0,
                      "saveDataToNative"
                    )({ debug: !1, key: t, value: r })
                  );
                case 10:
                  (c = new Date().getTime() - a),
                    CMCCService_logger.log("设置原生缓存耗时", t, c),
                    c >= 1e3 &&
                      c < 5e3 &&
                      _({
                        serviceName: "缓存设置耗时超1秒",
                        serviceDesc: "缓存设置耗时超1秒",
                        userInfo: n,
                        result: "success",
                        rt: c,
                      }),
                    c >= 5e3 &&
                      c < 1e4 &&
                      _({
                        serviceName: "缓存设置耗时超5秒",
                        serviceDesc: "缓存设置耗时超5秒",
                        userInfo: n,
                        result: "success",
                        rt: c,
                      }),
                    c >= 1e4 &&
                      _({
                        serviceName: "缓存设置耗时超10秒",
                        serviceDesc: "缓存设置耗时超10秒",
                        userInfo: n,
                        result: "success",
                        rt: c,
                      }),
                    CMCCService_logger.log("设置原生缓存成功", {
                      key: t,
                      value: r,
                    });
                case 16:
                  e.next = 21;
                  break;
                case 18:
                  (e.prev = 18),
                    (e.t0 = e.catch(0)),
                    CMCCService_logger.error("设置原生缓存失败", e.t0);
                case 21:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[0, 18]]
        );
      })
    )).apply(this, arguments);
  }
  function P(e) {
    return Promise.race([
      new Promise(function (t, r) {
        (function (e) {
          return A.apply(this, arguments);
        })(e).then(function (e) {
          t(e);
        });
      }),
      new Promise(function (e, t) {
        setTimeout(function () {
          e("");
        }, 1e3);
      }),
    ]);
  }
  function j(e, t) {
    return Promise.race([
      new Promise(function (r, n) {
        (function (e, t) {
          return E.apply(this, arguments);
        })(e, t).then(function () {
          r();
        });
      }),
      new Promise(function (e, t) {
        setTimeout(function () {
          e("");
        }, 1e3);
      }),
    ]);
  }
  function L(e) {
    var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)", "i"),
      r = window.location.search.substring(1).match(t);
    return null === r ? null : decodeURIComponent(r[2]);
  }
  function R(e) {
    var t = l(
      (arguments.length > 1 && void 0 !== arguments[1]
        ? arguments[1]
        : location.search
      ).split("?"),
      2
    )[1];
    return (void 0 === t ? "" : t)
      .split("&")
      .map(function (e) {
        return e.split("=")[0];
      })
      .includes(e);
  }
  function U(e) {
    return new Promise(function (t, r) {
      setTimeout(function () {
        r("timeout:" + e);
      }, e);
    });
  }
  function z(e, t) {
    (e = e.toString()), (t = t.toString());
    for (
      var r = 0,
        n = 0,
        o = function (e, t) {
          for (var r = t; "." !== e[r] && r < e.length; ) r++;
          return r;
        };
      r < e.length && n < t.length;

    ) {
      var i = o(e, r),
        a = o(t, n),
        c = +e.substr(r, i - r),
        s = +t.substr(n, a - n);
      if (c !== s) return c > s ? -1 : 1;
      (r = i + 1), (n = a + 1);
    }
    for (; r < e.length; ) {
      var u = o(e, r);
      if (+e.substr(r, u - r) > 0) return -1;
      r = u + 1;
    }
    for (; n < t.length; ) {
      var l = o(t, n);
      if (+t.substr(n, l - n) > 0) return 1;
      n = l + 1;
    }
    return 0;
  }
  function F(e) {
    var t = e.key,
      r = e.reqBody;
    CMCCService_logger.log("processBill，key", t);
    var n = ["B_getNewBills", "B_getAccoutInfo"].includes(t),
      o = t,
      i = t,
      a = te(),
      c = Number(String(a.version).split(".").splice(0, 3).join(""));
    if ((CMCCService_logger.log("processBill，v", c), n))
      try {
        for (var s = new Date(), u = [], l = 0; l < 13; l++) {
          var f =
            s.getFullYear() +
            "-" +
            (s.getMonth() + 1).toString().padStart(2, "0");
          u.push(f), s.setMonth(s.getMonth() - 1);
        }
        var p = u.indexOf(r.endMonth);
        p > 0 && (i = "".concat(t, "_").concat(p)),
          1 === p
            ? (o = "".concat(t, "_1"))
            : p > 1 && (o = "".concat(t, "_2"));
      } catch (g) {
        CMCCService_logger.log("processBill，error", t, r, JSON.stringify(g));
      }
    return { configKey: o, dataKey: i };
  }
  function J(e) {
    return H.apply(this, arguments);
  }
  function H() {
    return (H = r(
      u().mark(function e(t) {
        var r, n, o, i, a, c, s, l, f, p, g, d, v, h, y, C, m;
        return u().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  return (
                    (r = t.key),
                    (n = t.reqBody),
                    (o = F({ key: r, reqBody: n })),
                    (i = o.configKey),
                    (a = o.dataKey),
                    CMCCService_logger.log("load，configKey, dataKey", i, a),
                    (c = te()),
                    (e.next = 6),
                    ue({ debug: !1, state: "1" })
                  );
                case 6:
                  return (
                    (s = e.sent),
                    CMCCService_logger.log("load，服务功能配置", s),
                    (e.prev = 8),
                    (l = new Date().getTime()),
                    (e.next = 12),
                    P(a)
                  );
                case 12:
                  if (((f = e.sent), (p = new Date().getTime() - l), !f)) {
                    e.next = 52;
                    break;
                  }
                  if (
                    (CMCCService_logger.log("load，有缓存数据", i, a),
                    (g = JSON.parse(f)),
                    (d = new Date(g.time).toDateString()),
                    (v = new Date().toDateString()),
                    d === v)
                  ) {
                    e.next = 23;
                    break;
                  }
                  return (e.next = 22), Q();
                case 22:
                case 28:
                case 34:
                case 40:
                case 46:
                case 61:
                  return e.abrupt("return", "");
                case 23:
                  if (
                    (h = BasicService_H5module.CryptoJS.MD5(
                      JSON.stringify(n)
                    ).toString()) === g.params
                  ) {
                    e.next = 29;
                    break;
                  }
                  return (
                    CMCCService_logger.log(
                      "load，接口入参有变更，清缓存，新+旧",
                      h,
                      g.params
                    ),
                    (e.next = 28),
                    j(a, "")
                  );
                case 29:
                  if (
                    (y = BasicService_H5module.CryptoJS.MD5(
                      c.phoneNumber
                    ).toString()) === g.tel
                  ) {
                    e.next = 35;
                    break;
                  }
                  return (
                    CMCCService_logger.log(
                      "load，客户端切换登录手机号，清缓存，新+旧",
                      y,
                      g.tel
                    ),
                    (e.next = 34),
                    j(a, "")
                  );
                case 35:
                  if ((C = s.extInfo.cacheTimes[i]) === g.lastCacheLong) {
                    e.next = 41;
                    break;
                  }
                  return (
                    CMCCService_logger.log(
                      "load，该接口最近两次配置的缓存时间有变动，清缓存，新+旧",
                      C,
                      g.lastCacheLong
                    ),
                    (e.next = 40),
                    j(a, "")
                  );
                case 41:
                  if (!((m = Date.now()) > 1e3 * C + g.time)) {
                    e.next = 47;
                    break;
                  }
                  return (
                    CMCCService_logger.log(
                      "load，过期，清缓存，当前时间戳、缓存时间戳、缓存时间（秒）",
                      m,
                      g.time,
                      C
                    ),
                    (e.next = 46),
                    j(a, "")
                  );
                case 47:
                  return (
                    CMCCService_logger.log("load，走缓存数据", g.data),
                    _({
                      serviceName: "接口命中缓存",
                      serviceDesc: "接口命中缓存，走缓存透传",
                      userInfo: c,
                      result: "success",
                      rt: p,
                    }),
                    e.abrupt("return", g.data)
                  );
                case 52:
                  return (
                    CMCCService_logger.log("load，无缓存", i, a),
                    e.abrupt("return", "")
                  );
                case 54:
                  e.next = 62;
                  break;
                case 56:
                  return (
                    (e.prev = 56),
                    (e.t0 = e.catch(8)),
                    CMCCService_logger.log(
                      "load，取缓存异常代码不中断，清空所有接口缓存，e:",
                      e.t0
                    ),
                    (e.next = 61),
                    j(a, "")
                  );
                case 62:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[8, 56]]
        );
      })
    )).apply(this, arguments);
  }
  function q() {
    return (q = r(
      u().mark(function e(t) {
        var r, n, o, i, a, c, s, l, f, p;
        return u().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (
                    ((r = t.key),
                    (n = t.data),
                    (o = t.reqBody),
                    CMCCService_logger.log("save，方法开始", r, n, o),
                    (i = F({ key: r, reqBody: o })),
                    (a = i.configKey),
                    (c = i.dataKey),
                    CMCCService_logger.log("save，configKey, dataKey", a, c),
                    (s = te()),
                    (e.prev = 5),
                    "000000" !== n.retCode)
                  ) {
                    e.next = 21;
                    break;
                  }
                  return (
                    CMCCService_logger.log("save，报文符合000000"),
                    (e.next = 10),
                    ue({ debug: !1, state: "1" })
                  );
                case 10:
                  if (
                    ((l = e.sent),
                    CMCCService_logger.log("save，服务功能配置", l),
                    (f = l.extInfo.cacheTimes[a] || 0),
                    CMCCService_logger.log(
                      "save，服务功能配置，接口缓存时长",
                      f
                    ),
                    !(f > 0))
                  ) {
                    e.next = 21;
                    break;
                  }
                  return (
                    CMCCService_logger.log(
                      "save，服务功能配置，接口缓存时长大于0，开始存入缓存"
                    ),
                    (p = {
                      tel: BasicService_H5module.CryptoJS.MD5(
                        s.phoneNumber
                      ).toString(),
                      time: Date.now(),
                      data: n,
                      lastCacheLong: f,
                      params: BasicService_H5module.CryptoJS.MD5(
                        JSON.stringify(o)
                      ).toString(),
                    }),
                    CMCCService_logger.log(
                      "save，服务功能配置，接口缓存时长大于0，要存入报文打印",
                      p
                    ),
                    (e.next = 20),
                    j(c, JSON.stringify(p))
                  );
                case 20:
                  _({
                    serviceName: "接口缓存存储成功",
                    serviceDesc: "接口缓存存储成功",
                    userInfo: s,
                    result: "success",
                    rt: 0,
                  });
                case 21:
                  e.next = 29;
                  break;
                case 23:
                  return (
                    (e.prev = 23),
                    (e.t0 = e.catch(5)),
                    CMCCService_logger.log(
                      "save，缓存设置失败，清空缓存，e:",
                      e.t0
                    ),
                    (e.next = 28),
                    Q()
                  );
                case 28:
                  _({
                    serviceName: "接口缓存存储失败",
                    serviceDesc: "接口缓存存储失败",
                    userInfo: s,
                    result: "failed",
                    rt: 0,
                  });
                case 29:
                  return e.abrupt("return", n);
                case 30:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[5, 23]]
        );
      })
    )).apply(this, arguments);
  }
  function Q() {
    return K.apply(this, arguments);
  }
  function K() {
    return (K = r(
      u().mark(function e() {
        var t, r, n, o;
        return u().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  (e.prev = 0), (t = i(d)), (e.prev = 2), t.s();
                case 4:
                  if ((r = t.n()).done) {
                    e.next = 10;
                    break;
                  }
                  return (
                    (n = r.value),
                    (e.next = 8),
                    j("B_".concat(n.functionName), "")
                  );
                case 8:
                  e.next = 4;
                  break;
                case 10:
                  e.next = 15;
                  break;
                case 12:
                  (e.prev = 12), (e.t0 = e.catch(2)), t.e(e.t0);
                case 15:
                  return (e.prev = 15), t.f(), e.finish(15);
                case 18:
                  o = 1;
                case 19:
                  if (!(o < 13)) {
                    e.next = 27;
                    break;
                  }
                  return (e.next = 22), j("B_getNewBills_".concat(o), "");
                case 22:
                  return (e.next = 24), j("B_getAccoutInfo_".concat(o), "");
                case 24:
                  o++, (e.next = 19);
                  break;
                case 27:
                  e.next = 32;
                  break;
                case 29:
                  (e.prev = 29),
                    (e.t1 = e.catch(0)),
                    CMCCService_logger.log(
                      "remove，清空所有缓存报错 error",
                      e.t1
                    );
                case 32:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [
            [0, 29],
            [2, 12, 15, 18],
          ]
        );
      })
    )).apply(this, arguments);
  }
  var G = null,
    V = null,
    Y = "cmcc_service_module_config_manager_key",
    X = "cmcc_service_module_patch_key",
    Z =
      navigator.userAgent.toLowerCase() &&
      navigator.userAgent.toLowerCase().includes("android"),
    $ = null,
    W = navigator.userAgent.indexOf("leadeon") > -1,
    ee = {
      defaultConfigFlag: "默认配置标识",
      switchFlag: "false",
      busCodes: [],
      reportRatio: 0,
      cacheTime: 0,
      extInfo: {
        busCodes: [],
        cacheTimes: {
          B_gsmState: 0,
          B_getRealFee: 0,
          B_getNewPlanRemainQry: 0,
          B_getPayFeesQueryInfo: 0,
          B_getNewBills: 0,
          B_getNewBills_1: 0,
          B_getNewBills_2: 0,
          B_getScoreQuery: 0,
          B_getUserInformation: 0,
          B_getBillCustInfoQry: 0,
          B_getAuthorizeSyn: 0,
          B_getAuthorizeStatus: 0,
          B_getAccoutInfo: 0,
          B_getAccoutInfo_1: 0,
          B_getAccoutInfo_2: 0,
          B_getBandNewBills: 0,
          B_getUserPlanQryNew: 0,
          B_getDayFlowInfo: 0,
          B_getPersonalInfo: 0,
          B_getUserShareInfo: 0,
          B_getFlowInfoQryOld: 0,
          B_getHisComboMealResource: 0,
          B_getNewDetail: 0,
          B_getUserPlanType: 0,
          B_getUnifyQuery: 0,
          B_getNewQueryBusiness: 0,
          B_qryOrderedBusiness: 0,
          B_getQueryBusiness: 0,
          B_qryBindedBusiness: 0,
          B_getSmsCode: 0,
          B_getUnifyCancel: 0,
          B_updatePlan: 0,
          B_getDetail: 0,
          B_billCustInfoOrder: 0,
          B_getDefaultInfoQry: 0,
          B_contractTdAuth: 0,
          B_contractTd: 0,
        },
        sdkClose: W ? "false" : "true",
        telList: "",
      },
    };
  function te() {
    return G;
  }
  function re() {
    var e = new Date(),
      t = e.getFullYear(),
      r = String(e.getMonth() + 1).padStart(2, "0"),
      n = String(e.getDate()).padStart(2, "0"),
      o = String(e.getHours()).padStart(2, "0"),
      i = String(e.getMinutes()).padStart(2, "0"),
      a = String(e.getSeconds()).padStart(2, "0");
    return ""
      .concat(t, "-")
      .concat(r, "-")
      .concat(n, " ")
      .concat(o, ":")
      .concat(i, ":")
      .concat(a);
  }
  function ne(e) {
    return oe.apply(this, arguments);
  }
  function oe() {
    return (oe = r(
      u().mark(function e(t) {
        var r;
        return u().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  return (e.prev = 0), (e.next = 3), P(t);
                case 3:
                  return (
                    (r = e.sent) && (r = JSON.parse(r)), e.abrupt("return", r)
                  );
                case 8:
                  return (
                    (e.prev = 8), (e.t0 = e.catch(0)), e.abrupt("return", null)
                  );
                case 11:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[0, 8]]
        );
      })
    )).apply(this, arguments);
  }
  function ie(e, t) {
    j(e, JSON.stringify(t));
  }
  var ae = function () {
      return W && $ ? O($.networkBackup, !0, "networkBackup") : function () {};
    },
    ce = (function () {
      var e = r(
        u().mark(function e(t) {
          var r, n, o, i;
          return u().wrap(function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (
                    (CMCCService_logger.log("configManager 调用补丁方案", t),
                    "1" !== (t.state || "1"))
                  ) {
                    e.next = 22;
                    break;
                  }
                  return (e.next = 5), ne(X);
                case 5:
                  if (
                    ((r = e.sent),
                    (n = BasicService_H5module.CryptoJS.MD5(
                      te().phoneNumber
                    ).toString()),
                    CMCCService_logger.log(
                      "configManager 补丁方案内部",
                      re(),
                      n,
                      r
                    ),
                    !(r && r.exDura && re() < r.exDura && r.userId === n))
                  ) {
                    e.next = 13;
                    break;
                  }
                  return (
                    CMCCService_logger.log("configManager 补丁方案从缓存拿"),
                    e.abrupt("return", r)
                  );
                case 13:
                  return (e.next = 15), ae()({ state: "2" });
                case 15:
                  return (
                    ((o = e.sent).userId = BasicService_H5module.CryptoJS.MD5(
                      te().phoneNumber
                    ).toString()),
                    CMCCService_logger.log(
                      "configManager 补丁方案从强制更新拿",
                      o
                    ),
                    ie(X, o),
                    e.abrupt("return", o)
                  );
                case 20:
                  e.next = 29;
                  break;
                case 22:
                  return (e.next = 24), ae()({ state: "2" });
                case 24:
                  return (
                    ((i = e.sent).userId = BasicService_H5module.CryptoJS.MD5(
                      te().phoneNumber
                    ).toString()),
                    CMCCService_logger.log(
                      "configManager 补丁方案原本强制更新拿",
                      i
                    ),
                    ie(X, i),
                    e.abrupt("return", i)
                  );
                case 29:
                case "end":
                  return e.stop();
              }
          }, e);
        })
      );
      return function (t) {
        return e.apply(this, arguments);
      };
    })();
  function se() {
    var e = Number(String(G.version).split(".").splice(0, 3).join(""));
    return Z && e < 1170
      ? (CMCCService_logger.log("configManager 走补丁方案"), ce)
      : (CMCCService_logger.log("configManager 走端能力方案"), ae());
  }
  function ue() {
    return le.apply(this, arguments);
  }
  function le() {
    return (
      (le = r(
        u().mark(function e() {
          var t,
            n,
            o,
            i = arguments;
          return u().wrap(
            function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (
                      ((t = (
                        i.length > 0 && void 0 !== i[0] ? i[0] : { state: "1" }
                      ).state),
                      (e.prev = 2),
                      CMCCService_logger.log(
                        "fetchNetworkBackupConfig进入",
                        t,
                        "isTouch",
                        W
                      ),
                      W)
                    ) {
                      e.next = 6;
                      break;
                    }
                    return e.abrupt("return", ee);
                  case 6:
                    if ("1" !== t || !V) {
                      e.next = 9;
                      break;
                    }
                    return (
                      CMCCService_logger.log(
                        "fetchNetworkBackupConfig 直接返globalConfig",
                        V
                      ),
                      e.abrupt("return", V)
                    );
                  case 9:
                    if (
                      ((n = Number(
                        String(G.version).split(".").splice(0, 3).join("")
                      )),
                      CMCCService_logger.log("version", n),
                      !(n < 860))
                    ) {
                      e.next = 14;
                      break;
                    }
                    return (
                      CMCCService_logger.log(
                        "fetchNetworkBackupConfig app版本不满足"
                      ),
                      e.abrupt("return", ee)
                    );
                  case 14:
                    if (
                      ($ = Boolean(window.cmcc)
                        ? window.cmcc
                        : window.leadeon) &&
                      $.networkBackup
                    ) {
                      e.next = 18;
                      break;
                    }
                    return (
                      CMCCService_logger.log(
                        "fetchNetworkBackupConfig jsBridge.networkBackup 空"
                      ),
                      e.abrupt("return", ee)
                    );
                  case 18:
                    return (
                      (e.next = 20),
                      C(
                        "fetchNetworkBackupConfig@" + t,
                        r(
                          u().mark(function e() {
                            var r, n, o, i;
                            return u().wrap(
                              function (e) {
                                for (;;)
                                  switch ((e.prev = e.next)) {
                                    case 0:
                                      return (
                                        (e.prev = 0),
                                        (e.next = 3),
                                        Promise.race([
                                          se()({ state: t }),
                                          U(3e3),
                                        ])
                                      );
                                    case 3:
                                      if (
                                        ((r = e.sent),
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig",
                                          r
                                        ),
                                        !r || !r.extInfo)
                                      ) {
                                        e.next = 25;
                                        break;
                                      }
                                      try {
                                        r.extInfo.cacheTimes &&
                                        "string" == typeof r.extInfo.cacheTimes
                                          ? (r.extInfo.cacheTimes = JSON.parse(
                                              r.extInfo.cacheTimes
                                            ))
                                          : (r.extInfo.cacheTimes =
                                              ee.extInfo.cacheTimes);
                                      } catch (a) {
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig cacheTimes error",
                                          r
                                        ),
                                          (r.extInfo.cacheTimes =
                                            ee.extInfo.cacheTimes);
                                      }
                                      try {
                                        r.extInfo.busCodes &&
                                        "string" == typeof r.extInfo.busCodes
                                          ? (r.extInfo.busCodes = JSON.parse(
                                              r.extInfo.busCodes
                                            ))
                                          : (r.extInfo.busCodes =
                                              ee.extInfo.busCodes);
                                      } catch (a) {
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig busCodes error",
                                          r
                                        ),
                                          (r.extInfo.busCodes =
                                            ee.extInfo.busCodes);
                                      }
                                      return (V = r), (e.next = 11), ne(Y);
                                    case 11:
                                      if (
                                        ((n = e.sent),
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig getConfigFromStorage",
                                          {
                                            storageCacheConfig: n,
                                            globalConfig: V,
                                          }
                                        ),
                                        !n || n.switchFlag === V.switchFlag)
                                      ) {
                                        e.next = 20;
                                        break;
                                      }
                                      return (
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig 容灾配置总开关发生变化，清空所有服务接口接口缓存"
                                        ),
                                        (o = Date.now()),
                                        (e.next = 18),
                                        Q()
                                      );
                                    case 18:
                                      (i = Date.now()),
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig 清空所有服务接口接口缓存耗时",
                                          i - o
                                        );
                                    case 20:
                                      return (
                                        ie(Y, V),
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig实际返回",
                                          V
                                        ),
                                        e.abrupt("return", V)
                                      );
                                    case 25:
                                      return (
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig返回数据空"
                                        ),
                                        e.abrupt("return", ee)
                                      );
                                    case 27:
                                      e.next = 33;
                                      break;
                                    case 29:
                                      return (
                                        (e.prev = 29),
                                        (e.t0 = e.catch(0)),
                                        CMCCService_logger.log(
                                          "callNetworkBackupConfig异常",
                                          e.t0
                                        ),
                                        e.abrupt("return", ee)
                                      );
                                    case 33:
                                    case "end":
                                      return e.stop();
                                  }
                              },
                              e,
                              null,
                              [[0, 29]]
                            );
                          })
                        )
                      )
                    );
                  case 20:
                    return (
                      (o = e.sent),
                      CMCCService_logger.log(
                        "fetchNetworkBackupConfig请求返回",
                        o
                      ),
                      e.abrupt("return", o)
                    );
                  case 25:
                    return (
                      (e.prev = 25),
                      (e.t0 = e.catch(2)),
                      CMCCService_logger.log(
                        "fetchNetworkBackupConfig error",
                        e.t0
                      ),
                      e.abrupt("return", ee)
                    );
                  case 29:
                  case "end":
                    return e.stop();
                }
            },
            e,
            null,
            [[2, 25]]
          );
        })
      )),
      le.apply(this, arguments)
    );
  }
  function fe(e) {
    return pe.apply(this, arguments);
  }
  function pe() {
    return (
      (pe = r(
        u().mark(function e(t) {
          var n, o, i, a, c, s, l;
          return u().wrap(function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (
                    ((l = function () {
                      return (l = r(
                        u().mark(function e() {
                          var t, r, s, l, f, p, g, d;
                          return u().wrap(
                            function (e) {
                              for (;;)
                                switch ((e.prev = e.next)) {
                                  case 0:
                                    if (
                                      ((t = c.switchFlag),
                                      (r = c.extInfo),
                                      (s = r ? r.busCodes : []),
                                      (l = (r && r.telList) || ""),
                                      (f =
                                        "true" === t &&
                                        (!s ||
                                          Boolean(
                                            s.find(function (e) {
                                              return String(e) === n;
                                            })
                                          ))),
                                      (p = l && l.includes(te().phoneNumber)),
                                      CMCCService_logger.log(
                                        "networkBackup 容灾判定",
                                        n,
                                        a,
                                        Boolean(f || p)
                                      ),
                                      (e.prev = 6),
                                      !f && !p)
                                    ) {
                                      e.next = 20;
                                      break;
                                    }
                                    return (e.prev = 8), (e.next = 11), i();
                                  case 11:
                                    return (
                                      (g = e.sent),
                                      CMCCService_logger.log(
                                        "networkBackup 容灾业务接口调用",
                                        n,
                                        a,
                                        g
                                      ),
                                      e.abrupt("return", g)
                                    );
                                  case 16:
                                    return (
                                      (e.prev = 16),
                                      (e.t0 = e.catch(8)),
                                      CMCCService_logger.log(
                                        "networkBackup 容灾业务接口调用 error",
                                        n,
                                        a,
                                        e.t0
                                      ),
                                      e.abrupt("return", {
                                        data: {
                                          retCode: "999999",
                                          retDesc: "请求无法受理，请稍后再试!",
                                          message: "容灾业务接口调用异常",
                                        },
                                        needSave: !1,
                                      })
                                    );
                                  case 20:
                                    return (e.next = 22), o();
                                  case 22:
                                    return (
                                      (d = e.sent),
                                      CMCCService_logger.log(
                                        "networkBackup 容灾主接口调用",
                                        n,
                                        a,
                                        d
                                      ),
                                      e.abrupt("return", d)
                                    );
                                  case 27:
                                    throw (
                                      ((e.prev = 27),
                                      (e.t1 = e.catch(6)),
                                      CMCCService_logger.log(
                                        "networkBackup",
                                        f || p
                                          ? "容灾业务接口调用异常"
                                          : "主接口调用异常",
                                        n,
                                        a
                                      ),
                                      e.t1)
                                    );
                                  case 31:
                                  case "end":
                                    return e.stop();
                                }
                            },
                            e,
                            null,
                            [
                              [6, 27],
                              [8, 16],
                            ]
                          );
                        })
                      )).apply(this, arguments);
                    }),
                    (s = function () {
                      return l.apply(this, arguments);
                    }),
                    (n = t.interfaceCode),
                    (o = t.mainInterface),
                    (i = t.backupInterface),
                    "string" == typeof n)
                  ) {
                    e.next = 5;
                    break;
                  }
                  throw new Error("interfaceCode应为string类型");
                case 5:
                  return (
                    (a = "1"),
                    CMCCService_logger.log("networkBackup 容灾调用", a, n),
                    (e.next = 9),
                    ue({ state: a })
                  );
                case 9:
                  return (
                    (c = e.sent),
                    CMCCService_logger.log(
                      "networkBackup 拉取到的容灾配置",
                      a,
                      n,
                      c
                    ),
                    (e.next = 13),
                    s()
                  );
                case 13:
                  return e.abrupt("return", e.sent);
                case 14:
                case "end":
                  return e.stop();
              }
          }, e);
        })
      )),
      pe.apply(this, arguments)
    );
  }
  var ge = function (e) {
    var t = e.ITModule,
      n = e.serviceName,
      o = e.serviceDesc;
    return function (e) {
      var i = e.userInfo,
        a = e.reqBody,
        c = e.contentType,
        l = e.allTime;
      return new Promise(
        (function () {
          var e = r(
            u().mark(function e(r, f) {
              var p, g;
              return u().wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      (p = new Date().getTime()),
                        (g = {
                          userInfo: i,
                          reqBody: a,
                          success: function (e) {
                            CMCCService_logger.log(
                              "IT接口返回，success回调",
                              e
                            );
                            var t = new Date().getTime() - p;
                            r({ data: e, needSave: !0, allTime: l }),
                              "000000" === e.retCode
                                ? (CMCCService_logger.log(
                                    "IT接口返回，000000，监控上报:success"
                                  ),
                                  _({
                                    serviceName: n,
                                    serviceDesc: o,
                                    userInfo: i,
                                    result: "success",
                                    rt: t,
                                  }))
                                : (CMCCService_logger.log(
                                    "IT接口返回，非000000，监控上报:failed"
                                  ),
                                  _({
                                    serviceName: n,
                                    serviceDesc: o,
                                    userInfo: i,
                                    result: "failed",
                                    rt: t,
                                    failCode: e.retCode,
                                  }));
                          },
                          error: function (e) {
                            CMCCService_logger.log("IT接口返回，error回调", e);
                            var t = new Date().getTime() - p;
                            f(e),
                              CMCCService_logger.log(
                                "IT接口返回，error回调，监控上报:failed"
                              ),
                              _({
                                serviceName: n,
                                serviceDesc: o,
                                userInfo: i,
                                result: "failed",
                                rt: t,
                              });
                          },
                        }),
                        c &&
                          ((g = s({ contentType: c }, g)),
                          CMCCService_logger.log(
                            "IT接口返回，params.contentType",
                            g.contentType,
                            o
                          )),
                        t(g);
                    case 4:
                    case "end":
                      return e.stop();
                  }
              }, e);
            })
          );
          return function (t, r) {
            return e.apply(this, arguments);
          };
        })()
      );
    };
  };
  function de() {
    return ve.apply(this, arguments);
  }
  function ve() {
    return (ve = r(
      u().mark(function e() {
        var t;
        return u().wrap(
          function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  return (e.prev = 0), (e.next = 3), ue({ state: "1" });
                case 3:
                  return (
                    (t = e.sent),
                    e.abrupt(
                      "return",
                      !(!t || !t.extInfo || "true" !== t.extInfo.sdkClose)
                    )
                  );
                case 7:
                  return (
                    (e.prev = 7), (e.t0 = e.catch(0)), e.abrupt("return", !1)
                  );
                case 10:
                case "end":
                  return e.stop();
              }
          },
          e,
          null,
          [[0, 7]]
        );
      })
    )).apply(this, arguments);
  }
  R("__testGetBug__") && (window.CMCCService_getCount = 0),
    R("__testSetBug__") && (window.CMCCService_setCount = 0),
    (window.CMCCService_logger = {
      log: function () {
        var e;
        R("__debug__") && (e = console).log.apply(e, arguments);
      },
      error: function () {
        var e;
        R("__debug__") && (e = console).error.apply(e, arguments);
      },
    }),
    CMCCService_logger.log("当前环境与版本：prod1.1.14");
  var he = {},
    ye = (function () {
      var e = r(
        u().mark(function e(t) {
          var r, n, o, i, a, c, l, f, p, g, d, h, y, C;
          return u().wrap(function (e) {
            for (;;)
              switch ((e.prev = e.next)) {
                case 0:
                  if (
                    ((r = new Date().getTime()),
                    CMCCService_logger.log("前置流程，进入SDK", t),
                    (n = t.userInfo),
                    (o = t.reqBody),
                    (i = t.contentType),
                    (a = void 0 === i ? "" : i),
                    (c = t.interfaceCode),
                    (l = t.functionName),
                    (f = t.rzApi),
                    (p = t.serviceName),
                    (g = t.serviceDesc),
                    (l = v[l] || l),
                    (d = window.BasicService_H5module
                      ? window.BasicService_H5module[l]
                      : null))
                  ) {
                    e.next = 8;
                    break;
                  }
                  throw (
                    (CMCCService_logger.log(
                      "前置流程，it接口组件加载失败，ITModule",
                      d
                    ),
                    w("900001"))
                  );
                case 8:
                  if (n && o && "99999999999" !== n.phoneNumber) {
                    e.next = 11;
                    break;
                  }
                  throw (
                    (CMCCService_logger.log("前置流程，参数异常"), w("900005"))
                  );
                case 11:
                  return (G = n), (e.next = 14), de();
                case 14:
                  if (!e.sent) {
                    e.next = 23;
                    break;
                  }
                  return (
                    (h = { userInfo: n, reqBody: o }),
                    a &&
                      ((h = s({ contentType: a }, h)),
                      CMCCService_logger.log(
                        "前置流程，sdk sdkClose为真，走兜底透传，contentType",
                        h.contentType,
                        g
                      )),
                    (e.next = 20),
                    O(d)(h)
                  );
                case 20:
                  return (
                    (y = e.sent),
                    CMCCService_logger.log(
                      "前置流程，sdk sdkClose为真，走兜底透传，输出数据=======",
                      y
                    ),
                    e.abrupt("return", { data: y, needSave: !1, allTime: r })
                  );
                case 23:
                  return (e.next = 25), J({ key: "B_".concat(l), reqBody: o });
                case 25:
                  if (!(C = e.sent)) {
                    e.next = 29;
                    break;
                  }
                  return (
                    CMCCService_logger.log(
                      "前置流程，有缓存且生效，输出缓存数据=======",
                      C
                    ),
                    e.abrupt("return", { data: C, needSave: !1, allTime: r })
                  );
                case 29:
                  if (f) {
                    e.next = 32;
                    break;
                  }
                  return (
                    CMCCService_logger.log(
                      "前置流程，当前接口不存在容灾接口",
                      c,
                      l
                    ),
                    e.abrupt(
                      "return",
                      ge({ ITModule: d, serviceName: p, serviceDesc: g })({
                        userInfo: n,
                        reqBody: o,
                        contentType: a,
                        allTime: r,
                      })
                    )
                  );
                case 32:
                  return (
                    CMCCService_logger.log(
                      "前置流程，当前接口存在容灾接口",
                      c,
                      l
                    ),
                    (e.next = 35),
                    fe({
                      interfaceCode: c,
                      mainInterface: function () {
                        return ge({
                          ITModule: d,
                          serviceName: p,
                          serviceDesc: g,
                        })({
                          userInfo: n,
                          reqBody: o,
                          contentType: a,
                          allTime: r,
                        });
                      },
                      backupInterface: function () {
                        var e = "";
                        return (
                          n.token && (e = "?".concat(n.token)),
                          b({
                            url: "".concat(f).concat(e),
                            data: s(s({}, n), {}, { reqBody: o }),
                            allTime: r,
                          })
                        );
                      },
                    })
                  );
                case 35:
                  return e.abrupt("return", e.sent);
                case 36:
                case "end":
                  return e.stop();
              }
          }, e);
        })
      );
      return function (t) {
        return e.apply(this, arguments);
      };
    })();
  return (
    d.forEach(function (e) {
      var t = e.interfaceCode,
        r = e.functionName;
      t &&
        r &&
        (he[r] = function (n) {
          return ye(s(s({}, e), n))
            .then(function (e) {
              var o = e.data,
                i = e.needSave,
                a = void 0 !== i && i,
                c = e.allTime,
                u = void 0 === c ? "" : c;
              if (
                (CMCCService_logger.log(
                  "sdk （needSave）".concat(r, "最终输出数据======="),
                  a,
                  o
                ),
                a &&
                  (function (e) {
                    q.apply(this, arguments);
                  })({ key: "B_".concat(r), data: o, reqBody: n.reqBody }),
                u)
              ) {
                var l = new Date().getTime() - u;
                CMCCService_logger.log("sdk ".concat(r, "最终输出总耗时:"), l);
              }
              return (
                o.hasOwnProperty("isRZFetch") && o.isRZFetch
                  ? delete o.isRZFetch
                  : (function (e, t) {
                      try {
                        if (!e || !t) return;
                        if ("000000" !== t.retCode) return;
                        var r =
                            "https://h.app.coc.10086.cn/cache_server/api/cache/encrypt/reportV2",
                          n = te();
                        n.token && "0" !== n.token && (r = r + "?" + n.token);
                        var o = n.phoneNumber || "",
                          i = new Date().getTime(),
                          a = {
                            userId: o,
                            channelCode: 2,
                            interfaceCode: parseInt(e),
                            data: JSON.stringify(t),
                            timestamp: i,
                          };
                        b({
                          url: r,
                          data: s(
                            s({}, n),
                            {},
                            { reqBody: { reportList: [a] } }
                          ),
                          isPushHotCache: !0,
                        }).then(function (t) {
                          CMCCService_logger.log(
                            "热缓存上报逻辑，interfaceCode:",
                            e
                          );
                        });
                      } catch (c) {
                        CMCCService_logger.log(
                          "热缓存上报逻辑，catch Error:",
                          c
                        );
                      }
                    })(t, o),
                "20007" === t &&
                  (function (e) {
                    try {
                      if (!x) return;
                      var t = e.retCode,
                        r = e.rspBody,
                        n = te().phoneNumber,
                        o = "ios" === te().osType,
                        i = z("11.9.0", te().version) < 0,
                        a = z("11.9.6", te().version) < 0,
                        c = z("15", te().sv) < 0;
                      if (
                        i ||
                        (o && a && c) ||
                        "000000" !== t ||
                        !r ||
                        !n ||
                        !cmcc.operateNativeData
                      )
                        return;
                      var s = BasicService_H5module.CryptoJS.MD5(
                        "".concat(n, "_serviceModule_getUserInformation")
                      ).toString();
                      cmcc.operateNativeData({
                        debug: !1,
                        operate: "save",
                        key: s,
                        value: JSON.stringify(r),
                        success: function (e) {
                          CMCCService_logger.log(
                            "20007缓存成功:operateNativeData",
                            s
                          );
                        },
                        error: function (e) {
                          CMCCService_logger.log("20007缓存失败", e);
                        },
                      });
                    } catch (u) {
                      CMCCService_logger.error("20007缓存失败", u);
                    }
                  })(o),
                o
              );
            })
            .catch(function (e) {
              CMCCService_logger.log("sdk ".concat(r, "最终输出 catch e:"), e);
              try {
                window &&
                  window.__SKYNET &&
                  window.__SKYNET.send &&
                  window.__SKYNET.send(
                    JSON.stringify(e),
                    "cmccServiceModuleError"
                  );
              } catch (t) {}
              throw e;
            });
        });
    }),
    he
  );
})();
