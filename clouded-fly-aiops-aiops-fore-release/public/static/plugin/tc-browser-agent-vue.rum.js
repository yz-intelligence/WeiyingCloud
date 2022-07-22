!(function (t, e) {
  if ('object' == typeof exports && 'object' == typeof module) module.exports = e()
  else if ('function' == typeof define && define.amd) define([], e)
  else {
    var n,
      r = e()
    for (n in r) ('object' == typeof exports ? exports : t)[n] = r[n]
  }
})(window, function () {
  return (
    (n = {}),
    (t.m = e =
      [
        function (t, e) {
          var n = (function () {
            return this
          })()
          try {
            n = n || new Function('return this')()
          } catch (t) {
            'object' == typeof window && (n = window)
          }
          t.exports = n
        },
        function (t, e, n) {
          'use strict'
          ;(function (t) {
            var r = n(2),
              i = n(3),
              o = setTimeout
            function a(t) {
              return Boolean(t && void 0 !== t.length)
            }
            function s() {}
            function c(t) {
              if (!(this instanceof c)) throw new TypeError('Promises must be constructed via new')
              if ('function' != typeof t) throw new TypeError('not a function')
              ;(this._state = 0), (this._handled = !1), (this._value = void 0), (this._deferreds = []), h(t, this)
            }
            function u(t, e) {
              for (; 3 === t._state; ) t = t._value
              0 !== t._state
                ? ((t._handled = !0),
                  c._immediateFn(function () {
                    var n,
                      r = 1 === t._state ? e.onFulfilled : e.onRejected
                    if (null !== r) {
                      try {
                        n = r(t._value)
                      } catch (n) {
                        return void d(e.promise, n)
                      }
                      f(e.promise, n)
                    } else (1 === t._state ? f : d)(e.promise, t._value)
                  }))
                : t._deferreds.push(e)
            }
            function f(t, e) {
              try {
                if (e === t) throw new TypeError('A promise cannot be resolved with itself.')
                if (e && ('object' == typeof e || 'function' == typeof e)) {
                  var n = e.then
                  if (e instanceof c) return (t._state = 3), (t._value = e), void l(t)
                  if ('function' == typeof n)
                    return void h(
                      ((r = n),
                      (i = e),
                      function () {
                        r.apply(i, arguments)
                      }),
                      t
                    )
                }
                ;(t._state = 1), (t._value = e), l(t)
              } catch (e) {
                d(t, e)
              }
              var r, i
            }
            function d(t, e) {
              ;(t._state = 2), (t._value = e), l(t)
            }
            function l(t) {
              2 === t._state &&
                0 === t._deferreds.length &&
                c._immediateFn(function () {
                  t._handled || c._unhandledRejectionFn(t._value)
                })
              for (var e = 0, n = t._deferreds.length; e < n; e++) u(t, t._deferreds[e])
              t._deferreds = null
            }
            function p(t, e, n) {
              ;(this.onFulfilled = 'function' == typeof t ? t : null),
                (this.onRejected = 'function' == typeof e ? e : null),
                (this.promise = n)
            }
            function h(t, e) {
              var n = !1
              try {
                t(
                  function (t) {
                    n || ((n = !0), f(e, t))
                  },
                  function (t) {
                    n || ((n = !0), d(e, t))
                  }
                )
              } catch (t) {
                if (n) return
                ;(n = !0), d(e, t)
              }
            }
            ;(c.prototype.catch = function (t) {
              return this.then(null, t)
            }),
              (c.prototype.then = function (t, e) {
                var n = new this.constructor(s)
                return u(this, new p(t, e, n)), n
              }),
              (c.prototype.finally = r.a),
              (c.all = function (t) {
                return new c(function (e, n) {
                  if (!a(t)) return n(new TypeError('Promise.all accepts an array'))
                  var r = Array.prototype.slice.call(t)
                  if (0 === r.length) return e([])
                  for (var i = r.length, o = 0; o < r.length; o++)
                    !(function t(o, a) {
                      try {
                        if (a && ('object' == typeof a || 'function' == typeof a)) {
                          var s = a.then
                          if ('function' == typeof s)
                            return void s.call(
                              a,
                              function (e) {
                                t(o, e)
                              },
                              n
                            )
                        }
                        ;(r[o] = a), 0 == --i && e(r)
                      } catch (a) {
                        n(a)
                      }
                    })(o, r[o])
                })
              }),
              (c.allSettled = i.a),
              (c.resolve = function (t) {
                return t && 'object' == typeof t && t.constructor === c
                  ? t
                  : new c(function (e) {
                      e(t)
                    })
              }),
              (c.reject = function (t) {
                return new c(function (e, n) {
                  n(t)
                })
              }),
              (c.race = function (t) {
                return new c(function (e, n) {
                  if (!a(t)) return n(new TypeError('Promise.race accepts an array'))
                  for (var r = 0, i = t.length; r < i; r++) c.resolve(t[r]).then(e, n)
                })
              }),
              (c._immediateFn =
                'function' == typeof t
                  ? function (e) {
                      t(e)
                    }
                  : function (t) {
                      o(t, 0)
                    }),
              (c._unhandledRejectionFn = function () {}),
              (e.a = c)
          }.call(this, n(6).setImmediate))
        },
        function (t, e, n) {
          'use strict'
          e.a = function (t) {
            var e = this.constructor
            return this.then(
              function (n) {
                return e.resolve(t()).then(function () {
                  return n
                })
              },
              function (n) {
                return e.resolve(t()).then(function () {
                  return e.reject(n)
                })
              }
            )
          }
        },
        function (t, e, n) {
          'use strict'
          e.a = function (t) {
            return new this(function (e, n) {
              if (!t || void 0 === t.length)
                return n(
                  new TypeError(typeof t + ' ' + t + ' is not iterable(cannot read property Symbol(Symbol.iterator))')
                )
              var r = Array.prototype.slice.call(t)
              if (0 === r.length) return e([])
              for (var i = r.length, o = 0; o < r.length; o++)
                !(function t(n, o) {
                  if (o && ('object' == typeof o || 'function' == typeof o)) {
                    var a = o.then
                    if ('function' == typeof a)
                      return void a.call(
                        o,
                        function (e) {
                          t(n, e)
                        },
                        function (t) {
                          ;(r[n] = { status: 'rejected', reason: t }), 0 == --i && e(r)
                        }
                      )
                  }
                  ;(r[n] = { status: 'fulfilled', value: o }), 0 == --i && e(r)
                })(o, r[o])
            })
          }
        },
        function (t, e, n) {
          var r, i
          !(function (o) {
            'use strict'
            ;(r = [n(9)]),
              void 0 ===
                (i =
                  'function' ==
                  typeof (i = function (t) {
                    var e = /(^|@)\S+\:\d+/,
                      n = /^\s*at .*(\S+\:\d+|\(native\))/m,
                      r = /^(eval@)?(\[native code\])?$/
                    function i(t, e, n) {
                      if ('function' == typeof Array.prototype.map) return t.map(e, n)
                      for (var r = new Array(t.length), i = 0; i < t.length; i++) r[i] = e.call(n, t[i])
                      return r
                    }
                    function o(t, e, n) {
                      if ('function' == typeof Array.prototype.filter) return t.filter(e, n)
                      for (var r = [], i = 0; i < t.length; i++) e.call(n, t[i]) && r.push(t[i])
                      return r
                    }
                    return {
                      parse: function (t) {
                        if (void 0 !== t.stacktrace || void 0 !== t['opera#sourceloc']) return this.parseOpera(t)
                        if (t.stack && t.stack.match(n)) return this.parseV8OrIE(t)
                        if (t.stack) return this.parseFFOrSafari(t)
                        throw new Error('Cannot parse given Error object')
                      },
                      extractLocation: function (t) {
                        return -1 === t.indexOf(':')
                          ? [t]
                          : [
                              (t = /(.+?)(?:\:(\d+))?(?:\:(\d+))?$/.exec(t.replace(/[\(\)]/g, '')))[1],
                              t[2] || void 0,
                              t[3] || void 0
                            ]
                      },
                      parseV8OrIE: function (e) {
                        return i(
                          o(
                            e.stack.split('\n'),
                            function (t) {
                              return !!t.match(n)
                            },
                            this
                          ),
                          function (e) {
                            ;-1 < e.indexOf('(eval ') &&
                              (e = e.replace(/eval code/g, 'eval').replace(/(\(eval at [^\()]*)|(\)\,.*$)/g, ''))
                            var n = e
                                .replace(/^\s+/, '')
                                .replace(/\(eval code/g, '(')
                                .split(/\s+/)
                                .slice(1),
                              r = this.extractLocation(n.pop()),
                              i = n.join(' ') || void 0
                            n =
                              -1 <
                              (function (t, e) {
                                if ('function' == typeof Array.prototype.indexOf) return t.indexOf(e)
                                for (var n = 0; n < t.length; n++) if (t[n] === e) return n
                                return -1
                              })(['eval', '<anonymous>'], r[0])
                                ? void 0
                                : r[0]
                            return new t(i, void 0, n, r[1], r[2], e)
                          },
                          this
                        )
                      },
                      parseFFOrSafari: function (e) {
                        return i(
                          o(
                            e.stack.split('\n'),
                            function (t) {
                              return !t.match(r)
                            },
                            this
                          ),
                          function (e) {
                            if (
                              (-1 < e.indexOf(' > eval') &&
                                (e = e.replace(/ line (\d+)(?: > eval line \d+)* > eval\:\d+\:\d+/g, ':$1')),
                              -1 === e.indexOf('@') && -1 === e.indexOf(':'))
                            )
                              return new t(e)
                            var n = e.split('@'),
                              r = this.extractLocation(n.pop())
                            n = n.join('@') || void 0
                            return new t(n, void 0, r[0], r[1], r[2], e)
                          },
                          this
                        )
                      },
                      parseOpera: function (t) {
                        return !t.stacktrace ||
                          (-1 < t.message.indexOf('\n') &&
                            t.message.split('\n').length > t.stacktrace.split('\n').length)
                          ? this.parseOpera9(t)
                          : t.stack
                          ? this.parseOpera11(t)
                          : this.parseOpera10(t)
                      },
                      parseOpera9: function (e) {
                        for (
                          var n = /Line (\d+).*script (?:in )?(\S+)/i,
                            r = e.message.split('\n'),
                            i = [],
                            o = 2,
                            a = r.length;
                          o < a;
                          o += 2
                        ) {
                          var s = n.exec(r[o])
                          s && i.push(new t(void 0, void 0, s[2], s[1], void 0, r[o]))
                        }
                        return i
                      },
                      parseOpera10: function (e) {
                        for (
                          var n = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i,
                            r = e.stacktrace.split('\n'),
                            i = [],
                            o = 0,
                            a = r.length;
                          o < a;
                          o += 2
                        ) {
                          var s = n.exec(r[o])
                          s && i.push(new t(s[3] || void 0, void 0, s[2], s[1], void 0, r[o]))
                        }
                        return i
                      },
                      parseOpera11: function (n) {
                        return i(
                          o(
                            n.stack.split('\n'),
                            function (t) {
                              return !!t.match(e) && !t.match(/^Error created at/)
                            },
                            this
                          ),
                          function (e) {
                            var n = e.split('@'),
                              r = this.extractLocation(n.pop()),
                              i = n.shift() || ''
                            n = i.replace(/<anonymous function(: (\w+))?>/, '$2').replace(/\([^\)]*\)/g, '') || void 0
                            i.match(/\(([^\)]*)\)/) && (o = i.replace(/^[^\(]+\(([^\)]*)\)$/, '$1'))
                            var o = void 0 === o || '[arguments not available]' === o ? void 0 : o.split(',')
                            return new t(n, o, r[0], r[1], r[2], e)
                          },
                          this
                        )
                      }
                    }
                  })
                    ? i.apply(e, r)
                    : i) || (t.exports = i)
          })()
        },
        ,
        function (t, e, n) {
          ;(function (t) {
            var r = (void 0 !== t && t) || ('undefined' != typeof self && self) || window,
              i = Function.prototype.apply
            function o(t, e) {
              ;(this._id = t), (this._clearFn = e)
            }
            ;(e.setTimeout = function () {
              return new o(i.call(setTimeout, r, arguments), clearTimeout)
            }),
              (e.setInterval = function () {
                return new o(i.call(setInterval, r, arguments), clearInterval)
              }),
              (e.clearTimeout = e.clearInterval =
                function (t) {
                  t && t.close()
                }),
              (o.prototype.unref = o.prototype.ref = function () {}),
              (o.prototype.close = function () {
                this._clearFn.call(r, this._id)
              }),
              (e.enroll = function (t, e) {
                clearTimeout(t._idleTimeoutId), (t._idleTimeout = e)
              }),
              (e.unenroll = function (t) {
                clearTimeout(t._idleTimeoutId), (t._idleTimeout = -1)
              }),
              (e._unrefActive = e.active =
                function (t) {
                  clearTimeout(t._idleTimeoutId)
                  var e = t._idleTimeout
                  0 <= e &&
                    (t._idleTimeoutId = setTimeout(function () {
                      t._onTimeout && t._onTimeout()
                    }, e))
                }),
              n(7),
              (e.setImmediate =
                ('undefined' != typeof self && self.setImmediate) ||
                (void 0 !== t && t.setImmediate) ||
                (this && this.setImmediate)),
              (e.clearImmediate =
                ('undefined' != typeof self && self.clearImmediate) ||
                (void 0 !== t && t.clearImmediate) ||
                (this && this.clearImmediate))
          }.call(this, n(0)))
        },
        function (t, e, n) {
          ;(function (t, e) {
            !(function (t, n) {
              'use strict'
              var r, i, o, a, s, c, u, f, d
              function l(t) {
                delete i[t]
              }
              function p(t) {
                if (o) setTimeout(p, 0, t)
                else {
                  var e = i[t]
                  if (e) {
                    o = !0
                    try {
                      !(function () {
                        var t = e.callback,
                          n = e.args
                        switch (n.length) {
                          case 0:
                            t()
                            break
                          case 1:
                            t(n[0])
                            break
                          case 2:
                            t(n[0], n[1])
                            break
                          case 3:
                            t(n[0], n[1], n[2])
                            break
                          default:
                            t.apply(void 0, n)
                        }
                      })()
                    } finally {
                      l(t), (o = !1)
                    }
                  }
                }
              }
              function h(e) {
                e.source === t && 'string' == typeof e.data && 0 === e.data.indexOf(f) && p(+e.data.slice(f.length))
              }
              t.setImmediate ||
                ((r = 1),
                (o = !(i = {})),
                (a = t.document),
                (d = (d = Object.getPrototypeOf && Object.getPrototypeOf(t)) && d.setTimeout ? d : t),
                (s =
                  '[object process]' === {}.toString.call(t.process)
                    ? function (t) {
                        e.nextTick(function () {
                          p(t)
                        })
                      }
                    : (function () {
                        if (t.postMessage && !t.importScripts) {
                          var e = !0,
                            n = t.onmessage
                          return (
                            (t.onmessage = function () {
                              e = !1
                            }),
                            t.postMessage('', '*'),
                            (t.onmessage = n),
                            e
                          )
                        }
                      })()
                    ? ((f = 'setImmediate$' + Math.random() + '$'),
                      t.addEventListener ? t.addEventListener('message', h, !1) : t.attachEvent('onmessage', h),
                      function (e) {
                        t.postMessage(f + e, '*')
                      })
                    : t.MessageChannel
                    ? (((u = new MessageChannel()).port1.onmessage = function (t) {
                        p(t.data)
                      }),
                      function (t) {
                        u.port2.postMessage(t)
                      })
                    : a && 'onreadystatechange' in a.createElement('script')
                    ? ((c = a.documentElement),
                      function (t) {
                        var e = a.createElement('script')
                        ;(e.onreadystatechange = function () {
                          p(t), (e.onreadystatechange = null), c.removeChild(e), (e = null)
                        }),
                          c.appendChild(e)
                      })
                    : function (t) {
                        setTimeout(p, 0, t)
                      }),
                (d.setImmediate = function (t) {
                  'function' != typeof t && (t = new Function('' + t))
                  for (var e = new Array(arguments.length - 1), n = 0; n < e.length; n++) e[n] = arguments[n + 1]
                  return (t = { callback: t, args: e }), (i[r] = t), s(r), r++
                }),
                (d.clearImmediate = l))
            })('undefined' == typeof self ? (void 0 === t ? this : t) : self)
          }.call(this, n(0), n(8)))
        },
        function (t, e) {
          var n, r
          t = t.exports = {}
          function i() {
            throw new Error('setTimeout has not been defined')
          }
          function o() {
            throw new Error('clearTimeout has not been defined')
          }
          function a(t) {
            if (n === setTimeout) return setTimeout(t, 0)
            if ((n === i || !n) && setTimeout) return (n = setTimeout), setTimeout(t, 0)
            try {
              return n(t, 0)
            } catch (e) {
              try {
                return n.call(null, t, 0)
              } catch (e) {
                return n.call(this, t, 0)
              }
            }
          }
          !(function () {
            try {
              n = 'function' == typeof setTimeout ? setTimeout : i
            } catch (t) {
              n = i
            }
            try {
              r = 'function' == typeof clearTimeout ? clearTimeout : o
            } catch (t) {
              r = o
            }
          })()
          var s,
            c = [],
            u = !1,
            f = -1
          function d() {
            u && s && ((u = !1), s.length ? (c = s.concat(c)) : (f = -1), c.length && l())
          }
          function l() {
            if (!u) {
              var t = a(d)
              u = !0
              for (var e = c.length; e; ) {
                for (s = c, c = []; ++f < e; ) s && s[f].run()
                ;(f = -1), (e = c.length)
              }
              ;(s = null),
                (u = !1),
                (function (t) {
                  if (r === clearTimeout) return clearTimeout(t)
                  if ((r === o || !r) && clearTimeout) return (r = clearTimeout), clearTimeout(t)
                  try {
                    r(t)
                  } catch (e) {
                    try {
                      return r.call(null, t)
                    } catch (e) {
                      return r.call(this, t)
                    }
                  }
                })(t)
            }
          }
          function p(t, e) {
            ;(this.fun = t), (this.array = e)
          }
          function h() {}
          ;(t.nextTick = function (t) {
            var e = new Array(arguments.length - 1)
            if (1 < arguments.length) for (var n = 1; n < arguments.length; n++) e[n - 1] = arguments[n]
            c.push(new p(t, e)), 1 !== c.length || u || a(l)
          }),
            (p.prototype.run = function () {
              this.fun.apply(null, this.array)
            }),
            (t.title = 'browser'),
            (t.browser = !0),
            (t.env = {}),
            (t.argv = []),
            (t.version = ''),
            (t.versions = {}),
            (t.on = h),
            (t.addListener = h),
            (t.once = h),
            (t.off = h),
            (t.removeListener = h),
            (t.removeAllListeners = h),
            (t.emit = h),
            (t.prependListener = h),
            (t.prependOnceListener = h),
            (t.listeners = function (t) {
              return []
            }),
            (t.binding = function (t) {
              throw new Error('process.binding is not supported')
            }),
            (t.cwd = function () {
              return '/'
            }),
            (t.chdir = function (t) {
              throw new Error('process.chdir is not supported')
            }),
            (t.umask = function () {
              return 0
            })
        },
        function (t, e, n) {
          var r, i
          !(function () {
            'use strict'
            ;(r = []),
              void 0 ===
                (i =
                  'function' ==
                  typeof (i = function () {
                    function t(t) {
                      return !isNaN(parseFloat(t)) && isFinite(t)
                    }
                    function e(t, e, n, r, i, o) {
                      void 0 !== t && this.setFunctionName(t),
                        void 0 !== e && this.setArgs(e),
                        void 0 !== n && this.setFileName(n),
                        void 0 !== r && this.setLineNumber(r),
                        void 0 !== i && this.setColumnNumber(i),
                        void 0 !== o && this.setSource(o)
                    }
                    return (
                      (e.prototype = {
                        getFunctionName: function () {
                          return this.functionName
                        },
                        setFunctionName: function (t) {
                          this.functionName = String(t)
                        },
                        getArgs: function () {
                          return this.args
                        },
                        setArgs: function (t) {
                          if ('[object Array]' !== Object.prototype.toString.call(t))
                            throw new TypeError('Args must be an Array')
                          this.args = t
                        },
                        getFileName: function () {
                          return this.fileName
                        },
                        setFileName: function (t) {
                          this.fileName = String(t)
                        },
                        getLineNumber: function () {
                          return this.lineNumber
                        },
                        setLineNumber: function (e) {
                          if (!t(e)) throw new TypeError('Line Number must be a Number')
                          this.lineNumber = Number(e)
                        },
                        getColumnNumber: function () {
                          return this.columnNumber
                        },
                        setColumnNumber: function (e) {
                          if (!t(e)) throw new TypeError('Column Number must be a Number')
                          this.columnNumber = Number(e)
                        },
                        getSource: function () {
                          return this.source
                        },
                        setSource: function (t) {
                          this.source = String(t)
                        },
                        toString: function () {
                          return (
                            (this.getFunctionName() || '{anonymous}') +
                            '(' +
                            (this.getArgs() || []).join(',') +
                            ')' +
                            (this.getFileName() ? '@' + this.getFileName() : '') +
                            (t(this.getLineNumber()) ? ':' + this.getLineNumber() : '') +
                            (t(this.getColumnNumber()) ? ':' + this.getColumnNumber() : '')
                          )
                        }
                      }),
                      e
                    )
                  })
                    ? i.apply(e, r)
                    : i) || (t.exports = i)
          })()
        },
        function (t, e, n) {
          'use strict'
          n.r(e),
            n.d(e, 'apmVuePlugin', function () {
              return Oe
            })
          var r = n(1)
          e = {}
          a ? (e = window) : 'undefined' != typeof self && (e = self)
          for (
            var i = ('Promise' in e) ? e.Promise : r.a,
              o = [].slice,
              a = 'undefined' != typeof window,
              s = a && 'undefined' != typeof performance ? performance : {},
              c = [],
              u = 0;
            u < 256;
            ++u
          )
            c[u] = (u + 256).toString(16).substr(1)
          var f = new Uint8Array(16)
          function d(t) {
            return (function (t) {
              for (var e = [], n = 0; n < t.length; n++) e.push(c[t[n]])
              return e.join('')
            })(
              'undefined' != typeof crypto && 'function' == typeof crypto.getRandomValues
                ? crypto.getRandomValues(f)
                : 'undefined' != typeof msCrypto && 'function' == typeof msCrypto.getRandomValues
                ? msCrypto.getRandomValues(f)
                : f
            ).substr(0, t)
          }
          function l(t, e) {
            var n = !1
            return (
              'string' == typeof e
                ? (n = t === e)
                : Array.isArray(e) &&
                  e.forEach(function (e) {
                    n = n || l(t, e)
                  }),
              n
            )
          }
          function p(t, e, n) {
            if (n && t) {
              var r = T(t)
              t = typeof e
              return null != e && 'boolean' != t && 'number' != t && (e = String(e)), (n[r] = e), n
            }
          }
          function h(t) {
            return t && t.split('?')[0]
          }
          function v(t) {
            return null !== t && 'object' == typeof t
          }
          function m(t, e, n) {
            for (var r = 0, i = e.length; r < i; ++r) {
              var o = e[r]
              if (v(o) || 'function' == typeof o)
                for (var a = Object.keys(o), s = 0, c = a.length; s < c; s++) {
                  var u = a[s],
                    f = o[u]
                  n && v(f) ? (v(t[u]) || (t[u] = Array.isArray(f) ? [] : {}), m(t[u], [f], !1)) : (t[u] = f)
                }
            }
            return t
          }
          function g(t) {
            return m(t, o.call(arguments, 1), !1)
          }
          function y(t) {
            return m(t, o.call(arguments, 1), !0)
          }
          function b(t) {
            return void 0 === t
          }
          function _() {}
          function T(t) {
            return t.replace(/[.*"]/g, '_')
          }
          function w() {
            return s.now()
          }
          function S(t) {
            return 'number' == typeof t && 0 <= t ? t : w()
          }
          function E(t, e) {
            return b(e) || b(t) ? null : parseInt(e - t)
          }
          function x(t) {
            i.resolve().then(t)
          }
          function k() {
            return 'function' == typeof s.getEntriesByType
          }
          function L(t) {
            return (
              'undefined' != typeof PerformanceObserver &&
              PerformanceObserver.supportedEntryTypes &&
              0 <= PerformanceObserver.supportedEntryTypes.indexOf(t)
            )
          }
          var O = { fetchInProgress: !1 }
          function I(t) {
            return '__apm_symbol__' + t
          }
          function C(t, e, n) {
            for (var r = t; r && !r.hasOwnProperty(e); ) r = Object.getPrototypeOf(r)
            !r && t[e] && (r = t)
            var i,
              o,
              a = I(e)
            return (
              r &&
                !(i = r[a]) &&
                ((i = r[a] = r[e]),
                ((t = t = r && Object.getOwnPropertyDescriptor(r, e)) &&
                  (!1 === t.writable || ('function' == typeof t.get && void 0 === t.set))) ||
                  ((o = n(i, a, e)),
                  (r[e] = function () {
                    return o(this, arguments)
                  }),
                  (a = i),
                  ((n = r[e])[I('OriginalDelegate')] = a))),
              i
            )
          }
          var N = I('xhrIgnore'),
            j = I('xhrSync'),
            F = I('xhrURL'),
            A = I('xhrMethod'),
            M = 'schedule',
            P = 'invoke',
            R = 'addEventListener',
            q = 'removeEventListener',
            H = ['link', 'css', 'script', 'img', 'xmlhttprequest', 'fetch', 'beacon', 'iframe'],
            $ = 3e5,
            z = 'page-load',
            D = 'user-interaction',
            B = 'http-request',
            U = 'temporary',
            V = 'Unknown',
            J = [z, 'route-change', D, B, 'custom', U],
            X = 'transaction:end',
            Z = 'config:change',
            G = 'xmlhttprequest',
            W = 'fetch',
            K = 'history',
            Q = 'eventtarget',
            Y = 'elastic_apm_config',
            tt = 'longtask',
            et = 'largest-contentful-paint',
            nt = 'first-input',
            rt = 'layout-shift',
            it = 'errors',
            ot = 'transactions',
            at = 'ConfigService',
            st = 'LoggingService',
            ct = 'ApmServer',
            ut = '.truncated',
            ft = 1024
          function dt(t) {
            return t
              ? t instanceof ArrayBuffer
                ? t.byteLength
                : (function (t) {
                    for (var e = 0, n = 0; n < t.length; n++) {
                      var r = t.charAt(n)
                      ;/^[\u0000-\u00ff]$/.test(r) ? (e += 1) : (e += 2)
                    }
                    return e
                  })('object' == typeof t ? JSON.stringify(t) : t)
              : 0
          }
          function lt(t) {
            return '__apm_symbol__' + t
          }
          function pt(t) {
            return 'number' == typeof t && 0 <= t ? t : s.now()
          }
          function ht() {
            if (4 === this.readyState && 0 !== this.status)
              return (
                (this[lt('cb_end')] = pt()),
                { callbackTime: Math.floor(this[lt('cb_end')] - this[lt('cb_start')]), receive: dt(this.responseText) }
              )
          }
          function vt() {
            return (vt =
              Object.assign ||
              function (t) {
                for (var e = 1; e < arguments.length; e++) {
                  var n,
                    r = arguments[e]
                  for (n in r) Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
                }
                return t
              }).apply(this, arguments)
          }
          function mt(t) {
            var e,
              n,
              r,
              i,
              o = XMLHttpRequest.prototype
            function a(e, n) {
              e.state !== P && ((e.state = P), (e.data.status = n), t(P, e))
            }
            o &&
              o[R] &&
              ((e = 'readystatechange'),
              (n = XMLHttpRequest.prototype.addEventListener),
              Object.defineProperty(XMLHttpRequest.prototype, 'addEventListener', {
                configurable: !0,
                enumerable: !0,
                writable: !0,
                value: function (t, e, r) {
                  var i = e
                  'readystatechange' !== t ||
                    'apm' === r ||
                    this[lt('xhrIgnore')] ||
                    (arguments[1] = function () {
                      4 === this.readyState &&
                        0 !== this.status &&
                        ((this[lt('cb_start')] = pt()), i.apply(this, arguments))
                    }),
                    n.apply(this, arguments)
                }
              }),
              (r = C(o, 'open', function () {
                return function (t, e) {
                  return t[N] || ((t[A] = e[0]), (t[F] = e[1]), (t[j] = !1 === e[2])), r.apply(t, e)
                }
              })),
              (i = C(o, 'send', function () {
                return function (n, r) {
                  if (n[N]) return i.apply(n, r)
                  var o = {
                    source: G,
                    state: '',
                    type: 'macroTask',
                    data: vt({ target: n, method: n[A], sync: n[j], url: n[F], status: '' }, { send: dt(r[0]) })
                  }
                  try {
                    return (
                      (function (n) {
                        var r
                        function i(t) {
                          r[R](
                            t,
                            function (t) {
                              ;(t = t.type) === e
                                ? 4 === r.readyState &&
                                  0 !== r.status &&
                                  (n.data && (n.data = vt({}, n.data, ht.call(r))), a(n, 'success'))
                                : ((t = 'load' === t ? 'success' : t),
                                  n.data && n.state !== P && (n.data = vt({}, n.data, ht.call(r))),
                                  a(n, t))
                            },
                            'apm'
                          )
                        }
                        n.state !== M &&
                          ((n.state = M),
                          t(M, n),
                          (r = n.data.target),
                          function () {
                            var t,
                              e = this
                            this.onreadystatechange &&
                              ((t = this.onreadystatechange),
                              (this.onreadystatechange = function () {
                                4 === e.readyState && 0 !== e.status && (e[lt('cb_start')] = pt()), t.call(e)
                              }))
                          }.call(r),
                          i(e),
                          i('load'),
                          i('timeout'),
                          i('error'),
                          i('abort'))
                      })(o),
                      i.apply(n, r)
                    )
                  } catch (n) {
                    throw (a(o, 'error'), n)
                  }
                }
              })))
          }
          for (var gt = ['click'], yt = {}, bt = 0; bt < gt.length; bt++) {
            var _t = gt[bt]
            yt[_t] = I(_t)
          }
          function Tt(t, e, n) {
            return t instanceof Element && 0 <= gt.indexOf(e) && 'function' == typeof n
          }
          var wt = (function () {
              function t() {
                this.observers = {}
              }
              var e = t.prototype
              return (
                (e.observe = function (t, e) {
                  var n = this
                  if ('function' == typeof e)
                    return (
                      this.observers[t] || (this.observers[t] = []),
                      this.observers[t].push(e),
                      function () {
                        var r = n.observers[t].indexOf(e)
                        ;-1 < r && n.observers[t].splice(r, 1)
                      }
                    )
                }),
                (e.sendOnly = function (t, e) {
                  ;(t = this.observers[t]) &&
                    t.forEach(function (t) {
                      try {
                        t.apply(void 0, e)
                      } catch (t) {}
                    })
                }),
                (e.send = function (t, e) {
                  this.sendOnly(t + ':before', e), this.sendOnly(t, e), this.sendOnly(t + ':after', e)
                }),
                t
              )
            })(),
            St = new wt(),
            Et = !1
          function xt() {
            var t, e
            return (
              Et ||
                ((Et = !0),
                mt(function (t, e) {
                  St.send(G, [t, e])
                }),
                (function (t) {
                  var e
                  function n(e) {
                    ;(e.state = P), t(P, e)
                  }
                  window.fetch &&
                    window.Request &&
                    ((e = window.fetch),
                    (window.fetch = function (r, o) {
                      var a,
                        s,
                        c = this,
                        u = arguments
                      if ('string' == typeof r) (a = new Request(r, o)), (s = r)
                      else {
                        if (!r) return e.apply(c, u)
                        s = (a = r).url
                      }
                      var f = {
                        source: W,
                        state: '',
                        type: 'macroTask',
                        data: { target: a, method: a.method, url: s, aborted: !1 }
                      }
                      return new i(function (r, i) {
                        var o, s
                        ;(O.fetchInProgress = !0), ((o = f).state = M), t(M, o)
                        try {
                          s = e.apply(c, [a])
                        } catch (o) {
                          return i(o), (f.data.error = o), n(f), void (O.fetchInProgress = !1)
                        }
                        s.then(
                          function (t) {
                            r(t),
                              x(function () {
                                ;(f.data.response = t), n(f)
                              })
                          },
                          function (t) {
                            i(t),
                              x(function () {
                                ;(f.data.error = t), n(f)
                              })
                          }
                        ),
                          (O.fetchInProgress = !1)
                      })
                    }))
                })(function (t, e) {
                  St.send(W, [t, e])
                }),
                (t = function (t, e) {
                  St.send(K, [t, e])
                }),
                !window.history ||
                  ('function' == typeof (e = history.pushState) &&
                    (history.pushState = function (n, r, i) {
                      t(P, { source: K, data: { state: n, title: r, url: i } }), e.apply(this, arguments)
                    })),
                (function (t) {
                  var e, n, r
                  function i(t, e, n, r) {
                    for (var i = 0; i < t.length; i++) {
                      var o = t[i]
                      if (o.eventType === e && o.listenerFn === n && o.capture === r) return i
                    }
                    return -1
                  }
                  function o(t) {
                    return (t = 'boolean' == typeof t ? t : !!t && !!t.capture)
                  }
                  window.EventTarget &&
                    ((e = window.EventTarget.prototype),
                    (n = e[R]),
                    (r = e[q]),
                    (e[R] = function (e, r, a) {
                      return Tt(this, e, r)
                        ? ((r = (function (e, n, r, a) {
                            var s = yt[n]
                            if (!s) return r
                            var c = e[s],
                              u = o(a)
                            if (c) {
                              if (-1 !== (a = i(c, n, r, u))) return c[a].wrappingFn
                            } else c = e[s] = []
                            var f = { source: Q, target: e, eventType: n, listenerFn: r, capture: u, wrappingFn: d }
                            function d() {
                              var e
                              t(M, f)
                              try {
                                e = r.apply(this, arguments)
                              } finally {
                                t(P, f)
                              }
                              return e
                            }
                            return c.push(f), d
                          })(this, e, r, a)),
                          ((a = Array.prototype.slice.call(arguments))[1] = r),
                          n.apply(this, a))
                        : n.apply(this, arguments)
                    }),
                    (e[q] = function (t, e, n) {
                      return Tt(this, t, e)
                        ? ((e = (function (t, e, n, r) {
                            var a = yt[e],
                              s = t[a]
                            return s && -1 !== (e = i(s, e, n, o(r)))
                              ? ((r = s[e]), s.splice(e, 1), 0 === s.length && (t[a] = void 0), r.wrappingFn)
                              : n
                          })(this, t, e, n)),
                          ((n = Array.prototype.slice.call(arguments))[1] = e),
                          r.apply(this, n))
                        : r.apply(this, arguments)
                    }))
                })(function (t, e) {
                  St.send(Q, [t, e])
                })),
              St
            )
          }
          var kt = { bootstrapTime: null, lastHiddenStart: Number.MIN_SAFE_INTEGER },
            Lt = !1
          function Ot() {
            return (
              a &&
                'function' == typeof Set &&
                'function' == typeof JSON.stringify &&
                s &&
                'function' == typeof s.now &&
                'withCredentials' in new window.XMLHttpRequest() &&
                (xt(),
                'hidden' === document.visibilityState && (kt.lastHiddenStart = 0),
                window.addEventListener(
                  'visibilitychange',
                  function () {
                    'hidden' === document.visibilityState && (kt.lastHiddenStart = performance.now())
                  },
                  { capture: !0 }
                ),
                (kt.bootstrapTime = w()),
                (Lt = !0)),
              Lt
            )
          }
          r = n(4)
          var It = n.n(r)
          var Ct = [
              ['#', 'hash'],
              ['?', 'query'],
              ['/', 'path'],
              ['@', 'auth', 1],
              [NaN, 'host', void 0, 1]
            ],
            Nt = /^([a-z][a-z0-9.+-]*:)?(\/\/)?([\S\s]*)/i,
            jt = (function () {
              function t(t) {
                t = (n = this.extractProtocol(t || '')).protocol
                var e = n.address,
                  n = n.slashes,
                  r = !t && !n,
                  i = this.getLocation(),
                  o = Ct.slice()
                ;(e = e.replace('\\', '/')), n || (o[2] = [NaN, 'path'])
                for (var a = 0; a < o.length; a++) {
                  var s,
                    c,
                    u = o[a],
                    f = u[0],
                    d = u[1]
                  'string' == typeof f
                    ? ~(c = e.indexOf(f)) &&
                      (e = (s = u[2])
                        ? ((f = e.lastIndexOf(f)), (c = Math.max(c, f)), (this[d] = e.slice(0, c)), e.slice(c + s))
                        : ((this[d] = e.slice(c)), e.slice(0, c)))
                    : ((this[d] = e), (e = '')),
                    (this[d] = this[d] || (r && u[3] && i[d]) || ''),
                    u[3] && (this[d] = this[d].toLowerCase())
                }
                r && '/' !== this.path.charAt(0) && (this.path = '/' + this.path),
                  (this.relative = r),
                  (this.protocol = t || i.protocol),
                  (this.hostname = this.host),
                  (this.port = ''),
                  /:\d+$/.test(this.host) &&
                    ((t = (n = this.host.split(':')).pop()),
                    (n = n.join(':')),
                    (function (t, e) {
                      switch (e) {
                        case 'http:':
                          return '80' === t
                        case 'https:':
                          return '443' === t
                      }
                      return 1
                    })(t, this.protocol)
                      ? (this.host = n)
                      : (this.port = t),
                    (this.hostname = n)),
                  (this.origin =
                    this.protocol && this.host && 'file:' !== this.protocol
                      ? this.protocol + '//' + this.host
                      : 'null'),
                  (this.href = this.toString())
              }
              var e = t.prototype
              return (
                (e.toString = function () {
                  var t,
                    e,
                    n = this.protocol
                  return (
                    (n += '//'),
                    this.auth &&
                      ((t = '[REDACTED]'),
                      (n += ((e = this.auth.split(':'))[0] ? t : '') + (e[1] ? ':' + t : '') + '@')),
                    (n += this.host),
                    (n += this.path),
                    (n += this.query) + this.hash
                  )
                }),
                (e.getLocation = function () {
                  var t = {}
                  return a && (t = window), t.location
                }),
                (e.extractProtocol = function (t) {
                  return { protocol: (t = Nt.exec(t))[1] ? t[1].toLowerCase() : '', slashes: !!t[2], address: t[3] }
                }),
                t
              )
            })(),
            Ft = 'external',
            At = 'resource',
            Mt = 'hard-navigation'
          function Pt(t) {
            var e = {
              transfer_size: t.transferSize,
              encoded_body_size: t.encodedBodySize,
              decoded_body_size: t.decodedBodySize
            }
            return (
              (t = (function (t) {
                void 0 === t && (t = [])
                for (var e = [], n = 0; n < t.length; n++) {
                  var r,
                    i = (r = t[n]).name,
                    o = r.duration
                  i = i
                  ;(r = r.description) && (i += ';desc=' + r), o && (i += ';dur=' + o), e.push(i)
                }
                return e.join(', ')
              })(t.serverTiming)) && (e.headers = { 'server-timing': t }),
              e
            )
          }
          function Rt(t, e) {
            var n = t.port,
              r = t.protocol,
              i = t.hostname,
              o = t.host,
              a =
                ((n = ((a = r), '' === (t = n) && (t = 'http:' === a ? '80' : 'https:' === a ? '443' : ''), t)),
                91 === i.charCodeAt(0) && 93 === i.charCodeAt(i.length - 1))
            t = i
            return (
              a && (t = i.slice(1, -1)),
              { service: { name: r + '//' + o, resource: i + ':' + n, type: e }, address: t, port: Number(n) }
            )
          }
          function qt() {
            return { page: { referer: document.referrer, url: location.href } }
          }
          function Ht() {
            return (Ht =
              Object.assign ||
              function (t) {
                for (var e = 1; e < arguments.length; e++) {
                  var n,
                    r = arguments[e]
                  for (n in r) Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
                }
                return t
              }).apply(this, arguments)
          }
          var $t = {
              service: { name: [ft, !0], version: !0, agent: { version: [ft, !0] }, environment: !0 },
              labels: { '*': !0 }
            },
            zt = Ht(
              {
                name: [ft, !0],
                type: [ft, !0],
                id: [ft, !0],
                trace_id: [ft, !0],
                parent_id: [ft, !0],
                transaction_id: [ft, !0],
                subtype: !0,
                action: !0,
                context: (r = {
                  user: { id: !0, email: !0, username: !0 },
                  tags: { '*': !0 },
                  http: { response: (n = { '*': !0, headers: { '*': !0 } }) },
                  destination: { address: [ft], service: { '*': [ft, !0] } },
                  response: n
                })
              },
              { extra: !0 }
            ),
            Dt = {
              name: !0,
              parent_id: !0,
              type: [ft, !0],
              id: [ft, !0],
              trace_id: [ft, !0],
              span_count: { started: [ft, !0] },
              context: r
            },
            Bt = {
              id: [ft, !0],
              trace_id: !0,
              transaction_id: !0,
              parent_id: !0,
              culprit: !0,
              exception: { type: !0 },
              transaction: { type: !0 },
              context: r
            }
          function Ut(t) {
            return null == t || '' === t || void 0 === t
          }
          function Vt(t, e, n) {
            var r,
              i,
              o =
                ((o = t[e]),
                (r = n[0]),
                (n = n[1]),
                void 0 === r && (r = ft),
                void 0 === n && (n = !1),
                void 0 === i && (i = 'N/A'),
                n && Ut(o) && (o = i),
                'string' == typeof o ? o.substring(0, r) : o)
            Ut(o) ? delete t[e] : (t[e] = o)
          }
          function Jt(t, e, n) {
            void 0 === t && (t = {}), void 0 === n && (n = e)
            for (var r = Object.keys(t), i = [], o = 0; o < r.length; o++)
              !(function (o) {
                o = r[o]
                var a = !0 === t[o] ? i : t[o]
                Array.isArray(a)
                  ? '*' === o
                    ? Object.keys(n).forEach(function (t) {
                        return Vt(n, t, a)
                      })
                    : Vt(n, o, a)
                  : Jt(a, e, n[o])
              })(o)
            return e
          }
          var Xt = ['stack', 'message'],
            Zt = (function () {
              function t(t, e, n) {
                ;(this._apmServer = t), (this._configService = e), (this._transactionService = n)
              }
              var e = t.prototype
              return (
                (e.createErrorDataModel = function (t) {
                  var e = (o = (function (t) {
                      var e = t.error,
                        n = t.filename,
                        r = t.lineno,
                        i = ((t = t.colno), [])
                      if (e)
                        try {
                          i = It.a.parse(e)
                        } catch (t) {}
                      return (
                        0 === i.length && (i = [{ fileName: n, lineNumber: r, columnNumber: t }]),
                        (function (t) {
                          return t.map(function (t) {
                            return (
                              t.functionName &&
                                (t.functionName = (function (t) {
                                  var e = t.split('/')
                                  return (
                                    (t = 1 < e.length ? ['Object', e[e.length - 1]].join('.') : e[0]),
                                    (t =
                                      1 <
                                      (e = (t = (t = t.replace(/.<$/gi, '.<anonymous>')).replace(
                                        /^Anonymous function$/,
                                        '<anonymous>'
                                      )).split('.')).length
                                        ? e[e.length - 1]
                                        : e[0])
                                  )
                                })(t.functionName)),
                              t
                            )
                          })
                        })(i).map(function (t) {
                          var e = t.fileName,
                            n = t.lineNumber,
                            r = t.columnNumber,
                            i = void 0 === (a = t.functionName) ? '<anonymous>' : a
                          if (!e && !n) return {}
                          if (!r && !n) return {}
                          var o,
                            a =
                              ((a = t = (void 0 === (o = e) && (o = ''), '<anonymous>' === o && (o = ''), o)),
                              (o =
                                window.location.origin ||
                                window.location.protocol +
                                  '//' +
                                  window.location.hostname +
                                  (window.location.port ? ':' + window.location.port : '')),
                              -1 < a.indexOf(o) && (a = a.replace(o + '/', '')),
                              a)
                          return (
                            (t = t) && 0 === window.location.href.indexOf(t) && (a = '(inline script)'),
                            { abs_path: e, filename: a, function: i, lineno: n, colno: r }
                          )
                        })
                      )
                    })(t)).filter(function (t) {
                      var e = t.filename
                      t = t.lineno
                      return void 0 !== e && void 0 !== t
                    }),
                    n = '(inline script)'
                  ;(a = e[e.length - 1]) && a.filename && (n = a.filename)
                  var r = t.message,
                    i = t.error,
                    o = r,
                    a = ''
                  t = {}
                  i &&
                    'object' == typeof i &&
                    ((o = o || i.message),
                    (a = i.name),
                    (s = (function (t) {
                      var e = !1,
                        n = {}
                      if (
                        (Object.keys(t).forEach(function (r) {
                          if (!(0 <= Xt.indexOf(r))) {
                            var i = t[r]
                            if (null != i && 'function' != typeof i) {
                              if ('object' == typeof i) {
                                if ('function' != typeof i.toISOString) return
                                i = i.toISOString()
                              }
                              ;(n[r] = i), (e = !0)
                            }
                          }
                        }),
                        e)
                      )
                        return n
                    })(i)) && (t.custom = s)),
                    a || (o && -1 < o.indexOf(':') && (a = o.split(':')[0]))
                  i = (r = this._transactionService.getCurrentTransaction()) ? r.context : {}
                  var s =
                    ((s = this._configService.get('context')).tags,
                    (function (t, e) {
                      if (null == t) return {}
                      for (var n, r = {}, i = Object.keys(t), o = 0; o < i.length; o++)
                        (n = i[o]), 0 <= e.indexOf(n) || (r[n] = t[n])
                      return r
                    })(s, ['tags']))
                  ;(t = y({}, qt(), i, s, t)),
                    (t = { id: d(), culprit: n, exception: { message: o, stacktrace: e, type: a }, context: t })
                  return (
                    r &&
                      (t = g(t, {
                        trace_id: r.traceId,
                        parent_id: r.id,
                        transaction_id: r.id,
                        transaction: { type: r.type, sampled: r.sampled }
                      })),
                    Jt(Bt, t)
                  )
                }),
                (e.logErrorEvent = function (t) {
                  void 0 === t ||
                    (void 0 !== (t = this.createErrorDataModel(t)).exception.message && this._apmServer.addError(t))
                }),
                (e.registerListeners = function () {
                  var t = this
                  window.addEventListener('error', function (e) {
                    return t.logErrorEvent(e)
                  }),
                    window.addEventListener('unhandledrejection', function (e) {
                      return t.logPromiseEvent(e)
                    })
                }),
                (e.logPromiseEvent = function (t) {
                  var e = 'Unhandled promise rejection: '
                  ;(t =
                    'string' == typeof (t = void 0 === (t = t.reason) ? '<no reason specified>' : t).message
                      ? { error: t, message: e + (t.name ? t.name + ': ' : '') + t.message }
                      : {
                          message:
                            e + (t = 'object' == typeof t ? '<object>' : 'function' == typeof t ? '<function>' : t)
                        }),
                    this.logErrorEvent(t)
                }),
                (e.logError = function (t) {
                  var e = {}
                  return 'string' == typeof t ? (e.message = t) : (e.error = t), this.logErrorEvent(e)
                }),
                t
              )
            })(),
            Gt = (function () {
              function t(t, e) {
                void 0 === e && (e = {}),
                  (this.onFlush = t),
                  (this.items = []),
                  (this.queueLimit = e.queueLimit || -1),
                  (this.flushInterval = e.flushInterval || 0),
                  (this.timeoutId = void 0)
              }
              var e = t.prototype
              return (
                (e._setTimer = function () {
                  var t = this
                  this.timeoutId = setTimeout(function () {
                    return t.flush()
                  }, this.flushInterval)
                }),
                (e._clear = function () {
                  void 0 !== this.timeoutId && (clearTimeout(this.timeoutId), (this.timeoutId = void 0)),
                    (this.items = [])
                }),
                (e.flush = function () {
                  this.onFlush(this.items), this._clear()
                }),
                (e.add = function (t) {
                  this.items.push(t),
                    -1 !== this.queueLimit && this.items.length >= this.queueLimit
                      ? this.flush()
                      : void 0 === this.timeoutId && this._setTimer()
                }),
                t
              )
            })(),
            Wt = (function () {
              function t() {}
              return (
                (t.stringify = function (t) {
                  return JSON.stringify(t) + '\n'
                }),
                t
              )
            })(),
            Kt = (function (t) {
              var e, n
              function r(e, n, r) {
                return (
                  ((n = t.call(this, e, n, r) || this).parentId = n.options.parentId),
                  (n.subtype = void 0),
                  (n.action = void 0),
                  -1 !== n.type.indexOf('.') &&
                    ((r = n.type.split('.', 3)), (n.type = r[0]), (n.subtype = r[1]), (n.action = r[2])),
                  (n.sync = n.options.sync),
                  n
                )
              }
              return (
                (n = t),
                ((e = r).prototype = Object.create(n.prototype)),
                ((e.prototype.constructor = e).__proto__ = n),
                (r.prototype.end = function (e, n) {
                  t.prototype.end.call(this, e),
                    (function (t, e) {
                      if (e) {
                        var n, r, i, o, a, s, c, u
                        switch (t.type) {
                          case Ft:
                            ;(a = (i = e).url),
                              (s = i.method),
                              (c = i.target),
                              (u = i.response),
                              (a = Rt((i = new jt(a)), Ft)),
                              (a = { http: { method: s, url: i.href }, destination: a }),
                              c && void 0 !== c.status ? (o = c.status) : u && (o = u.status),
                              (a.http.status_code = o),
                              (n = a)
                            break
                          case At:
                            ;(o = (r = e).entry),
                              (a = r.url),
                              (r = Rt(new jt(a), At)),
                              (n = { http: { url: a, response: Pt(o) }, destination: r })
                            break
                          case Mt:
                            ;(r = (r = e).url), (n = { destination: Rt(new jt(r), Mt) })
                        }
                        t.addContext(n)
                      }
                    })(this, n)
                }),
                r
              )
            })(
              (n = (function () {
                function t(t, e, n) {
                  void 0 === n && (n = {}),
                    (t = t || V),
                    (e = e || 'custom'),
                    (this.name = t),
                    (this.type = e),
                    (this.options = n),
                    (this.id = n.id || d(16)),
                    (this.traceId = n.traceId),
                    (this.sampled = n.sampled),
                    (this.timestamp = n.timestamp),
                    (this._start = S(n.startTime)),
                    (this._end = void 0),
                    (this.ended = !1),
                    (this.outcome = void 0),
                    (this.onEnd = n.onEnd)
                }
                var e = t.prototype
                return (
                  (e.ensureContext = function () {
                    this.context || (this.context = {})
                  }),
                  (e.addLabels = function (t) {
                    this.ensureContext()
                    var e = this.context
                    e.tags || (e.tags = {}),
                      Object.keys(t).forEach(function (n) {
                        return p(n, t[n], e.tags)
                      })
                  }),
                  (e.addContext = function () {
                    for (var t = arguments.length, e = new Array(t), n = 0; n < t; n++) e[n] = arguments[n]
                    0 !== e.length && (this.ensureContext(), y.apply(void 0, [this.context].concat(e)))
                  }),
                  (e.end = function (t) {
                    this.ended || ((this.ended = !0), (this._end = S(t)), this.callOnEnd())
                  }),
                  (e.callOnEnd = function () {
                    'function' == typeof this.onEnd && this.onEnd(this)
                  }),
                  (e.duration = function () {
                    return E(this._start, this._end)
                  }),
                  t
                )
              })())
            ),
            Qt = [
              ['domainLookupStart', 'domainLookupEnd', 'Domain lookup'],
              ['connectStart', 'connectEnd', 'Making a connection to the server'],
              ['requestStart', 'responseEnd', 'Requesting and receiving the document'],
              ['domLoading', 'domInteractive', 'Parsing the document, executing sync. scripts'],
              ['domContentLoadedEventStart', 'domContentLoadedEventEnd', 'Fire "DOMContentLoaded" event'],
              ['loadEventStart', 'loadEventEnd', 'Fire "load" event']
            ]
          function Yt(t, e, n, r, i) {
            return (
              void 0 === i && (i = 0),
              'number' == typeof t &&
                'number' == typeof e &&
                i <= t &&
                t < e &&
                n <= t - i &&
                e - i <= r &&
                e - t < $ &&
                t - i < $ &&
                e - i < $
            )
          }
          var te = [
              'fetchStart',
              'domainLookupStart',
              'domainLookupEnd',
              'connectStart',
              'connectEnd',
              'requestStart',
              'responseStart',
              'responseEnd',
              'domLoading',
              'domInteractive',
              'domContentLoadedEventStart',
              'domContentLoadedEventEnd',
              'domComplete',
              'loadEventStart',
              'loadEventEnd'
            ],
            ee = ['fs', 'ls', 'le', 'cs', 'ce', 'qs', 'rs', 're', 'dl', 'di', 'ds', 'de', 'dc', 'es', 'ee']
          function ne(t) {
            var e, n, r
            t.captureTimings &&
              ((e = t._end),
              t.type === z &&
                (t.marks &&
                  t.marks.custom &&
                  ((n = t.marks.custom),
                  Object.keys(n).forEach(function (e) {
                    n[e] += t._start
                  })),
                (t._start = 0),
                (function (t, e, n, r) {
                  for (var i = [], o = 0; o < Qt.length; o++) {
                    var a,
                      s,
                      c = t[Qt[o][0]],
                      u = t[Qt[o][1]]
                    Yt(c, u, 0, r, e) &&
                      ((a = new Kt(Qt[o][2], 'hard-navigation.browser-timing')),
                      (s = null),
                      'requestStart' === Qt[o][0] && ((a.pageResponse = !0), (s = { url: location.origin })),
                      (a._start = c - e),
                      a.end(u - e, s),
                      i.push(a))
                  }
                  return i
                })((r = s.timing), r.fetchStart, 0, e).forEach(function (e) {
                  ;(e.traceId = t.traceId),
                    (e.sampled = t.sampled),
                    e.pageResponse && t.options.pageLoadSpanId && (e.id = t.options.pageLoadSpanId),
                    t.spans.push(e)
                }),
                t.addMarks(
                  (function (t) {
                    return null ==
                      (t = (function (t) {
                        var e = t.fetchStart,
                          n = t.navigationStart,
                          r = t.responseStart,
                          i = t.responseEnd
                        if (n <= e && e <= r && r <= i) {
                          var o = {}
                          return (
                            te.forEach(function (n) {
                              var r = t[n]
                              r && e <= r && (o[n] = parseInt(r - e))
                            }),
                            o
                          )
                        }
                        return null
                      })(t))
                      ? null
                      : {
                          navigationTiming: t,
                          agent: {
                            timeToFirstByte: t.responseStart,
                            domInteractive: t.domInteractive,
                            domComplete: t.domComplete
                          }
                        }
                  })(r)
                )),
              k() &&
                ((r = t._start),
                (function (t, e, n, r) {
                  for (var i, o, a = [], s = 0; s < t.length; s++) {
                    var c = (d = t[s]).initiatorType,
                      u = d.name,
                      f = d.startTime,
                      d = d.responseEnd
                    ;-1 !== H.indexOf(c) &&
                      null != u &&
                      (('xmlhttprequest' !== c && 'fetch' !== c) ||
                        !(/intake\/v\d+\/rum\/events/.test(u) || ((i = f), null != (o = e) && o < i))) &&
                      Yt(f, d, n, r) &&
                      a.push(
                        ((d = f = i = o = u = void 0),
                        (u = (c = t[s]).name),
                        (o = c.initiatorType),
                        (i = c.startTime),
                        (f = c.responseEnd),
                        (d = 'resource'),
                        o && (d += '.' + o),
                        (o = h(u)),
                        ((d = new Kt(o, d))._start = i),
                        d.end(f, { url: u, entry: c }),
                        d)
                      )
                  }
                  return a
                })(s.getEntriesByType('resource'), kt.bootstrapTime, r, e).forEach(function (e) {
                  return t.spans.push(e)
                }),
                (function (t, e, n) {
                  for (var r = [], i = 0; i < t.length; i++) {
                    var o = (c = t[i]).name,
                      a = c.startTime,
                      s = c.duration,
                      c = a + s
                    s <= 60 || !Yt(a, c, e, n) || (((o = new Kt(o, 'app'))._start = a), o.end(c), r.push(o))
                  }
                  return r
                })(s.getEntriesByType('measure'), r, e).forEach(function (e) {
                  return t.spans.push(e)
                })))
          }
          function re(t) {
            return { ts: t.transfer_size, ebs: t.encoded_body_size, dbs: t.decoded_body_size }
          }
          function ie(t) {
            if (!t) return null
            var e,
              n,
              r = {},
              i = t.page,
              o = t.http,
              a = t.response,
              s = t.destination,
              c = t.user,
              u = t.custom
            return (
              i && (r.p = { rf: i.referer, url: i.url }),
              o &&
                (r.h =
                  ((n = {}),
                  (t = (e = o).method),
                  (i = e.status_code),
                  (o = e.url),
                  (e = e.response),
                  (n.url = o),
                  t && (n.mt = t),
                  i && (n.sc = i),
                  e && (n.r = re(e)),
                  n)),
              a && (r.r = re(a)),
              s &&
                ((a = s.service), (r.dt = { se: { n: a.name, t: a.type, rc: a.resource }, ad: s.address, po: s.port })),
              c && (r.u = { id: c.id, un: c.username, em: c.email }),
              u && (r.cu = u),
              r
            )
          }
          var oe = (function () {
            function t(t, e) {
              ;(this._configService = t), (this._loggingService = e), (this.queue = void 0), (this.throttleEvents = _)
            }
            var e = t.prototype
            return (
              (e.init = function () {
                var t = this,
                  e = this._configService.get('queueLimit'),
                  n = this._configService.get('flushInterval'),
                  r = this._configService.get('eventsLimit')
                ;(this.queue = new Gt(
                  function (e) {
                    ;(e = t.sendEvents(e)) &&
                      e.catch(function (e) {
                        t._loggingService.warn('Failed sending events!', t._constructError(e))
                      })
                  },
                  { queueLimit: e, flushInterval: n }
                )),
                  (this.throttleEvents = (function (t, e, n) {
                    var r,
                      i = this,
                      o = n.limit,
                      a = n.interval,
                      s = 0
                    return function () {
                      return (
                        s++,
                        void 0 === r &&
                          (r = setTimeout(function () {
                            r = void (s = 0)
                          }, a)),
                        (o < s ? e : t).apply(i, arguments)
                      )
                    }
                  })(
                    this.queue.add.bind(this.queue),
                    function () {
                      return t._loggingService.warn('Dropped events due to throttling!')
                    },
                    { limit: r, interval: 6e4 }
                  ))
              }),
              (e._postJson = function (t, e) {
                var n = this,
                  r = { 'Content-Type': 'application/x-ndjson' }
                return (function (t, e, n) {
                  void 0 === n && (n = 'gzip')
                  var r = 'function' == typeof CompressionStream
                  return new i(function (i) {
                    if (!r) return i({ payload: t, headers: e })
                    var o = new Blob([t]).stream().pipeThrough(new CompressionStream(n))
                    return new Response(o).blob().then(function (t) {
                      return (e['Content-Encoding'] = n), i({ payload: t, headers: e })
                    })
                  })
                })(e, r)
                  .catch(function (t) {
                    return { payload: e, headers: r }
                  })
                  .then(function (e) {
                    return n._makeHttpRequest('POST', t, e)
                  })
                  .then(function (t) {
                    return t.responseText
                  })
              }),
              (e._constructError = function (t) {
                var e = t.url,
                  n = t.status
                return t.responseText, void 0 === n ? t : ((n = e + ' HTTP status: ' + n), new Error(n))
              }),
              (e._makeHttpRequest = function (t, e, n) {
                var r = void 0 === n ? {} : n,
                  o = void 0 === (n = r.timeout) ? 1e4 : n,
                  a = r.payload,
                  s = r.headers
                return new i(function (n, r) {
                  var i = new window.XMLHttpRequest()
                  if (((i[N] = !0), i.open(t, e, !0), (i.timeout = o), s))
                    for (var c in s) s.hasOwnProperty(c) && i.setRequestHeader(c, s[c])
                  ;(i.onreadystatechange = function () {
                    var t, o
                    4 === i.readyState &&
                      ((t = i.status),
                      (o = i.responseText),
                      0 === t || (399 < t && t < 600) ? r({ url: e, status: t, responseText: o }) : n(i))
                  }),
                    (i.onerror = function () {
                      var t = i.status,
                        n = i.responseText
                      r({ url: e, status: t, responseText: n })
                    }),
                    i.send(a)
                })
              }),
              (e.fetchConfig = function (t, e) {
                var n = this,
                  r = this._configService.get('serverUrl') + '/config/v1/rum/agents'
                if (!t) return i.reject('serviceName is required for fetching central config.')
                ;(r += '?service.name=' + t), e && (r += '&service.environment=' + e)
                var o = this._configService.getLocalConfig()
                return (
                  o && (r += '&ifnonematch=' + o.etag),
                  this._makeHttpRequest('GET', r, { timeout: 5e3 })
                    .then(function (t) {
                      var e = t.status,
                        r = t.responseText
                      return 304 === e
                        ? o
                        : ((r = JSON.parse(r)),
                          (t = t.getResponseHeader('etag')) &&
                            ((r.etag = t.replace(/["]/g, '')), n._configService.setLocalConfig(r)),
                          r)
                    })
                    .catch(function (t) {
                      return (t = n._constructError(t)), i.reject(t)
                    })
                )
              }),
              (e.createMetaData = function () {
                var t = {
                  service: {
                    name: (t = this._configService).get('serviceName'),
                    version: t.get('serviceVersion'),
                    agent: { name: 'rum-js', version: t.version },
                    language: { name: 'javascript' },
                    environment: t.get('environment')
                  },
                  labels: t.get('context.tags')
                }
                return Jt($t, t)
              }),
              (e.addError = function (t) {
                var e
                this.throttleEvents((((e = {})[it] = t), e))
              }),
              (e.addTransaction = function (t) {
                var e
                this.throttleEvents((((e = {})[ot] = t), e))
              }),
              (e.ndjsonErrors = function (t, e) {
                var n = e ? 'e' : 'error'
                return t.map(function (t) {
                  var r, i, o, a
                  return Wt.stringify(
                    (((r = {})[n] = e
                      ? ((o = (i = t).exception),
                        (a = {
                          id: i.id,
                          cl: i.culprit,
                          ex: {
                            mg: o.message,
                            st: o.stacktrace.map(function (t) {
                              return { ap: t.abs_path, f: t.filename, fn: t.function, li: t.lineno, co: t.colno }
                            }),
                            t: i.type
                          },
                          c: ie(i.context)
                        }),
                        (o = i.transaction) &&
                          ((a.tid = i.trace_id),
                          (a.pid = i.parent_id),
                          (a.xid = i.transaction_id),
                          (a.x = { t: o.type, sm: o.sampled })),
                        a)
                      : t),
                    r)
                  )
                })
              }),
              (e.ndjsonMetricsets = function (t) {
                return t
                  .map(function (t) {
                    return Wt.stringify({ metricset: t })
                  })
                  .join('')
              }),
              (e.ndjsonTransactions = function (t, e) {
                var n = this,
                  r = e ? 'x' : 'transaction'
                return t.map(function (t) {
                  var i,
                    o = '',
                    a = ''
                  return (
                    e ||
                      (t.spans &&
                        ((o = t.spans
                          .map(function (t) {
                            return Wt.stringify({ span: t })
                          })
                          .join('')),
                        delete t.spans),
                      t.breakdown && ((a = n.ndjsonMetricsets(t.breakdown)), delete t.breakdown)),
                    Wt.stringify(
                      (((i = {})[r] = e
                        ? (function (t) {
                            var e,
                              n,
                              r,
                              i = t.spans.map(function (e) {
                                var n = {
                                  id: e.id,
                                  n: e.name,
                                  t: e.type,
                                  s: e.start,
                                  d: e.duration,
                                  c: ie(e.context),
                                  o: e.outcome
                                }
                                return (
                                  e.parent_id !== t.id && (n.pid = e.parent_id),
                                  !0 === e.sync && (n.sy = !0),
                                  e.subtype && (n.su = e.subtype),
                                  e.action && (n.ac = e.action),
                                  n
                                )
                              }),
                              o = {
                                id: t.id,
                                tid: t.trace_id,
                                n: t.name,
                                t: t.type,
                                d: t.duration,
                                c: ie(t.context),
                                m: (function (t) {
                                  if (!t) return null
                                  var e = t.navigationTiming,
                                    n = t.agent,
                                    r = { nt: {} }
                                  return (
                                    ee.forEach(function (t, n) {
                                      ;(n = te[n]), (r.nt[t] = e[n])
                                    }),
                                    (r.a = { fb: r.nt.rs, di: r.nt.di, dc: r.nt.dc }),
                                    (t = n.firstContentfulPaint),
                                    (n = n.largestContentfulPaint),
                                    t && (r.a.fp = t),
                                    n && (r.a.lp = n),
                                    r
                                  )
                                })(t.marks),
                                me: t.breakdown.map(function (t) {
                                  var e = t.span
                                  t = t.samples
                                  return null != e
                                    ? {
                                        y: { t: e.type },
                                        sa: {
                                          ysc: { v: t['span.self_time.count'].value },
                                          yss: { v: t['span.self_time.sum.us'].value }
                                        }
                                      }
                                    : {
                                        sa: {
                                          xdc: { v: t['transaction.duration.count'].value },
                                          xds: { v: t['transaction.duration.sum.us'].value },
                                          xbc: { v: t['transaction.breakdown.count'].value }
                                        }
                                      }
                                }),
                                y: i,
                                yc: { sd: i.length },
                                sm: t.sampled,
                                o: t.outcome
                              }
                            return (
                              t.experience &&
                                ((e = (r = t.experience).cls),
                                (n = r.fid),
                                (i = r.tbt),
                                (r = r.longtask),
                                (o.exp = { cls: e, fid: n, tbt: i, lt: r })),
                              o
                            )
                          })(t)
                        : t),
                      i)
                    ) +
                      o +
                      a
                  )
                })
              }),
              (e.sendEvents = function (t) {
                var e
                if (0 !== t.length) {
                  for (var n = [], r = [], i = 0; i < t.length; i++) {
                    var o = t[i]
                    o[ot] && n.push(o[ot]), o[it] && r.push(o[it])
                  }
                  if (0 !== n.length || 0 !== r.length) {
                    var a = this._configService,
                      s = (((f = {})[ot] = n), (f[it] = r), f),
                      c = a.applyFilters(s)
                    if (c) {
                      var u,
                        f,
                        d = a.get('apiVersion'),
                        l = 2 < d,
                        p = [],
                        h = this.createMetaData(),
                        v = l ? 'm' : 'metadata'
                      return (
                        p.push(
                          Wt.stringify(
                            (((e = {})[v] = l
                              ? ((f = (u = h).service),
                                (s = u.labels),
                                (v = f.agent),
                                (u = f.language),
                                {
                                  se: {
                                    n: f.name,
                                    ve: f.version,
                                    a: { n: v.name, ve: v.version },
                                    la: { n: u.name },
                                    en: f.environment
                                  },
                                  l: s
                                })
                              : h),
                            e)
                          )
                        ),
                        (p = (p = p.concat(this.ndjsonErrors(c[it], l), this.ndjsonTransactions(c[ot], l))).join('')),
                        (d = a.get('serverUrl') + '/intake/v' + d + '/rum/events'),
                        this._postJson(d, p)
                      )
                    }
                    this._loggingService.warn('Dropped payload due to filtering!')
                  }
                }
              }),
              t
            )
          })()
          function ae() {
            return (function (t) {
              if (!t) return {}
              for (var e = {}, n = /^data-([\w-]+)$/, r = t.attributes, i = 0; i < r.length; i++) {
                var o = r[i]
                n.test(o.nodeName) &&
                  (e[
                    o.nodeName
                      .match(n)[1]
                      .split('-')
                      .map(function (t, e) {
                        return 0 < e ? t.charAt(0).toUpperCase() + t.substring(1) : t
                      })
                      .join('')
                  ] = o.value || o.nodeValue)
              }
              return e
            })(
              (function () {
                if ('undefined' != typeof document) {
                  var t = document.currentScript
                  return (
                    t ||
                    (function () {
                      if ('undefined' != typeof document)
                        for (var t = document.getElementsByTagName('script'), e = 0, n = t.length; e < n; e++) {
                          var r = t[e]
                          if (0 < r.src.indexOf('elastic')) return r
                        }
                    })()
                  )
                }
              })()
            )
          }
          var se = (function () {
              function t() {
                ;(this.config = {
                  serviceName: '',
                  serviceVersion: '',
                  environment: '',
                  serverUrl: 'http://localhost:8200',
                  active: !0,
                  instrument: !0,
                  disableInstrumentations: [],
                  logLevel: 'warn',
                  breakdownMetrics: !1,
                  ignoreTransactions: [],
                  eventsLimit: 80,
                  queueLimit: -1,
                  flushInterval: 500,
                  distributedTracing: !0,
                  distributedTracingOrigins: [],
                  distributedTracingHeaderName: 'traceparent',
                  pageLoadTraceId: '',
                  pageLoadSpanId: '',
                  pageLoadSampled: !1,
                  pageLoadTransactionName: '',
                  transactionSampleRate: 1,
                  centralConfig: !1,
                  monitorLongtasks: !0,
                  apiVersion: 2,
                  context: {}
                }),
                  (this.events = new wt()),
                  (this.filters = []),
                  (this.version = '')
              }
              var e = t.prototype
              return (
                (e.init = function () {
                  var t = ae()
                  this.setConfig(t)
                }),
                (e.setVersion = function (t) {
                  this.version = t
                }),
                (e.addFilter = function (t) {
                  if ('function' != typeof t) throw new Error('Argument to must be function')
                  this.filters.push(t)
                }),
                (e.applyFilters = function (t) {
                  for (var e = 0; e < this.filters.length; e++) if (!(t = this.filters[e](t))) return
                  return t
                }),
                (e.get = function (t) {
                  return t.split('.').reduce(function (t, e) {
                    return t && t[e]
                  }, this.config)
                }),
                (e.setUserContext = function (t) {
                  void 0 === t && (t = {})
                  var e = {},
                    n = t.id,
                    r = t.username
                  t = t.email
                  ;('number' != typeof n && 'string' != typeof n) || (e.id = n),
                    'string' == typeof r && (e.username = r),
                    'string' == typeof t && (e.email = t),
                    (this.config.context.user = g(this.config.context.user || {}, e))
                }),
                (e.setCustomContext = function (t) {
                  void 0 === t && (t = {}), (this.config.context.custom = g(this.config.context.custom || {}, t))
                }),
                (e.addLabels = function (t) {
                  var e = this
                  this.config.context.tags || (this.config.context.tags = {}),
                    Object.keys(t).forEach(function (n) {
                      return p(n, t[n], e.config.context.tags)
                    })
                }),
                (e.setConfig = function (t) {
                  void 0 === t && (t = {})
                  var e = t.transactionSampleRate,
                    n = t.serverUrl
                  n && (t.serverUrl = n.replace(/\/+$/, '')),
                    b(e) || (e < 1e-4 && 0 < e && (e = 1e-4), (t.transactionSampleRate = Math.round(1e4 * e) / 1e4)),
                    y(this.config, t),
                    this.events.send(Z, [this.config])
                }),
                (e.validate = function (t) {
                  void 0 === t && (t = {})
                  var e = ['serviceName', 'serverUrl'],
                    n = { missing: [], invalid: [] }
                  Object.keys(t).forEach(function (r) {
                    ;-1 === e.indexOf(r) || t[r] || n.missing.push(r)
                  }),
                    t.serviceName &&
                      !/^[a-zA-Z0-9 _-]+$/.test(t.serviceName) &&
                      n.invalid.push({
                        key: 'serviceName',
                        value: t.serviceName,
                        allowed: 'a-z, A-Z, 0-9, _, -, <space>'
                      })
                  var r = t.transactionSampleRate
                  return (
                    void 0 !== r &&
                      ('number' != typeof r || isNaN(r) || r < 0 || 1 < r) &&
                      n.invalid.push({ key: 'transactionSampleRate', value: r, allowed: 'Number between 0 and 1' }),
                    n
                  )
                }),
                (e.getLocalConfig = function () {
                  var t = sessionStorage.getItem(Y)
                  if (t) return JSON.parse(t)
                }),
                (e.setLocalConfig = function (t) {
                  t && sessionStorage.setItem(Y, JSON.stringify(t))
                }),
                t
              )
            })(),
            ce = (function () {
              function t(t) {
                void 0 === t && (t = {}),
                  (this.levels = ['trace', 'debug', 'info', 'warn', 'error']),
                  (this.level = t.level || 'warn'),
                  (this.prefix = t.prefix || ''),
                  this.resetLogMethods()
              }
              var e = t.prototype
              return (
                (e.shouldLog = function (t) {
                  return this.levels.indexOf(t) >= this.levels.indexOf(this.level)
                }),
                (e.setLevel = function (t) {
                  t !== this.level && ((this.level = t), this.resetLogMethods())
                }),
                (e.resetLogMethods = function () {
                  var t = this
                  this.levels.forEach(function (e) {
                    t[e] = t.shouldLog(e)
                      ? function () {
                          var t = e
                          ;('trace' !== e && 'debug' !== e) || (t = 'info')
                          var n,
                            r = arguments
                          ;(r[0] = this.prefix + r[0]),
                            console && 'function' == typeof (n = console[t] || console.log) && n.apply(console, r)
                        }
                      : _
                  })
                }),
                t
              )
            })(),
            ue =
              (((r = {})[at] = function () {
                return new se()
              }),
              (r[st] = function () {
                return new ce({ prefix: '[Elastic APM] ' })
              }),
              (r[ct] = function (t) {
                t = (e = t.getService([at, st]))[0]
                var e = e[1]
                return new oe(t, e)
              }),
              r),
            fe = (function () {
              function t() {
                ;(this.instances = {}), (this.initialized = !1)
              }
              var e = t.prototype
              return (
                (e.init = function () {
                  var t, e, n
                  this.initialized ||
                    ((this.initialized = !0),
                    (t = this.getService(at)).init(),
                    (n = this.getService([st, ct])),
                    (e = n[0]),
                    (n = n[1]),
                    t.events.observe(Z, function () {
                      var n = t.get('logLevel')
                      e.setLevel(n)
                    }),
                    n.init())
                }),
                (e.getService = function (t) {
                  var e = this
                  return 'string' == typeof t
                    ? (this.instances[t] || ('function' == typeof ue[t] && (this.instances[t] = ue[t](this))),
                      this.instances[t])
                    : Array.isArray(t)
                    ? t.map(function (t) {
                        return e.getService(t)
                      })
                    : void 0
                }),
                t
              )
            })()
          function de() {
            return (de =
              Object.assign ||
              function (t) {
                for (var e = 1; e < arguments.length; e++) {
                  var n,
                    r = arguments[e]
                  for (n in r) Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n])
                }
                return t
              }).apply(this, arguments)
          }
          var le = (function () {
              function t(t, e, n, r) {
                ;(this._apmServer = t),
                  (this._configService = e),
                  (this._logginService = n),
                  (this._transactionService = r)
              }
              var e = t.prototype
              return (
                (e.init = function (t) {
                  var e = this
                  void 0 === t && (t = {}),
                    this._configService.events.observe(X + ':after', function (t) {
                      ;(t = e.createTransactionPayload(t)) && e._apmServer.addTransaction(t)
                    }),
                    t[K] && St.observe(K, this.getHistorySub()),
                    t[G] && St.observe(G, this.getXHRSub()),
                    t[W] && St.observe(W, this.getFetchSub()),
                    t[Q] && St.observe(Q, this.getEventTargetSub())
                }),
                (e.getEventTargetSub = function () {
                  var t = this._transactionService
                  return function (e, n) {
                    var r
                    e === M &&
                      n.source === Q &&
                      'click' === n.eventType &&
                      ((n = (e = (r = n.target).getAttribute('name')) ? '["' + e + '"]' : ''),
                      (e = r.tagName.toLowerCase()),
                      !(n = t.startTransaction('Click - ' + e + n, D, {
                        managed: !0,
                        canReuse: !0,
                        reuseThreshold: 100
                      })) ||
                        ((r = r.getAttribute('class')) && n.addContext({ custom: { classes: r } })))
                  }
                }),
                (e.getHistorySub = function () {
                  var t = this._transactionService
                  return function (e, n) {
                    n.source === K &&
                      e === P &&
                      t.startTransaction(n.data.title, 'route-change', { managed: !0, canReuse: !0 })
                  }
                }),
                (e.getXHRSub = function () {
                  var t = this
                  return function (e, n) {
                    n.source !== G || O.fetchInProgress || t.processAPICalls(e, n)
                  }
                }),
                (e.getFetchSub = function () {
                  var t = this
                  return function (e, n) {
                    n.source === W && t.processAPICalls(e, n)
                  }
                }),
                (e.processAPICalls = function (t, e) {
                  var n,
                    r,
                    i,
                    o,
                    a,
                    s,
                    c = this._configService,
                    u = this._transactionService
                  t === M && e.data
                    ? ((o = e.data),
                      (r = new jt(o.url)),
                      (i = o.method + ' ' + (r.relative ? r.path : h(r.href))),
                      u.getCurrentTransaction() || u.startTransaction(i, B, { managed: !0 }),
                      (a = u.startSpan(i, 'external.http', { blocking: !0 })) &&
                        ((n = c.get('distributedTracing')),
                        (i = c.get('distributedTracingOrigins')),
                        (c = new jt(window.location.href)),
                        (r = l(r.origin, c.origin) || l(r.origin, i)),
                        (i = o.target),
                        n && r && i && this.injectDtHeader(a, i),
                        o.sync && (a.sync = o.sync),
                        (o.span = a)))
                    : t !== P ||
                      ((o = e.data) &&
                        o.span &&
                        ((a = o.span),
                        (t = o.response),
                        (e = o.target),
                        (t = (t || e).status),
                        'abort' != o.status && (s = 400 <= t || 0 == t ? 'failure' : 'success'),
                        (a.outcome = s),
                        (a.extra =
                          ((e = o),
                          (t = a).addLabels({ extra_callbackTime: e.callbackTime }),
                          t.addLabels({ extra_send: e.send }),
                          t.addLabels({ extra_receive: e.receive }),
                          { callbackTime: e.callbackTime || 0, send: e.send || 0, receive: e.receive || 0 })),
                        (e = u.getCurrentTransaction()) && e.type === B && (e.outcome = s),
                        u.endSpan(a, o)))
                }),
                (e.injectDtHeader = function (t, e) {
                  var n = this._configService.get('distributedTracingHeaderName'),
                    r = (function (t) {
                      if (t && t.traceId && t.id && t.parentId) {
                        var e = t.sampled ? '01' : '00',
                          n = t.sampled ? t.id : t.parentId
                        return '00-' + t.traceId + '-' + n + '-' + e
                      }
                    })(t)
                  t =
                    /^[\da-f]{2}-[\da-f]{32}-[\da-f]{16}-[\da-f]{2}$/.test((t = r)) &&
                    '00000000000000000000000000000000' !== t.slice(3, 35) &&
                    '0000000000000000' !== t.slice(36, 52)
                  n &&
                    r &&
                    t &&
                    ('function' == typeof e.setRequestHeader
                      ? e.setRequestHeader(n, r)
                      : e.headers && 'function' == typeof e.headers.append
                      ? e.headers.append(n, r)
                      : (e[n] = r))
                }),
                (e.extractDtHeader = function (t) {
                  var e = this._configService.get('distributedTracingHeaderName')
                  if (t)
                    return (function (t) {
                      var e = /^([\da-f]{2})-([\da-f]{32})-([\da-f]{16})-([\da-f]{2})$/.exec(t)
                      if (e) return (t = '00' !== e[4]), { traceId: e[2], id: e[3], sampled: t }
                    })(t[e])
                }),
                (e.filterTransaction = function (t) {
                  var e = t.duration()
                  if (!e) return !1
                  if (t.isManaged()) {
                    if (6e4 < e) return !1
                    if (t.sampled && 0 === t.spans.length) return !1
                  }
                  return !0
                }),
                (e.createTransactionDataModel = function (t) {
                  var e = t._start,
                    n = t.spans.map(function (n) {
                      return (
                        (n = de(
                          {
                            id: n.id,
                            transaction_id: t.id,
                            parent_id: n.parentId || t.id,
                            trace_id: t.traceId,
                            name: n.name,
                            type: n.type,
                            subtype: n.subtype,
                            action: n.action,
                            sync: n.sync,
                            start: parseInt(n._start - e),
                            duration: n.duration(),
                            context: n.context,
                            outcome: n.outcome
                          },
                          { extra: n.extra }
                        )),
                        Jt(zt, n)
                      )
                    })
                  n = {
                    id: t.id,
                    trace_id: t.traceId,
                    name: t.name,
                    type: t.type,
                    duration: t.duration(),
                    spans: n,
                    context: t.context,
                    marks: t.marks,
                    breakdown: t.breakdownTimings,
                    span_count: { started: n.length },
                    sampled: t.sampled,
                    experience: t.experience,
                    outcome: t.outcome
                  }
                  return Jt(Dt, n)
                }),
                (e.createTransactionPayload = function (t) {
                  var e = (function (t) {
                    var e, n
                    return (
                      t.sampled
                        ? ((e = t.spans.filter(function (e) {
                            return 0 < e.duration() && e._start >= t._start && e._end <= t._end
                          })),
                          t.isManaged()
                            ? ((n = (function (t, e, n) {
                                t.sort(function (t, e) {
                                  return t._start - e._start
                                })
                                var r = [],
                                  i = 1
                                return (
                                  t.forEach(function (n, o) {
                                    var a, s
                                    0 === r.length
                                      ? r.push(n)
                                      : ((s =
                                          (a = r[r.length - 1]).type === n.type &&
                                          a.subtype === n.subtype &&
                                          a.action === n.action &&
                                          a.name === n.name &&
                                          n.duration() / e < 0.05 &&
                                          (n._start - a._end) / e < 0.05),
                                        (o = t.length === o + 1),
                                        s && (i++, (a._end = n._end)),
                                        1 < i && (!s || o) && ((a.name = i + 'x ' + a.name), (i = 1)),
                                        s || r.push(n))
                                  }),
                                  r
                                )
                              })(e, t.duration())),
                              (t.spans = n))
                            : (t.spans = e))
                        : t.resetSpans(),
                      t
                    )
                  })(t)
                  if (this.filterTransaction(e)) return this.createTransactionDataModel(t)
                }),
                t
              )
            })(),
            pe = [
              ['domainLookupStart', 'domainLookupEnd', 'DNS'],
              ['connectStart', 'connectEnd', 'TCP'],
              ['requestStart', 'responseStart', 'Request'],
              ['responseStart', 'responseEnd', 'Response'],
              ['domLoading', 'domComplete', 'Processing'],
              ['loadEventStart', 'loadEventEnd', 'Load']
            ]
          function he(t) {
            return { value: t }
          }
          function ve(t, e) {
            var n = e.details,
              r = void 0 === (r = e.count) ? 1 : r
            e = e.duration
            return {
              transaction: t,
              span: n,
              samples: { 'span.self_time.count': he(r), 'span.self_time.sum.us': he(e) }
            }
          }
          var me = (function (t) {
              var e
              function n(e, n, r) {
                return (
                  ((r = t.call(this, e, n, r) || this).traceId = d()),
                  (r.marks = void 0),
                  (r.spans = []),
                  (r._activeSpans = {}),
                  (r._activeTasks = new Set()),
                  (r.blocked = !1),
                  (r.captureTimings = !1),
                  (r.breakdownTimings = []),
                  (r.sampled = Math.random() <= r.options.transactionSampleRate),
                  r
                )
              }
              ;(r = t), ((e = n).prototype = Object.create(r.prototype)), ((e.prototype.constructor = e).__proto__ = r)
              var r = n.prototype
              return (
                (r.addMarks = function (t) {
                  this.marks = y(this.marks || {}, t)
                }),
                (r.mark = function (t) {
                  var e = T(t),
                    n = w() - this._start
                  ;((t = {})[e] = n), this.addMarks({ custom: t })
                }),
                (r.canReuse = function () {
                  var t = this.options.reuseThreshold || 5e3
                  return !!this.options.canReuse && !this.ended && w() - this._start < t
                }),
                (r.redefine = function (t, e, n) {
                  t && (this.name = t), e && (this.type = e), n && g(this.options, n)
                }),
                (r.startSpan = function (t, e, n) {
                  var r = this
                  if (!this.ended)
                    return (
                      ((n = g({}, n)).onEnd = function (t) {
                        r._onSpanEnd(t)
                      }),
                      (n.traceId = this.traceId),
                      (n.sampled = this.sampled),
                      n.parentId || (n.parentId = this.id),
                      (e = new Kt(t, e, n)),
                      (this._activeSpans[e.id] = e),
                      n.blocking && this.addTask(e.id),
                      e
                    )
                }),
                (r.isFinished = function () {
                  return !this.blocked && 0 === this._activeTasks.size
                }),
                (r.detectFinish = function () {
                  this.isFinished() && this.end()
                }),
                (r.end = function (t) {
                  if (!this.ended) {
                    for (var e in ((this.ended = !0), (this._end = S(t)), this._activeSpans)) {
                      var n = this._activeSpans[e]
                      ;(n.type = n.type + ut), n.end(t)
                    }
                    this.callOnEnd()
                  }
                }),
                (r.captureBreakdown = function () {
                  this.breakdownTimings = (function (t, e) {
                    void 0 === e && (e = s.timing)
                    var n = [],
                      r = t.duration(),
                      i = t.name,
                      o = t.type,
                      a = t.sampled,
                      c = { name: i, type: o }
                    if (
                      (n.push({
                        transaction: c,
                        samples: {
                          'transaction.duration.count': he(1),
                          'transaction.duration.sum.us': he(r),
                          'transaction.breakdown.count': he(a ? 1 : 0)
                        }
                      }),
                      !a)
                    )
                      return n
                    if (o === z && e)
                      for (var u = 0; u < pe.length; u++) {
                        var f = pe[u],
                          d = E(e[f[0]], e[f[1]])
                        0 !== d && null != d && n.push(ve(c, { details: { type: f[2] }, duration: d }))
                      }
                    else {
                      var l = (function (t) {
                        var e = {},
                          n = (function (t) {
                            var e = t.spans,
                              n = t._start,
                              r = t._end
                            if (0 === e.length) return t.duration()
                            e.sort(function (t, e) {
                              return t._start - e._start
                            })
                            for (var i = e[0], o = i._end, a = i._start, s = o, c = a - n, u = 1; u < e.length; u++)
                              (a = (i = e[u])._start), (o = i._end), s < a ? ((c += a - s), (s = o)) : s < o && (s = o)
                            return s < r && (c += r - s), c
                          })(t)
                        e.app = { count: 1, duration: n }
                        for (var r = t.spans, i = 0; i < r.length; i++) {
                          var o,
                            a = r[i],
                            s = a.duration()
                          0 !== s &&
                            null != s &&
                            ((o = a.type),
                            (a = a.subtype),
                            (o = o.replace(ut, '')),
                            a && (o += '.' + a),
                            e[o] || (e[o] = { duration: 0, count: 0 }),
                            e[o].count++,
                            (e[o].duration += s))
                        }
                        return e
                      })(t)
                      Object.keys(l).forEach(function (t) {
                        var e = (i = t.split('.'))[0],
                          r = i[1],
                          i = ((t = (i = l[t]).duration), i.count)
                        n.push(ve(c, { details: { type: e, subtype: r }, duration: t, count: i }))
                      })
                    }
                    return n
                  })(this)
                }),
                (r.block = function (t) {
                  ;(this.blocked = t), this.blocked || this.detectFinish()
                }),
                (r.addTask = function (t) {
                  return (t = t || 'task-' + d(16)), this._activeTasks.add(t), t
                }),
                (r.removeTask = function (t) {
                  this._activeTasks.delete(t) && this.detectFinish()
                }),
                (r.resetSpans = function () {
                  this.spans = []
                }),
                (r._onSpanEnd = function (t) {
                  this.spans.push(t), delete this._activeSpans[t.id], this.removeTask(t.id)
                }),
                (r.isManaged = function () {
                  return !!this.options.managed
                }),
                n
              )
            })(n),
            ge = {
              fid: 0,
              fcp: 0,
              tbt: { start: 1 / 0, duration: 0 },
              cls: 0,
              longtask: { count: 0, duration: 0, max: 0 }
            }
          var ye = (function () {
              function t(t) {
                ;(this.po = { observe: _, disconnect: _ }),
                  window.PerformanceObserver && (this.po = new PerformanceObserver(t))
              }
              var e = t.prototype
              return (
                (e.start = function (t) {
                  try {
                    var e = t !== tt
                    this.po.observe({ type: t, buffered: e })
                  } catch (t) {}
                }),
                (e.stop = function () {
                  this.po.disconnect()
                }),
                t
              )
            })(),
            be = (function () {
              function t(t, e) {
                var n = this
                ;(this._config = e),
                  (this._logger = t),
                  (this.currentTransaction = void 0),
                  (this.respIntervalId = void 0),
                  (this.recorder = new ye(function (t) {
                    var e,
                      r,
                      i = n.getCurrentTransaction()
                    i &&
                      i.captureTimings &&
                      ((r = !1),
                      i.type === z && (r = !0),
                      (t = (e = (function (t, e) {
                        var n = e.capturePaint,
                          r = t.getEntriesByType(tt)
                        if (
                          ((e = {
                            spans: (function (t, e) {
                              for (var n = [], r = 0; r < t.length; r++) {
                                var i = (u = t[r]).name,
                                  o = u.startTime,
                                  a = u.duration,
                                  s = u.attribution,
                                  c = o + a,
                                  u = new Kt('Longtask(' + i + ')', tt, { startTime: o })
                                e.count++,
                                  (e.duration += a),
                                  a > e.max && (e.max = a),
                                  0 < s.length &&
                                    ((o = (i = s[0]).name),
                                    (a = i.containerType),
                                    (s = i.containerName),
                                    (i = i.containerId),
                                    (a = { attribution: o, type: a }),
                                    s && (a.name = s),
                                    i && (a.id = i),
                                    u.addContext({ custom: a })),
                                  u.end(c),
                                  n.push(u)
                              }
                              return n
                            })(r, ge.longtask),
                            marks: {}
                          }),
                          !n)
                        )
                          return e
                        ;(n = (n = t.getEntriesByType(et))[n.length - 1]) &&
                          ((i = parseInt(n.startTime)), (ge.lcp = i), (e.marks.largestContentfulPaint = i))
                        var i = (n = s.timing).fetchStart - n.navigationStart
                        ;(n = t.getEntriesByName('first-contentful-paint')[0]) &&
                          ((o = parseInt(0 <= i ? n.startTime - i : n.startTime)),
                          (ge.fcp = o),
                          (e.marks.firstContentfulPaint = o))
                        var o = (function (t) {
                          var e = t[0]
                          if (e)
                            return (
                              (t = e.startTime),
                              (e = e.processingStart),
                              (t = new Kt('First Input Delay', nt, { startTime: t })).end(e),
                              t
                            )
                        })(t.getEntriesByType(nt))
                        return (
                          o && ((ge.fid = o.duration()), e.spans.push(o)),
                          r.forEach(function (t) {
                            var e = t.name,
                              n = t.startTime
                            t = t.duration
                            n < ge.fcp ||
                              ('self' !== e && -1 === e.indexOf('same-origin')) ||
                              ((ge.tbt.start = Math.min(ge.tbt.start, n)), 0 < (t -= 50) && (ge.tbt.duration += t))
                          }),
                          (t = t.getEntriesByType(rt)).forEach(function (t) {
                            t.hadRecentInput || (ge.cls += t.value)
                          }),
                          e
                        )
                      })(t, { capturePaint: r })).spans),
                      (r = e.marks),
                      (e = i.spans).push.apply(e, t),
                      i.addMarks({ agent: r }))
                  }))
              }
              var e = t.prototype
              return (
                (e.createCurrentTransaction = function (t, e, n) {
                  return (n = new me(t, e, n)), (this.currentTransaction = n)
                }),
                (e.getCurrentTransaction = function () {
                  if (this.currentTransaction && !this.currentTransaction.ended) return this.currentTransaction
                }),
                (e.createOptions = function (t) {
                  var e = this._config.config
                  return (
                    (t = g({ transactionSampleRate: e.transactionSampleRate }, t)).managed &&
                      (t = g(
                        {
                          pageLoadTraceId: e.pageLoadTraceId,
                          pageLoadSampled: e.pageLoadSampled,
                          pageLoadSpanId: e.pageLoadSpanId,
                          pageLoadTransactionName: e.pageLoadTransactionName
                        },
                        t
                      )),
                    t
                  )
                }),
                (e.startManagedTransaction = function (t, e, n) {
                  var r,
                    i,
                    o,
                    a = this.getCurrentTransaction(),
                    s = !1
                  return (
                    a
                      ? a.canReuse() && n.canReuse
                        ? ((r = a.type),
                          (i = J.indexOf(a.type)),
                          (o = J.indexOf(e)),
                          0 <= i && o < i && (r = e),
                          a.redefine(t, r, n),
                          (s = !0))
                        : (a.end(), (a = this.createCurrentTransaction(t, e, n)))
                      : (a = this.createCurrentTransaction(t, e, n)),
                    a.type === z &&
                      (s ||
                        (this.recorder.start(et),
                        this.recorder.start('paint'),
                        this.recorder.start(nt),
                        this.recorder.start(rt)),
                      n.pageLoadTraceId && (a.traceId = n.pageLoadTraceId),
                      n.pageLoadSampled && (a.sampled = n.pageLoadSampled),
                      a.name === V && n.pageLoadTransactionName && (a.name = n.pageLoadTransactionName)),
                    !s && this._config.get('monitorLongtasks') && this.recorder.start(tt),
                    a.sampled && (a.captureTimings = !0),
                    a
                  )
                }),
                (e.startTransaction = function (t, e, n) {
                  var r,
                    i = this,
                    o = this.createOptions(n)
                  n = !0
                  return (
                    o.managed
                      ? this.currentTransaction === (r = this.startManagedTransaction(t, e, o)) && (n = !1)
                      : (r = new me(t, e, o)),
                    (r.onEnd = function () {
                      return i.handleTransactionEnd(r)
                    }),
                    n && this._config.events.send('transaction:start', [r]),
                    r
                  )
                }),
                (e.handleTransactionEnd = function (t) {
                  var e = this
                  this.recorder.stop()
                  var n = window.location.href
                  return i.resolve().then(
                    function () {
                      var r,
                        i,
                        o,
                        a,
                        c,
                        u = t.name,
                        f = t.type
                      kt.lastHiddenStart >= t._start ||
                        e.shouldIgnoreTransaction(u) ||
                        f === U ||
                        (f === z &&
                          ((a = e._config.get('pageLoadTransactionName')),
                          u === V && a && (t.name = a),
                          t.captureTimings &&
                            ((r = ge.cls),
                            (i = ge.fid),
                            (o = ge.tbt),
                            (c = ge.longtask),
                            0 < o.duration &&
                              t.spans.push(
                                ((u = (f = o).start),
                                (a = f.duration),
                                (f = new Kt('Total Blocking Time', tt, { startTime: u })).end(u + a),
                                f)
                              ),
                            (t.experience = {}),
                            L(tt) && (t.experience.tbt = o.duration),
                            L(rt) && (t.experience.cls = r),
                            0 < i && (t.experience.fid = i),
                            0 < c.count && (t.experience.longtask = { count: c.count, sum: c.duration, max: c.max }))),
                        t.name === V &&
                          (t.name = (function (t, e) {
                            void 0 === e && (e = 2)
                            for (
                              var n = new jt(t),
                                r = ((t = n.query), n.path.substring(1).split('/')),
                                i = /\W|_/g,
                                o = /[0-9]/g,
                                a = /[a-z]/g,
                                s = /[A-Z]/g,
                                c = [],
                                u = !1,
                                f = 0;
                              f < r.length;
                              f++
                            ) {
                              var d,
                                l,
                                p = r[f]
                              if (u || e - 1 < f) {
                                p && c.push('*')
                                break
                              }
                              2 <= (p.match(i) || []).length ||
                              3 < (d = (p.match(o) || []).length) ||
                              (3 < p.length && 0.3 <= d / p.length)
                                ? (c.push(':id'), (u = !0))
                                : ((l = (p.match(s) || []).length),
                                  (d = (p.match(a) || []).length / p.length),
                                  (l /= p.length),
                                  5 < p.length && ((0.3 < l && l < 0.6) || (0.3 < d && d < 0.6))
                                    ? (c.push(':id'), (u = !0))
                                    : p && c.push(p))
                            }
                            return '/' + (2 <= c.length ? c.join('/') : c.join('')) + (t ? '?{query}' : '')
                          })(n)),
                        ne(t),
                        e.adjustTransactionTime(t),
                        e._config.get('breakdownMetrics') && t.captureBreakdown(),
                        (c = e._config.get('context')),
                        (function (t, e) {
                          var n = void 0 === e ? {} : e,
                            r =
                              (n.tags,
                              (function (t, e) {
                                if (null == t) return {}
                                for (var n, r = {}, i = Object.keys(t), o = 0; o < i.length; o++)
                                  (n = i[o]), 0 <= e.indexOf(n) || (r[n] = t[n])
                                return r
                              })(n, ['tags'])),
                            i = qt()
                          ;(e = {}),
                            t.type !== z ||
                              !k() ||
                              ((n = s.getEntriesByType('navigation')) && 0 < n.length && (e = { response: Pt(n[0]) })),
                            t.addContext(i, e, r)
                        })(t, c),
                        e._config.events.send(X, [t]))
                    },
                    function (t) {}
                  )
                }),
                (e.adjustTransactionTime = function (t) {
                  var e = t.spans,
                    n = (function (t) {
                      for (var e = t[0], n = 1; n < t.length; n++) {
                        var r = t[n]
                        e._start > r._start && (e = r)
                      }
                      return e
                    })(e)
                  n && n._start < t._start && (t._start = n._start),
                    (n = (function (t) {
                      for (var e = null, n = 0; n < t.length; n++) {
                        var r = t[n]
                        ;-1 === String(r.type).indexOf('external') && (!e || e._end < r._end) && (e = r)
                      }
                      return e
                    })(e)) &&
                      n._end > t._end &&
                      (t._end = n._end)
                  for (var r = t._end, i = 0; i < e.length; i++) {
                    var o = e[i]
                    o._end > r && ((o._end = r), (o.type += ut)), o._start > r && (o._start = r)
                  }
                }),
                (e.shouldIgnoreTransaction = function (t) {
                  var e = this._config.get('ignoreTransactions')
                  if (e && e.length)
                    for (var n = 0; n < e.length; n++) {
                      var r = e[n]
                      if ('function' == typeof r.test) {
                        if (r.test(t)) return !0
                      } else if (r === t) return !0
                    }
                  return !1
                }),
                (e.startSpan = function (t, e, n) {
                  var r = this.getCurrentTransaction()
                  return (n = (r =
                    r ||
                    this.createCurrentTransaction(
                      void 0,
                      U,
                      this.createOptions({ canReuse: !0, managed: !0 })
                    )).startSpan(t, e, n))
                }),
                (e.endSpan = function (t, e) {
                  t && t.end(null, e)
                }),
                t
              )
            })()
          var _e = (function () {
              function t(t, e) {
                ;(this._disable = e), (this.serviceFactory = t), (this._initialized = !1)
              }
              var e = t.prototype
              return (
                (e.isEnabled = function () {
                  return !this._disable
                }),
                (e.isActive = function () {
                  var t = this.serviceFactory.getService(at)
                  return this.isEnabled() && this._initialized && t.get('active')
                }),
                (e.init = function (t) {
                  var e,
                    n,
                    r,
                    i,
                    o,
                    a,
                    s = this
                  return (
                    this.isEnabled() &&
                      !this._initialized &&
                      ((this._initialized = !0),
                      (e = (o = this.serviceFactory.getService([at, st]))[0]),
                      (n = o[1]),
                      e.setVersion('5.6.2'),
                      this.config(t),
                      (o = e.get('logLevel')),
                      n.setLevel(o),
                      e.get('active')
                        ? (this.serviceFactory.init(),
                          (t = e.get('instrument')),
                          (i = e.get('disableInstrumentations')),
                          ((o = {})[G] = !1),
                          (o[W] = !1),
                          (o[K] = !1),
                          (o[z] = !1),
                          (o.error = !1),
                          (o[Q] = !1),
                          (a = o),
                          t &&
                            Object.keys(a).forEach(function (t) {
                              ;-1 === i.indexOf(t) && (a[t] = !0)
                            }),
                          (r = a),
                          this.serviceFactory.getService('PerformanceMonitoring').init(r),
                          r.error && this.serviceFactory.getService('ErrorLogging').registerListeners(),
                          (t = function () {
                            return r[z] && s._sendPageLoadMetrics()
                          }),
                          e.get('centralConfig') ? this.fetchCentralConfig().then(t) : t())
                        : ((this._disable = !0), n.warn('RUM agent is inactive'))),
                    this
                  )
                }),
                (e.fetchCentralConfig = function () {
                  var t = this.serviceFactory.getService([ct, st, at]),
                    e = t[0],
                    n = t[1],
                    r = t[2]
                  return e
                    .fetchConfig(r.get('serviceName'), r.get('environment'))
                    .then(function (t) {
                      var e,
                        i,
                        o = t.transaction_sample_rate
                      return (
                        o &&
                          ((e = { transactionSampleRate: (o = Number(o)) }),
                          0 === (i = r.validate(e).invalid).length
                            ? r.setConfig(e)
                            : ((e = (o = i[0]).key),
                              (i = o.value),
                              (o = o.allowed),
                              n.warn('invalid value "' + i + '" for ' + e + '. Allowed: ' + o + '.'))),
                        t
                      )
                    })
                    .catch(function (t) {
                      n.warn('failed fetching config:', t)
                    })
                }),
                (e._sendPageLoadMetrics = function () {
                  var t,
                    e = this.startTransaction(void 0, z, { managed: !0, canReuse: !0 })
                  e &&
                    (e.addTask(z),
                    (t = function () {
                      setTimeout(function () {
                        return e.removeTask(z)
                      })
                    }),
                    'complete' === document.readyState ? t() : window.addEventListener('load', t))
                }),
                (e.observe = function (t, e) {
                  this.serviceFactory.getService(at).events.observe(t, e)
                }),
                (e.config = function (t) {
                  var e,
                    n = this.serviceFactory.getService(at),
                    r = n.validate(t),
                    i = r.missing,
                    o = r.invalid
                  0 === i.length && 0 === o.length
                    ? n.setConfig(t)
                    : ((t = this.serviceFactory.getService(st)),
                      (e = "RUM agent isn't correctly configured. "),
                      0 < i.length && ((e += i.join(', ') + ' is missing'), 0 < o.length && (e += ', ')),
                      o.forEach(function (t, n) {
                        var r = t.key,
                          i = t.value
                        t = t.allowed
                        e +=
                          r +
                          ' "' +
                          i +
                          '" contains invalid characters! (allowed: ' +
                          t +
                          ')' +
                          (n !== o.length - 1 ? ', ' : '')
                      }),
                      t.error(e),
                      n.setConfig({ active: !1 }))
                }),
                (e.setUserContext = function (t) {
                  this.serviceFactory.getService(at).setUserContext(t)
                }),
                (e.setCustomContext = function (t) {
                  this.serviceFactory.getService(at).setCustomContext(t)
                }),
                (e.addLabels = function (t) {
                  this.serviceFactory.getService(at).addLabels(t)
                }),
                (e.setInitialPageLoadName = function (t) {
                  this.serviceFactory.getService(at).setConfig({ pageLoadTransactionName: t })
                }),
                (e.startTransaction = function (t, e, n) {
                  if (this.isEnabled())
                    return this.serviceFactory.getService('TransactionService').startTransaction(t, e, n)
                }),
                (e.startSpan = function (t, e, n) {
                  if (this.isEnabled()) return this.serviceFactory.getService('TransactionService').startSpan(t, e, n)
                }),
                (e.getCurrentTransaction = function () {
                  if (this.isEnabled())
                    return this.serviceFactory.getService('TransactionService').getCurrentTransaction()
                }),
                (e.captureError = function (t) {
                  if (this.isEnabled()) return this.serviceFactory.getService('ErrorLogging').logError(t)
                }),
                (e.addFilter = function (t) {
                  this.serviceFactory.getService(at).addFilter(t)
                }),
                t
              )
            })(),
            Te = (function () {
              if (a && window.elasticApm) return window.elasticApm
              var t = Ot(),
                e =
                  ((ue.TransactionService = function (t) {
                    t = (e = t.getService([st, at]))[0]
                    var e = e[1]
                    return new be(t, e)
                  }),
                  (ue.PerformanceMonitoring = function (t) {
                    var e = (r = t.getService([ct, at, st, 'TransactionService']))[0],
                      n = r[1],
                      r = ((t = r[2]), r[3])
                    return new le(e, n, t, r)
                  }),
                  (ue.ErrorLogging = function (t) {
                    var e = (n = t.getService([ct, at, 'TransactionService']))[0],
                      n = ((t = n[1]), n[2])
                    return new Zt(e, t, n)
                  }),
                  new fe())
              t = new _e(e, !t)
              return a && (window.elasticApm = t), t
            })(),
            we = (Te.init.bind(Te), 100)
          var Se = function (t, e) {
              var n = e.router,
                r = void 0 === (i = e.apm) ? Te : i,
                i = e.config
              e = void 0 === (e = e.captureErrors) || e
              r.init(i),
                r.isActive() &&
                  (n &&
                    (function (t, e) {
                      var n
                      t.beforeEach(function (t, r, i) {
                        var o = t.matched || []
                        t = t.path
                        0 < o.length && (t = o[o.length - 1].path || t),
                          (n = e.startTransaction(t, 'route-change', { managed: !0, canReuse: !0 })),
                          i()
                      }),
                        t.afterEach(function () {
                          function t() {
                            clearTimeout(r), cancelAnimationFrame(i), setTimeout(e)
                          }
                          var e, r, i
                          ;(e = function () {
                            return n && n.detectFinish()
                          }),
                            (r = setTimeout(t, we)),
                            (i = requestAnimationFrame(t))
                        }),
                        t.onError(function () {
                          n && n.end()
                        })
                    })(n, r),
                  e &&
                    (t.config.errorHandler = (function (t, e) {
                      var n = this,
                        r = t.config.errorHandler
                      return function (t, i, o) {
                        var a, s
                        i &&
                          i.$options &&
                          ((a = i.$options),
                          (s = i.$root === i ? 'Root' : a.name || a._componentTag || 'Anonymous'),
                          (t.component = s),
                          (t.file = a.__file || '')),
                          o && (t.lifecycleHook = o),
                          e.captureError(t),
                          'function' == typeof r && r.call(n, t, i, o)
                      }
                    })(t, r))),
                (t.prototype.$apm = r)
            },
            Ee = { eventName: '', eventType: '', eventValue: 0, eventTag: '', customData: {}, timestamp: 0 }
          function xe() {
            var t = (function (t, e) {
                for (var n = Object.keys(e), r = 0, i = n.length; r < i; r++)
                  void 0 !== t[r] && '-' !== t[r] && (e[n[r]] = t[r])
                return (e.timestamp = Date.now()), (e.customData = JSON.stringify(e.customData)), e
              })(Array.from(arguments), Ee),
              e = this.startTransaction('customMetric', 'custom', { managed: !1 }),
              n = e.startSpan('customMetric')
            n.addLabels(t), n.end(n._start + 1), e.end()
          }
          function ke() {
            xe.call.apply(xe, [this].concat(Array.prototype.slice.call(arguments)))
          }
          function Le(t) {
            ;(function (t) {
              this.setCustomContext({ $user_id: t })
            }.call(this, t))
          }
          var Oe = {
            install: function (t, e) {
              Se(t, e), (t.prototype.$apm.reportMonitor = ke), (t.prototype.$apm.setUserId = Le)
            }
          }
        }
      ]),
    (t.c = n),
    (t.d = function (e, n, r) {
      t.o(e, n) || Object.defineProperty(e, n, { enumerable: !0, get: r })
    }),
    (t.r = function (t) {
      'undefined' != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(t, '__esModule', { value: !0 })
    }),
    (t.t = function (e, n) {
      if ((1 & n && (e = t(e)), 8 & n)) return e
      if (4 & n && 'object' == typeof e && e && e.__esModule) return e
      var r = Object.create(null)
      if ((t.r(r), Object.defineProperty(r, 'default', { enumerable: !0, value: e }), 2 & n && 'string' != typeof e))
        for (var i in e)
          t.d(
            r,
            i,
            function (t) {
              return e[t]
            }.bind(null, i)
          )
      return r
    }),
    (t.n = function (e) {
      var n =
        e && e.__esModule
          ? function () {
              return e.default
            }
          : function () {
              return e
            }
      return t.d(n, 'a', n), n
    }),
    (t.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e)
    }),
    (t.p = ''),
    t((t.s = 10))
  )
  function t(r) {
    if (n[r]) return n[r].exports
    var i = (n[r] = { i: r, l: !1, exports: {} })
    return e[r].call(i.exports, i, i.exports, t), (i.l = !0), i.exports
  }
  var e, n
})
