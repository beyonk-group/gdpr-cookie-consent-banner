function noop() { }
const identity = x => x;
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}

const is_client = typeof window !== 'undefined';
let now = is_client
    ? () => window.performance.now()
    : () => Date.now();
let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

const tasks = new Set();
function run_tasks(now) {
    tasks.forEach(task => {
        if (!task.c(now)) {
            tasks.delete(task);
            task.f();
        }
    });
    if (tasks.size !== 0)
        raf(run_tasks);
}
/**
 * Creates a new task that runs on each raf frame
 * until it returns a falsy value or is aborted
 */
function loop(callback) {
    let task;
    if (tasks.size === 0)
        raf(run_tasks);
    return {
        promise: new Promise(fulfill => {
            tasks.add(task = { c: callback, f: fulfill });
        }),
        abort() {
            tasks.delete(task);
        }
    };
}

function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function destroy_each(iterations, detaching) {
    for (let i = 0; i < iterations.length; i += 1) {
        if (iterations[i])
            iterations[i].d(detaching);
    }
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function empty() {
    return text('');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function toggle_class(element, name, toggle) {
    element.classList[toggle ? 'add' : 'remove'](name);
}
function custom_event(type, detail) {
    const e = document.createEvent('CustomEvent');
    e.initCustomEvent(type, false, false, detail);
    return e;
}

const active_docs = new Set();
let active = 0;
// https://github.com/darkskyapp/string-hash/blob/master/index.js
function hash(str) {
    let hash = 5381;
    let i = str.length;
    while (i--)
        hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
    return hash >>> 0;
}
function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
    const step = 16.666 / duration;
    let keyframes = '{\n';
    for (let p = 0; p <= 1; p += step) {
        const t = a + (b - a) * ease(p);
        keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
    }
    const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
    const name = `__svelte_${hash(rule)}_${uid}`;
    const doc = node.ownerDocument;
    active_docs.add(doc);
    const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
    const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
    if (!current_rules[name]) {
        current_rules[name] = true;
        stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
    }
    const animation = node.style.animation || '';
    node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
    active += 1;
    return name;
}
function delete_rule(node, name) {
    const previous = (node.style.animation || '').split(', ');
    const next = previous.filter(name
        ? anim => anim.indexOf(name) < 0 // remove specific animation
        : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
    );
    const deleted = previous.length - next.length;
    if (deleted) {
        node.style.animation = next.join(', ');
        active -= deleted;
        if (!active)
            clear_rules();
    }
}
function clear_rules() {
    raf(() => {
        if (active)
            return;
        active_docs.forEach(doc => {
            const stylesheet = doc.__svelte_stylesheet;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            doc.__svelte_rules = {};
        });
        active_docs.clear();
    });
}

let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error(`Function called outside component initialization`);
    return current_component;
}
function onMount(fn) {
    get_current_component().$$.on_mount.push(fn);
}
function createEventDispatcher() {
    const component = get_current_component();
    return (type, detail) => {
        const callbacks = component.$$.callbacks[type];
        if (callbacks) {
            // TODO are there situations where events could be dispatched
            // in a server (non-DOM) environment?
            const event = custom_event(type, detail);
            callbacks.slice().forEach(fn => {
                fn.call(component, event);
            });
        }
    };
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        // first, call beforeUpdate functions
        // and update components
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}

