/*
 * Tadil login theme — dark mode toggle.
 * Adds/removes `.tadil-dark` on <html> and persists the choice in
 * localStorage. The CSS variables in css/tadil.css do the actual theming.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "tadil-theme";
  var root = document.documentElement;

  function isDark() {
    return root.classList.contains("tadil-dark");
  }

  function apply(theme) {
    if (theme === "dark") {
      root.classList.add("tadil-dark");
    } else {
      root.classList.remove("tadil-dark");
    }
  }

  function read() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function save(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {
      /* ignore (private mode etc.) */
    }
  }

  var MOON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  var SUN =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.9" y1="4.9" x2="7" y2="7"/><line x1="17" y1="17" x2="19.1" y2="19.1"/><line x1="4.9" y1="19.1" x2="7" y2="17"/><line x1="17" y1="7" x2="19.1" y2="4.9"/></svg>';

  // Apply the initial theme as early as possible to avoid a flash.
  var stored = read();
  var prefersDark =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  apply(stored || (prefersDark ? "dark" : "light"));

  function buildToggle() {
    if (document.getElementById("tadil-theme-toggle")) return;

    var btn = document.createElement("button");
    btn.type = "button";
    btn.id = "tadil-theme-toggle";
    btn.setAttribute("aria-label", "Toggle dark mode");
    btn.setAttribute("title", "Toggle dark mode");
    btn.innerHTML = isDark() ? SUN : MOON;

    btn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      apply(next);
      save(next);
      btn.innerHTML = isDark() ? SUN : MOON;
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildToggle);
  } else {
    buildToggle();
  }
})();
