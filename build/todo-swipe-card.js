// Version number
const VERSION = '3.1.0';

// Todo sorting modes for display order configuration
const TodoSortMode = {
  NONE: 'none',
  ALPHA_ASC: 'alpha_asc',
  ALPHA_DESC: 'alpha_desc',
  DUEDATE_ASC: 'duedate_asc',
  DUEDATE_DESC: 'duedate_desc'
};

/**
 * Log debug messages when debug mode is enabled
 * @param {string} message - Debug message
 * @param {any} data - Optional data to log
 */
const debugLog = (message, data) => {
  console.log(`[TodoSwipeCard] ${message}`, data !== undefined ? data : '');
};

/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=!0,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce(((e,s,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1]),t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet));else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b={attribute:!0,type:String,converter:u$1,reflect:!1,useDefault:!1,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b){if(s.state&&(s.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=!0),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return !1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach((t=>t(this)));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach((t=>t.hostConnected?.()));}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach((t=>t.hostDisconnected?.()));}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&!0===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i){if(void 0!==t){const e=this.constructor,h=this[t];if(i??=e.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(e._$Eu(t,i))))return;this.C(t,s,i);}!1===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),!0!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),!0===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=!0;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];!0!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=!1;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach((t=>t.hostUpdate?.())),this.update(s)):this._$EM();}catch(s){throw t=!1,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach((t=>t.hostUpdated?.())),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=!1;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return !0}update(t){this._$Eq&&=this._$Eq.forEach((t=>this._$ET(t,this[t]))),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.1");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t.trustedTypes,s$1=i$1?i$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,e="$lit$",h=`lit$${Math.random().toFixed(9).slice(2)}$`,o$1="?"+h,n=`<${o$1}>`,r=document,l=()=>r.createComment(""),c=t=>null===t||"object"!=typeof t&&"function"!=typeof t,a=Array.isArray,u=t=>a(t)||"function"==typeof t?.[Symbol.iterator],d="[ \t\n\f\r]",f=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,v=/-->/g,_=/>/g,m=RegExp(`>|${d}(?:([^\\s"'>=/]+)(${d}*=${d}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),p=/'/g,g=/"/g,$=/^(?:script|style|textarea|title)$/i,y=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),x=y(1),T=Symbol.for("lit-noChange"),E=Symbol.for("lit-nothing"),A=new WeakMap,C=r.createTreeWalker(r,129);function P(t,i){if(!a(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==s$1?s$1.createHTML(i):i}const V=(t,i)=>{const s=t.length-1,o=[];let r,l=2===i?"<svg>":3===i?"<math>":"",c=f;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,y=0;for(;y<s.length&&(c.lastIndex=y,u=c.exec(s),null!==u);)y=c.lastIndex,c===f?"!--"===u[1]?c=v:void 0!==u[1]?c=_:void 0!==u[2]?($.test(u[2])&&(r=RegExp("</"+u[2],"g")),c=m):void 0!==u[3]&&(c=m):c===m?">"===u[0]?(c=r??f,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?m:'"'===u[3]?g:p):c===g||c===p?c=m:c===v||c===_?c=f:(c=m,r=void 0);const x=c===m&&t[i+1].startsWith("/>")?" ":"";l+=c===f?s+n:d>=0?(o.push(a),s.slice(0,d)+e+s.slice(d)+h+x):s+h+(-2===d?i:x);}return [P(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),o]};class N{constructor({strings:t,_$litType$:s},n){let r;this.parts=[];let c=0,a=0;const u=t.length-1,d=this.parts,[f,v]=V(t,s);if(this.el=N.createElement(f,n),C.currentNode=this.el.content,2===s||3===s){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=C.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(e)){const i=v[a++],s=r.getAttribute(t).split(h),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:c,name:e[2],strings:s,ctor:"."===e[1]?H:"?"===e[1]?I:"@"===e[1]?L:k}),r.removeAttribute(t);}else t.startsWith(h)&&(d.push({type:6,index:c}),r.removeAttribute(t));if($.test(r.tagName)){const t=r.textContent.split(h),s=t.length-1;if(s>0){r.textContent=i$1?i$1.emptyScript:"";for(let i=0;i<s;i++)r.append(t[i],l()),C.nextNode(),d.push({type:2,index:++c});r.append(t[s],l());}}}else if(8===r.nodeType)if(r.data===o$1)d.push({type:2,index:c});else {let t=-1;for(;-1!==(t=r.data.indexOf(h,t+1));)d.push({type:7,index:c}),t+=h.length-1;}c++;}}static createElement(t,i){const s=r.createElement("template");return s.innerHTML=t,s}}function S(t,i,s=t,e){if(i===T)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=c(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(!1),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=S(t,h._$AS(t,i.values),h,e)),i}class M{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??r).importNode(i,!0);C.currentNode=e;let h=C.nextNode(),o=0,n=0,l=s[0];for(;void 0!==l;){if(o===l.index){let i;2===l.type?i=new R(h,h.nextSibling,this,t):1===l.type?i=new l.ctor(h,l.name,l.strings,this,t):6===l.type&&(i=new z(h,this,t)),this._$AV.push(i),l=s[++n];}o!==l?.index&&(h=C.nextNode(),o++);}return C.currentNode=r,e}p(t){let i=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class R{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=E,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??!0;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=S(this,t,i),c(t)?t===E||null==t||""===t?(this._$AH!==E&&this._$AR(),this._$AH=E):t!==this._$AH&&t!==T&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):u(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==E&&c(this._$AH)?this._$AA.nextSibling.data=t:this.T(r.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=N.createElement(P(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new M(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=A.get(t.strings);return void 0===i&&A.set(t.strings,i=new N(t)),i}k(t){a(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new R(this.O(l()),this.O(l()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,i){for(this._$AP?.(!1,!0,i);t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i;}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class k{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=E,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=E;}_$AI(t,i=this,s,e){const h=this.strings;let o=!1;if(void 0===h)t=S(this,t,i,0),o=!c(t)||t!==this._$AH&&t!==T,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=S(this,e[s+n],i,n),r===T&&(r=this._$AH[n]),o||=!c(r)||r!==this._$AH[n],r===E?t=E:t!==E&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===E?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class H extends k{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===E?void 0:t;}}class I extends k{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==E);}}class L extends k{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=S(this,t,i,0)??E)===T)return;const s=this._$AH,e=t===E&&s!==E||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==E&&(s===E||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){S(this,t);}}const j=t.litHtmlPolyfillSupport;j?.(N,R),(t.litHtmlVersions??=[]).push("3.3.1");const B=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new R(i.insertBefore(l(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=B(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1);}render(){return T}}i._$litElement$=!0,i["finalized"]=!0,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.1");

/**
 * TODO SWIPE CARD CSS VARIABLES REFERENCE
 *
 * This card supports extensive customization through CSS variables. All variables are optional
 * and fall back to sensible defaults. Variables can be set via Home Assistant themes or
 * card-mod styling.
 *
 * USAGE EXAMPLES:
 *
 * Via Home Assistant theme (applies to all instances):
 * ```yaml
 * frontend:
 *   themes:
 *     my_theme:
 *       todo-swipe-card-text-color: "#2c3e50"
 *       todo-swipe-card-background: "#ffffff"
 * ```
 *
 * Via card-mod (applies to specific card):
 * ```yaml
 * type: custom:todo-swipe-card
 * card_mod:
 *   style: |
 *     :host {
 *       --todo-swipe-card-text-color: #2c3e50;
 *       --todo-swipe-card-background: linear-gradient(45deg, #667eea, #764ba2);
 *     }
 * ```
 *
 * VARIABLE CATEGORIES:
 *
 * 🎨 CORE APPEARANCE
 * --todo-swipe-card-background: Main card background (color/gradient/image)
 * --todo-swipe-card-text-color: Primary text color for todo items
 *
 * 📝 TYPOGRAPHY & LAYOUT
 * --todo-swipe-card-font-size: Base font size for todo text (default: 11px)
 * --todo-swipe-card-item-font-weight: Font weight for todo item text
 * --todo-swipe-card-line-height: Line height for multi-line text (default: 1.3)
 * --todo-swipe-card-item-height: Minimum height per todo item
 * --todo-swipe-card-item-margin: Space between checkbox and text (default: 5px)
 * --todo-swipe-card-item-align: Vertical alignment: flex-start|center|flex-end
 *
 * 📅 DUE DATE STYLING
 * --todo-swipe-card-font-size-due-date: Due date text size (default: 11px)
 * --todo-swipe-card-font-weight-due-date: Due date font weight
 * --todo-swipe-card-font-color-due-date: Normal due date color
 * --todo-swipe-card-font-color-due-date-overdue: Overdue date color (red warning)
 * --todo-swipe-card-due-icon-size: Clock icon size (default: 14px)
 * --todo-swipe-card-due-date-margin-top: Space above due date (default: 2px)
 *
 * 📄 DESCRIPTION STYLING
 * --todo-swipe-card-font-size-description: Description text size
 * --todo-swipe-card-font-weight-description: Description font weight
 * --todo-swipe-card-font-color-description: Description text color (muted)
 * --todo-swipe-card-description-margin-top: Space above description (default: 1px)
 *
 * 🏷️ TITLE CONFIGURATION
 * --todo-swipe-card-title-height: Title bar height (default: 40px)
 * --todo-swipe-card-title-background: Title background color
 * --todo-swipe-card-title-color: Title text color
 * --todo-swipe-card-title-font-size: Title font size (default: 16px)
 * --todo-swipe-card-title-font-weight: Title font weight (default: 500)
 * --todo-swipe-card-title-align: Title alignment: left|center|right
 * --todo-swipe-card-title-border-color: Border color below title
 * --todo-swipe-card-title-border-width: Border thickness (default: 1px)
 * --todo-swipe-card-title-padding-horizontal: Left/right title padding (default: 16px)
 *
 * ☑️ CHECKBOX CUSTOMIZATION
 * --todo-swipe-card-checkbox-color: Unchecked checkbox color (supports rgba for opacity)
 * --todo-swipe-card-checkbox-checked-color: Checked checkbox color
 * --todo-swipe-card-checkbox-checkmark-color: Checkmark symbol color
 * --todo-swipe-card-checkbox-size: Checkbox dimensions (default: 18px)
 * --todo-swipe-card-checkbox-margin-top: Fine positioning adjustment (default: 1px)
 *
 * 🎯 ICONS & BUTTONS
 * --todo-swipe-card-icon-size: Todo list icon size (default: 48px)
 * --todo-swipe-card-icon-color: Icon color (supports opacity)
 * --todo-swipe-card-icon-opacity: Icon transparency (default: 0.6)
 * --todo-swipe-card-icon-right: Distance from right edge (default: 16px)
 * --todo-swipe-card-icon-bottom: Distance from bottom (default: 8px)
 * --todo-swipe-card-add-button-color: Plus button color
 * --todo-swipe-card-delete-button-color: Delete button color
 * --todo-swipe-card-delete-button-top: Manual delete button positioning
 *
 * 📱 INPUT FIELDS
 * --todo-swipe-card-placeholder-color: "Add item" placeholder text color
 * --todo-swipe-card-placeholder-opacity: Placeholder transparency (default: 1)
 * --todo-swipe-card-input-font-weight: Font weight for typed text
 * --todo-swipe-card-placeholder-font-weight: Font weight for placeholder
 *
 * 🔍 SEARCH FUNCTIONALITY
 * --todo-swipe-card-search-counter-font-size: Search results counter size (default: 12px)
 * --todo-swipe-card-search-counter-color: Search counter text color
 *
 * 🔘 PAGINATION DOTS
 * --todo-swipe-card-pagination-dot-size: Dot diameter (default: 8px)
 * --todo-swipe-card-pagination-dot-active-color: Active dot color
 * --todo-swipe-card-pagination-dot-inactive-color: Inactive dot color
 * --todo-swipe-card-pagination-dot-spacing: Space between dots (default: 4px)
 * --todo-swipe-card-pagination-dot-border-radius: Dot roundness (default: 50%)
 * --todo-swipe-card-pagination-dot-active-size-multiplier: Active dot size ratio (default: 1)
 * --todo-swipe-card-pagination-bottom: Distance from bottom (default: 8px)
 * --todo-swipe-card-pagination-background: Pagination area background
 * --todo-swipe-card-pagination-dot-active-opacity: Active dot opacity (default: 1)
 * --todo-swipe-card-pagination-dot-inactive-opacity: Inactive dot opacity (default: 0.6)
 *
 * 🎬 ANIMATIONS & TRANSITIONS
 * --todo-swipe-card-transition-speed: Swipe animation duration (default: 0.3s)
 * --todo-swipe-card-transition-easing: Animation timing function (default: ease-out)
 *
 * 📏 SPACING & MARGINS
 * --todo-swipe-card-item-spacing: Margin between todo items (default: 1px)
 * --todo-swipe-card-summary-margin-top: Space above main todo text (default: 3px)
 *
 * ADVANCED POSITIONING CALCULATIONS:
 * Some variables use calc() expressions for dynamic positioning:
 * - Delete button auto-adjusts position when titles are present
 * - Item heights adapt to font size changes
 * - Active pagination dots can scale proportionally
 */


/**
 * Create base styles for the card
 * @param {Object} config - Card configuration
 * @returns {HTMLStyleElement} Style element
 */
function createBaseStyles(config) {
  const style = document.createElement('style');
  style.textContent = `
    :host {
      display: block;
      overflow: hidden;
      width: 100%;
      height: 100%;
      --card-border-radius: var(--ha-card-border-radius, 12px);
      border-radius: var(--card-border-radius);
    }

    .card-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: var(--card-border-radius);
    }
    
    .card-container, .slide {
      border-radius: var(--card-border-radius) !important;
    }

    .slider {
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      transition: transform 0.3s ease-out;
      will-change: transform;
    }

    .slide {
      position: relative;
      flex: 0 0 100%;
      max-width: 100%;
      overflow: hidden;
      height: 100%;
      box-sizing: border-box;
      border-radius: var(--card-border-radius);
      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));
    }

    .pagination {
      position: absolute;
      bottom: var(--todo-swipe-card-pagination-bottom, 8px);
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1;
      background-color: var(--todo-swipe-card-pagination-background, transparent);
    }

    .pagination-dot {
      width: var(--todo-swipe-card-pagination-dot-size, 8px);
      height: var(--todo-swipe-card-pagination-dot-size, 8px);
      border-radius: var(--todo-swipe-card-pagination-dot-border-radius, 50%);
      margin: 0 var(--todo-swipe-card-pagination-dot-spacing, 4px);
      background-color: var(--todo-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));
      opacity: var(--todo-swipe-card-pagination-dot-inactive-opacity, 0.6);
      cursor: pointer;
      transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;
      flex-shrink: 0;
    }

    .pagination-dot.active {
      background-color: var(--todo-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));
      width: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));
      height: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));
      opacity: var(--todo-swipe-card-pagination-dot-active-opacity, 1);
    }
    
    .delete-completed-button {
      position: absolute;
      right: 7px;
      display: flex;
      align-items: center;
      justify-content: center;
      top: var(--todo-swipe-card-delete-button-top, var(--todo-swipe-card-delete-button-auto-top, 35px));
      padding: 4px;
      background-color: transparent;
      border: none;
      color: var(--todo-swipe-card-delete-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));
      cursor: pointer;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      z-index: 10;
    }

    .delete-completed-button:hover {
      background-color: rgba(127, 127, 127, 0.2);
    }

    .delete-completed-button svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    /* Preview styles */
    .preview-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 16px;
      box-sizing: border-box;
      height: 100%;
      background: var(--ha-card-background, var(--card-background-color, white));
      border-radius: inherit;
    }
    
    .preview-icon-container {
      margin-bottom: 16px;
    }
    
    .preview-icon-container ha-icon {
      color: var(--primary-color, #03a9f4);
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
    
    .preview-text-container {
      margin-bottom: 16px;
    }
    
    .preview-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 8px;
      color: var(--primary-text-color);
    }
    
    .preview-description {
      font-size: 14px;
      color: var(--secondary-text-color);
      max-width: 300px;
      line-height: 1.4;
      margin: 0 auto;
    }
    
    /* Dialog styles */
    ha-dialog {
      --mdc-dialog-min-width: 300px;
      --mdc-dialog-max-width: 500px;
      --mdc-dialog-heading-ink-color: var(--primary-text-color);
      --mdc-dialog-content-ink-color: var(--primary-text-color);
      --justify-action-buttons: space-between;
    }
    
    ha-dialog div {
      padding: 8px 16px 16px 16px;
      color: var(--primary-text-color);
    }
    
    /* Todo icon styling */
    .todo-icon {
      position: absolute;
      right: var(--todo-swipe-card-icon-right, 16px);
      bottom: var(--todo-swipe-card-icon-bottom, 8px);
      width: var(--todo-swipe-card-icon-size, 48px);
      height: var(--todo-swipe-card-icon-size, 48px);
      color: var(--todo-swipe-card-icon-color, rgba(255, 255, 255, 0.3));
      opacity: var(--todo-swipe-card-icon-opacity, 0.6);
      z-index: 1;
      pointer-events: none;
      --mdc-icon-size: var(--todo-swipe-card-icon-size, 48px);
    }

    .native-todo-card {
      height: 100%;
      box-sizing: border-box;
      overflow-y: auto;
      border-radius: var(--card-border-radius);
      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));
      color: var(--todo-swipe-card-text-color, var(--primary-text-color));
      font-size: var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px));
      position: relative;
      
      /* Hide scrollbar for all browsers */
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* Internet Explorer 10+ */
    }

    .native-todo-card::-webkit-scrollbar {
      display: none; /* WebKit browsers (Chrome, Safari, Edge) */
    }

    .todo-card-with-title-wrapper .native-todo-card {
      border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);
    }

    .add-row {
      padding: 8px 12px;
      padding-bottom: 0;
      margin-bottom: 6px; /* 6px + 4px todo-list padding = 10px total when no search */
      position: relative;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .add-row.has-search-counter {
      margin-bottom: 0px; /* 4px gap to search counter when search is active */
    }

    .add-textfield {
      flex-grow: 1;
      margin-right: 8px;
    }

    .add-textfield input {
      color: var(--todo-swipe-card-text-color, var(--primary-text-color)) !important;
      font-weight: var(--todo-swipe-card-input-font-weight, normal) !important;
      background: transparent !important;
      border: none !important;
      outline: none !important;
      padding: 8px 8px 2px 8px !important;
      margin-left: -4px !important;
      margin-top: 3px !important;
      width: 100% !important;
      box-sizing: border-box !important;
      font-size: inherit !important;
      font-family: inherit !important;
    }

    .add-textfield input::placeholder {
      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;
      opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;
      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;
    }

    .add-textfield input::-webkit-input-placeholder {
      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;
      opacity: 1 !important;
      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;
    }

    .add-textfield input::-moz-placeholder {
      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;
      opacity: 1 !important;
      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;
    }

    .add-button {
      position: absolute;
      right: 5px;
      top: 5px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--todo-swipe-card-add-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));
      opacity: ${config?.show_addbutton ? '1' : '0'};
      visibility: ${config?.show_addbutton ? 'visible' : 'hidden'};
      pointer-events: ${config?.show_addbutton ? 'auto' : 'none'};
    }

    .add-button:hover {
      background-color: rgba(127, 127, 127, 0.1);
    }

    .add-button svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    .todo-list {
      padding: 4px 0;
    }

    .header {
      display: none;
    }

    .empty {
      display: none;
    }

    .todo-item {
      display: flex;
      align-items: var(--todo-swipe-card-item-align, flex-start);
      padding: 1px 12px;
      min-height: var(--todo-swipe-card-item-height, calc(var(--todo-swipe-card-font-size, 11px) + 8px));
      margin-top: var(--todo-swipe-card-item-spacing, 1px);
      cursor: pointer;
      position: relative;
      padding-right: 30px;
    }

    .todo-item:first-child {
      margin-top: 0 !important;
    }

    .todo-item:hover {
      background-color: rgba(127, 127, 127, 0.1);
    }

    .todo-checkbox {
      margin-right: var(--todo-swipe-card-item-margin, 5px);
      margin-top: var(--todo-swipe-card-checkbox-margin-top, 1px);
      margin-left: 4px;
      flex-shrink: 0;
      opacity: 70%;
      --mdc-checkbox-unchecked-color: var(--todo-swipe-card-checkbox-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));
      --mdc-checkbox-checked-color: var(--todo-swipe-card-checkbox-checked-color, var(--primary-color));
      --mdc-checkbox-ink-color: var(--todo-swipe-card-checkbox-checkmark-color, white);
      --mdc-checkbox-mark-color: var(--todo-swipe-card-checkbox-checkmark-color, white);
      --mdc-checkbox-size: var(--todo-swipe-card-checkbox-size, 18px);
      --mdc-checkbox-ripple-size: var(--todo-swipe-card-checkbox-size, 18px);
      --mdc-checkbox-state-layer-size: var(--todo-swipe-card-checkbox-size, 18px);
    }

    .todo-content {
      flex: 1;
      max-width: calc(100% - 30px);
      overflow: visible;
      color: var(--todo-swipe-card-text-color, var(--primary-text-color));
      font-weight: var(--todo-swipe-card-item-font-weight, normal);
      line-height: var(--todo-swipe-card-line-height, 1.3);
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .todo-summary {
      margin: 0;
      margin-top: var(--todo-swipe-card-summary-margin-top, 3px);
      padding: 0;
      color: inherit;
      font-size: inherit;
      font-weight: inherit;
      line-height: inherit;
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: none;
      word-break: normal;        
    }

    .todo-item.completed .todo-summary {
      text-decoration: line-through;
    }

    .todo-description {
      margin-top: var(--todo-swipe-card-description-margin-top, 1px);
      color: var(--todo-swipe-card-font-color-description, var(--secondary-text-color));
      font-size: var(--todo-swipe-card-font-size-description, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)));
      font-weight: var(--todo-swipe-card-font-weight-description, normal);
      line-height: var(--todo-swipe-card-line-height, 1.3);
      white-space: normal;
      word-wrap: break-word;
      overflow-wrap: break-word;
    }

    .todo-due {
      margin-top: var(--todo-swipe-card-due-date-margin-top, 2px);
      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));
      font-size: var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px))));
      font-weight: var(--todo-swipe-card-font-weight-due-date, normal);
      line-height: var(--todo-swipe-card-line-height, 1.3);
      display: flex;
      align-items: flex-start;
      gap: 3px;
    }

    .todo-due.overdue {
      color: var(--todo-swipe-card-font-color-due-date-overdue, var(--warning-color));
    }

    .todo-item.completed .todo-due.overdue {
      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));
    }

    .todo-due-icon {
      --mdc-icon-size: var(--todo-swipe-card-due-icon-size, 14px);
      width: var(--todo-swipe-card-due-icon-size, 14px);
      height: var(--todo-swipe-card-due-icon-size, 14px);
      margin-inline-start: initial;
      flex-shrink: 0;
      margin-top: 1px;
    }

    .todo-item.completed {
      display: flex;
    }

    .todo-card-with-title-wrapper {
      position: relative;
      height: 100%;
      width: 100%;
      border-radius: var(--ha-card-border-radius, 12px);
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, white));
      display: flex;
      flex-direction: column;
    }

    .todo-swipe-card-external-title {
      min-height: var(--todo-swipe-card-title-height, 40px);
      display: flex;
      align-items: center;
      justify-content: var(--todo-swipe-card-title-align, center);
      background: var(--todo-swipe-card-title-background, var(--secondary-background-color, #f7f7f7));
      color: var(--todo-swipe-card-title-color, var(--primary-text-color));
      font-size: var(--todo-swipe-card-title-font-size, 16px);
      font-weight: var(--todo-swipe-card-title-font-weight, 500);
      border-bottom: var(--todo-swipe-card-title-border-width, 1px) solid var(--todo-swipe-card-title-border-color, rgba(0,0,0,0.12));
      padding: 0 var(--todo-swipe-card-title-padding-horizontal, 16px);
      box-sizing: content-box;
      text-align: var(--todo-swipe-card-title-align, center);
      flex-shrink: 0;
      z-index: 1;
      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;
      margin: 0;
      line-height: 1;
      font-family: inherit;
      white-space: var(--todo-swipe-card-title-white-space, nowrap);
      overflow: var(--todo-swipe-card-title-overflow, hidden);
      text-overflow: var(--todo-swipe-card-title-text-overflow, clip);
    }

    .todo-card-container {
      flex: 1;
      min-height: 0;
      position: relative;
    }

    .search-counter {
      padding: 2px 12px 2px 12px;
      margin-left: 4px;
      margin-bottom: 0px; /* Let todo-list top padding provide the 4px gap */
      font-size: var(--todo-swipe-card-search-counter-font-size, 12px);
      color: var(--todo-swipe-card-search-counter-color, var(--secondary-text-color));
      font-style: italic;
      text-align: left;
    }
  `;

  return style;
}

/**
 * Create editor styles
 * @returns {import('lit-element').CSSResult} CSS styles
 */
const editorStyles = () => i$3`
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
`;

/**
 * Build preview state
 * @param {DocumentFragment} fragment - Document fragment to append to
 */
function buildPreview(fragment) {
  debugLog('Building preview state');
  const previewContainer = document.createElement('div');
  previewContainer.className = 'preview-container';

  // Icon container
  const iconContainer = document.createElement('div');
  iconContainer.className = 'preview-icon-container';
  const icon = document.createElement('ha-icon');
  icon.icon = 'mdi:format-list-checks';
  iconContainer.appendChild(icon);

  // Text container
  const textContainer = document.createElement('div');
  textContainer.className = 'preview-text-container';

  // Title
  const title = document.createElement('div');
  title.className = 'preview-title';
  title.textContent = 'Todo Swipe Card';

  // Description
  const description = document.createElement('div');
  description.className = 'preview-description';
  description.textContent =
    'A specialized swipe card for todo lists with native styling. Supports multiple lists with swipe navigation.';

  textContainer.appendChild(title);
  textContainer.appendChild(description);

  // Button
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'preview-actions';
  const editButton = document.createElement('ha-button');
  editButton.raised = true;
  editButton.textContent = 'EDIT CARD';
  editButton.setAttribute('aria-label', 'Edit Card');
  editButton.addEventListener('click', (e) => {
    e.stopPropagation();
    debugLog('Edit button clicked, firing show-edit-card event');
    const event = new CustomEvent('show-edit-card', {
      detail: { element: e.target.closest('todo-swipe-card') },
      bubbles: true,
      composed: true
    });
    e.target.dispatchEvent(event);
  });
  actionsContainer.appendChild(editButton);

  // Append all elements
  previewContainer.appendChild(iconContainer);
  previewContainer.appendChild(textContainer);
  previewContainer.appendChild(actionsContainer);

  fragment.appendChild(previewContainer);
}

/**
 * Create a wrapper around the card with title
 * @param {HTMLElement} cardElement - The card element
 * @param {string} titleText - The title text
 * @returns {HTMLElement} Wrapper element containing title and card
 */
function createCardWithTitle(cardElement, titleText) {
  // Create wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'todo-card-with-title-wrapper';

  // Create title
  const titleElement = document.createElement('div');
  titleElement.className = 'todo-swipe-card-external-title';
  titleElement.textContent = titleText;

  // Create card container
  const cardContainer = document.createElement('div');
  cardContainer.className = 'todo-card-container';

  // Assemble
  wrapper.appendChild(titleElement);
  cardContainer.appendChild(cardElement);
  wrapper.appendChild(cardContainer);

  return wrapper;
}

/**
 * Create an icon element for the slide
 * @param {string|Object} entityConfig - Entity configuration
 * @param {string} entityId - Entity ID
 * @param {Object} hass - Home Assistant object
 * @returns {HTMLElement} Icon element
 */
function createIconElement(entityConfig, entityId, hass) {
  // Determine which icon to use
  let iconName = 'mdi:format-list-checks'; // Default fallback icon

  // Check for custom icon in entity config
  if (typeof entityConfig === 'object' && entityConfig.icon) {
    iconName = entityConfig.icon;
  } else if (hass && hass.states[entityId]) {
    // Use entity's default icon if available
    const entityIcon = hass.states[entityId].attributes.icon;
    if (entityIcon) {
      iconName = entityIcon;
    }
  }

  // Create icon element
  const iconElement = document.createElement('ha-icon');
  iconElement.className = 'todo-icon';
  iconElement.icon = iconName;

  return iconElement;
}

/**
 * Create due date element with live updates
 * @param {string} due - Due date string
 * @returns {HTMLElement} Due date element
 */
function createDueDateElement(due) {
  const dueElement = document.createElement('div');
  const dueDate = parseDueDate(due);
  const now = new Date();
  const isOverdue = dueDate && dueDate < now;

  dueElement.className = `todo-due ${isOverdue ? 'overdue' : ''}`;

  // Create clock icon using ha-svg-icon (like the official card)
  const icon = document.createElement('ha-svg-icon');
  icon.className = 'todo-due-icon';
  icon.path =
    'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z';
  dueElement.appendChild(icon);

  // Create date text
  if (dueDate) {
    const isDateOnly = !due.includes('T');
    const isToday = isDateOnly && isSameDay(new Date(), dueDate);

    if (isToday) {
      // For "today", use plain text since it doesn't need live updates
      const dateText = document.createElement('span');
      dateText.textContent = 'Today';
      dueElement.appendChild(dateText);
    } else {
      // Check if it's a short interval (less than 1 hour)
      const timeDiff = Math.abs(dueDate.getTime() - now.getTime());
      const oneHour = 60 * 60 * 1000;

      if (timeDiff < oneHour) {
        // Use custom live updater for short intervals
        const dateText = document.createElement('span');
        dueElement.appendChild(dateText);

        // Update function
        const updateTime = () => {
          const currentTime = new Date();
          const diffMs = dueDate.getTime() - currentTime.getTime();

          // Update overdue class
          const isCurrentlyOverdue = diffMs < 0;
          dueElement.classList.toggle('overdue', isCurrentlyOverdue);

          // Format the time
          if (Math.abs(diffMs) < 60000) {
            // Less than 1 minute - show seconds
            const seconds = Math.round(Math.abs(diffMs) / 1000);
            if (seconds < 5) {
              dateText.textContent = 'now';
            } else if (diffMs < 0) {
              dateText.textContent = `${seconds} seconds ago`;
            } else {
              dateText.textContent = `in ${seconds} seconds`;
            }
          } else {
            // More than 1 minute - show minutes
            const minutes = Math.round(Math.abs(diffMs) / 60000);
            if (diffMs < 0) {
              dateText.textContent = `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
            } else {
              dateText.textContent = `in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
            }
          }
        };

        // Initial update
        updateTime();

        // Set up interval for live updates
        const interval = setInterval(updateTime, 1000); // Update every second

        // Clean up interval when element is removed
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.removedNodes.forEach((node) => {
                if (node === dueElement || node.contains?.(dueElement)) {
                  clearInterval(interval);
                  observer.disconnect();
                }
              });
            }
          });
        });

        // Start observing
        if (dueElement.parentNode) {
          observer.observe(dueElement.parentNode, { childList: true, subtree: true });
        }
      } else {
        // For longer intervals, use ha-relative-time
        const relativeTime = document.createElement('ha-relative-time');
        relativeTime.setAttribute('capitalize', '');
        relativeTime.datetime = dueDate;
        dueElement.appendChild(relativeTime);
      }
    }
  } else {
    // Fallback to raw string if parsing failed
    const dateText = document.createElement('span');
    dateText.textContent = due;
    dueElement.appendChild(dateText);
  }

  return dueElement;
}

