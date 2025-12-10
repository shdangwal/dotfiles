;;; $DOOMDIR/config.el -*- lexical-binding: t; -*-

;; Place your private configuration here! Remember, you do not need to run 'doom
;; sync' after modifying this file!


;; Some functionality uses this to identify you, e.g. GPG configuration, email
;; clients, file templates and snippets. It is optional.
;; (setq user-full-name "John Doe"
;;       user-mail-address "john@doe.com")

;; Doom exposes five (optional) variables for controlling fonts in Doom:
;;
;; - `doom-font' -- the primary font to use
;; - `doom-variable-pitch-font' -- a non-monospace font (where applicable)
;; - `doom-big-font' -- used for `doom-big-font-mode'; use this for
;;   presentations or streaming.
;; - `doom-symbol-font' -- for symbols
;; - `doom-serif-font' -- for the `fixed-pitch-serif' face
;;
;; See 'C-h v doom-font' for documentation and more examples of what they
;; accept. For example:
;;
(setq doom-font (font-spec :family "Fira Code" :size 14 :weight 'semi-light)
      doom-variable-pitch-font (font-spec :family "Fira Code" :size 15)
      doom-symbol-font (font-spec :family "Symbols Nerd Font Mono" :size 14 :weight 'semi-light))

;;(set-fontset-font t 'unicode (font-spec :family "Fira Code") nil 'prepend)

(add-hook 'vterm-mode-hook
          (lambda ()
            (face-remap-add-relative 'default :family "Fira Code")))

;; (prefer-coding-system 'utf-8)
;; (set-default-coding-systems 'utf-8)
(set-terminal-coding-system 'utf-8)
;; (set-keyboard-coding-system 'utf-8)
;; (setq buffer-file-coding-system 'utf-8)


(global-visual-line-mode t)
(evil-global-set-key 'motion "j" 'evil-next-visual-line)
(evil-global-set-key 'motion "k" 'evil-previous-visual-line)

;; If you or Emacs can't find your font, use 'M-x describe-font' to look them
;; up, `M-x eval-region' to execute elisp code, and 'M-x doom/reload-font' to
;; refresh your font settings. If Emacs still can't find your font, it likely
;; wasn't installed correctly. Font issues are rarely Doom issues!

;; There are two ways to load a theme. Both assume the theme is installed and
;; available. You can either set `doom-theme' or manually load a theme with the
;; `load-theme' function. This is the default:

;; This determines the style of line numbers in effect. If set to `nil', line
;; numbers are disabled. For relative line numbers, set this to `relative'.
(setq display-line-numbers-type 'visual)

;; If you use `org' and don't want your org files in the default location below,
;; change `org-directory'. It must be set before org loads!
(setq org-directory "~/org/")
(setq org-roam-directory "~/org/")

(setq company-idle-delay 0.2
      company-minimum-prefix-length 2)

;; Whenever you reconfigure a package, make sure to wrap your config in an
;; `after!' block, otherwise Doom's defaults may override your settings. E.g.
;;
;;   (after! PACKAGE
;;     (setq x y))
;;
;; The exceptions to this rule:
;;
;;   - Setting file/directory variables (like `org-directory')
;;   - Setting variables which explicitly tell you to set them before their
;;     package is loaded (see 'C-h v VARIABLE' to look up their documentation).
;;   - Setting doom variables (which start with 'doom-' or '+').
;;
;; Here are some additional functions/macros that will help you configure Doom.
;;
;; - `load!' for loading external *.el files relative to this one
;; - `use-package!' for configuring packages
;; - `after!' for running code after a package has loaded
;; - `add-load-path!' for adding directories to the `load-path', relative to
;;   this file. Emacs searches the `load-path' when you load packages with
;;   `require' or `use-package'.
;; - `map!' for binding new keys
;;
;; To get information about any of these functions/macros, move the cursor over
;; the highlighted symbol at press 'K' (non-evil users must press 'C-c c k').
;; This will open documentation for it, including demos of how they are used.
;; Alternatively, use `C-h o' to look up a symbol (functions, variables, faces,
;; etc).
;;
;; You can also try 'gd' (or 'C-c c d') to jump to their definition and see how
;; they are implemented.
;;

(use-package! copilot
  :hook (prog-mode . copilot-mode)
  :bind (:map copilot-completion-map
              ("C-e" . 'copilot-accept-completion)
              ("C-w" . 'copilot-clear-overlay)
              ("TAB" . 'copilot-accept-completion-by-word)
              ("C-j" . 'copilot-next-completion)
              ("C-k" . 'copilot-previous-completion))
  :config
  (add-to-list 'copilot-indentation-alist '(prog-mode 2))
  (add-to-list 'copilot-indentation-alist '(org-mode 2))
  (add-to-list 'copilot-indentation-alist '(text-mode 2))
  (add-to-list 'copilot-indentation-alist '(closure-mode 2))
  (add-to-list 'copilot-indentation-alist '(emacs-lisp-mode 2)))


(add-to-list 'load-path "~/.config/doom/themes/emacs-theme-gruvbox/")
(add-to-list 'load-path "~/.config/doom/packages/autothemer/")
(add-to-list 'custom-theme-load-path "~/.config/doom/themes/emacs-theme-gruvbox/")
(load-theme 'gruvbox-dark-medium t)

(after! treemacs
  (require 'dired)
  (setq treemacs-position 'right))

(use-package! org-auto-tangle
  :defer t
  :hook (org-mode . org-auto-tangle-mode)
  :config
  (setq org-auto-tangle-default t))


;; Org mode configuration
(after! org
  (setq org-directory "~/org/"
        org-default-notes-file (expand-file-name "notes.org" org-directory)
        ;;org-ellipsis " ▼ "
        org-superstar-headline-bullets-list '("◉" "●" "○" "◆" "●" "○" "◆")
        org-superstar-itembullet-alist '((?+ . ?➤) (?- . ?✦)) ; changes +/- symbols in item lists
        org-log-done 'time
        org-hide-emphasis-markers t
        ;; ex. of org-link-abbrev-alist in action
        ;; [[arch-wiki:Name_of_Page][Description]]
        org-link-abbrev-alist    ; This overwrites the default Doom org-link-abbrev-list
        '(("google" . "http://www.google.com/search?q=")
          ("arch-wiki" . "https://wiki.archlinux.org/index.php/")
          ("ddg" . "https://duckduckgo.com/?q=")
          ("wiki" . "https://en.wikipedia.org/wiki/"))
        org-table-convert-region-max-lines 20000
        org-todo-keywords        ; This overwrites the default Doom org-todo-keywords
        '((sequence
           "TODO(t)"           ; A task that is ready to be tackled
           "BLOG(b)"           ; Blog writing assignments
           "GYM(g)"            ; Things to accomplish at the gym
           "PROJ(p)"           ; A project that contains other tasks
           "VIDEO(v)"          ; Video assignments
           "WAIT(w)"           ; Something is holding up this task
           "|"                 ; The pipe necessary to separate "active" states and "inactive" states
           "DONE(d)"           ; Task has been completed
           "CANCELLED(c)" ))) ; Task has been cancelled

  (defun dt/org-colors-gruvbox-dark ()
    "Enable Gruvbox Dark colors for Org headers."
    (interactive)
    (dolist
        (face
         '((org-level-1 1.1 "#98971a" semi-bold)
           (org-level-2 1.05 "#d79921" semi-bold)
           (org-level-3 1.05 "#b16286" semi-bold)
           (org-level-4 1.0 "#cc241d" semi-bold)
           (org-level-5 1.0 "#458588" normal)
           (org-level-6 1.0 "#8ec07c" normal)
           (org-level-7 1.0 "#a89984" normal)
           (org-level-8 1.0 "#282828" normal)))
      (set-face-attribute (nth 0 face) nil :font doom-variable-pitch-font :weight (nth 3 face) :height (nth 1 face) :foreground (nth 2 face)))
    (set-face-attribute 'org-table nil :font doom-font :weight 'normal :height 1.0 :foreground "#bfafdf")
    (setq org-superstar-headline-bullets-list '("◉" "●" "○" "◆" "●" "○" "◆")))
  ;; Load color theme
  (dt/org-colors-gruvbox-dark))

(setq org-modern-fold-stars '(("●" . "●")
                              ("◉" . "◉")
                              ("○" . "○")
                              ("◆" . "◆")))

(setq auto-save-default t)
(setq auto-save-timeout 15)
(global-display-line-numbers-mode t)
(add-to-list 'default-frame-alist '(alpha-background . 95)) ; Set transparency for new frames

(evil-define-key 'normal peep-dired-mode-map
  (kbd "j") 'peep-dired-next-file
  (kbd "k") 'peep-dired-prev-file)
(add-hook 'peep-dired-hook 'evil-normalize-keymaps)
(map! :leader
      (:after dired
              (:map dired-mode-map
               :desc "peep-mode" "d p" #'peep-dired)))

;; (defun sd_int/mpv-running-p ()
;;   "Check if mpv is running."
;;   (cl-loop for proc in (list-processes)
;;            when (string-match-p "mpv-player" (process-name proc))
;;            return t))

;; (defun sd_int/mpv-play (file)
;;   "Play file using mpv if mpv."
;;   (interactive "fPlay mp4 file: ")
;;   (if (sd_int/mpv-running-p)
;;       (progn
;;         (message "Adding %s to existing MPV playlist." file)
;;         (mpv-playlist-append file))
;;     (progn
;;       (message "Opening new MPV window for %s." file)
;;       (mpv-play file))))

;; (defun sd/open-video()
;;   "Open file at point in Dired using xdg-open asynchronously."
;;   (interactive)
;;   (let ((file (dired-get-file-for-visit)))
;;     (if file
;;         (sd_int/mpv-play file)
;;       ;;(start-process "xdg-open" nil "xdg-open" file)
;;       (message "No file at point to open."))))
