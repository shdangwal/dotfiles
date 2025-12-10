// **********         GROUPS EVENTS         ***************

function SetGroupsEvents(){
	// scroll groups
	$(document).on("mousedown", "#scroll_group_up, #scroll_group_down", function(event){
		IOKeys.LMB = true;
		ScrollGroupList($(this).is("#scroll_group_up"));
	});
	$(document).on("mouseleave", "#scroll_group_up, #scroll_group_down", function(event){
		IOKeys.LMB = false;
	});
	
	// remove tabs from group button
	$(document).on("mousedown", "#remove_tabs_from_group", function(event){
		if (event.button == 0 && vt.ActiveGroup.match("at|ut") == null){
			AppendTabsToGroup({tabsIds: $(".tab.selected:visible").map(function(){return parseInt(this.id);}).toArray(), groupId: "ut", SwitchTabIfHasActive: true, insertAfter: true, moveTabs: true});
		}
	});
	
	// new group button
	$(document).on("mousedown", "#new_group", function(event){
		if (event.button == 0){
			AddNewGroup(GetRandomHexColor());
		}
	});
	
	// activate group
	$(document).on("mousedown", ".group, #at, #ut", function(event){
		if (event.button == 0){
			$(".filtered").removeClass("filtered");
			RefreshGUI();
			SetActiveGroup(this.id, true, true);
		}
	});
	
	// remove group
	$(document).on("mousedown", ".group", function(event){
		if (event.button == 1 || IOKeys.Shift){
			if (IOKeys.Shift){
				GroupRemove($(this)[0].id, true);
			} else {
				GroupRemove($(this)[0].id, false);
			}
		}
	});
	
	// close group button
	$(document).on("mousedown", "#close_group", function(event){
		if (vt.ActiveGroup.match("at|ut") != null){
			return;
		}
		if (event.button == 0 || IOKeys.Shift){
			if (IOKeys.Shift){
				GroupRemove(vt.ActiveGroup, true);
			} else {
				GroupRemove(vt.ActiveGroup, false);
			}
		}
	});
	
	// dragging groups
	$(document).on("dragstart", ".group", function(event){
		QueryData.NodeGroup = this;
		var dt = (event.originalEvent.dataTransfer).setDragImage(vt.DragImage, 0, 0);
	});
	
	// when dragging the group, move it up or down
	$(document).on("dragenter", ".group", function(event){
		bg.dt.DropToGroup = this.id;
		if (QueryData.NodeGroup == undefined || this == QueryData.NodeGroup){
			return;
		}
		if ( $(this).index() <= $("#"+QueryData.NodeGroup.id).index()){
			$("#"+QueryData.NodeGroup.id).insertBefore($(this));
		} else {
			if ( $(this).index() > $("#"+QueryData.NodeGroup.id).index()){
				$("#"+QueryData.NodeGroup.id).insertAfter($(this));
			}
		}
	});
	
	// when entering to ungrouped
	$(document).on("dragenter", "#at, #ut, #add_tabs_to_group, #close_group, #remove_tabs_from_group", function(event){
		bg.dt.DropToGroup = "ut";
	});
	
	// when finished dragging the group
	$(document).on("dragend", ".group", function(event){
		QueryData.NodeGroup = undefined;
		UpdateBgGroupsOrder();
	});
}
