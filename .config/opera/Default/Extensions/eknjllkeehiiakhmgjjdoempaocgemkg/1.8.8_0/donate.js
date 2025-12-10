var bg = chrome.extension.getBackgroundPage();	
document.addEventListener("DOMContentLoaded", function(){
	document.title = "Vertical tabs";
	$("#donate_label_please_donate")[0].innerHTML = chrome.i18n.getMessage("donate_text_pledge");
	$("#donate_no_thanks")[0].innerHTML =  chrome.i18n.getMessage("donate_no_thanks_button");
	window.resizeTo(($("#donate_label_please_donate").outerWidth()+50), 420);
	$("#paypal_donate_button").css({"margin-left": ( ($("#donate_label_please_donate").outerWidth()/2)-74)});
	$("#donate_no_thanks").css({"margin-left": ( ($("#donate_label_please_donate").outerWidth()/2)-($("#donate_no_thanks").outerWidth()/2) )});
	$(document).on("click", "#donate", function(event){
		localStorage.setItem("show_donate_popup", false);
		window.moveTo(0, 0);
		window.resizeTo(screen.availWidth, screen.availHeight);
		$("#donate_label_please_donate, #paypal_donate_button, #donate_no_thanks").remove();
	});
	$(document).on("click", "#donate_no_thanks", function(event){
		localStorage.setItem("show_donate_popup", false);
		$("#paypal_donate_button").remove();
		$("#donate_label_please_donate")[0].innerHTML = chrome.i18n.getMessage("donate_text_change_mind");
		window.resizeTo(($("#donate_label_please_donate").outerWidth()+50), 300);
		$(this).remove();
	});

});
