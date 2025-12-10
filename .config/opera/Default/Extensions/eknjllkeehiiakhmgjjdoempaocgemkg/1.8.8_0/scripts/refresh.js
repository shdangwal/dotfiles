// **********          REFRESH GUI          ***************

//////////// MEDIA ICON ////////////
$(document).on("mousedown", ".tab_mediaicon", function(event){
	if (event.button == 0 && bg.OperaVersion > 41){
		chrome.tabs.get(parseInt(this.parentNode.parentNode.id), function(tab){
			chrome.tabs.update(tab.id, {muted:!tab.mutedInfo.muted});
		});
	}
});

// set discarded class
function RefreshDiscarded(tabId){
	if ($("#"+tabId).length > 0){
		chrome.tabs.get(parseInt(tabId), function(tab){
			if (tab.discarded){
				$("#"+tabId).addClass("discarded");
			} else {
				$("#"+tabId).removeClass("discarded");
			}
		});
	}
}

// change media icon
function RefreshMediaIcon(tabId){
	if ($("#"+tabId).length > 0 && bg.tabs[tabId] && bg.OperaVersion > 34){
		chrome.tabs.get(parseInt(tabId), function(tab){
			if (tab){
				if (tab.mutedInfo.muted){
					$("#m_"+tabId).css({"display": "inline-block", "background-image": bg.paths.icon_media_muted});
				}
				if (!tab.mutedInfo.muted && tab.audible){
					$("#m_"+tabId).css({"display": "inline-block", "background-image": bg.paths.icon_media});
				}
				if (!tab.mutedInfo.muted && !tab.audible){
					$("#m_"+tabId).css({"display": "none", "background-image": ""});
				}
			}
		});
	}
}

// get favicon and title
function GetFaviconAndTitle(tabId){
	if ($("#"+tabId).length > 0){
		chrome.tabs.get(parseInt(tabId), function(tab){
			if (tab){
				// change title
				// var title = (tab.title == undefined || tab.title == null || tab.title == "") ? tab.url : tab.title;
				var tab_title = $("#t_"+tab.id)[0].textContent = (tab.title == undefined || tab.title == null || tab.title == "") ? tab.url : tab.title;
				if (tab.status == "complete"){
					// compatibility with Tab suspender extension
					if (tab.favIconUrl != undefined && tab.favIconUrl.match("data:image/png;base64") != null){
						$("#f_"+tab.id).css({"background-image": "url("+tab.favIconUrl+")"});
					// change favicon
					} else if (tab.url.match("opera://|browser://|chrome://|chrome-extension://") != null || !tab.favIconUrl){
							$("#f_"+tab.id).css({"background-image": "url(chrome://favicon/"+tab.url+")"});
						} else {
							var img = new Image(); img.src = tab.favIconUrl;
							img.onload = function(){ $("#f_"+tab.id).css({"background-image": "url("+tab.favIconUrl+")"}); };
							img.onerror = function(){ $("#f_"+tab.id).css({"background-image": "url(chrome://favicon/"+tab.url+")"}); }
						}
				} else if (tab.status == "loading"){
					$("#f_"+tab.id).css({"background-image": bg.paths.icon_loading});
					tab_title = $("#t_"+tab.id)[0].textContent = bg.caption_loading;
					setTimeout(function(){
						GetFaviconAndTitle(tabId);
					},1000);
				}
				$("#"+tab.id).attr("title", tab_title);
			}
		});
	}
}

// change sizes of all windows and tab classes, one of the most important functions
function RefreshGUI(){
	// if active group is "ut", will show only ungrouped tabs
	if (vt.ActiveGroup == "ut"){
		$(".tab").css({"display": "none"});
		$(".tab.ut, .tab.at").css({"display": ""});
	}
	// if active group is "at", will show all tabs
	if (vt.ActiveGroup == "at"){
		$(".tab").css({"display": ""});
	}
	// if active group is neither "at" nor "ut", will hide all tabs, and show tabs from active group, but not "filtered from search box"
	if (vt.ActiveGroup != "at" && vt.ActiveGroup != "ut"){
		$(".tab:not(."+vt.ActiveGroup+")").css({"display": "none"});
		$(".tab."+vt.ActiveGroup+":not(.filtered)").css({"display": ""});
	}
	// show pins
	$(".pin").css({"display": ""});
	// hide filtered tabs
	$(".filtered").css({"display": "none"});
	
	
	if ($("#button_tools, #button_search").is(".on")){
		$("#toolbar").css({"height": vt.ToolbarHeight[1]});
		$("#content_container").css({"height": $(window).height()-vt.ToolbarHeight[1]-1});
	} else {
		$("#toolbar").css({"height": vt.ToolbarHeight[0]});
		$("#content_container").css({"height": $(window).height()-vt.ToolbarHeight[0]-1});
	}
	$("#tabs_container").css({"width": $(window).width()-$("#group_list").outerWidth()});
	if (vt.PinList.children().length > 0){
		vt.PinList.removeClass("hidden");
		vt.TabList.css({"height": $("#content_container").innerHeight()-vt.PinList.outerHeight()+1});
	} else {
		vt.TabList.css({"height": "100%"});
		vt.PinList.addClass("hidden");
	}
	$("#group_list").css({"height": $("#tabs_container").innerHeight()-$("#toolbar_groups").outerHeight()-(2*$(".scroll_group").outerHeight())-2}); // 2px borders
	$("#filter_box").css({"width": ($(window).width()-20-2*$(".button").width())});
	if ($("#filter_box").width() > 20 && $("#filter_box")[0].value != ""){
		$("#button_filter_clear").css({"opacity": ""});
	} else {
		$("#button_filter_clear").css({"opacity": "0"});
	}
	$(".group_tab_count").each(function(){
		$(this)[0].innerText = " ("+$("."+$(this).parent().parent()[0].id).length+")";
	});
	$(".group").each(function(){
		$(this).css({"height": $(this).children().children(".group_title").outerWidth()+$(this).children().children(".group_tab_count").outerWidth()+16});
	});
}
