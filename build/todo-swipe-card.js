const t="3.5.0",i="none",e="alpha_asc",o="alpha_desc",n="duedate_asc",s="duedate_desc",r=(t,i)=>{},a=globalThis,d=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,c=Symbol(),h=new WeakMap;let l=class t{constructor(t,i,e){if(this.i=!0,e!==c)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=i}get styleSheet(){let t=this.o;const i=this.t;if(d&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=h.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&h.set(i,t))}return t}toString(){return this.cssText}};const p=(t,...i)=>{const e=1===t.length?t[0]:i.reduce((i,e,o)=>i+(t=>{if(!0===t.i)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(e)+t[o+1],t[0]);return new l(e,t,c)},u=d?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let i="";for(const e of t.cssRules)i+=e.cssText;return(t=>new l("string"==typeof t?t:t+"",void 0,c))(i)})(t):t,{is:g,defineProperty:m,getOwnPropertyDescriptor:f,getOwnPropertyNames:v,getOwnPropertySymbols:b,getPrototypeOf:w}=Object,x=globalThis,y=x.trustedTypes,k=y?y.emptyScript:"",_=x.reactiveElementPolyfillSupport,$=(t,i)=>t,z={toAttribute(t,i){switch(i){case Boolean:t=t?k:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,i){let e=t;switch(i){case Boolean:e=null!==t;break;case Number:e=null===t?null:Number(t);break;case Object:case Array:try{e=JSON.parse(t)}catch(t){e=null}}return e}},C=(t,i)=>!g(t,i),S={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:C};Symbol.metadata??=Symbol("metadata"),x.litPropertyMetadata??=new WeakMap;let T=class t extends HTMLElement{static addInitializer(t){this.m(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.v&&[...this.v.keys()]}static createProperty(t,i=S){if(i.state&&(i.attribute=!1),this.m(),this.prototype.hasOwnProperty(t)&&((i=Object.create(i)).wrapped=!0),this.elementProperties.set(t,i),!i.noAccessor){const e=Symbol(),o=this.getPropertyDescriptor(t,e,i);void 0!==o&&m(this.prototype,t,o)}}static getPropertyDescriptor(t,i,e){const{get:o,set:n}=f(this.prototype,t)??{get(){return this[i]},set(t){this[i]=t}};return{get:o,set(i){const s=o?.call(this);n?.call(this,i),this.requestUpdate(t,s,e)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??S}static m(){if(this.hasOwnProperty($("elementProperties")))return;const t=w(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this.m(),this.hasOwnProperty($("properties"))){const t=this.properties,i=[...v(t),...b(t)];for(const e of i)this.createProperty(e,t[e])}const t=this[Symbol.metadata];if(null!==t){const i=litPropertyMetadata.get(t);if(void 0!==i)for(const[t,e]of i)this.elementProperties.set(t,e)}this.v=new Map;for(const[t,i]of this.elementProperties){const e=this._(t,i);void 0!==e&&this.v.set(e,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const i=[];if(Array.isArray(t)){const e=new Set(t.flat(1/0).reverse());for(const t of e)i.unshift(u(t))}else void 0!==t&&i.push(u(t));return i}static _(t,i){const e=i.attribute;return!1===e?void 0:"string"==typeof e?e:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this.S=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.D=null,this.A()}A(){this.M=new Promise(t=>this.enableUpdating=t),this.N=new Map,this.I(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.L??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this.L?.delete(t)}I(){const t=new Map,i=this.constructor.elementProperties;for(const e of i.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);t.size>0&&(this.S=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(d)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of i){const i=document.createElement("style"),o=a.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=e.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.L?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.L?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,i,e){this.H(t,e)}V(t,i){const e=this.constructor.elementProperties.get(t),o=this.constructor._(t,e);if(void 0!==o&&!0===e.reflect){const n=(void 0!==e.converter?.toAttribute?e.converter:z).toAttribute(i,e.type);this.D=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this.D=null}}H(t,i){const e=this.constructor,o=e.v.get(t);if(void 0!==o&&this.D!==o){const t=e.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:z;this.D=o;const s=n.fromAttribute(i,t.type);this[o]=s??this.P?.get(o)??s,this.D=null}}requestUpdate(t,i,e){if(void 0!==t){const o=this.constructor,n=this[t];if(e??=o.getPropertyOptions(t),!((e.hasChanged??C)(n,i)||e.useDefault&&e.reflect&&n===this.P?.get(t)&&!this.hasAttribute(o._(t,e))))return;this.C(t,i,e)}!1===this.isUpdatePending&&(this.M=this.F())}C(t,i,{useDefault:e,reflect:o,wrapped:n},s){e&&!(this.P??=new Map).has(t)&&(this.P.set(t,s??i??this[t]),!0!==n||void 0!==s)||(this.N.has(t)||(this.hasUpdated||e||(i=void 0),this.N.set(t,i)),!0===o&&this.D!==t&&(this.R??=new Set).add(t))}async F(){this.isUpdatePending=!0;try{await this.M}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.S){for(const[t,i]of this.S)this[t]=i;this.S=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[i,e]of t){const{wrapped:t}=e,o=this[i];!0!==t||this.N.has(i)||void 0===o||this.C(i,void 0,e,o)}}let t=!1;const i=this.N;try{t=this.shouldUpdate(i),t?(this.willUpdate(i),this.L?.forEach(t=>t.hostUpdate?.()),this.update(i)):this.J()}catch(i){throw t=!1,this.J(),i}t&&this.U(i)}willUpdate(t){}U(t){this.L?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}J(){this.N=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.M}shouldUpdate(t){return!0}update(t){this.R&&=this.R.forEach(t=>this.V(t,this[t])),this.J()}updated(t){}firstUpdated(t){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[$("elementProperties")]=new Map,T[$("finalized")]=new Map,_?.({ReactiveElement:T}),(x.reactiveElementVersions??=[]).push("2.1.1");const E=globalThis,D=E.trustedTypes,A=D?D.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+N,I=`<${O}>`,j=document,L=()=>j.createComment(""),H=t=>null===t||"object"!=typeof t&&"function"!=typeof t,V=Array.isArray,P="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,J=/>/g,U=RegExp(`>|${P}(?:([^\\s"'>=/]+)(${P}*=${P}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,Z=/"/g,q=/^(?:script|style|textarea|title)$/i,W=(t=>(i,...e)=>({B:t,strings:i,values:e}))(1),X=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,Y=j.createTreeWalker(j,129);function Q(t,i){if(!V(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(i):i}const tt=(t,i)=>{const e=t.length-1,o=[];let n,s=2===i?"<svg>":3===i?"<math>":"",r=F;for(let i=0;i<e;i++){const e=t[i];let a,d,c=-1,h=0;for(;h<e.length&&(r.lastIndex=h,d=r.exec(e),null!==d);)h=r.lastIndex,r===F?"!--"===d[1]?r=R:void 0!==d[1]?r=J:void 0!==d[2]?(q.test(d[2])&&(n=RegExp("</"+d[2],"g")),r=U):void 0!==d[3]&&(r=U):r===U?">"===d[0]?(r=n??F,c=-1):void 0===d[1]?c=-2:(c=r.lastIndex-d[2].length,a=d[1],r=void 0===d[3]?U:'"'===d[3]?Z:B):r===Z||r===B?r=U:r===R||r===J?r=F:(r=U,n=void 0);const l=r===U&&t[i+1].startsWith("/>")?" ":"";s+=r===F?e+I:c>=0?(o.push(a),e.slice(0,c)+M+e.slice(c)+N+l):e+N+(-2===c?i:l)}return[Q(t,s+(t[e]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class it{constructor({strings:t,B:i},e){let o;this.parts=[];let n=0,s=0;const r=t.length-1,a=this.parts,[d,c]=tt(t,i);if(this.el=it.createElement(d,e),Y.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=Y.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(M)){const i=c[s++],e=o.getAttribute(t).split(N),r=/([.?@])?(.*)/.exec(i);a.push({type:1,index:n,name:r[2],strings:e,ctor:"."===r[1]?rt:"?"===r[1]?at:"@"===r[1]?dt:st}),o.removeAttribute(t)}else t.startsWith(N)&&(a.push({type:6,index:n}),o.removeAttribute(t));if(q.test(o.tagName)){const t=o.textContent.split(N),i=t.length-1;if(i>0){o.textContent=D?D.emptyScript:"";for(let e=0;e<i;e++)o.append(t[e],L()),Y.nextNode(),a.push({type:2,index:++n});o.append(t[i],L())}}}else if(8===o.nodeType)if(o.data===O)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(N,t+1));)a.push({type:7,index:n}),t+=N.length-1}n++}}static createElement(t,i){const e=j.createElement("template");return e.innerHTML=t,e}}function et(t,i,e=t,o){if(i===X)return i;let n=void 0!==o?e.Z?.[o]:e.q;const s=H(i)?void 0:i.W;return n?.constructor!==s&&(n?.X?.(!1),void 0===s?n=void 0:(n=new s(t),n.K(t,e,o)),void 0!==o?(e.Z??=[])[o]=n:e.q=n),void 0!==n&&(i=et(t,n.G(t,i.values),n,o)),i}class ot{constructor(t,i){this.Y=[],this.tt=void 0,this.it=t,this.et=i}get parentNode(){return this.et.parentNode}get ot(){return this.et.ot}u(t){const{el:{content:i},parts:e}=this.it,o=(t?.creationScope??j).importNode(i,!0);Y.currentNode=o;let n=Y.nextNode(),s=0,r=0,a=e[0];for(;void 0!==a;){if(s===a.index){let i;2===a.type?i=new nt(n,n.nextSibling,this,t):1===a.type?i=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(i=new ct(n,this,t)),this.Y.push(i),a=e[++r]}s!==a?.index&&(n=Y.nextNode(),s++)}return Y.currentNode=j,o}p(t){let i=0;for(const e of this.Y)void 0!==e&&(void 0!==e.strings?(e.nt(t,e,i),i+=e.strings.length-2):e.nt(t[i])),i++}}class nt{get ot(){return this.et?.ot??this.st}constructor(t,i,e,o){this.type=2,this.rt=K,this.tt=void 0,this.dt=t,this.ct=i,this.et=e,this.options=o,this.st=o?.isConnected??!0}get parentNode(){let t=this.dt.parentNode;const i=this.et;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this.dt}get endNode(){return this.ct}nt(t,i=this){t=et(this,t,i),H(t)?t===K||null==t||""===t?(this.rt!==K&&this.ht(),this.rt=K):t!==this.rt&&t!==X&&this.lt(t):void 0!==t.B?this.$(t):void 0!==t.nodeType?this.T(t):(t=>V(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this.lt(t)}O(t){return this.dt.parentNode.insertBefore(t,this.ct)}T(t){this.rt!==t&&(this.ht(),this.rt=this.O(t))}lt(t){this.rt!==K&&H(this.rt)?this.dt.nextSibling.data=t:this.T(j.createTextNode(t)),this.rt=t}$(t){const{values:i,B:e}=t,o="number"==typeof e?this.ut(t):(void 0===e.el&&(e.el=it.createElement(Q(e.h,e.h[0]),this.options)),e);if(this.rt?.it===o)this.rt.p(i);else{const t=new ot(o,this),e=t.u(this.options);t.p(i),this.T(e),this.rt=t}}ut(t){let i=G.get(t.strings);return void 0===i&&G.set(t.strings,i=new it(t)),i}k(t){V(this.rt)||(this.rt=[],this.ht());const i=this.rt;let e,o=0;for(const n of t)o===i.length?i.push(e=new nt(this.O(L()),this.O(L()),this,this.options)):e=i[o],e.nt(n),o++;o<i.length&&(this.ht(e&&e.ct.nextSibling,o),i.length=o)}ht(t=this.dt.nextSibling,i){for(this.gt?.(!1,!0,i);t!==this.ct;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){void 0===this.et&&(this.st=t,this.gt?.(t))}}class st{get tagName(){return this.element.tagName}get ot(){return this.et.ot}constructor(t,i,e,o,n){this.type=1,this.rt=K,this.tt=void 0,this.element=t,this.name=i,this.et=o,this.options=n,e.length>2||""!==e[0]||""!==e[1]?(this.rt=Array(e.length-1).fill(new String),this.strings=e):this.rt=K}nt(t,i=this,e,o){const n=this.strings;let s=!1;if(void 0===n)t=et(this,t,i,0),s=!H(t)||t!==this.rt&&t!==X,s&&(this.rt=t);else{const o=t;let r,a;for(t=n[0],r=0;r<n.length-1;r++)a=et(this,o[e+r],i,r),a===X&&(a=this.rt[r]),s||=!H(a)||a!==this.rt[r],a===K?t=K:t!==K&&(t+=(a??"")+n[r+1]),this.rt[r]=a}s&&!o&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class rt extends st{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class at extends st{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class dt extends st{constructor(t,i,e,o,n){super(t,i,e,o,n),this.type=5}nt(t,i=this){if((t=et(this,t,i,0)??K)===X)return;const e=this.rt,o=t===K&&e!==K||t.capture!==e.capture||t.once!==e.once||t.passive!==e.passive,n=t!==K&&(e===K||o);o&&this.element.removeEventListener(this.name,this,e),n&&this.element.addEventListener(this.name,this,t),this.rt=t}handleEvent(t){"function"==typeof this.rt?this.rt.call(this.options?.host??this.element,t):this.rt.handleEvent(t)}}class ct{constructor(t,i,e){this.element=t,this.type=6,this.tt=void 0,this.et=i,this.options=e}get ot(){return this.et.ot}nt(t){et(this,t)}}const ht=E.litHtmlPolyfillSupport;ht?.(it,nt),(E.litHtmlVersions??=[]).push("3.3.1");const lt=globalThis;class pt extends T{constructor(){super(...arguments),this.renderOptions={host:this},this.ft=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.ft=((t,i,e)=>{const o=e?.renderBefore??i;let n=o.vt;if(void 0===n){const t=e?.renderBefore??null;o.vt=n=new nt(i.insertBefore(L(),t),t,void 0,e??{})}return n.nt(t),n})(i,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.ft?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.ft?.setConnected(!1)}render(){return X}}pt.bt=!0,pt.finalized=!0,lt.litElementHydrateSupport?.({LitElement:pt});const ut=lt.litElementPolyfillSupport;ut?.({LitElement:pt}),(lt.litElementVersions??=[]).push("4.2.1");function gt(t,i,e){let o="mdi:format-list-checks";if("object"==typeof t&&t.icon)o=t.icon;else if(e&&e.states[i]){const t=e.states[i].attributes.icon;t&&(o=t)}const n=document.createElement("ha-icon");return n.className="todo-icon",n.icon=o,n}function mt(t){const i=document.createElement("div"),e=function(t){if(!t)return null;try{if(t.includes("T"))return new Date(t);{const i=new Date(`${t}T00:00:00`);return i.setHours(23,59,59,999),isNaN(i.getTime())?null:i}}catch(t){return null}}(t),o=new Date,n=e&&e<o;i.className="todo-due "+(n?"overdue":"");const s=document.createElement("ha-svg-icon");if(s.className="todo-due-icon",s.path="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z",i.appendChild(s),e){if(!t.includes("T")&&(r=new Date,a=e,r.getFullYear()===a.getFullYear()&&r.getMonth()===a.getMonth()&&r.getDate()===a.getDate())){const t=document.createElement("span");t.textContent="Today",i.appendChild(t)}else{if(Math.abs(e.getTime()-o.getTime())<36e5){const t=document.createElement("span");i.appendChild(t);const o=()=>{const o=new Date,n=e.getTime()-o.getTime(),s=n<0;if(i.classList.toggle("overdue",s),Math.abs(n)<6e4){const i=Math.round(Math.abs(n)/1e3);t.textContent=i<5?"now":n<0?`${i} seconds ago`:`in ${i} seconds`}else{const i=Math.round(Math.abs(n)/6e4);t.textContent=n<0?`${i} minute${1!==i?"s":""} ago`:`in ${i} minute${1!==i?"s":""}`}};o();const n=setInterval(o,1e3),s=new MutationObserver(t=>{t.forEach(t=>{"childList"===t.type&&t.removedNodes.forEach(t=>{(t===i||t.contains?.(i))&&(clearInterval(n),s.disconnect())})})});i.parentNode&&s.observe(i.parentNode,{childList:!0,subtree:!0})}else{const t=document.createElement("ha-relative-time");t.setAttribute("capitalize",""),t.datetime=e,i.appendChild(t)}}}else{const e=document.createElement("span");e.textContent=t,i.appendChild(e)}var r,a;return i}function ft(t,i,e){setTimeout(()=>{!function(t,i,e){let o;o=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .add-textfield input"):t.querySelector(".add-textfield input");if(!o)return;if(e.wt.has(i)){const t=e.wt.get(i);t.inputHandler&&o.removeEventListener("input",t.inputHandler)}const n=o=>function(t,i,e,o){const n=t.target.value;o.xt=n,""===n.trim()?o.yt.delete(i):o.yt.set(i,n);o.cardBuilder.updateNativeTodoCard(e,i)}(o,i,t,e);o.addEventListener("input",n),e.wt.set(i,{inputHandler:n,inputElement:o})}(t,i,e)},100)}function vt(t){if(!t.paginationElement)return;let i="";if(t.kt.card_mod&&t.kt.card_mod.style&&"string"==typeof t.kt.card_mod.style){const e=t.kt.card_mod.style;["--todo-swipe-card-pagination-dot-inactive-color","--todo-swipe-card-pagination-dot-active-color","--todo-swipe-card-pagination-dot-size","--todo-swipe-card-pagination-dot-border-radius","--todo-swipe-card-pagination-dot-spacing","--todo-swipe-card-pagination-bottom","--todo-swipe-card-pagination-right","--todo-swipe-card-pagination-background","--todo-swipe-card-pagination-dot-active-size-multiplier","--todo-swipe-card-pagination-dot-active-opacity","--todo-swipe-card-pagination-dot-inactive-opacity"].forEach(t=>{const o=new RegExp(`${t}\\s*:\\s*([^;]+)`,"i"),n=e.match(o);n&&n[1]&&(i+=`${t}: ${n[1].trim()};\n`)})}if(i){t.paginationElement.style.cssText+=i;const e=t.paginationElement.querySelectorAll(".pagination-dot");requestAnimationFrame(()=>{e.forEach(t=>{t.style.borderRadius="var(--todo-swipe-card-pagination-dot-border-radius, 50%)",t.style.margin="0 var(--todo-swipe-card-pagination-dot-spacing, 4px)",t.classList.contains("active")?(t.style.width="calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))",t.style.height="calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))"):(t.style.width="var(--todo-swipe-card-pagination-dot-size, 8px)",t.style.height="var(--todo-swipe-card-pagination-dot-size, 8px)")})})}}async function bt(t,i){if(!i?.connection)return()=>{};try{return i.connection.subscribeMessage(i=>{const e=new CustomEvent("todo-items-updated",{detail:{entityId:t,items:i.items||[]},bubbles:!0,composed:!0});document.dispatchEvent(e)},{type:"todo/item/subscribe",entity_id:t})}catch(t){return()=>{}}}async function wt(t,i){if(!i)return[];try{const e=await i.callWS({type:"todo/item/list",entity_id:t});return e.items||[]}catch(t){return[]}}function xt(t,i,e){e&&t&&i&&e.callService("todo","add_item",{entity_id:t,item:i})}function yt(t,i,e,o){o&&t&&i&&(o.callService("todo","update_item",{entity_id:t,item:i.uid,status:e?"completed":"needs_action"}),i.summary)}async function kt(t,i,e,o){if(!o)return;const n={entity_id:t,item:i.uid,rename:e.summary};void 0!==e.completed&&(n.status=e.completed?"completed":"needs_action"),void 0!==e.description&&(n.description=e.description||null),void 0!==e.dueDate&&(e.dueDate&&""!==e.dueDate.trim()?e.dueDate.includes("T")?n.due_datetime=e.dueDate:n.due_date=e.dueDate:i.due&&i.due.includes("T")?n.due_datetime=null:n.due_date=null),await o.callService("todo","update_item",n),i.summary,e.summary}async function _t(t,i,e){if(!e)return;const o={entity_id:t,item:i.summary};i.description&&(o.description=i.description),void 0!==i.dueDate&&(o.due_date=i.dueDate||null),await e.callService("todo","add_item",o),i.summary}function $t(t,i,e){e&&(e.callService("todo","remove_item",{entity_id:t,item:i.uid}),i.summary)}function zt(t,i){i&&i.callService("todo","remove_completed_items",{entity_id:t})}function Ct(t,i,e){const o=[...t],n=o.filter(t=>"completed"===t.status),s=o.filter(t=>"completed"!==t.status);let r=s,a=n;if(i&&"none"!==i){const t=function(t,i){switch(t){case"alpha_asc":return(t,e)=>t.summary.localeCompare(e.summary,i?.locale?.language);case"alpha_desc":return(t,e)=>e.summary.localeCompare(t.summary,i?.locale?.language);case"duedate_asc":return(t,i)=>{const e=St(t.due),o=St(i.due);return e||o?e?o?e.getTime()-o.getTime():-1:1:0};case"duedate_desc":return(t,i)=>{const e=St(t.due),o=St(i.due);return e||o?e?o?o.getTime()-e.getTime():-1:1:0};default:return()=>0}}(i,e);r=s.sort(t),a=n.sort(t)}return[...r,...a]}function St(t){if(!t)return null;try{if(t.includes("T"))return new Date(t);{const i=new Date(`${t}T23:59:59`);return isNaN(i.getTime())?null:i}}catch(t){return null}}function Tt(t,i,e,o,n,s){const r=document.createElement("div");r.className="todo-item "+("completed"===t.status?"completed":""),r.dataset.itemUid=t.uid;const a=document.createElement("ha-checkbox");a.className="todo-checkbox",a.checked="completed"===t.status,a.addEventListener("change",o=>{o.stopPropagation(),e(i,t,o.target.checked)}),r.appendChild(a);const d=document.createElement("div");d.className="todo-content";const c=document.createElement("div");if(c.className="todo-summary",c.textContent=t.summary,d.appendChild(c),t.description){const i=document.createElement("div");i.className="todo-description",i.textContent=t.description,d.appendChild(i)}if(t.due){const i=mt(t.due),e=i.querySelector("ha-relative-time");e&&n&&(e.hass=n),d.appendChild(i)}r.appendChild(d),s&&Et(s,8)&&r.setAttribute("data-supports-drag","true");let h=0,l=0,p=0,u=!1;const g=t=>{t.target===a||a.contains(t.target)||t.target.closest(".todo-drag-handle")||(u=!1,p=Date.now(),"touchstart"===t.type?(h=t.touches[0].clientX,l=t.touches[0].clientY):(h=t.clientX,l=t.clientY))},m=t=>{if(!u){let i,e;"touchmove"===t.type?(i=t.touches[0].clientX,e=t.touches[0].clientY):(i=t.clientX,e=t.clientY);const o=Math.abs(i-h),n=Math.abs(e-l);(o>10||n>10)&&(u=!0)}},f=e=>{if(e.target===a||a.contains(e.target)||e.target.closest(".todo-drag-handle"))return;const n=Date.now()-p;!u&&n<1e3&&setTimeout(()=>{o(i,t)},10)};return r.addEventListener("touchstart",g,{passive:!0}),r.addEventListener("touchmove",m,{passive:!0}),r.addEventListener("touchend",f,{passive:!0}),r.addEventListener("mousedown",g),r.addEventListener("mousemove",m),r.addEventListener("mouseup",f),r.addEventListener("click",e=>{e.target===a||a.contains(e.target)||e.target.closest(".todo-drag-handle")||!u&&Date.now()-p<100&&(e.preventDefault(),e.stopPropagation(),o(i,t))}),r}function Et(t,i){return 0!==((t.attributes?.supported_features||0)&i)}var Dt=/*#__PURE__*/Object.freeze({__proto__:null,addTodoItem:xt,addTodoItemFromDialog:_t,createTodoItemElement:Tt,deleteCompletedItems:zt,deleteTodoItemFromDialog:$t,entitySupportsFeature:Et,fetchTodoItems:wt,moveItem:async function(t,i,e,o){if(o)try{await o.callWS({type:"todo/item/move",entity_id:t,uid:i,previous_uid:e||void 0})}catch(t){console.error("Error moving todo item:",t),t.message}},sortTodoItems:Ct,subscribeToTodoItems:bt,toggleTodoItem:yt,updateTodoItemFromDialog:kt});class At{constructor(t){this.cardInstance=t,this.currentDialog=null,this.dialogOpenTime=0}get _t(){return this.cardInstance._t}get kt(){return this.cardInstance.kt}$t(t,i){const e=document.createElement("button");return e.slot=i,e.textContent=t,e.setAttribute("destructive",""),e.style.cssText="\n      background-color: #f44336;\n      color: white;\n      border: none;\n      border-radius: 4px;\n      padding: 8px 16px;\n      font-family: var(--mdc-typography-button-font-family, inherit);\n      font-size: var(--mdc-typography-button-font-size, 0.875rem);\n      font-weight: var(--mdc-typography-button-font-weight, 500);\n      text-transform: uppercase;\n      letter-spacing: 0.0892857143em;\n      cursor: pointer;\n      min-width: 64px;\n      height: 36px;\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      box-sizing: border-box;\n      transition: background-color 0.2s, box-shadow 0.2s;\n      outline: none;\n    ",e.addEventListener("mouseenter",()=>{e.style.backgroundColor="#d32f2f",e.style.boxShadow="0px 2px 4px rgba(244, 67, 54, 0.3)"}),e.addEventListener("mouseleave",()=>{e.style.backgroundColor="#f44336",e.style.boxShadow="none"}),e.addEventListener("focus",()=>{e.style.backgroundColor="#d32f2f",e.style.boxShadow="0px 0px 0px 2px rgba(244, 67, 54, 0.3)"}),e.addEventListener("blur",()=>{e.style.backgroundColor="#f44336",e.style.boxShadow="none"}),e}zt(t,i){const e=document.createElement("ha-button");return e.slot=i,e.textContent=t,e}editTodoItem(t,i){const e=Date.now();e-this.dialogOpenTime<300||(this.dialogOpenTime=e,i.summary,this.showTodoItemEditDialog(t,i))}showTodoItemEditDialog(t,i=void 0){this.closeCurrentDialog();const e=document.createElement("ha-dialog");e.heading=i?"Edit item":"Add Todo Item",e.open=!0,e.style.setProperty("--mdc-dialog-min-width","min(600px, 95vw)"),e.style.setProperty("--mdc-dialog-max-width","min(600px, 95vw)"),e.setAttribute("role","dialog"),e.setAttribute("aria-labelledby","dialog-title"),e.setAttribute("aria-modal","true"),this.currentDialog=e;const o=document.createElement("div");o.style.cssText="\n      padding: 8px 0;\n      display: flex;\n      flex-direction: column;\n      gap: 16px;\n    ";const n=this._t?.states?.[t],s=n&&Et(n,64),r=n&&(Et(n,16)||Et(n,32)),a=n&&Et(n,2),d=document.createElement("div");d.style.cssText="display: flex; align-items: flex-start; gap: 8px;";let c=null;i&&(c=document.createElement("ha-checkbox"),c.checked="completed"===i.status,c.style.marginTop="8px",d.appendChild(c));const h=document.createElement("ha-textfield");h.label="Task name",h.value=i?.summary||"",h.required=!0,h.style.flexGrow="1",h.dialogInitialFocus=!0,h.validationMessage="Task name is required",d.appendChild(h),o.appendChild(d);let l=null;l=document.createElement("ha-textfield"),l.label="Description",l.value=i?.description||"",l.setAttribute("type","textarea"),l.setAttribute("rows","3"),l.style.cssText="\n        width: 100%;\n        display: block;\n        margin-bottom: 16px;\n      ",o.appendChild(l);let p=null,u=null;if(r){const t=document.createElement("div"),e=document.createElement("span");e.className="label",e.textContent="Due date:",e.style.cssText="\n        font-size: var(--ha-font-size-s, 12px);\n        font-weight: var(--ha-font-weight-medium, 500);\n        color: var(--input-label-ink-color, var(--primary-text-color));\n        display: block;\n        margin-bottom: 8px;\n      ",t.appendChild(e);const s=document.createElement("div");s.className="flex",s.style.cssText="\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      ";let r="",a="";if(i?.due)try{const t=new Date(i.due);isNaN(t.getTime())||(r=t.toISOString().split("T")[0],i.due.includes("T")&&(a=t.toTimeString().split(" ")[0].substring(0,5)))}catch(t){}const d=document.createElement("div");d.style.cssText="flex-grow: 1; position: relative;",p=document.createElement("input"),p.type="date",p.value=r,p.style.cssText="\n        width: 100%;\n        height: 56px;\n        padding: 20px 12px 6px 12px;\n        border: none;\n        border-bottom: 1px solid var(--divider-color);\n        border-radius: 0;\n        background: transparent;\n        color: var(--primary-text-color);\n        font-family: var(--mdc-typography-subtitle1-font-family, inherit);\n        font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n        line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);\n        box-sizing: border-box;\n        outline: none;\n        transition: border-bottom-color 0.15s ease;\n        cursor: pointer;\n        -webkit-appearance: none;\n        -moz-appearance: textfield;\n      ";const c=document.createElement("div");c.style.cssText="\n        position: relative;\n        background: var(--mdc-text-field-fill-color, #f5f5f5);\n        border-radius: 4px 4px 0 0;\n        min-height: 56px;\n        display: flex;\n        align-items: center;\n      ";const h=document.createElement("span");h.textContent="Due Date",h.style.cssText="\n        position: absolute;\n        left: 12px;\n        top: 8px;\n        font-size: 12px;\n        color: var(--secondary-text-color);\n        pointer-events: none;\n        transition: all 0.2s ease;\n      ";const l=document.createElement("button");if(l.type="button",l.innerHTML="×",l.style.cssText=`\n        position: absolute;\n        right: 36px;\n        top: 50%;\n        transform: translateY(-50%);\n        background: none;\n        border: none;\n        color: var(--secondary-text-color);\n        font-size: 18px;\n        cursor: pointer;\n        padding: 4px;\n        border-radius: 50%;\n        width: 20px;\n        height: 20px;\n        display: ${r?"flex":"none"};\n        align-items: center;\n        justify-content: center;\n        z-index: 2;\n      `,l.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),p.value="",l.style.display="none",u&&(u.value="")}),p.addEventListener("input",()=>{l.style.display=p.value?"flex":"none"}),c.appendChild(h),c.appendChild(p),c.appendChild(l),d.appendChild(c),s.appendChild(d),Et(n,32)){const t=document.createElement("div");t.style.cssText="position: relative; min-width: 120px;";const i=document.createElement("div");i.style.cssText="\n          position: relative;\n          background: var(--mdc-text-field-fill-color, #f5f5f5);\n          border-radius: 4px 4px 0 0;\n          min-height: 56px;\n          display: flex;\n          align-items: center;\n        ",u=document.createElement("input"),u.type="time",u.value=a,u.style.cssText="\n          width: 100%;\n          height: 56px;\n          padding: 20px 12px 6px 12px;\n          border: none;\n          border-bottom: 1px solid var(--divider-color);\n          border-radius: 0;\n          background: transparent;\n          color: var(--primary-text-color);\n          font-family: var(--mdc-typography-subtitle1-font-family, inherit);\n          font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n          line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);\n          box-sizing: border-box;\n          outline: none;\n          transition: border-bottom-color 0.15s ease;\n          -webkit-appearance: none;\n          -moz-appearance: textfield;\n        ";const e=document.createElement("span");e.textContent="Time",e.style.cssText="\n          position: absolute;\n          left: 12px;\n          top: 8px;\n          font-size: 12px;\n          color: var(--secondary-text-color);\n          pointer-events: none;\n          transition: all 0.2s ease;\n        ",i.appendChild(e),i.appendChild(u),t.appendChild(i),s.appendChild(t)}t.appendChild(s),o.appendChild(t)}if(setTimeout(()=>{const t=e.querySelectorAll("ha-textfield, ha-checkbox, input, button, ha-button");if(0===t.length)return;const i=t[0],o=t[t.length-1];e.addEventListener("keydown",t=>{"Tab"===t.key&&(t.shiftKey&&document.activeElement===i?(t.preventDefault(),o.focus()):t.shiftKey||document.activeElement!==o||(t.preventDefault(),i.focus()))})},100),e.appendChild(o),i&&a){const o=this.$t("Delete item","secondaryAction");o.addEventListener("click",async()=>{await this.showDeleteConfirmationDialog(i.summary)&&($t(t,i,this._t),this.closeDialog(e))}),e.appendChild(o)}const g=this.zt("Cancel","primaryAction");g.addEventListener("click",()=>{this.closeDialog(e)}),e.appendChild(g);const m=i?"Save item":"Add",f=this.zt(m,"primaryAction");f.addEventListener("click",async()=>{const o=h.value.trim();if(!o)return void h.reportValidity();let n="";if(p?.value)if(u?.value){const t=`${p.value}T${u.value}:00`;try{n=new Date(t).toISOString()}catch(t){console.error("Invalid date/time combination"),n=p.value}}else n=p.value;const a={summary:o,completed:c?.checked||!1};s&&(a.description=l?.value),r&&(a.dueDate=n);await this.handleDialogSave(t,i,a)&&this.closeDialog(e)}),e.appendChild(f),h.addEventListener("keydown",o=>{if("Enter"===o.key){o.preventDefault();const n=h.value.trim();if(n){let a="";if(p?.value)if(u?.value){const t=`${p.value}T${u.value}:00`;try{a=new Date(t).toISOString()}catch(o){console.error("Invalid date/time combination"),a=p.value}}else a=p.value;const d={summary:n,completed:c?.checked||!1};s&&(d.description=l?.value),r&&(d.dueDate=a),this.handleDialogSave(t,i,d).then(t=>{t&&this.closeDialog(e)})}}}),e.addEventListener("closed",()=>{this.onDialogClosed(e)}),document.body.appendChild(e),setTimeout(()=>{h.focus()},100)}closeDialog(t){t&&t.open&&(t.open=!1,t.close())}closeCurrentDialog(){this.currentDialog&&(this.closeDialog(this.currentDialog),this.currentDialog=null)}onDialogClosed(t){t.parentNode&&t.parentNode.removeChild(t),this.currentDialog===t&&(this.currentDialog=null)}async handleDialogSave(t,i,e){if(!e.summary)return!1;try{return i?await kt(t,i,e,this._t):await _t(t,e,this._t),!0}catch(t){return!1}}async showDeleteConfirmationDialog(t){return new Promise(i=>{const e=document.createElement("ha-dialog");e.heading="Confirm Deletion",e.open=!0;const o=document.createElement("div");o.style.padding="16px",o.textContent=`Are you sure you want to delete "${t}"?`,e.appendChild(o);const n=this.zt("Cancel","secondaryAction");n.addEventListener("click",()=>{e.close(),i(!1)});const s=this.$t("Delete","primaryAction");s.addEventListener("click",()=>{e.close(),i(!0)}),e.appendChild(n),e.appendChild(s),e.addEventListener("closed",()=>{e.parentNode&&e.parentNode.removeChild(e),i(!1)}),document.body.appendChild(e)})}showDeleteCompletedConfirmation(t){const i=document.createElement("ha-dialog");i.heading="Confirm Deletion",i.open=!0;const e=document.createElement("div");e.style.padding="16px",e.textContent="Are you sure you want to delete all completed items from the list?",i.appendChild(e);const o=this.zt("Cancel","secondaryAction");o.addEventListener("click",()=>{i.close()});const n=this.$t("Delete","primaryAction");n.addEventListener("click",()=>{i.close(),Promise.resolve().then(function(){return Dt}).then(i=>{i.deleteCompletedItems(t,this._t)})}),i.appendChild(o),i.appendChild(n),i.addEventListener("closed",()=>{i.parentNode&&i.parentNode.removeChild(i)}),document.body.appendChild(i)}}class Mt{constructor(t){this.cardInstance=t}get _t(){return this.cardInstance._t}get kt(){return this.cardInstance.kt}Ct(t){return"string"==typeof t?t:t?.entity||""}St(t){if(!this.kt?.entities)return null;const i=this.kt.entities.find(i=>this.Ct(i)===t);return"string"==typeof i?{entity:t}:i||null}async createNativeTodoCards(){if(!this.cardInstance.sliderElement)return;if(this.cardInstance.Tt)return;const t=this.cardInstance.sliderElement;for(let i=0;i<this.kt.entities.length;i++){if(this.cardInstance.Tt)return void r();const e=this.kt.entities[i],o=this.Ct(e);if(!o||""===o.trim())continue;if(this.cardInstance.sliderElement!==t)return void r();if(!this.cardInstance.sliderElement)return void r();const n=document.createElement("div");n.className="slide";try{const s=await this.createNativeTodoCard(e);if(this.cardInstance.Tt)return void r();if(this.cardInstance.cards[i]={element:s,slide:n,entityId:o,entityConfig:e},n.appendChild(s),this.kt.show_completed&&this.kt.show_completed_menu){const t=this.cardInstance.Et(o,e);n.appendChild(t)}if(this.kt.show_icons){const t=gt(e,o,this._t);n.appendChild(t)}if(!this.cardInstance.sliderElement||this.cardInstance.sliderElement!==t||this.cardInstance.Tt)return void r();this.cardInstance.sliderElement.appendChild(n),r()}catch(e){if(!this.cardInstance.Tt){console.error(`Error creating native todo card ${i}:`,o,e);const s=document.createElement("div");s.style.cssText="color: red; background: white; padding: 16px; border: 1px solid red; height: 100%; box-sizing: border-box;",s.textContent=`Error creating card: ${e.message||e}. Check console for details.`,n.appendChild(s),this.cardInstance.sliderElement&&this.cardInstance.sliderElement===t&&this.cardInstance.sliderElement.appendChild(n),this.cardInstance.cards[i]={error:!0,slide:n}}}}this.cardInstance.cards=this.cardInstance.cards.filter(Boolean),this.cardInstance.cards.length}async createNativeTodoCard(t){const i=this.Ct(t);this.cardInstance.Dt||(this.cardInstance.Dt=new Map),this.cardInstance.At||(this.cardInstance.At=new Map);const e=document.createElement("div");e.className="native-todo-card","object"==typeof t&&t.background_image&&(e.style.backgroundImage=`url('${t.background_image}')`,e.style.backgroundPosition="center center",e.style.backgroundRepeat="no-repeat",e.style.backgroundSize="cover");let o=e;const n="object"==typeof t&&t.show_title||!1,s="object"==typeof t&&t.title||"";if(n&&s&&(o=function(t,i){const e=document.createElement("div");e.className="todo-card-with-title-wrapper";const o=document.createElement("div");o.className="todo-swipe-card-external-title",o.textContent=i;const n=document.createElement("div");return n.className="todo-card-container",e.appendChild(o),n.appendChild(t),e.appendChild(n),e}(e,s)),this.kt.show_create){const t=this.createAddRow(i);e.appendChild(t)}const r=document.createElement("div");if(r.className="todo-list",e.appendChild(r),this.kt.enable_search&&this.kt.show_create&&ft(e,i,this.cardInstance),this._t){const t=this.cardInstance.At.get(i);if(t&&"function"==typeof t)try{t()}catch(t){}const e=await bt(i,this._t);this.cardInstance.At.set(i,e),setTimeout(async()=>{await this.updateNativeTodoCard(o,i)},100)}return o}createAddRow(t){const i=document.createElement("div");i.className="add-row";const e=document.createElement("div");e.className="add-textfield";const o=document.createElement("input");if(o.type="text",o.placeholder=this.kt.enable_search?"Type to search / add":"Add item",o.addEventListener("keydown",i=>{if("Enter"===i.key){const e=o.value.trim();e&&(this.kt.enable_search?function(t,i,e,o,n){if(t.key,"Enter"===t.key){t.preventDefault(),t.stopPropagation();const e=o.value.trim();if(e){n.yt.delete(i),n.xt="",o.value="",Array.from(n.yt.keys());const t=n._t?.states?.[i];(t?.attributes?.items||[]).some(t=>t.summary.toLowerCase()===e.toLowerCase())||n.Mt(i,e)}}else"Escape"===t.key&&(o.value="",n.xt="",n.yt.delete(i),n.cardBuilder.updateNativeTodoCard(e,i))}(i,t,o.closest(".native-todo-card")||o.closest(".todo-card-with-title-wrapper"),o,this.cardInstance):(this.cardInstance.Mt(t,e),o.value="",o.focus()))}else if("Escape"===i.key&&this.kt.enable_search){o.value="",this.cardInstance.yt.delete(t),this.cardInstance.xt="";const i=o.closest(".native-todo-card")||o.closest(".todo-card-with-title-wrapper");i&&this.updateNativeTodoCard(i,t)}}),e.appendChild(o),i.appendChild(e),this.kt.show_addbutton){const e=document.createElement("button");e.className="add-button",e.title="Add item",e.innerHTML='\n       <svg viewBox="0 0 24 24">\n         <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />\n       </svg>\n     ',e.addEventListener("click",()=>{const i=o.value.trim();if(i){if(this.kt.enable_search){this.cardInstance.yt.delete(t),this.cardInstance.xt="",o.value="";const e=this.cardInstance._t?.states?.[t];(e?.attributes?.items||[]).some(t=>t.summary.toLowerCase()===i.toLowerCase())||this.cardInstance.Mt(t,i);const n=o.closest(".native-todo-card")||o.closest(".todo-card-with-title-wrapper");n&&this.updateNativeTodoCard(n,t)}else this.cardInstance.Mt(t,i),o.value="";o.focus()}}),i.appendChild(e)}return i}async updateNativeTodoCard(t,i){if(!this._t||!i)return;const e=this._t.states[i];if(!e)return;let o=[];try{o=await wt(i,this._t),o.length,this.cardInstance.Dt||(this.cardInstance.Dt=new Map),this.cardInstance.Dt.set(i,o)}catch(t){this.cardInstance.Dt&&this.cardInstance.Dt.has(i)?(o=this.cardInstance.Dt.get(i)||[],o.length):(o=e.attributes?.items||[],o.length)}let n=null;if(n=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .todo-list"):(t.classList.contains("native-todo-card"),t.querySelector(".todo-list")),!n){let i=t;if(t.classList.contains("todo-card-with-title-wrapper")&&(i=t.querySelector(".native-todo-card")),!i)return;n=document.createElement("div"),n.className="todo-list",i.appendChild(n)}const s=this.St(i),r=Ct(o,s?.display_order,this._t),a=this.cardInstance.yt.get(i)||"",d=a&&""!==a.trim();let c=d?r.filter(t=>function(t,i){if(!i)return!0;try{const e=new RegExp(i,"i");return e.test(t.summary)||t.description&&e.test(t.description)}catch(e){const o=i.toLowerCase();return t.summary.toLowerCase().includes(o)||t.description&&t.description.toLowerCase().includes(o)}}(t,a)):r;if(!d&&s?.hide_future_items){const t=new Date;t.setHours(23,59,59,999),c=c.filter(i=>{if("completed"===i.status||!i.due)return!0;try{return new Date(i.due)<=t}catch(t){return!0}}),c.length}if(!d&&s?.max_items&&"number"==typeof s.max_items){const t=c.filter(t=>"completed"!==t.status),i=c.filter(t=>"completed"===t.status),e=t.slice(0,s.max_items);c=[...e,...i],s.max_items,c.length,e.length,i.length}if(c.length,o.length,n.innerHTML="",c.length>0&&c.forEach((t,o)=>{try{const o=Tt(t,i,this.cardInstance.Nt,this.cardInstance.Ot,this._t,e);this.kt.show_completed||"completed"!==t.status||d||(o.style.display="none"),n.appendChild(o)}catch(i){console.error(`Error creating item element ${o}:`,i,t)}}),this.updateSearchCounter(t,i,a,c.length,r.length),Et(e,8)){const{setupDragAndDrop:t}=await Promise.resolve().then(function(){return It});t(n,i,c,this._t)}}updateSearchCounter(t,i,e,o,n){let s=null;if(s=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .add-row"):t.querySelector(".add-row"),!s)return;const r=t.querySelector(".search-counter");if(r&&r.remove(),e&&""!==e.trim()&&n>0){s.classList.add("has-search-counter");const t=document.createElement("div");t.className="search-counter",t.textContent=`Showing ${o} of ${n} results`,s.parentNode.insertBefore(t,s.nextSibling)}else s.classList.remove("has-search-counter")}}class Nt{constructor(t){this.cardInstance=t,this.handleTodoUpdate=this.handleTodoUpdate.bind(this)}get _t(){return this.cardInstance._t}get kt(){return this.cardInstance.kt}async initializeSubscriptions(t,i){if(this.cardInstance.initialized&&this.cardInstance.cards&&0!==this.cardInstance.cards.length&&!i&&this.cardInstance.cards.length>0)for(const t of this.cardInstance.cards)if(t&&t.entityId){r(t.entityId);const i=this.cardInstance.At?.get(t.entityId);if(i&&"function"==typeof i)try{i()}catch(t){r()}const e=await bt(t.entityId,this._t);this.cardInstance.At||(this.cardInstance.At=new Map),this.cardInstance.At.set(t.entityId,e),setTimeout(async()=>{await this.cardInstance.cardBuilder.updateNativeTodoCard(t.element,t.entityId)},100)}}setupEventListeners(){document.addEventListener("todo-items-updated",this.handleTodoUpdate)}removeEventListeners(){document.removeEventListener("todo-items-updated",this.handleTodoUpdate)}handleTodoUpdate(t){const{entityId:i,items:e}=t.detail;this.cardInstance.Dt||(this.cardInstance.Dt=new Map),this.cardInstance.Dt.set(i,e);const o=this.cardInstance.cards.find(t=>t.entityId===i);o&&o.element&&setTimeout(()=>{this.cardInstance.cardBuilder.updateNativeTodoCard(o.element,i)},50)}cleanup(){this.cardInstance.At&&(this.cardInstance.At.forEach(async(t,i)=>{try{"function"==typeof t&&await Promise.resolve(t()).catch(t=>{})}catch(t){}}),this.cardInstance.At.clear()),this.cardInstance.Dt&&this.cardInstance.Dt.clear(),this.removeEventListeners()}}class TodoSwipeCard extends pt{constructor(){super(),this.kt={},this._t=null,this.cards=[],this.currentIndex=0,this.slideWidth=0,this.cardContainer=null,this.sliderElement=null,this.paginationElement=null,this.initialized=!1,this.It=null,this.jt=null,this.Lt=null,this.Ht=null,this.Vt=null,this.Pt=null,this.At=new Map,this.Ft=null,this.yt=new Map,this.xt="",this.wt=new Map,this.Dt=new Map,this.Rt=!1,this.dialogManager=new At(this),this.cardBuilder=new Mt(this),this.subscriptionManager=new Nt(this),this.Mt=this.Mt.bind(this),this.Nt=this.Nt.bind(this),this.Ot=this.Ot.bind(this)}render(){return W``}static getStubConfig(){return{entities:[],card_spacing:15,show_pagination:!0,show_icons:!1,show_create:!0,show_addbutton:!1,show_completed:!1,show_completed_menu:!1,delete_confirmation:!1,enable_search:!1,clear_search_on_uncheck:!1}}static getConfigElement(){return document.createElement("todo-swipe-card-editor")}Jt(){return this.kt&&this.kt.entities&&Array.isArray(this.kt.entities)&&this.kt.entities.length>0&&this.kt.entities.some(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim())}Ct(t){return"string"==typeof t?t:t?.entity||""}St(t){if(!this.kt?.entities)return null;const i=this.kt.entities.find(i=>this.Ct(i)===t);return"string"==typeof i?{entity:t}:i||null}Ut(t){if(!this.Ht)return!0;return JSON.stringify(t)!==JSON.stringify(this.Ht)}Bt(){if(this.shadowRoot)if(this.It||(this.It=document.createElement("style"),this.shadowRoot.appendChild(this.It)),this.kt&&this.kt.card_mod&&"string"==typeof this.kt.card_mod.style){const t=this.kt.card_mod.style;t.includes(":host")?this.It.textContent=t:this.It.textContent=`\n          :host {\n            ${t}\n          }\n        `}else this.It&&(this.It.textContent="")}Zt(){if(this.sliderElement&&this.kt)try{let t="0.3s",i="ease-out";const e=this.kt.card_mod||this.kt.custom_card_mod;if(e&&"string"==typeof e.style){const o=e.style,n=/--todo-swipe-card-transition-speed\s*:\s*([^;]+)/i,s=o.match(n);s&&s[1]&&(t=s[1].trim());const r=/--todo-swipe-card-transition-easing\s*:\s*([^;]+)/i,a=o.match(r);a&&a[1]&&(i=a[1].trim());const d=/--todo-swipe-card-delete-button-color\s*:\s*([^;]+)/i,c=o.match(d);c&&c[1]&&(this.Ft=c[1].trim(),this.qt())}if(this.sliderElement&&this.sliderElement.style){const e=`transform ${t} ${i}`;this.sliderElement.style.transition=e,this.Wt=t,this.Xt=i}}catch(t){console.error("Error applying transition properties:",t)}}qt(){if(!this.Ft)return;this.shadowRoot.querySelectorAll(".delete-completed-button").forEach(t=>{t.style.color=this.Ft;const i=t.querySelector("svg");i&&(i.style.fill=this.Ft)})}setConfig(t){JSON.stringify(t);let i=t.entities||[];Array.isArray(i)||(i="object"==typeof i?Object.values(i):"string"==typeof i?[i]:[]),i=i.map(t=>"string"==typeof t?""===t.trim()?t:{entity:t}:t).filter(t=>"string"==typeof t?""!==t:t&&(t.entity||""===t.entity));const e={...TodoSwipeCard.getStubConfig(),...t,entities:i};if(void 0===e.card_spacing?e.card_spacing=15:(e.card_spacing=parseInt(e.card_spacing),(isNaN(e.card_spacing)||e.card_spacing<0)&&(e.card_spacing=15)),t.card_mod&&"object"==typeof t.card_mod&&Object.keys(t.card_mod).length>0?e.card_mod=t.card_mod:t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(e.card_mod=t.custom_card_mod),!this.Ut(e))return;const o=this.kt;if(this.kt=e,this.Ht=JSON.parse(JSON.stringify(e)),JSON.stringify(this.kt),this.Bt(),this.initialized){this.jt&&clearTimeout(this.jt);this.Kt(o,e)?this.jt=setTimeout(()=>{this.Gt().then(()=>{this.Zt(),this.qt()})},300):(this.Yt(o),this.Zt(),this.qt())}}Kt(t,i){if(!t)return!0;const e=JSON.stringify(t.entities)!==JSON.stringify(i.entities),o=t.show_pagination!==i.show_pagination,n=t.show_create!==i.show_create,s=JSON.stringify(t.card_mod)!==JSON.stringify(i.card_mod),r=t.enable_search!==i.enable_search;return e||o||n||s||r}Yt(t){requestAnimationFrame(()=>{this.kt.show_completed!==t.show_completed&&this.cards.forEach(t=>{if(t.element){t.element.querySelectorAll(".todo-item.completed").forEach(t=>{t.style.display=this.kt.show_completed?"":"none"})}}),this.kt.show_completed_menu===t.show_completed_menu&&this.kt.show_completed===t.show_completed||this.Qt(),this.kt.card_spacing!==t.card_spacing&&this.sliderElement&&(this.sliderElement.style.gap=`${this.kt.card_spacing}px`,this.updateSlider(!1)),JSON.stringify(this.kt.card_mod||this.kt.custom_card_mod)!==JSON.stringify(t.card_mod||t.custom_card_mod)&&(this.Bt(),this.paginationElement&&this.ti())})}Qt(){this.cards.forEach(t=>{const i=t.slide;if(!i)return;if(i.querySelectorAll(".delete-completed-button").forEach(t=>t.remove()),this.kt.show_completed&&this.kt.show_completed_menu){const e=t.entityConfig||this.St(t.entityId),o=this.Et(t.entityId,e);i.appendChild(o)}})}Et(t,i=null){const e=document.createElement("button");if(e.className="delete-completed-button",e.title="Delete completed items",e.innerHTML='\n      <svg viewBox="0 0 24 24">\n        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />\n      </svg>\n    ',i&&i.show_title&&i.title){const t=`calc(${35}px + ${"var(--todo-swipe-card-title-height, 40px)"})`;e.style.setProperty("--todo-swipe-card-delete-button-auto-top",t)}if(this.Ft){e.style.color=this.Ft;const t=e.querySelector("svg");t&&(t.style.fill=this.Ft)}return e.addEventListener("click",i=>{i.preventDefault(),i.stopPropagation(),this.kt.delete_confirmation?this.dialogManager.showDeleteCompletedConfirmation(t):zt(t,this._t)}),e}set hass(t){if(!t)return;const i=this._t;this._t=t,this.subscriptionManager.initializeSubscriptions(t,i)}connectedCallback(){super.connectedCallback(),this.subscriptionManager.setupEventListeners(),this.kt&&(this.initialized||(this.Bt(),setTimeout(()=>{this.Gt()},0)))}disconnectedCallback(){var t;this.jt&&(clearTimeout(this.jt),this.jt=null),this.Vt&&(clearTimeout(this.Vt),this.Vt=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.subscriptionManager.cleanup(),(t=this).wt&&(t.wt.forEach(t=>{t.inputElement&&(t.inputHandler&&t.inputElement.removeEventListener("input",t.inputHandler),t.keydownHandler&&t.inputElement.removeEventListener("keydown",t.keydownHandler))}),t.wt.clear()),t.yt&&t.yt.clear(),t.xt="",this.cardContainer&&(this.ii&&(this.cardContainer.removeEventListener("touchstart",this.ii),this.cardContainer.removeEventListener("touchmove",this.ei),this.cardContainer.removeEventListener("touchend",this.oi),this.cardContainer.removeEventListener("touchcancel",this.oi),this.cardContainer.removeEventListener("mousedown",this.ni)),window.removeEventListener("mousemove",this.si),window.removeEventListener("mouseup",this.ri)),this.initialized=!1,this.cards=[],this.cardContainer=null,this.sliderElement=null,this.paginationElement=null,this.Pt=null,this.shadowRoot&&(this.shadowRoot.innerHTML="")}async Gt(){if(this.Lt)return this.Lt;this.Lt=this.ai();try{await this.Lt}finally{this.Lt=null}}async ai(){const t=document.createDocumentFragment(),i=this.renderRoot||this.shadowRoot;if(!i)return void console.error("No render root available");i.innerHTML="";const e=function(t){const i=document.createElement("style");return i.textContent=`\n    :host {\n      display: block;\n      overflow: hidden;\n      width: 100%;\n      height: 100%;\n      --card-border-radius: var(--ha-card-border-radius, 12px);\n      border-radius: var(--card-border-radius);\n    }\n\n    .card-container {\n      position: relative;\n      width: 100%;\n      height: 100%;\n      overflow: hidden;\n      border-radius: var(--card-border-radius);\n    }\n    \n    .card-container, .slide {\n      border-radius: var(--card-border-radius) !important;\n    }\n\n    .slider {\n      position: relative;\n      display: flex;\n      width: 100%;\n      height: 100%;\n      transition: transform 0.3s ease-out;\n      will-change: transform;\n    }\n\n    .slide {\n      position: relative;\n      flex: 0 0 100%;\n      max-width: 100%;\n      overflow: hidden;\n      height: 100%;\n      box-sizing: border-box;\n      border-radius: var(--card-border-radius);\n      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));\n    }\n\n    .pagination {\n      position: absolute;\n      bottom: var(--todo-swipe-card-pagination-bottom, 8px);\n      left: 0;\n      right: 0;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      z-index: 1;\n      background-color: var(--todo-swipe-card-pagination-background, transparent);\n    }\n\n    .pagination-dot {\n      width: var(--todo-swipe-card-pagination-dot-size, 8px);\n      height: var(--todo-swipe-card-pagination-dot-size, 8px);\n      border-radius: var(--todo-swipe-card-pagination-dot-border-radius, 50%);\n      margin: 0 var(--todo-swipe-card-pagination-dot-spacing, 4px);\n      background-color: var(--todo-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n      opacity: var(--todo-swipe-card-pagination-dot-inactive-opacity, 0.6);\n      cursor: pointer;\n      transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;\n      flex-shrink: 0;\n    }\n\n    .pagination-dot.active {\n      background-color: var(--todo-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n      width: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));\n      height: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));\n      opacity: var(--todo-swipe-card-pagination-dot-active-opacity, 1);\n    }\n    \n    .delete-completed-button {\n      position: absolute;\n      right: 7px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      top: var(--todo-swipe-card-delete-button-top, var(--todo-swipe-card-delete-button-auto-top, 35px));\n      padding: 4px;\n      background-color: transparent;\n      border: none;\n      color: var(--todo-swipe-card-delete-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      cursor: pointer;\n      border-radius: 50%;\n      width: 36px;\n      height: 36px;\n      z-index: 10;\n    }\n\n    .delete-completed-button:hover {\n      background-color: rgba(127, 127, 127, 0.2);\n    }\n\n    .delete-completed-button svg {\n      width: 20px;\n      height: 20px;\n      fill: currentColor;\n    }\n\n    /* Preview styles */\n    .preview-container {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      text-align: center;\n      padding: 16px;\n      box-sizing: border-box;\n      height: 100%;\n      background: var(--ha-card-background, var(--card-background-color, white));\n      border-radius: inherit;\n    }\n    \n    .preview-icon-container {\n      margin-bottom: 16px;\n    }\n    \n    .preview-icon-container ha-icon {\n      color: var(--primary-color, #03a9f4);\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n    }\n    \n    .preview-text-container {\n      margin-bottom: 16px;\n    }\n    \n    .preview-title {\n      font-size: 18px;\n      font-weight: bold;\n      margin-bottom: 8px;\n      color: var(--primary-text-color);\n    }\n    \n    .preview-description {\n      font-size: 14px;\n      color: var(--secondary-text-color);\n      max-width: 300px;\n      line-height: 1.4;\n      margin: 0 auto;\n    }\n    \n    /* Dialog styles */\n    ha-dialog {\n      --mdc-dialog-min-width: 300px;\n      --mdc-dialog-max-width: 500px;\n      --mdc-dialog-heading-ink-color: var(--primary-text-color);\n      --mdc-dialog-content-ink-color: var(--primary-text-color);\n      --justify-action-buttons: space-between;\n    }\n    \n    ha-dialog div {\n      padding: 8px 16px 16px 16px;\n      color: var(--primary-text-color);\n    }\n    \n    /* Todo icon styling */\n    .todo-icon {\n      position: absolute;\n      right: var(--todo-swipe-card-icon-right, 16px);\n      bottom: var(--todo-swipe-card-icon-bottom, 8px);\n      width: var(--todo-swipe-card-icon-size, 48px);\n      height: var(--todo-swipe-card-icon-size, 48px);\n      color: var(--todo-swipe-card-icon-color, rgba(255, 255, 255, 0.3));\n      opacity: var(--todo-swipe-card-icon-opacity, 0.6);\n      z-index: 1;\n      pointer-events: none;\n      --mdc-icon-size: var(--todo-swipe-card-icon-size, 48px);\n    }\n\n    .native-todo-card {\n      height: 100%;\n      box-sizing: border-box;\n      overflow-y: auto;\n      border-radius: var(--card-border-radius);\n      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color));\n      font-size: var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px));\n      position: relative;\n      \n      /* Hide scrollbar for all browsers */\n      scrollbar-width: none; /* Firefox */\n      -ms-overflow-style: none; /* Internet Explorer 10+ */\n    }\n\n    .native-todo-card::-webkit-scrollbar {\n      display: none; /* WebKit browsers (Chrome, Safari, Edge) */\n    }\n\n    .todo-card-with-title-wrapper .native-todo-card {\n      border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);\n    }\n\n    .add-row {\n      padding: 8px 12px;\n      padding-bottom: 0;\n      margin-bottom: 6px; /* 6px + 4px todo-list padding = 10px total when no search */\n      position: relative;\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n    }\n\n    .add-row.has-search-counter {\n      margin-bottom: 0px; /* 4px gap to search counter when search is active */\n    }\n\n    .add-textfield {\n      flex-grow: 1;\n      margin-right: 8px;\n    }\n\n    .add-textfield input {\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color)) !important;\n      font-weight: var(--todo-swipe-card-input-font-weight, normal) !important;\n      background: transparent !important;\n      border: none !important;\n      outline: none !important;\n      padding: 8px 8px 2px 8px !important;\n      margin-left: -4px !important;\n      margin-top: 3px !important;\n      width: 100% !important;\n      box-sizing: border-box !important;\n      font-size: inherit !important;\n      font-family: inherit !important;\n    }\n\n    .add-textfield input::placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-textfield input::-webkit-input-placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: 1 !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-textfield input::-moz-placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: 1 !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-button {\n      position: absolute;\n      right: 5px;\n      top: 5px;\n      background: none;\n      border: none;\n      cursor: pointer;\n      padding: 8px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: var(--todo-swipe-card-add-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      opacity: ${t?.show_addbutton?"1":"0"};\n      visibility: ${t?.show_addbutton?"visible":"hidden"};\n      pointer-events: ${t?.show_addbutton?"auto":"none"};\n    }\n\n    .add-button:hover {\n      background-color: rgba(127, 127, 127, 0.1);\n    }\n\n    .add-button svg {\n      width: 24px;\n      height: 24px;\n      fill: currentColor;\n    }\n\n    .todo-list {\n      padding: 4px 0;\n    }\n\n    .header {\n      display: none;\n    }\n\n    .empty {\n      display: none;\n    }\n\n    .todo-item {\n      display: flex;\n      align-items: var(--todo-swipe-card-item-align, flex-start);\n      padding: 1px 12px;\n      min-height: var(--todo-swipe-card-item-height, calc(var(--todo-swipe-card-font-size, 11px) + 8px));\n      margin-top: var(--todo-swipe-card-item-spacing, 1px);\n      cursor: pointer;\n      position: relative;\n      padding-right: 30px;\n    }\n\n    .todo-item:first-child {\n      margin-top: 0 !important;\n    }\n\n    .todo-item:hover {\n      background-color: rgba(127, 127, 127, 0.1);\n    }\n\n    .todo-checkbox {\n      margin-right: var(--todo-swipe-card-item-margin, 5px);\n      margin-top: var(--todo-swipe-card-checkbox-margin-top, 1px);\n      margin-left: 4px;\n      flex-shrink: 0;\n      opacity: 70%;\n      --mdc-checkbox-unchecked-color: var(--todo-swipe-card-checkbox-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      --mdc-checkbox-checked-color: var(--todo-swipe-card-checkbox-checked-color, var(--primary-color));\n      --mdc-checkbox-ink-color: var(--todo-swipe-card-checkbox-checkmark-color, white);\n      --mdc-checkbox-mark-color: var(--todo-swipe-card-checkbox-checkmark-color, white);\n      --mdc-checkbox-size: var(--todo-swipe-card-checkbox-size, 18px);\n      --mdc-checkbox-ripple-size: var(--todo-swipe-card-checkbox-size, 18px);\n      --mdc-checkbox-state-layer-size: var(--todo-swipe-card-checkbox-size, 18px);\n    }\n\n    .todo-content {\n      flex: 1;\n      max-width: calc(100% - 30px);\n      overflow: visible;\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color));\n      font-weight: var(--todo-swipe-card-item-font-weight, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n    }\n\n    .todo-summary {\n      margin: 0;\n      margin-top: var(--todo-swipe-card-summary-margin-top, 3px);\n      padding: 0;\n      color: inherit;\n      font-size: inherit;\n      font-weight: inherit;\n      line-height: inherit;\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n      hyphens: none;\n      word-break: normal;        \n    }\n\n    .todo-item.completed .todo-summary {\n      text-decoration: line-through;\n    }\n\n    .todo-description {\n      margin-top: var(--todo-swipe-card-description-margin-top, 1px);\n      color: var(--todo-swipe-card-font-color-description, var(--secondary-text-color));\n      font-size: var(--todo-swipe-card-font-size-description, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)));\n      font-weight: var(--todo-swipe-card-font-weight-description, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n    }\n\n    .todo-due {\n      margin-top: var(--todo-swipe-card-due-date-margin-top, 2px);\n      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));\n      font-size: var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px))));\n      font-weight: var(--todo-swipe-card-font-weight-due-date, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      display: flex;\n      align-items: flex-start;\n      gap: 3px;\n    }\n\n    .todo-due.overdue {\n      color: var(--todo-swipe-card-font-color-due-date-overdue, var(--warning-color));\n    }\n\n    .todo-item.completed .todo-due.overdue {\n      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));\n    }\n\n    .todo-due-icon {\n      --mdc-icon-size: var(--todo-swipe-card-due-icon-size, 14px);\n      width: var(--todo-swipe-card-due-icon-size, 14px);\n      height: var(--todo-swipe-card-due-icon-size, 14px);\n      margin-inline-start: initial;\n      flex-shrink: 0;\n      margin-top: 1px;\n    }\n\n    .todo-item.completed {\n      display: flex;\n    }\n\n    .todo-card-with-title-wrapper {\n      position: relative;\n      height: 100%;\n      width: 100%;\n      border-radius: var(--ha-card-border-radius, 12px);\n      overflow: hidden;\n      background: var(--ha-card-background, var(--card-background-color, white));\n      display: flex;\n      flex-direction: column;\n    }\n\n    .todo-swipe-card-external-title {\n      min-height: var(--todo-swipe-card-title-height, 40px);\n      display: flex;\n      align-items: center;\n      justify-content: var(--todo-swipe-card-title-align, center);\n      background: var(--todo-swipe-card-title-background, var(--secondary-background-color, #f7f7f7));\n      color: var(--todo-swipe-card-title-color, var(--primary-text-color));\n      font-size: var(--todo-swipe-card-title-font-size, 16px);\n      font-weight: var(--todo-swipe-card-title-font-weight, 500);\n      border-bottom: var(--todo-swipe-card-title-border-width, 1px) solid var(--todo-swipe-card-title-border-color, rgba(0,0,0,0.12));\n      padding: 0 var(--todo-swipe-card-title-padding-horizontal, 16px);\n      box-sizing: content-box;\n      text-align: var(--todo-swipe-card-title-align, center);\n      flex-shrink: 0;\n      z-index: 1;\n      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;\n      margin: 0;\n      line-height: 1;\n      font-family: inherit;\n      white-space: var(--todo-swipe-card-title-white-space, nowrap);\n      overflow: var(--todo-swipe-card-title-overflow, hidden);\n      text-overflow: var(--todo-swipe-card-title-text-overflow, clip);\n    }\n\n    .todo-card-container {\n      flex: 1;\n      min-height: 0;\n      position: relative;\n    }\n\n    .search-counter {\n      padding: 2px 12px 2px 12px;\n      margin-left: 4px;\n      margin-bottom: 0px; /* Let todo-list top padding provide the 4px gap */\n      font-size: var(--todo-swipe-card-search-counter-font-size, 12px);\n      color: var(--todo-swipe-card-search-counter-color, var(--secondary-text-color));\n      font-style: italic;\n      text-align: left;\n    }\n\n  /* Drag and drop styles - minimal visual feedback */\n    .todo-item[data-supports-drag="true"] {\n      cursor: grab;\n    }\n\n    .todo-item.dragging {\n      opacity: 0.5;\n      cursor: grabbing;\n      z-index: 1000;\n    }\n\n    .todo-item.drag-over-top {\n      border-top: 2px solid var(--primary-color);\n    }\n\n    .todo-item.drag-over-bottom {\n      border-bottom: 2px solid var(--primary-color);\n    }\n  `,i}(this.kt);if(t.appendChild(e),this.It&&t.appendChild(this.It),!this.Jt())return function(t){const i=document.createElement("div");i.className="preview-container";const e=document.createElement("div");e.className="preview-icon-container";const o=document.createElement("ha-icon");o.icon="mdi:format-list-checks",e.appendChild(o);const n=document.createElement("div");n.className="preview-text-container";const s=document.createElement("div");s.className="preview-title",s.textContent="Todo Swipe Card";const r=document.createElement("div");r.className="preview-description",r.textContent="A specialized swipe card for todo lists with native styling. Supports multiple lists with swipe navigation.",n.appendChild(s),n.appendChild(r);const a=document.createElement("div");a.className="preview-actions";const d=document.createElement("ha-button");d.raised=!0,d.textContent="EDIT CARD",d.setAttribute("aria-label","Edit Card"),d.addEventListener("click",t=>{t.stopPropagation();const i=new CustomEvent("show-edit-card",{detail:{element:t.target.closest("todo-swipe-card")},bubbles:!0,composed:!0});t.target.dispatchEvent(i)}),a.appendChild(d),i.appendChild(e),i.appendChild(n),i.appendChild(a),t.appendChild(i)}(t),i.appendChild(t),void(this.initialized=!0);this.cardContainer=document.createElement("div"),this.cardContainer.className="card-container",this.sliderElement=document.createElement("div"),this.sliderElement.className="slider",this.cardContainer.appendChild(this.sliderElement),t.appendChild(this.cardContainer),i.appendChild(t),this.cards=[];try{await this.cardBuilder.createNativeTodoCards()}catch(t){console.error("Error creating native todo cards:",t)}!1!==this.kt.show_pagination&&this.cards.length>1?function(t){t.paginationElement=document.createElement("div"),t.paginationElement.className="pagination";for(let i=0;i<t.cards.length;i++){const e=document.createElement("div");e.className="pagination-dot",i===t.currentIndex&&e.classList.add("active"),e.addEventListener("click",()=>{t.goToSlide(i)}),t.paginationElement.appendChild(e)}t.cardContainer.appendChild(t.paginationElement),vt(t)}(this):this.paginationElement=null,requestAnimationFrame(()=>{if(!this.cardContainer)return;this.slideWidth=this.cardContainer.offsetWidth,this.currentIndex=Math.max(0,Math.min(this.currentIndex,this.cards.length-1));const t=getComputedStyle(this.cardContainer).borderRadius;this.cards.forEach(i=>{i.slide&&(i.slide.style.borderRadius=t)}),this.updateSlider(!1),this.di(),this.cards.forEach((t,i)=>{t&&t.element&&t.entityId&&(t.entityId,setTimeout(()=>{this.cardBuilder.updateNativeTodoCard(t.element,t.entityId)},50*i))})}),this.cards.length>1&&function(t){t.ii&&(t.cardContainer.removeEventListener("touchstart",t.ii),t.cardContainer.removeEventListener("touchmove",t.ei),t.cardContainer.removeEventListener("touchend",t.oi),t.cardContainer.removeEventListener("touchcancel",t.oi),t.cardContainer.removeEventListener("mousedown",t.ni),window.removeEventListener("mousemove",t.si),window.removeEventListener("mouseup",t.ri));let i=0,e=0,o=0,n=!1,s=!1,r=0,a=!1,d=!1;t.ci=i=>{if(!i||i===t.cardContainer||i===t.sliderElement)return!1;let e=i,o=0;for(;e&&o<15;){try{if(e.nodeType===Node.ELEMENT_NODE){const t=e.localName?.toLowerCase(),i=e.getAttribute&&e.getAttribute("role");if(["input","textarea","select","button","a","ha-switch","ha-checkbox","mwc-checkbox","paper-checkbox","ha-textfield","ha-slider","paper-slider","ha-icon-button","mwc-button","paper-button"].includes(t))return!0;if(i&&["button","checkbox","switch","slider","link","menuitem","textbox","input","combobox","searchbox"].includes(i))return!0;if(e.classList){const t=["mdc-text-field","mdc-text-field__input","mdc-text-field__ripple","mdc-line-ripple","mdc-floating-label","mdc-text-field__affix"];for(const i of t)if(e.classList.contains(i))return!0}}}catch(t){break}e=e.assignedSlot||e.parentNode||e.getRootNode&&e.getRootNode().host,o++}return!1},t.hi=c=>{if(!(n||"mousedown"===c.type&&0!==c.button||(a=t.ci(c.target),a))){if(n=!1,s=!1,d=!1,"touchstart"===c.type?(i=c.touches[0].clientX,e=c.touches[0].clientY):(i=c.clientX,e=c.clientY),o=i,t.sliderElement){const i=window.getComputedStyle(t.sliderElement),e=new DOMMatrixReadOnly(i.transform);r=e.m41}"mousedown"===c.type&&(window.addEventListener("mousemove",t.si),window.addEventListener("mouseup",t.ri))}},t.li=c=>{if(a)return;let h,l;"touchmove"===c.type?(h=c.touches[0].clientX,l=c.touches[0].clientY):(h=c.clientX,l=c.clientY);const p=h-i,u=l-e;if(!s&&!d){if(Math.abs(u)>Math.abs(p)&&Math.abs(u)>15)return void(s=!0);if(!(Math.abs(p)>15))return;d=!0,n=!0,t.sliderElement&&(t.sliderElement.style.transition="none",t.sliderElement.style.cursor="grabbing"),c.cancelable&&c.preventDefault()}if(s||!d)return;c.cancelable&&c.preventDefault(),o=h;let g=o-i;const m=0===t.currentIndex,f=t.currentIndex===t.cards.length-1;(m&&g>0||f&&g<0)&&(g*=.5*(.3+.7/(1+Math.abs(g)/(.5*t.slideWidth))));const v=r+g;t.sliderElement&&requestAnimationFrame(()=>{t.sliderElement.style.transform=`translateX(${v}px)`})},t.pi=e=>{if("mouseup"!==e.type&&"mouseleave"!==e.type||(window.removeEventListener("mousemove",t.si),window.removeEventListener("mouseup",t.ri)),a)return void(a=!1);const r=n;if(n=!1,s=!1,d=!1,a=!1,t.sliderElement){const i=t.Wt||"0.3s",e=t.Xt||"ease-out";t.sliderElement.style.transition=`transform ${i} ${e}`,t.sliderElement.style.cursor=""}if(!r||"touchcancel"===e.type)return void t.updateSlider();const c=o-i,h=.2*t.slideWidth;Math.abs(c)>h&&(c>0&&t.currentIndex>0?t.currentIndex--:c<0&&t.currentIndex<t.cards.length-1&&t.currentIndex++),t.updateSlider(!0)},t.ii=t.hi.bind(t),t.ei=t.li.bind(t),t.oi=t.pi.bind(t),t.ni=t.hi.bind(t),t.si=t.li.bind(t),t.ri=t.pi.bind(t),t.cardContainer.addEventListener("touchstart",t.ii,{passive:!0}),t.cardContainer.addEventListener("touchmove",t.ei,{passive:!1}),t.cardContainer.addEventListener("touchend",t.oi,{passive:!0}),t.cardContainer.addEventListener("touchcancel",t.oi,{passive:!0}),t.cardContainer.addEventListener("mousedown",t.ni)}(this),setTimeout(()=>{this.Zt()},200),this.initialized=!0}Mt(t,i){xt(t,i,this._t)}Nt(t,i,e){if(yt(t,i,e,this._t),!e&&this.kt.clear_search_on_uncheck&&this.kt.enable_search){const e=this.yt.get(t);if(e&&""!==e.trim()){i.summary,this.yt.delete(t),this.xt="";const e=this.cards.find(i=>i.entityId===t);if(e&&e.element){let i;i=e.element.classList.contains("todo-card-with-title-wrapper")?e.element.querySelector(".native-todo-card .add-textfield input"):e.element.querySelector(".add-textfield input"),i&&(i.value=""),this.cardBuilder.updateNativeTodoCard(e.element,t)}}}}Ot(t,i){this.dialogManager.editTodoItem(t,i)}di(){let t;this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeObserver=new ResizeObserver(()=>{t&&clearTimeout(t),t=setTimeout(()=>{if(!this.cardContainer)return;const t=this.cardContainer.offsetWidth;t>0&&Math.abs(t-this.slideWidth)>1&&(this.slideWidth=t,requestAnimationFrame(()=>{const t=getComputedStyle(this.cardContainer).borderRadius;this.cards.forEach(i=>{i.slide&&(i.slide.style.borderRadius=t)}),this.updateSlider(!1)}))},200)}),this.cardContainer&&this.resizeObserver.observe(this.cardContainer)}goToSlide(t){this.cards&&0!==this.cards.length&&this.initialized&&(t=Math.max(0,Math.min(t,this.cards.length-1)))!==this.currentIndex&&(this.currentIndex=t,this.updateSlider())}updateSlider(t=!0){this.sliderElement&&this.slideWidth&&0!==this.cards.length&&this.initialized&&requestAnimationFrame(()=>{if(!this.sliderElement||!this.cardContainer||!this.initialized)return;const i=this.Wt||"0.3s",e=this.Xt||"ease-out";this.sliderElement.style.transition=t?`transform ${i} ${e}`:"none";const o=this.kt.card_spacing||0;this.sliderElement.style.gap=`${o}px`;const n=this.currentIndex*(this.slideWidth+o);this.sliderElement.style.transform=`translateX(-${n}px)`;const s=getComputedStyle(this.cardContainer).borderRadius;var r;this.cards.forEach(t=>{t.slide&&(t.slide.style.marginRight="0px",t.slide.style.borderRadius=s)}),(r=this).paginationElement&&(r.paginationElement.querySelectorAll(".pagination-dot").forEach((t,i)=>{t.classList.toggle("active",i===r.currentIndex)}),vt(r)),this.kt.enable_search&&this.cards[this.currentIndex]})}getCardSize(){return 3}}class TodoSwipeCardEditor extends pt{static get properties(){return{hass:{type:Object},kt:{type:Object},ui:{type:Set,state:!0},gi:{type:String,state:!0}}}constructor(){super(),this.ui=new Set,this.gi="normal",this.mi=this.mi.bind(this)}async connectedCallback(){super.connectedCallback(),await this.fi(),this.requestUpdate()}async fi(){let t=0;for(;!customElements.get("ha-entity-picker")&&t<50;)await this.bi(),customElements.get("ha-entity-picker")||(await new Promise(t=>setTimeout(t,100)),t++);customElements.get("ha-entity-picker")||console.error("Failed to load ha-entity-picker after multiple attempts")}async bi(){if(!customElements.get("ha-entity-picker"))try{const t=[()=>customElements.get("hui-entities-card")?.getConfigElement?.(),()=>customElements.get("hui-entity-picker-card")?.getConfigElement?.()];for(const i of t)try{if(await i(),customElements.get("ha-entity-picker"))break}catch(t){}}catch(t){console.warn("Could not load ha-entity-picker",t)}}updated(t){super.updated(t),t.has("_config")&&this.kt&&this.kt.entities&&this.kt.entities.length>0&&(this.wi&&cancelAnimationFrame(this.wi),this.wi=requestAnimationFrame(()=>{const t=this.shadowRoot.querySelectorAll("ha-entity-picker");(0===t.length||t.length<this.kt.entities.length)&&this.requestUpdate(),this.wi=null}))}Ct(t){return"string"==typeof t?t:t?.entity||""}xi(t){const i={type:t.type,entities:t.entities,card_spacing:t.card_spacing,show_pagination:t.show_pagination,show_create:t.show_create,show_addbutton:t.show_addbutton,show_completed:t.show_completed,show_completed_menu:t.show_completed_menu,delete_confirmation:t.delete_confirmation,enable_search:t.enable_search,clear_search_on_uncheck:t.clear_search_on_uncheck},e=["type","entities","card_spacing","show_pagination","show_create","show_addbutton","show_completed","show_completed_menu","delete_confirmation","enable_search","clear_search_on_uncheck","custom_card_mod"];return Object.entries(t).forEach(([t,o])=>{e.includes(t)||(i[t]=o)}),t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(i.custom_card_mod=t.custom_card_mod),i}setConfig(t){if(JSON.stringify(t),this.kt={...this.constructor.getStubConfig()},t){let i=t.entities||[];Array.isArray(i)||(i="object"==typeof i?Object.values(i):"string"==typeof i?[i]:[]),i=i.map(t=>t);if(i.length>0&&(""===i[i.length-1]||"object"==typeof i[i.length-1]&&""===i[i.length-1].entity)){const t=i.slice(0,-1).filter(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim());i=[...t,""]}else i=i.filter(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim());let e=t.card_spacing;void 0===e?e=15:(e=parseInt(e),(isNaN(e)||e<0)&&(e=15));const o={...this.kt,...t,entities:i,card_spacing:e};t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(o.custom_card_mod=t.custom_card_mod),this.kt=o}JSON.stringify(this.kt),this.requestUpdate()}static getStubConfig(){return{entities:[],card_spacing:15,show_pagination:!0,show_icons:!1,show_create:!0,show_addbutton:!1,show_completed:!1,show_completed_menu:!1,delete_confirmation:!1,enable_search:!1,clear_search_on_uncheck:!1}}get yi(){return!1!==this.kt.show_pagination}get ki(){return!0===this.kt.show_addbutton}get _i(){return!1!==this.kt.show_create}get $i(){return!0===this.kt.show_completed}get zi(){return!0===this.kt.show_completed_menu}get Ci(){return!0===this.kt.delete_confirmation}get Si(){return!0===this.kt.show_icons}get Ti(){return!0===this.kt.enable_search}get Ei(){return!0===this.kt.clear_search_on_uncheck}get Di(){return void 0!==this.kt.card_spacing?this.kt.card_spacing:15}get Ai(){return(this.kt.entities||[]).filter(t=>{const i=this.Ct(t);return i&&""!==i.trim()})}get Mi(){return this.$i}get Ni(){return this.$i&&this.zi}get Oi(){return this.Ai.length>0}static get styles(){return p`
      ${p`
  /* Card config container */
  .card-config {
    /* Let HA handle padding */
  }

  /* MAIN SECTION STYLES */
  .section {
    margin: 16px 0;
    padding: 16px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 8px);
    background-color: var(--card-background-color, var(--primary-background-color));
  }

  .section-header {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    color: var(--primary-text-color);
  }

  ha-switch {
    padding: 8px 0;
  }
  .side-by-side {
    display: flex;
    align-items: center;
  }
  .side-by-side > * {
    flex: 1;
    padding-right: 8px;
  }

  /* Card row styles similar to simple-swipe-card */
  .card-list {
    margin-top: 8px;
    margin-bottom: 16px;
  }

  .card-row {
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 8px;
    background: var(--secondary-background-color);
  }

  .card-info {
    flex-grow: 1;
    display: flex;
    align-items: center;
    margin-right: 8px;
    overflow: hidden;
  }

  .card-index {
    font-weight: bold;
    margin-right: 10px;
    color: var(--secondary-text-color);
    flex-shrink: 0;
  }

  .card-type {
    font-size: 14px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-name {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-left: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .card-actions {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .card-actions ha-icon-button {
    --mdc-icon-button-size: 36px;
    color: var(--secondary-text-color);
  }

  .card-actions ha-icon-button:hover {
    color: var(--primary-text-color);
  }

  .no-cards {
    text-align: center;
    color: var(--secondary-text-color);
    padding: 16px;
    border: 1px dashed var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
    margin-bottom: 16px;
  }

  .expand-button {
    --mdc-icon-button-size: 32px;
    color: var(--secondary-text-color);
    margin: 0 8px 0 0;
    flex-shrink: 0;
    order: -1;
    transition:
      color 0.2s ease,
      transform 0.2s ease;
  }

  .expand-button:hover {
    color: #ffc107;
    background-color: rgba(255, 193, 7, 0.1);
  }

  .expand-button[aria-label*='Collapse'] {
    color: #ffc107;
  }

  .card-row:hover .expand-button {
    color: #ffc107;
  }

  .clickable-row {
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .clickable-row:hover {
    background: rgba(255, 193, 7, 0.1);
    border-color: rgba(255, 193, 7, 0.56);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .clickable-row:hover::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #ffc107;
    border-radius: 0 2px 2px 0;
  }

  .clickable-row.expanded {
    border-color: rgba(255, 193, 7, 0.56);
    background: rgba(255, 193, 7, 0.1);
  }

  .clickable-row.expanded::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #ffc107;
    border-radius: 0 2px 2px 0;
  }

  .clickable-row .card-actions {
    cursor: default;
  }

  .clickable-row .card-actions ha-icon-button {
    cursor: pointer;
  }

  .clickable-row:focus {
    outline: none;
    border-color: rgba(255, 193, 7, 0.56);
    background: rgba(255, 193, 7, 0.1);
  }

  .clickable-row .card-info {
    user-select: none;
  }

  .clickable-row:hover .expand-button {
    color: #ffc107;
    transform: scale(1.05);
  }

  .expanded-content {
    margin-top: 8px;
    margin-bottom: 8px;
    padding: 12px;
    background: var(--secondary-background-color);
    border: 1px solid var(--divider-color);
    border-radius: var(--ha-card-border-radius, 4px);
  }

  .expanded-content ha-entity-picker {
    width: 100% !important;
    margin-bottom: 12px !important;
    box-sizing: border-box !important;
  }

  .expanded-content ha-select {
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .expanded-content ha-textfield {
    width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  .expanded-content .toggle-option {
    margin: 8px 0 !important;
    padding: 0 !important;
    width: 100% !important;
    box-sizing: border-box !important;
  }

  .expanded-content .toggle-option ha-textfield {
    width: 100% !important;
    margin: 8px 0 0 0 !important;
    padding: 0 !important;
    box-sizing: border-box !important;
  }

  ha-formfield {
    display: block;
    padding: 8px 0;
  }

  .expanded-content > div[style*='padding: 8px'] {
    padding: 8px 0 !important;
  }

  .background-image-row {
    margin-top: 8px;
    width: 100%;
  }

  .background-image-row ha-textfield {
    width: 100%;
  }

  .background-help-text {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
    margin-bottom: 16px;
  }

  .conditional-field {
    padding-left: 16px;
    margin-top: 0;
    border-left: 1px solid var(--divider-color);
    width: calc(100% - 16px);
  }

  .add-entity-button {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .add-todo-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: var(--primary-color);
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    padding: 8px 16px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
  }

  .add-todo-button:hover {
    background-color: var(--secondary-background-color);
  }

  .add-todo-button.blocked {
    background-color: var(--error-color);
    color: white;
    border-color: var(--error-color);
    animation: shake 0.3s ease-in-out;
  }

  .add-todo-button.success {
    background-color: var(--success-color, #4caf50);
    color: white;
    border-color: var(--success-color, #4caf50);
  }

  @keyframes shake {
    0%,
    20%,
    40%,
    60%,
    80% {
      transform: translateX(0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-3px);
    }
  }

  .info-panel {
    display: flex;
    align-items: flex-start;
    padding: 12px;
    margin: 8px 0 24px 0;
    background-color: var(--primary-background-color);
    border-radius: 8px;
    border: 1px solid var(--divider-color);
  }

  .info-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--info-color, #4a90e2);
    color: white;
    margin-right: 12px;
    flex-shrink: 0;
  }

  .info-text {
    flex-grow: 1;
    color: var(--primary-text-color);
    font-size: 14px;
  }

  .version-display {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--divider-color);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .version-text {
    color: var(--secondary-text-color);
    font-size: 14px;
    font-weight: 500;
  }

  .version-badges {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .version-badge {
    background-color: var(--primary-color);
    color: var(--text-primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 14px;
    font-weight: 500;
  }

  .github-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    background-color: #24292e;
    color: white;
    border-radius: 16px;
    padding: 4px 12px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease;
  }

  .github-badge:hover {
    background-color: #444d56;
  }

  .github-badge ha-icon {
    --mdc-icon-size: 16px;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spacing-field {
    margin-top: 16px;
    margin-bottom: 16px;
    width: 100%;
  }

  .spacing-field ha-textfield {
    width: 100%;
    display: block;
  }

  .spacing-help-text {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin-top: 4px;
    margin-bottom: 16px;
  }

  .toggle-option {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 8px 0;
    width: 100%;
  }

  .toggle-option-label {
    font-size: 14px;
  }

  .version-info {
    font-size: 12px;
    color: var(--primary-color);
    margin-top: 4px;
  }

  .nested-toggle-option {
    margin-left: 16px;
    padding-left: 8px;
    border-left: 1px solid var(--divider-color);
  }
`}
    `}Ii(t,i){if(!this.kt?.entities)return;const e=[...this.kt.entities],o=t+i;if(o<0||o>=e.length)return;[e[t],e[o]]=[e[o],e[t]],this.ui.has(t)&&(this.ui.delete(t),this.ui.add(o)),this.ui.has(o)&&(this.ui.delete(o),this.ui.add(t));const n={...this.kt,entities:e};this.kt=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n}})),this.requestUpdate()}ji(t){this.ui.has(t)?this.ui.delete(t):(this.ui.clear(),this.ui.add(t)),this.requestUpdate()}Li(t){this.gi=t,this.requestUpdate(),setTimeout(()=>{this.gi="normal",this.requestUpdate()},"blocked"===t?1e3:500)}Hi(t=-1){if(!this.hass)return[];const i=Object.keys(this.hass.states).filter(t=>t.startsWith("todo.")&&this.hass.states[t]),e=(this.kt.entities||[]).map((i,e)=>e===t?null:this.Ct(i)).filter(t=>t&&""!==t.trim());return i.filter(t=>!e.includes(t))}Vi(t){const i=this.Ct(t);if(!i||""===i.trim())return{displayName:"Empty Entity",friendlyName:""};const e=this.hass?.states?.[i],o=e?.attributes?.friendly_name||i.split(".").pop().replace(/_/g," ");return{displayName:o,friendlyName:o}}Pi(t){if(!this.kt||!this.hass)return;const i=t.target,e=void 0!==i.checked?i.checked:i.value,o=i.configValue||i.getAttribute("data-config-value");if(o){const t=this.xi({...this.kt,[o]:e});this.kt=t,this.Fi(t)}}Fi(t){this.Ri&&clearTimeout(this.Ri),this.Ri=setTimeout(()=>{const i=this.xi(t);this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i}}))},150)}Ji(t){if(!this.kt)return;const i=parseInt(t.target.value);if(!isNaN(i)&&i>=0){const t=this.xi({...this.kt,card_spacing:i});this.kt=t,this.Fi(t)}}mi(t){if(t&&(t.preventDefault(),t.stopPropagation()),!this.kt)return;const i=Array.isArray(this.kt.entities)?[...this.kt.entities]:[];if(i.length>0&&(""===i[i.length-1]||"object"==typeof i[i.length-1]&&""===i[i.length-1].entity))return void this.Li("blocked");i.push({entity:""});const e={...this.kt,entities:i};this.kt=e,this.Li("success"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e},bubbles:!0,composed:!0})),setTimeout(()=>{this.requestUpdate()},0)}Ui(t){if(!this.kt||!Array.isArray(this.kt.entities))return;const i=[...this.kt.entities];i.splice(t,1),this.ui.delete(t);const e=new Set;this.ui.forEach(i=>{i>t?e.add(i-1):i<t&&e.add(i)}),this.ui=e;const o={...this.kt,entities:i};this.kt=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o}})),this.requestUpdate()}Bi(t){const i=parseInt(t.target.getAttribute("data-index"));if(isNaN(i))return;const e=t.detail?.value||t.target.value||"",o=[...this.kt.entities],n=o[i];o[i]="object"==typeof n?{...n,entity:e}:{entity:e};const s={...this.kt,entities:o};this.kt=s,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:s}})),this.requestUpdate()}Zi(t){const i=parseInt(t.target.getAttribute("data-index"));if(isNaN(i))return;const e=t.target.value||"none",o=[...this.kt.entities],n=o[i];o[i]="string"==typeof n?{entity:n,display_order:e}:{...n,display_order:e};const s={...this.kt,entities:o};this.kt=s,this.Fi(s)}qi(t){const i=parseInt(t.target.getAttribute("data-index"));if(isNaN(i))return;const e=t.target.value||"",o=[...this.kt.entities],n=o[i];if("string"==typeof n){const t={entity:n};e&&(t.background_image=e),o[i]=t}else if(e)o[i]={...n,background_image:e};else{const t={...n};delete t.background_image,o[i]=t}const s={...this.kt,entities:o};this.kt=s,this.Fi(s)}Wi(t){const i=parseInt(t.target.getAttribute("data-index"));if(isNaN(i))return;const e=t.target.checked,o=[...this.kt.entities],n=o[i];o[i]="string"==typeof n?{entity:n,show_title:e}:{...n,show_title:e};const s={...this.kt,entities:o};this.kt=s,this.Fi(s)}Xi(t){const i=parseInt(t.target.getAttribute("data-index"));if(isNaN(i))return;const e=t.target.value||"",o=[...this.kt.entities],n=o[i];if("string"==typeof n){const t={entity:n};e&&(t.title=e),o[i]=t}else if(e)o[i]={...n,title:e};else{const t={...n};delete t.title,o[i]=t}const s={...this.kt,entities:o};this.kt=s,this.Fi(s)}Ki(t){const i=parseInt(t.target.getAttribute("data-index"));if(isNaN(i))return;const e=t.target.value||"",o=[...this.kt.entities],n=o[i];if("string"==typeof n){const t={entity:n};e&&(t.icon=e),o[i]=t}else if(e)o[i]={...n,icon:e};else{const t={...n};delete t.icon,o[i]=t}const s={...this.kt,entities:o};this.kt=s,this.Fi(s)}Gi(t){const i=parseInt(t.target.getAttribute("data-index"));if(isNaN(i))return;const e=t.target.checked,o=[...this.kt.entities],n=o[i];if("string"==typeof n)e&&(o[i]={entity:n,hide_future_items:!0});else if(e)o[i]={...n,hide_future_items:!0};else{const t={...n};delete t.hide_future_items,o[i]=t}const s={...this.kt,entities:o};this.kt=s,this.Fi(s)}Yi(t){const i=parseInt(t.target.getAttribute("data-index"));if(isNaN(i))return;const e=parseInt(t.target.value),o=[...this.kt.entities],n=o[i];if("string"==typeof n)!isNaN(e)&&e>=1&&(o[i]={entity:n,max_items:e});else if(!isNaN(e)&&e>=1)o[i]={...n,max_items:e};else{const t={...n};delete t.max_items,o[i]=t}const s={...this.kt,entities:o};this.kt=s,this.Fi(s)}Qi(t){const i=this.kt.entities[t];return"string"==typeof i?{entity:i,display_order:"none",show_title:!1,title:"",background_image:"",hide_future_items:!1,max_items:void 0}:{entity:i?.entity||"",display_order:i?.display_order||"none",show_title:i?.show_title||!1,title:i?.title||"",background_image:i?.background_image||"",icon:i?.icon||"",hide_future_items:i?.hide_future_items||!1,max_items:i?.max_items||void 0}}te(){return[{value:i,label:"Default"},{value:e,label:"Alphabetical A-Z"},{value:o,label:"Alphabetical Z-A"},{value:n,label:"Due Date (Earliest First)"},{value:s,label:"Due Date (Latest First)"}]}ie(t,i){t.stopPropagation(),this.ji(i)}ee(t,i){t.stopPropagation(),i()}oe(t,i){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),t.stopPropagation(),this.ji(i))}ne(t){t.stopPropagation(),t.preventDefault()}render(){if(!this.hass||!this.kt)return W`<div>Loading...</div>`;const i=Array.isArray(this.kt.entities)?this.kt.entities:[];return JSON.stringify(this.kt),W`
      <div class="card-config">
        <!-- Todo Lists Section -->
        <div class="section">
          <div class="section-header">Todo Lists</div>

          <div class="card-list">
            ${0===i.length?W`<div class="no-cards">
                  No todo lists added yet. Click "+ ADD TODO LIST" below to add your first list.
                </div>`:i.map((t,e)=>{const o=this.Vi(t),n=this.ui.has(e),s=this.Qi(e);return W`
                    <div
                      class="card-row clickable-row ${n?"expanded":""}"
                      data-index=${e}
                      @click=${()=>this.ji(e)}
                      role="button"
                      tabindex="0"
                      aria-expanded=${n}
                      aria-label="Todo list ${e+1}: ${o.displayName}. Click to ${n?"collapse":"expand"}"
                      @keydown=${t=>this.oe(t,e)}
                    >
                      <div class="card-info">
                        <ha-icon-button
                          class="expand-button leading"
                          label=${n?"Collapse":"Expand"}
                          path=${n?"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z":"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"}
                          @click=${t=>this.ie(t,e)}
                        ></ha-icon-button>
                        <span class="card-index">${e+1}</span>
                        <span class="card-type">${o.displayName}</span>
                        ${s.entity&&""!==s.entity.trim()?W`<span class="card-name">(${s.entity})</span>`:W`<span class="card-name" style="color: var(--error-color);"
                              >(Not configured)</span
                            >`}
                      </div>
                      <div class="card-actions" @click=${this.ne}>
                        <ha-icon-button
                          label="Move Up"
                          ?disabled=${0===e}
                          path="M7,15L12,10L17,15H7Z"
                          @click=${t=>this.ee(t,()=>this.Ii(e,-1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Move Down"
                          ?disabled=${e===i.length-1}
                          path="M7,9L12,14L17,9H7Z"
                          @click=${t=>this.ee(t,()=>this.Ii(e,1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Delete Todo List"
                          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                          @click=${t=>this.ee(t,()=>this.Ui(e))}
                          style="color: var(--error-color);"
                        ></ha-icon-button>
                      </div>
                    </div>
                    ${n?W`
                          <div class="expanded-content">
                            <ha-entity-picker
                              .hass=${this.hass}
                              .value=${s.entity}
                              .includeDomains=${["todo"]}
                              .includeEntities=${this.Hi(e)}
                              data-index=${e}
                              @value-changed=${this.Bi}
                              allow-custom-entity
                              label="Todo Entity"
                            ></ha-entity-picker>

                            ${s.entity&&""!==s.entity.trim()?W`
                                  <div
                                    style="margin: 8px 0; background: var(--secondary-background-color); border-radius: 4px;"
                                  >
                                    <div class="toggle-option" style="margin: 8px 0;">
                                      <div class="toggle-option-label">Show Title</div>
                                      <ha-switch
                                        .checked=${s.show_title}
                                        data-index=${e}
                                        @change=${this.Wi}
                                      ></ha-switch>
                                    </div>

                                    ${s.show_title?W`
                                          <ha-textfield
                                            label="Title Text"
                                            .value=${s.title}
                                            data-index=${e}
                                            @input=${this.Xi}
                                            style="width: 100%; margin-top: 8px;"
                                          ></ha-textfield>
                                        `:""}
                                  </div>

                                  <ha-select
                                    .label=${"Display Order"}
                                    .value=${s.display_order}
                                    data-index=${e}
                                    @selected=${this.Zi}
                                    @closed=${this.ne}
                                    style="margin-bottom: 4px;"
                                  >
                                    ${this.te().map(t=>W`
                                        <mwc-list-item .value=${t.value}>
                                          ${t.label}
                                        </mwc-list-item>
                                      `)}
                                  </ha-select>

                                  <ha-textfield
                                    label="Background Image URL"
                                    .value=${s.background_image}
                                    data-index=${e}
                                    @input=${this.qi}
                                    style="width: 100%; margin-top: 4px;"
                                    placeholder="Optional: e.g. /local/images/background.jpg"
                                  ></ha-textfield>

                                  ${this.Si?W`
                                        <ha-textfield
                                          label="Custom Icon"
                                          .value=${s.icon}
                                          data-index=${e}
                                          @input=${this.Ki}
                                          style="width: 100%; margin-top: 8px;"
                                          placeholder="Optional: e.g. mdi:cart-variant"
                                        ></ha-textfield>
                                      `:""}

                                  <div
                                    style="margin: 12px 0 8px 0; background: var(--secondary-background-color); border-radius: 4px; padding: 8px;"
                                  >
                                    <div
                                      style="font-weight: 500; margin-bottom: 8px; color: var(--primary-text-color);"
                                    >
                                      Filtering Options
                                    </div>

                                    <div class="toggle-option" style="margin: 8px 0;">
                                      <div class="toggle-option-label">
                                        Hide future items
                                        <div
                                          style="font-size: 0.85em; color: var(--secondary-text-color); margin-top: 2px;"
                                        >
                                          Only show tasks due today or earlier
                                        </div>
                                      </div>
                                      <ha-switch
                                        .checked=${s.hide_future_items}
                                        data-index=${e}
                                        @change=${this.Gi}
                                      ></ha-switch>
                                    </div>

                                    <ha-textfield
                                      label="Maximum items to show"
                                      type="number"
                                      min="1"
                                      .value=${s.max_items||""}
                                      data-index=${e}
                                      @input=${this.Yi}
                                      style="width: 100%; margin-top: 8px;"
                                      placeholder="Optional: limit incomplete items"
                                    >
                                      <div slot="helper">
                                        Limits number of incomplete items displayed (completed items
                                        always shown)
                                      </div>
                                    </ha-textfield>
                                  </div>
                                `:""}
                          </div>
                        `:""}
                  `})}
          </div>

          <div class="add-entity-button">
            <button
              class="add-todo-button ${"normal"!==this.gi?this.gi:""}"
              @click=${t=>this.mi(t)}
            >
              <svg style="width:20px;height:20px;margin-right:8px" viewBox="0 0 24 24">
                <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              ADD TODO LIST
            </button>
          </div>
        </div>

        <!-- Display Options Section -->
        <div class="section">
          <div class="section-header">Display Options</div>

          <div class="spacing-field">
            <ha-textfield
              type="number"
              min="0"
              max="100"
              label="Card Spacing (px)"
              .value=${this.Di}
              @change=${this.Ji}
              data-config-value="card_spacing"
              suffix="px"
            ></ha-textfield>
            <div class="spacing-help-text">Visual gap between cards when swiping (in pixels)</div>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show pagination dots</div>
            <ha-switch
              .checked=${this.yi}
              data-config-value="show_pagination"
              @change=${this.Pi}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show icons</div>
            <ha-switch
              .checked=${this.Si}
              data-config-value="show_icons"
              @change=${this.Pi}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show 'Add item' field</div>
            <ha-switch
              .checked=${this._i}
              data-config-value="show_create"
              @change=${this.Pi}
            ></ha-switch>
          </div>

          ${this._i?W`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show '+' add button next to field</div>
                    <ha-switch
                      .checked=${this.ki}
                      data-config-value="show_addbutton"
                      @change=${this.Pi}
                    ></ha-switch>
                  </div>

                  <div class="toggle-option">
                    <div class="toggle-option-label">Enable search functionality</div>
                    <ha-switch
                      .checked=${this.Ti}
                      data-config-value="enable_search"
                      @change=${this.Pi}
                    ></ha-switch>
                  </div>

                  ${this.Ti?W`
                        <div class="nested-toggle-option">
                          <div class="toggle-option">
                            <div class="toggle-option-label">
                              Clear search when unchecking items
                              <div
                                style="font-size: 0.85em; color: var(--secondary-text-color); margin-top: 2px;"
                              >
                                Resets search when marking a completed item as active
                              </div>
                            </div>
                            <ha-switch
                              .checked=${this.Ei}
                              data-config-value="clear_search_on_uncheck"
                              @change=${this.Pi}
                            ></ha-switch>
                          </div>
                        </div>
                      `:""}
                </div>
              `:""}

          <div class="toggle-option">
            <div class="toggle-option-label">Show completed items</div>
            <ha-switch
              .checked=${this.$i}
              data-config-value="show_completed"
              @change=${this.Pi}
            ></ha-switch>
          </div>

          ${this.$i?W`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show 'Delete completed' button</div>
                    <ha-switch
                      .checked=${this.zi}
                      data-config-value="show_completed_menu"
                      @change=${this.Pi}
                    ></ha-switch>
                  </div>

                  ${this.zi?W`
                        <div class="nested-toggle-option">
                          <div class="toggle-option">
                            <div class="toggle-option-label">Show delete confirmation dialog</div>
                            <ha-switch
                              .checked=${this.Ci}
                              data-config-value="delete_confirmation"
                              @change=${this.Pi}
                            ></ha-switch>
                          </div>
                        </div>
                      `:""}
                </div>
              `:""}
        </div>

        <!-- Version Display with GitHub Link -->
        <div class="version-display">
          <div class="version-text">Todo Swipe Card</div>
          <div class="version-badges">
            <div class="version-badge">v${t}</div>
            <a
              href="https://github.com/nutteloost/todo-swipe-card"
              target="_blank"
              rel="noopener noreferrer"
              class="github-badge"
            >
              <ha-icon icon="mdi:github"></ha-icon>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    `}}function Ot(t,i,e,o,n,s,r,a,d){t.addEventListener("dragover",i=>{i.preventDefault(),i.dataTransfer.dropEffect="move";const n=o.querySelector(".dragging");if(!n||n===t)return;const s=t.getBoundingClientRect(),r=s.top+s.height/2,a=i.clientY<r?"top":"bottom";e.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom")),"top"===a?t.classList.add("drag-over-top"):t.classList.add("drag-over-bottom")}),t.addEventListener("drop",async n=>{n.preventDefault(),n.stopPropagation();const s=o.querySelector(".dragging");if(!s||s===t)return void e.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom"));const c=n.dataTransfer.getData("text/plain"),h=a.find(t=>t.uid===c);if(!h)return void e.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom"));const l=t.getBoundingClientRect(),p=l.top+l.height/2,u=n.clientY<p;let g=null;if(u){const t=a.findIndex(t=>t.uid===i.uid);t>0&&(g=a[t-1].uid)}else g=i.uid;const m=a.findIndex(t=>t.uid===c),f=a.findIndex(t=>t.uid===i.uid);if(u&&f===m+1||!u&&f===m-1)return void e.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom"));e.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom")),h.summary;const{moveItem:v}=await Promise.resolve().then(function(){return Dt});await v(r,c,g,d)})}customElements.define("todo-swipe-card",TodoSwipeCard),customElements.define("todo-swipe-card-editor",TodoSwipeCardEditor),window.customCards||(window.customCards=[]),window.customCards.some(t=>"todo-swipe-card"===t.type)||window.customCards.push({type:"todo-swipe-card",name:"Todo Swipe Card",preview:!0,description:"A specialized swipe card for to-do lists"}),console.info(`%c TODO-SWIPE-CARD %c v${t} %c - A swipeable card for to-do lists`,"color: white; background: #4caf50; font-weight: 700;","color: #4caf50; background: white; font-weight: 700;","color: grey; background: white; font-weight: 400;");var It=/*#__PURE__*/Object.freeze({__proto__:null,setupDragAndDrop:function(t,i,e,o){const n=t.querySelectorAll('.todo-item[data-supports-drag="true"]');let s=null,r=null;if("ontouchstart"in window||navigator.maxTouchPoints>0)return void n.forEach((a,d)=>{const c=e[d];c&&(a.setAttribute("draggable","true"),function(t,i,e,o,n,s,r,a,d){t.addEventListener("dragstart",e=>{if(e.target.closest("ha-checkbox")||e.target.closest(".todo-checkbox"))return void e.preventDefault();t.classList.add("dragging"),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",i.uid);const o=document.createElement("div");o.style.cssText="position: absolute; top: -1000px; width: 1px; height: 1px; opacity: 0;",document.body.appendChild(o),e.dataTransfer.setDragImage(o,0,0),setTimeout(()=>{document.body.removeChild(o)},0),i.summary}),t.addEventListener("dragend",()=>{t.classList.remove("dragging"),e.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom")),i.summary}),Ot(t,i,e,o,n,s,r,a,d)}(a,c,n,t,s,r,i,e,o))});n.forEach((a,d)=>{const c=e[d];if(!c)return;a.setAttribute("draggable","false");let h=null,l=0,p=0,u=!1,g=!1;const m=t=>{const i="mouseleave"===t.type,e="mouseup"===t.type;if(g&&h){if(i)return void c.summary;if(e)return clearTimeout(h),h=null,g=!1,void c.summary}if(a.classList.contains("dragging"))c.summary;else{if(u){if(i)return void c.summary;if(e)return c.summary,a.setAttribute("draggable","false"),a.classList.remove("drag-ready"),u=!1,void(g=!1)}setTimeout(()=>{a.classList.contains("dragging")||u||(a.setAttribute("draggable","false"),a.classList.remove("drag-ready"),u=!1,g=!1)},100)}};a.addEventListener("mousedown",t=>{t.target.closest("ha-checkbox")||t.target.closest(".todo-checkbox")||(l=t.clientX,p=t.clientY,u=!1,g=!0,h=setTimeout(()=>{u=!0,g=!1,a.setAttribute("draggable","true"),a.classList.add("drag-ready"),navigator.vibrate&&navigator.vibrate(50),c.summary},200),c.summary)}),a.addEventListener("mousemove",t=>{if(!g||!h)return;const i=Math.abs(t.clientX-l),e=Math.abs(t.clientY-p);(i>8||e>8)&&(clearTimeout(h),h=null,g=!1,c.summary)}),a.addEventListener("mouseup",m),a.addEventListener("mouseleave",m),a.addEventListener("dragstart",t=>{if(t.target.closest("ha-checkbox")||t.target.closest(".todo-checkbox"))return void t.preventDefault();if(!u)return t.preventDefault(),void c.summary;a.classList.add("dragging"),a.classList.remove("drag-ready"),t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",c.uid);const i=document.createElement("div");i.style.cssText="position: absolute; top: -1000px; width: 1px; height: 1px; opacity: 0;",document.body.appendChild(i),t.dataTransfer.setDragImage(i,0,0),setTimeout(()=>{document.body.removeChild(i)},0),c.summary}),a.addEventListener("dragend",()=>{a.classList.remove("dragging","drag-ready"),a.setAttribute("draggable","false"),u=!1,g=!1,n.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom")),s=null,r=null,c.summary}),Ot(a,c,n,t,s,r,i,e,o)})}});export{TodoSwipeCard,TodoSwipeCardEditor};
