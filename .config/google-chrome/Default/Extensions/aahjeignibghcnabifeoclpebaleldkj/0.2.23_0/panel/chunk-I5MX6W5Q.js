var t=class extends HTMLDialogElement{constructor(e){super(),this.error=e,this.gmailUrl="https://mail.google.com/mail/u/0/",this.mailTo="noterailhelp@gmail.com"}async reportBug(){let{version:e,short_name:r}=chrome.runtime.getManifest(),s=this.error.stack?.replaceAll(`
`,"%0A"),i=`${this.gmailUrl}?to=${this.mailTo}&su=${this.error.message}&body=Error:%20${this.error.message}%0AStack:%20${s}%0AExtensionId:%20${chrome.runtime.id}%0AExtension%20Name:%20${r}%0AExtension%20Version:%20${e}%0ABrowser%20Info:%20${navigator.userAgent}&fs=1&tf=cm`;await chrome.tabs.create({url:i})}render(){return`<h2>\u{1F62A} ${chrome.i18n.getMessage("sorry_something_went_wrong")} \u{1F41B}</h2>
			<p style="max-width: 50ch;overflow-wrap: break-word;">\u274C ${this.error.message?.replaceAll("<","&lt;")?.replaceAll(">","&gt;")}</p>
			<button style="font-size: 1rem;margin-inline: auto;display: block;"> 
				\u{1F41E} <span>${chrome.i18n.getMessage("report_bug")}</span>
			</button>
			<div style="text-align:center;font-size:x-small;">${chrome.i18n.getMessage("just_one_click")}</div>`}connectedCallback(){this.id="report-bug",this.innerHTML=this.render(),this.showModal(),this.lastElementChild.previousElementSibling.addEventListener("click",this.reportBug.bind(this))}};customElements.define("report-bug",t,{extends:"dialog"});export{t as a};
