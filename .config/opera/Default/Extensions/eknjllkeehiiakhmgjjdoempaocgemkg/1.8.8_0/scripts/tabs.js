// **********       TABS FUNCTIONS          ***************

// groupId: places tab to correct group, setup: bool to update favicon and title
function AppendTab(tab, groupId, move, get_favicon){
	if ($("#"+tab.id).length > 0){
		GetFaviconAndTitle(tab.id);
		MoveTabOnList(tab.id, tab.index, tab.index);
		return;
	}
	var div_tab = document.createElement("div");
		div_tab.id = tab.id;
		div_tab.className = tab.pinned ? "pin 0" : ("tab "+(groupId.match("at|ut") == null ? groupId : "ut")+(bg.opt.always_show_close ? " show_close" : ""));
		div_tab.innerHTML = "<div class=tab_favicon id=f_"+tab.id+"><div class=tab_mediaicon id=m_"+tab.id+"></div></div><span class=tab_title id=t_"+tab.id+"></span><div class=tab_close id=c_"+tab.id+"></div>";
		div_tab.draggable = true;
	if (bg.opt.openclose_animation){
		div_tab.style.opacity = 0;
		div_tab.style.height = "0px";
	}
	if (vt.ActiveGroup != groupId && !tab.pinned){
		div_tab.style.display = "none";
	}
	(tab.pinned ? vt.PinList : vt.TabList)[0].appendChild(div_tab);
	if (move){
		MoveTabOnList(tab.id, tab.index, tab.index);
		RefreshGUI();
	}
	if (get_favicon){
		GetFaviconAndTitle(tab.id);
	}
	if (tab.audible){
		RefreshMediaIcon(tab.id);
	}
	if (tab.discarded){
		RefreshDiscarded(tab.id);
	}
	if (bg.opt.openclose_animation){
		div_tab.style.opacity = "";
		div_tab.style.height = "";
	}
	if (tab.active){
		SetActiveTab(tab.id);
	}
}

// move chrome tabs
function MoveBrowserTabs(tabsIds, pin){
	eventLock.TabMove = eventLock.Scroll = true;
	var offset = pin ? 0 : vt.PinList.children().length;
	tabsIds.forEach(function(Id){
		chrome.tabs.update(Id, {pinned: pin});
		chrome.tabs.move(Id, {index: -1});
	});
	tabsIds.forEach(function(Id){
		eventLock.TabMove = eventLock.Scroll = true;
		chrome.tabs.move(Id, {index: $("#"+Id).index() + offset}, function(tab){
			setTimeout(function(){
				eventLock.TabMove = eventLock.Scroll = false;
			},50);
		});
	});
}

// used to drag tabs up and down, or left and right on the tab_lists
 function MoveTabOnList(tabId, FromIndex,  ToIndex){
	if ($("#"+tabId).is(".pin")){
		if (FromIndex < ToIndex){
			vt.PinList.children().eq(ToIndex).after($("#"+tabId));
		}
		if (FromIndex >= ToIndex){
			vt.PinList.children().eq(ToIndex).before($("#"+tabId));
		}
	}
	if ($("#"+tabId).is(".tab")){
		if (FromIndex < ToIndex){
			vt.TabList.children().eq(ToIndex-vt.PinList.children().length).after($("#"+tabId));
		}
		if (FromIndex >= ToIndex){
			vt.TabList.children().eq(ToIndex-vt.PinList.children().length).before($("#"+tabId));
		}
	}
}

function SetTabClass(Node, pin){
	if (pin){
		Node.addClass("pin").removeClass("tab").removeClass("show_close");
	}
	if (!pin){
		Node.addClass("tab").removeClass("pin");
	}
	RefreshGUI();
}

function PinUnpinTabs(tabsIds, pin){
	tabsIds.forEach(function(tabId) {
		chrome.tabs.update(tabId, {pinned: pin});
	});
}

function ScrollTabList(tabId){
	if ($("#"+tabId).length == 0 || eventLock.Scroll){
		return;
	}
	if ($("#"+tabId).is(".pin")){
		if ($("#"+tabId).position().left+$("#"+tabId).outerWidth() > vt.PinList.innerWidth()){
			vt.PinList.scrollLeft(vt.PinList.scrollLeft()+$("#"+tabId).position().left+$("#"+tabId).outerWidth()-vt.PinList.innerWidth());
		} else {
			if ($("#"+tabId).position().left < 0){
				vt.PinList.scrollLeft(vt.PinList.scrollLeft()+$("#"+tabId).position().left);
			}
		}
	}
	if ($("#"+tabId).is(".tab")){
		if ($("#"+tabId).position().top+$("#"+tabId).outerHeight() > vt.TabList.innerHeight()){
			vt.TabList.scrollTop(vt.TabList.scrollTop()+$("#"+tabId).position().top+$("#"+tabId).outerHeight()-vt.TabList.innerHeight());
		} else {
			if ($("#"+tabId).position().top < 0){
				vt.TabList.scrollTop(vt.TabList.scrollTop()+$("#"+tabId).position().top);
			}
		}
	}
	if ($("#"+tabId).outerHeight() < 21){
		setTimeout(function(){
			ScrollTabList(tabId);
		},100);
	}
}

