var opt = { 
	"active_toolbar_tool": "", "show_group_bar": true, "scroll_to_active": true, "scroll_to_new": true, "scroll_to_moved": false, "auto_switch_to_group": true, "update_favicon_hover": false, "scrollbar_pin_list": 4, "scrollbar_tab_list": 16, "show_toolbar": true, "openclose_animation": true, "new_open_below": false,
	"toolbar_on_top": true, "pin_list_on_top": true, "pin_list_multi_row": false, "filter_type": "url", "after_close_action": "last", "close_with_MMB": true, "always_show_close": false, "allow_pin_close": false, "grayscale_groups": false, "theme_dir": "theme_Standard", "theme_name": "Standard"
};
var toolbar = {
	"available_buttons": "<div class=button id=button_extensions></div><div class=button id=button_discard></div>",
	"toolbar_main": "<div class=button id=button_group_bar></div><div class=button id=button_new></div><div class=button id=button_pin></div><div class=button id=button_undo></div><div class=button id=button_move></div><div class=button id=button_search></div><div class=button id=button_tools></div>",
	"toolbar_tools": "<div class=button id=button_sort></div><div class=button id=button_bookmarks></div><div class=button id=button_downloads></div><div class=button id=button_history></div><div class=button id=button_settings></div><div class=button id=button_options></div>"
};
var	hold = true,
	started = false,
	schedule_save = 0;
	groups = [],
	tabs = {},
	suspended_groups = {},
	dt = {tabsIds: [], CameFromWindowId: 0, DropToGroup: "ut"},
	paths = {theme_css: opt.theme_dir+"/"+opt.theme_name+".css"},
	caption_clear_filter = chrome.i18n.getMessage("caption_clear_filter"),
	caption_loading = chrome.i18n.getMessage("caption_loading"),
	caption_searchbox = chrome.i18n.getMessage("caption_searchbox"),
	caption_group = chrome.i18n.getMessage("caption_group"),
	donate_showed_in_session = false,
	OperaVersion = navigator.userAgent.match("OPR/.*$");
	OperaVersion = OperaVersion == null ? 99 : parseInt(OperaVersion[0].substr(OperaVersion[0].indexOf("/")+1));

function Start(){
	started = true;
	// all variables needed to load data
	var	loaded_options = {}, loaded_toolbar = {};
	
	if (localStorage.getItem("current_options") !== null){
		loaded_options = JSON.parse(localStorage["current_options"]);
	}
	// TOOLBAR HTML
	if (localStorage.getItem("current_toolbar") !== null){
		loaded_toolbar = JSON.parse(localStorage["current_toolbar"]);
	}
	// load suspended groups
	if (localStorage.getItem("suspended_groups") !== null){
		suspended_groups = JSON.parse(localStorage["suspended_groups"]);
	}
	
	// set loaded options
	for (var parameter in opt) {
		if (loaded_options[parameter] != undefined && opt[parameter] != undefined){
			opt[parameter] = loaded_options[parameter];
		}
	}
	// set loaded toolbar
	for (var parameter in toolbar) {
		if (loaded_toolbar[parameter] != undefined && toolbar[parameter] != undefined){
			toolbar[parameter] = loaded_toolbar[parameter];
		}
	}

	// theme variables
	paths.theme_css = opt.theme_dir+"/"+opt.theme_name+".css";
	paths.theme_css_menu = opt.theme_dir+"/menu.css";
	paths.icon_media = "url(../"+opt.theme_dir+"/media.gif)";
	paths.icon_media_muted = "url(../"+opt.theme_dir+"/media_muted.gif)";
	paths.icon_loading = "url(../"+opt.theme_dir+"/loading.svg)";
	paths.icon_close = "url(../"+opt.theme_dir+"/close.svg)";
	paths.icon_close_h = "url(../"+opt.theme_dir+"/close_h.svg)";
	
	// set toolbar css path
	if (opt.toolbar_on_top == true){
		paths.theme_css_toolbar = opt.theme_dir+"/toolbar_top.css";
	} else {
		paths.theme_css_toolbar = opt.theme_dir+"/toolbar_bottom.css";
	}

	// LOAD GROUPS
	if (localStorage.getItem("groups") !== null){
		groups = JSON.parse(localStorage["groups"]);
	}

	LoadTabs(0);
}

