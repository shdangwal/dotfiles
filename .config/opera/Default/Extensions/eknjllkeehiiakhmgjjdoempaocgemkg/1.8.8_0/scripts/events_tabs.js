// **********          TABS EVENTS          ***************

function SetTabsEvents(){
	
	//////////// ON MOUSE OVER/LEAVE TABS ////////////
	$(document).on("mouseleave", ".tab", function(event){
		if (bg.opt.always_show_close == false){
			$(".tab").removeClass("show_close");
		}
	});
	$(document).on("mouseover", ".tab", function(event){
		if (bg.opt.always_show_close == false){
			$(this).addClass("show_close");
		}
	});
	$(document).on("mouseover", ".tab_close", function(event){
		$(event.currentTarget).css({"background-image": bg.paths.icon_close_h});
	});
	$(document).on("mouseleave", ".tab_close", function(event){
		$(event.currentTarget).css({"background-image": bg.paths.icon_close});
	});
	$(document).on("mouseover", ".pin, .tab", function(event){
		if (bg.opt.update_favicon_hover){
			GetFaviconAndTitle(parseInt(event.currentTarget.id));
		}
		$(this).addClass("hover");
	});
	$(document).on("mouseleave", ".pin, .tab", function(event){
		$(this).removeClass("hover");
	});
	
	
	//////////// TABS ACTIONS WITH MOUSE ////////////
	
	// double click to create tab
	$(document).on("dblclick", "#tab_list, #pin_list", function(event){
		if (event.button == 0 && event.target.id == "tab_list"){
			chrome.tabs.create({});
		}
		if (event.button == 0 && event.target.id == "pin_list"){
			chrome.tabs.create({pinned: true});
		}
	});
	
	// deselect all when clicked on empty space
	$(document).on("click", "#tab_list, #pin_list", function(event){
		$(".pin:visible, .tab:visible").removeClass("selected").removeClass("frozen").removeClass("temporary").removeClass("hover");
	});
	
	// single click to activate tab
	$(document).on("click", ".tab, .pin", function(event){
		event.stopPropagation();
		// clear selection
		if (!IOKeys.Ctrl && !IOKeys.Shift && $(event.target).is(":not(.tab_close, .tab_mediaicon)")){
			$(".pin:visible, .tab:visible").removeClass("active").removeClass("selected").removeClass("frozen").removeClass("temporary").removeClass("hover"); 
			$(this).addClass("selected").addClass("active").addClass("selected");
			
			// activate tab
			chrome.tabs.update(parseInt(this.id),{active:true});
		}
	});
	
	// select or close tab/pin
	$(document).on("mousedown", ".tab, .pin", function(event){
		if (event.button == 0 && $(event.target).is(":not(.tab_close, .tab_mediaicon)")){
			
			// set selection with shift
			if (IOKeys.Shift){
				$(".pin:visible, .tab:visible").removeClass("selected").removeClass("frozen").removeClass("temporary");
				if ($(this).index() >= $(".active:visible").index()){
					$(".active:visible").nextUntil($(this), ":visible").add($(".active:visible")).add($(this)).addClass("selected");
				} else {
					$(".active:visible").prevUntil($(this), ":visible").add($(".active:visible")).add($(this)).addClass("selected");
				}
			}
			
			// toggle selection with ctrl
			if (IOKeys.Ctrl){
				$(this).toggleClass("selected");
			}
		}
		if ((event.button == 1 && bg.opt.close_with_MMB == true) || (event.button == 0 && $(event.target).is(".tab_close"))){ // close with MMB or if clicked on x
			CloseTabs([parseInt(this.id)]);
		}
	});
	
	//////////// MOVE TABS WITH DRAG AND DROP ////////////
	
	// Prevent the default browser drop action
	$(document).bind("drop dragover", function (event){
		event.preventDefault();
	});
	
	// set source tab to be dragged
	$(document).on("dragstart", ".pin, .tab", function(event){
		var dt = (event.originalEvent.dataTransfer).setDragImage(vt.DragImage, 0, 0);
		bg.dt.tabsIds.splice(0, bg.dt.tabsIds.length);
		bg.dt.CameFromWindowId = vt.windowId;
		bg.dt.DropToGroup = $(this).is(".pin") ? "0" : vt.ActiveGroup;
		QueryData.NodeTab = this;
		$(".hover").removeClass("hover");
		$(".moving").removeClass("moving");
		$(this).addClass("hover");
		if ($(this).is(".selected")){
			$(".selected:visible").addClass("moving");
		}
		if ($(this).is(":not(.selected)")){
			$(".selected").addClass("frozen").removeClass("selected");
			$(this).addClass("moving");
		}
		$(".moving").each(function(){
			bg.dt.tabsIds.push(parseInt(this.id));
		});
	});
	
	// when done with tab dragging
	$(document).on("dragend", ".pin, .tab", function(event){
		if (QueryData.NodeTab != undefined && bg.dt.CameFromWindowId == vt.windowId){
			var pin = $(QueryData.NodeTab).is(".pin");
			setTimeout(function(){
				MoveBrowserTabs(bg.dt.tabsIds, pin);
			},300);
			QueryData.NodeTab = undefined;
			$(".moving").removeClass("moving").removeClass("hover");
			$(".frozen").addClass("selected").removeClass("frozen");
			eventLock.TabMove = eventLock.Scroll = false;
		}
	});
	
	// move tabs up and down while dragging
	$(document).on("dragenter", "#pin_list, #tab_list", function(event){
		IOKeys.MouseHoverOver = this.id;
		bg.dt.DropToGroup = $(this).is("#pin_list") ? "0" : vt.ActiveGroup;
		
		if (
			$(QueryData.NodeTab).parent()[0] == $(this)[0] || $(this).get(0).scrollWidth > $(this).outerWidth()
			|| $(this).get(0).scrollHeight > $(this).outerHeight() || QueryData.NodeTab == undefined
			|| bg.dt.CameFromWindowId != vt.windowId
		){
			return;
		}
		$(".moving").appendTo($(this));
		AppendTabsToGroup({tabsIds: bg.dt.tabsIds, groupId: bg.dt.DropToGroup});
	});

	// move tabs up and down while dragging
	$(document).on("dragenter", ".tab, .pin", function(event){
		bg.dt.DropToGroup = $(this).is(".pin") ? "0" : vt.ActiveGroup;
		if (QueryData.NodeTab == undefined || this == QueryData.NodeTab || bg.dt.CameFromWindowId != vt.windowId){
			return;
		}
		if ($(QueryData.NodeTab).parent()[0] != $(this).parent()[0]){
			AppendTabsToGroup({tabsIds: bg.dt.tabsIds, groupId: bg.dt.DropToGroup});
		}
		
		// slide tabs up
		if ($(this).index() <= $(QueryData.NodeTab).index()){
			if ($(this).is(".moving")){
				$(".moving").first().prevAll(".tab:visible:not(.moving):first, .pin:not(.moving):first").first().insertAfter($(".moving:last"));
			}
			if ($(this).is(":not(.moving)")){
				$(".moving").insertBefore($(this));
			}
			ScrollTabList($(".moving")[0].id);
		} else {
		
		// slide tabs down
			if ($(this).index() > $(QueryData.NodeTab).index()){
				if ($(this).is(":not(.moving)")){
					$(".moving").insertAfter($(this));
				}
				if ($(this).is(".moving")){
					$(".moving").insertAfter($(".moving").last().nextAll(".tab:visible:not(.moving):first, .pin:not(.moving):first"));
				}
				ScrollTabList($(".moving")[$(".moving").length-1].id);
			}
		}
		RefreshGUI();
	});

	$(document).on("drop", ".group, #pin_list, #tab_list, #at, #ut, #add_tabs_to_group, #close_group, #remove_tabs_from_group, #new_group, #scroll_group_up, #group_list, #scroll_group_down", function(event){
		if (bg.dt.tabsIds.length == 0){
			return;
		}

		event.stopPropagation();
		
		if ($(this).is("#new_group, #scroll_group_up, #group_list, #scroll_group_down")){
			bg.dt.DropToGroup = AddNewGroup(575757);
			GetColorFromMiddlePixel(bg.dt.tabsIds[0], bg.dt.DropToGroup);
		}
		
		if (QueryData.NodeTab != undefined && bg.dt.CameFromWindowId == vt.windowId && $(this).is(":not(#pin_list, #tab_list)")){
			AppendTabsToGroup({tabsIds: bg.dt.tabsIds, groupId: bg.dt.DropToGroup, SwitchTabIfHasActive: true, activateGroup: bg.opt.auto_switch_to_group, RemoveClass: "selected", insertAfter: true});
		}
		
		// tabs coming from outside
		if (QueryData.NodeTab == undefined && bg.dt.CameFromWindowId != vt.windowId){
			var target;
			if ($(event.target).closest(".pin, .tab")[0]){
				target = $(event.target).closest(".pin, .tab")[0].id;
			}
			chrome.tabs.move(bg.dt.tabsIds, {windowId: vt.windowId, index:-1}, function(tabs){
				eventLock.Scroll = true;
				setTimeout(function(){
					AppendTabsToGroup({tabsIds: bg.dt.tabsIds, groupId: bg.dt.DropToGroup, tabId: target, SwitchTabIfHasActive: false, activateGroup: bg.opt.auto_switch_to_group, insertAfter: true, moveTabs: true});
					eventLock.Scroll = false;
				},400);
			});	
		}
	});
}