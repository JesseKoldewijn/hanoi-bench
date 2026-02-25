import { createSignal, onMount } from "solid-js";
import type { Theme } from "~/lib/theme";
import {
  applyTheme,
  getStoredTheme,
  setStoredTheme,
} from "~/lib/theme";
import { cn } from "~/lib/utils";

export function ThemeToggle() {
  const [theme, setThemeState] = createSignal<Theme>("light");

  onMount(() => {
    const stored = getStoredTheme();
    setThemeState(stored);
    applyTheme(stored);
  });

  const toggleTheme = () => {
    const next = theme() === "dark" ? "light" : "dark";
    setThemeState(next);
    setStoredTheme(next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      class={cn(
        "inline-flex size-9 items-center justify-center rounded-md",
        "hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]"
      )}
      onClick={toggleTheme}
      aria-label={theme() === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme() === "dark" ? (
        <span aria-hidden="true">Sun</span>
      ) : (
        <span aria-hidden="true">Moon</span>
      )}
    </button>
  );
}
