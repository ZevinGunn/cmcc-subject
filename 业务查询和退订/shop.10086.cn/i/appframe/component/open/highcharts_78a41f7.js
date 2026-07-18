!(function () {
  function a(a, h) {
    var n;
    a || (a = {});
    for (n in h) a[n] = h[n];
    return a;
  }
  function h() {
    var i,
      a,
      h = arguments,
      c = {},
      g = function (a, h) {
        var c, y;
        "object" != typeof a && (a = {});
        for (y in h)
          h.hasOwnProperty(y) &&
            ((c = h[y]),
            (a[y] =
              c &&
              "object" == typeof c &&
              "[object Array]" !== Object.prototype.toString.call(c) &&
              "renderTo" !== y &&
              "number" != typeof c.nodeType
                ? g(a[y] || {}, c)
                : h[y]));
        return a;
      };
    for (
      h[0] === !0 && ((c = h[1]), (h = Array.prototype.slice.call(h, 2))),
        a = h.length,
        i = 0;
      a > i;
      i++
    )
      c = g(c, h[i]);
    return c;
  }
  function c(s, a) {
    return parseInt(s, a || 10);
  }
  function g(s) {
    return "string" == typeof s;
  }
  function y(a) {
    return a && "object" == typeof a;
  }
  function v(a) {
    return "[object Array]" === Object.prototype.toString.call(a);
  }
  function b(n) {
    return "number" == typeof n;
  }
  function k(a) {
    return Ie.log(a) / Ie.LN10;
  }
  function w(a) {
    return Ie.pow(10, a);
  }
  function S(a, h) {
    for (var i = a.length; i--; )
      if (a[i] === h) {
        a.splice(i, 1);
        break;
      }
  }
  function T(a) {
    return a !== te && null !== a;
  }
  function P(a, h, c) {
    var v, b;
    if (g(h))
      T(c)
        ? a.setAttribute(h, c)
        : a && a.getAttribute && (b = a.getAttribute(h));
    else if (T(h) && y(h)) for (v in h) a.setAttribute(v, h[v]);
    return b;
  }
  function A(a) {
    return v(a) ? a : [a];
  }
  function C() {
    var i,
      a,
      h = arguments,
      c = h.length;
    for (i = 0; c > i; i++) if (((a = h[i]), a !== te && null !== a)) return a;
  }
  function L(h, c) {
    je &&
      !$e &&
      c &&
      c.opacity !== te &&
      (c.filter = "alpha(opacity=" + 100 * c.opacity + ")"),
      a(h.style, c);
  }
  function M(h, c, g, y, v) {
    var b = Me.createElement(h);
    return (
      c && a(b, c),
      v && L(b, { padding: 0, border: gi, margin: 0 }),
      g && L(b, g),
      y && y.appendChild(b),
      b
    );
  }
  function D(h, c) {
    var g = function () {
      return te;
    };
    return (g.prototype = new h()), a(g.prototype, c), g;
  }
  function I(a, h, g, y) {
    var v = se.lang,
      n = +a || 0,
      b =
        -1 === h
          ? (n.toString().split(".")[1] || "").length
          : isNaN((h = Xe(h)))
          ? 2
          : h,
      d = void 0 === g ? v.decimalPoint : g,
      t = void 0 === y ? v.thousandsSep : y,
      s = 0 > n ? "-" : "",
      i = String(c((n = Xe(n).toFixed(b)))),
      k = i.length > 3 ? i.length % 3 : 0;
    return (
      s +
      (k ? i.substr(0, k) + t : "") +
      i.substr(k).replace(/(\d{3})(?=\d)/g, "$1" + t) +
      (b
        ? d +
          Xe(n - i)
            .toFixed(b)
            .slice(2)
        : "")
    );
  }
  function B(a, h) {
    return new Array((h || 2) + 1 - String(a).length).join(0) + a;
  }
  function O(a, h, c) {
    var g = a[h];
    a[h] = function () {
      var a = Array.prototype.slice.call(arguments);
      return a.unshift(g), c.apply(this, a);
    };
  }
  function z(a, h) {
    var c,
      g = /f$/,
      y = /\.([0-9])/,
      v = se.lang;
    return (
      g.test(a)
        ? ((c = a.match(y)),
          (c = c ? c[1] : -1),
          null !== h &&
            (h = I(
              h,
              c,
              v.decimalPoint,
              a.indexOf(",") > -1 ? v.thousandsSep : ""
            )))
        : (h = ae(a, h)),
      h
    );
  }
  function R(a, h) {
    for (
      var c, g, y, i, v, b, k, w = "{", S = !1, T = [];
      -1 !== (k = a.indexOf(w));

    ) {
      if (((c = a.slice(0, k)), S)) {
        for (
          g = c.split(":"),
            y = g.shift().split("."),
            v = y.length,
            b = h,
            i = 0;
          v > i;
          i++
        )
          b = b[y[i]];
        g.length && (b = z(g.join(":"), b)), T.push(b);
      } else T.push(c);
      (a = a.slice(k + 1)), (S = !S), (w = S ? "}" : "{");
    }
    return T.push(a), T.join("");
  }
  function H(a) {
    return Ie.pow(10, Oe(Ie.log(a) / Ie.LN10));
  }
  function X(a, h, c, g) {
    var y, i;
    for (
      c = C(c, 1),
        y = a / c,
        h ||
          ((h = [1, 2, 2.5, 5, 10]),
          g &&
            g.allowDecimals === !1 &&
            (1 === c ? (h = [1, 2, 5, 10]) : 0.1 >= c && (h = [1 / c]))),
        i = 0;
      i < h.length && ((a = h[i]), !(y <= (h[i] + (h[i + 1] || h[i])) / 2));
      i++
    );
    return (a *= c);
  }
  function E(a, h) {
    var c,
      i,
      g = a.length;
    for (i = 0; g > i; i++) a[i].ss_i = i;
    for (
      a.sort(function (a, g) {
        return (c = h(a, g)), 0 === c ? a.ss_i - g.ss_i : c;
      }),
        i = 0;
      g > i;
      i++
    )
      delete a[i].ss_i;
  }
  function G(a) {
    for (var i = a.length, h = a[0]; i--; ) a[i] < h && (h = a[i]);
    return h;
  }
  function W(a) {
    for (var i = a.length, h = a[0]; i--; ) a[i] > h && (h = a[i]);
    return h;
  }
  function Y(a, h) {
    var n;
    for (n in a)
      a[n] && a[n] !== h && a[n].destroy && a[n].destroy(), delete a[n];
  }
  function N(a) {
    oe || (oe = M(si)), a && oe.appendChild(a), (oe.innerHTML = "");
  }
  function F(a) {
    return parseFloat(a.toPrecision(14));
  }
  function j(a, h) {
    he = C(a, h.animation);
  }
  function V() {
    var a = se.global.useUTC,
      h = a ? "getUTC" : "get",
      c = a ? "setUTC" : "set";
    (me = 6e4 * ((a && se.global.timezoneOffset) || 0)),
      (ge = a
        ? Date.UTC
        : function (a, h, c, g, y, v) {
            return new Date(a, h, C(c, 1), C(g, 0), C(y, 0), C(v, 0)).getTime();
          }),
      (ye = h + "Minutes"),
      (ve = h + "Hours"),
      (xe = h + "Day"),
      (be = h + "Date"),
      (ke = h + "Month"),
      (we = h + "FullYear"),
      (Se = c + "Minutes"),
      (Te = c + "Hours"),
      (Pe = c + "Date"),
      (Ae = c + "Month"),
      (Ce = c + "FullYear");
  }
  function _(a) {
    return (se = h(!0, se, a)), V(), se;
  }
  function U() {
    return se;
  }
  function Z() {}
  function K(a, h, c, g) {
    (this.axis = a),
      (this.pos = h),
      (this.type = c || ""),
      (this.isNew = !0),
      c || g || this.addLabel();
  }
  function $() {
    this.init.apply(this, arguments);
  }
  function J() {
    this.init.apply(this, arguments);
  }
  function Q(a, h, c, x, g) {
    var y = a.chart.inverted;
    (this.axis = a),
      (this.isNegative = c),
      (this.options = h),
      (this.x = x),
      (this.total = null),
      (this.points = {}),
      (this.stack = g),
      (this.alignOptions = {
        align: h.align || (y ? (c ? "left" : "right") : "center"),
        verticalAlign: h.verticalAlign || (y ? "middle" : c ? "bottom" : "top"),
        y: C(h.y, y ? 4 : c ? 14 : -6),
        x: C(h.x, y ? (c ? -6 : 6) : 0),
      }),
      (this.textAlign = h.textAlign || (y ? (c ? "right" : "left") : "center"));
  }
  var te,
    ee,
    ie,
    oe,
    se,
    ae,
    he,
    ce,
    pe,
    ue,
    fe,
    ge,
    me,
    ye,
    ve,
    xe,
    be,
    ke,
    we,
    Se,
    Te,
    Pe,
    Ae,
    Ce,
    Le,
    Me = document,
    De = window,
    Ie = Math,
    Be = Ie.round,
    Oe = Ie.floor,
    ze = Ie.ceil,
    Re = Ie.max,
    He = Ie.min,
    Xe = Ie.abs,
    Ee = Ie.cos,
    Ge = Ie.sin,
    We = Ie.PI,
    Ye = (2 * We) / 360,
    Ne = navigator.userAgent,
    Fe = De.opera,
    je = /msie/i.test(Ne) && !Fe,
    Ve = 8 === Me.documentMode,
    _e = /AppleWebKit/.test(Ne),
    Ue = /Firefox/.test(Ne),
    Ze = /(Mobile|Android|Windows Phone)/.test(Ne),
    Ke = "http://www.w3.org/2000/svg",
    $e = !!Me.createElementNS && !!Me.createElementNS(Ke, "svg").createSVGRect,
    qe = Ue && parseInt(Ne.split("Firefox/")[1], 10) < 4,
    Je = !$e && !je && !!Me.createElement("canvas").getContext,
    Qe = {},
    ti = 0,
    ei = function () {
      return te;
    },
    ii = [],
    ni = 0,
    oi = "Highcharts",
    ri = "4.0.3",
    si = "div",
    ai = "absolute",
    li = "relative",
    hi = "hidden",
    ci = "highcharts-",
    di = "visible",
    pi = "px",
    gi = "none",
    mi = "M",
    yi = "L",
    vi = /^[0-9]+$/,
    xi = "",
    bi = "hover",
    ki = "select",
    wi = "stroke-width",
    Si = {};
  De.Highcharts ? ue(16, !0) : (Le = De.Highcharts = {}),
    (ae = function (h, c, g) {
      if (!T(c) || isNaN(c)) return "Invalid date";
      h = C(h, "%Y-%m-%d %H:%M:%S");
      var y,
        v = new Date(c - me),
        b = v[ve](),
        k = v[xe](),
        w = v[be](),
        S = v[ke](),
        P = v[we](),
        A = se.lang,
        L = A.weekdays,
        M = a(
          {
            a: L[k].substr(0, 3),
            A: L[k],
            d: B(w),
            e: w,
            b: A.shortMonths[S],
            B: A.months[S],
            m: B(S + 1),
            y: P.toString().substr(2, 2),
            Y: P,
            H: B(b),
            I: B(b % 12 || 12),
            l: b % 12 || 12,
            M: B(v[ye]()),
            p: 12 > b ? "AM" : "PM",
            P: 12 > b ? "am" : "pm",
            S: B(v.getSeconds()),
            L: B(Be(c % 1e3), 3),
          },
          Le.dateFormats
        );
      for (y in M)
        for (; -1 !== h.indexOf("%" + y); )
          h = h.replace("%" + y, "function" == typeof M[y] ? M[y](c) : M[y]);
      return g ? h.substr(0, 1).toUpperCase() + h.substr(1) : h;
    }),
    (ue = function (a, h) {
      var c = "Highcharts error #" + a + ": www.highcharts.com/errors/" + a;
      if (h) throw c;
      De.console;
    }),
    (pe = {
      millisecond: 1,
      second: 1e3,
      minute: 6e4,
      hour: 36e5,
      day: 864e5,
      week: 6048e5,
      month: 26784e5,
      year: 31556952e3,
    }),
    (ce = {
      init: function (a, h, c) {
        h = h || "";
        var g,
          y,
          i,
          v,
          b,
          k = a.shift,
          w = h.indexOf("C") > -1,
          S = w ? 7 : 3,
          T = h.split(" "),
          P = [].concat(c),
          A = function (a) {
            for (i = a.length; i--; )
              a[i] === mi &&
                a.splice(i + 1, 0, a[i + 1], a[i + 2], a[i + 1], a[i + 2]);
          };
        if (
          (w && (A(T), A(P)),
          a.isArea &&
            ((v = T.splice(T.length - 6, 6)), (b = P.splice(P.length - 6, 6))),
          k <= P.length / S && T.length === P.length)
        )
          for (; k--; ) P = [].concat(P).splice(0, S).concat(P);
        if (((a.shift = 0), T.length))
          for (g = P.length; T.length < g; )
            (y = [].concat(T).splice(T.length - S, S)),
              w && ((y[S - 6] = y[S - 2]), (y[S - 5] = y[S - 1])),
              (T = T.concat(y));
        return v && ((T = T.concat(v)), (P = P.concat(b))), [T, P];
      },
      step: function (a, h, c, g) {
        var y,
          v = [],
          i = a.length;
        if (1 === c) v = g;
        else if (i === h.length && 1 > c)
          for (; i--; )
            (y = parseFloat(a[i])),
              (v[i] = isNaN(y) ? a[i] : c * parseFloat(h[i] - y) + y);
        else v = h;
        return v;
      },
    }),
    (function (h) {
      De.HighchartsAdapter =
        De.HighchartsAdapter ||
        (h && {
          init: function (a) {
            var c,
              y = h.fx,
              v = y.step,
              b = h.Tween,
              k = b && b.propHooks,
              w = h.cssHooks.opacity;
            h.extend(h.easing, {
              easeOutQuad: function (x, t, a, h, d) {
                return -h * (t /= d) * (t - 2) + a;
              },
            }),
              h.each(
                ["cur", "_default", "width", "height", "opacity"],
                function (i, a) {
                  var h,
                    c = v;
                  "cur" === a
                    ? (c = y.prototype)
                    : "_default" === a && b && ((c = k[a]), (a = "set")),
                    (h = c[a]),
                    h &&
                      (c[a] = function (c) {
                        var g;
                        return (
                          (c = i ? c : this),
                          "align" !== c.prop
                            ? ((g = c.elem),
                              g.attr
                                ? g.attr(c.prop, "cur" === a ? te : c.now)
                                : h.apply(this, arguments))
                            : void 0
                        );
                      });
                }
              ),
              O(w, "get", function (a, h, c) {
                return h.attr ? h.opacity || 0 : a.call(this, h, c);
              }),
              (c = function (h) {
                var c,
                  g = h.elem;
                h.started ||
                  ((c = a.init(g, g.d, g.toD)),
                  (h.start = c[0]),
                  (h.end = c[1]),
                  (h.started = !0)),
                  g.attr("d", a.step(h.start, h.end, h.pos, g.toD));
              }),
              b ? (k.d = { set: c }) : (v.d = c),
              (this.each = Array.prototype.forEach
                ? function (a, h) {
                    return Array.prototype.forEach.call(a, h);
                  }
                : function (a, h) {
                    var i,
                      c = a.length;
                    for (i = 0; c > i; i++)
                      if (h.call(a[i], a[i], i, a) === !1) return i;
                  }),
              (h.fn.highcharts = function () {
                var a,
                  h,
                  c,
                  y = "Chart",
                  v = arguments;
                return (
                  this[0] &&
                    (g(v[0]) &&
                      ((y = v[0]), (v = Array.prototype.slice.call(v, 1))),
                    (a = v[0]),
                    a !== te &&
                      ((a.chart = a.chart || {}),
                      (a.chart.renderTo = this[0]),
                      (c = new Le[y](a, v[1])),
                      (h = this)),
                    a === te && (h = ii[P(this[0], "data-highcharts-chart")])),
                  h
                );
              });
          },
          getScript: h.getScript,
          inArray: h.inArray,
          adapterRun: function (a, c) {
            return h(a)[c]();
          },
          grep: h.grep,
          map: function (a, h) {
            for (var c = [], i = 0, g = a.length; g > i; i++)
              c[i] = h.call(a[i], a[i], i, a);
            return c;
          },
          offset: function (a) {
            return h(a).offset();
          },
          addEvent: function (a, c, g) {
            h(a).bind(c, g);
          },
          removeEvent: function (a, c, g) {
            var y = Me.removeEventListener
              ? "removeEventListener"
              : "detachEvent";
            Me[y] && a && !a[y] && (a[y] = function () {}), h(a).unbind(c, g);
          },
          fireEvent: function (c, g, y, v) {
            var b,
              k = h.Event(g),
              w = "detached" + g;
            !je &&
              y &&
              (delete y.layerX, delete y.layerY, delete y.returnValue),
              a(k, y),
              c[g] && ((c[w] = c[g]), (c[g] = null)),
              h.each(["preventDefault", "stopPropagation"], function (i, a) {
                var h = k[a];
                k[a] = function () {
                  try {
                    h.call(k);
                  } catch (e) {
                    "preventDefault" === a && (b = !0);
                  }
                };
              }),
              h(c).trigger(k),
              c[w] && ((c[g] = c[w]), (c[w] = null)),
              !v || k.isDefaultPrevented() || b || v(k);
          },
          washMouseEvent: function (e) {
            var a = e.originalEvent || e;
            return (
              a.pageX === te && ((a.pageX = e.pageX), (a.pageY = e.pageY)), a
            );
          },
          animate: function (a, c, g) {
            var y = h(a);
            a.style || (a.style = {}),
              c.d && ((a.toD = c.d), (c.d = 1)),
              y.stop(),
              c.opacity !== te && a.attr && (c.opacity += "px"),
              y.animate(c, g);
          },
          stop: function (a) {
            h(a).stop();
          },
        });
    })(De.jQuery);
  var Ti = De.HighchartsAdapter,
    Pi = Ti || {};
  Ti && Ti.init.call(Ti, ce);
  var Ai = Pi.adapterRun,
    Ci = Pi.getScript,
    Li = Pi.inArray,
    Mi = Pi.each,
    Di = Pi.grep,
    Ii = Pi.offset,
    Bi = Pi.map,
    Oi = Pi.addEvent,
    zi = Pi.removeEvent,
    Ri = Pi.fireEvent,
    Hi = Pi.washMouseEvent,
    Xi = Pi.animate,
    Ei = Pi.stop,
    Gi = {
      enabled: !0,
      x: 0,
      y: 15,
      style: { color: "#606060", cursor: "default", fontSize: "11px" },
    };
  se = {
    colors: [
      "#7cb5ec",
      "#434348",
      "#90ed7d",
      "#f7a35c",
      "#8085e9",
      "#f15c80",
      "#e4d354",
      "#8085e8",
      "#8d4653",
      "#91e8e1",
    ],
    symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
    lang: {
      loading: "Loading...",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      shortMonths: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      weekdays: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      decimalPoint: ".",
      numericSymbols: ["k", "M", "G", "T", "P", "E"],
      resetZoom: "Reset zoom",
      resetZoomTitle: "Reset zoom level 1:1",
      thousandsSep: ",",
    },
    global: {
      useUTC: !0,
      canvasToolsURL:
        "http://code.highcharts.com/4.0.3/modules/canvas-tools.js",
      VMLRadialGradientURL:
        "http://code.highcharts.com/4.0.3/gfx/vml-radial-gradient.png",
    },
    chart: {
      borderColor: "#4572A7",
      borderRadius: 0,
      defaultSeriesType: "line",
      ignoreHiddenSeries: !0,
      spacing: [10, 10, 15, 10],
      backgroundColor: "#FFFFFF",
      plotBorderColor: "#C0C0C0",
      resetZoomButton: {
        theme: { zIndex: 20 },
        position: { align: "right", x: -10, y: 10 },
      },
    },
    title: {
      text: "Chart title",
      align: "center",
      margin: 15,
      style: { color: "#333333", fontSize: "18px" },
    },
    subtitle: { text: "", align: "center", style: { color: "#555555" } },
    plotOptions: {
      line: {
        allowPointSelect: !1,
        showCheckbox: !1,
        animation: { duration: 1e3 },
        events: {},
        lineWidth: 2,
        marker: {
          lineWidth: 0,
          radius: 4,
          lineColor: "#FFFFFF",
          states: {
            hover: { enabled: !0, lineWidthPlus: 1, radiusPlus: 2 },
            select: {
              fillColor: "#FFFFFF",
              lineColor: "#000000",
              lineWidth: 2,
            },
          },
        },
        point: { events: {} },
        dataLabels: h(Gi, {
          align: "center",
          enabled: !1,
          formatter: function () {
            return null === this.y ? "" : I(this.y, -1);
          },
          verticalAlign: "bottom",
          y: 0,
        }),
        cropThreshold: 300,
        pointRange: 0,
        states: {
          hover: {
            lineWidthPlus: 1,
            marker: {},
            halo: { size: 10, opacity: 0.25 },
          },
          select: { marker: {} },
        },
        stickyTracking: !0,
        turboThreshold: 1e3,
      },
    },
    labels: { style: { position: ai, color: "#3E576F" } },
    legend: {
      enabled: !0,
      align: "center",
      layout: "horizontal",
      labelFormatter: function () {
        return this.name;
      },
      borderColor: "#909090",
      borderRadius: 0,
      navigation: { activeColor: "#274b6d", inactiveColor: "#CCC" },
      shadow: !1,
      itemStyle: { color: "#333333", fontSize: "12px", fontWeight: "bold" },
      itemHoverStyle: { color: "#000" },
      itemHiddenStyle: { color: "#CCC" },
      itemCheckboxStyle: { position: ai, width: "13px", height: "13px" },
      symbolPadding: 5,
      verticalAlign: "bottom",
      x: 0,
      y: 0,
      title: { style: { fontWeight: "bold" } },
    },
    loading: {
      labelStyle: { fontWeight: "bold", position: li, top: "45%" },
      style: {
        position: ai,
        backgroundColor: "white",
        opacity: 0.5,
        textAlign: "center",
      },
    },
    tooltip: {
      enabled: !0,
      animation: $e,
      backgroundColor: "rgba(249, 249, 249, .85)",
      borderWidth: 1,
      borderRadius: 3,
      dateTimeLabelFormats: {
        millisecond: "%A, %b %e, %H:%M:%S.%L",
        second: "%A, %b %e, %H:%M:%S",
        minute: "%A, %b %e, %H:%M",
        hour: "%A, %b %e, %H:%M",
        day: "%A, %b %e, %Y",
        week: "Week from %A, %b %e, %Y",
        month: "%B %Y",
        year: "%Y",
      },
      headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>',
      pointFormat:
        '<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>',
      shadow: !0,
      snap: Ze ? 25 : 10,
      style: {
        color: "#333333",
        cursor: "default",
        fontSize: "12px",
        padding: "8px",
        whiteSpace: "nowrap",
      },
    },
    credits: {
      enabled: !0,
      text: "Highcharts.com",
      href: "http://www.highcharts.com",
      position: { align: "right", x: -10, verticalAlign: "bottom", y: -5 },
      style: { cursor: "pointer", color: "#909090", fontSize: "9px" },
    },
  };
  var Wi = se.plotOptions,
    Yi = Wi.line;
  V();
  var Ni =
      /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,
    Fi = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,
    ji = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,
    Vi = function (a) {
      function g(a) {
        a && a.stops
          ? (S = Bi(a.stops, function (a) {
              return Vi(a[1]);
            }))
          : ((w = Ni.exec(a)),
            w
              ? (T = [c(w[1]), c(w[2]), c(w[3]), parseFloat(w[4], 10)])
              : ((w = Fi.exec(a)),
                w
                  ? (T = [c(w[1], 16), c(w[2], 16), c(w[3], 16), 1])
                  : ((w = ji.exec(a)),
                    w && (T = [c(w[1]), c(w[2]), c(w[3]), 1]))));
      }
      function y(c) {
        var g;
        return (
          S
            ? ((g = h(a)),
              (g.stops = [].concat(g.stops)),
              Mi(S, function (a, i) {
                g.stops[i] = [g.stops[i][0], a.get(c)];
              }))
            : (g =
                T && !isNaN(T[0])
                  ? "rgb" === c
                    ? "rgb(" + T[0] + "," + T[1] + "," + T[2] + ")"
                    : "a" === c
                    ? T[3]
                    : "rgba(" + T.join(",") + ")"
                  : a),
          g
        );
      }
      function v(a) {
        if (S)
          Mi(S, function (h) {
            h.brighten(a);
          });
        else if (b(a) && 0 !== a) {
          var i;
          for (i = 0; 3 > i; i++)
            (T[i] += c(255 * a)),
              T[i] < 0 && (T[i] = 0),
              T[i] > 255 && (T[i] = 255);
        }
        return this;
      }
      function k(a) {
        return (T[3] = a), this;
      }
      var w,
        S,
        T = [];
      return g(a), { get: y, brighten: v, rgba: T, setOpacity: k };
    };
  (Z.prototype = {
    opacity: 1,
    textProps: [
      "fontSize",
      "fontWeight",
      "fontFamily",
      "color",
      "lineHeight",
      "width",
      "textDecoration",
      "textShadow",
      "HcTextStroke",
    ],
    init: function (a, h) {
      var c = this;
      (c.element = "span" === h ? M(h) : Me.createElementNS(Ke, h)),
        (c.renderer = a);
    },
    animate: function (a, c, g) {
      var y = C(c, he, !0);
      return (
        Ei(this),
        y
          ? ((y = h(y, {})), g && (y.complete = g), Xi(this, a, y))
          : (this.attr(a), g && g()),
        this
      );
    },
    colorGradient: function (a, c, g) {
      var y,
        b,
        k,
        w,
        S,
        P,
        A,
        C,
        L,
        n,
        M,
        D = this.renderer,
        I = [];
      if (
        (a.linearGradient
          ? (b = "linearGradient")
          : a.radialGradient && (b = "radialGradient"),
        b)
      ) {
        (k = a[b]),
          (w = D.gradients),
          (P = a.stops),
          (L = g.radialReference),
          v(k) &&
            (a[b] = k =
              {
                x1: k[0],
                y1: k[1],
                x2: k[2],
                y2: k[3],
                gradientUnits: "userSpaceOnUse",
              }),
          "radialGradient" === b &&
            L &&
            !T(k.gradientUnits) &&
            (k = h(k, {
              cx: L[0] - L[2] / 2 + k.cx * L[2],
              cy: L[1] - L[2] / 2 + k.cy * L[2],
              r: k.r * L[2],
              gradientUnits: "userSpaceOnUse",
            }));
        for (n in k) "id" !== n && I.push(n, k[n]);
        for (n in P) I.push(P[n]);
        (I = I.join(",")),
          w[I]
            ? (M = w[I].attr("id"))
            : ((k.id = M = ci + ti++),
              (w[I] = S = D.createElement(b).attr(k).add(D.defs)),
              (S.stops = []),
              Mi(P, function (a) {
                var h;
                0 === a[1].indexOf("rgba")
                  ? ((y = Vi(a[1])), (A = y.get("rgb")), (C = y.get("a")))
                  : ((A = a[1]), (C = 1)),
                  (h = D.createElement("stop")
                    .attr({ offset: a[0], "stop-color": A, "stop-opacity": C })
                    .add(S)),
                  S.stops.push(h);
              })),
          g.setAttribute(c, "url(" + D.url + "#" + M + ")");
      }
    },
    attr: function (a, h) {
      var c,
        g,
        y,
        v,
        b = this.element,
        k = this;
      if (
        ("string" == typeof a && h !== te && ((c = a), (a = {}), (a[c] = h)),
        "string" == typeof a)
      )
        k = (this[a + "Getter"] || this._defaultGetter).call(this, a, b);
      else {
        for (c in a)
          (g = a[c]),
            (v = !1),
            this.symbolName &&
              /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(
                c
              ) &&
              (y || (this.symbolAttr(a), (y = !0)), (v = !0)),
            !this.rotation ||
              ("x" !== c && "y" !== c) ||
              (this.doTransform = !0),
            v ||
              (this[c + "Setter"] || this._defaultSetter).call(this, g, c, b),
            this.shadows &&
              /^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(c) &&
              this.updateShadows(c, g);
        this.doTransform && (this.updateTransform(), (this.doTransform = !1));
      }
      return k;
    },
    updateShadows: function (a, h) {
      for (var c = this.shadows, i = c.length; i--; )
        c[i].setAttribute(
          a,
          "height" === a
            ? Re(h - (c[i].cutHeight || 0), 0)
            : "d" === a
            ? this.d
            : h
        );
    },
    addClass: function (a) {
      var h = this.element,
        c = P(h, "class") || "";
      return -1 === c.indexOf(a) && P(h, "class", c + " " + a), this;
    },
    symbolAttr: function (a) {
      var h = this;
      Mi(
        [
          "x",
          "y",
          "r",
          "start",
          "end",
          "width",
          "height",
          "innerR",
          "anchorX",
          "anchorY",
        ],
        function (c) {
          h[c] = C(a[c], h[c]);
        }
      ),
        h.attr({
          d: h.renderer.symbols[h.symbolName](h.x, h.y, h.width, h.height, h),
        });
    },
    clip: function (a) {
      return this.attr(
        "clip-path",
        a ? "url(" + this.renderer.url + "#" + a.id + ")" : gi
      );
    },
    crisp: function (a) {
      var h,
        c,
        g = this,
        y = {},
        v = a.strokeWidth || g.strokeWidth || 0;
      (c = (Be(v) % 2) / 2),
        (a.x = Oe(a.x || g.x || 0) + c),
        (a.y = Oe(a.y || g.y || 0) + c),
        (a.width = Oe((a.width || g.width || 0) - 2 * c)),
        (a.height = Oe((a.height || g.height || 0) - 2 * c)),
        (a.strokeWidth = v);
      for (h in a) g[h] !== a[h] && (g[h] = y[h] = a[h]);
      return y;
    },
    css: function (h) {
      var g,
        n,
        y,
        v = this,
        b = v.styles,
        k = {},
        w = v.element,
        S = "",
        T = !b;
      if ((h && h.color && (h.fill = h.color), b))
        for (n in h) h[n] !== b[n] && ((k[n] = h[n]), (T = !0));
      if (T) {
        if (
          ((g = v.textWidth =
            h && h.width && "text" === w.nodeName.toLowerCase() && c(h.width)),
          b && (h = a(b, k)),
          (v.styles = h),
          g && (Je || (!$e && v.renderer.forExport)) && delete h.width,
          je && !$e)
        )
          L(v.element, h);
        else {
          y = function (a, h) {
            return "-" + h.toLowerCase();
          };
          for (n in h) S += n.replace(/([A-Z])/g, y) + ":" + h[n] + ";";
          P(w, "style", S);
        }
        g && v.added && v.renderer.buildText(v);
      }
      return v;
    },
    on: function (a, h) {
      var c = this,
        g = c.element;
      return (
        ie && "click" === a
          ? ((g.ontouchstart = function (e) {
              (c.touchEventFired = Date.now()),
                e.preventDefault(),
                h.call(g, e);
            }),
            (g.onclick = function (e) {
              (-1 === Ne.indexOf("Android") ||
                Date.now() - (c.touchEventFired || 0) > 1100) &&
                h.call(g, e);
            }))
          : (g["on" + a] = h),
        this
      );
    },
    setRadialReference: function (a) {
      return (this.element.radialReference = a), this;
    },
    translate: function (x, a) {
      return this.attr({ translateX: x, translateY: a });
    },
    invert: function () {
      var a = this;
      return (a.inverted = !0), a.updateTransform(), a;
    },
    updateTransform: function () {
      var a,
        h = this,
        c = h.translateX || 0,
        g = h.translateY || 0,
        y = h.scaleX,
        v = h.scaleY,
        b = h.inverted,
        k = h.rotation,
        w = h.element;
      b && ((c += h.attr("width")), (g += h.attr("height"))),
        (a = ["translate(" + c + "," + g + ")"]),
        b
          ? a.push("rotate(90) scale(-1,1)")
          : k &&
            a.push(
              "rotate(" +
                k +
                " " +
                (w.getAttribute("x") || 0) +
                " " +
                (w.getAttribute("y") || 0) +
                ")"
            ),
        (T(y) || T(v)) && a.push("scale(" + C(y, 1) + " " + C(v, 1) + ")"),
        a.length && w.setAttribute("transform", a.join(" "));
    },
    toFront: function () {
      var a = this.element;
      return a.parentNode.appendChild(a), this;
    },
    align: function (a, h, c) {
      var y,
        v,
        x,
        b,
        k,
        w = {},
        T = this.renderer,
        P = T.alignedObjects;
      return (
        a
          ? ((this.alignOptions = a),
            (this.alignByTranslate = h),
            (!c || g(c)) &&
              ((this.alignTo = k = c || "renderer"),
              S(P, this),
              P.push(this),
              (c = null)))
          : ((a = this.alignOptions),
            (h = this.alignByTranslate),
            (k = this.alignTo)),
        (c = C(c, T[k], T)),
        (y = a.align),
        (v = a.verticalAlign),
        (x = (c.x || 0) + (a.x || 0)),
        (b = (c.y || 0) + (a.y || 0)),
        ("right" === y || "center" === y) &&
          (x += (c.width - (a.width || 0)) / { right: 1, center: 2 }[y]),
        (w[h ? "translateX" : "x"] = Be(x)),
        ("bottom" === v || "middle" === v) &&
          (b +=
            (c.height - (a.height || 0)) / ({ bottom: 1, middle: 2 }[v] || 1)),
        (w[h ? "translateY" : "y"] = Be(b)),
        this[this.placed ? "animate" : "attr"](w),
        (this.placed = !0),
        (this.alignAttr = w),
        this
      );
    },
    getBBox: function () {
      var h,
        c,
        g,
        y = this,
        v = y.bBox,
        b = y.renderer,
        k = y.rotation,
        w = y.element,
        S = y.styles,
        T = k * Ye,
        P = y.textStr;
      if (
        (("" === P || vi.test(P)) &&
          (g =
            "num." +
            P.toString().length +
            (S ? "|" + S.fontSize + "|" + S.fontFamily : "")),
        g && (v = b.cache[g]),
        !v)
      ) {
        if (w.namespaceURI === Ke || b.forExport) {
          try {
            v = w.getBBox
              ? a({}, w.getBBox())
              : { width: w.offsetWidth, height: w.offsetHeight };
          } catch (e) {}
          (!v || v.width < 0) && (v = { width: 0, height: 0 });
        } else v = y.htmlGetBBox();
        b.isSVG &&
          ((h = v.width),
          (c = v.height),
          je &&
            S &&
            "11px" === S.fontSize &&
            "16.9" === c.toPrecision(3) &&
            (v.height = c = 14),
          k &&
            ((v.width = Xe(c * Ge(T)) + Xe(h * Ee(T))),
            (v.height = Xe(c * Ee(T)) + Xe(h * Ge(T))))),
          (y.bBox = v),
          g && (b.cache[g] = v);
      }
      return v;
    },
    show: function (a) {
      return a && this.element.namespaceURI === Ke
        ? (this.element.removeAttribute("visibility"), this)
        : this.attr({ visibility: a ? "inherit" : di });
    },
    hide: function () {
      return this.attr({ visibility: hi });
    },
    fadeOut: function (a) {
      var h = this;
      h.animate(
        { opacity: 0 },
        {
          duration: a || 150,
          complete: function () {
            h.hide();
          },
        }
      );
    },
    add: function (a) {
      var h,
        g,
        y,
        i,
        v,
        b = this.renderer,
        k = a || b,
        w = k.element || b.box,
        S = this.element,
        A = this.zIndex;
      if (
        (a && (this.parentGroup = a),
        (this.parentInverted = a && a.inverted),
        void 0 !== this.textStr && b.buildText(this),
        A && ((k.handleZ = !0), (A = c(A))),
        k.handleZ)
      )
        for (h = w.childNodes, i = 0; i < h.length; i++)
          if (
            ((g = h[i]),
            (y = P(g, "zIndex")),
            g !== S && (c(y) > A || (!T(A) && T(y))))
          ) {
            w.insertBefore(S, g), (v = !0);
            break;
          }
      return (
        v || w.appendChild(S),
        (this.added = !0),
        this.onAdd && this.onAdd(),
        this
      );
    },
    safeRemoveChild: function (a) {
      var h = a.parentNode;
      h && h.removeChild(a);
    },
    destroy: function () {
      var a,
        h,
        i,
        c = this,
        g = c.element || {},
        y = c.shadows,
        v = c.renderer.isSVG && "SPAN" === g.nodeName && c.parentGroup;
      if (
        ((g.onclick =
          g.onmouseout =
          g.onmouseover =
          g.onmousemove =
          g.point =
            null),
        Ei(c),
        c.clipPath && (c.clipPath = c.clipPath.destroy()),
        c.stops)
      ) {
        for (i = 0; i < c.stops.length; i++) c.stops[i] = c.stops[i].destroy();
        c.stops = null;
      }
      for (
        c.safeRemoveChild(g),
          y &&
            Mi(y, function (a) {
              c.safeRemoveChild(a);
            });
        v && v.div && 0 === v.div.childNodes.length;

      )
        (a = v.parentGroup), c.safeRemoveChild(v.div), delete v.div, (v = a);
      c.alignTo && S(c.renderer.alignedObjects, c);
      for (h in c) delete c[h];
      return null;
    },
    shadow: function (a, h, c) {
      var i,
        g,
        y,
        v,
        b,
        k,
        w = [],
        S = this.element;
      if (a) {
        for (
          v = C(a.width, 3),
            b = (a.opacity || 0.15) / v,
            k = this.parentInverted
              ? "(-1,-1)"
              : "(" + C(a.offsetX, 1) + ", " + C(a.offsetY, 1) + ")",
            i = 1;
          v >= i;
          i++
        )
          (g = S.cloneNode(0)),
            (y = 2 * v + 1 - 2 * i),
            P(g, {
              isShadow: "true",
              stroke: a.color || "black",
              "stroke-opacity": b * i,
              "stroke-width": y,
              transform: "translate" + k,
              fill: gi,
            }),
            c && (P(g, "height", Re(P(g, "height") - y, 0)), (g.cutHeight = y)),
            h ? h.element.appendChild(g) : S.parentNode.insertBefore(g, S),
            w.push(g);
        this.shadows = w;
      }
      return this;
    },
    xGetter: function (a) {
      return (
        "circle" === this.element.nodeName &&
          (a = { x: "cx", y: "cy" }[a] || a),
        this._defaultGetter(a)
      );
    },
    _defaultGetter: function (a) {
      var h = C(this[a], this.element ? this.element.getAttribute(a) : null, 0);
      return /^[\-0-9\.]+$/.test(h) && (h = parseFloat(h)), h;
    },
    dSetter: function (a, h, c) {
      a && a.join && (a = a.join(" ")),
        /(NaN| {2}|^$)/.test(a) && (a = "M 0 0"),
        c.setAttribute(h, a),
        (this[h] = a);
    },
    dashstyleSetter: function (a) {
      var i;
      if ((a = a && a.toLowerCase())) {
        for (
          a = a
            .replace("shortdashdotdot", "3,1,1,1,1,1,")
            .replace("shortdashdot", "3,1,1,1")
            .replace("shortdot", "1,1,")
            .replace("shortdash", "3,1,")
            .replace("longdash", "8,3,")
            .replace(/dot/g, "1,3,")
            .replace("dash", "4,3,")
            .replace(/,$/, "")
            .replace("solid", 1)
            .split(","),
            i = a.length;
          i--;

        )
          a[i] = c(a[i]) * this["stroke-width"];
        (a = a.join(",")), this.element.setAttribute("stroke-dasharray", a);
      }
    },
    alignSetter: function (a) {
      this.element.setAttribute(
        "text-anchor",
        { left: "start", center: "middle", right: "end" }[a]
      );
    },
    opacitySetter: function (a, h, c) {
      (this[h] = a), c.setAttribute(h, a);
    },
    titleSetter: function (a) {
      var h = this.element.getElementsByTagName("title")[0];
      h || ((h = Me.createElementNS(Ke, "title")), this.element.appendChild(h)),
        (h.textContent = a);
    },
    textSetter: function (a) {
      a !== this.textStr &&
        (delete this.bBox,
        (this.textStr = a),
        this.added && this.renderer.buildText(this));
    },
    fillSetter: function (a, h, c) {
      "string" == typeof a
        ? c.setAttribute(h, a)
        : a && this.colorGradient(a, h, c);
    },
    zIndexSetter: function (a, h, c) {
      c.setAttribute(h, a), (this[h] = a);
    },
    _defaultSetter: function (a, h, c) {
      c.setAttribute(h, a);
    },
  }),
    (Z.prototype.yGetter = Z.prototype.xGetter),
    (Z.prototype.translateXSetter =
      Z.prototype.translateYSetter =
      Z.prototype.rotationSetter =
      Z.prototype.verticalAlignSetter =
      Z.prototype.scaleXSetter =
      Z.prototype.scaleYSetter =
        function (a, h) {
          (this[h] = a), (this.doTransform = !0);
        }),
    (Z.prototype["stroke-widthSetter"] = Z.prototype.strokeSetter =
      function (a, h, c) {
        (this[h] = a),
          this.stroke && this["stroke-width"]
            ? ((this.strokeWidth = this["stroke-width"]),
              Z.prototype.fillSetter.call(this, this.stroke, "stroke", c),
              c.setAttribute("stroke-width", this["stroke-width"]),
              (this.hasStroke = !0))
            : "stroke-width" === h &&
              0 === a &&
              this.hasStroke &&
              (c.removeAttribute("stroke"), (this.hasStroke = !1));
      });
  var _i = function () {
    this.init.apply(this, arguments);
  };
  (_i.prototype = {
    Element: Z,
    init: function (a, h, c, g, y) {
      var v,
        b,
        k,
        w = this,
        S = location;
      (v = w
        .createElement("svg")
        .attr({ version: "1.1" })
        .css(this.getStyle(g))),
        (b = v.element),
        a.appendChild(b),
        -1 === a.innerHTML.indexOf("xmlns") && P(b, "xmlns", Ke),
        (w.isSVG = !0),
        (w.box = b),
        (w.boxWrapper = v),
        (w.alignedObjects = []),
        (w.url =
          (Ue || _e) && Me.getElementsByTagName("base").length
            ? S.href
                .replace(/#.*?$/, "")
                .replace(/([\('\)])/g, "\\$1")
                .replace(/ /g, "%20")
            : ""),
        (k = this.createElement("desc").add()),
        k.element.appendChild(
          Me.createTextNode("Created with " + oi + " " + ri)
        ),
        (w.defs = this.createElement("defs").add()),
        (w.forExport = y),
        (w.gradients = {}),
        (w.cache = {}),
        w.setSize(h, c, !1);
      var T, A;
      Ue &&
        a.getBoundingClientRect &&
        ((w.subPixelFix = T =
          function () {
            L(a, { left: 0, top: 0 }),
              (A = a.getBoundingClientRect()),
              L(a, {
                left: ze(A.left) - A.left + pi,
                top: ze(A.top) - A.top + pi,
              });
          }),
        T(),
        Oi(De, "resize", T));
    },
    getStyle: function (h) {
      return (this.style = a(
        {
          fontFamily:
            '"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',
          fontSize: "12px",
        },
        h
      ));
    },
    isHidden: function () {
      return !this.boxWrapper.getBBox().width;
    },
    destroy: function () {
      var a = this,
        h = a.defs;
      return (
        (a.box = null),
        (a.boxWrapper = a.boxWrapper.destroy()),
        Y(a.gradients || {}),
        (a.gradients = null),
        h && (a.defs = h.destroy()),
        a.subPixelFix && zi(De, "resize", a.subPixelFix),
        (a.alignedObjects = null),
        null
      );
    },
    createElement: function (a) {
      var h = new this.Element();
      return h.init(this, a), h;
    },
    draw: function () {},
    buildText: function (a) {
      for (
        var h,
          g,
          y,
          v = a.element,
          b = this,
          k = b.forExport,
          w = C(a.textStr, "").toString(),
          S = -1 !== w.indexOf("<"),
          T = v.childNodes,
          A = P(v, "x"),
          M = a.styles,
          D = a.textWidth,
          I = M && M.lineHeight,
          B = M && M.HcTextStroke,
          i = T.length,
          O = function (a) {
            return I
              ? c(I)
              : b.fontMetrics(
                  /(px|em)$/.test(a && a.style.fontSize)
                    ? a.style.fontSize
                    : (M && M.fontSize) || b.style.fontSize || 12,
                  a
                ).h;
          };
        i--;

      )
        v.removeChild(T[i]);
      return S || B || -1 !== w.indexOf(" ")
        ? ((g = /<.*style="([^"]+)".*>/),
          (y = /<.*href="(http[^"]+)".*>/),
          D && !a.added && this.box.appendChild(v),
          (h = S
            ? w
                .replace(/<(b|strong)>/g, '<span style="font-weight:bold">')
                .replace(/<(i|em)>/g, '<span style="font-style:italic">')
                .replace(/<a/g, "<span")
                .replace(/<\/(b|strong|i|em|a)>/g, "</span>")
                .split(/<br.*?>/g)
            : [w]),
          "" === h[h.length - 1] && h.pop(),
          Mi(h, function (h, c) {
            var w,
              S = 0;
            (h = h
              .replace(/<span/g, "|||<span")
              .replace(/<\/span>/g, "</span>|||")),
              (w = h.split("|||")),
              Mi(w, function (h) {
                if ("" !== h || 1 === w.length) {
                  var T,
                    C = {},
                    I = Me.createElementNS(Ke, "tspan");
                  if (
                    (g.test(h) &&
                      ((T = h
                        .match(g)[1]
                        .replace(/(;| |^)color([ :])/, "$1fill$2")),
                      P(I, "style", T)),
                    y.test(h) &&
                      !k &&
                      (P(I, "onclick", 'location.href="' + h.match(y)[1] + '"'),
                      L(I, { cursor: "pointer" })),
                    (h = (h.replace(/<(.|\n)*?>/g, "") || " ")
                      .replace(/&lt;/g, "<")
                      .replace(/&gt;/g, ">")),
                    " " !== h)
                  ) {
                    if (
                      (I.appendChild(Me.createTextNode(h)),
                      S ? (C.dx = 0) : c && null !== A && (C.x = A),
                      P(I, C),
                      v.appendChild(I),
                      !S &&
                        c &&
                        (!$e && k && L(I, { display: "block" }),
                        P(I, "dy", O(I))),
                      D)
                    )
                      for (
                        var B,
                          z,
                          R,
                          H = h.replace(/([^\^])-/g, "$1- ").split(" "),
                          X =
                            w.length > 1 ||
                            (H.length > 1 && "nowrap" !== M.whiteSpace),
                          E = M.HcHeight,
                          G = [],
                          W = O(I),
                          Y = 1;
                        X && (H.length || G.length);

                      )
                        delete a.bBox,
                          (R = a.getBBox()),
                          (z = R.width),
                          !$e &&
                            b.forExport &&
                            (z = b.measureSpanWidth(
                              I.firstChild.data,
                              a.styles
                            )),
                          (B = z > D),
                          B && 1 !== H.length
                            ? (I.removeChild(I.firstChild), G.unshift(H.pop()))
                            : ((H = G),
                              (G = []),
                              H.length &&
                                (Y++,
                                E && Y * W > E
                                  ? ((H = ["..."]), a.attr("title", a.textStr))
                                  : ((I = Me.createElementNS(Ke, "tspan")),
                                    P(I, { dy: W, x: A }),
                                    T && P(I, "style", T),
                                    v.appendChild(I))),
                              z > D && (D = z)),
                          H.length &&
                            I.appendChild(
                              Me.createTextNode(H.join(" ").replace(/- /g, "-"))
                            );
                    S++;
                  }
                }
              });
          }),
          void 0)
        : void v.appendChild(Me.createTextNode(w));
    },
    button: function (c, x, g, y, v, b, k, w, S) {
      var T,
        P,
        A,
        C,
        L,
        M,
        D = this.label(c, x, g, S, null, null, null, null, "button"),
        I = 0,
        B = { x1: 0, y1: 0, x2: 0, y2: 1 };
      return (
        (v = h(
          {
            "stroke-width": 1,
            stroke: "#CCCCCC",
            fill: {
              linearGradient: B,
              stops: [
                [0, "#FEFEFE"],
                [1, "#F6F6F6"],
              ],
            },
            r: 2,
            padding: 5,
            style: { color: "black" },
          },
          v
        )),
        (A = v.style),
        delete v.style,
        (b = h(
          v,
          {
            stroke: "#68A",
            fill: {
              linearGradient: B,
              stops: [
                [0, "#FFF"],
                [1, "#ACF"],
              ],
            },
          },
          b
        )),
        (C = b.style),
        delete b.style,
        (k = h(
          v,
          {
            stroke: "#68A",
            fill: {
              linearGradient: B,
              stops: [
                [0, "#9BD"],
                [1, "#CDF"],
              ],
            },
          },
          k
        )),
        (L = k.style),
        delete k.style,
        (w = h(v, { style: { color: "#CCC" } }, w)),
        (M = w.style),
        delete w.style,
        Oi(D.element, je ? "mouseover" : "mouseenter", function () {
          3 !== I && D.attr(b).css(C);
        }),
        Oi(D.element, je ? "mouseout" : "mouseleave", function () {
          3 !== I && ((T = [v, b, k][I]), (P = [A, C, L][I]), D.attr(T).css(P));
        }),
        (D.setState = function (a) {
          (D.state = I = a),
            a
              ? 2 === a
                ? D.attr(k).css(L)
                : 3 === a && D.attr(w).css(M)
              : D.attr(v).css(A);
        }),
        D.on("click", function () {
          3 !== I && y.call(D);
        })
          .attr(v)
          .css(a({ cursor: "default" }, A))
      );
    },
    crispLine: function (a, h) {
      return (
        a[1] === a[4] && (a[1] = a[4] = Be(a[1]) - (h % 2) / 2),
        a[2] === a[5] && (a[2] = a[5] = Be(a[2]) + (h % 2) / 2),
        a
      );
    },
    path: function (h) {
      var c = { fill: gi };
      return (
        v(h) ? (c.d = h) : y(h) && a(c, h), this.createElement("path").attr(c)
      );
    },
    circle: function (x, a, r) {
      var h = y(x) ? x : { x: x, y: a, r: r },
        c = this.createElement("circle");
      return (
        (c.xSetter = function (a) {
          this.element.setAttribute("cx", a);
        }),
        (c.ySetter = function (a) {
          this.element.setAttribute("cy", a);
        }),
        c.attr(h)
      );
    },
    arc: function (x, a, r, h, c, g) {
      var v;
      return (
        y(x) &&
          ((a = x.y),
          (r = x.r),
          (h = x.innerR),
          (c = x.start),
          (g = x.end),
          (x = x.x)),
        (v = this.symbol("arc", x || 0, a || 0, r || 0, r || 0, {
          innerR: h || 0,
          start: c || 0,
          end: g || 0,
        })),
        (v.r = r),
        v
      );
    },
    rect: function (x, a, h, c, r, g) {
      r = y(x) ? x.r : r;
      var v = this.createElement("rect"),
        b = y(x)
          ? x
          : x === te
          ? {}
          : { x: x, y: a, width: Re(h, 0), height: Re(c, 0) };
      return (
        g !== te && ((b.strokeWidth = g), (b = v.crisp(b))),
        r && (b.r = r),
        (v.rSetter = function (a) {
          P(this.element, { rx: a, ry: a });
        }),
        v.attr(b)
      );
    },
    setSize: function (a, h, c) {
      var g = this,
        y = g.alignedObjects,
        i = y.length;
      for (
        g.width = a,
          g.height = h,
          g.boxWrapper[C(c, !0) ? "animate" : "attr"]({ width: a, height: h });
        i--;

      )
        y[i].align();
    },
    g: function (a) {
      var h = this.createElement("g");
      return T(a) ? h.attr({ class: ci + a }) : h;
    },
    image: function (h, x, c, g, y) {
      var v,
        b = { preserveAspectRatio: gi };
      return (
        arguments.length > 1 && a(b, { x: x, y: c, width: g, height: y }),
        (v = this.createElement("image").attr(b)),
        v.element.setAttributeNS
          ? v.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", h)
          : v.element.setAttribute("hc-svg-href", h),
        v
      );
    },
    symbol: function (h, x, c, g, y, v) {
      var b,
        k,
        w,
        S,
        T,
        P = this.symbols[h],
        A = P && P(Be(x), Be(c), g, y, v),
        C = /^url\((.*?)\)$/;
      return (
        A
          ? ((b = this.path(A)),
            a(b, { symbolName: h, x: x, y: c, width: g, height: y }),
            v && a(b, v))
          : C.test(h) &&
            ((T = function (a, h) {
              a.element &&
                (a.attr({ width: h[0], height: h[1] }),
                a.alignByTranslate ||
                  a.translate(Be((g - h[0]) / 2), Be((y - h[1]) / 2)));
            }),
            (w = h.match(C)[1]),
            (S = Qe[w]),
            (b = this.image(w).attr({ x: x, y: c })),
            (b.isImg = !0),
            S
              ? T(b, S)
              : (b.attr({ width: 0, height: 0 }),
                (k = M("img", {
                  onload: function () {
                    T(b, (Qe[w] = [this.width, this.height]));
                  },
                  src: w,
                })))),
        b
      );
    },
    symbols: {
      circle: function (x, a, h, c) {
        var g = 0.166 * h;
        return [
          mi,
          x + h / 2,
          a,
          "C",
          x + h + g,
          a,
          x + h + g,
          a + c,
          x + h / 2,
          a + c,
          "C",
          x - g,
          a + c,
          x - g,
          a,
          x + h / 2,
          a,
          "Z",
        ];
      },
      square: function (x, a, h, c) {
        return [mi, x, a, yi, x + h, a, x + h, a + c, x, a + c, "Z"];
      },
      triangle: function (x, a, h, c) {
        return [mi, x + h / 2, a, yi, x + h, a + c, x, a + c, "Z"];
      },
      "triangle-down": function (x, a, h, c) {
        return [mi, x, a, yi, x + h, a, x + h / 2, a + c, "Z"];
      },
      diamond: function (x, a, h, c) {
        return [
          mi,
          x + h / 2,
          a,
          yi,
          x + h,
          a + c / 2,
          x + h / 2,
          a + c,
          x,
          a + c / 2,
          "Z",
        ];
      },
      arc: function (x, a, h, c, g) {
        var y = g.start,
          v = g.r || h || c,
          b = g.end - 0.001,
          k = g.innerR,
          w = g.open,
          S = Ee(y),
          T = Ge(y),
          P = Ee(b),
          A = Ge(b),
          C = g.end - y < We ? 0 : 1;
        return [
          mi,
          x + v * S,
          a + v * T,
          "A",
          v,
          v,
          0,
          C,
          1,
          x + v * P,
          a + v * A,
          w ? mi : yi,
          x + k * P,
          a + k * A,
          "A",
          k,
          k,
          0,
          C,
          0,
          x + k * S,
          a + k * T,
          w ? "" : "Z",
        ];
      },
      callout: function (x, a, h, c, g) {
        var y,
          v = 6,
          b = 6,
          r = He((g && g.r) || 0, h, c),
          k = r + b,
          w = g && g.anchorX,
          S = g && g.anchorY,
          T = (Be(g.strokeWidth || 0) % 2) / 2;
        return (
          (x += T),
          (a += T),
          (y = [
            "M",
            x + r,
            a,
            "L",
            x + h - r,
            a,
            "C",
            x + h,
            a,
            x + h,
            a,
            x + h,
            a + r,
            "L",
            x + h,
            a + c - r,
            "C",
            x + h,
            a + c,
            x + h,
            a + c,
            x + h - r,
            a + c,
            "L",
            x + r,
            a + c,
            "C",
            x,
            a + c,
            x,
            a + c,
            x,
            a + c - r,
            "L",
            x,
            a + r,
            "C",
            x,
            a,
            x,
            a,
            x + r,
            a,
          ]),
          w && w > h && S > a + k && a + c - k > S
            ? y.splice(
                13,
                3,
                "L",
                x + h,
                S - b,
                x + h + v,
                S,
                x + h,
                S + b,
                x + h,
                a + c - r
              )
            : w && 0 > w && S > a + k && a + c - k > S
            ? y.splice(33, 3, "L", x, S + b, x - v, S, x, S - b, x, a + r)
            : S && S > c && w > x + k && x + h - k > w
            ? y.splice(
                23,
                3,
                "L",
                w + b,
                a + c,
                w,
                a + c + v,
                w - b,
                a + c,
                x + r,
                a + c
              )
            : S &&
              0 > S &&
              w > x + k &&
              x + h - k > w &&
              y.splice(3, 3, "L", w - b, a, w, a - v, w + b, a, h - r, a),
          y
        );
      },
    },
    clipRect: function (x, a, h, c) {
      var g,
        y = ci + ti++,
        v = this.createElement("clipPath").attr({ id: y }).add(this.defs);
      return (
        (g = this.rect(x, a, h, c, 0).add(v)), (g.id = y), (g.clipPath = v), g
      );
    },
    text: function (a, x, h, c) {
      var g,
        y = this,
        v = Je || (!$e && y.forExport),
        b = {};
      return c && !y.forExport
        ? y.html(a, x, h)
        : ((b.x = Math.round(x || 0)),
          h && (b.y = Math.round(h)),
          (a || 0 === a) && (b.text = a),
          (g = y.createElement("text").attr(b)),
          v && g.css({ position: ai }),
          c ||
            (g.xSetter = function (a, h, c) {
              var g,
                i,
                y = c.getElementsByTagName("tspan"),
                v = c.getAttribute(h);
              for (i = 0; i < y.length; i++)
                (g = y[i]), g.getAttribute(h) === v && g.setAttribute(h, a);
              c.setAttribute(h, a);
            }),
          g);
    },
    fontMetrics: function (a, h) {
      (a = a || this.style.fontSize),
        h &&
          De.getComputedStyle &&
          ((h = h.element || h), (a = De.getComputedStyle(h, "").fontSize)),
        (a = /px/.test(a) ? c(a) : /em/.test(a) ? 12 * parseFloat(a) : 12);
      var g = 24 > a ? a + 4 : Be(1.2 * a),
        y = Be(0.8 * g);
      return { h: g, b: y, f: a };
    },
    label: function (c, x, g, y, v, b, k, w, S) {
      function P() {
        var h,
          c,
          g = E.element.style;
        (M =
          (void 0 === D || void 0 === I || X.styles.textAlign) &&
          E.textStr &&
          E.getBBox()),
          (X.width = (D || M.width || 0) + 2 * W + Y),
          (X.height = (I || M.height || 0) + 2 * W),
          (z = W + H.fontMetrics(g && g.fontSize, E).b),
          R &&
            (L ||
              ((h = Be(-G * W)),
              (c = w ? -z : 0),
              (X.box = L =
                y
                  ? H.symbol(y, h, c, X.width, X.height, F)
                  : H.rect(h, c, X.width, X.height, 0, F[wi])),
              L.attr("fill", gi).add(X)),
            L.isImg ||
              L.attr(a({ width: Be(X.width), height: Be(X.height) }, F)),
            (F = null));
      }
      function A() {
        var a,
          h = X.styles,
          c = h && h.textAlign,
          x = Y + W * (1 - G);
        (a = w ? 0 : z),
          T(D) &&
            M &&
            ("center" === c || "right" === c) &&
            (x += { center: 0.5, right: 1 }[c] * (D - M.width)),
          (x !== E.x || a !== E.y) &&
            (E.attr("x", x), a !== te && E.attr("y", a)),
          (E.x = x),
          (E.y = a);
      }
      function C(a, h) {
        L ? L.attr(a, h) : (F[a] = h);
      }
      var L,
        M,
        D,
        I,
        B,
        O,
        z,
        R,
        H = this,
        X = H.g(S),
        E = H.text("", 0, 0, k).attr({ zIndex: 1 }),
        G = 0,
        W = 3,
        Y = 0,
        N = 0,
        F = {};
      (X.onAdd = function () {
        E.add(X),
          X.attr({ text: c || "", x: x, y: g }),
          L && T(v) && X.attr({ anchorX: v, anchorY: b });
      }),
        (X.widthSetter = function (a) {
          D = a;
        }),
        (X.heightSetter = function (a) {
          I = a;
        }),
        (X.paddingSetter = function (a) {
          T(a) && a !== W && ((W = a), A());
        }),
        (X.paddingLeftSetter = function (a) {
          T(a) && a !== Y && ((Y = a), A());
        }),
        (X.alignSetter = function (a) {
          G = { left: 0, center: 0.5, right: 1 }[a];
        }),
        (X.textSetter = function (a) {
          a !== te && E.textSetter(a), P(), A();
        }),
        (X["stroke-widthSetter"] = function (a, h) {
          a && (R = !0), (N = (a % 2) / 2), C(h, a);
        }),
        (X.strokeSetter =
          X.fillSetter =
          X.rSetter =
            function (a, h) {
              "fill" === h && a && (R = !0), C(h, a);
            }),
        (X.anchorXSetter = function (a, h) {
          (v = a), C(h, a + N - B);
        }),
        (X.anchorYSetter = function (a, h) {
          (b = a), C(h, a - O);
        }),
        (X.xSetter = function (a) {
          (X.x = a),
            G && (a -= G * ((D || M.width) + W)),
            (B = Be(a)),
            X.attr("translateX", B);
        }),
        (X.ySetter = function (a) {
          (O = X.y = Be(a)), X.attr("translateY", O);
        });
      var j = X.css;
      return a(X, {
        css: function (a) {
          if (a) {
            var c = {};
            (a = h(a)),
              Mi(X.textProps, function (h) {
                a[h] !== te && ((c[h] = a[h]), delete a[h]);
              }),
              E.css(c);
          }
          return j.call(X, a);
        },
        getBBox: function () {
          return {
            width: M.width + 2 * W,
            height: M.height + 2 * W,
            x: M.x - W,
            y: M.y - W,
          };
        },
        shadow: function (a) {
          return L && L.shadow(a), X;
        },
        destroy: function () {
          zi(X.element, "mouseenter"),
            zi(X.element, "mouseleave"),
            E && (E = E.destroy()),
            L && (L = L.destroy()),
            Z.prototype.destroy.call(X),
            (X = H = P = A = C = null);
        },
      });
    },
  }),
    (ee = _i),
    a(Z.prototype, {
      htmlCss: function (h) {
        var c = this,
          g = c.element,
          y = h && "SPAN" === g.tagName && h.width;
        return (
          y && (delete h.width, (c.textWidth = y), c.updateTransform()),
          (c.styles = a(c.styles, h)),
          L(c.element, h),
          c
        );
      },
      htmlGetBBox: function () {
        var a = this,
          h = a.element,
          c = a.bBox;
        return (
          c ||
            ("text" === h.nodeName && (h.style.position = ai),
            (c = a.bBox =
              {
                x: h.offsetLeft,
                y: h.offsetTop,
                width: h.offsetWidth,
                height: h.offsetHeight,
              })),
          c
        );
      },
      htmlUpdateTransform: function () {
        if (!this.added) return void (this.alignOnAdd = !0);
        var a = this,
          h = a.renderer,
          g = a.element,
          y = a.translateX || 0,
          v = a.translateY || 0,
          x = a.x || 0,
          b = a.y || 0,
          k = a.textAlign || "left",
          w = { left: 0, center: 0.5, right: 1 }[k],
          S = a.shadows;
        if (
          (L(g, { marginLeft: y, marginTop: v }),
          S &&
            Mi(S, function (a) {
              L(a, { marginLeft: y + 1, marginTop: v + 1 });
            }),
          a.inverted &&
            Mi(g.childNodes, function (a) {
              h.invertChild(a, g);
            }),
          "SPAN" === g.tagName)
        ) {
          var P,
            A,
            M = a.rotation,
            D = c(a.textWidth),
            I = [M, k, g.innerHTML, a.textWidth].join(",");
          I !== a.cTT &&
            ((A = h.fontMetrics(g.style.fontSize).b),
            T(M) && a.setSpanRotation(M, w, A),
            (P = C(a.elemWidth, g.offsetWidth)),
            P > D &&
              /[ \-]/.test(g.textContent || g.innerText) &&
              (L(g, { width: D + pi, display: "block", whiteSpace: "normal" }),
              (P = D)),
            a.getSpanCorrection(P, A, w, M, k)),
            L(g, {
              left: x + (a.xCorr || 0) + pi,
              top: b + (a.yCorr || 0) + pi,
            }),
            _e && (A = g.offsetHeight),
            (a.cTT = I);
        }
      },
      setSpanRotation: function (a, h, c) {
        var g = {},
          y = je
            ? "-ms-transform"
            : _e
            ? "-webkit-transform"
            : Ue
            ? "MozTransform"
            : Fe
            ? "-o-transform"
            : "";
        (g[y] = g.transform = "rotate(" + a + "deg)"),
          (g[y + (Ue ? "Origin" : "-origin")] = g.transformOrigin =
            100 * h + "% " + c + "px"),
          L(this.element, g);
      },
      getSpanCorrection: function (a, h, c) {
        (this.xCorr = -a * c), (this.yCorr = -h);
      },
    }),
    a(_i.prototype, {
      html: function (h, x, c) {
        var g = this.createElement("span"),
          y = g.element,
          v = g.renderer;
        return (
          (g.textSetter = function (a) {
            a !== y.innerHTML && delete this.bBox,
              (y.innerHTML = this.textStr = a);
          }),
          (g.xSetter =
            g.ySetter =
            g.alignSetter =
            g.rotationSetter =
              function (a, h) {
                "align" === h && (h = "textAlign"),
                  (g[h] = a),
                  g.htmlUpdateTransform();
              }),
          g
            .attr({ text: h, x: Be(x), y: Be(c) })
            .css({
              position: ai,
              whiteSpace: "nowrap",
              fontFamily: this.style.fontFamily,
              fontSize: this.style.fontSize,
            }),
          (g.css = g.htmlCss),
          v.isSVG &&
            (g.add = function (h) {
              var c,
                b,
                k = v.box.parentNode,
                w = [];
              if (((this.parentGroup = h), h)) {
                if (((c = h.div), !c)) {
                  for (b = h; b; ) w.push(b), (b = b.parentGroup);
                  Mi(w.reverse(), function (h) {
                    var g;
                    (c = h.div =
                      h.div ||
                      M(
                        si,
                        { className: P(h.element, "class") },
                        {
                          position: ai,
                          left: (h.translateX || 0) + pi,
                          top: (h.translateY || 0) + pi,
                        },
                        c || k
                      )),
                      (g = c.style),
                      a(h, {
                        translateXSetter: function (a, c) {
                          (g.left = a + pi), (h[c] = a), (h.doTransform = !0);
                        },
                        translateYSetter: function (a, c) {
                          (g.top = a + pi), (h[c] = a), (h.doTransform = !0);
                        },
                        visibilitySetter: function (a, h) {
                          g[h] = a;
                        },
                      });
                  });
                }
              } else c = k;
              return (
                c.appendChild(y),
                (g.added = !0),
                g.alignOnAdd && g.htmlUpdateTransform(),
                g
              );
            }),
          g
        );
      },
    });
  var Ui, Zi;
  if (!$e && !Je) {
    (Zi = {
      init: function (a, h) {
        var c = this,
          g = ["<", h, ' filled="f" stroked="f"'],
          y = ["position: ", ai, ";"],
          v = h === si;
        ("shape" === h || v) && y.push("left:0;top:0;width:1px;height:1px;"),
          y.push("visibility: ", v ? hi : di),
          g.push(' style="', y.join(""), '"/>'),
          h &&
            ((g = v || "span" === h || "img" === h ? g.join("") : a.prepVML(g)),
            (c.element = M(g))),
          (c.renderer = a);
      },
      add: function (a) {
        var h = this,
          c = h.renderer,
          g = h.element,
          y = c.box,
          v = a && a.inverted,
          b = a ? a.element || a : y;
        return (
          v && c.invertChild(g, b),
          b.appendChild(g),
          (h.added = !0),
          h.alignOnAdd && !h.deferUpdateTransform && h.updateTransform(),
          h.onAdd && h.onAdd(),
          h
        );
      },
      updateTransform: Z.prototype.htmlUpdateTransform,
      setSpanRotation: function () {
        var a = this.rotation,
          h = Ee(a * Ye),
          c = Ge(a * Ye);
        L(this.element, {
          filter: a
            ? [
                "progid:DXImageTransform.Microsoft.Matrix(M11=",
                h,
                ", M12=",
                -c,
                ", M21=",
                c,
                ", M22=",
                h,
                ", sizingMethod='auto expand')",
              ].join("")
            : gi,
        });
      },
      getSpanCorrection: function (a, h, c, g, y) {
        var v,
          b = g ? Ee(g * Ye) : 1,
          k = g ? Ge(g * Ye) : 0,
          w = C(this.elemHeight, this.element.offsetHeight),
          S = y && "left" !== y;
        (this.xCorr = 0 > b && -a),
          (this.yCorr = 0 > k && -w),
          (v = 0 > b * k),
          (this.xCorr += k * h * (v ? 1 - c : c)),
          (this.yCorr -= b * h * (g ? (v ? c : 1 - c) : 1)),
          S &&
            ((this.xCorr -= a * c * (0 > b ? -1 : 1)),
            g && (this.yCorr -= w * c * (0 > k ? -1 : 1)),
            L(this.element, { textAlign: y }));
      },
      pathToVML: function (a) {
        for (var i = a.length, h = []; i--; )
          b(a[i])
            ? (h[i] = Be(10 * a[i]) - 5)
            : "Z" === a[i]
            ? (h[i] = "x")
            : ((h[i] = a[i]),
              !a.isArc ||
                ("wa" !== a[i] && "at" !== a[i]) ||
                (h[i + 5] === h[i + 7] &&
                  (h[i + 7] += a[i + 7] > a[i + 5] ? 1 : -1),
                h[i + 6] === h[i + 8] &&
                  (h[i + 8] += a[i + 8] > a[i + 6] ? 1 : -1)));
        return h.join(" ") || "x";
      },
      clip: function (a) {
        var h,
          c,
          g = this;
        return (
          a
            ? ((h = a.members),
              S(h, g),
              h.push(g),
              (g.destroyClip = function () {
                S(h, g);
              }),
              (c = a.getCSS(g)))
            : (g.destroyClip && g.destroyClip(),
              (c = { clip: Ve ? "inherit" : "rect(auto)" })),
          g.css(c)
        );
      },
      css: Z.prototype.htmlCss,
      safeRemoveChild: function (a) {
        a.parentNode && N(a);
      },
      destroy: function () {
        return (
          this.destroyClip && this.destroyClip(),
          Z.prototype.destroy.apply(this)
        );
      },
      on: function (a, h) {
        return (
          (this.element["on" + a] = function () {
            var a = De.event;
            (a.target = a.srcElement), h(a);
          }),
          this
        );
      },
      cutOffPath: function (a, h) {
        var g;
        return (
          (a = a.split(/[ ,]/)),
          (g = a.length),
          (9 === g || 11 === g) && (a[g - 4] = a[g - 2] = c(a[g - 2]) - 10 * h),
          a.join(" ")
        );
      },
      shadow: function (a, h, g) {
        var i,
          y,
          v,
          b,
          k,
          w,
          S,
          T = [],
          P = this.element,
          A = this.renderer,
          L = P.style,
          D = P.path;
        if ((D && "string" != typeof D.value && (D = "x"), (k = D), a)) {
          for (
            w = C(a.width, 3), S = (a.opacity || 0.15) / w, i = 1;
            3 >= i;
            i++
          )
            (b = 2 * w + 1 - 2 * i),
              g && (k = this.cutOffPath(D.value, b + 0.5)),
              (v = [
                '<shape isShadow="true" strokeweight="',
                b,
                '" filled="false" path="',
                k,
                '" coordsize="10 10" style="',
                P.style.cssText,
                '" />',
              ]),
              (y = M(A.prepVML(v), null, {
                left: c(L.left) + C(a.offsetX, 1),
                top: c(L.top) + C(a.offsetY, 1),
              })),
              g && (y.cutOff = b + 1),
              (v = [
                '<stroke color="',
                a.color || "black",
                '" opacity="',
                S * i,
                '"/>',
              ]),
              M(A.prepVML(v), null, null, y),
              h ? h.element.appendChild(y) : P.parentNode.insertBefore(y, P),
              T.push(y);
          this.shadows = T;
        }
        return this;
      },
      updateShadows: ei,
      setAttr: function (a, h) {
        Ve ? (this.element[a] = h) : this.element.setAttribute(a, h);
      },
      classSetter: function (a) {
        this.element.className = a;
      },
      dashstyleSetter: function (a, h, c) {
        var g =
          c.getElementsByTagName("stroke")[0] ||
          M(this.renderer.prepVML(["<stroke/>"]), null, null, c);
        (g[h] = a || "solid"), (this[h] = a);
      },
      dSetter: function (a, h, c) {
        var i,
          g = this.shadows;
        if (
          ((a = a || []),
          (this.d = a.join && a.join(" ")),
          (c.path = a = this.pathToVML(a)),
          g)
        )
          for (i = g.length; i--; )
            g[i].path = g[i].cutOff ? this.cutOffPath(a, g[i].cutOff) : a;
        this.setAttr(h, a);
      },
      fillSetter: function (a, h, c) {
        var g = c.nodeName;
        "SPAN" === g
          ? (c.style.color = a)
          : "IMG" !== g &&
            ((c.filled = a !== gi),
            this.setAttr("fillcolor", this.renderer.color(a, c, h, this)));
      },
      opacitySetter: ei,
      rotationSetter: function (a, h, c) {
        var g = c.style;
        (this[h] = g[h] = a),
          (g.left = -Be(Ge(a * Ye) + 1) + pi),
          (g.top = Be(Ee(a * Ye)) + pi);
      },
      strokeSetter: function (a, h, c) {
        this.setAttr("strokecolor", this.renderer.color(a, c, h));
      },
      "stroke-widthSetter": function (a, h, c) {
        (c.stroked = !!a),
          (this[h] = a),
          b(a) && (a += pi),
          this.setAttr("strokeweight", a);
      },
      titleSetter: function (a, h) {
        this.setAttr(h, a);
      },
      visibilitySetter: function (a, h, c) {
        "inherit" === a && (a = di),
          this.shadows &&
            Mi(this.shadows, function (c) {
              c.style[h] = a;
            }),
          "DIV" === c.nodeName &&
            ((a = a === hi ? "-999em" : 0),
            Ve || (c.style[h] = a ? di : hi),
            (h = "top")),
          (c.style[h] = a);
      },
      xSetter: function (a, h, c) {
        (this[h] = a),
          "x" === h ? (h = "left") : "y" === h && (h = "top"),
          this.updateClipping
            ? ((this[h] = a), this.updateClipping())
            : (c.style[h] = a);
      },
      zIndexSetter: function (a, h, c) {
        c.style[h] = a;
      },
    }),
      (Le.VMLElement = Zi = D(Z, Zi)),
      (Zi.prototype.ySetter =
        Zi.prototype.widthSetter =
        Zi.prototype.heightSetter =
          Zi.prototype.xSetter);
    var Ki = {
      Element: Zi,
      isIE8: Ne.indexOf("MSIE 8.0") > -1,
      init: function (h, c, g, y) {
        var v,
          b,
          k,
          w = this;
        if (
          ((w.alignedObjects = []),
          (v = w.createElement(si).css(a(this.getStyle(y), { position: li }))),
          (b = v.element),
          h.appendChild(v.element),
          (w.isVML = !0),
          (w.box = b),
          (w.boxWrapper = v),
          (w.cache = {}),
          w.setSize(c, g, !1),
          !Me.namespaces.hcv)
        ) {
          Me.namespaces.add("hcv", "urn:schemas-microsoft-com:vml"),
            (k =
              "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } ");
          try {
            Me.createStyleSheet().cssText = k;
          } catch (e) {
            Me.styleSheets[0].cssText += k;
          }
        }
      },
      isHidden: function () {
        return !this.box.offsetWidth;
      },
      clipRect: function (x, h, c, g) {
        var v = this.createElement(),
          b = y(x);
        return a(v, {
          members: [],
          left: (b ? x.x : x) + 1,
          top: (b ? x.y : h) + 1,
          width: (b ? x.width : c) - 1,
          height: (b ? x.height : g) - 1,
          getCSS: function (h) {
            var c = h.element,
              g = c.nodeName,
              y = "shape" === g,
              v = h.inverted,
              b = this,
              k = b.top - (y ? c.offsetTop : 0),
              w = b.left,
              S = w + b.width,
              T = k + b.height,
              P = {
                clip:
                  "rect(" +
                  Be(v ? w : k) +
                  "px," +
                  Be(v ? T : S) +
                  "px," +
                  Be(v ? S : T) +
                  "px," +
                  Be(v ? k : w) +
                  "px)",
              };
            return (
              !v &&
                Ve &&
                "DIV" === g &&
                a(P, { width: S + pi, height: T + pi }),
              P
            );
          },
          updateClipping: function () {
            Mi(v.members, function (a) {
              a.element && a.css(v.getCSS(a));
            });
          },
        });
      },
      color: function (a, h, c, g) {
        var y,
          v,
          b,
          k = this,
          w = /^rgba/,
          S = gi;
        if (
          (a && a.linearGradient
            ? (b = "gradient")
            : a && a.radialGradient && (b = "pattern"),
          b)
        ) {
          var T,
            P,
            A,
            C,
            L,
            D,
            I,
            B,
            O,
            z,
            R,
            H,
            X = a.linearGradient || a.radialGradient,
            E = "",
            G = a.stops,
            W = [],
            Y = function () {
              (v = [
                '<fill colors="' + W.join(",") + '" opacity="',
                B,
                '" o:opacity2="',
                I,
                '" type="',
                b,
                '" ',
                E,
                'focus="100%" method="any" />',
              ]),
                M(k.prepVML(v), null, null, h);
            };
          if (
            ((R = G[0]),
            (H = G[G.length - 1]),
            R[0] > 0 && G.unshift([0, R[1]]),
            H[0] < 1 && G.push([1, H[1]]),
            Mi(G, function (a, i) {
              w.test(a[1])
                ? ((y = Vi(a[1])), (T = y.get("rgb")), (P = y.get("a")))
                : ((T = a[1]), (P = 1)),
                W.push(100 * a[0] + "% " + T),
                i ? ((B = P), (O = T)) : ((I = P), (z = T));
            }),
            "fill" === c)
          )
            if ("gradient" === b)
              (A = X.x1 || X[0] || 0),
                (C = X.y1 || X[1] || 0),
                (L = X.x2 || X[2] || 0),
                (D = X.y2 || X[3] || 0),
                (E =
                  'angle="' +
                  (90 - (180 * Ie.atan((D - C) / (L - A))) / We) +
                  '"'),
                Y();
            else {
              var N,
                r = X.r,
                F = 2 * r,
                j = 2 * r,
                V = X.cx,
                _ = X.cy,
                U = h.radialReference,
                Z = function () {
                  U &&
                    ((N = g.getBBox()),
                    (V += (U[0] - N.x) / N.width - 0.5),
                    (_ += (U[1] - N.y) / N.height - 0.5),
                    (F *= U[2] / N.width),
                    (j *= U[2] / N.height)),
                    (E =
                      'src="' +
                      se.global.VMLRadialGradientURL +
                      '" size="' +
                      F +
                      "," +
                      j +
                      '" origin="0.5,0.5" position="' +
                      V +
                      "," +
                      _ +
                      '" color2="' +
                      z +
                      '" '),
                    Y();
                };
              g.added ? Z() : (g.onAdd = Z), (S = O);
            }
          else S = T;
        } else if (w.test(a) && "IMG" !== h.tagName)
          (y = Vi(a)),
            (v = ["<", c, ' opacity="', y.get("a"), '"/>']),
            M(this.prepVML(v), null, null, h),
            (S = y.get("rgb"));
        else {
          var K = h.getElementsByTagName(c);
          K.length && ((K[0].opacity = 1), (K[0].type = "solid")), (S = a);
        }
        return S;
      },
      prepVML: function (a) {
        var h = "display:inline-block;behavior:url(#default#VML);",
          c = this.isIE8;
        return (
          (a = a.join("")),
          c
            ? ((a = a.replace(
                "/>",
                ' xmlns="urn:schemas-microsoft-com:vml" />'
              )),
              (a =
                -1 === a.indexOf('style="')
                  ? a.replace("/>", ' style="' + h + '" />')
                  : a.replace('style="', 'style="' + h)))
            : (a = a.replace("<", "<hcv:")),
          a
        );
      },
      text: _i.prototype.html,
      path: function (h) {
        var c = { coordsize: "10 10" };
        return (
          v(h) ? (c.d = h) : y(h) && a(c, h),
          this.createElement("shape").attr(c)
        );
      },
      circle: function (x, a, r) {
        var h = this.symbol("circle");
        return (
          y(x) && ((r = x.r), (a = x.y), (x = x.x)),
          (h.isCircle = !0),
          (h.r = r),
          h.attr({ x: x, y: a })
        );
      },
      g: function (a) {
        var h, c;
        return (
          a && (c = { className: ci + a, class: ci + a }),
          (h = this.createElement(si).attr(c))
        );
      },
      image: function (a, x, h, c, g) {
        var y = this.createElement("img").attr({ src: a });
        return (
          arguments.length > 1 && y.attr({ x: x, y: h, width: c, height: g }), y
        );
      },
      createElement: function (a) {
        return "rect" === a
          ? this.symbol(a)
          : _i.prototype.createElement.call(this, a);
      },
      invertChild: function (a, h) {
        var g = this,
          y = h.style,
          v = "IMG" === a.tagName && a.style;
        L(a, {
          flip: "x",
          left: c(y.width) - (v ? c(v.top) : 1),
          top: c(y.height) - (v ? c(v.left) : 1),
          rotation: -90,
        }),
          Mi(a.childNodes, function (h) {
            g.invertChild(h, a);
          });
      },
      symbols: {
        arc: function (x, a, h, c, g) {
          var y,
            v = g.start,
            b = g.end,
            k = g.r || h || c,
            w = g.innerR,
            S = Ee(v),
            T = Ge(v),
            P = Ee(b),
            A = Ge(b);
          return b - v === 0
            ? ["x"]
            : ((y = [
                "wa",
                x - k,
                a - k,
                x + k,
                a + k,
                x + k * S,
                a + k * T,
                x + k * P,
                a + k * A,
              ]),
              g.open && !w && y.push("e", mi, x, a),
              y.push(
                "at",
                x - w,
                a - w,
                x + w,
                a + w,
                x + w * P,
                a + w * A,
                x + w * S,
                a + w * T,
                "x",
                "e"
              ),
              (y.isArc = !0),
              y);
        },
        circle: function (x, a, h, c, g) {
          return (
            g && (h = c = 2 * g.r),
            g && g.isCircle && ((x -= h / 2), (a -= c / 2)),
            ["wa", x, a, x + h, a + c, x + h, a + c / 2, x + h, a + c / 2, "e"]
          );
        },
        rect: function (x, a, h, c, g) {
          return _i.prototype.symbols[T(g) && g.r ? "callout" : "square"].call(
            0,
            x,
            a,
            h,
            c,
            g
          );
        },
      },
    };
    (Le.VMLRenderer = Ui =
      function () {
        this.init.apply(this, arguments);
      }),
      (Ui.prototype = h(_i.prototype, Ki)),
      (ee = Ui);
  }
  _i.prototype.measureSpanWidth = function (a, h) {
    var c,
      g = Me.createElement("span"),
      y = Me.createTextNode(a);
    return (
      g.appendChild(y),
      L(g, h),
      this.box.appendChild(g),
      (c = g.offsetWidth),
      N(g),
      c
    );
  };
  var $i, qi;
  Je &&
    ((Le.CanVGRenderer = $i =
      function () {
        Ke = "http://www.w3.org/1999/xhtml";
      }),
    ($i.prototype.symbols = {}),
    (qi = (function () {
      function a() {
        var a,
          c = h.length;
        for (a = 0; c > a; a++) h[a]();
        h = [];
      }
      var h = [];
      return {
        push: function (c, g) {
          0 === h.length && Ci(g, a), h.push(c);
        },
      };
    })()),
    (ee = $i)),
    (K.prototype = {
      addLabel: function () {
        var h,
          c,
          g,
          y,
          v = this,
          k = v.axis,
          S = k.options,
          P = k.chart,
          A = k.horiz,
          L = k.categories,
          M = k.names,
          D = v.pos,
          I = S.labels,
          B = I.rotation,
          O = k.tickPositions,
          z =
            (A &&
              L &&
              !I.step &&
              !I.staggerLines &&
              !I.rotation &&
              P.plotWidth / O.length) ||
            (!A && (P.margin[3] || 0.33 * P.chartWidth)),
          R = D === O[0],
          H = D === O[O.length - 1],
          X = L ? C(L[D], M[D], D) : D,
          E = v.label,
          G = O.info;
        k.isDatetimeAxis &&
          G &&
          (y = S.dateTimeLabelFormats[G.higherRanks[D] || G.unitName]),
          (v.isFirst = R),
          (v.isLast = H),
          (h = k.labelFormatter.call({
            axis: k,
            chart: P,
            isFirst: R,
            isLast: H,
            dateTimeLabelFormat: y,
            value: k.isLog ? F(w(X)) : X,
          })),
          (c = z && { width: Re(1, Be(z - 2 * (I.padding || 10))) + pi }),
          (c = a(c, I.style)),
          T(E)
            ? E && E.attr({ text: h }).css(c)
            : ((g = { align: k.labelAlign }),
              b(B) && (g.rotation = B),
              z && I.ellipsis && (c.HcHeight = k.len / O.length),
              (v.label = E =
                T(h) && I.enabled
                  ? P.renderer
                      .text(h, 0, 0, I.useHTML)
                      .attr(g)
                      .css(c)
                      .add(k.labelGroup)
                  : null),
              (k.tickBaseline = P.renderer.fontMetrics(I.style.fontSize, E).b),
              B && 2 === k.side && (k.tickBaseline *= Ee(B * Ye))),
          (v.yOffset = E
            ? C(
                I.y,
                k.tickBaseline + (2 === k.side ? 8 : -(E.getBBox().height / 2))
              )
            : 0);
      },
      getLabelSize: function () {
        var a = this.label,
          h = this.axis;
        return a ? a.getBBox()[h.horiz ? "height" : "width"] : 0;
      },
      getLabelSides: function () {
        var a = this.label.getBBox(),
          h = this.axis,
          c = h.horiz,
          g = h.options,
          y = g.labels,
          v = c ? a.width : a.height,
          b = c
            ? y.x - v * { left: 0, center: 0.5, right: 1 }[h.labelAlign]
            : 0,
          k = c ? v + b : v;
        return [b, k];
      },
      handleOverflow: function (a, h) {
        var c,
          g,
          y,
          v,
          b,
          k = !0,
          w = this.axis,
          S = this.isFirst,
          T = this.isLast,
          P = w.horiz,
          A = P ? h.x : h.y,
          C = w.reversed,
          L = w.tickPositions,
          M = this.getLabelSides(),
          D = M[0],
          I = M[1],
          B = this.label.line || 0,
          O = w.labelEdge,
          z = w.justifyLabels && (S || T);
        if ((O[B] === te || A + D > O[B] ? (O[B] = A + I) : z || (k = !1), z)) {
          (b = w.justifyToPlot),
            (c = b ? w.pos : 0),
            (g = b ? c + w.len : w.chart.chartWidth);
          do (a += S ? 1 : -1), (y = w.ticks[L[a]]);
          while (L[a] && (!y || !y.label || y.label.line !== B));
          (v = y && y.label.xy && y.label.xy.x + y.getLabelSides()[S ? 0 : 1]),
            (S && !C) || (T && C)
              ? c > A + D && ((A = c - D), y && A + I > v && (k = !1))
              : A + I > g && ((A = g - I), y && v > A + D && (k = !1)),
            (h.x = A);
        }
        return k;
      },
      getPosition: function (a, h, c, g) {
        var y = this.axis,
          v = y.chart,
          b = (g && v.oldChartHeight) || v.chartHeight;
        return {
          x: a
            ? y.translate(h + c, null, null, g) + y.transB
            : y.left +
              y.offset +
              (y.opposite
                ? ((g && v.oldChartWidth) || v.chartWidth) - y.right - y.left
                : 0),
          y: a
            ? b - y.bottom + y.offset - (y.opposite ? y.height : 0)
            : b - y.translate(h + c, null, null, g) - y.transB,
        };
      },
      getLabelPosition: function (x, a, h, c, g, y, v, b) {
        var k = this.axis,
          w = k.transA,
          S = k.reversed,
          T = k.staggerLines;
        return (
          (x = x + g.x - (y && c ? y * w * (S ? -1 : 1) : 0)),
          (a = a + this.yOffset - (y && !c ? y * w * (S ? 1 : -1) : 0)),
          T &&
            ((h.line = (v / (b || 1)) % T),
            (a += h.line * (k.labelOffset / T))),
          { x: x, y: a }
        );
      },
      getMarkPath: function (x, a, h, c, g, y) {
        return y.crispLine(
          [mi, x, a, yi, x + (g ? 0 : -h), a + (g ? h : 0)],
          c
        );
      },
      render: function (a, h, c) {
        var g,
          y,
          v,
          b = this,
          k = b.axis,
          w = k.options,
          S = k.chart,
          T = S.renderer,
          P = k.horiz,
          A = b.type,
          L = b.label,
          M = b.pos,
          D = w.labels,
          I = b.gridLine,
          B = A ? A + "Grid" : "grid",
          O = A ? A + "Tick" : "tick",
          z = w[B + "LineWidth"],
          R = w[B + "LineColor"],
          H = w[B + "LineDashStyle"],
          X = w[O + "Length"],
          E = w[O + "Width"] || 0,
          G = w[O + "Color"],
          W = w[O + "Position"],
          Y = b.mark,
          N = D.step,
          F = !0,
          j = k.tickmarkOffset,
          V = b.getPosition(P, M, j, h),
          x = V.x,
          _ = V.y,
          U = (P && x === k.pos + k.len) || (!P && _ === k.pos) ? -1 : 1;
        (c = C(c, 1)),
          (this.isActive = !0),
          z &&
            ((g = k.getPlotLinePath(M + j, z * U, h, !0)),
            I === te &&
              ((v = { stroke: R, "stroke-width": z }),
              H && (v.dashstyle = H),
              A || (v.zIndex = 1),
              h && (v.opacity = 0),
              (b.gridLine = I = z ? T.path(g).attr(v).add(k.gridGroup) : null)),
            !h &&
              I &&
              g &&
              I[b.isNew ? "attr" : "animate"]({ d: g, opacity: c })),
          E &&
            X &&
            ("inside" === W && (X = -X),
            k.opposite && (X = -X),
            (y = b.getMarkPath(x, _, X, E * U, P, T)),
            Y
              ? Y.animate({ d: y, opacity: c })
              : (b.mark = T.path(y)
                  .attr({ stroke: G, "stroke-width": E, opacity: c })
                  .add(k.axisGroup))),
          L &&
            !isNaN(x) &&
            ((L.xy = V = b.getLabelPosition(x, _, L, P, D, j, a, N)),
            (b.isFirst && !b.isLast && !C(w.showFirstLabel, 1)) ||
            (b.isLast && !b.isFirst && !C(w.showLastLabel, 1))
              ? (F = !1)
              : k.isRadial ||
                D.step ||
                D.rotation ||
                h ||
                0 === c ||
                (F = b.handleOverflow(a, V)),
            N && a % N && (F = !1),
            F && !isNaN(V.y)
              ? ((V.opacity = c),
                L[b.isNew ? "attr" : "animate"](V),
                (b.isNew = !1))
              : L.attr("y", -9999));
      },
      destroy: function () {
        Y(this, this.axis);
      },
    }),
    (Le.PlotLineOrBand = function (a, h) {
      (this.axis = a), h && ((this.options = h), (this.id = h.id));
    }),
    (Le.PlotLineOrBand.prototype = {
      render: function () {
        var a,
          c,
          g,
          y,
          x,
          v,
          b = this,
          w = b.axis,
          S = w.horiz,
          P = (w.pointRange || 0) / 2,
          A = b.options,
          C = A.label,
          L = b.label,
          M = A.width,
          D = A.to,
          I = A.from,
          B = T(I) && T(D),
          O = A.value,
          z = A.dashStyle,
          R = b.svgElem,
          H = [],
          X = A.color,
          E = A.zIndex,
          Y = A.events,
          N = {},
          F = w.chart.renderer;
        if ((w.isLog && ((I = k(I)), (D = k(D)), (O = k(O))), M))
          (H = w.getPlotLinePath(O, M)),
            (N = { stroke: X, "stroke-width": M }),
            z && (N.dashstyle = z);
        else {
          if (!B) return;
          (I = Re(I, w.min - P)),
            (D = He(D, w.max + P)),
            (H = w.getPlotBandPath(I, D, A)),
            X && (N.fill = X),
            A.borderWidth &&
              ((N.stroke = A.borderColor), (N["stroke-width"] = A.borderWidth));
        }
        if ((T(E) && (N.zIndex = E), R))
          H
            ? R.animate({ d: H }, null, R.onGetPath)
            : (R.hide(),
              (R.onGetPath = function () {
                R.show();
              }),
              L && (b.label = L = L.destroy()));
        else if (
          H &&
          H.length &&
          ((b.svgElem = R = F.path(H).attr(N).add()), Y)
        ) {
          a = function (a) {
            R.on(a, function (e) {
              Y[a].apply(b, [e]);
            });
          };
          for (c in Y) a(c);
        }
        return (
          C && T(C.text) && H && H.length && w.width > 0 && w.height > 0
            ? ((C = h(
                {
                  align: S && B && "center",
                  x: S ? !B && 4 : 10,
                  verticalAlign: !S && B && "middle",
                  y: S ? (B ? 16 : 10) : B ? 6 : -4,
                  rotation: S && !B && 90,
                },
                C
              )),
              L ||
                ((N = { align: C.textAlign || C.align, rotation: C.rotation }),
                T(E) && (N.zIndex = E),
                (b.label = L =
                  F.text(C.text, 0, 0, C.useHTML).attr(N).css(C.style).add())),
              (g = [H[1], H[4], B ? H[6] : H[1]]),
              (y = [H[2], H[5], B ? H[7] : H[2]]),
              (x = G(g)),
              (v = G(y)),
              L.align(C, !1, { x: x, y: v, width: W(g) - x, height: W(y) - v }),
              L.show())
            : L && L.hide(),
          b
        );
      },
      destroy: function () {
        S(this.axis.plotLinesAndBands, this), delete this.axis, Y(this);
      },
    }),
    (fe = {
      getPlotBandPath: function (a, h) {
        var c = this.getPlotLinePath(h),
          g = this.getPlotLinePath(a);
        return g && c ? g.push(c[4], c[5], c[1], c[2]) : (g = null), g;
      },
      addPlotBand: function (a) {
        return this.addPlotBandOrLine(a, "plotBands");
      },
      addPlotLine: function (a) {
        return this.addPlotBandOrLine(a, "plotLines");
      },
      addPlotBandOrLine: function (a, h) {
        var c = new Le.PlotLineOrBand(this, a).render(),
          g = this.userOptions;
        return (
          c &&
            (h && ((g[h] = g[h] || []), g[h].push(a)),
            this.plotLinesAndBands.push(c)),
          c
        );
      },
      removePlotBandOrLine: function (a) {
        for (
          var h = this.plotLinesAndBands,
            c = this.options,
            g = this.userOptions,
            i = h.length;
          i--;

        )
          h[i].id === a && h[i].destroy();
        Mi(
          [
            c.plotLines || [],
            g.plotLines || [],
            c.plotBands || [],
            g.plotBands || [],
          ],
          function (h) {
            for (i = h.length; i--; ) h[i].id === a && S(h, h[i]);
          }
        );
      },
    }),
    ($.prototype = {
      defaultOptions: {
        dateTimeLabelFormats: {
          millisecond: "%H:%M:%S.%L",
          second: "%H:%M:%S",
          minute: "%H:%M",
          hour: "%H:%M",
          day: "%e. %b",
          week: "%e. %b",
          month: "%b '%y",
          year: "%Y",
        },
        endOnTick: !1,
        gridLineColor: "#C0C0C0",
        labels: Gi,
        lineColor: "#C0D0E0",
        lineWidth: 1,
        minPadding: 0.01,
        maxPadding: 0.01,
        minorGridLineColor: "#E0E0E0",
        minorGridLineWidth: 1,
        minorTickColor: "#A0A0A0",
        minorTickLength: 2,
        minorTickPosition: "outside",
        startOfWeek: 1,
        startOnTick: !1,
        tickColor: "#C0D0E0",
        tickLength: 10,
        tickmarkPlacement: "between",
        tickPixelInterval: 100,
        tickPosition: "outside",
        tickWidth: 1,
        title: { align: "middle", style: { color: "#707070" } },
        type: "linear",
      },
      defaultYAxisOptions: {
        endOnTick: !0,
        gridLineWidth: 1,
        tickPixelInterval: 72,
        showLastLabel: !0,
        labels: { x: -8, y: 3 },
        lineWidth: 0,
        maxPadding: 0.05,
        minPadding: 0.05,
        startOnTick: !0,
        tickWidth: 0,
        title: { rotation: 270, text: "Values" },
        stackLabels: {
          enabled: !1,
          formatter: function () {
            return I(this.total, -1);
          },
          style: Gi.style,
        },
      },
      defaultLeftAxisOptions: {
        labels: { x: -15, y: null },
        title: { rotation: 270 },
      },
      defaultRightAxisOptions: {
        labels: { x: 15, y: null },
        title: { rotation: 90 },
      },
      defaultBottomAxisOptions: {
        labels: { x: 0, y: null },
        title: { rotation: 0 },
      },
      defaultTopAxisOptions: {
        labels: { x: 0, y: -15 },
        title: { rotation: 0 },
      },
      init: function (a, h) {
        var c = h.isX,
          g = this;
        (g.horiz = a.inverted ? !c : c),
          (g.isXAxis = c),
          (g.coll = c ? "xAxis" : "yAxis"),
          (g.opposite = h.opposite),
          (g.side =
            h.side || (g.horiz ? (g.opposite ? 0 : 2) : g.opposite ? 1 : 3)),
          g.setOptions(h);
        var y = this.options,
          v = y.type,
          b = "datetime" === v;
        (g.labelFormatter = y.labels.formatter || g.defaultLabelFormatter),
          (g.userOptions = h),
          (g.minPixelPadding = 0),
          (g.chart = a),
          (g.reversed = y.reversed),
          (g.zoomEnabled = y.zoomEnabled !== !1),
          (g.categories = y.categories || "category" === v),
          (g.names = []),
          (g.isLog = "logarithmic" === v),
          (g.isDatetimeAxis = b),
          (g.isLinked = T(y.linkedTo)),
          (g.tickmarkOffset =
            g.categories && "between" === y.tickmarkPlacement ? 0.5 : 0),
          (g.ticks = {}),
          (g.labelEdge = []),
          (g.minorTicks = {}),
          (g.plotLinesAndBands = []),
          (g.alternateBands = {}),
          (g.len = 0),
          (g.minRange = g.userMinRange = y.minRange || y.maxZoom),
          (g.range = y.range),
          (g.offset = y.offset || 0),
          (g.stacks = {}),
          (g.oldStacks = {}),
          (g.max = null),
          (g.min = null),
          (g.crosshair = C(
            y.crosshair,
            A(a.options.tooltip.crosshairs)[c ? 0 : 1],
            !1
          ));
        var S,
          P = g.options.events;
        -1 === Li(g, a.axes) &&
          (c && !this.isColorAxis
            ? a.axes.splice(a.xAxis.length, 0, g)
            : a.axes.push(g),
          a[g.coll].push(g)),
          (g.series = g.series || []),
          a.inverted && c && g.reversed === te && (g.reversed = !0),
          (g.removePlotBand = g.removePlotBandOrLine),
          (g.removePlotLine = g.removePlotBandOrLine);
        for (S in P) Oi(g, S, P[S]);
        g.isLog && ((g.val2lin = k), (g.lin2val = w));
      },
      setOptions: function (a) {
        this.options = h(
          this.defaultOptions,
          this.isXAxis ? {} : this.defaultYAxisOptions,
          [
            this.defaultTopAxisOptions,
            this.defaultRightAxisOptions,
            this.defaultBottomAxisOptions,
            this.defaultLeftAxisOptions,
          ][this.side],
          h(se[this.coll], a)
        );
      },
      defaultLabelFormatter: function () {
        var a,
          h,
          c = this.axis,
          g = this.value,
          y = c.categories,
          v = this.dateTimeLabelFormat,
          b = se.lang.numericSymbols,
          i = b && b.length,
          k = c.options.labels.format,
          w = c.isLog ? g : c.tickInterval;
        if (k) h = R(k, this);
        else if (y) h = g;
        else if (v) h = ae(v, g);
        else if (i && w >= 1e3)
          for (; i-- && h === te; )
            (a = Math.pow(1e3, i + 1)),
              w >= a && null !== b[i] && (h = I(g / a, -1) + b[i]);
        return h === te && (h = Xe(g) >= 1e4 ? I(g, 0) : I(g, -1, te, "")), h;
      },
      getSeriesExtremes: function () {
        var a = this,
          h = a.chart;
        (a.hasVisibleSeries = !1),
          (a.dataMin = a.dataMax = null),
          a.buildStacks && a.buildStacks(),
          Mi(a.series, function (c) {
            if (c.visible || !h.options.chart.ignoreHiddenSeries) {
              var g,
                y,
                v,
                b = c.options,
                k = b.threshold;
              (a.hasVisibleSeries = !0),
                a.isLog && 0 >= k && (k = null),
                a.isXAxis
                  ? ((g = c.xData),
                    g.length &&
                      ((a.dataMin = He(C(a.dataMin, g[0]), G(g))),
                      (a.dataMax = Re(C(a.dataMax, g[0]), W(g)))))
                  : (c.getExtremes(),
                    (v = c.dataMax),
                    (y = c.dataMin),
                    T(y) &&
                      T(v) &&
                      ((a.dataMin = He(C(a.dataMin, y), y)),
                      (a.dataMax = Re(C(a.dataMax, v), v))),
                    T(k) &&
                      (a.dataMin >= k
                        ? ((a.dataMin = k), (a.ignoreMinPadding = !0))
                        : a.dataMax < k &&
                          ((a.dataMax = k), (a.ignoreMaxPadding = !0))));
            }
          });
      },
      translate: function (a, h, c, g, y, v) {
        var k,
          w = this,
          S = 1,
          T = 0,
          P = g ? w.oldTransA : w.transA,
          A = g ? w.oldMin : w.min,
          C = w.minPixelPadding,
          L = (w.options.ordinal || (w.isLog && y)) && w.lin2val;
        return (
          P || (P = w.transA),
          c && ((S *= -1), (T = w.len)),
          w.reversed && ((S *= -1), (T -= S * (w.sector || w.len))),
          h
            ? ((a = a * S + T),
              (a -= C),
              (k = a / P + A),
              L && (k = w.lin2val(k)))
            : (L && (a = w.val2lin(a)),
              "between" === v && (v = 0.5),
              (k =
                S * (a - A) * P +
                T +
                S * C +
                (b(v) ? P * v * w.pointRange : 0))),
          k
        );
      },
      toPixels: function (a, h) {
        return (
          this.translate(a, !1, !this.horiz, null, !0) + (h ? 0 : this.pos)
        );
      },
      toValue: function (a, h) {
        return this.translate(
          a - (h ? 0 : this.pos),
          !0,
          !this.horiz,
          null,
          !0
        );
      },
      getPlotLinePath: function (a, h, c, g, y) {
        var v,
          b,
          k,
          w,
          S,
          T = this,
          P = T.chart,
          A = T.left,
          L = T.top,
          M = (c && P.oldChartHeight) || P.chartHeight,
          D = (c && P.oldChartWidth) || P.chartWidth,
          I = T.transB;
        return (
          (y = C(y, T.translate(a, null, null, c))),
          (v = k = Be(y + I)),
          (b = w = Be(M - y - I)),
          isNaN(y)
            ? (S = !0)
            : T.horiz
            ? ((b = L),
              (w = M - T.bottom),
              (A > v || v > A + T.width) && (S = !0))
            : ((v = A),
              (k = D - T.right),
              (L > b || b > L + T.height) && (S = !0)),
          S && !g ? null : P.renderer.crispLine([mi, v, b, yi, k, w], h || 1)
        );
      },
      getLinearTickPositions: function (a, h, c) {
        var g,
          y,
          v = F(Oe(h / a) * a),
          k = F(ze(c / a) * a),
          w = [];
        if (h === c && b(h)) return [h];
        for (g = v; k >= g && (w.push(g), (g = F(g + a)), g !== y); ) y = g;
        return w;
      },
      getMinorTickPositions: function () {
        var a,
          i,
          h,
          c = this,
          g = c.options,
          y = c.tickPositions,
          v = c.minorTickInterval,
          b = [];
        if (c.isLog)
          for (h = y.length, i = 1; h > i; i++)
            b = b.concat(c.getLogTickPositions(v, y[i - 1], y[i], !0));
        else if (c.isDatetimeAxis && "auto" === g.minorTickInterval)
          (b = b.concat(
            c.getTimeTicks(
              c.normalizeTimeTickInterval(v),
              c.min,
              c.max,
              g.startOfWeek
            )
          )),
            b[0] < c.min && b.shift();
        else
          for (a = c.min + ((y[0] - c.min) % v); a <= c.max; a += v) b.push(a);
        return b;
      },
      adjustForMinRange: function () {
        var a,
          h,
          i,
          c,
          g,
          y,
          v,
          b,
          k = this,
          w = k.options,
          S = k.min,
          P = k.max,
          A = k.dataMax - k.dataMin >= k.minRange;
        if (
          (k.isXAxis &&
            k.minRange === te &&
            !k.isLog &&
            (T(w.min) || T(w.max)
              ? (k.minRange = null)
              : (Mi(k.series, function (a) {
                  for (
                    g = a.xData, y = a.xIncrement ? 1 : g.length - 1, i = y;
                    i > 0;
                    i--
                  )
                    (c = g[i] - g[i - 1]), (h === te || h > c) && (h = c);
                }),
                (k.minRange = He(5 * h, k.dataMax - k.dataMin)))),
          P - S < k.minRange)
        ) {
          var L = k.minRange;
          (a = (L - P + S) / 2),
            (v = [S - a, C(w.min, S - a)]),
            A && (v[2] = k.dataMin),
            (S = W(v)),
            (b = [S + L, C(w.max, S + L)]),
            A && (b[2] = k.dataMax),
            (P = G(b)),
            L > P - S && ((v[0] = P - L), (v[1] = C(w.min, P - L)), (S = W(v)));
        }
        (k.min = S), (k.max = P);
      },
      setAxisTranslation: function (a) {
        var h,
          c,
          y = this,
          v = y.max - y.min,
          b = y.axisPointRange || 0,
          k = 0,
          w = 0,
          S = y.linkedParent,
          P = !!y.categories,
          A = y.transA;
        (y.isXAxis || P || b) &&
          (S
            ? ((k = S.minPointOffset), (w = S.pointRangePadding))
            : Mi(y.series, function (a) {
                var c = P
                    ? 1
                    : y.isXAxis
                    ? a.pointRange
                    : y.axisPointRange || 0,
                  S = a.options.pointPlacement,
                  A = a.closestPointRange;
                c > v && (c = 0),
                  (b = Re(b, c)),
                  (k = Re(k, g(S) ? 0 : c / 2)),
                  (w = Re(w, "on" === S ? 0 : c)),
                  !a.noSharedTooltip && T(A) && (h = T(h) ? He(h, A) : A);
              }),
          (c = y.ordinalSlope && h ? y.ordinalSlope / h : 1),
          (y.minPointOffset = k *= c),
          (y.pointRangePadding = w *= c),
          (y.pointRange = He(b, v)),
          (y.closestPointRange = h)),
          a && (y.oldTransA = A),
          (y.translationSlope = y.transA = A = y.len / (v + w || 1)),
          (y.transB = y.horiz ? y.left : y.bottom),
          (y.minPixelPadding = A * k);
      },
      setTickPositions: function (a) {
        var h,
          c,
          g,
          y,
          v = this,
          w = v.chart,
          S = v.options,
          P = S.startOnTick,
          A = S.endOnTick,
          L = v.isLog,
          M = v.isDatetimeAxis,
          D = v.isXAxis,
          I = v.isLinked,
          B = v.options.tickPositioner,
          O = S.maxPadding,
          z = S.minPadding,
          R = S.tickInterval,
          E = S.minTickInterval,
          G = S.tickPixelInterval,
          W = v.categories;
        if (
          (I
            ? ((v.linkedParent = w[v.coll][S.linkedTo]),
              (c = v.linkedParent.getExtremes()),
              (v.min = C(c.min, c.dataMin)),
              (v.max = C(c.max, c.dataMax)),
              S.type !== v.linkedParent.options.type && ue(11, 1))
            : ((v.min = C(v.userMin, S.min, v.dataMin)),
              (v.max = C(v.userMax, S.max, v.dataMax))),
          L &&
            (!a && He(v.min, C(v.dataMin, v.min)) <= 0 && ue(10, 1),
            (v.min = F(k(v.min))),
            (v.max = F(k(v.max)))),
          v.range &&
            T(v.max) &&
            ((v.userMin = v.min = Re(v.min, v.max - v.range)),
            (v.userMax = v.max),
            (v.range = null)),
          v.beforePadding && v.beforePadding(),
          v.adjustForMinRange(),
          W ||
            v.axisPointRange ||
            v.usePercentage ||
            I ||
            !T(v.min) ||
            !T(v.max) ||
            ((h = v.max - v.min),
            h &&
              (T(S.min) ||
                T(v.userMin) ||
                !z ||
                (!(v.dataMin < 0) && v.ignoreMinPadding) ||
                (v.min -= h * z),
              T(S.max) ||
                T(v.userMax) ||
                !O ||
                (!(v.dataMax > 0) && v.ignoreMaxPadding) ||
                (v.max += h * O))),
          b(S.floor) && (v.min = Re(v.min, S.floor)),
          b(S.ceiling) && (v.max = He(v.max, S.ceiling)),
          v.min === v.max || void 0 === v.min || void 0 === v.max
            ? (v.tickInterval = 1)
            : I && !R && G === v.linkedParent.options.tickPixelInterval
            ? (v.tickInterval = v.linkedParent.tickInterval)
            : ((v.tickInterval = C(
                R,
                W ? 1 : ((v.max - v.min) * G) / Re(v.len, G)
              )),
              !T(R) &&
                v.len < G &&
                !this.isRadial &&
                !this.isLog &&
                !W &&
                P &&
                A &&
                ((y = !0), (v.tickInterval /= 4))),
          D &&
            !a &&
            Mi(v.series, function (a) {
              a.processData(v.min !== v.oldMin || v.max !== v.oldMax);
            }),
          v.setAxisTranslation(!0),
          v.beforeSetTickPositions && v.beforeSetTickPositions(),
          v.postProcessTickInterval &&
            (v.tickInterval = v.postProcessTickInterval(v.tickInterval)),
          v.pointRange && (v.tickInterval = Re(v.pointRange, v.tickInterval)),
          !R && v.tickInterval < E && (v.tickInterval = E),
          M ||
            L ||
            R ||
            (v.tickInterval = X(v.tickInterval, null, H(v.tickInterval), S)),
          (v.minorTickInterval =
            "auto" === S.minorTickInterval && v.tickInterval
              ? v.tickInterval / 5
              : S.minorTickInterval),
          (v.tickPositions = g =
            S.tickPositions
              ? [].concat(S.tickPositions)
              : B && B.apply(v, [v.min, v.max])),
          g ||
            (!v.ordinalPositions &&
              (v.max - v.min) / v.tickInterval > Re(2 * v.len, 200) &&
              ue(19, !0),
            (g = M
              ? v.getTimeTicks(
                  v.normalizeTimeTickInterval(v.tickInterval, S.units),
                  v.min,
                  v.max,
                  S.startOfWeek,
                  v.ordinalPositions,
                  v.closestPointRange,
                  !0
                )
              : L
              ? v.getLogTickPositions(v.tickInterval, v.min, v.max)
              : v.getLinearTickPositions(v.tickInterval, v.min, v.max)),
            y && g.splice(1, g.length - 2),
            (v.tickPositions = g)),
          !I)
        ) {
          var Y,
            N = g[0],
            j = g[g.length - 1],
            V = v.minPointOffset || 0;
          P || A || W || 2 !== g.length || g.splice(1, 0, (j + N) / 2),
            P ? (v.min = N) : v.min - V > N && g.shift(),
            A ? (v.max = j) : v.max + V < j && g.pop(),
            1 === g.length &&
              ((Y = Xe(v.max) > 1e13 ? 1 : 0.001), (v.min -= Y), (v.max += Y));
        }
      },
      setMaxTicks: function () {
        var a = this.chart,
          h = a.maxTicks || {},
          c = this.tickPositions,
          g = (this._maxTicksKey = [this.coll, this.pos, this.len].join("-"));
        !this.isLinked &&
          !this.isDatetimeAxis &&
          c &&
          c.length > (h[g] || 0) &&
          this.options.alignTicks !== !1 &&
          (h[g] = c.length),
          (a.maxTicks = h);
      },
      adjustTickAmount: function () {
        var a = this,
          h = a.chart,
          c = a._maxTicksKey,
          g = a.tickPositions,
          y = h.maxTicks;
        if (
          y &&
          y[c] &&
          !a.isDatetimeAxis &&
          !a.categories &&
          !a.isLinked &&
          a.options.alignTicks !== !1 &&
          this.min !== te
        ) {
          var v,
            b = a.tickAmount,
            k = g.length;
          if (((a.tickAmount = v = y[c]), v > k)) {
            for (; g.length < v; ) g.push(F(g[g.length - 1] + a.tickInterval));
            (a.transA *= (k - 1) / (v - 1)), (a.max = g[g.length - 1]);
          }
          T(b) && v !== b && (a.isDirty = !0);
        }
      },
      setScale: function () {
        var a,
          i,
          h,
          c,
          g = this,
          y = g.stacks;
        if (
          ((g.oldMin = g.min),
          (g.oldMax = g.max),
          (g.oldAxisLength = g.len),
          g.setAxisSize(),
          (c = g.len !== g.oldAxisLength),
          Mi(g.series, function (a) {
            (a.isDirtyData || a.isDirty || a.xAxis.isDirty) && (h = !0);
          }),
          c ||
            h ||
            g.isLinked ||
            g.forceRedraw ||
            g.userMin !== g.oldUserMin ||
            g.userMax !== g.oldUserMax)
        ) {
          if (!g.isXAxis)
            for (a in y)
              for (i in y[a]) (y[a][i].total = null), (y[a][i].cum = 0);
          (g.forceRedraw = !1),
            g.getSeriesExtremes(),
            g.setTickPositions(),
            (g.oldUserMin = g.userMin),
            (g.oldUserMax = g.userMax),
            g.isDirty ||
              (g.isDirty = c || g.min !== g.oldMin || g.max !== g.oldMax);
        } else if (!g.isXAxis) {
          g.oldStacks && (y = g.stacks = g.oldStacks);
          for (a in y) for (i in y[a]) y[a][i].cum = y[a][i].total;
        }
        g.setMaxTicks();
      },
      setExtremes: function (h, c, g, y, v) {
        var b = this,
          k = b.chart;
        (g = C(g, !0)),
          (v = a(v, { min: h, max: c })),
          Ri(b, "setExtremes", v, function () {
            (b.userMin = h),
              (b.userMax = c),
              (b.eventArgs = v),
              (b.isDirtyExtremes = !0),
              g && k.redraw(y);
          });
      },
      zoom: function (a, h) {
        var c = this.dataMin,
          g = this.dataMax,
          y = this.options;
        return (
          this.allowZoomOutside ||
            (T(c) && a <= He(c, C(y.min, c)) && (a = te),
            T(g) && h >= Re(g, C(y.max, g)) && (h = te)),
          (this.displayBtn = a !== te || h !== te),
          this.setExtremes(a, h, !1, te, { trigger: "zoom" }),
          !0
        );
      },
      setAxisSize: function () {
        var a = this.chart,
          h = this.options,
          c = h.offsetLeft || 0,
          g = h.offsetRight || 0,
          y = this.horiz,
          v = C(h.width, a.plotWidth - c + g),
          b = C(h.height, a.plotHeight),
          k = C(h.top, a.plotTop),
          w = C(h.left, a.plotLeft + c),
          S = /%$/;
        S.test(b) && (b = (parseInt(b, 10) / 100) * a.plotHeight),
          S.test(k) && (k = (parseInt(k, 10) / 100) * a.plotHeight + a.plotTop),
          (this.left = w),
          (this.top = k),
          (this.width = v),
          (this.height = b),
          (this.bottom = a.chartHeight - b - k),
          (this.right = a.chartWidth - v - w),
          (this.len = Re(y ? v : b, 0)),
          (this.pos = y ? w : k);
      },
      getExtremes: function () {
        var a = this,
          h = a.isLog;
        return {
          min: h ? F(w(a.min)) : a.min,
          max: h ? F(w(a.max)) : a.max,
          dataMin: a.dataMin,
          dataMax: a.dataMax,
          userMin: a.userMin,
          userMax: a.userMax,
        };
      },
      getThreshold: function (a) {
        var h = this,
          c = h.isLog,
          g = c ? w(h.min) : h.min,
          y = c ? w(h.max) : h.max;
        return (
          g > a || null === a ? (a = g) : a > y && (a = y),
          h.translate(a, 0, 1, 0, 1)
        );
      },
      autoLabelAlign: function (a) {
        var h,
          c = (C(a, 0) - 90 * this.side + 720) % 360;
        return (h =
          c > 15 && 165 > c ? "right" : c > 195 && 345 > c ? "left" : "center");
      },
      getOffset: function () {
        var a,
          h,
          c,
          g,
          n,
          i,
          y,
          v,
          b,
          k,
          w,
          x,
          S,
          P,
          A,
          L = this,
          M = L.chart,
          D = M.renderer,
          I = L.options,
          B = L.tickPositions,
          O = L.ticks,
          z = L.horiz,
          R = L.side,
          H = M.inverted ? [1, 0, 3, 2][R] : R,
          X = 0,
          E = 0,
          G = I.title,
          W = I.labels,
          Y = 0,
          N = M.axisOffset,
          F = M.clipOffset,
          j = [-1, 1, 1, -1][R],
          V = 1,
          _ = C(W.maxStaggerLines, 5);
        if (
          ((L.hasData = a =
            L.hasVisibleSeries || (T(L.min) && T(L.max) && !!B)),
          (L.showAxis = h = a || C(I.showEmpty, !0)),
          (L.staggerLines = L.horiz && W.staggerLines),
          L.axisGroup ||
            ((L.gridGroup = D.g("grid")
              .attr({ zIndex: I.gridZIndex || 1 })
              .add()),
            (L.axisGroup = D.g("axis")
              .attr({ zIndex: I.zIndex || 2 })
              .add()),
            (L.labelGroup = D.g("axis-labels")
              .attr({ zIndex: W.zIndex || 7 })
              .addClass(ci + L.coll.toLowerCase() + "-labels")
              .add())),
          a || L.isLinked)
        ) {
          if (
            ((L.labelAlign = C(W.align || L.autoLabelAlign(W.rotation))),
            Mi(B, function (a) {
              O[a] ? O[a].addLabel() : (O[a] = new K(L, a));
            }),
            L.horiz && !L.staggerLines && _ && !W.rotation)
          ) {
            for (y = L.reversed ? [].concat(B).reverse() : B; _ > V; ) {
              for (v = [], b = !1, i = 0; i < y.length; i++)
                (k = y[i]),
                  (w = O[k].label && O[k].label.getBBox()),
                  (S = w ? w.width : 0),
                  (P = i % V),
                  S &&
                    ((x = L.translate(k)),
                    v[P] !== te && x < v[P] && (b = !0),
                    (v[P] = x + S));
              if (!b) break;
              V++;
            }
            V > 1 && (L.staggerLines = V);
          }
          Mi(B, function (a) {
            (0 === R ||
              2 === R ||
              { 1: "left", 3: "right" }[R] === L.labelAlign) &&
              (Y = Re(O[a].getLabelSize(), Y));
          }),
            L.staggerLines && ((Y *= L.staggerLines), (L.labelOffset = Y));
        } else for (n in O) O[n].destroy(), delete O[n];
        G &&
          G.text &&
          G.enabled !== !1 &&
          (L.axisTitle ||
            ((L.axisTitle = D.text(G.text, 0, 0, G.useHTML)
              .attr({
                zIndex: 7,
                rotation: G.rotation || 0,
                align:
                  G.textAlign ||
                  { low: "left", middle: "center", high: "right" }[G.align],
              })
              .addClass(ci + this.coll.toLowerCase() + "-title")
              .css(G.style)
              .add(L.axisGroup)),
            (L.axisTitle.isNew = !0)),
          h &&
            ((X = L.axisTitle.getBBox()[z ? "height" : "width"]),
            (c = G.offset),
            (E = T(c) ? 0 : C(G.margin, z ? 5 : 10))),
          L.axisTitle[h ? "show" : "hide"]()),
          (L.offset = j * C(I.offset, N[R])),
          (A = 2 === R ? L.tickBaseline : 0),
          (g = Y + E + (Y && j * (z ? C(W.y, L.tickBaseline + 8) : W.x) - A)),
          (L.axisTitleMargin = C(c, g)),
          (N[R] = Re(N[R], L.axisTitleMargin + X + j * L.offset, g)),
          (F[H] = Re(F[H], 2 * Oe(I.lineWidth / 2)));
      },
      getLinePath: function (a) {
        var h = this.chart,
          c = this.opposite,
          g = this.offset,
          y = this.horiz,
          v = this.left + (c ? this.width : 0) + g,
          b = h.chartHeight - this.bottom - (c ? this.height : 0) + g;
        return (
          c && (a *= -1),
          h.renderer.crispLine(
            [
              mi,
              y ? this.left : v,
              y ? b : this.top,
              yi,
              y ? h.chartWidth - this.right : v,
              y ? b : h.chartHeight - this.bottom,
            ],
            a
          )
        );
      },
      getTitlePosition: function () {
        var a = this.horiz,
          h = this.left,
          g = this.top,
          y = this.len,
          v = this.options.title,
          b = a ? h : g,
          k = this.opposite,
          w = this.offset,
          S = c(v.style.fontSize || 12),
          T = {
            low: b + (a ? 0 : y),
            middle: b + y / 2,
            high: b + (a ? y : 0),
          }[v.align],
          P =
            (a ? g + this.height : h) +
            (a ? 1 : -1) * (k ? -1 : 1) * this.axisTitleMargin +
            (2 === this.side ? S : 0);
        return {
          x: a ? T : P + (k ? this.width : 0) + w + (v.x || 0),
          y: a ? P - (k ? this.height : 0) + w : T + (v.y || 0),
        };
      },
      render: function () {
        var a,
          h,
          c,
          g,
          y = this,
          v = y.horiz,
          b = y.reversed,
          k = y.chart,
          S = k.renderer,
          P = y.options,
          A = y.isLog,
          C = y.isLinked,
          L = y.tickPositions,
          M = y.axisTitle,
          D = y.ticks,
          I = y.minorTicks,
          B = y.alternateBands,
          O = P.stackLabels,
          z = P.alternateGridColor,
          R = y.tickmarkOffset,
          H = P.lineWidth,
          X = k.hasRendered,
          E = X && T(y.oldMin) && !isNaN(y.oldMin),
          G = y.hasData,
          W = y.showAxis,
          Y = P.labels.overflow,
          N = (y.justifyLabels = v && Y !== !1);
        (y.labelEdge.length = 0),
          (y.justifyToPlot = "justify" === Y),
          Mi([D, I, B], function (a) {
            var h;
            for (h in a) a[h].isActive = !1;
          }),
          (G || C) &&
            (y.minorTickInterval &&
              !y.categories &&
              Mi(y.getMinorTickPositions(), function (a) {
                I[a] || (I[a] = new K(y, a, "minor")),
                  E && I[a].isNew && I[a].render(null, !0),
                  I[a].render(null, !1, 1);
              }),
            L.length &&
              ((a = L.slice()),
              ((v && b) || (!v && !b)) && a.reverse(),
              N && (a = a.slice(1).concat([a[0]])),
              Mi(a, function (h, i) {
                N && (i = i === a.length - 1 ? 0 : i + 1),
                  (!C || (h >= y.min && h <= y.max)) &&
                    (D[h] || (D[h] = new K(y, h)),
                    E && D[h].isNew && D[h].render(i, !0, 0.1),
                    D[h].render(i));
              }),
              R &&
                0 === y.min &&
                (D[-1] || (D[-1] = new K(y, -1, null, !0)), D[-1].render(-1))),
            z &&
              Mi(L, function (a, i) {
                i % 2 === 0 &&
                  a < y.max &&
                  (B[a] || (B[a] = new Le.PlotLineOrBand(y)),
                  (c = a + R),
                  (g = L[i + 1] !== te ? L[i + 1] + R : y.max),
                  (B[a].options = {
                    from: A ? w(c) : c,
                    to: A ? w(g) : g,
                    color: z,
                  }),
                  B[a].render(),
                  (B[a].isActive = !0));
              }),
            y._addedPlotLB ||
              (Mi((P.plotLines || []).concat(P.plotBands || []), function (a) {
                y.addPlotBandOrLine(a);
              }),
              (y._addedPlotLB = !0))),
          Mi([D, I, B], function (a) {
            var h,
              i,
              c = [],
              g = he ? he.duration || 500 : 0,
              y = function () {
                for (i = c.length; i--; )
                  a[c[i]] &&
                    !a[c[i]].isActive &&
                    (a[c[i]].destroy(), delete a[c[i]]);
              };
            for (h in a)
              a[h].isActive ||
                (a[h].render(h, !1, 0), (a[h].isActive = !1), c.push(h));
            a !== B && k.hasRendered && g ? g && setTimeout(y, g) : y();
          }),
          H &&
            ((h = y.getLinePath(H)),
            y.axisLine
              ? y.axisLine.animate({ d: h })
              : (y.axisLine = S.path(h)
                  .attr({ stroke: P.lineColor, "stroke-width": H, zIndex: 7 })
                  .add(y.axisGroup)),
            y.axisLine[W ? "show" : "hide"]()),
          M &&
            W &&
            (M[M.isNew ? "attr" : "animate"](y.getTitlePosition()),
            (M.isNew = !1)),
          O && O.enabled && y.renderStackTotals(),
          (y.isDirty = !1);
      },
      redraw: function () {
        this.render(),
          Mi(this.plotLinesAndBands, function (a) {
            a.render();
          }),
          Mi(this.series, function (a) {
            a.isDirty = !0;
          });
      },
      destroy: function (a) {
        var h,
          i,
          c = this,
          g = c.stacks,
          y = c.plotLinesAndBands;
        a || zi(c);
        for (h in g) Y(g[h]), (g[h] = null);
        for (
          Mi([c.ticks, c.minorTicks, c.alternateBands], function (a) {
            Y(a);
          }),
            i = y.length;
          i--;

        )
          y[i].destroy();
        Mi(
          [
            "stackTotalGroup",
            "axisLine",
            "axisTitle",
            "axisGroup",
            "cross",
            "gridGroup",
            "labelGroup",
          ],
          function (a) {
            c[a] && (c[a] = c[a].destroy());
          }
        ),
          this.cross && this.cross.destroy();
      },
      drawCrosshair: function (e, a) {
        if (this.crosshair) {
          if ((T(a) || !C(this.crosshair.snap, !0)) === !1)
            return void this.hideCrosshair();
          var h,
            c,
            g = this.crosshair,
            y = g.animation;
          if (
            (C(g.snap, !0)
              ? T(a) &&
                (c =
                  this.chart.inverted != this.horiz
                    ? a.plotX
                    : this.len - a.plotY)
              : (c = this.horiz
                  ? e.chartX - this.pos
                  : this.len - e.chartY + this.pos),
            (h = this.isRadial
              ? this.getPlotLinePath(this.isXAxis ? a.x : C(a.stackY, a.y))
              : this.getPlotLinePath(null, null, null, null, c)),
            null === h)
          )
            return void this.hideCrosshair();
          if (this.cross)
            this.cross
              .attr({ visibility: di })
              [y ? "animate" : "attr"]({ d: h }, y);
          else {
            var v = {
              "stroke-width": g.width || 1,
              stroke: g.color || "#C0C0C0",
              zIndex: g.zIndex || 2,
            };
            g.dashStyle && (v.dashstyle = g.dashStyle),
              (this.cross = this.chart.renderer.path(h).attr(v).add());
          }
        }
      },
      hideCrosshair: function () {
        this.cross && this.cross.hide();
      },
    }),
    a($.prototype, fe),
    ($.prototype.getTimeTicks = function (h, c, g, y) {
      var i,
        v,
        b = [],
        k = {},
        w = se.global.useUTC,
        S = new Date(c - me),
        P = h.unitRange,
        A = h.count;
      if (T(c)) {
        P >= pe.second &&
          (S.setMilliseconds(0),
          S.setSeconds(P >= pe.minute ? 0 : A * Oe(S.getSeconds() / A))),
          P >= pe.minute && S[Se](P >= pe.hour ? 0 : A * Oe(S[ye]() / A)),
          P >= pe.hour && S[Te](P >= pe.day ? 0 : A * Oe(S[ve]() / A)),
          P >= pe.day && S[Pe](P >= pe.month ? 1 : A * Oe(S[be]() / A)),
          P >= pe.month &&
            (S[Ae](P >= pe.year ? 0 : A * Oe(S[ke]() / A)), (v = S[we]())),
          P >= pe.year && ((v -= v % A), S[Ce](v)),
          P === pe.week && S[Pe](S[be]() - S[xe]() + C(y, 1)),
          (i = 1),
          me && (S = new Date(S.getTime() + me)),
          (v = S[we]());
        for (
          var L = S.getTime(),
            M = S[ke](),
            D = S[be](),
            I = w ? me : (864e5 + 60 * S.getTimezoneOffset() * 1e3) % 864e5;
          g > L;

        )
          b.push(L),
            P === pe.year
              ? (L = ge(v + i * A, 0))
              : P === pe.month
              ? (L = ge(v, M + i * A))
              : w || (P !== pe.day && P !== pe.week)
              ? (L += P * A)
              : (L = ge(v, M, D + i * A * (P === pe.day ? 1 : 7))),
            i++;
        b.push(L),
          Mi(
            Di(b, function (a) {
              return P <= pe.hour && a % pe.day === I;
            }),
            function (a) {
              k[a] = "day";
            }
          );
      }
      return (b.info = a(h, { higherRanks: k, totalRange: P * A })), b;
    }),
    ($.prototype.normalizeTimeTickInterval = function (a, h) {
      var c,
        i,
        g = h || [
          ["millisecond", [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]],
          ["second", [1, 2, 5, 10, 15, 30]],
          ["minute", [1, 2, 5, 10, 15, 30]],
          ["hour", [1, 2, 3, 4, 6, 8, 12]],
          ["day", [1, 2]],
          ["week", [1, 2]],
          ["month", [1, 2, 3, 4, 6]],
          ["year", null],
        ],
        y = g[g.length - 1],
        v = pe[y[0]],
        b = y[1];
      for (i = 0; i < g.length; i++)
        if (((y = g[i]), (v = pe[y[0]]), (b = y[1]), g[i + 1])) {
          var k = (v * b[b.length - 1] + pe[g[i + 1][0]]) / 2;
          if (k >= a) break;
        }
      return (
        v === pe.year && 5 * v > a && (b = [1, 2, 5]),
        (c = X(a / v, b, "year" === y[0] ? Re(H(a / v), 1) : 1)),
        { unitRange: v, count: c, unitName: y[0] }
      );
    }),
    ($.prototype.getLogTickPositions = function (a, h, c, g) {
      var y = this,
        v = y.options,
        b = y.len,
        S = [];
      if ((g || (y._minorAutoInterval = null), a >= 0.5))
        (a = Be(a)), (S = y.getLinearTickPositions(a, h, c));
      else if (a >= 0.08) {
        var T,
          i,
          P,
          A,
          L,
          M,
          D,
          I = Oe(h);
        for (
          T =
            a > 0.3
              ? [1, 2, 4]
              : a > 0.15
              ? [1, 2, 4, 6, 8]
              : [1, 2, 3, 4, 5, 6, 7, 8, 9],
            i = I;
          c + 1 > i && !D;
          i++
        )
          for (A = T.length, P = 0; A > P && !D; P++)
            (L = k(w(i) * T[P])),
              L > h && (!g || c >= M) && M !== te && S.push(M),
              M > c && (D = !0),
              (M = L);
      } else {
        var B = w(h),
          O = w(c),
          z = v[g ? "minorTickInterval" : "tickInterval"],
          R = "auto" === z ? null : z,
          E = v.tickPixelInterval / (g ? 5 : 1),
          G = g ? b / y.tickPositions.length : b;
        (a = C(R, y._minorAutoInterval, ((O - B) * E) / (G || 1))),
          (a = X(a, null, H(a))),
          (S = Bi(y.getLinearTickPositions(a, B, O), k)),
          g || (y._minorAutoInterval = a / 5);
      }
      return g || (y.tickInterval = a), S;
    });
  var Ji = (Le.Tooltip = function () {
    this.init.apply(this, arguments);
  });
  Ji.prototype = {
    init: function (a, h) {
      var g = h.borderWidth,
        y = h.style,
        v = c(y.padding);
      (this.chart = a),
        (this.options = h),
        (this.crosshairs = []),
        (this.now = { x: 0, y: 0 }),
        (this.isHidden = !0),
        (this.label = a.renderer
          .label(
            "",
            0,
            0,
            h.shape || "callout",
            null,
            null,
            h.useHTML,
            null,
            "tooltip"
          )
          .attr({
            padding: v,
            fill: h.backgroundColor,
            "stroke-width": g,
            r: h.borderRadius,
            zIndex: 8,
          })
          .css(y)
          .css({ padding: 0 })
          .add()
          .attr({ y: -9999 })),
        Je || this.label.shadow(h.shadow),
        (this.shared = h.shared);
    },
    destroy: function () {
      this.label && (this.label = this.label.destroy()),
        clearTimeout(this.hideTimer),
        clearTimeout(this.tooltipTimeout);
    },
    move: function (x, h, c, g) {
      var y = this,
        v = y.now,
        b =
          y.options.animation !== !1 &&
          !y.isHidden &&
          (Xe(x - v.x) > 1 || Xe(h - v.y) > 1),
        k = y.followPointer || y.len > 1;
      a(v, {
        x: b ? (2 * v.x + x) / 3 : x,
        y: b ? (v.y + h) / 2 : h,
        anchorX: k ? te : b ? (2 * v.anchorX + c) / 3 : c,
        anchorY: k ? te : b ? (v.anchorY + g) / 2 : g,
      }),
        y.label.attr(v),
        b &&
          (clearTimeout(this.tooltipTimeout),
          (this.tooltipTimeout = setTimeout(function () {
            y && y.move(x, h, c, g);
          }, 32)));
    },
    hide: function () {
      var a,
        h = this;
      clearTimeout(this.hideTimer),
        this.isHidden ||
          ((a = this.chart.hoverPoints),
          (this.hideTimer = setTimeout(function () {
            h.label.fadeOut(), (h.isHidden = !0);
          }, C(this.options.hideDelay, 500))),
          a &&
            Mi(a, function (a) {
              a.setState();
            }),
          (this.chart.hoverPoints = null));
    },
    getAnchor: function (a, h) {
      var c,
        g,
        y = this.chart,
        v = y.inverted,
        b = y.plotTop,
        k = 0,
        w = 0;
      return (
        (a = A(a)),
        (c = a[0].tooltipPos),
        this.followPointer &&
          h &&
          (h.chartX === te && (h = y.pointer.normalize(h)),
          (c = [h.chartX - y.plotLeft, h.chartY - b])),
        c ||
          (Mi(a, function (a) {
            (g = a.series.yAxis),
              (k += a.plotX),
              (w +=
                (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) +
                (!v && g ? g.top - b : 0));
          }),
          (k /= a.length),
          (w /= a.length),
          (c = [
            v ? y.plotWidth - w : k,
            this.shared && !v && a.length > 1 && h
              ? h.chartY - b
              : v
              ? y.plotHeight - k
              : w,
          ])),
        Bi(c, Be)
      );
    },
    getPosition: function (a, h, c) {
      var g,
        y = this.chart,
        v = this.distance,
        b = {},
        k = ["y", y.chartHeight, h, c.plotY + y.plotTop],
        w = ["x", y.chartWidth, a, c.plotX + y.plotLeft],
        S =
          c.ttBelow ||
          (y.inverted && !c.negative) ||
          (!y.inverted && c.negative),
        T = function (a, h, c, g) {
          var y = g - v > c,
            k = h > g + v + c,
            w = g - v - c,
            T = g + v;
          if (S && k) b[a] = T;
          else if (!S && y) b[a] = w;
          else if (y) b[a] = w;
          else {
            if (!k) return !1;
            b[a] = T;
          }
        },
        P = function (a, h, c, g) {
          return v > g || g > h - v
            ? !1
            : void (b[a] =
                c / 2 > g ? 1 : g > h - c / 2 ? h - c - 2 : g - c / 2);
        },
        A = function (a) {
          var h = k;
          (k = w), (w = h), (g = a);
        },
        C = function () {
          T.apply(0, k) !== !1
            ? P.apply(0, w) !== !1 || g || (A(!0), C())
            : g
            ? (b.x = b.y = 0)
            : (A(!0), C());
        };
      return (y.inverted || this.len > 1) && A(), C(), b;
    },
    defaultFormatter: function (a) {
      var s,
        h = this.points || A(this),
        c = h[0].series;
      return (
        (s = [a.tooltipHeaderFormatter(h[0])]),
        Mi(h, function (a) {
          (c = a.series),
            s.push(
              (c.tooltipFormatter && c.tooltipFormatter(a)) ||
                a.point.tooltipFormatter(c.tooltipOptions.pointFormat)
            );
        }),
        s.push(a.options.footerFormat || ""),
        s.join("")
      );
    },
    refresh: function (a, h) {
      var x,
        c,
        g,
        y,
        v,
        b,
        k = this,
        w = k.chart,
        S = k.label,
        T = k.options,
        P = {},
        L = [],
        M = T.formatter || k.defaultFormatter,
        D = w.hoverPoints,
        I = k.shared;
      clearTimeout(this.hideTimer),
        (k.followPointer = A(a)[0].series.tooltipOptions.followPointer),
        (g = k.getAnchor(a, h)),
        (x = g[0]),
        (c = g[1]),
        !I || (a.series && a.series.noSharedTooltip)
          ? (P = a.getLabelConfig())
          : ((w.hoverPoints = a),
            D &&
              Mi(D, function (a) {
                a.setState();
              }),
            Mi(a, function (a) {
              a.setState(bi), L.push(a.getLabelConfig());
            }),
            (P = { x: a[0].category, y: a[0].y }),
            (P.points = L),
            (this.len = L.length),
            (a = a[0])),
        (y = M.call(P, k)),
        (b = a.series),
        (this.distance = C(b.tooltipOptions.distance, 16)),
        y === !1
          ? this.hide()
          : (k.isHidden && (Ei(S), S.attr("opacity", 1).show()),
            S.attr({ text: y }),
            (v = T.borderColor || a.color || b.color || "#606060"),
            S.attr({ stroke: v }),
            k.updatePosition({
              plotX: x,
              plotY: c,
              negative: a.negative,
              ttBelow: a.ttBelow,
            }),
            (this.isHidden = !1)),
        Ri(w, "tooltipRefresh", {
          text: y,
          x: x + w.plotLeft,
          y: c + w.plotTop,
          borderColor: v,
        });
    },
    updatePosition: function (a) {
      var h = this.chart,
        c = this.label,
        g = (this.options.positioner || this.getPosition).call(
          this,
          c.width,
          c.height,
          a
        );
      this.move(Be(g.x), Be(g.y), a.plotX + h.plotLeft, a.plotY + h.plotTop);
    },
    tooltipHeaderFormatter: function (a) {
      var n,
        h = a.series,
        c = h.tooltipOptions,
        g = c.dateTimeLabelFormats,
        y = c.xDateFormat,
        v = h.xAxis,
        k = v && "datetime" === v.options.type && b(a.key),
        w = c.headerFormat,
        S = v && v.closestPointRange;
      if (k && !y) {
        if (S) {
          for (n in pe)
            if (pe[n] >= S || (pe[n] <= pe.day && a.key % pe[n] > 0)) {
              y = g[n];
              break;
            }
        } else y = g.day;
        y = y || g.year;
      }
      return (
        k && y && (w = w.replace("{point.key}", "{point.key:" + y + "}")),
        R(w, { point: a, series: h })
      );
    },
  };
  var Qi;
  ie = Me.documentElement.ontouchstart !== te;
  var tn = (Le.Pointer = function (a, h) {
    this.init(a, h);
  });
  if (
    ((tn.prototype = {
      init: function (a, h) {
        var c,
          g,
          y = h.chart,
          v = y.events,
          b = Je ? "" : y.zoomType,
          k = a.inverted;
        (this.options = h),
          (this.chart = a),
          (this.zoomX = c = /x/.test(b)),
          (this.zoomY = g = /y/.test(b)),
          (this.zoomHor = (c && !k) || (g && k)),
          (this.zoomVert = (g && !k) || (c && k)),
          (this.hasZoom = c || g),
          (this.runChartClick = v && !!v.click),
          (this.pinchDown = []),
          (this.lastValidTouch = {}),
          Le.Tooltip &&
            h.tooltip.enabled &&
            ((a.tooltip = new Ji(a, h.tooltip)),
            (this.followTouchMove = h.tooltip.followTouchMove)),
          this.setDOMEvents();
      },
      normalize: function (e, h) {
        var c, g, y;
        return (
          (e = e || window.event),
          (e = Hi(e)),
          e.target || (e.target = e.srcElement),
          (y = e.touches
            ? e.touches.length
              ? e.touches.item(0)
              : e.changedTouches[0]
            : e),
          h || (this.chartPosition = h = Ii(this.chart.container)),
          y.pageX === te
            ? ((c = Re(e.x, e.clientX - h.left)), (g = e.y))
            : ((c = y.pageX - h.left), (g = y.pageY - h.top)),
          a(e, { chartX: Be(c), chartY: Be(g) })
        );
      },
      getCoordinates: function (e) {
        var a = { xAxis: [], yAxis: [] };
        return (
          Mi(this.chart.axes, function (h) {
            a[h.isXAxis ? "xAxis" : "yAxis"].push({
              axis: h,
              value: h.toValue(e[h.horiz ? "chartX" : "chartY"]),
            });
          }),
          a
        );
      },
      getIndex: function (e) {
        var a = this.chart;
        return a.inverted
          ? a.plotHeight + a.plotTop - e.chartY
          : e.chartX - a.plotLeft;
      },
      runPointActions: function (e) {
        var a,
          h,
          c,
          i,
          g,
          y,
          v = this,
          b = v.chart,
          k = b.series,
          w = b.tooltip,
          S = b.hoverPoint,
          T = b.hoverSeries,
          P = b.chartWidth,
          A = v.getIndex(e);
        if (w && v.options.tooltip.shared && (!T || !T.noSharedTooltip)) {
          for (c = [], i = k.length, g = 0; i > g; g++)
            k[g].visible &&
              k[g].options.enableMouseTracking !== !1 &&
              !k[g].noSharedTooltip &&
              k[g].singularTooltips !== !0 &&
              k[g].tooltipPoints.length &&
              ((h = k[g].tooltipPoints[A]),
              h &&
                h.series &&
                ((h._dist = Xe(A - h.clientX)),
                (P = He(P, h._dist)),
                c.push(h)));
          for (i = c.length; i--; ) c[i]._dist > P && c.splice(i, 1);
          c.length &&
            c[0].clientX !== v.hoverX &&
            (w.refresh(c, e), (v.hoverX = c[0].clientX));
        }
        (a = T && T.tooltipOptions.followPointer),
          T && T.tracker && !a
            ? ((h = T.tooltipPoints[A]), h && h !== S && h.onMouseOver(e))
            : w &&
              a &&
              !w.isHidden &&
              ((y = w.getAnchor([{}], e)),
              w.updatePosition({ plotX: y[0], plotY: y[1] })),
          w &&
            !v._onDocumentMouseMove &&
            ((v._onDocumentMouseMove = function (e) {
              ii[Qi] && ii[Qi].pointer.onDocumentMouseMove(e);
            }),
            Oi(Me, "mousemove", v._onDocumentMouseMove)),
          Mi(b.axes, function (a) {
            a.drawCrosshair(e, C(h, S));
          });
      },
      reset: function (a) {
        var h = this,
          c = h.chart,
          g = c.hoverSeries,
          y = c.hoverPoint,
          v = c.tooltip,
          b = v && v.shared ? c.hoverPoints : y;
        (a = a && v && b),
          a && A(b)[0].plotX === te && (a = !1),
          a
            ? (v.refresh(b), y && y.setState(y.state, !0))
            : (y && y.onMouseOut(),
              g && g.onMouseOut(),
              v && v.hide(),
              h._onDocumentMouseMove &&
                (zi(Me, "mousemove", h._onDocumentMouseMove),
                (h._onDocumentMouseMove = null)),
              Mi(c.axes, function (a) {
                a.hideCrosshair();
              }),
              (h.hoverX = null));
      },
      scaleGroups: function (a, h) {
        var c,
          g = this.chart;
        Mi(g.series, function (y) {
          (c = a || y.getPlotBox()),
            y.xAxis &&
              y.xAxis.zoomEnabled &&
              (y.group.attr(c),
              y.markerGroup &&
                (y.markerGroup.attr(c),
                y.markerGroup.clip(h ? g.clipRect : null)),
              y.dataLabelsGroup && y.dataLabelsGroup.attr(c));
        }),
          g.clipRect.attr(h || g.clipBox);
      },
      dragStart: function (e) {
        var a = this.chart;
        (a.mouseIsDown = e.type),
          (a.cancelClick = !1),
          (a.mouseDownX = this.mouseDownX = e.chartX),
          (a.mouseDownY = this.mouseDownY = e.chartY);
      },
      drag: function (e) {
        var a,
          h,
          c = this.chart,
          g = c.options.chart,
          y = e.chartX,
          v = e.chartY,
          b = this.zoomHor,
          k = this.zoomVert,
          w = c.plotLeft,
          S = c.plotTop,
          T = c.plotWidth,
          P = c.plotHeight,
          A = this.mouseDownX,
          C = this.mouseDownY,
          L = g.panKey && e[g.panKey + "Key"];
        w > y ? (y = w) : y > w + T && (y = w + T),
          S > v ? (v = S) : v > S + P && (v = S + P),
          (this.hasDragged = Math.sqrt(
            Math.pow(A - y, 2) + Math.pow(C - v, 2)
          )),
          this.hasDragged > 10 &&
            ((a = c.isInsidePlot(A - w, C - S)),
            c.hasCartesianSeries &&
              (this.zoomX || this.zoomY) &&
              a &&
              !L &&
              (this.selectionMarker ||
                (this.selectionMarker = c.renderer
                  .rect(w, S, b ? 1 : T, k ? 1 : P, 0)
                  .attr({
                    fill: g.selectionMarkerFill || "rgba(69,114,167,0.25)",
                    zIndex: 7,
                  })
                  .add())),
            this.selectionMarker &&
              b &&
              ((h = y - A),
              this.selectionMarker.attr({
                width: Xe(h),
                x: (h > 0 ? 0 : h) + A,
              })),
            this.selectionMarker &&
              k &&
              ((h = v - C),
              this.selectionMarker.attr({
                height: Xe(h),
                y: (h > 0 ? 0 : h) + C,
              })),
            a && !this.selectionMarker && g.panning && c.pan(e, g.panning));
      },
      drop: function (e) {
        var h = this.chart,
          c = this.hasPinched;
        if (this.selectionMarker) {
          var g,
            y = { xAxis: [], yAxis: [], originalEvent: e.originalEvent || e },
            v = this.selectionMarker,
            b = v.attr ? v.attr("x") : v.x,
            k = v.attr ? v.attr("y") : v.y,
            w = v.attr ? v.attr("width") : v.width,
            S = v.attr ? v.attr("height") : v.height;
          (this.hasDragged || c) &&
            (Mi(h.axes, function (a) {
              if (a.zoomEnabled) {
                var h = a.horiz,
                  c = "touchend" === e.type ? a.minPixelPadding : 0,
                  v = a.toValue((h ? b : k) + c),
                  T = a.toValue((h ? b + w : k + S) - c);
                isNaN(v) ||
                  isNaN(T) ||
                  (y[a.coll].push({ axis: a, min: He(v, T), max: Re(v, T) }),
                  (g = !0));
              }
            }),
            g &&
              Ri(h, "selection", y, function (g) {
                h.zoom(a(g, c ? { animation: !1 } : null));
              })),
            (this.selectionMarker = this.selectionMarker.destroy()),
            c && this.scaleGroups();
        }
        h &&
          (L(h.container, { cursor: h._cursor }),
          (h.cancelClick = this.hasDragged > 10),
          (h.mouseIsDown = this.hasDragged = this.hasPinched = !1),
          (this.pinchDown = []));
      },
      onContainerMouseDown: function (e) {
        (e = this.normalize(e)),
          e.preventDefault && e.preventDefault(),
          this.dragStart(e);
      },
      onDocumentMouseUp: function (e) {
        ii[Qi] && ii[Qi].pointer.drop(e);
      },
      onDocumentMouseMove: function (e) {
        var a = this.chart,
          h = this.chartPosition,
          c = a.hoverSeries;
        (e = this.normalize(e, h)),
          h &&
            c &&
            !this.inClass(e.target, "highcharts-tracker") &&
            !a.isInsidePlot(e.chartX - a.plotLeft, e.chartY - a.plotTop) &&
            this.reset();
      },
      onContainerMouseLeave: function () {
        var a = ii[Qi];
        a && (a.pointer.reset(), (a.pointer.chartPosition = null));
      },
      onContainerMouseMove: function (e) {
        var a = this.chart;
        (Qi = a.index),
          (e = this.normalize(e)),
          (e.returnValue = !1),
          "mousedown" === a.mouseIsDown && this.drag(e),
          (!this.inClass(e.target, "highcharts-tracker") &&
            !a.isInsidePlot(e.chartX - a.plotLeft, e.chartY - a.plotTop)) ||
            a.openMenu ||
            this.runPointActions(e);
      },
      inClass: function (a, h) {
        for (var c; a; ) {
          if ((c = P(a, "class"))) {
            if (-1 !== c.indexOf(h)) return !0;
            if (-1 !== c.indexOf(ci + "container")) return !1;
          }
          a = a.parentNode;
        }
      },
      onTrackerMouseOut: function (e) {
        var a = this.chart.hoverSeries,
          h = e.relatedTarget || e.toElement,
          c = h && h.point && h.point.series;
        !a ||
          a.options.stickyTracking ||
          this.inClass(h, ci + "tooltip") ||
          c === a ||
          a.onMouseOut();
      },
      onContainerClick: function (e) {
        var h = this.chart,
          c = h.hoverPoint,
          g = h.plotLeft,
          y = h.plotTop;
        (e = this.normalize(e)),
          (e.cancelBubble = !0),
          h.cancelClick ||
            (c && this.inClass(e.target, ci + "tracker")
              ? (Ri(c.series, "click", a(e, { point: c })),
                h.hoverPoint && c.firePointEvent("click", e))
              : (a(e, this.getCoordinates(e)),
                h.isInsidePlot(e.chartX - g, e.chartY - y) &&
                  Ri(h, "click", e)));
      },
      setDOMEvents: function () {
        var a = this,
          h = a.chart.container;
        (h.onmousedown = function (e) {
          a.onContainerMouseDown(e);
        }),
          (h.onmousemove = function (e) {
            a.onContainerMouseMove(e);
          }),
          (h.onclick = function (e) {
            a.onContainerClick(e);
          }),
          Oi(h, "mouseleave", a.onContainerMouseLeave),
          1 === ni && Oi(Me, "mouseup", a.onDocumentMouseUp),
          ie &&
            ((h.ontouchstart = function (e) {
              a.onContainerTouchStart(e);
            }),
            (h.ontouchmove = function (e) {
              a.onContainerTouchMove(e);
            }),
            1 === ni && Oi(Me, "touchend", a.onDocumentTouchEnd));
      },
      destroy: function () {
        var a;
        zi(this.chart.container, "mouseleave", this.onContainerMouseLeave),
          ni ||
            (zi(Me, "mouseup", this.onDocumentMouseUp),
            zi(Me, "touchend", this.onDocumentTouchEnd)),
          clearInterval(this.tooltipTimeout);
        for (a in this) this[a] = null;
      },
    }),
    a(Le.Pointer.prototype, {
      pinchTranslate: function (a, h, c, g, y, v) {
        (this.zoomHor || this.pinchHor) &&
          this.pinchTranslateDirection(!0, a, h, c, g, y, v),
          (this.zoomVert || this.pinchVert) &&
            this.pinchTranslateDirection(!1, a, h, c, g, y, v);
      },
      pinchTranslateDirection: function (a, h, c, g, y, v, b, k) {
        var w,
          S,
          T,
          P,
          A,
          C,
          L = this.chart,
          M = a ? "x" : "y",
          D = a ? "X" : "Y",
          I = "chart" + D,
          B = a ? "width" : "height",
          O = L["plot" + (a ? "Left" : "Top")],
          z = k || 1,
          R = L.inverted,
          H = L.bounds[a ? "h" : "v"],
          X = 1 === h.length,
          E = h[0][I],
          G = c[0][I],
          W = !X && h[1][I],
          Y = !X && c[1][I],
          N = function () {
            !X && Xe(E - W) > 20 && (z = k || Xe(G - Y) / Xe(E - W)),
              (T = (O - G) / z + E),
              (w = L["plot" + (a ? "Width" : "Height")] / z);
          };
        N(),
          (S = T),
          S < H.min
            ? ((S = H.min), (P = !0))
            : S + w > H.max && ((S = H.max - w), (P = !0)),
          P
            ? ((G -= 0.8 * (G - b[M][0])), X || (Y -= 0.8 * (Y - b[M][1])), N())
            : (b[M] = [G, Y]),
          R || ((v[M] = T - O), (v[B] = w)),
          (C = R ? (a ? "scaleY" : "scaleX") : "scale" + D),
          (A = R ? 1 / z : z),
          (y[B] = w),
          (y[M] = S),
          (g[C] = z),
          (g["translate" + D] = A * O + (G - A * E));
      },
      pinch: function (e) {
        var h = this,
          c = h.chart,
          g = h.pinchDown,
          y = h.followTouchMove,
          v = e.touches,
          b = v.length,
          k = h.lastValidTouch,
          w = h.hasZoom,
          S = h.selectionMarker,
          T = {},
          P =
            1 === b &&
            ((h.inClass(e.target, ci + "tracker") && c.runTrackerClick) ||
              c.runChartClick),
          A = {};
        (!w && !y) || P || e.preventDefault(),
          Bi(v, function (e) {
            return h.normalize(e);
          }),
          "touchstart" === e.type
            ? (Mi(v, function (e, i) {
                g[i] = { chartX: e.chartX, chartY: e.chartY };
              }),
              (k.x = [g[0].chartX, g[1] && g[1].chartX]),
              (k.y = [g[0].chartY, g[1] && g[1].chartY]),
              Mi(c.axes, function (a) {
                if (a.zoomEnabled) {
                  var h = c.bounds[a.horiz ? "h" : "v"],
                    g = a.minPixelPadding,
                    y = a.toPixels(C(a.options.min, a.dataMin)),
                    v = a.toPixels(C(a.options.max, a.dataMax)),
                    b = He(y, v),
                    k = Re(y, v);
                  (h.min = He(a.pos, b - g)),
                    (h.max = Re(a.pos + a.len, k + g));
                }
              }))
            : g.length &&
              (S || (h.selectionMarker = S = a({ destroy: ei }, c.plotBox)),
              h.pinchTranslate(g, v, T, S, A, k),
              (h.hasPinched = w),
              h.scaleGroups(T, A),
              !w && y && 1 === b && this.runPointActions(h.normalize(e)));
      },
      onContainerTouchStart: function (e) {
        var a = this.chart;
        (Qi = a.index),
          1 === e.touches.length
            ? ((e = this.normalize(e)),
              a.isInsidePlot(e.chartX - a.plotLeft, e.chartY - a.plotTop)
                ? (this.runPointActions(e), this.pinch(e))
                : this.reset())
            : 2 === e.touches.length && this.pinch(e);
      },
      onContainerTouchMove: function (e) {
        (1 === e.touches.length || 2 === e.touches.length) && this.pinch(e);
      },
      onDocumentTouchEnd: function (e) {
        ii[Qi] && ii[Qi].pointer.drop(e);
      },
    }),
    De.PointerEvent || De.MSPointerEvent)
  ) {
    var en = {},
      nn = !!De.PointerEvent,
      on = function () {
        var a,
          h = [];
        h.item = function (i) {
          return this[i];
        };
        for (a in en)
          en.hasOwnProperty(a) &&
            h.push({
              pageX: en[a].pageX,
              pageY: en[a].pageY,
              target: en[a].target,
            });
        return h;
      },
      rn = function (e, a, h, c) {
        var p;
        (e = e.originalEvent || e),
          ("touch" !== e.pointerType &&
            e.pointerType !== e.MSPOINTER_TYPE_TOUCH) ||
            !ii[Qi] ||
            (c(e),
            (p = ii[Qi].pointer),
            p[a]({
              type: h,
              target: e.currentTarget,
              preventDefault: ei,
              touches: on(),
            }));
      };
    a(tn.prototype, {
      onContainerPointerDown: function (e) {
        rn(e, "onContainerTouchStart", "touchstart", function (e) {
          en[e.pointerId] = {
            pageX: e.pageX,
            pageY: e.pageY,
            target: e.currentTarget,
          };
        });
      },
      onContainerPointerMove: function (e) {
        rn(e, "onContainerTouchMove", "touchmove", function (e) {
          (en[e.pointerId] = { pageX: e.pageX, pageY: e.pageY }),
            en[e.pointerId].target ||
              (en[e.pointerId].target = e.currentTarget);
        });
      },
      onDocumentPointerUp: function (e) {
        rn(e, "onContainerTouchEnd", "touchend", function (e) {
          delete en[e.pointerId];
        });
      },
      batchMSEvents: function (a) {
        a(
          this.chart.container,
          nn ? "pointerdown" : "MSPointerDown",
          this.onContainerPointerDown
        ),
          a(
            this.chart.container,
            nn ? "pointermove" : "MSPointerMove",
            this.onContainerPointerMove
          ),
          a(Me, nn ? "pointerup" : "MSPointerUp", this.onDocumentPointerUp);
      },
    }),
      O(tn.prototype, "init", function (a, h, c) {
        a.call(this, h, c),
          (this.hasZoom || this.followTouchMove) &&
            L(h.container, { "-ms-touch-action": gi, "touch-action": gi });
      }),
      O(tn.prototype, "setDOMEvents", function (a) {
        a.apply(this),
          (this.hasZoom || this.followTouchMove) && this.batchMSEvents(Oi);
      }),
      O(tn.prototype, "destroy", function (a) {
        this.batchMSEvents(zi), a.call(this);
      });
  }
  var sn = (Le.Legend = function (a, h) {
    this.init(a, h);
  });
  sn.prototype = {
    init: function (a, c) {
      var g = this,
        y = c.itemStyle,
        v = C(c.padding, 8),
        b = c.itemMarginTop || 0;
      (this.options = c),
        c.enabled &&
          ((g.itemStyle = y),
          (g.itemHiddenStyle = h(y, c.itemHiddenStyle)),
          (g.itemMarginTop = b),
          (g.padding = v),
          (g.initialItemX = v),
          (g.initialItemY = v - 5),
          (g.maxItemWidth = 0),
          (g.chart = a),
          (g.itemHeight = 0),
          (g.lastLineHeight = 0),
          (g.symbolWidth = C(c.symbolWidth, 16)),
          (g.pages = []),
          g.render(),
          Oi(g.chart, "endResize", function () {
            g.positionCheckboxes();
          }));
    },
    colorizeItem: function (a, h) {
      var c,
        g,
        y = this,
        v = y.options,
        b = a.legendItem,
        k = a.legendLine,
        w = a.legendSymbol,
        S = y.itemHiddenStyle.color,
        T = h ? v.itemStyle.color : S,
        P = h ? a.legendColor || a.color || "#CCC" : S,
        A = a.options && a.options.marker,
        C = { fill: P };
      if ((b && b.css({ fill: T, color: T }), k && k.attr({ stroke: P }), w)) {
        if (A && w.isMarker) {
          (C.stroke = P), (A = a.convertAttribs(A));
          for (c in A) (g = A[c]), g !== te && (C[c] = g);
        }
        w.attr(C);
      }
    },
    positionItem: function (a) {
      var h = this,
        c = h.options,
        g = c.symbolPadding,
        y = !c.rtl,
        v = a._legendItemPos,
        b = v[0],
        k = v[1],
        w = a.checkbox;
      a.legendGroup &&
        a.legendGroup.translate(y ? b : h.legendWidth - b - 2 * g - 4, k),
        w && ((w.x = b), (w.y = k));
    },
    destroyItem: function (a) {
      var h = a.checkbox;
      Mi(
        ["legendItem", "legendLine", "legendSymbol", "legendGroup"],
        function (h) {
          a[h] && (a[h] = a[h].destroy());
        }
      ),
        h && N(a.checkbox);
    },
    destroy: function () {
      var a = this,
        h = a.group,
        c = a.box;
      c && (a.box = c.destroy()), h && (a.group = h.destroy());
    },
    positionCheckboxes: function (a) {
      var h,
        c = this.group.alignAttr,
        g = this.clipHeight || this.legendHeight;
      c &&
        ((h = c.translateY),
        Mi(this.allItems, function (y) {
          var v,
            b = y.checkbox;
          b &&
            ((v = h + b.y + (a || 0) + 3),
            L(b, {
              left: c.translateX + y.checkboxOffset + b.x - 20 + pi,
              top: v + pi,
              display: v > h - 6 && h + g - 6 > v ? "" : gi,
            }));
        }));
    },
    renderTitle: function () {
      var a,
        h = this.options,
        c = this.padding,
        g = h.title,
        y = 0;
      g.text &&
        (this.title ||
          (this.title = this.chart.renderer
            .label(
              g.text,
              c - 3,
              c - 4,
              null,
              null,
              null,
              null,
              null,
              "legend-title"
            )
            .attr({ zIndex: 1 })
            .css(g.style)
            .add(this.group)),
        (a = this.title.getBBox()),
        (y = a.height),
        (this.offsetWidth = a.width),
        this.contentGroup.attr({ translateY: y })),
        (this.titleHeight = y);
    },
    renderItem: function (a) {
      var c,
        g,
        y,
        v = this,
        b = v.chart,
        k = b.renderer,
        w = v.options,
        S = "horizontal" === w.layout,
        T = v.symbolWidth,
        P = w.symbolPadding,
        A = v.itemStyle,
        L = v.itemHiddenStyle,
        M = v.padding,
        D = S ? C(w.itemDistance, 20) : 0,
        I = !w.rtl,
        B = w.width,
        O = w.itemMarginBottom || 0,
        z = v.itemMarginTop,
        H = v.initialItemX,
        X = a.legendItem,
        E = a.series && a.series.drawLegendSymbol ? a.series : a,
        G = E.options,
        W = v.createCheckboxForItem && G && G.showCheckbox,
        Y = w.useHTML;
      X ||
        ((a.legendGroup = k
          .g("legend-item")
          .attr({ zIndex: 1 })
          .add(v.scrollGroup)),
        (a.legendItem = X =
          k
            .text(
              w.labelFormat ? R(w.labelFormat, a) : w.labelFormatter.call(a),
              I ? T + P : -P,
              v.baseline || 0,
              Y
            )
            .css(h(a.visible ? A : L))
            .attr({ align: I ? "left" : "right", zIndex: 2 })
            .add(a.legendGroup)),
        v.baseline ||
          ((v.baseline = k.fontMetrics(A.fontSize, X).f + 3 + z),
          X.attr("y", v.baseline)),
        E.drawLegendSymbol(v, a),
        v.setItemEvents && v.setItemEvents(a, X, Y, A, L),
        v.colorizeItem(a, a.visible),
        W && v.createCheckboxForItem(a)),
        (g = X.getBBox()),
        (y = a.checkboxOffset =
          w.itemWidth ||
          a.legendItemWidth ||
          T + P + g.width + D + (W ? 20 : 0)),
        (v.itemHeight = c = Be(a.legendItemHeight || g.height)),
        S &&
          v.itemX - H + y > (B || b.chartWidth - 2 * M - H - w.x) &&
          ((v.itemX = H),
          (v.itemY += z + v.lastLineHeight + O),
          (v.lastLineHeight = 0)),
        (v.maxItemWidth = Re(v.maxItemWidth, y)),
        (v.lastItemY = z + v.itemY + O),
        (v.lastLineHeight = Re(c, v.lastLineHeight)),
        (a._legendItemPos = [v.itemX, v.itemY]),
        S ? (v.itemX += y) : ((v.itemY += z + c + O), (v.lastLineHeight = c)),
        (v.offsetWidth = B || Re((S ? v.itemX - H - D : y) + M, v.offsetWidth));
    },
    getAllItems: function () {
      var a = [];
      return (
        Mi(this.chart.series, function (h) {
          var c = h.options;
          C(c.showInLegend, T(c.linkedTo) ? !1 : te, !0) &&
            (a = a.concat(
              h.legendItems || ("point" === c.legendType ? h.data : h)
            ));
        }),
        a
      );
    },
    render: function () {
      var h,
        c,
        g,
        y,
        v = this,
        b = v.chart,
        k = b.renderer,
        w = v.group,
        S = v.box,
        T = v.options,
        P = v.padding,
        A = T.borderWidth,
        C = T.backgroundColor;
      (v.itemX = v.initialItemX),
        (v.itemY = v.initialItemY),
        (v.offsetWidth = 0),
        (v.lastItemY = 0),
        w ||
          ((v.group = w = k.g("legend").attr({ zIndex: 7 }).add()),
          (v.contentGroup = k.g().attr({ zIndex: 1 }).add(w)),
          (v.scrollGroup = k.g().add(v.contentGroup))),
        v.renderTitle(),
        (h = v.getAllItems()),
        E(h, function (a, h) {
          return (
            ((a.options && a.options.legendIndex) || 0) -
            ((h.options && h.options.legendIndex) || 0)
          );
        }),
        T.reversed && h.reverse(),
        (v.allItems = h),
        (v.display = c = !!h.length),
        Mi(h, function (a) {
          v.renderItem(a);
        }),
        (g = T.width || v.offsetWidth),
        (y = v.lastItemY + v.lastLineHeight + v.titleHeight),
        (y = v.handleOverflow(y)),
        (A || C) &&
          ((g += P),
          (y += P),
          S
            ? g > 0 &&
              y > 0 &&
              (S[S.isNew ? "attr" : "animate"](
                S.crisp({ width: g, height: y })
              ),
              (S.isNew = !1))
            : ((v.box = S =
                k
                  .rect(0, 0, g, y, T.borderRadius, A || 0)
                  .attr({
                    stroke: T.borderColor,
                    "stroke-width": A || 0,
                    fill: C || gi,
                  })
                  .add(w)
                  .shadow(T.shadow)),
              (S.isNew = !0)),
          S[c ? "show" : "hide"]()),
        (v.legendWidth = g),
        (v.legendHeight = y),
        Mi(h, function (a) {
          v.positionItem(a);
        }),
        c && w.align(a({ width: g, height: y }, T), !0, "spacingBox"),
        b.isResizing || this.positionCheckboxes();
    },
    handleOverflow: function (a) {
      var h,
        c,
        g = this,
        y = this.chart,
        v = y.renderer,
        b = this.options,
        k = b.y,
        w = "top" === b.verticalAlign,
        S = y.spacingBox.height + (w ? -k : k) - this.padding,
        T = b.maxHeight,
        P = this.clipRect,
        A = b.navigation,
        L = C(A.animation, !0),
        M = A.arrowSize || 12,
        D = this.nav,
        I = this.pages,
        B = this.allItems;
      return (
        "horizontal" === b.layout && (S /= 2),
        T && (S = He(S, T)),
        (I.length = 0),
        a > S && !b.useHTML
          ? ((this.clipHeight = h =
              Re(S - 20 - this.titleHeight - this.padding, 0)),
            (this.currentPage = C(this.currentPage, 1)),
            (this.fullHeight = a),
            Mi(B, function (a, i) {
              var g = a._legendItemPos[1],
                y = Be(a.legendItem.getBBox().height),
                v = I.length;
              (!v || (g - I[v - 1] > h && (c || g) !== I[v - 1])) &&
                (I.push(c || g), v++),
                i === B.length - 1 && g + y - I[v - 1] > h && I.push(g),
                g !== c && (c = g);
            }),
            P ||
              ((P = g.clipRect = v.clipRect(0, this.padding, 9999, 0)),
              g.contentGroup.clip(P)),
            P.attr({ height: h }),
            D ||
              ((this.nav = D = v.g().attr({ zIndex: 1 }).add(this.group)),
              (this.up = v
                .symbol("triangle", 0, 0, M, M)
                .on("click", function () {
                  g.scroll(-1, L);
                })
                .add(D)),
              (this.pager = v.text("", 15, 10).css(A.style).add(D)),
              (this.down = v
                .symbol("triangle-down", 0, 0, M, M)
                .on("click", function () {
                  g.scroll(1, L);
                })
                .add(D))),
            g.scroll(0),
            (a = S))
          : D &&
            (P.attr({ height: y.chartHeight }),
            D.hide(),
            this.scrollGroup.attr({ translateY: 1 }),
            (this.clipHeight = 0)),
        a
      );
    },
    scroll: function (a, h) {
      var c,
        g = this.pages,
        y = g.length,
        v = this.currentPage + a,
        b = this.clipHeight,
        k = this.options.navigation,
        w = k.activeColor,
        S = k.inactiveColor,
        T = this.pager,
        P = this.padding;
      v > y && (v = y),
        v > 0 &&
          (h !== te && j(h, this.chart),
          this.nav.attr({
            translateX: P,
            translateY: b + this.padding + 7 + this.titleHeight,
            visibility: di,
          }),
          this.up
            .attr({ fill: 1 === v ? S : w })
            .css({ cursor: 1 === v ? "default" : "pointer" }),
          T.attr({ text: v + "/" + y }),
          this.down
            .attr({ x: 18 + this.pager.getBBox().width, fill: v === y ? S : w })
            .css({ cursor: v === y ? "default" : "pointer" }),
          (c = -g[v - 1] + this.initialItemY),
          this.scrollGroup.animate({ translateY: c }),
          (this.currentPage = v),
          this.positionCheckboxes(c));
    },
  };
  var an = (Le.LegendSymbolMixin = {
    drawRectangle: function (a, h) {
      var c = a.options.symbolHeight || 12;
      h.legendSymbol = this.chart.renderer
        .rect(
          0,
          a.baseline - 5 - c / 2,
          a.symbolWidth,
          c,
          a.options.symbolRadius || 0
        )
        .attr({ zIndex: 3 })
        .add(h.legendGroup);
    },
    drawLineMarker: function (a) {
      var h,
        c,
        g,
        y = this.options,
        v = y.marker,
        b = a.options,
        k = a.symbolWidth,
        w = this.chart.renderer,
        S = this.legendGroup,
        T =
          a.baseline -
          Be(0.3 * w.fontMetrics(b.itemStyle.fontSize, this.legendItem).b);
      y.lineWidth &&
        ((g = { "stroke-width": y.lineWidth }),
        y.dashStyle && (g.dashstyle = y.dashStyle),
        (this.legendLine = w.path([mi, 0, T, yi, k, T]).attr(g).add(S))),
        v &&
          v.enabled !== !1 &&
          ((h = v.radius),
          (this.legendSymbol = c =
            w.symbol(this.symbol, k / 2 - h, T - h, 2 * h, 2 * h).add(S)),
          (c.isMarker = !0));
    },
  });
  (/Trident\/7\.0/.test(Ne) || Ue) &&
    O(sn.prototype, "positionItem", function (a, h) {
      var c = this,
        g = function () {
          h._legendItemPos && a.call(c, h);
        };
      g(), setTimeout(g);
    }),
    (J.prototype = {
      init: function (a, c) {
        var g,
          y = a.series;
        (a.series = null),
          (g = h(se, a)),
          (g.series = a.series = y),
          (this.userOptions = a);
        var v = g.chart;
        (this.margin = this.splashArray("margin", v)),
          (this.spacing = this.splashArray("spacing", v));
        var b = v.events;
        (this.bounds = { h: {}, v: {} }),
          (this.callback = c),
          (this.isResizing = 0),
          (this.options = g),
          (this.axes = []),
          (this.series = []),
          (this.hasCartesianSeries = v.showAxes);
        var k,
          w = this;
        if (
          ((w.index = ii.length),
          ii.push(w),
          ni++,
          v.reflow !== !1 &&
            Oi(w, "load", function () {
              w.initReflow();
            }),
          b)
        )
          for (k in b) Oi(w, k, b[k]);
        (w.xAxis = []),
          (w.yAxis = []),
          (w.animation = Je ? !1 : C(v.animation, !0)),
          (w.pointCount = w.colorCounter = w.symbolCounter = 0),
          w.firstRender();
      },
      initSeries: function (a) {
        var h,
          c = this,
          g = c.options.chart,
          y = a.type || g.type || g.defaultSeriesType,
          v = Si[y];
        return v || ue(17, !0), (h = new v()), h.init(this, a), h;
      },
      isInsidePlot: function (a, h, c) {
        var x = c ? h : a,
          g = c ? a : h;
        return x >= 0 && x <= this.plotWidth && g >= 0 && g <= this.plotHeight;
      },
      adjustTickAmounts: function () {
        this.options.chart.alignTicks !== !1 &&
          Mi(this.axes, function (a) {
            a.adjustTickAmount();
          }),
          (this.maxTicks = null);
      },
      redraw: function (h) {
        var c,
          g,
          y,
          v = this,
          b = v.axes,
          k = v.series,
          w = v.pointer,
          S = v.legend,
          T = v.isDirtyLegend,
          P = v.hasCartesianSeries,
          A = v.isDirtyBox,
          C = k.length,
          i = C,
          L = v.renderer,
          M = L.isHidden(),
          D = [];
        for (j(h, v), M && v.cloneRenderTo(), v.layOutTitles(); i--; )
          if (((y = k[i]), y.options.stacking && ((c = !0), y.isDirty))) {
            g = !0;
            break;
          }
        if (g)
          for (i = C; i--; ) (y = k[i]), y.options.stacking && (y.isDirty = !0);
        Mi(k, function (a) {
          a.isDirty && "point" === a.options.legendType && (T = !0);
        }),
          T && S.options.enabled && (S.render(), (v.isDirtyLegend = !1)),
          c && v.getStacks(),
          P &&
            (v.isResizing ||
              ((v.maxTicks = null),
              Mi(b, function (a) {
                a.setScale();
              })),
            v.adjustTickAmounts()),
          v.getMargins(),
          P &&
            (Mi(b, function (a) {
              a.isDirty && (A = !0);
            }),
            Mi(b, function (h) {
              h.isDirtyExtremes &&
                ((h.isDirtyExtremes = !1),
                D.push(function () {
                  Ri(h, "afterSetExtremes", a(h.eventArgs, h.getExtremes())),
                    delete h.eventArgs;
                })),
                (A || c) && h.redraw();
            })),
          A && v.drawChartBox(),
          Mi(k, function (a) {
            a.isDirty && a.visible && (!a.isCartesian || a.xAxis) && a.redraw();
          }),
          w && w.reset(!0),
          L.draw(),
          Ri(v, "redraw"),
          M && v.cloneRenderTo(!0),
          Mi(D, function (a) {
            a.call();
          });
      },
      get: function (a) {
        var i,
          h,
          c,
          g = this,
          y = g.axes,
          v = g.series;
        for (i = 0; i < y.length; i++) if (y[i].options.id === a) return y[i];
        for (i = 0; i < v.length; i++) if (v[i].options.id === a) return v[i];
        for (i = 0; i < v.length; i++)
          for (c = v[i].points || [], h = 0; h < c.length; h++)
            if (c[h].id === a) return c[h];
        return null;
      },
      getAxes: function () {
        var a,
          h,
          c = this,
          g = this.options,
          y = (g.xAxis = A(g.xAxis || {})),
          v = (g.yAxis = A(g.yAxis || {}));
        Mi(y, function (a, i) {
          (a.index = i), (a.isX = !0);
        }),
          Mi(v, function (a, i) {
            a.index = i;
          }),
          (a = y.concat(v)),
          Mi(a, function (a) {
            h = new $(c, a);
          }),
          c.adjustTickAmounts();
      },
      getSelectedPoints: function () {
        var a = [];
        return (
          Mi(this.series, function (h) {
            a = a.concat(
              Di(h.points || [], function (a) {
                return a.selected;
              })
            );
          }),
          a
        );
      },
      getSelectedSeries: function () {
        return Di(this.series, function (a) {
          return a.selected;
        });
      },
      getStacks: function () {
        var a = this;
        Mi(a.yAxis, function (a) {
          a.stacks && a.hasVisibleSeries && (a.oldStacks = a.stacks);
        }),
          Mi(a.series, function (h) {
            !h.options.stacking ||
              (h.visible !== !0 && a.options.chart.ignoreHiddenSeries !== !1) ||
              (h.stackKey = h.type + C(h.options.stack, ""));
          });
      },
      setTitle: function (a, c, g) {
        var y,
          v,
          b = this,
          k = b.options;
        (y = k.title = h(k.title, a)),
          (v = k.subtitle = h(k.subtitle, c)),
          Mi(
            [
              ["title", a, y],
              ["subtitle", c, v],
            ],
            function (a) {
              var h = a[0],
                c = b[h],
                g = a[1],
                y = a[2];
              c && g && (b[h] = c = c.destroy()),
                y &&
                  y.text &&
                  !c &&
                  (b[h] = b.renderer
                    .text(y.text, 0, 0, y.useHTML)
                    .attr({
                      align: y.align,
                      class: ci + h,
                      zIndex: y.zIndex || 4,
                    })
                    .css(y.style)
                    .add());
            }
          ),
          b.layOutTitles(g);
      },
      layOutTitles: function (h) {
        var c,
          g = 0,
          y = this.title,
          v = this.subtitle,
          b = this.options,
          k = b.title,
          w = b.subtitle,
          S = this.renderer,
          T = this.spacingBox.width - 44;
        y &&
          (y
            .css({ width: (k.width || T) + pi })
            .align(
              a({ y: S.fontMetrics(k.style.fontSize, y).b - 3 }, k),
              !1,
              "spacingBox"
            ),
          k.floating || k.verticalAlign || (g = y.getBBox().height)),
          v &&
            (v
              .css({ width: (w.width || T) + pi })
              .align(
                a(
                  {
                    y:
                      g +
                      (k.margin - 13) +
                      S.fontMetrics(k.style.fontSize, v).b,
                  },
                  w
                ),
                !1,
                "spacingBox"
              ),
            w.floating || w.verticalAlign || (g = ze(g + v.getBBox().height))),
          (c = this.titleOffset !== g),
          (this.titleOffset = g),
          !this.isDirtyBox &&
            c &&
            ((this.isDirtyBox = c),
            this.hasRendered && C(h, !0) && this.isDirtyBox && this.redraw());
      },
      getChartSize: function () {
        var a = this,
          h = a.options.chart,
          c = h.width,
          g = h.height,
          y = a.renderToClone || a.renderTo;
        T(c) || (a.containerWidth = Ai(y, "width")),
          T(g) || (a.containerHeight = Ai(y, "height")),
          (a.chartWidth = Re(0, c || a.containerWidth || 600)),
          (a.chartHeight = Re(
            0,
            C(g, a.containerHeight > 19 ? a.containerHeight : 400)
          ));
      },
      cloneRenderTo: function (a) {
        var h = this.renderToClone,
          c = this.container;
        a
          ? h && (this.renderTo.appendChild(c), N(h), delete this.renderToClone)
          : (c &&
              c.parentNode === this.renderTo &&
              this.renderTo.removeChild(c),
            (this.renderToClone = h = this.renderTo.cloneNode(0)),
            L(h, { position: ai, top: "-9999px", display: "block" }),
            h.style.setProperty &&
              h.style.setProperty("display", "block", "important"),
            Me.body.appendChild(h),
            c && h.appendChild(c));
      },
      getContainer: function () {
        var h,
          y,
          v,
          b,
          k,
          w,
          S = this,
          T = S.options.chart,
          A = "data-highcharts-chart";
        (S.renderTo = b = T.renderTo),
          (w = ci + ti++),
          g(b) && (S.renderTo = b = Me.getElementById(b)),
          b || ue(13, !0),
          (k = c(P(b, A))),
          !isNaN(k) && ii[k] && ii[k].hasRendered && ii[k].destroy(),
          P(b, A, S.index),
          (b.innerHTML = ""),
          T.skipClone || b.offsetWidth || S.cloneRenderTo(),
          S.getChartSize(),
          (y = S.chartWidth),
          (v = S.chartHeight),
          (S.container = h =
            M(
              si,
              {
                className:
                  ci + "container" + (T.className ? " " + T.className : ""),
                id: w,
              },
              a(
                {
                  position: li,
                  overflow: hi,
                  width: y + pi,
                  height: v + pi,
                  textAlign: "left",
                  lineHeight: "normal",
                  zIndex: 0,
                  "-webkit-tap-highlight-color": "rgba(0,0,0,0)",
                },
                T.style
              ),
              S.renderToClone || b
            )),
          (S._cursor = h.style.cursor),
          (S.renderer = T.forExport
            ? new _i(h, y, v, T.style, !0)
            : new ee(h, y, v, T.style)),
          Je && S.renderer.create(S, h, y, v);
      },
      getMargins: function () {
        var a,
          h = this,
          c = h.spacing,
          g = h.legend,
          y = h.margin,
          v = h.options.legend,
          b = C(v.margin, 20),
          k = v.x,
          w = v.y,
          S = v.align,
          P = v.verticalAlign,
          A = h.titleOffset;
        h.resetMargins(),
          (a = h.axisOffset),
          A &&
            !T(y[0]) &&
            (h.plotTop = Re(h.plotTop, A + h.options.title.margin + c[0])),
          g.display &&
            !v.floating &&
            ("right" === S
              ? T(y[1]) ||
                (h.marginRight = Re(
                  h.marginRight,
                  g.legendWidth - k + b + c[1]
                ))
              : "left" === S
              ? T(y[3]) ||
                (h.plotLeft = Re(h.plotLeft, g.legendWidth + k + b + c[3]))
              : "top" === P
              ? T(y[0]) ||
                (h.plotTop = Re(h.plotTop, g.legendHeight + w + b + c[0]))
              : "bottom" === P &&
                (T(y[2]) ||
                  (h.marginBottom = Re(
                    h.marginBottom,
                    g.legendHeight - w + b + c[2]
                  )))),
          h.extraBottomMargin && (h.marginBottom += h.extraBottomMargin),
          h.extraTopMargin && (h.plotTop += h.extraTopMargin),
          h.hasCartesianSeries &&
            Mi(h.axes, function (a) {
              a.getOffset();
            }),
          T(y[3]) || (h.plotLeft += a[3]),
          T(y[0]) || (h.plotTop += a[0]),
          T(y[2]) || (h.marginBottom += a[2]),
          T(y[1]) || (h.marginRight += a[1]),
          h.setChartSize();
      },
      reflow: function (e) {
        var a = this,
          h = a.options.chart,
          c = a.renderTo,
          g = h.width || Ai(c, "width"),
          y = h.height || Ai(c, "height"),
          v = e ? e.target : De,
          b = function () {
            a.container && (a.setSize(g, y, !1), (a.hasUserSize = null));
          };
        a.hasUserSize ||
          !g ||
          !y ||
          (v !== De && v !== Me) ||
          ((g !== a.containerWidth || y !== a.containerHeight) &&
            (clearTimeout(a.reflowTimeout),
            e ? (a.reflowTimeout = setTimeout(b, 100)) : b()),
          (a.containerWidth = g),
          (a.containerHeight = y));
      },
      initReflow: function () {
        var a = this,
          h = function (e) {
            a.reflow(e);
          };
        Oi(De, "resize", h),
          Oi(a, "destroy", function () {
            zi(De, "resize", h);
          });
      },
      setSize: function (a, h, c) {
        var g,
          y,
          v,
          b = this;
        (b.isResizing += 1),
          (v = function () {
            b &&
              Ri(b, "endResize", null, function () {
                b.isResizing -= 1;
              });
          }),
          j(c, b),
          (b.oldChartHeight = b.chartHeight),
          (b.oldChartWidth = b.chartWidth),
          T(a) && ((b.chartWidth = g = Re(0, Be(a))), (b.hasUserSize = !!g)),
          T(h) && (b.chartHeight = y = Re(0, Be(h))),
          (he ? Xi : L)(b.container, { width: g + pi, height: y + pi }, he),
          b.setChartSize(!0),
          b.renderer.setSize(g, y, c),
          (b.maxTicks = null),
          Mi(b.axes, function (a) {
            (a.isDirty = !0), a.setScale();
          }),
          Mi(b.series, function (a) {
            a.isDirty = !0;
          }),
          (b.isDirtyLegend = !0),
          (b.isDirtyBox = !0),
          b.layOutTitles(),
          b.getMargins(),
          b.redraw(c),
          (b.oldChartHeight = null),
          Ri(b, "resize"),
          he === !1 ? v() : setTimeout(v, (he && he.duration) || 500);
      },
      setChartSize: function (a) {
        var h,
          c,
          g,
          y,
          v,
          b,
          k,
          w = this,
          S = w.inverted,
          T = w.renderer,
          P = w.chartWidth,
          A = w.chartHeight,
          C = w.options.chart,
          L = w.spacing,
          M = w.clipOffset;
        (w.plotLeft = g = Be(w.plotLeft)),
          (w.plotTop = y = Be(w.plotTop)),
          (w.plotWidth = v = Re(0, Be(P - g - w.marginRight))),
          (w.plotHeight = b = Re(0, Be(A - y - w.marginBottom))),
          (w.plotSizeX = S ? b : v),
          (w.plotSizeY = S ? v : b),
          (w.plotBorderWidth = C.plotBorderWidth || 0),
          (w.spacingBox = T.spacingBox =
            {
              x: L[3],
              y: L[0],
              width: P - L[3] - L[1],
              height: A - L[0] - L[2],
            }),
          (w.plotBox = T.plotBox = { x: g, y: y, width: v, height: b }),
          (k = 2 * Oe(w.plotBorderWidth / 2)),
          (h = ze(Re(k, M[3]) / 2)),
          (c = ze(Re(k, M[0]) / 2)),
          (w.clipBox = {
            x: h,
            y: c,
            width: Oe(w.plotSizeX - Re(k, M[1]) / 2 - h),
            height: Re(0, Oe(w.plotSizeY - Re(k, M[2]) / 2 - c)),
          }),
          a ||
            Mi(w.axes, function (a) {
              a.setAxisSize(), a.setAxisTranslation();
            });
      },
      resetMargins: function () {
        var a = this,
          h = a.spacing,
          c = a.margin;
        (a.plotTop = C(c[0], h[0])),
          (a.marginRight = C(c[1], h[1])),
          (a.marginBottom = C(c[2], h[2])),
          (a.plotLeft = C(c[3], h[3])),
          (a.axisOffset = [0, 0, 0, 0]),
          (a.clipOffset = [0, 0, 0, 0]);
      },
      drawChartBox: function () {
        var a,
          h,
          c = this,
          g = c.options.chart,
          y = c.renderer,
          v = c.chartWidth,
          b = c.chartHeight,
          k = c.chartBackground,
          w = c.plotBackground,
          S = c.plotBorder,
          T = c.plotBGImage,
          P = g.borderWidth || 0,
          A = g.backgroundColor,
          C = g.plotBackgroundColor,
          L = g.plotBackgroundImage,
          M = g.plotBorderWidth || 0,
          D = c.plotLeft,
          I = c.plotTop,
          B = c.plotWidth,
          O = c.plotHeight,
          z = c.plotBox,
          R = c.clipRect,
          H = c.clipBox;
        (a = P + (g.shadow ? 8 : 0)),
          (P || A) &&
            (k
              ? k.animate(k.crisp({ width: v - a, height: b - a }))
              : ((h = { fill: A || gi }),
                P && ((h.stroke = g.borderColor), (h["stroke-width"] = P)),
                (c.chartBackground = y
                  .rect(a / 2, a / 2, v - a, b - a, g.borderRadius, P)
                  .attr(h)
                  .addClass(ci + "background")
                  .add()
                  .shadow(g.shadow)))),
          C &&
            (w
              ? w.animate(z)
              : (c.plotBackground = y
                  .rect(D, I, B, O, 0)
                  .attr({ fill: C })
                  .add()
                  .shadow(g.plotShadow))),
          L &&
            (T ? T.animate(z) : (c.plotBGImage = y.image(L, D, I, B, O).add())),
          R
            ? R.animate({ width: H.width, height: H.height })
            : (c.clipRect = y.clipRect(H)),
          M &&
            (S
              ? S.animate(S.crisp({ x: D, y: I, width: B, height: O }))
              : (c.plotBorder = y
                  .rect(D, I, B, O, 0, -M)
                  .attr({
                    stroke: g.plotBorderColor,
                    "stroke-width": M,
                    fill: gi,
                    zIndex: 1,
                  })
                  .add())),
          (c.isDirtyBox = !1);
      },
      propFromSeries: function () {
        var a,
          i,
          h,
          c = this,
          g = c.options.chart,
          y = c.options.series;
        Mi(["inverted", "angular", "polar"], function (v) {
          for (
            a = Si[g.type || g.defaultSeriesType],
              h = c[v] || g[v] || (a && a.prototype[v]),
              i = y && y.length;
            !h && i--;

          )
            (a = Si[y[i].type]), a && a.prototype[v] && (h = !0);
          c[v] = h;
        });
      },
      linkSeries: function () {
        var a = this,
          h = a.series;
        Mi(h, function (a) {
          a.linkedSeries.length = 0;
        }),
          Mi(h, function (h) {
            var c = h.options.linkedTo;
            g(c) &&
              ((c = ":previous" === c ? a.series[h.index - 1] : a.get(c)),
              c && (c.linkedSeries.push(h), (h.linkedParent = c)));
          });
      },
      renderSeries: function () {
        Mi(this.series, function (a) {
          a.translate(), a.setTooltipPoints && a.setTooltipPoints(), a.render();
        });
      },
      renderLabels: function () {
        var h = this,
          g = h.options.labels;
        g.items &&
          Mi(g.items, function (y) {
            var v = a(g.style, y.style),
              x = c(v.left) + h.plotLeft,
              b = c(v.top) + h.plotTop + 12;
            delete v.left,
              delete v.top,
              h.renderer.text(y.html, x, b).attr({ zIndex: 2 }).css(v).add();
          });
      },
      render: function () {
        var a = this,
          h = a.axes,
          c = a.renderer,
          g = a.options;
        a.setTitle(),
          (a.legend = new sn(a, g.legend)),
          a.getStacks(),
          Mi(h, function (a) {
            a.setScale();
          }),
          a.getMargins(),
          (a.maxTicks = null),
          Mi(h, function (a) {
            a.setTickPositions(!0), a.setMaxTicks();
          }),
          a.adjustTickAmounts(),
          a.getMargins(),
          a.drawChartBox(),
          a.hasCartesianSeries &&
            Mi(h, function (a) {
              a.render();
            }),
          a.seriesGroup ||
            (a.seriesGroup = c.g("series-group").attr({ zIndex: 3 }).add()),
          a.renderSeries(),
          a.renderLabels(),
          a.showCredits(g.credits),
          (a.hasRendered = !0);
      },
      showCredits: function (a) {
        a.enabled &&
          !this.credits &&
          (this.credits = this.renderer
            .text(a.text, 0, 0)
            .on("click", function () {
              a.href && (location.href = a.href);
            })
            .attr({ align: a.position.align, zIndex: 8 })
            .css(a.style)
            .add()
            .align(a.position));
      },
      destroy: function () {
        var i,
          a = this,
          h = a.axes,
          c = a.series,
          g = a.container,
          y = g && g.parentNode;
        for (
          Ri(a, "destroy"),
            ii[a.index] = te,
            ni--,
            a.renderTo.removeAttribute("data-highcharts-chart"),
            zi(a),
            i = h.length;
          i--;

        )
          h[i] = h[i].destroy();
        for (i = c.length; i--; ) c[i] = c[i].destroy();
        Mi(
          [
            "title",
            "subtitle",
            "chartBackground",
            "plotBackground",
            "plotBGImage",
            "plotBorder",
            "seriesGroup",
            "clipRect",
            "credits",
            "pointer",
            "scroller",
            "rangeSelector",
            "legend",
            "resetZoomButton",
            "tooltip",
            "renderer",
          ],
          function (h) {
            var c = a[h];
            c && c.destroy && (a[h] = c.destroy());
          }
        ),
          g && ((g.innerHTML = ""), zi(g), y && N(g));
        for (i in a) delete a[i];
      },
      isReadyToRender: function () {
        var a = this;
        return (!$e && De == De.top && "complete" !== Me.readyState) ||
          (Je && !De.canvg)
          ? (Je
              ? qi.push(function () {
                  a.firstRender();
                }, a.options.global.canvasToolsURL)
              : Me.attachEvent("onreadystatechange", function () {
                  Me.detachEvent("onreadystatechange", a.firstRender),
                    "complete" === Me.readyState && a.firstRender();
                }),
            !1)
          : !0;
      },
      firstRender: function () {
        var a = this,
          h = a.options,
          c = a.callback;
        a.isReadyToRender() &&
          (a.getContainer(),
          Ri(a, "init"),
          a.resetMargins(),
          a.setChartSize(),
          a.propFromSeries(),
          a.getAxes(),
          Mi(h.series || [], function (h) {
            a.initSeries(h);
          }),
          a.linkSeries(),
          Ri(a, "beforeRender"),
          Le.Pointer && (a.pointer = new tn(a, h)),
          a.render(),
          a.renderer.draw(),
          c && c.apply(a, [a]),
          Mi(a.callbacks, function (h) {
            h.apply(a, [a]);
          }),
          a.cloneRenderTo(!0),
          Ri(a, "load"));
      },
      splashArray: function (a, h) {
        var c = h[a],
          g = y(c) ? c : [c, c, c, c];
        return [
          C(h[a + "Top"], g[0]),
          C(h[a + "Right"], g[1]),
          C(h[a + "Bottom"], g[2]),
          C(h[a + "Left"], g[3]),
        ];
      },
    }),
    (J.prototype.callbacks = []);
  var ln = (Le.CenteredSeriesMixin = {
      getCenter: function () {
        var a,
          h,
          g = this.options,
          y = this.chart,
          v = 2 * (g.slicedOffset || 0),
          b = y.plotWidth - 2 * v,
          k = y.plotHeight - 2 * v,
          w = g.center,
          S = [
            C(w[0], "50%"),
            C(w[1], "50%"),
            g.size || "100%",
            g.innerSize || 0,
          ],
          T = He(b, k);
        return Bi(S, function (g, i) {
          return (
            (h = /%$/.test(g)),
            (a = 2 > i || (2 === i && h)),
            (h ? ([b, k, T, T][i] * c(g)) / 100 : g) + (a ? v : 0)
          );
        });
      },
    }),
    hn = function () {};
  hn.prototype = {
    init: function (a, h, x) {
      var c,
        g = this;
      return (
        (g.series = a),
        g.applyOptions(h, x),
        (g.pointAttr = {}),
        a.options.colorByPoint &&
          ((c = a.options.colors || a.chart.options.colors),
          (g.color = g.color || c[a.colorCounter++]),
          a.colorCounter === c.length && (a.colorCounter = 0)),
        a.chart.pointCount++,
        g
      );
    },
    applyOptions: function (h, x) {
      var c = this,
        g = c.series,
        y = g.options.pointValKey || g.pointValKey;
      return (
        (h = hn.prototype.optionsToObject.call(this, h)),
        a(c, h),
        (c.options = c.options ? a(c.options, h) : h),
        y && (c.y = c[y]),
        c.x === te && g && (c.x = x === te ? g.autoIncrement() : x),
        c
      );
    },
    optionsToObject: function (a) {
      var h,
        c = {},
        g = this.series,
        y = g.pointArrayMap || ["y"],
        b = y.length,
        i = 0,
        k = 0;
      if ("number" == typeof a || null === a) c[y[0]] = a;
      else if (v(a))
        for (
          a.length > b &&
          ((h = typeof a[0]),
          "string" === h ? (c.name = a[0]) : "number" === h && (c.x = a[0]),
          i++);
          b > k;

        )
          c[y[k++]] = a[i++];
      else
        "object" == typeof a &&
          ((c = a),
          a.dataLabels && (g._hasPointLabels = !0),
          a.marker && (g._hasPointMarkers = !0));
      return c;
    },
    destroy: function () {
      var a,
        h = this,
        c = h.series,
        g = c.chart,
        y = g.hoverPoints;
      g.pointCount--,
        y && (h.setState(), S(y, h), y.length || (g.hoverPoints = null)),
        h === g.hoverPoint && h.onMouseOut(),
        (h.graphic || h.dataLabel) && (zi(h), h.destroyElements()),
        h.legendItem && g.legend.destroyItem(h);
      for (a in h) h[a] = null;
    },
    destroyElements: function () {
      for (
        var a,
          h = this,
          c = [
            "graphic",
            "dataLabel",
            "dataLabelUpper",
            "group",
            "connector",
            "shadowGroup",
          ],
          i = 6;
        i--;

      )
        (a = c[i]), h[a] && (h[a] = h[a].destroy());
    },
    getLabelConfig: function () {
      var a = this;
      return {
        x: a.category,
        y: a.y,
        key: a.name || a.category,
        series: a.series,
        point: a,
        percentage: a.percentage,
        total: a.total || a.stackTotal,
      };
    },
    tooltipFormatter: function (a) {
      var h = this.series,
        c = h.tooltipOptions,
        g = C(c.valueDecimals, ""),
        y = c.valuePrefix || "",
        v = c.valueSuffix || "";
      return (
        Mi(h.pointArrayMap || ["y"], function (h) {
          (h = "{point." + h),
            (y || v) && (a = a.replace(h + "}", y + h + "}" + v)),
            (a = a.replace(h + "}", h + ":,." + g + "f}"));
        }),
        R(a, { point: this, series: this.series })
      );
    },
    firePointEvent: function (a, h, c) {
      var g = this,
        y = this.series,
        v = y.options;
      (v.point.events[a] ||
        (g.options && g.options.events && g.options.events[a])) &&
        this.importEvents(),
        "click" === a &&
          v.allowPointSelect &&
          (c = function (a) {
            g.select(null, a.ctrlKey || a.metaKey || a.shiftKey);
          }),
        Ri(this, a, h, c);
    },
  };
  var cn = function () {};
  (cn.prototype = {
    isCartesian: !0,
    type: "line",
    pointClass: hn,
    sorted: !0,
    requireSorting: !0,
    pointAttrToOptions: {
      stroke: "lineColor",
      "stroke-width": "lineWidth",
      fill: "fillColor",
      r: "radius",
    },
    axisTypes: ["xAxis", "yAxis"],
    colorCounter: 0,
    parallelArrays: ["x", "y"],
    init: function (h, c) {
      var g,
        y,
        v = this,
        b = h.series,
        k = function (a, h) {
          return C(a.options.index, a._i) - C(h.options.index, h._i);
        };
      (v.chart = h),
        (v.options = c = v.setOptions(c)),
        (v.linkedSeries = []),
        v.bindAxes(),
        a(v, {
          name: c.name,
          state: xi,
          pointAttr: {},
          visible: c.visible !== !1,
          selected: c.selected === !0,
        }),
        Je && (c.animation = !1),
        (y = c.events);
      for (g in y) Oi(v, g, y[g]);
      ((y && y.click) ||
        (c.point && c.point.events && c.point.events.click) ||
        c.allowPointSelect) &&
        (h.runTrackerClick = !0),
        v.getColor(),
        v.getSymbol(),
        Mi(v.parallelArrays, function (a) {
          v[a + "Data"] = [];
        }),
        v.setData(c.data, !1),
        v.isCartesian && (h.hasCartesianSeries = !0),
        b.push(v),
        (v._i = b.length - 1),
        E(b, k),
        this.yAxis && E(this.yAxis.series, k),
        Mi(b, function (a, i) {
          (a.index = i), (a.name = a.name || "Series " + (i + 1));
        });
    },
    bindAxes: function () {
      var a,
        h = this,
        c = h.options,
        g = h.chart;
      Mi(h.axisTypes || [], function (y) {
        Mi(g[y], function (g) {
          (a = g.options),
            (c[y] === a.index ||
              (c[y] !== te && c[y] === a.id) ||
              (c[y] === te && 0 === a.index)) &&
              (g.series.push(h), (h[y] = g), (g.isDirty = !0));
        }),
          h[y] || h.optionalAxis === y || ue(18, !0);
      });
    },
    updateParallelArrays: function (a, i) {
      var h = a.series,
        c = arguments,
        g =
          "number" == typeof i
            ? function (c) {
                var g = "y" === c && h.toYData ? h.toYData(a) : a[c];
                h[c + "Data"][i] = g;
              }
            : function (a) {
                Array.prototype[i].apply(
                  h[a + "Data"],
                  Array.prototype.slice.call(c, 2)
                );
              };
      Mi(h.parallelArrays, g);
    },
    autoIncrement: function () {
      var a = this,
        h = a.options,
        c = a.xIncrement;
      return (
        (c = C(c, h.pointStart, 0)),
        (a.pointInterval = C(a.pointInterval, h.pointInterval, 1)),
        (a.xIncrement = c + a.pointInterval),
        c
      );
    },
    getSegments: function () {
      var i,
        a = this,
        h = -1,
        c = [],
        g = a.points,
        y = g.length;
      if (y)
        if (a.options.connectNulls) {
          for (i = y; i--; ) null === g[i].y && g.splice(i, 1);
          g.length && (c = [g]);
        } else
          Mi(g, function (a, i) {
            null === a.y
              ? (i > h + 1 && c.push(g.slice(h + 1, i)), (h = i))
              : i === y - 1 && c.push(g.slice(h + 1, i + 1));
          });
      a.segments = c;
    },
    setOptions: function (a) {
      var c,
        g = this.chart,
        y = g.options,
        v = y.plotOptions,
        b = g.userOptions || {},
        k = b.plotOptions || {},
        w = v[this.type];
      return (
        (this.userOptions = a),
        (c = h(w, v.series, a)),
        (this.tooltipOptions = h(
          se.tooltip,
          se.plotOptions[this.type].tooltip,
          b.tooltip,
          k.series && k.series.tooltip,
          k[this.type] && k[this.type].tooltip,
          a.tooltip
        )),
        null === w.marker && delete c.marker,
        c
      );
    },
    getCyclic: function (a, h, c) {
      var i,
        g = this.userOptions,
        y = "_" + a + "Index",
        v = a + "Counter";
      h ||
        (T(g[y])
          ? (i = g[y])
          : ((g[y] = i = this.chart[v] % c.length), (this.chart[v] += 1)),
        (h = c[i])),
        (this[a] = h);
    },
    getColor: function () {
      this.options.colorByPoint ||
        this.getCyclic(
          "color",
          this.options.color || Wi[this.type].color,
          this.chart.options.colors
        );
    },
    getSymbol: function () {
      var a = this.options.marker;
      this.getCyclic("symbol", a.symbol, this.chart.options.symbols),
        /^url/.test(this.symbol) && (a.radius = 0);
    },
    drawLegendSymbol: an.drawLineMarker,
    setData: function (a, h, c, y) {
      var k,
        i,
        w,
        S = this,
        T = S.points,
        P = (T && T.length) || 0,
        A = S.options,
        L = S.chart,
        M = null,
        D = S.xAxis,
        I = D && !!D.categories,
        B = S.tooltipPoints,
        O = A.turboThreshold,
        z = this.xData,
        R = this.yData,
        H = S.pointArrayMap,
        X = H && H.length;
      if (
        ((a = a || []),
        (k = a.length),
        (h = C(h, !0)),
        y === !1 || !k || P !== k || S.cropped || S.hasGroupedData)
      ) {
        if (
          ((S.xIncrement = null),
          (S.pointRange = I ? 1 : A.pointRange),
          (S.colorCounter = 0),
          Mi(this.parallelArrays, function (a) {
            S[a + "Data"].length = 0;
          }),
          O && k > O)
        ) {
          for (i = 0; null === M && k > i; ) (M = a[i]), i++;
          if (b(M)) {
            var x = C(A.pointStart, 0),
              E = C(A.pointInterval, 1);
            for (i = 0; k > i; i++) (z[i] = x), (R[i] = a[i]), (x += E);
            S.xIncrement = x;
          } else if (v(M))
            if (X)
              for (i = 0; k > i; i++)
                (w = a[i]), (z[i] = w[0]), (R[i] = w.slice(1, X + 1));
            else
              for (i = 0; k > i; i++) (w = a[i]), (z[i] = w[0]), (R[i] = w[1]);
          else ue(12);
        } else
          for (i = 0; k > i; i++)
            a[i] !== te &&
              ((w = { series: S }),
              S.pointClass.prototype.applyOptions.apply(w, [a[i]]),
              S.updateParallelArrays(w, i),
              I && w.name && (D.names[w.x] = w.name));
        for (
          g(R[0]) && ue(14, !0), S.data = [], S.options.data = a, i = P;
          i--;

        )
          T[i] && T[i].destroy && T[i].destroy();
        B && (B.length = 0),
          D && (D.minRange = D.userMinRange),
          (S.isDirty = S.isDirtyData = L.isDirtyBox = !0),
          (c = !1);
      } else
        Mi(a, function (a, i) {
          T[i].update(a, !1);
        });
      h && L.redraw(c);
    },
    processData: function (a) {
      var h,
        c,
        g,
        y,
        i,
        v,
        b,
        k,
        w = this,
        S = w.xData,
        T = w.yData,
        P = S.length,
        A = 0,
        C = w.xAxis,
        L = w.options,
        M = L.cropThreshold,
        D = 0,
        I = w.isCartesian;
      if (I && !w.isDirty && !C.isDirty && !w.yAxis.isDirty && !a) return !1;
      for (
        I &&
          w.sorted &&
          (!M || P > M || w.forceCrop) &&
          ((v = C.getExtremes()),
          (b = v.min),
          (k = v.max),
          S[P - 1] < b || S[0] > k
            ? ((S = []), (T = []))
            : (S[0] < b || S[P - 1] > k) &&
              ((h = this.cropData(w.xData, w.yData, b, k)),
              (S = h.xData),
              (T = h.yData),
              (A = h.start),
              (c = !0),
              (D = S.length))),
          i = S.length - 1;
        i >= 0;
        i--
      )
        (g = S[i] - S[i - 1]),
          !c && S[i] > b && S[i] < k && D++,
          g > 0 && (y === te || y > g)
            ? (y = g)
            : 0 > g && w.requireSorting && ue(15);
      (w.cropped = c),
        (w.cropStart = A),
        (w.processedXData = S),
        (w.processedYData = T),
        (w.activePointCount = D),
        null === L.pointRange && (w.pointRange = y || 1),
        (w.closestPointRange = y);
    },
    cropData: function (a, h, c, g) {
      var i,
        y = a.length,
        v = 0,
        b = y,
        k = C(this.cropShoulder, 1);
      for (i = 0; y > i; i++)
        if (a[i] >= c) {
          v = Re(0, i - k);
          break;
        }
      for (; y > i; i++)
        if (a[i] > g) {
          b = i + k;
          break;
        }
      return { xData: a.slice(v, b), yData: h.slice(v, b), start: v, end: b };
    },
    generatePoints: function () {
      var a,
        h,
        c,
        i,
        g = this,
        y = g.options,
        v = y.data,
        b = g.data,
        k = g.processedXData,
        w = g.processedYData,
        S = g.pointClass,
        T = k.length,
        P = g.cropStart || 0,
        C = g.hasGroupedData,
        L = [];
      if (!b && !C) {
        var M = [];
        (M.length = v.length), (b = g.data = M);
      }
      for (i = 0; T > i; i++)
        (h = P + i),
          C
            ? (L[i] = new S().init(g, [k[i]].concat(A(w[i]))))
            : (b[h]
                ? (c = b[h])
                : v[h] !== te && (b[h] = c = new S().init(g, v[h], k[i])),
              (L[i] = c));
      if (b && (T !== (a = b.length) || C))
        for (i = 0; a > i; i++)
          i !== P || C || (i += T),
            b[i] && (b[i].destroyElements(), (b[i].plotX = te));
      (g.data = b), (g.points = L);
    },
    getExtremes: function (a) {
      var h,
        c,
        g,
        y,
        v,
        x,
        b,
        i,
        k,
        w = this.xAxis,
        S = this.yAxis,
        T = this.processedXData,
        P = [],
        A = 0,
        L = w.getExtremes(),
        M = L.min,
        D = L.max;
      for (
        a = a || this.stackedYData || this.processedYData, h = a.length, i = 0;
        h > i;
        i++
      )
        if (
          ((x = T[i]),
          (b = a[i]),
          (c = null !== b && b !== te && (!S.isLog || b.length || b > 0)),
          (g =
            this.getExtremesFromAll ||
            this.cropped ||
            ((T[i + 1] || x) >= M && (T[i - 1] || x) <= D)),
          c && g)
        )
          if ((k = b.length)) for (; k--; ) null !== b[k] && (P[A++] = b[k]);
          else P[A++] = b;
      (this.dataMin = C(y, G(P))), (this.dataMax = C(v, W(P)));
    },
    translate: function () {
      this.processedXData || this.processData(), this.generatePoints();
      var i,
        a = this,
        h = a.options,
        c = h.stacking,
        g = a.xAxis,
        y = g.categories,
        v = a.yAxis,
        k = a.points,
        w = k.length,
        S = !!a.modifyValue,
        P = h.pointPlacement,
        A = "between" === P || b(P),
        L = h.threshold;
      for (i = 0; w > i; i++) {
        var M,
          D,
          I = k[i],
          B = I.x,
          O = I.y,
          z = I.low,
          R = c && v.stacks[(a.negStacks && L > O ? "-" : "") + a.stackKey];
        v.isLog && 0 >= O && (I.y = O = null),
          (I.plotX = g.translate(B, 0, 0, 0, 1, P, "flags" === this.type)),
          c &&
            a.visible &&
            R &&
            R[B] &&
            ((M = R[B]),
            (D = M.points[a.index + "," + i]),
            (z = D[0]),
            (O = D[1]),
            0 === z && (z = C(L, v.min)),
            v.isLog && 0 >= z && (z = null),
            (I.total = I.stackTotal = M.total),
            (I.percentage = M.total && (I.y / M.total) * 100),
            (I.stackY = O),
            M.setOffset(a.pointXOffset || 0, a.barW || 0)),
          (I.yBottom = T(z) ? v.translate(z, 0, 1, 0, 1) : null),
          S && (O = a.modifyValue(O, I)),
          (I.plotY =
            "number" == typeof O && 1 / 0 !== O
              ? v.translate(O, 0, 1, 0, 1)
              : te),
          (I.clientX = A ? g.translate(B, 0, 0, 0, 1) : I.plotX),
          (I.negative = I.y < (L || 0)),
          (I.category = y && y[I.x] !== te ? y[I.x] : I.x);
      }
      a.getSegments();
    },
    animate: function (h) {
      var c,
        g,
        v,
        b = this,
        k = b.chart,
        w = k.renderer,
        S = b.options.animation,
        T = b.clipBox || k.clipBox,
        P = k.inverted;
      S && !y(S) && (S = Wi[b.type].animation),
        (v = ["_sharedClip", S.duration, S.easing, T.height].join(",")),
        h
          ? ((c = k[v]),
            (g = k[v + "m"]),
            c ||
              ((k[v] = c = w.clipRect(a(T, { width: 0 }))),
              (k[v + "m"] = g =
                w.clipRect(
                  -99,
                  P ? -k.plotLeft : -k.plotTop,
                  99,
                  P ? k.chartWidth : k.chartHeight
                ))),
            b.group.clip(c),
            b.markerGroup.clip(g),
            (b.sharedClipKey = v))
          : ((c = k[v]),
            c && c.animate({ width: k.plotSizeX }, S),
            k[v + "m"] && k[v + "m"].animate({ width: k.plotSizeX + 99 }, S),
            (b.animate = null));
    },
    afterAnimate: function () {
      var a = this.chart,
        h = this.sharedClipKey,
        c = this.group,
        g = this.clipBox;
      c &&
        this.options.clip !== !1 &&
        ((h && g) || c.clip(g ? a.renderer.clipRect(g) : a.clipRect),
        this.markerGroup.clip()),
        Ri(this, "afterAnimate"),
        setTimeout(function () {
          h &&
            a[h] &&
            (g || (a[h] = a[h].destroy()),
            a[h + "m"] && (a[h + "m"] = a[h + "m"].destroy()));
        }, 100);
    },
    drawPoints: function () {
      var h,
        c,
        g,
        i,
        y,
        v,
        b,
        k,
        w,
        S,
        T,
        P,
        A = this,
        L = A.points,
        M = A.chart,
        D = A.options,
        I = D.marker,
        B = A.pointAttr[""],
        O = A.markerGroup,
        z = C(I.enabled, A.activePointCount < (0.5 * A.xAxis.len) / I.radius);
      if (I.enabled !== !1 || A._hasPointMarkers)
        for (i = L.length; i--; )
          (y = L[i]),
            (c = Oe(y.plotX)),
            (g = y.plotY),
            (w = y.graphic),
            (S = y.marker || {}),
            (T = (z && S.enabled === te) || S.enabled),
            (P = M.isInsidePlot(Be(c), g, M.inverted)),
            T && g !== te && !isNaN(g) && null !== y.y
              ? ((h = y.pointAttr[y.selected ? ki : xi] || B),
                (v = h.r),
                (b = C(S.symbol, A.symbol)),
                (k = 0 === b.indexOf("url")),
                w
                  ? w[P ? "show" : "hide"](!0).animate(
                      a(
                        { x: c - v, y: g - v },
                        w.symbolName ? { width: 2 * v, height: 2 * v } : {}
                      )
                    )
                  : P &&
                    (v > 0 || k) &&
                    (y.graphic = w =
                      M.renderer
                        .symbol(b, c - v, g - v, 2 * v, 2 * v)
                        .attr(h)
                        .add(O)))
              : w && (y.graphic = w.destroy());
    },
    convertAttribs: function (a, h, c, g) {
      var y,
        v,
        b = this.pointAttrToOptions,
        k = {};
      (a = a || {}), (h = h || {}), (c = c || {}), (g = g || {});
      for (y in b) (v = b[y]), (k[y] = C(a[v], h[y], c[y], g[y]));
      return k;
    },
    getAttribs: function () {
      var h,
        i,
        c,
        g,
        y,
        v,
        b = this,
        k = b.options,
        w = Wi[b.type].marker ? k.marker : k,
        S = w.states,
        P = S[bi],
        A = b.color,
        C = { stroke: A, fill: A },
        L = b.points || [],
        M = [],
        D = b.pointAttrToOptions,
        I = b.hasPointSpecificOptions,
        B = k.negativeColor,
        O = w.lineColor,
        z = w.fillColor,
        R = k.turboThreshold;
      if (
        (k.marker
          ? ((P.radius = P.radius || w.radius + P.radiusPlus),
            (P.lineWidth = P.lineWidth || w.lineWidth + P.lineWidthPlus))
          : (P.color =
              P.color ||
              Vi(P.color || A)
                .brighten(P.brightness)
                .get()),
        (M[xi] = b.convertAttribs(w, C)),
        Mi([bi, ki], function (a) {
          M[a] = b.convertAttribs(S[a], M[xi]);
        }),
        (b.pointAttr = M),
        (i = L.length),
        !R || R > i || I)
      )
        for (; i--; ) {
          if (
            ((c = L[i]),
            (w = (c.options && c.options.marker) || c.options),
            w && w.enabled === !1 && (w.radius = 0),
            c.negative && B && (c.color = c.fillColor = B),
            (I = k.colorByPoint || c.color),
            c.options)
          )
            for (v in D) T(w[D[v]]) && (I = !0);
          I
            ? ((w = w || {}),
              (g = []),
              (S = w.states || {}),
              (h = S[bi] = S[bi] || {}),
              k.marker ||
                (h.color =
                  h.color ||
                  (!c.options.color && P.color) ||
                  Vi(c.color)
                    .brighten(h.brightness || P.brightness)
                    .get()),
              (y = { color: c.color }),
              z || (y.fillColor = c.color),
              O || (y.lineColor = c.color),
              (g[xi] = b.convertAttribs(a(y, w), M[xi])),
              (g[bi] = b.convertAttribs(S[bi], M[bi], g[xi])),
              (g[ki] = b.convertAttribs(S[ki], M[ki], g[xi])))
            : (g = M),
            (c.pointAttr = g);
        }
    },
    destroy: function () {
      var a,
        i,
        h,
        c,
        g,
        y = this,
        v = y.chart,
        b = /AppleWebKit\/533/.test(Ne),
        k = y.data || [];
      for (
        Ri(y, "destroy"),
          zi(y),
          Mi(y.axisTypes || [], function (a) {
            (g = y[a]), g && (S(g.series, y), (g.isDirty = g.forceRedraw = !0));
          }),
          y.legendItem && y.chart.legend.destroyItem(y),
          i = k.length;
        i--;

      )
        (h = k[i]), h && h.destroy && h.destroy();
      (y.points = null),
        clearTimeout(y.animationTimeout),
        Mi(
          [
            "area",
            "graph",
            "dataLabelsGroup",
            "group",
            "markerGroup",
            "tracker",
            "graphNeg",
            "areaNeg",
            "posClip",
            "negClip",
          ],
          function (h) {
            y[h] && ((a = b && "group" === h ? "hide" : "destroy"), y[h][a]());
          }
        ),
        v.hoverSeries === y && (v.hoverSeries = null),
        S(v.series, y);
      for (c in y) delete y[c];
    },
    getSegmentPath: function (a) {
      var h = this,
        c = [],
        g = h.options.step;
      return (
        Mi(a, function (y, i) {
          var v,
            b = y.plotX,
            k = y.plotY;
          h.getPointSpline
            ? c.push.apply(c, h.getPointSpline(a, y, i))
            : (c.push(i ? yi : mi),
              g &&
                i &&
                ((v = a[i - 1]),
                "right" === g
                  ? c.push(v.plotX, k)
                  : "center" === g
                  ? c.push((v.plotX + b) / 2, v.plotY, (v.plotX + b) / 2, k)
                  : c.push(b, v.plotY)),
              c.push(y.plotX, y.plotY));
        }),
        c
      );
    },
    getGraphPath: function () {
      var a,
        h = this,
        c = [],
        g = [];
      return (
        Mi(h.segments, function (y) {
          (a = h.getSegmentPath(y)),
            y.length > 1 ? (c = c.concat(a)) : g.push(y[0]);
        }),
        (h.singlePoints = g),
        (h.graphPath = c),
        c
      );
    },
    drawGraph: function () {
      var a = this,
        h = this.options,
        c = [["graph", h.lineColor || this.color]],
        g = h.lineWidth,
        y = h.dashStyle,
        v = "square" !== h.linecap,
        b = this.getGraphPath(),
        k = h.negativeColor;
      k && c.push(["graphNeg", k]),
        Mi(c, function (c, i) {
          var k,
            w = c[0],
            S = a[w];
          S
            ? (Ei(S), S.animate({ d: b }))
            : g &&
              b.length &&
              ((k = { stroke: c[1], "stroke-width": g, fill: gi, zIndex: 1 }),
              y
                ? (k.dashstyle = y)
                : v && (k["stroke-linecap"] = k["stroke-linejoin"] = "round"),
              (a[w] = a.chart.renderer
                .path(b)
                .attr(k)
                .add(a.group)
                .shadow(!i && h.shadow)));
        });
    },
    clipNeg: function () {
      var a,
        h,
        c,
        g,
        y,
        v = this.options,
        b = this.chart,
        k = b.renderer,
        w = v.negativeColor || v.negativeFillColor,
        S = this.graph,
        T = this.area,
        P = this.posClip,
        A = this.negClip,
        C = b.chartWidth,
        L = b.chartHeight,
        M = Re(C, L),
        D = this.yAxis;
      w &&
        (S || T) &&
        ((a = Be(D.toPixels(v.threshold || 0, !0))),
        0 > a && (M -= a),
        (g = { x: 0, y: 0, width: M, height: a }),
        (y = { x: 0, y: a, width: M, height: M }),
        b.inverted &&
          ((g.height = y.y = b.plotWidth - a),
          k.isVML &&
            ((g = {
              x: b.plotWidth - a - b.plotLeft,
              y: 0,
              width: C,
              height: L,
            }),
            (y = {
              x: a + b.plotLeft - C,
              y: 0,
              width: b.plotLeft + a,
              height: C,
            }))),
        D.reversed ? ((h = y), (c = g)) : ((h = g), (c = y)),
        P
          ? (P.animate(h), A.animate(c))
          : ((this.posClip = P = k.clipRect(h)),
            (this.negClip = A = k.clipRect(c)),
            S && this.graphNeg && (S.clip(P), this.graphNeg.clip(A)),
            T && (T.clip(P), this.areaNeg.clip(A))));
    },
    invertGroups: function () {
      function a() {
        var a = { width: h.yAxis.len, height: h.xAxis.len };
        Mi(["group", "markerGroup"], function (c) {
          h[c] && h[c].attr(a).invert();
        });
      }
      var h = this,
        c = h.chart;
      h.xAxis &&
        (Oi(c, "resize", a),
        Oi(h, "destroy", function () {
          zi(c, "resize", a);
        }),
        a(),
        (h.invertGroups = a));
    },
    plotGroup: function (a, h, c, g, y) {
      var v = this[a],
        b = !v;
      return (
        b &&
          (this[a] = v =
            this.chart.renderer
              .g(h)
              .attr({ visibility: c, zIndex: g || 0.1 })
              .add(y)),
        v[b ? "attr" : "animate"](this.getPlotBox()),
        v
      );
    },
    getPlotBox: function () {
      var a = this.chart,
        h = this.xAxis,
        c = this.yAxis;
      return (
        a.inverted && ((h = c), (c = this.xAxis)),
        {
          translateX: h ? h.left : a.plotLeft,
          translateY: c ? c.top : a.plotTop,
          scaleX: 1,
          scaleY: 1,
        }
      );
    },
    render: function () {
      var a,
        h = this,
        c = h.chart,
        g = h.options,
        y = g.animation,
        v = (y && !!h.animate && c.renderer.isSVG && C(y.duration, 500)) || 0,
        b = h.visible ? di : hi,
        k = g.zIndex,
        w = h.hasRendered,
        S = c.seriesGroup;
      (a = h.plotGroup("group", "series", b, k, S)),
        (h.markerGroup = h.plotGroup("markerGroup", "markers", b, k, S)),
        v && h.animate(!0),
        h.getAttribs(),
        (a.inverted = h.isCartesian ? c.inverted : !1),
        h.drawGraph && (h.drawGraph(), h.clipNeg()),
        h.drawDataLabels && h.drawDataLabels(),
        h.visible && h.drawPoints(),
        h.drawTracker &&
          h.options.enableMouseTracking !== !1 &&
          h.drawTracker(),
        c.inverted && h.invertGroups(),
        g.clip === !1 || h.sharedClipKey || w || a.clip(c.clipRect),
        v && h.animate(),
        w ||
          (v
            ? (h.animationTimeout = setTimeout(function () {
                h.afterAnimate();
              }, v))
            : h.afterAnimate()),
        (h.isDirty = h.isDirtyData = !1),
        (h.hasRendered = !0);
    },
    redraw: function () {
      var a = this,
        h = a.chart,
        c = a.isDirtyData,
        g = a.group,
        y = a.xAxis,
        v = a.yAxis;
      g &&
        (h.inverted && g.attr({ width: h.plotWidth, height: h.plotHeight }),
        g.animate({
          translateX: C(y && y.left, h.plotLeft),
          translateY: C(v && v.top, h.plotTop),
        })),
        a.translate(),
        a.setTooltipPoints && a.setTooltipPoints(!0),
        a.render(),
        c && Ri(a, "updatedData");
    },
  }),
    (Q.prototype = {
      destroy: function () {
        Y(this, this.axis);
      },
      render: function (a) {
        var h = this.options,
          c = h.format,
          g = c ? R(c, this) : h.formatter.call(this);
        this.label
          ? this.label.attr({ text: g, visibility: hi })
          : (this.label = this.axis.chart.renderer
              .text(g, null, null, h.useHTML)
              .css(h.style)
              .attr({
                align: this.textAlign,
                rotation: h.rotation,
                visibility: hi,
              })
              .add(a));
      },
      setOffset: function (a, h) {
        var c,
          g = this,
          y = g.axis,
          v = y.chart,
          b = v.inverted,
          k = this.isNegative,
          w = y.translate(y.usePercentage ? 100 : this.total, 0, 0, 0, 1),
          S = y.translate(0),
          T = Xe(w - S),
          x = v.xAxis[0].translate(this.x) + a,
          P = v.plotHeight,
          A = {
            x: b ? (k ? w : w - T) : x,
            y: b ? P - x - h : k ? P - w - T : P - w,
            width: b ? T : h,
            height: b ? h : T,
          },
          C = this.label;
        C &&
          (C.align(this.alignOptions, null, A),
          (c = C.alignAttr),
          C[
            this.options.crop === !1 || v.isInsidePlot(c.x, c.y)
              ? "show"
              : "hide"
          ](!0));
      },
    }),
    ($.prototype.buildStacks = function () {
      var a = this.series,
        h = C(this.options.reversedStacks, !0),
        i = a.length;
      if (!this.isXAxis) {
        for (this.usePercentage = !1; i--; )
          a[h ? i : a.length - i - 1].setStackedPoints();
        if (this.usePercentage)
          for (i = 0; i < a.length; i++) a[i].setPercentStacks();
      }
    }),
    ($.prototype.renderStackTotals = function () {
      var a,
        h,
        c,
        g = this,
        y = g.chart,
        v = y.renderer,
        b = g.stacks,
        k = g.stackTotalGroup;
      k ||
        (g.stackTotalGroup = k =
          v.g("stack-labels").attr({ visibility: di, zIndex: 6 }).add()),
        k.translate(y.plotLeft, y.plotTop);
      for (a in b) {
        h = b[a];
        for (c in h) h[c].render(k);
      }
    }),
    (cn.prototype.setStackedPoints = function () {
      if (
        this.options.stacking &&
        (this.visible === !0 ||
          this.chart.options.chart.ignoreHiddenSeries === !1)
      ) {
        var a,
          h,
          c,
          g,
          y,
          i,
          x,
          v,
          b = this,
          k = b.processedXData,
          w = b.processedYData,
          S = [],
          T = w.length,
          P = b.options,
          A = P.threshold,
          C = P.stack,
          L = P.stacking,
          M = b.stackKey,
          D = "-" + M,
          I = b.negStacks,
          B = b.yAxis,
          O = B.stacks,
          z = B.oldStacks;
        for (i = 0; T > i; i++)
          (x = k[i]),
            (v = w[i]),
            (y = b.index + "," + i),
            (a = I && A > v),
            (g = a ? D : M),
            O[g] || (O[g] = {}),
            O[g][x] ||
              (z[g] && z[g][x]
                ? ((O[g][x] = z[g][x]), (O[g][x].total = null))
                : (O[g][x] = new Q(B, B.options.stackLabels, a, x, C))),
            (h = O[g][x]),
            (h.points[y] = [h.cum || 0]),
            "percent" === L
              ? ((c = a ? M : D),
                I && O[c] && O[c][x]
                  ? ((c = O[c][x]),
                    (h.total = c.total = Re(c.total, h.total) + Xe(v) || 0))
                  : (h.total = F(h.total + (Xe(v) || 0))))
              : (h.total = F(h.total + (v || 0))),
            (h.cum = (h.cum || 0) + (v || 0)),
            h.points[y].push(h.cum),
            (S[i] = h.cum);
        "percent" === L && (B.usePercentage = !0),
          (this.stackedYData = S),
          (B.oldStacks = {});
      }
    }),
    (cn.prototype.setPercentStacks = function () {
      var a = this,
        h = a.stackKey,
        c = a.yAxis.stacks,
        g = a.processedXData;
      Mi([h, "-" + h], function (h) {
        for (var x, y, v, b, i = g.length; i--; )
          (x = g[i]),
            (y = c[h] && c[h][x]),
            (v = y && y.points[a.index + "," + i]),
            v &&
              ((b = y.total ? 100 / y.total : 0),
              (v[0] = F(v[0] * b)),
              (v[1] = F(v[1] * b)),
              (a.stackedYData[i] = v[1]));
      });
    }),
    a(J.prototype, {
      addSeries: function (a, h, c) {
        var g,
          y = this;
        return (
          a &&
            ((h = C(h, !0)),
            Ri(y, "addSeries", { options: a }, function () {
              (g = y.initSeries(a)),
                (y.isDirtyLegend = !0),
                y.linkSeries(),
                h && y.redraw(c);
            })),
          g
        );
      },
      addAxis: function (a, c, g, y) {
        var v,
          b = c ? "xAxis" : "yAxis",
          k = this.options;
        (v = new $(this, h(a, { index: this[b].length, isX: c }))),
          (k[b] = A(k[b] || {})),
          k[b].push(a),
          C(g, !0) && this.redraw(y);
      },
      showLoading: function (h) {
        var c = this,
          g = c.options,
          y = c.loadingDiv,
          v = g.loading,
          b = function () {
            y &&
              L(y, {
                left: c.plotLeft + pi,
                top: c.plotTop + pi,
                width: c.plotWidth + pi,
                height: c.plotHeight + pi,
              });
          };
        y ||
          ((c.loadingDiv = y =
            M(
              si,
              { className: ci + "loading" },
              a(v.style, { zIndex: 10, display: gi }),
              c.container
            )),
          (c.loadingSpan = M("span", null, v.labelStyle, y)),
          Oi(c, "redraw", b)),
          (c.loadingSpan.innerHTML = h || g.lang.loading),
          c.loadingShown ||
            (L(y, { opacity: 0, display: "" }),
            Xi(
              y,
              { opacity: v.style.opacity },
              { duration: v.showDuration || 0 }
            ),
            (c.loadingShown = !0)),
          b();
      },
      hideLoading: function () {
        var a = this.options,
          h = this.loadingDiv;
        h &&
          Xi(
            h,
            { opacity: 0 },
            {
              duration: a.loading.hideDuration || 100,
              complete: function () {
                L(h, { display: gi });
              },
            }
          ),
          (this.loadingShown = !1);
      },
    }),
    a(hn.prototype, {
      update: function (a, h, c) {
        var i,
          g = this,
          v = g.series,
          b = g.graphic,
          k = v.data,
          w = v.chart,
          S = v.options;
        (h = C(h, !0)),
          g.firePointEvent("update", { options: a }, function () {
            g.applyOptions(a),
              y(a) &&
                (v.getAttribs(),
                b &&
                  (a && a.marker && a.marker.symbol
                    ? (g.graphic = b.destroy())
                    : b.attr(g.pointAttr[g.state || ""])),
                a &&
                  a.dataLabels &&
                  g.dataLabel &&
                  (g.dataLabel = g.dataLabel.destroy())),
              (i = Li(g, k)),
              v.updateParallelArrays(g, i),
              (S.data[i] = g.options),
              (v.isDirty = v.isDirtyData = !0),
              !v.fixedBox && v.hasCartesianSeries && (w.isDirtyBox = !0),
              "point" === S.legendType && w.legend.destroyItem(g),
              h && w.redraw(c);
          });
      },
      remove: function (a, h) {
        var i,
          c = this,
          g = c.series,
          y = g.points,
          v = g.chart,
          b = g.data;
        j(h, v),
          (a = C(a, !0)),
          c.firePointEvent("remove", null, function () {
            (i = Li(c, b)),
              b.length === y.length && y.splice(i, 1),
              b.splice(i, 1),
              g.options.data.splice(i, 1),
              g.updateParallelArrays(c, "splice", i, 1),
              c.destroy(),
              (g.isDirty = !0),
              (g.isDirtyData = !0),
              a && v.redraw();
          });
      },
    }),
    a(cn.prototype, {
      addPoint: function (a, h, c, g) {
        var y,
          v,
          x,
          i,
          b = this,
          k = b.options,
          w = b.data,
          S = b.graph,
          T = b.area,
          P = b.chart,
          A = b.xAxis && b.xAxis.names,
          L = (S && S.shift) || 0,
          M = k.data,
          D = b.xData;
        if (
          (j(g, P),
          c &&
            Mi([S, T, b.graphNeg, b.areaNeg], function (a) {
              a && (a.shift = L + 1);
            }),
          T && (T.isArea = !0),
          (h = C(h, !0)),
          (y = { series: b }),
          b.pointClass.prototype.applyOptions.apply(y, [a]),
          (x = y.x),
          (i = D.length),
          b.requireSorting && x < D[i - 1])
        )
          for (v = !0; i && D[i - 1] > x; ) i--;
        b.updateParallelArrays(y, "splice", i, 0, 0),
          b.updateParallelArrays(y, i),
          A && (A[x] = y.name),
          M.splice(i, 0, a),
          v && (b.data.splice(i, 0, null), b.processData()),
          "point" === k.legendType && b.generatePoints(),
          c &&
            (w[0] && w[0].remove
              ? w[0].remove(!1)
              : (w.shift(), b.updateParallelArrays(y, "shift"), M.shift())),
          (b.isDirty = !0),
          (b.isDirtyData = !0),
          h && (b.getAttribs(), P.redraw());
      },
      remove: function (a, h) {
        var c = this,
          g = c.chart;
        (a = C(a, !0)),
          c.isRemoving ||
            ((c.isRemoving = !0),
            Ri(c, "remove", null, function () {
              c.destroy(),
                (g.isDirtyLegend = g.isDirtyBox = !0),
                g.linkSeries(),
                a && g.redraw(h);
            })),
          (c.isRemoving = !1);
      },
      update: function (c, g) {
        var n,
          y = this,
          v = this.chart,
          b = this.userOptions,
          k = this.type,
          w = Si[k].prototype,
          S = ["group", "markerGroup", "dataLabelsGroup"];
        Mi(S, function (a) {
          (S[a] = y[a]), delete y[a];
        }),
          (c = h(
            b,
            { animation: !1, index: this.index, pointStart: this.xData[0] },
            { data: this.options.data },
            c
          )),
          this.remove(!1);
        for (n in w) w.hasOwnProperty(n) && (this[n] = te);
        a(this, Si[c.type || k].prototype),
          Mi(S, function (a) {
            y[a] = S[a];
          }),
          this.init(v, c),
          v.linkSeries(),
          C(g, !0) && v.redraw(!1);
      },
    }),
    a($.prototype, {
      update: function (c, g) {
        var y = this.chart;
        (c = y.options[this.coll][this.options.index] = h(this.userOptions, c)),
          this.destroy(!0),
          (this._addedPlotLB = te),
          this.init(y, a(c, { events: te })),
          (y.isDirtyBox = !0),
          C(g, !0) && y.redraw();
      },
      remove: function (a) {
        for (
          var h = this.chart, c = this.coll, g = this.series, i = g.length;
          i--;

        )
          g[i] && g[i].remove(!1);
        S(h.axes, this),
          S(h[c], this),
          h.options[c].splice(this.options.index, 1),
          Mi(h[c], function (a, i) {
            a.options.index = i;
          }),
          this.destroy(),
          (h.isDirtyBox = !0),
          C(a, !0) && h.redraw();
      },
      setTitle: function (a, h) {
        this.update({ title: a }, h);
      },
      setCategories: function (a, h) {
        this.update({ categories: a }, h);
      },
    });
  var dn = D(cn);
  (Si.line = dn), (Wi.area = h(Yi, { threshold: 0 }));
  var pn = D(cn, {
    type: "area",
    getSegments: function () {
      var a,
        h,
        i,
        x,
        c = this,
        g = [],
        y = [],
        v = [],
        b = this.xAxis,
        k = this.yAxis,
        w = k.stacks[this.stackKey],
        S = {},
        T = this.points,
        P = this.options.connectNulls;
      if (this.options.stacking && !this.cropped) {
        for (i = 0; i < T.length; i++) S[T[i].x] = T[i];
        for (x in w) null !== w[x].total && v.push(+x);
        v.sort(function (a, h) {
          return a - h;
        }),
          Mi(v, function (x) {
            var g,
              v = 0;
            if (!P || (S[x] && null !== S[x].y))
              if (S[x]) y.push(S[x]);
              else {
                for (i = c.index; i <= k.series.length; i++)
                  if ((g = w[x].points[i + "," + x])) {
                    v = g[1];
                    break;
                  }
                (a = b.translate(x)),
                  (h = k.toPixels(v, !0)),
                  y.push({
                    y: null,
                    plotX: a,
                    clientX: a,
                    plotY: h,
                    yBottom: h,
                    onMouseOver: ei,
                  });
              }
          }),
          y.length && g.push(y);
      } else cn.prototype.getSegments.call(this), (g = this.segments);
      this.segments = g;
    },
    getSegmentPath: function (a) {
      var i,
        h,
        c = cn.prototype.getSegmentPath.call(this, a),
        g = [].concat(c),
        y = this.options,
        v = c.length,
        b = this.yAxis.getThreshold(y.threshold);
      if ((3 === v && g.push(yi, c[1], c[2]), y.stacking && !this.closedStacks))
        for (i = a.length - 1; i >= 0; i--)
          (h = C(a[i].yBottom, b)),
            i < a.length - 1 && y.step && g.push(a[i + 1].plotX, h),
            g.push(a[i].plotX, h);
      else this.closeSegment(g, a, b);
      return (this.areaPath = this.areaPath.concat(g)), c;
    },
    closeSegment: function (a, h, c) {
      a.push(yi, h[h.length - 1].plotX, c, yi, h[0].plotX, c);
    },
    drawGraph: function () {
      (this.areaPath = []), cn.prototype.drawGraph.apply(this);
      var a = this,
        h = this.areaPath,
        c = this.options,
        g = c.negativeColor,
        y = c.negativeFillColor,
        v = [["area", this.color, c.fillColor]];
      (g || y) && v.push(["areaNeg", g, y]),
        Mi(v, function (g) {
          var y = g[0],
            v = a[y];
          v
            ? v.animate({ d: h })
            : (a[y] = a.chart.renderer
                .path(h)
                .attr({
                  fill: C(
                    g[2],
                    Vi(g[1]).setOpacity(C(c.fillOpacity, 0.75)).get()
                  ),
                  zIndex: 0,
                })
                .add(a.group));
        });
    },
    drawLegendSymbol: an.drawRectangle,
  });
  (Si.area = pn), (Wi.spline = h(Yi));
  var un = D(cn, {
    type: "spline",
    getPointSpline: function (a, h, i) {
      var c,
        g,
        y,
        v,
        b,
        k = 1.5,
        w = k + 1,
        S = h.plotX,
        T = h.plotY,
        P = a[i - 1],
        A = a[i + 1];
      if (P && A) {
        var C,
          L = P.plotX,
          M = P.plotY,
          D = A.plotX,
          I = A.plotY;
        (c = (k * S + L) / w),
          (g = (k * T + M) / w),
          (y = (k * S + D) / w),
          (v = (k * T + I) / w),
          (C = ((v - g) * (y - S)) / (y - c) + T - v),
          (g += C),
          (v += C),
          g > M && g > T
            ? ((g = Re(M, T)), (v = 2 * T - g))
            : M > g && T > g && ((g = He(M, T)), (v = 2 * T - g)),
          v > I && v > T
            ? ((v = Re(I, T)), (g = 2 * T - v))
            : I > v && T > v && ((v = He(I, T)), (g = 2 * T - v)),
          (h.rightContX = y),
          (h.rightContY = v);
      }
      return (
        i
          ? ((b = [
              "C",
              P.rightContX || P.plotX,
              P.rightContY || P.plotY,
              c || S,
              g || T,
              S,
              T,
            ]),
            (P.rightContX = P.rightContY = null))
          : (b = [mi, S, T]),
        b
      );
    },
  });
  (Si.spline = un), (Wi.areaspline = h(Wi.area));
  var fn = pn.prototype,
    gn = D(un, {
      type: "areaspline",
      closedStacks: !0,
      getSegmentPath: fn.getSegmentPath,
      closeSegment: fn.closeSegment,
      drawGraph: fn.drawGraph,
      drawLegendSymbol: an.drawRectangle,
    });
  (Si.areaspline = gn),
    (Wi.column = h(Yi, {
      borderColor: "#FFFFFF",
      borderRadius: 0,
      groupPadding: 0.2,
      marker: null,
      pointPadding: 0.1,
      minPointLength: 0,
      cropThreshold: 50,
      pointRange: null,
      states: {
        hover: { brightness: 0.1, shadow: !1, halo: !1 },
        select: { color: "#C0C0C0", borderColor: "#000000", shadow: !1 },
      },
      dataLabels: { align: null, verticalAlign: null, y: null },
      stickyTracking: !1,
      tooltip: { distance: 6 },
      threshold: 0,
    }));
  var mn = D(cn, {
    type: "column",
    pointAttrToOptions: {
      stroke: "borderColor",
      fill: "color",
      r: "borderRadius",
    },
    cropShoulder: 0,
    trackerGroups: ["group", "dataLabelsGroup"],
    negStacks: !0,
    init: function () {
      cn.prototype.init.apply(this, arguments);
      var a = this,
        h = a.chart;
      h.hasRendered &&
        Mi(h.series, function (h) {
          h.type === a.type && (h.isDirty = !0);
        });
    },
    getColumnMetrics: function () {
      var a,
        h,
        c = this,
        g = c.options,
        y = c.xAxis,
        v = c.yAxis,
        b = y.reversed,
        k = {},
        w = 0;
      g.grouping === !1
        ? (w = 1)
        : Mi(c.chart.series, function (g) {
            var y = g.options,
              b = g.yAxis;
            g.type === c.type &&
              g.visible &&
              v.len === b.len &&
              v.pos === b.pos &&
              (y.stacking
                ? ((a = g.stackKey), k[a] === te && (k[a] = w++), (h = k[a]))
                : y.grouping !== !1 && (h = w++),
              (g.columnIndex = h));
          });
      var S = He(
          Xe(y.transA) *
            (y.ordinalSlope ||
              g.pointRange ||
              y.closestPointRange ||
              y.tickInterval ||
              1),
          y.len
        ),
        P = S * g.groupPadding,
        A = S - 2 * P,
        L = A / w,
        M = g.pointWidth,
        D = T(M) ? (L - M) / 2 : L * g.pointPadding,
        I = C(M, L - 2 * D),
        B = (b ? w - (c.columnIndex || 0) : c.columnIndex) || 0,
        O = D + (P + B * L - S / 2) * (b ? -1 : 1);
      return (c.columnMetrics = { width: I, offset: O });
    },
    translate: function () {
      var a = this,
        h = a.chart,
        c = a.options,
        g = (a.borderWidth = C(
          c.borderWidth,
          a.activePointCount > 0.5 * a.xAxis.len ? 0 : 1
        )),
        y = a.yAxis,
        v = c.threshold,
        b = (a.translatedThreshold = y.getThreshold(v)),
        k = C(c.minPointLength, 5),
        w = a.getColumnMetrics(),
        S = w.width,
        T = (a.barW = Re(S, 1 + 2 * g)),
        P = (a.pointXOffset = w.offset),
        A = -(g % 2 ? 0.5 : 0),
        L = g % 2 ? 0.5 : 1;
      h.renderer.isVML && h.inverted && (L += 1),
        c.pointPadding && (T = ze(T)),
        cn.prototype.translate.apply(a),
        Mi(a.points, function (c) {
          var g,
            v,
            w,
            M = C(c.yBottom, b),
            D = He(Re(-999 - M, c.plotY), y.len + 999 + M),
            I = c.plotX + P,
            B = T,
            O = He(D, M),
            z = Re(D, M) - O;
          Xe(z) < k &&
            k &&
            ((z = k),
            (O = Be(
              Xe(O - b) > k
                ? M - k
                : b - (y.translate(c.y, 0, 1, 0, 1) <= b ? k : 0)
            ))),
            (c.barX = I),
            (c.pointWidth = S),
            (c.tooltipPos = h.inverted
              ? [y.len - D, a.xAxis.len - I - B / 2]
              : [I + B / 2, D]),
            (g = Be(I + B) + A),
            (I = Be(I) + A),
            (B = g - I),
            (w = Xe(O) < 0.5),
            (v = Be(O + z) + L),
            (O = Be(O) + L),
            (z = v - O),
            w && ((O -= 1), (z += 1)),
            (c.shapeType = "rect"),
            (c.shapeArgs = { x: I, y: O, width: B, height: z });
        });
    },
    getSymbol: ei,
    drawLegendSymbol: an.drawRectangle,
    drawGraph: ei,
    drawPoints: function () {
      var a,
        c,
        g = this,
        y = this.chart,
        v = g.options,
        b = y.renderer,
        k = v.animationLimit || 250;
      Mi(g.points, function (w) {
        var S,
          P = w.plotY,
          A = w.graphic;
        P === te || isNaN(P) || null === w.y
          ? A && (w.graphic = A.destroy())
          : ((a = w.shapeArgs),
            (S = T(g.borderWidth) ? { "stroke-width": g.borderWidth } : {}),
            (c = w.pointAttr[w.selected ? ki : xi] || g.pointAttr[xi]),
            A
              ? (Ei(A), A.attr(S)[y.pointCount < k ? "animate" : "attr"](h(a)))
              : (w.graphic = A =
                  b[w.shapeType](a)
                    .attr(c)
                    .attr(S)
                    .add(g.group)
                    .shadow(v.shadow, null, v.stacking && !v.borderRadius)));
      });
    },
    animate: function (a) {
      var h,
        c = this,
        g = this.yAxis,
        y = c.options,
        v = this.chart.inverted,
        b = {};
      $e &&
        (a
          ? ((b.scaleY = 0.001),
            (h = He(g.pos + g.len, Re(g.pos, g.toPixels(y.threshold)))),
            v ? (b.translateX = h - g.len) : (b.translateY = h),
            c.group.attr(b))
          : ((b.scaleY = 1),
            (b[v ? "translateX" : "translateY"] = g.pos),
            c.group.animate(b, c.options.animation),
            (c.animate = null)));
    },
    remove: function () {
      var a = this,
        h = a.chart;
      h.hasRendered &&
        Mi(h.series, function (h) {
          h.type === a.type && (h.isDirty = !0);
        }),
        cn.prototype.remove.apply(a, arguments);
    },
  });
  (Si.column = mn), (Wi.bar = h(Wi.column));
  var yn = D(mn, { type: "bar", inverted: !0 });
  (Si.bar = yn),
    (Wi.scatter = h(Yi, {
      lineWidth: 0,
      tooltip: {
        headerFormat:
          '<span style="color:{series.color}">●</span> <span style="font-size: 10px;"> {series.name}</span><br/>',
        pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>",
      },
      stickyTracking: !1,
    }));
  var vn = D(cn, {
    type: "scatter",
    sorted: !1,
    requireSorting: !1,
    noSharedTooltip: !0,
    trackerGroups: ["markerGroup", "dataLabelsGroup"],
    takeOrdinalPosition: !1,
    singularTooltips: !0,
    drawGraph: function () {
      this.options.lineWidth && cn.prototype.drawGraph.call(this);
    },
  });
  (Si.scatter = vn),
    (Wi.pie = h(Yi, {
      borderColor: "#FFFFFF",
      borderWidth: 1,
      center: [null, null],
      clip: !1,
      colorByPoint: !0,
      dataLabels: {
        distance: 30,
        enabled: !0,
        formatter: function () {
          return this.point.name;
        },
      },
      ignoreHiddenPoint: !0,
      legendType: "point",
      marker: null,
      size: null,
      showInLegend: !1,
      slicedOffset: 10,
      states: { hover: { brightness: 0.1, shadow: !1 } },
      stickyTracking: !1,
      tooltip: { followPointer: !0 },
    }));
  var xn = D(hn, {
      init: function () {
        hn.prototype.init.apply(this, arguments);
        var h,
          c = this;
        return (
          c.y < 0 && (c.y = null),
          a(c, { visible: c.visible !== !1, name: C(c.name, "Slice") }),
          (h = function (e) {
            c.slice("select" === e.type);
          }),
          Oi(c, "select", h),
          Oi(c, "unselect", h),
          c
        );
      },
      setVisible: function (a) {
        var h = this,
          c = h.series,
          g = c.chart;
        (h.visible = h.options.visible = a = a === te ? !h.visible : a),
          (c.options.data[Li(h, c.data)] = h.options),
          Mi(
            ["graphic", "dataLabel", "connector", "shadowGroup"],
            function (c) {
              h[c] && h[c][a ? "show" : "hide"](!0);
            }
          ),
          h.legendItem && g.legend.colorizeItem(h, a),
          !c.isDirty &&
            c.options.ignoreHiddenPoint &&
            ((c.isDirty = !0), g.redraw());
      },
      slice: function (a, h, c) {
        var g,
          y = this,
          v = y.series,
          b = v.chart;
        j(c, b),
          (h = C(h, !0)),
          (y.sliced = y.options.sliced = a = T(a) ? a : !y.sliced),
          (v.options.data[Li(y, v.data)] = y.options),
          (g = a ? y.slicedTranslation : { translateX: 0, translateY: 0 }),
          y.graphic.animate(g),
          y.shadowGroup && y.shadowGroup.animate(g);
      },
      haloPath: function (a) {
        var h = this.shapeArgs,
          c = this.series.chart;
        return this.sliced || !this.visible
          ? []
          : this.series.chart.renderer.symbols.arc(
              c.plotLeft + h.x,
              c.plotTop + h.y,
              h.r + a,
              h.r + a,
              { innerR: this.shapeArgs.r, start: h.start, end: h.end }
            );
      },
    }),
    bn = {
      type: "pie",
      isCartesian: !1,
      pointClass: xn,
      requireSorting: !1,
      noSharedTooltip: !0,
      trackerGroups: ["group", "dataLabelsGroup"],
      axisTypes: [],
      pointAttrToOptions: {
        stroke: "borderColor",
        "stroke-width": "borderWidth",
        fill: "color",
      },
      singularTooltips: !0,
      getColor: ei,
      animate: function (a) {
        var h = this,
          c = h.points,
          g = h.startAngleRad;
        a ||
          (Mi(c, function (a) {
            var c = a.graphic,
              y = a.shapeArgs;
            c &&
              (c.attr({ r: h.center[3] / 2, start: g, end: g }),
              c.animate(
                { r: y.r, start: y.start, end: y.end },
                h.options.animation
              ));
          }),
          (h.animate = null));
      },
      setData: function (a, h, c, g) {
        cn.prototype.setData.call(this, a, !1, c, g),
          this.processData(),
          this.generatePoints(),
          C(h, !0) && this.chart.redraw(c);
      },
      generatePoints: function () {
        var i,
          a,
          h,
          c,
          g = 0,
          y = this.options.ignoreHiddenPoint;
        for (
          cn.prototype.generatePoints.call(this),
            a = this.points,
            h = a.length,
            i = 0;
          h > i;
          i++
        )
          (c = a[i]), (g += y && !c.visible ? 0 : c.y);
        for (this.total = g, i = 0; h > i; i++)
          (c = a[i]),
            (c.percentage = g > 0 ? (c.y / g) * 100 : 0),
            (c.total = g);
      },
      translate: function (a) {
        this.generatePoints();
        var h,
          c,
          g,
          y,
          v,
          i,
          b,
          k = this,
          w = 0,
          S = 1e3,
          T = k.options,
          P = T.slicedOffset,
          A = P + T.borderWidth,
          L = T.startAngle || 0,
          M = (k.startAngleRad = (We / 180) * (L - 90)),
          D = (k.endAngleRad = (We / 180) * (C(T.endAngle, L + 360) - 90)),
          I = D - M,
          B = k.points,
          O = T.dataLabels.distance,
          z = T.ignoreHiddenPoint,
          R = B.length;
        for (
          a || (k.center = a = k.getCenter()),
            k.getX = function (h, c) {
              return (
                (g = Ie.asin(He((h - a[1]) / (a[2] / 2 + O), 1))),
                a[0] + (c ? -1 : 1) * Ee(g) * (a[2] / 2 + O)
              );
            },
            i = 0;
          R > i;
          i++
        )
          (b = B[i]),
            (h = M + w * I),
            (!z || b.visible) && (w += b.percentage / 100),
            (c = M + w * I),
            (b.shapeType = "arc"),
            (b.shapeArgs = {
              x: a[0],
              y: a[1],
              r: a[2] / 2,
              innerR: a[3] / 2,
              start: Be(h * S) / S,
              end: Be(c * S) / S,
            }),
            (g = (c + h) / 2),
            g > 1.5 * We ? (g -= 2 * We) : -We / 2 > g && (g += 2 * We),
            (b.slicedTranslation = {
              translateX: Be(Ee(g) * P),
              translateY: Be(Ge(g) * P),
            }),
            (y = (Ee(g) * a[2]) / 2),
            (v = (Ge(g) * a[2]) / 2),
            (b.tooltipPos = [a[0] + 0.7 * y, a[1] + 0.7 * v]),
            (b.half = -We / 2 > g || g > We / 2 ? 1 : 0),
            (b.angle = g),
            (A = He(A, O / 2)),
            (b.labelPos = [
              a[0] + y + Ee(g) * O,
              a[1] + v + Ge(g) * O,
              a[0] + y + Ee(g) * A,
              a[1] + v + Ge(g) * A,
              a[0] + y,
              a[1] + v,
              0 > O ? "center" : b.half ? "right" : "left",
              g,
            ]);
      },
      drawGraph: null,
      drawPoints: function () {
        var h,
          c,
          g,
          y,
          v = this,
          b = v.chart,
          k = b.renderer,
          w = v.options.shadow;
        w && !v.shadowGroup && (v.shadowGroup = k.g("shadow").add(v.group)),
          Mi(v.points, function (b) {
            (c = b.graphic),
              (y = b.shapeArgs),
              (g = b.shadowGroup),
              w && !g && (g = b.shadowGroup = k.g("shadow").add(v.shadowGroup)),
              (h = b.sliced
                ? b.slicedTranslation
                : { translateX: 0, translateY: 0 }),
              g && g.attr(h),
              c
                ? c.animate(a(y, h))
                : (b.graphic = c =
                    k[b.shapeType](y)
                      .setRadialReference(v.center)
                      .attr(b.pointAttr[b.selected ? ki : xi])
                      .attr({ "stroke-linejoin": "round" })
                      .attr(h)
                      .add(v.group)
                      .shadow(w, g)),
              void 0 !== b.visible && b.setVisible(b.visible);
          });
      },
      sortByAngle: function (a, h) {
        a.sort(function (a, c) {
          return void 0 !== a.angle && (c.angle - a.angle) * h;
        });
      },
      drawLegendSymbol: an.drawRectangle,
      getCenter: ln.getCenter,
      getSymbol: ei,
    };
  (bn = D(cn, bn)),
    (Si.pie = bn),
    (cn.prototype.drawDataLabels = function () {
      var c,
        g,
        y,
        v,
        b = this,
        k = b.options,
        w = k.cursor,
        S = k.dataLabels,
        P = b.points;
      (S.enabled || b._hasPointLabels) &&
        (b.dlProcessOptions && b.dlProcessOptions(S),
        (v = b.plotGroup(
          "dataLabelsGroup",
          "data-labels",
          S.defer ? hi : di,
          S.zIndex || 6
        )),
        !b.hasRendered &&
          C(S.defer, !0) &&
          (v.attr({ opacity: 0 }),
          Oi(b, "afterAnimate", function () {
            b.visible && v.show(),
              v[k.animation ? "animate" : "attr"](
                { opacity: 1 },
                { duration: 200 }
              );
          })),
        (g = S),
        Mi(P, function (k) {
          var P,
            A,
            L,
            M,
            D,
            I = k.dataLabel,
            B = k.connector,
            O = !0;
          if (
            ((c = k.options && k.options.dataLabels),
            (P = C(c && c.enabled, g.enabled)),
            I && !P)
          )
            k.dataLabel = I.destroy();
          else if (P) {
            if (
              ((S = h(g, c)),
              (D = S.rotation),
              (A = k.getLabelConfig()),
              (y = S.format ? R(S.format, A) : S.formatter.call(A, S)),
              (S.style.color = C(S.color, S.style.color, b.color, "black")),
              I)
            )
              T(y)
                ? (I.attr({ text: y }), (O = !1))
                : ((k.dataLabel = I = I.destroy()),
                  B && (k.connector = B.destroy()));
            else if (T(y)) {
              L = {
                fill: S.backgroundColor,
                stroke: S.borderColor,
                "stroke-width": S.borderWidth,
                r: S.borderRadius || 0,
                rotation: D,
                padding: S.padding,
                zIndex: 1,
              };
              for (M in L) L[M] === te && delete L[M];
              I = k.dataLabel = b.chart.renderer[D ? "text" : "label"](
                y,
                0,
                -999,
                null,
                null,
                null,
                S.useHTML
              )
                .attr(L)
                .css(a(S.style, w && { cursor: w }))
                .add(v)
                .shadow(S.shadow);
            }
            I && b.alignDataLabel(k, I, S, null, O);
          }
        }));
    }),
    (cn.prototype.alignDataLabel = function (h, c, g, y, v) {
      var b,
        k = this.chart,
        w = k.inverted,
        S = C(h.plotX, -999),
        T = C(h.plotY, -999),
        P = c.getBBox(),
        A =
          this.visible &&
          (h.series.forceDL ||
            k.isInsidePlot(S, Be(T), w) ||
            (y && k.isInsidePlot(S, w ? y.x + 1 : y.y + y.height - 1, w)));
      A &&
        ((y = a(
          {
            x: w ? k.plotWidth - T : S,
            y: Be(w ? k.plotHeight - S : T),
            width: 0,
            height: 0,
          },
          y
        )),
        a(g, { width: P.width, height: P.height }),
        g.rotation
          ? c[v ? "attr" : "animate"]({
              x: y.x + g.x + y.width / 2,
              y: y.y + g.y + y.height / 2,
            }).attr({ align: g.align })
          : (c.align(g, null, y),
            (b = c.alignAttr),
            "justify" === C(g.overflow, "justify")
              ? this.justifyDataLabel(c, g, b, P, y, v)
              : C(g.crop, !0) &&
                (A =
                  k.isInsidePlot(b.x, b.y) &&
                  k.isInsidePlot(b.x + P.width, b.y + P.height)))),
        A || (c.attr({ y: -999 }), (c.placed = !1));
    }),
    (cn.prototype.justifyDataLabel = function (a, h, c, g, y, v) {
      var b,
        k,
        w = this.chart,
        S = h.align,
        T = h.verticalAlign;
      (b = c.x),
        0 > b && ("right" === S ? (h.align = "left") : (h.x = -b), (k = !0)),
        (b = c.x + g.width),
        b > w.plotWidth &&
          ("left" === S ? (h.align = "right") : (h.x = w.plotWidth - b),
          (k = !0)),
        (b = c.y),
        0 > b &&
          ("bottom" === T ? (h.verticalAlign = "top") : (h.y = -b), (k = !0)),
        (b = c.y + g.height),
        b > w.plotHeight &&
          ("top" === T
            ? (h.verticalAlign = "bottom")
            : (h.y = w.plotHeight - b),
          (k = !0)),
        k && ((a.placed = !v), a.align(h, null, y));
    }),
    Si.pie &&
      ((Si.pie.prototype.drawDataLabels = function () {
        var a,
          h,
          c,
          g,
          y,
          v,
          b,
          x,
          k,
          w,
          S,
          i,
          T,
          P = this,
          A = P.data,
          L = P.chart,
          M = P.options.dataLabels,
          D = C(M.connectorPadding, 10),
          I = C(M.connectorWidth, 1),
          B = L.plotWidth,
          O = L.plotHeight,
          z = C(M.softConnector, !0),
          R = M.distance,
          H = P.center,
          X = H[2] / 2,
          E = H[1],
          G = R > 0,
          Y = [[], []],
          N = [0, 0, 0, 0],
          F = function (a, h) {
            return h.y - a.y;
          };
        if (P.visible && (M.enabled || P._hasPointLabels)) {
          for (
            cn.prototype.drawDataLabels.apply(P),
              Mi(A, function (a) {
                a.dataLabel && a.visible && Y[a.half].push(a);
              }),
              i = 2;
            i--;

          ) {
            var j,
              V,
              _,
              U,
              Z = [],
              K = [],
              $ = Y[i],
              J = $.length;
            if (J) {
              for (P.sortByAngle($, i - 0.5), T = b = 0; !b && $[T]; )
                (b =
                  $[T] &&
                  $[T].dataLabel &&
                  ($[T].dataLabel.getBBox().height || 21)),
                  T++;
              if (R > 0) {
                for (
                  _ = He(E + X + R, L.plotHeight), V = Re(0, E - X - R);
                  _ >= V;
                  V += b
                )
                  Z.push(V);
                if (((j = Z.length), J > j)) {
                  for (S = [].concat($), S.sort(F), T = J; T--; ) S[T].rank = T;
                  for (T = J; T--; ) $[T].rank >= j && $.splice(T, 1);
                  J = $.length;
                }
                for (T = 0; J > T; T++) {
                  (a = $[T]), (v = a.labelPos);
                  var Q,
                    te,
                    ee = 9999;
                  for (te = 0; j > te; te++)
                    (Q = Xe(Z[te] - v[1])), ee > Q && ((ee = Q), (U = te));
                  if (T > U && null !== Z[T]) U = T;
                  else if (J - T + U > j && null !== Z[T])
                    for (U = j - J + T; null === Z[U]; ) U++;
                  else for (; null === Z[U]; ) U++;
                  K.push({ i: U, y: Z[U] }), (Z[U] = null);
                }
                K.sort(F);
              }
              for (T = 0; J > T; T++) {
                var ie, oe;
                (a = $[T]),
                  (v = a.labelPos),
                  (g = a.dataLabel),
                  (w = a.visible === !1 ? hi : di),
                  (oe = v[1]),
                  R > 0
                    ? ((ie = K.pop()),
                      (U = ie.i),
                      (k = ie.y),
                      ((oe > k && null !== Z[U + 1]) ||
                        (k > oe && null !== Z[U - 1])) &&
                        (k = He(Re(0, oe), L.plotHeight)))
                    : (k = oe),
                  (x = M.justify
                    ? H[0] + (i ? -1 : 1) * (X + R)
                    : P.getX(k === E - X - R || k === E + X + R ? oe : k, i)),
                  (g._attr = { visibility: w, align: v[6] }),
                  (g._pos = {
                    x: x + M.x + ({ left: D, right: -D }[v[6]] || 0),
                    y: k + M.y - 10,
                  }),
                  (g.connX = x),
                  (g.connY = k),
                  null === this.options.size &&
                    ((y = g.width),
                    D > x - y
                      ? (N[3] = Re(Be(y - x + D), N[3]))
                      : x + y > B - D && (N[1] = Re(Be(x + y - B + D), N[1])),
                    0 > k - b / 2
                      ? (N[0] = Re(Be(-k + b / 2), N[0]))
                      : k + b / 2 > O && (N[2] = Re(Be(k + b / 2 - O), N[2])));
              }
            }
          }
          (0 === W(N) || this.verifyDataLabelOverflow(N)) &&
            (this.placeDataLabels(),
            G &&
              I &&
              Mi(this.points, function (a) {
                (h = a.connector),
                  (v = a.labelPos),
                  (g = a.dataLabel),
                  g && g._pos
                    ? ((w = g._attr.visibility),
                      (x = g.connX),
                      (k = g.connY),
                      (c = z
                        ? [
                            mi,
                            x + ("left" === v[6] ? 5 : -5),
                            k,
                            "C",
                            x,
                            k,
                            2 * v[2] - v[4],
                            2 * v[3] - v[5],
                            v[2],
                            v[3],
                            yi,
                            v[4],
                            v[5],
                          ]
                        : [
                            mi,
                            x + ("left" === v[6] ? 5 : -5),
                            k,
                            yi,
                            v[2],
                            v[3],
                            yi,
                            v[4],
                            v[5],
                          ]),
                      h
                        ? (h.animate({ d: c }), h.attr("visibility", w))
                        : (a.connector = h =
                            P.chart.renderer
                              .path(c)
                              .attr({
                                "stroke-width": I,
                                stroke:
                                  M.connectorColor || a.color || "#606060",
                                visibility: w,
                              })
                              .add(P.dataLabelsGroup)))
                    : h && (a.connector = h.destroy());
              }));
        }
      }),
      (Si.pie.prototype.placeDataLabels = function () {
        Mi(this.points, function (a) {
          var h,
            c = a.dataLabel;
          c &&
            ((h = c._pos),
            h
              ? (c.attr(c._attr),
                c[c.moved ? "animate" : "attr"](h),
                (c.moved = !0))
              : c && c.attr({ y: -999 }));
        });
      }),
      (Si.pie.prototype.alignDataLabel = ei),
      (Si.pie.prototype.verifyDataLabelOverflow = function (a) {
        var h,
          c = this.center,
          g = this.options,
          y = g.center,
          v = g.minSize || 80,
          b = v;
        return (
          null !== y[0]
            ? (b = Re(c[2] - Re(a[1], a[3]), v))
            : ((b = Re(c[2] - a[1] - a[3], v)), (c[0] += (a[3] - a[1]) / 2)),
          null !== y[1]
            ? (b = Re(He(b, c[2] - Re(a[0], a[2])), v))
            : ((b = Re(He(b, c[2] - a[0] - a[2]), v)),
              (c[1] += (a[0] - a[2]) / 2)),
          b < c[2]
            ? ((c[2] = b),
              this.translate(c),
              Mi(this.points, function (a) {
                a.dataLabel && (a.dataLabel._pos = null);
              }),
              this.drawDataLabels && this.drawDataLabels())
            : (h = !0),
          h
        );
      })),
    Si.column &&
      (Si.column.prototype.alignDataLabel = function (a, c, g, y, v) {
        var b = this.chart,
          k = b.inverted,
          w = a.dlBox || a.shapeArgs,
          S = a.below || a.plotY > C(this.translatedThreshold, b.plotSizeY),
          T = C(g.inside, !!this.options.stacking);
        w &&
          ((y = h(w)),
          k &&
            (y = {
              x: b.plotWidth - y.y - y.height,
              y: b.plotHeight - y.x - y.width,
              width: y.height,
              height: y.width,
            }),
          T ||
            (k
              ? ((y.x += S ? 0 : y.width), (y.width = 0))
              : ((y.y += S ? y.height : 0), (y.height = 0)))),
          (g.align = C(g.align, !k || T ? "center" : S ? "right" : "left")),
          (g.verticalAlign = C(
            g.verticalAlign,
            k || T ? "middle" : S ? "top" : "bottom"
          )),
          cn.prototype.alignDataLabel.call(this, a, c, g, y, v);
      });
  var kn = (Le.TrackerMixin = {
    drawTrackerPoint: function () {
      var a = this,
        h = a.chart,
        c = h.pointer,
        g = a.options.cursor,
        y = g && { cursor: g },
        v = function (e) {
          var c,
            g = e.target;
          for (h.hoverSeries !== a && a.onMouseOver(); g && !c; )
            (c = g.point), (g = g.parentNode);
          c !== te && c !== h.hoverPoint && c.onMouseOver(e);
        };
      Mi(a.points, function (a) {
        a.graphic && (a.graphic.element.point = a),
          a.dataLabel && (a.dataLabel.element.point = a);
      }),
        a._hasTracking ||
          (Mi(a.trackerGroups, function (h) {
            a[h] &&
              (a[h]
                .addClass(ci + "tracker")
                .on("mouseover", v)
                .on("mouseout", function (e) {
                  c.onTrackerMouseOut(e);
                })
                .css(y),
              ie && a[h].on("touchstart", v));
          }),
          (a._hasTracking = !0));
    },
    drawTrackerGraph: function () {
      var a,
        i,
        h = this,
        c = h.options,
        g = c.trackByArea,
        y = [].concat(g ? h.areaPath : h.graphPath),
        v = y.length,
        b = h.chart,
        k = b.pointer,
        w = b.renderer,
        S = b.options.tooltip.snap,
        T = h.tracker,
        P = c.cursor,
        A = P && { cursor: P },
        C = h.singlePoints,
        L = function () {
          b.hoverSeries !== h && h.onMouseOver();
        },
        M = "rgba(192,192,192," + ($e ? 1e-4 : 0.002) + ")";
      if (v && !g)
        for (i = v + 1; i--; )
          y[i] === mi && y.splice(i + 1, 0, y[i + 1] - S, y[i + 2], yi),
            ((i && y[i] === mi) || i === v) &&
              y.splice(i, 0, yi, y[i - 2] + S, y[i - 1]);
      for (i = 0; i < C.length; i++)
        (a = C[i]), y.push(mi, a.plotX - S, a.plotY, yi, a.plotX + S, a.plotY);
      T
        ? T.attr({ d: y })
        : ((h.tracker = w
            .path(y)
            .attr({
              "stroke-linejoin": "round",
              visibility: h.visible ? di : hi,
              stroke: M,
              fill: g ? M : gi,
              "stroke-width": c.lineWidth + (g ? 0 : 2 * S),
              zIndex: 2,
            })
            .add(h.group)),
          Mi([h.tracker, h.markerGroup], function (a) {
            a
              .addClass(ci + "tracker")
              .on("mouseover", L)
              .on("mouseout", function (e) {
                k.onTrackerMouseOut(e);
              })
              .css(A),
              ie && a.on("touchstart", L);
          }));
    },
  });
  Si.column && (mn.prototype.drawTracker = kn.drawTrackerPoint),
    Si.pie && (Si.pie.prototype.drawTracker = kn.drawTrackerPoint),
    Si.scatter && (vn.prototype.drawTracker = kn.drawTrackerPoint),
    a(sn.prototype, {
      setItemEvents: function (a, h, c, g, y) {
        var v = this;
        (c ? h : a.legendGroup)
          .on("mouseover", function () {
            a.setState(bi), h.css(v.options.itemHoverStyle);
          })
          .on("mouseout", function () {
            h.css(a.visible ? g : y), a.setState();
          })
          .on("click", function (h) {
            var c = "legendItemClick",
              g = function () {
                a.setVisible();
              };
            (h = { browserEvent: h }),
              a.firePointEvent ? a.firePointEvent(c, h, g) : Ri(a, c, h, g);
          });
      },
      createCheckboxForItem: function (a) {
        var h = this;
        (a.checkbox = M(
          "input",
          { type: "checkbox", checked: a.selected, defaultChecked: a.selected },
          h.options.itemCheckboxStyle,
          h.chart.container
        )),
          Oi(a.checkbox, "click", function (h) {
            var c = h.target;
            Ri(a, "checkboxClick", { checked: c.checked }, function () {
              a.select();
            });
          });
      },
    }),
    (se.legend.itemStyle.cursor = "pointer"),
    a(J.prototype, {
      showResetZoom: function () {
        var a = this,
          h = se.lang,
          c = a.options.chart.resetZoomButton,
          g = c.theme,
          y = g.states,
          v = "chart" === c.relativeTo ? null : "plotBox";
        this.resetZoomButton = a.renderer
          .button(
            h.resetZoom,
            null,
            null,
            function () {
              a.zoomOut();
            },
            g,
            y && y.hover
          )
          .attr({ align: c.position.align, title: h.resetZoomTitle })
          .add()
          .align(c.position, !1, v);
      },
      zoomOut: function () {
        var a = this;
        Ri(a, "selection", { resetSelection: !0 }, function () {
          a.zoom();
        });
      },
      zoom: function (a) {
        var h,
          c,
          g = this,
          v = g.pointer,
          b = !1;
        !a || a.resetSelection
          ? Mi(g.axes, function (a) {
              h = a.zoom();
            })
          : Mi(a.xAxis.concat(a.yAxis), function (a) {
              var c = a.axis,
                g = c.isXAxis;
              (v[g ? "zoomX" : "zoomY"] || v[g ? "pinchX" : "pinchY"]) &&
                ((h = c.zoom(a.min, a.max)), c.displayBtn && (b = !0));
            }),
          (c = g.resetZoomButton),
          b && !c
            ? g.showResetZoom()
            : !b && y(c) && (g.resetZoomButton = c.destroy()),
          h &&
            g.redraw(
              C(g.options.chart.animation, a && a.animation, g.pointCount < 100)
            );
      },
      pan: function (e, a) {
        var h,
          c = this,
          g = c.hoverPoints;
        g &&
          Mi(g, function (a) {
            a.setState();
          }),
          Mi("xy" === a ? [1, 0] : [1], function (a) {
            var g = e[a ? "chartX" : "chartY"],
              y = c[a ? "xAxis" : "yAxis"][0],
              v = c[a ? "mouseDownX" : "mouseDownY"],
              b = (y.pointRange || 0) / 2,
              k = y.getExtremes(),
              w = y.toValue(v - g, !0) + b,
              S = y.toValue(v + c[a ? "plotWidth" : "plotHeight"] - g, !0) - b;
            y.series.length &&
              w > He(k.dataMin, k.min) &&
              S < Re(k.dataMax, k.max) &&
              (y.setExtremes(w, S, !1, !1, { trigger: "pan" }), (h = !0)),
              (c[a ? "mouseDownX" : "mouseDownY"] = g);
          }),
          h && c.redraw(!1),
          L(c.container, { cursor: "move" });
      },
    }),
    a(hn.prototype, {
      select: function (a, h) {
        var c = this,
          g = c.series,
          y = g.chart;
        (a = C(a, !c.selected)),
          c.firePointEvent(
            a ? "select" : "unselect",
            { accumulate: h },
            function () {
              (c.selected = c.options.selected = a),
                (g.options.data[Li(c, g.data)] = c.options),
                c.setState(a && ki),
                h ||
                  Mi(y.getSelectedPoints(), function (a) {
                    a.selected &&
                      a !== c &&
                      ((a.selected = a.options.selected = !1),
                      (g.options.data[Li(a, g.data)] = a.options),
                      a.setState(xi),
                      a.firePointEvent("unselect"));
                  });
            }
          );
      },
      onMouseOver: function (e) {
        var a = this,
          h = a.series,
          c = h.chart,
          g = c.tooltip,
          y = c.hoverPoint;
        y && y !== a && y.onMouseOut(),
          a.firePointEvent("mouseOver"),
          !g || (g.shared && !h.noSharedTooltip) || g.refresh(a, e),
          a.setState(bi),
          (c.hoverPoint = a);
      },
      onMouseOut: function () {
        var a = this.series.chart,
          h = a.hoverPoints;
        this.firePointEvent("mouseOut"),
          (h && -1 !== Li(this, h)) || (this.setState(), (a.hoverPoint = null));
      },
      importEvents: function () {
        if (!this.hasImportedEvents) {
          var a,
            c = this,
            g = h(c.series.options.point, c.options),
            y = g.events;
          c.events = y;
          for (a in y) Oi(c, a, y[a]);
          this.hasImportedEvents = !0;
        }
      },
      setState: function (c, g) {
        var y,
          v,
          b,
          k,
          w = this,
          S = w.plotX,
          T = w.plotY,
          P = w.series,
          A = P.options.states,
          C = Wi[P.type].marker && P.options.marker,
          L = C && !C.enabled,
          M = C && C.states[c],
          D = M && M.enabled === !1,
          I = P.stateMarkerGraphic,
          B = w.marker || {},
          O = P.chart,
          z = P.halo;
        (c = c || xi),
          (k = w.pointAttr[c] || P.pointAttr[c]),
          (c === w.state && !g) ||
            (w.selected && c !== ki) ||
            (A[c] && A[c].enabled === !1) ||
            (c && (D || (L && M.enabled === !1))) ||
            (c && B.states && B.states[c] && B.states[c].enabled === !1) ||
            (w.graphic
              ? ((y = C && w.graphic.symbolName && k.r),
                w.graphic.attr(
                  h(
                    k,
                    y ? { x: S - y, y: T - y, width: 2 * y, height: 2 * y } : {}
                  )
                ),
                I && I.hide())
              : (c &&
                  M &&
                  ((y = M.radius),
                  (b = B.symbol || P.symbol),
                  I && I.currentSymbol !== b && (I = I.destroy()),
                  I
                    ? I[g ? "animate" : "attr"]({ x: S - y, y: T - y })
                    : b &&
                      ((P.stateMarkerGraphic = I =
                        O.renderer
                          .symbol(b, S - y, T - y, 2 * y, 2 * y)
                          .attr(k)
                          .add(P.markerGroup)),
                      (I.currentSymbol = b))),
                I &&
                  I[c && O.isInsidePlot(S, T, O.inverted) ? "show" : "hide"]()),
            (v = A[c] && A[c].halo),
            v && v.size
              ? (z || (P.halo = z = O.renderer.path().add(P.seriesGroup)),
                z
                  .attr(
                    a(
                      {
                        fill: Vi(w.color || P.color)
                          .setOpacity(v.opacity)
                          .get(),
                      },
                      v.attributes
                    )
                  )
                  [g ? "animate" : "attr"]({ d: w.haloPath(v.size) }))
              : z && z.attr({ d: [] }),
            (w.state = c));
      },
      haloPath: function (a) {
        var h = this.series,
          c = h.chart,
          g = h.getPlotBox(),
          y = c.inverted;
        return c.renderer.symbols.circle(
          g.translateX + (y ? h.yAxis.len - this.plotY : this.plotX) - a,
          g.translateY + (y ? h.xAxis.len - this.plotX : this.plotY) - a,
          2 * a,
          2 * a
        );
      },
    }),
    a(cn.prototype, {
      onMouseOver: function () {
        var a = this,
          h = a.chart,
          c = h.hoverSeries;
        c && c !== a && c.onMouseOut(),
          a.options.events.mouseOver && Ri(a, "mouseOver"),
          a.setState(bi),
          (h.hoverSeries = a);
      },
      onMouseOut: function () {
        var a = this,
          h = a.options,
          c = a.chart,
          g = c.tooltip,
          y = c.hoverPoint;
        y && y.onMouseOut(),
          a && h.events.mouseOut && Ri(a, "mouseOut"),
          !g ||
            h.stickyTracking ||
            (g.shared && !a.noSharedTooltip) ||
            g.hide(),
          a.setState(),
          (c.hoverSeries = null);
      },
      setState: function (a) {
        var h,
          c = this,
          g = c.options,
          y = c.graph,
          v = c.graphNeg,
          b = g.states,
          k = g.lineWidth;
        if (((a = a || xi), c.state !== a)) {
          if (((c.state = a), b[a] && b[a].enabled === !1)) return;
          a && (k = b[a].lineWidth || k + (b[a].lineWidthPlus || 0)),
            y &&
              !y.dashstyle &&
              ((h = { "stroke-width": k }), y.attr(h), v && v.attr(h));
        }
      },
      setVisible: function (a, h) {
        var c,
          g = this,
          y = g.chart,
          v = g.legendItem,
          b = y.options.chart.ignoreHiddenSeries,
          k = g.visible;
        (g.visible = a = g.userOptions.visible = a === te ? !k : a),
          (c = a ? "show" : "hide"),
          Mi(
            ["group", "dataLabelsGroup", "markerGroup", "tracker"],
            function (a) {
              g[a] && g[a][c]();
            }
          ),
          y.hoverSeries === g && g.onMouseOut(),
          v && y.legend.colorizeItem(g, a),
          (g.isDirty = !0),
          g.options.stacking &&
            Mi(y.series, function (a) {
              a.options.stacking && a.visible && (a.isDirty = !0);
            }),
          Mi(g.linkedSeries, function (h) {
            h.setVisible(a, !1);
          }),
          b && (y.isDirtyBox = !0),
          h !== !1 && y.redraw(),
          Ri(g, c);
      },
      setTooltipPoints: function (a) {
        var h,
          c,
          g,
          y,
          v,
          b,
          i,
          k = this,
          w = [],
          S = k.xAxis,
          T = S && S.getExtremes(),
          P = S ? S.tooltipLen || S.len : k.chart.plotSizeX,
          A = [];
        if (k.options.enableMouseTracking !== !1 && !k.singularTooltips) {
          for (
            a && (k.tooltipPoints = null),
              Mi(k.segments || k.points, function (a) {
                w = w.concat(a);
              }),
              S && S.reversed && (w = w.reverse()),
              k.orderTooltipPoints && k.orderTooltipPoints(w),
              h = w.length,
              i = 0;
            h > i;
            i++
          )
            if (((y = w[i]), (v = y.x), v >= T.min && v <= T.max))
              for (
                b = w[i + 1],
                  c = g === te ? 0 : g + 1,
                  g = w[i + 1]
                    ? He(
                        Re(
                          0,
                          Oe(
                            (y.clientX +
                              (b ? b.wrappedClientX || b.clientX : P)) /
                              2
                          )
                        ),
                        P
                      )
                    : P;
                c >= 0 && g >= c;

              )
                A[c++] = y;
          k.tooltipPoints = A;
        }
      },
      show: function () {
        this.setVisible(!0);
      },
      hide: function () {
        this.setVisible(!1);
      },
      select: function (a) {
        var h = this;
        (h.selected = a = a === te ? !h.selected : a),
          h.checkbox && (h.checkbox.checked = a),
          Ri(h, a ? "select" : "unselect");
      },
      drawTracker: kn.drawTrackerGraph,
    }),
    a(Le, {
      Axis: $,
      Chart: J,
      Color: Vi,
      Point: hn,
      Tick: K,
      Renderer: ee,
      Series: cn,
      SVGElement: Z,
      SVGRenderer: _i,
      arrayMin: G,
      arrayMax: W,
      charts: ii,
      dateFormat: ae,
      format: R,
      pathAnim: ce,
      getOptions: U,
      hasBidiBug: qe,
      isTouchDevice: Ze,
      numberFormat: I,
      seriesTypes: Si,
      setOptions: _,
      addEvent: Oi,
      removeEvent: zi,
      createElement: M,
      discardElement: N,
      css: L,
      each: Mi,
      extend: a,
      map: Bi,
      merge: h,
      pick: C,
      splat: A,
      extendClass: D,
      pInt: c,
      wrap: O,
      svg: $e,
      canvas: Je,
      vml: !$e && !Je,
      product: oi,
      version: ri,
    });
})();
