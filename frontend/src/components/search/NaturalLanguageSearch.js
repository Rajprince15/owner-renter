import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Mic, X, TrendingUp } from 'lucide-react';
import Button from '../common/Button';

const NaturalLanguageSearch = ({ onSearch, isPremium = false }) => {
  const [query, setQuery] = useState('');
  const [extractedFilters, setExtractedFilters] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches] = useState([
    'quiet 2bhk near park under 25000',
    '3bhk in indiranagar with good air quality'
  ]);

  const parseNaturalLanguage = (text) => {
    const filters = {};
    const lowerText = text.toLowerCase();

    // Extract BHK
    const bhkMatch = lowerText.match(/(\d)\s*bhk/);
    if (bhkMatch) {
      filters.bhk = `${bhkMatch[1]}BHK`;
    }

    // Extract budget/rent
    const budgetMatch = lowerText.match(/under\s*(\d+)k?/);
    if (budgetMatch) {
      const amount = parseInt(budgetMatch[1]);
      filters.budget = amount > 1000 ? amount : amount * 1000;
    }

    // Extract location
    const locations = ['koramangala', 'indiranagar', 'whitefield', 'hsr', 'marathahalli'];
    locations.forEach(loc => {
      if (lowerText.includes(loc)) {
        filters.location = loc.charAt(0).toUpperCase() + loc.slice(1);
      }
    });

    // Extract lifestyle preferences
    if (lowerText.includes('quiet')) {
      filters.max_noise = 50;
    }
    if (lowerText.includes('low noise')) {
      filters.max_noise = 55;
    }
    if (lowerText.includes('park') || lowerText.includes('green')) {
      filters.near_parks = true;
    }
    if (lowerText.includes('good air') || lowerText.includes('low aqi')) {
      filters.max_aqi = 60;
    }
    if (lowerText.includes('walkable') || lowerText.includes('walking distance')) {
      filters.min_walkability = 70;
    }
    if (lowerText.includes('pet') || lowerText.includes('dog') || lowerText.includes('cat')) {
      filters.pet_friendly = true;
    }

    // Extract furnishing
    if (lowerText.includes('furnished')) {
      if (lowerText.includes('unfurnished')) {
        filters.furnishing = 'unfurnished';
      } else if (lowerText.includes('semi')) {
        filters.furnishing = 'semi-furnished';
      } else {
        filters.furnishing = 'furnished';
      }
    }

    return filters;
  };

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    const filters = parseNaturalLanguage(query);
    
    // Simulate API delay for animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setExtractedFilters(filters);
    setIsSearching(false);
    setShowSuggestions(false);
    onSearch(filters, query);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const exampleQueries = [
    'quiet 2bhk near park under 25000',
    '3bhk in indiranagar with good air quality',
    'furnished 1bhk under 15k walkable area',
    'pet friendly 2bhk in whitefield low noise'
  ];

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const clearQuery = () => {
    setQuery('');
    setExtractedFilters(null);
    setShowSuggestions(false);
  };

  return (
    <motion.div
      data-testid="natural-language-search"
      className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 space-y-4 shadow-lg border border-blue-100 dark:border-blue-800 relative overflow-hidden transition-colors duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-2 relative z-10"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          AI-Powered Lifestyle Search
        </h3>
        {isPremium && (
          <motion.span
            className="text-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1 rounded-full font-semibold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
          >
            Premium
          </motion.span>
        )}
      </motion.div>

      <motion.p
        className="text-sm text-gray-600 dark:text-gray-400 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Describe your ideal home naturally. Our AI will understand and find matching properties.
      </motion.p>

      {/* Search Input with Animation */}
      <motion.div
        className="relative z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <motion.div
              className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
              animate={isSearching ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 1, repeat: isSearching ? Infinity : 0, ease: "linear" }}
            >
              <Search className="w-5 h-5 text-gray-400" />
            </motion.div>
            <motion.input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="E.g., quiet 2bhk near park under 25000"
              className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner transition-all duration-200"
              data-testid="nl-search-input"
              whileFocus={{ scale: 1.01 }}
              disabled={isSearching}
            />
            {query && (
              <motion.button
                onClick={clearQuery}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5" />
              </motion.button>
            )}

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && recentSearches.length > 0 && (
                <motion.div
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="p-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      Recent Searches
                    </p>
                    {recentSearches.map((search, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setQuery(search)}
                        className="w-full text-left px-3 py-2 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors text-sm text-gray-700 dark:text-gray-300"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                      >
                        <Search className="w-3 h-3 inline mr-2 text-gray-400" />
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Voice Button (Future Enhancement) */}
          <motion.button
            className="p-4 bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50"
            disabled
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-5 h-5 text-gray-400" />
          </motion.button>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-8 py-4 text-white shadow-lg"
              data-testid="nl-search-btn"
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="w-5 h-5" />
                </motion.div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Example Queries */}
      <motion.div
        className="space-y-3 relative z-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          Try these examples:
        </p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, index) => (
            <motion.button
              key={index}
              onClick={() => setQuery(example)}
              className="text-xs bg-white dark:bg-slate-800 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 shadow-sm"
              data-testid={`example-query-${index}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.05 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {example}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Extracted Filters Display with Animation */}
      <AnimatePresence>
        {extractedFilters && Object.keys(extractedFilters).length > 0 && (
          <motion.div
            className="bg-white dark:bg-slate-800 rounded-xl p-5 border-2 border-blue-200 dark:border-blue-700 shadow-md relative z-10"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <motion.p
              className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 0.5 }}
              >
                ✓
              </motion.span>
              Understood filters:
            </motion.p>
            <motion.div
              className="flex flex-wrap gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.05
                  }
                }
              }}
            >
              {Object.entries(extractedFilters).map(([key, value], index) => (
                <motion.span
                  key={key}
                  className="text-xs bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-full font-semibold border border-blue-200 dark:border-blue-700 shadow-sm"
                  variants={{
                    hidden: { opacity: 0, scale: 0, y: 20 },
                    visible: { opacity: 1, scale: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.1, rotate: 2 }}
                >
                  {key.replace(/_/g, ' ')}: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Loading State Animation */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            className="absolute inset-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
            >
              <motion.div
                className="flex gap-2"
                animate={{
                  transition: { staggerChildren: 0.1, repeat: Infinity }
                }}
              >
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-blue-600 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [1, 0.5, 1]
                    }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.2
                    }}
                  />
                ))}
              </motion.div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Analyzing your request...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default NaturalLanguageSearch;