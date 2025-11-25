import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  to, 
  href,
  onClick,
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-lg hover:shadow-xl',
    secondary: 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 border-2 border-primary-600 dark:border-primary-500 hover:bg-primary-50 dark:hover:bg-slate-600 focus:ring-primary-500',
    outline: 'bg-transparent text-slate-700 dark:text-slate-300 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-slate-500',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:ring-slate-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl',
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabled ? disabledClasses : ''} ${className}`;
  
  // If 'to' prop is provided, render as Link
  if (to && !disabled) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  
  // If 'href' prop is provided, render as anchor
  if (href && !disabled) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  
  // Otherwise, render as button
  return (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
