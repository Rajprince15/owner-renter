import { useEffect, useRef, useState } from 'react';

/**
 * Intersection Observer hook for lazy loading and scroll-triggered animations
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isIntersecting, entry]
 */
function useIntersectionObserver(options = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);

  const defaultOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
    triggerOnce: false,
    ...options
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        setEntry(entry);

        // If triggerOnce is true, unobserve after first intersection
        if (entry.isIntersecting && defaultOptions.triggerOnce) {
          observer.unobserve(element);
        }
      },
      {
        root: defaultOptions.root,
        rootMargin: defaultOptions.rootMargin,
        threshold: defaultOptions.threshold
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [defaultOptions.root, defaultOptions.rootMargin, defaultOptions.threshold, defaultOptions.triggerOnce]);

  return [ref, isIntersecting, entry];
}

export default useIntersectionObserver;
