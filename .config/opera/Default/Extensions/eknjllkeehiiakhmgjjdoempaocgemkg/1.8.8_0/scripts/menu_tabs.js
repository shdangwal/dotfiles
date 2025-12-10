// **********             TABS MENU         ***************

// menu main function
function InitializeMenu(){
	
	// set menu labels
	$(".menu_item").each(function(){
		$(this).text(chrome.i18n.getMessage(this.id));
	});
	
	// trigger action when the contexmenu is about to be shown
	$(document).bind("contextmenu", function (event){
		event.preventDefault();
	});
	
	// show menu
	$(document).on("mousedown", "#pin_list, #tab_list, .tab, .pin", function(event){
		event.stopPropagation();
		if (event.button == 2){
			$(".menu").hide(0);
			vt.menuGroupId = vt.ActiveGroup;
			
			if ($(this).is(".tab, .pin")){
				vt.menuTabId = parseInt($(this)[0].id);
			} else {
				vt.menuTabId = parseInt($(".active")[0].id);
			}
			if ($("#"+vt.menuTabId).is(".pin")){
				$("#tabs_menu_pin").text(chrome.i18n.getMessage("tabs_menu_unpin"));
				$("#tabs_menu_close").prev().css({"display": "none"});
				$("#tabs_menu_close_other, #tabs_menu_close_above, #tabs_menu_close_below, #tabs_menu_move_to_group, #tabs_menu_ungroup").css({"display":"none"});
				$("#tabs_menu_move_to_group").next().css({"display":"none"});
				if (!bg.opt.allow_pin_close){
					$("#tabs_menu_close").css({"display":"none"});
				}
			} else {
				$("#tabs_menu_pin").text(chrome.i18n.getMessage("tabs_menu_pin"));
				$("#tabs_menu_close").prev().css({"display": ""});
				$("#tabs_menu_close, #tabs_menu_close_other, #tabs_menu_close_above, #tabs_menu_close_below, #tabs_menu_move_to_group").css({"display": ""});
				$("#tabs_menu_move_to_group").next().css({"display":""});
				if (vt.ActiveGroup != "ut"){
					$("#tabs_menu_ungroup").css({"display":""});
				}
			}
			if (vt.ActiveGroup == "ut"){
				$("#tabs_menu_ungroup").css({"display":"none"});
			}
			if (bg.OperaVersion < 46){
				$("#tabs_menu_discard").css({"display":"none"});
			}
			
			bg.dt.tabsIds = $("#"+vt.menuTabId).is(".selected") ? $(".tab.selected:visible").map(function(){return parseInt(this.id);}).toArray() : [vt.menuTabId];

			// show contextmenu with correct size position
			if ($("#tabs_menu").outerWidth() > $(window).width()-10){
				$("#tabs_menu").css({"width": $(window).width()-10});
			} else {
				$("#tabs_menu").css({"width": ""});
			}
			var x = event.pageX >= $(window).width()-$("#tabs_menu").outerWidth() ? $(window).width()-$("#tabs_menu").outerWidth() : event.pageX;
			var y = event.pageY >= $(window).height()-$("#tabs_menu").outerHeight()-10 ? $(window).height()-$("#tabs_menu").outerHeight()-10 : event.pageY;
			$("#tabs_menu").css({"display": "block", "top": y, "left": x});
		}
	});
	
	// hide menu
	$(document).on("mousedown", "body", function(event){
		if (event.button != 2){
			$(".menu").hide(300);
		}
	});

	$(document).on("mouseleave", "body", function(event){
		$(".menu").hide(300);
	});
	
	// if the menu element is clicked
	$(document).on("mousedown", "#tabs_menu li", function(event){
		if (event.button != 0){
			return;
		}
		event.stopPropagation();
		switch($(this).attr("data-action")){
			case "tab_new":
				chrome.tabs.create({});
			break;
			case "tab_clone": 
				if ($("#"+vt.menuTabId).is(".selected")){
					$(".selected:visible").each(function(){
						chrome.tabs.duplicate(parseInt(this.id));
					});
				} else {
					chrome.tabs.duplicate(vt.menuTabId);
				}
			break;
			case "tab_move":
				if ($("#"+vt.menuTabId).is(".selected")){
					DetachTabs($(".selected:visible").map(function(){return parseInt(this.id);}).toArray());
				} else {
					DetachTabs([vt.menuTabId]);
				}
			break;
			case "tab_reload":
				if ($("#"+vt.menuTabId).is(".selected")){
					$(".selected:visible").each(function(){
						chrome.tabs.reload(parseInt(this.id));
					});
				} else {
					chrome.tabs.reload(vt.menuTabId);
				}
			break;
			case "tab_pin":
				if ($("#"+vt.menuTabId).is(".selected")){
					$(".selected:visible").each(function(){
						chrome.tabs.update(parseInt(this.id), { pinned: ($("#"+vt.menuTabId).is(".pin") ? false : true) });
					});
				} else {
					chrome.tabs.update(vt.menuTabId, { pinned: ($("#"+vt.menuTabId).is(".pin") ? false : true) });
				}
			break;
			case "tab_mute":
				if ($("#"+vt.menuTabId).is(".selected")){
					$(".selected:visible").each(function(){
						chrome.tabs.get(parseInt(this.id), function(tab){
							chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
						});
					});
				} else {
					chrome.tabs.get(vt.menuTabId, function(tab){
						chrome.tabs.update(tab.id, {muted: !tab.mutedInfo.muted});
					});
				}
			break;
			case "tab_mute_other":
				if ($("#"+vt.menuTabId).is(".selected")){
					$(".tab:visible:not(.selected)").each(function(){
						chrome.tabs.update(parseInt(this.id), {muted: true});
					});
				} else {
					$(".tab:visible:not(#"+vt.menuTabId+")").each(function(){
						chrome.tabs.update(parseInt(this.id), {muted: true});
					});
				}
			break;
			case "tab_unmute_other":
				if ($("#"+vt.menuTabId).is(".selected")){
					$(".tab:visible:not(.selected)").each(function(){
						chrome.tabs.update(parseInt(this.id), {muted: false});
					});
				} else {
					$(".tab:visible:not(#"+vt.menuTabId+")").each(function(){
						chrome.tabs.update(parseInt(this.id), {muted: false});
					});
				}
			break;
			case "tab_close":
				CloseTabs($("#"+vt.menuTabId).is(".selected") ? $(".selected:visible").map(function(){return parseInt(this.id);}).toArray() : [vt.menuTabId]);
			break;
			case "tab_close_other":
				CloseTabs($(".tab:visible:not(#"+vt.menuTabId+")").map(function(){return parseInt(this.id);}).toArray());
			break;
			case "tab_close_above":
				CloseTabs($("#"+vt.menuTabId).prevAll(".tab:visible").map(function(){return parseInt(this.id);}).toArray());
			break;
			case "tab_close_below":
				CloseTabs($("#"+vt.menuTabId).nextAll(".tab:visible").map(function(){return parseInt(this.id);}).toArray());
			break;
			case "tab_undo_close":
				chrome.sessions.getRecentlyClosed( null, function(sessions){
					if (sessions.length > 0){
						chrome.sessions.restore(null, function(){});
					}
				});
			break;
			case "tab_discard":
				if (vt.menuGroupId.match("at") != null){
					DiscardTabs(bg.dt.tabsIds);
				}
				if (vt.menuGroupId.match("ut") != null){
					DiscardTabs(bg.dt.tabsIds);
				}
				if (vt.menuGroupId.match("at|ut") == null){
					DiscardTabs(bg.dt.tabsIds);
				}
			break;
			case "tab_bookmark":
				if (vt.menuGroupId.match("at") != null){
					BookmarkTabs(bg.dt.tabsIds, "All tabs");
				}
				if (vt.menuGroupId.match("ut") != null){
					BookmarkTabs(bg.dt.tabsIds, "Ungrouped tabs");
				}
				if (vt.menuGroupId.match("at|ut") == null){
					BookmarkTabs(bg.dt.tabsIds, bg.groups[$("#"+vt.menuGroupId).index()].n);
				}
			break;
			case "tab_ungroup":
				AppendTabsToGroup({tabsIds: bg.dt.tabsIds, groupId: "ut", SwitchTabIfHasActive: true, insertAfter: true, moveTabs: true});
			break;
			case "tab_move_to_group":
				setTimeout(function(){
					ShowMoveToGroupWindow(event.pageX, event.pageY);
				},10);
			break;
			case "tab_settings":
				chrome.tabs.create({"url": "options.html" });
			break;
		}
		$(".menu").hide(0);
	});
}
