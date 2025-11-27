import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';

const PremiumBadge = ({ 
  size = 'md', 
  showText = true, 
  animated = true,
  variant = 'default',
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
    default: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
    outline: 'border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400',
    minimal: 'text-yellow-600 dark:text-yellow-400'
  };

  const Container = animated ? motion.div : 'div';
  const Icon = animated ? motion.div : 'div';

  const containerProps = animated ? {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    whileHover: { scale: 1.05 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  } : {};

  const iconProps = animated ? {
    animate: {
      rotate: [0, -10, 10, -10, 0],
      scale: [1, 1.1, 1]
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3
    }
  } : {};

  if (variant === 'minimal') {
    return (
      <Container 
        className={`inline-flex items-center space-x-1 ${className}`}
        {...containerProps}
      >
        <Icon {...iconProps}>
          <Crown className={`${sizes[size]} text-yellow-600 dark:text-yellow-400`} />
        </Icon>
        {showText && (
          <motion.span 
            className={`${textSizes[size]} font-medium text-yellow-700 dark:text-yellow-400`}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            Premium
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
        ${variant === 'default' ? 'shadow-lg shadow-yellow-500/30' : ''}
        ${className}
      `}
      {...containerProps}
    >
      {/* Sparkle effect for default variant */}
      {variant === 'default' && animated && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity
          }}
        >
          <Sparkles className="w-3 h-3 text-yellow-200" />
        </motion.div>
      )}
      
      <Icon {...iconProps}>
        <Crown className={sizes[size]} />
      </Icon>
      
      {showText && (
        <motion.span 
          className={`${textSizes[size]} font-semibold`}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Premium
        </motion.span>
      )}
    </Container>
  );
};

export default PremiumBadge;
