import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Zap
} from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [searchCity, setSearchCity] = useState('');
  const [searchBHK, setSearchBHK] = useState('');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    navigate(`/search?city=${searchCity}&bhk=${searchBHK}`);
  };

  // Handle CTA button clicks based on authentication status
  const handleGetStarted = () => {
    if (isAuthenticated) {
      // Redirect to appropriate dashboard based on user type
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
      // If user is owner or both, go to add property
      if (user?.user_type === 'owner' || user?.user_type === 'both') {
        navigate('/owner/property/add');
      } else {
        // If renter, show dashboard
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
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="text-center lg:text-left fade-in">
              <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <BadgeCheck className="w-5 h-5 text-primary-200" />
                <span className="text-sm font-medium">Trusted by 50,000+ Renters & Owners</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
                India's First
                <span className="block text-white opacity-90">Trust-First Rental Marketplace</span>
              </h1>
              
              <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto lg:mx-0">
                No scams. No fake listings. Verified properties + Lifestyle search + Reverse marketplace. 
                <span className="block mt-2 font-semibold text-white">We monetize trust, not ads.</span>
              </p>

              {/* Quick Search Bar */}
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl p-4 mb-8 transition-colors duration-200" data-testid="quick-search-bar">
                <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter city (e.g., Bangalore)"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-400 outline-none transition-colors duration-200"
                      data-testid="search-city-input"
                    />
                  </div>
                  
                  <select
                    value={searchBHK}
                    onChange={(e) => setSearchBHK(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 dark:focus:ring-primary-400 outline-none transition-colors duration-200"
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
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              </div>
            </div>

            {/* Right Column - Illustration */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Vector illustration placeholder - using decorative shapes */}
                <div className="relative w-full h-96">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-72 h-72 bg-white/10 backdrop-blur-lg rounded-3xl rotate-6 transform hover:rotate-12 transition-transform duration-500"></div>
                    <div className="absolute w-64 h-64 bg-white/20 backdrop-blur-lg rounded-3xl -rotate-6 transform hover:-rotate-12 transition-transform duration-500"></div>
                    <div className="absolute w-56 h-56 bg-gradient-to-br from-white/30 to-primary-200/30 backdrop-blur-lg rounded-3xl flex items-center justify-center">
                      <Home className="w-32 h-32 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center" data-testid="trust-indicators">
            <div className="fade-in">
              <div className="text-3xl font-bold mb-1">50K+</div>
              <div className="text-primary-200 text-sm">Active Users</div>
            </div>
            <div className="fade-in">
              <div className="text-3xl font-bold mb-1">10K+</div>
              <div className="text-primary-200 text-sm">Verified Properties</div>
            </div>
            <div className="fade-in">
              <div className="text-3xl font-bold mb-1">25K+</div>
              <div className="text-primary-200 text-sm">Successful Connections</div>
            </div>
            <div className="fade-in">
              <div className="text-3xl font-bold mb-1">4.8/5</div>
              <div className="text-primary-200 text-sm">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200" data-testid="features-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Homer?
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              India's first rental marketplace built on trust, transparency, and lifestyle compatibility
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Trust & Verification */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover-lift transition-colors duration-200" data-testid="feature-trust">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Trust & Verification
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Every property and user goes through our rigorous verification process. Connect with confidence knowing you're dealing with verified renters and owners.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Document verification for all parties</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Background checks on properties</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Verified badge for trusted users</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 - Lifestyle Search */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover-lift transition-colors duration-200" data-testid="feature-lifestyle">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Lifestyle Search
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Find homes that match your lifestyle, not just your budget. Search by air quality, noise levels, walkability, and nearby amenities.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Air Quality Index (AQI) scores</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Noise level measurements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Walkability & safety scores</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 - Reverse Marketplace */}
            <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover-lift transition-colors duration-200" data-testid="feature-marketplace">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Reverse Marketplace
              </h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Premium renters create profiles for verified owners to discover. Get approached by owners with properties that match your needs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Anonymous profile browsing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Owners contact you directly</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-slate-300">Privacy-first approach</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200" id="how-it-works" data-testid="how-it-works-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </div>

          {/* For Renters */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">For Renters</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg text-center transition-colors duration-200">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Sign Up & Verify</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Create your account and complete verification to unlock premium features and build trust with owners.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg text-center transition-colors duration-200">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Search & Shortlist</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Use lifestyle filters to find homes that match your preferences. Shortlist properties and compare options.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg text-center transition-colors duration-200">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Connect & Move In</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Chat directly with verified owners, schedule visits, and finalize your perfect rental home.
                </p>
              </div>
            </div>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">For Property Owners</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg text-center transition-colors duration-200">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">List Your Property</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Create a detailed listing with photos, amenities, and pricing. Get verified for maximum visibility.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg text-center transition-colors duration-200">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Get Discovered</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Reach verified renters actively searching. Access the reverse marketplace to find ideal tenants.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg text-center transition-colors duration-200">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Close the Deal</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Chat with interested renters, schedule viewings, and find your perfect tenant quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      {/* Pricing Preview Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200" data-testid="pricing-section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We monetize <span className="font-bold text-primary-600">trust and access</span>, not ads. 
              Start free, upgrade when you see the value.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            {/* For Renters */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl p-8 border-2 border-primary-200 dark:border-primary-800 transition-colors duration-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-4">For Renters</h3>
              <div className="space-y-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">₹0 - ₹750</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Forever free or one-time payment</p>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Free: 5 property contacts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Premium: Unlimited contacts + lifestyle search</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Get verified renter badge</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* For Owners */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800 transition-colors duration-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-4">For Property Owners</h3>
              <div className="space-y-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">₹0 - ₹2,000</div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Free listing or one-time verification</p>
                </div>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Free: List with "Not Verified" badge</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Verified: Top ranking + 5-10X more inquiries</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Access reverse marketplace</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* View Full Pricing Button */}
          <div className="text-center">
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
          </div>
        </div>
      </section>

     

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200" data-testid="testimonials-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join thousands of happy renters and owners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg transition-colors duration-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                "Homer's lifestyle search helped me find a quiet 2BHK near a park with great air quality. The verification process gave me confidence in the owner."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 dark:text-primary-300 font-bold">PS</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Priya Sharma</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Software Engineer, Bangalore</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg transition-colors duration-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                "As a property owner, getting my property verified was worth it. I got 3X more inquiries and found a verified renter within a week!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 dark:text-green-300 font-bold">AP</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Amit Patel</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Property Owner, Mumbai</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl p-8 shadow-lg transition-colors duration-200">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 italic">
                "The reverse marketplace feature is genius! Owners contacted me with properties matching my exact requirements. Saved so much time!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 dark:text-purple-300 font-bold">RK</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">Raj Kumar</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Marketing Manager, Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Real Success Stories
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              See how Homer has transformed rental experiences across India
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Success Stat 1 */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-primary-600 mb-2">92%</div>
              <p className="text-slate-700 dark:text-slate-200 font-semibold mb-2">Match Success Rate</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Of verified renters found their ideal home within 2 weeks
              </p>
            </div>

            {/* Success Stat 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">Zero</div>
              <p className="text-slate-700 dark:text-slate-200 font-semibold mb-2">Fraud Cases</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                100% verified properties mean no scams, no fake listings
              </p>
            </div>

            {/* Success Stat 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:to-purple-800 rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">3 Days</div>
              <p className="text-slate-700 dark:text-slate-200 font-semibold mb-2">Average Time</p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Verified owners find quality tenants 10X faster than traditional methods
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Growing Every Day
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Join India's fastest-growing trust-first rental marketplace
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                50,000+
              </div>
              <p className="text-slate-300">Active Users</p>
              <p className="text-xs text-slate-400 mt-1">Renters & Owners</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-200 bg-clip-text text-transparent">
                10,000+
              </div>
              <p className="text-slate-300">Verified Properties</p>
              <p className="text-xs text-slate-400 mt-1">Across 50+ Cities</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-200 bg-clip-text text-transparent">
                25,000+
              </div>
              <p className="text-slate-300">Successful Matches</p>
              <p className="text-xs text-slate-400 mt-1">Happy Connections</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-200 bg-clip-text text-transparent">
                4.8★
              </div>
              <p className="text-slate-300">Average Rating</p>
              <p className="text-xs text-slate-400 mt-1">From 12,000+ Reviews</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white" data-testid="cta-section">
        <div className="container-custom text-center">
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <Button 
              variant="outline" 
              size="lg" 
              to="/search"
              className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600"
              data-testid="cta-browse-btn"
            >
              Browse Properties
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
