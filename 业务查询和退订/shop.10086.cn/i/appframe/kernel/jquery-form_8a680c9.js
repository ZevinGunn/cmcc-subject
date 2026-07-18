!(function (a) {
  "use strict";
  "function" == typeof define && define.amd
    ? define("jquery", a)
    : a("undefined" != typeof jQuery ? jQuery : window.Zepto);
})(function (a) {
  "use strict";
  function c(e) {
    var c = e.data;
    e.isDefaultPrevented() || (e.preventDefault(), a(e.target).ajaxSubmit(c));
  }
  function h(e) {
    var c = e.target,
      h = a(c);
    if (!h.is("[type=submit],[type=image]")) {
      var t = h.closest("[type=submit]");
      if (0 === t.length) return;
      c = t[0];
    }
    var v = this;
    if (((v.clk = c), "image" == c.type))
      if (void 0 !== e.offsetX) (v.clk_x = e.offsetX), (v.clk_y = e.offsetY);
      else if ("function" == typeof a.fn.offset) {
        var g = h.offset();
        (v.clk_x = e.pageX - g.left), (v.clk_y = e.pageY - g.top);
      } else
        (v.clk_x = e.pageX - c.offsetLeft), (v.clk_y = e.pageY - c.offsetTop);
    setTimeout(function () {
      v.clk = v.clk_x = v.clk_y = null;
    }, 100);
  }
  function v() {
    if (a.fn.ajaxSubmit.debug) {
      var c = "[jquery.form] " + Array.prototype.join.call(arguments, "");
      window.console && window.console.log
        ? window.console.log(c)
        : window.opera && window.opera.postError && window.opera.postError(c);
    }
  }
  var g = {};
  (g.fileapi = void 0 !== a("<input type='file'/>").get(0).files),
    (g.formdata = void 0 !== window.FormData);
  var y = !!a.fn.prop;
  (a.fn.attr2 = function () {
    if (!y) return this.attr.apply(this, arguments);
    var a = this.prop.apply(this, arguments);
    return (a && a.jquery) || "string" == typeof a
      ? a
      : this.attr.apply(this, arguments);
  }),
    (a.fn.ajaxSubmit = function (c) {
      function h(h) {
        var i,
          v,
          g = a.param(h, c.traditional).split("&"),
          y = g.length,
          b = [];
        for (i = 0; y > i; i++)
          (g[i] = g[i].replace(/\+/g, " ")),
            (v = g[i].split("=")),
            b.push([decodeURIComponent(v[0]), decodeURIComponent(v[1])]);
        return b;
      }
      function b(v) {
        for (var g = new FormData(), i = 0; i < v.length; i++)
          g.append(v[i].name, v[i].value);
        if (c.extraData) {
          var y = h(c.extraData);
          for (i = 0; i < y.length; i++) y[i] && g.append(y[i][0], y[i][1]);
        }
        c.data = null;
        var s = a.extend(!0, {}, a.ajaxSettings, c, {
          contentType: !1,
          processData: !1,
          cache: !1,
          type: j || "POST",
        });
        c.uploadProgress &&
          (s.xhr = function () {
            var h = a.ajaxSettings.xhr();
            return (
              h.upload &&
                h.upload.addEventListener(
                  "progress",
                  function (a) {
                    var h = 0,
                      v = a.loaded || a.position,
                      g = a.total;
                    a.lengthComputable && (h = Math.ceil((v / g) * 100)),
                      c.uploadProgress(a, v, g, h);
                  },
                  !1
                ),
              h
            );
          }),
          (s.data = null);
        var b = s.beforeSend;
        return (
          (s.beforeSend = function (a, o) {
            (o.data = c.formData ? c.formData : g), b && b.call(this, a, o);
          }),
          a.ajax(s)
        );
      }
      function T(h) {
        function g(a) {
          var c = null;
          try {
            a.contentWindow && (c = a.contentWindow.document);
          } catch (h) {
            v("cannot get iframe.contentWindow document: " + h);
          }
          if (c) return c;
          try {
            c = a.contentDocument ? a.contentDocument : a.document;
          } catch (h) {
            v("cannot get iframe.contentDocument: " + h), (c = a.document);
          }
          return c;
        }
        function b() {
          function c() {
            try {
              var a = g(L).readyState;
              v("state = " + a),
                a && "uninitialized" == a.toLowerCase() && setTimeout(c, 50);
            } catch (e) {
              v("Server abort: ", e, " (", e.name, ")"),
                T(P),
                X && clearTimeout(X),
                (X = void 0);
            }
          }
          var t = D.attr2("target"),
            h = D.attr2("action"),
            y = "multipart/form-data",
            b = D.attr("enctype") || D.attr("encoding") || y;
          C.setAttribute("target", k),
            (!j || /post/i.test(j)) && C.setAttribute("method", "POST"),
            h != s.url && C.setAttribute("action", s.url),
            s.skipEncodingOverride ||
              (j && !/post/i.test(j)) ||
              D.attr({
                encoding: "multipart/form-data",
                enctype: "multipart/form-data",
              }),
            s.timeout &&
              (X = setTimeout(function () {
                (O = !0), T(N);
              }, s.timeout));
          var w = [];
          try {
            if (s.extraData)
              for (var n in s.extraData)
                s.extraData.hasOwnProperty(n) &&
                  w.push(
                    a.isPlainObject(s.extraData[n]) &&
                      s.extraData[n].hasOwnProperty("name") &&
                      s.extraData[n].hasOwnProperty("value")
                      ? a(
                          '<input type="hidden" name="' +
                            s.extraData[n].name +
                            '">'
                        )
                          .val(s.extraData[n].value)
                          .appendTo(C)[0]
                      : a('<input type="hidden" name="' + n + '">')
                          .val(s.extraData[n])
                          .appendTo(C)[0]
                  );
            s.iframeTarget || A.appendTo("body"),
              L.attachEvent
                ? L.attachEvent("onload", T)
                : L.addEventListener("load", T, !1),
              setTimeout(c, 15);
            try {
              C.submit();
            } catch (S) {
              var E = document.createElement("form").submit;
              E.apply(C);
            }
          } finally {
            C.setAttribute("action", h),
              C.setAttribute("enctype", b),
              t ? C.setAttribute("target", t) : D.removeAttr("target"),
              a(w).remove();
          }
        }
        function T(e) {
          if (!M.aborted && !W) {
            if (
              ((H = g(L)),
              H || (v("cannot access response document"), (e = P)),
              e === N && M)
            )
              return M.abort("timeout"), void _.reject(M, "timeout");
            if (e == P && M)
              return (
                M.abort("server abort"),
                void _.reject(M, "error", "server abort")
              );
            if ((H && H.location.href != s.iframeSrc) || O) {
              L.detachEvent
                ? L.detachEvent("onload", T)
                : L.removeEventListener("load", T, !1);
              var c,
                h = "success";
              try {
                if (O) throw "timeout";
                var y = "xml" == s.dataType || H.XMLDocument || a.isXMLDoc(H);
                if (
                  (v("isXml=" + y),
                  !y &&
                    window.opera &&
                    (null === H.body || !H.body.innerHTML) &&
                    --U)
                )
                  return (
                    v("requeing onLoad callback, DOM not available"),
                    void setTimeout(T, 250)
                  );
                var b = H.body ? H.body : H.documentElement;
                (M.responseText = b ? b.innerHTML : null),
                  (M.responseXML = H.XMLDocument ? H.XMLDocument : H),
                  y && (s.dataType = "xml"),
                  (M.getResponseHeader = function (a) {
                    var c = { "content-type": s.dataType };
                    return c[a.toLowerCase()];
                  }),
                  b &&
                    ((M.status = Number(b.getAttribute("status")) || M.status),
                    (M.statusText =
                      b.getAttribute("statusText") || M.statusText));
                var j = (s.dataType || "").toLowerCase(),
                  w = /(json|script|text)/.test(j);
                if (w || s.textarea) {
                  var D = H.getElementsByTagName("textarea")[0];
                  if (D)
                    (M.responseText = D.value),
                      (M.status = Number(D.getAttribute("status")) || M.status),
                      (M.statusText =
                        D.getAttribute("statusText") || M.statusText);
                  else if (w) {
                    var k = H.getElementsByTagName("pre")[0],
                      E = H.getElementsByTagName("body")[0];
                    k
                      ? (M.responseText = k.textContent
                          ? k.textContent
                          : k.innerText)
                      : E &&
                        (M.responseText = E.textContent
                          ? E.textContent
                          : E.innerText);
                  }
                } else
                  "xml" == j &&
                    !M.responseXML &&
                    M.responseText &&
                    (M.responseXML = V(M.responseText));
                try {
                  R = Y(M, j, s);
                } catch (F) {
                  (h = "parsererror"), (M.error = c = F || h);
                }
              } catch (F) {
                v("error caught: ", F), (h = "error"), (M.error = c = F || h);
              }
              M.aborted && (v("upload aborted"), (h = null)),
                M.status &&
                  (h =
                    (M.status >= 200 && M.status < 300) || 304 === M.status
                      ? "success"
                      : "error"),
                "success" === h
                  ? (s.success && s.success.call(s.context, R, "success", M),
                    _.resolve(M.responseText, "success", M),
                    S && a.event.trigger("ajaxSuccess", [M, s]))
                  : h &&
                    (void 0 === c && (c = M.statusText),
                    s.error && s.error.call(s.context, M, h, c),
                    _.reject(M, "error", c),
                    S && a.event.trigger("ajaxError", [M, s, c])),
                S && a.event.trigger("ajaxComplete", [M, s]),
                S && !--a.active && a.event.trigger("ajaxStop"),
                s.complete && s.complete.call(s.context, M, h),
                (W = !0),
                s.timeout && clearTimeout(X),
                setTimeout(function () {
                  s.iframeTarget ? A.attr("src", s.iframeSrc) : A.remove(),
                    (M.responseXML = null);
                }, 100);
            }
          }
        }
        var w,
          i,
          s,
          S,
          k,
          A,
          L,
          M,
          F,
          n,
          O,
          X,
          C = D[0],
          _ = a.Deferred();
        if (
          ((_.abort = function (a) {
            M.abort(a);
          }),
          h)
        )
          for (i = 0; i < E.length; i++)
            (w = a(E[i])),
              y ? w.prop("disabled", !1) : w.removeAttr("disabled");
        if (
          ((s = a.extend(!0, {}, a.ajaxSettings, c)),
          (s.context = s.context || s),
          (k = "jqFormIO" + new Date().getTime()),
          s.iframeTarget
            ? ((A = a(s.iframeTarget)),
              (n = A.attr2("name")),
              n ? (k = n) : A.attr2("name", k))
            : ((A = a('<iframe name="' + k + '" src="' + s.iframeSrc + '" />')),
              A.css({ position: "absolute", top: "-1000px", left: "-1000px" })),
          (L = A[0]),
          (M = {
            aborted: 0,
            responseText: null,
            responseXML: null,
            status: 0,
            statusText: "n/a",
            getAllResponseHeaders: function () {},
            getResponseHeader: function () {},
            setRequestHeader: function () {},
            abort: function (c) {
              var e = "timeout" === c ? "timeout" : "aborted";
              v("aborting upload... " + e), (this.aborted = 1);
              try {
                L.contentWindow.document.execCommand &&
                  L.contentWindow.document.execCommand("Stop");
              } catch (h) {}
              A.attr("src", s.iframeSrc),
                (M.error = e),
                s.error && s.error.call(s.context, M, e, c),
                S && a.event.trigger("ajaxError", [M, s, e]),
                s.complete && s.complete.call(s.context, M, e);
            },
          }),
          (S = s.global),
          S && 0 === a.active++ && a.event.trigger("ajaxStart"),
          S && a.event.trigger("ajaxSend", [M, s]),
          s.beforeSend && s.beforeSend.call(s.context, M, s) === !1)
        )
          return s.global && a.active--, _.reject(), _;
        if (M.aborted) return _.reject(), _;
        (F = C.clk),
          F &&
            ((n = F.name),
            n &&
              !F.disabled &&
              ((s.extraData = s.extraData || {}),
              (s.extraData[n] = F.value),
              "image" == F.type &&
                ((s.extraData[n + ".x"] = C.clk_x),
                (s.extraData[n + ".y"] = C.clk_y))));
        var N = 1,
          P = 2,
          I = a("meta[name=csrf-token]").attr("content"),
          z = a("meta[name=csrf-param]").attr("content");
        z && I && ((s.extraData = s.extraData || {}), (s.extraData[z] = I)),
          s.forceSync ? b() : setTimeout(b, 10);
        var R,
          H,
          W,
          U = 50,
          V =
            a.parseXML ||
            function (s, a) {
              return (
                window.ActiveXObject
                  ? ((a = new ActiveXObject("Microsoft.XMLDOM")),
                    (a.async = "false"),
                    a.loadXML(s))
                  : (a = new DOMParser().parseFromString(s, "text/xml")),
                a &&
                a.documentElement &&
                "parsererror" != a.documentElement.nodeName
                  ? a
                  : null
              );
            },
          B =
            a.parseJSON ||
            function (s) {
              return window.eval("(" + s + ")");
            },
          Y = function (c, h, s) {
            var v = c.getResponseHeader("content-type") || "",
              g = "xml" === h || (!h && v.indexOf("xml") >= 0),
              y = g ? c.responseXML : c.responseText;
            return (
              g &&
                "parsererror" === y.documentElement.nodeName &&
                a.error &&
                a.error("parsererror"),
              s && s.dataFilter && (y = s.dataFilter(y, h)),
              "string" == typeof y &&
                ("json" === h || (!h && v.indexOf("json") >= 0)
                  ? (y = B(y))
                  : ("script" === h || (!h && v.indexOf("javascript") >= 0)) &&
                    a.globalEval(y)),
              y
            );
          };
        return _;
      }
      if (!this.length)
        return (
          v("ajaxSubmit: skipping submit process - no element selected"), this
        );
      var j,
        w,
        S,
        D = this;
      "function" == typeof c ? (c = { success: c }) : void 0 === c && (c = {}),
        (j = c.type || this.attr2("method")),
        (w = c.url || this.attr2("action")),
        (S = "string" == typeof w ? a.trim(w) : ""),
        (S = S || window.location.href || ""),
        S && (S = (S.match(/^([^#]+)/) || [])[1]),
        (c = a.extend(
          !0,
          {
            url: S,
            success: a.ajaxSettings.success,
            type: j || a.ajaxSettings.type,
            iframeSrc: /^https/i.test(window.location.href || "")
              ? "javascript:false"
              : "about:blank",
          },
          c
        ));
      var k = {};
      if ((this.trigger("form-pre-serialize", [this, c, k]), k.veto))
        return (
          v("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this
        );
      if (c.beforeSerialize && c.beforeSerialize(this, c) === !1)
        return (
          v("ajaxSubmit: submit aborted via beforeSerialize callback"), this
        );
      var A = c.traditional;
      void 0 === A && (A = a.ajaxSettings.traditional);
      var L,
        E = [],
        M = this.formToArray(c.semantic, E);
      if (
        (c.data && ((c.extraData = c.data), (L = a.param(c.data, A))),
        c.beforeSubmit && c.beforeSubmit(M, this, c) === !1)
      )
        return v("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
      if ((this.trigger("form-submit-validate", [M, this, c, k]), k.veto))
        return (
          v("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this
        );
      var q = a.param(M, A);
      L && (q = q ? q + "&" + L : L),
        "GET" == c.type.toUpperCase()
          ? ((c.url += (c.url.indexOf("?") >= 0 ? "&" : "?") + q),
            (c.data = null))
          : (c.data = q);
      var F = [];
      if (
        (c.resetForm &&
          F.push(function () {
            D.resetForm();
          }),
        c.clearForm &&
          F.push(function () {
            D.clearForm(c.includeHidden);
          }),
        !c.dataType && c.target)
      ) {
        var O = c.success || function () {};
        F.push(function (h) {
          var v = c.replaceTarget ? "replaceWith" : "html";
          a(c.target)[v](h).each(O, arguments);
        });
      } else c.success && F.push(c.success);
      if (
        ((c.success = function (a, h, v) {
          for (var g = c.context || this, i = 0, y = F.length; y > i; i++)
            F[i].apply(g, [a, h, v || D, D]);
        }),
        c.error)
      ) {
        var X = c.error;
        c.error = function (a, h, v) {
          var g = c.context || this;
          X.apply(g, [a, h, v, D]);
        };
      }
      if (c.complete) {
        var C = c.complete;
        c.complete = function (a, h) {
          var v = c.context || this;
          C.apply(v, [a, h, D]);
        };
      }
      var _ = a("input[type=file]:enabled", this).filter(function () {
          return "" !== a(this).val();
        }),
        N = _.length > 0,
        P = "multipart/form-data",
        I = D.attr("enctype") == P || D.attr("encoding") == P,
        z = g.fileapi && g.formdata;
      v("fileAPI :" + z);
      var R,
        H = (N || I) && !z;
      c.iframe !== !1 && (c.iframe || H)
        ? c.closeKeepAlive
          ? a.get(c.closeKeepAlive, function () {
              R = T(M);
            })
          : (R = T(M))
        : (R = (N || I) && z ? b(M) : a.ajax(c)),
        D.removeData("jqxhr").data("jqxhr", R);
      for (var W = 0; W < E.length; W++) E[W] = null;
      return this.trigger("form-submit-notify", [this, c]), this;
    }),
    (a.fn.ajaxForm = function (g) {
      if (
        ((g = g || {}),
        (g.delegation = g.delegation && a.isFunction(a.fn.on)),
        !g.delegation && 0 === this.length)
      ) {
        var o = { s: this.selector, c: this.context };
        return !a.isReady && o.s
          ? (v("DOM not ready, queuing ajaxForm"),
            a(function () {
              a(o.s, o.c).ajaxForm(g);
            }),
            this)
          : (v(
              "terminating; zero elements found by selector" +
                (a.isReady ? "" : " (DOM not ready)")
            ),
            this);
      }
      return g.delegation
        ? (a(document)
            .off("submit.form-plugin", this.selector, c)
            .off("click.form-plugin", this.selector, h)
            .on("submit.form-plugin", this.selector, g, c)
            .on("click.form-plugin", this.selector, g, h),
          this)
        : this.ajaxFormUnbind()
            .bind("submit.form-plugin", g, c)
            .bind("click.form-plugin", g, h);
    }),
    (a.fn.ajaxFormUnbind = function () {
      return this.unbind("submit.form-plugin click.form-plugin");
    }),
    (a.fn.formToArray = function (c, h) {
      var v = [];
      if (0 === this.length) return v;
      var y,
        b = this[0],
        T = this.attr("id"),
        j = c ? b.getElementsByTagName("*") : b.elements;
      if (
        (j && !/MSIE [678]/.test(navigator.userAgent) && (j = a(j).get()),
        T &&
          ((y = a(':input[form="' + T + '"]').get()),
          y.length && (j = (j || []).concat(y))),
        !j || !j.length)
      )
        return v;
      var i, w, n, S, D, k, A;
      for (i = 0, k = j.length; k > i; i++)
        if (((D = j[i]), (n = D.name), n && !D.disabled))
          if (c && b.clk && "image" == D.type)
            b.clk == D &&
              (v.push({ name: n, value: a(D).val(), type: D.type }),
              v.push(
                { name: n + ".x", value: b.clk_x },
                { name: n + ".y", value: b.clk_y }
              ));
          else if (((S = a.fieldValue(D, !0)), S && S.constructor == Array))
            for (h && h.push(D), w = 0, A = S.length; A > w; w++)
              v.push({ name: n, value: S[w] });
          else if (g.fileapi && "file" == D.type) {
            h && h.push(D);
            var L = D.files;
            if (L.length)
              for (w = 0; w < L.length; w++)
                v.push({ name: n, value: L[w], type: D.type });
            else v.push({ name: n, value: "", type: D.type });
          } else
            null !== S &&
              "undefined" != typeof S &&
              (h && h.push(D),
              v.push({
                name: n,
                value: S,
                type: D.type,
                required: D.required,
              }));
      if (!c && b.clk) {
        var E = a(b.clk),
          M = E[0];
        (n = M.name),
          n &&
            !M.disabled &&
            "image" == M.type &&
            (v.push({ name: n, value: E.val() }),
            v.push(
              { name: n + ".x", value: b.clk_x },
              { name: n + ".y", value: b.clk_y }
            ));
      }
      return v;
    }),
    (a.fn.formSerialize = function (c) {
      return a.param(this.formToArray(c));
    }),
    (a.fn.fieldSerialize = function (c) {
      var h = [];
      return (
        this.each(function () {
          var n = this.name;
          if (n) {
            var v = a.fieldValue(this, c);
            if (v && v.constructor == Array)
              for (var i = 0, g = v.length; g > i; i++)
                h.push({ name: n, value: v[i] });
            else
              null !== v &&
                "undefined" != typeof v &&
                h.push({ name: this.name, value: v });
          }
        }),
        a.param(h)
      );
    }),
    (a.fn.fieldValue = function (c) {
      for (var h = [], i = 0, v = this.length; v > i; i++) {
        var g = this[i],
          y = a.fieldValue(g, c);
        null === y ||
          "undefined" == typeof y ||
          (y.constructor == Array && !y.length) ||
          (y.constructor == Array ? a.merge(h, y) : h.push(y));
      }
      return h;
    }),
    (a.fieldValue = function (c, h) {
      var n = c.name,
        t = c.type,
        v = c.tagName.toLowerCase();
      if (
        (void 0 === h && (h = !0),
        h &&
          (!n ||
            c.disabled ||
            "reset" == t ||
            "button" == t ||
            (("checkbox" == t || "radio" == t) && !c.checked) ||
            (("submit" == t || "image" == t) && c.form && c.form.clk != c) ||
            ("select" == v && -1 == c.selectedIndex)))
      )
        return null;
      if ("select" == v) {
        var g = c.selectedIndex;
        if (0 > g) return null;
        for (
          var y = [],
            b = c.options,
            T = "select-one" == t,
            j = T ? g + 1 : b.length,
            i = T ? g : 0;
          j > i;
          i++
        ) {
          var w = b[i];
          if (w.selected) {
            var S = w.value;
            if (
              (S ||
                (S =
                  w.attributes &&
                  w.attributes.value &&
                  !w.attributes.value.specified
                    ? w.text
                    : w.value),
              T)
            )
              return S;
            y.push(S);
          }
        }
        return y;
      }
      return a(c).val();
    }),
    (a.fn.clearForm = function (c) {
      return this.each(function () {
        a("input,select,textarea", this).clearFields(c);
      });
    }),
    (a.fn.clearFields = a.fn.clearInputs =
      function (c) {
        var re =
          /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function () {
          var t = this.type,
            h = this.tagName.toLowerCase();
          re.test(t) || "textarea" == h
            ? (this.value = "")
            : "checkbox" == t || "radio" == t
            ? (this.checked = !1)
            : "select" == h
            ? (this.selectedIndex = -1)
            : "file" == t
            ? /MSIE/.test(navigator.userAgent)
              ? a(this).replaceWith(a(this).clone(!0))
              : a(this).val("")
            : c &&
              ((c === !0 && /hidden/.test(t)) ||
                ("string" == typeof c && a(this).is(c))) &&
              (this.value = "");
        });
      }),
    (a.fn.resetForm = function () {
      return this.each(function () {
        ("function" == typeof this.reset ||
          ("object" == typeof this.reset && !this.reset.nodeType)) &&
          this.reset();
      });
    }),
    (a.fn.enable = function (a) {
      return (
        void 0 === a && (a = !0),
        this.each(function () {
          this.disabled = !a;
        })
      );
    }),
    (a.fn.selected = function (c) {
      return (
        void 0 === c && (c = !0),
        this.each(function () {
          var t = this.type;
          if ("checkbox" == t || "radio" == t) this.checked = c;
          else if ("option" == this.tagName.toLowerCase()) {
            var h = a(this).parent("select");
            c &&
              h[0] &&
              "select-one" == h[0].type &&
              h.find("option").selected(!1),
              (this.selected = c);
          }
        })
      );
    }),
    (a.fn.ajaxSubmit.debug = !1);
});
