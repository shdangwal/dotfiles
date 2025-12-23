local mp = require("mp")
local confirming = false

-- Function to handle the 'd' key (Initiate Prompt)
local function prompt_delete()
	confirming = true
	mp.osd_message("Delete current file? Press '<C-d>' to confirm, any other key to cancel.", 5)

	-- Auto-cancel after 5 seconds if no 'y' is pressed
	mp.add_timeout(5, function()
		if confirming then
			confirming = false
			mp.osd_message("Deletion cancelled.")
		end
	end)
end

-- Function to handle the 'y' key (Confirm and Delete)
local function confirm_deletion()
	if confirming then
		local path = mp.get_property("path")
		if not path or path:find("://") then
			mp.osd_message("Cannot delete URLs.")
			confirming = false
			return
		end

		-- Move to next file first so mpv releases the file lock
		mp.command("playlist-next")

		-- Delete the file based on the OS
		local success
		if package.config:sub(1, 1) == "\\" then
			-- Windows
			success = os.execute('del "' .. path .. '"')
		else
			-- Linux/macOS
			success = os.execute('rm "' .. path .. '"')
		end

		if success then
			mp.osd_message("File deleted successfully.")
		else
			mp.osd_message("Error: Could not delete file.")
		end
		confirming = false
	end
end

-- Function for any other key (Cancel)
local function cancel_deletion()
	if confirming then
		confirming = false
		mp.osd_message("Deletion cancelled.")
	end
end

mp.register_script_message("prompt_delete", prompt_delete)
mp.register_script_message("confirm_deletion", confirm_deletion)
