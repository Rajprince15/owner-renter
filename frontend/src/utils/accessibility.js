// Accessibility utilities

/**
 * Trap focus within a container
 * @param {HTMLElement} container - Container element
 * @returns {Function} Cleanup function
 */
export const trapFocus = (container) => {
  if (!container) return () => {};

  const focusableElements = container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  };

  container.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstElement?.focus();

  return () => {
    container.removeEventListener('keydown', handleTabKey);
  };
};

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container - Container element
 * @returns {NodeList}
 */
export const getFocusableElements = (container) => {
  return container.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
};

/**
 * Lock body scroll (for modals)
 */
export const lockScroll = () => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
};

/**
 * Unlock body scroll
 */
export const unlockScroll = () => {
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

/**
 * Announce to screen readers
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

/**
 * Check if element is visible
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
export const isElementVisible = (element) => {
  if (!element) return false;
  return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
};

/**
 * Get contrast ratio between two colors
 * @param {string} color1 - First color (hex)
 * @param {string} color2 - Second color (hex)
 * @returns {number}
 */
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;

    const rsRGB = r / 255;
    const gsRGB = g / 255;
    const bsRGB = b / 255;

    const rLum = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const gLum = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const bLum = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * rLum + 0.7152 * gLum + 0.0722 * bLum;
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Check if color contrast meets WCAG AA standards
 * @param {string} foreground - Foreground color (hex)
 * @param {string} background - Background color (hex)
 * @param {boolean} isLargeText - Whether text is large (18pt+ or 14pt+ bold)
 * @returns {boolean}
 */
export const meetsWCAGContrast = (foreground, background, isLargeText = false) => {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Create skip link for keyboard navigation
 * @param {string} targetId - ID of element to skip to
 * @returns {HTMLElement}
 */
export const createSkipLink = (targetId) => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded';
  skipLink.textContent = 'Skip to main content';

  skipLink.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.focus();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });

  return skipLink;
};

/**
 * Handle keyboard shortcuts
 * @param {Object} shortcuts - Map of key combinations to handlers
 * @returns {Function} Cleanup function
 */
export const handleKeyboardShortcuts = (shortcuts) => {
  const handleKeyDown = (e) => {
    const key = e.key.toLowerCase();
    const combo = [
      e.ctrlKey && 'ctrl',
      e.shiftKey && 'shift',
      e.altKey && 'alt',
      e.metaKey && 'meta',
      key
    ].filter(Boolean).join('+');

    if (shortcuts[combo]) {
      e.preventDefault();
      shortcuts[combo](e);
    }
  };

  document.addEventListener('keydown', handleKeyDown);

  return () => {
    document.removeEventListener('keydown', handleKeyDown);
  };
};

/**
 * Add ARIA labels to elements dynamically
 * @param {HTMLElement} element - Element to add label to
 * @param {string} label - Label text
 * @param {string} type - 'label' or 'describedby'
 */
export const addAriaLabel = (element, label, type = 'label') => {
  if (!element) return;

  if (type === 'label') {
    element.setAttribute('aria-label', label);
  } else if (type === 'describedby') {
    const id = `desc-${Math.random().toString(36).substr(2, 9)}`;
    const description = document.createElement('span');
    description.id = id;
    description.className = 'sr-only';
    description.textContent = label;
    element.parentElement.appendChild(description);
    element.setAttribute('aria-describedby', id);
  }
};

/**
 * Manage focus for single-page applications
 */
export class FocusManager {
  constructor() {
    this.focusHistory = [];
  }

  saveFocus() {
    this.focusHistory.push(document.activeElement);
  }

  restoreFocus() {
    const element = this.focusHistory.pop();
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }

  clearHistory() {
    this.focusHistory = [];
  }
}

export const focusManager = new FocusManager();
