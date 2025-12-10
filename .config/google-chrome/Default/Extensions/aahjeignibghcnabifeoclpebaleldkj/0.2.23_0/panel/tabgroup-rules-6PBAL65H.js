import{a as v,b as f,d as y,e as r,f as _,g as x}from"./chunk-EEQB4VOH.js";import{a as g,e as h,k as b,n as R,o as a,p as w}from"./chunk-I5YWVGZK.js";import"./chunk-EK7ODJWE.js";var p=class{constructor(){}async getUrls(){let e=await g({});this.tabUrls=e.map(t=>new URL(t.url)),this.titles=e.map(t=>t.title)}topDomains(){return this.tabUrls.map(e=>e.host.slice(e.host.lastIndexOf(".",e.host.lastIndexOf(".")-1)+1))}domains(){return this.tabUrls.map(e=>e.host)}firstPathSegments(){return this.tabUrls.map(e=>e.pathname.slice(1,e.pathname.indexOf("/",1)))}twoPathSegments(){return this.tabUrls.map(e=>e.pathname.slice(1,e.pathname.indexOf("/",e.pathname.indexOf("/",1)+1)))}titleWords(){return this.titles.flatMap(e=>e.split(" ").filter(t=>t.length>3))}};var u=class extends HTMLElement{constructor(e){super(),this.groupRule=e}editGroupRule(){let e=new n(this.groupRule);this.parentElement.parentElement.appendChild(e)}async deleteGroupRule(){try{await _(this.groupRule.id),this.remove()}catch(e){console.error(e)}}updateRuleProp={name:({target:e})=>{r(this.groupRule.id,"name",e.value),this.groupRule.name=e.value},ctmGroupName:async({target:e})=>{r(this.groupRule.id,"ctmGroupName",e.value);let t=await h({title:this.groupRule.ctmGroupTitle});this.groupRule.ctmGroupTitle=e.value,t.length!==0&&chrome.tabGroups.update(t[0].id,{title:e.value})},color:async({target:e})=>{r(this.groupRule.id,"color",e.value);let t=await h({title:this.groupRule.ctmGroupTitle});this.groupRule.color=e.value,t.length!==0&&chrome.tabGroups.update(t[0].id,{color:e.value})}};toggleGroupRule({target:e}){r(this.groupRule.id,"enabled",e.checked)}render(){let t=(()=>{let i=[...Object.keys(this.groupRule.urlMatches)];return this.groupRule.titleIncludes.length===0||i.push("title"),i.join(",")})();return a`<input type="checkbox" name="" class="toggle_rule" @change=${this.toggleGroupRule.bind(this)} />
			<rule-details>
				<div class="left-column">
					<label>
						<span>${i18n("name")}:</span>
						<input type="text" value=${this.groupRule.name} @change=${this.updateRuleProp.name} />
					</label>
					<label>
						<span>${i18n("group")}:</span>
						<input
							type="text"
							value="${this.groupRule.ctmGroupTitle??"auto"}"
							@change=${this.updateRuleProp.ctmGroupName} />
					</label>
					<label>
						<span>${i18n("priority")}:</span>
						<input type="number" value=${this.groupRule.priority} @change=${this.updateRuleProp.priority} />
					</label>
				</div>
				<div class="center-column"></div>
				<div class="right-column">
					<div>
						<span>${i18n("matches")}:</span>
						<var title="${t}">${t.slice(0,10)}</var>
					</div>
					<label>
						<span>${i18n("color")}:</span>
						<select id="color_select" .value=${this.groupRule.color} @change=${this.updateRuleProp.color}>
							<option value="blue">blue</option>
							<option value="red">red</option>
							<option value="yellow">yellow</option>
							<option value="green">green</option>
							<option value="cyan">cyan</option>
							<option value="purple">purple</option>
							<option value="pink">pink</option>
							<option value="orange">orange</option>
							<option value="grey">grey</option>
						</select>
					</label>
					<div style="justify-content: end">
						<vt-icon
							ico="edit"
							title="${i18n("edit_rule")}"
							class="edit-icon"
							@click=${this.editGroupRule.bind(this)}></vt-icon>
						<vt-icon
							ico="delete"
							title="${i18n("delete_rule")}"
							class="delete-icon"
							@click=${this.deleteGroupRule.bind(this)}></vt-icon>
					</div>
				</div>
			</rule-details>`}connectedCallback(){this.id=this.groupRule.id,this.replaceChildren(this.render()),this.groupRule.enabled&&(this.firstElementChild.checked=!0)}};customElements.define("tabgroup-rule",u);async function k(o){let e=new u(o),t=$("#r"+o.id,m);t?t.replaceWith(e):m.appendChild(e),(await getStore("autoGroupingOn")).autoGroupingOn||(await new Promise(i=>setTimeout(i,2e3)),chrome.runtime.sendMessage({msg:"toggle_auto_grouping",autoGroupingOn:!0}))}var m,c=class extends HTMLElement{constructor(){super(),m=this}render(e){return e.map(t=>new u(t))}async connectedCallback(){let e=await f();this.replaceChildren(...this.render(e))}};customElements.define("tabgroup-rule-list",c);var n=class extends HTMLDialogElement{constructor(e){super(),e??=new v,this.rule=R(e)}setInputValue(){for(let e in this.rule.urlMatches)$(`input[value="${e}"]`,this).checked=!0,$(`input[name="${e}"]`,this).value=this.rule.urlMatches[e].join(",");$(`input[value="${this.rule.color}"]`,this).checked=!0}async createRule(){let e=Object.assign({},this.rule);e.urlMatches={};for(let t in this.rule.urlMatches)e.urlMatches[t]=Object.assign([],this.rule.urlMatches[t]);e.titleIncludes=Object.assign([],this.rule.titleIncludes);try{await y(e),k(structuredClone(e)),this.remove()}catch(t){console.error(t),document.body.appendChild(new x(t))}}removeMatchTitle({currentTarget:e,target:t}){let i=t.closest("li").textContent.trim(),l=this.rule.titleIncludes.indexOf(i);l!==-1&&this.rule.titleIncludes.splice(l,1),t.closest("vt-icon")||(e.previousElementSibling.previousElementSibling.value=i)}addMatchTitle({code:e,target:t}){e==="Enter"&&(this.rule.titleIncludes.push(t.value),t.value="")}onUrlMatchChange(e){let t=e.target;if(t.type==="checkbox"){let i=l=>{l.disabled=t.checked,t.checked?delete this.rule.urlMatches[l.value]:l.checked&&(this.rule.urlMatches[l.value]=l.parentElement.nextElementSibling.value.trim())};if(t.value==="two_path_segment"||t.value==="domain"){let l=e.target.closest("li").previousElementSibling.firstElementChild.firstElementChild;i(l)}if(t.value==="ctm_match_pattern")for(let l of e.currentTarget.querySelectorAll('input[name="url-match"]'))l!==t&&i(l);if(t.checked){let l=e.target.parentElement.nextElementSibling.value.trim();this.rule.urlMatches[t.value]=l?l.split(","):[]}else delete this.rule.urlMatches[t.value]}else t.previousElementSibling.firstElementChild.checked&&(this.rule.urlMatches[e.target.name]=t.value.trim()?t.value.split(","):[])}onColorChange({target:e}){this.rule.color=e.value}render(e){let t=s=>a`<li class="chip-item"><span>${s}</span><vt-icon ico="close" title="remove"></vt-icon></li>`,i=s=>a`<label style="--clr:${s}">
			<input type="radio" name="group-color" value="${s}" hidden />
		</label>`,l=s=>a`<option value="${s}"></option>`;return a`<vt-icon ico="close-circle" class="close-btn" @click=${this.remove.bind(this)}></vt-icon>
			<label>
				<span>${i18n("rule_name")}</span>
				<input type="text" .value=${()=>this.rule.name} />
			</label>

			<section class="title-match" style="margin-top:0.8em">
				<label>
					<span><vt-icon ico="title"></vt-icon> ${i18n("tab_title_includes")}</span>
					<input type="text" list="tabTitles" @keyup=${this.addMatchTitle.bind(this)} />
				</label>
				<datalist id="tabTitles">${e.titleWords().map(l)}</datalist>
				<ul class="chip-list" @click=${this.removeMatchTitle.bind(this)}>
					${w(this.rule.titleIncludes,t)}
				</ul>
			</section>
			<section class="url-match">
				<header><vt-icon ico="route"></vt-icon> <span>${i18n("url_match")}</span></header>
				<ul @change=${this.onUrlMatchChange.bind(this)}>
					<li>
						<label> <input type="checkbox" name="url-match" value="top_domain" />${i18n("top_domain")}</label>

						<input
							type="email"
							name="top_domain"
							list="top_domains"
							placeholder="${i18n("enter_selected_top_domains")}"
							multiple />
						<datalist id="top_domains">${e.topDomains().map(l)}</datalist>
					</li>
					<li>
						<label><input type="checkbox" name="url-match" value="domain" />${i18n("domain")} </label>
						<input
							type="email"
							name="domain"
							list="domains"
							placeholder="${i18n("enter_selected_domains")}"
							multiple />
						<datalist id="domains">${e.domains().map(l)}</datalist>
					</li>
					<li>
						<label>
							<input type="checkbox" name="url-match" value="first_path_segment" /> ${i18n("first_path_segment")}
						</label>
						<input
							type="email"
							name="first_path_segment"
							list="first_path_segments"
							placeholder="${i18n("selected_first_path")}"
							multiple />
						<datalist id="first_path_segments">${e.firstPathSegments().map(l)}</datalist>
					</li>
					<li>
						<label>
							<input type="checkbox" name="url-match" value="two_path_segment" /> ${i18n("two_path_segment")}
						</label>
						<input
							type="email"
							name="two_path_segment"
							list="two_path_segments"
							placeholder="${i18n("selected_first_two_path")}"
							multiple />
						<datalist id="two-path-segments">${e.twoPathSegments().map(l)}</datalist>
					</li>
					<li>
						<label>
							<input type="checkbox" name="url-match" value="ctm_match_pattern" />
							<span>
								${i18n("custom_url")}
								<a href="https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns">
									${i18n("match_patterns")}
								</a>
							</span>
						</label>
						<input type="email" name="ctm_match_pattern" placeholder="https://*/foo*,http://google.es/*" />
					</li>
				</ul>
			</section>

			<section class="rule-row">
				<label>
					<span>${i18n("custom_tabgroup_title")}</span>
					<input
						type="text"
						.value=${()=>this.rule.ctmGroupTitle}
						placeholder="(optional) custom title"
						style="width:80%" />
				</label>
				<label>
					<span>${i18n("priority")}</span>
					<input type="number" .value=${()=>this.rule.priority} />
				</label>
			</section>

			<section>
				<span style="margin-bottom:0.4em"><vt-icon ico="color"></vt-icon> ${i18n("color")}</span>
				<div class="color-pot" @change=${this.onColorChange.bind(this)}>${b.map(i)}</div>
			</section>
			<button @click=${this.createRule.bind(this)}>${i18n("create_rule")}</button>`}async connectedCallback(){this.id="create-rule-dialog";let e=new p;await e.getUrls(),this.replaceChildren(this.render(e)),this.showModal(),this.setInputValue()}};customElements.define("create-rule-dialog",n,{extends:"dialog"});import C from"./tabgroup-rules-ODJ7L3M6.css"with{type:"css"};var d=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[C]}showRuleCreator(){let e=new n;this.shadowRoot.firstElementChild.appendChild(e)}render(){return[a`<header>
			<vt-icon ico="close-circle" class="close-btn" @click=${this.remove.bind(this)}></vt-icon>
			<span><vt-icon ico="group-rule"></vt-icon> ${i18n("tabgroup_rules")}</span>
			<button @click=${this.showRuleCreator.bind(this)}><vt-icon ico="plus"></vt-icon> ${i18n("add_rule")}</button>
		</header>`,new c]}connectedCallback(){let e=document.createElement("dialog");e.append(...this.render()),this.shadowRoot.appendChild(e),e.showModal()}};customElements.define("tabgroup-rule-dialog",d);export{d as TabGroupRuleDialog};
