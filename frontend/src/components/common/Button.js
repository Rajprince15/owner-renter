import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  href,
  onClick,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className = '',
  ...props 
}) => {
  const [ripples, setRipples] = useState([]);

  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-500 hover:bg-primary-50 dark:hover:bg-slate-600 focus:ring-primary-500',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled || loading ? disabledClasses : ''} ${className}`;
  
  // Ripple effect handler
  const handleRipple = (e) => {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rippleId = Date.now();
    
    setRipples([...ripples, { x, y, id: rippleId }]);
    
    setTimeout(() => {
      setRipples(ripples.filter(r => r.id !== rippleId));
    }, 600);
  };

  const content = (
    <>
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full pointer-events-none animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
          }}
        />
      ))}
      
      {loading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && !loading && (
        <span className="ml-2">{icon}</span>
      )}
    </>
  );

  const motionProps = {
    whileHover: disabled || loading ? {} : { scale: 1.02 },
    whileTap: disabled || loading ? {} : { scale: 0.98 },
    transition: { duration: 0.1 }
  };
  
  // If 'to' prop is provided, render as Link
  if (to && !disabled && !loading) {
    return (
      <Link to={to} className={classes} {...props}>
        <motion.div {...motionProps} className="flex items-center">
          {content}
        </motion.div>
      </Link>
    );
  }
  
  // If 'href' prop is provided, render as anchor
  if (href && !disabled && !loading) {
    return (
      <a href={href} className={classes} {...props}>
        <motion.div {...motionProps} className="flex items-center">
          {content}
        </motion.div>
      </a>
    );
  }
  
  // Otherwise, render as button
  return (
    <motion.button 
      onClick={(e) => {
        if (!disabled && !loading) {
          handleRipple(e);
          onClick && onClick(e);
        }
      }}
      disabled={disabled || loading} 
      className={classes}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
};

export default Button;
