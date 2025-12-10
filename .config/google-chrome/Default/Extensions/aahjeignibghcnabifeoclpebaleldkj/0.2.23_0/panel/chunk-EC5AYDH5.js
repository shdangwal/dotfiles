import{f as r,i as a,j as h,n as p,o,p as m}from"./chunk-I5YWVGZK.js";var d=class extends HTMLElement{constructor(){super()}onWindowSwitch(i){globalThis.windowId=+i.target.value,fireEvent(document.body,"windowswitch",globalThis.windowId)}onWindowClick({target:i}){if(!i.closest("vt-icon"))return;let t=i.closest("li"),e=new s(t.textContent);return $on(e,"update",({detail:n})=>{t.firstElementChild.textContent=n;let w=+t.id;h({[w]:n}),this.crtWindowId===w&&($(".win-title").textContent=n.slice(0,10))}),this.firstElementChild.appendChild(e)}addWindow({id:i}){this.windows.push(i)}removeWindow(i){let t=this.windows.findIndex(e=>e.id===i);this.windows.splice(t,1)}render(i){let t=e=>o`<li id="${e}">
				<label>
					<input type="radio" name="window" value="${e}" hidden />
					<span>${i[e]?.slice(0,12)??e}</span>
				</label>
				<vt-icon ico="edit"></vt-icon>
			</li>`;return o`<window-list-popup
				id="window-list"
				style="left:2em"
				@change=${this.onWindowSwitch.bind(this)}
				@click=${this.onWindowClick.bind(this)}
				popover>
				${m(this.windows,t)}
			</window-list-popup>
			<div style="padding-top: 0.2em;">
				<span class="win-title">${i[this.crtWindowId]?.slice(0,11)??this.crtWindowId}</span>
				<button popovertarget="window-list">
					<vt-icon ico="chev-down" title="Switch window" toggle></vt-icon>
				</button>
			</div>`}async connectedCallback(){let i=(await chrome.windows.getAll({windowTypes:["normal"]})).map(e=>e.id);this.windows=p(i),this.crtWindowId=(await chrome.windows.getCurrent()).id;let t=await a(null);t[this.crtWindowId]??=i18n("this_window"),this.replaceChildren(this.render(t)),this.setListener(),$(`input[value="${this.crtWindowId}"]`,this).checked=!0,$on(this.firstElementChild,"toggle",e=>e.newState==="closed"&&($('vt-icon[ico="chev-down"]',this).checked=!1))}setListener(){chrome.windows.onCreated.addListener(this.addWindow.bind(this),{windowTypes:["normal"]}),chrome.windows.onRemoved.addListener(this.removeWindow.bind(this),{windowTypes:["normal"]})}};customElements.define("window-list",d);var s=class extends HTMLDialogElement{constructor(i){super(),this.winName=i}updateWindow(){fireEvent(this,"update",$("input",this).value),this.remove()}async showEmojiPicker({target:i}){if(this.emojiPicker)return this.emojiPicker.showPopover();let{EmojiPicker:t}=await import("./emoji-picker-GN6LRT62.js");this.emojiPicker=new t,i.before(this.emojiPicker)}render(){return o`<h2>${i18n("update_window_name")}</h2>
			<label>
				<span>${i18n("name")}</span> <br />
				<input type="text" />
				<span class="emoji-btn" title="Pick emoji" @click=${this.showEmojiPicker.bind(this)}> 😃 </span>
			</label>
			<div>
				<button class="outline-btn" @click=${this.remove.bind(this)}>${i18n("cancel")}</button>
				<button @click=${this.updateWindow.bind(this)}>${i18n("update")}</button>
			</div>`}connectedCallback(){this.id="update-win-dialog",this.replaceChildren(this.render()),this.showModal(),$on(this,"toggle",i=>i.newState==="closed"&&this.remove())}};customElements.define("update-window-dialog",s,{extends:"dialog"});var l=class extends HTMLElement{constructor(i,t){super(),this.tabIds=i,this.tabGroupId=t}async moveToWindow({target:i}){try{let n={index:-1,windowId:+i.value||(await chrome.windows.create({state:"maximized"})).id};this.tabIds?await chrome.tabs.move(this.tabIds,n):this.tabGroupId&&await r(this.tabGroupId,n),this.remove(),$("marked-action")?.remove()}catch{console.error()}}onWindowClick({target:i}){let t=i.closest("li");if(t.id==="newWindow")return this.moveToWindow({target:i});if(!i.closest("vt-icon"))return;let e=new s(t.textContent);return $on(e,"update",({detail:n})=>t.firstElementChild.textContent=n),this.firstElementChild.appendChild(e)}render(){let i=t=>o`<li>
			<label><input type="radio" name="window" value="${t}" hidden /><span>${t}</span></label>
			<vt-icon ico="edit" title="Rename window"></vt-icon>
		</li>`;return o`<li>
				<select name="position" disabled>
					<option value="-1">window's end</option>
					<option value="5">window's middle</option>
					<option value="0">window's start</option>
				</select>
			</li>
			${this.windowIds.map(i)}
			<li id="newWindow">
				<cite>${i18n("new_window")}</cite>
				<tv-icon ico="plus"></tv-icon>
			</li>`}async connectedCallback(){this.id="window-select",this.style.left="4em",this.setAttribute("popover",""),this.windowIds=(await chrome.windows.getAll({windowTypes:["normal"]})).map(({id:i})=>i),this.replaceChildren(this.render()),this.showPopover(),$on(this,"change",this.moveToWindow),$on(this,"click",this.onWindowClick),$on(this,"toggle",i=>i.newState==="closed"&&this.remove())}};customElements.define("window-select",l);export{d as a,l as b};
