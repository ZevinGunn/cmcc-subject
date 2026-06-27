"use strict";
(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["1449"],
  {
    45369(t, e, i) {
      i.d(e, { f: () => Zt });
      var s = i(91765),
        n = i(34901),
        r = i(91343),
        o = i(99036),
        a = i(69423),
        l = i(32052),
        h = i(13417),
        u = i(56850),
        c = i(45631),
        d = i(26961),
        p = i(72525),
        m = i(24854),
        f = i(57605);
      function y(t, e, i) {
        return (
          i < 0 && (i += 1),
          i > 1 && (i -= 1),
          i < 1 / 6
            ? t + 6 * (e - t) * i
            : i < 0.5
            ? e
            : i < 2 / 3
            ? t + (e - t) * (2 / 3 - i) * 6
            : t
        );
      }
      var v = i(63297);
      function g(t, e) {
        return (i) => (i > 0 ? e : t);
      }
      var x = i(45147);
      const T = (t, e, i) => {
          const s = t * t,
            n = i * (e * e - s) + s;
          return n < 0 ? 0 : Math.sqrt(n);
        },
        w = [m.u, v.B, f.V];
      function S(t) {
        const e = ((i = t), w.find((t) => t.test(i)));
        var i;
        if (
          ((0, u.$)(
            Boolean(e),
            `'${t}' is not an animatable color. Use the equivalent color code instead.`,
            "color-not-animatable"
          ),
          !Boolean(e))
        )
          return !1;
        let s = e.parse(t);
        return (
          e === f.V &&
            (s = (function ({ hue: t, saturation: e, lightness: i, alpha: s }) {
              (t /= 360), (i /= 100);
              let n = 0,
                r = 0,
                o = 0;
              if ((e /= 100)) {
                const s = i < 0.5 ? i * (1 + e) : i + e - i * e,
                  a = 2 * i - s;
                (n = y(a, s, t + 1 / 3)),
                  (r = y(a, s, t)),
                  (o = y(a, s, t - 1 / 3));
              } else n = r = o = i;
              return {
                red: Math.round(255 * n),
                green: Math.round(255 * r),
                blue: Math.round(255 * o),
                alpha: s,
              };
            })(s)),
          s
        );
      }
      const b = (t, e) => {
          const i = S(t),
            s = S(e);
          if (!i || !s) return g(t, e);
          const n = { ...i };
          return (t) => (
            (n.red = T(i.red, s.red, t)),
            (n.green = T(i.green, s.green, t)),
            (n.blue = T(i.blue, s.blue, t)),
            (n.alpha = (0, x.k)(i.alpha, s.alpha, t)),
            v.B.transform(n)
          );
        },
        P = new Set(["none", "hidden"]);
      function k(t, e) {
        return (i) => (0, x.k)(t, e, i);
      }
      function V(t) {
        return "number" == typeof t
          ? k
          : "string" == typeof t
          ? (0, c.pG)(t)
            ? g
            : d.y.test(t)
            ? b
            : M
          : Array.isArray(t)
          ? A
          : "object" == typeof t
          ? d.y.test(t)
            ? b
            : D
          : g;
      }
      function A(t, e) {
        const i = [...t],
          s = i.length,
          n = t.map((t, i) => V(t)(t, e[i]));
        return (t) => {
          for (let e = 0; e < s; e++) i[e] = n[e](t);
          return i;
        };
      }
      function D(t, e) {
        const i = { ...t, ...e },
          s = {};
        for (const n in i)
          void 0 !== t[n] && void 0 !== e[n] && (s[n] = V(t[n])(t[n], e[n]));
        return (t) => {
          for (const e in s) i[e] = s[e](t);
          return i;
        };
      }
      const M = (t, e) => {
        const i = p.f.createTransformer(e),
          s = (0, p.V)(t),
          n = (0, p.V)(e);
        return s.indexes.var.length === n.indexes.var.length &&
          s.indexes.color.length === n.indexes.color.length &&
          s.indexes.number.length >= n.indexes.number.length
          ? (P.has(t) && !n.values.length) || (P.has(e) && !s.values.length)
            ? (function (t, e) {
                return P.has(t)
                  ? (i) => (i <= 0 ? t : e)
                  : (i) => (i >= 1 ? e : t);
              })(t, e)
            : (0, a.F)(
                A(
                  (function (t, e) {
                    const i = [],
                      s = { color: 0, var: 0, number: 0 };
                    for (let n = 0; n < e.values.length; n++) {
                      const r = e.types[n],
                        o = t.indexes[r][s[r]],
                        a = t.values[o] ?? 0;
                      (i[n] = a), s[r]++;
                    }
                    return i;
                  })(s, n),
                  n.values
                ),
                i
              )
          : ((0, u.$)(
              !0,
              `Complex values '${t}' and '${e}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`,
              "complex-values-different"
            ),
            g(t, e));
      };
      function C(t, e, i) {
        if (
          "number" == typeof t &&
          "number" == typeof e &&
          "number" == typeof i
        )
          return (0, x.k)(t, e, i);
        return V(t)(t, e);
      }
      var R = i(27154);
      const B = (t) => {
          const e = ({ timestamp: e }) => t(e);
          return {
            start: (t = !0) => R.Gt.update(e, t),
            stop: () => (0, R.WG)(e),
            now: () => (R.uv.isProcessing ? R.uv.timestamp : o.k.now()),
          };
        },
        E = (t, e, i = 10) => {
          let s = "";
          const n = Math.max(Math.round(e / i), 2);
          for (let e = 0; e < n; e++)
            s += Math.round(1e4 * t(e / (n - 1))) / 1e4 + ", ";
          return `linear(${s.substring(0, s.length - 2)})`;
        },
        j = 2e4;
      function F(t) {
        let e = 0;
        let i = t.next(e);
        for (; !i.done && e < j; ) (e += 50), (i = t.next(e));
        return e >= j ? 1 / 0 : e;
      }
      var L = i(6909);
      function I(t, e, i) {
        const s = Math.max(e - 5, 0);
        return (0, L.f)(i - t(s), e - s);
      }
      const O = 100,
        U = 10,
        N = 1,
        $ = 0,
        W = 800,
        X = 0.3,
        K = 0.3,
        q = { granular: 0.01, default: 2 },
        Y = { granular: 0.005, default: 0.5 },
        G = 0.01,
        Q = 10,
        z = 0.05,
        H = 1,
        Z = 0.001;
      function _({
        duration: t = W,
        bounce: e = X,
        velocity: i = $,
        mass: n = N,
      }) {
        let r, o;
        (0, u.$)(
          t <= (0, s.f)(Q),
          "Spring duration must be 10 seconds or less",
          "spring-duration-limit"
        );
        let a = 1 - e;
        (a = (0, l.q)(z, H, a)),
          (t = (0, l.q)(G, Q, (0, s.X)(t))),
          a < 1
            ? ((r = (e) => {
                const s = e * a,
                  n = s * t,
                  r = s - i,
                  o = J(e, a),
                  l = Math.exp(-n);
                return Z - (r / o) * l;
              }),
              (o = (e) => {
                const s = e * a * t,
                  n = s * i + i,
                  o = Math.pow(a, 2) * Math.pow(e, 2) * t,
                  l = Math.exp(-s),
                  h = J(Math.pow(e, 2), a);
                return ((-r(e) + Z > 0 ? -1 : 1) * ((n - o) * l)) / h;
              }))
            : ((r = (e) => Math.exp(-e * t) * ((e - i) * t + 1) - 0.001),
              (o = (e) => Math.exp(-e * t) * (t * t * (i - e))));
        const h = (function (t, e, i) {
          let s = i;
          for (let i = 1; i < 12; i++) s -= t(s) / e(s);
          return s;
        })(r, o, 5 / t);
        if (((t = (0, s.f)(t)), isNaN(h)))
          return { stiffness: O, damping: U, duration: t };
        {
          const e = Math.pow(h, 2) * n;
          return {
            stiffness: e,
            damping: 2 * a * Math.sqrt(n * e),
            duration: t,
          };
        }
      }
      function J(t, e) {
        return t * Math.sqrt(1 - e * e);
      }
      const tt = ["duration", "bounce"],
        et = ["stiffness", "damping", "mass"];
      function it(t, e) {
        return e.some((e) => void 0 !== t[e]);
      }
      function st(t = K, e = X) {
        const i =
          "object" != typeof t
            ? { visualDuration: t, keyframes: [0, 1], bounce: e }
            : t;
        let { restSpeed: n, restDelta: r } = i;
        const o = i.keyframes[0],
          a = i.keyframes[i.keyframes.length - 1],
          h = { done: !1, value: o },
          {
            stiffness: u,
            damping: c,
            mass: d,
            duration: p,
            velocity: m,
            isResolvedFromDuration: f,
          } = (function (t) {
            let e = {
              velocity: $,
              stiffness: O,
              damping: U,
              mass: N,
              isResolvedFromDuration: !1,
              ...t,
            };
            if (!it(t, et) && it(t, tt))
              if (t.visualDuration) {
                const i = t.visualDuration,
                  s = (2 * Math.PI) / (1.2 * i),
                  n = s * s,
                  r = 2 * (0, l.q)(0.05, 1, 1 - (t.bounce || 0)) * Math.sqrt(n);
                e = { ...e, mass: N, stiffness: n, damping: r };
              } else {
                const i = _(t);
                (e = { ...e, ...i, mass: N }), (e.isResolvedFromDuration = !0);
              }
            return e;
          })({ ...i, velocity: -(0, s.X)(i.velocity || 0) }),
          y = m || 0,
          v = c / (2 * Math.sqrt(u * d)),
          g = a - o,
          x = (0, s.X)(Math.sqrt(u / d)),
          T = Math.abs(g) < 5;
        let w;
        if (
          (n || (n = T ? q.granular : q.default),
          r || (r = T ? Y.granular : Y.default),
          v < 1)
        ) {
          const t = J(x, v);
          w = (e) => {
            const i = Math.exp(-v * x * e);
            return (
              a -
              i *
                (((y + v * x * g) / t) * Math.sin(t * e) + g * Math.cos(t * e))
            );
          };
        } else if (1 === v)
          w = (t) => a - Math.exp(-x * t) * (g + (y + x * g) * t);
        else {
          const t = x * Math.sqrt(v * v - 1);
          w = (e) => {
            const i = Math.exp(-v * x * e),
              s = Math.min(t * e, 300);
            return (
              a -
              (i * ((y + v * x * g) * Math.sinh(s) + t * g * Math.cosh(s))) / t
            );
          };
        }
        const S = {
          calculatedDuration: (f && p) || null,
          next: (t) => {
            const e = w(t);
            if (f) h.done = t >= p;
            else {
              let i = 0 === t ? y : 0;
              v < 1 && (i = 0 === t ? (0, s.f)(y) : I(w, t, e));
              const o = Math.abs(i) <= n,
                l = Math.abs(a - e) <= r;
              h.done = o && l;
            }
            return (h.value = h.done ? a : e), h;
          },
          toString: () => {
            const t = Math.min(F(S), j),
              e = E((e) => S.next(t * e).value, t, 30);
            return t + "ms " + e;
          },
          toTransition: () => {},
        };
        return S;
      }
      function nt({
        keyframes: t,
        velocity: e = 0,
        power: i = 0.8,
        timeConstant: s = 325,
        bounceDamping: n = 10,
        bounceStiffness: r = 500,
        modifyTarget: o,
        min: a,
        max: l,
        restDelta: h = 0.5,
        restSpeed: u,
      }) {
        const c = t[0],
          d = { done: !1, value: c },
          p = (t) =>
            void 0 === a
              ? l
              : void 0 === l || Math.abs(a - t) < Math.abs(l - t)
              ? a
              : l;
        let m = i * e;
        const f = c + m,
          y = void 0 === o ? f : o(f);
        y !== f && (m = y - c);
        const v = (t) => -m * Math.exp(-t / s),
          g = (t) => y + v(t),
          x = (t) => {
            const e = v(t),
              i = g(t);
            (d.done = Math.abs(e) <= h), (d.value = d.done ? y : i);
          };
        let T, w;
        const S = (t) => {
          var e;
          ((e = d.value), (void 0 !== a && e < a) || (void 0 !== l && e > l)) &&
            ((T = t),
            (w = st({
              keyframes: [d.value, p(d.value)],
              velocity: I(g, t, d.value),
              damping: n,
              stiffness: r,
              restDelta: h,
              restSpeed: u,
            })));
        };
        return (
          S(0),
          {
            calculatedDuration: null,
            next: (t) => {
              let e = !1;
              return (
                w || void 0 !== T || ((e = !0), x(t), S(t)),
                void 0 !== T && t >= T ? w.next(t - T) : (!e && x(t), d)
              );
            },
          }
        );
      }
      st.applyToOptions = (t) => {
        const e = (function (t, e = 100, i) {
          const n = i({ ...t, keyframes: [0, e] }),
            r = Math.min(F(n), j);
          return {
            type: "keyframes",
            ease: (t) => n.next(r * t).value / e,
            duration: (0, s.X)(r),
          };
        })(t, 100, st);
        return (
          (t.ease = e.ease),
          (t.duration = (0, s.f)(e.duration)),
          (t.type = "keyframes"),
          t
        );
      };
      var rt = i(49093),
        ot = i(65741),
        at = i(27265),
        lt = i(96006);
      function ht(t, e, { clamp: i = !0, ease: s, mixer: o } = {}) {
        const h = t.length;
        if (
          ((0, u.V)(
            h === e.length,
            "Both input and output ranges must be the same length",
            "range-length"
          ),
          1 === h)
        )
          return () => e[0];
        if (2 === h && e[0] === e[1]) return () => e[1];
        const c = t[0] === t[1];
        t[0] > t[h - 1] && ((t = [...t].reverse()), (e = [...e].reverse()));
        const d = (function (t, e, i) {
            const s = [],
              o = i || n.W.mix || C,
              l = t.length - 1;
            for (let i = 0; i < l; i++) {
              let n = o(t[i], t[i + 1]);
              if (e) {
                const t = Array.isArray(e) ? e[i] || r.l : e;
                n = (0, a.F)(t, n);
              }
              s.push(n);
            }
            return s;
          })(e, s, o),
          p = d.length,
          m = (i) => {
            if (c && i < t[0]) return e[0];
            let s = 0;
            if (p > 1) for (; s < t.length - 2 && !(i < t[s + 1]); s++);
            const n = (0, lt.q)(t[s], t[s + 1], i);
            return d[s](n);
          };
        return i ? (e) => m((0, l.q)(t[0], t[h - 1], e)) : m;
      }
      function ut(t) {
        const e = [0];
        return (
          (function (t, e) {
            const i = t[t.length - 1];
            for (let s = 1; s <= e; s++) {
              const n = (0, lt.q)(0, e, s);
              t.push((0, x.k)(i, 1, n));
            }
          })(e, t.length - 1),
          e
        );
      }
      function ct({
        duration: t = 300,
        keyframes: e,
        times: i,
        ease: s = "easeInOut",
      }) {
        const n = (0, ot.h)(s) ? s.map(at.K) : (0, at.K)(s),
          r = { done: !1, value: e[0] },
          o = (function (t, e) {
            return t.map((t) => t * e);
          })(i && i.length === e.length ? i : ut(e), t),
          a = ht(o, e, {
            ease: Array.isArray(n)
              ? n
              : ((l = e),
                (h = n),
                l.map(() => h || rt.am).splice(0, l.length - 1)),
          });
        var l, h;
        return {
          calculatedDuration: t,
          next: (e) => ((r.value = a(e)), (r.done = e >= t), r),
        };
      }
      const dt = (t) => null !== t;
      function pt(t, { repeat: e, repeatType: i = "loop" }, s, n = 1) {
        const r = t.filter(dt),
          o = n < 0 || (e && "loop" !== i && e % 2 == 1) ? 0 : r.length - 1;
        return o && void 0 !== s ? s : r[o];
      }
      const mt = {
        decay: nt,
        inertia: nt,
        tween: ct,
        keyframes: ct,
        spring: st,
      };
      function ft(t) {
        "string" == typeof t.type && (t.type = mt[t.type]);
      }
      class yt {
        constructor() {
          this.updateFinished();
        }
        get finished() {
          return this._finished;
        }
        updateFinished() {
          this._finished = new Promise((t) => {
            this.resolve = t;
          });
        }
        notifyFinished() {
          this.resolve();
        }
        then(t, e) {
          return this.finished.then(t, e);
        }
      }
      const vt = (t) => t / 100;
      class gt extends yt {
        constructor(t) {
          super(),
            (this.state = "idle"),
            (this.startTime = null),
            (this.isStopped = !1),
            (this.currentTime = 0),
            (this.holdTime = null),
            (this.playbackSpeed = 1),
            (this.stop = () => {
              const { motionValue: t } = this.options;
              t && t.updatedAt !== o.k.now() && this.tick(o.k.now()),
                (this.isStopped = !0),
                "idle" !== this.state &&
                  (this.teardown(), this.options.onStop?.());
            }),
            h.q.mainThread++,
            (this.options = t),
            this.initAnimation(),
            this.play(),
            !1 === t.autoplay && this.pause();
        }
        initAnimation() {
          const { options: t } = this;
          ft(t);
          const {
            type: e = ct,
            repeat: i = 0,
            repeatDelay: s = 0,
            repeatType: n,
            velocity: r = 0,
          } = t;
          let { keyframes: o } = t;
          const l = e || ct;
          l !== ct &&
            "number" != typeof o[0] &&
            ((this.mixKeyframes = (0, a.F)(vt, C(o[0], o[1]))), (o = [0, 100]));
          const h = l({ ...t, keyframes: o });
          "mirror" === n &&
            (this.mirroredGenerator = l({
              ...t,
              keyframes: [...o].reverse(),
              velocity: -r,
            })),
            null === h.calculatedDuration && (h.calculatedDuration = F(h));
          const { calculatedDuration: u } = h;
          (this.calculatedDuration = u),
            (this.resolvedDuration = u + s),
            (this.totalDuration = this.resolvedDuration * (i + 1) - s),
            (this.generator = h);
        }
        updateTime(t) {
          const e = Math.round(t - this.startTime) * this.playbackSpeed;
          null !== this.holdTime
            ? (this.currentTime = this.holdTime)
            : (this.currentTime = e);
        }
        tick(t, e = !1) {
          const {
            generator: i,
            totalDuration: s,
            mixKeyframes: n,
            mirroredGenerator: r,
            resolvedDuration: o,
            calculatedDuration: a,
          } = this;
          if (null === this.startTime) return i.next(0);
          const {
            delay: h = 0,
            keyframes: u,
            repeat: c,
            repeatType: d,
            repeatDelay: p,
            type: m,
            onUpdate: f,
            finalKeyframe: y,
          } = this.options;
          this.speed > 0
            ? (this.startTime = Math.min(this.startTime, t))
            : this.speed < 0 &&
              (this.startTime = Math.min(t - s / this.speed, this.startTime)),
            e ? (this.currentTime = t) : this.updateTime(t);
          const v = this.currentTime - h * (this.playbackSpeed >= 0 ? 1 : -1),
            g = this.playbackSpeed >= 0 ? v < 0 : v > s;
          (this.currentTime = Math.max(v, 0)),
            "finished" === this.state &&
              null === this.holdTime &&
              (this.currentTime = s);
          let x = this.currentTime,
            T = i;
          if (c) {
            const t = Math.min(this.currentTime, s) / o;
            let e = Math.floor(t),
              i = t % 1;
            !i && t >= 1 && (i = 1), 1 === i && e--, (e = Math.min(e, c + 1));
            Boolean(e % 2) &&
              ("reverse" === d
                ? ((i = 1 - i), p && (i -= p / o))
                : "mirror" === d && (T = r)),
              (x = (0, l.q)(0, 1, i) * o);
          }
          const w = g ? { done: !1, value: u[0] } : T.next(x);
          n && (w.value = n(w.value));
          let { done: S } = w;
          g ||
            null === a ||
            (S =
              this.playbackSpeed >= 0
                ? this.currentTime >= s
                : this.currentTime <= 0);
          const b =
            null === this.holdTime &&
            ("finished" === this.state || ("running" === this.state && S));
          return (
            b && m !== nt && (w.value = pt(u, this.options, y, this.speed)),
            f && f(w.value),
            b && this.finish(),
            w
          );
        }
        then(t, e) {
          return this.finished.then(t, e);
        }
        get duration() {
          return (0, s.X)(this.calculatedDuration);
        }
        get iterationDuration() {
          const { delay: t = 0 } = this.options || {};
          return this.duration + (0, s.X)(t);
        }
        get time() {
          return (0, s.X)(this.currentTime);
        }
        set time(t) {
          (t = (0, s.f)(t)),
            (this.currentTime = t),
            null === this.startTime ||
            null !== this.holdTime ||
            0 === this.playbackSpeed
              ? (this.holdTime = t)
              : this.driver &&
                (this.startTime = this.driver.now() - t / this.playbackSpeed),
            this.driver?.start(!1);
        }
        get speed() {
          return this.playbackSpeed;
        }
        set speed(t) {
          this.updateTime(o.k.now());
          const e = this.playbackSpeed !== t;
          (this.playbackSpeed = t),
            e && (this.time = (0, s.X)(this.currentTime));
        }
        play() {
          if (this.isStopped) return;
          const { driver: t = B, startTime: e } = this.options;
          this.driver || (this.driver = t((t) => this.tick(t))),
            this.options.onPlay?.();
          const i = this.driver.now();
          "finished" === this.state
            ? (this.updateFinished(), (this.startTime = i))
            : null !== this.holdTime
            ? (this.startTime = i - this.holdTime)
            : this.startTime || (this.startTime = e ?? i),
            "finished" === this.state &&
              this.speed < 0 &&
              (this.startTime += this.calculatedDuration),
            (this.holdTime = null),
            (this.state = "running"),
            this.driver.start();
        }
        pause() {
          (this.state = "paused"),
            this.updateTime(o.k.now()),
            (this.holdTime = this.currentTime);
        }
        complete() {
          "running" !== this.state && this.play(),
            (this.state = "finished"),
            (this.holdTime = null);
        }
        finish() {
          this.notifyFinished(),
            this.teardown(),
            (this.state = "finished"),
            this.options.onComplete?.();
        }
        cancel() {
          (this.holdTime = null),
            (this.startTime = 0),
            this.tick(0),
            this.teardown(),
            this.options.onCancel?.();
        }
        teardown() {
          (this.state = "idle"),
            this.stopDriver(),
            (this.startTime = this.holdTime = null),
            h.q.mainThread--;
        }
        stopDriver() {
          this.driver && (this.driver.stop(), (this.driver = void 0));
        }
        sample(t) {
          return (this.startTime = 0), this.tick(t, !0);
        }
        attachTimeline(t) {
          return (
            this.options.allowFlatten &&
              ((this.options.type = "keyframes"),
              (this.options.ease = "linear"),
              this.initAnimation()),
            this.driver?.stop(),
            t.observe(this)
          );
        }
      }
      var xt = i(43391);
      var Tt = i(82085);
      const wt = (0, Tt.p)(() => void 0 !== window.ScrollTimeline);
      var St = i(41361),
        bt = i(5135);
      const Pt = {};
      function kt(t, e) {
        const i = (0, Tt.p)(t);
        return () => Pt[e] ?? i();
      }
      const Vt = kt(() => {
          try {
            document
              .createElement("div")
              .animate({ opacity: 0 }, { easing: "linear(0, 1)" });
          } catch (t) {
            return !1;
          }
          return !0;
        }, "linearEasing"),
        At = ([t, e, i, s]) => `cubic-bezier(${t}, ${e}, ${i}, ${s})`,
        Dt = {
          linear: "linear",
          ease: "ease",
          easeIn: "ease-in",
          easeOut: "ease-out",
          easeInOut: "ease-in-out",
          circIn: At([0, 0.65, 0.55, 1]),
          circOut: At([0.55, 0, 1, 0.45]),
          backIn: At([0.31, 0.01, 0.66, -0.59]),
          backOut: At([0.33, 1.53, 0.69, 0.99]),
        };
      function Mt(t, e) {
        return t
          ? "function" == typeof t
            ? Vt()
              ? E(t, e)
              : "ease-out"
            : (0, bt.D)(t)
            ? At(t)
            : Array.isArray(t)
            ? t.map((t) => Mt(t, e) || Dt.easeOut)
            : Dt[t]
          : void 0;
      }
      function Ct(
        t,
        e,
        i,
        {
          delay: s = 0,
          duration: n = 300,
          repeat: r = 0,
          repeatType: o = "loop",
          ease: a = "easeOut",
          times: l,
        } = {},
        u
      ) {
        const c = { [e]: i };
        l && (c.offset = l);
        const d = Mt(a, n);
        Array.isArray(d) && (c.easing = d), St.Q.value && h.q.waapi++;
        const p = {
          delay: s,
          duration: n,
          easing: Array.isArray(d) ? "linear" : d,
          fill: "both",
          iterations: r + 1,
          direction: "reverse" === o ? "alternate" : "normal",
        };
        u && (p.pseudoElement = u);
        const m = t.animate(c, p);
        return (
          St.Q.value &&
            m.finished.finally(() => {
              h.q.waapi--;
            }),
          m
        );
      }
      function Rt(t) {
        return "function" == typeof t && "applyToOptions" in t;
      }
      class Bt extends yt {
        constructor(t) {
          if (
            (super(),
            (this.finishedTime = null),
            (this.isStopped = !1),
            (this.manualStartTime = null),
            !t)
          )
            return;
          const {
            element: e,
            name: i,
            keyframes: s,
            pseudoElement: n,
            allowFlatten: r = !1,
            finalKeyframe: o,
            onComplete: a,
          } = t;
          (this.isPseudoElement = Boolean(n)),
            (this.allowFlatten = r),
            (this.options = t),
            (0, u.V)(
              "string" != typeof t.type,
              'Mini animate() doesn\'t support "type" as a string.',
              "mini-spring"
            );
          const l = (function ({ type: t, ...e }) {
            return Rt(t) && Vt()
              ? t.applyToOptions(e)
              : (e.duration ?? (e.duration = 300),
                e.ease ?? (e.ease = "easeOut"),
                e);
          })(t);
          (this.animation = Ct(e, i, s, l, n)),
            !1 === l.autoplay && this.animation.pause(),
            (this.animation.onfinish = () => {
              if (((this.finishedTime = this.time), !n)) {
                const t = pt(s, this.options, o, this.speed);
                this.updateMotionValue
                  ? this.updateMotionValue(t)
                  : (function (t, e, i) {
                      ((t) => t.startsWith("--"))(e)
                        ? t.style.setProperty(e, i)
                        : (t.style[e] = i);
                    })(e, i, t),
                  this.animation.cancel();
              }
              a?.(), this.notifyFinished();
            });
        }
        play() {
          this.isStopped ||
            ((this.manualStartTime = null),
            this.animation.play(),
            "finished" === this.state && this.updateFinished());
        }
        pause() {
          this.animation.pause();
        }
        complete() {
          this.animation.finish?.();
        }
        cancel() {
          try {
            this.animation.cancel();
          } catch (t) {}
        }
        stop() {
          if (this.isStopped) return;
          this.isStopped = !0;
          const { state: t } = this;
          "idle" !== t &&
            "finished" !== t &&
            (this.updateMotionValue
              ? this.updateMotionValue()
              : this.commitStyles(),
            this.isPseudoElement || this.cancel());
        }
        commitStyles() {
          this.isPseudoElement || this.animation.commitStyles?.();
        }
        get duration() {
          const t = this.animation.effect?.getComputedTiming?.().duration || 0;
          return (0, s.X)(Number(t));
        }
        get iterationDuration() {
          const { delay: t = 0 } = this.options || {};
          return this.duration + (0, s.X)(t);
        }
        get time() {
          return (0, s.X)(Number(this.animation.currentTime) || 0);
        }
        set time(t) {
          (this.manualStartTime = null),
            (this.finishedTime = null),
            (this.animation.currentTime = (0, s.f)(t));
        }
        get speed() {
          return this.animation.playbackRate;
        }
        set speed(t) {
          t < 0 && (this.finishedTime = null),
            (this.animation.playbackRate = t);
        }
        get state() {
          return null !== this.finishedTime
            ? "finished"
            : this.animation.playState;
        }
        get startTime() {
          return this.manualStartTime ?? Number(this.animation.startTime);
        }
        set startTime(t) {
          this.manualStartTime = this.animation.startTime = t;
        }
        attachTimeline({ timeline: t, observe: e }) {
          return (
            this.allowFlatten &&
              this.animation.effect?.updateTiming({ easing: "linear" }),
            (this.animation.onfinish = null),
            t && wt() ? ((this.animation.timeline = t), r.l) : e(this)
          );
        }
      }
      var Et = i(41195),
        jt = i(98226),
        Ft = i(41590);
      const Lt = { anticipate: Et.b, backInOut: jt.ZZ, circInOut: Ft.tn };
      function It(t) {
        "string" == typeof t.ease && t.ease in Lt && (t.ease = Lt[t.ease]);
      }
      class Ot extends Bt {
        constructor(t) {
          It(t),
            ft(t),
            super(t),
            void 0 !== t.startTime && (this.startTime = t.startTime),
            (this.options = t);
        }
        updateMotionValue(t) {
          const {
            motionValue: e,
            onUpdate: i,
            onComplete: s,
            element: n,
            ...r
          } = this.options;
          if (!e) return;
          if (void 0 !== t) return void e.set(t);
          const a = new gt({ ...r, autoplay: !1 }),
            h = Math.max(10, o.k.now() - this.startTime),
            u = (0, l.q)(0, 10, h - 10);
          e.setWithVelocity(
            a.sample(Math.max(0, h - u)).value,
            a.sample(h).value,
            u
          ),
            a.stop();
        }
      }
      const Ut = (t, e) =>
        "zIndex" !== e &&
        (!("number" != typeof t && !Array.isArray(t)) ||
          !(
            "string" != typeof t ||
            (!p.f.test(t) && "0" !== t) ||
            t.startsWith("url(")
          ));
      function Nt(t) {
        (t.duration = 0), (t.type = "keyframes");
      }
      const $t = new Set(["opacity", "clipPath", "filter", "transform"]),
        Wt = (0, Tt.p)(() =>
          Object.hasOwnProperty.call(Element.prototype, "animate")
        );
      class Xt extends yt {
        constructor({
          autoplay: t = !0,
          delay: e = 0,
          type: i = "keyframes",
          repeat: s = 0,
          repeatDelay: n = 0,
          repeatType: r = "loop",
          keyframes: a,
          name: l,
          motionValue: h,
          element: u,
          ...c
        }) {
          super(),
            (this.stop = () => {
              this._animation &&
                (this._animation.stop(), this.stopTimeline?.()),
                this.keyframeResolver?.cancel();
            }),
            (this.createdAt = o.k.now());
          const d = {
              autoplay: t,
              delay: e,
              type: i,
              repeat: s,
              repeatDelay: n,
              repeatType: r,
              name: l,
              motionValue: h,
              element: u,
              ...c,
            },
            p = u?.KeyframeResolver || xt.h;
          (this.keyframeResolver = new p(
            a,
            (t, e, i) => this.onKeyframesResolved(t, e, d, !i),
            l,
            h,
            u
          )),
            this.keyframeResolver?.scheduleResolve();
        }
        onKeyframesResolved(t, e, i, s) {
          this.keyframeResolver = void 0;
          const {
            name: a,
            type: l,
            velocity: h,
            delay: c,
            isHandoff: d,
            onUpdate: p,
          } = i;
          (this.resolvedAt = o.k.now()),
            (function (t, e, i, s) {
              const n = t[0];
              if (null === n) return !1;
              if ("display" === e || "visibility" === e) return !0;
              const r = t[t.length - 1],
                o = Ut(n, e),
                a = Ut(r, e);
              return (
                (0, u.$)(
                  o === a,
                  `You are trying to animate ${e} from "${n}" to "${r}". "${
                    o ? r : n
                  }" is not an animatable value.`,
                  "value-not-animatable"
                ),
                !(!o || !a) &&
                  ((function (t) {
                    const e = t[0];
                    if (1 === t.length) return !0;
                    for (let i = 0; i < t.length; i++)
                      if (t[i] !== e) return !0;
                  })(t) ||
                    (("spring" === i || Rt(i)) && s))
              );
            })(t, a, l, h) ||
              ((!n.W.instantAnimations && c) || p?.(pt(t, i, e)),
              (t[0] = t[t.length - 1]),
              Nt(i),
              (i.repeat = 0));
          const m = {
              startTime: s
                ? this.resolvedAt && this.resolvedAt - this.createdAt > 40
                  ? this.resolvedAt
                  : this.createdAt
                : void 0,
              finalKeyframe: e,
              ...i,
              keyframes: t,
            },
            f =
              !d &&
              (function (t) {
                const {
                    motionValue: e,
                    name: i,
                    repeatDelay: s,
                    repeatType: n,
                    damping: r,
                    type: o,
                  } = t,
                  a = e?.owner?.current;
                if (!(a instanceof HTMLElement)) return !1;
                const { onUpdate: l, transformTemplate: h } =
                  e.owner.getProps();
                return (
                  Wt() &&
                  i &&
                  $t.has(i) &&
                  ("transform" !== i || !h) &&
                  !l &&
                  !s &&
                  "mirror" !== n &&
                  0 !== r &&
                  "inertia" !== o
                );
              })(m),
            y = m.motionValue?.owner?.current,
            v = f ? new Ot({ ...m, element: y }) : new gt(m);
          v.finished
            .then(() => {
              this.notifyFinished();
            })
            .catch(r.l),
            this.pendingTimeline &&
              ((this.stopTimeline = v.attachTimeline(this.pendingTimeline)),
              (this.pendingTimeline = void 0)),
            (this._animation = v);
        }
        get finished() {
          return this._animation ? this.animation.finished : this._finished;
        }
        then(t, e) {
          return this.finished.finally(t).then(() => {});
        }
        get animation() {
          return (
            this._animation || (this.keyframeResolver?.resume(), (0, xt.q)()),
            this._animation
          );
        }
        get duration() {
          return this.animation.duration;
        }
        get iterationDuration() {
          return this.animation.iterationDuration;
        }
        get time() {
          return this.animation.time;
        }
        set time(t) {
          this.animation.time = t;
        }
        get speed() {
          return this.animation.speed;
        }
        get state() {
          return this.animation.state;
        }
        set speed(t) {
          this.animation.speed = t;
        }
        get startTime() {
          return this.animation.startTime;
        }
        attachTimeline(t) {
          return (
            this._animation
              ? (this.stopTimeline = this.animation.attachTimeline(t))
              : (this.pendingTimeline = t),
            () => this.stop()
          );
        }
        play() {
          this.animation.play();
        }
        pause() {
          this.animation.pause();
        }
        complete() {
          this.animation.complete();
        }
        cancel() {
          this._animation && this.animation.cancel(),
            this.keyframeResolver?.cancel();
        }
      }
      var Kt = i(49448),
        qt = i(50619);
      const Yt = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
        Gt = { type: "keyframes", duration: 0.8 },
        Qt = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
        zt = (t, { keyframes: e }) =>
          e.length > 2
            ? Gt
            : qt.f.has(t)
            ? t.startsWith("scale")
              ? {
                  type: "spring",
                  stiffness: 550,
                  damping: 0 === e[1] ? 2 * Math.sqrt(550) : 30,
                  restSpeed: 10,
                }
              : Yt
            : Qt,
        Ht = (t) => null !== t;
      const Zt =
        (t, e, i, r = {}, o, a) =>
        (l) => {
          const h = (0, Kt.r)(r, t) || {},
            u = h.delay || r.delay || 0;
          let { elapsed: c = 0 } = r;
          c -= (0, s.f)(u);
          const d = {
            keyframes: Array.isArray(i) ? i : [null, i],
            ease: "easeOut",
            velocity: e.getVelocity(),
            ...h,
            delay: -c,
            onUpdate: (t) => {
              e.set(t), h.onUpdate && h.onUpdate(t);
            },
            onComplete: () => {
              l(), h.onComplete && h.onComplete();
            },
            name: t,
            motionValue: e,
            element: a ? void 0 : o,
          };
          (function ({
            when: t,
            delay: e,
            delayChildren: i,
            staggerChildren: s,
            staggerDirection: n,
            repeat: r,
            repeatType: o,
            repeatDelay: a,
            from: l,
            elapsed: h,
            ...u
          }) {
            return !!Object.keys(u).length;
          })(h) || Object.assign(d, zt(t, d)),
            d.duration && (d.duration = (0, s.f)(d.duration)),
            d.repeatDelay && (d.repeatDelay = (0, s.f)(d.repeatDelay)),
            void 0 !== d.from && (d.keyframes[0] = d.from);
          let p = !1;
          if (
            ((!1 === d.type || (0 === d.duration && !d.repeatDelay)) &&
              (Nt(d), 0 === d.delay && (p = !0)),
            (n.W.instantAnimations || n.W.skipAnimations) &&
              ((p = !0), Nt(d), (d.delay = 0)),
            (d.allowFlatten = !h.type && !h.ease),
            p && !a && void 0 !== e.get())
          ) {
            const t = (function (t, { repeat: e, repeatType: i = "loop" }, s) {
              const n = t.filter(Ht),
                r = e && "loop" !== i && e % 2 == 1 ? 0 : n.length - 1;
              return r && void 0 !== s ? s : n[r];
            })(d.keyframes, h);
            if (void 0 !== t)
              return void R.Gt.update(() => {
                d.onUpdate(t), d.onComplete();
              });
          }
          return h.isSync ? new gt(d) : new Xt(d);
        };
    },
    43391(t, e, i) {
      i.d(e, { q: () => c, h: () => d });
      var s = i(57049),
        n = i(27154);
      const r = new Set();
      let o = !1,
        a = !1,
        l = !1;
      function h() {
        if (a) {
          const t = Array.from(r).filter((t) => t.needsMeasurement),
            e = new Set(t.map((t) => t.element)),
            i = new Map();
          e.forEach((t) => {
            const e = (0, s.W9)(t);
            e.length && (i.set(t, e), t.render());
          }),
            t.forEach((t) => t.measureInitialState()),
            e.forEach((t) => {
              t.render();
              const e = i.get(t);
              e &&
                e.forEach(([e, i]) => {
                  t.getValue(e)?.set(i);
                });
            }),
            t.forEach((t) => t.measureEndState()),
            t.forEach((t) => {
              void 0 !== t.suspendedScrollY &&
                window.scrollTo(0, t.suspendedScrollY);
            });
        }
        (a = !1), (o = !1), r.forEach((t) => t.complete(l)), r.clear();
      }
      function u() {
        r.forEach((t) => {
          t.readKeyframes(), t.needsMeasurement && (a = !0);
        });
      }
      function c() {
        (l = !0), u(), h(), (l = !1);
      }
      class d {
        constructor(t, e, i, s, n, r = !1) {
          (this.state = "pending"),
            (this.isAsync = !1),
            (this.needsMeasurement = !1),
            (this.unresolvedKeyframes = [...t]),
            (this.onComplete = e),
            (this.name = i),
            (this.motionValue = s),
            (this.element = n),
            (this.isAsync = r);
        }
        scheduleResolve() {
          (this.state = "scheduled"),
            this.isAsync
              ? (r.add(this),
                o || ((o = !0), n.Gt.read(u), n.Gt.resolveKeyframes(h)))
              : (this.readKeyframes(), this.complete());
        }
        readKeyframes() {
          const {
            unresolvedKeyframes: t,
            name: e,
            element: i,
            motionValue: s,
          } = this;
          if (null === t[0]) {
            const n = s?.get(),
              r = t[t.length - 1];
            if (void 0 !== n) t[0] = n;
            else if (i && e) {
              const s = i.readValue(e, r);
              null != s && (t[0] = s);
            }
            void 0 === t[0] && (t[0] = r), s && void 0 === n && s.set(t[0]);
          }
          !(function (t) {
            for (let e = 1; e < t.length; e++) t[e] ?? (t[e] = t[e - 1]);
          })(t);
        }
        setFinalKeyframe() {}
        measureInitialState() {}
        renderEndStyles() {}
        measureEndState() {}
        complete(t = !1) {
          (this.state = "complete"),
            this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, t),
            r.delete(this);
        }
        cancel() {
          "scheduled" === this.state &&
            (r.delete(this), (this.state = "pending"));
        }
        resume() {
          "pending" === this.state && this.scheduleResolve();
        }
      }
    },
    57049(t, e, i) {
      i.d(e, { E4: () => a, Hr: () => c, W9: () => u });
      var s = i(84001),
        n = i(50619),
        r = i(76745),
        o = i(11159);
      const a = (t) => t === r.ai || t === o.px,
        l = new Set(["x", "y", "z"]),
        h = n.U.filter((t) => !l.has(t));
      function u(t) {
        const e = [];
        return (
          h.forEach((i) => {
            const s = t.getValue(i);
            void 0 !== s &&
              (e.push([i, s.get()]), s.set(i.startsWith("scale") ? 1 : 0));
          }),
          e
        );
      }
      const c = {
        width: ({ x: t }, { paddingLeft: e = "0", paddingRight: i = "0" }) =>
          t.max - t.min - parseFloat(e) - parseFloat(i),
        height: ({ y: t }, { paddingTop: e = "0", paddingBottom: i = "0" }) =>
          t.max - t.min - parseFloat(e) - parseFloat(i),
        top: (t, { top: e }) => parseFloat(e),
        left: (t, { left: e }) => parseFloat(e),
        bottom: ({ y: t }, { top: e }) => parseFloat(e) + (t.max - t.min),
        right: ({ x: t }, { left: e }) => parseFloat(e) + (t.max - t.min),
        x: (t, { transform: e }) => (0, s.ry)(e, "x"),
        y: (t, { transform: e }) => (0, s.ry)(e, "y"),
      };
      (c.translateX = c.x), (c.translateY = c.y);
    },
    74050(t, e, i) {
      i.d(e, { n: () => s });
      const s = "data-" + (0, i(72116).I)("framerAppearId");
    },
    88780(t, e, i) {
      i.d(e, { P: () => n });
      var s = i(74050);
      function n(t) {
        return t.props[s.n];
      }
    },
    49448(t, e, i) {
      function s(t, e) {
        return t?.[e] ?? t?.default ?? t;
      }
      i.d(e, { r: () => s });
    },
    45631(t, e, i) {
      i.d(e, { j4: () => n, pG: () => o, rm: () => l });
      const s = (t) => (e) => "string" == typeof e && e.startsWith(t),
        n = s("--"),
        r = s("var(--"),
        o = (t) => !!r(t) && a.test(t.split("/*")[0].trim()),
        a =
          /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
      function l(t) {
        return "string" == typeof t && t.split("/*")[0].includes("var(--");
      }
    },
    60572(t, e, i) {
      function s(t, e, i, s = { passive: !0 }) {
        return t.addEventListener(e, i, s), () => t.removeEventListener(e, i);
      }
      i.d(e, { k: () => s });
    },
    21345(t, e, i) {
      i.d(e, { I: () => o });
      var s = i(34901);
      const n = [
        "setup",
        "read",
        "resolveKeyframes",
        "preUpdate",
        "update",
        "preRender",
        "render",
        "postRender",
      ];
      var r = i(41361);
      function o(t, e) {
        let i = !1,
          o = !0;
        const a = { delta: 0, timestamp: 0, isProcessing: !1 },
          l = () => (i = !0),
          h = n.reduce(
            (t, i) => (
              (t[i] = (function (t, e) {
                let i = new Set(),
                  s = new Set(),
                  n = !1,
                  o = !1;
                const a = new WeakSet();
                let l = { delta: 0, timestamp: 0, isProcessing: !1 },
                  h = 0;
                function u(e) {
                  a.has(e) && (c.schedule(e), t()), h++, e(l);
                }
                const c = {
                  schedule: (t, e = !1, r = !1) => {
                    const o = r && n ? i : s;
                    return e && a.add(t), o.has(t) || o.add(t), t;
                  },
                  cancel: (t) => {
                    s.delete(t), a.delete(t);
                  },
                  process: (t) => {
                    (l = t),
                      n
                        ? (o = !0)
                        : ((n = !0),
                          ([i, s] = [s, i]),
                          i.forEach(u),
                          e && r.Q.value && r.Q.value.frameloop[e].push(h),
                          (h = 0),
                          i.clear(),
                          (n = !1),
                          o && ((o = !1), c.process(t)));
                  },
                };
                return c;
              })(l, e ? i : void 0)),
              t
            ),
            {}
          ),
          {
            setup: u,
            read: c,
            resolveKeyframes: d,
            preUpdate: p,
            update: m,
            preRender: f,
            render: y,
            postRender: v,
          } = h,
          g = () => {
            const n = s.W.useManualTiming ? a.timestamp : performance.now();
            (i = !1),
              s.W.useManualTiming ||
                (a.delta = o
                  ? 1e3 / 60
                  : Math.max(Math.min(n - a.timestamp, 40), 1)),
              (a.timestamp = n),
              (a.isProcessing = !0),
              u.process(a),
              c.process(a),
              d.process(a),
              p.process(a),
              m.process(a),
              f.process(a),
              y.process(a),
              v.process(a),
              (a.isProcessing = !1),
              i && e && ((o = !1), t(g));
          };
        return {
          schedule: n.reduce((e, s) => {
            const n = h[s];
            return (
              (e[s] = (e, s = !1, r = !1) => (
                i || ((i = !0), (o = !0), a.isProcessing || t(g)),
                n.schedule(e, s, r)
              )),
              e
            );
          }, {}),
          cancel: (t) => {
            for (let e = 0; e < n.length; e++) h[n[e]].cancel(t);
          },
          state: a,
          steps: h,
        };
      }
    },
    27154(t, e, i) {
      i.d(e, { Gt: () => r, PP: () => l, WG: () => o, uv: () => a });
      var s = i(91343),
        n = i(21345);
      const {
        schedule: r,
        cancel: o,
        state: a,
        steps: l,
      } = (0, n.I)(
        "undefined" != typeof requestAnimationFrame
          ? requestAnimationFrame
          : s.l,
        !0
      );
    },
    35146(t, e, i) {
      i.d(e, { k: () => n });
      var s = i(21345);
      const { schedule: n, cancel: r } = (0, s.I)(queueMicrotask, !1);
    },
    99036(t, e, i) {
      i.d(e, { k: () => a });
      var s = i(34901),
        n = i(27154);
      let r;
      function o() {
        r = void 0;
      }
      const a = {
        now: () => (
          void 0 === r &&
            a.set(
              n.uv.isProcessing || s.W.useManualTiming
                ? n.uv.timestamp
                : performance.now()
            ),
          r
        ),
        set: (t) => {
          (r = t), queueMicrotask(o);
        },
      };
    },
    14496(t, e, i) {
      i.d(e, { D: () => n, I: () => s });
      const s = { x: !1, y: !1 };
      function n() {
        return s.x || s.y;
      }
    },
    7346(t, e, i) {
      i.d(e, { W: () => n });
      var s = i(14496);
      function n(t) {
        return "x" === t || "y" === t
          ? s.I[t]
            ? null
            : ((s.I[t] = !0),
              () => {
                s.I[t] = !1;
              })
          : s.I.x || s.I.y
          ? null
          : ((s.I.x = s.I.y = !0),
            () => {
              s.I.x = s.I.y = !1;
            });
      }
    },
    19408(t, e, i) {
      i.d(e, { P: () => o });
      var s = i(14496),
        n = i(72558);
      function r(t) {
        return !("touch" === t.pointerType || (0, s.D)());
      }
      function o(t, e, i = {}) {
        const [s, o, a] = (0, n.V)(t, i),
          l = (t) => {
            if (!r(t)) return;
            const { target: i } = t,
              s = e(i, t);
            if ("function" != typeof s || !i) return;
            const n = (t) => {
              r(t) && (s(t), i.removeEventListener("pointerleave", n));
            };
            i.addEventListener("pointerleave", n, o);
          };
        return (
          s.forEach((t) => {
            t.addEventListener("pointerenter", l, o);
          }),
          a
        );
      }
    },
    83125(t, e, i) {
      i.d(e, { c: () => p });
      var s = i(45710),
        n = i(14496);
      const r = (t, e) => !!e && (t === e || r(t, e.parentElement));
      var o = i(31041),
        a = i(72558),
        l = i(84405);
      const h = new WeakSet();
      function u(t) {
        return (e) => {
          "Enter" === e.key && t(e);
        };
      }
      function c(t, e) {
        t.dispatchEvent(
          new PointerEvent("pointer" + e, { isPrimary: !0, bubbles: !0 })
        );
      }
      function d(t) {
        return (0, o.M)(t) && !(0, n.D)();
      }
      function p(t, e, i = {}) {
        const [n, o, p] = (0, a.V)(t, i),
          m = (t) => {
            const s = t.currentTarget;
            if (!d(t)) return;
            h.add(s);
            const n = e(s, t),
              a = (t, e) => {
                window.removeEventListener("pointerup", l),
                  window.removeEventListener("pointercancel", u),
                  h.has(s) && h.delete(s),
                  d(t) && "function" == typeof n && n(t, { success: e });
              },
              l = (t) => {
                a(
                  t,
                  s === window ||
                    s === document ||
                    i.useGlobalTarget ||
                    r(s, t.target)
                );
              },
              u = (t) => {
                a(t, !1);
              };
            window.addEventListener("pointerup", l, o),
              window.addEventListener("pointercancel", u, o);
          };
        return (
          n.forEach((t) => {
            (i.useGlobalTarget ? window : t).addEventListener(
              "pointerdown",
              m,
              o
            ),
              (0, s.s)(t) &&
                (t.addEventListener("focus", (t) =>
                  ((t, e) => {
                    const i = t.currentTarget;
                    if (!i) return;
                    const s = u(() => {
                      if (h.has(i)) return;
                      c(i, "down");
                      const t = u(() => {
                        c(i, "up");
                      });
                      i.addEventListener("keyup", t, e),
                        i.addEventListener("blur", () => c(i, "cancel"), e);
                    });
                    i.addEventListener("keydown", s, e),
                      i.addEventListener(
                        "blur",
                        () => i.removeEventListener("keydown", s),
                        e
                      );
                  })(t, o)
                ),
                (0, l.c)(t) || t.hasAttribute("tabindex") || (t.tabIndex = 0));
          }),
          p
        );
      }
    },
    84405(t, e, i) {
      i.d(e, { c: () => n });
      const s = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
      function n(t) {
        return s.has(t.tagName) || !0 === t.isContentEditable;
      }
    },
    31041(t, e, i) {
      i.d(e, { M: () => s });
      const s = (t) =>
        "mouse" === t.pointerType
          ? "number" != typeof t.button || t.button <= 0
          : !1 !== t.isPrimary;
    },
    72558(t, e, i) {
      function s(t, e) {
        const i = (function (t, e, i) {
            if (null == t) return [];
            if (t instanceof EventTarget) return [t];
            if ("string" == typeof t) {
              let s = document;
              e && (s = e.current);
              const n = i?.[t] ?? s.querySelectorAll(t);
              return n ? Array.from(n) : [];
            }
            return Array.from(t).filter((t) => null != t);
          })(t),
          s = new AbortController();
        return [i, { passive: !0, ...e, signal: s.signal }, () => s.abort()];
      }
      i.d(e, { V: () => s });
    },
    95766(t, e, i) {
      function s({ top: t, left: e, right: i, bottom: s }) {
        return { x: { min: e, max: i }, y: { min: t, max: s } };
      }
      function n({ x: t, y: e }) {
        return { top: e.min, right: t.max, bottom: e.max, left: t.min };
      }
      function r(t, e) {
        if (!e) return t;
        const i = e({ x: t.left, y: t.top }),
          s = e({ x: t.right, y: t.bottom });
        return { top: i.y, left: i.x, bottom: s.y, right: s.x };
      }
      i.d(e, { FY: () => s, bS: () => r, pA: () => n });
    },
    3651(t, e, i) {
      i.d(e, {
        OU: () => c,
        Ql: () => d,
        Ww: () => m,
        hq: () => r,
        o4: () => l,
      });
      var s = i(45147),
        n = i(72376);
      function r(t, e, i) {
        return i + e * (t - i);
      }
      function o(t, e, i, s, n) {
        return void 0 !== n && (t = r(t, n, s)), r(t, i, s) + e;
      }
      function a(t, e = 0, i = 1, s, n) {
        (t.min = o(t.min, e, i, s, n)), (t.max = o(t.max, e, i, s, n));
      }
      function l(t, { x: e, y: i }) {
        a(t.x, e.translate, e.scale, e.originPoint),
          a(t.y, i.translate, i.scale, i.originPoint);
      }
      const h = 0.999999999999,
        u = 1.0000000000001;
      function c(t, e, i, s = !1) {
        const r = i.length;
        if (!r) return;
        let o, a;
        e.x = e.y = 1;
        for (let h = 0; h < r; h++) {
          (o = i[h]), (a = o.projectionDelta);
          const { visualElement: r } = o.options;
          (r && r.props.style && "contents" === r.props.style.display) ||
            (s &&
              o.options.layoutScroll &&
              o.scroll &&
              o !== o.root &&
              m(t, { x: -o.scroll.offset.x, y: -o.scroll.offset.y }),
            a && ((e.x *= a.x.scale), (e.y *= a.y.scale), l(t, a)),
            s && (0, n.HD)(o.latestValues) && m(t, o.latestValues));
        }
        e.x < u && e.x > h && (e.x = 1), e.y < u && e.y > h && (e.y = 1);
      }
      function d(t, e) {
        (t.min = t.min + e), (t.max = t.max + e);
      }
      function p(t, e, i, n, r = 0.5) {
        a(t, e, i, (0, s.k)(t.min, t.max, r), n);
      }
      function m(t, e) {
        p(t.x, e.x, e.scaleX, e.scale, e.originX),
          p(t.y, e.y, e.scaleY, e.scale, e.originY);
      }
    },
    32902(t, e, i) {
      i.d(e, {
        CQ: () => n,
        HQ: () => r,
        N: () => h,
        jA: () => c,
        vb: () => a,
      });
      var s = i(45147);
      function n(t) {
        return t.max - t.min;
      }
      function r(t, e, i) {
        return Math.abs(t - e) <= i;
      }
      function o(t, e, i, r = 0.5) {
        (t.origin = r),
          (t.originPoint = (0, s.k)(e.min, e.max, t.origin)),
          (t.scale = n(i) / n(e)),
          (t.translate = (0, s.k)(i.min, i.max, t.origin) - t.originPoint),
          ((t.scale >= 0.9999 && t.scale <= 1.0001) || isNaN(t.scale)) &&
            (t.scale = 1),
          ((t.translate >= -0.01 && t.translate <= 0.01) ||
            isNaN(t.translate)) &&
            (t.translate = 0);
      }
      function a(t, e, i, s) {
        o(t.x, e.x, i.x, s ? s.originX : void 0),
          o(t.y, e.y, i.y, s ? s.originY : void 0);
      }
      function l(t, e, i) {
        (t.min = i.min + e.min), (t.max = t.min + n(e));
      }
      function h(t, e, i) {
        l(t.x, e.x, i.x), l(t.y, e.y, i.y);
      }
      function u(t, e, i) {
        (t.min = e.min - i.min), (t.max = t.min + n(e));
      }
      function c(t, e, i) {
        u(t.x, e.x, i.x), u(t.y, e.y, i.y);
      }
    },
    3064(t, e, i) {
      i.d(e, { ge: () => n, xU: () => s });
      const s = () => ({
          x: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
          y: { translate: 0, scale: 1, origin: 0, originPoint: 0 },
        }),
        n = () => ({ x: { min: 0, max: 0 }, y: { min: 0, max: 0 } });
    },
    25279(t, e, i) {
      i.d(e, { P: () => Ft });
      var s = i(13417),
        n = i(49448),
        r = i(35146),
        o = i(99036),
        a = i(3651),
        l = i(32902),
        h = i(45147),
        u = i(11159);
      function c(t, e, i, s, n) {
        return (
          (t -= e),
          (t = (0, a.hq)(t, 1 / i, s)),
          void 0 !== n && (t = (0, a.hq)(t, 1 / n, s)),
          t
        );
      }
      function d(t, e, [i, s, n], r, o) {
        !(function (t, e = 0, i = 1, s = 0.5, n, r = t, o = t) {
          u.KN.test(e) &&
            ((e = parseFloat(e)),
            (e = (0, h.k)(o.min, o.max, e / 100) - o.min));
          if ("number" != typeof e) return;
          let a = (0, h.k)(r.min, r.max, s);
          t === r && (a -= e),
            (t.min = c(t.min, e, i, a, n)),
            (t.max = c(t.max, e, i, a, n));
        })(t, e[i], e[s], e[n], e.scale, r, o);
      }
      const p = ["x", "scaleX", "originX"],
        m = ["y", "scaleY", "originY"];
      function f(t, e, i, s) {
        d(t.x, e, p, i ? i.x : void 0, s ? s.x : void 0),
          d(t.y, e, m, i ? i.y : void 0, s ? s.y : void 0);
      }
      function y(t, e) {
        (t.min = e.min), (t.max = e.max);
      }
      function v(t, e) {
        y(t.x, e.x), y(t.y, e.y);
      }
      function g(t, e) {
        (t.translate = e.translate),
          (t.scale = e.scale),
          (t.originPoint = e.originPoint),
          (t.origin = e.origin);
      }
      var x = i(3064);
      function T(t) {
        return 0 === t.translate && 1 === t.scale;
      }
      function w(t) {
        return T(t.x) && T(t.y);
      }
      function S(t, e) {
        return t.min === e.min && t.max === e.max;
      }
      function b(t, e) {
        return (
          Math.round(t.min) === Math.round(e.min) &&
          Math.round(t.max) === Math.round(e.max)
        );
      }
      function P(t, e) {
        return b(t.x, e.x) && b(t.y, e.y);
      }
      function k(t) {
        return (0, l.CQ)(t.x) / (0, l.CQ)(t.y);
      }
      function V(t, e) {
        return (
          t.translate === e.translate &&
          t.scale === e.scale &&
          t.originPoint === e.originPoint
        );
      }
      var A = i(36192),
        D = i(72376),
        M = i(41590),
        C = i(91343),
        R = i(96006);
      const B = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"],
        E = B.length,
        j = (t) => ("string" == typeof t ? parseFloat(t) : t),
        F = (t) => "number" == typeof t || u.px.test(t);
      function L(t, e) {
        return void 0 !== t[e] ? t[e] : t.borderRadius;
      }
      const I = U(0, 0.5, M.yT),
        O = U(0.5, 0.95, C.l);
      function U(t, e, i) {
        return (s) => (s < t ? 0 : s > e ? 1 : i((0, R.q)(t, e, s)));
      }
      var N = i(31853);
      function $(t) {
        return (0, N.G)(t) && "ownerSVGElement" in t;
      }
      var W = i(56603),
        X = i(70561),
        K = i(41361),
        q = i(38354),
        Y = i(32052),
        G = i(45369),
        Q = i(32298);
      var z = i(88780),
        H = i(8298);
      const Z = (t, e) => t.depth - e.depth;
      class _ {
        constructor() {
          (this.children = []), (this.isDirty = !1);
        }
        add(t) {
          (0, H.Kq)(this.children, t), (this.isDirty = !0);
        }
        remove(t) {
          (0, H.Ai)(this.children, t), (this.isDirty = !0);
        }
        forEach(t) {
          this.isDirty && this.children.sort(Z),
            (this.isDirty = !1),
            this.children.forEach(t);
        }
      }
      var J = i(27154);
      function tt(t, e) {
        const i = o.k.now(),
          s = ({ timestamp: n }) => {
            const r = n - i;
            r >= e && ((0, J.WG)(s), t(r - e));
          };
        return J.Gt.setup(s, !0), () => (0, J.WG)(s);
      }
      var et = i(6652);
      class it {
        constructor() {
          this.members = [];
        }
        add(t) {
          (0, H.Kq)(this.members, t), t.scheduleRender();
        }
        remove(t) {
          if (
            ((0, H.Ai)(this.members, t),
            t === this.prevLead && (this.prevLead = void 0),
            t === this.lead)
          ) {
            const t = this.members[this.members.length - 1];
            t && this.promote(t);
          }
        }
        relegate(t) {
          const e = this.members.findIndex((e) => t === e);
          if (0 === e) return !1;
          let i;
          for (let t = e; t >= 0; t--) {
            const e = this.members[t];
            if (!1 !== e.isPresent) {
              i = e;
              break;
            }
          }
          return !!i && (this.promote(i), !0);
        }
        promote(t, e) {
          const i = this.lead;
          if (t !== i && ((this.prevLead = i), (this.lead = t), t.show(), i)) {
            i.instance && i.scheduleRender(), t.scheduleRender();
            const s = i.options.layoutDependency,
              n = t.options.layoutDependency;
            (void 0 !== s && void 0 !== n && s === n) ||
              ((t.resumeFrom = i),
              e && (t.resumeFrom.preserveOpacity = !0),
              i.snapshot &&
                ((t.snapshot = i.snapshot),
                (t.snapshot.latestValues =
                  i.animationValues || i.latestValues)),
              t.root && t.root.isUpdating && (t.isLayoutDirty = !0));
            const { crossfade: r } = t.options;
            !1 === r && i.hide();
          }
        }
        exitAnimationComplete() {
          this.members.forEach((t) => {
            const { options: e, resumingFrom: i } = t;
            e.onExitComplete && e.onExitComplete(),
              i && i.options.onExitComplete && i.options.onExitComplete();
          });
        }
        scheduleRender() {
          this.members.forEach((t) => {
            t.instance && t.scheduleRender(!1);
          });
        }
        removeLeadSnapshot() {
          this.lead && this.lead.snapshot && (this.lead.snapshot = void 0);
        }
      }
      var st = i(61481);
      const nt = {
          nodes: 0,
          calculatedTargetDeltas: 0,
          calculatedProjections: 0,
        },
        rt = ["", "X", "Y", "Z"];
      let ot = 0;
      function at(t, e, i, s) {
        const { latestValues: n } = e;
        n[t] && ((i[t] = n[t]), e.setStaticValue(t, 0), s && (s[t] = 0));
      }
      function lt(t) {
        if (((t.hasCheckedOptimisedAppear = !0), t.root === t)) return;
        const { visualElement: e } = t.options;
        if (!e) return;
        const i = (0, z.P)(e);
        if (window.MotionHasOptimisedAnimation(i, "transform")) {
          const { layout: e, layoutId: s } = t.options;
          window.MotionCancelOptimisedAnimation(
            i,
            "transform",
            J.Gt,
            !(e || s)
          );
        }
        const { parent: s } = t;
        s && !s.hasCheckedOptimisedAppear && lt(s);
      }
      function ht({
        attachResizeListener: t,
        defaultParent: e,
        measureScroll: i,
        checkIsScrollRoot: c,
        resetTransform: d,
      }) {
        return class {
          constructor(t = {}, i = e?.()) {
            (this.id = ot++),
              (this.animationId = 0),
              (this.animationCommitId = 0),
              (this.children = new Set()),
              (this.options = {}),
              (this.isTreeAnimating = !1),
              (this.isAnimationBlocked = !1),
              (this.isLayoutDirty = !1),
              (this.isProjectionDirty = !1),
              (this.isSharedProjectionDirty = !1),
              (this.isTransformDirty = !1),
              (this.updateManuallyBlocked = !1),
              (this.updateBlockedByResize = !1),
              (this.isUpdating = !1),
              (this.isSVG = !1),
              (this.needsReset = !1),
              (this.shouldResetTransform = !1),
              (this.hasCheckedOptimisedAppear = !1),
              (this.treeScale = { x: 1, y: 1 }),
              (this.eventHandlers = new Map()),
              (this.hasTreeAnimated = !1),
              (this.layoutVersion = 0),
              (this.updateScheduled = !1),
              (this.scheduleUpdate = () => this.update()),
              (this.projectionUpdateScheduled = !1),
              (this.checkUpdateFailed = () => {
                this.isUpdating &&
                  ((this.isUpdating = !1), this.clearAllSnapshots());
              }),
              (this.updateProjection = () => {
                (this.projectionUpdateScheduled = !1),
                  K.Q.value &&
                    (nt.nodes =
                      nt.calculatedTargetDeltas =
                      nt.calculatedProjections =
                        0),
                  this.nodes.forEach(dt),
                  this.nodes.forEach(xt),
                  this.nodes.forEach(Tt),
                  this.nodes.forEach(pt),
                  K.Q.addProjectionMetrics && K.Q.addProjectionMetrics(nt);
              }),
              (this.resolvedRelativeTargetAt = 0),
              (this.linkedParentVersion = 0),
              (this.hasProjected = !1),
              (this.isVisible = !0),
              (this.animationProgress = 0),
              (this.sharedNodes = new Map()),
              (this.latestValues = t),
              (this.root = i ? i.root || i : this),
              (this.path = i ? [...i.path, i] : []),
              (this.parent = i),
              (this.depth = i ? i.depth + 1 : 0);
            for (let t = 0; t < this.path.length; t++)
              this.path[t].shouldResetTransform = !0;
            this.root === this && (this.nodes = new _());
          }
          addEventListener(t, e) {
            return (
              this.eventHandlers.has(t) || this.eventHandlers.set(t, new q.v()),
              this.eventHandlers.get(t).add(e)
            );
          }
          notifyListeners(t, ...e) {
            const i = this.eventHandlers.get(t);
            i && i.notify(...e);
          }
          hasListeners(t) {
            return this.eventHandlers.has(t);
          }
          mount(e) {
            if (this.instance) return;
            var i;
            (this.isSVG = $(e) && !($((i = e)) && "svg" === i.tagName)),
              (this.instance = e);
            const { layoutId: s, layout: r, visualElement: o } = this.options;
            if (
              (o && !o.current && o.mount(e),
              this.root.nodes.add(this),
              this.parent && this.parent.children.add(this),
              this.root.hasTreeAnimated &&
                (r || s) &&
                (this.isLayoutDirty = !0),
              t)
            ) {
              let i,
                s = 0;
              const n = () => (this.root.updateBlockedByResize = !1);
              J.Gt.read(() => {
                s = window.innerWidth;
              }),
                t(e, () => {
                  const t = window.innerWidth;
                  t !== s &&
                    ((s = t),
                    (this.root.updateBlockedByResize = !0),
                    i && i(),
                    (i = tt(n, 250)),
                    st.w.hasAnimatedSinceResize &&
                      ((st.w.hasAnimatedSinceResize = !1),
                      this.nodes.forEach(gt)));
                });
            }
            s && this.root.registerSharedNode(s, this),
              !1 !== this.options.animate &&
                o &&
                (s || r) &&
                this.addEventListener(
                  "didUpdate",
                  ({
                    delta: t,
                    hasLayoutChanged: e,
                    hasRelativeLayoutChanged: i,
                    layout: s,
                  }) => {
                    if (this.isTreeAnimationBlocked())
                      return (
                        (this.target = void 0),
                        void (this.relativeTarget = void 0)
                      );
                    const r =
                        this.options.transition ||
                        o.getDefaultTransition() ||
                        Vt,
                      {
                        onLayoutAnimationStart: a,
                        onLayoutAnimationComplete: l,
                      } = o.getProps(),
                      h = !this.targetLayout || !P(this.targetLayout, s),
                      u = !e && i;
                    if (
                      this.options.layoutRoot ||
                      this.resumeFrom ||
                      u ||
                      (e && (h || !this.currentAnimation))
                    ) {
                      this.resumeFrom &&
                        ((this.resumingFrom = this.resumeFrom),
                        (this.resumingFrom.resumingFrom = void 0));
                      const e = {
                        ...(0, n.r)(r, "layout"),
                        onPlay: a,
                        onComplete: l,
                      };
                      (o.shouldReduceMotion || this.options.layoutRoot) &&
                        ((e.delay = 0), (e.type = !1)),
                        this.startAnimation(e),
                        this.setAnimationOrigin(t, u);
                    } else
                      e || gt(this),
                        this.isLead() &&
                          this.options.onExitComplete &&
                          this.options.onExitComplete();
                    this.targetLayout = s;
                  }
                );
          }
          unmount() {
            this.options.layoutId && this.willUpdate(),
              this.root.nodes.remove(this);
            const t = this.getStack();
            t && t.remove(this),
              this.parent && this.parent.children.delete(this),
              (this.instance = void 0),
              this.eventHandlers.clear(),
              (0, J.WG)(this.updateProjection);
          }
          blockUpdate() {
            this.updateManuallyBlocked = !0;
          }
          unblockUpdate() {
            this.updateManuallyBlocked = !1;
          }
          isUpdateBlocked() {
            return this.updateManuallyBlocked || this.updateBlockedByResize;
          }
          isTreeAnimationBlocked() {
            return (
              this.isAnimationBlocked ||
              (this.parent && this.parent.isTreeAnimationBlocked()) ||
              !1
            );
          }
          startUpdate() {
            this.isUpdateBlocked() ||
              ((this.isUpdating = !0),
              this.nodes && this.nodes.forEach(wt),
              this.animationId++);
          }
          getTransformTemplate() {
            const { visualElement: t } = this.options;
            return t && t.getProps().transformTemplate;
          }
          willUpdate(t = !0) {
            if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked()))
              return void (
                this.options.onExitComplete && this.options.onExitComplete()
              );
            if (
              (window.MotionCancelOptimisedAnimation &&
                !this.hasCheckedOptimisedAppear &&
                lt(this),
              !this.root.isUpdating && this.root.startUpdate(),
              this.isLayoutDirty)
            )
              return;
            this.isLayoutDirty = !0;
            for (let t = 0; t < this.path.length; t++) {
              const e = this.path[t];
              (e.shouldResetTransform = !0),
                e.updateScroll("snapshot"),
                e.options.layoutRoot && e.willUpdate(!1);
            }
            const { layoutId: e, layout: i } = this.options;
            if (void 0 === e && !i) return;
            const s = this.getTransformTemplate();
            (this.prevTransformTemplateValue = s
              ? s(this.latestValues, "")
              : void 0),
              this.updateSnapshot(),
              t && this.notifyListeners("willUpdate");
          }
          update() {
            this.updateScheduled = !1;
            if (this.isUpdateBlocked())
              return (
                this.unblockUpdate(),
                this.clearAllSnapshots(),
                void this.nodes.forEach(ft)
              );
            if (this.animationId <= this.animationCommitId)
              return void this.nodes.forEach(yt);
            (this.animationCommitId = this.animationId),
              this.isUpdating
                ? ((this.isUpdating = !1),
                  this.nodes.forEach(vt),
                  this.nodes.forEach(ut),
                  this.nodes.forEach(ct))
                : this.nodes.forEach(yt),
              this.clearAllSnapshots();
            const t = o.k.now();
            (J.uv.delta = (0, Y.q)(0, 1e3 / 60, t - J.uv.timestamp)),
              (J.uv.timestamp = t),
              (J.uv.isProcessing = !0),
              J.PP.update.process(J.uv),
              J.PP.preRender.process(J.uv),
              J.PP.render.process(J.uv),
              (J.uv.isProcessing = !1);
          }
          didUpdate() {
            this.updateScheduled ||
              ((this.updateScheduled = !0), r.k.read(this.scheduleUpdate));
          }
          clearAllSnapshots() {
            this.nodes.forEach(mt), this.sharedNodes.forEach(St);
          }
          scheduleUpdateProjection() {
            this.projectionUpdateScheduled ||
              ((this.projectionUpdateScheduled = !0),
              J.Gt.preRender(this.updateProjection, !1, !0));
          }
          scheduleCheckAfterUnmount() {
            J.Gt.postRender(() => {
              this.isLayoutDirty
                ? this.root.didUpdate()
                : this.root.checkUpdateFailed();
            });
          }
          updateSnapshot() {
            !this.snapshot &&
              this.instance &&
              ((this.snapshot = this.measure()),
              !this.snapshot ||
                (0, l.CQ)(this.snapshot.measuredBox.x) ||
                (0, l.CQ)(this.snapshot.measuredBox.y) ||
                (this.snapshot = void 0));
          }
          updateLayout() {
            if (!this.instance) return;
            if (
              (this.updateScroll(),
              !(
                (this.options.alwaysMeasureLayout && this.isLead()) ||
                this.isLayoutDirty
              ))
            )
              return;
            if (this.resumeFrom && !this.resumeFrom.instance)
              for (let t = 0; t < this.path.length; t++) {
                this.path[t].updateScroll();
              }
            const t = this.layout;
            (this.layout = this.measure(!1)),
              this.layoutVersion++,
              (this.layoutCorrected = (0, x.ge)()),
              (this.isLayoutDirty = !1),
              (this.projectionDelta = void 0),
              this.notifyListeners("measure", this.layout.layoutBox);
            const { visualElement: e } = this.options;
            e &&
              e.notify(
                "LayoutMeasure",
                this.layout.layoutBox,
                t ? t.layoutBox : void 0
              );
          }
          updateScroll(t = "measure") {
            let e = Boolean(this.options.layoutScroll && this.instance);
            if (
              (this.scroll &&
                this.scroll.animationId === this.root.animationId &&
                this.scroll.phase === t &&
                (e = !1),
              e && this.instance)
            ) {
              const e = c(this.instance);
              this.scroll = {
                animationId: this.root.animationId,
                phase: t,
                isRoot: e,
                offset: i(this.instance),
                wasRoot: this.scroll ? this.scroll.isRoot : e,
              };
            }
          }
          resetTransform() {
            if (!d) return;
            const t =
                this.isLayoutDirty ||
                this.shouldResetTransform ||
                this.options.alwaysMeasureLayout,
              e = this.projectionDelta && !w(this.projectionDelta),
              i = this.getTransformTemplate(),
              s = i ? i(this.latestValues, "") : void 0,
              n = s !== this.prevTransformTemplateValue;
            t &&
              this.instance &&
              (e || (0, D.HD)(this.latestValues) || n) &&
              (d(this.instance, s),
              (this.shouldResetTransform = !1),
              this.scheduleRender());
          }
          measure(t = !0) {
            const e = this.measurePageBox();
            let i = this.removeElementScroll(e);
            var s;
            return (
              t && (i = this.removeTransform(i)),
              Mt((s = i).x),
              Mt(s.y),
              {
                animationId: this.root.animationId,
                measuredBox: e,
                layoutBox: i,
                latestValues: {},
                source: this.id,
              }
            );
          }
          measurePageBox() {
            const { visualElement: t } = this.options;
            if (!t) return (0, x.ge)();
            const e = t.measureViewportBox();
            if (!(this.scroll?.wasRoot || this.path.some(Rt))) {
              const { scroll: t } = this.root;
              t && ((0, a.Ql)(e.x, t.offset.x), (0, a.Ql)(e.y, t.offset.y));
            }
            return e;
          }
          removeElementScroll(t) {
            const e = (0, x.ge)();
            if ((v(e, t), this.scroll?.wasRoot)) return e;
            for (let i = 0; i < this.path.length; i++) {
              const s = this.path[i],
                { scroll: n, options: r } = s;
              s !== this.root &&
                n &&
                r.layoutScroll &&
                (n.wasRoot && v(e, t),
                (0, a.Ql)(e.x, n.offset.x),
                (0, a.Ql)(e.y, n.offset.y));
            }
            return e;
          }
          applyTransform(t, e = !1) {
            const i = (0, x.ge)();
            v(i, t);
            for (let t = 0; t < this.path.length; t++) {
              const s = this.path[t];
              !e &&
                s.options.layoutScroll &&
                s.scroll &&
                s !== s.root &&
                (0, a.Ww)(i, { x: -s.scroll.offset.x, y: -s.scroll.offset.y }),
                (0, D.HD)(s.latestValues) && (0, a.Ww)(i, s.latestValues);
            }
            return (
              (0, D.HD)(this.latestValues) && (0, a.Ww)(i, this.latestValues), i
            );
          }
          removeTransform(t) {
            const e = (0, x.ge)();
            v(e, t);
            for (let t = 0; t < this.path.length; t++) {
              const i = this.path[t];
              if (!i.instance) continue;
              if (!(0, D.HD)(i.latestValues)) continue;
              (0, D.vk)(i.latestValues) && i.updateSnapshot();
              const s = (0, x.ge)();
              v(s, i.measurePageBox()),
                f(
                  e,
                  i.latestValues,
                  i.snapshot ? i.snapshot.layoutBox : void 0,
                  s
                );
            }
            return (0, D.HD)(this.latestValues) && f(e, this.latestValues), e;
          }
          setTargetDelta(t) {
            (this.targetDelta = t),
              this.root.scheduleUpdateProjection(),
              (this.isProjectionDirty = !0);
          }
          setOptions(t) {
            this.options = {
              ...this.options,
              ...t,
              crossfade: void 0 === t.crossfade || t.crossfade,
            };
          }
          clearMeasurements() {
            (this.scroll = void 0),
              (this.layout = void 0),
              (this.snapshot = void 0),
              (this.prevTransformTemplateValue = void 0),
              (this.targetDelta = void 0),
              (this.target = void 0),
              (this.isLayoutDirty = !1);
          }
          forceRelativeParentToResolveTarget() {
            this.relativeParent &&
              this.relativeParent.resolvedRelativeTargetAt !== J.uv.timestamp &&
              this.relativeParent.resolveTargetDelta(!0);
          }
          resolveTargetDelta(t = !1) {
            const e = this.getLead();
            this.isProjectionDirty ||
              (this.isProjectionDirty = e.isProjectionDirty),
              this.isTransformDirty ||
                (this.isTransformDirty = e.isTransformDirty),
              this.isSharedProjectionDirty ||
                (this.isSharedProjectionDirty = e.isSharedProjectionDirty);
            const i = Boolean(this.resumingFrom) || this !== e;
            if (
              !(
                t ||
                (i && this.isSharedProjectionDirty) ||
                this.isProjectionDirty ||
                this.parent?.isProjectionDirty ||
                this.attemptToResolveRelativeTarget ||
                this.root.updateBlockedByResize
              )
            )
              return;
            const { layout: s, layoutId: n } = this.options;
            if (!this.layout || (!s && !n)) return;
            this.resolvedRelativeTargetAt = J.uv.timestamp;
            const r = this.getClosestProjectingParent();
            r &&
              this.linkedParentVersion !== r.layoutVersion &&
              !r.options.layoutRoot &&
              this.removeRelativeTarget(),
              this.targetDelta ||
                this.relativeTarget ||
                (r && r.layout
                  ? this.createRelativeTarget(
                      r,
                      this.layout.layoutBox,
                      r.layout.layoutBox
                    )
                  : this.removeRelativeTarget()),
              (this.relativeTarget || this.targetDelta) &&
                (this.target ||
                  ((this.target = (0, x.ge)()),
                  (this.targetWithTransforms = (0, x.ge)())),
                this.relativeTarget &&
                this.relativeTargetOrigin &&
                this.relativeParent &&
                this.relativeParent.target
                  ? (this.forceRelativeParentToResolveTarget(),
                    (0, l.N)(
                      this.target,
                      this.relativeTarget,
                      this.relativeParent.target
                    ))
                  : this.targetDelta
                  ? (Boolean(this.resumingFrom)
                      ? (this.target = this.applyTransform(
                          this.layout.layoutBox
                        ))
                      : v(this.target, this.layout.layoutBox),
                    (0, a.o4)(this.target, this.targetDelta))
                  : v(this.target, this.layout.layoutBox),
                this.attemptToResolveRelativeTarget &&
                  ((this.attemptToResolveRelativeTarget = !1),
                  r &&
                  Boolean(r.resumingFrom) === Boolean(this.resumingFrom) &&
                  !r.options.layoutScroll &&
                  r.target &&
                  1 !== this.animationProgress
                    ? this.createRelativeTarget(r, this.target, r.target)
                    : (this.relativeParent = this.relativeTarget = void 0)),
                K.Q.value && nt.calculatedTargetDeltas++);
          }
          getClosestProjectingParent() {
            if (
              this.parent &&
              !(0, D.vk)(this.parent.latestValues) &&
              !(0, D.vF)(this.parent.latestValues)
            )
              return this.parent.isProjecting()
                ? this.parent
                : this.parent.getClosestProjectingParent();
          }
          isProjecting() {
            return Boolean(
              (this.relativeTarget ||
                this.targetDelta ||
                this.options.layoutRoot) &&
                this.layout
            );
          }
          createRelativeTarget(t, e, i) {
            (this.relativeParent = t),
              (this.linkedParentVersion = t.layoutVersion),
              this.forceRelativeParentToResolveTarget(),
              (this.relativeTarget = (0, x.ge)()),
              (this.relativeTargetOrigin = (0, x.ge)()),
              (0, l.jA)(this.relativeTargetOrigin, e, i),
              v(this.relativeTarget, this.relativeTargetOrigin);
          }
          removeRelativeTarget() {
            this.relativeParent = this.relativeTarget = void 0;
          }
          calcProjection() {
            const t = this.getLead(),
              e = Boolean(this.resumingFrom) || this !== t;
            let i = !0;
            if (
              ((this.isProjectionDirty || this.parent?.isProjectionDirty) &&
                (i = !1),
              e &&
                (this.isSharedProjectionDirty || this.isTransformDirty) &&
                (i = !1),
              this.resolvedRelativeTargetAt === J.uv.timestamp && (i = !1),
              i)
            )
              return;
            const { layout: s, layoutId: n } = this.options;
            if (
              ((this.isTreeAnimating = Boolean(
                (this.parent && this.parent.isTreeAnimating) ||
                  this.currentAnimation ||
                  this.pendingAnimation
              )),
              this.isTreeAnimating ||
                (this.targetDelta = this.relativeTarget = void 0),
              !this.layout || (!s && !n))
            )
              return;
            v(this.layoutCorrected, this.layout.layoutBox);
            const r = this.treeScale.x,
              o = this.treeScale.y;
            (0, a.OU)(this.layoutCorrected, this.treeScale, this.path, e),
              !t.layout ||
                t.target ||
                (1 === this.treeScale.x && 1 === this.treeScale.y) ||
                ((t.target = t.layout.layoutBox),
                (t.targetWithTransforms = (0, x.ge)()));
            const { target: h } = t;
            h
              ? (this.projectionDelta && this.prevProjectionDelta
                  ? (g(this.prevProjectionDelta.x, this.projectionDelta.x),
                    g(this.prevProjectionDelta.y, this.projectionDelta.y))
                  : this.createProjectionDeltas(),
                (0, l.vb)(
                  this.projectionDelta,
                  this.layoutCorrected,
                  h,
                  this.latestValues
                ),
                (this.treeScale.x === r &&
                  this.treeScale.y === o &&
                  V(this.projectionDelta.x, this.prevProjectionDelta.x) &&
                  V(this.projectionDelta.y, this.prevProjectionDelta.y)) ||
                  ((this.hasProjected = !0),
                  this.scheduleRender(),
                  this.notifyListeners("projectionUpdate", h)),
                K.Q.value && nt.calculatedProjections++)
              : this.prevProjectionDelta &&
                (this.createProjectionDeltas(), this.scheduleRender());
          }
          hide() {
            this.isVisible = !1;
          }
          show() {
            this.isVisible = !0;
          }
          scheduleRender(t = !0) {
            if ((this.options.visualElement?.scheduleRender(), t)) {
              const t = this.getStack();
              t && t.scheduleRender();
            }
            this.resumingFrom &&
              !this.resumingFrom.instance &&
              (this.resumingFrom = void 0);
          }
          createProjectionDeltas() {
            (this.prevProjectionDelta = (0, x.xU)()),
              (this.projectionDelta = (0, x.xU)()),
              (this.projectionDeltaWithTransform = (0, x.xU)());
          }
          setAnimationOrigin(t, e = !1) {
            const i = this.snapshot,
              s = i ? i.latestValues : {},
              n = { ...this.latestValues },
              r = (0, x.xU)();
            (this.relativeParent && this.relativeParent.options.layoutRoot) ||
              (this.relativeTarget = this.relativeTargetOrigin = void 0),
              (this.attemptToResolveRelativeTarget = !e);
            const o = (0, x.ge)(),
              a =
                (i ? i.source : void 0) !==
                (this.layout ? this.layout.source : void 0),
              c = this.getStack(),
              d = !c || c.members.length <= 1,
              p = Boolean(
                a && !d && !0 === this.options.crossfade && !this.path.some(kt)
              );
            let m;
            (this.animationProgress = 0),
              (this.mixTargetDelta = (e) => {
                const i = e / 1e3;
                var c, f, y, g, T, w;
                bt(r.x, t.x, i),
                  bt(r.y, t.y, i),
                  this.setTargetDelta(r),
                  this.relativeTarget &&
                    this.relativeTargetOrigin &&
                    this.layout &&
                    this.relativeParent &&
                    this.relativeParent.layout &&
                    ((0, l.jA)(
                      o,
                      this.layout.layoutBox,
                      this.relativeParent.layout.layoutBox
                    ),
                    (y = this.relativeTarget),
                    (g = this.relativeTargetOrigin),
                    (T = o),
                    (w = i),
                    Pt(y.x, g.x, T.x, w),
                    Pt(y.y, g.y, T.y, w),
                    m &&
                      ((c = this.relativeTarget),
                      (f = m),
                      S(c.x, f.x) && S(c.y, f.y)) &&
                      (this.isProjectionDirty = !1),
                    m || (m = (0, x.ge)()),
                    v(m, this.relativeTarget)),
                  a &&
                    ((this.animationValues = n),
                    (function (t, e, i, s, n, r) {
                      n
                        ? ((t.opacity = (0, h.k)(0, i.opacity ?? 1, I(s))),
                          (t.opacityExit = (0, h.k)(e.opacity ?? 1, 0, O(s))))
                        : r &&
                          (t.opacity = (0, h.k)(
                            e.opacity ?? 1,
                            i.opacity ?? 1,
                            s
                          ));
                      for (let n = 0; n < E; n++) {
                        const r = `border${B[n]}Radius`;
                        let o = L(e, r),
                          a = L(i, r);
                        (void 0 === o && void 0 === a) ||
                          (o || (o = 0),
                          a || (a = 0),
                          0 === o || 0 === a || F(o) === F(a)
                            ? ((t[r] = Math.max((0, h.k)(j(o), j(a), s), 0)),
                              (u.KN.test(a) || u.KN.test(o)) && (t[r] += "%"))
                            : (t[r] = a));
                      }
                      (e.rotate || i.rotate) &&
                        (t.rotate = (0, h.k)(e.rotate || 0, i.rotate || 0, s));
                    })(n, s, this.latestValues, i, p, d)),
                  this.root.scheduleUpdateProjection(),
                  this.scheduleRender(),
                  (this.animationProgress = i);
              }),
              this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
          }
          startAnimation(t) {
            this.notifyListeners("animationStart"),
              this.currentAnimation?.stop(),
              this.resumingFrom?.currentAnimation?.stop(),
              this.pendingAnimation &&
                ((0, J.WG)(this.pendingAnimation),
                (this.pendingAnimation = void 0)),
              (this.pendingAnimation = J.Gt.update(() => {
                (st.w.hasAnimatedSinceResize = !0),
                  s.q.layout++,
                  this.motionValue || (this.motionValue = (0, W.OQ)(0)),
                  (this.currentAnimation = (function (t, e, i) {
                    const s = (0, Q.S)(t) ? t : (0, W.OQ)(t);
                    return s.start((0, G.f)("", s, e, i)), s.animation;
                  })(this.motionValue, [0, 1e3], {
                    ...t,
                    velocity: 0,
                    isSync: !0,
                    onUpdate: (e) => {
                      this.mixTargetDelta(e), t.onUpdate && t.onUpdate(e);
                    },
                    onStop: () => {
                      s.q.layout--;
                    },
                    onComplete: () => {
                      s.q.layout--,
                        t.onComplete && t.onComplete(),
                        this.completeAnimation();
                    },
                  })),
                  this.resumingFrom &&
                    (this.resumingFrom.currentAnimation =
                      this.currentAnimation),
                  (this.pendingAnimation = void 0);
              }));
          }
          completeAnimation() {
            this.resumingFrom &&
              ((this.resumingFrom.currentAnimation = void 0),
              (this.resumingFrom.preserveOpacity = void 0));
            const t = this.getStack();
            t && t.exitAnimationComplete(),
              (this.resumingFrom =
                this.currentAnimation =
                this.animationValues =
                  void 0),
              this.notifyListeners("animationComplete");
          }
          finishAnimation() {
            this.currentAnimation &&
              (this.mixTargetDelta && this.mixTargetDelta(1e3),
              this.currentAnimation.stop()),
              this.completeAnimation();
          }
          applyTransformsToTarget() {
            const t = this.getLead();
            let {
              targetWithTransforms: e,
              target: i,
              layout: s,
              latestValues: n,
            } = t;
            if (e && i && s) {
              if (
                this !== t &&
                this.layout &&
                s &&
                Ct(
                  this.options.animationType,
                  this.layout.layoutBox,
                  s.layoutBox
                )
              ) {
                i = this.target || (0, x.ge)();
                const e = (0, l.CQ)(this.layout.layoutBox.x);
                (i.x.min = t.target.x.min), (i.x.max = i.x.min + e);
                const s = (0, l.CQ)(this.layout.layoutBox.y);
                (i.y.min = t.target.y.min), (i.y.max = i.y.min + s);
              }
              v(e, i),
                (0, a.Ww)(e, n),
                (0, l.vb)(
                  this.projectionDeltaWithTransform,
                  this.layoutCorrected,
                  e,
                  n
                );
            }
          }
          registerSharedNode(t, e) {
            this.sharedNodes.has(t) || this.sharedNodes.set(t, new it());
            this.sharedNodes.get(t).add(e);
            const i = e.options.initialPromotionConfig;
            e.promote({
              transition: i ? i.transition : void 0,
              preserveFollowOpacity:
                i && i.shouldPreserveFollowOpacity
                  ? i.shouldPreserveFollowOpacity(e)
                  : void 0,
            });
          }
          isLead() {
            const t = this.getStack();
            return !t || t.lead === this;
          }
          getLead() {
            const { layoutId: t } = this.options;
            return (t && this.getStack()?.lead) || this;
          }
          getPrevLead() {
            const { layoutId: t } = this.options;
            return t ? this.getStack()?.prevLead : void 0;
          }
          getStack() {
            const { layoutId: t } = this.options;
            if (t) return this.root.sharedNodes.get(t);
          }
          promote({
            needsReset: t,
            transition: e,
            preserveFollowOpacity: i,
          } = {}) {
            const s = this.getStack();
            s && s.promote(this, i),
              t && ((this.projectionDelta = void 0), (this.needsReset = !0)),
              e && this.setOptions({ transition: e });
          }
          relegate() {
            const t = this.getStack();
            return !!t && t.relegate(this);
          }
          resetSkewAndRotation() {
            const { visualElement: t } = this.options;
            if (!t) return;
            let e = !1;
            const { latestValues: i } = t;
            if (
              ((i.z ||
                i.rotate ||
                i.rotateX ||
                i.rotateY ||
                i.rotateZ ||
                i.skewX ||
                i.skewY) &&
                (e = !0),
              !e)
            )
              return;
            const s = {};
            i.z && at("z", t, s, this.animationValues);
            for (let e = 0; e < rt.length; e++)
              at(`rotate${rt[e]}`, t, s, this.animationValues),
                at(`skew${rt[e]}`, t, s, this.animationValues);
            t.render();
            for (const e in s)
              t.setStaticValue(e, s[e]),
                this.animationValues && (this.animationValues[e] = s[e]);
            t.scheduleRender();
          }
          applyProjectionStyles(t, e) {
            if (!this.instance || this.isSVG) return;
            if (!this.isVisible) return void (t.visibility = "hidden");
            const i = this.getTransformTemplate();
            if (this.needsReset)
              return (
                (this.needsReset = !1),
                (t.visibility = ""),
                (t.opacity = ""),
                (t.pointerEvents = (0, et.u)(e?.pointerEvents) || ""),
                void (t.transform = i ? i(this.latestValues, "") : "none")
              );
            const s = this.getLead();
            if (!this.projectionDelta || !this.layout || !s.target)
              return (
                this.options.layoutId &&
                  ((t.opacity =
                    void 0 !== this.latestValues.opacity
                      ? this.latestValues.opacity
                      : 1),
                  (t.pointerEvents = (0, et.u)(e?.pointerEvents) || "")),
                void (
                  this.hasProjected &&
                  !(0, D.HD)(this.latestValues) &&
                  ((t.transform = i ? i({}, "") : "none"),
                  (this.hasProjected = !1))
                )
              );
            t.visibility = "";
            const n = s.animationValues || s.latestValues;
            this.applyTransformsToTarget();
            let r = (function (t, e, i) {
              let s = "";
              const n = t.x.translate / e.x,
                r = t.y.translate / e.y,
                o = i?.z || 0;
              if (
                ((n || r || o) && (s = `translate3d(${n}px, ${r}px, ${o}px) `),
                (1 === e.x && 1 === e.y) ||
                  (s += `scale(${1 / e.x}, ${1 / e.y}) `),
                i)
              ) {
                const {
                  transformPerspective: t,
                  rotate: e,
                  rotateX: n,
                  rotateY: r,
                  skewX: o,
                  skewY: a,
                } = i;
                t && (s = `perspective(${t}px) ${s}`),
                  e && (s += `rotate(${e}deg) `),
                  n && (s += `rotateX(${n}deg) `),
                  r && (s += `rotateY(${r}deg) `),
                  o && (s += `skewX(${o}deg) `),
                  a && (s += `skewY(${a}deg) `);
              }
              const a = t.x.scale * e.x,
                l = t.y.scale * e.y;
              return (
                (1 === a && 1 === l) || (s += `scale(${a}, ${l})`), s || "none"
              );
            })(this.projectionDeltaWithTransform, this.treeScale, n);
            i && (r = i(n, r)), (t.transform = r);
            const { x: o, y: a } = this.projectionDelta;
            (t.transformOrigin = `${100 * o.origin}% ${100 * a.origin}% 0`),
              s.animationValues
                ? (t.opacity =
                    s === this
                      ? n.opacity ?? this.latestValues.opacity ?? 1
                      : this.preserveOpacity
                      ? this.latestValues.opacity
                      : n.opacityExit)
                : (t.opacity =
                    s === this
                      ? void 0 !== n.opacity
                        ? n.opacity
                        : ""
                      : void 0 !== n.opacityExit
                      ? n.opacityExit
                      : 0);
            for (const e in X.H) {
              if (void 0 === n[e]) continue;
              const { correct: i, applyTo: o, isCSSVariable: a } = X.H[e],
                l = "none" === r ? n[e] : i(n[e], s);
              if (o) {
                const e = o.length;
                for (let i = 0; i < e; i++) t[o[i]] = l;
              } else
                a
                  ? (this.options.visualElement.renderState.vars[e] = l)
                  : (t[e] = l);
            }
            this.options.layoutId &&
              (t.pointerEvents =
                s === this ? (0, et.u)(e?.pointerEvents) || "" : "none");
          }
          clearSnapshot() {
            this.resumeFrom = this.snapshot = void 0;
          }
          resetTree() {
            this.root.nodes.forEach((t) => t.currentAnimation?.stop()),
              this.root.nodes.forEach(ft),
              this.root.sharedNodes.clear();
          }
        };
      }
      function ut(t) {
        t.updateLayout();
      }
      function ct(t) {
        const e = t.resumeFrom?.snapshot || t.snapshot;
        if (t.isLead() && t.layout && e && t.hasListeners("didUpdate")) {
          const { layoutBox: i, measuredBox: s } = t.layout,
            { animationType: n } = t.options,
            r = e.source !== t.layout.source;
          "size" === n
            ? (0, A.X)((t) => {
                const s = r ? e.measuredBox[t] : e.layoutBox[t],
                  n = (0, l.CQ)(s);
                (s.min = i[t].min), (s.max = s.min + n);
              })
            : Ct(n, e.layoutBox, i) &&
              (0, A.X)((s) => {
                const n = r ? e.measuredBox[s] : e.layoutBox[s],
                  o = (0, l.CQ)(i[s]);
                (n.max = n.min + o),
                  t.relativeTarget &&
                    !t.currentAnimation &&
                    ((t.isProjectionDirty = !0),
                    (t.relativeTarget[s].max = t.relativeTarget[s].min + o));
              });
          const o = (0, x.xU)();
          (0, l.vb)(o, i, e.layoutBox);
          const a = (0, x.xU)();
          r
            ? (0, l.vb)(a, t.applyTransform(s, !0), e.measuredBox)
            : (0, l.vb)(a, i, e.layoutBox);
          const h = !w(o);
          let u = !1;
          if (!t.resumeFrom) {
            const s = t.getClosestProjectingParent();
            if (s && !s.resumeFrom) {
              const { snapshot: n, layout: r } = s;
              if (n && r) {
                const o = (0, x.ge)();
                (0, l.jA)(o, e.layoutBox, n.layoutBox);
                const a = (0, x.ge)();
                (0, l.jA)(a, i, r.layoutBox),
                  P(o, a) || (u = !0),
                  s.options.layoutRoot &&
                    ((t.relativeTarget = a),
                    (t.relativeTargetOrigin = o),
                    (t.relativeParent = s));
              }
            }
          }
          t.notifyListeners("didUpdate", {
            layout: i,
            snapshot: e,
            delta: a,
            layoutDelta: o,
            hasLayoutChanged: h,
            hasRelativeLayoutChanged: u,
          });
        } else if (t.isLead()) {
          const { onExitComplete: e } = t.options;
          e && e();
        }
        t.options.transition = void 0;
      }
      function dt(t) {
        K.Q.value && nt.nodes++,
          t.parent &&
            (t.isProjecting() ||
              (t.isProjectionDirty = t.parent.isProjectionDirty),
            t.isSharedProjectionDirty ||
              (t.isSharedProjectionDirty = Boolean(
                t.isProjectionDirty ||
                  t.parent.isProjectionDirty ||
                  t.parent.isSharedProjectionDirty
              )),
            t.isTransformDirty ||
              (t.isTransformDirty = t.parent.isTransformDirty));
      }
      function pt(t) {
        t.isProjectionDirty =
          t.isSharedProjectionDirty =
          t.isTransformDirty =
            !1;
      }
      function mt(t) {
        t.clearSnapshot();
      }
      function ft(t) {
        t.clearMeasurements();
      }
      function yt(t) {
        t.isLayoutDirty = !1;
      }
      function vt(t) {
        const { visualElement: e } = t.options;
        e &&
          e.getProps().onBeforeLayoutMeasure &&
          e.notify("BeforeLayoutMeasure"),
          t.resetTransform();
      }
      function gt(t) {
        t.finishAnimation(),
          (t.targetDelta = t.relativeTarget = t.target = void 0),
          (t.isProjectionDirty = !0);
      }
      function xt(t) {
        t.resolveTargetDelta();
      }
      function Tt(t) {
        t.calcProjection();
      }
      function wt(t) {
        t.resetSkewAndRotation();
      }
      function St(t) {
        t.removeLeadSnapshot();
      }
      function bt(t, e, i) {
        (t.translate = (0, h.k)(e.translate, 0, i)),
          (t.scale = (0, h.k)(e.scale, 1, i)),
          (t.origin = e.origin),
          (t.originPoint = e.originPoint);
      }
      function Pt(t, e, i, s) {
        (t.min = (0, h.k)(e.min, i.min, s)),
          (t.max = (0, h.k)(e.max, i.max, s));
      }
      function kt(t) {
        return t.animationValues && void 0 !== t.animationValues.opacityExit;
      }
      const Vt = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
        At = (t) =>
          "undefined" != typeof navigator &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().includes(t),
        Dt = At("applewebkit/") && !At("chrome/") ? Math.round : C.l;
      function Mt(t) {
        (t.min = Dt(t.min)), (t.max = Dt(t.max));
      }
      function Ct(t, e, i) {
        return (
          "position" === t ||
          ("preserve-aspect" === t && !(0, l.HQ)(k(e), k(i), 0.2))
        );
      }
      function Rt(t) {
        return t !== t.root && t.scroll?.wasRoot;
      }
      var Bt = i(60572);
      const Et = ht({
          attachResizeListener: (t, e) => (0, Bt.k)(t, "resize", e),
          measureScroll: () => ({
            x:
              document.documentElement.scrollLeft ||
              document.body?.scrollLeft ||
              0,
            y:
              document.documentElement.scrollTop ||
              document.body?.scrollTop ||
              0,
          }),
          checkIsScrollRoot: () => !0,
        }),
        jt = { current: void 0 },
        Ft = ht({
          measureScroll: (t) => ({ x: t.scrollLeft, y: t.scrollTop }),
          defaultParent: () => {
            if (!jt.current) {
              const t = new Et({});
              t.mount(window),
                t.setOptions({ layoutScroll: !0 }),
                (jt.current = t);
            }
            return jt.current;
          },
          resetTransform: (t, e) => {
            t.style.transform = void 0 !== e ? e : "none";
          },
          checkIsScrollRoot: (t) =>
            Boolean("fixed" === window.getComputedStyle(t).position),
        });
    },
    61481(t, e, i) {
      i.d(e, { w: () => s });
      const s = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 };
    },
    70561(t, e, i) {
      i.d(e, { H: () => h });
      var s = i(11159);
      function n(t, e) {
        return e.max === e.min ? 0 : (t / (e.max - e.min)) * 100;
      }
      const r = {
        correct: (t, e) => {
          if (!e.target) return t;
          if ("string" == typeof t) {
            if (!s.px.test(t)) return t;
            t = parseFloat(t);
          }
          return `${n(t, e.target.x)}% ${n(t, e.target.y)}%`;
        },
      };
      var o = i(72525),
        a = i(45147);
      const l = {
          correct: (t, { treeScale: e, projectionDelta: i }) => {
            const s = t,
              n = o.f.parse(t);
            if (n.length > 5) return s;
            const r = o.f.createTransformer(t),
              l = "number" != typeof n[0] ? 1 : 0,
              h = i.x.scale * e.x,
              u = i.y.scale * e.y;
            (n[0 + l] /= h), (n[1 + l] /= u);
            const c = (0, a.k)(h, u, 0.5);
            return (
              "number" == typeof n[2 + l] && (n[2 + l] /= c),
              "number" == typeof n[3 + l] && (n[3 + l] /= c),
              r(n)
            );
          },
        },
        h = {
          borderRadius: {
            ...r,
            applyTo: [
              "borderTopLeftRadius",
              "borderTopRightRadius",
              "borderBottomLeftRadius",
              "borderBottomRightRadius",
            ],
          },
          borderTopLeftRadius: r,
          borderTopRightRadius: r,
          borderBottomLeftRadius: r,
          borderBottomRightRadius: r,
          boxShadow: l,
        };
    },
    36192(t, e, i) {
      function s(t) {
        return [t("x"), t("y")];
      }
      i.d(e, { X: () => s });
    },
    72376(t, e, i) {
      function s(t) {
        return void 0 === t || 1 === t;
      }
      function n({ scale: t, scaleX: e, scaleY: i }) {
        return !s(t) || !s(e) || !s(i);
      }
      function r(t) {
        return (
          n(t) ||
          o(t) ||
          t.z ||
          t.rotate ||
          t.rotateX ||
          t.rotateY ||
          t.skewX ||
          t.skewY
        );
      }
      function o(t) {
        return a(t.x) || a(t.y);
      }
      function a(t) {
        return t && "0%" !== t;
      }
      i.d(e, { HD: () => r, vF: () => o, vk: () => n });
    },
    78355(t, e, i) {
      i.d(e, { L: () => o, m: () => r });
      var s = i(95766),
        n = i(3651);
      function r(t, e) {
        return (0, s.FY)((0, s.bS)(t.getBoundingClientRect(), e));
      }
      function o(t, e, i) {
        const s = r(t, i),
          { scroll: o } = e;
        return o && ((0, n.Ql)(s.x, o.offset.x), (0, n.Ql)(s.y, o.offset.y)), s;
      }
    },
    93864(t, e, i) {
      i.d(e, { X: () => s });
      class s {
        constructor(t) {
          (this.isMounted = !1), (this.node = t);
        }
        update() {}
      }
    },
    50969(t, e, i) {
      i.d(e, { BX: () => C, vK: () => M, lr: () => D });
      var s = i(22056),
        n = i(97852),
        r = i(38354),
        o = i(35146),
        a = i(99036),
        l = i(56603),
        h = i(32298),
        u = i(43391),
        c = i(50619),
        d = i(72525),
        p = i(26961),
        m = i(17953),
        f = i(40363);
      const y = [...m.T, p.y, d.f];
      var v = i(43044),
        g = i(3064);
      const x = { current: null },
        T = { current: !1 },
        w = "undefined" != typeof window;
      const S = new WeakMap();
      var b = i(9183);
      var P = i(37859),
        k = i(27154);
      const V = [
        "AnimationStart",
        "AnimationComplete",
        "Update",
        "BeforeLayoutMeasure",
        "LayoutMeasure",
        "LayoutAnimationStart",
        "LayoutAnimationComplete",
      ];
      let A = {};
      function D(t) {
        A = t;
      }
      function M() {
        return A;
      }
      class C {
        scrapeMotionValuesFromProps(t, e, i) {
          return {};
        }
        constructor(
          {
            parent: t,
            props: e,
            presenceContext: i,
            reducedMotionConfig: s,
            blockInitialAnimation: n,
            visualState: r,
          },
          o = {}
        ) {
          (this.current = null),
            (this.children = new Set()),
            (this.isVariantNode = !1),
            (this.isControllingVariants = !1),
            (this.shouldReduceMotion = null),
            (this.values = new Map()),
            (this.KeyframeResolver = u.h),
            (this.features = {}),
            (this.valueSubscriptions = new Map()),
            (this.prevMotionValues = {}),
            (this.events = {}),
            (this.propEventSubscriptions = {}),
            (this.notifyUpdate = () =>
              this.notify("Update", this.latestValues)),
            (this.render = () => {
              this.current &&
                (this.triggerBuild(),
                this.renderInstance(
                  this.current,
                  this.renderState,
                  this.props.style,
                  this.projection
                ));
            }),
            (this.renderScheduledAt = 0),
            (this.scheduleRender = () => {
              const t = a.k.now();
              this.renderScheduledAt < t &&
                ((this.renderScheduledAt = t),
                k.Gt.render(this.render, !1, !0));
            });
          const { latestValues: l, renderState: c } = r;
          (this.latestValues = l),
            (this.baseTarget = { ...l }),
            (this.initialValues = e.initial ? { ...l } : {}),
            (this.renderState = c),
            (this.parent = t),
            (this.props = e),
            (this.presenceContext = i),
            (this.depth = t ? t.depth + 1 : 0),
            (this.reducedMotionConfig = s),
            (this.options = o),
            (this.blockInitialAnimation = Boolean(n)),
            (this.isControllingVariants = (0, b.e)(e)),
            (this.isVariantNode = (0, b.O)(e)),
            this.isVariantNode && (this.variantChildren = new Set()),
            (this.manuallyAnimateOnMount = Boolean(t && t.current));
          const { willChange: d, ...p } = this.scrapeMotionValuesFromProps(
            e,
            {},
            this
          );
          for (const t in p) {
            const e = p[t];
            void 0 !== l[t] && (0, h.S)(e) && e.set(l[t]);
          }
        }
        mount(t) {
          (this.current = t),
            S.set(t, this),
            this.projection &&
              !this.projection.instance &&
              this.projection.mount(t),
            this.parent &&
              this.isVariantNode &&
              !this.isControllingVariants &&
              (this.removeFromVariantTree = this.parent.addVariantChild(this)),
            this.values.forEach((t, e) => this.bindToMotionValue(e, t)),
            "never" === this.reducedMotionConfig
              ? (this.shouldReduceMotion = !1)
              : "always" === this.reducedMotionConfig
              ? (this.shouldReduceMotion = !0)
              : (T.current ||
                  (function () {
                    if (((T.current = !0), w))
                      if (window.matchMedia) {
                        const t = window.matchMedia("(prefers-reduced-motion)"),
                          e = () => (x.current = t.matches);
                        t.addEventListener("change", e), e();
                      } else x.current = !1;
                  })(),
                (this.shouldReduceMotion = x.current)),
            this.parent?.addChild(this),
            this.update(this.props, this.presenceContext);
        }
        unmount() {
          this.projection && this.projection.unmount(),
            (0, k.WG)(this.notifyUpdate),
            (0, k.WG)(this.render),
            this.valueSubscriptions.forEach((t) => t()),
            this.valueSubscriptions.clear(),
            this.removeFromVariantTree && this.removeFromVariantTree(),
            this.parent?.removeChild(this);
          for (const t in this.events) this.events[t].clear();
          for (const t in this.features) {
            const e = this.features[t];
            e && (e.unmount(), (e.isMounted = !1));
          }
          this.current = null;
        }
        addChild(t) {
          this.children.add(t),
            this.enteringChildren ?? (this.enteringChildren = new Set()),
            this.enteringChildren.add(t);
        }
        removeChild(t) {
          this.children.delete(t),
            this.enteringChildren && this.enteringChildren.delete(t);
        }
        bindToMotionValue(t, e) {
          this.valueSubscriptions.has(t) && this.valueSubscriptions.get(t)();
          const i = c.f.has(t);
          i && this.onBindTransform && this.onBindTransform();
          const s = e.on("change", (e) => {
            (this.latestValues[t] = e),
              this.props.onUpdate && k.Gt.preRender(this.notifyUpdate),
              i && this.projection && (this.projection.isTransformDirty = !0),
              this.scheduleRender();
          });
          let n;
          "undefined" != typeof window &&
            window.MotionCheckAppearSync &&
            (n = window.MotionCheckAppearSync(this, t, e)),
            this.valueSubscriptions.set(t, () => {
              s(), n && n(), e.owner && e.stop();
            });
        }
        sortNodePosition(t) {
          return this.current &&
            this.sortInstanceNodePosition &&
            this.type === t.type
            ? this.sortInstanceNodePosition(this.current, t.current)
            : 0;
        }
        updateFeatures() {
          let t = "animation";
          for (t in A) {
            const e = A[t];
            if (!e) continue;
            const { isEnabled: i, Feature: s } = e;
            if (
              (!this.features[t] &&
                s &&
                i(this.props) &&
                (this.features[t] = new s(this)),
              this.features[t])
            ) {
              const e = this.features[t];
              e.isMounted ? e.update() : (e.mount(), (e.isMounted = !0));
            }
          }
        }
        triggerBuild() {
          this.build(this.renderState, this.latestValues, this.props);
        }
        measureViewportBox() {
          return this.current
            ? this.measureInstanceViewportBox(this.current, this.props)
            : (0, g.ge)();
        }
        getStaticValue(t) {
          return this.latestValues[t];
        }
        setStaticValue(t, e) {
          this.latestValues[t] = e;
        }
        update(t, e) {
          (t.transformTemplate || this.props.transformTemplate) &&
            this.scheduleRender(),
            (this.prevProps = this.props),
            (this.props = t),
            (this.prevPresenceContext = this.presenceContext),
            (this.presenceContext = e);
          for (let e = 0; e < V.length; e++) {
            const i = V[e];
            this.propEventSubscriptions[i] &&
              (this.propEventSubscriptions[i](),
              delete this.propEventSubscriptions[i]);
            const s = t["on" + i];
            s && (this.propEventSubscriptions[i] = this.on(i, s));
          }
          (this.prevMotionValues = (function (t, e, i) {
            for (const s in e) {
              const n = e[s],
                r = i[s];
              if ((0, h.S)(n)) t.addValue(s, n);
              else if ((0, h.S)(r)) t.addValue(s, (0, l.OQ)(n, { owner: t }));
              else if (r !== n)
                if (t.hasValue(s)) {
                  const e = t.getValue(s);
                  !0 === e.liveStyle ? e.jump(n) : e.hasAnimated || e.set(n);
                } else {
                  const e = t.getStaticValue(s);
                  t.addValue(s, (0, l.OQ)(void 0 !== e ? e : n, { owner: t }));
                }
            }
            for (const s in i) void 0 === e[s] && t.removeValue(s);
            return e;
          })(
            this,
            this.scrapeMotionValuesFromProps(t, this.prevProps || {}, this),
            this.prevMotionValues
          )),
            this.handleChildMotionValue && this.handleChildMotionValue();
        }
        getProps() {
          return this.props;
        }
        getVariant(t) {
          return this.props.variants ? this.props.variants[t] : void 0;
        }
        getDefaultTransition() {
          return this.props.transition;
        }
        getTransformPagePoint() {
          return this.props.transformPagePoint;
        }
        getClosestVariantNode() {
          return this.isVariantNode
            ? this
            : this.parent
            ? this.parent.getClosestVariantNode()
            : void 0;
        }
        addVariantChild(t) {
          const e = this.getClosestVariantNode();
          if (e)
            return (
              e.variantChildren && e.variantChildren.add(t),
              () => e.variantChildren.delete(t)
            );
        }
        addValue(t, e) {
          const i = this.values.get(t);
          e !== i &&
            (i && this.removeValue(t),
            this.bindToMotionValue(t, e),
            this.values.set(t, e),
            (this.latestValues[t] = e.get()));
        }
        removeValue(t) {
          this.values.delete(t);
          const e = this.valueSubscriptions.get(t);
          e && (e(), this.valueSubscriptions.delete(t)),
            delete this.latestValues[t],
            this.removeValueFromRenderState(t, this.renderState);
        }
        hasValue(t) {
          return this.values.has(t);
        }
        getValue(t, e) {
          if (this.props.values && this.props.values[t])
            return this.props.values[t];
          let i = this.values.get(t);
          return (
            void 0 === i &&
              void 0 !== e &&
              ((i = (0, l.OQ)(null === e ? void 0 : e, { owner: this })),
              this.addValue(t, i)),
            i
          );
        }
        readValue(t, e) {
          let i =
            void 0 === this.latestValues[t] && this.current
              ? this.getBaseTargetFromProps(this.props, t) ??
                this.readValueFromInstance(this.current, t, this.options)
              : this.latestValues[t];
          var r;
          return (
            null != i &&
              ("string" == typeof i && ((0, s.i)(i) || (0, n.$)(i))
                ? (i = parseFloat(i))
                : ((r = i),
                  !y.find((0, f.w)(r)) && d.f.test(e) && (i = (0, v.J)(t, e))),
              this.setBaseTarget(t, (0, h.S)(i) ? i.get() : i)),
            (0, h.S)(i) ? i.get() : i
          );
        }
        setBaseTarget(t, e) {
          this.baseTarget[t] = e;
        }
        getBaseTarget(t) {
          const { initial: e } = this.props;
          let i;
          if ("string" == typeof e || "object" == typeof e) {
            const s = (0, P.a)(this.props, e, this.presenceContext?.custom);
            s && (i = s[t]);
          }
          if (e && void 0 !== i) return i;
          const s = this.getBaseTargetFromProps(this.props, t);
          return void 0 === s || (0, h.S)(s)
            ? void 0 !== this.initialValues[t] && void 0 === i
              ? void 0
              : this.baseTarget[t]
            : s;
        }
        on(t, e) {
          return (
            this.events[t] || (this.events[t] = new r.v()),
            this.events[t].add(e)
          );
        }
        notify(t, ...e) {
          this.events[t] && this.events[t].notify(...e);
        }
        scheduleRenderMicrotask() {
          o.k.render(this.render);
        }
      }
    },
    45567(t, e, i) {
      i.d(e, { b: () => x });
      var s = i(32298),
        n = i(5892),
        r = i(17953),
        o = i(56850),
        a = i(22056),
        l = i(45631);
      const h = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
      function u(t, e, i = 1) {
        (0, o.V)(
          i <= 4,
          `Max CSS variable fallback depth detected in property "${t}". This may indicate a circular fallback dependency.`,
          "max-css-var-depth"
        );
        const [s, n] = (function (t) {
          const e = h.exec(t);
          if (!e) return [,];
          const [, i, s, n] = e;
          return [`--${i ?? s}`, n];
        })(t);
        if (!s) return;
        const r = window.getComputedStyle(e).getPropertyValue(s);
        if (r) {
          const t = r.trim();
          return (0, a.i)(t) ? parseFloat(t) : t;
        }
        return (0, l.pG)(n) ? u(n, e, i + 1) : n;
      }
      var c = i(43391),
        d = i(97852);
      var p = i(72525),
        m = i(43044);
      const f = new Set(["auto", "none", "0"]);
      var y = i(57049);
      class v extends c.h {
        constructor(t, e, i, s, n) {
          super(t, e, i, s, n, !0);
        }
        readKeyframes() {
          const { unresolvedKeyframes: t, element: e, name: i } = this;
          if (!e || !e.current) return;
          super.readKeyframes();
          for (let i = 0; i < t.length; i++) {
            let s = t[i];
            if ("string" == typeof s && ((s = s.trim()), (0, l.pG)(s))) {
              const n = u(s, e.current);
              void 0 !== n && (t[i] = n),
                i === t.length - 1 && (this.finalKeyframe = s);
            }
          }
          if ((this.resolveNoneKeyframes(), !n.$.has(i) || 2 !== t.length))
            return;
          const [s, o] = t,
            a = (0, r.n)(s),
            h = (0, r.n)(o);
          if ((0, l.rm)(s) !== (0, l.rm)(o) && y.Hr[i])
            this.needsMeasurement = !0;
          else if (a !== h)
            if ((0, y.E4)(a) && (0, y.E4)(h))
              for (let e = 0; e < t.length; e++) {
                const i = t[e];
                "string" == typeof i && (t[e] = parseFloat(i));
              }
            else y.Hr[i] && (this.needsMeasurement = !0);
        }
        resolveNoneKeyframes() {
          const { unresolvedKeyframes: t, name: e } = this,
            i = [];
          for (let e = 0; e < t.length; e++)
            (null === t[e] ||
              ("number" == typeof (s = t[e])
                ? 0 === s
                : null === s || "none" === s || "0" === s || (0, d.$)(s))) &&
              i.push(e);
          var s;
          i.length &&
            (function (t, e, i) {
              let s,
                n = 0;
              for (; n < t.length && !s; ) {
                const e = t[n];
                "string" == typeof e &&
                  !f.has(e) &&
                  (0, p.V)(e).values.length &&
                  (s = t[n]),
                  n++;
              }
              if (s && i) for (const n of e) t[n] = (0, m.J)(i, s);
            })(t, i, e);
        }
        measureInitialState() {
          const { element: t, unresolvedKeyframes: e, name: i } = this;
          if (!t || !t.current) return;
          "height" === i && (this.suspendedScrollY = window.pageYOffset),
            (this.measuredOrigin = y.Hr[i](
              t.measureViewportBox(),
              window.getComputedStyle(t.current)
            )),
            (e[0] = this.measuredOrigin);
          const s = e[e.length - 1];
          void 0 !== s && t.getValue(i, s).jump(s, !1);
        }
        measureEndState() {
          const { element: t, name: e, unresolvedKeyframes: i } = this;
          if (!t || !t.current) return;
          const s = t.getValue(e);
          s && s.jump(this.measuredOrigin, !1);
          const n = i.length - 1,
            r = i[n];
          (i[n] = y.Hr[e](
            t.measureViewportBox(),
            window.getComputedStyle(t.current)
          )),
            null !== r &&
              void 0 === this.finalKeyframe &&
              (this.finalKeyframe = r),
            this.removedTransforms?.length &&
              this.removedTransforms.forEach(([e, i]) => {
                t.getValue(e).set(i);
              }),
            this.resolveNoneKeyframes();
        }
      }
      var g = i(50969);
      class x extends g.BX {
        constructor() {
          super(...arguments), (this.KeyframeResolver = v);
        }
        sortInstanceNodePosition(t, e) {
          return 2 & t.compareDocumentPosition(e) ? 1 : -1;
        }
        getBaseTargetFromProps(t, e) {
          const i = t.style;
          return i ? i[e] : void 0;
        }
        removeValueFromRenderState(t, { vars: e, style: i }) {
          delete e[t], delete i[t];
        }
        handleChildMotionValue() {
          this.childSubscription &&
            (this.childSubscription(), delete this.childSubscription);
          const { children: t } = this.props;
          (0, s.S)(t) &&
            (this.childSubscription = t.on("change", (t) => {
              this.current && (this.current.textContent = `${t}`);
            }));
        }
      }
    },
    84001(t, e, i) {
      i.d(e, { Ib: () => d, ry: () => c, zs: () => u });
      const s = (t) => (180 * t) / Math.PI,
        n = (t) => {
          const e = s(Math.atan2(t[1], t[0]));
          return o(e);
        },
        r = {
          x: 4,
          y: 5,
          translateX: 4,
          translateY: 5,
          scaleX: 0,
          scaleY: 3,
          scale: (t) => (Math.abs(t[0]) + Math.abs(t[3])) / 2,
          rotate: n,
          rotateZ: n,
          skewX: (t) => s(Math.atan(t[1])),
          skewY: (t) => s(Math.atan(t[2])),
          skew: (t) => (Math.abs(t[1]) + Math.abs(t[2])) / 2,
        },
        o = (t) => ((t %= 360) < 0 && (t += 360), t),
        a = (t) => Math.sqrt(t[0] * t[0] + t[1] * t[1]),
        l = (t) => Math.sqrt(t[4] * t[4] + t[5] * t[5]),
        h = {
          x: 12,
          y: 13,
          z: 14,
          translateX: 12,
          translateY: 13,
          translateZ: 14,
          scaleX: a,
          scaleY: l,
          scale: (t) => (a(t) + l(t)) / 2,
          rotateX: (t) => o(s(Math.atan2(t[6], t[5]))),
          rotateY: (t) => o(s(Math.atan2(-t[2], t[0]))),
          rotateZ: n,
          rotate: n,
          skewX: (t) => s(Math.atan(t[4])),
          skewY: (t) => s(Math.atan(t[1])),
          skew: (t) => (Math.abs(t[1]) + Math.abs(t[4])) / 2,
        };
      function u(t) {
        return t.includes("scale") ? 1 : 0;
      }
      function c(t, e) {
        if (!t || "none" === t) return u(e);
        const i = t.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
        let s, n;
        if (i) (s = h), (n = i);
        else {
          const e = t.match(/^matrix\(([-\d.e\s,]+)\)$/u);
          (s = r), (n = e);
        }
        if (!n) return u(e);
        const o = s[e],
          a = n[1].split(",").map(p);
        return "function" == typeof o ? o(a) : a[o];
      }
      const d = (t, e) => {
        const { transform: i = "none" } = getComputedStyle(t);
        return c(i, e);
      };
      function p(t) {
        return parseFloat(t.trim());
      }
    },
    72116(t, e, i) {
      function s(t) {
        return t.replace(/([A-Z])/g, (t) => `-${t.toLowerCase()}`);
      }
      i.d(e, { I: () => s });
    },
    22177(t, e, i) {
      i.d(e, { M: () => c });
      var s = i(45631),
        n = i(50619),
        r = i(84001),
        o = i(78355),
        a = i(45567),
        l = i(40320),
        h = i(59118),
        u = i(45812);
      class c extends a.b {
        constructor() {
          super(...arguments),
            (this.type = "html"),
            (this.renderInstance = h.e);
        }
        readValueFromInstance(t, e) {
          if (n.f.has(e))
            return this.projection?.isProjecting
              ? (0, r.zs)(e)
              : (0, r.Ib)(t, e);
          {
            const n = ((i = t), window.getComputedStyle(i)),
              r = ((0, s.j4)(e) ? n.getPropertyValue(e) : n[e]) || 0;
            return "string" == typeof r ? r.trim() : r;
          }
          var i;
        }
        measureInstanceViewportBox(t, { transformPagePoint: e }) {
          return (0, o.m)(t, e);
        }
        build(t, e, i) {
          (0, l.O)(t, e, i.transformTemplate);
        }
        scrapeMotionValuesFromProps(t, e, i) {
          return (0, u.x)(t, e, i);
        }
      }
    },
    40320(t, e, i) {
      i.d(e, { O: () => h });
      const s = (t, e) => (e && "number" == typeof t ? e.transform(t) : t);
      var n = i(65160),
        r = i(50619),
        o = i(45631);
      const a = {
          x: "translateX",
          y: "translateY",
          z: "translateZ",
          transformPerspective: "perspective",
        },
        l = r.U.length;
      function h(t, e, i) {
        const { style: h, vars: u, transformOrigin: c } = t;
        let d = !1,
          p = !1;
        for (const t in e) {
          const i = e[t];
          if (r.f.has(t)) d = !0;
          else if ((0, o.j4)(t)) u[t] = i;
          else {
            const e = s(i, n.W[t]);
            t.startsWith("origin") ? ((p = !0), (c[t] = e)) : (h[t] = e);
          }
        }
        if (
          (e.transform ||
            (d || i
              ? (h.transform = (function (t, e, i) {
                  let o = "",
                    h = !0;
                  for (let u = 0; u < l; u++) {
                    const l = r.U[u],
                      c = t[l];
                    if (void 0 === c) continue;
                    let d = !0;
                    if ("number" == typeof c)
                      d = c === (l.startsWith("scale") ? 1 : 0);
                    else {
                      const t = parseFloat(c);
                      d = l.startsWith("scale") ? 1 === t : 0 === t;
                    }
                    if (!d || i) {
                      const t = s(c, n.W[l]);
                      d || ((h = !1), (o += `${a[l] || l}(${t}) `)),
                        i && (e[l] = t);
                    }
                  }
                  return (
                    (o = o.trim()),
                    i ? (o = i(e, h ? "" : o)) : h && (o = "none"),
                    o
                  );
                })(e, t.transform, i))
              : h.transform && (h.transform = "none")),
          p)
        ) {
          const { originX: t = "50%", originY: e = "50%", originZ: i = 0 } = c;
          h.transformOrigin = `${t} ${e} ${i}`;
        }
      }
    },
    59118(t, e, i) {
      function s(t, { style: e, vars: i }, s, n) {
        const r = t.style;
        let o;
        for (o in e) r[o] = e[o];
        for (o in (n?.applyProjectionStyles(r, s), i)) r.setProperty(o, i[o]);
      }
      i.d(e, { e: () => s });
    },
    45812(t, e, i) {
      i.d(e, { x: () => r });
      var s = i(32298),
        n = i(41065);
      function r(t, e, i) {
        const r = t.style,
          o = e?.style,
          a = {};
        if (!r) return a;
        for (const e in r)
          ((0, s.S)(r[e]) ||
            (o && (0, s.S)(o[e])) ||
            (0, n.z)(e, t) ||
            void 0 !== i?.getValue(e)?.liveStyle) &&
            (a[e] = r[e]);
        return a;
      }
    },
    83451(t, e, i) {
      i.d(e, { l: () => p });
      var s = i(50619),
        n = i(10739),
        r = i(3064),
        o = i(45567),
        a = i(72116),
        l = i(83563);
      const h = new Set([
        "baseFrequency",
        "diffuseConstant",
        "kernelMatrix",
        "kernelUnitLength",
        "keySplines",
        "keyTimes",
        "limitingConeAngle",
        "markerHeight",
        "markerWidth",
        "numOctaves",
        "targetX",
        "targetY",
        "surfaceScale",
        "specularConstant",
        "specularExponent",
        "stdDeviation",
        "tableValues",
        "viewBox",
        "gradientTransform",
        "pathLength",
        "startOffset",
        "textLength",
        "lengthAdjust",
      ]);
      var u = i(63883),
        c = i(59118);
      var d = i(12823);
      class p extends o.b {
        constructor() {
          super(...arguments),
            (this.type = "svg"),
            (this.isSVGTag = !1),
            (this.measureInstanceViewportBox = r.ge);
        }
        getBaseTargetFromProps(t, e) {
          return t[e];
        }
        readValueFromInstance(t, e) {
          if (s.f.has(e)) {
            const t = (0, n.D)(e);
            return (t && t.default) || 0;
          }
          return (e = h.has(e) ? e : (0, a.I)(e)), t.getAttribute(e);
        }
        scrapeMotionValuesFromProps(t, e, i) {
          return (0, d.x)(t, e, i);
        }
        build(t, e, i) {
          (0, l.B)(t, e, this.isSVGTag, i.transformTemplate, i.style);
        }
        renderInstance(t, e, i, s) {
          !(function (t, e, i, s) {
            (0, c.e)(t, e, void 0, s);
            for (const i in e.attrs)
              t.setAttribute(h.has(i) ? i : (0, a.I)(i), e.attrs[i]);
          })(t, e, 0, s);
        }
        mount(t) {
          (this.isSVGTag = (0, u.n)(t.tagName)), super.mount(t);
        }
      }
    },
    83563(t, e, i) {
      i.d(e, { B: () => a });
      var s = i(40320);
      const n = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
        r = { offset: "strokeDashoffset", array: "strokeDasharray" };
      const o = [
        "offsetDistance",
        "offsetPath",
        "offsetRotate",
        "offsetAnchor",
      ];
      function a(
        t,
        {
          attrX: e,
          attrY: i,
          attrScale: a,
          pathLength: l,
          pathSpacing: h = 1,
          pathOffset: u = 0,
          ...c
        },
        d,
        p,
        m
      ) {
        if (((0, s.O)(t, c, p), d))
          return void (t.style.viewBox && (t.attrs.viewBox = t.style.viewBox));
        (t.attrs = t.style), (t.style = {});
        const { attrs: f, style: y } = t;
        f.transform && ((y.transform = f.transform), delete f.transform),
          (y.transform || f.transformOrigin) &&
            ((y.transformOrigin = f.transformOrigin ?? "50% 50%"),
            delete f.transformOrigin),
          y.transform &&
            ((y.transformBox = m?.transformBox ?? "fill-box"),
            delete f.transformBox);
        for (const t of o) void 0 !== f[t] && ((y[t] = f[t]), delete f[t]);
        void 0 !== e && (f.x = e),
          void 0 !== i && (f.y = i),
          void 0 !== a && (f.scale = a),
          void 0 !== l &&
            (function (t, e, i = 1, s = 0, o = !0) {
              t.pathLength = 1;
              const a = o ? n : r;
              (t[a.offset] = "" + -s), (t[a.array] = `${e} ${i}`);
            })(f, l, h, u, !1);
      }
    },
    63883(t, e, i) {
      i.d(e, { n: () => s });
      const s = (t) => "string" == typeof t && "svg" === t.toLowerCase();
    },
    12823(t, e, i) {
      i.d(e, { x: () => o });
      var s = i(32298),
        n = i(50619),
        r = i(45812);
      function o(t, e, i) {
        const o = (0, r.x)(t, e, i);
        for (const i in t)
          if ((0, s.S)(t[i]) || (0, s.S)(e[i])) {
            o[
              -1 !== n.U.indexOf(i)
                ? "attr" + i.charAt(0).toUpperCase() + i.substring(1)
                : i
            ] = t[i];
          }
        return o;
      }
    },
    3416(t, e, i) {
      i.d(e, { L: () => A });
      var s = i(37859);
      function n(t, e, i) {
        const n = t.getProps();
        return (0, s.a)(n, e, void 0 !== i ? i : n.custom, t);
      }
      var r = i(49448),
        o = i(5892),
        a = i(56603);
      const l = (t) => Array.isArray(t);
      function h(t, e, i) {
        t.hasValue(e) ? t.getValue(e).set(i) : t.addValue(e, (0, a.OQ)(i));
      }
      var u = i(84116),
        c = i(88780),
        d = i(45369),
        p = i(27154);
      function m({ protectedKeys: t, needsAnimating: e }, i) {
        const s = t.hasOwnProperty(i) && !0 !== e[i];
        return (e[i] = !1), s;
      }
      function f(t, e, { delay: i = 0, transitionOverride: s, type: a } = {}) {
        let {
          transition: f = t.getDefaultTransition(),
          transitionEnd: y,
          ...v
        } = e;
        s && (f = s);
        const g = [],
          x = a && t.animationState && t.animationState.getState()[a];
        for (const e in v) {
          const s = t.getValue(e, t.latestValues[e] ?? null),
            n = v[e];
          if (void 0 === n || (x && m(x, e))) continue;
          const a = { delay: i, ...(0, r.r)(f || {}, e) },
            l = s.get();
          if (
            void 0 !== l &&
            !s.isAnimating &&
            !Array.isArray(n) &&
            n === l &&
            !a.velocity
          )
            continue;
          let h = !1;
          if (window.MotionHandoffAnimation) {
            const i = (0, c.P)(t);
            if (i) {
              const t = window.MotionHandoffAnimation(i, e, p.Gt);
              null !== t && ((a.startTime = t), (h = !0));
            }
          }
          (0, u.g)(t, e),
            s.start(
              (0, d.f)(
                e,
                s,
                n,
                t.shouldReduceMotion && o.$.has(e) ? { type: !1 } : a,
                t,
                h
              )
            );
          const y = s.animation;
          y && g.push(y);
        }
        return (
          y &&
            Promise.all(g).then(() => {
              p.Gt.update(() => {
                y &&
                  (function (t, e) {
                    const i = n(t, e);
                    let {
                      transitionEnd: s = {},
                      transition: r = {},
                      ...o
                    } = i || {};
                    o = { ...o, ...s };
                    for (const e in o)
                      h(t, e, ((a = o[e]), l(a) ? a[a.length - 1] || 0 : a));
                    var a;
                  })(t, y);
              });
            }),
          g
        );
      }
      function y(t, e, i, s = 0, n = 1) {
        const r = Array.from(t)
            .sort((t, e) => t.sortNodePosition(e))
            .indexOf(e),
          o = t.size,
          a = (o - 1) * s;
        return "function" == typeof i ? i(r, o) : 1 === n ? r * s : a - r * s;
      }
      function v(t, e, i = {}) {
        const s = n(
          t,
          e,
          "exit" === i.type ? t.presenceContext?.custom : void 0
        );
        let { transition: r = t.getDefaultTransition() || {} } = s || {};
        i.transitionOverride && (r = i.transitionOverride);
        const o = s ? () => Promise.all(f(t, s, i)) : () => Promise.resolve(),
          a =
            t.variantChildren && t.variantChildren.size
              ? (s = 0) => {
                  const {
                    delayChildren: n = 0,
                    staggerChildren: o,
                    staggerDirection: a,
                  } = r;
                  return (function (t, e, i = 0, s = 0, n = 0, r = 1, o) {
                    const a = [];
                    for (const l of t.variantChildren)
                      l.notify("AnimationStart", e),
                        a.push(
                          v(l, e, {
                            ...o,
                            delay:
                              i +
                              ("function" == typeof s ? 0 : s) +
                              y(t.variantChildren, l, s, n, r),
                          }).then(() => l.notify("AnimationComplete", e))
                        );
                    return Promise.all(a);
                  })(t, e, s, n, o, a, i);
                }
              : () => Promise.resolve(),
          { when: l } = r;
        if (l) {
          const [t, e] = "beforeChildren" === l ? [o, a] : [a, o];
          return t().then(() => e());
        }
        return Promise.all([o(), a(i.delay)]);
      }
      var g = i(7329),
        x = i(9310);
      const T = x._.length;
      function w(t) {
        if (!t) return;
        if (!t.isControllingVariants) {
          const e = (t.parent && w(t.parent)) || {};
          return void 0 !== t.props.initial && (e.initial = t.props.initial), e;
        }
        const e = {};
        for (let i = 0; i < T; i++) {
          const s = x._[i],
            n = t.props[s];
          ((0, g.w)(n) || !1 === n) && (e[s] = n);
        }
        return e;
      }
      var S = i(63212);
      function b(t, e) {
        if (!Array.isArray(e)) return !1;
        const i = e.length;
        if (i !== t.length) return !1;
        for (let s = 0; s < i; s++) if (e[s] !== t[s]) return !1;
        return !0;
      }
      const P = [...x.U].reverse(),
        k = x.U.length;
      function V(t) {
        return (e) =>
          Promise.all(
            e.map(({ animation: e, options: i }) =>
              (function (t, e, i = {}) {
                let s;
                if ((t.notify("AnimationStart", e), Array.isArray(e))) {
                  const n = e.map((e) => v(t, e, i));
                  s = Promise.all(n);
                } else if ("string" == typeof e) s = v(t, e, i);
                else {
                  const r = "function" == typeof e ? n(t, e, i.custom) : e;
                  s = Promise.all(f(t, r, i));
                }
                return s.then(() => {
                  t.notify("AnimationComplete", e);
                });
              })(t, e, i)
            )
          );
      }
      function A(t) {
        let e = V(t),
          i = C(),
          s = !0;
        const r = (e) => (i, s) => {
          const r = n(t, s, "exit" === e ? t.presenceContext?.custom : void 0);
          if (r) {
            const { transition: t, transitionEnd: e, ...s } = r;
            i = { ...i, ...s, ...e };
          }
          return i;
        };
        function o(o) {
          const { props: a } = t,
            h = w(t.parent) || {},
            u = [],
            c = new Set();
          let d = {},
            p = 1 / 0;
          for (let e = 0; e < k; e++) {
            const m = P[e],
              f = i[m],
              v = void 0 !== a[m] ? a[m] : h[m],
              x = (0, g.w)(v),
              T = m === o ? f.isActive : null;
            !1 === T && (p = e);
            let w = v === h[m] && v !== a[m] && x;
            if (
              (w && s && t.manuallyAnimateOnMount && (w = !1),
              (f.protectedKeys = { ...d }),
              (!f.isActive && null === T) ||
                (!v && !f.prevProp) ||
                (0, S.N)(v) ||
                "boolean" == typeof v)
            )
              continue;
            const k = D(f.prevProp, v);
            let V = k || (m === o && f.isActive && !w && x) || (e > p && x),
              A = !1;
            const M = Array.isArray(v) ? v : [v];
            let C = M.reduce(r(m), {});
            !1 === T && (C = {});
            const { prevResolvedValues: R = {} } = f,
              B = { ...R, ...C },
              E = (e) => {
                (V = !0),
                  c.has(e) && ((A = !0), c.delete(e)),
                  (f.needsAnimating[e] = !0);
                const i = t.getValue(e);
                i && (i.liveStyle = !1);
              };
            for (const t in B) {
              const e = C[t],
                i = R[t];
              if (d.hasOwnProperty(t)) continue;
              let s = !1;
              (s = l(e) && l(i) ? !b(e, i) : e !== i),
                s
                  ? null != e
                    ? E(t)
                    : c.add(t)
                  : void 0 !== e && c.has(t)
                  ? E(t)
                  : (f.protectedKeys[t] = !0);
            }
            (f.prevProp = v),
              (f.prevResolvedValues = C),
              f.isActive && (d = { ...d, ...C }),
              s && t.blockInitialAnimation && (V = !1);
            const j = w && k;
            V &&
              (!j || A) &&
              u.push(
                ...M.map((e) => {
                  const i = { type: m };
                  if (
                    "string" == typeof e &&
                    s &&
                    !j &&
                    t.manuallyAnimateOnMount &&
                    t.parent
                  ) {
                    const { parent: s } = t,
                      r = n(s, e);
                    if (s.enteringChildren && r) {
                      const { delayChildren: e } = r.transition || {};
                      i.delay = y(s.enteringChildren, t, e);
                    }
                  }
                  return { animation: e, options: i };
                })
              );
          }
          if (c.size) {
            const e = {};
            if ("boolean" != typeof a.initial) {
              const i = n(
                t,
                Array.isArray(a.initial) ? a.initial[0] : a.initial
              );
              i && i.transition && (e.transition = i.transition);
            }
            c.forEach((i) => {
              const s = t.getBaseTarget(i),
                n = t.getValue(i);
              n && (n.liveStyle = !0), (e[i] = s ?? null);
            }),
              u.push({ animation: e });
          }
          let m = Boolean(u.length);
          return (
            !s ||
              (!1 !== a.initial && a.initial !== a.animate) ||
              t.manuallyAnimateOnMount ||
              (m = !1),
            (s = !1),
            m ? e(u) : Promise.resolve()
          );
        }
        return {
          animateChanges: o,
          setActive: function (e, s) {
            if (i[e].isActive === s) return Promise.resolve();
            t.variantChildren?.forEach((t) =>
              t.animationState?.setActive(e, s)
            ),
              (i[e].isActive = s);
            const n = o(e);
            for (const t in i) i[t].protectedKeys = {};
            return n;
          },
          setAnimateFunction: function (i) {
            e = i(t);
          },
          getState: () => i,
          reset: () => {
            i = C();
          },
        };
      }
      function D(t, e) {
        return "string" == typeof e ? e !== t : !!Array.isArray(e) && !b(e, t);
      }
      function M(t = !1) {
        return {
          isActive: t,
          protectedKeys: {},
          needsAnimating: {},
          prevResolvedValues: {},
        };
      }
      function C() {
        return {
          animate: M(!0),
          whileInView: M(),
          whileHover: M(),
          whileTap: M(),
          whileDrag: M(),
          whileFocus: M(),
          exit: M(),
        };
      }
    },
    63212(t, e, i) {
      function s(t) {
        return (
          null !== t && "object" == typeof t && "function" == typeof t.start
        );
      }
      i.d(e, { N: () => s });
    },
    9183(t, e, i) {
      i.d(e, { O: () => a, e: () => o });
      var s = i(63212),
        n = i(7329),
        r = i(9310);
      function o(t) {
        return (0, s.N)(t.animate) || r._.some((e) => (0, n.w)(t[e]));
      }
      function a(t) {
        return Boolean(o(t) || t.variants);
      }
    },
    41065(t, e, i) {
      i.d(e, { z: () => r });
      var s = i(50619),
        n = i(70561);
      function r(t, { layout: e, layoutId: i }) {
        return (
          s.f.has(t) ||
          t.startsWith("origin") ||
          ((e || void 0 !== i) && (!!n.H[t] || "opacity" === t))
        );
      }
    },
    7329(t, e, i) {
      function s(t) {
        return "string" == typeof t || Array.isArray(t);
      }
      i.d(e, { w: () => s });
    },
    5892(t, e, i) {
      i.d(e, { $: () => n });
      var s = i(50619);
      const n = new Set([
        "width",
        "height",
        "top",
        "left",
        "right",
        "bottom",
        ...s.U,
      ]);
    },
    50619(t, e, i) {
      i.d(e, { U: () => s, f: () => n });
      const s = [
          "transformPerspective",
          "x",
          "y",
          "z",
          "translateX",
          "translateY",
          "translateZ",
          "scale",
          "scaleX",
          "scaleY",
          "rotate",
          "rotateX",
          "rotateY",
          "rotateZ",
          "skew",
          "skewX",
          "skewY",
        ],
        n = (() => new Set(s))();
    },
    37859(t, e, i) {
      function s(t) {
        const e = [{}, {}];
        return (
          t?.values.forEach((t, i) => {
            (e[0][i] = t.get()), (e[1][i] = t.getVelocity());
          }),
          e
        );
      }
      function n(t, e, i, n) {
        if ("function" == typeof e) {
          const [r, o] = s(n);
          e = e(void 0 !== i ? i : t.custom, r, o);
        }
        if (
          ("string" == typeof e && (e = t.variants && t.variants[e]),
          "function" == typeof e)
        ) {
          const [r, o] = s(n);
          e = e(void 0 !== i ? i : t.custom, r, o);
        }
        return e;
      }
      i.d(e, { a: () => n });
    },
    9310(t, e, i) {
      i.d(e, { U: () => s, _: () => n });
      const s = [
          "animate",
          "whileInView",
          "whileFocus",
          "whileHover",
          "whileTap",
          "whileDrag",
          "exit",
        ],
        n = ["initial", ...s];
    },
    13417(t, e, i) {
      i.d(e, { q: () => s });
      const s = { layout: 0, mainThread: 0, waapi: 0 };
    },
    41361(t, e, i) {
      i.d(e, { Q: () => s });
      const s = { value: null, addProjectionMetrics: null };
    },
    45710(t, e, i) {
      i.d(e, { s: () => n });
      var s = i(31853);
      function n(t) {
        return (0, s.G)(t) && "offsetHeight" in t;
      }
    },
    45147(t, e, i) {
      i.d(e, { k: () => s });
      const s = (t, e, i) => t + (e - t) * i;
    },
    56603(t, e, i) {
      i.d(e, { OQ: () => h });
      var s = i(38354),
        n = i(6909),
        r = i(99036),
        o = i(27154);
      const a = { current: void 0 };
      class l {
        constructor(t, e = {}) {
          (this.canTrackVelocity = null),
            (this.events = {}),
            (this.updateAndNotify = (t) => {
              const e = r.k.now();
              if (
                (this.updatedAt !== e && this.setPrevFrameValue(),
                (this.prev = this.current),
                this.setCurrent(t),
                this.current !== this.prev &&
                  (this.events.change?.notify(this.current), this.dependents))
              )
                for (const t of this.dependents) t.dirty();
            }),
            (this.hasAnimated = !1),
            this.setCurrent(t),
            (this.owner = e.owner);
        }
        setCurrent(t) {
          var e;
          (this.current = t),
            (this.updatedAt = r.k.now()),
            null === this.canTrackVelocity &&
              void 0 !== t &&
              (this.canTrackVelocity =
                ((e = this.current), !isNaN(parseFloat(e))));
        }
        setPrevFrameValue(t = this.current) {
          (this.prevFrameValue = t), (this.prevUpdatedAt = this.updatedAt);
        }
        onChange(t) {
          return this.on("change", t);
        }
        on(t, e) {
          this.events[t] || (this.events[t] = new s.v());
          const i = this.events[t].add(e);
          return "change" === t
            ? () => {
                i(),
                  o.Gt.read(() => {
                    this.events.change.getSize() || this.stop();
                  });
              }
            : i;
        }
        clearListeners() {
          for (const t in this.events) this.events[t].clear();
        }
        attach(t, e) {
          (this.passiveEffect = t), (this.stopPassiveEffect = e);
        }
        set(t) {
          this.passiveEffect
            ? this.passiveEffect(t, this.updateAndNotify)
            : this.updateAndNotify(t);
        }
        setWithVelocity(t, e, i) {
          this.set(e),
            (this.prev = void 0),
            (this.prevFrameValue = t),
            (this.prevUpdatedAt = this.updatedAt - i);
        }
        jump(t, e = !0) {
          this.updateAndNotify(t),
            (this.prev = t),
            (this.prevUpdatedAt = this.prevFrameValue = void 0),
            e && this.stop(),
            this.stopPassiveEffect && this.stopPassiveEffect();
        }
        dirty() {
          this.events.change?.notify(this.current);
        }
        addDependent(t) {
          this.dependents || (this.dependents = new Set()),
            this.dependents.add(t);
        }
        removeDependent(t) {
          this.dependents && this.dependents.delete(t);
        }
        get() {
          return a.current && a.current.push(this), this.current;
        }
        getPrevious() {
          return this.prev;
        }
        getVelocity() {
          const t = r.k.now();
          if (
            !this.canTrackVelocity ||
            void 0 === this.prevFrameValue ||
            t - this.updatedAt > 30
          )
            return 0;
          const e = Math.min(this.updatedAt - this.prevUpdatedAt, 30);
          return (0, n.f)(
            parseFloat(this.current) - parseFloat(this.prevFrameValue),
            e
          );
        }
        start(t) {
          return (
            this.stop(),
            new Promise((e) => {
              (this.hasAnimated = !0),
                (this.animation = t(e)),
                this.events.animationStart &&
                  this.events.animationStart.notify();
            }).then(() => {
              this.events.animationComplete &&
                this.events.animationComplete.notify(),
                this.clearAnimation();
            })
          );
        }
        stop() {
          this.animation &&
            (this.animation.stop(),
            this.events.animationCancel &&
              this.events.animationCancel.notify()),
            this.clearAnimation();
        }
        isAnimating() {
          return !!this.animation;
        }
        clearAnimation() {
          delete this.animation;
        }
        destroy() {
          this.dependents?.clear(),
            this.events.destroy?.notify(),
            this.clearListeners(),
            this.stop(),
            this.stopPassiveEffect && this.stopPassiveEffect();
        }
      }
      function h(t, e) {
        return new l(t, e);
      }
    },
    24854(t, e, i) {
      i.d(e, { u: () => n });
      var s = i(63297);
      const n = {
        test: (0, i(8982).$)("#"),
        parse: function (t) {
          let e = "",
            i = "",
            s = "",
            n = "";
          return (
            t.length > 5
              ? ((e = t.substring(1, 3)),
                (i = t.substring(3, 5)),
                (s = t.substring(5, 7)),
                (n = t.substring(7, 9)))
              : ((e = t.substring(1, 2)),
                (i = t.substring(2, 3)),
                (s = t.substring(3, 4)),
                (n = t.substring(4, 5)),
                (e += e),
                (i += i),
                (s += s),
                (n += n)),
            {
              red: parseInt(e, 16),
              green: parseInt(i, 16),
              blue: parseInt(s, 16),
              alpha: n ? parseInt(n, 16) / 255 : 1,
            }
          );
        },
        transform: s.B.transform,
      };
    },
    57605(t, e, i) {
      i.d(e, { V: () => a });
      var s = i(76745),
        n = i(11159),
        r = i(55100),
        o = i(8982);
      const a = {
        test: (0, o.$)("hsl", "hue"),
        parse: (0, o.q)("hue", "saturation", "lightness"),
        transform: ({ hue: t, saturation: e, lightness: i, alpha: o = 1 }) =>
          "hsla(" +
          Math.round(t) +
          ", " +
          n.KN.transform((0, r.a)(e)) +
          ", " +
          n.KN.transform((0, r.a)(i)) +
          ", " +
          (0, r.a)(s.X4.transform(o)) +
          ")",
      };
    },
    26961(t, e, i) {
      i.d(e, { y: () => o });
      var s = i(24854),
        n = i(57605),
        r = i(63297);
      const o = {
        test: (t) => r.B.test(t) || s.u.test(t) || n.V.test(t),
        parse: (t) =>
          r.B.test(t)
            ? r.B.parse(t)
            : n.V.test(t)
            ? n.V.parse(t)
            : s.u.parse(t),
        transform: (t) =>
          "string" == typeof t
            ? t
            : t.hasOwnProperty("red")
            ? r.B.transform(t)
            : n.V.transform(t),
        getAnimatableNone: (t) => {
          const e = o.parse(t);
          return (e.alpha = 0), o.transform(e);
        },
      };
    },
    63297(t, e, i) {
      i.d(e, { B: () => l });
      var s = i(32052),
        n = i(76745),
        r = i(55100),
        o = i(8982);
      const a = {
          ...n.ai,
          transform: (t) => Math.round(((t) => (0, s.q)(0, 255, t))(t)),
        },
        l = {
          test: (0, o.$)("rgb", "red"),
          parse: (0, o.q)("red", "green", "blue"),
          transform: ({ red: t, green: e, blue: i, alpha: s = 1 }) =>
            "rgba(" +
            a.transform(t) +
            ", " +
            a.transform(e) +
            ", " +
            a.transform(i) +
            ", " +
            (0, r.a)(n.X4.transform(s)) +
            ")",
        };
    },
    8982(t, e, i) {
      i.d(e, { $: () => r, q: () => o });
      var s = i(70175);
      const n =
          /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
        r = (t, e) => (i) =>
          Boolean(
            ("string" == typeof i && n.test(i) && i.startsWith(t)) ||
              (e &&
                !(function (t) {
                  return null == t;
                })(i) &&
                Object.prototype.hasOwnProperty.call(i, e))
          ),
        o = (t, e, i) => (n) => {
          if ("string" != typeof n) return n;
          const [r, o, a, l] = n.match(s.S);
          return {
            [t]: parseFloat(r),
            [e]: parseFloat(o),
            [i]: parseFloat(a),
            alpha: void 0 !== l ? parseFloat(l) : 1,
          };
        };
    },
    13058(t, e, i) {
      i.d(e, { p: () => l });
      var s = i(72525),
        n = i(70175);
      const r = new Set(["brightness", "contrast", "saturate", "opacity"]);
      function o(t) {
        const [e, i] = t.slice(0, -1).split("(");
        if ("drop-shadow" === e) return t;
        const [s] = i.match(n.S) || [];
        if (!s) return t;
        const o = i.replace(s, "");
        let a = r.has(e) ? 1 : 0;
        return s !== i && (a *= 100), e + "(" + a + o + ")";
      }
      const a = /\b([a-z-]*)\(.*?\)/gu,
        l = {
          ...s.f,
          getAnimatableNone: (t) => {
            const e = t.match(a);
            return e ? e.map(o).join(" ") : t;
          },
        };
    },
    72525(t, e, i) {
      i.d(e, { V: () => u, f: () => m });
      var s = i(26961);
      const n =
        /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
      var r = i(70175),
        o = i(55100);
      const a = "number",
        l = "color",
        h =
          /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
      function u(t) {
        const e = t.toString(),
          i = [],
          n = { color: [], number: [], var: [] },
          r = [];
        let o = 0;
        const u = e
          .replace(
            h,
            (t) => (
              s.y.test(t)
                ? (n.color.push(o), r.push(l), i.push(s.y.parse(t)))
                : t.startsWith("var(")
                ? (n.var.push(o), r.push("var"), i.push(t))
                : (n.number.push(o), r.push(a), i.push(parseFloat(t))),
              ++o,
              "${}"
            )
          )
          .split("${}");
        return { values: i, split: u, indexes: n, types: r };
      }
      function c(t) {
        return u(t).values;
      }
      function d(t) {
        const { split: e, types: i } = u(t),
          n = e.length;
        return (t) => {
          let r = "";
          for (let h = 0; h < n; h++)
            if (((r += e[h]), void 0 !== t[h])) {
              const e = i[h];
              r +=
                e === a ? (0, o.a)(t[h]) : e === l ? s.y.transform(t[h]) : t[h];
            }
          return r;
        };
      }
      const p = (t) =>
        "number" == typeof t ? 0 : s.y.test(t) ? s.y.getAnimatableNone(t) : t;
      const m = {
        test: function (t) {
          return (
            isNaN(t) &&
            "string" == typeof t &&
            (t.match(r.S)?.length || 0) + (t.match(n)?.length || 0) > 0
          );
        },
        parse: c,
        createTransformer: d,
        getAnimatableNone: function (t) {
          const e = c(t);
          return d(t)(e.map(p));
        },
      };
    },
    17953(t, e, i) {
      i.d(e, { n: () => a, T: () => o });
      var s = i(76745),
        n = i(11159),
        r = i(40363);
      const o = [
          s.ai,
          n.px,
          n.KN,
          n.uj,
          n.vw,
          n.vh,
          { test: (t) => "auto" === t, parse: (t) => t },
        ],
        a = (t) => o.find((0, r.w)(t));
    },
    10739(t, e, i) {
      i.d(e, { D: () => o });
      var s = i(26961),
        n = i(13058);
      const r = {
          ...i(65160).W,
          color: s.y,
          backgroundColor: s.y,
          outlineColor: s.y,
          fill: s.y,
          stroke: s.y,
          borderColor: s.y,
          borderTopColor: s.y,
          borderRightColor: s.y,
          borderBottomColor: s.y,
          borderLeftColor: s.y,
          filter: n.p,
          WebkitFilter: n.p,
        },
        o = (t) => r[t];
    },
    65160(t, e, i) {
      i.d(e, { W: () => a });
      var s = i(76745);
      const n = { ...s.ai, transform: Math.round };
      var r = i(11159);
      const o = {
          rotate: r.uj,
          rotateX: r.uj,
          rotateY: r.uj,
          rotateZ: r.uj,
          scale: s.hs,
          scaleX: s.hs,
          scaleY: s.hs,
          scaleZ: s.hs,
          skew: r.uj,
          skewX: r.uj,
          skewY: r.uj,
          distance: r.px,
          translateX: r.px,
          translateY: r.px,
          translateZ: r.px,
          x: r.px,
          y: r.px,
          z: r.px,
          perspective: r.px,
          transformPerspective: r.px,
          opacity: s.X4,
          originX: r.gQ,
          originY: r.gQ,
          originZ: r.px,
        },
        a = {
          borderWidth: r.px,
          borderTopWidth: r.px,
          borderRightWidth: r.px,
          borderBottomWidth: r.px,
          borderLeftWidth: r.px,
          borderRadius: r.px,
          borderTopLeftRadius: r.px,
          borderTopRightRadius: r.px,
          borderBottomRightRadius: r.px,
          borderBottomLeftRadius: r.px,
          width: r.px,
          maxWidth: r.px,
          height: r.px,
          maxHeight: r.px,
          top: r.px,
          right: r.px,
          bottom: r.px,
          left: r.px,
          inset: r.px,
          insetBlock: r.px,
          insetBlockStart: r.px,
          insetBlockEnd: r.px,
          insetInline: r.px,
          insetInlineStart: r.px,
          insetInlineEnd: r.px,
          padding: r.px,
          paddingTop: r.px,
          paddingRight: r.px,
          paddingBottom: r.px,
          paddingLeft: r.px,
          paddingBlock: r.px,
          paddingBlockStart: r.px,
          paddingBlockEnd: r.px,
          paddingInline: r.px,
          paddingInlineStart: r.px,
          paddingInlineEnd: r.px,
          margin: r.px,
          marginTop: r.px,
          marginRight: r.px,
          marginBottom: r.px,
          marginLeft: r.px,
          marginBlock: r.px,
          marginBlockStart: r.px,
          marginBlockEnd: r.px,
          marginInline: r.px,
          marginInlineStart: r.px,
          marginInlineEnd: r.px,
          fontSize: r.px,
          backgroundPositionX: r.px,
          backgroundPositionY: r.px,
          ...o,
          zIndex: n,
          fillOpacity: s.X4,
          strokeOpacity: s.X4,
          numOctaves: n,
        };
    },
    76745(t, e, i) {
      i.d(e, { X4: () => r, ai: () => n, hs: () => o });
      var s = i(32052);
      const n = {
          test: (t) => "number" == typeof t,
          parse: parseFloat,
          transform: (t) => t,
        },
        r = { ...n, transform: (t) => (0, s.q)(0, 1, t) },
        o = { ...n, default: 1 };
    },
    11159(t, e, i) {
      i.d(e, {
        KN: () => r,
        gQ: () => h,
        px: () => o,
        uj: () => n,
        vh: () => a,
        vw: () => l,
      });
      const s = (t) => ({
          test: (e) =>
            "string" == typeof e && e.endsWith(t) && 1 === e.split(" ").length,
          parse: parseFloat,
          transform: (e) => `${e}${t}`,
        }),
        n = s("deg"),
        r = s("%"),
        o = s("px"),
        a = s("vh"),
        l = s("vw"),
        h = (() => ({
          ...r,
          parse: (t) => r.parse(t) / 100,
          transform: (t) => r.transform(100 * t),
        }))();
    },
    40363(t, e, i) {
      i.d(e, { w: () => s });
      const s = (t) => (e) => e.test(t);
    },
    43044(t, e, i) {
      i.d(e, { J: () => o });
      var s = i(72525),
        n = i(13058),
        r = i(10739);
      function o(t, e) {
        let i = (0, r.D)(t);
        return (
          i !== n.p && (i = s.f),
          i.getAnimatableNone ? i.getAnimatableNone(e) : void 0
        );
      }
    },
    70175(t, e, i) {
      i.d(e, { S: () => s });
      const s = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
    },
    55100(t, e, i) {
      i.d(e, { a: () => s });
      const s = (t) => Math.round(1e5 * t) / 1e5;
    },
    32298(t, e, i) {
      i.d(e, { S: () => s });
      const s = (t) => Boolean(t && t.getVelocity);
    },
    6652(t, e, i) {
      i.d(e, { u: () => n });
      var s = i(32298);
      function n(t) {
        return (0, s.S)(t) ? t.get() : t;
      }
    },
    84116(t, e, i) {
      i.d(e, { g: () => r });
      var s = i(34901),
        n = i(32298);
      function r(t, e) {
        const i = t.getValue("willChange");
        if (((r = i), Boolean((0, n.S)(r) && r.add))) return i.add(e);
        if (!i && s.W.WillChange) {
          const i = new s.W.WillChange("auto");
          t.addValue("willChange", i), i.add(e);
        }
        var r;
      }
    },
  },
]);
