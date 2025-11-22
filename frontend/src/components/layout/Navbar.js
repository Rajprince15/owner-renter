import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Search, User } from 'lucide-react';
import Button from '../common/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'About', path: '/about', icon: null },
    { name: 'Pricing', path: '/pricing', icon: null },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Home className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">Homer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-primary-600'
                    : 'text-slate-600 hover:text-primary-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" to="/login" size="sm" data-testid="navbar-login-btn">
              <User className="w-4 h-4 mr-2" />
              Login
            </Button>
            <Button variant="primary" to="/signup" size="sm" data-testid="navbar-signup-btn">
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            data-testid="mobile-menu-toggle"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200" data-testid="mobile-menu">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(link.path)
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-slate-200 pt-4 px-4 space-y-3">
                <Button variant="outline" to="/login" size="sm" className="w-full">
                  Login
                </Button>
                <Button variant="primary" to="/signup" size="sm" className="w-full">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
