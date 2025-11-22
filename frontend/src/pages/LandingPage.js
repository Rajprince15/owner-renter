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
  MapPin
} from 'lucide-react';
import Button from '../components/common/Button';

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchCity, setSearchCity] = useState('');
  const [searchBHK, setSearchBHK] = useState('');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    navigate(`/search?city=${searchCity}&bhk=${searchBHK}`);
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
                Find Your Perfect
                <span className="block text-primary-200">Rental Home</span>
              </h1>
              
              <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                Discover verified properties with lifestyle insights. Connect directly with trusted owners and renters on India's most transparent rental marketplace.
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
                >
                  <Search className="w-5 h-5 mr-2" />
                  Find a Home
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  to="/signup"
                  className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600"
                  data-testid="list-property-btn"
                >
                  <Home className="w-5 h-5 mr-2" />
                  List Property
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
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Choose the plan that works for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Free</h3>
                <div className="text-4xl font-bold text-slate-900 mb-2">₹0</div>
                <p className="text-slate-600">Forever free</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">5 property contacts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Basic search filters</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Browse all listings</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Shortlist properties</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" to="/signup">
                Get Started
              </Button>
            </div>

            {/* Premium Plan - Highlighted */}
            <div className="bg-gradient-primary rounded-2xl p-8 border-2 border-primary-600 relative transform scale-105 shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold">
                  POPULAR
                </span>
              </div>
              <div className="text-center mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Premium Renter</h3>
                <div className="text-4xl font-bold mb-2">₹750</div>
                <p className="text-primary-100">90 days access</p>
              </div>
              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Unlimited property contacts</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Verified Renter badge</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Advanced lifestyle search</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Reverse marketplace visibility</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
              </ul>
              <Button variant="secondary" className="w-full" to="/signup">
                Upgrade Now
              </Button>
            </div>

            {/* Property Verification */}
            <div className="bg-slate-50 rounded-2xl p-8 border-2 border-slate-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Property Verification</h3>
                <div className="text-4xl font-bold text-slate-900 mb-2">₹2,000</div>
                <p className="text-slate-600">One-time per property</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Property verification badge</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Lifestyle data calculation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">5X more visibility</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Priority in search results</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full" to="/signup">
                Get Verified
              </Button>
            </div>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-white" data-testid="cta-section">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Find Your Perfect Home?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join Homer today and experience India's most trusted rental marketplace
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary" 
              size="lg" 
              to="/signup"
              data-testid="cta-signup-btn"
            >
              Get Started Free
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
