// **********      OPTIONS       ***************

var bg = chrome.extension.getBackgroundPage();	
document.addEventListener("DOMContentLoaded", function(){
	document.title = "Vertical Tabs";

	// set language labels
	$(".label").each(function(){
		$(this).text(chrome.i18n.getMessage(this.id));
	});
	// set checkboxes from saved states
	$(".opt_checkbox").each(function(){
		$(this)[0].checked = bg.opt[this.id];
	});
	$(".set_button").each(function(){
		$(this)[0].innerHTML = chrome.i18n.getMessage(this.id);
	});
	// set language dropdown menus
	$(".drop_down_menu").each(function(){
		$(this)[0].innerHTML = chrome.i18n.getMessage(this.id);
	});

	// toolbar
	$("#show_toolbar")[0].checked = bg.opt.show_toolbar;
	$("#show_toolbar_field").css({"height": bg.opt.show_toolbar ? "" : "10"});

	// shrink and hide all toolbar options
	$(".toolbar_options").css({"display": $("#show_toolbar")[0].checked ? "" : "none"});
	$(document).on("click", "#show_toolbar", function(event){
		$("#show_toolbar_field").css({"height": $("#show_toolbar")[0].checked ? "" : "10"});
		$(".toolbar_options").css({"display": $("#show_toolbar")[0].checked ? "" : "none"});
	});
	
	// toolbar buttons
	$(".toolbar_buttons").each(function(){
		$(this).html(bg.toolbar[(this.id).substring(4)]);
	});
	$(document).on("click", "#options_toolbar_reset", function(event){
		chrome.runtime.sendMessage({command: "toolbar_reset"}, function(response) {});
		setTimeout(function(){
			$("#opt_available_buttons").html(bg.toolbar.available_buttons);
			$("#opt_toolbar_main").html(bg.toolbar.toolbar_main);
			$("#opt_toolbar_tools").html(bg.toolbar.toolbar_tools);
		}, 1000);
	});
	
	// block system dragging
	$(document).bind("drop dragover", function(event){
		event.preventDefault();
	});

	// set dragged button node
	var dragged_button;
	$(document).on("mousedown", ".button", function(event){
		$(this).attr("draggable", "true");
		dragged_button = this;
	});
	
	// remove draggable attribute to clean html which will be saved in the toolbar
	$(document).on("mouseleave", ".button", function(event){
		$(".button").removeAttr("draggable");
	});

	// append button to list
	$(document).on("dragenter", "#opt_available_buttons, #opt_toolbar_main, #opt_toolbar_tools", function(event){
		if (dragged_button.parentNode.id != this.id){
			$("#"+dragged_button.id).appendTo($(this));
		}
	});

	// move buttons
	$(document).on("dragenter", ".button", function(event){
		if ( $(this).index() <= $("#"+dragged_button.id).index()){
			$("#"+dragged_button.id).insertBefore($(this));
		} else {
			$("#"+dragged_button.id).insertAfter($(this));
		}
	});

	// scrollbars
	$(".opt_scrollbar").each(function(){
		$(this)[0].value = bg.opt[this.id];
	});

	// change action to take after closing an active tab
	for (var i = 0; i < $("#after_close_action")[0].options.length; i++){
		if ($("#after_close_action")[0].options[i].value === bg.opt.after_close_action){
			$("#after_close_action")[0].selectedIndex = i;
			break;
		}
	}
	
	// theme directories are the values of options under id #theme in options.html
	for (var i = 0; i < $("#theme")[0].options.length; i++){
		if ($("#theme")[0].options[i].text === bg.opt.theme_name){
			$("#theme")[0].selectedIndex = i;
			break;
		}
	}
	
	// save to disk
	$(document).on("click", "#options_apply_all_settings", function(event){
		$(".opt_checkbox").each(function(){
			bg.opt[this.id] = $(this)[0].checked;
		});
		$(".toolbar_buttons").each(function(){
			bg.toolbar[(this.id).substring(4)] = $(this).html();
		});
		$(".opt_scrollbar").each(function(){
			bg.opt[this.id] = parseInt($(this)[0].value);
		});
		bg.opt.after_close_action = $("#after_close_action")[0].options[$("#after_close_action")[0].selectedIndex].value;
		bg.opt.theme_dir = $("#theme")[0].options[$("#theme")[0].selectedIndex].value;
		bg.opt.theme_name = $("#theme")[0].options[$("#theme")[0].selectedIndex].text;
		chrome.runtime.sendMessage({command: "options_save"}, function(response) {});
		chrome.runtime.sendMessage({command: "reload"}, function(response) {});
	});
	
	// reset
	$(document).on("click", "#options_reset_all_settings", function(event){
		chrome.runtime.sendMessage({command: "options_reset"}, function(response) {});
		chrome.runtime.sendMessage({command: "reload"}, function(response) {});
		setTimeout(function(){
			location.reload();
		}, 3000);
	});

	// load backup
	$(document).on("click", "#options_load_backup", function(event){
		chrome.runtime.sendMessage({command: "load_backup"}, function(response) {});
	});

});