import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Heart, MessageCircle, 
  AlertCircle, Crown, CheckCircle, MapPin, Shield, TrendingUp, Bell
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getShortlists } from '../../services/shortlistService';
import { searchProperties } from '../../services/propertyService';
import PropertyCard from '../../components/property/PropertyCard';
import ContactLimitIndicator from '../../components/upsell/ContactLimitIndicator';
import Button from '../../components/common/Button';
import { pageTransition, fadeInUp, staggerContainer } from '../../utils/motionConfig';

const RenterDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [shortlistedProperties, setShortlistedProperties] = useState([]);
  const [recentProperties, setRecentProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactsRemaining, setContactsRemaining] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Fetch shortlisted properties
        const shortlistsResponse = await getShortlists();
        const shortlists = shortlistsResponse.data || [];
        setShortlistedProperties(shortlists.slice(0, 3)); // Show only 3

        // Fetch recent properties (verified first)
        const propertiesResponse = await searchProperties({ 
          city: 'Bangalore',
          limit: 6,
          sort_by: 'default'
        });
        setRecentProperties(propertiesResponse.data.properties || []);

        // Calculate contacts remaining
        if (user) {
          const isPremium = user.subscription_tier === 'premium';
          const used = user.contacts_used || 0;
          const remaining = isPremium ? 'Unlimited' : Math.max(0, 2 - used);
          setContactsRemaining(remaining);
        }

        // Show welcome animation on first visit
        const hasVisited = localStorage.getItem('renter_dashboard_visited');
        if (!hasVisited) {
          setShowWelcome(true);
          localStorage.setItem('renter_dashboard_visited', 'true');
          setTimeout(() => setShowWelcome(false), 5000);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const isPremium = user?.subscription_tier === 'premium';
  const isVerified = user?.is_verified_renter;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex justify-center items-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="inline-block rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"
          />
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-600 font-medium"
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      {...pageTransition}
    >
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner (First Visit) */}
        <AnimatePresence>
          {showWelcome && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="mb-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white overflow-hidden relative"
            >
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"
              />
              <motion.div
                animate={{ 
                  scale: [1, 1.3, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -left-20 -bottom-20 w-60 h-60 bg-white/5 rounded-full"
              />
              <div className="relative z-10">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold mb-2"
                >
                  🎉 Welcome to Homer, {user?.full_name?.split(' ')[0]}!
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-blue-100 text-lg"
                >
                  Start your journey to finding the perfect home. Browse properties, save favorites, and connect with owners.
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.h1 
            className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2" 
            data-testid="renter-dashboard-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome back, {user?.full_name?.split(' ')[0] || 'Renter'}! 👋
          </motion.h1>
          <motion.p 
            className="text-gray-600 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Find your perfect home with Homer
          </motion.p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {/* Subscription Status */}
          <StatCard
            icon={<Crown className="w-6 h-6" />}
            title={isPremium ? 'Premium' : 'Free'}
            subtitle={isPremium ? 'All features unlocked' : 'Limited features'}
            value={isPremium ? '✓ Active' : 'Upgrade'}
            color="blue"
            badge={isPremium ? 'Active' : null}
            onClick={() => !isPremium && navigate('/renter/subscription')}
            delay={0.1}
          />

          {/* Contacts Remaining */}
          <StatCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Contacts"
            subtitle={isPremium ? 'Unlimited contacts' : 'Contacts remaining'}
            value={contactsRemaining}
            color="green"
            onClick={() => navigate('/renter/chats')}
            testId="contacts-remaining"
            delay={0.2}
            warning={!isPremium && contactsRemaining < 3}
          />

          {/* Shortlisted Properties */}
          <StatCard
            icon={<Heart className="w-6 h-6" />}
            title="Shortlisted"
            subtitle="Saved homes"
            value={shortlistedProperties.length}
            color="red"
            onClick={() => navigate('/renter/shortlists')}
            testId="shortlisted-count"
            delay={0.3}
          />

          {/* Verification Status */}
          <StatCard
            icon={<CheckCircle className="w-6 h-6" />}
            title={isVerified ? 'Verified' : 'Not Verified'}
            subtitle={isVerified ? 'Profile verified' : 'Profile not verified'}
            value={isVerified ? '✓ Done' : 'Verify'}
            color={isVerified ? 'green' : 'yellow'}
            badge={isVerified ? 'Verified' : null}
            onClick={() => !isVerified && navigate('/renter/verification')}
            delay={0.4}
          />
        </motion.div>

        {/* Contact Limit Indicator */}
        {user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ContactLimitIndicator
              contactsUsed={user.contacts_used || 0}
              contactsLimit={isPremium ? 'unlimited' : 2}
              isPremium={isPremium}
              className="mb-8"
            />
          </motion.div>
        )}

        {/* Upgrade Banner (for free users) */}
        {!isPremium && (
          <motion.div 
            className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl shadow-2xl p-8 mb-8 text-white overflow-hidden relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"
            />
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="inline-block"
                  >
                    <Crown className="w-12 h-12 mb-4 text-yellow-300" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3">Upgrade to Premium</h2>
                  <p className="text-blue-100 mb-6 text-lg">
                    Get unlimited property contacts, advanced lifestyle search, verified badge, and more!
                  </p>
                </motion.div>
                <motion.ul 
                  className="space-y-3 mb-6"
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                >
                  {[
                    'Unlimited property contacts',
                    'Advanced lifestyle search filters',
                    'Verified Renter badge',
                    'Reverse marketplace visibility'
                  ].map((feature, index) => (
                    <motion.li
                      key={index}
                      variants={fadeInUp}
                      className="flex items-center gap-3"
                      whileHover={{ x: 5 }}
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-300" />
                      </motion.div>
                      <span className="text-lg">{feature}</span>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate('/renter/subscription')}
                    className="bg-blue-100 text-blue-600 hover:bg-blue-50 font-bold text-lg px-8 py-4 shadow-xl"
                  >
                    Upgrade Now - ₹750 for 90 days
                  </Button>
                </motion.div>
              </div>
              <div className="hidden lg:block">
                <motion.div
                  animate={{ 
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Crown className="w-40 h-40 text-white-400 opacity-20" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <QuickActionCard
            icon={<Search className="w-6 h-6" />}
            title="Search Properties"
            description="Browse thousands of verified properties"
            color="blue"
            onClick={() => navigate('/search')}
            testId="quick-action-search"
            delay={0.1}
          />
          <QuickActionCard
            icon={<Heart className="w-6 h-6" />}
            title="My Shortlists"
            description="View your saved properties"
            color="red"
            onClick={() => navigate('/renter/shortlists')}
            delay={0.2}
          />
          <QuickActionCard
            icon={<MessageCircle className="w-6 h-6" />}
            title="Messages"
            description="Chat with property owners"
            color="green"
            onClick={() => navigate('/renter/chats')}
            testId="quick-action-messages"
            delay={0.3}
          />
          {isPremium && isVerified && (
            <QuickActionCard
              icon={<Shield className="w-6 h-6" />}
              title="Privacy Settings"
              description="Manage reverse marketplace visibility"
              color="purple"
              onClick={() => navigate('/renter/privacy')}
              testId="quick-action-privacy"
              delay={0.4}
            />
          )}
        </motion.div>

        {/* Search Suggestions */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              Popular Searches
            </h2>
          </div>
          <motion.div 
            className="flex flex-wrap gap-3"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              { location: 'Koramangala', bhk: '2BHK' },
              { location: 'Indiranagar', bhk: '3BHK' },
              { location: 'HSR Layout', bhk: '1BHK' },
              { location: 'Whitefield', bhk: '2BHK' },
            ].map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => navigate(`/search?location=${suggestion.location}&bhk_type=${suggestion.bhk}`)}
                className="px-6 py-3 bg-white border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm font-medium"
                variants={fadeInUp}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MapPin className="w-4 h-4 inline mr-2" />
                {suggestion.bhk} in {suggestion.location}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        {/* Shortlisted Properties */}
        {shortlistedProperties.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-6 h-6 text-red-600" />
                Your Shortlisted Properties
              </h2>
              <motion.button
                onClick={() => navigate('/renter/shortlists')}
                className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
                whileHover={{ x: 5 }}
              >
                View All
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {shortlistedProperties.map((shortlist, index) => (
                shortlist.property && (
                  <motion.div
                    key={shortlist.shortlist_id}
                    variants={fadeInUp}
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <PropertyCard
                      property={shortlist.property}
                      onShortlist={() => {}}
                      isShortlisted={true}
                    />
                  </motion.div>
                )
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Recent Properties */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="w-6 h-6 text-purple-600" />
              Recently Added Properties
            </h2>
            <motion.button
              onClick={() => navigate('/search')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
              whileHover={{ x: 5 }}
            >
              View All
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.button>
          </div>
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            data-testid="recent-properties-grid"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {recentProperties.map((property, index) => (
              <motion.div
                key={property.property_id}
                variants={fadeInUp}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <PropertyCard
                  property={property}
                  onShortlist={() => {}}
                  isShortlisted={false}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Stat Card Component with animations
const StatCard = ({ icon, title, subtitle, value, color, badge, onClick, testId, delay, warning }) => {
  const colorClasses = {
    blue: { bg: 'from-blue-500 to-blue-600', icon: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
    green: { bg: 'from-green-500 to-green-600', icon: 'bg-green-100 text-green-600', border: 'border-green-200' },
    red: { bg: 'from-red-500 to-red-600', icon: 'bg-red-100 text-red-600', border: 'border-red-200' },
    yellow: { bg: 'from-yellow-500 to-yellow-600', icon: 'bg-yellow-100 text-yellow-600', border: 'border-yellow-200' },
  };

  return (
    <motion.div
      variants={fadeInUp}
      className={`bg-white rounded-2xl shadow-lg p-6 ${onClick ? 'cursor-pointer' : ''} border-2 ${colorClasses[color].border} hover:shadow-2xl transition-shadow relative overflow-hidden group`}
      onClick={onClick}
      data-testid={testId}
      whileHover={{ y: -5, scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color].bg} opacity-0 group-hover:opacity-5 transition-opacity`}
        initial={false}
      />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <motion.div 
          className={`p-3 rounded-xl ${colorClasses[color].icon} shadow-sm`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6 }}
        >
          {icon}
        </motion.div>
        {badge && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full"
          >
            {badge}
          </motion.span>
        )}
      </div>
      <motion.h3 
        className="text-3xl font-bold text-gray-900 dark:text-white mb-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: delay + 0.2 }}
      >
        {value}
      </motion.h3>
      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{title}</p>
      <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>
      {warning && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-orange-600 font-medium mt-2 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          Running low on contacts
        </motion.p>
      )}
    </motion.div>
  );
};

// Quick Action Card Component
const QuickActionCard = ({ icon, title, description, color, onClick, testId, delay }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    red: 'from-red-500 to-red-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
  };

  return (
    <motion.button
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all text-left group relative overflow-hidden"
      data-testid={testId}
      variants={fadeInUp}
      whileHover={{ y: -8, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${colorClasses[color]} opacity-0 group-hover:opacity-5 transition-opacity`}
        initial={false}
      />
      <motion.div 
        className={`p-4 bg-gradient-to-br ${colorClasses[color]} rounded-xl w-fit mb-4 shadow-lg`}
        whileHover={{ rotate: 360, scale: 1.1 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-white">{icon}</span>
      </motion.div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <motion.div
        className="mt-3 flex items-center text-blue-600 font-medium text-sm"
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Get Started →
      </motion.div>
    </motion.button>
  );
};

export default RenterDashboard;