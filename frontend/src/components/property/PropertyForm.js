import React from 'react';
import { motion } from 'framer-motion';
import Input from '../common/Input';
import { Upload, X } from 'lucide-react';
import { CITIES, PROPERTY_TYPES } from '../../constants/propertyConstants';

const PropertyForm = ({ formData, errors, currentStep, onInputChange, onNestedChange }) => {
  
  // Step 1: Basic Info
  if (currentStep === 1) {
    return (
      <motion.div 
        className="space-y-6" 
        data-testid="form-step-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Basic Information
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Property Title"
              placeholder="e.g., Spacious 2BHK Apartment in Koramangala"
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              error={errors.title}
              required
              data-testid="title-input"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              placeholder="Describe your property, its features, and surrounding area..."
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors.description ? 'border-red-500' : 'border-slate-300'
              }`}
              data-testid="description-input"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Property Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.property_type}
              onChange={(e) => onInputChange('property_type', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              data-testid="property-type-select"
            >
              {PROPERTY_TYPES.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              BHK Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.bhk_type}
              onChange={(e) => onInputChange('bhk_type', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              data-testid="bhk-type-select"
            >
              <option value="1BHK">1BHK</option>
              <option value="2BHK">2BHK</option>
              <option value="3BHK">3BHK</option>
              <option value="4BHK+">4BHK+</option>
            </select>
          </div>
          
          <div>
            <Input
              label="Monthly Rent (₹)"
              type="number"
              placeholder="25000"
              value={formData.rent}
              onChange={(e) => onInputChange('rent', parseInt(e.target.value) || '')}
              error={errors.rent}
              required
              data-testid="rent-input"
            />
          </div>
          
          <div>
            <Input
              label="Security Deposit (₹)"
              type="number"
              placeholder="50000"
              value={formData.security_deposit}
              onChange={(e) => onInputChange('security_deposit', parseInt(e.target.value) || '')}
              error={errors.security_deposit}
              required
              data-testid="deposit-input"
            />
          </div>
          
          <div>
            <Input
              label="Maintenance Charges (₹)"
              type="number"
              placeholder="2000"
              value={formData.maintenance_charges}
              onChange={(e) => onInputChange('maintenance_charges', parseInt(e.target.value) || '')}
              data-testid="maintenance-input"
            />
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Step 2: Location
  if (currentStep === 2) {
    return (
      <motion.div 
        className="space-y-6" 
        data-testid="form-step-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Location Details
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Full Address"
              placeholder="e.g., 123, 4th Block, Koramangala"
              value={formData.location.address}
              onChange={(e) => onNestedChange('location', 'address', e.target.value)}
              error={errors['location.address']}
              required
              data-testid="address-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              City <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.location.city}
              onChange={(e) => onNestedChange('location', 'city', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                errors['location.city'] ? 'border-red-500' : 'border-slate-300'
              }`}
              data-testid="city-select"
            >
              {CITIES.map(city => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </select>
            {errors['location.city'] && (
              <p className="text-red-500 text-sm mt-1">{errors['location.city']}</p>
            )}
          </div>
          
          <div>
            <Input
              label="State"
              placeholder="Karnataka"
              value={formData.location.state}
              onChange={(e) => onNestedChange('location', 'state', e.target.value)}
              data-testid="state-input"
            />
          </div>
          
          <div>
            <Input
              label="Pincode"
              placeholder="560034"
              value={formData.location.pincode}
              onChange={(e) => onNestedChange('location', 'pincode', e.target.value)}
              error={errors['location.pincode']}
              required
              data-testid="pincode-input"
            />
          </div>
          
          <div>
            <Input
              label="Locality / Area"
              placeholder="e.g., Koramangala, Indiranagar"
              value={formData.location.locality}
              onChange={(e) => onNestedChange('location', 'locality', e.target.value)}
              error={errors['location.locality']}
              required
              data-testid="locality-input"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nearby Landmarks (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g., Forum Mall, Sony Signal, Metro Station"
              value={formData.location.landmarks?.join(', ') || ''}
              onChange={(e) => {
                const landmarks = e.target.value.split(',').map(l => l.trim()).filter(l => l);
                onNestedChange('location', 'landmarks', landmarks);
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              data-testid="landmarks-input"
            />
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Step 3: Details
  if (currentStep === 3) {
    const amenitiesList = [
      'lift', 'power_backup', 'security', 'water_supply', 'gym', 
      'swimming_pool', 'park', 'club_house', 'playground', 'jogging_track'
    ];
    
    return (
      <motion.div 
        className="space-y-6" 
        data-testid="form-step-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Property Details
        </motion.h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Input
              label="Carpet Area (sq.ft)"
              type="number"
              placeholder="1100"
              value={formData.details.carpet_area}
              onChange={(e) => onNestedChange('details', 'carpet_area', parseInt(e.target.value) || '')}
              error={errors['details.carpet_area']}
              required
              data-testid="carpet-area-input"
            />
          </div>
          
          <div>
            <Input
              label="Total Floors"
              type="number"
              placeholder="5"
              value={formData.details.total_floors}
              onChange={(e) => onNestedChange('details', 'total_floors', parseInt(e.target.value) || '')}
              error={errors['details.total_floors']}
              required
              data-testid="total-floors-input"
            />
          </div>
          
          <div>
            <Input
              label="Floor Number"
              type="number"
              placeholder="3"
              value={formData.details.floor_number}
              onChange={(e) => onNestedChange('details', 'floor_number', parseInt(e.target.value) || '')}
              data-testid="floor-number-input"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Furnishing Status
            </label>
            <select
              value={formData.details.furnishing}
              onChange={(e) => onNestedChange('details', 'furnishing', e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              data-testid="furnishing-select"
            >
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>
          
          <div>
            <Input
              label="Bathrooms"
              type="number"
              placeholder="2"
              value={formData.details.bathrooms}
              onChange={(e) => onNestedChange('details', 'bathrooms', parseInt(e.target.value) || 0)}
              data-testid="bathrooms-input"
            />
          </div>
          
          <div>
            <Input
              label="Balconies"
              type="number"
              placeholder="1"
              value={formData.details.balconies}
              onChange={(e) => onNestedChange('details', 'balconies', parseInt(e.target.value) || 0)}
              data-testid="balconies-input"
            />
          </div>
          
          <div>
            <Input
              label="Car Parking"
              type="number"
              placeholder="1"
              value={formData.details.parking.car}
              onChange={(e) => onNestedChange('details', 'parking', { ...formData.details.parking, car: parseInt(e.target.value) || 0 })}
              data-testid="car-parking-input"
            />
          </div>
          
          <div>
            <Input
              label="Bike Parking"
              type="number"
              placeholder="2"
              value={formData.details.parking.bike}
              onChange={(e) => onNestedChange('details', 'parking', { ...formData.details.parking, bike: parseInt(e.target.value) || 0 })}
              data-testid="bike-parking-input"
            />
          </div>
          
          <div>
            <Input
              label="Available From"
              type="date"
              value={formData.details.available_from}
              onChange={(e) => onNestedChange('details', 'available_from', e.target.value)}
              error={errors['details.available_from']}
              required
              data-testid="available-from-input"
            />
          </div>
        </div>
        
        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">
            Amenities
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {amenitiesList.map((amenity) => (
              <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.details.amenities.includes(amenity)}
                  onChange={(e) => {
                    const newAmenities = e.target.checked
                      ? [...formData.details.amenities, amenity]
                      : formData.details.amenities.filter(a => a !== amenity);
                    onNestedChange('details', 'amenities', newAmenities);
                  }}
                  className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                  data-testid={`amenity-${amenity}`}
                />
                <span className="text-sm text-slate-700 capitalize">
                  {amenity.replace('_', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.details.pets_allowed}
                onChange={(e) => onNestedChange('details', 'pets_allowed', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                data-testid="pets-allowed-checkbox"
              />
              <span className="text-sm font-medium text-slate-700">Pets Allowed</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.details.vegetarian_only}
                onChange={(e) => onNestedChange('details', 'vegetarian_only', e.target.checked)}
                className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                data-testid="vegetarian-only-checkbox"
              />
              <span className="text-sm font-medium text-slate-700">Vegetarian Only</span>
            </label>
          </div>
        </div>
      </motion.div>
    );
  }
  
  // Step 4: Images
  if (currentStep === 4) {
    return (
      <motion.div 
        className="space-y-6" 
        data-testid="form-step-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Property Images
        </motion.h2>
        
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">Upload Property Images</h3>
          <p className="text-sm text-slate-600 mb-4">
            Drag and drop images here, or click to browse
          </p>
          <p className="text-xs text-slate-500">
            (Image upload simulation - in production, images will be uploaded to server)
          </p>
          <button
            type="button"
            onClick={() => {
              // Simulate adding placeholder images
              const placeholderImages = [
                'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
              ];
              onInputChange('images', placeholderImages);
            }}
            className="mt-4 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
            data-testid="add-sample-images-btn"
          >
            Add Sample Images
          </button>
        </div>
        
        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Property ${index + 1}`}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = formData.images.filter((_, i) => i !== index);
                    onInputChange('images', newImages);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                  data-testid={`remove-image-${index}`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    );
  }
  
  // Step 5: Preview
  if (currentStep === 5) {
    return (
      <motion.div 
        className="space-y-6" 
        data-testid="form-step-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.h2 
          className="text-2xl font-bold text-slate-900 dark:text-white mb-4"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          Review & Submit
        </motion.h2>
        
        <div className="bg-slate-50 rounded-lg p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <PreviewItem label="Title" value={formData.title} />
              <PreviewItem label="Type" value={formData.property_type} />
              <PreviewItem label="BHK" value={formData.bhk_type} />
              <PreviewItem label="Rent" value={`₹${formData.rent?.toLocaleString()}/month`} />
              <PreviewItem label="Deposit" value={`₹${formData.security_deposit?.toLocaleString()}`} />
              <PreviewItem label="Maintenance" value={`₹${formData.maintenance_charges?.toLocaleString()}`} />
            </div>
          </div>
          
          {/* Location */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <PreviewItem label="Address" value={formData.location.address} />
              <PreviewItem label="City" value={formData.location.city} />
              <PreviewItem label="Locality" value={formData.location.locality} />
              <PreviewItem label="Pincode" value={formData.location.pincode} />
            </div>
          </div>
          
          {/* Details */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-3">Property Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <PreviewItem label="Carpet Area" value={`${formData.details.carpet_area} sq.ft`} />
              <PreviewItem label="Furnishing" value={formData.details.furnishing} />
              <PreviewItem label="Bathrooms" value={formData.details.bathrooms} />
              <PreviewItem label="Balconies" value={formData.details.balconies} />
              <PreviewItem label="Available From" value={formData.details.available_from} />
              <PreviewItem label="Parking" value={`${formData.details.parking.car} Car, ${formData.details.parking.bike} Bike`} />
            </div>
          </div>
          
          {/* Amenities */}
          {formData.details.amenities.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {formData.details.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm capitalize"
                  >
                    {amenity.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Images */}
          {formData.images.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Images ({formData.images.length})</h3>
              <div className="grid grid-cols-4 gap-2">
                {formData.images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your property will be listed as &ldquo;Unverified&rdquo; initially. 
            You can get it verified by paying ₹2000 to unlock lifestyle data and 5X more views.
          </p>
        </div>
      </motion.div>
    );
  }
  
  return null;
};

// Preview Item Component
const PreviewItem = ({ label, value }) => (
  <div>
    <p className="text-xs text-slate-500 mb-1">{label}</p>
    <p className="text-sm font-medium text-slate-900">{value || 'N/A'}</p>
  </div>
);

export default PropertyForm;