/**
 * Parse due date string to Date object (following HA's logic)
 * @param {string} due - Due date string
 * @returns {Date|null} Parsed date or null
 */
function parseDueDate(due) {
  if (!due) return null;

  try {
    if (due.includes('T')) {
      // DateTime - use exact time
      return new Date(due);
    } else {
      // Date only - set to end of day (like HA does)
      const date = new Date(`${due}T00:00:00`);
      // Set to end of day for proper "today" comparison
      date.setHours(23, 59, 59, 999);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch (e) {
    return null;
  }
}

/**
 * Check if two dates are the same day
 * @param {Date} date1 - First date
 * @param {Date} date2 - Second date
 * @returns {boolean} True if same day
 */
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Add swipe gesture handling with touch and mouse support
 *
 * Gesture Detection Strategy:
 * 1. Detect if touch/click starts on interactive elements (inputs, buttons, etc.)
 * 2. Distinguish between scroll intent (vertical) vs swipe intent (horizontal)
 * 3. Only enable drag mode after confirming horizontal swipe intention
 * 4. Apply resistance at card boundaries to prevent overscroll
 *
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function addSwipeGestures(cardInstance) {
  // Clean up any existing listeners to prevent duplicates on rebuild
  if (cardInstance._touchStartHandler) {
    cardInstance.cardContainer.removeEventListener('touchstart', cardInstance._touchStartHandler);
    cardInstance.cardContainer.removeEventListener('touchmove', cardInstance._touchMoveHandler);
    cardInstance.cardContainer.removeEventListener('touchend', cardInstance._touchEndHandler);
    cardInstance.cardContainer.removeEventListener('touchcancel', cardInstance._touchEndHandler);
    cardInstance.cardContainer.removeEventListener('mousedown', cardInstance._mouseDownHandler);
    window.removeEventListener('mousemove', cardInstance._mouseMoveHandler);
    window.removeEventListener('mouseup', cardInstance._mouseUpHandler);
  }

  // Gesture state variables
  let startX = 0; // Initial touch/click X position
  let startY = 0; // Initial touch/click Y position
  let currentX = 0; // Current drag X position
  let isDragging = false; // True when actively dragging slides
  let isScrolling = false; // True when user intends to scroll vertically
  let initialTransform = 0; // Starting slider transform value
  let isInteractiveElement = false; // True if gesture started on input/button
  let swipeIntentionConfirmed = false; // True when horizontal intent confirmed

  /**
   * Enhanced interactive element detection
   * Checks element hierarchy to identify inputs, buttons, and other interactive components
   * NOTE: Does NOT block scrollable elements - scroll vs swipe is determined dynamically
   *
   * @param {Element} element - Element to check
   * @returns {boolean} True if element is interactive
   */
  cardInstance._isInteractiveOrScrollable = (element) => {
    if (
      !element ||
      element === cardInstance.cardContainer ||
      element === cardInstance.sliderElement
    )
      return false;

    let current = element;
    let depth = 0;

    // Walk up the DOM tree to check for interactive elements
    while (current && depth < 15) {
      try {
        if (current.nodeType === Node.ELEMENT_NODE) {
          const tagName = current.localName?.toLowerCase();
          const role = current.getAttribute && current.getAttribute('role');

          // Check for interactive HTML tags
          const interactiveTags = [
            'input',
            'textarea',
            'select',
            'button',
            'a',
            'ha-switch',
            'ha-checkbox',
            'mwc-checkbox',
            'paper-checkbox',
            'ha-textfield',
            'ha-slider',
            'paper-slider',
            'ha-icon-button',
            'mwc-button',
            'paper-button'
          ];

          if (interactiveTags.includes(tagName)) {
            return true;
          }

          // Check ARIA roles for interactive elements
          if (
            role &&
            [
              'button',
              'checkbox',
              'switch',
              'slider',
              'link',
              'menuitem',
              'textbox',
              'input',
              'combobox',
              'searchbox'
            ].includes(role)
          ) {
            return true;
          }

          // Check for Material Design Component classes
          if (current.classList) {
            const mdcClasses = [
              'mdc-text-field',
              'mdc-text-field__input',
              'mdc-text-field__ripple',
              'mdc-line-ripple',
              'mdc-floating-label',
              'mdc-text-field__affix'
            ];
            for (const className of mdcClasses) {
              if (current.classList.contains(className)) {
                return true;
              }
            }
          }
        }
      } catch (e) {
        break; // Exit on any DOM traversal errors
      }

      // Move up the DOM tree (handle shadow DOM and slots)
      current =
        current.assignedSlot ||
        current.parentNode ||
        (current.getRootNode && current.getRootNode().host);
      depth++;
    }

    return false;
  };

  /**
   * Handle gesture start (touchstart/mousedown)
   * Determines if this gesture should be processed and initializes tracking
   */
  cardInstance._handleSwipeStart = (e) => {
    // Ignore non-primary mouse buttons or if already dragging
    if (isDragging || (e.type === 'mousedown' && e.button !== 0)) return;

    // CRITICAL: Check for interactive elements first - if found, skip ALL swipe processing
    isInteractiveElement = cardInstance._isInteractiveOrScrollable(e.target);
    if (isInteractiveElement) {
      return; // Exit immediately for inputs, buttons, etc.
    }

    // Initialize gesture state (but don't start dragging yet)
    isDragging = false;
    isScrolling = false;
    swipeIntentionConfirmed = false;

    // Record starting position
    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }
    currentX = startX;

    // Capture initial slider position for relative dragging
    if (cardInstance.sliderElement) {
      const style = window.getComputedStyle(cardInstance.sliderElement);
      const matrix = new DOMMatrixReadOnly(style.transform);
      initialTransform = matrix.m41; // X translation value
    }

    // For mouse events, add window listeners to track movement outside element
    if (e.type === 'mousedown') {
      window.addEventListener('mousemove', cardInstance._mouseMoveHandler);
      window.addEventListener('mouseup', cardInstance._mouseUpHandler);
    }
  };

  /**
   * Handle gesture movement (touchmove/mousemove)
   * Determines scroll vs swipe intention and handles drag calculations
   */
  cardInstance._handleSwipeMove = (e) => {
    // Skip if gesture started on interactive element
    if (isInteractiveElement) return;

    let clientX, clientY;
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const moveX = clientX - startX;
    const moveY = clientY - startY;

    // INTENTION DETECTION: Determine if user wants to scroll or swipe
    if (!isScrolling && !swipeIntentionConfirmed) {
      // Vertical movement dominates = user wants to scroll
      if (Math.abs(moveY) > Math.abs(moveX) && Math.abs(moveY) > 15) {
        isScrolling = true;
        return; // Let browser handle scrolling
      }
      // Horizontal movement dominates = user wants to swipe
      else if (Math.abs(moveX) > 15) {
        swipeIntentionConfirmed = true;
        isDragging = true;

        // NOW we commit to swipe mode - disable transitions and set cursor
        if (cardInstance.sliderElement) {
          cardInstance.sliderElement.style.transition = 'none';
          cardInstance.sliderElement.style.cursor = 'grabbing';
        }

        // Prevent default scrolling behavior
        if (e.cancelable) {
          e.preventDefault();
        }
      } else {
        // Movement too small - keep monitoring
        return;
      }
    }

    // Skip processing if user is scrolling
    if (isScrolling || !swipeIntentionConfirmed) return;

    // Prevent browser default behaviors for confirmed swipes
    if (e.cancelable) {
      e.preventDefault();
    }

    currentX = clientX;

    // DRAG CALCULATION with boundary resistance
    let totalDragOffset = currentX - startX;

    // Apply resistance at edges to prevent overscroll
    const atLeftEdge = cardInstance.currentIndex === 0;
    const atRightEdge = cardInstance.currentIndex === cardInstance.cards.length - 1;

    if ((atLeftEdge && totalDragOffset > 0) || (atRightEdge && totalDragOffset < 0)) {
      const overDrag = Math.abs(totalDragOffset);
      // Exponential resistance curve - more resistance as user drags further
      const resistanceFactor = 0.3 + 0.7 / (1 + overDrag / (cardInstance.slideWidth * 0.5));
      totalDragOffset *= resistanceFactor * 0.5;
    }

    // Apply transform using requestAnimationFrame for smooth performance
    const newTransform = initialTransform + totalDragOffset;
    if (cardInstance.sliderElement) {
      requestAnimationFrame(() => {
        cardInstance.sliderElement.style.transform = `translateX(${newTransform}px)`;
      });
    }
  };

  /**
   * Handle gesture end (touchend/mouseup/touchcancel)
   * Determines if drag was significant enough to change slides and animates to final position
   */
  cardInstance._handleSwipeEnd = (e) => {
    // Clean up window event listeners for mouse events
    if (e.type === 'mouseup' || e.type === 'mouseleave') {
      window.removeEventListener('mousemove', cardInstance._mouseMoveHandler);
      window.removeEventListener('mouseup', cardInstance._mouseUpHandler);
    }

    // Skip if gesture started on interactive element
    if (isInteractiveElement) {
      isInteractiveElement = false;
      return;
    }

    const wasDragging = isDragging;

    // Reset all gesture state
    isDragging = false;
    isScrolling = false;
    swipeIntentionConfirmed = false;
    isInteractiveElement = false;

    // Restore normal slider behavior
    if (cardInstance.sliderElement) {
      const transitionSpeed = cardInstance._transitionSpeed || '0.3s';
      const transitionEasing = cardInstance._transitionEasing || 'ease-out';
      cardInstance.sliderElement.style.transition = `transform ${transitionSpeed} ${transitionEasing}`;
      cardInstance.sliderElement.style.cursor = '';
    }

    // Only process slide change if we were actually dragging and it wasn't cancelled
    if (!wasDragging || e.type === 'touchcancel') {
      cardInstance.updateSlider(); // Snap back to current position
      return;
    }

    // SLIDE CHANGE LOGIC: Check if drag distance exceeds threshold
    const totalMoveX = currentX - startX;
    const threshold = cardInstance.slideWidth * 0.2; // 20% of slide width

    if (Math.abs(totalMoveX) > threshold) {
      // Drag right and not at first slide = go to previous slide
      if (totalMoveX > 0 && cardInstance.currentIndex > 0) {
        cardInstance.currentIndex--;
      }
      // Drag left and not at last slide = go to next slide
      else if (totalMoveX < 0 && cardInstance.currentIndex < cardInstance.cards.length - 1) {
        cardInstance.currentIndex++;
      }
    }

    // Animate to final position
    cardInstance.updateSlider(true);
  };

  // Store bound handlers for cleanup
  cardInstance._touchStartHandler = cardInstance._handleSwipeStart.bind(cardInstance);
  cardInstance._touchMoveHandler = cardInstance._handleSwipeMove.bind(cardInstance);
  cardInstance._touchEndHandler = cardInstance._handleSwipeEnd.bind(cardInstance);
  cardInstance._mouseDownHandler = cardInstance._handleSwipeStart.bind(cardInstance);
  cardInstance._mouseMoveHandler = cardInstance._handleSwipeMove.bind(cardInstance);
  cardInstance._mouseUpHandler = cardInstance._handleSwipeEnd.bind(cardInstance);

  // Attach event listeners
  cardInstance.cardContainer.addEventListener('touchstart', cardInstance._touchStartHandler, {
    passive: true
  });
  cardInstance.cardContainer.addEventListener('touchmove', cardInstance._touchMoveHandler, {
    passive: false
  });
  cardInstance.cardContainer.addEventListener('touchend', cardInstance._touchEndHandler, {
    passive: true
  });
  cardInstance.cardContainer.addEventListener('touchcancel', cardInstance._touchEndHandler, {
    passive: true
  });
  cardInstance.cardContainer.addEventListener('mousedown', cardInstance._mouseDownHandler);
}

/**
 * Setup search functionality for a card
 * @param {HTMLElement} cardElement - The card element
 * @param {string} entityId - Entity ID for the todo list
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function setupSearchForCard(cardElement, entityId, cardInstance) {
  // Wait for the card to be fully rendered
  setTimeout(() => {
    enhanceSearchInputField(cardElement, entityId, cardInstance);
  }, 100);
}

/**
 * Enhance input field with search functionality
 * @param {HTMLElement} cardElement - Card element
 * @param {string} entityId - Entity ID
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function enhanceSearchInputField(cardElement, entityId, cardInstance) {
  // Find the input element
  let inputElement;
  if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
    inputElement = cardElement.querySelector('.native-todo-card .add-textfield input');
  } else {
    inputElement = cardElement.querySelector('.add-textfield input');
  }

  if (!inputElement) return;

  // Remove existing search handlers if any
  if (cardInstance._searchInputHandlers.has(entityId)) {
    const oldHandlers = cardInstance._searchInputHandlers.get(entityId);
    if (oldHandlers.inputHandler) {
      inputElement.removeEventListener('input', oldHandlers.inputHandler);
    }
  }

  // Create search input handler only
  const inputHandler = (e) => handleSearchInput(e, entityId, cardElement, cardInstance);

  // Add event listener
  inputElement.addEventListener('input', inputHandler);

  // Store handler for cleanup
  cardInstance._searchInputHandlers.set(entityId, {
    inputHandler,
    inputElement
  });

  debugLog(`Search functionality setup for entity: ${entityId}`);
}

/**
 * Handle search input changes
 * @param {Event} e - Input event
 * @param {string} entityId - Entity ID
 * @param {HTMLElement} cardElement - Card element
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function handleSearchInput(e, entityId, cardElement, cardInstance) {
  const searchText = e.target.value;
  cardInstance._currentSearchText = searchText;

  // Save search state for this entity
  if (searchText.trim() === '') {
    cardInstance._searchStates.delete(entityId);
  } else {
    cardInstance._searchStates.set(entityId, searchText);
  }

  // Update the card with filtered items
  cardInstance.cardBuilder.updateNativeTodoCard(cardElement, entityId);

  debugLog(`Search input changed for ${entityId}: "${searchText}"`);
}

/**
 * Handle keydown events in search field
 * @param {Event} e - Keydown event
 * @param {string} entityId - Entity ID
 * @param {HTMLElement} cardElement - Card element
 * @param {HTMLElement} inputElement - Input element
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function handleSearchKeydown(e, entityId, cardElement, inputElement, cardInstance) {
  debugLog(`Key pressed: ${e.key} for entity: ${entityId}`);

  if (e.key === 'Enter') {
    debugLog(`Enter key detected for ${entityId}`);
    e.preventDefault();
    e.stopPropagation();

    const searchText = inputElement.value.trim();
    debugLog(`Search text to process: "${searchText}"`);

    if (searchText) {
      // CLEAR SEARCH STATE FIRST - before doing anything else
      debugLog(`Clearing search state for ${entityId} BEFORE adding item`);
      cardInstance._searchStates.delete(entityId);
      cardInstance._currentSearchText = '';
      inputElement.value = '';

      debugLog(
        `Search state cleared. Remaining states:`,
        Array.from(cardInstance._searchStates.keys())
      );

      // Check if the search text matches any existing items
      const entityState = cardInstance._hass?.states?.[entityId];
      const items = entityState?.attributes?.items || [];
      const exactMatch = items.some(
        (item) => item.summary.toLowerCase() === searchText.toLowerCase()
      );

      if (!exactMatch) {
        debugLog(`No exact match found, adding item: "${searchText}"`);
        // Add new item since no exact match found
        cardInstance._addTodoItem(entityId, searchText);
      } else {
        debugLog(`Exact match found, not adding item: "${searchText}"`);
      }
    }
  } else if (e.key === 'Escape') {
    debugLog(`Escape key detected for ${entityId}`);
    // Clear search on Escape
    inputElement.value = '';
    cardInstance._currentSearchText = '';
    cardInstance._searchStates.delete(entityId);
    cardInstance.cardBuilder.updateNativeTodoCard(cardElement, entityId);
  }
}

/**
 * Check if item matches search criteria
 * @param {Object} item - Todo item
 * @param {string} searchText - Search text
 * @returns {boolean} True if matches
 */
function matchesSearch(item, searchText) {
  if (!searchText) return true;

  try {
    const regex = new RegExp(searchText, 'i');
    return regex.test(item.summary) || (item.description && regex.test(item.description));
  } catch (e) {
    // Fallback to simple includes
    const lowerSearch = searchText.toLowerCase();
    return (
      item.summary.toLowerCase().includes(lowerSearch) ||
      (item.description && item.description.toLowerCase().includes(lowerSearch))
    );
  }
}

/**
 * Clean up search event handlers
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function cleanupSearchHandlers(cardInstance) {
  if (cardInstance._searchInputHandlers) {
    cardInstance._searchInputHandlers.forEach((handlers) => {
      if (handlers.inputElement) {
        if (handlers.inputHandler) {
          handlers.inputElement.removeEventListener('input', handlers.inputHandler);
        }
        if (handlers.keydownHandler) {
          handlers.inputElement.removeEventListener('keydown', handlers.keydownHandler);
        }
      }
    });
    cardInstance._searchInputHandlers.clear();
  }

  if (cardInstance._searchStates) {
    cardInstance._searchStates.clear();
  }

  cardInstance._currentSearchText = '';
}

/**
 * Create pagination element
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function createPagination(cardInstance) {
  cardInstance.paginationElement = document.createElement('div');
  cardInstance.paginationElement.className = 'pagination';

  for (let i = 0; i < cardInstance.cards.length; i++) {
    const dot = document.createElement('div');
    dot.className = 'pagination-dot';
    if (i === cardInstance.currentIndex) dot.classList.add('active');

    // Add click handler to dots
    dot.addEventListener('click', () => {
      cardInstance.goToSlide(i);
    });

    cardInstance.paginationElement.appendChild(dot);
  }

  cardInstance.cardContainer.appendChild(cardInstance.paginationElement);

  // Apply pagination styles
  applyPaginationStyles(cardInstance);
}

/**
 * Apply pagination-specific styles from card_mod
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function applyPaginationStyles(cardInstance) {
  if (!cardInstance.paginationElement) return;

  // Extract pagination styling from card_mod
  let paginationStyles = '';

  // Handle string-based card_mod style
  if (
    cardInstance._config.card_mod &&
    cardInstance._config.card_mod.style &&
    typeof cardInstance._config.card_mod.style === 'string'
  ) {
    // Look for our pagination variables in the style string
    const styleString = cardInstance._config.card_mod.style;
    const variablesToExtract = [
      '--todo-swipe-card-pagination-dot-inactive-color',
      '--todo-swipe-card-pagination-dot-active-color',
      '--todo-swipe-card-pagination-dot-size',
      '--todo-swipe-card-pagination-dot-border-radius',
      '--todo-swipe-card-pagination-dot-spacing',
      '--todo-swipe-card-pagination-bottom',
      '--todo-swipe-card-pagination-right',
      '--todo-swipe-card-pagination-background',
      '--todo-swipe-card-pagination-dot-active-size-multiplier',
      '--todo-swipe-card-pagination-dot-active-opacity',
      '--todo-swipe-card-pagination-dot-inactive-opacity'
    ];

    // For each variable, try to extract its value from the style string
    variablesToExtract.forEach((varName) => {
      const regex = new RegExp(`${varName}\\s*:\\s*([^;]+)`, 'i');
      const match = styleString.match(regex);
      if (match && match[1]) {
        paginationStyles += `${varName}: ${match[1].trim()};\n`;
      }
    });
  }

  // If we found pagination styles, apply them directly to the pagination element
  if (paginationStyles) {
    cardInstance.paginationElement.style.cssText += paginationStyles;

    // Get all dots for individual styling
    const dots = cardInstance.paginationElement.querySelectorAll('.pagination-dot');

    // Apply special handling for individual dot properties
    requestAnimationFrame(() => {
      dots.forEach((dot) => {
        // Apply base styles
        dot.style.borderRadius = `var(--todo-swipe-card-pagination-dot-border-radius, 50%)`;
        dot.style.margin = `0 var(--todo-swipe-card-pagination-dot-spacing, 4px)`;

        // Apply size based on active state
        if (dot.classList.contains('active')) {
          dot.style.width = `calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))`;
          dot.style.height = `calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))`;
        } else {
          dot.style.width = `var(--todo-swipe-card-pagination-dot-size, 8px)`;
          dot.style.height = `var(--todo-swipe-card-pagination-dot-size, 8px)`;
        }
      });
    });
  }
}

/**
 * Update pagination dots to reflect current slide
 * @param {Object} cardInstance - TodoSwipeCard instance
 */
function updatePaginationDots(cardInstance) {
  if (cardInstance.paginationElement) {
    const dots = cardInstance.paginationElement.querySelectorAll('.pagination-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === cardInstance.currentIndex);
    });

    // Apply pagination styles
    applyPaginationStyles(cardInstance);
  }
}

