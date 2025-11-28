import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Shield, TrendingUp, AlertCircle, Upload, X } from 'lucide-react';
import { getPropertyDetail, updateProperty } from '../../services/propertyService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { CITIES } from '../../constants/propertyConstants';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      const response = await getPropertyDetail(id);
      // Ensure all nested structures exist with defaults
      const propertyData = response.data;
      setFormData({
        ...propertyData,
        location: propertyData.location || {
          address: '',
          city: '',
          state: 'Karnataka',
          pincode: '',
          latitude: 0,
          longitude: 0,
          locality: '',
          landmarks: []
        },
        details: propertyData.details || {
          carpet_area: '',
          total_floors: '',
          floor_number: '',
          furnishing: 'semi-furnished',
          parking: { car: 0, bike: 0 },
          amenities: [],
          bathrooms: 1,
          balconies: 0,
          facing: 'north',
          age_of_property: '',
          available_from: '',
          preferred_tenants: [],
          pets_allowed: false,
          vegetarian_only: false
        },
        images: propertyData.images || [],
        video_url: propertyData.video_url || '',
        virtual_tour_url: propertyData.virtual_tour_url || ''
      });
    } catch (error) {
      console.error('Error loading property:', error);
      alert('Failed to load property');
      navigate('/owner/properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Comprehensive validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.rent || formData.rent <= 0) newErrors.rent = 'Valid rent is required';
    if (!formData.security_deposit || formData.security_deposit < 0) newErrors.security_deposit = 'Valid deposit is required';
    if (!formData.location.address.trim()) newErrors['location.address'] = 'Address is required';
    if (!formData.location.city.trim()) newErrors['location.city'] = 'City is required';
    if (!formData.location.pincode.trim()) newErrors['location.pincode'] = 'Pincode is required';
    if (!formData.location.locality.trim()) newErrors['location.locality'] = 'Locality is required';
    if (!formData.details.carpet_area || formData.details.carpet_area <= 0) {
      newErrors['details.carpet_area'] = 'Valid carpet area is required';
    }
    if (!formData.details.available_from) {
      newErrors['details.available_from'] = 'Available from date is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo(0, 0);
      return;
    }
    
    try {
      setSubmitting(true);
      // Send complete property object matching database schema
      await updateProperty(id, formData);
      alert('Property updated successfully!');
      navigate('/owner/properties');
    } catch (error) {
      console.error('Error updating property:', error);
      alert('Failed to update property. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="text-slate-600 mt-4">Loading property...</p>
        </div>
      </div>
    );
  }

  if (!formData) return null;

  const amenitiesList = [
    'lift', 'power_backup', 'security', 'water_supply', 'gym', 
    'swimming_pool', 'park', 'club_house', 'playground', 'jogging_track'
  ];

  const tenantTypesList = ['family', 'bachelor', 'company', 'students'];
  const facingOptions = ['north', 'south', 'east', 'west', 'north-east', 'north-west', 'south-east', 'south-west'];

  return (
    <div className="min-h-screen bg-slate-50" data-testid="edit-property-page">
      <div className="container-custom py-8">
        
        {/* Verification Banner for Unverified Properties */}
        {!formData.is_verified && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 rounded-lg p-6 mb-6 shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="p-2 bg-amber-100 rounded-full">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-amber-900 mb-1">
                    This Property is Not Verified
                  </h3>
                  <p className="text-sm text-amber-700 mb-3">
                    Get verified to unlock enhanced visibility, lifestyle data analysis, and access to premium renters who are actively looking for quality homes!
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/owner/verification"
                      state={{ propertyId: formData.property_id }}
                      className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Verify Now for ₹1,500
                    </Link>
                    <a
                      href="#benefits"
                      className="inline-flex items-center px-4 py-2 bg-white border border-amber-300 text-amber-700 rounded-lg font-medium hover:bg-amber-50 transition"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      See Benefits
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/owner/properties')}
            className="mb-4"
            data-testid="back-btn"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
          <h1 className="text-3xl font-bold text-slate-900 mb-2" data-testid="page-title">
            Edit Property
          </h1>
          <p className="text-slate-600">
            Update your property details
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Property Title"
                  placeholder="e.g., Spacious 2BHK Apartment in Koramangala"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
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
                  onChange={(e) => handleInputChange('description', e.target.value)}
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
                  onChange={(e) => handleInputChange('property_type', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="property-type-select"
                >
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="independent_house">Independent House</option>
                  <option value="pg">PG</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  BHK Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.bhk_type}
                  onChange={(e) => handleInputChange('bhk_type', e.target.value)}
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
                  onChange={(e) => handleInputChange('rent', parseInt(e.target.value) || 0)}
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
                  onChange={(e) => handleInputChange('security_deposit', parseInt(e.target.value) || 0)}
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
                  onChange={(e) => handleInputChange('maintenance_charges', parseInt(e.target.value) || 0)}
                  data-testid="maintenance-input"
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Full Address"
                  placeholder="e.g., 123, 4th Block, Koramangala"
                  value={formData.location.address}
                  onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
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
                  onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
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
                  onChange={(e) => handleNestedChange('location', 'state', e.target.value)}
                  data-testid="state-input"
                />
              </div>
              <div>
                <Input
                  label="Pincode"
                  placeholder="560034"
                  value={formData.location.pincode}
                  onChange={(e) => handleNestedChange('location', 'pincode', e.target.value)}
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
                  onChange={(e) => handleNestedChange('location', 'locality', e.target.value)}
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
                    handleNestedChange('location', 'landmarks', landmarks);
                  }}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="landmarks-input"
                />
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Carpet Area (sq.ft)"
                  type="number"
                  placeholder="1100"
                  value={formData.details.carpet_area}
                  onChange={(e) => handleNestedChange('details', 'carpet_area', parseInt(e.target.value) || 0)}
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
                  onChange={(e) => handleNestedChange('details', 'total_floors', parseInt(e.target.value) || 0)}
                  data-testid="total-floors-input"
                />
              </div>
              <div>
                <Input
                  label="Floor Number"
                  type="number"
                  placeholder="3"
                  value={formData.details.floor_number}
                  onChange={(e) => handleNestedChange('details', 'floor_number', parseInt(e.target.value) || 0)}
                  data-testid="floor-number-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Furnishing Status
                </label>
                <select
                  value={formData.details.furnishing}
                  onChange={(e) => handleNestedChange('details', 'furnishing', e.target.value)}
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
                  onChange={(e) => handleNestedChange('details', 'bathrooms', parseInt(e.target.value) || 0)}
                  data-testid="bathrooms-input"
                />
              </div>
              <div>
                <Input
                  label="Balconies"
                  type="number"
                  placeholder="1"
                  value={formData.details.balconies}
                  onChange={(e) => handleNestedChange('details', 'balconies', parseInt(e.target.value) || 0)}
                  data-testid="balconies-input"
                />
              </div>
              <div>
                <Input
                  label="Car Parking"
                  type="number"
                  placeholder="1"
                  value={formData.details.parking?.car || 0}
                  onChange={(e) => handleNestedChange('details', 'parking', { 
                    ...formData.details.parking, 
                    car: parseInt(e.target.value) || 0 
                  })}
                  data-testid="car-parking-input"
                />
              </div>
              <div>
                <Input
                  label="Bike Parking"
                  type="number"
                  placeholder="2"
                  value={formData.details.parking?.bike || 0}
                  onChange={(e) => handleNestedChange('details', 'parking', { 
                    ...formData.details.parking, 
                    bike: parseInt(e.target.value) || 0 
                  })}
                  data-testid="bike-parking-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Facing Direction
                </label>
                <select
                  value={formData.details.facing || 'north'}
                  onChange={(e) => handleNestedChange('details', 'facing', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="facing-select"
                >
                  {facingOptions.map(option => (
                    <option key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Input
                  label="Age of Property (years)"
                  type="number"
                  placeholder="5"
                  value={formData.details.age_of_property || ''}
                  onChange={(e) => handleNestedChange('details', 'age_of_property', parseInt(e.target.value) || 0)}
                  data-testid="age-property-input"
                />
              </div>
              <div>
                <Input
                  label="Available From"
                  type="date"
                  value={formData.details.available_from}
                  onChange={(e) => handleNestedChange('details', 'available_from', e.target.value)}
                  error={errors['details.available_from']}
                  required
                  data-testid="available-from-input"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {amenitiesList.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.details.amenities?.includes(amenity) || false}
                      onChange={(e) => {
                        const currentAmenities = formData.details.amenities || [];
                        const newAmenities = e.target.checked
                          ? [...currentAmenities, amenity]
                          : currentAmenities.filter(a => a !== amenity);
                        handleNestedChange('details', 'amenities', newAmenities);
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

            {/* Tenant Preferences */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">
                Preferred Tenants
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {tenantTypesList.map((tenant) => (
                  <label key={tenant} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.details.preferred_tenants?.includes(tenant) || false}
                      onChange={(e) => {
                        const currentTenants = formData.details.preferred_tenants || [];
                        const newTenants = e.target.checked
                          ? [...currentTenants, tenant]
                          : currentTenants.filter(t => t !== tenant);
                        handleNestedChange('details', 'preferred_tenants', newTenants);
                      }}
                      className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                      data-testid={`tenant-${tenant}`}
                    />
                    <span className="text-sm text-slate-700 capitalize">
                      {tenant}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Preferences */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.details.pets_allowed || false}
                    onChange={(e) => handleNestedChange('details', 'pets_allowed', e.target.checked)}
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
                    checked={formData.details.vegetarian_only || false}
                    onChange={(e) => handleNestedChange('details', 'vegetarian_only', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-slate-300 rounded focus:ring-primary-500"
                    data-testid="vegetarian-only-checkbox"
                  />
                  <span className="text-sm font-medium text-slate-700">Vegetarian Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Property Images */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Property Images</h2>
            
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Manage Property Images</h3>
              <p className="text-sm text-slate-600 mb-4">
                Add or remove images for your property
              </p>
              <button
                type="button"
                onClick={() => {
                  // Add sample image
                  const sampleImages = [
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'
                  ];
                  const newImage = sampleImages[Math.floor(Math.random() * sampleImages.length)];
                  handleInputChange('images', [...(formData.images || []), newImage]);
                }}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                data-testid="add-image-btn"
              >
                Add Sample Image
              </button>
            </div>

            {formData.images && formData.images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
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
                        handleInputChange('images', newImages);
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

            {/* Video and Virtual Tour URLs */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Input
                  label="Video URL (Optional)"
                  placeholder="https://youtube.com/..."
                  value={formData.video_url || ''}
                  onChange={(e) => handleInputChange('video_url', e.target.value)}
                  data-testid="video-url-input"
                />
              </div>
              <div>
                <Input
                  label="Virtual Tour URL (Optional)"
                  placeholder="https://matterport.com/..."
                  value={formData.virtual_tour_url || ''}
                  onChange={(e) => handleInputChange('virtual_tour_url', e.target.value)}
                  data-testid="virtual-tour-url-input"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/owner/properties')}
              data-testid="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              data-testid="save-changes-btn"
            >
              <Save className="w-4 h-4 mr-2" />
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
