import type { HotKeyConfig } from '@/hooks/use-hot-keys';

const HOTKEYS = {
  THEME_HOTKEY: { key: 'j', cmdOrCtrl: true },
} as const satisfies Record<string, HotKeyConfig>;

export const { THEME_HOTKEY } = HOTKEYS;
