import{k as a,o}from"./chunk-I5YWVGZK.js";import l from"./tabgroup-updator-BSQZAEDQ.css"with{type:"css"};var r=class extends HTMLElement{titleInput;constructor(t,e){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[l],this.tabGroup=t,this.tabIds=e}async updateGroup(){try{let t=this.tabGroup?.id??await chrome.tabs.group({tabIds:this.tabIds,createProperties:{windowId:globalThis.windowId}});await chrome.tabGroups.update(t,{collapsed:!1,title:this.titleInput.value,color:this.color}),this.remove(),$("marked-action")?.remove()}catch(t){console.error(t)}}onColorPick({target:t}){this.color=t.value}render(){let t=e=>o`<label style="--clr:${e}">
			<input type="radio" name="group-color" value="${e}" hidden />
		</label>`;return o`<div class="color-box" @change=${this.onColorPick.bind(this)}>${a.map(t)}</div>
			<input
				type="text"
				part="title-input"
				list="group_titles"
				value="${this.tabGroup?.title??""}"
				ref=${e=>this.titleInput=e}
				placeholder="${i18n("update_tabgroup_title")}" />
			<button @click=${this.updateGroup.bind(this)}>${this.tabGroup?"Update":"Create"}</button>
			<datalist id="group_titles"></datalist>`}connectedCallback(){this.id="tabgroup-updator",this.style.padding="0.6em",this.setAttribute("popover",""),this.shadowRoot.replaceChildren(this.render()),this.addDataList(),this.showPopover(),$on(this,"toggle",t=>t.newState==="closed"&&this.remove())}async addDataList(){try{let{tabGroups:t}=await getStore("tabGroups");if(!t)return;let e=new DocumentFragment;for(let i of Object.keys(t)){let s=document.createElement("option");s.value=i,e.appendChild(s)}this.shadowRoot.lastElementChild.appendChild(e)}catch(t){console.error(t)}}};customElements.define("tabgroup-updator",r);export{r as a};
