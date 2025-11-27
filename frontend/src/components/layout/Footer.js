import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowUp, Send } from 'lucide-react';
import { staggerContainer, fadeInUp } from '../../utils/motionConfig';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Show back to top button on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  const footerLinks = {
    company: [
      { name: 'About Us', path: '/about' },
      { name: 'How It Works', path: '/#how-it-works' },
      { name: 'Pricing', path: '/pricing' },
      { name: 'Contact', path: '/contact' },
    ],
    renters: [
      { name: 'Search Properties', path: '/search' },
      { name: 'Premium Benefits', path: '/pricing' },
      { name: 'Lifestyle Search', path: '/search' },
      { name: 'Verification', path: '/renter/verification' },
    ],
    owners: [
      { name: 'List Property', path: '/owner/property/add' },
      { name: 'Verification', path: '/owner/verification' },
      { name: 'Reverse Marketplace', path: '/owner/reverse-marketplace' },
      { name: 'Analytics', path: '/owner/dashboard' },
    ],
    legal: [
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' },
      { name: 'Refund Policy', path: '/refund' },
      { name: 'FAQ', path: '/faq' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com', color: 'hover:bg-blue-600' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com', color: 'hover:bg-sky-500' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com', color: 'hover:bg-pink-600' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com', color: 'hover:bg-blue-700' },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-800 transition-colors duration-200 relative" data-testid="footer">
      {/* Back to top button */}
      {showBackToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}

      <div className="container-custom py-12">
        {/* Main Footer Content */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Brand Column */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <motion.div 
                className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Home className="w-6 h-6 text-white" />
              </motion.div>
              <span className="text-2xl font-bold text-slate-900 dark:text-white">Homer</span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Find your perfect rental home with verified properties, lifestyle search, and trusted connections.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center ${social.color} hover:text-white transition-all`}
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Company Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* For Renters */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">For Renters</h3>
            <ul className="space-y-2">
              {footerLinks.renters.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* For Owners */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">For Owners</h3>
            <ul className="space-y-2">
              {footerLinks.owners.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors inline-block"
                  >
                    <motion.span
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      {link.name}
                    </motion.span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div variants={fadeInUp}>
            <h3 className="text-slate-900 dark:text-white font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Subscribe to get updates on new properties and offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-2 pr-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-primary-500 transition-all"
                />
                <motion.button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>

        {/* Contact Info */}
        <motion.div 
          className="border-t border-slate-200 dark:border-slate-800 pt-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ x: 5 }}
            >
              <Mail className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-slate-600 dark:text-slate-400">support@homer.com</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ x: 5 }}
            >
              <Phone className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-slate-600 dark:text-slate-400">+91 1800-123-4567</span>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-2"
              whileHover={{ x: 5 }}
            >
              <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              <span className="text-slate-600 dark:text-slate-400">Bangalore, Karnataka, India</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-slate-200 dark:border-slate-800 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              © {currentYear} Homer. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {footerLinks.legal.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
