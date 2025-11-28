import { useEffect } from 'react';

/**
 * Performance Monitor Component
 * Monitors and logs performance metrics in development
 */
const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor page load performance
    if ('performance' in window && 'getEntriesByType' in window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.getEntriesByType('navigation')[0];
          
          if (perfData) {
            console.group('⚡ Performance Metrics');
            console.log('DNS Lookup:', Math.round(perfData.domainLookupEnd - perfData.domainLookupStart), 'ms');
            console.log('TCP Connection:', Math.round(perfData.connectEnd - perfData.connectStart), 'ms');
            console.log('Request Time:', Math.round(perfData.responseStart - perfData.requestStart), 'ms');
            console.log('Response Time:', Math.round(perfData.responseEnd - perfData.responseStart), 'ms');
            console.log('DOM Processing:', Math.round(perfData.domComplete - perfData.domLoading), 'ms');
            console.log('Load Event:', Math.round(perfData.loadEventEnd - perfData.loadEventStart), 'ms');
            console.log('Total Load Time:', Math.round(perfData.loadEventEnd - perfData.fetchStart), 'ms');
            console.groupEnd();
          }

          // Monitor resource loading
          const resources = window.performance.getEntriesByType('resource');
          const largeResources = resources.filter(r => r.transferSize > 100000); // > 100KB
          
          if (largeResources.length > 0) {
            console.group('📦 Large Resources (>100KB)');
            largeResources.forEach(resource => {
              console.log(
                `${resource.name.split('/').pop()}:`,
                Math.round(resource.transferSize / 1024),
                'KB -',
                Math.round(resource.duration),
                'ms'
              );
            });
            console.groupEnd();
          }
        }, 0);
      });
    }

    // Monitor long tasks (performance issues)
    if ('PerformanceObserver' in window) {
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn('⚠️ Long Task Detected:', Math.round(entry.duration), 'ms', entry);
          }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });

        return () => {
          longTaskObserver.disconnect();
        };
      } catch (e) {
        // Long task observer not supported
      }
    }

    // Monitor memory usage (Chrome only)
    if (performance.memory) {
      const logMemory = () => {
        const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const usedMB = Math.round(usedJSHeapSize / 1048576);
        const limitMB = Math.round(jsHeapSizeLimit / 1048576);
        const percentUsed = Math.round((usedJSHeapSize / jsHeapSizeLimit) * 100);

        if (percentUsed > 80) {
          console.warn('💾 High Memory Usage:', usedMB, 'MB /', limitMB, 'MB', `(${percentUsed}%)`);
        }
      };

      const memoryInterval = setInterval(logMemory, 30000); // Check every 30 seconds

      return () => {
        clearInterval(memoryInterval);
      };
    }
  }, []);

  // Component doesn't render anything
  return null;
};

export default PerformanceMonitor;
