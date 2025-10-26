"use client";

import { Dices, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { THEME_HOTKEY } from "@/constants/hotkeys.const";
import { useHotKeys } from "@/hooks/use-hot-keys";
import { useHoverPopover } from "@/hooks/use-hover-popover";
import { ROUTES } from "@/lib/routes";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  const { setTheme, theme } = useTheme();
  const { isOpen, setIsOpen, handleMouseEnter, handleMouseLeave } =
    useHoverPopover();

  useHotKeys(
    THEME_HOTKEY,
    () => {
      setTheme(theme === "light" ? "dark" : "light");
    },
    `Switched to ${theme === "light" ? "dark" : "light"} mode`
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          href={ROUTES.HOME}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Dices className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="hidden font-bold sm:inline-block">
            Poker Chip Tracker
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* New Game Button */}
          <Button asChild size="sm" variant="outline">
            <Link className="flex items-center space-x-2" href={ROUTES.JOIN}>
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Join Game</span>
            </Link>
          </Button>

          {/* Theme Toggle with Hoverable Popover */}
          <Popover onOpenChange={setIsOpen} open={isOpen}>
            <PopoverTrigger asChild>
              <button
                className="inline-block"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                type="button"
              >
                <ThemeToggle />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-4" sideOffset={10}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">Theme</p>
                  <p className="text-muted-foreground text-xs capitalize">
                    {theme} mode
                  </p>
                </div>
                <p className="text-muted-foreground text-xs">
                  Toggle between light and dark themes
                </p>
                <div className="flex items-center justify-center space-x-2 rounded-md bg-muted p-2">
                  <span className="text-muted-foreground text-xs">Press</span>
                  <div className="flex space-x-1">
                    <Kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded bg-background px-1.5 font-medium font-mono text-[10px]">
                      <span>⌘</span>
                    </Kbd>
                    <Kbd className="pointer-events-none h-5 select-none items-center gap-1 rounded bg-background px-1.5 font-medium font-mono text-[10px]">
                      J
                    </Kbd>
                  </div>
                  <span className="text-muted-foreground text-xs">
                    to toggle
                  </span>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
