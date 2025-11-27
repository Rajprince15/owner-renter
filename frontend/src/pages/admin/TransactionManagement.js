import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    hover: { scale: 1.03, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50 p-6" 
      data-testid="transaction-management"
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
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-600"
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
                  Transaction Management
                  <motion.span 
                    className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {transactions.length} Transactions
                  </motion.span>
                </motion.h1>
                <p className="text-gray-600 mt-2">
                  View and manage all platform transactions and revenue
                </p>
              </div>
              <div className="flex gap-3">
                <motion.button
                  onClick={() => {
                    loadTransactions();
                    loadRevenueReport();
                  }}
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

        {/* Revenue Report Cards */}
        {revenueReport && (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {[
              {
                icon: DollarSign,
                label: 'Total Revenue',
                value: `₹${revenueReport.totalRevenue.toLocaleString()}`,
                color: 'green',
                bgColor: 'bg-green-100',
                iconColor: 'text-green-600'
              },
              {
                icon: TrendingUp,
                label: 'Subscriptions',
                value: `₹${revenueReport.revenueByType.renter_subscription.toLocaleString()}`,
                color: 'blue',
                bgColor: 'bg-blue-100',
                iconColor: 'text-blue-600'
              },
              {
                icon: FileText,
                label: 'Verifications',
                value: `₹${revenueReport.revenueByType.property_verification.toLocaleString()}`,
                color: 'purple',
                bgColor: 'bg-purple-100',
                iconColor: 'text-purple-600'
              },
              {
                icon: Calendar,
                label: 'Refunded',
                value: `₹${revenueReport.refundedAmount.toLocaleString()}`,
                color: 'red',
                bgColor: 'bg-red-100',
                iconColor: 'text-red-600'
              }
            ].map((card, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow p-6"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                transition={{ delay: 0.3 + (index * 0.1) }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-600">{card.label}</h3>
                  <motion.div
                    className={`p-2 ${card.bgColor} rounded-lg`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                  </motion.div>
                </div>
                <motion.p 
                  className="text-2xl font-bold text-gray-900"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                >
                  {card.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Filters */}
        <motion.div 
          className="bg-white rounded-lg shadow p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Transaction Type Filter */}
            <motion.select
              value={filters.transaction_type}
              onChange={(e) => setFilters({ ...filters, transaction_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="transaction-type-filter"
              whileHover={{ scale: 1.02 }}
            >
              <option value="all">All Types</option>
              <option value="renter_subscription">Renter Subscription</option>
              <option value="property_verification">Property Verification</option>
            </motion.select>

            {/* Payment Status Filter */}
            <motion.select
              value={filters.payment_status}
              onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="payment-status-filter"
              whileHover={{ scale: 1.02 }}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </motion.select>

            {/* Date From */}
            <motion.input
              type="date"
              placeholder="Date From"
              value={filters.date_from}
              onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="date-from-filter"
              whileHover={{ scale: 1.02 }}
            />

            {/* Date To */}
            <motion.input
              type="date"
              placeholder="Date To"
              value={filters.date_to}
              onChange={(e) => setFilters({ ...filters, date_to: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="date-to-filter"
              whileHover={{ scale: 1.02 }}
            />

            {/* User ID */}
            <motion.input
              type="text"
              placeholder="User ID"
              value={filters.user_id}
              onChange={(e) => setFilters({ ...filters, user_id: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              data-testid="user-id-filter"
              whileHover={{ scale: 1.02 }}
            />
          </div>
        </motion.div>

        {/* Transaction Table */}
        <motion.div 
          className="bg-white rounded-lg shadow"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="rounded-full h-12 w-12 border-b-2 border-blue-600"
              />
            </div>
          ) : transactions.length === 0 ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-gray-600">No transactions found</p>
            </motion.div>
          ) : (
            <TransactionTable
              transactions={transactions}
              onRefund={handleRefund}
            />
          )}
        </motion.div>
      </div>

      {/* Refund Modal */}
      <AnimatePresence>
        {showRefundModal && transactionToRefund && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" 
            data-testid="refund-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-lg p-6 max-w-md w-full"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25 }}
            >
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
                <motion.button
                  onClick={() => {
                    setShowRefundModal(false);
                    setTransactionToRefund(null);
                    setRefundReason('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={confirmRefund}
                  disabled={!refundReason.trim()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="confirm-refund-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Issue Refund
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TransactionManagement;
