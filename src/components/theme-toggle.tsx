"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      window.localStorage.setItem("engi-mart:theme", next);
    } catch {
      // Storage can be unavailable in private or restricted contexts.
    }
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      title="Switch light or dark theme"
    >
      <Sun className="theme-icon theme-icon-sun" size={15} aria-hidden="true" />
      <Moon className="theme-icon theme-icon-moon" size={15} aria-hidden="true" />
    </button>
  );
}
