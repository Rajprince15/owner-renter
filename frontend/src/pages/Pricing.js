import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check, X, Star, Shield, Search, Home, Zap, TrendingUp, Users, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { fadeInUp, staggerContainer, staggerItem, scaleIn } from '../utils/motionConfig';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Intersection observers for scroll animations
  const [renterRef, renterInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [ownerRef, ownerInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [comparisonRef, comparisonInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [reverseRef, reverseInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [roiRef, roiInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleGetStarted = (plan) => {
    if (isAuthenticated) {
      if (plan === 'renter') {
        navigate('/renter/subscription');
      } else if (plan === 'owner') {
        navigate('/owner/verification');
      }
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="pricing-page">
      {/* Hero Section with Animation */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 relative overflow-hidden" data-testid="pricing-hero">
        {/* Animated Background Orbs */}
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

        <div className="container-custom relative z-10">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Transparent Pricing
            </motion.h1>
            <motion.p
              className="text-xl text-white opacity-90 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              We monetize <span className="font-bold text-white">trust and access</span>, not ads. Start free, upgrade when you see the value. No hidden fees, no surprises.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Philosophy */}
      <section className="py-12 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container-custom">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border border-primary-200 dark:border-primary-800 rounded-2xl p-8 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why Our Pricing Model Works</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Traditional platforms monetize through ads, creating perverse incentives—fake listings pay better than real ones. 
                <strong className="text-primary-600 dark:text-primary-400"> Homer flips this model.</strong> We charge for trust (verification) and access (premium features). 
                This means verified properties always rank higher, and our success is tied to yours.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Renter Pricing with Animations */}
      <section ref={renterRef} className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={renterInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Search className="w-8 h-8 text-primary-600 mr-3" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">For Renters</h2>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find your perfect home with trust and transparency
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="initial"
            animate={renterInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {/* Free Renter */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg transition-colors duration-200"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free Browser</h3>
                <motion.div
                  className="text-5xl font-bold text-slate-900 dark:text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={renterInView ? { scale: 1 } : {}}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  ₹0
                </motion.div>
                <p className="text-slate-600 dark:text-slate-400">Forever Free • No Credit Card</p>
              </div>

              <motion.ul
                className="space-y-4 mb-8"
                variants={staggerContainer}
              >
                {[
                  { title: 'Unlimited browsing', desc: 'View all property listings' },
                  { title: 'Basic search filters', desc: 'Search by price, BHK, and location' },
                  { title: 'Contact 2 owners', desc: 'Perfect for exploring options' },
                  { title: 'Shortlist properties', desc: 'Save your favorite listings' },
                  { title: 'Basic chat functionality', desc: 'Message property owners' }
                ].map((item, idx) => (
                  <motion.li key={idx} variants={fadeInUp} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900 dark:text-white">{item.title}</span>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full" onClick={() => handleGetStarted('renter')}>
                  Start Free
                </Button>
              </motion.div>
            </motion.div>

            {/* Premium Renter */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              className="bg-gradient-primary rounded-2xl p-8 border-2 border-primary-600 shadow-2xl relative"
            >
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  MOST POPULAR
                </span>
              </motion.div>

              <div className="text-center mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Premium Renter</h3>
                <motion.div
                  className="text-5xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  animate={renterInView ? { scale: 1 } : {}}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  ₹750
                </motion.div>
                <p className="text-primary-100">One-time • 90 days validity</p>
              </div>

              <motion.ul
                className="space-y-4 mb-8 text-white"
                variants={staggerContainer}
              >
                {[
                  { title: 'Unlimited property contacts', desc: 'Connect with as many owners as you need' },
                  { title: 'Verified Renter badge', desc: 'After document verification' },
                  { title: 'Advanced Lifestyle Search', desc: 'AQI, noise levels, walkability scores' },
                  { title: 'Reverse Marketplace profile', desc: 'Let owners discover and contact you' },
                  { title: 'Lifestyle Search', desc: 'Search using natural language' },
                  { title: 'Priority support', desc: 'Faster response times' }
                ].map((item, idx) => (
                  <motion.li key={idx} variants={fadeInUp} className="flex items-start">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{item.title}</span>
                      <p className="text-sm text-primary-100">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="secondary" className="w-full !bg-white !text-primary-600 hover:!bg-primary-50 hover:!text-primary-700 !border-2 !border-white shadow-xl font-bold" onClick={() => handleGetStarted('renter')}>
                  Upgrade to Premium
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Owner Pricing with Animations */}
      <section ref={ownerRef} className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={ownerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Home className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">For Property Owners</h2>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find verified tenants faster with trust and visibility
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="initial"
            animate={ownerInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {/* Free Owner */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -8 }}
              className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg transition-colors duration-200"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free Lister</h3>
                <motion.div
                  className="text-5xl font-bold text-slate-900 dark:text-white mb-2"
                  initial={{ scale: 0 }}
                  animate={ownerInView ? { scale: 1 } : {}}
                  transition={{ type: "spring", delay: 0.2 }}
                >
                  ₹0
                </motion.div>
                <p className="text-slate-600 dark:text-slate-400">List for Free • Forever</p>
              </div>

              <motion.ul className="space-y-4 mb-8" variants={staggerContainer}>
                {[
                  { title: 'List property for free', desc: 'No listing fees', icon: CheckCircle, color: 'green' },
                  { title: 'Visible in search results', desc: 'Renters can find your listing', icon: CheckCircle, color: 'green' },
                  { title: 'Search discovery enabled', desc: 'Your property appears for renters', icon: CheckCircle, color: 'green' },
                  { title: 'Active marketplace presence', desc: 'Reach potential renters', icon: CheckCircle, color: 'green' },
                  { title: 'No lifestyle data enrichment', desc: '', icon: X, color: 'slate' },
                  { title: 'Not discoverable in lifestyle search', desc: '', icon: X, color: 'slate' },
                  { title: 'No reverse marketplace access', desc: '', icon: X, color: 'slate' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.li
                      key={idx}
                      variants={fadeInUp}
                      className={`flex items-start ${item.color === 'slate' ? 'text-slate-400 dark:text-slate-600' : ''}`}
                    >
                      <Icon className={`w-5 h-5 mr-3 flex-shrink-0 mt-0.5 ${item.color === 'green' ? 'text-green-600 dark:text-green-400' : ''}`} />
                      <div>
                        <span className={`font-medium ${item.color === 'green' ? 'text-slate-900 dark:text-white' : ''}`}>{item.title}</span>
                        {item.desc && <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>}
                      </div>
                    </motion.li>
                  );
                })}
              </motion.ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="outline" className="w-full" onClick={() => handleGetStarted('owner')}>
                  List Free
                </Button>
              </motion.div>
            </motion.div>

            {/* Verified Owner */}
            <motion.div
              variants={staggerItem}
              whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 border-2 border-green-600 shadow-2xl relative"
            >
              <motion.div
                className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  RECOMMENDED
                </span>
              </motion.div>

              <div className="text-center mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Verified Lister</h3>
                <motion.div
                  className="text-5xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  animate={ownerInView ? { scale: 1 } : {}}
                  transition={{ type: "spring", delay: 0.3 }}
                >
                  ₹1,500
                </motion.div>
                <p className="text-green-100">One-time per property • Lifetime validity</p>
              </div>

              <motion.ul className="space-y-4 mb-8 text-white" variants={staggerContainer}>
                {[
                  { title: '"Verified Property" badge 🏆', desc: 'Build instant trust with renters' },
                  { title: 'Top search ranking', desc: 'Always appear above free listings' },
                  { title: 'Lifestyle data enrichment', desc: 'AQI, noise, walkability automatically calculated' },
                  { title: 'Discoverable in lifestyle searches', desc: 'Premium renters can find you' },
                  { title: 'Reverse Marketplace access', desc: 'Browse and contact verified renters' },
                  { title: '5-10X more inquiries', desc: 'Verified listings get dramatically more views' },
                  { title: 'Priority support', desc: 'Dedicated assistance' }
                ].map((item, idx) => (
                  <motion.li key={idx} variants={fadeInUp} className="flex items-start">
                    <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold">{item.title}</span>
                      <p className="text-sm text-green-100">{item.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button variant="secondary" className="w-full !bg-white !text-green-600 hover:!bg-green-50 hover:!text-green-700 !border-2 !border-white shadow-xl font-bold" onClick={() => handleGetStarted('owner')}>
                  Get Verified
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Feature Comparison Table with Animation */}
      <section ref={comparisonRef} className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={comparisonInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Complete Feature Comparison
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              See exactly what you get with each tier
            </p>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto overflow-x-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={comparisonInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            <table className="w-full bg-white dark:bg-slate-700 rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-slate-900 dark:bg-slate-950 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold">Free Renter</th>
                  <th className="px-6 py-4 text-center font-bold bg-primary-600 dark:bg-primary-700">Premium Renter</th>
                  <th className="px-6 py-4 text-center font-bold">Free Owner</th>
                  <th className="px-6 py-4 text-center font-bold bg-green-600 dark:bg-green-700">Verified Owner</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                {[
                  { feature: 'Browse All Listings', free_renter: 'check', premium_renter: 'check', free_owner: '—', verified_owner: '—' },
                  { feature: 'Property Contacts', free_renter: '2 max', premium_renter: 'Unlimited', free_owner: '—', verified_owner: '—' },
                  { feature: 'Search Filters', free_renter: 'Basic only', premium_renter: 'Basic + Lifestyle', free_owner: '—', verified_owner: '—' },
                  { feature: 'Verification Badge', free_renter: '—', premium_renter: 'check', free_owner: '⚠ "Not Verified"', verified_owner: '✓ Verified' },
                  { feature: 'Search Ranking', free_renter: '—', premium_renter: '—', free_owner: 'Standard', verified_owner: 'Top Priority' },
                  { feature: 'Lifestyle Data', free_renter: '—', premium_renter: 'check', free_owner: '—', verified_owner: 'check' },
                  { feature: 'Reverse Marketplace', free_renter: '—', premium_renter: 'check', free_owner: '—', verified_owner: 'check' },
                  { feature: 'Renter Visibility', free_renter: 'Hidden from owners', premium_renter: 'Visible to owners', free_owner: '10% of verified', verified_owner: '5-10X more' }
                ].map((row, idx) => (
                  <motion.tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-600"
                    initial={{ opacity: 0, x: -20 }}
                    animate={comparisonInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">{row.feature}</td>
                    <td className="px-6 py-4 text-center">
                      {row.free_renter === 'check' ? <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /> : <span className="text-slate-700 dark:text-slate-300">{row.free_renter}</span>}
                    </td>
                    <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30">
                      {row.premium_renter === 'check' ? <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /> : <span className="font-bold text-primary-600 dark:text-primary-400">{row.premium_renter}</span>}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">{row.free_owner}</td>
                    <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30">
                      {row.verified_owner === 'check' ? <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /> : <span className="font-bold text-green-600 dark:text-green-400">{row.verified_owner}</span>}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </div>
      </section>

      {/* Reverse Marketplace Explanation with Animation */}
      <section ref={reverseRef} className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={reverseInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Users className="w-10 h-10 text-purple-600 dark:text-purple-400 mr-3" />
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                What is Reverse Marketplace?
              </h2>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              A game-changing feature where verified owners find <strong>you</strong> instead of the other way around
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            {/* How It Works */}
            <motion.div
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-8 mb-8 border-2 border-purple-200 dark:border-purple-800 transition-colors duration-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={reverseInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 text-center">How It Works</h3>
              
              <motion.div
                className="grid md:grid-cols-3 gap-6"
                initial="initial"
                animate={reverseInView ? "animate" : "initial"}
                variants={staggerContainer}
              >
                {[
                  { step: 1, title: 'Create Your Profile', desc: 'Premium renters fill in their requirements: budget, location preferences, BHK type, move-in date, and employment details' },
                  { step: 2, title: 'Stay Anonymous', desc: 'Your profile shows only anonymized info (e.g., "Renter #1024"). Your name, contact details, and documents remain hidden' },
                  { step: 3, title: 'Owners Find You', desc: 'Verified owners browse profiles, find matches, and reach out to you with properties that fit your needs' }
                ].map((item, idx) => (
                  <motion.div key={idx} variants={staggerItem} className="text-center">
                    <motion.div
                      className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="text-2xl font-bold text-white">{item.step}</span>
                    </motion.div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Benefits Grid */}
            <motion.div
              className="grid md:grid-cols-2 gap-6"
              initial="initial"
              animate={reverseInView ? "animate" : "initial"}
              variants={staggerContainer}
            >
              {/* For Premium Renters */}
              <motion.div
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-slate-800 border-2 border-purple-200 dark:border-purple-700 rounded-xl p-6 transition-colors duration-200"
              >
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-2" />
                  For Premium Renters
                </h4>
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  {[
                    '<strong>No more endless searching</strong> - Owners with matching properties contact you',
                    '<strong>Complete privacy</strong> - Your identity stays protected until you respond',
                    '<strong>Better matches</strong> - Connect with owners who already know you fit their criteria',
                    '<strong>Verified badge advantage</strong> - Owners prioritize verified renters'
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={reverseInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <span className="text-purple-600 dark:text-purple-400 mr-2">•</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* For Verified Owners */}
              <motion.div
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-slate-800 border-2 border-green-200 dark:border-green-700 rounded-xl p-6 transition-colors duration-200"
              >
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mr-2" />
                  For Verified Owners
                </h4>
                <ul className="space-y-3 text-slate-700 dark:text-slate-300">
                  {[
                    '<strong>Pre-qualified tenants</strong> - Browse verified renters with clear requirements',
                    '<strong>Save time</strong> - Find tenants whose budget and preferences match your property',
                    '<strong>Employment verified</strong> - See income ranges and employment types upfront',
                    '<strong>Serious renters only</strong> - Premium users are committed to finding quality homes'
                  ].map((item, idx) => (
                    <motion.li
                      key={idx}
                      className="flex items-start"
                      initial={{ opacity: 0, x: -20 }}
                      animate={reverseInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.3 + idx * 0.1 }}
                    >
                      <span className="text-green-600 dark:text-green-400 mr-2">•</span>
                      <span dangerouslySetInnerHTML={{ __html: item }} />
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>

            {/* Privacy & Security Note */}
            <motion.div
              className="mt-8 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl p-6 transition-colors duration-200"
              initial={{ opacity: 0, y: 20 }}
              animate={reverseInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-start">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Privacy & Security First</h4>
                  <p className="text-slate-700 dark:text-slate-300 text-sm">
                    <strong>What's visible:</strong> Anonymous ID, employment type, income range, property preferences, budget, and move-in date.<br />
                    <strong>What's hidden:</strong> Your name, contact info, email, phone number, profile photo, and all personal documents remain completely private until you choose to share them.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ROI Section with Animation */}
      <section ref={roiRef} className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={roiInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Return on Investment
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              How quickly does Homer pay for itself?
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            initial="initial"
            animate={roiInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {/* Renter ROI */}
            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl p-8 transition-colors duration-200"
            >
              <motion.div
                className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">For Renters: ₹750 Investment</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                {[
                  { label: 'Save on broker fees:', value: '₹10,000+' },
                  { label: 'Avoid scam losses:', value: '₹5,000+' },
                  { label: 'Time saved (30+ hours):', value: 'Priceless' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-primary-200 dark:border-primary-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={roiInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span>{item.label}</span>
                    <span className="font-bold text-primary-600 dark:text-primary-400">{item.value}</span>
                  </motion.div>
                ))}
                <motion.div
                  className="flex justify-between items-center py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg px-4 mt-4"
                  initial={{ scale: 0 }}
                  animate={roiInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <span className="font-bold">Net Benefit:</span>
                  <span className="font-bold text-xl">₹15,000+</span>
                </motion.div>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
                  <strong>20X return</strong> on your investment
                </p>
              </div>
            </motion.div>

            {/* Owner ROI */}
            <motion.div
              variants={staggerItem}
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-8 transition-colors duration-200"
            >
              <motion.div
                className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <TrendingUp className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">For Owners: ₹1,500 Investment</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                {[
                  { label: 'Find tenant faster:', value: '7-10 days vs 45 days' },
                  { label: 'Save rent loss (35 days):', value: '₹25,000+' },
                  { label: 'Quality verified tenants:', value: 'Lower risk' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-700"
                    initial={{ opacity: 0, x: -20 }}
                    animate={roiInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <span>{item.label}</span>
                    <span className="font-bold text-green-600 dark:text-green-400">{item.value}</span>
                  </motion.div>
                ))}
                <motion.div
                  className="flex justify-between items-center py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg px-4 mt-4"
                  initial={{ scale: 0 }}
                  animate={roiInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.4, type: "spring" }}
                >
                  <span className="font-bold">Net Benefit:</span>
                  <span className="font-bold text-xl">₹25,000+</span>
                </motion.div>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
                  <strong>12X return</strong> on your investment
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section with Animation */}
      <section ref={faqRef} className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="container-custom">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={faqInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <motion.div
            className="max-w-3xl mx-auto space-y-6"
            initial="initial"
            animate={faqInView ? "animate" : "initial"}
            variants={staggerContainer}
          >
            {[
              { q: 'Can I upgrade from free to premium later?', a: 'Yes! You can upgrade anytime. Your contact history is preserved, and premium features activate immediately.' },
              { q: 'Is verification mandatory?', a: 'No. You can use Homer without verification. However, verified users get significantly better results—verified properties get 5-10X more inquiries, and verified renters are prioritized by owners.' },
              { q: 'What if I don\'t find a property within 90 days?', a: 'While 92% of our premium users find properties within 2 weeks, if you don\'t find a match, contact support for a pro-rated refund or extension.' },
              { q: 'Do I need to pay ₹1,500 for each property listing?', a: 'Yes, verification is per property. This ensures every listing undergoes thorough checks. However, once verified, it remains verified—no annual fees.' },
              { q: 'Are there any hidden charges?', a: 'Absolutely none. Homer\'s pricing is fully transparent. What you see is what you pay. No commissions, no finder\'s fees, no surprises.' }
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                variants={staggerItem}
                whileHover={{ scale: 1.02 }}
                className="bg-white dark:bg-slate-700 rounded-xl p-6 transition-colors duration-200 shadow-md"
              >
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-300">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section with Animation */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white relative overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        
        <div className="container-custom text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
              Start free today. Upgrade when you see the value. No commitment, no credit card required.
            </p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                {isAuthenticated ? (
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    onClick={() => {
                      if (user?.user_type === 'renter') navigate('/renter/dashboard');
                      else if (user?.user_type === 'owner') navigate('/owner/dashboard');
                      else if (user?.is_admin) navigate('/admin');
                      else navigate('/');
                    }}
                    className="bg-white text-primary-600 hover:bg-primary-50"
                  >
                    Go to Dashboard
                  </Button>
                ) : (
                  <Button variant="secondary" size="lg" to="/signup" className="bg-white text-primary-600 hover:bg-primary-50">
                    Create Free Account
                  </Button>
                )}
              </motion.div>
              <motion.div variants={fadeInUp} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg" to="/search" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600">
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

export default Pricing;
