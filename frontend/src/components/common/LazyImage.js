import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import useIntersectionObserver from '../../hooks/useIntersectionObserver';

const LazyImage = ({
  src,
  alt,
  className = '',
  placeholderSrc = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3C/svg%3E',
  width,
  height,
  objectFit = 'cover',
  onLoad,
  onError,
  ...props
}) => {
  const [imageSrc, setImageSrc] = useState(placeholderSrc);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageRef = useRef(null);

  const [ref, isIntersecting] = useIntersectionObserver({
    triggerOnce: true,
    rootMargin: '50px'
  });

  useEffect(() => {
    if (isIntersecting && src) {
      const img = new Image();
      
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
        if (onLoad) onLoad();
      };

      img.onerror = () => {
        setImageError(true);
        if (onError) onError();
      };

      img.src = src;
    }
  }, [isIntersecting, src, onLoad, onError]);

  if (imageError) {
    return (
      <div
        ref={ref}
        className={`flex items-center justify-center bg-slate-200 dark:bg-slate-700 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt || 'Image failed to load'}
      >
        <svg
          className="w-12 h-12 text-slate-400 dark:text-slate-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ width, height }}>
      <motion.img
        ref={imageRef}
        src={imageSrc}
        alt={alt}
        className={`w-full h-full transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectFit }}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{
          opacity: imageLoaded ? 1 : 0,
          scale: imageLoaded ? 1 : 1.05
        }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        loading="lazy"
        {...props}
      />
      
      {!imageLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse" />
      )}
    </div>
  );
};

export default LazyImage;
