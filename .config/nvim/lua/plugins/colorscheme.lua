return {
  -- add gruvbox
  { "ellisonleao/gruvbox.nvim" },

  -- Configure LazyVim to load gruvbox
  {
    "LazyVim/LazyVim",
    opts = {
      colorscheme = "gruvbox",
      transparent = vim.g.transparent_enabled,
      styles = {
        sidebars = "transparent",
        floats = "transparent",
      },
    },
  },
}
