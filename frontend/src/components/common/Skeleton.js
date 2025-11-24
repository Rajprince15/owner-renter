import React from 'react';

const Skeleton = ({ className = '', variant = 'text', animation = 'pulse' }) => {
  const baseClasses = 'bg-gray-200';
  
  const animationClasses = {
    pulse: 'animate-pulse',
    shimmer: 'animate-shimmer'
  };
  
  const variantClasses = {
    text: 'h-4 rounded',
    title: 'h-8 rounded',
    rect: 'rounded',
    circle: 'rounded-full',
    card: 'h-64 rounded-lg',
    avatar: 'w-12 h-12 rounded-full'
  };

  return (
    <div
      className={`${
        baseClasses
      } ${
        variantClasses[variant]
      } ${
        animationClasses[animation]
      } ${className}`}
      data-testid="skeleton"
    ></div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3" data-testid="skeleton-card">
      <Skeleton variant="rect" className="w-full h-48" />
      <Skeleton variant="title" className="w-3/4" />
      <Skeleton variant="text" className="w-full" />
      <Skeleton variant="text" className="w-2/3" />
      <div className="flex space-x-2 mt-4">
        <Skeleton variant="rect" className="w-20 h-8" />
        <Skeleton variant="rect" className="w-20 h-8" />
      </div>
    </div>
  );
};

export const SkeletonTable = ({ rows = 5 }) => {
  return (
    <div className="space-y-3" data-testid="skeleton-table">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton variant="text" className="w-1/4" />
          <Skeleton variant="text" className="w-1/4" />
          <Skeleton variant="text" className="w-1/4" />
          <Skeleton variant="text" className="w-1/4" />
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
