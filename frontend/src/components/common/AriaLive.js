import React from 'react';

/**
 * AriaLive component for announcing dynamic content to screen readers
 * @param {Object} props
 * @param {string} props.message - Message to announce
 * @param {string} props.politeness - 'polite', 'assertive', or 'off'
 * @param {boolean} props.atomic - Whether to announce the entire region
 */
const AriaLive = ({ 
  message, 
  politeness = 'polite', 
  atomic = true,
  className = ''
}) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic={atomic}
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
};

export default AriaLive;
