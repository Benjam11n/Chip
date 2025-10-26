"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { THEME_HOTKEY } from "@/constants/hotkeys.const";
import { useHotKeys } from "@/hooks/use-hot-keys";
import { Kbd } from "./ui/kbd";

export const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useHotKeys(THEME_HOTKEY, () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent hydration mismatch by not rendering until client-side
    return (
      <Button className="h-9 w-9" size="icon" variant="ghost">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  const isDarkMode = theme === "dark";

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
          className="relative h-9 w-9 rounded-md transition-all duration-300 hover:bg-accent/50"
          onClick={toggleTheme}
          size="icon"
          variant="ghost"
        >
          {/* Sun Icon */}
          <Sun
            className={`absolute h-4 w-4 transition-all duration-500 ${
              isDarkMode
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />

          {/* Moon Icon */}
          <Moon
            className={`absolute h-4 w-4 transition-all duration-500 ${
              isDarkMode
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <p>
          Toggle with <Kbd className="ml-1">Cmd</Kbd>+
          <Kbd>{THEME_HOTKEY.key}</Kbd>
        </p>
      </TooltipContent>
    </Tooltip>
  );
};
