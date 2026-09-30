(function () {
  const STORAGE_KEY = "tadil-legal-lang";

  function preferredLang() {
    const urlLang = new URLSearchParams(location.search).get("lang");
    if (urlLang === "ar" || urlLang === "en") return urlLang;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "ar" || stored === "en") return stored;
    } catch (_) {
      /* ignore */
    }
    return (navigator.language || "").toLowerCase().startsWith("ar") ? "ar" : "en";
  }

  function applyConfig() {
    const cfg = window.TADIL_LEGAL || {};
    document.querySelectorAll("[data-config]").forEach((el) => {
      const key = el.getAttribute("data-config");
      if (key && cfg[key]) el.textContent = cfg[key];
      if (key === "email" && cfg.email && el.tagName === "A") {
        const href = el.getAttribute("href") || "";
        if (href.startsWith("mailto:")) {
          const query = href.indexOf("?");
          el.setAttribute(
            "href",
            "mailto:" + cfg.email + (query >= 0 ? href.slice(query) : "")
          );
        } else {
          el.setAttribute("href", "mailto:" + cfg.email);
        }
      }
    });
    document.querySelectorAll("[data-config-phone]").forEach((el) => {
      el.hidden = !cfg.phone;
      if (cfg.phone) {
        el.querySelectorAll("[data-config='phone']").forEach((node) => {
          node.textContent = cfg.phone;
          if (node.tagName === "A") node.setAttribute("href", "tel:" + cfg.phone);
        });
      }
    });
  }

  function setLang(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_) {
      /* ignore */
    }
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-lang-btn") === lang));
    });
    const url = new URL(location.href);
    url.searchParams.set("lang", lang);
    history.replaceState(null, "", url);
  }

  document.addEventListener("DOMContentLoaded", function () {
    applyConfig();
    setLang(preferredLang());
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", function () {
        setLang(btn.getAttribute("data-lang-btn"));
      });
    });
  });
})();
