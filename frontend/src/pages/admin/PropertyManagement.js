import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, Edit2, Trash2, CheckCircle, Eye,
  Download, Shield, ChevronLeft, RefreshCw 
} from 'lucide-react';
import { 
  getAllProperties, 
  updateProperty, 
  deleteProperty, 
  forceVerifyProperty,
  changePropertyStatus,
  bulkDeleteProperties,
  logAdminAction 
} from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import PropertyTable from '../../components/admin/PropertyTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import DocumentViewer from '../../components/admin/DocumentViewer';
import ImageGallery from '../../components/admin/ImageGallery';
import { useToast } from '../../context/ToastContext';

const PropertyManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    verification_status: 'all',
    city: '',
    min_rent: '',
    max_rent: '',
    search: ''
  });
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [propertyToChangeStatus, setPropertyToChangeStatus] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [viewingDocuments, setViewingDocuments] = useState(null);
  const [documentViewerTitle, setDocumentViewerTitle] = useState('');
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [viewingImages, setViewingImages] = useState([]);
  const [imageGalleryTitle, setImageGalleryTitle] = useState('');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
    loadProperties();
  }, [user, navigate, filters]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await getAllProperties(filters);
      setProperties(response.data);
    } catch (error) {
      console.error('Error loading properties:', error);
      showToast('Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProperty = (propertyId) => {
    const property = properties.find(p => p.property_id === propertyId);
    setPropertyToDelete(property);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteProperty = async () => {
    try {
      await deleteProperty(propertyToDelete.property_id);
      logAdminAction(user.user_id, 'property_delete', 'property', propertyToDelete.property_id, {
        property_title: propertyToDelete.title
      });
      showToast('Property deleted successfully', 'success');
      setShowDeleteConfirm(false);
      setPropertyToDelete(null);
      loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      showToast('Failed to delete property', 'error');
    }
  };

  const handleForceVerify = async (propertyId) => {
    try {
      await forceVerifyProperty(propertyId);
      logAdminAction(user.user_id, 'property_force_verify', 'property', propertyId, {});
      showToast('Property verified successfully', 'success');
      loadProperties();
    } catch (error) {
      console.error('Error force verifying property:', error);
      showToast('Failed to verify property', 'error');
    }
  };

  const handleChangeStatus = (property, status) => {
    setPropertyToChangeStatus(property);
    setNewStatus(status);
    setShowStatusModal(true);
  };

  const handleViewDocuments = (property) => {
    if (property.verification_documents) {
      setViewingDocuments(property.verification_documents);
      setDocumentViewerTitle(`${property.title} - Verification Documents`);
      setShowDocumentViewer(true);
    }
  };

  const handleViewImages = (property) => {
    if (property.images && property.images.length > 0) {
      setViewingImages(property.images);
      setImageGalleryTitle(`${property.title} - Property Images`);
      setShowImageGallery(true);
    }
  };

  const confirmChangeStatus = async () => {
    try {
      await changePropertyStatus(propertyToChangeStatus.property_id, newStatus);
      logAdminAction(user.user_id, 'property_status_change', 'property', propertyToChangeStatus.property_id, {
        old_status: propertyToChangeStatus.status,
        new_status: newStatus
      });
      showToast('Property status updated successfully', 'success');
      setShowStatusModal(false);
      setPropertyToChangeStatus(null);
      loadProperties();
    } catch (error) {
      console.error('Error changing property status:', error);
      showToast('Failed to change status', 'error');
    }
  };

  const handleBulkDelete = () => {
    if (selectedProperties.length === 0) {
      showToast('Please select properties to delete', 'warning');
      return;
    }
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteProperties(selectedProperties);
      logAdminAction(user.user_id, 'property_bulk_delete', 'property', null, {
        count: selectedProperties.length,
        property_ids: selectedProperties
      });
      showToast(`${selectedProperties.length} properties deleted successfully`, 'success');
      setSelectedProperties([]);
      setShowBulkDeleteConfirm(false);
      loadProperties();
    } catch (error) {
      console.error('Error bulk deleting properties:', error);
      showToast('Failed to delete properties', 'error');
    }
  };

  const exportToCSV = () => {
    const headers = ['Property ID', 'Title', 'Owner ID', 'Type', 'BHK', 'Rent', 'City', 'Status', 'Verified'];
    const rows = properties.map(p => [
      p.property_id,
      p.title,
      p.owner_id,
      p.property_type,
      p.bhk_type,
      p.rent,
      p.location?.city || 'N/A',
      p.status,
      p.is_verified ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `properties_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Properties exported to CSV', 'success');
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6" 
      data-testid="property-management"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 font-medium"
            data-testid="back-to-admin-button"
            whileHover={{ x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </motion.button>
          <motion.div 
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-600"
            whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-900 flex items-center gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Property Management
                  <motion.span 
                    className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {properties.length} Properties
                  </motion.span>
                </motion.h1>
                <p className="text-gray-600 mt-2">
                  Manage all property listings and verifications with full control
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={loadProperties}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
                  data-testid="refresh-button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95, rotate: 180 }}
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </motion.button>
                <motion.button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all shadow-md"
                  data-testid="export-csv-button"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-lg shadow p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <motion.div 
              className="relative md:col-span-2"
              whileHover={{ scale: 1.02 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, locality..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                data-testid="search-input"
              />
            </motion.div>

            {/* Status Filter */}
            <motion.select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="status-filter"
              whileHover={{ scale: 1.02 }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="rented">Rented</option>
            </motion.select>

            {/* Verification Filter */}
            <motion.select
              value={filters.verification_status}
              onChange={(e) => setFilters({ ...filters, verification_status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="verification-filter"
              whileHover={{ scale: 1.02 }}
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
            </motion.select>

            {/* City */}
            <motion.input
              type="text"
              placeholder="City"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="city-filter"
              whileHover={{ scale: 1.02 }}
            />

            {/* Min Rent */}
            <motion.input
              type="number"
              placeholder="Min Rent"
              value={filters.min_rent}
              onChange={(e) => setFilters({ ...filters, min_rent: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="min-rent-filter"
              whileHover={{ scale: 1.02 }}
            />

            {/* Max Rent */}
            <motion.input
              type="number"
              placeholder="Max Rent"
              value={filters.max_rent}
              onChange={(e) => setFilters({ ...filters, max_rent: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="max-rent-filter"
              whileHover={{ scale: 1.02 }}
            />
          </div>
        </motion.div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedProperties.length > 0 && (
            <motion.div 
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-blue-900 font-semibold">
                  {selectedProperties.length} property(ies) selected
                </p>
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                    data-testid="bulk-delete-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Selected
                  </motion.button>
                  <motion.button
                    onClick={() => setSelectedProperties([])}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear Selection
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Property Table */}
        <motion.div 
          className="bg-white rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-b-2 border-blue-600"
              />
            </div>
          ) : properties.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-600">No properties found</p>
            </motion.div>
          ) : (
            <PropertyTable
              properties={properties}
              selectedProperties={selectedProperties}
              onSelectProperty={(propertyId) => {
                if (selectedProperties.includes(propertyId)) {
                  setSelectedProperties(selectedProperties.filter(id => id !== propertyId));
                } else {
                  setSelectedProperties([...selectedProperties, propertyId]);
                }
              }}
              onSelectAll={() => {
                if (selectedProperties.length === properties.length) {
                  setSelectedProperties([]);
                } else {
                  setSelectedProperties(properties.map(p => p.property_id));
                }
              }}
              onView={(propertyId) => window.open(`/property/${propertyId}`, '_blank')}
              onDelete={handleDeleteProperty}
              onForceVerify={handleForceVerify}
              onChangeStatus={handleChangeStatus}
              onViewImages={handleViewImages}
              onViewDocuments={handleViewDocuments}
            />
          )}
        </motion.div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && propertyToDelete && (
        <ConfirmDialog
          title="Delete Property"
          message={`Are you sure you want to delete "${propertyToDelete.title}"? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
          onConfirm={confirmDeleteProperty}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setPropertyToDelete(null);
          }}
        />
      )}

      {/* Bulk Delete Confirmation */}
      {showBulkDeleteConfirm && (
        <ConfirmDialog
          title="Bulk Delete Properties"
          message={`Are you sure you want to delete ${selectedProperties.length} properties? This action cannot be undone.`}
          confirmText="Delete All"
          confirmColor="red"
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDeleteConfirm(false)}
        />
      )}

      {/* Change Status Modal */}
      {showStatusModal && propertyToChangeStatus && (
        <ConfirmDialog
          title="Change Property Status"
          message={`Change status of "${propertyToChangeStatus.title}" from ${propertyToChangeStatus.status} to ${newStatus}?`}
          confirmText="Change Status"
          confirmColor="blue"
          onConfirm={confirmChangeStatus}
          onCancel={() => {
            setShowStatusModal(false);
            setPropertyToChangeStatus(null);
          }}
        />
      )}

      {/* Document Viewer */}
      <DocumentViewer
        isOpen={showDocumentViewer}
        onClose={() => {
          setShowDocumentViewer(false);
          setViewingDocuments(null);
          setDocumentViewerTitle('');
        }}
        documents={viewingDocuments}
        title={documentViewerTitle}
      />

      {/* Image Gallery */}
      <ImageGallery
        isOpen={showImageGallery}
        onClose={() => {
          setShowImageGallery(false);
          setViewingImages([]);
          setImageGalleryTitle('');
        }}
        images={viewingImages}
        title={imageGalleryTitle}
      />
    </motion.div>
  );
};

export default PropertyManagement;
