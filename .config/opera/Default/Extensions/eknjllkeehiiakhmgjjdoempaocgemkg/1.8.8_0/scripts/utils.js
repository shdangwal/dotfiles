// **********              UTILS            ***************

function log(o){
	chrome.runtime.sendMessage({command: "log", m: o}, function(response) {});
}

// sort tabs main function
function SortTabs(){
	if ($(".tab").find(":visible:first")[0]){
		chrome.tabs.query({windowId: vt.windowId}, function(tabs){
			tabs.sort(function(tab_a, tab_b){
				return SplitUrl(tab_a).localeCompare(SplitUrl(tab_b));
			});
			var first_tabId;
			if ($(".selected:visible")[0]){
				first_tabId = parseInt($(".selected:visible")[0].id);
			} else {
				first_tabId = parseInt($(".tab").find(":visible:first")[0].parentNode.id);
			}
			chrome.tabs.get(first_tabId, function(tab){
				var new_index = tab.index;
				tabs.forEach(function(Tab){
					// sort selected when more than 1 tab is selected
					if (($(".selected:visible").length > 1 && $("#"+Tab.id).is(":visible") && !Tab.pinned && $("#"+Tab.id).is(".selected")) || ($(".selected:visible").length < 2 && $("#"+Tab.id).is(":visible") && !Tab.pinned)){
						chrome.tabs.move(Tab.id, {"index": new_index});
						new_index++;
					}
				});
			});
			if (bg.opt.scroll_to_active){
				setTimeout(function(){
					ScrollTabList($(".active:visible")[0].id);
				},1000);
			}
		}); 
	}
}

// sort tabs sub function
function SplitUrl(tab){
	var tmp_url = new URL(tab.url);
	if (tmp_url.protocol != "http:"){
		tmp_url.protocol == "http:";
	}
	var url_parts = [];
	if (tab.pinned){
		url_parts.push("#"+tab.index);
	} else {
		url_parts.push("~");
	}
	var parts = tmp_url.host.split(".");
	parts.reverse();
	if (parts.length > 1){
		parts = parts.slice(1);
	}
	parts.join(".");
	url_parts.push(parts);
	url_parts.push(tab.title.toLowerCase());
	return url_parts.join(" ! ");
}

// find and select tabs
function FindTab(input){
	$(".filtered").removeClass("filtered");
	RefreshGUI();
	if (input.length == 0){
		$("#filter_box")[0].value = "";
		return;
	}
	chrome.tabs.query({windowId: vt.windowId}, function(tabs){
		var scroll = true;
		tabs.forEach(function(Tab){
			if ((bg.opt.filter_type == "url" ? Tab.url.toLowerCase().match(input.toLowerCase()) : Tab.title.toLowerCase().match(input.toLowerCase()) ) != null && Tab.pinned == false && $("#"+Tab.id).is(":visible")){
				if (scroll){
					ScrollTabList(Tab.id);
					scroll = false;
				}
				$("#"+Tab.id).removeClass("filtered");
			} else {
				$(".tab#"+Tab.id).addClass("filtered");
			}
		});
		RefreshGUI();
	});
}

// get color from icon if possible
function GetColorFromMiddlePixel(tabId, groupId){
	var color = GetRandomHexColor();
	if (bg.opt.grayscale_groups){
		return;
	}
	chrome.tabs.get(tabId, function(tab){
		var	img = new Image();
			img.src = "chrome://favicon/"+tab.url;
		img.onload = function(){
			var canvas = document.createElement("canvas");
			var context = canvas.getContext("2d");
			if (context){
				context.drawImage(img, 0, 0);
				var pixel = context.getImageData(4, 8, 1, 1);
				var data = pixel.data;
				var rgb = {r: data[0], g: data[1], b: data[2]};
				if (rgb.r != 0 && rgb.g != 0 && rgb.b != 0){
					color = rgbtoHex(rgb.r+","+rgb.g+","+rgb.b);
				}
			}
			$("#"+groupId).css({"background-color": "#"+color});
			bg.groups[$("#"+groupId).index()].c = color;
		}
		img.onerror = function(color, groupId){
			$("#"+groupId).css({"background-color": "#"+color});
			bg.groups[$("#"+groupId).index()].c = color;
		}
		SaveData();
	});
}

// color in format "rgb(r,g,b)" or simply "r,g,b" (can have spaces, but must contain "," between values)
function rgbtoHex(color){
	color = color.replace(/[rgb(]|\)|\s/g, "");
	color = color.split(",");
	return color.map(function(v){ return ("0"+Math.min(Math.max(parseInt(v), 0), 255).toString(16)).slice(-2); }).join("");
}

// generate random color
function GetRandomHexColor(){
	if (bg.opt.grayscale_groups){
		var rgb = Math.floor(Math.random() * 190);
		rgb = rgb+","+rgb+","+rgb;
		return rgbtoHex(rgb);
	} else {
		var letters = "0123456789ABCDEF".split(""), color = "";
		for (var i = 0; i < 6; i++ ){
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}
}

// generate random group id
function GetRandomID(){
    var letters = "0123456789ABCDEFGHIKLMNOPRSTUVWYZ".split(""), random = "";
    for (var i = 0; i < 8; i++ ){
        random += letters[Math.floor(Math.random() * 16)];
    }
	return random;
}

// bookmark main function
function BookmarkTabs(tabs_array, FolderName){
	var rootId;
	var vertical_tabs_folderId;
	chrome.bookmarks.getRootByName("bookmarks_bar", function(tree){
		rootId = tree.id;
		chrome.bookmarks.search("VerticalTabs", function(list){
			for (var elem in list) {
				if (list[elem].parentId == rootId){
					vertical_tabs_folderId = list[elem].id;
					break;
				}
			}
			if (vertical_tabs_folderId == undefined){
				chrome.bookmarks.create({parentId: rootId, title: "VerticalTabs"}, function(vertical_tabs_new){
					vertical_tabs_folderId = vertical_tabs_new.id;
				});
			}
			chrome.bookmarks.search(FolderName, function(list){
				for (var elem in list) {
					if (list[elem].parentId == vertical_tabs_folderId){
						SlowlyBookmarkTabs(tabs_array, list[elem].id);
						return;
					}
				}
				chrome.bookmarks.create({parentId: vertical_tabs_folderId, title: FolderName}, function(active_group_folderId_new){
					SlowlyBookmarkTabs(tabs_array, active_group_folderId_new.id);
				});
			});
		});
	});
}

// bookmark sub function
function SlowlyBookmarkTabs(tabs_array, group_folderId){
	if (tabs_array.length > 0){
		chrome.tabs.get(tabs_array[0], function(tab){
			chrome.bookmarks.search({url: tab.url}, function(list){
				tabs_array.splice(0, 1);
				setTimeout(function(){
					SlowlyBookmarkTabs(tabs_array, group_folderId);
				},10);
				for (var elem in list){
					if (list[elem].parentId == group_folderId){
						bookmarkId = list[elem].id;
						return;
					}
				}
				chrome.bookmarks.create({parentId: group_folderId, title: tab.title, url: tab.url});
			});
		});
	}
}
