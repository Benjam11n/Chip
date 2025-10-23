"use client";

import { useTheme } from "next-themes";
import { THEME_HOTKEY } from "@/constants/hotkeys.const";
import { useHotKeys } from "@/hooks/use-hot-keys";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  const { setTheme, theme } = useTheme();

  useHotKeys(
    THEME_HOTKEY,
    () => {
      setTheme(theme === "light" ? "dark" : "light");
    },
    `Switched to ${theme === "light" ? "dark" : "light"} mode`
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-end">
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
