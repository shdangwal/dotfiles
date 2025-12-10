import"./chunk-EK7ODJWE.js";import n from"./emoji-picker-KRZLCODK.css"with{type:"css"};var s=class extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.shadowRoot.adoptedStyleSheets=[n]}render(){return`<header class="category-bar">
				<div data-ctg="animals">\u{1F436}</div>
				<div data-ctg="food_drinks">\u{1F355}</div>				
				<div data-ctg="travels">\u{1F680}</div>
				<div data-ctg="objects">\u{1F389}</div>
				<div data-ctg="symbols">\u2764\uFE0F</div>
				<div data-ctg="flags">\u{1F3C1}</div>
			</header>
			<article class="emoji-container">
				<div class="emoji-category" id="animals"></div>
				<div class="emoji-category" id="food_drinks"></div>				
				<div class="emoji-category" id="travels"></div>
				<div class="emoji-category" id="objects"></div>
				<div class="emoji-category" id="symbols"></div>
				<div class="emoji-category" id="flags"></div>
			</article>`}showCategoryEmoji(e){let t=this.shadowRoot.lastElementChild.querySelector("#"+e);if(t.scrollIntoView(),t.hasChildNodes())return;let o=this.emojis[e],i=o.length,a=new DocumentFragment;for(;i--;){let d=document.createElement("span");d.textContent=o[i],a.appendChild(d)}t.appendChild(a)}async fetchEmoji(){let e=await fetch("https://api.npoint.io/ac2f15a998f82653d938",{mode:"cors"}),t=e.ok&&await e.json();return setStore({emojis:t}),t}async connectedCallback(){this.id="emoji-picker",this.setAttribute("popover",""),this.shadowRoot.innerHTML=this.render();let{emojis:e}=await getStore("emojis");this.emojis=e||await this.fetchEmoji(),this.showCategoryEmoji("animals"),this.showPopover();let t=({target:i})=>i.nodeName==="SPAN"&&(this.previousElementSibling.value=i.textContent+this.previousElementSibling.value),o=({target:i})=>i.nodeName==="DIV"&&this.showCategoryEmoji(i.dataset.ctg);$on(this.shadowRoot.lastElementChild,"pointerdown",t),$on(this.shadowRoot.firstElementChild,"click",o)}};customElements.define("emoji-picker",s);export{s as EmojiPicker};
