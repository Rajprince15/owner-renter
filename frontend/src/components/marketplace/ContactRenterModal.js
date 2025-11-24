import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getMyProperties } from '../../services/propertyService';

const ContactRenterModal = ({ isOpen, onClose, renter, onSubmit }) => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadProperties();
      // Set default message
      setMessage(`Hi ${renter.anonymous_id},\n\nI have a property that might match your requirements. Would you like to know more about it?\n\nLooking forward to hearing from you!`);
    }
  }, [isOpen, renter]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getMyProperties();
      const activeProperties = response.data.filter(p => p.status === 'active');
      setProperties(activeProperties);
      
      if (activeProperties.length > 0) {
        setSelectedProperty(activeProperties[0].property_id);
      }
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProperty) {
      setError('Please select a property');
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }
    
    setError('');
    onSubmit(renter.renter_id, selectedProperty, message);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" data-testid="contact-renter-modal">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact {renter.anonymous_id}</h2>
            <p className="text-sm text-gray-600 mt-1">Select a property and write your pitch</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            data-testid="close-modal-button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Renter Info Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Renter Requirements:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>• Looking for: {renter.looking_for.join(', ')}</p>
              <p>• Budget: ₹{renter.budget_min.toLocaleString()} - ₹{renter.budget_max.toLocaleString()}/month</p>
              <p>• Preferred locations: {renter.preferred_locations.join(', ')}</p>
            </div>
          </div>

          {/* Property Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Property to Pitch *
            </label>
            {loading ? (
              <div className="text-sm text-gray-500">Loading properties...</div>
            ) : properties.length === 0 ? (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  You don't have any active properties. Please add a property first.
                </p>
              </div>
            ) : (
              <select
                value={selectedProperty}
                onChange={(e) => setSelectedProperty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                data-testid="property-select"
                required
              >
                {properties.map((property) => (
                  <option key={property.property_id} value={property.property_id}>
                    {property.title} - ₹{property.rent.toLocaleString()}/month ({property.bhk_type})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Introduce your property and why it might be a good fit..."
              data-testid="message-textarea"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Mention key features that match their requirements
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              data-testid="cancel-button"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={properties.length === 0}
              className="flex-1 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              data-testid="send-message-button"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactRenterModal;