let promise;
function wait() {
    if (!promise) {
        promise = Promise.resolve();
        promise.then(() => {
            promise = null;
        });
    }
    return promise;
}
function dispatch(node, direction, kind) {
    node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
}
const outroing = new Set();
let outros;
function group_outros() {
    outros = {
        r: 0,
        c: [],
        p: outros // parent group
    };
}
function check_outros() {
    if (!outros.r) {
        run_all(outros.c);
    }
    outros = outros.p;
}
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
const null_transition = { duration: 0 };
function create_bidirectional_transition(node, fn, params, intro) {
    let config = fn(node, params);
    let t = intro ? 0 : 1;
    let running_program = null;
    let pending_program = null;
    let animation_name = null;
    function clear_animation() {
        if (animation_name)
            delete_rule(node, animation_name);
    }
    function init(program, duration) {
        const d = program.b - t;
        duration *= Math.abs(d);
        return {
            a: t,
            b: program.b,
            d,
            duration,
            start: program.start,
            end: program.start + duration,
            group: program.group
        };
    }
    function go(b) {
        const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
        const program = {
            start: now() + delay,
            b
        };
        if (!b) {
            // @ts-ignore todo: improve typings
            program.group = outros;
            outros.r += 1;
        }
        if (running_program) {
            pending_program = program;
        }
        else {
            // if this is an intro, and there's a delay, we need to do
            // an initial tick and/or apply CSS animation immediately
            if (css) {
                clear_animation();
                animation_name = create_rule(node, t, b, duration, delay, easing, css);
            }
            if (b)
                tick(0, 1);
            running_program = init(program, duration);
            add_render_callback(() => dispatch(node, b, 'start'));
            loop(now => {
                if (pending_program && now > pending_program.start) {
                    running_program = init(pending_program, duration);
                    pending_program = null;
                    dispatch(node, running_program.b, 'start');
                    if (css) {
                        clear_animation();
                        animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                    }
                }
                if (running_program) {
                    if (now >= running_program.end) {
                        tick(t = running_program.b, 1 - t);
                        dispatch(node, running_program.b, 'end');
                        if (!pending_program) {
                            // we're done
                            if (running_program.b) {
                                // intro — we can tidy up immediately
                                clear_animation();
                            }
                            else {
                                // outro — needs to be coordinated
                                if (!--running_program.group.r)
                                    run_all(running_program.group.c);
                            }
                        }
                        running_program = null;
                    }
                    else if (now >= running_program.start) {
                        const p = now - running_program.start;
                        t = running_program.a + running_program.d * easing(p / running_program.duration);
                        tick(t, 1 - t);
                    }
                }
                return !!(running_program || pending_program);
            });
        }
    }
    return {
        run(b) {
            if (is_function(config)) {
                wait().then(() => {
                    // @ts-ignore
                    config = config();
                    go(b);
                });
            }
            else {
                go(b);
            }
        },
        end() {
            clear_animation();
            running_program = pending_program = null;
        }
    };
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    // onMount happens before the initial afterUpdate
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            // Edge case - component was destroyed immediately,
            // most likely as a result of a binding initialising
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
}

var cookieUniversalCommon = createCommonjsModule(function (module) {
module.exports=function(e){function t(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:o});},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,r){var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=r(1);e.exports=function(t,r){var i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],a="object"===("undefined"==typeof document?"undefined":o(document))&&"string"==typeof document.cookie,s="object"===(void 0===t?"undefined":o(t))&&"object"===(void 0===r?"undefined":o(r))&&void 0!==e,u=!a&&!s||a&&s,f=function(e){if(s){var o=t.headers.cookie||"";return e&&(o=r.getHeaders(),o=o["set-cookie"]?o["set-cookie"].map(function(e){return e.split(";")[0]}).join(";"):""),o}if(a)return document.cookie||""},c=function(){var e=r.getHeader("Set-Cookie");return (e="string"==typeof e?[e]:e)||[]},p=function(e){return r.setHeader("Set-Cookie",e)},d=function(e,t){if(!t)return e;try{return JSON.parse(e)}catch(t){return e}},l={parseJSON:i,set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{path:"/"};if(!u)if(t="object"===(void 0===t?"undefined":o(t))?JSON.stringify(t):t,s){var i=c();i.push(n.serialize(e,t,r)),p(i);}else document.cookie=n.serialize(e,t,r);},setAll:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];u||Array.isArray(e)&&e.forEach(function(e){var t=e.name,r=void 0===t?"":t,o=e.value,n=void 0===o?"":o,i=e.opts,a=void 0===i?{path:"/"}:i;l.set(r,n,a);});},get:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{fromRes:!1,parseJSON:l.parseJSON};if(u)return "";var r=n.parse(f(t.fromRes)),o=r[e];return d(o,t.parseJSON)},getAll:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{fromRes:!1,parseJSON:l.parseJSON};if(u)return {};var t=n.parse(f(e.fromRes));for(var r in t)t[r]=d(t[r],e.parseJSON);return t},remove:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{path:"/"};if(!u){var r=l.get(e);t.expires=new Date(0),void 0!==r&&l.set(e,"",t);}},removeAll:function(){if(!u){var e=n.parse(f());for(var t in e)l.remove(t);}},nodeCookie:n};return l};},function(e,t,r){function o(e,t){if("string"!=typeof e)throw new TypeError("argument str must be a string");for(var r={},o=t||{},n=e.split(u),s=o.decode||a,f=0;f<n.length;f++){var c=n[f],p=c.indexOf("=");if(!(p<0)){var d=c.substr(0,p).trim(),l=c.substr(++p,c.length).trim();'"'==l[0]&&(l=l.slice(1,-1)),void 0==r[d]&&(r[d]=i(l,s));}}return r}function n(e,t,r){var o=r||{},n=o.encode||s;if("function"!=typeof n)throw new TypeError("option encode is invalid");if(!f.test(e))throw new TypeError("argument name is invalid");var i=n(t);if(i&&!f.test(i))throw new TypeError("argument val is invalid");var a=e+"="+i;if(null!=o.maxAge){var u=o.maxAge-0;if(isNaN(u))throw new Error("maxAge should be a Number");a+="; Max-Age="+Math.floor(u);}if(o.domain){if(!f.test(o.domain))throw new TypeError("option domain is invalid");a+="; Domain="+o.domain;}if(o.path){if(!f.test(o.path))throw new TypeError("option path is invalid");a+="; Path="+o.path;}if(o.expires){if("function"!=typeof o.expires.toUTCString)throw new TypeError("option expires is invalid");a+="; Expires="+o.expires.toUTCString();}if(o.httpOnly&&(a+="; HttpOnly"),o.secure&&(a+="; Secure"),o.sameSite){switch("string"==typeof o.sameSite?o.sameSite.toLowerCase():o.sameSite){case!0:a+="; SameSite=Strict";break;case"lax":a+="; SameSite=Lax";break;case"strict":a+="; SameSite=Strict";break;case"none":a+="; SameSite=None";break;default:throw new TypeError("option sameSite is invalid")}}return a}function i(e,t){try{return t(e)}catch(t){return e}}/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */
t.parse=o,t.serialize=n;var a=decodeURIComponent,s=encodeURIComponent,u=/; */,f=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;}]);
});

