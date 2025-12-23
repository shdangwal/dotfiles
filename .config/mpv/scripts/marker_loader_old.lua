local mp = require("mp")
local utils = require("mp.utils")

-- CHANGE THIS to your actual directory
local ORG_DIR = mp.command_native({ "expand-path", "/home/shdangwal/org/log_ts/" })

-- Natural sort helper (Episode 1, Episode 2, Episode 10 order)
local function natural_sort(a, b)
	local function pad(n)
		return ("%012d"):format(tonumber(n))
	end
	return a:lower():gsub("%d+", pad) < b:lower():gsub("%d+", pad)
end

-- Helper to convert HH:MM:SS to seconds
local function to_seconds(timestr)
	if not timestr or timestr == "" then
		return nil
	end
	local h, m, s = timestr:match("(%d+):(%d+):(%d+)")
	if h then
		return tonumber(h) * 3600 + tonumber(m) * 60 + tonumber(s)
	end
	return nil
end

local function load_current_video_markers()
	local full_path = mp.get_property("path")
	local filename_full = mp.get_property("filename")

	if not full_path or not filename_full then
		return
	end

	local dir, _ = utils.split_path(full_path)
	local parent_folder = dir:match("([^/\\]+)[/\\]*$") or ""

	local timestamp_file = ORG_DIR .. "/" .. parent_folder .. ".txt"
	local f = io.open(timestamp_file, "r")

	if f then
		local markers = {}
		for line in f:lines() do
			if line:find(filename_full, 1, true) then
				for ts in line:gmatch("{(%d+:%d+:%d+)}") do
					local seconds = to_seconds(ts)
					if seconds then
						table.insert(markers, {
							time = seconds,
							title = "Marker " .. ts,
						})
					end
				end
			end
		end
		f:close()

		-- CRITICAL STEP: Manual sorting by time
		-- This ensures that 20s always comes before 60s in the chapter list
		if #markers > 0 then
			table.sort(markers, function(a, b)
				return a.time < b.time
			end)

			-- Apply the sorted list to mpv
			mp.set_property_native("chapter-list", markers)
			mp.set_property_number("osd-level", 1)
			mp.osd_message("Loaded " .. #markers .. " sorted markers")
		end
	end
end

-- Automated loading and manual refresh binding
-- mp.register_event("file-loaded", load_current_video_markers)
-- mp.register_script_message("refresh-markers", load_current_video_markers)
