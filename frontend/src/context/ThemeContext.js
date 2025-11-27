import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  // Check if dark theme is enabled via environment variable
  const isDarkThemeEnabled = process.env.REACT_APP_ENABLE_DARK_THEME === 'true';
  
  // Initialize theme based on system preference or localStorage
  const [theme, setTheme] = useState(() => {
    // If dark theme is disabled, always use light theme
    if (!isDarkThemeEnabled) {
      return 'light';
    }
    
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  // Apply theme class to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    // Always apply light theme if dark theme is disabled
    const appliedTheme = isDarkThemeEnabled ? theme : 'light';
    root.classList.add(appliedTheme);
    
    if (isDarkThemeEnabled) {
      localStorage.setItem('theme', theme);
    }
  }, [theme, isDarkThemeEnabled]);

  // Listen for system theme changes
  useEffect(() => {
    // Skip if dark theme is disabled
    if (!isDarkThemeEnabled) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set a preference
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDarkThemeEnabled]);

  const toggleTheme = () => {
    // Only allow theme toggle if dark theme is enabled
    if (!isDarkThemeEnabled) return;
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
    isDarkThemeEnabled // Expose this so components can hide theme toggle if needed
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