var Cookie = /*@__PURE__*/getDefaultExportFromCjs(cookieUniversalCommon);

var validate = function (choice, cookie) {
  const choices = Object.keys(choice);
  const chosen = Object.keys(cookie.choices);

  if (chosen.length !== choices.length) {
    return false
  }

  return chosen.every(c => choices.includes(c))
};

function fade(node, { delay = 0, duration = 400, easing = identity }) {
    const o = +getComputedStyle(node).opacity;
    return {
        delay,
        duration,
        easing,
        css: t => `opacity: ${t * o}`
    };
}

/* src/components/Banner.svelte generated by Svelte v3.24.1 */

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[27] = list[i];
	child_ctx[28] = list;
	child_ctx[29] = i;
	return child_ctx;
}

// (124:0) {#if showEditIcon}
function create_if_block_3(ctx) {
	let button;
	let button_transition;
	let current;
	let mounted;
	let dispose;

	return {
		c() {
			button = element("button");

			button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17
        0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13
        35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0
        0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77
        54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11
        80.53-12.76l69.13-35.21a132.273 132.273 0 0 0
        57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176
        368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32
        32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33
        32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32
        32-14.33 32-32 32z"></path></svg>`;

			attr(button, "class", "cookieConsentToggle");
		},
		m(target, anchor) {
			insert(target, button, anchor);
			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler*/ ctx[15]);
				mounted = true;
			}
		},
		p: noop,
		i(local) {
			if (current) return;

			add_render_callback(() => {
				if (!button_transition) button_transition = create_bidirectional_transition(button, fade, {}, true);
				button_transition.run(1);
			});

			current = true;
		},
		o(local) {
			if (!button_transition) button_transition = create_bidirectional_transition(button, fade, {}, false);
			button_transition.run(0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(button);
			if (detaching && button_transition) button_transition.end();
			mounted = false;
			dispose();
		}
	};
}

