// **********       GROUPS FUNCTIONS        ***************

function SaveData(){
	chrome.runtime.sendMessage({command: "save_data"}, function(response){});
}

function AppendAllGroups(){
	var scroll = $("#group_list").scrollTop();
	$(".group").remove();
	if (bg.groups.length == 0){
		return;
	}
	bg.groups.forEach(function(group){
		AppendGroupToList(group.g, group.n, group.c, group.f);
	});
	SetActiveGroup(vt.ActiveGroup, false, false);
	$("#group_list").scrollTop(scroll);
}

function AppendGroupToList(groupId, group_name, background_color, font_color){
	if ($("#"+groupId).length > 0){
		return;
	}
	var div_group = document.createElement("div");
		div_group.id = groupId;
		div_group.className = "group";
		div_group.innerHTML = "<div class=group_title_container><span class=group_title>"+group_name+"</span><span class=group_tab_count> (0)</span></div>";
	$("#group_list")[0].appendChild(div_group);
	$("#"+groupId).attr("draggable", "true");
	$("#"+groupId+"> .group_title_container > .group_title").css({"color": "#"+font_color});
	$("#"+groupId+"> .group_title_container > .group_tab_count").css({"color": "#"+font_color});
	$("#"+groupId).css({"background-color": "#"+background_color});
	RefreshGUI();
}

function AddNewGroup(color){
	var newId = GetRandomID();
	bg.groups.push({g: "g_"+newId, n:bg.caption_group, c: color, f: "d9d9d9", i: 0});
	AppendGroupToList("g_"+newId, bg.caption_group, color);
	$("#group_list").scrollTop($("#group_list")[0].scrollHeight);
	SaveData();
	chrome.runtime.sendMessage({command: "groups_reappend", windowId: vt.windowId}, function(response) {});
	return "g_"+newId;
}

/*
This is the main brain that commands where tabs go after drag&drop and even after pin or unpin, parameters are passed in object:
tabsIds: array of tabIds,
groupId: append to group with groupId, if "0" will append to PinList
SwitchTabIfHasActive: if true, switches to inactive tab before doing anything,
tabId: will append tabs, before or after tabId depending on insertAfter parameter,
insertAfter: if not undefined, bool: if true will insert after tabId or append to PinList/TabList if tabId does not exist, if false will insertBefore or prepend PinList/TabList
moveTabs: if not undefined, bool: true will move browsers tabs, if false will move them in backward direction
activateGroup: switch to groupId
RemoveClass: for example "selected"
*/
function AppendTabsToGroup(p){
	if (p.groupId == "at"){
		p.groupId = "ut";
	}
	
	p.tabsIds.forEach(function(tabId){
		$("#"+tabId).addClass("grouping");
	});
	
	SetTabClass($(".grouping"), p.groupId == "0" ? true : false);

	if (p.RemoveClass != undefined){
		$(".grouping:not(.active)").removeClass(p.RemoveClass);
	}
	
	if (p.SwitchTabIfHasActive == true){
		if ($(".grouping").hasClass("active")){
			ActivateTabThatHasNoClass("grouping");
		}
	}

	if (p.insertAfter != undefined){
		if (p.groupId == "0"){
			$(".grouping").appendTo(vt.PinList);
		} else {
			if (p.insertAfter){
				$(".grouping").appendTo(vt.TabList);
				if ($(":not(.grouping).tab."+p.groupId).length > 0){
					$(".grouping").insertAfter($(":not(.grouping).tab."+p.groupId+":last"));
				}
			} else {
				$(".grouping").prependTo(vt.TabList);
			}
		}
	}
	
	if (p.tabId != undefined){
		if ($("#"+p.tabId).length > 0){
			if (p.insertAfter == true){
				$(".grouping").insertAfter($("#"+p.tabId));
			}
			if (p.insertAfter == false){
				$(".grouping").insertBefore($("#"+p.tabId));
			}
		}
	}
	
	if (p.activateGroup == true){
		SetActiveGroup(p.groupId, true, true);
	}
	
	if (p.moveTabs != undefined){
		MoveBrowserTabs(p.tabsIds, p.groupId == "0");
	}
	p.tabsIds.forEach(function(tabId){
		$("#"+tabId).removeClass("grouping");
		if (bg.tabs[tabId]){
			bg.tabs[tabId].g = p.groupId;
		} else {
			bg.tabs[tabId] = { g: p.groupId, h: 0 };
		}
		ReplaceGroupClassInTab(tabId, p.groupId);
	});
	
	$(".grouping").removeClass("grouping");
	SaveData();
	RefreshGUI();
}

