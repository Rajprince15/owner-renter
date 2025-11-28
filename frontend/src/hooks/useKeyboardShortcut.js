import { useEffect, useCallback } from 'react';

/**
 * Hook for keyboard shortcuts
 * @param {string|string[]} keys - Key combination (e.g., 'ctrl+k', ['ctrl+k', 'cmd+k'])
 * @param {Function} callback - Function to call when shortcut is pressed
 * @param {Object} options - Options for the shortcut
 */
function useKeyboardShortcut(keys, callback, options = {}) {
  const {
    enabled = true,
    preventDefault = true,
    ignoreInputFields = true,
  } = options;

  const handleKeyDown = useCallback((event) => {
    // Don't trigger if disabled
    if (!enabled) return;

    // Don't trigger if user is typing in an input field (unless specified)
    if (ignoreInputFields) {
      const target = event.target;
      const tagName = target.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'textarea' || target.isContentEditable) {
        return;
      }
    }

    // Normalize keys to array
    const keyArray = Array.isArray(keys) ? keys : [keys];

    // Check if any key combination matches
    const matches = keyArray.some(keyCombo => {
      const parts = keyCombo.toLowerCase().split('+');
      const key = parts[parts.length - 1];
      const modifiers = parts.slice(0, -1);

      // Check if key matches
      const keyMatches = event.key.toLowerCase() === key || event.code.toLowerCase() === key.replace(' ', '');

      // Check if modifiers match
      const ctrlMatch = modifiers.includes('ctrl') ? event.ctrlKey : !event.ctrlKey;
      const shiftMatch = modifiers.includes('shift') ? event.shiftKey : !event.shiftKey;
      const altMatch = modifiers.includes('alt') ? event.altKey : !event.altKey;
      const metaMatch = modifiers.includes('meta') || modifiers.includes('cmd') ? event.metaKey : !event.metaKey;

      // Special case: if no modifiers specified, ensure none are pressed
      if (modifiers.length === 0) {
        return keyMatches && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey;
      }

      return keyMatches && ctrlMatch && shiftMatch && altMatch && metaMatch;
    });

    if (matches) {
      if (preventDefault) {
        event.preventDefault();
      }
      callback(event);
    }
  }, [keys, callback, enabled, preventDefault, ignoreInputFields]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
}

export default useKeyboardShortcut;

/**
 * Example usage:
 * 
 * useKeyboardShortcut('ctrl+k', () => {
 *   console.log('Search shortcut pressed');
 * });
 * 
 * useKeyboardShortcut(['ctrl+/', 'cmd+/'], () => {
 *   console.log('Help shortcut pressed');
 * });
 * 
 * useKeyboardShortcut('escape', () => {
 *   closeModal();
 * }, { enabled: isModalOpen });
 */
