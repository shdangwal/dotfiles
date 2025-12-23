local mp = require("mp")
local utils = require("mp.utils")

-- CHANGE THIS to your actual directory
local ORG_DIR = mp.command_native({ "expand-path", "/home/shdangwal/md/log_ts/" })

-- Natural sort helper (Episode 1, Episode 2, Episode 10 order)
local function natural_sort(a, b)
	local function pad(n)
		return ("%012d"):format(tonumber(n))
	end
	return a:lower():gsub("%d+", pad) < b:lower():gsub("%d+", pad)
end

-- Function to extract numbers from HH:MM:SS to Seconds
local function parse_HHMMSS_seconds(str)
	local hours_str, minutes_str, seconds_str = string.match(str, "(%d+):(%d+):(%d+)")

	-- Convert the captured strings to numbers
	local hours = tonumber(hours_str)
	local minutes = tonumber(minutes_str)
	local seconds = tonumber(seconds_str)

	-- Check if conversion was successful and values are valid
	if hours and minutes and seconds then
		-- Calculate the total seconds
		local total_seconds = (hours * 3600) + (minutes * 60) + seconds
		return total_seconds
	else
		-- Return nil or an error message for invalid input format
		return nil, "Invalid time format, expected HH:MM:SS"
	end
end

local function load_current_video_markers()
	local filename_full = mp.get_property("filename")
	local full_path = mp.get_property("path")

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
			-- Match the specific filename in the log line
			if line:find(filename_full, 1, true) then
				-- NEW PATTERN: Matches numbers (including decimals) inside curly braces {}
				for ts in line:gmatch("{%d+:%d+:%d+}") do
					local seconds = parse_HHMMSS_seconds(ts)
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
mp.register_event("file-loaded", load_current_video_markers)
mp.register_script_message("refresh-markers", load_current_video_markers)
