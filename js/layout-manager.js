/**
 * THEME MANAGER (TERANG / GELAP)
 * - Tema awal sudah diset oleh skrip inline di <head> (tanpa kedip).
 * - Prioritas: pilihan pengguna (LocalStorage) > preferensi sistem (prefers-color-scheme).
 * - Semua tombol dengan class .js-theme-toggle akan ikut tersinkron.
 */
const THEME_STORAGE_KEY = "sentral_robotika_theme_v1";

class ThemeManager {
  constructor() {
    this.root = document.documentElement;
    this.metaThemeColor = document.querySelector('meta[name="theme-color"]');
    this.media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;

    this.apply(this.root.getAttribute("data-theme") || this.getSystemTheme());

    document.querySelectorAll(".js-theme-toggle").forEach((btn) => {
      btn.addEventListener("click", () => this.toggle());
    });

    // Ikuti perubahan tema sistem selama pengguna belum memilih manual
    if (this.media) {
      const onSystemChange = () => {
        if (!this.getStored()) this.apply(this.getSystemTheme());
      };
      if (this.media.addEventListener) this.media.addEventListener("change", onSystemChange);
      else if (this.media.addListener) this.media.addListener(onSystemChange);
    }
  }

  getStored() {
    try {
      const v = localStorage.getItem(THEME_STORAGE_KEY);
      return v === "light" || v === "dark" ? v : null;
    } catch (e) {
      return null;
    }
  }

  getSystemTheme() {
    return this.media && this.media.matches ? "light" : "dark";
  }

  current() {
    return this.root.getAttribute("data-theme") === "light" ? "light" : "dark";
  }

  apply(theme) {
    this.root.setAttribute("data-theme", theme);
    if (this.metaThemeColor) {
      this.metaThemeColor.setAttribute("content", theme === "light" ? "#FFFFFF" : "#0B0B0E");
    }
    const isLight = theme === "light";
    document.querySelectorAll(".js-theme-toggle").forEach((btn) => {
      const icon = btn.querySelector(".theme-icon");
      if (icon) icon.textContent = isLight ? "🌙" : "☀️";
      const label = isLight ? "Ganti ke mode gelap" : "Ganti ke mode terang";
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  toggle() {
    const next = this.current() === "light" ? "dark" : "light";
    try { localStorage.setItem(THEME_STORAGE_KEY, next); } catch (e) {}
    this.apply(next);
    if (window.showToast) {
      window.showToast(next === "light" ? "Mode terang aktif" : "Mode gelap aktif", "info");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.themeManager = new ThemeManager();
});