/**
 * Subscribe to todo items using the exact HA core method
 * @param {string} entityId - Entity ID for the todo list
 * @param {Object} hass - Home Assistant object
 * @returns {Promise<Function>} Unsubscribe function
 */
async function subscribeToTodoItems(entityId, hass) {
  if (!hass?.connection) {
    debugLog(`No hass connection for ${entityId}`);
    return () => {};
  }

  try {
    debugLog(`Subscribing to todo items for ${entityId} using HA core method`);

    // Use the exact method from HA core
    const unsubscribe = hass.connection.subscribeMessage(
      (update) => {
        debugLog(`Received todo update for ${entityId}:`, update);

        // This will be handled by the card instance
        const event = new CustomEvent('todo-items-updated', {
          detail: { entityId, items: update.items || [] },
          bubbles: true,
          composed: true
        });
        document.dispatchEvent(event);
      },
      {
        type: 'todo/item/subscribe',
        entity_id: entityId
      }
    );

    debugLog(`Successfully subscribed to ${entityId}`);
    return unsubscribe;
  } catch (error) {
    debugLog(`Subscription failed for ${entityId}:`, error);
    return () => {};
  }
}

/**
 * Fetch todo items using the exact HA core method
 * @param {string} entityId - Entity ID for the todo list
 * @param {Object} hass - Home Assistant object
 * @returns {Promise<Array>} Array of todo items
 */
async function fetchTodoItems(entityId, hass) {
  if (!hass) return [];

  try {
    debugLog(`Fetching todo items for ${entityId} using HA core method`);

    // Use the exact method from HA core: hass.callWS
    const result = await hass.callWS({
      type: 'todo/item/list',
      entity_id: entityId
    });

    debugLog(`HA core WS result for ${entityId}:`, result);
    return result.items || [];
  } catch (error) {
    debugLog(`HA core WS call failed for ${entityId}:`, error);
    return [];
  }
}

/**
 * Add a new todo item
 * @param {string} entityId - Entity ID
 * @param {string} summary - Item summary
 * @param {Object} hass - Home Assistant object
 */
function addTodoItem(entityId, summary, hass) {
  if (!hass || !entityId || !summary) return;

  hass.callService('todo', 'add_item', {
    entity_id: entityId,
    item: summary
  });

  debugLog(`Adding todo item "${summary}" to ${entityId}`);
}

/**
 * Toggle todo item completion status
 * @param {string} entityId - Entity ID
 * @param {Object} item - Todo item
 * @param {boolean} completed - New completion status
 * @param {Object} hass - Home Assistant object
 */
function toggleTodoItem(entityId, item, completed, hass) {
  if (!hass || !entityId || !item) return;

  hass.callService('todo', 'update_item', {
    entity_id: entityId,
    item: item.uid,
    status: completed ? 'completed' : 'needs_action'
  });

  debugLog(`Toggling todo item "${item.summary}" to ${completed ? 'completed' : 'needs_action'}`);
}

/**
 * Update todo item from dialog
 * @param {string} entityId - Entity ID
 * @param {Object} item - Original todo item
 * @param {Object} data - Updated data
 * @param {Object} hass - Home Assistant object
 */
async function updateTodoItemFromDialog(entityId, item, data, hass) {
  if (!hass) return;

  const serviceData = {
    entity_id: entityId,
    item: item.uid,
    rename: data.summary
  };

  // Add status if checkbox was present
  if (data.completed !== undefined) {
    serviceData.status = data.completed ? 'completed' : 'needs_action';
  }

  // Add description if supported
  if (data.description !== undefined) {
    serviceData.description = data.description || null;
  }

  // Add due date/datetime if supported
  if (data.dueDate !== undefined) {
    if (data.dueDate && data.dueDate.trim() !== '') {
      // Check if it's a datetime (contains T) or just a date
      if (data.dueDate.includes('T')) {
        serviceData.due_datetime = data.dueDate;
      } else {
        serviceData.due_date = data.dueDate;
      }
    } else {
      // Clear the appropriate field based on what the original item had
      if (item.due) {
        if (item.due.includes('T')) {
          // Original was datetime, clear datetime field
          serviceData.due_datetime = null;
        } else {
          // Original was date only, clear date field
          serviceData.due_date = null;
        }
      } else {
        // Fallback: if no original due date, clear date field
        serviceData.due_date = null;
      }
    }
  }

  await hass.callService('todo', 'update_item', serviceData);
  debugLog(`Updated todo item "${item.summary}" to "${data.summary}"`);
}

/**
 * Add new todo item from dialog
 * @param {string} entityId - Entity ID
 * @param {Object} data - Item data
 * @param {Object} hass - Home Assistant object
 */
async function addTodoItemFromDialog(entityId, data, hass) {
  if (!hass) return;

  const serviceData = {
    entity_id: entityId,
    item: data.summary
  };

  // Add description if provided
  if (data.description) {
    serviceData.description = data.description;
  }

  // Add due date if provided
  if (data.dueDate !== undefined) {
    serviceData.due_date = data.dueDate || null;
  }

  await hass.callService('todo', 'add_item', serviceData);
  debugLog(`Added todo item "${data.summary}"`);
}

/**
 * Delete todo item from dialog
 * @param {string} entityId - Entity ID
 * @param {Object} item - Todo item to delete
 * @param {Object} hass - Home Assistant object
 */
function deleteTodoItemFromDialog(entityId, item, hass) {
  if (!hass) return;

  hass.callService('todo', 'remove_item', {
    entity_id: entityId,
    item: item.uid
  });

  debugLog(`Deleted todo item "${item.summary}"`);
}

/**
 * Delete completed items from a todo list
 * @param {string} entityId - Entity ID for the todo list
 * @param {Object} hass - Home Assistant object
 */
function deleteCompletedItems(entityId, hass) {
  if (hass) {
    hass.callService('todo', 'remove_completed_items', {
      entity_id: entityId
    });
  }
}

/**
 * Sort todo items based on display order
 * @param {Array} items - Todo items
 * @param {string} sortMode - Sort mode
 * @param {Object} hass - Home Assistant object for locale
 * @returns {Array} Sorted items
 */
function sortTodoItems(items, sortMode, hass) {
  const sortedItems = [...items];

  // Always separate completed and uncompleted items first
  const completedItems = sortedItems.filter((item) => item.status === 'completed');
  const uncompletedItems = sortedItems.filter((item) => item.status !== 'completed');

  // Sort each group based on the sort mode
  let sortedUncompleted = uncompletedItems;
  let sortedCompleted = completedItems;

  if (sortMode && sortMode !== 'none') {
    const sortFunction = getSortFunction(sortMode, hass);
    sortedUncompleted = uncompletedItems.sort(sortFunction);
    sortedCompleted = completedItems.sort(sortFunction);
  }

  // Return uncompleted items first, then completed items
  return [...sortedUncompleted, ...sortedCompleted];
}

