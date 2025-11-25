import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Heart, Target, Users, Award, CheckCircle, TrendingUp, Leaf, Home, Zap } from 'lucide-react';
import Button from '../components/common/Button';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20" data-testid="about-hero">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">About Homer</h1>
            <p className="text-xl text-white opacity-90 mb-8">
              India's first trust-first rental marketplace. We're revolutionizing how people find homes by putting trust, transparency, and lifestyle compatibility at the center of everything we do.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" to="/search" size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                Start Searching
              </Button>
              <Button variant="outline" to="/signup" size="lg" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600">
                Join Homer
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Target className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Mission</h2>
              <p className="text-xl text-slate-600">
                To eliminate fraud and scams from India's rental market by creating a verified, trust-first marketplace where genuine renters and owners can connect with confidence.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">The Problem We're Solving</h3>
              <div className="space-y-4 text-slate-700">
                <p className="leading-relaxed">
                  <strong>₹3,500+ crore</strong> is lost annually to rental fraud in India. Fake listings, broker scams, and unverified properties plague traditional rental platforms that monetize through ads—leading to fake listings dominating search results.
                </p>
                <p className="leading-relaxed">
                  Meanwhile, renters waste weeks searching, visiting properties that don't match their lifestyle needs—only to discover high pollution, noise, or poor walkability after moving in.
                </p>
                <p className="leading-relaxed">
                  <strong>Homer changes this.</strong> We monetize trust and access, not ads. Every verified property and user goes through rigorous checks. No more scams. No more fake listings. Just genuine connections.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              These principles guide everything we do at Homer
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Trust First</h3>
              <p className="text-slate-600">
                Every user and property is verified. We build trust through transparency and rigorous checks.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">User-Centric</h3>
              <p className="text-slate-600">
                We prioritize genuine user needs over ad revenue. Your success is our success.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Innovation</h3>
              <p className="text-slate-600">
                Lifestyle search, reverse marketplace—we innovate to solve real problems.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 text-center hover-lift">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Transparency</h3>
              <p className="text-slate-600">
                Clear pricing, no hidden fees, honest communication. What you see is what you get.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">What Makes Homer Different</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              We're not just another listing platform—we're a complete ecosystem built for trust
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Verification-First Approach</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Document verification for all users</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Property ownership validation</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Background checks</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Verified badge system</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Lifestyle-First Search</h3>
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
                  <span className="text-slate-700">Walkability and safety scores</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Nearby amenities mapping</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Reverse Marketplace</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Renters create profiles</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Owners browse and contact</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Privacy-first approach</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-700">Quality tenant discovery</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-slate-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Story</h2>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Beginning (2024)</h3>
                <p className="text-slate-700 leading-relaxed">
                  Homer was born from a simple frustration: after being scammed twice while searching for rental homes in Bangalore, our founder realized that traditional rental platforms had a fundamental flaw—they monetized ads, not trust. This led to fake listings flooding the market, wasting time and money for millions of honest renters and owners.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">The Innovation (2025)</h3>
                <p className="text-slate-700 leading-relaxed">
                  We launched Homer with a revolutionary model: monetize trust, not ads. By charging for verification and premium features rather than ad placements, we aligned our incentives with our users. Verified properties rise to the top. Fake listings have no place. We also introduced India's first lifestyle search—because finding a home isn't just about budget and BHK, it's about air quality, noise levels, and the neighborhood you'll call home.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Today & Tomorrow</h3>
                <p className="text-slate-700 leading-relaxed">
                  Today, we're proud to serve 50,000+ users across India, with 10,000+ verified properties and a 92% match success rate. But we're just getting started. Our vision is to become India's most trusted rental marketplace—where every listing is real, every user is verified, and finding your perfect home is as simple as it should be.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Homer by the Numbers</h2>
            <p className="text-xl text-slate-300">Our impact in India's rental market</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                50,000+
              </div>
              <p className="text-slate-300">Active Users</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-200 bg-clip-text text-transparent">
                10,000+
              </div>
              <p className="text-slate-300">Verified Properties</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-200 bg-clip-text text-transparent">
                25,000+
              </div>
              <p className="text-slate-300">Successful Matches</p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-yellow-400 to-orange-200 bg-clip-text text-transparent">
                4.8★
              </div>
              <p className="text-slate-300">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Join the Trust Revolution
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Be part of India's first trust-first rental marketplace. Whether you're looking for a home or listing a property, Homer is built for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" to="/signup" className="bg-white text-primary-600 hover:bg-primary-50">
              Get Started Free
            </Button>
            <Button variant="outline" size="lg" to="/search" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600">
              Explore Properties
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
