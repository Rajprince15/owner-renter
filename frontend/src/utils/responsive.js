// Responsive design utilities

/**
 * Breakpoint constants matching Tailwind configuration
 */
export const BREAKPOINTS = {
  mobile: 640,
  tablet: 1024,
  laptop: 1440,
  desktop: 1920,
};

/**
 * Get current breakpoint
 * @returns {string} Current breakpoint name
 */
export const getCurrentBreakpoint = () => {
  const width = window.innerWidth;
  
  if (width < BREAKPOINTS.mobile) return 'mobile';
  if (width < BREAKPOINTS.tablet) return 'tablet';
  if (width < BREAKPOINTS.laptop) return 'laptop';
  if (width < BREAKPOINTS.desktop) return 'desktop';
  return 'ultrawide';
};

/**
 * Check if device is mobile
 * @returns {boolean}
 */
export const isMobile = () => {
  return window.innerWidth < BREAKPOINTS.mobile;
};

/**
 * Check if device is tablet
 * @returns {boolean}
 */
export const isTablet = () => {
  const width = window.innerWidth;
  return width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
};

/**
 * Check if device is desktop
 * @returns {boolean}
 */
export const isDesktop = () => {
  return window.innerWidth >= BREAKPOINTS.tablet;
};

/**
 * Check if device is touch-enabled
 * @returns {boolean}
 */
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
};

/**
 * Get device orientation
 * @returns {string} 'portrait' or 'landscape'
 */
export const getOrientation = () => {
  return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
};

/**
 * Check if device is in landscape mode
 * @returns {boolean}
 */
export const isLandscape = () => {
  return getOrientation() === 'landscape';
};

/**
 * Get viewport dimensions
 * @returns {Object} {width, height}
 */
export const getViewportDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};

/**
 * Calculate responsive font size
 * @param {number} baseSize - Base font size in pixels
 * @param {number} minSize - Minimum font size in pixels
 * @param {number} maxSize - Maximum font size in pixels
 * @returns {string} Calculated font size in rem
 */
export const responsiveFontSize = (baseSize, minSize = 12, maxSize = 24) => {
  const width = window.innerWidth;
  const fontSize = Math.max(minSize, Math.min(maxSize, baseSize * (width / 1440)));
  return `${fontSize / 16}rem`;
};

/**
 * Listen for viewport changes
 * @param {Function} callback - Callback function to execute on resize
 * @param {number} debounce - Debounce delay in milliseconds
 * @returns {Function} Cleanup function
 */
export const onViewportChange = (callback, debounce = 250) => {
  let timeoutId;
  
  const handleResize = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      callback({
        breakpoint: getCurrentBreakpoint(),
        dimensions: getViewportDimensions(),
        orientation: getOrientation(),
      });
    }, debounce);
  };

  window.addEventListener('resize', handleResize);
  window.addEventListener('orientationchange', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleResize);
    clearTimeout(timeoutId);
  };
};

/**
 * Get CSS breakpoint value
 * @param {string} breakpoint - Breakpoint name
 * @returns {string} CSS media query
 */
export const getMediaQuery = (breakpoint) => {
  const queries = {
    mobile: `(max-width: ${BREAKPOINTS.mobile - 1}px)`,
    tablet: `(min-width: ${BREAKPOINTS.mobile}px) and (max-width: ${BREAKPOINTS.tablet - 1}px)`,
    laptop: `(min-width: ${BREAKPOINTS.tablet}px) and (max-width: ${BREAKPOINTS.laptop - 1}px)`,
    desktop: `(min-width: ${BREAKPOINTS.laptop}px) and (max-width: ${BREAKPOINTS.desktop - 1}px)`,
    ultrawide: `(min-width: ${BREAKPOINTS.desktop}px)`,
  };

  return queries[breakpoint] || queries.mobile;
};

/**
 * Responsive spacing calculator
 * @param {number} baseSpacing - Base spacing value
 * @returns {string} Calculated spacing
 */
export const responsiveSpacing = (baseSpacing) => {
  const breakpoint = getCurrentBreakpoint();
  const multipliers = {
    mobile: 0.75,
    tablet: 0.875,
    laptop: 1,
    desktop: 1.125,
    ultrawide: 1.25,
  };

  return `${baseSpacing * (multipliers[breakpoint] || 1)}px`;
};

/**
 * Check if viewport matches a specific breakpoint
 * @param {string} breakpoint - Breakpoint name
 * @returns {boolean}
 */
export const matchesBreakpoint = (breakpoint) => {
  const query = getMediaQuery(breakpoint);
  return window.matchMedia(query).matches;
};

/**
 * Get device pixel ratio
 * @returns {number}
 */
export const getDevicePixelRatio = () => {
  return window.devicePixelRatio || 1;
};

/**
 * Check if device has high DPI screen
 * @returns {boolean}
 */
export const isHighDPI = () => {
  return getDevicePixelRatio() > 1;
};

/**
 * Responsive image source selector
 * @param {Object} sources - Object with breakpoint keys and image URLs
 * @returns {string} Selected image URL
 */
export const getResponsiveImageSrc = (sources) => {
  const breakpoint = getCurrentBreakpoint();
  return sources[breakpoint] || sources.mobile || Object.values(sources)[0];
};
