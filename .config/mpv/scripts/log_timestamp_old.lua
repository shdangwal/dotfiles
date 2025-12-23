local utils = require("mp.utils")
local mp = require("mp")
local timestamp_buffer = {}

-- Function to clear the buffer (used on video change and after saving)
local function clear_buffer()
	timestamp_buffer = {}
end

-- Automatically clear the buffer whenever a new file starts
mp.register_event("start-file", function()
	clear_buffer()
	-- Optional: mp.msg.info("Timestamp buffer cleared for new video.")
end)

-- Function for 'y' (Collect timestamps)
local function collect_timestamp()
	local time = mp.get_property_osd("playback-time")
	table.insert(timestamp_buffer, time)
	mp.osd_message("Added: " .. time .. " (Total: " .. #timestamp_buffer .. ")")
end

-- Function for 'Y' (Save/Update line in ~/org/ParentFolder_EpisodeName.txt)
local function save_to_file()
	if #timestamp_buffer == 0 then
		mp.osd_message("Buffer empty! Press 'y' first.")
		return
	end

	local full_path = mp.get_property("path")
	local episode_name = mp.get_property("filename/no-ext")
	local dir, _ = utils.split_path(full_path)
	local parent_folder = dir:match("([^/\\]+)[/\\]*$") or "Unknown"

	-- Target: ~/org/ParentFolder_EpisodeName.txt
	local target_dir = mp.command_native({ "expand-path", "/home/shdangwal/org/log_ts/" })
	local log_filename = parent_folder .. ".txt"
	local log_path = target_dir .. "/" .. log_filename

	-- Relative path for the prefix (e.g., videos/abc.mp4)
	local _, filename_with_ext = utils.split_path(full_path)
	local line_prefix = "- " .. parent_folder .. "/" .. filename_with_ext .. ":"

	-- Formatting new segment: {ts1, ts2} - {final_ts}
	local final_ts = timestamp_buffer[#timestamp_buffer]
	local internal_ts = table.concat(timestamp_buffer, ", ", 1, #timestamp_buffer - 1)
	local new_segment = "{" .. internal_ts .. "} - {" .. final_ts .. "}"

	-- Read existing file content
	local lines = {}
	local file_exists = false
	local f_read = io.open(log_path, "r")
	if f_read then
		for line in f_read:lines() do
			if line:find(line_prefix, 1, true) == 1 then
				-- Line exists: append new segment with a semicolon
				line = line .. "; " .. new_segment
				file_exists = true
			end
			table.insert(lines, line)
		end
		f_read:close()
	end

	-- If the prefix wasn't found in an existing file, add a new line
	if not file_exists then
		table.insert(lines, line_prefix .. " " .. new_segment)
	end

	-- Write everything back
	local f_write = io.open(log_path, "w")
	if f_write then
		f_write:write(table.concat(lines, "\n") .. "\n")
		f_write:close()
		mp.osd_message("Updated: " .. log_filename)
		timestamp_buffer = {} -- Reset buffer
	else
		mp.osd_message("Error: Cannot write to ~/org/")
	end
end

-- mp.register_script_message("collect_ts", collect_timestamp)
-- mp.register_script_message("save_ts", save_to_file)
