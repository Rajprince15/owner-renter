import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, Star, Shield, Search, Home, Zap, TrendingUp, Users, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

const Pricing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

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
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20" data-testid="pricing-hero">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">Transparent Pricing</h1>
            <p className="text-xl text-white opacity-90 mb-8">
              We monetize <span className="font-bold text-white">trust and access</span>, not ads. Start free, upgrade when you see the value. No hidden fees, no surprises.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Philosophy */}
      <section className="py-12 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 border border-primary-200 dark:border-primary-800 rounded-2xl p-8 transition-colors duration-200">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Why Our Pricing Model Works</h3>
              <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed">
                Traditional platforms monetize through ads, creating perverse incentives—fake listings pay better than real ones. 
                <strong className="text-primary-600 dark:text-primary-400"> Homer flips this model.</strong> We charge for trust (verification) and access (premium features). 
                This means verified properties always rank higher, and our success is tied to yours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Renter Pricing */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-primary-600 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">For Renters</h2>
            </div>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Find your perfect home with trust and transparency
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Renter */}
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg transition-colors duration-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free Browser</h3>
                <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">₹0</div>
                <p className="text-slate-600 dark:text-slate-400">Forever Free • No Credit Card</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Unlimited browsing</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">View all property listings</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Basic filters</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Price, BHK, Location</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 text-xs font-bold">5</div>
                  <div>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">5 property contacts maximum</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Contact up to 5 owners</p>
                  </div>
                </li>
                <li className="flex items-start text-slate-400 dark:text-slate-600">
                  <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>No lifestyle search</span>
                </li>
                <li className="flex items-start text-slate-400 dark:text-slate-600">
                  <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>No reverse marketplace profile</span>
                </li>
                <li className="flex items-start text-slate-400 dark:text-slate-600">
                  <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>No verified renter badge</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full" onClick={() => handleGetStarted('renter')}>
                Start Free
              </Button>
            </div>

            {/* Premium Renter */}
            <div className="bg-gradient-primary rounded-2xl p-8 border-2 border-primary-600 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold flex items-center">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  MOST POPULAR
                </span>
              </div>

              <div className="text-center mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Premium Renter</h3>
                <div className="text-5xl font-bold mb-2">₹750</div>
                <p className="text-primary-100">One-time • 90 days validity</p>
              </div>

              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Unlimited property contacts</span>
                    <p className="text-sm text-primary-100">Connect with as many owners as you need</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Verified Renter badge</span>
                    <p className="text-sm text-primary-100">After document verification</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Advanced Lifestyle Search</span>
                    <p className="text-sm text-primary-100">AQI, noise levels, walkability scores</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Reverse Marketplace profile</span>
                    <p className="text-sm text-primary-100">Let owners discover and contact you</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Natural language AI search</span>
                    <p className="text-sm text-primary-100">Search like you talk</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Priority support</span>
                    <p className="text-sm text-primary-100">Faster response times</p>
                  </div>
                </li>
              </ul>

              <Button variant="secondary" className="w-full bg-white text-primary-600 hover:bg-primary-50" onClick={() => handleGetStarted('renter')}>
                Upgrade to Premium
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Owner Pricing */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Home className="w-8 h-8 text-green-600 dark:text-green-400 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">For Property Owners</h2>
            </div>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Find verified tenants faster with trust and visibility
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Owner */}
            <div className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-8 shadow-lg transition-colors duration-200">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Free Lister</h3>
                <div className="text-5xl font-bold text-slate-900 dark:text-white mb-2">₹0</div>
                <p className="text-slate-600 dark:text-slate-400">List for Free • Forever</p>
              </div>

              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">List property for free</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">No listing fees</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-slate-900 dark:text-white">Visible in search results</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Renters can find your listing</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <div className="w-5 h-5 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 text-lg">⚠</div>
                  <div>
                    <span className="font-semibold text-amber-600 dark:text-amber-400">"Not Verified" warning badge</span>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Lower trust signal to renters</p>
                  </div>
                </li>
                <li className="flex items-start text-red-600 dark:text-red-400">
                  <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Ranked at bottom of search</span>
                    <p className="text-sm text-red-500 dark:text-red-400">Below all verified properties</p>
                  </div>
                </li>
                <li className="flex items-start text-slate-400 dark:text-slate-600">
                  <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>No lifestyle data enrichment</span>
                </li>
                <li className="flex items-start text-slate-400 dark:text-slate-600">
                  <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Not discoverable in lifestyle search</span>
                </li>
                <li className="flex items-start text-slate-400 dark:text-slate-600">
                  <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <span>No reverse marketplace access</span>
                </li>
              </ul>

              <Button variant="outline" className="w-full" onClick={() => handleGetStarted('owner')}>
                List Free
              </Button>
            </div>

            {/* Verified Owner */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-8 border-2 border-green-600 shadow-2xl relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-sm font-bold flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  RECOMMENDED
                </span>
              </div>

              <div className="text-center mb-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Verified Lister</h3>
                <div className="text-5xl font-bold mb-2">₹2,000</div>
                <p className="text-green-100">One-time per property • Lifetime validity</p>
              </div>

              <ul className="space-y-4 mb-8 text-white">
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">"Verified Property" badge 🏆</span>
                    <p className="text-sm text-green-100">Build instant trust with renters</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Top search ranking</span>
                    <p className="text-sm text-green-100">Always appear above free listings</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Lifestyle data enrichment</span>
                    <p className="text-sm text-green-100">AQI, noise, walkability automatically calculated</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Discoverable in lifestyle searches</span>
                    <p className="text-sm text-green-100">Premium renters can find you</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Reverse Marketplace access</span>
                    <p className="text-sm text-green-100">Browse and contact verified renters</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">5-10X more inquiries</span>
                    <p className="text-sm text-green-100">Verified listings get dramatically more views</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Check className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Priority support</span>
                    <p className="text-sm text-green-100">Dedicated assistance</p>
                  </div>
                </li>
              </ul>

              <Button variant="secondary" className="w-full bg-white text-green-600 hover:bg-green-50" onClick={() => handleGetStarted('owner')}>
                Get Verified
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Complete Feature Comparison
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              See exactly what you get with each tier
            </p>
          </div>

          <div className="max-w-6xl mx-auto overflow-x-auto">
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
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Browse All Listings</td>
                  <td className="px-6 py-4 text-center"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">—</td>
                  <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30 text-slate-700 dark:text-slate-300">—</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Property Contacts</td>
                  <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">5 max</td>
                  <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30 font-bold text-primary-600 dark:text-primary-400">Unlimited</td>
                  <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">—</td>
                  <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30 text-slate-700 dark:text-slate-300">—</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Search Filters</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-700 dark:text-slate-300">Basic only</td>
                  <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30 font-bold text-primary-600 dark:text-primary-400 text-sm">Basic + Lifestyle</td>
                  <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">—</td>
                  <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30 text-slate-700 dark:text-slate-300">—</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Verification Badge</td>
                  <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-amber-600 dark:text-amber-400 text-sm">⚠ "Not Verified"</td>
                  <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30 font-bold text-green-600 dark:text-green-400">✓ Verified</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Search Ranking</td>
                  <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30 text-slate-700 dark:text-slate-300">—</td>
                  <td className="px-6 py-4 text-center text-red-600 dark:text-red-400 font-semibold">Bottom</td>
                  <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30 font-bold text-green-600 dark:text-green-400">Top Priority</td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Lifestyle Data</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Reverse Marketplace</td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /></td>
                  <td className="px-6 py-4 text-center">—</td>
                  <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30"><CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-slate-50 dark:hover:bg-slate-600">
                  <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-100">Expected Visibility</td>
                  <td className="px-6 py-4 text-center text-slate-700 dark:text-slate-300">—</td>
                  <td className="px-6 py-4 text-center bg-primary-50 dark:bg-primary-900/30 text-slate-700 dark:text-slate-300">—</td>
                  <td className="px-6 py-4 text-center text-red-600 dark:text-red-400 text-sm">10% of verified</td>
                  <td className="px-6 py-4 text-center bg-green-50 dark:bg-green-900/30 font-bold text-green-600 dark:text-green-400">5-10X more</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ROI Section */}
      <section className="py-20 bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Return on Investment
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              How quickly does Homer pay for itself?
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Renter ROI */}
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl p-8 transition-colors duration-200">
              <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">For Renters: ₹750 Investment</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center py-2 border-b border-primary-200 dark:border-primary-700">
                  <span>Save on broker fees:</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">₹10,000+</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-primary-200 dark:border-primary-700">
                  <span>Avoid scam losses:</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">₹5,000+</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-primary-200 dark:border-primary-700">
                  <span>Time saved (30+ hours):</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">Priceless</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-primary-600 dark:bg-primary-500 text-white rounded-lg px-4 mt-4">
                  <span className="font-bold">Net Benefit:</span>
                  <span className="font-bold text-xl">₹15,000+</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
                  <strong>20X return</strong> on your investment
                </p>
              </div>
            </div>

            {/* Owner ROI */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-2xl p-8 transition-colors duration-200">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">For Owners: ₹2,000 Investment</h3>
              <div className="space-y-4 text-slate-700 dark:text-slate-300">
                <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-700">
                  <span>Find tenant faster:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">7-10 days vs 45 days</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-700">
                  <span>Save rent loss (35 days):</span>
                  <span className="font-bold text-green-600 dark:text-green-400">₹25,000+</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-green-200 dark:border-green-700">
                  <span>Quality verified tenants:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">Lower risk</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-600 dark:bg-green-500 text-white rounded-lg px-4 mt-4">
                  <span className="font-bold">Net Benefit:</span>
                  <span className="font-bold text-xl">₹25,000+</span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-4">
                  <strong>12X return</strong> on your investment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-800 transition-colors duration-200">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 transition-colors duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Can I upgrade from free to premium later?</h3>
              <p className="text-slate-600 dark:text-slate-300">Yes! You can upgrade anytime. Your contact history is preserved, and premium features activate immediately.</p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 transition-colors duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Is verification mandatory?</h3>
              <p className="text-slate-600 dark:text-slate-300">No. You can use Homer without verification. However, verified users get significantly better results—verified properties get 5-10X more inquiries, and verified renters are prioritized by owners.</p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 transition-colors duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">What if I don't find a property within 90 days?</h3>
              <p className="text-slate-600 dark:text-slate-300">While 92% of our premium users find properties within 2 weeks, if you don't find a match, contact support for a pro-rated refund or extension.</p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 transition-colors duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Do I need to pay ₹2,000 for each property listing?</h3>
              <p className="text-slate-600 dark:text-slate-300">Yes, verification is per property. This ensures every listing undergoes thorough checks. However, once verified, it remains verified—no annual fees.</p>
            </div>

            <div className="bg-white dark:bg-slate-700 rounded-xl p-6 transition-colors duration-200">
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Are there any hidden charges?</h3>
              <p className="text-slate-600 dark:text-slate-300">Absolutely none. Homer's pricing is fully transparent. What you see is what you pay. No commissions, no finder's fees, no surprises.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white opacity-90 mb-8 max-w-2xl mx-auto">
            Start free today. Upgrade when you see the value. No commitment, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" to="/signup" className="bg-white text-primary-600 hover:bg-primary-50">
              Create Free Account
            </Button>
            <Button variant="outline" size="lg" to="/search" className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600">
              Browse Properties
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
