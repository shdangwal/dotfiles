-- Pull in the wezterm API
local wezterm = require("wezterm")

-- This will hold the configuration.
local config = wezterm.config_builder()

-- This is where you actually apply your config choices

--  custom config keys to check if works accross macOS and Widnows
config.keys = {
	{
		key = "-",
		mods = "CTRL|SHIFT",
		action = wezterm.action.DisableDefaultAssignment,
	},
	{
		key = "x",
		mods = "CTRL|SHIFT",
		action = wezterm.action.DisableDefaultAssignment,
	},
	{
		key = "m",
		mods = "CTRL|SHIFT",
		action = wezterm.action.DisableDefaultAssignment,
	},
	{
		key = "|",
		mods = "CTRL|SHIFT",
		action = wezterm.action.SplitHorizontal({ domain = "CurrentPaneDomain" }),
	},
	{
		key = "_",
		mods = "CTRL|SHIFT",
		action = wezterm.action.SplitVertical({ domain = "CurrentPaneDomain" }),
	},
	{
		key = "c",
		mods = "CTRL|SHIFT",
		action = wezterm.action.ActivateCopyMode,
	},
	{
		key = "x",
		mods = "CTRL|SHIFT",
		action = wezterm.action.CloseCurrentPane({ confirm = true }),
	},
	{
		key = "f",
		mods = "CTRL|SHIFT",
		action = wezterm.action.ToggleFullScreen,
	},
	{
		key = "h",
		mods = "CTRL|SHIFT",
		action = wezterm.action.ActivatePaneDirection("Left"),
	},
	{
		key = "l",
		mods = "CTRL|SHIFT",
		action = wezterm.action.ActivatePaneDirection("Right"),
	},
	{
		key = "k",
		mods = "CTRL|SHIFT",
		action = wezterm.action.ActivatePaneDirection("Up"),
	},
	{
		key = "j",
		mods = "CTRL|SHIFT",
		action = wezterm.action.ActivatePaneDirection("Down"),
	},
	{
		key = "a",
		mods = "CTRL|SHIFT",
		action = wezterm.action.ActivateKeyTable({
			name = "resize_pane",
			timeout_milliseconds = 1000,
			one_shot = false,
		}),
	},
}
config.key_tables = {
	-- Defines the keys that are active in our resize-pane mode.
	-- Since we're likely to want to make multiple adjustments,
	-- we made the activation one_shot=false. We therefore need
	-- to define a key assignment for getting out of this mode.
	-- 'resize_pane' here corresponds to the name="resize_pane" in
	-- the key assignments above.
	resize_pane = {
		{ key = "LeftArrow", action = wezterm.action.AdjustPaneSize({ "Left", 5 }) },
		{ key = "h", action = wezterm.action.AdjustPaneSize({ "Left", 5 }) },

		{ key = "RightArrow", action = wezterm.action.AdjustPaneSize({ "Right", 5 }) },
		{ key = "l", action = wezterm.action.AdjustPaneSize({ "Right", 5 }) },

		{ key = "UpArrow", action = wezterm.action.AdjustPaneSize({ "Up", 5 }) },
		{ key = "k", action = wezterm.action.AdjustPaneSize({ "Up", 5 }) },

		{ key = "DownArrow", action = wezterm.action.AdjustPaneSize({ "Down", 5 }) },
		{ key = "j", action = wezterm.action.AdjustPaneSize({ "Down", 5 }) },

		-- Cancel the mode by pressing escape
		{ key = "Escape", action = "PopKeyTable" },
	},
}

-- For example, changing the color scheme:
--config.color_scheme = "Catppuccin Macchiato"
--config.color_scheme = "Dracula (Official)"
config.color_scheme = "Gruvbox dark, medium (base16)"
--config.colors = {
--	foreground = "#CBE0F0",
--	background = "#011423",
--	cursor_bg = "#47FF9C",
--	cursor_border = "#47FF9C",
--	cursor_fg = "#011423",
--	selection_bg = "#706b4e",
--	selection_fg = "#f3d9c4",
--	ansi = { "#214969", "#E52E2E", "#44FFB1", "#FFE073", "#0FC5ED", "#a277ff", "#24EAF7", "#24EAF7" },
--	brights = { "#214969", "#E52E2E", "#44FFB1", "#FFE073", "#A277FF", "#a277ff", "#24EAF7", "#24EAF7" },
--}

config.font = wezterm.font("Fira Code") --wezterm.font("MesloLGS Nerd Font Mono")
config.font_size = 11

config.enable_tab_bar = false

config.window_decorations = "RESIZE"
config.window_background_opacity = 0.95
config.macos_window_background_blur = 9

config.window_padding = {
	left = 0,
	right = 0,
	top = 0,
	bottom = 0,
}

-- config.window_content_alignment = {
-- 	horizontal = "Center",
-- 	vertical = "Center",
-- }

-- and finally, return the configuration to wezterm
return config
