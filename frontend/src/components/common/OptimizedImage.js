import React from 'react';
import LazyImage from './LazyImage';

/**
 * Optimized Image Component with responsive sources and format support
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for accessibility
 * @param {Object} props.sources - Responsive image sources
 * @param {string} props.className - CSS classes
 * @param {string} props.sizes - Image sizes attribute
 * @param {boolean} props.lazy - Whether to lazy load (default: true)
 */
const OptimizedImage = ({
  src,
  alt,
  sources = {},
  className = '',
  sizes = '100vw',
  lazy = true,
  width,
  height,
  objectFit = 'cover',
  priority = false,
  ...props
}) => {
  // If priority is true, don't lazy load
  const shouldLazyLoad = lazy && !priority;

  // If we have responsive sources, use picture element
  if (Object.keys(sources).length > 0) {
    return (
      <picture className={className}>
        {/* WebP sources for better compression */}
        {sources.webp && (
          <>
            {sources.webp.large && (
              <source
                media="(min-width: 1024px)"
                srcSet={sources.webp.large}
                type="image/webp"
              />
            )}
            {sources.webp.medium && (
              <source
                media="(min-width: 640px)"
                srcSet={sources.webp.medium}
                type="image/webp"
              />
            )}
            {sources.webp.small && (
              <source
                media="(max-width: 639px)"
                srcSet={sources.webp.small}
                type="image/webp"
              />
            )}
          </>
        )}

        {/* Fallback sources */}
        {sources.large && (
          <source
            media="(min-width: 1024px)"
            srcSet={sources.large}
          />
        )}
        {sources.medium && (
          <source
            media="(min-width: 640px)"
            srcSet={sources.medium}
          />
        )}
        {sources.small && (
          <source
            media="(max-width: 639px)"
            srcSet={sources.small}
          />
        )}

        {/* Fallback image */}
        {shouldLazyLoad ? (
          <LazyImage
            src={src}
            alt={alt}
            width={width}
            height={height}
            objectFit={objectFit}
            {...props}
          />
        ) : (
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            style={{ objectFit }}
            loading={priority ? 'eager' : 'lazy'}
            {...props}
          />
        )}
      </picture>
    );
  }

  // Simple image with lazy loading
  if (shouldLazyLoad) {
    return (
      <LazyImage
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        objectFit={objectFit}
        {...props}
      />
    );
  }

  // Priority image (no lazy loading)
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      style={{ objectFit }}
      loading="eager"
      {...props}
    />
  );
};

export default OptimizedImage;

/**
 * Example usage:
 * 
 * // Simple lazy loaded image
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   className="w-full h-96"
 * />
 * 
 * // Responsive image with multiple sources
 * <OptimizedImage
 *   src="/images/hero.jpg"
 *   alt="Hero image"
 *   sources={{
 *     large: '/images/hero-lg.jpg',
 *     medium: '/images/hero-md.jpg',
 *     small: '/images/hero-sm.jpg',
 *     webp: {
 *       large: '/images/hero-lg.webp',
 *       medium: '/images/hero-md.webp',
 *       small: '/images/hero-sm.webp',
 *     }
 *   }}
 *   className="w-full h-96"
 * />
 * 
 * // Priority image (hero, above fold)
 * <OptimizedImage
 *   src="/images/logo.svg"
 *   alt="Company logo"
 *   priority={true}
 *   className="w-32 h-32"
 * />
 */
