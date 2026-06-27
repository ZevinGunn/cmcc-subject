(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["1405"],
  {
    85469() {},
    73156() {},
    70120() {},
    79878() {},
    74546(t, e, n) {
      "use strict";
      var r = n(43941),
        o = n(22153),
        i = n(46683);
      e.A = function (t, e, n) {
        void 0 === n && (n = {});
        var s = n.enable,
          u = void 0 === s || s,
          c = (0, r.A)(e);
        (0, i.A)(
          function () {
            if (u) {
              var e = (0, o.e)(n.target, window);
              if (null == e ? void 0 : e.addEventListener) {
                var r = function (t) {
                    return c.current(t);
                  },
                  i = Array.isArray(t) ? t : [t];
                return (
                  i.forEach(function (t) {
                    e.addEventListener(t, r, {
                      capture: n.capture,
                      once: n.once,
                      passive: n.passive,
                    });
                  }),
                  function () {
                    i.forEach(function (t) {
                      e.removeEventListener(t, r, { capture: n.capture });
                    });
                  }
                );
              }
            }
          },
          [t, n.capture, n.once, n.passive, u],
          n.target
        );
      };
    },
    18843(t, e, n) {
      "use strict";
      var r = n(5482),
        o = (n(50258), n(41486)),
        i = n(22153),
        s = n(46683);
      e.A = function (t, e) {
        var n = e || {},
          u = n.callback,
          c = (0, r.__rest)(n, ["callback"]),
          a = (0, r.__read)((0, o.useState)(), 2),
          h = a[0],
          l = a[1],
          f = (0, r.__read)((0, o.useState)(), 2),
          d = f[0],
          v = f[1];
        return (
          (0, s.A)(
            function () {
              var n = (Array.isArray(t) ? t : [t])
                .map(function (t) {
                  return (0, i.e)(t);
                })
                .filter(Boolean);
              if (n.length) {
                var o = new IntersectionObserver(function (t) {
                  var e, n;
                  try {
                    for (
                      var o = (0, r.__values)(t), i = o.next();
                      !i.done;
                      i = o.next()
                    ) {
                      var s = i.value;
                      v(s.intersectionRatio),
                        l(s.isIntersecting),
                        null == u || u(s);
                    }
                  } catch (t) {
                    e = { error: t };
                  } finally {
                    try {
                      i && !i.done && (n = o.return) && n.call(o);
                    } finally {
                      if (e) throw e.error;
                    }
                  }
                }, (0,
                r.__assign)((0, r.__assign)({}, c), { root: (0, i.e)(null == e ? void 0 : e.root) }));
                return (
                  n.forEach(function (t) {
                    return o.observe(t);
                  }),
                  function () {
                    o.disconnect();
                  }
                );
              }
            },
            [
              null == e ? void 0 : e.rootMargin,
              null == e ? void 0 : e.threshold,
              u,
            ],
            t
          ),
          [h, d]
        );
      };
    },
    53487(t, e, n) {
      "use strict";
      var r = n(41486),
        o = n(54670),
        i = n(64176);
      e.A = function (t, e, n) {
        void 0 === n && (n = {});
        var s = (0, o.A)(t),
          u = (0, r.useRef)(null),
          c = (0, r.useCallback)(function () {
            u.current && clearInterval(u.current);
          }, []);
        return (
          (0, r.useEffect)(
            function () {
              if ((0, i.Et)(e) && !(e < 0))
                return n.immediate && s(), (u.current = setInterval(s, e)), c;
            },
            [e, n.immediate]
          ),
          c
        );
      };
    },
    17148(t, e, n) {
      "use strict";
      n.d(e, { A: () => f });
      var r = n(5482),
        o = n(41486),
        i = n(74546),
        s = n(54670),
        u = n(67738),
        c = n(64176),
        a = "AHOOKS_SYNC_STORAGE_EVENT_NAME";
      var h,
        l = n(28700),
        f =
          ((h = function () {
            return l.A ? sessionStorage : void 0;
          }),
          function (t, e) {
            var n;
            void 0 === e && (e = {});
            var l = e.listenStorageChange,
              f = void 0 !== l && l,
              d = e.onError,
              v = void 0 === d ? function (t) {} : d;
            try {
              n = h();
            } catch (t) {
              v(t);
            }
            function p() {
              try {
                var r = null == n ? void 0 : n.getItem(t);
                if (r)
                  return (
                    (o = r), e.deserializer ? e.deserializer(o) : JSON.parse(o)
                  );
              } catch (t) {
                v(t);
              }
              var o;
              return (0, c.Tn)(e.defaultValue)
                ? e.defaultValue()
                : e.defaultValue;
            }
            var g = (0, r.__read)((0, o.useState)(p), 2),
              m = g[0],
              _ = g[1];
            (0, u.A)(
              function () {
                _(p());
              },
              [t]
            );
            var b = function (e) {
              e.key === t && e.storageArea === n && _(p());
            };
            return (
              (0, i.A)("storage", b, { enable: f }),
              (0, i.A)(
                a,
                function (t) {
                  b(t.detail);
                },
                { enable: f }
              ),
              [
                m,
                (0, s.A)(function (r) {
                  var o = (0, c.Tn)(r) ? r(m) : r;
                  f || _(o);
                  try {
                    var i = void 0,
                      s = null == n ? void 0 : n.getItem(t);
                    (0, c.XB)(o)
                      ? ((i = null), null == n || n.removeItem(t))
                      : ((i = (function (t) {
                          return e.serializer
                            ? e.serializer(t)
                            : JSON.stringify(t);
                        })(o)),
                        null == n || n.setItem(t, i)),
                      dispatchEvent(
                        new CustomEvent(a, {
                          detail: {
                            key: t,
                            newValue: i,
                            oldValue: s,
                            storageArea: n,
                          },
                        })
                      );
                  } catch (t) {
                    v(t);
                  }
                }),
              ]
            );
          });
    },
    66314(t, e, n) {
      "use strict";
      var r = n(5482),
        o = n(80462),
        i = n.n(o),
        s = n(41486),
        u = n(43941),
        c = n(4958),
        a = n(64176),
        h = n(3299);
      e.A = function (t, e) {
        var n;
        h.A && (0, a.Tn)(t);
        var o = (0, u.A)(t),
          l =
            null !== (n = null == e ? void 0 : e.wait) && void 0 !== n
              ? n
              : 1e3,
          f = (0, s.useMemo)(function () {
            return i()(
              function () {
                for (var t = [], e = 0; e < arguments.length; e++)
                  t[e] = arguments[e];
                return o.current.apply(
                  o,
                  (0, r.__spreadArray)([], (0, r.__read)(t), !1)
                );
              },
              l,
              e
            );
          }, []);
        return (
          (0, c.A)(function () {
            f.cancel();
          }),
          { run: f, cancel: f.cancel, flush: f.flush }
        );
      };
    },
    23614(t, e, n) {
      "use strict";
      var r = n(41486),
        o = n(4958),
        i = n(56522),
        s = n(22153);
      e.A = function (t) {
        return function (e, n, u) {
          var c = (0, r.useRef)(!1),
            a = (0, r.useRef)([]),
            h = (0, r.useRef)([]),
            l = (0, r.useRef)();
          t(function () {
            var t,
              r = (Array.isArray(u) ? u : [u]).map(function (t) {
                return (0, s.e)(t);
              });
            if (!c.current)
              return (
                (c.current = !0),
                (a.current = r),
                (h.current = n),
                void (l.current = e())
              );
            (r.length === a.current.length &&
              (0, i.A)(a.current, r) &&
              (0, i.A)(h.current, n)) ||
              (null === (t = l.current) || void 0 === t || t.call(l),
              (a.current = r),
              (h.current = n),
              (l.current = e()));
          }),
            (0, o.A)(function () {
              var t;
              null === (t = l.current) || void 0 === t || t.call(l),
                (c.current = !1);
            });
        };
      };
    },
    22153(t, e, n) {
      "use strict";
      n.d(e, { e: () => i });
      var r = n(64176),
        o = n(28700);
      function i(t, e) {
        if (o.A)
          return t ? ((0, r.Tn)(t) ? t() : "current" in t ? t.current : t) : e;
      }
    },
    46683(t, e, n) {
      "use strict";
      var r = n(41486),
        o = (0, n(23614).A)(r.useEffect);
      e.A = o;
    },
    50258() {
      !(function () {
        "use strict";
        if ("object" == typeof window)
          if (
            "IntersectionObserver" in window &&
            "IntersectionObserverEntry" in window &&
            "intersectionRatio" in window.IntersectionObserverEntry.prototype
          )
            "isIntersecting" in window.IntersectionObserverEntry.prototype ||
              Object.defineProperty(
                window.IntersectionObserverEntry.prototype,
                "isIntersecting",
                {
                  get: function () {
                    return this.intersectionRatio > 0;
                  },
                }
              );
          else {
            var t = (function (t) {
                for (var e = window.document, n = o(e); n; )
                  n = o((e = n.ownerDocument));
                return e;
              })(),
              e = [],
              n = null,
              r = null;
            (s.prototype.THROTTLE_TIMEOUT = 100),
              (s.prototype.POLL_INTERVAL = null),
              (s.prototype.USE_MUTATION_OBSERVER = !0),
              (s._setupCrossOriginUpdater = function () {
                return (
                  n ||
                    (n = function (t, n) {
                      (r =
                        t && n
                          ? l(t, n)
                          : {
                              top: 0,
                              bottom: 0,
                              left: 0,
                              right: 0,
                              width: 0,
                              height: 0,
                            }),
                        e.forEach(function (t) {
                          t._checkForIntersections();
                        });
                    }),
                  n
                );
              }),
              (s._resetCrossOriginUpdater = function () {
                (n = null), (r = null);
              }),
              (s.prototype.observe = function (t) {
                if (
                  !this._observationTargets.some(function (e) {
                    return e.element == t;
                  })
                ) {
                  if (!t || 1 != t.nodeType)
                    throw new Error("target must be an Element");
                  this._registerInstance(),
                    this._observationTargets.push({ element: t, entry: null }),
                    this._monitorIntersections(t.ownerDocument),
                    this._checkForIntersections();
                }
              }),
              (s.prototype.unobserve = function (t) {
                (this._observationTargets = this._observationTargets.filter(
                  function (e) {
                    return e.element != t;
                  }
                )),
                  this._unmonitorIntersections(t.ownerDocument),
                  0 == this._observationTargets.length &&
                    this._unregisterInstance();
              }),
              (s.prototype.disconnect = function () {
                (this._observationTargets = []),
                  this._unmonitorAllIntersections(),
                  this._unregisterInstance();
              }),
              (s.prototype.takeRecords = function () {
                var t = this._queuedEntries.slice();
                return (this._queuedEntries = []), t;
              }),
              (s.prototype._initThresholds = function (t) {
                var e = t || [0];
                return (
                  Array.isArray(e) || (e = [e]),
                  e.sort().filter(function (t, e, n) {
                    if ("number" != typeof t || isNaN(t) || t < 0 || t > 1)
                      throw new Error(
                        "threshold must be a number between 0 and 1 inclusively"
                      );
                    return t !== n[e - 1];
                  })
                );
              }),
              (s.prototype._parseRootMargin = function (t) {
                var e = (t || "0px").split(/\s+/).map(function (t) {
                  var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
                  if (!e)
                    throw new Error(
                      "rootMargin must be specified in pixels or percent"
                    );
                  return { value: parseFloat(e[1]), unit: e[2] };
                });
                return (
                  (e[1] = e[1] || e[0]),
                  (e[2] = e[2] || e[0]),
                  (e[3] = e[3] || e[1]),
                  e
                );
              }),
              (s.prototype._monitorIntersections = function (e) {
                var n = e.defaultView;
                if (n && -1 == this._monitoringDocuments.indexOf(e)) {
                  var r = this._checkForIntersections,
                    i = null,
                    s = null;
                  this.POLL_INTERVAL
                    ? (i = n.setInterval(r, this.POLL_INTERVAL))
                    : (u(n, "resize", r, !0),
                      u(e, "scroll", r, !0),
                      this.USE_MUTATION_OBSERVER &&
                        "MutationObserver" in n &&
                        (s = new n.MutationObserver(r)).observe(e, {
                          attributes: !0,
                          childList: !0,
                          characterData: !0,
                          subtree: !0,
                        })),
                    this._monitoringDocuments.push(e),
                    this._monitoringUnsubscribes.push(function () {
                      var t = e.defaultView;
                      t && (i && t.clearInterval(i), c(t, "resize", r, !0)),
                        c(e, "scroll", r, !0),
                        s && s.disconnect();
                    });
                  var a =
                    (this.root && (this.root.ownerDocument || this.root)) || t;
                  if (e != a) {
                    var h = o(e);
                    h && this._monitorIntersections(h.ownerDocument);
                  }
                }
              }),
              (s.prototype._unmonitorIntersections = function (e) {
                var n = this._monitoringDocuments.indexOf(e);
                if (-1 != n) {
                  var r =
                      (this.root && (this.root.ownerDocument || this.root)) ||
                      t,
                    i = this._observationTargets.some(function (t) {
                      var n = t.element.ownerDocument;
                      if (n == e) return !0;
                      for (; n && n != r; ) {
                        var i = o(n);
                        if ((n = i && i.ownerDocument) == e) return !0;
                      }
                      return !1;
                    });
                  if (!i) {
                    var s = this._monitoringUnsubscribes[n];
                    if (
                      (this._monitoringDocuments.splice(n, 1),
                      this._monitoringUnsubscribes.splice(n, 1),
                      s(),
                      e != r)
                    ) {
                      var u = o(e);
                      u && this._unmonitorIntersections(u.ownerDocument);
                    }
                  }
                }
              }),
              (s.prototype._unmonitorAllIntersections = function () {
                var t = this._monitoringUnsubscribes.slice(0);
                (this._monitoringDocuments.length = 0),
                  (this._monitoringUnsubscribes.length = 0);
                for (var e = 0; e < t.length; e++) t[e]();
              }),
              (s.prototype._checkForIntersections = function () {
                if (this.root || !n || r) {
                  var t = this._rootIsInDom(),
                    e = t
                      ? this._getRootRect()
                      : {
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          width: 0,
                          height: 0,
                        };
                  this._observationTargets.forEach(function (r) {
                    var o = r.element,
                      s = a(o),
                      u = this._rootContainsTarget(o),
                      c = r.entry,
                      h =
                        t &&
                        u &&
                        this._computeTargetAndRootIntersection(o, s, e),
                      l = null;
                    this._rootContainsTarget(o)
                      ? (n && !this.root) || (l = e)
                      : (l = {
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          width: 0,
                          height: 0,
                        });
                    var f = (r.entry = new i({
                      time:
                        window.performance &&
                        performance.now &&
                        performance.now(),
                      target: o,
                      boundingClientRect: s,
                      rootBounds: l,
                      intersectionRect: h,
                    }));
                    c
                      ? t && u
                        ? this._hasCrossedThreshold(c, f) &&
                          this._queuedEntries.push(f)
                        : c && c.isIntersecting && this._queuedEntries.push(f)
                      : this._queuedEntries.push(f);
                  }, this),
                    this._queuedEntries.length &&
                      this._callback(this.takeRecords(), this);
                }
              }),
              (s.prototype._computeTargetAndRootIntersection = function (
                e,
                o,
                i
              ) {
                if ("none" != window.getComputedStyle(e).display) {
                  for (
                    var s, u, c, h, f, v, p, g, m = o, _ = d(e), b = !1;
                    !b && _;

                  ) {
                    var w = null,
                      y = 1 == _.nodeType ? window.getComputedStyle(_) : {};
                    if ("none" == y.display) return null;
                    if (_ == this.root || 9 == _.nodeType)
                      if (((b = !0), _ == this.root || _ == t))
                        n && !this.root
                          ? !r || (0 == r.width && 0 == r.height)
                            ? ((_ = null), (w = null), (m = null))
                            : (w = r)
                          : (w = i);
                      else {
                        var E = d(_),
                          I = E && a(E),
                          T =
                            E &&
                            this._computeTargetAndRootIntersection(E, I, i);
                        I && T
                          ? ((_ = E), (w = l(I, T)))
                          : ((_ = null), (m = null));
                      }
                    else {
                      var A = _.ownerDocument;
                      _ != A.body &&
                        _ != A.documentElement &&
                        "visible" != y.overflow &&
                        (w = a(_));
                    }
                    if (
                      (w &&
                        ((s = w),
                        (u = m),
                        (c = void 0),
                        (h = void 0),
                        (f = void 0),
                        (v = void 0),
                        (p = void 0),
                        (g = void 0),
                        (c = Math.max(s.top, u.top)),
                        (h = Math.min(s.bottom, u.bottom)),
                        (f = Math.max(s.left, u.left)),
                        (v = Math.min(s.right, u.right)),
                        (g = h - c),
                        (m =
                          ((p = v - f) >= 0 &&
                            g >= 0 && {
                              top: c,
                              bottom: h,
                              left: f,
                              right: v,
                              width: p,
                              height: g,
                            }) ||
                          null)),
                      !m)
                    )
                      break;
                    _ = _ && d(_);
                  }
                  return m;
                }
              }),
              (s.prototype._getRootRect = function () {
                var e;
                if (this.root && !v(this.root)) e = a(this.root);
                else {
                  var n = v(this.root) ? this.root : t,
                    r = n.documentElement,
                    o = n.body;
                  e = {
                    top: 0,
                    left: 0,
                    right: r.clientWidth || o.clientWidth,
                    width: r.clientWidth || o.clientWidth,
                    bottom: r.clientHeight || o.clientHeight,
                    height: r.clientHeight || o.clientHeight,
                  };
                }
                return this._expandRectByRootMargin(e);
              }),
              (s.prototype._expandRectByRootMargin = function (t) {
                var e = this._rootMarginValues.map(function (e, n) {
                    return "px" == e.unit
                      ? e.value
                      : (e.value * (n % 2 ? t.width : t.height)) / 100;
                  }),
                  n = {
                    top: t.top - e[0],
                    right: t.right + e[1],
                    bottom: t.bottom + e[2],
                    left: t.left - e[3],
                  };
                return (
                  (n.width = n.right - n.left), (n.height = n.bottom - n.top), n
                );
              }),
              (s.prototype._hasCrossedThreshold = function (t, e) {
                var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
                  r = e.isIntersecting ? e.intersectionRatio || 0 : -1;
                if (n !== r)
                  for (var o = 0; o < this.thresholds.length; o++) {
                    var i = this.thresholds[o];
                    if (i == n || i == r || i < n != i < r) return !0;
                  }
              }),
              (s.prototype._rootIsInDom = function () {
                return !this.root || f(t, this.root);
              }),
              (s.prototype._rootContainsTarget = function (e) {
                var n =
                  (this.root && (this.root.ownerDocument || this.root)) || t;
                return f(n, e) && (!this.root || n == e.ownerDocument);
              }),
              (s.prototype._registerInstance = function () {
                e.indexOf(this) < 0 && e.push(this);
              }),
              (s.prototype._unregisterInstance = function () {
                var t = e.indexOf(this);
                -1 != t && e.splice(t, 1);
              }),
              (window.IntersectionObserver = s),
              (window.IntersectionObserverEntry = i);
          }
        function o(t) {
          try {
            return (t.defaultView && t.defaultView.frameElement) || null;
          } catch (t) {
            return null;
          }
        }
        function i(t) {
          (this.time = t.time),
            (this.target = t.target),
            (this.rootBounds = h(t.rootBounds)),
            (this.boundingClientRect = h(t.boundingClientRect)),
            (this.intersectionRect = h(
              t.intersectionRect || {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: 0,
                height: 0,
              }
            )),
            (this.isIntersecting = !!t.intersectionRect);
          var e = this.boundingClientRect,
            n = e.width * e.height,
            r = this.intersectionRect,
            o = r.width * r.height;
          this.intersectionRatio = n
            ? Number((o / n).toFixed(4))
            : this.isIntersecting
            ? 1
            : 0;
        }
        function s(t, e) {
          var n,
            r,
            o,
            i = e || {};
          if ("function" != typeof t)
            throw new Error("callback must be a function");
          if (i.root && 1 != i.root.nodeType && 9 != i.root.nodeType)
            throw new Error("root must be a Document or Element");
          (this._checkForIntersections =
            ((n = this._checkForIntersections.bind(this)),
            (r = this.THROTTLE_TIMEOUT),
            (o = null),
            function () {
              o ||
                (o = setTimeout(function () {
                  n(), (o = null);
                }, r));
            })),
            (this._callback = t),
            (this._observationTargets = []),
            (this._queuedEntries = []),
            (this._rootMarginValues = this._parseRootMargin(i.rootMargin)),
            (this.thresholds = this._initThresholds(i.threshold)),
            (this.root = i.root || null),
            (this.rootMargin = this._rootMarginValues
              .map(function (t) {
                return t.value + t.unit;
              })
              .join(" ")),
            (this._monitoringDocuments = []),
            (this._monitoringUnsubscribes = []);
        }
        function u(t, e, n, r) {
          "function" == typeof t.addEventListener
            ? t.addEventListener(e, n, r || !1)
            : "function" == typeof t.attachEvent && t.attachEvent("on" + e, n);
        }
        function c(t, e, n, r) {
          "function" == typeof t.removeEventListener
            ? t.removeEventListener(e, n, r || !1)
            : "function" == typeof t.detachEvent && t.detachEvent("on" + e, n);
        }
        function a(t) {
          var e;
          try {
            e = t.getBoundingClientRect();
          } catch (t) {}
          return e
            ? ((e.width && e.height) ||
                (e = {
                  top: e.top,
                  right: e.right,
                  bottom: e.bottom,
                  left: e.left,
                  width: e.right - e.left,
                  height: e.bottom - e.top,
                }),
              e)
            : { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
        }
        function h(t) {
          return !t || "x" in t
            ? t
            : {
                top: t.top,
                y: t.top,
                bottom: t.bottom,
                left: t.left,
                x: t.left,
                right: t.right,
                width: t.width,
                height: t.height,
              };
        }
        function l(t, e) {
          var n = e.top - t.top,
            r = e.left - t.left;
          return {
            top: n,
            left: r,
            height: e.height,
            width: e.width,
            bottom: n + e.height,
            right: r + e.width,
          };
        }
        function f(t, e) {
          for (var n = e; n; ) {
            if (n == t) return !0;
            n = d(n);
          }
          return !1;
        }
        function d(e) {
          var n = e.parentNode;
          return 9 == e.nodeType && e != t
            ? o(e)
            : (n && n.assignedSlot && (n = n.assignedSlot.parentNode),
              n && 11 == n.nodeType && n.host ? n.host : n);
        }
        function v(t) {
          return t && 9 === t.nodeType;
        }
      })();
    },
  },
]);
