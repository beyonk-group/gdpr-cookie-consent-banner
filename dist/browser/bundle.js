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

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
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

	function addListener(node, event, handler, options) {
		node.addEventListener(event, handler, options);
	}

	function removeListener(node, event, handler, options) {
		node.removeEventListener(event, handler, options);
	}

	function setAttribute(node, attribute, value) {
		if (value == null) node.removeAttribute(attribute);
		else node.setAttribute(attribute, value);
	}

	function setData(text, data) {
		text.data = '' + data;
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

	function flush(component) {
		component._lock = true;
		callAll(component._beforecreate);
		callAll(component._oncreate);
		callAll(component._aftercreate);
		component._lock = false;
	}

	function get() {
		return this._state;
	}

	function init(component, options) {
		component._handlers = blankObject();
		component._slots = blankObject();
		component._bind = options._bind;
		component._staged = {};

		component.options = options;
		component.root = options.root || component;
		component.store = options.store || component.root.store;

		if (!options.root) {
			component._beforecreate = [];
			component._oncreate = [];
			component._aftercreate = [];
		}
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
		flush(this.root);
	}

	function _set(newState) {
		var oldState = this._state,
			changed = {},
			dirty = false;

		newState = assign(this._staged, newState);
		this._staged = {};

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

	function _stage(newState) {
		assign(this._staged, newState);
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
		_stage,
		_mount,
		_differs
	};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x.default : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var cookieUniversalCommon = createCommonjsModule(function (module) {
	module.exports=function(e){function t(o){if(r[o])return r[o].exports;var n=r[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,t),n.l=!0,n.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,o){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:o});},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=0)}([function(e,t,r){var o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n=r(1);e.exports=function(t,r){var i=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],a="object"===("undefined"==typeof document?"undefined":o(document))&&"string"==typeof document.cookie,s="object"===(void 0===t?"undefined":o(t))&&"object"===(void 0===r?"undefined":o(r))&&void 0!==e,u=!a&&!s||a&&s,f=function(e){if(s){var o=t.headers.cookie||"";return e&&(o=r.getHeaders(),o=o["set-cookie"]?o["set-cookie"].map(function(e){return e.split(";")[0]}).join(";"):""),o}if(a)return document.cookie||""},c=function(){var e=r.getHeader("Set-Cookie");return (e="string"==typeof e?[e]:e)||[]},p=function(e){return r.setHeader("Set-Cookie",e)},d=function(e,t){if(!t)return e;try{return JSON.parse(e)}catch(t){return e}},l={parseJSON:i,set:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"",r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{path:"/"};if(!u)if(t="object"===(void 0===t?"undefined":o(t))?JSON.stringify(t):t,s){var i=c();i.push(n.serialize(e,t,r)),p(i);}else document.cookie=n.serialize(e,t,r);},setAll:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];u||Array.isArray(e)&&e.forEach(function(e){var t=e.name,r=void 0===t?"":t,o=e.value,n=void 0===o?"":o,i=e.opts,a=void 0===i?{path:"/"}:i;l.set(r,n,a);});},get:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{fromRes:!1,parseJSON:l.parseJSON};if(u)return "";var r=n.parse(f(t.fromRes)),o=r[e];return d(o,t.parseJSON)},getAll:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{fromRes:!1,parseJSON:l.parseJSON};if(u)return {};var t=n.parse(f(e.fromRes));for(var r in t)t[r]=d(t[r],e.parseJSON);return t},remove:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{path:"/"};if(!u){var r=l.get(e);t.expires=new Date(0),r&&l.set(e,"",t);}},removeAll:function(){if(!u){var e=n.parse(f());for(var t in e)l.remove(t);}},nodeCookie:n};return l};},function(e,t,r){function o(e,t){if("string"!=typeof e)throw new TypeError("argument str must be a string");for(var r={},o=t||{},n=e.split(u),s=o.decode||a,f=0;f<n.length;f++){var c=n[f],p=c.indexOf("=");if(!(p<0)){var d=c.substr(0,p).trim(),l=c.substr(++p,c.length).trim();'"'==l[0]&&(l=l.slice(1,-1)),void 0==r[d]&&(r[d]=i(l,s));}}return r}function n(e,t,r){var o=r||{},n=o.encode||s;if("function"!=typeof n)throw new TypeError("option encode is invalid");if(!f.test(e))throw new TypeError("argument name is invalid");var i=n(t);if(i&&!f.test(i))throw new TypeError("argument val is invalid");var a=e+"="+i;if(null!=o.maxAge){var u=o.maxAge-0;if(isNaN(u))throw new Error("maxAge should be a Number");a+="; Max-Age="+Math.floor(u);}if(o.domain){if(!f.test(o.domain))throw new TypeError("option domain is invalid");a+="; Domain="+o.domain;}if(o.path){if(!f.test(o.path))throw new TypeError("option path is invalid");a+="; Path="+o.path;}if(o.expires){if("function"!=typeof o.expires.toUTCString)throw new TypeError("option expires is invalid");a+="; Expires="+o.expires.toUTCString();}if(o.httpOnly&&(a+="; HttpOnly"),o.secure&&(a+="; Secure"),o.sameSite){switch("string"==typeof o.sameSite?o.sameSite.toLowerCase():o.sameSite){case!0:a+="; SameSite=Strict";break;case"lax":a+="; SameSite=Lax";break;case"strict":a+="; SameSite=Strict";break;default:throw new TypeError("option sameSite is invalid")}}return a}function i(e,t){try{return t(e)}catch(t){return e}}/*!
	 * cookie
	 * Copyright(c) 2012-2014 Roman Shtylman
	 * Copyright(c) 2015 Douglas Christopher Wilson
	 * MIT Licensed
	 */
	t.parse=o,t.serialize=n;var a=decodeURIComponent,s=encodeURIComponent,u=/; */,f=/^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;}]);
	});

	var Cookie = unwrapExports(cookieUniversalCommon);

	var validate = function (choice, cookie) {
	  const choices = Object.keys(choice);
	  const chosen = Object.keys(cookie.choices);

	  if (chosen.length !== choices.length) {
	    return false
	  }

	  return chosen.every(c => choices.includes(c))
	};

	/* src/components/banner.svelte generated by Svelte v2.16.0 */



	const cookies = Cookie();

	function data() {
	  return {
	    cookieName: null,
	    shown: false,
	    heading: 'GDPR Notice',
	    description: "We use cookies to offer a better browsing experience, analyze site traffic, personalize content, and serve targeted advertisements. Please review our privacy policy & cookies information page. By clicking accept, you consent to our privacy policy & use of cookies.",
	    categories: {
	      analytics: function () {
	      },
	      tracking: function () {
	      },
	      marketing: function () {
	      },
	      necessary: function () {
	      }
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
	  setCookie (choices) {
	    const { cookieName, cookieConfig } = this.get();
	    const expires = new Date();
	    expires.setDate(expires.getDate() + 365);

	    const options = Object.assign({}, cookieConfig ? cookieConfig : {}, { expires });
	    cookies.set(cookieName, { choices }, options);
	  },

	  removeCookie () {
	    const { cookieName, cookieConfig } = this.get();
	    const { path } = cookieConfig;
	    cookies.remove(cookieName, { ...path ? { path } : {} } );
	  },

	  chosenMatchesChoice (cookie) {
	    const { choices } = this.get();
	    return validate(choices, cookie)
	  },

	  execute (chosen) {
	    const { categories, choices } = this.get();
	    const types = Object.keys(choices);

	    types
	    .forEach(t => {
	      const agreed = chosen[t];
	      if (agreed) {
	        categories[t]();
	        this.fire(`${t}`);
	      }
	    });
	    this.set({ shown: false });
	  },

	  choose () {
	    const { categories, choices } = this.get();
	    this.setCookie(choices);
	    this.execute(choices);
	  }
	};

	function oncreate() {
	  const { cookieName } = this.get();
	  if (!cookieName) {
	    throw('You must set gdpr cookie name')
	  }

	  const cookie = cookies.get(cookieName);
	  if (cookie && this.chosenMatchesChoice(cookie)) {
	    this.execute(cookie.choices);
	  } else {
	    this.removeCookie();
	    this.set({ shown: true });
	  }
	}
	function add_css() {
		var style = createElement("style");
		style.id = 'svelte-ci48be-style';
		style.textContent = "@import url('https://fonts.googleapis.com/css?family=Montserrat:600');h1.svelte-ci48be{font-size:18px;font-weight:bold;margin:0}h2.svelte-ci48be{font-size:14px;line-height:16px}h1.svelte-ci48be,h2.svelte-ci48be,label.svelte-ci48be,button.svelte-ci48be{color:#fff;font-family:'Montserrat', sans-serif}.wrapper.svelte-ci48be{z-index:99999;position:fixed;bottom:0;display:flex;flex-direction:row;width:100vw;background-color:rgba(7, 9, 15, 0.75);color:#fff;padding:20px}.text.svelte-ci48be{margin-right:20px}.right.svelte-ci48be{display:flex;flex-direction:column;justify-content:center;min-width:200px;text-align:center;flex-grow:1}ul.svelte-ci48be{display:inline-block;list-style-type:none;margin:0;padding:0}ul.svelte-ci48be>li.svelte-ci48be{display:inline-block}.operations.svelte-ci48be{text-align:left}input[type=\"checkbox\"].svelte-ci48be{display:none}input[type=\"checkbox\"]+label.svelte-ci48be{display:block;position:relative;padding-left:35px;padding-right:15px;margin-bottom:10px;font-size:14px/20px;cursor:pointer;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}input[type=\"checkbox\"]+label.svelte-ci48be:before{content:'';display:block;width:20px;height:20px;border:1px solid #D6C3C9;position:absolute;left:0;top:0;opacity:.6;-webkit-transition:all .12s, border-color .08s;transition:all .12s, border-color .08s}input[type=\"checkbox\"]:checked+label.svelte-ci48be:before{width:10px;top:-5px;left:5px;border-radius:0;opacity:1;border-top-color:transparent;border-left-color:transparent;-webkit-transform:rotate(45deg);transform:rotate(45deg)}button.svelte-ci48be{font-size:14px;max-width:200px;text-transform:uppercase;font-weight:bold;padding:1vh 1vw;color:#fff;text-align:center;text-shadow:0 1px 2px rgba(0, 0, 0, 0.25);border-radius:4px;background-color:#ff9273;border:0;border:4px solid #ff9273;cursor:pointer;transition:all 0.3s ease}button.svelte-ci48be:hover{background-color:#fff;color:#ff9273}@media only screen and (max-width: 600px){.wrapper.svelte-ci48be{flex-direction:column}.operations.svelte-ci48be{margin-bottom:35px}button.svelte-ci48be{max-width:100vw;margin-bottom:2vh}}";
		append(document.head, style);
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
				insert(target, if_block_anchor, anchor);
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
		var div4, div2, div0, h1, text0, text1, h2, text2, div1, ul, text3, text4, text5, text6, div3, button;

		var if_block0 = (ctx.choices.hasOwnProperty('necessary')) && create_if_block_4(component, ctx);

		var if_block1 = (ctx.choices.hasOwnProperty('tracking')) && create_if_block_3(component, ctx);

		var if_block2 = (ctx.choices.hasOwnProperty('analytics')) && create_if_block_2(component, ctx);

		var if_block3 = (ctx.choices.hasOwnProperty('marketing')) && create_if_block_1(component, ctx);

		function click_handler(event) {
			component.choose();
		}

		return {
			c() {
				div4 = createElement("div");
				div2 = createElement("div");
				div0 = createElement("div");
				h1 = createElement("h1");
				text0 = createText(ctx.heading);
				text1 = createText("\n      ");
				h2 = createElement("h2");
				text2 = createText("\n    ");
				div1 = createElement("div");
				ul = createElement("ul");
				if (if_block0) if_block0.c();
				text3 = createText("\n        ");
				if (if_block1) if_block1.c();
				text4 = createText("\n        ");
				if (if_block2) if_block2.c();
				text5 = createText("\n        ");
				if (if_block3) if_block3.c();
				text6 = createText("\n  ");
				div3 = createElement("div");
				button = createElement("button");
				button.textContent = "Accept";
				h1.className = "svelte-ci48be";
				h2.className = "svelte-ci48be";
				div0.className = "text svelte-ci48be";
				ul.className = "svelte-ci48be";
				div1.className = "operations svelte-ci48be";
				div2.className = "left";
				addListener(button, "click", click_handler);
				button.type = "button";
				button.className = "svelte-ci48be";
				div3.className = "right svelte-ci48be";
				div4.className = "wrapper svelte-ci48be";
			},

			m(target, anchor) {
				insert(target, div4, anchor);
				append(div4, div2);
				append(div2, div0);
				append(div0, h1);
				append(h1, text0);
				append(div0, text1);
				append(div0, h2);
				h2.innerHTML = ctx.description;
				append(div2, text2);
				append(div2, div1);
				append(div1, ul);
				if (if_block0) if_block0.m(ul, null);
				append(ul, text3);
				if (if_block1) if_block1.m(ul, null);
				append(ul, text4);
				if (if_block2) if_block2.m(ul, null);
				append(ul, text5);
				if (if_block3) if_block3.m(ul, null);
				append(div4, text6);
				append(div4, div3);
				append(div3, button);
			},

			p(changed, ctx) {
				if (changed.heading) {
					setData(text0, ctx.heading);
				}

				if (changed.description) {
					h2.innerHTML = ctx.description;
				}

				if (ctx.choices.hasOwnProperty('necessary')) {
					if (if_block0) {
						if_block0.p(changed, ctx);
					} else {
						if_block0 = create_if_block_4(component, ctx);
						if_block0.c();
						if_block0.m(ul, text3);
					}
				} else if (if_block0) {
					if_block0.d(1);
					if_block0 = null;
				}

				if (ctx.choices.hasOwnProperty('tracking')) {
					if (if_block1) {
						if_block1.p(changed, ctx);
					} else {
						if_block1 = create_if_block_3(component, ctx);
						if_block1.c();
						if_block1.m(ul, text4);
					}
				} else if (if_block1) {
					if_block1.d(1);
					if_block1 = null;
				}

				if (ctx.choices.hasOwnProperty('analytics')) {
					if (if_block2) {
						if_block2.p(changed, ctx);
					} else {
						if_block2 = create_if_block_2(component, ctx);
						if_block2.c();
						if_block2.m(ul, text5);
					}
				} else if (if_block2) {
					if_block2.d(1);
					if_block2 = null;
				}

				if (ctx.choices.hasOwnProperty('marketing')) {
					if (if_block3) {
						if_block3.p(changed, ctx);
					} else {
						if_block3 = create_if_block_1(component, ctx);
						if_block3.c();
						if_block3.m(ul, null);
					}
				} else if (if_block3) {
					if_block3.d(1);
					if_block3 = null;
				}
			},

			d(detach) {
				if (detach) {
					detachNode(div4);
				}

				if (if_block0) if_block0.d();
				if (if_block1) if_block1.d();
				if (if_block2) if_block2.d();
				if (if_block3) if_block3.d();
				removeListener(button, "click", click_handler);
			}
		};
	}

	// (10:8) {#if choices.hasOwnProperty('necessary')}
	function create_if_block_4(component, ctx) {
		var li, input, text, label;

		function input_change_handler() {
			ctx.choices.necessary = input.checked;
			component.set({ choices: ctx.choices });
		}

		return {
			c() {
				li = createElement("li");
				input = createElement("input");
				text = createText("\n            ");
				label = createElement("label");
				label.textContent = "Neccessary Cookies";
				addListener(input, "change", input_change_handler);
				setAttribute(input, "type", "checkbox");
				input.id = "gdpr-check-necessary";
				input.disabled = true;
				input.className = "svelte-ci48be";
				label.htmlFor = "gdpr-check-necessary";
				label.className = "svelte-ci48be";
				li.className = "svelte-ci48be";
			},

			m(target, anchor) {
				insert(target, li, anchor);
				append(li, input);

				input.checked = ctx.choices.necessary;

				append(li, text);
				append(li, label);
			},

			p(changed, _ctx) {
				ctx = _ctx;
				if (changed.choices) input.checked = ctx.choices.necessary;
			},

			d(detach) {
				if (detach) {
					detachNode(li);
				}

				removeListener(input, "change", input_change_handler);
			}
		};
	}

	// (16:8) {#if choices.hasOwnProperty('tracking')}
	function create_if_block_3(component, ctx) {
		var li, input, text, label;

		function input_change_handler() {
			ctx.choices.tracking = input.checked;
			component.set({ choices: ctx.choices });
		}

		return {
			c() {
				li = createElement("li");
				input = createElement("input");
				text = createText("\n            ");
				label = createElement("label");
				label.textContent = "Tracking Cookies";
				addListener(input, "change", input_change_handler);
				setAttribute(input, "type", "checkbox");
				input.id = "gdpr-check-tracking";
				input.className = "svelte-ci48be";
				label.htmlFor = "gdpr-check-tracking";
				label.className = "svelte-ci48be";
				li.className = "svelte-ci48be";
			},

			m(target, anchor) {
				insert(target, li, anchor);
				append(li, input);

				input.checked = ctx.choices.tracking;

				append(li, text);
				append(li, label);
			},

			p(changed, _ctx) {
				ctx = _ctx;
				if (changed.choices) input.checked = ctx.choices.tracking;
			},

			d(detach) {
				if (detach) {
					detachNode(li);
				}

				removeListener(input, "change", input_change_handler);
			}
		};
	}

	// (22:8) {#if choices.hasOwnProperty('analytics')}
	function create_if_block_2(component, ctx) {
		var li, input, text, label;

		function input_change_handler() {
			ctx.choices.analytics = input.checked;
			component.set({ choices: ctx.choices });
		}

		return {
			c() {
				li = createElement("li");
				input = createElement("input");
				text = createText("\n            ");
				label = createElement("label");
				label.textContent = "Analytics Cookies";
				addListener(input, "change", input_change_handler);
				setAttribute(input, "type", "checkbox");
				input.id = "gdpr-check-analytics";
				input.className = "svelte-ci48be";
				label.htmlFor = "gdpr-check-analytics";
				label.className = "svelte-ci48be";
				li.className = "svelte-ci48be";
			},

			m(target, anchor) {
				insert(target, li, anchor);
				append(li, input);

				input.checked = ctx.choices.analytics;

				append(li, text);
				append(li, label);
			},

			p(changed, _ctx) {
				ctx = _ctx;
				if (changed.choices) input.checked = ctx.choices.analytics;
			},

			d(detach) {
				if (detach) {
					detachNode(li);
				}

				removeListener(input, "change", input_change_handler);
			}
		};
	}

	// (28:8) {#if choices.hasOwnProperty('marketing')}
	function create_if_block_1(component, ctx) {
		var li, input, text, label;

		function input_change_handler() {
			ctx.choices.marketing = input.checked;
			component.set({ choices: ctx.choices });
		}

		return {
			c() {
				li = createElement("li");
				input = createElement("input");
				text = createText("\n            ");
				label = createElement("label");
				label.textContent = "Marketing Cookies";
				addListener(input, "change", input_change_handler);
				setAttribute(input, "type", "checkbox");
				input.id = "gdpr-check-marketing";
				input.className = "svelte-ci48be";
				label.htmlFor = "gdpr-check-marketing";
				label.className = "svelte-ci48be";
				li.className = "svelte-ci48be";
			},

			m(target, anchor) {
				insert(target, li, anchor);
				append(li, input);

				input.checked = ctx.choices.marketing;

				append(li, text);
				append(li, label);
			},

			p(changed, _ctx) {
				ctx = _ctx;
				if (changed.choices) input.checked = ctx.choices.marketing;
			},

			d(detach) {
				if (detach) {
					detachNode(li);
				}

				removeListener(input, "change", input_change_handler);
			}
		};
	}

	function Banner(options) {
		init(this, options);
		this._state = assign(data(), options.data);
		this._intro = true;

		if (!document.getElementById("svelte-ci48be-style")) add_css();

		this._fragment = create_main_fragment(this, this._state);

		this.root._oncreate.push(() => {
			oncreate.call(this);
			this.fire("update", { changed: assignTrue({}, this._state), current: this._state });
		});

		if (options.target) {
			this._fragment.c();
			this._mount(options.target, options.anchor);

			flush(this);
		}
	}

	assign(Banner.prototype, proto);
	assign(Banner.prototype, methods);

	function attachBanner (target, data = {}) {
	  const banner = new Banner({
	    target,
	    data
	  });
	}

	window.GdprConsent = window.GdprConsent || {};
	window.GdprConsent.attachBanner = attachBanner;

}());
