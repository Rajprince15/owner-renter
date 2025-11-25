import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error, 
  required = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-lg border
          bg-white dark:bg-slate-800
          border-slate-300 dark:border-slate-600
          text-slate-900 dark:text-slate-100
          placeholder-slate-400 dark:placeholder-slate-500
          focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors duration-200
          ${error ? 'border-red-500 dark:border-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
