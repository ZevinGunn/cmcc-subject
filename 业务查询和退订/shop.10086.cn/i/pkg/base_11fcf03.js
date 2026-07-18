!(function (e, t) {
  "use strict";
  "object" == typeof module && "object" == typeof module.exports
    ? (module.exports = e.document
        ? t(e, !0)
        : function (e) {
            if (!e.document)
              throw new Error("jQuery requires a window with a document");
            return t(e);
          })
    : t(e);
})("undefined" != typeof window ? window : this, function (a, e) {
  "use strict";
  function c(e, t, n) {
    var r,
      i,
      o = (n = n || ht).createElement("script");
    if (((o.text = e), t))
      for (r in gt)
        (i = t[r] || (t.getAttribute && t.getAttribute(r))) &&
          o.setAttribute(r, i);
    n.head.appendChild(o).parentNode.removeChild(o);
  }
  function h(e) {
    return null == e
      ? e + ""
      : "object" == typeof e || "function" == typeof e
      ? n[o.call(e)] || "object"
      : typeof e;
  }
  function p(e) {
    var t = !!e && "length" in e && e.length,
      n = h(e);
    return (
      !m(e) &&
      !x(e) &&
      ("array" === n ||
        0 === t ||
        ("number" == typeof t && t > 0 && t - 1 in e))
    );
  }
  function g(e, t) {
    return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase();
  }
  function v(e, n, r) {
    return m(n)
      ? mt.grep(e, function (e, t) {
          return !!n.call(e, t, e) !== r;
        })
      : n.nodeType
      ? mt.grep(e, function (e) {
          return (e === n) !== r;
        })
      : "string" != typeof n
      ? mt.grep(e, function (e) {
          return -1 < i.call(n, e) !== r;
        })
      : mt.filter(n, e, r);
  }
  function y(e, t) {
    for (; (e = e[t]) && 1 !== e.nodeType; );
    return e;
  }
  function b(e) {
    return e;
  }
  function w(e) {
    throw e;
  }
  function T(e, t, n, r) {
    var i;
    try {
      e && m((i = e.promise))
        ? i.call(e).done(t).fail(n)
        : e && m((i = e.then))
        ? i.call(e, t, n)
        : t.apply(void 0, [e].slice(r));
    } catch (e) {
      n.apply(void 0, [e]);
    }
  }
  function C() {
    ht.removeEventListener("DOMContentLoaded", C),
      a.removeEventListener("load", C),
      mt.ready();
  }
  function S(e, t) {
    return t.toUpperCase();
  }
  function E(e) {
    return e.replace(jt, "ms-").replace(Nt, S);
  }
  function k() {
    this.expando = mt.expando + k.uid++;
  }
  function A(e, t, n) {
    var r, i;
    if (void 0 === n && 1 === e.nodeType)
      if (
        ((r = "data-" + t.replace(Ot, "-$&").toLowerCase()),
        "string" == typeof (n = e.getAttribute(r)))
      ) {
        try {
          n =
            "true" === (i = n) ||
            ("false" !== i &&
              ("null" === i
                ? null
                : i === +i + ""
                ? +i
                : Ht.test(i)
                ? JSON.parse(i)
                : i));
        } catch (e) {}
        Lt.set(e, t, n);
      } else n = void 0;
    return n;
  }
  function j(e, t, n, r) {
    var i,
      o,
      a = 20,
      s = r
        ? function () {
            return r.cur();
          }
        : function () {
            return mt.css(e, t, "");
          },
      u = s(),
      l = (n && n[3]) || (mt.cssNumber[t] ? "" : "px"),
      c =
        e.nodeType &&
        (mt.cssNumber[t] || ("px" !== l && +u)) &&
        Rt.exec(mt.css(e, t));
    if (c && c[3] !== l) {
      for (u /= 2, l = l || c[3], c = +u || 1; a--; )
        mt.style(e, t, c + l),
          (1 - o) * (1 - (o = s() / u || 0.5)) <= 0 && (a = 0),
          (c /= o);
      (c *= 2), mt.style(e, t, c + l), (n = n || []);
    }
    return (
      n &&
        ((c = +c || +u || 0),
        (i = n[1] ? c + (n[1] + 1) * n[2] : +n[2]),
        r && ((r.unit = l), (r.start = c), (r.end = i))),
      i
    );
  }
  function le(e, t) {
    for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; f > c; c++)
      (r = e[c]).style &&
        ((n = r.style.display),
        t
          ? ("none" === n &&
              ((l[c] = qt.get(r, "display") || null),
              l[c] || (r.style.display = "")),
            "" === r.style.display &&
              Wt(r) &&
              (l[c] =
                ((u = a = o = void 0),
                (a = (i = r).ownerDocument),
                (s = i.nodeName),
                (u = Ft[s]) ||
                  ((o = a.body.appendChild(a.createElement(s))),
                  (u = mt.css(o, "display")),
                  o.parentNode.removeChild(o),
                  "none" === u && (u = "block"),
                  (Ft[s] = u)))))
          : "none" !== n && ((l[c] = "none"), qt.set(r, "display", n)));
    for (c = 0; f > c; c++) null != l[c] && (e[c].style.display = l[c]);
    return e;
  }
  function N(e, t) {
    var n;
    return (
      (n =
        "undefined" != typeof e.getElementsByTagName
          ? e.getElementsByTagName(t || "*")
          : "undefined" != typeof e.querySelectorAll
          ? e.querySelectorAll(t || "*")
          : []),
      void 0 === t || (t && g(e, t)) ? mt.merge([e], n) : n
    );
  }
  function D(e, t) {
    for (var n = 0, r = e.length; r > n; n++)
      qt.set(e[n], "globalEval", !t || qt.get(t[n], "globalEval"));
  }
  function L(e, t, n, r, i) {
    for (
      var o,
        a,
        s,
        u,
        l,
        c,
        f = t.createDocumentFragment(),
        p = [],
        d = 0,
        g = e.length;
      g > d;
      d++
    )
      if ((o = e[d]) || 0 === o)
        if ("object" === h(o)) mt.merge(p, o.nodeType ? [o] : o);
        else if (Xt.test(o)) {
          for (
            a = a || f.appendChild(t.createElement("div")),
              s = (de.exec(o) || ["", ""])[1].toLowerCase(),
              u = zt[s] || zt._default,
              a.innerHTML = u[1] + mt.htmlPrefilter(o) + u[2],
              c = u[0];
            c--;

          )
            a = a.lastChild;
          mt.merge(p, a.childNodes), ((a = f.firstChild).textContent = "");
        } else p.push(t.createTextNode(o));
    for (f.textContent = "", d = 0; (o = p[d++]); )
      if (r && -1 < mt.inArray(o, r)) i && i.push(o);
      else if (((l = Mt(o)), (a = N(f.appendChild(o), "script")), l && D(a), n))
        for (c = 0; (o = a[c++]); ) Ut.test(o.type || "") && n.push(o);
    return f;
  }
  function H() {
    return !0;
  }
  function O() {
    return !1;
  }
  function P(e, t) {
    return (
      (e ===
        (function () {
          try {
            return ht.activeElement;
          } catch (e) {}
        })()) ==
      ("focus" === t)
    );
  }
  function R(e, t, n, r, i, o) {
    var a, s;
    if ("object" == typeof t) {
      for (s in ("string" != typeof n && ((r = r || n), (n = void 0)), t))
        R(e, s, n, r, t[s], o);
      return e;
    }
    if (
      (null == r && null == i
        ? ((i = n), (r = n = void 0))
        : null == i &&
          ("string" == typeof n
            ? ((i = r), (r = void 0))
            : ((i = r), (r = n), (n = void 0))),
      !1 === i)
    )
      i = O;
    else if (!i) return e;
    return (
      1 === o &&
        ((a = i),
        ((i = function (e) {
          return mt().off(e), a.apply(this, arguments);
        }).guid = a.guid || (a.guid = mt.guid++))),
      e.each(function () {
        mt.event.add(this, t, i, r, n);
      })
    );
  }
  function M(e, i, o) {
    o
      ? (qt.set(e, i, !1),
        mt.event.add(e, i, {
          namespace: !1,
          handler: function (e) {
            var t,
              n,
              r = qt.get(this, i);
            if (1 & e.isTrigger && this[i]) {
              if (r.length)
                (mt.event.special[i] || {}).delegateType && e.stopPropagation();
              else if (
                ((r = s.call(arguments)),
                qt.set(this, i, r),
                (t = o(this, i)),
                this[i](),
                r !== (n = qt.get(this, i)) || t
                  ? qt.set(this, i, !1)
                  : (n = {}),
                r !== n)
              )
                return (
                  e.stopImmediatePropagation(), e.preventDefault(), n && n.value
                );
            } else
              r.length &&
                (qt.set(this, i, {
                  value: mt.event.trigger(
                    mt.extend(r[0], mt.Event.prototype),
                    r.slice(1),
                    this
                  ),
                }),
                e.stopImmediatePropagation());
          },
        }))
      : void 0 === qt.get(e, i) && mt.event.add(e, i, H);
  }
  function I(e, t) {
    return (
      (g(e, "table") &&
        g(11 !== t.nodeType ? t : t.firstChild, "tr") &&
        mt(e).children("tbody")[0]) ||
      e
    );
  }
  function W(e) {
    return (e.type = (null !== e.getAttribute("type")) + "/" + e.type), e;
  }
  function F(e) {
    return (
      "true/" === (e.type || "").slice(0, 5)
        ? (e.type = e.type.slice(5))
        : e.removeAttribute("type"),
      e
    );
  }
  function $(e, t) {
    var n, r, i, o, a, s;
    if (1 === t.nodeType) {
      if (qt.hasData(e) && (s = qt.get(e).events))
        for (i in (qt.remove(t, "handle events"), s))
          for (n = 0, r = s[i].length; r > n; n++) mt.event.add(t, i, s[i][n]);
      Lt.hasData(e) &&
        ((o = Lt.access(e)), (a = mt.extend({}, o)), Lt.set(t, a));
    }
  }
  function B(n, r, i, o) {
    r = ct(r);
    var e,
      t,
      a,
      s,
      u,
      l,
      h = 0,
      f = n.length,
      p = f - 1,
      d = r[0],
      g = m(d);
    if (g || (f > 1 && "string" == typeof d && !dt.checkClone && Jt.test(d)))
      return n.each(function (e) {
        var t = n.eq(e);
        g && (r[0] = d.call(this, e, t.html())), B(t, r, i, o);
      });
    if (
      f &&
      ((t = (e = L(r, n[0].ownerDocument, !1, n, o)).firstChild),
      1 === e.childNodes.length && (e = t),
      t || o)
    ) {
      for (s = (a = mt.map(N(e, "script"), W)).length; f > h; h++)
        (u = e),
          h !== p &&
            ((u = mt.clone(u, !0, !0)), s && mt.merge(a, N(u, "script"))),
          i.call(n[h], u, h);
      if (s)
        for (l = a[a.length - 1].ownerDocument, mt.map(a, F), h = 0; s > h; h++)
          (u = a[h]),
            Ut.test(u.type || "") &&
              !qt.access(u, "globalEval") &&
              mt.contains(l, u) &&
              (u.src && "module" !== (u.type || "").toLowerCase()
                ? mt._evalUrl &&
                  !u.noModule &&
                  mt._evalUrl(
                    u.src,
                    { nonce: u.nonce || u.getAttribute("nonce") },
                    l
                  )
                : c(u.textContent.replace(Yt, ""), u, l));
    }
    return n;
  }
  function _(e, t, n) {
    for (var r, i = t ? mt.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
      n || 1 !== r.nodeType || mt.cleanData(N(r)),
        r.parentNode &&
          (n && Mt(r) && D(N(r, "script")), r.parentNode.removeChild(r));
    return e;
  }
  function U(e, t, n) {
    var r,
      i,
      o,
      a,
      s = e.style;
    return (
      (n = n || Kt(e)) &&
        ("" !== (a = n.getPropertyValue(t) || n[t]) ||
          Mt(e) ||
          (a = mt.style(e, t)),
        !dt.pixelBoxStyles() &&
          Qt.test(a) &&
          en.test(t) &&
          ((r = s.width),
          (i = s.minWidth),
          (o = s.maxWidth),
          (s.minWidth = s.maxWidth = s.width = a),
          (a = n.width),
          (s.width = r),
          (s.minWidth = i),
          (s.maxWidth = o))),
      void 0 !== a ? a + "" : a
    );
  }
  function z(e, t) {
    return {
      get: function () {
        return e()
          ? void delete this.get
          : (this.get = t).apply(this, arguments);
      },
    };
  }
  function X(e) {
    var t = mt.cssProps[e] || rn[e];
    return (
      t ||
      (e in nn
        ? e
        : (rn[e] =
            (function (e) {
              for (
                var t = e[0].toUpperCase() + e.slice(1), n = tn.length;
                n--;

              )
                if ((e = tn[n] + t) in nn) return e;
            })(e) || e))
    );
  }
  function V(e, t, n) {
    var r = Rt.exec(t);
    return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t;
  }
  function G(e, t, n, r, i, o) {
    var a = "width" === t ? 1 : 0,
      s = 0,
      u = 0;
    if (n === (r ? "border" : "content")) return 0;
    for (; 4 > a; a += 2)
      "margin" === n && (u += mt.css(e, n + ne[a], !0, i)),
        r
          ? ("content" === n && (u -= mt.css(e, "padding" + ne[a], !0, i)),
            "margin" !== n &&
              (u -= mt.css(e, "border" + ne[a] + "Width", !0, i)))
          : ((u += mt.css(e, "padding" + ne[a], !0, i)),
            "padding" !== n
              ? (u += mt.css(e, "border" + ne[a] + "Width", !0, i))
              : (s += mt.css(e, "border" + ne[a] + "Width", !0, i)));
    return (
      !r &&
        o >= 0 &&
        (u +=
          Math.max(
            0,
            Math.ceil(
              e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - 0.5
            )
          ) || 0),
      u
    );
  }
  function J(e, t, n) {
    var r = Kt(e),
      i =
        (!dt.boxSizingReliable() || n) &&
        "border-box" === mt.css(e, "boxSizing", !1, r),
      o = i,
      a = U(e, t, r),
      s = "offset" + t[0].toUpperCase() + t.slice(1);
    if (Qt.test(a)) {
      if (!n) return a;
      a = "auto";
    }
    return (
      ((!dt.boxSizingReliable() && i) ||
        (!dt.reliableTrDimensions() && g(e, "tr")) ||
        "auto" === a ||
        (!parseFloat(a) && "inline" === mt.css(e, "display", !1, r))) &&
        e.getClientRects().length &&
        ((i = "border-box" === mt.css(e, "boxSizing", !1, r)),
        (o = s in e) && (a = e[s])),
      (a = parseFloat(a) || 0) +
        G(e, t, n || (i ? "border" : "content"), o, r, a) +
        "px"
    );
  }
  function Y(e, t, n, r, i) {
    return new Y.prototype.init(e, t, n, r, i);
  }
  function Q() {
    cn &&
      (!1 === ht.hidden && a.requestAnimationFrame
        ? a.requestAnimationFrame(Q)
        : a.setTimeout(Q, mt.fx.interval),
      mt.fx.tick());
  }
  function K() {
    return (
      a.setTimeout(function () {
        ln = void 0;
      }),
      (ln = Date.now())
    );
  }
  function Z(e, t) {
    var n,
      r = 0,
      i = { height: e };
    for (t = t ? 1 : 0; 4 > r; r += 2 - t)
      i["margin" + (n = ne[r])] = i["padding" + n] = e;
    return t && (i.opacity = i.width = e), i;
  }
  function et(e, t, n) {
    for (
      var r,
        i = (tt.tweeners[t] || []).concat(tt.tweeners["*"]),
        o = 0,
        a = i.length;
      a > o;
      o++
    )
      if ((r = i[o].call(n, t, e))) return r;
  }
  function tt(o, e, t) {
    var n,
      a,
      r = 0,
      i = tt.prefilters.length,
      s = mt.Deferred().always(function () {
        delete u.elem;
      }),
      u = function () {
        if (a) return !1;
        for (
          var e = ln || K(),
            t = Math.max(0, l.startTime + l.duration - e),
            n = 1 - (t / l.duration || 0),
            r = 0,
            i = l.tweens.length;
          i > r;
          r++
        )
          l.tweens[r].run(n);
        return (
          s.notifyWith(o, [l, n, t]),
          1 > n && i
            ? t
            : (i || s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l]), !1)
        );
      },
      l = s.promise({
        elem: o,
        props: mt.extend({}, e),
        opts: mt.extend(
          !0,
          { specialEasing: {}, easing: mt.easing._default },
          t
        ),
        originalProperties: e,
        originalOptions: t,
        startTime: ln || K(),
        duration: t.duration,
        tweens: [],
        createTween: function (e, t) {
          var n = mt.Tween(
            o,
            l.opts,
            e,
            t,
            l.opts.specialEasing[e] || l.opts.easing
          );
          return l.tweens.push(n), n;
        },
        stop: function (e) {
          var t = 0,
            n = e ? l.tweens.length : 0;
          if (a) return this;
          for (a = !0; n > t; t++) l.tweens[t].run(1);
          return (
            e
              ? (s.notifyWith(o, [l, 1, 0]), s.resolveWith(o, [l, e]))
              : s.rejectWith(o, [l, e]),
            this
          );
        },
      }),
      c = l.props;
    for (
      !(function (e, t) {
        var n, r, i, o, a;
        for (n in e)
          if (
            ((i = t[(r = E(n))]),
            (o = e[n]),
            Array.isArray(o) && ((i = o[1]), (o = e[n] = o[0])),
            n !== r && ((e[r] = o), delete e[n]),
            (a = mt.cssHooks[r]) && ("expand" in a))
          )
            for (n in ((o = a.expand(o)), delete e[r], o))
              (n in e) || ((e[n] = o[n]), (t[n] = i));
          else t[r] = i;
      })(c, l.opts.specialEasing);
      i > r;
      r++
    )
      if ((n = tt.prefilters[r].call(l, o, c, l.opts)))
        return (
          m(n.stop) &&
            (mt._queueHooks(l.elem, l.opts.queue).stop = n.stop.bind(n)),
          n
        );
    return (
      mt.map(c, et, l),
      m(l.opts.start) && l.opts.start.call(o, l),
      l
        .progress(l.opts.progress)
        .done(l.opts.done, l.opts.complete)
        .fail(l.opts.fail)
        .always(l.opts.always),
      mt.fx.timer(mt.extend(u, { elem: o, anim: l, queue: l.opts.queue })),
      l
    );
  }
  function nt(e) {
    return (e.match(St) || []).join(" ");
  }
  function ot(e) {
    return (e.getAttribute && e.getAttribute("class")) || "";
  }
  function it(e) {
    return Array.isArray(e) ? e : ("string" == typeof e && e.match(St)) || [];
  }
  function at(n, e, r, i) {
    var t;
    if (Array.isArray(e))
      mt.each(e, function (e, t) {
        r || Sn.test(n)
          ? i(n, t)
          : at(
              n + "[" + ("object" == typeof t && null != t ? e : "") + "]",
              t,
              r,
              i
            );
      });
    else if (r || "object" !== h(e)) i(n, e);
    else for (t in e) at(n + "[" + t + "]", e[t], r, i);
  }
  function st(o) {
    return function (e, t) {
      "string" != typeof e && ((t = e), (e = "*"));
      var n,
        r = 0,
        i = e.toLowerCase().match(St) || [];
      if (m(t))
        for (; (n = i[r++]); )
          "+" === n[0]
            ? ((n = n.slice(1) || "*"), (o[n] = o[n] || []).unshift(t))
            : (o[n] = o[n] || []).push(t);
    };
  }
  function ut(t, i, o, a) {
    function l(e) {
      var r;
      return (
        (s[e] = !0),
        mt.each(t[e] || [], function (e, t) {
          var n = t(i, o, a);
          return "string" != typeof n || u || s[n]
            ? u
              ? !(r = n)
              : void 0
            : (i.dataTypes.unshift(n), l(n), !1);
        }),
        r
      );
    }
    var s = {},
      u = t === Pn;
    return l(i.dataTypes[0]) || (!s["*"] && l("*"));
  }
  function lt(e, t) {
    var n,
      r,
      i = mt.ajaxSettings.flatOptions || {};
    for (n in t) void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
    return r && mt.extend(!0, e, r), e;
  }
  var t = [],
    r = Object.getPrototypeOf,
    s = t.slice,
    ct = t.flat
      ? function (e) {
          return t.flat.call(e);
        }
      : function (e) {
          return t.concat.apply([], e);
        },
    u = t.push,
    i = t.indexOf,
    n = {},
    o = n.toString,
    ft = n.hasOwnProperty,
    pt = ft.toString,
    l = pt.call(Object),
    dt = {},
    m = function (e) {
      return (
        "function" == typeof e &&
        "number" != typeof e.nodeType &&
        "function" != typeof e.item
      );
    },
    x = function (e) {
      return null != e && e === e.window;
    },
    ht = a.document,
    gt = { type: !0, src: !0, nonce: !0, noModule: !0 },
    f = "",
    mt = function (e, t) {
      return new mt.fn.init(e, t);
    };
  (mt.fn = mt.prototype =
    {
      jquery: f,
      constructor: mt,
      length: 0,
      toArray: function () {
        return s.call(this);
      },
      get: function (e) {
        return null == e
          ? s.call(this)
          : 0 > e
          ? this[e + this.length]
          : this[e];
      },
      pushStack: function (e) {
        var t = mt.merge(this.constructor(), e);
        return (t.prevObject = this), t;
      },
      each: function (e) {
        return mt.each(this, e);
      },
      map: function (n) {
        return this.pushStack(
          mt.map(this, function (e, t) {
            return n.call(e, t, e);
          })
        );
      },
      slice: function () {
        return this.pushStack(s.apply(this, arguments));
      },
      first: function () {
        return this.eq(0);
      },
      last: function () {
        return this.eq(-1);
      },
      even: function () {
        return this.pushStack(
          mt.grep(this, function (e, t) {
            return (t + 1) % 2;
          })
        );
      },
      odd: function () {
        return this.pushStack(
          mt.grep(this, function (e, t) {
            return t % 2;
          })
        );
      },
      eq: function (e) {
        var t = this.length,
          n = +e + (0 > e ? t : 0);
        return this.pushStack(n >= 0 && t > n ? [this[n]] : []);
      },
      end: function () {
        return this.prevObject || this.constructor();
      },
      push: u,
      sort: t.sort,
      splice: t.splice,
    }),
    (mt.extend = mt.fn.extend =
      function () {
        var e,
          t,
          n,
          r,
          i,
          o,
          a = arguments[0] || {},
          s = 1,
          u = arguments.length,
          l = !1;
        for (
          "boolean" == typeof a && ((l = a), (a = arguments[s] || {}), s++),
            "object" == typeof a || m(a) || (a = {}),
            s === u && ((a = this), s--);
          u > s;
          s++
        )
          if (null != (e = arguments[s]))
            for (t in e)
              (r = e[t]),
                "__proto__" !== t &&
                  a !== r &&
                  (l && r && (mt.isPlainObject(r) || (i = Array.isArray(r)))
                    ? ((n = a[t]),
                      (o =
                        i && !Array.isArray(n)
                          ? []
                          : i || mt.isPlainObject(n)
                          ? n
                          : {}),
                      (i = !1),
                      (a[t] = mt.extend(l, o, r)))
                    : void 0 !== r && (a[t] = r));
        return a;
      }),
    mt.extend({
      expando: "jQuery" + (f + Math.random()).replace(/\D/g, ""),
      isReady: !0,
      error: function (e) {
        throw new Error(e);
      },
      noop: function () {},
      isPlainObject: function (e) {
        var t, n;
        return !(
          !e ||
          "[object Object]" !== o.call(e) ||
          ((t = r(e)) &&
            ("function" !=
              typeof (n = ft.call(t, "constructor") && t.constructor) ||
              pt.call(n) !== l))
        );
      },
      isEmptyObject: function (e) {
        var t;
        for (t in e) return !1;
        return !0;
      },
      globalEval: function (e, t, n) {
        c(e, { nonce: t && t.nonce }, n);
      },
      each: function (e, t) {
        var n,
          r = 0;
        if (p(e))
          for (n = e.length; n > r && !1 !== t.call(e[r], r, e[r]); r++);
        else for (r in e) if (!1 === t.call(e[r], r, e[r])) break;
        return e;
      },
      makeArray: function (e, t) {
        var n = t || [];
        return (
          null != e &&
            (p(Object(e))
              ? mt.merge(n, "string" == typeof e ? [e] : e)
              : u.call(n, e)),
          n
        );
      },
      inArray: function (e, t, n) {
        return null == t ? -1 : i.call(t, e, n);
      },
      merge: function (e, t) {
        for (var n = +t.length, r = 0, i = e.length; n > r; r++) e[i++] = t[r];
        return (e.length = i), e;
      },
      grep: function (e, t, n) {
        for (var r = [], i = 0, o = e.length, a = !n; o > i; i++)
          !t(e[i], i) !== a && r.push(e[i]);
        return r;
      },
      map: function (e, t, n) {
        var r,
          i,
          o = 0,
          a = [];
        if (p(e))
          for (r = e.length; r > o; o++)
            null != (i = t(e[o], o, n)) && a.push(i);
        else for (o in e) null != (i = t(e[o], o, n)) && a.push(i);
        return ct(a);
      },
      guid: 1,
      support: dt,
    }),
    "function" == typeof Symbol &&
      (mt.fn[Symbol.iterator] = t[Symbol.iterator]),
    mt.each(
      "Boolean Number String Function Array Date RegExp Object Error Symbol".split(
        " "
      ),
      function (e, t) {
        n["[object " + t + "]"] = t.toLowerCase();
      }
    );
  var d = (function (n) {
    function a(t, e, n, r) {
      var i,
        o,
        a,
        s,
        u,
        l,
        c,
        f = e && e.ownerDocument,
        p = e ? e.nodeType : 9;
      if (
        ((n = n || []),
        "string" != typeof t || !t || (1 !== p && 9 !== p && 11 !== p))
      )
        return n;
      if (!r && (P(e), (e = e || R), I)) {
        if (11 !== p && (u = mt.exec(t)))
          if ((i = u[1])) {
            if (9 === p) {
              if (!(a = e.getElementById(i))) return n;
              if (a.id === i) return n.push(a), n;
            } else if (f && (a = f.getElementById(i)) && $(e, a) && a.id === i)
              return n.push(a), n;
          } else {
            if (u[2]) return J.apply(n, e.getElementsByTagName(t)), n;
            if (
              (i = u[3]) &&
              d.getElementsByClassName &&
              e.getElementsByClassName
            )
              return J.apply(n, e.getElementsByClassName(i)), n;
          }
        if (
          !(
            !d.qsa ||
            z[t + " "] ||
            (W && W.test(t)) ||
            (1 === p && "object" === e.nodeName.toLowerCase())
          )
        ) {
          if (((c = t), (f = e), 1 === p && (ut.test(t) || st.test(t)))) {
            for (
              ((f = (vt.test(t) && T(e.parentNode)) || e) === e && d.scope) ||
                ((s = e.getAttribute("id"))
                  ? (s = s.replace(re, xt))
                  : e.setAttribute("id", (s = B))),
                o = (l = L(t)).length;
              o--;

            )
              l[o] = (s ? "#" + s : ":scope") + " " + S(l[o]);
            c = l.join(",");
          }
          try {
            return J.apply(n, f.querySelectorAll(c)), n;
          } catch (e) {
            z(t, !0);
          } finally {
            s === B && e.removeAttribute("id");
          }
        }
      }
      return H(t.replace(it, "$1"), e, n, r);
    }
    function c() {
      var r = [];
      return function e(t, n) {
        return (
          r.push(t + " ") > D.cacheLength && delete e[r.shift()],
          (e[t + " "] = n)
        );
      };
    }
    function le(e) {
      return (e[B] = !0), e;
    }
    function h(e) {
      var t = R.createElement("fieldset");
      try {
        return !!e(t);
      } catch (e) {
        return !1;
      } finally {
        t.parentNode && t.parentNode.removeChild(t), (t = null);
      }
    }
    function g(e, t) {
      for (var n = e.split("|"), r = n.length; r--; ) D.attrHandle[n[r]] = t;
    }
    function v(e, t) {
      var n = t && e,
        r =
          n &&
          1 === e.nodeType &&
          1 === t.nodeType &&
          e.sourceIndex - t.sourceIndex;
      if (r) return r;
      if (n) for (; (n = n.nextSibling); ) if (n === t) return -1;
      return e ? 1 : -1;
    }
    function de(t) {
      return function (e) {
        return "input" === e.nodeName.toLowerCase() && e.type === t;
      };
    }
    function y(n) {
      return function (e) {
        var t = e.nodeName.toLowerCase();
        return ("input" === t || "button" === t) && e.type === n;
      };
    }
    function b(t) {
      return function (e) {
        return "form" in e
          ? e.parentNode && !1 === e.disabled
            ? "label" in e
              ? "label" in e.parentNode
                ? e.parentNode.disabled === t
                : e.disabled === t
              : e.isDisabled === t || (e.isDisabled !== !t && wt(e) === t)
            : e.disabled === t
          : "label" in e && e.disabled === t;
      };
    }
    function w(a) {
      return le(function (o) {
        return (
          (o = +o),
          le(function (e, t) {
            for (var n, r = a([], e.length, o), i = r.length; i--; )
              e[(n = r[i])] && (e[n] = !(t[n] = e[n]));
          })
        );
      });
    }
    function T(e) {
      return e && "undefined" != typeof e.getElementsByTagName && e;
    }
    function C() {}
    function S(e) {
      for (var t = 0, n = e.length, r = ""; n > t; t++) r += e[t].value;
      return r;
    }
    function E(s, e, t) {
      var u = e.dir,
        l = e.next,
        a = l || u,
        f = t && "parentNode" === a,
        p = r++;
      return e.first
        ? function (e, t, n) {
            for (; (e = e[u]); ) if (1 === e.nodeType || f) return s(e, t, n);
            return !1;
          }
        : function (e, t, n) {
            var r,
              i,
              o,
              c = [_, p];
            if (n) {
              for (; (e = e[u]); )
                if ((1 === e.nodeType || f) && s(e, t, n)) return !0;
            } else
              for (; (e = e[u]); )
                if (1 === e.nodeType || f)
                  if (
                    ((i =
                      (o = e[B] || (e[B] = {}))[e.uniqueID] ||
                      (o[e.uniqueID] = {})),
                    l && l === e.nodeName.toLowerCase())
                  )
                    e = e[u] || e;
                  else {
                    if ((r = i[a]) && r[0] === _ && r[1] === p)
                      return (c[2] = r[2]);
                    if (((i[a] = c)[2] = s(e, t, n))) return !0;
                  }
            return !1;
          };
    }
    function k(i) {
      return 1 < i.length
        ? function (e, t, n) {
            for (var r = i.length; r--; ) if (!i[r](e, t, n)) return !1;
            return !0;
          }
        : i[0];
    }
    function A(e, t, n, r, i) {
      for (var o, a = [], s = 0, u = e.length, l = null != t; u > s; s++)
        (o = e[s]) && ((n && !n(o, r, i)) || (a.push(o), l && t.push(s)));
      return a;
    }
    function j(d, c, h, g, v, e) {
      return (
        g && !g[B] && (g = j(g)),
        v && !v[B] && (v = j(v, e)),
        le(function (e, t, n, r) {
          var i,
            o,
            y,
            s = [],
            u = [],
            l = t.length,
            b =
              e ||
              (function (e, t, n) {
                for (var r = 0, i = t.length; i > r; r++) a(e, t[r], n);
                return n;
              })(c || "*", n.nodeType ? [n] : n, []),
            f = !d || (!e && c) ? b : A(b, s, d, n, r),
            p = h ? (v || (e ? d : l || g) ? [] : t) : f;
          if ((h && h(f, p, n, r), g))
            for (i = A(p, u), g(i, [], n, r), o = i.length; o--; )
              (y = i[o]) && (p[u[o]] = !(f[u[o]] = y));
          if (e) {
            if (v || d) {
              if (v) {
                for (i = [], o = p.length; o--; )
                  (y = p[o]) && i.push((f[o] = y));
                v(null, (p = []), i, r);
              }
              for (o = p.length; o--; )
                (y = p[o]) &&
                  -1 < (i = v ? Q(e, y) : s[o]) &&
                  (e[i] = !(t[i] = y));
            }
          } else (p = A(p === t ? p.splice(l, p.length) : p)), v ? v(null, t, p, r) : J.apply(t, p);
        })
      );
    }
    function N(e) {
      for (
        var i,
          t,
          n,
          r = e.length,
          o = D.relative[e[0].type],
          a = o || D.relative[" "],
          s = o ? 1 : 0,
          u = E(
            function (e) {
              return e === i;
            },
            a,
            !0
          ),
          l = E(
            function (e) {
              return -1 < Q(i, e);
            },
            a,
            !0
          ),
          c = [
            function (e, t, n) {
              var r =
                (!o && (n || t !== O)) ||
                ((i = t).nodeType ? u(e, t, n) : l(e, t, n));
              return (i = null), r;
            },
          ];
        r > s;
        s++
      )
        if ((t = D.relative[e[s].type])) c = [E(k(c), t)];
        else {
          if ((t = D.filter[e[s].type].apply(null, e[s].matches))[B]) {
            for (n = ++s; r > n && !D.relative[e[n].type]; n++);
            return j(
              s > 1 && k(c),
              s > 1 &&
                S(
                  e
                    .slice(0, s - 1)
                    .concat({ value: " " === e[s - 2].type ? "*" : "" })
                ).replace(it, "$1"),
              t,
              n > s && N(e.slice(s, n)),
              r > n && N((e = e.slice(n))),
              r > n && S(e)
            );
          }
          c.push(t);
        }
      return k(c);
    }
    var e,
      d,
      D,
      o,
      i,
      L,
      f,
      H,
      O,
      u,
      l,
      P,
      R,
      M,
      I,
      W,
      s,
      F,
      $,
      B = "sizzle" + 1 * new Date(),
      p = n.document,
      _ = 0,
      r = 0,
      m = c(),
      x = c(),
      U = c(),
      z = c(),
      X = function (e, t) {
        return e === t && (l = !0), 0;
      },
      V = {}.hasOwnProperty,
      t = [],
      q = t.pop,
      G = t.push,
      J = t.push,
      Y = t.slice,
      Q = function (e, t) {
        for (var n = 0, r = e.length; r > n; n++) if (e[n] === t) return n;
        return -1;
      },
      K =
        "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
      Z = "[\\x20\\t\\r\\n\\f]",
      et =
        "(?:\\\\[\\da-fA-F]{1,6}" +
        Z +
        "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\x00-\\x7f])+",
      tt =
        "\\[" +
        Z +
        "*(" +
        et +
        ")(?:" +
        Z +
        "*([*^$|!~]?=)" +
        Z +
        "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" +
        et +
        "))|)" +
        Z +
        "*\\]",
      nt =
        ":(" +
        et +
        ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" +
        tt +
        ")*)|.*)\\)|)",
      ot = new RegExp(Z + "+", "g"),
      it = new RegExp("^" + Z + "+|((?:^|[^\\\\])(?:\\\\.)*)" + Z + "+$", "g"),
      at = new RegExp("^" + Z + "*," + Z + "*"),
      st = new RegExp("^" + Z + "*([>+~]|" + Z + ")" + Z + "*"),
      ut = new RegExp(Z + "|>"),
      lt = new RegExp(nt),
      ct = new RegExp("^" + et + "$"),
      ft = {
        ID: new RegExp("^#(" + et + ")"),
        CLASS: new RegExp("^\\.(" + et + ")"),
        TAG: new RegExp("^(" + et + "|[*])"),
        ATTR: new RegExp("^" + tt),
        PSEUDO: new RegExp("^" + nt),
        CHILD: new RegExp(
          "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
            Z +
            "*(even|odd|(([+-]|)(\\d*)n|)" +
            Z +
            "*(?:([+-]|)" +
            Z +
            "*(\\d+)|))" +
            Z +
            "*\\)|)",
          "i"
        ),
        bool: new RegExp("^(?:" + K + ")$", "i"),
        needsContext: new RegExp(
          "^" +
            Z +
            "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
            Z +
            "*((?:-\\d)?\\d*)" +
            Z +
            "*\\)|)(?=[^-]|$)",
          "i"
        ),
      },
      pt = /HTML$/i,
      dt = /^(?:input|select|textarea|button)$/i,
      ht = /^h\d$/i,
      gt = /^[^{]+\{\s*\[native \w/,
      mt = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
      vt = /[+~]/,
      yt = new RegExp("\\\\[\\da-fA-F]{1,6}" + Z + "?|\\\\([^\\r\\n\\f])", "g"),
      ne = function (e, t) {
        var n = "0x" + e.slice(1) - 65536;
        return (
          t ||
          (0 > n
            ? String.fromCharCode(n + 65536)
            : String.fromCharCode((n >> 10) | 55296, (1023 & n) | 56320))
        );
      },
      re = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
      xt = function (e, t) {
        return t
          ? "\x00" === e
            ? "�"
            : e.slice(0, -1) +
              "\\" +
              e.charCodeAt(e.length - 1).toString(16) +
              " "
          : "\\" + e;
      },
      bt = function () {
        P();
      },
      wt = E(
        function (e) {
          return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase();
        },
        { dir: "parentNode", next: "legend" }
      );
    try {
      J.apply((t = Y.call(p.childNodes)), p.childNodes),
        t[p.childNodes.length].nodeType;
    } catch (e) {
      J = {
        apply: t.length
          ? function (e, t) {
              G.apply(e, Y.call(t));
            }
          : function (e, t) {
              for (var n = e.length, r = 0; (e[n++] = t[r++]); );
              e.length = n - 1;
            },
      };
    }
    for (e in ((d = a.support = {}),
    (i = a.isXML =
      function (e) {
        var t = e && e.namespaceURI,
          n = e && (e.ownerDocument || e).documentElement;
        return !pt.test(t || (n && n.nodeName) || "HTML");
      }),
    (P = a.setDocument =
      function (e) {
        var t,
          n,
          r = e ? e.ownerDocument || e : p;
        return (
          r != R &&
            9 === r.nodeType &&
            r.documentElement &&
            ((M = (R = r).documentElement),
            (I = !i(R)),
            p != R &&
              (n = R.defaultView) &&
              n.top !== n &&
              (n.addEventListener
                ? n.addEventListener("unload", bt, !1)
                : n.attachEvent && n.attachEvent("onunload", bt)),
            (d.scope = h(function (e) {
              return (
                M.appendChild(e).appendChild(R.createElement("div")),
                "undefined" != typeof e.querySelectorAll &&
                  !e.querySelectorAll(":scope fieldset div").length
              );
            })),
            (d.attributes = h(function (e) {
              return (e.className = "i"), !e.getAttribute("className");
            })),
            (d.getElementsByTagName = h(function (e) {
              return (
                e.appendChild(R.createComment("")),
                !e.getElementsByTagName("*").length
              );
            })),
            (d.getElementsByClassName = gt.test(R.getElementsByClassName)),
            (d.getById = h(function (e) {
              return (
                (M.appendChild(e).id = B),
                !R.getElementsByName || !R.getElementsByName(B).length
              );
            })),
            d.getById
              ? ((D.filter.ID = function (e) {
                  var t = e.replace(yt, ne);
                  return function (e) {
                    return e.getAttribute("id") === t;
                  };
                }),
                (D.find.ID = function (e, t) {
                  if ("undefined" != typeof t.getElementById && I) {
                    var n = t.getElementById(e);
                    return n ? [n] : [];
                  }
                }))
              : ((D.filter.ID = function (e) {
                  var n = e.replace(yt, ne);
                  return function (e) {
                    var t =
                      "undefined" != typeof e.getAttributeNode &&
                      e.getAttributeNode("id");
                    return t && t.value === n;
                  };
                }),
                (D.find.ID = function (e, t) {
                  if ("undefined" != typeof t.getElementById && I) {
                    var n,
                      r,
                      i,
                      o = t.getElementById(e);
                    if (o) {
                      if ((n = o.getAttributeNode("id")) && n.value === e)
                        return [o];
                      for (i = t.getElementsByName(e), r = 0; (o = i[r++]); )
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                          return [o];
                    }
                    return [];
                  }
                })),
            (D.find.TAG = d.getElementsByTagName
              ? function (e, t) {
                  return "undefined" != typeof t.getElementsByTagName
                    ? t.getElementsByTagName(e)
                    : d.qsa
                    ? t.querySelectorAll(e)
                    : void 0;
                }
              : function (e, t) {
                  var n,
                    r = [],
                    i = 0,
                    o = t.getElementsByTagName(e);
                  if ("*" === e) {
                    for (; (n = o[i++]); ) 1 === n.nodeType && r.push(n);
                    return r;
                  }
                  return o;
                }),
            (D.find.CLASS =
              d.getElementsByClassName &&
              function (e, t) {
                return "undefined" != typeof t.getElementsByClassName && I
                  ? t.getElementsByClassName(e)
                  : void 0;
              }),
            (s = []),
            (W = []),
            (d.qsa = gt.test(R.querySelectorAll)) &&
              (h(function (e) {
                var t;
                (M.appendChild(e).innerHTML =
                  "<a id='" +
                  B +
                  "'></a><select id='" +
                  B +
                  "-\r\\' msallowcapture=''><option selected=''></option></select>"),
                  e.querySelectorAll("[msallowcapture^='']").length &&
                    W.push("[*^$]=" + Z + "*(?:''|\"\")"),
                  e.querySelectorAll("[selected]").length ||
                    W.push("\\[" + Z + "*(?:value|" + K + ")"),
                  e.querySelectorAll("[id~=" + B + "-]").length || W.push("~="),
                  (t = R.createElement("input")).setAttribute("name", ""),
                  e.appendChild(t),
                  e.querySelectorAll("[name='']").length ||
                    W.push("\\[" + Z + "*name" + Z + "*=" + Z + "*(?:''|\"\")"),
                  e.querySelectorAll(":checked").length || W.push(":checked"),
                  e.querySelectorAll("a#" + B + "+*").length ||
                    W.push(".#.+[+~]"),
                  e.querySelectorAll("\\\f"),
                  W.push("[\\r\\n\\f]");
              }),
              h(function (e) {
                e.innerHTML =
                  "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = R.createElement("input");
                t.setAttribute("type", "hidden"),
                  e.appendChild(t).setAttribute("name", "D"),
                  e.querySelectorAll("[name=d]").length &&
                    W.push("name" + Z + "*[*^$|!~]?="),
                  2 !== e.querySelectorAll(":enabled").length &&
                    W.push(":enabled", ":disabled"),
                  (M.appendChild(e).disabled = !0),
                  2 !== e.querySelectorAll(":disabled").length &&
                    W.push(":enabled", ":disabled"),
                  e.querySelectorAll("*,:x"),
                  W.push(",.*:");
              })),
            (d.matchesSelector = gt.test(
              (F =
                M.matches ||
                M.webkitMatchesSelector ||
                M.mozMatchesSelector ||
                M.oMatchesSelector ||
                M.msMatchesSelector)
            )) &&
              h(function (e) {
                (d.disconnectedMatch = F.call(e, "*")),
                  F.call(e, "[s!='']:x"),
                  s.push("!=", nt);
              }),
            (W = W.length && new RegExp(W.join("|"))),
            (s = s.length && new RegExp(s.join("|"))),
            (t = gt.test(M.compareDocumentPosition)),
            ($ =
              t || gt.test(M.contains)
                ? function (e, t) {
                    var n = 9 === e.nodeType ? e.documentElement : e,
                      r = t && t.parentNode;
                    return (
                      e === r ||
                      !(
                        !r ||
                        1 !== r.nodeType ||
                        !(n.contains
                          ? n.contains(r)
                          : e.compareDocumentPosition &&
                            16 & e.compareDocumentPosition(r))
                      )
                    );
                  }
                : function (e, t) {
                    if (t) for (; (t = t.parentNode); ) if (t === e) return !0;
                    return !1;
                  }),
            (X = t
              ? function (e, t) {
                  if (e === t) return (l = !0), 0;
                  var n =
                    !e.compareDocumentPosition - !t.compareDocumentPosition;
                  return (
                    n ||
                    (1 &
                      (n =
                        (e.ownerDocument || e) == (t.ownerDocument || t)
                          ? e.compareDocumentPosition(t)
                          : 1) ||
                    (!d.sortDetached && t.compareDocumentPosition(e) === n)
                      ? e == R || (e.ownerDocument == p && $(p, e))
                        ? -1
                        : t == R || (t.ownerDocument == p && $(p, t))
                        ? 1
                        : u
                        ? Q(u, e) - Q(u, t)
                        : 0
                      : 4 & n
                      ? -1
                      : 1)
                  );
                }
              : function (e, t) {
                  if (e === t) return (l = !0), 0;
                  var n,
                    r = 0,
                    i = e.parentNode,
                    o = t.parentNode,
                    a = [e],
                    s = [t];
                  if (!i || !o)
                    return e == R
                      ? -1
                      : t == R
                      ? 1
                      : i
                      ? -1
                      : o
                      ? 1
                      : u
                      ? Q(u, e) - Q(u, t)
                      : 0;
                  if (i === o) return v(e, t);
                  for (n = e; (n = n.parentNode); ) a.unshift(n);
                  for (n = t; (n = n.parentNode); ) s.unshift(n);
                  for (; a[r] === s[r]; ) r++;
                  return r ? v(a[r], s[r]) : a[r] == p ? -1 : s[r] == p ? 1 : 0;
                })),
          R
        );
      }),
    (a.matches = function (e, t) {
      return a(e, null, null, t);
    }),
    (a.matchesSelector = function (e, t) {
      if (
        (P(e),
        !(
          !d.matchesSelector ||
          !I ||
          z[t + " "] ||
          (s && s.test(t)) ||
          (W && W.test(t))
        ))
      )
        try {
          var n = F.call(e, t);
          if (
            n ||
            d.disconnectedMatch ||
            (e.document && 11 !== e.document.nodeType)
          )
            return n;
        } catch (e) {
          z(t, !0);
        }
      return 0 < a(t, R, null, [e]).length;
    }),
    (a.contains = function (e, t) {
      return (e.ownerDocument || e) != R && P(e), $(e, t);
    }),
    (a.attr = function (e, t) {
      (e.ownerDocument || e) != R && P(e);
      var n = D.attrHandle[t.toLowerCase()],
        r = n && V.call(D.attrHandle, t.toLowerCase()) ? n(e, t, !I) : void 0;
      return void 0 !== r
        ? r
        : d.attributes || !I
        ? e.getAttribute(t)
        : (r = e.getAttributeNode(t)) && r.specified
        ? r.value
        : null;
    }),
    (a.escape = function (e) {
      return (e + "").replace(re, xt);
    }),
    (a.error = function (e) {
      throw new Error("Syntax error, unrecognized expression: " + e);
    }),
    (a.uniqueSort = function (e) {
      var t,
        n = [],
        r = 0,
        i = 0;
      if (
        ((l = !d.detectDuplicates),
        (u = !d.sortStable && e.slice(0)),
        e.sort(X),
        l)
      ) {
        for (; (t = e[i++]); ) t === e[i] && (r = n.push(i));
        for (; r--; ) e.splice(n[r], 1);
      }
      return (u = null), e;
    }),
    (o = a.getText =
      function (e) {
        var t,
          n = "",
          r = 0,
          i = e.nodeType;
        if (i) {
          if (1 === i || 9 === i || 11 === i) {
            if ("string" == typeof e.textContent) return e.textContent;
            for (e = e.firstChild; e; e = e.nextSibling) n += o(e);
          } else if (3 === i || 4 === i) return e.nodeValue;
        } else for (; (t = e[r++]); ) n += o(t);
        return n;
      }),
    ((D = a.selectors =
      {
        cacheLength: 50,
        createPseudo: le,
        match: ft,
        attrHandle: {},
        find: {},
        relative: {
          ">": { dir: "parentNode", first: !0 },
          " ": { dir: "parentNode" },
          "+": { dir: "previousSibling", first: !0 },
          "~": { dir: "previousSibling" },
        },
        preFilter: {
          ATTR: function (e) {
            return (
              (e[1] = e[1].replace(yt, ne)),
              (e[3] = (e[3] || e[4] || e[5] || "").replace(yt, ne)),
              "~=" === e[2] && (e[3] = " " + e[3] + " "),
              e.slice(0, 4)
            );
          },
          CHILD: function (e) {
            return (
              (e[1] = e[1].toLowerCase()),
              "nth" === e[1].slice(0, 3)
                ? (e[3] || a.error(e[0]),
                  (e[4] = +(e[4]
                    ? e[5] + (e[6] || 1)
                    : 2 * ("even" === e[3] || "odd" === e[3]))),
                  (e[5] = +(e[7] + e[8] || "odd" === e[3])))
                : e[3] && a.error(e[0]),
              e
            );
          },
          PSEUDO: function (e) {
            var t,
              n = !e[6] && e[2];
            return ft.CHILD.test(e[0])
              ? null
              : (e[3]
                  ? (e[2] = e[4] || e[5] || "")
                  : n &&
                    lt.test(n) &&
                    (t = L(n, !0)) &&
                    (t = n.indexOf(")", n.length - t) - n.length) &&
                    ((e[0] = e[0].slice(0, t)), (e[2] = n.slice(0, t))),
                e.slice(0, 3));
          },
        },
        filter: {
          TAG: function (e) {
            var t = e.replace(yt, ne).toLowerCase();
            return "*" === e
              ? function () {
                  return !0;
                }
              : function (e) {
                  return e.nodeName && e.nodeName.toLowerCase() === t;
                };
          },
          CLASS: function (e) {
            var t = m[e + " "];
            return (
              t ||
              ((t = new RegExp("(^|" + Z + ")" + e + "(" + Z + "|$)")) &&
                m(e, function (e) {
                  return t.test(
                    ("string" == typeof e.className && e.className) ||
                      ("undefined" != typeof e.getAttribute &&
                        e.getAttribute("class")) ||
                      ""
                  );
                }))
            );
          },
          ATTR: function (n, r, i) {
            return function (e) {
              var t = a.attr(e, n);
              return null == t
                ? "!=" === r
                : !r ||
                    ((t += ""),
                    "=" === r
                      ? t === i
                      : "!=" === r
                      ? t !== i
                      : "^=" === r
                      ? i && 0 === t.indexOf(i)
                      : "*=" === r
                      ? i && -1 < t.indexOf(i)
                      : "$=" === r
                      ? i && t.slice(-i.length) === i
                      : "~=" === r
                      ? -1 < (" " + t.replace(ot, " ") + " ").indexOf(i)
                      : "|=" === r &&
                        (t === i || t.slice(0, i.length + 1) === i + "-"));
            };
          },
          CHILD: function (a, e, t, c, h) {
            var g = "nth" !== a.slice(0, 3),
              m = "last" !== a.slice(-4),
              x = "of-type" === e;
            return 1 === c && 0 === h
              ? function (e) {
                  return !!e.parentNode;
                }
              : function (e, t, n) {
                  var r,
                    i,
                    o,
                    v,
                    s,
                    u,
                    l = g !== m ? "nextSibling" : "previousSibling",
                    y = e.parentNode,
                    f = x && e.nodeName.toLowerCase(),
                    p = !n && !x,
                    d = !1;
                  if (y) {
                    if (g) {
                      for (; l; ) {
                        for (v = e; (v = v[l]); )
                          if (
                            x
                              ? v.nodeName.toLowerCase() === f
                              : 1 === v.nodeType
                          )
                            return !1;
                        u = l = "only" === a && !u && "nextSibling";
                      }
                      return !0;
                    }
                    if (((u = [m ? y.firstChild : y.lastChild]), m && p)) {
                      for (
                        d =
                          (s =
                            (r =
                              (i =
                                (o = (v = y)[B] || (v[B] = {}))[v.uniqueID] ||
                                (o[v.uniqueID] = {}))[a] || [])[0] === _ &&
                            r[1]) && r[2],
                          v = s && y.childNodes[s];
                        (v = (++s && v && v[l]) || (d = s = 0) || u.pop());

                      )
                        if (1 === v.nodeType && ++d && v === e) {
                          i[a] = [_, s, d];
                          break;
                        }
                    } else if (
                      (p &&
                        (d = s =
                          (r =
                            (i =
                              (o = (v = e)[B] || (v[B] = {}))[v.uniqueID] ||
                              (o[v.uniqueID] = {}))[a] || [])[0] === _ && r[1]),
                      !1 === d)
                    )
                      for (
                        ;
                        (v = (++s && v && v[l]) || (d = s = 0) || u.pop()) &&
                        ((x
                          ? v.nodeName.toLowerCase() !== f
                          : 1 !== v.nodeType) ||
                          !++d ||
                          (p &&
                            ((i =
                              (o = v[B] || (v[B] = {}))[v.uniqueID] ||
                              (o[v.uniqueID] = {}))[a] = [_, d]),
                          v !== e));

                      );
                    return (d -= h) === c || (d % c == 0 && d / c >= 0);
                  }
                };
          },
          PSEUDO: function (e, o) {
            var t,
              c =
                D.pseudos[e] ||
                D.setFilters[e.toLowerCase()] ||
                a.error("unsupported pseudo: " + e);
            return c[B]
              ? c(o)
              : 1 < c.length
              ? ((t = [e, e, "", o]),
                D.setFilters.hasOwnProperty(e.toLowerCase())
                  ? le(function (e, t) {
                      for (var n, r = c(e, o), i = r.length; i--; )
                        e[(n = Q(e, r[i]))] = !(t[n] = r[i]);
                    })
                  : function (e) {
                      return c(e, 0, t);
                    })
              : c;
          },
        },
        pseudos: {
          not: le(function (e) {
            var r = [],
              i = [],
              s = f(e.replace(it, "$1"));
            return s[B]
              ? le(function (e, t, n, r) {
                  for (var i, o = s(e, null, r, []), a = e.length; a--; )
                    (i = o[a]) && (e[a] = !(t[a] = i));
                })
              : function (e, t, n) {
                  return (r[0] = e), s(r, null, n, i), (r[0] = null), !i.pop();
                };
          }),
          has: le(function (t) {
            return function (e) {
              return 0 < a(t, e).length;
            };
          }),
          contains: le(function (t) {
            return (
              (t = t.replace(yt, ne)),
              function (e) {
                return -1 < (e.textContent || o(e)).indexOf(t);
              }
            );
          }),
          lang: le(function (n) {
            return (
              ct.test(n || "") || a.error("unsupported lang: " + n),
              (n = n.replace(yt, ne).toLowerCase()),
              function (e) {
                var t;
                do
                  if (
                    (t = I
                      ? e.lang
                      : e.getAttribute("xml:lang") || e.getAttribute("lang"))
                  )
                    return (
                      (t = t.toLowerCase()) === n || 0 === t.indexOf(n + "-")
                    );
                while ((e = e.parentNode) && 1 === e.nodeType);
                return !1;
              }
            );
          }),
          target: function (e) {
            var t = n.location && n.location.hash;
            return t && t.slice(1) === e.id;
          },
          root: function (e) {
            return e === M;
          },
          focus: function (e) {
            return (
              e === R.activeElement &&
              (!R.hasFocus || R.hasFocus()) &&
              !!(e.type || e.href || ~e.tabIndex)
            );
          },
          enabled: b(!1),
          disabled: b(!0),
          checked: function (e) {
            var t = e.nodeName.toLowerCase();
            return (
              ("input" === t && !!e.checked) || ("option" === t && !!e.selected)
            );
          },
          selected: function (e) {
            return (
              e.parentNode && e.parentNode.selectedIndex, !0 === e.selected
            );
          },
          empty: function (e) {
            for (e = e.firstChild; e; e = e.nextSibling)
              if (e.nodeType < 6) return !1;
            return !0;
          },
          parent: function (e) {
            return !D.pseudos.empty(e);
          },
          header: function (e) {
            return ht.test(e.nodeName);
          },
          input: function (e) {
            return dt.test(e.nodeName);
          },
          button: function (e) {
            var t = e.nodeName.toLowerCase();
            return ("input" === t && "button" === e.type) || "button" === t;
          },
          text: function (e) {
            var t;
            return (
              "input" === e.nodeName.toLowerCase() &&
              "text" === e.type &&
              (null == (t = e.getAttribute("type")) ||
                "text" === t.toLowerCase())
            );
          },
          first: w(function () {
            return [0];
          }),
          last: w(function (e, t) {
            return [t - 1];
          }),
          eq: w(function (e, t, n) {
            return [0 > n ? n + t : n];
          }),
          even: w(function (e, t) {
            for (var n = 0; t > n; n += 2) e.push(n);
            return e;
          }),
          odd: w(function (e, t) {
            for (var n = 1; t > n; n += 2) e.push(n);
            return e;
          }),
          lt: w(function (e, t, n) {
            for (var r = 0 > n ? n + t : n > t ? t : n; 0 <= --r; ) e.push(r);
            return e;
          }),
          gt: w(function (e, t, n) {
            for (var r = 0 > n ? n + t : n; ++r < t; ) e.push(r);
            return e;
          }),
        },
      }).pseudos.nth = D.pseudos.eq),
    { radio: !0, checkbox: !0, file: !0, password: !0, image: !0 }))
      D.pseudos[e] = de(e);
    for (e in { submit: !0, reset: !0 }) D.pseudos[e] = y(e);
    return (
      (C.prototype = D.filters = D.pseudos),
      (D.setFilters = new C()),
      (L = a.tokenize =
        function (e, t) {
          var n,
            r,
            i,
            o,
            c,
            s,
            u,
            l = x[e + " "];
          if (l) return t ? 0 : l.slice(0);
          for (c = e, s = [], u = D.preFilter; c; ) {
            for (o in ((n && !(r = at.exec(c))) ||
              (r && (c = c.slice(r[0].length) || c), s.push((i = []))),
            (n = !1),
            (r = st.exec(c)) &&
              ((n = r.shift()),
              i.push({ value: n, type: r[0].replace(it, " ") }),
              (c = c.slice(n.length))),
            D.filter))
              !(r = ft[o].exec(c)) ||
                (u[o] && !(r = u[o](r))) ||
                ((n = r.shift()),
                i.push({ value: n, type: o, matches: r }),
                (c = c.slice(n.length)));
            if (!n) break;
          }
          return t ? c.length : c ? a.error(e) : x(e, s).slice(0);
        }),
      (f = a.compile =
        function (e, t) {
          var n,
            c,
            h,
            m,
            x,
            r,
            i = [],
            o = [],
            g = U[e + " "];
          if (!g) {
            for (t || (t = L(e)), n = t.length; n--; )
              (g = N(t[n]))[B] ? i.push(g) : o.push(g);
            (g = U(
              e,
              ((c = o),
              (m = 0 < (h = i).length),
              (x = 0 < c.length),
              (r = function (e, t, n, r, i) {
                var o,
                  g,
                  s,
                  u = 0,
                  l = "0",
                  v = e && [],
                  f = [],
                  p = O,
                  d = e || (x && D.find.TAG("*", i)),
                  y = (_ += null == p ? 1 : Math.random() || 0.1),
                  b = d.length;
                for (
                  i && (O = t == R || t || i);
                  l !== b && null != (o = d[l]);
                  l++
                ) {
                  if (x && o) {
                    for (
                      g = 0, t || o.ownerDocument == R || (P(o), (n = !I));
                      (s = c[g++]);

                    )
                      if (s(o, t || R, n)) {
                        r.push(o);
                        break;
                      }
                    i && (_ = y);
                  }
                  m && ((o = !s && o) && u--, e && v.push(o));
                }
                if (((u += l), m && l !== u)) {
                  for (g = 0; (s = h[g++]); ) s(v, f, t, n);
                  if (e) {
                    if (u > 0) for (; l--; ) v[l] || f[l] || (f[l] = q.call(r));
                    f = A(f);
                  }
                  J.apply(r, f),
                    i &&
                      !e &&
                      0 < f.length &&
                      1 < u + h.length &&
                      a.uniqueSort(r);
                }
                return i && ((_ = y), (O = p)), v;
              }),
              m ? le(r) : r)
            )).selector = e;
          }
          return g;
        }),
      (H = a.select =
        function (e, t, n, r) {
          var i,
            o,
            a,
            s,
            u,
            l = "function" == typeof e && e,
            c = !r && L((e = l.selector || e));
          if (((n = n || []), 1 === c.length)) {
            if (
              2 < (o = c[0] = c[0].slice(0)).length &&
              "ID" === (a = o[0]).type &&
              9 === t.nodeType &&
              I &&
              D.relative[o[1].type]
            ) {
              if (!(t = (D.find.ID(a.matches[0].replace(yt, ne), t) || [])[0]))
                return n;
              l && (t = t.parentNode), (e = e.slice(o.shift().value.length));
            }
            for (
              i = ft.needsContext.test(e) ? 0 : o.length;
              i-- && ((a = o[i]), !D.relative[(s = a.type)]);

            )
              if (
                (u = D.find[s]) &&
                (r = u(
                  a.matches[0].replace(yt, ne),
                  (vt.test(o[0].type) && T(t.parentNode)) || t
                ))
              ) {
                if ((o.splice(i, 1), !(e = r.length && S(o))))
                  return J.apply(n, r), n;
                break;
              }
          }
          return (
            (l || f(e, c))(
              r,
              t,
              !I,
              n,
              !t || (vt.test(e) && T(t.parentNode)) || t
            ),
            n
          );
        }),
      (d.sortStable = B.split("").sort(X).join("") === B),
      (d.detectDuplicates = !!l),
      P(),
      (d.sortDetached = h(function (e) {
        return 1 & e.compareDocumentPosition(R.createElement("fieldset"));
      })),
      h(function (e) {
        return (
          (e.innerHTML = "<a href='#'></a>"),
          "#" === e.firstChild.getAttribute("href")
        );
      }) ||
        g("type|href|height|width", function (e, t, n) {
          return n
            ? void 0
            : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2);
        }),
      (d.attributes &&
        h(function (e) {
          return (
            (e.innerHTML = "<input/>"),
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
          );
        })) ||
        g("value", function (e, t, n) {
          return n || "input" !== e.nodeName.toLowerCase()
            ? void 0
            : e.defaultValue;
        }),
      h(function (e) {
        return null == e.getAttribute("disabled");
      }) ||
        g(K, function (e, t, n) {
          var r;
          return n
            ? void 0
            : !0 === e[t]
            ? t.toLowerCase()
            : (r = e.getAttributeNode(t)) && r.specified
            ? r.value
            : null;
        }),
      a
    );
  })(a);
  (mt.find = d),
    (mt.expr = d.selectors),
    (mt.expr[":"] = mt.expr.pseudos),
    (mt.uniqueSort = mt.unique = d.uniqueSort),
    (mt.text = d.getText),
    (mt.isXMLDoc = d.isXML),
    (mt.contains = d.contains),
    (mt.escapeSelector = d.escape);
  var vt = function (e, t, n) {
      for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
        if (1 === e.nodeType) {
          if (i && mt(e).is(n)) break;
          r.push(e);
        }
      return r;
    },
    yt = function (e, t) {
      for (var n = []; e; e = e.nextSibling)
        1 === e.nodeType && e !== t && n.push(e);
      return n;
    },
    xt = mt.expr.match.needsContext,
    bt = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
  (mt.filter = function (e, t, n) {
    var r = t[0];
    return (
      n && (e = ":not(" + e + ")"),
      1 === t.length && 1 === r.nodeType
        ? mt.find.matchesSelector(r, e)
          ? [r]
          : []
        : mt.find.matches(
            e,
            mt.grep(t, function (e) {
              return 1 === e.nodeType;
            })
          )
    );
  }),
    mt.fn.extend({
      find: function (e) {
        var t,
          n,
          r = this.length,
          i = this;
        if ("string" != typeof e)
          return this.pushStack(
            mt(e).filter(function () {
              for (t = 0; r > t; t++) if (mt.contains(i[t], this)) return !0;
            })
          );
        for (n = this.pushStack([]), t = 0; r > t; t++) mt.find(e, i[t], n);
        return r > 1 ? mt.uniqueSort(n) : n;
      },
      filter: function (e) {
        return this.pushStack(v(this, e || [], !1));
      },
      not: function (e) {
        return this.pushStack(v(this, e || [], !0));
      },
      is: function (e) {
        return !!v(
          this,
          "string" == typeof e && xt.test(e) ? mt(e) : e || [],
          !1
        ).length;
      },
    });
  var wt,
    q = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
  ((mt.fn.init = function (e, t, n) {
    var r, i;
    if (!e) return this;
    if (((n = n || wt), "string" == typeof e)) {
      if (
        !(r =
          "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length
            ? [null, e, null]
            : q.exec(e)) ||
        (!r[1] && t)
      )
        return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
      if (r[1]) {
        if (
          ((t = t instanceof mt ? t[0] : t),
          mt.merge(
            this,
            mt.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : ht, !0)
          ),
          bt.test(r[1]) && mt.isPlainObject(t))
        )
          for (r in t) m(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
        return this;
      }
      return (
        (i = ht.getElementById(r[2])) && ((this[0] = i), (this.length = 1)),
        this
      );
    }
    return e.nodeType
      ? ((this[0] = e), (this.length = 1), this)
      : m(e)
      ? void 0 !== n.ready
        ? n.ready(e)
        : e(mt)
      : mt.makeArray(e, this);
  }).prototype = mt.fn),
    (wt = mt(ht));
  var Tt = /^(?:parents|prev(?:Until|All))/,
    Ct = { children: !0, contents: !0, next: !0, prev: !0 };
  mt.fn.extend({
    has: function (e) {
      var t = mt(e, this),
        n = t.length;
      return this.filter(function () {
        for (var e = 0; n > e; e++) if (mt.contains(this, t[e])) return !0;
      });
    },
    closest: function (e, t) {
      var n,
        r = 0,
        i = this.length,
        o = [],
        a = "string" != typeof e && mt(e);
      if (!xt.test(e))
        for (; i > r; r++)
          for (n = this[r]; n && n !== t; n = n.parentNode)
            if (
              n.nodeType < 11 &&
              (a
                ? -1 < a.index(n)
                : 1 === n.nodeType && mt.find.matchesSelector(n, e))
            ) {
              o.push(n);
              break;
            }
      return this.pushStack(1 < o.length ? mt.uniqueSort(o) : o);
    },
    index: function (e) {
      return e
        ? "string" == typeof e
          ? i.call(mt(e), this[0])
          : i.call(this, e.jquery ? e[0] : e)
        : this[0] && this[0].parentNode
        ? this.first().prevAll().length
        : -1;
    },
    add: function (e, t) {
      return this.pushStack(mt.uniqueSort(mt.merge(this.get(), mt(e, t))));
    },
    addBack: function (e) {
      return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
    },
  }),
    mt.each(
      {
        parent: function (e) {
          var t = e.parentNode;
          return t && 11 !== t.nodeType ? t : null;
        },
        parents: function (e) {
          return vt(e, "parentNode");
        },
        parentsUntil: function (e, t, n) {
          return vt(e, "parentNode", n);
        },
        next: function (e) {
          return y(e, "nextSibling");
        },
        prev: function (e) {
          return y(e, "previousSibling");
        },
        nextAll: function (e) {
          return vt(e, "nextSibling");
        },
        prevAll: function (e) {
          return vt(e, "previousSibling");
        },
        nextUntil: function (e, t, n) {
          return vt(e, "nextSibling", n);
        },
        prevUntil: function (e, t, n) {
          return vt(e, "previousSibling", n);
        },
        siblings: function (e) {
          return yt(((e && e.parentNode) || {}).firstChild, e);
        },
        children: function (e) {
          return yt(e.firstChild);
        },
        contents: function (e) {
          return null != e.contentDocument && r(e.contentDocument)
            ? e.contentDocument
            : (g(e, "template") && (e = e.content || e),
              mt.merge([], e.childNodes));
        },
      },
      function (r, i) {
        mt.fn[r] = function (e, t) {
          var n = mt.map(this, i, e);
          return (
            "Until" !== r.slice(-5) && (t = e),
            t && "string" == typeof t && (n = mt.filter(t, n)),
            1 < this.length &&
              (Ct[r] || mt.uniqueSort(n), Tt.test(r) && n.reverse()),
            this.pushStack(n)
          );
        };
      }
    );
  var St = /[^\x20\t\r\n\f]+/g;
  (mt.Callbacks = function (r) {
    var e, n;
    r =
      "string" == typeof r
        ? ((e = r),
          (n = {}),
          mt.each(e.match(St) || [], function (e, t) {
            n[t] = !0;
          }),
          n)
        : mt.extend({}, r);
    var i,
      t,
      o,
      a,
      s = [],
      u = [],
      l = -1,
      c = function () {
        for (a = a || r.once, o = i = !0; u.length; l = -1)
          for (t = u.shift(); ++l < s.length; )
            !1 === s[l].apply(t[0], t[1]) &&
              r.stopOnFalse &&
              ((l = s.length), (t = !1));
        r.memory || (t = !1), (i = !1), a && (s = t ? [] : "");
      },
      f = {
        add: function () {
          return (
            s &&
              (t && !i && ((l = s.length - 1), u.push(t)),
              (function n(e) {
                mt.each(e, function (e, t) {
                  m(t)
                    ? (r.unique && f.has(t)) || s.push(t)
                    : t && t.length && "string" !== h(t) && n(t);
                });
              })(arguments),
              t && !i && c()),
            this
          );
        },
        remove: function () {
          return (
            mt.each(arguments, function (e, t) {
              for (var n; -1 < (n = mt.inArray(t, s, n)); )
                s.splice(n, 1), l >= n && l--;
            }),
            this
          );
        },
        has: function (e) {
          return e ? -1 < mt.inArray(e, s) : 0 < s.length;
        },
        empty: function () {
          return s && (s = []), this;
        },
        disable: function () {
          return (a = u = []), (s = t = ""), this;
        },
        disabled: function () {
          return !s;
        },
        lock: function () {
          return (a = u = []), t || i || (s = t = ""), this;
        },
        locked: function () {
          return !!a;
        },
        fireWith: function (e, t) {
          return (
            a ||
              ((t = [e, (t = t || []).slice ? t.slice() : t]),
              u.push(t),
              i || c()),
            this
          );
        },
        fire: function () {
          return f.fireWith(this, arguments), this;
        },
        fired: function () {
          return !!o;
        },
      };
    return f;
  }),
    mt.extend({
      Deferred: function (e) {
        var o = [
            [
              "notify",
              "progress",
              mt.Callbacks("memory"),
              mt.Callbacks("memory"),
              2,
            ],
            [
              "resolve",
              "done",
              mt.Callbacks("once memory"),
              mt.Callbacks("once memory"),
              0,
              "resolved",
            ],
            [
              "reject",
              "fail",
              mt.Callbacks("once memory"),
              mt.Callbacks("once memory"),
              1,
              "rejected",
            ],
          ],
          i = "pending",
          c = {
            state: function () {
              return i;
            },
            always: function () {
              return s.done(arguments).fail(arguments), this;
            },
            catch: function (e) {
              return c.then(null, e);
            },
            pipe: function () {
              var i = arguments;
              return mt
                .Deferred(function (r) {
                  mt.each(o, function (e, t) {
                    var n = m(i[t[4]]) && i[t[4]];
                    s[t[1]](function () {
                      var e = n && n.apply(this, arguments);
                      e && m(e.promise)
                        ? e
                            .promise()
                            .progress(r.notify)
                            .done(r.resolve)
                            .fail(r.reject)
                        : r[t[0] + "With"](this, n ? [e] : arguments);
                    });
                  }),
                    (i = null);
                })
                .promise();
            },
            then: function (t, n, r) {
              function l(i, o, c, s) {
                return function () {
                  var n = this,
                    r = arguments,
                    e = function () {
                      var e, t;
                      if (!(u > i)) {
                        if ((e = c.apply(n, r)) === o.promise())
                          throw new TypeError("Thenable self-resolution");
                        (t =
                          e &&
                          ("object" == typeof e || "function" == typeof e) &&
                          e.then),
                          m(t)
                            ? s
                              ? t.call(e, l(u, o, b, s), l(u, o, w, s))
                              : (u++,
                                t.call(
                                  e,
                                  l(u, o, b, s),
                                  l(u, o, w, s),
                                  l(u, o, b, o.notifyWith)
                                ))
                            : (c !== b && ((n = void 0), (r = [e])),
                              (s || o.resolveWith)(n, r));
                      }
                    },
                    t = s
                      ? e
                      : function () {
                          try {
                            e();
                          } catch (e) {
                            mt.Deferred.exceptionHook &&
                              mt.Deferred.exceptionHook(e, t.stackTrace),
                              i + 1 >= u &&
                                (c !== w && ((n = void 0), (r = [e])),
                                o.rejectWith(n, r));
                          }
                        };
                  i
                    ? t()
                    : (mt.Deferred.getStackHook &&
                        (t.stackTrace = mt.Deferred.getStackHook()),
                      a.setTimeout(t));
                };
              }
              var u = 0;
              return mt
                .Deferred(function (e) {
                  o[0][3].add(l(0, e, m(r) ? r : b, e.notifyWith)),
                    o[1][3].add(l(0, e, m(t) ? t : b)),
                    o[2][3].add(l(0, e, m(n) ? n : w));
                })
                .promise();
            },
            promise: function (e) {
              return null != e ? mt.extend(e, c) : c;
            },
          },
          s = {};
        return (
          mt.each(o, function (e, t) {
            var n = t[2],
              r = t[5];
            (c[t[1]] = n.add),
              r &&
                n.add(
                  function () {
                    i = r;
                  },
                  o[3 - e][2].disable,
                  o[3 - e][3].disable,
                  o[0][2].lock,
                  o[0][3].lock
                ),
              n.add(t[3].fire),
              (s[t[0]] = function () {
                return (
                  s[t[0] + "With"](this === s ? void 0 : this, arguments), this
                );
              }),
              (s[t[0] + "With"] = n.fireWith);
          }),
          c.promise(s),
          e && e.call(s, s),
          s
        );
      },
      when: function (e) {
        var n = arguments.length,
          t = n,
          r = Array(t),
          i = s.call(arguments),
          o = mt.Deferred(),
          a = function (t) {
            return function (e) {
              (r[t] = this),
                (i[t] = 1 < arguments.length ? s.call(arguments) : e),
                --n || o.resolveWith(r, i);
            };
          };
        if (
          1 >= n &&
          (T(e, o.done(a(t)).resolve, o.reject, !n),
          "pending" === o.state() || m(i[t] && i[t].then))
        )
          return o.then();
        for (; t--; ) T(i[t], a(t), o.reject);
        return o.promise();
      },
    });
  var Et = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
  (mt.Deferred.exceptionHook = function (e, t) {
    a.console &&
      a.console.warn &&
      e &&
      Et.test(e.name) &&
      a.console.warn("jQuery.Deferred exception: " + e.message, e.stack, t);
  }),
    (mt.readyException = function (e) {
      a.setTimeout(function () {
        throw e;
      });
    });
  var kt = mt.Deferred();
  (mt.fn.ready = function (e) {
    return (
      kt.then(e)["catch"](function (e) {
        mt.readyException(e);
      }),
      this
    );
  }),
    mt.extend({
      isReady: !1,
      readyWait: 1,
      ready: function (e) {
        (!0 === e ? --mt.readyWait : mt.isReady) ||
          ((mt.isReady = !0) !== e && 0 < --mt.readyWait) ||
          kt.resolveWith(ht, [mt]);
      },
    }),
    (mt.ready.then = kt.then),
    "complete" === ht.readyState ||
    ("loading" !== ht.readyState && !ht.documentElement.doScroll)
      ? a.setTimeout(mt.ready)
      : (ht.addEventListener("DOMContentLoaded", C),
        a.addEventListener("load", C));
  var At = function (e, t, n, r, i, o, a) {
      var s = 0,
        u = e.length,
        l = null == n;
      if ("object" === h(n))
        for (s in ((i = !0), n)) At(e, t, s, n[s], !0, o, a);
      else if (
        void 0 !== r &&
        ((i = !0),
        m(r) || (a = !0),
        l &&
          (a
            ? (t.call(e, r), (t = null))
            : ((l = t),
              (t = function (e, t, n) {
                return l.call(mt(e), n);
              }))),
        t)
      )
        for (; u > s; s++) t(e[s], n, a ? r : r.call(e[s], s, t(e[s], n)));
      return i ? e : l ? t.call(e) : u ? t(e[0], n) : o;
    },
    jt = /^-ms-/,
    Nt = /-([a-z])/g,
    Dt = function (e) {
      return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType;
    };
  (k.uid = 1),
    (k.prototype = {
      cache: function (e) {
        var t = e[this.expando];
        return (
          t ||
            ((t = {}),
            Dt(e) &&
              (e.nodeType
                ? (e[this.expando] = t)
                : Object.defineProperty(e, this.expando, {
                    value: t,
                    configurable: !0,
                  }))),
          t
        );
      },
      set: function (e, t, n) {
        var r,
          i = this.cache(e);
        if ("string" == typeof t) i[E(t)] = n;
        else for (r in t) i[E(r)] = t[r];
        return i;
      },
      get: function (e, t) {
        return void 0 === t
          ? this.cache(e)
          : e[this.expando] && e[this.expando][E(t)];
      },
      access: function (e, t, n) {
        return void 0 === t || (t && "string" == typeof t && void 0 === n)
          ? this.get(e, t)
          : (this.set(e, t, n), void 0 !== n ? n : t);
      },
      remove: function (e, t) {
        var n,
          r = e[this.expando];
        if (void 0 !== r) {
          if (void 0 !== t) {
            n = (t = Array.isArray(t)
              ? t.map(E)
              : (t = E(t)) in r
              ? [t]
              : t.match(St) || []).length;
            for (; n--; ) delete r[t[n]];
          }
          (void 0 === t || mt.isEmptyObject(r)) &&
            (e.nodeType ? (e[this.expando] = void 0) : delete e[this.expando]);
        }
      },
      hasData: function (e) {
        var t = e[this.expando];
        return void 0 !== t && !mt.isEmptyObject(t);
      },
    });
  var qt = new k(),
    Lt = new k(),
    Ht = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    Ot = /[A-Z]/g;
  mt.extend({
    hasData: function (e) {
      return Lt.hasData(e) || qt.hasData(e);
    },
    data: function (e, t, n) {
      return Lt.access(e, t, n);
    },
    removeData: function (e, t) {
      Lt.remove(e, t);
    },
    _data: function (e, t, n) {
      return qt.access(e, t, n);
    },
    _removeData: function (e, t) {
      qt.remove(e, t);
    },
  }),
    mt.fn.extend({
      data: function (n, e) {
        var t,
          r,
          i,
          o = this[0],
          a = o && o.attributes;
        if (void 0 === n) {
          if (
            this.length &&
            ((i = Lt.get(o)), 1 === o.nodeType && !qt.get(o, "hasDataAttrs"))
          ) {
            for (t = a.length; t--; )
              a[t] &&
                0 === (r = a[t].name).indexOf("data-") &&
                ((r = E(r.slice(5))), A(o, r, i[r]));
            qt.set(o, "hasDataAttrs", !0);
          }
          return i;
        }
        return "object" == typeof n
          ? this.each(function () {
              Lt.set(this, n);
            })
          : At(
              this,
              function (e) {
                var t;
                return o && void 0 === e
                  ? void 0 !== (t = Lt.get(o, n))
                    ? t
                    : void 0 !== (t = A(o, n))
                    ? t
                    : void 0
                  : void this.each(function () {
                      Lt.set(this, n, e);
                    });
              },
              null,
              e,
              1 < arguments.length,
              null,
              !0
            );
      },
      removeData: function (e) {
        return this.each(function () {
          Lt.remove(this, e);
        });
      },
    }),
    mt.extend({
      queue: function (e, t, n) {
        var r;
        return e
          ? ((t = (t || "fx") + "queue"),
            (r = qt.get(e, t)),
            n &&
              (!r || Array.isArray(n)
                ? (r = qt.access(e, t, mt.makeArray(n)))
                : r.push(n)),
            r || [])
          : void 0;
      },
      dequeue: function (e, t) {
        t = t || "fx";
        var n = mt.queue(e, t),
          r = n.length,
          i = n.shift(),
          o = mt._queueHooks(e, t);
        "inprogress" === i && ((i = n.shift()), r--),
          i &&
            ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(
              e,
              function () {
                mt.dequeue(e, t);
              },
              o
            )),
          !r && o && o.empty.fire();
      },
      _queueHooks: function (e, t) {
        var n = t + "queueHooks";
        return (
          qt.get(e, n) ||
          qt.access(e, n, {
            empty: mt.Callbacks("once memory").add(function () {
              qt.remove(e, [t + "queue", n]);
            }),
          })
        );
      },
    }),
    mt.fn.extend({
      queue: function (t, n) {
        var e = 2;
        return (
          "string" != typeof t && ((n = t), (t = "fx"), e--),
          arguments.length < e
            ? mt.queue(this[0], t)
            : void 0 === n
            ? this
            : this.each(function () {
                var e = mt.queue(this, t, n);
                mt._queueHooks(this, t),
                  "fx" === t && "inprogress" !== e[0] && mt.dequeue(this, t);
              })
        );
      },
      dequeue: function (e) {
        return this.each(function () {
          mt.dequeue(this, e);
        });
      },
      clearQueue: function (e) {
        return this.queue(e || "fx", []);
      },
      promise: function (e, t) {
        var n,
          r = 1,
          i = mt.Deferred(),
          o = this,
          a = this.length,
          s = function () {
            --r || i.resolveWith(o, [o]);
          };
        for (
          "string" != typeof e && ((t = e), (e = void 0)), e = e || "fx";
          a--;

        )
          (n = qt.get(o[a], e + "queueHooks")) &&
            n.empty &&
            (r++, n.empty.add(s));
        return s(), i.promise(t);
      },
    });
  var Pt = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    Rt = new RegExp("^(?:([+-])=|)(" + Pt + ")([a-z%]*)$", "i"),
    ne = ["Top", "Right", "Bottom", "Left"],
    re = ht.documentElement,
    Mt = function (e) {
      return mt.contains(e.ownerDocument, e);
    },
    It = { composed: !0 };
  re.getRootNode &&
    (Mt = function (e) {
      return (
        mt.contains(e.ownerDocument, e) || e.getRootNode(It) === e.ownerDocument
      );
    });
  var Wt = function (e, t) {
      return (
        "none" === (e = t || e).style.display ||
        ("" === e.style.display && Mt(e) && "none" === mt.css(e, "display"))
      );
    },
    Ft = {};
  mt.fn.extend({
    show: function () {
      return le(this, !0);
    },
    hide: function () {
      return le(this);
    },
    toggle: function (e) {
      return "boolean" == typeof e
        ? e
          ? this.show()
          : this.hide()
        : this.each(function () {
            Wt(this) ? mt(this).show() : mt(this).hide();
          });
    },
  });
  var $t,
    Bt,
    _t = /^(?:checkbox|radio)$/i,
    de = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i,
    Ut = /^$|^module$|\/(?:java|ecma)script/i;
  ($t = ht.createDocumentFragment().appendChild(ht.createElement("div"))),
    (Bt = ht.createElement("input")).setAttribute("type", "radio"),
    Bt.setAttribute("checked", "checked"),
    Bt.setAttribute("name", "t"),
    $t.appendChild(Bt),
    (dt.checkClone = $t.cloneNode(!0).cloneNode(!0).lastChild.checked),
    ($t.innerHTML = "<textarea>x</textarea>"),
    (dt.noCloneChecked = !!$t.cloneNode(!0).lastChild.defaultValue),
    ($t.innerHTML = "<option></option>"),
    (dt.option = !!$t.lastChild);
  var zt = {
    thead: [1, "<table>", "</table>"],
    col: [2, "<table><colgroup>", "</colgroup></table>"],
    tr: [2, "<table><tbody>", "</tbody></table>"],
    td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
    _default: [0, "", ""],
  };
  (zt.tbody = zt.tfoot = zt.colgroup = zt.caption = zt.thead),
    (zt.th = zt.td),
    dt.option ||
      (zt.optgroup = zt.option =
        [1, "<select multiple='multiple'>", "</select>"]);
  var Xt = /<|&#?\w+;/,
    Vt = /^([^.]*)(?:\.(.+)|)/;
  (mt.event = {
    global: {},
    add: function (t, e, n, r, i) {
      var o,
        a,
        s,
        u,
        l,
        c,
        f,
        p,
        d,
        h,
        g,
        v = qt.get(t);
      if (Dt(t))
        for (
          n.handler && ((n = (o = n).handler), (i = o.selector)),
            i && mt.find.matchesSelector(re, i),
            n.guid || (n.guid = mt.guid++),
            (u = v.events) || (u = v.events = Object.create(null)),
            (a = v.handle) ||
              (a = v.handle =
                function (e) {
                  return "undefined" != typeof mt &&
                    mt.event.triggered !== e.type
                    ? mt.event.dispatch.apply(t, arguments)
                    : void 0;
                }),
            l = (e = (e || "").match(St) || [""]).length;
          l--;

        )
          (d = g = (s = Vt.exec(e[l]) || [])[1]),
            (h = (s[2] || "").split(".").sort()),
            d &&
              ((f = mt.event.special[d] || {}),
              (d = (i ? f.delegateType : f.bindType) || d),
              (f = mt.event.special[d] || {}),
              (c = mt.extend(
                {
                  type: d,
                  origType: g,
                  data: r,
                  handler: n,
                  guid: n.guid,
                  selector: i,
                  needsContext: i && mt.expr.match.needsContext.test(i),
                  namespace: h.join("."),
                },
                o
              )),
              (p = u[d]) ||
                (((p = u[d] = []).delegateCount = 0),
                (f.setup && !1 !== f.setup.call(t, r, h, a)) ||
                  (t.addEventListener && t.addEventListener(d, a))),
              f.add &&
                (f.add.call(t, c), c.handler.guid || (c.handler.guid = n.guid)),
              i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
              (mt.event.global[d] = !0));
    },
    remove: function (e, t, n, r, i) {
      var o,
        a,
        s,
        u,
        l,
        c,
        f,
        p,
        d,
        h,
        g,
        v = qt.hasData(e) && qt.get(e);
      if (v && (u = v.events)) {
        for (l = (t = (t || "").match(St) || [""]).length; l--; )
          if (
            ((d = g = (s = Vt.exec(t[l]) || [])[1]),
            (h = (s[2] || "").split(".").sort()),
            d)
          ) {
            for (
              f = mt.event.special[d] || {},
                p = u[(d = (r ? f.delegateType : f.bindType) || d)] || [],
                s =
                  s[2] &&
                  new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                a = o = p.length;
              o--;

            )
              (c = p[o]),
                (!i && g !== c.origType) ||
                  (n && n.guid !== c.guid) ||
                  (s && !s.test(c.namespace)) ||
                  (r && r !== c.selector && ("**" !== r || !c.selector)) ||
                  (p.splice(o, 1),
                  c.selector && p.delegateCount--,
                  f.remove && f.remove.call(e, c));
            a &&
              !p.length &&
              ((f.teardown && !1 !== f.teardown.call(e, h, v.handle)) ||
                mt.removeEvent(e, d, v.handle),
              delete u[d]);
          } else for (d in u) mt.event.remove(e, d + t[l], n, r, !0);
        mt.isEmptyObject(u) && qt.remove(e, "handle events");
      }
    },
    dispatch: function (e) {
      var t,
        n,
        r,
        i,
        o,
        a,
        s = new Array(arguments.length),
        u = mt.event.fix(e),
        l = (qt.get(this, "events") || Object.create(null))[u.type] || [],
        c = mt.event.special[u.type] || {};
      for (s[0] = u, t = 1; t < arguments.length; t++) s[t] = arguments[t];
      if (
        ((u.delegateTarget = this),
        !c.preDispatch || !1 !== c.preDispatch.call(this, u))
      ) {
        for (
          a = mt.event.handlers.call(this, u, l), t = 0;
          (i = a[t++]) && !u.isPropagationStopped();

        )
          for (
            u.currentTarget = i.elem, n = 0;
            (o = i.handlers[n++]) && !u.isImmediatePropagationStopped();

          )
            (u.rnamespace &&
              !1 !== o.namespace &&
              !u.rnamespace.test(o.namespace)) ||
              ((u.handleObj = o),
              (u.data = o.data),
              void 0 !==
                (r = (
                  (mt.event.special[o.origType] || {}).handle || o.handler
                ).apply(i.elem, s)) &&
                !1 === (u.result = r) &&
                (u.preventDefault(), u.stopPropagation()));
        return c.postDispatch && c.postDispatch.call(this, u), u.result;
      }
    },
    handlers: function (e, t) {
      var n,
        r,
        i,
        o,
        a,
        s = [],
        u = t.delegateCount,
        l = e.target;
      if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
        for (; l !== this; l = l.parentNode || this)
          if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
            for (o = [], a = {}, n = 0; u > n; n++)
              void 0 === a[(i = (r = t[n]).selector + " ")] &&
                (a[i] = r.needsContext
                  ? -1 < mt(i, this).index(l)
                  : mt.find(i, this, null, [l]).length),
                a[i] && o.push(r);
            o.length && s.push({ elem: l, handlers: o });
          }
      return (
        (l = this), u < t.length && s.push({ elem: l, handlers: t.slice(u) }), s
      );
    },
    addProp: function (t, e) {
      Object.defineProperty(mt.Event.prototype, t, {
        enumerable: !0,
        configurable: !0,
        get: m(e)
          ? function () {
              return this.originalEvent ? e(this.originalEvent) : void 0;
            }
          : function () {
              return this.originalEvent ? this.originalEvent[t] : void 0;
            },
        set: function (e) {
          Object.defineProperty(this, t, {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: e,
          });
        },
      });
    },
    fix: function (e) {
      return e[mt.expando] ? e : new mt.Event(e);
    },
    special: {
      load: { noBubble: !0 },
      click: {
        setup: function (e) {
          var t = this || e;
          return (
            _t.test(t.type) && t.click && g(t, "input") && M(t, "click", H), !1
          );
        },
        trigger: function (e) {
          var t = this || e;
          return (
            _t.test(t.type) && t.click && g(t, "input") && M(t, "click"), !0
          );
        },
        _default: function (e) {
          var t = e.target;
          return (
            (_t.test(t.type) &&
              t.click &&
              g(t, "input") &&
              qt.get(t, "click")) ||
            g(t, "a")
          );
        },
      },
      beforeunload: {
        postDispatch: function (e) {
          void 0 !== e.result &&
            e.originalEvent &&
            (e.originalEvent.returnValue = e.result);
        },
      },
    },
  }),
    (mt.removeEvent = function (e, t, n) {
      e.removeEventListener && e.removeEventListener(t, n);
    }),
    (mt.Event = function (e, t) {
      return this instanceof mt.Event
        ? (e && e.type
            ? ((this.originalEvent = e),
              (this.type = e.type),
              (this.isDefaultPrevented =
                e.defaultPrevented ||
                (void 0 === e.defaultPrevented && !1 === e.returnValue)
                  ? H
                  : O),
              (this.target =
                e.target && 3 === e.target.nodeType
                  ? e.target.parentNode
                  : e.target),
              (this.currentTarget = e.currentTarget),
              (this.relatedTarget = e.relatedTarget))
            : (this.type = e),
          t && mt.extend(this, t),
          (this.timeStamp = (e && e.timeStamp) || Date.now()),
          (this[mt.expando] = !0),
          void 0)
        : new mt.Event(e, t);
    }),
    (mt.Event.prototype = {
      constructor: mt.Event,
      isDefaultPrevented: O,
      isPropagationStopped: O,
      isImmediatePropagationStopped: O,
      isSimulated: !1,
      preventDefault: function () {
        var e = this.originalEvent;
        (this.isDefaultPrevented = H),
          e && !this.isSimulated && e.preventDefault();
      },
      stopPropagation: function () {
        var e = this.originalEvent;
        (this.isPropagationStopped = H),
          e && !this.isSimulated && e.stopPropagation();
      },
      stopImmediatePropagation: function () {
        var e = this.originalEvent;
        (this.isImmediatePropagationStopped = H),
          e && !this.isSimulated && e.stopImmediatePropagation(),
          this.stopPropagation();
      },
    }),
    mt.each(
      {
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: !0,
      },
      mt.event.addProp
    ),
    mt.each({ focus: "focusin", blur: "focusout" }, function (e, t) {
      mt.event.special[e] = {
        setup: function () {
          return M(this, e, P), !1;
        },
        trigger: function () {
          return M(this, e), !0;
        },
        _default: function () {
          return !0;
        },
        delegateType: t,
      };
    }),
    mt.each(
      {
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout",
      },
      function (e, i) {
        mt.event.special[e] = {
          delegateType: i,
          bindType: i,
          handle: function (e) {
            var t,
              n = e.relatedTarget,
              r = e.handleObj;
            return (
              (n && (n === this || mt.contains(this, n))) ||
                ((e.type = r.origType),
                (t = r.handler.apply(this, arguments)),
                (e.type = i)),
              t
            );
          },
        };
      }
    ),
    mt.fn.extend({
      on: function (e, t, n, r) {
        return R(this, e, t, n, r);
      },
      one: function (e, t, n, r) {
        return R(this, e, t, n, r, 1);
      },
      off: function (e, t, n) {
        var r, i;
        if (e && e.preventDefault && e.handleObj)
          return (
            (r = e.handleObj),
            mt(e.delegateTarget).off(
              r.namespace ? r.origType + "." + r.namespace : r.origType,
              r.selector,
              r.handler
            ),
            this
          );
        if ("object" == typeof e) {
          for (i in e) this.off(i, t, e[i]);
          return this;
        }
        return (
          (!1 !== t && "function" != typeof t) || ((n = t), (t = void 0)),
          !1 === n && (n = O),
          this.each(function () {
            mt.event.remove(this, e, n, t);
          })
        );
      },
    });
  var Gt = /<script|<style|<link/i,
    Jt = /checked\s*(?:[^=]|=\s*.checked.)/i,
    Yt = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
  mt.extend({
    htmlPrefilter: function (e) {
      return e;
    },
    clone: function (e, t, n) {
      var r,
        i,
        o,
        a,
        s,
        u,
        l,
        c = e.cloneNode(!0),
        f = Mt(e);
      if (
        !(
          dt.noCloneChecked ||
          (1 !== e.nodeType && 11 !== e.nodeType) ||
          mt.isXMLDoc(e)
        )
      )
        for (a = N(c), r = 0, i = (o = N(e)).length; i > r; r++)
          (s = o[r]),
            (u = a[r]),
            "input" === (l = u.nodeName.toLowerCase()) && _t.test(s.type)
              ? (u.checked = s.checked)
              : ("input" !== l && "textarea" !== l) ||
                (u.defaultValue = s.defaultValue);
      if (t)
        if (n)
          for (o = o || N(e), a = a || N(c), r = 0, i = o.length; i > r; r++)
            $(o[r], a[r]);
        else $(e, c);
      return 0 < (a = N(c, "script")).length && D(a, !f && N(e, "script")), c;
    },
    cleanData: function (e) {
      for (var t, n, r, i = mt.event.special, o = 0; void 0 !== (n = e[o]); o++)
        if (Dt(n)) {
          if ((t = n[qt.expando])) {
            if (t.events)
              for (r in t.events)
                i[r] ? mt.event.remove(n, r) : mt.removeEvent(n, r, t.handle);
            n[qt.expando] = void 0;
          }
          n[Lt.expando] && (n[Lt.expando] = void 0);
        }
    },
  }),
    mt.fn.extend({
      detach: function (e) {
        return _(this, e, !0);
      },
      remove: function (e) {
        return _(this, e);
      },
      text: function (e) {
        return At(
          this,
          function (e) {
            return void 0 === e
              ? mt.text(this)
              : this.empty().each(function () {
                  (1 !== this.nodeType &&
                    11 !== this.nodeType &&
                    9 !== this.nodeType) ||
                    (this.textContent = e);
                });
          },
          null,
          e,
          arguments.length
        );
      },
      append: function () {
        return B(this, arguments, function (e) {
          (1 !== this.nodeType &&
            11 !== this.nodeType &&
            9 !== this.nodeType) ||
            I(this, e).appendChild(e);
        });
      },
      prepend: function () {
        return B(this, arguments, function (e) {
          if (
            1 === this.nodeType ||
            11 === this.nodeType ||
            9 === this.nodeType
          ) {
            var t = I(this, e);
            t.insertBefore(e, t.firstChild);
          }
        });
      },
      before: function () {
        return B(this, arguments, function (e) {
          this.parentNode && this.parentNode.insertBefore(e, this);
        });
      },
      after: function () {
        return B(this, arguments, function (e) {
          this.parentNode && this.parentNode.insertBefore(e, this.nextSibling);
        });
      },
      empty: function () {
        for (var e, t = 0; null != (e = this[t]); t++)
          1 === e.nodeType && (mt.cleanData(N(e, !1)), (e.textContent = ""));
        return this;
      },
      clone: function (e, t) {
        return (
          (e = null != e && e),
          (t = null == t ? e : t),
          this.map(function () {
            return mt.clone(this, e, t);
          })
        );
      },
      html: function (e) {
        return At(
          this,
          function (e) {
            var t = this[0] || {},
              n = 0,
              r = this.length;
            if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
            if (
              "string" == typeof e &&
              !Gt.test(e) &&
              !zt[(de.exec(e) || ["", ""])[1].toLowerCase()]
            ) {
              e = mt.htmlPrefilter(e);
              try {
                for (; r > n; n++)
                  1 === (t = this[n] || {}).nodeType &&
                    (mt.cleanData(N(t, !1)), (t.innerHTML = e));
                t = 0;
              } catch (e) {}
            }
            t && this.empty().append(e);
          },
          null,
          e,
          arguments.length
        );
      },
      replaceWith: function () {
        var n = [];
        return B(
          this,
          arguments,
          function (e) {
            var t = this.parentNode;
            mt.inArray(this, n) < 0 &&
              (mt.cleanData(N(this)), t && t.replaceChild(e, this));
          },
          n
        );
      },
    }),
    mt.each(
      {
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith",
      },
      function (e, a) {
        mt.fn[e] = function (e) {
          for (var t, n = [], r = mt(e), i = r.length - 1, o = 0; i >= o; o++)
            (t = o === i ? this : this.clone(!0)),
              mt(r[o])[a](t),
              u.apply(n, t.get());
          return this.pushStack(n);
        };
      }
    );
  var Qt = new RegExp("^(" + Pt + ")(?!px)[a-z%]+$", "i"),
    Kt = function (e) {
      var t = e.ownerDocument.defaultView;
      return (t && t.opener) || (t = a), t.getComputedStyle(e);
    },
    Zt = function (e, t, n) {
      var r,
        i,
        o = {};
      for (i in t) (o[i] = e.style[i]), (e.style[i] = t[i]);
      for (i in ((r = n.call(e)), t)) e.style[i] = o[i];
      return r;
    },
    en = new RegExp(ne.join("|"), "i");
  !(function () {
    function e() {
      if (l) {
        (u.style.cssText =
          "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0"),
          (l.style.cssText =
            "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%"),
          re.appendChild(u).appendChild(l);
        var e = a.getComputedStyle(l);
        (n = "1%" !== e.top),
          (s = 12 === t(e.marginLeft)),
          (l.style.right = "60%"),
          (o = 36 === t(e.right)),
          (r = 36 === t(e.width)),
          (l.style.position = "absolute"),
          (i = 12 === t(l.offsetWidth / 3)),
          re.removeChild(u),
          (l = null);
      }
    }
    function t(e) {
      return Math.round(parseFloat(e));
    }
    var n,
      r,
      i,
      o,
      c,
      s,
      u = ht.createElement("div"),
      l = ht.createElement("div");
    l.style &&
      ((l.style.backgroundClip = "content-box"),
      (l.cloneNode(!0).style.backgroundClip = ""),
      (dt.clearCloneStyle = "content-box" === l.style.backgroundClip),
      mt.extend(dt, {
        boxSizingReliable: function () {
          return e(), r;
        },
        pixelBoxStyles: function () {
          return e(), o;
        },
        pixelPosition: function () {
          return e(), n;
        },
        reliableMarginLeft: function () {
          return e(), s;
        },
        scrollboxSize: function () {
          return e(), i;
        },
        reliableTrDimensions: function () {
          var e, t, n, r;
          return (
            null == c &&
              ((e = ht.createElement("table")),
              (t = ht.createElement("tr")),
              (n = ht.createElement("div")),
              (e.style.cssText =
                "position:absolute;left:-11111px;border-collapse:separate"),
              (t.style.cssText = "border:1px solid"),
              (t.style.height = "1px"),
              (n.style.height = "9px"),
              (n.style.display = "block"),
              re.appendChild(e).appendChild(t).appendChild(n),
              (r = a.getComputedStyle(t)),
              (c =
                parseInt(r.height, 10) +
                  parseInt(r.borderTopWidth, 10) +
                  parseInt(r.borderBottomWidth, 10) ===
                t.offsetHeight),
              re.removeChild(e)),
            c
          );
        },
      }));
  })();
  var tn = ["Webkit", "Moz", "ms"],
    nn = ht.createElement("div").style,
    rn = {},
    on = /^(none|table(?!-c[ea]).+)/,
    an = /^--/,
    sn = { position: "absolute", visibility: "hidden", display: "block" },
    un = { letterSpacing: "0", fontWeight: "400" };
  mt.extend({
    cssHooks: {
      opacity: {
        get: function (e, t) {
          if (t) {
            var n = U(e, "opacity");
            return "" === n ? "1" : n;
          }
        },
      },
    },
    cssNumber: {
      animationIterationCount: !0,
      columnCount: !0,
      fillOpacity: !0,
      flexGrow: !0,
      flexShrink: !0,
      fontWeight: !0,
      gridArea: !0,
      gridColumn: !0,
      gridColumnEnd: !0,
      gridColumnStart: !0,
      gridRow: !0,
      gridRowEnd: !0,
      gridRowStart: !0,
      lineHeight: !0,
      opacity: !0,
      order: !0,
      orphans: !0,
      widows: !0,
      zIndex: !0,
      zoom: !0,
    },
    cssProps: {},
    style: function (e, t, n, r) {
      if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
        var i,
          o,
          a,
          s = E(t),
          u = an.test(t),
          l = e.style;
        if (
          (u || (t = X(s)),
          (a = mt.cssHooks[t] || mt.cssHooks[s]),
          void 0 === n)
        )
          return a && "get" in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
        "string" == (o = typeof n) &&
          (i = Rt.exec(n)) &&
          i[1] &&
          ((n = j(e, t, i)), (o = "number")),
          null != n &&
            n == n &&
            ("number" !== o ||
              u ||
              (n += (i && i[3]) || (mt.cssNumber[s] ? "" : "px")),
            dt.clearCloneStyle ||
              "" !== n ||
              0 !== t.indexOf("background") ||
              (l[t] = "inherit"),
            (a && "set" in a && void 0 === (n = a.set(e, n, r))) ||
              (u ? l.setProperty(t, n) : (l[t] = n)));
      }
    },
    css: function (e, t, n, r) {
      var i,
        o,
        a,
        s = E(t);
      return (
        an.test(t) || (t = X(s)),
        (a = mt.cssHooks[t] || mt.cssHooks[s]) &&
          "get" in a &&
          (i = a.get(e, !0, n)),
        void 0 === i && (i = U(e, t, r)),
        "normal" === i && t in un && (i = un[t]),
        "" === n || n
          ? ((o = parseFloat(i)), !0 === n || isFinite(o) ? o || 0 : i)
          : i
      );
    },
  }),
    mt.each(["height", "width"], function (e, u) {
      mt.cssHooks[u] = {
        get: function (e, t, n) {
          return t
            ? !on.test(mt.css(e, "display")) ||
              (e.getClientRects().length && e.getBoundingClientRect().width)
              ? J(e, u, n)
              : Zt(e, sn, function () {
                  return J(e, u, n);
                })
            : void 0;
        },
        set: function (e, t, n) {
          var r,
            i = Kt(e),
            o = !dt.scrollboxSize() && "absolute" === i.position,
            a = (o || n) && "border-box" === mt.css(e, "boxSizing", !1, i),
            s = n ? G(e, u, n, a, i) : 0;
          return (
            a &&
              o &&
              (s -= Math.ceil(
                e["offset" + u[0].toUpperCase() + u.slice(1)] -
                  parseFloat(i[u]) -
                  G(e, u, "border", !1, i) -
                  0.5
              )),
            s &&
              (r = Rt.exec(t)) &&
              "px" !== (r[3] || "px") &&
              ((e.style[u] = t), (t = mt.css(e, u))),
            V(0, t, s)
          );
        },
      };
    }),
    (mt.cssHooks.marginLeft = z(dt.reliableMarginLeft, function (e, t) {
      return t
        ? (parseFloat(U(e, "marginLeft")) ||
            e.getBoundingClientRect().left -
              Zt(e, { marginLeft: 0 }, function () {
                return e.getBoundingClientRect().left;
              })) + "px"
        : void 0;
    })),
    mt.each({ margin: "", padding: "", border: "Width" }, function (i, o) {
      (mt.cssHooks[i + o] = {
        expand: function (e) {
          for (
            var t = 0, n = {}, r = "string" == typeof e ? e.split(" ") : [e];
            4 > t;
            t++
          )
            n[i + ne[t] + o] = r[t] || r[t - 2] || r[0];
          return n;
        },
      }),
        "margin" !== i && (mt.cssHooks[i + o].set = V);
    }),
    mt.fn.extend({
      css: function (e, t) {
        return At(
          this,
          function (e, t, n) {
            var r,
              i,
              o = {},
              a = 0;
            if (Array.isArray(t)) {
              for (r = Kt(e), i = t.length; i > a; a++)
                o[t[a]] = mt.css(e, t[a], !1, r);
              return o;
            }
            return void 0 !== n ? mt.style(e, t, n) : mt.css(e, t);
          },
          e,
          t,
          1 < arguments.length
        );
      },
    }),
    (((mt.Tween = Y).prototype = {
      constructor: Y,
      init: function (e, t, n, r, i, o) {
        (this.elem = e),
          (this.prop = n),
          (this.easing = i || mt.easing._default),
          (this.options = t),
          (this.start = this.now = this.cur()),
          (this.end = r),
          (this.unit = o || (mt.cssNumber[n] ? "" : "px"));
      },
      cur: function () {
        var e = Y.propHooks[this.prop];
        return e && e.get ? e.get(this) : Y.propHooks._default.get(this);
      },
      run: function (e) {
        var t,
          n = Y.propHooks[this.prop];
        return (
          (this.pos = t =
            this.options.duration
              ? mt.easing[this.easing](
                  e,
                  this.options.duration * e,
                  0,
                  1,
                  this.options.duration
                )
              : e),
          (this.now = (this.end - this.start) * t + this.start),
          this.options.step &&
            this.options.step.call(this.elem, this.now, this),
          n && n.set ? n.set(this) : Y.propHooks._default.set(this),
          this
        );
      },
    }).init.prototype = Y.prototype),
    ((Y.propHooks = {
      _default: {
        get: function (e) {
          var t;
          return 1 !== e.elem.nodeType ||
            (null != e.elem[e.prop] && null == e.elem.style[e.prop])
            ? e.elem[e.prop]
            : (t = mt.css(e.elem, e.prop, "")) && "auto" !== t
            ? t
            : 0;
        },
        set: function (e) {
          mt.fx.step[e.prop]
            ? mt.fx.step[e.prop](e)
            : 1 !== e.elem.nodeType ||
              (!mt.cssHooks[e.prop] && null == e.elem.style[X(e.prop)])
            ? (e.elem[e.prop] = e.now)
            : mt.style(e.elem, e.prop, e.now + e.unit);
        },
      },
    }).scrollTop = Y.propHooks.scrollLeft =
      {
        set: function (e) {
          e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now);
        },
      }),
    (mt.easing = {
      linear: function (e) {
        return e;
      },
      swing: function (e) {
        return 0.5 - Math.cos(e * Math.PI) / 2;
      },
      _default: "swing",
    }),
    (mt.fx = Y.prototype.init),
    (mt.fx.step = {});
  var ln,
    cn,
    fn,
    pn,
    rt = /^(?:toggle|show|hide)$/,
    dn = /queueHooks$/;
  (mt.Animation = mt.extend(tt, {
    tweeners: {
      "*": [
        function (e, t) {
          var n = this.createTween(e, t);
          return j(n.elem, e, Rt.exec(t), n), n;
        },
      ],
    },
    tweener: function (e, t) {
      m(e) ? ((t = e), (e = ["*"])) : (e = e.match(St));
      for (var n, r = 0, i = e.length; i > r; r++)
        (n = e[r]),
          (tt.tweeners[n] = tt.tweeners[n] || []),
          tt.tweeners[n].unshift(t);
    },
    prefilters: [
      function (e, t, n) {
        var r,
          i,
          o,
          a,
          s,
          u,
          l,
          c,
          f = "width" in t || "height" in t,
          p = this,
          d = {},
          h = e.style,
          g = e.nodeType && Wt(e),
          v = qt.get(e, "fxshow");
        for (r in (n.queue ||
          (null == (a = mt._queueHooks(e, "fx")).unqueued &&
            ((a.unqueued = 0),
            (s = a.empty.fire),
            (a.empty.fire = function () {
              a.unqueued || s();
            })),
          a.unqueued++,
          p.always(function () {
            p.always(function () {
              a.unqueued--, mt.queue(e, "fx").length || a.empty.fire();
            });
          })),
        t))
          if (((i = t[r]), rt.test(i))) {
            if (
              (delete t[r],
              (o = o || "toggle" === i),
              i === (g ? "hide" : "show"))
            ) {
              if ("show" !== i || !v || void 0 === v[r]) continue;
              g = !0;
            }
            d[r] = (v && v[r]) || mt.style(e, r);
          }
        if ((u = !mt.isEmptyObject(t)) || !mt.isEmptyObject(d))
          for (r in (f &&
            1 === e.nodeType &&
            ((n.overflow = [h.overflow, h.overflowX, h.overflowY]),
            null == (l = v && v.display) && (l = qt.get(e, "display")),
            "none" === (c = mt.css(e, "display")) &&
              (l
                ? (c = l)
                : (le([e], !0),
                  (l = e.style.display || l),
                  (c = mt.css(e, "display")),
                  le([e]))),
            ("inline" === c || ("inline-block" === c && null != l)) &&
              "none" === mt.css(e, "float") &&
              (u ||
                (p.done(function () {
                  h.display = l;
                }),
                null == l && ((c = h.display), (l = "none" === c ? "" : c))),
              (h.display = "inline-block"))),
          n.overflow &&
            ((h.overflow = "hidden"),
            p.always(function () {
              (h.overflow = n.overflow[0]),
                (h.overflowX = n.overflow[1]),
                (h.overflowY = n.overflow[2]);
            })),
          (u = !1),
          d))
            u ||
              (v
                ? "hidden" in v && (g = v.hidden)
                : (v = qt.access(e, "fxshow", { display: l })),
              o && (v.hidden = !g),
              g && le([e], !0),
              p.done(function () {
                for (r in (g || le([e]), qt.remove(e, "fxshow"), d))
                  mt.style(e, r, d[r]);
              })),
              (u = et(g ? v[r] : 0, r, p)),
              r in v ||
                ((v[r] = u.start), g && ((u.end = u.start), (u.start = 0)));
      },
    ],
    prefilter: function (e, t) {
      t ? tt.prefilters.unshift(e) : tt.prefilters.push(e);
    },
  })),
    (mt.speed = function (e, t, n) {
      var r =
        e && "object" == typeof e
          ? mt.extend({}, e)
          : {
              complete: n || (!n && t) || (m(e) && e),
              duration: e,
              easing: (n && t) || (t && !m(t) && t),
            };
      return (
        mt.fx.off
          ? (r.duration = 0)
          : "number" != typeof r.duration &&
            (r.duration =
              r.duration in mt.fx.speeds
                ? mt.fx.speeds[r.duration]
                : mt.fx.speeds._default),
        (null != r.queue && !0 !== r.queue) || (r.queue = "fx"),
        (r.old = r.complete),
        (r.complete = function () {
          m(r.old) && r.old.call(this), r.queue && mt.dequeue(this, r.queue);
        }),
        r
      );
    }),
    mt.fn.extend({
      fadeTo: function (e, t, n, r) {
        return this.filter(Wt)
          .css("opacity", 0)
          .show()
          .end()
          .animate({ opacity: t }, e, n, r);
      },
      animate: function (t, e, n, r) {
        var i = mt.isEmptyObject(t),
          o = mt.speed(e, n, r),
          a = function () {
            var e = tt(this, mt.extend({}, t), o);
            (i || qt.get(this, "finish")) && e.stop(!0);
          };
        return (
          (a.finish = a),
          i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        );
      },
      stop: function (i, e, o) {
        var a = function (e) {
          var t = e.stop;
          delete e.stop, t(o);
        };
        return (
          "string" != typeof i && ((o = e), (e = i), (i = void 0)),
          e && this.queue(i || "fx", []),
          this.each(function () {
            var e = !0,
              t = null != i && i + "queueHooks",
              n = mt.timers,
              r = qt.get(this);
            if (t) r[t] && r[t].stop && a(r[t]);
            else for (t in r) r[t] && r[t].stop && dn.test(t) && a(r[t]);
            for (t = n.length; t--; )
              n[t].elem !== this ||
                (null != i && n[t].queue !== i) ||
                (n[t].anim.stop(o), (e = !1), n.splice(t, 1));
            (!e && o) || mt.dequeue(this, i);
          })
        );
      },
      finish: function (a) {
        return (
          !1 !== a && (a = a || "fx"),
          this.each(function () {
            var e,
              t = qt.get(this),
              n = t[a + "queue"],
              r = t[a + "queueHooks"],
              i = mt.timers,
              o = n ? n.length : 0;
            for (
              t.finish = !0,
                mt.queue(this, a, []),
                r && r.stop && r.stop.call(this, !0),
                e = i.length;
              e--;

            )
              i[e].elem === this &&
                i[e].queue === a &&
                (i[e].anim.stop(!0), i.splice(e, 1));
            for (e = 0; o > e; e++)
              n[e] && n[e].finish && n[e].finish.call(this);
            delete t.finish;
          })
        );
      },
    }),
    mt.each(["toggle", "show", "hide"], function (e, r) {
      var i = mt.fn[r];
      mt.fn[r] = function (e, t, n) {
        return null == e || "boolean" == typeof e
          ? i.apply(this, arguments)
          : this.animate(Z(r, !0), e, t, n);
      };
    }),
    mt.each(
      {
        slideDown: Z("show"),
        slideUp: Z("hide"),
        slideToggle: Z("toggle"),
        fadeIn: { opacity: "show" },
        fadeOut: { opacity: "hide" },
        fadeToggle: { opacity: "toggle" },
      },
      function (e, r) {
        mt.fn[e] = function (e, t, n) {
          return this.animate(r, e, t, n);
        };
      }
    ),
    (mt.timers = []),
    (mt.fx.tick = function () {
      var e,
        t = 0,
        n = mt.timers;
      for (ln = Date.now(); t < n.length; t++)
        (e = n[t])() || n[t] !== e || n.splice(t--, 1);
      n.length || mt.fx.stop(), (ln = void 0);
    }),
    (mt.fx.timer = function (e) {
      mt.timers.push(e), mt.fx.start();
    }),
    (mt.fx.interval = 13),
    (mt.fx.start = function () {
      cn || ((cn = !0), Q());
    }),
    (mt.fx.stop = function () {
      cn = null;
    }),
    (mt.fx.speeds = { slow: 600, fast: 200, _default: 400 }),
    (mt.fn.delay = function (r, e) {
      return (
        (r = (mt.fx && mt.fx.speeds[r]) || r),
        (e = e || "fx"),
        this.queue(e, function (e, t) {
          var n = a.setTimeout(e, r);
          t.stop = function () {
            a.clearTimeout(n);
          };
        })
      );
    }),
    (fn = ht.createElement("input")),
    (pn = ht.createElement("select").appendChild(ht.createElement("option"))),
    (fn.type = "checkbox"),
    (dt.checkOn = "" !== fn.value),
    (dt.optSelected = pn.selected),
    ((fn = ht.createElement("input")).value = "t"),
    (fn.type = "radio"),
    (dt.radioValue = "t" === fn.value);
  var hn,
    gn = mt.expr.attrHandle;
  mt.fn.extend({
    attr: function (e, t) {
      return At(this, mt.attr, e, t, 1 < arguments.length);
    },
    removeAttr: function (e) {
      return this.each(function () {
        mt.removeAttr(this, e);
      });
    },
  }),
    mt.extend({
      attr: function (e, t, n) {
        var r,
          i,
          o = e.nodeType;
        return 3 !== o && 8 !== o && 2 !== o
          ? "undefined" == typeof e.getAttribute
            ? mt.prop(e, t, n)
            : ((1 === o && mt.isXMLDoc(e)) ||
                (i =
                  mt.attrHooks[t.toLowerCase()] ||
                  (mt.expr.match.bool.test(t) ? hn : void 0)),
              void 0 !== n
                ? null === n
                  ? void mt.removeAttr(e, t)
                  : i && "set" in i && void 0 !== (r = i.set(e, n, t))
                  ? r
                  : (e.setAttribute(t, n + ""), n)
                : i && "get" in i && null !== (r = i.get(e, t))
                ? r
                : null == (r = mt.find.attr(e, t))
                ? void 0
                : r)
          : void 0;
      },
      attrHooks: {
        type: {
          set: function (e, t) {
            if (!dt.radioValue && "radio" === t && g(e, "input")) {
              var n = e.value;
              return e.setAttribute("type", t), n && (e.value = n), t;
            }
          },
        },
      },
      removeAttr: function (e, t) {
        var n,
          r = 0,
          i = t && t.match(St);
        if (i && 1 === e.nodeType) for (; (n = i[r++]); ) e.removeAttribute(n);
      },
    }),
    (hn = {
      set: function (e, t, n) {
        return !1 === t ? mt.removeAttr(e, n) : e.setAttribute(n, n), n;
      },
    }),
    mt.each(mt.expr.match.bool.source.match(/\w+/g), function (e, t) {
      var a = gn[t] || mt.find.attr;
      gn[t] = function (e, t, n) {
        var r,
          i,
          o = t.toLowerCase();
        return (
          n ||
            ((i = gn[o]),
            (gn[o] = r),
            (r = null != a(e, t, n) ? o : null),
            (gn[o] = i)),
          r
        );
      };
    });
  var mn = /^(?:input|select|textarea|button)$/i,
    vn = /^(?:a|area)$/i;
  mt.fn.extend({
    prop: function (e, t) {
      return At(this, mt.prop, e, t, 1 < arguments.length);
    },
    removeProp: function (e) {
      return this.each(function () {
        delete this[mt.propFix[e] || e];
      });
    },
  }),
    mt.extend({
      prop: function (e, t, n) {
        var r,
          i,
          o = e.nodeType;
        return 3 !== o && 8 !== o && 2 !== o
          ? ((1 === o && mt.isXMLDoc(e)) ||
              ((t = mt.propFix[t] || t), (i = mt.propHooks[t])),
            void 0 !== n
              ? i && "set" in i && void 0 !== (r = i.set(e, n, t))
                ? r
                : (e[t] = n)
              : i && "get" in i && null !== (r = i.get(e, t))
              ? r
              : e[t])
          : void 0;
      },
      propHooks: {
        tabIndex: {
          get: function (e) {
            var t = mt.find.attr(e, "tabindex");
            return t
              ? parseInt(t, 10)
              : mn.test(e.nodeName) || (vn.test(e.nodeName) && e.href)
              ? 0
              : -1;
          },
        },
      },
      propFix: { for: "htmlFor", class: "className" },
    }),
    dt.optSelected ||
      (mt.propHooks.selected = {
        get: function (e) {
          var t = e.parentNode;
          return t && t.parentNode && t.parentNode.selectedIndex, null;
        },
        set: function (e) {
          var t = e.parentNode;
          t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex);
        },
      }),
    mt.each(
      [
        "tabIndex",
        "readOnly",
        "maxLength",
        "cellSpacing",
        "cellPadding",
        "rowSpan",
        "colSpan",
        "useMap",
        "frameBorder",
        "contentEditable",
      ],
      function () {
        mt.propFix[this.toLowerCase()] = this;
      }
    ),
    mt.fn.extend({
      addClass: function (t) {
        var e,
          n,
          r,
          i,
          o,
          a,
          s,
          u = 0;
        if (m(t))
          return this.each(function (e) {
            mt(this).addClass(t.call(this, e, ot(this)));
          });
        if ((e = it(t)).length)
          for (; (n = this[u++]); )
            if (((i = ot(n)), (r = 1 === n.nodeType && " " + nt(i) + " "))) {
              for (a = 0; (o = e[a++]); )
                r.indexOf(" " + o + " ") < 0 && (r += o + " ");
              i !== (s = nt(r)) && n.setAttribute("class", s);
            }
        return this;
      },
      removeClass: function (t) {
        var e,
          n,
          r,
          i,
          o,
          a,
          s,
          u = 0;
        if (m(t))
          return this.each(function (e) {
            mt(this).removeClass(t.call(this, e, ot(this)));
          });
        if (!arguments.length) return this.attr("class", "");
        if ((e = it(t)).length)
          for (; (n = this[u++]); )
            if (((i = ot(n)), (r = 1 === n.nodeType && " " + nt(i) + " "))) {
              for (a = 0; (o = e[a++]); )
                for (; -1 < r.indexOf(" " + o + " "); )
                  r = r.replace(" " + o + " ", " ");
              i !== (s = nt(r)) && n.setAttribute("class", s);
            }
        return this;
      },
      toggleClass: function (i, t) {
        var o = typeof i,
          a = "string" === o || Array.isArray(i);
        return "boolean" == typeof t && a
          ? t
            ? this.addClass(i)
            : this.removeClass(i)
          : this.each(
              m(i)
                ? function (e) {
                    mt(this).toggleClass(i.call(this, e, ot(this), t), t);
                  }
                : function () {
                    var e, t, n, r;
                    if (a)
                      for (t = 0, n = mt(this), r = it(i); (e = r[t++]); )
                        n.hasClass(e) ? n.removeClass(e) : n.addClass(e);
                    else
                      (void 0 !== i && "boolean" !== o) ||
                        ((e = ot(this)) && qt.set(this, "__className__", e),
                        this.setAttribute &&
                          this.setAttribute(
                            "class",
                            e || !1 === i
                              ? ""
                              : qt.get(this, "__className__") || ""
                          ));
                  }
            );
      },
      hasClass: function (e) {
        var t,
          n,
          r = 0;
        for (t = " " + e + " "; (n = this[r++]); )
          if (1 === n.nodeType && -1 < (" " + nt(ot(n)) + " ").indexOf(t))
            return !0;
        return !1;
      },
    });
  var yn = /\r/g;
  mt.fn.extend({
    val: function (n) {
      var r,
        e,
        i,
        t = this[0];
      return arguments.length
        ? ((i = m(n)),
          this.each(function (e) {
            var t;
            1 === this.nodeType &&
              (null == (t = i ? n.call(this, e, mt(this).val()) : n)
                ? (t = "")
                : "number" == typeof t
                ? (t += "")
                : Array.isArray(t) &&
                  (t = mt.map(t, function (e) {
                    return null == e ? "" : e + "";
                  })),
              ((r =
                mt.valHooks[this.type] ||
                mt.valHooks[this.nodeName.toLowerCase()]) &&
                "set" in r &&
                void 0 !== r.set(this, t, "value")) ||
                (this.value = t));
          }))
        : t
        ? (r = mt.valHooks[t.type] || mt.valHooks[t.nodeName.toLowerCase()]) &&
          "get" in r &&
          void 0 !== (e = r.get(t, "value"))
          ? e
          : "string" == typeof (e = t.value)
          ? e.replace(yn, "")
          : null == e
          ? ""
          : e
        : void 0;
    },
  }),
    mt.extend({
      valHooks: {
        option: {
          get: function (e) {
            var t = mt.find.attr(e, "value");
            return null != t ? t : nt(mt.text(e));
          },
        },
        select: {
          get: function (e) {
            var t,
              n,
              r,
              i = e.options,
              o = e.selectedIndex,
              a = "select-one" === e.type,
              s = a ? null : [],
              u = a ? o + 1 : i.length;
            for (r = 0 > o ? u : a ? o : 0; u > r; r++)
              if (
                !(
                  (!(n = i[r]).selected && r !== o) ||
                  n.disabled ||
                  (n.parentNode.disabled && g(n.parentNode, "optgroup"))
                )
              ) {
                if (((t = mt(n).val()), a)) return t;
                s.push(t);
              }
            return s;
          },
          set: function (e, t) {
            for (
              var n, r, i = e.options, o = mt.makeArray(t), a = i.length;
              a--;

            )
              ((r = i[a]).selected =
                -1 < mt.inArray(mt.valHooks.option.get(r), o)) && (n = !0);
            return n || (e.selectedIndex = -1), o;
          },
        },
      },
    }),
    mt.each(["radio", "checkbox"], function () {
      (mt.valHooks[this] = {
        set: function (e, t) {
          return Array.isArray(t)
            ? (e.checked = -1 < mt.inArray(mt(e).val(), t))
            : void 0;
        },
      }),
        dt.checkOn ||
          (mt.valHooks[this].get = function (e) {
            return null === e.getAttribute("value") ? "on" : e.value;
          });
    }),
    (dt.focusin = "onfocusin" in a);
  var xn = /^(?:focusinfocus|focusoutblur)$/,
    bn = function (e) {
      e.stopPropagation();
    };
  mt.extend(mt.event, {
    trigger: function (e, t, n, r) {
      var i,
        o,
        c,
        s,
        u,
        l,
        h,
        f,
        p = [n || ht],
        d = ft.call(e, "type") ? e.type : e,
        g = ft.call(e, "namespace") ? e.namespace.split(".") : [];
      if (
        ((o = f = c = n = n || ht),
        3 !== n.nodeType &&
          8 !== n.nodeType &&
          !xn.test(d + mt.event.triggered) &&
          (-1 < d.indexOf(".") && ((d = (g = d.split(".")).shift()), g.sort()),
          (u = d.indexOf(":") < 0 && "on" + d),
          ((e = e[mt.expando]
            ? e
            : new mt.Event(d, "object" == typeof e && e)).isTrigger = r
            ? 2
            : 3),
          (e.namespace = g.join(".")),
          (e.rnamespace = e.namespace
            ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)")
            : null),
          (e.result = void 0),
          e.target || (e.target = n),
          (t = null == t ? [e] : mt.makeArray(t, [e])),
          (h = mt.event.special[d] || {}),
          r || !h.trigger || !1 !== h.trigger.apply(n, t)))
      ) {
        if (!r && !h.noBubble && !x(n)) {
          for (
            s = h.delegateType || d, xn.test(s + d) || (o = o.parentNode);
            o;
            o = o.parentNode
          )
            p.push(o), (c = o);
          c === (n.ownerDocument || ht) &&
            p.push(c.defaultView || c.parentWindow || a);
        }
        for (i = 0; (o = p[i++]) && !e.isPropagationStopped(); )
          (f = o),
            (e.type = i > 1 ? s : h.bindType || d),
            (l =
              (qt.get(o, "events") || Object.create(null))[e.type] &&
              qt.get(o, "handle")) && l.apply(o, t),
            (l = u && o[u]) &&
              l.apply &&
              Dt(o) &&
              ((e.result = l.apply(o, t)),
              !1 === e.result && e.preventDefault());
        return (
          (e.type = d),
          r ||
            e.isDefaultPrevented() ||
            (h._default && !1 !== h._default.apply(p.pop(), t)) ||
            !Dt(n) ||
            (u &&
              m(n[d]) &&
              !x(n) &&
              ((c = n[u]) && (n[u] = null),
              (mt.event.triggered = d),
              e.isPropagationStopped() && f.addEventListener(d, bn),
              n[d](),
              e.isPropagationStopped() && f.removeEventListener(d, bn),
              (mt.event.triggered = void 0),
              c && (n[u] = c))),
          e.result
        );
      }
    },
    simulate: function (e, t, n) {
      var r = mt.extend(new mt.Event(), n, { type: e, isSimulated: !0 });
      mt.event.trigger(r, null, t);
    },
  }),
    mt.fn.extend({
      trigger: function (e, t) {
        return this.each(function () {
          mt.event.trigger(e, t, this);
        });
      },
      triggerHandler: function (e, t) {
        var n = this[0];
        return n ? mt.event.trigger(e, t, n, !0) : void 0;
      },
    }),
    dt.focusin ||
      mt.each({ focus: "focusin", blur: "focusout" }, function (n, r) {
        var i = function (e) {
          mt.event.simulate(r, e.target, mt.event.fix(e));
        };
        mt.event.special[r] = {
          setup: function () {
            var e = this.ownerDocument || this.document || this,
              t = qt.access(e, r);
            t || e.addEventListener(n, i, !0), qt.access(e, r, (t || 0) + 1);
          },
          teardown: function () {
            var e = this.ownerDocument || this.document || this,
              t = qt.access(e, r) - 1;
            t
              ? qt.access(e, r, t)
              : (e.removeEventListener(n, i, !0), qt.remove(e, r));
          },
        };
      });
  var wn = a.location,
    Tn = { guid: Date.now() },
    Cn = /\?/;
  mt.parseXML = function (e) {
    var t, n;
    if (!e || "string" != typeof e) return null;
    try {
      t = new a.DOMParser().parseFromString(e, "text/xml");
    } catch (e) {}
    return (
      (n = t && t.getElementsByTagName("parsererror")[0]),
      (t && !n) ||
        mt.error(
          "Invalid XML: " +
            (n
              ? mt
                  .map(n.childNodes, function (e) {
                    return e.textContent;
                  })
                  .join("\n")
              : e)
        ),
      t
    );
  };
  var Sn = /\[\]$/,
    En = /\r?\n/g,
    kn = /^(?:submit|button|image|reset|file)$/i,
    An = /^(?:input|select|textarea|keygen)/i;
  (mt.param = function (e, t) {
    var n,
      r = [],
      i = function (e, t) {
        var n = m(t) ? t() : t;
        r[r.length] =
          encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n);
      };
    if (null == e) return "";
    if (Array.isArray(e) || (e.jquery && !mt.isPlainObject(e)))
      mt.each(e, function () {
        i(this.name, this.value);
      });
    else for (n in e) at(n, e[n], t, i);
    return r.join("&");
  }),
    mt.fn.extend({
      serialize: function () {
        return mt.param(this.serializeArray());
      },
      serializeArray: function () {
        return this.map(function () {
          var e = mt.prop(this, "elements");
          return e ? mt.makeArray(e) : this;
        })
          .filter(function () {
            var e = this.type;
            return (
              this.name &&
              !mt(this).is(":disabled") &&
              An.test(this.nodeName) &&
              !kn.test(e) &&
              (this.checked || !_t.test(e))
            );
          })
          .map(function (e, t) {
            var n = mt(this).val();
            return null == n
              ? null
              : Array.isArray(n)
              ? mt.map(n, function (e) {
                  return { name: t.name, value: e.replace(En, "\r\n") };
                })
              : { name: t.name, value: n.replace(En, "\r\n") };
          })
          .get();
      },
    });
  var jn = /%20/g,
    Nn = /#.*$/,
    Dn = /([?&])_=[^&]*/,
    qn = /^(.*?):[ \t]*([^\r\n]*)$/gm,
    Ln = /^(?:GET|HEAD)$/,
    Hn = /^\/\//,
    On = {},
    Pn = {},
    Rn = "*/".concat("*"),
    Mn = ht.createElement("a");
  (Mn.href = wn.href),
    mt.extend({
      active: 0,
      lastModified: {},
      etag: {},
      ajaxSettings: {
        url: wn.href,
        type: "GET",
        isLocal:
          /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(
            wn.protocol
          ),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
          "*": Rn,
          text: "text/plain",
          html: "text/html",
          xml: "application/xml, text/xml",
          json: "application/json, text/javascript",
        },
        contents: { xml: /\bxml\b/, html: /\bhtml/, json: /\bjson\b/ },
        responseFields: {
          xml: "responseXML",
          text: "responseText",
          json: "responseJSON",
        },
        converters: {
          "* text": String,
          "text html": !0,
          "text json": JSON.parse,
          "text xml": mt.parseXML,
        },
        flatOptions: { url: !0, context: !0 },
      },
      ajaxSetup: function (e, t) {
        return t ? lt(lt(e, mt.ajaxSettings), t) : lt(mt.ajaxSettings, e);
      },
      ajaxPrefilter: st(On),
      ajaxTransport: st(Pn),
      ajax: function (e, t) {
        function l(e, t, n, r) {
          var i,
            o,
            T,
            s,
            u,
            l = t;
          h ||
            ((h = !0),
            d && a.clearTimeout(d),
            (c = void 0),
            (p = r || ""),
            (C.readyState = e > 0 ? 4 : 0),
            (i = (e >= 200 && 300 > e) || 304 === e),
            n &&
              (s = (function (e, t, n) {
                for (
                  var r, i, o, a, s = e.contents, u = e.dataTypes;
                  "*" === u[0];

                )
                  u.shift(),
                    void 0 === r &&
                      (r = e.mimeType || t.getResponseHeader("Content-Type"));
                if (r)
                  for (i in s)
                    if (s[i] && s[i].test(r)) {
                      u.unshift(i);
                      break;
                    }
                if (u[0] in n) o = u[0];
                else {
                  for (i in n) {
                    if (!u[0] || e.converters[i + " " + u[0]]) {
                      o = i;
                      break;
                    }
                    a || (a = i);
                  }
                  o = o || a;
                }
                return o ? (o !== u[0] && u.unshift(o), n[o]) : void 0;
              })(v, C, n)),
            !i &&
              -1 < mt.inArray("script", v.dataTypes) &&
              mt.inArray("json", v.dataTypes) < 0 &&
              (v.converters["text script"] = function () {}),
            (s = (function (e, t, n, r) {
              var i,
                o,
                a,
                s,
                u,
                l = {},
                c = e.dataTypes.slice();
              if (c[1])
                for (a in e.converters) l[a.toLowerCase()] = e.converters[a];
              for (o = c.shift(); o; )
                if (
                  (e.responseFields[o] && (n[e.responseFields[o]] = t),
                  !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                  (u = o),
                  (o = c.shift()))
                )
                  if ("*" === o) o = u;
                  else if ("*" !== u && u !== o) {
                    if (!(a = l[u + " " + o] || l["* " + o]))
                      for (i in l)
                        if (
                          (s = i.split(" "))[1] === o &&
                          (a = l[u + " " + s[0]] || l["* " + s[0]])
                        ) {
                          !0 === a
                            ? (a = l[i])
                            : !0 !== l[i] && ((o = s[0]), c.unshift(s[1]));
                          break;
                        }
                    if (!0 !== a)
                      if (a && e["throws"]) t = a(t);
                      else
                        try {
                          t = a(t);
                        } catch (e) {
                          return {
                            state: "parsererror",
                            error: a
                              ? e
                              : "No conversion from " + u + " to " + o,
                          };
                        }
                  }
              return { state: "success", data: t };
            })(v, s, C, i)),
            i
              ? (v.ifModified &&
                  ((u = C.getResponseHeader("Last-Modified")) &&
                    (mt.lastModified[f] = u),
                  (u = C.getResponseHeader("etag")) && (mt.etag[f] = u)),
                204 === e || "HEAD" === v.type
                  ? (l = "nocontent")
                  : 304 === e
                  ? (l = "notmodified")
                  : ((l = s.state), (o = s.data), (i = !(T = s.error))))
              : ((T = l), (!e && l) || ((l = "error"), 0 > e && (e = 0))),
            (C.status = e),
            (C.statusText = (t || l) + ""),
            i ? x.resolveWith(y, [o, l, C]) : x.rejectWith(y, [C, l, T]),
            C.statusCode(w),
            (w = void 0),
            g && m.trigger(i ? "ajaxSuccess" : "ajaxError", [C, v, i ? o : T]),
            b.fireWith(y, [C, l]),
            g &&
              (m.trigger("ajaxComplete", [C, v]),
              --mt.active || mt.event.trigger("ajaxStop")));
        }
        "object" == typeof e && ((t = e), (e = void 0)), (t = t || {});
        var c,
          f,
          p,
          n,
          d,
          r,
          h,
          g,
          i,
          o,
          v = mt.ajaxSetup({}, t),
          y = v.context || v,
          m = v.context && (y.nodeType || y.jquery) ? mt(y) : mt.event,
          x = mt.Deferred(),
          b = mt.Callbacks("once memory"),
          w = v.statusCode || {},
          T = {},
          s = {},
          u = "canceled",
          C = {
            readyState: 0,
            getResponseHeader: function (e) {
              var t;
              if (h) {
                if (!n)
                  for (n = {}; (t = qn.exec(p)); )
                    n[t[1].toLowerCase() + " "] = (
                      n[t[1].toLowerCase() + " "] || []
                    ).concat(t[2]);
                t = n[e.toLowerCase() + " "];
              }
              return null == t ? null : t.join(", ");
            },
            getAllResponseHeaders: function () {
              return h ? p : null;
            },
            setRequestHeader: function (e, t) {
              return (
                null == h &&
                  ((e = s[e.toLowerCase()] = s[e.toLowerCase()] || e),
                  (T[e] = t)),
                this
              );
            },
            overrideMimeType: function (e) {
              return null == h && (v.mimeType = e), this;
            },
            statusCode: function (e) {
              var t;
              if (e)
                if (h) C.always(e[C.status]);
                else for (t in e) w[t] = [w[t], e[t]];
              return this;
            },
            abort: function (e) {
              var t = e || u;
              return c && c.abort(t), l(0, t), this;
            },
          };
        if (
          (x.promise(C),
          (v.url = ((e || v.url || wn.href) + "").replace(
            Hn,
            wn.protocol + "//"
          )),
          (v.type = t.method || t.type || v.method || v.type),
          (v.dataTypes = (v.dataType || "*").toLowerCase().match(St) || [""]),
          null == v.crossDomain)
        ) {
          r = ht.createElement("a");
          try {
            (r.href = v.url),
              (r.href = r.href),
              (v.crossDomain =
                Mn.protocol + "//" + Mn.host != r.protocol + "//" + r.host);
          } catch (e) {
            v.crossDomain = !0;
          }
        }
        if (
          (v.data &&
            v.processData &&
            "string" != typeof v.data &&
            (v.data = mt.param(v.data, v.traditional)),
          ut(On, v, t, C),
          h)
        )
          return C;
        for (i in ((g = mt.event && v.global) &&
          0 == mt.active++ &&
          mt.event.trigger("ajaxStart"),
        (v.type = v.type.toUpperCase()),
        (v.hasContent = !Ln.test(v.type)),
        (f = v.url.replace(Nn, "")),
        v.hasContent
          ? v.data &&
            v.processData &&
            0 ===
              (v.contentType || "").indexOf(
                "application/x-www-form-urlencoded"
              ) &&
            (v.data = v.data.replace(jn, "+"))
          : ((o = v.url.slice(f.length)),
            v.data &&
              (v.processData || "string" == typeof v.data) &&
              ((f += (Cn.test(f) ? "&" : "?") + v.data), delete v.data),
            !1 === v.cache &&
              ((f = f.replace(Dn, "$1")),
              (o = (Cn.test(f) ? "&" : "?") + "_=" + Tn.guid++ + o)),
            (v.url = f + o)),
        v.ifModified &&
          (mt.lastModified[f] &&
            C.setRequestHeader("If-Modified-Since", mt.lastModified[f]),
          mt.etag[f] && C.setRequestHeader("If-None-Match", mt.etag[f])),
        ((v.data && v.hasContent && !1 !== v.contentType) || t.contentType) &&
          C.setRequestHeader("Content-Type", v.contentType),
        C.setRequestHeader(
          "Accept",
          v.dataTypes[0] && v.accepts[v.dataTypes[0]]
            ? v.accepts[v.dataTypes[0]] +
                ("*" !== v.dataTypes[0] ? ", " + Rn + "; q=0.01" : "")
            : v.accepts["*"]
        ),
        v.headers))
          C.setRequestHeader(i, v.headers[i]);
        if (v.beforeSend && (!1 === v.beforeSend.call(y, C, v) || h))
          return C.abort();
        if (
          ((u = "abort"),
          b.add(v.complete),
          C.done(v.success),
          C.fail(v.error),
          (c = ut(Pn, v, t, C)))
        ) {
          if (((C.readyState = 1), g && m.trigger("ajaxSend", [C, v]), h))
            return C;
          v.async &&
            0 < v.timeout &&
            (d = a.setTimeout(function () {
              C.abort("timeout");
            }, v.timeout));
          try {
            (h = !1), c.send(T, l);
          } catch (e) {
            if (h) throw e;
            l(-1, e);
          }
        } else l(-1, "No Transport");
        return C;
      },
      getJSON: function (e, t, n) {
        return mt.get(e, t, n, "json");
      },
      getScript: function (e, t) {
        return mt.get(e, void 0, t, "script");
      },
    }),
    mt.each(["get", "post"], function (e, i) {
      mt[i] = function (e, t, n, r) {
        return (
          m(t) && ((r = r || n), (n = t), (t = void 0)),
          mt.ajax(
            mt.extend(
              { url: e, type: i, dataType: r, data: t, success: n },
              mt.isPlainObject(e) && e
            )
          )
        );
      };
    }),
    mt.ajaxPrefilter(function (e) {
      var t;
      for (t in e.headers)
        "content-type" === t.toLowerCase() &&
          (e.contentType = e.headers[t] || "");
    }),
    (mt._evalUrl = function (e, t, n) {
      return mt.ajax({
        url: e,
        type: "GET",
        dataType: "script",
        cache: !0,
        async: !1,
        global: !1,
        converters: { "text script": function () {} },
        dataFilter: function (e) {
          mt.globalEval(e, t, n);
        },
      });
    }),
    mt.fn.extend({
      wrapAll: function (e) {
        var t;
        return (
          this[0] &&
            (m(e) && (e = e.call(this[0])),
            (t = mt(e, this[0].ownerDocument).eq(0).clone(!0)),
            this[0].parentNode && t.insertBefore(this[0]),
            t
              .map(function () {
                for (var e = this; e.firstElementChild; )
                  e = e.firstElementChild;
                return e;
              })
              .append(this)),
          this
        );
      },
      wrapInner: function (n) {
        return this.each(
          m(n)
            ? function (e) {
                mt(this).wrapInner(n.call(this, e));
              }
            : function () {
                var e = mt(this),
                  t = e.contents();
                t.length ? t.wrapAll(n) : e.append(n);
              }
        );
      },
      wrap: function (t) {
        var n = m(t);
        return this.each(function (e) {
          mt(this).wrapAll(n ? t.call(this, e) : t);
        });
      },
      unwrap: function (e) {
        return (
          this.parent(e)
            .not("body")
            .each(function () {
              mt(this).replaceWith(this.childNodes);
            }),
          this
        );
      },
    }),
    (mt.expr.pseudos.hidden = function (e) {
      return !mt.expr.pseudos.visible(e);
    }),
    (mt.expr.pseudos.visible = function (e) {
      return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
    }),
    (mt.ajaxSettings.xhr = function () {
      try {
        return new a.XMLHttpRequest();
      } catch (e) {}
    });
  var In = { 0: 200, 1223: 204 },
    Wn = mt.ajaxSettings.xhr();
  (dt.cors = !!Wn && "withCredentials" in Wn),
    (dt.ajax = Wn = !!Wn),
    mt.ajaxTransport(function (i) {
      var o, c;
      return dt.cors || (Wn && !i.crossDomain)
        ? {
            send: function (e, t) {
              var n,
                r = i.xhr();
              if (
                (r.open(i.type, i.url, i.async, i.username, i.password),
                i.xhrFields)
              )
                for (n in i.xhrFields) r[n] = i.xhrFields[n];
              for (n in (i.mimeType &&
                r.overrideMimeType &&
                r.overrideMimeType(i.mimeType),
              i.crossDomain ||
                e["X-Requested-With"] ||
                (e["X-Requested-With"] = "XMLHttpRequest"),
              e))
                r.setRequestHeader(n, e[n]);
              (o = function (e) {
                return function () {
                  o &&
                    ((o =
                      c =
                      r.onload =
                      r.onerror =
                      r.onabort =
                      r.ontimeout =
                      r.onreadystatechange =
                        null),
                    "abort" === e
                      ? r.abort()
                      : "error" === e
                      ? "number" != typeof r.status
                        ? t(0, "error")
                        : t(r.status, r.statusText)
                      : t(
                          In[r.status] || r.status,
                          r.statusText,
                          "text" !== (r.responseType || "text") ||
                            "string" != typeof r.responseText
                            ? { binary: r.response }
                            : { text: r.responseText },
                          r.getAllResponseHeaders()
                        ));
                };
              }),
                (r.onload = o()),
                (c = r.onerror = r.ontimeout = o("error")),
                void 0 !== r.onabort
                  ? (r.onabort = c)
                  : (r.onreadystatechange = function () {
                      4 === r.readyState &&
                        a.setTimeout(function () {
                          o && c();
                        });
                    }),
                (o = o("abort"));
              try {
                r.send((i.hasContent && i.data) || null);
              } catch (e) {
                if (o) throw e;
              }
            },
            abort: function () {
              o && o();
            },
          }
        : void 0;
    }),
    mt.ajaxPrefilter(function (e) {
      e.crossDomain && (e.contents.script = !1);
    }),
    mt.ajaxSetup({
      accepts: {
        script:
          "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript",
      },
      contents: { script: /\b(?:java|ecma)script\b/ },
      converters: {
        "text script": function (e) {
          return mt.globalEval(e), e;
        },
      },
    }),
    mt.ajaxPrefilter("script", function (e) {
      void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET");
    }),
    mt.ajaxTransport("script", function (n) {
      var r, i;
      return n.crossDomain || n.scriptAttrs
        ? {
            send: function (e, t) {
              (r = mt("<script>")
                .attr(n.scriptAttrs || {})
                .prop({ charset: n.scriptCharset, src: n.url })
                .on(
                  "load error",
                  (i = function (e) {
                    r.remove(),
                      (i = null),
                      e && t("error" === e.type ? 404 : 200, e.type);
                  })
                )),
                ht.head.appendChild(r[0]);
            },
            abort: function () {
              i && i();
            },
          }
        : void 0;
    });
  var Fn,
    $n = [],
    Bn = /(=)\?(?=&|$)|\?\?/;
  mt.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function () {
      var e = $n.pop() || mt.expando + "_" + Tn.guid++;
      return (this[e] = !0), e;
    },
  }),
    mt.ajaxPrefilter("json jsonp", function (e, t, n) {
      var r,
        i,
        o,
        c =
          !1 !== e.jsonp &&
          (Bn.test(e.url)
            ? "url"
            : "string" == typeof e.data &&
              0 ===
                (e.contentType || "").indexOf(
                  "application/x-www-form-urlencoded"
                ) &&
              Bn.test(e.data) &&
              "data");
      return c || "jsonp" === e.dataTypes[0]
        ? ((r = e.jsonpCallback =
            m(e.jsonpCallback) ? e.jsonpCallback() : e.jsonpCallback),
          c
            ? (e[c] = e[c].replace(Bn, "$1" + r))
            : !1 !== e.jsonp &&
              (e.url += (Cn.test(e.url) ? "&" : "?") + e.jsonp + "=" + r),
          (e.converters["script json"] = function () {
            return o || mt.error(r + " was not called"), o[0];
          }),
          (e.dataTypes[0] = "json"),
          (i = a[r]),
          (a[r] = function () {
            o = arguments;
          }),
          n.always(function () {
            void 0 === i ? mt(a).removeProp(r) : (a[r] = i),
              e[r] && ((e.jsonpCallback = t.jsonpCallback), $n.push(r)),
              o && m(i) && i(o[0]),
              (o = i = void 0);
          }),
          "script")
        : void 0;
    }),
    (dt.createHTMLDocument =
      (((Fn = ht.implementation.createHTMLDocument("").body).innerHTML =
        "<form></form><form></form>"),
      2 === Fn.childNodes.length)),
    (mt.parseHTML = function (e, t, n) {
      return "string" != typeof e
        ? []
        : ("boolean" == typeof t && ((n = t), (t = !1)),
          t ||
            (dt.createHTMLDocument
              ? (((r = (t =
                  ht.implementation.createHTMLDocument("")).createElement(
                  "base"
                )).href = ht.location.href),
                t.head.appendChild(r))
              : (t = ht)),
          (o = !n && []),
          (i = bt.exec(e))
            ? [t.createElement(i[1])]
            : ((i = L([e], t, o)),
              o && o.length && mt(o).remove(),
              mt.merge([], i.childNodes)));
      var r, i, o;
    }),
    (mt.fn.load = function (e, t, n) {
      var r,
        i,
        o,
        a = this,
        s = e.indexOf(" ");
      return (
        s > -1 && ((r = nt(e.slice(s))), (e = e.slice(0, s))),
        m(t)
          ? ((n = t), (t = void 0))
          : t && "object" == typeof t && (i = "POST"),
        0 < a.length &&
          mt
            .ajax({ url: e, type: i || "GET", dataType: "html", data: t })
            .done(function (e) {
              (o = arguments),
                a.html(r ? mt("<div>").append(mt.parseHTML(e)).find(r) : e);
            })
            .always(
              n &&
                function (e, t) {
                  a.each(function () {
                    n.apply(this, o || [e.responseText, t, e]);
                  });
                }
            ),
        this
      );
    }),
    (mt.expr.pseudos.animated = function (t) {
      return mt.grep(mt.timers, function (e) {
        return t === e.elem;
      }).length;
    }),
    (mt.offset = {
      setOffset: function (e, t, n) {
        var r,
          i,
          o,
          a,
          s,
          u,
          l = mt.css(e, "position"),
          c = mt(e),
          f = {};
        "static" === l && (e.style.position = "relative"),
          (s = c.offset()),
          (o = mt.css(e, "top")),
          (u = mt.css(e, "left")),
          ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto")
            ? ((a = (r = c.position()).top), (i = r.left))
            : ((a = parseFloat(o) || 0), (i = parseFloat(u) || 0)),
          m(t) && (t = t.call(e, n, mt.extend({}, s))),
          null != t.top && (f.top = t.top - s.top + a),
          null != t.left && (f.left = t.left - s.left + i),
          "using" in t ? t.using.call(e, f) : c.css(f);
      },
    }),
    mt.fn.extend({
      offset: function (t) {
        if (arguments.length)
          return void 0 === t
            ? this
            : this.each(function (e) {
                mt.offset.setOffset(this, t, e);
              });
        var e,
          n,
          r = this[0];
        return r
          ? r.getClientRects().length
            ? ((e = r.getBoundingClientRect()),
              (n = r.ownerDocument.defaultView),
              { top: e.top + n.pageYOffset, left: e.left + n.pageXOffset })
            : { top: 0, left: 0 }
          : void 0;
      },
      position: function () {
        if (this[0]) {
          var e,
            t,
            n,
            r = this[0],
            i = { top: 0, left: 0 };
          if ("fixed" === mt.css(r, "position")) t = r.getBoundingClientRect();
          else {
            for (
              t = this.offset(),
                n = r.ownerDocument,
                e = r.offsetParent || n.documentElement;
              e &&
              (e === n.body || e === n.documentElement) &&
              "static" === mt.css(e, "position");

            )
              e = e.parentNode;
            e &&
              e !== r &&
              1 === e.nodeType &&
              (((i = mt(e).offset()).top += mt.css(e, "borderTopWidth", !0)),
              (i.left += mt.css(e, "borderLeftWidth", !0)));
          }
          return {
            top: t.top - i.top - mt.css(r, "marginTop", !0),
            left: t.left - i.left - mt.css(r, "marginLeft", !0),
          };
        }
      },
      offsetParent: function () {
        return this.map(function () {
          for (
            var e = this.offsetParent;
            e && "static" === mt.css(e, "position");

          )
            e = e.offsetParent;
          return e || re;
        });
      },
    }),
    mt.each(
      { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" },
      function (t, i) {
        var o = "pageYOffset" === i;
        mt.fn[t] = function (e) {
          return At(
            this,
            function (e, t, n) {
              var r;
              return (
                x(e) ? (r = e) : 9 === e.nodeType && (r = e.defaultView),
                void 0 === n
                  ? r
                    ? r[i]
                    : e[t]
                  : void (r
                      ? r.scrollTo(o ? r.pageXOffset : n, o ? n : r.pageYOffset)
                      : (e[t] = n))
              );
            },
            t,
            e,
            arguments.length
          );
        };
      }
    ),
    mt.each(["top", "left"], function (e, n) {
      mt.cssHooks[n] = z(dt.pixelPosition, function (e, t) {
        return t
          ? ((t = U(e, n)), Qt.test(t) ? mt(e).position()[n] + "px" : t)
          : void 0;
      });
    }),
    mt.each({ Height: "height", Width: "width" }, function (a, s) {
      mt.each(
        { padding: "inner" + a, content: s, "": "outer" + a },
        function (r, o) {
          mt.fn[o] = function (e, t) {
            var n = arguments.length && (r || "boolean" != typeof e),
              i = r || (!0 === e || !0 === t ? "margin" : "border");
            return At(
              this,
              function (e, t, n) {
                var r;
                return x(e)
                  ? 0 === o.indexOf("outer")
                    ? e["inner" + a]
                    : e.document.documentElement["client" + a]
                  : 9 === e.nodeType
                  ? ((r = e.documentElement),
                    Math.max(
                      e.body["scroll" + a],
                      r["scroll" + a],
                      e.body["offset" + a],
                      r["offset" + a],
                      r["client" + a]
                    ))
                  : void 0 === n
                  ? mt.css(e, t, i)
                  : mt.style(e, t, n, i);
              },
              s,
              n ? e : void 0,
              n
            );
          };
        }
      );
    }),
    mt.each(
      [
        "ajaxStart",
        "ajaxStop",
        "ajaxComplete",
        "ajaxError",
        "ajaxSuccess",
        "ajaxSend",
      ],
      function (e, t) {
        mt.fn[t] = function (e) {
          return this.on(t, e);
        };
      }
    ),
    mt.fn.extend({
      bind: function (e, t, n) {
        return this.on(e, null, t, n);
      },
      unbind: function (e, t) {
        return this.off(e, null, t);
      },
      delegate: function (e, t, n, r) {
        return this.on(t, e, n, r);
      },
      undelegate: function (e, t, n) {
        return 1 === arguments.length
          ? this.off(e, "**")
          : this.off(t, e || "**", n);
      },
      hover: function (e, t) {
        return this.mouseenter(e).mouseleave(t || e);
      },
    }),
    mt.each(
      "blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(
        " "
      ),
      function (e, n) {
        mt.fn[n] = function (e, t) {
          return 0 < arguments.length
            ? this.on(n, null, e, t)
            : this.trigger(n);
        };
      }
    );
  var _n = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
  (mt.proxy = function (e, t) {
    var n, r, i;
    return (
      "string" == typeof t && ((n = e[t]), (t = e), (e = n)),
      m(e)
        ? ((r = s.call(arguments, 2)),
          ((i = function () {
            return e.apply(t || this, r.concat(s.call(arguments)));
          }).guid = e.guid =
            e.guid || mt.guid++),
          i)
        : void 0
    );
  }),
    (mt.holdReady = function (e) {
      e ? mt.readyWait++ : mt.ready(!0);
    }),
    (mt.isArray = Array.isArray),
    (mt.parseJSON = JSON.parse),
    (mt.nodeName = g),
    (mt.isFunction = m),
    (mt.isWindow = x),
    (mt.camelCase = E),
    (mt.type = h),
    (mt.now = Date.now),
    (mt.isNumeric = function (e) {
      var t = mt.type(e);
      return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e));
    }),
    (mt.trim = function (e) {
      return null == e ? "" : (e + "").replace(_n, "");
    }),
    "function" == typeof define &&
      define.amd &&
      define("jquery", [], function () {
        return mt;
      });
  var Un = a.jQuery,
    zn = a.$;
  return (
    (mt.noConflict = function (e) {
      return (
        a.$ === mt && (a.$ = zn), e && a.jQuery === mt && (a.jQuery = Un), mt
      );
    }),
    "undefined" == typeof e && (a.jQuery = a.$ = mt),
    mt
  );
}),
  (function (a) {
    "function" == typeof define && define.amd
      ? define(["jquery"], a)
      : a(jQuery);
  })(function (a) {
    function c(s) {
      return w.raw ? s : encodeURIComponent(s);
    }
    function h(s) {
      return w.raw ? s : decodeURIComponent(s);
    }
    function g(a) {
      return c(w.json ? JSON.stringify(a) : String(a));
    }
    function v(s) {
      0 === s.indexOf('"') &&
        (s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
      try {
        s = decodeURIComponent(s.replace(b, " "));
      } catch (e) {
        return;
      }
      try {
        return w.json ? JSON.parse(s) : s;
      } catch (e) {}
    }
    function y(s, c) {
      var h = w.raw ? s : v(s);
      return a.isFunction(c) ? c(h) : h;
    }
    var b = /\+/g,
      w = (a.cookie = function (v, b, T) {
        if (void 0 !== b && !a.isFunction(b)) {
          if (
            ((T = a.extend({}, w.defaults, T)), "number" == typeof T.expires)
          ) {
            var C = T.expires,
              t = (T.expires = new Date());
            t.setDate(t.getDate() + C);
          }
          return (document.cookie = [
            c(v),
            "=",
            g(b),
            T.expires ? "; expires=" + T.expires.toUTCString() : "",
            T.path ? "; path=" + T.path : "",
            T.domain ? "; domain=" + T.domain : "",
            T.secure ? "; secure" : "",
          ].join(""));
        }
        for (
          var S = v ? void 0 : {},
            E = document.cookie ? document.cookie.split("; ") : [],
            i = 0,
            l = E.length;
          l > i;
          i++
        ) {
          var k = E[i].split("="),
            A = h(k.shift()),
            j = k.join("=");
          if (v && v === A) {
            S = y(j, b);
            break;
          }
          v || void 0 === (j = y(j)) || (S[A] = j);
        }
        return S;
      });
    (w.defaults = {}),
      (a.removeCookie = function (c, h) {
        return void 0 !== a.cookie(c)
          ? (a.cookie(c, "", a.extend({}, h, { expires: -1 })), !0)
          : !1;
      });
  }),
  "undefined" == typeof JSON &&
    (JSON = (function () {
      var m = {
          "\b": "\\b",
          "	": "\\t",
          "\n": "\\n",
          "\f": "\\f",
          "\r": "\\r",
          '"': '\\"',
          "\\": "\\\\",
        },
        s = {
          boolean: function (x) {
            return String(x);
          },
          number: function (x) {
            return isFinite(x) ? String(x) : "null";
          },
          string: function (x) {
            return (
              /["\\\x00-\x1f]/.test(x) &&
                (x = x.replace(/([\x00-\x1f\\"])/g, function (a, c) {
                  var h = m[c];
                  return h
                    ? h
                    : ((h = c.charCodeAt()),
                      "\\u00" +
                        Math.floor(h / 16).toString(16) +
                        (h % 16).toString(16));
                })),
              '"' + x + '"'
            );
          },
          object: function (x) {
            if (x) {
              var a,
                f,
                i,
                l,
                c,
                h = [];
              if (x instanceof Array) {
                for (h[0] = "[", l = x.length, i = 0; l > i; i += 1)
                  (c = x[i]),
                    (f = s[typeof c]),
                    f &&
                      ((c = f(c)),
                      "string" == typeof c &&
                        (a && (h[h.length] = ","),
                        (h[h.length] = c),
                        (a = !0)));
                h[h.length] = "]";
              } else {
                if (!(x instanceof Object)) return;
                h[0] = "{";
                for (i in x)
                  (c = x[i]),
                    (f = s[typeof c]),
                    f &&
                      ((c = f(c)),
                      "string" == typeof c &&
                        (a && (h[h.length] = ","),
                        h.push(s.string(i), ":", c),
                        (a = !0)));
                h[h.length] = "}";
              }
              return h.join("");
            }
            return "null";
          },
        };
      return {
        stringify: function (a) {
          var f = s[typeof a];
          return f && ((a = f(a)), "string" == typeof a) ? a : null;
        },
        parse: function (text) {
          try {
            return (
              !/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(
                text.replace(/"(\\.|[^"\\])*"/g, "")
              ) && eval("(" + text + ")")
            );
          } catch (e) {
            return !1;
          }
        },
      };
    })()),
  (function () {
    for (
      var a,
        c = function () {},
        h = [
          "assert",
          "clear",
          "count",
          "debug",
          "dir",
          "dirxml",
          "error",
          "exception",
          "group",
          "groupCollapsed",
          "groupEnd",
          "info",
          "log",
          "markTimeline",
          "profile",
          "profileEnd",
          "table",
          "time",
          "timeEnd",
          "timeline",
          "timelineEnd",
          "timeStamp",
          "trace",
          "warn",
        ],
        g = h.length,
        v = (window.console = window.console || {});
      g--;

    )
      (a = h[g]), v[a] || (v[a] = c);
    String.prototype.trim = function () {
      return this.replace(/^s+|s+$/g, "");
    };
  })();
var Namespace = (function (a) {
  var c = function (a) {
      return "object" == typeof a && a.sort ? a : new Array(a);
    },
    h = function (c) {
      var h = arguments[1] || !1,
        g = a;
      if ("" != c)
        for (
          var v = c.split(Namespace.separator), i = 0, y = v.length;
          y > i;
          i++
        )
          g[v[i]] || (g[v[i]] = {}), (g = g[v[i]]);
      if (h) for (var b in h) g[b] = h[b];
      return g;
    };
  return (
    (h.use = function (g, v) {
      for (
        var y = v ? a : {}, b = c(g), i = (arguments[1] || !1, 0), w = b.length;
        w > i;
        i++
      ) {
        g = b[i];
        var T = g.split(Namespace.separator),
          C = T.pop(),
          S = h(T.join(Namespace.separator));
        if ("*" == C) for (var E in S) y[E] = S[E];
        else S[C] && (y[C] = S[C]);
      }
      return y;
    }),
    h
  );
})(window);
$.ajaxSetup({ cache: !0 }),
  (Namespace.separator = "."),
  "undefined" != typeof console && (console.log = function () {});
