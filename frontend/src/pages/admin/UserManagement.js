import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Edit2, Trash2, CheckCircle, XCircle, 
  Download, Shield, UserCheck, UserX, ChevronLeft 
} from 'lucide-react';
import { 
  getAllUsers, 
  updateUser, 
  deleteUser, 
  forceVerifyUser, 
  bulkDeleteUsers,
  logAdminAction 
} from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import UserTable from '../../components/admin/UserTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import DocumentViewer from '../../components/admin/DocumentViewer';
import { useToast } from '../../context/ToastContext';

const UserManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    user_type: 'all',
    subscription_tier: 'all',
    verification_status: 'all',
    is_active: undefined,
    search: ''
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [viewingDocuments, setViewingDocuments] = useState(null);
  const [documentViewerTitle, setDocumentViewerTitle] = useState('');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
    loadUsers();
  }, [user, navigate, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(filters);
      setUsers(response.data);
    } catch (error) {
      console.error('Error loading users:', error);
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleSaveUser = async () => {
    try {
      await updateUser(editingUser.user_id, editingUser);
      logAdminAction(user.user_id, 'user_edit', 'user', editingUser.user_id, {
        changes: editingUser
      });
      showToast('User updated successfully', 'success');
      setShowEditModal(false);
      loadUsers();
    } catch (error) {
      console.error('Error updating user:', error);
      showToast('Failed to update user', 'error');
    }
  };

  const handleDeleteUser = (userId) => {
    const user = users.find(u => u.user_id === userId);
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    try {
      await deleteUser(userToDelete.user_id);
      logAdminAction(user.user_id, 'user_delete', 'user', userToDelete.user_id, {
        user_email: userToDelete.email
      });
      showToast('User deleted successfully', 'success');
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast('Failed to delete user', 'error');
    }
  };

  const handleForceVerify = async (userId, verificationType) => {
    try {
      await forceVerifyUser(userId, verificationType);
      logAdminAction(user.user_id, 'user_force_verify', 'user', userId, {
        verification_type: verificationType
      });
      showToast(`User verified as ${verificationType} successfully`, 'success');
      loadUsers();
    } catch (error) {
      console.error('Error force verifying user:', error);
      showToast('Failed to verify user', 'error');
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) {
      showToast('Please select users to delete', 'warning');
      return;
    }
    setShowBulkDeleteConfirm(true);
  };

  const confirmBulkDelete = async () => {
    try {
      await bulkDeleteUsers(selectedUsers);
      logAdminAction(user.user_id, 'user_bulk_delete', 'user', null, {
        count: selectedUsers.length,
        user_ids: selectedUsers
      });
      showToast(`${selectedUsers.length} users deleted successfully`, 'success');
      setSelectedUsers([]);
      setShowBulkDeleteConfirm(false);
      loadUsers();
    } catch (error) {
      console.error('Error bulk deleting users:', error);
      showToast('Failed to delete users', 'error');
    }
  };

  const handleViewDocuments = (user) => {
    if (user.renter_verification_documents) {
      setViewingDocuments(user.renter_verification_documents);
      setDocumentViewerTitle(`${user.full_name} - Verification Documents`);
      setShowDocumentViewer(true);
    }
  };

  const exportToCSV = () => {
    const headers = ['User ID', 'Name', 'Email', 'Phone', 'Type', 'Subscription', 'Verified', 'Active'];
    const rows = users.map(u => [
      u.user_id,
      u.full_name,
      u.email,
      u.phone,
      u.user_type,
      u.subscription_tier || 'N/A',
      u.is_verified_renter || u.is_verified_owner ? 'Yes' : 'No',
      u.is_active ? 'Yes' : 'No'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Users exported to CSV', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-testid="user-management">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            data-testid="back-to-admin-button"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Dashboard
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
              <p className="text-gray-600 mt-1">
                Manage all users, renters, and owners ({users.length} total)
              </p>
            </div>
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              data-testid="export-csv-button"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                data-testid="search-input"
              />
            </div>

            {/* User Type Filter */}
            <select
              value={filters.user_type}
              onChange={(e) => setFilters({ ...filters, user_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="user-type-filter"
            >
              <option value="all">All User Types</option>
              <option value="renter">Renters</option>
              <option value="owner">Owners</option>
              <option value="both">Both</option>
            </select>

            {/* Subscription Filter */}
            <select
              value={filters.subscription_tier}
              onChange={(e) => setFilters({ ...filters, subscription_tier: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="subscription-filter"
            >
              <option value="all">All Subscriptions</option>
              <option value="free">Free</option>
              <option value="premium">Premium</option>
            </select>

            {/* Verification Filter */}
            <select
              value={filters.verification_status}
              onChange={(e) => setFilters({ ...filters, verification_status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="verification-filter"
            >
              <option value="all">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="none">Not Verified</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Active Status Filter */}
            <select
              value={filters.is_active === undefined ? 'all' : filters.is_active.toString()}
              onChange={(e) => {
                const value = e.target.value;
                setFilters({ 
                  ...filters, 
                  is_active: value === 'all' ? undefined : value === 'true' 
                });
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="active-status-filter"
            >
              <option value="all">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-blue-900 font-semibold">
                {selectedUsers.length} user(s) selected
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  data-testid="bulk-delete-button"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <UserTable
              users={users}
              selectedUsers={selectedUsers}
              onSelectUser={(userId) => {
                if (selectedUsers.includes(userId)) {
                  setSelectedUsers(selectedUsers.filter(id => id !== userId));
                } else {
                  setSelectedUsers([...selectedUsers, userId]);
                }
              }}
              onSelectAll={() => {
                if (selectedUsers.length === users.length) {
                  setSelectedUsers([]);
                } else {
                  setSelectedUsers(users.map(u => u.user_id));
                }
              }}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
              onVerify={handleForceVerify}
              onViewDocuments={handleViewDocuments}
            />
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="edit-user-modal">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={editingUser.full_name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  data-testid="edit-full-name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  data-testid="edit-email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={editingUser.phone || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  data-testid="edit-phone"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
                <select
                  value={editingUser.user_type || 'renter'}
                  onChange={(e) => setEditingUser({ ...editingUser, user_type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  data-testid="edit-user-type"
                >
                  <option value="renter">Renter</option>
                  <option value="owner">Owner</option>
                  <option value="both">Both</option>
                </select>
              </div>
              {(editingUser.user_type === 'renter' || editingUser.user_type === 'both') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Tier</label>
                  <select
                    value={editingUser.subscription_tier || 'free'}
                    onChange={(e) => setEditingUser({ ...editingUser, subscription_tier: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    data-testid="edit-subscription"
                  >
                    <option value="free">Free</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              )}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingUser.is_active || false}
                    onChange={(e) => setEditingUser({ ...editingUser, is_active: e.target.checked })}
                    className="w-4 h-4"
                    data-testid="edit-is-active"
                  />
                  <span className="text-sm font-medium text-gray-700">Active Account</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="save-user-button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && userToDelete && (
        <ConfirmDialog
          title="Delete User"
          message={`Are you sure you want to delete ${userToDelete.full_name}? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
          onConfirm={confirmDeleteUser}
          onCancel={() => {
            setShowDeleteConfirm(false);
            setUserToDelete(null);
          }}
        />
      )}

      {/* Bulk Delete Confirmation */}
      {showBulkDeleteConfirm && (
        <ConfirmDialog
          title="Bulk Delete Users"
          message={`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`}
          confirmText="Delete All"
          confirmColor="red"
          onConfirm={confirmBulkDelete}
          onCancel={() => setShowBulkDeleteConfirm(false)}
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
    </div>
  );
};

export default UserManagement;
