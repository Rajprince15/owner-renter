import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Search, 
  Home, 
  Shield, 
  Leaf, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  BadgeCheck,
  MapPin,
  TrendingUp,
  Award,
  Zap,
  ChevronDown
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleIn,
  scrollReveal,
  hoverLift
} from '../utils/motionConfig';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchCity, setSearchCity] = useState('');
  const [searchBHK, setSearchBHK] = useState('');

  // Intersection Observer hooks for scroll animations
  const [featuresRef, featuresInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [howItWorksRef, howItWorksInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleQuickSearch = (e) => {
    e.preventDefault();
    navigate(`/search?city=${searchCity}&bhk=${searchBHK}`);
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.user_type === 'admin') {
        navigate('/admin');
      } else if (user?.user_type === 'owner' || user?.user_type === 'both') {
        navigate('/owner/dashboard');
      } else {
        navigate('/renter/dashboard');
      }
    } else {
      navigate('/signup');
    }
  };

  const handleListProperty = () => {
    if (isAuthenticated) {
      if (user?.user_type === 'owner' || user?.user_type === 'both') {
        navigate('/owner/property/add');
      } else {
        navigate('/renter/dashboard');
      }
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 lg:py-28" data-testid="hero-section">
        {/* Animated Background Elements with Parallax */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
            animate={{
              y: [0, -30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content with Animations */}
            <motion.div
              className="text-center lg:text-left"
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
                variants={fadeInUp}
              >
                <BadgeCheck className="w-5 h-5 text-primary-200" />
                <span className="text-sm font-medium">Trusted by 50,000+ Renters & Owners</span>
              </motion.div>
              
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white"
                variants={staggerContainer}
              >
                <motion.span variants={fadeInUp} className="block">India's First</motion.span>
                <motion.span variants={fadeInUp} className="block text-white opacity-90">Trust-First Rental Marketplace</motion.span>
              </motion.h1>
              
              <motion.p
                className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto lg:mx-0"
                variants={fadeInUp}
              >
                No scams. No fake listings. Verified properties + Lifestyle search + Reverse marketplace. 
                <span className="block mt-2 font-semibold text-white">We monetize trust, not ads.</span>
              </motion.p>

              {/* Quick Search Bar with Animation */}
              <motion.div
                className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 mb-8 transition-colors duration-200"
                variants={scaleIn}
                data-testid="quick-search-bar"
              >
                <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter city (e.g., Bangalore)"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-400 outline-none transition-all duration-200"
                      data-testid="search-city-input"
                    />
                  </div>
                  
                  <select
                    value={searchBHK}
                    onChange={(e) => setSearchBHK(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-400 outline-none transition-all duration-200"
                    data-testid="search-bhk-select"
                  >
                    <option value="">BHK Type</option>
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK+">4+ BHK</option>
                  </select>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                    className="bg-primary-600 hover:bg-primary-700"
                    data-testid="hero-search-btn"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search
                  </Button>
                </form>
              </motion.div>

              {/* CTA Buttons with Stagger */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                variants={staggerContainer}
              >
                <motion.div variants={fadeInUp}>
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    to="/search"
                    data-testid="find-home-btn"
                    className="bg-white text-primary-600 hover:bg-primary-50"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    I'm Looking for a Home
                  </Button>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={handleListProperty}
                    className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600"
                    data-testid="list-property-btn"
                  >
                    <Home className="w-5 h-5 mr-2" />
                    I Want to List Property
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Column - 3D Illustration with Animation */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative">
                <div className="relative w-full h-96">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      className="w-72 h-72 bg-white/10 backdrop-blur-lg rounded-3xl absolute"
                      animate={{
                        rotate: [6, 12, 6],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="w-64 h-64 bg-white/20 backdrop-blur-lg rounded-3xl absolute"
                      animate={{
                        rotate: [-6, -12, -6],
                      }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                    <motion.div
                      className="w-56 h-56 bg-gradient-to-br from-white/30 to-primary-200/30 backdrop-blur-lg rounded-3xl flex items-center justify-center"
                      animate={{
                        y: [0, -20, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <Home className="w-32 h-32 text-white" />
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Trust Indicators with Counter Animation */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            data-testid="trust-indicators"
          >
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '10K+', label: 'Verified Properties' },
              { value: '25K+', label: 'Successful Connections' },
              { value: '4.8/5', label: 'Average Rating' }
            ].map((stat, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-primary-200 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-white/60" />
        </motion.div>
      </section>

      {/* Features Section with Scroll Animations */}
      <section
        ref={featuresRef}
        className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200"
        data-testid="features-section"
      >
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Homer?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              India's first rental marketplace built on trust, transparency, and lifestyle compatibility
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            animate={featuresInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {[
              {
                icon: Shield,
                color: 'primary',
                title: 'Trust & Verification',
                description: 'Every property and user goes through our rigorous verification process. Connect with confidence knowing you\'re dealing with verified renters and owners.',
                features: [
                  'Document verification for all parties',
                  'Background checks on properties',
                  'Verified badge for trusted users'
                ],
                testId: 'feature-trust'
              },
              {
                icon: Leaf,
                color: 'green',
                title: 'Lifestyle Search',
                description: 'Find homes that match your lifestyle, not just your budget. Search by air quality, noise levels, walkability, and nearby amenities.',
                features: [
                  'Air Quality Index (AQI) scores',
                  'Noise level measurements',
                  'Walkability & safety scores'
                ],
                testId: 'feature-lifestyle'
              },
              {
                icon: Users,
                color: 'purple',
                title: 'Reverse Marketplace',
                description: 'Premium renters create profiles for verified owners to discover. Get approached by owners with properties that match your needs.',
                features: [
                  'Anonymous profile browsing',
                  'Owners contact you directly',
                  'Privacy-first approach'
                ],
                testId: 'feature-marketplace'
              }
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 transition-all duration-200"
                  data-testid={feature.testId}
                >
                  <motion.div
                    className={`w-16 h-16 bg-gradient-to-br ${feature.color === 'primary' ? 'from-blue-500 to-blue-600' : feature.color === 'green' ? 'from-green-500 to-emerald-600' : 'from-purple-500 to-pink-600'} rounded-xl flex items-center justify-center mb-6`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className={`w-5 h-5 ${feature.color === 'primary' ? 'text-primary-600' : feature.color === 'green' ? 'text-green-600' : 'text-purple-600'} mr-2 flex-shrink-0 mt-0.5`} />
                        <span className="text-slate-700 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        ref={howItWorksRef}
        className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200"
        id="how-it-works"
        data-testid="how-it-works-section"
      >
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </motion.div>

          {/* For Renters */}
          <div className="mb-16">
            <motion.h3
              className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={howItWorksInView ? { opacity: 1 } : {}}
            >
              For Renters
            </motion.h3>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="initial"
              animate={howItWorksInView ? "animate" : "initial"}
              variants={staggerContainer}
            >
              {[
                { step: 1, title: 'Sign Up & Verify', description: 'Create your account and complete verification to unlock premium features and build trust with owners.' },
                { step: 2, title: 'Search & Shortlist', description: 'Use lifestyle filters to find homes that match your preferences. Shortlist properties and compare options.' },
                { step: 3, title: 'Connect & Move In', description: 'Chat directly with verified owners, schedule visits, and finalize your perfect rental home.' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg text-center transition-all duration-200"
                >
                  <motion.div
                    className="w-16 h-16 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {item.step}
                  </motion.div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* For Owners */}
          <div>
            <motion.h3
              className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center"
              initial={{ opacity: 0 }}
              animate={howItWorksInView ? { opacity: 1 } : {}}
            >
              For Property Owners
            </motion.h3>
            <motion.div
              className="grid md:grid-cols-3 gap-8"
              initial="initial"
              animate={howItWorksInView ? "animate" : "initial"}
              variants={staggerContainer}
            >
              {[
                { step: 1, title: 'List Your Property', description: 'Create a detailed listing with photos, amenities, and pricing. Get verified for maximum visibility.' },
                { step: 2, title: 'Get Discovered', description: 'Reach verified renters actively searching. Access the reverse marketplace to find ideal tenants.' },
                { step: 3, title: 'Close the Deal', description: 'Chat with interested renters, schedule viewings, and find your perfect tenant quickly.' }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg text-center transition-all duration-200"
                >
                  <motion.div
                    className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    {item.step}
                  </motion.div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-300">{item.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200" data-testid="pricing-section">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We monetize <span className="font-bold text-primary-600">trust and access</span>, not ads. 
              Start free, upgrade when you see the value.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Search,
                color: 'primary',
                title: 'For Renters',
                price: '₹0 - ₹750',
                period: 'Forever free or one-time payment',
                features: [
                  'Free: 2 property contacts',
                  'Premium: Unlimited contacts + lifestyle search',
                  'Get verified renter badge'
                ]
              },
              {
                icon: Home,
                color: 'green',
                title: 'For Property Owners',
                price: '₹0 - ₹2,000',
                period: 'Free listing or one-time verification',
                features: [
                  'Free: List with "Not Verified" badge',
                  'Verified: Top ranking + 5-10X more inquiries',
                  'Access reverse marketplace'
                ]
              }
            ].map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ y: -8 }}
                  className={`bg-gradient-to-br ${plan.color === 'primary' ? 'from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border-primary-200 dark:border-primary-800' : 'from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 border-green-200 dark:border-green-800'} rounded-2xl p-8 border-2 transition-all duration-200`}
                >
                  <div className="flex items-center justify-center mb-4">
                    <div className={`w-12 h-12 ${plan.color === 'primary' ? 'bg-primary-600' : 'bg-green-600'} rounded-lg flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-4">{plan.title}</h3>
                  <div className="space-y-4 mb-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-slate-900 dark:text-white">{plan.price}</div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{plan.period}</p>
                    </div>
                    <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className={`w-5 h-5 ${plan.color === 'primary' ? 'text-primary-600' : 'text-green-600'} mr-2 flex-shrink-0 mt-0.5`} />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              variant="primary" 
              size="lg" 
              to="/pricing"
              className="bg-primary-600 text-white hover:bg-primary-700"
            >
              View Complete Pricing Details
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-slate-500 mt-4">
              No hidden fees • No commissions • Fully transparent
            </p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        ref={testimonialsRef}
        className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200"
        data-testid="testimonials-section"
      >
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join thousands of happy renters and owners
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            animate={testimonialsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {[
              {
                rating: 5,
                text: '"Homer\'s lifestyle search helped me find a quiet 2BHK near a park with great air quality. The verification process gave me confidence in the owner."',
                name: 'Priya Sharma',
                role: 'Software Engineer, Bangalore',
                initials: 'PS',
                color: 'primary'
              },
              {
                rating: 5,
                text: '"As a property owner, getting my property verified was worth it. I got 3X more inquiries and found a verified renter within a week!"',
                name: 'Amit Patel',
                role: 'Property Owner, Mumbai',
                initials: 'AP',
                color: 'green'
              },
              {
                rating: 5,
                text: '"The reverse marketplace feature is genius! Owners contacted me with properties matching my exact requirements. Saved so much time!"',
                name: 'Raj Kumar',
                role: 'Marketing Manager, Delhi',
                initials: 'RK',
                color: 'purple'
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                variants={staggerItem}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={testimonialsInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                    >
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                  {testimonial.text}
                </p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${testimonial.color === 'primary' ? 'bg-primary-100 dark:bg-primary-900' : testimonial.color === 'green' ? 'bg-green-100 dark:bg-green-900' : 'bg-purple-100 dark:bg-purple-900'} rounded-full flex items-center justify-center mr-4`}>
                    <span className={`${testimonial.color === 'primary' ? 'text-primary-600 dark:text-primary-300' : testimonial.color === 'green' ? 'text-green-600 dark:text-green-300' : 'text-purple-600 dark:text-purple-300'} font-bold`}>{testimonial.initials}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Real Success Stories
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              See how Homer has transformed rental experiences across India
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { icon: TrendingUp, value: '92%', label: 'Match Success Rate', description: 'Of verified renters found their ideal home within 2 weeks', color: 'primary' },
              { icon: Award, value: 'Zero', label: 'Fraud Cases', description: '100% verified properties mean no scams, no fake listings', color: 'green' },
              { icon: Zap, value: '3 Days', label: 'Average Time', description: 'Verified owners find quality tenants 10X faster than traditional methods', color: 'purple' }
            ].map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, y: -8 }}
                  className={`bg-gradient-to-br ${stat.color === 'primary' ? 'from-primary-50 to-primary-100' : stat.color === 'green' ? 'from-green-50 to-green-100 dark:from-green-900 dark:to-green-800' : 'from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800'} rounded-2xl p-8 text-center transition-all duration-200`}
                >
                  <motion.div
                    className={`w-16 h-16 ${stat.color === 'primary' ? 'bg-primary-600' : stat.color === 'green' ? 'bg-green-600' : 'bg-purple-600'} text-white rounded-full flex items-center justify-center mx-auto mb-4`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-8 h-8" />
                  </motion.div>
                  <div className={`text-4xl font-bold ${stat.color === 'primary' ? 'text-primary-600' : stat.color === 'green' ? 'text-green-600 dark:text-green-400' : 'text-purple-600 dark:text-purple-400'} mb-2`}>{stat.value}</div>
                  <p className="text-slate-700 dark:text-slate-200 font-semibold mb-2">{stat.label}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section
        ref={statsRef}
        className="py-20 bg-slate-900 text-white"
      >
        <div className="container-custom">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Growing Every Day
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join India's fastest-growing trust-first rental marketplace
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="initial"
            animate={statsInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {[
              { value: '50,000+', label: 'Active Users', sublabel: 'Renters & Owners', gradient: 'from-primary-400 to-primary-200' },
              { value: '10,000+', label: 'Verified Properties', sublabel: 'Across 50+ Cities', gradient: 'from-green-400 to-emerald-200' },
              { value: '25,000+', label: 'Successful Matches', sublabel: 'Happy Connections', gradient: 'from-purple-400 to-pink-200' },
              { value: '4.8★', label: 'Average Rating', sublabel: 'From 12,000+ Reviews', gradient: 'from-yellow-400 to-orange-200' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="text-center"
              >
                <motion.div
                  className={`text-5xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  initial={{ scale: 0 }}
                  animate={statsInView ? { scale: 1 } : {}}
                  transition={{ delay: index * 0.1, type: "spring" }}
                >
                  {stat.value}
                </motion.div>
                <p className="text-slate-300">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.sublabel}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white" data-testid="cta-section">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              {isAuthenticated 
                ? `Welcome Back, ${user?.full_name || 'User'}!` 
                : 'Ready to Find Your Perfect Home?'}
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              {isAuthenticated
                ? 'Continue your journey to finding or listing the perfect property'
                : 'Join Homer today and experience India\'s most trusted rental marketplace'}
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp}>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  onClick={handleGetStarted}
                  data-testid="cta-signup-btn"
                  className="bg-white text-primary-600 hover:bg-primary-50"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <Button 
                  variant="outline" 
                  size="lg" 
                  to="/search"
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600"
                  data-testid="cta-browse-btn"
                >
                  Browse Properties
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;