/**
 * Get sort function based on sort mode
 * @param {string} sortMode - Sort mode
 * @param {Object} hass - Home Assistant object for locale
 * @returns {Function} Sort function
 */
function getSortFunction(sortMode, hass) {
  switch (sortMode) {
    case 'alpha_asc':
      return (a, b) => a.summary.localeCompare(b.summary, hass?.locale?.language);
    case 'alpha_desc':
      return (a, b) => b.summary.localeCompare(a.summary, hass?.locale?.language);
    case 'duedate_asc':
      return (a, b) => {
        const aDue = parseDueDateForSort(a.due);
        const bDue = parseDueDateForSort(b.due);
        if (!aDue && !bDue) return 0;
        if (!aDue) return 1;
        if (!bDue) return -1;
        return aDue.getTime() - bDue.getTime();
      };
    case 'duedate_desc':
      return (a, b) => {
        const aDue = parseDueDateForSort(a.due);
        const bDue = parseDueDateForSort(b.due);
        if (!aDue && !bDue) return 0;
        if (!aDue) return 1;
        if (!bDue) return -1;
        return bDue.getTime() - aDue.getTime();
      };
    default:
      return () => 0;
  }
}

/**
 * Parse due date string to Date object for sorting
 * @param {string} due - Due date string
 * @returns {Date|null} Parsed date or null
 */
function parseDueDateForSort(due) {
  if (!due) return null;

  try {
    if (due.includes('T')) {
      return new Date(due);
    } else {
      // Date only, set to end of day
      const date = new Date(`${due}T23:59:59`);
      return isNaN(date.getTime()) ? null : date;
    }
  } catch (e) {
    return null;
  }
}

/**
 * Create todo item element with improved click handling for swipe gestures
 * @param {Object} item - Todo item data
 * @param {string} entityId - Entity ID
 * @param {Function} toggleCallback - Callback for toggle action
 * @param {Function} editCallback - Callback for edit action
 * @param {Object} hass - Home Assistant object (needed for ha-relative-time)
 * @returns {HTMLElement} Todo item element
 */
function createTodoItemElement(item, entityId, toggleCallback, editCallback, hass) {
  const itemElement = document.createElement('div');
  itemElement.className = `todo-item ${item.status === 'completed' ? 'completed' : ''}`;

  // Create checkbox
  const checkbox = document.createElement('ha-checkbox');
  checkbox.className = 'todo-checkbox';
  checkbox.checked = item.status === 'completed';

  // Add checkbox change handler
  checkbox.addEventListener('change', (e) => {
    e.stopPropagation(); // Prevent bubbling to item click
    toggleCallback(entityId, item, e.target.checked);
  });

  itemElement.appendChild(checkbox);

  // Create content container
  const content = document.createElement('div');
  content.className = 'todo-content';

  // Create summary
  const summary = document.createElement('div');
  summary.className = 'todo-summary';
  summary.textContent = item.summary;
  content.appendChild(summary);

  // Add description if present
  if (item.description) {
    const description = document.createElement('div');
    description.className = 'todo-description';
    description.textContent = item.description;
    content.appendChild(description);
  }

  // Add due date if present
  if (item.due) {
    const dueElement = createDueDateElement(item.due);
    // Set hass reference for ha-relative-time to work
    const relativeTime = dueElement.querySelector('ha-relative-time');
    if (relativeTime && hass) {
      relativeTime.hass = hass;
    }
    content.appendChild(dueElement);
  }

  itemElement.appendChild(content);

  // Simplified and more reliable click handler
  let startX = 0;
  let startY = 0;
  let startTime = 0;
  let moved = false;

  const handleStart = (e) => {
    // Don't handle clicks on the checkbox
    if (e.target === checkbox || checkbox.contains(e.target)) {
      return;
    }

    moved = false;
    startTime = Date.now();

    if (e.type === 'touchstart') {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    } else {
      startX = e.clientX;
      startY = e.clientY;
    }
  };

  const handleMove = (e) => {
    if (!moved) {
      let currentX, currentY;

      if (e.type === 'touchmove') {
        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;
      } else {
        currentX = e.clientX;
        currentY = e.clientY;
      }

      const deltaX = Math.abs(currentX - startX);
      const deltaY = Math.abs(currentY - startY);

      // More lenient movement threshold
      if (deltaX > 10 || deltaY > 10) {
        moved = true;
      }
    }
  };

  const handleEnd = (e) => {
    // Don't handle clicks on the checkbox
    if (e.target === checkbox || checkbox.contains(e.target)) {
      return;
    }

    const duration = Date.now() - startTime;

    // More lenient conditions for click detection
    if (!moved && duration < 1000) {
      // Small delay to ensure we don't interfere with swipe gestures
      setTimeout(() => {
        editCallback(entityId, item);
      }, 10);
    }
  };

  // Add event listeners
  itemElement.addEventListener('touchstart', handleStart, { passive: true });
  itemElement.addEventListener('touchmove', handleMove, { passive: true });
  itemElement.addEventListener('touchend', handleEnd, { passive: true });
  itemElement.addEventListener('mousedown', handleStart);
  itemElement.addEventListener('mousemove', handleMove);
  itemElement.addEventListener('mouseup', handleEnd);

  // Fallback click handler for better reliability
  itemElement.addEventListener('click', (e) => {
    // Don't handle clicks on the checkbox
    if (e.target === checkbox || checkbox.contains(e.target)) {
      return;
    }

    // Only handle if the other handlers didn't fire recently
    if (!moved && Date.now() - startTime < 100) {
      e.preventDefault();
      e.stopPropagation();
      editCallback(entityId, item);
    }
  });

  return itemElement;
}

/**
 * Check if entity supports a specific feature
 * @param {Object} entityState - Entity state object
 * @param {number} feature - Feature flag
 * @returns {boolean} True if feature is supported
 */
function entitySupportsFeature(entityState, feature) {
  const supportedFeatures = entityState.attributes?.supported_features || 0;
  return (supportedFeatures & feature) !== 0;
}

var TodoOperations = /*#__PURE__*/Object.freeze({
  __proto__: null,
  addTodoItem: addTodoItem,
  addTodoItemFromDialog: addTodoItemFromDialog,
  createTodoItemElement: createTodoItemElement,
  deleteCompletedItems: deleteCompletedItems,
  deleteTodoItemFromDialog: deleteTodoItemFromDialog,
  entitySupportsFeature: entitySupportsFeature,
  fetchTodoItems: fetchTodoItems,
  sortTodoItems: sortTodoItems,
  subscribeToTodoItems: subscribeToTodoItems,
  toggleTodoItem: toggleTodoItem,
  updateTodoItemFromDialog: updateTodoItemFromDialog
});

/**
 * DialogManager handles all dialog-related functionality for TodoSwipeCard
 * Manages todo item edit, add, and delete dialogs
 */
class DialogManager {
  constructor(cardInstance) {
    this.cardInstance = cardInstance;
    this.currentDialog = null; // Track current open dialog
    this.dialogOpenTime = 0; // Prevent rapid dialog creation
  }

  /**
   * Get hass object from card instance
   * @returns {Object} Home Assistant object
   * @private
   */
  get _hass() {
    return this.cardInstance._hass;
  }

  /**
   * Get config object from card instance
   * @returns {Object} Card configuration
   * @private
   */
  get _config() {
    return this.cardInstance._config;
  }

  /**
   * Edit todo item using a custom HA-style dialog
   * @param {string} entityId - Entity ID
   * @param {Object} item - Todo item
   */
  editTodoItem(entityId, item) {
    // Prevent rapid dialog creation (debounce)
    const now = Date.now();
    if (now - this.dialogOpenTime < 300) {
      debugLog('Preventing rapid dialog creation');
      return;
    }
    this.dialogOpenTime = now;

    debugLog(`Edit todo item "${item.summary}" in ${entityId}`);
    this.showTodoItemEditDialog(entityId, item);
  }

  /**
   * Show todo item edit dialog with full HA native features
   * @param {string} entityId - Entity ID
   * @param {Object} item - Todo item (undefined for new items)
   */
  showTodoItemEditDialog(entityId, item = undefined) {
    // Close any existing dialog first
    this.closeCurrentDialog();

    debugLog(`Opening todo edit dialog for ${item ? 'existing' : 'new'} item`);

    // Create dialog with HA's native styling and accessibility
    const dialog = document.createElement('ha-dialog');
    dialog.heading = item ? 'Edit item' : 'Add Todo Item';
    dialog.open = true;
    dialog.style.setProperty('--mdc-dialog-min-width', 'min(600px, 95vw)');
    dialog.style.setProperty('--mdc-dialog-max-width', 'min(600px, 95vw)');

    // Add accessibility attributes
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-labelledby', 'dialog-title');
    dialog.setAttribute('aria-modal', 'true');

    // Track this dialog
    this.currentDialog = dialog;

    // Create content container
    const content = document.createElement('div');
    content.style.cssText = `
      padding: 8px 0;
      display: flex;
      flex-direction: column;
      gap: 16px;
    `;

    // Get entity state and features
    const entityState = this._hass?.states?.[entityId];
    const supportsDescription = entityState && entitySupportsFeature(entityState, 64);
    const supportsDueDate =
      entityState &&
      (entitySupportsFeature(entityState, 16) || entitySupportsFeature(entityState, 32));
    const supportsDelete = entityState && entitySupportsFeature(entityState, 2);

    // Debug the feature support
    debugLog(`Entity features for ${entityId}:`, {
      supportedFeatures: entityState?.attributes?.supported_features,
      supportsDescription: supportsDescription,
      supportsDueDate: supportsDueDate,
      supportsDelete: supportsDelete
    });

    // Create summary/checkbox row
    const summaryRow = document.createElement('div');
    summaryRow.style.cssText = 'display: flex; align-items: flex-start; gap: 8px;';

    // Checkbox for completion status (only for existing items)
    let checkbox = null;
    if (item) {
      checkbox = document.createElement('ha-checkbox');
      checkbox.checked = item.status === 'completed';
      checkbox.style.marginTop = '8px';
      summaryRow.appendChild(checkbox);
    }

    // Summary input with validation
    const summaryField = document.createElement('ha-textfield');
    summaryField.label = 'Task name';
    summaryField.value = item?.summary || '';
    summaryField.required = true;
    summaryField.style.flexGrow = '1';
    summaryField.dialogInitialFocus = true;
    summaryField.validationMessage = 'Task name is required';
    summaryRow.appendChild(summaryField);

    content.appendChild(summaryRow);

    // Description field
    let descriptionField = null;
    {
      descriptionField = document.createElement('ha-textfield');
      descriptionField.label = 'Description';
      descriptionField.value = item?.description || '';
      descriptionField.setAttribute('type', 'textarea');
      descriptionField.setAttribute('rows', '3');
      descriptionField.style.cssText = `
        width: 100%;
        display: block;
        margin-bottom: 16px;
      `;
      content.appendChild(descriptionField);
      debugLog('Description field (ha-textfield textarea) added to dialog');
    }

    // Due date field (if supported)
    let dateField = null;
    let timeField = null;
    if (supportsDueDate) {
      const dueSection = document.createElement('div');

      // Create the "Due date:" label
      const dueLabel = document.createElement('span');
      dueLabel.className = 'label';
      dueLabel.textContent = 'Due date:';
      dueLabel.style.cssText = `
        font-size: var(--ha-font-size-s, 12px);
        font-weight: var(--ha-font-weight-medium, 500);
        color: var(--input-label-ink-color, var(--primary-text-color));
        display: block;
        margin-bottom: 8px;
      `;
      dueSection.appendChild(dueLabel);

      // Create flex container for date and time inputs
      const flexContainer = document.createElement('div');
      flexContainer.className = 'flex';
      flexContainer.style.cssText = `
        display: flex;
        justify-content: space-between;
        gap: 16px;
      `;

      // Parse existing due date
      let dueDate = '';
      let dueTime = '';
      if (item?.due) {
        try {
          const due = new Date(item.due);
          if (!isNaN(due.getTime())) {
            dueDate = due.toISOString().split('T')[0]; // YYYY-MM-DD format
            if (item.due.includes('T')) {
              dueTime = due.toTimeString().split(' ')[0].substring(0, 5); // HH:MM format
            }
          }
        } catch (e) {
          debugLog('Error parsing due date:', e);
        }
      }

      // Create date input
      const dateContainer = document.createElement('div');
      dateContainer.style.cssText = `flex-grow: 1; position: relative;`;

      dateField = document.createElement('input');
      dateField.type = 'date';
      dateField.value = dueDate;
      dateField.style.cssText = `
        width: 100%;
        height: 56px;
        padding: 20px 12px 6px 12px;
        border: none;
        border-bottom: 1px solid var(--divider-color);
        border-radius: 0;
        background: transparent;
        color: var(--primary-text-color);
        font-family: var(--mdc-typography-subtitle1-font-family, inherit);
        font-size: var(--mdc-typography-subtitle1-font-size, 1rem);
        line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);
        box-sizing: border-box;
        outline: none;
        transition: border-bottom-color 0.15s ease;
        cursor: pointer;
        -webkit-appearance: none;
        -moz-appearance: textfield;
      `;

      // Create wrapper
      const dateWrapper = document.createElement('div');
      dateWrapper.style.cssText = `
        position: relative;
        background: var(--mdc-text-field-fill-color, #f5f5f5);
        border-radius: 4px 4px 0 0;
        min-height: 56px;
        display: flex;
        align-items: center;
      `;

      // Create floating label for date field
      const dateLabel = document.createElement('span');
      dateLabel.textContent = 'Due Date';
      dateLabel.style.cssText = `
        position: absolute;
        left: 12px;
        top: 8px;
        font-size: 12px;
        color: var(--secondary-text-color);
        pointer-events: none;
        transition: all 0.2s ease;
      `;

      // Add clear functionality
      const clearButton = document.createElement('button');
      clearButton.type = 'button';
      clearButton.innerHTML = '×';
      clearButton.style.cssText = `
        position: absolute;
        right: 36px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--secondary-text-color);
        font-size: 18px;
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: ${dueDate ? 'flex' : 'none'};
        align-items: center;
        justify-content: center;
        z-index: 2;
      `;

      clearButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dateField.value = '';
        clearButton.style.display = 'none';
        if (timeField) {
          timeField.value = '';
        }
      });

      // Show/hide clear button based on input value
      dateField.addEventListener('input', () => {
        clearButton.style.display = dateField.value ? 'flex' : 'none';
      });

      dateWrapper.appendChild(dateLabel);
      dateWrapper.appendChild(dateField);
      dateWrapper.appendChild(clearButton);
      dateContainer.appendChild(dateWrapper);
      flexContainer.appendChild(dateContainer);

      // Create time input if datetime is supported
      if (entitySupportsFeature(entityState, 32)) {
        const timeContainer = document.createElement('div');
        timeContainer.style.cssText = `position: relative; min-width: 120px;`;

        const timeWrapper = document.createElement('div');
        timeWrapper.style.cssText = `
          position: relative;
          background: var(--mdc-text-field-fill-color, #f5f5f5);
          border-radius: 4px 4px 0 0;
          min-height: 56px;
          display: flex;
          align-items: center;
        `;

        timeField = document.createElement('input');
        timeField.type = 'time';
        timeField.value = dueTime;
        timeField.style.cssText = `
          width: 100%;
          height: 56px;
          padding: 20px 12px 6px 12px;
          border: none;
          border-bottom: 1px solid var(--divider-color);
          border-radius: 0;
          background: transparent;
          color: var(--primary-text-color);
          font-family: var(--mdc-typography-subtitle1-font-family, inherit);
          font-size: var(--mdc-typography-subtitle1-font-size, 1rem);
          line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);
          box-sizing: border-box;
          outline: none;
          transition: border-bottom-color 0.15s ease;
          -webkit-appearance: none;
          -moz-appearance: textfield;
        `;

        // Create floating label for time field
        const timeLabel = document.createElement('span');
        timeLabel.textContent = 'Time';
        timeLabel.style.cssText = `
          position: absolute;
          left: 12px;
          top: 8px;
          font-size: 12px;
          color: var(--secondary-text-color);
          pointer-events: none;
          transition: all 0.2s ease;
        `;

        timeWrapper.appendChild(timeLabel);
        timeWrapper.appendChild(timeField);
        timeContainer.appendChild(timeWrapper);
        flexContainer.appendChild(timeContainer);
      }

      dueSection.appendChild(flexContainer);
      content.appendChild(dueSection);

