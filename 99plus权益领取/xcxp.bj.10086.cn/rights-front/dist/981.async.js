/*! For license information please see 981.async.js.LICENSE.txt */
"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["981"],
  {
    26755(t, r) {
      function o(t, r, o) {
        return (
          r in t
            ? Object.defineProperty(t, r, {
                value: o,
                enumerable: !0,
                configurable: !0,
                writable: !0,
              })
            : (t[r] = o),
          t
        );
      }
      function n() {
        return (
          (n = Object.assign
            ? Object.assign.bind()
            : function (t) {
                for (var r = 1; r < arguments.length; r++) {
                  var o = arguments[r];
                  for (var n in o)
                    Object.prototype.hasOwnProperty.call(o, n) && (t[n] = o[n]);
                }
                return t;
              }),
          n.apply(this, arguments)
        );
      }
      var e = 17,
        i = "always",
        a = "hybrid",
        s = "animation",
        u = "translate-first",
        c = "scale-first";
      function h(t) {
        return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
      }
      function f(t) {
        return t instanceof Number
          ? [t]
          : [].concat(t instanceof Array ? t : t.valueOf());
      }
      var l = (function () {
        function t(r) {
          var n = this;
          o(this, "operatorAdd", function (r) {
            var o = (r = f(r)).length >= n.x.length ? [r, n.x] : [n.x, r];
            return new t(
              o[0].map(function (t, r) {
                return t + (void 0 !== o[1][r] ? o[1][r] : o[1][0]);
              })
            );
          }),
            o(this, "operatorSub", function (r) {
              var o = (r = f(r)).length > n.x.length ? [r, n.x] : [n.x, r];
              return new t(
                o[0].map(function (t, r) {
                  return t - (void 0 !== o[1][r] ? o[1][r] : o[1][0]);
                })
              );
            }),
            o(this, "operatorMul", function (r) {
              var o = (r = f(r)).length > n.x.length ? [r, n.x] : [n.x, r];
              return new t(
                o[0].map(function (t, r) {
                  return t * (void 0 !== o[1][r] ? o[1][r] : o[1][0]);
                })
              );
            }),
            o(this, "operatorDiv", function (r) {
              var o = (r = f(r)).length > n.x.length ? [r, n.x] : [n.x, r];
              return new t(
                o[0].map(function (t, r) {
                  return t / (void 0 !== o[1][r] ? o[1][r] : o[1][0]);
                })
              );
            }),
            (this.x = f(r) || []);
        }
        var r = t.prototype;
        return (
          (r.get = function (t) {
            return this.x[t];
          }),
          (r.v = function () {
            return [].concat(this.x);
          }),
          (r.size = function () {
            return this.x.length;
          }),
          (r.valueOf = function () {
            return this.x.valueOf();
          }),
          (r.toString = function () {
            return this.x.toString();
          }),
          (r.mul = function (t) {
            if ((t = this.convert(t)).length !== this.x.length)
              throw new Error(
                "Can not process vector inner-product, input vector dim " +
                  t.length +
                  " don't match resource vector dim " +
                  this.x.length
              );
            var r = 0;
            return (
              this.x.forEach(function (o, n) {
                return (r += o + t[n]);
              }),
              r
            );
          }),
          t
        );
      })();
      function d(t, r) {
        return "number" == typeof t
          ? { R: t, I: 0 }
          : t.isComplex
          ? t
          : { R: r, I: 0 };
      }
      var m = (function () {
          function t(r, n) {
            var e = this;
            void 0 === n && (n = 0),
              o(this, "operatorAdd", function (r) {
                return (r = d(r, 0)), new t(e.R + r.R, e.I + r.I);
              }),
              o(this, "operatorSub", function (r) {
                return (r = d(r, 0)), new t(e.R - r.R, e.I - r.I);
              }),
              o(this, "operatorMul", function (r) {
                return (
                  (r = d(r, 1)),
                  new t(e.R * r.R - e.I * r.I, e.I * r.R + e.R * r.I)
                );
              }),
              o(this, "operatorDiv", function (r) {
                r = d(r, 1);
                var o = Math.pow(r.R, 2) + Math.pow(r.I, 2);
                return new t(
                  (e.R * r.R + e.I * r.I) / o,
                  (e.I * r.R - e.R * r.I) / o
                );
              }),
              o(this, "operatorPow", function (r) {
                var o = e.z();
                if (0 === o) return new t(0);
                var n = Math.acos(e.R / o) * r;
                return new t(
                  (o = Math.pow(o, r)) * Math.cos(n),
                  o * Math.sin(n)
                );
              }),
              "number" == typeof r
                ? ((this.R = Number(r)), (this.I = Number(n)))
                : r.isComplex && ((this.R = r.r()), (this.I = r.i())),
              (this.isComplex = !0);
          }
          var r = t.prototype;
          return (
            (r.valueOf = function () {
              return this.R.valueOf();
            }),
            (r.toString = function () {
              return this.R.toFixed(3) + "+" + this.I.toFixed(3) + "i";
            }),
            (r.isNaN = (function (t) {
              function r() {
                return t.apply(this, arguments);
              }
              return (
                (r.toString = function () {
                  return t.toString();
                }),
                r
              );
            })(function () {
              return isNaN(this.R) || isNaN(this.I);
            })),
            (r.isReal = function () {
              return 0 === this.I && !this.isNaN();
            }),
            (r.inRangeR = function (t, r) {
              return this.R <= r && this.R >= t;
            }),
            (r.inRangeI = function (t, r) {
              return this.I <= r && this.I >= t;
            }),
            (r.setR = function (t) {
              this.R = Number(t);
            }),
            (r.setI = function (t) {
              this.I = Number(t);
            }),
            (r.r = function () {
              return this.R;
            }),
            (r.i = function () {
              return this.I;
            }),
            (r.z = function () {
              return Math.sqrt(Math.pow(this.R, 2) + Math.pow(this.I, 2));
            }),
            (r.theta = function () {
              var t = this.z();
              return Math.acos(this.R / t);
            }),
            t
          );
        })(),
        p = {
          add: function (t, r) {
            return t.operatorAdd ? t.operatorAdd(r) : t + r;
          },
          sub: function (t, r) {
            return t.operatorSub ? t.operatorSub(r) : t - r;
          },
          mul: function (t, r) {
            return t.operatorMul ? t.operatorMul(r) : t * r;
          },
          div: function (t, r) {
            return t.operatorDiv ? t.operatorDiv(r) : t / r;
          },
          pow: function (t, r) {
            return t.operatorPow ? t.operatorPow(r) : Math.pow(t, r);
          },
          binaryAnd: function (t, r) {
            return t.operatorBinaryAnd ? t.operatorBinaryAnd(r) : t & r;
          },
          binaryOr: function (t, r) {
            return t.operatorBinaryOr ? t.operatorBinaryOr(r) : t | r;
          },
          binaryXor: function (t, r) {
            return t.operatorBinaryXor ? t.operatorBinaryXor(r) : t ^ r;
          },
          binaryLShift: function (t, r) {
            return t.operatorBinaryLShift ? t.operatorBinaryLShift(r) : t << r;
          },
          binaryRShift: function (t, r) {
            return t.operatorBinaryRShift ? t.operatorBinaryRShift(r) : t >> r;
          },
          less: function (t, r) {
            return t.operatorLess
              ? t.operatorLess(r)
              : r.operatorGreater
              ? r.operatorGreater(t)
              : t.operatorGreaterEqual
              ? !t.operatorGreaterEqual(r)
              : t < r;
          },
          greater: function (t, r) {
            return t.operatorGreater
              ? t.operatorGreater(r)
              : r.operatorLess
              ? r.operatorLess(t)
              : t.operatorLessEqual
              ? !t.operatorLessEqual(r)
              : t > r;
          },
          lessEqual: function (t, r) {
            return t.operatorLessEqual
              ? t.operatorLessEqual(r)
              : r.operatorGreaterEqual
              ? r.operatorGreaterEqual(t)
              : t.operatorGreater
              ? !t.operatorGreater(r)
              : t <= r;
          },
          greaterEqual: function (t, r) {
            return t.operatorGreaterEqual
              ? t.operatorGreaterEqual(r)
              : r.operatorLessEqual
              ? r.operatorLessEqual(t)
              : t.operatorLess
              ? !t.operatorLess(r)
              : t >= r;
          },
          equal: function (t, r) {
            return t.operatorEqual
              ? t.operatorEqual(r)
              : t.operatorNotEqual
              ? !t.operatorNotEqual(r)
              : r.operatorEqual
              ? r.operatorEqual(t)
              : r.operatorNotEqual
              ? !r.operatorNotEqual(t)
              : t == r;
          },
          notEqual: function (t, r) {
            return t.operatorNotEqual
              ? t.operatorNotEqual(r)
              : t.operatorEqual
              ? !t.operatorEqual(r)
              : r.operatorNotEqual
              ? r.operatorNotEqual(t)
              : r.operatorEqual
              ? !r.operatorEqual(t)
              : t != r;
          },
        };
      function v(t) {
        return t >= 0 ? Math.sqrt(t) : new m(0, Math.sqrt(-t));
      }
      var g = Math.sqrt(3),
        b = Math.pow(2, 1 / 3),
        S = v(-1),
        w = new m(0).operatorSub(S);
      function y(t, r, o, n) {
        if ((void 0 === n && (n = !0), r === o && 0 === r))
          return Math.pow(t, p.div(1, 3));
        var e = (function (t, r, o) {
            var n = -3 * r + 3 * o - 1,
              e = -(2 * r - o) / n,
              i = -9 * Math.pow(r, 2) + 9 * o * r + 9 * r - 9 * Math.pow(o, 2),
              a = 3 * n,
              s = b * a,
              u =
                54 * Math.pow(r, 3) -
                243 * t * Math.pow(r, 2) -
                81 * o * Math.pow(r, 2) +
                162 * Math.pow(r, 2) -
                81 * Math.pow(o, 2) * r -
                162 * t * r +
                486 * t * o * r -
                81 * o * r +
                54 * Math.pow(o, 3) -
                243 * t * Math.pow(o, 2) -
                27 * t +
                162 * t * o;
            return [4 * Math.pow(i, 3) + Math.pow(u, 2), u, e, i, a, s];
          })(t, r, o),
          i = e[0],
          a = e[1],
          s = e[2],
          u = e[3],
          c = e[4],
          h = e[5],
          f = p.pow(new m(p.add(v(i), a)), p.div(1, 3)),
          l = p.add(
            p.sub(p.div(f, h), p.div(new m(p.mul(b, u)), p.mul(f, c))),
            s
          ),
          d = [];
        p.lessEqual(i, 1e-12)
          ? ([
              l,
              p.add(
                p.add(
                  p.div(p.mul(p.sub(p.mul(S, g), 1), f), p.mul(2, h)),
                  p.div(p.mul(p.add(p.mul(S, g), 1), u), p.mul(p.mul(f, h), b))
                ),
                s
              ),
              p.add(
                p.add(
                  p.div(p.mul(p.sub(p.mul(w, g), 1), f), p.mul(2, h)),
                  p.div(p.mul(p.add(p.mul(w, g), 1), u), p.mul(p.mul(f, h), b))
                ),
                s
              ),
            ].forEach(function (t) {
              t.inRangeR(0, 1) && d.push(t.r());
            }),
            d.sort())
          : d.push(l.r());
        return n ? d[0] : d;
      }
      var E = {
        add: function (t, r) {
          return t.operatorAdd ? t.operatorAdd(r) : t + r;
        },
        sub: function (t, r) {
          return t.operatorSub ? t.operatorSub(r) : t - r;
        },
        mul: function (t, r) {
          return t.operatorMul ? t.operatorMul(r) : t * r;
        },
        div: function (t, r) {
          return t.operatorDiv ? t.operatorDiv(r) : t / r;
        },
        pow: function (t, r) {
          return t.operatorPow ? t.operatorPow(r) : Math.pow(t, r);
        },
        binaryAnd: function (t, r) {
          return t.operatorBinaryAnd ? t.operatorBinaryAnd(r) : t & r;
        },
        binaryOr: function (t, r) {
          return t.operatorBinaryOr ? t.operatorBinaryOr(r) : t | r;
        },
        binaryXor: function (t, r) {
          return t.operatorBinaryXor ? t.operatorBinaryXor(r) : t ^ r;
        },
        binaryLShift: function (t, r) {
          return t.operatorBinaryLShift ? t.operatorBinaryLShift(r) : t << r;
        },
        binaryRShift: function (t, r) {
          return t.operatorBinaryRShift ? t.operatorBinaryRShift(r) : t >> r;
        },
        less: function (t, r) {
          return t.operatorLess
            ? t.operatorLess(r)
            : r.operatorGreater
            ? r.operatorGreater(t)
            : t.operatorGreaterEqual
            ? !t.operatorGreaterEqual(r)
            : t < r;
        },
        greater: function (t, r) {
          return t.operatorGreater
            ? t.operatorGreater(r)
            : r.operatorLess
            ? r.operatorLess(t)
            : t.operatorLessEqual
            ? !t.operatorLessEqual(r)
            : t > r;
        },
        lessEqual: function (t, r) {
          return t.operatorLessEqual
            ? t.operatorLessEqual(r)
            : r.operatorGreaterEqual
            ? r.operatorGreaterEqual(t)
            : t.operatorGreater
            ? !t.operatorGreater(r)
            : t <= r;
        },
        greaterEqual: function (t, r) {
          return t.operatorGreaterEqual
            ? t.operatorGreaterEqual(r)
            : r.operatorLessEqual
            ? r.operatorLessEqual(t)
            : t.operatorLess
            ? !t.operatorLess(r)
            : t >= r;
        },
        equal: function (t, r) {
          return t.operatorEqual
            ? t.operatorEqual(r)
            : t.operatorNotEqual
            ? !t.operatorNotEqual(r)
            : r.operatorEqual
            ? r.operatorEqual(t)
            : r.operatorNotEqual
            ? !r.operatorNotEqual(t)
            : t == r;
        },
        notEqual: function (t, r) {
          return t.operatorNotEqual
            ? t.operatorNotEqual(r)
            : t.operatorEqual
            ? !t.operatorEqual(r)
            : r.operatorNotEqual
            ? r.operatorNotEqual(t)
            : r.operatorEqual
            ? !r.operatorEqual(t)
            : t != r;
        },
      };
      function M(t, r, o) {
        void 0 === o && (o = "x");
        var n = t[0],
          e = t[1],
          i = t[2],
          a = t[3],
          s = "x" === o ? y(r, n, i) : "y" === o ? y(r, e, a) : r,
          u = function (t, r) {
            return E.add(E.mul(E.sub(r, t), s), t);
          },
          c = new l([0, 0]),
          h = new l([n, e]),
          f = new l([i, a]),
          d = new l([1, 1]),
          m = u(c, h),
          p = u(h, f),
          v = u(f, d),
          g = u(m, p),
          b = u(p, v),
          S = u(g, b),
          w = [m, g].map(function (t) {
            return E.div(t, E.add(S, 1e-9));
          }),
          M = w[0],
          T = w[1],
          R = [b, v].map(function (t) {
            return E.div(E.sub(t, S), E.add(E.sub(d, S), 1e-9));
          }),
          q = R[0],
          x = R[1];
        return [[].concat(M.v(), T.v()), [].concat(q.v(), x.v())];
      }
      function T(t, r, o) {
        return (
          3 * t * o * Math.pow(1 - o, 2) +
          3 * r * (1 - o) * Math.pow(o, 2) +
          Math.pow(o, 3)
        );
      }
      function R(t, r, o) {
        void 0 === o && (o = "x");
        var n = t[0],
          e = t[1],
          i = t[2],
          a = t[3],
          s =
            0 === r
              ? 0
              : 1 === r
              ? 1
              : "x" === o
              ? y(r, n, i)
              : "y" === o
              ? y(r, e, a)
              : r;
        return ["x" === o ? r : T(n, i, s), "y" === o ? r : T(e, a, s)];
      }
      function q(t) {
        return window.requestAnimationFrame
          ? window.requestAnimationFrame(t)
          : setTimeout(t, e);
      }
      function x(t) {
        return window.requestAnimationFrame
          ? window.cancelAnimationFrame(t)
          : clearTimeout(t, e);
      }
      var X = (function () {
        function t(t) {
          var r = this;
          void 0 === t && (t = {}),
            o(this, "setBounce", function (t) {
              !isNaN(t) && (r.bouncing = Number(t));
            }),
            o(this, "setDamp", function (t) {
              void 0 === t && (t = 0), !isNaN(t) && (r.damp = Number(t));
            }),
            o(this, "setTransform", function (t, o) {
              if (
                (void 0 === t && (t = {}),
                void 0 === o && (o = {}),
                r.fixedX && t.translateX && delete t.translateX,
                r.fixedY && t.translateY && delete t.translateY,
                o.merge)
              ) {
                ["translateX", "translateY", "scale"].forEach(function (o) {
                  void 0 !== t[o] && (r.transform[o] = parseFloat(t[o]));
                });
                var e = t.transformOrigin;
                e instanceof Array &&
                  2 === e.length &&
                  (r.transform.transformOrigin = e.map(function (t) {
                    return parseFloat(t);
                  }));
              } else r.transform = n({}, t);
              return o.silent || r.update(), r;
            }),
            o(this, "on", function (t, o) {
              if (o && "function" == typeof o) {
                var e = "on" + t[0].toUpperCase() + t.slice(1);
                r[e] &&
                  (r[e] =
                    "onTransform" === e
                      ? function () {
                          return o(n({}, r.transform), {
                            complete: !r.busy(),
                            dirty: r.dirty(),
                          });
                        }
                      : o);
              }
              return r;
            }),
            o(this, "restore", function (t) {
              if (!t) {
                var o = r.transform;
                q(function () {
                  r.onRestore(o);
                });
              }
              r.dragMode === i
                ? r.zoomTo(1, { fitEdge: !0 })
                : r.setTransform({}, { merge: !1, silent: t });
            }),
            o(this, "getTransform", function (t) {
              switch (t) {
                case "css":
                  return r.toCSS();
                case "style":
                  return r.toStyle();
                default:
                  return n({}, r.transform);
              }
            }),
            o(this, "dirty", function () {
              var t = r.transform,
                o = t.translateX,
                n = void 0 === o ? 0 : o,
                e = t.translateY,
                i = void 0 === e ? 0 : e,
                a = t.scale;
              return 0 !== n || 0 !== i || 1 !== (void 0 === a ? 1 : a);
            }),
            o(this, "busy", function () {
              return !r.disableContentTouch || r.cancelSwipe || r.animating;
            }),
            o(this, "isTapStop", function () {
              return r.isTapStopped;
            }),
            o(this, "apply", function () {
              if (r.dom) {
                var t = r.toCSS();
                (r.dom.style.transform = t.transform || ""),
                  (r.dom.style.webkitTransform = t.transform || ""),
                  (r.dom.style.transformOrigin =
                    t.transformOrigin || "center center"),
                  (r.dom.style.webkitTransformOrigin =
                    t.transformOrigin || "center center");
              }
              r.onTransform(), (r.timer = 0);
            }),
            o(this, "update", function () {
              x(r.timer),
                (r.timer = q(r.apply)),
                (r.lastTransform = n({}, r.transform));
            }),
            o(this, "cancel", function () {
              x(r.timer), (r.transform = n({}, r.lastTransform));
            }),
            o(this, "toTop", function () {
              var t = r.transform.scale,
                o = void 0 === t ? 1 : t,
                n = r._remainToEdge(1, 1)[1];
              return Math.round(Math.abs(n / o));
            }),
            o(this, "toBottom", function () {
              var t = r.transform.scale,
                o = void 0 === t ? 1 : t,
                n = r._remainToEdge(1, -1)[1];
              return Math.round(Math.abs(n / o));
            }),
            o(this, "toLeft", function () {
              var t = r.transform.scale,
                o = void 0 === t ? 1 : t,
                n = r._remainToEdge(1, 1)[0];
              return Math.round(Math.abs(n / o));
            }),
            o(this, "toRight", function () {
              var t = r.transform.scale,
                o = void 0 === t ? 1 : t,
                n = r._remainToEdge(-1, 1)[0];
              return Math.round(Math.abs(n / o));
            }),
            o(this, "getOriginXY", function (t) {
              var o = t[0],
                n = t[1],
                e = r._getTransformedBounding(),
                i = e.left,
                a = e.top,
                s = r.transform.scale,
                u = void 0 === s ? 1 : s;
              return [(o - i) / u, (n - a) / u];
            }),
            o(this, "setScreenCenter", function (t, o, n) {
              var e = r.getOriginXY([t, o]),
                i = e[0],
                a = e[1];
              return r.setCenter(i, a, n);
            }),
            o(this, "setCenter", function (t, o, n) {
              var e = r.transform,
                i = r.fixedX,
                a = r.fixedY,
                s = r.boundingRect,
                u = r.viewport,
                c = e.translateX,
                h = void 0 === c ? 0 : c,
                f = e.translateY,
                l = void 0 === f ? 0 : f,
                d = e.scale,
                m = void 0 === d ? 1 : d,
                p = e.transformOrigin,
                v = s || u,
                g = v.top,
                b = v.bottom,
                S = v.left,
                w = v.right;
              if ((p || (p = [(w - S) / 2, (b - g) / 2]), !i)) {
                var y = t - p[0];
                (t = p[0] + y),
                  (e.translateX = h + (y * (m - 1)) / m),
                  (p[0] = t);
              }
              if (!a) {
                var E = o - p[1];
                (o = p[1] + E),
                  (e.translateY = l + (E * (m - 1)) / m),
                  (p[1] = o);
              }
              (e.transformOrigin = p), n && r.update();
            }),
            o(this, "zoomToScreenCenter", function (t, o, e) {
              void 0 === e && (e = {});
              var i = o[0],
                a = o[1];
              r.setScreenCenter(i, a, !0),
                q(function () {
                  return q(function () {
                    r.zoomTo(t, n({ fitEdge: !0 }, e));
                  });
                });
            }),
            o(this, "zoomToCenter", function (t, o, e) {
              void 0 === e && (e = {});
              var i = o[0],
                a = o[1];
              r.setCenter(i, a, !0),
                q(function () {
                  return q(function () {
                    r.zoomTo(t, n({ fitEdge: !0 }, e));
                  });
                });
            }),
            o(this, "zoomTo", function (t, o) {
              void 0 === o && (o = {});
              var n = o,
                e = n.transition,
                i = void 0 === e ? "all" : e,
                a = n.easingFunc,
                s = void 0 === a ? "ease-out" : a,
                u = n.duration,
                c = void 0 === u ? 0 : u,
                h = n.silent,
                f = void 0 === h || h,
                l = n.fitEdge,
                d = void 0 !== l && l,
                m = n.callback,
                p = r.maxScale,
                v = void 0 === p ? 1 : p,
                g = r.minScale,
                b = void 0 === g ? 1 : g,
                S = r.transform,
                w = S.scale,
                y = void 0 === w ? 1 : w,
                E = S.translateX,
                M = void 0 === E ? 0 : E,
                T = S.translateY,
                R = void 0 === T ? 0 : T,
                q = Math.max(Math.min(t, v), b),
                x = q / y;
              (r.transform.scale = q),
                (r.transform.translateX = M / x),
                (r.transform.translateY = R / x),
                d && r.fit(!1),
                r.dom && c
                  ? ((r.dom.style.transition = i + " " + c + "ms " + s),
                    (r.animating = !0),
                    setTimeout(function () {
                      (r.dom.style.transition = ""),
                        (r.animating = !1),
                        !f && r.onZoomEnd(null, q),
                        "function" == typeof m && m(q);
                    }, c))
                  : "function" == typeof m && m(q),
                r.update();
            }),
            o(this, "zoom", function (t, o) {
              void 0 === t && (t = 1), void 0 === o && (o = {});
              var n = r.transform.scale,
                e = void 0 === n ? 1 : n;
              r.zoomTo(e * t, o);
            }),
            o(this, "drag", function (t, o, n, e, i) {
              var a = r.transform,
                s = r.interActBound,
                u = r.fixedX,
                c = r.fixedY,
                h = r.bounceRateX,
                f = r.bounceRateY,
                l = a.translateX,
                d = void 0 === l ? 0 : l,
                m = a.translateY,
                p = void 0 === m ? 0 : m,
                v = a.scale,
                g = void 0 === v ? 1 : v;
              u && (t = 0), c && (o = 0);
              var b = r._remainToEdge(t, o, s),
                S = b[0],
                w = b[1],
                y = (S + t) * t > 0,
                E = (w + o) * o > 0,
                M = 0,
                T = 0,
                R = Math.abs(t) > Math.abs(o),
                q = (R && y) || (!R && E);
              t &&
                ((M = e ? t : r._getDragV(t, S, y, n ? h : 0)),
                (r.transform.translateX = d + M / g)),
                o &&
                  ((T = i ? o : r._getDragV(o, w, E, n ? f : 0)),
                  (r.transform.translateY = p + T / g));
              var x = [u ? 0 : -S, c ? 0 : -w];
              if ((r.update(), r.interActBound)) {
                var X = s.left,
                  B = s.right,
                  N = s.top,
                  Y = s.bottom;
                r.interActBound = {
                  left: X + M,
                  right: B + M,
                  top: N + T,
                  bottom: Y + T,
                };
              }
              return { toEdge: q, remain: x };
            }),
            o(this, "fit", function (t, o, n) {
              void 0 === t && (t = !0);
              var e = !1,
                i = r.transform,
                a = i.translateX,
                s = void 0 === a ? 0 : a,
                u = i.translateY,
                c = void 0 === u ? 0 : u,
                h = i.scale,
                f = void 0 === h ? 1 : h,
                l = r._outOfEdge(),
                d = l.outX,
                m = l.outY,
                p = l.outLeft,
                v = l.outRight,
                g = l.outTop,
                b = l.outBottom;
              return (
                !o &&
                  d &&
                  (v && (r.transform.translateX = s + v / f),
                  p && (r.transform.translateX = s + p / f),
                  (e = !0)),
                !n &&
                  m &&
                  (b && (r.transform.translateY = c + b / f),
                  g && (r.transform.translateY = c + g / f),
                  (e = !0)),
                e && t && r.bounce(),
                r.update(),
                e
              );
            }),
            o(this, "fitX", function (t) {
              return void 0 === t && (t = !0), r.fit(t, !1, !0);
            }),
            o(this, "fitY", function (t) {
              return void 0 === t && (t = !0), r.fit(t, !0, !1);
            }),
            o(this, "swipe", function (t) {
              if (r.damp) {
                var o = h(t);
                if (isNaN(o)) return;
                r.cancelSwipe && r.cancelSwipe();
                var n = 0,
                  i = Math.ceil(o / r.damp),
                  a = r.transform,
                  u = a.translateX,
                  c = void 0 === u ? 0 : u,
                  f = a.translateY,
                  l = void 0 === f ? 0 : f,
                  d = a.scale,
                  m = void 0 === d ? 1 : d,
                  p = [].concat(r.cubic.scroll),
                  v = [].concat(r.cubic.bounce);
                if (r.dom) {
                  var g = 850,
                    b = [null, p],
                    S = 0,
                    w = 0,
                    y = 0,
                    E = [[0, [c * m, l * m]]],
                    M = function () {
                      (S = 0), r.cancelSwipe();
                    },
                    T = (t[0] * i) / 2,
                    X = (t[1] * i) / 2,
                    B = r.bounceRateX,
                    N = r.bounceRateY,
                    Y = r._outOfEdge(),
                    D = Y.outX,
                    L = Y.outY,
                    _ = r.drag(T, X, !1, B, N).remain,
                    C = r._outOfEdge(),
                    O = C.outX,
                    A = C.outY;
                  (O || A) && (b[1] = v);
                  var I = 0.33 * window.innerWidth,
                    G = 0.33 * window.innerHeight;
                  if (r.swipeMode === s) {
                    r.cancel();
                    var z = r._setSwipeBounceByAnimation(
                        X,
                        _[1],
                        A,
                        L,
                        N,
                        g,
                        b[1],
                        G
                      ),
                      F = r._setSwipeBounceByAnimation(
                        T,
                        _[0],
                        O,
                        D,
                        B,
                        g,
                        b[1],
                        I
                      ),
                      V = F.length > 1,
                      k = z.length > 1;
                    [F, z].forEach(function (t, r) {
                      return t.forEach(function (t) {
                        t[1] += E[0][1][r];
                        for (var o = 0; o < E.length; o += 1) {
                          if (t[0] === E[o][0]) return void (E[o][1][r] = t[1]);
                          if (t[0] < E[o][0]) {
                            var n = [null, null];
                            return (
                              (n[r] = t[1]), void E.splice(o, 0, [t[0], n])
                            );
                          }
                        }
                        var e = [null, null];
                        (e[r] = t[1]), E.push([t[0], e]);
                      });
                    });
                    var j = E[E.length - 1][0],
                      P = {};
                    E.forEach(function (t, r) {
                      var o = t[0];
                      t[1].map(function (n, e) {
                        if (null === n) {
                          for (
                            var i = E[r - 1][1][e],
                              a = E[r - 1][0],
                              s = i,
                              u = a,
                              c = r + 1;
                            c < E.length;
                            c += 1
                          )
                            if (null !== E[c][1][e]) {
                              (s = E[c][1][e]), (u = E[c][0]);
                              break;
                            }
                          if (a !== u) {
                            var h = [];
                            [a, o, u].forEach(function (t, r) {
                              h[r] = P[t] ? P[t] : R(b[1], t / j, "x")[1];
                            }),
                              (t[1][e] =
                                i + ((s - i) * (h[1] - h[0])) / (h[2] - h[0]));
                          } else t[1][e] = i;
                        }
                      });
                    }),
                      E.forEach(function (t) {
                        t[1] =
                          "transform: " +
                          r.toCSS({
                            translateX: t[1][0] / m,
                            translateY: t[1][1] / m,
                            scale: m,
                          }).transform;
                      }),
                      r._appendAnimation(
                        E,
                        "cubic-bezier(" + b[1].join(","),
                        j
                      ),
                      (S = setTimeout(M, j + e)),
                      (r.cancelSwipe = function () {
                        r._stopAnimation(),
                          r._syncDom(),
                          (r.dom.style.animation = ""),
                          S && (clearTimeout(S), (V || k) && r.fit(!1)),
                          (r.cancelSwipe = null),
                          r.onSwipeEnd(r.transform);
                      });
                  } else
                    (r.dom.style.transition =
                      "transform " +
                      g +
                      "ms cubic-bezier(" +
                      b[1].join(",") +
                      ")"),
                      (n = q(function () {
                        S = setTimeout(M, g);
                        var t = function (t) {
                          var r = t(g, b) || {};
                          (g = r.swipeSpan || g),
                            (b = r.cubicBezier || b),
                            clearTimeout(S),
                            (S = setTimeout(M, g));
                        };
                        O &&
                          (D && T * _[0] > 0
                            ? r.fitX(!1)
                            : ((b[1] = [].concat(v)),
                              (w = r._setSwipeBounce(T, _[0], B, t, "x", I)))),
                          A &&
                            (L && X * _[1] > 0
                              ? r.fitY(!1)
                              : ((b[1] = [].concat(v)),
                                (y = r._setSwipeBounce(
                                  X,
                                  _[1],
                                  N,
                                  t,
                                  "y",
                                  G
                                ))));
                      })),
                      (r.cancelSwipe = function () {
                        n && x(n),
                          S &&
                            (w && clearTimeout(w),
                            y && clearTimeout(y),
                            clearTimeout(S),
                            r._syncDom(),
                            (w || y) && r.fit(!1)),
                          (r.dom.style.transition = ""),
                          (r.cancelSwipe = null),
                          r.onSwipeEnd(r.transform);
                      });
                } else {
                  var Z = t[0] / i,
                    H = t[1] / i;
                  n = q(function t() {
                    var o = (i - 0.5) * Z,
                      e = (i - 0.5) * H;
                    r.drag(o, e),
                      (i -= 1) > 0
                        ? ((n = q(t)),
                          (r.cancelSwipe = function () {
                            n && x(n),
                              (r.cancelSwipe = null),
                              r.onSwipeEnd(r.transform);
                          }))
                        : ((n = 0), r.cancelSwipe());
                  });
                }
              }
            }),
            o(this, "bounce", function () {
              var t = r.bouncing;
              t &&
                r.dom &&
                ((r.dom.style.transition =
                  "all " + t + "ms cubic-bezier(.14, 1, .34, 1)"),
                (r.animating = !0),
                setTimeout(function () {
                  (r.animating = !1), (r.dom.style.transition = "");
                }, t));
            }),
            o(this, "touchStart", function (t) {
              if (((r.disableContentTouch = !0), r.active && !r.animating))
                if (
                  ((r.scaling = !1),
                  (r.dragging = !1),
                  r.cancelSwipe
                    ? (r.cancelSwipe(), (r.isTapStopped = !0))
                    : r.dirty() ||
                      (r.useDomBoundary &&
                        r.setBoundary(r.dom.getBoundingClientRect()),
                      r.onSchedule()),
                  t.touches.length > 1)
                ) {
                  var o = r.transform.scale,
                    n = void 0 === o ? 1 : o;
                  r.disableContentTouch = !1;
                  var e = r.getOriginXY([
                      (t.touches[1].clientX + t.touches[0].clientX) / 2,
                      (t.touches[1].clientY + t.touches[0].clientY) / 2,
                    ]),
                    s = e[0],
                    u = e[1];
                  (r.pinchStartCenter = [s, u]),
                    r.setCenter(s, u),
                    (r.pinchStartLen = h([
                      t.touches[1].clientX - t.touches[0].clientX,
                      t.touches[1].clientY - t.touches[0].clientY,
                    ])),
                    (r.scaling = !0),
                    r.onZoomStart(t, n, r.pinchStartCenter);
                } else if (
                  r.dragMode === i ||
                  (r.dragMode === a && r.dirty())
                ) {
                  (r.disableContentTouch = !1),
                    (r.dragStartTime = +new Date()),
                    (r.lastDragStartTime = 0);
                  var c = t.touches && t.touches[0] ? t.touches[0].clientX : 0,
                    f = t.touches && t.touches[0] ? t.touches[0].clientY : 0;
                  (r.dragStartV = [c, f]),
                    (r.lastDragStartV = []),
                    (r.dragX = c),
                    (r.dragY = f);
                }
            }),
            o(this, "touchMove", function (t) {
              if (!r.disableContentTouch) {
                var o = t.changedTouches,
                  n = void 0 === o ? [] : o;
                if (r.scaling) {
                  if (t.touches.length > 1) {
                    var e = h([
                      t.touches[1].clientX - t.touches[0].clientX,
                      t.touches[1].clientY - t.touches[0].clientY,
                    ]);
                    r.zoom(e / r.pinchStartLen), (r.pinchStartLen = e);
                  }
                } else {
                  var i = n[0] ? n[0].clientX : 0,
                    a = n[0] ? n[0].clientY : 0,
                    s = i - r.dragX,
                    u = a - r.dragY,
                    c = r.drag(s, u, r.dragging).toEdge;
                  (r.dragX = i), (r.dragY = a);
                  var f = +new Date();
                  f > r.dragStartTime + 100 &&
                    ((r.lastDragStartV = r.dragStartV),
                    (r.lastDragStartTime = r.dragStartTime),
                    (r.dragStartTime = f),
                    (r.dragStartV = [i, a])),
                    r.dragging ||
                      ((r.dragging = !0),
                      c
                        ? (r.disableContentTouch = !0)
                        : (r.onDragStart(t),
                          (r.interActBound = r._getTransformedBounding(!0))));
                }
                r.preventScroll && t.preventDefault();
              }
            }),
            o(this, "touchEnd", function (t) {
              if (!r.disableContentTouch && 0 === t.touches.length) {
                var o = r.transform.scale,
                  n = void 0 === o ? 1 : o;
                if (r.scaling)
                  r.onZoomEnd(t, n, r.pinchStartCenter),
                    n < 1 ? r.restore() : r.fit();
                else if (r.dragging) {
                  var i = +new Date() - r.dragStartTime,
                    a = r.dragStartV;
                  i < 50 &&
                    r.lastDragStartTime &&
                    ((i = +new Date() - r.lastDragStartTime),
                    (a = r.lastDragStartV));
                  var s = [
                      t.changedTouches && t.changedTouches[0]
                        ? t.changedTouches[0].clientX
                        : 0,
                      t.changedTouches && t.changedTouches[0]
                        ? t.changedTouches[0].clientY
                        : 0,
                    ],
                    u = [(e * (s[0] - a[0])) / i, (e * (s[1] - a[1])) / i];
                  r.onDragEnd(t),
                    h(u) > r.motionThreshold ? r.swipe(u) : r.fit();
                }
                q(function () {
                  (r.disableContentTouch = !0),
                    (r.pinchStartLen = 0),
                    (r.interActBound = null),
                    (r.isTapStopped = !1);
                });
              }
            }),
            o(this, "_outOfEdge", function () {
              var t = r._getTransformedBounding(),
                o = t.left,
                n = t.right,
                e = t.top,
                i = t.bottom,
                a = r.edges,
                s = a.left - o,
                u = a.right - n,
                c = a.top - e,
                h = a.bottom - i,
                f = s < 0 ? s : 0,
                l = u > 0 ? u : 0,
                d = c < 0 ? c : 0,
                m = h > 0 ? h : 0;
              return {
                outX: !(!f && !l),
                outY: !(!d && !m),
                outLeft: f,
                outRight: l,
                outTop: d,
                outBottom: m,
              };
            }),
            o(this, "_remainToEdge", function (t, o, n) {
              var e = [0, 0],
                i = r.edges,
                a = n || r._getTransformedBounding(),
                s = a.left,
                u = a.right,
                c = a.top,
                h = a.bottom,
                f = t > 0 ? i.left : i.right,
                l = o > 0 ? i.top : i.bottom,
                d = t > 0 ? s : u,
                m = o > 0 ? c : h;
              return (e[0] = d - f), (e[1] = m - l), e;
            }),
            o(this, "_computeEdge", function () {
              var t = r.viewport,
                o = t.left,
                e = t.right,
                i = t.top,
                a = t.bottom;
              if (r.boundingRect) {
                var s = r.boundingRect,
                  u = s.left,
                  c = s.right,
                  h = s.top,
                  f = s.bottom;
                r.edges = {
                  left: Math.max(u, o),
                  top: Math.max(h, i),
                  right: Math.min(c, e),
                  bottom: Math.min(f, a),
                };
              } else r.edges = n({}, r.viewport);
            }),
            (this.dom = null),
            (this.useDomBoundary = !1),
            (this.viewport = {
              left: 0,
              right: window.innerWidth,
              top: 0,
              bottom: window.innerHeight,
            }),
            (this.maxScale = 2),
            (this.minScale = 0.5),
            (this.fixedX = !1),
            (this.fixedY = !1),
            (this.active = !0),
            (this.preventScroll = !0),
            (this.dragMode = a),
            (this.swipeMode = s),
            (this.transformMode = u),
            (this.transform = {}),
            (this.onZoomStart = function () {}),
            (this.onZoomEnd = function () {}),
            (this.onDragStart = function () {}),
            (this.onDragEnd = function () {}),
            (this.onSwipeEnd = function () {}),
            (this.onTransform = function () {}),
            (this.onRestore = function () {}),
            (this.onSchedule = function () {}),
            (this.cubic = {
              scroll: [0.33, 1, 0.66, 1],
              bounce: [0.17, 1, 0.17, 1],
            }),
            (this.bouncing = 300),
            (this.bounceRateX = 0),
            (this.bounceRateY = 0),
            (this.damp = 2),
            (this.motionThreshold = 10),
            this.config(t),
            (this.boundingRect = null),
            (this.disableContentTouch = !0),
            (this.scaling = !1),
            (this.pinchStartCenter = []),
            (this.pinchStartLen = 0),
            (this.dragging = !1),
            (this.dragX = 0),
            (this.dragY = 0),
            (this.dragStartTime = 0),
            (this.dragStartV = [0, 0]),
            (this.edges = {}),
            (this.timer = 0),
            (this.animating = !1),
            (this.cancelSwipe = null),
            (this.isTapStopped = !1),
            (this.interActBound = null),
            this._computeEdge(),
            (this.lastTransform = {}),
            (this.animationStyleDom = null);
        }
        var r = t.prototype;
        return (
          (r.enable = function () {
            return (this.active = !0), this;
          }),
          (r.disable = function () {
            return (this.active = !1), this;
          }),
          (r.config = function (t) {
            void 0 === t && (t = {});
            var r = t,
              o = r.viewport,
              n = r.dom,
              e = r.useDomBoundary,
              i = r.maxScale,
              a = r.minScale,
              s = r.fixedX,
              u = r.fixedY,
              c = r.bounceRateX,
              h = r.bounceRateY,
              f = r.active,
              l = r.preventScroll,
              d = r.transform,
              m = r.damp,
              p = r.dragMode,
              v = r.swipeMode,
              g = r.cubic,
              b = r.transformMode,
              S = r.motionThreshold,
              w = r.bounce,
              y = r.onZoomStart,
              E = r.onZoomEnd,
              M = r.onDragStart,
              T = r.onDragEnd,
              R = r.onSwipeEnd,
              q = r.onTransform,
              x = r.onRestore,
              X = r.onSchedule;
            return (
              o && this.setViewport(o),
              n && this.setDom(n, e),
              i && this.setMaxScale(i),
              a && this.setMinScale(a),
              p && this.setDragMode(p),
              v && this.setSwipeMode(v),
              b && this.setTransformMode(b),
              g && this.setCubic(g),
              void 0 !== S && this.setMotionThreshold(S),
              void 0 !== c && this.setBounceRateX(c),
              void 0 !== h && this.setBounceRateY(h),
              void 0 !== s && this.setFixedX(s),
              void 0 !== u && this.setFixedY(u),
              void 0 !== f && (this.active = Boolean(f)),
              void 0 !== l && (this.preventScroll = Boolean(l)),
              d && this.setTransform(d),
              void 0 !== m && this.setDamp(m),
              void 0 !== w && this.setBounce(w),
              this.on("transform", q)
                .on("restore", x)
                .on("schedule", X)
                .on("zoomStart", y)
                .on("zoomEnd", E)
                .on("dragStart", M)
                .on("dragEnd", T)
                .on("swipeEnd", R),
              this
            );
          }),
          (r.setDom = function (t, r) {
            var o = this;
            return (
              void 0 === r && (r = !0),
              t &&
                ((this.useDomBoundary = r),
                this.dom !== t &&
                  (this.removeDom(),
                  (this.dom = t),
                  t.addEventListener("touchstart", this.touchStart),
                  t.addEventListener("touchmove", this.touchMove),
                  t.addEventListener("touchend", this.touchEnd),
                  t.addEventListener("touchcancel", this.touchEnd),
                  (t.style.willChange = "transform"),
                  (t.style.transition = ""),
                  (t.style.transform = ""),
                  (t.style.webkitTransform = ""),
                  (t.style.transformOrigin = ""),
                  (t.style.webkitTransformOrigin = ""),
                  (this.transform = {}),
                  (this.lastTransform = {}),
                  r &&
                    q(function () {
                      o.boundingRect ||
                        o.setBoundary(t.getBoundingClientRect());
                    }))),
              this
            );
          }),
          (r.setBoundary = function (t, r) {
            void 0 === r && (r = !1);
            var o = r ? this._getRawBounding(t) : t,
              e = o.left,
              i = o.right,
              a = o.top,
              s = o.bottom;
            return (
              (this.boundingRect = n({}, this.boundingRect || this.viewport, {
                left: e,
                right: i,
                top: a,
                bottom: s,
              })),
              this._computeEdge(),
              this
            );
          }),
          (r.removeDom = function () {
            return (
              this.dom &&
                (this.dom.removeEventListener("touchstart", this.touchStart),
                this.dom.removeEventListener("touchmove", this.touchMove),
                this.dom.removeEventListener("touchend", this.touchEnd),
                this.dom.removeEventListener("touchcancel", this.touchEnd)),
              this
            );
          }),
          (r.setMaxScale = function (t) {
            return isNaN(t) || (this.maxScale = Math.max(Number(t), 1)), this;
          }),
          (r.setMinScale = function (t) {
            return isNaN(t) || (this.minScale = Math.min(Number(t), 1)), this;
          }),
          (r.setMotionThreshold = function (t) {
            return isNaN(t) || (this.motionThreshold = t), this;
          }),
          (r.setCubic = function (t) {
            for (var r in (void 0 === t && (t = {}), t))
              t[r] instanceof Array &&
                4 === t[r].length &&
                (this.cubic[r] = t[r].map(function (t) {
                  return isNaN(Number(t)) ? Number(t) : 0;
                }));
            return this;
          }),
          (r.setDragMode = function (t) {
            this.dragMode = t;
          }),
          (r.setSwipeMode = function (t) {
            this.swipeMode = t;
          }),
          (r.setTransformMode = function (t) {
            this.transformMode = t;
          }),
          (r.setBounceRateX = function (t) {
            return (
              isNaN(t) || (this.bounceRateX = Math.min(Number(t), 1)), this
            );
          }),
          (r.setBounceRateY = function (t) {
            return (
              isNaN(t) || (this.bounceRateY = Math.min(Number(t), 1)), this
            );
          }),
          (r.setViewport = function (t) {
            var r = this;
            void 0 === t && (t = {});
            var o = !1;
            return (
              ["left", "right", "top", "bottom"].forEach(function (n) {
                var e = Number(t[n]);
                isNaN(e) || ((r.viewport[n] = e), (o = !0));
              }),
              o && this._computeEdge(),
              this
            );
          }),
          (r.setFixedX = function (t) {
            if (((this.fixedX = !!t), t)) {
              var r = this.transform.transformOrigin;
              if (r) {
                var o = this.boundingRect || this.viewport,
                  n = o.left,
                  e = o.right;
                r[0] = (e - n) / 2;
              }
              this.setTransform({ translateX: 0 }, { merge: !0 });
            }
            return this;
          }),
          (r.setFixedY = function (t) {
            if (((this.fixedY = !!t), t)) {
              var r = this.transform.transformOrigin;
              if (r) {
                var o = this.boundingRect || this.viewport,
                  n = o.top,
                  e = o.bottom;
                r[1] = (e - n) / 2;
              }
              this.setTransform({ translateY: 0 }, { merge: !0 });
            }
            return this;
          }),
          (r.toStyle = function () {
            var t = this.toCSS(),
              r = t.transform,
              o = t.transformOrigin,
              n = "";
            return (
              r && (n += "transform: " + r),
              o && (n += "transform-origin: " + o),
              n
            );
          }),
          (r.toCSS = function (t) {
            var r = "",
              o = "center";
            if (t || this.dirty()) {
              var n = t || this.transform;
              if (this.transformMode === u) {
                var e = this.transform.scale,
                  i = void 0 === e ? 1 : e;
                ["translateX", "translateY"].forEach(function (t) {
                  void 0 !== n[t] && (r += t + "(" + n[t] * i + "px)");
                }),
                  (r += "scale(" + i + ")");
              } else if (this.transformMode === c)
                ["scale", "translateX", "translateY"].forEach(function (t, o) {
                  var e = o ? "px" : "";
                  void 0 !== n[t] && (r += t + "(" + n[t] + e + ")");
                });
              else {
                var a = n.scale,
                  s = void 0 === a ? 1 : a,
                  h = n.translateX,
                  f = void 0 === h ? 0 : h,
                  l = n.translateY;
                r =
                  "matrix(" +
                  s +
                  ", 0, 0, " +
                  s +
                  ", " +
                  f * s +
                  ", " +
                  (void 0 === l ? 0 : l) * s +
                  ")";
              }
            }
            return (
              this.transform.transformOrigin &&
                (o = this.transform.transformOrigin
                  .map(function (t) {
                    return Math.round(t) + "px";
                  })
                  .join(" ")),
              { transform: r, transformOrigin: o }
            );
          }),
          (r._getTransformedBounding = function () {
            var t = this.boundingRect,
              r = this.viewport,
              o = this.transform,
              n = t || r,
              e = n.left,
              i = n.top,
              a = n.right,
              s = n.bottom,
              u = o.scale,
              c = void 0 === u ? 1 : u,
              h = o.transformOrigin,
              f = void 0 === h ? [(a - e) / 2, (s - i) / 2] : h,
              l = o.translateX,
              d = void 0 === l ? 0 : l,
              m = o.translateY,
              p = void 0 === m ? 0 : m,
              v = f[0],
              g = f[1],
              b = (d - v) * c + v,
              S = (p - g) * c + g;
            return {
              left: e + b,
              right: e + b + (a - e) * c,
              top: i + S,
              bottom: i + S + (s - i) * c,
            };
          }),
          (r._getRawBounding = function (t) {
            var r = this.transform,
              o = t.left,
              n = t.top,
              e = t.right,
              i = t.bottom,
              a = r.scale,
              s = void 0 === a ? 1 : a,
              u = r.transformOrigin,
              c = void 0 === u ? [(e - o) / 2, (i - n) / 2] : u,
              h = r.translateX,
              f = void 0 === h ? 0 : h,
              l = r.translateY,
              d = void 0 === l ? 0 : l,
              m = c[0],
              p = c[1],
              v = (f - m) * s + m,
              g = (d - p) * s + p;
            return {
              left: o - v,
              right: o - v + (e - o) / s,
              top: n - g,
              bottom: n - g + (i - n) / s,
            };
          }),
          (r._getDragV = function (t, r, o, n) {
            var e = 0,
              i = 0;
            if (o)
              if (n) {
                var a = r * t > 0;
                (e = a ? t * n : (r + t) * n), (i = a ? e : -r + e);
              } else i = -r;
            else i = t;
            return i;
          }),
          (r._setSwipeBounceByAnimation = function (t, r, o, n, e, i, a, s) {
            void 0 === s && (s = 1 / 0);
            var u = [],
              c = t * r < 0;
            if (o)
              if (n && !c) u.push([i, r]);
              else {
                var h = (c ? t * e : (t - r) * e) / 2;
                Math.abs(h) > s && (h *= Math.abs(s / h));
                var f = h + (c ? 0 : r),
                  l = 2 * Math.abs(h) + Math.abs(r),
                  d = R(a, Math.abs(f) / l, "y")[0],
                  m = Math.floor(i * d);
                d > 0.1 || u.push([m, f]), u.push([i, r]);
              }
            else
              (t = (Math.min(Math.abs(t), Math.abs(r)) * Math.abs(t)) / t),
                u.push([i, t]);
            return u;
          }),
          (r._setSwipeBounce = function (t, r, o, n, i, a) {
            var s = this;
            void 0 === i && (i = "x"), void 0 === a && (a = 1 / 0);
            var u = t * r < 0,
              c = u ? t * o : (t - r) * o;
            Math.abs(c) > a && (c *= Math.abs(a / c));
            var h = (c + (u ? 0 : r)) / t,
              f = 0;
            return (
              n(function (t, r) {
                var o = R(r[1], h, "y"),
                  a = Math.max(Math.floor((o[0] * t) / e), 2) * e,
                  u = t - a;
                f = setTimeout(function () {
                  n(function (t, r) {
                    var o = 1 - u / t,
                      n = 0,
                      a = function () {
                        "x" === i ? s.fitX(!1) : "y" === i && s.fitY(!1),
                          s.dom &&
                            (s.dom.style.transition =
                              "transform " +
                              (u - n) +
                              "ms cubic-bezier(" +
                              r[1]
                                .map(function (t) {
                                  return t.toFixed(3);
                                })
                                .join(",") +
                              ")");
                      };
                    return (
                      o > 0
                        ? ((r = M(r[1], o, "x")), a())
                        : ((o = e / t), (n = e), (r = M(r[1], o, "x")), q(a)),
                      { cubicBezier: r, swipeSpan: u }
                    );
                  });
                }, a);
              }),
              f
            );
          }),
          (r._syncDom = function () {
            if (this.dom) {
              var t = window
                  .getComputedStyle(this.dom)
                  .getPropertyValue("transform")
                  .split(")")[0]
                  .split(", ")
                  .map(function (t) {
                    return parseFloat(t);
                  }),
                r = t[3],
                o = void 0 === r ? 1 : r,
                n = t[4],
                e = void 0 === n ? 0 : n,
                i = t[5],
                a = void 0 === i ? 0 : i;
              this.setTransform(
                {
                  scale: o,
                  translateX: Math.round(e) / o,
                  translateY: Math.round(a) / o,
                },
                { merge: !0 }
              );
            }
          }),
          (r._appendStyle = function (t) {
            if (this.animationStyleDom) {
              var r = this.animationStyleDom.firstChild;
              r && this.animationStyleDom.removeChild(r);
            } else {
              var o = document.head || document.getElementsByTagName("head")[0],
                n = document.createElement("style");
              o.appendChild(n),
                (n.type = "text/css"),
                (this.animationStyleDom = n);
            }
            this.animationStyleDom.styleSheet
              ? (this.animationStyleDom.styleSheet.cssText = t)
              : this.animationStyleDom.appendChild(document.createTextNode(t));
          }),
          (r._appendAnimation = function (t, r, o) {
            for (
              var n = this,
                e =
                  "__transformable_key_" +
                  parseInt(1e16 * (0.5 + 0.5 * Math.random())).toString(16),
                i = [],
                a = 0;
              a < t.length;
              a += 1
            ) {
              var s = t[a],
                u = s[0],
                c = s[1],
                h = Math.floor((u / o) * 100);
              i.push(h + "% { " + c + " }");
            }
            var f =
              "@keyframes " +
              e +
              " {\n            " +
              i.join("\n") +
              "\n        }";
            this._appendStyle(f),
              this.dom &&
                q(function () {
                  (n.dom.style.animation = e + " " + o + "ms " + r),
                    (n.dom.style.animationFillMode = "forwards");
                });
          }),
          (r._stopAnimation = function () {
            this.dom && (this.dom.style.animationPlayState = "paused");
          }),
          t
        );
      })();
      r.A = X;
    },
    85390() {},
    44263() {},
    13526(t, r, o) {
      function n(t) {
        var r,
          o,
          e = "";
        if ("string" == typeof t || "number" == typeof t) e += t;
        else if ("object" == typeof t)
          if (Array.isArray(t)) {
            var i = t.length;
            for (r = 0; r < i; r++)
              t[r] && (o = n(t[r])) && (e && (e += " "), (e += o));
          } else for (o in t) t[o] && (e && (e += " "), (e += o));
        return e;
      }
      function e() {
        for (var t, r, o = 0, e = "", i = arguments.length; o < i; o++)
          (t = arguments[o]) && (r = n(t)) && (e && (e += " "), (e += r));
        return e;
      }
      o.d(r, { $: () => e }), (r.A = e);
    },
  },
]);
