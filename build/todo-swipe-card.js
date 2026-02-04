const t="3.5.2",e="none",i="alpha_asc",o="alpha_desc",n="duedate_asc",r="duedate_desc",s=(t,e)=>{},a=globalThis,d=a.ShadowRoot&&(void 0===a.ShadyCSS||a.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,c=Symbol(),l=new WeakMap;let h=class t{constructor(t,e,i){if(this.i=!0,i!==c)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(d&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=l.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&l.set(e,t))}return t}toString(){return this.cssText}};const p=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t.i)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new h(i,t,c)},u=d?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new h("string"==typeof t?t:t+"",void 0,c))(e)})(t):t,{is:g,defineProperty:m,getOwnPropertyDescriptor:f,getOwnPropertyNames:v,getOwnPropertySymbols:b,getPrototypeOf:w}=Object,x=globalThis,y=x.trustedTypes,k=y?y.emptyScript:"",_=x.reactiveElementPolyfillSupport,$=(t,e)=>t,z={toAttribute(t,e){switch(e){case Boolean:t=t?k:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},S=(t,e)=>!g(t,e),C={attribute:!0,type:String,converter:z,reflect:!1,useDefault:!1,hasChanged:S};Symbol.metadata??=Symbol("metadata"),x.litPropertyMetadata??=new WeakMap;let T=class t extends HTMLElement{static addInitializer(t){this.m(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.v&&[...this.v.keys()]}static createProperty(t,e=C){if(e.state&&(e.attribute=!1),this.m(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&m(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:n}=f(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const r=o?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??C}static m(){if(this.hasOwnProperty($("elementProperties")))return;const t=w(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty($("finalized")))return;if(this.finalized=!0,this.m(),this.hasOwnProperty($("properties"))){const t=this.properties,e=[...v(t),...b(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this.v=new Map;for(const[t,e]of this.elementProperties){const i=this._(t,e);void 0!==i&&this.v.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(u(t))}else void 0!==t&&e.push(u(t));return e}static _(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this.S=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.D=null,this.A()}A(){this.M=new Promise(t=>this.enableUpdating=t),this.N=new Map,this.I(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.L??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this.L?.delete(t)}I(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this.S=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{if(d)t.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of e){const e=document.createElement("style"),o=a.litNonce;void 0!==o&&e.setAttribute("nonce",o),e.textContent=i.cssText,t.appendChild(e)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.L?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.L?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this.H(t,i)}P(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._(t,i);if(void 0!==o&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:z).toAttribute(e,i.type);this.D=t,null==n?this.removeAttribute(o):this.setAttribute(o,n),this.D=null}}H(t,e){const i=this.constructor,o=i.v.get(t);if(void 0!==o&&this.D!==o){const t=i.getPropertyOptions(o),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:z;this.D=o;const r=n.fromAttribute(e,t.type);this[o]=r??this.V?.get(o)??r,this.D=null}}requestUpdate(t,e,i){if(void 0!==t){const o=this.constructor,n=this[t];if(i??=o.getPropertyOptions(t),!((i.hasChanged??S)(n,e)||i.useDefault&&i.reflect&&n===this.V?.get(t)&&!this.hasAttribute(o._(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this.M=this.F())}C(t,e,{useDefault:i,reflect:o,wrapped:n},r){i&&!(this.V??=new Map).has(t)&&(this.V.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this.N.has(t)||(this.hasUpdated||i||(e=void 0),this.N.set(t,e)),!0===o&&this.D!==t&&(this.R??=new Set).add(t))}async F(){this.isUpdatePending=!0;try{await this.M}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.S){for(const[t,e]of this.S)this[t]=e;this.S=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this.N.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this.N;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this.L?.forEach(t=>t.hostUpdate?.()),this.update(e)):this.U()}catch(e){throw t=!1,this.U(),e}t&&this.J(e)}willUpdate(t){}J(t){this.L?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}U(){this.N=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.M}shouldUpdate(t){return!0}update(t){this.R&&=this.R.forEach(t=>this.P(t,this[t])),this.U()}updated(t){}firstUpdated(t){}};T.elementStyles=[],T.shadowRootOptions={mode:"open"},T[$("elementProperties")]=new Map,T[$("finalized")]=new Map,_?.({ReactiveElement:T}),(x.reactiveElementVersions??=[]).push("2.1.1");const D=globalThis,E=D.trustedTypes,A=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,M="$lit$",N=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+N,I=`<${O}>`,j=document,L=()=>j.createComment(""),H=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,V="[ \t\n\f\r]",F=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,R=/-->/g,U=/>/g,J=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),B=/'/g,Z=/"/g,q=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...i)=>({B:t,strings:e,values:i}))(1),X=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),G=new WeakMap,Y=j.createTreeWalker(j,129);function Q(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==A?A.createHTML(e):e}const tt=(t,e)=>{const i=t.length-1,o=[];let n,r=2===e?"<svg>":3===e?"<math>":"",s=F;for(let e=0;e<i;e++){const i=t[e];let a,d,c=-1,l=0;for(;l<i.length&&(s.lastIndex=l,d=s.exec(i),null!==d);)l=s.lastIndex,s===F?"!--"===d[1]?s=R:void 0!==d[1]?s=U:void 0!==d[2]?(q.test(d[2])&&(n=RegExp("</"+d[2],"g")),s=J):void 0!==d[3]&&(s=J):s===J?">"===d[0]?(s=n??F,c=-1):void 0===d[1]?c=-2:(c=s.lastIndex-d[2].length,a=d[1],s=void 0===d[3]?J:'"'===d[3]?Z:B):s===Z||s===B?s=J:s===R||s===U?s=F:(s=J,n=void 0);const h=s===J&&t[e+1].startsWith("/>")?" ":"";r+=s===F?i+I:c>=0?(o.push(a),i.slice(0,c)+M+i.slice(c)+N+h):i+N+(-2===c?e:h)}return[Q(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class et{constructor({strings:t,B:e},i){let o;this.parts=[];let n=0,r=0;const s=t.length-1,a=this.parts,[d,c]=tt(t,e);if(this.el=et.createElement(d,i),Y.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=Y.nextNode())&&a.length<s;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(M)){const e=c[r++],i=o.getAttribute(t).split(N),s=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:s[2],strings:i,ctor:"."===s[1]?st:"?"===s[1]?at:"@"===s[1]?dt:rt}),o.removeAttribute(t)}else t.startsWith(N)&&(a.push({type:6,index:n}),o.removeAttribute(t));if(q.test(o.tagName)){const t=o.textContent.split(N),e=t.length-1;if(e>0){o.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],L()),Y.nextNode(),a.push({type:2,index:++n});o.append(t[e],L())}}}else if(8===o.nodeType)if(o.data===O)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=o.data.indexOf(N,t+1));)a.push({type:7,index:n}),t+=N.length-1}n++}}static createElement(t,e){const i=j.createElement("template");return i.innerHTML=t,i}}function it(t,e,i=t,o){if(e===X)return e;let n=void 0!==o?i.Z?.[o]:i.q;const r=H(e)?void 0:e.W;return n?.constructor!==r&&(n?.X?.(!1),void 0===r?n=void 0:(n=new r(t),n.K(t,i,o)),void 0!==o?(i.Z??=[])[o]=n:i.q=n),void 0!==n&&(e=it(t,n.G(t,e.values),n,o)),e}class ot{constructor(t,e){this.Y=[],this.tt=void 0,this.et=t,this.it=e}get parentNode(){return this.it.parentNode}get ot(){return this.it.ot}u(t){const{el:{content:e},parts:i}=this.et,o=(t?.creationScope??j).importNode(e,!0);Y.currentNode=o;let n=Y.nextNode(),r=0,s=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new nt(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new ct(n,this,t)),this.Y.push(e),a=i[++s]}r!==a?.index&&(n=Y.nextNode(),r++)}return Y.currentNode=j,o}p(t){let e=0;for(const i of this.Y)void 0!==i&&(void 0!==i.strings?(i.nt(t,i,e),e+=i.strings.length-2):i.nt(t[e])),e++}}class nt{get ot(){return this.it?.ot??this.rt}constructor(t,e,i,o){this.type=2,this.st=K,this.tt=void 0,this.dt=t,this.ct=e,this.it=i,this.options=o,this.rt=o?.isConnected??!0}get parentNode(){let t=this.dt.parentNode;const e=this.it;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this.dt}get endNode(){return this.ct}nt(t,e=this){t=it(this,t,e),H(t)?t===K||null==t||""===t?(this.st!==K&&this.lt(),this.st=K):t!==this.st&&t!==X&&this.ht(t):void 0!==t.B?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this.ht(t)}O(t){return this.dt.parentNode.insertBefore(t,this.ct)}T(t){this.st!==t&&(this.lt(),this.st=this.O(t))}ht(t){this.st!==K&&H(this.st)?this.dt.nextSibling.data=t:this.T(j.createTextNode(t)),this.st=t}$(t){const{values:e,B:i}=t,o="number"==typeof i?this.ut(t):(void 0===i.el&&(i.el=et.createElement(Q(i.h,i.h[0]),this.options)),i);if(this.st?.et===o)this.st.p(e);else{const t=new ot(o,this),i=t.u(this.options);t.p(e),this.T(i),this.st=t}}ut(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new et(t)),e}k(t){P(this.st)||(this.st=[],this.lt());const e=this.st;let i,o=0;for(const n of t)o===e.length?e.push(i=new nt(this.O(L()),this.O(L()),this,this.options)):i=e[o],i.nt(n),o++;o<e.length&&(this.lt(i&&i.ct.nextSibling,o),e.length=o)}lt(t=this.dt.nextSibling,e){for(this.gt?.(!1,!0,e);t!==this.ct;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){void 0===this.it&&(this.rt=t,this.gt?.(t))}}class rt{get tagName(){return this.element.tagName}get ot(){return this.it.ot}constructor(t,e,i,o,n){this.type=1,this.st=K,this.tt=void 0,this.element=t,this.name=e,this.it=o,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this.st=Array(i.length-1).fill(new String),this.strings=i):this.st=K}nt(t,e=this,i,o){const n=this.strings;let r=!1;if(void 0===n)t=it(this,t,e,0),r=!H(t)||t!==this.st&&t!==X,r&&(this.st=t);else{const o=t;let s,a;for(t=n[0],s=0;s<n.length-1;s++)a=it(this,o[i+s],e,s),a===X&&(a=this.st[s]),r||=!H(a)||a!==this.st[s],a===K?t=K:t!==K&&(t+=(a??"")+n[s+1]),this.st[s]=a}r&&!o&&this.j(t)}j(t){t===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class st extends rt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===K?void 0:t}}class at extends rt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==K)}}class dt extends rt{constructor(t,e,i,o,n){super(t,e,i,o,n),this.type=5}nt(t,e=this){if((t=it(this,t,e,0)??K)===X)return;const i=this.st,o=t===K&&i!==K||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==K&&(i===K||o);o&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this.st=t}handleEvent(t){"function"==typeof this.st?this.st.call(this.options?.host??this.element,t):this.st.handleEvent(t)}}class ct{constructor(t,e,i){this.element=t,this.type=6,this.tt=void 0,this.it=e,this.options=i}get ot(){return this.it.ot}nt(t){it(this,t)}}const lt=D.litHtmlPolyfillSupport;lt?.(et,nt),(D.litHtmlVersions??=[]).push("3.3.1");const ht=globalThis;class pt extends T{constructor(){super(...arguments),this.renderOptions={host:this},this.ft=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.ft=((t,e,i)=>{const o=i?.renderBefore??e;let n=o.vt;if(void 0===n){const t=i?.renderBefore??null;o.vt=n=new nt(e.insertBefore(L(),t),t,void 0,i??{})}return n.nt(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.ft?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.ft?.setConnected(!1)}render(){return X}}pt.bt=!0,pt.finalized=!0,ht.litElementHydrateSupport?.({LitElement:pt});const ut=ht.litElementPolyfillSupport;ut?.({LitElement:pt}),(ht.litElementVersions??=[]).push("4.2.1");function gt(t){const e=document.createElement("div");e.className="preview-container";const i=document.createElement("div");i.className="preview-icon-container";const o=document.createElement("ha-icon");o.icon="mdi:format-list-checks",i.appendChild(o);const n=document.createElement("div");n.className="preview-text-container";const r=document.createElement("div");r.className="preview-title",r.textContent="Todo Swipe Card";const s=document.createElement("div");s.className="preview-description",s.textContent="A specialized swipe card for todo lists with native styling. Supports multiple lists with swipe navigation.",n.appendChild(r),n.appendChild(s);const a=document.createElement("div");a.className="preview-actions";const d=document.createElement("ha-button");d.raised=!0,d.textContent="EDIT CARD",d.setAttribute("aria-label","Edit Card"),d.addEventListener("click",t=>{t.stopPropagation();const e=new CustomEvent("show-edit-card",{detail:{element:t.target.closest("todo-swipe-card")},bubbles:!0,composed:!0});t.target.dispatchEvent(e)}),a.appendChild(d),e.appendChild(i),e.appendChild(n),e.appendChild(a),t.appendChild(e)}function mt(t,e){const i=document.createElement("div");i.className="todo-card-with-title-wrapper";const o=document.createElement("div");o.className="todo-swipe-card-external-title",o.textContent=e;const n=document.createElement("div");return n.className="todo-card-container",i.appendChild(o),n.appendChild(t),i.appendChild(n),i}function ft(t,e,i){let o="mdi:format-list-checks";if("object"==typeof t&&t.icon)o=t.icon;else if(i&&i.states[e]){const t=i.states[e].attributes.icon;t&&(o=t)}const n=document.createElement("ha-icon");return n.className="todo-icon",n.icon=o,n}function vt(t){const e=document.createElement("div"),i=bt(t),o=new Date,n=i&&i<o;e.className="todo-due "+(n?"overdue":"");const r=document.createElement("ha-svg-icon");if(r.className="todo-due-icon",r.path="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z",e.appendChild(r),i){if(!t.includes("T")&&wt(new Date,i)){const t=document.createElement("span");t.textContent="Today",e.appendChild(t)}else{if(Math.abs(i.getTime()-o.getTime())<36e5){const t=document.createElement("span");e.appendChild(t);const o=()=>{const o=new Date,n=i.getTime()-o.getTime(),r=n<0;if(e.classList.toggle("overdue",r),Math.abs(n)<6e4){const e=Math.round(Math.abs(n)/1e3);t.textContent=e<5?"now":n<0?`${e} seconds ago`:`in ${e} seconds`}else{const e=Math.round(Math.abs(n)/6e4);t.textContent=n<0?`${e} minute${1!==e?"s":""} ago`:`in ${e} minute${1!==e?"s":""}`}};o();const n=setInterval(o,1e3),r=new MutationObserver(t=>{t.forEach(t=>{"childList"===t.type&&t.removedNodes.forEach(t=>{(t===e||t.contains?.(e))&&(clearInterval(n),r.disconnect())})})});e.parentNode&&r.observe(e.parentNode,{childList:!0,subtree:!0})}else{const t=document.createElement("ha-relative-time");t.setAttribute("capitalize",""),t.datetime=i,e.appendChild(t)}}}else{const i=document.createElement("span");i.textContent=t,e.appendChild(i)}return e}function bt(t){if(!t)return null;try{if(t.includes("T"))return new Date(t);{const e=new Date(`${t}T00:00:00`);return e.setHours(23,59,59,999),isNaN(e.getTime())?null:e}}catch(t){return null}}function wt(t,e){return t.getFullYear()===e.getFullYear()&&t.getMonth()===e.getMonth()&&t.getDate()===e.getDate()}var xt=/*#__PURE__*/Object.freeze({__proto__:null,buildPreview:gt,createCardWithTitle:mt,createDueDateElement:vt,createIconElement:ft,isSameDay:wt,parseDueDate:bt});function yt(t,e,i){setTimeout(()=>{!function(t,e,i){let o;o=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .add-textfield input"):t.querySelector(".add-textfield input");if(!o)return;if(i.wt.has(e)){const t=i.wt.get(e);t.inputHandler&&o.removeEventListener("input",t.inputHandler)}const n=o=>function(t,e,i,o){const n=t.target.value;o.xt=n,""===n.trim()?o.yt.delete(e):o.yt.set(e,n);o.cardBuilder.updateNativeTodoCard(i,e)}(o,e,t,i);o.addEventListener("input",n),i.wt.set(e,{inputHandler:n,inputElement:o})}(t,e,i)},100)}function kt(t){if(!t.paginationElement)return;let e="";if(t.kt.card_mod&&t.kt.card_mod.style&&"string"==typeof t.kt.card_mod.style){const i=t.kt.card_mod.style;["--todo-swipe-card-pagination-dot-inactive-color","--todo-swipe-card-pagination-dot-active-color","--todo-swipe-card-pagination-dot-size","--todo-swipe-card-pagination-dot-border-radius","--todo-swipe-card-pagination-dot-spacing","--todo-swipe-card-pagination-bottom","--todo-swipe-card-pagination-right","--todo-swipe-card-pagination-background","--todo-swipe-card-pagination-dot-active-size-multiplier","--todo-swipe-card-pagination-dot-active-opacity","--todo-swipe-card-pagination-dot-inactive-opacity"].forEach(t=>{const o=new RegExp(`${t}\\s*:\\s*([^;]+)`,"i"),n=i.match(o);n&&n[1]&&(e+=`${t}: ${n[1].trim()};\n`)})}if(e){t.paginationElement.style.cssText+=e;const i=t.paginationElement.querySelectorAll(".pagination-dot");requestAnimationFrame(()=>{i.forEach(t=>{t.style.borderRadius="var(--todo-swipe-card-pagination-dot-border-radius, 50%)",t.style.margin="0 var(--todo-swipe-card-pagination-dot-spacing, 4px)",t.classList.contains("active")?(t.style.width="calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))",t.style.height="calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))"):(t.style.width="var(--todo-swipe-card-pagination-dot-size, 8px)",t.style.height="var(--todo-swipe-card-pagination-dot-size, 8px)")})})}}async function _t(t,e){if(!e?.connection)return()=>{};try{return e.connection.subscribeMessage(e=>{const i=new CustomEvent("todo-items-updated",{detail:{entityId:t,items:e.items||[]},bubbles:!0,composed:!0});document.dispatchEvent(i)},{type:"todo/item/subscribe",entity_id:t})}catch(t){return()=>{}}}async function $t(t,e){if(!e)return[];try{const i=await e.callWS({type:"todo/item/list",entity_id:t});return i.items||[]}catch(t){return[]}}function zt(t,e,i){i&&t&&e&&i.callService("todo","add_item",{entity_id:t,item:e})}function St(t,e,i,o){o&&t&&e&&(o.callService("todo","update_item",{entity_id:t,item:e.uid,status:i?"completed":"needs_action"}),e.summary)}async function Ct(t,e,i,o){if(!o)return;const n={entity_id:t,item:e.uid,rename:i.summary};void 0!==i.completed&&(n.status=i.completed?"completed":"needs_action"),void 0!==i.description&&(n.description=i.description||null),void 0!==i.dueDate&&(i.dueDate&&""!==i.dueDate.trim()?i.dueDate.includes("T")?n.due_datetime=i.dueDate:n.due_date=i.dueDate:e.due&&e.due.includes("T")?n.due_datetime=null:n.due_date=null),await o.callService("todo","update_item",n),e.summary,i.summary}async function Tt(t,e,i){if(!i)return;const o={entity_id:t,item:e.summary};e.description&&(o.description=e.description),void 0!==e.dueDate&&(o.due_date=e.dueDate||null),await i.callService("todo","add_item",o),e.summary}function Dt(t,e,i){i&&(i.callService("todo","remove_item",{entity_id:t,item:e.uid}),e.summary)}function Et(t,e){e&&e.callService("todo","remove_completed_items",{entity_id:t})}function At(t,e,i){const o=[...t],n=o.filter(t=>"completed"===t.status),r=o.filter(t=>"completed"!==t.status);let s=r,a=n;if(e&&"none"!==e){const t=function(t,e){switch(t){case"alpha_asc":return(t,i)=>t.summary.localeCompare(i.summary,e?.locale?.language);case"alpha_desc":return(t,i)=>i.summary.localeCompare(t.summary,e?.locale?.language);case"duedate_asc":return(t,e)=>{const i=Mt(t.due),o=Mt(e.due);return i||o?i?o?i.getTime()-o.getTime():-1:1:0};case"duedate_desc":return(t,e)=>{const i=Mt(t.due),o=Mt(e.due);return i||o?i?o?o.getTime()-i.getTime():-1:1:0};default:return()=>0}}(e,i);s=r.sort(t),a=n.sort(t)}return[...s,...a]}function Mt(t){if(!t)return null;try{if(t.includes("T"))return new Date(t);{const e=new Date(`${t}T23:59:59`);return isNaN(e.getTime())?null:e}}catch(t){return null}}function Nt(t,e,i,o,n,r){const s=document.createElement("div"),a="completed"===t.status;s.className="todo-item "+(a?"completed animation-played":""),s.dataset.itemUid=t.uid;const d=document.createElement("ha-checkbox");d.className="todo-checkbox",d.checked="completed"===t.status,d.addEventListener("change",o=>{o.stopPropagation(),i(e,t,o.target.checked)}),s.appendChild(d);const c=document.createElement("div");c.className="todo-content";const l=document.createElement("div");if(l.className="todo-summary",l.textContent=t.summary,c.appendChild(l),t.description){const e=document.createElement("div");e.className="todo-description",e.textContent=t.description,c.appendChild(e)}if(t.due){const e=vt(t.due),i=e.querySelector("ha-relative-time");i&&n&&(i.hass=n),c.appendChild(e)}s.appendChild(c),r&&Ot(r,8)&&s.setAttribute("data-supports-drag","true");let h=0,p=0,u=0,g=!1;const m=t=>{t.target===d||d.contains(t.target)||t.target.closest(".todo-drag-handle")||(g=!1,u=Date.now(),"touchstart"===t.type?(h=t.touches[0].clientX,p=t.touches[0].clientY):(h=t.clientX,p=t.clientY))},f=t=>{if(!g){let e,i;"touchmove"===t.type?(e=t.touches[0].clientX,i=t.touches[0].clientY):(e=t.clientX,i=t.clientY);const o=Math.abs(e-h),n=Math.abs(i-p);(o>10||n>10)&&(g=!0)}},v=i=>{if(i.target===d||d.contains(i.target)||i.target.closest(".todo-drag-handle"))return;const n=Date.now()-u;!g&&n<1e3&&setTimeout(()=>{o(e,t)},10)};return s.addEventListener("touchstart",m,{passive:!0}),s.addEventListener("touchmove",f,{passive:!0}),s.addEventListener("touchend",v,{passive:!0}),s.addEventListener("mousedown",m),s.addEventListener("mousemove",f),s.addEventListener("mouseup",v),s.addEventListener("click",i=>{i.target===d||d.contains(i.target)||i.target.closest(".todo-drag-handle")||!g&&Date.now()-u<100&&(i.preventDefault(),i.stopPropagation(),o(e,t))}),s}function Ot(t,e){return 0!==((t.attributes?.supported_features||0)&e)}var It=/*#__PURE__*/Object.freeze({__proto__:null,addTodoItem:zt,addTodoItemFromDialog:Tt,createTodoItemElement:Nt,deleteCompletedItems:Et,deleteTodoItemFromDialog:Dt,entitySupportsFeature:Ot,fetchTodoItems:$t,moveItem:async function(t,e,i,o){if(o)try{await o.callWS({type:"todo/item/move",entity_id:t,uid:e,previous_uid:i||void 0})}catch(t){console.error("Error moving todo item:",t),t.message}},sortTodoItems:At,subscribeToTodoItems:_t,toggleTodoItem:St,updateTodoItemFromDialog:Ct});class jt{constructor(t){this.cardInstance=t,this.currentDialog=null,this.dialogOpenTime=0}get _t(){return this.cardInstance._t}get kt(){return this.cardInstance.kt}$t(t,e){const i=document.createElement("button");return i.slot=e,i.textContent=t,i.setAttribute("destructive",""),i.style.cssText="\n      background-color: #f44336;\n      color: white;\n      border: none;\n      border-radius: 4px;\n      padding: 8px 16px;\n      font-family: var(--mdc-typography-button-font-family, inherit);\n      font-size: var(--mdc-typography-button-font-size, 0.875rem);\n      font-weight: var(--mdc-typography-button-font-weight, 500);\n      text-transform: uppercase;\n      letter-spacing: 0.0892857143em;\n      cursor: pointer;\n      min-width: 64px;\n      height: 36px;\n      display: inline-flex;\n      align-items: center;\n      justify-content: center;\n      box-sizing: border-box;\n      transition: background-color 0.2s, box-shadow 0.2s;\n      outline: none;\n    ",i.addEventListener("mouseenter",()=>{i.style.backgroundColor="#d32f2f",i.style.boxShadow="0px 2px 4px rgba(244, 67, 54, 0.3)"}),i.addEventListener("mouseleave",()=>{i.style.backgroundColor="#f44336",i.style.boxShadow="none"}),i.addEventListener("focus",()=>{i.style.backgroundColor="#d32f2f",i.style.boxShadow="0px 0px 0px 2px rgba(244, 67, 54, 0.3)"}),i.addEventListener("blur",()=>{i.style.backgroundColor="#f44336",i.style.boxShadow="none"}),i}zt(t,e){const i=document.createElement("ha-button");return i.slot=e,i.textContent=t,i}editTodoItem(t,e){const i=Date.now();if(i-this.dialogOpenTime<300)return;this.dialogOpenTime=i;const o=this.St(t,e.uid);if(!o)return e.uid,void this.showTodoItemEditDialog(t,e);o.summary,this.showTodoItemEditDialog(t,o)}St(t,e){if(!this.cardInstance.Ct)return null;const i=this.cardInstance.Ct.get(t);return i&&i.find(t=>t.uid===e)||null}showTodoItemEditDialog(t,e=void 0){this.closeCurrentDialog();const i=document.createElement("ha-dialog");i.heading=e?"Edit item":"Add Todo Item",i.open=!0,i.style.setProperty("--mdc-dialog-min-width","min(600px, 95vw)"),i.style.setProperty("--mdc-dialog-max-width","min(600px, 95vw)"),i.setAttribute("role","dialog"),i.setAttribute("aria-labelledby","dialog-title"),i.setAttribute("aria-modal","true"),this.currentDialog=i;const o=document.createElement("div");o.style.cssText="\n      padding: 8px 0;\n      display: flex;\n      flex-direction: column;\n      gap: 16px;\n    ";const n=this._t?.states?.[t],r=n&&Ot(n,64),s=n&&(Ot(n,16)||Ot(n,32)),a=n&&Ot(n,2),d=document.createElement("div");d.style.cssText="display: flex; align-items: flex-start; gap: 8px;";let c=null;e&&(c=document.createElement("ha-checkbox"),c.checked="completed"===e.status,c.style.marginTop="8px",d.appendChild(c));const l=document.createElement("ha-textfield");l.label="Task name",l.value=e?.summary||"",l.required=!0,l.style.flexGrow="1",l.dialogInitialFocus=!0,l.validationMessage="Task name is required",d.appendChild(l),o.appendChild(d);let h=null;{const t=document.createElement("div");t.style.cssText="\n        width: 100%;\n        margin-bottom: 16px;\n        position: relative;\n      ";const i=document.createElement("label");i.textContent="Description",i.style.cssText="\n        display: block;\n        font-size: 12px;\n        color: var(--secondary-text-color);\n        margin-bottom: 4px;\n      ",h=document.createElement("textarea"),h.value=e?.description||"",h.rows=3,h.style.cssText="\n        width: 100%;\n        min-height: 60px;\n        max-height: 200px;\n        padding: 8px;\n        border: none;\n        border-bottom: 1px solid var(--divider-color);\n        border-radius: 4px 4px 0 0;\n        background: var(--mdc-text-field-fill-color, #f5f5f5);\n        color: var(--primary-text-color);\n        font-family: var(--mdc-typography-body1-font-family, inherit);\n        font-size: var(--mdc-typography-body1-font-size, 1rem);\n        line-height: 1.5;\n        resize: vertical;\n        box-sizing: border-box;\n        outline: none;\n        transition: border-bottom-color 0.15s ease;\n      ",h.addEventListener("focus",()=>{h.style.borderBottomColor="var(--primary-color)",h.style.borderBottomWidth="2px"}),h.addEventListener("blur",()=>{h.style.borderBottomColor="var(--divider-color)",h.style.borderBottomWidth="1px"}),t.appendChild(i),t.appendChild(h),o.appendChild(t)}let p=null,u=null;if(s){const t=document.createElement("div"),i=document.createElement("span");i.className="label",i.textContent="Due date:",i.style.cssText="\n        font-size: var(--ha-font-size-s, 12px);\n        font-weight: var(--ha-font-weight-medium, 500);\n        color: var(--input-label-ink-color, var(--primary-text-color));\n        display: block;\n        margin-bottom: 8px;\n      ",t.appendChild(i);const r=document.createElement("div");r.className="flex",r.style.cssText="\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      ";let s="",a="";if(e?.due)try{const t=new Date(e.due);isNaN(t.getTime())||(s=t.toISOString().split("T")[0],e.due.includes("T")&&(a=t.toTimeString().split(" ")[0].substring(0,5)))}catch(t){}const d=document.createElement("div");d.style.cssText="flex-grow: 1; position: relative;",p=document.createElement("input"),p.type="date",p.value=s,p.style.cssText="\n        width: 100%;\n        height: 56px;\n        padding: 20px 12px 6px 12px;\n        border: none;\n        border-bottom: 1px solid var(--divider-color);\n        border-radius: 0;\n        background: transparent;\n        color: var(--primary-text-color);\n        font-family: var(--mdc-typography-subtitle1-font-family, inherit);\n        font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n        line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);\n        box-sizing: border-box;\n        outline: none;\n        transition: border-bottom-color 0.15s ease;\n        cursor: pointer;\n        -webkit-appearance: none;\n        -moz-appearance: textfield;\n      ";const c=document.createElement("div");c.style.cssText="\n        position: relative;\n        background: var(--mdc-text-field-fill-color, #f5f5f5);\n        border-radius: 4px 4px 0 0;\n        min-height: 56px;\n        display: flex;\n        align-items: center;\n      ";const l=document.createElement("span");l.textContent="Due Date",l.style.cssText="\n        position: absolute;\n        left: 12px;\n        top: 8px;\n        font-size: 12px;\n        color: var(--secondary-text-color);\n        pointer-events: none;\n        transition: all 0.2s ease;\n      ";const h=document.createElement("button");if(h.type="button",h.innerHTML="×",h.style.cssText=`\n        position: absolute;\n        right: 36px;\n        top: 50%;\n        transform: translateY(-50%);\n        background: none;\n        border: none;\n        color: var(--secondary-text-color);\n        font-size: 18px;\n        cursor: pointer;\n        padding: 4px;\n        border-radius: 50%;\n        width: 20px;\n        height: 20px;\n        display: ${s?"flex":"none"};\n        align-items: center;\n        justify-content: center;\n        z-index: 2;\n      `,h.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),p.value="",h.style.display="none",u&&(u.value="")}),p.addEventListener("input",()=>{h.style.display=p.value?"flex":"none"}),c.appendChild(l),c.appendChild(p),c.appendChild(h),d.appendChild(c),r.appendChild(d),Ot(n,32)){const t=document.createElement("div");t.style.cssText="position: relative; min-width: 120px;";const e=document.createElement("div");e.style.cssText="\n          position: relative;\n          background: var(--mdc-text-field-fill-color, #f5f5f5);\n          border-radius: 4px 4px 0 0;\n          min-height: 56px;\n          display: flex;\n          align-items: center;\n        ",u=document.createElement("input"),u.type="time",u.value=a,u.style.cssText="\n          width: 100%;\n          height: 56px;\n          padding: 20px 12px 6px 12px;\n          border: none;\n          border-bottom: 1px solid var(--divider-color);\n          border-radius: 0;\n          background: transparent;\n          color: var(--primary-text-color);\n          font-family: var(--mdc-typography-subtitle1-font-family, inherit);\n          font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n          line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);\n          box-sizing: border-box;\n          outline: none;\n          transition: border-bottom-color 0.15s ease;\n          -webkit-appearance: none;\n          -moz-appearance: textfield;\n        ";const i=document.createElement("span");i.textContent="Time",i.style.cssText="\n          position: absolute;\n          left: 12px;\n          top: 8px;\n          font-size: 12px;\n          color: var(--secondary-text-color);\n          pointer-events: none;\n          transition: all 0.2s ease;\n        ",e.appendChild(i),e.appendChild(u),t.appendChild(e),r.appendChild(t)}t.appendChild(r),o.appendChild(t)}if(setTimeout(()=>{const t=i.querySelectorAll("ha-textfield, ha-checkbox, input, button, ha-button");if(0===t.length)return;const e=t[0],o=t[t.length-1];i.addEventListener("keydown",t=>{"Tab"===t.key&&(t.shiftKey&&document.activeElement===e?(t.preventDefault(),o.focus()):t.shiftKey||document.activeElement!==o||(t.preventDefault(),e.focus()))})},100),i.appendChild(o),e&&a){const o=this.$t("Delete item","secondaryAction");o.addEventListener("click",async()=>{await this.showDeleteConfirmationDialog(e.summary)&&(Dt(t,e,this._t),this.closeDialog(i))}),i.appendChild(o)}const g=this.zt("Cancel","primaryAction");g.addEventListener("click",()=>{this.closeDialog(i)}),i.appendChild(g);const m=e?"Save item":"Add",f=this.zt(m,"primaryAction");f.addEventListener("click",async()=>{const o=l.value.trim();if(!o)return void l.reportValidity();let n="";if(p?.value)if(u?.value){const t=`${p.value}T${u.value}:00`;try{n=new Date(t).toISOString()}catch(t){console.error("Invalid date/time combination"),n=p.value}}else n=p.value;const a={summary:o,completed:c?.checked||!1};r&&(a.description=h?.value),s&&(a.dueDate=n);await this.handleDialogSave(t,e,a)&&this.closeDialog(i)}),i.appendChild(f),l.addEventListener("keydown",o=>{if("Enter"===o.key){o.preventDefault();const n=l.value.trim();if(n){let a="";if(p?.value)if(u?.value){const t=`${p.value}T${u.value}:00`;try{a=new Date(t).toISOString()}catch(o){console.error("Invalid date/time combination"),a=p.value}}else a=p.value;const d={summary:n,completed:c?.checked||!1};r&&(d.description=h?.value),s&&(d.dueDate=a),this.handleDialogSave(t,e,d).then(t=>{t&&this.closeDialog(i)})}}}),i.addEventListener("closed",()=>{this.onDialogClosed(i)}),document.body.appendChild(i),setTimeout(()=>{l.focus()},100)}closeDialog(t){t&&t.open&&(t.open=!1,t.close())}closeCurrentDialog(){this.currentDialog&&(this.closeDialog(this.currentDialog),this.currentDialog=null)}onDialogClosed(t){t.parentNode&&t.parentNode.removeChild(t),this.currentDialog===t&&(this.currentDialog=null)}async handleDialogSave(t,e,i){if(!i.summary)return!1;try{return e?await Ct(t,e,i,this._t):await Tt(t,i,this._t),!0}catch(t){return!1}}async showDeleteConfirmationDialog(t){return new Promise(e=>{const i=document.createElement("ha-dialog");i.heading="Confirm Deletion",i.open=!0;const o=document.createElement("div");o.style.padding="16px",o.textContent=`Are you sure you want to delete "${t}"?`,i.appendChild(o);const n=this.zt("Cancel","secondaryAction");n.addEventListener("click",()=>{i.close(),e(!1)});const r=this.$t("Delete","primaryAction");r.addEventListener("click",()=>{i.close(),e(!0)}),i.appendChild(n),i.appendChild(r),i.addEventListener("closed",()=>{i.parentNode&&i.parentNode.removeChild(i),e(!1)}),document.body.appendChild(i)})}showDeleteCompletedConfirmation(t){const e=document.createElement("ha-dialog");e.heading="Confirm Deletion",e.open=!0;const i=document.createElement("div");i.style.padding="16px",i.textContent="Are you sure you want to delete all completed items from the list?",e.appendChild(i);const o=this.zt("Cancel","secondaryAction");o.addEventListener("click",()=>{e.close()});const n=this.$t("Delete","primaryAction");n.addEventListener("click",()=>{e.close(),Promise.resolve().then(function(){return It}).then(e=>{e.deleteCompletedItems(t,this._t)})}),e.appendChild(o),e.appendChild(n),e.addEventListener("closed",()=>{e.parentNode&&e.parentNode.removeChild(e)}),document.body.appendChild(e)}}class Lt{constructor(t){this.cardInstance=t}get _t(){return this.cardInstance._t}get kt(){return this.cardInstance.kt}Tt(t){return"string"==typeof t?t:t?.entity||""}Dt(t){if(!this.kt?.entities)return null;const e=this.kt.entities.find(e=>this.Tt(e)===t);return"string"==typeof e?{entity:t}:e||null}async createNativeTodoCards(){if(!this.cardInstance.sliderElement)return;if(this.cardInstance.Et)return;const t=this.cardInstance.sliderElement;for(let e=0;e<this.kt.entities.length;e++){if(this.cardInstance.Et)return void s();const i=this.kt.entities[e],o=this.Tt(i);if(!o||""===o.trim())continue;if(this.cardInstance.sliderElement!==t)return void s();if(!this.cardInstance.sliderElement)return void s();const n=document.createElement("div");n.className="slide";try{const r=await this.createNativeTodoCard(i);if(this.cardInstance.Et)return void s();if(this.cardInstance.cards[e]={element:r,slide:n,entityId:o,entityConfig:i},n.appendChild(r),this.kt.show_completed&&this.kt.show_completed_menu){const t=this.cardInstance.At(o,i);n.appendChild(t)}if(this.kt.show_icons){const t=ft(i,o,this._t);n.appendChild(t)}if(!this.cardInstance.sliderElement||this.cardInstance.sliderElement!==t||this.cardInstance.Et)return void s();this.cardInstance.sliderElement.appendChild(n),s()}catch(i){if(!this.cardInstance.Et){console.error(`Error creating native todo card ${e}:`,o,i);const r=document.createElement("div");r.style.cssText="color: red; background: white; padding: 16px; border: 1px solid red; height: 100%; box-sizing: border-box;",r.textContent=`Error creating card: ${i.message||i}. Check console for details.`,n.appendChild(r),this.cardInstance.sliderElement&&this.cardInstance.sliderElement===t&&this.cardInstance.sliderElement.appendChild(n),this.cardInstance.cards[e]={error:!0,slide:n}}}}this.cardInstance.cards=this.cardInstance.cards.filter(Boolean),this.cardInstance.cards.length}async createNativeTodoCard(t){const e=this.Tt(t);this.cardInstance.Ct||(this.cardInstance.Ct=new Map),this.cardInstance.Mt||(this.cardInstance.Mt=new Map),this.cardInstance.Nt||(this.cardInstance.Nt=new Set);const i=document.createElement("div");i.className="native-todo-card","object"==typeof t&&t.background_image&&(i.style.backgroundImage=`url('${t.background_image}')`,i.style.backgroundPosition="center center",i.style.backgroundRepeat="no-repeat",i.style.backgroundSize="cover");let o=i;const n="object"==typeof t&&t.show_title||!1,r="object"==typeof t&&t.title||"";if(n&&r&&(o=mt(i,r)),this.kt.show_create){const t=this.createAddRow(e);i.appendChild(t)}const s=document.createElement("div");if(s.className="todo-list",i.appendChild(s),this.kt.enable_search&&this.kt.show_create&&yt(i,e,this.cardInstance),this._t){const t=this.cardInstance.Mt.get(e);if(t&&"function"==typeof t)try{t()}catch(t){}const i=await _t(e,this._t);this.cardInstance.Mt.set(e,i)}return o}async initializeDragAndDrop(t,e,i=!1){const o=this._t?.states?.[e];if(!o||!Ot(o,8))return;if(!i&&this.cardInstance.Nt.has(e))return;let n=null;if(n=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .todo-list"):(t.classList.contains("native-todo-card"),t.querySelector(".todo-list")),n)try{const t=this.cardInstance.Ct?.get(e)||[],{setupDragAndDrop:i}=await Promise.resolve().then(function(){return Ft});i(n,e,t,this._t),this.cardInstance.Nt.add(e)}catch(t){console.error(`Error initializing drag-and-drop for ${e}:`,t)}}createAddRow(t){const e=document.createElement("div");e.className="add-row";const i=document.createElement("div");i.className="add-textfield";const o=document.createElement("input");if(o.type="text",o.placeholder=this.kt.enable_search?"Type to search / add":"Add item",o.addEventListener("keydown",e=>{if("Enter"===e.key){const i=o.value.trim();i&&(this.kt.enable_search?function(t,e,i,o,n){if(t.key,"Enter"===t.key){t.preventDefault(),t.stopPropagation();const i=o.value.trim();if(i){n.yt.delete(e),n.xt="",o.value="",Array.from(n.yt.keys());const t=n._t?.states?.[e];(t?.attributes?.items||[]).some(t=>t.summary.toLowerCase()===i.toLowerCase())||n.Ot(e,i)}}else"Escape"===t.key&&(o.value="",n.xt="",n.yt.delete(e),n.cardBuilder.updateNativeTodoCard(i,e))}(e,t,o.closest(".native-todo-card")||o.closest(".todo-card-with-title-wrapper"),o,this.cardInstance):(this.cardInstance.Ot(t,i),o.value="",o.focus()))}else if("Escape"===e.key&&this.kt.enable_search){o.value="",this.cardInstance.yt.delete(t),this.cardInstance.xt="";const e=o.closest(".native-todo-card")||o.closest(".todo-card-with-title-wrapper");e&&this.updateNativeTodoCard(e,t)}}),i.appendChild(o),e.appendChild(i),this.kt.show_addbutton){const i=document.createElement("button");i.className="add-button",i.title="Add item",i.innerHTML='<svg viewBox="0 0 24 24"><path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" /></svg>',i.addEventListener("click",()=>{const e=o.value.trim();if(e){if(this.kt.enable_search){this.cardInstance.yt.delete(t),this.cardInstance.xt="",o.value="";const i=this.cardInstance._t?.states?.[t];(i?.attributes?.items||[]).some(t=>t.summary.toLowerCase()===e.toLowerCase())||this.cardInstance.Ot(t,e);const n=o.closest(".native-todo-card")||o.closest(".todo-card-with-title-wrapper");n&&this.updateNativeTodoCard(n,t)}else this.cardInstance.Ot(t,e),o.value="";o.focus()}}),e.appendChild(i)}return e}async updateNativeTodoCard(t,e){if(!this._t||!e)return;const i=this._t.states[e];if(!i)return;let o=[];if(this.cardInstance.Ct?.has(e))o=this.cardInstance.Ct.get(e)||[],o.length;else try{o=await $t(e,this._t),o.length,this.cardInstance.Ct||(this.cardInstance.Ct=new Map),this.cardInstance.Ct.set(e,o)}catch(t){o=i.attributes?.items||[]}let n=null;if(n=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .todo-list"):(t.classList.contains("native-todo-card"),t.querySelector(".todo-list")),!n){let e=t;if(t.classList.contains("todo-card-with-title-wrapper")&&(e=t.querySelector(".native-todo-card")),!e)return;n=document.createElement("div"),n.className="todo-list",e.appendChild(n)}const r=this.Dt(e),a=At(o,r?.display_order,this._t),d=this.cardInstance.yt.get(e)||"",c=d&&""!==d.trim();let l=a;if(!c&&r?.hide_future_items){const t=new Date;t.setHours(23,59,59,999),l=l.filter(e=>{if("completed"===e.status||!e.due)return!0;try{return new Date(e.due)<=t}catch(t){return!0}})}if(!c&&r?.max_items&&"number"==typeof r.max_items){const t=l.filter(t=>"completed"!==t.status),e=l.filter(t=>"completed"===t.status);l=[...t.slice(0,r.max_items),...e]}const h=new Set(l.map(t=>t.uid)),p=new Set;c&&a.forEach(t=>{(function(t,e){if(!e)return!0;try{const i=new RegExp(e,"i");return i.test(t.summary)||t.description&&i.test(t.description)}catch(i){const o=e.toLowerCase();return t.summary.toLowerCase().includes(o)||t.description&&t.description.toLowerCase().includes(o)}})(t,d)&&p.add(t.uid)});const u=new Map;Array.from(n.children).forEach(t=>{const e=t.dataset.itemUid;e&&u.set(e,t)});const g=new Set;let m=!1;for(const t of a){g.add(t.uid);const o=u.get(t.uid),r=h.has(t.uid)&&(!c||p.has(t.uid)),a=`${e}:${t.uid}`,d=this.cardInstance.It?.get(a),l=d?d.status:t.status;d&&s((t.summary,t.status));const f="completed"===l,v=!this.kt.show_completed&&f&&!c;if(o){await this.jt(o,t,i);if(o.classList.contains("completed")!==f)if(f){o.classList.remove("animation-played"),o.classList.add("completed");const t=o.querySelector(".todo-summary"),e=()=>{o.classList.add("animation-played")};t&&t.addEventListener("animationend",e,{once:!0}),setTimeout(e,300)}else o.classList.remove("completed","animation-played");const e=o.querySelector("ha-checkbox");e&&e.checked!==f&&(e.checked=f),o.style.display=!r||v?"none":""}else{m=!0;try{const o=Nt(t,e,this.cardInstance.Lt,this.cardInstance.Ht,this._t,i);r&&!v||(o.style.display="none"),n.appendChild(o),u.set(t.uid,o)}catch(e){console.error("Error creating item element:",e,t)}}}u.forEach((t,e)=>{g.has(e)||t.remove()}),a.forEach((t,e)=>{const i=u.get(t.uid);i&&(i.style.order=e)}),this.updateSearchCounter(t,e,d,c?p.size:l.length,a.length),m&&Ot(i,8)&&await this.initializeDragAndDrop(t,e,!0)}async jt(t,e){const i=t.querySelector(".todo-summary");i&&i.textContent!==e.summary&&(i.textContent=e.summary);const o=t.querySelector(".todo-content");if(o){let t=o.querySelector(".todo-description");e.description?t?t.textContent!==e.description&&(t.textContent=e.description):(t=document.createElement("div"),t.className="todo-description",t.textContent=e.description,i?i.parentNode.insertBefore(t,i.nextSibling):o.appendChild(t)):t&&t.remove();const n=o.querySelector(".todo-due");if(e.due){const{createDueDateElement:t}=await Promise.resolve().then(function(){return xt}),i=t(e.due),r=i.querySelector("ha-relative-time");r&&this._t&&(r.hass=this._t),n?n.replaceWith(i):o.appendChild(i)}else n&&n.remove()}}updateSearchCounter(t,e,i,o,n){let r=null;if(r=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .add-row"):t.querySelector(".add-row"),!r)return;const s=t.querySelector(".search-counter");if(s&&s.remove(),i&&""!==i.trim()&&n>0){r.classList.add("has-search-counter");const t=document.createElement("div");t.className="search-counter",t.textContent=`Showing ${o} of ${n} results`,r.parentNode.insertBefore(t,r.nextSibling)}else r.classList.remove("has-search-counter")}}class Ht{constructor(t){this.cardInstance=t,this.handleTodoUpdate=this.handleTodoUpdate.bind(this)}get _t(){return this.cardInstance._t}get kt(){return this.cardInstance.kt}async initializeSubscriptions(t,e){if(this.cardInstance.initialized&&this.cardInstance.cards&&0!==this.cardInstance.cards.length&&!e&&this.cardInstance.cards.length>0)for(const t of this.cardInstance.cards)if(t&&t.entityId){s(t.entityId);const e=this.cardInstance.Mt?.get(t.entityId);if(e&&"function"==typeof e)try{e()}catch(t){s()}const i=await _t(t.entityId,this._t);this.cardInstance.Mt||(this.cardInstance.Mt=new Map),this.cardInstance.Mt.set(t.entityId,i)}}setupEventListeners(){document.addEventListener("todo-items-updated",this.handleTodoUpdate)}removeEventListeners(){document.removeEventListener("todo-items-updated",this.handleTodoUpdate)}handleTodoUpdate(t){const{entityId:e,items:i}=t.detail;this.cardInstance.Ct||(this.cardInstance.Ct=new Map),this.cardInstance.Ct.set(e,i);const o=this.cardInstance.cards.find(t=>t.entityId===e);o&&o.element&&setTimeout(()=>{this.cardInstance.cardBuilder.updateNativeTodoCard(o.element,e)},50)}cleanup(){this.cardInstance.Mt&&(this.cardInstance.Mt.forEach(async(t,e)=>{try{"function"==typeof t&&await Promise.resolve(t()).catch(t=>{})}catch(t){}}),this.cardInstance.Mt.clear()),this.cardInstance.Ct&&this.cardInstance.Ct.clear(),this.removeEventListeners()}}class TodoSwipeCard extends pt{constructor(){super(),this.kt={},this._t=null,this.cards=[],this.currentIndex=0,this.slideWidth=0,this.cardContainer=null,this.sliderElement=null,this.paginationElement=null,this.initialized=!1,this.Pt=null,this.Vt=null,this.Ft=null,this.Rt=null,this.Ut=null,this.Jt=null,this.Mt=new Map,this.Bt=null,this.yt=new Map,this.xt="",this.wt=new Map,this.Ct=new Map,this.Zt=!1,this.It=new Map,this.dialogManager=new jt(this),this.cardBuilder=new Lt(this),this.subscriptionManager=new Ht(this),this.Ot=this.Ot.bind(this),this.Lt=this.Lt.bind(this),this.Ht=this.Ht.bind(this)}render(){return W``}static getStubConfig(){return{entities:[],card_spacing:15,show_pagination:!0,show_icons:!1,show_create:!0,show_addbutton:!1,show_completed:!1,show_completed_menu:!1,delete_confirmation:!1,enable_search:!1,clear_search_on_uncheck:!1}}static getConfigElement(){return document.createElement("todo-swipe-card-editor")}qt(){return this.kt&&this.kt.entities&&Array.isArray(this.kt.entities)&&this.kt.entities.length>0&&this.kt.entities.some(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim())}Tt(t){return"string"==typeof t?t:t?.entity||""}Dt(t){if(!this.kt?.entities)return null;const e=this.kt.entities.find(e=>this.Tt(e)===t);return"string"==typeof e?{entity:t}:e||null}Wt(t){if(!this.Rt)return!0;return JSON.stringify(t)!==JSON.stringify(this.Rt)}Xt(){if(this.shadowRoot)if(this.Pt||(this.Pt=document.createElement("style"),this.shadowRoot.appendChild(this.Pt)),this.kt&&this.kt.card_mod&&"string"==typeof this.kt.card_mod.style){const t=this.kt.card_mod.style;t.includes(":host")?this.Pt.textContent=t:this.Pt.textContent=`\n          :host {\n            ${t}\n          }\n        `}else this.Pt&&(this.Pt.textContent="")}Kt(){if(this.sliderElement&&this.kt)try{let t="0.3s",e="ease-out";const i=this.kt.card_mod||this.kt.custom_card_mod;if(i&&"string"==typeof i.style){const o=i.style,n=/--todo-swipe-card-transition-speed\s*:\s*([^;]+)/i,r=o.match(n);r&&r[1]&&(t=r[1].trim());const s=/--todo-swipe-card-transition-easing\s*:\s*([^;]+)/i,a=o.match(s);a&&a[1]&&(e=a[1].trim());const d=/--todo-swipe-card-delete-button-color\s*:\s*([^;]+)/i,c=o.match(d);c&&c[1]&&(this.Bt=c[1].trim(),this.Gt())}if(this.sliderElement&&this.sliderElement.style){const i=`transform ${t} ${e}`;this.sliderElement.style.transition=i,this.Yt=t,this.Qt=e}}catch(t){console.error("Error applying transition properties:",t)}}Gt(){if(!this.Bt)return;this.shadowRoot.querySelectorAll(".delete-completed-button").forEach(t=>{t.style.color=this.Bt;const e=t.querySelector("svg");e&&(e.style.fill=this.Bt)})}setConfig(t){JSON.stringify(t);let e=t.entities||[];Array.isArray(e)||(e="object"==typeof e?Object.values(e):"string"==typeof e?[e]:[]),e=e.map(t=>"string"==typeof t?""===t.trim()?t:{entity:t}:t).filter(t=>"string"==typeof t?""!==t:t&&(t.entity||""===t.entity));const i={...TodoSwipeCard.getStubConfig(),...t,entities:e};if(void 0===i.card_spacing?i.card_spacing=15:(i.card_spacing=parseInt(i.card_spacing),(isNaN(i.card_spacing)||i.card_spacing<0)&&(i.card_spacing=15)),t.card_mod&&"object"==typeof t.card_mod&&Object.keys(t.card_mod).length>0?i.card_mod=t.card_mod:t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(i.card_mod=t.custom_card_mod),!this.Wt(i))return;const o=this.kt;if(this.kt=i,this.Rt=JSON.parse(JSON.stringify(i)),JSON.stringify(this.kt),this.Xt(),this.initialized){this.Vt&&clearTimeout(this.Vt);this.te(o,i)?this.Vt=setTimeout(()=>{this.ee().then(()=>{this.Kt(),this.Gt()})},300):(this.ie(o),this.Kt(),this.Gt())}}te(t,e){if(!t)return!0;const i=JSON.stringify(t.entities)!==JSON.stringify(e.entities),o=t.show_pagination!==e.show_pagination,n=t.show_create!==e.show_create,r=JSON.stringify(t.card_mod)!==JSON.stringify(e.card_mod),s=t.enable_search!==e.enable_search;return i||o||n||r||s}ie(t){requestAnimationFrame(()=>{this.kt.show_completed!==t.show_completed&&this.cards.forEach(t=>{if(t.element){t.element.querySelectorAll(".todo-item.completed").forEach(t=>{t.style.display=this.kt.show_completed?"":"none"})}}),this.kt.show_completed_menu===t.show_completed_menu&&this.kt.show_completed===t.show_completed||this.oe(),this.kt.card_spacing!==t.card_spacing&&this.sliderElement&&(this.sliderElement.style.gap=`${this.kt.card_spacing}px`,this.updateSlider(!1)),JSON.stringify(this.kt.card_mod||this.kt.custom_card_mod)!==JSON.stringify(t.card_mod||t.custom_card_mod)&&(this.Xt(),this.paginationElement&&this.ne())})}oe(){this.cards.forEach(t=>{const e=t.slide;if(!e)return;if(e.querySelectorAll(".delete-completed-button").forEach(t=>t.remove()),this.kt.show_completed&&this.kt.show_completed_menu){const i=t.entityConfig||this.Dt(t.entityId),o=this.At(t.entityId,i);e.appendChild(o)}})}At(t,e=null){const i=document.createElement("button");if(i.className="delete-completed-button",i.title="Delete completed items",i.innerHTML='\n      <svg viewBox="0 0 24 24">\n        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />\n      </svg>\n    ',e&&e.show_title&&e.title){const t=`calc(${35}px + ${"var(--todo-swipe-card-title-height, 40px)"})`;i.style.setProperty("--todo-swipe-card-delete-button-auto-top",t)}if(this.Bt){i.style.color=this.Bt;const t=i.querySelector("svg");t&&(t.style.fill=this.Bt)}return i.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),this.kt.delete_confirmation?this.dialogManager.showDeleteCompletedConfirmation(t):Et(t,this._t)}),i}set hass(t){if(!t)return;const e=this._t;this._t=t,this.subscriptionManager.initializeSubscriptions(t,e)}connectedCallback(){super.connectedCallback(),this.subscriptionManager.setupEventListeners(),this.kt&&(this.initialized||(this.Xt(),setTimeout(()=>{this.ee()},0)))}disconnectedCallback(){var t;this.Vt&&(clearTimeout(this.Vt),this.Vt=null),this.Ut&&(clearTimeout(this.Ut),this.Ut=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.subscriptionManager.cleanup(),(t=this).wt&&(t.wt.forEach(t=>{t.inputElement&&(t.inputHandler&&t.inputElement.removeEventListener("input",t.inputHandler),t.keydownHandler&&t.inputElement.removeEventListener("keydown",t.keydownHandler))}),t.wt.clear()),t.yt&&t.yt.clear(),t.xt="",this.It&&this.It.clear(),this.cardContainer&&(this.re&&(this.cardContainer.removeEventListener("touchstart",this.re),this.cardContainer.removeEventListener("touchmove",this.se),this.cardContainer.removeEventListener("touchend",this.ae),this.cardContainer.removeEventListener("touchcancel",this.ae),this.cardContainer.removeEventListener("mousedown",this.de)),window.removeEventListener("mousemove",this.ce),window.removeEventListener("mouseup",this.le)),this.initialized=!1,this.cards=[],this.cardContainer=null,this.sliderElement=null,this.paginationElement=null,this.Jt=null,this.shadowRoot&&(this.shadowRoot.innerHTML="")}async ee(){if(this.Ft)return this.Ft;this.Ft=this.he();try{await this.Ft}finally{this.Ft=null}}async he(){const t=document.createDocumentFragment(),e=this.renderRoot||this.shadowRoot;if(!e)return void console.error("No render root available");e.innerHTML="";const i=function(t){const e=document.createElement("style");return e.textContent=`\n    :host {\n      display: block;\n      overflow: hidden;\n      width: 100%;\n      height: 100%;\n      --card-border-radius: var(--ha-card-border-radius, 12px);\n      border-radius: var(--card-border-radius);\n    }\n\n    .card-container {\n      position: relative;\n      width: 100%;\n      height: 100%;\n      overflow: hidden;\n      border-radius: var(--card-border-radius);\n    }\n    \n    .card-container, .slide {\n      border-radius: var(--card-border-radius) !important;\n    }\n\n    .slider {\n      position: relative;\n      display: flex;\n      width: 100%;\n      height: 100%;\n      transition: transform 0.3s ease-out;\n      will-change: transform;\n    }\n\n    .slide {\n      position: relative;\n      flex: 0 0 100%;\n      max-width: 100%;\n      overflow: hidden;\n      height: 100%;\n      box-sizing: border-box;\n      border-radius: var(--card-border-radius);\n      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));\n      backdrop-filter: var(--todo-swipe-card-backdrop-filter, none);\n      -webkit-backdrop-filter: var(--todo-swipe-card-backdrop-filter, none);\n    }\n\n    .pagination {\n      position: absolute;\n      bottom: var(--todo-swipe-card-pagination-bottom, 8px);\n      left: 0;\n      right: 0;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      z-index: 1;\n      background-color: var(--todo-swipe-card-pagination-background, transparent);\n    }\n\n    .pagination-dot {\n      width: var(--todo-swipe-card-pagination-dot-size, 8px);\n      height: var(--todo-swipe-card-pagination-dot-size, 8px);\n      border-radius: var(--todo-swipe-card-pagination-dot-border-radius, 50%);\n      margin: 0 var(--todo-swipe-card-pagination-dot-spacing, 4px);\n      background-color: var(--todo-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n      opacity: var(--todo-swipe-card-pagination-dot-inactive-opacity, 0.6);\n      cursor: pointer;\n      transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;\n      flex-shrink: 0;\n    }\n\n    .pagination-dot.active {\n      background-color: var(--todo-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n      width: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));\n      height: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));\n      opacity: var(--todo-swipe-card-pagination-dot-active-opacity, 1);\n    }\n    \n    .delete-completed-button {\n      position: absolute;\n      right: 7px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      top: var(--todo-swipe-card-delete-button-top, var(--todo-swipe-card-delete-button-auto-top, 35px));\n      padding: 4px;\n      background-color: transparent;\n      border: none;\n      color: var(--todo-swipe-card-delete-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      cursor: pointer;\n      border-radius: 50%;\n      width: 36px;\n      height: 36px;\n      z-index: 10;\n    }\n\n    .delete-completed-button:hover {\n      background-color: rgba(127, 127, 127, 0.2);\n    }\n\n    .delete-completed-button svg {\n      width: 20px;\n      height: 20px;\n      fill: currentColor;\n    }\n\n    /* Preview styles */\n    .preview-container {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      text-align: center;\n      padding: 16px;\n      box-sizing: border-box;\n      height: 100%;\n      background: var(--ha-card-background, var(--card-background-color, white));\n      border-radius: inherit;\n    }\n    \n    .preview-icon-container {\n      margin-bottom: 16px;\n    }\n    \n    .preview-icon-container ha-icon {\n      color: var(--primary-color, #03a9f4);\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n    }\n    \n    .preview-text-container {\n      margin-bottom: 16px;\n    }\n    \n    .preview-title {\n      font-size: 18px;\n      font-weight: bold;\n      margin-bottom: 8px;\n      color: var(--primary-text-color);\n    }\n    \n    .preview-description {\n      font-size: 14px;\n      color: var(--secondary-text-color);\n      max-width: 300px;\n      line-height: 1.4;\n      margin: 0 auto;\n    }\n    \n    /* Dialog styles */\n    ha-dialog {\n      --mdc-dialog-min-width: 300px;\n      --mdc-dialog-max-width: 500px;\n      --mdc-dialog-heading-ink-color: var(--primary-text-color);\n      --mdc-dialog-content-ink-color: var(--primary-text-color);\n      --justify-action-buttons: space-between;\n    }\n    \n    ha-dialog div {\n      padding: 8px 16px 16px 16px;\n      color: var(--primary-text-color);\n    }\n    \n    /* Todo icon styling */\n    .todo-icon {\n      position: absolute;\n      right: var(--todo-swipe-card-icon-right, 16px);\n      bottom: var(--todo-swipe-card-icon-bottom, 8px);\n      width: var(--todo-swipe-card-icon-size, 48px);\n      height: var(--todo-swipe-card-icon-size, 48px);\n      color: var(--todo-swipe-card-icon-color, rgba(255, 255, 255, 0.3));\n      opacity: var(--todo-swipe-card-icon-opacity, 0.6);\n      z-index: 1;\n      pointer-events: none;\n      --mdc-icon-size: var(--todo-swipe-card-icon-size, 48px);\n    }\n\n    .native-todo-card {\n      height: 100%;\n      box-sizing: border-box;\n      overflow-y: auto;\n      border-radius: var(--card-border-radius);\n      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));\n      backdrop-filter: var(--todo-swipe-card-backdrop-filter, none);\n      -webkit-backdrop-filter: var(--todo-swipe-card-backdrop-filter, none);\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color));\n      font-size: var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px));\n      position: relative;\n      \n      /* Hide scrollbar for all browsers */\n      scrollbar-width: none; /* Firefox */\n      -ms-overflow-style: none; /* Internet Explorer 10+ */\n    }\n\n    .native-todo-card::-webkit-scrollbar {\n      display: none; /* WebKit browsers (Chrome, Safari, Edge) */\n    }\n\n    .todo-card-with-title-wrapper .native-todo-card {\n      border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);\n    }\n\n    .add-row {\n      padding: 8px 12px;\n      padding-bottom: 0;\n      margin-bottom: 6px; /* 6px + 4px todo-list padding = 10px total when no search */\n      position: relative;\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n    }\n\n    .add-row.has-search-counter {\n      margin-bottom: 0px; /* 4px gap to search counter when search is active */\n    }\n\n    .add-textfield {\n      flex-grow: 1;\n      margin-right: 8px;\n    }\n\n    .add-textfield input {\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color)) !important;\n      font-weight: var(--todo-swipe-card-input-font-weight, normal) !important;\n      background: transparent !important;\n      border: none !important;\n      outline: none !important;\n      padding: 8px 8px 2px 8px !important;\n      margin-left: -4px !important;\n      margin-top: 3px !important;\n      width: 100% !important;\n      box-sizing: border-box !important;\n      font-size: inherit !important;\n      font-family: inherit !important;\n    }\n\n    .add-textfield input::placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-textfield input::-webkit-input-placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: 1 !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-textfield input::-moz-placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: 1 !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-button {\n      position: absolute;\n      right: 5px;\n      top: 5px;\n      background: none;\n      border: none;\n      cursor: pointer;\n      padding: 8px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: var(--todo-swipe-card-add-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      opacity: ${t?.show_addbutton?"1":"0"};\n      visibility: ${t?.show_addbutton?"visible":"hidden"};\n      pointer-events: ${t?.show_addbutton?"auto":"none"};\n    }\n\n    .add-button:hover {\n      background-color: rgba(127, 127, 127, 0.1);\n    }\n\n    .add-button svg {\n      width: 24px;\n      height: 24px;\n      fill: currentColor;\n    }\n\n    .todo-list {\n      display: flex;\n      flex-direction: column;\n      padding: 4px 0;\n    }\n\n    .header {\n      display: none;\n    }\n\n    .empty {\n      display: none;\n    }\n\n    .todo-item {\n      display: flex;\n      align-items: var(--todo-swipe-card-item-align, flex-start);\n      padding: 1px 12px;\n      min-height: var(--todo-swipe-card-item-height, calc(var(--todo-swipe-card-font-size, 11px) + 8px));\n      margin-top: var(--todo-swipe-card-item-spacing, 1px);\n      cursor: pointer;\n      position: relative;\n      padding-right: 30px;\n    }\n\n    .todo-item:first-child {\n      margin-top: 0 !important;\n    }\n\n    .todo-item:hover {\n      background-color: rgba(127, 127, 127, 0.1);\n    }\n\n    .todo-checkbox {\n      margin-right: var(--todo-swipe-card-item-margin, 5px);\n      margin-top: var(--todo-swipe-card-checkbox-margin-top, 1px);\n      margin-left: 4px;\n      flex-shrink: 0;\n      opacity: 70%;\n      --mdc-checkbox-unchecked-color: var(--todo-swipe-card-checkbox-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      --mdc-checkbox-checked-color: var(--todo-swipe-card-checkbox-checked-color, var(--primary-color));\n      --mdc-checkbox-ink-color: var(--todo-swipe-card-checkbox-checkmark-color, white);\n      --mdc-checkbox-mark-color: var(--todo-swipe-card-checkbox-checkmark-color, white);\n      --mdc-checkbox-size: var(--todo-swipe-card-checkbox-size, 18px);\n      --mdc-checkbox-ripple-size: var(--todo-swipe-card-checkbox-size, 18px);\n      --mdc-checkbox-state-layer-size: var(--todo-swipe-card-checkbox-size, 18px);\n    }\n\n    .todo-content {\n      flex: 1;\n      max-width: calc(100% - 30px);\n      overflow: visible;\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color));\n      font-weight: var(--todo-swipe-card-item-font-weight, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n    }\n\n    .todo-summary {\n      margin: 0;\n      margin-top: var(--todo-swipe-card-summary-margin-top, 3px);\n      padding: 0;\n      color: inherit;\n      font-size: inherit;\n      font-weight: inherit;\n      line-height: inherit;\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n      hyphens: none;\n      word-break: normal;        \n    }\n\n    .todo-item.completed .todo-summary {\n      text-decoration: line-through;\n    }\n\n    /* Prevent animation replay when items become visible again (e.g., after clearing search)\n       Items with animation-played class show the final state immediately without animation */\n    .todo-item.completed.animation-played .todo-summary::after {\n      animation: none !important;\n      -webkit-mask-size: 100% 100% !important;\n      mask-size: 100% 100% !important;\n    }\n\n    .todo-description {\n      margin-top: var(--todo-swipe-card-description-margin-top, 1px);\n      color: var(--todo-swipe-card-font-color-description, var(--secondary-text-color));\n      font-size: var(--todo-swipe-card-font-size-description, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)));\n      font-weight: var(--todo-swipe-card-font-weight-description, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n    }\n\n    .todo-due {\n      margin-top: var(--todo-swipe-card-due-date-margin-top, 2px);\n      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));\n      font-size: var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px))));\n      font-weight: var(--todo-swipe-card-font-weight-due-date, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      display: flex;\n      align-items: flex-start;\n      gap: 3px;\n    }\n\n    .todo-due.overdue {\n      color: var(--todo-swipe-card-font-color-due-date-overdue, var(--warning-color));\n    }\n\n    .todo-item.completed .todo-due.overdue {\n      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));\n    }\n\n    .todo-due-icon {\n      --mdc-icon-size: var(--todo-swipe-card-due-icon-size, 14px);\n      width: var(--todo-swipe-card-due-icon-size, 14px);\n      height: var(--todo-swipe-card-due-icon-size, 14px);\n      margin-inline-start: initial;\n      flex-shrink: 0;\n      margin-top: 1px;\n    }\n\n    .todo-item.completed {\n      display: flex;\n    }\n\n    .todo-card-with-title-wrapper {\n      position: relative;\n      height: 100%;\n      width: 100%;\n      border-radius: var(--ha-card-border-radius, 12px);\n      overflow: hidden;\n      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));\n      backdrop-filter: var(--todo-swipe-card-backdrop-filter, none);\n      -webkit-backdrop-filter: var(--todo-swipe-card-backdrop-filter, none);\n      display: flex;\n      flex-direction: column;\n    }\n\n    .todo-swipe-card-external-title {\n      min-height: var(--todo-swipe-card-title-height, 40px);\n      display: flex;\n      align-items: center;\n      justify-content: var(--todo-swipe-card-title-align, center);\n      background: var(--todo-swipe-card-title-background, var(--secondary-background-color, #f7f7f7));\n      backdrop-filter: var(--todo-swipe-card-title-backdrop-filter, var(--todo-swipe-card-backdrop-filter, none));\n      -webkit-backdrop-filter: var(--todo-swipe-card-title-backdrop-filter, var(--todo-swipe-card-backdrop-filter, none));\n      color: var(--todo-swipe-card-title-color, var(--primary-text-color));\n      font-size: var(--todo-swipe-card-title-font-size, 16px);\n      font-weight: var(--todo-swipe-card-title-font-weight, 500);\n      border-bottom: var(--todo-swipe-card-title-border-width, 1px) solid var(--todo-swipe-card-title-border-color, rgba(0,0,0,0.12));\n      padding: 0 var(--todo-swipe-card-title-padding-horizontal, 16px);\n      box-sizing: content-box;\n      text-align: var(--todo-swipe-card-title-align, center);\n      flex-shrink: 0;\n      z-index: 1;\n      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;\n      margin: 0;\n      line-height: 1;\n      font-family: inherit;\n      white-space: var(--todo-swipe-card-title-white-space, nowrap);\n      overflow: var(--todo-swipe-card-title-overflow, hidden);\n      text-overflow: var(--todo-swipe-card-title-text-overflow, clip);\n    }\n\n    .todo-card-container {\n      flex: 1;\n      min-height: 0;\n      position: relative;\n    }\n\n    .search-counter {\n      padding: 2px 12px 2px 12px;\n      margin-left: 4px;\n      margin-bottom: 0px; /* Let todo-list top padding provide the 4px gap */\n      font-size: var(--todo-swipe-card-search-counter-font-size, 12px);\n      color: var(--todo-swipe-card-search-counter-color, var(--secondary-text-color));\n      font-style: italic;\n      text-align: left;\n    }\n\n  /* Drag and drop styles - minimal visual feedback */\n    .todo-item[data-supports-drag="true"] {\n      cursor: grab;\n    }\n\n    .todo-item.dragging {\n      opacity: 0.5;\n      cursor: grabbing;\n      z-index: 1000;\n    }\n\n    .todo-item.drag-over-top {\n      border-top: 2px solid var(--primary-color);\n    }\n\n    .todo-item.drag-over-bottom {\n      border-bottom: 2px solid var(--primary-color);\n    }\n  `,e}(this.kt);if(t.appendChild(i),this.Pt&&t.appendChild(this.Pt),!this.qt())return gt(t),e.appendChild(t),void(this.initialized=!0);this.cardContainer=document.createElement("div"),this.cardContainer.className="card-container",this.sliderElement=document.createElement("div"),this.sliderElement.className="slider",this.cardContainer.appendChild(this.sliderElement),t.appendChild(this.cardContainer),e.appendChild(t),this.cards=[];try{await this.cardBuilder.createNativeTodoCards()}catch(t){console.error("Error creating native todo cards:",t)}!1!==this.kt.show_pagination&&this.cards.length>1?function(t){t.paginationElement=document.createElement("div"),t.paginationElement.className="pagination";for(let e=0;e<t.cards.length;e++){const i=document.createElement("div");i.className="pagination-dot",e===t.currentIndex&&i.classList.add("active"),i.addEventListener("click",()=>{t.goToSlide(e)}),t.paginationElement.appendChild(i)}t.cardContainer.appendChild(t.paginationElement),kt(t)}(this):this.paginationElement=null,requestAnimationFrame(()=>{if(!this.cardContainer)return;this.slideWidth=this.cardContainer.offsetWidth,this.currentIndex=Math.max(0,Math.min(this.currentIndex,this.cards.length-1));const t=getComputedStyle(this.cardContainer).borderRadius;this.cards.forEach(e=>{e.slide&&(e.slide.style.borderRadius=t)}),this.updateSlider(!1),this.pe(),this.cards.forEach((t,e)=>{t&&t.element&&t.entityId&&(t.entityId,setTimeout(()=>{this.cardBuilder.updateNativeTodoCard(t.element,t.entityId)},50*e))})}),this.cards.length>1&&function(t){t.re&&(t.cardContainer.removeEventListener("touchstart",t.re),t.cardContainer.removeEventListener("touchmove",t.se),t.cardContainer.removeEventListener("touchend",t.ae),t.cardContainer.removeEventListener("touchcancel",t.ae),t.cardContainer.removeEventListener("mousedown",t.de),window.removeEventListener("mousemove",t.ce),window.removeEventListener("mouseup",t.le));let e=0,i=0,o=0,n=!1,r=!1,s=0,a=!1,d=!1;t.ue=e=>{if(!e||e===t.cardContainer||e===t.sliderElement)return!1;let i=e,o=0;for(;i&&o<15;){try{if(i.nodeType===Node.ELEMENT_NODE){const t=i.localName?.toLowerCase(),e=i.getAttribute&&i.getAttribute("role");if(["input","textarea","select","button","a","ha-switch","ha-checkbox","mwc-checkbox","paper-checkbox","ha-textfield","ha-slider","paper-slider","ha-icon-button","mwc-button","paper-button"].includes(t))return!0;if(e&&["button","checkbox","switch","slider","link","menuitem","textbox","input","combobox","searchbox"].includes(e))return!0;if(i.classList){const t=["mdc-text-field","mdc-text-field__input","mdc-text-field__ripple","mdc-line-ripple","mdc-floating-label","mdc-text-field__affix"];for(const e of t)if(i.classList.contains(e))return!0}}}catch(t){break}i=i.assignedSlot||i.parentNode||i.getRootNode&&i.getRootNode().host,o++}return!1},t.ge=c=>{if(!(n||"mousedown"===c.type&&0!==c.button||(a=t.ue(c.target),a))){if(n=!1,r=!1,d=!1,"touchstart"===c.type?(e=c.touches[0].clientX,i=c.touches[0].clientY):(e=c.clientX,i=c.clientY),o=e,t.sliderElement){const e=window.getComputedStyle(t.sliderElement),i=new DOMMatrixReadOnly(e.transform);s=i.m41}"mousedown"===c.type&&(window.addEventListener("mousemove",t.ce),window.addEventListener("mouseup",t.le))}},t.me=c=>{if(a)return;let l,h;"touchmove"===c.type?(l=c.touches[0].clientX,h=c.touches[0].clientY):(l=c.clientX,h=c.clientY);const p=l-e,u=h-i;if(!r&&!d){if(Math.abs(u)>Math.abs(p)&&Math.abs(u)>15)return void(r=!0);if(!(Math.abs(p)>15))return;d=!0,n=!0,t.sliderElement&&(t.sliderElement.style.transition="none",t.sliderElement.style.cursor="grabbing"),c.cancelable&&c.preventDefault()}if(r||!d)return;c.cancelable&&c.preventDefault(),o=l;let g=o-e;const m=0===t.currentIndex,f=t.currentIndex===t.cards.length-1;(m&&g>0||f&&g<0)&&(g*=.5*(.3+.7/(1+Math.abs(g)/(.5*t.slideWidth))));const v=s+g;t.sliderElement&&requestAnimationFrame(()=>{t.sliderElement.style.transform=`translateX(${v}px)`})},t.fe=i=>{if("mouseup"!==i.type&&"mouseleave"!==i.type||(window.removeEventListener("mousemove",t.ce),window.removeEventListener("mouseup",t.le)),a)return void(a=!1);const s=n;if(n=!1,r=!1,d=!1,a=!1,t.sliderElement){const e=t.Yt||"0.3s",i=t.Qt||"ease-out";t.sliderElement.style.transition=`transform ${e} ${i}`,t.sliderElement.style.cursor=""}if(!s||"touchcancel"===i.type)return void t.updateSlider();const c=o-e,l=.2*t.slideWidth;Math.abs(c)>l&&(c>0&&t.currentIndex>0?t.currentIndex--:c<0&&t.currentIndex<t.cards.length-1&&t.currentIndex++),t.updateSlider(!0)},t.re=t.ge.bind(t),t.se=t.me.bind(t),t.ae=t.fe.bind(t),t.de=t.ge.bind(t),t.ce=t.me.bind(t),t.le=t.fe.bind(t),t.cardContainer.addEventListener("touchstart",t.re,{passive:!0}),t.cardContainer.addEventListener("touchmove",t.se,{passive:!1}),t.cardContainer.addEventListener("touchend",t.ae,{passive:!0}),t.cardContainer.addEventListener("touchcancel",t.ae,{passive:!0}),t.cardContainer.addEventListener("mousedown",t.de)}(this),setTimeout(()=>{this.Kt()},200),this.initialized=!0}Ot(t,e){zt(t,e,this._t)}Lt(t,e,i){const o=`${t}:${e.uid}`;if(this.It.set(o,{status:i?"completed":"needs_action",timestamp:Date.now()}),setTimeout(()=>{this.It.delete(o)},3e3),St(t,e,i,this._t),!i&&this.kt.clear_search_on_uncheck&&this.kt.enable_search){const i=this.yt.get(t);if(i&&""!==i.trim()){e.summary,this.yt.delete(t),this.xt="";const i=this.cards.find(e=>e.entityId===t);if(i&&i.element){let e;e=i.element.classList.contains("todo-card-with-title-wrapper")?i.element.querySelector(".native-todo-card .add-textfield input"):i.element.querySelector(".add-textfield input"),e&&(e.value=""),this.cardBuilder.updateNativeTodoCard(i.element,t)}}}}Ht(t,e){this.dialogManager.editTodoItem(t,e)}pe(){let t;this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeObserver=new ResizeObserver(()=>{t&&clearTimeout(t),t=setTimeout(()=>{if(!this.cardContainer)return;const t=this.cardContainer.offsetWidth;t>0&&Math.abs(t-this.slideWidth)>1&&(this.slideWidth=t,requestAnimationFrame(()=>{const t=getComputedStyle(this.cardContainer).borderRadius;this.cards.forEach(e=>{e.slide&&(e.slide.style.borderRadius=t)}),this.updateSlider(!1)}))},200)}),this.cardContainer&&this.resizeObserver.observe(this.cardContainer)}goToSlide(t){this.cards&&0!==this.cards.length&&this.initialized&&(t=Math.max(0,Math.min(t,this.cards.length-1)))!==this.currentIndex&&(this.currentIndex=t,this.updateSlider())}updateSlider(t=!0){this.sliderElement&&this.slideWidth&&0!==this.cards.length&&this.initialized&&requestAnimationFrame(()=>{if(!this.sliderElement||!this.cardContainer||!this.initialized)return;const e=this.Yt||"0.3s",i=this.Qt||"ease-out";this.sliderElement.style.transition=t?`transform ${e} ${i}`:"none";const o=this.kt.card_spacing||0;this.sliderElement.style.gap=`${o}px`;const n=this.currentIndex*(this.slideWidth+o);this.sliderElement.style.transform=`translateX(-${n}px)`;const r=getComputedStyle(this.cardContainer).borderRadius;var s;this.cards.forEach(t=>{t.slide&&(t.slide.style.marginRight="0px",t.slide.style.borderRadius=r)}),(s=this).paginationElement&&(s.paginationElement.querySelectorAll(".pagination-dot").forEach((t,e)=>{t.classList.toggle("active",e===s.currentIndex)}),kt(s)),this.kt.enable_search&&this.cards[this.currentIndex]})}getCardSize(){return 3}}class TodoSwipeCardEditor extends pt{static get properties(){return{hass:{type:Object},kt:{type:Object},ve:{type:Set,state:!0},be:{type:String,state:!0}}}constructor(){super(),this.ve=new Set,this.be="normal",this.we=this.we.bind(this)}async connectedCallback(){super.connectedCallback(),await this.xe(),this.requestUpdate()}async xe(){let t=0;for(;!customElements.get("ha-entity-picker")&&t<50;)await this.ye(),customElements.get("ha-entity-picker")||(await new Promise(t=>setTimeout(t,100)),t++);customElements.get("ha-entity-picker")||console.error("Failed to load ha-entity-picker after multiple attempts")}async ye(){if(!customElements.get("ha-entity-picker"))try{const t=[()=>customElements.get("hui-entities-card")?.getConfigElement?.(),()=>customElements.get("hui-entity-picker-card")?.getConfigElement?.()];for(const e of t)try{if(await e(),customElements.get("ha-entity-picker"))break}catch(t){}}catch(t){console.warn("Could not load ha-entity-picker",t)}}updated(t){super.updated(t),t.has("_config")&&this.kt&&this.kt.entities&&this.kt.entities.length>0&&(this.ke&&cancelAnimationFrame(this.ke),this.ke=requestAnimationFrame(()=>{const t=this.shadowRoot.querySelectorAll("ha-entity-picker");(0===t.length||t.length<this.kt.entities.length)&&this.requestUpdate(),this.ke=null}))}Tt(t){return"string"==typeof t?t:t?.entity||""}_e(t){const e={type:t.type,entities:t.entities,card_spacing:t.card_spacing,show_pagination:t.show_pagination,show_create:t.show_create,show_addbutton:t.show_addbutton,show_completed:t.show_completed,show_completed_menu:t.show_completed_menu,delete_confirmation:t.delete_confirmation,enable_search:t.enable_search,clear_search_on_uncheck:t.clear_search_on_uncheck},i=["type","entities","card_spacing","show_pagination","show_create","show_addbutton","show_completed","show_completed_menu","delete_confirmation","enable_search","clear_search_on_uncheck","custom_card_mod"];return Object.entries(t).forEach(([t,o])=>{i.includes(t)||(e[t]=o)}),t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(e.custom_card_mod=t.custom_card_mod),e}setConfig(t){if(JSON.stringify(t),this.kt={...this.constructor.getStubConfig()},t){let e=t.entities||[];Array.isArray(e)||(e="object"==typeof e?Object.values(e):"string"==typeof e?[e]:[]),e=e.map(t=>t);if(e.length>0&&(""===e[e.length-1]||"object"==typeof e[e.length-1]&&""===e[e.length-1].entity)){const t=e.slice(0,-1).filter(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim());e=[...t,""]}else e=e.filter(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim());let i=t.card_spacing;void 0===i?i=15:(i=parseInt(i),(isNaN(i)||i<0)&&(i=15));const o={...this.kt,...t,entities:e,card_spacing:i};t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(o.custom_card_mod=t.custom_card_mod),this.kt=o}JSON.stringify(this.kt),this.requestUpdate()}static getStubConfig(){return{entities:[],card_spacing:15,show_pagination:!0,show_icons:!1,show_create:!0,show_addbutton:!1,show_completed:!1,show_completed_menu:!1,delete_confirmation:!1,enable_search:!1,clear_search_on_uncheck:!1}}get $e(){return!1!==this.kt.show_pagination}get ze(){return!0===this.kt.show_addbutton}get Se(){return!1!==this.kt.show_create}get Ce(){return!0===this.kt.show_completed}get Te(){return!0===this.kt.show_completed_menu}get De(){return!0===this.kt.delete_confirmation}get Ee(){return!0===this.kt.show_icons}get Ae(){return!0===this.kt.enable_search}get Me(){return!0===this.kt.clear_search_on_uncheck}get Ne(){return void 0!==this.kt.card_spacing?this.kt.card_spacing:15}get Oe(){return(this.kt.entities||[]).filter(t=>{const e=this.Tt(t);return e&&""!==e.trim()})}get Ie(){return this.Ce}get je(){return this.Ce&&this.Te}get Le(){return this.Oe.length>0}static get styles(){return p`
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
    `}He(t,e){if(!this.kt?.entities)return;const i=[...this.kt.entities],o=t+e;if(o<0||o>=i.length)return;[i[t],i[o]]=[i[o],i[t]],this.ve.has(t)&&(this.ve.delete(t),this.ve.add(o)),this.ve.has(o)&&(this.ve.delete(o),this.ve.add(t));const n={...this.kt,entities:i};this.kt=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n}})),this.requestUpdate()}Pe(t){this.ve.has(t)?this.ve.delete(t):(this.ve.clear(),this.ve.add(t)),this.requestUpdate()}Ve(t){this.be=t,this.requestUpdate(),setTimeout(()=>{this.be="normal",this.requestUpdate()},"blocked"===t?1e3:500)}Fe(t=-1){if(!this.hass)return[];const e=Object.keys(this.hass.states).filter(t=>t.startsWith("todo.")&&this.hass.states[t]),i=(this.kt.entities||[]).map((e,i)=>i===t?null:this.Tt(e)).filter(t=>t&&""!==t.trim());return e.filter(t=>!i.includes(t))}Re(t){const e=this.Tt(t);if(!e||""===e.trim())return{displayName:"Empty Entity",friendlyName:""};const i=this.hass?.states?.[e],o=i?.attributes?.friendly_name||e.split(".").pop().replace(/_/g," ");return{displayName:o,friendlyName:o}}Ue(t){if(!this.kt||!this.hass)return;const e=t.target,i=void 0!==e.checked?e.checked:e.value,o=e.configValue||e.getAttribute("data-config-value");if(o){const t=this._e({...this.kt,[o]:i});this.kt=t,this.Je(t)}}Je(t){this.Be&&clearTimeout(this.Be),this.Be=setTimeout(()=>{const e=this._e(t);this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))},150)}Ze(t){if(!this.kt)return;const e=parseInt(t.target.value);if(!isNaN(e)&&e>=0){const t=this._e({...this.kt,card_spacing:e});this.kt=t,this.Je(t)}}we(t){if(t&&(t.preventDefault(),t.stopPropagation()),!this.kt)return;const e=Array.isArray(this.kt.entities)?[...this.kt.entities]:[];if(e.length>0&&(""===e[e.length-1]||"object"==typeof e[e.length-1]&&""===e[e.length-1].entity))return void this.Ve("blocked");e.push({entity:""});const i={...this.kt,entities:e};this.kt=i,this.Ve("success"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i},bubbles:!0,composed:!0})),setTimeout(()=>{this.requestUpdate()},0)}qe(t){if(!this.kt||!Array.isArray(this.kt.entities))return;const e=[...this.kt.entities];e.splice(t,1),this.ve.delete(t);const i=new Set;this.ve.forEach(e=>{e>t?i.add(e-1):e<t&&i.add(e)}),this.ve=i;const o={...this.kt,entities:e};this.kt=o,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o}})),this.requestUpdate()}We(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const i=t.detail?.value||t.target.value||"",o=[...this.kt.entities],n=o[e];o[e]="object"==typeof n?{...n,entity:i}:{entity:i};const r={...this.kt,entities:o};this.kt=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}})),this.requestUpdate()}Xe(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const i=t.target.value||"none",o=[...this.kt.entities],n=o[e];o[e]="string"==typeof n?{entity:n,display_order:i}:{...n,display_order:i};const r={...this.kt,entities:o};this.kt=r,this.Je(r)}Ke(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const i=t.target.value||"",o=[...this.kt.entities],n=o[e];if("string"==typeof n){const t={entity:n};i&&(t.background_image=i),o[e]=t}else if(i)o[e]={...n,background_image:i};else{const t={...n};delete t.background_image,o[e]=t}const r={...this.kt,entities:o};this.kt=r,this.Je(r)}Ge(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const i=t.target.checked,o=[...this.kt.entities],n=o[e];o[e]="string"==typeof n?{entity:n,show_title:i}:{...n,show_title:i};const r={...this.kt,entities:o};this.kt=r,this.Je(r)}Ye(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const i=t.target.value||"",o=[...this.kt.entities],n=o[e];if("string"==typeof n){const t={entity:n};i&&(t.title=i),o[e]=t}else if(i)o[e]={...n,title:i};else{const t={...n};delete t.title,o[e]=t}const r={...this.kt,entities:o};this.kt=r,this.Je(r)}Qe(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const i=t.target.value||"",o=[...this.kt.entities],n=o[e];if("string"==typeof n){const t={entity:n};i&&(t.icon=i),o[e]=t}else if(i)o[e]={...n,icon:i};else{const t={...n};delete t.icon,o[e]=t}const r={...this.kt,entities:o};this.kt=r,this.Je(r)}ti(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const i=t.target.checked,o=[...this.kt.entities],n=o[e];if("string"==typeof n)i&&(o[e]={entity:n,hide_future_items:!0});else if(i)o[e]={...n,hide_future_items:!0};else{const t={...n};delete t.hide_future_items,o[e]=t}const r={...this.kt,entities:o};this.kt=r,this.Je(r)}ei(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const i=parseInt(t.target.value),o=[...this.kt.entities],n=o[e];if("string"==typeof n)!isNaN(i)&&i>=1&&(o[e]={entity:n,max_items:i});else if(!isNaN(i)&&i>=1)o[e]={...n,max_items:i};else{const t={...n};delete t.max_items,o[e]=t}const r={...this.kt,entities:o};this.kt=r,this.Je(r)}ii(t){const e=this.kt.entities[t];return"string"==typeof e?{entity:e,display_order:"none",show_title:!1,title:"",background_image:"",hide_future_items:!1,max_items:void 0}:{entity:e?.entity||"",display_order:e?.display_order||"none",show_title:e?.show_title||!1,title:e?.title||"",background_image:e?.background_image||"",icon:e?.icon||"",hide_future_items:e?.hide_future_items||!1,max_items:e?.max_items||void 0}}oi(){return[{value:e,label:"Default"},{value:i,label:"Alphabetical A-Z"},{value:o,label:"Alphabetical Z-A"},{value:n,label:"Due Date (Earliest First)"},{value:r,label:"Due Date (Latest First)"}]}ni(t,e){t.stopPropagation(),this.Pe(e)}ri(t,e){t.stopPropagation(),e()}si(t,e){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),t.stopPropagation(),this.Pe(e))}ai(t){t.stopPropagation(),t.preventDefault()}render(){if(!this.hass||!this.kt)return W`<div>Loading...</div>`;const e=Array.isArray(this.kt.entities)?this.kt.entities:[];return JSON.stringify(this.kt),W`
      <div class="card-config">
        <!-- Todo Lists Section -->
        <div class="section">
          <div class="section-header">Todo Lists</div>

          <div class="card-list">
            ${0===e.length?W`<div class="no-cards">
                  No todo lists added yet. Click "+ ADD TODO LIST" below to add your first list.
                </div>`:e.map((t,i)=>{const o=this.Re(t),n=this.ve.has(i),r=this.ii(i);return W`
                    <div
                      class="card-row clickable-row ${n?"expanded":""}"
                      data-index=${i}
                      @click=${()=>this.Pe(i)}
                      role="button"
                      tabindex="0"
                      aria-expanded=${n}
                      aria-label="Todo list ${i+1}: ${o.displayName}. Click to ${n?"collapse":"expand"}"
                      @keydown=${t=>this.si(t,i)}
                    >
                      <div class="card-info">
                        <ha-icon-button
                          class="expand-button leading"
                          label=${n?"Collapse":"Expand"}
                          path=${n?"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z":"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"}
                          @click=${t=>this.ni(t,i)}
                        ></ha-icon-button>
                        <span class="card-index">${i+1}</span>
                        <span class="card-type">${o.displayName}</span>
                        ${r.entity&&""!==r.entity.trim()?W`<span class="card-name">(${r.entity})</span>`:W`<span class="card-name" style="color: var(--error-color);"
                              >(Not configured)</span
                            >`}
                      </div>
                      <div class="card-actions" @click=${this.ai}>
                        <ha-icon-button
                          label="Move Up"
                          ?disabled=${0===i}
                          path="M7,15L12,10L17,15H7Z"
                          @click=${t=>this.ri(t,()=>this.He(i,-1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Move Down"
                          ?disabled=${i===e.length-1}
                          path="M7,9L12,14L17,9H7Z"
                          @click=${t=>this.ri(t,()=>this.He(i,1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Delete Todo List"
                          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                          @click=${t=>this.ri(t,()=>this.qe(i))}
                          style="color: var(--error-color);"
                        ></ha-icon-button>
                      </div>
                    </div>
                    ${n?W`
                          <div class="expanded-content">
                            <ha-entity-picker
                              .hass=${this.hass}
                              .value=${r.entity}
                              .includeDomains=${["todo"]}
                              .includeEntities=${this.Fe(i)}
                              data-index=${i}
                              @value-changed=${this.We}
                              allow-custom-entity
                              label="Todo Entity"
                            ></ha-entity-picker>

                            ${r.entity&&""!==r.entity.trim()?W`
                                  <div
                                    style="margin: 8px 0; background: var(--secondary-background-color); border-radius: 4px;"
                                  >
                                    <div class="toggle-option" style="margin: 8px 0;">
                                      <div class="toggle-option-label">Show Title</div>
                                      <ha-switch
                                        .checked=${r.show_title}
                                        data-index=${i}
                                        @change=${this.Ge}
                                      ></ha-switch>
                                    </div>

                                    ${r.show_title?W`
                                          <ha-textfield
                                            label="Title Text"
                                            .value=${r.title}
                                            data-index=${i}
                                            @input=${this.Ye}
                                            style="width: 100%; margin-top: 8px;"
                                          ></ha-textfield>
                                        `:""}
                                  </div>

                                  <ha-select
                                    .label=${"Display Order"}
                                    .value=${r.display_order}
                                    data-index=${i}
                                    @selected=${this.Xe}
                                    @closed=${this.ai}
                                    style="margin-bottom: 4px;"
                                  >
                                    ${this.oi().map(t=>W`
                                        <mwc-list-item .value=${t.value}>
                                          ${t.label}
                                        </mwc-list-item>
                                      `)}
                                  </ha-select>

                                  <ha-textfield
                                    label="Background Image URL"
                                    .value=${r.background_image}
                                    data-index=${i}
                                    @input=${this.Ke}
                                    style="width: 100%; margin-top: 4px;"
                                    placeholder="Optional: e.g. /local/images/background.jpg"
                                  ></ha-textfield>

                                  ${this.Ee?W`
                                        <ha-textfield
                                          label="Custom Icon"
                                          .value=${r.icon}
                                          data-index=${i}
                                          @input=${this.Qe}
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
                                        .checked=${r.hide_future_items}
                                        data-index=${i}
                                        @change=${this.ti}
                                      ></ha-switch>
                                    </div>

                                    <ha-textfield
                                      label="Maximum items to show"
                                      type="number"
                                      min="1"
                                      .value=${r.max_items||""}
                                      data-index=${i}
                                      @input=${this.ei}
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
              class="add-todo-button ${"normal"!==this.be?this.be:""}"
              @click=${t=>this.we(t)}
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
              .value=${this.Ne}
              @change=${this.Ze}
              data-config-value="card_spacing"
              suffix="px"
            ></ha-textfield>
            <div class="spacing-help-text">Visual gap between cards when swiping (in pixels)</div>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show pagination dots</div>
            <ha-switch
              .checked=${this.$e}
              data-config-value="show_pagination"
              @change=${this.Ue}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show icons</div>
            <ha-switch
              .checked=${this.Ee}
              data-config-value="show_icons"
              @change=${this.Ue}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show 'Add item' field</div>
            <ha-switch
              .checked=${this.Se}
              data-config-value="show_create"
              @change=${this.Ue}
            ></ha-switch>
          </div>

          ${this.Se?W`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show '+' add button next to field</div>
                    <ha-switch
                      .checked=${this.ze}
                      data-config-value="show_addbutton"
                      @change=${this.Ue}
                    ></ha-switch>
                  </div>

                  <div class="toggle-option">
                    <div class="toggle-option-label">Enable search functionality</div>
                    <ha-switch
                      .checked=${this.Ae}
                      data-config-value="enable_search"
                      @change=${this.Ue}
                    ></ha-switch>
                  </div>

                  ${this.Ae?W`
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
                              .checked=${this.Me}
                              data-config-value="clear_search_on_uncheck"
                              @change=${this.Ue}
                            ></ha-switch>
                          </div>
                        </div>
                      `:""}
                </div>
              `:""}

          <div class="toggle-option">
            <div class="toggle-option-label">Show completed items</div>
            <ha-switch
              .checked=${this.Ce}
              data-config-value="show_completed"
              @change=${this.Ue}
            ></ha-switch>
          </div>

          ${this.Ce?W`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show 'Delete completed' button</div>
                    <ha-switch
                      .checked=${this.Te}
                      data-config-value="show_completed_menu"
                      @change=${this.Ue}
                    ></ha-switch>
                  </div>

                  ${this.Te?W`
                        <div class="nested-toggle-option">
                          <div class="toggle-option">
                            <div class="toggle-option-label">Show delete confirmation dialog</div>
                            <ha-switch
                              .checked=${this.De}
                              data-config-value="delete_confirmation"
                              @change=${this.Ue}
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
    `}}function Pt(t,e,i,o,n,r,s,a,d){const c=e=>{e.preventDefault(),e.dataTransfer.dropEffect="move";const n=o.querySelector(".dragging");if(!n||n===t)return;const r=t.getBoundingClientRect(),s=r.top+r.height/2,a=e.clientY<s?"top":"bottom";i.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom")),"top"===a?t.classList.add("drag-over-top"):t.classList.add("drag-over-bottom")},l=async n=>{n.preventDefault(),n.stopPropagation();const r=o.querySelector(".dragging");if(!r||r===t)return void i.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom"));const c=n.dataTransfer.getData("text/plain"),l=a.find(t=>t.uid===c);if(!l)return void i.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom"));const h=t.getBoundingClientRect(),p=h.top+h.height/2,u=n.clientY<p;let g=null;if(u){const t=a.findIndex(t=>t.uid===e.uid);t>0&&(g=a[t-1].uid)}else g=e.uid;const m=a.findIndex(t=>t.uid===c),f=a.findIndex(t=>t.uid===e.uid);if(u&&f===m+1||!u&&f===m-1)return void i.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom"));i.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom")),l.summary;const{moveItem:v}=await Promise.resolve().then(function(){return It});await v(s,c,g,d)};t.di=c,t.ci=l,t.addEventListener("dragover",c),t.addEventListener("drop",l)}function Vt(t){if(!t)return;t.querySelectorAll(".todo-item").forEach(t=>{if(t.setAttribute("draggable","false"),t.classList.remove("dragging","drag-over-top","drag-over-bottom","drag-ready"),t.li){const{handlePointerDown:e,handlePointerMove:i,handlePointerUp:o,handleDragStart:n,handleDragEnd:r}=t.li;e&&t.removeEventListener("mousedown",e),i&&t.removeEventListener("mousemove",i),o&&(t.removeEventListener("mouseup",o),t.removeEventListener("mouseleave",o)),n&&t.removeEventListener("dragstart",n),r&&t.removeEventListener("dragend",r),delete t.li}t.di&&(t.removeEventListener("dragover",t.di),delete t.di),t.ci&&(t.removeEventListener("drop",t.ci),delete t.ci)})}customElements.define("todo-swipe-card",TodoSwipeCard),customElements.define("todo-swipe-card-editor",TodoSwipeCardEditor),window.customCards||(window.customCards=[]),window.customCards.some(t=>"todo-swipe-card"===t.type)||window.customCards.push({type:"todo-swipe-card",name:"Todo Swipe Card",preview:!0,description:"A specialized swipe card for to-do lists"}),console.info(`%c TODO-SWIPE-CARD %c v${t} %c - A swipeable card for to-do lists`,"color: white; background: #4caf50; font-weight: 700;","color: #4caf50; background: white; font-weight: 700;","color: grey; background: white; font-weight: 400;");var Ft=/*#__PURE__*/Object.freeze({__proto__:null,cleanupDragAndDrop:Vt,setupDragAndDrop:function(t,e,i,o){Vt(t);const n=t.querySelectorAll('.todo-item[data-supports-drag="true"]');let r=null,s=null;if("ontouchstart"in window||navigator.maxTouchPoints>0)return void n.forEach((a,d)=>{const c=i[d];c&&(a.setAttribute("draggable","true"),function(t,e,i,o,n,r,s,a,d){const c=i=>{if(i.target.closest("ha-checkbox")||i.target.closest(".todo-checkbox"))return void i.preventDefault();t.classList.add("dragging"),i.dataTransfer.effectAllowed="move",i.dataTransfer.setData("text/plain",e.uid);const o=document.createElement("div");o.style.cssText="position: absolute; top: -1000px; width: 1px; height: 1px; opacity: 0;",document.body.appendChild(o),i.dataTransfer.setDragImage(o,0,0),setTimeout(()=>{document.body.removeChild(o)},0),e.summary},l=()=>{t.classList.remove("dragging"),i.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom")),e.summary};t.li={handleDragStart:c,handleDragEnd:l},t.addEventListener("dragstart",c),t.addEventListener("dragend",l),Pt(t,e,i,o,n,r,s,a,d)}(a,c,n,t,r,s,e,i,o))});n.forEach((a,d)=>{const c=i[d];if(!c)return;a.setAttribute("draggable","false");let l=null,h=0,p=0,u=!1,g=!1;const m=t=>{t.target.closest("ha-checkbox")||t.target.closest(".todo-checkbox")||(h=t.clientX,p=t.clientY,u=!1,g=!0,l=setTimeout(()=>{u=!0,g=!1,a.setAttribute("draggable","true"),a.classList.add("drag-ready"),navigator.vibrate&&navigator.vibrate(50),c.summary},200),c.summary)},f=t=>{if(!g||!l)return;const e=Math.abs(t.clientX-h),i=Math.abs(t.clientY-p);(e>8||i>8)&&(clearTimeout(l),l=null,g=!1,c.summary)},v=t=>{const e="mouseleave"===t.type,i="mouseup"===t.type;if(g&&l){if(e)return void c.summary;if(i)return clearTimeout(l),l=null,g=!1,void c.summary}if(a.classList.contains("dragging"))c.summary;else{if(u){if(e)return void c.summary;if(i)return c.summary,a.setAttribute("draggable","false"),a.classList.remove("drag-ready"),u=!1,void(g=!1)}setTimeout(()=>{a.classList.contains("dragging")||u||(a.setAttribute("draggable","false"),a.classList.remove("drag-ready"),u=!1,g=!1)},100)}},b=t=>{if(t.target.closest("ha-checkbox")||t.target.closest(".todo-checkbox"))return void t.preventDefault();if(!u)return t.preventDefault(),void c.summary;a.classList.add("dragging"),a.classList.remove("drag-ready"),t.dataTransfer.effectAllowed="move",t.dataTransfer.setData("text/plain",c.uid);const e=document.createElement("div");e.style.cssText="position: absolute; top: -1000px; width: 1px; height: 1px; opacity: 0;",document.body.appendChild(e),t.dataTransfer.setDragImage(e,0,0),setTimeout(()=>{document.body.removeChild(e)},0),c.summary},w=()=>{a.classList.remove("dragging","drag-ready"),a.setAttribute("draggable","false"),u=!1,g=!1,n.forEach(t=>t.classList.remove("drag-over-top","drag-over-bottom")),r=null,s=null,c.summary};a.li={handlePointerDown:m,handlePointerMove:f,handlePointerUp:v,handleDragStart:b,handleDragEnd:w},a.addEventListener("mousedown",m),a.addEventListener("mousemove",f),a.addEventListener("mouseup",v),a.addEventListener("mouseleave",v),a.addEventListener("dragstart",b),a.addEventListener("dragend",w),Pt(a,c,n,t,r,s,e,i,o)})}});export{TodoSwipeCard,TodoSwipeCardEditor};
