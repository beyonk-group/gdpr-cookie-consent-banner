(function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (var k in src) tar[k] = src[k];
		return tar;
	}

	function assignTrue(tar, src) {
		for (var k in src) tar[k] = 1;
		return tar;
	}

	function appendNode(node, target) {
		target.appendChild(node);
	}

	function insertNode(node, target, anchor) {
		target.insertBefore(node, anchor);
	}

	function detachNode(node) {
		node.parentNode.removeChild(node);
	}

	function createElement(name) {
		return document.createElement(name);
	}

	function createText(data) {
		return document.createTextNode(data);
	}

	function createComment() {
		return document.createComment('');
	}

	function addListener(node, event, handler) {
		node.addEventListener(event, handler, false);
	}

	function removeListener(node, event, handler) {
		node.removeEventListener(event, handler, false);
	}

	function setAttribute(node, attribute, value) {
		node.setAttribute(attribute, value);
	}

	function blankObject() {
		return Object.create(null);
	}

	function destroy(detach) {
		this.destroy = noop;
		this.fire('destroy');
		this.set = noop;

		this._fragment.d(detach !== false);
		this._fragment = null;
		this._state = {};
	}

	function _differs(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function fire(eventName, data) {
		var handlers =
			eventName in this._handlers && this._handlers[eventName].slice();
		if (!handlers) return;

		for (var i = 0; i < handlers.length; i += 1) {
			var handler = handlers[i];

			if (!handler.__calling) {
				try {
					handler.__calling = true;
					handler.call(this, data);
				} finally {
					handler.__calling = false;
				}
			}
		}
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._bind = options._bind;

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;
	}

	function on(eventName, handler) {
		var handlers = this._handlers[eventName] || (this._handlers[eventName] = []);
		handlers.push(handler);

		return {
			cancel: function() {
				var index = handlers.indexOf(handler);
				if (~index) handlers.splice(index, 1);
			}
		};
	}

	function set(newState) {
		this._set(assign({}, newState));
		if (this.root._lock) return;
		this.root._lock = true;
		callAll(this.root._beforecreate);
		callAll(this.root._oncreate);
		callAll(this.root._aftercreate);
		this.root._lock = false;
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		for (var key in newState) {
			if (this._differs(newState[key], oldState[key])) changed[key] = dirty = true;
		}
		if (!dirty) return;

		this._state = assign(assign({}, oldState), newState);
		this._recompute(changed, this._state);
		if (this._bind) this._bind(changed, this._state);

		if (this._fragment) {
			this.fire("state", { changed: changed, current: this._state, previous: oldState });
			this._fragment.p(changed, this._state);
			this.fire("update", { changed: changed, current: this._state, previous: oldState });
		}
	}

	function callAll(fns) {
		while (fns && fns.length) fns.shift()();
	}

	function _mount(target, anchor) {
		this._fragment[this._fragment.i ? 'i' : 'm'](target, anchor || null);
	}

	var proto = {
		destroy,
		get,
		fire,
		on,
		set,
		_recompute: noop,
		_set,
		_mount,
		_differs
	};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var js_cookie = createCommonjsModule(function (module, exports) {
	(function (factory) {
		var registeredInModuleLoader = false;
		{
			module.exports = factory();
			registeredInModuleLoader = true;
		}
		if (!registeredInModuleLoader) {
			var OldCookies = window.Cookies;
			var api = window.Cookies = factory();
			api.noConflict = function () {
				window.Cookies = OldCookies;
				return api;
			};
		}
	}(function () {
		function extend () {
			var i = 0;
			var result = {};
			for (; i < arguments.length; i++) {
				var attributes = arguments[ i ];
				for (var key in attributes) {
					result[key] = attributes[key];
				}
			}
			return result;
		}

		function init (converter) {
			function api (key, value, attributes) {
				var result;
				if (typeof document === 'undefined') {
					return;
				}

				// Write

				if (arguments.length > 1) {
					attributes = extend({
						path: '/'
					}, api.defaults, attributes);

					if (typeof attributes.expires === 'number') {
						var expires = new Date();
						expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
						attributes.expires = expires;
					}

					// We're using "expires" because "max-age" is not supported by IE
					attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

					try {
						result = JSON.stringify(value);
						if (/^[\{\[]/.test(result)) {
							value = result;
						}
					} catch (e) {}

					if (!converter.write) {
						value = encodeURIComponent(String(value))
							.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
					} else {
						value = converter.write(value, key);
					}

					key = encodeURIComponent(String(key));
					key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
					key = key.replace(/[\(\)]/g, escape);

					var stringifiedAttributes = '';

					for (var attributeName in attributes) {
						if (!attributes[attributeName]) {
							continue;
						}
						stringifiedAttributes += '; ' + attributeName;
						if (attributes[attributeName] === true) {
							continue;
						}
						stringifiedAttributes += '=' + attributes[attributeName];
					}
					return (document.cookie = key + '=' + value + stringifiedAttributes);
				}

				// Read

				if (!key) {
					result = {};
				}

				// To prevent the for loop in the first place assign an empty array
				// in case there are no cookies at all. Also prevents odd result when
				// calling "get()"
				var cookies = document.cookie ? document.cookie.split('; ') : [];
				var rdecode = /(%[0-9A-Z]{2})+/g;
				var i = 0;

				for (; i < cookies.length; i++) {
					var parts = cookies[i].split('=');
					var cookie = parts.slice(1).join('=');

					if (!this.json && cookie.charAt(0) === '"') {
						cookie = cookie.slice(1, -1);
					}

					try {
						var name = parts[0].replace(rdecode, decodeURIComponent);
						cookie = converter.read ?
							converter.read(cookie, name) : converter(cookie, name) ||
							cookie.replace(rdecode, decodeURIComponent);

						if (this.json) {
							try {
								cookie = JSON.parse(cookie);
							} catch (e) {}
						}

						if (key === name) {
							result = cookie;
							break;
						}

						if (!key) {
							result[name] = cookie;
						}
					} catch (e) {}
				}

				return result;
			}

			api.set = api;
			api.get = function (key) {
				return api.call(api, key);
			};
			api.getJSON = function () {
				return api.apply({
					json: true
				}, [].slice.call(arguments));
			};
			api.defaults = {};

			api.remove = function (key, attributes) {
				api(key, '', extend(attributes, {
					expires: -1
				}));
			};

			api.withConverter = init;

			return api;
		}

		return init(function () {});
	}));
	});

	/* src/components/banner.svelte generated by Svelte v2.9.7 */

	const cookieName = 'beyonk_gdpr';

	function data() {
	  return {
	    shown: true,
	    heading: 'GDPR Notice',
	    description: "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.",
	    groups: {
	      analytics: function () {
	        console.log('No analytics cookies specified');
	      },
	      tracking: function () {
	        console.log('No tracking cookies specified');
	      },
	      marketing: function () {
	        console.log('No marketing cookies specified');
	      },
	      necessary: function () {
	        console.log('No necessary cookies specified');
	      },
	    },
	    choices: {
	      necessary: true,
	      marketing: true,
	      analytics: true,
	      tracking: true
	    }
	  }
	}
	var methods = {
	  choose () {
	    const { groups, choices } = this.get();
	    js_cookie.set(cookieName, { choices });
	    const types = Object.keys(choices);
	    types
	      .filter(t => !!choices[t])
	      .forEach(t => {
	        groups[t]();
	      });
	    this.set({ shown: false });
	  }
	};

	function oncreate() {
	  const cookie = js_cookie.get(cookieName);
	  if (cookie) {
	    this.set({ shown: false });
	  }
	}
	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-1l38kwy-style';
		style.textContent = "h1.svelte-1l38kwy{font-size:18px}h2.svelte-1l38kwy{font-size:14px}.wrapper.svelte-1l38kwy{padding:2vh 2vw 0 2vw;font-family:sans-serif;position:fixed;bottom:0;width:100%;background-color:#07090F;color:#D6C3C9}ul.svelte-1l38kwy{display:inline-block;list-style-type:none;margin:0;padding:0}ul.svelte-1l38kwy>li.svelte-1l38kwy{display:inline-block;margin:0 2vw}.operations.svelte-1l38kwy{text-align:center}input[type=\"checkbox\"].svelte-1l38kwy{display:none}input[type=\"checkbox\"]+label.svelte-1l38kwy{display:block;position:relative;padding-left:35px;margin-bottom:20px;font:14px/20px 'Open Sans', Arial, sans-serif;cursor:pointer;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}input[type=\"checkbox\"]+label.svelte-1l38kwy:before{content:'';display:block;width:20px;height:20px;border:1px solid #D6C3C9;position:absolute;left:0;top:0;opacity:.6;-webkit-transition:all .12s, border-color .08s;transition:all .12s, border-color .08s}input[type=\"checkbox\"]:checked+label.svelte-1l38kwy:before{width:10px;top:-5px;left:5px;border-radius:0;opacity:1;border-top-color:transparent;border-left-color:transparent;-webkit-transform:rotate(45deg);transform:rotate(45deg)}button.svelte-1l38kwy{padding:1vh 1vw;color:white;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);background-color:#3A3C42;border:0;border-bottom:2px solid #EFF1C5;cursor:pointer;-webkit-box-shadow:inset 0 -2px #EFF1C5;box-shadow:inset 0 -2px #EFF1C5;transition:all 0.3s ease}button.svelte-1l38kwy:hover{background-color:#A0A2A8;color:#07090F;border-bottom:2px solid #FFFFDF}";
		appendNode(style, document.head);
	}

	function create_main_fragment(component, ctx) {
		var if_block_anchor;

		var if_block = (ctx.shown) && create_if_block(component, ctx);

		return {
			c() {
				if (if_block) if_block.c();
				if_block_anchor = createComment();
			},

			m(target, anchor) {
				if (if_block) if_block.m(target, anchor);
				insertNode(if_block_anchor, target, anchor);
			},

			p(changed, ctx) {
				if (ctx.shown) {
					if (if_block) {
						if_block.p(changed, ctx);
					} else {
						if_block = create_if_block(component, ctx);
						if_block.c();
						if_block.m(if_block_anchor.parentNode, if_block_anchor);
					}
				} else if (if_block) {
					if_block.d(1);
					if_block = null;
				}
			},

			d(detach) {
				if (if_block) if_block.d(detach);
				if (detach) {
					detachNode(if_block_anchor);
				}
			}
		};
	}

	// (1:0) {#if shown}
	function create_if_block(component, ctx) {
		var div, div_1, h1, text, text_1, h2, text_2, text_4, div_2, ul, li, input, text_5, label, li_1, input_1, text_8, label_1, li_2, input_2, text_11, label_2, li_3, input_3, text_14, label_3, text_17, button;

		function input_change_handler() {
			ctx.choices.necessary = input.checked;
			component.set({ choices: ctx.choices });
		}

		function input_1_change_handler() {
			ctx.choices.tracking = input_1.checked;
			component.set({ choices: ctx.choices });
		}

		function input_2_change_handler() {
			ctx.choices.analytics = input_2.checked;
			component.set({ choices: ctx.choices });
		}

		function input_3_change_handler() {
			ctx.choices.marketing = input_3.checked;
			component.set({ choices: ctx.choices });
		}

		function click_handler(event) {
			component.choose();
		}

		return {
			c() {
				div = createElement("div");
				div_1 = createElement("div");
				h1 = createElement("h1");
				text = createText(ctx.heading);
				text_1 = createText("\n    ");
				h2 = createElement("h2");
				text_2 = createText(ctx.description);
				text_4 = createText("\n  ");
				div_2 = createElement("div");
				ul = createElement("ul");
				li = createElement("li");
				input = createElement("input");
				text_5 = createText("\n        ");
				label = createElement("label");
				label.textContent = "Neccessary Cookies";
				li_1 = createElement("li");
				input_1 = createElement("input");
				text_8 = createText("\n        ");
				label_1 = createElement("label");
				label_1.textContent = "Tracking Cookies";
				li_2 = createElement("li");
				input_2 = createElement("input");
				text_11 = createText("\n        ");
				label_2 = createElement("label");
				label_2.textContent = "Analytics Cookies";
				li_3 = createElement("li");
				input_3 = createElement("input");
				text_14 = createText("\n        ");
				label_3 = createElement("label");
				label_3.textContent = "Marketing Cookies";
				text_17 = createText("\n    ");
				button = createElement("button");
				button.textContent = "Accept";
				h1.className = "svelte-1l38kwy";
				h2.className = "svelte-1l38kwy";
				addListener(input, "change", input_change_handler);
				setAttribute(input, "type", "checkbox");
				input.id = "gdpr-check-necessary";
				input.disabled = true;
				input.className = "svelte-1l38kwy";
				label.htmlFor = "gdpr-check-necessary";
				label.className = "svelte-1l38kwy";
				li.className = "svelte-1l38kwy";
				addListener(input_1, "change", input_1_change_handler);
				setAttribute(input_1, "type", "checkbox");
				input_1.id = "gdpr-check-tracking";
				input_1.className = "svelte-1l38kwy";
				label_1.htmlFor = "gdpr-check-tracking";
				label_1.className = "svelte-1l38kwy";
				li_1.className = "svelte-1l38kwy";
				addListener(input_2, "change", input_2_change_handler);
				setAttribute(input_2, "type", "checkbox");
				input_2.id = "gdpr-check-analytics";
				input_2.className = "svelte-1l38kwy";
				label_2.htmlFor = "gdpr-check-analytics";
				label_2.className = "svelte-1l38kwy";
				li_2.className = "svelte-1l38kwy";
				addListener(input_3, "change", input_3_change_handler);
				setAttribute(input_3, "type", "checkbox");
				input_3.id = "gdpr-check-marketing";
				input_3.className = "svelte-1l38kwy";
				label_3.htmlFor = "gdpr-check-marketing";
				label_3.className = "svelte-1l38kwy";
				li_3.className = "svelte-1l38kwy";
				ul.className = "svelte-1l38kwy";
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "svelte-1l38kwy";
				div_2.className = "operations svelte-1l38kwy";
				div.className = "wrapper svelte-1l38kwy";
			},

			m(target, anchor) {
				insertNode(div, target, anchor);
				appendNode(div_1, div);
				appendNode(h1, div_1);
				appendNode(text, h1);
				appendNode(text_1, div_1);
				appendNode(h2, div_1);
				appendNode(text_2, h2);
				appendNode(text_4, div);
				appendNode(div_2, div);
				appendNode(ul, div_2);
				appendNode(li, ul);
				appendNode(input, li);

				input.checked = ctx.choices.necessary;

				appendNode(text_5, li);
				appendNode(label, li);
				appendNode(li_1, ul);
				appendNode(input_1, li_1);

				input_1.checked = ctx.choices.tracking;

				appendNode(text_8, li_1);
				appendNode(label_1, li_1);
				appendNode(li_2, ul);
				appendNode(input_2, li_2);

				input_2.checked = ctx.choices.analytics;

				appendNode(text_11, li_2);
				appendNode(label_2, li_2);
				appendNode(li_3, ul);
				appendNode(input_3, li_3);

				input_3.checked = ctx.choices.marketing;

				appendNode(text_14, li_3);
				appendNode(label_3, li_3);
				appendNode(text_17, div_2);
				appendNode(button, div_2);
			},

			p(changed, _ctx) {
				ctx = _ctx;
				if (changed.heading) {
					text.data = ctx.heading;
				}

				if (changed.description) {
					text_2.data = ctx.description;
				}

				input.checked = ctx.choices.necessary;
				input_1.checked = ctx.choices.tracking;
				input_2.checked = ctx.choices.analytics;
				input_3.checked = ctx.choices.marketing;
			},

			d(detach) {
				if (detach) {
					detachNode(div);
				}

				removeListener(input, "change", input_change_handler);
				removeListener(input_1, "change", input_1_change_handler);
				removeListener(input_2, "change", input_2_change_handler);
				removeListener(input_3, "change", input_3_change_handler);
				removeListener(button, "click", click_handler);
			}
		};
	}

	function Banner(options) {
		init(this, options);
		this._state = assign(data(), options.data);
		this._intro = true;

		if (!document.getElementById("svelte-1l38kwy-style")) add_css();

		if (!options.root) {
			this._oncreate = [];
		}

		this._fragment = create_main_fragment(this, this._state);

		this.root._oncreate.push(() => {
			oncreate.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);

			callAll(this._oncreate);
		}
	}

	assign(Banner.prototype, proto);
	assign(Banner.prototype, methods);

	const element = document.createElement('div', { id: 'gdpr-banner' });
	const banner = new Banner({
	  target: element
	});

	window.GdprConsent = window.GdprConsent || {};
	window.GdprConsent.attachBanner = function (parent) {
	  parent.appendChild(element);
	};

}());
