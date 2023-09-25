var Ye = Object.defineProperty;
var Qe = (t, e, n) => e in t ? Ye(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n;
var N = (t, e, n) => (Qe(t, typeof e != "symbol" ? e + "" : e, n), n);
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
function Xe(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function Ze(t) {
  return Object.keys(t).length === 0;
}
const Pe = typeof window < "u";
let Ke = Pe ? () => window.performance.now() : () => Date.now(), _e = Pe ? (t) => requestAnimationFrame(t) : Z;
const G = /* @__PURE__ */ new Set();
function De(t) {
  G.forEach((e) => {
    e.c(t) || (G.delete(e), e.f());
  }), G.size !== 0 && _e(De);
}
function xe(t) {
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
function p(t, e) {
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
function et(t) {
  const e = L("style");
  return e.textContent = "/* empty */", tt(Me(t), e), e.sheet;
}
function tt(t, e) {
  return p(
    /** @type {Document} */
    t.head || t,
    e
  ), e.sheet;
}
function B(t, e, n) {
  t.insertBefore(e, n || null);
}
function R(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function nt(t, e) {
  for (let n = 0; n < t.length; n += 1)
    t[n] && t[n].d(e);
}
function L(t) {
  return document.createElement(t);
}
function ke(t) {
  return document.createElementNS("http://www.w3.org/2000/svg", t);
}
function D(t) {
  return document.createTextNode(t);
}
function S() {
  return D(" ");
}
function Ue() {
  return D("");
}
function W(t, e, n, s) {
  return t.addEventListener(e, n, s), () => t.removeEventListener(e, n, s);
}
function a(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function it(t) {
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
function st(t) {
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
function ot(t) {
  let e = 5381, n = t.length;
  for (; n--; )
    e = (e << 5) - e ^ t.charCodeAt(n);
  return e >>> 0;
}
function ct(t, e) {
  const n = { stylesheet: et(e), rules: {} };
  return ne.set(t, n), n;
}
function ve(t, e, n, s, i, o, c, r = 0) {
  const l = 16.666 / s;
  let f = `{
`;
  for (let $ = 0; $ <= 1; $ += l) {
    const y = e + (n - e) * o($);
    f += $ * 100 + `%{${c(y, 1 - y)}}
`;
  }
  const g = f + `100% {${c(n, 1 - n)}}
}`, u = `__svelte_${ot(g)}_${r}`, _ = Me(t), { stylesheet: m, rules: d } = ne.get(_) || ct(_, t);
  d[u] || (d[u] = !0, m.insertRule(`@keyframes ${u} ${g}`, m.cssRules.length));
  const b = t.style.animation || "";
  return t.style.animation = `${b ? `${b}, ` : ""}${u} ${s}ms linear ${i}ms 1 both`, ie += 1, u;
}
function rt(t, e) {
  const n = (t.style.animation || "").split(", "), s = n.filter(
    e ? (o) => o.indexOf(e) < 0 : (o) => o.indexOf("__svelte") === -1
    // remove all Svelte animations
  ), i = n.length - s.length;
  i && (t.style.animation = s.join(", "), ie -= i, ie || lt());
}
function lt() {
  _e(() => {
    ie || (ne.forEach((t) => {
      const { ownerNode: e } = t.stylesheet;
      e && R(e);
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
function at(t) {
  Te().$$.on_mount.push(t);
}
function ut() {
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
const Ce = [], ft = /* @__PURE__ */ Promise.resolve();
let fe = !1;
function dt() {
  fe || (fe = !0, ft.then(E));
}
function z(t) {
  V.push(t);
}
const ce = /* @__PURE__ */ new Set();
let F = 0;
function E() {
  if (F !== 0)
    return;
  const t = K;
  do {
    try {
      for (; F < J.length; ) {
        const e = J[F];
        F++, X(e), ht(e.$$);
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
function ht(t) {
  if (t.fragment !== null) {
    t.update(), T(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(z);
  }
}
function _t(t) {
  const e = [], n = [];
  V.forEach((s) => t.indexOf(s) === -1 ? e.push(s) : n.push(s)), n.forEach((s) => s()), V = e;
}
let Q;
function gt() {
  return Q || (Q = Promise.resolve(), Q.then(() => {
    Q = null;
  })), Q;
}
function re(t, e, n) {
  t.dispatchEvent(ze(`${e ? "intro" : "outro"}${n}`));
}
const ee = /* @__PURE__ */ new Set();
let P;
function le() {
  P = {
    r: 0,
    c: [],
    p: P
    // parent group
  };
}
function ae() {
  P.r || T(P.c), P = P.p;
}
function A(t, e) {
  t && t.i && (ee.delete(t), t.i(e));
}
function H(t, e, n, s) {
  if (t && t.o) {
    if (ee.has(t))
      return;
    ee.add(t), P.c.push(() => {
      ee.delete(t), s && (n && t.d(1), s());
    }), t.o(e);
  } else
    s && s();
}
const bt = { duration: 0 };
function q(t, e, n, s) {
  let o = e(t, n, { direction: "both" }), c = s ? 0 : 1, r = null, l = null, f = null, g;
  function u() {
    f && rt(t, f);
  }
  function _(d, b) {
    const $ = (
      /** @type {Program['d']} */
      d.b - c
    );
    return b *= Math.abs($), {
      a: c,
      b: d.b,
      d: $,
      duration: b,
      start: d.start,
      end: d.start + b,
      group: d.group
    };
  }
  function m(d) {
    const {
      delay: b = 0,
      duration: $ = 300,
      easing: y = Ie,
      tick: k = Z,
      css: w
    } = o || bt, M = {
      start: Ke() + b,
      b: d
    };
    d || (M.group = P, P.r += 1), "inert" in t && (d ? g !== void 0 && (t.inert = g) : (g = /** @type {HTMLElement} */
    t.inert, t.inert = !0)), r || l ? l = M : (w && (u(), f = ve(t, c, d, $, b, y, w)), d && k(0, 1), r = _(M, $), z(() => re(t, d, "start")), xe((C) => {
      if (l && C > l.start && (r = _(l, $), l = null, re(t, r.b, "start"), w && (u(), f = ve(
        t,
        c,
        r.b,
        r.duration,
        0,
        y,
        o.css
      ))), r) {
        if (C >= r.end)
          k(c = r.b, 1 - c), re(t, r.b, "end"), l || (r.b ? u() : --r.group.r || T(r.group.c)), r = null;
        else if (C >= r.start) {
          const v = C - r.start;
          c = r.a + r.d * y(v / r.duration), k(c, 1 - c);
        }
      }
      return !!(r || l);
    }));
  }
  return {
    run(d) {
      he(o) ? gt().then(() => {
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
function pt(t, e, n) {
  const { fragment: s, after_update: i } = t.$$;
  s && s.m(e, n), z(() => {
    const o = t.$$.on_mount.map(Se).filter(he);
    t.$$.on_destroy ? t.$$.on_destroy.push(...o) : T(o), t.$$.on_mount = [];
  }), i.forEach(z);
}
function mt(t, e) {
  const n = t.$$;
  n.fragment !== null && (_t(n.after_update), T(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function $t(t, e) {
  t.$$.dirty[0] === -1 && (J.push(t), dt(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function kt(t, e, n, s, i, o, c = null, r = [-1]) {
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
    return f.ctx && i(f.ctx[u], f.ctx[u] = d) && (!f.skip_bound && f.bound[u] && f.bound[u](d), g && $t(t, u)), _;
  }) : [], f.update(), g = !0, T(f.before_update), f.fragment = s ? s(f.ctx) : !1, e.target) {
    if (e.hydrate) {
      const u = it(e.target);
      f.fragment && f.fragment.l(u), u.forEach(R);
    } else
      f.fragment && f.fragment.c();
    e.intro && A(t.$$.fragment), pt(t, e.target, e.anchor), E();
  }
  X(l);
}
let Fe;
typeof HTMLElement == "function" && (Fe = class extends HTMLElement {
  constructor(e, n, s) {
    super();
    /** The Svelte component constructor */
    N(this, "$$ctor");
    /** Slots */
    N(this, "$$s");
    /** The Svelte component instance */
    N(this, "$$c");
    /** Whether or not the custom element is connected */
    N(this, "$$cn", !1);
    /** Component props data */
    N(this, "$$d", {});
    /** `true` if currently in the process of reflecting component props back to attributes */
    N(this, "$$r", !1);
    /** @type {Record<string, CustomElementPropDefinition>} Props definition (name, reflected, type etc) */
    N(this, "$$p_d", {});
    /** @type {Record<string, Function[]>} Event listeners */
    N(this, "$$l", {});
    /** @type {Map<Function, Function>} Event listener unsubscribe functions */
    N(this, "$$l_u", /* @__PURE__ */ new Map());
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
              c = L("slot"), o !== "default" && a(c, "name", o);
            },
            /**
             * @param {HTMLElement} target
             * @param {HTMLElement} [anchor]
             */
            m: function(f, g) {
              B(f, c, g);
            },
            d: function(f) {
              f && R(c);
            }
          };
        };
      };
      if (await Promise.resolve(), !this.$$cn)
        return;
      const n = {}, s = st(this);
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
function wt(t, e, n, s, i, o) {
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
class vt {
  constructor() {
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    N(this, "$$");
    /**
     * ### PRIVATE API
     *
     * Do not use, may change at any time
     *
     * @type {any}
     */
    N(this, "$$set");
  }
  /** @returns {void} */
  $destroy() {
    mt(this, 1), this.$destroy = Z;
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
    this.$$set && !Ze(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
const yt = "4";
typeof window < "u" && (window.__svelte || (window.__svelte = { v: /* @__PURE__ */ new Set() })).v.add(yt);
/*! js-cookie v3.0.1 | MIT */
function x(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e];
    for (var s in n)
      t[s] = n[s];
  }
  return t;
}
var Ct = {
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
var ue = de(Ct, { path: "/" });
function Lt(t, e) {
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
      e = L("button"), n = ke("svg"), s = ke("path"), a(s, "d", `M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17
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
      B(l, e, f), p(e, n), p(n, s), o = !0, c || (r = W(
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
      l && R(e), l && i && i.end(), c = !1, r();
    }
  };
}
function Oe(t) {
  let e, n, s, i, o, c, r, l, f, g, u, _, m, d, b, $, y, k, w, M, C = (
    /*canRejectCookies*/
    t[0] && Ne(t)
  );
  return {
    c() {
      e = L("div"), n = L("div"), s = L("div"), i = L("div"), o = L("p"), c = D(
        /*heading*/
        t[2]
      ), r = S(), l = L("p"), f = S(), g = L("div"), u = L("button"), _ = D(
        /*settingsLabel*/
        t[6]
      ), m = S(), C && C.c(), d = S(), b = L("button"), $ = D(
        /*acceptLabel*/
        t[4]
      ), a(o, "class", "cookieConsent__Title"), a(o, "part", "consent--title"), a(l, "class", "cookieConsent__Description"), a(l, "part", "consent--description"), a(i, "class", "cookieConsent__Content"), a(i, "part", "consent--content"), a(s, "class", "cookieConsent__Left"), a(s, "part", "consent--left"), a(u, "type", "button"), a(u, "class", "cookieConsent__Button"), a(u, "part", "button"), a(
        u,
        "aria-label",
        /*settingsLabel*/
        t[6]
      ), a(b, "type", "submit"), a(b, "class", "cookieConsent__Button"), a(b, "part", "button"), a(
        b,
        "aria-label",
        /*acceptLabel*/
        t[4]
      ), a(g, "class", "cookieConsent__Right"), a(g, "part", "consent--right"), a(n, "class", "cookieConsent"), a(n, "part", "consent"), a(e, "class", "cookieConsentWrapper"), a(e, "part", "wrapper");
    },
    m(v, O) {
      B(v, e, O), p(e, n), p(n, s), p(s, i), p(i, o), p(o, c), p(i, r), p(i, l), l.innerHTML = /*description*/
      t[3], p(n, f), p(n, g), p(g, u), p(u, _), p(g, m), C && C.m(g, null), p(g, d), p(g, b), p(b, $), k = !0, w || (M = [
        W(
          u,
          "click",
          /*click_handler*/
          t[21]
        ),
        W(
          b,
          "click",
          /*choose*/
          t[15]
        )
      ], w = !0);
    },
    p(v, O) {
      (!k || O[0] & /*heading*/
      4) && U(
        c,
        /*heading*/
        v[2]
      ), (!k || O[0] & /*description*/
      8) && (l.innerHTML = /*description*/
      v[3]), (!k || O[0] & /*settingsLabel*/
      64) && U(
        _,
        /*settingsLabel*/
        v[6]
      ), (!k || O[0] & /*settingsLabel*/
      64) && a(
        u,
        "aria-label",
        /*settingsLabel*/
        v[6]
      ), /*canRejectCookies*/
      v[0] ? C ? C.p(v, O) : (C = Ne(v), C.c(), C.m(g, d)) : C && (C.d(1), C = null), (!k || O[0] & /*acceptLabel*/
      16) && U(
        $,
        /*acceptLabel*/
        v[4]
      ), (!k || O[0] & /*acceptLabel*/
      16) && a(
        b,
        "aria-label",
        /*acceptLabel*/
        v[4]
      );
    },
    i(v) {
      k || (v && z(() => {
        k && (y || (y = q(e, Y, {}, !0)), y.run(1));
      }), k = !0);
    },
    o(v) {
      v && (y || (y = q(e, Y, {}, !1)), y.run(0)), k = !1;
    },
    d(v) {
      v && R(e), C && C.d(), v && y && y.end(), w = !1, T(M);
    }
  };
}
function Ne(t) {
  let e, n, s, i;
  return {
    c() {
      e = L("button"), n = D(
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
      B(o, e, c), p(e, n), s || (i = W(
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
      o && R(e), s = !1, i();
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
      e = L("div"), n = L("div");
      for (let _ = 0; _ < u.length; _ += 1)
        u[_].c();
      s = S(), i = L("button"), o = D(
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
      B(_, e, m), p(e, n);
      for (let d = 0; d < u.length; d += 1)
        u[d] && u[d].m(n, null);
      p(n, s), p(n, i), p(i, o), r = !0, l || (f = W(
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
          const b = je(_, g, d);
          u[d] ? u[d].p(b, m) : (u[d] = Be(b), u[d].c(), u[d].m(n, s));
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
      _ && R(e), nt(u, _), _ && c && c.end(), l = !1, f();
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
  ), d, b, $;
  function y() {
    t[22].call(
      n,
      /*choice*/
      t[32]
    );
  }
  return {
    c() {
      e = L("div"), n = L("input"), o = S(), c = L("label"), l = D(r), u = S(), _ = L("span"), d = D(m), a(n, "type", "checkbox"), a(n, "id", s = `gdpr-check-${/*choice*/
      t[32].id}`), a(n, "part", "operations--list-item-input"), n.disabled = i = /*choice*/
      t[32].id === "necessary", a(c, "for", f = `gdpr-check-${/*choice*/
      t[32].id}`), a(c, "part", g = `operations--list-item-label ${/*choicesMerged*/
      t[10][
        /*choice*/
        t[32].id
      ].value ? "operations--list-item-label--checked" : ""}`), a(_, "class", "cookieConsentOperations__ItemLabel"), a(_, "part", "operations--list-item-description"), a(e, "class", "cookieConsentOperations__Item"), a(e, "part", "operations--list-item"), we(
        e,
        "disabled",
        /*choice*/
        t[32].id === "necessary"
      );
    },
    m(k, w) {
      B(k, e, w), p(e, n), n.checked = /*choicesMerged*/
      t[10][
        /*choice*/
        t[32].id
      ].value, p(e, o), p(e, c), p(c, l), p(e, u), p(e, _), p(_, d), b || ($ = W(n, "change", y), b = !0);
    },
    p(k, w) {
      t = k, w[0] & /*choicesArr*/
      2048 && s !== (s = `gdpr-check-${/*choice*/
      t[32].id}`) && a(n, "id", s), w[0] & /*choicesArr*/
      2048 && i !== (i = /*choice*/
      t[32].id === "necessary") && (n.disabled = i), w[0] & /*choicesMerged, choicesArr*/
      3072 && (n.checked = /*choicesMerged*/
      t[10][
        /*choice*/
        t[32].id
      ].value), w[0] & /*choicesArr*/
      2048 && r !== (r = /*choice*/
      t[32].label + "") && U(l, r), w[0] & /*choicesArr*/
      2048 && f !== (f = `gdpr-check-${/*choice*/
      t[32].id}`) && a(c, "for", f), w[0] & /*choicesMerged, choicesArr*/
      3072 && g !== (g = `operations--list-item-label ${/*choicesMerged*/
      t[10][
        /*choice*/
        t[32].id
      ].value ? "operations--list-item-label--checked" : ""}`) && a(c, "part", g), w[0] & /*choicesArr*/
      2048 && m !== (m = /*choice*/
      t[32].description + "") && U(d, m), w[0] & /*choicesArr*/
      2048 && we(
        e,
        "disabled",
        /*choice*/
        t[32].id === "necessary"
      );
    },
    d(k) {
      k && R(e), b = !1, $();
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
      s && s.m(i, o), B(i, n, o);
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
      i && R(n), s && s.d(i);
    }
  };
}
function jt(t) {
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
      i && i.c(), e = S(), o && o.c(), n = S(), c && c.c(), s = Ue();
    },
    m(r, l) {
      i && i.m(r, l), B(r, e, l), o && o.m(r, l), B(r, n, l), c && c.m(r, l), B(r, s, l);
    },
    p(r, l) {
      /*showEditIcon*/
      r[1] ? i ? (i.p(r, l), l[0] & /*showEditIcon*/
      2 && A(i, 1)) : (i = Ee(r), i.c(), A(i, 1), i.m(e.parentNode, e)) : i && (le(), H(i, 1, 1, () => {
        i = null;
      }), ae()), /*shown*/
      r[12] ? o ? (o.p(r, l), l[0] & /*shown*/
      4096 && A(o, 1)) : (o = Oe(r), o.c(), A(o, 1), o.m(n.parentNode, n)) : o && (le(), H(o, 1, 1, () => {
        o = null;
      }), ae()), /*settingsShown*/
      r[13] ? c ? (c.p(r, l), l[0] & /*settingsShown*/
      8192 && A(c, 1)) : (c = Re(r), c.c(), A(c, 1), c.m(s.parentNode, s)) : c && (le(), H(c, 1, 1, () => {
        c = null;
      }), ae());
    },
    i(r) {
      A(i), A(o), A(c);
    },
    o(r) {
      H(i), H(o), H(c);
    },
    d(r) {
      r && (R(e), R(n), R(s)), i && i.d(r), o && o.d(r), c && c.d(r);
    }
  };
}
function Et(t, e, n) {
  let s, i, o, c;
  const r = ut();
  let { cookieName: l = null } = e, { canRejectCookies: f = !1 } = e, { showEditIcon: g = !0 } = e, { visible: u = !0 } = e, _ = !1, m = !1, { heading: d = "GDPR Notice" } = e, { description: b = "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies." } = e, { categories: $ = {
    analytics() {
    },
    tracking() {
    },
    marketing() {
    },
    necessary() {
    }
  } } = e, { cookieConfig: y = {} } = e;
  const k = { sameSite: "strict" };
  let { choices: w = {} } = e;
  const M = {
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
  let { acceptLabel: C = "Accept cookies" } = e, { rejectLabel: v = "Reject cookies" } = e, { settingsLabel: O = "Cookie settings" } = e, { closeLabel: ge = "Close settings" } = e, { editLabel: be = "Edit cookie settings" } = e;
  function se() {
    n(12, _ = u);
  }
  at(() => {
    if (!l)
      throw new Error("You must set gdpr cookie name");
    const h = ue.get(l);
    if (!h) {
      se();
      return;
    }
    try {
      const { choices: j } = JSON.parse(h);
      if (!Lt(o, j))
        throw new Error("cookie consent has changed");
      oe(j);
    } catch {
      He(), se();
    }
  });
  function pe(h) {
    const j = /* @__PURE__ */ new Date();
    j.setDate(j.getDate() + 365);
    const I = Object.assign({}, k, y, { expires: j });
    ue.set(l, JSON.stringify({ choices: h }), I);
  }
  function He() {
    const { path: h } = y;
    ue.remove(l, Object.assign({}, h ? { path: h } : {}));
  }
  function oe(h) {
    Object.keys(o).forEach((I) => {
      const me = h[I];
      s[I] && n(10, s[I].value = me, s), me && ($[I] && $[I](), r(`${I}`));
    }), n(12, _ = !1);
  }
  function Je() {
    pe(c), oe(c);
  }
  function Ge() {
    pe(o), oe(o);
  }
  const Ve = () => {
    n(13, m = !0);
  };
  function We(h) {
    s[h.id].value = this.checked, n(10, s), n(20, w);
  }
  const qe = () => {
    n(13, m = !1);
  };
  return t.$$set = (h) => {
    "cookieName" in h && n(16, l = h.cookieName), "canRejectCookies" in h && n(0, f = h.canRejectCookies), "showEditIcon" in h && n(1, g = h.showEditIcon), "visible" in h && n(17, u = h.visible), "heading" in h && n(2, d = h.heading), "description" in h && n(3, b = h.description), "categories" in h && n(18, $ = h.categories), "cookieConfig" in h && n(19, y = h.cookieConfig), "choices" in h && n(20, w = h.choices), "acceptLabel" in h && n(4, C = h.acceptLabel), "rejectLabel" in h && n(5, v = h.rejectLabel), "settingsLabel" in h && n(6, O = h.settingsLabel), "closeLabel" in h && n(7, ge = h.closeLabel), "editLabel" in h && n(8, be = h.editLabel);
  }, t.$$.update = () => {
    t.$$.dirty[0] & /*choices*/
    1048576 && n(10, s = Object.assign({}, M, w)), t.$$.dirty[0] & /*choicesMerged*/
    1024 && n(11, i = Object.values(s).map((h, j) => Object.assign({}, h, { id: Object.keys(s)[j] }))), t.$$.dirty[0] & /*choicesArr*/
    2048 && (o = i.reduce(
      (h, j) => (h[j.id] = j.value ? j.value : !1, h),
      {}
    )), t.$$.dirty[0] & /*choicesArr*/
    2048 && (c = i.reduce(
      (h, j) => (h[j.id] = j.id === "necessary", h),
      {}
    ));
  }, [
    f,
    g,
    d,
    b,
    C,
    v,
    O,
    ge,
    be,
    se,
    s,
    i,
    _,
    m,
    Je,
    Ge,
    l,
    u,
    $,
    y,
    w,
    Ve,
    We,
    qe
  ];
}
class Ot extends vt {
  constructor(e) {
    super(), kt(
      this,
      e,
      Et,
      jt,
      Xe,
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
    this.$$set({ cookieName: e }), E();
  }
  get canRejectCookies() {
    return this.$$.ctx[0];
  }
  set canRejectCookies(e) {
    this.$$set({ canRejectCookies: e }), E();
  }
  get showEditIcon() {
    return this.$$.ctx[1];
  }
  set showEditIcon(e) {
    this.$$set({ showEditIcon: e }), E();
  }
  get visible() {
    return this.$$.ctx[17];
  }
  set visible(e) {
    this.$$set({ visible: e }), E();
  }
  get heading() {
    return this.$$.ctx[2];
  }
  set heading(e) {
    this.$$set({ heading: e }), E();
  }
  get description() {
    return this.$$.ctx[3];
  }
  set description(e) {
    this.$$set({ description: e }), E();
  }
  get categories() {
    return this.$$.ctx[18];
  }
  set categories(e) {
    this.$$set({ categories: e }), E();
  }
  get cookieConfig() {
    return this.$$.ctx[19];
  }
  set cookieConfig(e) {
    this.$$set({ cookieConfig: e }), E();
  }
  get choices() {
    return this.$$.ctx[20];
  }
  set choices(e) {
    this.$$set({ choices: e }), E();
  }
  get acceptLabel() {
    return this.$$.ctx[4];
  }
  set acceptLabel(e) {
    this.$$set({ acceptLabel: e }), E();
  }
  get rejectLabel() {
    return this.$$.ctx[5];
  }
  set rejectLabel(e) {
    this.$$set({ rejectLabel: e }), E();
  }
  get settingsLabel() {
    return this.$$.ctx[6];
  }
  set settingsLabel(e) {
    this.$$set({ settingsLabel: e }), E();
  }
  get closeLabel() {
    return this.$$.ctx[7];
  }
  set closeLabel(e) {
    this.$$set({ closeLabel: e }), E();
  }
  get editLabel() {
    return this.$$.ctx[8];
  }
  set editLabel(e) {
    this.$$set({ editLabel: e }), E();
  }
  get show() {
    return this.$$.ctx[9];
  }
}
customElements.define("cookie-consent-banner", wt(Ot, { cookieName: {}, canRejectCookies: { type: "Boolean" }, showEditIcon: { type: "Boolean" }, visible: { type: "Boolean" }, heading: {}, description: {}, categories: {}, cookieConfig: {}, choices: {}, acceptLabel: {}, rejectLabel: {}, settingsLabel: {}, closeLabel: {}, editLabel: {} }, [], ["show"], !0));
export {
  Ot as Banner
};
