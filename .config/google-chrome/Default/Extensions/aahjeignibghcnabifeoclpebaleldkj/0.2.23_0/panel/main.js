import{c as ht,g as K}from"./chunk-EEQB4VOH.js";import{a as pt}from"./chunk-IWICVUV6.js";import{a as ut,b as mt}from"./chunk-EC5AYDH5.js";import{a as r,b as P,c as g,d as u,e as D,g as f,h as m,l as lt,m as dt,n as W,o as c,p as Z}from"./chunk-I5YWVGZK.js";import{a as Mt,b as Lt}from"./chunk-EK7ODJWE.js";var wt=Mt(bt=>{globalThis.eId=document.getElementById.bind(document);globalThis.fireEvent=(s,t,e)=>s.dispatchEvent(e?new CustomEvent(t,{detail:e}):new CustomEvent(t));globalThis.$on=(s,t,e)=>s.addEventListener(t,e);globalThis.$onO=(s,t,e)=>s.addEventListener(t,e,{once:!0});globalThis.$=(s,t)=>(t||document).querySelector(s);globalThis.i18n=chrome.i18n.getMessage.bind(bt);globalThis.getStore=chrome.storage.local.get.bind(chrome.storage.local);globalThis.setStore=chrome.storage.local.set.bind(chrome.storage.local);var et=eId("snackbar");globalThis.toast=s=>{et.hidden=!1,et.innerText=s,setTimeout(()=>et.hidden=!0,5100)}});var vi=Lt(wt());import gt from"/assets/icons.json"with{type:"json"};var it=class extends HTMLElement{constructor(t){super(),t&&this.setAttribute("ico",t)}get checked(){return this._internals.states.has("checked")}set checked(t){t?this._internals.states.add("checked"):this._internals.states.delete("checked")}set ico(t){this.firstElementChild.innerHTML=gt[t]}render(t){return`<svg  viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">${gt[t]}</svg>`}connectedCallback(){this.innerHTML=this.render(this.getAttribute("ico")),this.hasAttribute("toggle")&&(this._internals=this.attachInternals(),this.addEventListener("click",this.#t.bind(this)))}#t(){this.checked=!this.checked,this.dispatchEvent(new Event("change"))}};customElements?.define("vt-icon",it);var b=(s,t)=>s?.style.setProperty("--grp-clr",lt[t??"grey"]);function H(){chrome.tabs.create({url:"chrome://discards/"})}function U(){chrome.runtime.openOptionsPage()}async function O(){let{TabGroupRuleDialog:s}=await import("./tabgroup-rules-6PBAL65H.js");document.body.appendChild(new s)}async function ft(){if(!await ht())return notify(i18n("create_autogroup_rule_first"),"error");await chrome.runtime.sendMessage("group_all_ungroup_tabs")}var k=async()=>(await r({windowId:globalThis.windowId,active:!0}))[0].index;async function vt(){g({index:await k()})}async function B(){g({index:await k()+1})}async function Tt(){let s=await k(),t=(await r({windowId})).slice(0,s).map(e=>e.id);chrome.tabs.remove(t).catch(e=>console.error(e))}async function yt(){let s=await k(),t=(await r({windowId})).slice(s).map(e=>e.id);chrome.tabs.remove(t).catch(e=>console.error(e))}async function j(){let s=(await r({windowId})).filter(t=>!t.active).map(t=>t.id);chrome.tabs.remove(s).catch(t=>console.error(t))}var N=async()=>(await r({windowId:globalThis.windowId,active:!0}))[0].id;async function kt(){chrome.tabs.duplicate(await N())}async function xt(){chrome.tabs.discard(await N())}async function F(s){s??=await N();let{TabgroupSelect:t}=await import("./tabgroup-select-KETNIX4M.js");document.body.appendChild(new t([s]))}async function z(s){s??=await N();let{WindowSelect:t}=await import("./window-select-CYH65ETX.js");document.body.appendChild(new t([s]))}async function Q(){let s=await chrome.tabs.query({windowId:globalThis.windowId}),t=new Set;s.reduce((e,i)=>(e[i.url]?t.add(i.id):e[i.url]=i.id,e),{}),t.size!==0&&chrome.tabs.remove([...t]).catch(e=>console.error(e))}function It({currentTarget:s}){let t=s.dataset.domain;if(!t)return;let e=[];$("tab-container").tabs.filter(i=>new URL(i.url).host!==t?!0:(e.push(i.id),!1)),u(e),s.remove()}function q(){chrome.tabs.query({currentWindow:!0}).then(s=>s.forEach(({active:t,id:e})=>t||chrome.tabs.discard(e))).catch(s=>console.error(s))}async function Ct(s){let t=s.clipboardData.getData("text/uri-list")||s.clipboardData.getData("text/plain");if(t.startsWith("http")&&URL.canParse(t)){let e=(await r({windowId,url:t}))[0];e?chrome.tabs.update(e.id,{active:!0}):g({url:t,index:await k()}),s.preventDefault()}}async function $t(s){try{let t=(await getStore("tabGroups")).tabGroups||{};if(t[s.title])return;t[s.title]=s.color,await setStore({tabGroups:t})}catch(t){console.error(t)}}var st=class{constructor(){addEventListener("keydown",this.keyUpListener.bind(this))}altKeys={KeyN:B,KeyD:kt,KeyH:xt,KeyG:F,KeyM:z};ctrlShiftKeys={KeyH:q,KeyE:async()=>{let{ImportExportDialog:t}=await import("./import-export-dialog-G6WE4YFT.js");this.importExportDialog=new t,$("window-bar").shadowRoot.appendChild(this.importExportDialog)},keyQ:Tt,KeyF:()=>$('input[type="search"]',$("window-bar").shadowRoot).focus()};ctrlAltKeys={KeyC:()=>{let t=$("tab-container");t.toggleAttribute("compact"),m({compactMode:t.hasAttribute("compact")})},KeyD:Q,KeyO:U,KeyN:vt,KeyR:O,keyS:H,KeyW:yt,KeyQ:j};keyUpListener(t){t.ctrlKey?t.shiftKey?this.ctrlShiftKeys[t.code]?.():(t.altKey||t.metaKey)&&this.ctrlAltKeys[t.code]?.():(t.altKey||t.metaKey)&&this.altKeys[t.code]?.()}};setTimeout(()=>new st,1e3);import Rt from"./alert-box-QPHCQPTR.css"with{type:"css"};var J=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Rt]}show=(t,e="success")=>{this.box.className=e,this.box.children[1].textContent=t,this.showPopover(),setTimeout(()=>this.hidePopover(),4100)};render(){return`<div>
				<svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d='M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z' /></svg>
				<span class="notice-txt"></span>
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="white" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
			</div>`}connectedCallback(){this.id="alert-box",this.setAttribute("popover",""),this.shadowRoot.innerHTML=this.render(),this.box=this.shadowRoot.firstElementChild,this.box.lastElementChild.addEventListener("click",()=>this.hidePopover())}};customElements.define("alert-box",J);var _t=new J;document.body.appendChild(_t);globalThis.notify=_t.show;var{version:Pt,short_name:Dt,update_url:Wt}=chrome.runtime.getManifest(),St=!Wt;function X(s){if(St)return console.error(s);let t="https://bug-collector.noterail.workers.dev/collect-bug",e={id:1,extId:chrome.runtime.id,extName:Dt,extVersion:Pt,message:s.message??s.reason,stack:s.stack,browserOs:navigator.userAgent,catchedAt:new Date().toISOString()},i=new Request(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});fetch(i).then(o=>o.text()).then(o=>console.log(o)).catch(o=>console.log(o))}if(!St){self.addEventListener("error",X),self.addEventListener("unhandledrejection",X);let s={apply:function(e,i,o){return X(o[0]),e.call(i,...o)}};console.error=new Proxy(console.error,s)}var x=class extends HTMLElement{constructor(){super(),this.domains=[]}async fetchDomains(){let t=(await r({windowId:globalThis.windowId})).map(e=>new URL(e.url).host);return[...new Set(t)]}domainItem=t=>c`<li data-domain=${t} @click=${It}>
		<span>${t}</span>
		<vt-icon ico="delete-cross"></vt-icon>
	</li>`;render(t){return t.map(this.domainItem)}connectedCallback(){this.id="filter-tabs",this.style.top="13em",this.setAttribute("popover",""),$on(this,"toggle",t=>{t.newState==="open"&&this.fetchDomains().then(e=>this.replaceChildren(...this.render(e)))}),this.showPopover()}};customElements.define("filter-tabs",x);var I=class s{static byDomainAZ(t,e){let i=new URL(t.url).host,o=new URL(e.url).host;return i<o?-1:i>o?1:0}static byDomainZA(t,e){return t.url>e.url?-1:t.url<e.url?1:0}static byUrlAZ(t,e){return t.url<e.url?-1:t.url>e.url?1:0}static byUrlZA(t,e){return t.url>e.url?-1:t.url<e.url?1:0}static byTitleAZ(t,e){return t.title<e.title?-1:t.title>e.title?1:0}static byTitleZA(t,e){return t.title>e.title?-1:t.title<e.title?1:0}static byTimeAZ(t,e){return t.lastAccessed<e.lastAccessed?-1:t.lastAccessed>e.lastAccessed?1:0}static byTimeZA(t,e){return t.lastAccessed>e.lastAccessed?-1:t.lastAccessed<e.lastAccessed?1:0}static byGroupAZ(t,e){return 0}static sorting(t,e){switch(e){case"domainAZ":t.sort(s.byDomainAZ);break;case"domainZA":t.sort(s.byDomainZA);break;case"titleAZ":t.sort(s.byTitleAZ);break;case"titleZA":t.sort(s.byTitleZA);break;case"timeAZ":t.sort(s.byTimeAZ);break;case"timeZA":t.sort(s.byTimeZA);break;case"reverse":t.reverse();break}let i=[];t.forEach((o,n)=>i.push(chrome.tabs.move(o.id,{index:n}))),Promise.all(i).catch(o=>notify("cannot sort tabs","error"))}};var C=class extends HTMLElement{constructor(){super()}async sortTabs({target:t}){let e=await r({windowId:globalThis.windowId});I.sorting(e,t.closest("li").id)}render(){return c`<li id="domainAZ">
				<vt-icon ico="domain"></vt-icon>
				<span>Domain</span>
				<vt-icon ico="asc"></vt-icon>
			</li>

			<li id="domainZA">
				<vt-icon ico="domain"></vt-icon>
				<span>Domain</span>
				<vt-icon ico="desc"></vt-icon>
			</li>

			<li id="titleAZ">
				<vt-icon ico="web"></vt-icon>
				<span>Title</span>
				<vt-icon ico="asc"></vt-icon>
			</li>
			<li id="titleZA">
				<vt-icon ico="web"></vt-icon>
				<span>Title</span>
				<vt-icon ico="desc"></vt-icon>
			</li>

			<li id="timeAZ">
				<vt-icon ico="recent"></vt-icon>
				<span>${i18n("recent_used")}</span>
				<vt-icon ico="asc"></vt-icon>
			</li>
			<li id="timeZA">
				<vt-icon ico="recent"></vt-icon>
				<span>${i18n("recent_used")}</span>
				<vt-icon ico="desc"></vt-icon>
			</li>

			<li id="reverse">
				<vt-icon ico="reverse"></vt-icon>
				<span>${i18n("reverse")}</span>
				<vt-icon ico="reverse"></vt-icon>
			</li>`}connectedCallback(){this.id="sort-tabs",this.style.top="6.5em",this.setAttribute("popover",""),this.replaceChildren(this.render()),this.showPopover(),$on(this,"click",this.sortTabs)}};customElements.define("sort-tabs",C);var _=class extends HTMLElement{constructor(){super()}tabList;toggleCompactMode(){this.tabList??=$("tab-container"),this.tabList.toggleAttribute("compact"),m({compactMode:this.tabList.hasAttribute("compact")})}switchPanelPosition(){chrome.tabs.create({url:"chrome://settings/appearance#:~:text=side%20panel"})}showFilterTabs({currentTarget:t}){if(this.filterTabs)return this.filterTabs.showPopover();this.filterTabs=new x,t.appendChild(this.filterTabs)}showSortTabs({currentTarget:t}){if(this.sortTabs)return this.sortTabs.showPopover();this.sortTabs=new C,t.appendChild(this.sortTabs)}async showImportExport({currentTarget:t}){if(this.importExportDialog)return this.importExportDialog.showPopover();let{ImportExportDialog:e}=await import("./import-export-dialog-G6WE4YFT.js");this.importExportDialog=new e,t.appendChild(this.importExportDialog)}render(){return c`<more-menu-popup id="more-menu" style="right:2px" popover>
				<li @click=${B}>
					<vt-icon ico="plus"></vt-icon> <span>${i18n("create_tab")}</span> <kbd>Alt+N</kbd>
				</li>
				<li class="sort-tabs-btn" @click=${this.showSortTabs.bind(this)}>
					<vt-icon ico="sort"></vt-icon> <span>${i18n("sort")}</span>
				</li>
				<li @click=${O}>
					<vt-icon ico="group"></vt-icon> <span>${i18n("auto_group_rules")}</span><kbd>Ctrl+Alt+R</kbd>
				</li>
				<li @click=${ft}>
					<vt-icon ico="group-tabs"></vt-icon> <span>${i18n("auto_group_all_ungroup_tabs")}</span>
				</li>
				<li @click=${Q}>
					<vt-icon ico="duplicate"></vt-icon> <span>${i18n("remove_duplicate_tabs")}</span><kbd>Alt+D</kbd>
				</li>
				<li class="filter-tabs-btn" @click=${this.showFilterTabs.bind(this)}>
					<vt-icon ico="filter"></vt-icon> <span>${i18n("filter")}</span>
				</li>
				<li @click=${H}>
					<vt-icon ico="suspend"></vt-icon> <span>${i18n("suspend_manager")}</span><kbd>Ctrl+Alt+S</kbd>
				</li>
				<li @click=${q}>
					<vt-icon ico="sleep"></vt-icon> <span>${i18n("suspend_other_tabs")}</span> <kbd>Ctrl+Shift+H</kbd>
				</li>
				<li @click=${U}>
					<vt-icon ico="settings"></vt-icon> <span>${i18n("settings")}</span><kbd>Ctrl+Alt+O</kbd>
				</li>
				<li @click=${this.toggleCompactMode.bind(this)}>
					<vt-icon ico="compact"></vt-icon> <span>${i18n("compact_mode")} </span><kbd>Ctrl+Alt+C</kbd>
				</li>
				<li @click=${this.switchPanelPosition}>
					<vt-icon ico="panel-position"></vt-icon> <span>${i18n("panel_position")}</span>
				</li>
				<li @click=${this.showImportExport.bind(this)}>
					<vt-icon ico="export"></vt-icon> <span>${i18n("import_export_tab")}</span><kbd>Ctrl+Shift+E</kbd>
				</li>
			</more-menu-popup>
			<button popovertarget="more-menu"><vt-icon ico="menu"></vt-icon></button> `}connectedCallback(){this.replaceChildren(this.render())}};customElements.define("more-menu",_);function Zt(s){let t=[],e,i,o,n,p,h=s.length,a=h;for(;--a;){i=s.slice(a),n=s.slice(0,a),p=i.length,e=-1;for(let l=n.length;l>=p;l--)if(o=n.slice(l-p,l),o===i){e=h-l;break}if(e===-1)break;t.push(e)}return t}function Kt(s){let t={},e=s.length;for(let i=0;i<e;i++)t[s[i]]=i;return t}var Y=class{constructor(t){this.needle=t,this.badCharTable=Kt(t),this.goodSuffixTable=Zt(t),this.count=t.length}getGoodShift(t){let e=this.goodSuffixTable[t];return e??=this.goodSuffixTable[this.goodSuffixTable.length-1],e??=this.count,e}searchAll(t){let e=[],i=0,o=t.length-this.count;for(;i<=o;){let n=this.count-1;for(;this.needle[n]===t[i+n]&&(n--===0&&e.push(i),n!==-1););let p=n-(this.badCharTable[t[i+n]]??-1),h=p;if(n!==this.count-1){let a=this.getGoodShift(n);h=Math.max(p,a)}i+=h}return e}};var S=class extends HTMLElement{inputField;constructor(){super(),this.highlighter=new Highlight,CSS.highlights.set("search-highlight",this.highlighter)}highlightMatchRange(t,e){let i=this.inputField.value.length;for(let o of t){if(o+i>e.length)continue;let n=new Range;n.setStart(e,o),n.setEnd(e,o+i),this.highlighter.add(n)}}searchTab(t){this.highlighter.clear();for(let e of this.tabContainer.shadowRoot.children){let i=t.searchAll(e.tab.title.toLowerCase()),o=t.searchAll(e.tab.url.slice(8).toLowerCase());if(i.length===0&&o.length===0)e.hidden=!0;else{e.hidden&&(e.hidden=!1);let n=e.lastElementChild.previousElementSibling.lastElementChild.firstElementChild;i.length===0||this.highlightMatchRange(i,n.firstChild),o.length===0||this.highlightMatchRange(o,n.nextElementSibling.firstChild)}}}searchQuery({target:t}){let e=t.value.toLowerCase();if(e){let i=new Y(e);this.searchTab(i)}else this.reset()}reset(){this.highlighter.clear();for(let t of this.tabContainer.shadowRoot.children)t.hidden&&(t.hidden=!1)}showSearchBox(){this.inputField.focus()}render(){return c`<search>
				<input
					type="search"
					placeholder="🔎 ${i18n("search_tabs")}"
					ref=${t=>this.inputField=t}
					@input=${this.searchQuery.bind(this)} />
			</search>
			<vt-icon ico="search" @click=${this.showSearchBox.bind(this)}></vt-icon>`}connectedCallback(){this.style.position="relative",this.replaceChildren(this.render()),this.tabContainer=$("tab-container")}};customElements.define("search-tabs",S);var E=class extends HTMLElement{constructor(){super()}createWorkspace(){let t=new A;return $on(t,"create",async({detail:e})=>{let i={id:Math.random().toString(36).slice(2),name:e},o=(await f("workspaces")).workspaces??[];o.push(i),m({workspaces:o}),this.workspaces.splice(0,0,i),this.switchWorkspace(i.id),this.firstElementChild.hidePopover(),$(".workspace",this).textContent=i.name,$(`input[value="${i.id}"]`,this).checked=!0}),this.firstElementChild.appendChild(t)}async switchWorkspace(t){let e=await r({windowId:-2}),i=new Map((await D({windowId:-2})).map(a=>[a.id,a.title]));setStore({[this.atvWorkspaceId]:e.map(a=>({url:a.url,groupTitle:i[a.groupId]}))}),this.atvWorkspaceId=t,m({atvWorkspaceId:this.atvWorkspaceId});let o=(await getStore(t))[t]??[];if(o.length===0)return g({index:0,active:!1});e.length>o.length&&await u(e.slice(o.length).map(a=>a.id)),toast("Restoring...");let n={},p=$("tab-container");async function h(a){let{id:l}=await chrome.tabs.discard(a),T=p.shadowRoot.getElementById(String(a));T.id=l,T.tab.id=l}try{for(let a=0;a<o.length;a++){let l=o[a],{id:T}=e[a]?await chrome.tabs.update(e[a].id,{url:l.url}):await g({url:l.url,active:!1});if(l.groupTitle)if(n[l.groupTitle])await chrome.tabs.group({tabIds:T,groupId:n[l.groupTitle]});else{let R=await chrome.tabs.group({tabIds:T});await chrome.tabGroups.update(R,{title:l.groupTitle,color:"cyan"}),n[l.groupTitle]=R}await new Promise(R=>setTimeout(R,1e3)),await h(T)}notify("Workspace switched")}catch(a){console.error(a),document.body.appendChild(new K(a))}}onWorkspaceChange(t){let e=t.target.value;this.switchWorkspace(e),$(".workspace",this).textContent=t.target.nextElementSibling.textContent}onWorkspaceClick({target:t}){if(t.closest("vt-icon")){let e=t.closest("li"),i=new A(e.textContent),o=async({detail:n})=>{e.firstElementChild.textContent=n;let p=$("input",e).value,{workspaces:h}=await f("workspaces"),a=h.findIndex(l=>l.id===p);h[a].title=n,m({workspaces:h})};return $on(i,"update",o),this.firstElementChild.appendChild(i)}}render(t){let e=i=>c`<li>
				<label>
					<input type="radio" name="workspace" value="${i.id}" hidden />
					<span>${i.name.slice(0,12)}</span>
				</label>
				<vt-icon ico="edit"></vt-icon>
			</li>`;return c`<workspaces-popup
				id="workspaces"
				@change=${this.onWorkspaceChange.bind(this)}
				@click=${this.onWorkspaceClick.bind(this)}
				popover>
				${Z(this.workspaces,e)}
				<li @click=${this.createWorkspace.bind(this)}>
					<vt-icon ico="plus"></vt-icon><span>Create workspace</span>
				</li>
			</workspaces-popup>
			<div style="padding-top: 0.2em;">
				<span class="workspace">${t.slice(0,10)}</span>
				<button popovertarget="workspaces">
					<vt-icon ico="chev-down" title="switch workspace" toggle></vt-icon>
				</button>
			</div>`}async connectedCallback(){let{workspaceOn:t,workspaces:e,atvWorkspaceId:i}=await f(["workspaceOn","workspaces","atvWorkspaceId"]);if(!t)return;this.workspaces=W(e??[]),this.workspaces.length===0&&this.workspaces.push({id:"workspace",name:"Workspace"}),this.atvWorkspaceId=i||this.workspaces[0].id;let o=e?.find(n=>n.id===i)?.name??i18n("workspace");this.replaceChildren(this.render(o)),$(`input[value="${this.atvWorkspaceId}"]`,this).checked=!0,$on(this.firstElementChild,"toggle",n=>n.newState==="closed"&&($('vt-icon[ico="chev-down"]',this).checked=!1))}};customElements.define("workspace-tabs",E);var A=class extends HTMLDialogElement{constructor(t){super(),this.workspace=t}updateWorkspace(){fireEvent(this,this.workspace?"update":"create",$("input",this).value),this.remove()}async showEmojiPicker({target:t}){if(this.emojiPicker)return this.emojiPicker.showPopover();let{EmojiPicker:e}=await import("./emoji-picker-GN6LRT62.js");this.emojiPicker=new e,t.before(this.emojiPicker)}render(){return c`<h2>${this.workspace?"Update":"Create"} ${i18n("workspace")}</h2>
			<label>
				<span>${i18n("name")}</span> <br />
				<input type="text" />
				<span class="emoji-btn" title="Pick emoji" @click=${this.showEmojiPicker.bind(this)}> 😃 </span>
			</label>
			<div>
				<button class="outline-btn" @click=${this.remove.bind(this)}>${i18n("cancel")}</button>
				<button @click=${this.updateWorkspace.bind(this)}>
					${this.workspace?i18n("update"):i18n("create")}
				</button>
			</div>`}connectedCallback(){this.id="update-workspace-dialog",this.replaceChildren(this.render()),this.showModal(),$on(this,"toggle",t=>t.newState==="closed"&&this.remove())}};customElements.define("update-workspace-dialog",A,{extends:"dialog"});import Ht from"./window-bar-QFG34U26.css"with{type:"css"};var Et,G=s=>Et.firstChild.data=s,ot=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Ht]}render(){return[c`<div class="tab-coin">
			<div class="coin-ring">
				<div class="tab-num" ref=${e=>Et=e}>0</div>
			</div>
		</div>`,new ut,new E,new S,new _]}async connectedCallback(){this.shadowRoot.replaceChildren(...this.render())}};customElements.define("window-bar",ot);var w;function nt(s){w??=$("tab-container"),s.theme&&s.theme!=="none"?w.style.setProperty("--tab-bgc",`url(${dt+s.theme+".svg"})`):w.style.removeProperty("--tab-bgc"),s.fontFamily&&w.style.setProperty("--font-family",s.fontFamily),s.fontSize&&w.style.setProperty("--font-size",s.fontSize),s.textColor&&w.style.setProperty("--txt-clr",s.textColor)}chrome.runtime.onMessage.addListener((s,t,e)=>{s.msg==="config"&&nt(s)});async function Ut(s){w??=$("tab-container");let t=await r({windowId});function e(i){chrome.tabs.discard(i).then(o=>{let n=w.shadowRoot.getElementById(String(i));n.id=o.id,n.tab.id=o.id}).catch(o=>console.error(o))}t.forEach(i=>{if(!i.discarded){if(!i.lastAccessed)return e(i.id);Date.now()>i.lastAccessed+s&&e(i.id)}})}chrome.storage.sync.get(["autoSuspensionOn","autoSuspensionTime"]).then(s=>{let{autoSuspensionOn:t,autoSuspensionTime:e}=s;if(!t)return;let i=(e??30)*60*1e3;t&&setInterval(()=>Ut,5*60*60*1e3,i)});import Ot from"./marked-action-BXXJLEWR.css"with{type:"css"};var d=new Set;function At(s){let t=s.target.checked,e=+s.target.parentElement.id;t?(d.add(e),d.size===1?document.body.appendChild(new V):M.setCount()):(d.delete(e),d.size===0?M.remove():M.setCount())}var M,V=class extends HTMLElement{countElem;constructor(){super(),this.status="active",this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Ot],this.marktabs=null,M=this}async closeTabs(){try{await u([...d]),this.clear(),notify(d.size+" tabs closed")}catch(t){console.error(t)}}async suspendTabs(){let t=[];for(let e of d)t.push(chrome.tabs.discard(e));try{await Promise.allSettled(t),notify(d.size+" tabs suspended")}catch(e){console.error(e)}this.resetMarked()}resetMarked(){fireEvent(document.body,"unselectall"),this.clear()}clear(){d.clear(),this.remove(),M=null}async addInGroup(){let{TabgroupSelect:t}=await import("./tabgroup-select-KETNIX4M.js");this.shadowRoot.appendChild(new t([...d]))}async moveToOtherWindow(){let{WindowSelect:t}=await import("./window-select-CYH65ETX.js");this.shadowRoot.appendChild(new t([...d]))}setCount(){this.countElem.textContent=d.size}render(){return c`<div class="marked-card">
			<div><output ref=${t=>this.countElem=t}>1</output> ${i18n("selected")}</div>
			<div class="marked-action-wrapper">
				<vt-icon ico="group" title="${i18n("add_tabs_to_group")}" @click=${this.addInGroup.bind(this)}></vt-icon>
				<vt-icon
					ico="windows"
					title="${i18n("move_tabs_to_window")}"
					@click=${this.moveToOtherWindow.bind(this)}></vt-icon>
				<vt-icon ico="suspend" title="${i18n("suspend_selected_tabs")}" @click=${this.suspendTabs}></vt-icon>
				<vt-icon ico="delete" title="${i18n("close_selected_tabs")}" @click=${this.closeTabs}></vt-icon>
			</div>
			<vt-icon
				ico="close"
				title="${i18n("unselect_all")}"
				style="margin-left: auto;"
				@click=${this.resetMarked.bind(this)}></vt-icon>
		</div>`}connectedCallback(){this.shadowRoot.replaceChildren(this.render())}};customElements.define("marked-action",V);var v=class extends HTMLElement{constructor(t){super(),this._internals=this.attachInternals(),this.tab=t,this.tabIndex=0,this.id=this.tab.id.toString(),this.pinned=this.tab.pinned,this.suspend=this.tab.discarded}set active(t){t?this._internals.states.add("active"):this._internals.states.delete("active")}set pinned(t){t?this._internals.states.add("pinned"):this._internals.states.delete("pinned")}set collapsed(t){t?this._internals.states.add("collapsed"):this._internals.states.delete("collapsed"),this.nextElementSibling?.tab.groupId===this.tab.groupId&&(this.nextElementSibling.collapsed=t)}set suspend(t){t?this._internals.states.add("suspend"):this._internals.states.delete("suspend")}closeTab(t){t.stopImmediatePropagation(),chrome.tabs.remove(this.tab.id).catch(e=>console.error(e))}suspendTab(){chrome.tabs.discard(this.tab.id).then(t=>{this.id=t.id.toString(),this.tab.id=t.id,toast("Tab suspended")}).catch(t=>console.error(t))}activateTab(){chrome.windows.update(this.tab.windowId,{focused:!0}).catch(t=>console.error(t)),chrome.tabs.update(this.tab.id,{active:!0}).catch(t=>console.error(t))}render(){let t=this.tab;return c`<input
				type="checkbox"
				class="mark-tab"
				tabindex="-1"
				title="${i18n("select_tab")}"
				@change=${At} />
			<tab-info @click=${this.activateTab.bind(this)}>
				<img src=${()=>t.favIconUrl} loading="lazy" @error=${Bt} />
				<div>
					<div class="tab-title">${()=>t.title.replaceAll("<","<")}</div>
					<div class="tab-url">${()=>t.url.slice(8)}</div>
				</div>
			</tab-info>
			<div class="action-btn-box">
				<vt-icon
					ico="sleep"
					class="sleep-btn"
					title="${i18n("suspend_tab")}"
					@click=${this.suspendTab.bind(this)}></vt-icon>
				<vt-icon
					ico="close"
					class="close-btn"
					title="${i18n("close_tab")}"
					@click=${this.closeTab.bind(this)}></vt-icon>
			</div> `}connectedCallback(){this.setAttribute("draggable","true"),this.replaceChildren(this.render())}};customElements.define("tab-item",v);function Bt(){this.src="/assets/web.svg"}function at(s){let t=s.target.closest("tab-item")?.tab;t&&(L??=document.body.appendChild(new tt),L.setTab(t.id,t.index),L.style.left=`min(36%, ${s.pageX}px)`,L.style.top=s.pageY+"px",s.preventDefault())}var L,tt=class extends HTMLElement{constructor(){super(),L=this}setTab(t,e,i){this.tabId=t,this.tabIndex=e,this.windowId=i,setTimeout(()=>this.showPopover(),100)}menuActions={add_previous_tab:()=>chrome.tabs.create({index:this.tabIndex}),add_next_tab:()=>chrome.tabs.create({index:this.tabIndex+1}),add_tab_to_group:()=>F(this.tabId),move_tab_to_window:()=>z(this.tabId),reload:()=>chrome.tabs.reload(this.tabId),duplicate:()=>chrome.tabs.duplicate(this.tabId),pin:()=>chrome.tabs.update({pinned:!0}).catch(t=>console.error(t)),mute:()=>chrome.tabs.update({muted:!0}).catch(t=>console.error(t)),suspend:()=>chrome.tabs.discard(this.tabId).catch(t=>console.error(t)),copy_url:async()=>{let t=(await P(this.tabId)).url;navigator.clipboard.writeText(t).then(()=>toast("Copied")).catch(e=>console.error(e))},close_above_tabs:async()=>{let t=(await r({windowId:this.windowId})).slice(0,this.tabIndex).map(e=>e.id);chrome.tabs.remove(t).catch(e=>console.error(e))},close_below_tabs:async()=>{let t=(await r({windowId:this.windowId})).slice(this.tabIndex).map(e=>e.id);chrome.tabs.remove(t).catch(e=>console.error(e))},close_other_tabs:j};async onMenuItemClick({target:t}){let e=t.closest("li")?.id;e&&(await this.menuActions[e](),this.hidePopover())}render(){let t=i=>c`<li id=${i.id}>
			<vt-icon ico="${i.icon}" title="edit group"></vt-icon>
			<span>${i.title}</span>
			<kbd>${i.keyShortcut}</kbd>
		</li>`;return[{id:"add_previous_tab",icon:"plus",title:i18n("new_tab_above"),keyShortcut:"Ctrl+Alt+N"},{id:"add_next_tab",icon:"tab-plus",title:i18n("new_tab_below"),keyShortcut:"Alt+N"},{id:"add_tab_to_group",icon:"group",title:i18n("add_tab_to_group"),keyShortcut:"Alt+G"},{id:"move_tab_to_window",icon:"move",title:i18n("move_tab_to_window"),keyShortcut:"Alt+M"},{id:"reload",icon:"reload",title:i18n("reload_tab"),keyShortcut:"Ctrl+R"},{id:"duplicate",icon:"duplicate",title:i18n("duplicate_tab"),keyShortcut:"Alt+D"},{id:"pin",icon:"pin",title:i18n("pin_tab"),keyShortcut:""},{id:"mute",icon:"mute",title:i18n("mute_tab"),keyShortcut:""},{id:"suspend",icon:"sleep",title:i18n("suspend_tab"),keyShortcut:"Alt+H"},{id:"copy_url",icon:"copy",title:i18n("copy_url"),keyShortcut:"Ctrl+C"},{id:"close_above_tabs",icon:"close-multiple",title:i18n("close_above_tabs"),keyShortcut:"Ctrl+Shift+Q"},{id:"close_below_tabs",icon:"close-multiple",title:i18n("close_below_tabs"),keyShortcut:"Ctrl+Alt+W"},{id:"close_other_tabs",icon:"close-multiple",title:i18n("close_other_tabs"),keyShortcut:"Ctrl+Alt+Q"}].map(t)}connectedCallback(){this.replaceChildren(...this.render()),this.setAttribute("popover",""),$on(this,"click",this.onMenuItemClick)}};customElements.define("tabaction-menu",tt);var jt="/assets/spin.svg",Gt=s=>class extends s{groupMap=new Map;activeTab;onCreateTab(t){this.tabs.splice(t.index,0,t),G(this.tabs.length)}updateTab(t,e,i){if(e.groupId)e.groupId===-1?this.removeGroupFromTab(this.shadowRoot.children[i.index]):this.updateGroupInfoOnTab(i.index,e.groupId);else if(e.status){if(this.tabs[i.index].favIconUrl=e.status==="loading"?jt:i.favIconUrl,e.discarded!==void 0)return setTimeout(()=>this.shadowRoot.getElementById(String(t)).suspend=e.discarded,100)}else if(e.pinned!==void 0)return this.shadowRoot.getElementById(String(t)).pinned=e.pinned;this.tabs[i.index]&&Object.assign(this.tabs[i.index],e)}onmoveTab(t,e){let i=this.tabs[e.fromIndex];this.tabs.splice(e.fromIndex,1);for(let o=e.fromIndex;o<this.tabs.length;o++)--this.tabs[o].index;i.index=e.toIndex,this.tabs.splice(e.toIndex,0,i);for(let o=e.toIndex+1;o<this.tabs.length;++o)++this.tabs[o].index;i.groupId===-1||this.updateGroupInfoOnTab(i.index,i.groupId)}onDetachTab(t){this.tabs.splice(t.oldPosition,1)}async onAttachTab(t,e){let i=await P(t);this.tabs.splice(e.newPosition,0,i)}onRemoveTab(t){let e=this.tabs.findIndex(i=>i.id===t);e!==-1&&(this.tabs.splice(e,1),G(this.tabs.length))}activateTab(t){this.activeTab&&(this.activeTab.active=!1),this.activeTab=this.shadowRoot.getElementById(String(t)),this.activeTab.active=!0}removeGroupFromTab(t){if(t.firstElementChild.tagName==="GROUP-BAR"){let e=t.tab.groupId,i=this.groupMap.get(e);i&&t.nextElementSibling?.tab.groupId===e&&t.nextElementSibling.prepend(i),t.style.removeProperty("--grp-clr")}}async updateGroupInfoOnTab(t,e){let i=this.shadowRoot.children[t],o=await chrome.tabGroups.get(e).catch(n=>console.error(n));if(o)if(b(i,o.color),this.groupMap.has(e)){let n=this.groupMap.get(e);if(n instanceof v)return this.insertTabGroup(o);n.parentElement.tab.index>i.tab.index&&i.prepend(n)}else this.shadowRoot.hasChildNodes()&&(this.groupMap.set(e,i),this.insertTabGroup(o))}onUpdateGroup(t){let e=this.groupMap.get(t.id);e&&(e.title=t.title,e.color=t.color,e.collapsed=t.collapsed)}onRemoveGroup(t){let e=this.groupMap.get(t.id);e&&(this.groupMap.delete(t.id),e.remove())}setListener(){chrome.tabs.onCreated.addListener(t=>t.windowId===this.windowId&&this.onCreateTab(t)),chrome.tabs.onUpdated.addListener((t,e,i)=>i.windowId===this.windowId&&this.updateTab(t,e,i)),chrome.tabs.onActivated.addListener(t=>t.windowId===this.windowId&&this.activateTab(t.tabId)),chrome.tabs.onRemoved.addListener((t,{windowId:e})=>e===this.windowId&&this.onRemoveTab(t)),chrome.tabs.onMoved.addListener((t,e)=>e.windowId===this.windowId&&this.onmoveTab(t,e)),chrome.tabs.onDetached.addListener((t,e)=>e.oldWindowId===this.windowId&&this.onDetachTab(e)),chrome.tabs.onAttached.addListener((t,e)=>e.newWindowId===this.windowId&&this.onAttachTab(t,e)),chrome.tabGroups.onUpdated.addListener(t=>t.windowId===this.windowId&&this.onUpdateGroup(t)),chrome.tabGroups.onRemoved.addListener(t=>t.windowId===this.windowId&&this.onRemoveGroup(t))}};var y=class extends HTMLElement{constructor(t){super(),this.tabGroup=t,this._internals=this.attachInternals(),this.collapsed=this.tabGroup.collapsed}set title(t){this.tabGroup.title!==t&&(this.tabGroup.title=t,this.children[1].textContent=t)}set color(t){this.tabGroup.color!==t&&(this.tabGroup.color=t,this.updateGroupTabsClr(t))}get collapsed(){return this._internals.states.has("collapsed")}set collapsed(t){t?this._internals.states.add("collapsed"):this._internals.states.delete("collapsed"),this.tabGroup.collapsed!==t&&(this.tabGroup.collapsed=t,this.parentElement.collapsed=this.collapsed)}toggleGroup(){this.collapsed=!this.tabGroup.collapsed,this.tabGroup.collapsed=this.collapsed,chrome.tabGroups.update(this.tabGroup.id,{collapsed:this.collapsed})}updateGroup({detail:t}){this.title=t.title,this.color=t.color,chrome.tabGroups.update(this.tabGroup.id,{title:t.title,color:t.color})}async unGroupTab(){let t=(await r({groupId:this.tabGroup.id})).map(({id:e})=>e);await chrome.tabs.ungroup(t).catch(e=>console.error(e))}async removeTabs(){let t=(await r({groupId:this.tabGroup.id})).map(({id:e})=>e);await chrome.tabs.remove(t).catch(e=>console.error(e))}async suspendGroup(){try{let t=[],e=await r({groupId:this.tabGroup.id});for(let i of e)t.push(chrome.tabs.discard(i.id));await Promise.all(t),notify("Tabgroup suspended")}catch(t){console.error(t)}}moveTabGroup(){this.appendChild(new mt(null,this.tabGroup.id))}editTabGroup(){this.appendChild(new pt(this.tabGroup))}render(){return c`<vt-icon
				ico="chev-down"
				class="collapse-btn"
				title="${i18n("collapse/uncollapse_group")}"
				@click=${this.toggleGroup.bind(this)}></vt-icon>
			<span>${this.tabGroup.title}</span>
			<div class="group-action">
				<vt-icon ico="edit" title="${i18n("edit_group")}" @click=${this.editTabGroup.bind(this)}></vt-icon>
				<vt-icon
					ico="windows"
					title="${i18n("move_group_to_window")}"
					@click=${this.moveTabGroup.bind(this)}></vt-icon>
				<vt-icon
					ico="suspend"
					title="${i18n("suspend_tabgroup")}"
					@click=${this.suspendGroup.bind(this)}></vt-icon>
				<vt-icon ico="ungroup" title="${i18n("ungroup_tabs")}" @click=${this.unGroupTab.bind(this)}></vt-icon>
				<vt-icon ico="delete" title="${i18n("delete_group")}" @click=${this.removeTabs.bind(this)}></vt-icon>
			</div>`}connectedCallback(){this.setAttribute("tabindex","0"),this.replaceChildren(this.render()),b(this.parentElement,this.tabGroup.color),setTimeout($t,100,this.tabGroup)}updateGroupTabsClr(t){b(this.parentElement,t);let e=this.parentElement.nextElementSibling;for(;e?.tab.groupId===this.tabGroup.id;)b(e,t),e=e.nextElementSibling}};customElements.define("group-bar",y);import Nt from"./tab-container-HC4YG376.css"with{type:"css"};import Ft from"./tab-item-2YWBHU6I.css"with{type:"css"};var rt,ct=class extends Gt(HTMLElement){constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[Nt,Ft],f("theme").then(t=>nt(t))}render(t){return c`${Z(this.tabs,e=>{let i=new v(e);return e.groupId!==-1&&(this.groupMap.has(e.groupId)||this.groupMap.set(e.groupId,i),b(i,t.get(e.groupId))),i})}`}async connectedCallback(){let{compactMode:t}=await f("compactMode");t&&this.setAttribute("compact",""),this.windowId=(await chrome.windows.getCurrent()).id,this.setWindowTabs(this.windowId),this.setListener(),$on(this.shadowRoot,"contextmenu",at),$on(this.shadowRoot,"dragstart",({target:e})=>rt=e.closest("tab-item").id),$on(this.shadowRoot,"dragover",e=>e.preventDefault()),$on(this.shadowRoot,"drop",this.setDropped.bind(this)),$on(this.shadowRoot,"auxclick",e=>e.which===2&&u(+e.target.closest("tab-item").id)),$on(document.body,"windowswitch",({detail:e})=>this.setWindowTabs(e)),$on(document.body,"unselectall",()=>{for(let e of this.shadowRoot.children)e.firstElementChild.checked=!1}),addEventListener("paste",Ct)}async setWindowTabs(t){this.windowId=t,this.groupMap.clear();try{let e=await r({windowId:t}),i=await D({windowId:t}),o=new Map(i.map(n=>[n.id,n.color]));this.tabs=W(e),this.shadowRoot.replaceChildren(this.render(o)),this.groupMap.size===0||i.forEach(this.insertTabGroup,this),r({active:!0,windowId:t}).then(n=>this.activateTab(n[0].id)),G(e.length)}catch(e){console.error(e),document.body.appendChild(new K(e))}}groupMap=new Map;insertTabGroup(t){if(!this.groupMap.has(t.id))return;let e=new y(t);this.groupMap.get(t.id).prepend(e),this.groupMap.set(t.id,e),$on(e,"remove",({detail:i})=>this.onRemoveGroup(i))}async setDropped({target:t}){let e=t.closest("tab-item").tab.index;await chrome.tabs.move(+rt,{index:e}).catch(i=>notify("cannot move tab","error")).finally(()=>rt=null)}};customElements.define("tab-container",ct);import zt from"./base-ERUOT5RD.css"with{type:"css"};import Qt from"./snackbar-CLPBJTKZ.css"with{type:"css"};document.adoptedStyleSheets.push(zt,Qt);globalThis.windowId=-2;
