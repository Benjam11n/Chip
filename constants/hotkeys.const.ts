import type { HotKeyConfig } from "@/hooks/use-hot-keys";

const HOTKEYS = {
  THEME_HOTKEY: { key: "j", cmdOrCtrl: true },
  CREATE_GAME_HOTKEY: { key: "c", cmdOrCtrl: true },
  JOIN_GAME_HOTKEY: { key: "j", cmdOrCtrl: true, shift: true },
} as const satisfies Record<string, HotKeyConfig>;

export const { THEME_HOTKEY, CREATE_GAME_HOTKEY, JOIN_GAME_HOTKEY } = HOTKEYS;
