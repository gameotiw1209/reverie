export const theme = "reverie-dark-mode";

export function getSavedTheme(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(theme) === "true";
}

export function setSavedTheme(darkMode: boolean): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(theme, darkMode.toString());
}