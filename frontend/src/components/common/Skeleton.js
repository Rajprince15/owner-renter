import React from 'react';

const Skeleton = ({ className = '', variant = 'rectangular', width, height }) => {
  const variants = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div
      className={`animate-shimmer bg-slate-200 dark:bg-slate-700 ${variants[variant]} ${className}`}
      style={style}
      data-testid="skeleton"
    />
  );
};

export default Skeleton;
