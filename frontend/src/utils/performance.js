// Performance optimization utilities

/**
 * Lazy load images with Intersection Observer
 * @param {HTMLElement} element - Image element to lazy load
 * @param {Object} options - Intersection Observer options
 */
export const lazyLoadImage = (element, options = {}) => {
  const defaultOptions = {
    root: null,
    rootMargin: '50px',
    threshold: 0.01
  };

  const config = { ...defaultOptions, ...options };

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (src) {
          img.src = src;
        }
        if (srcset) {
          img.srcset = srcset;
        }

        img.classList.remove('lazy');
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  }, config);

  imageObserver.observe(element);
  return imageObserver;
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Request idle callback wrapper with fallback
 * @param {Function} callback - Function to execute when idle
 * @param {Object} options - Options for requestIdleCallback
 */
export const requestIdleCallbackPolyfill = (callback, options = {}) => {
  if ('requestIdleCallback' in window) {
    return window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(() => {
      callback({
        didTimeout: false,
        timeRemaining: () => 50
      });
    }, 1);
  }
};

/**
 * Cancel idle callback with fallback
 * @param {number} id - ID returned from requestIdleCallbackPolyfill
 */
export const cancelIdleCallbackPolyfill = (id) => {
  if ('cancelIdleCallback' in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
};

/**
 * Load script dynamically
 * @param {string} src - Script source URL
 * @returns {Promise}
 */
export const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

/**
 * Preload image
 * @param {string} src - Image source URL
 * @returns {Promise}
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Batch DOM updates using requestAnimationFrame
 * @param {Function} callback - Function with DOM updates
 */
export const batchDOMUpdates = (callback) => {
  if ('requestAnimationFrame' in window) {
    window.requestAnimationFrame(callback);
  } else {
    callback();
  }
};

/**
 * Optimize for GPU acceleration
 * @param {HTMLElement} element - Element to optimize
 */
export const optimizeForGPU = (element) => {
  if (element) {
    element.style.transform = 'translateZ(0)';
    element.style.willChange = 'transform';
  }
};

/**
 * Measure Web Vitals
 */
export const measureWebVitals = async () => {
  try {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  } catch (error) {
    // web-vitals not installed, skip measurement
    console.info('Web Vitals not available');
  }
};

/**
 * Check if connection is slow
 * @returns {boolean}
 */
export const isSlowConnection = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
  }
  return false;
};

/**
 * Get device memory in GB
 * @returns {number}
 */
export const getDeviceMemory = () => {
  if ('deviceMemory' in navigator) {
    return navigator.deviceMemory;
  }
  return 4; // Default assumption
};

/**
 * Check if device is low-end
 * @returns {boolean}
 */
export const isLowEndDevice = () => {
  const memory = getDeviceMemory();
  const cores = navigator.hardwareConcurrency || 4;
  return memory <= 2 || cores <= 2;
};

/**
 * Memoize function results
 * @param {Function} fn - Function to memoize
 * @returns {Function}
 */
export const memoize = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
};
