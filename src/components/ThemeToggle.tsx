"use client";

import { useCallback, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const toggleTheme = useCallback(() => {
    const isDark = document.documentElement.classList.toggle("dark");
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light");
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target?.isContentEditable ||
        e.metaKey ||
        e.ctrlKey ||
        e.altKey
      ) {
        return;
      }
      if (e.key === "t" || e.key === "T") {
        toggleTheme();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleTheme]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Switch light or dark theme"
      title="Toggle theme (T)"
      className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--hover-bg)] hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--text)]"
    >
      <Sun className="theme-icon-sun h-[15px] w-[15px]" strokeWidth={1.8} />
      <Moon className="theme-icon-moon h-[15px] w-[15px]" strokeWidth={1.8} />
    </button>
  );
}