      debugLog('Custom due date section added with native HA textfield styling');
    }

    // Add focus trap for better accessibility
    const setupFocusTrap = () => {
      const focusableElements = dialog.querySelectorAll(
        'ha-textfield, ha-checkbox, input, button, mwc-button'
      );
      if (focusableElements.length === 0) return;

      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      dialog.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey && document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          } else if (!e.shiftKey && document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      });
    };

    // Set up focus trap after dialog is added to DOM
    setTimeout(setupFocusTrap, 100);

    dialog.appendChild(content);

    // Delete button (if item exists and supports delete)
    if (item && supportsDelete) {
      const deleteButton = document.createElement('mwc-button');
      deleteButton.slot = 'secondaryAction';
      deleteButton.textContent = 'Delete item';
      deleteButton.style.setProperty('--mdc-theme-primary', 'var(--error-color)');
      deleteButton.style.setProperty('--mdc-button-ink-color', 'var(--error-color)');
      deleteButton.style.color = 'var(--error-color)';

      deleteButton.addEventListener('click', async () => {
        const confirmed = await this.showDeleteConfirmationDialog(item.summary);
        if (confirmed) {
          deleteTodoItemFromDialog(entityId, item, this._hass);
          this.closeDialog(dialog);
        }
      });

      dialog.appendChild(deleteButton);
    }

    // Cancel button
    const cancelButton = document.createElement('mwc-button');
    cancelButton.slot = 'primaryAction';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      this.closeDialog(dialog);
    });
    dialog.appendChild(cancelButton);

    // Save button
    const saveText = item ? 'Save item' : 'Add';
    const saveButton = document.createElement('mwc-button');
    saveButton.slot = 'primaryAction';
    saveButton.textContent = saveText;
    saveButton.addEventListener('click', async () => {
      const summary = summaryField.value.trim();
      if (!summary) {
        summaryField.reportValidity();
        return;
      }

      // Handle due date/time properly
      let dueValue = '';
      if (dateField?.value) {
        if (timeField?.value) {
          // Create a proper Date object and convert to ISO string
          const dateTimeString = `${dateField.value}T${timeField.value}:00`;
          try {
            const dateObj = new Date(dateTimeString);
            dueValue = dateObj.toISOString();
          } catch (e) {
            console.error('Invalid date/time combination');
            dueValue = dateField.value; // fallback to date only
          }
        } else {
          // Date only
          dueValue = dateField.value;
        }
      }

      const success = await this.handleDialogSave(entityId, item, {
        summary: summary,
        description: descriptionField?.value,
        completed: checkbox?.checked || false,
        dueDate: dueValue
      });

      if (success) {
        this.closeDialog(dialog);
      }
    });
    dialog.appendChild(saveButton);

    // Keyboard handlers
    summaryField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const summary = summaryField.value.trim();
        if (summary) {
          // Handle due date/time properly
          let dueValue = '';
          if (dateField?.value) {
            if (timeField?.value) {
              // Create a proper Date object and convert to ISO string
              const dateTimeString = `${dateField.value}T${timeField.value}:00`;
              try {
                const dateObj = new Date(dateTimeString);
                dueValue = dateObj.toISOString();
              } catch (e) {
                console.error('Invalid date/time combination');
                dueValue = dateField.value; // fallback to date only
              }
            } else {
              // Date only
              dueValue = dateField.value;
            }
          }

          this.handleDialogSave(entityId, item, {
            summary: summary,
            description: descriptionField?.value,
            completed: checkbox?.checked || false,
            dueDate: dueValue
          }).then((success) => {
            if (success) this.closeDialog(dialog);
          });
        }
      }
    });

    // Handle dialog close
    dialog.addEventListener('closed', () => {
      this.onDialogClosed(dialog);
    });

    // Add to document and focus
    document.body.appendChild(dialog);

    // Focus after dialog is rendered
    setTimeout(() => {
      summaryField.focus();
    }, 100);
  }

  /**
   * Close a specific dialog
   * @param {HTMLElement} dialog - Dialog to close
   */
  closeDialog(dialog) {
    if (dialog && dialog.open) {
      dialog.open = false;
      dialog.close();
    }
  }

  /**
   * Close the current dialog
   */
  closeCurrentDialog() {
    if (this.currentDialog) {
      this.closeDialog(this.currentDialog);
      this.currentDialog = null;
    }
  }

  /**
   * Handle when a dialog is closed
   * @param {HTMLElement} dialog - Closed dialog
   */
  onDialogClosed(dialog) {
    // Clean up the dialog from DOM
    if (dialog.parentNode) {
      dialog.parentNode.removeChild(dialog);
    }

    // Clear current dialog reference if this was the current one
    if (this.currentDialog === dialog) {
      this.currentDialog = null;
    }
  }

  /**
   * Handle saving from the dialog with error handling
   * @param {string} entityId - Entity ID
   * @param {Object} item - Original item (null for new items)
   * @param {Object} data - Form data
   * @returns {Promise<boolean>} Success status
   */
  async handleDialogSave(entityId, item, data) {
    if (!data.summary) {
      return false;
    }

    try {
      if (item) {
        await updateTodoItemFromDialog(entityId, item, data, this._hass);
      } else {
        await addTodoItemFromDialog(entityId, data, this._hass);
      }
      return true;
    } catch (error) {
      debugLog('Error saving todo item:', error);
      return false;
    }
  }

  /**
   * Show delete confirmation dialog
   * @param {string} itemSummary - Item summary for confirmation
   * @returns {Promise<boolean>} True if confirmed
   */
  async showDeleteConfirmationDialog(itemSummary) {
    return new Promise((resolve) => {
      const confirmDialog = document.createElement('ha-dialog');
      confirmDialog.heading = 'Confirm Deletion';
      confirmDialog.open = true;

      const content = document.createElement('div');
      content.style.padding = '16px';
      content.textContent = `Are you sure you want to delete "${itemSummary}"?`;
      confirmDialog.appendChild(content);

      const confirmButton = document.createElement('mwc-button');
      confirmButton.slot = 'primaryAction';
      confirmButton.textContent = 'Delete';
      confirmButton.style.color = 'var(--error-color)';
      confirmButton.addEventListener('click', () => {
        confirmDialog.close();
        resolve(true);
      });

      const cancelButton = document.createElement('mwc-button');
      cancelButton.slot = 'secondaryAction';
      cancelButton.textContent = 'Cancel';
      cancelButton.addEventListener('click', () => {
        confirmDialog.close();
        resolve(false);
      });

      confirmDialog.appendChild(confirmButton);
      confirmDialog.appendChild(cancelButton);

      confirmDialog.addEventListener('closed', () => {
        if (confirmDialog.parentNode) {
          confirmDialog.parentNode.removeChild(confirmDialog);
        }
        resolve(false);
      });

      document.body.appendChild(confirmDialog);
    });
  }

  /**
   * Show delete confirmation dialog for delete completed items
   * @param {string} entityId - Entity ID for the todo list
   */
  showDeleteCompletedConfirmation(entityId) {
    // Create confirmation dialog
    const dialog = document.createElement('ha-dialog');
    dialog.heading = 'Confirm Deletion';
    dialog.open = true;

    // Create content container
    const content = document.createElement('div');
    content.innerText = 'Are you sure you want to delete all completed items from the list?';
    dialog.appendChild(content);

    // Create confirm button
    const confirmButton = document.createElement('mwc-button');
    confirmButton.slot = 'primaryAction';
    confirmButton.label = 'Confirm';
    confirmButton.style.color = 'var(--primary-color)';
    confirmButton.setAttribute('aria-label', 'Confirm');

    // Add confirm button click handler
    confirmButton.addEventListener('click', () => {
      this.closeDialog(dialog);
      // Import deleteCompletedItems here to avoid circular dependency
      Promise.resolve().then(function () { return TodoOperations; }).then((module) => {
        module.deleteCompletedItems(entityId, this._hass);
      });
    });

    // Create cancel button
    const cancelButton = document.createElement('mwc-button');
    cancelButton.slot = 'secondaryAction';
    cancelButton.label = 'Cancel';
    cancelButton.setAttribute('aria-label', 'Cancel');

    // Add cancel button click handler
    cancelButton.addEventListener('click', () => {
      this.closeDialog(dialog);
    });

    // Append buttons to dialog
    dialog.appendChild(confirmButton);
    dialog.appendChild(cancelButton);

    // Handle dialog close
    dialog.addEventListener('closed', () => {
      if (dialog.parentNode) {
        dialog.parentNode.removeChild(dialog);
      }
    });

    // Add dialog to document
    document.body.appendChild(dialog);
  }
}

/**
 * CardBuilder handles all card building and rendering functionality for TodoSwipeCard
 * Manages card creation, updates, and rendering logic
 */
class CardBuilder {
  constructor(cardInstance) {
    this.cardInstance = cardInstance;
  }

  /**
   * Get hass object from card instance
   * @returns {Object} Home Assistant object
   * @private
   */
  get _hass() {
    return this.cardInstance._hass;
  }

  /**
   * Get config object from card instance
   * @returns {Object} Card configuration
   * @private
   */
  get _config() {
    return this.cardInstance._config;
  }

  /**
   * Get entity ID from entity configuration (handles both string and object formats)
   * @param {string|Object} entity - Entity configuration
   * @returns {string} Entity ID
   * @private
   */
  _getEntityId(entity) {
    if (typeof entity === 'string') {
      return entity;
    }
    return entity?.entity || '';
  }

  /**
   * Get entity configuration by ID
   * @param {string} entityId - Entity ID to find
   * @returns {Object|null} Entity configuration object or null if not found
   * @private
   */
  _getEntityConfig(entityId) {
    if (!this._config?.entities) return null;

    const entity = this._config.entities.find((entity) => this._getEntityId(entity) === entityId);

    if (typeof entity === 'string') {
      return { entity: entityId };
    }

    return entity || null;
  }

  /**
   * Create native todo cards from entities
   */
  async createNativeTodoCards() {
    // Ensure sliderElement exists before proceeding
    if (!this.cardInstance.sliderElement) {
      debugLog('sliderElement is null at start of createNativeTodoCards');
      return;
    }

    // Check for build cancellation
    if (this.cardInstance._buildCanceled) {
      debugLog('Card creation canceled before starting');
      return;
    }

    // Store reference to slider element to check for changes
    const initialSlider = this.cardInstance.sliderElement;

    // Process entities sequentially for better performance
    for (let i = 0; i < this._config.entities.length; i++) {
      // Check for cancellation at each iteration
      if (this.cardInstance._buildCanceled) {
        debugLog('Card creation canceled during processing');
        return;
      }

      const entityConfig = this._config.entities[i];
      const entityId = this._getEntityId(entityConfig);

      if (!entityId || entityId.trim() === '') {
        continue;
      }

      // Check if slider element is still the same (hasn't been rebuilt)
      if (this.cardInstance.sliderElement !== initialSlider) {
        debugLog('sliderElement changed during card creation - build was interrupted');
        return;
      }

      // Check if slider element still exists
      if (!this.cardInstance.sliderElement) {
        debugLog('sliderElement became null during card creation');
        return;
      }

      const slideDiv = document.createElement('div');
      slideDiv.className = 'slide';

      try {
        // Create native todo card element
        const cardElement = await this.createNativeTodoCard(entityConfig);

        // Check for cancellation after async operation
        if (this.cardInstance._buildCanceled) {
          debugLog('Card creation canceled after creating card element');
          return;
        }

        // Store reference to the card
        this.cardInstance.cards[i] = {
          element: cardElement,
          slide: slideDiv,
          entityId: entityId,
          entityConfig: entityConfig
        };

        // Add card to slide
        slideDiv.appendChild(cardElement);

        // Add custom delete button if configured
        if (this._config.show_completed && this._config.show_completed_menu) {
          const deleteButton = this.cardInstance._createDeleteButton(entityId, entityConfig);
          slideDiv.appendChild(deleteButton);
        }

        // Add icon if configured
        if (this._config.show_icons) {
          const iconElement = createIconElement(entityConfig, entityId, this._hass);
          slideDiv.appendChild(iconElement);
        }

        // Final check before appending - ensure slider still exists and is the same
        if (
          this.cardInstance.sliderElement &&
          this.cardInstance.sliderElement === initialSlider &&
          !this.cardInstance._buildCanceled
        ) {
          this.cardInstance.sliderElement.appendChild(slideDiv);
          debugLog(`Created native todo card for entity: ${entityId}`);
        } else {
          debugLog('sliderElement changed, became null, or build canceled before appending slide');
          return;
        }
      } catch (e) {
        if (!this.cardInstance._buildCanceled) {
          console.error(`Error creating native todo card ${i}:`, entityId, e);
          const errorDiv = document.createElement('div');
          errorDiv.style.cssText =
            'color: red; background: white; padding: 16px; border: 1px solid red; height: 100%; box-sizing: border-box;';
          errorDiv.textContent = `Error creating card: ${e.message || e}. Check console for details.`;
          slideDiv.appendChild(errorDiv);

          // Check if sliderElement exists before appending error
          if (
            this.cardInstance.sliderElement &&
            this.cardInstance.sliderElement === initialSlider
          ) {
            this.cardInstance.sliderElement.appendChild(slideDiv);
          }
          this.cardInstance.cards[i] = { error: true, slide: slideDiv };
        }
      }
    }

    // Filter out any potential gaps if errors occurred
    this.cardInstance.cards = this.cardInstance.cards.filter(Boolean);
    debugLog(`Card creation completed. Created ${this.cardInstance.cards.length} cards`);
  }

  /**
   * Create native todo card
   * @param {Object} entityConfig - Entity configuration
   * @returns {Promise<HTMLElement>} Card element
   */
  async createNativeTodoCard(entityConfig) {
    const entityId = this._getEntityId(entityConfig);
    debugLog('Creating native todo card for entity:', entityId);

    // Initialize cache if needed
    if (!this.cardInstance._todoItemsCache) {
      this.cardInstance._todoItemsCache = new Map();
    }
    if (!this.cardInstance._todoSubscriptions) {
      this.cardInstance._todoSubscriptions = new Map();
    }

    // Create the main card element
    const cardElement = document.createElement('div');
    cardElement.className = 'native-todo-card';

    // Apply background image if configured
    if (typeof entityConfig === 'object' && entityConfig.background_image) {
      cardElement.style.backgroundImage = `url('${entityConfig.background_image}')`;
      cardElement.style.backgroundPosition = 'center center';
      cardElement.style.backgroundRepeat = 'no-repeat';
      cardElement.style.backgroundSize = 'cover';
    }

    let finalElement = cardElement;

    // Handle title wrapper
    const showTitle = (typeof entityConfig === 'object' && entityConfig.show_title) || false;
    const titleText = (typeof entityConfig === 'object' && entityConfig.title) || '';
    if (showTitle && titleText) {
      finalElement = createCardWithTitle(cardElement, titleText);
    }

    // Create add row if enabled
    if (this._config.show_create) {
      const addRow = this.createAddRow(entityId);
      cardElement.appendChild(addRow);
    }

    // Create todo list container
    const listContainer = document.createElement('div');
    listContainer.className = 'todo-list';
    cardElement.appendChild(listContainer);

    // Set up search functionality if enabled
    if (this._config.enable_search && this._config.show_create) {
      setupSearchForCard(cardElement, entityId, this.cardInstance);
    }

    // Set up subscription if hass is available
    if (this._hass) {
      debugLog('Setting up todo subscription for', entityId);

      // Clean up any existing subscription
      const existingUnsub = this.cardInstance._todoSubscriptions.get(entityId);
      if (existingUnsub && typeof existingUnsub === 'function') {
        try {
          existingUnsub();
        } catch (e) {
          debugLog('Error cleaning up subscription:', e);
        }
      }

      // Create new subscription
      const unsubscribe = await subscribeToTodoItems(entityId, this._hass);
      this.cardInstance._todoSubscriptions.set(entityId, unsubscribe);

      // Do initial fetch
      debugLog('Doing initial fetch for', entityId);
      setTimeout(async () => {
        await this.updateNativeTodoCard(finalElement, entityId);
      }, 100);
    }

    return finalElement;
  }

  /**
   * Create add item row
   * @param {string} entityId - Entity ID
   * @returns {HTMLElement} Add row element
   */
  createAddRow(entityId) {
    const addRow = document.createElement('div');
    addRow.className = 'add-row';

    // Create text input
    const textField = document.createElement('div');
    textField.className = 'add-textfield';

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = this._config.enable_search ? 'Type to search / add' : 'Add item';

    // Add keydown handler for Enter key
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const value = input.value.trim();
        if (value) {
          // Check if this is search mode
          if (this._config.enable_search) {
            // Use the search functionality
            handleSearchKeydown(
              e,
              entityId,
              input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper'),
              input,
              this.cardInstance
            );
          } else {
            // Non-search mode - just add the item
            this.cardInstance._addTodoItem(entityId, value);
            input.value = '';
            input.focus();
          }
        }
      } else if (e.key === 'Escape' && this._config.enable_search) {
        // Clear search on Escape
        input.value = '';
        this.cardInstance._searchStates.delete(entityId);
        this.cardInstance._currentSearchText = '';
        // Find the card element and update it
        const cardElement =
          input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper');
        if (cardElement) {
          this.updateNativeTodoCard(cardElement, entityId);
        }
      }
    });

    textField.appendChild(input);
    addRow.appendChild(textField);

    // Create add button if enabled
    if (this._config.show_addbutton) {
      const addButton = document.createElement('button');
      addButton.className = 'add-button';
      addButton.title = 'Add item';
      addButton.innerHTML = `
       <svg viewBox="0 0 24 24">
         <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
       </svg>
     `;

      addButton.addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {
          // Check if this is search mode - same logic as Enter key
          if (this._config.enable_search) {
            // CLEAR SEARCH STATE FIRST - before doing anything else
            debugLog(`Clearing search state for ${entityId} BEFORE adding item (+ button)`);
            this.cardInstance._searchStates.delete(entityId);
            this.cardInstance._currentSearchText = '';
            input.value = '';

            // Check if the search text matches any existing items
            const entityState = this.cardInstance._hass?.states?.[entityId];
            const items = entityState?.attributes?.items || [];
            const exactMatch = items.some(
              (item) => item.summary.toLowerCase() === value.toLowerCase()
            );

            if (!exactMatch) {
              debugLog(`No exact match found, adding item: "${value}" (+ button)`);
              // Add new item since no exact match found
              this.cardInstance._addTodoItem(entityId, value);
            } else {
              debugLog(`Exact match found, not adding item: "${value}" (+ button)`);
            }

            // Update the card to clear search display
            const cardElement =
              input.closest('.native-todo-card') || input.closest('.todo-card-with-title-wrapper');
            if (cardElement) {
              this.updateNativeTodoCard(cardElement, entityId);
            }
          } else {
            // Non-search mode - just add the item (original behavior)
            this.cardInstance._addTodoItem(entityId, value);
            input.value = '';
          }
          input.focus();
        }
      });

      addRow.appendChild(addButton);
    }

    return addRow;
  }

  /**
   * Update native todo card
   * @param {HTMLElement} cardElement - Card element
   * @param {string} entityId - Entity ID
   */
  async updateNativeTodoCard(cardElement, entityId) {
    debugLog(`Starting updateNativeTodoCard for ${entityId}`);

    if (!this._hass || !entityId) {
      debugLog('No hass or entityId provided');
      return;
    }

    const entityState = this._hass.states[entityId];
    if (!entityState) {
      debugLog(`Entity ${entityId} not found in hass.states`);
      return;
    }

    // Always fetch fresh items instead of relying on cache
    let items = [];
    try {
      items = await fetchTodoItems(entityId, this._hass);
      debugLog(`Fetched ${items.length} fresh items for ${entityId}`);

      // Update cache with fresh items
      if (!this.cardInstance._todoItemsCache) {
        this.cardInstance._todoItemsCache = new Map();
      }
      this.cardInstance._todoItemsCache.set(entityId, items);
    } catch (error) {
      debugLog(`Failed to fetch items for ${entityId}, trying cache:`, error);

      // Fallback to cache if fetch fails
      if (this.cardInstance._todoItemsCache && this.cardInstance._todoItemsCache.has(entityId)) {
        items = this.cardInstance._todoItemsCache.get(entityId) || [];
        debugLog(`Using ${items.length} cached items for ${entityId}`);
      } else {
        // Last resort: try to get from entity attributes
        items = entityState.attributes?.items || [];
        debugLog(`Using ${items.length} items from entity attributes for ${entityId}`);
      }
    }

    // Find the list container
    let listContainer = null;
    if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
      listContainer = cardElement.querySelector('.native-todo-card .todo-list');
    } else if (cardElement.classList.contains('native-todo-card')) {
      listContainer = cardElement.querySelector('.todo-list');
    } else {
      listContainer = cardElement.querySelector('.todo-list');
    }

    if (!listContainer) {
      debugLog('Creating missing list container');
      let targetCard = cardElement;
      if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
        targetCard = cardElement.querySelector('.native-todo-card');
      }

      if (targetCard) {
        listContainer = document.createElement('div');
        listContainer.className = 'todo-list';
        targetCard.appendChild(listContainer);
      } else {
        debugLog('Could not create list container');
        return;
      }
    }

    // Apply sorting (always use ALL items for search purposes)
    const entityConfig = this._getEntityConfig(entityId);
    const allSortedItems = sortTodoItems(items, entityConfig?.display_order, this._hass);
    const searchText = this.cardInstance._searchStates.get(entityId) || '';
    const isSearchActive = searchText && searchText.trim() !== '';

    debugLog(`Search text for filtering: "${searchText}"`);

    // Filter by search text (if searching, include ALL matching items regardless of completion status)
    const filteredItems = isSearchActive
      ? allSortedItems.filter((item) => matchesSearch(item, searchText))
      : allSortedItems;

    debugLog(
      `Rendering ${filteredItems.length} items for ${entityId} (from ${items.length} total)`
    );

    // Clear and render
    listContainer.innerHTML = '';

    if (filteredItems.length > 0) {
      filteredItems.forEach((item, index) => {
        try {
          const itemElement = createTodoItemElement(
            item,
            entityId,
            this.cardInstance._toggleTodoItem,
            this.cardInstance._editTodoItem,
            this._hass
          );

          // Show completed items when actively searching, otherwise respect show_completed setting
          if (!this._config.show_completed && item.status === 'completed' && !isSearchActive) {
            itemElement.style.display = 'none';
          }

          listContainer.appendChild(itemElement);
        } catch (e) {
          console.error(`Error creating item element ${index}:`, e, item);
        }
      });
    }

    // Update search results counter
    this.updateSearchCounter(
      cardElement,
      entityId,
      searchText,
      filteredItems.length,
      allSortedItems.length
    );

    debugLog(`Finished updating card for ${entityId}`);
  }

  /**
   * Update search results counter
   * @param {HTMLElement} cardElement - Card element
   * @param {string} entityId - Entity ID
   * @param {string} searchText - Current search text
   * @param {number} filteredCount - Number of filtered items
   * @param {number} totalCount - Total number of items
   */
  updateSearchCounter(cardElement, entityId, searchText, filteredCount, totalCount) {
    // Find the add row
    let addRow = null;
    if (cardElement.classList.contains('todo-card-with-title-wrapper')) {
      addRow = cardElement.querySelector('.native-todo-card .add-row');
    } else {
      addRow = cardElement.querySelector('.add-row');
    }

    if (!addRow) return;

    // Remove existing counter
    const existingCounter = cardElement.querySelector('.search-counter');
    if (existingCounter) {
      existingCounter.remove();
    }

    // Handle add-row CSS class and counter
    if (searchText && searchText.trim() !== '' && totalCount > 0) {
      // Add CSS class to reduce add-row margin when search counter is present
      addRow.classList.add('has-search-counter');

      // Create and insert counter
      const counter = document.createElement('div');
      counter.className = 'search-counter';
      counter.textContent = `Showing ${filteredCount} of ${totalCount} results`;

      // Insert after the add-row
      addRow.parentNode.insertBefore(counter, addRow.nextSibling);
    } else {
      // Remove CSS class to restore default spacing when no search counter
      addRow.classList.remove('has-search-counter');
    }
  }
}

