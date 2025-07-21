const t="3.1.0",e="none",o="alpha_asc",i="alpha_desc",n="duedate_asc",r="duedate_desc",a=(t,e)=>{};let s,d,c,l;try{if(window.customElements&&window.customElements.get("ha-card")){const t=customElements.get("ha-card").__proto__.constructor.__proto__.constructor;s=t,d=window.lit?.html||window.LitElement?.html,c=window.lit?.css||window.LitElement?.css}}catch(t){t.message}if(!s||!d||!c){const t=async()=>{try{const t=["https://cdn.jsdelivr.net/npm/lit-element@2.5.1/+esm","https://unpkg.com/lit-element@2.5.1/lit-element.js?module","https://cdn.skypack.dev/lit-element@2.5.1"];let e=!1;for(const o of t)try{a();const t=await import(o);s=t.LitElement,d=t.html,c=t.css,e=!0,a();break}catch(t){console.warn(`TodoSwipeCard: Failed to load from ${o}:`,t.message)}if(!e)throw new Error("Could not load LitElement from any CDN source")}catch(t){console.error("TodoSwipeCard: All LitElement loading attempts failed:",t),s=HTMLElement,d=(t,...e)=>t.reduce((t,o,i)=>t+o+(e[i]||""),""),c=t=>t[0]}};try{await t()}catch(t){s=HTMLElement,d=(t,...e)=>t.reduce((t,o,i)=>t+o+(e[i]||""),""),c=t=>t[0]}}try{if(window.customCards&&window.fireEvent)l=window.fireEvent;else{l=(await import("https://unpkg.com/custom-card-helpers@^1?module")).fireEvent}}catch(t){l=(t,e,o={})=>{const i=new CustomEvent(e,{detail:o,bubbles:!0,composed:!0});t.dispatchEvent(i)}}function h(t,e,o){let i="mdi:format-list-checks";if("object"==typeof t&&t.icon)i=t.icon;else if(o&&o.states[e]){const t=o.states[e].attributes.icon;t&&(i=t)}const n=document.createElement("ha-icon");return n.className="todo-icon",n.icon=i,n}function p(t){const e=document.createElement("div"),o=function(t){if(!t)return null;try{if(t.includes("T"))return new Date(t);{const e=new Date(`${t}T00:00:00`);return e.setHours(23,59,59,999),isNaN(e.getTime())?null:e}}catch(t){return null}}(t),i=new Date,n=o&&o<i;e.className="todo-due "+(n?"overdue":"");const r=document.createElement("ha-svg-icon");if(r.className="todo-due-icon",r.path="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z",e.appendChild(r),o){if(!t.includes("T")&&(a=new Date,s=o,a.getFullYear()===s.getFullYear()&&a.getMonth()===s.getMonth()&&a.getDate()===s.getDate())){const t=document.createElement("span");t.textContent="Today",e.appendChild(t)}else{if(Math.abs(o.getTime()-i.getTime())<36e5){const t=document.createElement("span");e.appendChild(t);const i=()=>{const i=new Date,n=o.getTime()-i.getTime(),r=n<0;if(e.classList.toggle("overdue",r),Math.abs(n)<6e4){const e=Math.round(Math.abs(n)/1e3);t.textContent=e<5?"now":n<0?`${e} seconds ago`:`in ${e} seconds`}else{const e=Math.round(Math.abs(n)/6e4);t.textContent=n<0?`${e} minute${1!==e?"s":""} ago`:`in ${e} minute${1!==e?"s":""}`}};i();const n=setInterval(i,1e3),r=new MutationObserver(t=>{t.forEach(t=>{"childList"===t.type&&t.removedNodes.forEach(t=>{(t===e||t.contains?.(e))&&(clearInterval(n),r.disconnect())})})});e.parentNode&&r.observe(e.parentNode,{childList:!0,subtree:!0})}else{const t=document.createElement("ha-relative-time");t.setAttribute("capitalize",""),t.datetime=o,e.appendChild(t)}}}else{const o=document.createElement("span");o.textContent=t,e.appendChild(o)}var a,s;return e}function u(t,e,o){setTimeout(()=>{!function(t,e,o){let i;i=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .add-textfield input"):t.querySelector(".add-textfield input");if(!i)return;if(o.t.has(e)){const t=o.t.get(e);t.inputHandler&&i.removeEventListener("input",t.inputHandler)}const n=i=>function(t,e,o,i){const n=t.target.value;i.o=n,""===n.trim()?i.i.delete(e):i.i.set(e,n);i.cardBuilder.updateNativeTodoCard(o,e)}(i,e,t,o);i.addEventListener("input",n),o.t.set(e,{inputHandler:n,inputElement:i})}(t,e,o)},100)}function m(t){if(!t.paginationElement)return;let e="";if(t.l.card_mod&&t.l.card_mod.style&&"string"==typeof t.l.card_mod.style){const o=t.l.card_mod.style;["--todo-swipe-card-pagination-dot-inactive-color","--todo-swipe-card-pagination-dot-active-color","--todo-swipe-card-pagination-dot-size","--todo-swipe-card-pagination-dot-border-radius","--todo-swipe-card-pagination-dot-spacing","--todo-swipe-card-pagination-bottom","--todo-swipe-card-pagination-right","--todo-swipe-card-pagination-background","--todo-swipe-card-pagination-dot-active-size-multiplier","--todo-swipe-card-pagination-dot-active-opacity","--todo-swipe-card-pagination-dot-inactive-opacity"].forEach(t=>{const i=new RegExp(`${t}\\s*:\\s*([^;]+)`,"i"),n=o.match(i);n&&n[1]&&(e+=`${t}: ${n[1].trim()};\n`)})}if(e){t.paginationElement.style.cssText+=e;const o=t.paginationElement.querySelectorAll(".pagination-dot");requestAnimationFrame(()=>{o.forEach(t=>{t.style.borderRadius="var(--todo-swipe-card-pagination-dot-border-radius, 50%)",t.style.margin="0 var(--todo-swipe-card-pagination-dot-spacing, 4px)",t.classList.contains("active")?(t.style.width="calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))",t.style.height="calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1))"):(t.style.width="var(--todo-swipe-card-pagination-dot-size, 8px)",t.style.height="var(--todo-swipe-card-pagination-dot-size, 8px)")})})}}async function g(t,e){if(!e?.connection)return()=>{};try{return e.connection.subscribeMessage(e=>{const o=new CustomEvent("todo-items-updated",{detail:{entityId:t,items:e.items||[]},bubbles:!0,composed:!0});document.dispatchEvent(o)},{type:"todo/item/subscribe",entity_id:t})}catch(t){return()=>{}}}async function f(t,e){if(!e)return[];try{const o=await e.callWS({type:"todo/item/list",entity_id:t});return o.items||[]}catch(t){return[]}}function v(t,e,o){o&&t&&e&&o.callService("todo","add_item",{entity_id:t,item:e})}function w(t,e,o,i){i&&t&&e&&(i.callService("todo","update_item",{entity_id:t,item:e.uid,status:o?"completed":"needs_action"}),e.summary)}async function x(t,e,o,i){if(!i)return;const n={entity_id:t,item:e.uid,rename:o.summary};void 0!==o.completed&&(n.status=o.completed?"completed":"needs_action"),void 0!==o.description&&(n.description=o.description||null),void 0!==o.dueDate&&(o.dueDate&&""!==o.dueDate.trim()?o.dueDate.includes("T")?n.due_datetime=o.dueDate:n.due_date=o.dueDate:e.due&&e.due.includes("T")?n.due_datetime=null:n.due_date=null),await i.callService("todo","update_item",n),e.summary,o.summary}async function b(t,e,o){if(!o)return;const i={entity_id:t,item:e.summary};e.description&&(i.description=e.description),void 0!==e.dueDate&&(i.due_date=e.dueDate||null),await o.callService("todo","add_item",i),e.summary}function y(t,e,o){o&&(o.callService("todo","remove_item",{entity_id:t,item:e.uid}),e.summary)}function k(t,e){e&&e.callService("todo","remove_completed_items",{entity_id:t})}function _(t,e,o){const i=[...t],n=i.filter(t=>"completed"===t.status),r=i.filter(t=>"completed"!==t.status);let a=r,s=n;if(e&&"none"!==e){const t=function(t,e){switch(t){case"alpha_asc":return(t,o)=>t.summary.localeCompare(o.summary,e?.locale?.language);case"alpha_desc":return(t,o)=>o.summary.localeCompare(t.summary,e?.locale?.language);case"duedate_asc":return(t,e)=>{const o=$(t.due),i=$(e.due);return o||i?o?i?o.getTime()-i.getTime():-1:1:0};case"duedate_desc":return(t,e)=>{const o=$(t.due),i=$(e.due);return o||i?o?i?i.getTime()-o.getTime():-1:1:0};default:return()=>0}}(e,o);a=r.sort(t),s=n.sort(t)}return[...a,...s]}function $(t){if(!t)return null;try{if(t.includes("T"))return new Date(t);{const e=new Date(`${t}T23:59:59`);return isNaN(e.getTime())?null:e}}catch(t){return null}}function z(t,e,o,i,n){const r=document.createElement("div");r.className="todo-item "+("completed"===t.status?"completed":"");const a=document.createElement("ha-checkbox");a.className="todo-checkbox",a.checked="completed"===t.status,a.addEventListener("change",i=>{i.stopPropagation(),o(e,t,i.target.checked)}),r.appendChild(a);const s=document.createElement("div");s.className="todo-content";const d=document.createElement("div");if(d.className="todo-summary",d.textContent=t.summary,s.appendChild(d),t.description){const e=document.createElement("div");e.className="todo-description",e.textContent=t.description,s.appendChild(e)}if(t.due){const e=p(t.due),o=e.querySelector("ha-relative-time");o&&n&&(o.hass=n),s.appendChild(e)}r.appendChild(s);let c=0,l=0,h=0,u=!1;const m=t=>{t.target===a||a.contains(t.target)||(u=!1,h=Date.now(),"touchstart"===t.type?(c=t.touches[0].clientX,l=t.touches[0].clientY):(c=t.clientX,l=t.clientY))},g=t=>{if(!u){let e,o;"touchmove"===t.type?(e=t.touches[0].clientX,o=t.touches[0].clientY):(e=t.clientX,o=t.clientY);const i=Math.abs(e-c),n=Math.abs(o-l);(i>10||n>10)&&(u=!0)}},f=o=>{if(o.target===a||a.contains(o.target))return;const n=Date.now()-h;!u&&n<1e3&&setTimeout(()=>{i(e,t)},10)};return r.addEventListener("touchstart",m,{passive:!0}),r.addEventListener("touchmove",g,{passive:!0}),r.addEventListener("touchend",f,{passive:!0}),r.addEventListener("mousedown",m),r.addEventListener("mousemove",g),r.addEventListener("mouseup",f),r.addEventListener("click",o=>{o.target===a||a.contains(o.target)||!u&&Date.now()-h<100&&(o.preventDefault(),o.stopPropagation(),i(e,t))}),r}function T(t,e){return 0!==((t.attributes?.supported_features||0)&e)}var C=/*#__PURE__*/Object.freeze({__proto__:null,addTodoItem:v,addTodoItemFromDialog:b,createTodoItemElement:z,deleteCompletedItems:k,deleteTodoItemFromDialog:y,entitySupportsFeature:T,fetchTodoItems:f,sortTodoItems:_,subscribeToTodoItems:g,toggleTodoItem:w,updateTodoItemFromDialog:x});class E{constructor(t){this.cardInstance=t,this.currentDialog=null,this.dialogOpenTime=0}get h(){return this.cardInstance.h}get l(){return this.cardInstance.l}editTodoItem(t,e){const o=Date.now();o-this.dialogOpenTime<300||(this.dialogOpenTime=o,e.summary,this.showTodoItemEditDialog(t,e))}showTodoItemEditDialog(t,e=void 0){this.closeCurrentDialog();const o=document.createElement("ha-dialog");o.heading=e?"Edit item":"Add Todo Item",o.open=!0,o.style.setProperty("--mdc-dialog-min-width","min(600px, 95vw)"),o.style.setProperty("--mdc-dialog-max-width","min(600px, 95vw)"),o.setAttribute("role","dialog"),o.setAttribute("aria-labelledby","dialog-title"),o.setAttribute("aria-modal","true"),this.currentDialog=o;const i=document.createElement("div");i.style.cssText="\n      padding: 8px 0;\n      display: flex;\n      flex-direction: column;\n      gap: 16px;\n    ";const n=this.h?.states?.[t],r=(n&&T(n,64),n&&(T(n,16)||T(n,32))),a=n&&T(n,2),s=document.createElement("div");s.style.cssText="display: flex; align-items: flex-start; gap: 8px;";let d=null;e&&(d=document.createElement("ha-checkbox"),d.checked="completed"===e.status,d.style.marginTop="8px",s.appendChild(d));const c=document.createElement("ha-textfield");c.label="Task name",c.value=e?.summary||"",c.required=!0,c.style.flexGrow="1",c.dialogInitialFocus=!0,c.validationMessage="Task name is required",s.appendChild(c),i.appendChild(s);let l=null;l=document.createElement("ha-textfield"),l.label="Description",l.value=e?.description||"",l.setAttribute("type","textarea"),l.setAttribute("rows","3"),l.style.cssText="\n        width: 100%;\n        display: block;\n        margin-bottom: 16px;\n      ",i.appendChild(l);let h=null,p=null;if(r){const t=document.createElement("div"),o=document.createElement("span");o.className="label",o.textContent="Due date:",o.style.cssText="\n        font-size: var(--ha-font-size-s, 12px);\n        font-weight: var(--ha-font-weight-medium, 500);\n        color: var(--input-label-ink-color, var(--primary-text-color));\n        display: block;\n        margin-bottom: 8px;\n      ",t.appendChild(o);const r=document.createElement("div");r.className="flex",r.style.cssText="\n        display: flex;\n        justify-content: space-between;\n        gap: 16px;\n      ";let a="",s="";if(e?.due)try{const t=new Date(e.due);isNaN(t.getTime())||(a=t.toISOString().split("T")[0],e.due.includes("T")&&(s=t.toTimeString().split(" ")[0].substring(0,5)))}catch(t){}const d=document.createElement("div");d.style.cssText="flex-grow: 1; position: relative;",h=document.createElement("input"),h.type="date",h.value=a,h.style.cssText="\n        width: 100%;\n        height: 56px;\n        padding: 20px 12px 6px 12px;\n        border: none;\n        border-bottom: 1px solid var(--divider-color);\n        border-radius: 0;\n        background: transparent;\n        color: var(--primary-text-color);\n        font-family: var(--mdc-typography-subtitle1-font-family, inherit);\n        font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n        line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);\n        box-sizing: border-box;\n        outline: none;\n        transition: border-bottom-color 0.15s ease;\n        cursor: pointer;\n        -webkit-appearance: none;\n        -moz-appearance: textfield;\n      ";const c=document.createElement("div");c.style.cssText="\n        position: relative;\n        background: var(--mdc-text-field-fill-color, #f5f5f5);\n        border-radius: 4px 4px 0 0;\n        min-height: 56px;\n        display: flex;\n        align-items: center;\n      ";const l=document.createElement("span");l.textContent="Due Date",l.style.cssText="\n        position: absolute;\n        left: 12px;\n        top: 8px;\n        font-size: 12px;\n        color: var(--secondary-text-color);\n        pointer-events: none;\n        transition: all 0.2s ease;\n      ";const u=document.createElement("button");if(u.type="button",u.innerHTML="×",u.style.cssText=`\n        position: absolute;\n        right: 36px;\n        top: 50%;\n        transform: translateY(-50%);\n        background: none;\n        border: none;\n        color: var(--secondary-text-color);\n        font-size: 18px;\n        cursor: pointer;\n        padding: 4px;\n        border-radius: 50%;\n        width: 20px;\n        height: 20px;\n        display: ${a?"flex":"none"};\n        align-items: center;\n        justify-content: center;\n        z-index: 2;\n      `,u.addEventListener("click",t=>{t.preventDefault(),t.stopPropagation(),h.value="",u.style.display="none",p&&(p.value="")}),h.addEventListener("input",()=>{u.style.display=h.value?"flex":"none"}),c.appendChild(l),c.appendChild(h),c.appendChild(u),d.appendChild(c),r.appendChild(d),T(n,32)){const t=document.createElement("div");t.style.cssText="position: relative; min-width: 120px;";const e=document.createElement("div");e.style.cssText="\n          position: relative;\n          background: var(--mdc-text-field-fill-color, #f5f5f5);\n          border-radius: 4px 4px 0 0;\n          min-height: 56px;\n          display: flex;\n          align-items: center;\n        ",p=document.createElement("input"),p.type="time",p.value=s,p.style.cssText="\n          width: 100%;\n          height: 56px;\n          padding: 20px 12px 6px 12px;\n          border: none;\n          border-bottom: 1px solid var(--divider-color);\n          border-radius: 0;\n          background: transparent;\n          color: var(--primary-text-color);\n          font-family: var(--mdc-typography-subtitle1-font-family, inherit);\n          font-size: var(--mdc-typography-subtitle1-font-size, 1rem);\n          line-height: var(--mdc-typography-subtitle1-line-height, 1.75rem);\n          box-sizing: border-box;\n          outline: none;\n          transition: border-bottom-color 0.15s ease;\n          -webkit-appearance: none;\n          -moz-appearance: textfield;\n        ";const o=document.createElement("span");o.textContent="Time",o.style.cssText="\n          position: absolute;\n          left: 12px;\n          top: 8px;\n          font-size: 12px;\n          color: var(--secondary-text-color);\n          pointer-events: none;\n          transition: all 0.2s ease;\n        ",e.appendChild(o),e.appendChild(p),t.appendChild(e),r.appendChild(t)}t.appendChild(r),i.appendChild(t)}if(setTimeout(()=>{const t=o.querySelectorAll("ha-textfield, ha-checkbox, input, button, mwc-button");if(0===t.length)return;const e=t[0],i=t[t.length-1];o.addEventListener("keydown",t=>{"Tab"===t.key&&(t.shiftKey&&document.activeElement===e?(t.preventDefault(),i.focus()):t.shiftKey||document.activeElement!==i||(t.preventDefault(),e.focus()))})},100),o.appendChild(i),e&&a){const i=document.createElement("mwc-button");i.slot="secondaryAction",i.textContent="Delete item",i.style.setProperty("--mdc-theme-primary","var(--error-color)"),i.style.setProperty("--mdc-button-ink-color","var(--error-color)"),i.style.color="var(--error-color)",i.addEventListener("click",async()=>{await this.showDeleteConfirmationDialog(e.summary)&&(y(t,e,this.h),this.closeDialog(o))}),o.appendChild(i)}const u=document.createElement("mwc-button");u.slot="primaryAction",u.textContent="Cancel",u.addEventListener("click",()=>{this.closeDialog(o)}),o.appendChild(u);const m=e?"Save item":"Add",g=document.createElement("mwc-button");g.slot="primaryAction",g.textContent=m,g.addEventListener("click",async()=>{const i=c.value.trim();if(!i)return void c.reportValidity();let n="";if(h?.value)if(p?.value){const t=`${h.value}T${p.value}:00`;try{n=new Date(t).toISOString()}catch(t){console.error("Invalid date/time combination"),n=h.value}}else n=h.value;await this.handleDialogSave(t,e,{summary:i,description:l?.value,completed:d?.checked||!1,dueDate:n})&&this.closeDialog(o)}),o.appendChild(g),c.addEventListener("keydown",i=>{if("Enter"===i.key){i.preventDefault();const n=c.value.trim();if(n){let r="";if(h?.value)if(p?.value){const t=`${h.value}T${p.value}:00`;try{r=new Date(t).toISOString()}catch(i){console.error("Invalid date/time combination"),r=h.value}}else r=h.value;this.handleDialogSave(t,e,{summary:n,description:l?.value,completed:d?.checked||!1,dueDate:r}).then(t=>{t&&this.closeDialog(o)})}}}),o.addEventListener("closed",()=>{this.onDialogClosed(o)}),document.body.appendChild(o),setTimeout(()=>{c.focus()},100)}closeDialog(t){t&&t.open&&(t.open=!1,t.close())}closeCurrentDialog(){this.currentDialog&&(this.closeDialog(this.currentDialog),this.currentDialog=null)}onDialogClosed(t){t.parentNode&&t.parentNode.removeChild(t),this.currentDialog===t&&(this.currentDialog=null)}async handleDialogSave(t,e,o){if(!o.summary)return!1;try{return e?await x(t,e,o,this.h):await b(t,o,this.h),!0}catch(t){return!1}}async showDeleteConfirmationDialog(t){return new Promise(e=>{const o=document.createElement("ha-dialog");o.heading="Confirm Deletion",o.open=!0;const i=document.createElement("div");i.style.padding="16px",i.textContent=`Are you sure you want to delete "${t}"?`,o.appendChild(i);const n=document.createElement("mwc-button");n.slot="primaryAction",n.textContent="Delete",n.style.color="var(--error-color)",n.addEventListener("click",()=>{o.close(),e(!0)});const r=document.createElement("mwc-button");r.slot="secondaryAction",r.textContent="Cancel",r.addEventListener("click",()=>{o.close(),e(!1)}),o.appendChild(n),o.appendChild(r),o.addEventListener("closed",()=>{o.parentNode&&o.parentNode.removeChild(o),e(!1)}),document.body.appendChild(o)})}showDeleteCompletedConfirmation(t){const e=document.createElement("ha-dialog");e.heading="Confirm Deletion",e.open=!0;const o=document.createElement("div");o.innerText="Are you sure you want to delete all completed items from the list?",e.appendChild(o);const i=document.createElement("mwc-button");i.slot="primaryAction",i.label="Confirm",i.style.color="var(--primary-color)",i.setAttribute("aria-label","Confirm"),i.addEventListener("click",()=>{this.closeDialog(e),Promise.resolve().then(function(){return C}).then(e=>{e.deleteCompletedItems(t,this.h)})});const n=document.createElement("mwc-button");n.slot="secondaryAction",n.label="Cancel",n.setAttribute("aria-label","Cancel"),n.addEventListener("click",()=>{this.closeDialog(e)}),e.appendChild(i),e.appendChild(n),e.addEventListener("closed",()=>{e.parentNode&&e.parentNode.removeChild(e)}),document.body.appendChild(e)}}class D{constructor(t){this.cardInstance=t}get h(){return this.cardInstance.h}get l(){return this.cardInstance.l}p(t){return"string"==typeof t?t:t?.entity||""}u(t){if(!this.l?.entities)return null;const e=this.l.entities.find(e=>this.p(e)===t);return"string"==typeof e?{entity:t}:e||null}async createNativeTodoCards(){if(!this.cardInstance.sliderElement)return;if(this.cardInstance.m)return;const t=this.cardInstance.sliderElement;for(let e=0;e<this.l.entities.length;e++){if(this.cardInstance.m)return;const o=this.l.entities[e],i=this.p(o);if(!i||""===i.trim())continue;if(this.cardInstance.sliderElement!==t)return;if(!this.cardInstance.sliderElement)return;const n=document.createElement("div");n.className="slide";try{const r=await this.createNativeTodoCard(o);if(this.cardInstance.m)return void a();if(this.cardInstance.cards[e]={element:r,slide:n,entityId:i,entityConfig:o},n.appendChild(r),this.l.show_completed&&this.l.show_completed_menu){const t=this.cardInstance.v(i,o);n.appendChild(t)}if(this.l.show_icons){const t=h(o,i,this.h);n.appendChild(t)}if(!this.cardInstance.sliderElement||this.cardInstance.sliderElement!==t||this.cardInstance.m)return void a();this.cardInstance.sliderElement.appendChild(n),a()}catch(o){if(!this.cardInstance.m){console.error(`Error creating native todo card ${e}:`,i,o);const r=document.createElement("div");r.style.cssText="color: red; background: white; padding: 16px; border: 1px solid red; height: 100%; box-sizing: border-box;",r.textContent=`Error creating card: ${o.message||o}. Check console for details.`,n.appendChild(r),this.cardInstance.sliderElement&&this.cardInstance.sliderElement===t&&this.cardInstance.sliderElement.appendChild(n),this.cardInstance.cards[e]={error:!0,slide:n}}}}this.cardInstance.cards=this.cardInstance.cards.filter(Boolean),this.cardInstance.cards.length}async createNativeTodoCard(t){const e=this.p(t);this.cardInstance.k||(this.cardInstance.k=new Map),this.cardInstance._||(this.cardInstance._=new Map);const o=document.createElement("div");o.className="native-todo-card","object"==typeof t&&t.background_image&&(o.style.backgroundImage=`url('${t.background_image}')`,o.style.backgroundPosition="center center",o.style.backgroundRepeat="no-repeat",o.style.backgroundSize="cover");let i=o;const n="object"==typeof t&&t.show_title||!1,r="object"==typeof t&&t.title||"";if(n&&r&&(i=function(t,e){const o=document.createElement("div");o.className="todo-card-with-title-wrapper";const i=document.createElement("div");i.className="todo-swipe-card-external-title",i.textContent=e;const n=document.createElement("div");return n.className="todo-card-container",o.appendChild(i),n.appendChild(t),o.appendChild(n),o}(o,r)),this.l.show_create){const t=this.createAddRow(e);o.appendChild(t)}const a=document.createElement("div");if(a.className="todo-list",o.appendChild(a),this.l.enable_search&&this.l.show_create&&u(o,e,this.cardInstance),this.h){const t=this.cardInstance._.get(e);if(t&&"function"==typeof t)try{t()}catch(t){}const o=await g(e,this.h);this.cardInstance._.set(e,o),setTimeout(async()=>{await this.updateNativeTodoCard(i,e)},100)}return i}createAddRow(t){const e=document.createElement("div");e.className="add-row";const o=document.createElement("div");o.className="add-textfield";const i=document.createElement("input");if(i.type="text",i.placeholder=this.l.enable_search?"Type to search / add":"Add item",i.addEventListener("keydown",e=>{if("Enter"===e.key){const o=i.value.trim();o&&(this.l.enable_search?function(t,e,o,i,n){if(t.key,"Enter"===t.key){t.preventDefault(),t.stopPropagation();const o=i.value.trim();if(o){n.i.delete(e),n.o="",i.value="",Array.from(n.i.keys());const t=n.h?.states?.[e];(t?.attributes?.items||[]).some(t=>t.summary.toLowerCase()===o.toLowerCase())||n.$(e,o)}}else"Escape"===t.key&&(i.value="",n.o="",n.i.delete(e),n.cardBuilder.updateNativeTodoCard(o,e))}(e,t,i.closest(".native-todo-card")||i.closest(".todo-card-with-title-wrapper"),i,this.cardInstance):(this.cardInstance.$(t,o),i.value="",i.focus()))}else if("Escape"===e.key&&this.l.enable_search){i.value="",this.cardInstance.i.delete(t),this.cardInstance.o="";const e=i.closest(".native-todo-card")||i.closest(".todo-card-with-title-wrapper");e&&this.updateNativeTodoCard(e,t)}}),o.appendChild(i),e.appendChild(o),this.l.show_addbutton){const o=document.createElement("button");o.className="add-button",o.title="Add item",o.innerHTML='\n       <svg viewBox="0 0 24 24">\n         <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />\n       </svg>\n     ',o.addEventListener("click",()=>{const e=i.value.trim();if(e){if(this.l.enable_search){this.cardInstance.i.delete(t),this.cardInstance.o="",i.value="";const o=this.cardInstance.h?.states?.[t];(o?.attributes?.items||[]).some(t=>t.summary.toLowerCase()===e.toLowerCase())||this.cardInstance.$(t,e);const n=i.closest(".native-todo-card")||i.closest(".todo-card-with-title-wrapper");n&&this.updateNativeTodoCard(n,t)}else this.cardInstance.$(t,e),i.value="";i.focus()}}),e.appendChild(o)}return e}async updateNativeTodoCard(t,e){if(!this.h||!e)return;const o=this.h.states[e];if(!o)return;let i=[];try{i=await f(e,this.h),i.length,this.cardInstance.k||(this.cardInstance.k=new Map),this.cardInstance.k.set(e,i)}catch(t){this.cardInstance.k&&this.cardInstance.k.has(e)?(i=this.cardInstance.k.get(e)||[],i.length):(i=o.attributes?.items||[],i.length)}let n=null;if(n=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .todo-list"):(t.classList.contains("native-todo-card"),t.querySelector(".todo-list")),!n){let e=t;if(t.classList.contains("todo-card-with-title-wrapper")&&(e=t.querySelector(".native-todo-card")),!e)return;n=document.createElement("div"),n.className="todo-list",e.appendChild(n)}const r=this.u(e),a=_(i,r?.display_order,this.h),s=this.cardInstance.i.get(e)||"",d=s&&""!==s.trim(),c=d?a.filter(t=>function(t,e){if(!e)return!0;try{const o=new RegExp(e,"i");return o.test(t.summary)||t.description&&o.test(t.description)}catch(o){const i=e.toLowerCase();return t.summary.toLowerCase().includes(i)||t.description&&t.description.toLowerCase().includes(i)}}(t,s)):a;c.length,i.length,n.innerHTML="",c.length>0&&c.forEach((t,o)=>{try{const o=z(t,e,this.cardInstance.T,this.cardInstance.C,this.h);this.l.show_completed||"completed"!==t.status||d||(o.style.display="none"),n.appendChild(o)}catch(e){console.error(`Error creating item element ${o}:`,e,t)}}),this.updateSearchCounter(t,e,s,c.length,a.length)}updateSearchCounter(t,e,o,i,n){let r=null;if(r=t.classList.contains("todo-card-with-title-wrapper")?t.querySelector(".native-todo-card .add-row"):t.querySelector(".add-row"),!r)return;const a=t.querySelector(".search-counter");if(a&&a.remove(),o&&""!==o.trim()&&n>0){r.classList.add("has-search-counter");const t=document.createElement("div");t.className="search-counter",t.textContent=`Showing ${i} of ${n} results`,r.parentNode.insertBefore(t,r.nextSibling)}else r.classList.remove("has-search-counter")}}class S{constructor(t){this.cardInstance=t,this.handleTodoUpdate=this.handleTodoUpdate.bind(this)}get h(){return this.cardInstance.h}get l(){return this.cardInstance.l}async initializeSubscriptions(t,e){if(this.cardInstance.initialized&&this.cardInstance.cards&&0!==this.cardInstance.cards.length&&!e&&this.cardInstance.cards.length>0)for(const t of this.cardInstance.cards)if(t&&t.entityId){a(t.entityId);const e=this.cardInstance._?.get(t.entityId);if(e&&"function"==typeof e)try{e()}catch(t){}const o=await g(t.entityId,this.h);this.cardInstance._||(this.cardInstance._=new Map),this.cardInstance._.set(t.entityId,o),setTimeout(async()=>{await this.cardInstance.cardBuilder.updateNativeTodoCard(t.element,t.entityId)},100)}}setupEventListeners(){document.addEventListener("todo-items-updated",this.handleTodoUpdate)}removeEventListeners(){document.removeEventListener("todo-items-updated",this.handleTodoUpdate)}handleTodoUpdate(t){const{entityId:e,items:o}=t.detail;this.cardInstance.k||(this.cardInstance.k=new Map),this.cardInstance.k.set(e,o);const i=this.cardInstance.cards.find(t=>t.entityId===e);i&&i.element&&setTimeout(()=>{this.cardInstance.cardBuilder.updateNativeTodoCard(i.element,e)},50)}cleanup(){this.cardInstance._&&(this.cardInstance._.forEach((t,e)=>{try{"function"==typeof t&&t()}catch(t){console.warn(`Error unsubscribing from todo entity ${e}:`,t)}}),this.cardInstance._.clear()),this.cardInstance.k&&this.cardInstance.k.clear(),this.removeEventListeners()}}class TodoSwipeCard extends(s||HTMLElement){constructor(){super(),this.shadowRoot||this.constructor!==HTMLElement||this.attachShadow({mode:"open"}),this.l={},this.h=null,this.cards=[],this.currentIndex=0,this.slideWidth=0,this.cardContainer=null,this.sliderElement=null,this.paginationElement=null,this.initialized=!1,this.D=null,this.S=null,this.M=null,this.A=null,this.N=null,this.O=null,this._=new Map,this.I=null,this.i=new Map,this.o="",this.t=new Map,this.k=new Map,this.L=!1,this.dialogManager=new E(this),this.cardBuilder=new D(this),this.subscriptionManager=new S(this),this.$=this.$.bind(this),this.T=this.T.bind(this),this.C=this.C.bind(this)}render(){if(this.constructor!==HTMLElement)return d``}static getStubConfig(){return{entities:[],card_spacing:15,show_pagination:!0,show_icons:!1,show_create:!0,show_addbutton:!1,show_completed:!1,show_completed_menu:!1,delete_confirmation:!1,enable_search:!1}}static getConfigElement(){return document.createElement("todo-swipe-card-editor")}H(){return this.l&&this.l.entities&&Array.isArray(this.l.entities)&&this.l.entities.length>0&&this.l.entities.some(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim())}p(t){return"string"==typeof t?t:t?.entity||""}u(t){if(!this.l?.entities)return null;const e=this.l.entities.find(e=>this.p(e)===t);return"string"==typeof e?{entity:t}:e||null}j(t){if(!this.A)return!0;return JSON.stringify(t)!==JSON.stringify(this.A)}V(){if(this.shadowRoot)if(this.D||(this.D=document.createElement("style"),this.shadowRoot.appendChild(this.D)),this.l&&this.l.card_mod&&"string"==typeof this.l.card_mod.style){const t=this.l.card_mod.style;t.includes(":host")?this.D.textContent=t:this.D.textContent=`\n          :host {\n            ${t}\n          }\n        `}else this.D&&(this.D.textContent="")}F(){if(this.sliderElement&&this.l)try{let t="0.3s",e="ease-out";const o=this.l.card_mod||this.l.custom_card_mod;if(o&&"string"==typeof o.style){const i=o.style,n=/--todo-swipe-card-transition-speed\s*:\s*([^;]+)/i,r=i.match(n);r&&r[1]&&(t=r[1].trim());const a=/--todo-swipe-card-transition-easing\s*:\s*([^;]+)/i,s=i.match(a);s&&s[1]&&(e=s[1].trim());const d=/--todo-swipe-card-delete-button-color\s*:\s*([^;]+)/i,c=i.match(d);c&&c[1]&&(this.I=c[1].trim(),this.J())}if(this.sliderElement&&this.sliderElement.style){const o=`transform ${t} ${e}`;this.sliderElement.style.transition=o,this.B=t,this.R=e}}catch(t){console.error("Error applying transition properties:",t)}}J(){if(!this.I)return;this.shadowRoot.querySelectorAll(".delete-completed-button").forEach(t=>{t.style.color=this.I;const e=t.querySelector("svg");e&&(e.style.fill=this.I)})}setConfig(t){JSON.stringify(t);let e=t.entities||[];Array.isArray(e)||(e="object"==typeof e?Object.values(e):"string"==typeof e?[e]:[]),e=e.map(t=>"string"==typeof t?""===t.trim()?t:{entity:t}:t).filter(t=>"string"==typeof t?""!==t:t&&(t.entity||""===t.entity));const o={...TodoSwipeCard.getStubConfig(),...t,entities:e};if(void 0===o.card_spacing?o.card_spacing=15:(o.card_spacing=parseInt(o.card_spacing),(isNaN(o.card_spacing)||o.card_spacing<0)&&(o.card_spacing=15)),t.card_mod&&"object"==typeof t.card_mod&&Object.keys(t.card_mod).length>0?o.card_mod=t.card_mod:t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(o.card_mod=t.custom_card_mod),!this.j(o))return;const i=this.l;if(this.l=o,this.A=JSON.parse(JSON.stringify(o)),JSON.stringify(this.l),this.V(),this.initialized){this.S&&clearTimeout(this.S);this.Z(i,o)?this.S=setTimeout(()=>{this.q().then(()=>{this.F(),this.J()})},300):(this.P(i),this.F(),this.J())}}Z(t,e){if(!t)return!0;const o=JSON.stringify(t.entities)!==JSON.stringify(e.entities),i=t.show_pagination!==e.show_pagination,n=t.show_create!==e.show_create,r=JSON.stringify(t.card_mod)!==JSON.stringify(e.card_mod),a=t.enable_search!==e.enable_search;return o||i||n||r||a}P(t){requestAnimationFrame(()=>{this.l.show_completed!==t.show_completed&&this.cards.forEach(t=>{if(t.element){t.element.querySelectorAll(".todo-item.completed").forEach(t=>{t.style.display=this.l.show_completed?"":"none"})}}),this.l.show_completed_menu===t.show_completed_menu&&this.l.show_completed===t.show_completed||this.X(),this.l.card_spacing!==t.card_spacing&&this.sliderElement&&(this.sliderElement.style.gap=`${this.l.card_spacing}px`,this.updateSlider(!1)),JSON.stringify(this.l.card_mod||this.l.custom_card_mod)!==JSON.stringify(t.card_mod||t.custom_card_mod)&&(this.V(),this.paginationElement&&this.U())})}X(){this.cards.forEach(t=>{const e=t.slide;if(!e)return;if(e.querySelectorAll(".delete-completed-button").forEach(t=>t.remove()),this.l.show_completed&&this.l.show_completed_menu){const o=t.entityConfig||this.u(t.entityId),i=this.v(t.entityId,o);e.appendChild(i)}})}v(t,e=null){const o=document.createElement("button");if(o.className="delete-completed-button",o.title="Delete completed items",o.innerHTML='\n      <svg viewBox="0 0 24 24">\n        <path d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />\n      </svg>\n    ',e&&e.show_title&&e.title){const t=`calc(${35}px + ${"var(--todo-swipe-card-title-height, 40px)"})`;o.style.setProperty("--todo-swipe-card-delete-button-auto-top",t)}if(this.I){o.style.color=this.I;const t=o.querySelector("svg");t&&(t.style.fill=this.I)}return o.addEventListener("click",e=>{e.preventDefault(),e.stopPropagation(),this.l.delete_confirmation?this.dialogManager.showDeleteCompletedConfirmation(t):k(t,this.h)}),o}set hass(t){if(!t)return;const e=this.h;this.h=t,this.subscriptionManager.initializeSubscriptions(t,e)}connectedCallback(){this.l&&(this.initialized||(this.V(),this.q()),this.subscriptionManager.setupEventListeners())}disconnectedCallback(){var t;this.S&&(clearTimeout(this.S),this.S=null),this.N&&(clearTimeout(this.N),this.N=null),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.subscriptionManager.cleanup(),(t=this).t&&(t.t.forEach(t=>{t.inputElement&&(t.inputHandler&&t.inputElement.removeEventListener("input",t.inputHandler),t.keydownHandler&&t.inputElement.removeEventListener("keydown",t.keydownHandler))}),t.t.clear()),t.i&&t.i.clear(),t.o="",this.cardContainer&&(this.G&&(this.cardContainer.removeEventListener("touchstart",this.G),this.cardContainer.removeEventListener("touchmove",this.K),this.cardContainer.removeEventListener("touchend",this.W),this.cardContainer.removeEventListener("touchcancel",this.W),this.cardContainer.removeEventListener("mousedown",this.Y)),window.removeEventListener("mousemove",this.tt),window.removeEventListener("mouseup",this.et)),this.initialized=!1,this.cards=[],this.cardContainer=null,this.sliderElement=null,this.paginationElement=null,this.O=null,this.shadowRoot&&(this.shadowRoot.innerHTML="")}async q(){if(this.M)return this.M;this.M=this.ot();try{await this.M}finally{this.M=null}}async ot(){const t=document.createDocumentFragment(),e=this.shadowRoot;e.innerHTML="";const o=function(t){const e=document.createElement("style");return e.textContent=`\n    :host {\n      display: block;\n      overflow: hidden;\n      width: 100%;\n      height: 100%;\n      --card-border-radius: var(--ha-card-border-radius, 12px);\n      border-radius: var(--card-border-radius);\n    }\n\n    .card-container {\n      position: relative;\n      width: 100%;\n      height: 100%;\n      overflow: hidden;\n      border-radius: var(--card-border-radius);\n    }\n    \n    .card-container, .slide {\n      border-radius: var(--card-border-radius) !important;\n    }\n\n    .slider {\n      position: relative;\n      display: flex;\n      width: 100%;\n      height: 100%;\n      transition: transform 0.3s ease-out;\n      will-change: transform;\n    }\n\n    .slide {\n      position: relative;\n      flex: 0 0 100%;\n      max-width: 100%;\n      overflow: hidden;\n      height: 100%;\n      box-sizing: border-box;\n      border-radius: var(--card-border-radius);\n      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));\n    }\n\n    .pagination {\n      position: absolute;\n      bottom: var(--todo-swipe-card-pagination-bottom, 8px);\n      left: 0;\n      right: 0;\n      display: flex;\n      justify-content: center;\n      align-items: center;\n      z-index: 1;\n      background-color: var(--todo-swipe-card-pagination-background, transparent);\n    }\n\n    .pagination-dot {\n      width: var(--todo-swipe-card-pagination-dot-size, 8px);\n      height: var(--todo-swipe-card-pagination-dot-size, 8px);\n      border-radius: var(--todo-swipe-card-pagination-dot-border-radius, 50%);\n      margin: 0 var(--todo-swipe-card-pagination-dot-spacing, 4px);\n      background-color: var(--todo-swipe-card-pagination-dot-inactive-color, rgba(127, 127, 127, 0.6));\n      opacity: var(--todo-swipe-card-pagination-dot-inactive-opacity, 0.6);\n      cursor: pointer;\n      transition: background-color 0.2s ease, width 0.2s ease, height 0.2s ease;\n      flex-shrink: 0;\n    }\n\n    .pagination-dot.active {\n      background-color: var(--todo-swipe-card-pagination-dot-active-color, var(--primary-color, #03a9f4));\n      width: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));\n      height: calc(var(--todo-swipe-card-pagination-dot-size, 8px) * var(--todo-swipe-card-pagination-dot-active-size-multiplier, 1));\n      opacity: var(--todo-swipe-card-pagination-dot-active-opacity, 1);\n    }\n    \n    .delete-completed-button {\n      position: absolute;\n      right: 7px;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      top: var(--todo-swipe-card-delete-button-top, var(--todo-swipe-card-delete-button-auto-top, 35px));\n      padding: 4px;\n      background-color: transparent;\n      border: none;\n      color: var(--todo-swipe-card-delete-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      cursor: pointer;\n      border-radius: 50%;\n      width: 36px;\n      height: 36px;\n      z-index: 10;\n    }\n\n    .delete-completed-button:hover {\n      background-color: rgba(127, 127, 127, 0.2);\n    }\n\n    .delete-completed-button svg {\n      width: 20px;\n      height: 20px;\n      fill: currentColor;\n    }\n\n    /* Preview styles */\n    .preview-container {\n      display: flex;\n      flex-direction: column;\n      align-items: center;\n      justify-content: center;\n      text-align: center;\n      padding: 16px;\n      box-sizing: border-box;\n      height: 100%;\n      background: var(--ha-card-background, var(--card-background-color, white));\n      border-radius: inherit;\n    }\n    \n    .preview-icon-container {\n      margin-bottom: 16px;\n    }\n    \n    .preview-icon-container ha-icon {\n      color: var(--primary-color, #03a9f4);\n      font-size: 48px;\n      width: 48px;\n      height: 48px;\n    }\n    \n    .preview-text-container {\n      margin-bottom: 16px;\n    }\n    \n    .preview-title {\n      font-size: 18px;\n      font-weight: bold;\n      margin-bottom: 8px;\n      color: var(--primary-text-color);\n    }\n    \n    .preview-description {\n      font-size: 14px;\n      color: var(--secondary-text-color);\n      max-width: 300px;\n      line-height: 1.4;\n      margin: 0 auto;\n    }\n    \n    /* Dialog styles */\n    ha-dialog {\n      --mdc-dialog-min-width: 300px;\n      --mdc-dialog-max-width: 500px;\n      --mdc-dialog-heading-ink-color: var(--primary-text-color);\n      --mdc-dialog-content-ink-color: var(--primary-text-color);\n      --justify-action-buttons: space-between;\n    }\n    \n    ha-dialog div {\n      padding: 8px 16px 16px 16px;\n      color: var(--primary-text-color);\n    }\n    \n    /* Todo icon styling */\n    .todo-icon {\n      position: absolute;\n      right: var(--todo-swipe-card-icon-right, 16px);\n      bottom: var(--todo-swipe-card-icon-bottom, 8px);\n      width: var(--todo-swipe-card-icon-size, 48px);\n      height: var(--todo-swipe-card-icon-size, 48px);\n      color: var(--todo-swipe-card-icon-color, rgba(255, 255, 255, 0.3));\n      opacity: var(--todo-swipe-card-icon-opacity, 0.6);\n      z-index: 1;\n      pointer-events: none;\n      --mdc-icon-size: var(--todo-swipe-card-icon-size, 48px);\n    }\n\n    .native-todo-card {\n      height: 100%;\n      box-sizing: border-box;\n      overflow-y: auto;\n      border-radius: var(--card-border-radius);\n      background: var(--todo-swipe-card-background, var(--ha-card-background, var(--card-background-color, white)));\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color));\n      font-size: var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px));\n      position: relative;\n      \n      /* Hide scrollbar for all browsers */\n      scrollbar-width: none; /* Firefox */\n      -ms-overflow-style: none; /* Internet Explorer 10+ */\n    }\n\n    .native-todo-card::-webkit-scrollbar {\n      display: none; /* WebKit browsers (Chrome, Safari, Edge) */\n    }\n\n    .todo-card-with-title-wrapper .native-todo-card {\n      border-radius: 0 0 var(--card-border-radius) var(--card-border-radius);\n    }\n\n    .add-row {\n      padding: 8px 12px;\n      padding-bottom: 0;\n      margin-bottom: 6px; /* 6px + 4px todo-list padding = 10px total when no search */\n      position: relative;\n      display: flex;\n      flex-direction: row;\n      align-items: center;\n    }\n\n    .add-row.has-search-counter {\n      margin-bottom: 0px; /* 4px gap to search counter when search is active */\n    }\n\n    .add-textfield {\n      flex-grow: 1;\n      margin-right: 8px;\n    }\n\n    .add-textfield input {\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color)) !important;\n      font-weight: var(--todo-swipe-card-input-font-weight, normal) !important;\n      background: transparent !important;\n      border: none !important;\n      outline: none !important;\n      padding: 8px 8px 2px 8px !important;\n      margin-left: -4px !important;\n      margin-top: 3px !important;\n      width: 100% !important;\n      box-sizing: border-box !important;\n      font-size: inherit !important;\n      font-family: inherit !important;\n    }\n\n    .add-textfield input::placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: var(--todo-swipe-card-placeholder-opacity, 1) !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-textfield input::-webkit-input-placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: 1 !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-textfield input::-moz-placeholder {\n      color: var(--todo-swipe-card-placeholder-color, var(--todo-swipe-card-text-color, var(--primary-text-color))) !important;\n      opacity: 1 !important;\n      font-weight: var(--todo-swipe-card-placeholder-font-weight, normal) !important;\n    }\n\n    .add-button {\n      position: absolute;\n      right: 5px;\n      top: 5px;\n      background: none;\n      border: none;\n      cursor: pointer;\n      padding: 8px;\n      border-radius: 50%;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: var(--todo-swipe-card-add-button-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      opacity: ${t?.show_addbutton?"1":"0"};\n      visibility: ${t?.show_addbutton?"visible":"hidden"};\n      pointer-events: ${t?.show_addbutton?"auto":"none"};\n    }\n\n    .add-button:hover {\n      background-color: rgba(127, 127, 127, 0.1);\n    }\n\n    .add-button svg {\n      width: 24px;\n      height: 24px;\n      fill: currentColor;\n    }\n\n    .todo-list {\n      padding: 4px 0;\n    }\n\n    .header {\n      display: none;\n    }\n\n    .empty {\n      display: none;\n    }\n\n    .todo-item {\n      display: flex;\n      align-items: var(--todo-swipe-card-item-align, flex-start);\n      padding: 1px 12px;\n      min-height: var(--todo-swipe-card-item-height, calc(var(--todo-swipe-card-font-size, 11px) + 8px));\n      margin-top: var(--todo-swipe-card-item-spacing, 1px);\n      cursor: pointer;\n      position: relative;\n      padding-right: 30px;\n    }\n\n    .todo-item:first-child {\n      margin-top: 0 !important;\n    }\n\n    .todo-item:hover {\n      background-color: rgba(127, 127, 127, 0.1);\n    }\n\n    .todo-checkbox {\n      margin-right: var(--todo-swipe-card-item-margin, 5px);\n      margin-top: var(--todo-swipe-card-checkbox-margin-top, 1px);\n      margin-left: 4px;\n      flex-shrink: 0;\n      opacity: 70%;\n      --mdc-checkbox-unchecked-color: var(--todo-swipe-card-checkbox-color, var(--todo-swipe-card-text-color, var(--primary-text-color)));\n      --mdc-checkbox-checked-color: var(--todo-swipe-card-checkbox-checked-color, var(--primary-color));\n      --mdc-checkbox-ink-color: var(--todo-swipe-card-checkbox-checkmark-color, white);\n      --mdc-checkbox-mark-color: var(--todo-swipe-card-checkbox-checkmark-color, white);\n      --mdc-checkbox-size: var(--todo-swipe-card-checkbox-size, 18px);\n      --mdc-checkbox-ripple-size: var(--todo-swipe-card-checkbox-size, 18px);\n      --mdc-checkbox-state-layer-size: var(--todo-swipe-card-checkbox-size, 18px);\n    }\n\n    .todo-content {\n      flex: 1;\n      max-width: calc(100% - 30px);\n      overflow: visible;\n      color: var(--todo-swipe-card-text-color, var(--primary-text-color));\n      font-weight: var(--todo-swipe-card-item-font-weight, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n    }\n\n    .todo-summary {\n      margin: 0;\n      margin-top: var(--todo-swipe-card-summary-margin-top, 3px);\n      padding: 0;\n      color: inherit;\n      font-size: inherit;\n      font-weight: inherit;\n      line-height: inherit;\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n      hyphens: none;\n      word-break: normal;        \n    }\n\n    .todo-item.completed .todo-summary {\n      text-decoration: line-through;\n    }\n\n    .todo-description {\n      margin-top: var(--todo-swipe-card-description-margin-top, 1px);\n      color: var(--todo-swipe-card-font-color-description, var(--secondary-text-color));\n      font-size: var(--todo-swipe-card-font-size-description, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px)));\n      font-weight: var(--todo-swipe-card-font-weight-description, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      white-space: normal;\n      word-wrap: break-word;\n      overflow-wrap: break-word;\n    }\n\n    .todo-due {\n      margin-top: var(--todo-swipe-card-due-date-margin-top, 2px);\n      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));\n      font-size: var(--todo-swipe-card-font-size-due-date, var(--todo-swipe-card-typography-size-due-date, var(--todo-swipe-card-font-size, var(--todo-swipe-card-typography-size, 11px))));\n      font-weight: var(--todo-swipe-card-font-weight-due-date, normal);\n      line-height: var(--todo-swipe-card-line-height, 1.3);\n      display: flex;\n      align-items: flex-start;\n      gap: 3px;\n    }\n\n    .todo-due.overdue {\n      color: var(--todo-swipe-card-font-color-due-date-overdue, var(--warning-color));\n    }\n\n    .todo-item.completed .todo-due.overdue {\n      color: var(--todo-swipe-card-font-color-due-date, var(--secondary-text-color));\n    }\n\n    .todo-due-icon {\n      --mdc-icon-size: var(--todo-swipe-card-due-icon-size, 14px);\n      width: var(--todo-swipe-card-due-icon-size, 14px);\n      height: var(--todo-swipe-card-due-icon-size, 14px);\n      margin-inline-start: initial;\n      flex-shrink: 0;\n      margin-top: 1px;\n    }\n\n    .todo-item.completed {\n      display: flex;\n    }\n\n    .todo-card-with-title-wrapper {\n      position: relative;\n      height: 100%;\n      width: 100%;\n      border-radius: var(--ha-card-border-radius, 12px);\n      overflow: hidden;\n      background: var(--ha-card-background, var(--card-background-color, white));\n      display: flex;\n      flex-direction: column;\n    }\n\n    .todo-swipe-card-external-title {\n      min-height: var(--todo-swipe-card-title-height, 40px);\n      display: flex;\n      align-items: center;\n      justify-content: var(--todo-swipe-card-title-align, center);\n      background: var(--todo-swipe-card-title-background, var(--secondary-background-color, #f7f7f7));\n      color: var(--todo-swipe-card-title-color, var(--primary-text-color));\n      font-size: var(--todo-swipe-card-title-font-size, 16px);\n      font-weight: var(--todo-swipe-card-title-font-weight, 500);\n      border-bottom: var(--todo-swipe-card-title-border-width, 1px) solid var(--todo-swipe-card-title-border-color, rgba(0,0,0,0.12));\n      padding: 0 var(--todo-swipe-card-title-padding-horizontal, 16px);\n      box-sizing: content-box;\n      text-align: var(--todo-swipe-card-title-align, center);\n      flex-shrink: 0;\n      z-index: 1;\n      border-radius: var(--ha-card-border-radius, 12px) var(--ha-card-border-radius, 12px) 0 0;\n      margin: 0;\n      line-height: 1;\n      font-family: inherit;\n      white-space: var(--todo-swipe-card-title-white-space, nowrap);\n      overflow: var(--todo-swipe-card-title-overflow, hidden);\n      text-overflow: var(--todo-swipe-card-title-text-overflow, clip);\n    }\n\n    .todo-card-container {\n      flex: 1;\n      min-height: 0;\n      position: relative;\n    }\n\n    .search-counter {\n      padding: 2px 12px 2px 12px;\n      margin-left: 4px;\n      margin-bottom: 0px; /* Let todo-list top padding provide the 4px gap */\n      font-size: var(--todo-swipe-card-search-counter-font-size, 12px);\n      color: var(--todo-swipe-card-search-counter-color, var(--secondary-text-color));\n      font-style: italic;\n      text-align: left;\n    }\n  `,e}(this.l);if(t.appendChild(o),this.D&&t.appendChild(this.D),!this.H())return function(t){const e=document.createElement("div");e.className="preview-container";const o=document.createElement("div");o.className="preview-icon-container";const i=document.createElement("ha-icon");i.icon="mdi:format-list-checks",o.appendChild(i);const n=document.createElement("div");n.className="preview-text-container";const r=document.createElement("div");r.className="preview-title",r.textContent="Todo Swipe Card";const a=document.createElement("div");a.className="preview-description",a.textContent="A specialized swipe card for todo lists with native styling. Supports multiple lists with swipe navigation.",n.appendChild(r),n.appendChild(a);const s=document.createElement("div");s.className="preview-actions";const d=document.createElement("ha-button");d.raised=!0,d.textContent="EDIT CARD",d.setAttribute("aria-label","Edit Card"),d.addEventListener("click",t=>{t.stopPropagation();const e=new CustomEvent("show-edit-card",{detail:{element:t.target.closest("todo-swipe-card")},bubbles:!0,composed:!0});t.target.dispatchEvent(e)}),s.appendChild(d),e.appendChild(o),e.appendChild(n),e.appendChild(s),t.appendChild(e)}(t),e.appendChild(t),void(this.initialized=!0);this.cardContainer=document.createElement("div"),this.cardContainer.className="card-container",this.sliderElement=document.createElement("div"),this.sliderElement.className="slider",this.cardContainer.appendChild(this.sliderElement),t.appendChild(this.cardContainer),e.appendChild(t),this.cards=[];try{await this.cardBuilder.createNativeTodoCards()}catch(t){console.error("Error creating native todo cards:",t)}!1!==this.l.show_pagination&&this.cards.length>1?function(t){t.paginationElement=document.createElement("div"),t.paginationElement.className="pagination";for(let e=0;e<t.cards.length;e++){const o=document.createElement("div");o.className="pagination-dot",e===t.currentIndex&&o.classList.add("active"),o.addEventListener("click",()=>{t.goToSlide(e)}),t.paginationElement.appendChild(o)}t.cardContainer.appendChild(t.paginationElement),m(t)}(this):this.paginationElement=null,requestAnimationFrame(()=>{if(!this.cardContainer)return;this.slideWidth=this.cardContainer.offsetWidth,this.currentIndex=Math.max(0,Math.min(this.currentIndex,this.cards.length-1));const t=getComputedStyle(this.cardContainer).borderRadius;this.cards.forEach(e=>{e.slide&&(e.slide.style.borderRadius=t)}),this.updateSlider(!1),this.it(),this.cards.forEach((t,e)=>{t&&t.element&&t.entityId&&(t.entityId,setTimeout(()=>{this.cardBuilder.updateNativeTodoCard(t.element,t.entityId)},50*e))})}),this.cards.length>1&&function(t){t.G&&(t.cardContainer.removeEventListener("touchstart",t.G),t.cardContainer.removeEventListener("touchmove",t.K),t.cardContainer.removeEventListener("touchend",t.W),t.cardContainer.removeEventListener("touchcancel",t.W),t.cardContainer.removeEventListener("mousedown",t.Y),window.removeEventListener("mousemove",t.tt),window.removeEventListener("mouseup",t.et));let e=0,o=0,i=0,n=!1,r=!1,a=0,s=!1,d=!1;t.nt=e=>{if(!e||e===t.cardContainer||e===t.sliderElement)return!1;let o=e,i=0;for(;o&&i<15;){try{if(o.nodeType===Node.ELEMENT_NODE){const t=o.localName?.toLowerCase(),e=o.getAttribute&&o.getAttribute("role");if(["input","textarea","select","button","a","ha-switch","ha-checkbox","mwc-checkbox","paper-checkbox","ha-textfield","ha-slider","paper-slider","ha-icon-button","mwc-button","paper-button"].includes(t))return!0;if(e&&["button","checkbox","switch","slider","link","menuitem","textbox","input","combobox","searchbox"].includes(e))return!0;if(o.classList){const t=["mdc-text-field","mdc-text-field__input","mdc-text-field__ripple","mdc-line-ripple","mdc-floating-label","mdc-text-field__affix"];for(const e of t)if(o.classList.contains(e))return!0}}}catch(t){break}o=o.assignedSlot||o.parentNode||o.getRootNode&&o.getRootNode().host,i++}return!1},t.rt=c=>{if(!(n||"mousedown"===c.type&&0!==c.button||(s=t.nt(c.target),s))){if(n=!1,r=!1,d=!1,"touchstart"===c.type?(e=c.touches[0].clientX,o=c.touches[0].clientY):(e=c.clientX,o=c.clientY),i=e,t.sliderElement){const e=window.getComputedStyle(t.sliderElement),o=new DOMMatrixReadOnly(e.transform);a=o.m41}"mousedown"===c.type&&(window.addEventListener("mousemove",t.tt),window.addEventListener("mouseup",t.et))}},t.st=c=>{if(s)return;let l,h;"touchmove"===c.type?(l=c.touches[0].clientX,h=c.touches[0].clientY):(l=c.clientX,h=c.clientY);const p=l-e,u=h-o;if(!r&&!d){if(Math.abs(u)>Math.abs(p)&&Math.abs(u)>15)return void(r=!0);if(!(Math.abs(p)>15))return;d=!0,n=!0,t.sliderElement&&(t.sliderElement.style.transition="none",t.sliderElement.style.cursor="grabbing"),c.cancelable&&c.preventDefault()}if(r||!d)return;c.cancelable&&c.preventDefault(),i=l;let m=i-e;const g=0===t.currentIndex,f=t.currentIndex===t.cards.length-1;(g&&m>0||f&&m<0)&&(m*=.5*(.3+.7/(1+Math.abs(m)/(.5*t.slideWidth))));const v=a+m;t.sliderElement&&requestAnimationFrame(()=>{t.sliderElement.style.transform=`translateX(${v}px)`})},t.dt=o=>{if("mouseup"!==o.type&&"mouseleave"!==o.type||(window.removeEventListener("mousemove",t.tt),window.removeEventListener("mouseup",t.et)),s)return void(s=!1);const a=n;if(n=!1,r=!1,d=!1,s=!1,t.sliderElement){const e=t.B||"0.3s",o=t.R||"ease-out";t.sliderElement.style.transition=`transform ${e} ${o}`,t.sliderElement.style.cursor=""}if(!a||"touchcancel"===o.type)return void t.updateSlider();const c=i-e,l=.2*t.slideWidth;Math.abs(c)>l&&(c>0&&t.currentIndex>0?t.currentIndex--:c<0&&t.currentIndex<t.cards.length-1&&t.currentIndex++),t.updateSlider(!0)},t.G=t.rt.bind(t),t.K=t.st.bind(t),t.W=t.dt.bind(t),t.Y=t.rt.bind(t),t.tt=t.st.bind(t),t.et=t.dt.bind(t),t.cardContainer.addEventListener("touchstart",t.G,{passive:!0}),t.cardContainer.addEventListener("touchmove",t.K,{passive:!1}),t.cardContainer.addEventListener("touchend",t.W,{passive:!0}),t.cardContainer.addEventListener("touchcancel",t.W,{passive:!0}),t.cardContainer.addEventListener("mousedown",t.Y)}(this),setTimeout(()=>{this.F()},200),this.initialized=!0}$(t,e){v(t,e,this.h)}T(t,e,o){w(t,e,o,this.h)}C(t,e){this.dialogManager.editTodoItem(t,e)}it(){let t;this.resizeObserver&&this.resizeObserver.disconnect(),this.resizeObserver=new ResizeObserver(()=>{t&&clearTimeout(t),t=setTimeout(()=>{if(!this.cardContainer)return;const t=this.cardContainer.offsetWidth;t>0&&Math.abs(t-this.slideWidth)>1&&(this.slideWidth=t,requestAnimationFrame(()=>{const t=getComputedStyle(this.cardContainer).borderRadius;this.cards.forEach(e=>{e.slide&&(e.slide.style.borderRadius=t)}),this.updateSlider(!1)}))},200)}),this.cardContainer&&this.resizeObserver.observe(this.cardContainer)}goToSlide(t){this.cards&&0!==this.cards.length&&this.initialized&&(t=Math.max(0,Math.min(t,this.cards.length-1)))!==this.currentIndex&&(this.currentIndex=t,this.updateSlider())}updateSlider(t=!0){this.sliderElement&&this.slideWidth&&0!==this.cards.length&&this.initialized&&requestAnimationFrame(()=>{const e=this.B||"0.3s",o=this.R||"ease-out";this.sliderElement.style.transition=t?`transform ${e} ${o}`:"none";const i=this.l.card_spacing||0;this.sliderElement.style.gap=`${i}px`;const n=this.currentIndex*(this.slideWidth+i);this.sliderElement.style.transform=`translateX(-${n}px)`;const r=getComputedStyle(this.cardContainer).borderRadius;var a;this.cards.forEach(t=>{t.slide&&(t.slide.style.marginRight="0px",t.slide.style.borderRadius=r)}),(a=this).paginationElement&&(a.paginationElement.querySelectorAll(".pagination-dot").forEach((t,e)=>{t.classList.toggle("active",e===a.currentIndex)}),m(a)),this.l.enable_search&&this.cards[this.currentIndex]})}getCardSize(){return 3}}class TodoSwipeCardEditor extends(s||HTMLElement){static get properties(){return{hass:{type:Object},l:{type:Object},ct:{type:Set,state:!0},lt:{type:String,state:!0}}}constructor(){super(),this.ct=new Set,this.lt="normal",this.ht=this.ht.bind(this)}async connectedCallback(){super.connectedCallback(),await this.ut(),this.requestUpdate()}async ut(){let t=0;for(;!customElements.get("ha-entity-picker")&&t<50;)await this.gt(),customElements.get("ha-entity-picker")||(await new Promise(t=>setTimeout(t,100)),t++);customElements.get("ha-entity-picker")||console.error("Failed to load ha-entity-picker after multiple attempts")}async gt(){if(!customElements.get("ha-entity-picker"))try{const t=[()=>customElements.get("hui-entities-card")?.getConfigElement?.(),()=>customElements.get("hui-entity-picker-card")?.getConfigElement?.()];for(const e of t)try{if(await e(),customElements.get("ha-entity-picker"))break}catch(t){}}catch(t){console.warn("Could not load ha-entity-picker",t)}}updated(t){super.updated(t),t.has("_config")&&this.l&&this.l.entities&&this.l.entities.length>0&&(this.ft&&cancelAnimationFrame(this.ft),this.ft=requestAnimationFrame(()=>{const t=this.shadowRoot.querySelectorAll("ha-entity-picker");(0===t.length||t.length<this.l.entities.length)&&this.requestUpdate(),this.ft=null}))}p(t){return"string"==typeof t?t:t?.entity||""}vt(t){const e={type:t.type,entities:t.entities,card_spacing:t.card_spacing,show_pagination:t.show_pagination,show_create:t.show_create,show_addbutton:t.show_addbutton,show_completed:t.show_completed,show_completed_menu:t.show_completed_menu,delete_confirmation:t.delete_confirmation,enable_search:t.enable_search},o=["type","entities","card_spacing","show_pagination","show_create","show_addbutton","show_completed","show_completed_menu","delete_confirmation","enable_search","custom_card_mod"];return Object.entries(t).forEach(([t,i])=>{o.includes(t)||(e[t]=i)}),t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(e.custom_card_mod=t.custom_card_mod),e}setConfig(t){if(JSON.stringify(t),this.l={...this.constructor.getStubConfig()},t){let e=t.entities||[];Array.isArray(e)||(e="object"==typeof e?Object.values(e):"string"==typeof e?[e]:[]),e=e.map(t=>t);if(e.length>0&&(""===e[e.length-1]||"object"==typeof e[e.length-1]&&""===e[e.length-1].entity)){const t=e.slice(0,-1).filter(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim());e=[...t,""]}else e=e.filter(t=>"string"==typeof t?t&&""!==t.trim():t&&t.entity&&""!==t.entity.trim());let o=t.card_spacing;void 0===o?o=15:(o=parseInt(o),(isNaN(o)||o<0)&&(o=15));const i={...this.l,...t,entities:e,card_spacing:o};t.custom_card_mod&&"object"==typeof t.custom_card_mod&&Object.keys(t.custom_card_mod).length>0&&(i.custom_card_mod=t.custom_card_mod),this.l=i}JSON.stringify(this.l),this.requestUpdate()}static getStubConfig(){return{entities:[],card_spacing:15,show_pagination:!0,show_icons:!1,show_create:!0,show_addbutton:!1,show_completed:!1,show_completed_menu:!1,delete_confirmation:!1,enable_search:!1}}get wt(){return!1!==this.l.show_pagination}get xt(){return!0===this.l.show_addbutton}get bt(){return!1!==this.l.show_create}get yt(){return!0===this.l.show_completed}get kt(){return!0===this.l.show_completed_menu}get _t(){return!0===this.l.delete_confirmation}get $t(){return!0===this.l.show_icons}get zt(){return!0===this.l.enable_search}get Tt(){return void 0!==this.l.card_spacing?this.l.card_spacing:15}get Ct(){return(this.l.entities||[]).filter(t=>{const e=this.p(t);return e&&""!==e.trim()})}get Et(){return this.yt}get Dt(){return this.yt&&this.kt}get St(){return this.Ct.length>0}static get styles(){return c`
      ${c`
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
    `}Mt(t,e){if(!this.l?.entities)return;const o=[...this.l.entities],i=t+e;if(i<0||i>=o.length)return;[o[t],o[i]]=[o[i],o[t]],this.ct.has(t)&&(this.ct.delete(t),this.ct.add(i)),this.ct.has(i)&&(this.ct.delete(i),this.ct.add(t));const n={...this.l,entities:o};this.l=n,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:n}})),this.requestUpdate()}At(t){this.ct.has(t)?this.ct.delete(t):(this.ct.clear(),this.ct.add(t)),this.requestUpdate()}Nt(t){this.lt=t,this.requestUpdate(),setTimeout(()=>{this.lt="normal",this.requestUpdate()},"blocked"===t?1e3:500)}Ot(t=-1){if(!this.hass)return[];const e=Object.keys(this.hass.states).filter(t=>t.startsWith("todo.")&&this.hass.states[t]),o=(this.l.entities||[]).map((e,o)=>o===t?null:this.p(e)).filter(t=>t&&""!==t.trim());return e.filter(t=>!o.includes(t))}It(t){const e=this.p(t);if(!e||""===e.trim())return{displayName:"Empty Entity",friendlyName:""};const o=this.hass?.states?.[e],i=o?.attributes?.friendly_name||e.split(".").pop().replace(/_/g," ");return{displayName:i,friendlyName:i}}Lt(t){if(!this.l||!this.hass)return;const e=t.target,o=void 0!==e.checked?e.checked:e.value,i=e.configValue||e.getAttribute("data-config-value");if(i){const t=this.vt({...this.l,[i]:o});this.l=t,this.Ht(t)}}Ht(t){this.jt&&clearTimeout(this.jt),this.jt=setTimeout(()=>{const e=this.vt(t);this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))},150)}Vt(t){if(!this.l)return;const e=parseInt(t.target.value);if(!isNaN(e)&&e>=0){const t=this.vt({...this.l,card_spacing:e});this.l=t,this.Ht(t)}}ht(t){if(t&&(t.preventDefault(),t.stopPropagation()),!this.l)return;const e=Array.isArray(this.l.entities)?[...this.l.entities]:[];if(e.length>0&&(""===e[e.length-1]||"object"==typeof e[e.length-1]&&""===e[e.length-1].entity))return void this.Nt("blocked");e.push({entity:""});const o={...this.l,entities:e};this.l=o,this.Nt("success"),this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:o},bubbles:!0,composed:!0})),setTimeout(()=>{this.requestUpdate()},0)}Ft(t){if(!this.l||!Array.isArray(this.l.entities))return;const e=[...this.l.entities];e.splice(t,1),this.ct.delete(t);const o=new Set;this.ct.forEach(e=>{e>t?o.add(e-1):e<t&&o.add(e)}),this.ct=o;const i={...this.l,entities:e};this.l=i,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:i}})),this.requestUpdate()}Jt(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const o=t.detail?.value||t.target.value||"",i=[...this.l.entities],n=i[e];i[e]="object"==typeof n?{...n,entity:o}:{entity:o};const r={...this.l,entities:i};this.l=r,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:r}})),this.requestUpdate()}Bt(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const o=t.target.value||"none",i=[...this.l.entities],n=i[e];i[e]="string"==typeof n?{entity:n,display_order:o}:{...n,display_order:o};const r={...this.l,entities:i};this.l=r,this.Ht(r)}Rt(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const o=t.target.value||"",i=[...this.l.entities],n=i[e];if("string"==typeof n){const t={entity:n};o&&(t.background_image=o),i[e]=t}else if(o)i[e]={...n,background_image:o};else{const t={...n};delete t.background_image,i[e]=t}const r={...this.l,entities:i};this.l=r,this.Ht(r)}Zt(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const o=t.target.checked,i=[...this.l.entities],n=i[e];i[e]="string"==typeof n?{entity:n,show_title:o}:{...n,show_title:o};const r={...this.l,entities:i};this.l=r,this.Ht(r)}qt(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const o=t.target.value||"",i=[...this.l.entities],n=i[e];if("string"==typeof n){const t={entity:n};o&&(t.title=o),i[e]=t}else if(o)i[e]={...n,title:o};else{const t={...n};delete t.title,i[e]=t}const r={...this.l,entities:i};this.l=r,this.Ht(r)}Pt(t){const e=parseInt(t.target.getAttribute("data-index"));if(isNaN(e))return;const o=t.target.value||"",i=[...this.l.entities],n=i[e];if("string"==typeof n){const t={entity:n};o&&(t.icon=o),i[e]=t}else if(o)i[e]={...n,icon:o};else{const t={...n};delete t.icon,i[e]=t}const r={...this.l,entities:i};this.l=r,this.Ht(r)}Xt(t){const e=this.l.entities[t];return"string"==typeof e?{entity:e,display_order:"none",show_title:!1,title:"",background_image:""}:{entity:e?.entity||"",display_order:e?.display_order||"none",show_title:e?.show_title||!1,title:e?.title||"",background_image:e?.background_image||"",icon:e?.icon||""}}Ut(){return[{value:e,label:"Default"},{value:o,label:"Alphabetical A-Z"},{value:i,label:"Alphabetical Z-A"},{value:n,label:"Due Date (Earliest First)"},{value:r,label:"Due Date (Latest First)"}]}Gt(t,e){t.stopPropagation(),this.At(e)}Kt(t,e){t.stopPropagation(),e()}Wt(t,e){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),t.stopPropagation(),this.At(e))}Yt(t){t.stopPropagation(),t.preventDefault()}render(){if(!this.hass||!this.l)return d`<div>Loading...</div>`;const e=Array.isArray(this.l.entities)?this.l.entities:[];return JSON.stringify(this.l),d`
      <div class="card-config">
        <!-- Todo Lists Section -->
        <div class="section">
          <div class="section-header">Todo Lists</div>

          <div class="card-list">
            ${0===e.length?d`<div class="no-cards">
                  No todo lists added yet. Click "+ ADD TODO LIST" below to add your first list.
                </div>`:e.map((t,o)=>{const i=this.It(t),n=this.ct.has(o),r=this.Xt(o);return d`
                    <div
                      class="card-row clickable-row ${n?"expanded":""}"
                      data-index=${o}
                      @click=${()=>this.At(o)}
                      role="button"
                      tabindex="0"
                      aria-expanded=${n}
                      aria-label="Todo list ${o+1}: ${i.displayName}. Click to ${n?"collapse":"expand"}"
                      @keydown=${t=>this.Wt(t,o)}
                    >
                      <div class="card-info">
                        <ha-icon-button
                          class="expand-button leading"
                          label=${n?"Collapse":"Expand"}
                          path=${n?"M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z":"M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"}
                          @click=${t=>this.Gt(t,o)}
                        ></ha-icon-button>
                        <span class="card-index">${o+1}</span>
                        <span class="card-type">${i.displayName}</span>
                        ${r.entity&&""!==r.entity.trim()?d`<span class="card-name">(${r.entity})</span>`:d`<span class="card-name" style="color: var(--error-color);"
                              >(Not configured)</span
                            >`}
                      </div>
                      <div class="card-actions" @click=${this.Yt}>
                        <ha-icon-button
                          label="Move Up"
                          ?disabled=${0===o}
                          path="M7,15L12,10L17,15H7Z"
                          @click=${t=>this.Kt(t,()=>this.Mt(o,-1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Move Down"
                          ?disabled=${o===e.length-1}
                          path="M7,9L12,14L17,9H7Z"
                          @click=${t=>this.Kt(t,()=>this.Mt(o,1))}
                        ></ha-icon-button>
                        <ha-icon-button
                          label="Delete Todo List"
                          path="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
                          @click=${t=>this.Kt(t,()=>this.Ft(o))}
                          style="color: var(--error-color);"
                        ></ha-icon-button>
                      </div>
                    </div>
                    ${n?d`
                          <div class="expanded-content">
                            <ha-entity-picker
                              .hass=${this.hass}
                              .value=${r.entity}
                              .includeDomains=${["todo"]}
                              .includeEntities=${this.Ot(o)}
                              data-index=${o}
                              @value-changed=${this.Jt}
                              allow-custom-entity
                              label="Todo Entity"
                            ></ha-entity-picker>

                            ${r.entity&&""!==r.entity.trim()?d`
                                  <div
                                    style="margin: 8px 0; background: var(--secondary-background-color); border-radius: 4px;"
                                  >
                                    <div class="toggle-option" style="margin: 8px 0;">
                                      <div class="toggle-option-label">Show Title</div>
                                      <ha-switch
                                        .checked=${r.show_title}
                                        data-index=${o}
                                        @change=${this.Zt}
                                      ></ha-switch>
                                    </div>

                                    ${r.show_title?d`
                                          <ha-textfield
                                            label="Title Text"
                                            .value=${r.title}
                                            data-index=${o}
                                            @input=${this.qt}
                                            style="width: 100%; margin-top: 8px;"
                                          ></ha-textfield>
                                        `:""}
                                  </div>

                                  <ha-select
                                    .label=${"Display Order"}
                                    .value=${r.display_order}
                                    data-index=${o}
                                    @selected=${this.Bt}
                                    @closed=${this.Yt}
                                    style="margin-bottom: 4px;"
                                  >
                                    ${this.Ut().map(t=>d`
                                        <mwc-list-item .value=${t.value}>
                                          ${t.label}
                                        </mwc-list-item>
                                      `)}
                                  </ha-select>

                                  <ha-textfield
                                    label="Background Image URL"
                                    .value=${r.background_image}
                                    data-index=${o}
                                    @input=${this.Rt}
                                    style="width: 100%; margin-top: 4px;"
                                    placeholder="Optional: e.g. /local/images/background.jpg"
                                  ></ha-textfield>

                                  ${this.$t?d`
                                        <ha-textfield
                                          label="Custom Icon"
                                          .value=${r.icon}
                                          data-index=${o}
                                          @input=${this.Pt}
                                          style="width: 100%; margin-top: 8px;"
                                          placeholder="Optional: e.g. mdi:cart-variant"
                                        ></ha-textfield>
                                      `:""}
                                `:""}
                          </div>
                        `:""}
                  `})}
          </div>

          <div class="add-entity-button">
            <button
              class="add-todo-button ${"normal"!==this.lt?this.lt:""}"
              @click=${t=>this.ht(t)}
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
              .value=${this.Tt}
              @change=${this.Vt}
              data-config-value="card_spacing"
              suffix="px"
            ></ha-textfield>
            <div class="spacing-help-text">Visual gap between cards when swiping (in pixels)</div>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show pagination dots</div>
            <ha-switch
              .checked=${this.wt}
              data-config-value="show_pagination"
              @change=${this.Lt}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show icons</div>
            <ha-switch
              .checked=${this.$t}
              data-config-value="show_icons"
              @change=${this.Lt}
            ></ha-switch>
          </div>

          <div class="toggle-option">
            <div class="toggle-option-label">Show 'Add item' field</div>
            <ha-switch
              .checked=${this.bt}
              data-config-value="show_create"
              @change=${this.Lt}
            ></ha-switch>
          </div>

          ${this.bt?d`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show '+' add button next to field</div>
                    <ha-switch
                      .checked=${this.xt}
                      data-config-value="show_addbutton"
                      @change=${this.Lt}
                    ></ha-switch>
                  </div>

                  <div class="toggle-option">
                    <div class="toggle-option-label">Enable search functionality</div>
                    <ha-switch
                      .checked=${this.zt}
                      data-config-value="enable_search"
                      @change=${this.Lt}
                    ></ha-switch>
                  </div>
                </div>
              `:""}

          <div class="toggle-option">
            <div class="toggle-option-label">Show completed items</div>
            <ha-switch
              .checked=${this.yt}
              data-config-value="show_completed"
              @change=${this.Lt}
            ></ha-switch>
          </div>

          ${this.yt?d`
                <div class="nested-toggle-option">
                  <div class="toggle-option">
                    <div class="toggle-option-label">Show 'Delete completed' button</div>
                    <ha-switch
                      .checked=${this.kt}
                      data-config-value="show_completed_menu"
                      @change=${this.Lt}
                    ></ha-switch>
                  </div>

                  ${this.kt?d`
                        <div class="nested-toggle-option">
                          <div class="toggle-option">
                            <div class="toggle-option-label">Show delete confirmation dialog</div>
                            <ha-switch
                              .checked=${this._t}
                              data-config-value="delete_confirmation"
                              @change=${this.Lt}
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
    `}}customElements.define("todo-swipe-card",TodoSwipeCard),customElements.define("todo-swipe-card-editor",TodoSwipeCardEditor),window.customCards||(window.customCards=[]),window.customCards.some(t=>"todo-swipe-card"===t.type)||window.customCards.push({type:"todo-swipe-card",name:"Todo Swipe Card",preview:!0,description:"A specialized swipe card for to-do lists"}),console.info(`%c TODO-SWIPE-CARD %c v${t} %c - A swipeable card for to-do lists`,"color: white; background: #4caf50; font-weight: 700;","color: #4caf50; background: white; font-weight: 700;","color: grey; background: white; font-weight: 400;");export{TodoSwipeCard,TodoSwipeCardEditor};