function LoadTabs(retries){
	chrome.tabs.query({windowType: "normal"}, function(qtabs){
		
		// create current tabs object
		qtabs.forEach(function(Tab){
			tabs[Tab.id] = { g: "ut", h: GetHash(Tab.url) };
		});
		var loaded_tabs = {};
		
		// LOAD DATABASE VERSION V2
		if (localStorage.getItem("tabs2") !== null){
			loaded_tabs = JSON.parse(localStorage["tabs2"]);
			
			if (loaded_tabs.length == 0 || loaded_tabs.length != loaded_tabs[0]){
				if (localStorage.getItem("BAK_tabs") !== null && localStorage.getItem("BAK_groups") !== null){
					loaded_tabs = JSON.parse(localStorage["BAK_tabs"]);
					groups = JSON.parse(localStorage["BAK_groups"]);
				}
			}
			qtabs.forEach(function(Tab){
				for (var t = 1; t < loaded_tabs.length; t++){
					if (loaded_tabs[t][1] === tabs[Tab.id].h){
						tabs[Tab.id].g = loaded_tabs[t][2];
						groups.forEach(function(group){
							if (group.i == loaded_tabs[t][0]){
								group.i = Tab.id;
							}
						});
						hold = false;
						loaded_tabs.splice(t, 1);
						break;
					}
				}
			});
		}
		// will hold autosave for 3 minutes
		if (hold && retries < 180 && localStorage.getItem("tabs2") !== null){
			setTimeout(function(){
				LoadTabs(retries+1);
			}, 1000);
		} else {
			hold = false;
			AutoSaveData(0);
		}
	});
}

function AutoSaveData(tick){
	setTimeout(function(){
		if (!hold && schedule_save > 0 && Object.keys(tabs).length > 0){
			chrome.tabs.query({windowType: "normal"}, function(qtabs){
				var data = [];
				data.push(qtabs.length+1);
				qtabs.forEach(function(Tab){
					if (!hold){
						if (tabs[Tab.id] != undefined && tabs[Tab.id].h != undefined && tabs[Tab.id].g != undefined){
							data.push([Tab.id, tabs[Tab.id].h, tabs[Tab.id].g]);
						} else {
							data.push([Tab.id, GetHash(Tab.url), "ut"]);
						}
					} 
				});
				if (!hold && data.length == qtabs.length+1){
					localStorage["tabs2"] = JSON.stringify(data);
					localStorage["groups"] = JSON.stringify(groups);
					localStorage["suspended_groups"] = JSON.stringify(suspended_groups);
					
					// Backup every 15 minutes (2000/1000ms from AutoSave for 450 times /60s)
					if (tick > 450){
						localStorage["BAK_tabs"] = JSON.stringify(data);
						localStorage["BAK_groups"] = JSON.stringify(groups);
						localStorage["BAK_suspended_groups"] = JSON.stringify(suspended_groups);
						tick = 0;
					}
				}
				schedule_save--;
			});
		}
		AutoSaveData(tick+1);
	}, 2000);
}

function LoadBackup(){
	if (localStorage.getItem("BAK_tabs") !== null){
		localStorage["tabs2"] = localStorage["BAK_tabs"];
		localStorage["groups"] = localStorage["BAK_groups"];
		localStorage["suspended_groups"] = localStorage["BAK_suspended_groups"];
		setTimeout(function(){
			localStorage.removeItem("BAK_tabs");
			chrome.runtime.sendMessage({command: "reload"}, function(response) {});
			window.location.reload();
		}, 500);
	}
}

function SaveOptions(){
	localStorage["current_options"] = JSON.stringify(opt);
	localStorage["current_toolbar"] = JSON.stringify(toolbar);
}
function ResetOptions(){
	if (localStorage.getItem("current_options") !== null){
		localStorage.removeItem("current_options");
	}
	window.location.reload();
}
function ResetToolbar(){
	if (localStorage.getItem("current_toolbar") !== null){
		localStorage.removeItem("current_toolbar");
	}
	window.location.reload();
}

function GetHash(s){
	var hash = 0;
	if (s.length === 0){
		return 0;
	}
	for (var i = 0; i < s.length; i++){
		hash = (hash << 5)-hash;
		hash = hash+s.charCodeAt(i);
		hash |= 0;
	}
	return Math.abs(hash);
}

