import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import { getPropertyDetail, updateProperty } from '../../services/propertyService';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';

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
      setFormData(response.data);
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
    
    // Basic validation
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.rent || formData.rent <= 0) newErrors.rent = 'Valid rent is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setSubmitting(true);
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
                    Unverified properties get 90% fewer views and appear at the bottom of search results. 
                    Get verified to unlock 5X more views, lifestyle data, and premium renter access.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/owner/verification"
                      state={{ propertyId: formData.property_id }}
                      className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-semibold transition"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Verify Now for ₹2,000
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Property Title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  error={errors.title}
                  required
                  data-testid="title-input"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  data-testid="description-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Property Type
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
                  BHK Type
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
                  value={formData.security_deposit}
                  onChange={(e) => handleInputChange('security_deposit', parseInt(e.target.value) || 0)}
                  data-testid="deposit-input"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  value={formData.location.address}
                  onChange={(e) => handleNestedChange('location', 'address', e.target.value)}
                  data-testid="address-input"
                />
              </div>
              <div>
                <Input
                  label="City"
                  value={formData.location.city}
                  onChange={(e) => handleNestedChange('location', 'city', e.target.value)}
                  data-testid="city-input"
                />
              </div>
              <div>
                <Input
                  label="Locality"
                  value={formData.location.locality}
                  onChange={(e) => handleNestedChange('location', 'locality', e.target.value)}
                  data-testid="locality-input"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Input
                  label="Carpet Area (sq.ft)"
                  type="number"
                  value={formData.details.carpet_area}
                  onChange={(e) => handleNestedChange('details', 'carpet_area', parseInt(e.target.value) || 0)}
                  data-testid="carpet-area-input"
                />
              </div>
              <div>
                <Input
                  label="Bathrooms"
                  type="number"
                  value={formData.details.bathrooms}
                  onChange={(e) => handleNestedChange('details', 'bathrooms', parseInt(e.target.value) || 0)}
                  data-testid="bathrooms-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Furnishing
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
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end mt-6">
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
