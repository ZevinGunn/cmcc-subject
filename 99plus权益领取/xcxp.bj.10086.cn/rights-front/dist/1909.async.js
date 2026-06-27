(self.webpackChunkrm_h5 = self.webpackChunkrm_h5 || []).push([
  ["1909"],
  {
    43941(n, t, r) {
      "use strict";
      var e = r(41486);
      t.A = function (n) {
        var t = (0, e.useRef)(n);
        return (t.current = n), t;
      };
    },
    54670(n, t, r) {
      "use strict";
      var e = r(41486),
        i = r(64176),
        o = r(3299);
      t.A = function (n) {
        o.A && (0, i.Tn)(n);
        var t = (0, e.useRef)(n);
        t.current = (0, e.useMemo)(
          function () {
            return n;
          },
          [n]
        );
        var r = (0, e.useRef)();
        return (
          r.current ||
            (r.current = function () {
              for (var n = [], r = 0; r < arguments.length; r++)
                n[r] = arguments[r];
              return t.current.apply(this, n);
            }),
          r.current
        );
      };
    },
    53219(n, t, r) {
      "use strict";
      var e = r(41486),
        i = r(64176),
        o = r(3299);
      t.A = function (n) {
        o.A && (0, i.Tn)(n),
          (0, e.useEffect)(function () {
            null == n || n();
          }, []);
      };
    },
    73508(n, t, r) {
      "use strict";
      r.d(t, { A: () => z });
      var e = r(5482),
        i = r(41486),
        o = r(67738),
        u = function (n, t) {
          var r = t.manual,
            u = t.ready,
            a = void 0 === u || u,
            c = t.defaultParams,
            s = void 0 === c ? [] : c,
            f = t.refreshDeps,
            l = void 0 === f ? [] : f,
            d = t.refreshDepsAction,
            v = (0, i.useRef)(!1);
          return (
            (v.current = !1),
            (0, o.A)(
              function () {
                !r &&
                  a &&
                  ((v.current = !0),
                  n.run.apply(
                    n,
                    (0, e.__spreadArray)([], (0, e.__read)(s), !1)
                  ));
              },
              [a]
            ),
            (0, o.A)(function () {
              v.current || r || ((v.current = !0), d ? d() : n.refresh());
            }, (0, e.__spreadArray)([], (0, e.__read)(l), !1)),
            {
              onBefore: function () {
                if (!a) return { stopNow: !0 };
              },
            }
          );
        };
      u.onInit = function (n) {
        var t = n.ready,
          r = void 0 === t || t;
        return { loading: !n.manual && r };
      };
      var a = u,
        c = r(56522);
      function s(n, t) {
        var r = (0, i.useRef)({
          deps: t,
          obj: void 0,
          initialized: !1,
        }).current;
        return (
          (!1 !== r.initialized && (0, c.A)(r.deps, t)) ||
            ((r.deps = t), (r.obj = n()), (r.initialized = !0)),
          r.obj
        );
      }
      var f = r(4958),
        l = new Map(),
        d = new Map(),
        v = {},
        p = function (n, t) {
          return (
            v[n] || (v[n] = []),
            v[n].push(t),
            function () {
              var r = v[n].indexOf(t);
              v[n].splice(r, 1);
            }
          );
        },
        h = function (n, t) {
          var r = t.cacheKey,
            o = t.cacheTime,
            u = void 0 === o ? 3e5 : o,
            a = t.staleTime,
            c = void 0 === a ? 0 : a,
            h = t.setCache,
            y = t.getCache,
            g = (0, i.useRef)(),
            _ = (0, i.useRef)(),
            m = function (n, t) {
              h
                ? h(t)
                : (function (n, t, r) {
                    var i = l.get(n);
                    (null == i ? void 0 : i.timer) && clearTimeout(i.timer);
                    var o = void 0;
                    t > -1 &&
                      (o = setTimeout(function () {
                        l.delete(n);
                      }, t)),
                      l.set(
                        n,
                        (0, e.__assign)((0, e.__assign)({}, r), { timer: o })
                      );
                  })(n, u, t),
                (function (n, t) {
                  v[n] &&
                    v[n].forEach(function (n) {
                      return n(t);
                    });
                })(n, t.data);
            },
            A = function (n, t) {
              return (
                void 0 === t && (t = []),
                y
                  ? y(t)
                  : (function (n) {
                      return l.get(n);
                    })(n)
              );
            };
          return (
            s(function () {
              if (r) {
                var t = A(r);
                t &&
                  Object.hasOwnProperty.call(t, "data") &&
                  ((n.state.data = t.data),
                  (n.state.params = t.params),
                  (-1 === c || new Date().getTime() - t.time <= c) &&
                    (n.state.loading = !1)),
                  (g.current = p(r, function (t) {
                    n.setState({ data: t });
                  }));
              }
            }, []),
            (0, f.A)(function () {
              var n;
              null === (n = g.current) || void 0 === n || n.call(g);
            }),
            r
              ? {
                  onBefore: function (n) {
                    var t = A(r, n);
                    return t && Object.hasOwnProperty.call(t, "data")
                      ? -1 === c || new Date().getTime() - t.time <= c
                        ? {
                            loading: !1,
                            data: null == t ? void 0 : t.data,
                            error: void 0,
                            returnNow: !0,
                          }
                        : { data: null == t ? void 0 : t.data, error: void 0 }
                      : {};
                  },
                  onRequest: function (n, t) {
                    var i = (function (n) {
                      return d.get(n);
                    })(r);
                    return (
                      (i && i !== _.current) ||
                        ((i = n.apply(
                          void 0,
                          (0, e.__spreadArray)([], (0, e.__read)(t), !1)
                        )),
                        (_.current = i),
                        (function (n, t) {
                          d.set(n, t),
                            t
                              .then(function (t) {
                                return d.delete(n), t;
                              })
                              .catch(function () {
                                d.delete(n);
                              });
                        })(r, i)),
                      { servicePromise: i }
                    );
                  },
                  onSuccess: function (t, e) {
                    var i;
                    r &&
                      (null === (i = g.current) || void 0 === i || i.call(g),
                      m(r, { data: t, params: e, time: new Date().getTime() }),
                      (g.current = p(r, function (t) {
                        n.setState({ data: t });
                      })));
                  },
                  onMutate: function (t) {
                    var e;
                    r &&
                      (null === (e = g.current) || void 0 === e || e.call(g),
                      m(r, {
                        data: t,
                        params: n.state.params,
                        time: new Date().getTime(),
                      }),
                      (g.current = p(r, function (t) {
                        n.setState({ data: t });
                      })));
                  },
                }
              : {}
          );
        },
        y = r(82645),
        g = r.n(y),
        _ = function (n, t) {
          var r = t.debounceWait,
            o = t.debounceLeading,
            u = t.debounceTrailing,
            a = t.debounceMaxWait,
            c = (0, i.useRef)(),
            s = (0, i.useMemo)(
              function () {
                var n = {};
                return (
                  void 0 !== o && (n.leading = o),
                  void 0 !== u && (n.trailing = u),
                  void 0 !== a && (n.maxWait = a),
                  n
                );
              },
              [o, u, a]
            );
          return (
            (0, i.useEffect)(
              function () {
                if (r) {
                  var t = n.runAsync.bind(n);
                  return (
                    (c.current = g()(
                      function (n) {
                        n();
                      },
                      r,
                      s
                    )),
                    (n.runAsync = function () {
                      for (var n = [], r = 0; r < arguments.length; r++)
                        n[r] = arguments[r];
                      return new Promise(function (r, i) {
                        var o;
                        null === (o = c.current) ||
                          void 0 === o ||
                          o.call(c, function () {
                            t.apply(
                              void 0,
                              (0, e.__spreadArray)([], (0, e.__read)(n), !1)
                            )
                              .then(r)
                              .catch(i);
                          });
                      });
                    }),
                    function () {
                      var r;
                      null === (r = c.current) || void 0 === r || r.cancel(),
                        (n.runAsync = t);
                    }
                  );
                }
              },
              [r, s]
            ),
            r
              ? {
                  onCancel: function () {
                    var n;
                    null === (n = c.current) || void 0 === n || n.cancel();
                  },
                }
              : {}
          );
        },
        m = function (n, t) {
          var r = t.loadingDelay,
            e = t.ready,
            o = (0, i.useRef)();
          if (!r) return {};
          var u = function () {
            o.current && clearTimeout(o.current);
          };
          return {
            onBefore: function () {
              return (
                u(),
                !1 !== e &&
                  (o.current = setTimeout(function () {
                    n.setState({ loading: !0 });
                  }, r)),
                { loading: !1 }
              );
            },
            onFinally: function () {
              u();
            },
            onCancel: function () {
              u();
            },
          };
        },
        A = r(28700);
      function b() {
        return !A.A || "hidden" !== document.visibilityState;
      }
      var w = [];
      if (A.A) {
        window.addEventListener(
          "visibilitychange",
          function () {
            if (b())
              for (var n = 0; n < w.length; n++) {
                (0, w[n])();
              }
          },
          !1
        );
      }
      var T = function (n) {
          return (
            w.push(n),
            function () {
              var t = w.indexOf(n);
              w.splice(t, 1);
            }
          );
        },
        x = function (n, t) {
          var r = t.pollingInterval,
            e = t.pollingWhenHidden,
            u = void 0 === e || e,
            a = t.pollingErrorRetryCount,
            c = void 0 === a ? -1 : a,
            s = (0, i.useRef)(),
            f = (0, i.useRef)(),
            l = (0, i.useRef)(0),
            d = function () {
              var n;
              s.current && clearTimeout(s.current),
                null === (n = f.current) || void 0 === n || n.call(f);
            };
          return (
            (0, o.A)(
              function () {
                r || d();
              },
              [r]
            ),
            r
              ? {
                  onBefore: function () {
                    d();
                  },
                  onError: function () {
                    l.current += 1;
                  },
                  onSuccess: function () {
                    l.current = 0;
                  },
                  onFinally: function () {
                    -1 === c || (-1 !== c && l.current <= c)
                      ? (s.current = setTimeout(function () {
                          u || b()
                            ? n.refresh()
                            : (f.current = T(function () {
                                n.refresh();
                              }));
                        }, r))
                      : (l.current = 0);
                  },
                  onCancel: function () {
                    d();
                  },
                }
              : {}
          );
        };
      var j = [];
      if (A.A) {
        var P = function () {
          if (b() && (!A.A || void 0 === navigator.onLine || navigator.onLine))
            for (var n = 0; n < j.length; n++) {
              (0, j[n])();
            }
        };
        window.addEventListener("visibilitychange", P, !1),
          window.addEventListener("focus", P, !1);
      }
      var R = function (n) {
          return (
            j.push(n),
            function () {
              var t = j.indexOf(n);
              t > -1 && j.splice(t, 1);
            }
          );
        },
        S = function (n, t) {
          var r = t.refreshOnWindowFocus,
            o = t.focusTimespan,
            u = void 0 === o ? 5e3 : o,
            a = (0, i.useRef)(),
            c = function () {
              var n;
              null === (n = a.current) || void 0 === n || n.call(a);
            };
          return (
            (0, i.useEffect)(
              function () {
                if (r) {
                  var t =
                    ((i = n.refresh.bind(n)),
                    (o = u),
                    (s = !1),
                    function () {
                      for (var n = [], t = 0; t < arguments.length; t++)
                        n[t] = arguments[t];
                      s ||
                        ((s = !0),
                        i.apply(
                          void 0,
                          (0, e.__spreadArray)([], (0, e.__read)(n), !1)
                        ),
                        setTimeout(function () {
                          s = !1;
                        }, o));
                    });
                  a.current = R(function () {
                    t();
                  });
                }
                var i, o, s;
                return function () {
                  c();
                };
              },
              [r, u]
            ),
            (0, f.A)(function () {
              c();
            }),
            {}
          );
        },
        O = function (n, t) {
          var r = t.retryInterval,
            e = t.retryCount,
            o = (0, i.useRef)(),
            u = (0, i.useRef)(0),
            a = (0, i.useRef)(!1);
          return e
            ? {
                onBefore: function () {
                  a.current || (u.current = 0),
                    (a.current = !1),
                    o.current && clearTimeout(o.current);
                },
                onSuccess: function () {
                  u.current = 0;
                },
                onError: function () {
                  if (((u.current += 1), -1 === e || u.current <= e)) {
                    var t =
                      null != r
                        ? r
                        : Math.min(1e3 * Math.pow(2, u.current), 3e4);
                    o.current = setTimeout(function () {
                      (a.current = !0), n.refresh();
                    }, t);
                  } else u.current = 0;
                },
                onCancel: function () {
                  (u.current = 0), o.current && clearTimeout(o.current);
                },
              }
            : {};
        },
        E = r(80462),
        C = r.n(E),
        M = function (n, t) {
          var r = t.throttleWait,
            o = t.throttleLeading,
            u = t.throttleTrailing,
            a = (0, i.useRef)(),
            c = {};
          return (
            void 0 !== o && (c.leading = o),
            void 0 !== u && (c.trailing = u),
            (0, i.useEffect)(
              function () {
                if (r) {
                  var t = n.runAsync.bind(n);
                  return (
                    (a.current = C()(
                      function (n) {
                        n();
                      },
                      r,
                      c
                    )),
                    (n.runAsync = function () {
                      for (var n = [], r = 0; r < arguments.length; r++)
                        n[r] = arguments[r];
                      return new Promise(function (r, i) {
                        var o;
                        null === (o = a.current) ||
                          void 0 === o ||
                          o.call(a, function () {
                            t.apply(
                              void 0,
                              (0, e.__spreadArray)([], (0, e.__read)(n), !1)
                            )
                              .then(r)
                              .catch(i);
                          });
                      });
                    }),
                    function () {
                      var r;
                      (n.runAsync = t),
                        null === (r = a.current) || void 0 === r || r.cancel();
                    }
                  );
                }
              },
              [r, o, u]
            ),
            r
              ? {
                  onCancel: function () {
                    var n;
                    null === (n = a.current) || void 0 === n || n.cancel();
                  },
                }
              : {}
          );
        },
        N = r(43941),
        B = r(54670),
        H = r(53219),
        W = function () {
          var n = (0, e.__read)((0, i.useState)({}), 2)[1];
          return (0, i.useCallback)(function () {
            return n({});
          }, []);
        },
        D = r(3299),
        F = r(64176),
        I = (function () {
          function n(n, t, r, i) {
            void 0 === i && (i = {}),
              (this.serviceRef = n),
              (this.options = t),
              (this.subscribe = r),
              (this.initState = i),
              (this.count = 0),
              (this.state = {
                loading: !1,
                params: void 0,
                data: void 0,
                error: void 0,
              }),
              (this.state = (0, e.__assign)(
                (0, e.__assign)((0, e.__assign)({}, this.state), {
                  loading: !t.manual,
                }),
                i
              ));
          }
          return (
            (n.prototype.setState = function (n) {
              void 0 === n && (n = {}),
                (this.state = (0, e.__assign)(
                  (0, e.__assign)({}, this.state),
                  n
                )),
                this.subscribe();
            }),
            (n.prototype.runPluginHandler = function (n) {
              for (var t = [], r = 1; r < arguments.length; r++)
                t[r - 1] = arguments[r];
              var i = this.pluginImpls
                .map(function (r) {
                  var i;
                  return null === (i = r[n]) || void 0 === i
                    ? void 0
                    : i.call.apply(
                        i,
                        (0, e.__spreadArray)([r], (0, e.__read)(t), !1)
                      );
                })
                .filter(Boolean);
              return Object.assign.apply(
                Object,
                (0, e.__spreadArray)([{}], (0, e.__read)(i), !1)
              );
            }),
            (n.prototype.runAsync = function () {
              for (var n = [], t = 0; t < arguments.length; t++)
                n[t] = arguments[t];
              return (0, e.__awaiter)(this, void 0, void 0, function () {
                var t,
                  r,
                  i,
                  o,
                  u,
                  a,
                  c,
                  s,
                  f,
                  l,
                  d,
                  v,
                  p,
                  h,
                  y,
                  g,
                  _,
                  m,
                  A,
                  b,
                  w;
                return (0, e.__generator)(this, function (T) {
                  switch (T.label) {
                    case 0:
                      if (
                        ((this.count += 1),
                        (t = this.count),
                        (r = this.runPluginHandler("onBefore", n)),
                        (i = r.stopNow),
                        (o = void 0 !== i && i),
                        (u = r.returnNow),
                        (a = void 0 !== u && u),
                        (c = (0, e.__rest)(r, ["stopNow", "returnNow"])),
                        o)
                      )
                        return [2, new Promise(function () {})];
                      if (
                        (this.setState(
                          (0, e.__assign)({ loading: !0, params: n }, c)
                        ),
                        a)
                      )
                        return [2, Promise.resolve(c.data)];
                      null === (p = (v = this.options).onBefore) ||
                        void 0 === p ||
                        p.call(v, n),
                        (T.label = 1);
                    case 1:
                      return (
                        T.trys.push([1, 3, , 4]),
                        (s = this.runPluginHandler(
                          "onRequest",
                          this.serviceRef.current,
                          n
                        ).servicePromise) ||
                          (s = (d = this.serviceRef).current.apply(
                            d,
                            (0, e.__spreadArray)([], (0, e.__read)(n), !1)
                          )),
                        [4, s]
                      );
                    case 2:
                      return (
                        (f = T.sent()),
                        t !== this.count
                          ? [2, new Promise(function () {})]
                          : (this.setState({
                              data: f,
                              error: void 0,
                              loading: !1,
                            }),
                            null === (y = (h = this.options).onSuccess) ||
                              void 0 === y ||
                              y.call(h, f, n),
                            this.runPluginHandler("onSuccess", f, n),
                            null === (_ = (g = this.options).onFinally) ||
                              void 0 === _ ||
                              _.call(g, n, f, void 0),
                            t === this.count &&
                              this.runPluginHandler("onFinally", n, f, void 0),
                            [2, f])
                      );
                    case 3:
                      if (((l = T.sent()), t !== this.count))
                        return [2, new Promise(function () {})];
                      throw (
                        (this.setState({ error: l, loading: !1 }),
                        null === (A = (m = this.options).onError) ||
                          void 0 === A ||
                          A.call(m, l, n),
                        this.runPluginHandler("onError", l, n),
                        null === (w = (b = this.options).onFinally) ||
                          void 0 === w ||
                          w.call(b, n, void 0, l),
                        t === this.count &&
                          this.runPluginHandler("onFinally", n, void 0, l),
                        l)
                      );
                    case 4:
                      return [2];
                  }
                });
              });
            }),
            (n.prototype.run = function () {
              for (var n = this, t = [], r = 0; r < arguments.length; r++)
                t[r] = arguments[r];
              this.runAsync
                .apply(this, (0, e.__spreadArray)([], (0, e.__read)(t), !1))
                .catch(function (t) {
                  n.options.onError;
                });
            }),
            (n.prototype.cancel = function () {
              (this.count += 1),
                this.setState({ loading: !1 }),
                this.runPluginHandler("onCancel");
            }),
            (n.prototype.refresh = function () {
              this.run.apply(
                this,
                (0, e.__spreadArray)(
                  [],
                  (0, e.__read)(this.state.params || []),
                  !1
                )
              );
            }),
            (n.prototype.refreshAsync = function () {
              return this.runAsync.apply(
                this,
                (0, e.__spreadArray)(
                  [],
                  (0, e.__read)(this.state.params || []),
                  !1
                )
              );
            }),
            (n.prototype.mutate = function (n) {
              var t = (0, F.Tn)(n) ? n(this.state.data) : n;
              this.runPluginHandler("onMutate", t), this.setState({ data: t });
            }),
            n
          );
        })(),
        L = I;
      var k = function (n, t, r) {
        void 0 === t && (t = {}), void 0 === r && (r = []);
        var i = t.manual,
          o = void 0 !== i && i,
          u = t.ready,
          a = void 0 === u || u,
          c = (0, e.__rest)(t, ["manual", "ready"]);
        D.A && t.defaultParams && Array.isArray(t.defaultParams);
        var l = (0, e.__assign)({ manual: o, ready: a }, c),
          d = (0, N.A)(n),
          v = W(),
          p = s(function () {
            var n = r
              .map(function (n) {
                var t;
                return null === (t = null == n ? void 0 : n.onInit) ||
                  void 0 === t
                  ? void 0
                  : t.call(n, l);
              })
              .filter(Boolean);
            return new L(
              d,
              l,
              v,
              Object.assign.apply(
                Object,
                (0, e.__spreadArray)([{}], (0, e.__read)(n), !1)
              )
            );
          }, []);
        return (
          (p.options = l),
          (p.pluginImpls = r.map(function (n) {
            return n(p, l);
          })),
          (0, H.A)(function () {
            if (!o && a) {
              var n = p.state.params || t.defaultParams || [];
              p.run.apply(p, (0, e.__spreadArray)([], (0, e.__read)(n), !1));
            }
          }),
          (0, f.A)(function () {
            p.cancel();
          }),
          {
            loading: p.state.loading,
            data: p.state.data,
            error: p.state.error,
            params: p.state.params || [],
            cancel: (0, B.A)(p.cancel.bind(p)),
            refresh: (0, B.A)(p.refresh.bind(p)),
            refreshAsync: (0, B.A)(p.refreshAsync.bind(p)),
            run: (0, B.A)(p.run.bind(p)),
            runAsync: (0, B.A)(p.runAsync.bind(p)),
            mutate: (0, B.A)(p.mutate.bind(p)),
          }
        );
      };
      var z = function (n, t, r) {
        return k(
          n,
          t,
          (0, e.__spreadArray)(
            (0, e.__spreadArray)([], (0, e.__read)(r || []), !1),
            [_, m, x, S, M, a, h, O],
            !1
          )
        );
      };
    },
    4958(n, t, r) {
      "use strict";
      var e = r(41486),
        i = r(43941),
        o = r(64176),
        u = r(3299);
      t.A = function (n) {
        u.A && (0, o.Tn)(n);
        var t = (0, i.A)(n);
        (0, e.useEffect)(function () {
          return function () {
            t.current();
          };
        }, []);
      };
    },
    67738(n, t, r) {
      "use strict";
      r.d(t, { A: () => o });
      var e = r(41486),
        i = function (n) {
          return function (t, r) {
            var i = (0, e.useRef)(!1);
            n(function () {
              return function () {
                i.current = !1;
              };
            }, []),
              n(function () {
                if (i.current) return t();
                i.current = !0;
              }, r);
          };
        },
        o = i(e.useEffect);
    },
    56522(n, t, r) {
      "use strict";
      function e(n, t) {
        if (n === t) return !0;
        for (var r = 0; r < n.length; r++)
          if (!Object.is(n[r], t[r])) return !1;
        return !0;
      }
      r.d(t, { A: () => e });
    },
    64176(n, t, r) {
      "use strict";
      r.d(t, { Et: () => o, Kg: () => i, Tn: () => e, XB: () => u });
      var e = function (n) {
          return "function" == typeof n;
        },
        i = function (n) {
          return "string" == typeof n;
        },
        o = function (n) {
          return "number" == typeof n;
        },
        u = function (n) {
          return void 0 === n;
        };
    },
    28700(n, t) {
      "use strict";
      var r = !(
        "undefined" == typeof window ||
        !window.document ||
        !window.document.createElement
      );
      t.A = r;
    },
    3299(n, t) {
      "use strict";
      t.A = !1;
    },
    64073(n, t, r) {
      var e = r(58453).Symbol;
      n.exports = e;
    },
    76624(n, t, r) {
      var e = r(64073),
        i = r(7915),
        o = r(14478),
        u = e ? e.toStringTag : void 0;
      n.exports = function (n) {
        return null == n
          ? void 0 === n
            ? "[object Undefined]"
            : "[object Null]"
          : u && u in Object(n)
          ? i(n)
          : o(n);
      };
    },
    23480(n, t, r) {
      var e = r(98976),
        i = /^\s+/;
      n.exports = function (n) {
        return n ? n.slice(0, e(n) + 1).replace(i, "") : n;
      };
    },
    18928(n, t, r) {
      var e = "object" == typeof r.g && r.g && r.g.Object === Object && r.g;
      n.exports = e;
    },
    7915(n, t, r) {
      var e = r(64073),
        i = Object.prototype,
        o = i.hasOwnProperty,
        u = i.toString,
        a = e ? e.toStringTag : void 0;
      n.exports = function (n) {
        var t = o.call(n, a),
          r = n[a];
        try {
          n[a] = void 0;
          var e = !0;
        } catch (n) {}
        var i = u.call(n);
        return e && (t ? (n[a] = r) : delete n[a]), i;
      };
    },
    14478(n) {
      var t = Object.prototype.toString;
      n.exports = function (n) {
        return t.call(n);
      };
    },
    58453(n, t, r) {
      var e = r(18928),
        i = "object" == typeof self && self && self.Object === Object && self,
        o = e || i || Function("return this")();
      n.exports = o;
    },
    98976(n) {
      var t = /\s/;
      n.exports = function (n) {
        for (var r = n.length; r-- && t.test(n.charAt(r)); );
        return r;
      };
    },
    82645(n, t, r) {
      var e = r(57717),
        i = r(54884),
        o = r(66086),
        u = Math.max,
        a = Math.min;
      n.exports = function (n, t, r) {
        var c,
          s,
          f,
          l,
          d,
          v,
          p = 0,
          h = !1,
          y = !1,
          g = !0;
        if ("function" != typeof n) throw new TypeError("Expected a function");
        function _(t) {
          var r = c,
            e = s;
          return (c = s = void 0), (p = t), (l = n.apply(e, r));
        }
        function m(n) {
          return (p = n), (d = setTimeout(b, t)), h ? _(n) : l;
        }
        function A(n) {
          var r = n - v;
          return void 0 === v || r >= t || r < 0 || (y && n - p >= f);
        }
        function b() {
          var n = i();
          if (A(n)) return w(n);
          d = setTimeout(
            b,
            (function (n) {
              var r = t - (n - v);
              return y ? a(r, f - (n - p)) : r;
            })(n)
          );
        }
        function w(n) {
          return (d = void 0), g && c ? _(n) : ((c = s = void 0), l);
        }
        function T() {
          var n = i(),
            r = A(n);
          if (((c = arguments), (s = this), (v = n), r)) {
            if (void 0 === d) return m(v);
            if (y) return clearTimeout(d), (d = setTimeout(b, t)), _(v);
          }
          return void 0 === d && (d = setTimeout(b, t)), l;
        }
        return (
          (t = o(t) || 0),
          e(r) &&
            ((h = !!r.leading),
            (f = (y = "maxWait" in r) ? u(o(r.maxWait) || 0, t) : f),
            (g = "trailing" in r ? !!r.trailing : g)),
          (T.cancel = function () {
            void 0 !== d && clearTimeout(d), (p = 0), (c = v = s = d = void 0);
          }),
          (T.flush = function () {
            return void 0 === d ? l : w(i());
          }),
          T
        );
      };
    },
    57717(n) {
      n.exports = function (n) {
        var t = typeof n;
        return null != n && ("object" == t || "function" == t);
      };
    },
    2050(n) {
      n.exports = function (n) {
        return null != n && "object" == typeof n;
      };
    },
    56770(n, t, r) {
      var e = r(76624),
        i = r(2050);
      n.exports = function (n) {
        return "symbol" == typeof n || (i(n) && "[object Symbol]" == e(n));
      };
    },
    54884(n, t, r) {
      var e = r(58453);
      n.exports = function () {
        return e.Date.now();
      };
    },
    80462(n, t, r) {
      var e = r(82645),
        i = r(57717);
      n.exports = function (n, t, r) {
        var o = !0,
          u = !0;
        if ("function" != typeof n) throw new TypeError("Expected a function");
        return (
          i(r) &&
            ((o = "leading" in r ? !!r.leading : o),
            (u = "trailing" in r ? !!r.trailing : u)),
          e(n, t, { leading: o, maxWait: t, trailing: u })
        );
      };
    },
    66086(n, t, r) {
      var e = r(23480),
        i = r(57717),
        o = r(56770),
        u = /^[-+]0x[0-9a-f]+$/i,
        a = /^0b[01]+$/i,
        c = /^0o[0-7]+$/i,
        s = parseInt;
      n.exports = function (n) {
        if ("number" == typeof n) return n;
        if (o(n)) return NaN;
        if (i(n)) {
          var t = "function" == typeof n.valueOf ? n.valueOf() : n;
          n = i(t) ? t + "" : t;
        }
        if ("string" != typeof n) return 0 === n ? n : +n;
        n = e(n);
        var r = a.test(n);
        return r || c.test(n) ? s(n.slice(2), r ? 2 : 8) : u.test(n) ? NaN : +n;
      };
    },
  },
]);
