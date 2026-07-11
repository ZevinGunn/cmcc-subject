import {
  r as e,
  o as t,
  p as i,
  w as o,
  n as r,
  c as n,
  d as s,
  h as a,
  e as l,
  f as d,
} from "./static.gather.rQc4DgSB.js";
var u =
  "undefined" != typeof globalThis
    ? globalThis
    : "undefined" != typeof window
    ? window
    : "undefined" != typeof global
    ? global
    : "undefined" != typeof self
    ? self
    : {};
function c(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default")
    ? e.default
    : e;
}
var p,
  h = { exports: {} },
  g = { exports: {} },
  f = { exports: {} };
function m() {
  return (
    p ||
      ((p = 1),
      (e = f),
      (t = "undefined" != typeof window ? window : u),
      (i = function () {
        function e() {}
        var t = e.prototype;
        return (
          (t.on = function (e, t) {
            if (e && t) {
              var i = (this._events = this._events || {}),
                o = (i[e] = i[e] || []);
              return -1 == o.indexOf(t) && o.push(t), this;
            }
          }),
          (t.once = function (e, t) {
            if (e && t) {
              this.on(e, t);
              var i = (this._onceEvents = this._onceEvents || {});
              return ((i[e] = i[e] || {})[t] = !0), this;
            }
          }),
          (t.off = function (e, t) {
            var i = this._events && this._events[e];
            if (i && i.length) {
              var o = i.indexOf(t);
              return -1 != o && i.splice(o, 1), this;
            }
          }),
          (t.emitEvent = function (e, t) {
            var i = this._events && this._events[e];
            if (i && i.length) {
              (i = i.slice(0)), (t = t || []);
              for (
                var o = this._onceEvents && this._onceEvents[e], r = 0;
                r < i.length;
                r++
              ) {
                var n = i[r];
                o && o[n] && (this.off(e, n), delete o[n]), n.apply(this, t);
              }
              return this;
            }
          }),
          (t.allOff = function () {
            delete this._events, delete this._onceEvents;
          }),
          e
        );
      }),
      e.exports ? (e.exports = i()) : (t.EvEmitter = i())),
    f.exports
  );
  var e, t, i;
}
var v,
  y = { exports: {} };
/*!
 * getSize v2.0.3
 * measure size of elements
 * MIT license
 */ function w() {
  return (
    v ||
      ((v = 1),
      (e = y),
      (t = window),
      (i = function () {
        function e(e) {
          var t = parseFloat(e);
          return -1 == e.indexOf("%") && !isNaN(t) && t;
        }
        var t =
            "undefined" == typeof console ? function () {} : function (e) {},
          i = [
            "paddingLeft",
            "paddingRight",
            "paddingTop",
            "paddingBottom",
            "marginLeft",
            "marginRight",
            "marginTop",
            "marginBottom",
            "borderLeftWidth",
            "borderRightWidth",
            "borderTopWidth",
            "borderBottomWidth",
          ],
          o = i.length;
        function r(e) {
          var i = getComputedStyle(e);
          return (
            i ||
              t(
                "Style returned " +
                  i +
                  ". Are you running this code in a hidden iframe on Firefox? See https://bit.ly/getsizebug1"
              ),
            i
          );
        }
        var n,
          s = !1;
        function a(t) {
          if (
            ((function () {
              if (!s) {
                s = !0;
                var t = document.createElement("div");
                (t.style.width = "200px"),
                  (t.style.padding = "1px 2px 3px 4px"),
                  (t.style.borderStyle = "solid"),
                  (t.style.borderWidth = "1px 2px 3px 4px"),
                  (t.style.boxSizing = "border-box");
                var i = document.body || document.documentElement;
                i.appendChild(t);
                var o = r(t);
                (n = 200 == Math.round(e(o.width))),
                  (a.isBoxSizeOuter = n),
                  i.removeChild(t);
              }
            })(),
            "string" == typeof t && (t = document.querySelector(t)),
            t && "object" == typeof t && t.nodeType)
          ) {
            var l = r(t);
            if ("none" == l.display)
              return (function () {
                for (
                  var e = {
                      width: 0,
                      height: 0,
                      innerWidth: 0,
                      innerHeight: 0,
                      outerWidth: 0,
                      outerHeight: 0,
                    },
                    t = 0;
                  t < o;
                  t++
                )
                  e[i[t]] = 0;
                return e;
              })();
            var d = {};
            (d.width = t.offsetWidth), (d.height = t.offsetHeight);
            for (
              var u = (d.isBorderBox = "border-box" == l.boxSizing), c = 0;
              c < o;
              c++
            ) {
              var p = i[c],
                h = l[p],
                g = parseFloat(h);
              d[p] = isNaN(g) ? 0 : g;
            }
            var f = d.paddingLeft + d.paddingRight,
              m = d.paddingTop + d.paddingBottom,
              v = d.marginLeft + d.marginRight,
              y = d.marginTop + d.marginBottom,
              w = d.borderLeftWidth + d.borderRightWidth,
              b = d.borderTopWidth + d.borderBottomWidth,
              S = u && n,
              T = e(l.width);
            !1 !== T &&
              (d.width =
                T + // add padding and border unless it's already including it
                (S ? 0 : f + w));
            var E = e(l.height);
            return (
              !1 !== E &&
                (d.height =
                  E + // add padding and border unless it's already including it
                  (S ? 0 : m + b)),
              (d.innerWidth = d.width - (f + w)),
              (d.innerHeight = d.height - (m + b)),
              (d.outerWidth = d.width + v),
              (d.outerHeight = d.height + y),
              d
            );
          }
        }
        return a;
      }),
      e.exports ? (e.exports = i()) : (t.getSize = i())),
    y.exports
  );
  var e, t, i;
}
var b,
  S,
  T = { exports: {} },
  E = { exports: {} };
function C() {
  return (
    S ||
      ((S = 1),
      (e = T),
      (t = window),
      (i = function (e, t) {
        var i = {
            extend: function (e, t) {
              for (var i in t) e[i] = t[i];
              return e;
            },
            modulo: function (e, t) {
              return ((e % t) + t) % t;
            },
          },
          o = Array.prototype.slice;
        (i.makeArray = function (e) {
          return Array.isArray(e)
            ? e
            : null == e
            ? []
            : "object" == typeof e && "number" == typeof e.length
            ? o.call(e)
            : [e];
        }),
          (i.removeFrom = function (e, t) {
            var i = e.indexOf(t);
            -1 != i && e.splice(i, 1);
          }),
          (i.getParent = function (e, i) {
            for (; e.parentNode && e != document.body; )
              if (((e = e.parentNode), t(e, i))) return e;
          }),
          (i.getQueryElement = function (e) {
            return "string" == typeof e ? document.querySelector(e) : e;
          }),
          (i.handleEvent = function (e) {
            var t = "on" + e.type;
            this[t] && this[t](e);
          }),
          (i.filterFindElements = function (e, o) {
            e = i.makeArray(e);
            var r = [];
            return (
              e.forEach(function (e) {
                if (e instanceof HTMLElement)
                  if (o) {
                    t(e, o) && r.push(e);
                    for (
                      var i = e.querySelectorAll(o), n = 0;
                      n < i.length;
                      n++
                    )
                      r.push(i[n]);
                  } else r.push(e);
              }),
              r
            );
          }),
          (i.debounceMethod = function (e, t, i) {
            i = i || 100;
            var o = e.prototype[t],
              r = t + "Timeout";
            e.prototype[t] = function () {
              var e = this[r];
              clearTimeout(e);
              var t = arguments,
                n = this;
              this[r] = setTimeout(function () {
                o.apply(n, t), delete n[r];
              }, i);
            };
          }),
          (i.docReady = function (e) {
            var t = document.readyState;
            "complete" == t || "interactive" == t
              ? setTimeout(e)
              : document.addEventListener("DOMContentLoaded", e);
          }),
          (i.toDashed = function (e) {
            return e
              .replace(/(.)([A-Z])/g, function (e, t, i) {
                return t + "-" + i;
              })
              .toLowerCase();
          });
        var r = e.console;
        return (
          (i.htmlInit = function (t, o) {
            i.docReady(function () {
              var n = i.toDashed(o),
                s = "data-" + n,
                a = document.querySelectorAll("[" + s + "]"),
                l = document.querySelectorAll(".js-" + n),
                d = i.makeArray(a).concat(i.makeArray(l)),
                u = s + "-options",
                c = e.jQuery;
              d.forEach(function (e) {
                var i,
                  n = e.getAttribute(s) || e.getAttribute(u);
                try {
                  i = n && JSON.parse(n);
                } catch (l) {
                  return void (
                    r &&
                    r.error(
                      "Error parsing " + s + " on " + e.className + ": " + l
                    )
                  );
                }
                var a = new t(e, i);
                c && c.data(e, o, a);
              });
            });
          }),
          i
        );
      }),
      e.exports
        ? (e.exports = i(
            t,
            (function () {
              return (
                b ||
                  ((b = 1),
                  (e = E),
                  (t = window),
                  (i = function () {
                    var e = (function () {
                      var e = window.Element.prototype;
                      if (e.matches) return "matches";
                      if (e.matchesSelector) return "matchesSelector";
                      for (
                        var t = ["webkit", "moz", "ms", "o"], i = 0;
                        i < t.length;
                        i++
                      ) {
                        var o = t[i] + "MatchesSelector";
                        if (e[o]) return o;
                      }
                    })();
                    return function (t, i) {
                      return t[e](i);
                    };
                  }),
                  e.exports ? (e.exports = i()) : (t.matchesSelector = i())),
                E.exports
              );
              var e, t, i;
            })()
          ))
        : (t.fizzyUIUtils = i(t, t.matchesSelector))),
    T.exports
  );
  var e, t, i;
}
var x,
  I,
  k,
  P,
  M,
  L = { exports: {} };
function _() {
  return (
    I ||
      ((I = 1),
      (e = g),
      (t = window),
      (i = function (e, t, i, o, r) {
        var n = e.console,
          s = e.jQuery,
          a = function () {},
          l = 0,
          d = {};
        function u(e, t) {
          var i = o.getQueryElement(e);
          if (i) {
            (this.element = i),
              s && (this.$element = s(this.element)),
              (this.options = o.extend({}, this.constructor.defaults)),
              this.option(t);
            var r = ++l;
            (this.element.outlayerGUID = r),
              (d[r] = this),
              this._create(),
              this._getOption("initLayout") && this.layout();
          } else
            n &&
              n.error(
                "Bad element for " +
                  this.constructor.namespace +
                  ": " +
                  (i || e)
              );
        }
        (u.namespace = "outlayer"),
          (u.Item = r),
          (u.defaults = {
            containerStyle: { position: "relative" },
            initLayout: !0,
            originLeft: !0,
            originTop: !0,
            resize: !0,
            resizeContainer: !0,
            // item options
            transitionDuration: "0.4s",
            hiddenStyle: { opacity: 0, transform: "scale(0.001)" },
            visibleStyle: { opacity: 1, transform: "scale(1)" },
          });
        var c = u.prototype;
        function p(e) {
          function t() {
            e.apply(this, arguments);
          }
          return (
            (t.prototype = Object.create(e.prototype)),
            (t.prototype.constructor = t),
            t
          );
        }
        o.extend(c, t.prototype),
          (c.option = function (e) {
            o.extend(this.options, e);
          }),
          (c._getOption = function (e) {
            var t = this.constructor.compatOptions[e];
            return t && void 0 !== this.options[t]
              ? this.options[t]
              : this.options[e];
          }),
          (u.compatOptions = {
            // currentName: oldName
            initLayout: "isInitLayout",
            horizontal: "isHorizontal",
            layoutInstant: "isLayoutInstant",
            originLeft: "isOriginLeft",
            originTop: "isOriginTop",
            resize: "isResizeBound",
            resizeContainer: "isResizingContainer",
          }),
          (c._create = function () {
            this.reloadItems(),
              (this.stamps = []),
              this.stamp(this.options.stamp),
              o.extend(this.element.style, this.options.containerStyle),
              this._getOption("resize") && this.bindResize();
          }),
          (c.reloadItems = function () {
            this.items = this._itemize(this.element.children);
          }),
          (c._itemize = function (e) {
            for (
              var t = this._filterFindItemElements(e),
                i = this.constructor.Item,
                o = [],
                r = 0;
              r < t.length;
              r++
            ) {
              var n = new i(t[r], this);
              o.push(n);
            }
            return o;
          }),
          (c._filterFindItemElements = function (e) {
            return o.filterFindElements(e, this.options.itemSelector);
          }),
          (c.getItemElements = function () {
            return this.items.map(function (e) {
              return e.element;
            });
          }),
          (c.layout = function () {
            this._resetLayout(), this._manageStamps();
            var e = this._getOption("layoutInstant"),
              t = void 0 !== e ? e : !this._isLayoutInited;
            this.layoutItems(this.items, t), (this._isLayoutInited = !0);
          }),
          (c._init = c.layout),
          (c._resetLayout = function () {
            this.getSize();
          }),
          (c.getSize = function () {
            this.size = i(this.element);
          }),
          (c._getMeasurement = function (e, t) {
            var o,
              r = this.options[e];
            r
              ? ("string" == typeof r
                  ? (o = this.element.querySelector(r))
                  : r instanceof HTMLElement && (o = r),
                (this[e] = o ? i(o)[t] : r))
              : (this[e] = 0);
          }),
          (c.layoutItems = function (e, t) {
            (e = this._getItemsForLayout(e)),
              this._layoutItems(e, t),
              this._postLayout();
          }),
          (c._getItemsForLayout = function (e) {
            return e.filter(function (e) {
              return !e.isIgnored;
            });
          }),
          (c._layoutItems = function (e, t) {
            if ((this._emitCompleteOnItems("layout", e), e && e.length)) {
              var i = [];
              e.forEach(function (e) {
                var o = this._getItemLayoutPosition(e);
                (o.item = e), (o.isInstant = t || e.isLayoutInstant), i.push(o);
              }, this),
                this._processLayoutQueue(i);
            }
          }),
          (c._getItemLayoutPosition = function () {
            return { x: 0, y: 0 };
          }),
          (c._processLayoutQueue = function (e) {
            this.updateStagger(),
              e.forEach(function (e, t) {
                this._positionItem(e.item, e.x, e.y, e.isInstant, t);
              }, this);
          }),
          (c.updateStagger = function () {
            var e = this.options.stagger;
            if (null != e)
              return (
                (this.stagger = (function (e) {
                  if ("number" == typeof e) return e;
                  var t = e.match(/(^\d*\.?\d*)(\w*)/),
                    i = t && t[1],
                    o = t && t[2];
                  if (!i.length) return 0;
                  i = parseFloat(i);
                  var r = h[o] || 1;
                  return i * r;
                })(e)),
                this.stagger
              );
            this.stagger = 0;
          }),
          (c._positionItem = function (e, t, i, o, r) {
            o ? e.goTo(t, i) : (e.stagger(r * this.stagger), e.moveTo(t, i));
          }),
          (c._postLayout = function () {
            this.resizeContainer();
          }),
          (c.resizeContainer = function () {
            if (this._getOption("resizeContainer")) {
              var e = this._getContainerSize();
              e &&
                (this._setContainerMeasure(e.width, !0),
                this._setContainerMeasure(e.height, !1));
            }
          }),
          (c._getContainerSize = a),
          (c._setContainerMeasure = function (e, t) {
            if (void 0 !== e) {
              var i = this.size;
              i.isBorderBox &&
                (e += t
                  ? i.paddingLeft +
                    i.paddingRight +
                    i.borderLeftWidth +
                    i.borderRightWidth
                  : i.paddingBottom +
                    i.paddingTop +
                    i.borderTopWidth +
                    i.borderBottomWidth),
                (e = Math.max(e, 0)),
                (this.element.style[t ? "width" : "height"] = e + "px");
            }
          }),
          (c._emitCompleteOnItems = function (e, t) {
            var i = this;
            function o() {
              i.dispatchEvent(e + "Complete", null, [t]);
            }
            var r = t.length;
            if (t && r) {
              var n = 0;
              t.forEach(function (t) {
                t.once(e, s);
              });
            } else o();
            function s() {
              ++n == r && o();
            }
          }),
          (c.dispatchEvent = function (e, t, i) {
            var o = t ? [t].concat(i) : i;
            if ((this.emitEvent(e, o), s))
              if (((this.$element = this.$element || s(this.element)), t)) {
                var r = s.Event(t);
                (r.type = e), this.$element.trigger(r, i);
              } else this.$element.trigger(e, i);
          }),
          (c.ignore = function (e) {
            var t = this.getItem(e);
            t && (t.isIgnored = !0);
          }),
          (c.unignore = function (e) {
            var t = this.getItem(e);
            t && delete t.isIgnored;
          }),
          (c.stamp = function (e) {
            (e = this._find(e)) &&
              ((this.stamps = this.stamps.concat(e)),
              e.forEach(this.ignore, this));
          }),
          (c.unstamp = function (e) {
            (e = this._find(e)) &&
              e.forEach(function (e) {
                o.removeFrom(this.stamps, e), this.unignore(e);
              }, this);
          }),
          (c._find = function (e) {
            if (e)
              return (
                "string" == typeof e && (e = this.element.querySelectorAll(e)),
                (e = o.makeArray(e))
              );
          }),
          (c._manageStamps = function () {
            this.stamps &&
              this.stamps.length &&
              (this._getBoundingRect(),
              this.stamps.forEach(this._manageStamp, this));
          }),
          (c._getBoundingRect = function () {
            var e = this.element.getBoundingClientRect(),
              t = this.size;
            this._boundingRect = {
              left: e.left + t.paddingLeft + t.borderLeftWidth,
              top: e.top + t.paddingTop + t.borderTopWidth,
              right: e.right - (t.paddingRight + t.borderRightWidth),
              bottom: e.bottom - (t.paddingBottom + t.borderBottomWidth),
            };
          }),
          (c._manageStamp = a),
          (c._getElementOffset = function (e) {
            var t = e.getBoundingClientRect(),
              o = this._boundingRect,
              r = i(e);
            return {
              left: t.left - o.left - r.marginLeft,
              top: t.top - o.top - r.marginTop,
              right: o.right - t.right - r.marginRight,
              bottom: o.bottom - t.bottom - r.marginBottom,
            };
          }),
          (c.handleEvent = o.handleEvent),
          (c.bindResize = function () {
            e.addEventListener("resize", this), (this.isResizeBound = !0);
          }),
          (c.unbindResize = function () {
            e.removeEventListener("resize", this), (this.isResizeBound = !1);
          }),
          (c.onresize = function () {
            this.resize();
          }),
          o.debounceMethod(u, "onresize", 100),
          (c.resize = function () {
            this.isResizeBound && this.needsResizeLayout() && this.layout();
          }),
          (c.needsResizeLayout = function () {
            var e = i(this.element);
            return this.size && e && e.innerWidth !== this.size.innerWidth;
          }),
          (c.addItems = function (e) {
            var t = this._itemize(e);
            return t.length && (this.items = this.items.concat(t)), t;
          }),
          (c.appended = function (e) {
            var t = this.addItems(e);
            t.length && (this.layoutItems(t, !0), this.reveal(t));
          }),
          (c.prepended = function (e) {
            var t = this._itemize(e);
            if (t.length) {
              var i = this.items.slice(0);
              (this.items = t.concat(i)),
                this._resetLayout(),
                this._manageStamps(),
                this.layoutItems(t, !0),
                this.reveal(t),
                this.layoutItems(i);
            }
          }),
          (c.reveal = function (e) {
            if ((this._emitCompleteOnItems("reveal", e), e && e.length)) {
              var t = this.updateStagger();
              e.forEach(function (e, i) {
                e.stagger(i * t), e.reveal();
              });
            }
          }),
          (c.hide = function (e) {
            if ((this._emitCompleteOnItems("hide", e), e && e.length)) {
              var t = this.updateStagger();
              e.forEach(function (e, i) {
                e.stagger(i * t), e.hide();
              });
            }
          }),
          (c.revealItemElements = function (e) {
            var t = this.getItems(e);
            this.reveal(t);
          }),
          (c.hideItemElements = function (e) {
            var t = this.getItems(e);
            this.hide(t);
          }),
          (c.getItem = function (e) {
            for (var t = 0; t < this.items.length; t++) {
              var i = this.items[t];
              if (i.element == e) return i;
            }
          }),
          (c.getItems = function (e) {
            e = o.makeArray(e);
            var t = [];
            return (
              e.forEach(function (e) {
                var i = this.getItem(e);
                i && t.push(i);
              }, this),
              t
            );
          }),
          (c.remove = function (e) {
            var t = this.getItems(e);
            this._emitCompleteOnItems("remove", t),
              t &&
                t.length &&
                t.forEach(function (e) {
                  e.remove(), o.removeFrom(this.items, e);
                }, this);
          }),
          (c.destroy = function () {
            var e = this.element.style;
            (e.height = ""),
              (e.position = ""),
              (e.width = ""),
              this.items.forEach(function (e) {
                e.destroy();
              }),
              this.unbindResize();
            var t = this.element.outlayerGUID;
            delete d[t],
              delete this.element.outlayerGUID,
              s && s.removeData(this.element, this.constructor.namespace);
          }),
          (u.data = function (e) {
            var t = (e = o.getQueryElement(e)) && e.outlayerGUID;
            return t && d[t];
          }),
          (u.create = function (e, t) {
            var i = p(u);
            return (
              (i.defaults = o.extend({}, u.defaults)),
              o.extend(i.defaults, t),
              (i.compatOptions = o.extend({}, u.compatOptions)),
              (i.namespace = e),
              (i.data = u.data),
              (i.Item = p(r)),
              o.htmlInit(i, e),
              s && s.bridget && s.bridget(e, i),
              i
            );
          });
        var h = { ms: 1, s: 1e3 };
        return (u.Item = r), u;
      }),
      e.exports
        ? (e.exports = i(
            t,
            m(),
            w(),
            C(),
            (function () {
              return (
                x ||
                  ((x = 1),
                  (e = L),
                  (t = window),
                  (i = function (e, t) {
                    var i = document.documentElement.style,
                      o =
                        "string" == typeof i.transition
                          ? "transition"
                          : "WebkitTransition",
                      r =
                        "string" == typeof i.transform
                          ? "transform"
                          : "WebkitTransform",
                      n = {
                        WebkitTransition: "webkitTransitionEnd",
                        transition: "transitionend",
                      }[o],
                      s = {
                        transform: r,
                        transition: o,
                        transitionDuration: o + "Duration",
                        transitionProperty: o + "Property",
                        transitionDelay: o + "Delay",
                      };
                    function a(e, t) {
                      e &&
                        ((this.element = e),
                        (this.layout = t),
                        (this.position = { x: 0, y: 0 }),
                        this._create());
                    }
                    var l = (a.prototype = Object.create(e.prototype));
                    (l.constructor = a),
                      (l._create = function () {
                        (this._transn = {
                          ingProperties: {},
                          clean: {},
                          onEnd: {},
                        }),
                          this.css({ position: "absolute" });
                      }),
                      (l.handleEvent = function (e) {
                        var t = "on" + e.type;
                        this[t] && this[t](e);
                      }),
                      (l.getSize = function () {
                        this.size = t(this.element);
                      }),
                      (l.css = function (e) {
                        var t = this.element.style;
                        for (var i in e) t[s[i] || i] = e[i];
                      }),
                      (l.getPosition = function () {
                        var e = getComputedStyle(this.element),
                          t = this.layout._getOption("originLeft"),
                          i = this.layout._getOption("originTop"),
                          o = e[t ? "left" : "right"],
                          r = e[i ? "top" : "bottom"],
                          n = parseFloat(o),
                          s = parseFloat(r),
                          a = this.layout.size;
                        -1 != o.indexOf("%") && (n = (n / 100) * a.width),
                          -1 != r.indexOf("%") && (s = (s / 100) * a.height),
                          (n = isNaN(n) ? 0 : n),
                          (s = isNaN(s) ? 0 : s),
                          (n -= t ? a.paddingLeft : a.paddingRight),
                          (s -= i ? a.paddingTop : a.paddingBottom),
                          (this.position.x = n),
                          (this.position.y = s);
                      }),
                      (l.layoutPosition = function () {
                        var e = this.layout.size,
                          t = {},
                          i = this.layout._getOption("originLeft"),
                          o = this.layout._getOption("originTop"),
                          r = i ? "paddingLeft" : "paddingRight",
                          n = i ? "left" : "right",
                          s = i ? "right" : "left",
                          a = this.position.x + e[r];
                        (t[n] = this.getXValue(a)), (t[s] = "");
                        var l = o ? "paddingTop" : "paddingBottom",
                          d = o ? "top" : "bottom",
                          u = o ? "bottom" : "top",
                          c = this.position.y + e[l];
                        (t[d] = this.getYValue(c)),
                          (t[u] = ""),
                          this.css(t),
                          this.emitEvent("layout", [this]);
                      }),
                      (l.getXValue = function (e) {
                        var t = this.layout._getOption("horizontal");
                        return this.layout.options.percentPosition && !t
                          ? (e / this.layout.size.width) * 100 + "%"
                          : e + "px";
                      }),
                      (l.getYValue = function (e) {
                        var t = this.layout._getOption("horizontal");
                        return this.layout.options.percentPosition && t
                          ? (e / this.layout.size.height) * 100 + "%"
                          : e + "px";
                      }),
                      (l._transitionTo = function (e, t) {
                        this.getPosition();
                        var i = this.position.x,
                          o = this.position.y,
                          r = e == this.position.x && t == this.position.y;
                        if (
                          (this.setPosition(e, t), !r || this.isTransitioning)
                        ) {
                          var n = e - i,
                            s = t - o,
                            a = {};
                          (a.transform = this.getTranslate(n, s)),
                            this.transition({
                              to: a,
                              onTransitionEnd: {
                                transform: this.layoutPosition,
                              },
                              isCleaning: !0,
                            });
                        } else this.layoutPosition();
                      }),
                      (l.getTranslate = function (e, t) {
                        return (
                          "translate3d(" +
                          (e = this.layout._getOption("originLeft") ? e : -e) +
                          "px, " +
                          (t = this.layout._getOption("originTop") ? t : -t) +
                          "px, 0)"
                        );
                      }),
                      (l.goTo = function (e, t) {
                        this.setPosition(e, t), this.layoutPosition();
                      }),
                      (l.moveTo = l._transitionTo),
                      (l.setPosition = function (e, t) {
                        (this.position.x = parseFloat(e)),
                          (this.position.y = parseFloat(t));
                      }),
                      (l._nonTransition = function (e) {
                        for (var t in (this.css(e.to),
                        e.isCleaning && this._removeStyles(e.to),
                        e.onTransitionEnd))
                          e.onTransitionEnd[t].call(this);
                      }),
                      (l.transition = function (e) {
                        if (
                          parseFloat(this.layout.options.transitionDuration)
                        ) {
                          var t = this._transn;
                          for (var i in e.onTransitionEnd)
                            t.onEnd[i] = e.onTransitionEnd[i];
                          for (i in e.to)
                            (t.ingProperties[i] = !0),
                              e.isCleaning && (t.clean[i] = !0);
                          e.from &&
                            (this.css(e.from), this.element.offsetHeight),
                            this.enableTransition(e.to),
                            this.css(e.to),
                            (this.isTransitioning = !0);
                        } else this._nonTransition(e);
                      });
                    var d =
                      "opacity," +
                      r.replace(/([A-Z])/g, function (e) {
                        return "-" + e.toLowerCase();
                      });
                    (l.enableTransition = function () {
                      if (!this.isTransitioning) {
                        var e = this.layout.options.transitionDuration;
                        (e = "number" == typeof e ? e + "ms" : e),
                          this.css({
                            transitionProperty: d,
                            transitionDuration: e,
                            transitionDelay: this.staggerDelay || 0,
                          }),
                          this.element.addEventListener(n, this, !1);
                      }
                    }),
                      (l.onwebkitTransitionEnd = function (e) {
                        this.ontransitionend(e);
                      }),
                      (l.onotransitionend = function (e) {
                        this.ontransitionend(e);
                      });
                    var u = { "-webkit-transform": "transform" };
                    (l.ontransitionend = function (e) {
                      if (e.target === this.element) {
                        var t = this._transn,
                          i = u[e.propertyName] || e.propertyName;
                        delete t.ingProperties[i],
                          (function (e) {
                            for (var t in e) return !1;
                            return !0;
                          })(t.ingProperties) && this.disableTransition(),
                          i in t.clean &&
                            ((this.element.style[e.propertyName] = ""),
                            delete t.clean[i]),
                          i in t.onEnd &&
                            (t.onEnd[i].call(this), delete t.onEnd[i]),
                          this.emitEvent("transitionEnd", [this]);
                      }
                    }),
                      (l.disableTransition = function () {
                        this.removeTransitionStyles(),
                          this.element.removeEventListener(n, this, !1),
                          (this.isTransitioning = !1);
                      }),
                      (l._removeStyles = function (e) {
                        var t = {};
                        for (var i in e) t[i] = "";
                        this.css(t);
                      });
                    var c = {
                      transitionProperty: "",
                      transitionDuration: "",
                      transitionDelay: "",
                    };
                    return (
                      (l.removeTransitionStyles = function () {
                        this.css(c);
                      }),
                      (l.stagger = function (e) {
                        (e = isNaN(e) ? 0 : e), (this.staggerDelay = e + "ms");
                      }),
                      (l.removeElem = function () {
                        this.element.parentNode.removeChild(this.element),
                          this.css({ display: "" }),
                          this.emitEvent("remove", [this]);
                      }),
                      (l.remove = function () {
                        o && parseFloat(this.layout.options.transitionDuration)
                          ? (this.once("transitionEnd", function () {
                              this.removeElem();
                            }),
                            this.hide())
                          : this.removeElem();
                      }),
                      (l.reveal = function () {
                        delete this.isHidden, this.css({ display: "" });
                        var e = this.layout.options,
                          t = {};
                        (t[
                          this.getHideRevealTransitionEndProperty(
                            "visibleStyle"
                          )
                        ] = this.onRevealTransitionEnd),
                          this.transition({
                            from: e.hiddenStyle,
                            to: e.visibleStyle,
                            isCleaning: !0,
                            onTransitionEnd: t,
                          });
                      }),
                      (l.onRevealTransitionEnd = function () {
                        this.isHidden || this.emitEvent("reveal");
                      }),
                      (l.getHideRevealTransitionEndProperty = function (e) {
                        var t = this.layout.options[e];
                        if (t.opacity) return "opacity";
                        for (var i in t) return i;
                      }),
                      (l.hide = function () {
                        (this.isHidden = !0), this.css({ display: "" });
                        var e = this.layout.options,
                          t = {};
                        (t[
                          this.getHideRevealTransitionEndProperty("hiddenStyle")
                        ] = this.onHideTransitionEnd),
                          this.transition({
                            from: e.visibleStyle,
                            to: e.hiddenStyle,
                            // keep hidden stuff hidden
                            isCleaning: !0,
                            onTransitionEnd: t,
                          });
                      }),
                      (l.onHideTransitionEnd = function () {
                        this.isHidden &&
                          (this.css({ display: "none" }),
                          this.emitEvent("hide"));
                      }),
                      (l.destroy = function () {
                        this.css({
                          position: "",
                          left: "",
                          right: "",
                          top: "",
                          bottom: "",
                          transition: "",
                          transform: "",
                        });
                      }),
                      a
                    );
                  }),
                  e.exports
                    ? (e.exports = i(m(), w()))
                    : ((t.Outlayer = {}),
                      (t.Outlayer.Item = i(t.EvEmitter, t.getSize)))),
                L.exports
              );
              var e, t, i;
            })()
            /*!
             * Outlayer v2.1.1
             * the brains and guts of a layout library
             * MIT license
             */
          ))
        : (t.Outlayer = i(
            t,
            t.EvEmitter,
            t.getSize,
            t.fizzyUIUtils,
            t.Outlayer.Item
          ))),
    g.exports
  );
  var e, t, i;
}
/*!
 * Masonry v4.2.2
 * Cascading grid layout library
 * https://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */ (k = h),
  (P = window),
  (M = function (e, t) {
    var i = e.create("masonry");
    i.compatOptions.fitWidth = "isFitWidth";
    var o = i.prototype;
    return (
      (o._resetLayout = function () {
        this.getSize(),
          this._getMeasurement("columnWidth", "outerWidth"),
          this._getMeasurement("gutter", "outerWidth"),
          this.measureColumns(),
          (this.colYs = []);
        for (var e = 0; e < this.cols; e++) this.colYs.push(0);
        (this.maxY = 0), (this.horizontalColIndex = 0);
      }),
      (o.measureColumns = function () {
        if ((this.getContainerWidth(), !this.columnWidth)) {
          var e = this.items[0],
            i = e && e.element;
          this.columnWidth =
            (i && t(i).outerWidth) || // if first elem has no width, default to size of container
            this.containerWidth;
        }
        var o = (this.columnWidth += this.gutter),
          r = this.containerWidth + this.gutter,
          n = r / o,
          s = o - (r % o);
        (n = Math[s && s < 1 ? "round" : "floor"](n)),
          (this.cols = Math.max(n, 1));
      }),
      (o.getContainerWidth = function () {
        var e = this._getOption("fitWidth")
            ? this.element.parentNode
            : this.element,
          i = t(e);
        this.containerWidth = i && i.innerWidth;
      }),
      (o._getItemLayoutPosition = function (e) {
        e.getSize();
        var t = e.size.outerWidth % this.columnWidth,
          i = Math[t && t < 1 ? "round" : "ceil"](
            e.size.outerWidth / this.columnWidth
          );
        i = Math.min(i, this.cols);
        for (
          var o = this[
              this.options.horizontalOrder
                ? "_getHorizontalColPosition"
                : "_getTopColPosition"
            ](i, e),
            r = { x: this.columnWidth * o.col, y: o.y },
            n = o.y + e.size.outerHeight,
            s = i + o.col,
            a = o.col;
          a < s;
          a++
        )
          this.colYs[a] = n;
        return r;
      }),
      (o._getTopColPosition = function (e) {
        var t = this._getTopColGroup(e),
          i = Math.min.apply(Math, t);
        return { col: t.indexOf(i), y: i };
      }),
      (o._getTopColGroup = function (e) {
        if (e < 2) return this.colYs;
        for (var t = [], i = this.cols + 1 - e, o = 0; o < i; o++)
          t[o] = this._getColGroupY(o, e);
        return t;
      }),
      (o._getColGroupY = function (e, t) {
        if (t < 2) return this.colYs[e];
        var i = this.colYs.slice(e, e + t);
        return Math.max.apply(Math, i);
      }),
      (o._getHorizontalColPosition = function (e, t) {
        var i = this.horizontalColIndex % this.cols;
        i = e > 1 && i + e > this.cols ? 0 : i;
        var o = t.size.outerWidth && t.size.outerHeight;
        return (
          (this.horizontalColIndex = o ? i + e : this.horizontalColIndex),
          { col: i, y: this._getColGroupY(i, e) }
        );
      }),
      (o._manageStamp = function (e) {
        var i = t(e),
          o = this._getElementOffset(e),
          r = this._getOption("originLeft") ? o.left : o.right,
          n = r + i.outerWidth,
          s = Math.floor(r / this.columnWidth);
        s = Math.max(0, s);
        var a = Math.floor(n / this.columnWidth);
        (a -= n % this.columnWidth ? 0 : 1), (a = Math.min(this.cols - 1, a));
        for (
          var l =
              (this._getOption("originTop") ? o.top : o.bottom) + i.outerHeight,
            d = s;
          d <= a;
          d++
        )
          this.colYs[d] = Math.max(l, this.colYs[d]);
      }),
      (o._getContainerSize = function () {
        this.maxY = Math.max.apply(Math, this.colYs);
        var e = { height: this.maxY };
        return (
          this._getOption("fitWidth") &&
            (e.width = this._getContainerFitWidth()),
          e
        );
      }),
      (o._getContainerFitWidth = function () {
        for (var e = 0, t = this.cols; --t && 0 === this.colYs[t]; ) e++;
        return (this.cols - e) * this.columnWidth - this.gutter;
      }),
      (o.needsResizeLayout = function () {
        var e = this.containerWidth;
        return this.getContainerWidth(), e != this.containerWidth;
      }),
      i
    );
  }),
  k.exports
    ? (k.exports = M(_(), w()))
    : (P.Masonry = M(P.Outlayer, P.getSize));
