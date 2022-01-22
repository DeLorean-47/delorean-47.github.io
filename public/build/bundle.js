!function(){"use strict";function e(){}const t=e=>e;function n(e,t){for(const n in t)e[n]=t[n];return e}function s(e){return e()}function r(){return Object.create(null)}function o(e){e.forEach(s)}function a(e){return"function"==typeof e}function l(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let i;function c(e,t){return i||(i=document.createElement("a")),i.href=t,e===i.href}const u="undefined"!=typeof window;let d=u?()=>window.performance.now():()=>Date.now(),f=u?e=>requestAnimationFrame(e):e;const g=new Set;function m(e){g.forEach((t=>{t.c(e)||(g.delete(t),t.f())})),0!==g.size&&f(m)}function p(e,t){e.appendChild(t)}function h(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t&&t.host?t:e.ownerDocument}function b(e){const t=y("style");return function(e,t){p(e.head||e,t)}(h(e),t),t.sheet}function w(e,t,n){e.insertBefore(t,n||null)}function v(e){e.parentNode.removeChild(e)}function y(e){return document.createElement(e)}function $(e){return document.createTextNode(e)}function x(){return $(" ")}function k(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function _(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}function T(e,t,n,s){null===n?e.style.removeProperty(t):e.style.setProperty(t,n,s?"important":"")}const L=new Map;let C,S=0;function H(e,t,n,s,r,o,a,l=0){const i=16.666/s;let c="{\n";for(let e=0;e<=1;e+=i){const s=t+(n-t)*o(e);c+=100*e+`%{${a(s,1-s)}}\n`}const u=c+`100% {${a(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${l}`,f=h(e),{stylesheet:g,rules:m}=L.get(f)||function(e,t){const n={stylesheet:b(t),rules:{}};return L.set(e,n),n}(f,e);m[d]||(m[d]=!0,g.insertRule(`@keyframes ${d} ${u}`,g.cssRules.length));const p=e.style.animation||"";return e.style.animation=`${p?`${p}, `:""}${d} ${s}ms linear ${r}ms 1 both`,S+=1,d}function E(e,t){const n=(e.style.animation||"").split(", "),s=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),r=n.length-s.length;r&&(e.style.animation=s.join(", "),S-=r,S||f((()=>{S||(L.forEach((e=>{const{stylesheet:t}=e;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.rules={}})),L.clear())})))}function j(e){C=e}function M(e){(function(){if(!C)throw new Error("Function called outside component initialization");return C})().$$.on_mount.push(e)}const D=[],A=[],O=[],N=[],B=Promise.resolve();let R=!1;function P(e){O.push(e)}const I=new Set;let z,U=0;function F(){const e=C;do{for(;U<D.length;){const e=D[U];U++,j(e),G(e.$$)}for(j(null),D.length=0,U=0;A.length;)A.pop()();for(let e=0;e<O.length;e+=1){const t=O[e];I.has(t)||(I.add(t),t())}O.length=0}while(D.length);for(;N.length;)N.pop()();R=!1,I.clear(),j(e)}function G(e){if(null!==e.fragment){e.update(),o(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(P)}}function q(e,t,n){e.dispatchEvent(function(e,t,n=!1){const s=document.createEvent("CustomEvent");return s.initCustomEvent(e,n,!1,t),s}(`${t?"intro":"outro"}${n}`))}const V=new Set;let W;function J(){W={r:0,c:[],p:W}}function K(){W.r||o(W.c),W=W.p}function X(e,t){e&&e.i&&(V.delete(e),e.i(t))}function Y(e,t,n,s){if(e&&e.o){if(V.has(e))return;V.add(e),W.c.push((()=>{V.delete(e),s&&(n&&e.d(1),s())})),e.o(t)}}const Q={duration:0};function Z(n,s,r,l){let i=s(n,r),c=l?0:1,u=null,p=null,h=null;function b(){h&&E(n,h)}function w(e,t){const n=e.b-c;return t*=Math.abs(n),{a:c,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function v(s){const{delay:r=0,duration:a=300,easing:l=t,tick:v=e,css:y}=i||Q,$={start:d()+r,b:s};s||($.group=W,W.r+=1),u||p?p=$:(y&&(b(),h=H(n,c,s,a,r,l,y)),s&&v(0,1),u=w($,a),P((()=>q(n,s,"start"))),function(e){let t;0===g.size&&f(m),new Promise((n=>{g.add(t={c:e,f:n})}))}((e=>{if(p&&e>p.start&&(u=w(p,a),p=null,q(n,u.b,"start"),y&&(b(),h=H(n,c,u.b,u.duration,0,l,i.css))),u)if(e>=u.end)v(c=u.b,1-c),q(n,u.b,"end"),p||(u.b?b():--u.group.r||o(u.group.c)),u=null;else if(e>=u.start){const t=e-u.start;c=u.a+u.d*l(t/u.duration),v(c,1-c)}return!(!u&&!p)})))}return{run(e){a(i)?(z||(z=Promise.resolve(),z.then((()=>{z=null}))),z).then((()=>{i=i(),v(e)})):v(e)},end(){b(),u=p=null}}}const ee="undefined"!=typeof window?window:"undefined"!=typeof globalThis?globalThis:global;function te(e,t,n,r){const{fragment:l,on_mount:i,on_destroy:c,after_update:u}=e.$$;l&&l.m(t,n),r||P((()=>{const t=i.map(s).filter(a);c?c.push(...t):o(t),e.$$.on_mount=[]})),u.forEach(P)}function ne(e,t){const n=e.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function se(e,t){-1===e.$$.dirty[0]&&(D.push(e),R||(R=!0,B.then(F)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function re(t,n,s,a,l,i,c,u=[-1]){const d=C;j(t);const f=t.$$={fragment:null,ctx:null,props:i,update:e,not_equal:l,bound:r(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(n.context||(d?d.$$.context:[])),callbacks:r(),dirty:u,skip_bound:!1,root:n.target||d.$$.root};c&&c(f.root);let g=!1;if(f.ctx=s?s(t,n.props||{},((e,n,...s)=>{const r=s.length?s[0]:n;return f.ctx&&l(f.ctx[e],f.ctx[e]=r)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](r),g&&se(t,e)),n})):[],f.update(),g=!0,o(f.before_update),f.fragment=!!a&&a(f.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);f.fragment&&f.fragment.l(e),e.forEach(v)}else f.fragment&&f.fragment.c();n.intro&&X(t.$$.fragment),te(t,n.target,n.anchor,n.customElement),F()}j(d)}class oe{$destroy(){ne(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function ae(e){const t=e-1;return t*t*t+1}function le(e,{delay:t=0,duration:n=400,easing:s=ae,x:r=0,y:o=0,opacity:a=0}={}){const l=getComputedStyle(e),i=+l.opacity,c="none"===l.transform?"":l.transform,u=i*(1-a);return{delay:t,duration:n,easing:s,css:(e,t)=>`\n\t\t\ttransform: ${c} translate(${(1-e)*r}px, ${(1-e)*o}px);\n\t\t\topacity: ${i-u*t}`}}function ie(t){let n,s,r,o,a,l,i,u,d,f,g,m,h,b,L,C,S,H,E,j,M,D,A,O,N;return{c(){n=y("div"),s=y("div"),r=y("div"),o=y("img"),l=x(),i=y("div"),u=y("h2"),d=$(t[0]),f=x(),g=y("p"),g.textContent="Software Engineer",m=x(),h=y("p"),b=$(t[1]),L=x(),C=y("div"),S=y("a"),H=y("img"),M=x(),D=y("a"),A=y("img"),k(o,"class","picture svelte-1js8w3f"),c(o.src,a=t[2])||k(o,"src",a),k(o,"alt",t[3]),T(o,"width","100%"),k(o,"height","auto"),k(r,"class","imgWrapper svelte-1js8w3f"),T(r,"background-color",t[4]),k(g,"class","title"),k(h,"class","bio svelte-1js8w3f"),k(H,"class","logo svelte-1js8w3f"),c(H.src,E="../public/assets/github_logo.png")||k(H,"src","../public/assets/github_logo.png"),k(H,"alt",j=t[0]+" github link"),k(S,"href",t[5]),k(S,"target","_blank"),k(A,"class","logo svelte-1js8w3f"),c(A.src,O="../public/assets/linkedin_logo.png")||k(A,"src","../public/assets/linkedin_logo.png"),k(A,"alt",N=t[0]+" linkedin link"),k(D,"href",t[6]),k(D,"target","_blank"),k(C,"class","memberLogos svelte-1js8w3f"),k(i,"class","container"),k(s,"class","card svelte-1js8w3f"),k(n,"class","column svelte-1js8w3f")},m(e,t){w(e,n,t),p(n,s),p(s,r),p(r,o),p(s,l),p(s,i),p(i,u),p(u,d),p(i,f),p(i,g),p(i,m),p(i,h),p(h,b),p(i,L),p(i,C),p(C,S),p(S,H),p(C,M),p(C,D),p(D,A)},p(e,[t]){4&t&&!c(o.src,a=e[2])&&k(o,"src",a),8&t&&k(o,"alt",e[3]),16&t&&T(r,"background-color",e[4]),1&t&&_(d,e[0]),2&t&&_(b,e[1]),1&t&&j!==(j=e[0]+" github link")&&k(H,"alt",j),1&t&&N!==(N=e[0]+" linkedin link")&&k(A,"alt",N)},i:e,o:e,d(e){e&&v(n)}}}function ce(e,t,n){let{name:s}=t,{bio:r}=t,{ghHandle:o}=t,{liHandle:a}=t,{imgSrc:l}=t,{alt:i}=t,{imgColor:c}=t;const u=`https://github.com/${o}`,d=`https://linkedin.com/in/${a}`;return e.$$set=e=>{"name"in e&&n(0,s=e.name),"bio"in e&&n(1,r=e.bio),"ghHandle"in e&&n(7,o=e.ghHandle),"liHandle"in e&&n(8,a=e.liHandle),"imgSrc"in e&&n(2,l=e.imgSrc),"alt"in e&&n(3,i=e.alt),"imgColor"in e&&n(4,c=e.imgColor)},[s,r,l,i,c,u,d,o,a]}class ue extends oe{constructor(e){super(),re(this,e,ce,ie,l,{name:0,bio:1,ghHandle:7,liHandle:8,imgSrc:2,alt:3,imgColor:4})}}const{setTimeout:de}=ee;function fe(e,t,n){const s=e.slice();return s[7]=t[n],s[9]=n,s}function ge(t){let n,s,r,o,a,l,i,u,d,f,g,m,h,b,$,_;return{c(){n=y("div"),s=y("a"),r=y("img"),a=x(),l=y("img"),d=x(),f=y("br"),g=x(),m=y("a"),h=y("img"),c(r.src,o=t[2].oslabs)||k(r,"src",o),k(r,"alt","OSLabs"),T(r,"max-width","7.5em"),T(r,"max-height","auto"),k(s,"href","https://opensourcelabs.io/"),k(s,"class","svelte-1wgfs9r"),k(n,"class","oslabs svelte-1wgfs9r"),k(l,"id","logo"),k(l,"class","center svelte-1wgfs9r"),c(l.src,i=t[2].delorean)||k(l,"src",i),k(l,"alt","logo"),k(h,"class","center svelte-1wgfs9r"),k(h,"id","githubButton"),c(h.src,b=t[2].webstore)||k(h,"src",b),k(h,"alt","github-webstore-button"),k(m,"href",$=t[4].gh),k(m,"target","_blank"),k(m,"class","svelte-1wgfs9r")},m(e,t){w(e,n,t),p(n,s),p(s,r),w(e,a,t),w(e,l,t),w(e,d,t),w(e,f,t),w(e,g,t),w(e,m,t),p(m,h),_=!0},p:e,i(e){_||(P((()=>{u||(u=Z(l,le,{y:-50,duration:1600},!0)),u.run(1)})),_=!0)},o(e){u||(u=Z(l,le,{y:-50,duration:1600},!1)),u.run(0),_=!1},d(e){e&&v(n),e&&v(a),e&&v(l),e&&u&&u.end(),e&&v(d),e&&v(f),e&&v(g),e&&v(m)}}}function me(e){let t,n,s,r,o,a,l,i;return{c(){t=y("div"),n=y("h1"),n.innerHTML='Built for <span style="color: coral" class="svelte-1wgfs9r">devs</span>',r=x(),o=y("p"),o.innerHTML='Developed under tech accelerator, OS Labs, <span style="font-weight: 700; color: rgb(255, 50, 57)" class="svelte-1wgfs9r">DeLorean</span> is Svelte&#39;s first time-traveling debugger tool that allows you to seamlessly jump from state to state. DeLorean features a clean, minimal UI that is easily accessible within the Chrome Developer Tools panel. It displays the names of all variables within each stateful component rendered on the app. Each variable displays its value at the given point in time you are examining.',k(t,"class","mainContainer svelte-1wgfs9r")},m(e,s){w(e,t,s),p(t,n),p(t,r),p(t,o),i=!0},i(e){i||(P((()=>{s||(s=Z(n,le,{y:-30,duration:1500},!0)),s.run(1)})),P((()=>{a||(a=Z(o,le,{y:-30,duration:1500},!0)),a.run(1)})),P((()=>{l||(l=Z(t,le,{y:30,duration:700},!0)),l.run(1)})),i=!0)},o(e){s||(s=Z(n,le,{y:-30,duration:1500},!1)),s.run(0),a||(a=Z(o,le,{y:-30,duration:1500},!1)),a.run(0),l||(l=Z(t,le,{y:30,duration:700},!1)),l.run(0),i=!1},d(e){e&&v(t),e&&s&&s.end(),e&&a&&a.end(),e&&l&&l.end()}}}function pe(e){let t,n,s;return{c(){t=y("h1"),t.textContent="Features",k(t,"id","featuresTitle"),k(t,"class","whiteText svelte-1wgfs9r")},m(e,n){w(e,t,n),s=!0},i(e){s||(P((()=>{n||(n=Z(t,le,{y:-30,duration:700},!0)),n.run(1)})),s=!0)},o(e){n||(n=Z(t,le,{y:-30,duration:700},!1)),n.run(0),s=!1},d(e){e&&v(t),e&&n&&n.end()}}}function he(t){let n,s,r,o,a,l,i,u,d;return{c(){n=y("span"),s=y("p"),s.innerHTML='<strong class="svelte-1wgfs9r">Capture State</strong><br/><span class="svelte-1wgfs9r">As you make changes to your app, each component’s state at the time of the state change is stored in a snapshot and cached.</span>',o=x(),a=y("div"),l=y("img"),k(s,"class","feat featLeft svelte-1wgfs9r"),k(l,"class","gif svelte-1wgfs9r"),c(l.src,i=t[3].captureState)||k(l,"src",i),k(l,"alt","capturing-state"),k(a,"class","gifPlaceholder svelte-1wgfs9r"),k(n,"class","featureText svelte-1wgfs9r")},m(e,t){w(e,n,t),p(n,s),p(n,o),p(n,a),p(a,l),d=!0},p:e,i(e){d||(P((()=>{r||(r=Z(s,le,{x:30,duration:700},!0)),r.run(1)})),P((()=>{u||(u=Z(a,le,{x:-30,duration:700},!0)),u.run(1)})),d=!0)},o(e){r||(r=Z(s,le,{x:30,duration:700},!1)),r.run(0),u||(u=Z(a,le,{x:-30,duration:700},!1)),u.run(0),d=!1},d(e){e&&v(n),e&&r&&r.end(),e&&u&&u.end()}}}function be(t){let n,s,r,o,a,l,i,u,d,f;return{c(){n=y("span"),s=y("div"),r=y("div"),o=y("img"),i=x(),u=y("p"),u.innerHTML='<strong class="svelte-1wgfs9r">Time Travel</strong><br/><span class="svelte-1wgfs9r">Upon clicking a State button on<span style="font-weight: 700; color: rgb(255, 90, 57)" class="svelte-1wgfs9r">DeLorean</span>, you can see your application&#39;s state at that given snapshot, both in the DevTool as well as in the app, allowing for step-by-step examination of state change sequences.</span>',k(o,"class","gif svelte-1wgfs9r"),c(o.src,a=t[3].timeTravel)||k(o,"src",a),k(o,"alt","time-traveling"),k(r,"class","gifPlaceholder svelte-1wgfs9r"),k(s,"class","gifRight svelte-1wgfs9r"),k(u,"class","feat featRight svelte-1wgfs9r"),k(n,"class","featureText svelte-1wgfs9r")},m(e,t){w(e,n,t),p(n,s),p(s,r),p(r,o),p(n,i),p(n,u),f=!0},p:e,i(e){f||(P((()=>{l||(l=Z(r,le,{x:-30,duration:700},!0)),l.run(1)})),P((()=>{d||(d=Z(u,le,{x:30,duration:700},!0)),d.run(1)})),f=!0)},o(e){l||(l=Z(r,le,{x:-30,duration:700},!1)),l.run(0),d||(d=Z(u,le,{x:30,duration:700},!1)),d.run(0),f=!1},d(e){e&&v(n),e&&l&&l.end(),e&&d&&d.end()}}}function we(t){let n,s,r,o,a,l,i,u,d;return{c(){n=y("span"),s=y("p"),s.innerHTML='<strong class="svelte-1wgfs9r">New Branches</strong><br/><span class="svelte-1wgfs9r">When you change state while examining a previous state, <span style="font-weight: 700; color: rgb(255, 90, 57)" class="svelte-1wgfs9r">DeLorean</span> will simply create and track a new timeline in the app and Dev Tools panel.</span>',o=x(),a=y("div"),l=y("img"),k(s,"class","feat featLeft svelte-1wgfs9r"),k(l,"class","gif svelte-1wgfs9r"),c(l.src,i=t[3].newMemory)||k(l,"src",i),k(l,"alt","showing-UI"),k(a,"class","gifPlaceholder svelte-1wgfs9r"),k(n,"class","featureText svelte-1wgfs9r")},m(e,t){w(e,n,t),p(n,s),p(n,o),p(n,a),p(a,l),d=!0},p:e,i(e){d||(P((()=>{r||(r=Z(s,le,{x:30,duration:700},!0)),r.run(1)})),P((()=>{u||(u=Z(a,le,{x:-30,duration:700},!0)),u.run(1)})),d=!0)},o(e){r||(r=Z(s,le,{x:30,duration:700},!1)),r.run(0),u||(u=Z(a,le,{x:-30,duration:700},!1)),u.run(0),d=!1},d(e){e&&v(n),e&&r&&r.end(),e&&u&&u.end()}}}function ve(t){let n,s,r,o,a,l,i,c,u,d,f,g,m,h,b,_,L,C,S,H,E,j,M,D,A,O,N,B,R,I,z;return{c(){n=y("div"),s=y("div"),r=y("h1"),r.textContent="How to Get Started",a=x(),l=y("div"),i=y("strong"),i.textContent="Step 1:",c=$(" To install DeLorean, head to the \n          "),u=y("a"),d=$("DeLorean GitHub page"),g=$("\n          . If you're interested in learning more about how DeLorean works, feel free to clone the repo! Otherwise, just download the "),m=y("i"),m.textContent="chrome_extension",h=$(" folder and save it somewhere on your computer.\n          "),b=y("br"),_=x(),L=y("br"),C=x(),S=y("strong"),S.textContent="Step 2:",H=$(" Navigate to Chrome's extensions page. Ensure you are in developer mode by clicking the 'Developer Mode' switch in the top-right corner of the page. Click on 'Load Unpacked', and select the "),E=y("i"),E.textContent="chrome_extension",j=$(" folder downloaded earlier to add DeLorean to your extensions.\n          "),M=y("br"),D=x(),A=y("br"),O=x(),N=y("strong"),N.textContent="Step 3:",B=$(" Once your test app is up and running, open the Dev Tools panel and select DeLorean from the dropdown in the navbar. Then click Connect, and you should see your application's initial state loaded in the panel. Make some state changes and travel through time!"),k(i,"class","svelte-1wgfs9r"),T(u,"font-family","Raleway, Arial, Helvetica, sans"),T(u,"font-size","18px"),k(u,"href",f=t[4].gh),k(u,"target","_blank"),k(u,"class","svelte-1wgfs9r"),k(S,"class","svelte-1wgfs9r"),k(N,"class","svelte-1wgfs9r"),k(l,"id","steps"),k(l,"class","svelte-1wgfs9r"),k(s,"id","getStarted"),k(s,"class","svelte-1wgfs9r"),k(n,"id","getStartedBackground"),k(n,"class","svelte-1wgfs9r")},m(e,t){w(e,n,t),p(n,s),p(s,r),p(s,a),p(s,l),p(l,i),p(l,c),p(l,u),p(u,d),p(l,g),p(l,m),p(l,h),p(l,b),p(l,_),p(l,L),p(l,C),p(l,S),p(l,H),p(l,E),p(l,j),p(l,M),p(l,D),p(l,A),p(l,O),p(l,N),p(l,B),z=!0},p:e,i(e){z||(P((()=>{o||(o=Z(r,le,{y:-30,duration:1500},!0)),o.run(1)})),P((()=>{R||(R=Z(l,le,{y:30,duration:1500},!0)),R.run(1)})),P((()=>{I||(I=Z(n,le,{y:-30,duration:700},!0)),I.run(1)})),z=!0)},o(e){o||(o=Z(r,le,{y:-30,duration:1500},!1)),o.run(0),R||(R=Z(l,le,{y:30,duration:1500},!1)),R.run(0),I||(I=Z(n,le,{y:-30,duration:700},!1)),I.run(0),z=!1},d(e){e&&v(n),e&&o&&o.end(),e&&R&&R.end(),e&&I&&I.end()}}}function ye(e){let t,n,s,r,o,a,l,i=e[5],c=[];for(let t=0;t<i.length;t+=1)c[t]=$e(fe(e,i,t));const u=e=>Y(c[e],1,1,(()=>{c[e]=null}));return{c(){t=y("div"),n=y("h1"),n.textContent="Meet the Team",r=x(),o=y("div");for(let e=0;e<c.length;e+=1)c[e].c();k(n,"id","teamText"),k(n,"class","whiteText svelte-1wgfs9r"),k(o,"class","row svelte-1wgfs9r"),k(t,"id","teamMembers"),k(t,"class","whiteText teamMembers svelte-1wgfs9r")},m(e,s){w(e,t,s),p(t,n),p(t,r),p(t,o);for(let e=0;e<c.length;e+=1)c[e].m(o,null);l=!0},p(e,t){if(32&t){let n;for(i=e[5],n=0;n<i.length;n+=1){const s=fe(e,i,n);c[n]?(c[n].p(s,t),X(c[n],1)):(c[n]=$e(s),c[n].c(),X(c[n],1),c[n].m(o,null))}for(J(),n=i.length;n<c.length;n+=1)u(n);K()}},i(e){if(!l){P((()=>{s||(s=Z(n,le,{y:-30,duration:700},!0)),s.run(1)}));for(let e=0;e<i.length;e+=1)X(c[e]);P((()=>{a||(a=Z(o,le,{y:-30,duration:700},!0)),a.run(1)})),l=!0}},o(e){s||(s=Z(n,le,{y:-30,duration:700},!1)),s.run(0),c=c.filter(Boolean);for(let e=0;e<c.length;e+=1)Y(c[e]);a||(a=Z(o,le,{y:-30,duration:700},!1)),a.run(0),l=!1},d(e){e&&v(t),e&&s&&s.end(),function(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}(c,e),e&&a&&a.end()}}}function $e(e){let t,s;const r=[{id:e[9]},e[7]];let o={};for(let e=0;e<r.length;e+=1)o=n(o,r[e]);return t=new ue({props:o}),{c(){var e;(e=t.$$.fragment)&&e.c()},m(e,n){te(t,e,n),s=!0},p(e,n){const s=32&n?function(e,t){const n={},s={},r={$$scope:1};let o=e.length;for(;o--;){const a=e[o],l=t[o];if(l){for(const e in a)e in l||(s[e]=1);for(const e in l)r[e]||(n[e]=l[e],r[e]=1);e[o]=l}else for(const e in a)r[e]=1}for(const e in s)e in n||(n[e]=void 0);return n}(r,[r[0],(o=e[7],"object"==typeof o&&null!==o?o:{})]):{};var o;t.$set(s)},i(e){s||(X(t.$$.fragment,e),s=!0)},o(e){Y(t.$$.fragment,e),s=!1},d(e){ne(t,e)}}}function xe(e){let t;return{c(){t=y("footer"),k(t,"class","svelte-1wgfs9r")},m(e,n){w(e,t,n)},d(e){e&&v(t)}}}function ke(e){let t;return{c(){t=y("span"),k(t,"id","padding"),k(t,"class","svelte-1wgfs9r")},m(e,n){w(e,t,n)},d(e){e&&v(t)}}}function _e(e){let t,n,s,r,o,a,l,i,c,u,d,f,g,m,h,b,_,T,L,C,S,H,E,j,M,D,A,O,N,B,R,I,z,U,F,G,q,V,W,Q=!1,Z=()=>{Q=!1};P(e[6]);let ee=e[0]&&ge(e),te=e[1]>=300&&me(),ne=e[1]>=700&&pe(),se=e[1]>=900&&he(e),re=e[1]>=1400&&be(e),oe=e[1]>=1800&&we(e),ae=e[1]>=2200&&ve(e),le=e[1]>=2800&&ye(e);function ie(e,t){return e[1]>3200?ke:xe}let ce=ie(e),ue=ce(e);return{c(){n=y("link"),s=x(),r=y("div"),ee&&ee.c(),o=x(),te&&te.c(),a=x(),l=y("div"),i=y("div"),ne&&ne.c(),c=x(),se&&se.c(),u=x(),d=y("br"),f=x(),g=y("br"),m=x(),re&&re.c(),h=x(),b=y("br"),_=x(),T=y("br"),L=x(),oe&&oe.c(),C=x(),S=y("br"),H=x(),ae&&ae.c(),E=x(),le&&le.c(),j=x(),ue.c(),M=x(),D=y("div"),A=y("p"),O=$("Find out more at: "),N=y("a"),B=$("Github"),R=$(" | \n  "),I=y("a"),z=$("LinkedIn"),U=$(" | "),F=y("a"),G=$("Medium"),k(n,"href","https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"),k(n,"rel","stylesheet"),k(r,"id","header"),k(r,"class","svelte-1wgfs9r"),k(i,"id","features"),k(i,"class","svelte-1wgfs9r"),k(N,"href",e[4].gh),k(N,"target","_blank"),k(N,"class","svelte-1wgfs9r"),k(I,"href",e[4].li),k(I,"target","_blank"),k(I,"class","svelte-1wgfs9r"),k(F,"href",e[4].med),k(F,"target","_blank"),k(F,"class","svelte-1wgfs9r"),k(A,"id","footerText"),k(A,"class","svelte-1wgfs9r"),k(D,"id","bottomLinks"),k(D,"class","svelte-1wgfs9r")},m(v,y){var $,x,k,P;p(document.head,n),w(v,s,y),w(v,r,y),ee&&ee.m(r,null),w(v,o,y),te&&te.m(v,y),w(v,a,y),w(v,l,y),p(l,i),ne&&ne.m(i,null),p(i,c),se&&se.m(i,null),p(i,u),p(i,d),p(i,f),p(i,g),p(i,m),re&&re.m(i,null),p(i,h),p(i,b),p(i,_),p(i,T),p(i,L),oe&&oe.m(i,null),p(l,C),p(l,S),p(l,H),ae&&ae.m(l,null),w(v,E,y),le&&le.m(v,y),w(v,j,y),ue.m(v,y),w(v,M,y),w(v,D,y),p(D,A),p(A,O),p(A,N),p(N,B),p(A,R),p(A,I),p(I,z),p(A,U),p(A,F),p(F,G),q=!0,V||($=window,x="scroll",k=()=>{Q=!0,clearTimeout(t),t=de(Z,100),e[6]()},$.addEventListener(x,k,P),W=()=>$.removeEventListener(x,k,P),V=!0)},p(e,[n]){2&n&&!Q&&(Q=!0,clearTimeout(t),scrollTo(window.pageXOffset,e[1]),t=de(Z,100)),e[0]?ee?(ee.p(e,n),1&n&&X(ee,1)):(ee=ge(e),ee.c(),X(ee,1),ee.m(r,null)):ee&&(J(),Y(ee,1,1,(()=>{ee=null})),K()),e[1]>=300?te?2&n&&X(te,1):(te=me(),te.c(),X(te,1),te.m(a.parentNode,a)):te&&(J(),Y(te,1,1,(()=>{te=null})),K()),e[1]>=700?ne?2&n&&X(ne,1):(ne=pe(),ne.c(),X(ne,1),ne.m(i,c)):ne&&(J(),Y(ne,1,1,(()=>{ne=null})),K()),e[1]>=900?se?(se.p(e,n),2&n&&X(se,1)):(se=he(e),se.c(),X(se,1),se.m(i,u)):se&&(J(),Y(se,1,1,(()=>{se=null})),K()),e[1]>=1400?re?(re.p(e,n),2&n&&X(re,1)):(re=be(e),re.c(),X(re,1),re.m(i,h)):re&&(J(),Y(re,1,1,(()=>{re=null})),K()),e[1]>=1800?oe?(oe.p(e,n),2&n&&X(oe,1)):(oe=we(e),oe.c(),X(oe,1),oe.m(i,null)):oe&&(J(),Y(oe,1,1,(()=>{oe=null})),K()),e[1]>=2200?ae?(ae.p(e,n),2&n&&X(ae,1)):(ae=ve(e),ae.c(),X(ae,1),ae.m(l,null)):ae&&(J(),Y(ae,1,1,(()=>{ae=null})),K()),e[1]>=2800?le?(le.p(e,n),2&n&&X(le,1)):(le=ye(e),le.c(),X(le,1),le.m(j.parentNode,j)):le&&(J(),Y(le,1,1,(()=>{le=null})),K()),ce!==(ce=ie(e))&&(ue.d(1),ue=ce(e),ue&&(ue.c(),ue.m(M.parentNode,M)))},i(e){q||(X(ee),X(te),X(ne),X(se),X(re),X(oe),X(ae),X(le),q=!0)},o(e){Y(ee),Y(te),Y(ne),Y(se),Y(re),Y(oe),Y(ae),Y(le),q=!1},d(e){v(n),e&&v(s),e&&v(r),ee&&ee.d(),e&&v(o),te&&te.d(e),e&&v(a),e&&v(l),ne&&ne.d(),se&&se.d(),re&&re.d(),oe&&oe.d(),ae&&ae.d(),e&&v(E),le&&le.d(e),e&&v(j),ue.d(e),e&&v(M),e&&v(D),V=!1,W()}}}function Te(e,t,n){let s,r=!1;return M((()=>{setTimeout((()=>{n(0,r=!0)}),500)})),[r,s,{delorean:"../public/assets/logo(white).png",webstore:"../public/assets/webstore-button.png",github:"../public/assets/github_logo.png",linkedin:"../public/assets/linkedin_logo.png",oslabs:"../public/assets/OSLabs.png"},{captureState:"../public/assets/capture_state.gif",connect:"../public/assets/connect.gif",newMemory:"../public/assets/new_memory.gif",timeTravel:"../public/assets/time_travel.gif"},{li:"https://www.linkedin.com/company/delorean-open-source/",gh:"https://github.com/oslabs-beta/DeLorean",med:"https://medium.com/@vantassel.sam/time-travel-debugging-in-svelte-with-delorean-26e04efe9474"},[{name:"Albert Han",bio:"A software engineer torn between calling LA or the Bay home with a passion for baseball, eating, and low-stakes poker.",ghHandle:"alberthan1",liHandle:"albert-han1",imgSrc:"../public/assets/albert.jpg",alt:"albert han",imgColor:"rgb(131, 123, 118)"},{name:"Aram Krakirian",bio:"Born and raised LA boy with big love for coffee, beach volleyball, and live music.",ghHandle:"aramkrakirian",liHandle:"aram-krakirian",imgSrc:"../public/assets/aram.jpg",alt:"aram krakirian",imgColor:"rgb(180, 174, 163)"},{name:"Erick Maese",bio:"A Los Angeles based software engineer with a passion for painting, gaming, and everything MCU.",ghHandle:"erickmaese",liHandle:"erickmaese",imgSrc:"../public/assets/erick.jpg",alt:"erick maese",imgColor:"rgb(175, 177, 171)"},{name:"Sam VanTassel",bio:"LA guy from Minnesota by way of New Orleans. Big on board games, synthesizers, and Mardi Gras parading.",ghHandle:"SamVanTassel",liHandle:"samvantassel",imgSrc:"../public/assets/sam.jpg",alt:"sam vantassel",imgColor:"rgb(246, 192, 130)"},{name:"Trevor Leung",bio:"Just an Aussie living in Los Angeles. Infatuated with Ted Talk riddles, scuba diving, and lollies.",ghHandle:"trevleung",liHandle:"trevleung",imgSrc:"../public/assets/trevor.jpg",alt:"trevor leung",imgColor:"rgb(237, 237, 237)"}],function(){n(1,s=window.pageYOffset)}]}new class extends oe{constructor(e){super(),re(this,e,Te,_e,l,{})}}({target:document.getElementById("root")})}();
