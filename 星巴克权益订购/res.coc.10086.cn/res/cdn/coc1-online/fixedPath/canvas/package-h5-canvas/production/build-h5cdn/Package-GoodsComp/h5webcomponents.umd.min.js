(function (t, e) {
  "object" === typeof exports && "object" === typeof module
    ? (module.exports = e())
    : "function" === typeof define && define.amd
    ? define([], e)
    : "object" === typeof exports
    ? (exports["h5webcomponents"] = e())
    : (t["h5webcomponents"] = e());
})("undefined" !== typeof self ? self : this, function () {
  return (function (t) {
    var e = {};
    function n(r) {
      if (e[r]) return e[r].exports;
      var o = (e[r] = { i: r, l: !1, exports: {} });
      return t[r].call(o.exports, o, o.exports, n), (o.l = !0), o.exports;
    }
    return (
      (n.m = t),
      (n.c = e),
      (n.d = function (t, e, r) {
        n.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: r });
      }),
      (n.r = function (t) {
        "undefined" !== typeof Symbol &&
          Symbol.toStringTag &&
          Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
          Object.defineProperty(t, "__esModule", { value: !0 });
      }),
      (n.t = function (t, e) {
        if ((1 & e && (t = n(t)), 8 & e)) return t;
        if (4 & e && "object" === typeof t && t && t.__esModule) return t;
        var r = Object.create(null);
        if (
          (n.r(r),
          Object.defineProperty(r, "default", { enumerable: !0, value: t }),
          2 & e && "string" != typeof t)
        )
          for (var o in t)
            n.d(
              r,
              o,
              function (e) {
                return t[e];
              }.bind(null, o)
            );
        return r;
      }),
      (n.n = function (t) {
        var e =
          t && t.__esModule
            ? function () {
                return t["default"];
              }
            : function () {
                return t;
              };
        return n.d(e, "a", e), e;
      }),
      (n.o = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e);
      }),
      (n.p = ""),
      n((n.s = "16a4"))
    );
  })({
    "05fd": function (t, e, n) {
      t.exports = n("baa7")("native-function-to-string", Function.toString);
    },
    "065d": function (t, e, n) {
      var r = n("bb8b"),
        o = n("5edc");
      t.exports = n("26df")
        ? function (t, e, n) {
            return r.f(t, e, o(1, n));
          }
        : function (t, e, n) {
            return (t[e] = n), t;
          };
    },
    "065e": function (t, e) {
      t.exports =
        "constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(
          ","
        );
    },
    "0926": function (t, e) {
      t.exports = function (t) {
        try {
          return !!t();
        } catch (e) {
          return !0;
        }
      };
    },
    "0b34": function (t, e) {
      var n = (t.exports =
        "undefined" != typeof window && window.Math == Math
          ? window
          : "undefined" != typeof self && self.Math == Math
          ? self
          : Function("return this")());
      "number" == typeof __g && (__g = n);
    },
    "0c29": function (t, e) {
      e.f = Object.getOwnPropertySymbols;
    },
    "120f": function (t, e, n) {
      "use strict";
      var r = n("3d8a"),
        o = n("e99b"),
        i = n("84e8"),
        c = n("065d"),
        u = n("953d"),
        s = n("3460"),
        f = n("bac3"),
        a = n("addc"),
        p = n("839a")("iterator"),
        l = !([].keys && "next" in [].keys()),
        d = "@@iterator",
        b = "keys",
        v = "values",
        y = function () {
          return this;
        };
      t.exports = function (t, e, n, h, g, m, x) {
        s(n, e, h);
        var w,
          O,
          _,
          P = function (t) {
            if (!l && t in T) return T[t];
            switch (t) {
              case b:
                return function () {
                  return new n(this, t);
                };
              case v:
                return function () {
                  return new n(this, t);
                };
            }
            return function () {
              return new n(this, t);
            };
          },
          S = e + " Iterator",
          j = g == v,
          I = !1,
          T = t.prototype,
          E = T[p] || T[d] || (g && T[g]),
          U = E || P(g),
          C = g ? (j ? P("entries") : U) : void 0,
          R = ("Array" == e && T.entries) || E;
        if (
          (R &&
            ((_ = a(R.call(new t()))),
            _ !== Object.prototype &&
              _.next &&
              (f(_, S, !0), r || "function" == typeof _[p] || c(_, p, y))),
          j &&
            E &&
            E.name !== v &&
            ((I = !0),
            (U = function () {
              return E.call(this);
            })),
          (r && !x) || (!l && !I && T[p]) || c(T, p, U),
          (u[e] = U),
          (u[S] = y),
          g)
        )
          if (
            ((w = { values: j ? U : P(v), keys: m ? U : P(b), entries: C }), x)
          )
            for (O in w) O in T || i(T, O, w[O]);
          else o(o.P + o.F * (l || I), e, w);
        return w;
      };
    },
    1374: function (t, e, n) {
      "use strict";
      var r = n("bb8b"),
        o = n("5edc");
      t.exports = function (t, e, n) {
        e in t ? r.f(t, e, o(0, n)) : (t[e] = n);
      };
    },
    "16a4": function (t, e, n) {
      "use strict";
      var r;
      (n.r(e), "undefined" !== typeof window) &&
        (n("e67d"),
        (r = window.document.currentScript) &&
          (r = r.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)) &&
          (n.p = r[1]));
      n("ac67"), n("32ea");
      function o(t) {
        return (
          (o =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          o(t)
        );
      }
      function i(t, e) {
        if ("object" !== o(t) || null === t) return t;
        var n = t[Symbol.toPrimitive];
        if (void 0 !== n) {
          var r = n.call(t, e || "default");
          if ("object" !== o(r)) return r;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      }
      function c(t) {
        var e = i(t, "string");
        return "symbol" === o(e) ? e : String(e);
      }
      function u(t, e, n) {
        return (
          (e = c(e)),
          e in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      n("a450"), n("25ba"), n("1bc7"), n("96ea");
      function s(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(t);
          e &&
            (r = r.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function f(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? s(Object(n), !0).forEach(function (e) {
                u(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
            : s(Object(n)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(n, e)
                );
              });
        }
        return t;
      }
      var a = n("fd65"),
        p = {};
      a.keys().forEach(function (t) {
        var e = /\.\/(.*?)\./g,
          n = e.exec(t);
        if (n) {
          var r = a(t).default,
            o = r.name,
            i = r.title,
            c = void 0 === i ? "" : i,
            u = r.preview,
            s = void 0 === u ? "" : u,
            f = r.tips,
            l = void 0 === f ? "" : f,
            d = r.attrs,
            b = void 0 === d ? {} : d;
          p["Package-".concat(o)] = {
            comp: r,
            title: c,
            preview: s,
            tips: l,
            attrs: b,
          };
        }
      }),
        window.AllComps
          ? (window.AllComps = f(f({}, window.AllComps), p))
          : (window.AllComps = f({}, p));
      var l = f({}, p);
      e["default"] = l;
    },
    "1a63": function (t, e, n) {
      t.exports = n.p + "static/img/preview-banner-goods.5fd3dd4a.jpg";
    },
    "1b96": function (t, e, n) {
      var r = n("cea2");
      t.exports = Object("z").propertyIsEnumerable(0)
        ? Object
        : function (t) {
            return "String" == r(t) ? t.split("") : Object(t);
          };
    },
    "1bc7": function (t, e, n) {
      for (
        var r = n("25ba"),
          o = n("93ca"),
          i = n("84e8"),
          c = n("0b34"),
          u = n("065d"),
          s = n("953d"),
          f = n("839a"),
          a = f("iterator"),
          p = f("toStringTag"),
          l = s.Array,
          d = {
            CSSRuleList: !0,
            CSSStyleDeclaration: !1,
            CSSValueList: !1,
            ClientRectList: !1,
            DOMRectList: !1,
            DOMStringList: !1,
            DOMTokenList: !0,
            DataTransferItemList: !1,
            FileList: !1,
            HTMLAllCollection: !1,
            HTMLCollection: !1,
            HTMLFormElement: !1,
            HTMLSelectElement: !1,
            MediaList: !0,
            MimeTypeArray: !1,
            NamedNodeMap: !1,
            NodeList: !0,
            PaintRequestList: !1,
            Plugin: !1,
            PluginArray: !1,
            SVGLengthList: !1,
            SVGNumberList: !1,
            SVGPathSegList: !1,
            SVGPointList: !1,
            SVGStringList: !1,
            SVGTransformList: !1,
            SourceBufferList: !1,
            StyleSheetList: !0,
            TextTrackCueList: !1,
            TextTrackList: !1,
            TouchList: !1,
          },
          b = o(d),
          v = 0;
        v < b.length;
        v++
      ) {
        var y,
          h = b[v],
          g = d[h],
          m = c[h],
          x = m && m.prototype;
        if (x && (x[a] || u(x, a, l), x[p] || u(x, p, h), (s[h] = l), g))
          for (y in r) x[y] || i(x, y, r[y], !0);
      }
    },
    "1e4d": function (t, e, n) {
      var r = n("3250");
      t.exports = function (t, e, n) {
        if ((r(t), void 0 === e)) return t;
        switch (n) {
          case 1:
            return function (n) {
              return t.call(e, n);
            };
          case 2:
            return function (n, r) {
              return t.call(e, n, r);
            };
          case 3:
            return function (n, r, o) {
              return t.call(e, n, r, o);
            };
        }
        return function () {
          return t.apply(e, arguments);
        };
      };
    },
    "201c": function (t, e, n) {
      var r = n("212e"),
        o = Math.min;
      t.exports = function (t) {
        return t > 0 ? o(r(t), 9007199254740991) : 0;
      };
    },
    "20cf": function (t, e, n) {},
    "212e": function (t, e) {
      var n = Math.ceil,
        r = Math.floor;
      t.exports = function (t) {
        return isNaN((t = +t)) ? 0 : (t > 0 ? r : n)(t);
      };
    },
    "21d9": function (t, e, n) {
      var r = n("3a4c"),
        o = n("065e").concat("length", "prototype");
      e.f =
        Object.getOwnPropertyNames ||
        function (t) {
          return r(t, o);
        };
    },
    "239f": function (t, e, n) {
      var r = n("3d37")["default"];
      function o(t, e) {
        if ("object" !== r(t) || null === t) return t;
        var n = t[Symbol.toPrimitive];
        if (void 0 !== n) {
          var o = n.call(t, e || "default");
          if ("object" !== r(o)) return o;
          throw new TypeError("@@toPrimitive must return a primitive value.");
        }
        return ("string" === e ? String : Number)(t);
      }
      (t.exports = o),
        (t.exports.__esModule = !0),
        (t.exports["default"] = t.exports);
    },
    "25ba": function (t, e, n) {
      "use strict";
      var r = n("87b2"),
        o = n("6fef"),
        i = n("953d"),
        c = n("3471");
      (t.exports = n("120f")(
        Array,
        "Array",
        function (t, e) {
          (this._t = c(t)), (this._i = 0), (this._k = e);
        },
        function () {
          var t = this._t,
            e = this._k,
            n = this._i++;
          return !t || n >= t.length
            ? ((this._t = void 0), o(1))
            : o(0, "keys" == e ? n : "values" == e ? t[n] : [n, t[n]]);
        },
        "values"
      )),
        (i.Arguments = i.Array),
        r("keys"),
        r("values"),
        r("entries");
    },
    "26df": function (t, e, n) {
      t.exports = !n("0926")(function () {
        return (
          7 !=
          Object.defineProperty({}, "a", {
            get: function () {
              return 7;
            },
          }).a
        );
      });
    },
    "285b": function (t, e, n) {
      var r = n("35d4"),
        o = n("5edc"),
        i = n("3471"),
        c = n("5d10"),
        u = n("4fd4"),
        s = n("83d3"),
        f = Object.getOwnPropertyDescriptor;
      e.f = n("26df")
        ? f
        : function (t, e) {
            if (((t = i(t)), (e = c(e, !0)), s))
              try {
                return f(t, e);
              } catch (n) {}
            if (u(t, e)) return o(!r.f.call(t, e), t[e]);
          };
    },
    3250: function (t, e) {
      t.exports = function (t) {
        if ("function" != typeof t) throw TypeError(t + " is not a function!");
        return t;
      };
    },
    "32ea": function (t, e, n) {
      var r = n("8078"),
        o = n("93ca");
      n("b2be")("keys", function () {
        return function (t) {
          return o(r(t));
        };
      });
    },
    3460: function (t, e, n) {
      "use strict";
      var r = n("7ee3"),
        o = n("5edc"),
        i = n("bac3"),
        c = {};
      n("065d")(c, n("839a")("iterator"), function () {
        return this;
      }),
        (t.exports = function (t, e, n) {
          (t.prototype = r(c, { next: o(1, n) })), i(t, e + " Iterator");
        });
    },
    3471: function (t, e, n) {
      var r = n("1b96"),
        o = n("3ab0");
      t.exports = function (t) {
        return r(o(t));
      };
    },
    "35d4": function (t, e) {
      e.f = {}.propertyIsEnumerable;
    },
    "3a0d": function (t, e, n) {
      var r = n("baa7")("keys"),
        o = n("d8b3");
      t.exports = function (t) {
        return r[t] || (r[t] = o(t));
      };
    },
    "3a4c": function (t, e, n) {
      var r = n("4fd4"),
        o = n("3471"),
        i = n("52a4")(!1),
        c = n("3a0d")("IE_PROTO");
      t.exports = function (t, e) {
        var n,
          u = o(t),
          s = 0,
          f = [];
        for (n in u) n != c && r(u, n) && f.push(n);
        while (e.length > s) r(u, (n = e[s++])) && (~i(f, n) || f.push(n));
        return f;
      };
    },
    "3ab0": function (t, e) {
      t.exports = function (t) {
        if (void 0 == t) throw TypeError("Can't call method on  " + t);
        return t;
      };
    },
    "3d37": function (t, e) {
      function n(e) {
        return (
          (t.exports = n =
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    "function" == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? "symbol"
                    : typeof t;
                }),
          (t.exports.__esModule = !0),
          (t.exports["default"] = t.exports),
          n(e)
        );
      }
      (t.exports = n),
        (t.exports.__esModule = !0),
        (t.exports["default"] = t.exports);
    },
    "3d8a": function (t, e) {
      t.exports = !1;
    },
    "3f9e": function (t, e, n) {
      var r = n("bb8b"),
        o = n("a86f"),
        i = n("93ca");
      t.exports = n("26df")
        ? Object.defineProperties
        : function (t, e) {
            o(t);
            var n,
              c = i(e),
              u = c.length,
              s = 0;
            while (u > s) r.f(t, (n = c[s++]), e[n]);
            return t;
          };
    },
    "4fd4": function (t, e) {
      var n = {}.hasOwnProperty;
      t.exports = function (t, e) {
        return n.call(t, e);
      };
    },
    "52a4": function (t, e, n) {
      var r = n("3471"),
        o = n("201c"),
        i = n("732b");
      t.exports = function (t) {
        return function (e, n, c) {
          var u,
            s = r(e),
            f = o(s.length),
            a = i(c, f);
          if (t && n != n) {
            while (f > a) if (((u = s[a++]), u != u)) return !0;
          } else
            for (; f > a; a++)
              if ((t || a in s) && s[a] === n) return t || a || 0;
          return !t && -1;
        };
      };
    },
    "585c": function (t, e, n) {
      "use strict";
      n("20cf");
    },
    "5d10": function (t, e, n) {
      var r = n("9cff");
      t.exports = function (t, e) {
        if (!r(t)) return t;
        var n, o;
        if (e && "function" == typeof (n = t.toString) && !r((o = n.call(t))))
          return o;
        if ("function" == typeof (n = t.valueOf) && !r((o = n.call(t))))
          return o;
        if (!e && "function" == typeof (n = t.toString) && !r((o = n.call(t))))
          return o;
        throw TypeError("Can't convert object to primitive value");
      };
    },
    "5edc": function (t, e) {
      t.exports = function (t, e) {
        return {
          enumerable: !(1 & t),
          configurable: !(2 & t),
          writable: !(4 & t),
          value: e,
        };
      };
    },
    "6fef": function (t, e) {
      t.exports = function (t, e) {
        return { value: e, done: !!t };
      };
    },
    "732b": function (t, e, n) {
      var r = n("212e"),
        o = Math.max,
        i = Math.min;
      t.exports = function (t, e) {
        return (t = r(t)), t < 0 ? o(t + e, 0) : i(t, e);
      };
    },
    "76e3": function (t, e) {
      var n = (t.exports = { version: "2.6.12" });
      "number" == typeof __e && (__e = n);
    },
    "79e3": function (t, e, n) {
      var r = n("cab1");
      function o(t, e, n) {
        return (
          (e = r(e)),
          e in t
            ? Object.defineProperty(t, e, {
                value: n,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[e] = n),
          t
        );
      }
      (t.exports = o),
        (t.exports.__esModule = !0),
        (t.exports["default"] = t.exports);
    },
    "7ee3": function (t, e, n) {
      var r = n("a86f"),
        o = n("3f9e"),
        i = n("065e"),
        c = n("3a0d")("IE_PROTO"),
        u = function () {},
        s = "prototype",
        f = function () {
          var t,
            e = n("e8d7")("iframe"),
            r = i.length,
            o = "<",
            c = ">";
          (e.style.display = "none"),
            n("bbcc").appendChild(e),
            (e.src = "javascript:"),
            (t = e.contentWindow.document),
            t.open(),
            t.write(o + "script" + c + "document.F=Object" + o + "/script" + c),
            t.close(),
            (f = t.F);
          while (r--) delete f[s][i[r]];
          return f();
        };
      t.exports =
        Object.create ||
        function (t, e) {
          var n;
          return (
            null !== t
              ? ((u[s] = r(t)), (n = new u()), (u[s] = null), (n[c] = t))
              : (n = f()),
            void 0 === e ? n : o(n, e)
          );
        };
    },
    8078: function (t, e, n) {
      var r = n("3ab0");
      t.exports = function (t) {
        return Object(r(t));
      };
    },
    "839a": function (t, e, n) {
      var r = n("baa7")("wks"),
        o = n("d8b3"),
        i = n("0b34").Symbol,
        c = "function" == typeof i,
        u = (t.exports = function (t) {
          return r[t] || (r[t] = (c && i[t]) || (c ? i : o)("Symbol." + t));
        });
      u.store = r;
    },
    "83d3": function (t, e, n) {
      t.exports =
        !n("26df") &&
        !n("0926")(function () {
          return (
            7 !=
            Object.defineProperty(n("e8d7")("div"), "a", {
              get: function () {
                return 7;
              },
            }).a
          );
        });
    },
    "84e8": function (t, e, n) {
      var r = n("0b34"),
        o = n("065d"),
        i = n("4fd4"),
        c = n("d8b3")("src"),
        u = n("05fd"),
        s = "toString",
        f = ("" + u).split(s);
      (n("76e3").inspectSource = function (t) {
        return u.call(t);
      }),
        (t.exports = function (t, e, n, u) {
          var s = "function" == typeof n;
          s && (i(n, "name") || o(n, "name", e)),
            t[e] !== n &&
              (s && (i(n, c) || o(n, c, t[e] ? "" + t[e] : f.join(String(e)))),
              t === r
                ? (t[e] = n)
                : u
                ? t[e]
                  ? (t[e] = n)
                  : o(t, e, n)
                : (delete t[e], o(t, e, n)));
        })(Function.prototype, s, function () {
          return ("function" == typeof this && this[c]) || u.call(this);
        });
    },
    "87b2": function (t, e, n) {
      var r = n("839a")("unscopables"),
        o = Array.prototype;
      void 0 == o[r] && n("065d")(o, r, {}),
        (t.exports = function (t) {
          o[r][t] = !0;
        });
    },
    "91da": function (t, e, n) {
      "use strict";
      n.r(e);
      var r = function () {
          var t = this,
            e = t.$createElement,
            n = t._self._c || e;
          return !t.showPrivew || t.firstUrl || t.isH5
            ? n(
                "div",
                {
                  style: {
                    position: t.gotInfo.Isorientation ? "absolute" : "",
                    top: t.gotInfo.Isorientation
                      ? t.gotInfo.orientationNum / 100 + "rem" || !1
                      : "0",
                    width: "100%",
                  },
                },
                [
                  t.secondProduct
                    ? n(
                        "div",
                        {
                          staticClass: "goods-wrapper",
                          style: {
                            marginTop: t.gotInfo.Isorientation
                              ? "0"
                              : t.gotInfo.topDistince + "px",
                          },
                        },
                        [
                          "double" === t.gotInfo.goodsType
                            ? n(
                                "div",
                                {
                                  staticClass: "double-wrapper",
                                  style: { top: t.gotInfo.topDistince + "%" },
                                },
                                t._l(
                                  t.gotInfo.picResourceUrls,
                                  function (e, r) {
                                    return n(
                                      "div",
                                      {
                                        key: r,
                                        class: {
                                          "double-item":
                                            t.activeDoubleIndex === r,
                                        },
                                        style: {
                                          "margin-bottom": "10px",
                                          width: "47%",
                                        },
                                        on: {
                                          click: function (e) {
                                            t.activeDoubleIndex = r;
                                          },
                                        },
                                      },
                                      [
                                        n("img", {
                                          staticStyle: { width: "100%" },
                                          attrs: {
                                            src: e.picResourceUrl,
                                            alt: "",
                                          },
                                        }),
                                      ]
                                    );
                                  }
                                ),
                                0
                              )
                            : "banner" === t.gotInfo.goodsType
                            ? n(
                                "div",
                                [
                                  n(
                                    "el-carousel",
                                    {
                                      ref: "preview-carousel",
                                      staticStyle: {
                                        "z-index": "999",
                                        padding: "15px 0",
                                      },
                                      style: {
                                        top: t.gotInfo.topDistince + "%",
                                      },
                                      attrs: {
                                        interval: 1e4,
                                        type: "card",
                                        height: "120px",
                                        arrow: "never",
                                        "indicator-position": "none",
                                        autoplay: !1,
                                      },
                                      on: { change: t.handleBannerChange },
                                    },
                                    t._l(
                                      t.gotInfo.picResourceUrls,
                                      function (e, r) {
                                        return n(
                                          "el-carousel-item",
                                          { key: r },
                                          [
                                            n("img", {
                                              staticClass: "img-item",
                                              attrs: { src: e.picResourceUrl },
                                            }),
                                            t._v(" "),
                                            t.gotInfo.cornerResourceUrl &&
                                            r === t.activeIndex
                                              ? n("img", {
                                                  ref: "previewCornerImg",
                                                  refInFor: !0,
                                                  staticStyle: {
                                                    position: "absolute",
                                                    top: "0",
                                                    left: "10%",
                                                  },
                                                  style: {
                                                    width:
                                                      t.gotInfo.cornerWidth,
                                                    height:
                                                      t.gotInfo.cornerHeight,
                                                  },
                                                  attrs: {
                                                    src: t.gotInfo
                                                      .cornerResourceUrl,
                                                  },
                                                })
                                              : t._e(),
                                          ]
                                        );
                                      }
                                    ),
                                    1
                                  ),
                                ],
                                1
                              )
                            : t._e(),
                        ]
                      )
                    : t._e(),
                ]
              )
            : n(
                "div",
                {
                  style: {
                    position: t.gotInfo.Isorientation ? "fixed" : "",
                    top: t.gotInfo.Isorientation
                      ? t.gotInfo.orientationNum / 100 + "rem" || !1
                      : "0",
                    width: "100%",
                  },
                },
                [
                  t.gotInfo.isHiddenMiddelPreview
                    ? !t.firstUrl && t.isShowSingleGoodsImg
                      ? n("img", {
                          attrs: { src: t.preview, alt: "", width: "100%" },
                        })
                      : t._e()
                    : n("img", {
                        attrs: { src: t.preview, alt: "", width: "100%" },
                      }),
                ]
              );
        },
        o = [],
        i = n("db49"),
        c = n.n(i),
        u = n("93a4"),
        s = n("1a63"),
        f = n("93a4"),
        a = {
          name: "GoodsComp",
          title: "流量包_商品",
          tips: "可以选择单双列和轮播两种样式",
          props: {
            showPrivew: { type: Boolean, default: !0 },
            info: {
              type: Object,
              default: function () {
                return {};
              },
            },
            jumpTo: { type: Function },
          },
          watch: {
            info: {
              handler: function (t) {
                (this.gotInfo = t),
                  c.a.isH5
                    ? this.gotInfo.picResourceUrls &&
                      ((this.secondProduct =
                        this.gotInfo.picResourceUrls[1] &&
                        this.gotInfo.picResourceUrls[1].productCode),
                      (this.firstUrl =
                        this.gotInfo.picResourceUrls[0].picResourceUrl))
                    : this.gotInfo.picResourceUrls &&
                      ((this.firstProduct =
                        this.gotInfo.picResourceUrls[0].productCode),
                      (this.firstUrl =
                        this.gotInfo.picResourceUrls[0].picResourceUrl),
                      1 !== this.gotInfo.picResourceUrls.length || this.firstUrl
                        ? this.gotInfo.picResourceUrls.length < 4
                          ? (this.preview = s)
                          : (this.preview = u)
                        : (this.preview = f)),
                  this.$forceUpdate();
              },
              deep: !0,
              immediate: !0,
            },
            activeDoubleIndex: {
              handler: function (t) {
                if ("double" === this.gotInfo.goodsType) {
                  var e = this.gotInfo.picResourceUrls[t];
                  this.$store.dispatch("Goodsinfo", e);
                }
              },
              deep: !0,
              immediate: !0,
            },
            activeIndex: {
              handler: function (t) {
                if ("banner" === this.gotInfo.goodsType) {
                  var e = this.gotInfo.picResourceUrls[t];
                  this.$store.dispatch("Goodsinfo", e);
                }
              },
              deep: !0,
              immediate: !0,
            },
          },
          data: function () {
            return {
              isH5: !0,
              isShowSingleGoodsImg:
                this.$store.state.isShowSingleGoodsImg || null,
              preview: u,
              gotInfo: {},
              activeDoubleIndex: 0,
              activeIndex: 0,
              secondProduct: "",
              firstUrl: "",
            };
          },
          created: function () {
            this.isH5 = c.a.isH5;
          },
          mounted: function () {},
          methods: {
            handleBannerChange: function (t) {
              this.activeIndex = t;
            },
          },
        },
        p = a;
      n("d04d"), n("585c");
      function l(t, e, n, r, o, i, c, u) {
        var s,
          f = "function" === typeof t ? t.options : t;
        if (
          (e && ((f.render = e), (f.staticRenderFns = n), (f._compiled = !0)),
          r && (f.functional = !0),
          i && (f._scopeId = "data-v-" + i),
          c
            ? ((s = function (t) {
                (t =
                  t ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent &&
                    this.parent.$vnode &&
                    this.parent.$vnode.ssrContext)),
                  t ||
                    "undefined" === typeof __VUE_SSR_CONTEXT__ ||
                    (t = __VUE_SSR_CONTEXT__),
                  o && o.call(this, t),
                  t &&
                    t._registeredComponents &&
                    t._registeredComponents.add(c);
              }),
              (f._ssrRegister = s))
            : o &&
              (s = u
                ? function () {
                    o.call(
                      this,
                      (f.functional ? this.parent : this).$root.$options
                        .shadowRoot
                    );
                  }
                : o),
          s)
        )
          if (f.functional) {
            f._injectStyles = s;
            var a = f.render;
            f.render = function (t, e) {
              return s.call(e), a(t, e);
            };
          } else {
            var p = f.beforeCreate;
            f.beforeCreate = p ? [].concat(p, s) : [s];
          }
        return { exports: t, options: f };
      }
      var d = l(p, r, o, !1, null, "0d1c565a", null);
      e["default"] = d.exports;
    },
    "93a4": function (t, e, n) {
      t.exports = n.p + "static/img/preview-empty-goods.dcd2a218.jpg";
    },
    "93ca": function (t, e, n) {
      var r = n("3a4c"),
        o = n("065e");
      t.exports =
        Object.keys ||
        function (t) {
          return r(t, o);
        };
    },
    "953d": function (t, e) {
      t.exports = {};
    },
    "96ea": function (t, e, n) {},
    "9cff": function (t, e) {
      t.exports = function (t) {
        return "object" === typeof t ? null !== t : "function" === typeof t;
      };
    },
    a450: function (t, e, n) {
      var r = n("bb8b").f,
        o = Function.prototype,
        i = /^\s*function ([^ (]*)/,
        c = "name";
      c in o ||
        (n("26df") &&
          r(o, c, {
            configurable: !0,
            get: function () {
              try {
                return ("" + this).match(i)[1];
              } catch (t) {
                return "";
              }
            },
          }));
    },
    a86f: function (t, e, n) {
      var r = n("9cff");
      t.exports = function (t) {
        if (!r(t)) throw TypeError(t + " is not an object!");
        return t;
      };
    },
    ac67: function (t, e, n) {
      var r = n("e99b"),
        o = n("e7c8"),
        i = n("3471"),
        c = n("285b"),
        u = n("1374");
      r(r.S, "Object", {
        getOwnPropertyDescriptors: function (t) {
          var e,
            n,
            r = i(t),
            s = c.f,
            f = o(r),
            a = {},
            p = 0;
          while (f.length > p)
            (n = s(r, (e = f[p++]))), void 0 !== n && u(a, e, n);
          return a;
        },
      });
    },
    addc: function (t, e, n) {
      var r = n("4fd4"),
        o = n("8078"),
        i = n("3a0d")("IE_PROTO"),
        c = Object.prototype;
      t.exports =
        Object.getPrototypeOf ||
        function (t) {
          return (
            (t = o(t)),
            r(t, i)
              ? t[i]
              : "function" == typeof t.constructor && t instanceof t.constructor
              ? t.constructor.prototype
              : t instanceof Object
              ? c
              : null
          );
        };
    },
    b2be: function (t, e, n) {
      var r = n("e99b"),
        o = n("76e3"),
        i = n("0926");
      t.exports = function (t, e) {
        var n = (o.Object || {})[t] || Object[t],
          c = {};
        (c[t] = e(n)),
          r(
            r.S +
              r.F *
                i(function () {
                  n(1);
                }),
            "Object",
            c
          );
      };
    },
    b882: function (t, e, n) {},
    baa7: function (t, e, n) {
      var r = n("76e3"),
        o = n("0b34"),
        i = "__core-js_shared__",
        c = o[i] || (o[i] = {});
      (t.exports = function (t, e) {
        return c[t] || (c[t] = void 0 !== e ? e : {});
      })("versions", []).push({
        version: r.version,
        mode: n("3d8a") ? "pure" : "global",
        copyright: "© 2020 Denis Pushkarev (zloirock.ru)",
      });
    },
    bac3: function (t, e, n) {
      var r = n("bb8b").f,
        o = n("4fd4"),
        i = n("839a")("toStringTag");
      t.exports = function (t, e, n) {
        t &&
          !o((t = n ? t : t.prototype), i) &&
          r(t, i, { configurable: !0, value: e });
      };
    },
    bb8b: function (t, e, n) {
      var r = n("a86f"),
        o = n("83d3"),
        i = n("5d10"),
        c = Object.defineProperty;
      e.f = n("26df")
        ? Object.defineProperty
        : function (t, e, n) {
            if ((r(t), (e = i(e, !0)), r(n), o))
              try {
                return c(t, e, n);
              } catch (u) {}
            if ("get" in n || "set" in n)
              throw TypeError("Accessors not supported!");
            return "value" in n && (t[e] = n.value), t;
          };
    },
    bbcc: function (t, e, n) {
      var r = n("0b34").document;
      t.exports = r && r.documentElement;
    },
    cab1: function (t, e, n) {
      var r = n("3d37")["default"],
        o = n("239f");
      function i(t) {
        var e = o(t, "string");
        return "symbol" === r(e) ? e : String(e);
      }
      (t.exports = i),
        (t.exports.__esModule = !0),
        (t.exports["default"] = t.exports);
    },
    cea2: function (t, e) {
      var n = {}.toString;
      t.exports = function (t) {
        return n.call(t).slice(8, -1);
      };
    },
    d04d: function (t, e, n) {
      "use strict";
      n("b882");
    },
    d8b3: function (t, e) {
      var n = 0,
        r = Math.random();
      t.exports = function (t) {
        return "Symbol(".concat(
          void 0 === t ? "" : t,
          ")_",
          (++n + r).toString(36)
        );
      };
    },
    db49: function (t, e, n) {
      n("ac67"), n("1bc7"), n("25ba"), n("32ea");
      var r = n("79e3");
      function o(t, e) {
        var n = Object.keys(t);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(t);
          e &&
            (r = r.filter(function (e) {
              return Object.getOwnPropertyDescriptor(t, e).enumerable;
            })),
            n.push.apply(n, r);
        }
        return n;
      }
      function i(t) {
        for (var e = 1; e < arguments.length; e++) {
          var n = null != arguments[e] ? arguments[e] : {};
          e % 2
            ? o(Object(n), !0).forEach(function (e) {
                r(t, e, n[e]);
              })
            : Object.getOwnPropertyDescriptors
            ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n))
            : o(Object(n)).forEach(function (e) {
                Object.defineProperty(
                  t,
                  e,
                  Object.getOwnPropertyDescriptor(n, e)
                );
              });
        }
        return t;
      }
      var c = {
          development: {
            VUE_APP_JSON_PATH: "/38857911/package/cdn/fixedPath/",
            VUE_APP_TYPE_CON: "test",
          },
          sandbox: {
            VUE_APP_JSON_PATH: "/38857911/package/cdn/fixedPath/",
            VUE_APP_TYPE_CON: "test",
          },
          staging: {
            VUE_APP_JSON_PATH:
              "https://res.coc.10086.cn/res/cdn/staging/coc1/fixedPath/",
            VUE_APP_TYPE_CON: "staging",
          },
          production: {
            VUE_APP_JSON_PATH:
              "https://res.coc.10086.cn/res/cdn/coc1/fixedPath/",
            VUE_APP_TYPE_CON: "production",
          },
        },
        u = {
          PROJECT_NAME: "package-h5-canvas",
          canvasPrefix: "/canvas/canvas-serve",
          isH5: !!(["h5cdn"].indexOf("h5cdn") > -1),
        };
      t.exports = i(i({}, c["h5cdn"]), u);
    },
    e67d: function (t, e) {
      (function (t) {
        var e = "currentScript",
          n = t.getElementsByTagName("script");
        e in t ||
          Object.defineProperty(t, e, {
            get: function () {
              try {
                throw new Error();
              } catch (r) {
                var t,
                  e = (/.*at [^\(]*\((.*):.+:.+\)$/gi.exec(r.stack) || [!1])[1];
                for (t in n)
                  if (n[t].src == e || "interactive" == n[t].readyState)
                    return n[t];
                return null;
              }
            },
          });
      })(document);
    },
    e7c8: function (t, e, n) {
      var r = n("21d9"),
        o = n("0c29"),
        i = n("a86f"),
        c = n("0b34").Reflect;
      t.exports =
        (c && c.ownKeys) ||
        function (t) {
          var e = r.f(i(t)),
            n = o.f;
          return n ? e.concat(n(t)) : e;
        };
    },
    e8d7: function (t, e, n) {
      var r = n("9cff"),
        o = n("0b34").document,
        i = r(o) && r(o.createElement);
      t.exports = function (t) {
        return i ? o.createElement(t) : {};
      };
    },
    e99b: function (t, e, n) {
      var r = n("0b34"),
        o = n("76e3"),
        i = n("065d"),
        c = n("84e8"),
        u = n("1e4d"),
        s = "prototype",
        f = function (t, e, n) {
          var a,
            p,
            l,
            d,
            b = t & f.F,
            v = t & f.G,
            y = t & f.S,
            h = t & f.P,
            g = t & f.B,
            m = v ? r : y ? r[e] || (r[e] = {}) : (r[e] || {})[s],
            x = v ? o : o[e] || (o[e] = {}),
            w = x[s] || (x[s] = {});
          for (a in (v && (n = e), n))
            (p = !b && m && void 0 !== m[a]),
              (l = (p ? m : n)[a]),
              (d =
                g && p
                  ? u(l, r)
                  : h && "function" == typeof l
                  ? u(Function.call, l)
                  : l),
              m && c(m, a, l, t & f.U),
              x[a] != l && i(x, a, d),
              h && w[a] != l && (w[a] = l);
        };
      (r.core = o),
        (f.F = 1),
        (f.G = 2),
        (f.S = 4),
        (f.P = 8),
        (f.B = 16),
        (f.W = 32),
        (f.U = 64),
        (f.R = 128),
        (t.exports = f);
    },
    fd65: function (t, e, n) {
      var r = { "./index.vue": "91da" };
      function o(t) {
        var e = i(t);
        return n(e);
      }
      function i(t) {
        var e = r[t];
        if (!(e + 1)) {
          var n = new Error("Cannot find module '" + t + "'");
          throw ((n.code = "MODULE_NOT_FOUND"), n);
        }
        return e;
      }
      (o.keys = function () {
        return Object.keys(r);
      }),
        (o.resolve = i),
        (t.exports = o),
        (o.id = "fd65");
    },
  });
});
