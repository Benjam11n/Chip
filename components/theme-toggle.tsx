"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <Button
      className={cn(
        "relative h-9 w-9 border-2 transition-all duration-300 hover:scale-110",
        isDark
          ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "border-muted-foreground/20 bg-background hover:border-muted-foreground/40"
      )}
      onClick={() => {
        setTheme(isDark ? "light" : "dark");
      }}
      size="icon"
      variant="outline"
    >
      <Sun
        className={cn(
          "h-4 w-4 transition-all duration-300",
          isDark
            ? "-rotate-90 scale-0 opacity-0"
            : "rotate-0 scale-100 opacity-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          isDark
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
