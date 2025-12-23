local utils = require("mp.utils")
local mp = require("mp")

-- Function to extract numbers from the complex string format "{ts1, ts2} - {final_ts}"
local function parse_timestamps(line)
	local ts_list = {}
	-- Matches any decimal number found in the line
	for ts in line:gmatch("%d+%.?%d*") do
		table.insert(ts_list, tonumber(ts))
	end
	return ts_list
end

local function convert_seconds_HHMMSS(total_seconds)
	local hours = math.floor(total_seconds / 3600)
	local minutes = math.floor((total_seconds % 3600) / 60)
	local seconds = math.floor(total_seconds % 60)

	return string.format("%02d:%02d:%02d", hours, minutes, seconds)
end

-- Primary function for 'y' press
local function save_ts(special)
	if not special then
		special = ""
	end

	local raw_time = mp.get_property_number("playback-time", 0)
	local delta = 3
	if special == "*" then
		delta = 6
	end

	local target_time = math.max(0, raw_time - delta)

	local full_path = mp.get_property("path")
	print(full_path)
	local dir, _ = utils.split_path(full_path)
	local parent_folder = dir:match("([^/\\]+)[/\\]*$") or "Unknown"

	-- Target: ~/org/log_ts/ParentFolder.txt
	local target_dir = mp.command_native({ "expand-path", "/home/shdangwal/md/log_ts/" })
	local log_filename = parent_folder .. ".txt"
	local log_path = target_dir .. "/" .. log_filename

	local filename_with_ext = mp.get_property("filename")
	local line_prefix = "- " .. filename_with_ext .. ":"

	local lines = {}
	local line_found_index = nil
	local is_too_close = false

	-- 1. Read existing file and check proximity
	local f_read = io.open(log_path, "r")
	if f_read then
		for line in f_read:lines() do
			table.insert(lines, line)
			if line:find(line_prefix, 1, true) == 1 then
				line_found_index = #lines
				-- Parse existing timestamps to check if any are within 10s
				local existing_ts = parse_timestamps(line)
				for _, ts in ipairs(existing_ts) do
					if math.abs(ts - target_time) < 10 then
						is_too_close = true
						break
					end
				end
			end
		end
		f_read:close()
	end

	-- 2. Logic for ignoring or appending
	if is_too_close then
		mp.osd_message("Timestamp ignored: Entry exists within 10s", 2)
		return
	end

	-- local formatted_new_ts = string.format("%.2f", target_time)
	local formatted_new_ts = convert_seconds_HHMMSS(target_time)

	if line_found_index then
		-- Update existing line: append to the end of the existing segments
		-- Your format: {ts1}; {ts2}
		-- We will simply append the new one as a standalone segment for simplicity
		lines[line_found_index] = lines[line_found_index] .. "; {" .. formatted_new_ts .. "}" .. special
	else
		-- Add new line if file/prefix didn't exist
		table.insert(lines, line_prefix .. " {" .. formatted_new_ts .. "}" .. special)
	end

	-- 3. Write back to file
	local f_write = io.open(log_path, "w")
	if f_write then
		f_write:write(table.concat(lines, "\n") .. "\n")
		f_write:close()
		mp.osd_message("Saved: " .. formatted_new_ts)
	else
		mp.osd_message("Error: Cannot write to log path")
	end
end

local function save_normal_ts()
	save_ts()
end

local function save_special_ts()
	save_ts("*")
end

mp.register_script_message("save_normal_ts", save_normal_ts)
mp.register_script_message("save_special_ts", save_special_ts)
