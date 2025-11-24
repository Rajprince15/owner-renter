import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Eye, 
  MessageCircle, 
  Heart, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import AnalyticsChart from '../../components/analytics/AnalyticsChart';
import PerformanceCard from '../../components/analytics/PerformanceCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getPropertyAnalytics, getComparisonStats } from '../../services/analyticsService';
import { getPropertyDetail } from '../../services/propertyService';

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
      // Fetch property details
      const propertyResponse = await getPropertyDetail(propertyId);
      const propertyData = propertyResponse.data || propertyResponse;
      setProperty(propertyData);

      // Fetch analytics
      const analyticsResponse = await getPropertyAnalytics(propertyId);
      const analyticsData = analyticsResponse.data || analyticsResponse;
      setAnalytics(analyticsData);

      // Fetch comparison stats
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

  // Prepare chart data
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Analytics</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/owner/properties')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/owner/properties')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Properties
          </button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="analytics-title">
                Property Analytics
              </h1>
              <p className="text-lg text-gray-600">{analytics?.property_title}</p>
              <div className="flex items-center space-x-2 mt-2">
                {analytics?.verification_status ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Not Verified
                  </span>
                )}
              </div>
            </div>
            
            <Link
              to={`/property/${propertyId}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Property
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <PerformanceCard
            title="Total Views"
            value={analytics?.analytics?.total_views || 0}
            subtitle="All time views"
            icon={Eye}
            color="blue"
            data-testid="total-views-card"
          />
          
          <PerformanceCard
            title="Total Contacts"
            value={analytics?.analytics?.total_contacts || 0}
            subtitle="Interested renters"
            icon={MessageCircle}
            color="green"
            data-testid="total-contacts-card"
          />
          
          <PerformanceCard
            title="Shortlisted"
            value={analytics?.analytics?.shortlisted_count || 0}
            subtitle="Times shortlisted"
            icon={Heart}
            color="purple"
            data-testid="shortlisted-card"
          />
          
          <PerformanceCard
            title="Days on Market"
            value={getDaysOnMarket()}
            subtitle="Since listing"
            icon={Calendar}
            color="orange"
            data-testid="days-on-market-card"
          />
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{calculateConversionRate()}%</p>
            <p className="text-sm text-gray-500">Views to contacts</p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Premium Viewers</h3>
            <p className="text-3xl font-bold text-gray-900 mb-1">{calculatePremiumPercentage()}%</p>
            <p className="text-sm text-gray-500">
              {analytics?.analytics?.premium_views || 0} of {analytics?.analytics?.total_views || 0} views
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Last Viewed</h3>
            <p className="text-xl font-bold text-gray-900 mb-1">
              {analytics?.analytics?.last_viewed 
                ? new Date(analytics.analytics.last_viewed).toLocaleDateString()
                : 'Never'
              }
            </p>
            <p className="text-sm text-gray-500">Most recent activity</p>
          </div>
        </div>

        {/* Views Chart */}
        <div className="mb-8">
          <AnalyticsChart
            data={getChartData()}
            title="Property Views Over Time"
          />
        </div>

        {/* Performance Comparison */}
        {comparison && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2" />
              Performance Comparison
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Verified Properties Stats */}
              <div className="border-l-4 border-green-500 pl-4">
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
              </div>

              {/* Unverified Properties Stats */}
              <div className="border-l-4 border-yellow-500 pl-4">
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
              </div>
            </div>

            {/* Improvement Banner */}
            <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start">
                <TrendingUp className="w-8 h-8 text-green-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    Verified Properties Get {comparison.improvement_multiplier.views}X More Views!
                  </h4>
                  <p className="text-gray-700 mb-3">
                    Properties with verification badges receive significantly more attention from renters.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {comparison.improvement_multiplier.views}X more views
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {comparison.improvement_multiplier.contacts}X more contacts
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      {comparison.improvement_multiplier.shortlists}X more shortlists
                    </li>
                  </ul>
                  {!analytics?.verification_status && (
                    <Link
                      to="/owner/property-verification"
                      className="inline-block mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      Verify This Property
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tips Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">💡 Tips to Improve Performance</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Add high-quality photos to attract more views</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Complete property verification to build trust with renters</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Respond quickly to messages to improve conversion rate</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Update your property description with detailed amenities</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Consider competitive pricing based on market trends</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PropertyAnalytics;
