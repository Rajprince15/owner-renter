import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home, Search, User, LogOut, MessageCircle, Shield, Sun, Moon } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getUnreadCount } from '../../services/chatService';
import NotificationPanel from '../notifications/NotificationPanel';
import { fadeInDown, slideInLeft } from '../../utils/motionConfig';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme, isDark, isDarkThemeEnabled } = useTheme();

  // Handle scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getNavLinks = () => {
    const links = [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Search', path: '/search', icon: Search },
    ];
    
    links.push({ name: 'Pricing', path: '/pricing', icon: null });
    
    return links;
  };

  const navLinks = getNavLinks();

  // Load unread message count
  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      const interval = setInterval(loadUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.is_admin) return '/admin';
    if (user.user_type === 'renter') return '/renter/dashboard';
    if (user.user_type === 'owner') return '/owner/dashboard';
    return '/';
  };

  const getChatsLink = () => {
    if (!user) return '/';
    if (user.is_admin) return null;
    if (user.user_type === 'renter') return '/renter/chats';
    if (user.user_type === 'owner') return '/owner/chats';
    return '/';
  };

  return (
    <motion.nav 
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-lg' 
          : 'bg-white dark:bg-slate-800 shadow-md'
        }
      `}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo with animation */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div 
              className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Home className="w-6 h-6 text-white" />
            </motion.div>
            <motion.span 
              className="text-2xl font-bold text-slate-900 dark:text-white"
              whileHover={{ scale: 1.02 }}
            >
              Homer
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={link.path}
                  className={`
                    text-sm font-medium transition-colors relative
                    ${isActive(link.path)
                      ? 'text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                    }
                  `}
                >
                  {link.name}
                  {/* Active indicator */}
                  {isActive(link.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 dark:bg-primary-400"
                      layoutId="activeLink"
                      initial={false}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <NotificationPanel />
                
                {isDarkThemeEnabled && (
                  <motion.button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Toggle theme"
                    data-testid="theme-toggle-btn"
                  >
                    <AnimatePresence mode="wait">
                      {isDark ? (
                        <motion.div
                          key="sun"
                          initial={{ rotate: -180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: 180, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Sun className="w-5 h-5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="moon"
                          initial={{ rotate: 180, opacity: 0 }}
                          animate={{ rotate: 0, opacity: 1 }}
                          exit={{ rotate: -180, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Moon className="w-5 h-5" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
                
                {(user?.user_type === 'owner' || user?.user_type === 'both') && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to="/owner/verification"
                      className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition border border-green-200"
                      data-testid="navbar-verify-link"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Verify Property</span>
                    </Link>
                  </motion.div>
                )}
                
                {!user?.is_admin && (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      to={getChatsLink()}
                      className="relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                      data-testid="navbar-chats-link"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Messages</span>
                      {unreadCount > 0 && (
                        <motion.span 
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                          data-testid="navbar-unread-badge"
                        >
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </motion.span>
                      )}
                    </Link>
                  </motion.div>
                )}
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={getDashboardLink()}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                    data-testid="navbar-dashboard-link"
                  >
                    <User className="w-4 h-4" />
                    <span>{user?.full_name || 'Dashboard'}</span>
                  </Link>
                </motion.div>
                
                <Button 
                  variant="ghost" 
                  onClick={handleLogout} 
                  size="sm"
                  data-testid="navbar-logout-btn"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                {isDarkThemeEnabled && (
                  <motion.button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Toggle theme"
                    data-testid="theme-toggle-btn"
                  >
                    {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </motion.button>
                )}
                <Button variant="ghost" to="/login" size="sm" data-testid="navbar-login-btn">
                  <User className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button variant="primary" to="/signup" size="sm" data-testid="navbar-signup-btn">
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            whileTap={{ scale: 0.9 }}
            data-testid="mobile-menu-toggle"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700" 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              data-testid="mobile-menu"
            >
              <div className="flex flex-col space-y-4">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors block ${
                        isActive(link.path)
                          ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 px-4 space-y-3">
                  {isDarkThemeEnabled && (
                    <button
                      onClick={toggleTheme}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      data-testid="mobile-theme-toggle-btn"
                    >
                      {isDark ? (
                        <>
                          <Sun className="w-4 h-4" />
                          <span>Light Mode</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4" />
                          <span>Dark Mode</span>
                        </>
                      )}
                    </button>
                  )}
                  {isAuthenticated ? (
                    <>
                      {(user?.user_type === 'owner' || user?.user_type === 'both') && (
                        <Link
                          to="/owner/verification"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-200"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Verify Property</span>
                        </Link>
                      )}
                      
                      {!user?.is_admin && (
                        <Link
                          to={getChatsLink()}
                          onClick={() => setIsMenuOpen(false)}
                          className="relative flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>Messages</span>
                          {unreadCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                          )}
                        </Link>
                      )}
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-center space-x-2 w-full px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
                      >
                        <User className="w-4 h-4" />
                        <span>{user?.full_name || 'Dashboard'}</span>
                      </Link>
                      <Button 
                        variant="outline" 
                        onClick={handleLogout} 
                        size="sm" 
                        className="w-full"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" to="/login" size="sm" className="w-full">
                        Login
                      </Button>
                      <Button variant="primary" to="/signup" size="sm" className="w-full">
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
