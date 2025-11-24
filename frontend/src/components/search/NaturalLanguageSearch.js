import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import Button from '../common/Button';

const NaturalLanguageSearch = ({ onSearch, isPremium = false }) => {
  const [query, setQuery] = useState('');
  const [extractedFilters, setExtractedFilters] = useState(null);

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

  const handleSearch = () => {
    if (!query.trim()) return;

    const filters = parseNaturalLanguage(query);
    setExtractedFilters(filters);
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

  return (
    <div data-testid="natural-language-search" className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">
          Natural Language Search
        </h3>
        {isPremium && (
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
            Premium
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600">
        Describe your ideal home in plain English. Our AI will understand and find matching properties.
      </p>

      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="E.g., quiet 2bhk near park under 25000"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            data-testid="nl-search-input"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 px-6"
          data-testid="nl-search-btn"
        >
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Example Queries */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 font-medium">Try these examples:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((example, index) => (
            <button
              key={index}
              onClick={() => setQuery(example)}
              className="text-xs bg-white hover:bg-blue-50 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-300 transition-colors"
              data-testid={`example-query-${index}`}
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {/* Extracted Filters Display */}
      {extractedFilters && Object.keys(extractedFilters).length > 0 && (
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Understood filters:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(extractedFilters).map(([key, value]) => (
              <span
                key={key}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full"
              >
                {key}: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NaturalLanguageSearch;
