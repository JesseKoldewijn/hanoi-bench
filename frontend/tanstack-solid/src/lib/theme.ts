export type Theme = "light" | "dark";
const STORAGE_KEY = "hanoi-theme";
export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const s = localStorage.getItem(STORAGE_KEY);
  if (s === "dark" || s === "light") return s;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
export function setStoredTheme(theme: Theme): void {
  if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, theme);
}
export function applyTheme(theme: Theme): void {
  if (typeof document !== "undefined")
    document.documentElement.classList.toggle("dark", theme === "dark");
}