/**
 * SubscriptionManager handles all todo subscription management for TodoSwipeCard
 * Manages subscriptions, updates, and cache lifecycle
 */
class SubscriptionManager {
  constructor(cardInstance) {
    this.cardInstance = cardInstance;

    // Bind the handleTodoUpdate method for event listeners
    this.handleTodoUpdate = this.handleTodoUpdate.bind(this);
  }

  /**
   * Get hass object from card instance
   * @returns {Object} Home Assistant object
   * @private
   */
  get _hass() {
    return this.cardInstance._hass;
  }

  /**
   * Get config object from card instance
   * @returns {Object} Card configuration
   * @private
   */
  get _config() {
    return this.cardInstance._config;
  }

  /**
   * Initialize subscriptions when hass becomes available and cards are ready
   * @param {Object} hass - Home Assistant object
   * @param {Object} previousHass - Previous hass object
   */
  async initializeSubscriptions(hass, previousHass) {
    // If not initialized yet, just store hass and return
    if (
      !this.cardInstance.initialized ||
      !this.cardInstance.cards ||
      this.cardInstance.cards.length === 0
    ) {
      debugLog('Not initialized yet or no cards, storing hass and returning');
      return;
    }

    // If this is the first time we get hass after cards are created, set up subscriptions
    if (!previousHass && this.cardInstance.cards.length > 0) {
      debugLog('First hass after cards created, setting up subscriptions');

      for (const card of this.cardInstance.cards) {
        if (card && card.entityId) {
          debugLog(`Setting up subscription for ${card.entityId}`);

          // Clean up any existing subscription
          const existingUnsub = this.cardInstance._todoSubscriptions?.get(card.entityId);
          if (existingUnsub && typeof existingUnsub === 'function') {
            try {
              existingUnsub();
            } catch (e) {
              debugLog('Error cleaning up subscription:', e);
            }
          }

          // Create new subscription
          const unsubscribe = await subscribeToTodoItems(card.entityId, this._hass);
          if (!this.cardInstance._todoSubscriptions) {
            this.cardInstance._todoSubscriptions = new Map();
          }
          this.cardInstance._todoSubscriptions.set(card.entityId, unsubscribe);

          // Do initial update
          setTimeout(async () => {
            await this.cardInstance.cardBuilder.updateNativeTodoCard(card.element, card.entityId);
          }, 100);
        }
      }
    }
  }

  /**
   * Setup todo update event listener
   */
  setupEventListeners() {
    // Add todo update listener
    document.addEventListener('todo-items-updated', this.handleTodoUpdate);
  }

  /**
   * Remove todo update event listener
   */
  removeEventListeners() {
    // Remove todo update listener
    document.removeEventListener('todo-items-updated', this.handleTodoUpdate);
  }

  /**
   * Handle todo items update event
   * @param {CustomEvent} event - Todo update event
   */
  handleTodoUpdate(event) {
    const { entityId, items } = event.detail;

    // Cache the items
    if (!this.cardInstance._todoItemsCache) {
      this.cardInstance._todoItemsCache = new Map();
    }
    this.cardInstance._todoItemsCache.set(entityId, items);

    // Find and update the card immediately
    const card = this.cardInstance.cards.find((c) => c.entityId === entityId);
    if (card && card.element) {
      // Use setTimeout to ensure DOM is ready
      setTimeout(() => {
        this.cardInstance.cardBuilder.updateNativeTodoCard(card.element, entityId);
      }, 50);
    }
  }

  /**
   * Clean up all subscriptions and caches
   */
  cleanup() {
    debugLog('SubscriptionManager performing cleanup');

    // Clean up todo subscriptions
    if (this.cardInstance._todoSubscriptions) {
      this.cardInstance._todoSubscriptions.forEach((unsubscribe, entityId) => {
        try {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
        } catch (e) {
          console.warn(`Error unsubscribing from todo entity ${entityId}:`, e);
        }
      });
      this.cardInstance._todoSubscriptions.clear();
    }

    // Clear items cache
    if (this.cardInstance._todoItemsCache) {
      this.cardInstance._todoItemsCache.clear();
    }

    // Remove event listeners
    this.removeEventListeners();

    debugLog('SubscriptionManager cleanup completed');
  }
}

/**
 * TodoSwipeCard: A custom card for Home Assistant to display multiple todo lists with swipe navigation
 * @extends LitElement
 */
class TodoSwipeCard extends i {
  constructor() {
    super();

    this._config = {};
    this._hass = null;
    this.cards = [];
    this.currentIndex = 0;
    this.slideWidth = 0;
    this.cardContainer = null;
    this.sliderElement = null;
    this.paginationElement = null;
    this.initialized = false;
    this._dynamicStyleElement = null;
    this._configUpdateTimer = null;
    this._buildPromise = null;
    this._lastConfig = null;
    this._updateThrottle = null;
    this._lastHassUpdate = null;
    this._todoSubscriptions = new Map(); // Track todo subscriptions per entity
    this._deleteButtonColor = null;

    // Search functionality properties
    this._searchStates = new Map(); // Track search state per entity
    this._currentSearchText = '';
    this._searchInputHandlers = new Map(); // Track input handlers per card

    this._todoItemsCache = new Map(); // Cache for todo items per entity
    this._isAddingItem = false;

    // Initialize dialog manager
    this.dialogManager = new DialogManager(this);

    // Initialize card builder
    this.cardBuilder = new CardBuilder(this);

    // Initialize subscription manager
    this.subscriptionManager = new SubscriptionManager(this);

    // Bind methods to ensure proper context
    this._addTodoItem = this._addTodoItem.bind(this);
    this._toggleTodoItem = this._toggleTodoItem.bind(this);
    this._editTodoItem = this._editTodoItem.bind(this);
  }

  /**
   * Render method for LitElement compatibility
   * @returns {TemplateResult|void}
   */
  render() {
    // For LitElement, return empty template as we handle rendering manually
    return x``;
  }

  /**
   * Returns default configuration for the card
   * @returns {Object} Default configuration
   */
  static getStubConfig() {
    return {
      entities: [],
      card_spacing: 15,
      show_pagination: true,
      show_icons: false,
      show_create: true,
      show_addbutton: false,
      show_completed: false,
      show_completed_menu: false,
      delete_confirmation: false,
      enable_search: false
    };
  }

  /**
   * Returns the editor element for the card
   * @returns {HTMLElement} Card editor element
   */
  static getConfigElement() {
    return document.createElement('todo-swipe-card-editor');
  }

  /**
   * Check if there are valid entities configured
   * @returns {boolean} True if valid entities are present
   * @private
   */
  _hasValidEntities() {
    return (
      this._config &&
      this._config.entities &&
      Array.isArray(this._config.entities) &&
      this._config.entities.length > 0 &&
      this._config.entities.some((entity) => {
        if (typeof entity === 'string') {
          return entity && entity.trim() !== '';
        }
        return entity && entity.entity && entity.entity.trim() !== '';
      })
    );
  }

  /**
   * Get entity ID from entity configuration (handles both string and object formats)
   * @param {string|Object} entity - Entity configuration
   * @returns {string} Entity ID
   * @private
   */
  _getEntityId(entity) {
    if (typeof entity === 'string') {
      return entity;
    }
    return entity?.entity || '';
  }

  /**
   * Get entity configuration by ID
   * @param {string} entityId - Entity ID to find
   * @returns {Object|null} Entity configuration object or null if not found
   * @private
   */
  _getEntityConfig(entityId) {
    if (!this._config?.entities) return null;

    const entity = this._config.entities.find((entity) => this._getEntityId(entity) === entityId);

    if (typeof entity === 'string') {
      return { entity: entityId };
    }

    return entity || null;
  }

  /**
   * Check if configuration actually changed
   * @param {Object} newConfig - New configuration
   * @returns {boolean} True if config changed
   * @private
   */
  _hasConfigChanged(newConfig) {
    if (!this._lastConfig) return true;

    // Quick string comparison first
    const newConfigStr = JSON.stringify(newConfig);
    const lastConfigStr = JSON.stringify(this._lastConfig);

    return newConfigStr !== lastConfigStr;
  }

  /**
   * Apply card-mod styles to the card
   * Optimized to avoid redundant operations
   * @private
   */
  _applyCardModStyles() {
    // Ensure we have a valid shadowRoot
    if (!this.shadowRoot) return;

    // Create a style element for dynamic styles if it doesn't exist
    if (!this._dynamicStyleElement) {
      this._dynamicStyleElement = document.createElement('style');
      this.shadowRoot.appendChild(this._dynamicStyleElement);
    }

    // Generate CSS based on current config
    if (this._config && this._config.card_mod && typeof this._config.card_mod.style === 'string') {
      const cssText = this._config.card_mod.style;

      // Check if the style already contains :host selector
      if (cssText.includes(':host')) {
        // Use the style as-is if it already has :host
        this._dynamicStyleElement.textContent = cssText;
      } else {
        // Wrap in :host if it doesn't have it
        this._dynamicStyleElement.textContent = `
          :host {
            ${cssText}
          }
        `;
      }
    } else if (this._dynamicStyleElement) {
      this._dynamicStyleElement.textContent = '';
    }
  }

  /**
   * Extract and apply transition properties from card_mod styles
   * @private
   */
  _applyTransitionProperties() {
    if (!this.sliderElement || !this._config) return;

    try {
      // Default values
      let transitionSpeed = '0.3s';
      let transitionEasing = 'ease-out';

      // Extract transition properties from card_mod style - check both locations
      const cardModConfig = this._config.card_mod || this._config.custom_card_mod;
      if (cardModConfig && typeof cardModConfig.style === 'string') {
        const styleString = cardModConfig.style;

        // Extract transition speed
        const speedRegex = /--todo-swipe-card-transition-speed\s*:\s*([^;]+)/i;
        const speedMatch = styleString.match(speedRegex);
        if (speedMatch && speedMatch[1]) {
          transitionSpeed = speedMatch[1].trim();
        }

        // Extract transition easing
        const easingRegex = /--todo-swipe-card-transition-easing\s*:\s*([^;]+)/i;
        const easingMatch = styleString.match(easingRegex);
        if (easingMatch && easingMatch[1]) {
          transitionEasing = easingMatch[1].trim();
        }

        // Extract delete button color
        const deleteButtonRegex = /--todo-swipe-card-delete-button-color\s*:\s*([^;]+)/i;
        const deleteButtonMatch = styleString.match(deleteButtonRegex);
        if (deleteButtonMatch && deleteButtonMatch[1]) {
          this._deleteButtonColor = deleteButtonMatch[1].trim();
          this._applyDeleteButtonColor();
        }
      }

      // Apply directly to the slider element with null check
      if (this.sliderElement && this.sliderElement.style) {
        const transitionValue = `transform ${transitionSpeed} ${transitionEasing}`;
        this.sliderElement.style.transition = transitionValue;

        // Store the values for later use
        this._transitionSpeed = transitionSpeed;
        this._transitionEasing = transitionEasing;
      }
    } catch (e) {
      console.error('Error applying transition properties:', e);
    }
  }

  /**
   * Apply delete button color to all existing delete buttons
   * @private
   */
  _applyDeleteButtonColor() {
    if (!this._deleteButtonColor) return;

    // Find all delete buttons and apply the color
    const deleteButtons = this.shadowRoot.querySelectorAll('.delete-completed-button');
    deleteButtons.forEach((button) => {
      button.style.color = this._deleteButtonColor;

      // Also apply to the SVG inside
      const svg = button.querySelector('svg');
      if (svg) {
        svg.style.fill = this._deleteButtonColor;
      }
    });
  }

  /**
   * Set card configuration with improved debouncing
   * @param {Object} config - Card configuration
   */
  setConfig(config) {
    debugLog('setConfig called with:', JSON.stringify(config));

    // Ensure entities is an array with at least one item
    let entities = config.entities || [];
    if (!Array.isArray(entities)) {
      // Convert from old object format if needed
      if (typeof entities === 'object') {
        entities = Object.values(entities);
      } else if (typeof entities === 'string') {
        entities = [entities];
      } else {
        entities = [];
      }
    }

    // Normalize entities to support both string and object formats
    entities = entities
      .map((entity) => {
        if (typeof entity === 'string') {
          // Convert string to object format, but keep it as string if empty
          return entity.trim() === '' ? entity : { entity: entity };
        }
        return entity; // Already object format
      })
      .filter((entity) => {
        if (typeof entity === 'string') {
          return entity !== ''; // Keep non-empty strings
        }
        return entity && (entity.entity || entity.entity === ''); // Keep objects with entity property
      });

    // Set defaults and merge config
    const newConfig = {
      ...TodoSwipeCard.getStubConfig(),
      ...config,
      entities // Override with our normalized entities array
    };

    // Ensure card_spacing is a valid number
    if (newConfig.card_spacing === undefined) {
      newConfig.card_spacing = 15; // Default spacing
    } else {
      newConfig.card_spacing = parseInt(newConfig.card_spacing);
      if (isNaN(newConfig.card_spacing) || newConfig.card_spacing < 0) {
        newConfig.card_spacing = 15;
      }
    }

    // Handle card_mod configuration - keep it as card_mod for consistency
    if (
      config.card_mod &&
      typeof config.card_mod === 'object' &&
      Object.keys(config.card_mod).length > 0
    ) {
      newConfig.card_mod = config.card_mod;
    } else if (
      config.custom_card_mod &&
      typeof config.custom_card_mod === 'object' &&
      Object.keys(config.custom_card_mod).length > 0
    ) {
      newConfig.card_mod = config.custom_card_mod;
    }

    // Check if config actually changed
    if (!this._hasConfigChanged(newConfig)) {
      debugLog('Config unchanged, skipping update');
      return;
    }

    // Save the old config for comparison
    const oldConfig = this._config;
    this._config = newConfig;
    this._lastConfig = JSON.parse(JSON.stringify(newConfig));

    debugLog('Config after processing:', JSON.stringify(this._config));

    // Apply styles immediately for better perceived performance
    this._applyCardModStyles();

    // If already initialized, determine if we need a full rebuild or just updates
    if (this.initialized) {
      // Clear any pending config update timer
      if (this._configUpdateTimer) {
        clearTimeout(this._configUpdateTimer);
      }

      // Check if we need a full rebuild
      const needsRebuild = this._needsFullRebuild(oldConfig, newConfig);

      if (needsRebuild) {
        // Debounce rebuild to prevent excessive DOM manipulation
        this._configUpdateTimer = setTimeout(() => {
          debugLog('Rebuilding TodoSwipeCard due to significant config change');
          this._build().then(() => {
            // Apply transition properties after rebuild
            this._applyTransitionProperties();
            this._applyDeleteButtonColor();
          });
        }, 300); // Increased debounce time
      } else {
        // Just update the specific features without rebuild
        this._updateFromConfig(oldConfig);
        this._applyTransitionProperties();
        this._applyDeleteButtonColor();
      }
    }
  }

  /**
   * Determine if a full rebuild is needed based on config changes
   * @param {Object} oldConfig - Previous configuration
   * @param {Object} newConfig - New configuration
   * @returns {boolean} True if full rebuild needed
   * @private
   */
  _needsFullRebuild(oldConfig, newConfig) {
    if (!oldConfig) return true;

    // Check for changes that require full rebuild
    const entitiesChanged =
      JSON.stringify(oldConfig.entities) !== JSON.stringify(newConfig.entities);
    const paginationChanged = oldConfig.show_pagination !== newConfig.show_pagination;
    const createFieldChanged = oldConfig.show_create !== newConfig.show_create;
    const cardModChanged =
      JSON.stringify(oldConfig.card_mod) !== JSON.stringify(newConfig.card_mod);
    const searchChanged = oldConfig.enable_search !== newConfig.enable_search;

    return (
      entitiesChanged || paginationChanged || createFieldChanged || cardModChanged || searchChanged
    );
  }

  /**
   * Updates specific card features without a full rebuild
   * Optimized version
   * @param {Object} oldConfig - Previous configuration
   * @private
   */
  _updateFromConfig(oldConfig) {
    debugLog('Applying minor config updates');

    // Batch DOM updates using requestAnimationFrame
    requestAnimationFrame(() => {
      // Update show_completed setting
      if (this._config.show_completed !== oldConfig.show_completed) {
        this.cards.forEach((card) => {
          if (card.element) {
            const items = card.element.querySelectorAll('.todo-item.completed');
            items.forEach((item) => {
              item.style.display = this._config.show_completed ? '' : 'none';
            });
          }
        });
      }

      // Update show_completed_menu setting
      if (
        this._config.show_completed_menu !== oldConfig.show_completed_menu ||
        this._config.show_completed !== oldConfig.show_completed
      ) {
        this._updateDeleteButtons();
      }

      // Update card spacing
      if (this._config.card_spacing !== oldConfig.card_spacing) {
        if (this.sliderElement) {
          this.sliderElement.style.gap = `${this._config.card_spacing}px`;
          this.updateSlider(false); // Update without animation
        }
      }

      // Apply pagination styles if they changed
      if (
        JSON.stringify(this._config.card_mod || this._config.custom_card_mod) !==
        JSON.stringify(oldConfig.card_mod || oldConfig.custom_card_mod)
      ) {
        this._applyCardModStyles();
        if (this.paginationElement) {
          this._applyPaginationStyles();
        }
      }
    });
  }

  /**
   * Update delete buttons for all cards
   * @private
   */
  _updateDeleteButtons() {
    this.cards.forEach((card) => {
      const slide = card.slide;
      if (!slide) return;

      // Remove existing delete buttons
      const oldButtons = slide.querySelectorAll('.delete-completed-button');
      oldButtons.forEach((btn) => btn.remove());

      // Add delete button if configured to show completed items and menu
      if (this._config.show_completed && this._config.show_completed_menu) {
        // Use the stored entity config from the card object first, then fallback to lookup
        const entityConfig = card.entityConfig || this._getEntityConfig(card.entityId);
        const deleteButton = this._createDeleteButton(card.entityId, entityConfig);
        slide.appendChild(deleteButton);
      }
    });
  }

