// **********         CHROME EVENTS         ***************

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	if (message.command == "reload"){
		window.location.reload();
	}
	
	if (bg.hold){
		return;
	}
	
	if (message.windowId != vt.windowId){
		switch(message.command){
			case "group_removed":
				AppendTabsToGroup({tabsIds: $(".tab."+message.groupId).map(function(){return parseInt(this.id);}).toArray(), groupId:"ut"});
				AppendAllGroups();
			break;
			case "groups_reappend":
				AppendAllGroups();
			break;
		}
	}
	
	if (message.windowId == vt.windowId){
		switch(message.command){
			case "tab_created":
				if ($("#"+message.tabId).length > 0 || eventLock.NewTab){
					return;
				}
				bg.tabs[message.tabId].g = message.tab.pinned ? "0" : vt.ActiveGroup.match("at|ut") == null ? vt.ActiveGroup : "ut";
				if (bg.opt.new_open_below){
					
					// lock scrolling, so that it will not jump while moving tab below current active
					eventLock.Scroll = true;

					var index = -1;
					
					if (message.tab.pinned && $(".active:visible").is(".pin")){
						index = 1 + $(".active:visible").index();
					}
					if (!message.tab.pinned && $(".active:visible").is(".tab")){
						index = 1 + $(".active:visible").index() + vt.PinList.children().length;
					}
					if (!message.tab.pinned && $(".active:visible").is(".pin") && $(".tab:visible").length > 0){
						index = $(".tab:visible").first().index() + vt.PinList.children().length;
					}
					
					chrome.tabs.move(message.tabId, {index: index}, function(tab){
						AppendTab(tab, vt.ActiveGroup, true, true);
						eventLock.Scroll = false;
						ScrollToNewTab(message.tabId);
					});
					
				} else {
					AppendTab(message.tab, vt.ActiveGroup, true, true);
					ScrollToNewTab(message.tabId);
				}
			break;
			case "tab_attached":
				if ($("#"+message.tabId).length > 0){
					return;
				}
				bg.tabs[message.tabId].g = message.tab.pinned ? "0" : vt.ActiveGroup.match("at|ut") == null ? vt.ActiveGroup : "ut";
				AppendTab(message.tab, vt.ActiveGroup, true, true);
			break;
			case "tab_removed":
				RemoveTabFromList(message.tabId);
			break;
			case "tab_updated":
				if (message.changeInfo.status != undefined || message.changeInfo.url != undefined || message.changeInfo.title != undefined){
					setTimeout(function(){
						GetFaviconAndTitle(message.tabId);
						setTimeout(function(){
							GetFaviconAndTitle(message.tabId);
						},500);
					},50);
				}
				if (message.changeInfo.audible != undefined || message.changeInfo.mutedInfo != undefined){
					RefreshMediaIcon(message.tabId);
				}
				if (message.changeInfo.discarded != undefined){
					RefreshDiscarded(message.tabId);
				}
				if (message.changeInfo.pinned != undefined && eventLock.TabMove == false){
					AppendTabsToGroup({tabsIds: [message.tabId], groupId: message.tab.pinned ? "0" : vt.ActiveGroup, insertAfter: message.tab.pinned});
					setTimeout(function(){
						ScrollTabList(message.tabId);
					},180);
				}
			break;
			case "tab_moved":
				if (!eventLock.TabMove){
					MoveTabOnList(message.tabId, message.moveInfo.fromIndex, message.moveInfo.toIndex);
					if (bg.opt.scroll_to_moved){
						setTimeout(function(){
							ScrollTabList(message.tabId);
						},180);
					}
				}
			break;
			case "tab_activated":
				// remember previous tab id for close action, if set to "after closing tab, activate previous"
				vt.lastActiveTabId[0] = vt.lastActiveTabId[1];
				vt.lastActiveTabId[1] = message.tabId;

				// set active tab
				setTimeout(function(){
					SetActiveTab(message.tabId);
				},5);
				
				// will change group if active tab is not visible (most likely activated from tab strip or externally by opera)
				setTimeout(function(){
					if ($(".active").length > 0 && $(".active").is(".tab:not(:visible)")){
						SetActiveGroup(bg.tabs[message.tabId].g, false, true);
					}
				},300);
			break;
			case "closing":
				alert("closing");
			break;
		}
	}
});

