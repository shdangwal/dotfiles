// **********      INITIALIZE SIDEBAR       ***************

// Global variables
var	bg = chrome.extension.getBackgroundPage(),
	// Various Ids, and fixed nodes
	vt = {windowId: 0, utActiveTab: 0, menuGroupId: "", menuTabId: "", ActiveGroup: "at", lastActiveTabId: [0,0], PickColorFor: "", ToolbarHeight: [0,0], PinList: $("#pin_list"), TabList: $("#tab_list"), DragImage: document.getElementById("DragImage")},
	// events
	eventLock = {TabMove: false, Scroll: false, NewTab: false},
	// pressing keys
	IOKeys = {MouseHoverOver: "", LMB: false, Ctrl: false, Shift: false, a: false, i: false},
	// dragging
	QueryData = {NodeTab: undefined, NodeGroup: undefined};

document.addEventListener("DOMContentLoaded", Initialize(), false);

function Initialize(){
	if (bg.hold || bg.paths == undefined){
		setTimeout(function(){ Initialize(); },500);
		// if background script is not running for any reason, this will send a message to start it
		chrome.runtime.sendMessage({command: "background_start"}, function(response) {});
	} else {
		// set theme
		document.getElementById("theme").href = bg.paths.theme_css;
		document.getElementById("theme_menu").href = bg.paths.theme_css_menu;
		document.getElementById("theme_toolbar").href = bg.paths.theme_css_toolbar;
		document.styleSheets[0].addRule("::-webkit-scrollbar", "width:"+bg.opt.scrollbar_tab_list+"px; height:"+bg.opt.scrollbar_pin_list+"px;");
		
		// next steps are delayed 20ms, css styles must be loaded
		setTimeout(function(){
			chrome.tabs.query({windowId:-2}, function(tabs){
				vt.windowId = tabs[0].windowId;
				// multi row pinned tabs
				if (bg.opt.pin_list_multi_row){
					vt.PinList.css({"white-space": "normal", "overflow-x": "hidden"});
				}
				// place pinned tabs bar in its place
				if (bg.opt.pin_list_on_top == false){
					vt.PinList.insertAfter(vt.TabList);
				}
				// set toolbars contents from storage
				$("#toolbar_main").html(bg.toolbar.toolbar_main);
				$("#toolbar_tools").html(bg.toolbar.toolbar_tools);
				// set language titles
				$(".button").each(function(){
					$(this).attr("title", chrome.i18n.getMessage(this.id));
				});
				$(".group_options_button").each(function(){
					$(this).attr("title", chrome.i18n.getMessage(this.id));
				});
				$(".group_edit_color").each(function(){
					$(this).attr("title", chrome.i18n.getMessage(this.id));
				});
				$(".group_edit_button").each(function(){
					$(this)[0].innerText = chrome.i18n.getMessage(this.id);
				});
				// load internal captions
				$("#filter_box").attr("placeholder", bg.caption_searchbox);
				// set group bar
				if (bg.opt.show_group_bar == false){
					$("#groups_container").addClass("hidden");
				} else {
					$("#button_group_bar").addClass("on");
				}
				// load last used toolbar
				if (bg.opt.show_toolbar){
					$("#toolbar").css({"display": ""});
					vt.ToolbarHeight[0] = parseInt($("#toolbar_main").css("height"));
					vt.ToolbarHeight[1] = parseInt($("#toolbar_main").css("height"))+parseInt($("#toolbar_tools").css("height"));
					if (bg.opt.active_toolbar_tool == ""){
						$("#toolbar_tools, #toolbar_search").addClass("hidden");
					}
					if (bg.opt.active_toolbar_tool == "tools" && $("#button_tools").length != 0){
						$("#toolbar_search").addClass("hidden");
						$("#button_tools").addClass("on");
					}
					if (bg.opt.active_toolbar_tool == "search" && $("#button_search").length != 0){
						$("#toolbar_tools").addClass("hidden");
						$("#button_search").addClass("on");
					}
					// move main toolbar and search toolbar to its places
					if (bg.opt.toolbar_on_top == false){
						$("#toolbar").insertAfter($("#content_container"));
						$("#toolbar_search, #toolbar_tools").insertBefore($("#toolbar_main"));
					}
				} else {
					// remove toolbar if disabled
					vt.ToolbarHeight[0] = -1;
					vt.ToolbarHeight[1] = -1;
					$("#toolbar").remove();
				}
				// remove middle mouse and set scroll positions
				document.body.onmousedown = function(event){
					if (event.button == 1 && bg.opt.close_with_MMB == true){
						event.preventDefault();
					}
					if (event.button == 0 && !$(event.target).is(".menu_item")){
						$(".menu").hide(0);
					}
				};
				// scroll horizontally on pin list
				vt.PinList.mousewheel(function(event, delta){
					this.scrollLeft-= (delta * 30);
					event.preventDefault();
				});
				// resize all blocks on windows resize
				$(window).on("resize", function(event){
					RefreshGUI();
				});
				// catch keyboard keys
				$(document).keydown(function(e){
					if (IOKeys.MouseHoverOver.match("pin_list|tab_list|groups_container")){
						if (e.which == 16){
							IOKeys.Shift = true;
						}
						if (e.which == 17){
							IOKeys.Ctrl = true;
						}
						if (e.which == 65){
							IOKeys.a = true;
						}
						if (e.which == 73){
							IOKeys.i = true;
						}
						if (IOKeys.Ctrl && IOKeys.a){
							if (IOKeys.MouseHoverOver == "pin_list"){
								$(".pin").addClass("selected");
							}
							if (IOKeys.MouseHoverOver == "tab_list"){
								$(".tab:visible").addClass("selected");
							}
						}
						if (IOKeys.Ctrl && IOKeys.i){
							if (IOKeys.MouseHoverOver == "pin_list"){
								$(".pin").toggleClass("selected");
							}
							if (IOKeys.MouseHoverOver == "tab_list"){
								$(".tab:visible").toggleClass("selected");
							}
						}
					}
					RefreshGUI();
				});
				// clear pressed keys on key_up
				$(document).keyup(function(e){
					if (e.which == 16){
						IOKeys.Shift = false;
					}
					if (e.which == 17){
						IOKeys.Ctrl = false;
					}
					if (e.which == 65){
						IOKeys.a = false;
					}
					if (e.which == 73){
						IOKeys.i = false;
					}
				});
				$(document).on("dragend", "", function(event){
					IOKeys.LMB = false;
				});
				$(document).on("dragenter", "#groups_container, #toolbar", function(event){ // set mouse over id
					IOKeys.MouseHoverOver = this.id;
				});
				$(document).on("mouseenter", "#pin_list, #tab_list, #groups_container, #toolbar", function(event){ // set mouse over id
					IOKeys.MouseHoverOver = this.id;
				});
				$(document).on("mouseleave", window, function(event){
					ClearPressedKeys();
				});
				$(document).on("mouseup", "body", function(event){
					IOKeys.LMB = false;
				});
				// hide mute tab options Opera version under 35
				if (bg.OperaVersion < 36){
					$("#tabs_menu_mute").prev().css({"display": "none"});
					$("#groups_menu_mute").prev().css({"display": "none"});
					$("#groups_menu_unmute_other").next().css({"display": "none"});
					$("#tabs_menu_mute, #tabs_menu_mute_other, #tabs_menu_unmute_other, #groups_menu_mute, #groups_menu_unmute, #groups_menu_mute_other, #groups_menu_unmute_other").css({"display":"none"});
				}
				// add Toolbar, Groups and Tabs events
				InitializeToolbar();
				SetGroupsEvents();
				SetTabsEvents();
				// Add menus
				InitializeMenu();
				InitializeGroupsMenu();
				// Append groups
				AppendAllGroups();
				// Append tabs with favicons and titles
				tabs.forEach(function(Tab){
					if (Tab.pinned){
						AppendTab(Tab, "0", false, true);
					} else {
						AppendTab(Tab, bg.tabs[Tab.id] ? (bg.tabs[Tab.id].g == "0" ? "ut" : bg.tabs[Tab.id].g) : "ut", false, true);
					}
					if (Tab.active){
						vt.lastActiveTabId = [Tab.id,Tab.id];
					}
				});
				// Set group from active tab
				if (bg.tabs[vt.lastActiveTabId[0]] && $(".active").is(".tab") && bg.opt.show_group_bar && (bg.tabs[vt.lastActiveTabId[0]].g).match("0|at|ut") == null){
					SetActiveGroup(bg.tabs[vt.lastActiveTabId[0]].g, false, false);
				} else {
					SetActiveGroup("at", false, false);
				}
				// Scroll to active tab
				if (bg.opt.scroll_to_active && $(".active:visible").length > 0){
					ScrollTabList($(".active:visible")[0].id);
				}
				RefreshGUI();
			});
		},20);
		if (!bg.donate_showed_in_session && localStorage.getItem("show_donate_popup") == undefined){ // ASK FOR MONEY
			var left = ((screen.width / 2)-(800 / 2))+window.screenLeft;
				left = Math.round(left);
			var top = ((screen.height / 2)-(420 / 2))+window.screenTop;
				top = Math.round(top);
			chrome.windows.create({"type": "popup", "url": "donate.html", "left": left, "top": top, "width": 0, "height": 0, "focused": true});
			bg.donate_showed_in_session = true;
		}
	}
}

function ClearPressedKeys(){
	IOKeys.MouseHoverOver = "";
	IOKeys.LMB = false;
	IOKeys.Ctrl = false;
	IOKeys.Shift = false;
	IOKeys.a = false;
	IOKeys.i = false;
}
