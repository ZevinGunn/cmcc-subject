define(function () {
  if ("undefined" == typeof window)
    return {
      load: function (n, r, a) {
        a();
      },
    };
  var a = document.getElementsByTagName("head")[0],
    c =
      window.navigator.userAgent.match(
        /Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)/
      ) || 0,
    h = !1,
    v = !0;
  c[1] || c[7]
    ? (h = parseInt(c[1]) < 6 || parseInt(c[7]) <= 9)
    : c[2]
    ? (v = !1)
    : c[4] && (h = parseInt(c[4]) < 18);
  var I = {};
  I.pluginBuilder = "./css-builder";
  var y,
    g,
    b,
    w = function () {
      (y = document.createElement("style")),
        a.appendChild(y),
        (g = y.styleSheet || y.sheet);
    },
    E = 0,
    S = [],
    C = function (a) {
      E++, 32 == E && (w(), (E = 0)), g.addImport(a), (y.onload = T);
    },
    T = function () {
      b();
      var a = S.shift();
      return a ? ((b = a[1]), void C(a[0])) : void (b = null);
    },
    k = function (a, c) {
      if (((g && g.addImport) || w(), g && g.addImport))
        b ? S.push([a, c]) : (C(a), (b = c));
      else {
        y.textContent = '@import "' + a + '";';
        var h = setInterval(function () {
          try {
            y.sheet.cssRules, clearInterval(h), c();
          } catch (e) {}
        }, 10);
      }
    },
    A = function (c, h) {
      var I = document.createElement("link");
      if (((I.type = "text/css"), (I.rel = "stylesheet"), v))
        I.onload = function () {
          (I.onload = function () {}), setTimeout(h, 7);
        };
      else
        var y = setInterval(function () {
          for (var i = 0; i < document.styleSheets.length; i++) {
            var a = document.styleSheets[i];
            if (a.href == I.href) return clearInterval(y), h();
          }
        }, 10);
      (I.href = c), a.appendChild(I);
    };
  return (
    (I.normalize = function (a, c) {
      return (
        ".css" == a.substr(a.length - 4, 4) && (a = a.substr(0, a.length - 4)),
        c(a)
      );
    }),
    (I.load = function (a, req, c) {
      (h ? k : A)(req.toUrl(a + ".css"), c);
    }),
    I
  );
});
