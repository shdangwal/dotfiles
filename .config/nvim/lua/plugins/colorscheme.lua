--return {
--  -- add gruvbox
--  { "catppuccin/nvim" },
--
--  -- Configure LazyVim to load gruvbox
--  {
--    "LazyVim/LazyVim",
--    opts = {
--      colorscheme = "catppuccin-macchiato",
--    },
--  },
--}
--
return {
  {
    "ViViDboarder/wombat.nvim",
    dependencies = { { "rktjmp/lush.nvim" } },
    opts = {
      ansi_colors_name = nil,
    },
  },
}
