import React, { useState } from 'react';
import { Edit2, Trash2, CheckCircle, Home, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PropertyTable = ({ properties, onEdit, onDelete, onVerify, onChangeStatus }) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [selectedProperties, setSelectedProperties] = useState([]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedProperties = [...properties].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (sortBy === 'created_at') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    } else if (sortBy === 'rent') {
      aVal = parseFloat(aVal);
      bVal = parseFloat(bVal);
    }
    
    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const toggleSelectProperty = (propertyId) => {
    setSelectedProperties(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId)
        : [...prev, propertyId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedProperties(prev => 
      prev.length === properties.length ? [] : properties.map(p => p.property_id)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" data-testid="property-table">
      {selectedProperties.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-900">
              {selectedProperties.length} property(ies) selected
            </span>
            <button
              onClick={() => onDelete(selectedProperties)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
              data-testid="bulk-delete-properties"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedProperties.length === properties.length && properties.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300"
                />
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                Property
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('rent')}
              >
                Rent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Analytics
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedProperties.map((property) => (
              <tr key={property.property_id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedProperties.includes(property.property_id)}
                    onChange={() => toggleSelectProperty(property.property_id)}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16">
                      <img
                        src={property.images?.[0] || 'https://via.placeholder.com/150'}
                        alt={property.title}
                        className="h-16 w-16 rounded object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 line-clamp-1">{property.title}</div>
                      <div className="text-sm text-gray-500">{property.bhk_type}</div>
                      {property.is_verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 mt-1">
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">₹{property.rent.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">per month</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{property.location.locality}</div>
                  <div className="text-sm text-gray-500">{property.location.city}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                    {property.property_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={property.status}
                    onChange={(e) => onChangeStatus(property.property_id, e.target.value)}
                    className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full border-0 focus:ring-2 ${
                      property.status === 'active' ? 'bg-green-100 text-green-800' :
                      property.status === 'rented' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="rented">Rented</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{property.analytics?.total_views || 0}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {property.analytics?.total_contacts || 0} contacts
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => navigate(`/property/${property.property_id}`)}
                      className="text-gray-600 hover:text-gray-900"
                      title="View property"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(property)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit property"
                      data-testid={`edit-property-${property.property_id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {!property.is_verified && (
                      <button
                        onClick={() => onVerify(property.property_id)}
                        className="text-green-600 hover:text-green-900"
                        title="Force verify"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => onDelete([property.property_id])}
                      className="text-red-600 hover:text-red-900"
                      title="Delete property"
                      data-testid={`delete-property-${property.property_id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {properties.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No properties found</p>
        </div>
      )}
    </div>
  );
};

export default PropertyTable;
