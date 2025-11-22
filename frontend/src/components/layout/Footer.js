import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300" data-testid="footer">
      <div className="container-custom py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Homer</span>
            </Link>
            <p className="text-sm text-slate-400 mb-4">
              Find your perfect rental home with verified properties, lifestyle search, and trusted connections.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Renters */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Renters</h3>
            <ul className="space-y-2">
              {footerLinks.renters.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Owners</h3>
            <ul className="space-y-2">
              {footerLinks.owners.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm hover:text-primary-400 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Mail className="w-5 h-5 text-primary-400" />
              <span>support@homer.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-primary-400" />
              <span>+91 1800-123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary-400" />
              <span>Bangalore, Karnataka, India</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-slate-400">
              © {currentYear} Homer. All rights reserved.
            </p>
            <p className="text-sm text-slate-400">
              Made with ❤️ for renters and property owners
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