function ScrollToNewTab(tabId, retries){
	if (retries == undefined ){
		retries = 0;
	}
	if (bg.opt.scroll_to_new == false || retries > 5){
		return;
	}
	if ($("#"+tabId).length > 0){
		ScrollTabList(tabId);
	} else {
		setTimeout(function(){
			ScrollToNewTab(tabId, retries+1);
		},20);
	}
}

function CloseTabs(tabsIds){
	if (bg.opt.after_close_action != "opera"){
		tabsIds.forEach(function(tabId) {
			if ($("#"+tabId).is(".active")){
				ActivateTabThatHasNoClass("selected");
			}
		});
	}
	tabsIds.forEach(function(tabId) {
		if ($("#"+tabId).is(".pin") && bg.opt.allow_pin_close){
			$("#"+tabId).remove();
			chrome.tabs.update(tabId, {pinned: false});
		}
		if ($("#"+tabId).is(".tab") && !bg.opt.openclose_animation){
			$("#"+tabId).remove();
		}
	});
	setTimeout(function(){
		chrome.tabs.remove(tabsIds, null);
		RefreshGUI();
	},(bg.opt.openclose_animation ? 400 : 100));
}

function RemoveTabFromList(tabId){
	if ($("#"+tabId).length == 0){
		return;
	}
	if (bg.opt.openclose_animation){
		$("#"+tabId).css({"opacity": 0, "height": 0});
	} else {
		$("#"+tabId).css({"opacity": 0, "height": 0, "display": "none"});
	}
	setTimeout(function(){
		$("#"+tabId).remove();
		RefreshGUI();
	},500);
}

function SetActiveTab(tabId){
	$(".active").removeClass("active").removeClass("selected");
	$("#"+tabId).addClass("active").addClass("selected");
	if (bg.opt.scroll_to_active){
		ScrollTabList(tabId);
	}
	SetActiveTabInActiveGroup(tabId);
}

function ActivateTabThatHasNoClass(ClassName){
	var T = $(".active").is(".pin") ? ".pin" : ".tab";
	if ($(T+":visible:not(."+ClassName+")").length > 0){
		var tabId;
		// activate last active tab
		if (bg.opt.after_close_action == "last" && $("#"+vt.lastActiveTabId[0]).length > 0 && $("#"+vt.lastActiveTabId[0]).is(":visible:not(."+ClassName+")")){
			tabId = vt.lastActiveTabId[0];
		}
		if (bg.opt.after_close_action == "prev" || bg.opt.after_close_action == "next" || tabId == undefined){
			if ($(T+"."+ClassName+":first").prevAll(T+":visible").length > 0){
				tabId = parseInt($(T+"."+ClassName).prevAll(T+":visible:first")[0].id);
			}
		}			
		if (bg.opt.after_close_action == "next" || tabId == undefined){
			if ($(T+"."+ClassName+":last").nextAll(T+":visible").length > 0){
				tabId = parseInt($(T+"."+ClassName+":last").nextAll(T+":visible:first")[0].id);
			}
		}			
		if (tabId){
			chrome.tabs.update(tabId,{active:true});
		}
		SaveData();
	}
}

// if tabId is-1 then it detaches all selected tabs
function DetachTabs(tabsIds){
	chrome.windows.get(vt.windowId, {populate : true}, function(window){
		if (window.tabs.length == 1){
			return;
		}
		chrome.windows.create(bg.OperaVersion > 30 ? {tabId:tabsIds[0], state:window.state} : {tabId:tabsIds[0]}, function(window){
			for (var i = 1; i < tabsIds.length; i++){
				chrome.tabs.move(tabsIds[i], {windowId: window.id, index:-1});
			}
		})
	});
}

// create tabs from array of links. and move them to group
function CreateTabs(tabs_urls_array, groupId){
	eventLock.Scroll = true; // disable scrolling
	eventLock.NewTab = true; // do not append new tab via chrome listener
	chrome.tabs.create({ active: false, url: tabs_urls_array[0] }, function(tab){
		AppendTab(tab, groupId, true, true);
		bg.tabs[tab.id].g = groupId;
		tabs_urls_array.splice(0, 1);
		if (tabs_urls_array.length > 0){
			setTimeout(function(){
				CreateTabs(tabs_urls_array, groupId);
			},500);
		}
		eventLock.Scroll = false; // restore scrolling
		eventLock.NewTab = false;
		// if tabs discarding will be implemented, it will unload tabs after restoring group
		setTimeout(function(){
			DiscardTabs([tab.id]);
		},1000);
	});
}

function DiscardTabs(tabsIds){
	var delay = 800;
	if ($("#"+tabsIds[0]).is(".discarded")){
		delay = 5;
	} else {
		chrome.tabs.discard(tabsIds[0]);
	}
	tabsIds.splice(0, 1);
	if (tabsIds.length > 0){
		setTimeout(function(){
			DiscardTabs(tabsIds);
		},delay);
	}
}