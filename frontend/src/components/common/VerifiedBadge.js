import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Shield } from 'lucide-react';

const VerifiedBadge = ({ 
  size = 'md', 
  showText = true,
  animated = true,
  variant = 'default',
  type = 'user', // 'user' or 'property'
  className = '' 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const variants = {
    default: 'bg-gradient-to-r from-green-400 to-green-600 text-white',
    outline: 'border-2 border-green-500 text-green-700 dark:text-green-400',
    minimal: 'text-green-600 dark:text-green-400'
  };

  const Icon = type === 'property' ? Shield : BadgeCheck;
  const text = type === 'property' ? 'Verified Property' : 'Verified';

  const Container = animated ? motion.div : 'div';
  const IconWrapper = animated ? motion.div : 'div';

  const containerProps = animated ? {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.05 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  } : {};

  const iconProps = animated ? {
    animate: {
      scale: [1, 1.2, 1]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3
    }
  } : {};

  // Checkmark animation
  const checkmarkAnimation = animated ? {
    initial: { pathLength: 0, opacity: 0 },
    animate: { pathLength: 1, opacity: 1 },
    transition: { duration: 0.5, ease: 'easeOut' }
  } : {};

  if (variant === 'minimal') {
    return (
      <Container 
        className={`inline-flex items-center space-x-1 ${className}`}
        {...containerProps}
      >
        <IconWrapper {...iconProps}>
          <Icon className={`${sizes[size]} text-green-600 dark:text-green-400`} />
        </IconWrapper>
        {showText && (
          <motion.span 
            className={`${textSizes[size]} font-medium text-green-700 dark:text-green-400`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {text}
          </motion.span>
        )}
      </Container>
    );
  }

  return (
    <Container 
      className={`
        inline-flex items-center space-x-1.5 px-3 py-1 rounded-full
        ${variants[variant]}
        ${variant === 'default' ? 'shadow-lg shadow-green-500/30' : ''}
        ${className}
      `}
      {...containerProps}
    >
      {/* Pulse effect for default variant */}
      {variant === 'default' && animated && (
        <motion.div
          className="absolute inset-0 rounded-full bg-green-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        />
      )}
      
      <IconWrapper className="relative z-10" {...iconProps}>
        <Icon className={sizes[size]} />
      </IconWrapper>
      
      {showText && (
        <motion.span 
          className={`${textSizes[size]} font-semibold relative z-10`}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {text}
        </motion.span>
      )}
    </Container>
  );
};

export default VerifiedBadge;