const B = c(h.exports);
var O = { exports: {} };
/*!
 * imagesLoaded v4.1.4
 * JavaScript is all like "You images are done yet or what?"
 * MIT License
 */ !(function (e) {
  !(function (t, i) {
    e.exports ? (e.exports = i(t, m())) : (t.imagesLoaded = i(t, t.EvEmitter));
  })(
    "undefined" != typeof window ? window : u,
    // --------------------------  factory -------------------------- //
    function (e, t) {
      var i = e.jQuery,
        o = e.console;
      function r(e, t) {
        for (var i in t) e[i] = t[i];
        return e;
      }
      var n = Array.prototype.slice;
      function s(e, t, a) {
        if (!(this instanceof s)) return new s(e, t, a);
        var l,
          d = e;
        ("string" == typeof e && (d = document.querySelectorAll(e)), d)
          ? ((this.elements =
              ((l = d),
              Array.isArray(l)
                ? l
                : "object" == typeof l && "number" == typeof l.length
                ? n.call(l)
                : [l])),
            (this.options = r({}, this.options)),
            "function" == typeof t ? (a = t) : r(this.options, t),
            a && this.on("always", a),
            this.getImages(),
            i && (this.jqDeferred = new i.Deferred()),
            setTimeout(this.check.bind(this)))
          : o.error("Bad element for imagesLoaded " + (d || e));
      }
      (s.prototype = Object.create(t.prototype)),
        (s.prototype.options = {}),
        (s.prototype.getImages = function () {
          (this.images = []),
            this.elements.forEach(this.addElementImages, this);
        }),
        (s.prototype.addElementImages = function (e) {
          "IMG" == e.nodeName && this.addImage(e),
            !0 === this.options.background &&
              this.addElementBackgroundImages(e);
          var t = e.nodeType;
          if (t && a[t]) {
            for (var i = e.querySelectorAll("img"), o = 0; o < i.length; o++) {
              var r = i[o];
              this.addImage(r);
            }
            if ("string" == typeof this.options.background) {
              var n = e.querySelectorAll(this.options.background);
              for (o = 0; o < n.length; o++) {
                var s = n[o];
                this.addElementBackgroundImages(s);
              }
            }
          }
        });
      var a = { 1: !0, 9: !0, 11: !0 };
      function l(e) {
        this.img = e;
      }
      function d(e, t) {
        (this.url = e), (this.element = t), (this.img = new Image());
      }
      return (
        (s.prototype.addElementBackgroundImages = function (e) {
          var t = getComputedStyle(e);
          if (t)
            for (
              var i = /url\((['"])?(.*?)\1\)/gi, o = i.exec(t.backgroundImage);
              null !== o;

            ) {
              var r = o && o[2];
              r && this.addBackground(r, e), (o = i.exec(t.backgroundImage));
            }
        }),
        (s.prototype.addImage = function (e) {
          var t = new l(e);
          this.images.push(t);
        }),
        (s.prototype.addBackground = function (e, t) {
          var i = new d(e, t);
          this.images.push(i);
        }),
        (s.prototype.check = function () {
          var e = this;
          function t(t, i, o) {
            setTimeout(function () {
              e.progress(t, i, o);
            });
          }
          (this.progressedCount = 0),
            (this.hasAnyBroken = !1),
            this.images.length
              ? this.images.forEach(function (e) {
                  e.once("progress", t), e.check();
                })
              : this.complete();
        }),
        (s.prototype.progress = function (e, t, i) {
          this.progressedCount++,
            (this.hasAnyBroken = this.hasAnyBroken || !e.isLoaded),
            this.emitEvent("progress", [this, e, t]),
            this.jqDeferred &&
              this.jqDeferred.notify &&
              this.jqDeferred.notify(this, e),
            this.progressedCount == this.images.length && this.complete(),
            this.options.debug && o && o.log("progress: " + i, e, t);
        }),
        (s.prototype.complete = function () {
          var e = this.hasAnyBroken ? "fail" : "done";
          if (
            ((this.isComplete = !0),
            this.emitEvent(e, [this]),
            this.emitEvent("always", [this]),
            this.jqDeferred)
          ) {
            var t = this.hasAnyBroken ? "reject" : "resolve";
            this.jqDeferred[t](this);
          }
        }),
        (l.prototype = Object.create(t.prototype)),
        (l.prototype.check = function () {
          this.getIsImageComplete()
            ? this.confirm(0 !== this.img.naturalWidth, "naturalWidth")
            : ((this.proxyImage = new Image()),
              this.proxyImage.addEventListener("load", this),
              this.proxyImage.addEventListener("error", this),
              this.img.addEventListener("load", this),
              this.img.addEventListener("error", this),
              (this.proxyImage.src = this.img.src));
        }),
        (l.prototype.getIsImageComplete = function () {
          return this.img.complete && this.img.naturalWidth;
        }),
        (l.prototype.confirm = function (e, t) {
          (this.isLoaded = e), this.emitEvent("progress", [this, this.img, t]);
        }),
        (l.prototype.handleEvent = function (e) {
          var t = "on" + e.type;
          this[t] && this[t](e);
        }),
        (l.prototype.onload = function () {
          this.confirm(!0, "onload"), this.unbindEvents();
        }),
        (l.prototype.onerror = function () {
          this.confirm(!1, "onerror"), this.unbindEvents();
        }),
        (l.prototype.unbindEvents = function () {
          this.proxyImage.removeEventListener("load", this),
            this.proxyImage.removeEventListener("error", this),
            this.img.removeEventListener("load", this),
            this.img.removeEventListener("error", this);
        }),
        (d.prototype = Object.create(l.prototype)),
        (d.prototype.check = function () {
          this.img.addEventListener("load", this),
            this.img.addEventListener("error", this),
            (this.img.src = this.url),
            this.getIsImageComplete() &&
              (this.confirm(0 !== this.img.naturalWidth, "naturalWidth"),
              this.unbindEvents());
        }),
        (d.prototype.unbindEvents = function () {
          this.img.removeEventListener("load", this),
            this.img.removeEventListener("error", this);
        }),
        (d.prototype.confirm = function (e, t) {
          (this.isLoaded = e),
            this.emitEvent("progress", [this, this.element, t]);
        }),
        (s.makeJQueryPlugin = function (t) {
          (t = t || e.jQuery) &&
            ((i = t).fn.imagesLoaded = function (e, t) {
              return new s(this, e, t).jqDeferred.promise(i(this));
            });
        }),
        s.makeJQueryPlugin(),
        s
      );
    }
  );
})(O);
const z = c(O.exports);
function A(e) {
  return {
    all: (e = e || new Map()),
    on: function (t, i) {
      var o = e.get(t);
      o ? o.push(i) : e.set(t, [i]);
    },
    off: function (t, i) {
      var o = e.get(t);
      o && (i ? o.splice(o.indexOf(i) >>> 0, 1) : e.set(t, []));
    },
    emit: function (t, i) {
      var o = e.get(t);
      o &&
        o.slice().map(function (e) {
          e(i);
        }),
        (o = e.get("*")) &&
          o.slice().map(function (e) {
            e(t, i);
          });
    },
  };
}
function D(e) {
  return (
    null !== e &&
    "object" == typeof e &&
    "constructor" in e &&
    e.constructor === Object
  );
}
function N(e, t) {
  void 0 === e && (e = {}), void 0 === t && (t = {});
  const i = ["__proto__", "constructor", "prototype"];
  Object.keys(t)
    .filter((e) => i.indexOf(e) < 0)
    .forEach((i) => {
      void 0 === e[i]
        ? (e[i] = t[i])
        : D(t[i]) && D(e[i]) && Object.keys(t[i]).length > 0 && N(e[i], t[i]);
    });
}
const R = {
  body: {},
  addEventListener() {},
  removeEventListener() {},
  activeElement: { blur() {}, nodeName: "" },
  querySelector: () => null,
  querySelectorAll: () => [],
  getElementById: () => null,
  createEvent: () => ({ initEvent() {} }),
  createElement: () => ({
    children: [],
    childNodes: [],
    style: {},
    setAttribute() {},
    getElementsByTagName: () => [],
  }),
  createElementNS: () => ({}),
  importNode: () => null,
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: "",
  },
};
function F() {
  const e = "undefined" != typeof document ? document : {};
  return N(e, R), e;
}
const G = {
  document: R,
  navigator: { userAgent: "" },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: "",
  },
  history: { replaceState() {}, pushState() {}, go() {}, back() {} },
  CustomEvent: function () {
    return this;
  },
  addEventListener() {},
  removeEventListener() {},
  getComputedStyle: () => ({ getPropertyValue: () => "" }),
  Image() {},
  Date() {},
  screen: {},
  setTimeout() {},
  clearTimeout() {},
  matchMedia: () => ({}),
  requestAnimationFrame: (e) =>
    "undefined" == typeof setTimeout ? (e(), null) : setTimeout(e, 0),
  cancelAnimationFrame(e) {
    "undefined" != typeof setTimeout && clearTimeout(e);
  },
};
function j() {
  const e = "undefined" != typeof window ? window : {};
  return N(e, G), e;
}
function W(e, t) {
  return void 0 === t && (t = 0), setTimeout(e, t);
}
function H() {
  return Date.now();
}
function V(e, t) {
  void 0 === t && (t = "x");
  const i = j();
  let o, r, n;
  const s = (function (e) {
    const t = j();
    let i;
    return (
      t.getComputedStyle && (i = t.getComputedStyle(e, null)),
      !i && e.currentStyle && (i = e.currentStyle),
      i || (i = e.style),
      i
    );
  })(e);
  return (
    i.WebKitCSSMatrix
      ? ((r = s.transform || s.webkitTransform),
        r.split(",").length > 6 &&
          (r = r
            .split(", ")
            .map((e) => e.replace(",", "."))
            .join(", ")),
        (n = new i.WebKitCSSMatrix("none" === r ? "" : r)))
      : ((n =
          s.MozTransform ||
          s.OTransform ||
          s.MsTransform ||
          s.msTransform ||
          s.transform ||
          s
            .getPropertyValue("transform")
            .replace("translate(", "matrix(1, 0, 0, 1,")),
        (o = n.toString().split(","))),
    "x" === t &&
      (r = i.WebKitCSSMatrix
        ? n.m41
        : 16 === o.length
        ? parseFloat(o[12])
        : parseFloat(o[4])),
    "y" === t &&
      (r = i.WebKitCSSMatrix
        ? n.m42
        : 16 === o.length
        ? parseFloat(o[13])
        : parseFloat(o[5])),
    r || 0
  );
}
function Y(e) {
  return (
    "object" == typeof e &&
    null !== e &&
    e.constructor &&
    "Object" === Object.prototype.toString.call(e).slice(8, -1)
  );
}
function X() {
  const e = Object(arguments.length <= 0 ? void 0 : arguments[0]),
    t = ["__proto__", "constructor", "prototype"];
  for (let o = 1; o < arguments.length; o += 1) {
    const r = o < 0 || arguments.length <= o ? void 0 : arguments[o];
    if (
      null != r &&
      ((i = r),
      !("undefined" != typeof window && void 0 !== window.HTMLElement
        ? i instanceof HTMLElement
        : i && (1 === i.nodeType || 11 === i.nodeType)))
    ) {
      const i = Object.keys(Object(r)).filter((e) => t.indexOf(e) < 0);
      for (let t = 0, o = i.length; t < o; t += 1) {
        const o = i[t],
          n = Object.getOwnPropertyDescriptor(r, o);
        void 0 !== n &&
          n.enumerable &&
          (Y(e[o]) && Y(r[o])
            ? r[o].__swiper__
              ? (e[o] = r[o])
              : X(e[o], r[o])
            : !Y(e[o]) && Y(r[o])
            ? ((e[o] = {}), r[o].__swiper__ ? (e[o] = r[o]) : X(e[o], r[o]))
            : (e[o] = r[o]));
      }
    }
  }
  var i;
  return e;
}
function q(e, t, i) {
  e.style.setProperty(t, i);
}
function U(e) {
  let { swiper: t, targetPosition: i, side: o } = e;
  const r = j(),
    n = -t.translate;
  let s,
    a = null;
  const l = t.params.speed;
  (t.wrapperEl.style.scrollSnapType = "none"),
    r.cancelAnimationFrame(t.cssModeFrameID);
  const d = i > n ? "next" : "prev",
    u = (e, t) => ("next" === d && e >= t) || ("prev" === d && e <= t),
    c = () => {
      (s = new Date().getTime()), null === a && (a = s);
      const e = Math.max(Math.min((s - a) / l, 1), 0),
        d = 0.5 - Math.cos(e * Math.PI) / 2;
      let p = n + d * (i - n);
      if ((u(p, i) && (p = i), t.wrapperEl.scrollTo({ [o]: p }), u(p, i)))
        return (
          (t.wrapperEl.style.overflow = "hidden"),
          (t.wrapperEl.style.scrollSnapType = ""),
          setTimeout(() => {
            (t.wrapperEl.style.overflow = ""), t.wrapperEl.scrollTo({ [o]: p });
          }),
          void r.cancelAnimationFrame(t.cssModeFrameID)
        );
      t.cssModeFrameID = r.requestAnimationFrame(c);
    };
  c();
}
function K(e, t) {
  void 0 === t && (t = "");
  const i = j(),
    o = [...e.children];
  return (
    i.HTMLSlotElement &&
      e instanceof HTMLSlotElement &&
      o.push(...e.assignedElements()),
    t ? o.filter((e) => e.matches(t)) : o
  );
}
function Q(e) {
  try {
    return;
  } catch (t) {}
}
function J(e, t) {
  void 0 === t && (t = []);
  const i = document.createElement(e);
  return (
    i.classList.add(
      ...(Array.isArray(t)
        ? t
        : (function (e) {
            return (
              void 0 === e && (e = ""),
              e
                .trim()
                .split(" ")
                .filter((e) => !!e.trim())
            );
          })(t))
    ),
    i
  );
}
function $(e, t) {
  return j().getComputedStyle(e, null).getPropertyValue(t);
}
function Z(e) {
  let t,
    i = e;
  if (i) {
    for (t = 0; null !== (i = i.previousSibling); )
      1 === i.nodeType && (t += 1);
    return t;
  }
}
function ee(e, t, i) {
  const o = j();
  return i
    ? e["width" === t ? "offsetWidth" : "offsetHeight"] +
        parseFloat(
          o
            .getComputedStyle(e, null)
            .getPropertyValue("width" === t ? "margin-right" : "margin-top")
        ) +
        parseFloat(
          o
            .getComputedStyle(e, null)
            .getPropertyValue("width" === t ? "margin-left" : "margin-bottom")
        )
    : e.offsetWidth;
}
function te(e, t) {
  void 0 === t && (t = ""),
    "undefined" != typeof trustedTypes
      ? (e.innerHTML = trustedTypes
          .createPolicy("html", { createHTML: (e) => e })
          .createHTML(t))
      : (e.innerHTML = t);
}
let ie, oe, re;
function ne() {
  return (
    ie ||
      (ie = (function () {
        const e = j(),
          t = F();
        return {
          smoothScroll:
            t.documentElement &&
            t.documentElement.style &&
            "scrollBehavior" in t.documentElement.style,
          touch: !!(
            "ontouchstart" in e ||
            (e.DocumentTouch && t instanceof e.DocumentTouch)
          ),
        };
      })()),
    ie
  );
}
function se(e) {
  return (
    void 0 === e && (e = {}),
    oe ||
      (oe = (function (e) {
        let { userAgent: t } = void 0 === e ? {} : e;
        const i = ne(),
          o = j(),
          r = o.navigator.platform,
          n = t || o.navigator.userAgent,
          s = { ios: !1, android: !1 },
          a = o.screen.width,
          l = o.screen.height,
          d = n.match(/(Android);?[\s\/]+([\d.]+)?/);
        let u = n.match(/(iPad).*OS\s([\d_]+)/);
        const c = n.match(/(iPod)(.*OS\s([\d_]+))?/),
          p = !u && n.match(/(iPhone\sOS|iOS)\s([\d_]+)/),
          h = "Win32" === r;
        let g = "MacIntel" === r;
        return (
          !u &&
            g &&
            i.touch &&
            [
              "1024x1366",
              "1366x1024",
              "834x1194",
              "1194x834",
              "834x1112",
              "1112x834",
              "768x1024",
              "1024x768",
              "820x1180",
              "1180x820",
              "810x1080",
              "1080x810",
            ].indexOf("".concat(a, "x").concat(l)) >= 0 &&
            ((u = n.match(/(Version)\/([\d.]+)/)),
            u || (u = [0, 1, "13_0_0"]),
            (g = !1)),
          d && !h && ((s.os = "android"), (s.android = !0)),
          (u || p || c) && ((s.os = "ios"), (s.ios = !0)),
          s
        );
      })(e)),
    oe
  );
}
function ae() {
  return (
    re ||
      (re = (function () {
        const e = j(),
          t = se();
        let i = !1;
        function o() {
          const t = e.navigator.userAgent.toLowerCase();
          return (
            t.indexOf("safari") >= 0 &&
            t.indexOf("chrome") < 0 &&
            t.indexOf("android") < 0
          );
        }
        if (o()) {
          const t = String(e.navigator.userAgent);
          if (t.includes("Version/")) {
            const [e, o] = t
              .split("Version/")[1]
              .split(" ")[0]
              .split(".")
              .map((e) => Number(e));
            i = e < 16 || (16 === e && o < 2);
          }
        }
        const r = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(
            e.navigator.userAgent
          ),
          n = o();
        return {
          isSafari: i || n,
          needPerspectiveFix: i,
          need3dFix: n || (r && t.ios),
          isWebView: r,
        };
      })()),
    re
  );
}
const le = (e, t, i) => {
  t && !e.classList.contains(i)
    ? e.classList.add(i)
    : !t && e.classList.contains(i) && e.classList.remove(i);
};
const de = (e, t, i) => {
  t && !e.classList.contains(i)
    ? e.classList.add(i)
    : !t && e.classList.contains(i) && e.classList.remove(i);
};
const ue = (e, t) => {
    if (!e || e.destroyed || !e.params) return;
    const i = t.closest(
      e.isElement ? "swiper-slide" : ".".concat(e.params.slideClass)
    );
    if (i) {
      let t = i.querySelector(".".concat(e.params.lazyPreloaderClass));
      !t &&
        e.isElement &&
        (i.shadowRoot
          ? (t = i.shadowRoot.querySelector(
              ".".concat(e.params.lazyPreloaderClass)
            ))
          : requestAnimationFrame(() => {
              i.shadowRoot &&
                ((t = i.shadowRoot.querySelector(
                  ".".concat(e.params.lazyPreloaderClass)
                )),
                t && t.remove());
            })),
        t && t.remove();
    }
  },
  ce = (e, t) => {
    if (!e.slides[t]) return;
    const i = e.slides[t].querySelector('[loading="lazy"]');
    i && i.removeAttribute("loading");
  },
  pe = (e) => {
    if (!e || e.destroyed || !e.params) return;
    let t = e.params.lazyPreloadPrevNext;
    const i = e.slides.length;
    if (!i || !t || t < 0) return;
    t = Math.min(t, i);
    const o =
        "auto" === e.params.slidesPerView
          ? e.slidesPerViewDynamic()
          : Math.ceil(e.params.slidesPerView),
      r = e.activeIndex;
    if (e.params.grid && e.params.grid.rows > 1) {
      const i = r,
        n = [i - t];
      return (
        n.push(...Array.from({ length: t }).map((e, t) => i + o + t)),
        void e.slides.forEach((t, i) => {
          n.includes(t.column) && ce(e, i);
        })
      );
    }
    const n = r + o - 1;
    if (e.params.rewind || e.params.loop)
      for (let s = r - t; s <= n + t; s += 1) {
        const t = ((s % i) + i) % i;
        (t < r || t > n) && ce(e, t);
      }
    else
      for (let s = Math.max(r - t, 0); s <= Math.min(n + t, i - 1); s += 1)
        s !== r && (s > n || s < r) && ce(e, s);
  };
function he(e) {
  let { swiper: t, runCallbacks: i, direction: o, step: r } = e;
  const { activeIndex: n, previousIndex: s } = t;
  let a = o;
  a || (a = n > s ? "next" : n < s ? "prev" : "reset"),
    t.emit("transition".concat(r)),
    i && "reset" === a
      ? t.emit("slideResetTransition".concat(r))
      : i &&
        n !== s &&
        (t.emit("slideChangeTransition".concat(r)),
        "next" === a
          ? t.emit("slideNextTransition".concat(r))
          : t.emit("slidePrevTransition".concat(r)));
}
function ge(e, t, i) {
  const o = j(),
    { params: r } = e,
    n = r.edgeSwipeDetection,
    s = r.edgeSwipeThreshold;
  return (
    !n ||
    !(i <= s || i >= o.innerWidth - s) ||
    ("prevent" === n && (t.preventDefault(), !0))
  );
}
function fe(e) {
  const t = this,
    i = F();
  let o = e;
  o.originalEvent && (o = o.originalEvent);
  const r = t.touchEventsData;
  if ("pointerdown" === o.type) {
    if (null !== r.pointerId && r.pointerId !== o.pointerId) return;
    r.pointerId = o.pointerId;
  } else
    "touchstart" === o.type &&
      1 === o.targetTouches.length &&
      (r.touchId = o.targetTouches[0].identifier);
  if ("touchstart" === o.type) return void ge(t, o, o.targetTouches[0].pageX);
  const { params: n, touches: s, enabled: a } = t;
  if (!a) return;
  if (!n.simulateTouch && "mouse" === o.pointerType) return;
  if (t.animating && n.preventInteractionOnTransition) return;
  !t.animating && n.cssMode && n.loop && t.loopFix();
  let l = o.target;
  if (
    "wrapper" === n.touchEventsTarget &&
    !(function (e, t) {
      const i = j();
      let o = t.contains(e);
      !o &&
        i.HTMLSlotElement &&
        t instanceof HTMLSlotElement &&
        ((o = [...t.assignedElements()].includes(e)),
        o ||
          (o = (function (e, t) {
            const i = [t];
            for (; i.length > 0; ) {
              const t = i.shift();
              if (e === t) return !0;
              i.push(
                ...t.children,
                ...(t.shadowRoot ? t.shadowRoot.children : []),
                ...(t.assignedElements ? t.assignedElements() : [])
              );
            }
          })(e, t)));
      return o;
    })(l, t.wrapperEl)
  )
    return;
  if ("which" in o && 3 === o.which) return;
  if ("button" in o && o.button > 0) return;
  if (r.isTouched && r.isMoved) return;
  const d = !!n.noSwipingClass && "" !== n.noSwipingClass,
    u = o.composedPath ? o.composedPath() : o.path;
  d && o.target && o.target.shadowRoot && u && (l = u[0]);
  const c = n.noSwipingSelector
      ? n.noSwipingSelector
      : ".".concat(n.noSwipingClass),
    p = !(!o.target || !o.target.shadowRoot);
  if (
    n.noSwiping &&
    (p
      ? (function (e, t) {
          return (
            void 0 === t && (t = this),
            (function t(i) {
              if (!i || i === F() || i === j()) return null;
              i.assignedSlot && (i = i.assignedSlot);
              const o = i.closest(e);
              return o || i.getRootNode ? o || t(i.getRootNode().host) : null;
            })(t)
          );
        })(c, l)
      : l.closest(c))
  )
    return void (t.allowClick = !0);
  if (n.swipeHandler && !l.closest(n.swipeHandler)) return;
  (s.currentX = o.pageX), (s.currentY = o.pageY);
  const h = s.currentX,
    g = s.currentY;
  if (!ge(t, o, h)) return;
  Object.assign(r, {
    isTouched: !0,
    isMoved: !1,
    allowTouchCallbacks: !0,
    isScrolling: void 0,
    startMoving: void 0,
  }),
    (s.startX = h),
    (s.startY = g),
    (r.touchStartTime = H()),
    (t.allowClick = !0),
    t.updateSize(),
    (t.swipeDirection = void 0),
    n.threshold > 0 && (r.allowThresholdMove = !1);
  let f = !0;
  l.matches(r.focusableElements) &&
    ((f = !1), "SELECT" === l.nodeName && (r.isTouched = !1)),
    i.activeElement &&
      i.activeElement.matches(r.focusableElements) &&
      i.activeElement !== l &&
      ("mouse" === o.pointerType ||
        ("mouse" !== o.pointerType && !l.matches(r.focusableElements))) &&
      i.activeElement.blur();
  const m = f && t.allowTouchMove && n.touchStartPreventDefault;
  (!n.touchStartForcePreventDefault && !m) ||
    l.isContentEditable ||
    o.preventDefault(),
    n.freeMode &&
      n.freeMode.enabled &&
      t.freeMode &&
      t.animating &&
      !n.cssMode &&
      t.freeMode.onTouchStart(),
    t.emit("touchStart", o);
}
function me(e) {
  const t = F(),
    i = this,
    o = i.touchEventsData,
    { params: r, touches: n, rtlTranslate: s, enabled: a } = i;
  if (!a) return;
  if (!r.simulateTouch && "mouse" === e.pointerType) return;
  let l,
    d = e;
  if ((d.originalEvent && (d = d.originalEvent), "pointermove" === d.type)) {
    if (null !== o.touchId) return;
    if (d.pointerId !== o.pointerId) return;
  }
  if ("touchmove" === d.type) {
    if (
      ((l = [...d.changedTouches].find((e) => e.identifier === o.touchId)),
      !l || l.identifier !== o.touchId)
    )
      return;
  } else l = d;
  if (!o.isTouched)
    return void (
      o.startMoving &&
      o.isScrolling &&
      i.emit("touchMoveOpposite", d)
    );
  const u = l.pageX,
    c = l.pageY;
  if (d.preventedByNestedSwiper) return (n.startX = u), void (n.startY = c);
  if (!i.allowTouchMove)
    return (
      d.target.matches(o.focusableElements) || (i.allowClick = !1),
      void (
        o.isTouched &&
        (Object.assign(n, { startX: u, startY: c, currentX: u, currentY: c }),
        (o.touchStartTime = H()))
      )
    );
  if (r.touchReleaseOnEdges && !r.loop)
    if (i.isVertical()) {
      if (
        (c < n.startY && i.translate <= i.maxTranslate()) ||
        (c > n.startY && i.translate >= i.minTranslate())
      )
        return (o.isTouched = !1), void (o.isMoved = !1);
    } else {
      if (
        s &&
        ((u > n.startX && -i.translate <= i.maxTranslate()) ||
          (u < n.startX && -i.translate >= i.minTranslate()))
      )
        return;
      if (
        !s &&
        ((u < n.startX && i.translate <= i.maxTranslate()) ||
          (u > n.startX && i.translate >= i.minTranslate()))
      )
        return;
    }
  if (
    (t.activeElement &&
      t.activeElement.matches(o.focusableElements) &&
      t.activeElement !== d.target &&
      "mouse" !== d.pointerType &&
      t.activeElement.blur(),
    t.activeElement &&
      d.target === t.activeElement &&
      d.target.matches(o.focusableElements))
  )
    return (o.isMoved = !0), void (i.allowClick = !1);
  o.allowTouchCallbacks && i.emit("touchMove", d),
    (n.previousX = n.currentX),
    (n.previousY = n.currentY),
    (n.currentX = u),
    (n.currentY = c);
  const p = n.currentX - n.startX,
    h = n.currentY - n.startY;
  if (i.params.threshold && Math.sqrt(p ** 2 + h ** 2) < i.params.threshold)
    return;
  if (void 0 === o.isScrolling) {
    let e;
    (i.isHorizontal() && n.currentY === n.startY) ||
    (i.isVertical() && n.currentX === n.startX)
      ? (o.isScrolling = !1)
      : p * p + h * h >= 25 &&
        ((e = (180 * Math.atan2(Math.abs(h), Math.abs(p))) / Math.PI),
        (o.isScrolling = i.isHorizontal()
          ? e > r.touchAngle
          : 90 - e > r.touchAngle));
  }
  if (
    (o.isScrolling && i.emit("touchMoveOpposite", d),
    void 0 === o.startMoving &&
      ((n.currentX === n.startX && n.currentY === n.startY) ||
        (o.startMoving = !0)),
    o.isScrolling ||
      ("touchmove" === d.type && o.preventTouchMoveFromPointerMove))
  )
    return void (o.isTouched = !1);
  if (!o.startMoving) return;
  (i.allowClick = !1),
    !r.cssMode && d.cancelable && d.preventDefault(),
    r.touchMoveStopPropagation && !r.nested && d.stopPropagation();
  let g = i.isHorizontal() ? p : h,
    f = i.isHorizontal() ? n.currentX - n.previousX : n.currentY - n.previousY;
  r.oneWayMovement &&
    ((g = Math.abs(g) * (s ? 1 : -1)), (f = Math.abs(f) * (s ? 1 : -1))),
    (n.diff = g),
    (g *= r.touchRatio),
    s && ((g = -g), (f = -f));
  const m = i.touchesDirection;
  (i.swipeDirection = g > 0 ? "prev" : "next"),
    (i.touchesDirection = f > 0 ? "prev" : "next");
  const v = i.params.loop && !r.cssMode,
    y =
      ("next" === i.touchesDirection && i.allowSlideNext) ||
      ("prev" === i.touchesDirection && i.allowSlidePrev);
  if (!o.isMoved) {
    if (
      (v && y && i.loopFix({ direction: i.swipeDirection }),
      (o.startTranslate = i.getTranslate()),
      i.setTransition(0),
      i.animating)
    ) {
      const e = new window.CustomEvent("transitionend", {
        bubbles: !0,
        cancelable: !0,
        detail: { bySwiperTouchMove: !0 },
      });
      i.wrapperEl.dispatchEvent(e);
    }
    (o.allowMomentumBounce = !1),
      !r.grabCursor ||
        (!0 !== i.allowSlideNext && !0 !== i.allowSlidePrev) ||
        i.setGrabCursor(!0),
      i.emit("sliderFirstMove", d);
  }
  if (
    (new Date().getTime(),
    !1 !== r._loopSwapReset &&
      o.isMoved &&
      o.allowThresholdMove &&
      m !== i.touchesDirection &&
      v &&
      y &&
      Math.abs(g) >= 1)
  )
    return (
      Object.assign(n, {
        startX: u,
        startY: c,
        currentX: u,
        currentY: c,
        startTranslate: o.currentTranslate,
      }),
      (o.loopSwapReset = !0),
      void (o.startTranslate = o.currentTranslate)
    );
  i.emit("sliderMove", d),
    (o.isMoved = !0),
    (o.currentTranslate = g + o.startTranslate);
  let w = !0,
    b = r.resistanceRatio;
  if (
    (r.touchReleaseOnEdges && (b = 0),
    g > 0
      ? (v &&
          y &&
          o.allowThresholdMove &&
          o.currentTranslate >
            (r.centeredSlides
              ? i.minTranslate() -
                i.slidesSizesGrid[i.activeIndex + 1] -
                ("auto" !== r.slidesPerView &&
                i.slides.length - r.slidesPerView >= 2
                  ? i.slidesSizesGrid[i.activeIndex + 1] + i.params.spaceBetween
                  : 0) -
                i.params.spaceBetween
              : i.minTranslate()) &&
          i.loopFix({
            direction: "prev",
            setTranslate: !0,
            activeSlideIndex: 0,
          }),
        o.currentTranslate > i.minTranslate() &&
          ((w = !1),
          r.resistance &&
            (o.currentTranslate =
              i.minTranslate() -
              1 +
              (-i.minTranslate() + o.startTranslate + g) ** b)))
      : g < 0 &&
        (v &&
          y &&
          o.allowThresholdMove &&
          o.currentTranslate <
            (r.centeredSlides
              ? i.maxTranslate() +
                i.slidesSizesGrid[i.slidesSizesGrid.length - 1] +
                i.params.spaceBetween +
                ("auto" !== r.slidesPerView &&
                i.slides.length - r.slidesPerView >= 2
                  ? i.slidesSizesGrid[i.slidesSizesGrid.length - 1] +
                    i.params.spaceBetween
                  : 0)
              : i.maxTranslate()) &&
          i.loopFix({
            direction: "next",
            setTranslate: !0,
            activeSlideIndex:
              i.slides.length -
              ("auto" === r.slidesPerView
                ? i.slidesPerViewDynamic()
                : Math.ceil(parseFloat(r.slidesPerView, 10))),
          }),
        o.currentTranslate < i.maxTranslate() &&
          ((w = !1),
          r.resistance &&
            (o.currentTranslate =
              i.maxTranslate() +
              1 -
              (i.maxTranslate() - o.startTranslate - g) ** b))),
    w && (d.preventedByNestedSwiper = !0),
    !i.allowSlideNext &&
      "next" === i.swipeDirection &&
      o.currentTranslate < o.startTranslate &&
      (o.currentTranslate = o.startTranslate),
    !i.allowSlidePrev &&
      "prev" === i.swipeDirection &&
      o.currentTranslate > o.startTranslate &&
      (o.currentTranslate = o.startTranslate),
    i.allowSlidePrev ||
      i.allowSlideNext ||
      (o.currentTranslate = o.startTranslate),
    r.threshold > 0)
  ) {
    if (!(Math.abs(g) > r.threshold || o.allowThresholdMove))
      return void (o.currentTranslate = o.startTranslate);
    if (!o.allowThresholdMove)
      return (
        (o.allowThresholdMove = !0),
        (n.startX = n.currentX),
        (n.startY = n.currentY),
        (o.currentTranslate = o.startTranslate),
        void (n.diff = i.isHorizontal()
          ? n.currentX - n.startX
          : n.currentY - n.startY)
      );
  }
  r.followFinger &&
    !r.cssMode &&
    (((r.freeMode && r.freeMode.enabled && i.freeMode) ||
      r.watchSlidesProgress) &&
      (i.updateActiveIndex(), i.updateSlidesClasses()),
    r.freeMode && r.freeMode.enabled && i.freeMode && i.freeMode.onTouchMove(),
    i.updateProgress(o.currentTranslate),
    i.setTranslate(o.currentTranslate));
}
function ve(e) {
  const t = this,
    i = t.touchEventsData;
  let o,
    r = e;
  r.originalEvent && (r = r.originalEvent);
  if ("touchend" === r.type || "touchcancel" === r.type) {
    if (
      ((o = [...r.changedTouches].find((e) => e.identifier === i.touchId)),
      !o || o.identifier !== i.touchId)
    )
      return;
  } else {
    if (null !== i.touchId) return;
    if (r.pointerId !== i.pointerId) return;
    o = r;
  }
  if (
    ["pointercancel", "pointerout", "pointerleave", "contextmenu"].includes(
      r.type
    )
  ) {
    if (
      !(
        ["pointercancel", "contextmenu"].includes(r.type) &&
        (t.browser.isSafari || t.browser.isWebView)
      )
    )
      return;
  }
  (i.pointerId = null), (i.touchId = null);
  const {
    params: n,
    touches: s,
    rtlTranslate: a,
    slidesGrid: l,
    enabled: d,
  } = t;
  if (!d) return;
  if (!n.simulateTouch && "mouse" === r.pointerType) return;
  if (
    (i.allowTouchCallbacks && t.emit("touchEnd", r),
    (i.allowTouchCallbacks = !1),
    !i.isTouched)
  )
    return (
      i.isMoved && n.grabCursor && t.setGrabCursor(!1),
      (i.isMoved = !1),
      void (i.startMoving = !1)
    );
  n.grabCursor &&
    i.isMoved &&
    i.isTouched &&
    (!0 === t.allowSlideNext || !0 === t.allowSlidePrev) &&
    t.setGrabCursor(!1);
  const u = H(),
    c = u - i.touchStartTime;
  if (t.allowClick) {
    const e = r.path || (r.composedPath && r.composedPath());
    t.updateClickedSlide((e && e[0]) || r.target, e),
      t.emit("tap click", r),
      c < 300 &&
        u - i.lastClickTime < 300 &&
        t.emit("doubleTap doubleClick", r);
  }
  if (
    ((i.lastClickTime = H()),
    W(() => {
      t.destroyed || (t.allowClick = !0);
    }),
    !i.isTouched ||
      !i.isMoved ||
      !t.swipeDirection ||
      (0 === s.diff && !i.loopSwapReset) ||
      (i.currentTranslate === i.startTranslate && !i.loopSwapReset))
  )
    return (i.isTouched = !1), (i.isMoved = !1), void (i.startMoving = !1);
  let p;
  if (
    ((i.isTouched = !1),
    (i.isMoved = !1),
    (i.startMoving = !1),
    (p = n.followFinger
      ? a
        ? t.translate
        : -t.translate
      : -i.currentTranslate),
    n.cssMode)
  )
    return;
  if (n.freeMode && n.freeMode.enabled)
    return void t.freeMode.onTouchEnd({ currentPos: p });
  const h = p >= -t.maxTranslate() && !t.params.loop;
  let g = 0,
    f = t.slidesSizesGrid[0];
  for (
    let b = 0;
    b < l.length;
    b += b < n.slidesPerGroupSkip ? 1 : n.slidesPerGroup
  ) {
    const e = b < n.slidesPerGroupSkip - 1 ? 1 : n.slidesPerGroup;
    void 0 !== l[b + e]
      ? (h || (p >= l[b] && p < l[b + e])) && ((g = b), (f = l[b + e] - l[b]))
      : (h || p >= l[b]) && ((g = b), (f = l[l.length - 1] - l[l.length - 2]));
  }
  let m = null,
    v = null;
  n.rewind &&
    (t.isBeginning
      ? (v =
          n.virtual && n.virtual.enabled && t.virtual
            ? t.virtual.slides.length - 1
            : t.slides.length - 1)
      : t.isEnd && (m = 0));
  const y = (p - l[g]) / f,
    w = g < n.slidesPerGroupSkip - 1 ? 1 : n.slidesPerGroup;
  if (c > n.longSwipesMs) {
    if (!n.longSwipes) return void t.slideTo(t.activeIndex);
    "next" === t.swipeDirection &&
      (y >= n.longSwipesRatio
        ? t.slideTo(n.rewind && t.isEnd ? m : g + w)
        : t.slideTo(g)),
      "prev" === t.swipeDirection &&
        (y > 1 - n.longSwipesRatio
          ? t.slideTo(g + w)
          : null !== v && y < 0 && Math.abs(y) > n.longSwipesRatio
          ? t.slideTo(v)
          : t.slideTo(g));
  } else {
    if (!n.shortSwipes) return void t.slideTo(t.activeIndex);
    t.navigation &&
    (r.target === t.navigation.nextEl || r.target === t.navigation.prevEl)
      ? r.target === t.navigation.nextEl
        ? t.slideTo(g + w)
        : t.slideTo(g)
      : ("next" === t.swipeDirection && t.slideTo(null !== m ? m : g + w),
        "prev" === t.swipeDirection && t.slideTo(null !== v ? v : g));
  }
}
function ye() {
  const e = this,
    { params: t, el: i } = e;
  if (i && 0 === i.offsetWidth) return;
  t.breakpoints && e.setBreakpoint();
  const { allowSlideNext: o, allowSlidePrev: r, snapGrid: n } = e,
    s = e.virtual && e.params.virtual.enabled;
  (e.allowSlideNext = !0),
    (e.allowSlidePrev = !0),
    e.updateSize(),
    e.updateSlides(),
    e.updateSlidesClasses();
  const a = s && t.loop;
  !("auto" === t.slidesPerView || t.slidesPerView > 1) ||
  !e.isEnd ||
  e.isBeginning ||
  e.params.centeredSlides ||
  a
    ? e.params.loop && !s
      ? e.slideToLoop(e.realIndex, 0, !1, !0)
      : e.slideTo(e.activeIndex, 0, !1, !0)
    : e.slideTo(e.slides.length - 1, 0, !1, !0),
    e.autoplay &&
      e.autoplay.running &&
      e.autoplay.paused &&
      (clearTimeout(e.autoplay.resizeTimeout),
      (e.autoplay.resizeTimeout = setTimeout(() => {
        e.autoplay &&
          e.autoplay.running &&
          e.autoplay.paused &&
          e.autoplay.resume();
      }, 500))),
    (e.allowSlidePrev = r),
    (e.allowSlideNext = o),
    e.params.watchOverflow && n !== e.snapGrid && e.checkOverflow();
}
function we(e) {
  const t = this;
  t.enabled &&
    (t.allowClick ||
      (t.params.preventClicks && e.preventDefault(),
      t.params.preventClicksPropagation &&
        t.animating &&
        (e.stopPropagation(), e.stopImmediatePropagation())));
}
function be() {
  const e = this,
    { wrapperEl: t, rtlTranslate: i, enabled: o } = e;
  if (!o) return;
  let r;
  (e.previousTranslate = e.translate),
    e.isHorizontal()
      ? (e.translate = -t.scrollLeft)
      : (e.translate = -t.scrollTop),
    0 === e.translate && (e.translate = 0),
    e.updateActiveIndex(),
    e.updateSlidesClasses();
  const n = e.maxTranslate() - e.minTranslate();
  (r = 0 === n ? 0 : (e.translate - e.minTranslate()) / n),
    r !== e.progress && e.updateProgress(i ? -e.translate : e.translate),
    e.emit("setTranslate", e.translate, !1);
}
function Se(e) {
  const t = this;
  ue(t, e.target),
    t.params.cssMode ||
      ("auto" !== t.params.slidesPerView && !t.params.autoHeight) ||
      t.update();
}
function Te() {
  const e = this;
  e.documentTouchHandlerProceeded ||
    ((e.documentTouchHandlerProceeded = !0),
    e.params.touchReleaseOnEdges && (e.el.style.touchAction = "auto"));
}
const Ee = (e, t) => {
  const i = F(),
    { params: o, el: r, wrapperEl: n, device: s } = e,
    a = !!o.nested,
    l = "on" === t ? "addEventListener" : "removeEventListener",
    d = t;
  r &&
    "string" != typeof r &&
    (i[l]("touchstart", e.onDocumentTouchStart, { passive: !1, capture: a }),
    r[l]("touchstart", e.onTouchStart, { passive: !1 }),
    r[l]("pointerdown", e.onTouchStart, { passive: !1 }),
    i[l]("touchmove", e.onTouchMove, { passive: !1, capture: a }),
    i[l]("pointermove", e.onTouchMove, { passive: !1, capture: a }),
    i[l]("touchend", e.onTouchEnd, { passive: !0 }),
    i[l]("pointerup", e.onTouchEnd, { passive: !0 }),
    i[l]("pointercancel", e.onTouchEnd, { passive: !0 }),
    i[l]("touchcancel", e.onTouchEnd, { passive: !0 }),
    i[l]("pointerout", e.onTouchEnd, { passive: !0 }),
    i[l]("pointerleave", e.onTouchEnd, { passive: !0 }),
    i[l]("contextmenu", e.onTouchEnd, { passive: !0 }),
    (o.preventClicks || o.preventClicksPropagation) &&
      r[l]("click", e.onClick, !0),
    o.cssMode && n[l]("scroll", e.onScroll),
    o.updateOnWindowResize
      ? e[d](
          s.ios || s.android
            ? "resize orientationchange observerUpdate"
            : "resize observerUpdate",
          ye,
          !0
        )
      : e[d]("observerUpdate", ye, !0),
    r[l]("load", e.onLoad, { capture: !0 }));
};
const Ce = (e, t) => e.grid && t.grid && t.grid.rows > 1;
var xe = {
  setBreakpoint: function () {
    const e = this,
      { realIndex: t, initialized: i, params: o, el: r } = e,
      n = o.breakpoints;
    if (!n || (n && 0 === Object.keys(n).length)) return;
    const s = F(),
      a =
        "window" !== o.breakpointsBase && o.breakpointsBase
          ? "container"
          : o.breakpointsBase,
      l =
        ["window", "container"].includes(o.breakpointsBase) ||
        !o.breakpointsBase
          ? e.el
          : s.querySelector(o.breakpointsBase),
      d = e.getBreakpoint(n, a, l);
    if (!d || e.currentBreakpoint === d) return;
    const u = (d in n ? n[d] : void 0) || e.originalParams,
      c = Ce(e, o),
      p = Ce(e, u),
      h = e.params.grabCursor,
      g = u.grabCursor,
      f = o.enabled;
    c && !p
      ? (r.classList.remove(
          "".concat(o.containerModifierClass, "grid"),
          "".concat(o.containerModifierClass, "grid-column")
        ),
        e.emitContainerClasses())
      : !c &&
        p &&
        (r.classList.add("".concat(o.containerModifierClass, "grid")),
        ((u.grid.fill && "column" === u.grid.fill) ||
          (!u.grid.fill && "column" === o.grid.fill)) &&
          r.classList.add("".concat(o.containerModifierClass, "grid-column")),
        e.emitContainerClasses()),
      h && !g ? e.unsetGrabCursor() : !h && g && e.setGrabCursor(),
      ["navigation", "pagination", "scrollbar"].forEach((t) => {
        if (void 0 === u[t]) return;
        const i = o[t] && o[t].enabled,
          r = u[t] && u[t].enabled;
        i && !r && e[t].disable(), !i && r && e[t].enable();
      });
    const m = u.direction && u.direction !== o.direction,
      v = o.loop && (u.slidesPerView !== o.slidesPerView || m),
      y = o.loop;
    m && i && e.changeDirection(), X(e.params, u);
    const w = e.params.enabled,
      b = e.params.loop;
    Object.assign(e, {
      allowTouchMove: e.params.allowTouchMove,
      allowSlideNext: e.params.allowSlideNext,
      allowSlidePrev: e.params.allowSlidePrev,
    }),
      f && !w ? e.disable() : !f && w && e.enable(),
      (e.currentBreakpoint = d),
      e.emit("_beforeBreakpoint", u),
      i &&
        (v
          ? (e.loopDestroy(), e.loopCreate(t), e.updateSlides())
          : !y && b
          ? (e.loopCreate(t), e.updateSlides())
          : y && !b && e.loopDestroy()),
      e.emit("breakpoint", u);
  },
  getBreakpoint: function (e, t, i) {
    if ((void 0 === t && (t = "window"), !e || ("container" === t && !i)))
      return;
    let o = !1;
    const r = j(),
      n = "window" === t ? r.innerHeight : i.clientHeight,
      s = Object.keys(e).map((e) => {
        if ("string" == typeof e && 0 === e.indexOf("@")) {
          const t = parseFloat(e.substr(1));
          return { value: n * t, point: e };
        }
        return { value: e, point: e };
      });
    s.sort((e, t) => parseInt(e.value, 10) - parseInt(t.value, 10));
    for (let a = 0; a < s.length; a += 1) {
      const { point: e, value: n } = s[a];
      "window" === t
        ? r.matchMedia("(min-width: ".concat(n, "px)")).matches && (o = e)
        : n <= i.clientWidth && (o = e);
    }
    return o || "max";
  },
};
var Ie = {
  init: !0,
  direction: "horizontal",
  oneWayMovement: !1,
  swiperElementNodeName: "SWIPER-CONTAINER",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: !1,
  updateOnWindowResize: !0,
  resizeObserver: !0,
  nested: !1,
  createElements: !1,
  eventsPrefix: "swiper",
  enabled: !0,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  preventInteractionOnTransition: !1,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: !1,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: !1,
  // Set wrapper width
  setWrapperSize: !1,
  // Virtual Translate
  virtualTranslate: !1,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: !1,
  centeredSlides: !1,
  centeredSlidesBounds: !1,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: !0,
  centerInsufficientSlides: !1,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: !0,
  // Round length
  roundLengths: !1,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: !0,
  shortSwipes: !0,
  longSwipes: !0,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: !0,
  allowTouchMove: !0,
  threshold: 5,
  touchMoveStopPropagation: !1,
  touchStartPreventDefault: !0,
  touchStartForcePreventDefault: !1,
  touchReleaseOnEdges: !1,
  // Unique Navigation Elements
  uniqueNavElements: !0,
  // Resistance
  resistance: !0,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: !1,
  // Cursor
  grabCursor: !1,
  // Clicks
  preventClicks: !0,
  preventClicksPropagation: !0,
  slideToClickedSlide: !1,
  // loop
  loop: !1,
  loopAddBlankSlides: !0,
  loopAdditionalSlides: 0,
  loopPreventsSliding: !0,
  // rewind
  rewind: !1,
  // Swiping/no swiping
  allowSlidePrev: !0,
  allowSlideNext: !0,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: !0,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: !0,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-blank",
  slideActiveClass: "swiper-slide-active",
  slideVisibleClass: "swiper-slide-visible",
  slideFullyVisibleClass: "swiper-slide-fully-visible",
  slideNextClass: "swiper-slide-next",
  slidePrevClass: "swiper-slide-prev",
  wrapperClass: "swiper-wrapper",
  lazyPreloaderClass: "swiper-lazy-preloader",
  lazyPreloadPrevNext: 0,
  // Callbacks
  runCallbacksOnInit: !0,
  // Internals
  _emitClasses: !1,
};
function ke(e, t) {
  return function (i) {
    void 0 === i && (i = {});
    const o = Object.keys(i)[0],
      r = i[o];
    "object" == typeof r && null !== r
      ? (!0 === e[o] && (e[o] = { enabled: !0 }),
        "navigation" === o &&
          e[o] &&
          e[o].enabled &&
          !e[o].prevEl &&
          !e[o].nextEl &&
          (e[o].auto = !0),
        ["pagination", "scrollbar"].indexOf(o) >= 0 &&
          e[o] &&
          e[o].enabled &&
          !e[o].el &&
          (e[o].auto = !0),
        o in e && "enabled" in r
          ? ("object" != typeof e[o] ||
              "enabled" in e[o] ||
              (e[o].enabled = !0),
            e[o] || (e[o] = { enabled: !1 }),
            X(t, i))
          : X(t, i))
      : X(t, i);
  };
}
const Pe = {
    eventsEmitter: {
      on(e, t, i) {
        const o = this;
        if (!o.eventsListeners || o.destroyed) return o;
        if ("function" != typeof t) return o;
        const r = i ? "unshift" : "push";
        return (
          e.split(" ").forEach((e) => {
            o.eventsListeners[e] || (o.eventsListeners[e] = []),
              o.eventsListeners[e][r](t);
          }),
          o
        );
      },
      once(e, t, i) {
        const o = this;
        if (!o.eventsListeners || o.destroyed) return o;
        if ("function" != typeof t) return o;
        function r() {
          o.off(e, r), r.__emitterProxy && delete r.__emitterProxy;
          for (var i = arguments.length, n = new Array(i), s = 0; s < i; s++)
            n[s] = arguments[s];
          t.apply(o, n);
        }
        return (r.__emitterProxy = t), o.on(e, r, i);
      },
      onAny(e, t) {
        const i = this;
        if (!i.eventsListeners || i.destroyed) return i;
        if ("function" != typeof e) return i;
        const o = t ? "unshift" : "push";
        return (
          i.eventsAnyListeners.indexOf(e) < 0 && i.eventsAnyListeners[o](e), i
        );
      },
      offAny(e) {
        const t = this;
        if (!t.eventsListeners || t.destroyed) return t;
        if (!t.eventsAnyListeners) return t;
        const i = t.eventsAnyListeners.indexOf(e);
        return i >= 0 && t.eventsAnyListeners.splice(i, 1), t;
      },
      off(e, t) {
        const i = this;
        return !i.eventsListeners || i.destroyed
          ? i
          : i.eventsListeners
          ? (e.split(" ").forEach((e) => {
              void 0 === t
                ? (i.eventsListeners[e] = [])
                : i.eventsListeners[e] &&
                  i.eventsListeners[e].forEach((o, r) => {
                    (o === t || (o.__emitterProxy && o.__emitterProxy === t)) &&
                      i.eventsListeners[e].splice(r, 1);
                  });
            }),
            i)
          : i;
      },
      emit() {
        const e = this;
        if (!e.eventsListeners || e.destroyed) return e;
        if (!e.eventsListeners) return e;
        let t, i, o;
        for (var r = arguments.length, n = new Array(r), s = 0; s < r; s++)
          n[s] = arguments[s];
        "string" == typeof n[0] || Array.isArray(n[0])
          ? ((t = n[0]), (i = n.slice(1, n.length)), (o = e))
          : ((t = n[0].events), (i = n[0].data), (o = n[0].context || e)),
          i.unshift(o);
        return (
          (Array.isArray(t) ? t : t.split(" ")).forEach((t) => {
            e.eventsAnyListeners &&
              e.eventsAnyListeners.length &&
              e.eventsAnyListeners.forEach((e) => {
                e.apply(o, [t, ...i]);
              }),
              e.eventsListeners &&
                e.eventsListeners[t] &&
                e.eventsListeners[t].forEach((e) => {
                  e.apply(o, i);
                });
          }),
          e
        );
      },
    },
    update: {
      updateSize: function () {
        const e = this;
        let t, i;
        const o = e.el;
        (t =
          void 0 !== e.params.width && null !== e.params.width
            ? e.params.width
            : o.clientWidth),
          (i =
            void 0 !== e.params.height && null !== e.params.height
              ? e.params.height
              : o.clientHeight),
          (0 === t && e.isHorizontal()) ||
            (0 === i && e.isVertical()) ||
            ((t =
              t -
              parseInt($(o, "padding-left") || 0, 10) -
              parseInt($(o, "padding-right") || 0, 10)),
            (i =
              i -
              parseInt($(o, "padding-top") || 0, 10) -
              parseInt($(o, "padding-bottom") || 0, 10)),
            Number.isNaN(t) && (t = 0),
            Number.isNaN(i) && (i = 0),
            Object.assign(e, {
              width: t,
              height: i,
              size: e.isHorizontal() ? t : i,
            }));
      },
      updateSlides: function () {
        const e = this;
        function t(t, i) {
          return parseFloat(t.getPropertyValue(e.getDirectionLabel(i)) || 0);
        }
        const i = e.params,
          {
            wrapperEl: o,
            slidesEl: r,
            size: n,
            rtlTranslate: s,
            wrongRTL: a,
          } = e,
          l = e.virtual && i.virtual.enabled,
          d = l ? e.virtual.slides.length : e.slides.length,
          u = K(r, ".".concat(e.params.slideClass, ", swiper-slide")),
          c = l ? e.virtual.slides.length : u.length;
        let p = [];
        const h = [],
          g = [];
        let f = i.slidesOffsetBefore;
        "function" == typeof f && (f = i.slidesOffsetBefore.call(e));
        let m = i.slidesOffsetAfter;
        "function" == typeof m && (m = i.slidesOffsetAfter.call(e));
        const v = e.snapGrid.length,
          y = e.slidesGrid.length;
        let w = i.spaceBetween,
          b = -f,
          S = 0,
          T = 0;
        if (void 0 === n) return;
        "string" == typeof w && w.indexOf("%") >= 0
          ? (w = (parseFloat(w.replace("%", "")) / 100) * n)
          : "string" == typeof w && (w = parseFloat(w)),
          (e.virtualSize = -w),
          u.forEach((e) => {
            s ? (e.style.marginLeft = "") : (e.style.marginRight = ""),
              (e.style.marginBottom = ""),
              (e.style.marginTop = "");
          }),
          i.centeredSlides &&
            i.cssMode &&
            (q(o, "--swiper-centered-offset-before", ""),
            q(o, "--swiper-centered-offset-after", ""));
        const E = i.grid && i.grid.rows > 1 && e.grid;
        let C;
        E ? e.grid.initSlides(u) : e.grid && e.grid.unsetSlides();
        const x =
          "auto" === i.slidesPerView &&
          i.breakpoints &&
          Object.keys(i.breakpoints).filter(
            (e) => void 0 !== i.breakpoints[e].slidesPerView
          ).length > 0;
        for (let I = 0; I < c; I += 1) {
          let o;
          if (
            ((C = 0),
            u[I] && (o = u[I]),
            E && e.grid.updateSlide(I, o, u),
            !u[I] || "none" !== $(o, "display"))
          ) {
            if ("auto" === i.slidesPerView) {
              x && (u[I].style[e.getDirectionLabel("width")] = "");
              const r = getComputedStyle(o),
                n = o.style.transform,
                s = o.style.webkitTransform;
              if (
                (n && (o.style.transform = "none"),
                s && (o.style.webkitTransform = "none"),
                i.roundLengths)
              )
                C = e.isHorizontal() ? ee(o, "width", !0) : ee(o, "height", !0);
              else {
                const e = t(r, "width"),
                  i = t(r, "padding-left"),
                  n = t(r, "padding-right"),
                  s = t(r, "margin-left"),
                  a = t(r, "margin-right"),
                  l = r.getPropertyValue("box-sizing");
                if (l && "border-box" === l) C = e + s + a;
                else {
                  const { clientWidth: t, offsetWidth: r } = o;
                  C = e + i + n + s + a + (r - t);
                }
              }
              n && (o.style.transform = n),
                s && (o.style.webkitTransform = s),
                i.roundLengths && (C = Math.floor(C));
            } else
              (C = (n - (i.slidesPerView - 1) * w) / i.slidesPerView),
                i.roundLengths && (C = Math.floor(C)),
                u[I] &&
                  (u[I].style[e.getDirectionLabel("width")] = "".concat(
                    C,
                    "px"
                  ));
            u[I] && (u[I].swiperSlideSize = C),
              g.push(C),
              i.centeredSlides
                ? ((b = b + C / 2 + S / 2 + w),
                  0 === S && 0 !== I && (b = b - n / 2 - w),
                  0 === I && (b = b - n / 2 - w),
                  Math.abs(b) < 0.001 && (b = 0),
                  i.roundLengths && (b = Math.floor(b)),
                  T % i.slidesPerGroup == 0 && p.push(b),
                  h.push(b))
                : (i.roundLengths && (b = Math.floor(b)),
                  (T - Math.min(e.params.slidesPerGroupSkip, T)) %
                    e.params.slidesPerGroup ==
                    0 && p.push(b),
                  h.push(b),
                  (b = b + C + w)),
              (e.virtualSize += C + w),
              (S = C),
              (T += 1);
          }
        }
        if (
          ((e.virtualSize = Math.max(e.virtualSize, n) + m),
          s &&
            a &&
            ("slide" === i.effect || "coverflow" === i.effect) &&
            (o.style.width = "".concat(e.virtualSize + w, "px")),
          i.setWrapperSize &&
            (o.style[e.getDirectionLabel("width")] = "".concat(
              e.virtualSize + w,
              "px"
            )),
          E && e.grid.updateWrapperSize(C, p),
          !i.centeredSlides)
        ) {
          const t = [];
          for (let o = 0; o < p.length; o += 1) {
            let r = p[o];
            i.roundLengths && (r = Math.floor(r)),
              p[o] <= e.virtualSize - n && t.push(r);
          }
          (p = t),
            Math.floor(e.virtualSize - n) - Math.floor(p[p.length - 1]) > 1 &&
              p.push(e.virtualSize - n);
        }
        if (l && i.loop) {
          const t = g[0] + w;
          if (i.slidesPerGroup > 1) {
            const o = Math.ceil(
                (e.virtual.slidesBefore + e.virtual.slidesAfter) /
                  i.slidesPerGroup
              ),
              r = t * i.slidesPerGroup;
            for (let e = 0; e < o; e += 1) p.push(p[p.length - 1] + r);
          }
          for (
            let o = 0;
            o < e.virtual.slidesBefore + e.virtual.slidesAfter;
            o += 1
          )
            1 === i.slidesPerGroup && p.push(p[p.length - 1] + t),
              h.push(h[h.length - 1] + t),
              (e.virtualSize += t);
        }
        if ((0 === p.length && (p = [0]), 0 !== w)) {
          const t =
            e.isHorizontal() && s
              ? "marginLeft"
              : e.getDirectionLabel("marginRight");
          u.filter(
            (e, t) => !(i.cssMode && !i.loop) || t !== u.length - 1
          ).forEach((e) => {
            e.style[t] = "".concat(w, "px");
          });
        }
        if (i.centeredSlides && i.centeredSlidesBounds) {
          let e = 0;
          g.forEach((t) => {
            e += t + (w || 0);
          }),
            (e -= w);
          const t = e > n ? e - n : 0;
          p = p.map((e) => (e <= 0 ? -f : e > t ? t + m : e));
        }
        if (i.centerInsufficientSlides) {
          let e = 0;
          g.forEach((t) => {
            e += t + (w || 0);
          }),
            (e -= w);
          const t = (i.slidesOffsetBefore || 0) + (i.slidesOffsetAfter || 0);
          if (e + t < n) {
            const i = (n - e - t) / 2;
            p.forEach((e, t) => {
              p[t] = e - i;
            }),
              h.forEach((e, t) => {
                h[t] = e + i;
              });
          }
        }
        if (
          (Object.assign(e, {
            slides: u,
            snapGrid: p,
            slidesGrid: h,
            slidesSizesGrid: g,
          }),
          i.centeredSlides && i.cssMode && !i.centeredSlidesBounds)
        ) {
          q(o, "--swiper-centered-offset-before", "".concat(-p[0], "px")),
            q(
              o,
              "--swiper-centered-offset-after",
              "".concat(e.size / 2 - g[g.length - 1] / 2, "px")
            );
          const t = -e.snapGrid[0],
            i = -e.slidesGrid[0];
          (e.snapGrid = e.snapGrid.map((e) => e + t)),
            (e.slidesGrid = e.slidesGrid.map((e) => e + i));
        }
        if (
          (c !== d && e.emit("slidesLengthChange"),
          p.length !== v &&
            (e.params.watchOverflow && e.checkOverflow(),
            e.emit("snapGridLengthChange")),
          h.length !== y && e.emit("slidesGridLengthChange"),
          i.watchSlidesProgress && e.updateSlidesOffset(),
          e.emit("slidesUpdated"),
          !(l || i.cssMode || ("slide" !== i.effect && "fade" !== i.effect)))
        ) {
          const t = "".concat(i.containerModifierClass, "backface-hidden"),
            o = e.el.classList.contains(t);
          c <= i.maxBackfaceHiddenSlides
            ? o || e.el.classList.add(t)
            : o && e.el.classList.remove(t);
        }
      },
      updateAutoHeight: function (e) {
        const t = this,
          i = [],
          o = t.virtual && t.params.virtual.enabled;
        let r,
          n = 0;
        "number" == typeof e
          ? t.setTransition(e)
          : !0 === e && t.setTransition(t.params.speed);
        const s = (e) => (o ? t.slides[t.getSlideIndexByData(e)] : t.slides[e]);
        if ("auto" !== t.params.slidesPerView && t.params.slidesPerView > 1)
          if (t.params.centeredSlides)
            (t.visibleSlides || []).forEach((e) => {
              i.push(e);
            });
          else
            for (r = 0; r < Math.ceil(t.params.slidesPerView); r += 1) {
              const e = t.activeIndex + r;
              if (e > t.slides.length && !o) break;
              i.push(s(e));
            }
        else i.push(s(t.activeIndex));
        for (r = 0; r < i.length; r += 1)
          if (void 0 !== i[r]) {
            const e = i[r].offsetHeight;
            n = e > n ? e : n;
          }
        (n || 0 === n) && (t.wrapperEl.style.height = "".concat(n, "px"));
      },
      updateSlidesOffset: function () {
        const e = this,
          t = e.slides,
          i = e.isElement
            ? e.isHorizontal()
              ? e.wrapperEl.offsetLeft
              : e.wrapperEl.offsetTop
            : 0;
        for (let o = 0; o < t.length; o += 1)
          t[o].swiperSlideOffset =
            (e.isHorizontal() ? t[o].offsetLeft : t[o].offsetTop) -
            i -
            e.cssOverflowAdjustment();
      },
      updateSlidesProgress: function (e) {
        void 0 === e && (e = (this && this.translate) || 0);
        const t = this,
          i = t.params,
          { slides: o, rtlTranslate: r, snapGrid: n } = t;
        if (0 === o.length) return;
        void 0 === o[0].swiperSlideOffset && t.updateSlidesOffset();
        let s = -e;
        r && (s = e), (t.visibleSlidesIndexes = []), (t.visibleSlides = []);
        let a = i.spaceBetween;
        "string" == typeof a && a.indexOf("%") >= 0
          ? (a = (parseFloat(a.replace("%", "")) / 100) * t.size)
          : "string" == typeof a && (a = parseFloat(a));
        for (let l = 0; l < o.length; l += 1) {
          const e = o[l];
          let d = e.swiperSlideOffset;
          i.cssMode && i.centeredSlides && (d -= o[0].swiperSlideOffset);
          const u =
              (s + (i.centeredSlides ? t.minTranslate() : 0) - d) /
              (e.swiperSlideSize + a),
            c =
              (s - n[0] + (i.centeredSlides ? t.minTranslate() : 0) - d) /
              (e.swiperSlideSize + a),
            p = -(s - d),
            h = p + t.slidesSizesGrid[l],
            g = p >= 0 && p <= t.size - t.slidesSizesGrid[l],
            f =
              (p >= 0 && p < t.size - 1) ||
              (h > 1 && h <= t.size) ||
              (p <= 0 && h >= t.size);
          f && (t.visibleSlides.push(e), t.visibleSlidesIndexes.push(l)),
            le(e, f, i.slideVisibleClass),
            le(e, g, i.slideFullyVisibleClass),
            (e.progress = r ? -u : u),
            (e.originalProgress = r ? -c : c);
        }
      },
      updateProgress: function (e) {
        const t = this;
        if (void 0 === e) {
          const i = t.rtlTranslate ? -1 : 1;
          e = (t && t.translate && t.translate * i) || 0;
        }
        const i = t.params,
          o = t.maxTranslate() - t.minTranslate();
        let { progress: r, isBeginning: n, isEnd: s, progressLoop: a } = t;
        const l = n,
          d = s;
        if (0 === o) (r = 0), (n = !0), (s = !0);
        else {
          r = (e - t.minTranslate()) / o;
          const i = Math.abs(e - t.minTranslate()) < 1,
            a = Math.abs(e - t.maxTranslate()) < 1;
          (n = i || r <= 0), (s = a || r >= 1), i && (r = 0), a && (r = 1);
        }
        if (i.loop) {
          const i = t.getSlideIndexByData(0),
            o = t.getSlideIndexByData(t.slides.length - 1),
            r = t.slidesGrid[i],
            n = t.slidesGrid[o],
            s = t.slidesGrid[t.slidesGrid.length - 1],
            l = Math.abs(e);
          (a = l >= r ? (l - r) / s : (l + s - n) / s), a > 1 && (a -= 1);
        }
        Object.assign(t, {
          progress: r,
          progressLoop: a,
          isBeginning: n,
          isEnd: s,
        }),
          (i.watchSlidesProgress || (i.centeredSlides && i.autoHeight)) &&
            t.updateSlidesProgress(e),
          n && !l && t.emit("reachBeginning toEdge"),
          s && !d && t.emit("reachEnd toEdge"),
          ((l && !n) || (d && !s)) && t.emit("fromEdge"),
          t.emit("progress", r);
      },
      updateSlidesClasses: function () {
        const e = this,
          { slides: t, params: i, slidesEl: o, activeIndex: r } = e,
          n = e.virtual && i.virtual.enabled,
          s = e.grid && i.grid && i.grid.rows > 1,
          a = (e) =>
            K(
              o,
              ".".concat(i.slideClass).concat(e, ", swiper-slide").concat(e)
            )[0];
        let l, d, u;
        if (n)
          if (i.loop) {
            let t = r - e.virtual.slidesBefore;
            t < 0 && (t = e.virtual.slides.length + t),
              t >= e.virtual.slides.length && (t -= e.virtual.slides.length),
              (l = a('[data-swiper-slide-index="'.concat(t, '"]')));
          } else l = a('[data-swiper-slide-index="'.concat(r, '"]'));
        else
          s
            ? ((l = t.find((e) => e.column === r)),
              (u = t.find((e) => e.column === r + 1)),
              (d = t.find((e) => e.column === r - 1)))
            : (l = t[r]);
        l &&
          (s ||
            ((u = (function (e, t) {
              const i = [];
              for (; e.nextElementSibling; ) {
                const o = e.nextElementSibling;
                t ? o.matches(t) && i.push(o) : i.push(o), (e = o);
              }
              return i;
            })(l, ".".concat(i.slideClass, ", swiper-slide"))[0]),
            i.loop && !u && (u = t[0]),
            (d = (function (e, t) {
              const i = [];
              for (; e.previousElementSibling; ) {
                const o = e.previousElementSibling;
                t ? o.matches(t) && i.push(o) : i.push(o), (e = o);
              }
              return i;
            })(l, ".".concat(i.slideClass, ", swiper-slide"))[0]),
            i.loop && 0 === !d && (d = t[t.length - 1]))),
          t.forEach((e) => {
            de(e, e === l, i.slideActiveClass),
              de(e, e === u, i.slideNextClass),
              de(e, e === d, i.slidePrevClass);
          }),
          e.emitSlidesClasses();
      },
      updateActiveIndex: function (e) {
        const t = this,
          i = t.rtlTranslate ? t.translate : -t.translate,
          {
            snapGrid: o,
            params: r,
            activeIndex: n,
            realIndex: s,
            snapIndex: a,
          } = t;
        let l,
          d = e;
        const u = (e) => {
          let i = e - t.virtual.slidesBefore;
          return (
            i < 0 && (i = t.virtual.slides.length + i),
            i >= t.virtual.slides.length && (i -= t.virtual.slides.length),
            i
          );
        };
        if (
          (void 0 === d &&
            (d = (function (e) {
              const { slidesGrid: t, params: i } = e,
                o = e.rtlTranslate ? e.translate : -e.translate;
              let r;
              for (let n = 0; n < t.length; n += 1)
                void 0 !== t[n + 1]
                  ? o >= t[n] && o < t[n + 1] - (t[n + 1] - t[n]) / 2
                    ? (r = n)
                    : o >= t[n] && o < t[n + 1] && (r = n + 1)
                  : o >= t[n] && (r = n);
              return (
                i.normalizeSlideIndex && (r < 0 || void 0 === r) && (r = 0), r
              );
            })(t)),
          o.indexOf(i) >= 0)
        )
          l = o.indexOf(i);
        else {
          const e = Math.min(r.slidesPerGroupSkip, d);
          l = e + Math.floor((d - e) / r.slidesPerGroup);
        }
        if ((l >= o.length && (l = o.length - 1), d === n && !t.params.loop))
          return void (
            l !== a && ((t.snapIndex = l), t.emit("snapIndexChange"))
          );
        if (d === n && t.params.loop && t.virtual && t.params.virtual.enabled)
          return void (t.realIndex = u(d));
        const c = t.grid && r.grid && r.grid.rows > 1;
        let p;
        if (t.virtual && r.virtual.enabled && r.loop) p = u(d);
        else if (c) {
          const e = t.slides.find((e) => e.column === d);
          let i = parseInt(e.getAttribute("data-swiper-slide-index"), 10);
          Number.isNaN(i) && (i = Math.max(t.slides.indexOf(e), 0)),
            (p = Math.floor(i / r.grid.rows));
        } else if (t.slides[d]) {
          const e = t.slides[d].getAttribute("data-swiper-slide-index");
          p = e ? parseInt(e, 10) : d;
        } else p = d;
        Object.assign(t, {
          previousSnapIndex: a,
          snapIndex: l,
          previousRealIndex: s,
          realIndex: p,
          previousIndex: n,
          activeIndex: d,
        }),
          t.initialized && pe(t),
          t.emit("activeIndexChange"),
          t.emit("snapIndexChange"),
          (t.initialized || t.params.runCallbacksOnInit) &&
            (s !== p && t.emit("realIndexChange"), t.emit("slideChange"));
      },
      updateClickedSlide: function (e, t) {
        const i = this,
          o = i.params;
        let r = e.closest(".".concat(o.slideClass, ", swiper-slide"));
        !r &&
          i.isElement &&
          t &&
          t.length > 1 &&
          t.includes(e) &&
          [...t.slice(t.indexOf(e) + 1, t.length)].forEach((e) => {
            !r &&
              e.matches &&
              e.matches(".".concat(o.slideClass, ", swiper-slide")) &&
              (r = e);
          });
        let n,
          s = !1;
        if (r)
          for (let a = 0; a < i.slides.length; a += 1)
            if (i.slides[a] === r) {
              (s = !0), (n = a);
              break;
            }
        if (!r || !s)
          return (i.clickedSlide = void 0), void (i.clickedIndex = void 0);
        (i.clickedSlide = r),
          i.virtual && i.params.virtual.enabled
            ? (i.clickedIndex = parseInt(
                r.getAttribute("data-swiper-slide-index"),
                10
              ))
            : (i.clickedIndex = n),
          o.slideToClickedSlide &&
            void 0 !== i.clickedIndex &&
            i.clickedIndex !== i.activeIndex &&
            i.slideToClickedSlide();
      },
    },
    translate: {
      getTranslate: function (e) {
        void 0 === e && (e = this.isHorizontal() ? "x" : "y");
        const { params: t, rtlTranslate: i, translate: o, wrapperEl: r } = this;
        if (t.virtualTranslate) return i ? -o : o;
        if (t.cssMode) return o;
        let n = V(r, e);
        return (n += this.cssOverflowAdjustment()), i && (n = -n), n || 0;
      },
      setTranslate: function (e, t) {
        const i = this,
          { rtlTranslate: o, params: r, wrapperEl: n, progress: s } = i;
        let a,
          l = 0,
          d = 0;
        i.isHorizontal() ? (l = o ? -e : e) : (d = e),
          r.roundLengths && ((l = Math.floor(l)), (d = Math.floor(d))),
          (i.previousTranslate = i.translate),
          (i.translate = i.isHorizontal() ? l : d),
          r.cssMode
            ? (n[i.isHorizontal() ? "scrollLeft" : "scrollTop"] =
                i.isHorizontal() ? -l : -d)
            : r.virtualTranslate ||
              (i.isHorizontal()
                ? (l -= i.cssOverflowAdjustment())
                : (d -= i.cssOverflowAdjustment()),
              (n.style.transform = "translate3d("
                .concat(l, "px, ")
                .concat(d, "px, ")
                .concat(0, "px)")));
        const u = i.maxTranslate() - i.minTranslate();
        (a = 0 === u ? 0 : (e - i.minTranslate()) / u),
          a !== s && i.updateProgress(e),
          i.emit("setTranslate", i.translate, t);
      },
      minTranslate: function () {
        return -this.snapGrid[0];
      },
      maxTranslate: function () {
        return -this.snapGrid[this.snapGrid.length - 1];
      },
      translateTo: function (e, t, i, o, r) {
        void 0 === e && (e = 0),
          void 0 === t && (t = this.params.speed),
          void 0 === i && (i = !0),
          void 0 === o && (o = !0);
        const n = this,
          { params: s, wrapperEl: a } = n;
        if (n.animating && s.preventInteractionOnTransition) return !1;
        const l = n.minTranslate(),
          d = n.maxTranslate();
        let u;
        if (
          ((u = o && e > l ? l : o && e < d ? d : e),
          n.updateProgress(u),
          s.cssMode)
        ) {
          const e = n.isHorizontal();
          if (0 === t) a[e ? "scrollLeft" : "scrollTop"] = -u;
          else {
            if (!n.support.smoothScroll)
              return (
                U({ swiper: n, targetPosition: -u, side: e ? "left" : "top" }),
                !0
              );
            a.scrollTo({ [e ? "left" : "top"]: -u, behavior: "smooth" });
          }
          return !0;
        }
        return (
          0 === t
            ? (n.setTransition(0),
              n.setTranslate(u),
              i &&
                (n.emit("beforeTransitionStart", t, r),
                n.emit("transitionEnd")))
            : (n.setTransition(t),
              n.setTranslate(u),
              i &&
                (n.emit("beforeTransitionStart", t, r),
                n.emit("transitionStart")),
              n.animating ||
                ((n.animating = !0),
                n.onTranslateToWrapperTransitionEnd ||
                  (n.onTranslateToWrapperTransitionEnd = function (e) {
                    n &&
                      !n.destroyed &&
                      e.target === this &&
                      (n.wrapperEl.removeEventListener(
                        "transitionend",
                        n.onTranslateToWrapperTransitionEnd
                      ),
                      (n.onTranslateToWrapperTransitionEnd = null),
                      delete n.onTranslateToWrapperTransitionEnd,
                      (n.animating = !1),
                      i && n.emit("transitionEnd"));
                  }),
                n.wrapperEl.addEventListener(
                  "transitionend",
                  n.onTranslateToWrapperTransitionEnd
                ))),
          !0
        );
      },
    },
    transition: {
      setTransition: function (e, t) {
        const i = this;
        i.params.cssMode ||
          ((i.wrapperEl.style.transitionDuration = "".concat(e, "ms")),
          (i.wrapperEl.style.transitionDelay = 0 === e ? "0ms" : "")),
          i.emit("setTransition", e, t);
      },
      transitionStart: function (e, t) {
        void 0 === e && (e = !0);
        const i = this,
          { params: o } = i;
        o.cssMode ||
          (o.autoHeight && i.updateAutoHeight(),
          he({ swiper: i, runCallbacks: e, direction: t, step: "Start" }));
      },
      transitionEnd: function (e, t) {
        void 0 === e && (e = !0);
        const i = this,
          { params: o } = i;
        (i.animating = !1),
          o.cssMode ||
            (i.setTransition(0),
            he({ swiper: i, runCallbacks: e, direction: t, step: "End" }));
      },
    },
    slide: {
      slideTo: function (e, t, i, o, r) {
        void 0 === e && (e = 0),
          void 0 === i && (i = !0),
          "string" == typeof e && (e = parseInt(e, 10));
        const n = this;
        let s = e;
        s < 0 && (s = 0);
        const {
          params: a,
          snapGrid: l,
          slidesGrid: d,
          previousIndex: u,
          activeIndex: c,
          rtlTranslate: p,
          wrapperEl: h,
          enabled: g,
        } = n;
        if (
          (!g && !o && !r) ||
          n.destroyed ||
          (n.animating && a.preventInteractionOnTransition)
        )
          return !1;
        void 0 === t && (t = n.params.speed);
        const f = Math.min(n.params.slidesPerGroupSkip, s);
        let m = f + Math.floor((s - f) / n.params.slidesPerGroup);
        m >= l.length && (m = l.length - 1);
        const v = -l[m];
        if (a.normalizeSlideIndex)
          for (let S = 0; S < d.length; S += 1) {
            const e = -Math.floor(100 * v),
              t = Math.floor(100 * d[S]),
              i = Math.floor(100 * d[S + 1]);
            void 0 !== d[S + 1]
              ? e >= t && e < i - (i - t) / 2
                ? (s = S)
                : e >= t && e < i && (s = S + 1)
              : e >= t && (s = S);
          }
        if (n.initialized && s !== c) {
          if (
            !n.allowSlideNext &&
            (p
              ? v > n.translate && v > n.minTranslate()
              : v < n.translate && v < n.minTranslate())
          )
            return !1;
          if (
            !n.allowSlidePrev &&
            v > n.translate &&
            v > n.maxTranslate() &&
            (c || 0) !== s
          )
            return !1;
        }
        let y;
        s !== (u || 0) && i && n.emit("beforeSlideChangeStart"),
          n.updateProgress(v),
          (y = s > c ? "next" : s < c ? "prev" : "reset");
        const w = n.virtual && n.params.virtual.enabled;
        if (
          !(w && r) &&
          ((p && -v === n.translate) || (!p && v === n.translate))
        )
          return (
            n.updateActiveIndex(s),
            a.autoHeight && n.updateAutoHeight(),
            n.updateSlidesClasses(),
            "slide" !== a.effect && n.setTranslate(v),
            "reset" !== y && (n.transitionStart(i, y), n.transitionEnd(i, y)),
            !1
          );
        if (a.cssMode) {
          const e = n.isHorizontal(),
            i = p ? v : -v;
          if (0 === t)
            w &&
              ((n.wrapperEl.style.scrollSnapType = "none"),
              (n._immediateVirtual = !0)),
              w && !n._cssModeVirtualInitialSet && n.params.initialSlide > 0
                ? ((n._cssModeVirtualInitialSet = !0),
                  requestAnimationFrame(() => {
                    h[e ? "scrollLeft" : "scrollTop"] = i;
                  }))
                : (h[e ? "scrollLeft" : "scrollTop"] = i),
              w &&
                requestAnimationFrame(() => {
                  (n.wrapperEl.style.scrollSnapType = ""),
                    (n._immediateVirtual = !1);
                });
          else {
            if (!n.support.smoothScroll)
              return (
                U({ swiper: n, targetPosition: i, side: e ? "left" : "top" }),
                !0
              );
            h.scrollTo({ [e ? "left" : "top"]: i, behavior: "smooth" });
          }
          return !0;
        }
        const b = ae().isSafari;
        return (
          w && !r && b && n.isElement && n.virtual.update(!1, !1, s),
          n.setTransition(t),
          n.setTranslate(v),
          n.updateActiveIndex(s),
          n.updateSlidesClasses(),
          n.emit("beforeTransitionStart", t, o),
          n.transitionStart(i, y),
          0 === t
            ? n.transitionEnd(i, y)
            : n.animating ||
              ((n.animating = !0),
              n.onSlideToWrapperTransitionEnd ||
                (n.onSlideToWrapperTransitionEnd = function (e) {
                  n &&
                    !n.destroyed &&
                    e.target === this &&
                    (n.wrapperEl.removeEventListener(
                      "transitionend",
                      n.onSlideToWrapperTransitionEnd
                    ),
                    (n.onSlideToWrapperTransitionEnd = null),
                    delete n.onSlideToWrapperTransitionEnd,
                    n.transitionEnd(i, y));
                }),
              n.wrapperEl.addEventListener(
                "transitionend",
                n.onSlideToWrapperTransitionEnd
              )),
          !0
        );
      },
      slideToLoop: function (e, t, i, o) {
        if (
          (void 0 === e && (e = 0),
          void 0 === i && (i = !0),
          "string" == typeof e)
        ) {
          e = parseInt(e, 10);
        }
        const r = this;
        if (r.destroyed) return;
        void 0 === t && (t = r.params.speed);
        const n = r.grid && r.params.grid && r.params.grid.rows > 1;
        let s = e;
        if (r.params.loop)
          if (r.virtual && r.params.virtual.enabled)
            s += r.virtual.slidesBefore;
          else {
            let e;
            if (n) {
              const t = s * r.params.grid.rows;
              e = r.slides.find(
                (e) => 1 * e.getAttribute("data-swiper-slide-index") === t
              ).column;
            } else e = r.getSlideIndexByData(s);
            const t = n
                ? Math.ceil(r.slides.length / r.params.grid.rows)
                : r.slides.length,
              { centeredSlides: i } = r.params;
            let a = r.params.slidesPerView;
            "auto" === a
              ? (a = r.slidesPerViewDynamic())
              : ((a = Math.ceil(parseFloat(r.params.slidesPerView, 10))),
                i && a % 2 == 0 && (a += 1));
            let l = t - e < a;
            if (
              (i && (l = l || e < Math.ceil(a / 2)),
              o && i && "auto" !== r.params.slidesPerView && !n && (l = !1),
              l)
            ) {
              const o = i
                ? e < r.activeIndex
                  ? "prev"
                  : "next"
                : e - r.activeIndex - 1 < r.params.slidesPerView
                ? "next"
                : "prev";
              r.loopFix({
                direction: o,
                slideTo: !0,
                activeSlideIndex: "next" === o ? e + 1 : e - t + 1,
                slideRealIndex: "next" === o ? r.realIndex : void 0,
              });
            }
            if (n) {
              const e = s * r.params.grid.rows;
              s = r.slides.find(
                (t) => 1 * t.getAttribute("data-swiper-slide-index") === e
              ).column;
            } else s = r.getSlideIndexByData(s);
          }
        return (
          requestAnimationFrame(() => {
            r.slideTo(s, t, i, o);
          }),
          r
        );
      },
      slideNext: function (e, t, i) {
        void 0 === t && (t = !0);
        const o = this,
          { enabled: r, params: n, animating: s } = o;
        if (!r || o.destroyed) return o;
        void 0 === e && (e = o.params.speed);
        let a = n.slidesPerGroup;
        "auto" === n.slidesPerView &&
          1 === n.slidesPerGroup &&
          n.slidesPerGroupAuto &&
          (a = Math.max(o.slidesPerViewDynamic("current", !0), 1));
        const l = o.activeIndex < n.slidesPerGroupSkip ? 1 : a,
          d = o.virtual && n.virtual.enabled;
        if (n.loop) {
          if (s && !d && n.loopPreventsSliding) return !1;
          if (
            (o.loopFix({ direction: "next" }),
            (o._clientLeft = o.wrapperEl.clientLeft),
            o.activeIndex === o.slides.length - 1 && n.cssMode)
          )
            return (
              requestAnimationFrame(() => {
                o.slideTo(o.activeIndex + l, e, t, i);
              }),
              !0
            );
        }
        return n.rewind && o.isEnd
          ? o.slideTo(0, e, t, i)
          : o.slideTo(o.activeIndex + l, e, t, i);
      },
      slidePrev: function (e, t, i) {
        void 0 === t && (t = !0);
        const o = this,
          {
            params: r,
            snapGrid: n,
            slidesGrid: s,
            rtlTranslate: a,
            enabled: l,
            animating: d,
          } = o;
        if (!l || o.destroyed) return o;
        void 0 === e && (e = o.params.speed);
        const u = o.virtual && r.virtual.enabled;
        if (r.loop) {
          if (d && !u && r.loopPreventsSliding) return !1;
          o.loopFix({ direction: "prev" }),
            (o._clientLeft = o.wrapperEl.clientLeft);
        }
        function c(e) {
          return e < 0 ? -Math.floor(Math.abs(e)) : Math.floor(e);
        }
        const p = c(a ? o.translate : -o.translate),
          h = n.map((e) => c(e)),
          g = r.freeMode && r.freeMode.enabled;
        let f = n[h.indexOf(p) - 1];
        if (void 0 === f && (r.cssMode || g)) {
          let e;
          n.forEach((t, i) => {
            p >= t && (e = i);
          }),
            void 0 !== e && (f = g ? n[e] : n[e > 0 ? e - 1 : e]);
        }
        let m = 0;
        if (
          (void 0 !== f &&
            ((m = s.indexOf(f)),
            m < 0 && (m = o.activeIndex - 1),
            "auto" === r.slidesPerView &&
              1 === r.slidesPerGroup &&
              r.slidesPerGroupAuto &&
              ((m = m - o.slidesPerViewDynamic("previous", !0) + 1),
              (m = Math.max(m, 0)))),
          r.rewind && o.isBeginning)
        ) {
          const r =
            o.params.virtual && o.params.virtual.enabled && o.virtual
              ? o.virtual.slides.length - 1
              : o.slides.length - 1;
          return o.slideTo(r, e, t, i);
        }
        return r.loop && 0 === o.activeIndex && r.cssMode
          ? (requestAnimationFrame(() => {
              o.slideTo(m, e, t, i);
            }),
            !0)
          : o.slideTo(m, e, t, i);
      },
      slideReset: function (e, t, i) {
        void 0 === t && (t = !0);
        const o = this;
        if (!o.destroyed)
          return (
            void 0 === e && (e = o.params.speed),
            o.slideTo(o.activeIndex, e, t, i)
          );
      },
      slideToClosest: function (e, t, i, o) {
        void 0 === t && (t = !0), void 0 === o && (o = 0.5);
        const r = this;
        if (r.destroyed) return;
        void 0 === e && (e = r.params.speed);
        let n = r.activeIndex;
        const s = Math.min(r.params.slidesPerGroupSkip, n),
          a = s + Math.floor((n - s) / r.params.slidesPerGroup),
          l = r.rtlTranslate ? r.translate : -r.translate;
        if (l >= r.snapGrid[a]) {
          const e = r.snapGrid[a];
          l - e > (r.snapGrid[a + 1] - e) * o && (n += r.params.slidesPerGroup);
        } else {
          const e = r.snapGrid[a - 1];
          l - e <= (r.snapGrid[a] - e) * o && (n -= r.params.slidesPerGroup);
        }
        return (
          (n = Math.max(n, 0)),
          (n = Math.min(n, r.slidesGrid.length - 1)),
          r.slideTo(n, e, t, i)
        );
      },
      slideToClickedSlide: function () {
        const e = this;
        if (e.destroyed) return;
        const { params: t, slidesEl: i } = e,
          o =
            "auto" === t.slidesPerView
              ? e.slidesPerViewDynamic()
              : t.slidesPerView;
        let r,
          n = e.getSlideIndexWhenGrid(e.clickedIndex);
        const s = e.isElement ? "swiper-slide" : ".".concat(t.slideClass),
          a = e.grid && e.params.grid && e.params.grid.rows > 1;
        if (t.loop) {
          if (e.animating) return;
          (r = parseInt(
            e.clickedSlide.getAttribute("data-swiper-slide-index"),
            10
          )),
            t.centeredSlides
              ? e.slideToLoop(r)
              : n >
                (a
                  ? (e.slides.length - o) / 2 - (e.params.grid.rows - 1)
                  : e.slides.length - o)
              ? (e.loopFix(),
                (n = e.getSlideIndex(
                  K(
                    i,
                    "".concat(s, '[data-swiper-slide-index="').concat(r, '"]')
                  )[0]
                )),
                W(() => {
                  e.slideTo(n);
                }))
              : e.slideTo(n);
        } else e.slideTo(n);
      },
    },
    loop: {
      loopCreate: function (e, t) {
        const i = this,
          { params: o, slidesEl: r } = i;
        if (!o.loop || (i.virtual && i.params.virtual.enabled)) return;
        const n = () => {
            K(r, ".".concat(o.slideClass, ", swiper-slide")).forEach((e, t) => {
              e.setAttribute("data-swiper-slide-index", t);
            });
          },
          s = i.grid && o.grid && o.grid.rows > 1;
        o.loopAddBlankSlides &&
          (o.slidesPerGroup > 1 || s) &&
          (() => {
            const e = K(r, ".".concat(o.slideBlankClass));
            e.forEach((e) => {
              e.remove();
            }),
              e.length > 0 && (i.recalcSlides(), i.updateSlides());
          })();
        const a = o.slidesPerGroup * (s ? o.grid.rows : 1),
          l = i.slides.length % a != 0,
          d = s && i.slides.length % o.grid.rows != 0,
          u = (e) => {
            for (let t = 0; t < e; t += 1) {
              const e = i.isElement
                ? J("swiper-slide", [o.slideBlankClass])
                : J("div", [o.slideClass, o.slideBlankClass]);
              i.slidesEl.append(e);
            }
          };
        if (l) {
          if (o.loopAddBlankSlides) {
            u(a - (i.slides.length % a)), i.recalcSlides(), i.updateSlides();
          } else Q();
          n();
        } else if (d) {
          if (o.loopAddBlankSlides) {
            u(o.grid.rows - (i.slides.length % o.grid.rows)),
              i.recalcSlides(),
              i.updateSlides();
          } else Q();
          n();
        } else n();
        i.loopFix({
          slideRealIndex: e,
          direction: o.centeredSlides ? void 0 : "next",
          initial: t,
        });
      },
      loopFix: function (e) {
        let {
          slideRealIndex: t,
          slideTo: i = !0,
          direction: o,
          setTranslate: r,
          activeSlideIndex: n,
          initial: s,
          byController: a,
          byMousewheel: l,
        } = void 0 === e ? {} : e;
        const d = this;
        if (!d.params.loop) return;
        d.emit("beforeLoopFix");
        const {
            slides: u,
            allowSlidePrev: c,
            allowSlideNext: p,
            slidesEl: h,
            params: g,
          } = d,
          { centeredSlides: f, initialSlide: m } = g;
        if (
          ((d.allowSlidePrev = !0),
          (d.allowSlideNext = !0),
          d.virtual && g.virtual.enabled)
        )
          return (
            i &&
              (g.centeredSlides || 0 !== d.snapIndex
                ? g.centeredSlides && d.snapIndex < g.slidesPerView
                  ? d.slideTo(d.virtual.slides.length + d.snapIndex, 0, !1, !0)
                  : d.snapIndex === d.snapGrid.length - 1 &&
                    d.slideTo(d.virtual.slidesBefore, 0, !1, !0)
                : d.slideTo(d.virtual.slides.length, 0, !1, !0)),
            (d.allowSlidePrev = c),
            (d.allowSlideNext = p),
            void d.emit("loopFix")
          );
        let v = g.slidesPerView;
        "auto" === v
          ? (v = d.slidesPerViewDynamic())
          : ((v = Math.ceil(parseFloat(g.slidesPerView, 10))),
            f && v % 2 == 0 && (v += 1));
        const y = g.slidesPerGroupAuto ? v : g.slidesPerGroup;
        let w = f ? Math.max(y, Math.ceil(v / 2)) : y;
        w % y != 0 && (w += y - (w % y)),
          (w += g.loopAdditionalSlides),
          (d.loopedSlides = w);
        const b = d.grid && g.grid && g.grid.rows > 1;
        (u.length < v + w ||
          ("cards" === d.params.effect && u.length < v + 2 * w) ||
          (b && "row" === g.grid.fill)) &&
          Q();
        const S = [],
          T = [],
          E = b ? Math.ceil(u.length / g.grid.rows) : u.length,
          C = s && E - m < v && !f;
        let x = C ? m : d.activeIndex;
        void 0 === n
          ? (n = d.getSlideIndex(
              u.find((e) => e.classList.contains(g.slideActiveClass))
            ))
          : (x = n);
        const I = "next" === o || !o,
          k = "prev" === o || !o;
        let P = 0,
          M = 0;
        const L =
          (b ? u[n].column : n) + (f && void 0 === r ? -v / 2 + 0.5 : 0);
        if (L < w) {
          P = Math.max(w - L, y);
          for (let e = 0; e < w - L; e += 1) {
            const t = e - Math.floor(e / E) * E;
            if (b) {
              const e = E - t - 1;
              for (let t = u.length - 1; t >= 0; t -= 1)
                u[t].column === e && S.push(t);
            } else S.push(E - t - 1);
          }
        } else if (L + v > E - w) {
          (M = Math.max(L - (E - 2 * w), y)),
            C && (M = Math.max(M, v - E + m + 1));
          for (let e = 0; e < M; e += 1) {
            const t = e - Math.floor(e / E) * E;
            b
              ? u.forEach((e, i) => {
                  e.column === t && T.push(i);
                })
              : T.push(t);
          }
        }
        if (
          ((d.__preventObserver__ = !0),
          requestAnimationFrame(() => {
            d.__preventObserver__ = !1;
          }),
          "cards" === d.params.effect &&
            u.length < v + 2 * w &&
            (T.includes(n) && T.splice(T.indexOf(n), 1),
            S.includes(n) && S.splice(S.indexOf(n), 1)),
          k &&
            S.forEach((e) => {
              (u[e].swiperLoopMoveDOM = !0),
                h.prepend(u[e]),
                (u[e].swiperLoopMoveDOM = !1);
            }),
          I &&
            T.forEach((e) => {
              (u[e].swiperLoopMoveDOM = !0),
                h.append(u[e]),
                (u[e].swiperLoopMoveDOM = !1);
            }),
          d.recalcSlides(),
          "auto" === g.slidesPerView
            ? d.updateSlides()
            : b &&
              ((S.length > 0 && k) || (T.length > 0 && I)) &&
              d.slides.forEach((e, t) => {
                d.grid.updateSlide(t, e, d.slides);
              }),
          g.watchSlidesProgress && d.updateSlidesOffset(),
          i)
        )
          if (S.length > 0 && k) {
            if (void 0 === t) {
              const e = d.slidesGrid[x],
                t = d.slidesGrid[x + P] - e;
              l
                ? d.setTranslate(d.translate - t)
                : (d.slideTo(x + Math.ceil(P), 0, !1, !0),
                  r &&
                    ((d.touchEventsData.startTranslate =
                      d.touchEventsData.startTranslate - t),
                    (d.touchEventsData.currentTranslate =
                      d.touchEventsData.currentTranslate - t)));
            } else if (r) {
              const e = b ? S.length / g.grid.rows : S.length;
              d.slideTo(d.activeIndex + e, 0, !1, !0),
                (d.touchEventsData.currentTranslate = d.translate);
            }
          } else if (T.length > 0 && I)
            if (void 0 === t) {
              const e = d.slidesGrid[x],
                t = d.slidesGrid[x - M] - e;
              l
                ? d.setTranslate(d.translate - t)
                : (d.slideTo(x - M, 0, !1, !0),
                  r &&
                    ((d.touchEventsData.startTranslate =
                      d.touchEventsData.startTranslate - t),
                    (d.touchEventsData.currentTranslate =
                      d.touchEventsData.currentTranslate - t)));
            } else {
              const e = b ? T.length / g.grid.rows : T.length;
              d.slideTo(d.activeIndex - e, 0, !1, !0);
            }
        if (
          ((d.allowSlidePrev = c),
          (d.allowSlideNext = p),
          d.controller && d.controller.control && !a)
        ) {
          const e = {
            slideRealIndex: t,
            direction: o,
            setTranslate: r,
            activeSlideIndex: n,
            byController: !0,
          };
          Array.isArray(d.controller.control)
            ? d.controller.control.forEach((t) => {
                !t.destroyed &&
                  t.params.loop &&
                  t.loopFix({
                    ...e,
                    slideTo: t.params.slidesPerView === g.slidesPerView && i,
                  });
              })
            : d.controller.control instanceof d.constructor &&
              d.controller.control.params.loop &&
              d.controller.control.loopFix({
                ...e,
                slideTo:
                  d.controller.control.params.slidesPerView ===
                    g.slidesPerView && i,
              });
        }
        d.emit("loopFix");
      },
      loopDestroy: function () {
        const e = this,
          { params: t, slidesEl: i } = e;
        if (!t.loop || !i || (e.virtual && e.params.virtual.enabled)) return;
        e.recalcSlides();
        const o = [];
        e.slides.forEach((e) => {
          const t =
            void 0 === e.swiperSlideIndex
              ? 1 * e.getAttribute("data-swiper-slide-index")
              : e.swiperSlideIndex;
          o[t] = e;
        }),
          e.slides.forEach((e) => {
            e.removeAttribute("data-swiper-slide-index");
          }),
          o.forEach((e) => {
            i.append(e);
          }),
          e.recalcSlides(),
          e.slideTo(e.realIndex, 0);
      },
    },
    grabCursor: {
      setGrabCursor: function (e) {
        const t = this;
        if (
          !t.params.simulateTouch ||
          (t.params.watchOverflow && t.isLocked) ||
          t.params.cssMode
        )
          return;
        const i =
          "container" === t.params.touchEventsTarget ? t.el : t.wrapperEl;
        t.isElement && (t.__preventObserver__ = !0),
          (i.style.cursor = "move"),
          (i.style.cursor = e ? "grabbing" : "grab"),
          t.isElement &&
            requestAnimationFrame(() => {
              t.__preventObserver__ = !1;
            });
      },
      unsetGrabCursor: function () {
        const e = this;
        (e.params.watchOverflow && e.isLocked) ||
          e.params.cssMode ||
          (e.isElement && (e.__preventObserver__ = !0),
          (e[
            "container" === e.params.touchEventsTarget ? "el" : "wrapperEl"
          ].style.cursor = ""),
          e.isElement &&
            requestAnimationFrame(() => {
              e.__preventObserver__ = !1;
            }));
      },
    },
    events: {
      attachEvents: function () {
        const e = this,
          { params: t } = e;
        (e.onTouchStart = fe.bind(e)),
          (e.onTouchMove = me.bind(e)),
          (e.onTouchEnd = ve.bind(e)),
          (e.onDocumentTouchStart = Te.bind(e)),
          t.cssMode && (e.onScroll = be.bind(e)),
          (e.onClick = we.bind(e)),
          (e.onLoad = Se.bind(e)),
          Ee(e, "on");
      },
      detachEvents: function () {
        Ee(this, "off");
      },
    },
    breakpoints: xe,
    checkOverflow: {
      checkOverflow: function () {
        const e = this,
          { isLocked: t, params: i } = e,
          { slidesOffsetBefore: o } = i;
        if (o) {
          const t = e.slides.length - 1,
            i = e.slidesGrid[t] + e.slidesSizesGrid[t] + 2 * o;
          e.isLocked = e.size > i;
        } else e.isLocked = 1 === e.snapGrid.length;
        !0 === i.allowSlideNext && (e.allowSlideNext = !e.isLocked),
          !0 === i.allowSlidePrev && (e.allowSlidePrev = !e.isLocked),
          t && t !== e.isLocked && (e.isEnd = !1),
          t !== e.isLocked && e.emit(e.isLocked ? "lock" : "unlock");
      },
    },
    classes: {
      addClasses: function () {
        const e = this,
          { classNames: t, params: i, rtl: o, el: r, device: n } = e,
          s = (function (e, t) {
            const i = [];
            return (
              e.forEach((e) => {
                "object" == typeof e
                  ? Object.keys(e).forEach((o) => {
                      e[o] && i.push(t + o);
                    })
                  : "string" == typeof e && i.push(t + e);
              }),
              i
            );
          })(
            [
              "initialized",
              i.direction,
              { "free-mode": e.params.freeMode && i.freeMode.enabled },
              { autoheight: i.autoHeight },
              { rtl: o },
              { grid: i.grid && i.grid.rows > 1 },
              {
                "grid-column":
                  i.grid && i.grid.rows > 1 && "column" === i.grid.fill,
              },
              { android: n.android },
              { ios: n.ios },
              { "css-mode": i.cssMode },
              { centered: i.cssMode && i.centeredSlides },
              { "watch-progress": i.watchSlidesProgress },
            ],
            i.containerModifierClass
          );
        t.push(...s), r.classList.add(...t), e.emitContainerClasses();
      },
      removeClasses: function () {
        const { el: e, classNames: t } = this;
        e &&
          "string" != typeof e &&
          (e.classList.remove(...t), this.emitContainerClasses());
      },
    },
  },
  Me = {};
let Le = class e {
  constructor() {
    let t, i;
    for (var o = arguments.length, r = new Array(o), n = 0; n < o; n++)
      r[n] = arguments[n];
    1 === r.length &&
    r[0].constructor &&
    "Object" === Object.prototype.toString.call(r[0]).slice(8, -1)
      ? (i = r[0])
      : ([t, i] = r),
      i || (i = {}),
      (i = X({}, i)),
      t && !i.el && (i.el = t);
    const s = F();
    if (
      i.el &&
      "string" == typeof i.el &&
      s.querySelectorAll(i.el).length > 1
    ) {
      const t = [];
      return (
        s.querySelectorAll(i.el).forEach((o) => {
          const r = X({}, i, { el: o });
          t.push(new e(r));
        }),
        t
      );
    }
    const a = this;
    (a.__swiper__ = !0),
      (a.support = ne()),
      (a.device = se({ userAgent: i.userAgent })),
      (a.browser = ae()),
      (a.eventsListeners = {}),
      (a.eventsAnyListeners = []),
      (a.modules = [...a.__modules__]),
      i.modules && Array.isArray(i.modules) && a.modules.push(...i.modules);
    const l = {};
    a.modules.forEach((e) => {
      e({
        params: i,
        swiper: a,
        extendParams: ke(i, l),
        on: a.on.bind(a),
        once: a.once.bind(a),
        off: a.off.bind(a),
        emit: a.emit.bind(a),
      });
    });
    const d = X({}, Ie, l);
    return (
      (a.params = X({}, d, Me, i)),
      (a.originalParams = X({}, a.params)),
      (a.passedParams = X({}, i)),
      a.params &&
        a.params.on &&
        Object.keys(a.params.on).forEach((e) => {
          a.on(e, a.params.on[e]);
        }),
      a.params && a.params.onAny && a.onAny(a.params.onAny),
      Object.assign(a, {
        enabled: a.params.enabled,
        el: t,
        // Classes
        classNames: [],
        // Slides
        slides: [],
        slidesGrid: [],
        snapGrid: [],
        slidesSizesGrid: [],
        // isDirection
        isHorizontal: () => "horizontal" === a.params.direction,
        isVertical: () => "vertical" === a.params.direction,
        // Indexes
        activeIndex: 0,
        realIndex: 0,
        isBeginning: !0,
        isEnd: !1,
        // Props
        translate: 0,
        previousTranslate: 0,
        progress: 0,
        velocity: 0,
        animating: !1,
        cssOverflowAdjustment() {
          return Math.trunc(this.translate / 2 ** 23) * 2 ** 23;
        },
        // Locks
        allowSlideNext: a.params.allowSlideNext,
        allowSlidePrev: a.params.allowSlidePrev,
        // Touch Events
        touchEventsData: {
          isTouched: void 0,
          isMoved: void 0,
          allowTouchCallbacks: void 0,
          touchStartTime: void 0,
          isScrolling: void 0,
          currentTranslate: void 0,
          startTranslate: void 0,
          allowThresholdMove: void 0,
          // Form elements to match
          focusableElements: a.params.focusableElements,
          // Last click time
          lastClickTime: 0,
          clickTimeout: void 0,
          // Velocities
          velocities: [],
          allowMomentumBounce: void 0,
          startMoving: void 0,
          pointerId: null,
          touchId: null,
        },
        // Clicks
        allowClick: !0,
        // Touches
        allowTouchMove: a.params.allowTouchMove,
        touches: { startX: 0, startY: 0, currentX: 0, currentY: 0, diff: 0 },
        // Images
        imagesToLoad: [],
        imagesLoaded: 0,
      }),
      a.emit("_swiper"),
      a.params.init && a.init(),
      a
    );
  }
  getDirectionLabel(e) {
    return this.isHorizontal()
      ? e
      : {
          width: "height",
          "margin-top": "margin-left",
          "margin-bottom ": "margin-right",
          "margin-left": "margin-top",
          "margin-right": "margin-bottom",
          "padding-left": "padding-top",
          "padding-right": "padding-bottom",
          marginRight: "marginBottom",
        }[e];
  }
  getSlideIndex(e) {
    const { slidesEl: t, params: i } = this,
      o = Z(K(t, ".".concat(i.slideClass, ", swiper-slide"))[0]);
    return Z(e) - o;
  }
  getSlideIndexByData(e) {
    return this.getSlideIndex(
      this.slides.find(
        (t) => 1 * t.getAttribute("data-swiper-slide-index") === e
      )
    );
  }
  getSlideIndexWhenGrid(e) {
    return (
      this.grid &&
        this.params.grid &&
        this.params.grid.rows > 1 &&
        ("column" === this.params.grid.fill
          ? (e = Math.floor(e / this.params.grid.rows))
          : "row" === this.params.grid.fill &&
            (e %= Math.ceil(this.slides.length / this.params.grid.rows))),
      e
    );
  }
  recalcSlides() {
    const { slidesEl: e, params: t } = this;
    this.slides = K(e, ".".concat(t.slideClass, ", swiper-slide"));
  }
  enable() {
    const e = this;
    e.enabled ||
      ((e.enabled = !0),
      e.params.grabCursor && e.setGrabCursor(),
      e.emit("enable"));
  }
  disable() {
    const e = this;
    e.enabled &&
      ((e.enabled = !1),
      e.params.grabCursor && e.unsetGrabCursor(),
      e.emit("disable"));
  }
  setProgress(e, t) {
    const i = this;
    e = Math.min(Math.max(e, 0), 1);
    const o = i.minTranslate(),
      r = (i.maxTranslate() - o) * e + o;
    i.translateTo(r, void 0 === t ? 0 : t),
      i.updateActiveIndex(),
      i.updateSlidesClasses();
  }
  emitContainerClasses() {
    const e = this;
    if (!e.params._emitClasses || !e.el) return;
    const t = e.el.className
      .split(" ")
      .filter(
        (t) =>
          0 === t.indexOf("swiper") ||
          0 === t.indexOf(e.params.containerModifierClass)
      );
    e.emit("_containerClasses", t.join(" "));
  }
  getSlideClasses(e) {
    const t = this;
    return t.destroyed
      ? ""
      : e.className
          .split(" ")
          .filter(
            (e) =>
              0 === e.indexOf("swiper-slide") ||
              0 === e.indexOf(t.params.slideClass)
          )
          .join(" ");
  }
  emitSlidesClasses() {
    const e = this;
    if (!e.params._emitClasses || !e.el) return;
    const t = [];
    e.slides.forEach((i) => {
      const o = e.getSlideClasses(i);
      t.push({ slideEl: i, classNames: o }), e.emit("_slideClass", i, o);
    }),
      e.emit("_slideClasses", t);
  }
  slidesPerViewDynamic(e, t) {
    void 0 === e && (e = "current"), void 0 === t && (t = !1);
    const {
      params: i,
      slides: o,
      slidesGrid: r,
      slidesSizesGrid: n,
      size: s,
      activeIndex: a,
    } = this;
    let l = 1;
    if ("number" == typeof i.slidesPerView) return i.slidesPerView;
    if (i.centeredSlides) {
      let e,
        t = o[a] ? Math.ceil(o[a].swiperSlideSize) : 0;
      for (let i = a + 1; i < o.length; i += 1)
        o[i] &&
          !e &&
          ((t += Math.ceil(o[i].swiperSlideSize)), (l += 1), t > s && (e = !0));
      for (let i = a - 1; i >= 0; i -= 1)
        o[i] &&
          !e &&
          ((t += o[i].swiperSlideSize), (l += 1), t > s && (e = !0));
    } else if ("current" === e)
      for (let d = a + 1; d < o.length; d += 1) {
        (t ? r[d] + n[d] - r[a] < s : r[d] - r[a] < s) && (l += 1);
      }
    else
      for (let d = a - 1; d >= 0; d -= 1) {
        r[a] - r[d] < s && (l += 1);
      }
    return l;
  }
  update() {
    const e = this;
    if (!e || e.destroyed) return;
    const { snapGrid: t, params: i } = e;
    function o() {
      const t = e.rtlTranslate ? -1 * e.translate : e.translate,
        i = Math.min(Math.max(t, e.maxTranslate()), e.minTranslate());
      e.setTranslate(i), e.updateActiveIndex(), e.updateSlidesClasses();
    }
    let r;
    if (
      (i.breakpoints && e.setBreakpoint(),
      [...e.el.querySelectorAll('[loading="lazy"]')].forEach((t) => {
        t.complete && ue(e, t);
      }),
      e.updateSize(),
      e.updateSlides(),
      e.updateProgress(),
      e.updateSlidesClasses(),
      i.freeMode && i.freeMode.enabled && !i.cssMode)
    )
      o(), i.autoHeight && e.updateAutoHeight();
    else {
      if (
        ("auto" === i.slidesPerView || i.slidesPerView > 1) &&
        e.isEnd &&
        !i.centeredSlides
      ) {
        const t = e.virtual && i.virtual.enabled ? e.virtual.slides : e.slides;
        r = e.slideTo(t.length - 1, 0, !1, !0);
      } else r = e.slideTo(e.activeIndex, 0, !1, !0);
      r || o();
    }
    i.watchOverflow && t !== e.snapGrid && e.checkOverflow(), e.emit("update");
  }
  changeDirection(e, t) {
    void 0 === t && (t = !0);
    const i = this,
      o = i.params.direction;
    return (
      e || (e = "horizontal" === o ? "vertical" : "horizontal"),
      e === o ||
        ("horizontal" !== e && "vertical" !== e) ||
        (i.el.classList.remove(
          "".concat(i.params.containerModifierClass).concat(o)
        ),
        i.el.classList.add(
          "".concat(i.params.containerModifierClass).concat(e)
        ),
        i.emitContainerClasses(),
        (i.params.direction = e),
        i.slides.forEach((t) => {
          "vertical" === e ? (t.style.width = "") : (t.style.height = "");
        }),
        i.emit("changeDirection"),
        t && i.update()),
      i
    );
  }
  changeLanguageDirection(e) {
    const t = this;
    (t.rtl && "rtl" === e) ||
      (!t.rtl && "ltr" === e) ||
      ((t.rtl = "rtl" === e),
      (t.rtlTranslate = "horizontal" === t.params.direction && t.rtl),
      t.rtl
        ? (t.el.classList.add(
            "".concat(t.params.containerModifierClass, "rtl")
          ),
          (t.el.dir = "rtl"))
        : (t.el.classList.remove(
            "".concat(t.params.containerModifierClass, "rtl")
          ),
          (t.el.dir = "ltr")),
      t.update());
  }
  mount(e) {
    const t = this;
    if (t.mounted) return !0;
    let i = e || t.params.el;
    if (("string" == typeof i && (i = document.querySelector(i)), !i))
      return !1;
    (i.swiper = t),
      i.parentNode &&
        i.parentNode.host &&
        i.parentNode.host.nodeName ===
          t.params.swiperElementNodeName.toUpperCase() &&
        (t.isElement = !0);
    const o = () =>
      ".".concat((t.params.wrapperClass || "").trim().split(" ").join("."));
    let r = (() => {
      if (i && i.shadowRoot && i.shadowRoot.querySelector) {
        return i.shadowRoot.querySelector(o());
      }
      return K(i, o())[0];
    })();
    return (
      !r &&
        t.params.createElements &&
        ((r = J("div", t.params.wrapperClass)),
        i.append(r),
        K(i, ".".concat(t.params.slideClass)).forEach((e) => {
          r.append(e);
        })),
      Object.assign(t, {
        el: i,
        wrapperEl: r,
        slidesEl:
          t.isElement && !i.parentNode.host.slideSlots ? i.parentNode.host : r,
        hostEl: t.isElement ? i.parentNode.host : i,
        mounted: !0,
        // RTL
        rtl: "rtl" === i.dir.toLowerCase() || "rtl" === $(i, "direction"),
        rtlTranslate:
          "horizontal" === t.params.direction &&
          ("rtl" === i.dir.toLowerCase() || "rtl" === $(i, "direction")),
        wrongRTL: "-webkit-box" === $(r, "display"),
      }),
      !0
    );
  }
  init(e) {
    const t = this;
    if (t.initialized) return t;
    if (!1 === t.mount(e)) return t;
    t.emit("beforeInit"),
      t.params.breakpoints && t.setBreakpoint(),
      t.addClasses(),
      t.updateSize(),
      t.updateSlides(),
      t.params.watchOverflow && t.checkOverflow(),
      t.params.grabCursor && t.enabled && t.setGrabCursor(),
      t.params.loop && t.virtual && t.params.virtual.enabled
        ? t.slideTo(
            t.params.initialSlide + t.virtual.slidesBefore,
            0,
            t.params.runCallbacksOnInit,
            !1,
            !0
          )
        : t.slideTo(
            t.params.initialSlide,
            0,
            t.params.runCallbacksOnInit,
            !1,
            !0
          ),
      t.params.loop && t.loopCreate(void 0, !0),
      t.attachEvents();
    const i = [...t.el.querySelectorAll('[loading="lazy"]')];
    return (
      t.isElement && i.push(...t.hostEl.querySelectorAll('[loading="lazy"]')),
      i.forEach((e) => {
        e.complete
          ? ue(t, e)
          : e.addEventListener("load", (e) => {
              ue(t, e.target);
            });
      }),
      pe(t),
      (t.initialized = !0),
      pe(t),
      t.emit("init"),
      t.emit("afterInit"),
      t
    );
  }
  destroy(e, t) {
    void 0 === e && (e = !0), void 0 === t && (t = !0);
    const i = this,
      { params: o, el: r, wrapperEl: n, slides: s } = i;
    return (
      void 0 === i.params ||
        i.destroyed ||
        (i.emit("beforeDestroy"),
        (i.initialized = !1),
        i.detachEvents(),
        o.loop && i.loopDestroy(),
        t &&
          (i.removeClasses(),
          r && "string" != typeof r && r.removeAttribute("style"),
          n && n.removeAttribute("style"),
          s &&
            s.length &&
            s.forEach((e) => {
              e.classList.remove(
                o.slideVisibleClass,
                o.slideFullyVisibleClass,
                o.slideActiveClass,
                o.slideNextClass,
                o.slidePrevClass
              ),
                e.removeAttribute("style"),
                e.removeAttribute("data-swiper-slide-index");
            })),
        i.emit("destroy"),
        Object.keys(i.eventsListeners).forEach((e) => {
          i.off(e);
        }),
        !1 !== e &&
          (i.el && "string" != typeof i.el && (i.el.swiper = null),
          (function (e) {
            const t = e;
            Object.keys(t).forEach((e) => {
              try {
                t[e] = null;
              } catch (i) {}
              try {
                delete t[e];
              } catch (i) {}
            });
          })(i)),
        (i.destroyed = !0)),
      null
    );
  }
  static extendDefaults(e) {
    X(Me, e);
  }
  static get extendedDefaults() {
    return Me;
  }
  static get defaults() {
    return Ie;
  }
  static installModule(t) {
    e.prototype.__modules__ || (e.prototype.__modules__ = []);
    const i = e.prototype.__modules__;
    "function" == typeof t && i.indexOf(t) < 0 && i.push(t);
  }
  static use(t) {
    return Array.isArray(t)
      ? (t.forEach((t) => e.installModule(t)), e)
      : (e.installModule(t), e);
  }
};
function _e(e) {
  let t,
    i,
    { swiper: o, extendParams: r, on: n, emit: s, params: a } = e;
  (o.autoplay = { running: !1, paused: !1, timeLeft: 0 }),
    r({
      autoplay: {
        enabled: !1,
        delay: 3e3,
        waitForTransition: !0,
        disableOnInteraction: !1,
        stopOnLastSlide: !1,
        reverseDirection: !1,
        pauseOnMouseEnter: !1,
      },
    });
  let l,
    d,
    u,
    c,
    p,
    h,
    g,
    f,
    m = a && a.autoplay ? a.autoplay.delay : 3e3,
    v = a && a.autoplay ? a.autoplay.delay : 3e3,
    y = new Date().getTime();
  function w(e) {
    o &&
      !o.destroyed &&
      o.wrapperEl &&
      e.target === o.wrapperEl &&
      (o.wrapperEl.removeEventListener("transitionend", w),
      f || (e.detail && e.detail.bySwiperTouchMove) || x());
  }
  const b = () => {
      if (o.destroyed || !o.autoplay.running) return;
      o.autoplay.paused ? (d = !0) : d && ((v = l), (d = !1));
      const e = o.autoplay.paused ? l : y + v - new Date().getTime();
      (o.autoplay.timeLeft = e),
        s("autoplayTimeLeft", e, e / m),
        (i = requestAnimationFrame(() => {
          b();
        }));
    },
    S = (e) => {
      if (o.destroyed || !o.autoplay.running) return;
      cancelAnimationFrame(i), b();
      let r = void 0 === e ? o.params.autoplay.delay : e;
      (m = o.params.autoplay.delay), (v = o.params.autoplay.delay);
      const n = (() => {
        let e;
        if (
          ((e =
            o.virtual && o.params.virtual.enabled
              ? o.slides.find((e) =>
                  e.classList.contains("swiper-slide-active")
                )
              : o.slides[o.activeIndex]),
          !e)
        )
          return;
        return parseInt(e.getAttribute("data-swiper-autoplay"), 10);
      })();
      !Number.isNaN(n) && n > 0 && void 0 === e && ((r = n), (m = n), (v = n)),
        (l = r);
      const a = o.params.speed,
        d = () => {
          o &&
            !o.destroyed &&
            (o.params.autoplay.reverseDirection
              ? !o.isBeginning || o.params.loop || o.params.rewind
                ? (o.slidePrev(a, !0, !0), s("autoplay"))
                : o.params.autoplay.stopOnLastSlide ||
                  (o.slideTo(o.slides.length - 1, a, !0, !0), s("autoplay"))
              : !o.isEnd || o.params.loop || o.params.rewind
              ? (o.slideNext(a, !0, !0), s("autoplay"))
              : o.params.autoplay.stopOnLastSlide ||
                (o.slideTo(0, a, !0, !0), s("autoplay")),
            o.params.cssMode &&
              ((y = new Date().getTime()),
              requestAnimationFrame(() => {
                S();
              })));
        };
      return (
        r > 0
          ? (clearTimeout(t),
            (t = setTimeout(() => {
              d();
            }, r)))
          : requestAnimationFrame(() => {
              d();
            }),
        r
      );
    },
    T = () => {
      (y = new Date().getTime()),
        (o.autoplay.running = !0),
        S(),
        s("autoplayStart");
    },
    E = () => {
      (o.autoplay.running = !1),
        clearTimeout(t),
        cancelAnimationFrame(i),
        s("autoplayStop");
    },
    C = (e, i) => {
      if (o.destroyed || !o.autoplay.running) return;
      clearTimeout(t), e || (g = !0);
      const r = () => {
        s("autoplayPause"),
          o.params.autoplay.waitForTransition
            ? o.wrapperEl.addEventListener("transitionend", w)
            : x();
      };
      if (((o.autoplay.paused = !0), i))
        return h && (l = o.params.autoplay.delay), (h = !1), void r();
      const n = l || o.params.autoplay.delay;
      (l = n - (new Date().getTime() - y)),
        (o.isEnd && l < 0 && !o.params.loop) || (l < 0 && (l = 0), r());
    },
    x = () => {
      (o.isEnd && l < 0 && !o.params.loop) ||
        o.destroyed ||
        !o.autoplay.running ||
        ((y = new Date().getTime()),
        g ? ((g = !1), S(l)) : S(),
        (o.autoplay.paused = !1),
        s("autoplayResume"));
    },
    I = () => {
      if (o.destroyed || !o.autoplay.running) return;
      const e = F();
      "hidden" === e.visibilityState && ((g = !0), C(!0)),
        "visible" === e.visibilityState && x();
    },
    k = (e) => {
      "mouse" === e.pointerType &&
        ((g = !0), (f = !0), o.animating || o.autoplay.paused || C(!0));
    },
    P = (e) => {
      "mouse" === e.pointerType && ((f = !1), o.autoplay.paused && x());
    };
  n("init", () => {
    o.params.autoplay.enabled &&
      (o.params.autoplay.pauseOnMouseEnter &&
        (o.el.addEventListener("pointerenter", k),
        o.el.addEventListener("pointerleave", P)),
      F().addEventListener("visibilitychange", I),
      T());
  }),
    n("destroy", () => {
      o.el &&
        "string" != typeof o.el &&
        (o.el.removeEventListener("pointerenter", k),
        o.el.removeEventListener("pointerleave", P)),
        F().removeEventListener("visibilitychange", I),
        o.autoplay.running && E();
    }),
    n("_freeModeStaticRelease", () => {
      (c || g) && x();
    }),
    n("_freeModeNoMomentumRelease", () => {
      o.params.autoplay.disableOnInteraction ? E() : C(!0, !0);
    }),
    n("beforeTransitionStart", (e, t, i) => {
      !o.destroyed &&
        o.autoplay.running &&
        (i || !o.params.autoplay.disableOnInteraction ? C(!0, !0) : E());
    }),
    n("sliderFirstMove", () => {
      !o.destroyed &&
        o.autoplay.running &&
        (o.params.autoplay.disableOnInteraction
          ? E()
          : ((u = !0),
            (c = !1),
            (g = !1),
            (p = setTimeout(() => {
              (g = !0), (c = !0), C(!0);
            }, 200))));
    }),
    n("touchEnd", () => {
      if (!o.destroyed && o.autoplay.running && u) {
        if (
          (clearTimeout(p),
          clearTimeout(t),
          o.params.autoplay.disableOnInteraction)
        )
          return (c = !1), void (u = !1);
        c && o.params.cssMode && x(), (c = !1), (u = !1);
      }
    }),
    n("slideChange", () => {
      !o.destroyed && o.autoplay.running && (h = !0);
    }),
    Object.assign(o.autoplay, { start: T, stop: E, pause: C, resume: x });
}
Object.keys(Pe).forEach((e) => {
  Object.keys(Pe[e]).forEach((t) => {
    Le.prototype[t] = Pe[e][t];
  });
}),
  Le.use([
    function (e) {
      let { swiper: t, on: i, emit: o } = e;
      const r = j();
      let n = null,
        s = null;
      const a = () => {
          t &&
            !t.destroyed &&
            t.initialized &&
            (o("beforeResize"), o("resize"));
        },
        l = () => {
          t && !t.destroyed && t.initialized && o("orientationchange");
        };
      i("init", () => {
        t.params.resizeObserver && void 0 !== r.ResizeObserver
          ? t &&
            !t.destroyed &&
            t.initialized &&
            ((n = new ResizeObserver((e) => {
              s = r.requestAnimationFrame(() => {
                const { width: i, height: o } = t;
                let r = i,
                  n = o;
                e.forEach((e) => {
                  let { contentBoxSize: i, contentRect: o, target: s } = e;
                  (s && s !== t.el) ||
                    ((r = o ? o.width : (i[0] || i).inlineSize),
                    (n = o ? o.height : (i[0] || i).blockSize));
                }),
                  (r === i && n === o) || a();
              });
            })),
            n.observe(t.el))
          : (r.addEventListener("resize", a),
            r.addEventListener("orientationchange", l));
      }),
        i("destroy", () => {
          s && r.cancelAnimationFrame(s),
            n && n.unobserve && t.el && (n.unobserve(t.el), (n = null)),
            r.removeEventListener("resize", a),
            r.removeEventListener("orientationchange", l);
        });
    },
    function (e) {
      let { swiper: t, extendParams: i, on: o, emit: r } = e;
      const n = [],
        s = j(),
        a = function (e, i) {
          void 0 === i && (i = {});
          const o = new (s.MutationObserver || s.WebkitMutationObserver)(
            (e) => {
              if (t.__preventObserver__) return;
              if (1 === e.length) return void r("observerUpdate", e[0]);
              const i = function () {
                r("observerUpdate", e[0]);
              };
              s.requestAnimationFrame
                ? s.requestAnimationFrame(i)
                : s.setTimeout(i, 0);
            }
          );
          o.observe(e, {
            attributes: void 0 === i.attributes || i.attributes,
            childList: t.isElement || (void 0 === i.childList || i).childList,
            characterData: void 0 === i.characterData || i.characterData,
          }),
            n.push(o);
        };
      i({ observer: !1, observeParents: !1, observeSlideChildren: !1 }),
        o("init", () => {
          if (t.params.observer) {
            if (t.params.observeParents) {
              const e = (function (e, t) {
                const i = [];
                let o = e.parentElement;
                for (; o; )
                  t ? o.matches(t) && i.push(o) : i.push(o),
                    (o = o.parentElement);
                return i;
              })(t.hostEl);
              for (let t = 0; t < e.length; t += 1) a(e[t]);
            }
            a(t.hostEl, { childList: t.params.observeSlideChildren }),
              a(t.wrapperEl, { attributes: !1 });
          }
        }),
        o("destroy", () => {
          n.forEach((e) => {
            e.disconnect();
          }),
            n.splice(0, n.length);
        });
    },
  ]);
const Be = [
  "eventsPrefix",
  "injectStyles",
  "injectStylesUrls",
  "modules",
  "init",
  "_direction",
  "oneWayMovement",
  "swiperElementNodeName",
  "touchEventsTarget",
  "initialSlide",
  "_speed",
  "cssMode",
  "updateOnWindowResize",
  "resizeObserver",
  "nested",
  "focusableElements",
  "_enabled",
  "_width",
  "_height",
  "preventInteractionOnTransition",
  "userAgent",
  "url",
  "_edgeSwipeDetection",
  "_edgeSwipeThreshold",
  "_freeMode",
  "_autoHeight",
  "setWrapperSize",
  "virtualTranslate",
  "_effect",
  "breakpoints",
  "breakpointsBase",
  "_spaceBetween",
  "_slidesPerView",
  "maxBackfaceHiddenSlides",
  "_grid",
  "_slidesPerGroup",
  "_slidesPerGroupSkip",
  "_slidesPerGroupAuto",
  "_centeredSlides",
  "_centeredSlidesBounds",
  "_slidesOffsetBefore",
  "_slidesOffsetAfter",
  "normalizeSlideIndex",
  "_centerInsufficientSlides",
  "_watchOverflow",
  "roundLengths",
  "touchRatio",
  "touchAngle",
  "simulateTouch",
  "_shortSwipes",
  "_longSwipes",
  "longSwipesRatio",
  "longSwipesMs",
  "_followFinger",
  "allowTouchMove",
  "_threshold",
  "touchMoveStopPropagation",
  "touchStartPreventDefault",
  "touchStartForcePreventDefault",
  "touchReleaseOnEdges",
  "uniqueNavElements",
  "_resistance",
  "_resistanceRatio",
  "_watchSlidesProgress",
  "_grabCursor",
  "preventClicks",
  "preventClicksPropagation",
  "_slideToClickedSlide",
  "_loop",
  "loopAdditionalSlides",
  "loopAddBlankSlides",
  "loopPreventsSliding",
  "_rewind",
  "_allowSlidePrev",
  "_allowSlideNext",
  "_swipeHandler",
  "_noSwiping",
  "noSwipingClass",
  "noSwipingSelector",
  "passiveListeners",
  "containerModifierClass",
  "slideClass",
  "slideActiveClass",
  "slideVisibleClass",
  "slideFullyVisibleClass",
  "slideNextClass",
  "slidePrevClass",
  "slideBlankClass",
  "wrapperClass",
  "lazyPreloaderClass",
  "lazyPreloadPrevNext",
  "runCallbacksOnInit",
  "observer",
  "observeParents",
  "observeSlideChildren",
  // modules
  "a11y",
  "_autoplay",
  "_controller",
  "coverflowEffect",
  "cubeEffect",
  "fadeEffect",
  "flipEffect",
  "creativeEffect",
  "cardsEffect",
  "hashNavigation",
  "history",
  "keyboard",
  "mousewheel",
  "_navigation",
  "_pagination",
  "parallax",
  "_scrollbar",
  "_thumbs",
  "virtual",
  "zoom",
  "control",
];
function Oe(e) {
  return (
    "object" == typeof e &&
    null !== e &&
    e.constructor &&
    "Object" === Object.prototype.toString.call(e).slice(8, -1) &&
    !e.__swiper__
  );
}
function ze(e, t) {
  const i = ["__proto__", "constructor", "prototype"];
  Object.keys(t)
    .filter((e) => i.indexOf(e) < 0)
    .forEach((i) => {
      void 0 === e[i]
        ? (e[i] = t[i])
        : Oe(t[i]) && Oe(e[i]) && Object.keys(t[i]).length > 0
        ? t[i].__swiper__
          ? (e[i] = t[i])
          : ze(e[i], t[i])
        : (e[i] = t[i]);
    });
}
function Ae(e) {
  return (
    void 0 === e && (e = {}),
    e.navigation &&
      void 0 === e.navigation.nextEl &&
      void 0 === e.navigation.prevEl
  );
}
function De(e) {
  return void 0 === e && (e = {}), e.pagination && void 0 === e.pagination.el;
}
function Ne(e) {
  return void 0 === e && (e = {}), e.scrollbar && void 0 === e.scrollbar.el;
}
function Re(e) {
  void 0 === e && (e = "");
  const t = e
      .split(" ")
      .map((e) => e.trim())
      .filter((e) => !!e),
    i = [];
  return (
    t.forEach((e) => {
      i.indexOf(e) < 0 && i.push(e);
    }),
    i.join(" ")
  );
}
function Fe(e, t) {
  void 0 === e && (e = {}), void 0 === t && (t = !0);
  const i = { on: {} },
    o = {},
    r = {};
  ze(i, Ie), (i._emitClasses = !0), (i.init = !1);
  const n = {},
    s = Be.map((e) => e.replace(/_/, "")),
    a = Object.assign({}, e);
  return (
    Object.keys(a).forEach((a) => {
      void 0 !== e[a] &&
        (s.indexOf(a) >= 0
          ? Oe(e[a])
            ? ((i[a] = {}), (r[a] = {}), ze(i[a], e[a]), ze(r[a], e[a]))
            : ((i[a] = e[a]), (r[a] = e[a]))
          : 0 === a.search(/on[A-Z]/) && "function" == typeof e[a]
          ? t
            ? (o["".concat(a[2].toLowerCase()).concat(a.substr(3))] = e[a])
            : (i.on["".concat(a[2].toLowerCase()).concat(a.substr(3))] = e[a])
          : (n[a] = e[a]));
    }),
    ["navigation", "pagination", "scrollbar"].forEach((e) => {
      !0 === i[e] && (i[e] = {}), !1 === i[e] && delete i[e];
    }),
    { params: i, passedParams: r, rest: n, events: o }
  );
}
function Ge(e, t, i) {
  void 0 === e && (e = {});
  const o = [],
    r = {
      "container-start": [],
      "container-end": [],
      "wrapper-start": [],
      "wrapper-end": [],
    },
    n = (e, t) => {
      Array.isArray(e) &&
        e.forEach((e) => {
          const i = "symbol" == typeof e.type;
          "default" === t && (t = "container-end"),
            i && e.children
              ? n(e.children, t)
              : (e.type &&
                  ("SwiperSlide" === e.type.name ||
                    "AsyncComponentWrapper" === e.type.name)) ||
                (e.componentOptions && "SwiperSlide" === e.componentOptions.tag)
              ? o.push(e)
              : r[t] && r[t].push(e);
        });
    };
  return (
    Object.keys(e).forEach((t) => {
      if ("function" != typeof e[t]) return;
      const i = e[t]();
      n(i, t);
    }),
    (i.value = t.value),
    (t.value = o),
    { slides: o, slots: r }
  );
}
const je = {
    name: "Swiper",
    props: {
      tag: { type: String, default: "div" },
      wrapperTag: { type: String, default: "div" },
      modules: { type: Array, default: void 0 },
      init: { type: Boolean, default: void 0 },
      direction: { type: String, default: void 0 },
      oneWayMovement: { type: Boolean, default: void 0 },
      swiperElementNodeName: { type: String, default: "SWIPER-CONTAINER" },
      touchEventsTarget: { type: String, default: void 0 },
      initialSlide: { type: Number, default: void 0 },
      speed: { type: Number, default: void 0 },
      cssMode: { type: Boolean, default: void 0 },
      updateOnWindowResize: { type: Boolean, default: void 0 },
      resizeObserver: { type: Boolean, default: void 0 },
      nested: { type: Boolean, default: void 0 },
      focusableElements: { type: String, default: void 0 },
      width: { type: Number, default: void 0 },
      height: { type: Number, default: void 0 },
      preventInteractionOnTransition: { type: Boolean, default: void 0 },
      userAgent: { type: String, default: void 0 },
      url: { type: String, default: void 0 },
      edgeSwipeDetection: { type: [Boolean, String], default: void 0 },
      edgeSwipeThreshold: { type: Number, default: void 0 },
      autoHeight: { type: Boolean, default: void 0 },
      setWrapperSize: { type: Boolean, default: void 0 },
      virtualTranslate: { type: Boolean, default: void 0 },
      effect: { type: String, default: void 0 },
      breakpoints: { type: Object, default: void 0 },
      breakpointsBase: { type: String, default: void 0 },
      spaceBetween: { type: [Number, String], default: void 0 },
      slidesPerView: { type: [Number, String], default: void 0 },
      maxBackfaceHiddenSlides: { type: Number, default: void 0 },
      slidesPerGroup: { type: Number, default: void 0 },
      slidesPerGroupSkip: { type: Number, default: void 0 },
      slidesPerGroupAuto: { type: Boolean, default: void 0 },
      centeredSlides: { type: Boolean, default: void 0 },
      centeredSlidesBounds: { type: Boolean, default: void 0 },
      slidesOffsetBefore: { type: Number, default: void 0 },
      slidesOffsetAfter: { type: Number, default: void 0 },
      normalizeSlideIndex: { type: Boolean, default: void 0 },
      centerInsufficientSlides: { type: Boolean, default: void 0 },
      watchOverflow: { type: Boolean, default: void 0 },
      roundLengths: { type: Boolean, default: void 0 },
      touchRatio: { type: Number, default: void 0 },
      touchAngle: { type: Number, default: void 0 },
      simulateTouch: { type: Boolean, default: void 0 },
      shortSwipes: { type: Boolean, default: void 0 },
      longSwipes: { type: Boolean, default: void 0 },
      longSwipesRatio: { type: Number, default: void 0 },
      longSwipesMs: { type: Number, default: void 0 },
      followFinger: { type: Boolean, default: void 0 },
      allowTouchMove: { type: Boolean, default: void 0 },
      threshold: { type: Number, default: void 0 },
      touchMoveStopPropagation: { type: Boolean, default: void 0 },
      touchStartPreventDefault: { type: Boolean, default: void 0 },
      touchStartForcePreventDefault: { type: Boolean, default: void 0 },
      touchReleaseOnEdges: { type: Boolean, default: void 0 },
      uniqueNavElements: { type: Boolean, default: void 0 },
      resistance: { type: Boolean, default: void 0 },
      resistanceRatio: { type: Number, default: void 0 },
      watchSlidesProgress: { type: Boolean, default: void 0 },
      grabCursor: { type: Boolean, default: void 0 },
      preventClicks: { type: Boolean, default: void 0 },
      preventClicksPropagation: { type: Boolean, default: void 0 },
      slideToClickedSlide: { type: Boolean, default: void 0 },
      loop: { type: Boolean, default: void 0 },
      loopedSlides: { type: Number, default: void 0 },
      loopPreventsSliding: { type: Boolean, default: void 0 },
      loopAdditionalSlides: { type: Number, default: void 0 },
      loopAddBlankSlides: { type: Boolean, default: void 0 },
      rewind: { type: Boolean, default: void 0 },
      allowSlidePrev: { type: Boolean, default: void 0 },
      allowSlideNext: { type: Boolean, default: void 0 },
      swipeHandler: { type: Boolean, default: void 0 },
      noSwiping: { type: Boolean, default: void 0 },
      noSwipingClass: { type: String, default: void 0 },
      noSwipingSelector: { type: String, default: void 0 },
      passiveListeners: { type: Boolean, default: void 0 },
      containerModifierClass: { type: String, default: void 0 },
      slideClass: { type: String, default: void 0 },
      slideActiveClass: { type: String, default: void 0 },
      slideVisibleClass: { type: String, default: void 0 },
      slideFullyVisibleClass: { type: String, default: void 0 },
      slideBlankClass: { type: String, default: void 0 },
      slideNextClass: { type: String, default: void 0 },
      slidePrevClass: { type: String, default: void 0 },
      wrapperClass: { type: String, default: void 0 },
      lazyPreloaderClass: { type: String, default: void 0 },
      lazyPreloadPrevNext: { type: Number, default: void 0 },
      runCallbacksOnInit: { type: Boolean, default: void 0 },
      observer: { type: Boolean, default: void 0 },
      observeParents: { type: Boolean, default: void 0 },
      observeSlideChildren: { type: Boolean, default: void 0 },
      a11y: { type: [Boolean, Object], default: void 0 },
      autoplay: { type: [Boolean, Object], default: void 0 },
      controller: { type: Object, default: void 0 },
      coverflowEffect: { type: Object, default: void 0 },
      cubeEffect: { type: Object, default: void 0 },
      fadeEffect: { type: Object, default: void 0 },
      flipEffect: { type: Object, default: void 0 },
      creativeEffect: { type: Object, default: void 0 },
      cardsEffect: { type: Object, default: void 0 },
      hashNavigation: { type: [Boolean, Object], default: void 0 },
      history: { type: [Boolean, Object], default: void 0 },
      keyboard: { type: [Boolean, Object], default: void 0 },
      mousewheel: { type: [Boolean, Object], default: void 0 },
      navigation: { type: [Boolean, Object], default: void 0 },
      pagination: { type: [Boolean, Object], default: void 0 },
      parallax: { type: [Boolean, Object], default: void 0 },
      scrollbar: { type: [Boolean, Object], default: void 0 },
      thumbs: { type: Object, default: void 0 },
      virtual: { type: [Boolean, Object], default: void 0 },
      zoom: { type: [Boolean, Object], default: void 0 },
      grid: { type: [Object], default: void 0 },
      freeMode: { type: [Boolean, Object], default: void 0 },
      enabled: { type: Boolean, default: void 0 },
    },
    emits: [
      "_beforeBreakpoint",
      "_containerClasses",
      "_slideClass",
      "_slideClasses",
      "_swiper",
      "_freeModeNoMomentumRelease",
      "_virtualUpdated",
      "activeIndexChange",
      "afterInit",
      "autoplay",
      "autoplayStart",
      "autoplayStop",
      "autoplayPause",
      "autoplayResume",
      "autoplayTimeLeft",
      "beforeDestroy",
      "beforeInit",
      "beforeLoopFix",
      "beforeResize",
      "beforeSlideChangeStart",
      "beforeTransitionStart",
      "breakpoint",
      "changeDirection",
      "click",
      "disable",
      "doubleTap",
      "doubleClick",
      "destroy",
      "enable",
      "fromEdge",
      "hashChange",
      "hashSet",
      "init",
      "keyPress",
      "lock",
      "loopFix",
      "momentumBounce",
      "navigationHide",
      "navigationShow",
      "navigationPrev",
      "navigationNext",
      "observerUpdate",
      "orientationchange",
      "paginationHide",
      "paginationRender",
      "paginationShow",
      "paginationUpdate",
      "progress",
      "reachBeginning",
      "reachEnd",
      "realIndexChange",
      "resize",
      "scroll",
      "scrollbarDragEnd",
      "scrollbarDragMove",
      "scrollbarDragStart",
      "setTransition",
      "setTranslate",
      "slidesUpdated",
      "slideChange",
      "slideChangeTransitionEnd",
      "slideChangeTransitionStart",
      "slideNextTransitionEnd",
      "slideNextTransitionStart",
      "slidePrevTransitionEnd",
      "slidePrevTransitionStart",
      "slideResetTransitionStart",
      "slideResetTransitionEnd",
      "sliderMove",
      "sliderFirstMove",
      "slidesLengthChange",
      "slidesGridLengthChange",
      "snapGridLengthChange",
      "snapIndexChange",
      "swiper",
      "tap",
      "toEdge",
      "touchEnd",
      "touchMove",
      "touchMoveOpposite",
      "touchStart",
      "transitionEnd",
      "transitionStart",
      "unlock",
      "update",
      "virtualUpdate",
      "zoomChange",
    ],
    setup(l, d) {
      let { slots: u, emit: c } = d;
      const { tag: p, wrapperTag: h } = l,
        g = e("swiper"),
        f = e(null),
        m = e(!1),
        v = e(!1),
        y = e(null),
        w = e(null),
        b = e(null),
        S = { value: [] },
        T = { value: [] },
        E = e(null),
        C = e(null),
        x = e(null),
        I = e(null),
        { params: k, passedParams: P } = Fe(l, !1);
      Ge(u, S, T), (b.value = P), (T.value = S.value);
      (k.onAny = function (e) {
        for (
          var t = arguments.length, i = new Array(t > 1 ? t - 1 : 0), o = 1;
          o < t;
          o++
        )
          i[o - 1] = arguments[o];
        c(e, ...i);
      }),
        Object.assign(k.on, {
          _beforeBreakpoint: () => {
            Ge(u, S, T), (m.value = !0);
          },
          _containerClasses(e, t) {
            g.value = t;
          },
        });
      const M = { ...k };
      if (
        (delete M.wrapperClass,
        (w.value = new Le(M)),
        w.value.virtual && w.value.params.virtual.enabled)
      ) {
        w.value.virtual.slides = S.value;
        const e = {
          cache: !1,
          slides: S.value,
          renderExternal: (e) => {
            f.value = e;
          },
          renderExternalUpdate: !1,
        };
        ze(w.value.params.virtual, e), ze(w.value.originalParams.virtual, e);
      }
      function L(e) {
        return k.virtual
          ? (function (e, t, i) {
              if (!i) return null;
              const o = (e) => {
                  let i = e;
                  return (
                    e < 0
                      ? (i = t.length + e)
                      : i >= t.length && (i -= t.length),
                    i
                  );
                },
                r = e.value.isHorizontal()
                  ? {
                      [e.value.rtlTranslate ? "right" : "left"]: "".concat(
                        i.offset,
                        "px"
                      ),
                    }
                  : { top: "".concat(i.offset, "px") },
                { from: n, to: s } = i,
                l = e.value.params.loop ? -t.length : 0,
                d = e.value.params.loop ? 2 * t.length : t.length,
                u = [];
              for (let a = l; a < d; a += 1)
                a >= n && a <= s && u.length < t.length && u.push(t[o(a)]);
              return u.map(
                (t) => (
                  t.props || (t.props = {}),
                  t.props.style || (t.props.style = {}),
                  (t.props.swiperRef = e),
                  (t.props.style = r),
                  t.type
                    ? a(t.type, { ...t.props }, t.children)
                    : t.componentOptions
                    ? a(
                        t.componentOptions.Ctor,
                        { ...t.props },
                        t.componentOptions.children
                      )
                    : void 0
                )
              );
            })(w, e, f.value)
          : (e.forEach((e, t) => {
              e.props || (e.props = {}),
                (e.props.swiperRef = w),
                (e.props.swiperSlideIndex = t);
            }),
            e);
      }
      return (
        t(() => {
          !v.value && w.value && (w.value.emitSlidesClasses(), (v.value = !0));
          const { passedParams: e } = Fe(l, !1),
            t = (function (e, t, i, o, r) {
              const n = [];
              if (!t) return n;
              const s = (e) => {
                n.indexOf(e) < 0 && n.push(e);
              };
              if (i && o) {
                const e = o.map(r),
                  t = i.map(r);
                e.join("") !== t.join("") && s("children"),
                  o.length !== i.length && s("children");
              }
              return (
                Be.filter((e) => "_" === e[0])
                  .map((e) => e.replace(/_/, ""))
                  .forEach((i) => {
                    if (i in e && i in t)
                      if (Oe(e[i]) && Oe(t[i])) {
                        const o = Object.keys(e[i]),
                          r = Object.keys(t[i]);
                        o.length !== r.length
                          ? s(i)
                          : (o.forEach((o) => {
                              e[i][o] !== t[i][o] && s(i);
                            }),
                            r.forEach((o) => {
                              e[i][o] !== t[i][o] && s(i);
                            }));
                      } else e[i] !== t[i] && s(i);
                  }),
                n
              );
            })(e, b.value, S.value, T.value, (e) => e.props && e.props.key);
          (b.value = e),
            (t.length || m.value) &&
              w.value &&
              !w.value.destroyed &&
              (function (e) {
                let {
                  swiper: t,
                  slides: i,
                  passedParams: o,
                  changedParams: r,
                  nextEl: n,
                  prevEl: s,
                  scrollbarEl: a,
                  paginationEl: l,
                } = e;
                const d = r.filter(
                    (e) =>
                      "children" !== e &&
                      "direction" !== e &&
                      "wrapperClass" !== e
                  ),
                  {
                    params: u,
                    pagination: c,
                    navigation: p,
                    scrollbar: h,
                    virtual: g,
                    thumbs: f,
                  } = t;
                let m, v, y, w, b, S, T, E;
                r.includes("thumbs") &&
                  o.thumbs &&
                  o.thumbs.swiper &&
                  !o.thumbs.swiper.destroyed &&
                  u.thumbs &&
                  (!u.thumbs.swiper || u.thumbs.swiper.destroyed) &&
                  (m = !0),
                  r.includes("controller") &&
                    o.controller &&
                    o.controller.control &&
                    u.controller &&
                    !u.controller.control &&
                    (v = !0),
                  r.includes("pagination") &&
                    o.pagination &&
                    (o.pagination.el || l) &&
                    (u.pagination || !1 === u.pagination) &&
                    c &&
                    !c.el &&
                    (y = !0),
                  r.includes("scrollbar") &&
                    o.scrollbar &&
                    (o.scrollbar.el || a) &&
                    (u.scrollbar || !1 === u.scrollbar) &&
                    h &&
                    !h.el &&
                    (w = !0),
                  r.includes("navigation") &&
                    o.navigation &&
                    (o.navigation.prevEl || s) &&
                    (o.navigation.nextEl || n) &&
                    (u.navigation || !1 === u.navigation) &&
                    p &&
                    !p.prevEl &&
                    !p.nextEl &&
                    (b = !0);
                const C = (e) => {
                  t[e] &&
                    (t[e].destroy(),
                    "navigation" === e
                      ? (t.isElement &&
                          (t[e].prevEl.remove(), t[e].nextEl.remove()),
                        (u[e].prevEl = void 0),
                        (u[e].nextEl = void 0),
                        (t[e].prevEl = void 0),
                        (t[e].nextEl = void 0))
                      : (t.isElement && t[e].el.remove(),
                        (u[e].el = void 0),
                        (t[e].el = void 0)));
                };
                r.includes("loop") &&
                  t.isElement &&
                  (u.loop && !o.loop
                    ? (S = !0)
                    : !u.loop && o.loop
                    ? (T = !0)
                    : (E = !0)),
                  d.forEach((e) => {
                    if (Oe(u[e]) && Oe(o[e]))
                      Object.assign(u[e], o[e]),
                        ("navigation" !== e &&
                          "pagination" !== e &&
                          "scrollbar" !== e) ||
                          !("enabled" in o[e]) ||
                          o[e].enabled ||
                          C(e);
                    else {
                      const t = o[e];
                      (!0 !== t && !1 !== t) ||
                      ("navigation" !== e &&
                        "pagination" !== e &&
                        "scrollbar" !== e)
                        ? (u[e] = o[e])
                        : !1 === t && C(e);
                    }
                  }),
                  d.includes("controller") &&
                    !v &&
                    t.controller &&
                    t.controller.control &&
                    u.controller &&
                    u.controller.control &&
                    (t.controller.control = u.controller.control),
                  r.includes("children") && i && g && u.virtual.enabled
                    ? ((g.slides = i), g.update(!0))
                    : r.includes("virtual") &&
                      g &&
                      u.virtual.enabled &&
                      (i && (g.slides = i), g.update(!0)),
                  r.includes("children") && i && u.loop && (E = !0),
                  m && f.init() && f.update(!0);
                v && (t.controller.control = u.controller.control),
                  y &&
                    (!t.isElement ||
                      (l && "string" != typeof l) ||
                      ((l = document.createElement("div")),
                      l.classList.add("swiper-pagination"),
                      l.part.add("pagination"),
                      t.el.appendChild(l)),
                    l && (u.pagination.el = l),
                    c.init(),
                    c.render(),
                    c.update()),
                  w &&
                    (!t.isElement ||
                      (a && "string" != typeof a) ||
                      ((a = document.createElement("div")),
                      a.classList.add("swiper-scrollbar"),
                      a.part.add("scrollbar"),
                      t.el.appendChild(a)),
                    a && (u.scrollbar.el = a),
                    h.init(),
                    h.updateSize(),
                    h.setTranslate()),
                  b &&
                    (t.isElement &&
                      ((n && "string" != typeof n) ||
                        ((n = document.createElement("div")),
                        n.classList.add("swiper-button-next"),
                        te(n, t.hostEl.constructor.nextButtonSvg),
                        n.part.add("button-next"),
                        t.el.appendChild(n)),
                      (s && "string" != typeof s) ||
                        ((s = document.createElement("div")),
                        s.classList.add("swiper-button-prev"),
                        te(s, t.hostEl.constructor.prevButtonSvg),
                        s.part.add("button-prev"),
                        t.el.appendChild(s))),
                    n && (u.navigation.nextEl = n),
                    s && (u.navigation.prevEl = s),
                    p.init(),
                    p.update()),
                  r.includes("allowSlideNext") &&
                    (t.allowSlideNext = o.allowSlideNext),
                  r.includes("allowSlidePrev") &&
                    (t.allowSlidePrev = o.allowSlidePrev),
                  r.includes("direction") && t.changeDirection(o.direction, !1),
                  (S || E) && t.loopDestroy(),
                  (T || E) && t.loopCreate(),
                  t.update();
              })({
                swiper: w.value,
                slides: S.value,
                passedParams: e,
                changedParams: t,
                nextEl: E.value,
                prevEl: C.value,
                scrollbarEl: I.value,
                paginationEl: x.value,
              }),
            (m.value = !1);
        }),
        i("swiper", w),
        o(f, () => {
          r(() => {
            var e;
            !(e = w.value) ||
              e.destroyed ||
              !e.params.virtual ||
              (e.params.virtual && !e.params.virtual.enabled) ||
              (e.updateSlides(),
              e.updateProgress(),
              e.updateSlidesClasses(),
              e.emit("_virtualUpdated"),
              e.parallax &&
                e.params.parallax &&
                e.params.parallax.enabled &&
                e.parallax.setTranslate());
          });
        }),
        n(() => {
          y.value &&
            (!(function (e, t) {
              let {
                el: i,
                nextEl: o,
                prevEl: r,
                paginationEl: n,
                scrollbarEl: s,
                swiper: a,
              } = e;
              Ae(t) &&
                o &&
                r &&
                ((a.params.navigation.nextEl = o),
                (a.originalParams.navigation.nextEl = o),
                (a.params.navigation.prevEl = r),
                (a.originalParams.navigation.prevEl = r)),
                De(t) &&
                  n &&
                  ((a.params.pagination.el = n),
                  (a.originalParams.pagination.el = n)),
                Ne(t) &&
                  s &&
                  ((a.params.scrollbar.el = s),
                  (a.originalParams.scrollbar.el = s)),
                a.init(i);
            })(
              {
                el: y.value,
                nextEl: E.value,
                prevEl: C.value,
                paginationEl: x.value,
                scrollbarEl: I.value,
                swiper: w.value,
              },
              k
            ),
            c("swiper", w.value));
        }),
        s(() => {
          w.value && !w.value.destroyed && w.value.destroy(!0, !1);
        }),
        () => {
          const { slides: e, slots: t } = Ge(u, S, T);
          return a(p, { ref: y, class: Re(g.value) }, [
            t["container-start"],
            a(
              h,
              {
                class:
                  ((i = k.wrapperClass),
                  void 0 === i && (i = ""),
                  i
                    ? i.includes("swiper-wrapper")
                      ? i
                      : "swiper-wrapper ".concat(i)
                    : "swiper-wrapper"),
              },
              [t["wrapper-start"], L(e), t["wrapper-end"]]
            ),
            Ae(l) && [
              a("div", { ref: C, class: "swiper-button-prev" }),
              a("div", { ref: E, class: "swiper-button-next" }),
            ],
            Ne(l) && a("div", { ref: I, class: "swiper-scrollbar" }),
            De(l) && a("div", { ref: x, class: "swiper-pagination" }),
            t["container-end"],
          ]);
          var i;
        }
      );
    },
  },
  We = {
    name: "SwiperSlide",
    props: {
      tag: { type: String, default: "div" },
      swiperRef: { type: Object, required: !1 },
      swiperSlideIndex: { type: Number, default: void 0, required: !1 },
      zoom: { type: Boolean, default: void 0, required: !1 },
      lazy: { type: Boolean, default: !1, required: !1 },
      virtualIndex: { type: [String, Number], default: void 0 },
    },
    setup(o, r) {
      let { slots: u } = r,
        c = !1;
      const { swiperRef: p } = o,
        h = e(null),
        g = e("swiper-slide"),
        f = e(!1);
      function m(e, t, i) {
        t === h.value && (g.value = i);
      }
      n(() => {
        p && p.value && (p.value.on("_slideClass", m), (c = !0));
      }),
        l(() => {
          !c && p && p.value && (p.value.on("_slideClass", m), (c = !0));
        }),
        t(() => {
          h.value &&
            p &&
            p.value &&
            (void 0 !== o.swiperSlideIndex &&
              (h.value.swiperSlideIndex = o.swiperSlideIndex),
            p.value.destroyed &&
              "swiper-slide" !== g.value &&
              (g.value = "swiper-slide"));
        }),
        s(() => {
          p && p.value && p.value.off("_slideClass", m);
        });
      const v = d(() => ({
        isActive: g.value.indexOf("swiper-slide-active") >= 0,
        isVisible: g.value.indexOf("swiper-slide-visible") >= 0,
        isPrev: g.value.indexOf("swiper-slide-prev") >= 0,
        isNext: g.value.indexOf("swiper-slide-next") >= 0,
      }));
      i("swiperSlide", v);
      const y = () => {
        f.value = !0;
      };
      return () =>
        a(
          o.tag,
          {
            class: Re("".concat(g.value)),
            ref: h,
            "data-swiper-slide-index":
              void 0 === o.virtualIndex && p && p.value && p.value.params.loop
                ? o.swiperSlideIndex
                : o.virtualIndex,
            onLoadCapture: y,
          },
          o.zoom
            ? a(
                "div",
                {
                  class: "swiper-zoom-container",
                  "data-swiper-zoom":
                    "number" == typeof o.zoom ? o.zoom : void 0,
                },
                [
                  u.default && u.default(v.value),
                  o.lazy &&
                    !f.value &&
                    a("div", { class: "swiper-lazy-preloader" }),
                ]
              )
            : [
                u.default && u.default(v.value),
                o.lazy &&
                  !f.value &&
                  a("div", { class: "swiper-lazy-preloader" }),
              ]
        );
    },
  };
var He = { exports: {} };
"undefined" != typeof window && window;
const Ve = c(
  (He.exports = (function () {
    function e(e) {
      (this.mode = i.MODE_8BIT_BYTE), (this.data = e);
    }
    function t(e, t) {
      (this.typeNumber = e),
        (this.errorCorrectLevel = t),
        (this.modules = null),
        (this.moduleCount = 0),
        (this.dataCache = null),
        (this.dataList = new Array());
    }
    (e.prototype = {
      getLength: function (e) {
        return this.data.length;
      },
      write: function (e) {
        for (var t = 0; t < this.data.length; t++)
          e.put(this.data.charCodeAt(t), 8);
      },
    }),
      (t.prototype = {
        addData: function (t) {
          var i = new e(t);
          this.dataList.push(i), (this.dataCache = null);
        },
        isDark: function (e, t) {
          if (e < 0 || this.moduleCount <= e || t < 0 || this.moduleCount <= t)
            throw new Error(e + "," + t);
          return this.modules[e][t];
        },
        getModuleCount: function () {
          return this.moduleCount;
        },
        make: function () {
          if (this.typeNumber < 1) {
            var e = 1;
            for (e = 1; e < 40; e++) {
              for (
                var t = m.getRSBlocks(e, this.errorCorrectLevel),
                  i = new v(),
                  o = 0,
                  r = 0;
                r < t.length;
                r++
              )
                o += t[r].dataCount;
              for (r = 0; r < this.dataList.length; r++) {
                var n = this.dataList[r];
                i.put(n.mode, 4),
                  i.put(n.getLength(), p.getLengthInBits(n.mode, e)),
                  n.write(i);
              }
              if (i.getLengthInBits() <= 8 * o) break;
            }
            this.typeNumber = e;
          }
          this.makeImpl(!1, this.getBestMaskPattern());
        },
        makeImpl: function (e, i) {
          (this.moduleCount = 4 * this.typeNumber + 17),
            (this.modules = new Array(this.moduleCount));
          for (var o = 0; o < this.moduleCount; o++) {
            this.modules[o] = new Array(this.moduleCount);
            for (var r = 0; r < this.moduleCount; r++)
              this.modules[o][r] = null;
          }
          this.setupPositionProbePattern(0, 0),
            this.setupPositionProbePattern(this.moduleCount - 7, 0),
            this.setupPositionProbePattern(0, this.moduleCount - 7),
            this.setupPositionAdjustPattern(),
            this.setupTimingPattern(),
            this.setupTypeInfo(e, i),
            this.typeNumber >= 7 && this.setupTypeNumber(e),
            null == this.dataCache &&
              (this.dataCache = t.createData(
                this.typeNumber,
                this.errorCorrectLevel,
                this.dataList
              )),
            this.mapData(this.dataCache, i);
        },
        setupPositionProbePattern: function (e, t) {
          for (var i = -1; i <= 7; i++)
            if (!(e + i <= -1 || this.moduleCount <= e + i))
              for (var o = -1; o <= 7; o++)
                t + o <= -1 ||
                  this.moduleCount <= t + o ||
                  (this.modules[e + i][t + o] =
                    (0 <= i && i <= 6 && (0 == o || 6 == o)) ||
                    (0 <= o && o <= 6 && (0 == i || 6 == i)) ||
                    (2 <= i && i <= 4 && 2 <= o && o <= 4));
        },
        getBestMaskPattern: function () {
          for (var e = 0, t = 0, i = 0; i < 8; i++) {
            this.makeImpl(!0, i);
            var o = p.getLostPoint(this);
            (0 == i || e > o) && ((e = o), (t = i));
          }
          return t;
        },
        createMovieClip: function (e, t, i) {
          var o = e.createEmptyMovieClip(t, i);
          this.make();
          for (var r = 0; r < this.modules.length; r++)
            for (var n = 1 * r, s = 0; s < this.modules[r].length; s++) {
              var a = 1 * s;
              this.modules[r][s] &&
                (o.beginFill(0, 100),
                o.moveTo(a, n),
                o.lineTo(a + 1, n),
                o.lineTo(a + 1, n + 1),
                o.lineTo(a, n + 1),
                o.endFill());
            }
          return o;
        },
        setupTimingPattern: function () {
          for (var e = 8; e < this.moduleCount - 8; e++)
            null == this.modules[e][6] && (this.modules[e][6] = e % 2 == 0);
          for (var t = 8; t < this.moduleCount - 8; t++)
            null == this.modules[6][t] && (this.modules[6][t] = t % 2 == 0);
        },
        setupPositionAdjustPattern: function () {
          for (
            var e = p.getPatternPosition(this.typeNumber), t = 0;
            t < e.length;
            t++
          )
            for (var i = 0; i < e.length; i++) {
              var o = e[t],
                r = e[i];
              if (null == this.modules[o][r])
                for (var n = -2; n <= 2; n++)
                  for (var s = -2; s <= 2; s++)
                    this.modules[o + n][r + s] =
                      -2 == n ||
                      2 == n ||
                      -2 == s ||
                      2 == s ||
                      (0 == n && 0 == s);
            }
        },
        setupTypeNumber: function (e) {
          for (
            var t = p.getBCHTypeNumber(this.typeNumber), i = 0;
            i < 18;
            i++
          ) {
            var o = !e && 1 == ((t >> i) & 1);
            this.modules[Math.floor(i / 3)][
              (i % 3) + this.moduleCount - 8 - 3
            ] = o;
          }
          for (i = 0; i < 18; i++)
            (o = !e && 1 == ((t >> i) & 1)),
              (this.modules[(i % 3) + this.moduleCount - 8 - 3][
                Math.floor(i / 3)
              ] = o);
        },
        setupTypeInfo: function (e, t) {
          for (
            var i = (this.errorCorrectLevel << 3) | t,
              o = p.getBCHTypeInfo(i),
              r = 0;
            r < 15;
            r++
          ) {
            var n = !e && 1 == ((o >> r) & 1);
            r < 6
              ? (this.modules[r][8] = n)
              : r < 8
              ? (this.modules[r + 1][8] = n)
              : (this.modules[this.moduleCount - 15 + r][8] = n);
          }
          for (r = 0; r < 15; r++)
            (n = !e && 1 == ((o >> r) & 1)),
              r < 8
                ? (this.modules[8][this.moduleCount - r - 1] = n)
                : r < 9
                ? (this.modules[8][15 - r - 1 + 1] = n)
                : (this.modules[8][15 - r - 1] = n);
          this.modules[this.moduleCount - 8][8] = !e;
        },
        mapData: function (e, t) {
          for (
            var i = -1,
              o = this.moduleCount - 1,
              r = 7,
              n = 0,
              s = this.moduleCount - 1;
            s > 0;
            s -= 2
          )
            for (6 == s && s--; ; ) {
              for (var a = 0; a < 2; a++)
                if (null == this.modules[o][s - a]) {
                  var l = !1;
                  n < e.length && (l = 1 == ((e[n] >>> r) & 1)),
                    p.getMask(t, o, s - a) && (l = !l),
                    (this.modules[o][s - a] = l),
                    -1 == --r && (n++, (r = 7));
                }
              if ((o += i) < 0 || this.moduleCount <= o) {
                (o -= i), (i = -i);
                break;
              }
            }
        },
      }),
      (t.PAD0 = 236),
      (t.PAD1 = 17),
      (t.createData = function (e, i, o) {
        for (
          var r = m.getRSBlocks(e, i), n = new v(), s = 0;
          s < o.length;
          s++
        ) {
          var a = o[s];
          n.put(a.mode, 4),
            n.put(a.getLength(), p.getLengthInBits(a.mode, e)),
            a.write(n);
        }
        var l = 0;
        for (s = 0; s < r.length; s++) l += r[s].dataCount;
        if (n.getLengthInBits() > 8 * l)
          throw new Error(
            "code length overflow. (" + n.getLengthInBits() + ">" + 8 * l + ")"
          );
        for (
          n.getLengthInBits() + 4 <= 8 * l && n.put(0, 4);
          n.getLengthInBits() % 8 != 0;

        )
          n.putBit(!1);
        for (
          ;
          !(
            n.getLengthInBits() >= 8 * l ||
            (n.put(t.PAD0, 8), n.getLengthInBits() >= 8 * l)
          );

        )
          n.put(t.PAD1, 8);
        return t.createBytes(n, r);
      }),
      (t.createBytes = function (e, t) {
        for (
          var i = 0,
            o = 0,
            r = 0,
            n = new Array(t.length),
            s = new Array(t.length),
            a = 0;
          a < t.length;
          a++
        ) {
          var l = t[a].dataCount,
            d = t[a].totalCount - l;
          (o = Math.max(o, l)), (r = Math.max(r, d)), (n[a] = new Array(l));
          for (var u = 0; u < n[a].length; u++) n[a][u] = 255 & e.buffer[u + i];
          i += l;
          var c = p.getErrorCorrectPolynomial(d),
            h = new f(n[a], c.getLength() - 1).mod(c);
          for (
            s[a] = new Array(c.getLength() - 1), u = 0;
            u < s[a].length;
            u++
          ) {
            var g = u + h.getLength() - s[a].length;
            s[a][u] = g >= 0 ? h.get(g) : 0;
          }
        }
        var m = 0;
        for (u = 0; u < t.length; u++) m += t[u].totalCount;
        var v = new Array(m),
          y = 0;
        for (u = 0; u < o; u++)
          for (a = 0; a < t.length; a++) u < n[a].length && (v[y++] = n[a][u]);
        for (u = 0; u < r; u++)
          for (a = 0; a < t.length; a++) u < s[a].length && (v[y++] = s[a][u]);
        return v;
      });
    for (
      var i = {
          MODE_NUMBER: 1,
          MODE_ALPHA_NUM: 2,
          MODE_8BIT_BYTE: 4,
          MODE_KANJI: 8,
        },
        o = { L: 1, M: 0, Q: 3, H: 2 },
        r = 0,
        n = 1,
        s = 2,
        a = 3,
        l = 4,
        d = 5,
        u = 6,
        c = 7,
        p = {
          PATTERN_POSITION_TABLE: [
            [],
            [6, 18],
            [6, 22],
            [6, 26],
            [6, 30],
            [6, 34],
            [6, 22, 38],
            [6, 24, 42],
            [6, 26, 46],
            [6, 28, 50],
            [6, 30, 54],
            [6, 32, 58],
            [6, 34, 62],
            [6, 26, 46, 66],
            [6, 26, 48, 70],
            [6, 26, 50, 74],
            [6, 30, 54, 78],
            [6, 30, 56, 82],
            [6, 30, 58, 86],
            [6, 34, 62, 90],
            [6, 28, 50, 72, 94],
            [6, 26, 50, 74, 98],
            [6, 30, 54, 78, 102],
            [6, 28, 54, 80, 106],
            [6, 32, 58, 84, 110],
            [6, 30, 58, 86, 114],
            [6, 34, 62, 90, 118],
            [6, 26, 50, 74, 98, 122],
            [6, 30, 54, 78, 102, 126],
            [6, 26, 52, 78, 104, 130],
            [6, 30, 56, 82, 108, 134],
            [6, 34, 60, 86, 112, 138],
            [6, 30, 58, 86, 114, 142],
            [6, 34, 62, 90, 118, 146],
            [6, 30, 54, 78, 102, 126, 150],
            [6, 24, 50, 76, 102, 128, 154],
            [6, 28, 54, 80, 106, 132, 158],
            [6, 32, 58, 84, 110, 136, 162],
            [6, 26, 54, 82, 110, 138, 166],
            [6, 30, 58, 86, 114, 142, 170],
          ],
          G15: 1335,
          G18: 7973,
          G15_MASK: 21522,
          getBCHTypeInfo: function (e) {
            for (
              var t = e << 10;
              p.getBCHDigit(t) - p.getBCHDigit(p.G15) >= 0;

            )
              t ^= p.G15 << (p.getBCHDigit(t) - p.getBCHDigit(p.G15));
            return ((e << 10) | t) ^ p.G15_MASK;
          },
          getBCHTypeNumber: function (e) {
            for (
              var t = e << 12;
              p.getBCHDigit(t) - p.getBCHDigit(p.G18) >= 0;

            )
              t ^= p.G18 << (p.getBCHDigit(t) - p.getBCHDigit(p.G18));
            return (e << 12) | t;
          },
          getBCHDigit: function (e) {
            for (var t = 0; 0 != e; ) t++, (e >>>= 1);
            return t;
          },
          getPatternPosition: function (e) {
            return p.PATTERN_POSITION_TABLE[e - 1];
          },
          getMask: function (e, t, i) {
            switch (e) {
              case r:
                return (t + i) % 2 == 0;
              case n:
                return t % 2 == 0;
              case s:
                return i % 3 == 0;
              case a:
                return (t + i) % 3 == 0;
              case l:
                return (Math.floor(t / 2) + Math.floor(i / 3)) % 2 == 0;
              case d:
                return ((t * i) % 2) + ((t * i) % 3) == 0;
              case u:
                return (((t * i) % 2) + ((t * i) % 3)) % 2 == 0;
              case c:
                return (((t * i) % 3) + ((t + i) % 2)) % 2 == 0;
              default:
                throw new Error("bad maskPattern:" + e);
            }
          },
          getErrorCorrectPolynomial: function (e) {
            for (var t = new f([1], 0), i = 0; i < e; i++)
              t = t.multiply(new f([1, h.gexp(i)], 0));
            return t;
          },
          getLengthInBits: function (e, t) {
            if (1 <= t && t < 10)
              switch (e) {
                case i.MODE_NUMBER:
                  return 10;
                case i.MODE_ALPHA_NUM:
                  return 9;
                case i.MODE_8BIT_BYTE:
                case i.MODE_KANJI:
                  return 8;
                default:
                  throw new Error("mode:" + e);
              }
            else if (t < 27)
              switch (e) {
                case i.MODE_NUMBER:
                  return 12;
                case i.MODE_ALPHA_NUM:
                  return 11;
                case i.MODE_8BIT_BYTE:
                  return 16;
                case i.MODE_KANJI:
                  return 10;
                default:
                  throw new Error("mode:" + e);
              }
            else {
              if (!(t < 41)) throw new Error("type:" + t);
              switch (e) {
                case i.MODE_NUMBER:
                  return 14;
                case i.MODE_ALPHA_NUM:
                  return 13;
                case i.MODE_8BIT_BYTE:
                  return 16;
                case i.MODE_KANJI:
                  return 12;
                default:
                  throw new Error("mode:" + e);
              }
            }
          },
          getLostPoint: function (e) {
            for (var t = e.getModuleCount(), i = 0, o = 0; o < t; o++)
              for (var r = 0; r < t; r++) {
                for (var n = 0, s = e.isDark(o, r), a = -1; a <= 1; a++)
                  if (!(o + a < 0 || t <= o + a))
                    for (var l = -1; l <= 1; l++)
                      r + l < 0 ||
                        t <= r + l ||
                        (0 == a && 0 == l) ||
                        (s == e.isDark(o + a, r + l) && n++);
                n > 5 && (i += 3 + n - 5);
              }
            for (o = 0; o < t - 1; o++)
              for (r = 0; r < t - 1; r++) {
                var d = 0;
                e.isDark(o, r) && d++,
                  e.isDark(o + 1, r) && d++,
                  e.isDark(o, r + 1) && d++,
                  e.isDark(o + 1, r + 1) && d++,
                  (0 != d && 4 != d) || (i += 3);
              }
            for (o = 0; o < t; o++)
              for (r = 0; r < t - 6; r++)
                e.isDark(o, r) &&
                  !e.isDark(o, r + 1) &&
                  e.isDark(o, r + 2) &&
                  e.isDark(o, r + 3) &&
                  e.isDark(o, r + 4) &&
                  !e.isDark(o, r + 5) &&
                  e.isDark(o, r + 6) &&
                  (i += 40);
            for (r = 0; r < t; r++)
              for (o = 0; o < t - 6; o++)
                e.isDark(o, r) &&
                  !e.isDark(o + 1, r) &&
                  e.isDark(o + 2, r) &&
                  e.isDark(o + 3, r) &&
                  e.isDark(o + 4, r) &&
                  !e.isDark(o + 5, r) &&
                  e.isDark(o + 6, r) &&
                  (i += 40);
            var u = 0;
            for (r = 0; r < t; r++)
              for (o = 0; o < t; o++) e.isDark(o, r) && u++;
            return i + (Math.abs((100 * u) / t / t - 50) / 5) * 10;
          },
        },
        h = {
          glog: function (e) {
            if (e < 1) throw new Error("glog(" + e + ")");
            return h.LOG_TABLE[e];
          },
          gexp: function (e) {
            for (; e < 0; ) e += 255;
            for (; e >= 256; ) e -= 255;
            return h.EXP_TABLE[e];
          },
          EXP_TABLE: new Array(256),
          LOG_TABLE: new Array(256),
        },
        g = 0;
      g < 8;
      g++
    )
      h.EXP_TABLE[g] = 1 << g;
    for (g = 8; g < 256; g++)
      h.EXP_TABLE[g] =
        h.EXP_TABLE[g - 4] ^
        h.EXP_TABLE[g - 5] ^
        h.EXP_TABLE[g - 6] ^
        h.EXP_TABLE[g - 8];
    for (g = 0; g < 255; g++) h.LOG_TABLE[h.EXP_TABLE[g]] = g;
    function f(e, t) {
      if (null == e.length) throw new Error(e.length + "/" + t);
      for (var i = 0; i < e.length && 0 == e[i]; ) i++;
      this.num = new Array(e.length - i + t);
      for (var o = 0; o < e.length - i; o++) this.num[o] = e[o + i];
    }
    function m(e, t) {
      (this.totalCount = e), (this.dataCount = t);
    }
    function v() {
      (this.buffer = new Array()), (this.length = 0);
    }
    function y(e) {
      return (
        (e.setFillStyle =
          e.setFillStyle ||
          function (t) {
            e.fillStyle = t;
          }),
        (e.setFontSize =
          e.setFontSize ||
          function (t) {
            e.font = "".concat(t, "px");
          }),
        (e.setTextAlign =
          e.setTextAlign ||
          function (t) {
            e.textAlign = t;
          }),
        (e.setTextBaseline =
          e.setTextBaseline ||
          function (t) {
            e.textBaseline = t;
          }),
        (e.setGlobalAlpha =
          e.setGlobalAlpha ||
          function (t) {
            e.globalAlpha = t;
          }),
        (e.setStrokeStyle =
          e.setStrokeStyle ||
          function (t) {
            e.strokeStyle = t;
          }),
        (e.setShadow =
          e.setShadow ||
          function (t, i, o, r) {
            (e.shadowOffsetX = t),
              (e.shadowOffsetY = i),
              (e.shadowBlur = o),
              (e.shadowColor = r);
          }),
        (e.draw =
          e.draw ||
          function (e, t) {
            t && t();
          }),
        e
      );
    }
    function w(e, t) {
      var i = (this.data = "");
      this.dataEncode = !0;
      var o = (this.size = 200);
      (this.useDynamicSize = !1), (this.dynamicSize = o);
      var r = (this.typeNumber = -1);
      this.errorCorrectLevel = w.errorCorrectLevel.H;
      var n = (this.margin = 0);
      (this.areaColor = "#FFFFFF"),
        (this.backgroundColor = "rgba(255,255,255,0)"),
        (this.backgroundImageSrc = void 0);
      var s = (this.backgroundImageWidth = void 0),
        a = (this.backgroundImageHeight = void 0),
        l = (this.backgroundImageX = void 0),
        d = (this.backgroundImageY = void 0);
      (this.backgroundImageAlpha = 1), (this.backgroundImageBorderRadius = 0);
      var u = (this.backgroundPadding = 0);
      (this.foregroundColor = "#000000"), (this.foregroundImageSrc = void 0);
      var c = (this.foregroundImageWidth = void 0),
        p = (this.foregroundImageHeight = void 0),
        h = (this.foregroundImageX = void 0),
        g = (this.foregroundImageY = void 0),
        f = (this.foregroundImagePadding = 0);
      this.foregroundImageBackgroundColor = "#FFFFFF";
      var m = (this.foregroundImageBorderRadius = 0),
        v = (this.foregroundImageShadowOffsetX = 0),
        b = (this.foregroundImageShadowOffsetY = 0),
        S = (this.foregroundImageShadowBlur = 0);
      this.foregroundImageShadowColor = "#808080";
      var T = (this.foregroundPadding = 0),
        E = (this.positionProbeBackgroundColor = void 0),
        C = (this.positionProbeForegroundColor = void 0),
        x = (this.separatorColor = void 0),
        I = (this.positionAdjustBackgroundColor = void 0),
        k = (this.positionAdjustForegroundColor = void 0),
        P = (this.timingBackgroundColor = void 0),
        M = (this.timingForegroundColor = void 0),
        L = (this.typeNumberBackgroundColor = void 0),
        _ = (this.typeNumberForegroundColor = void 0),
        B = (this.darkBlockColor = void 0);
      (this.base = void 0),
        (this.modules = []),
        (this.moduleCount = 0),
        (this.drawModules = []);
      var O = (this.canvasContext = void 0);
      this.loadImage,
        (this.drawReserve = !1),
        (this.isMaked = !1),
        Object.defineProperties(this, {
          data: {
            get() {
              if ("" === i || void 0 === i)
                throw new w.Error("data must be set!");
              return i;
            },
            set(e) {
              i = String(e);
            },
          },
          size: {
            get: () => o,
            set(e) {
              o = Number(e);
            },
          },
          typeNumber: {
            get: () => r,
            set(e) {
              r = Number(e);
            },
          },
          margin: {
            get: () => n,
            set(e) {
              n = Number(e);
            },
          },
          backgroundImageWidth: {
            get() {
              return void 0 === s
                ? this.dynamicSize
                : this.useDynamicSize
                ? (this.dynamicSize / this.size) * s
                : s;
            },
            set(e) {
              s = Number(e);
            },
          },
          backgroundImageHeight: {
            get() {
              return void 0 === a
                ? this.dynamicSize
                : this.useDynamicSize
                ? (this.dynamicSize / this.size) * a
                : a;
            },
            set(e) {
              a = Number(e);
            },
          },
          backgroundImageX: {
            get() {
              return void 0 === l
                ? 0
                : this.useDynamicSize
                ? (this.dynamicSize / this.size) * l
                : l;
            },
            set(e) {
              l = Number(e);
            },
          },
          backgroundImageY: {
            get() {
              return void 0 === d
                ? 0
                : this.useDynamicSize
                ? (this.dynamicSize / this.size) * d
                : d;
            },
            set(e) {
              d = Number(e);
            },
          },
          backgroundPadding: {
            get: () => u,
            set(e) {
              u = e > 1 ? 1 : e < 0 ? 0 : e;
            },
          },
          foregroundImageWidth: {
            get() {
              return void 0 === c
                ? (this.dynamicSize - 2 * this.margin) / 4
                : this.useDynamicSize
                ? (this.dynamicSize / this.size) * c
                : c;
            },
            set(e) {
              c = Number(e);
            },
          },
          foregroundImageHeight: {
            get() {
              return void 0 === p
                ? (this.dynamicSize - 2 * this.margin) / 4
                : this.useDynamicSize
                ? (this.dynamicSize / this.size) * p
                : p;
            },
            set(e) {
              p = Number(e);
            },
          },
          foregroundImageX: {
            get() {
              return void 0 === h
                ? this.dynamicSize / 2 - this.foregroundImageWidth / 2
                : this.useDynamicSize
                ? (this.dynamicSize / this.size) * h
                : h;
            },
            set(e) {
              h = Number(e);
            },
          },
          foregroundImageY: {
            get() {
              return void 0 === g
                ? this.dynamicSize / 2 - this.foregroundImageHeight / 2
                : this.useDynamicSize
                ? (this.dynamicSize / this.size) * g
                : g;
            },
            set(e) {
              g = Number(e);
            },
          },
          foregroundImagePadding: {
            get() {
              return this.useDynamicSize
                ? (this.dynamicSize / this.size) * f
                : f;
            },
            set(e) {
              f = Number(e);
            },
          },
          foregroundImageBorderRadius: {
            get() {
              return this.useDynamicSize
                ? (this.dynamicSize / this.size) * m
                : m;
            },
            set(e) {
              m = Number(e);
            },
          },
          foregroundImageShadowOffsetX: {
            get() {
              return this.useDynamicSize
                ? (this.dynamicSize / this.size) * v
                : v;
            },
            set(e) {
              v = Number(e);
            },
          },
          foregroundImageShadowOffsetY: {
            get() {
              return this.useDynamicSize
                ? (this.dynamicSize / this.size) * b
                : b;
            },
            set(e) {
              b = Number(e);
            },
          },
          foregroundImageShadowBlur: {
            get() {
              return this.useDynamicSize
                ? (this.dynamicSize / this.size) * S
                : S;
            },
            set(e) {
              S = Number(e);
            },
          },
          foregroundPadding: {
            get: () => T,
            set(e) {
              T = e > 1 ? 1 : e < 0 ? 0 : e;
            },
          },
          positionProbeBackgroundColor: {
            get() {
              return E || this.backgroundColor;
            },
            set(e) {
              E = e;
            },
          },
          positionProbeForegroundColor: {
            get() {
              return C || this.foregroundColor;
            },
            set(e) {
              C = e;
            },
          },
          separatorColor: {
            get() {
              return x || this.backgroundColor;
            },
            set(e) {
              x = e;
            },
          },
          positionAdjustBackgroundColor: {
            get() {
              return I || this.backgroundColor;
            },
            set(e) {
              I = e;
            },
          },
          positionAdjustForegroundColor: {
            get() {
              return k || this.foregroundColor;
            },
            set(e) {
              k = e;
            },
          },
          timingBackgroundColor: {
            get() {
              return P || this.backgroundColor;
            },
            set(e) {
              P = e;
            },
          },
          timingForegroundColor: {
            get() {
              return M || this.foregroundColor;
            },
            set(e) {
              M = e;
            },
          },
          typeNumberBackgroundColor: {
            get() {
              return L || this.backgroundColor;
            },
            set(e) {
              L = e;
            },
          },
          typeNumberForegroundColor: {
            get() {
              return _ || this.foregroundColor;
            },
            set(e) {
              _ = e;
            },
          },
          darkBlockColor: {
            get() {
              return B || this.foregroundColor;
            },
            set(e) {
              B = e;
            },
          },
          canvasContext: {
            get() {
              if (void 0 === O)
                throw new w.Error(
                  "use drawCanvas, you need to set the canvasContext!"
                );
              return O;
            },
            set(e) {
              O = y(e);
            },
          },
        }),
        w.plugins.forEach((e) => e(w, this, !1)),
        e && this.setOptions(e),
        t && (this.canvasContext = y(t));
    }
    return (
      (f.prototype = {
        get: function (e) {
          return this.num[e];
        },
        getLength: function () {
          return this.num.length;
        },
        multiply: function (e) {
          for (
            var t = new Array(this.getLength() + e.getLength() - 1), i = 0;
            i < this.getLength();
            i++
          )
            for (var o = 0; o < e.getLength(); o++)
              t[i + o] ^= h.gexp(h.glog(this.get(i)) + h.glog(e.get(o)));
          return new f(t, 0);
        },
        mod: function (e) {
          if (this.getLength() - e.getLength() < 0) return this;
          for (
            var t = h.glog(this.get(0)) - h.glog(e.get(0)),
              i = new Array(this.getLength()),
              o = 0;
            o < this.getLength();
            o++
          )
            i[o] = this.get(o);
          for (o = 0; o < e.getLength(); o++)
            i[o] ^= h.gexp(h.glog(e.get(o)) + t);
          return new f(i, 0).mod(e);
        },
      }),
      (m.RS_BLOCK_TABLE = [
        [1, 26, 19],
        [1, 26, 16],
        [1, 26, 13],
        [1, 26, 9],
        [1, 44, 34],
        [1, 44, 28],
        [1, 44, 22],
        [1, 44, 16],
        [1, 70, 55],
        [1, 70, 44],
        [2, 35, 17],
        [2, 35, 13],
        [1, 100, 80],
        [2, 50, 32],
        [2, 50, 24],
        [4, 25, 9],
        [1, 134, 108],
        [2, 67, 43],
        [2, 33, 15, 2, 34, 16],
        [2, 33, 11, 2, 34, 12],
        [2, 86, 68],
        [4, 43, 27],
        [4, 43, 19],
        [4, 43, 15],
        [2, 98, 78],
        [4, 49, 31],
        [2, 32, 14, 4, 33, 15],
        [4, 39, 13, 1, 40, 14],
        [2, 121, 97],
        [2, 60, 38, 2, 61, 39],
        [4, 40, 18, 2, 41, 19],
        [4, 40, 14, 2, 41, 15],
        [2, 146, 116],
        [3, 58, 36, 2, 59, 37],
        [4, 36, 16, 4, 37, 17],
        [4, 36, 12, 4, 37, 13],
        [2, 86, 68, 2, 87, 69],
        [4, 69, 43, 1, 70, 44],
        [6, 43, 19, 2, 44, 20],
        [6, 43, 15, 2, 44, 16],
        [4, 101, 81],
        [1, 80, 50, 4, 81, 51],
        [4, 50, 22, 4, 51, 23],
        [3, 36, 12, 8, 37, 13],
        [2, 116, 92, 2, 117, 93],
        [6, 58, 36, 2, 59, 37],
        [4, 46, 20, 6, 47, 21],
        [7, 42, 14, 4, 43, 15],
        [4, 133, 107],
        [8, 59, 37, 1, 60, 38],
        [8, 44, 20, 4, 45, 21],
        [12, 33, 11, 4, 34, 12],
        [3, 145, 115, 1, 146, 116],
        [4, 64, 40, 5, 65, 41],
        [11, 36, 16, 5, 37, 17],
        [11, 36, 12, 5, 37, 13],
        [5, 109, 87, 1, 110, 88],
        [5, 65, 41, 5, 66, 42],
        [5, 54, 24, 7, 55, 25],
        [11, 36, 12],
        [5, 122, 98, 1, 123, 99],
        [7, 73, 45, 3, 74, 46],
        [15, 43, 19, 2, 44, 20],
        [3, 45, 15, 13, 46, 16],
        [1, 135, 107, 5, 136, 108],
        [10, 74, 46, 1, 75, 47],
        [1, 50, 22, 15, 51, 23],
        [2, 42, 14, 17, 43, 15],
        [5, 150, 120, 1, 151, 121],
        [9, 69, 43, 4, 70, 44],
        [17, 50, 22, 1, 51, 23],
        [2, 42, 14, 19, 43, 15],
        [3, 141, 113, 4, 142, 114],
        [3, 70, 44, 11, 71, 45],
        [17, 47, 21, 4, 48, 22],
        [9, 39, 13, 16, 40, 14],
        [3, 135, 107, 5, 136, 108],
        [3, 67, 41, 13, 68, 42],
        [15, 54, 24, 5, 55, 25],
        [15, 43, 15, 10, 44, 16],
        [4, 144, 116, 4, 145, 117],
        [17, 68, 42],
        [17, 50, 22, 6, 51, 23],
        [19, 46, 16, 6, 47, 17],
        [2, 139, 111, 7, 140, 112],
        [17, 74, 46],
        [7, 54, 24, 16, 55, 25],
        [34, 37, 13],
        [4, 151, 121, 5, 152, 122],
        [4, 75, 47, 14, 76, 48],
        [11, 54, 24, 14, 55, 25],
        [16, 45, 15, 14, 46, 16],
        [6, 147, 117, 4, 148, 118],
        [6, 73, 45, 14, 74, 46],
        [11, 54, 24, 16, 55, 25],
        [30, 46, 16, 2, 47, 17],
        [8, 132, 106, 4, 133, 107],
        [8, 75, 47, 13, 76, 48],
        [7, 54, 24, 22, 55, 25],
        [22, 45, 15, 13, 46, 16],
        [10, 142, 114, 2, 143, 115],
        [19, 74, 46, 4, 75, 47],
        [28, 50, 22, 6, 51, 23],
        [33, 46, 16, 4, 47, 17],
        [8, 152, 122, 4, 153, 123],
        [22, 73, 45, 3, 74, 46],
        [8, 53, 23, 26, 54, 24],
        [12, 45, 15, 28, 46, 16],
        [3, 147, 117, 10, 148, 118],
        [3, 73, 45, 23, 74, 46],
        [4, 54, 24, 31, 55, 25],
        [11, 45, 15, 31, 46, 16],
        [7, 146, 116, 7, 147, 117],
        [21, 73, 45, 7, 74, 46],
        [1, 53, 23, 37, 54, 24],
        [19, 45, 15, 26, 46, 16],
        [5, 145, 115, 10, 146, 116],
        [19, 75, 47, 10, 76, 48],
        [15, 54, 24, 25, 55, 25],
        [23, 45, 15, 25, 46, 16],
        [13, 145, 115, 3, 146, 116],
        [2, 74, 46, 29, 75, 47],
        [42, 54, 24, 1, 55, 25],
        [23, 45, 15, 28, 46, 16],
        [17, 145, 115],
        [10, 74, 46, 23, 75, 47],
        [10, 54, 24, 35, 55, 25],
        [19, 45, 15, 35, 46, 16],
        [17, 145, 115, 1, 146, 116],
        [14, 74, 46, 21, 75, 47],
        [29, 54, 24, 19, 55, 25],
        [11, 45, 15, 46, 46, 16],
        [13, 145, 115, 6, 146, 116],
        [14, 74, 46, 23, 75, 47],
        [44, 54, 24, 7, 55, 25],
        [59, 46, 16, 1, 47, 17],
        [12, 151, 121, 7, 152, 122],
        [12, 75, 47, 26, 76, 48],
        [39, 54, 24, 14, 55, 25],
        [22, 45, 15, 41, 46, 16],
        [6, 151, 121, 14, 152, 122],
        [6, 75, 47, 34, 76, 48],
        [46, 54, 24, 10, 55, 25],
        [2, 45, 15, 64, 46, 16],
        [17, 152, 122, 4, 153, 123],
        [29, 74, 46, 14, 75, 47],
        [49, 54, 24, 10, 55, 25],
        [24, 45, 15, 46, 46, 16],
        [4, 152, 122, 18, 153, 123],
        [13, 74, 46, 32, 75, 47],
        [48, 54, 24, 14, 55, 25],
        [42, 45, 15, 32, 46, 16],
        [20, 147, 117, 4, 148, 118],
        [40, 75, 47, 7, 76, 48],
        [43, 54, 24, 22, 55, 25],
        [10, 45, 15, 67, 46, 16],
        [19, 148, 118, 6, 149, 119],
        [18, 75, 47, 31, 76, 48],
        [34, 54, 24, 34, 55, 25],
        [20, 45, 15, 61, 46, 16],
      ]),
      (m.getRSBlocks = function (e, t) {
        var i = m.getRsBlockTable(e, t);
        if (null == i)
          throw new Error(
            "bad rs block @ typeNumber:" + e + "/errorCorrectLevel:" + t
          );
        for (var o = i.length / 3, r = new Array(), n = 0; n < o; n++)
          for (
            var s = i[3 * n + 0], a = i[3 * n + 1], l = i[3 * n + 2], d = 0;
            d < s;
            d++
          )
            r.push(new m(a, l));
        return r;
      }),
      (m.getRsBlockTable = function (e, t) {
        switch (t) {
          case o.L:
            return m.RS_BLOCK_TABLE[4 * (e - 1) + 0];
          case o.M:
            return m.RS_BLOCK_TABLE[4 * (e - 1) + 1];
          case o.Q:
            return m.RS_BLOCK_TABLE[4 * (e - 1) + 2];
          case o.H:
            return m.RS_BLOCK_TABLE[4 * (e - 1) + 3];
          default:
            return;
        }
      }),
      (v.prototype = {
        get: function (e) {
          var t = Math.floor(e / 8);
          return 1 == ((this.buffer[t] >>> (7 - (e % 8))) & 1);
        },
        put: function (e, t) {
          for (var i = 0; i < t; i++)
            this.putBit(1 == ((e >>> (t - i - 1)) & 1));
        },
        getLengthInBits: function () {
          return this.length;
        },
        putBit: function (e) {
          var t = Math.floor(this.length / 8);
          this.buffer.length <= t && this.buffer.push(0),
            e && (this.buffer[t] |= 128 >>> this.length % 8),
            this.length++;
        },
      }),
      (t.errorCorrectLevel = o),
      (w.errorCorrectLevel = t.errorCorrectLevel),
      (w.Error = function (e) {
        this.errMsg = "[uQRCode]: " + e;
      }),
      (w.plugins = []),
      (w.use = function (e) {
        "function" == typeof e && w.plugins.push(e);
      }),
      (w.prototype.loadImage = function (e) {
        return Promise.resolve(e);
      }),
      (w.prototype.setOptions = function (e) {
        var t,
          i,
          o,
          r,
          n,
          s,
          a,
          l,
          d,
          u,
          c,
          p,
          h,
          g,
          f,
          m,
          v,
          y,
          w,
          b,
          S,
          T,
          E,
          C,
          x,
          I,
          k,
          P,
          M,
          L,
          _,
          B,
          O,
          z,
          A,
          D,
          N,
          R,
          F,
          G,
          j,
          W,
          H,
          V,
          Y,
          X,
          q,
          U,
          K,
          Q,
          J,
          $,
          Z,
          ee,
          te,
          ie;
        e &&
          (Object.keys(e).forEach((t) => {
            this[t] = e[t];
          }),
          (function (e = {}, t = {}, i = !1) {
            let o;
            for (var r in ((o = i ? e : { ...e }), t)) {
              var n = t[r];
              null != n &&
                (n.constructor == Object
                  ? (o[r] = this.deepReplace(o[r], n))
                  : n.constructor != String || n
                  ? (o[r] = n)
                  : (o[r] = o[r]));
            }
          })(
            this,
            {
              data: e.data || e.text,
              dataEncode: e.dataEncode,
              size: e.size,
              useDynamicSize: e.useDynamicSize,
              typeNumber: e.typeNumber,
              errorCorrectLevel: e.errorCorrectLevel,
              margin: e.margin,
              areaColor: e.areaColor,
              backgroundColor:
                e.backgroundColor ||
                (null === (t = e.background) || void 0 === t
                  ? void 0
                  : t.color),
              backgroundImageSrc:
                e.backgroundImageSrc ||
                (null === (i = e.background) ||
                void 0 === i ||
                null === (o = i.image) ||
                void 0 === o
                  ? void 0
                  : o.src),
              backgroundImageWidth:
                e.backgroundImageWidth ||
                (null === (r = e.background) ||
                void 0 === r ||
                null === (n = r.image) ||
                void 0 === n
                  ? void 0
                  : n.width),
              backgroundImageHeight:
                e.backgroundImageHeight ||
                (null === (s = e.background) ||
                void 0 === s ||
                null === (a = s.image) ||
                void 0 === a
                  ? void 0
                  : a.height),
              backgroundImageX:
                e.backgroundImageX ||
                (null === (l = e.background) ||
                void 0 === l ||
                null === (d = l.image) ||
                void 0 === d
                  ? void 0
                  : d.x),
              backgroundImageY:
                e.backgroundImageY ||
                (null === (u = e.background) ||
                void 0 === u ||
                null === (c = u.image) ||
                void 0 === c
                  ? void 0
                  : c.y),
              backgroundImageAlpha:
                e.backgroundImageAlpha ||
                (null === (p = e.background) ||
                void 0 === p ||
                null === (h = p.image) ||
                void 0 === h
                  ? void 0
                  : h.alpha),
              backgroundImageBorderRadius:
                e.backgroundImageBorderRadius ||
                (null === (g = e.background) ||
                void 0 === g ||
                null === (f = g.image) ||
                void 0 === f
                  ? void 0
                  : f.borderRadius),
              backgroundPadding: e.backgroundPadding,
              foregroundColor:
                e.foregroundColor ||
                (null === (m = e.foreground) || void 0 === m
                  ? void 0
                  : m.color),
              foregroundImageSrc:
                e.foregroundImageSrc ||
                (null === (v = e.foreground) ||
                void 0 === v ||
                null === (y = v.image) ||
                void 0 === y
                  ? void 0
                  : y.src),
              foregroundImageWidth:
                e.foregroundImageWidth ||
                (null === (w = e.foreground) ||
                void 0 === w ||
                null === (b = w.image) ||
                void 0 === b
                  ? void 0
                  : b.width),
              foregroundImageHeight:
                e.foregroundImageHeight ||
                (null === (S = e.foreground) ||
                void 0 === S ||
                null === (T = S.image) ||
                void 0 === T
                  ? void 0
                  : T.height),
              foregroundImageX:
                e.foregroundImageX ||
                (null === (E = e.foreground) ||
                void 0 === E ||
                null === (C = E.image) ||
                void 0 === C
                  ? void 0
                  : C.x),
              foregroundImageY:
                e.foregroundImageY ||
                (null === (x = e.foreground) ||
                void 0 === x ||
                null === (I = x.image) ||
                void 0 === I
                  ? void 0
                  : I.y),
              foregroundImagePadding:
                e.foregroundImagePadding ||
                (null === (k = e.foreground) ||
                void 0 === k ||
                null === (P = k.image) ||
                void 0 === P
                  ? void 0
                  : P.padding),
              foregroundImageBackgroundColor:
                e.foregroundImageBackgroundColor ||
                (null === (M = e.foreground) ||
                void 0 === M ||
                null === (L = M.image) ||
                void 0 === L
                  ? void 0
                  : L.backgroundColor),
              foregroundImageBorderRadius:
                e.foregroundImageBorderRadius ||
                (null === (_ = e.foreground) ||
                void 0 === _ ||
                null === (B = _.image) ||
                void 0 === B
                  ? void 0
                  : B.borderRadius),
              foregroundImageShadowOffsetX:
                e.foregroundImageShadowOffsetX ||
                (null === (O = e.foreground) ||
                void 0 === O ||
                null === (z = O.image) ||
                void 0 === z
                  ? void 0
                  : z.shadowOffsetX),
              foregroundImageShadowOffsetY:
                e.foregroundImageShadowOffsetY ||
                (null === (A = e.foreground) ||
                void 0 === A ||
                null === (D = A.image) ||
                void 0 === D
                  ? void 0
                  : D.shadowOffsetY),
              foregroundImageShadowBlur:
                e.foregroundImageShadowBlur ||
                (null === (N = e.foreground) ||
                void 0 === N ||
                null === (R = N.image) ||
                void 0 === R
                  ? void 0
                  : R.shadowBlur),
              foregroundImageShadowColor:
                e.foregroundImageShadowColor ||
                (null === (F = e.foreground) ||
                void 0 === F ||
                null === (G = F.image) ||
                void 0 === G
                  ? void 0
                  : G.shadowColor),
              foregroundPadding: e.foregroundPadding,
              positionProbeBackgroundColor:
                e.positionProbeBackgroundColor ||
                (null === (j = e.positionProbe) || void 0 === j
                  ? void 0
                  : j.backgroundColor) ||
                (null === (W = e.positionDetection) || void 0 === W
                  ? void 0
                  : W.backgroundColor),
              positionProbeForegroundColor:
                e.positionProbeForegroundColor ||
                (null === (H = e.positionProbe) || void 0 === H
                  ? void 0
                  : H.foregroundColor) ||
                (null === (V = e.positionDetection) || void 0 === V
                  ? void 0
                  : V.foregroundColor),
              separatorColor:
                e.separatorColor ||
                (null === (Y = e.separator) || void 0 === Y ? void 0 : Y.color),
              positionAdjustBackgroundColor:
                e.positionAdjustBackgroundColor ||
                (null === (X = e.positionAdjust) || void 0 === X
                  ? void 0
                  : X.backgroundColor) ||
                (null === (q = e.alignment) || void 0 === q
                  ? void 0
                  : q.backgroundColor),
              positionAdjustForegroundColor:
                e.positionAdjustForegroundColor ||
                (null === (U = e.positionAdjust) || void 0 === U
                  ? void 0
                  : U.foregroundColor) ||
                (null === (K = e.alignment) || void 0 === K
                  ? void 0
                  : K.foregroundColor),
              timingBackgroundColor:
                e.timingBackgroundColor ||
                (null === (Q = e.timing) || void 0 === Q
                  ? void 0
                  : Q.backgroundColor),
              timingForegroundColor:
                e.timingForegroundColor ||
                (null === (J = e.timing) || void 0 === J
                  ? void 0
                  : J.foregroundColor),
              typeNumberBackgroundColor:
                e.typeNumberBackgroundColor ||
                (null === ($ = e.typeNumber) || void 0 === $
                  ? void 0
                  : $.backgroundColor) ||
                (null === (Z = e.versionInformation) || void 0 === Z
                  ? void 0
                  : Z.backgroundColor),
              typeNumberForegroundColor:
                e.typeNumberForegroundColor ||
                (null === (ee = e.typeNumber) || void 0 === ee
                  ? void 0
                  : ee.foregroundColor) ||
                (null === (te = e.versionInformation) || void 0 === te
                  ? void 0
                  : te.foregroundColor),
              darkBlockColor:
                e.darkBlockColor ||
                (null === (ie = e.darkBlock) || void 0 === ie
                  ? void 0
                  : ie.color),
            },
            !0
          ));
      }),
      (w.prototype.make = function () {
        let {
          foregroundColor: e,
          backgroundColor: i,
          typeNumber: o,
          errorCorrectLevel: r,
          data: n,
          dataEncode: s,
          size: a,
          margin: l,
          useDynamicSize: d,
        } = this;
        if (e === i)
          throw new w.Error(
            "foregroundColor and backgroundColor cannot be the same!"
          );
        s &&
          (n = (function (e) {
            e = e.toString();
            for (var t, i = "", o = 0; o < e.length; o++)
              (t = e.charCodeAt(o)) >= 1 && t <= 127
                ? (i += e.charAt(o))
                : t > 2047
                ? ((i += String.fromCharCode(224 | ((t >> 12) & 15))),
                  (i += String.fromCharCode(128 | ((t >> 6) & 63))),
                  (i += String.fromCharCode(128 | ((t >> 0) & 63))))
                : ((i += String.fromCharCode(192 | ((t >> 6) & 31))),
                  (i += String.fromCharCode(128 | ((t >> 0) & 63))));
            return i;
          })(n));
        var u = new t(o, r);
        u.addData(n),
          u.make(),
          (this.base = u),
          (this.typeNumber = u.typeNumber),
          (this.modules = u.modules),
          (this.moduleCount = u.moduleCount),
          (this.dynamicSize = d
            ? Math.ceil((a - 2 * l) / u.moduleCount) * u.moduleCount + 2 * l
            : a),
          (function (e) {
            let {
              dynamicSize: t,
              margin: i,
              backgroundColor: o,
              backgroundPadding: r,
              foregroundColor: n,
              foregroundPadding: s,
              modules: a,
              moduleCount: l,
            } = e;
            var d = (t - 2 * i) / l,
              u = d,
              c = 0;
            r > 0 && (u -= 2 * (c = (u * r) / 2));
            var p = d,
              h = 0;
            s > 0 && (p -= 2 * (h = (p * s) / 2));
            for (var g = 0; g < l; g++)
              for (var f = 0; f < l; f++) {
                var m = f * d + i,
                  v = g * d + i;
                if (a[g][f]) {
                  var y = h,
                    w = m + h,
                    b = v + h,
                    S = p,
                    T = p;
                  a[g][f] = {
                    type: ["foreground"],
                    color: n,
                    isBlack: !0,
                    isDrawn: !1,
                    destX: m,
                    destY: v,
                    destWidth: d,
                    destHeight: d,
                    x: w,
                    y: b,
                    width: S,
                    height: T,
                    paddingTop: y,
                    paddingRight: y,
                    paddingBottom: y,
                    paddingLeft: y,
                  };
                } else
                  (y = c),
                    (w = m + c),
                    (b = v + c),
                    (S = u),
                    (T = u),
                    (a[g][f] = {
                      type: ["background"],
                      color: o,
                      isBlack: !1,
                      isDrawn: !1,
                      destX: m,
                      destY: v,
                      destWidth: d,
                      destHeight: d,
                      x: w,
                      y: b,
                      width: S,
                      height: T,
                      paddingTop: y,
                      paddingRight: y,
                      paddingBottom: y,
                      paddingLeft: y,
                    });
              }
          })(this),
          (function (e) {
            let {
              modules: t,
              moduleCount: i,
              positionProbeBackgroundColor: o,
              positionProbeForegroundColor: r,
            } = e;
            var n = i - 7;
            [
              [0, 0, 1],
              [1, 0, 1],
              [2, 0, 1],
              [3, 0, 1],
              [4, 0, 1],
              [5, 0, 1],
              [6, 0, 1],
              [0, 1, 1],
              [1, 1, 0],
              [2, 1, 0],
              [3, 1, 0],
              [4, 1, 0],
              [5, 1, 0],
              [6, 1, 1],
              [0, 2, 1],
              [1, 2, 0],
              [2, 2, 1],
              [3, 2, 1],
              [4, 2, 1],
              [5, 2, 0],
              [6, 2, 1],
              [0, 3, 1],
              [1, 3, 0],
              [2, 3, 1],
              [3, 3, 1],
              [4, 3, 1],
              [5, 3, 0],
              [6, 3, 1],
              [0, 4, 1],
              [1, 4, 0],
              [2, 4, 1],
              [3, 4, 1],
              [4, 4, 1],
              [5, 4, 0],
              [6, 4, 1],
              [0, 5, 1],
              [1, 5, 0],
              [2, 5, 0],
              [3, 5, 0],
              [4, 5, 0],
              [5, 5, 0],
              [6, 5, 1],
              [0, 6, 1],
              [1, 6, 1],
              [2, 6, 1],
              [3, 6, 1],
              [4, 6, 1],
              [5, 6, 1],
              [6, 6, 1],
            ].forEach((e) => {
              var i = t[e[0]][e[1]],
                s = t[e[0] + n][e[1]],
                a = t[e[0]][e[1] + n];
              a.type.push("positionProbe"),
                s.type.push("positionProbe"),
                i.type.push("positionProbe"),
                (i.color = 1 == e[2] ? r : o),
                (s.color = 1 == e[2] ? r : o),
                (a.color = 1 == e[2] ? r : o);
            });
          })(this),
          (function (e) {
            let { modules: t, moduleCount: i, separatorColor: o } = e;
            [
              [7, 0],
              [7, 1],
              [7, 2],
              [7, 3],
              [7, 4],
              [7, 5],
              [7, 6],
              [7, 7],
              [0, 7],
              [1, 7],
              [2, 7],
              [3, 7],
              [4, 7],
              [5, 7],
              [6, 7],
            ].forEach((e) => {
              var r = t[e[0]][e[1]],
                n = t[i - e[0] - 1][e[1]],
                s = t[e[0]][i - e[1] - 1];
              s.type.push("separator"),
                n.type.push("separator"),
                r.type.push("separator"),
                (r.color = o),
                (n.color = o),
                (s.color = o);
            });
          })(this),
          (function (e) {
            let {
              typeNumber: t,
              modules: i,
              moduleCount: o,
              foregroundColor: r,
              backgroundColor: n,
              positionAdjustForegroundColor: s,
              positionAdjustBackgroundColor: a,
              timingForegroundColor: l,
              timingBackgroundColor: d,
            } = e;
            var u = [
              [],
              [6, 18],
              [6, 22],
              [6, 26],
              [6, 30],
              [6, 34],
              [6, 22, 38],
              [6, 24, 42],
              [6, 26, 46],
              [6, 28, 50],
              [6, 30, 54],
              [6, 32, 58],
              [6, 34, 62],
              [6, 26, 46, 66],
              [6, 26, 48, 70],
              [6, 26, 50, 74],
              [6, 30, 54, 78],
              [6, 30, 56, 82],
              [6, 30, 58, 86],
              [6, 34, 62, 90],
              [6, 28, 50, 72, 94],
              [6, 26, 50, 74, 98],
              [6, 30, 54, 78, 102],
              [6, 28, 54, 80, 106],
              [6, 32, 58, 84, 110],
              [6, 30, 58, 86, 114],
              [6, 34, 62, 90, 118],
              [6, 26, 50, 74, 98, 122],
              [6, 30, 54, 78, 102, 126],
              [6, 26, 52, 78, 104, 130],
              [6, 30, 56, 82, 108, 134],
              [6, 34, 60, 86, 112, 138],
              [6, 30, 58, 86, 114, 142],
              [6, 34, 62, 90, 118, 146],
              [6, 30, 54, 78, 102, 126, 150],
              [6, 24, 50, 76, 102, 128, 154],
              [6, 28, 54, 80, 106, 132, 158],
              [6, 32, 58, 84, 110, 136, 162],
              [6, 26, 54, 82, 110, 138, 166],
              [6, 30, 58, 86, 114, 142, 170],
            ][t - 1];
            if (u)
              for (
                var c = [
                    [-2, -2, 1],
                    [-1, -2, 1],
                    [0, -2, 1],
                    [1, -2, 1],
                    [2, -2, 1],
                    [-2, -1, 1],
                    [-1, -1, 0],
                    [0, -1, 0],
                    [1, -1, 0],
                    [2, -1, 1],
                    [-2, 0, 1],
                    [-1, 0, 0],
                    [0, 0, 1],
                    [1, 0, 0],
                    [2, 0, 1],
                    [-2, 1, 1],
                    [-1, 1, 0],
                    [0, 1, 0],
                    [1, 1, 0],
                    [2, 1, 1],
                    [-2, 2, 1],
                    [-1, 2, 1],
                    [0, 2, 1],
                    [1, 2, 1],
                    [2, 2, 1],
                  ],
                  p = u.length,
                  h = 0;
                h < p;
                h++
              )
                for (var g = 0; g < p; g++) {
                  var { x: f, y: m } = { x: u[h], y: u[g] };
                  (f < 9 && m < 9) ||
                    (f > o - 9 - 1 && m < 9) ||
                    (m > o - 9 - 1 && f < 9) ||
                    c.forEach((e) => {
                      var t = i[f + e[0]][m + e[1]];
                      t.type.push("positionAdjust"),
                        t.type.includes("timing")
                          ? 1 == e[2]
                            ? (t.color = s == r ? l : s)
                            : (t.color = s == r && a == n ? d : a)
                          : (t.color = 1 == e[2] ? s : a);
                    });
                }
          })(this),
          (function (e) {
            let {
              modules: t,
              moduleCount: i,
              timingForegroundColor: o,
              timingBackgroundColor: r,
            } = e;
            for (var n = i - 16, s = 0; s < n; s++) {
              var a = t[6][8 + s],
                l = t[8 + s][6];
              a.type.push("timing"),
                l.type.push("timing"),
                (a.color = (1 & s) ^ 1 ? o : r),
                (l.color = (1 & s) ^ 1 ? o : r);
            }
          })(this),
          (function (e) {
            let { modules: t, moduleCount: i, darkBlockColor: o } = e;
            var r = t[i - 7 - 1][8];
            r.type.push("darkBlock"), (r.color = o);
          })(this),
          (function (e) {
            let {
              typeNumber: t,
              modules: i,
              moduleCount: o,
              typeNumberBackgroundColor: r,
              typeNumberForegroundColor: n,
            } = e;
            if (t < 7) return i;
            var s = [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                "000111110010010100",
                "001000010110111100",
                "001001101010011001",
                "001010010011010011",
                "001011101111110110",
                "001100011101100010",
                "001101100001000111",
                "001110011000001101",
                "001111100100101000",
                "010000101101111000",
                "010001010001011101",
                "010010101000010111",
                "010011010100110010",
                "010100100110100110",
                "010101011010000011",
                "010110100011001001",
                "010111011111101100",
                "011000111011000100",
                "011001000111100001",
                "011010111110101011",
                "011011000010001110",
                "011100110000011010",
                "011101001100111111",
                "011110110101110101",
                "011111001001010000",
                "100000100111010101",
                "100001011011110000",
                "100010100010111010",
                "100011011110011111",
                "100100101100001011",
                "100101010000101110",
                "100110101001100100",
                "100111010101000001",
                "101000110001101001",
              ],
              a = s[t] + s[t],
              l = [o - 11, o - 10, o - 9];
            [
              [5, l[2]],
              [5, l[1]],
              [5, l[0]],
              [4, l[2]],
              [4, l[1]],
              [4, l[0]],
              [3, l[2]],
              [3, l[1]],
              [3, l[0]],
              [2, l[2]],
              [2, l[1]],
              [2, l[0]],
              [1, l[2]],
              [1, l[1]],
              [1, l[0]],
              [0, l[2]],
              [0, l[1]],
              [0, l[0]],
              [l[2], 5],
              [l[1], 5],
              [l[0], 5],
              [l[2], 4],
              [l[1], 4],
              [l[0], 4],
              [l[2], 3],
              [l[1], 3],
              [l[0], 3],
              [l[2], 2],
              [l[1], 2],
              [l[0], 2],
              [l[2], 1],
              [l[1], 1],
              [l[0], 1],
              [l[2], 0],
              [l[1], 0],
              [l[0], 0],
            ].forEach((e, t) => {
              var o = i[e[0]][e[1]];
              o.type.push("typeNumber"), (o.color = "1" == a[t] ? n : r);
            });
          })(this),
          (this.isMaked = !0),
          (this.drawModules = []);
      }),
      (w.prototype.getDrawModules = function () {
        if (this.drawModules && this.drawModules.length > 0)
          return this.drawModules;
        let e = (this.drawModules = []),
          {
            modules: t,
            moduleCount: i,
            dynamicSize: o,
            areaColor: r,
            backgroundImageSrc: n,
            backgroundImageX: s,
            backgroundImageY: a,
            backgroundImageWidth: l,
            backgroundImageHeight: d,
            backgroundImageAlpha: u,
            backgroundImageBorderRadius: c,
            foregroundImageSrc: p,
            foregroundImageX: h,
            foregroundImageY: g,
            foregroundImageWidth: f,
            foregroundImageHeight: m,
            foregroundImagePadding: v,
            foregroundImageBackgroundColor: y,
            foregroundImageBorderRadius: w,
            foregroundImageShadowOffsetX: b,
            foregroundImageShadowOffsetY: S,
            foregroundImageShadowBlur: T,
            foregroundImageShadowColor: E,
          } = this;
        r &&
          e.push({
            name: "area",
            type: "area",
            color: r,
            x: 0,
            y: 0,
            width: o,
            height: o,
          }),
          n &&
            e.push({
              name: "backgroundImage",
              type: "image",
              imageSrc: n,
              mappingName: "backgroundImageSrc",
              x: s,
              y: a,
              width: l,
              height: d,
              alpha: u,
              borderRadius: c,
            });
        for (var C = 0; C < i; C++)
          for (var x = 0; x < i; x++) {
            var I = t[C][x];
            I.isDrawn ||
              (I.type.includes("foreground")
                ? e.push({
                    name: "foreground",
                    type: "tile",
                    color: I.color,
                    destX: I.destX,
                    destY: I.destY,
                    destWidth: I.destWidth,
                    destHeight: I.destHeight,
                    x: I.x,
                    y: I.y,
                    width: I.width,
                    height: I.height,
                    paddingTop: I.paddingTop,
                    paddingRight: I.paddingRight,
                    paddingBottom: I.paddingBottom,
                    paddingLeft: I.paddingLeft,
                    rowIndex: C,
                    colIndex: x,
                  })
                : e.push({
                    name: "background",
                    type: "tile",
                    color: I.color,
                    destX: I.destX,
                    destY: I.destY,
                    destWidth: I.destWidth,
                    destHeight: I.destHeight,
                    x: I.x,
                    y: I.y,
                    width: I.width,
                    height: I.height,
                    paddingTop: I.paddingTop,
                    paddingRight: I.paddingRight,
                    paddingBottom: I.paddingBottom,
                    paddingLeft: I.paddingLeft,
                    rowIndex: C,
                    colIndex: x,
                  }),
              (I.isDrawn = !0));
          }
        return (
          p &&
            e.push({
              name: "foregroundImage",
              type: "image",
              imageSrc: p,
              mappingName: "foregroundImageSrc",
              x: h,
              y: g,
              width: f,
              height: m,
              padding: v,
              backgroundColor: y,
              borderRadius: w,
              shadowOffsetX: b,
              shadowOffsetY: S,
              shadowBlur: T,
              shadowColor: E,
            }),
          e
        );
      }),
      (w.prototype.isBlack = function (e, t) {
        var i = this.moduleCount;
        return (
          !(0 > e || 0 > t || e >= i || t >= i) && this.modules[e][t].isBlack
        );
      }),
      (w.prototype.drawCanvas = function (e) {
        let {
          isMaked: t,
          canvasContext: i,
          useDynamicSize: o,
          dynamicSize: r,
          foregroundColor: n,
          foregroundPadding: s,
          backgroundColor: a,
          backgroundPadding: l,
          drawReserve: d,
          margin: u,
        } = this;
        if (!t)
          return Promise.reject(
            new w.Error("please execute the make method first!")
          );
        let c = this.getDrawModules(),
          p = async (t, o) => {
            try {
              i.draw(e);
              for (var r = 0; r < c.length; r++) {
                var n = c[r];
                switch ((i.save(), n.type)) {
                  case "area":
                    i.setFillStyle(n.color),
                      i.fillRect(n.x, n.y, n.width, n.height);
                    break;
                  case "tile":
                    var s = n.x,
                      a = n.y,
                      l = n.width,
                      u = n.height;
                    i.setFillStyle(n.color), i.fillRect(s, a, l, u);
                    break;
                  case "image":
                    if ("backgroundImage" === n.name) {
                      (s = Math.round(n.x)),
                        (a = Math.round(n.y)),
                        (l = Math.round(n.width)),
                        (u = Math.round(n.height)),
                        l < 2 * (h = Math.round(n.borderRadius)) && (h = l / 2),
                        u < 2 * h && (h = u / 2),
                        i.setGlobalAlpha(n.alpha),
                        h > 0 &&
                          (i.beginPath(),
                          i.moveTo(s + h, a),
                          i.arcTo(s + l, a, s + l, a + u, h),
                          i.arcTo(s + l, a + u, s, a + u, h),
                          i.arcTo(s, a + u, s, a, h),
                          i.arcTo(s, a, s + l, a, h),
                          i.closePath(),
                          i.setStrokeStyle("rgba(0,0,0,0)"),
                          i.stroke(),
                          i.clip());
                      try {
                        var p = await this.loadImage(n.imageSrc);
                        i.drawImage(p, s, a, l, u);
                      } catch (S) {
                        throw new w.Error(
                          "".concat(n.mappingName, " invalid!")
                        );
                      }
                    } else if ("foregroundImage" === n.name) {
                      (s = Math.round(n.x)),
                        (a = Math.round(n.y)),
                        (l = Math.round(n.width)),
                        (u = Math.round(n.height));
                      var h,
                        g = Math.round(n.padding);
                      l < 2 * (h = Math.round(n.borderRadius)) && (h = l / 2),
                        u < 2 * h && (h = u / 2);
                      var f = s - g,
                        m = a - g,
                        v = l + 2 * g,
                        y = u + 2 * g,
                        b = Math.round((v / l) * h);
                      v < 2 * b && (b = v / 2),
                        y < 2 * b && (b = y / 2),
                        i.save(),
                        i.setShadow(
                          n.shadowOffsetX,
                          n.shadowOffsetY,
                          n.shadowBlur,
                          n.shadowColor
                        ),
                        b > 0
                          ? (i.beginPath(),
                            i.moveTo(f + b, m),
                            i.arcTo(f + v, m, f + v, m + y, b),
                            i.arcTo(f + v, m + y, f, m + y, b),
                            i.arcTo(f, m + y, f, m, b),
                            i.arcTo(f, m, f + v, m, b),
                            i.closePath(),
                            i.setFillStyle(n.backgroundColor),
                            i.fill())
                          : (i.setFillStyle(n.backgroundColor),
                            i.fillRect(f, m, v, y)),
                        i.restore(),
                        i.save(),
                        b > 0
                          ? (i.beginPath(),
                            i.moveTo(f + b, m),
                            i.arcTo(f + v, m, f + v, m + y, b),
                            i.arcTo(f + v, m + y, f, m + y, b),
                            i.arcTo(f, m + y, f, m, b),
                            i.arcTo(f, m, f + v, m, b),
                            i.closePath(),
                            i.setFillStyle(
                              g > 0 ? n.backgroundColor : "rgba(0,0,0,0)"
                            ),
                            i.fill())
                          : (i.setFillStyle(
                              g > 0 ? n.backgroundColor : "rgba(0,0,0,0)"
                            ),
                            i.fillRect(f, m, v, y)),
                        i.restore(),
                        h > 0 &&
                          (i.beginPath(),
                          i.moveTo(s + h, a),
                          i.arcTo(s + l, a, s + l, a + u, h),
                          i.arcTo(s + l, a + u, s, a + u, h),
                          i.arcTo(s, a + u, s, a, h),
                          i.arcTo(s, a, s + l, a, h),
                          i.closePath(),
                          i.setStrokeStyle("rgba(0,0,0,0)"),
                          i.stroke(),
                          i.clip());
                      try {
                        (p = await this.loadImage(n.imageSrc)),
                          i.drawImage(p, s, a, l, u);
                      } catch (S) {
                        throw new w.Error(
                          "".concat(n.mappingName, " invalid!")
                        );
                      }
                    }
                }
                d && i.draw(!0), i.restore();
              }
              i.draw(!0), setTimeout(t, 150);
            } catch (S) {
              o(S);
            }
          };
        return new Promise((e, t) => {
          p(e, t);
        });
      }),
      (w.prototype.draw = function (e) {
        return this.drawCanvas(e);
      }),
      (w.prototype.register = function (e) {
        e && e(w, this, !0);
      }),
      w
    );
  })())
);
export {
  _e as A,
  z as I,
  B as M,
  Le as S,
  Ve as U,
  We as a,
  je as b,
  u as c,
  c as g,
  A as m,
};