  /**
   * Create a delete button element
   * @param {string} entityId - Entity ID for the todo list
   * @param {Object} entityConfig - Entity configuration object
   * @returns {HTMLElement} Delete button element
   * @private
   */
  _createDeleteButton(entityId, entityConfig = null) {
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-completed-button';
    deleteButton.title = 'Delete completed items';
    deleteButton.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
      </svg>
    `;

    // Auto-adjust position if entity has a title
    if (entityConfig && entityConfig.show_title && entityConfig.title) {
      // Calculate auto-adjusted position: default 35px + title height (default 40px)
      const basePosition = 35;
      const titleHeight = 'var(--todo-swipe-card-title-height, 40px)';
      const autoAdjustedTop = `calc(${basePosition}px + ${titleHeight})`;

      // Set the auto-adjustment CSS variable on the button
      deleteButton.style.setProperty('--todo-swipe-card-delete-button-auto-top', autoAdjustedTop);
    }

    // Apply delete button color if available
    if (this._deleteButtonColor) {
      deleteButton.style.color = this._deleteButtonColor;
      const svg = deleteButton.querySelector('svg');
      if (svg) {
        svg.style.fill = this._deleteButtonColor;
      }
    }

    // Add click handler for the delete button with confirmation dialog
    deleteButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Check if confirmation is required
      if (this._config.delete_confirmation) {
        this.dialogManager.showDeleteCompletedConfirmation(entityId);
      } else {
        // No confirmation needed, delete immediately
        deleteCompletedItems(entityId, this._hass);
      }
    });

    return deleteButton;
  }

  /**
   * Enhanced hass setter to set up subscriptions when cards are ready
   */
  set hass(hass) {
    if (!hass) return;

    const previousHass = this._hass;
    this._hass = hass;

    // Initialize subscriptions through subscription manager
    this.subscriptionManager.initializeSubscriptions(hass, previousHass);
  }

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    
    // Setup event listeners through subscription manager
    this.subscriptionManager.setupEventListeners();
    
    // Ensure we have a valid config before proceeding
    if (!this._config) {
      debugLog('TodoSwipeCard connected but no config available');
      return;
    }

    if (!this.initialized) {
      debugLog('TodoSwipeCard connecting and building');
      this._applyCardModStyles();
      
      // Small delay to ensure renderRoot is ready
      setTimeout(() => {
        this._build();
      }, 0);
    }
  }

  /**
   * Called when the element is disconnected from the DOM
   * Improved cleanup for better memory management (simplified from old version)
   */
  disconnectedCallback() {
    debugLog('TodoSwipeCard disconnecting - performing cleanup');

    // Clear all timers first to prevent any pending operations
    if (this._configUpdateTimer) {
      clearTimeout(this._configUpdateTimer);
      this._configUpdateTimer = null;
    }

    if (this._updateThrottle) {
      clearTimeout(this._updateThrottle);
      this._updateThrottle = null;
    }

    // Clear resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Clean up subscriptions, caches, and event listeners through subscription manager
    this.subscriptionManager.cleanup();

    // Clean up search functionality
    cleanupSearchHandlers(this);

    // Properly remove swipe gesture handlers (simplified)
    if (this.cardContainer) {
      if (this._touchStartHandler) {
        this.cardContainer.removeEventListener('touchstart', this._touchStartHandler);
        this.cardContainer.removeEventListener('touchmove', this._touchMoveHandler);
        this.cardContainer.removeEventListener('touchend', this._touchEndHandler);
        this.cardContainer.removeEventListener('touchcancel', this._touchEndHandler);
        this.cardContainer.removeEventListener('mousedown', this._mouseDownHandler);
      }

      // Clean up window event listeners that might have been added
      window.removeEventListener('mousemove', this._mouseMoveHandler);
      window.removeEventListener('mouseup', this._mouseUpHandler);
    }

    // Mark as not initialized but keep critical references
    this.initialized = false;

    // Clear DOM references
    this.cards = [];
    this.cardContainer = null;
    this.sliderElement = null;
    this.paginationElement = null;

    // Reset update tracking
    this._lastHassUpdate = null;

    // Only clear shadowRoot content if it exists
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = '';
    }

    debugLog('TodoSwipeCard cleanup completed');
  }

  /**
   * Build the card UI with optimized DOM handling
   * Now returns a promise for better async handling
   * @private
   */
  async _build() {
    // Prevent concurrent builds
    if (this._buildPromise) {
      debugLog('Build already in progress, waiting...');
      return this._buildPromise;
    }

    this._buildPromise = this._doBuild();

    try {
      await this._buildPromise;
    } finally {
      this._buildPromise = null;
    }
  }

  /**
   * Enhanced build method with better initialization
   */
  async _doBuild() {
    debugLog('Starting build...');

    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();
    const root = this.renderRoot || this.shadowRoot;
    if (!root) {
      console.error('No render root available');
      return;
    }
    root.innerHTML = ''; // Clear previous content

    // Add base styles
    const style = createBaseStyles(this._config);
    fragment.appendChild(style);

    // Re-add the dynamic style element if it exists
    if (this._dynamicStyleElement) {
      fragment.appendChild(this._dynamicStyleElement);
    }

    // Check if we should show the preview (no valid entities configured)
    if (!this._hasValidEntities()) {
      buildPreview(fragment);
      root.appendChild(fragment);
      this.initialized = true;
      debugLog('Preview build completed');
      return;
    }

    // Regular card layout - only proceed if we have valid entities
    debugLog('Building regular card layout');

    // Create container
    this.cardContainer = document.createElement('div');
    this.cardContainer.className = 'card-container';

    // Create slider
    this.sliderElement = document.createElement('div');
    this.sliderElement.className = 'slider';
    this.cardContainer.appendChild(this.sliderElement);
    fragment.appendChild(this.cardContainer);

    // Append to DOM BEFORE creating cards (important for timing)
    root.appendChild(fragment);

    // Initialize cards array
    this.cards = [];

    // Create slides for each todo entity (now that DOM is ready)
    try {
      await this.cardBuilder.createNativeTodoCards();
    } catch (error) {
      console.error('Error creating native todo cards:', error);
      // Continue with initialization even if card creation fails
    }

    // Create pagination if enabled (and more than one card)
    if (this._config.show_pagination !== false && this.cards.length > 1) {
      createPagination(this);
    } else {
      this.paginationElement = null;
    }

    // Initial positioning requires element dimensions, wait for next frame
    requestAnimationFrame(() => {
      if (!this.cardContainer) {
        return;
      }

      this.slideWidth = this.cardContainer.offsetWidth;
      // Ensure currentIndex is valid before updating slider
      this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.cards.length - 1));

      // Apply border radius to all slides
      const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
      this.cards.forEach((cardData) => {
        if (cardData.slide) {
          cardData.slide.style.borderRadius = cardBorderRadius;
        }
      });

      this.updateSlider(false); // Update without animation initially

      // Setup resize observer only after initial layout
      this._setupResizeObserver();

      // IMPORTANT: Force initial update of all cards after DOM is ready
      debugLog('Forcing initial update of all cards');
      this.cards.forEach((card, index) => {
        if (card && card.element && card.entityId) {
          debugLog(`Force updating card ${index} for entity ${card.entityId}`);
          // Use setTimeout to ensure DOM is fully rendered
          setTimeout(() => {
            this.cardBuilder.updateNativeTodoCard(card.element, card.entityId);
          }, 50 * index); // Stagger updates slightly
        }
      });
    });

    // Add swipe detection only if more than one card
    if (this.cards.length > 1) {
      addSwipeGestures(this);
    }

    // Apply transition properties
    setTimeout(() => {
      this._applyTransitionProperties();
    }, 200);

    // Mark as initialized AFTER build completes
    this.initialized = true;
    debugLog('Regular card build completed.');
  }

  /**
   * Add a new todo item
   * @param {string} entityId - Entity ID
   * @param {string} summary - Item summary
   * @private
   */
  _addTodoItem(entityId, summary) {
    addTodoItem(entityId, summary, this._hass);
  }

  /**
   * Toggle todo item completion status
   * @param {string} entityId - Entity ID
   * @param {Object} item - Todo item
   * @param {boolean} completed - New completion status
   * @private
   */
  _toggleTodoItem(entityId, item, completed) {
    toggleTodoItem(entityId, item, completed, this._hass);
  }

  /**
   * Edit todo item using the dialog manager
   * @param {string} entityId - Entity ID
   * @param {Object} item - Todo item
   * @private
   */
  _editTodoItem(entityId, item) {
    this.dialogManager.editTodoItem(entityId, item);
  }

  /**
   * Setup resize observer with improved debounce
   * @private
   */
  _setupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }

    let resizeTimeout;
    this.resizeObserver = new ResizeObserver(() => {
      // Clear existing timeout
      if (resizeTimeout) clearTimeout(resizeTimeout);

      // Debounce resize handling
      resizeTimeout = setTimeout(() => {
        if (!this.cardContainer) return;

        const newWidth = this.cardContainer.offsetWidth;
        // Only update if width actually changed significantly
        if (newWidth > 0 && Math.abs(newWidth - this.slideWidth) > 1) {
          debugLog('Resizing slider...');
          this.slideWidth = newWidth;

          // Batch DOM updates
          requestAnimationFrame(() => {
            // Reapply border radius when resizing
            const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
            this.cards.forEach((cardData) => {
              if (cardData.slide) {
                cardData.slide.style.borderRadius = cardBorderRadius;
              }
            });

            this.updateSlider(false); // Update without animation on resize
          });
        }
      }, 200); // Increased debounce time
    });

    if (this.cardContainer) {
      this.resizeObserver.observe(this.cardContainer);
    }
  }

  /**
   * Navigate to a specific slide
   * @param {number} index - The slide index to go to
   */
  goToSlide(index) {
    if (!this.cards || this.cards.length === 0 || !this.initialized) return;

    index = Math.max(0, Math.min(index, this.cards.length - 1));

    if (index === this.currentIndex) return;

    this.currentIndex = index;
    this.updateSlider();
  }

  /**
   * Update slider position and pagination
   * @param {boolean} animate - Whether to animate the transition
   */
  updateSlider(animate = true) {
    if (!this.sliderElement || !this.slideWidth || this.cards.length === 0 || !this.initialized) {
      return;
    }

    // Batch all DOM updates
    requestAnimationFrame(() => {
      // Re-check if elements still exist inside requestAnimationFrame
      if (!this.sliderElement || !this.cardContainer || !this.initialized) {
        return;
      }

      // Use stored transition values if available, otherwise default
      const transitionSpeed = this._transitionSpeed || '0.3s';
      const transitionEasing = this._transitionEasing || 'ease-out';

      // Set transition based on animate parameter
      this.sliderElement.style.transition = animate
        ? `transform ${transitionSpeed} ${transitionEasing}`
        : 'none';

      // Get card spacing from config
      const cardSpacing = this._config.card_spacing || 0;

      // Update slider gap for spacing
      this.sliderElement.style.gap = `${cardSpacing}px`;

      // Calculate transform using pixel values including spacing
      const translateX = this.currentIndex * (this.slideWidth + cardSpacing);
      this.sliderElement.style.transform = `translateX(-${translateX}px)`;

      // Get the border radius from the container and apply to all slides
      const cardBorderRadius = getComputedStyle(this.cardContainer).borderRadius;
      this.cards.forEach((card) => {
        if (card.slide) {
          card.slide.style.marginRight = '0px'; // Ensure margins are reset
          card.slide.style.borderRadius = cardBorderRadius; // Apply border radius to slides
        }
      });

      // Update pagination
      updatePaginationDots(this);

      // Handle search state when sliding to a new card
      if (this._config.enable_search && this.cards[this.currentIndex]) ;
    });
  }

  /**
   * Get card size for Home Assistant layout system
   * @returns {number} Card size
   */
  getCardSize() {
    return 3;
  }
}

/**
 * Updated TodoSwipeCardEditor with compact layout similar to simple-swipe-card
 */
class TodoSwipeCardEditor extends i {
  static get properties() {
    return {
      hass: { type: Object },
      _config: { type: Object },
      _expandedEntities: { type: Set, state: true }, // Track which entities are expanded
      _buttonFeedbackState: { type: String, state: true } // Track button feedback state
    };
  }

  constructor() {
    super();
    this._expandedEntities = new Set();
    this._buttonFeedbackState = 'normal'; // Can be 'normal', 'blocked', or 'success'

    // Bind the method to ensure proper context
    this._addEntity = this._addEntity.bind(this);
  }

  async connectedCallback() {
    super.connectedCallback();
    await this._ensureComponentsLoaded();
    this.requestUpdate();
  }

  async _ensureComponentsLoaded() {
    const maxAttempts = 50;
    let attempts = 0;

    while (!customElements.get('ha-entity-picker') && attempts < maxAttempts) {
      await this._loadCustomElements();
      if (!customElements.get('ha-entity-picker')) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        attempts++;
      }
    }

    if (!customElements.get('ha-entity-picker')) {
      console.error('Failed to load ha-entity-picker after multiple attempts');
    }
  }

  async _loadCustomElements() {
    if (!customElements.get('ha-entity-picker')) {
      try {
        const attempts = [
          () => customElements.get('hui-entities-card')?.getConfigElement?.(),
          () => customElements.get('hui-entity-picker-card')?.getConfigElement?.()
        ];

        for (const attempt of attempts) {
          try {
            await attempt();
            if (customElements.get('ha-entity-picker')) {
              break;
            }
          } catch (e) {
            console.debug('Entity picker load attempt failed:', e);
          }
        }
      } catch (e) {
        console.warn('Could not load ha-entity-picker', e);
      }
    }
  }

  updated(changedProperties) {
    super.updated(changedProperties);

    if (changedProperties.has('_config') && this._config) {
      if (this._config.entities && this._config.entities.length > 0) {
        if (this._updateRAF) {
          cancelAnimationFrame(this._updateRAF);
        }

        this._updateRAF = requestAnimationFrame(() => {
          const entityPickers = this.shadowRoot.querySelectorAll('ha-entity-picker');
          if (entityPickers.length === 0 || entityPickers.length < this._config.entities.length) {
            this.requestUpdate();
          }
          this._updateRAF = null;
        });
      }
    }
  }

  /**
   * Helper to get entity ID from entity configuration
   * @param {string|Object} entity - Entity configuration
   * @returns {string} Entity ID
   * @private
   */
  _getEntityId(entity) {
    if (typeof entity === 'string') {
      return entity;
    }
    return entity?.entity || '';
  }

  /**
   * Create config with proper property order
   * @param {Object} config - Configuration object
   * @returns {Object} Reordered configuration
   * @private
   */
  _createOrderedConfig(config) {
    const orderedConfig = {
      type: config.type,
      entities: config.entities,
      card_spacing: config.card_spacing,
      show_pagination: config.show_pagination,
      show_create: config.show_create,
      show_addbutton: config.show_addbutton,
      show_completed: config.show_completed,
      show_completed_menu: config.show_completed_menu,
      delete_confirmation: config.delete_confirmation,
      enable_search: config.enable_search
    };

    // Add other properties, but exclude empty custom_card_mod
    const excludedKeys = [
      'type',
      'entities',
      'card_spacing',
      'show_pagination',
      'show_create',
      'show_addbutton',
      'show_completed',
      'show_completed_menu',
      'delete_confirmation',
      'enable_search',
      'custom_card_mod'
    ];

    Object.entries(config).forEach(([key, value]) => {
      if (!excludedKeys.includes(key)) {
        orderedConfig[key] = value;
      }
    });

    // Only include custom_card_mod if it exists and has meaningful content
    if (
      config.custom_card_mod &&
      typeof config.custom_card_mod === 'object' &&
      Object.keys(config.custom_card_mod).length > 0
    ) {
      orderedConfig.custom_card_mod = config.custom_card_mod;
    }

    return orderedConfig;
  }

  setConfig(config) {
    debugLog('Editor setConfig called with:', JSON.stringify(config));

    this._config = {
      ...this.constructor.getStubConfig()
    };

    if (config) {
      let entities = config.entities || [];
      if (!Array.isArray(entities)) {
        if (typeof entities === 'object') {
          entities = Object.values(entities);
        } else if (typeof entities === 'string') {
          entities = [entities];
        } else {
          entities = [];
        }
      }

      // Normalize entities to support both string and object formats
      entities = entities.map((entity) => {
        if (typeof entity === 'string') {
          // Keep string format during editing for backward compatibility
          return entity;
        }
        return entity; // Already object format
      });

      // Only filter out empty entities if they're not at the end of the array
      // This allows newly added empty entities to persist for user configuration
      const hasTrailingEmpty =
        entities.length > 0 &&
        (entities[entities.length - 1] === '' ||
          (typeof entities[entities.length - 1] === 'object' &&
            entities[entities.length - 1].entity === ''));
      if (!hasTrailingEmpty) {
        entities = entities.filter((e) => {
          if (typeof e === 'string') {
            return e && e.trim() !== '';
          }
          return e && e.entity && e.entity.trim() !== '';
        });
      } else {
        // Filter out empty entities except the last one
        const nonEmptyEntities = entities.slice(0, -1).filter((e) => {
          if (typeof e === 'string') {
            return e && e.trim() !== '';
          }
          return e && e.entity && e.entity.trim() !== '';
        });
        entities = [...nonEmptyEntities, ''];
      }

      let cardSpacing = config.card_spacing;
      if (cardSpacing === undefined) {
        cardSpacing = 15;
      } else {
        cardSpacing = parseInt(cardSpacing);
        if (isNaN(cardSpacing) || cardSpacing < 0) {
          cardSpacing = 15;
        }
      }

      // Only include custom_card_mod if it exists and has content
      const configUpdate = {
        ...this._config,
        ...config,
        entities,
        card_spacing: cardSpacing
      };

      // Only add custom_card_mod if it exists in the original config and has meaningful content
      if (
        config.custom_card_mod &&
        typeof config.custom_card_mod === 'object' &&
        Object.keys(config.custom_card_mod).length > 0
      ) {
        configUpdate.custom_card_mod = config.custom_card_mod;
      }

      this._config = configUpdate;
    }

    debugLog('TodoSwipeCardEditor - Config after initialization:', JSON.stringify(this._config));
    this.requestUpdate();
  }

  static getStubConfig() {
    return {
      entities: [],
      card_spacing: 15,
      show_pagination: true,
      show_icons: false,
      show_create: true,
      show_addbutton: false,
      show_completed: false,
      show_completed_menu: false,
      delete_confirmation: false,
      enable_search: false
    };
  }

  // Getters remain the same
  get _show_pagination() {
    return this._config.show_pagination !== false;
  }

  get _show_addbutton() {
    return this._config.show_addbutton === true;
  }

  get _show_create() {
    return this._config.show_create !== false;
  }

  get _show_completed() {
    return this._config.show_completed === true;
  }

  get _show_completed_menu() {
    return this._config.show_completed_menu === true;
  }

  get _delete_confirmation() {
    return this._config.delete_confirmation === true;
  }

  get _show_icons() {
    return this._config.show_icons === true;
  }

  get _enable_search() {
    return this._config.enable_search === true;
  }

  get _card_spacing() {
    return this._config.card_spacing !== undefined ? this._config.card_spacing : 15;
  }

  get _validEntities() {
    return (this._config.entities || []).filter((entity) => {
      const entityId = this._getEntityId(entity);
      return entityId && entityId.trim() !== '';
    });
  }

  get _showCompletedMenuOption() {
    return this._show_completed;
  }

  get _showDeleteConfirmationOption() {
    return this._show_completed && this._show_completed_menu;
  }

  get _showTitleSection() {
    return this._validEntities.length > 0;
  }

  static get styles() {
    return i$3`
      ${editorStyles()}
    `;
  }

  // New methods for entity management
  _moveEntity(index, direction) {
    if (!this._config?.entities) return;
    const entities = [...this._config.entities];

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= entities.length) return;

    // Swap the entities (preserving their full configuration)
    [entities[index], entities[newIndex]] = [entities[newIndex], entities[index]];

    // Update expanded state for moved entities
    if (this._expandedEntities.has(index)) {
      this._expandedEntities.delete(index);
      this._expandedEntities.add(newIndex);
    }
    if (this._expandedEntities.has(newIndex)) {
      this._expandedEntities.delete(newIndex);
      this._expandedEntities.add(index);
    }

    const newConfig = {
      ...this._config,
      entities
    };

    this._config = newConfig;
    debugLog(`Moving entity at index ${index} to ${newIndex}`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    this.requestUpdate();
  }

  _toggleExpanded(index) {
    if (this._expandedEntities.has(index)) {
      // If clicking on already expanded item, collapse it
      this._expandedEntities.delete(index);
    } else {
      // Close all other expanded items first (accordion behavior)
      this._expandedEntities.clear();
      // Then expand the clicked item
      this._expandedEntities.add(index);
    }
    this.requestUpdate();
  }

  _triggerButtonFeedback(state) {
    this._buttonFeedbackState = state;
    this.requestUpdate();

    // Reset to normal state after a brief period
    setTimeout(
      () => {
        this._buttonFeedbackState = 'normal';
        this.requestUpdate();
      },
      state === 'blocked' ? 1000 : 500
    ); // Blocked state lasts longer for better visibility
  }

  _getAvailableEntities(currentIndex = -1) {
    if (!this.hass) return [];

    // Get all todo domain entities
    const allTodoEntities = Object.keys(this.hass.states).filter(
      (entityId) => entityId.startsWith('todo.') && this.hass.states[entityId]
    );

    // Get currently selected entities (excluding the current index being edited)
    const selectedEntities = (this._config.entities || [])
      .map((entity, index) => {
        if (index === currentIndex) return null;
        return this._getEntityId(entity);
      })
      .filter((entityId) => entityId && entityId.trim() !== '');

    // Return entities that are not already selected
    return allTodoEntities.filter((entityId) => !selectedEntities.includes(entityId));
  }

  _getEntityDescriptor(entity) {
    const entityId = this._getEntityId(entity);

    if (!entityId || entityId.trim() === '') {
      return { displayName: 'Empty Entity', friendlyName: '' };
    }

    const entityState = this.hass?.states?.[entityId];
    const friendlyName =
      entityState?.attributes?.friendly_name || entityId.split('.').pop().replace(/_/g, ' ');
    const displayName = friendlyName;

    return { displayName, friendlyName };
  }

  // Existing methods with minor updates
  _valueChanged(ev) {
    if (!this._config || !this.hass) {
      return;
    }

    const target = ev.target;
    const value = target.checked !== undefined ? target.checked : target.value;
    const configValue = target.configValue || target.getAttribute('data-config-value');

    if (configValue) {
      // Maintain property order with type first
      const newConfig = this._createOrderedConfig({ ...this._config, [configValue]: value });
      this._config = newConfig;
      this._debounceDispatch(newConfig);
    }
  }

  _debounceDispatch(newConfig) {
    if (this._debounceTimeout) {
      clearTimeout(this._debounceTimeout);
    }

    this._debounceTimeout = setTimeout(() => {
      // Ensure proper order before dispatching
      const orderedConfig = this._createOrderedConfig(newConfig);
      debugLog(`Dispatching config-changed event`, orderedConfig);
      this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: orderedConfig } }));
    }, 150);
  }

  _cardSpacingChanged(ev) {
    if (!this._config) return;

    const value = parseInt(ev.target.value);
    if (!isNaN(value) && value >= 0) {
      const newConfig = this._createOrderedConfig({ ...this._config, card_spacing: value });
      this._config = newConfig;
      debugLog(`Card spacing changed to: ${value}`, newConfig);
      this._debounceDispatch(newConfig);
    }
  }

  _addEntity(e) {
    console.log('[TodoSwipeCard] _addEntity method called');

    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!this._config) {
      console.log('[TodoSwipeCard] No config available');
      return;
    }

    // Check if there's already an empty entity at the end - prevent multiple empty entries
    const currentEntities = Array.isArray(this._config.entities) ? [...this._config.entities] : [];
    const hasTrailingEmpty =
      currentEntities.length > 0 &&
      (currentEntities[currentEntities.length - 1] === '' ||
        (typeof currentEntities[currentEntities.length - 1] === 'object' &&
          currentEntities[currentEntities.length - 1].entity === ''));

    if (hasTrailingEmpty) {
      console.log('[TodoSwipeCard] Already has trailing empty entity, skipping add');

      // Trigger visual feedback for blocked action
      this._triggerButtonFeedback('blocked');
      return;
    }

    // Add new empty entity - use object format for new entities
    currentEntities.push({ entity: '' });

    const newConfig = {
      ...this._config,
      entities: currentEntities
    };

    // Update internal state
    this._config = newConfig;

    debugLog('Adding new entity', newConfig);

    // Trigger visual feedback for successful action
    this._triggerButtonFeedback('success');

    // Dispatch the event immediately
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: newConfig },
        bubbles: true,
        composed: true
      })
    );

    // Force update after a brief delay to ensure the change is processed
    setTimeout(() => {
      this.requestUpdate();
    }, 0);
  }

  _removeEntity(index) {
    if (!this._config || !Array.isArray(this._config.entities)) return;

    const entities = [...this._config.entities];

    entities.splice(index, 1);

    // Update expanded state
    this._expandedEntities.delete(index);
    // Shift down expanded indices that are greater than removed index
    const newExpandedEntities = new Set();
    this._expandedEntities.forEach((expandedIndex) => {
      if (expandedIndex > index) {
        newExpandedEntities.add(expandedIndex - 1);
      } else if (expandedIndex < index) {
        newExpandedEntities.add(expandedIndex);
      }
    });
    this._expandedEntities = newExpandedEntities;

    const newConfig = {
      ...this._config,
      entities
    };

    this._config = newConfig;
    debugLog(`Removing entity at index ${index}`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    this.requestUpdate();
  }

  _entityChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;

    const newValue = ev.detail?.value || ev.target.value || '';
    const entities = [...this._config.entities];
    const currentEntity = entities[index];

    // Preserve existing entity configuration when changing entity ID
    if (typeof currentEntity === 'object') {
      entities[index] = { ...currentEntity, entity: newValue };
    } else {
      // Convert string to object format
      entities[index] = { entity: newValue };
    }

    const newConfig = {
      ...this._config,
      entities
    };

    this._config = newConfig;
    debugLog(`Entity at index ${index} changed to "${newValue}"`, newConfig);
    this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: newConfig } }));
    this.requestUpdate();
  }

  _entityDisplayOrderChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;

    const newValue = ev.target.value || 'none';
    const entities = [...this._config.entities];
    const currentEntity = entities[index];

    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      entities[index] = { entity: currentEntity, display_order: newValue };
    } else {
      entities[index] = { ...currentEntity, display_order: newValue };
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _entityBackgroundImageChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;

    const newValue = ev.target.value || '';
    const entities = [...this._config.entities];
    const currentEntity = entities[index];

    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      const entityConfig = { entity: currentEntity };
      if (newValue) {
        entityConfig.background_image = newValue;
      }
      entities[index] = entityConfig;
    } else {
      if (newValue) {
        entities[index] = { ...currentEntity, background_image: newValue };
      } else {
        const updatedEntity = { ...currentEntity };
        delete updatedEntity.background_image;
        entities[index] = updatedEntity;
      }
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _entityTitleEnabledChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;

    const enabled = ev.target.checked;
    const entities = [...this._config.entities];
    const currentEntity = entities[index];

    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      entities[index] = { entity: currentEntity, show_title: enabled };
    } else {
      entities[index] = { ...currentEntity, show_title: enabled };
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _entityTitleTextChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;

    const titleText = ev.target.value || '';
    const entities = [...this._config.entities];
    const currentEntity = entities[index];

    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      const entityConfig = { entity: currentEntity };
      if (titleText) {
        entityConfig.title = titleText;
      }
      entities[index] = entityConfig;
    } else {
      if (titleText) {
        entities[index] = { ...currentEntity, title: titleText };
      } else {
        const updatedEntity = { ...currentEntity };
        delete updatedEntity.title;
        entities[index] = updatedEntity;
      }
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  _entityIconChanged(ev) {
    const index = parseInt(ev.target.getAttribute('data-index'));
    if (isNaN(index)) return;

    const iconName = ev.target.value || '';
    const entities = [...this._config.entities];
    const currentEntity = entities[index];

    // Ensure entity is in object format
    if (typeof currentEntity === 'string') {
      const entityConfig = { entity: currentEntity };
      if (iconName) {
        entityConfig.icon = iconName;
      }
      entities[index] = entityConfig;
    } else {
      if (iconName) {
        entities[index] = { ...currentEntity, icon: iconName };
      } else {
        const updatedEntity = { ...currentEntity };
        delete updatedEntity.icon;
        entities[index] = updatedEntity;
      }
    }

    const newConfig = { ...this._config, entities };
    this._config = newConfig;
    this._debounceDispatch(newConfig);
  }

  /**
   * Get entity configuration at index
   * @param {number} index - Entity index
   * @returns {Object} Entity configuration
   * @private
   */
  _getEntityConfigAtIndex(index) {
    const entity = this._config.entities[index];
    if (typeof entity === 'string') {
      return { entity, display_order: 'none', show_title: false, title: '', background_image: '' };
    }
    return {
      entity: entity?.entity || '',
      display_order: entity?.display_order || 'none',
      show_title: entity?.show_title || false,
      title: entity?.title || '',
      background_image: entity?.background_image || '',
      icon: entity?.icon || ''
    };
  }

  _getSortModeOptions() {
    return [
      { value: TodoSortMode.NONE, label: 'Default' },
      { value: TodoSortMode.ALPHA_ASC, label: 'Alphabetical A-Z' },
      { value: TodoSortMode.ALPHA_DESC, label: 'Alphabetical Z-A' },
      { value: TodoSortMode.DUEDATE_ASC, label: 'Due Date (Earliest First)' },
      { value: TodoSortMode.DUEDATE_DESC, label: 'Due Date (Latest First)' }
    ];
  }

  /**
   * Handle expand button click with proper event handling
   * @param {Event} e - Click event
   * @param {number} index - Row index
   */
  _handleExpandClick(e, index) {
    e.stopPropagation(); // Prevent row click from firing
    this._toggleExpanded(index);
  }

  /**
   * Handle action button clicks (move up/down, delete) with proper event handling
   * @param {Event} e - Click event
   * @param {Function} action - Action to perform
   */
  _handleActionClick(e, action) {
    e.stopPropagation(); // Prevent row click from firing
    action(); // Execute the specific action (move or delete)
  }

  /**
   * Handle keyboard navigation for clickable rows
   * @param {KeyboardEvent} e - Keyboard event
   * @param {number} index - Row index
   */
  _handleRowKeydown(e, index) {
    // Handle Enter or Space key to toggle expansion
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      this._toggleExpanded(index);
    }
  }

  /**
   * Enhanced stop propagation method
   * @param {Event} e - Event to stop
   */
  _stopPropagation(e) {
    e.stopPropagation();
    e.preventDefault(); // Also prevent default to be extra safe
  }

  render() {
    if (!this.hass || !this._config) {
      return x`<div>Loading...</div>`;
    }

    const entities = Array.isArray(this._config.entities) ? this._config.entities : [];
    debugLog('Rendering editor with config:', JSON.stringify(this._config));
    debugLog('Current entities:', entities);

    return x`
      <div class="card-config">
        <!-- Todo Lists Section -->
        <div class="section">
          <div class="section-header">Todo Lists</div>

          <div class="card-list">
            ${entities.length === 0
              ? x`<div class="no-cards">
                  No todo lists added yet. Click "+ ADD TODO LIST" below to add your first list.
                </div>`
              : entities.map((entity, index) => {
                  const descriptor = this._getEntityDescriptor(entity);
                  const isExpanded = this._expandedEntities.has(index);
                  const entityConfig = this._getEntityConfigAtIndex(index);

                  return x`
                    <div
                      class="card-row clickable-row ${isExpanded ? 'expanded' : ''}"
                      data-index=${index}
                      @click=${() => this._toggleExpanded(index)}
                      role="button"
                      tabindex="0"
                      aria-expanded=${isExpanded}
                      aria-label="Todo list ${index +
                      1}: ${descriptor.displayName}. Click to ${isExpanded ? 'collapse' : 'expand'}"
                      @keydown=${(e) => this._handleRowKeydown(e, index)}
                    >
                      <div class="card-info">
                        <ha-icon-button
                          class="expand-button leading"
                          label=${isExpanded ? 'Collapse' : 'Expand'}
                          path=${isExpanded
                            ? 'M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z'
                            : 'M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z'}
                          @click=${(e) => this._handleExpandClick(e, index)}
                        ></ha-icon-button>
                        <span class="card-index">${index + 1}</span>
                        <span class="card-type">${descriptor.displayName}</span>
                        ${entityConfig.entity && entityConfig.entity.trim() !== ''
                          ? x`<span class="card-name">(${entityConfig.entity})</span>`
                          : x`<span class="card-name" style="color: var(--error-color);"
                              >(Not configured)</span
                            >`}
                      </div>
                      <div class="card-actions" @click=${this._stopPropagation}>
                        <ha-icon-button
                          label="Move Up"
                          ?disabled=${index === 0}
                          path="M7,15L12,10L17,15H7Z"
                          @click=${(e) =>
                            this._handleActionClick(e, () => this._moveEntity(index, -1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Move Down"
                          ?disabled=${index === entities.length - 1}
                          path="M7,9L12,14L17,9H7Z"
                          @click=${(e) =>
                            this._handleActionClick(e, () => this._moveEntity(index, 1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Delete Todo List"
                          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                          @click=${(e) =>
                            this._handleActionClick(e, () => this._removeEntity(index))}
                          style="color: var(--error-color);"
                        ></ha-icon-button>
                      </div>
                    </div>
                    ${isExpanded
                      ? x`
                          <div class="expanded-content">
                            <ha-entity-picker
                              .hass=${this.hass}
                              .value=${entityConfig.entity}
                              .includeDomains=${['todo']}
                              .includeEntities=${this._getAvailableEntities(index)}
                              data-index=${index}
                              @value-changed=${this._entityChanged}
                              allow-custom-entity
                              label="Todo Entity"
                            ></ha-entity-picker>

                            ${entityConfig.entity && entityConfig.entity.trim() !== ''
                              ? x`
                                  <div
                                    style="margin: 8px 0; background: var(--secondary-background-color); border-radius: 4px;"
                                  >
                                    <div class="toggle-option" style="margin: 8px 0;">
                                      <div class="toggle-option-label">Show Title</div>
                                      <ha-switch
                                        .checked=${entityConfig.show_title}
                                        data-index=${index}
                                        @change=${this._entityTitleEnabledChanged}
                                      ></ha-switch>
                                    </div>

                                    ${entityConfig.show_title
                                      ? x`
                                          <ha-textfield
                                            label="Title Text"
                                            .value=${entityConfig.title}
                                            data-index=${index}
                                            @input=${this._entityTitleTextChanged}
                                            style="width: 100%; margin-top: 8px;"
                                          ></ha-textfield>
                                        `
                                      : ''}
                                  </div>

                                  <ha-select
                                    .label=${'Display Order'}
                                    .value=${entityConfig.display_order}
                                    data-index=${index}
                                    @selected=${this._entityDisplayOrderChanged}
                                    @closed=${this._stopPropagation}
                                    style="margin-bottom: 4px;"
                                  >
                                    ${this._getSortModeOptions().map(
                                      (option) => x`
                                        <mwc-list-item .value=${option.value}>
                                          ${option.label}
                                        </mwc-list-item>
                                      `
                                    )}
                                  </ha-select>

                                  <ha-textfield
                                    label="Background Image URL"
                                    .value=${entityConfig.background_image}
                                    data-index=${index}
                                    @input=${this._entityBackgroundImageChanged}
                                    style="width: 100%; margin-top: 4px;"
                                    placeholder="Optional: e.g. /local/images/background.jpg"
                                  ></ha-textfield>

                                  ${this._show_icons
                                    ? x`
                                        <ha-textfield
                                          label="Custom Icon"
                                          .value=${entityConfig.icon}
                                          data-index=${index}
                                          @input=${this._entityIconChanged}
                                          style="width: 100%; margin-top: 8px;"
                                          placeholder="Optional: e.g. mdi:cart-variant"
                                        ></ha-textfield>
                                      `
                                    : ''}
                                `
                              : ''}
                          </div>
                        `
                      : ''}
                  `;
                })}
          </div>

          <div class="add-entity-button">
            <button
              class="add-todo-button ${this._buttonFeedbackState !== 'normal'
                ? this._buttonFeedbackState
                : ''}"
              @click=${(e) => this._addEntity(e)}
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
              .value=${this._card_spacing}
              @change=${this._cardSpacingChanged}
              data-config-value="card_spacing"
              suffix="px"
            ></ha-textfield>
            <div class="spacing-help-text">Visual gap between cards when swiping (in pixels)</div>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show pagination dots</div>
            <ha-switch
              .checked=${this._show_pagination}
              data-config-value="show_pagination"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show icons</div>
            <ha-switch
              .checked=${this._show_icons}
              data-config-value="show_icons"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show 'Add item' field</div>
            <ha-switch
              .checked=${this._show_create}
              data-config-value="show_create"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          ${this._show_create
            ? x`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show '+' add button next to field</div>
                    <ha-switch
                      .checked=${this._show_addbutton}
                      data-config-value="show_addbutton"
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </div>

                  <div class="toggle-option">
                    <div class="toggle-option-label">Enable search functionality</div>
                    <ha-switch
                      .checked=${this._enable_search}
                      data-config-value="enable_search"
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </div>
                </div>
              `
            : ''}

