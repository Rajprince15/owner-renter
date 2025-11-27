import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  size = 'md', 
  variant = 'spinner',
  color = 'primary',
  fullScreen = false,
  text,
  progress,
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    primary: 'border-primary-600 dark:border-primary-400',
    white: 'border-white',
    slate: 'border-slate-600 dark:border-slate-400'
  };

  const spinnerVariants = {
    spinner: (
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-transparent ${colors[color]}`}
        style={{ borderTopColor: 'transparent' }}
        data-testid="loading-spinner"
      >
        <span className="sr-only">Loading...</span>
      </div>
    ),
    dots: (
      <div className="flex space-x-2" data-testid="loading-dots">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`rounded-full bg-primary-600 dark:bg-primary-400 ${size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4'}`}
            animate={{
              y: [0, -10, 0],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15
            }}
          />
        ))}
      </div>
    ),
    pulse: (
      <motion.div
        className={`${sizes[size]} rounded-full bg-primary-600 dark:bg-primary-400`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1,
          repeat: Infinity
        }}
        data-testid="loading-pulse"
      />
    ),
    bars: (
      <div className="flex space-x-1" data-testid="loading-bars">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`bg-primary-600 dark:bg-primary-400 ${size === 'sm' ? 'w-1 h-4' : size === 'md' ? 'w-1.5 h-6' : 'w-2 h-8'} rounded-full`}
            animate={{
              scaleY: [1, 1.5, 1]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: i * 0.1
            }}
          />
        ))}
      </div>
    ),
    icon: (
      <Loader2 
        className={`${sizes[size]} text-primary-600 dark:text-primary-400 animate-spin`}
        data-testid="loading-icon"
      />
    )
  };

  const content = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {spinnerVariants[variant]}
      
      {text && (
        <motion.p 
          className="mt-4 text-sm text-slate-600 dark:text-slate-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {text}
        </motion.p>
      )}

      {progress !== undefined && (
        <motion.div 
          className="mt-4 w-48"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary-600 dark:bg-primary-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 text-center">
            {progress}%
          </p>
        </motion.div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
};

export default LoadingSpinner;
