(function () {
    'use strict';

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
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node);
        }
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
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
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
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
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
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
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
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    /**
     * The `onMount` function schedules a callback to run as soon as the component has been mounted to the DOM.
     * It must be called during the component's initialisation (but doesn't need to live *inside* the component;
     * it can be called from an external module).
     *
     * `onMount` does not run inside a [server-side component](/docs#run-time-server-side-component-api).
     *
     * https://svelte.dev/docs#run-time-svelte-onmount
     */
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    /**
     * Creates an event dispatcher that can be used to dispatch [component events](/docs#template-syntax-component-directives-on-eventname).
     * Event dispatchers are functions that can take two arguments: `name` and `detail`.
     *
     * Component events created with `createEventDispatcher` create a
     * [CustomEvent](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent).
     * These events do not [bubble](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events#Event_bubbling_and_capture).
     * The `detail` argument corresponds to the [CustomEvent.detail](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/detail)
     * property and can contain any type of data.
     *
     * https://svelte.dev/docs#run-time-svelte-createeventdispatcher
     */
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail, { cancelable = false } = {}) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail, { cancelable });
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
                return !event.defaultPrevented;
            }
            return true;
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
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
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
        seen_callbacks.clear();
        set_current_component(saved_component);
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
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        const options = { direction: 'both' };
        let config = fn(node, params, options);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
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
            if (running_program || pending_program) {
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
                        config = config(options);
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
    function mount_component(component, target, anchor, customElement) {
        const { fragment, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = component.$$.on_mount.map(run).filter(is_function);
                // if the component was destroyed immediately
                // it will update the `$$.on_destroy` reference to `null`.
                // the destructured on_destroy may still reference to the old array
                if (component.$$.on_destroy) {
                    component.$$.on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
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
    function init$1(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: [],
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
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
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            if (!is_function(callback)) {
                return noop;
            }
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

    /*! js-cookie v3.0.1 | MIT */
    /* eslint-disable no-var */
    function assign (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          target[key] = source[key];
        }
      }
      return target
    }
    /* eslint-enable no-var */

    /* eslint-disable no-var */
    var defaultConverter = {
      read: function (value) {
        if (value[0] === '"') {
          value = value.slice(1, -1);
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
      },
      write: function (value) {
        return encodeURIComponent(value).replace(
          /%(2[346BF]|3[AC-F]|40|5[BDE]|60|7[BCD])/g,
          decodeURIComponent
        )
      }
    };
    /* eslint-enable no-var */

    /* eslint-disable no-var */

    function init (converter, defaultAttributes) {
      function set (key, value, attributes) {
        if (typeof document === 'undefined') {
          return
        }

        attributes = assign({}, defaultAttributes, attributes);

        if (typeof attributes.expires === 'number') {
          attributes.expires = new Date(Date.now() + attributes.expires * 864e5);
        }
        if (attributes.expires) {
          attributes.expires = attributes.expires.toUTCString();
        }

        key = encodeURIComponent(key)
          .replace(/%(2[346B]|5E|60|7C)/g, decodeURIComponent)
          .replace(/[()]/g, escape);

        var stringifiedAttributes = '';
        for (var attributeName in attributes) {
          if (!attributes[attributeName]) {
            continue
          }

          stringifiedAttributes += '; ' + attributeName;

          if (attributes[attributeName] === true) {
            continue
          }

          // Considers RFC 6265 section 5.2:
          // ...
          // 3.  If the remaining unparsed-attributes contains a %x3B (";")
          //     character:
          // Consume the characters of the unparsed-attributes up to,
          // not including, the first %x3B (";") character.
          // ...
          stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
        }

        return (document.cookie =
          key + '=' + converter.write(value, key) + stringifiedAttributes)
      }

      function get (key) {
        if (typeof document === 'undefined' || (arguments.length && !key)) {
          return
        }

        // To prevent the for loop in the first place assign an empty array
        // in case there are no cookies at all.
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var jar = {};
        for (var i = 0; i < cookies.length; i++) {
          var parts = cookies[i].split('=');
          var value = parts.slice(1).join('=');

          try {
            var foundKey = decodeURIComponent(parts[0]);
            jar[foundKey] = converter.read(value, foundKey);

            if (key === foundKey) {
              break
            }
          } catch (e) {}
        }

        return key ? jar[key] : jar
      }

      return Object.create(
        {
          set: set,
          get: get,
          remove: function (key, attributes) {
            set(
              key,
              '',
              assign({}, attributes, {
                expires: -1
              })
            );
          },
          withAttributes: function (attributes) {
            return init(this.converter, assign({}, this.attributes, attributes))
          },
          withConverter: function (converter) {
            return init(assign({}, this.converter, converter), this.attributes)
          }
        },
        {
          attributes: { value: Object.freeze(defaultAttributes) },
          converter: { value: Object.freeze(converter) }
        }
      )
    }

    var api = init(defaultConverter, { path: '/' });

    function validate (choice, cookieChoices) {
      const choices = Object.keys(choice);
      const chosen = Object.keys(cookieChoices);

      if (chosen.length !== choices.length) {
        return false
      }

      return chosen.every(c => choices.includes(c))
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/components/Banner.svelte generated by Svelte v3.55.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[31] = list;
    	child_ctx[32] = i;
    	return child_ctx;
    }

    // (152:0) {#if showEditIcon}
    function create_if_block_3(ctx) {
    	let button;
    	let svg;
    	let path;
    	let button_transition;
    	let current;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "d", "M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17\n        0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72 12.82l-69.13\n        35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0\n        0-12.82 80.95l12.08 76.27a132.521 132.521 0 0 0 37.16 72.96l54.77\n        54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36 55.7-.11\n        80.53-12.76l69.13-35.21a132.273 132.273 0 0 0\n        57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58 12.91-79.91zM176\n        368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32\n        32zm32-160c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33\n        32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32\n        32-14.33 32-32 32z");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "viewBox", "0 0 512 512");
    			attr(button, "class", "cookieConsentToggle");
    			attr(button, "aria-label", /*editLabel*/ ctx[7]);
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    			append(button, svg);
    			append(svg, path);
    			current = true;

    			if (!mounted) {
    				dispose = listen(button, "click", /*show*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (!current || dirty[0] & /*editLabel*/ 128) {
    				attr(button, "aria-label", /*editLabel*/ ctx[7]);
    			}
    		},
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

    // (175:0) {#if shown}
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
    	let t6;
    	let button2;
    	let t7;
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
    			t3 = text(/*settingsLabel*/ ctx[5]);
    			t4 = space();
    			button1 = element("button");
    			t5 = text(/*rejectLabel*/ ctx[4]);
    			t6 = space();
    			button2 = element("button");
    			t7 = text(/*acceptLabel*/ ctx[3]);
    			attr(p0, "class", "cookieConsent__Title");
    			attr(p1, "class", "cookieConsent__Description");
    			attr(div0, "class", "cookieConsent__Content");
    			attr(div1, "class", "cookieConsent__Left");
    			attr(button0, "type", "button");
    			attr(button0, "class", "cookieConsent__Button");
    			attr(button0, "aria-label", /*settingsLabel*/ ctx[5]);
    			attr(button1, "type", "submit");
    			attr(button1, "class", "cookieConsent__Button");
    			attr(button1, "aria-label", /*rejectLabel*/ ctx[4]);
    			attr(button2, "type", "submit");
    			attr(button2, "class", "cookieConsent__Button");
    			attr(button2, "aria-label", /*acceptLabel*/ ctx[3]);
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
    			append(div2, t6);
    			append(div2, button2);
    			append(button2, t7);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(button0, "click", /*click_handler*/ ctx[19]),
    					listen(button1, "click", /*reject*/ ctx[13]),
    					listen(button2, "click", /*choose*/ ctx[14])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (!current || dirty[0] & /*heading*/ 2) set_data(t0, /*heading*/ ctx[1]);
    			if (!current || dirty[0] & /*description*/ 4) p1.innerHTML = /*description*/ ctx[2];			if (!current || dirty[0] & /*settingsLabel*/ 32) set_data(t3, /*settingsLabel*/ ctx[5]);

    			if (!current || dirty[0] & /*settingsLabel*/ 32) {
    				attr(button0, "aria-label", /*settingsLabel*/ ctx[5]);
    			}

    			if (!current || dirty[0] & /*rejectLabel*/ 16) set_data(t5, /*rejectLabel*/ ctx[4]);

    			if (!current || dirty[0] & /*rejectLabel*/ 16) {
    				attr(button1, "aria-label", /*rejectLabel*/ ctx[4]);
    			}

    			if (!current || dirty[0] & /*acceptLabel*/ 8) set_data(t7, /*acceptLabel*/ ctx[3]);

    			if (!current || dirty[0] & /*acceptLabel*/ 8) {
    				attr(button2, "aria-label", /*acceptLabel*/ ctx[3]);
    			}
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

    // (205:0) {#if settingsShown}
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
    	let each_value = /*choicesArr*/ ctx[10];
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
    			t1 = text(/*closeLabel*/ ctx[6]);
    			attr(button, "type", "submit");
    			attr(button, "class", "cookieConsent__Button cookieConsent__Button--Close");
    			attr(button, "aria-label", /*closeLabel*/ ctx[6]);
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
    				dispose = listen(button, "click", /*click_handler_1*/ ctx[21]);
    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (dirty[0] & /*choicesArr, choicesMerged*/ 1536) {
    				each_value = /*choicesArr*/ ctx[10];
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

    			if (!current || dirty[0] & /*closeLabel*/ 64) set_data(t1, /*closeLabel*/ ctx[6]);

    			if (!current || dirty[0] & /*closeLabel*/ 64) {
    				attr(button, "aria-label", /*closeLabel*/ ctx[6]);
    			}
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

    // (209:6) {#if Object.hasOwnProperty.call(choicesMerged, choice.id) && choicesMerged[choice.id]}
    function create_if_block_1(ctx) {
    	let div;
    	let input;
    	let input_id_value;
    	let input_disabled_value;
    	let t0;
    	let label;
    	let t1_value = /*choice*/ ctx[30].label + "";
    	let t1;
    	let label_for_value;
    	let t2;
    	let span;
    	let t3_value = /*choice*/ ctx[30].description + "";
    	let t3;
    	let mounted;
    	let dispose;

    	function input_change_handler() {
    		/*input_change_handler*/ ctx[20].call(input, /*choice*/ ctx[30]);
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
    			attr(input, "id", input_id_value = `gdpr-check-${/*choice*/ ctx[30].id}`);
    			input.disabled = input_disabled_value = /*choice*/ ctx[30].id === 'necessary';
    			attr(label, "for", label_for_value = `gdpr-check-${/*choice*/ ctx[30].id}`);
    			attr(span, "class", "cookieConsentOperations__ItemLabel");
    			attr(div, "class", "cookieConsentOperations__Item");
    			toggle_class(div, "disabled", /*choice*/ ctx[30].id === 'necessary');
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, input);
    			input.checked = /*choicesMerged*/ ctx[9][/*choice*/ ctx[30].id].value;
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

    			if (dirty[0] & /*choicesArr*/ 1024 && input_id_value !== (input_id_value = `gdpr-check-${/*choice*/ ctx[30].id}`)) {
    				attr(input, "id", input_id_value);
    			}

    			if (dirty[0] & /*choicesArr*/ 1024 && input_disabled_value !== (input_disabled_value = /*choice*/ ctx[30].id === 'necessary')) {
    				input.disabled = input_disabled_value;
    			}

    			if (dirty[0] & /*choicesMerged, choicesArr*/ 1536) {
    				input.checked = /*choicesMerged*/ ctx[9][/*choice*/ ctx[30].id].value;
    			}

    			if (dirty[0] & /*choicesArr*/ 1024 && t1_value !== (t1_value = /*choice*/ ctx[30].label + "")) set_data(t1, t1_value);

    			if (dirty[0] & /*choicesArr*/ 1024 && label_for_value !== (label_for_value = `gdpr-check-${/*choice*/ ctx[30].id}`)) {
    				attr(label, "for", label_for_value);
    			}

    			if (dirty[0] & /*choicesArr*/ 1024 && t3_value !== (t3_value = /*choice*/ ctx[30].description + "")) set_data(t3, t3_value);

    			if (dirty[0] & /*choicesArr*/ 1024) {
    				toggle_class(div, "disabled", /*choice*/ ctx[30].id === 'necessary');
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (208:4) {#each choicesArr as choice}
    function create_each_block(ctx) {
    	let show_if = Object.hasOwnProperty.call(/*choicesMerged*/ ctx[9], /*choice*/ ctx[30].id) && /*choicesMerged*/ ctx[9][/*choice*/ ctx[30].id];
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
    			if (dirty[0] & /*choicesMerged, choicesArr*/ 1536) show_if = Object.hasOwnProperty.call(/*choicesMerged*/ ctx[9], /*choice*/ ctx[30].id) && /*choicesMerged*/ ctx[9][/*choice*/ ctx[30].id];

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
    	let if_block1 = /*shown*/ ctx[11] && create_if_block_2(ctx);
    	let if_block2 = /*settingsShown*/ ctx[12] && create_if_block(ctx);

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
    		p(ctx, dirty) {
    			if (/*showEditIcon*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*showEditIcon*/ 1) {
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

    			if (/*shown*/ ctx[11]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*shown*/ 2048) {
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

    			if (/*settingsShown*/ ctx[12]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*settingsShown*/ 4096) {
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
    	let choicesMerged;
    	let choicesArr;
    	let cookieChoices;
    	let necessaryCookieChoices;
    	const dispatch = createEventDispatcher();
    	let { cookieName = null } = $$props;
    	let { showEditIcon = true } = $$props;
    	let shown = false;
    	let settingsShown = false;
    	let { heading = 'GDPR Notice' } = $$props;
    	let { description = 'We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.' } = $$props;

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
    	const defaults = { sameSite: 'strict' };
    	let { choices = {} } = $$props;

    	const choicesDefaults = {
    		necessary: {
    			label: 'Necessary cookies',
    			description: "Used for cookie control. Can't be turned off.",
    			value: true
    		},
    		tracking: {
    			label: 'Tracking cookies',
    			description: 'Used for advertising purposes.',
    			value: true
    		},
    		analytics: {
    			label: 'Analytics cookies',
    			description: 'Used to control Google Analytics, a 3rd party tool offered by Google to track user behavior.',
    			value: true
    		},
    		marketing: {
    			label: 'Marketing cookies',
    			description: 'Used for marketing data.',
    			value: true
    		}
    	};

    	let { acceptLabel = 'Accept cookies' } = $$props;
    	let { rejectLabel = 'Reject cookies' } = $$props;
    	let { settingsLabel = 'Cookie settings' } = $$props;
    	let { closeLabel = 'Close settings' } = $$props;
    	let { editLabel = 'Edit cookie settings' } = $$props;

    	function show() {
    		$$invalidate(11, shown = true);
    	}

    	onMount(() => {
    		if (!cookieName) {
    			throw new Error('You must set gdpr cookie name');
    		}

    		const cookie = api.get(cookieName);

    		if (!cookie) {
    			show();
    		}

    		try {
    			const { choices } = JSON.parse(cookie);
    			const valid = validate(cookieChoices, choices);

    			if (!valid) {
    				throw new Error('cookie consent has changed');
    			}

    			execute(choices);
    		} catch(e) {
    			removeCookie();
    			show();
    		}
    	});

    	function setCookie(choices) {
    		const expires = new Date();
    		expires.setDate(expires.getDate() + 365);
    		const options = Object.assign({}, defaults, cookieConfig, { expires });
    		api.set(cookieName, JSON.stringify({ choices }), options);
    	}

    	function removeCookie() {
    		const { path } = cookieConfig;
    		api.remove(cookieName, Object.assign({}, path ? { path } : {}));
    	}

    	function execute(chosen) {
    		const types = Object.keys(cookieChoices);

    		types.forEach(t => {
    			const agreed = chosen[t];

    			if (choicesMerged[t]) {
    				$$invalidate(9, choicesMerged[t].value = agreed, choicesMerged);
    			}

    			if (agreed) {
    				categories[t] && categories[t]();
    				dispatch(`${t}`);
    			}
    		});

    		$$invalidate(11, shown = false);
    	}

    	function reject() {
    		setCookie(necessaryCookieChoices);
    		execute(necessaryCookieChoices);
    	}

    	function choose() {
    		setCookie(cookieChoices);
    		execute(cookieChoices);
    	}

    	const click_handler = () => {
    		$$invalidate(12, settingsShown = true);
    	};

    	function input_change_handler(choice) {
    		choicesMerged[choice.id].value = this.checked;
    		($$invalidate(9, choicesMerged), $$invalidate(18, choices));
    	}

    	const click_handler_1 = () => {
    		$$invalidate(12, settingsShown = false);
    	};

    	$$self.$$set = $$props => {
    		if ('cookieName' in $$props) $$invalidate(15, cookieName = $$props.cookieName);
    		if ('showEditIcon' in $$props) $$invalidate(0, showEditIcon = $$props.showEditIcon);
    		if ('heading' in $$props) $$invalidate(1, heading = $$props.heading);
    		if ('description' in $$props) $$invalidate(2, description = $$props.description);
    		if ('categories' in $$props) $$invalidate(16, categories = $$props.categories);
    		if ('cookieConfig' in $$props) $$invalidate(17, cookieConfig = $$props.cookieConfig);
    		if ('choices' in $$props) $$invalidate(18, choices = $$props.choices);
    		if ('acceptLabel' in $$props) $$invalidate(3, acceptLabel = $$props.acceptLabel);
    		if ('rejectLabel' in $$props) $$invalidate(4, rejectLabel = $$props.rejectLabel);
    		if ('settingsLabel' in $$props) $$invalidate(5, settingsLabel = $$props.settingsLabel);
    		if ('closeLabel' in $$props) $$invalidate(6, closeLabel = $$props.closeLabel);
    		if ('editLabel' in $$props) $$invalidate(7, editLabel = $$props.editLabel);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*choices*/ 262144) {
    			$$invalidate(9, choicesMerged = Object.assign({}, choicesDefaults, choices));
    		}

    		if ($$self.$$.dirty[0] & /*choicesMerged*/ 512) {
    			$$invalidate(10, choicesArr = Object.values(choicesMerged).map((item, index) => {
    				return Object.assign({}, item, { id: Object.keys(choicesMerged)[index] });
    			}));
    		}

    		if ($$self.$$.dirty[0] & /*choicesArr*/ 1024) {
    			cookieChoices = choicesArr.reduce(
    				(result, item) => {
    					result[item.id] = item.value ? item.value : false;
    					return result;
    				},
    				{}
    			);
    		}

    		if ($$self.$$.dirty[0] & /*choicesArr*/ 1024) {
    			necessaryCookieChoices = choicesArr.reduce(
    				(result, item) => {
    					result[item.id] = item.id === 'necessary';
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
    		rejectLabel,
    		settingsLabel,
    		closeLabel,
    		editLabel,
    		show,
    		choicesMerged,
    		choicesArr,
    		shown,
    		settingsShown,
    		reject,
    		choose,
    		cookieName,
    		categories,
    		cookieConfig,
    		choices,
    		click_handler,
    		input_change_handler,
    		click_handler_1
    	];
    }

    class Banner extends SvelteComponent {
    	constructor(options) {
    		super();

    		init$1(
    			this,
    			options,
    			instance,
    			create_fragment,
    			safe_not_equal,
    			{
    				cookieName: 15,
    				showEditIcon: 0,
    				heading: 1,
    				description: 2,
    				categories: 16,
    				cookieConfig: 17,
    				choices: 18,
    				acceptLabel: 3,
    				rejectLabel: 4,
    				settingsLabel: 5,
    				closeLabel: 6,
    				editLabel: 7,
    				show: 8
    			},
    			null,
    			[-1, -1]
    		);
    	}

    	get show() {
    		return this.$$.ctx[8];
    	}
    }

    function attachBanner (target, props = {}) {
      // eslint-disable-next-line no-new
      new Banner({
        target,
        props
      });
    }

    window.GdprConsent = window.GdprConsent || {};
    window.GdprConsent.attachBanner = attachBanner;

})();
