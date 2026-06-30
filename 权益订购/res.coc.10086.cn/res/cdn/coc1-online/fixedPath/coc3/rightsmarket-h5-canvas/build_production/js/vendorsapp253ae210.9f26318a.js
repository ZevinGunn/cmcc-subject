(window.webpackJsonp = window.webpackJsonp || []).push([
  ["vendors~app~253ae210"],
  {
    "00fd": function (t, e, i) {
      var r = i("9e69"),
        n = Object.prototype,
        s = n.hasOwnProperty,
        a = n.toString,
        o = r ? r.toStringTag : void 0;
      t.exports = function (t) {
        var e = s.call(t, o),
          i = t[o];
        try {
          t[o] = void 0;
          var r = !0;
        } catch (t) {}
        var n = a.call(t);
        return r && (e ? (t[o] = i) : delete t[o]), n;
      };
    },
    "0a06": function (t, e, i) {
      "use strict";
      var r = i("c532"),
        n = i("30b5"),
        s = i("f6b4"),
        a = i("5270"),
        o = i("4a7b");
      function h(t) {
        (this.defaults = t),
          (this.interceptors = { request: new s(), response: new s() });
      }
      (h.prototype.request = function (t) {
        "string" == typeof t
          ? ((t = arguments[1] || {}).url = arguments[0])
          : (t = t || {}),
          (t = o(this.defaults, t)).method
            ? (t.method = t.method.toLowerCase())
            : this.defaults.method
            ? (t.method = this.defaults.method.toLowerCase())
            : (t.method = "get");
        var e = [a, void 0],
          i = Promise.resolve(t);
        for (
          this.interceptors.request.forEach(function (t) {
            e.unshift(t.fulfilled, t.rejected);
          }),
            this.interceptors.response.forEach(function (t) {
              e.push(t.fulfilled, t.rejected);
            });
          e.length;

        )
          i = i.then(e.shift(), e.shift());
        return i;
      }),
        (h.prototype.getUri = function (t) {
          return (
            (t = o(this.defaults, t)),
            n(t.url, t.params, t.paramsSerializer).replace(/^\?/, "")
          );
        }),
        r.forEach(["delete", "get", "head", "options"], function (t) {
          h.prototype[t] = function (e, i) {
            return this.request(r.merge(i || {}, { method: t, url: e }));
          };
        }),
        r.forEach(["post", "put", "patch"], function (t) {
          h.prototype[t] = function (e, i, n) {
            return this.request(
              r.merge(n || {}, { method: t, url: e, data: i })
            );
          };
        }),
        (t.exports = h);
    },
    "0c18": function (t, e, i) {
      "use strict";
      function r(t) {
        if (null == t) return window;
        if ("[object Window]" !== t.toString()) {
          var e = t.ownerDocument;
          return (e && e.defaultView) || window;
        }
        return t;
      }
      function n(t) {
        return t instanceof r(t).Element || t instanceof Element;
      }
      function s(t) {
        return t instanceof r(t).HTMLElement || t instanceof HTMLElement;
      }
      function a(t) {
        return (
          "undefined" != typeof ShadowRoot &&
          (t instanceof r(t).ShadowRoot || t instanceof ShadowRoot)
        );
      }
      i.d(e, "a", function () {
        return B;
      }),
        i.d(e, "b", function () {
          return V;
        });
      var o = Math.round;
      function h() {
        var t = navigator.userAgentData;
        return null != t && t.brands
          ? t.brands
              .map(function (t) {
                return t.brand + "/" + t.version;
              })
              .join(" ")
          : navigator.userAgent;
      }
      function l(t, e, i) {
        void 0 === e && (e = !1), void 0 === i && (i = !1);
        var a = t.getBoundingClientRect(),
          l = 1,
          f = 1;
        e &&
          s(t) &&
          ((l = (t.offsetWidth > 0 && o(a.width) / t.offsetWidth) || 1),
          (f = (t.offsetHeight > 0 && o(a.height) / t.offsetHeight) || 1));
        var c = (n(t) ? r(t) : window).visualViewport,
          u = !!/^((?!chrome|android).)*safari/i.test(h()) && i,
          p = (a.left + (u && c ? c.offsetLeft : 0)) / l,
          d = (a.top + (u && c ? c.offsetTop : 0)) / f,
          m = a.width / l,
          g = a.height / f;
        return {
          width: m,
          height: g,
          top: d,
          right: p + m,
          bottom: d + g,
          left: p,
          x: p,
          y: d,
        };
      }
      function f(t) {
        var e = r(t);
        return { scrollLeft: e.pageXOffset, scrollTop: e.pageYOffset };
      }
      function c(t) {
        return t ? (t.nodeName || "").toLowerCase() : null;
      }
      function u(t) {
        return ((n(t) ? t.ownerDocument : t.document) || window.document)
          .documentElement;
      }
      function p(t) {
        return r(t).getComputedStyle(t);
      }
      function d(t) {
        var e = p(t),
          i = e.overflow,
          r = e.overflowX,
          n = e.overflowY;
        return /auto|scroll|overlay|hidden/.test(i + n + r);
      }
      function m(t, e, i) {
        void 0 === i && (i = !1);
        var n,
          a,
          h = s(e),
          p =
            s(e) &&
            (function (t) {
              var e = t.getBoundingClientRect(),
                i = o(e.width) / t.offsetWidth || 1,
                r = o(e.height) / t.offsetHeight || 1;
              return 1 !== i || 1 !== r;
            })(e),
          m = u(e),
          g = l(t, p, i),
          y = { scrollLeft: 0, scrollTop: 0 },
          v = { x: 0, y: 0 };
        return (
          (h || (!h && !i)) &&
            (("body" !== c(e) || d(m)) &&
              (y =
                (n = e) !== r(n) && s(n)
                  ? { scrollLeft: (a = n).scrollLeft, scrollTop: a.scrollTop }
                  : f(n)),
            s(e)
              ? (((v = l(e, !0)).x += e.clientLeft), (v.y += e.clientTop))
              : m &&
                (v.x = (function (t) {
                  return l(u(t)).left + f(t).scrollLeft;
                })(m))),
          {
            x: g.left + y.scrollLeft - v.x,
            y: g.top + y.scrollTop - v.y,
            width: g.width,
            height: g.height,
          }
        );
      }
      function g(t) {
        return "html" === c(t)
          ? t
          : t.assignedSlot || t.parentNode || (a(t) ? t.host : null) || u(t);
      }
      function y(t, e) {
        var i;
        void 0 === e && (e = []);
        var n = (function t(e) {
            return ["html", "body", "#document"].indexOf(c(e)) >= 0
              ? e.ownerDocument.body
              : s(e) && d(e)
              ? e
              : t(g(e));
          })(t),
          a = n === (null == (i = t.ownerDocument) ? void 0 : i.body),
          o = r(n),
          h = a ? [o].concat(o.visualViewport || [], d(n) ? n : []) : n,
          l = e.concat(h);
        return a ? l : l.concat(y(g(h)));
      }
      function v(t) {
        return ["table", "td", "th"].indexOf(c(t)) >= 0;
      }
      function b(t) {
        return s(t) && "fixed" !== p(t).position ? t.offsetParent : null;
      }
      function _(t) {
        for (var e = r(t), i = b(t); i && v(i) && "static" === p(i).position; )
          i = b(i);
        return i &&
          ("html" === c(i) || ("body" === c(i) && "static" === p(i).position))
          ? e
          : i ||
              (function (t) {
                var e = /firefox/i.test(h());
                if (/Trident/i.test(h()) && s(t) && "fixed" === p(t).position)
                  return null;
                var i = g(t);
                for (
                  a(i) && (i = i.host);
                  s(i) && ["html", "body"].indexOf(c(i)) < 0;

                ) {
                  var r = p(i);
                  if (
                    "none" !== r.transform ||
                    "none" !== r.perspective ||
                    "paint" === r.contain ||
                    -1 !== ["transform", "perspective"].indexOf(r.willChange) ||
                    (e && "filter" === r.willChange) ||
                    (e && r.filter && "none" !== r.filter)
                  )
                    return i;
                  i = i.parentNode;
                }
                return null;
              })(t) ||
              e;
      }
      var w = "top",
        A = "right",
        x = "left",
        S = [].concat([w, "bottom", A, x], ["auto"]).reduce(function (t, e) {
          return t.concat([e, e + "-start", e + "-end"]);
        }, []),
        k = [
          "beforeRead",
          "read",
          "afterRead",
          "beforeMain",
          "main",
          "afterMain",
          "beforeWrite",
          "write",
          "afterWrite",
        ];
      function E(t) {
        var e = new Map(),
          i = new Set(),
          r = [];
        return (
          t.forEach(function (t) {
            e.set(t.name, t);
          }),
          t.forEach(function (t) {
            i.has(t.name) ||
              (function t(n) {
                i.add(n.name),
                  []
                    .concat(n.requires || [], n.requiresIfExists || [])
                    .forEach(function (r) {
                      if (!i.has(r)) {
                        var n = e.get(r);
                        n && t(n);
                      }
                    }),
                  r.push(n);
              })(t);
          }),
          r
        );
      }
      function P(t) {
        for (
          var e = arguments.length, i = new Array(e > 1 ? e - 1 : 0), r = 1;
          r < e;
          r++
        )
          i[r - 1] = arguments[r];
        return [].concat(i).reduce(function (t, e) {
          return t.replace(/%s/, e);
        }, t);
      }
      var C =
          'Popper: modifier "%s" provided an invalid %s property, expected %s but got %s',
        D = ["name", "enabled", "phase", "fn", "effect", "requires", "options"];
      function M(t) {
        return t.split("-")[0];
      }
      function T(t) {
        return t.split("-")[1];
      }
      var F =
          "Popper: Invalid reference or popper argument provided. They must be either a DOM element or virtual element.",
        O = { placement: "bottom", modifiers: [], strategy: "absolute" };
      function L() {
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
          e[i] = arguments[i];
        return !e.some(function (t) {
          return !(t && "function" == typeof t.getBoundingClientRect);
        });
      }
      function I(t) {
        void 0 === t && (t = {});
        var e = t,
          i = e.defaultModifiers,
          r = void 0 === i ? [] : i,
          s = e.defaultOptions,
          a = void 0 === s ? O : s;
        return function (t, e, i) {
          void 0 === i && (i = a);
          var s,
            o,
            h = {
              placement: "bottom",
              orderedModifiers: [],
              options: Object.assign({}, O, a),
              modifiersData: {},
              elements: { reference: t, popper: e },
              attributes: {},
              styles: {},
            },
            f = [],
            c = !1,
            u = {
              state: h,
              setOptions: function (i) {
                var s = "function" == typeof i ? i(h.options) : i;
                d(),
                  (h.options = Object.assign({}, a, h.options, s)),
                  (h.scrollParents = {
                    reference: n(t)
                      ? y(t)
                      : t.contextElement
                      ? y(t.contextElement)
                      : [],
                    popper: y(e),
                  });
                var o = (function (t) {
                  var e = E(t);
                  return k.reduce(function (t, i) {
                    return t.concat(
                      e.filter(function (t) {
                        return t.phase === i;
                      })
                    );
                  }, []);
                })(
                  (function (t) {
                    var e = t.reduce(function (t, e) {
                      var i = t[e.name];
                      return (
                        (t[e.name] = i
                          ? Object.assign({}, i, e, {
                              options: Object.assign({}, i.options, e.options),
                              data: Object.assign({}, i.data, e.data),
                            })
                          : e),
                        t
                      );
                    }, {});
                    return Object.keys(e).map(function (t) {
                      return e[t];
                    });
                  })([].concat(r, h.options.modifiers))
                );
                (h.orderedModifiers = o.filter(function (t) {
                  return t.enabled;
                })),
                  (function (t) {
                    t.forEach(function (e) {
                      []
                        .concat(Object.keys(e), D)
                        .filter(function (t, e, i) {
                          return i.indexOf(t) === e;
                        })
                        .forEach(function (i) {
                          switch (i) {
                            case "name":
                              "string" != typeof e.name &&
                                console.error(
                                  P(
                                    C,
                                    String(e.name),
                                    '"name"',
                                    '"string"',
                                    '"' + String(e.name) + '"'
                                  )
                                );
                              break;
                            case "enabled":
                              "boolean" != typeof e.enabled &&
                                console.error(
                                  P(
                                    C,
                                    e.name,
                                    '"enabled"',
                                    '"boolean"',
                                    '"' + String(e.enabled) + '"'
                                  )
                                );
                              break;
                            case "phase":
                              k.indexOf(e.phase) < 0 &&
                                console.error(
                                  P(
                                    C,
                                    e.name,
                                    '"phase"',
                                    "either " + k.join(", "),
                                    '"' + String(e.phase) + '"'
                                  )
                                );
                              break;
                            case "fn":
                              "function" != typeof e.fn &&
                                console.error(
                                  P(
                                    C,
                                    e.name,
                                    '"fn"',
                                    '"function"',
                                    '"' + String(e.fn) + '"'
                                  )
                                );
                              break;
                            case "effect":
                              null != e.effect &&
                                "function" != typeof e.effect &&
                                console.error(
                                  P(
                                    C,
                                    e.name,
                                    '"effect"',
                                    '"function"',
                                    '"' + String(e.fn) + '"'
                                  )
                                );
                              break;
                            case "requires":
                              null == e.requires ||
                                Array.isArray(e.requires) ||
                                console.error(
                                  P(
                                    C,
                                    e.name,
                                    '"requires"',
                                    '"array"',
                                    '"' + String(e.requires) + '"'
                                  )
                                );
                              break;
                            case "requiresIfExists":
                              Array.isArray(e.requiresIfExists) ||
                                console.error(
                                  P(
                                    C,
                                    e.name,
                                    '"requiresIfExists"',
                                    '"array"',
                                    '"' + String(e.requiresIfExists) + '"'
                                  )
                                );
                              break;
                            case "options":
                            case "data":
                              break;
                            default:
                              console.error(
                                'PopperJS: an invalid property has been provided to the "' +
                                  e.name +
                                  '" modifier, valid properties are ' +
                                  D.map(function (t) {
                                    return '"' + t + '"';
                                  }).join(", ") +
                                  '; but "' +
                                  i +
                                  '" was provided.'
                              );
                          }
                          e.requires &&
                            e.requires.forEach(function (i) {
                              null ==
                                t.find(function (t) {
                                  return t.name === i;
                                }) &&
                                console.error(
                                  P(
                                    'Popper: modifier "%s" requires "%s", but "%s" modifier is not available',
                                    String(e.name),
                                    i,
                                    i
                                  )
                                );
                            });
                        });
                    });
                  })(
                    ((l = [].concat(o, h.options.modifiers)),
                    (c = function (t) {
                      return t.name;
                    }),
                    (m = new Set()),
                    l.filter(function (t) {
                      var e = c(t);
                      if (!m.has(e)) return m.add(e), !0;
                    }))
                  ),
                  "auto" === M(h.options.placement) &&
                    (h.orderedModifiers.find(function (t) {
                      return "flip" === t.name;
                    }) ||
                      console.error(
                        [
                          'Popper: "auto" placements require the "flip" modifier be',
                          "present and enabled to work.",
                        ].join(" ")
                      ));
                var l,
                  c,
                  m,
                  g = p(e);
                return (
                  [
                    g.marginTop,
                    g.marginRight,
                    g.marginBottom,
                    g.marginLeft,
                  ].some(function (t) {
                    return parseFloat(t);
                  }) &&
                    console.warn(
                      [
                        'Popper: CSS "margin" styles cannot be used to apply padding',
                        "between the popper and its reference element or boundary.",
                        "To replicate margin, use the `offset` modifier, as well as",
                        "the `padding` option in the `preventOverflow` and `flip`",
                        "modifiers.",
                      ].join(" ")
                    ),
                  h.orderedModifiers.forEach(function (t) {
                    var e = t.name,
                      i = t.options,
                      r = void 0 === i ? {} : i,
                      n = t.effect;
                    if ("function" == typeof n) {
                      var s = n({ state: h, name: e, instance: u, options: r });
                      f.push(s || function () {});
                    }
                  }),
                  u.update()
                );
              },
              forceUpdate: function () {
                if (!c) {
                  var t = h.elements,
                    e = t.reference,
                    i = t.popper;
                  if (L(e, i)) {
                    var r, n, s, a;
                    (h.rects = {
                      reference: m(e, _(i), "fixed" === h.options.strategy),
                      popper:
                        ((r = i),
                        (n = l(r)),
                        (s = r.offsetWidth),
                        (a = r.offsetHeight),
                        Math.abs(n.width - s) <= 1 && (s = n.width),
                        Math.abs(n.height - a) <= 1 && (a = n.height),
                        {
                          x: r.offsetLeft,
                          y: r.offsetTop,
                          width: s,
                          height: a,
                        }),
                    }),
                      (h.reset = !1),
                      (h.placement = h.options.placement),
                      h.orderedModifiers.forEach(function (t) {
                        return (h.modifiersData[t.name] = Object.assign(
                          {},
                          t.data
                        ));
                      });
                    for (var o = 0, f = 0; f < h.orderedModifiers.length; f++) {
                      if ((o += 1) > 100) {
                        console.error(
                          "Popper: An infinite loop in the modifiers cycle has been detected! The cycle has been interrupted to prevent a browser crash."
                        );
                        break;
                      }
                      if (!0 !== h.reset) {
                        var p = h.orderedModifiers[f],
                          d = p.fn,
                          g = p.options,
                          y = void 0 === g ? {} : g,
                          v = p.name;
                        "function" == typeof d &&
                          (h =
                            d({ state: h, options: y, name: v, instance: u }) ||
                            h);
                      } else (h.reset = !1), (f = -1);
                    }
                  } else console.error(F);
                }
              },
              update:
                ((s = function () {
                  return new Promise(function (t) {
                    u.forceUpdate(), t(h);
                  });
                }),
                function () {
                  return (
                    o ||
                      (o = new Promise(function (t) {
                        Promise.resolve().then(function () {
                          (o = void 0), t(s());
                        });
                      })),
                    o
                  );
                }),
              destroy: function () {
                d(), (c = !0);
              },
            };
          if (!L(t, e)) return console.error(F), u;
          function d() {
            f.forEach(function (t) {
              return t();
            }),
              (f = []);
          }
          return (
            u.setOptions(i).then(function (t) {
              !c && i.onFirstUpdate && i.onFirstUpdate(t);
            }),
            u
          );
        };
      }
      var R = { passive: !0 };
      var j = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
      function N(t) {
        var e,
          i = t.popper,
          n = t.popperRect,
          s = t.placement,
          a = t.variation,
          h = t.offsets,
          l = t.position,
          f = t.gpuAcceleration,
          c = t.adaptive,
          d = t.roundOffsets,
          m = t.isFixed,
          g = h.x,
          y = void 0 === g ? 0 : g,
          v = h.y,
          b = void 0 === v ? 0 : v,
          S = "function" == typeof d ? d({ x: y, y: b }) : { x: y, y: b };
        (y = S.x), (b = S.y);
        var k = h.hasOwnProperty("x"),
          E = h.hasOwnProperty("y"),
          P = x,
          C = w,
          D = window;
        if (c) {
          var M = _(i),
            T = "clientHeight",
            F = "clientWidth";
          if (
            (M === r(i) &&
              "static" !== p((M = u(i))).position &&
              "absolute" === l &&
              ((T = "scrollHeight"), (F = "scrollWidth")),
            (M = M),
            s === w || ((s === x || s === A) && "end" === a))
          )
            (C = "bottom"),
              (b -=
                (m && M === D && D.visualViewport
                  ? D.visualViewport.height
                  : M[T]) - n.height),
              (b *= f ? 1 : -1);
          if (s === x || ((s === w || "bottom" === s) && "end" === a))
            (P = A),
              (y -=
                (m && M === D && D.visualViewport
                  ? D.visualViewport.width
                  : M[F]) - n.width),
              (y *= f ? 1 : -1);
        }
        var O,
          L = Object.assign({ position: l }, c && j),
          I =
            !0 === d
              ? (function (t) {
                  var e = t.x,
                    i = t.y,
                    r = window.devicePixelRatio || 1;
                  return { x: o(e * r) / r || 0, y: o(i * r) / r || 0 };
                })({ x: y, y: b })
              : { x: y, y: b };
        return (
          (y = I.x),
          (b = I.y),
          f
            ? Object.assign(
                {},
                L,
                (((O = {})[C] = E ? "0" : ""),
                (O[P] = k ? "0" : ""),
                (O.transform =
                  (D.devicePixelRatio || 1) <= 1
                    ? "translate(" + y + "px, " + b + "px)"
                    : "translate3d(" + y + "px, " + b + "px, 0)"),
                O)
              )
            : Object.assign(
                {},
                L,
                (((e = {})[C] = E ? b + "px" : ""),
                (e[P] = k ? y + "px" : ""),
                (e.transform = ""),
                e)
              )
        );
      }
      var B = I({
        defaultModifiers: [
          {
            name: "eventListeners",
            enabled: !0,
            phase: "write",
            fn: function () {},
            effect: function (t) {
              var e = t.state,
                i = t.instance,
                n = t.options,
                s = n.scroll,
                a = void 0 === s || s,
                o = n.resize,
                h = void 0 === o || o,
                l = r(e.elements.popper),
                f = [].concat(
                  e.scrollParents.reference,
                  e.scrollParents.popper
                );
              return (
                a &&
                  f.forEach(function (t) {
                    t.addEventListener("scroll", i.update, R);
                  }),
                h && l.addEventListener("resize", i.update, R),
                function () {
                  a &&
                    f.forEach(function (t) {
                      t.removeEventListener("scroll", i.update, R);
                    }),
                    h && l.removeEventListener("resize", i.update, R);
                }
              );
            },
            data: {},
          },
          {
            name: "popperOffsets",
            enabled: !0,
            phase: "read",
            fn: function (t) {
              var e = t.state,
                i = t.name;
              e.modifiersData[i] = (function (t) {
                var e,
                  i = t.reference,
                  r = t.element,
                  n = t.placement,
                  s = n ? M(n) : null,
                  a = n ? T(n) : null,
                  o = i.x + i.width / 2 - r.width / 2,
                  h = i.y + i.height / 2 - r.height / 2;
                switch (s) {
                  case w:
                    e = { x: o, y: i.y - r.height };
                    break;
                  case "bottom":
                    e = { x: o, y: i.y + i.height };
                    break;
                  case A:
                    e = { x: i.x + i.width, y: h };
                    break;
                  case x:
                    e = { x: i.x - r.width, y: h };
                    break;
                  default:
                    e = { x: i.x, y: i.y };
                }
                var l = s
                  ? (function (t) {
                      return ["top", "bottom"].indexOf(t) >= 0 ? "x" : "y";
                    })(s)
                  : null;
                if (null != l) {
                  var f = "y" === l ? "height" : "width";
                  switch (a) {
                    case "start":
                      e[l] = e[l] - (i[f] / 2 - r[f] / 2);
                      break;
                    case "end":
                      e[l] = e[l] + (i[f] / 2 - r[f] / 2);
                  }
                }
                return e;
              })({
                reference: e.rects.reference,
                element: e.rects.popper,
                strategy: "absolute",
                placement: e.placement,
              });
            },
            data: {},
          },
          {
            name: "computeStyles",
            enabled: !0,
            phase: "beforeWrite",
            fn: function (t) {
              var e = t.state,
                i = t.options,
                r = i.gpuAcceleration,
                n = void 0 === r || r,
                s = i.adaptive,
                a = void 0 === s || s,
                o = i.roundOffsets,
                h = void 0 === o || o,
                l = p(e.elements.popper).transitionProperty || "";
              a &&
                ["transform", "top", "right", "bottom", "left"].some(function (
                  t
                ) {
                  return l.indexOf(t) >= 0;
                }) &&
                console.warn(
                  [
                    "Popper: Detected CSS transitions on at least one of the following",
                    'CSS properties: "transform", "top", "right", "bottom", "left".',
                    "\n\n",
                    'Disable the "computeStyles" modifier\'s `adaptive` option to allow',
                    "for smooth transitions, or remove these properties from the CSS",
                    "transition declaration on the popper element if only transitioning",
                    "opacity or background-color for example.",
                    "\n\n",
                    "We recommend using the popper element as a wrapper around an inner",
                    "element that can have any CSS property transitioned for animations.",
                  ].join(" ")
                );
              var f = {
                placement: M(e.placement),
                variation: T(e.placement),
                popper: e.elements.popper,
                popperRect: e.rects.popper,
                gpuAcceleration: n,
                isFixed: "fixed" === e.options.strategy,
              };
              null != e.modifiersData.popperOffsets &&
                (e.styles.popper = Object.assign(
                  {},
                  e.styles.popper,
                  N(
                    Object.assign({}, f, {
                      offsets: e.modifiersData.popperOffsets,
                      position: e.options.strategy,
                      adaptive: a,
                      roundOffsets: h,
                    })
                  )
                )),
                null != e.modifiersData.arrow &&
                  (e.styles.arrow = Object.assign(
                    {},
                    e.styles.arrow,
                    N(
                      Object.assign({}, f, {
                        offsets: e.modifiersData.arrow,
                        position: "absolute",
                        adaptive: !1,
                        roundOffsets: h,
                      })
                    )
                  )),
                (e.attributes.popper = Object.assign({}, e.attributes.popper, {
                  "data-popper-placement": e.placement,
                }));
            },
            data: {},
          },
          {
            name: "applyStyles",
            enabled: !0,
            phase: "write",
            fn: function (t) {
              var e = t.state;
              Object.keys(e.elements).forEach(function (t) {
                var i = e.styles[t] || {},
                  r = e.attributes[t] || {},
                  n = e.elements[t];
                s(n) &&
                  c(n) &&
                  (Object.assign(n.style, i),
                  Object.keys(r).forEach(function (t) {
                    var e = r[t];
                    !1 === e
                      ? n.removeAttribute(t)
                      : n.setAttribute(t, !0 === e ? "" : e);
                  }));
              });
            },
            effect: function (t) {
              var e = t.state,
                i = {
                  popper: {
                    position: e.options.strategy,
                    left: "0",
                    top: "0",
                    margin: "0",
                  },
                  arrow: { position: "absolute" },
                  reference: {},
                };
              return (
                Object.assign(e.elements.popper.style, i.popper),
                (e.styles = i),
                e.elements.arrow &&
                  Object.assign(e.elements.arrow.style, i.arrow),
                function () {
                  Object.keys(e.elements).forEach(function (t) {
                    var r = e.elements[t],
                      n = e.attributes[t] || {},
                      a = Object.keys(
                        e.styles.hasOwnProperty(t) ? e.styles[t] : i[t]
                      ).reduce(function (t, e) {
                        return (t[e] = ""), t;
                      }, {});
                    s(r) &&
                      c(r) &&
                      (Object.assign(r.style, a),
                      Object.keys(n).forEach(function (t) {
                        r.removeAttribute(t);
                      }));
                  });
                }
              );
            },
            requires: ["computeStyles"],
          },
        ],
      });
      var V = {
        name: "offset",
        enabled: !0,
        phase: "main",
        requires: ["popperOffsets"],
        fn: function (t) {
          var e = t.state,
            i = t.options,
            r = t.name,
            n = i.offset,
            s = void 0 === n ? [0, 0] : n,
            a = S.reduce(function (t, i) {
              return (
                (t[i] = (function (t, e, i) {
                  var r = M(t),
                    n = [x, w].indexOf(r) >= 0 ? -1 : 1,
                    s =
                      "function" == typeof i
                        ? i(Object.assign({}, e, { placement: t }))
                        : i,
                    a = s[0],
                    o = s[1];
                  return (
                    (a = a || 0),
                    (o = (o || 0) * n),
                    [x, A].indexOf(r) >= 0 ? { x: o, y: a } : { x: a, y: o }
                  );
                })(i, e.rects, s)),
                t
              );
            }, {}),
            o = a[e.placement],
            h = o.x,
            l = o.y;
          null != e.modifiersData.popperOffsets &&
            ((e.modifiersData.popperOffsets.x += h),
            (e.modifiersData.popperOffsets.y += l)),
            (e.modifiersData[r] = a);
        },
      };
    },
    "0c7c": function (t, e, i) {
      "use strict";
      function r(t, e, i, r, n, s, a, o) {
        var h,
          l = "function" == typeof t ? t.options : t;
        if (
          (e && ((l.render = e), (l.staticRenderFns = i), (l._compiled = !0)),
          r && (l.functional = !0),
          s && (l._scopeId = "data-v-" + s),
          a
            ? ((h = function (t) {
                (t =
                  t ||
                  (this.$vnode && this.$vnode.ssrContext) ||
                  (this.parent &&
                    this.parent.$vnode &&
                    this.parent.$vnode.ssrContext)) ||
                  "undefined" == typeof __VUE_SSR_CONTEXT__ ||
                  (t = __VUE_SSR_CONTEXT__),
                  n && n.call(this, t),
                  t &&
                    t._registeredComponents &&
                    t._registeredComponents.add(a);
              }),
              (l._ssrRegister = h))
            : n &&
              (h = o
                ? function () {
                    n.call(
                      this,
                      (l.functional ? this.parent : this).$root.$options
                        .shadowRoot
                    );
                  }
                : n),
          h)
        )
          if (l.functional) {
            l._injectStyles = h;
            var f = l.render;
            l.render = function (t, e) {
              return h.call(e), f(t, e);
            };
          } else {
            var c = l.beforeCreate;
            l.beforeCreate = c ? [].concat(c, h) : [h];
          }
        return { exports: t, options: l };
      }
      i.d(e, "a", function () {
        return r;
      });
    },
    "0df6": function (t, e, i) {
      "use strict";
      t.exports = function (t) {
        return function (e) {
          return t.apply(null, e);
        };
      };
    },
    "0f32": function (t, e, i) {
      var r = i("b047"),
        n = i("1a8c");
      t.exports = function (t, e, i) {
        var s = !0,
          a = !0;
        if ("function" != typeof t) throw new TypeError("Expected a function");
        return (
          n(i) &&
            ((s = "leading" in i ? !!i.leading : s),
            (a = "trailing" in i ? !!i.trailing : a)),
          r(t, e, { leading: s, maxWait: e, trailing: a })
        );
      };
    },
    1310: function (t, e) {
      t.exports = function (t) {
        return null != t && "object" == typeof t;
      };
    },
    "1a8c": function (t, e) {
      t.exports = function (t) {
        var e = typeof t;
        return null != t && ("object" == e || "function" == e);
      };
    },
    "1d2b": function (t, e, i) {
      "use strict";
      t.exports = function (t, e) {
        return function () {
          for (var i = new Array(arguments.length), r = 0; r < i.length; r++)
            i[r] = arguments[r];
          return t.apply(e, i);
        };
      };
    },
    2444: function (t, e, i) {
      "use strict";
      (function (e) {
        var r = i("c532"),
          n = i("c8af"),
          s = { "Content-Type": "application/x-www-form-urlencoded" };
        function a(t, e) {
          !r.isUndefined(t) &&
            r.isUndefined(t["Content-Type"]) &&
            (t["Content-Type"] = e);
        }
        var o,
          h = {
            adapter:
              (("undefined" != typeof XMLHttpRequest ||
                (void 0 !== e &&
                  "[object process]" === Object.prototype.toString.call(e))) &&
                (o = i("b50d")),
              o),
            transformRequest: [
              function (t, e) {
                return (
                  n(e, "Accept"),
                  n(e, "Content-Type"),
                  r.isFormData(t) ||
                  r.isArrayBuffer(t) ||
                  r.isBuffer(t) ||
                  r.isStream(t) ||
                  r.isFile(t) ||
                  r.isBlob(t)
                    ? t
                    : r.isArrayBufferView(t)
                    ? t.buffer
                    : r.isURLSearchParams(t)
                    ? (a(e, "application/x-www-form-urlencoded;charset=utf-8"),
                      t.toString())
                    : r.isObject(t)
                    ? (a(e, "application/json;charset=utf-8"),
                      JSON.stringify(t))
                    : t
                );
              },
            ],
            transformResponse: [
              function (t) {
                if ("string" == typeof t)
                  try {
                    t = JSON.parse(t);
                  } catch (t) {}
                return t;
              },
            ],
            timeout: 0,
            xsrfCookieName: "XSRF-TOKEN",
            xsrfHeaderName: "X-XSRF-TOKEN",
            maxContentLength: -1,
            validateStatus: function (t) {
              return t >= 200 && t < 300;
            },
          };
        (h.headers = {
          common: { Accept: "application/json, text/plain, */*" },
        }),
          r.forEach(["delete", "get", "head"], function (t) {
            h.headers[t] = {};
          }),
          r.forEach(["post", "put", "patch"], function (t) {
            h.headers[t] = r.merge(s);
          }),
          (t.exports = h);
      }.call(this, i("4362")));
    },
    2638: function (t, e, i) {
      "use strict";
      function r() {
        return (r = Object.assign
          ? Object.assign.bind()
          : function (t) {
              for (var e, i = 1; i < arguments.length; i++)
                for (var r in (e = arguments[i]))
                  Object.prototype.hasOwnProperty.call(e, r) && (t[r] = e[r]);
              return t;
            }).apply(this, arguments);
      }
      var n = ["attrs", "props", "domProps"],
        s = ["class", "style", "directives"],
        a = ["on", "nativeOn"],
        o = function (t, e) {
          return function () {
            t && t.apply(this, arguments), e && e.apply(this, arguments);
          };
        };
      t.exports = function (t) {
        return t.reduce(function (t, e) {
          for (var i in e)
            if (t[i])
              if (-1 !== n.indexOf(i)) t[i] = r({}, t[i], e[i]);
              else if (-1 !== s.indexOf(i)) {
                var h = t[i] instanceof Array ? t[i] : [t[i]],
                  l = e[i] instanceof Array ? e[i] : [e[i]];
                t[i] = [].concat(h, l);
              } else if (-1 !== a.indexOf(i))
                for (var f in e[i])
                  if (t[i][f]) {
                    var c = t[i][f] instanceof Array ? t[i][f] : [t[i][f]],
                      u = e[i][f] instanceof Array ? e[i][f] : [e[i][f]];
                    t[i][f] = [].concat(c, u);
                  } else t[i][f] = e[i][f];
              else if ("hook" === i)
                for (var p in e[i])
                  t[i][p] = t[i][p] ? o(t[i][p], e[i][p]) : e[i][p];
              else t[i] = e[i];
            else t[i] = e[i];
          return t;
        }, {});
      };
    },
    "27ae": function (t, e, i) {
      (function (i) {
        var r;
        !(function (i, n) {
          t.exports = (function (i) {
            "use strict";
            var n,
              s = (i = i || {}).Base64,
              a =
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
              o = (function (t) {
                for (var e = {}, i = 0, r = t.length; i < r; i++)
                  e[t.charAt(i)] = i;
                return e;
              })(a),
              h = String.fromCharCode,
              l = function (t) {
                if (t.length < 2)
                  return (e = t.charCodeAt(0)) < 128
                    ? t
                    : e < 2048
                    ? h(192 | (e >>> 6)) + h(128 | (63 & e))
                    : h(224 | ((e >>> 12) & 15)) +
                      h(128 | ((e >>> 6) & 63)) +
                      h(128 | (63 & e));
                var e =
                  65536 +
                  1024 * (t.charCodeAt(0) - 55296) +
                  (t.charCodeAt(1) - 56320);
                return (
                  h(240 | ((e >>> 18) & 7)) +
                  h(128 | ((e >>> 12) & 63)) +
                  h(128 | ((e >>> 6) & 63)) +
                  h(128 | (63 & e))
                );
              },
              f = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
              c = function (t) {
                return t.replace(f, l);
              },
              u = function (t) {
                var e = [0, 2, 1][t.length % 3],
                  i =
                    (t.charCodeAt(0) << 16) |
                    ((t.length > 1 ? t.charCodeAt(1) : 0) << 8) |
                    (t.length > 2 ? t.charCodeAt(2) : 0);
                return [
                  a.charAt(i >>> 18),
                  a.charAt((i >>> 12) & 63),
                  e >= 2 ? "=" : a.charAt((i >>> 6) & 63),
                  e >= 1 ? "=" : a.charAt(63 & i),
                ].join("");
              },
              p =
                i.btoa && "function" == typeof i.btoa
                  ? function (t) {
                      return i.btoa(t);
                    }
                  : function (t) {
                      if (t.match(/[^\x00-\xFF]/))
                        throw new RangeError(
                          "The string contains invalid characters."
                        );
                      return t.replace(/[\s\S]{1,3}/g, u);
                    },
              d = function (t) {
                return p(c(String(t)));
              },
              m = function (t) {
                return t
                  .replace(/[+\/]/g, function (t) {
                    return "+" == t ? "-" : "_";
                  })
                  .replace(/=/g, "");
              },
              g = function (t, e) {
                return e ? m(d(t)) : d(t);
              };
            i.Uint8Array &&
              (n = function (t, e) {
                for (var i = "", r = 0, n = t.length; r < n; r += 3) {
                  var s = t[r],
                    o = t[r + 1],
                    h = t[r + 2],
                    l = (s << 16) | (o << 8) | h;
                  i +=
                    a.charAt(l >>> 18) +
                    a.charAt((l >>> 12) & 63) +
                    (void 0 !== o ? a.charAt((l >>> 6) & 63) : "=") +
                    (void 0 !== h ? a.charAt(63 & l) : "=");
                }
                return e ? m(i) : i;
              });
            var y,
              v =
                /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g,
              b = function (t) {
                switch (t.length) {
                  case 4:
                    var e =
                      (((7 & t.charCodeAt(0)) << 18) |
                        ((63 & t.charCodeAt(1)) << 12) |
                        ((63 & t.charCodeAt(2)) << 6) |
                        (63 & t.charCodeAt(3))) -
                      65536;
                    return h(55296 + (e >>> 10)) + h(56320 + (1023 & e));
                  case 3:
                    return h(
                      ((15 & t.charCodeAt(0)) << 12) |
                        ((63 & t.charCodeAt(1)) << 6) |
                        (63 & t.charCodeAt(2))
                    );
                  default:
                    return h(
                      ((31 & t.charCodeAt(0)) << 6) | (63 & t.charCodeAt(1))
                    );
                }
              },
              _ = function (t) {
                return t.replace(v, b);
              },
              w = function (t) {
                var e = t.length,
                  i = e % 4,
                  r =
                    (e > 0 ? o[t.charAt(0)] << 18 : 0) |
                    (e > 1 ? o[t.charAt(1)] << 12 : 0) |
                    (e > 2 ? o[t.charAt(2)] << 6 : 0) |
                    (e > 3 ? o[t.charAt(3)] : 0),
                  n = [h(r >>> 16), h((r >>> 8) & 255), h(255 & r)];
                return (n.length -= [0, 0, 2, 1][i]), n.join("");
              },
              A =
                i.atob && "function" == typeof i.atob
                  ? function (t) {
                      return i.atob(t);
                    }
                  : function (t) {
                      return t.replace(/\S{1,4}/g, w);
                    },
              x = function (t) {
                return A(String(t).replace(/[^A-Za-z0-9\+\/]/g, ""));
              },
              S = function (t) {
                return String(t)
                  .replace(/[-_]/g, function (t) {
                    return "-" == t ? "+" : "/";
                  })
                  .replace(/[^A-Za-z0-9\+\/]/g, "");
              },
              k = function (t) {
                return (function (t) {
                  return _(A(t));
                })(S(t));
              };
            i.Uint8Array &&
              (y = function (t) {
                return Uint8Array.from(x(S(t)), function (t) {
                  return t.charCodeAt(0);
                });
              });
            var E = function () {
              var t = i.Base64;
              return (i.Base64 = s), t;
            };
            if (
              ((i.Base64 = {
                VERSION: "2.6.4",
                atob: x,
                btoa: p,
                fromBase64: k,
                toBase64: g,
                utob: c,
                encode: g,
                encodeURI: function (t) {
                  return g(t, !0);
                },
                btou: _,
                decode: k,
                noConflict: E,
                fromUint8Array: n,
                toUint8Array: y,
              }),
              "function" == typeof Object.defineProperty)
            ) {
              var P = function (t) {
                return {
                  value: t,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                };
              };
              i.Base64.extendString = function () {
                Object.defineProperty(
                  String.prototype,
                  "fromBase64",
                  P(function () {
                    return k(this);
                  })
                ),
                  Object.defineProperty(
                    String.prototype,
                    "toBase64",
                    P(function (t) {
                      return g(this, t);
                    })
                  ),
                  Object.defineProperty(
                    String.prototype,
                    "toBase64URI",
                    P(function () {
                      return g(this, !0);
                    })
                  );
              };
            }
            i.Meteor && (Base64 = i.Base64);
            t.exports
              ? (t.exports.Base64 = i.Base64)
              : void 0 ===
                  (r = function () {
                    return i.Base64;
                  }.apply(e, [])) || (t.exports = r);
            return { Base64: i.Base64 };
          })(i);
        })(
          "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : void 0 !== i
            ? i
            : this
        );
      }.call(this, i("c8ba")));
    },
    "29f3": function (t, e) {
      var i = Object.prototype.toString;
      t.exports = function (t) {
        return i.call(t);
      };
    },
    "2b3e": function (t, e, i) {
      var r = i("585a"),
        n = "object" == typeof self && self && self.Object === Object && self,
        s = r || n || Function("return this")();
      t.exports = s;
    },
    "2d83": function (t, e, i) {
      "use strict";
      var r = i("387f");
      t.exports = function (t, e, i, n, s) {
        var a = new Error(t);
        return r(a, e, i, n, s);
      };
    },
    "2e67": function (t, e, i) {
      "use strict";
      t.exports = function (t) {
        return !(!t || !t.__CANCEL__);
      };
    },
    "30b5": function (t, e, i) {
      "use strict";
      var r = i("c532");
      function n(t) {
        return encodeURIComponent(t)
          .replace(/%40/gi, "@")
          .replace(/%3A/gi, ":")
          .replace(/%24/g, "$")
          .replace(/%2C/gi, ",")
          .replace(/%20/g, "+")
          .replace(/%5B/gi, "[")
          .replace(/%5D/gi, "]");
      }
      t.exports = function (t, e, i) {
        if (!e) return t;
        var s;
        if (i) s = i(e);
        else if (r.isURLSearchParams(e)) s = e.toString();
        else {
          var a = [];
          r.forEach(e, function (t, e) {
            null != t &&
              (r.isArray(t) ? (e += "[]") : (t = [t]),
              r.forEach(t, function (t) {
                r.isDate(t)
                  ? (t = t.toISOString())
                  : r.isObject(t) && (t = JSON.stringify(t)),
                  a.push(n(e) + "=" + n(t));
              }));
          }),
            (s = a.join("&"));
        }
        if (s) {
          var o = t.indexOf("#");
          -1 !== o && (t = t.slice(0, o)),
            (t += (-1 === t.indexOf("?") ? "?" : "&") + s);
        }
        return t;
      };
    },
    3729: function (t, e, i) {
      var r = i("9e69"),
        n = i("00fd"),
        s = i("29f3"),
        a = r ? r.toStringTag : void 0;
      t.exports = function (t) {
        return null == t
          ? void 0 === t
            ? "[object Undefined]"
            : "[object Null]"
          : a && a in Object(t)
          ? n(t)
          : s(t);
      };
    },
    "387f": function (t, e, i) {
      "use strict";
      t.exports = function (t, e, i, r, n) {
        return (
          (t.config = e),
          i && (t.code = i),
          (t.request = r),
          (t.response = n),
          (t.isAxiosError = !0),
          (t.toJSON = function () {
            return {
              message: this.message,
              name: this.name,
              description: this.description,
              number: this.number,
              fileName: this.fileName,
              lineNumber: this.lineNumber,
              columnNumber: this.columnNumber,
              stack: this.stack,
              config: this.config,
              code: this.code,
            };
          }),
          t
        );
      };
    },
    3934: function (t, e, i) {
      "use strict";
      var r = i("c532");
      t.exports = r.isStandardBrowserEnv()
        ? (function () {
            var t,
              e = /(msie|trident)/i.test(navigator.userAgent),
              i = document.createElement("a");
            function n(t) {
              var r = t;
              return (
                e && (i.setAttribute("href", r), (r = i.href)),
                i.setAttribute("href", r),
                {
                  href: i.href,
                  protocol: i.protocol ? i.protocol.replace(/:$/, "") : "",
                  host: i.host,
                  search: i.search ? i.search.replace(/^\?/, "") : "",
                  hash: i.hash ? i.hash.replace(/^#/, "") : "",
                  hostname: i.hostname,
                  port: i.port,
                  pathname:
                    "/" === i.pathname.charAt(0)
                      ? i.pathname
                      : "/" + i.pathname,
                }
              );
            }
            return (
              (t = n(window.location.href)),
              function (e) {
                var i = r.isString(e) ? n(e) : e;
                return i.protocol === t.protocol && i.host === t.host;
              }
            );
          })()
        : function () {
            return !0;
          };
    },
    "408c": function (t, e, i) {
      var r = i("2b3e");
      t.exports = function () {
        return r.Date.now();
      };
    },
    4127: function (t, e, i) {
      "use strict";
      var r = i("d233"),
        n = i("b313"),
        s = {
          brackets: function (t) {
            return t + "[]";
          },
          indices: function (t, e) {
            return t + "[" + e + "]";
          },
          repeat: function (t) {
            return t;
          },
        },
        a = Array.isArray,
        o = Array.prototype.push,
        h = function (t, e) {
          o.apply(t, a(e) ? e : [e]);
        },
        l = Date.prototype.toISOString,
        f = {
          delimiter: "&",
          encode: !0,
          encoder: r.encode,
          encodeValuesOnly: !1,
          serializeDate: function (t) {
            return l.call(t);
          },
          skipNulls: !1,
          strictNullHandling: !1,
        },
        c = function t(e, i, n, s, o, l, c, u, p, d, m, g) {
          var y = e;
          if (
            ("function" == typeof c
              ? (y = c(i, y))
              : y instanceof Date && (y = d(y)),
            null === y)
          ) {
            if (s) return l && !g ? l(i, f.encoder) : i;
            y = "";
          }
          if (
            "string" == typeof y ||
            "number" == typeof y ||
            "boolean" == typeof y ||
            r.isBuffer(y)
          )
            return l
              ? [m(g ? i : l(i, f.encoder)) + "=" + m(l(y, f.encoder))]
              : [m(i) + "=" + m(String(y))];
          var v,
            b = [];
          if (void 0 === y) return b;
          if (a(c)) v = c;
          else {
            var _ = Object.keys(y);
            v = u ? _.sort(u) : _;
          }
          for (var w = 0; w < v.length; ++w) {
            var A = v[w];
            (o && null === y[A]) ||
              (a(y)
                ? h(b, t(y[A], n(i, A), n, s, o, l, c, u, p, d, m, g))
                : h(
                    b,
                    t(
                      y[A],
                      i + (p ? "." + A : "[" + A + "]"),
                      n,
                      s,
                      o,
                      l,
                      c,
                      u,
                      p,
                      d,
                      m,
                      g
                    )
                  ));
          }
          return b;
        };
      t.exports = function (t, e) {
        var i = t,
          o = e ? r.assign({}, e) : {};
        if (
          null !== o.encoder &&
          void 0 !== o.encoder &&
          "function" != typeof o.encoder
        )
          throw new TypeError("Encoder has to be a function.");
        var l = void 0 === o.delimiter ? f.delimiter : o.delimiter,
          u =
            "boolean" == typeof o.strictNullHandling
              ? o.strictNullHandling
              : f.strictNullHandling,
          p = "boolean" == typeof o.skipNulls ? o.skipNulls : f.skipNulls,
          d = "boolean" == typeof o.encode ? o.encode : f.encode,
          m = "function" == typeof o.encoder ? o.encoder : f.encoder,
          g = "function" == typeof o.sort ? o.sort : null,
          y = void 0 !== o.allowDots && o.allowDots,
          v =
            "function" == typeof o.serializeDate
              ? o.serializeDate
              : f.serializeDate,
          b =
            "boolean" == typeof o.encodeValuesOnly
              ? o.encodeValuesOnly
              : f.encodeValuesOnly;
        if (void 0 === o.format) o.format = n.default;
        else if (!Object.prototype.hasOwnProperty.call(n.formatters, o.format))
          throw new TypeError("Unknown format option provided.");
        var _,
          w,
          A = n.formatters[o.format];
        "function" == typeof o.filter
          ? (i = (w = o.filter)("", i))
          : a(o.filter) && (_ = w = o.filter);
        var x,
          S = [];
        if ("object" != typeof i || null === i) return "";
        x =
          o.arrayFormat in s
            ? o.arrayFormat
            : "indices" in o
            ? o.indices
              ? "indices"
              : "repeat"
            : "indices";
        var k = s[x];
        _ || (_ = Object.keys(i)), g && _.sort(g);
        for (var E = 0; E < _.length; ++E) {
          var P = _[E];
          (p && null === i[P]) ||
            h(S, c(i[P], P, k, u, p, d ? m : null, w, g, y, v, A, b));
        }
        var C = S.join(l),
          D = !0 === o.addQueryPrefix ? "?" : "";
        return C.length > 0 ? D + C : "";
      };
    },
    4328: function (t, e, i) {
      "use strict";
      var r = i("4127"),
        n = i("9e6a"),
        s = i("b313");
      t.exports = { formats: s, parse: n, stringify: r };
    },
    4362: function (t, e, i) {
      var r, n;
      (e.nextTick = function (t) {
        var e = Array.prototype.slice.call(arguments);
        e.shift(),
          setTimeout(function () {
            t.apply(null, e);
          }, 0);
      }),
        (e.platform = e.arch = e.execPath = e.title = "browser"),
        (e.pid = 1),
        (e.browser = !0),
        (e.env = {}),
        (e.argv = []),
        (e.binding = function (t) {
          throw new Error("No such module. (Possibly not yet loaded)");
        }),
        (n = "/"),
        (e.cwd = function () {
          return n;
        }),
        (e.chdir = function (t) {
          r || (r = i("df7c")), (n = r.resolve(t, n));
        }),
        (e.exit =
          e.kill =
          e.umask =
          e.dlopen =
          e.uptime =
          e.memoryUsage =
          e.uvCounters =
            function () {}),
        (e.features = {});
    },
    4478: function (t, e, i) {
      "use strict";
      function r(t, e) {
        return (r = Object.setPrototypeOf
          ? Object.setPrototypeOf.bind()
          : function (t, e) {
              return (t.__proto__ = e), t;
            })(t, e);
      }
      function n() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
          return (
            Boolean.prototype.valueOf.call(
              Reflect.construct(Boolean, [], function () {})
            ),
            !0
          );
        } catch (t) {
          return !1;
        }
      }
      function s(t, e, i) {
        return (s = n()
          ? Reflect.construct.bind()
          : function (t, e, i) {
              var n = [null];
              n.push.apply(n, e);
              var s = new (Function.bind.apply(t, n))();
              return i && r(s, i.prototype), s;
            }).apply(null, arguments);
      }
      i.d(e, "a", function () {
        return s;
      });
    },
    "467f": function (t, e, i) {
      "use strict";
      var r = i("2d83");
      t.exports = function (t, e, i) {
        var n = i.config.validateStatus;
        !n || n(i.status)
          ? t(i)
          : e(
              r(
                "Request failed with status code " + i.status,
                i.config,
                null,
                i.request,
                i
              )
            );
      };
    },
    "48b1": function (t, e, i) {
      var r = null;
      const n =
          /(?:_|\\u005[Ff])(?:_|\\u005[Ff])(?:p|\\u0070)(?:r|\\u0072)(?:o|\\u006[Ff])(?:t|\\u0074)(?:o|\\u006[Ff])(?:_|\\u005[Ff])(?:_|\\u005[Ff])/,
        s =
          /(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)/;
      t.exports = function (t) {
        "use strict";
        var e = {
          strict: !1,
          storeAsString: !1,
          alwaysParseAsBig: !1,
          useNativeBigInt: !1,
          protoAction: "error",
          constructorAction: "error",
        };
        if (null != t) {
          if (
            (!0 === t.strict && (e.strict = !0),
            !0 === t.storeAsString && (e.storeAsString = !0),
            (e.alwaysParseAsBig =
              !0 === t.alwaysParseAsBig && t.alwaysParseAsBig),
            (e.useNativeBigInt = !0 === t.useNativeBigInt && t.useNativeBigInt),
            void 0 !== t.constructorAction)
          ) {
            if (
              "error" !== t.constructorAction &&
              "ignore" !== t.constructorAction &&
              "preserve" !== t.constructorAction
            )
              throw new Error(
                'Incorrect value for constructorAction option, must be "error", "ignore" or undefined but passed ' +
                  t.constructorAction
              );
            e.constructorAction = t.constructorAction;
          }
          if (void 0 !== t.protoAction) {
            if (
              "error" !== t.protoAction &&
              "ignore" !== t.protoAction &&
              "preserve" !== t.protoAction
            )
              throw new Error(
                'Incorrect value for protoAction option, must be "error", "ignore" or undefined but passed ' +
                  t.protoAction
              );
            e.protoAction = t.protoAction;
          }
        }
        var a,
          o,
          h,
          l,
          f = {
            '"': '"',
            "\\": "\\",
            "/": "/",
            b: "\b",
            f: "\f",
            n: "\n",
            r: "\r",
            t: "\t",
          },
          c = function (t) {
            throw { name: "SyntaxError", message: t, at: a, text: h };
          },
          u = function (t) {
            return (
              t && t !== o && c("Expected '" + t + "' instead of '" + o + "'"),
              (o = h.charAt(a)),
              (a += 1),
              o
            );
          },
          p = function () {
            var t,
              n = "";
            for ("-" === o && ((n = "-"), u("-")); o >= "0" && o <= "9"; )
              (n += o), u();
            if ("." === o) for (n += "."; u() && o >= "0" && o <= "9"; ) n += o;
            if ("e" === o || "E" === o)
              for (
                n += o, u(), ("-" !== o && "+" !== o) || ((n += o), u());
                o >= "0" && o <= "9";

              )
                (n += o), u();
            if (((t = +n), isFinite(t)))
              return (
                null == r && (r = i("901e")),
                n.length > 15
                  ? e.storeAsString
                    ? n
                    : e.useNativeBigInt
                    ? BigInt(n)
                    : new r(n)
                  : e.alwaysParseAsBig
                  ? e.useNativeBigInt
                    ? BigInt(t)
                    : new r(t)
                  : t
              );
            c("Bad number");
          },
          d = function () {
            var t,
              e,
              i,
              r = "";
            if ('"' === o)
              for (var n = a; u(); ) {
                if ('"' === o)
                  return a - 1 > n && (r += h.substring(n, a - 1)), u(), r;
                if ("\\" === o) {
                  if (
                    (a - 1 > n && (r += h.substring(n, a - 1)), u(), "u" === o)
                  ) {
                    for (
                      i = 0, e = 0;
                      e < 4 && ((t = parseInt(u(), 16)), isFinite(t));
                      e += 1
                    )
                      i = 16 * i + t;
                    r += String.fromCharCode(i);
                  } else {
                    if ("string" != typeof f[o]) break;
                    r += f[o];
                  }
                  n = a;
                }
              }
            c("Bad string");
          },
          m = function () {
            for (; o && o <= " "; ) u();
          };
        return (
          (l = function () {
            switch ((m(), o)) {
              case "{":
                return (function () {
                  var t,
                    i = Object.create(null);
                  if ("{" === o) {
                    if ((u("{"), m(), "}" === o)) return u("}"), i;
                    for (; o; ) {
                      if (
                        ((t = d()),
                        m(),
                        u(":"),
                        !0 === e.strict &&
                          Object.hasOwnProperty.call(i, t) &&
                          c('Duplicate key "' + t + '"'),
                        !0 === n.test(t)
                          ? "error" === e.protoAction
                            ? c("Object contains forbidden prototype property")
                            : "ignore" === e.protoAction
                            ? l()
                            : (i[t] = l())
                          : !0 === s.test(t)
                          ? "error" === e.constructorAction
                            ? c(
                                "Object contains forbidden constructor property"
                              )
                            : "ignore" === e.constructorAction
                            ? l()
                            : (i[t] = l())
                          : (i[t] = l()),
                        m(),
                        "}" === o)
                      )
                        return u("}"), i;
                      u(","), m();
                    }
                  }
                  c("Bad object");
                })();
              case "[":
                return (function () {
                  var t = [];
                  if ("[" === o) {
                    if ((u("["), m(), "]" === o)) return u("]"), t;
                    for (; o; ) {
                      if ((t.push(l()), m(), "]" === o)) return u("]"), t;
                      u(","), m();
                    }
                  }
                  c("Bad array");
                })();
              case '"':
                return d();
              case "-":
                return p();
              default:
                return o >= "0" && o <= "9"
                  ? p()
                  : (function () {
                      switch (o) {
                        case "t":
                          return u("t"), u("r"), u("u"), u("e"), !0;
                        case "f":
                          return u("f"), u("a"), u("l"), u("s"), u("e"), !1;
                        case "n":
                          return u("n"), u("u"), u("l"), u("l"), null;
                      }
                      c("Unexpected '" + o + "'");
                    })();
            }
          }),
          function (t, e) {
            var i;
            return (
              (h = t + ""),
              (a = 0),
              (o = " "),
              (i = l()),
              m(),
              o && c("Syntax error"),
              "function" == typeof e
                ? (function t(i, r) {
                    var n,
                      s = i[r];
                    return (
                      s &&
                        "object" == typeof s &&
                        Object.keys(s).forEach(function (e) {
                          void 0 !== (n = t(s, e)) ? (s[e] = n) : delete s[e];
                        }),
                      e.call(i, r, s)
                    );
                  })({ "": i }, "")
                : i
            );
          }
        );
      };
    },
    "4a7b": function (t, e, i) {
      "use strict";
      var r = i("c532");
      t.exports = function (t, e) {
        e = e || {};
        var i = {},
          n = ["url", "method", "params", "data"],
          s = ["headers", "auth", "proxy"],
          a = [
            "baseURL",
            "url",
            "transformRequest",
            "transformResponse",
            "paramsSerializer",
            "timeout",
            "withCredentials",
            "adapter",
            "responseType",
            "xsrfCookieName",
            "xsrfHeaderName",
            "onUploadProgress",
            "onDownloadProgress",
            "maxContentLength",
            "validateStatus",
            "maxRedirects",
            "httpAgent",
            "httpsAgent",
            "cancelToken",
            "socketPath",
          ];
        r.forEach(n, function (t) {
          void 0 !== e[t] && (i[t] = e[t]);
        }),
          r.forEach(s, function (n) {
            r.isObject(e[n])
              ? (i[n] = r.deepMerge(t[n], e[n]))
              : void 0 !== e[n]
              ? (i[n] = e[n])
              : r.isObject(t[n])
              ? (i[n] = r.deepMerge(t[n]))
              : void 0 !== t[n] && (i[n] = t[n]);
          }),
          r.forEach(a, function (r) {
            void 0 !== e[r] ? (i[r] = e[r]) : void 0 !== t[r] && (i[r] = t[r]);
          });
        var o = n.concat(s).concat(a),
          h = Object.keys(e).filter(function (t) {
            return -1 === o.indexOf(t);
          });
        return (
          r.forEach(h, function (r) {
            void 0 !== e[r] ? (i[r] = e[r]) : void 0 !== t[r] && (i[r] = t[r]);
          }),
          i
        );
      };
    },
    "4cef": function (t, e) {
      var i = /\s/;
      t.exports = function (t) {
        for (var e = t.length; e-- && i.test(t.charAt(e)); );
        return e;
      };
    },
    "502b": function (t, e, i) {
      var r = i("901e"),
        n = t.exports;
      !(function () {
        "use strict";
        var t,
          e,
          i,
          s =
            /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
          a = {
            "\b": "\\b",
            "\t": "\\t",
            "\n": "\\n",
            "\f": "\\f",
            "\r": "\\r",
            '"': '\\"',
            "\\": "\\\\",
          };
        function o(t) {
          return (
            (s.lastIndex = 0),
            s.test(t)
              ? '"' +
                t.replace(s, function (t) {
                  var e = a[t];
                  return "string" == typeof e
                    ? e
                    : "\\u" + ("0000" + t.charCodeAt(0).toString(16)).slice(-4);
                }) +
                '"'
              : '"' + t + '"'
          );
        }
        "function" != typeof n.stringify &&
          (n.stringify = function (n, s, a) {
            var h;
            if (((t = ""), (e = ""), "number" == typeof a))
              for (h = 0; h < a; h += 1) e += " ";
            else "string" == typeof a && (e = a);
            if (
              ((i = s),
              s &&
                "function" != typeof s &&
                ("object" != typeof s || "number" != typeof s.length))
            )
              throw new Error("JSON.stringify");
            return (function n(s, a) {
              var h,
                l,
                f,
                c,
                u,
                p = t,
                d = a[s],
                m = null != d && (d instanceof r || r.isBigNumber(d));
              switch (
                (d &&
                  "object" == typeof d &&
                  "function" == typeof d.toJSON &&
                  (d = d.toJSON(s)),
                "function" == typeof i && (d = i.call(a, s, d)),
                typeof d)
              ) {
                case "string":
                  return m ? d : o(d);
                case "number":
                  return isFinite(d) ? String(d) : "null";
                case "boolean":
                case "null":
                case "bigint":
                  return String(d);
                case "object":
                  if (!d) return "null";
                  if (
                    ((t += e),
                    (u = []),
                    "[object Array]" === Object.prototype.toString.apply(d))
                  ) {
                    for (c = d.length, h = 0; h < c; h += 1)
                      u[h] = n(h, d) || "null";
                    return (
                      (f =
                        0 === u.length
                          ? "[]"
                          : t
                          ? "[\n" + t + u.join(",\n" + t) + "\n" + p + "]"
                          : "[" + u.join(",") + "]"),
                      (t = p),
                      f
                    );
                  }
                  if (i && "object" == typeof i)
                    for (c = i.length, h = 0; h < c; h += 1)
                      "string" == typeof i[h] &&
                        (f = n((l = i[h]), d)) &&
                        u.push(o(l) + (t ? ": " : ":") + f);
                  else
                    Object.keys(d).forEach(function (e) {
                      var i = n(e, d);
                      i && u.push(o(e) + (t ? ": " : ":") + i);
                    });
                  return (
                    (f =
                      0 === u.length
                        ? "{}"
                        : t
                        ? "{\n" + t + u.join(",\n" + t) + "\n" + p + "}"
                        : "{" + u.join(",") + "}"),
                    (t = p),
                    f
                  );
              }
            })("", { "": n });
          });
      })();
    },
    5270: function (t, e, i) {
      "use strict";
      var r = i("c532"),
        n = i("c401"),
        s = i("2e67"),
        a = i("2444");
      function o(t) {
        t.cancelToken && t.cancelToken.throwIfRequested();
      }
      t.exports = function (t) {
        return (
          o(t),
          (t.headers = t.headers || {}),
          (t.data = n(t.data, t.headers, t.transformRequest)),
          (t.headers = r.merge(
            t.headers.common || {},
            t.headers[t.method] || {},
            t.headers
          )),
          r.forEach(
            ["delete", "get", "head", "post", "put", "patch", "common"],
            function (e) {
              delete t.headers[e];
            }
          ),
          (t.adapter || a.adapter)(t).then(
            function (e) {
              return (
                o(t), (e.data = n(e.data, e.headers, t.transformResponse)), e
              );
            },
            function (e) {
              return (
                s(e) ||
                  (o(t),
                  e &&
                    e.response &&
                    (e.response.data = n(
                      e.response.data,
                      e.response.headers,
                      t.transformResponse
                    ))),
                Promise.reject(e)
              );
            }
          )
        );
      };
    },
    "585a": function (t, e, i) {
      (function (e) {
        var i = "object" == typeof e && e && e.Object === Object && e;
        t.exports = i;
      }.call(this, i("c8ba")));
    },
    "6dc8": function (t, e, i) {
      "use strict";
      var r = i("d96e"),
        n = i.n(r);
      function s(t) {
        return Array.isArray(t);
      }
      function a(t) {
        return (
          "[object Object]" === ((e = t), Object.prototype.toString.call(e))
        );
        var e;
      }
      function o(t) {
        return "function" == typeof t;
      }
      var h = Object.prototype.hasOwnProperty;
      function l(t, e) {
        return h.call(t, e);
      }
      "function" == typeof Symbol && Symbol.for;
      var f = (function () {
          function t(t) {
            (this.options = t), !t.deferSetup && this.setup();
          }
          return (
            (t.prototype.setup = function () {
              var t, e;
              null === (e = (t = this.options).setup) ||
                void 0 === e ||
                e.call(t),
                (this.initialized = !0);
            }),
            (t.prototype.on = function () {
              var t, e;
              !this.initialized && this.setup(),
                null === (e = (t = this.options).match) ||
                  void 0 === e ||
                  e.call(t);
            }),
            (t.prototype.off = function () {
              var t, e;
              null === (e = (t = this.options).unmatch) ||
                void 0 === e ||
                e.call(t);
            }),
            (t.prototype.destroy = function () {
              this.options.destroy ? this.options.destroy() : this.off();
            }),
            (t.prototype.equals = function (t) {
              return this.options === t || this.options.match === t;
            }),
            t
          );
        })(),
        c = (function () {
          function t(t, e) {
            void 0 === e && (e = !1);
            var i = this;
            (this.query = t),
              (this.isUnconditional = e),
              (this.handlers = []),
              (this.mql = window.matchMedia(t)),
              (this.listener = function (t) {
                (i.mql = t.currentTarget || t), i.assess();
              }),
              this.mql.addListener(this.listener);
          }
          return (
            (t.prototype.addHandler = function (t) {
              var e = new f(t);
              this.handlers.push(e), this.matches() && e.on();
            }),
            (t.prototype.removeHandler = function (t) {
              for (var e = this.handlers, i = 0; i < e.length; i++) {
                var r = e[i];
                if (r.equals(t)) {
                  r.destroy(), e.splice(i, 1);
                  break;
                }
              }
            }),
            (t.prototype.matches = function () {
              return this.mql.matches || this.isUnconditional;
            }),
            (t.prototype.clear = function () {
              this.handlers.forEach(function (t) {
                t.destroy();
              }),
                this.mql.removeListener(this.listener),
                (this.handlers.length = 0);
            }),
            (t.prototype.assess = function () {
              var t = this.matches();
              this.handlers.forEach(function (e) {
                t ? e.on() : e.off();
              });
            }),
            t
          );
        })();
      !(function () {
        function t() {
          if (!window.matchMedia)
            throw new Error(
              "matchMedia not present, legacy browsers require a polyfill"
            );
          (this.queries = {}),
            (this.browserIsIncapable = !window.matchMedia("only all").matches);
        }
        (t.prototype.register = function (t, e, i) {
          void 0 === i && (i = !1);
          var r = this.queries,
            n = i && this.browserIsIncapable;
          r[t] || (r[t] = new c(t, n)),
            "function" == typeof e && (e = { match: e }),
            Array.isArray(e) || (e = [e]);
          var s = r[t];
          return (
            e.forEach(function (t) {
              "function" == typeof t && (t = { match: t }), s.addHandler(t);
            }),
            this
          );
        }),
          (t.prototype.unregister = function (t, e) {
            var i = this.queries[t];
            return (
              i &&
                (e ? i.removeHandler(e) : (i.clear(), delete this.queries[t])),
              this
            );
          });
      })();
      i("c832");
      var u,
        p,
        d,
        m = function (t) {
          var e = "function" == typeof Symbol && Symbol.iterator,
            i = e && t[e],
            r = 0;
          if (i) return i.call(t);
          if (t && "number" == typeof t.length)
            return {
              next: function () {
                return (
                  t && r >= t.length && (t = void 0),
                  { value: t && t[r++], done: !t }
                );
              },
            };
          throw new TypeError(
            e ? "Object is not iterable." : "Symbol.iterator is not defined."
          );
        },
        g =
          "undefined" != typeof navigator &&
          -1 !== navigator.userAgent.indexOf("Trident");
      function y(t, e) {
        if (!t.hasOwnProperty(e) || (!isNaN(e) && parseInt(e) < t.length))
          return !0;
        if (!g) return !1;
        try {
          return t[e] && t[e].parent === window;
        } catch (t) {
          return !0;
        }
      }
      function v(t, e) {
        return (
          void 0 === e && (e = window),
          new Promise(function (i, r) {
            !(function (t) {
              for (var e in ((u = p = void 0), t))
                y(t, e) || (u ? p || (p = e) : (u = e), (d = e));
            })(e);
            var s = e.document.createElement("script");
            (s.src = t),
              (s.onload = function () {
                var t = (function (t) {
                    var e,
                      i = 0,
                      r = !1;
                    for (var n in t)
                      if (!y(t, n)) {
                        for (var s = 0; s < window.frames.length && !r; s++) {
                          if (window.frames[s] === t[n]) {
                            r = !0;
                            break;
                          }
                        }
                        if (
                          !r &&
                          ((0 === i && n !== u) || (1 === i && n !== p))
                        )
                          return n;
                        i++, (e = n);
                      }
                    if (e !== d) return e;
                  })(e),
                  r = (t && e[t]) || {};
                i(r);
              }),
              (s.onerror = function (e) {
                n()(
                  !0,
                  "[moduleLoader] script had a problem to create, entry：".concat(
                    t
                  )
                ),
                  r(new Error("script load error, error: ".concat(e)));
              }),
              e.document.body.appendChild(s);
          })
        );
      }
      function b(t, e) {
        return t.length
          ? Promise.all(
              t.map(function (t) {
                return new Promise(function (i) {
                  var r = document.createElement("link");
                  (r.rel = "stylesheet"),
                    (r.type = "text/css"),
                    (r.href = t),
                    e && (r.dataset.styleFor = e),
                    (r.onload = i),
                    (r.onerror = i),
                    document.getElementsByTagName("head")[0].appendChild(r);
                });
              })
            )
          : Promise.resolve();
      }
      var _ = function () {
          return (_ =
            Object.assign ||
            function (t) {
              for (var e, i = 1, r = arguments.length; i < r; i++)
                for (var n in (e = arguments[i]))
                  Object.prototype.hasOwnProperty.call(e, n) && (t[n] = e[n]);
              return t;
            }).apply(this, arguments);
        },
        w = function (t, e, i, r) {
          return new (i || (i = Promise))(function (n, s) {
            function a(t) {
              try {
                h(r.next(t));
              } catch (t) {
                s(t);
              }
            }
            function o(t) {
              try {
                h(r.throw(t));
              } catch (t) {
                s(t);
              }
            }
            function h(t) {
              var e;
              t.done
                ? n(t.value)
                : ((e = t.value),
                  e instanceof i
                    ? e
                    : new i(function (t) {
                        t(e);
                      })).then(a, o);
            }
            h((r = r.apply(t, e || [])).next());
          });
        },
        A = function (t, e) {
          var i,
            r,
            n,
            s,
            a = {
              label: 0,
              sent: function () {
                if (1 & n[0]) throw n[1];
                return n[1];
              },
              trys: [],
              ops: [],
            };
          return (
            (s = { next: o(0), throw: o(1), return: o(2) }),
            "function" == typeof Symbol &&
              (s[Symbol.iterator] = function () {
                return this;
              }),
            s
          );
          function o(s) {
            return function (o) {
              return (function (s) {
                if (i) throw new TypeError("Generator is already executing.");
                for (; a; )
                  try {
                    if (
                      ((i = 1),
                      r &&
                        (n =
                          2 & s[0]
                            ? r.return
                            : s[0]
                            ? r.throw || ((n = r.return) && n.call(r), 0)
                            : r.next) &&
                        !(n = n.call(r, s[1])).done)
                    )
                      return n;
                    switch (((r = 0), n && (s = [2 & s[0], n.value]), s[0])) {
                      case 0:
                      case 1:
                        n = s;
                        break;
                      case 4:
                        return a.label++, { value: s[1], done: !1 };
                      case 5:
                        a.label++, (r = s[1]), (s = [0]);
                        continue;
                      case 7:
                        (s = a.ops.pop()), a.trys.pop();
                        continue;
                      default:
                        if (
                          !((n = a.trys),
                          (n = n.length > 0 && n[n.length - 1]) ||
                            (6 !== s[0] && 2 !== s[0]))
                        ) {
                          a = 0;
                          continue;
                        }
                        if (
                          3 === s[0] &&
                          (!n || (s[1] > n[0] && s[1] < n[3]))
                        ) {
                          a.label = s[1];
                          break;
                        }
                        if (6 === s[0] && a.label < n[1]) {
                          (a.label = n[1]), (n = s);
                          break;
                        }
                        if (n && a.label < n[2]) {
                          (a.label = n[2]), a.ops.push(s);
                          break;
                        }
                        n[2] && a.ops.pop(), a.trys.pop();
                        continue;
                    }
                    s = e.call(t, a);
                  } catch (t) {
                    (s = [6, t]), (r = 0);
                  } finally {
                    i = n = 0;
                  }
                if (5 & s[0]) throw s[1];
                return { value: s[0] ? s[1] : void 0, done: !0 };
              })([s, o]);
            };
          }
        },
        x = function (t, e) {
          var i = "function" == typeof Symbol && t[Symbol.iterator];
          if (!i) return t;
          var r,
            n,
            s = i.call(t),
            a = [];
          try {
            for (; (void 0 === e || e-- > 0) && !(r = s.next()).done; )
              a.push(r.value);
          } catch (t) {
            n = { error: t };
          } finally {
            try {
              r && !r.done && (i = s.return) && i.call(s);
            } finally {
              if (n) throw n.error;
            }
          }
          return a;
        },
        S = function (t, e, i) {
          if (i || 2 === arguments.length)
            for (var r, n = 0, s = e.length; n < s; n++)
              (!r && n in e) ||
                (r || (r = Array.prototype.slice.call(e, 0, n)), (r[n] = e[n]));
          return t.concat(r || Array.prototype.slice.call(e));
        },
        k = function () {};
      function E(t) {
        return t && t instanceof Promise && "function" == typeof t.then
          ? t
          : Promise.resolve(t);
      }
      function P(t) {
        return !!o((t && t.default) || t) || o((t || {}).bootstrap);
      }
      var C = function (t, e) {
          return function (i, r) {
            void 0 === r && (r = {});
            var h = r.sync,
              l = r.register,
              f = void 0 === l ? k : l,
              c = r.onLoading,
              u = void 0 === c ? k : c,
              p = r.onLoaded,
              d = void 0 === p ? k : p,
              m = r.onError,
              g =
                void 0 === m
                  ? function (t, e) {
                      n()(
                        !1,
                        'An error occurred while loading module "'
                          .concat(t, '", Error: ')
                          .concat(e.message)
                      );
                    }
                  : m,
              y = r.success,
              C = r.error;
            e.current = !1;
            var D = this,
              M = (function t(e, i) {
                if ((void 0 === i && (i = function () {}), Array.isArray(e)))
                  return e.reduce(function (e, i) {
                    return S(S([], x(e), !1), x(t(i)), !1);
                  }, []);
                if (a(e)) {
                  var r = e;
                  return r.entry && "string" == typeof r.entry
                    ? [
                        _(_({}, e), {
                          styles: r.styles
                            ? Array.isArray(r.styles)
                              ? r.styles
                              : [r.styles]
                            : [],
                        }),
                      ]
                    : Object.keys(r).map(function (t) {
                        return "string" == typeof r[t]
                          ? { entry: r[t], moduleName: t }
                          : _(_({}, r[t]), {
                              styles: r[t].styles
                                ? Array.isArray(r[t].styles)
                                  ? r[t].styles
                                  : [r[t].styles]
                                : [],
                              moduleName: t,
                            });
                      });
                }
                return o(e)
                  ? [e]
                  : (i('not support "'.concat(typeof e, '" type module'), e),
                    []);
              })(i, C);
            return new Promise(
              !0 === h
                ? function (t) {
                    return (function t(e, i) {
                      e < M.length
                        ? T(M[e]).then(function () {
                            t(e + 1, i);
                          })
                        : i();
                    })(0, function () {
                      (e.current = !0), y ? y() : t();
                    });
                  }
                : function (t) {
                    return Promise.all(
                      M.map(function (t) {
                        return T(t);
                      })
                    ).then(function () {
                      (e.current = !0), y ? y() : t();
                    });
                  }
            );
            function T(e) {
              return w(this, void 0, void 0, function () {
                var i, r, a, h, l, c, p, m, y, _;
                return A(this, function (w) {
                  switch (w.label) {
                    case 0:
                      return o(e) ? [4, E(e.call(D, t))] : [3, 2];
                    case 1:
                      return (
                        (m = w.sent()) &&
                          ((y = {}), (y = s(m) ? { routes: m } : m), f(y)),
                        [3, 14]
                      );
                    case 2:
                      (i = e.moduleName),
                        (r = e.entry),
                        (a = e.styles),
                        (h = void 0 === a ? [] : a),
                        (l = e.args),
                        (c = window).Vue || (c.Vue = t),
                        (w.label = 3);
                    case 3:
                      return w.trys.push([3, 9, , 14]), [4, b(h, i)];
                    case 4:
                      return w.sent(), [4, v(r, c)];
                    case 5:
                      return (p = w.sent()), [4, E(u(i))];
                    case 6:
                      return (
                        w.sent(),
                        [
                          4,
                          E(
                            (function (t, e, i) {
                              if (P(t))
                                return o((r = (t && t.default) || t))
                                  ? { bootstrap: r }
                                  : t;
                              n()(
                                !0,
                                "[moduleLoader] lifecycle not found from "
                                  .concat(
                                    e,
                                    " entry exports, fallback to get from window['"
                                  )
                                  .concat(e, "']")
                              );
                              var r,
                                s = i.exports ? i.exports[e] : i[e];
                              if (P(s))
                                return o((r = (s && s.default) || s))
                                  ? { bootstrap: r }
                                  : s;
                              throw new Error(
                                "[moduleLoader] You need to export lifecycle functions in ".concat(
                                  e,
                                  " entry"
                                )
                              );
                            })(p, i, c).bootstrap.call(D, t, l)
                          ),
                        ]
                      );
                    case 7:
                      return (
                        (m = w.sent()) &&
                          ((y = {}), (y = s(m) ? { routes: m } : m), f(y)),
                        [4, E(d(i))]
                      );
                    case 8:
                      return w.sent(), [3, 14];
                    case 9:
                      (_ = w.sent()), (w.label = 10);
                    case 10:
                      return w.trys.push([10, 12, , 13]), [4, E(g(i, _))];
                    case 11:
                      return (
                        w.sent(),
                        C &&
                          "function" == typeof C &&
                          (console.warn(
                            '"error" function is deprecated, using "onError" function!'
                          ),
                          C(_.message, e)),
                        [3, 13]
                      );
                    case 12:
                      return w.sent(), [3, 13];
                    case 13:
                      return [3, 14];
                    case 14:
                      return [2];
                  }
                });
              });
            }
          };
        },
        D = i("2b0e");
      function M(t) {
        var e = (t && t.default) || t;
        return a(e)
          ? Object.keys(e).length > 0 &&
              (l(e, "template") || l(e, "render") || o(e))
          : e instanceof D.default;
      }
      var T = function (t) {
        return function (e, i, r) {
          var s = window;
          return (
            s.Vue || (s.Vue = t),
            r && ("string" == typeof r && (r = [r]), b(r, e)),
            v(i, s).then(function (t) {
              return (function (t, e, i) {
                if (M(t)) return (t && t.default) || t;
                n()(
                  !1,
                  "[moduleLoader] component not found from "
                    .concat(e, " entry exports, fallback to get from window['")
                    .concat(e, "']")
                );
                var r = i[e];
                if (M(r)) return (r && r.default) || r;
                throw new Error(
                  "[moduleLoader] You need to export vue component in ".concat(
                    e,
                    " entry"
                  )
                );
              })(t, e, s);
            })
          );
        };
      };
      function F(t) {
        if (!F.installed) {
          F.installed = !0;
          var e,
            i = new t({
              data: function () {
                return { status: { current: !1 } };
              },
            }),
            r = {
              $moduleLoader: {
                value: C(t, i.status),
                writable: !1,
                enumerable: !0,
                configurable: !0,
              },
              $componentLoader: {
                value: T(t),
                writable: !1,
                enumerable: !0,
                configurable: !0,
              },
              $eventBus: {
                value:
                  ((e = {}),
                  {
                    emit: function (t, i) {
                      var r, s;
                      if (!e[t])
                        return n()(
                          !0,
                          '[moduleLoader] event "'.concat(
                            t,
                            '" is triggered, but no listeners，nothing will be happening.'
                          )
                        );
                      try {
                        for (
                          var a = m(e[t].values()), o = a.next();
                          !o.done;
                          o = a.next()
                        )
                          (0, o.value)(i);
                      } catch (t) {
                        r = { error: t };
                      } finally {
                        try {
                          o && !o.done && (s = a.return) && s.call(a);
                        } finally {
                          if (r) throw r.error;
                        }
                      }
                    },
                    on: function (t, i) {
                      "function" == typeof i
                        ? (e[t] || (e[t] = new Set()), e[t].add(i))
                        : n()(
                            !1,
                            "[moduleLoader] handler must be a function, but recived ".concat(
                              typeof i
                            )
                          );
                    },
                    off: function (t, i) {
                      return i
                        ? e.hasOwnProperty(t)
                          ? void e[t].delete(i)
                          : n()(
                              !0,
                              '[moduleLoader] no event name of "'.concat(
                                t,
                                '" is on listening'
                              )
                            )
                        : n()(
                            !1,
                            "[moduleLoader] handler must be a valid event function"
                          );
                    },
                    clear: function () {
                      e = {};
                    },
                    getEvents: function () {
                      return e;
                    },
                  }),
                writable: !1,
                enumerable: !0,
                configurable: !0,
              },
            };
          Object.defineProperties(t.prototype, r);
          var s = t.prototype._init;
          (t.prototype._init = function (t) {
            void 0 === t && (t = {}),
              t.router &&
                (function (t) {
                  return t.beforeEach(function (t, r, n) {
                    if (
                      t.name &&
                      "404" !== t.name &&
                      "page-not-found" !== t.name &&
                      "not-found" !== t.name &&
                      "*" !== t.path
                    )
                      n();
                    else {
                      if (i.status.current) return e(t, r, n);
                      i.$watch(
                        function () {
                          return i.status.current;
                        },
                        function (i, s) {
                          i && !s && e(t, r, n);
                        }
                      );
                    }
                  });
                  function e(e, i, r) {
                    var n = e.redirectedFrom || e.fullPath,
                      s = t.resolve(n),
                      a = s.resolved,
                      o = s.location;
                    a.name !== e.name ? r(o) : r();
                  }
                })(t.router),
              s.call(this, t);
          }),
            Object.defineProperties(this.prototype, {
              load: r.$moduleLoader,
              loadComponent: r.$componentLoader,
              eventBus: r.$eventBus,
            }),
            t.$__module_loader_installed__ ||
              ((t.$__module_loader_installed__ = !0),
              t.mixin({
                beforeCreate: function () {
                  var e = this.$options;
                  e.moduleLoader
                    ? (e.moduleLoader.init(this, e.ssrContext),
                      (this.$moduleLoadManager = t.observable(
                        e.moduleLoader.framework
                      )))
                    : (this.$moduleLoadManager =
                        (e.parent && e.parent.$moduleLoadManager) || this);
                },
              }));
        }
      }
      var O = function (t, e) {
          var i = "function" == typeof Symbol && t[Symbol.iterator];
          if (!i) return t;
          var r,
            n,
            s = i.call(t),
            a = [];
          try {
            for (; (void 0 === e || e-- > 0) && !(r = s.next()).done; )
              a.push(r.value);
          } catch (t) {
            n = { error: t };
          } finally {
            try {
              r && !r.done && (i = s.return) && i.call(s);
            } finally {
              if (n) throw n.error;
            }
          }
          return a;
        },
        L = (function () {
          function t(t) {
            var e = this;
            (this._framework = {}),
              t &&
                Object.entries(t).map(function (t) {
                  var i = O(t, 2),
                    r = i[0],
                    s = i[1];
                  l(e._framework, r)
                    ? n()(!0, "".concat(r, " has been defined"))
                    : (e._framework[r] = s);
                });
          }
          return (
            Object.defineProperty(t.prototype, "framework", {
              get: function () {
                return this._framework;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (t.prototype.init = function (t, e) {
              !l(this._framework, "addRoutes") &&
                (this._framework.addRoutes = this._createAddRoutes(t));
            }),
            (t.prototype._createAddRoutes = function (t) {
              return function (e) {
                t.$router
                  ? t.$router.addRoutes(e)
                  : n()(!0, "vm.$router is not exists!");
              };
            }),
            (t.install = F),
            (t.version = "3.2.2"),
            (t.installed = !1),
            t
          );
        })(),
        I = function (t, e) {
          var i = "function" == typeof Symbol && t[Symbol.iterator];
          if (!i) return t;
          var r,
            n,
            s = i.call(t),
            a = [];
          try {
            for (; (void 0 === e || e-- > 0) && !(r = s.next()).done; )
              a.push(r.value);
          } catch (t) {
            n = { error: t };
          } finally {
            try {
              r && !r.done && (i = s.return) && i.call(s);
            } finally {
              if (n) throw n.error;
            }
          }
          return a;
        },
        R = function (t, e, i) {
          if (i || 2 === arguments.length)
            for (var r, n = 0, s = e.length; n < s; n++)
              (!r && n in e) ||
                (r || (r = Array.prototype.slice.call(e, 0, n)), (r[n] = e[n]));
          return t.concat(r || Array.prototype.slice.call(e));
        },
        j = (function () {
          function t() {
            (this.callbacks = {}), (this.doingAction = !1);
          }
          return (
            (t.buildPreinitializedHook = function (e) {
              var i = {},
                r = function (r) {
                  var n,
                    s = e[r];
                  if (
                    null !== (n = s) &&
                    "object" == typeof n &&
                    s instanceof t
                  )
                    return (i[r] = s), "continue";
                  var a = new t(),
                    o = function (t) {
                      s[t].forEach(function (e) {
                        a.addFilter(e.func, t, e.acceptedArgs);
                      });
                    };
                  for (var h in s) o(h);
                  i[r] = a;
                };
              for (var n in e) r(n);
              return i;
            }),
            Object.defineProperty(t.prototype, "filters", {
              get: function () {
                return this.callbacks;
              },
              enumerable: !1,
              configurable: !0,
            }),
            (t.prototype.hasFilter = function (t) {
              void 0 === t && (t = !1);
              var e = Object.entries(this.callbacks).reduce(function (t, e) {
                var i = I(e, 2),
                  r = (i[0], i[1]);
                return t.concat(r);
              }, []);
              if ("boolean" == typeof t) return e.length > 0;
              var i = e.find(function (e) {
                return e.func === t;
              });
              return !!i && i.func;
            }),
            (t.prototype.addFilter = function (t, e, i) {
              void 0 === e && (e = 10),
                void 0 === i && (i = 1),
                l(this.callbacks, e) || (this.callbacks[e] = []),
                this.callbacks[e].push({ func: t, acceptedArgs: i });
            }),
            (t.prototype.removeFilter = function (t, e) {
              if ((void 0 === e && (e = 10), l(this.callbacks, e))) {
                var i = this.callbacks[e].findIndex(function (e) {
                  return e.func === t;
                });
                return i >= 0 && this.callbacks[e].splice(i, 1), i >= 0;
              }
              return !1;
            }),
            (t.prototype.removeAllFilters = function (t) {
              void 0 === t && (t = !1),
                "boolean" == typeof t
                  ? (this.callbacks = {})
                  : l(this.callbacks, t)
                  ? (this.callbacks[t] = [])
                  : n()(
                      "production" ===
                        Object({
                          NODE_ENV: "production",
                          VUE_APP_BUILD_PATH:
                            "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/coc3/rightsmarket-h5-canvas/build_production/",
                          VUE_APP_CURRENTMODE: "production",
                          VUE_APP_MODULE_H5COMPS_PATH:
                            "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/canvas/rightsmarket-h5-canvas/production/build-h5cdn",
                          VUE_APP_PATH_NAME:
                            "https://dev.coc.10086.cn/coc3/canvas/rightsmarket-h5-canvas/",
                          BASE_URL:
                            "https://res.coc.10086.cn/res/cdn/coc1-online/fixedPath/coc3/rightsmarket-h5-canvas/build_production/",
                        }).NDE_ENV,
                      'priority "'.concat(
                        t,
                        '" is not exists , no filiters will be removed.'
                      )
                    );
            }),
            (t.prototype.applyFilters = function (t) {
              for (var e = [], i = 1; i < arguments.length; i++)
                e[i - 1] = arguments[i];
              var r = Object.entries(this.callbacks)
                .sort(function (t, e) {
                  var i = I(t, 1)[0],
                    r = I(e, 1)[0];
                  return Number(i) - Number(r);
                })
                .reduce(function (t, e) {
                  var i = I(e, 2),
                    r = (i[0], i[1]);
                  return t.concat(r);
                }, []);
              if (r.length) {
                var n = this.doingAction;
                return new Promise(function (e) {
                  return s(0, t, e);
                });
                function s(t, i, a) {
                  var o = r[t],
                    h = R([], I(e), !1);
                  n || h.unshift(i);
                  var l = o.func.apply(null, h.slice(0, o.acceptedArgs));
                  t === r.length - 1
                    ? l instanceof Promise
                      ? l.then(a)
                      : a(l)
                    : l instanceof Promise
                    ? l.then(function (e) {
                        return s(t + 1, e, a);
                      })
                    : s(t + 1, l, a);
                }
              }
              return Promise.resolve(t);
            }),
            (t.prototype.doAction = function () {
              for (var t = this, e = [], i = 0; i < arguments.length; i++)
                e[i] = arguments[i];
              return (
                (this.doingAction = !0),
                new Promise(function (i, r) {
                  t.applyFilters.apply(t, R([""], I(e), !1)).then(function () {
                    (t.doingAction = !1), i();
                  }, r);
                })
              );
            }),
            t
          );
        })();
      j.buildPreinitializedHook({});
      var N = L.install;
      L.install = function (t) {
        N.call(L, t);
      };
      e.a = L;
      "undefined" != typeof window && window.Vue && window.Vue.use(L);
    },
    "7a77": function (t, e, i) {
      "use strict";
      function r(t) {
        this.message = t;
      }
      (r.prototype.toString = function () {
        return "Cancel" + (this.message ? ": " + this.message : "");
      }),
        (r.prototype.__CANCEL__ = !0),
        (t.exports = r);
    },
    "7aac": function (t, e, i) {
      "use strict";
      var r = i("c532");
      t.exports = r.isStandardBrowserEnv()
        ? {
            write: function (t, e, i, n, s, a) {
              var o = [];
              o.push(t + "=" + encodeURIComponent(e)),
                r.isNumber(i) && o.push("expires=" + new Date(i).toGMTString()),
                r.isString(n) && o.push("path=" + n),
                r.isString(s) && o.push("domain=" + s),
                !0 === a && o.push("secure"),
                (document.cookie = o.join("; "));
            },
            read: function (t) {
              var e = document.cookie.match(
                new RegExp("(^|;\\s*)(" + t + ")=([^;]*)")
              );
              return e ? decodeURIComponent(e[3]) : null;
            },
            remove: function (t) {
              this.write(t, "", Date.now() - 864e5);
            },
          }
        : {
            write: function () {},
            read: function () {
              return null;
            },
            remove: function () {},
          };
    },
    8237: function (module, exports, __webpack_require__) {
      (function (process, global) {
        var __WEBPACK_AMD_DEFINE_RESULT__;
        /**
         * [js-md5]{@link https://github.com/emn178/js-md5}
         *
         * @namespace md5
         * @version 0.7.3
         * @author Chen, Yi-Cyuan [emn178@gmail.com]
         * @copyright Chen, Yi-Cyuan 2014-2017
         * @license MIT
         */ !(function () {
          "use strict";
          var ERROR = "input is invalid type",
            WINDOW = "object" == typeof window,
            root = WINDOW ? window : {};
          root.JS_MD5_NO_WINDOW && (WINDOW = !1);
          var WEB_WORKER = !WINDOW && "object" == typeof self,
            NODE_JS =
              !root.JS_MD5_NO_NODE_JS &&
              "object" == typeof process &&
              process.versions &&
              process.versions.node;
          NODE_JS ? (root = global) : WEB_WORKER && (root = self);
          var COMMON_JS =
              !root.JS_MD5_NO_COMMON_JS &&
              "object" == typeof module &&
              module.exports,
            AMD = __webpack_require__("3c35"),
            ARRAY_BUFFER =
              !root.JS_MD5_NO_ARRAY_BUFFER && "undefined" != typeof ArrayBuffer,
            HEX_CHARS = "0123456789abcdef".split(""),
            EXTRA = [128, 32768, 8388608, -2147483648],
            SHIFT = [0, 8, 16, 24],
            OUTPUT_TYPES = [
              "hex",
              "array",
              "digest",
              "buffer",
              "arrayBuffer",
              "base64",
            ],
            BASE64_ENCODE_CHAR =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(
                ""
              ),
            blocks = [],
            buffer8;
          if (ARRAY_BUFFER) {
            var buffer = new ArrayBuffer(68);
            (buffer8 = new Uint8Array(buffer)),
              (blocks = new Uint32Array(buffer));
          }
          (!root.JS_MD5_NO_NODE_JS && Array.isArray) ||
            (Array.isArray = function (t) {
              return "[object Array]" === Object.prototype.toString.call(t);
            }),
            !ARRAY_BUFFER ||
              (!root.JS_MD5_NO_ARRAY_BUFFER_IS_VIEW && ArrayBuffer.isView) ||
              (ArrayBuffer.isView = function (t) {
                return (
                  "object" == typeof t &&
                  t.buffer &&
                  t.buffer.constructor === ArrayBuffer
                );
              });
          var createOutputMethod = function (t) {
              return function (e) {
                return new Md5(!0).update(e)[t]();
              };
            },
            createMethod = function () {
              var t = createOutputMethod("hex");
              NODE_JS && (t = nodeWrap(t)),
                (t.create = function () {
                  return new Md5();
                }),
                (t.update = function (e) {
                  return t.create().update(e);
                });
              for (var e = 0; e < OUTPUT_TYPES.length; ++e) {
                var i = OUTPUT_TYPES[e];
                t[i] = createOutputMethod(i);
              }
              return t;
            },
            nodeWrap = function (method) {
              var crypto = eval("require('crypto')"),
                Buffer = eval("require('buffer').Buffer"),
                nodeMethod = function (t) {
                  if ("string" == typeof t)
                    return crypto
                      .createHash("md5")
                      .update(t, "utf8")
                      .digest("hex");
                  if (null == t) throw ERROR;
                  return (
                    t.constructor === ArrayBuffer && (t = new Uint8Array(t)),
                    Array.isArray(t) ||
                    ArrayBuffer.isView(t) ||
                    t.constructor === Buffer
                      ? crypto
                          .createHash("md5")
                          .update(new Buffer(t))
                          .digest("hex")
                      : method(t)
                  );
                };
              return nodeMethod;
            };
          function Md5(t) {
            if (t)
              (blocks[0] =
                blocks[16] =
                blocks[1] =
                blocks[2] =
                blocks[3] =
                blocks[4] =
                blocks[5] =
                blocks[6] =
                blocks[7] =
                blocks[8] =
                blocks[9] =
                blocks[10] =
                blocks[11] =
                blocks[12] =
                blocks[13] =
                blocks[14] =
                blocks[15] =
                  0),
                (this.blocks = blocks),
                (this.buffer8 = buffer8);
            else if (ARRAY_BUFFER) {
              var e = new ArrayBuffer(68);
              (this.buffer8 = new Uint8Array(e)),
                (this.blocks = new Uint32Array(e));
            } else
              this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            (this.h0 =
              this.h1 =
              this.h2 =
              this.h3 =
              this.start =
              this.bytes =
              this.hBytes =
                0),
              (this.finalized = this.hashed = !1),
              (this.first = !0);
          }
          (Md5.prototype.update = function (t) {
            if (!this.finalized) {
              var e,
                i = typeof t;
              if ("string" !== i) {
                if ("object" !== i) throw ERROR;
                if (null === t) throw ERROR;
                if (ARRAY_BUFFER && t.constructor === ArrayBuffer)
                  t = new Uint8Array(t);
                else if (
                  !(Array.isArray(t) || (ARRAY_BUFFER && ArrayBuffer.isView(t)))
                )
                  throw ERROR;
                e = !0;
              }
              for (
                var r,
                  n,
                  s = 0,
                  a = t.length,
                  o = this.blocks,
                  h = this.buffer8;
                s < a;

              ) {
                if (
                  (this.hashed &&
                    ((this.hashed = !1),
                    (o[0] = o[16]),
                    (o[16] =
                      o[1] =
                      o[2] =
                      o[3] =
                      o[4] =
                      o[5] =
                      o[6] =
                      o[7] =
                      o[8] =
                      o[9] =
                      o[10] =
                      o[11] =
                      o[12] =
                      o[13] =
                      o[14] =
                      o[15] =
                        0)),
                  e)
                )
                  if (ARRAY_BUFFER)
                    for (n = this.start; s < a && n < 64; ++s) h[n++] = t[s];
                  else
                    for (n = this.start; s < a && n < 64; ++s)
                      o[n >> 2] |= t[s] << SHIFT[3 & n++];
                else if (ARRAY_BUFFER)
                  for (n = this.start; s < a && n < 64; ++s)
                    (r = t.charCodeAt(s)) < 128
                      ? (h[n++] = r)
                      : r < 2048
                      ? ((h[n++] = 192 | (r >> 6)), (h[n++] = 128 | (63 & r)))
                      : r < 55296 || r >= 57344
                      ? ((h[n++] = 224 | (r >> 12)),
                        (h[n++] = 128 | ((r >> 6) & 63)),
                        (h[n++] = 128 | (63 & r)))
                      : ((r =
                          65536 +
                          (((1023 & r) << 10) | (1023 & t.charCodeAt(++s)))),
                        (h[n++] = 240 | (r >> 18)),
                        (h[n++] = 128 | ((r >> 12) & 63)),
                        (h[n++] = 128 | ((r >> 6) & 63)),
                        (h[n++] = 128 | (63 & r)));
                else
                  for (n = this.start; s < a && n < 64; ++s)
                    (r = t.charCodeAt(s)) < 128
                      ? (o[n >> 2] |= r << SHIFT[3 & n++])
                      : r < 2048
                      ? ((o[n >> 2] |= (192 | (r >> 6)) << SHIFT[3 & n++]),
                        (o[n >> 2] |= (128 | (63 & r)) << SHIFT[3 & n++]))
                      : r < 55296 || r >= 57344
                      ? ((o[n >> 2] |= (224 | (r >> 12)) << SHIFT[3 & n++]),
                        (o[n >> 2] |=
                          (128 | ((r >> 6) & 63)) << SHIFT[3 & n++]),
                        (o[n >> 2] |= (128 | (63 & r)) << SHIFT[3 & n++]))
                      : ((r =
                          65536 +
                          (((1023 & r) << 10) | (1023 & t.charCodeAt(++s)))),
                        (o[n >> 2] |= (240 | (r >> 18)) << SHIFT[3 & n++]),
                        (o[n >> 2] |=
                          (128 | ((r >> 12) & 63)) << SHIFT[3 & n++]),
                        (o[n >> 2] |=
                          (128 | ((r >> 6) & 63)) << SHIFT[3 & n++]),
                        (o[n >> 2] |= (128 | (63 & r)) << SHIFT[3 & n++]));
                (this.lastByteIndex = n),
                  (this.bytes += n - this.start),
                  n >= 64
                    ? ((this.start = n - 64), this.hash(), (this.hashed = !0))
                    : (this.start = n);
              }
              return (
                this.bytes > 4294967295 &&
                  ((this.hBytes += (this.bytes / 4294967296) << 0),
                  (this.bytes = this.bytes % 4294967296)),
                this
              );
            }
          }),
            (Md5.prototype.finalize = function () {
              if (!this.finalized) {
                this.finalized = !0;
                var t = this.blocks,
                  e = this.lastByteIndex;
                (t[e >> 2] |= EXTRA[3 & e]),
                  e >= 56 &&
                    (this.hashed || this.hash(),
                    (t[0] = t[16]),
                    (t[16] =
                      t[1] =
                      t[2] =
                      t[3] =
                      t[4] =
                      t[5] =
                      t[6] =
                      t[7] =
                      t[8] =
                      t[9] =
                      t[10] =
                      t[11] =
                      t[12] =
                      t[13] =
                      t[14] =
                      t[15] =
                        0)),
                  (t[14] = this.bytes << 3),
                  (t[15] = (this.hBytes << 3) | (this.bytes >>> 29)),
                  this.hash();
              }
            }),
            (Md5.prototype.hash = function () {
              var t,
                e,
                i,
                r,
                n,
                s,
                a = this.blocks;
              this.first
                ? (e =
                    ((((e =
                      ((t =
                        ((((t = a[0] - 680876937) << 7) | (t >>> 25)) -
                          271733879) <<
                        0) ^
                        ((i =
                          ((((i =
                            (-271733879 ^
                              ((r =
                                ((((r =
                                  (-1732584194 ^ (2004318071 & t)) +
                                  a[1] -
                                  117830708) <<
                                  12) |
                                  (r >>> 20)) +
                                  t) <<
                                0) &
                                (-271733879 ^ t))) +
                            a[2] -
                            1126478375) <<
                            17) |
                            (i >>> 15)) +
                            r) <<
                          0) &
                          (r ^ t))) +
                      a[3] -
                      1316259209) <<
                      22) |
                      (e >>> 10)) +
                      i) <<
                    0)
                : ((t = this.h0),
                  (e = this.h1),
                  (i = this.h2),
                  (e =
                    ((((e +=
                      ((t =
                        ((((t +=
                          ((r = this.h3) ^ (e & (i ^ r))) + a[0] - 680876936) <<
                          7) |
                          (t >>> 25)) +
                          e) <<
                        0) ^
                        ((i =
                          ((((i +=
                            (e ^
                              ((r =
                                ((((r +=
                                  (i ^ (t & (e ^ i))) + a[1] - 389564586) <<
                                  12) |
                                  (r >>> 20)) +
                                  t) <<
                                0) &
                                (t ^ e))) +
                            a[2] +
                            606105819) <<
                            17) |
                            (i >>> 15)) +
                            r) <<
                          0) &
                          (r ^ t))) +
                      a[3] -
                      1044525330) <<
                      22) |
                      (e >>> 10)) +
                      i) <<
                    0)),
                (e =
                  ((((e +=
                    ((t =
                      ((((t += (r ^ (e & (i ^ r))) + a[4] - 176418897) << 7) |
                        (t >>> 25)) +
                        e) <<
                      0) ^
                      ((i =
                        ((((i +=
                          (e ^
                            ((r =
                              ((((r +=
                                (i ^ (t & (e ^ i))) + a[5] + 1200080426) <<
                                12) |
                                (r >>> 20)) +
                                t) <<
                              0) &
                              (t ^ e))) +
                          a[6] -
                          1473231341) <<
                          17) |
                          (i >>> 15)) +
                          r) <<
                        0) &
                        (r ^ t))) +
                    a[7] -
                    45705983) <<
                    22) |
                    (e >>> 10)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((t =
                      ((((t += (r ^ (e & (i ^ r))) + a[8] + 1770035416) << 7) |
                        (t >>> 25)) +
                        e) <<
                      0) ^
                      ((i =
                        ((((i +=
                          (e ^
                            ((r =
                              ((((r +=
                                (i ^ (t & (e ^ i))) + a[9] - 1958414417) <<
                                12) |
                                (r >>> 20)) +
                                t) <<
                              0) &
                              (t ^ e))) +
                          a[10] -
                          42063) <<
                          17) |
                          (i >>> 15)) +
                          r) <<
                        0) &
                        (r ^ t))) +
                    a[11] -
                    1990404162) <<
                    22) |
                    (e >>> 10)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((t =
                      ((((t += (r ^ (e & (i ^ r))) + a[12] + 1804603682) << 7) |
                        (t >>> 25)) +
                        e) <<
                      0) ^
                      ((i =
                        ((((i +=
                          (e ^
                            ((r =
                              ((((r +=
                                (i ^ (t & (e ^ i))) + a[13] - 40341101) <<
                                12) |
                                (r >>> 20)) +
                                t) <<
                              0) &
                              (t ^ e))) +
                          a[14] -
                          1502002290) <<
                          17) |
                          (i >>> 15)) +
                          r) <<
                        0) &
                        (r ^ t))) +
                    a[15] +
                    1236535329) <<
                    22) |
                    (e >>> 10)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((r =
                      ((((r +=
                        (e ^
                          (i &
                            ((t =
                              ((((t +=
                                (i ^ (r & (e ^ i))) + a[1] - 165796510) <<
                                5) |
                                (t >>> 27)) +
                                e) <<
                              0) ^
                              e))) +
                        a[6] -
                        1069501632) <<
                        9) |
                        (r >>> 23)) +
                        t) <<
                      0) ^
                      (t &
                        ((i =
                          ((((i += (t ^ (e & (r ^ t))) + a[11] + 643717713) <<
                            14) |
                            (i >>> 18)) +
                            r) <<
                          0) ^
                          r))) +
                    a[0] -
                    373897302) <<
                    20) |
                    (e >>> 12)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((r =
                      ((((r +=
                        (e ^
                          (i &
                            ((t =
                              ((((t +=
                                (i ^ (r & (e ^ i))) + a[5] - 701558691) <<
                                5) |
                                (t >>> 27)) +
                                e) <<
                              0) ^
                              e))) +
                        a[10] +
                        38016083) <<
                        9) |
                        (r >>> 23)) +
                        t) <<
                      0) ^
                      (t &
                        ((i =
                          ((((i += (t ^ (e & (r ^ t))) + a[15] - 660478335) <<
                            14) |
                            (i >>> 18)) +
                            r) <<
                          0) ^
                          r))) +
                    a[4] -
                    405537848) <<
                    20) |
                    (e >>> 12)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((r =
                      ((((r +=
                        (e ^
                          (i &
                            ((t =
                              ((((t +=
                                (i ^ (r & (e ^ i))) + a[9] + 568446438) <<
                                5) |
                                (t >>> 27)) +
                                e) <<
                              0) ^
                              e))) +
                        a[14] -
                        1019803690) <<
                        9) |
                        (r >>> 23)) +
                        t) <<
                      0) ^
                      (t &
                        ((i =
                          ((((i += (t ^ (e & (r ^ t))) + a[3] - 187363961) <<
                            14) |
                            (i >>> 18)) +
                            r) <<
                          0) ^
                          r))) +
                    a[8] +
                    1163531501) <<
                    20) |
                    (e >>> 12)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((r =
                      ((((r +=
                        (e ^
                          (i &
                            ((t =
                              ((((t +=
                                (i ^ (r & (e ^ i))) + a[13] - 1444681467) <<
                                5) |
                                (t >>> 27)) +
                                e) <<
                              0) ^
                              e))) +
                        a[2] -
                        51403784) <<
                        9) |
                        (r >>> 23)) +
                        t) <<
                      0) ^
                      (t &
                        ((i =
                          ((((i += (t ^ (e & (r ^ t))) + a[7] + 1735328473) <<
                            14) |
                            (i >>> 18)) +
                            r) <<
                          0) ^
                          r))) +
                    a[12] -
                    1926607734) <<
                    20) |
                    (e >>> 12)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((s =
                      (r =
                        ((((r +=
                          ((n = e ^ i) ^
                            (t =
                              ((((t += (n ^ r) + a[5] - 378558) << 4) |
                                (t >>> 28)) +
                                e) <<
                              0)) +
                          a[8] -
                          2022574463) <<
                          11) |
                          (r >>> 21)) +
                          t) <<
                        0) ^ t) ^
                      (i =
                        ((((i += (s ^ e) + a[11] + 1839030562) << 16) |
                          (i >>> 16)) +
                          r) <<
                        0)) +
                    a[14] -
                    35309556) <<
                    23) |
                    (e >>> 9)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((s =
                      (r =
                        ((((r +=
                          ((n = e ^ i) ^
                            (t =
                              ((((t += (n ^ r) + a[1] - 1530992060) << 4) |
                                (t >>> 28)) +
                                e) <<
                              0)) +
                          a[4] +
                          1272893353) <<
                          11) |
                          (r >>> 21)) +
                          t) <<
                        0) ^ t) ^
                      (i =
                        ((((i += (s ^ e) + a[7] - 155497632) << 16) |
                          (i >>> 16)) +
                          r) <<
                        0)) +
                    a[10] -
                    1094730640) <<
                    23) |
                    (e >>> 9)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((s =
                      (r =
                        ((((r +=
                          ((n = e ^ i) ^
                            (t =
                              ((((t += (n ^ r) + a[13] + 681279174) << 4) |
                                (t >>> 28)) +
                                e) <<
                              0)) +
                          a[0] -
                          358537222) <<
                          11) |
                          (r >>> 21)) +
                          t) <<
                        0) ^ t) ^
                      (i =
                        ((((i += (s ^ e) + a[3] - 722521979) << 16) |
                          (i >>> 16)) +
                          r) <<
                        0)) +
                    a[6] +
                    76029189) <<
                    23) |
                    (e >>> 9)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((s =
                      (r =
                        ((((r +=
                          ((n = e ^ i) ^
                            (t =
                              ((((t += (n ^ r) + a[9] - 640364487) << 4) |
                                (t >>> 28)) +
                                e) <<
                              0)) +
                          a[12] -
                          421815835) <<
                          11) |
                          (r >>> 21)) +
                          t) <<
                        0) ^ t) ^
                      (i =
                        ((((i += (s ^ e) + a[15] + 530742520) << 16) |
                          (i >>> 16)) +
                          r) <<
                        0)) +
                    a[2] -
                    995338651) <<
                    23) |
                    (e >>> 9)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((r =
                      ((((r +=
                        (e ^
                          ((t =
                            ((((t += (i ^ (e | ~r)) + a[0] - 198630844) << 6) |
                              (t >>> 26)) +
                              e) <<
                            0) |
                            ~i)) +
                        a[7] +
                        1126891415) <<
                        10) |
                        (r >>> 22)) +
                        t) <<
                      0) ^
                      ((i =
                        ((((i += (t ^ (r | ~e)) + a[14] - 1416354905) << 15) |
                          (i >>> 17)) +
                          r) <<
                        0) |
                        ~t)) +
                    a[5] -
                    57434055) <<
                    21) |
                    (e >>> 11)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((r =
                      ((((r +=
                        (e ^
                          ((t =
                            ((((t += (i ^ (e | ~r)) + a[12] + 1700485571) <<
                              6) |
                              (t >>> 26)) +
                              e) <<
                            0) |
                            ~i)) +
                        a[3] -
                        1894986606) <<
                        10) |
                        (r >>> 22)) +
                        t) <<
                      0) ^
                      ((i =
                        ((((i += (t ^ (r | ~e)) + a[10] - 1051523) << 15) |
                          (i >>> 17)) +
                          r) <<
                        0) |
                        ~t)) +
                    a[1] -
                    2054922799) <<
                    21) |
                    (e >>> 11)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((r =
                      ((((r +=
                        (e ^
                          ((t =
                            ((((t += (i ^ (e | ~r)) + a[8] + 1873313359) << 6) |
                              (t >>> 26)) +
                              e) <<
                            0) |
                            ~i)) +
                        a[15] -
                        30611744) <<
                        10) |
                        (r >>> 22)) +
                        t) <<
                      0) ^
                      ((i =
                        ((((i += (t ^ (r | ~e)) + a[6] - 1560198380) << 15) |
                          (i >>> 17)) +
                          r) <<
                        0) |
                        ~t)) +
                    a[13] +
                    1309151649) <<
                    21) |
                    (e >>> 11)) +
                    i) <<
                  0),
                (e =
                  ((((e +=
                    ((r =
                      ((((r +=
                        (e ^
                          ((t =
                            ((((t += (i ^ (e | ~r)) + a[4] - 145523070) << 6) |
                              (t >>> 26)) +
                              e) <<
                            0) |
                            ~i)) +
                        a[11] -
                        1120210379) <<
                        10) |
                        (r >>> 22)) +
                        t) <<
                      0) ^
                      ((i =
                        ((((i += (t ^ (r | ~e)) + a[2] + 718787259) << 15) |
                          (i >>> 17)) +
                          r) <<
                        0) |
                        ~t)) +
                    a[9] -
                    343485551) <<
                    21) |
                    (e >>> 11)) +
                    i) <<
                  0),
                this.first
                  ? ((this.h0 = (t + 1732584193) << 0),
                    (this.h1 = (e - 271733879) << 0),
                    (this.h2 = (i - 1732584194) << 0),
                    (this.h3 = (r + 271733878) << 0),
                    (this.first = !1))
                  : ((this.h0 = (this.h0 + t) << 0),
                    (this.h1 = (this.h1 + e) << 0),
                    (this.h2 = (this.h2 + i) << 0),
                    (this.h3 = (this.h3 + r) << 0));
            }),
            (Md5.prototype.hex = function () {
              this.finalize();
              var t = this.h0,
                e = this.h1,
                i = this.h2,
                r = this.h3;
              return (
                HEX_CHARS[(t >> 4) & 15] +
                HEX_CHARS[15 & t] +
                HEX_CHARS[(t >> 12) & 15] +
                HEX_CHARS[(t >> 8) & 15] +
                HEX_CHARS[(t >> 20) & 15] +
                HEX_CHARS[(t >> 16) & 15] +
                HEX_CHARS[(t >> 28) & 15] +
                HEX_CHARS[(t >> 24) & 15] +
                HEX_CHARS[(e >> 4) & 15] +
                HEX_CHARS[15 & e] +
                HEX_CHARS[(e >> 12) & 15] +
                HEX_CHARS[(e >> 8) & 15] +
                HEX_CHARS[(e >> 20) & 15] +
                HEX_CHARS[(e >> 16) & 15] +
                HEX_CHARS[(e >> 28) & 15] +
                HEX_CHARS[(e >> 24) & 15] +
                HEX_CHARS[(i >> 4) & 15] +
                HEX_CHARS[15 & i] +
                HEX_CHARS[(i >> 12) & 15] +
                HEX_CHARS[(i >> 8) & 15] +
                HEX_CHARS[(i >> 20) & 15] +
                HEX_CHARS[(i >> 16) & 15] +
                HEX_CHARS[(i >> 28) & 15] +
                HEX_CHARS[(i >> 24) & 15] +
                HEX_CHARS[(r >> 4) & 15] +
                HEX_CHARS[15 & r] +
                HEX_CHARS[(r >> 12) & 15] +
                HEX_CHARS[(r >> 8) & 15] +
                HEX_CHARS[(r >> 20) & 15] +
                HEX_CHARS[(r >> 16) & 15] +
                HEX_CHARS[(r >> 28) & 15] +
                HEX_CHARS[(r >> 24) & 15]
              );
            }),
            (Md5.prototype.toString = Md5.prototype.hex),
            (Md5.prototype.digest = function () {
              this.finalize();
              var t = this.h0,
                e = this.h1,
                i = this.h2,
                r = this.h3;
              return [
                255 & t,
                (t >> 8) & 255,
                (t >> 16) & 255,
                (t >> 24) & 255,
                255 & e,
                (e >> 8) & 255,
                (e >> 16) & 255,
                (e >> 24) & 255,
                255 & i,
                (i >> 8) & 255,
                (i >> 16) & 255,
                (i >> 24) & 255,
                255 & r,
                (r >> 8) & 255,
                (r >> 16) & 255,
                (r >> 24) & 255,
              ];
            }),
            (Md5.prototype.array = Md5.prototype.digest),
            (Md5.prototype.arrayBuffer = function () {
              this.finalize();
              var t = new ArrayBuffer(16),
                e = new Uint32Array(t);
              return (
                (e[0] = this.h0),
                (e[1] = this.h1),
                (e[2] = this.h2),
                (e[3] = this.h3),
                t
              );
            }),
            (Md5.prototype.buffer = Md5.prototype.arrayBuffer),
            (Md5.prototype.base64 = function () {
              for (var t, e, i, r = "", n = this.array(), s = 0; s < 15; )
                (t = n[s++]),
                  (e = n[s++]),
                  (i = n[s++]),
                  (r +=
                    BASE64_ENCODE_CHAR[t >>> 2] +
                    BASE64_ENCODE_CHAR[63 & ((t << 4) | (e >>> 4))] +
                    BASE64_ENCODE_CHAR[63 & ((e << 2) | (i >>> 6))] +
                    BASE64_ENCODE_CHAR[63 & i]);
              return (
                (t = n[s]),
                (r +=
                  BASE64_ENCODE_CHAR[t >>> 2] +
                  BASE64_ENCODE_CHAR[(t << 4) & 63] +
                  "==")
              );
            });
          var exports = createMethod();
          COMMON_JS
            ? (module.exports = exports)
            : ((root.md5 = exports),
              AMD &&
                ((__WEBPACK_AMD_DEFINE_RESULT__ = function () {
                  return exports;
                }.call(exports, __webpack_require__, exports, module)),
                void 0 === __WEBPACK_AMD_DEFINE_RESULT__ ||
                  (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)));
        })();
      }.call(this, __webpack_require__("4362"), __webpack_require__("c8ba")));
    },
    "83b9": function (t, e, i) {
      "use strict";
      var r = i("d925"),
        n = i("e683");
      t.exports = function (t, e) {
        return t && !r(e) ? n(t, e) : e;
      };
    },
    "8d74": function (t, e, i) {
      var r = i("4cef"),
        n = /^\s+/;
      t.exports = function (t) {
        return t ? t.slice(0, r(t) + 1).replace(n, "") : t;
      };
    },
    "8df4": function (t, e, i) {
      "use strict";
      var r = i("7a77");
      function n(t) {
        if ("function" != typeof t)
          throw new TypeError("executor must be a function.");
        var e;
        this.promise = new Promise(function (t) {
          e = t;
        });
        var i = this;
        t(function (t) {
          i.reason || ((i.reason = new r(t)), e(i.reason));
        });
      }
      (n.prototype.throwIfRequested = function () {
        if (this.reason) throw this.reason;
      }),
        (n.source = function () {
          var t;
          return {
            token: new n(function (e) {
              t = e;
            }),
            cancel: t,
          };
        }),
        (t.exports = n);
    },
    "901e": function (t, e, i) {
      var r;
      !(function (n) {
        "use strict";
        var s,
          a = /^-?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i,
          o = Math.ceil,
          h = Math.floor,
          l = "[BigNumber Error] ",
          f = l + "Number primitive has more than 15 significant digits: ",
          c = 1e14,
          u = [
            1, 10, 100, 1e3, 1e4, 1e5, 1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12,
            1e13,
          ],
          p = 1e9;
        function d(t) {
          var e = 0 | t;
          return t > 0 || t === e ? e : e - 1;
        }
        function m(t) {
          for (var e, i, r = 1, n = t.length, s = t[0] + ""; r < n; ) {
            for (i = 14 - (e = t[r++] + "").length; i--; e = "0" + e);
            s += e;
          }
          for (n = s.length; 48 === s.charCodeAt(--n); );
          return s.slice(0, n + 1 || 1);
        }
        function g(t, e) {
          var i,
            r,
            n = t.c,
            s = e.c,
            a = t.s,
            o = e.s,
            h = t.e,
            l = e.e;
          if (!a || !o) return null;
          if (((i = n && !n[0]), (r = s && !s[0]), i || r))
            return i ? (r ? 0 : -o) : a;
          if (a != o) return a;
          if (((i = a < 0), (r = h == l), !n || !s))
            return r ? 0 : !n ^ i ? 1 : -1;
          if (!r) return (h > l) ^ i ? 1 : -1;
          for (o = (h = n.length) < (l = s.length) ? h : l, a = 0; a < o; a++)
            if (n[a] != s[a]) return (n[a] > s[a]) ^ i ? 1 : -1;
          return h == l ? 0 : (h > l) ^ i ? 1 : -1;
        }
        function y(t, e, i, r) {
          if (t < e || t > i || t !== h(t))
            throw Error(
              l +
                (r || "Argument") +
                ("number" == typeof t
                  ? t < e || t > i
                    ? " out of range: "
                    : " not an integer: "
                  : " not a primitive number: ") +
                String(t)
            );
        }
        function v(t) {
          var e = t.c.length - 1;
          return d(t.e / 14) == e && t.c[e] % 2 != 0;
        }
        function b(t, e) {
          return (
            (t.length > 1 ? t.charAt(0) + "." + t.slice(1) : t) +
            (e < 0 ? "e" : "e+") +
            e
          );
        }
        function _(t, e, i) {
          var r, n;
          if (e < 0) {
            for (n = i + "."; ++e; n += i);
            t = n + t;
          } else if (++e > (r = t.length)) {
            for (n = i, e -= r; --e; n += i);
            t += n;
          } else e < r && (t = t.slice(0, e) + "." + t.slice(e));
          return t;
        }
        ((s = (function t(e) {
          var i,
            r,
            n,
            s,
            w,
            A,
            x,
            S,
            k,
            E = (V.prototype = {
              constructor: V,
              toString: null,
              valueOf: null,
            }),
            P = new V(1),
            C = 20,
            D = 4,
            M = -7,
            T = 21,
            F = -1e7,
            O = 1e7,
            L = !1,
            I = 1,
            R = 0,
            j = {
              prefix: "",
              groupSize: 3,
              secondaryGroupSize: 0,
              groupSeparator: ",",
              decimalSeparator: ".",
              fractionGroupSize: 0,
              fractionGroupSeparator: " ",
              suffix: "",
            },
            N = "0123456789abcdefghijklmnopqrstuvwxyz",
            B = !0;
          function V(t, e) {
            var i,
              s,
              o,
              l,
              c,
              u,
              p,
              d,
              m = this;
            if (!(m instanceof V)) return new V(t, e);
            if (null == e) {
              if (t && !0 === t._isBigNumber)
                return (
                  (m.s = t.s),
                  void (!t.c || t.e > O
                    ? (m.c = m.e = null)
                    : t.e < F
                    ? (m.c = [(m.e = 0)])
                    : ((m.e = t.e), (m.c = t.c.slice())))
                );
              if ((u = "number" == typeof t) && 0 * t == 0) {
                if (((m.s = 1 / t < 0 ? ((t = -t), -1) : 1), t === ~~t)) {
                  for (l = 0, c = t; c >= 10; c /= 10, l++);
                  return void (l > O
                    ? (m.c = m.e = null)
                    : ((m.e = l), (m.c = [t])));
                }
                d = String(t);
              } else {
                if (!a.test((d = String(t)))) return n(m, d, u);
                m.s = 45 == d.charCodeAt(0) ? ((d = d.slice(1)), -1) : 1;
              }
              (l = d.indexOf(".")) > -1 && (d = d.replace(".", "")),
                (c = d.search(/e/i)) > 0
                  ? (l < 0 && (l = c),
                    (l += +d.slice(c + 1)),
                    (d = d.substring(0, c)))
                  : l < 0 && (l = d.length);
            } else {
              if ((y(e, 2, N.length, "Base"), 10 == e && B))
                return U((m = new V(t)), C + m.e + 1, D);
              if (((d = String(t)), (u = "number" == typeof t))) {
                if (0 * t != 0) return n(m, d, u, e);
                if (
                  ((m.s = 1 / t < 0 ? ((d = d.slice(1)), -1) : 1),
                  V.DEBUG && d.replace(/^0\.0*|\./, "").length > 15)
                )
                  throw Error(f + t);
              } else m.s = 45 === d.charCodeAt(0) ? ((d = d.slice(1)), -1) : 1;
              for (i = N.slice(0, e), l = c = 0, p = d.length; c < p; c++)
                if (i.indexOf((s = d.charAt(c))) < 0) {
                  if ("." == s) {
                    if (c > l) {
                      l = p;
                      continue;
                    }
                  } else if (
                    !o &&
                    ((d == d.toUpperCase() && (d = d.toLowerCase())) ||
                      (d == d.toLowerCase() && (d = d.toUpperCase())))
                  ) {
                    (o = !0), (c = -1), (l = 0);
                    continue;
                  }
                  return n(m, String(t), u, e);
                }
              (u = !1),
                (l = (d = r(d, e, 10, m.s)).indexOf(".")) > -1
                  ? (d = d.replace(".", ""))
                  : (l = d.length);
            }
            for (c = 0; 48 === d.charCodeAt(c); c++);
            for (p = d.length; 48 === d.charCodeAt(--p); );
            if ((d = d.slice(c, ++p))) {
              if (
                ((p -= c),
                u && V.DEBUG && p > 15 && (t > 9007199254740991 || t !== h(t)))
              )
                throw Error(f + m.s * t);
              if ((l = l - c - 1) > O) m.c = m.e = null;
              else if (l < F) m.c = [(m.e = 0)];
              else {
                if (
                  ((m.e = l),
                  (m.c = []),
                  (c = (l + 1) % 14),
                  l < 0 && (c += 14),
                  c < p)
                ) {
                  for (c && m.c.push(+d.slice(0, c)), p -= 14; c < p; )
                    m.c.push(+d.slice(c, (c += 14)));
                  c = 14 - (d = d.slice(c)).length;
                } else c -= p;
                for (; c--; d += "0");
                m.c.push(+d);
              }
            } else m.c = [(m.e = 0)];
          }
          function H(t, e, i, r) {
            var n, s, a, o, h;
            if ((null == i ? (i = D) : y(i, 0, 8), !t.c)) return t.toString();
            if (((n = t.c[0]), (a = t.e), null == e))
              (h = m(t.c)),
                (h =
                  1 == r || (2 == r && (a <= M || a >= T))
                    ? b(h, a)
                    : _(h, a, "0"));
            else if (
              ((s = (t = U(new V(t), e, i)).e),
              (o = (h = m(t.c)).length),
              1 == r || (2 == r && (e <= s || s <= M)))
            ) {
              for (; o < e; h += "0", o++);
              h = b(h, s);
            } else if (
              ((e -= a + (2 === r && s > a)), (h = _(h, s, "0")), s + 1 > o)
            ) {
              if (--e > 0) for (h += "."; e--; h += "0");
            } else if ((e += s - o) > 0)
              for (s + 1 == o && (h += "."); e--; h += "0");
            return t.s < 0 && n ? "-" + h : h;
          }
          function z(t, e) {
            for (var i, r, n = 1, s = new V(t[0]); n < t.length; n++)
              (!(r = new V(t[n])).s ||
                (i = g(s, r)) === e ||
                (0 === i && s.s === e)) &&
                (s = r);
            return s;
          }
          function q(t, e, i) {
            for (var r = 1, n = e.length; !e[--n]; e.pop());
            for (n = e[0]; n >= 10; n /= 10, r++);
            return (
              (i = r + 14 * i - 1) > O
                ? (t.c = t.e = null)
                : i < F
                ? (t.c = [(t.e = 0)])
                : ((t.e = i), (t.c = e)),
              t
            );
          }
          function U(t, e, i, r) {
            var n,
              s,
              a,
              l,
              f,
              p,
              d,
              m = t.c,
              g = u;
            if (m) {
              t: {
                for (n = 1, l = m[0]; l >= 10; l /= 10, n++);
                if ((s = e - n) < 0)
                  (s += 14),
                    (a = e),
                    (f = m[(p = 0)]),
                    (d = h((f / g[n - a - 1]) % 10));
                else if ((p = o((s + 1) / 14)) >= m.length) {
                  if (!r) break t;
                  for (; m.length <= p; m.push(0));
                  (f = d = 0), (n = 1), (a = (s %= 14) - 14 + 1);
                } else {
                  for (f = l = m[p], n = 1; l >= 10; l /= 10, n++);
                  d =
                    (a = (s %= 14) - 14 + n) < 0
                      ? 0
                      : h((f / g[n - a - 1]) % 10);
                }
                if (
                  ((r =
                    r ||
                    e < 0 ||
                    null != m[p + 1] ||
                    (a < 0 ? f : f % g[n - a - 1])),
                  (r =
                    i < 4
                      ? (d || r) && (0 == i || i == (t.s < 0 ? 3 : 2))
                      : d > 5 ||
                        (5 == d &&
                          (4 == i ||
                            r ||
                            (6 == i &&
                              (s > 0 ? (a > 0 ? f / g[n - a] : 0) : m[p - 1]) %
                                10 &
                                1) ||
                            i == (t.s < 0 ? 8 : 7)))),
                  e < 1 || !m[0])
                )
                  return (
                    (m.length = 0),
                    r
                      ? ((e -= t.e + 1),
                        (m[0] = g[(14 - (e % 14)) % 14]),
                        (t.e = -e || 0))
                      : (m[0] = t.e = 0),
                    t
                  );
                if (
                  (0 == s
                    ? ((m.length = p), (l = 1), p--)
                    : ((m.length = p + 1),
                      (l = g[14 - s]),
                      (m[p] = a > 0 ? h((f / g[n - a]) % g[a]) * l : 0)),
                  r)
                )
                  for (;;) {
                    if (0 == p) {
                      for (s = 1, a = m[0]; a >= 10; a /= 10, s++);
                      for (a = m[0] += l, l = 1; a >= 10; a /= 10, l++);
                      s != l && (t.e++, m[0] == c && (m[0] = 1));
                      break;
                    }
                    if (((m[p] += l), m[p] != c)) break;
                    (m[p--] = 0), (l = 1);
                  }
                for (s = m.length; 0 === m[--s]; m.pop());
              }
              t.e > O ? (t.c = t.e = null) : t.e < F && (t.c = [(t.e = 0)]);
            }
            return t;
          }
          function W(t) {
            var e,
              i = t.e;
            return null === i
              ? t.toString()
              : ((e = m(t.c)),
                (e = i <= M || i >= T ? b(e, i) : _(e, i, "0")),
                t.s < 0 ? "-" + e : e);
          }
          return (
            (V.clone = t),
            (V.ROUND_UP = 0),
            (V.ROUND_DOWN = 1),
            (V.ROUND_CEIL = 2),
            (V.ROUND_FLOOR = 3),
            (V.ROUND_HALF_UP = 4),
            (V.ROUND_HALF_DOWN = 5),
            (V.ROUND_HALF_EVEN = 6),
            (V.ROUND_HALF_CEIL = 7),
            (V.ROUND_HALF_FLOOR = 8),
            (V.EUCLID = 9),
            (V.config = V.set =
              function (t) {
                var e, i;
                if (null != t) {
                  if ("object" != typeof t)
                    throw Error(l + "Object expected: " + t);
                  if (
                    (t.hasOwnProperty((e = "DECIMAL_PLACES")) &&
                      (y((i = t[e]), 0, p, e), (C = i)),
                    t.hasOwnProperty((e = "ROUNDING_MODE")) &&
                      (y((i = t[e]), 0, 8, e), (D = i)),
                    t.hasOwnProperty((e = "EXPONENTIAL_AT")) &&
                      ((i = t[e]) && i.pop
                        ? (y(i[0], -p, 0, e),
                          y(i[1], 0, p, e),
                          (M = i[0]),
                          (T = i[1]))
                        : (y(i, -p, p, e), (M = -(T = i < 0 ? -i : i)))),
                    t.hasOwnProperty((e = "RANGE")))
                  )
                    if ((i = t[e]) && i.pop)
                      y(i[0], -p, -1, e),
                        y(i[1], 1, p, e),
                        (F = i[0]),
                        (O = i[1]);
                    else {
                      if ((y(i, -p, p, e), !i))
                        throw Error(l + e + " cannot be zero: " + i);
                      F = -(O = i < 0 ? -i : i);
                    }
                  if (t.hasOwnProperty((e = "CRYPTO"))) {
                    if ((i = t[e]) !== !!i)
                      throw Error(l + e + " not true or false: " + i);
                    if (i) {
                      if (
                        "undefined" == typeof crypto ||
                        !crypto ||
                        (!crypto.getRandomValues && !crypto.randomBytes)
                      )
                        throw ((L = !i), Error(l + "crypto unavailable"));
                      L = i;
                    } else L = i;
                  }
                  if (
                    (t.hasOwnProperty((e = "MODULO_MODE")) &&
                      (y((i = t[e]), 0, 9, e), (I = i)),
                    t.hasOwnProperty((e = "POW_PRECISION")) &&
                      (y((i = t[e]), 0, p, e), (R = i)),
                    t.hasOwnProperty((e = "FORMAT")))
                  ) {
                    if ("object" != typeof (i = t[e]))
                      throw Error(l + e + " not an object: " + i);
                    j = i;
                  }
                  if (t.hasOwnProperty((e = "ALPHABET"))) {
                    if (
                      "string" != typeof (i = t[e]) ||
                      /^.?$|[+\-.\s]|(.).*\1/.test(i)
                    )
                      throw Error(l + e + " invalid: " + i);
                    (B = "0123456789" == i.slice(0, 10)), (N = i);
                  }
                }
                return {
                  DECIMAL_PLACES: C,
                  ROUNDING_MODE: D,
                  EXPONENTIAL_AT: [M, T],
                  RANGE: [F, O],
                  CRYPTO: L,
                  MODULO_MODE: I,
                  POW_PRECISION: R,
                  FORMAT: j,
                  ALPHABET: N,
                };
              }),
            (V.isBigNumber = function (t) {
              if (!t || !0 !== t._isBigNumber) return !1;
              if (!V.DEBUG) return !0;
              var e,
                i,
                r = t.c,
                n = t.e,
                s = t.s;
              t: if ("[object Array]" == {}.toString.call(r)) {
                if ((1 === s || -1 === s) && n >= -p && n <= p && n === h(n)) {
                  if (0 === r[0]) {
                    if (0 === n && 1 === r.length) return !0;
                    break t;
                  }
                  if (
                    ((e = (n + 1) % 14) < 1 && (e += 14),
                    String(r[0]).length == e)
                  ) {
                    for (e = 0; e < r.length; e++)
                      if ((i = r[e]) < 0 || i >= c || i !== h(i)) break t;
                    if (0 !== i) return !0;
                  }
                }
              } else if (
                null === r &&
                null === n &&
                (null === s || 1 === s || -1 === s)
              )
                return !0;
              throw Error(l + "Invalid BigNumber: " + t);
            }),
            (V.maximum = V.max =
              function () {
                return z(arguments, -1);
              }),
            (V.minimum = V.min =
              function () {
                return z(arguments, 1);
              }),
            (V.random =
              ((s =
                (9007199254740992 * Math.random()) & 2097151
                  ? function () {
                      return h(9007199254740992 * Math.random());
                    }
                  : function () {
                      return (
                        8388608 * ((1073741824 * Math.random()) | 0) +
                        ((8388608 * Math.random()) | 0)
                      );
                    }),
              function (t) {
                var e,
                  i,
                  r,
                  n,
                  a,
                  f = 0,
                  c = [],
                  d = new V(P);
                if ((null == t ? (t = C) : y(t, 0, p), (n = o(t / 14)), L))
                  if (crypto.getRandomValues) {
                    for (
                      e = crypto.getRandomValues(new Uint32Array((n *= 2)));
                      f < n;

                    )
                      (a = 131072 * e[f] + (e[f + 1] >>> 11)) >= 9e15
                        ? ((i = crypto.getRandomValues(new Uint32Array(2))),
                          (e[f] = i[0]),
                          (e[f + 1] = i[1]))
                        : (c.push(a % 1e14), (f += 2));
                    f = n / 2;
                  } else {
                    if (!crypto.randomBytes)
                      throw ((L = !1), Error(l + "crypto unavailable"));
                    for (e = crypto.randomBytes((n *= 7)); f < n; )
                      (a =
                        281474976710656 * (31 & e[f]) +
                        1099511627776 * e[f + 1] +
                        4294967296 * e[f + 2] +
                        16777216 * e[f + 3] +
                        (e[f + 4] << 16) +
                        (e[f + 5] << 8) +
                        e[f + 6]) >= 9e15
                        ? crypto.randomBytes(7).copy(e, f)
                        : (c.push(a % 1e14), (f += 7));
                    f = n / 7;
                  }
                if (!L) for (; f < n; ) (a = s()) < 9e15 && (c[f++] = a % 1e14);
                for (
                  t %= 14,
                    (n = c[--f]) &&
                      t &&
                      ((a = u[14 - t]), (c[f] = h(n / a) * a));
                  0 === c[f];
                  c.pop(), f--
                );
                if (f < 0) c = [(r = 0)];
                else {
                  for (r = -1; 0 === c[0]; c.splice(0, 1), r -= 14);
                  for (f = 1, a = c[0]; a >= 10; a /= 10, f++);
                  f < 14 && (r -= 14 - f);
                }
                return (d.e = r), (d.c = c), d;
              })),
            (V.sum = function () {
              for (var t = 1, e = arguments, i = new V(e[0]); t < e.length; )
                i = i.plus(e[t++]);
              return i;
            }),
            (r = (function () {
              function t(t, e, i, r) {
                for (var n, s, a = [0], o = 0, h = t.length; o < h; ) {
                  for (s = a.length; s--; a[s] *= e);
                  for (
                    a[0] += r.indexOf(t.charAt(o++)), n = 0;
                    n < a.length;
                    n++
                  )
                    a[n] > i - 1 &&
                      (null == a[n + 1] && (a[n + 1] = 0),
                      (a[n + 1] += (a[n] / i) | 0),
                      (a[n] %= i));
                }
                return a.reverse();
              }
              return function (e, r, n, s, a) {
                var o,
                  h,
                  l,
                  f,
                  c,
                  u,
                  p,
                  d,
                  g = e.indexOf("."),
                  y = C,
                  v = D;
                for (
                  g >= 0 &&
                    ((f = R),
                    (R = 0),
                    (e = e.replace(".", "")),
                    (u = (d = new V(r)).pow(e.length - g)),
                    (R = f),
                    (d.c = t(_(m(u.c), u.e, "0"), 10, n, "0123456789")),
                    (d.e = d.c.length)),
                    l = f =
                      (p = t(
                        e,
                        r,
                        n,
                        a ? ((o = N), "0123456789") : ((o = "0123456789"), N)
                      )).length;
                  0 == p[--f];
                  p.pop()
                );
                if (!p[0]) return o.charAt(0);
                if (
                  (g < 0
                    ? --l
                    : ((u.c = p),
                      (u.e = l),
                      (u.s = s),
                      (p = (u = i(u, d, y, v, n)).c),
                      (c = u.r),
                      (l = u.e)),
                  (g = p[(h = l + y + 1)]),
                  (f = n / 2),
                  (c = c || h < 0 || null != p[h + 1]),
                  (c =
                    v < 4
                      ? (null != g || c) && (0 == v || v == (u.s < 0 ? 3 : 2))
                      : g > f ||
                        (g == f &&
                          (4 == v ||
                            c ||
                            (6 == v && 1 & p[h - 1]) ||
                            v == (u.s < 0 ? 8 : 7)))),
                  h < 1 || !p[0])
                )
                  e = c ? _(o.charAt(1), -y, o.charAt(0)) : o.charAt(0);
                else {
                  if (((p.length = h), c))
                    for (--n; ++p[--h] > n; )
                      (p[h] = 0), h || (++l, (p = [1].concat(p)));
                  for (f = p.length; !p[--f]; );
                  for (g = 0, e = ""; g <= f; e += o.charAt(p[g++]));
                  e = _(e, l, o.charAt(0));
                }
                return e;
              };
            })()),
            (i = (function () {
              function t(t, e, i) {
                var r,
                  n,
                  s,
                  a,
                  o = 0,
                  h = t.length,
                  l = e % 1e7,
                  f = (e / 1e7) | 0;
                for (t = t.slice(); h--; )
                  (o =
                    (((n =
                      l * (s = t[h] % 1e7) +
                      ((r = f * s + (a = (t[h] / 1e7) | 0) * l) % 1e7) * 1e7 +
                      o) /
                      i) |
                      0) +
                    ((r / 1e7) | 0) +
                    f * a),
                    (t[h] = n % i);
                return o && (t = [o].concat(t)), t;
              }
              function e(t, e, i, r) {
                var n, s;
                if (i != r) s = i > r ? 1 : -1;
                else
                  for (n = s = 0; n < i; n++)
                    if (t[n] != e[n]) {
                      s = t[n] > e[n] ? 1 : -1;
                      break;
                    }
                return s;
              }
              function i(t, e, i, r) {
                for (var n = 0; i--; )
                  (t[i] -= n),
                    (n = t[i] < e[i] ? 1 : 0),
                    (t[i] = n * r + t[i] - e[i]);
                for (; !t[0] && t.length > 1; t.splice(0, 1));
              }
              return function (r, n, s, a, o) {
                var l,
                  f,
                  u,
                  p,
                  m,
                  g,
                  y,
                  v,
                  b,
                  _,
                  w,
                  A,
                  x,
                  S,
                  k,
                  E,
                  P,
                  C = r.s == n.s ? 1 : -1,
                  D = r.c,
                  M = n.c;
                if (!(D && D[0] && M && M[0]))
                  return new V(
                    r.s && n.s && (D ? !M || D[0] != M[0] : M)
                      ? (D && 0 == D[0]) || !M
                        ? 0 * C
                        : C / 0
                      : NaN
                  );
                for (
                  b = (v = new V(C)).c = [],
                    C = s + (f = r.e - n.e) + 1,
                    o ||
                      ((o = c),
                      (f = d(r.e / 14) - d(n.e / 14)),
                      (C = (C / 14) | 0)),
                    u = 0;
                  M[u] == (D[u] || 0);
                  u++
                );
                if ((M[u] > (D[u] || 0) && f--, C < 0)) b.push(1), (p = !0);
                else {
                  for (
                    S = D.length,
                      E = M.length,
                      u = 0,
                      C += 2,
                      (m = h(o / (M[0] + 1))) > 1 &&
                        ((M = t(M, m, o)),
                        (D = t(D, m, o)),
                        (E = M.length),
                        (S = D.length)),
                      x = E,
                      w = (_ = D.slice(0, E)).length;
                    w < E;
                    _[w++] = 0
                  );
                  (P = M.slice()),
                    (P = [0].concat(P)),
                    (k = M[0]),
                    M[1] >= o / 2 && k++;
                  do {
                    if (((m = 0), (l = e(M, _, E, w)) < 0)) {
                      if (
                        ((A = _[0]),
                        E != w && (A = A * o + (_[1] || 0)),
                        (m = h(A / k)) > 1)
                      )
                        for (
                          m >= o && (m = o - 1),
                            y = (g = t(M, m, o)).length,
                            w = _.length;
                          1 == e(g, _, y, w);

                        )
                          m--,
                            i(g, E < y ? P : M, y, o),
                            (y = g.length),
                            (l = 1);
                      else 0 == m && (l = m = 1), (y = (g = M.slice()).length);
                      if (
                        (y < w && (g = [0].concat(g)),
                        i(_, g, w, o),
                        (w = _.length),
                        -1 == l)
                      )
                        for (; e(M, _, E, w) < 1; )
                          m++, i(_, E < w ? P : M, w, o), (w = _.length);
                    } else 0 === l && (m++, (_ = [0]));
                    (b[u++] = m),
                      _[0] ? (_[w++] = D[x] || 0) : ((_ = [D[x]]), (w = 1));
                  } while ((x++ < S || null != _[0]) && C--);
                  (p = null != _[0]), b[0] || b.splice(0, 1);
                }
                if (o == c) {
                  for (u = 1, C = b[0]; C >= 10; C /= 10, u++);
                  U(v, s + (v.e = u + 14 * f - 1) + 1, a, p);
                } else (v.e = f), (v.r = +p);
                return v;
              };
            })()),
            (w = /^(-?)0([xbo])(?=\w[\w.]*$)/i),
            (A = /^([^.]+)\.$/),
            (x = /^\.([^.]+)$/),
            (S = /^-?(Infinity|NaN)$/),
            (k = /^\s*\+(?=[\w.])|^\s+|\s+$/g),
            (n = function (t, e, i, r) {
              var n,
                s = i ? e : e.replace(k, "");
              if (S.test(s)) t.s = isNaN(s) ? null : s < 0 ? -1 : 1;
              else {
                if (
                  !i &&
                  ((s = s.replace(w, function (t, e, i) {
                    return (
                      (n =
                        "x" == (i = i.toLowerCase()) ? 16 : "b" == i ? 2 : 8),
                      r && r != n ? t : e
                    );
                  })),
                  r && ((n = r), (s = s.replace(A, "$1").replace(x, "0.$1"))),
                  e != s)
                )
                  return new V(s, n);
                if (V.DEBUG)
                  throw Error(
                    l + "Not a" + (r ? " base " + r : "") + " number: " + e
                  );
                t.s = null;
              }
              t.c = t.e = null;
            }),
            (E.absoluteValue = E.abs =
              function () {
                var t = new V(this);
                return t.s < 0 && (t.s = 1), t;
              }),
            (E.comparedTo = function (t, e) {
              return g(this, new V(t, e));
            }),
            (E.decimalPlaces = E.dp =
              function (t, e) {
                var i,
                  r,
                  n,
                  s = this;
                if (null != t)
                  return (
                    y(t, 0, p),
                    null == e ? (e = D) : y(e, 0, 8),
                    U(new V(s), t + s.e + 1, e)
                  );
                if (!(i = s.c)) return null;
                if (
                  ((r = 14 * ((n = i.length - 1) - d(this.e / 14))), (n = i[n]))
                )
                  for (; n % 10 == 0; n /= 10, r--);
                return r < 0 && (r = 0), r;
              }),
            (E.dividedBy = E.div =
              function (t, e) {
                return i(this, new V(t, e), C, D);
              }),
            (E.dividedToIntegerBy = E.idiv =
              function (t, e) {
                return i(this, new V(t, e), 0, 1);
              }),
            (E.exponentiatedBy = E.pow =
              function (t, e) {
                var i,
                  r,
                  n,
                  s,
                  a,
                  f,
                  c,
                  u,
                  p = this;
                if ((t = new V(t)).c && !t.isInteger())
                  throw Error(l + "Exponent not an integer: " + W(t));
                if (
                  (null != e && (e = new V(e)),
                  (a = t.e > 14),
                  !p.c ||
                    !p.c[0] ||
                    (1 == p.c[0] && !p.e && 1 == p.c.length) ||
                    !t.c ||
                    !t.c[0])
                )
                  return (
                    (u = new V(Math.pow(+W(p), a ? t.s * (2 - v(t)) : +W(t)))),
                    e ? u.mod(e) : u
                  );
                if (((f = t.s < 0), e)) {
                  if (e.c ? !e.c[0] : !e.s) return new V(NaN);
                  (r = !f && p.isInteger() && e.isInteger()) && (p = p.mod(e));
                } else {
                  if (
                    t.e > 9 &&
                    (p.e > 0 ||
                      p.e < -1 ||
                      (0 == p.e
                        ? p.c[0] > 1 || (a && p.c[1] >= 24e7)
                        : p.c[0] < 8e13 || (a && p.c[0] <= 9999975e7)))
                  )
                    return (
                      (s = p.s < 0 && v(t) ? -0 : 0),
                      p.e > -1 && (s = 1 / s),
                      new V(f ? 1 / s : s)
                    );
                  R && (s = o(R / 14 + 2));
                }
                for (
                  a
                    ? ((i = new V(0.5)), f && (t.s = 1), (c = v(t)))
                    : (c = (n = Math.abs(+W(t))) % 2),
                    u = new V(P);
                  ;

                ) {
                  if (c) {
                    if (!(u = u.times(p)).c) break;
                    s
                      ? u.c.length > s && (u.c.length = s)
                      : r && (u = u.mod(e));
                  }
                  if (n) {
                    if (0 === (n = h(n / 2))) break;
                    c = n % 2;
                  } else if ((U((t = t.times(i)), t.e + 1, 1), t.e > 14))
                    c = v(t);
                  else {
                    if (0 === (n = +W(t))) break;
                    c = n % 2;
                  }
                  (p = p.times(p)),
                    s
                      ? p.c && p.c.length > s && (p.c.length = s)
                      : r && (p = p.mod(e));
                }
                return r
                  ? u
                  : (f && (u = P.div(u)),
                    e ? u.mod(e) : s ? U(u, R, D, void 0) : u);
              }),
            (E.integerValue = function (t) {
              var e = new V(this);
              return null == t ? (t = D) : y(t, 0, 8), U(e, e.e + 1, t);
            }),
            (E.isEqualTo = E.eq =
              function (t, e) {
                return 0 === g(this, new V(t, e));
              }),
            (E.isFinite = function () {
              return !!this.c;
            }),
            (E.isGreaterThan = E.gt =
              function (t, e) {
                return g(this, new V(t, e)) > 0;
              }),
            (E.isGreaterThanOrEqualTo = E.gte =
              function (t, e) {
                return 1 === (e = g(this, new V(t, e))) || 0 === e;
              }),
            (E.isInteger = function () {
              return !!this.c && d(this.e / 14) > this.c.length - 2;
            }),
            (E.isLessThan = E.lt =
              function (t, e) {
                return g(this, new V(t, e)) < 0;
              }),
            (E.isLessThanOrEqualTo = E.lte =
              function (t, e) {
                return -1 === (e = g(this, new V(t, e))) || 0 === e;
              }),
            (E.isNaN = function () {
              return !this.s;
            }),
            (E.isNegative = function () {
              return this.s < 0;
            }),
            (E.isPositive = function () {
              return this.s > 0;
            }),
            (E.isZero = function () {
              return !!this.c && 0 == this.c[0];
            }),
            (E.minus = function (t, e) {
              var i,
                r,
                n,
                s,
                a = this,
                o = a.s;
              if (((e = (t = new V(t, e)).s), !o || !e)) return new V(NaN);
              if (o != e) return (t.s = -e), a.plus(t);
              var h = a.e / 14,
                l = t.e / 14,
                f = a.c,
                u = t.c;
              if (!h || !l) {
                if (!f || !u) return f ? ((t.s = -e), t) : new V(u ? a : NaN);
                if (!f[0] || !u[0])
                  return u[0]
                    ? ((t.s = -e), t)
                    : new V(f[0] ? a : 3 == D ? -0 : 0);
              }
              if (((h = d(h)), (l = d(l)), (f = f.slice()), (o = h - l))) {
                for (
                  (s = o < 0) ? ((o = -o), (n = f)) : ((l = h), (n = u)),
                    n.reverse(),
                    e = o;
                  e--;
                  n.push(0)
                );
                n.reverse();
              } else
                for (
                  r = (s = (o = f.length) < (e = u.length)) ? o : e, o = e = 0;
                  e < r;
                  e++
                )
                  if (f[e] != u[e]) {
                    s = f[e] < u[e];
                    break;
                  }
              if (
                (s && ((n = f), (f = u), (u = n), (t.s = -t.s)),
                (e = (r = u.length) - (i = f.length)) > 0)
              )
                for (; e--; f[i++] = 0);
              for (e = c - 1; r > o; ) {
                if (f[--r] < u[r]) {
                  for (i = r; i && !f[--i]; f[i] = e);
                  --f[i], (f[r] += c);
                }
                f[r] -= u[r];
              }
              for (; 0 == f[0]; f.splice(0, 1), --l);
              return f[0]
                ? q(t, f, l)
                : ((t.s = 3 == D ? -1 : 1), (t.c = [(t.e = 0)]), t);
            }),
            (E.modulo = E.mod =
              function (t, e) {
                var r,
                  n,
                  s = this;
                return (
                  (t = new V(t, e)),
                  !s.c || !t.s || (t.c && !t.c[0])
                    ? new V(NaN)
                    : !t.c || (s.c && !s.c[0])
                    ? new V(s)
                    : (9 == I
                        ? ((n = t.s),
                          (t.s = 1),
                          (r = i(s, t, 0, 3)),
                          (t.s = n),
                          (r.s *= n))
                        : (r = i(s, t, 0, I)),
                      (t = s.minus(r.times(t))).c[0] || 1 != I || (t.s = s.s),
                      t)
                );
              }),
            (E.multipliedBy = E.times =
              function (t, e) {
                var i,
                  r,
                  n,
                  s,
                  a,
                  o,
                  h,
                  l,
                  f,
                  u,
                  p,
                  m,
                  g,
                  y,
                  v = this,
                  b = v.c,
                  _ = (t = new V(t, e)).c;
                if (!(b && _ && b[0] && _[0]))
                  return (
                    !v.s || !t.s || (b && !b[0] && !_) || (_ && !_[0] && !b)
                      ? (t.c = t.e = t.s = null)
                      : ((t.s *= v.s),
                        b && _ ? ((t.c = [0]), (t.e = 0)) : (t.c = t.e = null)),
                    t
                  );
                for (
                  r = d(v.e / 14) + d(t.e / 14),
                    t.s *= v.s,
                    (h = b.length) < (u = _.length) &&
                      ((g = b), (b = _), (_ = g), (n = h), (h = u), (u = n)),
                    n = h + u,
                    g = [];
                  n--;
                  g.push(0)
                );
                for (y = c, 1e7, n = u; --n >= 0; ) {
                  for (
                    i = 0,
                      p = _[n] % 1e7,
                      m = (_[n] / 1e7) | 0,
                      s = n + (a = h);
                    s > n;

                  )
                    (i =
                      (((l =
                        p * (l = b[--a] % 1e7) +
                        ((o = m * l + (f = (b[a] / 1e7) | 0) * p) % 1e7) * 1e7 +
                        g[s] +
                        i) /
                        y) |
                        0) +
                      ((o / 1e7) | 0) +
                      m * f),
                      (g[s--] = l % y);
                  g[s] = i;
                }
                return i ? ++r : g.splice(0, 1), q(t, g, r);
              }),
            (E.negated = function () {
              var t = new V(this);
              return (t.s = -t.s || null), t;
            }),
            (E.plus = function (t, e) {
              var i,
                r = this,
                n = r.s;
              if (((e = (t = new V(t, e)).s), !n || !e)) return new V(NaN);
              if (n != e) return (t.s = -e), r.minus(t);
              var s = r.e / 14,
                a = t.e / 14,
                o = r.c,
                h = t.c;
              if (!s || !a) {
                if (!o || !h) return new V(n / 0);
                if (!o[0] || !h[0]) return h[0] ? t : new V(o[0] ? r : 0 * n);
              }
              if (((s = d(s)), (a = d(a)), (o = o.slice()), (n = s - a))) {
                for (
                  n > 0 ? ((a = s), (i = h)) : ((n = -n), (i = o)), i.reverse();
                  n--;
                  i.push(0)
                );
                i.reverse();
              }
              for (
                (n = o.length) - (e = h.length) < 0 &&
                  ((i = h), (h = o), (o = i), (e = n)),
                  n = 0;
                e;

              )
                (n = ((o[--e] = o[e] + h[e] + n) / c) | 0),
                  (o[e] = c === o[e] ? 0 : o[e] % c);
              return n && ((o = [n].concat(o)), ++a), q(t, o, a);
            }),
            (E.precision = E.sd =
              function (t, e) {
                var i,
                  r,
                  n,
                  s = this;
                if (null != t && t !== !!t)
                  return (
                    y(t, 1, p),
                    null == e ? (e = D) : y(e, 0, 8),
                    U(new V(s), t, e)
                  );
                if (!(i = s.c)) return null;
                if (((r = 14 * (n = i.length - 1) + 1), (n = i[n]))) {
                  for (; n % 10 == 0; n /= 10, r--);
                  for (n = i[0]; n >= 10; n /= 10, r++);
                }
                return t && s.e + 1 > r && (r = s.e + 1), r;
              }),
            (E.shiftedBy = function (t) {
              return (
                y(t, -9007199254740991, 9007199254740991), this.times("1e" + t)
              );
            }),
            (E.squareRoot = E.sqrt =
              function () {
                var t,
                  e,
                  r,
                  n,
                  s,
                  a = this,
                  o = a.c,
                  h = a.s,
                  l = a.e,
                  f = C + 4,
                  c = new V("0.5");
                if (1 !== h || !o || !o[0])
                  return new V(
                    !h || (h < 0 && (!o || o[0])) ? NaN : o ? a : 1 / 0
                  );
                if (
                  (0 == (h = Math.sqrt(+W(a))) || h == 1 / 0
                    ? (((e = m(o)).length + l) % 2 == 0 && (e += "0"),
                      (h = Math.sqrt(+e)),
                      (l = d((l + 1) / 2) - (l < 0 || l % 2)),
                      (r = new V(
                        (e =
                          h == 1 / 0
                            ? "5e" + l
                            : (e = h.toExponential()).slice(
                                0,
                                e.indexOf("e") + 1
                              ) + l)
                      )))
                    : (r = new V(h + "")),
                  r.c[0])
                )
                  for ((h = (l = r.e) + f) < 3 && (h = 0); ; )
                    if (
                      ((s = r),
                      (r = c.times(s.plus(i(a, s, f, 1)))),
                      m(s.c).slice(0, h) === (e = m(r.c)).slice(0, h))
                    ) {
                      if (
                        (r.e < l && --h,
                        "9999" != (e = e.slice(h - 3, h + 1)) &&
                          (n || "4999" != e))
                      ) {
                        (+e && (+e.slice(1) || "5" != e.charAt(0))) ||
                          (U(r, r.e + C + 2, 1), (t = !r.times(r).eq(a)));
                        break;
                      }
                      if (!n && (U(s, s.e + C + 2, 0), s.times(s).eq(a))) {
                        r = s;
                        break;
                      }
                      (f += 4), (h += 4), (n = 1);
                    }
                return U(r, r.e + C + 1, D, t);
              }),
            (E.toExponential = function (t, e) {
              return null != t && (y(t, 0, p), t++), H(this, t, e, 1);
            }),
            (E.toFixed = function (t, e) {
              return (
                null != t && (y(t, 0, p), (t = t + this.e + 1)), H(this, t, e)
              );
            }),
            (E.toFormat = function (t, e, i) {
              var r,
                n = this;
              if (null == i)
                null != t && e && "object" == typeof e
                  ? ((i = e), (e = null))
                  : t && "object" == typeof t
                  ? ((i = t), (t = e = null))
                  : (i = j);
              else if ("object" != typeof i)
                throw Error(l + "Argument not an object: " + i);
              if (((r = n.toFixed(t, e)), n.c)) {
                var s,
                  a = r.split("."),
                  o = +i.groupSize,
                  h = +i.secondaryGroupSize,
                  f = i.groupSeparator || "",
                  c = a[0],
                  u = a[1],
                  p = n.s < 0,
                  d = p ? c.slice(1) : c,
                  m = d.length;
                if (
                  (h && ((s = o), (o = h), (h = s), (m -= s)), o > 0 && m > 0)
                ) {
                  for (s = m % o || o, c = d.substr(0, s); s < m; s += o)
                    c += f + d.substr(s, o);
                  h > 0 && (c += f + d.slice(s)), p && (c = "-" + c);
                }
                r = u
                  ? c +
                    (i.decimalSeparator || "") +
                    ((h = +i.fractionGroupSize)
                      ? u.replace(
                          new RegExp("\\d{" + h + "}\\B", "g"),
                          "$&" + (i.fractionGroupSeparator || "")
                        )
                      : u)
                  : c;
              }
              return (i.prefix || "") + r + (i.suffix || "");
            }),
            (E.toFraction = function (t) {
              var e,
                r,
                n,
                s,
                a,
                o,
                h,
                f,
                c,
                p,
                d,
                g,
                y = this,
                v = y.c;
              if (
                null != t &&
                ((!(h = new V(t)).isInteger() && (h.c || 1 !== h.s)) || h.lt(P))
              )
                throw Error(
                  l +
                    "Argument " +
                    (h.isInteger() ? "out of range: " : "not an integer: ") +
                    W(h)
                );
              if (!v) return new V(y);
              for (
                e = new V(P),
                  c = r = new V(P),
                  n = f = new V(P),
                  g = m(v),
                  a = e.e = g.length - y.e - 1,
                  e.c[0] = u[(o = a % 14) < 0 ? 14 + o : o],
                  t = !t || h.comparedTo(e) > 0 ? (a > 0 ? e : c) : h,
                  o = O,
                  O = 1 / 0,
                  h = new V(g),
                  f.c[0] = 0;
                (p = i(h, e, 0, 1)),
                  1 != (s = r.plus(p.times(n))).comparedTo(t);

              )
                (r = n),
                  (n = s),
                  (c = f.plus(p.times((s = c)))),
                  (f = s),
                  (e = h.minus(p.times((s = e)))),
                  (h = s);
              return (
                (s = i(t.minus(r), n, 0, 1)),
                (f = f.plus(s.times(c))),
                (r = r.plus(s.times(n))),
                (f.s = c.s = y.s),
                (d =
                  i(c, n, (a *= 2), D)
                    .minus(y)
                    .abs()
                    .comparedTo(i(f, r, a, D).minus(y).abs()) < 1
                    ? [c, n]
                    : [f, r]),
                (O = o),
                d
              );
            }),
            (E.toNumber = function () {
              return +W(this);
            }),
            (E.toPrecision = function (t, e) {
              return null != t && y(t, 1, p), H(this, t, e, 2);
            }),
            (E.toString = function (t) {
              var e,
                i = this,
                n = i.s,
                s = i.e;
              return (
                null === s
                  ? n
                    ? ((e = "Infinity"), n < 0 && (e = "-" + e))
                    : (e = "NaN")
                  : (null == t
                      ? (e =
                          s <= M || s >= T ? b(m(i.c), s) : _(m(i.c), s, "0"))
                      : 10 === t && B
                      ? (e = _(m((i = U(new V(i), C + s + 1, D)).c), i.e, "0"))
                      : (y(t, 2, N.length, "Base"),
                        (e = r(_(m(i.c), s, "0"), 10, t, n, !0))),
                    n < 0 && i.c[0] && (e = "-" + e)),
                e
              );
            }),
            (E.valueOf = E.toJSON =
              function () {
                return W(this);
              }),
            (E._isBigNumber = !0),
            null != e && V.set(e),
            V
          );
        })()).default = s.BigNumber =
          s),
          void 0 ===
            (r = function () {
              return s;
            }.call(e, i, e, t)) || (t.exports = r);
      })();
    },
    "9e69": function (t, e, i) {
      var r = i("2b3e").Symbol;
      t.exports = r;
    },
    "9e6a": function (t, e, i) {
      "use strict";
      var r = i("d233"),
        n = Object.prototype.hasOwnProperty,
        s = {
          allowDots: !1,
          allowPrototypes: !1,
          arrayLimit: 20,
          decoder: r.decode,
          delimiter: "&",
          depth: 5,
          parameterLimit: 1e3,
          plainObjects: !1,
          strictNullHandling: !1,
        },
        a = function (t, e, i) {
          if (t) {
            var r = i.allowDots ? t.replace(/\.([^.[]+)/g, "[$1]") : t,
              s = /(\[[^[\]]*])/g,
              a = /(\[[^[\]]*])/.exec(r),
              o = a ? r.slice(0, a.index) : r,
              h = [];
            if (o) {
              if (
                !i.plainObjects &&
                n.call(Object.prototype, o) &&
                !i.allowPrototypes
              )
                return;
              h.push(o);
            }
            for (var l = 0; null !== (a = s.exec(r)) && l < i.depth; ) {
              if (
                ((l += 1),
                !i.plainObjects &&
                  n.call(Object.prototype, a[1].slice(1, -1)) &&
                  !i.allowPrototypes)
              )
                return;
              h.push(a[1]);
            }
            return (
              a && h.push("[" + r.slice(a.index) + "]"),
              (function (t, e, i) {
                for (var r = e, n = t.length - 1; n >= 0; --n) {
                  var s,
                    a = t[n];
                  if ("[]" === a && i.parseArrays) s = [].concat(r);
                  else {
                    s = i.plainObjects ? Object.create(null) : {};
                    var o =
                        "[" === a.charAt(0) && "]" === a.charAt(a.length - 1)
                          ? a.slice(1, -1)
                          : a,
                      h = parseInt(o, 10);
                    i.parseArrays || "" !== o
                      ? !isNaN(h) &&
                        a !== o &&
                        String(h) === o &&
                        h >= 0 &&
                        i.parseArrays &&
                        h <= i.arrayLimit
                        ? ((s = [])[h] = r)
                        : "__proto__" !== o && (s[o] = r)
                      : (s = { 0: r });
                  }
                  r = s;
                }
                return r;
              })(h, e, i)
            );
          }
        };
      t.exports = function (t, e) {
        var i = e ? r.assign({}, e) : {};
        if (
          null !== i.decoder &&
          void 0 !== i.decoder &&
          "function" != typeof i.decoder
        )
          throw new TypeError("Decoder has to be a function.");
        if (
          ((i.ignoreQueryPrefix = !0 === i.ignoreQueryPrefix),
          (i.delimiter =
            "string" == typeof i.delimiter || r.isRegExp(i.delimiter)
              ? i.delimiter
              : s.delimiter),
          (i.depth = "number" == typeof i.depth ? i.depth : s.depth),
          (i.arrayLimit =
            "number" == typeof i.arrayLimit ? i.arrayLimit : s.arrayLimit),
          (i.parseArrays = !1 !== i.parseArrays),
          (i.decoder = "function" == typeof i.decoder ? i.decoder : s.decoder),
          (i.allowDots =
            "boolean" == typeof i.allowDots ? i.allowDots : s.allowDots),
          (i.plainObjects =
            "boolean" == typeof i.plainObjects
              ? i.plainObjects
              : s.plainObjects),
          (i.allowPrototypes =
            "boolean" == typeof i.allowPrototypes
              ? i.allowPrototypes
              : s.allowPrototypes),
          (i.parameterLimit =
            "number" == typeof i.parameterLimit
              ? i.parameterLimit
              : s.parameterLimit),
          (i.strictNullHandling =
            "boolean" == typeof i.strictNullHandling
              ? i.strictNullHandling
              : s.strictNullHandling),
          "" === t || null == t)
        )
          return i.plainObjects ? Object.create(null) : {};
        for (
          var o =
              "string" == typeof t
                ? (function (t, e) {
                    for (
                      var i = {},
                        r = e.ignoreQueryPrefix ? t.replace(/^\?/, "") : t,
                        a =
                          e.parameterLimit === 1 / 0
                            ? void 0
                            : e.parameterLimit,
                        o = r.split(e.delimiter, a),
                        h = 0;
                      h < o.length;
                      ++h
                    ) {
                      var l,
                        f,
                        c = o[h],
                        u = c.indexOf("]="),
                        p = -1 === u ? c.indexOf("=") : u + 1;
                      -1 === p
                        ? ((l = e.decoder(c, s.decoder)),
                          (f = e.strictNullHandling ? null : ""))
                        : ((l = e.decoder(c.slice(0, p), s.decoder)),
                          (f = e.decoder(c.slice(p + 1), s.decoder))),
                        n.call(i, l)
                          ? (i[l] = [].concat(i[l]).concat(f))
                          : (i[l] = f);
                    }
                    return i;
                  })(t, i)
                : t,
            h = i.plainObjects ? Object.create(null) : {},
            l = Object.keys(o),
            f = 0;
          f < l.length;
          ++f
        ) {
          var c = l[f],
            u = a(c, o[c], i);
          h = r.merge(h, u, i);
        }
        return r.compact(h);
      };
    },
    a851: function (t, e, i) {
      "undefined" != typeof navigator &&
        (t.exports = (function () {
          "use strict";
          var r = "",
            n = !1,
            s = function () {
              return r;
            };
          function a(t) {
            return document.createElement(t);
          }
          function o(t, e) {
            var i,
              r,
              n = t.length;
            for (i = 0; i < n; i += 1)
              for (var s in (r = t[i].prototype))
                Object.prototype.hasOwnProperty.call(r, s) &&
                  (e.prototype[s] = r[s]);
          }
          function h(t) {
            function e() {}
            return (e.prototype = t), e;
          }
          var l = (function () {
              function t(t) {
                (this.audios = []),
                  (this.audioFactory = t),
                  (this._volume = 1),
                  (this._isMuted = !1);
              }
              return (
                (t.prototype = {
                  addAudio: function (t) {
                    this.audios.push(t);
                  },
                  pause: function () {
                    var t,
                      e = this.audios.length;
                    for (t = 0; t < e; t += 1) this.audios[t].pause();
                  },
                  resume: function () {
                    var t,
                      e = this.audios.length;
                    for (t = 0; t < e; t += 1) this.audios[t].resume();
                  },
                  setRate: function (t) {
                    var e,
                      i = this.audios.length;
                    for (e = 0; e < i; e += 1) this.audios[e].setRate(t);
                  },
                  createAudio: function (t) {
                    return this.audioFactory
                      ? this.audioFactory(t)
                      : window.Howl
                      ? new window.Howl({ src: [t] })
                      : {
                          isPlaying: !1,
                          play: function () {
                            this.isPlaying = !0;
                          },
                          seek: function () {
                            this.isPlaying = !1;
                          },
                          playing: function () {},
                          rate: function () {},
                          setVolume: function () {},
                        };
                  },
                  setAudioFactory: function (t) {
                    this.audioFactory = t;
                  },
                  setVolume: function (t) {
                    (this._volume = t), this._updateVolume();
                  },
                  mute: function () {
                    (this._isMuted = !0), this._updateVolume();
                  },
                  unmute: function () {
                    (this._isMuted = !1), this._updateVolume();
                  },
                  getVolume: function () {
                    return this._volume;
                  },
                  _updateVolume: function () {
                    var t,
                      e = this.audios.length;
                    for (t = 0; t < e; t += 1)
                      this.audios[t].volume(
                        this._volume * (this._isMuted ? 0 : 1)
                      );
                  },
                }),
                function () {
                  return new t();
                }
              );
            })(),
            f = (function () {
              function t(t, e) {
                var i,
                  r = 0,
                  n = [];
                switch (t) {
                  case "int16":
                  case "uint8c":
                    i = 1;
                    break;
                  default:
                    i = 1.1;
                }
                for (r = 0; r < e; r += 1) n.push(i);
                return n;
              }
              return "function" == typeof Uint8ClampedArray &&
                "function" == typeof Float32Array
                ? function (e, i) {
                    return "float32" === e
                      ? new Float32Array(i)
                      : "int16" === e
                      ? new Int16Array(i)
                      : "uint8c" === e
                      ? new Uint8ClampedArray(i)
                      : t(e, i);
                  }
                : t;
            })();
          function c(t) {
            return Array.apply(null, { length: t });
          }
          function u(t) {
            return (u =
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
                  })(t);
          }
          var p = !0,
            d = null,
            m = null,
            g = "",
            y = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
            v = Math.pow,
            b = Math.sqrt,
            _ = Math.floor,
            w = (Math.max, Math.min),
            A = {};
          (function () {
            var t,
              e = [
                "abs",
                "acos",
                "acosh",
                "asin",
                "asinh",
                "atan",
                "atanh",
                "atan2",
                "ceil",
                "cbrt",
                "expm1",
                "clz32",
                "cos",
                "cosh",
                "exp",
                "floor",
                "fround",
                "hypot",
                "imul",
                "log",
                "log1p",
                "log2",
                "log10",
                "max",
                "min",
                "pow",
                "random",
                "round",
                "sign",
                "sin",
                "sinh",
                "sqrt",
                "tan",
                "tanh",
                "trunc",
                "E",
                "LN10",
                "LN2",
                "LOG10E",
                "LOG2E",
                "PI",
                "SQRT1_2",
                "SQRT2",
              ],
              i = e.length;
            for (t = 0; t < i; t += 1) A[e[t]] = Math[e[t]];
          })(),
            (A.random = Math.random),
            (A.abs = function (t) {
              if ("object" === u(t) && t.length) {
                var e,
                  i = c(t.length),
                  r = t.length;
                for (e = 0; e < r; e += 1) i[e] = Math.abs(t[e]);
                return i;
              }
              return Math.abs(t);
            });
          var x = 150,
            S = Math.PI / 180;
          function k(t) {}
          function E(t, e, i, r) {
            (this.type = t),
              (this.currentTime = e),
              (this.totalTime = i),
              (this.direction = r < 0 ? -1 : 1);
          }
          function P(t, e) {
            (this.type = t), (this.direction = e < 0 ? -1 : 1);
          }
          function C(t, e, i, r) {
            (this.type = t),
              (this.currentLoop = i),
              (this.totalLoops = e),
              (this.direction = r < 0 ? -1 : 1);
          }
          function D(t, e, i) {
            (this.type = t), (this.firstFrame = e), (this.totalFrames = i);
          }
          function M(t, e) {
            (this.type = t), (this.target = e);
          }
          function T(t, e) {
            (this.type = "renderFrameError"),
              (this.nativeError = t),
              (this.currentTime = e);
          }
          function F(t) {
            (this.type = "configError"), (this.nativeError = t);
          }
          var O,
            L =
              ((O = 0),
              function () {
                return g + "__lottie_element_" + (O += 1);
              });
          function I(t, e, i) {
            var r, n, s, a, o, h, l, f;
            switch (
              ((h = i * (1 - e)),
              (l = i * (1 - (o = 6 * t - (a = Math.floor(6 * t))) * e)),
              (f = i * (1 - (1 - o) * e)),
              a % 6)
            ) {
              case 0:
                (r = i), (n = f), (s = h);
                break;
              case 1:
                (r = l), (n = i), (s = h);
                break;
              case 2:
                (r = h), (n = i), (s = f);
                break;
              case 3:
                (r = h), (n = l), (s = i);
                break;
              case 4:
                (r = f), (n = h), (s = i);
                break;
              case 5:
                (r = i), (n = h), (s = l);
            }
            return [r, n, s];
          }
          function R(t, e, i) {
            var r,
              n = Math.max(t, e, i),
              s = Math.min(t, e, i),
              a = n - s,
              o = 0 === n ? 0 : a / n,
              h = n / 255;
            switch (n) {
              case s:
                r = 0;
                break;
              case t:
                (r = e - i + a * (e < i ? 6 : 0)), (r /= 6 * a);
                break;
              case e:
                (r = i - t + 2 * a), (r /= 6 * a);
                break;
              case i:
                (r = t - e + 4 * a), (r /= 6 * a);
            }
            return [r, o, h];
          }
          function j(t, e) {
            var i = R(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (i[1] += e),
              i[1] > 1 ? (i[1] = 1) : i[1] <= 0 && (i[1] = 0),
              I(i[0], i[1], i[2])
            );
          }
          function N(t, e) {
            var i = R(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (i[2] += e),
              i[2] > 1 ? (i[2] = 1) : i[2] < 0 && (i[2] = 0),
              I(i[0], i[1], i[2])
            );
          }
          function B(t, e) {
            var i = R(255 * t[0], 255 * t[1], 255 * t[2]);
            return (
              (i[0] += e / 360),
              i[0] > 1 ? (i[0] -= 1) : i[0] < 0 && (i[0] += 1),
              I(i[0], i[1], i[2])
            );
          }
          !(function () {
            var t,
              e,
              i = [];
            for (t = 0; t < 256; t += 1)
              (e = t.toString(16)), (i[t] = 1 === e.length ? "0" + e : e);
          })();
          var V = function () {
              return d;
            },
            H = function () {
              return m;
            },
            z = function (t) {
              x = t;
            },
            q = function () {
              return x;
            };
          function U(t) {
            return document.createElementNS("http://www.w3.org/2000/svg", t);
          }
          function W(t) {
            return (W =
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
                  })(t);
          }
          var X = (function () {
              var t,
                e,
                i = 1,
                r = [],
                s = {
                  onmessage: function () {},
                  postMessage: function (e) {
                    t({ data: e });
                  },
                },
                a = {
                  postMessage: function (t) {
                    s.onmessage({ data: t });
                  },
                };
              function o(e) {
                if (window.Worker && window.Blob && n) {
                  var i = new Blob(
                      [
                        "var _workerSelf = self; self.onmessage = ",
                        e.toString(),
                      ],
                      { type: "text/javascript" }
                    ),
                    r = URL.createObjectURL(i);
                  return new Worker(r);
                }
                return (t = e), s;
              }
              function h() {
                e ||
                  ((e = o(function (t) {
                    if (
                      (a.dataManager ||
                        (a.dataManager = (function () {
                          function t(n, s) {
                            var a,
                              o,
                              h,
                              l,
                              f,
                              c,
                              u,
                              p = n.length;
                            for (o = 0; o < p; o += 1)
                              if ("ks" in (a = n[o]) && !a.completed) {
                                if (((a.completed = !0), a.hasMask)) {
                                  var d = a.masksProperties;
                                  for (l = d.length, h = 0; h < l; h += 1)
                                    if (d[h].pt.k.i) r(d[h].pt.k);
                                    else
                                      for (
                                        c = d[h].pt.k.length, f = 0;
                                        f < c;
                                        f += 1
                                      )
                                        d[h].pt.k[f].s && r(d[h].pt.k[f].s[0]),
                                          d[h].pt.k[f].e &&
                                            r(d[h].pt.k[f].e[0]);
                                }
                                0 === a.ty
                                  ? ((a.layers = e(a.refId, s)), t(a.layers, s))
                                  : 4 === a.ty
                                  ? i(a.shapes)
                                  : 5 === a.ty &&
                                    0 === (u = a).t.a.length &&
                                    u.t.p;
                              }
                          }
                          function e(t, e) {
                            var i = (function (t, e) {
                              for (var i = 0, r = e.length; i < r; ) {
                                if (e[i].id === t) return e[i];
                                i += 1;
                              }
                              return null;
                            })(t, e);
                            return i
                              ? i.layers.__used
                                ? JSON.parse(JSON.stringify(i.layers))
                                : ((i.layers.__used = !0), i.layers)
                              : null;
                          }
                          function i(t) {
                            var e, n, s;
                            for (e = t.length - 1; e >= 0; e -= 1)
                              if ("sh" === t[e].ty)
                                if (t[e].ks.k.i) r(t[e].ks.k);
                                else
                                  for (
                                    s = t[e].ks.k.length, n = 0;
                                    n < s;
                                    n += 1
                                  )
                                    t[e].ks.k[n].s && r(t[e].ks.k[n].s[0]),
                                      t[e].ks.k[n].e && r(t[e].ks.k[n].e[0]);
                              else "gr" === t[e].ty && i(t[e].it);
                          }
                          function r(t) {
                            var e,
                              i = t.i.length;
                            for (e = 0; e < i; e += 1)
                              (t.i[e][0] += t.v[e][0]),
                                (t.i[e][1] += t.v[e][1]),
                                (t.o[e][0] += t.v[e][0]),
                                (t.o[e][1] += t.v[e][1]);
                          }
                          function n(t, e) {
                            var i = e ? e.split(".") : [100, 100, 100];
                            return (
                              t[0] > i[0] ||
                              (!(i[0] > t[0]) &&
                                (t[1] > i[1] ||
                                  (!(i[1] > t[1]) &&
                                    (t[2] > i[2] || (!(i[2] > t[2]) && null)))))
                            );
                          }
                          var s,
                            a = (function () {
                              var t = [4, 4, 14];
                              function e(t) {
                                var e,
                                  i,
                                  r,
                                  n = t.length;
                                for (e = 0; e < n; e += 1)
                                  5 === t[e].ty &&
                                    ((i = t[e]),
                                    (r = void 0),
                                    (r = i.t.d),
                                    (i.t.d = { k: [{ s: r, t: 0 }] }));
                              }
                              return function (i) {
                                if (n(t, i.v) && (e(i.layers), i.assets)) {
                                  var r,
                                    s = i.assets.length;
                                  for (r = 0; r < s; r += 1)
                                    i.assets[r].layers && e(i.assets[r].layers);
                                }
                              };
                            })(),
                            o =
                              ((s = [4, 7, 99]),
                              function (t) {
                                if (t.chars && !n(s, t.v)) {
                                  var e,
                                    r = t.chars.length;
                                  for (e = 0; e < r; e += 1) {
                                    var a = t.chars[e];
                                    a.data &&
                                      a.data.shapes &&
                                      (i(a.data.shapes),
                                      (a.data.ip = 0),
                                      (a.data.op = 99999),
                                      (a.data.st = 0),
                                      (a.data.sr = 1),
                                      (a.data.ks = {
                                        p: { k: [0, 0], a: 0 },
                                        s: { k: [100, 100], a: 0 },
                                        a: { k: [0, 0], a: 0 },
                                        r: { k: 0, a: 0 },
                                        o: { k: 100, a: 0 },
                                      }),
                                      t.chars[e].t ||
                                        (a.data.shapes.push({ ty: "no" }),
                                        a.data.shapes[0].it.push({
                                          p: { k: [0, 0], a: 0 },
                                          s: { k: [100, 100], a: 0 },
                                          a: { k: [0, 0], a: 0 },
                                          r: { k: 0, a: 0 },
                                          o: { k: 100, a: 0 },
                                          sk: { k: 0, a: 0 },
                                          sa: { k: 0, a: 0 },
                                          ty: "tr",
                                        })));
                                  }
                                }
                              }),
                            h = (function () {
                              var t = [5, 7, 15];
                              function e(t) {
                                var e,
                                  i,
                                  r,
                                  n = t.length;
                                for (e = 0; e < n; e += 1)
                                  5 === t[e].ty &&
                                    ((i = t[e]),
                                    (r = void 0),
                                    "number" == typeof (r = i.t.p).a &&
                                      (r.a = { a: 0, k: r.a }),
                                    "number" == typeof r.p &&
                                      (r.p = { a: 0, k: r.p }),
                                    "number" == typeof r.r &&
                                      (r.r = { a: 0, k: r.r }));
                              }
                              return function (i) {
                                if (n(t, i.v) && (e(i.layers), i.assets)) {
                                  var r,
                                    s = i.assets.length;
                                  for (r = 0; r < s; r += 1)
                                    i.assets[r].layers && e(i.assets[r].layers);
                                }
                              };
                            })(),
                            l = (function () {
                              var t = [4, 1, 9];
                              function e(t) {
                                var i,
                                  r,
                                  n,
                                  s = t.length;
                                for (i = 0; i < s; i += 1)
                                  if ("gr" === t[i].ty) e(t[i].it);
                                  else if ("fl" === t[i].ty || "st" === t[i].ty)
                                    if (t[i].c.k && t[i].c.k[0].i)
                                      for (
                                        n = t[i].c.k.length, r = 0;
                                        r < n;
                                        r += 1
                                      )
                                        t[i].c.k[r].s &&
                                          ((t[i].c.k[r].s[0] /= 255),
                                          (t[i].c.k[r].s[1] /= 255),
                                          (t[i].c.k[r].s[2] /= 255),
                                          (t[i].c.k[r].s[3] /= 255)),
                                          t[i].c.k[r].e &&
                                            ((t[i].c.k[r].e[0] /= 255),
                                            (t[i].c.k[r].e[1] /= 255),
                                            (t[i].c.k[r].e[2] /= 255),
                                            (t[i].c.k[r].e[3] /= 255));
                                    else
                                      (t[i].c.k[0] /= 255),
                                        (t[i].c.k[1] /= 255),
                                        (t[i].c.k[2] /= 255),
                                        (t[i].c.k[3] /= 255);
                              }
                              function i(t) {
                                var i,
                                  r = t.length;
                                for (i = 0; i < r; i += 1)
                                  4 === t[i].ty && e(t[i].shapes);
                              }
                              return function (e) {
                                if (n(t, e.v) && (i(e.layers), e.assets)) {
                                  var r,
                                    s = e.assets.length;
                                  for (r = 0; r < s; r += 1)
                                    e.assets[r].layers && i(e.assets[r].layers);
                                }
                              };
                            })(),
                            f = (function () {
                              var t = [4, 4, 18];
                              function e(t) {
                                var i, r, n;
                                for (i = t.length - 1; i >= 0; i -= 1)
                                  if ("sh" === t[i].ty)
                                    if (t[i].ks.k.i) t[i].ks.k.c = t[i].closed;
                                    else
                                      for (
                                        n = t[i].ks.k.length, r = 0;
                                        r < n;
                                        r += 1
                                      )
                                        t[i].ks.k[r].s &&
                                          (t[i].ks.k[r].s[0].c = t[i].closed),
                                          t[i].ks.k[r].e &&
                                            (t[i].ks.k[r].e[0].c = t[i].closed);
                                  else "gr" === t[i].ty && e(t[i].it);
                              }
                              function i(t) {
                                var i,
                                  r,
                                  n,
                                  s,
                                  a,
                                  o,
                                  h = t.length;
                                for (r = 0; r < h; r += 1) {
                                  if ((i = t[r]).hasMask) {
                                    var l = i.masksProperties;
                                    for (s = l.length, n = 0; n < s; n += 1)
                                      if (l[n].pt.k.i) l[n].pt.k.c = l[n].cl;
                                      else
                                        for (
                                          o = l[n].pt.k.length, a = 0;
                                          a < o;
                                          a += 1
                                        )
                                          l[n].pt.k[a].s &&
                                            (l[n].pt.k[a].s[0].c = l[n].cl),
                                            l[n].pt.k[a].e &&
                                              (l[n].pt.k[a].e[0].c = l[n].cl);
                                  }
                                  4 === i.ty && e(i.shapes);
                                }
                              }
                              return function (e) {
                                if (n(t, e.v) && (i(e.layers), e.assets)) {
                                  var r,
                                    s = e.assets.length;
                                  for (r = 0; r < s; r += 1)
                                    e.assets[r].layers && i(e.assets[r].layers);
                                }
                              };
                            })();
                          var c = {
                            completeData: function (i) {
                              i.__complete ||
                                (l(i),
                                a(i),
                                o(i),
                                h(i),
                                f(i),
                                t(i.layers, i.assets),
                                (function (i, r) {
                                  if (i) {
                                    var n = 0,
                                      s = i.length;
                                    for (n = 0; n < s; n += 1)
                                      1 === i[n].t &&
                                        ((i[n].data.layers = e(
                                          i[n].data.refId,
                                          r
                                        )),
                                        t(i[n].data.layers, r));
                                  }
                                })(i.chars, i.assets),
                                (i.__complete = !0));
                            },
                          };
                          return (
                            (c.checkColors = l),
                            (c.checkChars = o),
                            (c.checkPathProperties = h),
                            (c.checkShapes = f),
                            (c.completeLayers = t),
                            c
                          );
                        })()),
                      a.assetLoader ||
                        (a.assetLoader = (function () {
                          function t(t) {
                            var e = t.getResponseHeader("content-type");
                            return (e &&
                              "json" === t.responseType &&
                              -1 !== e.indexOf("json")) ||
                              (t.response && "object" === W(t.response))
                              ? t.response
                              : t.response && "string" == typeof t.response
                              ? JSON.parse(t.response)
                              : t.responseText
                              ? JSON.parse(t.responseText)
                              : null;
                          }
                          return {
                            load: function (e, i, r, n) {
                              var s,
                                a = new XMLHttpRequest();
                              try {
                                a.responseType = "json";
                              } catch (t) {}
                              a.onreadystatechange = function () {
                                if (4 === a.readyState)
                                  if (200 === a.status) (s = t(a)), r(s);
                                  else
                                    try {
                                      (s = t(a)), r(s);
                                    } catch (t) {
                                      n && n(t);
                                    }
                              };
                              try {
                                a.open(["G", "E", "T"].join(""), e, !0);
                              } catch (t) {
                                a.open(
                                  ["G", "E", "T"].join(""),
                                  i + "/" + e,
                                  !0
                                );
                              }
                              a.send();
                            },
                          };
                        })()),
                      "loadAnimation" === t.data.type)
                    )
                      a.assetLoader.load(
                        t.data.path,
                        t.data.fullPath,
                        function (e) {
                          a.dataManager.completeData(e),
                            a.postMessage({
                              id: t.data.id,
                              payload: e,
                              status: "success",
                            });
                        },
                        function () {
                          a.postMessage({ id: t.data.id, status: "error" });
                        }
                      );
                    else if ("complete" === t.data.type) {
                      var e = t.data.animation;
                      a.dataManager.completeData(e),
                        a.postMessage({
                          id: t.data.id,
                          payload: e,
                          status: "success",
                        });
                    } else
                      "loadData" === t.data.type &&
                        a.assetLoader.load(
                          t.data.path,
                          t.data.fullPath,
                          function (e) {
                            a.postMessage({
                              id: t.data.id,
                              payload: e,
                              status: "success",
                            });
                          },
                          function () {
                            a.postMessage({ id: t.data.id, status: "error" });
                          }
                        );
                  })).onmessage = function (t) {
                    var e = t.data,
                      i = e.id,
                      n = r[i];
                    (r[i] = null),
                      "success" === e.status
                        ? n.onComplete(e.payload)
                        : n.onError && n.onError();
                  });
              }
              function l(t, e) {
                var n = "processId_" + (i += 1);
                return (r[n] = { onComplete: t, onError: e }), n;
              }
              return {
                loadAnimation: function (t, i, r) {
                  h();
                  var n = l(i, r);
                  e.postMessage({
                    type: "loadAnimation",
                    path: t,
                    fullPath: window.location.origin + window.location.pathname,
                    id: n,
                  });
                },
                loadData: function (t, i, r) {
                  h();
                  var n = l(i, r);
                  e.postMessage({
                    type: "loadData",
                    path: t,
                    fullPath: window.location.origin + window.location.pathname,
                    id: n,
                  });
                },
                completeAnimation: function (t, i, r) {
                  h();
                  var n = l(i, r);
                  e.postMessage({ type: "complete", animation: t, id: n });
                },
              };
            })(),
            Y = (function () {
              var t = (function () {
                var t = a("canvas");
                (t.width = 1), (t.height = 1);
                var e = t.getContext("2d");
                return (
                  (e.fillStyle = "rgba(0,0,0,0)"), e.fillRect(0, 0, 1, 1), t
                );
              })();
              function e() {
                (this.loadedAssets += 1),
                  this.loadedAssets === this.totalImages &&
                    this.loadedFootagesCount === this.totalFootages &&
                    this.imagesLoadedCb &&
                    this.imagesLoadedCb(null);
              }
              function i() {
                (this.loadedFootagesCount += 1),
                  this.loadedAssets === this.totalImages &&
                    this.loadedFootagesCount === this.totalFootages &&
                    this.imagesLoadedCb &&
                    this.imagesLoadedCb(null);
              }
              function r(t, e, i) {
                var r = "";
                if (t.e) r = t.p;
                else if (e) {
                  var n = t.p;
                  -1 !== n.indexOf("images/") && (n = n.split("/")[1]),
                    (r = e + n);
                } else (r = i), (r += t.u ? t.u : ""), (r += t.p);
                return r;
              }
              function n(t) {
                var e = 0,
                  i = setInterval(
                    function () {
                      (t.getBBox().width || e > 500) &&
                        (this._imageLoaded(), clearInterval(i)),
                        (e += 1);
                    }.bind(this),
                    50
                  );
              }
              function s(t) {
                var e = { assetData: t },
                  i = r(t, this.assetsPath, this.path);
                return (
                  X.loadData(
                    i,
                    function (t) {
                      (e.img = t), this._footageLoaded();
                    }.bind(this),
                    function () {
                      (e.img = {}), this._footageLoaded();
                    }.bind(this)
                  ),
                  e
                );
              }
              function o() {
                (this._imageLoaded = e.bind(this)),
                  (this._footageLoaded = i.bind(this)),
                  (this.testImageLoaded = n.bind(this)),
                  (this.createFootageData = s.bind(this)),
                  (this.assetsPath = ""),
                  (this.path = ""),
                  (this.totalImages = 0),
                  (this.totalFootages = 0),
                  (this.loadedAssets = 0),
                  (this.loadedFootagesCount = 0),
                  (this.imagesLoadedCb = null),
                  (this.images = []);
              }
              return (
                (o.prototype = {
                  loadAssets: function (t, e) {
                    var i;
                    this.imagesLoadedCb = e;
                    var r = t.length;
                    for (i = 0; i < r; i += 1)
                      t[i].layers ||
                        (t[i].t && "seq" !== t[i].t
                          ? 3 === t[i].t &&
                            ((this.totalFootages += 1),
                            this.images.push(this.createFootageData(t[i])))
                          : ((this.totalImages += 1),
                            this.images.push(this._createImageData(t[i]))));
                  },
                  setAssetsPath: function (t) {
                    this.assetsPath = t || "";
                  },
                  setPath: function (t) {
                    this.path = t || "";
                  },
                  loadedImages: function () {
                    return this.totalImages === this.loadedAssets;
                  },
                  loadedFootages: function () {
                    return this.totalFootages === this.loadedFootagesCount;
                  },
                  destroy: function () {
                    (this.imagesLoadedCb = null), (this.images.length = 0);
                  },
                  getAsset: function (t) {
                    for (var e = 0, i = this.images.length; e < i; ) {
                      if (this.images[e].assetData === t)
                        return this.images[e].img;
                      e += 1;
                    }
                    return null;
                  },
                  createImgData: function (e) {
                    var i = r(e, this.assetsPath, this.path),
                      n = a("img");
                    (n.crossOrigin = "anonymous"),
                      n.addEventListener("load", this._imageLoaded, !1),
                      n.addEventListener(
                        "error",
                        function () {
                          (s.img = t), this._imageLoaded();
                        }.bind(this),
                        !1
                      ),
                      (n.src = i);
                    var s = { img: n, assetData: e };
                    return s;
                  },
                  createImageData: function (e) {
                    var i = r(e, this.assetsPath, this.path),
                      n = U("image");
                    y
                      ? this.testImageLoaded(n)
                      : n.addEventListener("load", this._imageLoaded, !1),
                      n.addEventListener(
                        "error",
                        function () {
                          (s.img = t), this._imageLoaded();
                        }.bind(this),
                        !1
                      ),
                      n.setAttributeNS(
                        "http://www.w3.org/1999/xlink",
                        "href",
                        i
                      ),
                      this._elementHelper.append
                        ? this._elementHelper.append(n)
                        : this._elementHelper.appendChild(n);
                    var s = { img: n, assetData: e };
                    return s;
                  },
                  imageLoaded: e,
                  footageLoaded: i,
                  setCacheType: function (t, e) {
                    "svg" === t
                      ? ((this._elementHelper = e),
                        (this._createImageData =
                          this.createImageData.bind(this)))
                      : (this._createImageData = this.createImgData.bind(this));
                  },
                }),
                o
              );
            })();
          function G() {}
          G.prototype = {
            triggerEvent: function (t, e) {
              if (this._cbs[t])
                for (var i = this._cbs[t], r = 0; r < i.length; r += 1) i[r](e);
            },
            addEventListener: function (t, e) {
              return (
                this._cbs[t] || (this._cbs[t] = []),
                this._cbs[t].push(e),
                function () {
                  this.removeEventListener(t, e);
                }.bind(this)
              );
            },
            removeEventListener: function (t, e) {
              if (e) {
                if (this._cbs[t]) {
                  for (var i = 0, r = this._cbs[t].length; i < r; )
                    this._cbs[t][i] === e &&
                      (this._cbs[t].splice(i, 1), (i -= 1), (r -= 1)),
                      (i += 1);
                  this._cbs[t].length || (this._cbs[t] = null);
                }
              } else this._cbs[t] = null;
            },
          };
          var $ = (function () {
              function t(t) {
                for (
                  var e, i = t.split("\r\n"), r = {}, n = 0, s = 0;
                  s < i.length;
                  s += 1
                )
                  2 === (e = i[s].split(":")).length &&
                    ((r[e[0]] = e[1].trim()), (n += 1));
                if (0 === n) throw new Error();
                return r;
              }
              return function (e) {
                for (var i = [], r = 0; r < e.length; r += 1) {
                  var n = e[r],
                    s = { time: n.tm, duration: n.dr };
                  try {
                    s.payload = JSON.parse(e[r].cm);
                  } catch (i) {
                    try {
                      s.payload = t(e[r].cm);
                    } catch (t) {
                      s.payload = { name: e[r].cm };
                    }
                  }
                  i.push(s);
                }
                return i;
              };
            })(),
            J = (function () {
              function t(t) {
                this.compositions.push(t);
              }
              return function () {
                function e(t) {
                  for (var e = 0, i = this.compositions.length; e < i; ) {
                    if (
                      this.compositions[e].data &&
                      this.compositions[e].data.nm === t
                    )
                      return (
                        this.compositions[e].prepareFrame &&
                          this.compositions[e].data.xt &&
                          this.compositions[e].prepareFrame(this.currentFrame),
                        this.compositions[e].compInterface
                      );
                    e += 1;
                  }
                  return null;
                }
                return (
                  (e.compositions = []),
                  (e.currentFrame = 0),
                  (e.registerComposition = t),
                  e
                );
              };
            })(),
            K = {};
          function Z(t) {
            return (Z =
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
                  })(t);
          }
          var Q = function () {
            (this._cbs = []),
              (this.name = ""),
              (this.path = ""),
              (this.isLoaded = !1),
              (this.currentFrame = 0),
              (this.currentRawFrame = 0),
              (this.firstFrame = 0),
              (this.totalFrames = 0),
              (this.frameRate = 0),
              (this.frameMult = 0),
              (this.playSpeed = 1),
              (this.playDirection = 1),
              (this.playCount = 0),
              (this.animationData = {}),
              (this.assets = []),
              (this.isPaused = !0),
              (this.autoplay = !1),
              (this.loop = !0),
              (this.renderer = null),
              (this.animationID = L()),
              (this.assetsPath = ""),
              (this.timeCompleted = 0),
              (this.segmentPos = 0),
              (this.isSubframeEnabled = p),
              (this.segments = []),
              (this._idle = !0),
              (this._completedLoop = !1),
              (this.projectInterface = J()),
              (this.imagePreloader = new Y()),
              (this.audioController = l()),
              (this.markers = []),
              (this.configAnimation = this.configAnimation.bind(this)),
              (this.onSetupError = this.onSetupError.bind(this)),
              (this.onSegmentComplete = this.onSegmentComplete.bind(this)),
              (this.drawnFrameEvent = new E("drawnFrame", 0, 0, 0)),
              (this.expressionsPlugin = V());
          };
          o([G], Q),
            (Q.prototype.setParams = function (t) {
              (t.wrapper || t.container) &&
                (this.wrapper = t.wrapper || t.container);
              var e = "svg";
              t.animType ? (e = t.animType) : t.renderer && (e = t.renderer);
              var i = K[e];
              (this.renderer = new i(this, t.rendererSettings)),
                this.imagePreloader.setCacheType(
                  e,
                  this.renderer.globalData.defs
                ),
                this.renderer.setProjectInterface(this.projectInterface),
                (this.animType = e),
                "" === t.loop ||
                null === t.loop ||
                void 0 === t.loop ||
                !0 === t.loop
                  ? (this.loop = !0)
                  : !1 === t.loop
                  ? (this.loop = !1)
                  : (this.loop = parseInt(t.loop, 10)),
                (this.autoplay = !("autoplay" in t) || t.autoplay),
                (this.name = t.name ? t.name : ""),
                (this.autoloadSegments =
                  !Object.prototype.hasOwnProperty.call(
                    t,
                    "autoloadSegments"
                  ) || t.autoloadSegments),
                (this.assetsPath = t.assetsPath),
                (this.initialSegment = t.initialSegment),
                t.audioFactory &&
                  this.audioController.setAudioFactory(t.audioFactory),
                t.animationData
                  ? this.setupAnimation(t.animationData)
                  : t.path &&
                    (-1 !== t.path.lastIndexOf("\\")
                      ? (this.path = t.path.substr(
                          0,
                          t.path.lastIndexOf("\\") + 1
                        ))
                      : (this.path = t.path.substr(
                          0,
                          t.path.lastIndexOf("/") + 1
                        )),
                    (this.fileName = t.path.substr(
                      t.path.lastIndexOf("/") + 1
                    )),
                    (this.fileName = this.fileName.substr(
                      0,
                      this.fileName.lastIndexOf(".json")
                    )),
                    X.loadAnimation(
                      t.path,
                      this.configAnimation,
                      this.onSetupError
                    ));
            }),
            (Q.prototype.onSetupError = function () {
              this.trigger("data_failed");
            }),
            (Q.prototype.setupAnimation = function (t) {
              X.completeAnimation(t, this.configAnimation);
            }),
            (Q.prototype.setData = function (t, e) {
              e && "object" !== Z(e) && (e = JSON.parse(e));
              var i = { wrapper: t, animationData: e },
                r = t.attributes;
              (i.path = r.getNamedItem("data-animation-path")
                ? r.getNamedItem("data-animation-path").value
                : r.getNamedItem("data-bm-path")
                ? r.getNamedItem("data-bm-path").value
                : r.getNamedItem("bm-path")
                ? r.getNamedItem("bm-path").value
                : ""),
                (i.animType = r.getNamedItem("data-anim-type")
                  ? r.getNamedItem("data-anim-type").value
                  : r.getNamedItem("data-bm-type")
                  ? r.getNamedItem("data-bm-type").value
                  : r.getNamedItem("bm-type")
                  ? r.getNamedItem("bm-type").value
                  : r.getNamedItem("data-bm-renderer")
                  ? r.getNamedItem("data-bm-renderer").value
                  : r.getNamedItem("bm-renderer")
                  ? r.getNamedItem("bm-renderer").value
                  : (function () {
                      if (K.canvas) return "canvas";
                      for (var t in K) if (K[t]) return t;
                      return "";
                    })() || "canvas");
              var n = r.getNamedItem("data-anim-loop")
                ? r.getNamedItem("data-anim-loop").value
                : r.getNamedItem("data-bm-loop")
                ? r.getNamedItem("data-bm-loop").value
                : r.getNamedItem("bm-loop")
                ? r.getNamedItem("bm-loop").value
                : "";
              "false" === n
                ? (i.loop = !1)
                : "true" === n
                ? (i.loop = !0)
                : "" !== n && (i.loop = parseInt(n, 10));
              var s = r.getNamedItem("data-anim-autoplay")
                ? r.getNamedItem("data-anim-autoplay").value
                : r.getNamedItem("data-bm-autoplay")
                ? r.getNamedItem("data-bm-autoplay").value
                : !r.getNamedItem("bm-autoplay") ||
                  r.getNamedItem("bm-autoplay").value;
              (i.autoplay = "false" !== s),
                (i.name = r.getNamedItem("data-name")
                  ? r.getNamedItem("data-name").value
                  : r.getNamedItem("data-bm-name")
                  ? r.getNamedItem("data-bm-name").value
                  : r.getNamedItem("bm-name")
                  ? r.getNamedItem("bm-name").value
                  : ""),
                "false" ===
                  (r.getNamedItem("data-anim-prerender")
                    ? r.getNamedItem("data-anim-prerender").value
                    : r.getNamedItem("data-bm-prerender")
                    ? r.getNamedItem("data-bm-prerender").value
                    : r.getNamedItem("bm-prerender")
                    ? r.getNamedItem("bm-prerender").value
                    : "") && (i.prerender = !1),
                i.path ? this.setParams(i) : this.trigger("destroy");
            }),
            (Q.prototype.includeLayers = function (t) {
              t.op > this.animationData.op &&
                ((this.animationData.op = t.op),
                (this.totalFrames = Math.floor(t.op - this.animationData.ip)));
              var e,
                i,
                r = this.animationData.layers,
                n = r.length,
                s = t.layers,
                a = s.length;
              for (i = 0; i < a; i += 1)
                for (e = 0; e < n; ) {
                  if (r[e].id === s[i].id) {
                    r[e] = s[i];
                    break;
                  }
                  e += 1;
                }
              if (
                ((t.chars || t.fonts) &&
                  (this.renderer.globalData.fontManager.addChars(t.chars),
                  this.renderer.globalData.fontManager.addFonts(
                    t.fonts,
                    this.renderer.globalData.defs
                  )),
                t.assets)
              )
                for (n = t.assets.length, e = 0; e < n; e += 1)
                  this.animationData.assets.push(t.assets[e]);
              (this.animationData.__complete = !1),
                X.completeAnimation(this.animationData, this.onSegmentComplete);
            }),
            (Q.prototype.onSegmentComplete = function (t) {
              this.animationData = t;
              var e = V();
              e && e.initExpressions(this), this.loadNextSegment();
            }),
            (Q.prototype.loadNextSegment = function () {
              var t = this.animationData.segments;
              if (!t || 0 === t.length || !this.autoloadSegments)
                return (
                  this.trigger("data_ready"),
                  void (this.timeCompleted = this.totalFrames)
                );
              var e = t.shift();
              this.timeCompleted = e.time * this.frameRate;
              var i =
                this.path + this.fileName + "_" + this.segmentPos + ".json";
              (this.segmentPos += 1),
                X.loadData(
                  i,
                  this.includeLayers.bind(this),
                  function () {
                    this.trigger("data_failed");
                  }.bind(this)
                );
            }),
            (Q.prototype.loadSegments = function () {
              this.animationData.segments ||
                (this.timeCompleted = this.totalFrames),
                this.loadNextSegment();
            }),
            (Q.prototype.imagesLoaded = function () {
              this.trigger("loaded_images"), this.checkLoaded();
            }),
            (Q.prototype.preloadImages = function () {
              this.imagePreloader.setAssetsPath(this.assetsPath),
                this.imagePreloader.setPath(this.path),
                this.imagePreloader.loadAssets(
                  this.animationData.assets,
                  this.imagesLoaded.bind(this)
                );
            }),
            (Q.prototype.configAnimation = function (t) {
              if (this.renderer)
                try {
                  (this.animationData = t),
                    this.initialSegment
                      ? ((this.totalFrames = Math.floor(
                          this.initialSegment[1] - this.initialSegment[0]
                        )),
                        (this.firstFrame = Math.round(this.initialSegment[0])))
                      : ((this.totalFrames = Math.floor(
                          this.animationData.op - this.animationData.ip
                        )),
                        (this.firstFrame = Math.round(this.animationData.ip))),
                    this.renderer.configAnimation(t),
                    t.assets || (t.assets = []),
                    (this.assets = this.animationData.assets),
                    (this.frameRate = this.animationData.fr),
                    (this.frameMult = this.animationData.fr / 1e3),
                    this.renderer.searchExtraCompositions(t.assets),
                    (this.markers = $(t.markers || [])),
                    this.trigger("config_ready"),
                    this.preloadImages(),
                    this.loadSegments(),
                    this.updaFrameModifier(),
                    this.waitForFontsLoaded(),
                    this.isPaused && this.audioController.pause();
                } catch (t) {
                  this.triggerConfigError(t);
                }
            }),
            (Q.prototype.waitForFontsLoaded = function () {
              this.renderer &&
                (this.renderer.globalData.fontManager.isLoaded
                  ? this.checkLoaded()
                  : setTimeout(this.waitForFontsLoaded.bind(this), 20));
            }),
            (Q.prototype.checkLoaded = function () {
              if (
                !this.isLoaded &&
                this.renderer.globalData.fontManager.isLoaded &&
                (this.imagePreloader.loadedImages() ||
                  "canvas" !== this.renderer.rendererType) &&
                this.imagePreloader.loadedFootages()
              ) {
                this.isLoaded = !0;
                var t = V();
                t && t.initExpressions(this),
                  this.renderer.initItems(),
                  setTimeout(
                    function () {
                      this.trigger("DOMLoaded");
                    }.bind(this),
                    0
                  ),
                  this.gotoFrame(),
                  this.autoplay && this.play();
              }
            }),
            (Q.prototype.resize = function (t, e) {
              var i = "number" == typeof t ? t : void 0,
                r = "number" == typeof e ? e : void 0;
              this.renderer.updateContainerSize(i, r);
            }),
            (Q.prototype.setSubframe = function (t) {
              this.isSubframeEnabled = !!t;
            }),
            (Q.prototype.gotoFrame = function () {
              (this.currentFrame = this.isSubframeEnabled
                ? this.currentRawFrame
                : ~~this.currentRawFrame),
                this.timeCompleted !== this.totalFrames &&
                  this.currentFrame > this.timeCompleted &&
                  (this.currentFrame = this.timeCompleted),
                this.trigger("enterFrame"),
                this.renderFrame(),
                this.trigger("drawnFrame");
            }),
            (Q.prototype.renderFrame = function () {
              if (!1 !== this.isLoaded && this.renderer)
                try {
                  this.expressionsPlugin && this.expressionsPlugin.resetFrame(),
                    this.renderer.renderFrame(
                      this.currentFrame + this.firstFrame
                    );
                } catch (t) {
                  this.triggerRenderFrameError(t);
                }
            }),
            (Q.prototype.play = function (t) {
              (t && this.name !== t) ||
                (!0 === this.isPaused &&
                  ((this.isPaused = !1),
                  this.trigger("_play"),
                  this.audioController.resume(),
                  this._idle && ((this._idle = !1), this.trigger("_active"))));
            }),
            (Q.prototype.pause = function (t) {
              (t && this.name !== t) ||
                (!1 === this.isPaused &&
                  ((this.isPaused = !0),
                  this.trigger("_pause"),
                  (this._idle = !0),
                  this.trigger("_idle"),
                  this.audioController.pause()));
            }),
            (Q.prototype.togglePause = function (t) {
              (t && this.name !== t) ||
                (!0 === this.isPaused ? this.play() : this.pause());
            }),
            (Q.prototype.stop = function (t) {
              (t && this.name !== t) ||
                (this.pause(),
                (this.playCount = 0),
                (this._completedLoop = !1),
                this.setCurrentRawFrameValue(0));
            }),
            (Q.prototype.getMarkerData = function (t) {
              for (var e, i = 0; i < this.markers.length; i += 1)
                if ((e = this.markers[i]).payload && e.payload.name === t)
                  return e;
              return null;
            }),
            (Q.prototype.goToAndStop = function (t, e, i) {
              if (!i || this.name === i) {
                var r = Number(t);
                if (isNaN(r)) {
                  var n = this.getMarkerData(t);
                  n && this.goToAndStop(n.time, !0);
                } else
                  e
                    ? this.setCurrentRawFrameValue(t)
                    : this.setCurrentRawFrameValue(t * this.frameModifier);
                this.pause();
              }
            }),
            (Q.prototype.goToAndPlay = function (t, e, i) {
              if (!i || this.name === i) {
                var r = Number(t);
                if (isNaN(r)) {
                  var n = this.getMarkerData(t);
                  n &&
                    (n.duration
                      ? this.playSegments([n.time, n.time + n.duration], !0)
                      : this.goToAndStop(n.time, !0));
                } else this.goToAndStop(r, e, i);
                this.play();
              }
            }),
            (Q.prototype.advanceTime = function (t) {
              if (!0 !== this.isPaused && !1 !== this.isLoaded) {
                var e = this.currentRawFrame + t * this.frameModifier,
                  i = !1;
                e >= this.totalFrames - 1 && this.frameModifier > 0
                  ? this.loop && this.playCount !== this.loop
                    ? e >= this.totalFrames
                      ? ((this.playCount += 1),
                        this.checkSegments(e % this.totalFrames) ||
                          (this.setCurrentRawFrameValue(e % this.totalFrames),
                          (this._completedLoop = !0),
                          this.trigger("loopComplete")))
                      : this.setCurrentRawFrameValue(e)
                    : this.checkSegments(
                        e > this.totalFrames ? e % this.totalFrames : 0
                      ) || ((i = !0), (e = this.totalFrames - 1))
                  : e < 0
                  ? this.checkSegments(e % this.totalFrames) ||
                    (!this.loop || (this.playCount-- <= 0 && !0 !== this.loop)
                      ? ((i = !0), (e = 0))
                      : (this.setCurrentRawFrameValue(
                          this.totalFrames + (e % this.totalFrames)
                        ),
                        this._completedLoop
                          ? this.trigger("loopComplete")
                          : (this._completedLoop = !0)))
                  : this.setCurrentRawFrameValue(e),
                  i &&
                    (this.setCurrentRawFrameValue(e),
                    this.pause(),
                    this.trigger("complete"));
              }
            }),
            (Q.prototype.adjustSegment = function (t, e) {
              (this.playCount = 0),
                t[1] < t[0]
                  ? (this.frameModifier > 0 &&
                      (this.playSpeed < 0
                        ? this.setSpeed(-this.playSpeed)
                        : this.setDirection(-1)),
                    (this.totalFrames = t[0] - t[1]),
                    (this.timeCompleted = this.totalFrames),
                    (this.firstFrame = t[1]),
                    this.setCurrentRawFrameValue(this.totalFrames - 0.001 - e))
                  : t[1] > t[0] &&
                    (this.frameModifier < 0 &&
                      (this.playSpeed < 0
                        ? this.setSpeed(-this.playSpeed)
                        : this.setDirection(1)),
                    (this.totalFrames = t[1] - t[0]),
                    (this.timeCompleted = this.totalFrames),
                    (this.firstFrame = t[0]),
                    this.setCurrentRawFrameValue(0.001 + e)),
                this.trigger("segmentStart");
            }),
            (Q.prototype.setSegment = function (t, e) {
              var i = -1;
              this.isPaused &&
                (this.currentRawFrame + this.firstFrame < t
                  ? (i = t)
                  : this.currentRawFrame + this.firstFrame > e && (i = e - t)),
                (this.firstFrame = t),
                (this.totalFrames = e - t),
                (this.timeCompleted = this.totalFrames),
                -1 !== i && this.goToAndStop(i, !0);
            }),
            (Q.prototype.playSegments = function (t, e) {
              if ((e && (this.segments.length = 0), "object" === Z(t[0]))) {
                var i,
                  r = t.length;
                for (i = 0; i < r; i += 1) this.segments.push(t[i]);
              } else this.segments.push(t);
              this.segments.length &&
                e &&
                this.adjustSegment(this.segments.shift(), 0),
                this.isPaused && this.play();
            }),
            (Q.prototype.resetSegments = function (t) {
              (this.segments.length = 0),
                this.segments.push([
                  this.animationData.ip,
                  this.animationData.op,
                ]),
                t && this.checkSegments(0);
            }),
            (Q.prototype.checkSegments = function (t) {
              return (
                !!this.segments.length &&
                (this.adjustSegment(this.segments.shift(), t), !0)
              );
            }),
            (Q.prototype.destroy = function (t) {
              (t && this.name !== t) ||
                !this.renderer ||
                (this.renderer.destroy(),
                this.imagePreloader.destroy(),
                this.trigger("destroy"),
                (this._cbs = null),
                (this.onEnterFrame = null),
                (this.onLoopComplete = null),
                (this.onComplete = null),
                (this.onSegmentStart = null),
                (this.onDestroy = null),
                (this.renderer = null),
                (this.expressionsPlugin = null),
                (this.imagePreloader = null),
                (this.projectInterface = null));
            }),
            (Q.prototype.setCurrentRawFrameValue = function (t) {
              (this.currentRawFrame = t), this.gotoFrame();
            }),
            (Q.prototype.setSpeed = function (t) {
              (this.playSpeed = t), this.updaFrameModifier();
            }),
            (Q.prototype.setDirection = function (t) {
              (this.playDirection = t < 0 ? -1 : 1), this.updaFrameModifier();
            }),
            (Q.prototype.setLoop = function (t) {
              this.loop = t;
            }),
            (Q.prototype.setVolume = function (t, e) {
              (e && this.name !== e) || this.audioController.setVolume(t);
            }),
            (Q.prototype.getVolume = function () {
              return this.audioController.getVolume();
            }),
            (Q.prototype.mute = function (t) {
              (t && this.name !== t) || this.audioController.mute();
            }),
            (Q.prototype.unmute = function (t) {
              (t && this.name !== t) || this.audioController.unmute();
            }),
            (Q.prototype.updaFrameModifier = function () {
              (this.frameModifier =
                this.frameMult * this.playSpeed * this.playDirection),
                this.audioController.setRate(
                  this.playSpeed * this.playDirection
                );
            }),
            (Q.prototype.getPath = function () {
              return this.path;
            }),
            (Q.prototype.getAssetsPath = function (t) {
              var e = "";
              if (t.e) e = t.p;
              else if (this.assetsPath) {
                var i = t.p;
                -1 !== i.indexOf("images/") && (i = i.split("/")[1]),
                  (e = this.assetsPath + i);
              } else (e = this.path), (e += t.u ? t.u : ""), (e += t.p);
              return e;
            }),
            (Q.prototype.getAssetData = function (t) {
              for (var e = 0, i = this.assets.length; e < i; ) {
                if (t === this.assets[e].id) return this.assets[e];
                e += 1;
              }
              return null;
            }),
            (Q.prototype.hide = function () {
              this.renderer.hide();
            }),
            (Q.prototype.show = function () {
              this.renderer.show();
            }),
            (Q.prototype.getDuration = function (t) {
              return t ? this.totalFrames : this.totalFrames / this.frameRate;
            }),
            (Q.prototype.updateDocumentData = function (t, e, i) {
              try {
                this.renderer.getElementByPath(t).updateDocumentData(e, i);
              } catch (t) {}
            }),
            (Q.prototype.trigger = function (t) {
              if (this._cbs && this._cbs[t])
                switch (t) {
                  case "enterFrame":
                    this.triggerEvent(
                      t,
                      new E(
                        t,
                        this.currentFrame,
                        this.totalFrames,
                        this.frameModifier
                      )
                    );
                    break;
                  case "drawnFrame":
                    (this.drawnFrameEvent.currentTime = this.currentFrame),
                      (this.drawnFrameEvent.totalTime = this.totalFrames),
                      (this.drawnFrameEvent.direction = this.frameModifier),
                      this.triggerEvent(t, this.drawnFrameEvent);
                    break;
                  case "loopComplete":
                    this.triggerEvent(
                      t,
                      new C(t, this.loop, this.playCount, this.frameMult)
                    );
                    break;
                  case "complete":
                    this.triggerEvent(t, new P(t, this.frameMult));
                    break;
                  case "segmentStart":
                    this.triggerEvent(
                      t,
                      new D(t, this.firstFrame, this.totalFrames)
                    );
                    break;
                  case "destroy":
                    this.triggerEvent(t, new M(t, this));
                    break;
                  default:
                    this.triggerEvent(t);
                }
              "enterFrame" === t &&
                this.onEnterFrame &&
                this.onEnterFrame.call(
                  this,
                  new E(t, this.currentFrame, this.totalFrames, this.frameMult)
                ),
                "loopComplete" === t &&
                  this.onLoopComplete &&
                  this.onLoopComplete.call(
                    this,
                    new C(t, this.loop, this.playCount, this.frameMult)
                  ),
                "complete" === t &&
                  this.onComplete &&
                  this.onComplete.call(this, new P(t, this.frameMult)),
                "segmentStart" === t &&
                  this.onSegmentStart &&
                  this.onSegmentStart.call(
                    this,
                    new D(t, this.firstFrame, this.totalFrames)
                  ),
                "destroy" === t &&
                  this.onDestroy &&
                  this.onDestroy.call(this, new M(t, this));
            }),
            (Q.prototype.triggerRenderFrameError = function (t) {
              var e = new T(t, this.currentFrame);
              this.triggerEvent("error", e),
                this.onError && this.onError.call(this, e);
            }),
            (Q.prototype.triggerConfigError = function (t) {
              var e = new F(t, this.currentFrame);
              this.triggerEvent("error", e),
                this.onError && this.onError.call(this, e);
            });
          var tt = (function () {
              var t = {},
                e = [],
                i = 0,
                r = 0,
                n = 0,
                s = !0,
                o = !1;
              function h(t) {
                for (var i = 0, n = t.target; i < r; )
                  e[i].animation === n &&
                    (e.splice(i, 1), (i -= 1), (r -= 1), n.isPaused || c()),
                    (i += 1);
              }
              function l(t, i) {
                if (!t) return null;
                for (var n = 0; n < r; ) {
                  if (e[n].elem === t && null !== e[n].elem)
                    return e[n].animation;
                  n += 1;
                }
                var s = new Q();
                return u(s, t), s.setData(t, i), s;
              }
              function f() {
                (n += 1), m();
              }
              function c() {
                n -= 1;
              }
              function u(t, i) {
                t.addEventListener("destroy", h),
                  t.addEventListener("_active", f),
                  t.addEventListener("_idle", c),
                  e.push({ elem: i, animation: t }),
                  (r += 1);
              }
              function p(t) {
                var a,
                  h = t - i;
                for (a = 0; a < r; a += 1) e[a].animation.advanceTime(h);
                (i = t), n && !o ? window.requestAnimationFrame(p) : (s = !0);
              }
              function d(t) {
                (i = t), window.requestAnimationFrame(p);
              }
              function m() {
                !o && n && s && (window.requestAnimationFrame(d), (s = !1));
              }
              return (
                (t.registerAnimation = l),
                (t.loadAnimation = function (t) {
                  var e = new Q();
                  return u(e, null), e.setParams(t), e;
                }),
                (t.setSpeed = function (t, i) {
                  var n;
                  for (n = 0; n < r; n += 1) e[n].animation.setSpeed(t, i);
                }),
                (t.setDirection = function (t, i) {
                  var n;
                  for (n = 0; n < r; n += 1) e[n].animation.setDirection(t, i);
                }),
                (t.play = function (t) {
                  var i;
                  for (i = 0; i < r; i += 1) e[i].animation.play(t);
                }),
                (t.pause = function (t) {
                  var i;
                  for (i = 0; i < r; i += 1) e[i].animation.pause(t);
                }),
                (t.stop = function (t) {
                  var i;
                  for (i = 0; i < r; i += 1) e[i].animation.stop(t);
                }),
                (t.togglePause = function (t) {
                  var i;
                  for (i = 0; i < r; i += 1) e[i].animation.togglePause(t);
                }),
                (t.searchAnimations = function (t, e, i) {
                  var r,
                    n = [].concat(
                      [].slice.call(document.getElementsByClassName("lottie")),
                      [].slice.call(
                        document.getElementsByClassName("bodymovin")
                      )
                    ),
                    s = n.length;
                  for (r = 0; r < s; r += 1)
                    i && n[r].setAttribute("data-bm-type", i), l(n[r], t);
                  if (e && 0 === s) {
                    i || (i = "svg");
                    var o = document.getElementsByTagName("body")[0];
                    o.innerText = "";
                    var h = a("div");
                    (h.style.width = "100%"),
                      (h.style.height = "100%"),
                      h.setAttribute("data-bm-type", i),
                      o.appendChild(h),
                      l(h, t);
                  }
                }),
                (t.resize = function () {
                  var t;
                  for (t = 0; t < r; t += 1) e[t].animation.resize();
                }),
                (t.goToAndStop = function (t, i, n) {
                  var s;
                  for (s = 0; s < r; s += 1)
                    e[s].animation.goToAndStop(t, i, n);
                }),
                (t.destroy = function (t) {
                  var i;
                  for (i = r - 1; i >= 0; i -= 1) e[i].animation.destroy(t);
                }),
                (t.freeze = function () {
                  o = !0;
                }),
                (t.unfreeze = function () {
                  (o = !1), m();
                }),
                (t.setVolume = function (t, i) {
                  var n;
                  for (n = 0; n < r; n += 1) e[n].animation.setVolume(t, i);
                }),
                (t.mute = function (t) {
                  var i;
                  for (i = 0; i < r; i += 1) e[i].animation.mute(t);
                }),
                (t.unmute = function (t) {
                  var i;
                  for (i = 0; i < r; i += 1) e[i].animation.unmute(t);
                }),
                (t.getRegisteredAnimations = function () {
                  var t,
                    i = e.length,
                    r = [];
                  for (t = 0; t < i; t += 1) r.push(e[t].animation);
                  return r;
                }),
                t
              );
            })(),
            et = (function () {
              var t = {
                  getBezierEasing: function (t, i, r, n, s) {
                    var a =
                      s ||
                      ("bez_" + t + "_" + i + "_" + r + "_" + n).replace(
                        /\./g,
                        "p"
                      );
                    if (e[a]) return e[a];
                    var o = new h([t, i, r, n]);
                    return (e[a] = o), o;
                  },
                },
                e = {},
                i = "function" == typeof Float32Array;
              function r(t, e) {
                return 1 - 3 * e + 3 * t;
              }
              function n(t, e) {
                return 3 * e - 6 * t;
              }
              function s(t) {
                return 3 * t;
              }
              function a(t, e, i) {
                return ((r(e, i) * t + n(e, i)) * t + s(e)) * t;
              }
              function o(t, e, i) {
                return 3 * r(e, i) * t * t + 2 * n(e, i) * t + s(e);
              }
              function h(t) {
                (this._p = t),
                  (this._mSampleValues = i
                    ? new Float32Array(11)
                    : new Array(11)),
                  (this._precomputed = !1),
                  (this.get = this.get.bind(this));
              }
              return (
                (h.prototype = {
                  get: function (t) {
                    var e = this._p[0],
                      i = this._p[1],
                      r = this._p[2],
                      n = this._p[3];
                    return (
                      this._precomputed || this._precompute(),
                      e === i && r === n
                        ? t
                        : 0 === t
                        ? 0
                        : 1 === t
                        ? 1
                        : a(this._getTForX(t), i, n)
                    );
                  },
                  _precompute: function () {
                    var t = this._p[0],
                      e = this._p[1],
                      i = this._p[2],
                      r = this._p[3];
                    (this._precomputed = !0),
                      (t === e && i === r) || this._calcSampleValues();
                  },
                  _calcSampleValues: function () {
                    for (var t = this._p[0], e = this._p[2], i = 0; i < 11; ++i)
                      this._mSampleValues[i] = a(0.1 * i, t, e);
                  },
                  _getTForX: function (t) {
                    for (
                      var e = this._p[0],
                        i = this._p[2],
                        r = this._mSampleValues,
                        n = 0,
                        s = 1;
                      10 !== s && r[s] <= t;
                      ++s
                    )
                      n += 0.1;
                    var h = n + ((t - r[--s]) / (r[s + 1] - r[s])) * 0.1,
                      l = o(h, e, i);
                    return l >= 0.001
                      ? (function (t, e, i, r) {
                          for (var n = 0; n < 4; ++n) {
                            var s = o(e, i, r);
                            if (0 === s) return e;
                            e -= (a(e, i, r) - t) / s;
                          }
                          return e;
                        })(t, h, e, i)
                      : 0 === l
                      ? h
                      : (function (t, e, i, r, n) {
                          var s,
                            o,
                            h = 0;
                          do {
                            (s = a((o = e + (i - e) / 2), r, n) - t) > 0
                              ? (i = o)
                              : (e = o);
                          } while (Math.abs(s) > 1e-7 && ++h < 10);
                          return o;
                        })(t, n, n + 0.1, e, i);
                  },
                }),
                t
              );
            })(),
            it = {
              double: function (t) {
                return t.concat(c(t.length));
              },
            },
            rt = function (t, e, i) {
              var r = 0,
                n = t,
                s = c(n);
              return {
                newElement: function () {
                  return r ? s[(r -= 1)] : e();
                },
                release: function (t) {
                  r === n && ((s = it.double(s)), (n *= 2)),
                    i && i(t),
                    (s[r] = t),
                    (r += 1);
                },
              };
            },
            nt = rt(8, function () {
              return {
                addedLength: 0,
                percents: f("float32", q()),
                lengths: f("float32", q()),
              };
            }),
            st = rt(
              8,
              function () {
                return { lengths: [], totalLength: 0 };
              },
              function (t) {
                var e,
                  i = t.lengths.length;
                for (e = 0; e < i; e += 1) nt.release(t.lengths[e]);
                t.lengths.length = 0;
              }
            ),
            at = (function () {
              var t = Math;
              function e(t, e, i, r, n, s) {
                var a = t * r + e * n + i * s - n * r - s * t - i * e;
                return a > -0.001 && a < 0.001;
              }
              var i = function (t, e, i, r) {
                var n,
                  s,
                  a,
                  o,
                  h,
                  l,
                  f = q(),
                  c = 0,
                  u = [],
                  p = [],
                  d = nt.newElement();
                for (a = i.length, n = 0; n < f; n += 1) {
                  for (h = n / (f - 1), l = 0, s = 0; s < a; s += 1)
                    (o =
                      v(1 - h, 3) * t[s] +
                      3 * v(1 - h, 2) * h * i[s] +
                      3 * (1 - h) * v(h, 2) * r[s] +
                      v(h, 3) * e[s]),
                      (u[s] = o),
                      null !== p[s] && (l += v(u[s] - p[s], 2)),
                      (p[s] = u[s]);
                  l && (c += l = b(l)), (d.percents[n] = h), (d.lengths[n] = c);
                }
                return (d.addedLength = c), d;
              };
              function r(t) {
                (this.segmentLength = 0), (this.points = new Array(t));
              }
              function n(t, e) {
                (this.partialLength = t), (this.point = e);
              }
              var s,
                a =
                  ((s = {}),
                  function (t, i, a, o) {
                    var h = (
                      t[0] +
                      "_" +
                      t[1] +
                      "_" +
                      i[0] +
                      "_" +
                      i[1] +
                      "_" +
                      a[0] +
                      "_" +
                      a[1] +
                      "_" +
                      o[0] +
                      "_" +
                      o[1]
                    ).replace(/\./g, "p");
                    if (!s[h]) {
                      var l,
                        f,
                        u,
                        p,
                        d,
                        m,
                        g,
                        y = q(),
                        _ = 0,
                        w = null;
                      2 === t.length &&
                        (t[0] !== i[0] || t[1] !== i[1]) &&
                        e(t[0], t[1], i[0], i[1], t[0] + a[0], t[1] + a[1]) &&
                        e(t[0], t[1], i[0], i[1], i[0] + o[0], i[1] + o[1]) &&
                        (y = 2);
                      var A = new r(y);
                      for (u = a.length, l = 0; l < y; l += 1) {
                        for (
                          g = c(u), d = l / (y - 1), m = 0, f = 0;
                          f < u;
                          f += 1
                        )
                          (p =
                            v(1 - d, 3) * t[f] +
                            3 * v(1 - d, 2) * d * (t[f] + a[f]) +
                            3 * (1 - d) * v(d, 2) * (i[f] + o[f]) +
                            v(d, 3) * i[f]),
                            (g[f] = p),
                            null !== w && (m += v(g[f] - w[f], 2));
                        (_ += m = b(m)), (A.points[l] = new n(m, g)), (w = g);
                      }
                      (A.segmentLength = _), (s[h] = A);
                    }
                    return s[h];
                  });
              function o(t, e) {
                var i = e.percents,
                  r = e.lengths,
                  n = i.length,
                  s = _((n - 1) * t),
                  a = t * e.addedLength,
                  o = 0;
                if (s === n - 1 || 0 === s || a === r[s]) return i[s];
                for (var h = r[s] > a ? -1 : 1, l = !0; l; )
                  if (
                    (r[s] <= a && r[s + 1] > a
                      ? ((o = (a - r[s]) / (r[s + 1] - r[s])), (l = !1))
                      : (s += h),
                    s < 0 || s >= n - 1)
                  ) {
                    if (s === n - 1) return i[s];
                    l = !1;
                  }
                return i[s] + (i[s + 1] - i[s]) * o;
              }
              var h = f("float32", 8);
              return {
                getSegmentsLength: function (t) {
                  var e,
                    r = st.newElement(),
                    n = t.c,
                    s = t.v,
                    a = t.o,
                    o = t.i,
                    h = t._length,
                    l = r.lengths,
                    f = 0;
                  for (e = 0; e < h - 1; e += 1)
                    (l[e] = i(s[e], s[e + 1], a[e], o[e + 1])),
                      (f += l[e].addedLength);
                  return (
                    n &&
                      h &&
                      ((l[e] = i(s[e], s[0], a[e], o[0])),
                      (f += l[e].addedLength)),
                    (r.totalLength = f),
                    r
                  );
                },
                getNewSegment: function (e, i, r, n, s, a, l) {
                  s < 0 ? (s = 0) : s > 1 && (s = 1);
                  var f,
                    c = o(s, l),
                    u = o((a = a > 1 ? 1 : a), l),
                    p = e.length,
                    d = 1 - c,
                    m = 1 - u,
                    g = d * d * d,
                    y = c * d * d * 3,
                    v = c * c * d * 3,
                    b = c * c * c,
                    _ = d * d * m,
                    w = c * d * m + d * c * m + d * d * u,
                    A = c * c * m + d * c * u + c * d * u,
                    x = c * c * u,
                    S = d * m * m,
                    k = c * m * m + d * u * m + d * m * u,
                    E = c * u * m + d * u * u + c * m * u,
                    P = c * u * u,
                    C = m * m * m,
                    D = u * m * m + m * u * m + m * m * u,
                    M = u * u * m + m * u * u + u * m * u,
                    T = u * u * u;
                  for (f = 0; f < p; f += 1)
                    (h[4 * f] =
                      t.round(
                        1e3 * (g * e[f] + y * r[f] + v * n[f] + b * i[f])
                      ) / 1e3),
                      (h[4 * f + 1] =
                        t.round(
                          1e3 * (_ * e[f] + w * r[f] + A * n[f] + x * i[f])
                        ) / 1e3),
                      (h[4 * f + 2] =
                        t.round(
                          1e3 * (S * e[f] + k * r[f] + E * n[f] + P * i[f])
                        ) / 1e3),
                      (h[4 * f + 3] =
                        t.round(
                          1e3 * (C * e[f] + D * r[f] + M * n[f] + T * i[f])
                        ) / 1e3);
                  return h;
                },
                getPointInSegment: function (e, i, r, n, s, a) {
                  var h = o(s, a),
                    l = 1 - h;
                  return [
                    t.round(
                      1e3 *
                        (l * l * l * e[0] +
                          (h * l * l + l * h * l + l * l * h) * r[0] +
                          (h * h * l + l * h * h + h * l * h) * n[0] +
                          h * h * h * i[0])
                    ) / 1e3,
                    t.round(
                      1e3 *
                        (l * l * l * e[1] +
                          (h * l * l + l * h * l + l * l * h) * r[1] +
                          (h * h * l + l * h * h + h * l * h) * n[1] +
                          h * h * h * i[1])
                    ) / 1e3,
                  ];
                },
                buildBezierData: a,
                pointOnLine2D: e,
                pointOnLine3D: function (i, r, n, s, a, o, h, l, f) {
                  if (0 === n && 0 === o && 0 === f) return e(i, r, s, a, h, l);
                  var c,
                    u = t.sqrt(
                      t.pow(s - i, 2) + t.pow(a - r, 2) + t.pow(o - n, 2)
                    ),
                    p = t.sqrt(
                      t.pow(h - i, 2) + t.pow(l - r, 2) + t.pow(f - n, 2)
                    ),
                    d = t.sqrt(
                      t.pow(h - s, 2) + t.pow(l - a, 2) + t.pow(f - o, 2)
                    );
                  return (
                    (c =
                      u > p
                        ? u > d
                          ? u - p - d
                          : d - p - u
                        : d > p
                        ? d - p - u
                        : p - u - d) > -1e-4 && c < 1e-4
                  );
                },
              };
            })(),
            ot = Math.abs;
          function ht(t, e) {
            var i,
              r = this.offsetTime;
            "multidimensional" === this.propType &&
              (i = f("float32", this.pv.length));
            for (
              var n,
                s,
                a,
                o,
                h,
                l,
                c,
                u,
                p,
                d = e.lastIndex,
                m = d,
                g = this.keyframes.length - 1,
                y = !0;
              y;

            ) {
              if (
                ((n = this.keyframes[m]),
                (s = this.keyframes[m + 1]),
                m === g - 1 && t >= s.t - r)
              ) {
                n.h && (n = s), (d = 0);
                break;
              }
              if (s.t - r > t) {
                d = m;
                break;
              }
              m < g - 1 ? (m += 1) : ((d = 0), (y = !1));
            }
            a = this.keyframesMetadata[m] || {};
            var v,
              b,
              _,
              w,
              A,
              x,
              k,
              E,
              P,
              C,
              D,
              M,
              T,
              F,
              O,
              L,
              I,
              R,
              j = s.t - r,
              N = n.t - r;
            if (n.to) {
              a.bezierData ||
                (a.bezierData = at.buildBezierData(
                  n.s,
                  s.s || n.e,
                  n.to,
                  n.ti
                ));
              var B = a.bezierData;
              if (t >= j || t < N) {
                var V = t >= j ? B.points.length - 1 : 0;
                for (h = B.points[V].point.length, o = 0; o < h; o += 1)
                  i[o] = B.points[V].point[o];
              } else {
                a.__fnct
                  ? (p = a.__fnct)
                  : ((p = et.getBezierEasing(
                      n.o.x,
                      n.o.y,
                      n.i.x,
                      n.i.y,
                      n.n
                    ).get),
                    (a.__fnct = p)),
                  (l = p((t - N) / (j - N)));
                var H,
                  z = B.segmentLength * l,
                  q =
                    e.lastFrame < t && e._lastKeyframeIndex === m
                      ? e._lastAddedLength
                      : 0;
                for (
                  u =
                    e.lastFrame < t && e._lastKeyframeIndex === m
                      ? e._lastPoint
                      : 0,
                    y = !0,
                    c = B.points.length;
                  y;

                ) {
                  if (
                    ((q += B.points[u].partialLength),
                    0 === z || 0 === l || u === B.points.length - 1)
                  ) {
                    for (h = B.points[u].point.length, o = 0; o < h; o += 1)
                      i[o] = B.points[u].point[o];
                    break;
                  }
                  if (z >= q && z < q + B.points[u + 1].partialLength) {
                    for (
                      H = (z - q) / B.points[u + 1].partialLength,
                        h = B.points[u].point.length,
                        o = 0;
                      o < h;
                      o += 1
                    )
                      i[o] =
                        B.points[u].point[o] +
                        (B.points[u + 1].point[o] - B.points[u].point[o]) * H;
                    break;
                  }
                  u < c - 1 ? (u += 1) : (y = !1);
                }
                (e._lastPoint = u),
                  (e._lastAddedLength = q - B.points[u].partialLength),
                  (e._lastKeyframeIndex = m);
              }
            } else {
              var U, W, X, Y, G;
              if (((g = n.s.length), (v = s.s || n.e), this.sh && 1 !== n.h))
                t >= j
                  ? ((i[0] = v[0]), (i[1] = v[1]), (i[2] = v[2]))
                  : t <= N
                  ? ((i[0] = n.s[0]), (i[1] = n.s[1]), (i[2] = n.s[2]))
                  : (function (t, e) {
                      var i = e[0],
                        r = e[1],
                        n = e[2],
                        s = e[3],
                        a = Math.atan2(
                          2 * r * s - 2 * i * n,
                          1 - 2 * r * r - 2 * n * n
                        ),
                        o = Math.asin(2 * i * r + 2 * n * s),
                        h = Math.atan2(
                          2 * i * s - 2 * r * n,
                          1 - 2 * i * i - 2 * n * n
                        );
                      (t[0] = a / S), (t[1] = o / S), (t[2] = h / S);
                    })(
                      i,
                      ((b = lt(n.s)),
                      (_ = lt(v)),
                      (w = (t - N) / (j - N)),
                      (C = []),
                      (D = b[0]),
                      (M = b[1]),
                      (T = b[2]),
                      (F = b[3]),
                      (O = _[0]),
                      (L = _[1]),
                      (I = _[2]),
                      (R = _[3]),
                      (x = D * O + M * L + T * I + F * R) < 0 &&
                        ((x = -x), (O = -O), (L = -L), (I = -I), (R = -R)),
                      1 - x > 1e-6
                        ? ((A = Math.acos(x)),
                          (k = Math.sin(A)),
                          (E = Math.sin((1 - w) * A) / k),
                          (P = Math.sin(w * A) / k))
                        : ((E = 1 - w), (P = w)),
                      (C[0] = E * D + P * O),
                      (C[1] = E * M + P * L),
                      (C[2] = E * T + P * I),
                      (C[3] = E * F + P * R),
                      C)
                    );
              else
                for (m = 0; m < g; m += 1)
                  1 !== n.h &&
                    (t >= j
                      ? (l = 1)
                      : t < N
                      ? (l = 0)
                      : (n.o.x.constructor === Array
                          ? (a.__fnct || (a.__fnct = []),
                            a.__fnct[m]
                              ? (p = a.__fnct[m])
                              : ((U =
                                  void 0 === n.o.x[m] ? n.o.x[0] : n.o.x[m]),
                                (W = void 0 === n.o.y[m] ? n.o.y[0] : n.o.y[m]),
                                (X = void 0 === n.i.x[m] ? n.i.x[0] : n.i.x[m]),
                                (Y = void 0 === n.i.y[m] ? n.i.y[0] : n.i.y[m]),
                                (p = et.getBezierEasing(U, W, X, Y).get),
                                (a.__fnct[m] = p)))
                          : a.__fnct
                          ? (p = a.__fnct)
                          : ((U = n.o.x),
                            (W = n.o.y),
                            (X = n.i.x),
                            (Y = n.i.y),
                            (p = et.getBezierEasing(U, W, X, Y).get),
                            (n.keyframeMetadata = p)),
                        (l = p((t - N) / (j - N))))),
                    (v = s.s || n.e),
                    (G = 1 === n.h ? n.s[m] : n.s[m] + (v[m] - n.s[m]) * l),
                    "multidimensional" === this.propType ? (i[m] = G) : (i = G);
            }
            return (e.lastIndex = d), i;
          }
          function lt(t) {
            var e = t[0] * S,
              i = t[1] * S,
              r = t[2] * S,
              n = Math.cos(e / 2),
              s = Math.cos(i / 2),
              a = Math.cos(r / 2),
              o = Math.sin(e / 2),
              h = Math.sin(i / 2),
              l = Math.sin(r / 2);
            return [
              o * h * a + n * s * l,
              o * s * a + n * h * l,
              n * h * a - o * s * l,
              n * s * a - o * h * l,
            ];
          }
          function ft() {
            var t = this.comp.renderedFrame - this.offsetTime,
              e = this.keyframes[0].t - this.offsetTime,
              i = this.keyframes[this.keyframes.length - 1].t - this.offsetTime;
            if (
              !(
                t === this._caching.lastFrame ||
                (-999999 !== this._caching.lastFrame &&
                  ((this._caching.lastFrame >= i && t >= i) ||
                    (this._caching.lastFrame < e && t < e)))
              )
            ) {
              this._caching.lastFrame >= t &&
                ((this._caching._lastKeyframeIndex = -1),
                (this._caching.lastIndex = 0));
              var r = this.interpolateValue(t, this._caching);
              this.pv = r;
            }
            return (this._caching.lastFrame = t), this.pv;
          }
          function ct(t) {
            var e;
            if ("unidimensional" === this.propType)
              (e = t * this.mult),
                ot(this.v - e) > 1e-5 && ((this.v = e), (this._mdf = !0));
            else
              for (var i = 0, r = this.v.length; i < r; )
                (e = t[i] * this.mult),
                  ot(this.v[i] - e) > 1e-5 &&
                    ((this.v[i] = e), (this._mdf = !0)),
                  (i += 1);
          }
          function ut() {
            if (
              this.elem.globalData.frameId !== this.frameId &&
              this.effectsSequence.length
            )
              if (this.lock) this.setVValue(this.pv);
              else {
                var t;
                (this.lock = !0), (this._mdf = this._isFirstFrame);
                var e = this.effectsSequence.length,
                  i = this.kf ? this.pv : this.data.k;
                for (t = 0; t < e; t += 1) i = this.effectsSequence[t](i);
                this.setVValue(i),
                  (this._isFirstFrame = !1),
                  (this.lock = !1),
                  (this.frameId = this.elem.globalData.frameId);
              }
          }
          function pt(t) {
            this.effectsSequence.push(t),
              this.container.addDynamicProperty(this);
          }
          function dt(t, e, i, r) {
            (this.propType = "unidimensional"),
              (this.mult = i || 1),
              (this.data = e),
              (this.v = i ? e.k * i : e.k),
              (this.pv = e.k),
              (this._mdf = !1),
              (this.elem = t),
              (this.container = r),
              (this.comp = t.comp),
              (this.k = !1),
              (this.kf = !1),
              (this.vel = 0),
              (this.effectsSequence = []),
              (this._isFirstFrame = !0),
              (this.getValue = ut),
              (this.setVValue = ct),
              (this.addEffect = pt);
          }
          function mt(t, e, i, r) {
            var n;
            (this.propType = "multidimensional"),
              (this.mult = i || 1),
              (this.data = e),
              (this._mdf = !1),
              (this.elem = t),
              (this.container = r),
              (this.comp = t.comp),
              (this.k = !1),
              (this.kf = !1),
              (this.frameId = -1);
            var s = e.k.length;
            for (
              this.v = f("float32", s),
                this.pv = f("float32", s),
                this.vel = f("float32", s),
                n = 0;
              n < s;
              n += 1
            )
              (this.v[n] = e.k[n] * this.mult), (this.pv[n] = e.k[n]);
            (this._isFirstFrame = !0),
              (this.effectsSequence = []),
              (this.getValue = ut),
              (this.setVValue = ct),
              (this.addEffect = pt);
          }
          function gt(t, e, i, r) {
            (this.propType = "unidimensional"),
              (this.keyframes = e.k),
              (this.keyframesMetadata = []),
              (this.offsetTime = t.data.st),
              (this.frameId = -1),
              (this._caching = {
                lastFrame: -999999,
                lastIndex: 0,
                value: 0,
                _lastKeyframeIndex: -1,
              }),
              (this.k = !0),
              (this.kf = !0),
              (this.data = e),
              (this.mult = i || 1),
              (this.elem = t),
              (this.container = r),
              (this.comp = t.comp),
              (this.v = -999999),
              (this.pv = -999999),
              (this._isFirstFrame = !0),
              (this.getValue = ut),
              (this.setVValue = ct),
              (this.interpolateValue = ht),
              (this.effectsSequence = [ft.bind(this)]),
              (this.addEffect = pt);
          }
          function yt(t, e, i, r) {
            var n;
            this.propType = "multidimensional";
            var s,
              a,
              o,
              h,
              l = e.k.length;
            for (n = 0; n < l - 1; n += 1)
              e.k[n].to &&
                e.k[n].s &&
                e.k[n + 1] &&
                e.k[n + 1].s &&
                ((s = e.k[n].s),
                (a = e.k[n + 1].s),
                (o = e.k[n].to),
                (h = e.k[n].ti),
                ((2 === s.length &&
                  (s[0] !== a[0] || s[1] !== a[1]) &&
                  at.pointOnLine2D(
                    s[0],
                    s[1],
                    a[0],
                    a[1],
                    s[0] + o[0],
                    s[1] + o[1]
                  ) &&
                  at.pointOnLine2D(
                    s[0],
                    s[1],
                    a[0],
                    a[1],
                    a[0] + h[0],
                    a[1] + h[1]
                  )) ||
                  (3 === s.length &&
                    (s[0] !== a[0] || s[1] !== a[1] || s[2] !== a[2]) &&
                    at.pointOnLine3D(
                      s[0],
                      s[1],
                      s[2],
                      a[0],
                      a[1],
                      a[2],
                      s[0] + o[0],
                      s[1] + o[1],
                      s[2] + o[2]
                    ) &&
                    at.pointOnLine3D(
                      s[0],
                      s[1],
                      s[2],
                      a[0],
                      a[1],
                      a[2],
                      a[0] + h[0],
                      a[1] + h[1],
                      a[2] + h[2]
                    ))) &&
                  ((e.k[n].to = null), (e.k[n].ti = null)),
                s[0] === a[0] &&
                  s[1] === a[1] &&
                  0 === o[0] &&
                  0 === o[1] &&
                  0 === h[0] &&
                  0 === h[1] &&
                  (2 === s.length ||
                    (s[2] === a[2] && 0 === o[2] && 0 === h[2])) &&
                  ((e.k[n].to = null), (e.k[n].ti = null)));
            (this.effectsSequence = [ft.bind(this)]),
              (this.data = e),
              (this.keyframes = e.k),
              (this.keyframesMetadata = []),
              (this.offsetTime = t.data.st),
              (this.k = !0),
              (this.kf = !0),
              (this._isFirstFrame = !0),
              (this.mult = i || 1),
              (this.elem = t),
              (this.container = r),
              (this.comp = t.comp),
              (this.getValue = ut),
              (this.setVValue = ct),
              (this.interpolateValue = ht),
              (this.frameId = -1);
            var c = e.k[0].s.length;
            for (
              this.v = f("float32", c), this.pv = f("float32", c), n = 0;
              n < c;
              n += 1
            )
              (this.v[n] = -999999), (this.pv[n] = -999999);
            (this._caching = {
              lastFrame: -999999,
              lastIndex: 0,
              value: f("float32", c),
            }),
              (this.addEffect = pt);
          }
          var vt = {
            getProp: function (t, e, i, r, n) {
              var s;
              if (
                (e.sid && (e = t.globalData.slotManager.getProp(e)), e.k.length)
              )
                if ("number" == typeof e.k[0]) s = new mt(t, e, r, n);
                else
                  switch (i) {
                    case 0:
                      s = new gt(t, e, r, n);
                      break;
                    case 1:
                      s = new yt(t, e, r, n);
                  }
              else s = new dt(t, e, r, n);
              return s.effectsSequence.length && n.addDynamicProperty(s), s;
            },
          };
          function bt() {}
          bt.prototype = {
            addDynamicProperty: function (t) {
              -1 === this.dynamicProperties.indexOf(t) &&
                (this.dynamicProperties.push(t),
                this.container.addDynamicProperty(this),
                (this._isAnimated = !0));
            },
            iterateDynamicProperties: function () {
              var t;
              this._mdf = !1;
              var e = this.dynamicProperties.length;
              for (t = 0; t < e; t += 1)
                this.dynamicProperties[t].getValue(),
                  this.dynamicProperties[t]._mdf && (this._mdf = !0);
            },
            initDynamicPropertyContainer: function (t) {
              (this.container = t),
                (this.dynamicProperties = []),
                (this._mdf = !1),
                (this._isAnimated = !1);
            },
          };
          var _t = rt(8, function () {
            return f("float32", 2);
          });
          function wt() {
            (this.c = !1),
              (this._length = 0),
              (this._maxLength = 8),
              (this.v = c(this._maxLength)),
              (this.o = c(this._maxLength)),
              (this.i = c(this._maxLength));
          }
          (wt.prototype.setPathData = function (t, e) {
            (this.c = t), this.setLength(e);
            for (var i = 0; i < e; )
              (this.v[i] = _t.newElement()),
                (this.o[i] = _t.newElement()),
                (this.i[i] = _t.newElement()),
                (i += 1);
          }),
            (wt.prototype.setLength = function (t) {
              for (; this._maxLength < t; ) this.doubleArrayLength();
              this._length = t;
            }),
            (wt.prototype.doubleArrayLength = function () {
              (this.v = this.v.concat(c(this._maxLength))),
                (this.i = this.i.concat(c(this._maxLength))),
                (this.o = this.o.concat(c(this._maxLength))),
                (this._maxLength *= 2);
            }),
            (wt.prototype.setXYAt = function (t, e, i, r, n) {
              var s;
              switch (
                ((this._length = Math.max(this._length, r + 1)),
                this._length >= this._maxLength && this.doubleArrayLength(),
                i)
              ) {
                case "v":
                  s = this.v;
                  break;
                case "i":
                  s = this.i;
                  break;
                case "o":
                  s = this.o;
                  break;
                default:
                  s = [];
              }
              (!s[r] || (s[r] && !n)) && (s[r] = _t.newElement()),
                (s[r][0] = t),
                (s[r][1] = e);
            }),
            (wt.prototype.setTripleAt = function (t, e, i, r, n, s, a, o) {
              this.setXYAt(t, e, "v", a, o),
                this.setXYAt(i, r, "o", a, o),
                this.setXYAt(n, s, "i", a, o);
            }),
            (wt.prototype.reverse = function () {
              var t = new wt();
              t.setPathData(this.c, this._length);
              var e = this.v,
                i = this.o,
                r = this.i,
                n = 0;
              this.c &&
                (t.setTripleAt(
                  e[0][0],
                  e[0][1],
                  r[0][0],
                  r[0][1],
                  i[0][0],
                  i[0][1],
                  0,
                  !1
                ),
                (n = 1));
              var s,
                a = this._length - 1,
                o = this._length;
              for (s = n; s < o; s += 1)
                t.setTripleAt(
                  e[a][0],
                  e[a][1],
                  r[a][0],
                  r[a][1],
                  i[a][0],
                  i[a][1],
                  s,
                  !1
                ),
                  (a -= 1);
              return t;
            }),
            (wt.prototype.length = function () {
              return this._length;
            });
          var At = (function () {
            var t = rt(
              4,
              function () {
                return new wt();
              },
              function (t) {
                var e,
                  i = t._length;
                for (e = 0; e < i; e += 1)
                  _t.release(t.v[e]),
                    _t.release(t.i[e]),
                    _t.release(t.o[e]),
                    (t.v[e] = null),
                    (t.i[e] = null),
                    (t.o[e] = null);
                (t._length = 0), (t.c = !1);
              }
            );
            return (
              (t.clone = function (e) {
                var i,
                  r = t.newElement(),
                  n = void 0 === e._length ? e.v.length : e._length;
                for (r.setLength(n), r.c = e.c, i = 0; i < n; i += 1)
                  r.setTripleAt(
                    e.v[i][0],
                    e.v[i][1],
                    e.o[i][0],
                    e.o[i][1],
                    e.i[i][0],
                    e.i[i][1],
                    i
                  );
                return r;
              }),
              t
            );
          })();
          function xt() {
            (this._length = 0),
              (this._maxLength = 4),
              (this.shapes = c(this._maxLength));
          }
          (xt.prototype.addShape = function (t) {
            this._length === this._maxLength &&
              ((this.shapes = this.shapes.concat(c(this._maxLength))),
              (this._maxLength *= 2)),
              (this.shapes[this._length] = t),
              (this._length += 1);
          }),
            (xt.prototype.releaseShapes = function () {
              var t;
              for (t = 0; t < this._length; t += 1) At.release(this.shapes[t]);
              this._length = 0;
            });
          var St,
            kt,
            Et,
            Pt,
            Ct =
              ((St = {
                newShapeCollection: function () {
                  return kt ? Pt[(kt -= 1)] : new xt();
                },
                release: function (t) {
                  var e,
                    i = t._length;
                  for (e = 0; e < i; e += 1) At.release(t.shapes[e]);
                  (t._length = 0),
                    kt === Et && ((Pt = it.double(Pt)), (Et *= 2)),
                    (Pt[kt] = t),
                    (kt += 1);
                },
              }),
              (kt = 0),
              (Pt = c((Et = 4))),
              St),
            Dt = (function () {
              function t(t, e, i) {
                var r,
                  n,
                  s,
                  a,
                  o,
                  h,
                  l,
                  f,
                  c,
                  u = i.lastIndex,
                  p = this.keyframes;
                if (t < p[0].t - this.offsetTime)
                  (r = p[0].s[0]), (s = !0), (u = 0);
                else if (t >= p[p.length - 1].t - this.offsetTime)
                  (r = p[p.length - 1].s
                    ? p[p.length - 1].s[0]
                    : p[p.length - 2].e[0]),
                    (s = !0);
                else {
                  for (
                    var d, m, g, y = u, v = p.length - 1, b = !0;
                    b &&
                    ((d = p[y]), !((m = p[y + 1]).t - this.offsetTime > t));

                  )
                    y < v - 1 ? (y += 1) : (b = !1);
                  if (
                    ((g = this.keyframesMetadata[y] || {}),
                    (u = y),
                    !(s = 1 === d.h))
                  ) {
                    if (t >= m.t - this.offsetTime) f = 1;
                    else if (t < d.t - this.offsetTime) f = 0;
                    else {
                      var _;
                      g.__fnct
                        ? (_ = g.__fnct)
                        : ((_ = et.getBezierEasing(
                            d.o.x,
                            d.o.y,
                            d.i.x,
                            d.i.y
                          ).get),
                          (g.__fnct = _)),
                        (f = _(
                          (t - (d.t - this.offsetTime)) /
                            (m.t - this.offsetTime - (d.t - this.offsetTime))
                        ));
                    }
                    n = m.s ? m.s[0] : d.e[0];
                  }
                  r = d.s[0];
                }
                for (
                  h = e._length, l = r.i[0].length, i.lastIndex = u, a = 0;
                  a < h;
                  a += 1
                )
                  for (o = 0; o < l; o += 1)
                    (c = s
                      ? r.i[a][o]
                      : r.i[a][o] + (n.i[a][o] - r.i[a][o]) * f),
                      (e.i[a][o] = c),
                      (c = s
                        ? r.o[a][o]
                        : r.o[a][o] + (n.o[a][o] - r.o[a][o]) * f),
                      (e.o[a][o] = c),
                      (c = s
                        ? r.v[a][o]
                        : r.v[a][o] + (n.v[a][o] - r.v[a][o]) * f),
                      (e.v[a][o] = c);
              }
              function e() {
                var t = this.comp.renderedFrame - this.offsetTime,
                  e = this.keyframes[0].t - this.offsetTime,
                  i =
                    this.keyframes[this.keyframes.length - 1].t -
                    this.offsetTime,
                  r = this._caching.lastFrame;
                return (
                  (-999999 !== r && ((r < e && t < e) || (r > i && t > i))) ||
                    ((this._caching.lastIndex =
                      r < t ? this._caching.lastIndex : 0),
                    this.interpolateShape(t, this.pv, this._caching)),
                  (this._caching.lastFrame = t),
                  this.pv
                );
              }
              function i() {
                this.paths = this.localShapeCollection;
              }
              function r(t) {
                (function (t, e) {
                  if (t._length !== e._length || t.c !== e.c) return !1;
                  var i,
                    r = t._length;
                  for (i = 0; i < r; i += 1)
                    if (
                      t.v[i][0] !== e.v[i][0] ||
                      t.v[i][1] !== e.v[i][1] ||
                      t.o[i][0] !== e.o[i][0] ||
                      t.o[i][1] !== e.o[i][1] ||
                      t.i[i][0] !== e.i[i][0] ||
                      t.i[i][1] !== e.i[i][1]
                    )
                      return !1;
                  return !0;
                })(this.v, t) ||
                  ((this.v = At.clone(t)),
                  this.localShapeCollection.releaseShapes(),
                  this.localShapeCollection.addShape(this.v),
                  (this._mdf = !0),
                  (this.paths = this.localShapeCollection));
              }
              function n() {
                if (this.elem.globalData.frameId !== this.frameId)
                  if (this.effectsSequence.length)
                    if (this.lock) this.setVValue(this.pv);
                    else {
                      var t, e;
                      (this.lock = !0),
                        (this._mdf = !1),
                        (t = this.kf
                          ? this.pv
                          : this.data.ks
                          ? this.data.ks.k
                          : this.data.pt.k);
                      var i = this.effectsSequence.length;
                      for (e = 0; e < i; e += 1) t = this.effectsSequence[e](t);
                      this.setVValue(t),
                        (this.lock = !1),
                        (this.frameId = this.elem.globalData.frameId);
                    }
                  else this._mdf = !1;
              }
              function s(t, e, r) {
                (this.propType = "shape"),
                  (this.comp = t.comp),
                  (this.container = t),
                  (this.elem = t),
                  (this.data = e),
                  (this.k = !1),
                  (this.kf = !1),
                  (this._mdf = !1);
                var n = 3 === r ? e.pt.k : e.ks.k;
                (this.v = At.clone(n)),
                  (this.pv = At.clone(this.v)),
                  (this.localShapeCollection = Ct.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.paths.addShape(this.v),
                  (this.reset = i),
                  (this.effectsSequence = []);
              }
              function a(t) {
                this.effectsSequence.push(t),
                  this.container.addDynamicProperty(this);
              }
              function h(t, r, n) {
                (this.propType = "shape"),
                  (this.comp = t.comp),
                  (this.elem = t),
                  (this.container = t),
                  (this.offsetTime = t.data.st),
                  (this.keyframes = 3 === n ? r.pt.k : r.ks.k),
                  (this.keyframesMetadata = []),
                  (this.k = !0),
                  (this.kf = !0);
                var s = this.keyframes[0].s[0].i.length;
                (this.v = At.newElement()),
                  this.v.setPathData(this.keyframes[0].s[0].c, s),
                  (this.pv = At.clone(this.v)),
                  (this.localShapeCollection = Ct.newShapeCollection()),
                  (this.paths = this.localShapeCollection),
                  this.paths.addShape(this.v),
                  (this.lastFrame = -999999),
                  (this.reset = i),
                  (this._caching = { lastFrame: -999999, lastIndex: 0 }),
                  (this.effectsSequence = [e.bind(this)]);
              }
              (s.prototype.interpolateShape = t),
                (s.prototype.getValue = n),
                (s.prototype.setVValue = r),
                (s.prototype.addEffect = a),
                (h.prototype.getValue = n),
                (h.prototype.interpolateShape = t),
                (h.prototype.setVValue = r),
                (h.prototype.addEffect = a);
              var l = (function () {
                  function t(t, e) {
                    (this.v = At.newElement()),
                      this.v.setPathData(!0, 4),
                      (this.localShapeCollection = Ct.newShapeCollection()),
                      (this.paths = this.localShapeCollection),
                      this.localShapeCollection.addShape(this.v),
                      (this.d = e.d),
                      (this.elem = t),
                      (this.comp = t.comp),
                      (this.frameId = -1),
                      this.initDynamicPropertyContainer(t),
                      (this.p = vt.getProp(t, e.p, 1, 0, this)),
                      (this.s = vt.getProp(t, e.s, 1, 0, this)),
                      this.dynamicProperties.length
                        ? (this.k = !0)
                        : ((this.k = !1), this.convertEllToPath());
                  }
                  return (
                    (t.prototype = {
                      reset: i,
                      getValue: function () {
                        this.elem.globalData.frameId !== this.frameId &&
                          ((this.frameId = this.elem.globalData.frameId),
                          this.iterateDynamicProperties(),
                          this._mdf && this.convertEllToPath());
                      },
                      convertEllToPath: function () {
                        var t = this.p.v[0],
                          e = this.p.v[1],
                          i = this.s.v[0] / 2,
                          r = this.s.v[1] / 2,
                          n = 3 !== this.d,
                          s = this.v;
                        (s.v[0][0] = t),
                          (s.v[0][1] = e - r),
                          (s.v[1][0] = n ? t + i : t - i),
                          (s.v[1][1] = e),
                          (s.v[2][0] = t),
                          (s.v[2][1] = e + r),
                          (s.v[3][0] = n ? t - i : t + i),
                          (s.v[3][1] = e),
                          (s.i[0][0] = n ? t - 0.5519 * i : t + 0.5519 * i),
                          (s.i[0][1] = e - r),
                          (s.i[1][0] = n ? t + i : t - i),
                          (s.i[1][1] = e - 0.5519 * r),
                          (s.i[2][0] = n ? t + 0.5519 * i : t - 0.5519 * i),
                          (s.i[2][1] = e + r),
                          (s.i[3][0] = n ? t - i : t + i),
                          (s.i[3][1] = e + 0.5519 * r),
                          (s.o[0][0] = n ? t + 0.5519 * i : t - 0.5519 * i),
                          (s.o[0][1] = e - r),
                          (s.o[1][0] = n ? t + i : t - i),
                          (s.o[1][1] = e + 0.5519 * r),
                          (s.o[2][0] = n ? t - 0.5519 * i : t + 0.5519 * i),
                          (s.o[2][1] = e + r),
                          (s.o[3][0] = n ? t - i : t + i),
                          (s.o[3][1] = e - 0.5519 * r);
                      },
                    }),
                    o([bt], t),
                    t
                  );
                })(),
                f = (function () {
                  function t(t, e) {
                    (this.v = At.newElement()),
                      this.v.setPathData(!0, 0),
                      (this.elem = t),
                      (this.comp = t.comp),
                      (this.data = e),
                      (this.frameId = -1),
                      (this.d = e.d),
                      this.initDynamicPropertyContainer(t),
                      1 === e.sy
                        ? ((this.ir = vt.getProp(t, e.ir, 0, 0, this)),
                          (this.is = vt.getProp(t, e.is, 0, 0.01, this)),
                          (this.convertToPath = this.convertStarToPath))
                        : (this.convertToPath = this.convertPolygonToPath),
                      (this.pt = vt.getProp(t, e.pt, 0, 0, this)),
                      (this.p = vt.getProp(t, e.p, 1, 0, this)),
                      (this.r = vt.getProp(t, e.r, 0, S, this)),
                      (this.or = vt.getProp(t, e.or, 0, 0, this)),
                      (this.os = vt.getProp(t, e.os, 0, 0.01, this)),
                      (this.localShapeCollection = Ct.newShapeCollection()),
                      this.localShapeCollection.addShape(this.v),
                      (this.paths = this.localShapeCollection),
                      this.dynamicProperties.length
                        ? (this.k = !0)
                        : ((this.k = !1), this.convertToPath());
                  }
                  return (
                    (t.prototype = {
                      reset: i,
                      getValue: function () {
                        this.elem.globalData.frameId !== this.frameId &&
                          ((this.frameId = this.elem.globalData.frameId),
                          this.iterateDynamicProperties(),
                          this._mdf && this.convertToPath());
                      },
                      convertStarToPath: function () {
                        var t,
                          e,
                          i,
                          r,
                          n = 2 * Math.floor(this.pt.v),
                          s = (2 * Math.PI) / n,
                          a = !0,
                          o = this.or.v,
                          h = this.ir.v,
                          l = this.os.v,
                          f = this.is.v,
                          c = (2 * Math.PI * o) / (2 * n),
                          u = (2 * Math.PI * h) / (2 * n),
                          p = -Math.PI / 2;
                        p += this.r.v;
                        var d = 3 === this.data.d ? -1 : 1;
                        for (this.v._length = 0, t = 0; t < n; t += 1) {
                          (i = a ? l : f), (r = a ? c : u);
                          var m = (e = a ? o : h) * Math.cos(p),
                            g = e * Math.sin(p),
                            y =
                              0 === m && 0 === g
                                ? 0
                                : g / Math.sqrt(m * m + g * g),
                            v =
                              0 === m && 0 === g
                                ? 0
                                : -m / Math.sqrt(m * m + g * g);
                          (m += +this.p.v[0]),
                            (g += +this.p.v[1]),
                            this.v.setTripleAt(
                              m,
                              g,
                              m - y * r * i * d,
                              g - v * r * i * d,
                              m + y * r * i * d,
                              g + v * r * i * d,
                              t,
                              !0
                            ),
                            (a = !a),
                            (p += s * d);
                        }
                      },
                      convertPolygonToPath: function () {
                        var t,
                          e = Math.floor(this.pt.v),
                          i = (2 * Math.PI) / e,
                          r = this.or.v,
                          n = this.os.v,
                          s = (2 * Math.PI * r) / (4 * e),
                          a = 0.5 * -Math.PI,
                          o = 3 === this.data.d ? -1 : 1;
                        for (
                          a += this.r.v, this.v._length = 0, t = 0;
                          t < e;
                          t += 1
                        ) {
                          var h = r * Math.cos(a),
                            l = r * Math.sin(a),
                            f =
                              0 === h && 0 === l
                                ? 0
                                : l / Math.sqrt(h * h + l * l),
                            c =
                              0 === h && 0 === l
                                ? 0
                                : -h / Math.sqrt(h * h + l * l);
                          (h += +this.p.v[0]),
                            (l += +this.p.v[1]),
                            this.v.setTripleAt(
                              h,
                              l,
                              h - f * s * n * o,
                              l - c * s * n * o,
                              h + f * s * n * o,
                              l + c * s * n * o,
                              t,
                              !0
                            ),
                            (a += i * o);
                        }
                        (this.paths.length = 0), (this.paths[0] = this.v);
                      },
                    }),
                    o([bt], t),
                    t
                  );
                })(),
                c = (function () {
                  function t(t, e) {
                    (this.v = At.newElement()),
                      (this.v.c = !0),
                      (this.localShapeCollection = Ct.newShapeCollection()),
                      this.localShapeCollection.addShape(this.v),
                      (this.paths = this.localShapeCollection),
                      (this.elem = t),
                      (this.comp = t.comp),
                      (this.frameId = -1),
                      (this.d = e.d),
                      this.initDynamicPropertyContainer(t),
                      (this.p = vt.getProp(t, e.p, 1, 0, this)),
                      (this.s = vt.getProp(t, e.s, 1, 0, this)),
                      (this.r = vt.getProp(t, e.r, 0, 0, this)),
                      this.dynamicProperties.length
                        ? (this.k = !0)
                        : ((this.k = !1), this.convertRectToPath());
                  }
                  return (
                    (t.prototype = {
                      convertRectToPath: function () {
                        var t = this.p.v[0],
                          e = this.p.v[1],
                          i = this.s.v[0] / 2,
                          r = this.s.v[1] / 2,
                          n = w(i, r, this.r.v),
                          s = n * (1 - 0.5519);
                        (this.v._length = 0),
                          2 === this.d || 1 === this.d
                            ? (this.v.setTripleAt(
                                t + i,
                                e - r + n,
                                t + i,
                                e - r + n,
                                t + i,
                                e - r + s,
                                0,
                                !0
                              ),
                              this.v.setTripleAt(
                                t + i,
                                e + r - n,
                                t + i,
                                e + r - s,
                                t + i,
                                e + r - n,
                                1,
                                !0
                              ),
                              0 !== n
                                ? (this.v.setTripleAt(
                                    t + i - n,
                                    e + r,
                                    t + i - n,
                                    e + r,
                                    t + i - s,
                                    e + r,
                                    2,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i + n,
                                    e + r,
                                    t - i + s,
                                    e + r,
                                    t - i + n,
                                    e + r,
                                    3,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i,
                                    e + r - n,
                                    t - i,
                                    e + r - n,
                                    t - i,
                                    e + r - s,
                                    4,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i,
                                    e - r + n,
                                    t - i,
                                    e - r + s,
                                    t - i,
                                    e - r + n,
                                    5,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i + n,
                                    e - r,
                                    t - i + n,
                                    e - r,
                                    t - i + s,
                                    e - r,
                                    6,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t + i - n,
                                    e - r,
                                    t + i - s,
                                    e - r,
                                    t + i - n,
                                    e - r,
                                    7,
                                    !0
                                  ))
                                : (this.v.setTripleAt(
                                    t - i,
                                    e + r,
                                    t - i + s,
                                    e + r,
                                    t - i,
                                    e + r,
                                    2
                                  ),
                                  this.v.setTripleAt(
                                    t - i,
                                    e - r,
                                    t - i,
                                    e - r + s,
                                    t - i,
                                    e - r,
                                    3
                                  )))
                            : (this.v.setTripleAt(
                                t + i,
                                e - r + n,
                                t + i,
                                e - r + s,
                                t + i,
                                e - r + n,
                                0,
                                !0
                              ),
                              0 !== n
                                ? (this.v.setTripleAt(
                                    t + i - n,
                                    e - r,
                                    t + i - n,
                                    e - r,
                                    t + i - s,
                                    e - r,
                                    1,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i + n,
                                    e - r,
                                    t - i + s,
                                    e - r,
                                    t - i + n,
                                    e - r,
                                    2,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i,
                                    e - r + n,
                                    t - i,
                                    e - r + n,
                                    t - i,
                                    e - r + s,
                                    3,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i,
                                    e + r - n,
                                    t - i,
                                    e + r - s,
                                    t - i,
                                    e + r - n,
                                    4,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i + n,
                                    e + r,
                                    t - i + n,
                                    e + r,
                                    t - i + s,
                                    e + r,
                                    5,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t + i - n,
                                    e + r,
                                    t + i - s,
                                    e + r,
                                    t + i - n,
                                    e + r,
                                    6,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t + i,
                                    e + r - n,
                                    t + i,
                                    e + r - n,
                                    t + i,
                                    e + r - s,
                                    7,
                                    !0
                                  ))
                                : (this.v.setTripleAt(
                                    t - i,
                                    e - r,
                                    t - i + s,
                                    e - r,
                                    t - i,
                                    e - r,
                                    1,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t - i,
                                    e + r,
                                    t - i,
                                    e + r - s,
                                    t - i,
                                    e + r,
                                    2,
                                    !0
                                  ),
                                  this.v.setTripleAt(
                                    t + i,
                                    e + r,
                                    t + i - s,
                                    e + r,
                                    t + i,
                                    e + r,
                                    3,
                                    !0
                                  )));
                      },
                      getValue: function () {
                        this.elem.globalData.frameId !== this.frameId &&
                          ((this.frameId = this.elem.globalData.frameId),
                          this.iterateDynamicProperties(),
                          this._mdf && this.convertRectToPath());
                      },
                      reset: i,
                    }),
                    o([bt], t),
                    t
                  );
                })(),
                u = {
                  getShapeProp: function (t, e, i) {
                    var r;
                    return (
                      3 === i || 4 === i
                        ? (r = (3 === i ? e.pt : e.ks).k.length
                            ? new h(t, e, i)
                            : new s(t, e, i))
                        : 5 === i
                        ? (r = new c(t, e))
                        : 6 === i
                        ? (r = new l(t, e))
                        : 7 === i && (r = new f(t, e)),
                      r.k && t.addDynamicProperty(r),
                      r
                    );
                  },
                  getConstructorFunction: function () {
                    return s;
                  },
                  getKeyframedConstructorFunction: function () {
                    return h;
                  },
                };
              return u;
            })(),
            Mt = (function () {
              var t = Math.cos,
                e = Math.sin,
                i = Math.tan,
                r = Math.round;
              function n() {
                return (
                  (this.props[0] = 1),
                  (this.props[1] = 0),
                  (this.props[2] = 0),
                  (this.props[3] = 0),
                  (this.props[4] = 0),
                  (this.props[5] = 1),
                  (this.props[6] = 0),
                  (this.props[7] = 0),
                  (this.props[8] = 0),
                  (this.props[9] = 0),
                  (this.props[10] = 1),
                  (this.props[11] = 0),
                  (this.props[12] = 0),
                  (this.props[13] = 0),
                  (this.props[14] = 0),
                  (this.props[15] = 1),
                  this
                );
              }
              function s(i) {
                if (0 === i) return this;
                var r = t(i),
                  n = e(i);
                return this._t(r, -n, 0, 0, n, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
              }
              function a(i) {
                if (0 === i) return this;
                var r = t(i),
                  n = e(i);
                return this._t(1, 0, 0, 0, 0, r, -n, 0, 0, n, r, 0, 0, 0, 0, 1);
              }
              function o(i) {
                if (0 === i) return this;
                var r = t(i),
                  n = e(i);
                return this._t(r, 0, n, 0, 0, 1, 0, 0, -n, 0, r, 0, 0, 0, 0, 1);
              }
              function h(i) {
                if (0 === i) return this;
                var r = t(i),
                  n = e(i);
                return this._t(r, -n, 0, 0, n, r, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
              }
              function l(t, e) {
                return this._t(1, e, t, 1, 0, 0);
              }
              function c(t, e) {
                return this.shear(i(t), i(e));
              }
              function u(r, n) {
                var s = t(n),
                  a = e(n);
                return this._t(s, a, 0, 0, -a, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                  ._t(1, 0, 0, 0, i(r), 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
                  ._t(s, -a, 0, 0, a, s, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
              }
              function p(t, e, i) {
                return (
                  i || 0 === i || (i = 1),
                  1 === t && 1 === e && 1 === i
                    ? this
                    : this._t(t, 0, 0, 0, 0, e, 0, 0, 0, 0, i, 0, 0, 0, 0, 1)
                );
              }
              function d(t, e, i, r, n, s, a, o, h, l, f, c, u, p, d, m) {
                return (
                  (this.props[0] = t),
                  (this.props[1] = e),
                  (this.props[2] = i),
                  (this.props[3] = r),
                  (this.props[4] = n),
                  (this.props[5] = s),
                  (this.props[6] = a),
                  (this.props[7] = o),
                  (this.props[8] = h),
                  (this.props[9] = l),
                  (this.props[10] = f),
                  (this.props[11] = c),
                  (this.props[12] = u),
                  (this.props[13] = p),
                  (this.props[14] = d),
                  (this.props[15] = m),
                  this
                );
              }
              function m(t, e, i) {
                return (
                  (i = i || 0),
                  0 !== t || 0 !== e || 0 !== i
                    ? this._t(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, t, e, i, 1)
                    : this
                );
              }
              function g(t, e, i, r, n, s, a, o, h, l, f, c, u, p, d, m) {
                var g = this.props;
                if (
                  1 === t &&
                  0 === e &&
                  0 === i &&
                  0 === r &&
                  0 === n &&
                  1 === s &&
                  0 === a &&
                  0 === o &&
                  0 === h &&
                  0 === l &&
                  1 === f &&
                  0 === c
                )
                  return (
                    (g[12] = g[12] * t + g[15] * u),
                    (g[13] = g[13] * s + g[15] * p),
                    (g[14] = g[14] * f + g[15] * d),
                    (g[15] *= m),
                    (this._identityCalculated = !1),
                    this
                  );
                var y = g[0],
                  v = g[1],
                  b = g[2],
                  _ = g[3],
                  w = g[4],
                  A = g[5],
                  x = g[6],
                  S = g[7],
                  k = g[8],
                  E = g[9],
                  P = g[10],
                  C = g[11],
                  D = g[12],
                  M = g[13],
                  T = g[14],
                  F = g[15];
                return (
                  (g[0] = y * t + v * n + b * h + _ * u),
                  (g[1] = y * e + v * s + b * l + _ * p),
                  (g[2] = y * i + v * a + b * f + _ * d),
                  (g[3] = y * r + v * o + b * c + _ * m),
                  (g[4] = w * t + A * n + x * h + S * u),
                  (g[5] = w * e + A * s + x * l + S * p),
                  (g[6] = w * i + A * a + x * f + S * d),
                  (g[7] = w * r + A * o + x * c + S * m),
                  (g[8] = k * t + E * n + P * h + C * u),
                  (g[9] = k * e + E * s + P * l + C * p),
                  (g[10] = k * i + E * a + P * f + C * d),
                  (g[11] = k * r + E * o + P * c + C * m),
                  (g[12] = D * t + M * n + T * h + F * u),
                  (g[13] = D * e + M * s + T * l + F * p),
                  (g[14] = D * i + M * a + T * f + F * d),
                  (g[15] = D * r + M * o + T * c + F * m),
                  (this._identityCalculated = !1),
                  this
                );
              }
              function y(t) {
                var e = t.props;
                return this.transform(
                  e[0],
                  e[1],
                  e[2],
                  e[3],
                  e[4],
                  e[5],
                  e[6],
                  e[7],
                  e[8],
                  e[9],
                  e[10],
                  e[11],
                  e[12],
                  e[13],
                  e[14],
                  e[15]
                );
              }
              function v() {
                return (
                  this._identityCalculated ||
                    ((this._identity = !(
                      1 !== this.props[0] ||
                      0 !== this.props[1] ||
                      0 !== this.props[2] ||
                      0 !== this.props[3] ||
                      0 !== this.props[4] ||
                      1 !== this.props[5] ||
                      0 !== this.props[6] ||
                      0 !== this.props[7] ||
                      0 !== this.props[8] ||
                      0 !== this.props[9] ||
                      1 !== this.props[10] ||
                      0 !== this.props[11] ||
                      0 !== this.props[12] ||
                      0 !== this.props[13] ||
                      0 !== this.props[14] ||
                      1 !== this.props[15]
                    )),
                    (this._identityCalculated = !0)),
                  this._identity
                );
              }
              function b(t) {
                for (var e = 0; e < 16; ) {
                  if (t.props[e] !== this.props[e]) return !1;
                  e += 1;
                }
                return !0;
              }
              function _(t) {
                var e;
                for (e = 0; e < 16; e += 1) t.props[e] = this.props[e];
                return t;
              }
              function w(t) {
                var e;
                for (e = 0; e < 16; e += 1) this.props[e] = t[e];
              }
              function A(t, e, i) {
                return {
                  x:
                    t * this.props[0] +
                    e * this.props[4] +
                    i * this.props[8] +
                    this.props[12],
                  y:
                    t * this.props[1] +
                    e * this.props[5] +
                    i * this.props[9] +
                    this.props[13],
                  z:
                    t * this.props[2] +
                    e * this.props[6] +
                    i * this.props[10] +
                    this.props[14],
                };
              }
              function x(t, e, i) {
                return (
                  t * this.props[0] +
                  e * this.props[4] +
                  i * this.props[8] +
                  this.props[12]
                );
              }
              function S(t, e, i) {
                return (
                  t * this.props[1] +
                  e * this.props[5] +
                  i * this.props[9] +
                  this.props[13]
                );
              }
              function k(t, e, i) {
                return (
                  t * this.props[2] +
                  e * this.props[6] +
                  i * this.props[10] +
                  this.props[14]
                );
              }
              function E() {
                var t =
                    this.props[0] * this.props[5] -
                    this.props[1] * this.props[4],
                  e = this.props[5] / t,
                  i = -this.props[1] / t,
                  r = -this.props[4] / t,
                  n = this.props[0] / t,
                  s =
                    (this.props[4] * this.props[13] -
                      this.props[5] * this.props[12]) /
                    t,
                  a =
                    -(
                      this.props[0] * this.props[13] -
                      this.props[1] * this.props[12]
                    ) / t,
                  o = new Mt();
                return (
                  (o.props[0] = e),
                  (o.props[1] = i),
                  (o.props[4] = r),
                  (o.props[5] = n),
                  (o.props[12] = s),
                  (o.props[13] = a),
                  o
                );
              }
              function P(t) {
                return this.getInverseMatrix().applyToPointArray(
                  t[0],
                  t[1],
                  t[2] || 0
                );
              }
              function C(t) {
                var e,
                  i = t.length,
                  r = [];
                for (e = 0; e < i; e += 1) r[e] = P(t[e]);
                return r;
              }
              function D(t, e, i) {
                var r = f("float32", 6);
                if (this.isIdentity())
                  (r[0] = t[0]),
                    (r[1] = t[1]),
                    (r[2] = e[0]),
                    (r[3] = e[1]),
                    (r[4] = i[0]),
                    (r[5] = i[1]);
                else {
                  var n = this.props[0],
                    s = this.props[1],
                    a = this.props[4],
                    o = this.props[5],
                    h = this.props[12],
                    l = this.props[13];
                  (r[0] = t[0] * n + t[1] * a + h),
                    (r[1] = t[0] * s + t[1] * o + l),
                    (r[2] = e[0] * n + e[1] * a + h),
                    (r[3] = e[0] * s + e[1] * o + l),
                    (r[4] = i[0] * n + i[1] * a + h),
                    (r[5] = i[0] * s + i[1] * o + l);
                }
                return r;
              }
              function M(t, e, i) {
                return this.isIdentity()
                  ? [t, e, i]
                  : [
                      t * this.props[0] +
                        e * this.props[4] +
                        i * this.props[8] +
                        this.props[12],
                      t * this.props[1] +
                        e * this.props[5] +
                        i * this.props[9] +
                        this.props[13],
                      t * this.props[2] +
                        e * this.props[6] +
                        i * this.props[10] +
                        this.props[14],
                    ];
              }
              function T(t, e) {
                if (this.isIdentity()) return t + "," + e;
                var i = this.props;
                return (
                  Math.round(100 * (t * i[0] + e * i[4] + i[12])) / 100 +
                  "," +
                  Math.round(100 * (t * i[1] + e * i[5] + i[13])) / 100
                );
              }
              function F() {
                for (var t = 0, e = this.props, i = "matrix3d("; t < 16; )
                  (i += r(1e4 * e[t]) / 1e4),
                    (i += 15 === t ? ")" : ","),
                    (t += 1);
                return i;
              }
              function O(t) {
                return (t < 1e-6 && t > 0) || (t > -1e-6 && t < 0)
                  ? r(1e4 * t) / 1e4
                  : t;
              }
              function L() {
                var t = this.props;
                return (
                  "matrix(" +
                  O(t[0]) +
                  "," +
                  O(t[1]) +
                  "," +
                  O(t[4]) +
                  "," +
                  O(t[5]) +
                  "," +
                  O(t[12]) +
                  "," +
                  O(t[13]) +
                  ")"
                );
              }
              return function () {
                (this.reset = n),
                  (this.rotate = s),
                  (this.rotateX = a),
                  (this.rotateY = o),
                  (this.rotateZ = h),
                  (this.skew = c),
                  (this.skewFromAxis = u),
                  (this.shear = l),
                  (this.scale = p),
                  (this.setTransform = d),
                  (this.translate = m),
                  (this.transform = g),
                  (this.multiply = y),
                  (this.applyToPoint = A),
                  (this.applyToX = x),
                  (this.applyToY = S),
                  (this.applyToZ = k),
                  (this.applyToPointArray = M),
                  (this.applyToTriplePoints = D),
                  (this.applyToPointStringified = T),
                  (this.toCSS = F),
                  (this.to2dCSS = L),
                  (this.clone = _),
                  (this.cloneFromProps = w),
                  (this.equals = b),
                  (this.inversePoints = C),
                  (this.inversePoint = P),
                  (this.getInverseMatrix = E),
                  (this._t = this.transform),
                  (this.isIdentity = v),
                  (this._identity = !0),
                  (this._identityCalculated = !1),
                  (this.props = f("float32", 16)),
                  this.reset();
              };
            })();
          function Tt(t) {
            return (Tt =
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
                  })(t);
          }
          var Ft = {};
          function Ot() {
            tt.searchAnimations();
          }
          (Ft.play = tt.play),
            (Ft.pause = tt.pause),
            (Ft.setLocationHref = function (t) {
              r = t;
            }),
            (Ft.togglePause = tt.togglePause),
            (Ft.setSpeed = tt.setSpeed),
            (Ft.setDirection = tt.setDirection),
            (Ft.stop = tt.stop),
            (Ft.searchAnimations = Ot),
            (Ft.registerAnimation = tt.registerAnimation),
            (Ft.loadAnimation = function (t) {
              return tt.loadAnimation(t);
            }),
            (Ft.setSubframeRendering = function (t) {
              !(function (t) {
                p = !!t;
              })(t);
            }),
            (Ft.resize = tt.resize),
            (Ft.goToAndStop = tt.goToAndStop),
            (Ft.destroy = tt.destroy),
            (Ft.setQuality = function (t) {
              if ("string" == typeof t)
                switch (t) {
                  case "high":
                    z(200);
                    break;
                  default:
                  case "medium":
                    z(50);
                    break;
                  case "low":
                    z(10);
                }
              else !isNaN(t) && t > 1 && z(t);
              q() >= 50 ? k(!1) : k(!0);
            }),
            (Ft.inBrowser = function () {
              return "undefined" != typeof navigator;
            }),
            (Ft.installPlugin = function (t, e) {
              "expressions" === t && (d = e);
            }),
            (Ft.freeze = tt.freeze),
            (Ft.unfreeze = tt.unfreeze),
            (Ft.setVolume = tt.setVolume),
            (Ft.mute = tt.mute),
            (Ft.unmute = tt.unmute),
            (Ft.getRegisteredAnimations = tt.getRegisteredAnimations),
            (Ft.useWebWorker = function (t) {
              n = !!t;
            }),
            (Ft.setIDPrefix = function (t) {
              g = t;
            }),
            (Ft.__getFactory = function (t) {
              switch (t) {
                case "propertyFactory":
                  return vt;
                case "shapePropertyFactory":
                  return Dt;
                case "matrix":
                  return Mt;
                default:
                  return null;
              }
            }),
            (Ft.version = "5.12.2");
          var Lt = "",
            It = document.getElementsByTagName("script"),
            Rt = It[It.length - 1] || { src: "" };
          (Lt = Rt.src ? Rt.src.replace(/^[^\?]+\??/, "") : ""),
            (function (t) {
              for (var e = Lt.split("&"), i = 0; i < e.length; i += 1) {
                var r = e[i].split("=");
                if (decodeURIComponent(r[0]) == t)
                  return decodeURIComponent(r[1]);
              }
            })("renderer");
          var jt = setInterval(function () {
            "complete" === document.readyState && (clearInterval(jt), Ot());
          }, 100);
          try {
            ("object" === Tt(e) && void 0 !== t) ||
              i("3c35") ||
              (window.bodymovin = Ft);
          } catch (t) {}
          var Nt = (function () {
            var t = {},
              e = {};
            return (
              (t.registerModifier = function (t, i) {
                e[t] || (e[t] = i);
              }),
              (t.getModifier = function (t, i, r) {
                return new e[t](i, r);
              }),
              t
            );
          })();
          function Bt() {}
          function Vt() {}
          function Ht() {}
          (Bt.prototype.initModifierProperties = function () {}),
            (Bt.prototype.addShapeToModifier = function () {}),
            (Bt.prototype.addShape = function (t) {
              if (!this.closed) {
                t.sh.container.addDynamicProperty(t.sh);
                var e = {
                  shape: t.sh,
                  data: t,
                  localShapeCollection: Ct.newShapeCollection(),
                };
                this.shapes.push(e),
                  this.addShapeToModifier(e),
                  this._isAnimated && t.setAsAnimated();
              }
            }),
            (Bt.prototype.init = function (t, e) {
              (this.shapes = []),
                (this.elem = t),
                this.initDynamicPropertyContainer(t),
                this.initModifierProperties(t, e),
                (this.frameId = -999999),
                (this.closed = !1),
                (this.k = !1),
                this.dynamicProperties.length
                  ? (this.k = !0)
                  : this.getValue(!0);
            }),
            (Bt.prototype.processKeys = function () {
              this.elem.globalData.frameId !== this.frameId &&
                ((this.frameId = this.elem.globalData.frameId),
                this.iterateDynamicProperties());
            }),
            o([bt], Bt),
            o([Bt], Vt),
            (Vt.prototype.initModifierProperties = function (t, e) {
              (this.s = vt.getProp(t, e.s, 0, 0.01, this)),
                (this.e = vt.getProp(t, e.e, 0, 0.01, this)),
                (this.o = vt.getProp(t, e.o, 0, 0, this)),
                (this.sValue = 0),
                (this.eValue = 0),
                (this.getValue = this.processKeys),
                (this.m = e.m),
                (this._isAnimated =
                  !!this.s.effectsSequence.length ||
                  !!this.e.effectsSequence.length ||
                  !!this.o.effectsSequence.length);
            }),
            (Vt.prototype.addShapeToModifier = function (t) {
              t.pathsData = [];
            }),
            (Vt.prototype.calculateShapeEdges = function (t, e, i, r, n) {
              var s = [];
              e <= 1
                ? s.push({ s: t, e: e })
                : t >= 1
                ? s.push({ s: t - 1, e: e - 1 })
                : (s.push({ s: t, e: 1 }), s.push({ s: 0, e: e - 1 }));
              var a,
                o,
                h = [],
                l = s.length;
              for (a = 0; a < l; a += 1) {
                var f, c;
                (o = s[a]).e * n < r ||
                  o.s * n > r + i ||
                  ((f = o.s * n <= r ? 0 : (o.s * n - r) / i),
                  (c = o.e * n >= r + i ? 1 : (o.e * n - r) / i),
                  h.push([f, c]));
              }
              return h.length || h.push([0, 0]), h;
            }),
            (Vt.prototype.releasePathsData = function (t) {
              var e,
                i = t.length;
              for (e = 0; e < i; e += 1) st.release(t[e]);
              return (t.length = 0), t;
            }),
            (Vt.prototype.processShapes = function (t) {
              var e, i, r, n;
              if (this._mdf || t) {
                var s = (this.o.v % 360) / 360;
                if (
                  (s < 0 && (s += 1),
                  (e =
                    this.s.v > 1
                      ? 1 + s
                      : this.s.v < 0
                      ? 0 + s
                      : this.s.v + s) >
                    (i =
                      this.e.v > 1
                        ? 1 + s
                        : this.e.v < 0
                        ? 0 + s
                        : this.e.v + s))
                ) {
                  var a = e;
                  (e = i), (i = a);
                }
                (e = 1e-4 * Math.round(1e4 * e)),
                  (i = 1e-4 * Math.round(1e4 * i)),
                  (this.sValue = e),
                  (this.eValue = i);
              } else (e = this.sValue), (i = this.eValue);
              var o,
                h,
                l,
                f,
                c,
                u = this.shapes.length,
                p = 0;
              if (i === e)
                for (n = 0; n < u; n += 1)
                  this.shapes[n].localShapeCollection.releaseShapes(),
                    (this.shapes[n].shape._mdf = !0),
                    (this.shapes[n].shape.paths =
                      this.shapes[n].localShapeCollection),
                    this._mdf && (this.shapes[n].pathsData.length = 0);
              else if ((1 === i && 0 === e) || (0 === i && 1 === e)) {
                if (this._mdf)
                  for (n = 0; n < u; n += 1)
                    (this.shapes[n].pathsData.length = 0),
                      (this.shapes[n].shape._mdf = !0);
              } else {
                var d,
                  m,
                  g = [];
                for (n = 0; n < u; n += 1)
                  if (
                    (d = this.shapes[n]).shape._mdf ||
                    this._mdf ||
                    t ||
                    2 === this.m
                  ) {
                    if (
                      ((h = (r = d.shape.paths)._length),
                      (c = 0),
                      !d.shape._mdf && d.pathsData.length)
                    )
                      c = d.totalShapeLength;
                    else {
                      for (
                        l = this.releasePathsData(d.pathsData), o = 0;
                        o < h;
                        o += 1
                      )
                        (f = at.getSegmentsLength(r.shapes[o])),
                          l.push(f),
                          (c += f.totalLength);
                      (d.totalShapeLength = c), (d.pathsData = l);
                    }
                    (p += c), (d.shape._mdf = !0);
                  } else d.shape.paths = d.localShapeCollection;
                var y,
                  v = e,
                  b = i,
                  _ = 0;
                for (n = u - 1; n >= 0; n -= 1)
                  if ((d = this.shapes[n]).shape._mdf) {
                    for (
                      (m = d.localShapeCollection).releaseShapes(),
                        2 === this.m && u > 1
                          ? ((y = this.calculateShapeEdges(
                              e,
                              i,
                              d.totalShapeLength,
                              _,
                              p
                            )),
                            (_ += d.totalShapeLength))
                          : (y = [[v, b]]),
                        h = y.length,
                        o = 0;
                      o < h;
                      o += 1
                    ) {
                      (v = y[o][0]),
                        (b = y[o][1]),
                        (g.length = 0),
                        b <= 1
                          ? g.push({
                              s: d.totalShapeLength * v,
                              e: d.totalShapeLength * b,
                            })
                          : v >= 1
                          ? g.push({
                              s: d.totalShapeLength * (v - 1),
                              e: d.totalShapeLength * (b - 1),
                            })
                          : (g.push({
                              s: d.totalShapeLength * v,
                              e: d.totalShapeLength,
                            }),
                            g.push({ s: 0, e: d.totalShapeLength * (b - 1) }));
                      var w = this.addShapes(d, g[0]);
                      if (g[0].s !== g[0].e) {
                        if (g.length > 1)
                          if (
                            d.shape.paths.shapes[d.shape.paths._length - 1].c
                          ) {
                            var A = w.pop();
                            this.addPaths(w, m),
                              (w = this.addShapes(d, g[1], A));
                          } else
                            this.addPaths(w, m), (w = this.addShapes(d, g[1]));
                        this.addPaths(w, m);
                      }
                    }
                    d.shape.paths = m;
                  }
              }
            }),
            (Vt.prototype.addPaths = function (t, e) {
              var i,
                r = t.length;
              for (i = 0; i < r; i += 1) e.addShape(t[i]);
            }),
            (Vt.prototype.addSegment = function (t, e, i, r, n, s, a) {
              n.setXYAt(e[0], e[1], "o", s),
                n.setXYAt(i[0], i[1], "i", s + 1),
                a && n.setXYAt(t[0], t[1], "v", s),
                n.setXYAt(r[0], r[1], "v", s + 1);
            }),
            (Vt.prototype.addSegmentFromArray = function (t, e, i, r) {
              e.setXYAt(t[1], t[5], "o", i),
                e.setXYAt(t[2], t[6], "i", i + 1),
                r && e.setXYAt(t[0], t[4], "v", i),
                e.setXYAt(t[3], t[7], "v", i + 1);
            }),
            (Vt.prototype.addShapes = function (t, e, i) {
              var r,
                n,
                s,
                a,
                o,
                h,
                l,
                f,
                c = t.pathsData,
                u = t.shape.paths.shapes,
                p = t.shape.paths._length,
                d = 0,
                m = [],
                g = !0;
              for (
                i
                  ? ((o = i._length), (f = i._length))
                  : ((i = At.newElement()), (o = 0), (f = 0)),
                  m.push(i),
                  r = 0;
                r < p;
                r += 1
              ) {
                for (
                  h = c[r].lengths,
                    i.c = u[r].c,
                    s = u[r].c ? h.length : h.length + 1,
                    n = 1;
                  n < s;
                  n += 1
                )
                  if (d + (a = h[n - 1]).addedLength < e.s)
                    (d += a.addedLength), (i.c = !1);
                  else {
                    if (d > e.e) {
                      i.c = !1;
                      break;
                    }
                    e.s <= d && e.e >= d + a.addedLength
                      ? (this.addSegment(
                          u[r].v[n - 1],
                          u[r].o[n - 1],
                          u[r].i[n],
                          u[r].v[n],
                          i,
                          o,
                          g
                        ),
                        (g = !1))
                      : ((l = at.getNewSegment(
                          u[r].v[n - 1],
                          u[r].v[n],
                          u[r].o[n - 1],
                          u[r].i[n],
                          (e.s - d) / a.addedLength,
                          (e.e - d) / a.addedLength,
                          h[n - 1]
                        )),
                        this.addSegmentFromArray(l, i, o, g),
                        (g = !1),
                        (i.c = !1)),
                      (d += a.addedLength),
                      (o += 1);
                  }
                if (u[r].c && h.length) {
                  if (((a = h[n - 1]), d <= e.e)) {
                    var y = h[n - 1].addedLength;
                    e.s <= d && e.e >= d + y
                      ? (this.addSegment(
                          u[r].v[n - 1],
                          u[r].o[n - 1],
                          u[r].i[0],
                          u[r].v[0],
                          i,
                          o,
                          g
                        ),
                        (g = !1))
                      : ((l = at.getNewSegment(
                          u[r].v[n - 1],
                          u[r].v[0],
                          u[r].o[n - 1],
                          u[r].i[0],
                          (e.s - d) / y,
                          (e.e - d) / y,
                          h[n - 1]
                        )),
                        this.addSegmentFromArray(l, i, o, g),
                        (g = !1),
                        (i.c = !1));
                  } else i.c = !1;
                  (d += a.addedLength), (o += 1);
                }
                if (
                  (i._length &&
                    (i.setXYAt(i.v[f][0], i.v[f][1], "i", f),
                    i.setXYAt(
                      i.v[i._length - 1][0],
                      i.v[i._length - 1][1],
                      "o",
                      i._length - 1
                    )),
                  d > e.e)
                )
                  break;
                r < p - 1 &&
                  ((i = At.newElement()), (g = !0), m.push(i), (o = 0));
              }
              return m;
            }),
            o([Bt], Ht),
            (Ht.prototype.initModifierProperties = function (t, e) {
              (this.getValue = this.processKeys),
                (this.amount = vt.getProp(t, e.a, 0, null, this)),
                (this._isAnimated = !!this.amount.effectsSequence.length);
            }),
            (Ht.prototype.processPath = function (t, e) {
              var i = e / 100,
                r = [0, 0],
                n = t._length,
                s = 0;
              for (s = 0; s < n; s += 1)
                (r[0] += t.v[s][0]), (r[1] += t.v[s][1]);
              (r[0] /= n), (r[1] /= n);
              var a,
                o,
                h,
                l,
                f,
                c,
                u = At.newElement();
              for (u.c = t.c, s = 0; s < n; s += 1)
                (a = t.v[s][0] + (r[0] - t.v[s][0]) * i),
                  (o = t.v[s][1] + (r[1] - t.v[s][1]) * i),
                  (h = t.o[s][0] + (r[0] - t.o[s][0]) * -i),
                  (l = t.o[s][1] + (r[1] - t.o[s][1]) * -i),
                  (f = t.i[s][0] + (r[0] - t.i[s][0]) * -i),
                  (c = t.i[s][1] + (r[1] - t.i[s][1]) * -i),
                  u.setTripleAt(a, o, h, l, f, c, s);
              return u;
            }),
            (Ht.prototype.processShapes = function (t) {
              var e,
                i,
                r,
                n,
                s,
                a,
                o = this.shapes.length,
                h = this.amount.v;
              if (0 !== h)
                for (i = 0; i < o; i += 1) {
                  if (
                    ((a = (s = this.shapes[i]).localShapeCollection),
                    s.shape._mdf || this._mdf || t)
                  )
                    for (
                      a.releaseShapes(),
                        s.shape._mdf = !0,
                        e = s.shape.paths.shapes,
                        n = s.shape.paths._length,
                        r = 0;
                      r < n;
                      r += 1
                    )
                      a.addShape(this.processPath(e[r], h));
                  s.shape.paths = s.localShapeCollection;
                }
              this.dynamicProperties.length || (this._mdf = !1);
            });
          var zt = (function () {
            var t = [0, 0];
            function e(t, e, i) {
              if (
                ((this.elem = t),
                (this.frameId = -1),
                (this.propType = "transform"),
                (this.data = e),
                (this.v = new Mt()),
                (this.pre = new Mt()),
                (this.appliedTransformations = 0),
                this.initDynamicPropertyContainer(i || t),
                e.p && e.p.s
                  ? ((this.px = vt.getProp(t, e.p.x, 0, 0, this)),
                    (this.py = vt.getProp(t, e.p.y, 0, 0, this)),
                    e.p.z && (this.pz = vt.getProp(t, e.p.z, 0, 0, this)))
                  : (this.p = vt.getProp(
                      t,
                      e.p || { k: [0, 0, 0] },
                      1,
                      0,
                      this
                    )),
                e.rx)
              ) {
                if (
                  ((this.rx = vt.getProp(t, e.rx, 0, S, this)),
                  (this.ry = vt.getProp(t, e.ry, 0, S, this)),
                  (this.rz = vt.getProp(t, e.rz, 0, S, this)),
                  e.or.k[0].ti)
                ) {
                  var r,
                    n = e.or.k.length;
                  for (r = 0; r < n; r += 1)
                    (e.or.k[r].to = null), (e.or.k[r].ti = null);
                }
                (this.or = vt.getProp(t, e.or, 1, S, this)), (this.or.sh = !0);
              } else this.r = vt.getProp(t, e.r || { k: 0 }, 0, S, this);
              e.sk &&
                ((this.sk = vt.getProp(t, e.sk, 0, S, this)),
                (this.sa = vt.getProp(t, e.sa, 0, S, this))),
                (this.a = vt.getProp(t, e.a || { k: [0, 0, 0] }, 1, 0, this)),
                (this.s = vt.getProp(
                  t,
                  e.s || { k: [100, 100, 100] },
                  1,
                  0.01,
                  this
                )),
                e.o
                  ? (this.o = vt.getProp(t, e.o, 0, 0.01, t))
                  : (this.o = { _mdf: !1, v: 1 }),
                (this._isDirty = !0),
                this.dynamicProperties.length || this.getValue(!0);
            }
            return (
              (e.prototype = {
                applyToMatrix: function (t) {
                  var e = this._mdf;
                  this.iterateDynamicProperties(),
                    (this._mdf = this._mdf || e),
                    this.a &&
                      t.translate(-this.a.v[0], -this.a.v[1], this.a.v[2]),
                    this.s && t.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                    this.sk && t.skewFromAxis(-this.sk.v, this.sa.v),
                    this.r
                      ? t.rotate(-this.r.v)
                      : t
                          .rotateZ(-this.rz.v)
                          .rotateY(this.ry.v)
                          .rotateX(this.rx.v)
                          .rotateZ(-this.or.v[2])
                          .rotateY(this.or.v[1])
                          .rotateX(this.or.v[0]),
                    this.data.p.s
                      ? this.data.p.z
                        ? t.translate(this.px.v, this.py.v, -this.pz.v)
                        : t.translate(this.px.v, this.py.v, 0)
                      : t.translate(this.p.v[0], this.p.v[1], -this.p.v[2]);
                },
                getValue: function (e) {
                  if (this.elem.globalData.frameId !== this.frameId) {
                    if (
                      (this._isDirty &&
                        (this.precalculateMatrix(), (this._isDirty = !1)),
                      this.iterateDynamicProperties(),
                      this._mdf || e)
                    ) {
                      var i;
                      if (
                        (this.v.cloneFromProps(this.pre.props),
                        this.appliedTransformations < 1 &&
                          this.v.translate(
                            -this.a.v[0],
                            -this.a.v[1],
                            this.a.v[2]
                          ),
                        this.appliedTransformations < 2 &&
                          this.v.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                        this.sk &&
                          this.appliedTransformations < 3 &&
                          this.v.skewFromAxis(-this.sk.v, this.sa.v),
                        this.r && this.appliedTransformations < 4
                          ? this.v.rotate(-this.r.v)
                          : !this.r &&
                            this.appliedTransformations < 4 &&
                            this.v
                              .rotateZ(-this.rz.v)
                              .rotateY(this.ry.v)
                              .rotateX(this.rx.v)
                              .rotateZ(-this.or.v[2])
                              .rotateY(this.or.v[1])
                              .rotateX(this.or.v[0]),
                        this.autoOriented)
                      ) {
                        var r, n;
                        if (
                          ((i = this.elem.globalData.frameRate),
                          this.p && this.p.keyframes && this.p.getValueAtTime)
                        )
                          this.p._caching.lastFrame + this.p.offsetTime <=
                          this.p.keyframes[0].t
                            ? ((r = this.p.getValueAtTime(
                                (this.p.keyframes[0].t + 0.01) / i,
                                0
                              )),
                              (n = this.p.getValueAtTime(
                                this.p.keyframes[0].t / i,
                                0
                              )))
                            : this.p._caching.lastFrame + this.p.offsetTime >=
                              this.p.keyframes[this.p.keyframes.length - 1].t
                            ? ((r = this.p.getValueAtTime(
                                this.p.keyframes[this.p.keyframes.length - 1]
                                  .t / i,
                                0
                              )),
                              (n = this.p.getValueAtTime(
                                (this.p.keyframes[this.p.keyframes.length - 1]
                                  .t -
                                  0.05) /
                                  i,
                                0
                              )))
                            : ((r = this.p.pv),
                              (n = this.p.getValueAtTime(
                                (this.p._caching.lastFrame +
                                  this.p.offsetTime -
                                  0.01) /
                                  i,
                                this.p.offsetTime
                              )));
                        else if (
                          this.px &&
                          this.px.keyframes &&
                          this.py.keyframes &&
                          this.px.getValueAtTime &&
                          this.py.getValueAtTime
                        ) {
                          (r = []), (n = []);
                          var s = this.px,
                            a = this.py;
                          s._caching.lastFrame + s.offsetTime <=
                          s.keyframes[0].t
                            ? ((r[0] = s.getValueAtTime(
                                (s.keyframes[0].t + 0.01) / i,
                                0
                              )),
                              (r[1] = a.getValueAtTime(
                                (a.keyframes[0].t + 0.01) / i,
                                0
                              )),
                              (n[0] = s.getValueAtTime(
                                s.keyframes[0].t / i,
                                0
                              )),
                              (n[1] = a.getValueAtTime(
                                a.keyframes[0].t / i,
                                0
                              )))
                            : s._caching.lastFrame + s.offsetTime >=
                              s.keyframes[s.keyframes.length - 1].t
                            ? ((r[0] = s.getValueAtTime(
                                s.keyframes[s.keyframes.length - 1].t / i,
                                0
                              )),
                              (r[1] = a.getValueAtTime(
                                a.keyframes[a.keyframes.length - 1].t / i,
                                0
                              )),
                              (n[0] = s.getValueAtTime(
                                (s.keyframes[s.keyframes.length - 1].t - 0.01) /
                                  i,
                                0
                              )),
                              (n[1] = a.getValueAtTime(
                                (a.keyframes[a.keyframes.length - 1].t - 0.01) /
                                  i,
                                0
                              )))
                            : ((r = [s.pv, a.pv]),
                              (n[0] = s.getValueAtTime(
                                (s._caching.lastFrame + s.offsetTime - 0.01) /
                                  i,
                                s.offsetTime
                              )),
                              (n[1] = a.getValueAtTime(
                                (a._caching.lastFrame + a.offsetTime - 0.01) /
                                  i,
                                a.offsetTime
                              )));
                        } else r = n = t;
                        this.v.rotate(-Math.atan2(r[1] - n[1], r[0] - n[0]));
                      }
                      this.data.p && this.data.p.s
                        ? this.data.p.z
                          ? this.v.translate(this.px.v, this.py.v, -this.pz.v)
                          : this.v.translate(this.px.v, this.py.v, 0)
                        : this.v.translate(
                            this.p.v[0],
                            this.p.v[1],
                            -this.p.v[2]
                          );
                    }
                    this.frameId = this.elem.globalData.frameId;
                  }
                },
                precalculateMatrix: function () {
                  if (
                    ((this.appliedTransformations = 0),
                    this.pre.reset(),
                    !this.a.effectsSequence.length &&
                      (this.pre.translate(
                        -this.a.v[0],
                        -this.a.v[1],
                        this.a.v[2]
                      ),
                      (this.appliedTransformations = 1),
                      !this.s.effectsSequence.length))
                  ) {
                    if (
                      (this.pre.scale(this.s.v[0], this.s.v[1], this.s.v[2]),
                      (this.appliedTransformations = 2),
                      this.sk)
                    ) {
                      if (
                        this.sk.effectsSequence.length ||
                        this.sa.effectsSequence.length
                      )
                        return;
                      this.pre.skewFromAxis(-this.sk.v, this.sa.v),
                        (this.appliedTransformations = 3);
                    }
                    this.r
                      ? this.r.effectsSequence.length ||
                        (this.pre.rotate(-this.r.v),
                        (this.appliedTransformations = 4))
                      : this.rz.effectsSequence.length ||
                        this.ry.effectsSequence.length ||
                        this.rx.effectsSequence.length ||
                        this.or.effectsSequence.length ||
                        (this.pre
                          .rotateZ(-this.rz.v)
                          .rotateY(this.ry.v)
                          .rotateX(this.rx.v)
                          .rotateZ(-this.or.v[2])
                          .rotateY(this.or.v[1])
                          .rotateX(this.or.v[0]),
                        (this.appliedTransformations = 4));
                  }
                },
                autoOrient: function () {},
              }),
              o([bt], e),
              (e.prototype.addDynamicProperty = function (t) {
                this._addDynamicProperty(t),
                  this.elem.addDynamicProperty(t),
                  (this._isDirty = !0);
              }),
              (e.prototype._addDynamicProperty =
                bt.prototype.addDynamicProperty),
              {
                getTransformProperty: function (t, i, r) {
                  return new e(t, i, r);
                },
              }
            );
          })();
          function qt() {}
          function Ut() {}
          function Wt(t, e) {
            return 1e5 * Math.abs(t - e) <= Math.min(Math.abs(t), Math.abs(e));
          }
          function Xt(t) {
            return Math.abs(t) <= 1e-5;
          }
          function Yt(t, e, i) {
            return t * (1 - i) + e * i;
          }
          function Gt(t, e, i) {
            return [Yt(t[0], e[0], i), Yt(t[1], e[1], i)];
          }
          function $t(t, e, i, r) {
            return [
              3 * e - t - 3 * i + r,
              3 * t - 6 * e + 3 * i,
              -3 * t + 3 * e,
              t,
            ];
          }
          function Jt(t) {
            return new Kt(t, t, t, t, !1);
          }
          function Kt(t, e, i, r, n) {
            n && ae(t, e) && (e = Gt(t, r, 1 / 3)),
              n && ae(i, r) && (i = Gt(t, r, 2 / 3));
            var s = $t(t[0], e[0], i[0], r[0]),
              a = $t(t[1], e[1], i[1], r[1]);
            (this.a = [s[0], a[0]]),
              (this.b = [s[1], a[1]]),
              (this.c = [s[2], a[2]]),
              (this.d = [s[3], a[3]]),
              (this.points = [t, e, i, r]);
          }
          function Zt(t, e) {
            var i = t.points[0][e],
              r = t.points[t.points.length - 1][e];
            if (i > r) {
              var n = r;
              (r = i), (i = n);
            }
            for (
              var s = (function (t, e, i) {
                  if (0 === t) return [];
                  var r = e * e - 4 * t * i;
                  if (r < 0) return [];
                  var n = -e / (2 * t);
                  if (0 === r) return [n];
                  var s = Math.sqrt(r) / (2 * t);
                  return [n - s, n + s];
                })(3 * t.a[e], 2 * t.b[e], t.c[e]),
                a = 0;
              a < s.length;
              a += 1
            )
              if (s[a] > 0 && s[a] < 1) {
                var o = t.point(s[a])[e];
                o < i ? (i = o) : o > r && (r = o);
              }
            return { min: i, max: r };
          }
          function Qt(t, e, i) {
            var r = t.boundingBox();
            return {
              cx: r.cx,
              cy: r.cy,
              width: r.width,
              height: r.height,
              bez: t,
              t: (e + i) / 2,
              t1: e,
              t2: i,
            };
          }
          function te(t) {
            var e = t.bez.split(0.5);
            return [Qt(e[0], t.t1, t.t), Qt(e[1], t.t, t.t2)];
          }
          function ee(t, e, i, r, n, s) {
            var a, o;
            if (
              ((a = t),
              (o = e),
              2 * Math.abs(a.cx - o.cx) < a.width + o.width &&
                2 * Math.abs(a.cy - o.cy) < a.height + o.height)
            )
              if (
                i >= s ||
                (t.width <= r && t.height <= r && e.width <= r && e.height <= r)
              )
                n.push([t.t, e.t]);
              else {
                var h = te(t),
                  l = te(e);
                ee(h[0], l[0], i + 1, r, n, s),
                  ee(h[0], l[1], i + 1, r, n, s),
                  ee(h[1], l[0], i + 1, r, n, s),
                  ee(h[1], l[1], i + 1, r, n, s);
              }
          }
          function ie(t, e) {
            return [
              t[1] * e[2] - t[2] * e[1],
              t[2] * e[0] - t[0] * e[2],
              t[0] * e[1] - t[1] * e[0],
            ];
          }
          function re(t, e, i, r) {
            var n = [t[0], t[1], 1],
              s = [e[0], e[1], 1],
              a = [i[0], i[1], 1],
              o = [r[0], r[1], 1],
              h = ie(ie(n, s), ie(a, o));
            return Xt(h[2]) ? null : [h[0] / h[2], h[1] / h[2]];
          }
          function ne(t, e, i) {
            return [t[0] + Math.cos(e) * i, t[1] - Math.sin(e) * i];
          }
          function se(t, e) {
            return Math.hypot(t[0] - e[0], t[1] - e[1]);
          }
          function ae(t, e) {
            return Wt(t[0], e[0]) && Wt(t[1], e[1]);
          }
          function oe() {}
          function he(t, e, i, r, n, s, a) {
            var o = i - Math.PI / 2,
              h = i + Math.PI / 2,
              l = e[0] + Math.cos(i) * r * n,
              f = e[1] - Math.sin(i) * r * n;
            t.setTripleAt(
              l,
              f,
              l + Math.cos(o) * s,
              f - Math.sin(o) * s,
              l + Math.cos(h) * a,
              f - Math.sin(h) * a,
              t.length()
            );
          }
          function le(t, e) {
            var i,
              r,
              n,
              s,
              a = 0 === e ? t.length() - 1 : e - 1,
              o = (e + 1) % t.length(),
              h = t.v[a],
              l = t.v[o],
              f =
                ((i = h),
                (n = [(r = l)[0] - i[0], r[1] - i[1]]),
                (s = 0.5 * -Math.PI),
                [
                  Math.cos(s) * n[0] - Math.sin(s) * n[1],
                  Math.sin(s) * n[0] + Math.cos(s) * n[1],
                ]);
            return Math.atan2(0, 1) - Math.atan2(f[1], f[0]);
          }
          function fe(t, e, i, r, n, s, a) {
            var o = le(e, i),
              h = e.v[i % e._length],
              l = e.v[0 === i ? e._length - 1 : i - 1],
              f = e.v[(i + 1) % e._length],
              c =
                2 === s
                  ? Math.sqrt(
                      Math.pow(h[0] - l[0], 2) + Math.pow(h[1] - l[1], 2)
                    )
                  : 0,
              u =
                2 === s
                  ? Math.sqrt(
                      Math.pow(h[0] - f[0], 2) + Math.pow(h[1] - f[1], 2)
                    )
                  : 0;
            he(
              t,
              e.v[i % e._length],
              o,
              a,
              r,
              u / (2 * (n + 1)),
              c / (2 * (n + 1))
            );
          }
          function ce(t, e, i, r, n, s) {
            for (var a = 0; a < r; a += 1) {
              var o = (a + 1) / (r + 1),
                h =
                  2 === n
                    ? Math.sqrt(
                        Math.pow(e.points[3][0] - e.points[0][0], 2) +
                          Math.pow(e.points[3][1] - e.points[0][1], 2)
                      )
                    : 0,
                l = e.normalAngle(o);
              he(t, e.point(o), l, s, i, h / (2 * (r + 1)), h / (2 * (r + 1))),
                (s = -s);
            }
            return s;
          }
          function ue(t, e, i) {
            var r = Math.atan2(e[0] - t[0], e[1] - t[1]);
            return [ne(t, r, i), ne(e, r, i)];
          }
          function pe(t, e) {
            var i, r, n, s, a, o, h;
            (i = (h = ue(t.points[0], t.points[1], e))[0]),
              (r = h[1]),
              (n = (h = ue(t.points[1], t.points[2], e))[0]),
              (s = h[1]),
              (a = (h = ue(t.points[2], t.points[3], e))[0]),
              (o = h[1]);
            var l = re(i, r, n, s);
            null === l && (l = r);
            var f = re(a, o, n, s);
            return null === f && (f = a), new Kt(i, l, f, o);
          }
          function de(t, e, i, r, n) {
            var s = e.points[3],
              a = i.points[0];
            if (3 === r) return s;
            if (ae(s, a)) return s;
            if (2 === r) {
              var o = -e.tangentAngle(1),
                h = -i.tangentAngle(0) + Math.PI,
                l = re(
                  s,
                  ne(s, o + Math.PI / 2, 100),
                  a,
                  ne(a, o + Math.PI / 2, 100)
                ),
                f = l ? se(l, s) : se(s, a) / 2,
                c = ne(s, o, 2 * f * 0.5519);
              return (
                t.setXYAt(c[0], c[1], "o", t.length() - 1),
                (c = ne(a, h, 2 * f * 0.5519)),
                t.setTripleAt(a[0], a[1], a[0], a[1], c[0], c[1], t.length()),
                a
              );
            }
            var u = re(
              ae(s, e.points[2]) ? e.points[0] : e.points[2],
              s,
              a,
              ae(a, i.points[1]) ? i.points[3] : i.points[1]
            );
            return u && se(u, s) < n
              ? (t.setTripleAt(u[0], u[1], u[0], u[1], u[0], u[1], t.length()),
                u)
              : s;
          }
          function me(t, e) {
            var i = t.intersections(e);
            return (
              i.length && Wt(i[0][0], 1) && i.shift(), i.length ? i[0] : null
            );
          }
          function ge(t, e) {
            var i = t.slice(),
              r = e.slice(),
              n = me(t[t.length - 1], e[0]);
            return (
              n &&
                ((i[t.length - 1] = t[t.length - 1].split(n[0])[0]),
                (r[0] = e[0].split(n[1])[1])),
              t.length > 1 && e.length > 1 && (n = me(t[0], e[e.length - 1]))
                ? [[t[0].split(n[0])[0]], [e[e.length - 1].split(n[1])[1]]]
                : [i, r]
            );
          }
          function ye(t, e) {
            var i,
              r,
              n,
              s,
              a = t.inflectionPoints();
            if (0 === a.length) return [pe(t, e)];
            if (1 === a.length || Wt(a[1], 1))
              return (
                (i = (n = t.split(a[0]))[0]), (r = n[1]), [pe(i, e), pe(r, e)]
              );
            i = (n = t.split(a[0]))[0];
            var o = (a[1] - a[0]) / (1 - a[0]);
            return (
              (s = (n = n[1].split(o))[0]),
              (r = n[1]),
              [pe(i, e), pe(s, e), pe(r, e)]
            );
          }
          function ve() {}
          function be(t) {
            for (
              var e = t.fStyle ? t.fStyle.split(" ") : [],
                i = "normal",
                r = "normal",
                n = e.length,
                s = 0;
              s < n;
              s += 1
            )
              switch (e[s].toLowerCase()) {
                case "italic":
                  r = "italic";
                  break;
                case "bold":
                  i = "700";
                  break;
                case "black":
                  i = "900";
                  break;
                case "medium":
                  i = "500";
                  break;
                case "regular":
                case "normal":
                  i = "400";
                  break;
                case "light":
                case "thin":
                  i = "200";
              }
            return { style: r, weight: t.fWeight || i };
          }
          o([Bt], qt),
            (qt.prototype.initModifierProperties = function (t, e) {
              (this.getValue = this.processKeys),
                (this.c = vt.getProp(t, e.c, 0, null, this)),
                (this.o = vt.getProp(t, e.o, 0, null, this)),
                (this.tr = zt.getTransformProperty(t, e.tr, this)),
                (this.so = vt.getProp(t, e.tr.so, 0, 0.01, this)),
                (this.eo = vt.getProp(t, e.tr.eo, 0, 0.01, this)),
                (this.data = e),
                this.dynamicProperties.length || this.getValue(!0),
                (this._isAnimated = !!this.dynamicProperties.length),
                (this.pMatrix = new Mt()),
                (this.rMatrix = new Mt()),
                (this.sMatrix = new Mt()),
                (this.tMatrix = new Mt()),
                (this.matrix = new Mt());
            }),
            (qt.prototype.applyTransforms = function (t, e, i, r, n, s) {
              var a = s ? -1 : 1,
                o = r.s.v[0] + (1 - r.s.v[0]) * (1 - n),
                h = r.s.v[1] + (1 - r.s.v[1]) * (1 - n);
              t.translate(r.p.v[0] * a * n, r.p.v[1] * a * n, r.p.v[2]),
                e.translate(-r.a.v[0], -r.a.v[1], r.a.v[2]),
                e.rotate(-r.r.v * a * n),
                e.translate(r.a.v[0], r.a.v[1], r.a.v[2]),
                i.translate(-r.a.v[0], -r.a.v[1], r.a.v[2]),
                i.scale(s ? 1 / o : o, s ? 1 / h : h),
                i.translate(r.a.v[0], r.a.v[1], r.a.v[2]);
            }),
            (qt.prototype.init = function (t, e, i, r) {
              for (
                this.elem = t,
                  this.arr = e,
                  this.pos = i,
                  this.elemsData = r,
                  this._currentCopies = 0,
                  this._elements = [],
                  this._groups = [],
                  this.frameId = -1,
                  this.initDynamicPropertyContainer(t),
                  this.initModifierProperties(t, e[i]);
                i > 0;

              )
                (i -= 1), this._elements.unshift(e[i]);
              this.dynamicProperties.length ? (this.k = !0) : this.getValue(!0);
            }),
            (qt.prototype.resetElements = function (t) {
              var e,
                i = t.length;
              for (e = 0; e < i; e += 1)
                (t[e]._processed = !1),
                  "gr" === t[e].ty && this.resetElements(t[e].it);
            }),
            (qt.prototype.cloneElements = function (t) {
              var e = JSON.parse(JSON.stringify(t));
              return this.resetElements(e), e;
            }),
            (qt.prototype.changeGroupRender = function (t, e) {
              var i,
                r = t.length;
              for (i = 0; i < r; i += 1)
                (t[i]._render = e),
                  "gr" === t[i].ty && this.changeGroupRender(t[i].it, e);
            }),
            (qt.prototype.processShapes = function (t) {
              var e,
                i,
                r,
                n,
                s,
                a = !1;
              if (this._mdf || t) {
                var o,
                  h = Math.ceil(this.c.v);
                if (this._groups.length < h) {
                  for (; this._groups.length < h; ) {
                    var l = {
                      it: this.cloneElements(this._elements),
                      ty: "gr",
                    };
                    l.it.push({
                      a: { a: 0, ix: 1, k: [0, 0] },
                      nm: "Transform",
                      o: { a: 0, ix: 7, k: 100 },
                      p: { a: 0, ix: 2, k: [0, 0] },
                      r: {
                        a: 1,
                        ix: 6,
                        k: [
                          { s: 0, e: 0, t: 0 },
                          { s: 0, e: 0, t: 1 },
                        ],
                      },
                      s: { a: 0, ix: 3, k: [100, 100] },
                      sa: { a: 0, ix: 5, k: 0 },
                      sk: { a: 0, ix: 4, k: 0 },
                      ty: "tr",
                    }),
                      this.arr.splice(0, 0, l),
                      this._groups.splice(0, 0, l),
                      (this._currentCopies += 1);
                  }
                  this.elem.reloadShapes(), (a = !0);
                }
                for (s = 0, r = 0; r <= this._groups.length - 1; r += 1) {
                  if (
                    ((o = s < h),
                    (this._groups[r]._render = o),
                    this.changeGroupRender(this._groups[r].it, o),
                    !o)
                  ) {
                    var f = this.elemsData[r].it,
                      c = f[f.length - 1];
                    0 !== c.transform.op.v
                      ? ((c.transform.op._mdf = !0), (c.transform.op.v = 0))
                      : (c.transform.op._mdf = !1);
                  }
                  s += 1;
                }
                this._currentCopies = h;
                var u = this.o.v,
                  p = u % 1,
                  d = u > 0 ? Math.floor(u) : Math.ceil(u),
                  m = this.pMatrix.props,
                  g = this.rMatrix.props,
                  y = this.sMatrix.props;
                this.pMatrix.reset(),
                  this.rMatrix.reset(),
                  this.sMatrix.reset(),
                  this.tMatrix.reset(),
                  this.matrix.reset();
                var v,
                  b,
                  _ = 0;
                if (u > 0) {
                  for (; _ < d; )
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !1
                    ),
                      (_ += 1);
                  p &&
                    (this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      p,
                      !1
                    ),
                    (_ += p));
                } else if (u < 0) {
                  for (; _ > d; )
                    this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      1,
                      !0
                    ),
                      (_ -= 1);
                  p &&
                    (this.applyTransforms(
                      this.pMatrix,
                      this.rMatrix,
                      this.sMatrix,
                      this.tr,
                      -p,
                      !0
                    ),
                    (_ -= p));
                }
                for (
                  r = 1 === this.data.m ? 0 : this._currentCopies - 1,
                    n = 1 === this.data.m ? 1 : -1,
                    s = this._currentCopies;
                  s;

                ) {
                  if (
                    ((b = (i = (e = this.elemsData[r].it)[e.length - 1]
                      .transform.mProps.v.props).length),
                    (e[e.length - 1].transform.mProps._mdf = !0),
                    (e[e.length - 1].transform.op._mdf = !0),
                    (e[e.length - 1].transform.op.v =
                      1 === this._currentCopies
                        ? this.so.v
                        : this.so.v +
                          (this.eo.v - this.so.v) *
                            (r / (this._currentCopies - 1))),
                    0 !== _)
                  ) {
                    for (
                      ((0 !== r && 1 === n) ||
                        (r !== this._currentCopies - 1 && -1 === n)) &&
                        this.applyTransforms(
                          this.pMatrix,
                          this.rMatrix,
                          this.sMatrix,
                          this.tr,
                          1,
                          !1
                        ),
                        this.matrix.transform(
                          g[0],
                          g[1],
                          g[2],
                          g[3],
                          g[4],
                          g[5],
                          g[6],
                          g[7],
                          g[8],
                          g[9],
                          g[10],
                          g[11],
                          g[12],
                          g[13],
                          g[14],
                          g[15]
                        ),
                        this.matrix.transform(
                          y[0],
                          y[1],
                          y[2],
                          y[3],
                          y[4],
                          y[5],
                          y[6],
                          y[7],
                          y[8],
                          y[9],
                          y[10],
                          y[11],
                          y[12],
                          y[13],
                          y[14],
                          y[15]
                        ),
                        this.matrix.transform(
                          m[0],
                          m[1],
                          m[2],
                          m[3],
                          m[4],
                          m[5],
                          m[6],
                          m[7],
                          m[8],
                          m[9],
                          m[10],
                          m[11],
                          m[12],
                          m[13],
                          m[14],
                          m[15]
                        ),
                        v = 0;
                      v < b;
                      v += 1
                    )
                      i[v] = this.matrix.props[v];
                    this.matrix.reset();
                  } else
                    for (this.matrix.reset(), v = 0; v < b; v += 1)
                      i[v] = this.matrix.props[v];
                  (_ += 1), (s -= 1), (r += n);
                }
              } else
                for (s = this._currentCopies, r = 0, n = 1; s; )
                  (i = (e = this.elemsData[r].it)[e.length - 1].transform.mProps
                    .v.props),
                    (e[e.length - 1].transform.mProps._mdf = !1),
                    (e[e.length - 1].transform.op._mdf = !1),
                    (s -= 1),
                    (r += n);
              return a;
            }),
            (qt.prototype.addShape = function () {}),
            o([Bt], Ut),
            (Ut.prototype.initModifierProperties = function (t, e) {
              (this.getValue = this.processKeys),
                (this.rd = vt.getProp(t, e.r, 0, null, this)),
                (this._isAnimated = !!this.rd.effectsSequence.length);
            }),
            (Ut.prototype.processPath = function (t, e) {
              var i,
                r = At.newElement();
              r.c = t.c;
              var n,
                s,
                a,
                o,
                h,
                l,
                f,
                c,
                u,
                p,
                d,
                m,
                g = t._length,
                y = 0;
              for (i = 0; i < g; i += 1)
                (n = t.v[i]),
                  (a = t.o[i]),
                  (s = t.i[i]),
                  n[0] === a[0] &&
                  n[1] === a[1] &&
                  n[0] === s[0] &&
                  n[1] === s[1]
                    ? (0 !== i && i !== g - 1) || t.c
                      ? ((o = 0 === i ? t.v[g - 1] : t.v[i - 1]),
                        (l = (h = Math.sqrt(
                          Math.pow(n[0] - o[0], 2) + Math.pow(n[1] - o[1], 2)
                        ))
                          ? Math.min(h / 2, e) / h
                          : 0),
                        (f = d = n[0] + (o[0] - n[0]) * l),
                        (c = m = n[1] - (n[1] - o[1]) * l),
                        (u = f - 0.5519 * (f - n[0])),
                        (p = c - 0.5519 * (c - n[1])),
                        r.setTripleAt(f, c, u, p, d, m, y),
                        (y += 1),
                        (o = i === g - 1 ? t.v[0] : t.v[i + 1]),
                        (l = (h = Math.sqrt(
                          Math.pow(n[0] - o[0], 2) + Math.pow(n[1] - o[1], 2)
                        ))
                          ? Math.min(h / 2, e) / h
                          : 0),
                        (f = u = n[0] + (o[0] - n[0]) * l),
                        (c = p = n[1] + (o[1] - n[1]) * l),
                        (d = f - 0.5519 * (f - n[0])),
                        (m = c - 0.5519 * (c - n[1])),
                        r.setTripleAt(f, c, u, p, d, m, y),
                        (y += 1))
                      : (r.setTripleAt(n[0], n[1], a[0], a[1], s[0], s[1], y),
                        (y += 1))
                    : (r.setTripleAt(
                        t.v[i][0],
                        t.v[i][1],
                        t.o[i][0],
                        t.o[i][1],
                        t.i[i][0],
                        t.i[i][1],
                        y
                      ),
                      (y += 1));
              return r;
            }),
            (Ut.prototype.processShapes = function (t) {
              var e,
                i,
                r,
                n,
                s,
                a,
                o = this.shapes.length,
                h = this.rd.v;
              if (0 !== h)
                for (i = 0; i < o; i += 1) {
                  if (
                    ((a = (s = this.shapes[i]).localShapeCollection),
                    s.shape._mdf || this._mdf || t)
                  )
                    for (
                      a.releaseShapes(),
                        s.shape._mdf = !0,
                        e = s.shape.paths.shapes,
                        n = s.shape.paths._length,
                        r = 0;
                      r < n;
                      r += 1
                    )
                      a.addShape(this.processPath(e[r], h));
                  s.shape.paths = s.localShapeCollection;
                }
              this.dynamicProperties.length || (this._mdf = !1);
            }),
            (Kt.prototype.point = function (t) {
              return [
                ((this.a[0] * t + this.b[0]) * t + this.c[0]) * t + this.d[0],
                ((this.a[1] * t + this.b[1]) * t + this.c[1]) * t + this.d[1],
              ];
            }),
            (Kt.prototype.derivative = function (t) {
              return [
                (3 * t * this.a[0] + 2 * this.b[0]) * t + this.c[0],
                (3 * t * this.a[1] + 2 * this.b[1]) * t + this.c[1],
              ];
            }),
            (Kt.prototype.tangentAngle = function (t) {
              var e = this.derivative(t);
              return Math.atan2(e[1], e[0]);
            }),
            (Kt.prototype.normalAngle = function (t) {
              var e = this.derivative(t);
              return Math.atan2(e[0], e[1]);
            }),
            (Kt.prototype.inflectionPoints = function () {
              var t = this.a[1] * this.b[0] - this.a[0] * this.b[1];
              if (Xt(t)) return [];
              var e =
                  (-0.5 * (this.a[1] * this.c[0] - this.a[0] * this.c[1])) / t,
                i =
                  e * e -
                  ((1 / 3) * (this.b[1] * this.c[0] - this.b[0] * this.c[1])) /
                    t;
              if (i < 0) return [];
              var r = Math.sqrt(i);
              return Xt(r)
                ? r > 0 && r < 1
                  ? [e]
                  : []
                : [e - r, e + r].filter(function (t) {
                    return t > 0 && t < 1;
                  });
            }),
            (Kt.prototype.split = function (t) {
              if (t <= 0) return [Jt(this.points[0]), this];
              if (t >= 1)
                return [this, Jt(this.points[this.points.length - 1])];
              var e = Gt(this.points[0], this.points[1], t),
                i = Gt(this.points[1], this.points[2], t),
                r = Gt(this.points[2], this.points[3], t),
                n = Gt(e, i, t),
                s = Gt(i, r, t),
                a = Gt(n, s, t);
              return [
                new Kt(this.points[0], e, n, a, !0),
                new Kt(a, s, r, this.points[3], !0),
              ];
            }),
            (Kt.prototype.bounds = function () {
              return { x: Zt(this, 0), y: Zt(this, 1) };
            }),
            (Kt.prototype.boundingBox = function () {
              var t = this.bounds();
              return {
                left: t.x.min,
                right: t.x.max,
                top: t.y.min,
                bottom: t.y.max,
                width: t.x.max - t.x.min,
                height: t.y.max - t.y.min,
                cx: (t.x.max + t.x.min) / 2,
                cy: (t.y.max + t.y.min) / 2,
              };
            }),
            (Kt.prototype.intersections = function (t, e, i) {
              void 0 === e && (e = 2), void 0 === i && (i = 7);
              var r = [];
              return ee(Qt(this, 0, 1), Qt(t, 0, 1), 0, e, r, i), r;
            }),
            (Kt.shapeSegment = function (t, e) {
              var i = (e + 1) % t.length();
              return new Kt(t.v[e], t.o[e], t.i[i], t.v[i], !0);
            }),
            (Kt.shapeSegmentInverted = function (t, e) {
              var i = (e + 1) % t.length();
              return new Kt(t.v[i], t.i[i], t.o[e], t.v[e], !0);
            }),
            o([Bt], oe),
            (oe.prototype.initModifierProperties = function (t, e) {
              (this.getValue = this.processKeys),
                (this.amplitude = vt.getProp(t, e.s, 0, null, this)),
                (this.frequency = vt.getProp(t, e.r, 0, null, this)),
                (this.pointsType = vt.getProp(t, e.pt, 0, null, this)),
                (this._isAnimated =
                  0 !== this.amplitude.effectsSequence.length ||
                  0 !== this.frequency.effectsSequence.length ||
                  0 !== this.pointsType.effectsSequence.length);
            }),
            (oe.prototype.processPath = function (t, e, i, r) {
              var n = t._length,
                s = At.newElement();
              if (((s.c = t.c), t.c || (n -= 1), 0 === n)) return s;
              var a = -1,
                o = Kt.shapeSegment(t, 0);
              fe(s, t, 0, e, i, r, a);
              for (var h = 0; h < n; h += 1)
                (a = ce(s, o, e, i, r, -a)),
                  (o =
                    h !== n - 1 || t.c
                      ? Kt.shapeSegment(t, (h + 1) % n)
                      : null),
                  fe(s, t, h + 1, e, i, r, a);
              return s;
            }),
            (oe.prototype.processShapes = function (t) {
              var e,
                i,
                r,
                n,
                s,
                a,
                o = this.shapes.length,
                h = this.amplitude.v,
                l = Math.max(0, Math.round(this.frequency.v)),
                f = this.pointsType.v;
              if (0 !== h)
                for (i = 0; i < o; i += 1) {
                  if (
                    ((a = (s = this.shapes[i]).localShapeCollection),
                    s.shape._mdf || this._mdf || t)
                  )
                    for (
                      a.releaseShapes(),
                        s.shape._mdf = !0,
                        e = s.shape.paths.shapes,
                        n = s.shape.paths._length,
                        r = 0;
                      r < n;
                      r += 1
                    )
                      a.addShape(this.processPath(e[r], h, l, f));
                  s.shape.paths = s.localShapeCollection;
                }
              this.dynamicProperties.length || (this._mdf = !1);
            }),
            o([Bt], ve),
            (ve.prototype.initModifierProperties = function (t, e) {
              (this.getValue = this.processKeys),
                (this.amount = vt.getProp(t, e.a, 0, null, this)),
                (this.miterLimit = vt.getProp(t, e.ml, 0, null, this)),
                (this.lineJoin = e.lj),
                (this._isAnimated = 0 !== this.amount.effectsSequence.length);
            }),
            (ve.prototype.processPath = function (t, e, i, r) {
              var n = At.newElement();
              n.c = t.c;
              var s,
                a,
                o,
                h = t.length();
              t.c || (h -= 1);
              var l = [];
              for (s = 0; s < h; s += 1)
                (o = Kt.shapeSegment(t, s)), l.push(ye(o, e));
              if (!t.c)
                for (s = h - 1; s >= 0; s -= 1)
                  (o = Kt.shapeSegmentInverted(t, s)), l.push(ye(o, e));
              l = (function (t) {
                for (var e, i = 1; i < t.length; i += 1)
                  (e = ge(t[i - 1], t[i])), (t[i - 1] = e[0]), (t[i] = e[1]);
                return (
                  t.length > 1 &&
                    ((e = ge(t[t.length - 1], t[0])),
                    (t[t.length - 1] = e[0]),
                    (t[0] = e[1])),
                  t
                );
              })(l);
              var f = null,
                c = null;
              for (s = 0; s < l.length; s += 1) {
                var u = l[s];
                for (
                  c && (f = de(n, c, u[0], i, r)), c = u[u.length - 1], a = 0;
                  a < u.length;
                  a += 1
                )
                  (o = u[a]),
                    f && ae(o.points[0], f)
                      ? n.setXYAt(
                          o.points[1][0],
                          o.points[1][1],
                          "o",
                          n.length() - 1
                        )
                      : n.setTripleAt(
                          o.points[0][0],
                          o.points[0][1],
                          o.points[1][0],
                          o.points[1][1],
                          o.points[0][0],
                          o.points[0][1],
                          n.length()
                        ),
                    n.setTripleAt(
                      o.points[3][0],
                      o.points[3][1],
                      o.points[3][0],
                      o.points[3][1],
                      o.points[2][0],
                      o.points[2][1],
                      n.length()
                    ),
                    (f = o.points[3]);
              }
              return l.length && de(n, c, l[0][0], i, r), n;
            }),
            (ve.prototype.processShapes = function (t) {
              var e,
                i,
                r,
                n,
                s,
                a,
                o = this.shapes.length,
                h = this.amount.v,
                l = this.miterLimit.v,
                f = this.lineJoin;
              if (0 !== h)
                for (i = 0; i < o; i += 1) {
                  if (
                    ((a = (s = this.shapes[i]).localShapeCollection),
                    s.shape._mdf || this._mdf || t)
                  )
                    for (
                      a.releaseShapes(),
                        s.shape._mdf = !0,
                        e = s.shape.paths.shapes,
                        n = s.shape.paths._length,
                        r = 0;
                      r < n;
                      r += 1
                    )
                      a.addShape(this.processPath(e[r], h, f, l));
                  s.shape.paths = s.localShapeCollection;
                }
              this.dynamicProperties.length || (this._mdf = !1);
            });
          var _e = (function () {
            var t = { w: 0, size: 0, shapes: [], data: { shapes: [] } },
              e = [];
            e = e.concat([
              2304, 2305, 2306, 2307, 2362, 2363, 2364, 2364, 2366, 2367, 2368,
              2369, 2370, 2371, 2372, 2373, 2374, 2375, 2376, 2377, 2378, 2379,
              2380, 2381, 2382, 2383, 2387, 2388, 2389, 2390, 2391, 2402, 2403,
            ]);
            var i = [
              "d83cdffb",
              "d83cdffc",
              "d83cdffd",
              "d83cdffe",
              "d83cdfff",
            ];
            function r(t, e) {
              var i = a("span");
              i.setAttribute("aria-hidden", !0), (i.style.fontFamily = e);
              var r = a("span");
              (r.innerText = "giItT1WQy@!-/#"),
                (i.style.position = "absolute"),
                (i.style.left = "-10000px"),
                (i.style.top = "-10000px"),
                (i.style.fontSize = "300px"),
                (i.style.fontVariant = "normal"),
                (i.style.fontStyle = "normal"),
                (i.style.fontWeight = "normal"),
                (i.style.letterSpacing = "0"),
                i.appendChild(r),
                document.body.appendChild(i);
              var n = r.offsetWidth;
              return (
                (r.style.fontFamily =
                  (function (t) {
                    var e,
                      i = t.split(","),
                      r = i.length,
                      n = [];
                    for (e = 0; e < r; e += 1)
                      "sans-serif" !== i[e] &&
                        "monospace" !== i[e] &&
                        n.push(i[e]);
                    return n.join(",");
                  })(t) +
                  ", " +
                  e),
                { node: r, w: n, parent: i }
              );
            }
            function n(t, e) {
              var i,
                r = document.body && e ? "svg" : "canvas",
                n = be(t);
              if ("svg" === r) {
                var s = U("text");
                (s.style.fontSize = "100px"),
                  s.setAttribute("font-family", t.fFamily),
                  s.setAttribute("font-style", n.style),
                  s.setAttribute("font-weight", n.weight),
                  (s.textContent = "1"),
                  t.fClass
                    ? ((s.style.fontFamily = "inherit"),
                      s.setAttribute("class", t.fClass))
                    : (s.style.fontFamily = t.fFamily),
                  e.appendChild(s),
                  (i = s);
              } else {
                var a = new OffscreenCanvas(500, 500).getContext("2d");
                (a.font = n.style + " " + n.weight + " 100px " + t.fFamily),
                  (i = a);
              }
              return {
                measureText: function (t) {
                  return "svg" === r
                    ? ((i.textContent = t), i.getComputedTextLength())
                    : i.measureText(t).width;
                },
              };
            }
            function s(t) {
              var e = 0,
                i = t.charCodeAt(0);
              if (i >= 55296 && i <= 56319) {
                var r = t.charCodeAt(1);
                r >= 56320 &&
                  r <= 57343 &&
                  (e = 1024 * (i - 55296) + r - 56320 + 65536);
              }
              return e;
            }
            function o(t) {
              var e = s(t);
              return e >= 127462 && e <= 127487;
            }
            var h = function () {
              (this.fonts = []),
                (this.chars = null),
                (this.typekitLoaded = 0),
                (this.isLoaded = !1),
                (this._warned = !1),
                (this.initTime = Date.now()),
                (this.setIsLoadedBinded = this.setIsLoaded.bind(this)),
                (this.checkLoadedFontsBinded =
                  this.checkLoadedFonts.bind(this));
            };
            return (
              (h.isModifier = function (t, e) {
                var r = t.toString(16) + e.toString(16);
                return -1 !== i.indexOf(r);
              }),
              (h.isZeroWidthJoiner = function (t) {
                return 8205 === t;
              }),
              (h.isFlagEmoji = function (t) {
                return o(t.substr(0, 2)) && o(t.substr(2, 2));
              }),
              (h.isRegionalCode = o),
              (h.isCombinedCharacter = function (t) {
                return -1 !== e.indexOf(t);
              }),
              (h.isRegionalFlag = function (t, e) {
                var i = s(t.substr(e, 2));
                if (127988 !== i) return !1;
                var r = 0;
                for (e += 2; r < 5; ) {
                  if ((i = s(t.substr(e, 2))) < 917601 || i > 917626) return !1;
                  (r += 1), (e += 2);
                }
                return 917631 === s(t.substr(e, 2));
              }),
              (h.isVariationSelector = function (t) {
                return 65039 === t;
              }),
              (h.BLACK_FLAG_CODE_POINT = 127988),
              (h.prototype = {
                addChars: function (t) {
                  if (t) {
                    var e;
                    this.chars || (this.chars = []);
                    var i,
                      r,
                      n = t.length,
                      s = this.chars.length;
                    for (e = 0; e < n; e += 1) {
                      for (i = 0, r = !1; i < s; )
                        this.chars[i].style === t[e].style &&
                          this.chars[i].fFamily === t[e].fFamily &&
                          this.chars[i].ch === t[e].ch &&
                          (r = !0),
                          (i += 1);
                      r || (this.chars.push(t[e]), (s += 1));
                    }
                  }
                },
                addFonts: function (t, e) {
                  if (t) {
                    if (this.chars)
                      return (this.isLoaded = !0), void (this.fonts = t.list);
                    if (!document.body)
                      return (
                        (this.isLoaded = !0),
                        t.list.forEach(function (t) {
                          (t.helper = n(t)), (t.cache = {});
                        }),
                        void (this.fonts = t.list)
                      );
                    var i,
                      s = t.list,
                      o = s.length,
                      h = o;
                    for (i = 0; i < o; i += 1) {
                      var l,
                        f,
                        c = !0;
                      if (
                        ((s[i].loaded = !1),
                        (s[i].monoCase = r(s[i].fFamily, "monospace")),
                        (s[i].sansCase = r(s[i].fFamily, "sans-serif")),
                        s[i].fPath)
                      ) {
                        if ("p" === s[i].fOrigin || 3 === s[i].origin) {
                          if (
                            ((l = document.querySelectorAll(
                              'style[f-forigin="p"][f-family="' +
                                s[i].fFamily +
                                '"], style[f-origin="3"][f-family="' +
                                s[i].fFamily +
                                '"]'
                            )).length > 0 && (c = !1),
                            c)
                          ) {
                            var u = a("style");
                            u.setAttribute("f-forigin", s[i].fOrigin),
                              u.setAttribute("f-origin", s[i].origin),
                              u.setAttribute("f-family", s[i].fFamily),
                              (u.type = "text/css"),
                              (u.innerText =
                                "@font-face {font-family: " +
                                s[i].fFamily +
                                "; font-style: normal; src: url('" +
                                s[i].fPath +
                                "');}"),
                              e.appendChild(u);
                          }
                        } else if ("g" === s[i].fOrigin || 1 === s[i].origin) {
                          for (
                            l = document.querySelectorAll(
                              'link[f-forigin="g"], link[f-origin="1"]'
                            ),
                              f = 0;
                            f < l.length;
                            f += 1
                          )
                            -1 !== l[f].href.indexOf(s[i].fPath) && (c = !1);
                          if (c) {
                            var p = a("link");
                            p.setAttribute("f-forigin", s[i].fOrigin),
                              p.setAttribute("f-origin", s[i].origin),
                              (p.type = "text/css"),
                              (p.rel = "stylesheet"),
                              (p.href = s[i].fPath),
                              document.body.appendChild(p);
                          }
                        } else if ("t" === s[i].fOrigin || 2 === s[i].origin) {
                          for (
                            l = document.querySelectorAll(
                              'script[f-forigin="t"], script[f-origin="2"]'
                            ),
                              f = 0;
                            f < l.length;
                            f += 1
                          )
                            s[i].fPath === l[f].src && (c = !1);
                          if (c) {
                            var d = a("link");
                            d.setAttribute("f-forigin", s[i].fOrigin),
                              d.setAttribute("f-origin", s[i].origin),
                              d.setAttribute("rel", "stylesheet"),
                              d.setAttribute("href", s[i].fPath),
                              e.appendChild(d);
                          }
                        }
                      } else (s[i].loaded = !0), (h -= 1);
                      (s[i].helper = n(s[i], e)),
                        (s[i].cache = {}),
                        this.fonts.push(s[i]);
                    }
                    0 === h
                      ? (this.isLoaded = !0)
                      : setTimeout(this.checkLoadedFonts.bind(this), 100);
                  } else this.isLoaded = !0;
                },
                getCharData: function (e, i, r) {
                  for (var n = 0, s = this.chars.length; n < s; ) {
                    if (
                      this.chars[n].ch === e &&
                      this.chars[n].style === i &&
                      this.chars[n].fFamily === r
                    )
                      return this.chars[n];
                    n += 1;
                  }
                  return (
                    (("string" == typeof e && 13 !== e.charCodeAt(0)) || !e) &&
                      console &&
                      console.warn &&
                      !this._warned &&
                      ((this._warned = !0),
                      console.warn(
                        "Missing character from exported characters list: ",
                        e,
                        i,
                        r
                      )),
                    t
                  );
                },
                getFontByName: function (t) {
                  for (var e = 0, i = this.fonts.length; e < i; ) {
                    if (this.fonts[e].fName === t) return this.fonts[e];
                    e += 1;
                  }
                  return this.fonts[0];
                },
                measureText: function (t, e, i) {
                  var r = this.getFontByName(e),
                    n = t;
                  if (!r.cache[n]) {
                    var s = r.helper;
                    if (" " === t) {
                      var a = s.measureText("|" + t + "|"),
                        o = s.measureText("||");
                      r.cache[n] = (a - o) / 100;
                    } else r.cache[n] = s.measureText(t) / 100;
                  }
                  return r.cache[n] * i;
                },
                checkLoadedFonts: function () {
                  var t,
                    e,
                    i,
                    r = this.fonts.length,
                    n = r;
                  for (t = 0; t < r; t += 1)
                    this.fonts[t].loaded
                      ? (n -= 1)
                      : "n" === this.fonts[t].fOrigin ||
                        0 === this.fonts[t].origin
                      ? (this.fonts[t].loaded = !0)
                      : ((e = this.fonts[t].monoCase.node),
                        (i = this.fonts[t].monoCase.w),
                        e.offsetWidth !== i
                          ? ((n -= 1), (this.fonts[t].loaded = !0))
                          : ((e = this.fonts[t].sansCase.node),
                            (i = this.fonts[t].sansCase.w),
                            e.offsetWidth !== i &&
                              ((n -= 1), (this.fonts[t].loaded = !0))),
                        this.fonts[t].loaded &&
                          (this.fonts[t].sansCase.parent.parentNode.removeChild(
                            this.fonts[t].sansCase.parent
                          ),
                          this.fonts[t].monoCase.parent.parentNode.removeChild(
                            this.fonts[t].monoCase.parent
                          )));
                  0 !== n && Date.now() - this.initTime < 5e3
                    ? setTimeout(this.checkLoadedFontsBinded, 20)
                    : setTimeout(this.setIsLoadedBinded, 10);
                },
                setIsLoaded: function () {
                  this.isLoaded = !0;
                },
              }),
              h
            );
          })();
          function we(t) {
            this.animationData = t;
          }
          function Ae() {}
          (we.prototype.getProp = function (t) {
            return this.animationData.slots && this.animationData.slots[t.sid]
              ? Object.assign(t, this.animationData.slots[t.sid].p)
              : t;
          }),
            (Ae.prototype = {
              initRenderable: function () {
                (this.isInRange = !1),
                  (this.hidden = !1),
                  (this.isTransparent = !1),
                  (this.renderableComponents = []);
              },
              addRenderableComponent: function (t) {
                -1 === this.renderableComponents.indexOf(t) &&
                  this.renderableComponents.push(t);
              },
              removeRenderableComponent: function (t) {
                -1 !== this.renderableComponents.indexOf(t) &&
                  this.renderableComponents.splice(
                    this.renderableComponents.indexOf(t),
                    1
                  );
              },
              prepareRenderableFrame: function (t) {
                this.checkLayerLimits(t);
              },
              checkTransparency: function () {
                this.finalTransform.mProp.o.v <= 0
                  ? !this.isTransparent &&
                    this.globalData.renderConfig.hideOnTransparent &&
                    ((this.isTransparent = !0), this.hide())
                  : this.isTransparent &&
                    ((this.isTransparent = !1), this.show());
              },
              checkLayerLimits: function (t) {
                this.data.ip - this.data.st <= t &&
                this.data.op - this.data.st > t
                  ? !0 !== this.isInRange &&
                    ((this.globalData._mdf = !0),
                    (this._mdf = !0),
                    (this.isInRange = !0),
                    this.show())
                  : !1 !== this.isInRange &&
                    ((this.globalData._mdf = !0),
                    (this.isInRange = !1),
                    this.hide());
              },
              renderRenderable: function () {
                var t,
                  e = this.renderableComponents.length;
                for (t = 0; t < e; t += 1)
                  this.renderableComponents[t].renderFrame(this._isFirstFrame);
              },
              sourceRectAtTime: function () {
                return { top: 0, left: 0, width: 100, height: 100 };
              },
              getLayerSize: function () {
                return 5 === this.data.ty
                  ? {
                      w: this.data.textData.width,
                      h: this.data.textData.height,
                    }
                  : { w: this.data.width, h: this.data.height };
              },
            });
          var xe,
            Se =
              ((xe = {
                0: "source-over",
                1: "multiply",
                2: "screen",
                3: "overlay",
                4: "darken",
                5: "lighten",
                6: "color-dodge",
                7: "color-burn",
                8: "hard-light",
                9: "soft-light",
                10: "difference",
                11: "exclusion",
                12: "hue",
                13: "saturation",
                14: "color",
                15: "luminosity",
              }),
              function (t) {
                return xe[t] || "";
              });
          function ke(t, e, i) {
            this.p = vt.getProp(e, t.v, 0, 0, i);
          }
          function Ee(t, e, i) {
            this.p = vt.getProp(e, t.v, 0, 0, i);
          }
          function Pe(t, e, i) {
            this.p = vt.getProp(e, t.v, 1, 0, i);
          }
          function Ce(t, e, i) {
            this.p = vt.getProp(e, t.v, 1, 0, i);
          }
          function De(t, e, i) {
            this.p = vt.getProp(e, t.v, 0, 0, i);
          }
          function Me(t, e, i) {
            this.p = vt.getProp(e, t.v, 0, 0, i);
          }
          function Te(t, e, i) {
            this.p = vt.getProp(e, t.v, 0, 0, i);
          }
          function Fe() {
            this.p = {};
          }
          function Oe(t, e) {
            var i,
              r = t.ef || [];
            this.effectElements = [];
            var n,
              s = r.length;
            for (i = 0; i < s; i += 1)
              (n = new Le(r[i], e)), this.effectElements.push(n);
          }
          function Le(t, e) {
            this.init(t, e);
          }
          function Ie() {}
          function Re() {}
          function je(t, e, i) {
            this.initFrame(),
              this.initRenderable(),
              (this.assetData = e.getAssetData(t.refId)),
              (this.footageData = e.imageLoader.getAsset(this.assetData)),
              this.initBaseData(t, e, i);
          }
          function Ne(t, e, i) {
            this.initFrame(),
              this.initRenderable(),
              (this.assetData = e.getAssetData(t.refId)),
              this.initBaseData(t, e, i),
              (this._isPlaying = !1),
              (this._canPlay = !1);
            var r = this.globalData.getAssetsPath(this.assetData);
            (this.audio = this.globalData.audioController.createAudio(r)),
              (this._currentTime = 0),
              this.globalData.audioController.addAudio(this),
              (this._volumeMultiplier = 1),
              (this._volume = 1),
              (this._previousVolume = null),
              (this.tm = t.tm
                ? vt.getProp(this, t.tm, 0, e.frameRate, this)
                : { _placeholder: !0 }),
              (this.lv = vt.getProp(
                this,
                t.au && t.au.lv ? t.au.lv : { k: [100] },
                1,
                0.01,
                this
              ));
          }
          function Be() {}
          o([bt], Le),
            (Le.prototype.getValue = Le.prototype.iterateDynamicProperties),
            (Le.prototype.init = function (t, e) {
              var i;
              (this.data = t),
                (this.effectElements = []),
                this.initDynamicPropertyContainer(e);
              var r,
                n = this.data.ef.length,
                s = this.data.ef;
              for (i = 0; i < n; i += 1) {
                switch (((r = null), s[i].ty)) {
                  case 0:
                    r = new ke(s[i], e, this);
                    break;
                  case 1:
                    r = new Ee(s[i], e, this);
                    break;
                  case 2:
                    r = new Pe(s[i], e, this);
                    break;
                  case 3:
                    r = new Ce(s[i], e, this);
                    break;
                  case 4:
                  case 7:
                    r = new Te(s[i], e, this);
                    break;
                  case 10:
                    r = new De(s[i], e, this);
                    break;
                  case 11:
                    r = new Me(s[i], e, this);
                    break;
                  case 5:
                    r = new Oe(s[i], e, this);
                    break;
                  default:
                    r = new Fe(s[i], e, this);
                }
                r && this.effectElements.push(r);
              }
            }),
            (Ie.prototype = {
              checkMasks: function () {
                if (!this.data.hasMask) return !1;
                for (var t = 0, e = this.data.masksProperties.length; t < e; ) {
                  if (
                    "n" !== this.data.masksProperties[t].mode &&
                    !1 !== this.data.masksProperties[t].cl
                  )
                    return !0;
                  t += 1;
                }
                return !1;
              },
              initExpressions: function () {
                var t = H();
                if (t) {
                  var e = t("layer"),
                    i = t("effects"),
                    r = t("shape"),
                    n = t("text"),
                    s = t("comp");
                  (this.layerInterface = e(this)),
                    this.data.hasMask &&
                      this.maskManager &&
                      this.layerInterface.registerMaskInterface(
                        this.maskManager
                      );
                  var a = i.createEffectsInterface(this, this.layerInterface);
                  this.layerInterface.registerEffectsInterface(a),
                    0 === this.data.ty || this.data.xt
                      ? (this.compInterface = s(this))
                      : 4 === this.data.ty
                      ? ((this.layerInterface.shapeInterface = r(
                          this.shapesData,
                          this.itemsData,
                          this.layerInterface
                        )),
                        (this.layerInterface.content =
                          this.layerInterface.shapeInterface))
                      : 5 === this.data.ty &&
                        ((this.layerInterface.textInterface = n(this)),
                        (this.layerInterface.text =
                          this.layerInterface.textInterface));
                }
              },
              setBlendMode: function () {
                var t = Se(this.data.bm);
                (this.baseElement || this.layerElement).style[
                  "mix-blend-mode"
                ] = t;
              },
              initBaseData: function (t, e, i) {
                (this.globalData = e),
                  (this.comp = i),
                  (this.data = t),
                  (this.layerId = L()),
                  this.data.sr || (this.data.sr = 1),
                  (this.effectsManager = new Oe(
                    this.data,
                    this,
                    this.dynamicProperties
                  ));
              },
              getType: function () {
                return this.type;
              },
              sourceRectAtTime: function () {},
            }),
            (Re.prototype = {
              initFrame: function () {
                (this._isFirstFrame = !1),
                  (this.dynamicProperties = []),
                  (this._mdf = !1);
              },
              prepareProperties: function (t, e) {
                var i,
                  r = this.dynamicProperties.length;
                for (i = 0; i < r; i += 1)
                  (e ||
                    (this._isParent &&
                      "transform" === this.dynamicProperties[i].propType)) &&
                    (this.dynamicProperties[i].getValue(),
                    this.dynamicProperties[i]._mdf &&
                      ((this.globalData._mdf = !0), (this._mdf = !0)));
              },
              addDynamicProperty: function (t) {
                -1 === this.dynamicProperties.indexOf(t) &&
                  this.dynamicProperties.push(t);
              },
            }),
            (je.prototype.prepareFrame = function () {}),
            o([Ae, Ie, Re], je),
            (je.prototype.getBaseElement = function () {
              return null;
            }),
            (je.prototype.renderFrame = function () {}),
            (je.prototype.destroy = function () {}),
            (je.prototype.initExpressions = function () {
              var t = H();
              if (t) {
                var e = t("footage");
                this.layerInterface = e(this);
              }
            }),
            (je.prototype.getFootageData = function () {
              return this.footageData;
            }),
            (Ne.prototype.prepareFrame = function (t) {
              if (
                (this.prepareRenderableFrame(t, !0),
                this.prepareProperties(t, !0),
                this.tm._placeholder)
              )
                this._currentTime = t / this.data.sr;
              else {
                var e = this.tm.v;
                this._currentTime = e;
              }
              this._volume = this.lv.v[0];
              var i = this._volume * this._volumeMultiplier;
              this._previousVolume !== i &&
                ((this._previousVolume = i), this.audio.volume(i));
            }),
            o([Ae, Ie, Re], Ne),
            (Ne.prototype.renderFrame = function () {
              this.isInRange &&
                this._canPlay &&
                (this._isPlaying
                  ? (!this.audio.playing() ||
                      Math.abs(
                        this._currentTime / this.globalData.frameRate -
                          this.audio.seek()
                      ) > 0.1) &&
                    this.audio.seek(
                      this._currentTime / this.globalData.frameRate
                    )
                  : (this.audio.play(),
                    this.audio.seek(
                      this._currentTime / this.globalData.frameRate
                    ),
                    (this._isPlaying = !0)));
            }),
            (Ne.prototype.show = function () {}),
            (Ne.prototype.hide = function () {
              this.audio.pause(), (this._isPlaying = !1);
            }),
            (Ne.prototype.pause = function () {
              this.audio.pause(), (this._isPlaying = !1), (this._canPlay = !1);
            }),
            (Ne.prototype.resume = function () {
              this._canPlay = !0;
            }),
            (Ne.prototype.setRate = function (t) {
              this.audio.rate(t);
            }),
            (Ne.prototype.volume = function (t) {
              (this._volumeMultiplier = t),
                (this._previousVolume = t * this._volume),
                this.audio.volume(this._previousVolume);
            }),
            (Ne.prototype.getBaseElement = function () {
              return null;
            }),
            (Ne.prototype.destroy = function () {}),
            (Ne.prototype.sourceRectAtTime = function () {}),
            (Ne.prototype.initExpressions = function () {}),
            (Be.prototype.checkLayers = function (t) {
              var e,
                i,
                r = this.layers.length;
              for (this.completeLayers = !0, e = r - 1; e >= 0; e -= 1)
                this.elements[e] ||
                  ((i = this.layers[e]).ip - i.st <= t - this.layers[e].st &&
                    i.op - i.st > t - this.layers[e].st &&
                    this.buildItem(e)),
                  (this.completeLayers =
                    !!this.elements[e] && this.completeLayers);
              this.checkPendingElements();
            }),
            (Be.prototype.createItem = function (t) {
              switch (t.ty) {
                case 2:
                  return this.createImage(t);
                case 0:
                  return this.createComp(t);
                case 1:
                  return this.createSolid(t);
                case 3:
                  return this.createNull(t);
                case 4:
                  return this.createShape(t);
                case 5:
                  return this.createText(t);
                case 6:
                  return this.createAudio(t);
                case 13:
                  return this.createCamera(t);
                case 15:
                  return this.createFootage(t);
                default:
                  return this.createNull(t);
              }
            }),
            (Be.prototype.createCamera = function () {
              throw new Error(
                "You're using a 3d camera. Try the html renderer."
              );
            }),
            (Be.prototype.createAudio = function (t) {
              return new Ne(t, this.globalData, this);
            }),
            (Be.prototype.createFootage = function (t) {
              return new je(t, this.globalData, this);
            }),
            (Be.prototype.buildAllItems = function () {
              var t,
                e = this.layers.length;
              for (t = 0; t < e; t += 1) this.buildItem(t);
              this.checkPendingElements();
            }),
            (Be.prototype.includeLayers = function (t) {
              var e;
              this.completeLayers = !1;
              var i,
                r = t.length,
                n = this.layers.length;
              for (e = 0; e < r; e += 1)
                for (i = 0; i < n; ) {
                  if (this.layers[i].id === t[e].id) {
                    this.layers[i] = t[e];
                    break;
                  }
                  i += 1;
                }
            }),
            (Be.prototype.setProjectInterface = function (t) {
              this.globalData.projectInterface = t;
            }),
            (Be.prototype.initItems = function () {
              this.globalData.progressiveLoad || this.buildAllItems();
            }),
            (Be.prototype.buildElementParenting = function (t, e, i) {
              for (
                var r = this.elements, n = this.layers, s = 0, a = n.length;
                s < a;

              )
                n[s].ind == e &&
                  (r[s] && !0 !== r[s]
                    ? (i.push(r[s]),
                      r[s].setAsParent(),
                      void 0 !== n[s].parent
                        ? this.buildElementParenting(t, n[s].parent, i)
                        : t.setHierarchy(i))
                    : (this.buildItem(s), this.addPendingElement(t))),
                  (s += 1);
            }),
            (Be.prototype.addPendingElement = function (t) {
              this.pendingElements.push(t);
            }),
            (Be.prototype.searchExtraCompositions = function (t) {
              var e,
                i = t.length;
              for (e = 0; e < i; e += 1)
                if (t[e].xt) {
                  var r = this.createComp(t[e]);
                  r.initExpressions(),
                    this.globalData.projectInterface.registerComposition(r);
                }
            }),
            (Be.prototype.getElementById = function (t) {
              var e,
                i = this.elements.length;
              for (e = 0; e < i; e += 1)
                if (this.elements[e].data.ind === t) return this.elements[e];
              return null;
            }),
            (Be.prototype.getElementByPath = function (t) {
              var e,
                i = t.shift();
              if ("number" == typeof i) e = this.elements[i];
              else {
                var r,
                  n = this.elements.length;
                for (r = 0; r < n; r += 1)
                  if (this.elements[r].data.nm === i) {
                    e = this.elements[r];
                    break;
                  }
              }
              return 0 === t.length ? e : e.getElementByPath(t);
            }),
            (Be.prototype.setupGlobalData = function (t, e) {
              (this.globalData.fontManager = new _e()),
                (this.globalData.slotManager = (function (t) {
                  return new we(t);
                })(t)),
                this.globalData.fontManager.addChars(t.chars),
                this.globalData.fontManager.addFonts(t.fonts, e),
                (this.globalData.getAssetData =
                  this.animationItem.getAssetData.bind(this.animationItem)),
                (this.globalData.getAssetsPath =
                  this.animationItem.getAssetsPath.bind(this.animationItem)),
                (this.globalData.imageLoader =
                  this.animationItem.imagePreloader),
                (this.globalData.audioController =
                  this.animationItem.audioController),
                (this.globalData.frameId = 0),
                (this.globalData.frameRate = t.fr),
                (this.globalData.nm = t.nm),
                (this.globalData.compSize = { w: t.w, h: t.h });
            });
          var Ve = "transformEFfect";
          function He() {}
          function ze(t, e, i) {
            (this.data = t),
              (this.element = e),
              (this.globalData = i),
              (this.storedData = []),
              (this.masksProperties = this.data.masksProperties || []),
              (this.maskElement = null);
            var r,
              n,
              a = this.globalData.defs,
              o = this.masksProperties ? this.masksProperties.length : 0;
            (this.viewData = c(o)), (this.solidPath = "");
            var h,
              l,
              f,
              u,
              p,
              d,
              m = this.masksProperties,
              g = 0,
              y = [],
              v = L(),
              b = "clipPath",
              _ = "clip-path";
            for (r = 0; r < o; r += 1)
              if (
                ((("a" !== m[r].mode && "n" !== m[r].mode) ||
                  m[r].inv ||
                  100 !== m[r].o.k ||
                  m[r].o.x) &&
                  ((b = "mask"), (_ = "mask")),
                ("s" !== m[r].mode && "i" !== m[r].mode) || 0 !== g
                  ? (f = null)
                  : ((f = U("rect")).setAttribute("fill", "#ffffff"),
                    f.setAttribute("width", this.element.comp.data.w || 0),
                    f.setAttribute("height", this.element.comp.data.h || 0),
                    y.push(f)),
                (n = U("path")),
                "n" === m[r].mode)
              )
                (this.viewData[r] = {
                  op: vt.getProp(this.element, m[r].o, 0, 0.01, this.element),
                  prop: Dt.getShapeProp(this.element, m[r], 3),
                  elem: n,
                  lastPath: "",
                }),
                  a.appendChild(n);
              else {
                var w;
                if (
                  ((g += 1),
                  n.setAttribute(
                    "fill",
                    "s" === m[r].mode ? "#000000" : "#ffffff"
                  ),
                  n.setAttribute("clip-rule", "nonzero"),
                  0 !== m[r].x.k
                    ? ((b = "mask"),
                      (_ = "mask"),
                      (d = vt.getProp(
                        this.element,
                        m[r].x,
                        0,
                        null,
                        this.element
                      )),
                      (w = L()),
                      (u = U("filter")).setAttribute("id", w),
                      (p = U("feMorphology")).setAttribute("operator", "erode"),
                      p.setAttribute("in", "SourceGraphic"),
                      p.setAttribute("radius", "0"),
                      u.appendChild(p),
                      a.appendChild(u),
                      n.setAttribute(
                        "stroke",
                        "s" === m[r].mode ? "#000000" : "#ffffff"
                      ))
                    : ((p = null), (d = null)),
                  (this.storedData[r] = {
                    elem: n,
                    x: d,
                    expan: p,
                    lastPath: "",
                    lastOperator: "",
                    filterId: w,
                    lastRadius: 0,
                  }),
                  "i" === m[r].mode)
                ) {
                  l = y.length;
                  var A = U("g");
                  for (h = 0; h < l; h += 1) A.appendChild(y[h]);
                  var x = U("mask");
                  x.setAttribute("mask-type", "alpha"),
                    x.setAttribute("id", v + "_" + g),
                    x.appendChild(n),
                    a.appendChild(x),
                    A.setAttribute(
                      "mask",
                      "url(" + s() + "#" + v + "_" + g + ")"
                    ),
                    (y.length = 0),
                    y.push(A);
                } else y.push(n);
                m[r].inv &&
                  !this.solidPath &&
                  (this.solidPath = this.createLayerSolidPath()),
                  (this.viewData[r] = {
                    elem: n,
                    lastPath: "",
                    op: vt.getProp(this.element, m[r].o, 0, 0.01, this.element),
                    prop: Dt.getShapeProp(this.element, m[r], 3),
                    invRect: f,
                  }),
                  this.viewData[r].prop.k ||
                    this.drawPath(
                      m[r],
                      this.viewData[r].prop.v,
                      this.viewData[r]
                    );
              }
            for (this.maskElement = U(b), o = y.length, r = 0; r < o; r += 1)
              this.maskElement.appendChild(y[r]);
            g > 0 &&
              (this.maskElement.setAttribute("id", v),
              this.element.maskedElement.setAttribute(
                _,
                "url(" + s() + "#" + v + ")"
              ),
              a.appendChild(this.maskElement)),
              this.viewData.length && this.element.addRenderableComponent(this);
          }
          (He.prototype = {
            initTransform: function () {
              var t = new Mt();
              (this.finalTransform = {
                mProp: this.data.ks
                  ? zt.getTransformProperty(this, this.data.ks, this)
                  : { o: 0 },
                _matMdf: !1,
                _localMatMdf: !1,
                _opMdf: !1,
                mat: t,
                localMat: t,
                localOpacity: 1,
              }),
                this.data.ao && (this.finalTransform.mProp.autoOriented = !0),
                this.data.ty;
            },
            renderTransform: function () {
              if (
                ((this.finalTransform._opMdf =
                  this.finalTransform.mProp.o._mdf || this._isFirstFrame),
                (this.finalTransform._matMdf =
                  this.finalTransform.mProp._mdf || this._isFirstFrame),
                this.hierarchy)
              ) {
                var t,
                  e = this.finalTransform.mat,
                  i = 0,
                  r = this.hierarchy.length;
                if (!this.finalTransform._matMdf)
                  for (; i < r; ) {
                    if (this.hierarchy[i].finalTransform.mProp._mdf) {
                      this.finalTransform._matMdf = !0;
                      break;
                    }
                    i += 1;
                  }
                if (this.finalTransform._matMdf)
                  for (
                    t = this.finalTransform.mProp.v.props,
                      e.cloneFromProps(t),
                      i = 0;
                    i < r;
                    i += 1
                  )
                    e.multiply(this.hierarchy[i].finalTransform.mProp.v);
              }
              this.finalTransform._matMdf &&
                (this.finalTransform._localMatMdf =
                  this.finalTransform._matMdf),
                this.finalTransform._opMdf &&
                  (this.finalTransform.localOpacity =
                    this.finalTransform.mProp.o.v);
            },
            renderLocalTransform: function () {
              if (this.localTransforms) {
                var t = 0,
                  e = this.localTransforms.length;
                if (
                  ((this.finalTransform._localMatMdf =
                    this.finalTransform._matMdf),
                  !this.finalTransform._localMatMdf ||
                    !this.finalTransform._opMdf)
                )
                  for (; t < e; )
                    this.localTransforms[t]._mdf &&
                      (this.finalTransform._localMatMdf = !0),
                      this.localTransforms[t]._opMdf &&
                        !this.finalTransform._opMdf &&
                        ((this.finalTransform.localOpacity =
                          this.finalTransform.mProp.o.v),
                        (this.finalTransform._opMdf = !0)),
                      (t += 1);
                if (this.finalTransform._localMatMdf) {
                  var i = this.finalTransform.localMat;
                  for (
                    this.localTransforms[0].matrix.clone(i), t = 1;
                    t < e;
                    t += 1
                  ) {
                    var r = this.localTransforms[t].matrix;
                    i.multiply(r);
                  }
                  i.multiply(this.finalTransform.mat);
                }
                if (this.finalTransform._opMdf) {
                  var n = this.finalTransform.localOpacity;
                  for (t = 0; t < e; t += 1)
                    n *= 0.01 * this.localTransforms[t].opacity;
                  this.finalTransform.localOpacity = n;
                }
              }
            },
            searchEffectTransforms: function () {
              if (this.renderableEffectsManager) {
                var t = this.renderableEffectsManager.getEffects(Ve);
                if (t.length) {
                  (this.localTransforms = []),
                    (this.finalTransform.localMat = new Mt());
                  var e = 0,
                    i = t.length;
                  for (e = 0; e < i; e += 1) this.localTransforms.push(t[e]);
                }
              }
            },
            globalToLocal: function (t) {
              var e = [];
              e.push(this.finalTransform);
              for (var i, r = !0, n = this.comp; r; )
                n.finalTransform
                  ? (n.data.hasMask && e.splice(0, 0, n.finalTransform),
                    (n = n.comp))
                  : (r = !1);
              var s,
                a = e.length;
              for (i = 0; i < a; i += 1)
                (s = e[i].mat.applyToPointArray(0, 0, 0)),
                  (t = [t[0] - s[0], t[1] - s[1], 0]);
              return t;
            },
            mHelper: new Mt(),
          }),
            (ze.prototype.getMaskProperty = function (t) {
              return this.viewData[t].prop;
            }),
            (ze.prototype.renderFrame = function (t) {
              var e,
                i = this.element.finalTransform.mat,
                r = this.masksProperties.length;
              for (e = 0; e < r; e += 1)
                if (
                  ((this.viewData[e].prop._mdf || t) &&
                    this.drawPath(
                      this.masksProperties[e],
                      this.viewData[e].prop.v,
                      this.viewData[e]
                    ),
                  (this.viewData[e].op._mdf || t) &&
                    this.viewData[e].elem.setAttribute(
                      "fill-opacity",
                      this.viewData[e].op.v
                    ),
                  "n" !== this.masksProperties[e].mode &&
                    (this.viewData[e].invRect &&
                      (this.element.finalTransform.mProp._mdf || t) &&
                      this.viewData[e].invRect.setAttribute(
                        "transform",
                        i.getInverseMatrix().to2dCSS()
                      ),
                    this.storedData[e].x && (this.storedData[e].x._mdf || t)))
                ) {
                  var n = this.storedData[e].expan;
                  this.storedData[e].x.v < 0
                    ? ("erode" !== this.storedData[e].lastOperator &&
                        ((this.storedData[e].lastOperator = "erode"),
                        this.storedData[e].elem.setAttribute(
                          "filter",
                          "url(" + s() + "#" + this.storedData[e].filterId + ")"
                        )),
                      n.setAttribute("radius", -this.storedData[e].x.v))
                    : ("dilate" !== this.storedData[e].lastOperator &&
                        ((this.storedData[e].lastOperator = "dilate"),
                        this.storedData[e].elem.setAttribute("filter", null)),
                      this.storedData[e].elem.setAttribute(
                        "stroke-width",
                        2 * this.storedData[e].x.v
                      ));
                }
            }),
            (ze.prototype.getMaskelement = function () {
              return this.maskElement;
            }),
            (ze.prototype.createLayerSolidPath = function () {
              var t = "M0,0 ";
              return (
                (t += " h" + this.globalData.compSize.w),
                (t += " v" + this.globalData.compSize.h),
                (t += " h-" + this.globalData.compSize.w),
                (t += " v-" + this.globalData.compSize.h + " ")
              );
            }),
            (ze.prototype.drawPath = function (t, e, i) {
              var r,
                n,
                s = " M" + e.v[0][0] + "," + e.v[0][1];
              for (n = e._length, r = 1; r < n; r += 1)
                s +=
                  " C" +
                  e.o[r - 1][0] +
                  "," +
                  e.o[r - 1][1] +
                  " " +
                  e.i[r][0] +
                  "," +
                  e.i[r][1] +
                  " " +
                  e.v[r][0] +
                  "," +
                  e.v[r][1];
              if (
                (e.c &&
                  n > 1 &&
                  (s +=
                    " C" +
                    e.o[r - 1][0] +
                    "," +
                    e.o[r - 1][1] +
                    " " +
                    e.i[0][0] +
                    "," +
                    e.i[0][1] +
                    " " +
                    e.v[0][0] +
                    "," +
                    e.v[0][1]),
                i.lastPath !== s)
              ) {
                var a = "";
                i.elem &&
                  (e.c && (a = t.inv ? this.solidPath + s : s),
                  i.elem.setAttribute("d", a)),
                  (i.lastPath = s);
              }
            }),
            (ze.prototype.destroy = function () {
              (this.element = null),
                (this.globalData = null),
                (this.maskElement = null),
                (this.data = null),
                (this.masksProperties = null);
            });
          var qe = (function () {
              var t = {
                createFilter: function (t, e) {
                  var i = U("filter");
                  return (
                    i.setAttribute("id", t),
                    !0 !== e &&
                      (i.setAttribute("filterUnits", "objectBoundingBox"),
                      i.setAttribute("x", "0%"),
                      i.setAttribute("y", "0%"),
                      i.setAttribute("width", "100%"),
                      i.setAttribute("height", "100%")),
                    i
                  );
                },
                createAlphaToLuminanceFilter: function () {
                  var t = U("feColorMatrix");
                  return (
                    t.setAttribute("type", "matrix"),
                    t.setAttribute("color-interpolation-filters", "sRGB"),
                    t.setAttribute(
                      "values",
                      "0 0 0 1 0  0 0 0 1 0  0 0 0 1 0  0 0 0 1 1"
                    ),
                    t
                  );
                },
              };
              return t;
            })(),
            Ue = (function () {
              var t = {
                maskType: !0,
                svgLumaHidden: !0,
                offscreenCanvas: "undefined" != typeof OffscreenCanvas,
              };
              return (
                (/MSIE 10/i.test(navigator.userAgent) ||
                  /MSIE 9/i.test(navigator.userAgent) ||
                  /rv:11.0/i.test(navigator.userAgent) ||
                  /Edge\/\d./i.test(navigator.userAgent)) &&
                  (t.maskType = !1),
                /firefox/i.test(navigator.userAgent) && (t.svgLumaHidden = !1),
                t
              );
            })(),
            We = {};
          function Xe(t) {
            var e,
              i,
              r = "SourceGraphic",
              n = t.data.ef ? t.data.ef.length : 0,
              a = L(),
              o = qe.createFilter(a, !0),
              h = 0;
            for (this.filters = [], e = 0; e < n; e += 1) {
              i = null;
              var l = t.data.ef[e].ty;
              We[l] &&
                ((i = new (0, We[l].effect)(
                  o,
                  t.effectsManager.effectElements[e],
                  t,
                  "filter_result_" + h,
                  r
                )),
                (r = "filter_result_" + h),
                We[l].countsAsEffect && (h += 1)),
                i && this.filters.push(i);
            }
            h &&
              (t.globalData.defs.appendChild(o),
              t.layerElement.setAttribute(
                "filter",
                "url(" + s() + "#" + a + ")"
              )),
              this.filters.length && t.addRenderableComponent(this);
          }
          function Ye() {}
          function Ge() {}
          function $e() {}
          function Je(t, e, i) {
            (this.assetData = e.getAssetData(t.refId)),
              this.assetData &&
                this.assetData.sid &&
                (this.assetData = e.slotManager.getProp(this.assetData)),
              this.initElement(t, e, i),
              (this.sourceRect = {
                top: 0,
                left: 0,
                width: this.assetData.w,
                height: this.assetData.h,
              });
          }
          function Ke(t, e) {
            (this.elem = t), (this.pos = e);
          }
          function Ze() {}
          (Xe.prototype.renderFrame = function (t) {
            var e,
              i = this.filters.length;
            for (e = 0; e < i; e += 1) this.filters[e].renderFrame(t);
          }),
            (Xe.prototype.getEffects = function (t) {
              var e,
                i = this.filters.length,
                r = [];
              for (e = 0; e < i; e += 1)
                this.filters[e].type === t && r.push(this.filters[e]);
              return r;
            }),
            (Ye.prototype = {
              initRendererElement: function () {
                this.layerElement = U("g");
              },
              createContainerElements: function () {
                (this.matteElement = U("g")),
                  (this.transformedElement = this.layerElement),
                  (this.maskedElement = this.layerElement),
                  (this._sizeChanged = !1);
                var t = null;
                if (this.data.td) {
                  this.matteMasks = {};
                  var e = U("g");
                  e.setAttribute("id", this.layerId),
                    e.appendChild(this.layerElement),
                    (t = e),
                    this.globalData.defs.appendChild(e);
                } else
                  this.data.tt
                    ? (this.matteElement.appendChild(this.layerElement),
                      (t = this.matteElement),
                      (this.baseElement = this.matteElement))
                    : (this.baseElement = this.layerElement);
                if (
                  (this.data.ln &&
                    this.layerElement.setAttribute("id", this.data.ln),
                  this.data.cl &&
                    this.layerElement.setAttribute("class", this.data.cl),
                  0 === this.data.ty && !this.data.hd)
                ) {
                  var i = U("clipPath"),
                    r = U("path");
                  r.setAttribute(
                    "d",
                    "M0,0 L" +
                      this.data.w +
                      ",0 L" +
                      this.data.w +
                      "," +
                      this.data.h +
                      " L0," +
                      this.data.h +
                      "z"
                  );
                  var n = L();
                  if (
                    (i.setAttribute("id", n),
                    i.appendChild(r),
                    this.globalData.defs.appendChild(i),
                    this.checkMasks())
                  ) {
                    var a = U("g");
                    a.setAttribute("clip-path", "url(" + s() + "#" + n + ")"),
                      a.appendChild(this.layerElement),
                      (this.transformedElement = a),
                      t
                        ? t.appendChild(this.transformedElement)
                        : (this.baseElement = this.transformedElement);
                  } else
                    this.layerElement.setAttribute(
                      "clip-path",
                      "url(" + s() + "#" + n + ")"
                    );
                }
                0 !== this.data.bm && this.setBlendMode();
              },
              renderElement: function () {
                this.finalTransform._localMatMdf &&
                  this.transformedElement.setAttribute(
                    "transform",
                    this.finalTransform.localMat.to2dCSS()
                  ),
                  this.finalTransform._opMdf &&
                    this.transformedElement.setAttribute(
                      "opacity",
                      this.finalTransform.localOpacity
                    );
              },
              destroyBaseElement: function () {
                (this.layerElement = null),
                  (this.matteElement = null),
                  this.maskManager.destroy();
              },
              getBaseElement: function () {
                return this.data.hd ? null : this.baseElement;
              },
              createRenderableComponents: function () {
                (this.maskManager = new ze(this.data, this, this.globalData)),
                  (this.renderableEffectsManager = new Xe(this)),
                  this.searchEffectTransforms();
              },
              getMatte: function (t) {
                if (
                  (this.matteMasks || (this.matteMasks = {}),
                  !this.matteMasks[t])
                ) {
                  var e,
                    i,
                    r,
                    n,
                    a = this.layerId + "_" + t;
                  if (1 === t || 3 === t) {
                    var o = U("mask");
                    o.setAttribute("id", a),
                      o.setAttribute(
                        "mask-type",
                        3 === t ? "luminance" : "alpha"
                      ),
                      (r = U("use")).setAttributeNS(
                        "http://www.w3.org/1999/xlink",
                        "href",
                        "#" + this.layerId
                      ),
                      o.appendChild(r),
                      this.globalData.defs.appendChild(o),
                      Ue.maskType ||
                        1 !== t ||
                        (o.setAttribute("mask-type", "luminance"),
                        (e = L()),
                        (i = qe.createFilter(e)),
                        this.globalData.defs.appendChild(i),
                        i.appendChild(qe.createAlphaToLuminanceFilter()),
                        (n = U("g")).appendChild(r),
                        o.appendChild(n),
                        n.setAttribute("filter", "url(" + s() + "#" + e + ")"));
                  } else if (2 === t) {
                    var h = U("mask");
                    h.setAttribute("id", a),
                      h.setAttribute("mask-type", "alpha");
                    var l = U("g");
                    h.appendChild(l), (e = L()), (i = qe.createFilter(e));
                    var f = U("feComponentTransfer");
                    f.setAttribute("in", "SourceGraphic"), i.appendChild(f);
                    var c = U("feFuncA");
                    c.setAttribute("type", "table"),
                      c.setAttribute("tableValues", "1.0 0.0"),
                      f.appendChild(c),
                      this.globalData.defs.appendChild(i);
                    var u = U("rect");
                    u.setAttribute("width", this.comp.data.w),
                      u.setAttribute("height", this.comp.data.h),
                      u.setAttribute("x", "0"),
                      u.setAttribute("y", "0"),
                      u.setAttribute("fill", "#ffffff"),
                      u.setAttribute("opacity", "0"),
                      l.setAttribute("filter", "url(" + s() + "#" + e + ")"),
                      l.appendChild(u),
                      (r = U("use")).setAttributeNS(
                        "http://www.w3.org/1999/xlink",
                        "href",
                        "#" + this.layerId
                      ),
                      l.appendChild(r),
                      Ue.maskType ||
                        (h.setAttribute("mask-type", "luminance"),
                        i.appendChild(qe.createAlphaToLuminanceFilter()),
                        (n = U("g")),
                        l.appendChild(u),
                        n.appendChild(this.layerElement),
                        l.appendChild(n)),
                      this.globalData.defs.appendChild(h);
                  }
                  this.matteMasks[t] = a;
                }
                return this.matteMasks[t];
              },
              setMatte: function (t) {
                this.matteElement &&
                  this.matteElement.setAttribute(
                    "mask",
                    "url(" + s() + "#" + t + ")"
                  );
              },
            }),
            (Ge.prototype = {
              initHierarchy: function () {
                (this.hierarchy = []),
                  (this._isParent = !1),
                  this.checkParenting();
              },
              setHierarchy: function (t) {
                this.hierarchy = t;
              },
              setAsParent: function () {
                this._isParent = !0;
              },
              checkParenting: function () {
                void 0 !== this.data.parent &&
                  this.comp.buildElementParenting(this, this.data.parent, []);
              },
            }),
            o(
              [
                Ae,
                h({
                  initElement: function (t, e, i) {
                    this.initFrame(),
                      this.initBaseData(t, e, i),
                      this.initTransform(t, e, i),
                      this.initHierarchy(),
                      this.initRenderable(),
                      this.initRendererElement(),
                      this.createContainerElements(),
                      this.createRenderableComponents(),
                      this.createContent(),
                      this.hide();
                  },
                  hide: function () {
                    this.hidden ||
                      (this.isInRange && !this.isTransparent) ||
                      (((this.baseElement || this.layerElement).style.display =
                        "none"),
                      (this.hidden = !0));
                  },
                  show: function () {
                    this.isInRange &&
                      !this.isTransparent &&
                      (this.data.hd ||
                        ((this.baseElement || this.layerElement).style.display =
                          "block"),
                      (this.hidden = !1),
                      (this._isFirstFrame = !0));
                  },
                  renderFrame: function () {
                    this.data.hd ||
                      this.hidden ||
                      (this.renderTransform(),
                      this.renderRenderable(),
                      this.renderLocalTransform(),
                      this.renderElement(),
                      this.renderInnerContent(),
                      this._isFirstFrame && (this._isFirstFrame = !1));
                  },
                  renderInnerContent: function () {},
                  prepareFrame: function (t) {
                    (this._mdf = !1),
                      this.prepareRenderableFrame(t),
                      this.prepareProperties(t, this.isInRange),
                      this.checkTransparency();
                  },
                  destroy: function () {
                    (this.innerElem = null), this.destroyBaseElement();
                  },
                }),
              ],
              $e
            ),
            o([Ie, He, Ye, Ge, Re, $e], Je),
            (Je.prototype.createContent = function () {
              var t = this.globalData.getAssetsPath(this.assetData);
              (this.innerElem = U("image")),
                this.innerElem.setAttribute("width", this.assetData.w + "px"),
                this.innerElem.setAttribute("height", this.assetData.h + "px"),
                this.innerElem.setAttribute(
                  "preserveAspectRatio",
                  this.assetData.pr ||
                    this.globalData.renderConfig.imagePreserveAspectRatio
                ),
                this.innerElem.setAttributeNS(
                  "http://www.w3.org/1999/xlink",
                  "href",
                  t
                ),
                this.layerElement.appendChild(this.innerElem);
            }),
            (Je.prototype.sourceRectAtTime = function () {
              return this.sourceRect;
            }),
            (Ze.prototype = {
              addShapeToModifiers: function (t) {
                var e,
                  i = this.shapeModifiers.length;
                for (e = 0; e < i; e += 1) this.shapeModifiers[e].addShape(t);
              },
              isShapeInAnimatedModifiers: function (t) {
                for (var e = this.shapeModifiers.length; 0 < e; )
                  if (this.shapeModifiers[0].isAnimatedWithShape(t)) return !0;
                return !1;
              },
              renderModifiers: function () {
                if (this.shapeModifiers.length) {
                  var t,
                    e = this.shapes.length;
                  for (t = 0; t < e; t += 1) this.shapes[t].sh.reset();
                  for (
                    t = (e = this.shapeModifiers.length) - 1;
                    t >= 0 &&
                    !this.shapeModifiers[t].processShapes(this._isFirstFrame);
                    t -= 1
                  );
                }
              },
              searchProcessedElement: function (t) {
                for (
                  var e = this.processedElements, i = 0, r = e.length;
                  i < r;

                ) {
                  if (e[i].elem === t) return e[i].pos;
                  i += 1;
                }
                return 0;
              },
              addProcessedElement: function (t, e) {
                for (var i = this.processedElements, r = i.length; r; )
                  if (i[(r -= 1)].elem === t) return void (i[r].pos = e);
                i.push(new Ke(t, e));
              },
              prepareFrame: function (t) {
                this.prepareRenderableFrame(t),
                  this.prepareProperties(t, this.isInRange);
              },
            });
          var Qe = { 1: "butt", 2: "round", 3: "square" },
            ti = { 1: "miter", 2: "round", 3: "bevel" };
          function ei(t, e, i) {
            (this.caches = []),
              (this.styles = []),
              (this.transformers = t),
              (this.lStr = ""),
              (this.sh = i),
              (this.lvl = e),
              (this._isAnimated = !!i.k);
            for (var r = 0, n = t.length; r < n; ) {
              if (t[r].mProps.dynamicProperties.length) {
                this._isAnimated = !0;
                break;
              }
              r += 1;
            }
          }
          function ii(t, e) {
            (this.data = t),
              (this.type = t.ty),
              (this.d = ""),
              (this.lvl = e),
              (this._mdf = !1),
              (this.closed = !0 === t.hd),
              (this.pElem = U("path")),
              (this.msElem = null);
          }
          function ri(t, e, i, r) {
            var n;
            (this.elem = t),
              (this.frameId = -1),
              (this.dataProps = c(e.length)),
              (this.renderer = i),
              (this.k = !1),
              (this.dashStr = ""),
              (this.dashArray = f("float32", e.length ? e.length - 1 : 0)),
              (this.dashoffset = f("float32", 1)),
              this.initDynamicPropertyContainer(r);
            var s,
              a = e.length || 0;
            for (n = 0; n < a; n += 1)
              (s = vt.getProp(t, e[n].v, 0, 0, this)),
                (this.k = s.k || this.k),
                (this.dataProps[n] = { n: e[n].n, p: s });
            this.k || this.getValue(!0), (this._isAnimated = this.k);
          }
          function ni(t, e, i) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.o = vt.getProp(t, e.o, 0, 0.01, this)),
              (this.w = vt.getProp(t, e.w, 0, null, this)),
              (this.d = new ri(t, e.d || {}, "svg", this)),
              (this.c = vt.getProp(t, e.c, 1, 255, this)),
              (this.style = i),
              (this._isAnimated = !!this._isAnimated);
          }
          function si(t, e, i) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.o = vt.getProp(t, e.o, 0, 0.01, this)),
              (this.c = vt.getProp(t, e.c, 1, 255, this)),
              (this.style = i);
          }
          function ai(t, e, i) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.style = i);
          }
          function oi(t, e, i) {
            (this.data = e), (this.c = f("uint8c", 4 * e.p));
            var r = e.k.k[0].s
              ? e.k.k[0].s.length - 4 * e.p
              : e.k.k.length - 4 * e.p;
            (this.o = f("float32", r)),
              (this._cmdf = !1),
              (this._omdf = !1),
              (this._collapsable = this.checkCollapsable()),
              (this._hasOpacity = r),
              this.initDynamicPropertyContainer(i),
              (this.prop = vt.getProp(t, e.k, 1, null, this)),
              (this.k = this.prop.k),
              this.getValue(!0);
          }
          function hi(t, e, i) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              this.initGradientData(t, e, i);
          }
          function li(t, e, i) {
            this.initDynamicPropertyContainer(t),
              (this.getValue = this.iterateDynamicProperties),
              (this.w = vt.getProp(t, e.w, 0, null, this)),
              (this.d = new ri(t, e.d || {}, "svg", this)),
              this.initGradientData(t, e, i),
              (this._isAnimated = !!this._isAnimated);
          }
          function fi() {
            (this.it = []), (this.prevViewData = []), (this.gr = U("g"));
          }
          function ci(t, e, i) {
            (this.transform = { mProps: t, op: e, container: i }),
              (this.elements = []),
              (this._isAnimated =
                this.transform.mProps.dynamicProperties.length ||
                this.transform.op.effectsSequence.length);
          }
          (ei.prototype.setAsAnimated = function () {
            this._isAnimated = !0;
          }),
            (ii.prototype.reset = function () {
              (this.d = ""), (this._mdf = !1);
            }),
            (ri.prototype.getValue = function (t) {
              if (
                (this.elem.globalData.frameId !== this.frameId || t) &&
                ((this.frameId = this.elem.globalData.frameId),
                this.iterateDynamicProperties(),
                (this._mdf = this._mdf || t),
                this._mdf)
              ) {
                var e = 0,
                  i = this.dataProps.length;
                for (
                  "svg" === this.renderer && (this.dashStr = ""), e = 0;
                  e < i;
                  e += 1
                )
                  "o" !== this.dataProps[e].n
                    ? "svg" === this.renderer
                      ? (this.dashStr += " " + this.dataProps[e].p.v)
                      : (this.dashArray[e] = this.dataProps[e].p.v)
                    : (this.dashoffset[0] = this.dataProps[e].p.v);
              }
            }),
            o([bt], ri),
            o([bt], ni),
            o([bt], si),
            o([bt], ai),
            (oi.prototype.comparePoints = function (t, e) {
              for (var i = 0, r = this.o.length / 2; i < r; ) {
                if (Math.abs(t[4 * i] - t[4 * e + 2 * i]) > 0.01) return !1;
                i += 1;
              }
              return !0;
            }),
            (oi.prototype.checkCollapsable = function () {
              if (this.o.length / 2 != this.c.length / 4) return !1;
              if (this.data.k.k[0].s)
                for (var t = 0, e = this.data.k.k.length; t < e; ) {
                  if (!this.comparePoints(this.data.k.k[t].s, this.data.p))
                    return !1;
                  t += 1;
                }
              else if (!this.comparePoints(this.data.k.k, this.data.p))
                return !1;
              return !0;
            }),
            (oi.prototype.getValue = function (t) {
              if (
                (this.prop.getValue(),
                (this._mdf = !1),
                (this._cmdf = !1),
                (this._omdf = !1),
                this.prop._mdf || t)
              ) {
                var e,
                  i,
                  r,
                  n = 4 * this.data.p;
                for (e = 0; e < n; e += 1)
                  (i = e % 4 == 0 ? 100 : 255),
                    (r = Math.round(this.prop.v[e] * i)),
                    this.c[e] !== r && ((this.c[e] = r), (this._cmdf = !t));
                if (this.o.length)
                  for (
                    n = this.prop.v.length, e = 4 * this.data.p;
                    e < n;
                    e += 1
                  )
                    (i = e % 2 == 0 ? 100 : 1),
                      (r =
                        e % 2 == 0
                          ? Math.round(100 * this.prop.v[e])
                          : this.prop.v[e]),
                      this.o[e - 4 * this.data.p] !== r &&
                        ((this.o[e - 4 * this.data.p] = r), (this._omdf = !t));
                this._mdf = !t;
              }
            }),
            o([bt], oi),
            (hi.prototype.initGradientData = function (t, e, i) {
              (this.o = vt.getProp(t, e.o, 0, 0.01, this)),
                (this.s = vt.getProp(t, e.s, 1, null, this)),
                (this.e = vt.getProp(t, e.e, 1, null, this)),
                (this.h = vt.getProp(t, e.h || { k: 0 }, 0, 0.01, this)),
                (this.a = vt.getProp(t, e.a || { k: 0 }, 0, S, this)),
                (this.g = new oi(t, e.g, this)),
                (this.style = i),
                (this.stops = []),
                this.setGradientData(i.pElem, e),
                this.setGradientOpacity(e, i),
                (this._isAnimated = !!this._isAnimated);
            }),
            (hi.prototype.setGradientData = function (t, e) {
              var i = L(),
                r = U(1 === e.t ? "linearGradient" : "radialGradient");
              r.setAttribute("id", i),
                r.setAttribute("spreadMethod", "pad"),
                r.setAttribute("gradientUnits", "userSpaceOnUse");
              var n,
                a,
                o,
                h = [];
              for (o = 4 * e.g.p, a = 0; a < o; a += 4)
                (n = U("stop")), r.appendChild(n), h.push(n);
              t.setAttribute(
                "gf" === e.ty ? "fill" : "stroke",
                "url(" + s() + "#" + i + ")"
              ),
                (this.gf = r),
                (this.cst = h);
            }),
            (hi.prototype.setGradientOpacity = function (t, e) {
              if (this.g._hasOpacity && !this.g._collapsable) {
                var i,
                  r,
                  n,
                  a = U("mask"),
                  o = U("path");
                a.appendChild(o);
                var h = L(),
                  l = L();
                a.setAttribute("id", l);
                var f = U(1 === t.t ? "linearGradient" : "radialGradient");
                f.setAttribute("id", h),
                  f.setAttribute("spreadMethod", "pad"),
                  f.setAttribute("gradientUnits", "userSpaceOnUse"),
                  (n = t.g.k.k[0].s ? t.g.k.k[0].s.length : t.g.k.k.length);
                var c = this.stops;
                for (r = 4 * t.g.p; r < n; r += 2)
                  (i = U("stop")).setAttribute(
                    "stop-color",
                    "rgb(255,255,255)"
                  ),
                    f.appendChild(i),
                    c.push(i);
                o.setAttribute(
                  "gf" === t.ty ? "fill" : "stroke",
                  "url(" + s() + "#" + h + ")"
                ),
                  "gs" === t.ty &&
                    (o.setAttribute("stroke-linecap", Qe[t.lc || 2]),
                    o.setAttribute("stroke-linejoin", ti[t.lj || 2]),
                    1 === t.lj && o.setAttribute("stroke-miterlimit", t.ml)),
                  (this.of = f),
                  (this.ms = a),
                  (this.ost = c),
                  (this.maskId = l),
                  (e.msElem = o);
              }
            }),
            o([bt], hi),
            o([hi, bt], li);
          var ui = function (t, e, i, r) {
              if (0 === e) return "";
              var n,
                s = t.o,
                a = t.i,
                o = t.v,
                h = " M" + r.applyToPointStringified(o[0][0], o[0][1]);
              for (n = 1; n < e; n += 1)
                h +=
                  " C" +
                  r.applyToPointStringified(s[n - 1][0], s[n - 1][1]) +
                  " " +
                  r.applyToPointStringified(a[n][0], a[n][1]) +
                  " " +
                  r.applyToPointStringified(o[n][0], o[n][1]);
              return (
                i &&
                  e &&
                  ((h +=
                    " C" +
                    r.applyToPointStringified(s[n - 1][0], s[n - 1][1]) +
                    " " +
                    r.applyToPointStringified(a[0][0], a[0][1]) +
                    " " +
                    r.applyToPointStringified(o[0][0], o[0][1])),
                  (h += "z")),
                h
              );
            },
            pi = (function () {
              var t = new Mt(),
                e = new Mt();
              function i(t, e, i) {
                (i || e.transform.op._mdf) &&
                  e.transform.container.setAttribute(
                    "opacity",
                    e.transform.op.v
                  ),
                  (i || e.transform.mProps._mdf) &&
                    e.transform.container.setAttribute(
                      "transform",
                      e.transform.mProps.v.to2dCSS()
                    );
              }
              function r() {}
              function n(i, r, n) {
                var s,
                  a,
                  o,
                  h,
                  l,
                  f,
                  c,
                  u,
                  p,
                  d,
                  m = r.styles.length,
                  g = r.lvl;
                for (f = 0; f < m; f += 1) {
                  if (((h = r.sh._mdf || n), r.styles[f].lvl < g)) {
                    for (
                      u = e.reset(),
                        p = g - r.styles[f].lvl,
                        d = r.transformers.length - 1;
                      !h && p > 0;

                    )
                      (h = r.transformers[d].mProps._mdf || h),
                        (p -= 1),
                        (d -= 1);
                    if (h)
                      for (
                        p = g - r.styles[f].lvl, d = r.transformers.length - 1;
                        p > 0;

                      )
                        u.multiply(r.transformers[d].mProps.v),
                          (p -= 1),
                          (d -= 1);
                  } else u = t;
                  if (((a = (c = r.sh.paths)._length), h)) {
                    for (o = "", s = 0; s < a; s += 1)
                      (l = c.shapes[s]) &&
                        l._length &&
                        (o += ui(l, l._length, l.c, u));
                    r.caches[f] = o;
                  } else o = r.caches[f];
                  (r.styles[f].d += !0 === i.hd ? "" : o),
                    (r.styles[f]._mdf = h || r.styles[f]._mdf);
                }
              }
              function s(t, e, i) {
                var r = e.style;
                (e.c._mdf || i) &&
                  r.pElem.setAttribute(
                    "fill",
                    "rgb(" +
                      _(e.c.v[0]) +
                      "," +
                      _(e.c.v[1]) +
                      "," +
                      _(e.c.v[2]) +
                      ")"
                  ),
                  (e.o._mdf || i) &&
                    r.pElem.setAttribute("fill-opacity", e.o.v);
              }
              function a(t, e, i) {
                o(t, e, i), h(0, e, i);
              }
              function o(t, e, i) {
                var r,
                  n,
                  s,
                  a,
                  o,
                  h = e.gf,
                  l = e.g._hasOpacity,
                  f = e.s.v,
                  c = e.e.v;
                if (e.o._mdf || i) {
                  var u = "gf" === t.ty ? "fill-opacity" : "stroke-opacity";
                  e.style.pElem.setAttribute(u, e.o.v);
                }
                if (e.s._mdf || i) {
                  var p = 1 === t.t ? "x1" : "cx",
                    d = "x1" === p ? "y1" : "cy";
                  h.setAttribute(p, f[0]),
                    h.setAttribute(d, f[1]),
                    l &&
                      !e.g._collapsable &&
                      (e.of.setAttribute(p, f[0]), e.of.setAttribute(d, f[1]));
                }
                if (e.g._cmdf || i) {
                  r = e.cst;
                  var m = e.g.c;
                  for (s = r.length, n = 0; n < s; n += 1)
                    (a = r[n]).setAttribute("offset", m[4 * n] + "%"),
                      a.setAttribute(
                        "stop-color",
                        "rgb(" +
                          m[4 * n + 1] +
                          "," +
                          m[4 * n + 2] +
                          "," +
                          m[4 * n + 3] +
                          ")"
                      );
                }
                if (l && (e.g._omdf || i)) {
                  var g = e.g.o;
                  for (
                    s = (r = e.g._collapsable ? e.cst : e.ost).length, n = 0;
                    n < s;
                    n += 1
                  )
                    (a = r[n]),
                      e.g._collapsable ||
                        a.setAttribute("offset", g[2 * n] + "%"),
                      a.setAttribute("stop-opacity", g[2 * n + 1]);
                }
                if (1 === t.t)
                  (e.e._mdf || i) &&
                    (h.setAttribute("x2", c[0]),
                    h.setAttribute("y2", c[1]),
                    l &&
                      !e.g._collapsable &&
                      (e.of.setAttribute("x2", c[0]),
                      e.of.setAttribute("y2", c[1])));
                else if (
                  ((e.s._mdf || e.e._mdf || i) &&
                    ((o = Math.sqrt(
                      Math.pow(f[0] - c[0], 2) + Math.pow(f[1] - c[1], 2)
                    )),
                    h.setAttribute("r", o),
                    l && !e.g._collapsable && e.of.setAttribute("r", o)),
                  e.e._mdf || e.h._mdf || e.a._mdf || i)
                ) {
                  o ||
                    (o = Math.sqrt(
                      Math.pow(f[0] - c[0], 2) + Math.pow(f[1] - c[1], 2)
                    ));
                  var y = Math.atan2(c[1] - f[1], c[0] - f[0]),
                    v = e.h.v;
                  v >= 1 ? (v = 0.99) : v <= -1 && (v = -0.99);
                  var b = o * v,
                    _ = Math.cos(y + e.a.v) * b + f[0],
                    w = Math.sin(y + e.a.v) * b + f[1];
                  h.setAttribute("fx", _),
                    h.setAttribute("fy", w),
                    l &&
                      !e.g._collapsable &&
                      (e.of.setAttribute("fx", _), e.of.setAttribute("fy", w));
                }
              }
              function h(t, e, i) {
                var r = e.style,
                  n = e.d;
                n &&
                  (n._mdf || i) &&
                  n.dashStr &&
                  (r.pElem.setAttribute("stroke-dasharray", n.dashStr),
                  r.pElem.setAttribute("stroke-dashoffset", n.dashoffset[0])),
                  e.c &&
                    (e.c._mdf || i) &&
                    r.pElem.setAttribute(
                      "stroke",
                      "rgb(" +
                        _(e.c.v[0]) +
                        "," +
                        _(e.c.v[1]) +
                        "," +
                        _(e.c.v[2]) +
                        ")"
                    ),
                  (e.o._mdf || i) &&
                    r.pElem.setAttribute("stroke-opacity", e.o.v),
                  (e.w._mdf || i) &&
                    (r.pElem.setAttribute("stroke-width", e.w.v),
                    r.msElem && r.msElem.setAttribute("stroke-width", e.w.v));
              }
              return {
                createRenderFunction: function (t) {
                  switch (t.ty) {
                    case "fl":
                      return s;
                    case "gf":
                      return o;
                    case "gs":
                      return a;
                    case "st":
                      return h;
                    case "sh":
                    case "el":
                    case "rc":
                    case "sr":
                      return n;
                    case "tr":
                      return i;
                    case "no":
                      return r;
                    default:
                      return null;
                  }
                },
              };
            })();
          function di(t, e, i) {
            (this.shapes = []),
              (this.shapesData = t.shapes),
              (this.stylesList = []),
              (this.shapeModifiers = []),
              (this.itemsData = []),
              (this.processedElements = []),
              (this.animatedContents = []),
              this.initElement(t, e, i),
              (this.prevViewData = []);
          }
          function mi(t, e, i, r, n, s) {
            (this.o = t),
              (this.sw = e),
              (this.sc = i),
              (this.fc = r),
              (this.m = n),
              (this.p = s),
              (this._mdf = { o: !0, sw: !!e, sc: !!i, fc: !!r, m: !0, p: !0 });
          }
          function gi(t, e) {
            (this._frameId = -999999),
              (this.pv = ""),
              (this.v = ""),
              (this.kf = !1),
              (this._isFirstFrame = !0),
              (this._mdf = !1),
              e.d && e.d.sid && (e.d = t.globalData.slotManager.getProp(e.d)),
              (this.data = e),
              (this.elem = t),
              (this.comp = this.elem.comp),
              (this.keysIndex = 0),
              (this.canResize = !1),
              (this.minimumFontSize = 1),
              (this.effectsSequence = []),
              (this.currentData = {
                ascent: 0,
                boxWidth: this.defaultBoxWidth,
                f: "",
                fStyle: "",
                fWeight: "",
                fc: "",
                j: "",
                justifyOffset: "",
                l: [],
                lh: 0,
                lineWidths: [],
                ls: "",
                of: "",
                s: "",
                sc: "",
                sw: 0,
                t: 0,
                tr: 0,
                sz: 0,
                ps: null,
                fillColorAnim: !1,
                strokeColorAnim: !1,
                strokeWidthAnim: !1,
                yOffset: 0,
                finalSize: 0,
                finalText: [],
                finalLineHeight: 0,
                __complete: !1,
              }),
              this.copyData(this.currentData, this.data.d.k[0].s),
              this.searchProperty() || this.completeTextData(this.currentData);
          }
          o([Ie, He, Ye, Ze, Ge, Re, $e], di),
            (di.prototype.initSecondaryElement = function () {}),
            (di.prototype.identityMatrix = new Mt()),
            (di.prototype.buildExpressionInterface = function () {}),
            (di.prototype.createContent = function () {
              this.searchShapes(
                this.shapesData,
                this.itemsData,
                this.prevViewData,
                this.layerElement,
                0,
                [],
                !0
              ),
                this.filterUniqueShapes();
            }),
            (di.prototype.filterUniqueShapes = function () {
              var t,
                e,
                i,
                r,
                n = this.shapes.length,
                s = this.stylesList.length,
                a = [],
                o = !1;
              for (i = 0; i < s; i += 1) {
                for (
                  r = this.stylesList[i], o = !1, a.length = 0, t = 0;
                  t < n;
                  t += 1
                )
                  -1 !== (e = this.shapes[t]).styles.indexOf(r) &&
                    (a.push(e), (o = e._isAnimated || o));
                a.length > 1 && o && this.setShapesAsAnimated(a);
              }
            }),
            (di.prototype.setShapesAsAnimated = function (t) {
              var e,
                i = t.length;
              for (e = 0; e < i; e += 1) t[e].setAsAnimated();
            }),
            (di.prototype.createStyleElement = function (t, e) {
              var i,
                r = new ii(t, e),
                n = r.pElem;
              return (
                "st" === t.ty
                  ? (i = new ni(this, t, r))
                  : "fl" === t.ty
                  ? (i = new si(this, t, r))
                  : "gf" === t.ty || "gs" === t.ty
                  ? ((i = new ("gf" === t.ty ? hi : li)(this, t, r)),
                    this.globalData.defs.appendChild(i.gf),
                    i.maskId &&
                      (this.globalData.defs.appendChild(i.ms),
                      this.globalData.defs.appendChild(i.of),
                      n.setAttribute(
                        "mask",
                        "url(" + s() + "#" + i.maskId + ")"
                      )))
                  : "no" === t.ty && (i = new ai(this, t, r)),
                ("st" !== t.ty && "gs" !== t.ty) ||
                  (n.setAttribute("stroke-linecap", Qe[t.lc || 2]),
                  n.setAttribute("stroke-linejoin", ti[t.lj || 2]),
                  n.setAttribute("fill-opacity", "0"),
                  1 === t.lj && n.setAttribute("stroke-miterlimit", t.ml)),
                2 === t.r && n.setAttribute("fill-rule", "evenodd"),
                t.ln && n.setAttribute("id", t.ln),
                t.cl && n.setAttribute("class", t.cl),
                t.bm && (n.style["mix-blend-mode"] = Se(t.bm)),
                this.stylesList.push(r),
                this.addToAnimatedContents(t, i),
                i
              );
            }),
            (di.prototype.createGroupElement = function (t) {
              var e = new fi();
              return (
                t.ln && e.gr.setAttribute("id", t.ln),
                t.cl && e.gr.setAttribute("class", t.cl),
                t.bm && (e.gr.style["mix-blend-mode"] = Se(t.bm)),
                e
              );
            }),
            (di.prototype.createTransformElement = function (t, e) {
              var i = zt.getTransformProperty(this, t, this),
                r = new ci(i, i.o, e);
              return this.addToAnimatedContents(t, r), r;
            }),
            (di.prototype.createShapeElement = function (t, e, i) {
              var r = 4;
              "rc" === t.ty
                ? (r = 5)
                : "el" === t.ty
                ? (r = 6)
                : "sr" === t.ty && (r = 7);
              var n = new ei(e, i, Dt.getShapeProp(this, t, r, this));
              return (
                this.shapes.push(n),
                this.addShapeToModifiers(n),
                this.addToAnimatedContents(t, n),
                n
              );
            }),
            (di.prototype.addToAnimatedContents = function (t, e) {
              for (var i = 0, r = this.animatedContents.length; i < r; ) {
                if (this.animatedContents[i].element === e) return;
                i += 1;
              }
              this.animatedContents.push({
                fn: pi.createRenderFunction(t),
                element: e,
                data: t,
              });
            }),
            (di.prototype.setElementStyles = function (t) {
              var e,
                i = t.styles,
                r = this.stylesList.length;
              for (e = 0; e < r; e += 1)
                this.stylesList[e].closed || i.push(this.stylesList[e]);
            }),
            (di.prototype.reloadShapes = function () {
              var t;
              this._isFirstFrame = !0;
              var e = this.itemsData.length;
              for (t = 0; t < e; t += 1)
                this.prevViewData[t] = this.itemsData[t];
              for (
                this.searchShapes(
                  this.shapesData,
                  this.itemsData,
                  this.prevViewData,
                  this.layerElement,
                  0,
                  [],
                  !0
                ),
                  this.filterUniqueShapes(),
                  e = this.dynamicProperties.length,
                  t = 0;
                t < e;
                t += 1
              )
                this.dynamicProperties[t].getValue();
              this.renderModifiers();
            }),
            (di.prototype.searchShapes = function (t, e, i, r, n, s, a) {
              var o,
                h,
                l,
                f,
                c,
                u,
                p = [].concat(s),
                d = t.length - 1,
                m = [],
                g = [];
              for (o = d; o >= 0; o -= 1) {
                if (
                  ((u = this.searchProcessedElement(t[o]))
                    ? (e[o] = i[u - 1])
                    : (t[o]._render = a),
                  "fl" === t[o].ty ||
                    "st" === t[o].ty ||
                    "gf" === t[o].ty ||
                    "gs" === t[o].ty ||
                    "no" === t[o].ty)
                )
                  u
                    ? (e[o].style.closed = !1)
                    : (e[o] = this.createStyleElement(t[o], n)),
                    t[o]._render &&
                      e[o].style.pElem.parentNode !== r &&
                      r.appendChild(e[o].style.pElem),
                    m.push(e[o].style);
                else if ("gr" === t[o].ty) {
                  if (u)
                    for (l = e[o].it.length, h = 0; h < l; h += 1)
                      e[o].prevViewData[h] = e[o].it[h];
                  else e[o] = this.createGroupElement(t[o]);
                  this.searchShapes(
                    t[o].it,
                    e[o].it,
                    e[o].prevViewData,
                    e[o].gr,
                    n + 1,
                    p,
                    a
                  ),
                    t[o]._render &&
                      e[o].gr.parentNode !== r &&
                      r.appendChild(e[o].gr);
                } else
                  "tr" === t[o].ty
                    ? (u || (e[o] = this.createTransformElement(t[o], r)),
                      (f = e[o].transform),
                      p.push(f))
                    : "sh" === t[o].ty ||
                      "rc" === t[o].ty ||
                      "el" === t[o].ty ||
                      "sr" === t[o].ty
                    ? (u || (e[o] = this.createShapeElement(t[o], p, n)),
                      this.setElementStyles(e[o]))
                    : "tm" === t[o].ty ||
                      "rd" === t[o].ty ||
                      "ms" === t[o].ty ||
                      "pb" === t[o].ty ||
                      "zz" === t[o].ty ||
                      "op" === t[o].ty
                    ? (u
                        ? ((c = e[o]).closed = !1)
                        : ((c = Nt.getModifier(t[o].ty)).init(this, t[o]),
                          (e[o] = c),
                          this.shapeModifiers.push(c)),
                      g.push(c))
                    : "rp" === t[o].ty &&
                      (u
                        ? ((c = e[o]).closed = !0)
                        : ((c = Nt.getModifier(t[o].ty)),
                          (e[o] = c),
                          c.init(this, t, o, e),
                          this.shapeModifiers.push(c),
                          (a = !1)),
                      g.push(c));
                this.addProcessedElement(t[o], o + 1);
              }
              for (d = m.length, o = 0; o < d; o += 1) m[o].closed = !0;
              for (d = g.length, o = 0; o < d; o += 1) g[o].closed = !0;
            }),
            (di.prototype.renderInnerContent = function () {
              var t;
              this.renderModifiers();
              var e = this.stylesList.length;
              for (t = 0; t < e; t += 1) this.stylesList[t].reset();
              for (this.renderShape(), t = 0; t < e; t += 1)
                (this.stylesList[t]._mdf || this._isFirstFrame) &&
                  (this.stylesList[t].msElem &&
                    (this.stylesList[t].msElem.setAttribute(
                      "d",
                      this.stylesList[t].d
                    ),
                    (this.stylesList[t].d = "M0 0" + this.stylesList[t].d)),
                  this.stylesList[t].pElem.setAttribute(
                    "d",
                    this.stylesList[t].d || "M0 0"
                  ));
            }),
            (di.prototype.renderShape = function () {
              var t,
                e,
                i = this.animatedContents.length;
              for (t = 0; t < i; t += 1)
                (e = this.animatedContents[t]),
                  (this._isFirstFrame || e.element._isAnimated) &&
                    !0 !== e.data &&
                    e.fn(e.data, e.element, this._isFirstFrame);
            }),
            (di.prototype.destroy = function () {
              this.destroyBaseElement(),
                (this.shapesData = null),
                (this.itemsData = null);
            }),
            (mi.prototype.update = function (t, e, i, r, n, s) {
              (this._mdf.o = !1),
                (this._mdf.sw = !1),
                (this._mdf.sc = !1),
                (this._mdf.fc = !1),
                (this._mdf.m = !1),
                (this._mdf.p = !1);
              var a = !1;
              return (
                this.o !== t && ((this.o = t), (this._mdf.o = !0), (a = !0)),
                this.sw !== e && ((this.sw = e), (this._mdf.sw = !0), (a = !0)),
                this.sc !== i && ((this.sc = i), (this._mdf.sc = !0), (a = !0)),
                this.fc !== r && ((this.fc = r), (this._mdf.fc = !0), (a = !0)),
                this.m !== n && ((this.m = n), (this._mdf.m = !0), (a = !0)),
                !s.length ||
                  (this.p[0] === s[0] &&
                    this.p[1] === s[1] &&
                    this.p[4] === s[4] &&
                    this.p[5] === s[5] &&
                    this.p[12] === s[12] &&
                    this.p[13] === s[13]) ||
                  ((this.p = s), (this._mdf.p = !0), (a = !0)),
                a
              );
            }),
            (gi.prototype.defaultBoxWidth = [0, 0]),
            (gi.prototype.copyData = function (t, e) {
              for (var i in e)
                Object.prototype.hasOwnProperty.call(e, i) && (t[i] = e[i]);
              return t;
            }),
            (gi.prototype.setCurrentData = function (t) {
              t.__complete || this.completeTextData(t),
                (this.currentData = t),
                (this.currentData.boxWidth =
                  this.currentData.boxWidth || this.defaultBoxWidth),
                (this._mdf = !0);
            }),
            (gi.prototype.searchProperty = function () {
              return this.searchKeyframes();
            }),
            (gi.prototype.searchKeyframes = function () {
              return (
                (this.kf = this.data.d.k.length > 1),
                this.kf && this.addEffect(this.getKeyframeValue.bind(this)),
                this.kf
              );
            }),
            (gi.prototype.addEffect = function (t) {
              this.effectsSequence.push(t), this.elem.addDynamicProperty(this);
            }),
            (gi.prototype.getValue = function (t) {
              if (
                (this.elem.globalData.frameId !== this.frameId &&
                  this.effectsSequence.length) ||
                t
              ) {
                this.currentData.t = this.data.d.k[this.keysIndex].s.t;
                var e = this.currentData,
                  i = this.keysIndex;
                if (this.lock) this.setCurrentData(this.currentData);
                else {
                  var r;
                  (this.lock = !0), (this._mdf = !1);
                  var n = this.effectsSequence.length,
                    s = t || this.data.d.k[this.keysIndex].s;
                  for (r = 0; r < n; r += 1)
                    s =
                      i !== this.keysIndex
                        ? this.effectsSequence[r](s, s.t)
                        : this.effectsSequence[r](this.currentData, s.t);
                  e !== s && this.setCurrentData(s),
                    (this.v = this.currentData),
                    (this.pv = this.v),
                    (this.lock = !1),
                    (this.frameId = this.elem.globalData.frameId);
                }
              }
            }),
            (gi.prototype.getKeyframeValue = function () {
              for (
                var t = this.data.d.k,
                  e = this.elem.comp.renderedFrame,
                  i = 0,
                  r = t.length;
                i <= r - 1 && !(i === r - 1 || t[i + 1].t > e);

              )
                i += 1;
              return (
                this.keysIndex !== i && (this.keysIndex = i),
                this.data.d.k[this.keysIndex].s
              );
            }),
            (gi.prototype.buildFinalText = function (t) {
              for (
                var e, i, r = [], n = 0, s = t.length, a = !1, o = !1, h = "";
                n < s;

              )
                (a = o),
                  (o = !1),
                  (e = t.charCodeAt(n)),
                  (h = t.charAt(n)),
                  _e.isCombinedCharacter(e)
                    ? (a = !0)
                    : e >= 55296 && e <= 56319
                    ? _e.isRegionalFlag(t, n)
                      ? (h = t.substr(n, 14))
                      : (i = t.charCodeAt(n + 1)) >= 56320 &&
                        i <= 57343 &&
                        (_e.isModifier(e, i)
                          ? ((h = t.substr(n, 2)), (a = !0))
                          : (h = _e.isFlagEmoji(t.substr(n, 4))
                              ? t.substr(n, 4)
                              : t.substr(n, 2)))
                    : e > 56319
                    ? ((i = t.charCodeAt(n + 1)),
                      _e.isVariationSelector(e) && (a = !0))
                    : _e.isZeroWidthJoiner(e) && ((a = !0), (o = !0)),
                  a ? ((r[r.length - 1] += h), (a = !1)) : r.push(h),
                  (n += h.length);
              return r;
            }),
            (gi.prototype.completeTextData = function (t) {
              t.__complete = !0;
              var e,
                i,
                r,
                n,
                s,
                a,
                o,
                h = this.elem.globalData.fontManager,
                l = this.data,
                f = [],
                c = 0,
                u = l.m.g,
                p = 0,
                d = 0,
                m = 0,
                g = [],
                y = 0,
                v = 0,
                b = h.getFontByName(t.f),
                _ = 0,
                w = be(b);
              (t.fWeight = w.weight),
                (t.fStyle = w.style),
                (t.finalSize = t.s),
                (t.finalText = this.buildFinalText(t.t)),
                (i = t.finalText.length),
                (t.finalLineHeight = t.lh);
              var A,
                x = (t.tr / 1e3) * t.finalSize;
              if (t.sz)
                for (var S, k, E = !0, P = t.sz[0], C = t.sz[1]; E; ) {
                  (S = 0),
                    (y = 0),
                    (i = (k = this.buildFinalText(t.t)).length),
                    (x = (t.tr / 1e3) * t.finalSize);
                  var D = -1;
                  for (e = 0; e < i; e += 1)
                    (A = k[e].charCodeAt(0)),
                      (r = !1),
                      " " === k[e]
                        ? (D = e)
                        : (13 !== A && 3 !== A) ||
                          ((y = 0),
                          (r = !0),
                          (S += t.finalLineHeight || 1.2 * t.finalSize)),
                      h.chars
                        ? ((o = h.getCharData(k[e], b.fStyle, b.fFamily)),
                          (_ = r ? 0 : (o.w * t.finalSize) / 100))
                        : (_ = h.measureText(k[e], t.f, t.finalSize)),
                      y + _ > P && " " !== k[e]
                        ? (-1 === D ? (i += 1) : (e = D),
                          (S += t.finalLineHeight || 1.2 * t.finalSize),
                          k.splice(e, D === e ? 1 : 0, "\r"),
                          (D = -1),
                          (y = 0))
                        : ((y += _), (y += x));
                  (S += (b.ascent * t.finalSize) / 100),
                    this.canResize &&
                    t.finalSize > this.minimumFontSize &&
                    C < S
                      ? ((t.finalSize -= 1),
                        (t.finalLineHeight = (t.finalSize * t.lh) / t.s))
                      : ((t.finalText = k), (i = t.finalText.length), (E = !1));
                }
              (y = -x), (_ = 0);
              var M,
                T = 0;
              for (e = 0; e < i; e += 1)
                if (
                  ((r = !1),
                  13 === (A = (M = t.finalText[e]).charCodeAt(0)) || 3 === A
                    ? ((T = 0),
                      g.push(y),
                      (v = y > v ? y : v),
                      (y = -2 * x),
                      (n = ""),
                      (r = !0),
                      (m += 1))
                    : (n = M),
                  h.chars
                    ? ((o = h.getCharData(
                        M,
                        b.fStyle,
                        h.getFontByName(t.f).fFamily
                      )),
                      (_ = r ? 0 : (o.w * t.finalSize) / 100))
                    : (_ = h.measureText(n, t.f, t.finalSize)),
                  " " === M ? (T += _ + x) : ((y += _ + x + T), (T = 0)),
                  f.push({
                    l: _,
                    an: _,
                    add: p,
                    n: r,
                    anIndexes: [],
                    val: n,
                    line: m,
                    animatorJustifyOffset: 0,
                  }),
                  2 == u)
                ) {
                  if (((p += _), "" === n || " " === n || e === i - 1)) {
                    for (("" !== n && " " !== n) || (p -= _); d <= e; )
                      (f[d].an = p), (f[d].ind = c), (f[d].extra = _), (d += 1);
                    (c += 1), (p = 0);
                  }
                } else if (3 == u) {
                  if (((p += _), "" === n || e === i - 1)) {
                    for ("" === n && (p -= _); d <= e; )
                      (f[d].an = p), (f[d].ind = c), (f[d].extra = _), (d += 1);
                    (p = 0), (c += 1);
                  }
                } else (f[c].ind = c), (f[c].extra = 0), (c += 1);
              if (((t.l = f), (v = y > v ? y : v), g.push(y), t.sz))
                (t.boxWidth = t.sz[0]), (t.justifyOffset = 0);
              else
                switch (((t.boxWidth = v), t.j)) {
                  case 1:
                    t.justifyOffset = -t.boxWidth;
                    break;
                  case 2:
                    t.justifyOffset = -t.boxWidth / 2;
                    break;
                  default:
                    t.justifyOffset = 0;
                }
              t.lineWidths = g;
              var F,
                O,
                L,
                I,
                R = l.a;
              a = R.length;
              var j = [];
              for (s = 0; s < a; s += 1) {
                for (
                  (F = R[s]).a.sc && (t.strokeColorAnim = !0),
                    F.a.sw && (t.strokeWidthAnim = !0),
                    (F.a.fc || F.a.fh || F.a.fs || F.a.fb) &&
                      (t.fillColorAnim = !0),
                    I = 0,
                    L = F.s.b,
                    e = 0;
                  e < i;
                  e += 1
                )
                  ((O = f[e]).anIndexes[s] = I),
                    ((1 == L && "" !== O.val) ||
                      (2 == L && "" !== O.val && " " !== O.val) ||
                      (3 == L && (O.n || " " == O.val || e == i - 1)) ||
                      (4 == L && (O.n || e == i - 1))) &&
                      (1 === F.s.rn && j.push(I), (I += 1));
                l.a[s].s.totalChars = I;
                var N,
                  B = -1;
                if (1 === F.s.rn)
                  for (e = 0; e < i; e += 1)
                    B != (O = f[e]).anIndexes[s] &&
                      ((B = O.anIndexes[s]),
                      (N = j.splice(
                        Math.floor(Math.random() * j.length),
                        1
                      )[0])),
                      (O.anIndexes[s] = N);
              }
              (t.yOffset = t.finalLineHeight || 1.2 * t.finalSize),
                (t.ls = t.ls || 0),
                (t.ascent = (b.ascent * t.finalSize) / 100);
            }),
            (gi.prototype.updateDocumentData = function (t, e) {
              e = void 0 === e ? this.keysIndex : e;
              var i = this.copyData({}, this.data.d.k[e].s);
              (i = this.copyData(i, t)),
                (this.data.d.k[e].s = i),
                this.recalculate(e),
                this.setCurrentData(i),
                this.elem.addDynamicProperty(this);
            }),
            (gi.prototype.recalculate = function (t) {
              var e = this.data.d.k[t].s;
              (e.__complete = !1),
                (this.keysIndex = 0),
                (this._isFirstFrame = !0),
                this.getValue(e);
            }),
            (gi.prototype.canResizeFont = function (t) {
              (this.canResize = t),
                this.recalculate(this.keysIndex),
                this.elem.addDynamicProperty(this);
            }),
            (gi.prototype.setMinimumFontSize = function (t) {
              (this.minimumFontSize = Math.floor(t) || 1),
                this.recalculate(this.keysIndex),
                this.elem.addDynamicProperty(this);
            });
          var yi = (function () {
            var t = Math.max,
              e = Math.min,
              i = Math.floor;
            function r(t, e) {
              (this._currentTextLength = -1),
                (this.k = !1),
                (this.data = e),
                (this.elem = t),
                (this.comp = t.comp),
                (this.finalS = 0),
                (this.finalE = 0),
                this.initDynamicPropertyContainer(t),
                (this.s = vt.getProp(t, e.s || { k: 0 }, 0, 0, this)),
                (this.e =
                  "e" in e ? vt.getProp(t, e.e, 0, 0, this) : { v: 100 }),
                (this.o = vt.getProp(t, e.o || { k: 0 }, 0, 0, this)),
                (this.xe = vt.getProp(t, e.xe || { k: 0 }, 0, 0, this)),
                (this.ne = vt.getProp(t, e.ne || { k: 0 }, 0, 0, this)),
                (this.sm = vt.getProp(t, e.sm || { k: 100 }, 0, 0, this)),
                (this.a = vt.getProp(t, e.a, 0, 0.01, this)),
                this.dynamicProperties.length || this.getValue();
            }
            return (
              (r.prototype = {
                getMult: function (r) {
                  this._currentTextLength !==
                    this.elem.textProperty.currentData.l.length &&
                    this.getValue();
                  var n = 0,
                    s = 0,
                    a = 1,
                    o = 1;
                  this.ne.v > 0
                    ? (n = this.ne.v / 100)
                    : (s = -this.ne.v / 100),
                    this.xe.v > 0
                      ? (a = 1 - this.xe.v / 100)
                      : (o = 1 + this.xe.v / 100);
                  var h = et.getBezierEasing(n, s, a, o).get,
                    l = 0,
                    f = this.finalS,
                    c = this.finalE,
                    u = this.data.sh;
                  if (2 === u)
                    l = h(
                      (l =
                        c === f
                          ? r >= c
                            ? 1
                            : 0
                          : t(0, e(0.5 / (c - f) + (r - f) / (c - f), 1)))
                    );
                  else if (3 === u)
                    l = h(
                      (l =
                        c === f
                          ? r >= c
                            ? 0
                            : 1
                          : 1 - t(0, e(0.5 / (c - f) + (r - f) / (c - f), 1)))
                    );
                  else if (4 === u)
                    c === f
                      ? (l = 0)
                      : (l = t(0, e(0.5 / (c - f) + (r - f) / (c - f), 1))) <
                        0.5
                      ? (l *= 2)
                      : (l = 1 - 2 * (l - 0.5)),
                      (l = h(l));
                  else if (5 === u) {
                    if (c === f) l = 0;
                    else {
                      var p = c - f,
                        d = -p / 2 + (r = e(t(0, r + 0.5 - f), c - f)),
                        m = p / 2;
                      l = Math.sqrt(1 - (d * d) / (m * m));
                    }
                    l = h(l);
                  } else
                    6 === u
                      ? (c === f
                          ? (l = 0)
                          : ((r = e(t(0, r + 0.5 - f), c - f)),
                            (l =
                              (1 +
                                Math.cos(
                                  Math.PI + (2 * Math.PI * r) / (c - f)
                                )) /
                              2)),
                        (l = h(l)))
                      : (r >= i(f) &&
                          (l = t(
                            0,
                            e(r - f < 0 ? e(c, 1) - (f - r) : c - r, 1)
                          )),
                        (l = h(l)));
                  if (100 !== this.sm.v) {
                    var g = 0.01 * this.sm.v;
                    0 === g && (g = 1e-8);
                    var y = 0.5 - 0.5 * g;
                    l < y ? (l = 0) : (l = (l - y) / g) > 1 && (l = 1);
                  }
                  return l * this.a.v;
                },
                getValue: function (t) {
                  this.iterateDynamicProperties(),
                    (this._mdf = t || this._mdf),
                    (this._currentTextLength =
                      this.elem.textProperty.currentData.l.length || 0),
                    t &&
                      2 === this.data.r &&
                      (this.e.v = this._currentTextLength);
                  var e = 2 === this.data.r ? 1 : 100 / this.data.totalChars,
                    i = this.o.v / e,
                    r = this.s.v / e + i,
                    n = this.e.v / e + i;
                  if (r > n) {
                    var s = r;
                    (r = n), (n = s);
                  }
                  (this.finalS = r), (this.finalE = n);
                },
              }),
              o([bt], r),
              {
                getTextSelectorProp: function (t, e, i) {
                  return new r(t, e, i);
                },
              }
            );
          })();
          function vi(t, e, i) {
            var r = { propType: !1 },
              n = vt.getProp,
              s = e.a;
            (this.a = {
              r: s.r ? n(t, s.r, 0, S, i) : r,
              rx: s.rx ? n(t, s.rx, 0, S, i) : r,
              ry: s.ry ? n(t, s.ry, 0, S, i) : r,
              sk: s.sk ? n(t, s.sk, 0, S, i) : r,
              sa: s.sa ? n(t, s.sa, 0, S, i) : r,
              s: s.s ? n(t, s.s, 1, 0.01, i) : r,
              a: s.a ? n(t, s.a, 1, 0, i) : r,
              o: s.o ? n(t, s.o, 0, 0.01, i) : r,
              p: s.p ? n(t, s.p, 1, 0, i) : r,
              sw: s.sw ? n(t, s.sw, 0, 0, i) : r,
              sc: s.sc ? n(t, s.sc, 1, 0, i) : r,
              fc: s.fc ? n(t, s.fc, 1, 0, i) : r,
              fh: s.fh ? n(t, s.fh, 0, 0, i) : r,
              fs: s.fs ? n(t, s.fs, 0, 0.01, i) : r,
              fb: s.fb ? n(t, s.fb, 0, 0.01, i) : r,
              t: s.t ? n(t, s.t, 0, 0, i) : r,
            }),
              (this.s = yi.getTextSelectorProp(t, e.s, i)),
              (this.s.t = e.s.t);
          }
          function bi(t, e, i) {
            (this._isFirstFrame = !0),
              (this._hasMaskedPath = !1),
              (this._frameId = -1),
              (this._textData = t),
              (this._renderType = e),
              (this._elem = i),
              (this._animatorsData = c(this._textData.a.length)),
              (this._pathData = {}),
              (this._moreOptions = { alignment: {} }),
              (this.renderedLetters = []),
              (this.lettersChangedFlag = !1),
              this.initDynamicPropertyContainer(i);
          }
          function _i() {}
          (bi.prototype.searchProperties = function () {
            var t,
              e,
              i = this._textData.a.length,
              r = vt.getProp;
            for (t = 0; t < i; t += 1)
              (e = this._textData.a[t]),
                (this._animatorsData[t] = new vi(this._elem, e, this));
            this._textData.p && "m" in this._textData.p
              ? ((this._pathData = {
                  a: r(this._elem, this._textData.p.a, 0, 0, this),
                  f: r(this._elem, this._textData.p.f, 0, 0, this),
                  l: r(this._elem, this._textData.p.l, 0, 0, this),
                  r: r(this._elem, this._textData.p.r, 0, 0, this),
                  p: r(this._elem, this._textData.p.p, 0, 0, this),
                  m: this._elem.maskManager.getMaskProperty(this._textData.p.m),
                }),
                (this._hasMaskedPath = !0))
              : (this._hasMaskedPath = !1),
              (this._moreOptions.alignment = r(
                this._elem,
                this._textData.m.a,
                1,
                0,
                this
              ));
          }),
            (bi.prototype.getMeasures = function (t, e) {
              if (
                ((this.lettersChangedFlag = e),
                this._mdf ||
                  this._isFirstFrame ||
                  e ||
                  (this._hasMaskedPath && this._pathData.m._mdf))
              ) {
                this._isFirstFrame = !1;
                var i,
                  r,
                  n,
                  s,
                  a,
                  o,
                  h,
                  l,
                  f,
                  c,
                  u,
                  p,
                  d,
                  m,
                  g,
                  y,
                  v,
                  b,
                  _,
                  w = this._moreOptions.alignment.v,
                  A = this._animatorsData,
                  x = this._textData,
                  S = this.mHelper,
                  k = this._renderType,
                  E = this.renderedLetters.length,
                  P = t.l;
                if (this._hasMaskedPath) {
                  if (
                    ((_ = this._pathData.m),
                    !this._pathData.n || this._pathData._mdf)
                  ) {
                    var C,
                      D = _.v;
                    for (
                      this._pathData.r.v && (D = D.reverse()),
                        a = { tLength: 0, segments: [] },
                        s = D._length - 1,
                        y = 0,
                        n = 0;
                      n < s;
                      n += 1
                    )
                      (C = at.buildBezierData(
                        D.v[n],
                        D.v[n + 1],
                        [D.o[n][0] - D.v[n][0], D.o[n][1] - D.v[n][1]],
                        [
                          D.i[n + 1][0] - D.v[n + 1][0],
                          D.i[n + 1][1] - D.v[n + 1][1],
                        ]
                      )),
                        (a.tLength += C.segmentLength),
                        a.segments.push(C),
                        (y += C.segmentLength);
                    (n = s),
                      _.v.c &&
                        ((C = at.buildBezierData(
                          D.v[n],
                          D.v[0],
                          [D.o[n][0] - D.v[n][0], D.o[n][1] - D.v[n][1]],
                          [D.i[0][0] - D.v[0][0], D.i[0][1] - D.v[0][1]]
                        )),
                        (a.tLength += C.segmentLength),
                        a.segments.push(C),
                        (y += C.segmentLength)),
                      (this._pathData.pi = a);
                  }
                  if (
                    ((a = this._pathData.pi),
                    (o = this._pathData.f.v),
                    (u = 0),
                    (c = 1),
                    (l = 0),
                    (f = !0),
                    (m = a.segments),
                    o < 0 && _.v.c)
                  )
                    for (
                      a.tLength < Math.abs(o) && (o = -Math.abs(o) % a.tLength),
                        c = (d = m[(u = m.length - 1)].points).length - 1;
                      o < 0;

                    )
                      (o += d[c].partialLength),
                        (c -= 1) < 0 &&
                          (c = (d = m[(u -= 1)].points).length - 1);
                  (p = (d = m[u].points)[c - 1]),
                    (g = (h = d[c]).partialLength);
                }
                (s = P.length), (i = 0), (r = 0);
                var M,
                  T,
                  F,
                  O,
                  L,
                  I = 1.2 * t.finalSize * 0.714,
                  R = !0;
                F = A.length;
                var V,
                  H,
                  z,
                  q,
                  U,
                  W,
                  X,
                  Y,
                  G,
                  $,
                  J,
                  K,
                  Z = -1,
                  Q = o,
                  tt = u,
                  et = c,
                  it = -1,
                  rt = "",
                  nt = this.defaultPropsArray;
                if (2 === t.j || 1 === t.j) {
                  var st = 0,
                    ot = 0,
                    ht = 2 === t.j ? -0.5 : -1,
                    lt = 0,
                    ft = !0;
                  for (n = 0; n < s; n += 1)
                    if (P[n].n) {
                      for (st && (st += ot); lt < n; )
                        (P[lt].animatorJustifyOffset = st), (lt += 1);
                      (st = 0), (ft = !0);
                    } else {
                      for (T = 0; T < F; T += 1)
                        (M = A[T].a).t.propType &&
                          (ft && 2 === t.j && (ot += M.t.v * ht),
                          (L = A[T].s.getMult(
                            P[n].anIndexes[T],
                            x.a[T].s.totalChars
                          )).length
                            ? (st += M.t.v * L[0] * ht)
                            : (st += M.t.v * L * ht));
                      ft = !1;
                    }
                  for (st && (st += ot); lt < n; )
                    (P[lt].animatorJustifyOffset = st), (lt += 1);
                }
                for (n = 0; n < s; n += 1) {
                  if ((S.reset(), (q = 1), P[n].n))
                    (i = 0),
                      (r += t.yOffset),
                      (r += R ? 1 : 0),
                      (o = Q),
                      (R = !1),
                      this._hasMaskedPath &&
                        ((c = et),
                        (p = (d = m[(u = tt)].points)[c - 1]),
                        (g = (h = d[c]).partialLength),
                        (l = 0)),
                      (rt = ""),
                      (J = ""),
                      (G = ""),
                      (K = ""),
                      (nt = this.defaultPropsArray);
                  else {
                    if (this._hasMaskedPath) {
                      if (it !== P[n].line) {
                        switch (t.j) {
                          case 1:
                            o += y - t.lineWidths[P[n].line];
                            break;
                          case 2:
                            o += (y - t.lineWidths[P[n].line]) / 2;
                        }
                        it = P[n].line;
                      }
                      Z !== P[n].ind &&
                        (P[Z] && (o += P[Z].extra),
                        (o += P[n].an / 2),
                        (Z = P[n].ind)),
                        (o += w[0] * P[n].an * 0.005);
                      var ct = 0;
                      for (T = 0; T < F; T += 1)
                        (M = A[T].a).p.propType &&
                          ((L = A[T].s.getMult(
                            P[n].anIndexes[T],
                            x.a[T].s.totalChars
                          )).length
                            ? (ct += M.p.v[0] * L[0])
                            : (ct += M.p.v[0] * L)),
                          M.a.propType &&
                            ((L = A[T].s.getMult(
                              P[n].anIndexes[T],
                              x.a[T].s.totalChars
                            )).length
                              ? (ct += M.a.v[0] * L[0])
                              : (ct += M.a.v[0] * L));
                      for (
                        f = !0,
                          this._pathData.a.v &&
                            ((o =
                              0.5 * P[0].an +
                              ((y -
                                this._pathData.f.v -
                                0.5 * P[0].an -
                                0.5 * P[P.length - 1].an) *
                                Z) /
                                (s - 1)),
                            (o += this._pathData.f.v));
                        f;

                      )
                        l + g >= o + ct || !d
                          ? ((v = (o + ct - l) / h.partialLength),
                            (H = p.point[0] + (h.point[0] - p.point[0]) * v),
                            (z = p.point[1] + (h.point[1] - p.point[1]) * v),
                            S.translate(
                              -w[0] * P[n].an * 0.005,
                              -w[1] * I * 0.01
                            ),
                            (f = !1))
                          : d &&
                            ((l += h.partialLength),
                            (c += 1) >= d.length &&
                              ((c = 0),
                              m[(u += 1)]
                                ? (d = m[u].points)
                                : _.v.c
                                ? ((c = 0), (d = m[(u = 0)].points))
                                : ((l -= h.partialLength), (d = null))),
                            d && ((p = h), (g = (h = d[c]).partialLength)));
                      (V = P[n].an / 2 - P[n].add), S.translate(-V, 0, 0);
                    } else
                      (V = P[n].an / 2 - P[n].add),
                        S.translate(-V, 0, 0),
                        S.translate(
                          -w[0] * P[n].an * 0.005,
                          -w[1] * I * 0.01,
                          0
                        );
                    for (T = 0; T < F; T += 1)
                      (M = A[T].a).t.propType &&
                        ((L = A[T].s.getMult(
                          P[n].anIndexes[T],
                          x.a[T].s.totalChars
                        )),
                        (0 === i && 0 === t.j) ||
                          (this._hasMaskedPath
                            ? L.length
                              ? (o += M.t.v * L[0])
                              : (o += M.t.v * L)
                            : L.length
                            ? (i += M.t.v * L[0])
                            : (i += M.t.v * L)));
                    for (
                      t.strokeWidthAnim && (W = t.sw || 0),
                        t.strokeColorAnim &&
                          (U = t.sc ? [t.sc[0], t.sc[1], t.sc[2]] : [0, 0, 0]),
                        t.fillColorAnim &&
                          t.fc &&
                          (X = [t.fc[0], t.fc[1], t.fc[2]]),
                        T = 0;
                      T < F;
                      T += 1
                    )
                      (M = A[T].a).a.propType &&
                        ((L = A[T].s.getMult(
                          P[n].anIndexes[T],
                          x.a[T].s.totalChars
                        )).length
                          ? S.translate(
                              -M.a.v[0] * L[0],
                              -M.a.v[1] * L[1],
                              M.a.v[2] * L[2]
                            )
                          : S.translate(
                              -M.a.v[0] * L,
                              -M.a.v[1] * L,
                              M.a.v[2] * L
                            ));
                    for (T = 0; T < F; T += 1)
                      (M = A[T].a).s.propType &&
                        ((L = A[T].s.getMult(
                          P[n].anIndexes[T],
                          x.a[T].s.totalChars
                        )).length
                          ? S.scale(
                              1 + (M.s.v[0] - 1) * L[0],
                              1 + (M.s.v[1] - 1) * L[1],
                              1
                            )
                          : S.scale(
                              1 + (M.s.v[0] - 1) * L,
                              1 + (M.s.v[1] - 1) * L,
                              1
                            ));
                    for (T = 0; T < F; T += 1) {
                      if (
                        ((M = A[T].a),
                        (L = A[T].s.getMult(
                          P[n].anIndexes[T],
                          x.a[T].s.totalChars
                        )),
                        M.sk.propType &&
                          (L.length
                            ? S.skewFromAxis(-M.sk.v * L[0], M.sa.v * L[1])
                            : S.skewFromAxis(-M.sk.v * L, M.sa.v * L)),
                        M.r.propType &&
                          (L.length
                            ? S.rotateZ(-M.r.v * L[2])
                            : S.rotateZ(-M.r.v * L)),
                        M.ry.propType &&
                          (L.length
                            ? S.rotateY(M.ry.v * L[1])
                            : S.rotateY(M.ry.v * L)),
                        M.rx.propType &&
                          (L.length
                            ? S.rotateX(M.rx.v * L[0])
                            : S.rotateX(M.rx.v * L)),
                        M.o.propType &&
                          (L.length
                            ? (q += (M.o.v * L[0] - q) * L[0])
                            : (q += (M.o.v * L - q) * L)),
                        t.strokeWidthAnim &&
                          M.sw.propType &&
                          (L.length ? (W += M.sw.v * L[0]) : (W += M.sw.v * L)),
                        t.strokeColorAnim && M.sc.propType)
                      )
                        for (Y = 0; Y < 3; Y += 1)
                          L.length
                            ? (U[Y] += (M.sc.v[Y] - U[Y]) * L[0])
                            : (U[Y] += (M.sc.v[Y] - U[Y]) * L);
                      if (t.fillColorAnim && t.fc) {
                        if (M.fc.propType)
                          for (Y = 0; Y < 3; Y += 1)
                            L.length
                              ? (X[Y] += (M.fc.v[Y] - X[Y]) * L[0])
                              : (X[Y] += (M.fc.v[Y] - X[Y]) * L);
                        M.fh.propType &&
                          (X = L.length
                            ? B(X, M.fh.v * L[0])
                            : B(X, M.fh.v * L)),
                          M.fs.propType &&
                            (X = L.length
                              ? j(X, M.fs.v * L[0])
                              : j(X, M.fs.v * L)),
                          M.fb.propType &&
                            (X = L.length
                              ? N(X, M.fb.v * L[0])
                              : N(X, M.fb.v * L));
                      }
                    }
                    for (T = 0; T < F; T += 1)
                      (M = A[T].a).p.propType &&
                        ((L = A[T].s.getMult(
                          P[n].anIndexes[T],
                          x.a[T].s.totalChars
                        )),
                        this._hasMaskedPath
                          ? L.length
                            ? S.translate(0, M.p.v[1] * L[0], -M.p.v[2] * L[1])
                            : S.translate(0, M.p.v[1] * L, -M.p.v[2] * L)
                          : L.length
                          ? S.translate(
                              M.p.v[0] * L[0],
                              M.p.v[1] * L[1],
                              -M.p.v[2] * L[2]
                            )
                          : S.translate(
                              M.p.v[0] * L,
                              M.p.v[1] * L,
                              -M.p.v[2] * L
                            ));
                    if (
                      (t.strokeWidthAnim && (G = W < 0 ? 0 : W),
                      t.strokeColorAnim &&
                        ($ =
                          "rgb(" +
                          Math.round(255 * U[0]) +
                          "," +
                          Math.round(255 * U[1]) +
                          "," +
                          Math.round(255 * U[2]) +
                          ")"),
                      t.fillColorAnim &&
                        t.fc &&
                        (J =
                          "rgb(" +
                          Math.round(255 * X[0]) +
                          "," +
                          Math.round(255 * X[1]) +
                          "," +
                          Math.round(255 * X[2]) +
                          ")"),
                      this._hasMaskedPath)
                    ) {
                      if (
                        (S.translate(0, -t.ls),
                        S.translate(0, w[1] * I * 0.01 + r, 0),
                        this._pathData.p.v)
                      ) {
                        b =
                          (h.point[1] - p.point[1]) / (h.point[0] - p.point[0]);
                        var ut = (180 * Math.atan(b)) / Math.PI;
                        h.point[0] < p.point[0] && (ut += 180),
                          S.rotate((-ut * Math.PI) / 180);
                      }
                      S.translate(H, z, 0),
                        (o -= w[0] * P[n].an * 0.005),
                        P[n + 1] &&
                          Z !== P[n + 1].ind &&
                          ((o += P[n].an / 2),
                          (o += 0.001 * t.tr * t.finalSize));
                    } else {
                      switch (
                        (S.translate(i, r, 0),
                        t.ps && S.translate(t.ps[0], t.ps[1] + t.ascent, 0),
                        t.j)
                      ) {
                        case 1:
                          S.translate(
                            P[n].animatorJustifyOffset +
                              t.justifyOffset +
                              (t.boxWidth - t.lineWidths[P[n].line]),
                            0,
                            0
                          );
                          break;
                        case 2:
                          S.translate(
                            P[n].animatorJustifyOffset +
                              t.justifyOffset +
                              (t.boxWidth - t.lineWidths[P[n].line]) / 2,
                            0,
                            0
                          );
                      }
                      S.translate(0, -t.ls),
                        S.translate(V, 0, 0),
                        S.translate(w[0] * P[n].an * 0.005, w[1] * I * 0.01, 0),
                        (i += P[n].l + 0.001 * t.tr * t.finalSize);
                    }
                    "html" === k
                      ? (rt = S.toCSS())
                      : "svg" === k
                      ? (rt = S.to2dCSS())
                      : (nt = [
                          S.props[0],
                          S.props[1],
                          S.props[2],
                          S.props[3],
                          S.props[4],
                          S.props[5],
                          S.props[6],
                          S.props[7],
                          S.props[8],
                          S.props[9],
                          S.props[10],
                          S.props[11],
                          S.props[12],
                          S.props[13],
                          S.props[14],
                          S.props[15],
                        ]),
                      (K = q);
                  }
                  E <= n
                    ? ((O = new mi(K, G, $, J, rt, nt)),
                      this.renderedLetters.push(O),
                      (E += 1),
                      (this.lettersChangedFlag = !0))
                    : ((O = this.renderedLetters[n]),
                      (this.lettersChangedFlag =
                        O.update(K, G, $, J, rt, nt) ||
                        this.lettersChangedFlag));
                }
              }
            }),
            (bi.prototype.getValue = function () {
              this._elem.globalData.frameId !== this._frameId &&
                ((this._frameId = this._elem.globalData.frameId),
                this.iterateDynamicProperties());
            }),
            (bi.prototype.mHelper = new Mt()),
            (bi.prototype.defaultPropsArray = []),
            o([bt], bi),
            (_i.prototype.initElement = function (t, e, i) {
              (this.lettersChangedFlag = !0),
                this.initFrame(),
                this.initBaseData(t, e, i),
                (this.textProperty = new gi(this, t.t, this.dynamicProperties)),
                (this.textAnimator = new bi(t.t, this.renderType, this)),
                this.initTransform(t, e, i),
                this.initHierarchy(),
                this.initRenderable(),
                this.initRendererElement(),
                this.createContainerElements(),
                this.createRenderableComponents(),
                this.createContent(),
                this.hide(),
                this.textAnimator.searchProperties(this.dynamicProperties);
            }),
            (_i.prototype.prepareFrame = function (t) {
              (this._mdf = !1),
                this.prepareRenderableFrame(t),
                this.prepareProperties(t, this.isInRange);
            }),
            (_i.prototype.createPathShape = function (t, e) {
              var i,
                r,
                n = e.length,
                s = "";
              for (i = 0; i < n; i += 1)
                "sh" === e[i].ty &&
                  ((r = e[i].ks.k), (s += ui(r, r.i.length, !0, t)));
              return s;
            }),
            (_i.prototype.updateDocumentData = function (t, e) {
              this.textProperty.updateDocumentData(t, e);
            }),
            (_i.prototype.canResizeFont = function (t) {
              this.textProperty.canResizeFont(t);
            }),
            (_i.prototype.setMinimumFontSize = function (t) {
              this.textProperty.setMinimumFontSize(t);
            }),
            (_i.prototype.applyTextPropertiesToMatrix = function (
              t,
              e,
              i,
              r,
              n
            ) {
              switch (
                (t.ps && e.translate(t.ps[0], t.ps[1] + t.ascent, 0),
                e.translate(0, -t.ls, 0),
                t.j)
              ) {
                case 1:
                  e.translate(
                    t.justifyOffset + (t.boxWidth - t.lineWidths[i]),
                    0,
                    0
                  );
                  break;
                case 2:
                  e.translate(
                    t.justifyOffset + (t.boxWidth - t.lineWidths[i]) / 2,
                    0,
                    0
                  );
              }
              e.translate(r, n, 0);
            }),
            (_i.prototype.buildColor = function (t) {
              return (
                "rgb(" +
                Math.round(255 * t[0]) +
                "," +
                Math.round(255 * t[1]) +
                "," +
                Math.round(255 * t[2]) +
                ")"
              );
            }),
            (_i.prototype.emptyProp = new mi()),
            (_i.prototype.destroy = function () {}),
            (_i.prototype.validateText = function () {
              (this.textProperty._mdf || this.textProperty._isFirstFrame) &&
                (this.buildNewText(),
                (this.textProperty._isFirstFrame = !1),
                (this.textProperty._mdf = !1));
            });
          var wi,
            Ai = { shapes: [] };
          function xi(t, e, i) {
            (this.textSpans = []),
              (this.renderType = "svg"),
              this.initElement(t, e, i);
          }
          function Si(t, e, i) {
            this.initElement(t, e, i);
          }
          function ki(t, e, i) {
            this.initFrame(),
              this.initBaseData(t, e, i),
              this.initFrame(),
              this.initTransform(t, e, i),
              this.initHierarchy();
          }
          function Ei() {}
          function Pi() {}
          function Ci(t, e, i) {
            (this.layers = t.layers),
              (this.supports3d = !0),
              (this.completeLayers = !1),
              (this.pendingElements = []),
              (this.elements = this.layers ? c(this.layers.length) : []),
              this.initElement(t, e, i),
              (this.tm = t.tm
                ? vt.getProp(this, t.tm, 0, e.frameRate, this)
                : { _placeholder: !0 });
          }
          function Di(t, e) {
            (this.animationItem = t),
              (this.layers = null),
              (this.renderedFrame = -1),
              (this.svgElement = U("svg"));
            var i = "";
            if (e && e.title) {
              var r = U("title"),
                n = L();
              r.setAttribute("id", n),
                (r.textContent = e.title),
                this.svgElement.appendChild(r),
                (i += n);
            }
            if (e && e.description) {
              var s = U("desc"),
                a = L();
              s.setAttribute("id", a),
                (s.textContent = e.description),
                this.svgElement.appendChild(s),
                (i += " " + a);
            }
            i && this.svgElement.setAttribute("aria-labelledby", i);
            var o = U("defs");
            this.svgElement.appendChild(o);
            var h = U("g");
            this.svgElement.appendChild(h),
              (this.layerElement = h),
              (this.renderConfig = {
                preserveAspectRatio:
                  (e && e.preserveAspectRatio) || "xMidYMid meet",
                imagePreserveAspectRatio:
                  (e && e.imagePreserveAspectRatio) || "xMidYMid slice",
                contentVisibility: (e && e.contentVisibility) || "visible",
                progressiveLoad: (e && e.progressiveLoad) || !1,
                hideOnTransparent: !(e && !1 === e.hideOnTransparent),
                viewBoxOnly: (e && e.viewBoxOnly) || !1,
                viewBoxSize: (e && e.viewBoxSize) || !1,
                className: (e && e.className) || "",
                id: (e && e.id) || "",
                focusable: e && e.focusable,
                filterSize: {
                  width: (e && e.filterSize && e.filterSize.width) || "100%",
                  height: (e && e.filterSize && e.filterSize.height) || "100%",
                  x: (e && e.filterSize && e.filterSize.x) || "0%",
                  y: (e && e.filterSize && e.filterSize.y) || "0%",
                },
                width: e && e.width,
                height: e && e.height,
                runExpressions:
                  !e || void 0 === e.runExpressions || e.runExpressions,
              }),
              (this.globalData = {
                _mdf: !1,
                frameNum: -1,
                defs: o,
                renderConfig: this.renderConfig,
              }),
              (this.elements = []),
              (this.pendingElements = []),
              (this.destroyed = !1),
              (this.rendererType = "svg");
          }
          return (
            o([Ie, He, Ye, Ge, Re, $e, _i], xi),
            (xi.prototype.createContent = function () {
              this.data.singleShape &&
                !this.globalData.fontManager.chars &&
                (this.textContainer = U("text"));
            }),
            (xi.prototype.buildTextContents = function (t) {
              for (var e = 0, i = t.length, r = [], n = ""; e < i; )
                t[e] === String.fromCharCode(13) ||
                t[e] === String.fromCharCode(3)
                  ? (r.push(n), (n = ""))
                  : (n += t[e]),
                  (e += 1);
              return r.push(n), r;
            }),
            (xi.prototype.buildShapeData = function (t, e) {
              if (t.shapes && t.shapes.length) {
                var i = t.shapes[0];
                if (i.it) {
                  var r = i.it[i.it.length - 1];
                  r.s && ((r.s.k[0] = e), (r.s.k[1] = e));
                }
              }
              return t;
            }),
            (xi.prototype.buildNewText = function () {
              var t, e;
              this.addDynamicProperty(this);
              var i = this.textProperty.currentData;
              (this.renderedLetters = c(i ? i.l.length : 0)),
                i.fc
                  ? this.layerElement.setAttribute(
                      "fill",
                      this.buildColor(i.fc)
                    )
                  : this.layerElement.setAttribute("fill", "rgba(0,0,0,0)"),
                i.sc &&
                  (this.layerElement.setAttribute(
                    "stroke",
                    this.buildColor(i.sc)
                  ),
                  this.layerElement.setAttribute("stroke-width", i.sw)),
                this.layerElement.setAttribute("font-size", i.finalSize);
              var r = this.globalData.fontManager.getFontByName(i.f);
              if (r.fClass) this.layerElement.setAttribute("class", r.fClass);
              else {
                this.layerElement.setAttribute("font-family", r.fFamily);
                var n = i.fWeight,
                  s = i.fStyle;
                this.layerElement.setAttribute("font-style", s),
                  this.layerElement.setAttribute("font-weight", n);
              }
              this.layerElement.setAttribute("aria-label", i.t);
              var a,
                o = i.l || [],
                h = !!this.globalData.fontManager.chars;
              e = o.length;
              var l = this.mHelper,
                f = this.data.singleShape,
                u = 0,
                p = 0,
                d = !0,
                m = 0.001 * i.tr * i.finalSize;
              if (!f || h || i.sz) {
                var g,
                  y = this.textSpans.length;
                for (t = 0; t < e; t += 1) {
                  if (
                    (this.textSpans[t] ||
                      (this.textSpans[t] = {
                        span: null,
                        childSpan: null,
                        glyph: null,
                      }),
                    !h || !f || 0 === t)
                  ) {
                    if (
                      ((a =
                        y > t ? this.textSpans[t].span : U(h ? "g" : "text")),
                      y <= t)
                    ) {
                      if (
                        (a.setAttribute("stroke-linecap", "butt"),
                        a.setAttribute("stroke-linejoin", "round"),
                        a.setAttribute("stroke-miterlimit", "4"),
                        (this.textSpans[t].span = a),
                        h)
                      ) {
                        var v = U("g");
                        a.appendChild(v), (this.textSpans[t].childSpan = v);
                      }
                      (this.textSpans[t].span = a),
                        this.layerElement.appendChild(a);
                    }
                    a.style.display = "inherit";
                  }
                  if (
                    (l.reset(),
                    f &&
                      (o[t].n &&
                        ((u = -m),
                        (p += i.yOffset),
                        (p += d ? 1 : 0),
                        (d = !1)),
                      this.applyTextPropertiesToMatrix(i, l, o[t].line, u, p),
                      (u += o[t].l || 0),
                      (u += m)),
                    h)
                  ) {
                    var b;
                    if (
                      1 ===
                      (g = this.globalData.fontManager.getCharData(
                        i.finalText[t],
                        r.fStyle,
                        this.globalData.fontManager.getFontByName(i.f).fFamily
                      )).t
                    )
                      b = new Ci(g.data, this.globalData, this);
                    else {
                      var _ = Ai;
                      g.data &&
                        g.data.shapes &&
                        (_ = this.buildShapeData(g.data, i.finalSize)),
                        (b = new di(_, this.globalData, this));
                    }
                    if (this.textSpans[t].glyph) {
                      var w = this.textSpans[t].glyph;
                      this.textSpans[t].childSpan.removeChild(w.layerElement),
                        w.destroy();
                    }
                    (this.textSpans[t].glyph = b),
                      (b._debug = !0),
                      b.prepareFrame(0),
                      b.renderFrame(),
                      this.textSpans[t].childSpan.appendChild(b.layerElement),
                      1 === g.t &&
                        this.textSpans[t].childSpan.setAttribute(
                          "transform",
                          "scale(" +
                            i.finalSize / 100 +
                            "," +
                            i.finalSize / 100 +
                            ")"
                        );
                  } else
                    f &&
                      a.setAttribute(
                        "transform",
                        "translate(" + l.props[12] + "," + l.props[13] + ")"
                      ),
                      (a.textContent = o[t].val),
                      a.setAttributeNS(
                        "http://www.w3.org/XML/1998/namespace",
                        "xml:space",
                        "preserve"
                      );
                }
                f && a && a.setAttribute("d", "");
              } else {
                var A = this.textContainer,
                  x = "start";
                switch (i.j) {
                  case 1:
                    x = "end";
                    break;
                  case 2:
                    x = "middle";
                    break;
                  default:
                    x = "start";
                }
                A.setAttribute("text-anchor", x),
                  A.setAttribute("letter-spacing", m);
                var S = this.buildTextContents(i.finalText);
                for (
                  e = S.length, p = i.ps ? i.ps[1] + i.ascent : 0, t = 0;
                  t < e;
                  t += 1
                )
                  ((a = this.textSpans[t].span || U("tspan")).textContent =
                    S[t]),
                    a.setAttribute("x", 0),
                    a.setAttribute("y", p),
                    (a.style.display = "inherit"),
                    A.appendChild(a),
                    this.textSpans[t] ||
                      (this.textSpans[t] = { span: null, glyph: null }),
                    (this.textSpans[t].span = a),
                    (p += i.finalLineHeight);
                this.layerElement.appendChild(A);
              }
              for (; t < this.textSpans.length; )
                (this.textSpans[t].span.style.display = "none"), (t += 1);
              this._sizeChanged = !0;
            }),
            (xi.prototype.sourceRectAtTime = function () {
              if (
                (this.prepareFrame(this.comp.renderedFrame - this.data.st),
                this.renderInnerContent(),
                this._sizeChanged)
              ) {
                this._sizeChanged = !1;
                var t = this.layerElement.getBBox();
                this.bbox = {
                  top: t.y,
                  left: t.x,
                  width: t.width,
                  height: t.height,
                };
              }
              return this.bbox;
            }),
            (xi.prototype.getValue = function () {
              var t,
                e,
                i = this.textSpans.length;
              for (
                this.renderedFrame = this.comp.renderedFrame, t = 0;
                t < i;
                t += 1
              )
                (e = this.textSpans[t].glyph) &&
                  (e.prepareFrame(this.comp.renderedFrame - this.data.st),
                  e._mdf && (this._mdf = !0));
            }),
            (xi.prototype.renderInnerContent = function () {
              if (
                (this.validateText(),
                (!this.data.singleShape || this._mdf) &&
                  (this.textAnimator.getMeasures(
                    this.textProperty.currentData,
                    this.lettersChangedFlag
                  ),
                  this.lettersChangedFlag ||
                    this.textAnimator.lettersChangedFlag))
              ) {
                var t, e;
                this._sizeChanged = !0;
                var i,
                  r,
                  n,
                  s = this.textAnimator.renderedLetters,
                  a = this.textProperty.currentData.l;
                for (e = a.length, t = 0; t < e; t += 1)
                  a[t].n ||
                    ((i = s[t]),
                    (r = this.textSpans[t].span),
                    (n = this.textSpans[t].glyph) && n.renderFrame(),
                    i._mdf.m && r.setAttribute("transform", i.m),
                    i._mdf.o && r.setAttribute("opacity", i.o),
                    i._mdf.sw && r.setAttribute("stroke-width", i.sw),
                    i._mdf.sc && r.setAttribute("stroke", i.sc),
                    i._mdf.fc && r.setAttribute("fill", i.fc));
              }
            }),
            o([Je], Si),
            (Si.prototype.createContent = function () {
              var t = U("rect");
              t.setAttribute("width", this.data.sw),
                t.setAttribute("height", this.data.sh),
                t.setAttribute("fill", this.data.sc),
                this.layerElement.appendChild(t);
            }),
            (ki.prototype.prepareFrame = function (t) {
              this.prepareProperties(t, !0);
            }),
            (ki.prototype.renderFrame = function () {}),
            (ki.prototype.getBaseElement = function () {
              return null;
            }),
            (ki.prototype.destroy = function () {}),
            (ki.prototype.sourceRectAtTime = function () {}),
            (ki.prototype.hide = function () {}),
            o([Ie, He, Ge, Re], ki),
            o([Be], Ei),
            (Ei.prototype.createNull = function (t) {
              return new ki(t, this.globalData, this);
            }),
            (Ei.prototype.createShape = function (t) {
              return new di(t, this.globalData, this);
            }),
            (Ei.prototype.createText = function (t) {
              return new xi(t, this.globalData, this);
            }),
            (Ei.prototype.createImage = function (t) {
              return new Je(t, this.globalData, this);
            }),
            (Ei.prototype.createSolid = function (t) {
              return new Si(t, this.globalData, this);
            }),
            (Ei.prototype.configAnimation = function (t) {
              this.svgElement.setAttribute(
                "xmlns",
                "http://www.w3.org/2000/svg"
              ),
                this.svgElement.setAttribute(
                  "xmlns:xlink",
                  "http://www.w3.org/1999/xlink"
                ),
                this.renderConfig.viewBoxSize
                  ? this.svgElement.setAttribute(
                      "viewBox",
                      this.renderConfig.viewBoxSize
                    )
                  : this.svgElement.setAttribute(
                      "viewBox",
                      "0 0 " + t.w + " " + t.h
                    ),
                this.renderConfig.viewBoxOnly ||
                  (this.svgElement.setAttribute("width", t.w),
                  this.svgElement.setAttribute("height", t.h),
                  (this.svgElement.style.width = "100%"),
                  (this.svgElement.style.height = "100%"),
                  (this.svgElement.style.transform = "translate3d(0,0,0)"),
                  (this.svgElement.style.contentVisibility =
                    this.renderConfig.contentVisibility)),
                this.renderConfig.width &&
                  this.svgElement.setAttribute(
                    "width",
                    this.renderConfig.width
                  ),
                this.renderConfig.height &&
                  this.svgElement.setAttribute(
                    "height",
                    this.renderConfig.height
                  ),
                this.renderConfig.className &&
                  this.svgElement.setAttribute(
                    "class",
                    this.renderConfig.className
                  ),
                this.renderConfig.id &&
                  this.svgElement.setAttribute("id", this.renderConfig.id),
                void 0 !== this.renderConfig.focusable &&
                  this.svgElement.setAttribute(
                    "focusable",
                    this.renderConfig.focusable
                  ),
                this.svgElement.setAttribute(
                  "preserveAspectRatio",
                  this.renderConfig.preserveAspectRatio
                ),
                this.animationItem.wrapper.appendChild(this.svgElement);
              var e = this.globalData.defs;
              this.setupGlobalData(t, e),
                (this.globalData.progressiveLoad =
                  this.renderConfig.progressiveLoad),
                (this.data = t);
              var i = U("clipPath"),
                r = U("rect");
              r.setAttribute("width", t.w),
                r.setAttribute("height", t.h),
                r.setAttribute("x", 0),
                r.setAttribute("y", 0);
              var n = L();
              i.setAttribute("id", n),
                i.appendChild(r),
                this.layerElement.setAttribute(
                  "clip-path",
                  "url(" + s() + "#" + n + ")"
                ),
                e.appendChild(i),
                (this.layers = t.layers),
                (this.elements = c(t.layers.length));
            }),
            (Ei.prototype.destroy = function () {
              var t;
              this.animationItem.wrapper &&
                (this.animationItem.wrapper.innerText = ""),
                (this.layerElement = null),
                (this.globalData.defs = null);
              var e = this.layers ? this.layers.length : 0;
              for (t = 0; t < e; t += 1)
                this.elements[t] &&
                  this.elements[t].destroy &&
                  this.elements[t].destroy();
              (this.elements.length = 0),
                (this.destroyed = !0),
                (this.animationItem = null);
            }),
            (Ei.prototype.updateContainerSize = function () {}),
            (Ei.prototype.findIndexByInd = function (t) {
              var e = 0,
                i = this.layers.length;
              for (e = 0; e < i; e += 1) if (this.layers[e].ind === t) return e;
              return -1;
            }),
            (Ei.prototype.buildItem = function (t) {
              var e = this.elements;
              if (!e[t] && 99 !== this.layers[t].ty) {
                e[t] = !0;
                var i = this.createItem(this.layers[t]);
                if (
                  ((e[t] = i),
                  V() &&
                    (0 === this.layers[t].ty &&
                      this.globalData.projectInterface.registerComposition(i),
                    i.initExpressions()),
                  this.appendElementInPos(i, t),
                  this.layers[t].tt)
                ) {
                  var r =
                    "tp" in this.layers[t]
                      ? this.findIndexByInd(this.layers[t].tp)
                      : t - 1;
                  if (-1 === r) return;
                  if (this.elements[r] && !0 !== this.elements[r]) {
                    var n = e[r].getMatte(this.layers[t].tt);
                    i.setMatte(n);
                  } else this.buildItem(r), this.addPendingElement(i);
                }
              }
            }),
            (Ei.prototype.checkPendingElements = function () {
              for (; this.pendingElements.length; ) {
                var t = this.pendingElements.pop();
                if ((t.checkParenting(), t.data.tt))
                  for (var e = 0, i = this.elements.length; e < i; ) {
                    if (this.elements[e] === t) {
                      var r =
                          "tp" in t.data
                            ? this.findIndexByInd(t.data.tp)
                            : e - 1,
                        n = this.elements[r].getMatte(this.layers[e].tt);
                      t.setMatte(n);
                      break;
                    }
                    e += 1;
                  }
              }
            }),
            (Ei.prototype.renderFrame = function (t) {
              if (this.renderedFrame !== t && !this.destroyed) {
                var e;
                null === t
                  ? (t = this.renderedFrame)
                  : (this.renderedFrame = t),
                  (this.globalData.frameNum = t),
                  (this.globalData.frameId += 1),
                  (this.globalData.projectInterface.currentFrame = t),
                  (this.globalData._mdf = !1);
                var i = this.layers.length;
                for (
                  this.completeLayers || this.checkLayers(t), e = i - 1;
                  e >= 0;
                  e -= 1
                )
                  (this.completeLayers || this.elements[e]) &&
                    this.elements[e].prepareFrame(t - this.layers[e].st);
                if (this.globalData._mdf)
                  for (e = 0; e < i; e += 1)
                    (this.completeLayers || this.elements[e]) &&
                      this.elements[e].renderFrame();
              }
            }),
            (Ei.prototype.appendElementInPos = function (t, e) {
              var i = t.getBaseElement();
              if (i) {
                for (var r, n = 0; n < e; )
                  this.elements[n] &&
                    !0 !== this.elements[n] &&
                    this.elements[n].getBaseElement() &&
                    (r = this.elements[n].getBaseElement()),
                    (n += 1);
                r
                  ? this.layerElement.insertBefore(i, r)
                  : this.layerElement.appendChild(i);
              }
            }),
            (Ei.prototype.hide = function () {
              this.layerElement.style.display = "none";
            }),
            (Ei.prototype.show = function () {
              this.layerElement.style.display = "block";
            }),
            o([Ie, He, Ge, Re, $e], Pi),
            (Pi.prototype.initElement = function (t, e, i) {
              this.initFrame(),
                this.initBaseData(t, e, i),
                this.initTransform(t, e, i),
                this.initRenderable(),
                this.initHierarchy(),
                this.initRendererElement(),
                this.createContainerElements(),
                this.createRenderableComponents(),
                (!this.data.xt && e.progressiveLoad) || this.buildAllItems(),
                this.hide();
            }),
            (Pi.prototype.prepareFrame = function (t) {
              if (
                ((this._mdf = !1),
                this.prepareRenderableFrame(t),
                this.prepareProperties(t, this.isInRange),
                this.isInRange || this.data.xt)
              ) {
                if (this.tm._placeholder) this.renderedFrame = t / this.data.sr;
                else {
                  var e = this.tm.v;
                  e === this.data.op && (e = this.data.op - 1),
                    (this.renderedFrame = e);
                }
                var i,
                  r = this.elements.length;
                for (
                  this.completeLayers || this.checkLayers(this.renderedFrame),
                    i = r - 1;
                  i >= 0;
                  i -= 1
                )
                  (this.completeLayers || this.elements[i]) &&
                    (this.elements[i].prepareFrame(
                      this.renderedFrame - this.layers[i].st
                    ),
                    this.elements[i]._mdf && (this._mdf = !0));
              }
            }),
            (Pi.prototype.renderInnerContent = function () {
              var t,
                e = this.layers.length;
              for (t = 0; t < e; t += 1)
                (this.completeLayers || this.elements[t]) &&
                  this.elements[t].renderFrame();
            }),
            (Pi.prototype.setElements = function (t) {
              this.elements = t;
            }),
            (Pi.prototype.getElements = function () {
              return this.elements;
            }),
            (Pi.prototype.destroyElements = function () {
              var t,
                e = this.layers.length;
              for (t = 0; t < e; t += 1)
                this.elements[t] && this.elements[t].destroy();
            }),
            (Pi.prototype.destroy = function () {
              this.destroyElements(), this.destroyBaseElement();
            }),
            o([Ei, Pi, Ye], Ci),
            (Ci.prototype.createComp = function (t) {
              return new Ci(t, this.globalData, this);
            }),
            o([Ei], Di),
            (Di.prototype.createComp = function (t) {
              return new Ci(t, this.globalData, this);
            }),
            (wi = Di),
            (K["svg"] = wi),
            Nt.registerModifier("tm", Vt),
            Nt.registerModifier("pb", Ht),
            Nt.registerModifier("rp", qt),
            Nt.registerModifier("rd", Ut),
            Nt.registerModifier("zz", oe),
            Nt.registerModifier("op", ve),
            Ft
          );
        })());
    },
    b047: function (t, e, i) {
      var r = i("1a8c"),
        n = i("408c"),
        s = i("b4b0"),
        a = Math.max,
        o = Math.min;
      t.exports = function (t, e, i) {
        var h,
          l,
          f,
          c,
          u,
          p,
          d = 0,
          m = !1,
          g = !1,
          y = !0;
        if ("function" != typeof t) throw new TypeError("Expected a function");
        function v(e) {
          var i = h,
            r = l;
          return (h = l = void 0), (d = e), (c = t.apply(r, i));
        }
        function b(t) {
          return (d = t), (u = setTimeout(w, e)), m ? v(t) : c;
        }
        function _(t) {
          var i = t - p;
          return void 0 === p || i >= e || i < 0 || (g && t - d >= f);
        }
        function w() {
          var t = n();
          if (_(t)) return A(t);
          u = setTimeout(
            w,
            (function (t) {
              var i = e - (t - p);
              return g ? o(i, f - (t - d)) : i;
            })(t)
          );
        }
        function A(t) {
          return (u = void 0), y && h ? v(t) : ((h = l = void 0), c);
        }
        function x() {
          var t = n(),
            i = _(t);
          if (((h = arguments), (l = this), (p = t), i)) {
            if (void 0 === u) return b(p);
            if (g) return clearTimeout(u), (u = setTimeout(w, e)), v(p);
          }
          return void 0 === u && (u = setTimeout(w, e)), c;
        }
        return (
          (e = s(e) || 0),
          r(i) &&
            ((m = !!i.leading),
            (f = (g = "maxWait" in i) ? a(s(i.maxWait) || 0, e) : f),
            (y = "trailing" in i ? !!i.trailing : y)),
          (x.cancel = function () {
            void 0 !== u && clearTimeout(u), (d = 0), (h = p = l = u = void 0);
          }),
          (x.flush = function () {
            return void 0 === u ? c : A(n());
          }),
          x
        );
      };
    },
    b313: function (t, e, i) {
      "use strict";
      var r = String.prototype.replace,
        n = /%20/g;
      t.exports = {
        default: "RFC3986",
        formatters: {
          RFC1738: function (t) {
            return r.call(t, n, "+");
          },
          RFC3986: function (t) {
            return String(t);
          },
        },
        RFC1738: "RFC1738",
        RFC3986: "RFC3986",
      };
    },
    b4b0: function (t, e, i) {
      var r = i("8d74"),
        n = i("1a8c"),
        s = i("ffd6"),
        a = /^[-+]0x[0-9a-f]+$/i,
        o = /^0b[01]+$/i,
        h = /^0o[0-7]+$/i,
        l = parseInt;
      t.exports = function (t) {
        if ("number" == typeof t) return t;
        if (s(t)) return NaN;
        if (n(t)) {
          var e = "function" == typeof t.valueOf ? t.valueOf() : t;
          t = n(e) ? e + "" : e;
        }
        if ("string" != typeof t) return 0 === t ? t : +t;
        t = r(t);
        var i = o.test(t);
        return i || h.test(t) ? l(t.slice(2), i ? 2 : 8) : a.test(t) ? NaN : +t;
      };
    },
    b50d: function (t, e, i) {
      "use strict";
      var r = i("c532"),
        n = i("467f"),
        s = i("30b5"),
        a = i("83b9"),
        o = i("c345"),
        h = i("3934"),
        l = i("2d83");
      t.exports = function (t) {
        return new Promise(function (e, f) {
          var c = t.data,
            u = t.headers;
          r.isFormData(c) && delete u["Content-Type"];
          var p = new XMLHttpRequest();
          if (t.auth) {
            var d = t.auth.username || "",
              m = t.auth.password || "";
            u.Authorization = "Basic " + btoa(d + ":" + m);
          }
          var g = a(t.baseURL, t.url);
          if (
            (p.open(
              t.method.toUpperCase(),
              s(g, t.params, t.paramsSerializer),
              !0
            ),
            (p.timeout = t.timeout),
            (p.onreadystatechange = function () {
              if (
                p &&
                4 === p.readyState &&
                (0 !== p.status ||
                  (p.responseURL && 0 === p.responseURL.indexOf("file:")))
              ) {
                var i =
                    "getAllResponseHeaders" in p
                      ? o(p.getAllResponseHeaders())
                      : null,
                  r = {
                    data:
                      t.responseType && "text" !== t.responseType
                        ? p.response
                        : p.responseText,
                    status: p.status,
                    statusText: p.statusText,
                    headers: i,
                    config: t,
                    request: p,
                  };
                n(e, f, r), (p = null);
              }
            }),
            (p.onabort = function () {
              p && (f(l("Request aborted", t, "ECONNABORTED", p)), (p = null));
            }),
            (p.onerror = function () {
              f(l("Network Error", t, null, p)), (p = null);
            }),
            (p.ontimeout = function () {
              var e = "timeout of " + t.timeout + "ms exceeded";
              t.timeoutErrorMessage && (e = t.timeoutErrorMessage),
                f(l(e, t, "ECONNABORTED", p)),
                (p = null);
            }),
            r.isStandardBrowserEnv())
          ) {
            var y = i("7aac"),
              v =
                (t.withCredentials || h(g)) && t.xsrfCookieName
                  ? y.read(t.xsrfCookieName)
                  : void 0;
            v && (u[t.xsrfHeaderName] = v);
          }
          if (
            ("setRequestHeader" in p &&
              r.forEach(u, function (t, e) {
                void 0 === c && "content-type" === e.toLowerCase()
                  ? delete u[e]
                  : p.setRequestHeader(e, t);
              }),
            r.isUndefined(t.withCredentials) ||
              (p.withCredentials = !!t.withCredentials),
            t.responseType)
          )
            try {
              p.responseType = t.responseType;
            } catch (e) {
              if ("json" !== t.responseType) throw e;
            }
          "function" == typeof t.onDownloadProgress &&
            p.addEventListener("progress", t.onDownloadProgress),
            "function" == typeof t.onUploadProgress &&
              p.upload &&
              p.upload.addEventListener("progress", t.onUploadProgress),
            t.cancelToken &&
              t.cancelToken.promise.then(function (t) {
                p && (p.abort(), f(t), (p = null));
              }),
            void 0 === c && (c = null),
            p.send(c);
        });
      };
    },
    bc3a: function (t, e, i) {
      t.exports = i("cee4");
    },
    c31d: function (t, e, i) {
      "use strict";
      function r() {
        return (r = Object.assign
          ? Object.assign.bind()
          : function (t) {
              for (var e = 1; e < arguments.length; e++) {
                var i = arguments[e];
                for (var r in i)
                  Object.prototype.hasOwnProperty.call(i, r) && (t[r] = i[r]);
              }
              return t;
            }).apply(this, arguments);
      }
      i.d(e, "a", function () {
        return r;
      });
    },
    c345: function (t, e, i) {
      "use strict";
      var r = i("c532"),
        n = [
          "age",
          "authorization",
          "content-length",
          "content-type",
          "etag",
          "expires",
          "from",
          "host",
          "if-modified-since",
          "if-unmodified-since",
          "last-modified",
          "location",
          "max-forwards",
          "proxy-authorization",
          "referer",
          "retry-after",
          "user-agent",
        ];
      t.exports = function (t) {
        var e,
          i,
          s,
          a = {};
        return t
          ? (r.forEach(t.split("\n"), function (t) {
              if (
                ((s = t.indexOf(":")),
                (e = r.trim(t.substr(0, s)).toLowerCase()),
                (i = r.trim(t.substr(s + 1))),
                e)
              ) {
                if (a[e] && n.indexOf(e) >= 0) return;
                a[e] =
                  "set-cookie" === e
                    ? (a[e] ? a[e] : []).concat([i])
                    : a[e]
                    ? a[e] + ", " + i
                    : i;
              }
            }),
            a)
          : a;
      };
    },
    c401: function (t, e, i) {
      "use strict";
      var r = i("c532");
      t.exports = function (t, e, i) {
        return (
          r.forEach(i, function (i) {
            t = i(t, e);
          }),
          t
        );
      };
    },
    c532: function (t, e, i) {
      "use strict";
      var r = i("1d2b"),
        n = Object.prototype.toString;
      function s(t) {
        return "[object Array]" === n.call(t);
      }
      function a(t) {
        return void 0 === t;
      }
      function o(t) {
        return null !== t && "object" == typeof t;
      }
      function h(t) {
        return "[object Function]" === n.call(t);
      }
      function l(t, e) {
        if (null != t)
          if (("object" != typeof t && (t = [t]), s(t)))
            for (var i = 0, r = t.length; i < r; i++) e.call(null, t[i], i, t);
          else
            for (var n in t)
              Object.prototype.hasOwnProperty.call(t, n) &&
                e.call(null, t[n], n, t);
      }
      t.exports = {
        isArray: s,
        isArrayBuffer: function (t) {
          return "[object ArrayBuffer]" === n.call(t);
        },
        isBuffer: function (t) {
          return (
            null !== t &&
            !a(t) &&
            null !== t.constructor &&
            !a(t.constructor) &&
            "function" == typeof t.constructor.isBuffer &&
            t.constructor.isBuffer(t)
          );
        },
        isFormData: function (t) {
          return "undefined" != typeof FormData && t instanceof FormData;
        },
        isArrayBufferView: function (t) {
          return "undefined" != typeof ArrayBuffer && ArrayBuffer.isView
            ? ArrayBuffer.isView(t)
            : t && t.buffer && t.buffer instanceof ArrayBuffer;
        },
        isString: function (t) {
          return "string" == typeof t;
        },
        isNumber: function (t) {
          return "number" == typeof t;
        },
        isObject: o,
        isUndefined: a,
        isDate: function (t) {
          return "[object Date]" === n.call(t);
        },
        isFile: function (t) {
          return "[object File]" === n.call(t);
        },
        isBlob: function (t) {
          return "[object Blob]" === n.call(t);
        },
        isFunction: h,
        isStream: function (t) {
          return o(t) && h(t.pipe);
        },
        isURLSearchParams: function (t) {
          return (
            "undefined" != typeof URLSearchParams &&
            t instanceof URLSearchParams
          );
        },
        isStandardBrowserEnv: function () {
          return (
            ("undefined" == typeof navigator ||
              ("ReactNative" !== navigator.product &&
                "NativeScript" !== navigator.product &&
                "NS" !== navigator.product)) &&
            "undefined" != typeof window &&
            "undefined" != typeof document
          );
        },
        forEach: l,
        merge: function t() {
          var e = {};
          function i(i, r) {
            "object" == typeof e[r] && "object" == typeof i
              ? (e[r] = t(e[r], i))
              : (e[r] = i);
          }
          for (var r = 0, n = arguments.length; r < n; r++) l(arguments[r], i);
          return e;
        },
        deepMerge: function t() {
          var e = {};
          function i(i, r) {
            "object" == typeof e[r] && "object" == typeof i
              ? (e[r] = t(e[r], i))
              : (e[r] = "object" == typeof i ? t({}, i) : i);
          }
          for (var r = 0, n = arguments.length; r < n; r++) l(arguments[r], i);
          return e;
        },
        extend: function (t, e, i) {
          return (
            l(e, function (e, n) {
              t[n] = i && "function" == typeof e ? r(e, i) : e;
            }),
            t
          );
        },
        trim: function (t) {
          return t.replace(/^\s*/, "").replace(/\s*$/, "");
        },
      };
    },
    c832: function (t, e, i) {
      (function (e) {
        var i = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
          r = /^\w*$/,
          n = /^\./,
          s =
            /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
          a = /\\(\\)?/g,
          o = /^\[object .+?Constructor\]$/,
          h = "object" == typeof e && e && e.Object === Object && e,
          l = "object" == typeof self && self && self.Object === Object && self,
          f = h || l || Function("return this")();
        var c,
          u = Array.prototype,
          p = Function.prototype,
          d = Object.prototype,
          m = f["__core-js_shared__"],
          g = (c = /[^.]+$/.exec((m && m.keys && m.keys.IE_PROTO) || ""))
            ? "Symbol(src)_1." + c
            : "",
          y = p.toString,
          v = d.hasOwnProperty,
          b = d.toString,
          _ = RegExp(
            "^" +
              y
                .call(v)
                .replace(/[\\^$.*+?()[\]{}|]/g, "\\$&")
                .replace(
                  /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,
                  "$1.*?"
                ) +
              "$"
          ),
          w = f.Symbol,
          A = u.splice,
          x = L(f, "Map"),
          S = L(Object, "create"),
          k = w ? w.prototype : void 0,
          E = k ? k.toString : void 0;
        function P(t) {
          var e = -1,
            i = t ? t.length : 0;
          for (this.clear(); ++e < i; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function C(t) {
          var e = -1,
            i = t ? t.length : 0;
          for (this.clear(); ++e < i; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function D(t) {
          var e = -1,
            i = t ? t.length : 0;
          for (this.clear(); ++e < i; ) {
            var r = t[e];
            this.set(r[0], r[1]);
          }
        }
        function M(t, e) {
          for (var i, r, n = t.length; n--; )
            if ((i = t[n][0]) === (r = e) || (i != i && r != r)) return n;
          return -1;
        }
        function T(t, e) {
          for (
            var n,
              s = 0,
              a = (e = (function (t, e) {
                if (N(t)) return !1;
                var n = typeof t;
                if (
                  "number" == n ||
                  "symbol" == n ||
                  "boolean" == n ||
                  null == t ||
                  V(t)
                )
                  return !0;
                return (
                  r.test(t) || !i.test(t) || (null != e && (t in Object(e)))
                );
              })(e, t)
                ? [e]
                : N((n = e))
                ? n
                : I(n)).length;
            null != t && s < a;

          )
            t = t[R(e[s++])];
          return s && s == a ? t : void 0;
        }
        function F(t) {
          return (
            !(!B(t) || ((e = t), g && g in e)) &&
            ((function (t) {
              var e = B(t) ? b.call(t) : "";
              return (
                "[object Function]" == e || "[object GeneratorFunction]" == e
              );
            })(t) ||
            (function (t) {
              var e = !1;
              if (null != t && "function" != typeof t.toString)
                try {
                  e = !!(t + "");
                } catch (t) {}
              return e;
            })(t)
              ? _
              : o
            ).test(
              (function (t) {
                if (null != t) {
                  try {
                    return y.call(t);
                  } catch (t) {}
                  try {
                    return t + "";
                  } catch (t) {}
                }
                return "";
              })(t)
            )
          );
          var e;
        }
        function O(t, e) {
          var i,
            r,
            n = t.__data__;
          return (
            "string" == (r = typeof (i = e)) ||
            "number" == r ||
            "symbol" == r ||
            "boolean" == r
              ? "__proto__" !== i
              : null === i
          )
            ? n["string" == typeof e ? "string" : "hash"]
            : n.map;
        }
        function L(t, e) {
          var i = (function (t, e) {
            return null == t ? void 0 : t[e];
          })(t, e);
          return F(i) ? i : void 0;
        }
        (P.prototype.clear = function () {
          this.__data__ = S ? S(null) : {};
        }),
          (P.prototype.delete = function (t) {
            return this.has(t) && delete this.__data__[t];
          }),
          (P.prototype.get = function (t) {
            var e = this.__data__;
            if (S) {
              var i = e[t];
              return "__lodash_hash_undefined__" === i ? void 0 : i;
            }
            return v.call(e, t) ? e[t] : void 0;
          }),
          (P.prototype.has = function (t) {
            var e = this.__data__;
            return S ? void 0 !== e[t] : v.call(e, t);
          }),
          (P.prototype.set = function (t, e) {
            return (
              (this.__data__[t] =
                S && void 0 === e ? "__lodash_hash_undefined__" : e),
              this
            );
          }),
          (C.prototype.clear = function () {
            this.__data__ = [];
          }),
          (C.prototype.delete = function (t) {
            var e = this.__data__,
              i = M(e, t);
            return (
              !(i < 0) && (i == e.length - 1 ? e.pop() : A.call(e, i, 1), !0)
            );
          }),
          (C.prototype.get = function (t) {
            var e = this.__data__,
              i = M(e, t);
            return i < 0 ? void 0 : e[i][1];
          }),
          (C.prototype.has = function (t) {
            return M(this.__data__, t) > -1;
          }),
          (C.prototype.set = function (t, e) {
            var i = this.__data__,
              r = M(i, t);
            return r < 0 ? i.push([t, e]) : (i[r][1] = e), this;
          }),
          (D.prototype.clear = function () {
            this.__data__ = {
              hash: new P(),
              map: new (x || C)(),
              string: new P(),
            };
          }),
          (D.prototype.delete = function (t) {
            return O(this, t).delete(t);
          }),
          (D.prototype.get = function (t) {
            return O(this, t).get(t);
          }),
          (D.prototype.has = function (t) {
            return O(this, t).has(t);
          }),
          (D.prototype.set = function (t, e) {
            return O(this, t).set(t, e), this;
          });
        var I = j(function (t) {
          var e;
          t =
            null == (e = t)
              ? ""
              : (function (t) {
                  if ("string" == typeof t) return t;
                  if (V(t)) return E ? E.call(t) : "";
                  var e = t + "";
                  return "0" == e && 1 / t == -1 / 0 ? "-0" : e;
                })(e);
          var i = [];
          return (
            n.test(t) && i.push(""),
            t.replace(s, function (t, e, r, n) {
              i.push(r ? n.replace(a, "$1") : e || t);
            }),
            i
          );
        });
        function R(t) {
          if ("string" == typeof t || V(t)) return t;
          var e = t + "";
          return "0" == e && 1 / t == -1 / 0 ? "-0" : e;
        }
        function j(t, e) {
          if ("function" != typeof t || (e && "function" != typeof e))
            throw new TypeError("Expected a function");
          var i = function () {
            var r = arguments,
              n = e ? e.apply(this, r) : r[0],
              s = i.cache;
            if (s.has(n)) return s.get(n);
            var a = t.apply(this, r);
            return (i.cache = s.set(n, a)), a;
          };
          return (i.cache = new (j.Cache || D)()), i;
        }
        j.Cache = D;
        var N = Array.isArray;
        function B(t) {
          var e = typeof t;
          return !!t && ("object" == e || "function" == e);
        }
        function V(t) {
          return (
            "symbol" == typeof t ||
            ((function (t) {
              return !!t && "object" == typeof t;
            })(t) &&
              "[object Symbol]" == b.call(t))
          );
        }
        t.exports = function (t, e, i) {
          var r = null == t ? void 0 : T(t, e);
          return void 0 === r ? i : r;
        };
      }.call(this, i("c8ba")));
    },
    c8af: function (t, e, i) {
      "use strict";
      var r = i("c532");
      t.exports = function (t, e) {
        r.forEach(t, function (i, r) {
          r !== e &&
            r.toUpperCase() === e.toUpperCase() &&
            ((t[e] = i), delete t[r]);
        });
      };
    },
    cee4: function (t, e, i) {
      "use strict";
      var r = i("c532"),
        n = i("1d2b"),
        s = i("0a06"),
        a = i("4a7b");
      function o(t) {
        var e = new s(t),
          i = n(s.prototype.request, e);
        return r.extend(i, s.prototype, e), r.extend(i, e), i;
      }
      var h = o(i("2444"));
      (h.Axios = s),
        (h.create = function (t) {
          return o(a(h.defaults, t));
        }),
        (h.Cancel = i("7a77")),
        (h.CancelToken = i("8df4")),
        (h.isCancel = i("2e67")),
        (h.all = function (t) {
          return Promise.all(t);
        }),
        (h.spread = i("0df6")),
        (t.exports = h),
        (t.exports.default = h);
    },
    d233: function (t, e, i) {
      "use strict";
      var r = Object.prototype.hasOwnProperty,
        n = (function () {
          for (var t = [], e = 0; e < 256; ++e)
            t.push("%" + ((e < 16 ? "0" : "") + e.toString(16)).toUpperCase());
          return t;
        })(),
        s = function (t, e) {
          for (
            var i = e && e.plainObjects ? Object.create(null) : {}, r = 0;
            r < t.length;
            ++r
          )
            void 0 !== t[r] && (i[r] = t[r]);
          return i;
        };
      t.exports = {
        arrayToObject: s,
        assign: function (t, e) {
          return Object.keys(e).reduce(function (t, i) {
            return (t[i] = e[i]), t;
          }, t);
        },
        compact: function (t) {
          for (
            var e = [{ obj: { o: t }, prop: "o" }], i = [], r = 0;
            r < e.length;
            ++r
          )
            for (
              var n = e[r], s = n.obj[n.prop], a = Object.keys(s), o = 0;
              o < a.length;
              ++o
            ) {
              var h = a[o],
                l = s[h];
              "object" == typeof l &&
                null !== l &&
                -1 === i.indexOf(l) &&
                (e.push({ obj: s, prop: h }), i.push(l));
            }
          return (function (t) {
            for (var e; t.length; ) {
              var i = t.pop();
              if (((e = i.obj[i.prop]), Array.isArray(e))) {
                for (var r = [], n = 0; n < e.length; ++n)
                  void 0 !== e[n] && r.push(e[n]);
                i.obj[i.prop] = r;
              }
            }
            return e;
          })(e);
        },
        decode: function (t) {
          try {
            return decodeURIComponent(t.replace(/\+/g, " "));
          } catch (e) {
            return t;
          }
        },
        encode: function (t) {
          if (0 === t.length) return t;
          for (
            var e = "string" == typeof t ? t : String(t), i = "", r = 0;
            r < e.length;
            ++r
          ) {
            var s = e.charCodeAt(r);
            45 === s ||
            46 === s ||
            95 === s ||
            126 === s ||
            (s >= 48 && s <= 57) ||
            (s >= 65 && s <= 90) ||
            (s >= 97 && s <= 122)
              ? (i += e.charAt(r))
              : s < 128
              ? (i += n[s])
              : s < 2048
              ? (i += n[192 | (s >> 6)] + n[128 | (63 & s)])
              : s < 55296 || s >= 57344
              ? (i +=
                  n[224 | (s >> 12)] +
                  n[128 | ((s >> 6) & 63)] +
                  n[128 | (63 & s)])
              : ((r += 1),
                (s = 65536 + (((1023 & s) << 10) | (1023 & e.charCodeAt(r)))),
                (i +=
                  n[240 | (s >> 18)] +
                  n[128 | ((s >> 12) & 63)] +
                  n[128 | ((s >> 6) & 63)] +
                  n[128 | (63 & s)]));
          }
          return i;
        },
        isBuffer: function (t) {
          return (
            null != t &&
            !!(
              t.constructor &&
              t.constructor.isBuffer &&
              t.constructor.isBuffer(t)
            )
          );
        },
        isRegExp: function (t) {
          return "[object RegExp]" === Object.prototype.toString.call(t);
        },
        merge: function t(e, i, n) {
          if (!i) return e;
          if ("object" != typeof i) {
            if (Array.isArray(e)) e.push(i);
            else {
              if (!e || "object" != typeof e) return [e, i];
              ((n && (n.plainObjects || n.allowPrototypes)) ||
                !r.call(Object.prototype, i)) &&
                (e[i] = !0);
            }
            return e;
          }
          if (!e || "object" != typeof e) return [e].concat(i);
          var a = e;
          return (
            Array.isArray(e) && !Array.isArray(i) && (a = s(e, n)),
            Array.isArray(e) && Array.isArray(i)
              ? (i.forEach(function (i, s) {
                  if (r.call(e, s)) {
                    var a = e[s];
                    a && "object" == typeof a && i && "object" == typeof i
                      ? (e[s] = t(a, i, n))
                      : e.push(i);
                  } else e[s] = i;
                }),
                e)
              : Object.keys(i).reduce(function (e, s) {
                  var a = i[s];
                  return r.call(e, s) ? (e[s] = t(e[s], a, n)) : (e[s] = a), e;
                }, a)
          );
        },
      };
    },
    d604: function (t, e, i) {
      var r = i("502b").stringify,
        n = i("48b1");
      (t.exports = function (t) {
        return { parse: n(t), stringify: r };
      }),
        (t.exports.parse = n()),
        (t.exports.stringify = r);
    },
    d925: function (t, e, i) {
      "use strict";
      t.exports = function (t) {
        return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(t);
      };
    },
    dcf3: function (t, e, i) {
      "use strict";
      i.d(e, "a", function () {
        return u;
      }),
        i.d(e, "b", function () {
          return p;
        }),
        i.d(e, "c", function () {
          return j;
        }),
        i.d(e, "d", function () {
          return y;
        }),
        i.d(e, "e", function () {
          return Y;
        }),
        i.d(e, "f", function () {
          return W;
        }),
        i.d(e, "g", function () {
          return D;
        }),
        i.d(e, "h", function () {
          return M;
        }),
        i.d(e, "i", function () {
          return R;
        }),
        i.d(e, "j", function () {
          return T;
        }),
        i.d(e, "k", function () {
          return X;
        }),
        i.d(e, "l", function () {
          return g;
        }),
        i.d(e, "m", function () {
          return F;
        }),
        i.d(e, "n", function () {
          return I;
        }),
        i.d(e, "o", function () {
          return L;
        }),
        i.d(e, "p", function () {
          return B;
        }),
        i.d(e, "q", function () {
          return V;
        }),
        i.d(e, "r", function () {
          return A;
        }),
        i.d(e, "s", function () {
          return P;
        }),
        i.d(e, "t", function () {
          return w;
        }),
        i.d(e, "u", function () {
          return E;
        }),
        i.d(e, "v", function () {
          return k;
        }),
        i.d(e, "w", function () {
          return q;
        }),
        i.d(e, "x", function () {
          return U;
        }),
        i.d(e, "y", function () {
          return N;
        }),
        i.d(e, "z", function () {
          return H;
        }),
        i.d(e, "A", function () {
          return z;
        }),
        i.d(e, "B", function () {
          return G;
        }),
        i.d(e, "C", function () {
          return v;
        }),
        i.d(e, "D", function () {
          return d;
        }),
        i.d(e, "E", function () {
          return C;
        }),
        i.d(e, "F", function () {
          return O;
        }),
        i.d(e, "G", function () {
          return m;
        }),
        i.d(e, "H", function () {
          return b;
        }),
        i.d(e, "I", function () {
          return _;
        }),
        i.d(e, "J", function () {
          return S;
        }),
        i.d(e, "K", function () {
          return x;
        });
      var r = i("ff17");
      function n(t) {
        return (n = Object.setPrototypeOf
          ? Object.getPrototypeOf
          : function (t) {
              return t.__proto__ || Object.getPrototypeOf(t);
            })(t);
      }
      function s(t, e) {
        return (s =
          Object.setPrototypeOf ||
          function (t, e) {
            return (t.__proto__ = e), t;
          })(t, e);
      }
      function a() {
        if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
        if (Reflect.construct.sham) return !1;
        if ("function" == typeof Proxy) return !0;
        try {
          return (
            Date.prototype.toString.call(
              Reflect.construct(Date, [], function () {})
            ),
            !0
          );
        } catch (t) {
          return !1;
        }
      }
      function o(t, e, i) {
        return (o = a()
          ? Reflect.construct
          : function (t, e, i) {
              var r = [null];
              r.push.apply(r, e);
              var n = new (Function.bind.apply(t, r))();
              return i && s(n, i.prototype), n;
            }).apply(null, arguments);
      }
      function h(t) {
        var e = "function" == typeof Map ? new Map() : void 0;
        return (h = function (t) {
          if (
            null === t ||
            ((i = t), -1 === Function.toString.call(i).indexOf("[native code]"))
          )
            return t;
          var i;
          if ("function" != typeof t)
            throw new TypeError(
              "Super expression must either be null or a function"
            );
          if (void 0 !== e) {
            if (e.has(t)) return e.get(t);
            e.set(t, r);
          }
          function r() {
            return o(t, arguments, n(this).constructor);
          }
          return (
            (r.prototype = Object.create(t.prototype, {
              constructor: {
                value: r,
                enumerable: !1,
                writable: !0,
                configurable: !0,
              },
            })),
            s(r, t)
          );
        })(t);
      }
      var l = (function (t) {
        var e, i;
        function r(e) {
          var i, r, n;
          return (
            (i = t.call.apply(t, [this].concat(e)) || this),
            (r = (function (t) {
              if (void 0 === t)
                throw new ReferenceError(
                  "this hasn't been initialised - super() hasn't been called"
                );
              return t;
            })(i)),
            (n = r.__proto__),
            Object.defineProperty(r, "__proto__", {
              get: function () {
                return n;
              },
              set: function (t) {
                n.__proto__ = t;
              },
            }),
            i
          );
        }
        return (
          (i = t),
          ((e = r).prototype = Object.create(i.prototype)),
          (e.prototype.constructor = e),
          (e.__proto__ = i),
          r
        );
      })(h(Array));
      function f(t) {
        void 0 === t && (t = []);
        var e = [];
        return (
          t.forEach(function (t) {
            Array.isArray(t) ? e.push.apply(e, f(t)) : e.push(t);
          }),
          e
        );
      }
      function c(t, e) {
        return Array.prototype.filter.call(t, e);
      }
      function u(t, e) {
        var i = Object(r.b)(),
          n = Object(r.a)(),
          s = [];
        if (!e && t instanceof l) return t;
        if (!t) return new l(s);
        if ("string" == typeof t) {
          var a = t.trim();
          if (a.indexOf("<") >= 0 && a.indexOf(">") >= 0) {
            var o = "div";
            0 === a.indexOf("<li") && (o = "ul"),
              0 === a.indexOf("<tr") && (o = "tbody"),
              (0 !== a.indexOf("<td") && 0 !== a.indexOf("<th")) || (o = "tr"),
              0 === a.indexOf("<tbody") && (o = "table"),
              0 === a.indexOf("<option") && (o = "select");
            var h = n.createElement(o);
            h.innerHTML = a;
            for (var f = 0; f < h.childNodes.length; f += 1)
              s.push(h.childNodes[f]);
          } else
            s = (function (t, e) {
              if ("string" != typeof t) return [t];
              for (
                var i = [], r = e.querySelectorAll(t), n = 0;
                n < r.length;
                n += 1
              )
                i.push(r[n]);
              return i;
            })(t.trim(), e || n);
        } else if (t.nodeType || t === i || t === n) s.push(t);
        else if (Array.isArray(t)) {
          if (t instanceof l) return t;
          s = t;
        }
        return new l(
          (function (t) {
            for (var e = [], i = 0; i < t.length; i += 1)
              -1 === e.indexOf(t[i]) && e.push(t[i]);
            return e;
          })(s)
        );
      }
      function p() {
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
          e[i] = arguments[i];
        var r = f(
          e.map(function (t) {
            return t.split(" ");
          })
        );
        return (
          this.forEach(function (t) {
            var e;
            (e = t.classList).add.apply(e, r);
          }),
          this
        );
      }
      function d() {
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
          e[i] = arguments[i];
        var r = f(
          e.map(function (t) {
            return t.split(" ");
          })
        );
        return (
          this.forEach(function (t) {
            var e;
            (e = t.classList).remove.apply(e, r);
          }),
          this
        );
      }
      function m() {
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
          e[i] = arguments[i];
        var r = f(
          e.map(function (t) {
            return t.split(" ");
          })
        );
        this.forEach(function (t) {
          r.forEach(function (e) {
            t.classList.toggle(e);
          });
        });
      }
      function g() {
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
          e[i] = arguments[i];
        var r = f(
          e.map(function (t) {
            return t.split(" ");
          })
        );
        return (
          c(this, function (t) {
            return (
              r.filter(function (e) {
                return t.classList.contains(e);
              }).length > 0
            );
          }).length > 0
        );
      }
      function y(t, e) {
        if (1 === arguments.length && "string" == typeof t)
          return this[0] ? this[0].getAttribute(t) : void 0;
        for (var i = 0; i < this.length; i += 1)
          if (2 === arguments.length) this[i].setAttribute(t, e);
          else
            for (var r in t) (this[i][r] = t[r]), this[i].setAttribute(r, t[r]);
        return this;
      }
      function v(t) {
        for (var e = 0; e < this.length; e += 1) this[e].removeAttribute(t);
        return this;
      }
      function b(t) {
        for (var e = 0; e < this.length; e += 1) this[e].style.transform = t;
        return this;
      }
      function _(t) {
        for (var e = 0; e < this.length; e += 1)
          this[e].style.transitionDuration =
            "string" != typeof t ? t + "ms" : t;
        return this;
      }
      function w() {
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
          e[i] = arguments[i];
        var r = e[0],
          n = e[1],
          s = e[2],
          a = e[3];
        function o(t) {
          var e = t.target;
          if (e) {
            var i = t.target.dom7EventData || [];
            if ((i.indexOf(t) < 0 && i.unshift(t), u(e).is(n))) s.apply(e, i);
            else
              for (var r = u(e).parents(), a = 0; a < r.length; a += 1)
                u(r[a]).is(n) && s.apply(r[a], i);
          }
        }
        function h(t) {
          var e = (t && t.target && t.target.dom7EventData) || [];
          e.indexOf(t) < 0 && e.unshift(t), s.apply(this, e);
        }
        "function" == typeof e[1] &&
          ((r = e[0]), (s = e[1]), (a = e[2]), (n = void 0)),
          a || (a = !1);
        for (var l, f = r.split(" "), c = 0; c < this.length; c += 1) {
          var p = this[c];
          if (n)
            for (l = 0; l < f.length; l += 1) {
              var d = f[l];
              p.dom7LiveListeners || (p.dom7LiveListeners = {}),
                p.dom7LiveListeners[d] || (p.dom7LiveListeners[d] = []),
                p.dom7LiveListeners[d].push({ listener: s, proxyListener: o }),
                p.addEventListener(d, o, a);
            }
          else
            for (l = 0; l < f.length; l += 1) {
              var m = f[l];
              p.dom7Listeners || (p.dom7Listeners = {}),
                p.dom7Listeners[m] || (p.dom7Listeners[m] = []),
                p.dom7Listeners[m].push({ listener: s, proxyListener: h }),
                p.addEventListener(m, h, a);
            }
        }
        return this;
      }
      function A() {
        for (var t = arguments.length, e = new Array(t), i = 0; i < t; i++)
          e[i] = arguments[i];
        var r = e[0],
          n = e[1],
          s = e[2],
          a = e[3];
        "function" == typeof e[1] &&
          ((r = e[0]), (s = e[1]), (a = e[2]), (n = void 0)),
          a || (a = !1);
        for (var o = r.split(" "), h = 0; h < o.length; h += 1)
          for (var l = o[h], f = 0; f < this.length; f += 1) {
            var c = this[f],
              u = void 0;
            if (
              (!n && c.dom7Listeners
                ? (u = c.dom7Listeners[l])
                : n && c.dom7LiveListeners && (u = c.dom7LiveListeners[l]),
              u && u.length)
            )
              for (var p = u.length - 1; p >= 0; p -= 1) {
                var d = u[p];
                (s && d.listener === s) ||
                (s &&
                  d.listener &&
                  d.listener.dom7proxy &&
                  d.listener.dom7proxy === s)
                  ? (c.removeEventListener(l, d.proxyListener, a),
                    u.splice(p, 1))
                  : s ||
                    (c.removeEventListener(l, d.proxyListener, a),
                    u.splice(p, 1));
              }
          }
        return this;
      }
      function x() {
        for (
          var t = Object(r.b)(), e = arguments.length, i = new Array(e), n = 0;
          n < e;
          n++
        )
          i[n] = arguments[n];
        for (var s = i[0].split(" "), a = i[1], o = 0; o < s.length; o += 1)
          for (var h = s[o], l = 0; l < this.length; l += 1) {
            var f = this[l];
            if (t.CustomEvent) {
              var c = new t.CustomEvent(h, {
                detail: a,
                bubbles: !0,
                cancelable: !0,
              });
              (f.dom7EventData = i.filter(function (t, e) {
                return e > 0;
              })),
                f.dispatchEvent(c),
                (f.dom7EventData = []),
                delete f.dom7EventData;
            }
          }
        return this;
      }
      function S(t) {
        var e = this;
        return (
          t &&
            e.on("transitionend", function i(r) {
              r.target === this && (t.call(this, r), e.off("transitionend", i));
            }),
          this
        );
      }
      function k(t) {
        if (this.length > 0) {
          if (t) {
            var e = this.styles();
            return (
              this[0].offsetWidth +
              parseFloat(e.getPropertyValue("margin-right")) +
              parseFloat(e.getPropertyValue("margin-left"))
            );
          }
          return this[0].offsetWidth;
        }
        return null;
      }
      function E(t) {
        if (this.length > 0) {
          if (t) {
            var e = this.styles();
            return (
              this[0].offsetHeight +
              parseFloat(e.getPropertyValue("margin-top")) +
              parseFloat(e.getPropertyValue("margin-bottom"))
            );
          }
          return this[0].offsetHeight;
        }
        return null;
      }
      function P() {
        if (this.length > 0) {
          var t = Object(r.b)(),
            e = Object(r.a)(),
            i = this[0],
            n = i.getBoundingClientRect(),
            s = e.body,
            a = i.clientTop || s.clientTop || 0,
            o = i.clientLeft || s.clientLeft || 0,
            h = i === t ? t.scrollY : i.scrollTop,
            l = i === t ? t.scrollX : i.scrollLeft;
          return { top: n.top + h - a, left: n.left + l - o };
        }
        return null;
      }
      function C() {
        var t = Object(r.b)();
        return this[0] ? t.getComputedStyle(this[0], null) : {};
      }
      function D(t, e) {
        var i,
          n = Object(r.b)();
        if (1 === arguments.length) {
          if ("string" != typeof t) {
            for (i = 0; i < this.length; i += 1)
              for (var s in t) this[i].style[s] = t[s];
            return this;
          }
          if (this[0])
            return n.getComputedStyle(this[0], null).getPropertyValue(t);
        }
        if (2 === arguments.length && "string" == typeof t) {
          for (i = 0; i < this.length; i += 1) this[i].style[t] = e;
          return this;
        }
        return this;
      }
      function M(t) {
        return t
          ? (this.forEach(function (e, i) {
              t.apply(e, [e, i]);
            }),
            this)
          : this;
      }
      function T(t) {
        return u(c(this, t));
      }
      function F(t) {
        if (void 0 === t) return this[0] ? this[0].innerHTML : null;
        for (var e = 0; e < this.length; e += 1) this[e].innerHTML = t;
        return this;
      }
      function O(t) {
        if (void 0 === t) return this[0] ? this[0].textContent.trim() : null;
        for (var e = 0; e < this.length; e += 1) this[e].textContent = t;
        return this;
      }
      function L(t) {
        var e,
          i,
          n = Object(r.b)(),
          s = Object(r.a)(),
          a = this[0];
        if (!a || void 0 === t) return !1;
        if ("string" == typeof t) {
          if (a.matches) return a.matches(t);
          if (a.webkitMatchesSelector) return a.webkitMatchesSelector(t);
          if (a.msMatchesSelector) return a.msMatchesSelector(t);
          for (e = u(t), i = 0; i < e.length; i += 1) if (e[i] === a) return !0;
          return !1;
        }
        if (t === s) return a === s;
        if (t === n) return a === n;
        if (t.nodeType || t instanceof l) {
          for (e = t.nodeType ? [t] : t, i = 0; i < e.length; i += 1)
            if (e[i] === a) return !0;
          return !1;
        }
        return !1;
      }
      function I() {
        var t,
          e = this[0];
        if (e) {
          for (t = 0; null !== (e = e.previousSibling); )
            1 === e.nodeType && (t += 1);
          return t;
        }
      }
      function R(t) {
        if (void 0 === t) return this;
        var e = this.length;
        if (t > e - 1) return u([]);
        if (t < 0) {
          var i = e + t;
          return u(i < 0 ? [] : [this[i]]);
        }
        return u([this[t]]);
      }
      function j() {
        for (var t, e = Object(r.a)(), i = 0; i < arguments.length; i += 1) {
          t = i < 0 || arguments.length <= i ? void 0 : arguments[i];
          for (var n = 0; n < this.length; n += 1)
            if ("string" == typeof t) {
              var s = e.createElement("div");
              for (s.innerHTML = t; s.firstChild; )
                this[n].appendChild(s.firstChild);
            } else if (t instanceof l)
              for (var a = 0; a < t.length; a += 1) this[n].appendChild(t[a]);
            else this[n].appendChild(t);
        }
        return this;
      }
      function N(t) {
        var e,
          i,
          n = Object(r.a)();
        for (e = 0; e < this.length; e += 1)
          if ("string" == typeof t) {
            var s = n.createElement("div");
            for (s.innerHTML = t, i = s.childNodes.length - 1; i >= 0; i -= 1)
              this[e].insertBefore(s.childNodes[i], this[e].childNodes[0]);
          } else if (t instanceof l)
            for (i = 0; i < t.length; i += 1)
              this[e].insertBefore(t[i], this[e].childNodes[0]);
          else this[e].insertBefore(t, this[e].childNodes[0]);
        return this;
      }
      function B(t) {
        return this.length > 0
          ? t
            ? this[0].nextElementSibling && u(this[0].nextElementSibling).is(t)
              ? u([this[0].nextElementSibling])
              : u([])
            : this[0].nextElementSibling
            ? u([this[0].nextElementSibling])
            : u([])
          : u([]);
      }
      function V(t) {
        var e = [],
          i = this[0];
        if (!i) return u([]);
        for (; i.nextElementSibling; ) {
          var r = i.nextElementSibling;
          t ? u(r).is(t) && e.push(r) : e.push(r), (i = r);
        }
        return u(e);
      }
      function H(t) {
        if (this.length > 0) {
          var e = this[0];
          return t
            ? e.previousElementSibling && u(e.previousElementSibling).is(t)
              ? u([e.previousElementSibling])
              : u([])
            : e.previousElementSibling
            ? u([e.previousElementSibling])
            : u([]);
        }
        return u([]);
      }
      function z(t) {
        var e = [],
          i = this[0];
        if (!i) return u([]);
        for (; i.previousElementSibling; ) {
          var r = i.previousElementSibling;
          t ? u(r).is(t) && e.push(r) : e.push(r), (i = r);
        }
        return u(e);
      }
      function q(t) {
        for (var e = [], i = 0; i < this.length; i += 1)
          null !== this[i].parentNode &&
            (t
              ? u(this[i].parentNode).is(t) && e.push(this[i].parentNode)
              : e.push(this[i].parentNode));
        return u(e);
      }
      function U(t) {
        for (var e = [], i = 0; i < this.length; i += 1)
          for (var r = this[i].parentNode; r; )
            t ? u(r).is(t) && e.push(r) : e.push(r), (r = r.parentNode);
        return u(e);
      }
      function W(t) {
        var e = this;
        return void 0 === t ? u([]) : (e.is(t) || (e = e.parents(t).eq(0)), e);
      }
      function X(t) {
        for (var e = [], i = 0; i < this.length; i += 1)
          for (var r = this[i].querySelectorAll(t), n = 0; n < r.length; n += 1)
            e.push(r[n]);
        return u(e);
      }
      function Y(t) {
        for (var e = [], i = 0; i < this.length; i += 1)
          for (var r = this[i].children, n = 0; n < r.length; n += 1)
            (t && !u(r[n]).is(t)) || e.push(r[n]);
        return u(e);
      }
      function G() {
        for (var t = 0; t < this.length; t += 1)
          this[t].parentNode && this[t].parentNode.removeChild(this[t]);
        return this;
      }
      u.fn = l.prototype;
      var $ = "resize scroll".split(" ");
      function J(t) {
        return function () {
          for (var e = arguments.length, i = new Array(e), r = 0; r < e; r++)
            i[r] = arguments[r];
          if (void 0 === i[0]) {
            for (var n = 0; n < this.length; n += 1)
              $.indexOf(t) < 0 &&
                (t in this[n] ? this[n][t]() : u(this[n]).trigger(t));
            return this;
          }
          return this.on.apply(this, [t].concat(i));
        };
      }
      J("click"),
        J("blur"),
        J("focus"),
        J("focusin"),
        J("focusout"),
        J("keyup"),
        J("keydown"),
        J("keypress"),
        J("submit"),
        J("change"),
        J("mousedown"),
        J("mousemove"),
        J("mouseup"),
        J("mouseenter"),
        J("mouseleave"),
        J("mouseout"),
        J("mouseover"),
        J("touchstart"),
        J("touchend"),
        J("touchmove"),
        J("resize"),
        J("scroll");
    },
    df7c: function (t, e, i) {
      (function (t) {
        function i(t, e) {
          for (var i = 0, r = t.length - 1; r >= 0; r--) {
            var n = t[r];
            "." === n
              ? t.splice(r, 1)
              : ".." === n
              ? (t.splice(r, 1), i++)
              : i && (t.splice(r, 1), i--);
          }
          if (e) for (; i--; i) t.unshift("..");
          return t;
        }
        function r(t, e) {
          if (t.filter) return t.filter(e);
          for (var i = [], r = 0; r < t.length; r++)
            e(t[r], r, t) && i.push(t[r]);
          return i;
        }
        (e.resolve = function () {
          for (
            var e = "", n = !1, s = arguments.length - 1;
            s >= -1 && !n;
            s--
          ) {
            var a = s >= 0 ? arguments[s] : t.cwd();
            if ("string" != typeof a)
              throw new TypeError("Arguments to path.resolve must be strings");
            a && ((e = a + "/" + e), (n = "/" === a.charAt(0)));
          }
          return (
            (n ? "/" : "") +
              (e = i(
                r(e.split("/"), function (t) {
                  return !!t;
                }),
                !n
              ).join("/")) || "."
          );
        }),
          (e.normalize = function (t) {
            var s = e.isAbsolute(t),
              a = "/" === n(t, -1);
            return (
              (t = i(
                r(t.split("/"), function (t) {
                  return !!t;
                }),
                !s
              ).join("/")) ||
                s ||
                (t = "."),
              t && a && (t += "/"),
              (s ? "/" : "") + t
            );
          }),
          (e.isAbsolute = function (t) {
            return "/" === t.charAt(0);
          }),
          (e.join = function () {
            var t = Array.prototype.slice.call(arguments, 0);
            return e.normalize(
              r(t, function (t, e) {
                if ("string" != typeof t)
                  throw new TypeError("Arguments to path.join must be strings");
                return t;
              }).join("/")
            );
          }),
          (e.relative = function (t, i) {
            function r(t) {
              for (var e = 0; e < t.length && "" === t[e]; e++);
              for (var i = t.length - 1; i >= 0 && "" === t[i]; i--);
              return e > i ? [] : t.slice(e, i - e + 1);
            }
            (t = e.resolve(t).substr(1)), (i = e.resolve(i).substr(1));
            for (
              var n = r(t.split("/")),
                s = r(i.split("/")),
                a = Math.min(n.length, s.length),
                o = a,
                h = 0;
              h < a;
              h++
            )
              if (n[h] !== s[h]) {
                o = h;
                break;
              }
            var l = [];
            for (h = o; h < n.length; h++) l.push("..");
            return (l = l.concat(s.slice(o))).join("/");
          }),
          (e.sep = "/"),
          (e.delimiter = ":"),
          (e.dirname = function (t) {
            if (("string" != typeof t && (t += ""), 0 === t.length)) return ".";
            for (
              var e = t.charCodeAt(0),
                i = 47 === e,
                r = -1,
                n = !0,
                s = t.length - 1;
              s >= 1;
              --s
            )
              if (47 === (e = t.charCodeAt(s))) {
                if (!n) {
                  r = s;
                  break;
                }
              } else n = !1;
            return -1 === r
              ? i
                ? "/"
                : "."
              : i && 1 === r
              ? "/"
              : t.slice(0, r);
          }),
          (e.basename = function (t, e) {
            var i = (function (t) {
              "string" != typeof t && (t += "");
              var e,
                i = 0,
                r = -1,
                n = !0;
              for (e = t.length - 1; e >= 0; --e)
                if (47 === t.charCodeAt(e)) {
                  if (!n) {
                    i = e + 1;
                    break;
                  }
                } else -1 === r && ((n = !1), (r = e + 1));
              return -1 === r ? "" : t.slice(i, r);
            })(t);
            return (
              e &&
                i.substr(-1 * e.length) === e &&
                (i = i.substr(0, i.length - e.length)),
              i
            );
          }),
          (e.extname = function (t) {
            "string" != typeof t && (t += "");
            for (
              var e = -1, i = 0, r = -1, n = !0, s = 0, a = t.length - 1;
              a >= 0;
              --a
            ) {
              var o = t.charCodeAt(a);
              if (47 !== o)
                -1 === r && ((n = !1), (r = a + 1)),
                  46 === o
                    ? -1 === e
                      ? (e = a)
                      : 1 !== s && (s = 1)
                    : -1 !== e && (s = -1);
              else if (!n) {
                i = a + 1;
                break;
              }
            }
            return -1 === e ||
              -1 === r ||
              0 === s ||
              (1 === s && e === r - 1 && e === i + 1)
              ? ""
              : t.slice(e, r);
          });
        var n =
          "b" === "ab".substr(-1)
            ? function (t, e, i) {
                return t.substr(e, i);
              }
            : function (t, e, i) {
                return e < 0 && (e = t.length + e), t.substr(e, i);
              };
      }.call(this, i("4362")));
    },
    e683: function (t, e, i) {
      "use strict";
      t.exports = function (t, e) {
        return e ? t.replace(/\/+$/, "") + "/" + e.replace(/^\/+/, "") : t;
      };
    },
    f6b4: function (t, e, i) {
      "use strict";
      var r = i("c532");
      function n() {
        this.handlers = [];
      }
      (n.prototype.use = function (t, e) {
        return (
          this.handlers.push({ fulfilled: t, rejected: e }),
          this.handlers.length - 1
        );
      }),
        (n.prototype.eject = function (t) {
          this.handlers[t] && (this.handlers[t] = null);
        }),
        (n.prototype.forEach = function (t) {
          r.forEach(this.handlers, function (e) {
            null !== e && t(e);
          });
        }),
        (t.exports = n);
    },
    ffd6: function (t, e, i) {
      var r = i("3729"),
        n = i("1310");
      t.exports = function (t) {
        return "symbol" == typeof t || (n(t) && "[object Symbol]" == r(t));
      };
    },
  },
]);