// (146:0) {#if shown}
function create_if_block_2(ctx) {
	let div4;
	let div3;
	let div1;
	let div0;
	let p0;
	let t0;
	let t1;
	let p1;
	let t2;
	let div2;
	let button0;
	let t3;
	let t4;
	let button1;
	let t5;
	let div4_transition;
	let current;
	let mounted;
	let dispose;

	return {
		c() {
			div4 = element("div");
			div3 = element("div");
			div1 = element("div");
			div0 = element("div");
			p0 = element("p");
			t0 = text(/*heading*/ ctx[1]);
			t1 = space();
			p1 = element("p");
			t2 = space();
			div2 = element("div");
			button0 = element("button");
			t3 = text(/*settingsLabel*/ ctx[4]);
			t4 = space();
			button1 = element("button");
			t5 = text(/*acceptLabel*/ ctx[3]);
			attr(p0, "class", "cookieConsent__Title");
			attr(p1, "class", "cookieConsent__Description");
			attr(div0, "class", "cookieConsent__Content");
			attr(div1, "class", "cookieConsent__Left");
			attr(button0, "type", "button");
			attr(button0, "class", "cookieConsent__Button");
			attr(button1, "type", "submit");
			attr(button1, "class", "cookieConsent__Button");
			attr(div2, "class", "cookieConsent__Right");
			attr(div3, "class", "cookieConsent");
			attr(div4, "class", "cookieConsentWrapper");
		},
		m(target, anchor) {
			insert(target, div4, anchor);
			append(div4, div3);
			append(div3, div1);
			append(div1, div0);
			append(div0, p0);
			append(p0, t0);
			append(div0, t1);
			append(div0, p1);
			p1.innerHTML = /*description*/ ctx[2];
			append(div3, t2);
			append(div3, div2);
			append(div2, button0);
			append(button0, t3);
			append(div2, t4);
			append(div2, button1);
			append(button1, t5);
			current = true;

			if (!mounted) {
				dispose = [
					listen(button0, "click", /*click_handler_1*/ ctx[16]),
					listen(button1, "click", /*choose*/ ctx[10])
				];

				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (!current || dirty & /*heading*/ 2) set_data(t0, /*heading*/ ctx[1]);
			if (!current || dirty & /*description*/ 4) p1.innerHTML = /*description*/ ctx[2];			if (!current || dirty & /*settingsLabel*/ 16) set_data(t3, /*settingsLabel*/ ctx[4]);
			if (!current || dirty & /*acceptLabel*/ 8) set_data(t5, /*acceptLabel*/ ctx[3]);
		},
		i(local) {
			if (current) return;

			add_render_callback(() => {
				if (!div4_transition) div4_transition = create_bidirectional_transition(div4, fade, {}, true);
				div4_transition.run(1);
			});

			current = true;
		},
		o(local) {
			if (!div4_transition) div4_transition = create_bidirectional_transition(div4, fade, {}, false);
			div4_transition.run(0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div4);
			if (detaching && div4_transition) div4_transition.end();
			mounted = false;
			run_all(dispose);
		}
	};
}

// (172:0) {#if settingsShown}
function create_if_block(ctx) {
	let div1;
	let div0;
	let t0;
	let button;
	let t1;
	let div1_transition;
	let current;
	let mounted;
	let dispose;
	let each_value = /*choicesArr*/ ctx[9];
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	return {
		c() {
			div1 = element("div");
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t0 = space();
			button = element("button");
			t1 = text(/*closeLabel*/ ctx[5]);
			attr(button, "type", "submit");
			attr(button, "class", "cookieConsent__Button cookieConsent__Button--Close");
			attr(div0, "class", "cookieConsentOperations__List");
			attr(div1, "class", "cookieConsentOperations");
		},
		m(target, anchor) {
			insert(target, div1, anchor);
			append(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			append(div0, t0);
			append(div0, button);
			append(button, t1);
			current = true;

			if (!mounted) {
				dispose = listen(button, "click", /*click_handler_2*/ ctx[18]);
				mounted = true;
			}
		},
		p(ctx, dirty) {
			if (dirty & /*choicesArr, choicesMerged*/ 768) {
				each_value = /*choicesArr*/ ctx[9];
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
						each_blocks[i].c();
						each_blocks[i].m(div0, t0);
					}
				}

				for (; i < each_blocks.length; i += 1) {
					each_blocks[i].d(1);
				}

				each_blocks.length = each_value.length;
			}

			if (!current || dirty & /*closeLabel*/ 32) set_data(t1, /*closeLabel*/ ctx[5]);
		},
		i(local) {
			if (current) return;

			add_render_callback(() => {
				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, true);
				div1_transition.run(1);
			});

			current = true;
		},
		o(local) {
			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fade, {}, false);
			div1_transition.run(0);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div1);
			destroy_each(each_blocks, detaching);
			if (detaching && div1_transition) div1_transition.end();
			mounted = false;
			dispose();
		}
	};
}