function ReplaceGroupClassInTab(tabId, groupId){
	if ($("#"+tabId).length == 0){
		return;
	}
	if (groupId == "at"){
		groupId = "ut";
	}
	var classes = $("#"+tabId)[0].className.split(" ");
	classes.forEach(function(className) {
		if (className.match("g_|0|at|ut") != null){
			$("#"+tabId).removeClass(className);
		}
	});
	$("#"+tabId).addClass(groupId);
}

// remove group, delete tabs if close_tabs is true
function GroupRemove(groupId, close_tabs){
	bg.groups.splice($("#"+groupId).index(),1);
	if (vt.ActiveGroup == groupId){
		SetActiveGroup($("#"+groupId).prev()[0] ? $("#"+groupId).prev()[0].id : "ut", true, true);
	}
	$("#"+groupId).remove();
	if (close_tabs){
		CloseTabs($(".tab."+groupId).map(function(){return parseInt(this.id);}).toArray());
	} else {
		AppendTabsToGroup({tabsIds: $(".tab."+groupId).map(function(){return parseInt(this.id);}).toArray(), groupId:"ut", insertAfter: true, moveTabs: true});
	}
	RefreshGUI();
	SaveData();
	chrome.runtime.sendMessage({command: "group_removed", groupId: groupId, windowId: vt.windowId}, function(response) {});
}

function UpdateBgGroupsOrder(){
	var new_groups = [];
	$(".group").each(function(){
		for (var group_index = 0; group_index < bg.groups.length; group_index++){
			if (bg.groups[group_index].g == this.id){
				new_groups.push(bg.groups[group_index]);
				break;
			}
		}
	});
	bg.groups.splice(0, bg.groups.length);
	bg.groups = new_groups.slice();
	SaveData();
	chrome.runtime.sendMessage({command: "groups_reappend", windowId: vt.windowId}, function(response) {});
}

function SetActiveGroup(groupId, switch_to_active_in_group, scroll_to_active){
	if ($("#"+groupId)[0] == undefined){
		return;
	}
	vt.ActiveGroup = groupId;
	$(".active_group").removeClass("active_group");
	$("#"+vt.ActiveGroup).addClass("active_group");
	RefreshGUI();
	if (switch_to_active_in_group){
		if ($(".tab:visible").length != 0 && $(".tab.active:visible").length == 0){
			var tabId = $(".tab:visible")[0].id;
			if (vt.ActiveGroup.match("at|ut") == null && $("#"+bg.groups[$("#"+vt.ActiveGroup).index()].i).is(":visible")){
				tabId = bg.groups[$("#"+vt.ActiveGroup).index()].i;
			}
			if (vt.ActiveGroup == "ut" && $(".tab#"+vt.utActiveTab+":visible").length > 0){
				tabId = vt.utActiveTab;
			}
			chrome.tabs.update(parseInt(tabId), {active:true});
			SaveData();
		}	
	}	
	if (scroll_to_active && bg.opt.scroll_to_active){
		if ($(".active").is(".tab:visible")){
			ScrollTabList($(".tab.active:visible")[0].id);
		}
	}
	ScrollToGroup(vt.ActiveGroup);
}

function SetActiveTabInActiveGroup(tabId){
	if (vt.ActiveGroup == "ut"){
		vt.utActiveTab = tabId;
	}
	if (vt.ActiveGroup.match("at|ut") == null && $("#"+tabId).length != 0 && $("#"+tabId).is(".tab")){
		bg.groups[$("#"+vt.ActiveGroup).index()].i = tabId;
		SaveData();
	}
}

// direction == true goes up, false goes down
function ScrollGroupList(direction){
	if (direction){
		$("#group_list").scrollTop($("#group_list").scrollTop()-3);
	}
	if (!direction){
		$("#group_list").scrollTop($("#group_list").scrollTop()+3);
	}
	if (IOKeys.LMB){
		setTimeout(function(){ ScrollGroupList(direction); },10);
	}
}

function ScrollToGroup(groupId){
	if ($("#"+groupId).offset().top-$("#group_list").offset().top < 1){
		$("#group_list").scrollTop($("#group_list").scrollTop()+$("#"+groupId).offset().top-$("#group_list").offset().top-1);
	} else {
		if ($("#"+groupId).offset().top+$("#"+groupId).outerHeight()+1 > $("#group_list").offset().top+$("#group_list").innerHeight()){
			$("#group_list").scrollTop($("#group_list").scrollTop()+$("#"+groupId).offset().top-$("#group_list").offset().top-$("#group_list").innerHeight()+$("#"+groupId).outerHeight()-1);
		}
	}
}
