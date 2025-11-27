import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  success,
  required = false,
  disabled = false,
  maxLength,
  showCharacterCount = false,
  className = '',
  icon,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasError, setHasError] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Trigger shake animation on error
  React.useEffect(() => {
    if (error) {
      setHasError(true);
      setTimeout(() => setHasError(false), 300);
    }
  }, [error]);

  return (
    <div className="w-full">
      {label && (
        <motion.label 
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500">
            {icon}
          </div>
        )}
        
        <motion.input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          animate={{
            scale: isFocused ? 1.01 : 1,
            x: hasError ? [-5, 5, -5, 5, 0] : 0
          }}
          transition={{ duration: 0.2 }}
          className={`
            w-full px-4 py-2 rounded-lg border
            ${icon ? 'pl-10' : ''}
            ${type === 'password' ? 'pr-10' : ''}
            bg-white dark:bg-slate-800
            border-slate-300 dark:border-slate-600
            text-slate-900 dark:text-slate-100
            placeholder-slate-400 dark:placeholder-slate-500
            focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all duration-200
            ${error ? 'border-red-500 dark:border-red-500 focus:ring-red-500' : ''}
            ${success ? 'border-green-500 dark:border-green-500 focus:ring-green-500' : ''}
            ${className}
          `}
          {...props}
        />

        {/* Password toggle */}
        {type === 'password' && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            tabIndex={-1}
          >
            <motion.div
              initial={false}
              animate={{ rotate: showPassword ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </motion.div>
          </motion.button>
        )}

        {/* Success indicator */}
        {success && !error && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
          </motion.div>
        )}

        {/* Error indicator */}
        {error && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <AlertCircle className="w-5 h-5 text-red-500" />
          </motion.div>
        )}
      </div>

      {/* Character count */}
      {showCharacterCount && maxLength && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-right"
        >
          {value?.length || 0} / {maxLength}
        </motion.div>
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-red-500 dark:text-red-400 text-sm mt-1 flex items-center gap-1"
          >
            <AlertCircle className="w-4 h-4" />
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Success message */}
      <AnimatePresence>
        {success && !error && (
          <motion.p 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-green-500 dark:text-green-400 text-sm mt-1 flex items-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            {success}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Input;
