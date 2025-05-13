;(() => {
  "use strict"
  var t = {
      740: function () {
        ;(() => {
          var t = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
          function e(e) {
            return [...e].reduce(function (e, r) {
              return (e * t.length + t.indexOf(r)) | 0
            }, 0)
          }
          function r(t, n, a = e) {
            let i = t
              .slice(n)
              .match(RegExp(".{" + ((t.length - n) >> 2) + "}", "g"))
            return i ? i.map(a) : []
          }
          function n(e) {
            return (function ([t, e, r, n]) {
              return function () {
                ;(t |= 0), (e |= 0), (r |= 0), (n |= 0)
                let a = (((t + e) | 0) + n) | 0
                return (
                  (n = (n + 1) | 0),
                  (t = e ^ (e >>> 9)),
                  (e = (r + (r << 3)) | 0),
                  (r = ((r = (r << 21) | (r >>> 11)) + a) | 0),
                  (a >>> 0) / 0x100000000
                )
              }
            })(
              /^(0x)?([A-Fa-f0-9]{64})$/.test(e) ||
                /^(0x)?[0-9a-fA-F]{40}$/.test(e)
                ? r(e, 2, (t) => Number(BigInt(`0x${t}`) % BigInt(0xffffffff)))
                : !(function (e) {
                      if (36 !== e.length || !/^(tz|KT)[1-4]/.test(e)) return !1
                      for (let r = 0; r < e.length; r++)
                        if (!t.includes(e[r])) return !1
                      return !0
                    })(e)
                  ? r(e, 2)
                  : r(e, 3)
            )
          }
          function a(t) {
            let e = t.replace("#", "")
            return (
              6 === e.length && (e = `${e}ff`),
              3 === e.length &&
                (e = `${e[0]}${e[0]}${e[1]}${e[1]}${e[2]}${e[2]}ff`),
              e
            )
          }
          var i = function (t) {
              let e = ""
              for (let r = 0; r < t.length; r++)
                e += t.charCodeAt(r).toString(16).padStart(4, "0")
              return e
            },
            s = function (t) {
              let e = t.match(/.{1,4}/g) || [],
                r = ""
              for (let t = 0; t < e.length; t++) {
                let n = parseInt(e[t], 16)
                if (0 === n) break
                r += String.fromCharCode(n)
              }
              return r
            },
            o = BigInt("-9223372036854775808"),
            u = BigInt("9223372036854775807"),
            f = {
              number: {
                serialize: (t) => {
                  let e = new DataView(new ArrayBuffer(8))
                  return (
                    e.setFloat64(0, t),
                    e.getBigUint64(0).toString(16).padStart(16, "0")
                  )
                },
                deserialize: (t) => {
                  let e = new DataView(new ArrayBuffer(8))
                  for (let r = 0; r < 8; r++)
                    e.setUint8(r, parseInt(t.substring(2 * r, 2 * r + 2), 16))
                  return e.getFloat64(0)
                },
                bytesLength: () => 8,
                constrain: (t, e) => {
                  let r = Number.MIN_SAFE_INTEGER
                  "u" > typeof e.options?.min && (r = Number(e.options.min))
                  let n = Number.MAX_SAFE_INTEGER
                  "u" > typeof e.options?.max && (n = Number(e.options.max)),
                    (n = Math.min(n, Number.MAX_SAFE_INTEGER))
                  let a = Math.min(
                    Math.max(t, (r = Math.max(r, Number.MIN_SAFE_INTEGER))),
                    n
                  )
                  if (e?.options?.step) {
                    let t = 1 / e?.options?.step
                    return Math.round(a * t) / t
                  }
                  return a
                },
                random: (t) => {
                  let e = Number.MIN_SAFE_INTEGER
                  "u" > typeof t.options?.min && (e = Number(t.options.min))
                  let r = Number.MAX_SAFE_INTEGER
                  "u" > typeof t.options?.max && (r = Number(t.options.max))
                  let n =
                    Math.random() *
                      ((r = Math.min(r, Number.MAX_SAFE_INTEGER)) -
                        (e = Math.max(e, Number.MIN_SAFE_INTEGER))) +
                    e
                  if (t?.options?.step) {
                    let e = 1 / t?.options?.step
                    return Math.round(n * e) / e
                  }
                  return n
                },
              },
              bigint: {
                serialize: (t) => {
                  let e = new DataView(new ArrayBuffer(8))
                  return (
                    e.setBigInt64(0, BigInt(t)),
                    e.getBigUint64(0).toString(16).padStart(16, "0")
                  )
                },
                deserialize: (t) => {
                  let e = new DataView(new ArrayBuffer(8))
                  for (let r = 0; r < 8; r++)
                    e.setUint8(r, parseInt(t.substring(2 * r, 2 * r + 2), 16))
                  return e.getBigInt64(0)
                },
                bytesLength: () => 8,
                random: (t) => {
                  let e = o,
                    r = u
                  "u" > typeof t.options?.min && (e = BigInt(t.options.min)),
                    "u" > typeof t.options?.max && (r = BigInt(t.options.max))
                  let n = r - e,
                    a = n.toString(2).length,
                    i
                  do
                    i = BigInt(
                      "0b" +
                        Array.from(
                          crypto.getRandomValues(
                            new Uint8Array(Math.ceil(a / 8))
                          )
                        )
                          .map((t) => t.toString(2).padStart(8, "0"))
                          .join("")
                    )
                  while (i > n)
                  return i + e
                },
              },
              boolean: {
                serialize: (t) =>
                  "boolean" == typeof t
                    ? t
                      ? "01"
                      : "00"
                    : "string" == typeof t && "true" === t
                      ? "01"
                      : "00",
                deserialize: (t) => "00" !== t,
                bytesLength: () => 1,
                random: () => 0.5 > Math.random(),
              },
              color: {
                serialize: (t) => a(t),
                deserialize: (t) => t,
                bytesLength: () => 4,
                transform: (t) => {
                  let e = a(t),
                    r = parseInt(e.slice(0, 2), 16),
                    n = parseInt(e.slice(2, 4), 16),
                    i = parseInt(e.slice(4, 6), 16),
                    s = parseInt(e.slice(6, 8), 16)
                  return {
                    hex: { rgb: "#" + t.slice(0, 6), rgba: "#" + t },
                    obj: {
                      rgb: { r: r, g: n, b: i },
                      rgba: { r: r, g: n, b: i, a: s },
                    },
                    arr: { rgb: [r, n, i], rgba: [r, n, i, s] },
                  }
                },
                constrain: (t) => t.replace("#", "").slice(0, 8).padEnd(8, "f"),
                random: () =>
                  `${[...Array(8)].map(() => Math.floor(16 * Math.random()).toString(16)).join("")}`,
              },
              string: {
                serialize: (t, e) => {
                  if (!e.version) return i(t.substring(0, 64)).padEnd(256, "0")
                  let r = 64
                  return (
                    "u" > typeof e.options?.maxLength &&
                      (r = Number(e.options.maxLength)),
                    i(t.substring(0, r)).padEnd(4 * r, "0")
                  )
                },
                deserialize: (t) => s(t),
                bytesLength: (t) =>
                  t.version && "u" > typeof t.options?.maxLength
                    ? 2 * Number(t.options.maxLength)
                    : 128,
                random: (t) => {
                  let e = 0
                  "u" > typeof t.options?.minLength && (e = t.options.minLength)
                  let r = 64
                  return (
                    "u" > typeof t.options?.maxLength &&
                      (r = t.options.maxLength),
                    [...Array(Math.round(Math.random() * (r - e) + e))]
                      .map((t) => (~~(36 * Math.random())).toString(36))
                      .join("")
                  )
                },
                constrain: (t, e) => {
                  let r = 0
                  "u" > typeof e.options?.minLength && (r = e.options.minLength)
                  let n = 64
                  "u" > typeof e.options?.maxLength && (n = e.options.maxLength)
                  let a = t.slice(0, n)
                  return a.length < r ? a.padEnd(r) : a
                },
              },
              bytes: {
                serialize: (t, e) =>
                  Array.from(t)
                    .map((t) => t.toString(16).padStart(2, "0"))
                    .join(""),
                deserialize: (t, e) => {
                  let r = t.length / 2,
                    n = new Uint8Array(r),
                    a
                  for (let e = 0; e < r; e++)
                    (a = 2 * e), (n[e] = parseInt(`${t[a]}${t[a + 1]}`, 16))
                  return n
                },
                bytesLength: (t) => t.options.length,
                random: (t) => {
                  let e = t.options?.length || 0,
                    r = new Uint8Array(e)
                  for (let t = 0; t < e; t++) r[t] = (255 * Math.random()) | 0
                  return r
                },
              },
              select: {
                serialize: (t, e) =>
                  Math.min(255, e.options?.options?.indexOf(t) || 0)
                    .toString(16)
                    .padStart(2, "0"),
                deserialize: (t, e) => {
                  let r = parseInt(t, 16)
                  return (
                    e.options?.options?.[r] || e.options?.options?.[0] || ""
                  )
                },
                bytesLength: () => 1,
                constrain: (t, e) =>
                  e.options.options.includes(t) ? t : e.options.options[0],
                random: (t) => {
                  let e = Math.round(
                    Math.random() * (t.options.options.length - 1) + 0
                  )
                  return t?.options?.options[e]
                },
              },
            },
            l = (t, e, r, n) => {
              let a = r.find((e) => e.id === t)
              if (!a) throw Error(`No definition found for param ${t}`)
              let i = f[a.type][n]
              return i?.(e, a) || e
            },
            p = (t, e, r) => {
              let n = {}
              for (let a of e) {
                let e = f[a.type],
                  i = t[a.id],
                  s = e[r]
                n[a.id] = s?.(i, a) || i
              }
              return n
            }
          window.$fx = (function (e) {
            let { parent: r } = e,
              a = new URLSearchParams(e.location.search),
              i =
                a.get("fxhash") ||
                `oo${Array.from({ length: 49 }, () => t[(Math.random() * t.length) | 0]).join("")}`,
              s =
                a.get("fxminter") ||
                `tz1${Array.from({ length: 33 }, () => t[(Math.random() * t.length) | 0]).join("")}`,
              o = n(s),
              u = "1" === a.get("preview"),
              { params: h, lineage: m } = (function (t) {
                let e = t.indexOf("#")
                if (-1 === e) return { params: "", lineage: [] }
                let r = t.slice(e + 1)
                if (r.startsWith("0x")) return { params: r, lineage: [] }
                let n = new URLSearchParams(r),
                  a = [],
                  i = n.get("lineage")
                return (
                  i && (a = i.split(",").map((t) => t.trim())),
                  { params: n.get("params") || r, lineage: a }
                )
              })(e.location.href),
              d = h.replace("0x", ""),
              g = [...m, i],
              c = [...g.map((t) => n(t))],
              _ = (t) => {
                if (t < 0 || t >= g.length) throw Error("Invalid depth")
                let e = g[t]
                ;(c[t] = n(e)),
                  (c[t].reset = () => _(t)),
                  t === g.length - 1 && (x.rand = y = c[t])
              }
            c.forEach((t, e) => {
              t.reset = () => _(e)
            })
            let y = c[g.length - 1]
            function w(t) {
              if (!c[t]) throw Error("Invalid depth")
              return c[t]()
            }
            w.reset = (t) => {
              _(t)
            }
            let x = {
              _version: "4.0.1",
              _processors: f,
              _params: void 0,
              _features: void 0,
              _rawValues: {},
              _paramValues: {},
              _listeners: {},
              _receiveUpdateParams: async function (t, e) {
                let r = await this._propagateEvent("params:update", t)
                r.forEach(([r, n]) => {
                  ;("boolean" != typeof r || r) &&
                    (this._updateParams(t), e?.()),
                    n?.(r, t)
                }),
                  0 === r.length && (this._updateParams(t), e?.())
              },
              _updateParams: function (t) {
                if (!this._params) throw Error("Params not defined")
                let e = p(
                  { ...this._rawValues, ...t },
                  this._params,
                  "constrain"
                )
                Object.keys(e).forEach((t) => {
                  this._rawValues[t] = e[t]
                }),
                  (this._paramValues = p(
                    this._rawValues,
                    this._params,
                    "transform"
                  )),
                  this._updateInputBytes()
              },
              _updateInputBytes: function () {
                if (!this._params) throw Error("Params not defined")
                let t = (function (t, e) {
                  let r = ""
                  if (!e) return r
                  for (let n of e) {
                    let { id: e, type: a } = n,
                      i = f[a],
                      s = t[e],
                      o =
                        "u" > typeof s
                          ? s
                          : "u" > typeof n.default
                            ? n.default
                            : i.random(n)
                    r += i.serialize(o, n)
                  }
                  return r
                })(this._rawValues, this._params)
                this.inputBytes = t
              },
              _emitParams: function (t) {
                let e = Object.keys(t).reduce((e, r) => {
                  if (!this._params) throw Error("Params not defined")
                  return (e[r] = l(r, t[r], this._params, "constrain")), e
                }, {})
                this._receiveUpdateParams(
                  e,
                  () =>
                    new Promise((t, n) => {
                      try {
                        r.postMessage(
                          {
                            id: "fxhash_emit:params:update",
                            data: { params: e },
                          },
                          "*"
                        ),
                          t()
                      } catch (t) {
                        n(t)
                      }
                    })
                )
              },
              _fxRandByDepth: c,
              createFxRandom: n,
              hash: i,
              lineage: g,
              depth: g.length - 1,
              rand: y,
              randAt: w,
              minter: s,
              randminter: o,
              iteration: Number(a.get("fxiteration")) || 1,
              context: a.get("fxcontext") || "standalone",
              preview: function t() {
                e.dispatchEvent(new Event("fxhash-preview")),
                  setTimeout(() => t(), 500)
              },
              captureFrame: function t(r = !1) {
                e.dispatchEvent(
                  new CustomEvent("fxhash-capture-frame", {
                    detail: { isLastFrame: r },
                  })
                ),
                  setTimeout(() => t(r), 500)
              },
              isPreview: u,
              inputBytes: void 0,
              params: function (t) {
                ;(this._params = t.map((t) => ({
                  ...t,
                  version: this._version,
                  value: t.default,
                  options: t.options,
                }))),
                  (this._rawValues = (function (t, e, r) {
                    let n = {}
                    for (let a of e) {
                      let e = f[a.type],
                        i = r.withTransform && e[r.transformType || "transform"]
                      if (!t) {
                        let t
                        ;(t = typeof a.default > "u" ? e.random(a) : a.default),
                          (n[a.id] = i ? i(t, a) : t)
                        continue
                      }
                      let s = e.bytesLength(a),
                        o = t.substring(0, 2 * s)
                      t = t.substring(2 * s)
                      let u = e.deserialize(o, a)
                      n[a.id] = i ? i(u, a) : u
                    }
                    return n
                  })(d, this._params, {
                    withTransform: !0,
                    transformType: "constrain",
                  })),
                  (this._paramValues = p(
                    this._rawValues,
                    this._params,
                    "transform"
                  )),
                  this._updateInputBytes()
              },
              features: function (t) {
                this._features = t
              },
              getFeature: function (t) {
                if (!this._features) throw Error(`Feature ${t} not defined`)
                return this._features?.[t]
              },
              getFeatures: function () {
                if (!this._features) throw Error("Features not defined")
                return this._features
              },
              getParam: function (t) {
                return this._paramValues[t]
              },
              getParams: function () {
                return this._paramValues
              },
              getRawParam: function (t) {
                return this._rawValues[t]
              },
              getRawParams: function () {
                return this._rawValues
              },
              getRandomParam: function (t) {
                if (!this._params) throw Error("Params not defined")
                let e = this._params.find((e) => e.id === t)
                if (!e) throw Error(`Param with id ${t} not found`)
                return f[e.type].random(e)
              },
              getDefinitions: function () {
                return this._params ? this._params : []
              },
              stringifyParams: function (t) {
                return JSON.stringify(
                  t || this._rawValues,
                  (t, e) => ("bigint" == typeof e ? e.toString() : e),
                  2
                )
              },
              on: function (t, e, r) {
                return (
                  this._listeners[t] || (this._listeners[t] = []),
                  this._listeners[t].push([e, r]),
                  () => {
                    let r = this._listeners[t].findIndex(([t]) => t === e)
                    r > -1 && this._listeners[t].splice(r, 1)
                  }
                )
              },
              _propagateEvent: async function (t, e) {
                let r = []
                if (this._listeners?.[t])
                  for (let [n, a] of this._listeners[t]) {
                    let t = n(e)
                    r.push([t instanceof Promise ? await t : t, a])
                  }
                return r
              },
              emit: function (t, e) {
                "params:update" === t
                  ? this._emitParams(e)
                  : console.log("$fx.emit called with unknown id:", t)
              },
            }
            y.reset = () => {
              _(g.length - 1)
            }
            let b = () => {
              ;(x.randminter = o = n(s)), (o.reset = b)
            }
            return (
              (o.reset = b),
              e.addEventListener("message", (t) => {
                if (
                  ("fxhash_getInfo" === t.data &&
                    r.postMessage(
                      {
                        id: "fxhash_getInfo",
                        data: {
                          version: e.$fx._version,
                          hash: e.$fx.hash,
                          iteration: e.$fx.iteration,
                          features: e.$fx.getFeatures(),
                          params: {
                            definitions: e.$fx.getDefinitions(),
                            values: e.$fx.getRawParams(),
                          },
                          minter: e.$fx.minter,
                        },
                      },
                      "*"
                    ),
                  t.data?.id === "fxhash_params:update")
                ) {
                  let { params: r } = t.data.data
                  r && e.$fx._receiveUpdateParams(r)
                }
              }),
              x
            )
          })(window)
        })()
      },
    },
    e = {}
  function r(n) {
    var a = e[n]
    if (void 0 !== a) return a.exports
    var i = (e[n] = { exports: {} })
    return t[n](i, i.exports, r), i.exports
  }
  ;(r.n = (t) => {
    var e = t && t.__esModule ? () => t.default : () => t
    return r.d(e, { a: e }), e
  }),
    (r.d = (t, e) => {
      for (var n in e)
        r.o(e, n) &&
          !r.o(t, n) &&
          Object.defineProperty(t, n, { enumerable: !0, get: e[n] })
    }),
    (r.o = (t, e) => Object.prototype.hasOwnProperty.call(t, e)),
    (r.rv = () => "1.3.5"),
    (r.ruid = "bundler=rspack@1.3.5"),
    r(740),
    (function (t) {
      for (let e = 0; e <= $fx.depth; e++) {
        console.log(e)
        let r = $fx.randAt(e),
          n = document.createElement("div")
        ;(n.style.height = (1 / ($fx.depth + 1)) * 100 + "vh"),
          (n.style.width = 100 * r + "vw"),
          (n.style.backgroundColor = "red"),
          t.appendChild(n)
      }
    })(document.getElementById("app"))
})()
