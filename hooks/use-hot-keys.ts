import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'sonner';

export type HotKeyConfig = {
  key: string;
  shift?: boolean;
  alt?: boolean;
  cmdOrCtrl?: boolean;
};

/**
 * Hook that integrates with react-hotkeys-hook to register global hotkeys
 * @param config - Configuration object for hotkey setup
 * @param config.key - The key to bind (e.g., 'k', 'enter', 'escape')
 * @param config.shift - Whether shift modifier is required
 * @param config.alt - Whether alt modifier is required
 * @param config.cmdOrCtrl - Whether cmd (Mac) or ctrl (Windows/Linux) modifier is required
 * @param callback - Function to execute when hotkey is pressed
 * @returns void
 * @example
 * ```tsx
 * useHotKeys(
 *   { key: 'k', cmdOrCtrl: true },
 *   () => openSearchDialog()
 * );
 *
 * // With multiple modifiers
 * useHotKeys(
 *   { key: 'p', cmdOrCtrl: true, shift: true },
 *   () => openCommandPalette()
 * );
 * ```
 */
export function useHotKeys(config: HotKeyConfig, callback: () => void, toastMessage?: string) {
  const { key, shift, alt, cmdOrCtrl } = config;
  const modifiers: string[] = [];

  if (cmdOrCtrl === true) modifiers.push('mod');
  if (shift === true) modifiers.push('shift');
  if (alt === true) modifiers.push('alt');

  const hotkey =
    modifiers.length > 0 ? `${modifiers.join('+')}+${key.toLowerCase()}` : key.toLowerCase();

  useHotkeys(
    hotkey,
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      callback();
      if (toastMessage) {
        toast.success(toastMessage);
      }
    },
    { enableOnFormTags: ['input', 'textarea', 'select'] },
  );
}
