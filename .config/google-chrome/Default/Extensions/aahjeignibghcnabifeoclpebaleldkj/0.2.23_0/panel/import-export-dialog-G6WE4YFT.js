import{c,i as p,o as d}from"./chunk-I5YWVGZK.js";import"./chunk-EK7ODJWE.js";var r=class{constructor(){}json(...t){let n=t[0].tabs.map(({title:i,url:e,favIconUrl:o})=>({title:i,url:e,favIconUrl:o}));return JSON.stringify(n)}csv(...t){let n=`url,title,favIconUrl
`,i=t[0].tabs.map(({title:e,url:o,favIconUrl:a})=>`${o},${e},${a}`).join(`
`);return n+i}markdown(...t){return t[0].tabs.map(({title:n,url:i,favIconUrl:e})=>`[${n}](${i})`).join(`
`)}html(...t){let n=`<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Tabs at ${new Date().toLocaleString("default",{dateStyle:"full"})}</title>
		</head>
		<body>
		`,i=o=>`<li style="padding-block: 0.2em">
            <a href="${o.url}" target="_blank" rel="noopener noreferrer">${o.title}</a>
        </li>`,e=o=>`<details>
            <summary>${this.winTitles[o.id]??o.id}</summary>
            <ol>
                ${o.tabs.map(i).join("")}
            </ol>
        </details>`;return`${n}<blockquote >
            <h1>${new Date().toLocaleString("default",{dateStyle:"full"})}</h1>
            ${t.map(e).join(`
`)}
        </blockquote></body></html>`}async export(t){let n=await chrome.windows.get(windowId,{windowTypes:["normal"],populate:!0});this.winTitles=await p(null);let i=this[t](n);this.downloadFile(i,t)}downloadFile(t,n){let i=new Blob([t],{type:"text/plain"}),e=document.createElement("a");e.setAttribute("href",URL.createObjectURL(i)),e.setAttribute("download",new Date().toISOString()+"."+n),e.click()}};var s=class extends HTMLElement{constructor(){super()}onFileUpload(t){let n=new RegExp(/https:\/\/[^\s,"')\n]+/,"g"),i=t.target.files[0],e=new FileReader;e.onload=async o=>{let a=o.target.result;if(typeof a!="string")return;let h=a.matchAll(n);for(let u of h){let l=u[0];if(l&&URL.canParse(l)){let{id:b}=await c({url:l,windowId});await new Promise(w=>setTimeout(w,1e3)),await chrome.tabs.discard(b)}}},e.onerror=o=>console.error(o),e.readAsText(i)}exportTabs(){new r().export($("select",this).value)}switchTab({target:t}){$("#"+t.value,this).scrollIntoView({behavior:"smooth",inline:"start"})}render(){return d`<header @change=${this.switchTab.bind(this)}>
				<label>${i18n("import")} <input type="radio" name="import-export" value="import-tab" hidden /> </label>
				<label
					>${i18n("export")} <input type="radio" name="import-export" value="export-tab" hidden checked />
				</label>
			</header>
			<div>
				<section id="import-tab">
					<input type="file" accept="text/html,text/csv,application/json" @change=${this.onFileUpload} />
					<button>${i18n("import")}</button>
				</section>
				<section id="export-tab">
					<label>
						<span>${i18n("format")}</span>
						<select name="format">
							<option value="html">html</option>
							<option value="json">json</option>
							<option value="markdown">markdown</option>
							<option value="csv">csv</option>
							<option value="sql">SQL</option>
						</select>
					</label>
					<button @click=${this.exportTabs.bind(this)}>Export</button>
				</section>
			</div> `}connectedCallback(){this.style.top="import-export",this.setAttribute("popover",""),this.replaceChildren(this.render()),this.showPopover(),$("#export-tab",this).scrollIntoView()}};customElements.define("import-export-dialog",s);export{s as ImportExportDialog};
