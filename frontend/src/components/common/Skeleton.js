import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ 
  className = '', 
  variant = 'rectangular', 
  width, 
  height,
  count = 1,
  animation = 'shimmer'
}) => {
  const variants = {
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
    text: 'rounded h-4',
    avatar: 'rounded-full',
    button: 'rounded-lg h-10',
    card: 'rounded-xl'
  };

  const animations = {
    shimmer: 'animate-shimmer',
    pulse: 'animate-pulse',
    wave: 'animate-shimmer'
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  // For avatar variant, default to square dimensions
  if (variant === 'avatar' && !width && !height) {
    style.width = '48px';
    style.height = '48px';
  }

  // For text variant, default height
  if (variant === 'text' && !height) {
    style.height = '16px';
  }

  const skeletons = Array.from({ length: count }, (_, i) => (
    <motion.div
      key={i}
      className={`
        bg-slate-200 dark:bg-slate-700 
        ${variants[variant]} 
        ${animations[animation]}
        ${className}
      `}
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: i * 0.05 }}
      data-testid="skeleton"
    />
  ));

  return count > 1 ? (
    <div className="space-y-3">{skeletons}</div>
  ) : (
    skeletons[0]
  );
};

// Preset skeleton layouts for common use cases
export const SkeletonCard = ({ className = '' }) => (
  <div className={`p-4 border border-slate-200 dark:border-slate-700 rounded-xl ${className}`}>
    <Skeleton variant="rectangular" height="200px" className="mb-4" />
    <Skeleton variant="text" className="mb-2" />
    <Skeleton variant="text" width="60%" className="mb-4" />
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width="30%" />
      <Skeleton variant="button" width="80px" />
    </div>
  </div>
);

export const SkeletonProfile = ({ className = '' }) => (
  <div className={`flex items-center space-x-4 ${className}`}>
    <Skeleton variant="avatar" width="48px" height="48px" />
    <div className="flex-1">
      <Skeleton variant="text" width="150px" className="mb-2" />
      <Skeleton variant="text" width="100px" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex space-x-4">
        {Array.from({ length: columns }).map((_, j) => (
          <Skeleton 
            key={j} 
            variant="text" 
            className="flex-1" 
          />
        ))}
      </div>
    ))}
  </div>
);

export const SkeletonList = ({ items = 5, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-3">
        <Skeleton variant="avatar" width="40px" height="40px" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="60%" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
