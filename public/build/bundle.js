
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
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
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
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
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
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
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
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
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* client/App.svelte generated by Svelte v3.46.2 */

    const file = "client/App.svelte";

    function create_fragment(ctx) {
    	let link;
    	let t0;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t1;
    	let br0;
    	let t2;
    	let img1;
    	let img1_src_value;
    	let t3;
    	let div1;
    	let h10;
    	let t4;
    	let span0;
    	let t6;
    	let p;
    	let t7;
    	let span1;
    	let t9;
    	let t10;
    	let div4;
    	let div2;
    	let h11;
    	let t12;
    	let span2;
    	let t14;
    	let br1;
    	let t15;
    	let span3;
    	let t17;
    	let div3;
    	let h12;
    	let t19;
    	let span4;
    	let t20;
    	let br2;
    	let t21;
    	let br3;
    	let t22;
    	let br4;
    	let t23;
    	let div6;
    	let h13;
    	let t25;
    	let div5;

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			div0 = element("div");
    			img0 = element("img");
    			t1 = space();
    			br0 = element("br");
    			t2 = space();
    			img1 = element("img");
    			t3 = space();
    			div1 = element("div");
    			h10 = element("h1");
    			t4 = text("Built for ");
    			span0 = element("span");
    			span0.textContent = "devs";
    			t6 = space();
    			p = element("p");
    			t7 = text("Developed under tech accelerator, OS Labs, ");
    			span1 = element("span");
    			span1.textContent = "DeLorean";
    			t9 = text(" is Svelte's the first time traveling debugger tool that allows you to jump\n    from state to state seamlessly.");
    			t10 = space();
    			div4 = element("div");
    			div2 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Features";
    			t12 = space();
    			span2 = element("span");
    			span2.textContent = "feature 1:";
    			t14 = space();
    			br1 = element("br");
    			t15 = space();
    			span3 = element("span");
    			span3.textContent = "feature 2:";
    			t17 = space();
    			div3 = element("div");
    			h12 = element("h1");
    			h12.textContent = "How to Get Started";
    			t19 = space();
    			span4 = element("span");
    			t20 = text("Step 1: ");
    			br2 = element("br");
    			t21 = text("\n      Step 2: ");
    			br3 = element("br");
    			t22 = text("\n      Step 3: ");
    			br4 = element("br");
    			t23 = space();
    			div6 = element("div");
    			h13 = element("h1");
    			h13.textContent = "Meet the Team";
    			t25 = space();
    			div5 = element("div");
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file, 8, 2, 170);
    			attr_dev(img0, "id", "logo");
    			attr_dev(img0, "class", "center svelte-6lsdui");
    			if (!src_url_equal(img0.src, img0_src_value = /*logo*/ ctx[0])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "logo");
    			add_location(img0, file, 15, 2, 432);
    			add_location(br0, file, 16, 2, 489);
    			attr_dev(img1, "class", "center svelte-6lsdui");
    			attr_dev(img1, "id", "chromeButton");
    			if (!src_url_equal(img1.src, img1_src_value = /*webstore*/ ctx[1])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "chrome-webstore-button");
    			add_location(img1, file, 18, 2, 557);
    			attr_dev(div0, "class", "header svelte-6lsdui");
    			add_location(div0, file, 14, 0, 409);
    			set_style(span0, "color", "rgb(255, 50, 57)");
    			attr_dev(span0, "class", "svelte-6lsdui");
    			add_location(span0, file, 27, 16, 712);
    			attr_dev(h10, "class", "svelte-6lsdui");
    			add_location(h10, file, 27, 2, 698);
    			set_style(span1, "font-weight", "700");
    			set_style(span1, "color", "coral");
    			attr_dev(span1, "class", "svelte-6lsdui");
    			add_location(span1, file, 29, 47, 821);
    			attr_dev(p, "class", "svelte-6lsdui");
    			add_location(p, file, 28, 2, 770);
    			attr_dev(div1, "class", "mainContainer svelte-6lsdui");
    			add_location(div1, file, 26, 0, 668);
    			attr_dev(h11, "class", "svelte-6lsdui");
    			add_location(h11, file, 40, 4, 1049);
    			attr_dev(span2, "class", "svelte-6lsdui");
    			add_location(span2, file, 41, 4, 1071);
    			add_location(br1, file, 42, 4, 1101);
    			attr_dev(span3, "class", "svelte-6lsdui");
    			add_location(span3, file, 44, 4, 1136);
    			add_location(div2, file, 39, 2, 1039);
    			attr_dev(h12, "class", "whiteText svelte-6lsdui");
    			add_location(h12, file, 49, 4, 1208);
    			add_location(br2, file, 51, 14, 1279);
    			add_location(br3, file, 52, 14, 1300);
    			add_location(br4, file, 53, 14, 1321);
    			attr_dev(span4, "class", "svelte-6lsdui");
    			add_location(span4, file, 50, 4, 1258);
    			add_location(div3, file, 48, 2, 1198);
    			add_location(div4, file, 38, 0, 1031);
    			attr_dev(h13, "class", "whiteText svelte-6lsdui");
    			add_location(h13, file, 59, 2, 1365);
    			add_location(div5, file, 60, 2, 1408);
    			add_location(div6, file, 58, 0, 1357);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img0);
    			append_dev(div0, t1);
    			append_dev(div0, br0);
    			append_dev(div0, t2);
    			append_dev(div0, img1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h10);
    			append_dev(h10, t4);
    			append_dev(h10, span0);
    			append_dev(div1, t6);
    			append_dev(div1, p);
    			append_dev(p, t7);
    			append_dev(p, span1);
    			append_dev(p, t9);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div2);
    			append_dev(div2, h11);
    			append_dev(div2, t12);
    			append_dev(div2, span2);
    			append_dev(div2, t14);
    			append_dev(div2, br1);
    			append_dev(div2, t15);
    			append_dev(div2, span3);
    			append_dev(div4, t17);
    			append_dev(div4, div3);
    			append_dev(div3, h12);
    			append_dev(div3, t19);
    			append_dev(div3, span4);
    			append_dev(span4, t20);
    			append_dev(span4, br2);
    			append_dev(span4, t21);
    			append_dev(span4, br3);
    			append_dev(span4, t22);
    			append_dev(span4, br4);
    			insert_dev(target, t23, anchor);
    			insert_dev(target, div6, anchor);
    			append_dev(div6, h13);
    			append_dev(div6, t25);
    			append_dev(div6, div5);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div4);
    			if (detaching) detach_dev(t23);
    			if (detaching) detach_dev(div6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let logo = "./assets/logo(white).png";
    	let webstore = "./assets/webstore-button.png";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ logo, webstore });

    	$$self.$inject_state = $$props => {
    		if ('logo' in $$props) $$invalidate(0, logo = $$props.logo);
    		if ('webstore' in $$props) $$invalidate(1, webstore = $$props.webstore);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [logo, webstore];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    new App ({
      target: document.getElementById('root')
    });

})();
//# sourceMappingURL=bundle.js.map
