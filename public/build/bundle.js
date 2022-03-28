
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
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
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
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

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* client/TeamMember.svelte generated by Svelte v3.46.2 */

    const file$1 = "client/TeamMember.svelte";

    function create_fragment$1(ctx) {
    	let div4;
    	let div3;
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let div2;
    	let h2;
    	let t1;
    	let t2;
    	let p0;
    	let t4;
    	let p1;
    	let t5;
    	let t6;
    	let div1;
    	let a0;
    	let img1;
    	let img1_src_value;
    	let img1_alt_value;
    	let t7;
    	let a1;
    	let img2;
    	let img2_src_value;
    	let img2_alt_value;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			div2 = element("div");
    			h2 = element("h2");
    			t1 = text(/*name*/ ctx[0]);
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "Software Engineer";
    			t4 = space();
    			p1 = element("p");
    			t5 = text(/*bio*/ ctx[1]);
    			t6 = space();
    			div1 = element("div");
    			a0 = element("a");
    			img1 = element("img");
    			t7 = space();
    			a1 = element("a");
    			img2 = element("img");
    			attr_dev(img0, "class", "picture svelte-1js8w3f");
    			if (!src_url_equal(img0.src, img0_src_value = /*imgSrc*/ ctx[2])) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", /*alt*/ ctx[3]);
    			set_style(img0, "width", "100%");
    			attr_dev(img0, "height", "auto");
    			add_location(img0, file$1, 16, 6, 376);
    			attr_dev(div0, "class", "imgWrapper svelte-1js8w3f");
    			set_style(div0, "background-color", /*imgColor*/ ctx[4]);
    			add_location(div0, file$1, 15, 4, 309);
    			add_location(h2, file$1, 19, 6, 495);
    			attr_dev(p0, "class", "title");
    			add_location(p0, file$1, 20, 6, 517);
    			attr_dev(p1, "class", "bio svelte-1js8w3f");
    			add_location(p1, file$1, 21, 6, 562);
    			attr_dev(img1, "class", "logo svelte-1js8w3f");
    			if (!src_url_equal(img1.src, img1_src_value = "../public/assets/github_logo.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", img1_alt_value = "" + (/*name*/ ctx[0] + " github link"));
    			add_location(img1, file$1, 23, 37, 657);
    			attr_dev(a0, "href", /*gh*/ ctx[5]);
    			attr_dev(a0, "target", "_blank");
    			add_location(a0, file$1, 23, 8, 628);
    			attr_dev(img2, "class", "logo svelte-1js8w3f");
    			if (!src_url_equal(img2.src, img2_src_value = "../public/assets/linkedin_logo.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", img2_alt_value = "" + (/*name*/ ctx[0] + " linkedin link"));
    			add_location(img2, file$1, 24, 37, 781);
    			attr_dev(a1, "href", /*li*/ ctx[6]);
    			attr_dev(a1, "target", "_blank");
    			add_location(a1, file$1, 24, 8, 752);
    			attr_dev(div1, "class", "memberLogos svelte-1js8w3f");
    			add_location(div1, file$1, 22, 6, 593);
    			attr_dev(div2, "class", "container");
    			add_location(div2, file$1, 18, 4, 465);
    			attr_dev(div3, "class", "card svelte-1js8w3f");
    			add_location(div3, file$1, 14, 2, 286);
    			attr_dev(div4, "class", "column svelte-1js8w3f");
    			add_location(div4, file$1, 13, 0, 263);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, div0);
    			append_dev(div0, img0);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, h2);
    			append_dev(h2, t1);
    			append_dev(div2, t2);
    			append_dev(div2, p0);
    			append_dev(div2, t4);
    			append_dev(div2, p1);
    			append_dev(p1, t5);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			append_dev(div1, a0);
    			append_dev(a0, img1);
    			append_dev(div1, t7);
    			append_dev(div1, a1);
    			append_dev(a1, img2);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*imgSrc*/ 4 && !src_url_equal(img0.src, img0_src_value = /*imgSrc*/ ctx[2])) {
    				attr_dev(img0, "src", img0_src_value);
    			}

    			if (dirty & /*alt*/ 8) {
    				attr_dev(img0, "alt", /*alt*/ ctx[3]);
    			}

    			if (dirty & /*imgColor*/ 16) {
    				set_style(div0, "background-color", /*imgColor*/ ctx[4]);
    			}

    			if (dirty & /*name*/ 1) set_data_dev(t1, /*name*/ ctx[0]);
    			if (dirty & /*bio*/ 2) set_data_dev(t5, /*bio*/ ctx[1]);

    			if (dirty & /*name*/ 1 && img1_alt_value !== (img1_alt_value = "" + (/*name*/ ctx[0] + " github link"))) {
    				attr_dev(img1, "alt", img1_alt_value);
    			}

    			if (dirty & /*name*/ 1 && img2_alt_value !== (img2_alt_value = "" + (/*name*/ ctx[0] + " linkedin link"))) {
    				attr_dev(img2, "alt", img2_alt_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('TeamMember', slots, []);
    	let { name } = $$props;
    	let { bio } = $$props;
    	let { ghHandle } = $$props;
    	let { liHandle } = $$props;
    	let { imgSrc } = $$props;
    	let { alt } = $$props;
    	let { imgColor } = $$props;
    	const gh = `https://github.com/${ghHandle}`;
    	const li = `https://linkedin.com/in/${liHandle}`;
    	const writable_props = ['name', 'bio', 'ghHandle', 'liHandle', 'imgSrc', 'alt', 'imgColor'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<TeamMember> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('bio' in $$props) $$invalidate(1, bio = $$props.bio);
    		if ('ghHandle' in $$props) $$invalidate(7, ghHandle = $$props.ghHandle);
    		if ('liHandle' in $$props) $$invalidate(8, liHandle = $$props.liHandle);
    		if ('imgSrc' in $$props) $$invalidate(2, imgSrc = $$props.imgSrc);
    		if ('alt' in $$props) $$invalidate(3, alt = $$props.alt);
    		if ('imgColor' in $$props) $$invalidate(4, imgColor = $$props.imgColor);
    	};

    	$$self.$capture_state = () => ({
    		name,
    		bio,
    		ghHandle,
    		liHandle,
    		imgSrc,
    		alt,
    		imgColor,
    		gh,
    		li
    	});

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('bio' in $$props) $$invalidate(1, bio = $$props.bio);
    		if ('ghHandle' in $$props) $$invalidate(7, ghHandle = $$props.ghHandle);
    		if ('liHandle' in $$props) $$invalidate(8, liHandle = $$props.liHandle);
    		if ('imgSrc' in $$props) $$invalidate(2, imgSrc = $$props.imgSrc);
    		if ('alt' in $$props) $$invalidate(3, alt = $$props.alt);
    		if ('imgColor' in $$props) $$invalidate(4, imgColor = $$props.imgColor);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, bio, imgSrc, alt, imgColor, gh, li, ghHandle, liHandle];
    }

    class TeamMember extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			name: 0,
    			bio: 1,
    			ghHandle: 7,
    			liHandle: 8,
    			imgSrc: 2,
    			alt: 3,
    			imgColor: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "TeamMember",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<TeamMember> was created without expected prop 'name'");
    		}

    		if (/*bio*/ ctx[1] === undefined && !('bio' in props)) {
    			console.warn("<TeamMember> was created without expected prop 'bio'");
    		}

    		if (/*ghHandle*/ ctx[7] === undefined && !('ghHandle' in props)) {
    			console.warn("<TeamMember> was created without expected prop 'ghHandle'");
    		}

    		if (/*liHandle*/ ctx[8] === undefined && !('liHandle' in props)) {
    			console.warn("<TeamMember> was created without expected prop 'liHandle'");
    		}

    		if (/*imgSrc*/ ctx[2] === undefined && !('imgSrc' in props)) {
    			console.warn("<TeamMember> was created without expected prop 'imgSrc'");
    		}

    		if (/*alt*/ ctx[3] === undefined && !('alt' in props)) {
    			console.warn("<TeamMember> was created without expected prop 'alt'");
    		}

    		if (/*imgColor*/ ctx[4] === undefined && !('imgColor' in props)) {
    			console.warn("<TeamMember> was created without expected prop 'imgColor'");
    		}
    	}

    	get name() {
    		throw new Error("<TeamMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<TeamMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bio() {
    		throw new Error("<TeamMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bio(value) {
    		throw new Error("<TeamMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ghHandle() {
    		throw new Error("<TeamMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ghHandle(value) {
    		throw new Error("<TeamMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get liHandle() {
    		throw new Error("<TeamMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set liHandle(value) {
    		throw new Error("<TeamMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgSrc() {
    		throw new Error("<TeamMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgSrc(value) {
    		throw new Error("<TeamMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alt() {
    		throw new Error("<TeamMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alt(value) {
    		throw new Error("<TeamMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get imgColor() {
    		throw new Error("<TeamMember>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set imgColor(value) {
    		throw new Error("<TeamMember>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* client/App.svelte generated by Svelte v3.46.2 */

    const { setTimeout: setTimeout_1, window: window_1 } = globals;
    const file = "client/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (91:2) {#if visible}
    function create_if_block_9(ctx) {
    	let div;
    	let a0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let img1;
    	let img1_src_value;
    	let img1_transition;
    	let t1;
    	let br;
    	let t2;
    	let a1;
    	let img2;
    	let img2_src_value;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a0 = element("a");
    			img0 = element("img");
    			t0 = space();
    			img1 = element("img");
    			t1 = space();
    			br = element("br");
    			t2 = space();
    			a1 = element("a");
    			img2 = element("img");
    			if (!src_url_equal(img0.src, img0_src_value = /*logos*/ ctx[3].oslabs)) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "OSLabs");
    			set_style(img0, "max-width", "7.5em");
    			set_style(img0, "max-height", "auto");
    			add_location(img0, file, 92, 41, 3086);
    			attr_dev(a0, "href", "https://opensourcelabs.io/");
    			attr_dev(a0, "class", "svelte-8nnl08");
    			add_location(a0, file, 92, 4, 3049);
    			attr_dev(div, "class", "oslabs svelte-8nnl08");
    			add_location(div, file, 91, 2, 3024);
    			attr_dev(img1, "id", "logo");
    			attr_dev(img1, "class", "center svelte-8nnl08");
    			if (!src_url_equal(img1.src, img1_src_value = /*logos*/ ctx[3].delorean)) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "logo");
    			add_location(img1, file, 95, 4, 3210);
    			add_location(br, file, 97, 2, 3339);
    			attr_dev(img2, "class", "center svelte-8nnl08");
    			attr_dev(img2, "id", "githubButton");
    			if (!src_url_equal(img2.src, img2_src_value = /*logos*/ ctx[3].webstore)) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "github-webstore-button");
    			add_location(img2, file, 98, 37, 3381);
    			attr_dev(a1, "href", /*links*/ ctx[5].gh);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-8nnl08");
    			add_location(a1, file, 98, 2, 3346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a0);
    			append_dev(a0, img0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, img1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, br, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, a1, anchor);
    			append_dev(a1, img2);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!img1_transition) img1_transition = create_bidirectional_transition(img1, fly, { y: -50, duration: 1600 }, true);
    				img1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!img1_transition) img1_transition = create_bidirectional_transition(img1, fly, { y: -50, duration: 1600 }, false);
    			img1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(img1);
    			if (detaching && img1_transition) img1_transition.end();
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(br);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(a1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(91:2) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (104:0) {#if y >= 300}
    function create_if_block_8(ctx) {
    	let div;
    	let h1;
    	let t0;
    	let span0;
    	let h1_transition;
    	let t2;
    	let p;
    	let t3;
    	let span1;
    	let t5;
    	let p_transition;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			t0 = text("Built for ");
    			span0 = element("span");
    			span0.textContent = "devs";
    			t2 = space();
    			p = element("p");
    			t3 = text("Developed under tech accelerator, OS Labs, ");
    			span1 = element("span");
    			span1.textContent = "DeLorean";
    			t5 = text(" is Svelte's first time-traveling debugger tool that allows you to seamlessly jump from state to state. DeLorean features a clean, minimal UI that is easily accessible within the Chrome Developer Tools panel. It displays the names of all variables within each stateful component rendered on the app. Each variable displays its value at the given point in time you are examining.");
    			set_style(span0, "color", "coral");
    			attr_dev(span0, "class", "svelte-8nnl08");
    			add_location(span0, file, 105, 64, 3644);
    			add_location(h1, file, 105, 4, 3584);
    			set_style(span1, "font-weight", "700");
    			set_style(span1, "color", "rgb(255, 50, 57)");
    			attr_dev(span1, "class", "svelte-8nnl08");
    			add_location(span1, file, 106, 96, 3785);
    			add_location(p, file, 106, 4, 3693);
    			attr_dev(div, "class", "mainContainer svelte-8nnl08");
    			add_location(div, file, 104, 2, 3508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(h1, t0);
    			append_dev(h1, span0);
    			append_dev(div, t2);
    			append_dev(div, p);
    			append_dev(p, t3);
    			append_dev(p, span1);
    			append_dev(p, t5);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { y: -30, duration: 1500 }, true);
    				h1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { y: -30, duration: 1500 }, true);
    				p_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 30, duration: 700 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { y: -30, duration: 1500 }, false);
    			h1_transition.run(0);
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { y: -30, duration: 1500 }, false);
    			p_transition.run(0);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { y: 30, duration: 700 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && h1_transition) h1_transition.end();
    			if (detaching && p_transition) p_transition.end();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(104:0) {#if y >= 300}",
    		ctx
    	});

    	return block;
    }

    // (115:6) {#if y >= 700}
    function create_if_block_7(ctx) {
    	let h1;
    	let h1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Features";
    			attr_dev(h1, "id", "featuresTitle");
    			attr_dev(h1, "class", "whiteText svelte-8nnl08");
    			add_location(h1, file, 115, 6, 4313);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { y: -30, duration: 700 }, true);
    				h1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { y: -30, duration: 700 }, false);
    			h1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching && h1_transition) h1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(115:6) {#if y >= 700}",
    		ctx
    	});

    	return block;
    }

    // (118:6) {#if y >= 900}
    function create_if_block_6(ctx) {
    	let span1;
    	let p;
    	let strong;
    	let br;
    	let span0;
    	let p_transition;
    	let t2;
    	let div;
    	let img;
    	let img_src_value;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			span1 = element("span");
    			p = element("p");
    			strong = element("strong");
    			strong.textContent = "Capture State";
    			br = element("br");
    			span0 = element("span");
    			span0.textContent = "As you make changes to your app, each component’s state at the time of the state change is stored in a snapshot and cached.";
    			t2 = space();
    			div = element("div");
    			img = element("img");
    			attr_dev(strong, "class", "svelte-8nnl08");
    			add_location(strong, file, 120, 10, 4567);
    			add_location(br, file, 120, 40, 4597);
    			attr_dev(span0, "class", "svelte-8nnl08");
    			add_location(span0, file, 120, 44, 4601);
    			attr_dev(p, "class", "feat featLeft svelte-8nnl08");
    			add_location(p, file, 119, 8, 4487);
    			attr_dev(img, "class", "gif svelte-8nnl08");
    			if (!src_url_equal(img.src, img_src_value = /*gifs*/ ctx[4].captureState)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "capturing-state");
    			add_location(img, file, 121, 81, 4823);
    			attr_dev(div, "class", "gifPlaceholder svelte-8nnl08");
    			add_location(div, file, 121, 8, 4750);
    			attr_dev(span1, "class", "featureText svelte-8nnl08");
    			add_location(span1, file, 118, 6, 4452);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span1, anchor);
    			append_dev(span1, p);
    			append_dev(p, strong);
    			append_dev(p, br);
    			append_dev(p, span0);
    			append_dev(span1, t2);
    			append_dev(span1, div);
    			append_dev(div, img);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { x: 30, duration: 700 }, true);
    				p_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -30, duration: 700 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { x: 30, duration: 700 }, false);
    			p_transition.run(0);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -30, duration: 700 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span1);
    			if (detaching && p_transition) p_transition.end();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(118:6) {#if y >= 900}",
    		ctx
    	});

    	return block;
    }

    // (127:6) {#if y >= 1400}
    function create_if_block_4(ctx) {
    	let span;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	const if_block_creators = [create_if_block_5, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*mediaQuery*/ ctx[2].matches) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			span = element("span");
    			if_block.c();
    			attr_dev(span, "class", "featureText svelte-8nnl08");
    			add_location(span, file, 127, 6, 4968);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			if_blocks[current_block_type_index].m(span, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(127:6) {#if y >= 1400}",
    		ctx
    	});

    	return block;
    }

    // (132:8) {:else}
    function create_else_block_1(ctx) {
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let div0_transition;
    	let t0;
    	let p;
    	let strong;
    	let br;
    	let span1;
    	let t2;
    	let span0;
    	let t4;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			p = element("p");
    			strong = element("strong");
    			strong.textContent = "Time Travel";
    			br = element("br");
    			span1 = element("span");
    			t2 = text("Upon clicking a State button on ");
    			span0 = element("span");
    			span0.textContent = "DeLorean";
    			t4 = text(", you can see your application's state at that given snapshot, both in the DevTool as well as in the app, allowing for step-by-step examination of state change sequences.");
    			attr_dev(img, "class", "gif svelte-8nnl08");
    			if (!src_url_equal(img.src, img_src_value = /*gifs*/ ctx[4].timeTravel)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "time-traveling");
    			add_location(img, file, 132, 105, 5730);
    			attr_dev(div0, "class", "gifPlaceholder svelte-8nnl08");
    			add_location(div0, file, 132, 32, 5657);
    			attr_dev(div1, "class", "gifRight svelte-8nnl08");
    			add_location(div1, file, 132, 10, 5635);
    			attr_dev(strong, "class", "svelte-8nnl08");
    			add_location(strong, file, 133, 80, 5883);
    			add_location(br, file, 133, 108, 5911);
    			set_style(span0, "font-weight", "700");
    			set_style(span0, "color", "rgb(255, 90, 57)");
    			attr_dev(span0, "class", "svelte-8nnl08");
    			add_location(span0, file, 133, 150, 5953);
    			attr_dev(span1, "class", "svelte-8nnl08");
    			add_location(span1, file, 133, 112, 5915);
    			attr_dev(p, "class", "feat featRight svelte-8nnl08");
    			add_location(p, file, 133, 10, 5813);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, p, anchor);
    			append_dev(p, strong);
    			append_dev(p, br);
    			append_dev(p, span1);
    			append_dev(span1, t2);
    			append_dev(span1, span0);
    			append_dev(span1, t4);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { x: -30, duration: 700 }, true);
    				div0_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { x: 30, duration: 700 }, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { x: -30, duration: 700 }, false);
    			div0_transition.run(0);
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { x: 30, duration: 700 }, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && div0_transition) div0_transition.end();
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(132:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (129:8) {#if mediaQuery.matches}
    function create_if_block_5(ctx) {
    	let p;
    	let strong;
    	let br;
    	let span1;
    	let t1;
    	let span0;
    	let t3;
    	let p_transition;
    	let t4;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let div0_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			strong = element("strong");
    			strong.textContent = "Time Travel";
    			br = element("br");
    			span1 = element("span");
    			t1 = text("Upon clicking a State button on ");
    			span0 = element("span");
    			span0.textContent = "DeLorean";
    			t3 = text(", you can see your application's state at that given snapshot, both in the DevTool as well as in the app, allowing for step-by-step examination of state change sequences.");
    			t4 = space();
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			attr_dev(strong, "class", "svelte-8nnl08");
    			add_location(strong, file, 129, 80, 5108);
    			add_location(br, file, 129, 108, 5136);
    			set_style(span0, "font-weight", "700");
    			set_style(span0, "color", "rgb(255, 90, 57)");
    			attr_dev(span0, "class", "svelte-8nnl08");
    			add_location(span0, file, 129, 150, 5178);
    			attr_dev(span1, "class", "svelte-8nnl08");
    			add_location(span1, file, 129, 112, 5140);
    			attr_dev(p, "class", "feat featRight svelte-8nnl08");
    			add_location(p, file, 129, 10, 5038);
    			attr_dev(img, "class", "gif svelte-8nnl08");
    			if (!src_url_equal(img.src, img_src_value = /*gifs*/ ctx[4].timeTravel)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "time-traveling");
    			add_location(img, file, 130, 105, 5536);
    			attr_dev(div0, "class", "gifPlaceholder svelte-8nnl08");
    			add_location(div0, file, 130, 32, 5463);
    			attr_dev(div1, "class", "gifRight svelte-8nnl08");
    			add_location(div1, file, 130, 10, 5441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, strong);
    			append_dev(p, br);
    			append_dev(p, span1);
    			append_dev(span1, t1);
    			append_dev(span1, span0);
    			append_dev(span1, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { x: 30, duration: 700 }, true);
    				p_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { x: -30, duration: 700 }, true);
    				div0_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { x: 30, duration: 700 }, false);
    			p_transition.run(0);
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { x: -30, duration: 700 }, false);
    			div0_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			if (detaching && div0_transition) div0_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(129:8) {#if mediaQuery.matches}",
    		ctx
    	});

    	return block;
    }

    // (140:6) {#if y >= 1800}
    function create_if_block_3(ctx) {
    	let span2;
    	let p;
    	let strong;
    	let br;
    	let span1;
    	let t1;
    	let span0;
    	let t3;
    	let p_transition;
    	let t4;
    	let div;
    	let img;
    	let img_src_value;
    	let div_transition;
    	let current;

    	const block = {
    		c: function create() {
    			span2 = element("span");
    			p = element("p");
    			strong = element("strong");
    			strong.textContent = "New Branches";
    			br = element("br");
    			span1 = element("span");
    			t1 = text("When you change state while examining a previous state, ");
    			span0 = element("span");
    			span0.textContent = "DeLorean";
    			t3 = text(" will simply create and track a new timeline in the app and Dev Tools panel.");
    			t4 = space();
    			div = element("div");
    			img = element("img");
    			attr_dev(strong, "class", "svelte-8nnl08");
    			add_location(strong, file, 141, 77, 6400);
    			add_location(br, file, 141, 106, 6429);
    			set_style(span0, "font-weight", "700");
    			set_style(span0, "color", "rgb(255, 90, 57)");
    			attr_dev(span0, "class", "svelte-8nnl08");
    			add_location(span0, file, 141, 172, 6495);
    			attr_dev(span1, "class", "svelte-8nnl08");
    			add_location(span1, file, 141, 110, 6433);
    			attr_dev(p, "class", "feat featLeft svelte-8nnl08");
    			add_location(p, file, 141, 8, 6331);
    			attr_dev(img, "class", "gif svelte-8nnl08");
    			if (!src_url_equal(img.src, img_src_value = /*gifs*/ ctx[4].newMemory)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "showing-UI");
    			add_location(img, file, 142, 81, 6736);
    			attr_dev(div, "class", "gifPlaceholder svelte-8nnl08");
    			add_location(div, file, 142, 8, 6663);
    			attr_dev(span2, "class", "featureText svelte-8nnl08");
    			add_location(span2, file, 140, 6, 6296);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span2, anchor);
    			append_dev(span2, p);
    			append_dev(p, strong);
    			append_dev(p, br);
    			append_dev(p, span1);
    			append_dev(span1, t1);
    			append_dev(span1, span0);
    			append_dev(span1, t3);
    			append_dev(span2, t4);
    			append_dev(span2, div);
    			append_dev(div, img);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { x: 30, duration: 700 }, true);
    				p_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -30, duration: 700 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fly, { x: 30, duration: 700 }, false);
    			p_transition.run(0);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -30, duration: 700 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span2);
    			if (detaching && p_transition) p_transition.end();
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(140:6) {#if y >= 1800}",
    		ctx
    	});

    	return block;
    }

    // (149:4) {#if y >= 2200}
    function create_if_block_2(ctx) {
    	let div2;
    	let div1;
    	let h1;
    	let h1_transition;
    	let t1;
    	let div0;
    	let strong0;
    	let t3;
    	let a;
    	let t4;
    	let t5;
    	let i0;
    	let t7;
    	let br0;
    	let t8;
    	let br1;
    	let t9;
    	let strong1;
    	let t11;
    	let i1;
    	let t13;
    	let br2;
    	let t14;
    	let br3;
    	let t15;
    	let strong2;
    	let t17;
    	let div0_transition;
    	let div2_transition;
    	let current;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "How to Get Started";
    			t1 = space();
    			div0 = element("div");
    			strong0 = element("strong");
    			strong0.textContent = "Step 1:";
    			t3 = text(" To install DeLorean, head to the \n          ");
    			a = element("a");
    			t4 = text("DeLorean GitHub page");
    			t5 = text(". If you're interested in learning more about how DeLorean works, feel free to clone the repo! Otherwise, just download the ");
    			i0 = element("i");
    			i0.textContent = "chrome_extension";
    			t7 = text(" folder and save it somewhere on your computer.\n          ");
    			br0 = element("br");
    			t8 = space();
    			br1 = element("br");
    			t9 = space();
    			strong1 = element("strong");
    			strong1.textContent = "Step 2:";
    			t11 = text(" Navigate to Chrome's extensions page. Ensure you are in developer mode by clicking the 'Developer Mode' switch in the top-right corner of the page. Click on 'Load Unpacked', and select the ");
    			i1 = element("i");
    			i1.textContent = "chrome_extension";
    			t13 = text(" folder downloaded earlier to add DeLorean to your extensions.\n          ");
    			br2 = element("br");
    			t14 = space();
    			br3 = element("br");
    			t15 = space();
    			strong2 = element("strong");
    			strong2.textContent = "Step 3:";
    			t17 = text(" Once your test app is up and running, open the Dev Tools panel and select DeLorean from the dropdown in the navbar. Then click Connect, and you should see your application's initial state loaded in the panel. Make some state changes and travel through time!");
    			add_location(h1, file, 151, 6, 6982);
    			attr_dev(strong0, "class", "svelte-8nnl08");
    			add_location(strong0, file, 153, 10, 7137);
    			set_style(a, "font-family", "Raleway, Arial, Helvetica, sans");
    			set_style(a, "font-size", "18px");
    			attr_dev(a, "href", /*links*/ ctx[5].gh);
    			attr_dev(a, "target", "_blank");
    			attr_dev(a, "class", "svelte-8nnl08");
    			add_location(a, file, 154, 10, 7206);
    			add_location(i0, file, 155, 208, 7470);
    			add_location(br0, file, 156, 10, 7551);
    			add_location(br1, file, 157, 10, 7566);
    			attr_dev(strong1, "class", "svelte-8nnl08");
    			add_location(strong1, file, 158, 10, 7581);
    			add_location(i1, file, 158, 224, 7795);
    			add_location(br2, file, 159, 10, 7891);
    			add_location(br3, file, 160, 10, 7906);
    			attr_dev(strong2, "class", "svelte-8nnl08");
    			add_location(strong2, file, 161, 10, 7921);
    			attr_dev(div0, "id", "steps");
    			attr_dev(div0, "class", "svelte-8nnl08");
    			add_location(div0, file, 152, 8, 7064);
    			attr_dev(div1, "id", "getStarted");
    			attr_dev(div1, "class", "svelte-8nnl08");
    			add_location(div1, file, 150, 6, 6954);
    			attr_dev(div2, "id", "getStartedBackground");
    			attr_dev(div2, "class", "svelte-8nnl08");
    			add_location(div2, file, 149, 4, 6871);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, strong0);
    			append_dev(div0, t3);
    			append_dev(div0, a);
    			append_dev(a, t4);
    			append_dev(div0, t5);
    			append_dev(div0, i0);
    			append_dev(div0, t7);
    			append_dev(div0, br0);
    			append_dev(div0, t8);
    			append_dev(div0, br1);
    			append_dev(div0, t9);
    			append_dev(div0, strong1);
    			append_dev(div0, t11);
    			append_dev(div0, i1);
    			append_dev(div0, t13);
    			append_dev(div0, br2);
    			append_dev(div0, t14);
    			append_dev(div0, br3);
    			append_dev(div0, t15);
    			append_dev(div0, strong2);
    			append_dev(div0, t17);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { y: -30, duration: 1500 }, true);
    				h1_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { y: 30, duration: 1500 }, true);
    				div0_transition.run(1);
    			});

    			add_render_callback(() => {
    				if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: -30, duration: 700 }, true);
    				div2_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { y: -30, duration: 1500 }, false);
    			h1_transition.run(0);
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { y: 30, duration: 1500 }, false);
    			div0_transition.run(0);
    			if (!div2_transition) div2_transition = create_bidirectional_transition(div2, fly, { y: -30, duration: 700 }, false);
    			div2_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching && h1_transition) h1_transition.end();
    			if (detaching && div0_transition) div0_transition.end();
    			if (detaching && div2_transition) div2_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(149:4) {#if y >= 2200}",
    		ctx
    	});

    	return block;
    }

    // (169:0) {#if y >= 2800}
    function create_if_block_1(ctx) {
    	let div1;
    	let h1;
    	let h1_transition;
    	let t1;
    	let div0;
    	let div0_transition;
    	let current;
    	let each_value = /*teamMembers*/ ctx[6];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Meet the Team";
    			t1 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h1, "id", "teamText");
    			attr_dev(h1, "class", "whiteText svelte-8nnl08");
    			add_location(h1, file, 170, 4, 8332);
    			attr_dev(div0, "class", "row svelte-8nnl08");
    			add_location(div0, file, 171, 4, 8436);
    			attr_dev(div1, "id", "teamMembers");
    			attr_dev(div1, "class", "whiteText teamMembers svelte-8nnl08");
    			add_location(div1, file, 169, 2, 8275);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*teamMembers*/ 64) {
    				each_value = /*teamMembers*/ ctx[6];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { y: -30, duration: 700 }, true);
    				h1_transition.run(1);
    			});

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { y: -30, duration: 700 }, true);
    				div0_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fly, { y: -30, duration: 700 }, false);
    			h1_transition.run(0);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fly, { y: -30, duration: 700 }, false);
    			div0_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching && h1_transition) h1_transition.end();
    			destroy_each(each_blocks, detaching);
    			if (detaching && div0_transition) div0_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(169:0) {#if y >= 2800}",
    		ctx
    	});

    	return block;
    }

    // (173:6) {#each teamMembers as member, i}
    function create_each_block(ctx) {
    	let teammember;
    	let current;
    	const teammember_spread_levels = [{ id: /*i*/ ctx[10] }, /*member*/ ctx[8]];
    	let teammember_props = {};

    	for (let i = 0; i < teammember_spread_levels.length; i += 1) {
    		teammember_props = assign(teammember_props, teammember_spread_levels[i]);
    	}

    	teammember = new TeamMember({ props: teammember_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(teammember.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(teammember, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const teammember_changes = (dirty & /*teamMembers*/ 64)
    			? get_spread_update(teammember_spread_levels, [teammember_spread_levels[0], get_spread_object(/*member*/ ctx[8])])
    			: {};

    			teammember.$set(teammember_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(teammember.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(teammember.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(teammember, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(173:6) {#each teamMembers as member, i}",
    		ctx
    	});

    	return block;
    }

    // (182:0) {:else}
    function create_else_block(ctx) {
    	let footer;

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			attr_dev(footer, "class", "svelte-8nnl08");
    			add_location(footer, file, 182, 0, 8671);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(182:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (180:0) {#if y > 3200}
    function create_if_block(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			attr_dev(span, "id", "padding");
    			attr_dev(span, "class", "svelte-8nnl08");
    			add_location(span, file, 180, 0, 8636);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(180:0) {#if y > 3200}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let scrolling = false;

    	let clear_scrolling = () => {
    		scrolling = false;
    	};

    	let scrolling_timeout;
    	let link;
    	let t0;
    	let div0;
    	let t1;
    	let t2;
    	let div2;
    	let div1;
    	let t3;
    	let t4;
    	let br0;
    	let t5;
    	let br1;
    	let t6;
    	let t7;
    	let br2;
    	let t8;
    	let br3;
    	let t9;
    	let t10;
    	let br4;
    	let t11;
    	let t12;
    	let t13;
    	let t14;
    	let div3;
    	let p;
    	let t15;
    	let a0;
    	let t16;
    	let t17;
    	let a1;
    	let t18;
    	let t19;
    	let a2;
    	let t20;
    	let current;
    	let mounted;
    	let dispose;
    	add_render_callback(/*onwindowscroll*/ ctx[7]);
    	let if_block0 = /*visible*/ ctx[0] && create_if_block_9(ctx);
    	let if_block1 = /*y*/ ctx[1] >= 300 && create_if_block_8(ctx);
    	let if_block2 = /*y*/ ctx[1] >= 700 && create_if_block_7(ctx);
    	let if_block3 = /*y*/ ctx[1] >= 900 && create_if_block_6(ctx);
    	let if_block4 = /*y*/ ctx[1] >= 1400 && create_if_block_4(ctx);
    	let if_block5 = /*y*/ ctx[1] >= 1800 && create_if_block_3(ctx);
    	let if_block6 = /*y*/ ctx[1] >= 2200 && create_if_block_2(ctx);
    	let if_block7 = /*y*/ ctx[1] >= 2800 && create_if_block_1(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*y*/ ctx[1] > 3200) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block8 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			link = element("link");
    			t0 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			div2 = element("div");
    			div1 = element("div");
    			if (if_block2) if_block2.c();
    			t3 = space();
    			if (if_block3) if_block3.c();
    			t4 = space();
    			br0 = element("br");
    			t5 = space();
    			br1 = element("br");
    			t6 = space();
    			if (if_block4) if_block4.c();
    			t7 = space();
    			br2 = element("br");
    			t8 = space();
    			br3 = element("br");
    			t9 = space();
    			if (if_block5) if_block5.c();
    			t10 = space();
    			br4 = element("br");
    			t11 = space();
    			if (if_block6) if_block6.c();
    			t12 = space();
    			if (if_block7) if_block7.c();
    			t13 = space();
    			if_block8.c();
    			t14 = space();
    			div3 = element("div");
    			p = element("p");
    			t15 = text("Find out more at: ");
    			a0 = element("a");
    			t16 = text("Github");
    			t17 = text(" | \n  ");
    			a1 = element("a");
    			t18 = text("LinkedIn");
    			t19 = text(" | ");
    			a2 = element("a");
    			t20 = text("Medium");
    			attr_dev(link, "href", "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
    			attr_dev(link, "rel", "stylesheet");
    			add_location(link, file, 82, 2, 2723);
    			attr_dev(div0, "id", "header");
    			attr_dev(div0, "class", "svelte-8nnl08");
    			add_location(div0, file, 89, 0, 2988);
    			add_location(br0, file, 124, 6, 4924);
    			add_location(br1, file, 125, 6, 4935);
    			add_location(br2, file, 137, 6, 6252);
    			add_location(br3, file, 138, 6, 6263);
    			attr_dev(div1, "id", "features");
    			attr_dev(div1, "class", "svelte-8nnl08");
    			add_location(div1, file, 113, 2, 4266);
    			add_location(br4, file, 146, 6, 6841);
    			add_location(div2, file, 111, 0, 4257);
    			attr_dev(a0, "href", /*links*/ ctx[5].gh);
    			attr_dev(a0, "target", "_blank");
    			attr_dev(a0, "class", "svelte-8nnl08");
    			add_location(a0, file, 185, 59, 8755);
    			attr_dev(a1, "href", /*links*/ ctx[5].li);
    			attr_dev(a1, "target", "_blank");
    			attr_dev(a1, "class", "svelte-8nnl08");
    			add_location(a1, file, 186, 2, 8806);
    			attr_dev(a2, "href", /*links*/ ctx[5].med);
    			attr_dev(a2, "target", "_blank");
    			attr_dev(a2, "class", "svelte-8nnl08");
    			add_location(a2, file, 186, 53, 8857);
    			attr_dev(p, "id", "footerText");
    			attr_dev(p, "class", "svelte-8nnl08");
    			add_location(p, file, 185, 22, 8718);
    			attr_dev(div3, "id", "bottomLinks");
    			attr_dev(div3, "class", "svelte-8nnl08");
    			add_location(div3, file, 185, 0, 8696);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, link);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div0, anchor);
    			if (if_block0) if_block0.m(div0, null);
    			insert_dev(target, t1, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t3);
    			if (if_block3) if_block3.m(div1, null);
    			append_dev(div1, t4);
    			append_dev(div1, br0);
    			append_dev(div1, t5);
    			append_dev(div1, br1);
    			append_dev(div1, t6);
    			if (if_block4) if_block4.m(div1, null);
    			append_dev(div1, t7);
    			append_dev(div1, br2);
    			append_dev(div1, t8);
    			append_dev(div1, br3);
    			append_dev(div1, t9);
    			if (if_block5) if_block5.m(div1, null);
    			append_dev(div2, t10);
    			append_dev(div2, br4);
    			append_dev(div2, t11);
    			if (if_block6) if_block6.m(div2, null);
    			insert_dev(target, t12, anchor);
    			if (if_block7) if_block7.m(target, anchor);
    			insert_dev(target, t13, anchor);
    			if_block8.m(target, anchor);
    			insert_dev(target, t14, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, p);
    			append_dev(p, t15);
    			append_dev(p, a0);
    			append_dev(a0, t16);
    			append_dev(p, t17);
    			append_dev(p, a1);
    			append_dev(a1, t18);
    			append_dev(p, t19);
    			append_dev(p, a2);
    			append_dev(a2, t20);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window_1, "scroll", () => {
    					scrolling = true;
    					clearTimeout(scrolling_timeout);
    					scrolling_timeout = setTimeout_1(clear_scrolling, 100);
    					/*onwindowscroll*/ ctx[7]();
    				});

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*y*/ 2 && !scrolling) {
    				scrolling = true;
    				clearTimeout(scrolling_timeout);
    				scrollTo(window_1.pageXOffset, /*y*/ ctx[1]);
    				scrolling_timeout = setTimeout_1(clear_scrolling, 100);
    			}

    			if (/*visible*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*visible*/ 1) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_9(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*y*/ ctx[1] >= 300) {
    				if (if_block1) {
    					if (dirty & /*y*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_8(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(t2.parentNode, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*y*/ ctx[1] >= 700) {
    				if (if_block2) {
    					if (dirty & /*y*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_7(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, t3);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*y*/ ctx[1] >= 900) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);

    					if (dirty & /*y*/ 2) {
    						transition_in(if_block3, 1);
    					}
    				} else {
    					if_block3 = create_if_block_6(ctx);
    					if_block3.c();
    					transition_in(if_block3, 1);
    					if_block3.m(div1, t4);
    				}
    			} else if (if_block3) {
    				group_outros();

    				transition_out(if_block3, 1, 1, () => {
    					if_block3 = null;
    				});

    				check_outros();
    			}

    			if (/*y*/ ctx[1] >= 1400) {
    				if (if_block4) {
    					if_block4.p(ctx, dirty);

    					if (dirty & /*y*/ 2) {
    						transition_in(if_block4, 1);
    					}
    				} else {
    					if_block4 = create_if_block_4(ctx);
    					if_block4.c();
    					transition_in(if_block4, 1);
    					if_block4.m(div1, t7);
    				}
    			} else if (if_block4) {
    				group_outros();

    				transition_out(if_block4, 1, 1, () => {
    					if_block4 = null;
    				});

    				check_outros();
    			}

    			if (/*y*/ ctx[1] >= 1800) {
    				if (if_block5) {
    					if_block5.p(ctx, dirty);

    					if (dirty & /*y*/ 2) {
    						transition_in(if_block5, 1);
    					}
    				} else {
    					if_block5 = create_if_block_3(ctx);
    					if_block5.c();
    					transition_in(if_block5, 1);
    					if_block5.m(div1, null);
    				}
    			} else if (if_block5) {
    				group_outros();

    				transition_out(if_block5, 1, 1, () => {
    					if_block5 = null;
    				});

    				check_outros();
    			}

    			if (/*y*/ ctx[1] >= 2200) {
    				if (if_block6) {
    					if_block6.p(ctx, dirty);

    					if (dirty & /*y*/ 2) {
    						transition_in(if_block6, 1);
    					}
    				} else {
    					if_block6 = create_if_block_2(ctx);
    					if_block6.c();
    					transition_in(if_block6, 1);
    					if_block6.m(div2, null);
    				}
    			} else if (if_block6) {
    				group_outros();

    				transition_out(if_block6, 1, 1, () => {
    					if_block6 = null;
    				});

    				check_outros();
    			}

    			if (/*y*/ ctx[1] >= 2800) {
    				if (if_block7) {
    					if_block7.p(ctx, dirty);

    					if (dirty & /*y*/ 2) {
    						transition_in(if_block7, 1);
    					}
    				} else {
    					if_block7 = create_if_block_1(ctx);
    					if_block7.c();
    					transition_in(if_block7, 1);
    					if_block7.m(t13.parentNode, t13);
    				}
    			} else if (if_block7) {
    				group_outros();

    				transition_out(if_block7, 1, 1, () => {
    					if_block7 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block8.d(1);
    				if_block8 = current_block_type(ctx);

    				if (if_block8) {
    					if_block8.c();
    					if_block8.m(t14.parentNode, t14);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(if_block3);
    			transition_in(if_block4);
    			transition_in(if_block5);
    			transition_in(if_block6);
    			transition_in(if_block7);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(if_block3);
    			transition_out(if_block4);
    			transition_out(if_block5);
    			transition_out(if_block6);
    			transition_out(if_block7);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(link);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div0);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t1);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			if (if_block4) if_block4.d();
    			if (if_block5) if_block5.d();
    			if (if_block6) if_block6.d();
    			if (detaching) detach_dev(t12);
    			if (if_block7) if_block7.d(detaching);
    			if (detaching) detach_dev(t13);
    			if_block8.d(detaching);
    			if (detaching) detach_dev(t14);
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			dispose();
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
    	let visible = false;
    	let y;
    	const mediaQuery = window.matchMedia('(max-width: 456px)');

    	const logos = {
    		delorean: "../public/assets/logo(white).png",
    		webstore: "../public/assets/webstore-button.png",
    		github: "../public/assets/github_logo.png",
    		linkedin: "../public/assets/linkedin_logo.png",
    		oslabs: "../public/assets/OSLabs.png"
    	};

    	const gifs = {
    		captureState: "../public/assets/capture_state.gif",
    		connect: "../public/assets/connect.gif",
    		newMemory: "../public/assets/new_memory.gif",
    		timeTravel: "../public/assets/time_travel.gif"
    	};

    	const links = {
    		li: "https://www.linkedin.com/company/delorean-open-source/",
    		gh: "https://github.com/oslabs-beta/DeLorean",
    		med: "https://medium.com/@vantassel.sam/time-travel-debugging-in-svelte-with-delorean-26e04efe9474"
    	};

    	const teamMembers = [
    		{
    			name: "Albert Han",
    			bio: "A software engineer torn between calling LA or the Bay home with a passion for baseball, eating, and low-stakes poker.",
    			ghHandle: "alberthan1",
    			liHandle: "albert-han1",
    			imgSrc: "../public/assets/albert.jpg",
    			alt: "albert han",
    			imgColor: "rgb(131, 123, 118)"
    		},
    		{
    			name: "Aram Krakirian",
    			bio: "Born and raised LA boy with big love for coffee, beach volleyball, and live music.",
    			ghHandle: "aramkrakirian",
    			liHandle: "aram-krakirian",
    			imgSrc: "../public/assets/aram.jpg",
    			alt: "aram krakirian",
    			imgColor: "rgb(180, 174, 163)"
    		},
    		{
    			name: "Erick Maese",
    			bio: "A Los Angeles based software engineer with a passion for painting, gaming, and everything MCU.",
    			ghHandle: "erickmaese",
    			liHandle: "erickmaese",
    			imgSrc: "../public/assets/erick.jpg",
    			alt: "erick maese",
    			imgColor: "rgb(175, 177, 171)"
    		},
    		{
    			name: "Sam VanTassel",
    			bio: "LA guy from Minnesota by way of New Orleans. Big on board games, synthesizers, and Mardi Gras parading.",
    			ghHandle: "SamVanTassel",
    			liHandle: "samvantassel",
    			imgSrc: "../public/assets/sam.jpg",
    			alt: "sam vantassel",
    			imgColor: "rgb(246, 192, 130)"
    		},
    		{
    			name: "Trevor Leung",
    			bio: "Just an Aussie living in Los Angeles. Infatuated with Ted Talk riddles, scuba diving, and lollies.",
    			ghHandle: "trevleung",
    			liHandle: "trevleung",
    			imgSrc: "../public/assets/trevor.jpg",
    			alt: "trevor leung",
    			imgColor: "rgb(237, 237, 237)"
    		}
    	];

    	onMount(() => {
    		setTimeout(
    			() => {
    				$$invalidate(0, visible = true);
    			},
    			500
    		);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function onwindowscroll() {
    		$$invalidate(1, y = window_1.pageYOffset);
    	}

    	$$self.$capture_state = () => ({
    		fly,
    		onMount,
    		TeamMember,
    		visible,
    		y,
    		mediaQuery,
    		logos,
    		gifs,
    		links,
    		teamMembers
    	});

    	$$self.$inject_state = $$props => {
    		if ('visible' in $$props) $$invalidate(0, visible = $$props.visible);
    		if ('y' in $$props) $$invalidate(1, y = $$props.y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [visible, y, mediaQuery, logos, gifs, links, teamMembers, onwindowscroll];
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
