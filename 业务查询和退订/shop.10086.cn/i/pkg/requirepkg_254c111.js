var requirejs, require, define;
!(function (global) {
  function isFunction(a) {
    return "[object Function]" === ostring.call(a);
  }
  function isArray(a) {
    return "[object Array]" === ostring.call(a);
  }
  function each(a, c) {
    if (a) {
      var i;
      for (i = 0; i < a.length && (!a[i] || !c(a[i], i, a)); i += 1);
    }
  }
  function eachReverse(a, c) {
    if (a) {
      var i;
      for (i = a.length - 1; i > -1 && (!a[i] || !c(a[i], i, a)); i -= 1);
    }
  }
  function hasProp(a, c) {
    return hasOwn.call(a, c);
  }
  function getOwn(a, c) {
    return hasProp(a, c) && a[c];
  }
  function eachProp(a, c) {
    var h;
    for (h in a) if (hasProp(a, h) && c(a[h], h)) break;
  }
  function mixin(a, c, h, v) {
    return (
      c &&
        eachProp(c, function (c, g) {
          (h || !hasProp(a, g)) &&
            (!v ||
            "object" != typeof c ||
            !c ||
            isArray(c) ||
            isFunction(c) ||
            c instanceof RegExp
              ? (a[g] = c)
              : (a[g] || (a[g] = {}), mixin(a[g], c, h, v)));
        }),
      a
    );
  }
  function bind(a, c) {
    return function () {
      return c.apply(a, arguments);
    };
  }
  function scripts() {
    return document.getElementsByTagName("script");
  }
  function defaultOnError(a) {
    throw a;
  }
  function getGlobal(a) {
    if (!a) return a;
    var c = global;
    return (
      each(a.split("."), function (a) {
        c = c[a];
      }),
      c
    );
  }
  function makeError(a, c, h, v) {
    var e = new Error(c + "\nhttp://requirejs.org/docs/errors.html#" + a);
    return (
      (e.requireType = a), (e.requireModules = v), h && (e.originalError = h), e
    );
  }
  function newContext(a) {
    function c(a) {
      var i,
        c,
        h = a.length;
      for (i = 0; h > i; i++)
        if (((c = a[i]), "." === c)) a.splice(i, 1), (i -= 1);
        else if (".." === c) {
          if (1 === i && (".." === a[2] || ".." === a[0])) break;
          i > 0 && (a.splice(i - 1, 2), (i -= 2));
        }
    }
    function h(a, h, v) {
      var g,
        y,
        b,
        i,
        _,
        w,
        k,
        C,
        $,
        S,
        O,
        P = h && h.split("/"),
        M = P,
        E = R.map,
        D = E && E["*"];
      if (
        (a &&
          "." === a.charAt(0) &&
          (h
            ? ((M = P.slice(0, P.length - 1)),
              (a = a.split("/")),
              (k = a.length - 1),
              R.nodeIdCompat &&
                jsSuffixRegExp.test(a[k]) &&
                (a[k] = a[k].replace(jsSuffixRegExp, "")),
              (a = M.concat(a)),
              c(a),
              (a = a.join("/")))
            : 0 === a.indexOf("./") && (a = a.substring(2))),
        v && E && (P || D))
      ) {
        b = a.split("/");
        e: for (i = b.length; i > 0; i -= 1) {
          if (((w = b.slice(0, i).join("/")), P))
            for (_ = P.length; _ > 0; _ -= 1)
              if (
                ((y = getOwn(E, P.slice(0, _).join("/"))),
                y && (y = getOwn(y, w)))
              ) {
                (C = y), ($ = i);
                break e;
              }
          !S && D && getOwn(D, w) && ((S = getOwn(D, w)), (O = i));
        }
        !C && S && ((C = S), ($ = O)),
          C && (b.splice(0, $, C), (a = b.join("/")));
      }
      return (g = getOwn(R.pkgs, a)), g ? g : a;
    }
    function v(a) {
      isBrowser &&
        each(scripts(), function (c) {
          return c.getAttribute("data-requiremodule") === a &&
            c.getAttribute("data-requirecontext") === T.contextName
            ? (c.parentNode.removeChild(c), !0)
            : void 0;
        });
    }
    function g(a) {
      var c = getOwn(R.paths, a);
      return c && isArray(c) && c.length > 1
        ? (c.shift(), T.require.undef(a), T.require([a]), !0)
        : void 0;
    }
    function y(a) {
      var c,
        h = a ? a.indexOf("!") : -1;
      return (
        h > -1 && ((c = a.substring(0, h)), (a = a.substring(h + 1, a.length))),
        [c, a]
      );
    }
    function b(a, c, v, g) {
      var b,
        _,
        w,
        k,
        C = null,
        $ = c ? c.name : null,
        S = a,
        O = !0,
        P = "";
      return (
        a || ((O = !1), (a = "_@r" + (W += 1))),
        (k = y(a)),
        (C = k[0]),
        (a = k[1]),
        C && ((C = h(C, $, g)), (_ = getOwn(L, C))),
        a &&
          (C
            ? (P =
                _ && _.normalize
                  ? _.normalize(a, function (a) {
                      return h(a, $, g);
                    })
                  : h(a, $, g))
            : ((P = h(a, $, g)),
              (k = y(P)),
              (C = k[0]),
              (P = k[1]),
              (v = !0),
              (b = T.nameToUrl(P)))),
        (w = !C || _ || v ? "" : "_unnormalized" + (z += 1)),
        {
          prefix: C,
          name: P,
          parentMap: c,
          unnormalized: !!w,
          url: b,
          originalName: S,
          isDefine: O,
          id: (C ? C + "!" + P : P) + w,
        }
      );
    }
    function _(a) {
      var c = a.id,
        mod = getOwn(B, c);
      return mod || (mod = B[c] = new T.Module(a)), mod;
    }
    function w(a, c, h) {
      var v = a.id,
        mod = getOwn(B, v);
      !hasProp(L, v) || (mod && !mod.defineEmitComplete)
        ? ((mod = _(a)),
          mod.error && "error" === c ? h(mod.error) : mod.on(c, h))
        : "defined" === c && h(L[v]);
    }
    function k(a, c) {
      var h = a.requireModules,
        v = !1;
      c
        ? c(a)
        : (each(h, function (c) {
            var mod = getOwn(B, c);
            mod &&
              ((mod.error = a),
              mod.events.error && ((v = !0), mod.emit("error", a)));
          }),
          v || req.onError(a));
    }
    function C() {
      globalDefQueue.length &&
        (apsp.apply(U, [U.length, 0].concat(globalDefQueue)),
        (globalDefQueue = []));
    }
    function $(a) {
      delete B[a], delete F[a];
    }
    function S(mod, a, c) {
      var h = mod.map.id;
      mod.error
        ? mod.emit("error", mod.error)
        : ((a[h] = !0),
          each(mod.depMaps, function (h, i) {
            var v = h.id,
              g = getOwn(B, v);
            !g ||
              mod.depMatched[i] ||
              c[v] ||
              (getOwn(a, v)
                ? (mod.defineDep(i, L[v]), mod.check())
                : S(g, a, c));
          }),
          (c[h] = !0));
    }
    function O() {
      var a,
        c,
        h = 1e3 * R.waitSeconds,
        y = h && T.startTime + h < new Date().getTime(),
        b = [],
        _ = [],
        w = !1,
        C = !0;
      if (!j) {
        if (
          ((j = !0),
          eachProp(F, function (mod) {
            var a = mod.map,
              h = a.id;
            if (mod.enabled && (a.isDefine || _.push(mod), !mod.error))
              if (!mod.inited && y)
                g(h) ? ((c = !0), (w = !0)) : (b.push(h), v(h));
              else if (
                !mod.inited &&
                mod.fetched &&
                a.isDefine &&
                ((w = !0), !a.prefix)
              )
                return (C = !1);
          }),
          y && b.length)
        )
          return (
            (a = makeError(
              "timeout",
              "Load timeout for modules: " + b,
              null,
              b
            )),
            (a.contextName = T.contextName),
            k(a)
          );
        C &&
          each(_, function (mod) {
            S(mod, {}, {});
          }),
          (y && !c) ||
            !w ||
            (!isBrowser && !isWebWorker) ||
            N ||
            (N = setTimeout(function () {
              (N = 0), O();
            }, 50)),
          (j = !1);
      }
    }
    function P(a) {
      hasProp(L, a[0]) || _(b(a[0], null, !0)).init(a[1], a[2]);
    }
    function M(a, c, h, v) {
      a.detachEvent && !isOpera
        ? v && a.detachEvent(v, c)
        : a.removeEventListener(h, c, !1);
    }
    function E(a) {
      var c = a.currentTarget || a.srcElement;
      return (
        M(c, T.onScriptLoad, "load", "onreadystatechange"),
        M(c, T.onScriptError, "error"),
        { node: c, id: c && c.getAttribute("data-requiremodule") }
      );
    }
    function D() {
      var a;
      for (C(); U.length; ) {
        if (((a = U.shift()), null === a[0]))
          return k(
            makeError(
              "mismatch",
              "Mismatched anonymous define() module: " + a[a.length - 1]
            )
          );
        P(a);
      }
    }
    var j,
      I,
      T,
      A,
      N,
      R = {
        waitSeconds: 10,
        baseUrl: "./",
        paths: {},
        bundles: {},
        pkgs: {},
        shim: {},
        config: {},
      },
      B = {},
      F = {},
      J = {},
      U = [],
      L = {},
      Q = {},
      H = {},
      W = 1,
      z = 1;
    return (
      (A = {
        require: function (mod) {
          return mod.require
            ? mod.require
            : (mod.require = T.makeRequire(mod.map));
        },
        exports: function (mod) {
          return (
            (mod.usingExports = !0),
            mod.map.isDefine
              ? mod.exports
                ? (L[mod.map.id] = mod.exports)
                : (mod.exports = L[mod.map.id] = {})
              : void 0
          );
        },
        module: function (mod) {
          return mod.module
            ? mod.module
            : (mod.module = {
                id: mod.map.id,
                uri: mod.map.url,
                config: function () {
                  return getOwn(R.config, mod.map.id) || {};
                },
                exports: mod.exports || (mod.exports = {}),
              });
        },
      }),
      (I = function (a) {
        (this.events = getOwn(J, a.id) || {}),
          (this.map = a),
          (this.shim = getOwn(R.shim, a.id)),
          (this.depExports = []),
          (this.depMaps = []),
          (this.depMatched = []),
          (this.pluginMaps = {}),
          (this.depCount = 0);
      }),
      (I.prototype = {
        init: function (a, c, h, v) {
          (v = v || {}),
            this.inited ||
              ((this.factory = c),
              h
                ? this.on("error", h)
                : this.events.error &&
                  (h = bind(this, function (a) {
                    this.emit("error", a);
                  })),
              (this.depMaps = a && a.slice(0)),
              (this.errback = h),
              (this.inited = !0),
              (this.ignore = v.ignore),
              v.enabled || this.enabled ? this.enable() : this.check());
        },
        defineDep: function (i, a) {
          this.depMatched[i] ||
            ((this.depMatched[i] = !0),
            (this.depCount -= 1),
            (this.depExports[i] = a));
        },
        fetch: function () {
          if (!this.fetched) {
            (this.fetched = !0), (T.startTime = new Date().getTime());
            var a = this.map;
            return this.shim
              ? void T.makeRequire(this.map, { enableBuildCallback: !0 })(
                  this.shim.deps || [],
                  bind(this, function () {
                    return a.prefix ? this.callPlugin() : this.load();
                  })
                )
              : a.prefix
              ? this.callPlugin()
              : this.load();
          }
        },
        load: function () {
          var a = this.map.url;
          Q[a] || ((Q[a] = !0), T.load(this.map.id, a));
        },
        check: function () {
          if (this.enabled && !this.enabling) {
            var a,
              c,
              h = this.map.id,
              v = this.depExports,
              exports = this.exports,
              g = this.factory;
            if (this.inited) {
              if (this.error) this.emit("error", this.error);
              else if (!this.defining) {
                if (
                  ((this.defining = !0), this.depCount < 1 && !this.defined)
                ) {
                  if (isFunction(g)) {
                    if (
                      (this.events.error && this.map.isDefine) ||
                      req.onError !== defaultOnError
                    )
                      try {
                        exports = T.execCb(h, g, v, exports);
                      } catch (e) {
                        a = e;
                      }
                    else exports = T.execCb(h, g, v, exports);
                    if (
                      (this.map.isDefine &&
                        void 0 === exports &&
                        ((c = this.module),
                        c
                          ? (exports = c.exports)
                          : this.usingExports && (exports = this.exports)),
                      a)
                    )
                      return (
                        (a.requireMap = this.map),
                        (a.requireModules = this.map.isDefine
                          ? [this.map.id]
                          : null),
                        (a.requireType = this.map.isDefine
                          ? "define"
                          : "require"),
                        k((this.error = a))
                      );
                  } else exports = g;
                  (this.exports = exports),
                    this.map.isDefine &&
                      !this.ignore &&
                      ((L[h] = exports),
                      req.onResourceLoad &&
                        req.onResourceLoad(T, this.map, this.depMaps)),
                    $(h),
                    (this.defined = !0);
                }
                (this.defining = !1),
                  this.defined &&
                    !this.defineEmitted &&
                    ((this.defineEmitted = !0),
                    this.emit("defined", this.exports),
                    (this.defineEmitComplete = !0));
              }
            } else this.fetch();
          }
        },
        callPlugin: function () {
          var a = this.map,
            c = a.id,
            v = b(a.prefix);
          this.depMaps.push(v),
            w(
              v,
              "defined",
              bind(this, function (v) {
                var g,
                  y,
                  C,
                  S = getOwn(H, this.map.id),
                  O = this.map.name,
                  P = this.map.parentMap ? this.map.parentMap.name : null,
                  M = T.makeRequire(a.parentMap, { enableBuildCallback: !0 });
                return this.map.unnormalized
                  ? (v.normalize &&
                      (O =
                        v.normalize(O, function (a) {
                          return h(a, P, !0);
                        }) || ""),
                    (y = b(a.prefix + "!" + O, this.map.parentMap)),
                    w(
                      y,
                      "defined",
                      bind(this, function (a) {
                        this.init(
                          [],
                          function () {
                            return a;
                          },
                          null,
                          { enabled: !0, ignore: !0 }
                        );
                      })
                    ),
                    (C = getOwn(B, y.id)),
                    void (
                      C &&
                      (this.depMaps.push(y),
                      this.events.error &&
                        C.on(
                          "error",
                          bind(this, function (a) {
                            this.emit("error", a);
                          })
                        ),
                      C.enable())
                    ))
                  : S
                  ? ((this.map.url = T.nameToUrl(S)), void this.load())
                  : ((g = bind(this, function (a) {
                      this.init(
                        [],
                        function () {
                          return a;
                        },
                        null,
                        { enabled: !0 }
                      );
                    })),
                    (g.error = bind(this, function (a) {
                      (this.inited = !0),
                        (this.error = a),
                        (a.requireModules = [c]),
                        eachProp(B, function (mod) {
                          0 === mod.map.id.indexOf(c + "_unnormalized") &&
                            $(mod.map.id);
                        }),
                        k(a);
                    })),
                    (g.fromText = bind(this, function (h, v) {
                      var y = a.name,
                        w = b(y),
                        C = useInteractive;
                      v && (h = v),
                        C && (useInteractive = !1),
                        _(w),
                        hasProp(R.config, c) && (R.config[y] = R.config[c]);
                      try {
                        req.exec(h);
                      } catch (e) {
                        return k(
                          makeError(
                            "fromtexteval",
                            "fromText eval for " + c + " failed: " + e,
                            e,
                            [c]
                          )
                        );
                      }
                      C && (useInteractive = !0),
                        this.depMaps.push(w),
                        T.completeLoad(y),
                        M([y], g);
                    })),
                    void v.load(a.name, M, g, R));
              })
            ),
            T.enable(v, this),
            (this.pluginMaps[v.id] = v);
        },
        enable: function () {
          (F[this.map.id] = this),
            (this.enabled = !0),
            (this.enabling = !0),
            each(
              this.depMaps,
              bind(this, function (a, i) {
                var c, mod, h;
                if ("string" == typeof a) {
                  if (
                    ((a = b(
                      a,
                      this.map.isDefine ? this.map : this.map.parentMap,
                      !1,
                      !this.skipMap
                    )),
                    (this.depMaps[i] = a),
                    (h = getOwn(A, a.id)))
                  )
                    return void (this.depExports[i] = h(this));
                  (this.depCount += 1),
                    w(
                      a,
                      "defined",
                      bind(this, function (a) {
                        this.defineDep(i, a), this.check();
                      })
                    ),
                    this.errback && w(a, "error", bind(this, this.errback));
                }
                (c = a.id),
                  (mod = B[c]),
                  hasProp(A, c) || !mod || mod.enabled || T.enable(a, this);
              })
            ),
            eachProp(
              this.pluginMaps,
              bind(this, function (a) {
                var mod = getOwn(B, a.id);
                mod && !mod.enabled && T.enable(a, this);
              })
            ),
            (this.enabling = !1),
            this.check();
        },
        on: function (a, c) {
          var h = this.events[a];
          h || (h = this.events[a] = []), h.push(c);
        },
        emit: function (a, c) {
          each(this.events[a], function (a) {
            a(c);
          }),
            "error" === a && delete this.events[a];
        },
      }),
      (T = {
        config: R,
        contextName: a,
        registry: B,
        defined: L,
        urlFetched: Q,
        defQueue: U,
        Module: I,
        makeModuleMap: b,
        nextTick: req.nextTick,
        onError: k,
        configure: function (a) {
          a.baseUrl &&
            "/" !== a.baseUrl.charAt(a.baseUrl.length - 1) &&
            (a.baseUrl += "/");
          var c = R.shim,
            h = { paths: !0, bundles: !0, config: !0, map: !0 };
          eachProp(a, function (a, c) {
            h[c] ? (R[c] || (R[c] = {}), mixin(R[c], a, !0, !0)) : (R[c] = a);
          }),
            a.bundles &&
              eachProp(a.bundles, function (a, c) {
                each(a, function (a) {
                  a !== c && (H[a] = c);
                });
              }),
            a.shim &&
              (eachProp(a.shim, function (a, h) {
                isArray(a) && (a = { deps: a }),
                  (!a.exports && !a.init) ||
                    a.exportsFn ||
                    (a.exportsFn = T.makeShimExports(a)),
                  (c[h] = a);
              }),
              (R.shim = c)),
            a.packages &&
              each(a.packages, function (a) {
                var c, h;
                (a = "string" == typeof a ? { name: a } : a),
                  (h = a.name),
                  (c = a.location),
                  c && (R.paths[h] = a.location),
                  (R.pkgs[h] =
                    a.name +
                    "/" +
                    (a.main || "main")
                      .replace(currDirRegExp, "")
                      .replace(jsSuffixRegExp, ""));
              }),
            eachProp(B, function (mod, a) {
              mod.inited || mod.map.unnormalized || (mod.map = b(a));
            }),
            (a.deps || a.callback) && T.require(a.deps || [], a.callback);
        },
        makeShimExports: function (a) {
          function c() {
            var c;
            return (
              a.init && (c = a.init.apply(global, arguments)),
              c || (a.exports && getGlobal(a.exports))
            );
          }
          return c;
        },
        makeRequire: function (c, g) {
          function y(h, v, w) {
            var C, $, S;
            return (
              g.enableBuildCallback &&
                v &&
                isFunction(v) &&
                (v.__requireJsBuild = !0),
              "string" == typeof h
                ? isFunction(v)
                  ? k(makeError("requireargs", "Invalid require call"), w)
                  : c && hasProp(A, h)
                  ? A[h](B[c.id])
                  : req.get
                  ? req.get(T, h, c, y)
                  : (($ = b(h, c, !1, !0)),
                    (C = $.id),
                    hasProp(L, C)
                      ? L[C]
                      : k(
                          makeError(
                            "notloaded",
                            'Module name "' +
                              C +
                              '" has not been loaded yet for context: ' +
                              a +
                              (c ? "" : ". Use require([])")
                          )
                        ))
                : (D(),
                  T.nextTick(function () {
                    D(),
                      (S = _(b(null, c))),
                      (S.skipMap = g.skipMap),
                      S.init(h, v, w, { enabled: !0 }),
                      O();
                  }),
                  y)
            );
          }
          return (
            (g = g || {}),
            mixin(y, {
              isBrowser: isBrowser,
              toUrl: function (a) {
                var v,
                  g = a.lastIndexOf("."),
                  y = a.split("/")[0],
                  b = "." === y || ".." === y;
                return (
                  -1 !== g &&
                    (!b || g > 1) &&
                    ((v = a.substring(g, a.length)), (a = a.substring(0, g))),
                  T.nameToUrl(h(a, c && c.id, !0), v, !0)
                );
              },
              defined: function (a) {
                return hasProp(L, b(a, c, !1, !0).id);
              },
              specified: function (a) {
                return (a = b(a, c, !1, !0).id), hasProp(L, a) || hasProp(B, a);
              },
            }),
            c ||
              (y.undef = function (a) {
                C();
                var h = b(a, c, !0),
                  mod = getOwn(B, a);
                v(a),
                  delete L[a],
                  delete Q[h.url],
                  delete J[a],
                  eachReverse(U, function (c, i) {
                    c[0] === a && U.splice(i, 1);
                  }),
                  mod && (mod.events.defined && (J[a] = mod.events), $(a));
              }),
            y
          );
        },
        enable: function (a) {
          var mod = getOwn(B, a.id);
          mod && _(a).enable();
        },
        completeLoad: function (a) {
          var c,
            h,
            mod,
            v = getOwn(R.shim, a) || {},
            y = v.exports;
          for (C(); U.length; ) {
            if (((h = U.shift()), null === h[0])) {
              if (((h[0] = a), c)) break;
              c = !0;
            } else h[0] === a && (c = !0);
            P(h);
          }
          if (
            ((mod = getOwn(B, a)), !c && !hasProp(L, a) && mod && !mod.inited)
          ) {
            if (!(!R.enforceDefine || (y && getGlobal(y))))
              return g(a)
                ? void 0
                : k(
                    makeError("nodefine", "No define call for " + a, null, [a])
                  );
            P([a, v.deps || [], v.exportsFn]);
          }
          O();
        },
        nameToUrl: function (a, c, h) {
          var v,
            g,
            i,
            y,
            b,
            _,
            w,
            k = getOwn(R.pkgs, a);
          if ((k && (a = k), (w = getOwn(H, a)))) return T.nameToUrl(w, c, h);
          if (req.jsExtRegExp.test(a)) b = a + (c || "");
          else {
            for (v = R.paths, g = a.split("/"), i = g.length; i > 0; i -= 1)
              if (((y = g.slice(0, i).join("/")), (_ = getOwn(v, y)))) {
                isArray(_) && (_ = _[0]), g.splice(0, i, _);
                break;
              }
            (b = g.join("/")),
              (b += c || (/^data\:|\?/.test(b) || h ? "" : ".js")),
              (b =
                ("/" === b.charAt(0) || b.match(/^[\w\+\.\-]+:/)
                  ? ""
                  : R.baseUrl) + b);
          }
          return R.urlArgs
            ? b + ((-1 === b.indexOf("?") ? "?" : "&") + R.urlArgs)
            : b;
        },
        load: function (a, c) {
          req.load(T, a, c);
        },
        execCb: function (a, c, h, exports) {
          return c.apply(exports, h);
        },
        onScriptLoad: function (a) {
          if (
            "load" === a.type ||
            readyRegExp.test((a.currentTarget || a.srcElement).readyState)
          ) {
            interactiveScript = null;
            var c = E(a);
            T.completeLoad(c.id);
          }
        },
        onScriptError: function (a) {
          var c = E(a);
          return g(c.id)
            ? void 0
            : k(
                makeError("scripterror", "Script error for: " + c.id, a, [c.id])
              );
        },
      }),
      (T.require = T.makeRequire()),
      T
    );
  }
  function getInteractiveScript() {
    return interactiveScript && "interactive" === interactiveScript.readyState
      ? interactiveScript
      : (eachReverse(scripts(), function (a) {
          return "interactive" === a.readyState
            ? (interactiveScript = a)
            : void 0;
        }),
        interactiveScript);
  }
  var req,
    s,
    head,
    baseElement,
    dataMain,
    src,
    interactiveScript,
    currentlyAddingScript,
    mainScript,
    subPath,
    version = "2.1.11",
    commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,
    cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
    jsSuffixRegExp = /\.js$/,
    currDirRegExp = /^\.\//,
    op = Object.prototype,
    ostring = op.toString,
    hasOwn = op.hasOwnProperty,
    ap = Array.prototype,
    apsp = ap.splice,
    isBrowser = !(
      "undefined" == typeof window ||
      "undefined" == typeof navigator ||
      !window.document
    ),
    isWebWorker = !isBrowser && "undefined" != typeof importScripts,
    readyRegExp =
      isBrowser && "" === navigator.platform
        ? /^complete$/
        : /^(complete|loaded)$/,
    defContextName = "_",
    isOpera =
      "undefined" != typeof opera && "[object Opera]" === opera.toString(),
    contexts = {},
    cfg = {},
    globalDefQueue = [],
    useInteractive = !1;
  if ("undefined" == typeof define) {
    if ("undefined" != typeof requirejs) {
      if (isFunction(requirejs)) return;
      (cfg = requirejs), (requirejs = void 0);
    }
    "undefined" == typeof require ||
      isFunction(require) ||
      ((cfg = require), (require = void 0)),
      (req = requirejs =
        function (a, c, h, v) {
          var g,
            y,
            b = defContextName;
          return (
            isArray(a) ||
              "string" == typeof a ||
              ((y = a), isArray(c) ? ((a = c), (c = h), (h = v)) : (a = [])),
            y && y.context && (b = y.context),
            (g = getOwn(contexts, b)),
            g || (g = contexts[b] = req.s.newContext(b)),
            y && g.configure(y),
            g.require(a, c, h)
          );
        }),
      (req.config = function (a) {
        return req(a);
      }),
      (req.nextTick =
        "undefined" != typeof setTimeout
          ? function (a) {
              setTimeout(a, 4);
            }
          : function (a) {
              a();
            }),
      require || (require = req),
      (req.version = version),
      (req.jsExtRegExp = /^\/|:|\?|\.js$/),
      (req.isBrowser = isBrowser),
      (s = req.s = { contexts: contexts, newContext: newContext }),
      req({}),
      each(["toUrl", "undef", "defined", "specified"], function (a) {
        req[a] = function () {
          var c = contexts[defContextName];
          return c.require[a].apply(c, arguments);
        };
      }),
      isBrowser &&
        ((head = s.head = document.getElementsByTagName("head")[0]),
        (baseElement = document.getElementsByTagName("base")[0]),
        baseElement && (head = s.head = baseElement.parentNode)),
      (req.onError = defaultOnError),
      (req.createNode = function (a) {
        var c = a.xhtml
          ? document.createElementNS(
              "http://www.w3.org/1999/xhtml",
              "html:script"
            )
          : document.createElement("script");
        return (
          (c.type = a.scriptType || "text/javascript"),
          (c.charset = "utf-8"),
          (c.async = !0),
          c
        );
      }),
      (req.load = function (a, c, h) {
        var v,
          g = (a && a.config) || {};
        if (isBrowser)
          return (
            (v = req.createNode(g, c, h)),
            v.setAttribute("data-requirecontext", a.contextName),
            v.setAttribute("data-requiremodule", c),
            !v.attachEvent ||
            (v.attachEvent.toString &&
              v.attachEvent.toString().indexOf("[native code") < 0) ||
            isOpera
              ? (v.addEventListener("load", a.onScriptLoad, !1),
                v.addEventListener("error", a.onScriptError, !1))
              : ((useInteractive = !0),
                v.attachEvent("onreadystatechange", a.onScriptLoad)),
            (v.src = h),
            (currentlyAddingScript = v),
            baseElement
              ? head.insertBefore(v, baseElement)
              : head.appendChild(v),
            (currentlyAddingScript = null),
            v
          );
        if (isWebWorker)
          try {
            importScripts(h), a.completeLoad(c);
          } catch (e) {
            a.onError(
              makeError(
                "importscripts",
                "importScripts failed for " + c + " at " + h,
                e,
                [c]
              )
            );
          }
      }),
      isBrowser &&
        !cfg.skipDataMain &&
        eachReverse(scripts(), function (a) {
          return (
            head || (head = a.parentNode),
            (dataMain = a.getAttribute("data-main")),
            dataMain
              ? ((mainScript = dataMain),
                cfg.baseUrl ||
                  ((src = mainScript.split("/")),
                  (mainScript = src.pop()),
                  (subPath = src.length ? src.join("/") + "/" : "./"),
                  (cfg.baseUrl = subPath)),
                (mainScript = mainScript.replace(jsSuffixRegExp, "")),
                req.jsExtRegExp.test(mainScript) && (mainScript = dataMain),
                (cfg.deps = cfg.deps
                  ? cfg.deps.concat(mainScript)
                  : [mainScript]),
                !0)
              : void 0
          );
        }),
      (define = function (a, c, h) {
        var v, g;
        "string" != typeof a && ((h = c), (c = a), (a = null)),
          isArray(c) || ((h = c), (c = null)),
          !c &&
            isFunction(h) &&
            ((c = []),
            h.length &&
              (h
                .toString()
                .replace(commentRegExp, "")
                .replace(cjsRequireRegExp, function (a, h) {
                  c.push(h);
                }),
              (c = (
                1 === h.length ? ["require"] : ["require", "exports", "module"]
              ).concat(c)))),
          useInteractive &&
            ((v = currentlyAddingScript || getInteractiveScript()),
            v &&
              (a || (a = v.getAttribute("data-requiremodule")),
              (g = contexts[v.getAttribute("data-requirecontext")]))),
          (g ? g.defQueue : globalDefQueue).push([a, c, h]);
      }),
      (define.amd = { jQuery: !0 }),
      (req.exec = function (text) {
        return eval(text);
      }),
      req(cfg);
  }
})(this),
  require.config({
    paths: {
      xss: "/i/appframe/component/open/xss/xss_070f033",
      underscore: "/i/appframe/component/open/underscore_83440cd",
      xdate: "/i/appframe/component/open/xdate_74926ef",
      moment: "/i/appframe/component/open/moment_30fcc87",
      uri: "/i/appframe/component/open/uri_c9ef9bf",
      mousetrap: "/i/appframe/component/open/mousetrap_07eef8a",
      json2: "/i/appframe/component/open/json2_28faaad",
      jquery_easy: "/i/appframe/component/open/jquery.easing_318f4ec",
      jquery_page: "/i/appframe/component/open/jquery.paging_f723995",
      jquery_valid: "/i/appframe/component/open/jquery.validate_2138cbb",
      doTimeout: "/i/appframe/component/open/jquery.doTimeout_fde57a4",
      cookie: "/i/appframe/component/open/jquery.cookie_147a497",
      autocomplete: "/i/appframe/component/open/jquery.autocomplete_42e6851",
      director: "/i/appframe/component/open/director_f5ec610",
      rsa: "/i/appframe/component/open/rsa-all_55731f4",
      daterangepicker:
        "/i/appframe/component/open/daterangepicker/jquery.daterangepicker_467725d",
      placeholder:
        "/i/appframe/component/open/placeholder/jquery.placeholder_54ee321",
      wdatePicker:
        "/i/appframe/component/open/datetimepicker/WdatePicker_2259573",
      dialog_plus: "/i/appframe/component/open/dialog-plus_c4f0ae0",
      template: "/i/appframe/component/open/template_41700ea",
      highcharts: "/i/appframe/component/open/highcharts_78a41f7",
      html2canvas: "/i/appframe/component/open/html2canvas_885ed44",
      indexPrivateWeb:
        "/i/appframe/component/private/index-private-web_a54cc0c",
      jsPdf: "/i/appframe/component/open/jsPdf_86398c9",
      jquery_lazy: "/i/appframe/component/open/jquery.lazy_040ba6d",
      jqaop: "/i/appframe/component/open/jquery-aop_2950826",
      ajaxutil: "/i/appframe/component/private/ajaxUtil_8abd497",
      festival: "/i/appframe/component/private/festival_eb26772",
      pageing: "/i/appframe/component/private/pageing_f167362",
      jqvalid: "/i/appframe/component/private/validate_901c4eb",
      jst: "/i/appframe/component/private/jST.v0.1.4_cc92d74",
      pluspop: "/i/appframe/component/private/pluspop/pluspop_6fc46ab",
      appmanage: "/i/appframe/component/private/appManage_3653a91",
      appevent: "/i/appframe/component/private/appEvent_eb177ce",
    },
    shim: {
      jst: { exports: "jST" },
      html2canvas: { exports: "html2canvas" },
      indexPrivateWeb: { deps: [], exports: "" },
      jsPdf: { exports: "jsPDF" },
      highcharts: { exports: "Highcharts" },
    },
    map: { "*": { css: "/i/appframe/kernel/css.js" } },
  }),
  require.config({
    paths: {
      appconfig: "/i/appframe/component/private/app_conf_dad5061",
      stcutil: "/i/appframe/component/private/stcutil_0d0c06a",
      formartDateUtil: "/i/appframe/component/private/formart_date_33811ea",
      stcDic: "/i/appframe/component/private/stcdictionary_550ea5a",
      stclog: "/i/appframe/component/private/clog_ff0cabe",
      btncommit: "/i/appframe/component/private/btncommit_0843ade",
      commonutil: "/i/appframe/component/private/callrestutil_a1bd4ae",
      promptcommit: "/i/appframe/component/private/promptcommit_729a759",
    },
  }),
  define("appmanage", function (require) {
    function a(a, c) {
      var h = v[a],
        y = [];
      if (h) {
        var _ = h[0],
          w = new g(_),
          k = "" != w.path() ? w.path() : w.query(),
          C = "" != w.anchor() ? w.anchor() : "mainapp";
        (k =
          k.indexOf("?") > -1
            ? "/apps/pageapps" + k.substring(1)
            : "/apps/serviceapps" + k),
          -1 == k.indexOf(".html") && (k += "/index.html"),
          c && (k = k.substring(0, k.lastIndexOf("/")) + c),
          (y[0] = b + k),
          (y[1] = C);
      } else (y[0] = b + "/apps/serviceapps/s" + a + "/index.html"), c && (y[0] = y[0].substring(0, y[0].lastIndexOf("/")) + c), (y[1] = "mainapp");
      return y;
    }
    function c(a) {
      var c = v[a],
        h = {};
      if (c)
        for (var i = 0; i < c.length; i++) {
          var g = c[i].split("#"),
            y = g[0],
            _ = g[1],
            w = g[0].charAt(0),
            k = "/apps/";
          (k += "p" == w ? "pageapps/" : "serviceapps/"),
            (k += y),
            -1 == k.indexOf(".html") && (k += "/index.html"),
            _ || (_ = "mainapp"),
            (h[_] = b + k);
        }
      else h.mainapp = b + "/apps/serviceapps/" + a + "/index.html";
      return h;
    }
    var h = { data: {}, routesmap: {} },
      v = (require("director"), require("appconfig")),
      g = require("uri");
    (route_index = 0),
      (routes = []),
      (router = new Router().init()),
      (urit = new g(location.href));
    var y = urit.path() + urit.query() + "#",
      b = "/i";
    return (
      (h.create = function (c, v) {
        var g = route_index++,
          b = a(c);
        (h.routesmap[g] = b),
          (h.data[g] = v),
          (location.href = y + g),
          $.get(b[0], function (a) {
            $("#" + b[1]).html(a),
              router.on("" + g, function () {
                var s = h.routesmap["" + g];
                s &&
                  $.get(s[0], function (a) {
                    $("#" + b[1]).html(a);
                  });
              });
          });
      }),
      (h.initpage = function (a, v) {
        var g = route_index++,
          y = c(a);
        (h.data[g] = v),
          (h.routesmap = y),
          $.each(y, function (a, c) {
            $.get(c, function (c) {
              $("#" + a).html(c);
            });
          });
      }),
      (h.initDompage = function (a, v, g) {
        var y = route_index++,
          b = c(a);
        (h.data[y] = g),
          (h.routesmap = b),
          $.each(b, function (a, c) {
            $.get(c, function (a) {
              v.html(a);
            });
          });
      }),
      (h.nextpage = function (a, c, v) {
        var g = route_index++,
          y = h.routesmap[a];
        h.data[g] = v;
        var b = urit.path() + urit.query() + "#",
          _ =
            "/" == c.charAt(0)
              ? c
              : y.substring(0, paths[0].lastIndexOf("/")) + c;
        routes[g] ||
          (router.on("" + g, function () {
            $.get(_, function (c) {
              $("#" + a).html(c);
            });
          }),
          (routes[g] = !0)),
          (location.href = b + g);
      }),
      (h.innerskip = function (c, v) {
        var g = route_index++;
        (h.data[g] = v), (h.routesmap[g] = c);
        var y = urit.path() + urit.query() + "#",
          b = a(urit.getQueryParamValue("opcode"), c);
        routes[g] ||
          (router.on("" + g, function () {
            $.get(b[0], function (a) {
              $("#" + b[1]).html(a);
            });
          }),
          (routes[g] = !0)),
          (location.href = y + g);
      }),
      (h.getData = function () {
        var a = new g(location.href),
          c = h.data[a.anchor()];
        return c;
      }),
      h
    );
  }),
  (function () {
    function a(a, c) {
      var h = [];
      return (
        $.each(a, function (a, v) {
          c(v) && h.push(v);
        }),
        h
      );
    }
    function c() {
      return "" === w.hash || "#" === w.hash;
    }
    function h(a, c) {
      for (var i = 0; i < a.length; i += 1) if (c(a[i], i, a) === !1) return;
    }
    function v(a) {
      for (var c = [], i = 0, n = a.length; n > i; i++) c = c.concat(a[i]);
      return c;
    }
    function g(a, c, h) {
      if (!a.length) return h();
      var v = 0;
      !(function g() {
        c(a[v], function (c) {
          c || c === !1
            ? (h(c), (h = function () {}))
            : ((v += 1), v === a.length ? h() : g());
        });
      })();
    }
    function y(a, c, mod) {
      mod = a;
      for (var h in c)
        if (c.hasOwnProperty(h) && ((mod = c[h](a)), mod !== a)) break;
      return mod === a ? "([._a-zA-Z0-9-%()]+)" : mod;
    }
    function b(a, c) {
      for (
        var h, v = 0, g = "";
        (h = a.substr(v).match(/[^\w\d\- %@&]*\*[^\w\d\- %@&]*/));

      )
        (v = h.index + h[0].length),
          (h[0] = h[0].replace(/^\*/, "([_.()!\\ %@&a-zA-Z0-9-]+)")),
          (g += a.substr(0, h.index) + h[0]);
      a = g += a.substr(v);
      var b,
        _,
        w = a.match(/:([^\/]+)/gi);
      if (w) {
        _ = w.length;
        for (var i = 0; _ > i; i++)
          (b = w[i]),
            (a = "::" === b.slice(0, 2) ? b.slice(1) : a.replace(b, y(b, c)));
      }
      return a;
    }
    function _(a, c, h, v) {
      var i,
        g = 0,
        y = 0,
        b = 0,
        h = (h || "(").toString(),
        v = (v || ")").toString();
      for (i = 0; i < a.length; i++) {
        var _ = a[i];
        if (
          _.indexOf(h, g) > _.indexOf(v, g) ||
          (~_.indexOf(h, g) && !~_.indexOf(v, g)) ||
          (!~_.indexOf(h, g) && ~_.indexOf(v, g))
        ) {
          if (
            ((y = _.indexOf(h, g)),
            (b = _.indexOf(v, g)),
            (~y && !~b) || (!~y && ~b))
          ) {
            var w = a.slice(0, (i || 1) + 1).join(c);
            a = [w].concat(a.slice((i || 1) + 1));
          }
          (g = (b > y ? b : y) + 1), (i = 0);
        } else g = 0;
      }
      return a;
    }
    var w = document.location;
    Array.isArray =
      Array.isArray ||
      function (a) {
        var c = Object.prototype.toString;
        return "[object Array]" == c.call(a);
      };
    var k = {
        mode: "modern",
        hash: w.hash,
        history: !1,
        check: function () {
          var a = w.hash;
          a != this.hash && ((this.hash = a), this.onHashChanged());
        },
        fire: function () {
          "modern" === this.mode
            ? this.history === !0
              ? window.onpopstate()
              : window.onhashchange()
            : this.onHashChanged();
        },
        init: function (a, c) {
          function h(a) {
            for (var i = 0, l = C.listeners.length; l > i; i++)
              C.listeners[i](a);
          }
          var v = this;
          if (
            ((this.history = c),
            C.listeners || (C.listeners = []),
            "onhashchange" in window &&
              (void 0 === document.documentMode || document.documentMode > 7))
          )
            this.history === !0
              ? setTimeout(function () {
                  window.onpopstate = h;
                }, 500)
              : (window.onhashchange = h),
              (this.mode = "modern");
          else {
            var g = document.createElement("iframe");
            (g.id = "state-frame"),
              (g.style.display = "none"),
              document.body.appendChild(g),
              this.writeFrame(""),
              "onpropertychange" in document &&
                "attachEvent" in document &&
                document.attachEvent("onpropertychange", function () {
                  "location" === event.propertyName && v.check();
                }),
              window.setInterval(function () {
                v.check();
              }, 50),
              (this.onHashChanged = h),
              (this.mode = "legacy");
          }
          return C.listeners.push(a), this.mode;
        },
        destroy: function (a) {
          if (C && C.listeners)
            for (var c = C.listeners, i = c.length - 1; i >= 0; i--)
              c[i] === a && c.splice(i, 1);
        },
        setHash: function (s) {
          return (
            "legacy" === this.mode && this.writeFrame(s),
            this.history === !0
              ? (window.history.pushState({}, document.title, s), this.fire())
              : (w.hash = "/" === s[0] ? s : "/" + s),
            this
          );
        },
        writeFrame: function (s) {
          var f = document.getElementById("state-frame"),
            d = f.contentDocument || f.contentWindow.document;
          d.open(),
            d.write(
              "<script>_hash = '" +
                s +
                "'; onload = parent.listener.syncHash;<script>"
            ),
            d.close();
        },
        syncHash: function () {
          var s = this._hash;
          return s != w.hash && (w.hash = s), this;
        },
        onHashChanged: function () {},
      },
      C = function (a) {
        return this instanceof C
          ? ((this.params = {}),
            (this.routes = {}),
            (this.methods = ["on", "once", "after", "before"]),
            (this.scope = []),
            (this._methods = {}),
            (this._insert = this.insert),
            (this.insert = this.insertEx),
            (this.historySupport =
              null !=
              (null != window.history ? window.history.pushState : null)),
            this.configure(),
            void this.mount(a || {}))
          : new C(a);
      };
    (C.prototype.init = function (r) {
      var a,
        h = this;
      return (
        (this.handler = function (a) {
          var c = (a && a.newURL) || window.location.hash,
            v = h.history === !0 ? h.getPath() : c.replace(/.*#/, "");
          h.dispatch("on", "/" === v.charAt(0) ? v : "/" + v);
        }),
        k.init(this.handler, this.history),
        this.history === !1
          ? c() && r
            ? (w.hash = r)
            : c() || h.dispatch("on", "/" + w.hash.replace(/^(#\/|#|\/)/, ""))
          : (this.convert_hash_in_init
              ? ((a = c() && r ? r : c() ? null : w.hash.replace(/^#/, "")),
                a && window.history.replaceState({}, document.title, a))
              : (a = this.getPath()),
            (a || this.run_in_init === !0) && this.handler()),
        this
      );
    }),
      (C.prototype.explode = function () {
        var a = this.history === !0 ? this.getPath() : w.hash;
        return (
          "/" === a.charAt(1) && (a = a.slice(1)),
          a.slice(1, a.length).split("/")
        );
      }),
      (C.prototype.setRoute = function (i, a, c) {
        var h = this.explode();
        return (
          "number" == typeof i && "string" == typeof a
            ? (h[i] = a)
            : "string" == typeof c
            ? h.splice(i, a, s)
            : (h = [i]),
          k.setHash(h.join("/")),
          h
        );
      }),
      (C.prototype.insertEx = function (a, c, h, v) {
        return (
          "once" === a &&
            ((a = "on"),
            (h = (function (a) {
              var c = !1;
              return function () {
                return c ? void 0 : ((c = !0), a.apply(this, arguments));
              };
            })(h))),
          this._insert(a, c, h, v)
        );
      }),
      (C.prototype.getRoute = function (a) {
        var c = a;
        if ("number" == typeof a) c = this.explode()[a];
        else if ("string" == typeof a) {
          var h = this.explode();
          c = h.indexOf(a);
        } else c = this.explode();
        return c;
      }),
      (C.prototype.destroy = function () {
        return k.destroy(this.handler), this;
      }),
      (C.prototype.getPath = function () {
        var a = window.location.pathname;
        return "/" !== a.substr(0, 1) && (a = "/" + a), a;
      });
    var S = /\?.*/;
    (C.prototype.configure = function (a) {
      a = a || {};
      for (var i = 0; i < this.methods.length; i++)
        this._methods[this.methods[i]] = !0;
      return (
        (this.recurse = a.recurse || this.recurse || !1),
        (this.async = a.async || !1),
        (this.delimiter = a.delimiter || "/"),
        (this.strict = "undefined" == typeof a.strict ? !0 : a.strict),
        (this.notfound = a.notfound),
        (this.resource = a.resource),
        (this.history = (a.html5history && this.historySupport) || !1),
        (this.run_in_init =
          this.history === !0 && a.run_handler_in_init !== !1),
        (this.convert_hash_in_init =
          this.history === !0 && a.convert_hash_in_init !== !1),
        (this.every = {
          after: a.after || null,
          before: a.before || null,
          on: a.on || null,
        }),
        this
      );
    }),
      (C.prototype.param = function (a, c) {
        ":" !== a[0] && (a = ":" + a);
        var h = new RegExp(a, "g");
        return (
          (this.params[a] = function (a) {
            return a.replace(h, c.source || c);
          }),
          this
        );
      }),
      (C.prototype.on = C.prototype.route =
        function (a, c, h) {
          var v = this;
          return (
            h || "function" != typeof c || ((h = c), (c = a), (a = "on")),
            Array.isArray(c)
              ? c.forEach(function (p) {
                  v.on(a, p, h);
                })
              : (c.source && (c = c.source.replace(/\\\//gi, "/")),
                Array.isArray(a)
                  ? a.forEach(function (m) {
                      v.on(m.toLowerCase(), c, h);
                    })
                  : ((c = c.split(new RegExp(this.delimiter))),
                    (c = _(c, this.delimiter)),
                    void this.insert(a, this.scope.concat(c), h)))
          );
        }),
      (C.prototype.path = function (a, c) {
        var h = this.scope.length;
        a.source && (a = a.source.replace(/\\\//gi, "/")),
          (a = a.split(new RegExp(this.delimiter))),
          (a = _(a, this.delimiter)),
          (this.scope = this.scope.concat(a)),
          c.call(this, this),
          this.scope.splice(h, a.length);
      }),
      (C.prototype.dispatch = function (a, c, h) {
        function v() {
          (y.last = b.after), y.invoke(y.runlist(b), y, h);
        }
        var g,
          y = this,
          b = this.traverse(a, c.replace(S, ""), this.routes, ""),
          _ = this._invoked;
        return (
          (this._invoked = !0),
          b && 0 !== b.length
            ? ("forward" === this.recurse && (b = b.reverse()),
              (g =
                this.every && this.every.after
                  ? [this.every.after].concat(this.last)
                  : [this.last]),
              g && g.length > 0 && _
                ? (this.async
                    ? this.invoke(g, this, v)
                    : (this.invoke(g, this), v()),
                  !0)
                : (v(), !0))
            : ((this.last = []),
              "function" == typeof this.notfound &&
                this.invoke([this.notfound], { method: a, path: c }, h),
              !1)
        );
      }),
      (C.prototype.invoke = function (a, c, v) {
        var y,
          b = this;
        this.async
          ? ((y = function (h, v) {
              return Array.isArray(h)
                ? g(h, y, v)
                : void (
                    "function" == typeof h &&
                    h.apply(c, (a.captures || []).concat(v))
                  );
            }),
            g(a, y, function () {
              v && v.apply(c, arguments);
            }))
          : ((y = function (v) {
              return Array.isArray(v)
                ? h(v, y)
                : "function" == typeof v
                ? v.apply(c, a.captures || [])
                : void (
                    "string" == typeof v &&
                    b.resource &&
                    b.resource[v].apply(c, a.captures || [])
                  );
            }),
            h(a, y));
      }),
      (C.prototype.traverse = function (c, h, v, g, y) {
        function b(c) {
          function h(a) {
            for (var c = [], i = 0; i < a.length; i++)
              c[i] = Array.isArray(a[i]) ? h(a[i]) : a[i];
            return c;
          }
          function v(a) {
            for (var i = a.length - 1; i >= 0; i--)
              Array.isArray(a[i])
                ? (v(a[i]), 0 === a[i].length && a.splice(i, 1))
                : y(a[i]) || a.splice(i, 1);
          }
          if (!y) return c;
          var g = h(c);
          return (
            (g.matched = c.matched),
            (g.captures = c.captures),
            (g.after = a(c.after, y)),
            v(g),
            g
          );
        }
        var _,
          w,
          k,
          C,
          $ = [];
        if (h === this.delimiter && v[c])
          return (
            (C = a([v.before, v[c]], Boolean)),
            (C.after = a(v.after, Boolean)),
            (C.matched = !0),
            (C.captures = []),
            b(C)
          );
        for (var r in v)
          if (
            v.hasOwnProperty(r) &&
            (!this._methods[r] ||
              (this._methods[r] &&
                "object" == typeof v[r] &&
                !Array.isArray(v[r])))
          ) {
            if (
              ((_ = w = g + this.delimiter + r),
              this.strict || (w += "[" + this.delimiter + "]?"),
              (k = h.match(new RegExp("^" + w))),
              !k)
            )
              continue;
            if (k[0] && k[0] == h && v[r][c])
              return (
                (C = a([v[r].before, v[r][c]], Boolean)),
                (C.after = a([v[r].after], Boolean)),
                (C.matched = !0),
                (C.captures = k.slice(1)),
                this.recurse &&
                  v === this.routes &&
                  (C.push(a([v.before, v.on], Boolean)),
                  (C.after = C.after.concat(a([v.after], Boolean)))),
                b(C)
              );
            if (((C = this.traverse(c, h, v[r], _)), C.matched))
              return (
                C.length > 0 && ($ = $.concat(C)),
                this.recurse &&
                  ($.push(a([v[r].before, v[r].on], Boolean)),
                  (C.after = C.after.concat(a([v[r].after], Boolean))),
                  v === this.routes &&
                    ($.push(a([v.before, v.on], Boolean)),
                    (C.after = C.after.concat(a([v.after], Boolean))))),
                ($.matched = !0),
                ($.captures = C.captures),
                ($.after = C.after),
                b($)
              );
          }
        return !1;
      }),
      (C.prototype.insert = function (c, h, v, g) {
        var y, _, w, k, C;
        if (
          ((h = a(h, function (p) {
            return p && p.length > 0;
          })),
          (g = g || this.routes),
          (C = h.shift()),
          /\:|\*/.test(C) && !/\\d|\\w/.test(C) && (C = b(C, this.params)),
          h.length > 0)
        )
          return (g[C] = g[C] || {}), this.insert(c, h, v, g[C]);
        if (C || h.length || g !== this.routes) {
          if (
            ((_ = typeof g[C]),
            (w = Array.isArray(g[C])),
            g[C] && !w && "object" == _)
          )
            switch ((y = typeof g[C][c])) {
              case "function":
                return void (g[C][c] = [g[C][c], v]);
              case "object":
                return void g[C][c].push(v);
              case "undefined":
                return void (g[C][c] = v);
            }
          else if ("undefined" == _)
            return (k = {}), (k[c] = v), void (g[C] = k);
          throw new Error("Invalid route context: " + _);
        }
        switch ((y = typeof g[c])) {
          case "function":
            return void (g[c] = [g[c], v]);
          case "object":
            return void g[c].push(v);
          case "undefined":
            return void (g[c] = v);
        }
      }),
      (C.prototype.extend = function (a) {
        function c(a) {
          (h._methods[a] = !0),
            (h[a] = function () {
              var c = 1 === arguments.length ? [a, ""] : [a];
              h.on.apply(h, c.concat(Array.prototype.slice.call(arguments)));
            });
        }
        var i,
          h = this,
          v = a.length;
        for (i = 0; v > i; i++) c(a[i]);
      }),
      (C.prototype.runlist = function (a) {
        var c =
          this.every && this.every.before
            ? [this.every.before].concat(v(a))
            : v(a);
        return (
          this.every && this.every.on && c.push(this.every.on),
          (c.captures = a.captures),
          (c.source = a.source),
          c
        );
      }),
      (C.prototype.mount = function (a, c) {
        function h(c, h) {
          var g = c,
            y = c.split(v.delimiter),
            b = typeof a[c],
            w = "" === y[0] || !v._methods[y[0]],
            k = w ? "on" : g;
          return (
            w &&
              ((g = g.slice(
                (g.match(new RegExp("^" + v.delimiter)) || [""])[0].length
              )),
              y.shift()),
            w && "object" === b && !Array.isArray(a[c])
              ? ((h = h.concat(y)), void v.mount(a[c], h))
              : (w &&
                  ((h = h.concat(g.split(v.delimiter))),
                  (h = _(h, v.delimiter))),
                void v.insert(k, h, a[c]))
          );
        }
        if (a && "object" == typeof a && !Array.isArray(a)) {
          var v = this;
          (c = c || []), Array.isArray(c) || (c = c.split(v.delimiter));
          for (var g in a) a.hasOwnProperty(g) && h(g, c.slice(0));
        }
      }),
      (window.Router = C),
      "function" == typeof define &&
        define.amd &&
        define("director", function () {
          return C;
        });
  })(),
  (function (a) {
    function c(s) {
      return (
        s && ((s = decodeURIComponent(s)), (s = s.replace(re.pluses, " "))), s
      );
    }
    function h(a) {
      var c = re.uri_parser,
        h = [
          "source",
          "protocol",
          "authority",
          "userInfo",
          "user",
          "password",
          "host",
          "port",
          "relative",
          "path",
          "directory",
          "file",
          "query",
          "anchor",
        ],
        m = c.exec(a || ""),
        v = {};
      return (
        h.forEach(function (a, i) {
          v[a] = m[i] || "";
        }),
        v
      );
    }
    function v(a) {
      var i,
        c,
        p,
        n,
        h,
        v,
        g = [];
      if ("undefined" == typeof a || null === a || "" === a) return g;
      for (
        0 === a.indexOf("?") && (a = a.substring(1)),
          c = a.toString().split(re.query_separator),
          i = 0,
          l = c.length;
        l > i;
        i++
      )
        (p = c[i]),
          (n = p.indexOf("=")),
          0 !== n &&
            ((h = decodeURIComponent(p.substring(0, n))),
            (v = decodeURIComponent(p.substring(n + 1))),
            g.push(-1 === n ? [p, null] : [h, v]));
      return g;
    }
    function g(a) {
      (this.uriParts = h(a)),
        (this.queryPairs = v(this.uriParts.query)),
        (this.hasAuthorityPrefixUserPref = null);
    }
    var re = {
      starts_with_slashes: /^\/+/,
      ends_with_slashes: /\/+$/,
      pluses: /\+/g,
      query_separator: /[&;]/,
      uri_parser:
        /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@\/]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
    };
    Array.prototype.forEach ||
      (Array.prototype.forEach = function (a, c) {
        var h, v;
        if (null == this) throw new TypeError(" this is null or not defined");
        var g = Object(this),
          y = g.length >>> 0;
        if ("function" != typeof a)
          throw new TypeError(a + " is not a function");
        for (arguments.length > 1 && (h = c), v = 0; y > v; ) {
          var b;
          v in g && ((b = g[v]), a.call(h, b, v, g)), v++;
        }
      }),
      ["protocol", "userInfo", "host", "port", "path", "anchor"].forEach(
        function (a) {
          g.prototype[a] = function (c) {
            return (
              "undefined" != typeof c && (this.uriParts[a] = c),
              this.uriParts[a]
            );
          };
        }
      ),
      (g.prototype.hasAuthorityPrefix = function (a) {
        return (
          "undefined" != typeof a && (this.hasAuthorityPrefixUserPref = a),
          null === this.hasAuthorityPrefixUserPref
            ? -1 !== this.uriParts.source.indexOf("//")
            : this.hasAuthorityPrefixUserPref
        );
      }),
      (g.prototype.query = function (a) {
        var i,
          c,
          s = "";
        for (
          "undefined" != typeof a && (this.queryPairs = v(a)),
            i = 0,
            l = this.queryPairs.length;
          l > i;
          i++
        )
          (c = this.queryPairs[i]),
            s.length > 0 && (s += "&"),
            null === c[1]
              ? (s += c[0])
              : ((s += c[0]),
                (s += "="),
                c[1] && (s += encodeURIComponent(c[1])));
        return s.length > 0 ? "?" + s : s;
      }),
      (g.prototype.getQueryParamValue = function (a) {
        var c, i;
        for (i = 0, l = this.queryPairs.length; l > i; i++)
          if (((c = this.queryPairs[i]), a === c[0])) return c[1];
      }),
      (g.prototype.getQueryParamValues = function (a) {
        var i,
          c,
          h = [];
        for (i = 0, l = this.queryPairs.length; l > i; i++)
          (c = this.queryPairs[i]), a === c[0] && h.push(c[1]);
        return h;
      }),
      (g.prototype.deleteQueryParam = function (a, h) {
        var i,
          v,
          g,
          y,
          b = [];
        for (i = 0, l = this.queryPairs.length; l > i; i++)
          (v = this.queryPairs[i]),
            (g = c(v[0]) === c(a)),
            (y = v[1] === h),
            ((1 !== arguments.length || g) &&
              (2 !== arguments.length || (g && y))) ||
              b.push(v);
        return (this.queryPairs = b), this;
      }),
      (g.prototype.addQueryParam = function (a, c, h) {
        return (
          3 === arguments.length && -1 !== h
            ? ((h = Math.min(h, this.queryPairs.length)),
              this.queryPairs.splice(h, 0, [a, c]))
            : arguments.length > 0 && this.queryPairs.push([a, c]),
          this
        );
      }),
      (g.prototype.replaceQueryParam = function (a, h, v) {
        var i,
          g,
          y = -1,
          b = this.queryPairs.length;
        if (3 === arguments.length) {
          for (i = 0; b > i; i++)
            if (
              ((g = this.queryPairs[i]),
              c(g[0]) === c(a) && decodeURIComponent(g[1]) === c(v))
            ) {
              y = i;
              break;
            }
          y >= 0 && this.deleteQueryParam(a, c(v)).addQueryParam(a, h, y);
        } else {
          for (i = 0; b > i; i++)
            if (((g = this.queryPairs[i]), c(g[0]) === c(a))) {
              y = i;
              break;
            }
          this.deleteQueryParam(a), this.addQueryParam(a, h, y);
        }
        return this;
      }),
      [
        "protocol",
        "hasAuthorityPrefix",
        "userInfo",
        "host",
        "port",
        "path",
        "query",
        "anchor",
      ].forEach(function (a) {
        var c = "set" + a.charAt(0).toUpperCase() + a.slice(1);
        g.prototype[c] = function (c) {
          return this[a](c), this;
        };
      }),
      (g.prototype.scheme = function () {
        var s = "";
        return (
          this.protocol()
            ? ((s += this.protocol()),
              this.protocol().indexOf(":") !== this.protocol().length - 1 &&
                (s += ":"),
              (s += "//"))
            : this.hasAuthorityPrefix() && this.host() && (s += "//"),
          s
        );
      }),
      (g.prototype.origin = function () {
        var s = this.scheme();
        return "file://" == s
          ? s + this.uriParts.authority
          : (this.userInfo() &&
              this.host() &&
              ((s += this.userInfo()),
              this.userInfo().indexOf("@") !== this.userInfo().length - 1 &&
                (s += "@")),
            this.host() &&
              ((s += this.host()), this.port() && (s += ":" + this.port())),
            s);
      }),
      (g.prototype.addTrailingSlash = function () {
        var a = this.path() || "";
        return "/" !== a.substr(-1) && this.path(a + "/"), this;
      }),
      (g.prototype.toString = function () {
        var a,
          s = this.origin();
        return (
          this.path()
            ? ((a = this.path()),
              re.ends_with_slashes.test(s) || re.starts_with_slashes.test(a)
                ? (s && s.replace(re.ends_with_slashes, "/"),
                  (a = a.replace(re.starts_with_slashes, "/")))
                : (s += "/"),
              (s += a))
            : this.host() &&
              (this.query().toString() || this.anchor()) &&
              (s += "/"),
          this.query().toString() && (s += this.query().toString()),
          this.anchor() &&
            (0 !== this.anchor().indexOf("#") && (s += "#"),
            (s += this.anchor())),
          s
        );
      }),
      (g.prototype.clone = function () {
        return new g(this.toString());
      }),
      "function" == typeof define && define.amd
        ? define("uri", function (require, exports) {
            return (exports.uri = g), g;
          })
        : "undefined" != typeof module && "undefined" != typeof module.exports
        ? (module.exports = g)
        : (a.Uri = g);
  })(this),
  define("dialog_plus", function () {
    var a;
    return (
      !(function () {
        function c(a) {
          var mod = v[a],
            exports = "exports";
          return "object" == typeof mod
            ? mod
            : (mod[exports] ||
                ((mod[exports] = {}),
                (mod[exports] =
                  mod.call(mod[exports], c, mod[exports], mod) ||
                  mod[exports])),
              mod[exports]);
        }
        function h(a, c) {
          v[a] = c;
        }
        var v = {};
        h("jquery", function () {
          return jQuery;
        }),
          h("popup", function (a) {
            function c() {
              (this.destroyed = !1),
                (this.__popup = h("<div />")
                  .css({ display: "none", position: "absolute", outline: 0 })
                  .attr("tabindex", "-1")
                  .html(this.innerHTML)
                  .appendTo("body")),
                (this.__backdrop = this.__mask =
                  h("<div />").css({ opacity: 0.7, background: "#000" })),
                (this.node = this.__popup[0]),
                (this.backdrop = this.__backdrop[0]),
                v++;
            }
            var h = a("jquery"),
              v = 0,
              g = !("minWidth" in h("html")[0].style),
              y = !g;
            return (
              h.extend(c.prototype, {
                node: null,
                backdrop: null,
                fixed: !1,
                destroyed: !0,
                open: !1,
                returnValue: "",
                autofocus: !0,
                align: "bottom left",
                innerHTML: "",
                className: "ui-popup",
                show: function (a) {
                  if (this.destroyed) return this;
                  var v = this.__popup,
                    b = this.__backdrop;
                  if (
                    ((this.__activeElement = this.__getActive()),
                    (this.open = !0),
                    (this.follow = a || this.follow),
                    !this.__ready)
                  ) {
                    if (
                      (v
                        .addClass(this.className)
                        .attr("role", this.modal ? "alertdialog" : "dialog")
                        .css("position", this.fixed ? "fixed" : "absolute"),
                      g || h(window).on("resize", h.proxy(this.reset, this)),
                      this.modal)
                    ) {
                      var _ = {
                        position: "fixed",
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        overflow: "hidden",
                        userSelect: "none",
                        zIndex: this.zIndex || c.zIndex,
                      };
                      v.addClass(this.className + "-modal"),
                        y ||
                          h.extend(_, {
                            position: "absolute",
                            width: h(window).width() + "px",
                            height: h(document).height() + "px",
                          }),
                        b
                          .css(_)
                          .attr({ tabindex: "0" })
                          .on("focus", h.proxy(this.focus, this)),
                        (this.__mask = b
                          .clone(!0)
                          .attr("style", "")
                          .insertAfter(v)),
                        b
                          .addClass(this.className + "-backdrop")
                          .insertBefore(v),
                        (this.__ready = !0);
                    }
                    v.html() || v.html(this.innerHTML);
                  }
                  return (
                    v.addClass(this.className + "-show").show(),
                    b.show(),
                    this.reset().focus(),
                    this.__dispatchEvent("show"),
                    this
                  );
                },
                showModal: function () {
                  return (this.modal = !0), this.show.apply(this, arguments);
                },
                close: function (a) {
                  return (
                    !this.destroyed &&
                      this.open &&
                      (void 0 !== a && (this.returnValue = a),
                      this.__popup.hide().removeClass(this.className + "-show"),
                      this.__backdrop.hide(),
                      (this.open = !1),
                      this.blur(),
                      this.__dispatchEvent("close")),
                    this
                  );
                },
                remove: function () {
                  if (this.destroyed) return this;
                  this.__dispatchEvent("beforeremove"),
                    c.current === this && (c.current = null),
                    this.__popup.remove(),
                    this.__backdrop.remove(),
                    this.__mask.remove(),
                    g || h(window).off("resize", this.reset),
                    this.__dispatchEvent("remove");
                  for (var i in this) delete this[i];
                  return this;
                },
                reset: function () {
                  var a = this.follow;
                  return (
                    a ? this.__follow(a) : this.__center(),
                    this.__dispatchEvent("reset"),
                    this
                  );
                },
                focus: function () {
                  var a = this.node,
                    v = this.__popup,
                    g = c.current,
                    y = (this.zIndex = c.zIndex++);
                  if (
                    (g && g !== this && g.blur(!1),
                    !h.contains(a, this.__getActive()))
                  ) {
                    var b = v.find("[autofocus]")[0];
                    !this._autofocus && b ? (this._autofocus = !0) : (b = a),
                      this.__focus(b);
                  }
                  return (
                    v.css("zIndex", y),
                    (c.current = this),
                    v.addClass(this.className + "-focus"),
                    this.__dispatchEvent("focus"),
                    this
                  );
                },
                blur: function () {
                  var a = this.__activeElement,
                    c = arguments[0];
                  return (
                    c !== !1 && this.__focus(a),
                    (this._autofocus = !1),
                    this.__popup.removeClass(this.className + "-focus"),
                    this.__dispatchEvent("blur"),
                    this
                  );
                },
                addEventListener: function (a, c) {
                  return this.__getEventListener(a).push(c), this;
                },
                removeEventListener: function (a, c) {
                  for (
                    var h = this.__getEventListener(a), i = 0;
                    i < h.length;
                    i++
                  )
                    c === h[i] && h.splice(i--, 1);
                  return this;
                },
                __getEventListener: function (a) {
                  var c = this.__listener;
                  return (
                    c || (c = this.__listener = {}), c[a] || (c[a] = []), c[a]
                  );
                },
                __dispatchEvent: function (a) {
                  var c = this.__getEventListener(a);
                  this["on" + a] && this["on" + a]();
                  for (var i = 0; i < c.length; i++) c[i].call(this);
                },
                __focus: function (a) {
                  try {
                    this.autofocus &&
                      !/^iframe$/i.test(a.nodeName) &&
                      a.focus();
                  } catch (e) {}
                },
                __getActive: function () {
                  try {
                    var a = document.activeElement,
                      c = a.contentDocument,
                      v = (c && c.activeElement) || a;
                    return null == v && (v = window.body), v;
                  } catch (e) {
                    return h("body")[0];
                  }
                },
                __center: function () {
                  var a = this.__popup,
                    c = h(window),
                    v = h(document),
                    g = this.fixed,
                    y = g ? 0 : v.scrollLeft(),
                    b = g ? 0 : v.scrollTop(),
                    _ = c.width(),
                    w = c.height(),
                    k = a.width(),
                    C = a.height(),
                    $ = (_ - k) / 2 + y,
                    S = (382 * (w - C)) / 1e3 + b,
                    O = a[0].style;
                  (O.left = Math.max(parseInt($), y) + "px"),
                    (O.top = Math.max(parseInt(S), b) + "px");
                },
                __follow: function (a) {
                  var c = a.parentNode && h(a),
                    v = this.__popup;
                  if (
                    (this.__followSkin && v.removeClass(this.__followSkin), c)
                  ) {
                    var o = c.offset();
                    if (o.left * o.top < 0) return this.__center();
                  }
                  var g = this,
                    y = this.fixed,
                    b = h(window),
                    _ = h(document),
                    w = b.width(),
                    k = b.height(),
                    C = _.scrollLeft(),
                    $ = _.scrollTop(),
                    S = v.width(),
                    O = v.height(),
                    P = c ? c.outerWidth() : 0,
                    M = c ? c.outerHeight() : 0,
                    E = this.__offset(a),
                    x = E.left,
                    D = E.top,
                    j = y ? x - C : x,
                    I = y ? D - $ : D,
                    T = y ? 0 : C,
                    A = y ? 0 : $,
                    N = T + w - S,
                    R = A + k - O,
                    B = {},
                    F = this.align.split(" "),
                    J = this.className + "-",
                    U = {
                      top: "bottom",
                      bottom: "top",
                      left: "right",
                      right: "left",
                    },
                    L = {
                      top: "top",
                      bottom: "top",
                      left: "left",
                      right: "left",
                    },
                    Q = [
                      { top: I - O, bottom: I + M, left: j - S, right: j + P },
                      { top: I, bottom: I - O + M, left: j, right: j - S + P },
                    ],
                    H = { left: j + P / 2 - S / 2, top: I + M / 2 - O / 2 },
                    W = { left: [T, N], top: [A, R] };
                  h.each(F, function (i, a) {
                    Q[i][a] > W[L[a]][1] && (a = F[i] = U[a]),
                      Q[i][a] < W[L[a]][0] && (F[i] = U[a]);
                  }),
                    F[1] ||
                      ((L[F[1]] = "left" === L[F[0]] ? "top" : "left"),
                      (Q[1][F[1]] = H[L[F[1]]])),
                    (J += F.join("-") + " " + this.className + "-follow"),
                    (g.__followSkin = J),
                    c && v.addClass(J),
                    (B[L[F[0]]] = parseInt(Q[0][F[0]])),
                    (B[L[F[1]]] = parseInt(Q[1][F[1]])),
                    v.css(B);
                },
                __offset: function (a) {
                  var c = a.parentNode,
                    v = c ? h(a).offset() : { left: a.pageX, top: a.pageY };
                  a = c ? a : a.target;
                  var g = a.ownerDocument,
                    y = g.defaultView || g.parentWindow;
                  if (y == window) return v;
                  var b = y.frameElement,
                    _ = h(g),
                    w = _.scrollLeft(),
                    k = _.scrollTop(),
                    C = h(b).offset(),
                    $ = C.left,
                    S = C.top;
                  return { left: v.left + $ - w, top: v.top + S - k };
                },
              }),
              (c.zIndex = 1024),
              (c.current = null),
              c
            );
          }),
          h("dialog-config", {
            backdropBackground: "#c0c0c0",
            backdropOpacity: 0.7,
            content: '<span class="ui-dialog-loading">Loading..</span>',
            title: "",
            statusbar: "",
            button: null,
            ok: null,
            cancel: null,
            okValue: "ok",
            cancelValue: "取消",
            cancelDisplay: !0,
            width: "",
            height: "",
            padding: "",
            skin: "",
            quickClose: !1,
            cssUri: "ui-dialog.css",
            innerHTML:
              '<div i="dialog" class="ui-dialog"><div class="ui-dialog-arrow-a"></div><div class="ui-dialog-arrow-b"></div><table class="ui-dialog-grid"><tr><td i="header" class="ui-dialog-header"><button i="close" class="ui-dialog-close">&#215;</button><div i="title" class="ui-dialog-title"></div></td></tr><tr><td i="body" class="ui-dialog-body"><div i="content" class="ui-dialog-content"></div></td></tr><tr><td i="footer" class="ui-dialog-footer"><div i="statusbar" class="ui-dialog-statusbar"></div><div i="button" class="ui-dialog-button"></div></td></tr></table></div>',
          }),
          h("dialog", function (a) {
            var c = a("jquery"),
              h = a("popup"),
              v = a("dialog-config"),
              g = v.cssUri;
            if (g) {
              var y = a[a.toUrl ? "toUrl" : "resolve"];
              y &&
                ((g = y(g)),
                (g = '<link rel="stylesheet" href="' + g + '" />'),
                c("base")[0] ? c("base").before(g) : c("head").append(g));
            }
            var b = 0,
              _ = new Date() - 0,
              w = !("minWidth" in c("html")[0].style),
              k =
                ("createTouch" in document && !("onmousemove" in document)) ||
                /(iPhone|iPad|iPod)/i.test(navigator.userAgent),
              C = !w && !k,
              $ = function (a, h, v) {
                var g = (a = a || {});
                ("string" == typeof a || 1 === a.nodeType) &&
                  (a = { content: a, fixed: !k }),
                  (a = c.extend(!0, {}, $.defaults, a)),
                  (a.original = g);
                var y = (a.id = a.id || _ + b),
                  w = $.get(y);
                return w
                  ? w.focus()
                  : (C || (a.fixed = !1),
                    a.quickClose && ((a.modal = !0), (a.backdropOpacity = 0)),
                    c.isArray(a.button) || (a.button = []),
                    void 0 !== v && (a.cancel = v),
                    a.cancel &&
                      a.button.push({
                        id: "cancel",
                        value: a.cancelValue,
                        callback: a.cancel,
                        display: a.cancelDisplay,
                      }),
                    void 0 !== h && (a.ok = h),
                    a.ok &&
                      a.button.push({
                        id: "ok",
                        value: a.okValue,
                        callback: a.ok,
                        autofocus: !0,
                      }),
                    ($.list[y] = new $.create(a)));
              },
              S = function () {};
            S.prototype = h.prototype;
            var O = ($.prototype = new S());
            return (
              ($.create = function (a) {
                var v = this;
                c.extend(this, new h());
                var g = (a.original, c(this.node).html(a.innerHTML)),
                  y = c(this.backdrop);
                return (
                  (this.options = a),
                  (this._popup = g),
                  c.each(a, function (a, c) {
                    "function" == typeof v[a] ? v[a](c) : (v[a] = c);
                  }),
                  a.zIndex && (h.zIndex = a.zIndex),
                  g.attr({
                    "aria-labelledby": this._$("title")
                      .attr("id", "title:" + this.id)
                      .attr("id"),
                    "aria-describedby": this._$("content")
                      .attr("id", "content:" + this.id)
                      .attr("id"),
                  }),
                  this._$("close")
                    .css("display", this.cancel === !1 ? "none" : "")
                    .attr("title", this.cancelValue)
                    .on("click", function (a) {
                      v._trigger("cancel"), a.preventDefault();
                    }),
                  this._$("dialog").addClass(this.skin),
                  this._$("body").css("padding", this.padding),
                  a.quickClose &&
                    y.on(
                      "onmousedown" in document ? "mousedown" : "click",
                      function () {
                        return v._trigger("cancel"), !1;
                      }
                    ),
                  this.addEventListener("show", function () {
                    y.css({
                      opacity: 0,
                      background: a.backdropBackground,
                    }).animate({ opacity: a.backdropOpacity }, 150);
                  }),
                  (this._esc = function (a) {
                    var c = a.target,
                      g = c.nodeName,
                      y = /^input|textarea$/i,
                      b = h.current === v,
                      _ = a.keyCode;
                    !b ||
                      (y.test(g) && "button" !== c.type) ||
                      (27 === _ && v._trigger("cancel"));
                  }),
                  c(document).on("keydown", this._esc),
                  this.addEventListener("remove", function () {
                    c(document).off("keydown", this._esc),
                      delete $.list[this.id];
                  }),
                  b++,
                  $.oncreate(this),
                  this
                );
              }),
              ($.create.prototype = O),
              c.extend(O, {
                content: function (a) {
                  var h = this._$("content");
                  return (
                    "object" == typeof a
                      ? ((a = c(a)),
                        h.empty("").append(a.show()),
                        this.addEventListener("beforeremove", function () {
                          void 0 != typeof this.options.type &&
                            "html" == this.options.type &&
                            c("body").append(a.hide());
                        }))
                      : h.html(a),
                    this.reset()
                  );
                },
                title: function (a) {
                  return (
                    this._$("title").text(a),
                    this._$("header")[a ? "show" : "hide"](),
                    this
                  );
                },
                width: function (a) {
                  return this._$("content").css("width", a), this.reset();
                },
                height: function (a) {
                  return this._$("content").css("height", a), this.reset();
                },
                button: function (a) {
                  a = a || [];
                  var h = this,
                    v = "",
                    g = 0;
                  return (
                    (this.callbacks = {}),
                    "string" == typeof a
                      ? ((v = a), g++)
                      : c.each(a, function (i, a) {
                          var y = (a.id = a.id || a.value),
                            b = "";
                          (h.callbacks[y] = a.callback),
                            a.display === !1
                              ? (b = ' style="display:none"')
                              : g++,
                            (v +=
                              '<button type="button" i-id="' +
                              y +
                              '"' +
                              b +
                              (a.disabled ? " disabled" : "") +
                              (a.autofocus
                                ? ' autofocus class="ui-dialog-autofocus"'
                                : "") +
                              ">" +
                              a.value +
                              "</button>"),
                            h
                              ._$("button")
                              .on("click", "[i-id=" + y + "]", function (a) {
                                var v = c(this);
                                v.attr("disabled") || h._trigger(y),
                                  a.preventDefault();
                              });
                        }),
                    this._$("button").html(v),
                    this._$("footer")[g ? "show" : "hide"](),
                    this
                  );
                },
                statusbar: function (a) {
                  return (
                    this._$("statusbar").html(a)[a ? "show" : "hide"](), this
                  );
                },
                _$: function (i) {
                  return this._popup.find("[i=" + i + "]");
                },
                _trigger: function (a) {
                  var c = this.callbacks[a];
                  return "function" != typeof c || c.call(this) !== !1
                    ? this.close().remove()
                    : this;
                },
              }),
              ($.oncreate = c.noop),
              ($.getCurrent = function () {
                return h.current;
              }),
              ($.get = function (a) {
                return void 0 === a ? $.list : $.list[a];
              }),
              ($.list = {}),
              ($.defaults = v),
              $
            );
          }),
          h("drag", function (a) {
            var c = a("jquery"),
              h = c(window),
              v = c(document),
              g = "createTouch" in document,
              y = document.documentElement,
              b = !("minWidth" in y.style),
              _ = !b && "onlosecapture" in y,
              w = "setCapture" in y,
              k = {
                start: g ? "touchstart" : "mousedown",
                over: g ? "touchmove" : "mousemove",
                end: g ? "touchend" : "mouseup",
              },
              C = g
                ? function (a) {
                    return (
                      a.touches || (a = a.originalEvent.touches.item(0)), a
                    );
                  }
                : function (a) {
                    return a;
                  },
              $ = function () {
                (this.start = c.proxy(this.start, this)),
                  (this.over = c.proxy(this.over, this)),
                  (this.end = c.proxy(this.end, this)),
                  (this.onstart = this.onover = this.onend = c.noop);
              };
            return (
              ($.types = k),
              ($.prototype = {
                start: function (a) {
                  return (
                    (a = this.startFix(a)),
                    v.on(k.over, this.over).on(k.end, this.end),
                    this.onstart(a),
                    !1
                  );
                },
                over: function (a) {
                  return (a = this.overFix(a)), this.onover(a), !1;
                },
                end: function (a) {
                  return (
                    (a = this.endFix(a)),
                    v.off(k.over, this.over).off(k.end, this.end),
                    this.onend(a),
                    !1
                  );
                },
                startFix: function (a) {
                  return (
                    (a = C(a)),
                    (this.target = c(a.target)),
                    (this.selectstart = function () {
                      return !1;
                    }),
                    v
                      .on("selectstart", this.selectstart)
                      .on("dblclick", this.end),
                    _
                      ? this.target.on("losecapture", this.end)
                      : h.on("blur", this.end),
                    w && this.target[0].setCapture(),
                    a
                  );
                },
                overFix: function (a) {
                  return (a = C(a));
                },
                endFix: function (a) {
                  return (
                    (a = C(a)),
                    v
                      .off("selectstart", this.selectstart)
                      .off("dblclick", this.end),
                    _
                      ? this.target.off("losecapture", this.end)
                      : h.off("blur", this.end),
                    w && this.target[0].releaseCapture(),
                    a
                  );
                },
              }),
              ($.create = function (a, g) {
                var y,
                  b,
                  _,
                  w,
                  k = c(a),
                  C = new $(),
                  S = $.types.start,
                  O = function () {},
                  P = a.className.replace(/^\s|\s.*/g, "") + "-drag-start",
                  M = {
                    onstart: O,
                    onover: O,
                    onend: O,
                    off: function () {
                      k.off(S, C.start);
                    },
                  };
                return (
                  (C.onstart = function (c) {
                    var g = "fixed" === k.css("position"),
                      C = v.scrollLeft(),
                      $ = v.scrollTop(),
                      S = k.width(),
                      O = k.height();
                    (y = 0),
                      (b = 0),
                      (_ = g ? h.width() - S + y : v.width() - S),
                      (w = g ? h.height() - O + b : v.height() - O);
                    var E = k.offset(),
                      D = (this.startLeft = g ? E.left - C : E.left),
                      j = (this.startTop = g ? E.top - $ : E.top);
                    (this.clientX = c.clientX),
                      (this.clientY = c.clientY),
                      k.addClass(P),
                      M.onstart.call(a, c, D, j);
                  }),
                  (C.onover = function (c) {
                    var h = c.clientX - this.clientX + this.startLeft,
                      v = c.clientY - this.clientY + this.startTop,
                      g = k[0].style;
                    (h = Math.max(y, Math.min(_, h))),
                      (v = Math.max(b, Math.min(w, v))),
                      (g.left = h + "px"),
                      (g.top = v + "px"),
                      M.onover.call(a, c, h, v);
                  }),
                  (C.onend = function (c) {
                    var h = k.position(),
                      v = h.left,
                      g = h.top;
                    k.removeClass(P), M.onend.call(a, c, v, g);
                  }),
                  (C.off = function () {
                    k.off(S, C.start);
                  }),
                  g ? C.start(g) : k.on(S, C.start),
                  M
                );
              }),
              $
            );
          }),
          h("dialog-plus", function (a) {
            var c = a("jquery"),
              h = a("dialog"),
              v = a("drag");
            return (
              (h.oncreate = function (a) {
                var h,
                  g = a.options,
                  y = g.original,
                  b = g.url,
                  _ = g.oniframeload;
                if (
                  (b &&
                    ((this.padding = g.padding = 0),
                    (h = c("<iframe />")),
                    h
                      .attr({
                        src: b,
                        name: a.id,
                        width: "100%",
                        height: "100%",
                        allowtransparency: "yes",
                        frameborder: "no",
                        scrolling: "yes",
                      })
                      .on("load", function () {
                        var v;
                        try {
                          v = h[0].contentWindow.frameElement;
                        } catch (e) {}
                        if (
                          v &&
                          (g.width || a.width(h.contents().width()), !g.height)
                        ) {
                          a.height(h.contents().height());
                          var y = function (a, c, h) {
                              var v,
                                g = null;
                              return (
                                (h = h || this),
                                function y() {
                                  var b = +new Date();
                                  v || (v = b);
                                  var _ = c - (b - v);
                                  0 >= _
                                    ? (clearTimeout(g),
                                      (g = null),
                                      a.call(h),
                                      (v = b))
                                    : g || (g = setTimeout(y, _));
                                }
                              );
                            },
                            b = y(function () {
                              a.height(
                                Math.min(
                                  h.contents().height(),
                                  c(window).height() - 120
                                )
                              );
                            }, 200);
                          h
                            .contents()
                            .on("DOMSubtreeModified propertychange", b),
                            c(window).on("resize", b),
                            (a.onbeforeremove = function () {
                              h
                                .contents()
                                .off("DOMSubtreeModified propertychange", b),
                                c(window).off("resize", b);
                            });
                        }
                        _ && _.call(a);
                      }),
                    a.addEventListener(
                      "beforeremove",
                      function () {
                        h.attr("src", "about:blank").remove();
                      },
                      !1
                    ),
                    a.content(h[0]),
                    (a.iframeNode = h[0])),
                  !(y instanceof Object))
                )
                  for (
                    var w = function () {
                        a.close().remove();
                      },
                      i = 0;
                    i < frames.length;
                    i++
                  )
                    try {
                      if (y instanceof frames[i].Object) {
                        c(frames[i]).one("unload", w);
                        break;
                      }
                    } catch (e) {}
                c(a.node).on(v.types.start, "[i=title]", function (c) {
                  a.follow || (a.focus(), v.create(a.node, c));
                });
              }),
              (h.get = function (a) {
                if (a && a.frameElement) {
                  var c,
                    v = a.frameElement,
                    g = h.list;
                  for (var i in g)
                    if (
                      ((c = g[i]),
                      c.node.getElementsByTagName("iframe")[0] === v)
                    )
                      return c;
                } else if (a) return h.list[a];
              }),
              h
            );
          }),
          (a = c("dialog-plus"));
      })(),
      a
    );
  }),
  (function (a) {
    (a.easing.jswing = a.easing.swing),
      a.extend(a.easing, {
        def: "easeOutQuad",
        swing: function (x, t, c, h, d) {
          return a.easing[a.easing.def](x, t, c, h, d);
        },
        easeInQuad: function (x, t, a, c, d) {
          return c * (t /= d) * t + a;
        },
        easeOutQuad: function (x, t, a, c, d) {
          return -c * (t /= d) * (t - 2) + a;
        },
        easeInOutQuad: function (x, t, a, c, d) {
          return (t /= d / 2) < 1
            ? (c / 2) * t * t + a
            : (-c / 2) * (--t * (t - 2) - 1) + a;
        },
        easeInCubic: function (x, t, a, c, d) {
          return c * (t /= d) * t * t + a;
        },
        easeOutCubic: function (x, t, a, c, d) {
          return c * ((t = t / d - 1) * t * t + 1) + a;
        },
        easeInOutCubic: function (x, t, a, c, d) {
          return (t /= d / 2) < 1
            ? (c / 2) * t * t * t + a
            : (c / 2) * ((t -= 2) * t * t + 2) + a;
        },
        easeInQuart: function (x, t, a, c, d) {
          return c * (t /= d) * t * t * t + a;
        },
        easeOutQuart: function (x, t, a, c, d) {
          return -c * ((t = t / d - 1) * t * t * t - 1) + a;
        },
        easeInOutQuart: function (x, t, a, c, d) {
          return (t /= d / 2) < 1
            ? (c / 2) * t * t * t * t + a
            : (-c / 2) * ((t -= 2) * t * t * t - 2) + a;
        },
        easeInQuint: function (x, t, a, c, d) {
          return c * (t /= d) * t * t * t * t + a;
        },
        easeOutQuint: function (x, t, a, c, d) {
          return c * ((t = t / d - 1) * t * t * t * t + 1) + a;
        },
        easeInOutQuint: function (x, t, a, c, d) {
          return (t /= d / 2) < 1
            ? (c / 2) * t * t * t * t * t + a
            : (c / 2) * ((t -= 2) * t * t * t * t + 2) + a;
        },
        easeInSine: function (x, t, a, c, d) {
          return -c * Math.cos((t / d) * (Math.PI / 2)) + c + a;
        },
        easeOutSine: function (x, t, a, c, d) {
          return c * Math.sin((t / d) * (Math.PI / 2)) + a;
        },
        easeInOutSine: function (x, t, a, c, d) {
          return (-c / 2) * (Math.cos((Math.PI * t) / d) - 1) + a;
        },
        easeInExpo: function (x, t, a, c, d) {
          return 0 == t ? a : c * Math.pow(2, 10 * (t / d - 1)) + a;
        },
        easeOutExpo: function (x, t, a, c, d) {
          return t == d ? a + c : c * (-Math.pow(2, (-10 * t) / d) + 1) + a;
        },
        easeInOutExpo: function (x, t, a, c, d) {
          return 0 == t
            ? a
            : t == d
            ? a + c
            : (t /= d / 2) < 1
            ? (c / 2) * Math.pow(2, 10 * (t - 1)) + a
            : (c / 2) * (-Math.pow(2, -10 * --t) + 2) + a;
        },
        easeInCirc: function (x, t, a, c, d) {
          return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + a;
        },
        easeOutCirc: function (x, t, a, c, d) {
          return c * Math.sqrt(1 - (t = t / d - 1) * t) + a;
        },
        easeInOutCirc: function (x, t, a, c, d) {
          return (t /= d / 2) < 1
            ? (-c / 2) * (Math.sqrt(1 - t * t) - 1) + a
            : (c / 2) * (Math.sqrt(1 - (t -= 2) * t) + 1) + a;
        },
        easeInElastic: function (x, t, a, c, d) {
          var s = 1.70158,
            p = 0,
            h = c;
          if (0 == t) return a;
          if (1 == (t /= d)) return a + c;
          if ((p || (p = 0.3 * d), h < Math.abs(c))) {
            h = c;
            var s = p / 4;
          } else var s = (p / (2 * Math.PI)) * Math.asin(c / h);
          return (
            -(
              h *
              Math.pow(2, 10 * (t -= 1)) *
              Math.sin((2 * (t * d - s) * Math.PI) / p)
            ) + a
          );
        },
        easeOutElastic: function (x, t, a, c, d) {
          var s = 1.70158,
            p = 0,
            h = c;
          if (0 == t) return a;
          if (1 == (t /= d)) return a + c;
          if ((p || (p = 0.3 * d), h < Math.abs(c))) {
            h = c;
            var s = p / 4;
          } else var s = (p / (2 * Math.PI)) * Math.asin(c / h);
          return (
            h *
              Math.pow(2, -10 * t) *
              Math.sin((2 * (t * d - s) * Math.PI) / p) +
            c +
            a
          );
        },
        easeInOutElastic: function (x, t, a, c, d) {
          var s = 1.70158,
            p = 0,
            h = c;
          if (0 == t) return a;
          if (2 == (t /= d / 2)) return a + c;
          if ((p || (p = 0.3 * d * 1.5), h < Math.abs(c))) {
            h = c;
            var s = p / 4;
          } else var s = (p / (2 * Math.PI)) * Math.asin(c / h);
          return 1 > t
            ? -0.5 *
                h *
                Math.pow(2, 10 * (t -= 1)) *
                Math.sin((2 * (t * d - s) * Math.PI) / p) +
                a
            : h *
                Math.pow(2, -10 * (t -= 1)) *
                Math.sin((2 * (t * d - s) * Math.PI) / p) *
                0.5 +
                c +
                a;
        },
        easeInBack: function (x, t, a, c, d, s) {
          return (
            void 0 == s && (s = 1.70158),
            c * (t /= d) * t * ((s + 1) * t - s) + a
          );
        },
        easeOutBack: function (x, t, a, c, d, s) {
          return (
            void 0 == s && (s = 1.70158),
            c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + a
          );
        },
        easeInOutBack: function (x, t, a, c, d, s) {
          return (
            void 0 == s && (s = 1.70158),
            (t /= d / 2) < 1
              ? (c / 2) * t * t * (((s *= 1.525) + 1) * t - s) + a
              : (c / 2) * ((t -= 2) * t * (((s *= 1.525) + 1) * t + s) + 2) + a
          );
        },
        easeInBounce: function (x, t, c, h, d) {
          return h - a.easing.easeOutBounce(x, d - t, 0, h, d) + c;
        },
        easeOutBounce: function (x, t, a, c, d) {
          return (t /= d) < 1 / 2.75
            ? 7.5625 * c * t * t + a
            : 2 / 2.75 > t
            ? c * (7.5625 * (t -= 1.5 / 2.75) * t + 0.75) + a
            : 2.5 / 2.75 > t
            ? c * (7.5625 * (t -= 2.25 / 2.75) * t + 0.9375) + a
            : c * (7.5625 * (t -= 2.625 / 2.75) * t + 0.984375) + a;
        },
        easeInOutBounce: function (x, t, c, h, d) {
          return d / 2 > t
            ? 0.5 * a.easing.easeInBounce(x, 2 * t, 0, h, d) + c
            : 0.5 * a.easing.easeOutBounce(x, 2 * t - d, 0, h, d) + 0.5 * h + c;
        },
      }),
      "function" == typeof define &&
        define.amd &&
        define("jquery_easy", function () {
          return a;
        });
  })(jQuery),
  (function (jQuery) {
    var _after = 1,
      _afterThrow = 2,
      _afterFinally = 3,
      _before = 4,
      _around = 5,
      _intro = 6,
      _regexEnabled = !0,
      _arguments = "arguments",
      _undef = "undefined",
      getType = (function () {
        for (
          var a = Object.prototype.toString,
            c = {},
            h = { 1: "element", 3: "textnode", 9: "document", 11: "fragment" },
            v =
              "Arguments Array Boolean Date Document Element Error Fragment Function NodeList Null Number Object RegExp String TextNode Undefined Window".split(
                " "
              ),
            i = v.length;
          i--;

        ) {
          var g = v[i],
            y = window[g];
          if (y)
            try {
              c[a.call(new y())] = g.toLowerCase();
            } catch (e) {}
        }
        return function (v) {
          return (
            (null == v && (void 0 === v ? _undef : "null")) ||
            (v.nodeType && h[v.nodeType]) ||
            ("number" == typeof v.length &&
              ((v.callee && _arguments) ||
                (v.alert && "window") ||
                (v.item && "nodelist"))) ||
            c[a.call(v)]
          );
        };
      })(),
      isFunc = function (a) {
        return "function" == getType(a);
      },
      weaveOne = function (source, method, advice) {
        var old = source[method];
        if (advice.type != _intro && !isFunc(old)) {
          var oldObject = old;
          old = function () {
            for (
              var code = arguments.length > 0 ? _arguments + "[0]" : "", i = 1;
              i < arguments.length;
              i++
            )
              code += "," + _arguments + "[" + i + "]";
            return eval("oldObject(" + code + ");");
          };
        }
        var aspect;
        return (
          advice.type == _after ||
          advice.type == _afterThrow ||
          advice.type == _afterFinally
            ? (aspect = function () {
                var a,
                  c = null;
                try {
                  a = old.apply(this, arguments);
                } catch (e) {
                  c = e;
                }
                if (advice.type == _after) {
                  if (null != c) throw c;
                  a = advice.value.apply(this, [a, method]);
                } else
                  advice.type == _afterThrow && null != c
                    ? (a = advice.value.apply(this, [c, method]))
                    : advice.type == _afterFinally &&
                      (a = advice.value.apply(this, [a, c, method]));
                return a;
              })
            : advice.type == _before
            ? (aspect = function () {
                return (
                  advice.value.apply(this, [arguments, method]),
                  old.apply(this, arguments)
                );
              })
            : advice.type == _intro
            ? (aspect = function () {
                return advice.value.apply(this, arguments);
              })
            : advice.type == _around &&
              (aspect = function () {
                var a = {
                  object: this,
                  args: Array.prototype.slice.call(arguments),
                };
                return advice.value.apply(a.object, [
                  {
                    arguments: a.args,
                    method: method,
                    proceed: function () {
                      return old.apply(a.object, a.args);
                    },
                  },
                ]);
              }),
          (aspect.unweave = function () {
            (source[method] = old), (pointcut = source = aspect = old = null);
          }),
          (source[method] = aspect),
          aspect
        );
      },
      search = function (a, c, h) {
        var v = [];
        for (var g in a) {
          var y = null;
          try {
            y = a[g];
          } catch (e) {}
          null != y &&
            g.match(c.method) &&
            isFunc(y) &&
            (v[v.length] = { source: a, method: g, advice: h });
        }
        return v;
      },
      weave = function (a, c) {
        var h =
            typeof a.target.prototype != _undef ? a.target.prototype : a.target,
          v = [];
        if (c.type != _intro && typeof h[a.method] == _undef) {
          var g = search(a.target, a, c);
          0 == g.length && (g = search(h, a, c));
          for (var i in g)
            v[v.length] = weaveOne(g[i].source, g[i].method, g[i].advice);
        } else v[0] = weaveOne(h, a.method, c);
        return _regexEnabled ? v : v[0];
      };
    (jQuery.aop = {
      after: function (a, c) {
        return weave(a, { type: _after, value: c });
      },
      afterThrow: function (a, c) {
        return weave(a, { type: _afterThrow, value: c });
      },
      afterFinally: function (a, c) {
        return weave(a, { type: _afterFinally, value: c });
      },
      before: function (a, c) {
        return weave(a, { type: _before, value: c });
      },
      around: function (a, c) {
        return weave(a, { type: _around, value: c });
      },
      introduction: function (a, c) {
        return weave(a, { type: _intro, value: c });
      },
      setup: function (a) {
        _regexEnabled = a.regexMatch;
      },
    }),
      "function" == typeof define &&
        define.amd &&
        define("jqaop", function () {
          return jQuery;
        });
  })($),
  (function (a) {
    define("cookie", a);
  })(function () {
    function a(s) {
      return config.raw ? s : encodeURIComponent(s);
    }
    function c(s) {
      return config.raw ? s : decodeURIComponent(s);
    }
    function h(c) {
      return a(config.json ? JSON.stringify(c) : String(c));
    }
    function v(s) {
      0 === s.indexOf('"') &&
        (s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
      try {
        return (
          (s = decodeURIComponent(s.replace(b, " "))),
          config.json ? JSON.parse(s) : s
        );
      } catch (e) {}
    }
    function g(s, a) {
      var c = config.raw ? s : v(s);
      return $.isFunction(a) ? a(c) : c;
    }
    var y = {},
      b = /\+/g;
    return (
      (y.cookie = function (v, y, b) {
        if (arguments.length > 1 && !$.isFunction(y)) {
          if (
            ((b = $.extend({}, config.defaults, b)),
            "number" == typeof b.expires)
          ) {
            var _ = b.expires,
              t = (b.expires = new Date());
            t.setTime(+t + 864e5 * _);
          }
          return (document.cookie = [
            a(v),
            "=",
            h(y),
            b.expires ? "; expires=" + b.expires.toUTCString() : "",
            b.path ? "; path=" + b.path : "",
            b.domain ? "; domain=" + b.domain : "",
            b.secure ? "; secure" : "",
          ].join(""));
        }
        for (
          var w = v ? void 0 : {},
            k = document.cookie ? document.cookie.split("; ") : [],
            i = 0,
            l = k.length;
          l > i;
          i++
        ) {
          var C = k[i].split("="),
            S = c(C.shift()),
            O = C.join("=");
          if (v && v === S) {
            w = g(O, y);
            break;
          }
          v || void 0 === (O = g(O)) || (w[S] = O);
        }
        return w;
      }),
      ($.cookie = config = y.cookie),
      (config.defaults = {}),
      (y.removeCookie = function (a, c) {
        return void 0 === y.cookie(a)
          ? !1
          : (y.cookie(a, "", $.extend({}, c, { expires: -1 })), !y.cookie(a));
      }),
      ($.removeCookie = y.removeCookie),
      y
    );
  }),
  this.JSON || (JSON = {}),
  (function () {
    function f(n) {
      return 10 > n ? "0" + n : n;
    }
    function quote(a) {
      return (
        (escapable.lastIndex = 0),
        escapable.test(a)
          ? '"' +
            a.replace(escapable, function (a) {
              var c = meta[a];
              return "string" == typeof c
                ? c
                : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
            }) +
            '"'
          : '"' + a + '"'
      );
    }
    function str(a, c) {
      var i,
        h,
        v,
        g,
        y,
        b = gap,
        _ = c[a];
      switch (
        (_ &&
          "object" == typeof _ &&
          "function" == typeof _.toJSON &&
          (_ = _.toJSON(a)),
        "function" == typeof rep && (_ = rep.call(c, a, _)),
        typeof _)
      ) {
        case "string":
          return quote(_);
        case "number":
          return isFinite(_) ? String(_) : "null";
        case "boolean":
        case "null":
          return String(_);
        case "object":
          if (!_) return "null";
          if (
            ((gap += indent),
            (y = []),
            "[object Array]" === Object.prototype.toString.apply(_))
          ) {
            for (g = _.length, i = 0; g > i; i += 1) y[i] = str(i, _) || "null";
            return (
              (v =
                0 === y.length
                  ? "[]"
                  : gap
                  ? "[\n" + gap + y.join(",\n" + gap) + "\n" + b + "]"
                  : "[" + y.join(",") + "]"),
              (gap = b),
              v
            );
          }
          if (rep && "object" == typeof rep)
            for (g = rep.length, i = 0; g > i; i += 1)
              (h = rep[i]),
                "string" == typeof h &&
                  ((v = str(h, _)),
                  v && y.push(quote(h) + (gap ? ": " : ":") + v));
          else
            for (h in _)
              Object.hasOwnProperty.call(_, h) &&
                ((v = str(h, _)),
                v && y.push(quote(h) + (gap ? ": " : ":") + v));
          return (
            (v =
              0 === y.length
                ? "{}"
                : gap
                ? "{\n" + gap + y.join(",\n" + gap) + "\n" + b + "}"
                : "{" + y.join(",") + "}"),
            (gap = b),
            v
          );
      }
    }
    "function" != typeof Date.prototype.toJSON &&
      ((Date.prototype.toJSON = function () {
        return (
          this.getUTCFullYear() +
          "-" +
          f(this.getUTCMonth() + 1) +
          "-" +
          f(this.getUTCDate()) +
          "T" +
          f(this.getUTCHours()) +
          ":" +
          f(this.getUTCMinutes()) +
          ":" +
          f(this.getUTCSeconds()) +
          "Z"
        );
      }),
      (String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON =
          function () {
            return this.valueOf();
          }));
    var cx =
        /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      escapable =
        /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
      gap,
      indent,
      meta = {
        "\b": "\\b",
        "	": "\\t",
        "\n": "\\n",
        "\f": "\\f",
        "\r": "\\r",
        '"': '\\"',
        "\\": "\\\\",
      },
      rep;
    "function" != typeof JSON.stringify &&
      (JSON.stringify = function (a, c, h) {
        var i;
        if (((gap = ""), (indent = ""), "number" == typeof h))
          for (i = 0; h > i; i += 1) indent += " ";
        else "string" == typeof h && (indent = h);
        if (
          ((rep = c),
          c &&
            "function" != typeof c &&
            ("object" != typeof c || "number" != typeof c.length))
        )
          throw new Error("JSON.stringify");
        return str("", { "": a });
      }),
      "function" != typeof JSON.parse &&
        (JSON.parse = function (text, reviver) {
          function walk(a, c) {
            var h,
              v,
              g = a[c];
            if (g && "object" == typeof g)
              for (h in g)
                Object.hasOwnProperty.call(g, h) &&
                  ((v = walk(g, h)), void 0 !== v ? (g[h] = v) : delete g[h]);
            return reviver.call(a, c, g);
          }
          var j;
          if (
            ((cx.lastIndex = 0),
            cx.test(text) &&
              (text = text.replace(cx, function (a) {
                return (
                  "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                );
              })),
            /^[\],:{}\s]*$/.test(
              text
                .replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
                .replace(
                  /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                  "]"
                )
                .replace(/(?:^|:|,)(?:\s*\[)+/g, "")
            ))
          )
            return (
              (j = eval("(" + text + ")")),
              "function" == typeof reviver ? walk({ "": j }, "") : j
            );
          throw new SyntaxError("JSON.parse");
        }),
      "function" == typeof define &&
        define.amd &&
        define("json2", function () {
          return JSON;
        });
  })(),
  !(function () {
    function a(a, c) {
      return (/string|function/.test(typeof c) ? _ : b)(a, c);
    }
    function c(a, h) {
      return (
        "string" != typeof a &&
          ((h = typeof a),
          "number" === h
            ? (a += "")
            : (a = "function" === h ? c(a.call(a)) : "")),
        a
      );
    }
    function h(s) {
      return $[s];
    }
    function v(a) {
      return c(a).replace(/&(?![\w#]+;)|[<>"']/g, h);
    }
    function g(a, c) {
      if (S(a)) for (var i = 0, h = a.length; h > i; i++) c.call(a, a[i], i, a);
      else for (i in a) c.call(a, a[i], i);
    }
    function y(a, c) {
      var h = /(\/)[^/]+\1\.\.\1/,
        v = ("./" + a).replace(/[^/]+$/, ""),
        g = v + c;
      for (g = g.replace(/\/\.\//g, "/"); g.match(h); ) g = g.replace(h, "/");
      return g;
    }
    function b(c, h) {
      var v =
        a.get(c) ||
        w({ filename: c, name: "Render Error", message: "Template not found" });
      return h ? v(h) : v;
    }
    function _(a, c) {
      if ("string" == typeof c) {
        var h = c;
        c = function () {
          return new C(h);
        };
      }
      var v = (k[a] = function (h) {
        try {
          return new c(h, a) + "";
        } catch (e) {
          return w(e)();
        }
      });
      return (
        (v.prototype = c.prototype = O),
        (v.toString = function () {
          return c + "";
        }),
        v
      );
    }
    function w(e) {
      var a = "{Template Error}",
        c = e.stack || "";
      if (c) c = c.split("\n").slice(0, 2).join("\n");
      else for (var h in e) c += "<" + h + ">\n" + e[h] + "\n\n";
      return function () {
        return a;
      };
    }
    var k = (a.cache = {}),
      C = this.String,
      $ = {
        "<": "&#60;",
        ">": "&#62;",
        '"': "&#34;",
        "'": "&#39;",
        "&": "&#38;",
      },
      S =
        Array.isArray ||
        function (a) {
          return "[object Array]" === {}.toString.call(a);
        },
      O = (a.utils = {
        $helpers: {},
        $include: function (a, c, h) {
          var a = y(h, a),
            v = b(a, c);
          return v;
        },
        $string: c,
        $escape: v,
        $each: g,
      }),
      P = (a.helpers = O.$helpers);
    (a.get = function (a) {
      return k[a.replace(/^\.\//, "")];
    }),
      (a.helper = function (a, c) {
        P[a] = c;
      }),
      define("template", function () {
        return a;
      });
  })(),
  define("ajaxutil", ["uri", "appmanage"], function (a, c) {
    var h = (Namespace("all.constant"), {});
    return (
      (h.getHtml = function (a, c, v) {
        h.getData(a, "html", c, v);
      }),
      (h.getJs = function (a, c) {
        h.getData(a, "javascript", c);
      }),
      (h.getJsonp = function (a, c, v, g, y) {
        h.getData(a, "jsonp", c, v, g, y);
      }),
      (h.getJson = function (a, c, v, g, y) {
        h.getData(a, "json", c, v, g, y);
      }),
      (h.getData = function (a, c, v, g, y, b) {
        h.base(a, "get", c, v, g, !0, "*", y, b);
      }),
      (h.postJson = function (a, c, v, g, y) {
        h.base(
          a,
          "post",
          "json",
          c,
          OBJJSON.stringify(v),
          !0,
          "application/json",
          g,
          y
        );
      }),
      (h.postJsonAsync = function (a, c, v, g, y) {
        h.base(
          a,
          "post",
          "json",
          c,
          OBJJSON.stringify(v),
          !1,
          "application/json",
          g,
          y
        );
      }),
      (h.putJson = function (a, c, v, g, y) {
        h.base(
          a,
          "put",
          "json",
          c,
          OBJJSON.stringify(v),
          !0,
          "application/json",
          g,
          y
        );
      }),
      (h.deleteJson = function (a, c, v, g, y) {
        h.base(
          a,
          "delete",
          "json",
          c,
          OBJJSON.stringify(v),
          !0,
          "application/json",
          g,
          y
        );
      }),
      (h.postJsonp = function (a, c, v, g, y) {
        h.base(
          a,
          "post",
          "jsonp",
          c,
          OBJJSON.stringify(v),
          !0,
          "application/json",
          g,
          y
        );
      }),
      (h.base = function (c, h, v, g, y, b, _, w, k) {
        var C = (y && y.extHead) || {};
        try {
          if ("object" == typeof y) delete y.extHead;
          else if ("string" == typeof y) {
            var S = JSON.parse(y);
            (C = S.extHead || {}), delete S.extHead, (y = JSON.stringify(S));
          }
        } catch (e) {}
        var O = new a(c),
          P = $.ajax({
            url: O.toString(),
            type: h,
            async: b,
            contentType: _,
            cache: !1,
            dataType: v,
            headers: C,
            data: y,
            timeout: 2e4,
            beforeSend: function (a) {
              "function" == typeof w && w(a);
            },
            success: function (a) {
              g(a);
            },
            error: function (a) {
              var c = {
                code: "000000",
                result: "1",
                retCode: "0001",
                retMsg: "系统开小差了哦~请您稍后再试吧！",
                XMLHttpRequestP: a,
              };
              if (403 == a.status) {
                var h = "您没有访问当前请求的权限请联系管理员！";
                "undefined" != typeof a.responseText &&
                  (-1 != a.responseText.indexOf("-1101")
                    ? (h =
                        "您没有访问当前请求的权限，请联系管理员配置操作员对应菜单权限！")
                    : -1 != a.responseText.indexOf("-1102")
                    ? (h =
                        "您没有访问当前请求的权限，请联系管理员配置OPCODE对应REST权限！请求地址为：" +
                        O.toString())
                    : -1 != a.responseText.indexOf("-1100")
                    ? (h = "会话已失效，请重新登录！")
                    : -1 != a.responseText.indexOf("-1201") &&
                      (h =
                        "您没有访问当前请求的权限，请先通过金库认证！请求地址为：" +
                        O.toString())),
                  (c.retMsg = h);
              }
              555 == a.status &&
                ((c.code = "555"),
                (c.retMsg = "哎呀，活动太火爆了，请您下个时段再来")),
                g(c);
            },
            complete: function (a, c) {
              "timeout" == c && (P.abort(), "function" == typeof k && k(c));
            },
          });
      }),
      (h.getHeaderInfo = function () {
        var a = ((c.data || [])[0] || {}).data || {};
        return { payPhoneNo: a.loginValue, provcode: a.provice };
      }),
      h
    );
  }),
  define(
    "pluspop",
    [
      "dialog_plus",
      "css!/i/appframe/component/private/pluspop/ui-dialog_7c12633.css",
      "css!/i/appframe/component/private/pluspop/shop-ui-dialog_29b30a0.css",
      "jquery_easy",
    ],
    function (a) {
      var c = {};
      return (
        (c.html = function (c, h, v, g) {
          var y = {
            title: "提示信息",
            button: { ok: "确定", cancle: "取消" },
            type: "warn",
            fn: function () {
              this.remove();
            },
            width: "500px",
            height: "auto",
            padding: "10px",
            showClose: !0,
          };
          $.extend(y, h),
            h &&
              void 0 == h.id &&
              (h.id = "sBox_" + Math.floor(1e6 * Math.random()));
          {
            var b = null,
              _ = $(
                '<div  id="' +
                  y.id +
                  '" class="section-panel hide" style="display: block;"></div>'
              ),
              w = $(
                '<span class="fr diacancle pio-close dialog-close">×</span>'
              ),
              k = $(
                '<div class="dialog-header pdl-20"><span class="dialog_title">' +
                  y.title +
                  "</span></div>"
              );
            $('<div class="dialog-footer tc"></div>');
          }
          return (
            y.showClose ||
              (w = $(
                '<span class="fr diacancle pio-close dialog-close dis-hide">×</span>'
              )),
            void 0 != g
              ? (_.append(w).append(k).append(c),
                (b = a({
                  content: _[0],
                  padding: "0px",
                  width: y.width,
                  height: y.height,
                }).showModal()))
              : (_.append(w).append(c),
                (b = a({
                  content: _[0],
                  padding: y.padding,
                  width: y.width,
                  height: y.height,
                }).showModal())),
            _.find(".diacancle").on("click", function (e, p) {
              b.remove(), "function" == typeof y.closeFn && y.closeFn(p);
            }),
            v && v(b),
            b
          );
        }),
        (c.definehtml = function (c, h, v) {
          var g = {
            button: { ok: "确定", cancle: "取消" },
            type: "warn",
            fn: function () {
              this.remove();
            },
            width: "500px",
            height: "auto",
            padding: "10px",
          };
          $.extend(g, h),
            h &&
              void 0 == h.id &&
              (h.id = "sBox_" + Math.floor(1e6 * Math.random()));
          {
            var y = null,
              b = $(
                '<div id="' +
                  g.id +
                  '" class="section-panel hide" style="display: block;"></div>'
              ),
              _ = $('<span class="fr diacancle dialog-close-star">×</span>');
            $(
              '<div class="dialog-header pdl-20"><span class="dialog_title">' +
                g.title +
                "</span></div>"
            ),
              $('<div class="dialog-footer tc"></div>');
          }
          return (
            b.append(_).append(c),
            (y = a({
              content: b[0],
              padding: g.padding,
              width: g.width,
              height: g.height,
            }).showModal()),
            $(".ui-dialog").addClass("dialog-bg-black"),
            b.find(".diacancle").on("click", function () {
              y.remove();
            }),
            v && v(y),
            y
          );
        }),
        (c.remotehtml = function (a, h, v) {
          $.get(a, function (a) {
            c.html($(a), h, v);
          });
        }),
        (c.success = function (a, h) {
          var v = { button: { ok: "确定" }, type: "success" };
          return "function" == typeof h && (v.fn = h), c.confirm(a, v);
        }),
        (c.loading = function (c, h, v) {
          var g = {
            title: "提示信息",
            imgUrl: "/i/nresource/image/loading_invoice.gif",
            msg: "发票开具中，请耐心等待哈~",
            type: "loading",
            fn: function () {
              this.remove();
            },
            width: "400px",
            height: "auto",
            padding: "10px",
          };
          $.extend(g, c),
            c &&
              void 0 == c.id &&
              (c.id = "sBox_" + Math.floor(1e6 * Math.random()));
          var y = null,
            b = $('<div id="' + g.id + '" class="section-panel hide"></div>'),
            _ = $('<span class="fr diacancle pio-close dialog-close">×</span>'),
            w = $(
              '<div class="dialog-header pdl-20"><span class="dialog_title">' +
                g.title +
                "</span></div>"
            ),
            k = $(
              '<div id="isShowPop" class="ui-dialog-loadimg"><img src="' +
                g.imgUrl +
                '" alt="loading" class="cur-de"/>80%</div>'
            ),
            C = $(
              '<div class="dialog-footer tc color-14 pdt-0">' + g.msg + "</div>"
            );
          return (
            v
              ? b.append(_).append(w).append(k).append(C)
              : b.append(k).append(C),
            (y = a({
              content: b[0],
              padding: "0px",
              width: g.width,
              height: g.height,
            }).showModal()),
            b.find(".diacancle").on("click", function () {
              y.remove();
            }),
            h && h(y),
            y
          );
        }),
        (c.error = function (a, h) {
          var v = { button: { ok: "确定" }, type: "error" };
          return "function" == typeof h && (v.fn = h), c.confirm(a, v);
        }),
        (c.warn = function (a, h) {
          var v = { button: { ok: "确定" }, type: "warn" };
          return "function" == typeof h && (v.fn = h), c.confirm(a, v);
        }),
        (c.warn2 = function (a, h) {
          var v = { button: {}, type: "warn" };
          return "function" == typeof h && (v.fn = h), c.confirm(a, v);
        }),
        (c.confirm = function (c, h, v, g, y) {
          var b = {
            title: "提示信息",
            button: { ok: "确定", cancle: "取消" },
            type: "warn",
            fn: function () {
              this.remove();
            },
            fn1: function () {
              this.remove();
            },
            width: "400px",
            height: "auto",
            padding: 0,
          };
          void 0 == h.id && (h.id = "sBox_" + Math.floor(1e6 * Math.random()));
          var _ = null;
          if (($.extend(b, h, y), void 0 != v))
            var w = $(
              '<div id="' +
                b.id +
                '" class="ued-plusdialog"><div class="dialog-header"><span class="dialog_title"></span></div><div class="dialog-body color-9 font-s18" style="font-weight:500!important"><span class="dialog-icon">' +
                c +
                "</span><br/><br/><b>" +
                v +
                '</b></div><div class="dialog-footer"></div></div>'
            );
          else
            var w = $(
              '<div id="' +
                b.id +
                '" class="ued-plusdialog"><div class="dialog-header"><span class="dialog_title"></span></div><div class="dialog-body color-9 font-s18" style="font-weight:500!important"><span class="dialog-icon"></span>' +
                c +
                '</div><div class="dialog-footer"></div></div>'
            );
          w.find(".dialog-icon").addClass("icon-" + b.type);
          var k = $('<a class="dialog-close">×</a>)'),
            C = w.find(".dialog-footer");
          if (b.button.ok) {
            var S = $(
              '<input type="button" data-callback="1" class="ued-btn btn-warn" value="' +
                b.button.ok +
                '">'
            );
            C.append(S),
              S.on("click", function () {
                var a = b.fn.call(_, !0);
                (a && 0 != a) || _.remove();
              });
          }
          if (b.button.cancle) {
            var O = $(
              '<input type="button" data-callback="0" class="ued-btn btn-warn ued-btn-cancel" value="' +
                b.button.cancle +
                '">'
            );
            C.append(O),
              O.on("click", function () {
                b.fn1.call(_, !1);
                g && stcEcode.commTrack(g, !1), _.remove();
              });
          }
          return (
            w
              .find(".dialog-header")
              .append(k)
              .find(".dialog_title")
              .html(b.title),
            (_ = a({
              content: w[0],
              padding: b.padding,
              width: b.width,
              height: b.height,
            }).showModal()),
            k.click(function () {
              _.remove(), "function" == typeof b.closeFn && b.closeFn();
            }),
            _
          );
        }),
        (c.customConfirm = function (c, h, v, g, y) {
          var b = {
            title: "提示信息",
            button: { ok: "确定", cancle: "取消" },
            type: "warn",
            fn: function () {
              this.remove();
            },
            fn1: function () {
              this.remove();
            },
            width: "400px",
            height: "auto",
            padding: 0,
          };
          "string" == typeof h.btn && (b.button.ok = h.btn),
            "string" == typeof h.btn1 && (b.button.cancle = h.btn1),
            void 0 == h.id &&
              (h.id = "sBox_" + Math.floor(1e6 * Math.random()));
          var _ = null;
          if (($.extend(b, h, y), void 0 != v))
            var w = $(
              '<div id="' +
                b.id +
                '" class="ued-plusdialog"><div class="dialog-header"><span class="dialog_title"></span></div><div class="dialog-body color-9 font-s18"><span class="dialog-icon">' +
                c +
                "</span><br/><br/><b>" +
                v +
                '</b></div><div class="dialog-footer"></div></div>'
            );
          else
            var w = $(
              '<div id="' +
                b.id +
                '" class="ued-plusdialog"><div class="dialog-header"><span class="dialog_title"></span></div><div class="dialog-body color-9 font-s18"><span class="dialog-icon"></span>' +
                c +
                '</div><div class="dialog-footer"></div></div>'
            );
          w.find(".dialog-icon").addClass("icon-" + b.type);
          var k = $('<a class="dialog-close">×</a>)'),
            C = w.find(".dialog-footer");
          if (b.button.ok) {
            var S = $(
              '<input type="button" data-callback="1" class="ued-btn btn-warn" value="' +
                b.button.ok +
                '">'
            );
            C.append(S),
              S.on("click", function () {
                var a = b.fn.call(_, !0);
                (a && 0 != a) || _.remove();
              });
          }
          if (b.button.cancle) {
            var O = $(
              '<input type="button" data-callback="0" class="ued-btn btn-warn ued-btn-cancel" value="' +
                b.button.cancle +
                '">'
            );
            C.append(O),
              O.on("click", function () {
                b.fn1.call(_, !1);
                g && stcEcode.commTrack(g, !1), _.remove();
              });
          }
          return (
            w
              .find(".dialog-header")
              .append(k)
              .find(".dialog_title")
              .html(b.title),
            (_ = a({
              content: w[0],
              padding: b.padding,
              width: b.width,
              height: b.height,
            }).showModal()),
            k.click(function () {
              _.remove();
            }),
            _
          );
        }),
        (c.invoice = function (c, h, v, g, y, b, _, w, k, C, S, O, P, M, E) {
          var D = ["200", "100", "311", "451"],
            j = {
              title: "提示信息",
              button: { ok: "确定", cancle: "取消" },
              type: "warn",
              fn: function () {
                this.remove();
              },
              fn1: function () {
                this.remove();
              },
              width: "508px",
              height: "auto",
              padding: 0,
            };
          void 0 == c.id && (c.id = "sBox_" + Math.floor(1e6 * Math.random()));
          var I = null;
          $.extend(j, c);
          var T, A, N, R;
          g &&
            ((A =
              '<div id="' +
              j.id +
              '" class="ued-plusdialog" style="width: 508px;"><div class="dialog-header"><span class="dialog_title"></span></div><div class="dialog-body color-9 font-s18" style="font-weight: normal!important;"><div><p class="fp-style mgr-20">发票类型:</p><ul class="fp-choose"><li class="fp-personal" mold = "1"><i class="tp-click-new active" id="pf-pers"></i><span style="font-weight: normal">个人</span></li><li class="fp-unit" mold = "2"><i class="tp-click-new" id="pf-dwunit"></i><span style="font-weight: normal">企业</span></li></ul></div><br/>'),
            (N =
              '<div class="fp_person none" style="position: relative;"><div class="mgt-20 fp_title none" style="margin-bottom:20px"><span class="mgr-20 lh-height">发票抬头:</span><input readonly="readonly" class="fp_unit-text1 invoiceTitle_txt" value="' +
              (M || "") +
              '"><i class="fp_unit-sls-img" style="display: block!important"></i></span></div><div class="pos-a"><ul name="fp_unit_sel" id="fp_unit_sls" class="fp_unit_sls-ul none"></ul></div><div class="default_display none"><label class="checkbox checked mgr-20" for="ver-1" id="default_lab" style="margin: 0 0 0 100px;">'),
            (N +=
              k || (0 == _.length && 0 == w.length)
                ? '<span class="unselected icon-selected"></span>'
                : '<span class="unselected"></span>'),
            (N +=
              '<input type="checkbox" name="check_input" class="mgr-0" id="ver-1" value="" /></label><span style="font-weight: normal;margin-left: 6px;" class="default-text">设为默认</span></div><p class="fp-choose-text-gray">发票类型为个人，无法修改抬头。若需修改，请咨询10086。</p></div>'),
            (N +=
              w.length > 0
                ? 1 == w.length
                  ? '<div class="fp_unit none"><div class="mgt-20 lh-height"><span class="mgr-20">发票抬头:</span><input class="fp_unit-text1 invoice_readonly" id="one_invoiceAddr" value="' +
                    w[0].invoiceAddr +
                    '"></input><a href="http://shop.10086.cn/i/?f=invoicemag" class="fp-msg">管理发票信息</a></div><div class="mgt-20 lh-height"><span class="mgr-20" >纳税人识别号:</span><input class="fp_unit-text1 invoice_readonly" placeholder="请输入纳税人识别号" style="margin-left: -8px;" id="one_taxPayerId" value="' +
                    w[0].taxPayerId +
                    '"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1 tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">纳税人识别号必须为15位/17位/18位/20位(数字或字母)，请确认当前纳税人识别号。</span></div><div class="mgt-20 lh-height"><span class="mgr-20" >开户银行:</span><input class="fp_unit-text1 invoice_readonly" placeholder="开户银行名称，选填" style="margin-left: -8px;" id="one_depositBank" value="' +
                    w[0].depositBank +
                    '"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1 tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">开户银行账名称格式不正确，请检查后重新输入</span></div><div class="mgt-20"><span class="mgr-20" >银行账号:</span><input class="fp_unit-text1 invoice_readonly" placeholder="开户银行账号，选填" style="margin-left: -8px;" id="one_bankAccount" value="' +
                    w[0].bankAccount +
                    '"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1 tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">银行账号格式不正确，请检查后重新输入</span></div><div class="mgt-20 lh-height"><span class="mgr-20" >企业电话:</span><input class="fp_unit-text1 invoice_readonly" placeholder="企业电话，选填" style="margin-left: -8px;" id="one_companyTelephone"value="' +
                    w[0].companyTelephone +
                    '"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1 tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">企业电话格式不正确，请检查后重新输入</span></div><div class="mgt-20 lh-height"><span class="mgr-20" >企业地址:</span><input class="fp_unit-text1 invoice_readonly" placeholder="企业地址，选填" plac style="margin-left: -8px;" id="one_companyAddress"value="' +
                    w[0].companyAddress +
                    '"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1 tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">企业地址格式不正确，请检查后重新输入</span></div><div class="mgt-20 jk_tip fl"><p class="jk-tips none">*企业发票仅支持使用您在线下营业厅登记的单位发票抬头信息，暂不支持修改。如需修改请前往线下营业厅</p></div></div>'
                  : '<div class="fp_unit none"><div class="mgt-20"><span class="mgr-20 fl line-h34">发票抬头:</span><div class="fl fp-unit-select"><div class="fp-unit-select-ipt"><input class="fp-unit-select-span"></input><i class="fp_unit-sel-img" style="display: block!important"></i></div><div class="pos-a"><ul name="fp_unit_sel" id="fp_unit_sel" class="fp_unit_sel-ul none"><li  style="height: 36px;"></li></ul></div></div><a href="http://shop.10086.cn/i/?f=invoicemag" class="fp-msg fl line-h34">管理发票信息</a></div><div class="mgt-20 lh-height fl"><span class="mgr-20" >纳税人识别号:</span><input class="fp_unit-text1 invoice_readonly" value="" placeholder="请输入纳税人识别号" style="margin-left: -8px;" id="fp_unit_show_taxPayerId"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1  tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">纳税人识别号必须为15位/17位/18位/20位(数字或字母)，请确认当前纳税人识别号。</span></div><div class="mgt-20 lh-height fl"><span class="mgr-20" >开户银行:</span><input class="fp_unit-text1 invoice_readonly" value="" placeholder="开户银行名称，选填" style="margin-left: -8px;" id="depositBank"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1  tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">开户银行账名称格式不正确，请检查后重新输入</span></div><div class="mgt-20 lh-height fl"><span class="mgr-20" >银行账号:</span><input class="fp_unit-text1 invoice_readonly" value="" placeholder="开户银行账号，选填" style="margin-left: -8px;" id="bankAccount"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1  tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">银行账号格式不正确，请检查后重新输入</span></div><div class="mgt-20 lh-height fl"><span class="mgr-20" >企业电话:</span><input class="fp_unit-text1 invoice_readonly" value="" placeholder="企业电话，选填" style="margin-left: -8px;" id="companyTelephone"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1  tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">企业电话格式不正确，请检查后重新输入</span></div><div class="mgt-20 lh-height fl"><span class="mgr-20" >企业地址:</span><input class="fp_unit-text1 invoice_readonly" value="" placeholder="企业地址，选填" style="margin-left: -8px;" id="companyAddress"></input></div><div class="mgt-20 fl none" id="invo_payTaxId_tip_err"><span class="color-1  tip-comm-bg-2 fs-12 pdl-20"  style="display: inline-block;">企业地址格式不正确，请检查后重新输入</span></div><div class="mgt-20 jk_tip fl"><p class="jk-tips none">*企业发票仅支持使用您在线下营业厅登记的单位发票抬头信息，暂不支持修改。如需修改请前往线下营业厅</p></div></div>'
                : '<div class="fp_unit none "><div class="fp-add-information"><a href="http://shop.10086.cn/i/?f=invoicemag"><span></span>新增发票抬头</a></div></div>'),
            (R =
              '</div><div class="dialog-footer" style="padding-top: 20px"></div></div>'),
            (T = $(A + N + R))),
            T.find(".dialog-icon").addClass("icon-" + j.type);
          var B = $('<a class="dialog-close">×</a>)'),
            F = T.find(".dialog-footer");
          if (j.button.ok) {
            var J = $(
              '<input id="ok" type="button" data-callback="1" class="ued-btn btn-warn" value="' +
                j.button.ok +
                '">'
            );
            F.append(J),
              J.on("click", function () {
                j.fn.call(I, !0);
              });
          }
          if (j.button.cancle) {
            var U = $(
              '<input type="button" data-callback="0" style="width: 90px;" class="ued-btn btn-warn ued-btn-cancel" value="' +
                j.button.cancle +
                '">'
            );
            F.append(U),
              U.on("click", function () {
                j.fn1.call(I, !1);
                v && stcEcode.commTrack(v, !1), I.remove();
              });
          }
          if (
            ("1" == O
              ? T.find(".fp-personal").addClass("none")
              : "0" == O && T.find(".fp-unit").addClass("none"),
            M && "" != M && T.find(".fp_title").removeClass("none"),
            -1 == D.indexOf(E) &&
              T.find(".default_display").removeClass("none"),
            "100" == E &&
              (T.find(".fp-choose-text-gray").addClass("none"),
              T.find(".invoiceTitle_txt").removeAttr("readonly")),
            w.length > 0 && "0" != O)
          ) {
            "0" == P &&
              (T.find(".invoice_readonly").attr("readonly", "readonly"),
              T.find(".jk-tips").removeClass("none"));
            var L = "",
              Q = "";
            T.find(".fp-unit-select-span").val(w[0].invoiceAddr),
              T.find("#fp_unit_show_taxPayerId").val(w[0].taxPayerId),
              T.find("#depositBank").val(w[0].depositBank),
              T.find("#bankAccount").val(w[0].bankAccount),
              T.find("#companyTelephone").val(w[0].companyTelephone),
              T.find("#companyAddress").val(w[0].companyAddress);
            for (var i = 0; i < w.length; i++)
              1 == w[i].isDefault
                ? ((C = !0),
                  T.find(".fp-unit-select-span").val(w[i].invoiceAddr),
                  T.find("#fp_unit_show_taxPayerId").val(w[i].taxPayerId),
                  T.find("#depositBank").val(w[i].depositBank),
                  T.find("#bankAccount").val(w[i].bankAccount),
                  T.find("#companyTelephone").val(w[i].companyTelephone),
                  T.find("#companyAddress").val(w[i].companyAddress),
                  (L +=
                    '<li class="fp_unit_opt"  data="' +
                    w[i].taxPayerId +
                    '" data1="' +
                    w[i].depositBank +
                    '" data2="' +
                    w[i].bankAccount +
                    '" data3="' +
                    w[i].companyTelephone +
                    '" data4="' +
                    w[i].companyAddress +
                    '">' +
                    w[i].invoiceAddr +
                    "</li>"))
                : (L +=
                    '<li class="fp_unit_opt"  data="' +
                    w[i].taxPayerId +
                    '" data1="' +
                    w[i].depositBank +
                    '" data2="' +
                    w[i].bankAccount +
                    '" data3="' +
                    w[i].companyTelephone +
                    '" data4="' +
                    w[i].companyAddress +
                    '">' +
                    w[i].invoiceAddr +
                    "</li>");
            for (var i = 0; i < _.length; i++)
              1 == _[i].isDefault
                ? ((C = !0),
                  (Q +=
                    '<li class="fp_unit_os"  data="' +
                    _[i].taxPayerId +
                    '" data1="' +
                    _[i].depositBank +
                    '" data2="' +
                    _[i].bankAccount +
                    '" data3="' +
                    _[i].companyTelephone +
                    '" data4="' +
                    _[i].companyAddress +
                    '">' +
                    _[i].invoiceAddr +
                    "</li>"))
                : (Q +=
                    '<li class="fp_unit_os"  data="' +
                    _[i].taxPayerId +
                    '" data1="' +
                    _[i].depositBank +
                    '" data2="' +
                    _[i].bankAccount +
                    '" data3="' +
                    _[i].companyTelephone +
                    '" data4="' +
                    _[i].companyAddress +
                    '">' +
                    _[i].invoiceAddr +
                    "</li>");
            T.find("#fp_unit_sel").append(L), T.find("#fp_unit_sls").append(Q);
          }
          return (
            C && !k
              ? (T.find(".fp-unit .tp-click-new").addClass("active"),
                T.find(".fp_unit").removeClass("none"),
                T.find(".fp-personal .tp-click-new").removeClass("active"),
                T.find(".fp_person ").addClass("none"))
              : k || "0" == O
              ? (T.find(".fp-personal .tp-click-new").addClass("active"),
                T.find(".fp_person ").removeClass("none"),
                T.find(".fp-unit .tp-click-new").removeClass("active"),
                T.find(".fp_unit").addClass("none"))
              : (T.find(".fp-personal .tp-click-new").removeClass("active"),
                T.find(".fp_person ").addClass("none"),
                T.find(".fp-unit .tp-click-new").addClass("active"),
                T.find(".fp_unit").removeClass("none")),
            T.find(".dialog-header")
              .append(B)
              .find(".dialog_title")
              .html(j.title),
            (I = a({
              content: T[0],
              padding: j.padding,
              width: j.width,
              height: j.height,
            }).showModal()),
            B.click(function () {
              I.remove();
            }),
            $(".fp-personal").on("click", function () {
              $("#invo_payTaxId_tip_err").addClass("none"),
                $("#ok").removeAttr("disabled"),
                $("#pf-pers").addClass("active"),
                $("#pf-dwunit").removeClass("active"),
                $(".fp-choose-text").removeClass("dis-i-hide"),
                $(".dialog-inputbox").addClass("dis-i-hide"),
                $(".fp_person").removeClass("none"),
                $(".fp_unit").addClass("none"),
                J.removeAttr("disable"),
                J.removeClass("btn-disable");
            }),
            $(".fp-unit").on("click", function () {
              $("#invo_payTaxId_tip_err").addClass("none"),
                $("#pf-dwunit").addClass("active"),
                $("#pf-pers").removeClass("active"),
                $(".dialog-inputbox").removeClass("dis-i-hide"),
                $(".fp-choose-text").addClass("dis-i-hide"),
                $(".fp_unit").removeClass("none"),
                $(".fp_person").addClass("none"),
                0 == w.length
                  ? (J.attr("disabled", "disabled"), J.addClass("btn-disable"))
                  : (J.removeAttr("disabled"), J.removeClass("btn-disable"));
            }),
            $("#default_lab,.default-text").bind("click", function () {
              parseInt($("#default_lab").attr("value"))
                ? ($(".unselected").removeClass("icon-selected"),
                  $("#default_lab").attr("value", 0))
                : ($(".unselected").addClass("icon-selected"),
                  $("#default_lab").attr("value", 1));
            }),
            $(".fp-unit-select-ipt")
              .off("click")
              .on("click", function () {
                $(".fp_unit_sel-ul").hasClass("none")
                  ? $(".fp_unit_sel-ul").removeClass("none")
                  : $(".fp_unit_sel-ul").addClass("none");
              }),
            $("#fp_unit_sel").bind("mouseleave", function () {
              $(".fp_unit_sel-ul").addClass("none");
            }),
            $("#fp_unit_sel li").bind({
              click: function () {
                $("#invo_payTaxId_tip_err").addClass("none"),
                  $("#ok").removeAttr("disabled"),
                  $(".fp_unit_sel-ul").addClass("none"),
                  $(".fp-unit-select-span").val($(this).text()),
                  $("#fp_unit_show_taxPayerId").val($(this).attr("data")),
                  $("#depositBank").val($(this).attr("data1")),
                  $("#bankAccount").val($(this).attr("data2")),
                  $("#companyTelephone").val($(this).attr("data3")),
                  $("#companyAddress").val($(this).attr("data4"));
              },
            }),
            $(".invoiceTitle_txt")
              .off("click")
              .on("click", function () {
                $(".fp_unit_sls-ul").hasClass("none")
                  ? $(".fp_unit_sls-ul").removeClass("none")
                  : $(".fp_unit_sls-ul").addClass("none");
              }),
            $("#fp_unit_sls").bind("mouseleave", function () {
              $(".fp_unit_sls-ul").addClass("none");
            }),
            $("#fp_unit_sls li").bind({
              click: function () {
                $("#invo_payTaxId_tip_err").addClass("none"),
                  $("#ok").removeAttr("disabled"),
                  $(".fp_unit_sls-ul").addClass("none"),
                  $(".invoiceTitle_txt").val($(this).text());
              },
            }),
            I
          );
        }),
        (c.confirmPhone = function (c, h, v, g) {
          var y = {
            title: "提示信息",
            button: { ok: "确定", cancle: "取消" },
            type: "warn",
            fn: function () {
              this.remove();
            },
            fn1: function () {
              this.remove();
            },
            width: "400px",
            height: "auto",
            padding: 0,
          };
          void 0 == c.id && (c.id = "sBox_" + Math.floor(1e6 * Math.random()));
          var b = null;
          $.extend(y, c);
          var _ = $(
            '<div id="' +
              y.id +
              '" class="ued-plusdialog"><div class="dialog-header"><span class="dialog_title"></span></div><div class="dialog-body color-9 font-s18"><span class="dialog-icon fwn">手机号码：</span><input id="Fdialog-input" type="text" value="' +
              h +
              '" maxlength="11" class="F-dialog-input col-20"/><div id="Fdialog-error" class="tip-comm-bg pdl-20 color-1 fs-12 Fdialog-input-error none">请输入正确的手机号码</div></div><div class="dialog-footer"></div></div>'
          );
          _.find(".dialog-icon").addClass("icon-" + y.type);
          var w = $('<a class="dialog-close">×</a>)'),
            k = _.find(".dialog-footer");
          if (y.button.ok) {
            var C = $(
              '<input id="ok" type="button" data-callback="1" class="ued-btn btn-warn" value="' +
                y.button.ok +
                '">'
            );
            k.append(C),
              C.on("click", function () {
                "1" != $(this).attr("status") && y.fn.call(b, !0);
              });
          }
          if (y.button.cancle) {
            var S = $(
              '<input type="button" data-callback="0" class="ued-btn btn-warn ued-btn-cancel" value="' +
                y.button.cancle +
                '">'
            );
            k.append(S),
              S.on("click", function () {
                y.fn1.call(b, !1);
                v && stcEcode.commTrack(v, !1), b.remove();
              });
          }
          return (
            _.find(".dialog-header")
              .append(w)
              .find(".dialog_title")
              .html(y.title),
            (b = a({
              content: _[0],
              padding: y.padding,
              width: y.width,
              height: y.height,
            }).showModal()),
            w.click(function () {
              b.remove();
            }),
            $("#Fdialog-input")
              .keyup(function () {
                $("#Fdialog-error").addClass("none"),
                  $(this).val($(this).val().replace(/[^\d]/g, "")),
                  $(this).val().length >= 11 &&
                    $(this).val($(this).val().substr(0, 11));
              })
              .focus(function () {
                "请输入您要转赠的11位移动手机号码" == $(this).val() &&
                  ($(this).css("border-color", "#c2c2c2"),
                  $(this).val("").removeClass("col-20").addClass("color-15"));
              })
              .blur(function () {
                "" == $(this).val() &&
                  $(this)
                    .val("请输入您要转赠的11位移动手机号码")
                    .removeClass("color-15")
                    .addClass("col-20");
              }),
            g &&
              ($("#Fdialog-input")
                .off("keyup focus blur")
                .on("keyup", function () {
                  $("#Fdialog-error").addClass("none"),
                    $(this).val(
                      $(this)
                        .val()
                        .replace(/[^\da-zA-Z]/g, "")
                    ),
                    $(this).val().length >= 20 &&
                      $(this).val($(this).val().substr(0, 20));
                }),
              $("#fp-title")
                .off("keyup focus blur")
                .on("keyup", function () {
                  $("#rise-errtip").addClass("none"),
                    $(this).val().length > 50 &&
                      $("#rise-errtip")
                        .html("发票抬头不能超过50位")
                        .removeClass("none");
                })),
            b
          );
        }),
        (c.process = function (c) {
          function h() {
            y
              .stop()
              .css("top", -80)
              .animate({ top: 0 }, { easing: "easeOutExpo", duration: w }),
              b
                .stop()
                .css("top", 105)
                .animate({ top: 25 }, { easing: "easeOutExpo", duration: w });
          }
          "undefined" == typeof c && (c = "加载中...");
          var v = "sBox_" + Math.floor(1e6 * Math.random()),
            g = $(
              '<div class="ued-load js_ued_load"><div class="load-pluswrap"><div class="load-animate"><div class="load-logo"></div><div class="load-bg"> <i></i></div>  </div>' +
                c +
                "</div></div>"
            ),
            y = g.find(".load-bg"),
            b = y.find("i"),
            _ = null,
            w = 4e3,
            k = a({
              content: g[0],
              padding: 0,
              width: "330px",
              id: v,
            }).showModal();
          return h(), (_ = setInterval(h, w - 1e3)), k;
        }),
        (c.newsContent = function (c, h, v) {
          var g = {
            title: "系统公告",
            width: "625px",
            height: "auto",
            padding: 0,
          };
          void 0 == v.id && (v.id = "sBox_" + Math.floor(1e6 * Math.random()));
          var y = null;
          if (($.extend(g, v), void 0 != c))
            var b = $(
              '<div id="' +
                g.id +
                '" class="ued-plusdialog ued-g100"><div class="dialog-header pdl-10 pdr-10"><span class="dialog_title"></span></div><div class="dialog-system-msg-content color-14 font-s18 pd-20-30 pdt-0"><div class="dialog-system-msg-title">' +
                c +
                "</div>" +
                h +
                "</div></div>"
            );
          b.find(".dialog-icon").addClass("icon-" + g.type);
          var _ = $('<a class="dialog-close">×</a>)');
          return (
            b
              .find(".dialog-header")
              .append(_)
              .find(".dialog_title")
              .html(g.title),
            (y = a({
              content: b[0],
              padding: g.padding,
              width: g.width,
              height: g.height,
            }).showModal()),
            _.click(function () {
              y.remove();
            }),
            y
          );
        }),
        (c.winterDialog = function (a, c, h, v) {
          var g = {
            button: {
              ok: "/i/nresource/image/wintermarket/origin-price.png",
              cancel: "/i/nresource/image/wintermarket/dialog-cancel.png",
            },
            fn: function () {
              this.remove();
            },
            info: "仅限移动手机号码登录后享受优惠",
          };
          $.extend(g, a);
          var y = null,
            b = '<div class="wd-mask" id="wd-mask">',
            _ = '<div class="wd-code">',
            w =
              '<a class="wd-close" href="javascript:;"><img src="/i/nresource/image/wintermarket/dialog-close.png" alt=""></a>',
            k =
              '<div class="' +
              ("stageFour" == c ? "wdc-cont" : "wd-cont") +
              '">',
            C =
              '<p class="wd-info ' +
              (v ? "wd-h164" : "wd-h210") +
              '">' +
              g.info +
              "</p>",
            S = "";
          v && 2 == v
            ? ((S = '<div class="wd-btns">'),
              (S +=
                '<button class="wd-btns-ok wd-mg" id="wd-ok" style="background-image:url(' +
                g.button.ok +
                ')"></button>'),
              (S +=
                '<button class="wd-btns-cancel wd-mg" id="wd-cancel" style="background-image:url(' +
                g.button.cancel +
                ')"></button></div>'))
            : v &&
              1 == v &&
              ((S = '<div class="wd-btns">'),
              (S +=
                '<button class="wd-btns-ok" id="wd-ok" style="background-image:url(' +
                g.button.ok +
                ')"></button></div>'));
          var O = "</div>",
            P = $(b + _ + w + k + C + S + O + O + O);
          return (
            $("#winterDialog").html(P),
            (y = $("#winterDialog").find("#wd-mask")),
            y.on("click", ".wd-close", function () {
              y.remove();
            }),
            "function" == typeof h && h(y),
            y
          );
        }),
        (c.springDialog = function (a, c, h) {
          var v = {
            button: {
              ok: "/i/nresource/image/springmarket/btn-red.png",
              cancel: "/i/nresource/image/wintermarket/dialog-cancel.png",
            },
            fn: function () {
              this.remove();
            },
            info: "仅限移动手机号码登录后享受优惠",
            buttonInfo: "正价购买",
          };
          $.extend(v, a);
          var g = null,
            y = '<div class="wd-mask" id="sm-mask">',
            b = '<div class="sm-dialog-content tc">',
            _ = '<a class="sm-close" href="javascript:;">';
          _ +=
            '<img src="/i/nresource/image/springmarket/close.png" alt=""></a>';
          var w = '<div class="sm-cont">';
          w += '<p id="sm-tip" class="sm-info">' + v.info + "</p></div>";
          var k = "";
          k =
            h && 1 == h
              ? '<button class="sm-charge-order-btn" id="sm-ok">' +
                v.buttonInfo +
                "</button>"
              : "";
          var C = "</div>",
            S = $(y + b + _ + w + k + C + C);
          return (
            $("#springDialog").html(S),
            (g = $("#springDialog").find("#sm-mask")),
            g.on("click", ".sm-close", function () {
              g.remove();
            }),
            "function" == typeof c && c(g),
            g
          );
        }),
        (c.tips = function (a) {
          $("#dialog-tips").empty();
          var c =
            "<div class='dialog-tips-box tc'><span>" + a + "</span></div>";
          $("#dialog-tips").html(c),
            $("#dialog-tips").show(),
            setTimeout(function () {
              $("#dialog-tips").hide();
            }, 3e3);
        }),
        (c.fpDialog = function (a, c, h) {
          var v = {
            fn: function () {
              this.remove();
            },
            info: { info1: "仅限手机号码登录客户参与", info2: "敬请期待" },
            buttonInfo: "查看今日优惠",
          };
          $.extend(v, a);
          var g = null,
            y = '<div class="wd-mask" id="fp-mask">',
            b = '<div class="fp-dialog-content tc">',
            _ = '<a class="fp-close" href="javascript:;">';
          _ +=
            '<img src="/i/nresource/image/fourprefer/Q3_2018/dialog-close.png" alt=""></a>';
          var w = '<div class="fp-content">';
          w +=
            '<p id ="fp-tip-one" class="fp-content-f">' +
            v.info.info1 +
            '</p><p id="fp-tip-two" class="fp-content-f fp-pdt-6">' +
            v.info.info2 +
            "</p></div>";
          var k = "";
          k =
            h && 1 == h
              ? '<button id="fp-btn" class="fp-btn-sty">' +
                v.buttonInfo +
                "</button>"
              : "";
          var C = "</div>",
            S = $(y + b + _ + w + k + C + C);
          return (
            $("#fpDialog").html(S),
            (g = $("#fpDialog").find("#fp-mask")),
            g.on("click", ".fp-close", function () {
              g.remove();
            }),
            "function" == typeof c && c(g),
            g
          );
        }),
        (c.fpDialog1 = function (a, c) {
          var h = {
            fn: function () {
              this.remove();
            },
            info: "",
          };
          $.extend(h, a);
          var v = null,
            g = '<div class="wd-mask" id="fp-mask">',
            y = '<div class="fp-dialog-content tc ">',
            b = '<a class="fp-close" href="javascript:;">';
          b +=
            '<img src="/i/nresource/image/fourprefer/Q4_2018/dialog-close.png" alt=""></a>';
          var _ = '<div class="fp-content">';
          (_ +=
            '<p id ="fp-tip-one" class="fp-content-one">恭喜，您已成功领取</p><p class="fp-content-two">' +
            a.info +
            "</p></div>"),
            (_ +=
              '<div class="fp-mobile-code-div"><div><p class="use-tips1"></p><img class="code-img" src="/i/nresource/image/fourprefer/Q4_2018/tk1-code-img.png" alt=""><p class="use-tips2">扫码查看优惠券</p></div></div>');
          var w = "</div>",
            k = $(g + y + b + _ + w + w);
          return (
            $("#fpDialog").html(k),
            (v = $("#fpDialog").find("#fp-mask")),
            v.on("click", ".fp-close", function () {
              $("body").removeClass("noscroll"), v.remove();
            }),
            "function" == typeof c && c(v),
            v
          );
        }),
        (c.fpDialog2 = function () {
          var a = null,
            c = '<div class="wd-mask" id="fp-mask">',
            h = '<div class="fp-dialog-content tc">',
            v = '<a class="fp-close" href="javascript:;">';
          v +=
            '<img src="/i/nresource/image/fourprefer/Q4_2018/dialog-close.png" alt=""></a>';
          var g = '<div class="fp-content">';
          g +=
            '<p  class="fp-content-three">您本月已经领过啦~</p></div><div class="fp-mobile-code-div mgt-20"><div><img class="code-img" src="/i/nresource/image/fourprefer/Q4_2018/tk1-code-img.png" alt=""><p class="use-tips2 mgt-30">扫码查看优惠券</p></div></div>';
          var y = "</div>",
            b = $(c + h + v + g + y + y);
          return (
            $("#fpDialog").html(b),
            (a = $("#fpDialog").find("#fp-mask")),
            a.on("click", ".fp-close", function () {
              $("body").removeClass("noscroll"), a.remove();
            }),
            a
          );
        }),
        (c.fpDialog3 = function (a, c, h) {
          var v = {
            fn: function () {
              this.remove();
            },
            info: { info1: "仅限手机号码登录客户参与", info2: "敬请期待" },
            buttonInfo: { buttonInfo1: "查看今日优惠", buttonInfo2: "关闭" },
          };
          $.extend(v, a);
          var g = null,
            y = '<div class="wd-mask" id="fp-mask">',
            b = '<div class="fp-dialog-content tc ">',
            _ = '<a class="fp-close" href="javascript:;">';
          _ +=
            '<img src="/i/nresource/image/fourprefer/Q4_2018/dialog-close.png" alt=""></a>';
          var w = '<div class="fp-content">';
          w +=
            '<p  class="fp-content-four mgt-150">' +
            a.info.info1 +
            '</p><p class="fp-content-four mgt-30" >' +
            a.info.info2 +
            "</p></div>";
          var k = "";
          h && 1 == h
            ? (k =
                '<div class="fp-dialog-usebtn">' +
                a.buttonInfo.buttonInfo1 +
                "</div>")
            : h &&
              2 == h &&
              (k =
                '<div class="mgt-50 twobtns-div"><p class="fp-dialog-btn1 fp-dialog-go">' +
                a.buttonInfo.buttonInfo1 +
                '</p><p class="fp-dialog-btn1 fp-dialog-cancel">' +
                a.buttonInfo.buttonInfo2 +
                "</p><div>");
          var C = "</div>",
            S = $(y + b + _ + w + k + C + C);
          return (
            $("#fpDialog").html(S),
            (g = $("#fpDialog").find("#fp-mask")),
            g.on("click", ".fp-close", function () {
              $("body").removeClass("noscroll"), g.remove();
            }),
            "function" == typeof c && c(g),
            g
          );
        }),
        c
      );
    }
  ),
  define("appconfig", function () {
    return {
      home: ["home#mainContent"],
      stcMenu: ["pmenu#stcnavmenu"],
      stcHead: ["pheader#stc_head"],
      stcUpgrade: ["pupgrade#mainContent"],
      stcError: ["perror#mainContent"],
      stcDefault: ["pdefault#mainContent"],
      recaddrmag: ["addr#mainContent"],
      belongqry: ["belong#mainContent"],
      billdetailqry: ["billdetail#mainContent"],
      billqry: ["billqry#mainContent"],
      busiqrydeal: ["busideal#mainContent"],
      rechargerecord: ["chargerecord#mainContent"],
      rechargeurecord: ["chargerecord#mainContent"],
      myfav: ["fav#mainContent"],
      presentfee: ["feepresent#mainContent"],
      invoicemag: ["invoice#mainContent"],
      pointqry: ["spointdetail#mainContent"],
      mypreorders: ["spreorder#mainContent"],
      rechargecredit: ["rechargecomm#mainContent"],
      rechargecard: ["rechargecomm#mainContent"],
      rechargejf: ["rechargecomm#mainContent"],
      rechargegprs: ["rechargegprs#mainContent"],
      rechargelife: ["rechargelife#mainContent"],
      rechargeinterofth: ["rechargeinterof#mainContent"],
      rechargelove: ["rechargelove#mainContent"],
      recharhisqry: ["recharhis#mainContent"],
      packremainqry: ["remain#mainContent"],
      returnorderqry: ["shopback#mainContent"],
      clientreturn: ["shopback#mainContent"],
      myinvoice: ["myinvoice#mainContent"],
      myorders: ["shoporder#mainContent"],
      clientorders: ["shoporder#mainContent"],
      orderdetail: ["shoporderdetail#mainContent"],
      returnorderdetail: ["returnorderdetail#mainContent"],
      custinfoqry: ["userinfo#mainContent"],
      advicearrival: ["advicearrival#mainContent"],
      msgremind: ["msgremind#mainContent"],
      bandorderqry: ["bandorderqry#mainContent"],
      banddetail: ["banddetail#mainContent"],
      phoneno: ["rechargecomm/phoneno.html#stc-recharge-phoneno"],
      payrule: ["rechargecomm/payrule.html#stc-recharge-payrule"],
      amount: ["rechargecomm/amount.html#stc-recharge-amount"],
      rechargeResult: ["rechargecomm/result.html#mainContent"],
      rechargecreditTab: ["rechargecredit#rechargeTab"],
      rechargecardTab: ["rechargecard#rechargeTab"],
      rechargejfTab: ["rechargejf#rechargeTab"],
      rechargecreditTabUp: ["pupgrade#rechargeTab"],
      rechargecardTabUp: ["pupgrade#rechargeTab"],
      rechargejfTabUp: ["pupgrade#rechargeTab"],
      noticeinfo: ["noticeinfo#mainContent"],
      remail: ["remail#mainContent"],
      productItem: ["rechargecomm#chargeModule"],
      comment: ["comment#mainContent"],
      starprefecture: ["starprefecture#mainContent"],
      mobilebusiness: ["mobilebusiness#mainContent"],
      commentdetail: ["commentdetail#mainContent"],
      mynews: ["mynews#mainContent"],
      flowqry: ["flowqry#mainContent"],
      liferecharhisqry: ["liferecharhisqry#mainContent"],
      setprotect: ["setprotect#mainContent"],
      haraprotect: ["haraprotect#mainContent"],
      mycoupons: ["mycoupons#mainContent"],
      myfcode: ["myfcode#mainContent"],
      bborderdetail: ["bborderdetail#mainContent"],
      norcoupon: ["normalization/coupon.html#normal-coupon"],
      norlottery: ["normalization/lottery.html#normal-lottery"],
      norecharge: ["normalization/recharge.html#normal-recharge"],
      rechargebroband: ["rechargebroband#mainContent"],
      rechargelandline: ["rechargelandline#mainContent"],
      newBroadBandOrder: ["newBroadBandOrder#mainContent"],
      newbborderdetail: ["newbborderdetail#mainContent"],
      familyorder: ["familyorder#mainContent"],
      familyorderdetail: ["familyorderdetail#mainContent"],
      mybroadband: ["mybroadband#mainContent"],
    };
  }),
  define("stclog", function (require) {
    return {
      init: function () {},
      record: function () {},
      log: function () {},
      info: function () {},
      error: function () {},
    };
  }),
  define("formartDateUtil", function () {
    var a = function (a) {
        null != a &&
          "undefined" != typeof a &&
          a.length > 8 &&
          (a = a.substr(0, 8));
        var c = new RegExp("^[0-9]{8}$");
        if (c.test(a)) {
          var d = a.substr(0, 4) + "-" + a.substr(4, 2) + "-" + a.substr(6, 2);
          return d;
        }
        return a;
      },
      c = function (a, c) {
        if (null == a) return "";
        var h = a.length;
        if (14 > h) for (var i = 0; 14 - h > i; i++) a += "0";
        var v = new RegExp("^[0-9]{14}$");
        if (v.test(a)) {
          var d =
            a.substr(0, 4) +
            "-" +
            a.substr(4, 2) +
            "-" +
            a.substr(6, 2) +
            " " +
            a.substr(8, 2) +
            ":" +
            a.substr(10, 2) +
            ":" +
            a.substr(12, 2);
          return (
            "s" == c &&
              (d =
                a.substr(0, 4) + "-" + a.substr(4, 2) + "-" + a.substr(6, 2)),
            d
          );
        }
        return a;
      },
      h = function (a) {
        var c = new Date(),
          h = new RegExp("^[0-9]{14}$");
        return (
          h.test(a) &&
            (c.setFullYear(parseInt(a.substr(0, 4))),
            c.setMonth(parseInt(a.substr(4, 2)) - 1),
            c.setDate(parseInt(a.substr(6, 2))),
            c.setHours(parseInt(a.substr(8, 2))),
            c.setMinutes(parseInt(a.substr(10, 2))),
            c.setSeconds(parseInt(a.substr(12, 2)))),
          c
        );
      },
      v = function (a) {
        var c,
          h = a + 1;
        return (c = 10 > h ? "0" + h : h), c + "";
      },
      g = function (d) {
        var a;
        return (a = 10 > d ? "0" + d : d), a + "";
      },
      y = function (d) {
        var a = new Date();
        a.setTime(d);
        var c = a.getFullYear(),
          h = a.getMonth();
        h++, 10 > h && (h = "0" + h);
        var v = a.getDate();
        10 > v && (v = "0" + v);
        var g = a.getHours();
        10 > g && (g = "0" + g);
        var y = a.getMinutes();
        10 > y && (y = "0" + y);
        var b = a.getSeconds();
        10 > b && (b = "0" + b);
        var _ = c + "" + h + v + g + y + b;
        return _;
      };
    return {
      formartStrDate1: function (c) {
        return a(c);
      },
      formartStrDate2: function (a, h) {
        return c(a, h);
      },
      formartStr2Date: function (a) {
        return h(a);
      },
      getTwoMon: function (a) {
        return v(a);
      },
      getTwoDate: function (d) {
        return g(d);
      },
      getFullTime: function (d) {
        return y(d);
      },
    };
  }),
  define("stcutil", function (require) {
    var a = null,
      c = null,
      h = null,
      v = require("formartDateUtil"),
      g = require("pluspop"),
      y = function (v) {
        var g = arguments.callee;
        if (null != c) {
          var t = new Date();
          t.setTime(c), (a = t), v(t);
        } else {
          var y = new Date().getTime();
          "undefined" != typeof h && 100 > y - h
            ? setTimeout(function () {
                g(v);
              }, 100)
            : ((h = y), b(v));
        }
      },
      b = function (c) {
        var h = null,
          v = null,
          g = new Date();
        require(["commonutil"], function (y) {
          y.GET(
            "/v1/res/sysdate",
            {},
            function (y) {
              if ("function" == typeof c) {
                h = y;
                var b = new RegExp("^[0-9]{14}$");
                if (b.test(h)) {
                  v = new Date();
                  var w = h.substr(0, 4),
                    m = h.substr(4, 2),
                    d = h.substr(6, 2),
                    k = h.substr(8, 2),
                    C = h.substr(10, 2),
                    s = h.substr(12, 2),
                    $ = w + "/" + m + "/" + d + " " + k + ":" + C + ":" + s;
                  (v = new Date($)), (a = v), _(v), c(a);
                } else _(g), c(g);
              }
            },
            function () {
              _(g), c(g);
            },
            function () {
              _(g), c(g);
            }
          );
        });
      },
      _ = function (a) {
        (c = a.getTime()),
          setInterval(function () {
            c += 1e3;
          }, 1e3);
      },
      w = function (a) {
        null != c
          ? a(c)
          : b(function () {
              a(c);
            });
      },
      k = function (a, c, h, v) {
        var g = "";
        if (2 == c || (1 == c && "undefined" != typeof v && h == v) || 0 == c)
          g = a.provice;
        else {
          var y = a.userAccountList;
          if ("undefined" != typeof y && null != y)
            for (var i = 0; i < y.length; i++)
              if (y[i].userAccountID == v) {
                g = y[i].provice;
                break;
              }
        }
        return g;
      },
      C = function (s, a) {
        if ("undefined" != typeof a)
          for (var i = 0; i < a.length; i++) if (s == a[i]) return !0;
        return !1;
      },
      S = function (a) {
        var c = require("stcDic"),
          h = c.getShopSSO() + encodeURI(a);
        return h;
      },
      O = function (a) {
        return -1 == a.toString().indexOf(".")
          ? 0
          : a.toString().split(".")[1].length;
      },
      P = function (a) {
        return -1 == a.toString().indexOf(".")
          ? a
          : Number(a.toString().replace(".", ""));
      },
      M = function (a, c) {
        var h = O(a),
          v = O(c),
          g = 0;
        (g += h), (g += v);
        var y = P(a),
          b = P(c);
        return (y * b) / Math.pow(10, g);
      },
      E = function (a, c) {
        var h = O(a),
          v = O(c),
          g = Math.pow(10, Math.max(h, v));
        return (M(a, g) + M(c, g)) / g;
      },
      D = function (a, c) {
        var h = O(a),
          v = O(c),
          g = Math.pow(10, Math.max(h, v));
        return (M(a, g) - M(c, g)) / g;
      },
      j = function (a, c) {
        var h = O(a),
          v = O(c),
          g = P(a),
          y = P(c),
          b = (g / y) * Math.pow(10, v - h);
        return b;
      },
      I = function (a, c) {
        if (null == a || isNaN(a)) return "";
        c = null == c ? 2 : c;
        var h = M(a, Math.pow(10, c)),
          v = parseInt(Math.floor(h)),
          g = j(v, Math.pow(10, c));
        return g.toFixed(c);
      },
      T = function (a, c) {
        if (null == a || isNaN(a)) return "";
        c = null == c ? 2 : c;
        var h = M(a, Math.pow(10, c)),
          v = parseInt(Math.ceil(h)),
          g = j(v, Math.pow(10, c));
        return g.toFixed(c);
      },
      A = function (a, c) {
        if (null == a || isNaN(a)) return "";
        c = null == c ? 2 : c;
        var h = M(a, Math.pow(10, c)),
          v = parseInt(Math.round(h)),
          g = j(v, Math.pow(10, c));
        return g.toFixed(c);
      },
      N = function (a) {
        if (null == a || "undefined" == typeof a || "" === a || isNaN(a))
          return "";
        (a = a.toString().replace(/\$|\,/g, "")),
          (sign = a == (a = Math.abs(a))),
          (a = Math.floor(100 * a + 0.50000000001)),
          (cents = a % 100),
          (a = Math.floor(a / 100).toString()),
          10 > cents && (cents = "0" + cents);
        for (var i = 0; i < Math.floor((a.length - (1 + i)) / 3); i++)
          a =
            a.substring(0, a.length - (4 * i + 3)) +
            "," +
            a.substring(a.length - (4 * i + 3));
        return (sign ? "" : "-") + a + "." + cents;
      },
      R = function (a) {
        var c = a.value;
        (c = c.replace(/[^\d]/g, "")),
          (c = c.replace(/^[0]/g, "")),
          c != a.value && (a.value = c);
      },
      B = function (a, c) {
        return (a = a.replace(/\.((\d|[\u4e00-\u9fa5])+)/g, function (a) {
          return "<span style=" + c + ">" + a + "</span>";
        }));
      },
      F = function (a) {
        var c = "";
        switch (a) {
          case "01":
            c = "全球通";
            break;
          case "03":
            c = "动感地带";
        }
        return c;
      },
      J = function (a) {
        document.write(
          "<link type='text/css' rel='stylesheet' href='" + a + "' />"
        );
      },
      U = function (a) {
        document.write(
          "<script type='text/javascript' src='" + a + "' ></script>"
        );
      },
      L = function (a) {
        var x = document.createElement("script");
        (x.src = a), (x.type = "text/javascript");
        var c = document.head || document.getElementsByTagName("head")[0];
        c.appendChild(x);
      },
      Q = function (a) {
        var x = document.createElement("link");
        (x.href = a), (x.rel = "stylesheet"), (x.type = "text/css");
        var c = document.head || document.getElementsByTagName("head")[0];
        c.appendChild(x);
      },
      H = function () {
        $(".js_select2")
          .off("click")
          .on("click", function (e) {
            e.stopPropagation();
            var a = $(this),
              c = a.children("ul");
            $(".js_select2 ul").not(c).hide(),
              a.hasClass("disabled") ||
                ($(".js_select2").not(a).css("z-index", 1),
                a.css("z-index", 100),
                c.toggle());
          }),
          $(".js_select2 ul li")
            .off("click")
            .on("click", function (e) {
              e.stopPropagation();
              var a = $(this),
                c = a.attr("data-value") || $(this).text(),
                h = a.parents(".js_select2").children(".ued-text");
              h.text(c), a.parent("ul").hide();
            }),
          $(document)
            .off("click")
            .on("click", function () {
              $(".js_select2 ul").hide();
            });
      },
      W = function (a) {
        $(".js-select")
          .off("click")
          .on("click", function (a) {
            var c = $(this).attr("statu");
            0 == c
              ? ($(this).find(".sel-ul").show(), $(this).attr("statu", "1"))
              : ($(this).find(".sel-ul").hide(), $(this).attr("statu", "0")),
              $(document).on("click", function () {
                $(".sel-ul").hide();
              }),
              a.stopPropagation();
          }),
          $(".js-select-ul li")
            .off("click")
            .on("click", function () {
              $(this).parent().siblings("span.js-txt").html($(this).html()),
                $(this)
                  .parent()
                  .siblings("span.js-txt")
                  .attr("pcid", $(this).attr("pcid"));
            }),
          $(".js-list")
            .off("click")
            .on("click", function () {
              var c = $(this).attr("pid");
              "001" == c
                ? stcEcode.commTrack("UCenter_rechargelife_JSF", !1)
                : "002" == c
                ? stcEcode.commTrack("UCenter_rechargelife_JDF", !1)
                : "003" == c
                ? stcEcode.commTrack("UCenter_rechargelife_JRQ", !1)
                : "005" == c &&
                  stcEcode.commTrack("UCenter_rechargelife_JYX", !1),
                $(".lifepay-list")
                  .find(".js-list")
                  .each(function () {
                    $(this).attr("class").indexOf("-active") > 0 &&
                      $(this).attr(
                        "class",
                        $(this).attr("class").replace("-active", "")
                      );
                  });
              var h = $(this).attr("class").split("bg-lifepay-");
              $(this).attr("class", h[0] + "bg-lifepay-active-" + h[1]),
                $("#stc-recharge-life-pro").attr("pid", $(this).attr("pid")),
                $("#stc-recharge-life-pro").attr(
                  "pname",
                  $(this).attr("pname")
                ),
                "function" == typeof a && a();
            });
      },
      z = function (a) {
        var c = /^([1])\d{10}$/;
        return -1 == a.search(c) ? !1 : !0;
      },
      G = function (a) {
        var c = parseFloat(a / 100).toFixed(2);
        return c;
      },
      Y = function () {
        {
          var a = navigator.userAgent,
            c = a.indexOf("Opera") > -1,
            h = a.indexOf("compatible") > -1 && a.indexOf("MSIE") > -1 && !c,
            v = a.indexOf("Firefox") > -1;
          a.indexOf("Safari") > -1;
        }
        if (h) {
          var g =
            ((IE55 = IE6 = IE7 = IE8 = !1), new RegExp("MSIE (\\d+\\.\\d+);"));
          g.test(a);
          var y = parseFloat(RegExp.$1);
          if (
            ((IE55 = 5.5 == y),
            (IE6 = 6 == y),
            (IE7 = 7 == y),
            (IE8 = 8 == y),
            IE55)
          )
            return "IE55";
          if (IE6) return "IE6";
          if (IE7) return "IE7";
          if (IE8) return "IE8";
        }
        return v ? "FF" : c ? "Opera" : void 0;
      },
      V = function (a) {
        return "undefined" == typeof a || null == a || "" == $.trim(a)
          ? "系统开小差了哦~请您稍后再试吧！"
          : a;
      },
      X = function (a) {
        return $.isEmptyObject(a) ? "" : JSON.stringify(a);
      },
      Z = function (a) {
        var c = {},
          h = window.location.search.match(
            new RegExp("[?&][^?&]+=[^?&]+", "g")
          );
        if (null != h)
          for (var i = 0; i < h.length; i++) {
            var v = h[i],
              g = v.indexOf("=");
            c[v.substring(1, g)] = v.substring(g + 1);
          }
        var rt = c[a];
        return void 0 == rt ? null : rt;
      },
      K = function (a, c) {
        $("#star_517_entry").removeClass("none").off("click");
        var h = [];
        (h.billqry = "020600"),
          (h.billdetailqry = "020700"),
          (h.packremainqry = "020400"),
          (h.rechargerecord = "010800"),
          (h.busiqrydeal = "020900"),
          (h.pointqry = "020300"),
          (h.recharhisqry = "020500"),
          (h.custinfoqry = "020800"),
          (h.myorders = "010600"),
          (h.myfav = "010400"),
          (h.rechargecredit = "040300"),
          (h.rechargecard = "040300"),
          (h.rechargejf = "040300"),
          (h.rechargegprs = "040500"),
          (h.rechargelove = "040800"),
          (h.rechargeinterofth = "040600"),
          (h.noractivy = "180000");
        var v = [];
        (v[1] = "1"), (v[2] = "2"), (v[3] = "3");
        {
          var g = require("appmanage"),
            y = "",
            b = "";
          require("cookie");
        }
        if (1 == g.data[0].data.userType && "1" == $.cookie("stc_517_star")) {
          var _ = new Date();
          _.setTime(_.getTime() - 1e3),
            $.cookie("stc_517_star", "", {
              domain: ".10086.cn",
              path: "/",
              expires: _,
            });
        }
        var w = [
          "billqry",
          "billdetailqry",
          "packremainqry",
          "rechargerecord",
          "busiqrydeal",
          "pointqry",
          "recharhisqry",
          "custinfoqry",
          "myorders",
          "myfav",
          "rechargecard",
          "rechargejf",
          "rechargecredit",
          "rechargegprs",
          "rechargelove",
          "rechargeinterofth",
          "noractivy",
        ];
        if (
          C(a, w) &&
          1 != g.data[0].data.userType &&
          ("1" == c || "2" == c || ("3" == c && "1" != Z("p")))
        ) {
          if (
            ($("#star_517_entry")
              .removeClass("none")
              .on("click", function () {
                "rechargecard" == a || "rechargejf" == a
                  ? stcEcode.commTrack("UCenter_rechargecredit_star", !1)
                  : stcEcode.commTrack("UCenter_" + a + "_star", !1),
                  "2" == g.data[0].data.userType
                    ? require(["pluspop"], function (c) {
                        c.remotehtml(
                          "/i/apps/serviceapps/itemcollect/pop.html",
                          { width: "400px" }
                        );
                        var h = new Date();
                        h.setTime(h.getTime() + 6e4),
                          $.cookie("stc_517_star_click", "1", {
                            domain: ".10086.cn",
                            path: "/",
                            expires: h,
                          }),
                          (window.closePopstar = null),
                          (closePopstar = function () {
                            var c = require("stcDic");
                            (window.location.href =
                              "noractivy" == a
                                ? c.getWebAddress() + a + ".html"
                                : c.getWebAddress() + "?f=" + a),
                              "1" == $.cookie("stc_517_star_click") &&
                                $.cookie("stc_517_star", "1", {
                                  domain: ".10086.cn",
                                  path: "/",
                                });
                          });
                      })
                    : require(["commonutil"], function (c) {
                        var req = {
                          cellNum: g.data[0].data.loginValue,
                          pageCode: h[a],
                          orderId: "",
                          channel: "00",
                        };
                        c.GET(
                          "/v1/cust/collectStars/" + req.cellNum,
                          req,
                          function (a) {
                            (y = "恭喜您"),
                              (b = "获得" + v[a.collectCount] + "颗幸运星！"),
                              et(y, b, 2);
                          },
                          function (a) {
                            "600001" == a
                              ? ((y = "很抱歉！"),
                                (b = "您今日收集的星星已满5颗，请明日再来！"),
                                et(y, b, 0))
                              : "600002" == a
                              ? ((y = "很抱歉！"),
                                (b =
                                  "这颗星星已经领过了，去别的地方再找找吧！"),
                                et(y, b, 1))
                              : ((y = "太可惜了！"),
                                (b =
                                  "差一点点就领到星星了，去别的地方再找找吧~"),
                                et(y, b, 1));
                          },
                          function () {
                            (y = "很抱歉！"),
                              (b = "网络开了个小差，请返回重新领取！"),
                              et(y, b, 1);
                          }
                        );
                      });
              }),
            "1" == $.cookie("stc_517_star"))
          ) {
            $("#star_517_entry").trigger("click");
            var _ = new Date();
            _.setTime(_.getTime() - 1e3),
              $.cookie("stc_517_star", "", {
                domain: ".10086.cn",
                path: "/",
                expires: _,
              });
          }
        } else if (
          "3" == c &&
          C(a, ["rechargecredit", "rechargegprs"]) &&
          "0" == g.data[0].data.userType &&
          "1" == Z("p") &&
          "0" == Z("status")
        ) {
          var k = [];
          (k.rechargecredit = "040301"),
            (k.rechargegprs = "040501"),
            $("#star_517_entry")
              .removeClass("none")
              .on("click", function () {
                "rechargecredit" == a
                  ? stcEcode.commTrack("UCenter_rechargerecord_okstar", !1)
                  : stcEcode.commTrack("UCenter_rechargedata_okstar", !1),
                  require(["commonutil"], function (c) {
                    var req = {
                      cellNum: g.data[0].data.loginValue,
                      pageCode: k[a],
                      orderId: Z("orderId"),
                      channel: "00",
                    };
                    c.GET(
                      "/v1/cust/collectStars/" + req.cellNum,
                      req,
                      function (a) {
                        (y = "恭喜您"),
                          (b = "获得" + v[a.collectCount] + "颗幸运星！"),
                          et(y, b, 2);
                      },
                      function (a) {
                        "600001" == a
                          ? ((y = "很抱歉！"),
                            (b = "您今日收集的星星已满5颗，请明日再来！"),
                            et(y, b, 0))
                          : "600002" == a
                          ? ((y = "很抱歉！"),
                            (b = "这颗星星已经领过了，去别的地方再找找吧！"),
                            et(y, b, 1))
                          : ((y = "太可惜了！"),
                            (b = "差一点点就领到星星了，去别的地方再找找吧~"),
                            et(y, b, 1));
                      },
                      function () {
                        (y = "很抱歉！"),
                          (b = "网络开了个小差，请返回重新领取！"),
                          et(y, b, 1);
                      }
                    );
                  });
              });
        } else $("#star_517_entry").addClass("none");
      },
      et = function (a, c, h) {
        "0" == h
          ? g.definehtml(
              [
                '<div class="star-content">',
                '<div class="star-content-icon-fail">',
                "</div>",
                '<p class="star-content-txt col-17">' + a + "</p>",
                '<p class="star-content-txt-tip">' + c + "</p>",
                '<div class="star-content-bottom">',
                '<input type="button" value="查看我的星星" class="star-btn star-btn-look js_star_look" />',
                "</div>",
                "</div>",
              ].join(""),
              { width: "340px" },
              ""
            )
          : "1" == h
          ? g.definehtml(
              [
                '<div class="star-content">',
                '<div class="star-content-icon-fail">',
                "</div>",
                '<p class="star-content-txt col-17">' + a + "</p>",
                '<p class="star-content-txt-tip">' + c + "</p>",
                '<div class="star-content-bottom">',
                '<input type="button" value="查看我的星星" class="star-btn star-btn-look mgr-10 js_star_look" />',
                '<input type="button" value="继续查找" class="star-btn star-btn-sel js_btn_sel" />',
                "</div>",
                "</div>",
              ].join(""),
              { width: "340px" },
              ""
            )
          : "2" == h &&
            g.definehtml(
              [
                '<div class="star-content">',
                '<div class="star-content-icon-succ">',
                "</div>",
                '<p class="star-content-txt col-17">' + a + "</p>",
                '<p class="star-content-txt-tip">' + c + "</p>",
                '<div class="star-content-bottom">',
                '<input type="button" value="查看我的星星" class="star-btn star-btn-look mgr-10 js_star_look" />',
                '<input type="button" value="继续查找" class="star-btn star-btn-sel js_btn_sel" />',
                "</div>",
                "</div>",
              ].join(""),
              { width: "340px" },
              ""
            );
        var v = require("stcDic");
        $(".js_star_look").on("click", function () {
          stcEcode.commTrack("UCenter_517get_checkstar", !1);
          var a = v.getCheckStarAdd();
          window.open(a);
        }),
          $(".js_btn_sel").on("click", function () {
            stcEcode.commTrack("UCenter_517get_searchstar", !1),
              $(".ui-dialog-body").hide(),
              $(".ui-popup-backdrop").hide();
          });
      },
      tt = function (a, c) {
        var h = new Date(),
          v = h.getFullYear(),
          m = h.getMonth() + 1,
          d = h.getDate(),
          g = h.getHours(),
          y = h.getMinutes(),
          b = h.getSeconds(),
          _ = v + "/" + m + "/" + d + " " + g + ":" + y + ":" + b,
          w = new Date(_),
          k = "1";
        return (
          Date.parse(a) <= Date.parse(w) &&
            Date.parse(w) <= Date.parse(c) &&
            (k = "0"),
          k
        );
      },
      nt = function (a, c) {
        return { pay_amount: ut(a, c), reality_amount: a };
      },
      it = function (a, c) {
        var h = lt(a, c);
        return { pay_amount: a, reality_amount: a, extra_amount: h };
      },
      at = function (a, c) {
        var h = c.split("@");
        return {
          pay_amount: ut(a, h[0]),
          reality_amount: a,
          extra_amount: lt(a, h[1]),
        };
      },
      ot = function (a, c) {
        var h = lt(a, c),
          v = null == h ? 0 : h;
        return { pay_amount: a, reality_amount: a, extra_amount: ut(a, v) };
      },
      st = function (a, c) {
        var h = lt(a, c),
          v = null == h ? 1 : h,
          g = ut(a, v);
        return { pay_amount: g, reality_amount: a };
      },
      ct = function (a, c) {
        var h = c.split("@"),
          v = lt(a, h[0]),
          g = null == v ? 1 : v;
        return {
          pay_amount: ut(a, g),
          reality_amount: a,
          extra_amount: lt(a, h[1]),
        };
      },
      ut = function (a, c) {
        var h = parseFloat(c),
          v = M(a, h);
        return v;
      },
      lt = function (a, c) {
        var h = c.split(",");
        for (var v in h) {
          var g = h[v].split(":"),
            y = g[0].split("~"),
            b = parseInt(y[0]),
            _ = parseInt(y[1]);
          if (a >= b && _ >= a) return g[1];
        }
        return null;
      };
    $.isEmptyObject = function (a) {
      var c;
      for (c in a) if ("forEach" != c && "format" != c) return !1;
      return !0;
    };
    var dt = function (a) {
        return a.replace(/[^\d]/g, "");
      },
      pt = function (a) {
        return "undefined" != typeof a && null != a && -1 == a.indexOf("-")
          ? a.substr(0, 3) + " " + a.substr(3, 4) + " " + a.substr(7, 4)
          : "";
      },
      ft = function (a) {
        (a = a.toString().indexOf("#") > -1 ? a : "#" + a),
          $(a)
            .off("keyup")
            .on("keyup", function () {
              $(a).val(dt($(a).val())),
                11 == $(a).val().length ? $(a).blur() : $(a).val();
            }),
          $(a)
            .off("focus")
            .on("focus", function () {
              $(a).val("号码请勿输错" == $(a).val() ? "" : dt($(a).val()));
            }),
          $(a)
            .off("blur")
            .on("blur", function () {
              "" == $(a).val()
                ? $(a).val("号码请勿输错")
                : 11 == $(a).val().length && $(a).val(pt($(a).val()));
            });
      },
      ht = function (a) {
        var c = !1,
          h = /^([1])\d{10}$/;
        return (a = dt(a)), 11 == a.length && h.test(a) && (c = !0), c;
      },
      vt = function (a, c) {
        return (
          (a = parseFloat(a)),
          (c = parseFloat(c)),
          isNaN(a) || isNaN(c)
            ? "-"
            : 0 >= c
            ? "0%"
            : Math.round((a / c) * 1e4) / 100 + "%"
        );
      },
      mt = function (a) {
        var c = a[0],
          h = c.length;
        if (!gt[h]) throw "传递参数必须是6,8,14位的时间字符串";
        var v = gt[h];
        return (c = v.apply(null, a));
      },
      gt = {
        8: function (a, c, h, v) {
          var g,
            y = /^(\d{4})(\d{2})(\d{2})$/;
          return (
            (c = c || ""),
            (h = h || ""),
            (v = v || ""),
            (g = a.replace(y, "$1" + c + "$2" + h + "$3" + v))
          );
        },
        14: function (a, c, h, v, g, y, b) {
          var _,
            w = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/;
          return (
            (c = c || "-"),
            (h = h || "-"),
            (v = v || ""),
            (g = g || ":"),
            (y = y || ":"),
            (b = b || ""),
            (_ = a.replace(
              w,
              "$1" + c + "$2" + h + "$3" + v + " $4" + g + "$5" + y + "$6" + b
            ))
          );
        },
        6: function (a, c, h) {
          var v,
            g = /^(\d{4})(\d{2})$/;
          return (
            (c = c || "年"),
            (h = h || "月"),
            (v = a.replace(g, "$1" + c + "$2" + h))
          );
        },
      },
      yt = function (a) {
        var c,
          h = /[-年月日时分秒\:\/\s]/g;
        return (c = a.replace(h, ""));
      },
      bt = function () {
        var a = {},
          c = window.location.search.match(
            new RegExp("[?&][^?&]+=[^?&]+", "g")
          );
        if (c)
          for (var i = 0, h = c.length; h > i; i++) {
            var v = c[i],
              g = v.indexOf("=");
            a[v.substring(1, g)] = v.substring(g + 1);
          }
        var y = a.c || "",
          e = a.e || "",
          s = a.s || "",
          b = a.taskId || "",
          _ = "s=" + s + "~e=" + e + "~c=" + y + "~taskId=" + b,
          w = new Date();
        return (
          w.setTime(w.getTime() + 18e5),
          $.cookie("chargeresource", _, { expires: w, path: "/", secure: !0 }),
          {
            getParameter: function (c) {
              var h = a[c];
              if (h) return h;
              var v = $.cookie("chargeresource");
              return null != v ? _t(v.split("~"), c) : void 0;
            },
            getAllParameter: function () {
              return a;
            },
          }
        );
      },
      _t = function (a, c) {
        for (var i = 0, h = a.length; h > i; i++) {
          var v = a[i].split("=");
          if (c == v[0]) return v[1] ? v[1] : null;
        }
        return null;
      },
      wt = function (a, c, h, v, g, ts) {
        var y = new Date(),
          b = y.getFullYear(),
          m = y.getMonth() + 1,
          d = y.getDate(),
          _ = y.getHours(),
          w = y.getMinutes(),
          k = y.getSeconds(),
          C = b + "/" + m + "/" + d + " " + _ + ":" + w + ":" + k,
          $ = new Date(C),
          S = new Date(a + "/" + c + "/" + h + " " + v + ":" + g + ":" + ts);
        return Date.parse(S) <= Date.parse($) ? !0 : !1;
      },
      kt = function () {
        var d = new Date(),
          a = d.getFullYear(),
          c = d.getMonth() + 1,
          h = d.getDate();
        10 > c && (c = "0" + c), 10 > h && (h = "0" + h);
        var v = a + "." + c + "." + h;
        return v;
      },
      xt = function (a) {
        var c = !1;
        return (
          w(function (h) {
            var v = new Date(h),
              g = v.getDate(),
              y = v.getMonth() + 1,
              b = new RegExp("10|11|12"),
              _ = new RegExp("23|24|25|26");
            "rc" == a
              ? (c =
                  (10 == y && g >= 23 && 26 >= g) ||
                  ((11 == y || 12 == y) && g >= 3 && 26 >= g)
                    ? !0
                    : !1)
              : "fw" == a && (c = b.test(y) && _.test(g) ? !0 : !1);
          }),
          c
        );
      },
      Ct = function (a, c, h) {
        var c = CryptoJS.enc.Utf8.parse(c),
          h = CryptoJS.enc.Utf8.parse(h),
          v = CryptoJS.AES.encrypt(a, c, {
            iv: h,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
        return v.toString();
      },
      $t = function (a, c, h) {
        var c = CryptoJS.enc.Utf8.parse(c),
          h = CryptoJS.enc.Utf8.parse(h),
          v = CryptoJS.AES.decrypt(a, c, {
            iv: h,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          });
        return v.toString(CryptoJS.enc.Utf8);
      },
      St = function (a) {
        return "undefined" != typeof a &&
          null != a &&
          a.length > 7 &&
          -1 == a.indexOf("@")
          ? a.substring(0, 3) + "****" + a.substring(a.length - 4)
          : a;
      },
      Ot = function (a, c, h) {
        $(h).html(
          "900001" == a
            ? "<tr><td  style='width:984px'><div style='height:100px; text-align:center; padding:40px;'><div style='zoom: 1;display: inline-block;*display:inline;vertical-align: top;'><img src='/i/nresource/image/rocket.png' /></div><div style='zoom: 1; display: inline-block; vertical-align: top;*display:inline; color: rgb(204, 204, 204); text-align:left;padding-left:10px;'><div style='font-size: 14px;line-height: 80px;'>系统升级维护中，请稍后再试</div></div></div></td></tr>"
            : "<tr><td  style='width:984px'><div style='height:100px; text-align:center; padding:40px;'><div style='zoom: 1;display: inline-block;*display:inline;vertical-align: top;'><img src='/i/nresource/image/ordernodata.png' /></div><div style='zoom: 1; display: inline-block; vertical-align: top;*display:inline; color: rgb(204, 204, 204); text-align:left;'><div style='font-size: 14px;line-height: 80px;'>" +
                V(c) +
                "</div></div></div></td></tr>"
        );
      };
    return {
      upgrade: function (a, c, h) {
        return Ot(a, c, h);
      },
      encryption: function (a) {
        return St(a);
      },
      localDate: function () {
        return kt();
      },
      getPercent: function (a, c) {
        return vt(a, c);
      },
      getNum: function (a) {
        return dt(a);
      },
      addSpace: function (a) {
        return pt(a);
      },
      inputInit: function (a) {
        ft(a);
      },
      checkPhoneFmt: function (a) {
        return ht(a);
      },
      getSysDate: function (a) {
        y(a);
      },
      getSysTime: function (a) {
        w(a);
      },
      getProvince: function (a, c, h, v) {
        return k(a, c, h, v);
      },
      inArray: function (s, a) {
        return C(s, a);
      },
      dealOuterUrl: function (a) {
        return S(a);
      },
      getPrecision: function (a, c) {
        return O(a, c);
      },
      getIntFromFloat: function (a, c) {
        return P(a, c);
      },
      floatMultiply: function (a, c) {
        return M(a, c);
      },
      floatAdd: function (a, c) {
        return E(a, c);
      },
      floatSubtract: function (a, c) {
        return D(a, c);
      },
      floatDevide: function (a, c) {
        return j(a, c);
      },
      floatFloor: function (a, c) {
        return I(a, c);
      },
      floatCeil: function (a, c) {
        return T(a, c);
      },
      floatRound: function (a, c) {
        return A(a, c);
      },
      formatCurrency: function (a, c) {
        return N(a, c);
      },
      toInteger: function (a) {
        R(a);
      },
      formartStr2Date: function (a) {
        return v.formartStr2Date(a);
      },
      formartStrDate2: function (a, c) {
        return v.formartStrDate2(a, c);
      },
      multiMoney: function (a, c) {
        return B(a, c);
      },
      getBrandName: function (a) {
        return F(a);
      },
      formatStrDate: function (a) {
        var c = new RegExp("^[0-9]{14}$");
        if (c.test(a)) {
          var d =
            a.substr(0, 4) +
            "-" +
            a.substr(4, 2) +
            "-" +
            a.substr(6, 2) +
            " " +
            a.substr(8, 2) +
            ":" +
            a.substr(10, 2) +
            ":" +
            a.substr(12, 2);
          return d;
        }
        return a;
      },
      formatDateYear: function (a) {
        if (null == a) return "";
        var c = a.length;
        if (14 > c) for (var i = 0; 14 - c > i; i++) a += "0";
        var h = new RegExp("^[0-9]{14}$");
        if (h.test(a)) {
          var d = a.substr(0, 4) + "-" + a.substr(4, 2) + "-" + a.substr(6, 2);
          return d;
        }
        return a;
      },
      base64CryptoJS: function (a) {
        var c = CryptoJS.enc.Utf8.parse(a),
          h = CryptoJS.enc.Base64.stringify(c);
        return h;
      },
      base64Decode: function (a) {
        var c = CryptoJS.enc.Base64.parse(a),
          h = CryptoJS.enc.Utf8.stringify(c);
        return h;
      },
      htmlEncode: function (a) {
        return (
          "string" != typeof a && (a = a.toString()),
          (a = a
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;"))
        );
      },
      addCss: function (a) {
        J(a);
      },
      addScript: function (a) {
        U(a);
      },
      loadScript: function (a) {
        L(a);
      },
      loadCss: function (a) {
        Q(a);
      },
      getSelectJs: function () {
        H();
      },
      getSelectJs2: function (a) {
        W(a);
      },
      myBrowser: function () {
        return Y();
      },
      getUnit: function (a) {
        return G(a);
      },
      getErrMsg: function (a) {
        return V(a);
      },
      getJsonObj: function (a) {
        return X(a);
      },
      starEntry: function (a, c) {
        var h = new Date("2017/04/20 17:12:00"),
          v = new Date("2017/06/30 23:59:59"),
          g = tt(h, v);
        return "0" == g ? K(a, c) : [];
      },
      forMobil: function (a) {
        return z(a);
      },
      parseRuleType1: function (a, c) {
        return nt(a, c);
      },
      parseRuleType2: function (a, c) {
        return it(a, c);
      },
      parseRuleType3: function (a, c) {
        return at(a, c);
      },
      parseRuleType4: function (a, c) {
        return ot(a, c);
      },
      parseRuleType5: function (a, c) {
        return st(a, c);
      },
      parseRuleType6: function (a, c) {
        return ct(a, c);
      },
      formatDate: function () {
        return mt(arguments);
      },
      delTimeSign: function (a) {
        return yt(a);
      },
      encrypt: function (a, c) {
        var h = CryptoJS.enc.Utf8.parse(c),
          v = CryptoJS.DES.encrypt(a, h, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7,
          });
        return v.toString();
      },
      decryptByDES: function (a, c) {
        var h = CryptoJS.enc.Utf8.parse(c),
          v = CryptoJS.DES.decrypt(
            { ciphertext: CryptoJS.enc.Base64.parse(a) },
            h,
            { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }
          );
        return v.toString(CryptoJS.enc.Utf8);
      },
      getQueryParam: function () {
        return new bt();
      },
      dateQry: function (a, c, h, v, g, ts) {
        return wt(a, c, h, v, g, ts);
      },
      getFpsolids: function (a) {
        return xt(a);
      },
      getAesString: function (a, c, h) {
        return Ct(a, c, h);
      },
      getDAesString: function (a, c, h) {
        return $t(a, c, h);
      },
    };
  }),
  define(
    "commonutil",
    [
      "ajaxutil",
      "uri",
      "stcDic",
      "stcutil",
      "/i/service/model/componet_set_0a0af91.js",
    ],
    function (a, c, h, v, g) {
      var y = "/i",
        b = ["043A", "lyZA", "OQGK", "043A", "6ykk", "OQGK", "lyZA", "6ykk"],
        _ = {},
        w = v.getQueryParam(),
        k = b
          .filter(function (e, i) {
            return i % 2 == 0;
          })
          .join(""),
        C = function (a) {
          var c = [
              "v1/pay/flow/goodsinventory/",
              "v1/pay/getRecommendUrl/",
              "promotionrest/v1/actRest/qryAct",
              "promotionrest/v1/lotteryRest/lockLottery",
              "promotionrest/v1/lotteryRest/getLottery",
              "promotionrest/v1/lotteryRest/queryLotteryChance",
              "promotionrest/v1/lotteryRest/queryLotteryWin",
              "v1/cust/recaddr/",
              "v1/cust/area/100000/1",
              "v1/busi/order/",
              "v1/busi/eborder/",
              "v1/busi/ebordercheck/",
              "v1/pay/chargeitem/list/",
              "v1/pay/chargeitem/item/",
              "v1/cust/orderlistqry/",
              "v1/pay/payorderlist/",
              "v1/pay/payorderdetail/",
              "v1/pay/flow/orderList",
              "v1/cust/shoporderuni/",
              "v1/pay/repayorder/",
              "v1/pay/flow/repayorder",
              "v1/cust/newcomment/",
              "v1/cust/getcommentstatus/",
              "v1/cust/getcomment/",
              "v1/cust/getcommentlist/",
              "v1/cust/getcommodityscore/",
              "v1/cust/getlabeloptions/",
              "v1/cust/getcommentlabels/",
              "v1/pay/ruleinfo/",
              "v1/pay/pcardsms/",
              "v1/cust/commonSms/",
              "v1/pay/pcardvalid/",
              "v1/pay/saveorder/",
              "v1/pay/activetransfer/",
              "v1/pay/sms/",
              "v1/pay/valid/",
              "v1/pay/md5/",
              "v1/pay/sharetransfer/",
              "v1/cust/winningQry",
              "v1/cust/fcodeuserquery/",
              "v1/cust/fcodeusegoodsqry/",
              "v1/cust/fcodegivequery/",
              "v1/cust/fcodegiveother/",
              "v1/cust/pcardReceivedV1/",
              "v1/pcardrest/flow/cardFlowGive/",
              "v1/pay/flow/coupongive/",
              "v1/pcardrest/pcardReceived/",
              "v1/pay/couponrule/",
              "v1/pay/flow/couponflowrule/",
              "v1/pay/couponQry/",
              "v1/pay/getPcardNum4Act/",
              "v1/pay/couponReceive/",
              "v1/pcardrest/pcardPackage/",
              "v1/pcardrest/pcardPackageStock",
              "v1/pay/couponReceive4Act/",
              "v1/pay/busi/couponbusigive/",
              "v1/cust/rightsCouponsUse/",
              "v1/cust/familyOrderDetail/",
              "v1/cust/roamOrderDetail/",
              "v1/cust/generalOrderDetail/",
              "v1/cust/transactionOrderDetail/",
              "v1/cust/favprod/",
              "v1/fee/touchbillinfo/",
              "v1/fee/customertrend/",
              "v1/fee/detailbillinfojsonp/",
              "v1/fee/detbillrandomcodejsonp/",
              "v1/pay/deleteorder/",
              "v1/fee/detailbilltempidentjsonp/",
              "v1/fee/presentfee/",
              "v1/cust/flowqry/",
              "v1/cust/busistatusqry/",
              "v1/cust/arrestlist/",
              "v1/cust/arrestclassify/",
              "v1/cust/arrestalert/",
              "v1/cust/arrestlogqry/",
              "v1/cust/invoice/",
              "v1/cust/einvoice/",
              "v1/cust/einvoicepushqry/",
              "v1/cust/einvoiceqry/",
              "v1/cust/einvoiceissue/",
              "v1/cust/einvoicedown/",
              "v1/cust/einvoicepush/",
              "v1/cust/minvoiceqry/",
              "v1/cust/minvoiceissue/",
              "v1/cust/minvoicepush/",
              "v1/cust/minvoicedown/",
              "v1/pay/lifeorderquery/",
              "v1/pay/lifeorderdetail/",
              "v1/cust/lovenotebook/",
              "v1/cust/notebook/",
              "v1/cust/retrylovenobook/",
              "v1/cust/lovebookhis/",
              "v1/cust/msgremind/",
              "v1/cust/userBroadBandQry/",
              "v1/cust/shoporder/",
              "v1/cust/msgqry/",
              "v1/cust/msgdel/",
              "v1/cust/msgread/",
              "v1/cust/message/",
              "v1/cust/getMsgUnreadNum/",
              "v1/cust/getGroupMsgList/",
              "v1/cust/goodssubs/",
              "v1/cust/goodssubs/del/",
              "v1/cust/shoporder4freelogin/1/detail",
              "v1/cust/shoporder4freelogin/",
              "v1/cust/logistics/",
              "v1/cust/shoporders4freelogin/1/2350011673/",
              "v1/cust/cartNumber/",
              "v1/cust/cartInfo/",
              "v1/cust/deleteCart/",
              "v1/cust/mergeCart/",
              "v1/pay/payrule/",
              "v1/pay/payrule4p/",
              "v1/pay/flow/moblevalidate/",
              "v1/cust/isnobook/",
              "v1/pay/card/",
              "v1/pay/saveorder4t/",
              "v1/pay/saveinterorder/",
              "v1/pay/orderqry/",
              "v1/pay/paycallback",
              "v1/cust/his/",
              "v1/res/precheck/",
              "v1/paypoint/rmdpoint/",
              "v1/pay/pointsms/",
              "v1/pay/pointvalid/",
              "v1/paypoint/savepointorder/",
              "v1/paypoint/savehybridorder/",
              "v1/flow/gprs/",
              "v1/flow/gprs/saveorder/",
              "v1/pay/flow/paycallback",
              "v1/pay/fastpaypromt",
              "v1/pay/flow/goodslist/",
              "v1/pay/flow/getreminder/",
              "v1/pay/flow/submitPay/",
              "v1/pay/payenablev2/",
              "v1/pay/savebroadorder/",
              "v1/pay/savefixedorder/",
              "v1/cust/creditPointQry/",
              "v1/pay/payrulelimit",
              "v1/pay/unpaidorderflagquery/",
              "v1/paypoint/limitinfo",
              "v1/pay/pageelement/",
              "v1/pay/lifebillinfo/",
              "v1/pay/savelifeorder/",
              "v1/pay/lifeorderInfo",
              "v1/pay/loveorder/",
              "v1/pay/ordercancel/",
              "v1/cust/ridicule/",
              "v1/fee/planbal/",
              "v1/busi/allowance/",
              "v1/cust/accoutQryReq/",
              "v1/cust/blackwhitelist/",
              "v1/cust/interceptrecord/",
              "v1/cust/smsalert/",
              "v1/point/sum/",
              "v1/point/consume/",
              "v1/res/funcavl",
              "v1/res/menu/",
              "v1/cust/mergecust/",
              "v1/auth/loginfo",
              "v1/res/numarea/",
              "v1/area/code",
              "v1/cust/hotsmart/",
              "v1/cust/recomhobbies/",
              "v1/res/optInfoQry",
              "v1/cust/tipcfg",
              "v1/auth/loginfoaccess",
              "v1/cust/info/",
              "v1/cust/noticeinfo/",
              "v1/cust/noticeinfo",
              "v1/busi/plan/",
              "v1/fee/real/",
              "v1/point/sum/v2/",
              "v2/res/numarea/",
              "v1/res/sysdate",
              "v1/cust/getwblist/",
              "v1/cust/getwbdetail/",
              "v1/auth/updateInfo/",
              "v1/res/dictionary/25",
              "v1/cust/headicon/",
              "v1/cust/email/",
              "v1/pay/repayorder4t/",
              "v1/cust/starscoreinfo/",
              "/v1/cust/billCustInfoQry/",
              "/v1/cust/billCustOrder/",
              "v1/cust/getThirdUrl/",
              "v1/cust/headiconmodify/",
              "v1/busi/ordermodify/",
              "v1/busi/ebordermodify/",
              "v1/cust/shoporderunimodify/",
              "v1/cust/invoicemodify/",
              "v1/cust/notebookmodify/",
              "v1/cust/retrylovenobookmodify/",
              "v1/cust/shoporders4freeloginmodify/1/2350011673/",
              "v1/cust/smsalertmodify/",
              "v1/cust/infomodify/",
              "v1/cust/favprodmodify/",
              "v1/cust/recaddrdel/",
              "v1/cust/shoporderunidel/",
              "v1/cust/invoicedel/",
              "v1/cust/notebookdel/",
              "v1/cust/lovebookhisdel/",
              "v1/cust/deleteCartdel/",
              "v1/cust/blackwhitelistdel/",
              "v1/cust/favproddel/",
              "v1/pay/gear/",
              "v1/cust/newInvoiceQry",
              "v1/cust/pageMask/",
            ],
            h = !1,
            g = !1;
          c.map(function (c) {
            a && a.indexOf(c) > -1 && (h = !0);
          }),
            a && a.indexOf("v1/res/numarea") > -1 && (g = !0);
          var y = [
              "v1/pay/savefixedorder",
              "v1/pay/savebroadorder",
              "v1/pay/saveinterorder",
              "v1/res/numarea",
            ],
            b = !1;
          if (
            (y.map(function (c) {
              a && a.indexOf(c) > -1 && (b = !0);
            }),
            h)
          ) {
            var _ = a.split("?");
            a = _[0];
            var w = a.split("/");
            if (b) {
              var C = v.getAesString(w[w.length - 1], k, k);
              g && (C = w[w.length - 1]),
                (w[w.length - 1] = v.base64CryptoJS(C));
            }
            (w = w.map(function (a) {
              var c = /^([1])\d{10}$/;
              if (-1 != a.search(c)) {
                var h = v.getAesString(a, k, k);
                g && (h = a), (a = v.base64CryptoJS(h));
              }
              return a;
            })),
              (a = w.join("/")),
              _.length > 1 && (a += "?" + _[1]);
          }
          return a;
        },
        S = function (c, h, g) {
          var y = [
              "v1/pay/paycallback",
              "v1/pay/paybackkind",
              "v1/pay/orderinfo",
              "v1/pay/payorderlist",
              "v1/pay/loveorder",
              "v1/pay/payorderdetail",
              "v1/auth/",
              "v1/fee/",
              "v1/res/",
              "v1/cust/his",
              "v1/pay/fastpaypromt",
              "v1/pay/lifeorderquery",
              "v1/cust/recomhobbies/",
              "v1/fee/detailbillinfojsonp",
              "v1/fee/detailbilltempidentjsonp",
              "v2/res/",
              "v1/busi/estbusqry/",
              "v1/busi/allowance/",
              "v1/pay/flow/",
              "v1/point/sum/v2/",
              "v1/iop/recommend/",
              "v1/pcardrest/flow/cardFlowGive/",
              "v1/pcardrest/pcardReceived/",
              "v1/pcardrest/pcardPackage/",
              "v1/pcardrest/pcardPackageStock",
              "v1/act/doubleV/qry/",
              "promotionrest/v1/actRest/qryAct",
              "promotionrest/v1/lotteryRest/lockLottery",
              "promotionrest/v1/lotteryRest/getLottery",
              "promotionrest/v1/lotteryRest/queryLotteryChance",
              "promotionrest/v1/lotteryRest/queryLotteryWin",
              "v1/point/consume/",
              "v1/paypoint/rmdpoint/",
              "promotionrest/v1/pcardrest/getPcardNum",
              "v1/paypoint/savehybridorder/",
              "v2/pcardrest/pcardReceived/",
              "v2/cust/getrealidentback/",
              "v2/cust/numportablist/",
              "v2/cust/numportablist1/",
              "v2/cust/reqrealidentsign/",
              "v2/cust/numportabsms/",
              "v2/cust/numportaborder/",
              "v2/res/numarea/",
              "promotionrest/v2/pcardrest/pcardReceive/",
            ],
            b = [
              "v1/pay/unpaidorderflagquery/",
              "v1/pay/payrule/",
              "v1/cust/recaddr/",
            ],
            _ = !1,
            w = !0;
          if (
            (y.map(function (a) {
              g && g.indexOf(a) > -1 && (_ = !0);
            }),
            !_)
          )
            if ("get" == h) {
              if ("object" == typeof c)
                if (g.indexOf("v1/pay/gear") > -1)
                  for (var C in c)
                    "channel" != C &&
                      "provCode" != C &&
                      (c[C] = v.base64CryptoJS(c[C]));
                else for (var C in c) c[C] = v.base64CryptoJS(c[C]);
            } else if ("object" == typeof c) {
              if (
                (b.map(function (a) {
                  g && g.indexOf(a) > -1 && (w = !0);
                }),
                w)
              ) {
                var $ = v.getAesString(JSON.stringify(c), k, k);
                c = { inParam: base64encode(utf16to8($)) };
              } else c = { inParam: base64encode(utf16to8(JSON.stringify(c))) };
              if (sessionStorage.getItem("aqjg_cmcc_month")) {
                var S = sessionStorage.getItem("aqjg_cmcc_month");
                (S = base64decode(S)), (S = v.getDAesString(S, k, k));
                var O = new Date().getTime(),
                  P = O + S;
                (P = base64encode(utf16to8(v.getAesString(P, k, k)))),
                  (c.msgId = P);
              }
            }
          if ("object" == typeof c)
            try {
              var M = a.getHeaderInfo(),
                E = base64encode(utf16to8(v.getAesString(M.payPhoneNo, k, k)));
              (M.payPhoneNo = E + (M.payPhoneNo || "").substr(5, 2)),
                (c.extHead = M);
            } catch (e) {}
          return c;
        },
        O = function (a, y, b, _, C) {
          if ("object" == typeof a && null != a && "retCode" in a) {
            var S = ["v1/cust/recaddr/"],
              O = !0;
            switch (parseInt(a.retCode)) {
              case 0:
                if ((M(_, 1), "function" == typeof y || "object" == typeof y))
                  try {
                    if (a.data && a.data.hasOwnProperty("outParam")) {
                      S.map(function (a) {
                        C && C.indexOf(a) > -1 && (O = !0);
                      });
                      var D = utf8to16(base64decode(a.data.outParam)).replace(
                        /\s*/g,
                        ""
                      );
                      if (O)
                        try {
                          var j = v.getDAesString(D, k, k);
                          a.data = JSON.parse(
                            j && j.length > 0 && D && D.length > 0 ? j : D
                          );
                        } catch (I) {
                          a.data = JSON.parse(D);
                        }
                      else a.data = JSON.parse(D);
                    }
                    y(a.data, {
                      paging: {
                        totalNum: a.totalNum,
                        curCuror: a.curCuror,
                        startDate: a.startDate,
                        endDate: a.endDate,
                        sOperTime: a.sOperTime,
                        callerTime: a.callerTime,
                        calleeTime: a.calleeTime,
                        allFlowNum: a.allFlowNum,
                      },
                    });
                  } catch (e) {}
                break;
              case 400001:
                alert(a.retMsg);
                break;
              case 400011:
                alert("接口调用顺序有误！");
                break;
              case 500003:
                if ("undefined" != typeof _ && "special" == _.unlogin)
                  return void y("500003");
                var T = sessionStorage.getItem("naviMenu"),
                  A = $.isEmptyObject(T) ? void 0 : T;
                sessionStorage.removeItem("naviMenu");
                for (
                  var N = window.location.href + "",
                    R = [
                      "/receive",
                      "/noractivy",
                      "/voucher",
                      "/prefectact",
                      "/wintermarket",
                      "/wintergprs",
                      "/springmarket",
                      "/privilege",
                      "/springcredit",
                      "/privileges",
                      "/subact",
                      "/privilegeDec",
                      "privilegeSQ",
                      "noneact",
                      "offline",
                      "telecomday",
                    ],
                    B = 0;
                  B < R.length;
                  B++
                )
                  if (N.indexOf(R[B]) > 0) return void P(y, null, N);
                var F = w.getParameter("token"),
                  J = "https://shop.10086.cn/i/v1/auth/getArtifact";
                if (
                  (N.indexOf("gray") > -1 &&
                    (J = "https://shop.10086.cn/i/gray/v1/auth/getArtifact"),
                  (J +=
                    "?channelID=12003&backUrl=" +
                    encodeURIComponent(N) +
                    "&token="),
                  F)
                )
                  return void (window.location.href = J + F);
                if (N.indexOf(".html") > -1 && -1 == N.indexOf("index.html"))
                  return void (window.location.href =
                    "ssofail" == $.cookie("ssoFail")
                      ? h.getToLoginaddr() + N.substr(h.getWebAddress().length)
                      : h.getLoginaddr() + N.substr(h.getWebAddress().length));
                if (
                  ("undefined" == typeof A &&
                    (A = new c(location.href).getQueryParamValue("f")),
                  null != A && v.inArray(A, h.getNologinFun()))
                )
                  return void P(y, A);
                if ("location" in a) top.location.href = a.location;
                else {
                  var U = "";
                  if (
                    ((U = null != A && g.isMenuItem(A) ? "?f=" + A : "?f=home"),
                    U.indexOf("?f=home") > -1)
                  ) {
                    var L = top.location.href;
                    if (L.indexOf("?") > -1) {
                      var Q = new c(location.href).getQueryParamValue("f");
                      top.location.href = g.isMenuItem(Q)
                        ? L + "&f=home"
                        : L.substr(0, L.indexOf("?")) + U;
                    } else top.location.href = L + "?f=home";
                  } else
                    window.location.href =
                      "ssofail" == $.cookie("ssoFail")
                        ? h.getToLoginaddr() + U
                        : h.getLoginaddr() + U;
                }
                break;
              case 500005:
                var H = require("pluspop");
                H.warn(
                  "哎呀，当前系统出了点儿问题，稍后再试试吧~",
                  function () {
                    return (top.location.href = h.getWebAddress()), !0;
                  }
                );
                break;
              case 500008:
                top.location.href = h.getWebAddress();
                break;
              case 999997:
                window.location.href =
                  "https://touch.10086.cn/i/sysuprade/msysuprade.html";
                break;
              case 500010:
                var H = require("pluspop");
                H.warn("您的账号已登录超时，请重新登录", function () {
                  return (top.location.href = h.getLoginaddr()), !0;
                });
                break;
              case 500020:
                top.location.href = h.getWebAddress() + "error/build.html";
                break;
              case 500011:
                "function" == typeof b || "object" == typeof b
                  ? (M(_, -1), b(a.retCode, a.retMsg, a.sOperTime))
                  : E(a, _);
                break;
              default:
                if ("function" == typeof b || "object" == typeof b) {
                  if ((M(_, -1), "550026" == a.retCode))
                    try {
                      if (a.data && a.data.hasOwnProperty("outParam")) {
                        var W = utf8to16(base64decode(a.data.outParam)).replace(
                          /\s*/g,
                          ""
                        );
                        try {
                          var z = v.getDAesString(W, k, k);
                          a.data = JSON.parse(
                            z && z.length > 0 && W && W.length > 0 ? z : W
                          );
                        } catch (I) {
                          a.data = JSON.parse(W);
                        }
                      }
                    } catch (e) {}
                  b(a.retCode, a.retMsg, a.sOperTime, a.data);
                } else E(a, _);
            }
          }
        },
        P = function (a, c, h) {
          require(["cookie", "stcDic"], function (v, g) {
            var y = $.cookie("is_login"),
              b = $.cookie("jsessionid-echd-cpt-cmcc-jt");
            if ("undefined" != typeof y && "undefined" == typeof b) {
              var _ = "";
              null != c
                ? ((_ = "?f=" + c),
                  "ssofail" == $.cookie("ssoFail")
                    ? (window.location.href = g.getToLoginaddr() + _)
                    : (top.location.href = g.getLoginaddr() + _))
                : "undefined" != typeof h && h.indexOf("/item") > 0
                ? "ssofail" == $.cookie("ssoFail")
                  ? (window.location.href = g.getloginAddress() + h)
                  : (top.location.href = g.getPreAddress() + h)
                : "ssofail" == $.cookie("ssoFail")
                ? (window.location.href = h
                    ? g.getloginAddress() + h
                    : g.getToLoginaddr() + _)
                : (top.location.href = h
                    ? g.getPreAddress() + h
                    : g.getLoginaddr() + _);
            } else
              ("function" == typeof a || "object" == typeof a) &&
                a({ loginValue: "游客", userType: "2" });
          });
        },
        M = function (a, c) {
          if ("undefined" != typeof a && null != a)
            if ("true" == a.flag)
              switch (c) {
                case 0:
                  stcEcode.eventTrack("20", a.inx);
                  break;
                case 1:
                  stcEcode.eventTrack("99", a.inx);
                  break;
                case -1:
                  stcEcode.eventTrack("-99", a.inx);
              }
            else
              switch (c) {
                case 0:
                  stcEcode.commTrack(a.eventCode, !1);
                  break;
                case 1:
                  stcEcode.commTrack(a.eventCode + "Success", !1);
                  break;
                case -1:
                  stcEcode.commTrack(a.eventCode + "Fail", !1);
              }
        },
        E = function (a, c) {
          M(c, -1);
          var h = require("pluspop");
          h.warn("出错啦：" + a.retMsg, function () {});
        };
      return (
        (_.callrest = function (h, v, g) {
          h = y + h;
          var b = new c(h);
          a.getJson(
            b.toString(),
            function (a) {
              v(a);
            },
            g
          );
        }),
        (_.postrest = function (h, v, g) {
          h = y + h;
          var b = new c(h);
          a.postJson(
            b.toString(),
            function (a) {
              v(a);
            },
            g
          );
        }),
        (_.callpoprest = function (a, c, h, v) {
          (a = y + a),
            (v = v ? optpye : ""),
            Pop.process(" 加载中，请稍后..."),
            _.callrest(
              a,
              function (a) {
                Pop.stopprocess(),
                  0 != a.retCode
                    ? (Pop.error(a.retMsg, function (a) {}),
                      chaMa("IQ_GCCX", "-99", ""))
                    : (chaMa("IQ_GCCX", "99", ""), h(a));
              },
              c
            );
        }),
        (_.GET = function (h, v, g, b, _, w) {
          (h = y + h), (h = C(h)), (v = S(v, "get", h));
          var k = new c(h);
          a.getJson(
            k.toString(),
            function (a) {
              "1" == a.result && "0001" == a.retCode
                ? ("function" == typeof _ || "object" == typeof _) &&
                  (0 == parseInt(a.code)
                    ? _(a.retCode, a.retMsg)
                    : _(a.code, a.retMsg))
                : O(a, g, b, w, h);
            },
            v,
            function (a) {
              a.setRequestHeader("pragma", "no-cache"),
                a.setRequestHeader(
                  "Cache-Control",
                  "no-store, must-revalidate"
                ),
                a.setRequestHeader("expires", "0"),
                a.setRequestHeader("If-Modified-Since", "0"),
                M(w, 0);
            },
            function (a) {
              if (-1 != h.indexOf("v1/auth/loginfo")) {
                var v = new c(location.href).getQueryParamValue("f"),
                  g = { funCode: "999002", operDesc: v },
                  y = require("stclog");
                y.info(null, g),
                  ("function" == typeof b || "object" == typeof b) && b(a);
              }
            }
          );
        }),
        (_.HTTPSGET = function (v, g, b, _, w, k) {
          (v = h.getWebHttpsAddress() + y + v),
            (v = C(v)),
            (g = S(g, "get", v));
          var $ = new c(v);
          a.getJsonp(
            $.toString(),
            function (a) {
              "1" == a.result && "0001" == a.retCode
                ? ("function" == typeof w || "object" == typeof w) &&
                  (0 == parseInt(a.code)
                    ? w(a.retCode, a.retMsg)
                    : w(a.code, a.retMsg))
                : O(a, b, _, k, v);
            },
            g,
            function () {
              M(k, 0);
            },
            function () {}
          );
        }),
        (_.POST = function (h, v, g, b, _, w) {
          (h = y + h), (h = C(h)), (v = S(v, "post", h));
          var k = new c(h);
          a.postJson(
            k.toString(),
            function (a) {
              "1" == a.result && "0001" == a.retCode
                ? ("function" == typeof _ || "object" == typeof _) &&
                  (0 == parseInt(a.code)
                    ? _(a.retCode, a.retMsg)
                    : _(a.code, a.retMsg))
                : O(a, g, b, w, h);
            },
            v,
            function () {
              M(w, 0);
            }
          );
        }),
        (_.ASYNCPOST = function (h, v, g, b, _, w) {
          (h = y + h), (h = C(h)), (v = S(v, "post", h));
          var k = new c(h);
          a.postJsonAsync(
            k.toString(),
            function (a) {
              "1" == a.result && "0001" == a.retCode
                ? ("function" == typeof _ || "object" == typeof _) &&
                  (0 == parseInt(a.code)
                    ? _(a.retCode, a.retMsg)
                    : _(a.code, a.retMsg))
                : O(a, g, b, w, h);
            },
            v,
            function () {
              M(w, 0);
            }
          );
        }),
        (_.PUT = function (h, v, g, b, _, w) {
          (h = y + h), (h = C(h)), (v = S(v, "put", h));
          var k = new c(h);
          a.putJson(
            k.toString(),
            function (a) {
              "1" == a.result && "0001" == a.retCode
                ? ("function" == typeof _ || "object" == typeof _) &&
                  (0 == parseInt(a.code)
                    ? _(a.retCode, a.retMsg)
                    : _(a.code, a.retMsg))
                : O(a, g, b, w, h);
            },
            v,
            function () {
              M(w, 0);
            }
          );
        }),
        (_.DELETE = function (h, v, g, b, _, w) {
          (h = y + h), (h = C(h)), (v = S(v, "delete", h));
          var k = new c(h);
          a.deleteJson(
            k.toString(),
            function (a) {
              "1" == a.result && "0001" == a.retCode
                ? ("function" == typeof _ || "object" == typeof _) &&
                  (0 == parseInt(a.code)
                    ? _(a.retCode, a.retMsg)
                    : _(a.code, a.retMsg))
                : O(a, g, b, w, h);
            },
            v,
            function () {
              M(w, 0);
            }
          );
        }),
        _
      );
    }
  ),
  define("stcDic", function () {
    var a = "0",
      c = "O",
      h = "P",
      v = "T",
      g = "Q",
      y = "F",
      b = "M",
      _ = "W",
      w = "B",
      k = "SB",
      C = "PP",
      S = "CC",
      O = [];
    (O.WA = "待激活"), (O.AD = "已激活"), (O.OA = "超时未激活");
    var P = [];
    (P[1] = "部分退款"), (P[2] = "取消订单退款"), (P[3] = "退货退款");
    var M = [];
    (M[1] = "协商一致退款"),
      (M[2] = "产品质量问题"),
      (M[3] = "价格标错"),
      (M[3] = "其它");
    var E = [];
    (E.QP = "质量问题"),
      (E.NR = "无理由退货"),
      (E.NG = "协调一致退货"),
      (E.OR = "其它理由"),
      (E.LD = "物流损坏"),
      (E.MA = "缺少附件"),
      (E.NM = "商品实物配置与网站描述不符");
    var D = [];
    (D.O = "正常订单"),
      (D.R = "退货订单"),
      (D.P = "0元预售"),
      (D.T = "0元预售确认订单"),
      (D.Q = "全额预售"),
      (D.F = "退款订单");
    var j = "PP",
      I = "PC",
      T = "PK",
      A = "PD",
      N = "PS",
      R = "SS",
      B = "CL",
      F = "MS",
      J = "PE",
      U = "20000",
      L = "60000",
      Q = "29000",
      H = "SP",
      W = "50000",
      z = "70000",
      G = [];
    (G.PPC = "待商户确认"),
      (G.PFC = "商户已确认"),
      (G.PIP = "安装中"),
      (G.PSS = "已完成"),
      (G.PCL = "已取消");
    var Y = [];
    Y["01"] = "身份证";
    var V = [];
    (V.PP = "待付款"),
      (V.CH = "待合约办理"),
      (V.PC = "待发货"),
      (V.NP = "待发货"),
      (V.PK = "待发货"),
      (V.PD = "待发货"),
      (V.IC = "待发货"),
      (V.MF = "待发货"),
      (V.IM = "待发货"),
      (V.BF = "待发货"),
      (V.PS = "待签收"),
      (V.SS = "已完成"),
      (V.OT = "过期关闭"),
      (V.PA = "待退款"),
      (V.RA = "退货待审核"),
      (V.PR = "待退款"),
      (V.CA = "取消待审核"),
      (V.CL = "已取消"),
      (V.MS = "订金已支付"),
      (V.PE = "待付订金"),
      (orderstatusshipped = ["PC", "NP", "PK", "PD", "IC", "MF", "IM", "BF"]);
    var X = "WB",
      Z = "CB",
      K = "PBF";
    (V.WB = "待付尾款"),
      (V.CB = "待付尾款"),
      (V.PBF = "活动已结束"),
      (V.BS = "购买成功");
    var et = [];
    (et[1] = "个人"), (et[2] = "单位");
    var tt = "SP",
      nt = [];
    (nt.SP = "营业厅自提"), (nt.ED = "快递");
    var it = [];
    (it.OP = "在线支付"),
      (it.CD = "货到付款"),
      (it.ZP = "无预约金"),
      (it.PP = "AI豆混合支付");
    var at = [];
    (at.SP = "待支付"),
      (at.SS = "支付成功"),
      (at.SF = "支付失败"),
      (at.RP = "待退款"),
      (at.RS = "退款成功"),
      (at.RF = "退款失败"),
      (at.TO = "超时撤销");
    var ot = [];
    (ot.CO = "用户线上取消"),
      (ot.CC = "商户外呼退单"),
      (ot.OS = "缺货退单"),
      (ot.CD = "无法配送"),
      (ot.DF = "配送失败退单"),
      (ot.UC = "用户拒收"),
      (ot.TO = "超时未支付退单"),
      (ot.IC = "审核不通过"),
      (ot.YC = "预售确认超时取消");
    var st = [];
    (st["01"] = "现在不想购买"),
      (st["02"] = "信息填写错误，重新拍"),
      (st["03"] = "拍错了"),
      (st["04"] = "重复下单"),
      (st["05"] = "更换或添加商品"),
      (st["06"] = "变更合约信息"),
      (st["07"] = "发票信息有误/发票未开"),
      (st["08"] = "付款遇到问题（如余额不足、不知道怎么付款等）"),
      (st["09"] = "在别处找到价格更低的商品"),
      (st[13] = "其他");
    var ct = [];
    (ct[1] = "EMS"),
      (ct[2] = "顺丰快递"),
      (ct[3] = "宅急送"),
      (ct[4] = "圆通快递"),
      (ct[5] = "申通快递"),
      (ct[6] = "中通快递"),
      (ct[7] = "韵达快递"),
      (ct[8] = "天天快递"),
      (ct[9] = "汇通快递"),
      (ct[10] = "优速快递"),
      (ct[11] = "德邦物流"),
      (ct[12] = "全峰快递"),
      (ct[13] = "信丰物流"),
      (ct[14] = "国通快递"),
      (ct[15] = "港中能达快递"),
      (ct[16] = "快捷快递"),
      (ct[17] = "联昊通快递"),
      (ct[18] = "速尔快递"),
      (ct[19] = "如风达快递"),
      (ct[20] = "新邦物流"),
      (ct[21] = "佳怡物流"),
      (ct[22] = "安捷速递"),
      (ct[23] = "龙邦快件"),
      (ct[24] = "民邦速递"),
      (ct[25] = "全一快递"),
      (ct[26] = "邮政"),
      (ct[27] = "贵州年华科技有限公司"),
      (ct[28] = "中捷通信服务公司"),
      (ct[29] = "上海陆上货运交易中心有限公司"),
      (ct[30] = "埃瑞普"),
      (ct[31] = "深圳兆航"),
      (ct[32] = "深圳飞函"),
      (ct[33] = "广东南都"),
      (ct[34] = "鸿讯"),
      (ct[35] = "德若谷"),
      (ct[36] = "重报物流"),
      (ct[37] = "省仓广信"),
      (ct[38] = "黄马甲"),
      (ct[39] = "深圳欧唯特物流服务有限公司"),
      (ct[40] = "京东快递"),
      (ct[41] = "西安嘉祥汽车服务有限公司");
    var ut = [];
    (ut.DY = "白天"),
      (ut.NT = "晚上"),
      (ut.WD = "工作日白天"),
      (ut.WN = "工作日晚天"),
      (ut.ED = "周末白天"),
      (ut.EN = "周末晚上"),
      (ut.NL = "不限");
    var lt = [];
    (lt[1] = "立即开通"), (lt[2] = "次月开通"), (lt[3] = "次日开通");
    var dt = [];
    (dt[99] = "全国"),
      (dt[100] = "北京"),
      (dt[200] = "广东"),
      (dt[210] = "上海"),
      (dt[220] = "天津"),
      (dt[230] = "重庆"),
      (dt[311] = "河北"),
      (dt[351] = "山西"),
      (dt[371] = "河南"),
      (dt[240] = "辽宁"),
      (dt[431] = "吉林"),
      (dt[451] = "黑龙江"),
      (dt[471] = "内蒙古"),
      (dt[250] = "江苏"),
      (dt[531] = "山东"),
      (dt[551] = "安徽"),
      (dt[571] = "浙江"),
      (dt[591] = "福建"),
      (dt[270] = "湖北"),
      (dt[731] = "湖南"),
      (dt[771] = "广西"),
      (dt[791] = "江西"),
      (dt[280] = "四川"),
      (dt[851] = "贵州"),
      (dt[871] = "云南"),
      (dt[891] = "西藏"),
      (dt[290] = "陕西"),
      (dt[931] = "甘肃"),
      (dt[951] = "宁夏"),
      (dt[898] = "海南"),
      (dt[971] = "青海"),
      (dt[851] = "贵州"),
      (dt[991] = "新疆");
    var pt = [];
    (pt[100] = "BJ"),
      (pt[200] = "GD"),
      (pt[210] = "SH"),
      (pt[220] = "TJ"),
      (pt[230] = "CQ"),
      (pt[311] = "HE"),
      (pt[351] = "SX"),
      (pt[371] = "HA"),
      (pt[240] = "LN"),
      (pt[431] = "JL"),
      (pt[451] = "HLJ"),
      (pt[471] = "NMG"),
      (pt[250] = "JS"),
      (pt[531] = "SD"),
      (pt[551] = "AH"),
      (pt[571] = "ZJ"),
      (pt[591] = "FJ"),
      (pt[270] = "HB"),
      (pt[731] = "HN"),
      (pt[771] = "GX"),
      (pt[791] = "JX"),
      (pt[280] = "SC"),
      (pt[851] = "GZ"),
      (pt[871] = "YN"),
      (pt[891] = "XZ"),
      (pt[290] = "SN"),
      (pt[931] = "GS"),
      (pt[951] = "NX"),
      (pt[898] = "HI"),
      (pt[971] = "QH"),
      (pt[991] = "XJ");
    var ft = [];
    (ft["001"] = "水费"),
      (ft["002"] = "电费"),
      (ft["003"] = "燃气费"),
      (ft["004"] = "通讯费"),
      (ft["005"] = "有线电视"),
      (ft["006"] = "供暖费"),
      (ft["007"] = "医保费"),
      (ft["008"] = "便民卡"),
      (ft["009"] = "公交充值");
    var ht = [];
    (ht[0] = "未支付"),
      (ht[1] = "交费成功"),
      (ht[2] = "交费失败"),
      (ht[3] = "订单处理中"),
      (ht[4] = "未查询到订单"),
      (ht[5] = "已退费"),
      (ht[6] = "已支付");
    var vt = "http:";
    vt = window.location.protocol;
    var mt = vt + "//shop.10086.cn/order/topay.php",
      gt = vt + "//shop.10086.cn/",
      yt = "https://login.10086.cn/SSOCheck.action?channelID=12002&backUrl=",
      bt =
        "https://login.10086.cn/SSOCheck.action?channelID=12002&backUrl=" + gt,
      _t = "http://img2.shop.10086.cn/i/",
      wt =
        "https://wx.10086.cn/website/customerService/auth/1xDIjFOZfa97OZcnFodkHcdNqkq8eGtJ?ext=",
      kt =
        "https://wx.10086.cn/website/customerService/auth/JNJaNFso8ZZHcARDsPYwmwM3ulEctUyp",
      xt =
        vt +
        "//shop.10086.cn/ac/livechat-web-client/robertIndex?&channelType=1021&code=BS",
      Ct = vt + "//shop.10086.cn/order/shoplist.php",
      $t = vt + "//shop.10086.cn/iphone/quanyi/index.html",
      St = vt + "//img1.shop.10086.cn",
      Ot = "http://shop.10086.cn/hd/winter",
      Pt = vt + "//shop.10086.cn/hd",
      Mt = "https://shop.10086.cn",
      qt = vt + "//shop.10086.cn/i/",
      Et = "https://login.10086.cn/SSOCheck.action?channelID=12003&backUrl=",
      Dt = "https://login.10086.cn/login.html?channelID=12003&backUrl=",
      jt = Et + qt,
      It = Dt + qt,
      Tt =
        "https://login.10086.cn/html/window/loginMini.html?channelID=12003&backUrl=",
      At = Tt + qt + "sso.html",
      Nt = "https://app.10086.cn/activity/star_pc/star_pc.html",
      Rt = [];
    (Rt.qq = "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey"),
      (Rt.ss = "http://service.weibo.com/share/share.php");
    var Bt = [];
    (Bt[0] = "未支付"),
      (Bt[1] = "未支付"),
      (Bt[2] = "支付成功"),
      (Bt[3] = "支付失败"),
      (Bt[4] = "充值成功"),
      (Bt[5] = "充值失败");
    var Ft = [];
    (Ft[0] = "准备退款"),
      (Ft[1] = "退款成功"),
      (Ft[2] = "退款失败"),
      (Ft[3] = "退款成功"),
      (Ft[4] = "退款请求处理中"),
      (Ft[5] = "退款待审核"),
      (Ft[6] = "退款审核驳回");
    var Jt = [];
    (Jt[1] = "购机送话费"), (Jt[2] = "充值送手机"), (Jt[3] = "其它");
    var Ut = [];
    (Ut[1] = "送"),
      (Ut[3] = "惠"),
      (Ut[10] = "送"),
      (Ut[11] = "减"),
      (Ut[13] = "降"),
      (Ut[14] = "折");
    var Lt = [
        "home",
        "vouchercent",
        "mycoupons",
        "rechargejf",
        "rechargelove",
        "rechargeinterofth",
        "recharges",
        "rechargecard",
        "belongqry",
        "recharge1111",
        "rechargeurecord",
        "noticeinfo",
        "rechargelife",
        "billqry",
        "billdetailqry",
        "packremainqry",
        "busiqrydeal",
        "pointqry",
        "recharhisqry",
        "myorders",
        "mypreorders",
        "rechargerecord",
        "myfav",
        "rechargegroup",
        "broadBandMsg",
        "newBroadBandOrder",
        "clientorders",
        "clientreturn",
        "returnorderqry",
        "familyorder",
      ],
      Qt = { loginValue: "游客", userType: "2" },
      Ht = {
        remark: null,
        menu: [
          {
            remark: null,
            funcode: "070000",
            name: "个人中心",
            visiable: "1",
            child: [],
          },
          {
            remark: null,
            funcode: "040000",
            name: "交话费",
            visiable: "1",
            child: [
              { funcode: "040100", name: "在线充值", remark: null },
              { funcode: "040200", name: "充值卡充值", remark: null },
              { funcode: "040500", name: "充流量", remark: null },
              { funcode: "040600", name: "物联网充值", remark: null },
              { funcode: "040900", inx: "rechargelife", name: "生活缴费" },
              { funcode: "042000", inx: "rechargebroband", name: "宽带充值" },
              { funcode: "044000", inx: "rechargelandline", name: "固话充值" },
            ],
          },
          {
            remark: null,
            funcode: "020000",
            name: "我的账户",
            visiable: "1",
            child: [
              { funcode: "020200", name: "我的卡券", remark: null },
              { funcode: "020600", name: "账单查询", remark: null },
              { funcode: "020700", name: "详单查询", remark: null },
              { funcode: "020400", name: "套餐余量查询", remark: null },
              { funcode: "021400", name: "流量账单查询", remark: null },
              { funcode: "020900", name: "业务查询退订", remark: null },
              { funcode: "020300", name: "AI豆明细查询", remark: null },
              { funcode: "020500", name: "交费记录查询", remark: null },
              { funcode: "021000", name: "归属地查询", remark: null },
              { funcode: "021100", name: "赠送与返回话费查询", remark: null },
              {
                funcode: "021500",
                name: "呼死你-防护业务设置查询",
                remark: null,
              },
              { funcode: "021200", name: "发表评论", remark: null },
              { funcode: "021400", name: "流量账单", remark: null },
            ],
          },
          {
            remark: null,
            funcode: "140000",
            name: "我的信息",
            visiable: "1",
            child: [
              { funcode: "020800", name: "个人信息", remark: null },
              { funcode: "010300", name: "收货地址", remark: null },
              { funcode: "010200", name: "发票信息", remark: null },
              { funcode: "011000", name: "星级专区", remark: null },
              { funcode: "060500", name: "安全设置", remark: null },
            ],
          },
          {
            remark: null,
            funcode: "010000",
            name: "我的订单",
            visiable: "1",
            child: [
              { funcode: "010600", name: "商品订单", remark: null },
              { funcode: "010700", name: "预购订单", remark: null },
              { funcode: "010800", name: "充值订单", remark: null },
              { funcode: "011100", name: "生活缴费记录查询", remark: null },
              { funcode: "011300", name: "宽带预约订单", remark: null },
              { funcode: "010400", name: "我的收藏", remark: null },
              { funcode: "021800", name: "我的宽带", remark: null },
              { funcode: "011500", name: "宽带订单", remark: null },
            ],
          },
          {
            remark: null,
            funcode: "150000",
            name: "我的消息",
            visiable: "1",
            child: [
              { funcode: "150100", name: "消息订阅", remark: null },
              { funcode: "150200", name: "消息提醒设置", remark: null },
              { funcode: "150300", name: "消息查看", remark: null },
            ],
          },
          {
            remark: null,
            funcode: "080000",
            name: "特色专区",
            visiable: "1",
            child: [
              { funcode: "080001", name: "紧急开机", remark: null },
              { funcode: "080002", name: "担保开机", remark: null },
              { funcode: "080003", name: "手机报停", remark: null },
              { funcode: "080004", name: "呼叫转移设置", remark: null },
              { funcode: "080005", name: "呼叫等待", remark: null },
              { funcode: "080006", name: "密码服务", remark: null },
              { funcode: "080007", name: "停开机", remark: null },
              { funcode: "080008", name: "亲情网流量共享", remark: null },
              { funcode: "080009", name: "sp业务查询", remark: null },
              { funcode: "080010", name: "sp增值服务商查询", remark: null },
              { funcode: "080011", name: "充值卡延期", remark: null },
              { funcode: "080012", name: "手机/号卡商城", remark: null },
              { funcode: "080013", name: "AI豆兑换", remark: null },
              { funcode: "080014", name: "我的宽带", remark: null },
              { funcode: "080015", name: "维文网厅", remark: null },
              { funcode: "080016", name: "挂失/解挂", remark: null },
              { funcode: "080017", name: "流量提醒服务", remark: null },
              { funcode: "080018", name: "停开机", remark: null },
              { funcode: "080019", name: "4G服务开通", remark: null },
              { funcode: "080020", name: "来电显示", remark: null },
              { funcode: "080021", name: "呼叫保持", remark: null },
              { funcode: "080022", name: "呼叫等待", remark: null },
              { funcode: "080023", name: "三方通话", remark: null },
              { funcode: "080024", name: "GPRS", remark: null },
              { funcode: "080025", name: "订制话费信息", remark: null },
              { funcode: "080026", name: "商城订单", remark: null },
              { funcode: "080027", name: "客户星级评定查询", remark: null },
              { funcode: "080028", name: "订单查询", remark: null },
              { funcode: "080029", name: "彩铃", remark: null },
              { funcode: "080030", name: "电子发票", remark: null },
              { funcode: "080031", name: "我的订单", remark: null },
              { funcode: "080032", name: "广西亲情网", remark: null },
              { funcode: "080033", name: "营业厅预约选号", remark: null },
              { funcode: "080034", name: "实名制查询", remark: null },
              { funcode: "080035", name: "星级服务", remark: null },
              { funcode: "080036", name: "小区覆盖查询", remark: null },
              { funcode: "080037", name: "流量账单", remark: null },
              { funcode: "080038", name: "提醒设置", remark: null },
              { funcode: "080039", name: "多终端共享", remark: null },
            ],
          },
          {
            remark: null,
            funcode: "120000",
            name: "售后服务",
            visiable: "1",
            child: [
              { funcode: "120001", name: "退货申请/查询", remark: null },
              { funcode: "12000", name: "我的发票-广东", remark: null },
            ],
          },
          {
            remark: null,
            funcode: "130000",
            name: "我的邮箱",
            visiable: "1",
            child: [{ funcode: "130001", name: "139邮箱", remark: null }],
          },
        ],
        basic_menu: [
          { funcode: "040100", name: "在线充值", remark: null },
          { funcode: "010800", name: "充值订单", remark: null },
          { funcode: "010600", name: "商品订单", remark: null },
          { funcode: "010400", name: "我的收藏", remark: null },
          { funcode: "010700", name: "预购订单", remark: null },
          { funcode: "040200", name: "充值卡充值", remark: null },
        ],
        retCode: "000000",
        retMsg: "功能可见性查询成功！",
      },
      Wt = {
        data: {
          userSubs: { userId: "", phoneNo: "", email: "", channels: "" },
          busiSubs: [
            {
              busiCode: "1001",
              busiName: "发货提醒",
              busiType: "1",
              checked: "1",
            },
            {
              busiCode: "1002",
              busiName: "尾款支付提醒",
              busiType: "1",
              checked: "1",
            },
          ],
        },
      },
      zt = [];
    (zt["01"] = "套餐及固定费"),
      (zt["02"] = "套餐外语音费"),
      (zt["03"] = "套餐外上网费"),
      (zt["04"] = "套餐外短彩信费"),
      (zt["05"] = "增值业务费"),
      (zt["06"] = "代收费"),
      (zt["07"] = "其他费用"),
      (zt["09"] = "其他费用"),
      (zt[11] = "业务费用减免"),
      (zt[12] = "本月通信费优惠"),
      (zt[13] = "单位已代付"),
      (zt[14] = "本地退费"),
      (zt[15] = "他人代付"),
      (zt[16] = "代他人代付");
    var Gt = new Array();
    (Gt["01"] = "分钟"),
      (Gt["02"] = "条"),
      (Gt["03"] = "KB"),
      (Gt["04"] = "M"),
      (Gt["05"] = "G");
    var Yt = [];
    Yt[0] = "5";
    var Vt = "971",
      Xt = function () {
        var a = new Date(),
          c = a.getFullYear(),
          m = a.getMonth() + 1,
          d = a.getDate(),
          h = a.getHours(),
          v = a.getMinutes(),
          g = a.getSeconds(),
          y = c + "/" + m + "/" + d + " " + h + ":" + v + ":" + g,
          b = new Date(y),
          _ = new Date("2030/07/16 22:00:00"),
          w = [
            "1000001",
            "1000034",
            "1000049",
            "1000055",
            "1000068",
            "1000072",
            "1000073",
            "1000074",
            "1000079",
            "1000081",
            "1000082",
            "1000083",
            "1000087",
            "1000091",
            "1000064",
            "1000076",
            "1000002",
            "1000058",
            "1000086",
            "1000067",
            "1000035",
            "1000056",
            "1000048",
            "1000061",
            "1000078",
            "1000047",
            "1000071",
            "1000069",
            "1000063",
            "1000070",
            "1000075",
            "1000080",
            "1000065",
            "1000077",
            "1000066",
            "1000092",
            "1000093",
          ];
        return (
          Date.parse(_) >= Date.parse(b) &&
            (w = [
              "1000001",
              "1000034",
              "1000049",
              "1000055",
              "1000068",
              "1000072",
              "1000073",
              "1000074",
              "1000079",
              "1000081",
              "1000082",
              "1000083",
              "1000087",
              "1000091",
              "1000064",
              "1000076",
              "1000002",
              "1000058",
              "1000086",
              "1000067",
              "1000035",
              "1000056",
              "1000048",
              "1000061",
              "1000078",
              "1000047",
              "1000071",
              "1000069",
              "1000063",
              "1000070",
              "1000075",
              "1000080",
              "1000065",
              "1000077",
              "1000066",
              "1000092",
            ]),
          w
        );
      },
      Zt = "",
      Kt = Xt(),
      en = [];
    (en[971] = "1000001"),
      (en[250] = "1000002"),
      (en[451] = "1000034"),
      (en[791] = "1000035"),
      (en[311] = "1000047"),
      (en[591] = "1000048"),
      (en[351] = "1000055"),
      (en[290] = "1000056"),
      (en[531] = "1000058"),
      (en[200] = "1000061"),
      (en[731] = "1000063"),
      (en[100] = "1000064"),
      (en[210] = "1000065"),
      (en[220] = "1000066"),
      (en[230] = "1000067"),
      (en[240] = "1000068"),
      (en[270] = "1000069"),
      (en[280] = "1000070"),
      (en[371] = "1000071"),
      (en[431] = "1000072"),
      (en[471] = "1000073"),
      (en[851] = "1000074"),
      (en[891] = "1000075"),
      (en[898] = "1000076"),
      (en[871] = "1000077"),
      (en[771] = "1000078"),
      (en[551] = "1000079"),
      (en[571] = "1000080"),
      (en[931] = "1000081"),
      (en[951] = "1000082"),
      (en[991] = "1000083");
    var tn = {};
    (tn["01"] = "现金交费"),
      (tn["02"] = "充值卡充值"),
      (tn["03"] = "银行托收"),
      (tn["04"] = "营销活动预存受理"),
      (tn["05"] = "AI豆换话费业务受理"),
      (tn["06"] = "第三方支付"),
      (tn["07"] = "手机钱包"),
      (tn["08"] = "空中充值"),
      (tn["09"] = "代理商渠道办理"),
      (tn[10] = "批量冲销"),
      (tn[11] = "调账"),
      (tn[12] = "其他");
    var nn = {};
    (nn[10] = "rechargehf"),
      (nn[11] = "rechargegprs"),
      (nn[12] = "broadband"),
      (nn[13] = "invoice"),
      (nn[14] = "otherInvoice"),
      (nn[15] = "contrachphone");
    var rn = {};
    (rn["01"] = "营业厅"),
      (rn["02"] = "网上营业厅"),
      (rn["03"] = "掌上营业厅"),
      (rn["04"] = "短信营业厅"),
      (rn["05"] = "手机营业厅"),
      (rn["06"] = "自助终端"),
      (rn["07"] = "银行"),
      (rn["08"] = "空中充值"),
      (rn["09"] = "移动商城"),
      (rn[99] = "其他");
    var an = {};
    (an[0] = "不可开具"),
      (an[1] = "未开具"),
      (an[2] = "开具中"),
      (an[3] = "已开具"),
      (an[4] = "开具失败"),
      (an[5] = "冲红中"),
      (an[6] = "已冲红"),
      (an[7] = "冲红失败");
    var on = function () {
        var a = new Date(),
          c = a.getFullYear();
        (MM = a.getMonth() + 1),
          (dd = a.getDate()),
          (HH = a.getHours()),
          (mm = a.getMinutes()),
          (ss = a.getSeconds()),
          (mydate = c + "/" + MM + "/" + dd + " " + HH + ":" + mm + ":" + ss);
        var h = Date.parse(new Date("2016/12/12 00:00:00")),
          v = Date.parse(new Date("2016/12/13 00:00:00")),
          g = Date.parse(a),
          y = !1;
        return g >= h && v >= g && (y = !0), y;
      },
      sn = {};
    (sn[1] = "亲情网"),
      (sn[2] = "亲情网自付版"),
      (sn[3] = "国漫开通/关闭"),
      (sn[4] = "国漫业务办理"),
      (sn[5] = "增值业务"),
      (sn[6] = "家庭网"),
      (sn[7] = "主套餐业务变更"),
      (sn[8] = "查网龄送流量"),
      (sn[9] = "AI豆混合支付"),
      (sn[10] = "营销案"),
      (sn[11] = "5G融合套餐"),
      (sn[12] = "5G家庭套餐"),
      (sn[13] = "亲情网支付宝版月包"),
      (sn[14] = "亲情网支付宝版季包"),
      (sn[15] = "亲情网支付宝版年包"),
      (sn[16] = "亲情网异网版月包"),
      (sn[17] = "亲情网异网版季包"),
      (sn[18] = "亲情网异网版年包"),
      (sn[19] = "国漫自选产品办理"),
      (sn[20] = "咪咕彩铃业务办理"),
      (sn[21] = "AI豆倍享业务办理"),
      (sn[100] = "定向流量包"),
      (sn[101] = "普通流量包"),
      (sn[110] = "号卡"),
      (sn[120] = "套餐");
    var cn = {};
    (cn["00"] = "处理成功"),
      (cn["01"] = "未处理"),
      (cn["02"] = "处理中"),
      (cn["04"] = "处理失败 ");
    var un = {};
    (un[1] = "线上支付"),
      (un[2] = "货到付款"),
      (un[3] = "混合支付"),
      (un[4] = "代理商支付 "),
      (un[5] = "话费支付 ");
    var ln = [];
    (ln.PC = "待商户确认"),
      (ln.PD = "待商户发货"),
      (ln.PS = "代签收"),
      (ln.SS = "完成"),
      (ln.CA = "取消待审核"),
      (ln.CL = "已取消"),
      (ln.UA = "退订待审核"),
      (ln.US = "已退订");
    var dn = {};
    (dn["01"] = "分钟"),
      (dn["02"] = "MB"),
      (dn["03"] = "GB"),
      (dn["04"] = "条"),
      (dn["05"] = "其他");
    var pn = {};
    return (
      (pn["00"] = "全部（普通长期国际漫游）"),
      (pn["01"] = "语音，短信业务"),
      (pn["02"] = "数据业务"),
      (pn["03"] = "预付费香港漫游"),
      (pn["04"] = "预付费澳门漫游"),
      (pn["05"] = "预付费台湾漫游"),
      (pn["06"] = "预付费港澳台漫游"),
      (pn[10] = "30天国际漫游"),
      (pn[11] = "180天国际漫游"),
      {
        double12: function () {
          return on();
        },
        getWebHttpsAddress: function () {
          return Mt;
        },
        getProvOnlineForJf: function () {
          return Zt;
        },
        getPackUnits: function (a) {
          var c = "undefined" == Gt[a] ? "" : Gt[a];
          return c;
        },
        getBandStatus: function () {
          return G;
        },
        getOrderStatus: function (a) {
          var c = "undefined" == V[a] ? "" : V[a];
          return c;
        },
        getProjectId: function (a) {
          var c = "undefined" == ft[a] ? "" : ft[a];
          return c;
        },
        getLifeOrderStatus: function (a) {
          var c = "undefined" == ht[a] ? "" : ht[a];
          return c;
        },
        getOneSubjectName: function (a) {
          var c = "undefined" == zt[a] ? "" : zt[a];
          return c;
        },
        getProCode: function (a) {
          var c = "undefind" == dt[a] ? "" : dt[a];
          return c;
        },
        getAllProCode: function () {
          return dt;
        },
        getCret: function (a) {
          var c = "undefind" == Y[a] ? "" : Y[a];
          return c;
        },
        getPayway: function (a) {
          var c = "undefind" == it[a] ? "" : it[a];
          return c;
        },
        getPaystatus: function (a) {
          var c = "undefind" == at[a] ? "" : at[a];
          return c;
        },
        getCacelReason: function (a) {
          var c = st[a] ? st[a] : "";
          return c;
        },
        getDeliverway: function (a) {
          var c = "undefind" == nt[a] ? "" : nt[a];
          return c;
        },
        getPrefertime: function (a) {
          var c = "undefind" == ut[a] ? "" : ut[a];
          return c;
        },
        getEffecttime: function (a) {
          var c = "undefind" == lt[$.trim(a)] ? "" : lt[$.trim(a)];
          return c;
        },
        getLogicomcode: function (a) {
          var c = "undefind" == ct[a] ? "" : ct[a];
          return c;
        },
        getPromotype: function (a) {
          var c = "undefind" == Ut[a] ? "" : Ut[a];
          return c;
        },
        getInvoice: function (a) {
          var c = "undefind" == et[a] ? "" : et[a];
          return c;
        },
        getRefundtype: function (a) {
          var c = "undefind" == P[a] ? "" : P[a];
          return c;
        },
        getRefundStatus: function (a) {
          var c = "undefind" == O[a] ? "" : O[a];
          return c;
        },
        getReturnType: function (a) {
          var c = "undefind" == E[a] ? "" : E[a];
          return c;
        },
        getActiveStatus: function (a) {
          var c = "undefind" == E[a] ? "" : E[a];
          return c;
        },
        getLoginaddr: function () {
          return jt;
        },
        getToLoginaddr: function () {
          return It;
        },
        getWebAddress: function () {
          return qt;
        },
        getPreAddress: function () {
          return Et;
        },
        getNologinFun: function () {
          return Lt;
        },
        getNormalOrder: function () {
          return c;
        },
        getFatherOrder: function () {
          return b;
        },
        getNetselhallOrder: function () {
          return _;
        },
        getsbOrder: function () {
          return k;
        },
        getJfOrder: function () {
          return C;
        },
        getccOrder: function () {
          return S;
        },
        getBroadBandOrder: function () {
          return w;
        },
        getMobileUser: function () {
          return a;
        },
        getSim: function () {
          return U;
        },
        getNumcard: function () {
          return L;
        },
        getWaitpay: function () {
          return j;
        },
        getWaitsend: function () {
          return A;
        },
        getWaitsign: function () {
          return N;
        },
        getNosplit: function () {
          return H;
        },
        getParts: function () {
          return W;
        },
        getBarepager: function () {
          return z;
        },
        getWaitstock: function () {
          return T;
        },
        getWaitsure: function () {
          return I;
        },
        getFinish: function () {
          return R;
        },
        getClstatus: function () {
          return B;
        },
        getPreOrder: function () {
          return h;
        },
        getDeliveway_sp: function () {
          return tt;
        },
        getFullpayOrder: function () {
          return g;
        },
        getPresureOrder: function () {
          return v;
        },
        getDefaultMenu: function () {
          return $.extend(!0, {}, Ht);
        },
        getPaypre: function () {
          return J;
        },
        getMsstatus: function () {
          return F;
        },
        getWbstatus: function () {
          return X;
        },
        getCbstatus: function () {
          return Z;
        },
        getBostatus: function () {
          return K;
        },
        getShopPayUrl: function () {
          return mt;
        },
        getGoodstype_fourG: function () {
          return Q;
        },
        getRefundOrder: function () {
          return y;
        },
        getShopLink: function () {
          return bt;
        },
        getOrderOnlineUrl: function () {
          return wt;
        },
        getOrderOnlineUrlRight: function () {
          return kt;
        },
        getOrderRobotUrl: function () {
          return xt;
        },
        getChargeProd_jumpUrl: function () {
          return chargeProd_jumpUrl;
        },
        getMinLoginAddr: function () {
          return At;
        },
        getImgSerAddr: function () {
          return _t;
        },
        getShopSSO: function () {
          return yt;
        },
        getDefaultMsg: function () {
          return Wt;
        },
        getHiddenMenu: function () {
          return [];
        },
        getOrderStatusShipped: function () {
          return orderstatusshipped;
        },
        duanWu: function () {
          var a = new Date(),
            c = a.getFullYear(),
            m = a.getMonth() + 1,
            d = a.getDate(),
            h = a.getHours(),
            v = a.getMinutes(),
            g = a.getSeconds(),
            y = c + "/" + m + "/" + d + " " + h + ":" + v + ":" + g,
            b = new Date(y),
            _ = new Date("2017/10/01 00:00:00"),
            w = new Date("2017/10/08 23:59:59"),
            k = "1";
          return (
            Date.parse(_) <= Date.parse(b) &&
              Date.parse(b) <= Date.parse(w) &&
              (k = "0"),
            k
          );
        },
        bannerChange: function () {
          var a = new Date(),
            c = a.getFullYear(),
            m = a.getMonth() + 1,
            d = a.getDate(),
            h = a.getHours(),
            v = a.getMinutes(),
            g = a.getSeconds(),
            y = c + "/" + m + "/" + d + " " + h + ":" + v + ":" + g,
            b = new Date(y),
            _ = "1",
            w = new Date("2017/09/09 23:59:59"),
            k = new Date("2017/09/10 23:59:59");
          return (
            Date.parse(w) <= Date.parse(b) &&
              Date.parse(b) <= Date.parse(k) &&
              (_ = "0"),
            _
          );
        },
        backflowshow: function (a) {
          var c = new Date(),
            h = c.getFullYear(),
            m = c.getMonth() + 1,
            d = c.getDate(),
            v = c.getHours(),
            g = c.getMinutes(),
            y = c.getSeconds(),
            b = h + "/" + m + "/" + d + " " + v + ":" + g + ":" + y,
            _ = new Date(b),
            w = new Date("2018/01/01 00:00:00"),
            k = new Date("2018/03/31 23:59:59");
          Date.parse(w) <= Date.parse(_) &&
            Date.parse(_) <= Date.parse(k) &&
            ("731" == a
              ? ($(".bg-backflow").removeClass("none"),
                $(".bg-backflow").html("湖南客户使用和包快捷支付再送5元和包劵"))
              : $(".bg-backflow").addClass("none"));
        },
        backflowhide: function () {
          var a = new Date(),
            c = a.getFullYear(),
            m = a.getMonth() + 1,
            d = a.getDate(),
            h = a.getHours(),
            v = a.getMinutes(),
            g = a.getSeconds(),
            y = c + "/" + m + "/" + d + " " + h + ":" + v + ":" + g,
            b = new Date(y),
            _ = new Date("2018/01/01 00:00:00"),
            w = new Date("2018/03/31 23:59:59");
          Date.parse(_) <= Date.parse(b) &&
            Date.parse(b) <= Date.parse(w) &&
            $(".bg-backflow").addClass("none");
        },
        getShareUrl: function (a) {
          return encodeURI(Rt[a]);
        },
        getDefaultUserInfo: function () {
          return Qt;
        },
        getMarchantId: function () {
          return Kt;
        },
        getAspireShopId: function () {
          return en;
        },
        getPaysysProv: function () {
          return Vt;
        },
        cloneObj: function (a) {
          return $.extend(!0, {}, a);
        },
        shopping_car_url: function () {
          return Ct;
        },
        getShopAddress: function () {
          return gt;
        },
        getCheckStarAdd: function () {
          return Nt;
        },
        getSpecialurl: function () {
          return $t;
        },
        getCompPicAddr: function () {
          return St;
        },
        getPayTypeName: function () {
          return tn;
        },
        getQryTypeName: function () {
          return nn;
        },
        getChannelIdName: function () {
          return rn;
        },
        getWinterMarketHCaddr: function () {
          return Ot;
        },
        getOrderDrawingUrl: function () {
          return Pt;
        },
        getInvoiceStatus: function () {
          return an;
        },
        getloginAddress: function () {
          return Dt;
        },
        forceLogin: function () {
          return "https://login.10086.cn/login.html?channelID=12003&backUrl=http://shop.10086.cn/i/";
        },
        getProvCouponLink: function (a) {
          for (
            var c = [
                { provice: "591", link: "" },
                { provice: "351", link: "" },
                { provice: "001", link: "" },
              ],
              h = {},
              i = 0;
            i < c.length;
            i++
          )
            if (c[i].provice == a) {
              h = c[i];
              break;
            }
          return h;
        },
        getProtalStr: function () {
          return vt;
        },
        familyOrderSubType: function (a) {
          var c = sn[a] ? sn[a] : "";
          return c;
        },
        familyStatus: function (a) {
          var c = cn[a] ? cn[a] : "";
          return c;
        },
        familyPayWay: function (a) {
          var c = un[a] ? un[a] : "";
          return c;
        },
        outOrderstatus: function (a) {
          var c = ln[a] ? ln[a] : "";
          return c;
        },
        activityInfoUnit: function (a) {
          var c = dn[a] ? dn[a] : "";
          return c;
        },
        roamType: function (a) {
          var c = pn[a] ? pn[a] : "";
          return c;
        },
      }
    );
  });
