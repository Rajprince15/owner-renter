import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home, Search, User, LogOut, MessageCircle, Shield, Sun, Moon } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getUnreadCount } from '../../services/chatService';
import NotificationPanel from '../notifications/NotificationPanel';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const getNavLinks = () => {
    const links = [
      { name: 'Home', path: '/', icon: Home },
      { name: 'Search', path: '/search', icon: Search },
    ];
    
    // Static pages
    links.push({ name: 'Pricing', path: '/pricing', icon: null });
    
    return links;
  };

  const navLinks = getNavLinks();

  // Load unread message count
  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadCount();
      // Refresh count every 30 seconds
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
    if (user.user_type === 'renter') return '/renter/dashboard';
    if (user.user_type === 'owner') return '/owner/dashboard';
    return '/';
  };

  const getChatsLink = () => {
    if (!user) return '/';
    if (user.user_type === 'renter') return '/renter/chats';
    if (user.user_type === 'owner') return '/owner/chats';
    return '/';
  };

  return (
    <nav className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900 dark:text-white">Homer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative ${
                  isActive(link.path)
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className="ml-1 text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notification Panel */}
                <NotificationPanel />
                
                {/* Theme Toggle Button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Toggle theme"
                  data-testid="theme-toggle-btn"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                
                {/* Owner Verification Link */}
                {(user?.user_type === 'owner' || user?.user_type === 'both') && (
                  <Link 
                    to="/owner/verification"
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100 transition border border-green-200"
                    data-testid="navbar-verify-link"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Verify Property</span>
                  </Link>
                )}
                
                <Link 
                  to={getChatsLink()}
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  data-testid="navbar-chats-link"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Messages</span>
                  {unreadCount > 0 && (
                    <span 
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                      data-testid="navbar-unread-badge"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to={getDashboardLink()}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                  data-testid="navbar-dashboard-link"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.full_name || 'Dashboard'}</span>
                </Link>
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
                {/* Theme Toggle Button for non-authenticated users */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Toggle theme"
                  data-testid="theme-toggle-btn"
                >
                  {isDark ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
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
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200 dark:border-slate-700" data-testid="mobile-menu">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 px-4 space-y-3">
                {/* Theme Toggle in Mobile Menu */}
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
                {isAuthenticated ? (
                  <>
                    {/* Owner Verification Link */}
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
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