// (176:6) {#if choicesMerged.hasOwnProperty(choice.id) && choicesMerged[choice.id]}
function create_if_block_1(ctx) {
	let div;
	let input;
	let input_id_value;
	let input_disabled_value;
	let t0;
	let label;
	let t1_value = /*choice*/ ctx[27].label + "";
	let t1;
	let label_for_value;
	let t2;
	let span;
	let t3_value = /*choice*/ ctx[27].description + "";
	let t3;
	let mounted;
	let dispose;

	function input_change_handler() {
		/*input_change_handler*/ ctx[17].call(input, /*choice*/ ctx[27]);
	}

	return {
		c() {
			div = element("div");
			input = element("input");
			t0 = space();
			label = element("label");
			t1 = text(t1_value);
			t2 = space();
			span = element("span");
			t3 = text(t3_value);
			attr(input, "type", "checkbox");
			attr(input, "id", input_id_value = `gdpr-check-${/*choice*/ ctx[27].id}`);
			input.disabled = input_disabled_value = /*choice*/ ctx[27].id === "necessary";
			attr(label, "for", label_for_value = `gdpr-check-${/*choice*/ ctx[27].id}`);
			attr(span, "class", "cookieConsentOperations__ItemLabel");
			attr(div, "class", "cookieConsentOperations__Item");
			toggle_class(div, "disabled", /*choice*/ ctx[27].id === "necessary");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, input);
			input.checked = /*choicesMerged*/ ctx[8][/*choice*/ ctx[27].id].value;
			append(div, t0);
			append(div, label);
			append(label, t1);
			append(div, t2);
			append(div, span);
			append(span, t3);

			if (!mounted) {
				dispose = listen(input, "change", input_change_handler);
				mounted = true;
			}
		},
		p(new_ctx, dirty) {
			ctx = new_ctx;

			if (dirty & /*choicesArr*/ 512 && input_id_value !== (input_id_value = `gdpr-check-${/*choice*/ ctx[27].id}`)) {
				attr(input, "id", input_id_value);
			}

			if (dirty & /*choicesArr*/ 512 && input_disabled_value !== (input_disabled_value = /*choice*/ ctx[27].id === "necessary")) {
				input.disabled = input_disabled_value;
			}

			if (dirty & /*choicesMerged, choicesArr*/ 768) {
				input.checked = /*choicesMerged*/ ctx[8][/*choice*/ ctx[27].id].value;
			}

			if (dirty & /*choicesArr*/ 512 && t1_value !== (t1_value = /*choice*/ ctx[27].label + "")) set_data(t1, t1_value);

			if (dirty & /*choicesArr*/ 512 && label_for_value !== (label_for_value = `gdpr-check-${/*choice*/ ctx[27].id}`)) {
				attr(label, "for", label_for_value);
			}

			if (dirty & /*choicesArr*/ 512 && t3_value !== (t3_value = /*choice*/ ctx[27].description + "")) set_data(t3, t3_value);

			if (dirty & /*choicesArr*/ 512) {
				toggle_class(div, "disabled", /*choice*/ ctx[27].id === "necessary");
			}
		},
		d(detaching) {
			if (detaching) detach(div);
			mounted = false;
			dispose();
		}
	};
}

// (175:4) {#each choicesArr as choice}
function create_each_block(ctx) {
	let show_if = /*choicesMerged*/ ctx[8].hasOwnProperty(/*choice*/ ctx[27].id) && /*choicesMerged*/ ctx[8][/*choice*/ ctx[27].id];
	let if_block_anchor;
	let if_block = show_if && create_if_block_1(ctx);

	return {
		c() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		m(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert(target, if_block_anchor, anchor);
		},
		p(ctx, dirty) {
			if (dirty & /*choicesMerged, choicesArr*/ 768) show_if = /*choicesMerged*/ ctx[8].hasOwnProperty(/*choice*/ ctx[27].id) && /*choicesMerged*/ ctx[8][/*choice*/ ctx[27].id];

			if (show_if) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block_1(ctx);
					if_block.c();
					if_block.m(if_block_anchor.parentNode, if_block_anchor);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}
		},
		d(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach(if_block_anchor);
		}
	};
}