chrome.tabs.onCreated.addListener(function(tab){
	tabs[tab.id] = {g: tab.pined ? "0" : "ut", h: GetHash(tab.url)};
	chrome.runtime.sendMessage({command: "tab_created", windowId: tab.windowId, tab: tab, tabId: tab.id});
	schedule_save++;
});
chrome.tabs.onAttached.addListener(function(tabId, attachInfo){
	chrome.tabs.get(tabId, function(tab){
		chrome.runtime.sendMessage({command: "tab_attached", windowId: attachInfo.newWindowId, tab: tab, tabId: tabId}, function(response) {});
		schedule_save++;
	});
});
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo){
	chrome.runtime.sendMessage({command: "tab_removed", windowId: removeInfo.windowId, tabId: tabId, tabGroupId: tabs[tabId].g}, function(response) {});
	setTimeout(function(){
		delete tabs[tabId];
		schedule_save++;
	}, 1000);
});
chrome.tabs.onDetached.addListener(function(tabId, detachInfo){
	chrome.runtime.sendMessage({command: "tab_removed", windowId: detachInfo.oldWindowId, tabId: tabId}, function(response) {});
	schedule_save++;
});
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
	if (tabs[tabId] == undefined){
		tabs[tabId] = {g: tab.pinned ? "0" : "ut", h: GetHash(tab.url)};
	}
	if (changeInfo.url != undefined){
		tabs[tabId].h = GetHash(tab.url);
	}
	if (changeInfo.pinned == true){
		tabs[tabId].g = "0";
	}
	if (changeInfo.pinned == false){
		tabs[tabId].g = "ut";
	}
	chrome.runtime.sendMessage({command: "tab_updated", windowId: tab.windowId, tab: tab, tabId: tabId, changeInfo: changeInfo}, function(response) {});
	if (changeInfo.url != undefined || changeInfo.pinned != undefined){
		schedule_save++;
	}
});
chrome.tabs.onMoved.addListener(function(tabId, moveInfo){
	chrome.runtime.sendMessage({command: "tab_moved", windowId: moveInfo.windowId, tabId: tabId, moveInfo: moveInfo}, function(response) {});
	if (schedule_save < 1){
		schedule_save++;
	}
});
chrome.tabs.onReplaced.addListener(function(addedTabId, removedTabId){
	chrome.tabs.get(addedTabId, function(tab){
		if (tabs[removedTabId]){
			tabs[addedTabId] = {g: tab.pined ? "0" : tabs[removedTabId].g, h: GetHash(tab.url)};
		} else {
			tabs[addedTabId] = {g: tab.pined ? "0" : "ut", h: GetHash(tab.url)};
		}
		if (addedTabId == removedTabId){
			chrome.runtime.sendMessage({command: "tab_updated", windowId: tab.windowId, tab: tab, tabId: tab.id, changeInfo: {status: tab.status, url: tab.url, title: tab.title, audible: tab.audible, mutedInfo: tab.mutedInfo}});
		} else {
			chrome.runtime.sendMessage({command: "tab_removed", windowId: tab.windowId, tabId: removedTabId});
			chrome.runtime.sendMessage({command: "tab_attached", windowId: tab.windowId, tab: tab, tabId: addedTabId});
			delete tabs[removedTabId];
		}
		schedule_save++;
	});
});
chrome.tabs.onActivated.addListener(function(activeInfo){
	chrome.runtime.sendMessage({command: "tab_activated", windowId: activeInfo.windowId, tabId: activeInfo.tabId}, function(response) {});
});
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	switch(message.command){
		case "hash_tab":
			chrome.tabs.get(message.tabId, function(tab){
				tabs[tab.id] ? tabs[tab.id].h = GetHash(tab.url) : tabs[tabId] = {g: tab.pined ? "0" : "ut", h: GetHash(tab.url)};
			});
		break;
		case "save_data":
			schedule_save++;
		break;
		case "background_start":
			if (!started){
				Start();
			}
		break;
		case "reload":
			window.location.reload();
		break;
		case "options_reset":
			ResetOptions();
		break;
		case "toolbar_reset":
			ResetToolbar();
		break;
		case "options_save":
			SaveOptions();
		break;
		case "load_backup":
			LoadBackup();
		break;
		case "log":
			console.log(message.m);
		break;
	}
});
chrome.runtime.onStartup.addListener(function(){
	Start();
});
chrome.runtime.onSuspend.addListener(function(){
	chrome.runtime.sendMessage({command: "closing"}, function(response) {});
	hold = true;
});