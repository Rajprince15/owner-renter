import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Filter, Download, ChevronLeft, RefreshCw,
  DollarSign, TrendingUp, Calendar, FileText
} from 'lucide-react';
import { 
  getAllTransactions, 
  getTransactionDetail,
  refundTransaction,
  getRevenueReport,
  logAdminAction 
} from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import TransactionTable from '../../components/admin/TransactionTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { useToast } from '../../context/ToastContext';

const TransactionManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [revenueReport, setRevenueReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    transaction_type: 'all',
    payment_status: 'all',
    date_from: '',
    date_to: '',
    user_id: ''
  });
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [transactionToRefund, setTransactionToRefund] = useState(null);
  const [refundReason, setRefundReason] = useState('');

  useEffect(() => {
    if (!user?.is_admin) {
      navigate('/login');
      return;
    }
    loadTransactions();
    loadRevenueReport();
  }, [user, navigate, filters]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await getAllTransactions(filters);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      showToast('Failed to load transactions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueReport = async () => {
    try {
      const response = await getRevenueReport(filters);
      setRevenueReport(response.data);
    } catch (error) {
      console.error('Error loading revenue report:', error);
    }
  };

  const handleRefund = (transaction) => {
    setTransactionToRefund(transaction);
    setRefundReason('');
    setShowRefundModal(true);
  };

  const confirmRefund = async () => {
    try {
      await refundTransaction(transactionToRefund.transaction_id, refundReason);
      logAdminAction(user.user_id, 'transaction_refund', 'transaction', transactionToRefund.transaction_id, {
        amount: transactionToRefund.amount,
        reason: refundReason
      });
      showToast('Transaction refunded successfully', 'success');
      setShowRefundModal(false);
      setTransactionToRefund(null);
      setRefundReason('');
      loadTransactions();
      loadRevenueReport();
    } catch (error) {
      console.error('Error refunding transaction:', error);
      showToast('Failed to refund transaction', 'error');
    }
  };

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'User ID', 'Type', 'Amount', 'Currency', 'Status', 'Gateway', 'Date'];
    const rows = transactions.map(t => [
      t.transaction_id,
      t.user_id,
      t.transaction_type,
      t.amount,
      t.currency,
      t.payment_status,
      t.payment_gateway,
      new Date(t.created_at).toLocaleDateString()
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    showToast('Transactions exported to CSV', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" data-testid="transaction-management">
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
              <h1 className="text-3xl font-bold text-gray-900">Transaction Management</h1>
              <p className="text-gray-600 mt-1">
                View and manage all transactions ({transactions.length} total)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  loadTransactions();
                  loadRevenueReport();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                data-testid="refresh-button"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
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
        </div>

        {/* Revenue Report Cards */}
        {revenueReport && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Total Revenue</h3>
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenueReport.totalRevenue.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Subscriptions</h3>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenueReport.revenueByType.renter_subscription.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Verifications</h3>
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenueReport.revenueByType.property_verification.toLocaleString()}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-600">Refunded</h3>
                <Calendar className="w-5 h-5 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                ₹{revenueReport.refundedAmount.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Transaction Type Filter */}
            <select
              value={filters.transaction_type}
              onChange={(e) => setFilters({ ...filters, transaction_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="transaction-type-filter"
            >
              <option value="all">All Types</option>
              <option value="renter_subscription">Renter Subscription</option>
              <option value="property_verification">Property Verification</option>
            </select>

            {/* Payment Status Filter */}
            <select
              value={filters.payment_status}
              onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="payment-status-filter"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>

            {/* Date From */}
            <input
              type="date"
              placeholder="Date From"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="date-from-filter"
            />

            {/* Date To */}
            <input
              type="date"
              placeholder="Date To"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="date-to-filter"
            />

            {/* User ID */}
            <input
              type="text"
              placeholder="User ID"
              value={filters.user_id}
              onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="user-id-filter"
            />
          </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white rounded-lg shadow">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No transactions found</p>
            </div>
          ) : (
            <TransactionTable
              transactions={transactions}
              onRefund={handleRefund}
            />
          )}
        </div>
      </div>

      {/* Refund Modal */}
      {showRefundModal && transactionToRefund && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-testid="refund-modal">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Refund Transaction</h2>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                <strong>Transaction ID:</strong> {transactionToRefund.transaction_id}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Amount:</strong> ₹{transactionToRefund.amount}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>User ID:</strong> {transactionToRefund.user_id}
              </p>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Refund Reason
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                placeholder="Enter reason for refund..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={4}
                data-testid="refund-reason-input"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowRefundModal(false);
                  setTransactionToRefund(null);
                  setRefundReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmRefund}
                disabled={!refundReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                data-testid="confirm-refund-button"
              >
                Issue Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionManagement;
