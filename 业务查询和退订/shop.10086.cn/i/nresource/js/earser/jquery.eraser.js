!(function (a) {
  var c = {
    init: function (h) {
      return this.each(function () {
        var v = a(this),
          g = v.data("eraser");
        if (!g) {
          var w,
            X = v.width(),
            Y = v.height(),
            D = v.offset(),
            b = a("<canvas/>"),
            P = b.get(0),
            F = h && h.size ? h.size : 40,
            M = h && h.completeRatio ? h.completeRatio : 0.7,
            y = h && h.scrapeFunction ? h.scrapeFunction : null,
            T = h && h.completeFunction ? h.completeFunction : null,
            z = [],
            C = Math.floor(X / F),
            k = Math.floor(Y / F),
            E = C * k,
            n = E;
          for (
            window.G_vmlCanvasManager &&
              (P = window.G_vmlCanvasManager.initElement(P)),
              w = P.getContext("2d"),
              v.after(b),
              P.id = this.id,
              P.className = this.className,
              P.width = X,
              P.height = Y,
              w.drawImage(this, 0, 0, X, Y),
              v.remove(),
              w.globalCompositeOperation = "destination-out",
              w.strokeStyle = "rgb(255,255,255)",
              w.lineWidth = F,
              w.lineCap = "round",
              b.bind("mousedown", c.mouseDown),
              b.bind("touchstart", c.touchStart),
              b.bind("touchmove", c.touchMove),
              b.bind("touchend", c.touchEnd);
            n--;

          )
            z.push(1);
          (g = {
            posX: D.left,
            posY: D.top,
            touchDown: !1,
            touchID: -999,
            touchX: 0,
            touchY: 0,
            ptouchX: 0,
            ptouchY: 0,
            canvas: b,
            ctx: w,
            w: X,
            h: Y,
            source: this,
            size: F,
            parts: z,
            colParts: C,
            numParts: E,
            ratio: 0,
            complete: !1,
            completeRatio: M,
            scrapeFunction: y,
            completeFunction: T,
          }),
            b.data("eraser", g),
            a(window).resize(function () {
              var a = b.offset();
              (g.posX = a.left), (g.posY = a.top);
            });
        }
      });
    },
    mouseDown: function (h) {
      var v = a(this),
        g = v.data("eraser"),
        w = h.pageX - g.posX,
        X = h.pageY - g.posY;
      g.complete ||
        (c.evaluatePoint(g, w, X),
        (g.touchDown = !0),
        (g.touchX = w),
        (g.touchY = X),
        g.ctx.beginPath(),
        g.ctx.moveTo(g.touchX - 1, g.touchY),
        g.ctx.lineTo(g.touchX, g.touchY),
        g.ctx.stroke(),
        v.bind("mousemove", c.mouseMove),
        a(document).bind("mouseup", g, c.mouseUp),
        null != g.scrapeFunction && g.scrapeFunction()),
        h.preventDefault();
    },
    mouseMove: function (h) {
      var v = a(this),
        g = v.data("eraser"),
        w = h.pageX - g.posX,
        X = h.pageY - g.posY;
      g.complete ||
        (c.evaluatePoint(g, w, X),
        g.ctx.beginPath(),
        g.ctx.moveTo(g.touchX, g.touchY),
        (g.touchX = w),
        (g.touchY = X),
        g.ctx.lineTo(g.touchX, g.touchY),
        g.ctx.stroke()),
        h.preventDefault();
    },
    mouseUp: function (c) {
      var h = c.data,
        v = h.canvas;
      h.complete ||
        ((h.touchDown = !1),
        v.unbind("mousemove"),
        a(document).unbind("mouseup")),
        c.preventDefault();
    },
    touchStart: function (h) {
      var v = a(this),
        g = v.data("eraser");
      if (!g.touchDown) {
        var t = h.originalEvent.changedTouches[0],
          w = t.pageX - g.posX,
          X = t.pageY - g.posY;
        c.evaluatePoint(g, w, X),
          (g.touchDown = !0),
          (g.touchID = t.identifier),
          (g.touchX = w),
          (g.touchY = X),
          h.preventDefault();
      }
    },
    touchMove: function (h) {
      var v = a(this),
        g = v.data("eraser");
      if (g.touchDown) {
        for (var w = h.originalEvent.changedTouches, n = w.length; n--; )
          if (w[n].identifier == g.touchID) {
            var X = w[n].pageX - g.posX,
              Y = w[n].pageY - g.posY;
            c.evaluatePoint(g, X, Y),
              g.ctx.beginPath(),
              g.ctx.moveTo(g.touchX, g.touchY),
              (g.touchX = X),
              (g.touchY = Y),
              g.ctx.lineTo(g.touchX, g.touchY),
              g.ctx.stroke(),
              h.preventDefault();
            break;
          }
        null != g.scrapeFunction && g.scrapeFunction();
      }
    },
    touchEnd: function (c) {
      var h = a(this),
        v = h.data("eraser");
      if (v.touchDown)
        for (var g = c.originalEvent.changedTouches, n = g.length; n--; )
          if (g[n].identifier == v.touchID) {
            (v.touchDown = !1), c.preventDefault();
            break;
          }
    },
    evaluatePoint: function (a, c, h) {
      var p = Math.floor(c / a.size) + Math.floor(h / a.size) * a.colParts;
      p >= 0 &&
        p < a.numParts &&
        ((a.ratio += a.parts[p]),
        (a.parts[p] = 0),
        a.complete ||
          (a.ratio / a.numParts >= a.completeRatio &&
            ((a.complete = !0),
            null != a.completeFunction && a.completeFunction())));
    },
    clear: function () {
      var c = a(this),
        h = c.data("eraser");
      if (h) {
        c.fadeOut("slow", function () {
          h.ctx.clearRect(0, 0, h.w, h.h);
        });
        for (var n = h.numParts; n--; ) h.parts[n] = 0;
        (h.ratio = h.numParts), (h.complete = !0);
      }
    },
    reset: function () {
      var c = a(this),
        h = c.data("eraser");
      if (h) {
        (h.ctx.globalCompositeOperation = "source-over"),
          h.ctx.drawImage(h.source, 0, 0),
          (h.ctx.globalCompositeOperation = "destination-out");
        for (var n = h.numParts; n--; ) h.parts[n] = 1;
        (h.ratio = 0), (h.complete = !1);
      }
    },
    size: function (c) {
      var h = a(this),
        v = h.data("eraser");
      v && c && ((v.size = c), (v.ctx.lineWidth = c));
    },
  };
  a.fn.eraser = function (h) {
    return c[h]
      ? c[h].apply(this, Array.prototype.slice.call(arguments, 1))
      : "object" != typeof h && h
      ? void a.error("Method " + h + " does not yet exist on jQuery.eraser")
      : c.init.apply(this, arguments);
  };
})(jQuery);
