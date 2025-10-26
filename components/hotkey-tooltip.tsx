"use client";

import type { HotKeyConfig } from "@/hooks/use-hot-keys";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface HotkeyTooltipProps {
  children: React.ReactNode;
  hotkey: HotKeyConfig;
  description: string;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export const HotkeyTooltip = ({
  children,
  hotkey,
  description,
  side = "bottom",
  className,
}: HotkeyTooltipProps) => {
  const renderHotkey = () => {
    const keys: React.ReactNode[] = [];

    if (hotkey.cmdOrCtrl) {
      keys.push(<Kbd key="mod">{isMac() ? "⌘" : "Ctrl"}</Kbd>);
    }

    if (hotkey.shift) {
      keys.push(<Kbd key="shift">Shift</Kbd>);
    }

    if (hotkey.alt) {
      keys.push(<Kbd key="alt">Alt</Kbd>);
    }

    keys.push(<Kbd key="main">{hotkey.key.toUpperCase()}</Kbd>);

    return <KbdGroup>{keys}</KbdGroup>;
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} className={className}>
        <p className="flex items-center gap-2">
          <span>{description}</span>
          <span className="opacity-70">with</span>
          {renderHotkey()}
        </p>
      </TooltipContent>
    </Tooltip>
  );
};

// Helper function to detect platform
function isMac(): boolean {
  if (typeof window === "undefined") return false;
  return navigator.platform.toUpperCase().indexOf("MAC") >= 0;
}