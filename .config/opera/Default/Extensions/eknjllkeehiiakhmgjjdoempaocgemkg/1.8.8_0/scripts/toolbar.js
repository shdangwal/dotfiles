// **********             TOOLBAR           ***************

function SaveOptions(){
	chrome.runtime.sendMessage({command: "options_save"}, function(response) {});
}

function InitializeToolbar(){
	// groups toolbar (toggle toolbar)
	$(document).on("mousedown", "#button_group_bar", function(event){
		if (event.button != 0){
			return;
		}
		$(this).toggleClass("on");
		$("#groups_container").toggleClass("hidden");
		bg.opt.show_group_bar = $(this).is(".on");
		RefreshGUI();
		SaveOptions();
	});
	// tools and search buttons toggle
	$(document).on("mousedown", "#button_tools, #button_search", function(event){
		if (event.button != 0){
			return;
		}
		if ($(this).is(".on")){
			$("#button_tools, #button_search").removeClass("on");
			$("#toolbar_tools, #toolbar_search").addClass("hidden");
			bg.opt.active_toolbar_tool = "";
		} else {
			$(this).addClass("on");
			if ($(this).is("#button_tools")){
				$("#button_search").removeClass("on");
				$("#toolbar_search").addClass("hidden");
				$("#toolbar_tools").removeClass("hidden");
				bg.opt.active_toolbar_tool = "tools";
			} else {
				$("#button_tools").removeClass("on");
				$("#toolbar_tools").addClass("hidden");
				$("#toolbar_search").removeClass("hidden");
				bg.opt.active_toolbar_tool = "search";
			}
		}
		RefreshGUI();
		SaveOptions();
	});
	// new tab
	$(document).on("mousedown", "#button_new", function(event){
		if (event.button == 0){
			chrome.tabs.create({});
		}
		if (event.button == 1){
			chrome.tabs.query({windowId: vt.windowId, active: true}, function(tabs){
				chrome.tabs.duplicate(tabs[0].id);
			});
		}
		if (event.button == 2){
			chrome.tabs.query({windowId: vt.windowId, active: true}, function(tabs){
				ScrollTabList(tabs[0].id);
			});
		}
	});
	// pin tab
	$(document).on("mousedown", "#button_pin", function(event){
		if (event.button != 0){
			return;
		}
		$(".selected:visible").each(function(){
			chrome.tabs.update(parseInt(this.id), { pinned: ($(this).is(".pin") ? false : true) });
		});
	});
	// undo close
	$(document).on("mousedown", "#button_undo", function(event){
		if (event.button != 0){
			return;
		}
		chrome.sessions.getRecentlyClosed( null, function(sessions){
			if (sessions.length > 0){
				chrome.sessions.restore(null, function(){});
			}
		});
	});
	// move tab to new window (detach)
	$(document).on("mousedown", "#button_move", function(event){
		if (event.button != 0){
			return;
		}
		DetachTabs($(".selected:visible").map(function(){ return parseInt(this.id); }).toArray());
	});
	// move tab to new window (detach)
	$(document).on("mousedown", "#repeat_search", function(event){
		if (event.button != 0){
			return;
		}
		FindTab($("#filter_box")[0].value);
	});
	// filter on input
	$("#filter_box").on("input", function(){
		if ($("#filter_box")[0].value == ""){
			$("#button_filter_clear").css({"opacity": "0"}).attr("title", "");
		} else {
			$("#button_filter_clear").css({"opacity": ""}).attr("title", bg.caption_clear_filter);
		}
		FindTab($("#filter_box")[0].value);
	});
	// change filtering type
	$("#button_filter_type").addClass(bg.opt.filter_type);
	$(document).on("mousedown", "#button_filter_type", function(event){
		if (event.button != 0){
			return;
		}
		$("#button_filter_type").toggleClass("url").toggleClass("title");
		if (bg.opt.filter_type == "url"){
			bg.opt.filter_type = "title";
		} else {
			bg.opt.filter_type = "url";
		}
		FindTab($("#filter_box")[0].value);
		SaveOptions();
	});
	// clear filter button
	$(document).on("mousedown", "#button_filter_clear", function(event){
		if (event.button != 0){
			return;
		}
		$("#button_filter_clear").css({"opacity": "0"}).attr("title", "");
		FindTab("");
	});
	// sort tabs
	$(document).on("mousedown", "#button_sort", function(event){
		if (event.button != 0){
			return;
		}
		SortTabs();
	});
	// bookmarks
	$(document).on("mousedown", "#button_bookmarks", function(event){
		if (event.button != 0){
			return;
		}
		chrome.tabs.create({url: "chrome://bookmarks/"});
	});
	// downloads
	$(document).on("mousedown", "#button_downloads", function(event){
		if (event.button != 0){
			return;
		}
		chrome.tabs.create({url: "chrome://downloads/"});
	});
	// history
	$(document).on("mousedown", "#button_history", function(event){
		if (event.button != 0){
			return;
		}
		chrome.tabs.create({url: "chrome://history/"});
	});
	// extensions
	$(document).on("mousedown", "#button_extensions", function(event){
		if (event.button != 0){
			return;
		}
		chrome.tabs.create({url: "chrome://extensions"});
	});
	// settings
	$(document).on("mousedown", "#button_settings", function(event){
		if (event.button != 0){
			return;
		}
		chrome.tabs.create({url: "chrome://settings/"});
	});
	// vertical tabs options
	$(document).on("mousedown", "#button_options", function(event){
		if (event.button != 0){
			return;
		}
		chrome.tabs.create({url: "options.html" });
	});
	// discard tabs
	$(document).on("mousedown", "#button_discard", function(event){
		if (event.button != 0){
			return;
		}
		chrome.tabs.query({windowId: vt.windowId}, function(tabs){
			var tabsIds = [];
			tabs.forEach(function(Tab){
				tabsIds.push(Tab.id);
			});
			DiscardTabs(tabsIds);
		});
	});
}