          <div class="toggle-option">
            <div class="toggle-option-label">Show completed items</div>
            <ha-switch
              .checked=${this._show_completed}
              data-config-value="show_completed"
              @change=${this._valueChanged}
            ></ha-switch>
          </div>

          ${this._show_completed
            ? x`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show 'Delete completed' button</div>
                    <ha-switch
                      .checked=${this._show_completed_menu}
                      data-config-value="show_completed_menu"
                      @change=${this._valueChanged}
                    ></ha-switch>
                  </div>

                  ${this._show_completed_menu
                    ? x`
                        <div class="nested-toggle-option">
                          <div class="toggle-option">
                            <div class="toggle-option-label">Show delete confirmation dialog</div>
                            <ha-switch
                              .checked=${this._delete_confirmation}
                              data-config-value="delete_confirmation"
                              @change=${this._valueChanged}
                            ></ha-switch>
                          </div>
                        </div>
                      `
                    : ''}
                </div>
              `
            : ''}
        </div>

        <!-- Version Display with GitHub Link -->
        <div class="version-display">
          <div class="version-text">Todo Swipe Card</div>
          <div class="version-badges">
            <div class="version-badge">v${VERSION}</div>
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
    `;
  }
}

// Define custom elements
customElements.define('todo-swipe-card', TodoSwipeCard);
customElements.define('todo-swipe-card-editor', TodoSwipeCardEditor);

// Add card to UI picker
if (!window.customCards) {
  window.customCards = [];
}

// Ensure registration happens only once
let registered = window.customCards.some((card) => card.type === 'todo-swipe-card');
if (!registered) {
  window.customCards.push({
    type: 'todo-swipe-card',
    name: 'Todo Swipe Card',
    preview: true, // Enable preview
    description: 'A specialized swipe card for to-do lists'
  });
  debugLog('Todo Swipe Card registered in customCards');
}

// Version logging
console.info(
  `%c TODO-SWIPE-CARD %c v${VERSION} %c - A swipeable card for to-do lists`,
  'color: white; background: #4caf50; font-weight: 700;',
  'color: #4caf50; background: white; font-weight: 700;',
  'color: grey; background: white; font-weight: 400;'
);

export { TodoSwipeCard, TodoSwipeCardEditor };