function create_fragment(ctx) {
	let t0;
	let t1;
	let if_block2_anchor;
	let current;
	let if_block0 = /*showEditIcon*/ ctx[0] && create_if_block_3(ctx);
	let if_block1 = /*shown*/ ctx[6] && create_if_block_2(ctx);
	let if_block2 = /*settingsShown*/ ctx[7] && create_if_block(ctx);

	return {
		c() {
			if (if_block0) if_block0.c();
			t0 = space();
			if (if_block1) if_block1.c();
			t1 = space();
			if (if_block2) if_block2.c();
			if_block2_anchor = empty();
		},
		m(target, anchor) {
			if (if_block0) if_block0.m(target, anchor);
			insert(target, t0, anchor);
			if (if_block1) if_block1.m(target, anchor);
			insert(target, t1, anchor);
			if (if_block2) if_block2.m(target, anchor);
			insert(target, if_block2_anchor, anchor);
			current = true;
		},
		p(ctx, [dirty]) {
			if (/*showEditIcon*/ ctx[0]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*showEditIcon*/ 1) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_3(ctx);
					if_block0.c();
					transition_in(if_block0, 1);
					if_block0.m(t0.parentNode, t0);
				}
			} else if (if_block0) {
				group_outros();

				transition_out(if_block0, 1, 1, () => {
					if_block0 = null;
				});

				check_outros();
			}

			if (/*shown*/ ctx[6]) {
				if (if_block1) {
					if_block1.p(ctx, dirty);

					if (dirty & /*shown*/ 64) {
						transition_in(if_block1, 1);
					}
				} else {
					if_block1 = create_if_block_2(ctx);
					if_block1.c();
					transition_in(if_block1, 1);
					if_block1.m(t1.parentNode, t1);
				}
			} else if (if_block1) {
				group_outros();

				transition_out(if_block1, 1, 1, () => {
					if_block1 = null;
				});

				check_outros();
			}

			if (/*settingsShown*/ ctx[7]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*settingsShown*/ 128) {
						transition_in(if_block2, 1);
					}
				} else {
					if_block2 = create_if_block(ctx);
					if_block2.c();
					transition_in(if_block2, 1);
					if_block2.m(if_block2_anchor.parentNode, if_block2_anchor);
				}
			} else if (if_block2) {
				group_outros();

				transition_out(if_block2, 1, 1, () => {
					if_block2 = null;
				});

				check_outros();
			}
		},
		i(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block1);
			transition_in(if_block2);
			current = true;
		},
		o(local) {
			transition_out(if_block0);
			transition_out(if_block1);
			transition_out(if_block2);
			current = false;
		},
		d(detaching) {
			if (if_block0) if_block0.d(detaching);
			if (detaching) detach(t0);
			if (if_block1) if_block1.d(detaching);
			if (detaching) detach(t1);
			if (if_block2) if_block2.d(detaching);
			if (detaching) detach(if_block2_anchor);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	const dispatch = createEventDispatcher();
	const cookies = Cookie();
	let { cookieName = null } = $$props;
	let { showEditIcon = true } = $$props;
	let shown = false;
	let settingsShown = false;
	let { heading = "GDPR Notice" } = $$props;
	let { description = "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies." } = $$props;

	let { categories = {
		analytics() {
			
		},
		tracking() {
			
		},
		marketing() {
			
		},
		necessary() {
			
		}
	} } = $$props;

	let { cookieConfig = {} } = $$props;
	let { choices = {} } = $$props;

	const choicesDefaults = {
		necessary: {
			label: "Necessary cookies",
			description: "Used for cookie control. Can't be turned off.",
			value: true
		},
		tracking: {
			label: "Tracking cookies",
			description: "Used for advertising purposes.",
			value: true
		},
		analytics: {
			label: "Analytics cookies",
			description: "Used to control Google Analytics, a 3rd party tool offered by Google to track user behavior.",
			value: true
		},
		marketing: {
			label: "Marketing cookies",
			description: "Used for marketing data.",
			value: true
		}
	};

	let { acceptLabel = "Accept cookies" } = $$props;
	let { settingsLabel = "Cookie settings" } = $$props;
	let { closeLabel = "Close settings" } = $$props;

	onMount(() => {
		if (!cookieName) {
			throw "You must set gdpr cookie name";
		}

		const cookie = cookies.get(cookieName);

		if (cookie && chosenMatchesChoice(cookie)) {
			execute(cookie.choices);
		} else {
			removeCookie();
			$$invalidate(6, shown = true);
		}
	});

	function setCookie(choices) {
		const expires = new Date();
		expires.setDate(expires.getDate() + 365);
		const options = Object.assign({}, cookieConfig, { expires });
		cookies.set(cookieName, { choices }, options);
	}

	function removeCookie() {
		const { path } = cookieConfig;
		cookies.remove(cookieName, Object.assign({}, path ? { path } : {}));
	}

	function chosenMatchesChoice(cookie) {
		return validate(cookieChoices, cookie);
	}

	function execute(chosen) {
		const types = Object.keys(cookieChoices);

		types.forEach(t => {
			const agreed = chosen[t];

			choicesMerged[t]
			? $$invalidate(8, choicesMerged[t].value = agreed, choicesMerged)
			: false;

			if (agreed) {
				categories[t] && categories[t]();
				dispatch(`${t}`);
			}
		});

		$$invalidate(6, shown = false);
	}

	function choose() {
		setCookie(cookieChoices);
		execute(cookieChoices);
	}

	const click_handler = () => $$invalidate(6, shown = true);
	const click_handler_1 = () => $$invalidate(7, settingsShown = true);

	function input_change_handler(choice) {
		choicesMerged[choice.id].value = this.checked;
		($$invalidate(8, choicesMerged), $$invalidate(14, choices));
		(($$invalidate(9, choicesArr), $$invalidate(8, choicesMerged)), $$invalidate(14, choices));
	}

	const click_handler_2 = () => $$invalidate(7, settingsShown = false);

	$$self.$$set = $$props => {
		if ("cookieName" in $$props) $$invalidate(11, cookieName = $$props.cookieName);
		if ("showEditIcon" in $$props) $$invalidate(0, showEditIcon = $$props.showEditIcon);
		if ("heading" in $$props) $$invalidate(1, heading = $$props.heading);
		if ("description" in $$props) $$invalidate(2, description = $$props.description);
		if ("categories" in $$props) $$invalidate(12, categories = $$props.categories);
		if ("cookieConfig" in $$props) $$invalidate(13, cookieConfig = $$props.cookieConfig);
		if ("choices" in $$props) $$invalidate(14, choices = $$props.choices);
		if ("acceptLabel" in $$props) $$invalidate(3, acceptLabel = $$props.acceptLabel);
		if ("settingsLabel" in $$props) $$invalidate(4, settingsLabel = $$props.settingsLabel);
		if ("closeLabel" in $$props) $$invalidate(5, closeLabel = $$props.closeLabel);
	};

	let choicesMerged;
	let choicesArr;
	let cookieChoices;

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*choices*/ 16384) {
			 $$invalidate(8, choicesMerged = Object.assign({}, choicesDefaults, choices));
		}

		if ($$self.$$.dirty & /*choicesMerged*/ 256) {
			 $$invalidate(9, choicesArr = Object.values(choicesMerged).map((item, index) => {
				return Object.assign({}, item, { id: Object.keys(choicesMerged)[index] });
			}));
		}

		if ($$self.$$.dirty & /*choicesArr*/ 512) {
			 cookieChoices = choicesArr.reduce(
				(result, item, index, array) => {
					result[item.id] = item.value ? item.value : false;
					return result;
				},
				{}
			);
		}
	};

	return [
		showEditIcon,
		heading,
		description,
		acceptLabel,
		settingsLabel,
		closeLabel,
		shown,
		settingsShown,
		choicesMerged,
		choicesArr,
		choose,
		cookieName,
		categories,
		cookieConfig,
		choices,
		click_handler,
		click_handler_1,
		input_change_handler,
		click_handler_2
	];
}

class Banner extends SvelteComponent {
	constructor(options) {
		super();

		init(this, options, instance, create_fragment, safe_not_equal, {
			cookieName: 11,
			showEditIcon: 0,
			heading: 1,
			description: 2,
			categories: 12,
			cookieConfig: 13,
			choices: 14,
			acceptLabel: 3,
			settingsLabel: 4,
			closeLabel: 5
		});
	}
}

function attachBanner(target, props = {}) {
  new Banner({
    target,
    props
  });
}

export default attachBanner;
