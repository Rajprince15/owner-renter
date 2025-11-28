import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a container (useful for modals, dialogs)
 * @param {boolean} active - Whether the focus trap is active
 * @returns {Object} Ref to attach to the container element
 */
function useFocusTrap(active = true) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;

    // Get all focusable elements
    const getFocusableElements = () => {
      const selector = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll(selector));
    };

    // Handle tab key
    const handleTab = (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // Tab
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add event listener
    container.addEventListener('keydown', handleTab);

    // Focus first element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Small delay to ensure element is rendered
      setTimeout(() => {
        focusableElements[0]?.focus();
      }, 0);
    }

    // Cleanup
    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }, [active]);

  return containerRef;
}

export default useFocusTrap;
