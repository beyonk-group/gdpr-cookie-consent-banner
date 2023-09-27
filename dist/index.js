var Qe = Object.defineProperty;
var Xe = (t, e, n) => e in t ? Qe(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var R = (t, e, n) => (Xe(t, typeof e != "symbol" ? e + "" : e, n), n);
function Z() {
}
const Ie = (t) => t;
function Se(t) {
  return t();
}
function $e() {
  return /* @__PURE__ */ Object.create(null);
}
function T(t) {
  t.forEach(Se);
}
function he(t) {
  return typeof t == "function";
}
function Ze(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Ke(t) {
  return Object.keys(t).length === 0;
}
const Pe = typeof window < "u";
let xe = Pe ? () => window.performance.now() : () => Date.now(), _e = Pe ? (t) => requestAnimationFrame(t) : Z;
const G = /* @__PURE__ */ new Set();
function De(t) {
  G.forEach((e) => {
    e.c(t) || (G.delete(e), e.f());
  }), G.size !== 0 && _e(De);
}
function et(t) {
  let e;
  return G.size === 0 && _e(De), {
    promise: new Promise((n) => {
      G.add(e = { c: t, f: n });
    }),
    abort() {
      G.delete(e);
    }
  };
}
function b(t, e) {
  t.appendChild(e);
}
function Me(t) {
  if (!t)
    return document;
  const e = t.getRootNode ? t.getRootNode() : t.ownerDocument;
  return e && /** @type {ShadowRoot} */
  e.host ? (
    /** @type {ShadowRoot} */
    e
  ) : t.ownerDocument;
}
function tt(t) {
  const e = C("style");
  return e.textContent = "/* empty */", nt(Me(t), e), e.sheet;
}
function nt(t, e) {
  return b(
    /** @type {Document} */
    t.head || t,
    e
  ), e.sheet;
}
function I(t, e, n) {
  t.insertBefore(e, n || null);
}
function A(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function it(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function C(t) {
  return document.createElement(t);
}
function ke(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t);
}
function M(t) {
  return document.createTextNode(t);
}
function P() {
  return M(" ");
}
function Ue() {
  return M("");
}
function W(t, e, n, s) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s);
}
function a(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function st(t) {
  return Array.from(t.childNodes);
}
function U(t, e) {
  e = "" + e, t.data !== e && (t.data = /** @type {string} */
  e);
}
function we(t, e, n) {
  t.classList.toggle(e, !!n);
}
function ze(t, e, { bubbles: n = !1, cancelable: s = !1 } = {}) {
  return new CustomEvent(t, { detail: e, bubbles: n, cancelable: s });
}
function ot(t) {
  const e = {};
  return t.childNodes.forEach(
    /** @param {Element} node */
    (n) => {
      e[n.slot || "default"] = !0;
    }
  ), e;
}
const ne = /* @__PURE__ */ new Map();
let ie = 0;
function ct(t) {
  let e = 5381, n = t.length;
  for (; n--; )
    e = (e << 5) - e ^ t.charCodeAt(n);
  return e >>> 0;
}
function rt(t, e) {
  const n = { stylesheet: tt(e), rules: {} };
  return ne.set(t, n), n;
}
function ve(t, e, n, s, i, o, c, r = 0) {
  const l = 16.666 / s;
  let f = `{
`;
  for (let $ = 0; $ <= 1; $ += l) {
    const k = e + (n - e) * o($);
    f += $ * 100 + `%{${c(k, 1 - k)}}
`;
  }
  const g = f + `100% {${c(n, 1 - n)}}
}`, u = `__svelte_${ct(g)}_${r}`, _ = Me(t), { stylesheet: m, rules: d } = ne.get(_) || rt(_, t);
  d[u] || (d[u] = !0, m.insertRule(`@keyframes ${u} ${g}`, m.cssRules.length));
  const p = t.style.animation || "";
  return t.style.animation = `${p ? `${p}, ` : ""}${u} ${s}ms linear ${i}ms 1 both`, ie += 1, u;
}
function lt(t, e) {
  const n = (t.style.animation || "").split(", "), s = n.filter(
    e ? (o) => o.indexOf(e) < 0 : (o) => o.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = n.length - s.length;
  i && (t.style.animation = s.join(", "), ie -= i, ie || at());
}
function at() {
  _e(() => {
    ie || (ne.forEach((t) => {
      const { ownerNode: e } = t.stylesheet;
      e && A(e);
    }), ne.clear());
  });
}
let K;
function X(t) {
  K = t;
}
function Te() {
  if (!K)
    throw new Error("Function called outside component initialization");
  return K;
}
function ut(t) {
  Te().$$.on_mount.push(t);
}
function ft() {
  const t = Te();
  return (e, n, { cancelable: s = !1 } = {}) => {
    const i = t.$$.callbacks[e];
    if (i) {
      const o = ze(
        /** @type {string} */
        e,
        n,
        { cancelable: s }
      );
      return i.slice().forEach((c) => {
        c.call(t, o);
      }), !o.defaultPrevented;
    }
    return !0;
  };
}
const J = [], ye = [];
let V = [];
const Ce = [], dt = /* @__PURE__ */ Promise.resolve();
let fe = !1;
function ht() {
  fe || (fe = !0, dt.then(O));
}
function z(t) {
  V.push(t);
}
const ce = /* @__PURE__ */ new Set();
let F = 0;
function O() {
  if (F !== 0)
    return;
  const t = K;
  do {
    try {
      for (; F < J.length; ) {
        const e = J[F];
        F++, X(e), _t(e.$$);
      }
    } catch (e) {
      throw J.length = 0, F = 0, e;
    }
    for (X(null), J.length = 0, F = 0; ye.length; )
      ye.pop()();
    for (let e = 0; e < V.length; e += 1) {
      const n = V[e];
      ce.has(n) || (ce.add(n), n());
    }
    V.length = 0;
  } while (J.length);
  for (; Ce.length; )
    Ce.pop()();
  fe = !1, ce.clear(), X(t);
}
function _t(t) {
  if (t.fragment !== null) {
    t.update(), T(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(z);
  }
}
function gt(t) {
  const e = [], n = [];
  V.forEach((s) => t.indexOf(s) === -1 ? e.push(s) : n.push(s)), n.forEach((s) => s()), V = e;
}
let Q;
function pt() {
  return Q || (Q = Promise.resolve(), Q.then(() => {
    Q = null;
  })), Q;
}
function re(t, e, n) {
  t.dispatchEvent(ze(`${e ? "intro" : "outro"}${n}`));
}
const ee = /* @__PURE__ */ new Set();
let D;
function le() {
  D = {
    r: 0,
    c: [],
    p: D
    // parent group
  };
}
function ae() {
  D.r || T(D.c), D = D.p;
}
function B(t, e) {
  t && t.i && (ee.delete(t), t.i(e));
}
function H(t, e, n, s) {
  if (t && t.o) {
    if (ee.has(t))
      return;
    ee.add(t), D.c.push(() => {
      ee.delete(t), s && (n && t.d(1), s());
    }), t.o(e);
  } else
    s && s();
}
const bt = { duration: 0 };
function q(t, e, n, s) {
  let o = e(t, n, { direction: "both" }), c = s ? 0 : 1, r = null, l = null, f = null, g;
  function u() {
    f && lt(t, f);
  }
  function _(d, p) {
    const $ = (
      /** @type {Program['d']} */
      d.b - c
    );
    return p *= Math.abs($), {
      a: c,
      b: d.b,
      d: $,
      duration: p,
      start: d.start,
      end: d.start + p,
      group: d.group
    };
  }
  function m(d) {
    const {
      delay: p = 0,
      duration: $ = 300,
      easing: k = Ie,
      tick: L = Z,
      css: j
    } = o || bt, y = {
      start: xe() + p,
      b: d
    };
    d || (y.group = D, D.r += 1), "inert" in t && (d ? g !== void 0 && (t.inert = g) : (g = /** @type {HTMLElement} */
    t.inert, t.inert = !0)), r || l ? l = y : (j && (u(), f = ve(t, c, d, $, p, k, j)), d && L(0, 1), r = _(y, $), z(() => re(t, d, "start")), et((v) => {
      if (l && v > l.start && (r = _(l, $), l = null, re(t, r.b, "start"), j && (u(), f = ve(
        t,
        c,
        r.b,
        r.duration,
        0,
        k,
        o.css
      ))), r) {
        if (v >= r.end)
          L(c = r.b, 1 - c), re(t, r.b, "end"), l || (r.b ? u() : --r.group.r || T(r.group.c)), r = null;
        else if (v >= r.start) {
          const w = v - r.start;
          c = r.a + r.d * k(w / r.duration), L(c, 1 - c);
        }
      }
      return !!(r || l);
    }));
  }
  return {
    run(d) {
      he(o) ? pt().then(() => {
        o = o({ direction: d ? "in" : "out" }), m(d);
      }) : m(d);
    },
    end() {
      u(), r = l = null;
    }
  };
}
function Le(t) {
  return (t == null ? void 0 : t.length) !== void 0 ? t : Array.from(t);
}
function mt(t, e, n) {
  const { fragment: s, after_update: i } = t.$$;
  s && s.m(e, n), z(() => {
    const o = t.$$.on_mount.map(Se).filter(he);
    t.$$.on_destroy ? t.$$.on_destroy.push(...o) : T(o), t.$$.on_mount = [];
  }), i.forEach(z);
}
function $t(t, e) {
  const n = t.$$;
  n.fragment !== null && (gt(n.after_update), T(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function kt(t, e) {
  t.$$.dirty[0] === -1 && (J.push(t), ht(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function wt(t, e, n, s, i, o, c = null, r = [-1]) {
  const l = K;
  X(t);
  const f = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: o,
    update: Z,
    not_equal: i,
    bound: $e(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (l ? l.$$.context : [])),
    // everything else
    callbacks: $e(),
    dirty: r,
    skip_bound: !1,
    root: e.target || l.$$.root
  };
  c && c(f.root);
  let g = !1;
  if (f.ctx = n ? n(t, e.props || {}, (u, _, ...m) => {
    const d = m.length ? m[0] : _;
    return f.ctx && i(f.ctx[u], f.ctx[u] = d) && (!f.skip_bound && f.bound[u] && f.bound[u](d), g && kt(t, u)), _;
  }) : [], f.update(), g = !0, T(f.before_update), f.fragment = s ? s(f.ctx) : !1, e.target) {
    if (e.hydrate) {
      const u = st(e.target);
      f.fragment && f.fragment.l(u), u.forEach(A);
    } else
      f.fragment && f.fragment.c();
    e.intro && B(t.$$.fragment), mt(t, e.target, e.anchor), O();
  }
  X(l);
}
let Fe;
typeof HTMLElement == "function" && (Fe = class extends HTMLElement {
  constructor(e, n, s) {
    super();
    /** The Svelte component constructor */
    R(this, "$$ctor");
    /** Slots */
    R(this, "$$s");
    /** The Svelte component instance */
    R(this, "$$c");
    /** Whether or not the custom element is connected */
    R(this, "$$cn", !1);
    /** Component props data */
    R(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    R(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    R(this, "$$p_d", {});
    /** @type {Record<string, Function[]>} Event listeners */
    R(this, "$$l", {});
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    R(this, "$$l_u", /* @__PURE__ */ new Map());
    this.$$ctor = e, this.$$s = n, s && this.attachShadow({ mode: "open" });
  }
  addEventListener(e, n, s) {
    if (this.$$l[e] = this.$$l[e] || [], this.$$l[e].push(n), this.$$c) {
      const i = this.$$c.$on(e, n);
      this.$$l_u.set(n, i);
    }
    super.addEventListener(e, n, s);
  }
  removeEventListener(e, n, s) {
    if (super.removeEventListener(e, n, s), this.$$c) {
      const i = this.$$l_u.get(n);
      i && (i(), this.$$l_u.delete(n));
    }
  }
  async connectedCallback() {
    if (this.$$cn = !0, !this.$$c) {
      let e = function(o) {
        return () => {
          let c;
          return {
            c: function() {
              c = C("slot"), o !== "default" && a(c, "name", o);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(f, g) {
              I(f, c, g);
            },
            d: function(f) {
              f && A(c);
            }
          };
        };
      };
      if (await Promise.resolve(), !this.$$cn)
        return;
      const n = {}, s = ot(this);
      for (const o of this.$$s)
        o in s && (n[o] = [e(o)]);
      for (const o of this.attributes) {
        const c = this.$$g_p(o.name);
        c in this.$$d || (this.$$d[c] = te(c, o.value, this.$$p_d, "toProp"));
      }
      this.$$c = new this.$$ctor({
        target: this.shadowRoot || this,
        props: {
          ...this.$$d,
          $$slots: n,
          $$scope: {
            ctx: []
          }
        }
      });
      const i = () => {
        this.$$r = !0;
        for (const o in this.$$p_d)
          if (this.$$d[o] = this.$$c.$$.ctx[this.$$c.$$.props[o]], this.$$p_d[o].reflect) {
            const c = te(
              o,
              this.$$d[o],
              this.$$p_d,
              "toAttribute"
            );
            c == null ? this.removeAttribute(this.$$p_d[o].attribute || o) : this.setAttribute(this.$$p_d[o].attribute || o, c);
          }
        this.$$r = !1;
      };
      this.$$c.$$.after_update.push(i), i();
      for (const o in this.$$l)
        for (const c of this.$$l[o]) {
          const r = this.$$c.$on(o, c);
          this.$$l_u.set(c, r);
        }
      this.$$l = {};
    }
  }
  // We don't need this when working within Svelte code, but for compatibility of people using this outside of Svelte
  // and setting attributes through setAttribute etc, this is helpful
  attributeChangedCallback(e, n, s) {
    var i;
    this.$$r || (e = this.$$g_p(e), this.$$d[e] = te(e, s, this.$$p_d, "toProp"), (i = this.$$c) == null || i.$set({ [e]: this.$$d[e] }));
  }
  disconnectedCallback() {
    this.$$cn = !1, Promise.resolve().then(() => {
      this.$$cn || (this.$$c.$destroy(), this.$$c = void 0);
    });
  }
  $$g_p(e) {
    return Object.keys(this.$$p_d).find(
      (n) => this.$$p_d[n].attribute === e || !this.$$p_d[n].attribute && n.toLowerCase() === e
    ) || e;
  }
});
function te(t, e, n, s) {
  var o;
  const i = (o = n[t]) == null ? void 0 : o.type;
  if (e = i === "Boolean" && typeof e != "boolean" ? e != null : e, !s || !n[t])
    return e;
  if (s === "toAttribute")
    switch (i) {
      case "Object":
      case "Array":
        return e == null ? null : JSON.stringify(e);
      case "Boolean":
        return e ? "" : null;
      case "Number":
        return e ?? null;
      default:
        return e;
    }
  else
    switch (i) {
      case "Object":
      case "Array":
        return e && JSON.parse(e);
      case "Boolean":
        return e;
      case "Number":
        return e != null ? +e : e;
      default:
        return e;
    }
}
function vt(t, e, n, s, i, o) {
  let c = class extends Fe {
    constructor() {
      super(t, n, i), this.$$p_d = e;
    }
    static get observedAttributes() {
      return Object.keys(e).map(
        (r) => (e[r].attribute || r).toLowerCase()
      );
    }
  };
  return Object.keys(e).forEach((r) => {
    Object.defineProperty(c.prototype, r, {
      get() {
        return this.$$c && r in this.$$c ? this.$$c[r] : this.$$d[r];
      },
      set(l) {
        var f;
        l = te(r, l, e), this.$$d[r] = l, (f = this.$$c) == null || f.$set({ [r]: l });
      }
    });
  }), s.forEach((r) => {
    Object.defineProperty(c.prototype, r, {
      get() {
        var l;
        return (l = this.$$c) == null ? void 0 : l[r];
      }
    });
  }), o && (c = o(c)), t.element = /** @type {any} */
  c, c;
}
class yt {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    R(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    R(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    $t(this, 1), this.$destroy = Z;
  }
  /**
   * @template {Extract<keyof Events, string>} K
   * @param {K} type
   * @param {((e: Events[K]) => void) | null | undefined} callback
   * @returns {() => void}
   */
  $on(e, n) {
    if (!he(n))
      return Z;
    const s = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return s.push(n), () => {
      const i = s.indexOf(n);
      i !== -1 && s.splice(i, 1);
    };
  }
  /**
   * @param {Partial<Props>} props
   * @returns {void}
   */
  $set(e) {
    this.$$set && !Ke(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const Ct = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(Ct);
/*! js-cookie v3.0.1 | MIT */
function x(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e];
    for (var s in n)
      t[s] = n[s];
  }
  return t;
}
var Lt = {
  read: function(t) {
    return t[0] === '"' && (t = t.slice(1, -1)), t.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent);
  },
  write: function(t) {
    return encodeURIComponent(t).replace(
      /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
      decodeURIComponent
    );
  }
};
function de(t, e) {
  function n(i, o, c) {
    if (!(typeof document > "u")) {
      c = x({}, e, c), typeof c.expires == "number" && (c.expires = new Date(Date.now() + c.expires * 864e5)), c.expires && (c.expires = c.expires.toUTCString()), i = encodeURIComponent(i).replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent).replace(/[()]/g, escape);
      var r = "";
      for (var l in c)
        c[l] && (r += "; " + l, c[l] !== !0 && (r += "=" + c[l].split(";")[0]));
      return document.cookie = i + "=" + t.write(o, i) + r;
    }
  }
  function s(i) {
    if (!(typeof document > "u" || arguments.length && !i)) {
      for (var o = document.cookie ? document.cookie.split("; ") : [], c = {}, r = 0; r < o.length; r++) {
        var l = o[r].split("="), f = l.slice(1).join("=");
        try {
          var g = decodeURIComponent(l[0]);
          if (c[g] = t.read(f, g), i === g)
            break;
        } catch {
        }
      }
      return i ? c[i] : c;
    }
  }
  return Object.create(
    {
      set: n,
      get: s,
      remove: function(i, o) {
        n(
          i,
          "",
          x({}, o, {
            expires: -1
          })
        );
      },
      withAttributes: function(i) {
        return de(this.converter, x({}, this.attributes, i));
      },
      withConverter: function(i) {
        return de(x({}, this.converter, i), this.attributes);
      }
    },
    {
      attributes: { value: Object.freeze(e) },
      converter: { value: Object.freeze(t) }
    }
  );
}
var ue = de(Lt, { path: "/" });
function jt(t, e) {
  const n = Object.keys(t), s = Object.keys(e);
  return s.length !== n.length ? !1 : s.every((i) => n.includes(i));
}
function Y(t, { delay: e = 0, duration: n = 400, easing: s = Ie } = {}) {
  const i = +getComputedStyle(t).opacity;
  return {
    delay: e,
    duration: n,
    easing: s,
    css: (o) => `opacity: ${o * i}`
  };
}
function je(t, e, n) {
  const s = t.slice();
  return s[32] = e[n], s[33] = e, s[34] = n, s;
}
function Ee(t) {
  let e, n, s, i, o, c, r;
  return {
    c() {
      e = C("button"), n = ke("svg"), s = ke("path"), a(s, "d", `M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17
        0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13
        35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0
        0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77
        54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11
        80.53-12.76l69.13-35.21a132.273 132.273 0 0 0
        57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176
        368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32
        32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33
        32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32
        32-14.33 32-32 32z`), a(n, "xmlns", "http://www.w3.org/2000/svg"), a(n, "viewBox", "0 0 512 512"), a(n, "fill", "currentColor"), a(e, "class", "cookieConsentToggle"), a(e, "part", "toggle"), a(
        e,
        "aria-label",
        /*editLabel*/
        t[8]
      );
    },
    m(l, f) {
      I(l, e, f), b(e, n), b(n, s), o = !0, c || (r = W(
        e,
        "click",
        /*show*/
        t[9]
      ), c = !0);
    },
    p(l, f) {
      (!o || f[0] & /*editLabel*/
      256) && a(
        e,
        "aria-label",
        /*editLabel*/
        l[8]
      );
    },
    i(l) {
      o || (l && z(() => {
        o && (i || (i = q(e, Y, {}, !0)), i.run(1));
      }), o = !0);
    },
    o(l) {
      l && (i || (i = q(e, Y, {}, !1)), i.run(0)), o = !1;
    },
    d(l) {
      l && A(e), l && i && i.end(), c = !1, r();
    }
  };
}
function Oe(t) {
  let e, n, s, i, o, c, r, l, f, g, u, _, m, d, p, $, k, L, j, y, v = (
    /*canRejectCookies*/
    t[0] && Ne(t)
  );
  return {
    c() {
      e = C("div"), n = C("div"), s = C("div"), i = C("div"), o = C("p"), c = M(
        /*heading*/
        t[2]
      ), r = P(), l = C("p"), f = P(), g = C("div"), u = C("button"), _ = M(
        /*settingsLabel*/
        t[6]
      ), m = P(), v && v.c(), d = P(), p = C("button"), $ = M(
        /*acceptLabel*/
        t[4]
      ), a(o, "class", "cookieConsent__Title"), a(o, "part", "consent--title"), a(l, "class", "cookieConsent__Description"), a(l, "part", "consent--description"), a(i, "class", "cookieConsent__Content"), a(i, "part", "consent--content"), a(s, "class", "cookieConsent__Left"), a(s, "part", "consent--left"), a(u, "type", "button"), a(u, "class", "cookieConsent__Button"), a(u, "part", "button"), a(
        u,
        "aria-label",
        /*settingsLabel*/
        t[6]
      ), a(p, "type", "submit"), a(p, "class", "cookieConsent__Button"), a(p, "part", "button"), a(
        p,
        "aria-label",
        /*acceptLabel*/
        t[4]
      ), a(g, "class", "cookieConsent__Right"), a(g, "part", "consent--right"), a(n, "class", "cookieConsent"), a(n, "part", "consent"), a(e, "class", "cookieConsentWrapper"), a(e, "part", "wrapper");
    },
    m(w, N) {
      I(w, e, N), b(e, n), b(n, s), b(s, i), b(i, o), b(o, c), b(i, r), b(i, l), l.innerHTML = /*description*/
      t[3], b(n, f), b(n, g), b(g, u), b(u, _), b(g, m), v && v.m(g, null), b(g, d), b(g, p), b(p, $), L = !0, j || (y = [
        W(
          u,
          "click",
          /*click_handler*/
          t[21]
        ),
        W(
          p,
          "click",
          /*choose*/
          t[15]
        )
      ], j = !0);
    },
    p(w, N) {
      (!L || N[0] & /*heading*/
      4) && U(
        c,
        /*heading*/
        w[2]
      ), (!L || N[0] & /*description*/
      8) && (l.innerHTML = /*description*/
      w[3]), (!L || N[0] & /*settingsLabel*/
      64) && U(
        _,
        /*settingsLabel*/
        w[6]
      ), (!L || N[0] & /*settingsLabel*/
      64) && a(
        u,
        "aria-label",
        /*settingsLabel*/
        w[6]
      ), /*canRejectCookies*/
      w[0] ? v ? v.p(w, N) : (v = Ne(w), v.c(), v.m(g, d)) : v && (v.d(1), v = null), (!L || N[0] & /*acceptLabel*/
      16) && U(
        $,
        /*acceptLabel*/
        w[4]
      ), (!L || N[0] & /*acceptLabel*/
      16) && a(
        p,
        "aria-label",
        /*acceptLabel*/
        w[4]
      );
    },
    i(w) {
      L || (w && z(() => {
        L && (k || (k = q(e, Y, {}, !0)), k.run(1));
      }), L = !0);
    },
    o(w) {
      w && (k || (k = q(e, Y, {}, !1)), k.run(0)), L = !1;
    },
    d(w) {
      w && A(e), v && v.d(), w && k && k.end(), j = !1, T(y);
    }
  };
}
function Ne(t) {
  let e, n, s, i;
  return {
    c() {
      e = C("button"), n = M(
        /*rejectLabel*/
        t[5]
      ), a(e, "type", "submit"), a(e, "class", "cookieConsent__Button"), a(e, "part", "button"), a(
        e,
        "aria-label",
        /*rejectLabel*/
        t[5]
      );
    },
    m(o, c) {
      I(o, e, c), b(e, n), s || (i = W(
        e,
        "click",
        /*reject*/
        t[14]
      ), s = !0);
    },
    p(o, c) {
      c[0] & /*rejectLabel*/
      32 && U(
        n,
        /*rejectLabel*/
        o[5]
      ), c[0] & /*rejectLabel*/
      32 && a(
        e,
        "aria-label",
        /*rejectLabel*/
        o[5]
      );
    },
    d(o) {
      o && A(e), s = !1, i();
    }
  };
}
function Re(t) {
  let e, n, s, i, o, c, r, l, f, g = Le(
    /*choicesArr*/
    t[11]
  ), u = [];
  for (let _ = 0; _ < g.length; _ += 1)
    u[_] = Be(je(t, g, _));
  return {
    c() {
      e = C("div"), n = C("div");
      for (let _ = 0; _ < u.length; _ += 1)
        u[_].c();
      s = P(), i = C("button"), o = M(
        /*closeLabel*/
        t[7]
      ), a(i, "type", "submit"), a(i, "class", "cookieConsent__Button cookieConsent__Button--Close"), a(i, "part", "button button--close"), a(
        i,
        "aria-label",
        /*closeLabel*/
        t[7]
      ), a(n, "class", "cookieConsentOperations__List"), a(n, "part", "operations--list"), a(e, "class", "cookieConsentOperations"), a(e, "part", "operations");
    },
    m(_, m) {
      I(_, e, m), b(e, n);
      for (let d = 0; d < u.length; d += 1)
        u[d] && u[d].m(n, null);
      b(n, s), b(n, i), b(i, o), r = !0, l || (f = W(
        i,
        "click",
        /*click_handler_1*/
        t[23]
      ), l = !0);
    },
    p(_, m) {
      if (m[0] & /*choicesArr, choicesMerged*/
      3072) {
        g = Le(
          /*choicesArr*/
          _[11]
        );
        let d;
        for (d = 0; d < g.length; d += 1) {
          const p = je(_, g, d);
          u[d] ? u[d].p(p, m) : (u[d] = Be(p), u[d].c(), u[d].m(n, s));
        }
        for (; d < u.length; d += 1)
          u[d].d(1);
        u.length = g.length;
      }
      (!r || m[0] & /*closeLabel*/
      128) && U(
        o,
        /*closeLabel*/
        _[7]
      ), (!r || m[0] & /*closeLabel*/
      128) && a(
        i,
        "aria-label",
        /*closeLabel*/
        _[7]
      );
    },
    i(_) {
      r || (_ && z(() => {
        r && (c || (c = q(e, Y, {}, !0)), c.run(1));
      }), r = !0);
    },
    o(_) {
      _ && (c || (c = q(e, Y, {}, !1)), c.run(0)), r = !1;
    },
    d(_) {
      _ && A(e), it(u, _), _ && c && c.end(), l = !1, f();
    }
  };
}
function Ae(t) {
  let e, n, s, i, o, c, r = (
    /*choice*/
    t[32].label + ""
  ), l, f, g, u, _, m = (
    /*choice*/
    t[32].description + ""
  ), d, p, $, k;
  function L() {
    t[22].call(
      n,
      /*choice*/
      t[32]
    );
  }
  return {
    c() {
      e = C("div"), n = C("input"), o = P(), c = C("label"), l = M(r), u = P(), _ = C("span"), d = M(m), a(n, "type", "checkbox"), a(n, "id", s = `gdpr-check-${/*choice*/
      t[32].id}`), a(n, "part", "operations--list-item-input"), n.disabled = i = /*choice*/
      t[32].id === "necessary", a(c, "for", f = `gdpr-check-${/*choice*/
      t[32].id}`), a(c, "part", g = `operations--list-item-label ${/*choicesMerged*/
      t[10][
        /*choice*/
        t[32].id
      ].value ? "operations--list-item-label--checked" : ""}`), a(_, "class", "cookieConsentOperations__ItemLabel"), a(_, "part", "operations--list-item-description"), a(e, "class", "cookieConsentOperations__Item"), a(e, "part", p = `operations--list-item ${/*choice*/
      t[32].id === "necessary" ? "operations--list-item--disabled" : ""}`), we(
        e,
        "disabled",
        /*choice*/
        t[32].id === "necessary"
      );
    },
    m(j, y) {
      I(j, e, y), b(e, n), n.checked = /*choicesMerged*/
      t[10][
        /*choice*/
        t[32].id
      ].value, b(e, o), b(e, c), b(c, l), b(e, u), b(e, _), b(_, d), $ || (k = W(n, "change", L), $ = !0);
    },
    p(j, y) {
      t = j, y[0] & /*choicesArr*/
      2048 && s !== (s = `gdpr-check-${/*choice*/
      t[32].id}`) && a(n, "id", s), y[0] & /*choicesArr*/
      2048 && i !== (i = /*choice*/
      t[32].id === "necessary") && (n.disabled = i), y[0] & /*choicesMerged, choicesArr*/
      3072 && (n.checked = /*choicesMerged*/
      t[10][
        /*choice*/
        t[32].id
      ].value), y[0] & /*choicesArr*/
      2048 && r !== (r = /*choice*/
      t[32].label + "") && U(l, r), y[0] & /*choicesArr*/
      2048 && f !== (f = `gdpr-check-${/*choice*/
      t[32].id}`) && a(c, "for", f), y[0] & /*choicesMerged, choicesArr*/
      3072 && g !== (g = `operations--list-item-label ${/*choicesMerged*/
      t[10][
        /*choice*/
        t[32].id
      ].value ? "operations--list-item-label--checked" : ""}`) && a(c, "part", g), y[0] & /*choicesArr*/
      2048 && m !== (m = /*choice*/
      t[32].description + "") && U(d, m), y[0] & /*choicesArr*/
      2048 && p !== (p = `operations--list-item ${/*choice*/
      t[32].id === "necessary" ? "operations--list-item--disabled" : ""}`) && a(e, "part", p), y[0] & /*choicesArr*/
      2048 && we(
        e,
        "disabled",
        /*choice*/
        t[32].id === "necessary"
      );
    },
    d(j) {
      j && A(e), $ = !1, k();
    }
  };
}
function Be(t) {
  let e = Object.hasOwnProperty.call(
    /*choicesMerged*/
    t[10],
    /*choice*/
    t[32].id
  ) && /*choicesMerged*/
  t[10][
    /*choice*/
    t[32].id
  ], n, s = e && Ae(t);
  return {
    c() {
      s && s.c(), n = Ue();
    },
    m(i, o) {
      s && s.m(i, o), I(i, n, o);
    },
    p(i, o) {
      o[0] & /*choicesMerged, choicesArr*/
      3072 && (e = Object.hasOwnProperty.call(
        /*choicesMerged*/
        i[10],
        /*choice*/
        i[32].id
      ) && /*choicesMerged*/
      i[10][
        /*choice*/
        i[32].id
      ]), e ? s ? s.p(i, o) : (s = Ae(i), s.c(), s.m(n.parentNode, n)) : s && (s.d(1), s = null);
    },
    d(i) {
      i && A(n), s && s.d(i);
    }
  };
}
function Et(t) {
  let e, n, s, i = (
    /*showEditIcon*/
    t[1] && Ee(t)
  ), o = (
    /*shown*/
    t[12] && Oe(t)
  ), c = (
    /*settingsShown*/
    t[13] && Re(t)
  );
  return {
    c() {
      i && i.c(), e = P(), o && o.c(), n = P(), c && c.c(), s = Ue();
    },
    m(r, l) {
      i && i.m(r, l), I(r, e, l), o && o.m(r, l), I(r, n, l), c && c.m(r, l), I(r, s, l);
    },
    p(r, l) {
      /*showEditIcon*/
      r[1] ? i ? (i.p(r, l), l[0] & /*showEditIcon*/
      2 && B(i, 1)) : (i = Ee(r), i.c(), B(i, 1), i.m(e.parentNode, e)) : i && (le(), H(i, 1, 1, () => {
        i = null;
      }), ae()), /*shown*/
      r[12] ? o ? (o.p(r, l), l[0] & /*shown*/
      4096 && B(o, 1)) : (o = Oe(r), o.c(), B(o, 1), o.m(n.parentNode, n)) : o && (le(), H(o, 1, 1, () => {
        o = null;
      }), ae()), /*settingsShown*/
      r[13] ? c ? (c.p(r, l), l[0] & /*settingsShown*/
      8192 && B(c, 1)) : (c = Re(r), c.c(), B(c, 1), c.m(s.parentNode, s)) : c && (le(), H(c, 1, 1, () => {
        c = null;
      }), ae());
    },
    i(r) {
      B(i), B(o), B(c);
    },
    o(r) {
      H(i), H(o), H(c);
    },
    d(r) {
      r && (A(e), A(n), A(s)), i && i.d(r), o && o.d(r), c && c.d(r);
    }
  };
}
function Ot(t, e, n) {
  let s, i, o, c;
  const r = ft();
  let { cookieName: l = null } = e, { canRejectCookies: f = !1 } = e, { showEditIcon: g = !0 } = e, { visible: u = !0 } = e, _ = !1, m = !1, { heading: d = "GDPR Notice" } = e, { description: p = "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies." } = e, { categories: $ = {
    analytics() {
    },
    tracking() {
    },
    marketing() {
    },
    necessary() {
    }
  } } = e, { cookieConfig: k = {} } = e;
  const L = { sameSite: "strict" };
  let { choices: j = {} } = e;
  const y = {
    necessary: {
      label: "Necessary cookies",
      description: "Used for cookie control. Can't be turned off.",
      value: !0
    },
    tracking: {
      label: "Tracking cookies",
      description: "Used for advertising purposes.",
      value: !0
    },
    analytics: {
      label: "Analytics cookies",
      description: "Used to control Google Analytics, a 3rd party tool offered by Google to track user behavior.",
      value: !0
    },
    marketing: {
      label: "Marketing cookies",
      description: "Used for marketing data.",
      value: !0
    }
  };
  let { acceptLabel: v = "Accept cookies" } = e, { rejectLabel: w = "Reject cookies" } = e, { settingsLabel: N = "Cookie settings" } = e, { closeLabel: ge = "Close settings" } = e, { editLabel: pe = "Edit cookie settings" } = e;
  function se() {
    n(12, _ = u);
  }
  ut(() => {
    if (!l)
      throw new Error("You must set gdpr cookie name");
    const h = ue.get(l);
    if (!h) {
      se();
      return;
    }
    try {
      const { choices: E } = JSON.parse(h);
      if (!jt(o, E))
        throw new Error("cookie consent has changed");
      oe(E);
    } catch {
      Je(), se();
    }
  });
  function be(h) {
    const E = /* @__PURE__ */ new Date();
    E.setDate(E.getDate() + 365);
    const S = Object.assign({}, L, k, { expires: E });
    ue.set(l, JSON.stringify({ choices: h }), S);
  }
  function Je() {
    const { path: h } = k;
    ue.remove(l, Object.assign({}, h ? { path: h } : {}));
  }
  function oe(h) {
    Object.keys(o).forEach((S) => {
      const me = h[S];
      s[S] && n(10, s[S].value = me, s), me && ($[S] && $[S](), r(`${S}`));
    }), n(12, _ = !1);
  }
  function Ge() {
    be(c), oe(c);
  }
  function Ve() {
    be(o), oe(o);
  }
  const We = () => {
    n(13, m = !0);
  };
  function qe(h) {
    s[h.id].value = this.checked, n(10, s), n(20, j);
  }
  const Ye = () => {
    n(13, m = !1);
  };
  return t.$$set = (h) => {
    "cookieName" in h && n(16, l = h.cookieName), "canRejectCookies" in h && n(0, f = h.canRejectCookies), "showEditIcon" in h && n(1, g = h.showEditIcon), "visible" in h && n(17, u = h.visible), "heading" in h && n(2, d = h.heading), "description" in h && n(3, p = h.description), "categories" in h && n(18, $ = h.categories), "cookieConfig" in h && n(19, k = h.cookieConfig), "choices" in h && n(20, j = h.choices), "acceptLabel" in h && n(4, v = h.acceptLabel), "rejectLabel" in h && n(5, w = h.rejectLabel), "settingsLabel" in h && n(6, N = h.settingsLabel), "closeLabel" in h && n(7, ge = h.closeLabel), "editLabel" in h && n(8, pe = h.editLabel);
  }, t.$$.update = () => {
    t.$$.dirty[0] & /*choices*/
    1048576 && n(10, s = Object.assign({}, y, j)), t.$$.dirty[0] & /*choicesMerged*/
    1024 && n(11, i = Object.values(s).map((h, E) => Object.assign({}, h, { id: Object.keys(s)[E] }))), t.$$.dirty[0] & /*choicesArr*/
    2048 && (o = i.reduce(
      (h, E) => (h[E.id] = E.value ? E.value : !1, h),
      {}
    )), t.$$.dirty[0] & /*choicesArr*/
    2048 && (c = i.reduce(
      (h, E) => (h[E.id] = E.id === "necessary", h),
      {}
    ));
  }, [
    f,
    g,
    d,
    p,
    v,
    w,
    N,
    ge,
    pe,
    se,
    s,
    i,
    _,
    m,
    Ge,
    Ve,
    l,
    u,
    $,
    k,
    j,
    We,
    qe,
    Ye
  ];
}
class He extends yt {
  constructor(e) {
    super(), wt(
      this,
      e,
      Ot,
      Et,
      Ze,
      {
        cookieName: 16,
        canRejectCookies: 0,
        showEditIcon: 1,
        visible: 17,
        heading: 2,
        description: 3,
        categories: 18,
        cookieConfig: 19,
        choices: 20,
        acceptLabel: 4,
        rejectLabel: 5,
        settingsLabel: 6,
        closeLabel: 7,
        editLabel: 8,
        show: 9
      },
      null,
      [-1, -1]
    );
  }
  get cookieName() {
    return this.$$.ctx[16];
  }
  set cookieName(e) {
    this.$$set({ cookieName: e }), O();
  }
  get canRejectCookies() {
    return this.$$.ctx[0];
  }
  set canRejectCookies(e) {
    this.$$set({ canRejectCookies: e }), O();
  }
  get showEditIcon() {
    return this.$$.ctx[1];
  }
  set showEditIcon(e) {
    this.$$set({ showEditIcon: e }), O();
  }
  get visible() {
    return this.$$.ctx[17];
  }
  set visible(e) {
    this.$$set({ visible: e }), O();
  }
  get heading() {
    return this.$$.ctx[2];
  }
  set heading(e) {
    this.$$set({ heading: e }), O();
  }
  get description() {
    return this.$$.ctx[3];
  }
  set description(e) {
    this.$$set({ description: e }), O();
  }
  get categories() {
    return this.$$.ctx[18];
  }
  set categories(e) {
    this.$$set({ categories: e }), O();
  }
  get cookieConfig() {
    return this.$$.ctx[19];
  }
  set cookieConfig(e) {
    this.$$set({ cookieConfig: e }), O();
  }
  get choices() {
    return this.$$.ctx[20];
  }
  set choices(e) {
    this.$$set({ choices: e }), O();
  }
  get acceptLabel() {
    return this.$$.ctx[4];
  }
  set acceptLabel(e) {
    this.$$set({ acceptLabel: e }), O();
  }
  get rejectLabel() {
    return this.$$.ctx[5];
  }
  set rejectLabel(e) {
    this.$$set({ rejectLabel: e }), O();
  }
  get settingsLabel() {
    return this.$$.ctx[6];
  }
  set settingsLabel(e) {
    this.$$set({ settingsLabel: e }), O();
  }
  get closeLabel() {
    return this.$$.ctx[7];
  }
  set closeLabel(e) {
    this.$$set({ closeLabel: e }), O();
  }
  get editLabel() {
    return this.$$.ctx[8];
  }
  set editLabel(e) {
    this.$$set({ editLabel: e }), O();
  }
  get show() {
    return this.$$.ctx[9];
  }
}
customElements.define("cookie-consent-banner", vt(He, { cookieName: {}, canRejectCookies: { type: "Boolean" }, showEditIcon: { type: "Boolean" }, visible: { type: "Boolean" }, heading: {}, description: {}, categories: {}, cookieConfig: {}, choices: {}, acceptLabel: {}, rejectLabel: {}, settingsLabel: {}, closeLabel: {}, editLabel: {} }, [], ["show"], !0));
const Rt = {
  Banner: He
};
export {
  Rt as default
};
