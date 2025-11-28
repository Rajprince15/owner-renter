import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Eye, 
  MessageCircle, 
  Heart, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  BarChart3,
  Shield,
  Target,
  Zap,
  Award
} from 'lucide-react';
import AnalyticsChart from '../../components/analytics/AnalyticsChart';
import PerformanceCard from '../../components/analytics/PerformanceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getPropertyAnalytics, getComparisonStats } from '../../services/analyticsService';
import { getPropertyDetail } from '../../services/propertyService';
import Button from '../../components/common/Button';

const PropertyAnalytics = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, [propertyId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError('');
    
    try {
      const propertyResponse = await getPropertyDetail(propertyId);
      const propertyData = propertyResponse.data || propertyResponse;
      setProperty(propertyData);

      const analyticsResponse = await getPropertyAnalytics(propertyId);
      const analyticsData = analyticsResponse.data || analyticsResponse;
      setAnalytics(analyticsData);

      const comparisonResponse = await getComparisonStats();
      const comparisonData = comparisonResponse.data || comparisonResponse;
      setComparison(comparisonData);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const calculateConversionRate = () => {
    if (!analytics?.analytics) return 0;
    const { total_views, total_contacts } = analytics.analytics;
    if (total_views === 0) return 0;
    return ((total_contacts / total_views) * 100).toFixed(1);
  };

  const calculatePremiumPercentage = () => {
    if (!analytics?.analytics) return 0;
    const { total_views, premium_views } = analytics.analytics;
    if (total_views === 0) return 0;
    return ((premium_views / total_views) * 100).toFixed(1);
  };

  const getDaysOnMarket = () => {
    if (!analytics?.created_at) return 0;
    const created = new Date(analytics.created_at);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getChartData = () => {
    if (!analytics?.analytics?.views_history) {
      return {
        labels: [],
        values: [],
        premiumValues: []
      };
    }

    const history = analytics.analytics.views_history;
    return {
      labels: history.map(h => {
        const date = new Date(h.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      values: history.map(h => h.count),
      premiumValues: history.map(h => h.premium_count || 0)
    };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingSpinner size="xl" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/owner/properties')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          y: [0, 30, 0],
          x: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-40 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        animate={{
          y: [0, -30, 0],
          x: [0, -20, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate('/owner/properties')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Properties
          </motion.button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="analytics-title">
                Property Analytics
              </h1>
              <p className="text-lg text-gray-600">{analytics?.property_title}</p>
              <div className="flex items-center space-x-2 mt-2">
                {analytics?.verification_status ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </motion.span>
                ) : (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                  >
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Not Verified
                  </motion.span>
                )}
              </div>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={`/property/${propertyId}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                View Property
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Key Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }}>
            <PerformanceCard
              title="Total Views"
              value={analytics?.analytics?.total_views || 0}
              subtitle="All time views"
              icon={Eye}
              color="blue"
              data-testid="total-views-card"
            />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }}>
            <PerformanceCard
              title="Total Contacts"
              value={analytics?.analytics?.total_contacts || 0}
              subtitle="Interested renters"
              icon={MessageCircle}
              color="green"
              data-testid="total-contacts-card"
            />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }}>
            <PerformanceCard
              title="Shortlisted"
              value={analytics?.analytics?.shortlisted_count || 0}
              subtitle="Times shortlisted"
              icon={Heart}
              color="purple"
              data-testid="shortlisted-card"
            />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ duration: 0.3 }}>
            <PerformanceCard
              title="Days on Market"
              value={getDaysOnMarket()}
              subtitle="Since listing"
              icon={Calendar}
              color="orange"
              data-testid="days-on-market-card"
            />
          </motion.div>
        </motion.div>

        {/* Additional Metrics */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Conversion Rate</h3>
              <Target className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{calculateConversionRate()}%</p>
            <p className="text-sm text-gray-500">Views to contacts</p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Premium Viewers</h3>
              <Award className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{calculatePremiumPercentage()}%</p>
            <p className="text-sm text-gray-500">
              {analytics?.analytics?.premium_views || 0} of {analytics?.analytics?.total_views || 0} views
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03, y: -3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-600">Last Viewed</h3>
              <Zap className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xl font-bold text-gray-900 mb-1">
              {analytics?.analytics?.last_viewed 
                ? new Date(analytics.analytics.last_viewed).toLocaleDateString()
                : 'Never'
              }
            </p>
            <p className="text-sm text-gray-500">Most recent activity</p>
          </motion.div>
        </motion.div>

        {/* Verification CTA */}
        {!property?.is_verified && (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-xl p-8 mb-8 shadow-lg relative overflow-hidden"
          >
            <motion.div
              className="absolute -top-10 -right-10 w-40 h-40 bg-amber-200 rounded-full opacity-20"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="p-3 bg-amber-100 rounded-full mr-4"
                  >
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </motion.div>
                  <div>
                    <h3 className="text-2xl font-bold text-amber-900 mb-1">
                      Unlock 5X More Views
                    </h3>
                    <p className="text-amber-700">
                      Get verified to boost your property's performance and reach premium renters
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg p-4 border border-amber-200 shadow-md"
                  >
                    <div className="text-sm text-gray-600 mb-1">Your Current Views</div>
                    <div className="text-3xl font-bold text-gray-900">{analytics?.analytics?.total_views || 0}</div>
                    <div className="text-xs text-gray-500 mt-1">Unverified listing</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white shadow-lg"
                  >
                    <div className="text-sm text-green-100 mb-1">Potential with Verification</div>
                    <div className="text-3xl font-bold">{(analytics?.analytics?.total_views || 0) * 5}+</div>
                    <div className="text-xs text-green-100 mt-1">Estimated views (5X boost)</div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-lg p-4 border border-amber-200 shadow-md"
                  >
                    <div className="text-sm text-gray-600 mb-1">Additional Benefits</div>
                    <ul className="text-xs text-gray-700 space-y-1">
                      <li>✓ Top search ranking</li>
                      <li>✓ Lifestyle data</li>
                      <li>✓ Premium renters</li>
                    </ul>
                  </motion.div>
                </div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    to="/owner/verification"
                    state={{ propertyId: propertyId }}
                    variant="primary"
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 shadow-lg"
                  >
                    <Shield className="w-5 h-5 mr-2" />
                    Verify Property Now (₹2,000)
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Views Chart */}
        <motion.div variants={itemVariants} className="mb-8">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <AnalyticsChart
              data={getChartData()}
              title="Property Views Over Time"
            />
          </motion.div>
        </motion.div>

        {/* Performance Comparison */}
        {comparison && (
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Performance Comparison
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                whileHover={{ x: 5 }}
                className="border-l-4 border-green-500 pl-4 bg-green-50 rounded-r-lg p-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  Verified Properties (Average)
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Average Views</p>
                    <p className="text-2xl font-bold text-gray-900">{comparison.verified_stats.avg_views}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Contacts</p>
                    <p className="text-2xl font-bold text-gray-900">{comparison.verified_stats.avg_contacts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Shortlists</p>
                    <p className="text-2xl font-bold text-gray-900">{comparison.verified_stats.avg_shortlists}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{comparison.verified_stats.conversion_rate}%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ x: 5 }}
                className="border-l-4 border-yellow-500 pl-4 bg-yellow-50 rounded-r-lg p-4"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                  Unverified Properties (Average)
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Average Views</p>
                    <p className="text-2xl font-bold text-gray-900">{comparison.unverified_stats.avg_views}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Contacts</p>
                    <p className="text-2xl font-bold text-gray-900">{comparison.unverified_stats.avg_contacts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Shortlists</p>
                    <p className="text-2xl font-bold text-gray-900">{comparison.unverified_stats.avg_shortlists}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-gray-900">{comparison.unverified_stats.conversion_rate}%</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6"
            >
              <div className="flex items-start">
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <TrendingUp className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                </motion.div>
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Verified Properties Get {comparison.improvement_multiplier.views}X More Views!
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Properties with verification badges receive significantly more attention from renters.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-green-500 rounded-full mr-2"
                      />
                      {comparison.improvement_multiplier.views}X more views
                    </li>
                    <li className="flex items-center">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-green-500 rounded-full mr-2"
                      />
                      {comparison.improvement_multiplier.contacts}X more contacts
                    </li>
                    <li className="flex items-center">
                      <motion.span
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-green-500 rounded-full mr-2"
                      />
                      {comparison.improvement_multiplier.shortlists}X more shortlists
                    </li>
                  </ul>
                  {!analytics?.verification_status && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link
                        to="/owner/verification"
                        state={{ propertyId: propertyId }}
                        className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg"
                      >
                        Verify This Property
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.div
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-2xl mr-2">💡</span>
            Tips to Improve Performance
          </h3>
          <ul className="space-y-3">
            {[
              'Add high-quality photos to attract more views',
              'Complete property verification to build trust with renters',
              'Respond quickly to messages to improve conversion rate',
              'Update your property description with detailed amenities',
              'Consider competitive pricing based on market trends'
            ].map((tip, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5 }}
                className="flex items-start text-sm text-gray-700 bg-white rounded-lg p-3 shadow-sm"
              >
                <span className="text-blue-600 mr-3 font-bold">•</span>
                <span>{tip}</span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PropertyAnalytics;