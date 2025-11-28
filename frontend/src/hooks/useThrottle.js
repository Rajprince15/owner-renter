import { useState, useEffect, useRef } from 'react';

/**
 * Throttle hook - limits how often a value can be updated
 * @param {any} value - Value to throttle
 * @param {number} interval - Minimum time between updates in milliseconds
 * @returns {any} Throttled value
 */
function useThrottle(value, interval = 500) {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + interval) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval);

      return () => clearTimeout(timerId);
    }
  }, [value, interval]);

  return throttledValue;
}

export default useThrottle;
