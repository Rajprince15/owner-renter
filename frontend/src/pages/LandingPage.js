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
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                India's First
                <span className="block text-primary-200">Trust-First Rental Marketplace</span>
              </h1>
              
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                No scams. No fake listings. Verified properties + Lifestyle search + Reverse marketplace. 
                <span className="block mt-2 font-semibold text-white">We monetize trust, not ads.</span>
              </p>

              {/* Quick Search Bar */}
              <div className="bg-white rounded-2xl shadow-2xl p-4 mb-8" data-testid="quick-search-bar">
                <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Enter city (e.g., Bangalore)"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-slate-900"
                      data-testid="search-city-input"
                    />
                  </div>
                  
                  <select
                    value={searchBHK}
                    onChange={(e) => setSearchBHK(e.target.value)}
                    className="px-4 py-3 rounded-lg border border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none text-slate-900"
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
      <section className="py-20 bg-white" data-testid="features-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Why Choose Homer?
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              India's first rental marketplace built on trust, transparency, and lifestyle compatibility
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 - Trust & Verification */}
            <div className="bg-slate-50 rounded-2xl p-8 hover-lift" data-testid="feature-trust">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Trust & Verification
              </h3>
              <p className="text-slate-600 mb-6">
                Every property and user goes through our rigorous verification process. Connect with confidence knowing you're dealing with verified renters and owners.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Document verification for all parties</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Background checks on properties</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Verified badge for trusted users</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 - Lifestyle Search */}
            <div className="bg-slate-50 rounded-2xl p-8 hover-lift" data-testid="feature-lifestyle">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Lifestyle Search
              </h3>
              <p className="text-slate-600 mb-6">
                Find homes that match your lifestyle, not just your budget. Search by air quality, noise levels, walkability, and nearby amenities.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Air Quality Index (AQI) scores</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Noise level measurements</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Walkability & safety scores</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 - Reverse Marketplace */}
            <div className="bg-slate-50 rounded-2xl p-8 hover-lift" data-testid="feature-marketplace">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Reverse Marketplace
              </h3>
              <p className="text-slate-600 mb-6">
                Premium renters create profiles for verified owners to discover. Get approached by owners with properties that match your needs.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Anonymous profile browsing</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Owners contact you directly</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Privacy-first approach</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-slate-50" id="how-it-works" data-testid="how-it-works-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </div>

          {/* For Renters */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">For Renters</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Sign Up & Verify</h4>
                <p className="text-slate-600">
                  Create your account and complete verification to unlock premium features and build trust with owners.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Search & Shortlist</h4>
                <p className="text-slate-600">
                  Use lifestyle filters to find homes that match your preferences. Shortlist properties and compare options.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Connect & Move In</h4>
                <p className="text-slate-600">
                  Chat directly with verified owners, schedule visits, and finalize your perfect rental home.
                </p>
              </div>
            </div>
          </div>

          {/* For Owners */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center">For Property Owners</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">List Your Property</h4>
                <p className="text-slate-600">
                  Create a detailed listing with photos, amenities, and pricing. Get verified for maximum visibility.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Get Discovered</h4>
                <p className="text-slate-600">
                  Reach verified renters actively searching. Access the reverse marketplace to find ideal tenants.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">Close the Deal</h4>
                <p className="text-slate-600">
                  Chat with interested renters, schedule viewings, and find your perfect tenant quickly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-20 bg-white" data-testid="pricing-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Freemium Pricing: Free & Limited vs. Paid & Powerful
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We monetize <span className="font-bold text-primary-600">trust and access</span>, not ads. 
              Start free, upgrade when ready.
            </p>
          </div>

          {/* RENTER PRICING */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center">
              <Search className="w-6 h-6 mr-2 text-primary-600" />
              For Renters
            </h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Renter */}
              <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200">
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Free Browser</h4>
                  <div className="text-4xl font-bold text-slate-900 mb-2">₹0</div>
                  <p className="text-slate-600">Forever Free</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Unlimited browsing of all listings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Basic filters (Price, BHK, Location)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 font-semibold">5 property contacts maximum</span>
                  </li>
                  <li className="flex items-start text-slate-400">
                    <span className="mr-3">✗</span>
                    <span>No lifestyle search</span>
                  </li>
                  <li className="flex items-start text-slate-400">
                    <span className="mr-3">✗</span>
                    <span>No reverse marketplace profile</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" to="/signup">
                  Start Free
                </Button>
              </div>

              {/* Premium Renter - Highlighted */}
              <div className="bg-gradient-primary rounded-2xl p-8 border-2 border-primary-600 relative shadow-2xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
                <div className="text-center mb-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">Premium Renter</h4>
                  <div className="text-4xl font-bold mb-2">₹750</div>
                  <p className="text-primary-100">One-time • 90 days</p>
                </div>
                <ul className="space-y-3 mb-8 text-white">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">Unlimited property contacts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Verified Renter badge</strong> (after document upload)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Advanced Lifestyle Search</strong> (AQI, noise, walkability)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Reverse Marketplace</strong> - Let owners find you</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Natural language search with AI</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full bg-white text-primary-600 hover:bg-primary-50" to="/signup">
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>

          {/* OWNER PRICING */}
          <div>
            <h3 className="text-2xl font-bold text-slate-900 mb-8 text-center flex items-center justify-center">
              <Home className="w-6 h-6 mr-2 text-green-600" />
              For Property Owners
            </h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Owner */}
              <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200">
                <div className="text-center mb-6">
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Free Lister</h4>
                  <div className="text-4xl font-bold text-slate-900 mb-2">₹0</div>
                  <p className="text-slate-600">List for Free</p>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">List property for free</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Visible in search results</span>
                  </li>
                  <li className="flex items-start text-amber-600">
                    <span className="mr-3 font-bold">⚠</span>
                    <span className="font-semibold">"Not Verified" warning badge</span>
                  </li>
                  <li className="flex items-start text-slate-400">
                    <span className="mr-3">✗</span>
                    <span>Ranked at bottom of search</span>
                  </li>
                  <li className="flex items-start text-slate-400">
                    <span className="mr-3">✗</span>
                    <span>No lifestyle data</span>
                  </li>
                  <li className="flex items-start text-slate-400">
                    <span className="mr-3">✗</span>
                    <span>Not discoverable in lifestyle search</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" to="/signup">
                  List Free
                </Button>
              </div>

              {/* Verified Owner - Highlighted */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 border-2 border-green-600 relative shadow-2xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                    RECOMMENDED
                  </span>
                </div>
                <div className="text-center mb-6 text-white">
                  <h4 className="text-2xl font-bold mb-2">Verified Lister</h4>
                  <div className="text-4xl font-bold mb-2">₹2,000</div>
                  <p className="text-green-100">One-time per property</p>
                </div>
                <ul className="space-y-3 mb-8 text-white">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="font-semibold">"Verified Property" badge 🏆</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Top search ranking</strong> (above all free listings)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Lifestyle data enrichment</strong> (AQI, noise, walkability)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span>Discoverable in premium lifestyle searches</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span><strong>Reverse Marketplace access</strong> - Browse verified renters</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <span>5-10X more inquiries</span>
                  </li>
                </ul>
                <Button variant="secondary" className="w-full bg-white text-green-600 hover:bg-green-50" to="/signup">
                  Get Verified
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Feature Comparison Matrix
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              See exactly what you get with each tier
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
            <table className="w-full bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-bold">Feature</th>
                  <th className="px-6 py-4 text-center font-bold">Free Renter</th>
                  <th className="px-6 py-4 text-center font-bold bg-primary-600">Premium Renter<br/><span className="text-sm font-normal">(₹750/90 days)</span></th>
                  <th className="px-6 py-4 text-center font-bold">Free Owner</th>
                  <th className="px-6 py-4 text-center font-bold bg-green-600">Verified Owner<br/><span className="text-sm font-normal">(₹2,000/property)</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Browse All Listings</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-primary-50"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-green-50">—</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Property Contacts</td>
                  <td className="px-6 py-4 text-center">5 max</td>
                  <td className="px-6 py-4 text-center bg-primary-50 font-bold text-primary-600">Unlimited</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-green-50">—</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Search Filters</td>
                  <td className="px-6 py-4 text-center">Basic only</td>
                  <td className="px-6 py-4 text-center bg-primary-50 font-bold text-primary-600">Basic + Lifestyle</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-green-50">—</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Verification Badge</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-amber-600">⚠ "Not Verified"</td>
                  <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-600">✓ Verified</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Search Ranking</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50">—</td>
                  <td className="px-6 py-4 text-center text-red-600">Bottom</td>
                  <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-600">Top Priority</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Lifestyle Data (AQI, Noise, Walkability)</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-green-50"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Reverse Marketplace Access</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-green-50"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Natural Language AI Search</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50"><CheckCircle className="w-6 h-6 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-green-50">—</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-medium">Expected Visibility/Inquiries</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50">—</td>
                  <td className="px-6 py-4 text-center text-red-600">10% of verified</td>
                  <td className="px-6 py-4 text-center bg-green-50 font-bold text-green-600">5-10X more</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-12 text-center">
            <p className="text-lg text-slate-600 mb-6">
              💡 <strong>Our Philosophy:</strong> We monetize <span className="text-primary-600 font-bold">trust and access</span>, not ads. 
              Start free, upgrade when you see the value.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-50" data-testid="testimonials-section">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Join thousands of happy renters and owners
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">
                "Homer's lifestyle search helped me find a quiet 2BHK near a park with great air quality. The verification process gave me confidence in the owner."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold">PS</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Priya Sharma</div>
                  <div className="text-sm text-slate-600">Software Engineer, Bangalore</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">
                "As a property owner, getting my property verified was worth it. I got 3X more inquiries and found a verified renter within a week!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">AP</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Amit Patel</div>
                  <div className="text-sm text-slate-600">Property Owner, Mumbai</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-700 mb-6 italic">
                "The reverse marketplace feature is genius! Owners contacted me with properties matching my exact requirements. Saved so much time!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">RK</span>
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Raj Kumar</div>
                  <div className="text-sm text-slate-600">Marketing Manager, Delhi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Real Success Stories
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
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
              <p className="text-slate-700 font-semibold mb-2">Match Success Rate</p>
              <p className="text-sm text-slate-600">
                Of verified renters found their ideal home within 2 weeks
              </p>
            </div>

            {/* Success Stat 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-green-600 mb-2">Zero</div>
              <p className="text-slate-700 font-semibold mb-2">Fraud Cases</p>
              <p className="text-sm text-slate-600">
                100% verified properties mean no scams, no fake listings
              </p>
            </div>

            {/* Success Stat 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <div className="text-4xl font-bold text-purple-600 mb-2">3 Days</div>
              <p className="text-slate-700 font-semibold mb-2">Average Time</p>
              <p className="text-sm text-slate-600">
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
      <section className="py-20 bg-gradient-primary text-white" data-testid="cta-section">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {isAuthenticated 
              ? `Welcome Back, ${user?.full_name || 'User'}!` 
              : 'Ready to Find Your Perfect Home?'}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
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
